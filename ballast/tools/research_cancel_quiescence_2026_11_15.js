"use strict";
const scenarios = [
{id:"baseline_quiesced",events:[["dispatch","a"],["commit","a"],["receipt","a"],["cancel_request"],["cancel_ack"],["fence",2],["inflight_zero"],["closure",2]]},
{id:"ack_only_inflight",events:[["dispatch","a"],["cancel_request"],["cancel_ack"]]},
{id:"heartbeat_delayed",events:[["dispatch","a"],["cancel_request"],["cancel_ack"],["heartbeat","a"],["commit","a"]]},
{id:"stale_generation_commit",events:[["dispatch","a"],["cancel_request"],["cancel_ack"],["fence",2],["commit","a",1],["receipt","a"]]},
{id:"best_effort_cancel_failed",events:[["dispatch","a"],["cancel_request"],["cancel_ack"],["cancel_failed"],["commit","a"]]},
{id:"receipt_without_commit",events:[["dispatch","a"],["receipt","a"],["cancel_request"],["cancel_ack"],["fence",2],["inflight_zero"],["closure",2]]},
{id:"covered_positive_miss_conflict",events:[["dispatch","a"],["commit","a"],["receipt","a"],["covered_miss","a"],["cancel_request"],["cancel_ack"],["fence",2],["inflight_zero"],["closure",2]]},
{id:"duplicate_receipt",events:[["dispatch","a"],["commit","a"],["receipt","a"],["receipt","a"],["cancel_request"],["cancel_ack"],["fence",2],["inflight_zero"],["closure",2]]},
{id:"unlisted_effect",events:[["dispatch","a"],["commit","a"],["receipt","a"],["commit","c"],["receipt","c"],["cancel_request"],["cancel_ack"],["fence",2],["inflight_zero"],["closure",2]]},
{id:"membership_drift_after_closure",events:[["dispatch","a"],["commit","a"],["receipt","a"],["cancel_request"],["cancel_ack"],["fence",2],["inflight_zero"],["closure",2],["membership_revision",3]]},
{id:"unknown_retention",events:[["dispatch","a"],["cancel_request"],["cancel_ack"],["fence",2],["inflight_zero"],["closure",2],["uncovered_miss","a"]]},
{id:"extra_after_quiescence_claim",events:[["dispatch","a"],["commit","a"],["receipt","a"],["cancel_request"],["cancel_ack"],["fence",2],["inflight_zero"],["closure",2],["commit","c"]]}
];
const required=["a"];
const identity={task:"T15",run:"R15",attempt:"A15",targetUid:"U15",generation:1};
function producer(s){
 const ev=s.events, names=ev.map(x=>x[0]), ack=names.includes("cancel_ack");
 const weak=ack?"QUIESCENT":"RUNNING";
 let full="QUIESCENT";
 const receipts=ev.filter(x=>x[0]==="receipt").map(x=>x[1]);
 const commits=ev.filter(x=>x[0]==="commit");
 const fence=ev.find(x=>x[0]==="fence");
 const closure=ev.find(x=>x[0]==="closure");
 const zero=ev.findIndex(x=>x[0]==="inflight_zero");
 const closureIndex=ev.findIndex(x=>x[0]==="closure");
 if(ev.some(x=>x[0]==="covered_miss"&&receipts.includes(x[1])))full="EVIDENCE_CONFLICT";
 else if(new Set(receipts).size!==receipts.length)full="IDENTITY_CONFLICT";
 else if(commits.some(x=>!required.includes(x[1]))||receipts.some(x=>!required.includes(x)))full="EXTRA_EFFECT";
 else if(receipts.some(x=>!commits.some(y=>y[1]===x)))full="UNPROVEN_OCCURRENCE";
 else if(!ack||!fence||zero<0||!closure||closure[1]!==fence[1])full="UNKNOWN_QUIESCENCE";
 else if(commits.some(x=>x.length>2&&x[2]<fence[1]&&ev.indexOf(x)>ev.indexOf(fence)))full="STALE_COMMIT";
 else if(commits.some(x=>ev.indexOf(x)>closureIndex)||ev.some((x,i)=>x[0]==="membership_revision"&&i>closureIndex))full="TOCTOU";
 else if(ev.some(x=>x[0]==="uncovered_miss"))full="UNKNOWN_PRIOR_EFFECT";
 else if(commits.length!==required.length||receipts.length!==required.length)full="UNKNOWN_PRIOR_EFFECT";
 return {id:s.id,weak,full,newEffectPermission:ack?"DENY_NEW_EFFECT":"UNKNOWN_PERMISSION"};
}
function verifier(s){
 const events=s.events;let ack=false,fence=null,zeroAt=-1,closure=null,closureAt=-1;
 const receipts=new Map(),commits=new Map();let conflict=false,unknownMiss=false,lateCommit=false,stale=false,revisionAfter=false;
 events.forEach((e,i)=>{
  const [type,id,epoch]=e;
  if(type==="cancel_ack")ack=true;
  if(type==="fence")fence=id;
  if(type==="inflight_zero")zeroAt=i;
  if(type==="closure"){closure=id;closureAt=i;}
  if(type==="commit"){commits.set(id,(commits.get(id)||0)+1);if(closureAt>=0)lateCommit=true;if(fence!==null&&epoch!==undefined&&epoch<fence)stale=true;}
  if(type==="receipt")receipts.set(id,(receipts.get(id)||0)+1);
  if(type==="covered_miss"&&receipts.has(id))conflict=true;
  if(type==="uncovered_miss")unknownMiss=true;
  if(type==="membership_revision"&&closureAt>=0)revisionAfter=true;
 });
 let decision;
 if(conflict)decision="EVIDENCE_CONFLICT";
 else if([...receipts.values()].some(n=>n>1))decision="IDENTITY_CONFLICT";
 else if([...commits.keys(),...receipts.keys()].some(k=>!required.includes(k)))decision="EXTRA_EFFECT";
 else if([...receipts.keys()].some(k=>!commits.has(k)))decision="UNPROVEN_OCCURRENCE";
 else if(!ack||fence===null||zeroAt<0||closure===null||closure!==fence)decision="UNKNOWN_QUIESCENCE";
 else if(stale)decision="STALE_COMMIT";
 else if(lateCommit||revisionAfter)decision="TOCTOU";
 else if(unknownMiss||commits.size!==required.length||receipts.size!==required.length)decision="UNKNOWN_PRIOR_EFFECT";
 else decision="QUIESCENT";
 return {id:s.id,decision,sharedContract:"yes"};
}
function run(){
 const rows=scenarios.map(s=>({id:s.id,primitive:s.events,producer:producer(s),verifier:verifier(s)}));
 const ids=new Set(rows.map(r=>r.id));
 const disagreements=rows.filter(r=>r.producer.full!==r.verifier.decision);
 const weakFalse=rows.filter(r=>r.producer.weak==="QUIESCENT"&&r.producer.full!=="QUIESCENT");
 const summary={scenarios:rows.length,decisions:rows.length*2,weakFalseQuiescence:weakFalse.length,limitedVerifierAgreements:rows.length-disagreements.length,verifierDisagreements:disagreements.map(r=>r.id),realSinkCalls:0,realReceiptQueries:0};
 if(ids.size!==rows.length||disagreements.length||weakFalse.length<8)throw new Error("research model check failed "+JSON.stringify(summary));
 return {logicalDate:"2026-11-15",type:"SYNTHETIC_CONTROLLED_STUDY",identity,required,rows,summary,independence:{implementation:"PARTIAL",dataSource:"NONE",semanticContract:"SHARED",authority:"NONE"},provenance:"executed isolated Code Mode V8; not native Node CLI or real service"};
}
if(typeof module!=="undefined"&&module&&require.main===module)console.log(JSON.stringify(run(),null,2));
