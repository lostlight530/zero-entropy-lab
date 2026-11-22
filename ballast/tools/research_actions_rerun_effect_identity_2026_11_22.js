"use strict";
// Ballast 2026-11-22, bounded synthetic GitHub Actions rerun vs exact external effect proof
// Run using: node ballast/tools/research_actions_rerun_effect_identity_2026_11_22.js
// All actor, permission, receipt, sink and query facts below are authored, not live GitHub or S3 traces
const clone=x=>JSON.parse(JSON.stringify(x));
const BASE={
  run:{id:"RUN22",attempt:2,knownAttempts:[1,2],latestPotentialEffectSeq:70,originalActor:"alice",triggeringActor:"bob",eventSha:"sha-original",eventRef:"refs/heads/main",jobState:"success"},
  task:{id:"T22",operation:"OP22",intent:"publish-release",target:"release-generation-A",required:["publish","notify"],currentMembers:["publish","notify"]},
  seen:{runIds:["RUN22"],runAttempts:["RUN22/1"]},
  receipts:[
    {id:"rc-publish",runId:"RUN22",attempt:1,task:"T22",operation:"OP22",intent:"publish-release",target:"release-generation-A",member:"publish",issuerAttested:true,effectTimeAuthorized:true,orderWitness:true},
    {id:"rc-notify",runId:"RUN22",attempt:1,task:"T22",operation:"OP22",intent:"publish-release",target:"release-generation-A",member:"notify",issuerAttested:true,effectTimeAuthorized:true,orderWitness:true}
  ],
  query:{status:"UNKNOWN",authoritative:false,runId:"RUN22",task:"T22",operation:"OP22",intent:"publish-release",target:"release-generation-A",members:["publish","notify"],attempts:[1,2],appliedThrough:75,retained:true,issuerAttested:true},
  permission:{active:true,credentialValid:true,approvalValid:true,originalActorAllowed:true,rerunnerActorAllowed:false,authorizedActor:"alice",ownerExpected:5,ownerCurrent:5,now:400,validUntil:500},
  completion:{protected:true,issuerAttested:true,target:"release-generation-A",required:["publish","notify"],witnessed:["publish","notify"],readVersion:9,commitVersion:9},
  fence:{atomic:true,authorityRead:9,authorityCommit:9,sinkOperation:"OP22"}
};
const scenarios=[];
function add(id,mutate){const x=clone(BASE);mutate(x);scenarios.push({id,primitive:x})}
function miss(x){x.receipts=[];x.query.status="MISS";x.query.authoritative=true;x.completion.witnessed=[];return x}
add("baseline_old_attempt_positive",x=>{});
add("rerun_initiated_by_different_actor",x=>{x.run.triggeringActor="carol"});
add("old_positive_new_permission_revoked",x=>{x.permission.active=false});
add("same_run_changed_business_operation",x=>{x.task.operation="OP-CHANGED"});
add("same_run_changed_intent",x=>{x.task.intent="roll-back-release"});
add("same_run_target_reincarnated",x=>{x.task.target="release-generation-B"});
add("stable_run_id_new_membership_same_count",x=>{x.task.currentMembers=["publish","audit"]});
add("receipt_missing_id",x=>{delete x.receipts[0].id});
add("receipt_duplicate_id",x=>{x.receipts[1].id="rc-publish"});
add("receipt_duplicate_member_same_count",x=>{x.receipts[1].member="publish"});
add("receipt_extra_member",x=>{x.receipts.push({...clone(x.receipts[0]),id:"rc-extra",member:"audit"})});
add("receipt_missing_required_member",x=>{x.receipts.pop()});
add("receipt_wrong_run_id",x=>{x.receipts[0].runId="RUN-OTHER"});
add("receipt_wrong_attempt",x=>{x.receipts[0].attempt=99});
add("receipt_effect_time_unauthorized",x=>{x.receipts[0].effectTimeAuthorized=false});
add("receipt_issuer_unattested",x=>{x.receipts[0].issuerAttested=false});
add("receipt_order_unattested",x=>{x.receipts[0].orderWitness=false});
add("positive_receipt_and_authoritative_miss",x=>{x.query.status="MISS";x.query.authoritative=true});
add("current_completion_stale_revision",x=>{x.completion.commitVersion=10});
add("current_completion_same_count_wrong_member",x=>{x.completion.witnessed=["publish","audit"]});
add("new_attempt_without_receipts_unknown",x=>{x.receipts=[];x.completion.witnessed=[]});
add("job_success_without_receipts",x=>{x.receipts=[];x.completion.witnessed=[];x.run.jobState="success"});
add("miss_attempt_coverage_gap",x=>{miss(x);x.query.attempts=[2]});
add("miss_membership_coverage_gap",x=>{miss(x);x.query.members=["publish"]});
add("miss_pre_attempt_watermark",x=>{miss(x);x.query.appliedThrough=69});
add("miss_retention_expired",x=>{miss(x);x.query.retained=false});
add("miss_wrong_operation",x=>{miss(x);x.query.operation="OP-OTHER"});
add("miss_wrong_target",x=>{miss(x);x.query.target="release-generation-B"});
add("miss_non_numeric_watermark",x=>{miss(x);x.query.appliedThrough="75"});
add("miss_wrong_run_id",x=>{miss(x);x.query.runId="RUN-OTHER"});
add("miss_current_authority_revoked",x=>{miss(x);x.permission.originalActorAllowed=false});
add("miss_rerunner_lacks_privilege_original_valid",x=>{miss(x);x.permission.rerunnerActorAllowed=false});
add("miss_current_credential_invalid",x=>{miss(x);x.permission.credentialValid=false});
add("miss_approval_invalid",x=>{miss(x);x.permission.approvalValid=false});
add("miss_owner_generation_drift",x=>{miss(x);x.permission.ownerCurrent=6});
add("miss_commit_revision_drift",x=>{miss(x);x.fence.authorityCommit=10});
add("miss_sink_fence_not_atomic",x=>{miss(x);x.fence.atomic=false});
add("qualified_miss_all_known_attempts",x=>{miss(x)});
add("qualified_miss_current_completion_contradiction",x=>{miss(x);x.completion.witnessed=["publish","notify"]});
add("missing_current_run_attempt",x=>{delete x.run.attempt});
add("invalid_known_attempt_identity",x=>{x.run.knownAttempts=[1,null]});
add("miss_original_actor_swapped_without_new_authority",x=>{miss(x);x.run.originalActor="mallory"});
add("miss_authorized_actor_missing",x=>{miss(x);delete x.permission.authorizedActor});
add("miss_authorized_actor_mismatch",x=>{miss(x);x.permission.authorizedActor="mallory"});
add("miss_owner_generation_null_pair",x=>{miss(x);x.permission.ownerExpected=null;x.permission.ownerCurrent=null});
add("miss_owner_generation_missing_pair",x=>{miss(x);delete x.permission.ownerExpected;delete x.permission.ownerCurrent});
add("miss_owner_generation_negative_pair",x=>{miss(x);x.permission.ownerExpected=-1;x.permission.ownerCurrent=-1});
add("miss_completion_revision_drift",x=>{miss(x);x.completion.commitVersion=10});
add("miss_fence_authority_generation_zero",x=>{miss(x);x.fence.authorityRead=0;x.fence.authorityCommit=0});
add("self_attack_issuer_flag_not_signature",x=>{x.run.triggeringActor="simulated-forger"});
add("self_attack_fence_flag_not_real_sink",x=>{miss(x);x.fence.atomic=true});
const goodString=v=>typeof v==="string"&&v.length>0;
const uniqueStrings=a=>Array.isArray(a)&&a.length>0&&a.every(goodString)&&new Set(a).size===a.length;
const uniqueAttempts=a=>Array.isArray(a)&&a.length>0&&a.every(n=>Number.isSafeInteger(n)&&n>0)&&new Set(a).size===a.length;
function setEqual(a,b){return uniqueStrings(a)&&uniqueStrings(b)&&a.length===b.length&&a.every(v=>b.includes(v))}
function attemptEqual(a,b){return uniqueAttempts(a)&&uniqueAttempts(b)&&a.length===b.length&&a.every(v=>b.includes(v))}
function safeMiss(x){const a=x.task,q=x.query,r=x.run;return q.status==="MISS"&&q.authoritative===true&&q.issuerAttested===true&&q.retained===true&&q.runId===r.id&&q.task===a.id&&q.operation===a.operation&&q.intent===a.intent&&q.target===a.target&&setEqual(q.members,a.required)&&attemptEqual(q.attempts,r.knownAttempts)&&Number.isSafeInteger(q.appliedThrough)&&q.appliedThrough>=r.latestPotentialEffectSeq}
function currentDone(x){const c=x.completion,a=x.task;return c.protected===true&&c.issuerAttested===true&&c.target===a.target&&setEqual(c.required,a.required)&&setEqual(c.witnessed,a.required)&&Number.isSafeInteger(c.readVersion)&&c.readVersion===c.commitVersion}
function weakRun(x){return x.seen.runIds.includes(x.run.id)?"SKIP_RUN":"RETRY_RUN"}
function weakAttempt(x){return x.seen.runAttempts.includes(x.run.id+"/"+x.run.attempt)?"SKIP_ATTEMPT":"RETRY_ATTEMPT"}
function weakJob(x){return x.run.jobState==="success"?"DONE_JOB":"NOT_DONE_JOB"}
function reference(x){
 const a=x.task,r=x.run,p=x.receipts,c=x.completion;
 if(![a.id,a.operation,a.intent,a.target,r.id,r.originalActor,r.triggeringActor,r.eventSha,r.eventRef].every(goodString)||!uniqueAttempts(r.knownAttempts)||!Number.isSafeInteger(r.attempt)||!r.knownAttempts.includes(r.attempt)||!Number.isSafeInteger(r.latestPotentialEffectSeq))return "BAD_IDENTITY_STOP";
 if(!uniqueStrings(a.required)||!uniqueStrings(a.currentMembers)||!setEqual(a.required,a.currentMembers))return "MEMBERSHIP_CONFLICT";
 if(!Array.isArray(p)||p.some(z=>!z||!goodString(z.id)||!goodString(z.member)||!Number.isSafeInteger(z.attempt)||!goodString(z.runId)))return "RECEIPT_IDENTITY_UNKNOWN";
 if(new Set(p.map(z=>z.id)).size!==p.length||new Set(p.map(z=>z.member)).size!==p.length)return "RECEIPT_DUPLICATE_STOP";
 if(p.some(z=>z.runId!==r.id||!r.knownAttempts.includes(z.attempt)||z.task!==a.id||z.operation!==a.operation||z.intent!==a.intent||z.target!==a.target))return "RECEIPT_SCOPE_CONFLICT";
 if(p.some(z=>!a.required.includes(z.member)))return "RECEIPT_EXTRA_STOP";
 if(p.length&&safeMiss(x))return "EVIDENCE_CONFLICT";
 if(p.some(z=>z.issuerAttested!==true))return "RECEIPT_UNATTESTED_STOP";
 if(p.some(z=>z.effectTimeAuthorized!==true))return "HIST_AUTH_INVALID_STOP";
 if(p.some(z=>z.orderWitness!==true))return "TEMPORAL_UNKNOWN_STOP";
 if(p.length){
  if(!setEqual(p.map(z=>z.member),a.required))return "PARTIAL_EFFECT_STOP";
  return currentDone(x)?"MODEL_DONE":"CURRENT_COMPLETION_UNKNOWN";
 }
 if(!safeMiss(x))return "PRIOR_UNKNOWN_STOP";
 if(currentDone(x))return "COMPLETION_MISS_CONFLICT";
 const k=x.permission;
 if(!(k.active===true&&k.originalActorAllowed===true&&goodString(k.authorizedActor)&&k.authorizedActor===r.originalActor&&k.credentialValid===true&&k.approvalValid===true&&Number.isSafeInteger(k.ownerExpected)&&k.ownerExpected>0&&Number.isSafeInteger(k.ownerCurrent)&&k.ownerExpected===k.ownerCurrent&&Number.isSafeInteger(k.now)&&Number.isSafeInteger(k.validUntil)&&k.now<=k.validUntil))return "NO_CURRENT_PERMISSION";
 if(!(c.protected===true&&c.issuerAttested===true&&c.target===a.target&&setEqual(c.required,a.required)&&Array.isArray(c.witnessed)&&c.witnessed.length===0&&Number.isSafeInteger(c.readVersion)&&c.readVersion>=0&&c.readVersion===c.commitVersion))return "CURRENT_SCOPE_UNKNOWN";
 const f=x.fence;
 return f.atomic===true&&f.sinkOperation===a.operation&&Number.isSafeInteger(f.authorityRead)&&f.authorityRead>0&&f.authorityRead===f.authorityCommit?"MODEL_RETRY_GATED":"TOCTOU_STOP";
}
// Independently coded primitive projection, no call to reference or shared proof helpers
// Both paths share authored facts, field vocabulary, semantics, and V8 runtime
function verify(z){
 const t=z.task,r=z.run,receipts=z.receipts;
 const str=v=>typeof v==="string"&&v.length>0;
 const ss=a=>Array.isArray(a)&&a.length>0&&a.every(str)&&new Set(a).size===a.length;
 const nn=a=>Array.isArray(a)&&a.length>0&&a.every(n=>Number.isSafeInteger(n)&&n>0)&&new Set(a).size===a.length;
 const same=(a,b,type)=>{if(type==="nums"){if(!nn(a)||!nn(b))return false}else if(!ss(a)||!ss(b))return false;return a.length===b.length&&a.slice().sort().every((v,i)=>v===b.slice().sort()[i])};
 if(![t.id,t.operation,t.intent,t.target,r.id,r.originalActor,r.triggeringActor,r.eventSha,r.eventRef].every(str)||!nn(r.knownAttempts)||!Number.isSafeInteger(r.attempt)||r.knownAttempts.indexOf(r.attempt)<0||!Number.isSafeInteger(r.latestPotentialEffectSeq))return "BAD_IDENTITY_STOP";
 if(!ss(t.required)||!ss(t.currentMembers)||!same(t.required,t.currentMembers,"text"))return "MEMBERSHIP_CONFLICT";
 if(!Array.isArray(receipts)||receipts.some(p=>!p||!str(p.id)||!str(p.member)||!str(p.runId)||!Number.isSafeInteger(p.attempt)))return "RECEIPT_IDENTITY_UNKNOWN";
 const seenIds=new Set(),seenMembers=new Set();
 for(const p of receipts){if(seenIds.has(p.id)||seenMembers.has(p.member))return "RECEIPT_DUPLICATE_STOP";seenIds.add(p.id);seenMembers.add(p.member)}
 for(const p of receipts){if(p.runId!==r.id||r.knownAttempts.indexOf(p.attempt)<0||p.task!==t.id||p.operation!==t.operation||p.intent!==t.intent||p.target!==t.target)return "RECEIPT_SCOPE_CONFLICT"}
 for(const p of receipts){if(t.required.indexOf(p.member)<0)return "RECEIPT_EXTRA_STOP"}
 const q=z.query;
 const miss=q.status==="MISS"&&q.authoritative===true&&q.issuerAttested===true&&q.retained===true&&q.runId===r.id&&q.task===t.id&&q.operation===t.operation&&q.intent===t.intent&&q.target===t.target&&same(q.members,t.required,"text")&&same(q.attempts,r.knownAttempts,"nums")&&Number.isSafeInteger(q.appliedThrough)&&q.appliedThrough>=r.latestPotentialEffectSeq;
 if(receipts.length&&miss)return "EVIDENCE_CONFLICT";
 for(const p of receipts)if(p.issuerAttested!==true)return "RECEIPT_UNATTESTED_STOP";
 for(const p of receipts)if(p.effectTimeAuthorized!==true)return "HIST_AUTH_INVALID_STOP";
 for(const p of receipts)if(p.orderWitness!==true)return "TEMPORAL_UNKNOWN_STOP";
 const c=z.completion;
 const current=c.protected===true&&c.issuerAttested===true&&c.target===t.target&&same(c.required,t.required,"text")&&same(c.witnessed,t.required,"text")&&Number.isSafeInteger(c.readVersion)&&c.readVersion===c.commitVersion;
 if(receipts.length){if(!same([...seenMembers],t.required,"text"))return "PARTIAL_EFFECT_STOP";return current?"MODEL_DONE":"CURRENT_COMPLETION_UNKNOWN"}
 if(!miss)return "PRIOR_UNKNOWN_STOP";
 if(current)return "COMPLETION_MISS_CONFLICT";
 const k=z.permission;
 if(k.active!==true||k.originalActorAllowed!==true||!str(k.authorizedActor)||k.authorizedActor!==r.originalActor||k.credentialValid!==true||k.approvalValid!==true||!Number.isSafeInteger(k.ownerExpected)||k.ownerExpected<=0||!Number.isSafeInteger(k.ownerCurrent)||k.ownerExpected!==k.ownerCurrent||!Number.isSafeInteger(k.now)||!Number.isSafeInteger(k.validUntil)||k.now>k.validUntil)return "NO_CURRENT_PERMISSION";
 if(c.protected!==true||c.issuerAttested!==true||c.target!==t.target||!same(c.required,t.required,"text")||!Array.isArray(c.witnessed)||c.witnessed.length!==0||!Number.isSafeInteger(c.readVersion)||c.readVersion<0||c.readVersion!==c.commitVersion)return "CURRENT_SCOPE_UNKNOWN";
 const f=z.fence;
 return f.atomic===true&&f.sinkOperation===t.operation&&Number.isSafeInteger(f.authorityRead)&&f.authorityRead>0&&f.authorityRead===f.authorityCommit?"MODEL_RETRY_GATED":"TOCTOU_STOP";
}
const rows=scenarios.map(({id,primitive})=>({id,primitive,weak_run:weakRun(primitive),weak_attempt:weakAttempt(primitive),weak_job:weakJob(primitive),reference:reference(primitive),verifier:verify(primitive)}));
const failures=[];
if(rows.length<35||new Set(rows.map(x=>x.id)).size!==rows.length)failures.push("scenario identity uniqueness or coverage");
for(const x of rows)if(x.reference!==x.verifier)failures.push("model/verifier mismatch "+x.id);
const requireDecision=(id,val)=>rows.find(x=>x.id===id)?.reference===val;
const probes={
 stableRunNotCompletion:requireDecision("same_run_changed_business_operation","RECEIPT_SCOPE_CONFLICT"),
 newAttemptNotRetryProof:requireDecision("baseline_old_attempt_positive","MODEL_DONE")&&rows.find(x=>x.id==="baseline_old_attempt_positive").weak_attempt==="RETRY_ATTEMPT",
 actorDomainsSeparated:requireDecision("miss_rerunner_lacks_privilege_original_valid","MODEL_RETRY_GATED"),
 originalActorRevoked:requireDecision("miss_current_authority_revoked","NO_CURRENT_PERMISSION"),
 exactAttemptCoverage:requireDecision("miss_attempt_coverage_gap","PRIOR_UNKNOWN_STOP"),
 membershipCoverage:requireDecision("miss_membership_coverage_gap","PRIOR_UNKNOWN_STOP"),
 positiveNegativeConflict:requireDecision("positive_receipt_and_authoritative_miss","EVIDENCE_CONFLICT"),
 sameCountMembershipDrift:requireDecision("stable_run_id_new_membership_same_count","MEMBERSHIP_CONFLICT"),
 duplicateReceiptStop:requireDecision("receipt_duplicate_member_same_count","RECEIPT_DUPLICATE_STOP"),
 extraReceiptStop:requireDecision("receipt_extra_member","RECEIPT_EXTRA_STOP"),
 missingReceiptId:requireDecision("receipt_missing_id","RECEIPT_IDENTITY_UNKNOWN"),
 historicalAuthorization:requireDecision("receipt_effect_time_unauthorized","HIST_AUTH_INVALID_STOP"),
 unknownPriorStops:requireDecision("new_attempt_without_receipts_unknown","PRIOR_UNKNOWN_STOP"),
 exactNegativeBoundary:requireDecision("qualified_miss_all_known_attempts","MODEL_RETRY_GATED"),
 fenceDrift:requireDecision("miss_commit_revision_drift","TOCTOU_STOP"),
 noAtomicFence:requireDecision("miss_sink_fence_not_atomic","TOCTOU_STOP"),
 completionMissConflict:requireDecision("qualified_miss_current_completion_contradiction","COMPLETION_MISS_CONFLICT"),
 malformedAttempt:requireDecision("invalid_known_attempt_identity","BAD_IDENTITY_STOP"),
 nonNumericWatermark:requireDecision("miss_non_numeric_watermark","PRIOR_UNKNOWN_STOP"),
 originalActorChangeRequiresNewBoundAuthority:requireDecision("miss_original_actor_swapped_without_new_authority","NO_CURRENT_PERMISSION"),
 originalActorAuthorityMissingFailsClosed:requireDecision("miss_authorized_actor_missing","NO_CURRENT_PERMISSION"),
 originalActorAuthorityMismatchFailsClosed:requireDecision("miss_authorized_actor_mismatch","NO_CURRENT_PERMISSION"),
 nullOwnerGenerationPairNotAllowed:requireDecision("miss_owner_generation_null_pair","NO_CURRENT_PERMISSION"),
 missingOwnerGenerationPairNotAllowed:requireDecision("miss_owner_generation_missing_pair","NO_CURRENT_PERMISSION"),
 negativeOwnerGenerationPairNotAllowed:requireDecision("miss_owner_generation_negative_pair","NO_CURRENT_PERMISSION"),
 currentScopeRevisionDriftNotAllowed:requireDecision("miss_completion_revision_drift","CURRENT_SCOPE_UNKNOWN"),
 invalidAuthorityGenerationNotAllowed:requireDecision("miss_fence_authority_generation_zero","TOCTOU_STOP")
};
for(const [k,v] of Object.entries(probes))if(!v)failures.push("assertion "+k);
if(failures.length)throw Error("Ballast producer verification FAIL: "+failures.join(", "));
const count=(key,value)=>rows.filter(x=>x[key]===value).length;
const summary={
 trials:rows.length,unique_trials:new Set(rows.map(x=>x.id)).size,weak_path_decisions:rows.length*3,reference_decisions:rows.length,limited_verifier_decisions:rows.length,
 reference_verifier_agreement:rows.filter(x=>x.reference===x.verifier).length,weak_run_skip:count("weak_run","SKIP_RUN"),weak_attempt_retry:count("weak_attempt","RETRY_ATTEMPT"),weak_job_done:count("weak_job","DONE_JOB"),
 model_done:count("reference","MODEL_DONE"),model_retry_gated:count("reference","MODEL_RETRY_GATED"),
 model_stops:rows.filter(x=>!["MODEL_DONE","MODEL_RETRY_GATED"].includes(x.reference)).length,
 reference_counts:Object.fromEntries([...new Set(rows.map(x=>x.reference))].map(y=>[y,count("reference",y)])),
 assertions:Object.keys(probes).length,assertion_failures:0,
 real_github_rerun_calls:0,real_s3_put_calls:0,real_effect_sink_calls:0,actual_authority_queries:0
};
console.log(JSON.stringify({schema:"ballast-actions-rerun-effect-identity-2026-11-22",evidence_origin:"AUTHORED_SYNTHETIC_FACTS",summary,assertions:probes,rows,self_attacks:{issuer:"issuerAttested boolean is not a signed receipt or external authority proof",atomicity:"fence.atomic boolean is not a real protected compare-and-effect",runAttempt:"stable run ID and increased attempt describe orchestration identity, not stable business effect identity",githubActor:"originalActor privilege context does not prove a separate downstream sink credential or approval"}},null,2));
