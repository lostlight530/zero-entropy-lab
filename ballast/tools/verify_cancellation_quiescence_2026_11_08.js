'use strict';

const fs = require('node:fs');
const path = require('node:path');

function exactlyOne(rows) { return rows.length === 1 ? rows[0] : null; }
function sameEffect(a, b) {
  return a.taskId === b.taskId && a.runId === b.runId && a.attemptId === b.attemptId &&
    a.targetUid === b.targetUid && a.childId === b.childId && a.effectId === b.effectId;
}
function belongsToIntent(e, intent) {
  return e.taskId === intent.taskId && e.runId === intent.runId && e.attemptId === intent.attemptId &&
    e.targetUid === intent.targetUid && intent.expectedChildren.includes(e.childId) &&
    intent.effectIds[e.childId] === e.effectId;
}
function fullFence(events, intent) {
  const f = exactlyOne(events.filter(e => e.type === 'SINK_FENCE'));
  if (!f) return null;
  if (f.attemptId !== intent.attemptId || f.enforcement !== 'SINK_COMMIT_CHECK' ||
      !Array.isArray(f.coveredChildren) ||
      intent.expectedChildren.some(id => !f.coveredChildren.includes(id))) return null;
  return f;
}
function queryCoversMiss(q, intent, lowerBound) {
  return q.status === 'MISS' && q.exactIdentity === true && q.coversAttempt === true &&
    belongsToIntent(q, intent) && Number.isFinite(q.at) && q.at >= lowerBound &&
    Number.isFinite(q.watermark) && q.watermark >= lowerBound &&
    Number.isFinite(q.retentionFrom) && q.retentionFrom <= intent.attemptStartedAt &&
    Number.isFinite(q.retentionUntil) && q.retentionUntil >= q.at;
}

