// Ballast 2026-11-06 bounded synthetic review runner; no external authority validation
function runReview(P,V,stamp){
 const xs=P.cases(),{traces,decisions}=P.produce(xs),verification=V.verify(xs,traces,decisions);
 const refs=decisions.filter(d=>d.path==="reference"),weak=decisions.filter(d=>d.path==="weak_receipt");
 const histogram={};for(const d of refs)histogram[d.decision]=(histogram[d.decision]||0)+1;
 const differences=xs.filter(x=>weak.find(d=>d.id===x.id)?.decision!==refs.find(d=>d.id===x.id)?.decision).length;
 const positive=["baseline","current_permission_revoked_positive","later_revocation_positive"];
 const unsafe=xs.filter(x=>!positive.includes(x.id)&&refs.find(d=>d.id===x.id)?.decision==="COMPLETE").map(x=>x.id);
 const positiveFailures=positive.filter(id=>refs.find(d=>d.id===id)?.decision!=="COMPLETE");
 const copy=x=>JSON.parse(JSON.stringify(x));
 const tests=[
 ["forged_reference",()=>{let d=copy(decisions);d.find(x=>x.id==="time_interval_overlap"&&x.path==="reference").decision="COMPLETE";return [xs,traces,d]}],
 ["missing_decision",()=>[xs,traces,decisions.slice(1)]],
 ["duplicate_decision",()=>[xs,traces,[...decisions,decisions[0]]]],
 ["duplicate_scenario",()=>[[...xs,xs[0]],traces,decisions]],
 ["missing_trace",()=>[xs,traces.slice(1),decisions]],
 ["changed_primitive_grant",()=>{let t=copy(traces);t[0].events.find(x=>x.kind==="AUTHORITY").data.from=44;return [xs,t,decisions]}],
 ["changed_case_without_trace",()=>{let c=copy(xs);c[0].state.authority.from=3;return [c,traces,decisions]}],
 ["extra_primitive_event",()=>{let t=copy(traces);t[0].events.push({kind:"SPOOF",data:{}});return [xs,t,decisions]}],
 ["duplicated_receipt_event",()=>{let t=copy(traces);t[0].events.push(copy(t[0].events.find(x=>x.kind==="RECEIPT")));return [xs,t,decisions]}],
 ["orphan_decision",()=>[xs,traces,[...decisions,{id:"ghost",path:"reference",decision:"COMPLETE"}]]],
 ["unexpected_path",()=>[xs,traces,[...decisions,{id:"baseline",path:"oracle",decision:"COMPLETE"}]]],
 ["changed_trace_identity",()=>{let t=copy(traces);t[0].id="ghost";return [xs,t,decisions]}]
 ];
 const tamper=tests.map(([id,make])=>{const [a,b,c]=make(),check=V.verify(a,b,c);return {id,rejected:!check.pass,firstError:check.errors[0]||null}});
 const valid=verification.pass&&xs.length===44&&traces.length===44&&decisions.length===88&&unsafe.length===0&&positiveFailures.length===0&&tamper.every(x=>x.rejected);
 return {cases:xs,traces,decisions,review:{status:valid?"PASS_WITH_LIMITS":"FAIL",executionUTC:stamp,logicalDate:"2026-11-06 Asia/Shanghai",kind:"MAINTAINER_RECONSTRUCTION",originalDailyHead:"a7b808a417765d95bf55f065835de45abc5e3510",original10TrialSource:"NOT_PERSISTED",nativeNodeCLI:"NOT_EXECUTED",fullPythonChecker:"NOT_EXECUTED",externalIssuerTSAEffectSink:"NOT_EXECUTED",scenarios:xs.length,traces:traces.length,primitiveEvents:verification.primitiveEvents,decisions:decisions.length,weakReferenceDisagreements:differences,referenceHistogram:histogram,verification,tamper,tamperRejected:tamper.filter(t=>t.rejected).length,negativeUnsafeAccepts:unsafe,positiveControlFailures:positiveFailures,realEffects:0,independence:verification.independence,notes:"All facts synthetic; verifier reconstructs decision from primitive events and binds case/trace, but shares schema and semantic assumptions, and original 10-trial source is unavailable"}};
}
if(typeof module!=="undefined")module.exports={runReview};
if(typeof require!=="undefined" && require.main===module){
 const P=require("./replay_temporal_2026_11_06.js");
 const V=require("./verify_temporal_2026_11_06.js");
 const o=runReview(P,V,new Date().toISOString());
 console.log(JSON.stringify(o.review,null,2));
 if(o.review.status!=="PASS_WITH_LIMITS")process.exitCode=1;
}
