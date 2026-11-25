'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ID = {
  taskId: 'TASK-25',
  runId: 'RUN-25',
  operationId: 'OP-25',
  effectId: 'EFFECT-DELETE-25',
  bucket: 'research-archive',
  key: 'release-artifact.tar',
  versionId: 'version-001',
  requestId: 'REQUEST-25',
  actor: 'operator-25',
};

function exactQuery(status = 'MISS') {
  return {
    status,
    authoritative: true,
    exact: true,
    taskId: ID.taskId,
    runId: ID.runId,
    operationId: ID.operationId,
    effectId: ID.effectId,
    bucket: ID.bucket,
    key: ID.key,
    versionId: ID.versionId,
    attempts: [1],
    appliedThrough: 90,
    requiredThrough: 85,
    retained: true,
  };
}

function retryBase() {
  return {
    task: { ...ID, attempt: 1, action: 'DeleteObjectVersion' },
    stage: 'RETRY_DECISION',
    request: {
      action: 'DeleteObjectVersion',
      versionId: ID.versionId,
      requestId: ID.requestId,
      bypassHeader: true,
      observedLockRevision: 7,
    },
    response: null,
    caller: {
      taskPermission: true,
      deleteObjectVersion: true,
      bypassGovernanceRetention: true,
    },
    time: { now: 400 },
    lock: {
      mode: 'GOVERNANCE',
      retainUntil: 500,
      legalHold: false,
      revision: 7,
    },
    prior: exactQuery('MISS'),
    historicalAuthorization: null,
    receipts: [],
    completion: {
      presentVersionIds: [ID.versionId],
      readRevision: 7,
      commitRevision: 7,
      protected: true,
      atomicityProof: null,
    },
  };
}

function hitBase() {
  const p = retryBase();
  p.stage = 'HISTORICAL_RECONCILIATION';
  p.prior = exactQuery('HIT');
  p.request = {
    action: 'DeleteObjectVersion',
    versionId: ID.versionId,
    requestId: ID.requestId,
    bypassHeader: true,
    observedLockRevision: 7,
  };
  p.response = {
    status: 204,
    requestId: ID.requestId,
    action: 'DeleteObjectVersion',
    versionId: ID.versionId,
  };
  p.historicalAuthorization = {
    valid: true,
    exact: true,
    taskId: ID.taskId,
    operationId: ID.operationId,
    effectId: ID.effectId,
    targetVersionId: ID.versionId,
    action: 'DeleteObjectVersion',
    actor: ID.actor,
    effectTime: 350,
    validFrom: 100,
    validUntil: 450,
    issuerVerified: true,
    signedPayload: null,
  };
  p.receipts = [{
    receiptId: 'RECEIPT-25',
    taskId: ID.taskId,
    runId: ID.runId,
    attempt: 1,
    operationId: ID.operationId,
    effectId: ID.effectId,
    bucket: ID.bucket,
    key: ID.key,
    versionId: ID.versionId,
    requestId: ID.requestId,
    action: 'DeleteObjectVersion',
    status: 'SUCCESS',
    sequence: 84,
    effectTime: 350,
    issuerVerified: true,
  }];
  p.completion = {
    presentVersionIds: [],
    readRevision: 7,
    commitRevision: 7,
    protected: true,
    atomicityProof: null,
  };
  return p;
}

