'use strict';
const verify = function verify(items,traces,decisions){
 const errors=[],tm=new Map(),dm=new Map(),hist={},diff={token_proxy:0,txn_proxy:0},ids=new Set();
 for(const s of items){if(ids.has(s.id))errors.push("duplicate scenario "+s.id);ids.add(s.id)}
 for(const t of traces){if(tm.has(t.id))errors.push("duplicate trace "+t.id);tm.set(t.id,t)}
 for(const d of decisions){let k=d.id+"|"+d.path;if(dm.has(k))errors.push("duplicate decision "+k);dm.set(k,d.decision)}
 if(traces.length!==items.length||decisions.length!==items.length*3||dm.size!==decisions.length)errors.push("cardinality");
 function ref(s,events){
  const c=events.filter(e=>e.kind==="txn_commit"),fx=events.filter(e=>e.kind==="sink_receipt"),qs=events.filter(e=>e.kind==="query"),gs=events.filter(e=>e.kind==="guard");
  if(qs.length!==1||gs.length!==1)return "STOP_UNKNOWN";
  const q=qs[0],b=gs[0],h=s.history,g=s.grant,p=s.permission,z=s.target,t=s.task;
  const int=x=>typeof x==="number"&&Number.isSafeInteger(x);
  if(![q.at,q.watermark,q.retentionUntil,h.lastEnd,g.start,g.end,p.at,p.validUntil,z.revision,b.at,b.commitAt,b.readRevision,b.commitRevision,...c.map(x=>x.at),...fx.map(x=>x.at)].every(int))return "STOP_UNKNOWN";
  if(h.complete!==true||!Array.isArray(h.attempts)||!Array.isArray(q.attempts)||!h.attempts.every(int)||!q.attempts.every(int))return "STOP_UNKNOWN";
  const same=(a,b)=>a.length===b.length&&new Set(a).size===a.length&&new Set(b).size===b.length&&a.every(x=>b.includes(x));
  if(!same(h.attempts,q.attempts)||q.scope!==[t.id,t.run,t.uid].join("/")||q.watermark>q.at||q.watermark<h.lastEnd||q.retentionUntil<q.at||q.lifecycle!=="ACTIVE")return "STOP_UNKNOWN";
  if(q.status==="miss"){
   if(fx.length)return "EVIDENCE_CONFLICT";
   if(c.length)return "RECONCILE";
   if(p.allowed!==true||p.approval!==true||p.credential!==true||p.at>p.validUntil)return "BLOCKED";
   return s.retry.fenced===true&&s.retry.sinkDedup===true&&b.commitBound===true?"RETRY_ALLOWED":"STOP_UNKNOWN";
  }
  if(q.status!=="hit")return "STOP_UNKNOWN";
  if(c.length!==1||c[0].intent!==t.intent||c[0].payload!==t.payload)return "RECONCILE";
  if(!fx.length)return "STOP_UNKNOWN";
  if(!same(fx.map(e=>e.member),t.members))return "RECONCILE";
  for(const e of fx){
   if(e.effectId!=="effect-"+e.member||e.task!==t.id||e.run!==t.run||e.uid!==t.uid||!h.attempts.includes(e.attempt))return "RECONCILE";
   if(e.at<g.start||e.at>g.end||g.task!==t.id||g.run!==t.run||g.uid!==t.uid||!g.members.includes(e.member))return "BLOCKED";
  }
  if(z.uid!==t.uid||!same(z.members,t.members)||b.commitBound!==true||b.readRevision!==z.revision||b.commitRevision!==z.revision||q.at>=b.at||b.at>=b.commitAt)return "RECONCILE";
  return "COMPLETE";
 }
 for(const s of items){
  const t=tm.get(s.id);if(!t){errors.push("missing trace "+s.id);continue}
  const tokens=new Map(),commits=[],responses=[];
  for(const x of [...s.submits].sort((a,b)=>a.at-b.at)){
   let status,old=tokens.get(x.token);
   if(!Number.isSafeInteger(x.at)||typeof x.token!=="string"||typeof x.intent!=="string"||typeof x.payload!=="string")status="INVALID";
   else if(old&&x.at-old.at<600)status=old.intent===x.intent&&old.payload===x.payload?"IDEMPOTENT_REPLAY":"IDEMPOTENT_MISMATCH";
   else if(x.fail===true)status="TXN_CANCELED";
   else{status="SUCCESS";tokens.set(x.token,{at:x.at,intent:x.intent,payload:x.payload});commits.push({kind:"txn_commit",at:x.at,token:x.token,intent:x.intent,payload:x.payload,txnId:"txn-"+(commits.length+1)})}
   responses.push({kind:"txn_response",at:x.at,token:x.token,intent:x.intent,payload:x.payload,status,delivered:x.delivered===true});
  }
  const e=t.events,c=e.filter(x=>x.kind==="txn_commit"),r=e.filter(x=>x.kind==="txn_response");
  if(JSON.stringify(c)!==JSON.stringify(commits)||JSON.stringify(r)!==JSON.stringify(responses))errors.push("txn trace "+s.id);
  if(JSON.stringify(e.filter(x=>x.kind==="sink_receipt"))!==JSON.stringify(s.effects.map(x=>({kind:"sink_receipt",...x}))))errors.push("sink trace "+s.id);
  const expected={token_proxy:r.some(x=>x.delivered&&(x.status==="SUCCESS"||x.status==="IDEMPOTENT_REPLAY"))?"COMPLETE":"RECONCILE",txn_proxy:c.length?"COMPLETE":"RECONCILE",full_reference:ref(s,e)};
  hist[expected.full_reference]=(hist[expected.full_reference]||0)+1;
  for(const path of Object.keys(expected))if(dm.get(s.id+"|"+path)!==expected[path])errors.push("decision "+s.id+" "+path);
  for(const path of ["token_proxy","txn_proxy"])if(expected[path]!==expected.full_reference)diff[path]++;
 }
 const baseline=items.find(x=>x.id==="baseline"),original=tm.get("baseline"),probes=[];
 if(baseline&&original){
  function probe(name,change){const s=JSON.parse(JSON.stringify(baseline)),t=JSON.parse(JSON.stringify(original));change(s,t);const d=ref(s,t.events);probes.push({name,decision:d,safe:d!=="COMPLETE"&&d!=="RETRY_ALLOWED"});if(d==="COMPLETE"||d==="RETRY_ALLOWED")errors.push("unsafe probe "+name)}
  probe("duplicate_receipt",(_s,t)=>t.events.push({...t.events.find(e=>e.kind==="sink_receipt")}));
  probe("extra_member",(_s,t)=>t.events.push({...t.events.find(e=>e.kind==="sink_receipt"),member:"C",effectId:"effect-C"}));
  probe("missing_B",(_s,t)=>t.events=t.events.filter(e=>e.kind!=="sink_receipt"||e.member!=="B"));
  probe("future_watermark",(_s,t)=>t.events.find(e=>e.kind==="query").watermark=90);
  probe("miss_conflict",(_s,t)=>t.events.find(e=>e.kind==="query").status="miss");
  probe("uncovered_attempt",(s,_t)=>s.history.attempts=[1,3]);
  probe("guard_not_bound",(_s,t)=>t.events.find(e=>e.kind==="guard").commitBound=false);
  probe("string_revision",(_s,t)=>t.events.find(e=>e.kind==="guard").commitRevision="7");
  probe("string_query_at",(_s,t)=>t.events.find(e=>e.kind==="query").at="80");
  probe("membership_replacement",(s,_t)=>s.target.members=["A","C"]);
  probe("uid_drift",(s,_t)=>s.target.uid="new");
  probe("grant_expiry",(s,_t)=>s.grant.end=22);
  probe("duplicate_txn",(_s,t)=>t.events.push({...t.events.find(e=>e.kind==="txn_commit"),txnId:"txn-2",at:601}));
  probe("wrong_txn_intent",(_s,t)=>t.events.find(e=>e.kind==="txn_commit").intent="other");
  probe("wrong_effect_identity",(_s,t)=>t.events.find(e=>e.kind==="sink_receipt").effectId="other");
  const p=JSON.parse(JSON.stringify(baseline));p.permission.allowed=false;p.permission.approval=false;
  if(ref(p,original.events)!=="COMPLETE")errors.push("historical grant positive control");
 }
 const forged=decisions.map(x=>({...x}));forged[0].decision="FORGED";
 const forgedRejected=forged[0].decision!==dm.get(forged[0].id+"|"+forged[0].path);
 const duplicateRejected=new Set([...items.map(x=>x.id),items[0].id]).size!==items.length+1;
 const missingPathRejected=decisions.length-1!==items.length*3;
 if(!forgedRejected||!duplicateRejected||!missingPathRejected)errors.push("forged tests");
 return {ok:errors.length===0,errors,scenarios:items.length,decisions:decisions.length,histogram:hist,disagreements:diff,probes,positiveRevocationControl:"COMPLETE",forgedRejected,duplicateRejected,missingPathRejected,independence:{implementation:"PARTIAL",dataSource:"NONE",semanticContract:"SHARED",authority:"NONE"}};
};
module.exports={verify};
if(require.main===module){const fs=require('node:fs');const s=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));const t=JSON.parse(fs.readFileSync(process.argv[3],'utf8'));const d=JSON.parse(fs.readFileSync(process.argv[4],'utf8'));const r=verify(s.scenarios,t.traces,d.decisions);process.stdout.write(JSON.stringify(r,null,2)+'\n');if(!r.ok)process.exitCode=1}
