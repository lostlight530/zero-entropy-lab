// Independently implemented primitive-field replay, shared authored semantic contract
"use strict";
function independent(s){
 const d=s.delivery,q=s.query,c=s.current,t=s.task;
 const req=s.required.slice().sort().join("|");
 const scope=q.scopeMembers.slice().sort().join("|");
 const members=c.members.slice().sort().join("|");
 const rec=s.receipts.map(x=>x.member).sort().join("|");
 const unique=(a)=>new Set(a).size===a.length;
 let validQuery=q.exact===true&&q.covered===true&&q.lifecycle==="ACTIVE"&&q.scopeMessage===d.message&&q.scopeTargetUid===t.targetUid&&scope===req&&unique(q.scopeMembers)&&q.retentionUntil>=q.queryAt&&q.queryAt<=q.watermark;
 for(const receipt of s.receipts)if(receipt.effectAt>q.watermark)validQuery=false;
 if(q.kind==="MISS"&&validQuery&&s.receipts.length>0)return "EVIDENCE_CONFLICT";
 if(!validQuery||(q.kind!=="MISS"&&q.kind!=="HIT"))return "STOP_UNKNOWN";
 let guard=true;
 if(c.uid!==t.targetUid||members!==req||!unique(c.members)||!unique(s.required))guard=false;
 if(c.predicateComplete!==true||c.protected!==true||c.revision!==c.observedRevision||c.revision!==c.guardedRevision)guard=false;
 if(!(c.readAt<c.guardAt&&c.guardAt<c.commitAt))guard=false;
 if(q.kind==="MISS"){
  if(s.receipts.length!==0)return "STOP_UNKNOWN";
  if(s.permission.allow===true&&s.permission.protected===true&&guard&&c.state==="UNSATISFIED")return "RETRY_ALLOWED";
  return "STOP_UNKNOWN";
 }
 if(s.receipts.length===0)return "STOP_UNKNOWN";
 if(rec!==req||!unique(s.receipts.map(x=>x.member)))return "RECONCILE";
 for(const x of s.receipts)if(x.message!==d.message||x.targetUid!==t.targetUid||!x.effect)return "RECONCILE";
 for(const x of s.receipts)if(x.effectAt<x.grantFrom||x.effectAt>x.grantUntil)return "BLOCKED";
 if(d.ack!=="SUCCESS"||d.usedAck!==d.latestAck||d.region!==d.subscriberRegion||d.ackAt<d.deliveryAt||d.ackAt>d.deadline)return "RECONCILE";
 if(!guard||c.state!=="SATISFIED")return "RECONCILE";
 return "COMPLETE";
}
function verify(pack,rows){const ids=new Set();const failures=[];for(const s of pack){if(ids.has(s.id))failures.push("duplicate scenario "+s.id);ids.add(s.id);const expected=independent(s.facts);const subset=rows.filter(x=>x.scenario===s.id);if(subset.length!==3||new Set(subset.map(x=>x.path)).size!==3)failures.push("path coverage "+s.id);for(const r of subset){const want=r.path==="full_reference"?expected:r.path==="ack_proxy"?(s.facts.delivery.ack==="SUCCESS"?"COMPLETE":"STOP_UNKNOWN"):r.path==="message_proxy"?(s.facts.delivery.message?"COMPLETE":"STOP_UNKNOWN"):null;if(r.decision!==want)failures.push("decision "+s.id+" "+r.path);}}if(rows.length!==pack.length*3)failures.push("row count");return {pass:failures.length===0,failures,scenarioCount:pack.length,rowCount:rows.length};}
if(typeof require!=="undefined"&&require.main===module){const fs=require("fs");if(process.argv.length!==4)throw Error("usage: node verify_pubsub_ack_integrity.js scenarios.json decisions.json");const out=verify(JSON.parse(fs.readFileSync(process.argv[2],"utf8")),JSON.parse(fs.readFileSync(process.argv[3],"utf8")));process.stdout.write(JSON.stringify(out,null,2)+"\n");if(!out.pass)process.exitCode=1;}
if(typeof module!=="undefined")module.exports={verify,independent};