function classifyReference(s) {
  const p = s.primitive;
  const t = p.task;
  const q = p.prior;
  const exact = (x) => x.taskId === t.taskId && x.runId === t.runId &&
    x.operationId === t.operationId && x.effectId === t.effectId &&
    x.bucket === t.bucket && x.key === t.key && x.versionId === t.versionId;

  if (q.status === 'UNKNOWN') return 'STOP_UNKNOWN';

  if (q.status === 'HIT') {
    if (q.status === 'MISS' || (p.receipts.length && s.primitive.prior.conflictingMiss === true)) return 'EVIDENCE_CONFLICT';
    if (!q.authoritative || !q.exact || !exact(q)) return 'STOP_UNKNOWN';
    if (p.receipts.length !== 1) return p.receipts.length === 0 ? 'STOP_UNKNOWN' : 'IDENTITY_MISMATCH';
    const r = p.receipts[0];
    if (r.taskId !== t.taskId || r.runId !== t.runId || r.attempt !== t.attempt ||
        r.operationId !== t.operationId || r.effectId !== t.effectId ||
        r.bucket !== t.bucket || r.key !== t.key || r.versionId !== t.versionId ||
        r.requestId !== p.request.requestId || r.action !== 'DeleteObjectVersion' ||
        r.status !== 'SUCCESS') return 'IDENTITY_MISMATCH';
    const a = p.historicalAuthorization;
    if (!a || !a.valid) return 'UNAUTHORIZED_HISTORICAL_EFFECT';
    if (!a.exact || a.taskId !== t.taskId || a.operationId !== t.operationId ||
        a.effectId !== t.effectId || a.targetVersionId !== t.versionId ||
        a.action !== 'DeleteObjectVersion' || a.actor !== ID.actor ||
        a.effectTime !== r.effectTime || a.effectTime < a.validFrom ||
        a.effectTime > a.validUntil) return 'HIST_AUTH_UNKNOWN';
    if (p.completion.presentVersionIds.includes(t.versionId) ||
        p.completion.readRevision !== p.completion.commitRevision ||
        !p.completion.protected) return 'COMPLETION_UNPROVEN';
    return 'MODEL_COMPLETE';
  }

  if (q.status !== 'MISS') return 'STOP_UNKNOWN';
  if (p.receipts.length > 0) return 'EVIDENCE_CONFLICT';
  if (!q.authoritative || !q.exact || !exact(q) ||
      !q.attempts.includes(t.attempt) || !q.retained ||
      q.appliedThrough < q.requiredThrough) return 'STOP_UNKNOWN';
  if (!p.caller.taskPermission) return 'NO_CURRENT_PERMISSION';
  if (p.request.action !== 'DeleteObjectVersion' || !p.request.versionId) return 'MARKER_ONLY_NOT_COMPLETE';
  if (p.request.versionId !== t.versionId) return 'IDENTITY_MISMATCH';
  if (!p.caller.deleteObjectVersion) return 'DENY_BASE_PERMISSION';
  if (p.lock.legalHold === null || p.lock.mode === 'UNKNOWN') return 'STOP_UNKNOWN';
  if (p.lock.legalHold) return 'DENY_LEGAL_HOLD';
  const active = p.time.now < p.lock.retainUntil;
  if (p.lock.mode === 'COMPLIANCE' && active) return 'DENY_COMPLIANCE';
  if (p.lock.mode === 'GOVERNANCE' && active &&
      !(p.caller.bypassGovernanceRetention && p.request.bypassHeader)) {
    return 'DENY_GOVERNANCE_BYPASS';
  }
  if (p.lock.mode !== 'GOVERNANCE' && p.lock.mode !== 'COMPLIANCE' && p.lock.mode !== 'NONE') return 'STOP_UNKNOWN';
  if (p.request.observedLockRevision !== p.lock.revision ||
      p.completion.readRevision !== p.completion.commitRevision) return 'TOCTOU_STOP';
  return 'MODEL_RETRY_CANDIDATE';
}

function weakResponseOnly(p) {
  return p.response && (p.response.status === 200 || p.response.status === 204)
    ? 'COMPLETE' : 'NO_SUCCESS_SIGNAL';
}

function weakBypassFlagOnly(p) {
  return p.caller.bypassGovernanceRetention && p.caller.deleteObjectVersion
    ? 'ALLOW' : 'DENY';
}

const cases = [];
function deepDiff(base, value) {
  if (base && value && typeof base === 'object' && typeof value === 'object' &&
      !Array.isArray(base) && !Array.isArray(value)) {
    const out = {};
    for (const key of Object.keys(value)) {
      const child = deepDiff(base[key], value[key]);
      if (child !== undefined) out[key] = child;
    }
    return Object.keys(out).length ? out : undefined;
  }
  return JSON.stringify(base) === JSON.stringify(value) ? undefined : value;
}

function add(id, description, primitive, selfAttack = false) {
  const baseId = primitive.stage === 'RETRY_DECISION' ? 'retry' : 'hit';
  const base = baseId === 'retry' ? retryBase() : hitBase();
  cases.push({ id, description, selfAttack, baseId, delta: deepDiff(base, primitive), primitive });
}

