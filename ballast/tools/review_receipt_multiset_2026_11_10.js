'use strict';

// 2026-11-10 same-date maintainer synthetic review, not independent authority

// Execute native Node CLI: node ballast/tools/review_receipt_multiset_2026_11_10.js

function makeCases(){
 function base(){
  const id={taskId:"task-10",runId:"run-10",attemptId:"attempt-10",messageId:"message-10",targetUid:"uid-10"};
  const receipt=(effectId,receiptId,at)=>({...id,effectId,receiptId,at,issuer:"issuer-10"});
  return {intent:{...id,expectedEffects:["A","B"],revision:7,attemptStartedAt:10},
   ack:true,receipts:[receipt("A","receipt-A",40),receipt("B","receipt-B",45)],
   grant:{issuer:"issuer-10",verified:true,startsAt:20,endsAt:70,taskId:id.taskId},
   query:{...id,ok:true,exact:true,at:90,watermark:90,retentionFrom:0,retentionUntil:100},
   negatives:[],currentPermission:false,
   completion:{targetUid:"uid-10",revision:7,predicate:true,guarded:true,committedAt:80}};
 }
 const spec=[
 ["valid",x=>{}],
 ["lost_ack_after_effect",x=>{x.ack=false}],
 ["current_permission_enabled",x=>{x.currentPermission=true}],
 ["missing_B",x=>{x.receipts.pop()}],
 ["no_receipts_ack",x=>{x.receipts=[]}],
 ["duplicate_receipt_row",x=>{x.receipts.push(JSON.parse(JSON.stringify(x.receipts[0])))}],
 ["duplicate_effect_different_receipt",x=>{x.receipts.push({...x.receipts[0],receiptId:"receipt-A-alt",at:48})}],
 ["duplicated_receipt_id_two_effects",x=>{x.receipts[1].receiptId="receipt-A"}],
 ["extra_C",x=>{x.receipts.push({...x.receipts[0],effectId:"C",receiptId:"receipt-C",at:49})}],
 ["count_equal_A_C",x=>{x.receipts[1].effectId="C"}],
 ["duplicate_A_A_B",x=>{x.receipts.push({...x.receipts[0],receiptId:"another-A"})}],
 ["positive_covered_negative",x=>{x.negatives.push({...x.query,status:"MISS",effectId:"A"})}],
 ["positive_unscoped_negative",x=>{x.negatives.push({...x.query,status:"MISS",effectId:"A",exact:false})}],
 ["negative_missing_retention",x=>{x.negatives.push({...x.query,status:"MISS",effectId:"B",retentionFrom:25})}],
 ["negative_for_nonmember",x=>{x.negatives.push({...x.query,status:"MISS",effectId:"C"})}],
 ["revoked_at_effect",x=>{x.grant.endsAt=30}],
 ["grant_unknown",x=>{x.grant.verified=false}],
 ["grant_wrong_issuer",x=>{x.grant.issuer="other-issuer"}],
 ["missing_grant_start",x=>{delete x.grant.startsAt}],
 ["query_failed",x=>{x.query.ok=false}],
 ["query_not_exact",x=>{x.query.exact=false}],
 ["query_wrong_attempt",x=>{x.query.attemptId="new-attempt"}],
 ["query_too_early",x=>{x.query.at=70}],
 ["watermark_too_old",x=>{x.query.watermark=70}],
 ["retention_starts_late",x=>{x.query.retentionFrom=20}],
 ["retention_ends_before_query",x=>{x.query.retentionUntil=70}],
 ["receipt_wrong_task",x=>{x.receipts[0].taskId="another-task"}],
 ["receipt_wrong_run",x=>{x.receipts[0].runId="another-run"}],
 ["receipt_wrong_attempt",x=>{x.receipts[0].attemptId="another-attempt"}],
 ["receipt_wrong_message",x=>{x.receipts[0].messageId="another-message"}],
 ["receipt_wrong_incarnation",x=>{x.receipts[0].targetUid="reborn-uid"}],
 ["receipt_issuer_mismatch",x=>{x.receipts[0].issuer="unbound-issuer"}],
 ["expected_membership_duplicate",x=>{x.intent.expectedEffects=["A","A"]}],
 ["expected_membership_extra",x=>{x.intent.expectedEffects=["A","B","D"]}],
 ["completion_wrong_revision",x=>{x.completion.revision=8}],
 ["completion_wrong_target",x=>{x.completion.targetUid="reborn-uid"}],
 ["completion_not_guarded",x=>{x.completion.guarded=false}],
 ["completion_predicate_false",x=>{x.completion.predicate=false}],
 ["completion_before_B_effect",x=>{x.completion.committedAt=42}],
 ["current_permission_malformed",x=>{x.currentPermission="false"}],
 ["receipt_timestamp_malformed",x=>{x.receipts[0].at="40"}]
 ];
 return spec.map(([id,mutate])=>{const facts=base();mutate(facts);return {id,facts}});
}

