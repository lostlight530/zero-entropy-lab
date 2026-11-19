"use strict";
/* Ballast 2026-11-20, bounded synthetic Temporal reset/effect identity fixture
   No Temporal server, payment sink, cryptographic issuer or atomic compare is called */
const BASE={
 task:"T20",workflow:"W20",fromRun:"R1",toRun:"R2",activity:"A1",
 op:"OP20",target:"U1",required:["E1"],observed:["E1"],
 receipt:{run:"R1",op:"OP20",target:"U1",members:["E1"],issuer:true,effectTimeAuth:true,orderOk:true},
 prior:"HIT",negative:null,permission:true,owner:5,worker:5,
 revision:11,commitRevision:11,sinkFence:true,keyBoundOp:"OP20",
 completionProtected:true,historyActivityCompleted:false,
 weakCurrentRunReceipt:false,weakStoredKeyMatch:false
};
const copy=()=>JSON.parse(JSON.stringify(BASE));
const authoritativeMiss=x=>{let n=x.negative;return !!(n&&n.outcome==="MISS"&&n.op===x.op&&n.target===x.target&&Array.isArray(n.coveredRuns)&&n.coveredRuns.includes(x.fromRun)&&n.coveredRuns.includes(x.toRun)&&Number.isFinite(n.watermark)&&Number.isFinite(n.cutoff)&&n.watermark>=n.cutoff&&n.retention===true&&n.issuer===true)};
const exactSet=(a,b)=>Array.isArray(a)&&Array.isArray(b)&&a.length>0&&a.length===b.length&&new Set(a).size===a.length&&new Set(b).size===b.length&&a.every(v=>typeof v==="string"&&v&&b.includes(v));
function weak(x){
 if(x.weakStoredKeyMatch)return "SKIP_KEY";
 if(x.weakCurrentRunReceipt)return "SKIP_NEW_RUN";
 return x.permission?"RETRY":"NO_PERMISSION";
}
function reference(x){
 if(![x.task,x.workflow,x.fromRun,x.toRun,x.activity,x.op,x.target].every(v=>typeof v==="string"&&v)||x.fromRun===x.toRun)return "IDENTITY_UNKNOWN";
 if(typeof x.keyBoundOp!=="string"||x.keyBoundOp!==x.op)return "INTENT_CONFLICT";
 if(!exactSet(x.required,x.observed))return "EFFECT_SET_CONFLICT";
 const p=x.receipt;
 if(p!==null){
   if(!p||![p.run,p.op,p.target].every(v=>typeof v==="string"&&v)||!Array.isArray(p.members))return "RECEIPT_IDENTITY_UNKNOWN";
   if(p.op!==x.op||p.target!==x.target||![x.fromRun,x.toRun].includes(p.run))return "RECEIPT_IDENTITY_CONFLICT";
   if(authoritativeMiss(x))return "EVIDENCE_CONFLICT";
   if(p.effectTimeAuth!==true)return "HISTORICAL_AUTH_INVALID";
   if(p.issuer!==true)return "ISSUER_UNKNOWN";
   if(p.orderOk!==true)return "TEMPORAL_UNKNOWN";
   if(!exactSet(x.required,p.members))return "MEMBER_RECEIPT_GAP";
   if(x.owner!==x.worker)return "OWNER_STALE";
   if(x.revision!==x.commitRevision||x.completionProtected!==true)return "TOCTOU_STOP";
   return "MODEL_ALREADY_DONE";
 }
 if(!authoritativeMiss(x))return "PRIOR_UNKNOWN_STOP";
 if(x.permission!==true)return "NO_CURRENT_PERMISSION";
 if(x.owner!==x.worker)return "OWNER_STALE";
 if(x.revision!==x.commitRevision||x.sinkFence!==true)return "TOCTOU_STOP";
 return "MODEL_RETRY_GATED";
}
/* The review evaluator reconstructs from primitive fields, not by calling reference()
   Independence: implementation partial, fixture shared, semantics shared, authority none */
