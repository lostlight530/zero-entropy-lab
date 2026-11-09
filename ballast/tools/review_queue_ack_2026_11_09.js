'use strict';

// Bounded synthetic maintainer replay; execution semantics are not external authority

// Run: node ballast/tools/review_queue_ack_2026_11_09.js

function makeCases(){
  const copy=x=>JSON.parse(JSON.stringify(x));
  function base(){
    const id={task:"task-09",run:"run-09",attempt:"attempt-1",target:"uid-09",message:"msg-09"};
    const rec=(effect,at)=>({...id,effect,at,authority:"issuer-09"});
    return {intent:{...id,effects:["A","B"],revision:5,attemptStarted:10},
      ack:{success:true},receipts:[rec("A",40),rec("B",45)],
      grant:{issuer:"issuer-09",task:"task-09",from:20,until:60,proven:true},
      query:{ok:true,exact:true,...id,at:90,watermark:90,retentionFrom:0,retentionUntil:100},
      negative:[],currentPermission:false,
      completion:{predicate:true,guarded:true,target:"uid-09",revision:5,commitAt:80}};
  }
  const specs=[
    ["baseline",f=>{}],
    ["ack_lost_after_effect",f=>{f.ack.success=false}],
    ["permission_revoked_after_authorized_effect",f=>{f.currentPermission=false}],
    ["ack_only_no_receipts",f=>{f.receipts=[]}],
    ["missing_B",f=>{f.receipts.pop()}],
    ["duplicate_A_plus_B",f=>{f.receipts.push(copy(f.receipts[0]))}],
    ["equal_count_A_plus_C",f=>{f.receipts[1].effect="C"}],
    ["extra_member_C",f=>{f.receipts.push({...f.receipts[0],effect:"C",at:48})}],
    ["covered_negative_conflicts_positive",f=>{f.negative.push({effect:"A",status:"MISS",...f.query})}],
    ["uncovered_negative_claim_conflict",f=>{f.negative.push({...f.query,effect:"A",status:"MISS",exact:false})}],
    ["effect_time_grant_invalid",f=>{f.grant.until=30}],
    ["grant_missing_provenance",f=>{f.grant.proven=false}],
    ["grant_wrong_issuer",f=>{f.grant.issuer="someone-else"}],
    ["query_outage",f=>{f.query.ok=false}],
    ["query_identity_unscoped",f=>{f.query.exact=false}],
    ["query_wrong_attempt",f=>{f.query.attempt="attempt-2"}],
    ["query_before_commit",f=>{f.query.at=70}],
    ["watermark_before_commit",f=>{f.query.watermark=70}],
    ["retention_start_after_attempt",f=>{f.query.retentionFrom=30}],
    ["retention_end_before_query",f=>{f.query.retentionUntil=65}],
    ["receipt_wrong_target_incarnation",f=>{f.receipts[1].target="uid-recreated"}],
    ["receipt_wrong_run",f=>{f.receipts[1].run="run-other"}],
    ["receipt_wrong_message",f=>{f.receipts[0].message="message-other"}],
    ["receipt_duplicate_at_different_time",f=>{f.receipts.push({...f.receipts[0],at:47})}],
    ["membership_revision_drift",f=>{f.completion.revision=6}],
    ["target_recreated_at_commit",f=>{f.completion.target="uid-new"}],
    ["unguarded_completion",f=>{f.completion.guarded=false}],
    ["predicate_false",f=>{f.completion.predicate=false}],
    ["commit_before_effect_B",f=>{f.completion.commitAt=42}],
    ["malformed_effect_identity",f=>{f.intent.effects=["A","A"]}],
    ["malformed_permission_type",f=>{f.currentPermission="true"}],
    ["missing_grant_timestamp",f=>{delete f.grant.from}]
  ];
  return specs.map(([id,mutate])=>{const facts=base();mutate(facts);return {id,facts};});
}