function reference(f){
 const I=f.intent,Q=f.query,G=f.grant,C=f.completion,R=f.receipts;
 if(!I||!Q||!G||!C||!Array.isArray(R)||!Array.isArray(f.negatives)||typeof f.currentPermission!=="boolean"||typeof f.ack!=="boolean")return "STOP_UNKNOWN";
 const fields=["taskId","runId","attemptId","messageId","targetUid"];
 if(fields.some(k=>typeof I[k]!=="string"||!I[k])||!Array.isArray(I.expectedEffects)||!I.expectedEffects.length||
    I.expectedEffects.some(e=>typeof e!=="string"||!e)||new Set(I.expectedEffects).size!==I.expectedEffects.length||
    !Number.isFinite(I.revision)||!Number.isFinite(I.attemptStartedAt)||!Number.isFinite(C.committedAt))return "STOP_UNKNOWN";
 const same=r=>fields.every(k=>r[k]===I[k]);
 if(Q.ok!==true||Q.exact!==true||!same(Q)||![Q.at,Q.watermark,Q.retentionFrom,Q.retentionUntil].every(Number.isFinite)||
    Q.at<C.committedAt||Q.watermark<C.committedAt||Q.retentionFrom>I.attemptStartedAt||Q.retentionUntil<Q.at)return "STOP_UNKNOWN";
 if(R.some(r=>!r||!same(r)||typeof r.effectId!=="string"||!r.effectId||
    typeof r.receiptId!=="string"||!r.receiptId||!Number.isFinite(r.at)||!r.issuer))return "STOP_UNKNOWN";
 if(R.some(r=>!I.expectedEffects.includes(r.effectId)))return "EFFECT_SET_MISMATCH";
 if(new Set(R.map(r=>r.receiptId)).size!==R.length||new Set(R.map(r=>r.effectId)).size!==R.length)return "EFFECT_SET_MISMATCH";
 for(const n of f.negatives){
  if(!n||n.status!=="MISS"||!I.expectedEffects.includes(n.effectId)||n.ok!==true||n.exact!==true||!same(n)||
     ![n.at,n.watermark,n.retentionFrom,n.retentionUntil].every(Number.isFinite)||
     n.at<C.committedAt||n.watermark<C.committedAt||n.retentionFrom>I.attemptStartedAt||n.retentionUntil<n.at)return "STOP_UNKNOWN";
  if(R.some(r=>r.effectId===n.effectId))return "EVIDENCE_CONFLICT";
 }
 if(G.verified!==true||typeof G.issuer!=="string"||!G.issuer||G.taskId!==I.taskId||![G.startsAt,G.endsAt].every(Number.isFinite))return "STOP_UNKNOWN";
 if(R.some(r=>r.issuer!==G.issuer||r.at<G.startsAt||r.at>G.endsAt))return "UNAUTHORIZED_OCCURRENCE";
 if(R.length!==I.expectedEffects.length||I.expectedEffects.some(e=>!R.some(r=>r.effectId===e)))return "STOP_UNKNOWN";
 if(C.predicate!==true||C.guarded!==true||C.targetUid!==I.targetUid||C.revision!==I.revision||
    R.some(r=>r.at>C.committedAt))return "STOP_UNKNOWN";
 return "MODEL_COMPLETE";
}