function classify(events) {
  const intent = exactlyOne(events.filter(e => e.type === 'INTENT'));
  const cancel = exactlyOne(events.filter(e => e.type === 'CANCEL_REQUESTED'));
  const parent = exactlyOne(events.filter(e => e.type === 'PARENT_STATE'));
  if (!intent || !cancel || !parent || !Array.isArray(intent.expectedChildren) ||
      new Set(intent.expectedChildren).size !== intent.expectedChildren.length ||
      !intent.expectedChildren.length || !intent.effectIds) {
    return { decision: 'INVALID_TRACE', reason: 'missing_or_ambiguous_control_identity' };
  }
  if (cancel.taskId !== intent.taskId || cancel.runId !== intent.runId || cancel.attemptId !== intent.attemptId) {
    return { decision: 'INVALID_TRACE', reason: 'cancel_identity_mismatch' };
  }
  if (parent.taskId !== intent.taskId || parent.runId !== intent.runId || !Number.isFinite(parent.at)) {
    return { decision: 'INVALID_TRACE', reason: 'parent_state_identity_mismatch' };
  }

  const childRows = events.filter(e => e.type === 'CHILD_STATE');
  const childIds = childRows.map(e => e.childId);
  if (new Set(childIds).size !== childIds.length) return { decision: 'STOP_UNKNOWN', reason: 'duplicate_child_identity' };
  if (childIds.length !== intent.expectedChildren.length ||
      intent.expectedChildren.some(id => !childIds.includes(id)) ||
      childIds.some(id => !intent.expectedChildren.includes(id))) {
    return { decision: 'STOP_UNKNOWN', reason: 'child_membership_incomplete_or_extra' };
  }

  const queryRows = events.filter(e => e.type === 'RECEIPT_QUERY');
  const effectRows = events.filter(e => e.type === 'SINK_EFFECT');
  const validEffects = effectRows.filter(e => belongsToIntent(e, intent));
  if (validEffects.length !== effectRows.length) return { decision: 'STOP_UNKNOWN', reason: 'effect_identity_outside_intent' };

  const effectAuthorization = [];
  for (const effect of validEffects) {
    const exactQueries = queryRows.filter(q => sameEffect(q, effect));
    if (exactQueries.some(q => q.status === 'MISS')) {
      return { decision: 'EVIDENCE_CONFLICT', reason: 'sink_effect_conflicts_with_negative_query' };
    }
    if (!exactQueries.some(q => q.status === 'HIT' && q.exactIdentity === true && q.coversAttempt === true)) {
      effectAuthorization.push('RECEIPT_UNKNOWN');
    }
    const revoked = events.some(e => e.type === 'AUTHORITY_REVOKED' &&
      e.authorityId === effect.authorityId && e.subject === effect.subject && e.at <= effect.at);
    if (effect.grantState === 'INVALID' || revoked) effectAuthorization.push('INVALID');
    else if (effect.grantState !== 'VALID' || !effect.authorityId) effectAuthorization.push('UNKNOWN');
    else effectAuthorization.push('VALID');
  }
  if (effectAuthorization.includes('INVALID')) {
    return { decision: 'UNAUTHORIZED_OCCURRENCE', reason: 'at_least_one_member_effect_time_authority_invalid' };
  }
  if (effectAuthorization.includes('UNKNOWN') || effectAuthorization.includes('RECEIPT_UNKNOWN')) {
    return { decision: 'OCCURRENCE_AUTH_UNKNOWN', reason: 'effect_exists_but_member_receipt_or_historical_grant_is_incomplete' };
  }
  if (validEffects.length) {
    return { decision: 'OCCURRED_RECONCILE', reason: 'one_or_more_exact_member_effects_exist_even_though_parent_is_terminal' };
  }

  const positiveWithoutEffect = queryRows.find(q => q.status === 'HIT' && belongsToIntent(q, intent));
  if (positiveWithoutEffect) return { decision: 'OCCURRENCE_AUTH_UNKNOWN', reason: 'positive_receipt_without_effect_time_witness' };
  if (parent.state !== 'TERMINATED' && parent.state !== 'CANCELLED') {
    return { decision: 'CANCEL_PENDING', reason: 'parent_not_terminal' };
  }
  if (parent.at < cancel.at) return { decision: 'STOP_UNKNOWN', reason: 'terminal_state_predates_cancel_request' };

  const allQuiescent = childRows.every(c => c.state === 'QUIESCENT' && Number.isFinite(c.quiescedAt) && c.quiescedAt >= cancel.at);
  const fence = fullFence(events, intent);
  const inflight = events.filter(e => e.type === 'INFLIGHT_REQUEST');
  const pending = inflight.filter(e => e.status === 'PENDING');
  const rejectedWithoutFence = inflight.some(e => e.status === 'REJECTED_BY_FENCE' && (!fence || fence.at > e.at));
  if (rejectedWithoutFence) return { decision: 'STOP_UNKNOWN', reason: 'unproven_sink_rejection' };
  if (pending.length && !fence) return { decision: 'STOP_UNKNOWN', reason: 'inflight_effect_without_sink_fence' };
  if (!allQuiescent && !fence) return { decision: 'STOP_UNKNOWN', reason: 'children_not_quiescent_and_no_sink_fence' };

  const lowerBound = fence ? fence.at : Infinity;
  const queryByChild = new Map();
  for (const q of queryRows) {
    if (belongsToIntent(q, intent)) {
      const prev = queryByChild.get(q.childId) || [];
      prev.push(q);
      queryByChild.set(q.childId, prev);
    }
  }
  if (!allQuiescent && fence) {
    const completeFenceMisses = intent.expectedChildren.every(id => {
      const candidates = queryByChild.get(id) || [];
      return candidates.some(q => queryCoversMiss(q, intent, lowerBound));
    });
    return completeFenceMisses
      ? { decision: 'FENCED_NOT_QUIESCENT', reason: 'sink_rejects_old_attempt_but_workers_still_running' }
      : { decision: 'STOP_UNKNOWN', reason: 'fence_does_not_close_all_prior_effect_queries' };
  }

  if (!allQuiescent || pending.length) return { decision: 'STOP_UNKNOWN', reason: 'not_all_effect_producers_quiescent' };
  const closed = exactlyOne(events.filter(e => e.type === 'ATTEMPT_CLOSED'));
  if (!closed || closed.at < Math.max(...childRows.map(c => c.quiescedAt))) {
    return { decision: 'STOP_UNKNOWN', reason: 'attempt_close_not_proven_after_child_quiescence' };
  }
  const requiredAfter = Math.max(closed.at, fence ? fence.at : 0);
  const allMissesCovered = intent.expectedChildren.every(id => {
    const candidates = queryByChild.get(id) || [];
    return candidates.some(q => queryCoversMiss(q, intent, requiredAfter));
  });
  if (!allMissesCovered) return { decision: 'STOP_UNKNOWN', reason: 'missing_or_uncovered_exact_effect_miss' };
  return { decision: 'CANCELLED_NO_EFFECT', reason: 'all_children_quiescent_and_exact_effect_set_misses_covered' };
}