{
  const p = retryBase();
  add('governance_bypass_permission_and_header', 'Active governance retention with exact version, DeleteObjectVersion permission, bypass permission, explicit header, no legal hold and covered exact MISS', p);
}
{
  const p = retryBase(); p.request.bypassHeader = false;
  add('bypass_permission_without_header', 'Governance bypass permission exists but the explicit request header is absent', p);
}
{
  const p = retryBase(); p.caller.bypassGovernanceRetention = false;
  add('header_without_bypass_permission', 'Explicit bypass header exists but the caller lacks bypass permission', p);
}
{
  const p = retryBase(); p.lock.legalHold = true;
  add('legal_hold_survives_governance_bypass', 'Legal hold remains active despite governance bypass permission and header', p);
}
{
  const p = retryBase(); p.lock.mode = 'COMPLIANCE';
  add('compliance_mode_cannot_be_bypassed', 'Active compliance retention rejects deletion even with governance bypass permission and header', p);
}
{
  const p = retryBase(); p.lock.retainUntil = 300; p.caller.bypassGovernanceRetention = false; p.request.bypassHeader = false;
  add('expired_governance_no_bypass_needed', 'Expired governance retention with no legal hold does not require governance bypass', p);
}
{
  const p = retryBase(); p.lock.mode = 'COMPLIANCE'; p.lock.retainUntil = 300; p.caller.bypassGovernanceRetention = false; p.request.bypassHeader = false;
  add('expired_compliance_no_bypass_needed', 'Expired compliance retention with no legal hold is no longer active', p);
}
{
  const p = retryBase(); p.caller.deleteObjectVersion = false;
  add('missing_delete_object_version_permission', 'Exact version deletion lacks the base DeleteObjectVersion permission', p);
}
{
  const p = retryBase(); p.request.action = 'DeleteObject'; p.request.versionId = null; p.response = { status: 200, requestId: ID.requestId, action: 'DeleteObject', versionId: null };
  add('unversioned_delete_marker_not_version_deletion', 'Unversioned simple DELETE may create a marker but does not prove permanent deletion of the protected exact version', p);
}
{
  const p = retryBase(); p.request.versionId = 'version-002';
  add('request_targets_different_version', 'Request version ID differs from the task-bound object version', p);
}
{
  const p = retryBase(); p.prior.status = 'UNKNOWN'; p.prior.authoritative = false; p.response = null;
  add('unknown_prior_effect', 'Prior-effect query is unknown and cannot authorize a blind retry', p);
}
{
  const p = retryBase(); p.prior.appliedThrough = 80;
  add('miss_watermark_does_not_cover_attempt', 'Negative query watermark does not cover the old attempt sequence', p);
}
{
  const p = retryBase(); p.prior.versionId = null; p.prior.exact = false;
  add('miss_query_omits_exact_version_identity', 'Negative query does not bind the exact target version', p);
}
{
  const p = retryBase(); p.caller.taskPermission = false;
  add('current_task_permission_revoked_before_retry', 'Current task permission is revoked before a new delete effect', p);
}
{
  const p = hitBase(); p.caller.taskPermission = false;
  add('historical_hit_survives_later_permission_revocation', 'Exact historical effect and current completion remain valid despite later loss of permission for new effects', p);
}
{
  const p = hitBase(); p.receipts[0].versionId = 'version-002';
  add('historical_receipt_targets_wrong_version', 'Positive receipt is bound to another object version', p);
}
{
  const p = hitBase(); p.historicalAuthorization.valid = false;
  add('historical_effect_time_authorization_invalid', 'Exact receipt exists but the effect-time grant is invalid', p);
}
{
  const p = hitBase(); p.completion.commitRevision = 8;
  add('completion_revision_changes_before_commit', 'Current completion revision changes after the read', p);
}
{
  const p = hitBase(); p.prior.status = 'MISS'; p.prior.authoritative = true; p.prior.exact = true;
  add('positive_receipt_conflicts_with_authoritative_miss', 'A positive exact receipt conflicts with a scoped negative query', p);
}
{
  const p = hitBase(); p.receipts.push({ ...p.receipts[0] });
  add('duplicate_positive_receipt_identity', 'Duplicate receipt identity cannot be accepted by cardinality', p);
}
{
  const p = retryBase(); p.lock.revision = 8;
  add('lock_revision_drifts_after_preflight', 'Object lock state revision changes after preflight and before the modeled effect boundary', p);
}
{
  const p = hitBase(); p.historicalAuthorization.signedPayload = null; p.historicalAuthorization.issuerVerified = true;
  add('self_attack_issuer_boolean_without_signed_evidence', 'Reference accepts an authored issuerVerified boolean without a signature or independent issuer record', p, true);
}
{
  const p = hitBase(); p.completion.atomicityProof = null; p.completion.protected = true;
  add('self_attack_protected_boolean_without_atomic_proof', 'Reference accepts an authored protected boolean without an independently evidenced compare-and-effect boundary', p, true);
}
{
  const p = retryBase(); p.lock.legalHold = null;
  add('legal_hold_visibility_unknown', 'Legal-hold state cannot be read authoritatively and must remain unknown', p);
}