function verifier(f){
 const intent=f.intent, q=f.query, grant=f.grant, close=f.completion;
 if(!intent||!q||!grant||!close||typeof f.ack!=="boolean"||typeof f.currentPermission!=="boolean"||
    !Array.isArray(f.receipts)||!Array.isArray(f.negatives))return "STOP_UNKNOWN";
 const ids=[intent.taskId,intent.runId,intent.attemptId,intent.messageId,intent.targetUid];
 const members=intent.expectedEffects;
 if(ids.some(x=>typeof x!=="string"||x.length===0)||!Array.isArray(members)||members.length===0||
   members.some(x=>typeof x!=="string"||x.length===0)||members.length!==new Set(members).size||
   !Number.isFinite(intent.revision)||!Number.isFinite(intent.attemptStartedAt)||!Number.isFinite(close.committedAt))return "STOP_UNKNOWN";
 const matches=x=>x&&x.taskId===intent.taskId&&x.runId===intent.runId&&x.attemptId===intent.attemptId&&x.messageId===intent.messageId&&x.targetUid===intent.targetUid;
 if(!matches(q)||q.ok!==true||q.exact!==true||
    !Number.isFinite(q.at)||!Number.isFinite(q.watermark)||!Number.isFinite(q.retentionFrom)||!Number.isFinite(q.retentionUntil)||
    q.at<close.committedAt||q.watermark<close.committedAt||q.retentionFrom>intent.attemptStartedAt||q.retentionUntil<q.at)return "STOP_UNKNOWN";
 const byMember=new Map(),seenReceipts=new Set();
 for(const row of f.receipts){
  if(!matches(row)||!row.receiptId||typeof row.receiptId!=="string"||typeof row.effectId!=="string"||
     !row.effectId||!Number.isFinite(row.at)||!row.issuer)return "STOP_UNKNOWN";
  if(!members.includes(row.effectId)||byMember.has(row.effectId)||seenReceipts.has(row.receiptId))return "EFFECT_SET_MISMATCH";
  byMember.set(row.effectId,row);seenReceipts.add(row.receiptId);
 }
 for(const miss of f.negatives){
  if(!matches(miss)||miss.status!=="MISS"||miss.ok!==true||miss.exact!==true||
     !members.includes(miss.effectId)||![miss.at,miss.watermark,miss.retentionFrom,miss.retentionUntil].every(Number.isFinite)||
     miss.at<close.committedAt||miss.watermark<close.committedAt||
     miss.retentionFrom>intent.attemptStartedAt||miss.retentionUntil<miss.at)return "STOP_UNKNOWN";
  if(byMember.has(miss.effectId))return "EVIDENCE_CONFLICT";
 }
 if(grant.verified!==true||typeof grant.issuer!=="string"||!grant.issuer||
    grant.taskId!==intent.taskId||!Number.isFinite(grant.startsAt)||!Number.isFinite(grant.endsAt))return "STOP_UNKNOWN";
 for(const row of f.receipts)if(row.issuer!==grant.issuer||row.at<grant.startsAt||row.at>grant.endsAt)return "UNAUTHORIZED_OCCURRENCE";
 if(byMember.size!==members.length||members.some(e=>!byMember.has(e)))return "STOP_UNKNOWN";
 if(close.predicate!==true||close.guarded!==true||close.targetUid!==intent.targetUid||
    close.revision!==intent.revision||Array.from(byMember.values()).some(e=>e.at>close.committedAt))return "STOP_UNKNOWN";
 return "MODEL_COMPLETE";
}