function runTamperProbes(traces) {
  const probes = [];
  function run(name, mutate, expected, scenarioId = 'clean_quiescent_covered_misses') {
    const base = traces.find(t => t.scenarioId === scenarioId);
    const copy = JSON.parse(JSON.stringify(base.events));
    mutate(copy);
    const got = classify(copy).decision;
    probes.push({ name, expected, actual: got, rejectedOrSafeStopped: got === expected });
  }
  run('remove_intent', e => { const i=e.findIndex(x=>x.type==='INTENT'); e.splice(i,1); }, 'INVALID_TRACE');
  run('duplicate_child_identity', e => { const c=e.find(x=>x.type==='CHILD_STATE'); e.push({...c,seq:999}); }, 'STOP_UNKNOWN');
  run('remove_required_child', e => { const i=e.findIndex(x=>x.type==='CHILD_STATE' && x.childId==='child-B'); e.splice(i,1); }, 'STOP_UNKNOWN');
  run('add_extra_child', e => { const c=e.find(x=>x.type==='CHILD_STATE'); e.push({...c,seq:999,childId:'child-C'}); }, 'STOP_UNKNOWN');
  run('wrong_target_effect_query', e => { const q=e.find(x=>x.type==='RECEIPT_QUERY'); q.targetUid='uid-other'; }, 'STOP_UNKNOWN');
  run('watermark_rollback', e => { const q=e.find(x=>x.type==='RECEIPT_QUERY'); q.watermark=2; }, 'STOP_UNKNOWN');
  run('retention_start_after_attempt', e => { const q=e.find(x=>x.type==='RECEIPT_QUERY'); q.retentionFrom=2; }, 'STOP_UNKNOWN');
  run('effect_task_identity_mutation', e => { const x=e.find(x=>x.type==='SINK_EFFECT'); x.taskId='T-other'; }, 'STOP_UNKNOWN', 'late_effect_after_parent_terminal_grant_valid');
  run('effect_vs_receipt_miss_conflict', e => { const q=e.find(x=>x.type==='RECEIPT_QUERY' && x.childId==='child-A'); q.status='MISS'; }, 'EVIDENCE_CONFLICT', 'late_effect_after_parent_terminal_grant_valid');
  run('historical_revocation_before_effect', e => { e.push({seq:999,type:'AUTHORITY_REVOKED',at:13,authorityId:'issuer-8',subject:null}); }, 'UNAUTHORIZED_OCCURRENCE', 'late_effect_after_parent_terminal_grant_valid');
  run('terminal_state_before_cancel_request', e => { const p=e.find(x=>x.type==='PARENT_STATE'); p.at=8; }, 'STOP_UNKNOWN');
  return probes;
}

