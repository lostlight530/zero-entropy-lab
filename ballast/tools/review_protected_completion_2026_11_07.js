// Synthetic maintainer review with executable Node CLI, 2026-11-07
function runReview(P,V,executionUTC){
 const xs=P.cases(),{traces,decisions}=P.produce(xs),check=V.verify(xs,traces,decisions);
 const histogram={};for(const row of decisions.filter(d=>d.path==="reference"))histogram[row.decision]=(histogram[row.decision]||0)+1;
 const differences=xs.filter(x=>decisions.find(d=>d.id===x.id&&d.path==="weak_count").decision!==decisions.find(d=>d.id===x.id&&d.path==="reference").decision).length;
 const positives=["baseline","permission_revoked"],failedPos=positives.filter(id=>decisions.find(x=>x.id===id&&x.path==="reference").decision!=="COMPLETE"),unsafe=xs.filter(x=>!positives.includes(x.id)&&decisions.find(d=>d.id===x.id&&d.path==="reference").decision==="COMPLETE").map(x=>x.id);
 const original=["baseline","permission_revoked","unknown_prior","miss_conflict","duplicate","extra","guard_lost","historical_denied","toctou"],expected=["COMPLETE","COMPLETE","STOP_UNKNOWN","EVIDENCE_CONFLICT","RECONCILE","RECONCILE","STOP_UNKNOWN","BLOCKED","STOP_UNKNOWN"];
 const originalMismatches=original.filter((id,i)=>decisions.find(d=>d.id===id&&d.path==="reference")?.decision!==expected[i]);
 const copy=x=>JSON.parse(JSON.stringify(x));
 const probes=[
 ["forged_complete",()=>{const d=copy(decisions);d.find(x=>x.id==="toctou"&&x.path==="reference").decision="COMPLETE";return [xs,traces,d]}],
 ["missing_decision",()=>[xs,traces,decisions.slice(1)]],
 ["duplicate_decision",()=>[xs,traces,[...decisions,decisions[0]]]],
 ["unexpected_decision_path",()=>[xs,traces,[...decisions,{id:"baseline",path:"oracle",decision:"COMPLETE"}]]],
 ["orphan_decision",()=>[xs,traces,[...decisions,{id:"ghost",path:"reference",decision:"COMPLETE"}]]],
 ["duplicate_case",()=>[[...xs,xs[0]],traces,decisions]],
 ["duplicate_trace",()=>[xs,[...traces,traces[0]],decisions]],
 ["missing_trace",()=>[xs,traces.slice(1),decisions]],
 ["case_auth_changed",()=>{const a=copy(xs);a[0].state.grant.enabled=false;return [a,traces,decisions]}],
 ["trace_auth_changed",()=>{const a=copy(traces);a[0].events.find(x=>x.kind==="GRANT").data.enabled=false;return [xs,a,decisions]}],
 ["case_query_scope_changed",()=>{const a=copy(xs);a[0].state.query.attempt="wrong";return [a,traces,decisions]}],
 ["trace_query_scope_changed",()=>{const a=copy(traces);a[0].events.find(x=>x.kind==="QUERY").data.attempt="wrong";return [xs,a,decisions]}],
 ["trace_guard_changed",()=>{const a=copy(traces);a[0].events.find(x=>x.kind==="CURRENT").data.atomic=false;return [xs,a,decisions]}],
 ["duplicate_receipt_primitive",()=>{const a=copy(traces);a[0].events.push(copy(a[0].events.find(x=>x.kind==="RECEIPT")));return [xs,a,decisions]}],
 ["unexpected_event",()=>{const a=copy(traces);a[0].events.push({kind:"SPOOF",data:{}});return [xs,a,decisions]}],
 ["missing_permission_event",()=>{const a=copy(traces);a[0].events=a[0].events.filter(x=>x.kind!=="PERMISSION");return [xs,a,decisions]}]
 ];
 const tamper=probes.map(([id,build])=>{const [a,b,c]=build(),res=V.verify(a,b,c);return {id,rejected:!res.pass,error:res.errors[0]||null}});
 const good=xs.length===50&&check.pass&&originalMismatches.length===0&&unsafe.length===0&&failedPos.length===0&&tamper.every(t=>t.rejected);
 return {cases:xs,traces,decisions,receipt:{status:good?"PASS_WITH_LIMITS":"FAIL",logicalDate:"2026-11-07 Asia/Shanghai",executionUTC,source:"new maintainer reconstruction from original nine-row Daily; not original unpersisted V8 code",originalResearchHead:"d8f8e1f4b9fe3d2be51027279bfd10774a6d0001",scenarios:xs.length,primitiveEvents:check.events,decisions:decisions.length,weakReferenceDisagreements:differences,referenceHistogram:histogram,verified:check,original9ReferenceMismatches:originalMismatches,negativeUnsafeAccepts:unsafe,positiveControlFailures:failedPos,verifierTamper:tamper,tamperRejected:tamper.filter(x=>x.rejected).length,realEffects:0,independence:check.independence,nativeNodeCLI:"NOT_EXECUTED",fullPythonChecker:"NOT_EXECUTED",independentAuthority:"NOT_EXECUTED",credit:{newDaily:0,newResearchWindow:0,newCase:0,newMethod:0,newNotes:0,newAudit:0,newFindings:0}}};
}
if(typeof module!=="undefined")module.exports={runReview};
if(typeof require!=="undefined" && require.main===module){
 const P=require("./replay_protected_completion_2026_11_07.js");
 const V=require("./verify_protected_completion_2026_11_07.js");
 const x=runReview(P,V,new Date().toISOString());
 console.log(JSON.stringify(x.receipt,null,2));
 if(x.receipt.status!=="PASS_WITH_LIMITS")process.exitCode=1;
}
