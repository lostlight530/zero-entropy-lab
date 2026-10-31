'use strict';
const produce = function produce(items){
 const traces=[],decisions=[];
 for(const s of items){
  const events=[],tokens=new Map();
  for(const x of [...s.submits].sort((a,b)=>a.at-b.at)){
   let status,old=tokens.get(x.token);
   if(!Number.isSafeInteger(x.at)||typeof x.token!=="string"||typeof x.intent!=="string"||typeof x.payload!=="string")status="INVALID";
   else if(old&&x.at-old.at<600)status=old.intent===x.intent&&old.payload===x.payload?"IDEMPOTENT_REPLAY":"IDEMPOTENT_MISMATCH";
   else if(x.fail===true)status="TXN_CANCELED";
   else{status="SUCCESS";tokens.set(x.token,{at:x.at,intent:x.intent,payload:x.payload});events.push({kind:"txn_commit",at:x.at,token:x.token,intent:x.intent,payload:x.payload,txnId:"txn-"+(events.filter(e=>e.kind==="txn_commit").length+1)})}
   events.push({kind:"txn_response",at:x.at,token:x.token,intent:x.intent,payload:x.payload,status,delivered:x.delivered===true});
  }
  for(const e of s.effects)events.push({kind:"sink_receipt",...e});
  events.push({kind:"query",...s.query},{kind:"guard",...s.guard});
  const c=events.filter(e=>e.kind==="txn_commit"),r=events.filter(e=>e.kind==="txn_response"),fx=events.filter(e=>e.kind==="sink_receipt");
  const token=r.some(e=>e.delivered&&["SUCCESS","IDEMPOTENT_REPLAY"].includes(e.status))?"COMPLETE":"RECONCILE",txn=c.length?"COMPLETE":"RECONCILE";
  function reference(){
   const q=s.query,h=s.history,g=s.grant,p=s.permission,z=s.target,b=s.guard,t=s.task;
   const ints=[q.at,q.watermark,q.retentionUntil,h.lastEnd,g.start,g.end,p.at,p.validUntil,z.revision,b.at,b.commitAt,b.readRevision,b.commitRevision,...c.map(x=>x.at),...fx.map(x=>x.at)];
   if(!ints.every(Number.isSafeInteger)||!Array.isArray(h.attempts)||!Array.isArray(q.attempts)||!h.attempts.every(Number.isSafeInteger)||!q.attempts.every(Number.isSafeInteger))return "STOP_UNKNOWN";
   if(h.complete!==true||new Set(h.attempts).size!==h.attempts.length||h.attempts.length!==q.attempts.length||!h.attempts.every(x=>q.attempts.includes(x)))return "STOP_UNKNOWN";
   if(q.scope!==t.id+"/"+t.run+"/"+t.uid||q.watermark>q.at||q.watermark<h.lastEnd||q.retentionUntil<q.at||q.lifecycle!=="ACTIVE")return "STOP_UNKNOWN";
   if(q.status==="miss"){
    if(fx.length)return "EVIDENCE_CONFLICT";
    if(c.length)return "RECONCILE";
    if(p.allowed!==true||p.approval!==true||p.credential!==true||p.at>p.validUntil)return "BLOCKED";
    return s.retry.fenced===true&&s.retry.sinkDedup===true&&b.commitBound===true?"RETRY_ALLOWED":"STOP_UNKNOWN";
   }
   if(q.status!=="hit")return "STOP_UNKNOWN";
   if(c.length!==1||c[0].intent!==t.intent||c[0].payload!==t.payload)return "RECONCILE";
   if(!fx.length)return "STOP_UNKNOWN";
   const members=fx.map(e=>e.member);
   if(members.length!==t.members.length||new Set(members).size!==members.length||!t.members.every(x=>members.includes(x)))return "RECONCILE";
   for(const e of fx){
    if(e.effectId!=="effect-"+e.member||e.task!==t.id||e.run!==t.run||e.uid!==t.uid||!h.attempts.includes(e.attempt))return "RECONCILE";
    if(e.at<g.start||e.at>g.end||g.task!==t.id||g.run!==t.run||g.uid!==t.uid||!g.members.includes(e.member))return "BLOCKED";
   }
   if(z.uid!==t.uid||z.members.length!==t.members.length||new Set(z.members).size!==z.members.length||!t.members.every(x=>z.members.includes(x)))return "RECONCILE";
   if(b.commitBound!==true||b.readRevision!==z.revision||b.commitRevision!==z.revision||!(q.at<b.at&&b.at<b.commitAt))return "RECONCILE";
   return "COMPLETE";
  }
  traces.push({id:s.id,events});
  decisions.push({id:s.id,path:"token_proxy",decision:token},{id:s.id,path:"txn_proxy",decision:txn},{id:s.id,path:"full_reference",decision:reference()});
 }
 return {traces,decisions};
};
module.exports={produce};
if(require.main===module){const fs=require('node:fs');const s=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));process.stdout.write(JSON.stringify(produce(s.scenarios),null,2)+'\n')}