function main() {
  const root = __dirname;
  const evidence = path.join(root, '..', 'evidence');
  const cases = JSON.parse(fs.readFileSync(path.join(evidence, '2026-11-08-cancellation-quiescence-cases.json'), 'utf8'));
  const traces = JSON.parse(fs.readFileSync(path.join(evidence, '2026-11-08-cancellation-quiescence-traces.json'), 'utf8'));
  const decisions = JSON.parse(fs.readFileSync(path.join(evidence, '2026-11-08-cancellation-quiescence-producer-decisions.json'), 'utf8'));
  const producerRun = JSON.parse(fs.readFileSync(path.join(evidence, '2026-11-08-cancellation-quiescence-producer-run.json'), 'utf8'));
  const ids = cases.map(c => c.scenarioId);
  if (new Set(ids).size !== ids.length) throw new Error('duplicate scenario identity');
  if (traces.length !== cases.length || decisions.length !== cases.length) throw new Error('case/trace/decision cardinality mismatch');
  if (new Set(traces.map(t => t.scenarioId)).size !== traces.length || new Set(decisions.map(d => d.scenarioId)).size !== decisions.length) throw new Error('duplicate trace or decision identity');
  if (cases.some(c => !traces.some(t => t.scenarioId === c.scenarioId) || !decisions.some(d => d.scenarioId === c.scenarioId))) throw new Error('case/trace/decision identity mismatch');
  const verifierRows = traces.map(t => ({ scenarioId: t.scenarioId, ...classify(t.events) }));
  const producerById = new Map(decisions.map(d => [d.scenarioId, d]));
  const disagreements = verifierRows.filter(v => !producerById.has(v.scenarioId) || producerById.get(v.scenarioId).producerReference !== v.decision);
  const pathRows = verifierRows.map(v => ({
    scenarioId: v.scenarioId,
    weakDecision: producerById.get(v.scenarioId).weakDecision,
    producerReference: producerById.get(v.scenarioId).producerReference,
    verifierDecision: v.decision,
    verifierReason: v.reason,
  }));
  const histogram = {};
  for (const v of verifierRows) histogram[v.decision] = (histogram[v.decision] || 0) + 1;
  const tamper = runTamperProbes(traces);
  const review = {
    scenarioCount: cases.length,
    traceCount: traces.length,
    primitiveEventCount: traces.reduce((n, t) => n + t.events.length, 0),
    pathDecisionCount: cases.length * 3,
    verifierHistogram: histogram,
    weakReferenceDisagreements: pathRows.filter(x => x.weakDecision !== x.producerReference).length,
    producerVerifierAgreements: verifierRows.length - disagreements.length,
    producerVerifierDisagreements: disagreements.length,
    tamperProbes: tamper,
    tamperRejectedOrSafeStopped: tamper.filter(x => x.rejectedOrSafeStopped).length,
    tamperProbeCount: tamper.length,
    runtime: process.versions.node,
    producerRun,
    verifierExecutionStartedAt: new Date().toISOString(),
    verifierCommand: 'node ballast/tools/verify_cancellation_quiescence_2026_11_08.js',
    executionEnvironment: 'local Node.js CLI, independent event reconstruction; synthetic model only',
    dataSourceIndependence: 'NONE',
    semanticContractIndependence: 'SHARED',
    authorityIndependence: 'NONE',
    realExternalEffects: 0,
  };
  fs.writeFileSync(path.join(evidence, '2026-11-08-cancellation-quiescence-decisions.json'), JSON.stringify(pathRows, null, 2) + '\n');
  fs.writeFileSync(path.join(evidence, '2026-11-08-cancellation-quiescence-review.json'), JSON.stringify(review, null, 2) + '\n');
  process.stdout.write(JSON.stringify({ review, disagreements, pathRows }, null, 2) + '\n');
  if (disagreements.length || tamper.some(x => !x.rejectedOrSafeStopped)) process.exitCode = 1;
}

if (require.main === module) main();
module.exports = { classify };
