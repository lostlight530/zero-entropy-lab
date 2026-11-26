"use strict";
function verifier(x){
 let action="STOP";
 const names=["task","run","attempt","effect","session","target","generation","digest"];
 if(names.some(k=>typeof x[k]!=="string"||!x[k]))return action;
 if(x.observedTarget!==x.target||x.observedSession!==x.session||x.sourceStable!==true||x.protected!==true||!Number.isInteger(x.commitRev)||x.commitRev<=0||x.commitRev!==x.readRev)return action;
 if(x.status===200||x.status===201){
  if(x.prior!=="hit"||x.receipts.length!==1||!Number.isInteger(x.size)||x.size<=0||x.size!==x.offset||x.currentGeneration!==x.generation||x.currentDigest!==x.digest)return action;
  const e=x.receipts[0]; if(!e||typeof e.id!=="string"||!e.id||names.some(k=>e[k]!==x[k])||typeof e.actor!=="string"||!e.actor||e.actor!==e.grantActor)return action;
  if([e.grantFrom,e.at,e.grantUntil,x.attemptEnd,x.now].some(n=>!Number.isFinite(n)))return action;
  if(e.at>=e.grantFrom&&e.at<=e.grantUntil&&e.at<=x.attemptEnd&&x.attemptEnd<=x.now)action="MODEL_COMPLETE";
 }else if(x.permission===true&&x.receipts.length===0){
  if(x.status===308&&x.capability===true&&x.prior==="unknown"&&Number.isInteger(x.size)&&Number.isInteger(x.offset)&&x.offset>=0&&x.offset<x.size)action="RESUME_SAME_SESSION";
  if((x.status===404||x.status===410)&&x.prior==="miss"&&[x.queryExact,x.queryAuthority,x.active].every(v=>v===true)&&[x.attemptEnd,x.queryWatermark,x.queryAt,x.now,x.retentionThrough].every(Number.isFinite)&&x.attemptEnd<=x.queryWatermark&&x.queryWatermark<=x.queryAt&&x.queryAt<=x.now&&x.now<=x.retentionThrough)action="NEW_SESSION_CONDITIONAL";
 }
 return action;
}
function audit(rows,expectedIds){
 if(rows.length!==expectedIds.length||new Set(rows.map(r=>r.input.id)).size!==rows.length||rows.some((r,i)=>r.input.id!==expectedIds[i]))return false;
 return rows.every(r=>{const x=r.input;return r.output.reference===verifier(x)&&r.output.statusOnly===([200,201].includes(x.status)?"MODEL_COMPLETE":[404,410].includes(x.status)?"NEW_SESSION_CONDITIONAL":x.status===308?"RESUME_SAME_SESSION":"STOP")&&r.output.sentOnly===(x.sent===x.size?"MODEL_COMPLETE":"STOP")});
}
const expectedIds=["complete","revoked-after-effect","partial","empty-offset","all-sent-not-persisted","offset-full-but-incomplete","foreign-session","session-capability-revoked-task","capability-lost","partial-revision-drift","source-mutated","expired-unknown","expired-authoritative-miss","expired-stale-miss","expired-retention-gap","expired-foreign-query","expired-no-authority","expired-revoked","expired-query-in-future","success-without-receipt","wrong-generation","wrong-digest","foreign-receipt","duplicate-receipt","extra-receipt","miss-positive-conflict","late-authorization","wrong-actor","completion-toctou","missing-task","missing-protected-boundary","offset-negative","foreign-target","self-attack-forged-authority","self-attack-fake-atomicity"];
const fs=require('node:fs');
const data=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
console.log(JSON.stringify({clean:audit(data.rows,expectedIds),agreements:data.rows.filter(r=>r.output.reference===verifier(r.input)).length}));
if(!audit(data.rows,expectedIds))process.exitCode=1;