function reference(f){
  const I=f.intent,Q=f.query,G=f.grant,C=f.completion,R=f.receipts;
  const fields=[I.task,I.run,I.attempt,I.target,I.message];
  if(fields.some(x=>typeof x!=="string"||!x)||typeof f.currentPermission!=="boolean"||
     !Array.isArray(I.effects)||I.effects.length===0||new Set(I.effects).size!==I.effects.length||
     I.effects.some(x=>typeof x!=="string"||!x)||!Array.isArray(R)||!Array.isArray(f.negative))return "STOP_UNKNOWN";
  const exact=r=>["task","run","attempt","target","message"].every(k=>r[k]===I[k]);
  if(!Q.ok||Q.exact!==true||!exact(Q)||!Number.isFinite(Q.at)||!Number.isFinite(Q.watermark)||
     Q.at<C.commitAt||Q.watermark<C.commitAt||!Number.isFinite(Q.retentionFrom)||
     Q.retentionFrom>I.attemptStarted||!Number.isFinite(Q.retentionUntil)||Q.retentionUntil<Q.at)return "STOP_UNKNOWN";
  if(R.some(r=>!r||!exact(r)||typeof r.effect!=="string"||!Number.isFinite(r.at)||!r.authority))return "STOP_UNKNOWN";
  if(R.some(r=>!I.effects.includes(r.effect)))return "STOP_EFFECT_SET_MISMATCH";
  const ids=R.map(r=>r.effect);
  if(ids.length!==new Set(ids).size)return "STOP_EFFECT_SET_MISMATCH";
  for(const miss of f.negative){
    if(miss.status!=="MISS"||!I.effects.includes(miss.effect))return "STOP_UNKNOWN";
    if(!exact(miss)||miss.exact!==true||miss.ok!==true||miss.watermark<C.commitAt||
       miss.retentionFrom>I.attemptStarted||miss.retentionUntil<miss.at)return "STOP_UNKNOWN";
    if(ids.includes(miss.effect))return "EVIDENCE_CONFLICT";
  }
  if(!G.proven||typeof G.issuer!=="string"||G.task!==I.task||
     !Number.isFinite(G.from)||!Number.isFinite(G.until))return "STOP_UNKNOWN";
  if(R.some(r=>r.authority!==G.issuer||r.at<G.from||r.at>G.until))return "UNAUTHORIZED_OCCURRENCE";
  if(ids.length!==I.effects.length||I.effects.some(x=>!ids.includes(x)))return "STOP_UNKNOWN";
  if(!C.predicate||C.guarded!==true||C.target!==I.target||C.revision!==I.revision||
     !Number.isFinite(C.commitAt)||R.some(r=>r.at>C.commitAt))return "STOP_UNKNOWN";
  return "MODEL_COMPLETE";
}

function reconstruct(f){
  const i=f.intent, q=f.query, g=f.grant, c=f.completion;
  if(!i||!q||!g||!c||!Array.isArray(f.receipts)||!Array.isArray(f.negative)||
    typeof f.currentPermission!=="boolean"||!Array.isArray(i.effects)||i.effects.length===0||
    i.effects.some(x=>typeof x!=="string"||x.length===0)||
    new Set(i.effects).size!==i.effects.length)return "STOP_UNKNOWN";
  const same=x=>x&&x.task===i.task&&x.run===i.run&&x.attempt===i.attempt&&x.target===i.target&&x.message===i.message;
  if([i.task,i.run,i.attempt,i.target,i.message].some(x=>typeof x!=="string"||!x))return "STOP_UNKNOWN";
  if(!same(q)||q.ok!==true||q.exact!==true||!Number.isFinite(q.at)||!Number.isFinite(q.watermark)||
     !Number.isFinite(q.retentionFrom)||!Number.isFinite(q.retentionUntil)||
     !Number.isFinite(i.attemptStarted)||!Number.isFinite(c.commitAt)||
     q.at<c.commitAt||q.watermark<c.commitAt||q.retentionFrom>i.attemptStarted||q.retentionUntil<q.at)return "STOP_UNKNOWN";
  const seen={};
  for(const r of f.receipts){
    if(!same(r)||!Number.isFinite(r.at)||typeof r.authority!=="string"||!r.authority)return "STOP_UNKNOWN";
    if(!i.effects.includes(r.effect))return "STOP_EFFECT_SET_MISMATCH";
    if(seen[r.effect])return "STOP_EFFECT_SET_MISMATCH";
    seen[r.effect]=r;
  }
  for(const n of f.negative){
    if(!same(n)||n.status!=="MISS"||n.ok!==true||n.exact!==true||!i.effects.includes(n.effect)||
       !Number.isFinite(n.at)||!Number.isFinite(n.watermark)||!Number.isFinite(n.retentionFrom)||
       !Number.isFinite(n.retentionUntil)||n.watermark<c.commitAt||
       n.retentionFrom>i.attemptStarted||n.retentionUntil<n.at)return "STOP_UNKNOWN";
    if(seen[n.effect])return "EVIDENCE_CONFLICT";
  }
  if(g.proven!==true||typeof g.issuer!=="string"||!g.issuer||g.task!==i.task||
     !Number.isFinite(g.from)||!Number.isFinite(g.until))return "STOP_UNKNOWN";
  for(const id of i.effects){
    const r=seen[id];if(!r)return "STOP_UNKNOWN";
    if(r.authority!==g.issuer||r.at<g.from||r.at>g.until)return "UNAUTHORIZED_OCCURRENCE";
  }
  if(Object.keys(seen).length!==i.effects.length||c.predicate!==true||c.guarded!==true||
     c.target!==i.target||c.revision!==i.revision||
     Object.values(seen).some(r=>r.at>c.commitAt))return "STOP_UNKNOWN";
  return "MODEL_COMPLETE";
}

