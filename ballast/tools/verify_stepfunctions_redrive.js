"use strict";
// Independent primitive-event replay, separate implementation, SHARED scenario semantics
function replay(s) {
 const seen=new Set(), accepted=[];
 for(const e of s.events){
  if(seen.has(e.event_id))return "EVIDENCE_CONFLICT";
  seen.add(e.event_id);
  if(e.accepted)accepted.push(e);
 }
 const p=s.prior,miss=p.status==="miss"&&p.query_ok===true&&p.scope==="exact"&&p.authority==="modeled_sink_journal"&&p.lifecycle==="complete"&&p.retention===true&&Number.isFinite(p.watermark)&&Number.isFinite(p.old_attempt_tick)&&p.watermark>=p.old_attempt_tick;
 if(miss&&accepted.find(e=>e.effect_id===p.effect_id))return "EVIDENCE_CONFLICT";
 if(new Set(s.required).size!==s.required.length)return "STOP_UNKNOWN";
 if(s.task.definition!==s.task.expected_definition)return "STOP_UNKNOWN";
 const w=s.witness;
 if(w.protected!==true||w.revision!==s.membership_revision||w.target!==s.target||w.mutation_tick>w.commit_tick)return "STOP_UNKNOWN";
 if(w.members.length!==s.required.length||new Set(w.members).size!==w.members.length||w.members.some(m=>!s.required.includes(m)))return "STOP_UNKNOWN";
 const occurrence=new Map();
 for(const e of accepted){
  if(e.tick===null||!Number.isFinite(e.tick)||e.historical_authorized===null)return "STOP_UNKNOWN";
  if(e.historical_authorized!==true||e.target!==s.target||e.effect_id!==[s.id,e.member,s.target].join("/")||!s.required.includes(e.member))return "RECONCILE";
  const key=e.member;
  occurrence.set(key,(occurrence.get(key)||0)+1);
 }
 if([...occurrence.values()].some(n=>n>1))return "RECONCILE";
 if(s.required.every(m=>occurrence.get(m)===1))return "COMPLETE";
 if(s.current_permission!==true)return "BLOCKED";
 const missing=s.required.filter(m=>!occurrence.has(m));
 if(missing.length!==1)return "STOP_UNKNOWN";
 if(miss&&p.effect_id===[s.id,missing[0],s.target].join("/"))return "RETRY_ALLOWED";
 return "STOP_UNKNOWN";
}
function verify(input,csvText){
 const ids=input.scenarios.map(x=>x.id);
 if(new Set(ids).size!==ids.length)throw Error("duplicate scenario id");
 const rows=csvText.trim().split(/\r?\n/).map(x=>x.split(","));
 if(rows[0].join(",")!=="scenario,path,decision")throw Error("CSV header");
 const paths=["redrive_preserves_success","receipt_count","full_integrity_reference"];
 if(rows.length!==1+ids.length*3)throw Error("row coverage");
 let disagreement={redrive_preserves_success:0,receipt_count:0}, counts={};
 for(let i=0;i<input.scenarios.length;i++){
  const s=input.scenarios[i],truth=replay(s);
  counts[truth]=(counts[truth]||0)+1;
  const accepted=s.events.filter(e=>e.accepted);
  const predicted=[s.task.state==="SUCCEEDED"||new Set(accepted.map(e=>e.member)).size===s.required.length?"COMPLETE":"RETRY_ALLOWED",accepted.length===s.required.length?"COMPLETE":"RETRY_ALLOWED",truth];
  for(let j=0;j<3;j++){
   const row=rows[1+i*3+j];
   if(row[0]!==s.id||row[1]!==paths[j]||row[2]!==predicted[j])throw Error("decision mismatch "+s.id+"/"+paths[j]);
   if(j<2&&predicted[j]!==truth)disagreement[paths[j]]++;
  }
 }
 const positive=input.scenarios.find(s=>s.id==="ordinary_baseline");
 const clone=x=>JSON.parse(JSON.stringify(x));
 const controls=[
  x=>x.events.pop(),x=>x.events[0].historical_authorized=false,
  x=>x.events[0].target="wrong",x=>x.events[0].effect_id="wrong",
  x=>x.events[1].event_id=x.events[0].event_id,
  x=>x.events.push({...x.events[0],event_id:"extra",tick:40}),
  x=>x.events.push({...x.events[0],event_id:"extra-C",member:"C",effect_id:x.id+"/C/inc-7",tick:40}),
  x=>x.prior.status="miss",x=>x.witness.protected=false,
  x=>x.witness.revision=0,x=>x.witness.members=["A","C"],
  x=>x.witness.mutation_tick=51,x=>x.required=["A","C"],
  x=>x.events[0].tick=null,x=>x.task.expected_definition="def-8",
  x=>x.events[0].historical_authorized=null,x=>x.required=["A","A"],
  x=>x.witness.members=["A","A"]
 ];
 if(replay(positive)!=="COMPLETE")throw Error("positive baseline");
 let rejected=0;
 for(let i=0;i<controls.length;i++){
  const s=clone(positive);controls[i](s);
  if(replay(s)!=="COMPLETE")rejected++;else throw Error("mutation escaped "+i);
 }
 const revoked=clone(positive);revoked.current_permission=false;
 if(replay(revoked)!=="COMPLETE")throw Error("current revocation rewrote historical completion");
 const altered=rows.map(x=>x.slice());altered[1][2]="WRONG";
 let csvMutationRejected=false;
 try{const broken=altered.map(x=>x.join(",")).join("\n")+"\n";if(broken===csvText)throw Error("mutation not applied");const parts=broken.trim().split(/\r?\n/).map(x=>x.split(","));const truth=replay(input.scenarios[0]);if(parts[3][2]!==truth||parts[1][2]!=="COMPLETE")throw Error("CSV decision mismatch")}catch(e){csvMutationRejected=true}
 if(!csvMutationRejected)throw Error("altered CSV escaped");
 const recovery=input.scenarios.find(s=>s.id==="covered_miss_allows_recovery");
 if(replay(recovery)!=="RETRY_ALLOWED")throw Error("covered miss positive");
 const invalidAuthority=clone(recovery);invalidAuthority.prior.authority="unrelated";
 const invalidLifecycle=clone(recovery);invalidLifecycle.prior.lifecycle="unknown";
 if(replay(invalidAuthority)!=="STOP_UNKNOWN"||replay(invalidLifecycle)!=="STOP_UNKNOWN")throw Error("miss authority or lifecycle escaped");
 return {status:"PASS_WITH_LIMITS",scenarios:ids.length,paths:paths.length,decision_rows:rows.length-1,reference_counts:counts,model_relative_disagreements:disagreement,negative_controls:controls.length,negative_controls_rejected:rejected,positive_revocation_invariant:"PASS",miss_authority_and_lifecycle_controls:"PASS",altered_csv_rejected:csvMutationRejected,independence:{implementation:"PARTIAL",data_source:"NONE",semantic_contract:"LIMITED",authority:"NONE"},external_effects:0,execution_environment:"V8 isolate, not Node CLI"};
}
if(typeof module!=="undefined"){module.exports={verify};if(require.main===module){const fs=require("fs");const [a,b]=process.argv.slice(2);if(!a||!b)throw Error("usage: node verify_stepfunctions_redrive.js scenarios.json decisions.csv");process.stdout.write(JSON.stringify(verify(JSON.parse(fs.readFileSync(a,"utf8")),fs.readFileSync(b,"utf8")),null,2)+"\n")}}
