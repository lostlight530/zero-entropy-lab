'use strict';

const fs = require('node:fs');
const path = require('node:path');
const inputPath = path.join(__dirname, '2026-11-25-s3-object-lock-authority.json');
const input = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

function expand(row) {
  const value = JSON.parse(JSON.stringify(input.rawInputs[row.baseId]));
  function apply(target, patch) {
    for (const [key, item] of Object.entries(patch || {})) {
      if (item && typeof item === 'object' && !Array.isArray(item) &&
          target[key] && typeof target[key] === 'object' && !Array.isArray(target[key])) {
        apply(target[key], item);
      } else {
        target[key] = item;
      }
    }
  }
  apply(value, row.delta);
  return value;
}

function rebuildDecision(row) {
  const x = row.primitive || expand(row);
  const task = x.task;
  const query = x.prior;
  const identityMatches = (a) => a.taskId === task.taskId && a.runId === task.runId &&
    a.operationId === task.operationId && a.effectId === task.effectId &&
    a.bucket === task.bucket && a.key === task.key && a.versionId === task.versionId;

  if (query.status === 'UNKNOWN') return 'STOP_UNKNOWN';
  if (query.status === 'HIT') {
    if (!query.authoritative || !query.exact || !identityMatches(query)) return 'STOP_UNKNOWN';
    if (x.receipts.length !== 1) return x.receipts.length === 0 ? 'STOP_UNKNOWN' : 'IDENTITY_MISMATCH';
    const receipt = x.receipts[0];
    const receiptIsExact = receipt.taskId === task.taskId && receipt.runId === task.runId &&
      receipt.attempt === task.attempt && receipt.operationId === task.operationId &&
      receipt.effectId === task.effectId && receipt.bucket === task.bucket &&
      receipt.key === task.key && receipt.versionId === task.versionId &&
      receipt.requestId === x.request.requestId && receipt.action === 'DeleteObjectVersion' &&
      receipt.status === 'SUCCESS';
    if (!receiptIsExact) return 'IDENTITY_MISMATCH';
    const grant = x.historicalAuthorization;
    if (grant === null || grant.valid !== true) return 'UNAUTHORIZED_HISTORICAL_EFFECT';
    const grantCoversEffect = grant.exact === true && grant.taskId === task.taskId &&
      grant.operationId === task.operationId && grant.effectId === task.effectId &&
      grant.targetVersionId === task.versionId && grant.action === 'DeleteObjectVersion' &&
      grant.actor === 'operator-25' && grant.effectTime === receipt.effectTime &&
      grant.effectTime >= grant.validFrom && grant.effectTime <= grant.validUntil;
    if (!grantCoversEffect) return 'HIST_AUTH_UNKNOWN';
    const completionCurrent = !x.completion.presentVersionIds.includes(task.versionId) &&
      x.completion.readRevision === x.completion.commitRevision && x.completion.protected === true;
    return completionCurrent ? 'MODEL_COMPLETE' : 'COMPLETION_UNPROVEN';
  }

  if (query.status !== 'MISS') return 'STOP_UNKNOWN';
  if (x.receipts.length !== 0) return 'EVIDENCE_CONFLICT';
  const missCoversExactAttempt = query.authoritative === true && query.exact === true &&
    identityMatches(query) && query.attempts.includes(task.attempt) &&
    query.retained === true && query.appliedThrough >= query.requiredThrough;
  if (!missCoversExactAttempt) return 'STOP_UNKNOWN';
  if (x.caller.taskPermission !== true) return 'NO_CURRENT_PERMISSION';
  if (x.request.action !== 'DeleteObjectVersion' || x.request.versionId === null) return 'MARKER_ONLY_NOT_COMPLETE';
  if (x.request.versionId !== task.versionId) return 'IDENTITY_MISMATCH';
  if (x.caller.deleteObjectVersion !== true) return 'DENY_BASE_PERMISSION';
  if (x.lock.legalHold === null || x.lock.mode === 'UNKNOWN') return 'STOP_UNKNOWN';
  if (x.lock.legalHold === true) return 'DENY_LEGAL_HOLD';
  const retentionStillActive = x.time.now < x.lock.retainUntil;
  if (x.lock.mode === 'COMPLIANCE' && retentionStillActive) return 'DENY_COMPLIANCE';
  const governanceBypassSatisfied = x.caller.bypassGovernanceRetention === true && x.request.bypassHeader === true;
  if (x.lock.mode === 'GOVERNANCE' && retentionStillActive && !governanceBypassSatisfied) return 'DENY_GOVERNANCE_BYPASS';
  if (!['GOVERNANCE', 'COMPLIANCE', 'NONE'].includes(x.lock.mode)) return 'STOP_UNKNOWN';
  const boundaryStable = x.request.observedLockRevision === x.lock.revision &&
    x.completion.readRevision === x.completion.commitRevision;
  return boundaryStable ? 'MODEL_RETRY_CANDIDATE' : 'TOCTOU_STOP';
}

const ids = input.scenarios.map((x) => x.id);
const uniqueIds = new Set(ids).size === ids.length;
const reviewed = input.scenarios.map((row) => {
  const expanded = { ...row, primitive: expand(row) };
  const decision = rebuildDecision(expanded);
  return { id: row.id, decision, producerDecision: row.reference, agrees: decision === row.reference };
});

