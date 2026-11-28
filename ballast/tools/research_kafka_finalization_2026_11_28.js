"use strict";
function fixtures(){
 const tx={task:"task-28",run:"run-28",attempt:"attempt-A",transactionalId:"tx-A",producerId:"pid-A",epoch:4,sequence:9,topicId:"topic-A",partition:0,offset:12};
 const broker={...tx,id:"broker-receipt",outcome:"COMMIT",at:30,actor:"actor-A",grantActor:"actor-A",grantStart:10,grantEnd:40};
 const ext={...tx,id:"sink-receipt",effect:"effect-A",target:"sink-A",incarnation:"inc-A",at:35,actor:"actor-A",grantActor:"actor-A",grantStart:10,grantEnd:40};
 const done={tx,observedTx:tx,client:"client-A",observedClient:"client-A",pending:"NONE",requested:"NONE",timedOut:false,fenced:false,initOK:true,permission:true,brokerPermission:true,sinkPermission:true,brokerPrior:"hit",brokerReceipts:[broker],externalPrior:"hit",externalReceipts:[ext],visible:true,lso:20,scanThrough:19,queryScope:"effect-A",queryTarget:"sink-A",queryIncarnation:"inc-A",queryAuthority:true,queryExact:true,queryActive:true,attemptEnd:40,watermark:45,queryAt:50,now:60,retention:80,currentTarget:"sink-A",currentIncarnation:"inc-A",currentEffect:"effect-A",currentPredicate:true,observedAt:55,readRev:7,commitRev:7,protected:true};
 const pending={...done,pending:"COMMIT",requested:"COMMIT",timedOut:true,initOK:false,brokerPrior:"unknown",brokerReceipts:[],externalPrior:"unknown",externalReceipts:[],visible:false,lso:10,scanThrough:9,currentPredicate:false};
 const missing={...done,externalPrior:"miss",externalReceipts:[],currentPredicate:false};
 const copy=x=>JSON.parse(JSON.stringify(x)), add=(id,x,fn=()=>{})=>{let y=copy(x);fn(y);return{id,...y}};
 return [
 add("complete",done),add("revoked-after-effect",done,x=>x.permission=false),
 add("same-commit",pending),add("same-abort",pending,x=>x.pending=x.requested="ABORT"),add("flip-to-abort",pending,x=>x.requested="ABORT"),add("flip-to-commit",pending,x=>{x.pending="ABORT";x.requested="COMMIT"}),
 add("fenced-old-producer",pending,x=>x.fenced=true),add("foreign-client",pending,x=>x.observedClient="client-B"),add("epoch-drift",pending,x=>x.observedTx.epoch=5),add("sequence-drift",pending,x=>x.observedTx.sequence=10),add("revoked-pending",pending,x=>x.permission=false),add("broker-permission-denied",pending,x=>x.brokerPermission=false),add("pending-toctou",pending,x=>x.commitRev=8),
 add("new-init-old-outcome-unknown",pending,x=>{x.initOK=true;x.timedOut=false;x.pending=x.requested="NONE";x.observedTx.epoch=5}),add("lso-hidden",pending,x=>{x.timedOut=false;x.pending=x.requested="NONE";x.initOK=true}),add("scan-covered-but-unknown",pending,x=>{x.timedOut=false;x.pending=x.requested="NONE";x.lso=20;x.scanThrough=19}),
 add("kafka-commit-sink-unknown",done,x=>{x.externalPrior="unknown";x.externalReceipts=[];x.currentPredicate=false}),add("exact-external-miss",missing),add("stale-external-miss",missing,x=>x.watermark=20),add("retention-gap",missing,x=>x.retention=55),add("wrong-query-effect",missing,x=>x.queryScope="effect-B"),add("wrong-query-incarnation",missing,x=>x.queryIncarnation="inc-B"),add("untrusted-query",missing,x=>x.queryAuthority=false),add("future-query",missing,x=>x.queryAt=70),add("revoked-external",missing,x=>x.permission=false),add("sink-permission-denied",missing,x=>x.sinkPermission=false),
 add("broker-miss-positive-conflict",done,x=>x.brokerPrior="miss"),add("external-miss-positive-conflict",done,x=>x.externalPrior="miss"),add("broker-abort",done,x=>x.brokerReceipts[0].outcome="ABORT"),add("duplicate-broker",done,x=>x.brokerReceipts.push(copy(x.brokerReceipts[0]))),add("duplicate-external",done,x=>x.externalReceipts.push(copy(x.externalReceipts[0]))),add("extra-external",done,x=>x.externalReceipts.push({...x.externalReceipts[0],id:"extra",effect:"effect-B"})),add("foreign-external-attempt",done,x=>x.externalReceipts[0].attempt="attempt-B"),add("late-grant",done,x=>x.externalReceipts[0].grantStart=36),add("effect-before-broker",done,x=>x.externalReceipts[0].at=25),add("current-incarnation-drift",done,x=>x.currentIncarnation="inc-B"),add("completion-toctou",done,x=>x.commitRev=8),add("missing-protection",done,x=>delete x.protected),add("missing-receipt-id",done,x=>delete x.externalReceipts[0].id),add("coherent-foreign-task",done,x=>{x.tx.task=x.observedTx.task="task-foreign";x.brokerReceipts[0].task=x.externalReceipts[0].task="task-foreign"}),add("coherent-foreign-topic",done,x=>{x.tx.topicId=x.observedTx.topicId="topic-B";x.brokerReceipts[0].topicId=x.externalReceipts[0].topicId="topic-B"}),add("authority-self-attack",done),add("atomicity-self-attack",done)
 ];
}
function produce(x){
 const anchor={task:"task-28",run:"run-28",attempt:"attempt-A",transactionalId:"tx-A",producerId:"pid-A",epoch:4,sequence:9,topicId:"topic-A",partition:0,offset:12};
 const exact=z=>!!z&&Object.entries(anchor).every(([k,v])=>z[k]===v);
 const order=a=>a.every(Number.isFinite)&&a.every((v,i)=>i===0||a[i-1]<=v);
 const receipt=z=>exact(z)&&typeof z.id==="string"&&z.id.length>0&&z.actor==="actor-A"&&z.actor===z.grantActor&&order([z.grantStart,z.at,z.grantEnd])&&order([z.at,x.attemptEnd,x.now]);
 const fence=x.protected===true&&Number.isInteger(x.readRev)&&x.readRev>0&&x.readRev===x.commitRev;
 let ref="STOP";
 if(exact(x.tx)&&exact(x.observedTx)&&fence&&Array.isArray(x.brokerReceipts)&&Array.isArray(x.externalReceipts)){
  const b=x.brokerReceipts[0],e=x.externalReceipts[0],bh=x.brokerPrior==="hit"&&x.brokerReceipts.length===1&&receipt(b)&&b.outcome==="COMMIT";
  const eh=x.externalPrior==="hit"&&x.externalReceipts.length===1&&receipt(e)&&e.effect==="effect-A"&&e.target==="sink-A"&&e.incarnation==="inc-A";
  const miss=x.externalPrior==="miss"&&x.externalReceipts.length===0&&x.queryScope==="effect-A"&&x.queryTarget==="sink-A"&&x.queryIncarnation==="inc-A"&&x.queryAuthority===true&&x.queryExact===true&&x.queryActive===true&&order([x.attemptEnd,x.watermark,x.queryAt,x.now,x.retention]);
  if(bh&&eh&&b.id!==e.id&&order([b.at,e.at,x.observedAt,x.now])&&x.currentTarget==="sink-A"&&x.currentIncarnation==="inc-A"&&x.currentEffect==="effect-A"&&x.currentPredicate===true)ref="MODEL_COMPLETE";
  else if(bh&&miss&&x.permission===true&&x.sinkPermission===true&&x.currentTarget==="sink-A"&&x.currentIncarnation==="inc-A"&&x.currentEffect==="effect-A"&&x.currentPredicate===false)ref="EXTERNAL_CONDITIONAL";
  else if(x.timedOut===true&&["COMMIT","ABORT"].includes(x.pending)&&x.requested===x.pending&&x.client==="client-A"&&x.observedClient===x.client&&x.fenced===false&&x.permission===true&&x.brokerPermission===true&&x.brokerPrior==="unknown"&&x.brokerReceipts.length===0&&x.externalPrior==="unknown"&&x.externalReceipts.length===0)ref="RETRY_SAME_"+x.pending;
 }
 return {timeoutFlip:x.timedOut===true?(x.pending==="COMMIT"?"RETRY_SAME_ABORT":"RETRY_SAME_COMMIT"):"STOP",initOrVisible:x.initOK===true||x.visible===true?"MODEL_COMPLETE":"STOP",absenceRetry:x.visible===false?"EXTERNAL_CONDITIONAL":"STOP",reference:ref};
}
console.log(JSON.stringify(fixtures().map(input=>({input,output:produce(input)})),null,2));
