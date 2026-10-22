"use strict";
const clone=x=>JSON.parse(JSON.stringify(x));
function controls(scenarios,rows,reconstruct,verify){
 const errors=[],base=scenarios.find(s=>s.id==="baseline"),negative=[
 s=>s.effects[1].receipt="rA",s=>s.effects[1].id="eA",s=>s.effects[1].member="A",
 s=>s.effects.push({...s.effects[1],member:"C",id:"eC",receipt:"rC"}),
 s=>s.effects[1].inc="old",s=>s.effects[1].task="old",s=>s.effects[1].authorized=false,
 s=>s.effects[1].receipt="",s=>s.effects[1].id="",s=>s.effects[1].at=-1,
 s=>s.effects[1].at=Infinity,s=>s.effects[1].at=81,s=>s.witness.task="old",
 s=>s.witness.inc="old",s=>s.witness.revision=6,s=>s.witness.protected=false,
 s=>s.witness.members=["A","C"],s=>s.witness.members=["A","A"],
 s=>s.witness.at="bad",s=>s.witness.commitAt=70,s=>s.required=["A","A"],
 s=>s.required=[],s=>s.prior.state="miss",s=>s.effects[1].id="wrong"];
 let rejected=0;
 for(const change of negative){const s=clone(base);change(s);if(reconstruct(s)==="COMPLETE")errors.push("accepted adverse mutation "+rejected);else rejected++;}
 const probes=[
 [s=>{s.effects.pop();s.prior.state="unknown";},"STOP_UNKNOWN"],
 [s=>{s.effects.pop();s.prior.state="miss";s.prior.watermark=10;},"STOP_UNKNOWN"],
 [s=>{s.permission=false;},"COMPLETE"],
 [s=>{s.effects.pop();s.prior.state="miss";},"RETRY_ALLOWED"],
 [s=>{s.effects.pop();s.prior.state="miss";s.permission=false;},"BLOCKED"],
 [s=>{s.effects.pop();s.prior.state="miss";s.prior.identity="wrong";},"STOP_UNKNOWN"],
 [s=>{s.effects.pop();s.prior.state="miss";s.witness.protected=false;},"RECONCILE"],
 [s=>{s.effects.pop();s.prior.state="miss";s.witness.revision=6;},"RECONCILE"],
 [s=>{s.effects.pop();s.prior.state="miss";s.witness.task="wrong";},"RECONCILE"],
 [s=>{s.effects.pop();s.prior.state="miss";s.witness.inc="wrong";},"RECONCILE"],
 [s=>{s.effects.pop();s.prior.state="miss";s.witness.members=["A","C"];},"RECONCILE"],
 [s=>{s.effects.pop();s.prior.state="hit";},"EVIDENCE_CONFLICT"],
 [s=>{s.effects.pop();s.prior.state="invalid";},"STOP_UNKNOWN"]];
 let passed=0;
 for(const [change,expected] of probes){const s=clone(base);change(s);if(reconstruct(s)!==expected)errors.push("boundary mismatch "+passed);else passed++;}
 const altered=rows.map(r=>({...r}));altered[0].decision="FORGED";
 const tampered=verify(scenarios,altered);
 if(tampered.ok||!tampered.errors.some(x=>x.includes("row mismatch")))errors.push("CSV tamper not rejected");
 return {ok:errors.length===0,errors,negative_mutations:{passed:rejected,total:negative.length},positive_and_boundary_probes:{passed,total:probes.length},csv_tamper_rejection:{status:tampered.ok?"FAIL":"PASS",errors:tampered.errors}};
}
module.exports={controls};