function runReview(){
 const items=makeCases();
 const rows=items.map(({id,facts})=>({id,facts,weak:facts.ack&&facts.receipts.length>=2?"MODEL_COMPLETE":"STOP",reference:reference(facts),verifier:verifier(facts)}));
 const positives=["valid","lost_ack_after_effect","current_permission_enabled"];
 const mismatches=rows.filter(x=>x.reference!==x.verifier).map(x=>x.id);
 const unsafe=rows.filter(x=>!positives.includes(x.id)&&x.reference==="MODEL_COMPLETE").map(x=>x.id);
 const missingPositive=rows.filter(x=>positives.includes(x.id)&&x.reference!=="MODEL_COMPLETE").map(x=>x.id);
 const known=new Set(rows.map(x=>x.id));
 const checkLedger=ledger=>ledger.length===rows.length&&new Set(ledger.map(x=>x.id)).size===rows.length&&
   ledger.every(x=>known.has(x.id)&&x.reference===reference(x.facts)&&x.verifier===verifier(x.facts)&&
    x.weak===(x.facts.ack&&x.facts.receipts.length>=2?"MODEL_COMPLETE":"STOP"));
 const copy=x=>JSON.parse(JSON.stringify(x));
 const tests=[
 ["forged_reference",x=>{x[0].reference="MODEL_COMPLETE_FORGED"}],
 ["forged_verifier",x=>{x[0].verifier="MODEL_COMPLETE_FORGED"}],
 ["missing_case",x=>{x.pop()}],
 ["duplicate_case",x=>{x.push(copy(x[0]))}],
 ["altered_receipt_without_decision",x=>{x[0].facts.receipts[0].effectId="C"}],
 ["duplicate_receipt_without_decision",x=>{x[0].facts.receipts.push(copy(x[0].facts.receipts[0]))}],
 ["altered_grant_without_decision",x=>{x[0].facts.grant.endsAt=25}],
 ["altered_scope_without_decision",x=>{x[0].facts.receipts[0].attemptId="else"}],
 ["altered_query_without_decision",x=>{x[0].facts.query.watermark=20}],
 ["altered_retention_without_decision",x=>{x[0].facts.query.retentionFrom=50}],
 ["altered_target_without_decision",x=>{x[0].facts.completion.targetUid="reborn"}],
 ["altered_predicate_without_decision",x=>{x[0].facts.completion.predicate=false}],
 ["altered_guard_without_decision",x=>{x[0].facts.completion.guarded=false}],
 ["altered_commit_time_without_decision",x=>{x[0].facts.completion.committedAt=43}],
 ["injected_negative_without_decision",x=>{x[0].facts.negatives.push({...x[0].facts.query,status:"MISS",effectId:"A"})}],
 ["altered_current_permission_type_without_decision",x=>{x[0].facts.currentPermission="true"}]
 ];
 const probes=tests.map(([id,mutate])=>{const c=copy(rows);mutate(c);return {id,rejected:!checkLedger(c)}});
 const histogram={};for(const row of rows)histogram[row.reference]=(histogram[row.reference]||0)+1;
 const failedProbes=probes.filter(x=>!x.rejected).map(x=>x.id);
 const status=!mismatches.length&&!unsafe.length&&!missingPositive.length&&!failedProbes.length&&checkLedger(rows)?"PASS_WITH_LIMITS":"FAIL";
 return {schema:"ballast-2026-11-10-maintainer-review-synthetic",receipt:{
  status,executionUTC:new Date().toISOString(),logicalDate:"2026-11-10 Asia/Shanghai",
  originalHead:"83fdd4cb0f905f037b0ed02d3ce435349d40e0f5",
  originalSevenScenarios:"7 synthetic cases / 21 decisions / 6 weak-reference disagreements / SHA256 f1a7dce10c9daedc18ac7d5fee216d4048db83e722c5c5f677bf38c730f7a4d3",
  maintainerAuthoredCases:rows.length,maintainerDecisions:rows.length*3,weakReferenceDisagreements:rows.filter(x=>x.reference!==x.weak).length,
  referenceHistogram:histogram,verifierAgreements:rows.length-mismatches.length,positiveControls:positives.length,positiveFailures:missingPositive,unsafeNegativeAccepts:unsafe,
  tamperProbes:probes.length,tamperRejected:probes.filter(x=>x.rejected).length,tamperFailures:failedProbes,
  independence:{implementation:"PARTIAL",dataSource:"NONE",semanticContract:"SHARED",authority:"NONE"},
  executed:"ISOLATED_V8",nodeCLI:"NOT_EXECUTED",fullPythonChecker:"NOT_EXECUTED",realEffectSink:"NOT_EXECUTED",liveBroker:"NOT_EXECUTED",independentAuthority:"NOT_EXECUTED",
  newCredit:{daily:0,independentResearchWindows:0,cases:0,method:0,notes:0,audit:0,special:0,durableFindings:0}
 },rows,probes};
}

if (typeof require !== 'undefined' && require.main === module) {

  const output = runReview();

  console.log(JSON.stringify(process.argv.includes('--all') ? output : output.receipt, null, 2));

  if (output.receipt.status !== 'PASS_WITH_LIMITS') process.exitCode = 1;

}

if (typeof module !== 'undefined') module.exports = { makeCases, reference, verifier, runReview };

