"use strict";
function verify(x){
 const fields=["task","run","attempt","transactionalId","producerId","epoch","sequence","topicId","partition","offset"], values=["task-28","run-28","attempt-A","tx-A","pid-A",4,9,"topic-A",0,12];
 const bound=z=>z!=null&&fields.map(k=>z[k]).every((v,i)=>v===values[i]);
 if(!x||!bound(x.tx)||!bound(x.observedTx)||!Array.isArray(x.brokerReceipts)||!Array.isArray(x.externalReceipts)||x.protected!==true||!Number.isInteger(x.commitRev)||x.commitRev<=0||x.commitRev!==x.readRev)return "STOP";
 const valid=z=>bound(z)&&typeof z.id==="string"&&z.id!==""&&z.actor==="actor-A"&&z.grantActor===z.actor&&[z.grantStart,z.at,z.grantEnd,x.attemptEnd,x.now].every(Number.isFinite)&&z.grantStart<=z.at&&z.at<=z.grantEnd&&z.at<=x.attemptEnd&&x.attemptEnd<=x.now;
 const b=x.brokerReceipts[0], e=x.externalReceipts[0], bOK=x.brokerPrior==="hit"&&x.brokerReceipts.length===1&&valid(b)&&b.outcome==="COMMIT";
 const target=x.currentTarget==="sink-A"&&x.currentIncarnation==="inc-A"&&x.currentEffect==="effect-A";
 if(bOK&&target&&x.externalPrior==="hit"&&x.externalReceipts.length===1&&valid(e)&&e.id!==b.id&&e.effect==="effect-A"&&e.target==="sink-A"&&e.incarnation==="inc-A"&&Number.isFinite(x.observedAt)&&b.at<=e.at&&e.at<=x.observedAt&&x.observedAt<=x.now&&x.currentPredicate===true)return "MODEL_COMPLETE";
 if(bOK&&target&&x.currentPredicate===false&&x.permission===true&&x.sinkPermission===true&&x.externalPrior==="miss"&&x.externalReceipts.length===0&&x.queryScope==="effect-A"&&x.queryTarget==="sink-A"&&x.queryIncarnation==="inc-A"&&x.queryAuthority===true&&x.queryExact===true&&x.queryActive===true){
  const {attemptEnd:a,watermark:w,queryAt:q,now:n,retention:t}=x;
  if([a,w,q,n,t].every(Number.isFinite)&&a<=w&&w<=q&&q<=n&&n<=t)return "EXTERNAL_CONDITIONAL";
 }
 if(x.timedOut===true&&x.client==="client-A"&&x.observedClient==="client-A"&&x.fenced===false&&x.permission===true&&x.brokerPermission===true&&x.brokerPrior==="unknown"&&x.externalPrior==="unknown"&&x.brokerReceipts.length===0&&x.externalReceipts.length===0){
  if(x.pending==="COMMIT"&&x.requested==="COMMIT")return "RETRY_SAME_COMMIT";
  if(x.pending==="ABORT"&&x.requested==="ABORT")return "RETRY_SAME_ABORT";
 }
 return "STOP";
}
function audit(rows,ids){
 if(!Array.isArray(rows)||rows.length!==ids.length||rows.some((r,i)=>!r||!r.input||!r.output||r.input.id!==ids[i])||new Set(rows.map(r=>r.input.id)).size!==ids.length)return false;
 return rows.every(({input:x,output:o})=>Object.keys(o).length===4&&o.reference===verify(x)&&o.timeoutFlip===(x.timedOut===true?(x.pending==="COMMIT"?"RETRY_SAME_ABORT":"RETRY_SAME_COMMIT"):"STOP")&&o.initOrVisible===(x.initOK===true||x.visible===true?"MODEL_COMPLETE":"STOP")&&o.absenceRetry===(x.visible===false?"EXTERNAL_CONDITIONAL":"STOP"));
}
function probes(rows,ids){
 const tests=[["omit",a=>a.pop()],["duplicate-row",a=>a[1]=a[0]],["foreign-task",a=>{let x=a[0].input;x.tx.task=x.observedTx.task=x.brokerReceipts[0].task=x.externalReceipts[0].task="task-other"}],["missing-epoch",a=>delete a[0].input.tx.epoch],["duplicate-receipt",a=>a[0].input.externalReceipts.push(a[0].input.externalReceipts[0])],["extra-effect",a=>a[0].input.externalReceipts.push({...a[0].input.externalReceipts[0],effect:"effect-B",id:"extra"})],["conflict",a=>a[0].input.externalPrior="miss"],["null-receipts",a=>a[0].input.brokerReceipts=null],["race",a=>a[0].input.commitRev=8],["flip-op",a=>a[2].input.requested="ABORT"],["fenced",a=>a[2].input.fenced=true],["stale-query",a=>a[17].input.watermark=20],["foreign-sink",a=>a[17].input.queryTarget="sink-B"],["forged-retry",a=>a[14].output.reference="EXTERNAL_CONDITIONAL"],["forged-complete",a=>a[16].output.reference="MODEL_COMPLETE"],["extra-output",a=>a[0].output.other="STOP"],["cross-receipt-id",a=>a[0].input.externalReceipts[0].id=a[0].input.brokerReceipts[0].id]];
 return tests.map(([name,mutate])=>{const a=JSON.parse(JSON.stringify(rows));mutate(a);return {name,rejected:!audit(a,ids)}});
}
const ids=["complete","revoked-after-effect","same-commit","same-abort","flip-to-abort","flip-to-commit","fenced-old-producer","foreign-client","epoch-drift","sequence-drift","revoked-pending","broker-permission-denied","pending-toctou","new-init-old-outcome-unknown","lso-hidden","scan-covered-but-unknown","kafka-commit-sink-unknown","exact-external-miss","stale-external-miss","retention-gap","wrong-query-effect","wrong-query-incarnation","untrusted-query","future-query","revoked-external","sink-permission-denied","broker-miss-positive-conflict","external-miss-positive-conflict","broker-abort","duplicate-broker","duplicate-external","extra-external","foreign-external-attempt","late-grant","effect-before-broker","current-incarnation-drift","completion-toctou","missing-protection","missing-receipt-id","coherent-foreign-task","coherent-foreign-topic","authority-self-attack","atomicity-self-attack"];
const data=JSON.parse(require('node:fs').readFileSync(process.argv[2],'utf8'));
const clean=audit(data.rows,ids), tests=probes(data.rows,ids);
console.log(JSON.stringify({clean,tests},null,2));
if(!clean||tests.some(t=>!t.rejected))process.exitCode=1;