function verify(x){
 const id=[x.task,x.workflow,x.fromRun,x.toRun,x.activity,x.op,x.target];
 if(id.some(v=>typeof v!=="string"||v.length===0)||x.fromRun===x.toRun)return "IDENTITY_UNKNOWN";
 if(x.keyBoundOp!==x.op||typeof x.keyBoundOp!=="string")return "INTENT_CONFLICT";
 const setsOk=(arr)=>Array.isArray(arr)&&arr.length>0&&arr.every(v=>typeof v==="string"&&v.length>0)&&new Set(arr).size===arr.length;
 const same=(a,b)=>setsOk(a)&&setsOk(b)&&a.length===b.length&&a.filter(v=>b.indexOf(v)>=0).length===a.length;
 if(!same(x.required,x.observed))return "EFFECT_SET_CONFLICT";
 const n=x.negative;
 const nOk=!!n&&n.outcome==="MISS"&&n.op===x.op&&n.target===x.target&&Array.isArray(n.coveredRuns)&&[x.fromRun,x.toRun].every(z=>n.coveredRuns.indexOf(z)>=0)&&typeof n.watermark==="number"&&typeof n.cutoff==="number"&&Number.isFinite(n.watermark)&&Number.isFinite(n.cutoff)&&n.watermark>=n.cutoff&&n.retention===true&&n.issuer===true;
 const p=x.receipt;
 if(p!==null){
  if(!p||typeof p.run!=="string"||!p.run||typeof p.op!=="string"||!p.op||typeof p.target!=="string"||!p.target||!Array.isArray(p.members))return "RECEIPT_IDENTITY_UNKNOWN";
  if(x.op!==p.op||x.target!==p.target||(p.run!==x.fromRun&&p.run!==x.toRun))return "RECEIPT_IDENTITY_CONFLICT";
  if(nOk)return "EVIDENCE_CONFLICT";
  if(p.effectTimeAuth!==true)return "HISTORICAL_AUTH_INVALID";
  if(p.issuer!==true)return "ISSUER_UNKNOWN";
  if(p.orderOk!==true)return "TEMPORAL_UNKNOWN";
  if(!same(x.required,p.members))return "MEMBER_RECEIPT_GAP";
  if(x.owner!==x.worker)return "OWNER_STALE";
  if(x.revision!==x.commitRevision||x.completionProtected!==true)return "TOCTOU_STOP";
  return "MODEL_ALREADY_DONE";
 }
 if(!nOk)return "PRIOR_UNKNOWN_STOP";
 if(x.permission!==true)return "NO_CURRENT_PERMISSION";
 if(x.owner!==x.worker)return "OWNER_STALE";
 if(x.revision!==x.commitRevision||x.sinkFence!==true)return "TOCTOU_STOP";
 return "MODEL_RETRY_GATED";
}
const fullMiss=()=>({outcome:"MISS",op:"OP20",target:"U1",coveredRuns:["R1","R2"],watermark:20,cutoff:19,retention:true,issuer:true});
const scenarios=[];
function trial(id,fn){const x=copy();fn(x);scenarios.push({id,facts:x})}
trial("baseline_reset_after_effect",()=>{});
trial("workflow_history_omits_completed_activity",x=>{x.historyActivityCompleted=false});
trial("old_run_positive_current_permission_revoked",x=>{x.permission=false});
trial("old_run_receipt_historical_grant_invalid",x=>{x.receipt.effectTimeAuth=false});
trial("old_run_receipt_wrong_operation",x=>{x.receipt.op="OP_OTHER"});
trial("old_run_receipt_wrong_incarnation",x=>{x.target="U2"});
trial("receipt_missing_run_identity",x=>{delete x.receipt.run});
trial("receipt_duplicate_members",x=>{x.receipt.members=["E1","E1"]});
trial("aggregate_count_two_receipt_one",x=>{x.required=["E1","E2"];x.observed=["E1","E2"]});
trial("equal_count_wrong_member",x=>{x.required=["E1","E2"];x.observed=["E1","E3"];x.receipt.members=["E1","E3"]});
trial("authoritative_miss_conflicts_with_hit",x=>{x.negative=fullMiss()});
trial("unauthenticated_receipt",x=>{x.receipt.issuer=false});
trial("receipt_temporal_order_unverified",x=>{x.receipt.orderOk=false});
trial("unknown_prior_after_reset",x=>{x.receipt=null;x.prior="UNKNOWN"});
trial("miss_new_run_only_scope",x=>{x.receipt=null;x.prior="MISS";x.negative=fullMiss();x.negative.coveredRuns=["R2"]});
trial("miss_before_old_attempt_watermark",x=>{x.receipt=null;x.prior="MISS";x.negative=fullMiss();x.negative.watermark=18});
trial("miss_after_retention_expiry",x=>{x.receipt=null;x.prior="MISS";x.negative=fullMiss();x.negative.retention=false});
trial("scoped_miss_with_prospective_sink_fence",x=>{x.receipt=null;x.prior="MISS";x.negative=fullMiss()});
trial("scoped_miss_without_sink_fence",x=>{x.receipt=null;x.prior="MISS";x.negative=fullMiss();x.sinkFence=false});
trial("scoped_miss_owner_generation_drift",x=>{x.receipt=null;x.prior="MISS";x.negative=fullMiss();x.worker=4});
trial("scoped_miss_commit_revision_drift",x=>{x.receipt=null;x.prior="MISS";x.negative=fullMiss();x.commitRevision=12});
trial("scoped_miss_permission_revoked",x=>{x.receipt=null;x.prior="MISS";x.negative=fullMiss();x.permission=false});
trial("stable_key_reused_for_new_business_intent",x=>{x.op="OP21";x.weakStoredKeyMatch=true});
trial("self_attack_authored_issuer_not_cryptographic",x=>{x.receipt.issuer=true});
trial("self_attack_authored_fence_not_atomic",x=>{x.receipt=null;x.prior="MISS";x.negative=fullMiss();x.sinkFence=true});
const rows=scenarios.map(({id,facts})=>({id,weak:weak(facts),reference:reference(facts),verifier:verify(facts)}));
if(scenarios.length!==25||new Set(scenarios.map(z=>z.id)).size!==25)throw Error("scenario identity collision");
if(rows.some(z=>z.reference!==z.verifier))throw Error("shared-contract disagreement");
if(rows.find(z=>z.id==="authoritative_miss_conflicts_with_hit").reference!=="EVIDENCE_CONFLICT")throw Error("conflict not detected");
if(rows.find(z=>z.id==="aggregate_count_two_receipt_one").reference!=="MEMBER_RECEIPT_GAP")throw Error("multi-member gap not detected");
if(rows.find(z=>z.id==="scoped_miss_with_prospective_sink_fence").reference!=="MODEL_RETRY_GATED")throw Error("safe retry model not exercised");
if(rows.find(z=>z.id==="old_run_positive_current_permission_revoked").reference!=="MODEL_ALREADY_DONE")throw Error("historical permission conflated");
const count=(key,v)=>rows.filter(z=>z[key]===v).length;
const summary={scenarios:scenarios.length,weakRetry:count("weak","RETRY"),weakSkipByKey:count("weak","SKIP_KEY"),modelAlreadyDone:count("reference","MODEL_ALREADY_DONE"),modelRetryGated:count("reference","MODEL_RETRY_GATED"),weakReferenceDivergences:rows.filter(z=>z.weak!==z.reference).length,sharedContractVerifierAgreements:rows.filter(z=>z.reference===z.verifier).length,failures:0,actualSinkCalls:0,realTemporalServerCalls:0,realAuthorityQueries:0};
console.log(JSON.stringify({schema:"ballast-reset-cross-run-effect-2026-11-20",sourcePublisherEvidence:["Temporal reset and Activity docs","AWS Step Functions redrive comparison"],fixtures:scenarios,rows,summary,selfAttack:{authoredIssuer:"issuer=true without cryptographic signature and authoritative log does not prove real occurrence",authoredSinkFence:"sinkFence=true without actual compare-and-effect does not eliminate reset-time concurrent duplicate",limit:"MODEL_ALREADY_DONE and MODEL_RETRY_GATED are synthetic classifications, not performed external effects"}},null,2));
