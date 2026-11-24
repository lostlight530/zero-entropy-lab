"use strict";
const fs = require("node:fs");
const cp = require("node:child_process");
const crypto = require("node:crypto");
const vm = require("node:vm");
const path = require("node:path");
const sourceFile = path.join(__dirname, "research_s3_conditional_delete_2026_11_24.js");
const sourceBytes = fs.readFileSync(sourceFile);
const original = JSON.parse(cp.execFileSync(process.execPath, [sourceFile], {encoding:"utf8"}));
const sourceSha256 = crypto.createHash("sha256").update(sourceBytes).digest("hex");
const expectedIds = ["baseline_prior_hit","response_204_only","same_etag_reincarnation","delete_marker_absence","unscoped_miss","stale_miss","retention_expired","qualified_miss","positive_negative_conflict","duplicate_receipt","extra_effect_receipt","revoked_new_permission","unauthorized_history","completion_toctou","forged_atomic_flag","wrong_attempt"];
const histogramExpected = {MODEL_COMPLETE:2,STOP_UNKNOWN:5,INCARNATION_DRIFT:1,MODEL_RETRY_CANDIDATE:1,EVIDENCE_CONFLICT:1,IDENTITY_MISMATCH:3,HIST_AUTH_UNKNOWN:1,COMPLETION_UNPROVEN:2};
function rebuild(f) {
  const receipts = f.receipt == null ? [] : Array.isArray(f.receipt) ? f.receipt : [f.receipt];
  if (f.prior === "miss" && receipts.length > 0) return "EVIDENCE_CONFLICT";
  if (f.prior === "hit") {
    if (receipts.length !== 1 || !receipts[0] || receipts[0].effect !== f.effect || receipts[0].version !== f.targetVersion || receipts[0].attempt !== f.attempt) return "IDENTITY_MISMATCH";
    if (f.historicalAuthorization !== true) return "HIST_AUTH_UNKNOWN";
    if (f.currentVersion !== f.targetVersion || f.currentEtag !== f.etag) return "INCARNATION_DRIFT";
    if (f.deleteMarker !== true || f.observedRevision !== f.completionRevision || f.atomicCompletion !== true) return "COMPLETION_UNPROVEN";
    return "MODEL_COMPLETE";
  }
  if (f.prior === "miss" && f.missScope === "exact" && Number.isSafeInteger(f.missWatermark) && Number.isSafeInteger(f.effectSequence) && f.missWatermark >= f.effectSequence && f.retention === true && f.currentPermission === true) return "MODEL_RETRY_CANDIDATE";
  return "STOP_UNKNOWN";
}
function audit(rows) {
  const errors = [];
  if (!Array.isArray(rows) || rows.length !== expectedIds.length) return {pass:false,errors:["ROW_SET_CARDINALITY"],rowCount:Array.isArray(rows)?rows.length:null};
  const names = rows.map(r => r && r.scenario);
  if (new Set(names).size !== expectedIds.length || names.some(x=>!expectedIds.includes(x)) || expectedIds.some(x=>!names.includes(x))) errors.push("EXACT_SCENARIO_SET");
  const histogram = {};
  let weakComplete=0, modelComplete=0, differences=0;
  for (const row of rows) {
    if (!row || typeof row.facts !== "object" || row.facts === null) {errors.push("BAD_ROW");continue;}
    const f = row.facts;
    if (f.task !== "T24" || f.run !== "RUN24" || f.attempt !== 1 || f.effect !== "DELETE-OBJ-24" || f.target !== "bucket/key") errors.push(`${row.scenario}:FIXTURE_SCOPE`);
    if (typeof f.targetVersion !== "string" || typeof f.currentVersion !== "string" || typeof f.etag !== "string" || typeof f.currentEtag !== "string") errors.push(`${row.scenario}:IDENTITY_TYPE`);
    if (!["hit","miss","unknown"].includes(f.prior)) errors.push(`${row.scenario}:PRIOR_ENUM`);
    if (!Number.isSafeInteger(f.observedRevision) || !Number.isSafeInteger(f.completionRevision)) errors.push(`${row.scenario}:REVISION_TYPE`);
    const weak = f.deleteResponse === 204 ? "COMPLETE" : "INCOMPLETE";
    const reconstructed = rebuild(f);
    if (row.weak !== weak) errors.push(`${row.scenario}:WEAK_LABEL`);
    if (row.reference !== reconstructed) errors.push(`${row.scenario}:REFERENCE_LABEL`);
    if (weak === "COMPLETE") weakComplete++;
    if (reconstructed === "MODEL_COMPLETE") modelComplete++;
    if (weak === "COMPLETE" && reconstructed !== "MODEL_COMPLETE") differences++;
    histogram[reconstructed]=(histogram[reconstructed]||0)+1;
  }
  for (const [k,v] of Object.entries(histogramExpected)) if (histogram[k] !== v) errors.push(`HISTOGRAM:${k}`);
  if (weakComplete !== 16 || modelComplete !== 2 || differences !== 14) errors.push("AGGREGATE_DRIFT");
  return {pass:errors.length===0,errors,rowCount:rows.length,weakComplete,modelComplete,differences,histogram};
}
const originalReconstruction = audit(original.rows);
const priorOriginalRun = {check:original.check,attacks:original.attacks.map(a=>({name:a.name,detected:a.detected}))};
const clone=()=>JSON.parse(JSON.stringify(original.rows));
const tamperCases={
  drop_row: r=>r.pop(),
  extra_row: r=>r.push(JSON.parse(JSON.stringify(r[0]))),
  duplicate_scenario: r=>r[1].scenario=r[0].scenario,
  unknown_scenario: r=>r[1].scenario="unexpected_case",
  forged_reference: r=>r[0].reference="STOP_UNKNOWN",
  forged_weak: r=>r[0].weak="INCOMPLETE",
  wrong_attempt: r=>r[0].facts.receipt.attempt=99,
  extra_receipt: r=>r[0].facts.receipt=[r[0].facts.receipt,{effect:"EXTRA",version:"v1",attempt:1}],
  conflicting_miss: r=>r[0].facts.prior="miss",
  changed_target_version: r=>r[0].facts.currentVersion="v9",
  revision_toctou: r=>r[0].facts.completionRevision=7,
  non_boolean_atomic: r=>r[0].facts.atomicCompletion="true",
  historical_authorization_denied: r=>r[0].facts.historicalAuthorization=false,
  changed_task: r=>r[0].facts.task="FOREIGN-TASK",
  changed_run: r=>r[0].facts.run="FOREIGN-RUN",
  changed_bucket_key: r=>r[0].facts.target="other/key",
  unqualified_negative: r=>r[7].facts.missScope="prefix",
  unknown_prior: r=>r[0].facts.prior="unknown"
};
const attacks=Object.entries(tamperCases).map(([name,change])=>{
  const rows=clone(); change(rows);
  const outcome=audit(rows);
  return {name,detected:!outcome.pass,errors:outcome.errors};
});
const originalSource = sourceBytes.toString("utf8");
function runOriginalVerifierWithMutation(change) {
  const rows=clone();change(rows);
  const context = {rows, result:null};
  vm.runInNewContext(originalSource + "\nresult=verifier(rows);", context, {timeout:3000});
  return {pass:context.result.pass,errors:Array.from(context.result.errors)};
}
const originalBlindSpots={
  omitted_row:runOriginalVerifierWithMutation(r=>r.pop()),
  foreign_task:runOriginalVerifierWithMutation(r=>r[0].facts.task="FOREIGN-TASK"),
  foreign_target:runOriginalVerifierWithMutation(r=>r[0].facts.target="other/key")
};
const unsupportedEvidence = original.rows.filter(r=>r.reference==="MODEL_COMPLETE").map(r=>({scenario:r.scenario,missingReceiptBindings:["task","run","target","requestId"].filter(field => !(r.facts.receipt && Object.hasOwn(r.facts.receipt,field))),historicalAuthorizationIssuer:"NOT_PRESENT",protectedCompletionAuthority:"NOT_PRESENT"}));
const replay={recordType:"LATER_SAME_DATE_MAINTAINER_REPLAY_NOT_ORIGINAL_STDOUT",executionUtc:new Date().toISOString(),logicalDate:"2026-11-24 Asia/Shanghai",entrypoint:"node ballast/tools/review_s3_conditional_delete_2026_11_24.js",sourceBlobSha256:sourceSha256,independence:{implementation:"PARTIAL",dataSource:"NONE",semanticContract:"SHARED",authority:"NONE"},originalReconstruction,originalReplay:priorOriginalRun,attacks,originalBlindSpots,unsupportedEvidence,scope:{fullIntegrityCompletionProofs:0,realAwsCalls:0,authoritativeMissQueries:0,signedHistoricalGrants:0,protectedCommitReceipts:0},credit:{newDaily:0,newIndependentResearchWindow:0,newCase:0,newNotes:0}};
if(!originalReconstruction.pass||!original.check.pass||original.attacks.some(a=>!a.detected)||attacks.some(x=>!x.detected)) {console.error(JSON.stringify(replay,null,2));process.exit(1);}
console.log(JSON.stringify(replay,null,2));
