"use strict";
function review(rows){
 const ids="complete revoked-after-effect same-commit same-abort flip-to-abort flip-to-commit fenced-old-producer foreign-client epoch-drift sequence-drift revoked-pending broker-permission-denied pending-toctou new-init-old-outcome-unknown lso-hidden scan-covered-but-unknown kafka-commit-sink-unknown exact-external-miss stale-external-miss retention-gap wrong-query-effect wrong-query-incarnation untrusted-query future-query revoked-external sink-permission-denied broker-miss-positive-conflict external-miss-positive-conflict broker-abort duplicate-broker duplicate-external extra-external foreign-external-attempt late-grant effect-before-broker current-incarnation-drift completion-toctou missing-protection missing-receipt-id coherent-foreign-task coherent-foreign-topic authority-self-attack atomicity-self-attack".split(" ");
 const fixed=[["task","task-28"],["run","run-28"],["attempt","attempt-A"],["transactionalId","tx-A"],["producerId","pid-A"],["epoch",4],["sequence",9],["topicId","topic-A"],["partition",0],["offset",12]];
 const match=o=>o!=null&&typeof o==="object"&&fixed.every(([key,value])=>o[key]===value);
 const before=(...times)=>times.every(Number.isFinite)&&times.every((t,i)=>!i||times[i-1]<=t);
 const decide=x=>{
  if(!x||!match(x.tx)||!match(x.observedTx)||!Array.isArray(x.brokerReceipts)||!Array.isArray(x.externalReceipts)||x.protected!==true||!Number.isInteger(x.readRev)||x.readRev<1||x.readRev!==x.commitRev||!before(x.attemptEnd,x.now))return "STOP";
  function receipt(list,prior){
   if(prior!=="hit"||list.length!==1)return null;
   const z=list[0];if(!match(z)||typeof z.id!=="string"||!z.id.trim()||z.actor!=="actor-A"||z.grantActor!==z.actor||!before(z.grantStart,z.at,z.grantEnd)||!before(z.at,x.attemptEnd,x.now))return null;
   return z;
  }
  const b=receipt(x.brokerReceipts,x.brokerPrior),e=receipt(x.externalReceipts,x.externalPrior);
  const broker=b!==null&&b.outcome==="COMMIT",target=x.currentTarget==="sink-A"&&x.currentIncarnation==="inc-A"&&x.currentEffect==="effect-A";
  if(broker&&e!==null&&e.id!==b.id&&e.effect==="effect-A"&&e.target==="sink-A"&&e.incarnation==="inc-A"&&target&&x.currentPredicate===true&&before(b.at,e.at,x.attemptEnd,x.observedAt,x.now))return "MODEL_COMPLETE";
  if(broker&&target&&x.currentPredicate===false&&x.permission===true&&x.sinkPermission===true&&x.externalReceipts.length===0&&x.externalPrior==="miss"&&x.queryScope==="effect-A"&&x.queryTarget==="sink-A"&&x.queryIncarnation==="inc-A"&&[x.queryAuthority,x.queryExact,x.queryActive].every(v=>v===true)&&before(x.attemptEnd,x.watermark,x.queryAt,x.observedAt,x.now,x.retention))return "EXTERNAL_CONDITIONAL";
  if(x.timedOut===true&&x.initOK===false&&x.client==="client-A"&&x.observedClient===x.client&&x.fenced===false&&x.permission===true&&x.brokerPermission===true&&x.brokerPrior==="unknown"&&x.externalPrior==="unknown"&&x.brokerReceipts.length===0&&x.externalReceipts.length===0){
   if(x.pending==="COMMIT"&&x.requested==="COMMIT")return "RETRY_SAME_COMMIT";
   if(x.pending==="ABORT"&&x.requested==="ABORT")return "RETRY_SAME_ABORT";
  }
  return "STOP";
 };
 const manifest=Array.isArray(rows)&&rows.length===ids.length&&rows.every((z,i)=>z?.input?.id===ids[i])&&new Set(rows.map(z=>z.input.id)).size===ids.length;
 const recon=rows.map(({input:x,output:o})=>{const reference=decide(x);const weak={timeoutFlip:x.timedOut===true?(x.pending==="COMMIT"?"RETRY_SAME_ABORT":"RETRY_SAME_COMMIT"):"STOP",initOrVisible:x.initOK===true||x.visible===true?"MODEL_COMPLETE":"STOP",absenceRetry:x.visible===false?"EXTERNAL_CONDITIONAL":"STOP"};return {id:x.id,reference,match:reference===o.reference&&Object.keys(o).length===4&&Object.entries(weak).every(([k,v])=>o[k]===v)}});
 const tests=[
 ["pending-missing-now",2,x=>delete x.now,"STOP"],["pending-time-reversal",2,x=>x.now=20,"STOP"],["new-init-and-old-retry",2,x=>x.initOK=true,"STOP"],
 ["external-miss-read-before-query",17,x=>x.observedAt=49,"STOP"],["external-miss-future-read",17,x=>x.observedAt=61,"STOP"],["external-miss-read-missing",17,x=>delete x.observedAt,"STOP"],
 ["completion-read-before-attempt-end",0,x=>x.observedAt=36,"STOP"],["completion-whitespace-receipt",0,x=>x.externalReceipts[0].id=" ","STOP"],
 ["same-operation-new-epoch",2,x=>{x.tx.epoch=x.observedTx.epoch=5},"STOP"],["coherent-foreign-sink",0,x=>{x.currentTarget=x.externalReceipts[0].target="sink-B"},"STOP"],
 ["foreign-receipt-sequence",0,x=>x.brokerReceipts[0].sequence=10,"STOP"],["same-receipt-id-across-domains",0,x=>x.externalReceipts[0].id=x.brokerReceipts[0].id,"STOP"],
 ["unknown-LSO-raised",14,x=>{x.lso=100;x.scanThrough=99},"STOP"],["unknown-visibility-true",16,x=>x.visible=true,"STOP"],
 ["historical-completion-current-permission-revoked",0,x=>{x.permission=false;x.sinkPermission=false;x.brokerPermission=false},"MODEL_COMPLETE"],
 ["historical-completion-LSO-hidden",0,x=>{x.visible=false;x.lso=10;x.scanThrough=9},"MODEL_COMPLETE"]
 ];
 const probes=tests.map(([name,i,mutate,expected])=>{const input=JSON.parse(JSON.stringify(rows[i].input));mutate(input);const observed=decide(input);return {name,input,expected,observed,pass:observed===expected}});
 return {manifest,recon,probes,agreements:recon.filter(z=>z.match).length,probePass:probes.filter(p=>p.pass).length};
}
const data=JSON.parse(require('node:fs').readFileSync(process.argv[2],'utf8'));
const result=review(data.rows);
console.log(JSON.stringify(result,null,2));
if(!result.manifest||result.agreements!==data.rows.length||result.probePass!==result.probes.length)process.exitCode=1;