function review(){
  const scenarios=makeCases();
  const rows=scenarios.map(({id,facts})=>({id,facts,weak:facts.ack.success===true?"MODEL_COMPLETE":"RETRY",reference:reference(facts),verifier:reconstruct(facts)}));
  const discrepancies=rows.filter(x=>x.reference!==x.verifier).map(x=>x.id);
  const positives=["baseline","ack_lost_after_effect","permission_revoked_after_authorized_effect"];
  const unsafe=rows.filter(x=>!positives.includes(x.id)&&x.reference==="MODEL_COMPLETE").map(x=>x.id);
  const badPos=rows.filter(x=>positives.includes(x.id)&&x.reference!=="MODEL_COMPLETE").map(x=>x.id);
  const knownIds=new Set(rows.map(x=>x.id));
  function checkLedger(a){
    if(a.length!==rows.length||new Set(a.map(x=>x.id)).size!==rows.length||a.some(x=>!knownIds.has(x.id)))return false;
    return a.every(x=>x.reference===reconstruct(x.facts)&&x.reference===reference(x.facts)&&
       x.weak===(x.facts.ack.success===true?"MODEL_COMPLETE":"RETRY"));
  }
  const clone=x=>JSON.parse(JSON.stringify(x));
  const probes=[
    ["forged_verdict",a=>{a[0].reference="MODEL_COMPLETE_FAKE"}],
    ["missing_case",a=>{a.pop()}],
    ["duplicated_case",a=>{a.push(clone(a[0]))}],
    ["mutated_auth_without_decision",a=>{a[0].facts.grant.until=10}],
    ["mutated_receipt_without_decision",a=>{a[0].facts.receipts[1].effect="C"}],
    ["mutated_target_without_decision",a=>{a[0].facts.completion.target="uid-new"}],
    ["mutated_query_watermark_without_decision",a=>{a[0].facts.query.watermark=20}],
    ["mutated_extra_member_without_decision",a=>{a[0].facts.receipts.push({...a[0].facts.receipts[0],effect:"C"})}]
  ];
  const tamper=probes.map(([id,mutate])=>{const modified=clone(rows);mutate(modified);return{id,rejected:!checkLedger(modified)}});
  const badTamper=tamper.filter(x=>!x.rejected).map(x=>x.id);
  const status=!discrepancies.length&&!unsafe.length&&!badPos.length&&!badTamper.length&&checkLedger(rows)?"PASS_WITH_LIMITS":"FAIL";
  const histogram={};for(const x of rows)histogram[x.reference]=(histogram[x.reference]||0)+1;
  return {schema:"ballast-2026-11-09-maintainer-review-JS_ENGINE-synthetic",receipt:{
    status,executionUTC:new Date().toISOString(),logicalDate:"2026-11-09 Asia/Shanghai",referenceBaseline:"13ba3547450c7a87df29b39facf15d2a287967b4",
    originalResearch:"10 scenarios, 30 decisions, sha256 4af04c2212d9292d2175e040f13f48353398dcd0b8efa5c1de24289f3da43ec3 unchanged",
    reviewScenarios:rows.length,reviewDecisions:rows.length*3,weakReferenceDisagreements:rows.filter(x=>x.reference!==x.weak).length,
    modelVerifierAgreements:rows.length-discrepancies.length,referenceHistogram:histogram,
    positiveControls:positives.length,positiveFailures:badPos,unsafeNegativeAccepts:unsafe,implementationDisagreements:discrepancies,
    tamperProbes:tamper.length,tamperRejected:tamper.filter(x=>x.rejected).length,tamperFailed:badTamper,
    realQueueCalls:0,realEffectSinkCalls:0,independence:{implementation:"PARTIAL",dataSource:"NONE",semanticContract:"SHARED",authority:"NONE"},
    nodeCLI:"NOT_EXECUTED",fullPythonChecker:"NOT_EXECUTED",liveQueues:"NOT_EXECUTED",independentAuthority:"NOT_EXECUTED",
    credit:{newDaily:0,newResearchWindow:0,newCases:0,newMethod:0,newNotes:0,newAudit:0,newDurableFinding:0}
  },rows,tamper};
}

if (typeof require !== 'undefined' && require.main === module) {

  const result = review();

  console.log(JSON.stringify(process.argv.includes('--all') ? result : result.receipt, null, 2));

  if (result.receipt.status !== 'PASS_WITH_LIMITS') process.exitCode = 1;

}

if (typeof module !== 'undefined') module.exports = { makeCases, reference, reconstruct, review };