const now = new Date().toISOString();
const results = cases.map((c) => ({
  id: c.id,
  description: c.description,
  selfAttack: c.selfAttack,
  baseId: c.baseId,
  delta: c.delta || {},
  weakResponseOnly: weakResponseOnly(c.primitive),
  weakBypassFlagOnly: weakBypassFlagOnly(c.primitive),
  reference: classifyReference(c),
}));

const summary = {
  caseCount: results.length,
  uniqueCaseIds: new Set(results.map((x) => x.id)).size,
  weakResponseComplete: results.filter((x) => x.weakResponseOnly === 'COMPLETE').length,
  weakBypassAllow: results.filter((x) => x.weakBypassFlagOnly === 'ALLOW').length,
  referenceDistribution: Object.fromEntries([...new Set(results.map((x) => x.reference))].sort().map((k) => [k, results.filter((x) => x.reference === k).length])),
  weakResponseReferenceDisagreements: results.filter((x) => x.weakResponseOnly === 'COMPLETE' && !['MODEL_COMPLETE'].includes(x.reference)).length,
  weakBypassReferenceDisagreements: results.filter((x) => x.weakBypassFlagOnly === 'ALLOW' && !['MODEL_RETRY_CANDIDATE', 'MODEL_COMPLETE'].includes(x.reference)).length,
  selfAttackAcceptedAsModelComplete: results.filter((x) => x.selfAttack && x.reference === 'MODEL_COMPLETE').length,
  externalEffectCalls: 0,
};

const evidence = {
  schema: 'ballast-s3-object-lock-authority-2026-11-25',
  logicalDate: '2026-11-25',
  executedAtUtc: now,
  runtime: { name: 'Node.js', version: process.version.replace(/^v/, ''), entry: path.basename(__filename) },
  sourceAccessDate: '2026-11-25',
  sourceIdentities: [
    { publisher: 'Amazon Web Services', urls: [
      'https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html',
      'https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock-managing.html',
      'https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-with-s3-policy-actions.html'
    ] },
    { publisher: 'MinIO', urls: [
      'https://docs.min.io/aistor/administration/object-locking-and-immutability/'
    ], scope: 'MinIO AIStor documented behavior; not a substitute for live AWS verification' }
  ],
  control: {
    fixed: ['task/run/operation/effect identity', 'bucket/key/version identity', 'attempt number', 'exact query watermark', 'response shape except named mutation', 'completion revision except named mutation'],
    injected: ['retention mode and expiry', 'legal hold', 'bypass permission', 'explicit bypass header', 'base DeleteObjectVersion permission', 'prior-effect evidence quality', 'historical authorization', 'receipt identity', 'completion revision'],
    initial: 'A versioned-object task targets one exact version; active governance retention; no legal hold; exact scoped negative query; caller has task and S3 version-delete permission plus governance bypass and explicit header'
  },
  rawInputs: { retry: retryBase(), hit: hitBase() },
  scenarios: results,
  summary,
  limitations: [
    'All object, grant, receipt, watermark, revision and authority fields are authored synthetic primitives',
    'No AWS S3, MinIO AIStor, IAM, CloudTrail, object-version lookup, legal-hold API or external receipt authority was called',
    'issuerVerified and protected are booleans, not cryptographic or transactional proof',
    'The model does not establish a real provider-side atomic boundary with an external completion store'
  ]
};

const out = path.join(__dirname, '2026-11-25-s3-object-lock-authority.json');
fs.writeFileSync(out, JSON.stringify(evidence) + '\n', 'utf8');
process.stdout.write(JSON.stringify({ executedAtUtc: now, summary, evidencePath: path.basename(out) }, null, 2) + '\n');
