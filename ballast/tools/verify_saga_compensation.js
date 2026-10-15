"use strict";
function verify(payload,csv){
 const paths=["cancel_only","queue_only","compensation_count","full_integrity"];
 const expected=["reserve@acct-u5","charge@acct-u5"], inverses=["release-reserve@acct-u5","refund-charge@acct-u5"];
 const scope=(x)=>["task-88","run-3","attempt-1","acct-u5",x].join("|");
 const covered=(q,x)=>q&&q.scope===scope(x)&&q.queryOk===true&&q.retained===true&&Number.isFinite(q.watermark)&&Number.isFinite(q.minWatermark)&&q.watermark>=q.minWatermark;
 const unique=(arr)=>new Set(arr).size===arr.length;
 function reconstruct(s){
  const all=s.forward.concat(s.comp);
  if(s.incarnation!=="acct-u5"||all.some(r=>r.incarnation!=="acct-u5"))return "target-incarnation-mismatch";
  if(all.some(r=>r.task!=="task-88"||r.run!=="run-3"||r.attempt!=="attempt-1"))return "effect-identity-mismatch";
  if(!unique(s.forward.map(x=>x.receiptId))||!unique(s.comp.map(x=>x.receiptId))||!unique(s.forward.map(x=>x.effect))||!unique(s.comp.map(x=>x.effect)))return "duplicate-effect";
  if(s.forward.some(x=>!expected.includes(x.effect))||s.comp.some(x=>!inverses.includes(x.effect)))return "extra-effect";
  for(const r of s.comp){const i=inverses.indexOf(r.effect);if(r.original!==expected[i])return "original-binding-mismatch"}
  if(s.forward.some(r=>r.original!==r.effect))return "original-binding-mismatch";
  if(!Array.isArray(s.required)||!unique(s.required)||s.required.length!==2||expected.some(x=>!s.required.includes(x)))return "membership-mismatch";
  if(!unique(s.membership)||s.membership.length!==2||expected.some(x=>!s.membership.includes(x))||s.membershipRevision!==s.witnessRevision)return "membership-mismatch";
  const f=new Map(s.forward.map(x=>[x.effect,x])), c=new Map(s.comp.map(x=>[x.original,x]));
  for(const [i,member] of expected.entries()){
    const original=f.get(member), undo=c.get(member), prior=s.prior[i], compPrior=s.compPrior[i];
    if(original&&prior.state==="authoritative miss"||undo&&compPrior.state==="authoritative miss"){
     if((original&&prior.state==="authoritative miss"&&!covered(prior,member))||(undo&&compPrior.state==="authoritative miss"&&!covered(compPrior,member)))return "safe-stop-unknown";
     return "evidence-conflict";
    }
    if(prior.state==="hit"&&!covered(prior,member)||undo&&compPrior.state==="hit"&&!covered(compPrior,member))return "safe-stop-unknown";
    if(prior.state==="unknown"||prior.state==="authoritative miss"&&!covered(prior,member)||prior.state==="hit"&&!original||!["hit","authoritative miss"].includes(prior.state))return "safe-stop-unknown";
    if(!original){if(undo)return "extra-effect";continue}
    if(original.authorized!==true)return "historically-unauthorized";
    if(!undo){
      if(compPrior.state==="authoritative miss"&&covered(compPrior,member))return s.currentPermission===true&&s.protectedNewEffect===true?"eligible-compensation":"permission-stop";
      return "safe-stop-unknown";
    }
    if(compPrior.state!=="hit")return "safe-stop-unknown";
    if(undo.authorized!==true)return "historically-unauthorized";
    if(s.temporalWitness!==true||!Number.isFinite(undo.time)||!Number.isFinite(original.time)||!(undo.time>original.time))return "temporal-order-unknown";
  }
  if(s.protectedCompletion!==true||s.currentState.reserved!==false||s.currentState.netCharge!==0)return "current-incomplete";
  return "verified-aborted";
 }
 function audit(obj,table){
  const errors=[];
  if(!obj||!Array.isArray(obj.scenarios))return ["invalid scenario payload"];
  const scenarios=obj.scenarios;
  const ids=scenarios.map(x=>x.id);
  if(!unique(ids))errors.push("duplicate scenario id");
  const primitives=scenarios.map(s=>{const c=JSON.parse(JSON.stringify(s));delete c.id;delete c.injection;delete c.frozen_expected;return JSON.stringify(c)});
  if(!unique(primitives))errors.push("duplicate primitive vector");
  const rows=table.trimEnd().split("\n").map(x=>x.replace(/\r$/,""));
  if(rows.shift()!=="scenario_id,path,decision")errors.push("bad CSV header");
  const parsed=rows.map((line,i)=>{const a=line.split(",");if(a.length!==3)errors.push("bad CSV row "+i);return {scenario_id:a[0],path:a[1],decision:a[2]}});
  if(parsed.length!==scenarios.length*4)errors.push("row count");
  const keys=parsed.map(r=>r.scenario_id+"|"+r.path);
  if(!unique(keys))errors.push("duplicate path identity");
  for(const s of scenarios){
   const actual=reconstruct(s);
   if(actual!==s.frozen_expected)errors.push("frozen mismatch "+s.id+" expected="+s.frozen_expected+" reconstructed="+actual);
   const selected=parsed.filter(r=>r.scenario_id===s.id);
   if(selected.length!==4||!unique(selected.map(r=>r.path))||paths.some(p=>!selected.some(r=>r.path===p)))errors.push("path coverage "+s.id);
   for(const row of selected){
    const want=row.path==="full_integrity"?actual:row.path==="cancel_only"?(s.cancelTerminal?"verified-aborted":"unverified"):row.path==="queue_only"?(s.compensationQueued?"verified-aborted":"unverified"):row.path==="compensation_count"?(s.comp.length===2?"verified-aborted":"unverified"):"INVALID_PATH";
    if(row.decision!==want)errors.push("decision mismatch "+s.id+" "+row.path);
   }
  }
  if(parsed.some(r=>!ids.includes(r.scenario_id)||!paths.includes(r.path)))errors.push("unknown scenario/path");
  return errors;
 }
 const baseErrors=audit(payload,csv);
 const copy=()=>JSON.parse(JSON.stringify(payload));
 const controls=[
  ["wrong-frozen-label",p=>p.scenarios[0].frozen_expected="safe-stop-unknown"],
  ["duplicate-scenario-id",p=>p.scenarios[1].id=p.scenarios[0].id],
  ["duplicate-primitive-vector",p=>{const b=JSON.parse(JSON.stringify(p.scenarios[0]));b.id=p.scenarios[1].id;p.scenarios[1]=b}],
  ["duplicate-compensation-receipt",p=>p.scenarios[0].comp[1]=JSON.parse(JSON.stringify(p.scenarios[0].comp[0]))],
  ["extra-compensation-effect",p=>p.scenarios[0].comp.push({...p.scenarios[0].comp[0],receiptId:"x9",effect:"unknown"})],
  ["wrong-original-binding",p=>p.scenarios[0].comp[1].original=expected[0]],
  ["forward-original-misbinding",p=>p.scenarios[0].forward[0].original="wrong"],
  ["positive-hit-wrong-scope",p=>p.scenarios[0].compPrior[0].scope="wrong"],
  ["compensation-incarnation-drift",p=>p.scenarios[0].comp[1].incarnation="acct-u9"],
  ["compensation-run-drift",p=>p.scenarios[0].comp[1].run="run-99"],
  ["historical-authorization-loss",p=>p.scenarios[0].comp[0].authorized=false],
  ["temporal-inversion",p=>p.scenarios[0].comp[0].time=0],
  ["missing-temporal-witness",p=>p.scenarios[0].temporalWitness=false],
  ["same-count-membership-swap",p=>p.scenarios[0].membership[1]="charge@acct-u9"],
  ["stale-revision",p=>p.scenarios[0].witnessRevision="m1"],
  ["current-net-state-reversed",p=>p.scenarios[0].currentState.netCharge=9],
  ["unprotected-completion",p=>p.scenarios[0].protectedCompletion=false],
  ["covered-miss-receipt-conflict",p=>p.scenarios[0].compPrior[0].state="authoritative miss"],
  ["unknown-prior-effect",p=>p.scenarios[0].prior[0].state="unknown"],
  ["receipt-id-duplicate",p=>p.scenarios[0].forward[1].receiptId=p.scenarios[0].forward[0].receiptId],
  ["watermark-loss",p=>{const s=p.scenarios.find(s=>s.id==="covered-no-effect-abort");s.prior[0].watermark=1}],
  ["retention-loss",p=>{const s=p.scenarios.find(s=>s.id==="covered-no-effect-abort");s.prior[0].retained=false}],
  ["authorization-string-false",p=>p.scenarios[0].comp[0].authorized="false"],
  ["compensation-time-string",p=>p.scenarios[0].comp[0].time="7"],
  ["hit-query-ok-string",p=>p.scenarios[0].compPrior[0].queryOk="false"],
  ["uncovered-miss-with-positive",p=>{p.scenarios[0].compPrior[0].state="authoritative miss";p.scenarios[0].compPrior[0].scope="wrong"}],
  ["required-effect-substitution",p=>{const s=p.scenarios.find(s=>s.id==="covered-no-effect-abort");s.required[1]="other@acct-u5";s.membership[1]="other@acct-u5"}],
  ["non-boolean-temporal-witness",p=>p.scenarios[0].temporalWitness="true"],
 ];
 const controlsRejected=[], controlsFailed=[];
 for(const [name,mut] of controls){const p=copy();mut(p);if(audit(p,csv).length)controlsRejected.push(name);else controlsFailed.push(name)}
 const tamperCSV=[
  ["wrong-decision",csv.replace("valid-historical-after-current-revocation,full_integrity,verified-aborted","valid-historical-after-current-revocation,full_integrity,unverified")],
  ["duplicate-path",csv.replace("valid-historical-after-current-revocation,queue_only","valid-historical-after-current-revocation,cancel_only")],
  ["missing-row",csv.split("\n").filter(line=>!line.startsWith("valid-historical-after-current-revocation,compensation_count,")).join("\n")],
  ["extra-path",csv+"extra-id,full_integrity,verified-aborted\n"],
 ];
 for(const [name,altered] of tamperCSV){if(audit(payload,altered).length)controlsRejected.push(name);else controlsFailed.push(name)}
 return {scenario_count:payload.scenarios.length,row_count:csv.trim().split("\n").length-1,errors:baseErrors,negative_controls:controls.length+tamperCSV.length,negative_rejected:controlsRejected.length,negative_failures:controlsFailed,status:baseErrors.length||controlsFailed.length?"FAIL":"PASS"};
}
if(typeof module!=="undefined"){module.exports={verify};if(require.main===module){const fs=require("fs");const path=require("path");const dir=path.join(process.cwd(),"ballast","evidence");const p=JSON.parse(fs.readFileSync(path.join(dir,"2026-10-16-saga-scenarios.json"),"utf8"));const c=fs.readFileSync(path.join(dir,"2026-10-16-saga-decisions.csv"),"utf8");const result=verify(p,c);console.log(JSON.stringify(result));if(result.status!=="PASS")process.exitCode=1;}}
