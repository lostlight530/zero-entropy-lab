// Independently implemented primitive-field replay, shared authored semantic contract
"use strict";
function independent(s){
 const t=s.task,d=s.delivery,q=s.query,c=s.current,p=s.permission,r=s.receipts;
 const nat=x=>typeof x==="number"&&Number.isSafeInteger(x)&&x>=0;
 const uniq=x=>Array.isArray(x)&&x.length===new Set(x).size;
 const eq=(a,b)=>uniq(a)&&uniq(b)&&a.length===b.length&&a.slice().sort().join("|")===b.slice().sort().join("|");
 const ef=Array.isArray(t.effects)?t.effects.map(z=>z.member+":"+z.id):[];
 if(!eq(s.required,["A","B"])||!eq(ef,["A:A1","B:B1"])||!Array.isArray(r)||!Array.isArray(c.members))return "STOP_UNKNOWN";
 if(![t.attempt,d.attempt,d.deadline,d.ackAt,d.deliveryAt,d.ackGeneration,d.latestGeneration,q.watermark,q.queryAt,q.retentionUntil,q.attemptEnd,c.readAt,c.guardAt,c.commitAt,c.revision,c.observedRevision,c.guardedRevision,p.guardAt].every(nat))return "STOP_UNKNOWN";
 let covered=q.covered===true&&q.exact===true&&q.lifecycle==="ACTIVE"&&d.subscriptionType==="PULL"&&d.exactlyOnce===true;
 for(const [f,v] of Object.entries({scopeMessage:d.message,scopeTargetUid:t.targetUid,scopeTask:t.id,scopeRun:t.run,scopeIntent:t.intent,scopeTarget:t.target,scopeSubscription:d.subscription,scopeRegion:d.region}))if(q[f]!==v)covered=false;
 if(!eq(q.scopeMembers,s.required)||!eq(q.scopeEffects,ef)||!Array.isArray(q.scopeAttempts)||q.scopeAttempts.length!==2||q.scopeAttempts[0]!==1||q.scopeAttempts[1]!==2||t.attempt!==2||d.attempt!==2||q.watermark<q.attemptEnd||q.queryAt<q.watermark||q.queryAt>=c.guardAt||q.retentionUntil<q.queryAt)covered=false;
 if(q.kind==="MISS"&&covered&&r.length>0)return "EVIDENCE_CONFLICT";
 if(!covered||(q.kind!=="MISS"&&q.kind!=="HIT"))return "STOP_UNKNOWN";
 let current=c.uid===t.targetUid&&eq(c.members,s.required)&&eq(c.scopeEffects,ef)&&c.predicateComplete===true&&c.protected===true&&c.revision===c.observedRevision&&c.observedRevision===c.guardedRevision&&c.readAt<c.guardAt&&c.guardAt<c.commitAt;
 for(const [f,v] of Object.entries({scopeTask:t.id,scopeRun:t.run,scopeIntent:t.intent,scopeTarget:t.target,scopeSubscription:d.subscription}))if(c[f]!==v)current=false;
 if(q.kind==="MISS"){if(r.length)return "STOP_UNKNOWN";const z=p.scope;if(!z||z.task!==t.id||z.run!==t.run||z.intent!==t.intent||z.targetUid!==t.targetUid||z.subscription!==d.subscription||z.attempt!==t.attempt||p.guardAt<=q.queryAt||p.guardAt>=c.commitAt)return "STOP_UNKNOWN";return p.allow===true&&p.protected===true&&current&&c.state==="UNSATISFIED"?"RETRY_ALLOWED":"STOP_UNKNOWN"}
 if(!r.length)return "STOP_UNKNOWN";
 if(!eq(r.map(z=>z.member),s.required)||!eq(r.map(z=>z.member+":"+z.effect),ef))return "RECONCILE";
 for(const z of r){const identity=[z.message===d.message,z.targetUid===t.targetUid,z.task===t.id,z.run===t.run,z.intent===t.intent,z.target===t.target,z.subscription===d.subscription,z.attempt===t.attempt];if(!identity.every(Boolean)||!nat(z.effectAt)||!nat(z.attempt)||z.effectAt<d.deliveryAt||z.effectAt>q.watermark)return "RECONCILE";if(!nat(z.grantFrom)||!nat(z.grantUntil)||z.grantFrom>z.effectAt||z.grantUntil<z.effectAt||(z.revokedAt!==null&&(!nat(z.revokedAt)||z.revokedAt<=z.effectAt)))return "BLOCKED"}
 if(![d.ack==="SUCCESS",d.usedAck===d.latestAck,d.ackGeneration===d.latestGeneration,d.region===d.subscriberRegion,d.deliveryAt<=d.ackAt,d.ackAt<=d.deadline].every(Boolean))return "RECONCILE";
 return current&&c.state==="SATISFIED"?"COMPLETE":"RECONCILE"
}
function verify(pack,rows){const ids=new Set();const failures=[];for(const s of pack){if(ids.has(s.id))failures.push("duplicate scenario "+s.id);ids.add(s.id);const expected=independent(s.facts);const subset=rows.filter(x=>x.scenario===s.id);if(subset.length!==3||new Set(subset.map(x=>x.path)).size!==3)failures.push("path coverage "+s.id);for(const r of subset){const want=r.path==="full_reference"?expected:r.path==="ack_proxy"?(s.facts.delivery.ack==="SUCCESS"?"COMPLETE":"STOP_UNKNOWN"):r.path==="message_proxy"?(s.facts.delivery.message?"COMPLETE":"STOP_UNKNOWN"):null;if(r.decision!==want)failures.push("decision "+s.id+" "+r.path);}}if(rows.length!==pack.length*3)failures.push("row count");return {pass:failures.length===0,failures,scenarioCount:pack.length,rowCount:rows.length};}
if(typeof require!=="undefined"&&require.main===module){const fs=require("fs");if(process.argv.length!==4)throw Error("usage: node verify_pubsub_ack_integrity.js scenarios.json decisions.json");const out=verify(JSON.parse(fs.readFileSync(process.argv[2],"utf8")),JSON.parse(fs.readFileSync(process.argv[3],"utf8")));process.stdout.write(JSON.stringify(out,null,2)+"\n");if(!out.pass)process.exitCode=1;}
if(typeof module!=="undefined")module.exports={verify,independent};
