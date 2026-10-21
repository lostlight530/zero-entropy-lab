"use strict";
/** Primitive-fact verifier, no import of replay producer, shares authored model semantic contract */
const fs=require("node:fs");
const PATHS=["token_proxy","count_proxy","full_reference"];
function replay(s) {
 const a=s.attempt,w=s.witness,p=s.prior,events=s.effects.filter(e=>e.accepted===true);
 const expected=x=>[s.workflow,s.task,s.target,x].join("|");
 const eligible=(p.scope==="exact_task_target_member"&&p.authority==="modeled_sink_journal"&&p.retention===true&&p.lifecycle===true&&p.journalComplete===true&&Number.isFinite(p.watermark)&&Number.isFinite(p.queriedAt)&&Number.isFinite(a.started)&&p.watermark>=a.started&&p.queriedAt>=p.watermark);
 const has=events.find(e=>e.effectId===p.effectId)!==undefined;
 if(eligible&&p.status==="hit"&&!has)return "EVIDENCE_CONFLICT";
 if(eligible&&p.status==="miss"&&has)return "EVIDENCE_CONFLICT";
 if(!Array.isArray(s.required)||!s.required.length||new Set(s.required).size!==s.required.length)return "RECONCILE";
 if(!Array.isArray(w.members)||w.members.length!==s.required.length||new Set(w.members).size!==w.members.length||w.members.some(m=>!s.required.includes(m))||w.protected!==true||w.revision!==s.currentRevision||!Number.isFinite(w.observed)||!Number.isFinite(w.commit)||w.observed>w.commit)return "RECONCILE";
 const ev=new Set(),receipts=new Set(),memberCount={};
 for(const e of events) {
  if(ev.has(e.eventId)||receipts.has(e.receiptId))return "RECONCILE";
  ev.add(e.eventId);receipts.add(e.receiptId);
  if(e.authorized!==true||e.task!==s.task||e.target!==s.target||e.effectId!==expected(e.member)||!s.required.includes(e.member)||!Number.isFinite(e.at)||e.at<a.started||e.at>w.observed)return "RECONCILE";
  memberCount[e.member]=(memberCount[e.member]||0)+1;
 }
 if(Object.values(memberCount).some(n=>n!==1))return "RECONCILE";
 if(s.required.every(m=>memberCount[m]===1))return "COMPLETE";
 if(s.permission===false)return "BLOCKED";
 if(s.permission!==true)return "STOP_UNKNOWN";
 const missing=s.required.filter(x=>memberCount[x]===undefined);
 if(missing.length===1&&p.status==="miss"&&eligible&&p.effectId===expected(missing[0]))return "RETRY_ALLOWED";
 return "STOP_UNKNOWN";
}
function verify(data,csv) {
 if(data.logicalDate!=="2026-10-22"||!Array.isArray(data.scenarios))throw Error("invalid fixture envelope");
 const rows=csv.trimEnd().split(/\r?\n/).map(line=>line.split(","));
 if(rows[0].join(",")!=="scenario,path,decision")throw Error("invalid CSV header");
 if(rows.length!==1+data.scenarios.length*3)throw Error("row count");
 const ids=new Set(),counts={},dis={token_proxy:0,count_proxy:0}; let i=1,accepted=0;
 for(const s of data.scenarios) {
  if(typeof s.id!=="string"||ids.has(s.id))throw Error("scenario uniqueness");ids.add(s.id);
  const observed=replay(s), effects=s.effects.filter(e=>e.accepted===true);
  const truth=[
    s.token.status==="ACKED"?"COMPLETE":"RETRY_ALLOWED",
    effects.length===s.required.length?"COMPLETE":"RETRY_ALLOWED",
    observed
  ];
  for(let j=0;j<PATHS.length;j++) {
   const row=rows[i++];
   if(row[0]!==s.id||row[1]!==PATHS[j]||row[2]!==truth[j])throw Error("CSV scenario/path/decision mismatch: "+s.id+"/"+PATHS[j]);
  }
  counts[observed]=(counts[observed]||0)+1;
  dis.token_proxy+=Number(truth[0]!==observed);dis.count_proxy+=Number(truth[1]!==observed);
  accepted+=effects.length;
 }
 const baseline=data.scenarios.find(s=>s.id==="baseline_complete"), missing=data.scenarios.find(s=>s.id==="covered_miss_missing_B"), clone=x=>JSON.parse(JSON.stringify(x));
 if(!baseline||!missing||replay(baseline)!=="COMPLETE"||replay(missing)!=="RETRY_ALLOWED")throw Error("reference invariants");
 const negative=[
 x=>x.effects.pop(),
 x=>x.effects[1].member="C",
 x=>x.effects.push({...x.effects[0],eventId:"evt-extra-C",receiptId:"rec-extra-C",effectId:[x.workflow,x.task,x.target,"C"].join("|"),member:"C"}),
 x=>x.effects.push({...x.effects[0],eventId:"evt-retry",receiptId:"rec-retry"}),
 x=>x.effects[1].receiptId=x.effects[0].receiptId,
 x=>x.effects[1].eventId=x.effects[0].eventId,
 x=>x.effects[1].authorized=false,
 x=>x.effects[1].authorized=null,
 x=>x.effects[1].task="other",
 x=>x.effects[1].target="different-incarnation",
 x=>x.effects[1].effectId="wrong",
 x=>x.attempt.started=35,
 x=>x.effects[1].at=55,
 x=>x.effects[1].at=NaN,
 x=>x.effects[1].at="40",
 x=>x.effects[1].at=-1,
 x=>{x.effects.pop();x.prior.status="unknown"},
 x=>{x.effects.pop();x.prior.status="miss";x.permission=false},
 x=>{x.effects.pop();x.prior.status="miss";x.permission="unknown"},
 x=>x.prior.status="miss",
 x=>x.witness.protected=false,
 x=>x.currentRevision=8,
 x=>x.witness.members=["A","C"],
 x=>x.witness.members=["A","A"],
 x=>x.witness.observed=61,
 x=>x.witness.observed=NaN,
 x=>x.witness.commit=NaN,
 x=>{x.required=[];x.witness.members=[]},
 x=>x.required=["A","A"],
 x=>{x.required=["A","C"];x.witness.members=["A","C"]},
 x=>{x.effects.pop();x.prior.status="miss";x.prior.scope="aggregate"},
 x=>{x.effects.pop();x.prior.status="miss";x.prior.authority="replica"},
 x=>{x.effects.pop();x.prior.status="miss";x.prior.watermark=19},
 x=>{x.effects.pop();x.prior.status="miss";x.prior.watermark="Infinity"},
 x=>{x.effects.pop();x.prior.status="miss";x.prior.retention=false},
 x=>{x.effects.pop();x.prior.status="miss";x.prior.lifecycle=false},
 x=>{x.effects.pop();x.prior.status="miss";x.prior.queriedAt=10},
 x=>{x.effects.pop();x.prior.status="miss";x.prior.journalComplete=false},
 x=>{x.effects.pop();x.prior.status="miss";x.prior.effectId="wrong"},
 x=>{x.effects[1].at=10000},
 x=>{x.effects.pop();x.permission=true;x.prior.status="hit";x.prior.watermark=0}
 ];
 let rejected=0;for(let k=0;k<negative.length;k++){const s=clone(baseline);negative[k](s);if(replay(s)==="COMPLETE")throw Error("negative mutation escaped "+k);rejected++;}
 const positives=[
 x=>x.permission=false,
 x=>{x.token.status="REJECTED";x.token.attempt=2},
 x=>{x.token.status="CANCELED"}
 ];
 let passed=0;for(let k=0;k<positives.length;k++){const s=clone(baseline);positives[k](s);if(replay(s)!=="COMPLETE")throw Error("positive invariant failed "+k);passed++;}
 const changed=csv.replace("baseline_complete,full_reference,COMPLETE","baseline_complete,full_reference,RECONCILE");
 if(changed===csv)throw Error("CSV mutation setup");
 let mismatchCaught=false;try{verifyRowsOnly(data,changed)}catch(e){mismatchCaught=true}
 if(!mismatchCaught)throw Error("CSV tampering accepted");
 return {status:"PASS_WITH_LIMITS",scenarios:ids.size,decision_rows:rows.length-1,accepted_effects:accepted,reference_counts:counts,model_relative_disagreements:dis,negative_controls:rejected,positive_invariants:passed,altered_csv_rejected:true,independence:{implementation:"PARTIAL",data_source:"NONE",semantic_contract:"LIMITED",authority:"NONE"},external_effects:0};
}
function verifyRowsOnly(data,csv) {
 const rows=csv.trimEnd().split(/\r?\n/);
 const expected=1+data.scenarios.length*3;
 if(rows.length!==expected)throw Error("coverage");
 for(let i=0;i<data.scenarios.length;i++){
  const s=data.scenarios[i];
  const line=rows[1+i*3+2].split(",");
  if(line[0]!==s.id||line[1]!=="full_reference"||line[2]!==replay(s))throw Error("reference CSV drift");
 }
}
module.exports={replay,verify};
if(require.main===module) {
 const [f,c]=process.argv.slice(2);
 if(!f||!c)throw Error("usage: node verify_async_token.js scenarios.json decisions.csv");
 const output=verify(JSON.parse(fs.readFileSync(f,"utf8")),fs.readFileSync(c,"utf8"));
 process.stdout.write(JSON.stringify(output,null,2)+"\n");
}