function clone(value) { return JSON.parse(JSON.stringify(value)); }
const retry = { ...clone(input.scenarios.find((x) => x.id === 'governance_bypass_permission_and_header')), primitive: null };
retry.primitive = expand(retry);
const hit = { ...clone(input.scenarios.find((x) => x.id === 'historical_hit_survives_later_permission_revocation')), primitive: null };
hit.primitive = expand(hit);
const probes = [];
function probe(name, row, expected) {
  const actual = rebuildDecision(row);
  probes.push({ name, expected, actual, pass: actual === expected });
}
let m;
m = clone(retry); m.primitive.request.bypassHeader = false; probe('remove-explicit-bypass-header', m, 'DENY_GOVERNANCE_BYPASS');
m = clone(retry); m.primitive.caller.bypassGovernanceRetention = false; probe('remove-bypass-permission', m, 'DENY_GOVERNANCE_BYPASS');
m = clone(retry); m.primitive.lock.legalHold = true; probe('inject-legal-hold', m, 'DENY_LEGAL_HOLD');
m = clone(retry); m.primitive.lock.mode = 'COMPLIANCE'; probe('switch-to-compliance-mode', m, 'DENY_COMPLIANCE');
m = clone(retry); m.primitive.caller.deleteObjectVersion = false; probe('remove-version-delete-permission', m, 'DENY_BASE_PERMISSION');
m = clone(retry); m.primitive.prior.appliedThrough = 1; probe('shrink-negative-query-watermark', m, 'STOP_UNKNOWN');
m = clone(retry); m.primitive.prior.versionId = 'version-foreign'; m.primitive.prior.exact = false; probe('remove-exact-version-query-scope', m, 'STOP_UNKNOWN');
m = clone(retry); m.primitive.lock.revision += 1; probe('mutate-lock-revision-after-read', m, 'TOCTOU_STOP');
m = clone(hit); m.primitive.receipts = []; probe('remove-positive-receipt', m, 'STOP_UNKNOWN');
m = clone(hit); m.primitive.receipts[0].versionId = 'version-foreign'; probe('retarget-positive-receipt', m, 'IDENTITY_MISMATCH');
m = clone(hit); m.primitive.historicalAuthorization.valid = false; probe('revoke-historical-grant-in-fixture', m, 'UNAUTHORIZED_HISTORICAL_EFFECT');
m = clone(hit); m.primitive.completion.commitRevision += 1; probe('change-completion-revision', m, 'COMPLETION_UNPROVEN');

const selfAttacks = input.scenarios.filter((x) => x.selfAttack).map((x) => ({
  id: x.id,
  producerDecision: x.reference,
  missingProof: x.id.includes('issuer') ? 'no signed issuer payload or independent issuer authority' : 'no independently evidenced atomic compare-and-effect boundary',
  interpretation: 'MODEL_COMPLETE is conditional on authored booleans and is not a full-integrity proof',
}));

const summary = {
  caseCount: input.scenarios.length,
  uniqueIds: uniqueIds,
  implementationReconstructionAgreements: reviewed.filter((x) => x.agrees).length,
  implementationReconstructionDisagreements: reviewed.filter((x) => !x.agrees).length,
  tamperProbeCount: probes.length,
  tamperProbePasses: probes.filter((x) => x.pass).length,
  selfAttackCount: selfAttacks.length,
  selfAttackAcceptedAsModelComplete: selfAttacks.filter((x) => x.producerDecision === 'MODEL_COMPLETE').length,
  independentAuthority: 'NONE',
  semanticContractIndependence: 'NONE',
  dataSourceIndependence: 'NONE',
  implementationIndependence: 'PARTIAL',
};

const output = {
  schema: 'ballast-s3-object-lock-verification-2026-11-25',
  verifiedEvidence: path.basename(inputPath),
  verifiedEvidenceLogicalDate: input.logicalDate,
  verificationRuntime: { name: 'Node.js', version: process.version.replace(/^v/, ''), entry: path.basename(__filename) },
  verificationExecutedAtUtc: new Date().toISOString(),
  reviewed,
  tamperProbes: probes,
  selfAttacks,
  summary,
  result: uniqueIds && summary.implementationReconstructionDisagreements === 0 && summary.tamperProbePasses === probes.length
    ? 'PASS_WITHIN_SHARED_SYNTHETIC_CONTRACT' : 'FAIL',
  limitations: [
    'Verifier uses a separately written decision procedure but the same authored fixtures and semantic contract',
    'No independent AWS, MinIO, IAM, receipt, legal-hold or protected completion authority was queried',
    'Self-attack cases demonstrate that authored issuerVerified and protected booleans can still produce MODEL_COMPLETE'
  ]
};
const out = path.join(__dirname, '2026-11-25-s3-object-lock-verification.json');
fs.writeFileSync(out, JSON.stringify(output) + '\n', 'utf8');
process.stdout.write(JSON.stringify({ result: output.result, summary, selfAttacks, verificationPath: path.basename(out) }, null, 2) + '\n');
