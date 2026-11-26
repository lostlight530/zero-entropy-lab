"use strict";
function fixtures(){
 const receipt={id:"receipt-A",task:"task-A",run:"run-A",attempt:"attempt-A",effect:"publish-A",session:"session-A",target:"bucket-A/object-A",generation:"gen-8",digest:"digest-A",at:30,grantFrom:10,grantUntil:40,actor:"actor-A",grantActor:"actor-A"};
 const full={task:"task-A",run:"run-A",attempt:"attempt-A",effect:"publish-A",session:"session-A",observedSession:"session-A",target:"bucket-A/object-A",observedTarget:"bucket-A/object-A",generation:"gen-8",currentGeneration:"gen-8",digest:"digest-A",currentDigest:"digest-A",status:200,offset:100,sent:100,size:100,prior:"hit",receipts:[receipt],permission:true,capability:true,readRev:7,commitRev:7,protected:true,sourceStable:true,queryExact:true,queryAuthority:true,queryWatermark:50,attemptEnd:40,retentionThrough:80,now:60,queryAt:55,active:true};
 const partial={...full,status:308,offset:70,prior:"unknown",receipts:[],currentGeneration:null,currentDigest:null};
 const gone={...partial,status:410,offset:null,capability:false};
 const add=(id,b,patch={})=>({id,...JSON.parse(JSON.stringify(b)),...patch});
 return [
 add("complete",full),add("revoked-after-effect",full,{permission:false}),
 add("partial",partial),add("empty-offset",partial,{offset:0}),add("all-sent-not-persisted",partial,{sent:100,offset:25}),
 add("offset-full-but-incomplete",partial,{offset:100}),add("foreign-session",partial,{observedSession:"session-B"}),
 add("session-capability-revoked-task",partial,{permission:false}),add("capability-lost",partial,{capability:false}),
 add("partial-revision-drift",partial,{commitRev:8}),add("source-mutated",partial,{sourceStable:false}),
 add("expired-unknown",gone),add("expired-authoritative-miss",gone,{prior:"miss"}),
 add("expired-stale-miss",gone,{prior:"miss",queryWatermark:20}),add("expired-retention-gap",gone,{prior:"miss",retentionThrough:45}),
 add("expired-foreign-query",gone,{prior:"miss",queryExact:false}),add("expired-no-authority",gone,{prior:"miss",queryAuthority:false}),
 add("expired-revoked",gone,{prior:"miss",permission:false}),add("expired-query-in-future",gone,{prior:"miss",queryAt:70}),
 add("success-without-receipt",full,{prior:"unknown",receipts:[]}),add("wrong-generation",full,{currentGeneration:"gen-9"}),
 add("wrong-digest",full,{currentDigest:"digest-B"}),add("foreign-receipt",full,{receipts:[{...receipt,session:"session-B"}]}),
 add("duplicate-receipt",full,{receipts:[receipt,receipt]}),add("extra-receipt",full,{receipts:[receipt,{...receipt,id:"receipt-B",effect:"publish-B"}]}),
 add("miss-positive-conflict",full,{prior:"miss"}),add("late-authorization",full,{receipts:[{...receipt,grantFrom:35}]}),
 add("wrong-actor",full,{receipts:[{...receipt,grantActor:"actor-B"}]}),add("completion-toctou",full,{commitRev:8}),
 add("missing-task",full,{task:null}),add("missing-protected-boundary",full,{protected:null}),add("offset-negative",partial,{offset:-1}),
 add("foreign-target",full,{observedTarget:"bucket-B/object-A"}),
 add("self-attack-forged-authority",full),add("self-attack-fake-atomicity",full)
 ];
}
function producer(x){
 const ids=["task","run","attempt","effect","session","target","generation","digest"];
 const valid=ids.every(k=>typeof x[k]==="string"&&x[k].length>0)&&x.session===x.observedSession&&x.target===x.observedTarget;
 const fence=x.protected===true&&Number.isInteger(x.readRev)&&x.readRev>0&&x.readRev===x.commitRev;
 const exact=x.receipts.length===1&&typeof x.receipts[0].id==="string"&&x.receipts[0].id.length>0&&ids.every(k=>x.receipts[0][k]===x[k]);
 const q=x.receipts[0];
 const historical=exact&&[q.at,q.grantFrom,q.grantUntil,x.attemptEnd,x.now].every(Number.isFinite)&&q.grantFrom<=q.at&&q.at<=q.grantUntil&&q.at<=x.attemptEnd&&x.attemptEnd<=x.now&&typeof q.actor==="string"&&q.actor.length>0&&q.actor===q.grantActor;
 const range=Number.isInteger(x.offset)&&Number.isInteger(x.size)&&x.size>0&&x.offset>=0&&x.offset<x.size;
 const miss=x.prior==="miss"&&x.receipts.length===0&&x.queryExact===true&&x.queryAuthority===true&&x.active===true&&[x.queryWatermark,x.attemptEnd,x.retentionThrough,x.now,x.queryAt].every(Number.isFinite)&&x.attemptEnd<=x.queryWatermark&&x.queryWatermark<=x.queryAt&&x.queryAt<=x.now&&x.now<=x.retentionThrough;
 let reference="STOP";
 if(valid&&fence&&x.sourceStable===true){
  if([200,201].includes(x.status)&&x.prior==="hit"&&historical&&x.generation===x.currentGeneration&&x.digest===x.currentDigest&&x.offset===x.size&&Number.isInteger(x.size)&&x.size>0) reference="MODEL_COMPLETE";
  else if(x.permission===true&&x.capability===true&&x.status===308&&range&&x.prior==="unknown"&&x.receipts.length===0)reference="RESUME_SAME_SESSION";
  else if(x.permission===true&&[404,410].includes(x.status)&&miss)reference="NEW_SESSION_CONDITIONAL";
 }
 return {statusOnly:[200,201].includes(x.status)?"MODEL_COMPLETE":[404,410].includes(x.status)?"NEW_SESSION_CONDITIONAL":x.status===308?"RESUME_SAME_SESSION":"STOP",sentOnly:x.sent===x.size?"MODEL_COMPLETE":"STOP",reference};
}
const rows=fixtures().map(input=>({input,output:producer(input)}));
console.log(JSON.stringify(rows,null,2));
