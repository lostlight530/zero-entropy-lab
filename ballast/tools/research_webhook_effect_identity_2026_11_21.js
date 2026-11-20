"use strict";
// Ballast 2026-11-21 bounded synthetic webhook-to-effect identity experiment
// Run with: node ballast/tools/research_webhook_effect_identity_2026_11_21.js
// All sources and receipts below are authored model fixtures, not Stripe/GitHub or sink traces
const clone=x=>JSON.parse(JSON.stringify(x));
const base={
 event:{publisher:"stripe",account:"acct-A",id:"evt-21a",delivery:"delivery-1",object:"invoice-21",type:"invoice.paid",created:300},
 action:{task:"T21",run:"R21",attempt:"A1",attempts:["A1"],attemptWatermark:40,operation:"op-invoice-21",intent:"activate-access",incarnation:"cycle-21",object:"invoice-21",type:"invoice.paid",required:["notify","ledger"]},
 seen:{events:["evt-21a"],objectTypes:["acct-A/invoice-21/invoice.paid"]},
 receipts:[
  {id:"r-notify",publisher:"stripe",account:"acct-A",task:"T21",operation:"op-invoice-21",intent:"activate-access",incarnation:"cycle-21",object:"invoice-21",type:"invoice.paid",effect:"notify",issuerAttested:true,authorizedAtEffect:true,orderWitness:true},
  {id:"r-ledger",publisher:"stripe",account:"acct-A",task:"T21",operation:"op-invoice-21",intent:"activate-access",incarnation:"cycle-21",object:"invoice-21",type:"invoice.paid",effect:"ledger",issuerAttested:true,authorizedAtEffect:true,orderWitness:true}
 ],
 query:{state:"UNKNOWN",authoritative:false,publisher:"stripe",account:"acct-A",task:"T21",operation:"op-invoice-21",intent:"activate-access",incarnation:"cycle-21",object:"invoice-21",type:"invoice.paid",members:["notify","ledger"],attempts:["A1"],watermark:50,retained:true},
 permission:{active:true,approval:true,credential:true,ownerExpected:7,ownerCurrent:7,now:400,validUntil:500},
 completion:{protected:true,target:"cycle-21",revision:12,readRevision:12,required:["notify","ledger"],witnessed:["notify","ledger"],issuerAttested:true},
 fence:{protected:true,readRevision:12,commitRevision:12,authorityRead:9,authorityCurrent:9}
};
const cases=[];
function add(id,change){let x=clone(base);change(x);cases.push({id,facts:x})}
add("baseline_exact_positive",x=>{});
add("redelivery_new_transport_id",x=>{x.event.delivery="delivery-2"});
add("new_event_object_same_business_effect",x=>{x.event.id="evt-21b"});
add("event_id_seen_but_new_intent",x=>{x.action.intent="activate-different-access";x.event.id="evt-21a"});
add("object_type_key_seen_new_business_operation",x=>{x.action.operation="op-new-invoice-21";x.event.id="evt-21c"});
add("duplicate_receipt_same_member",x=>{x.receipts[1]=clone(x.receipts[0]);x.receipts[1].id="r-other"});
add("unexpected_receipt_member",x=>{x.receipts.push({...clone(x.receipts[0]),id:"r-extra",effect:"unexpected"})});
add("missing_one_required_receipt",x=>{x.receipts.pop()});
add("positive_receipt_unattested",x=>{x.receipts[0].issuerAttested=false});
add("positive_receipt_historical_grant_invalid",x=>{x.receipts[0].authorizedAtEffect=false});
add("positive_receipt_order_unknown",x=>{x.receipts[0].orderWitness=false});
add("positive_and_authoritative_miss_conflict",x=>{x.query.state="MISS";x.query.authoritative=true});
add("no_receipt_query_unknown",x=>{x.receipts=[]});
add("miss_attempt_coverage_incomplete",x=>{x.receipts=[];x.query.state="MISS";x.query.authoritative=true;x.query.attempts=[]});
add("miss_effect_set_coverage_incomplete",x=>{x.receipts=[];x.query.state="MISS";x.query.authoritative=true;x.query.members=["notify"]});
add("miss_watermark_before_attempt",x=>{x.receipts=[];x.query.state="MISS";x.query.authoritative=true;x.query.watermark=39});
add("miss_retention_expired",x=>{x.receipts=[];x.query.state="MISS";x.query.authoritative=true;x.query.retained=false});
add("miss_authoritative_all_covered",x=>{x.receipts=[];x.query.state="MISS";x.query.authoritative=true;x.seen.events=[];x.seen.objectTypes=[]});
add("miss_current_permission_revoked",x=>{x.receipts=[];x.query.state="MISS";x.query.authoritative=true;x.permission.approval=false});
add("miss_owner_generation_drift",x=>{x.receipts=[];x.query.state="MISS";x.query.authoritative=true;x.permission.ownerCurrent=8});
add("miss_commit_fence_drift",x=>{x.receipts=[];x.query.state="MISS";x.query.authoritative=true;x.fence.commitRevision=13});
add("positive_current_target_reincarnated",x=>{x.completion.target="cycle-22"});
add("positive_current_membership_changed",x=>{x.completion.witnessed=["notify","ledger","surprise"]});
add("query_other_account_not_authoritative_for_this",x=>{x.receipts=[];x.query.state="MISS";x.query.authoritative=true;x.query.account="acct-other"});
add("self_attack_authored_issuer_bit_not_signature",x=>{x.event.delivery="delivery-forged"; /* no real signature data exist, all authored issuer bits remain true */});
add("self_attack_authored_fence_bit_not_sink_atomicity",x=>{x.receipts=[];x.query.state="MISS";x.query.authoritative=true;x.fence.protected=true; /* no actual compare-and-effect is executed */});
function weakEvent(x){return x.seen.events.includes(x.event.id)?"SKIP_EVENT":"PROCESS_EVENT"}
function weakObject(x){return x.seen.objectTypes.includes(x.event.account+"/"+x.event.object+"/"+x.event.type)?"SKIP_OBJECT_TYPE":"PROCESS_OBJECT_TYPE"}
function weakCount(x){return x.receipts.length===x.action.required.length?"COMPLETE_BY_COUNT":"RETRY_BY_COUNT"}
function uniqueExact(a,b){return a.length===b.length&&new Set(a).size===a.length&&new Set(b).size===b.length&&a.every(x=>b.includes(x))}
function qualifiedMiss(x){let q=x.query,a=x.action,e=x.event;return q.state==="MISS"&&q.authoritative===true&&q.publisher===e.publisher&&q.account===e.account&&q.task===a.task&&q.operation===a.operation&&q.intent===a.intent&&q.incarnation===a.incarnation&&q.object===a.object&&q.type===a.type&&q.retained===true&&Number.isFinite(q.watermark)&&q.watermark>=a.attemptWatermark&&uniqueExact(q.members,a.required)&&uniqueExact(q.attempts,a.attempts)}
function currentProof(x){let c=x.completion,a=x.action;return c.protected===true&&c.issuerAttested===true&&c.target===a.incarnation&&c.revision===c.readRevision&&uniqueExact(c.required,a.required)&&uniqueExact(c.witnessed,a.required)}
function permission(x){let p=x.permission;return p.active===true&&p.approval===true&&p.credential===true&&p.ownerExpected===p.ownerCurrent&&p.now<=p.validUntil}
function reference(x){
 let a=x.action,e=x.event,r=x.receipts;
 if(!a.required.length||!uniqueExact(a.required,[...new Set(a.required)])||!a.attempts.length||!uniqueExact(a.attempts,[...new Set(a.attempts)]))return "BAD_REQUIRED_IDENTITY_STOP";
 if(e.object!==a.object||e.type!==a.type)return "EVENT_BINDING_CONFLICT";
 if(new Set(r.map(z=>z.id)).size!==r.length||new Set(r.map(z=>z.effect)).size!==r.length)return "RECEIPT_DUPLICATE_STOP";
 if(r.some(z=>z.publisher!==e.publisher||z.account!==e.account||z.task!==a.task||z.operation!==a.operation||z.intent!==a.intent||z.incarnation!==a.incarnation||z.object!==a.object||z.type!==a.type))return "RECEIPT_SCOPE_CONFLICT";
 if(r.some(z=>!a.required.includes(z.effect)))return "RECEIPT_EXTRA_STOP";
 if(r.some(z=>z.issuerAttested!==true))return "RECEIPT_UNATTESTED_STOP";
 if(r.some(z=>z.authorizedAtEffect!==true))return "HIST_AUTH_INVALID_STOP";
 if(r.some(z=>z.orderWitness!==true))return "TEMPORAL_UNKNOWN_STOP";
 if(r.length&&qualifiedMiss(x))return "EVIDENCE_CONFLICT";
 if(r.length){
   if(!uniqueExact(r.map(z=>z.effect),a.required))return "PARTIAL_EFFECT_STOP";
   return currentProof(x)?"MODEL_DONE":"CURRENT_COMPLETION_UNKNOWN";
 }
 if(!qualifiedMiss(x))return "PRIOR_UNKNOWN_STOP";
 if(!permission(x))return "PERMISSION_DENIED";
 if(!currentProof(x))return "CURRENT_COMPLETION_UNKNOWN";
 let f=x.fence;
 return f.protected===true&&f.readRevision===f.commitRevision&&f.authorityRead===f.authorityCurrent?"MODEL_RETRY_GATED":"TOCTOU_STOP";
}
// Separate reconstruction over input primitives, never invokes reference or the shared proof helpers
// Implementation independence PARTIAL; same authored facts and semantic contract are explicitly shared
function verifier(z){
 const d=z.action,e=z.event,rr=z.receipts;
 const exact=(v,w)=>v.length===w.length&&(new Set(v)).size===v.length&&(new Set(w)).size===w.length&&v.slice().sort().join("|")===w.slice().sort().join("|");
 if(!d.required.length||!exact(d.required,Array.from(new Set(d.required)))||!d.attempts.length||!exact(d.attempts,Array.from(new Set(d.attempts))))return "BAD_REQUIRED_IDENTITY_STOP";
 if(d.object!==e.object||d.type!==e.type)return "EVENT_BINDING_CONFLICT";
 const receiptIds=rr.map(q=>q.id),receiptEffects=rr.map(q=>q.effect);
 if(new Set(receiptIds).size!==receiptIds.length||new Set(receiptEffects).size!==receiptEffects.length)return "RECEIPT_DUPLICATE_STOP";
 for(const q of rr){
  if([q.publisher,q.account,q.task,q.operation,q.intent,q.incarnation,q.object,q.type].join("|")!==[e.publisher,e.account,d.task,d.operation,d.intent,d.incarnation,d.object,d.type].join("|"))return "RECEIPT_SCOPE_CONFLICT";
 }
 for(const q of rr)if(!d.required.some(item=>item===q.effect))return "RECEIPT_EXTRA_STOP";
 for(const q of rr)if(q.issuerAttested!==true)return "RECEIPT_UNATTESTED_STOP";
 for(const q of rr)if(q.authorizedAtEffect!==true)return "HIST_AUTH_INVALID_STOP";
 for(const q of rr)if(q.orderWitness!==true)return "TEMPORAL_UNKNOWN_STOP";
 const q=z.query;
 const qIdentity=[q.publisher,q.account,q.task,q.operation,q.intent,q.incarnation,q.object,q.type].join("|");
 const expectedIdentity=[e.publisher,e.account,d.task,d.operation,d.intent,d.incarnation,d.object,d.type].join("|");
 const miss=q.state==="MISS"&&q.authoritative===true&&q.retained===true&&qIdentity===expectedIdentity&&q.watermark>=d.attemptWatermark&&exact(q.members,d.required)&&exact(q.attempts,d.attempts);
 if(rr.length&&miss)return "EVIDENCE_CONFLICT";
 const c=z.completion;
 const done=c.protected===true&&c.issuerAttested===true&&c.target===d.incarnation&&c.readRevision===c.revision&&exact(c.required,d.required)&&exact(c.witnessed,d.required);
 if(rr.length){
  if(!exact(receiptEffects,d.required))return "PARTIAL_EFFECT_STOP";
  return done?"MODEL_DONE":"CURRENT_COMPLETION_UNKNOWN";
 }
 if(!miss)return "PRIOR_UNKNOWN_STOP";
 const p=z.permission;
 if(!(p.active===true&&p.approval===true&&p.credential===true&&p.ownerExpected===p.ownerCurrent&&p.now<=p.validUntil))return "PERMISSION_DENIED";
 if(!done)return "CURRENT_COMPLETION_UNKNOWN";
 const f=z.fence;
 return f.protected===true&&f.readRevision===f.commitRevision&&f.authorityRead===f.authorityCurrent?"MODEL_RETRY_GATED":"TOCTOU_STOP";
}
const rows=cases.map(({id,facts})=>({
 id,primitive:facts,weak_event:weakEvent(facts),weak_object_type:weakObject(facts),
 weak_receipt_count:weakCount(facts),reference:reference(facts),verifier:verifier(facts),
 synthetic_effect_calls:0
}));
const failures=[];
if(new Set(rows.map(x=>x.id)).size!==rows.length)failures.push("duplicate scenario id");
for(const x of rows)if(x.reference!==x.verifier)failures.push("verifier mismatch "+x.id);
const keyChecks={
 newEventCanDuplicateEffect:rows.find(x=>x.id==="new_event_object_same_business_effect").weak_event==="PROCESS_EVENT"&&rows.find(x=>x.id==="new_event_object_same_business_effect").reference==="MODEL_DONE",
 oldEventCanMaskNewIntent:rows.find(x=>x.id==="event_id_seen_but_new_intent").weak_event==="SKIP_EVENT"&&rows.find(x=>x.id==="event_id_seen_but_new_intent").reference==="RECEIPT_SCOPE_CONFLICT",
 duplicateCountDoesNotComplete:rows.find(x=>x.id==="duplicate_receipt_same_member").weak_receipt_count==="COMPLETE_BY_COUNT"&&rows.find(x=>x.id==="duplicate_receipt_same_member").reference==="RECEIPT_DUPLICATE_STOP",
 extraCountDoesNotComplete:rows.find(x=>x.id==="unexpected_receipt_member").reference==="RECEIPT_EXTRA_STOP",
 conflictingMissStops:rows.find(x=>x.id==="positive_and_authoritative_miss_conflict").reference==="EVIDENCE_CONFLICT",
 scopedMissCanOnlyGate:rows.find(x=>x.id==="miss_authoritative_all_covered").reference==="MODEL_RETRY_GATED",
 unknownCoverageNeverRetries:["miss_attempt_coverage_incomplete","miss_effect_set_coverage_incomplete","miss_watermark_before_attempt","miss_retention_expired","query_other_account_not_authoritative_for_this"].every(id=>rows.find(x=>x.id===id).reference==="PRIOR_UNKNOWN_STOP"),
 fenceDriftStops:rows.find(x=>x.id==="miss_commit_fence_drift").reference==="TOCTOU_STOP"
};
for(const [name,ok] of Object.entries(keyChecks))if(!ok)failures.push(name);
const summary={
 case_count:rows.length,unique_case_count:new Set(rows.map(x=>x.id)).size,
 path_decisions:rows.length*4,reference_verifier_agreement:rows.filter(x=>x.reference===x.verifier).length,
 weak_event_process:rows.filter(x=>x.weak_event==="PROCESS_EVENT").length,
 weak_event_skip:rows.filter(x=>x.weak_event==="SKIP_EVENT").length,
 weak_object_process:rows.filter(x=>x.weak_object_type==="PROCESS_OBJECT_TYPE").length,
 weak_object_skip:rows.filter(x=>x.weak_object_type==="SKIP_OBJECT_TYPE").length,
 weak_count_complete:rows.filter(x=>x.weak_receipt_count==="COMPLETE_BY_COUNT").length,
 model_done:rows.filter(x=>x.reference==="MODEL_DONE").length,
 model_retry_gated:rows.filter(x=>x.reference==="MODEL_RETRY_GATED").length,
 fail_closed:rows.filter(x=>!["MODEL_DONE","MODEL_RETRY_GATED"].includes(x.reference)).length,
 reference_counts:Object.fromEntries([...new Set(rows.map(x=>x.reference))].map(k=>[k,rows.filter(x=>x.reference===k).length])),
 synthetic_effect_calls:0,live_provider_calls:0,source_attestation_calls:0,external_sink_calls:0,
 assertions:Object.keys(keyChecks).length,assertion_failures:failures.length,failures
};
console.log(JSON.stringify({study:"webhook-delivery-event-operation-effect-identity",source_provenance:"AUTHORED_SYNTHETIC_FACTS",summary,rows},null,2));
if(failures.length)throw Error("failed: "+failures.join(", "));

