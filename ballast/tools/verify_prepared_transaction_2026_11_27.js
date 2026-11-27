"use strict";
function verify(x){
 const f=["member","db","gid","xid","epoch","effect"], str=v=>typeof v==="string"&&v!=="", id=e=>f.map(k=>e[k]);
 const setMatch=(arr,exp)=>{if(!Array.isArray(arr)||arr.length!==exp.length||arr.some(a=>!a||f.some(k=>!str(a[k]))))return false;const remaining=exp.map(id);const members=new Set();for(const a of arr){if(members.has(a.member))return false;members.add(a.member);const i=remaining.findIndex(b=>b.every((v,j)=>v===id(a)[j]));if(i<0)return false;remaining.splice(i,1)}return remaining.length===0};
 if(!["task","run","attempt","decision"].every(k=>str(x[k]))||x.expected.length!==2||!setMatch(x.expected,x.expected))return "STOP";
 if(x.decisionKind!=="COMMIT"||x.decisionTask!==x.task||x.decisionRun!==x.run||x.decisionAttempt!==x.attempt||!setMatch(x.decisionMembers,x.expected)||!Number.isFinite(x.decisionAt)||!(x.decisionAt<=x.now))return "STOP";
 if(x.protected!==true||x.commitRev!==x.readRev||!Number.isInteger(x.commitRev)||x.commitRev<=0)return "STOP";
 if(x.prior==="hit"&&x.prepared.length===0&&setMatch(x.current,x.expected)&&setMatch(x.receipts,x.expected)){
 const ids=new Set();for(const e of x.receipts){if(!str(e.id)||ids.has(e.id)||e.task!==x.task||e.run!==x.run||e.attempt!==x.attempt||e.decision!==x.decision||e.outcome!=="COMMIT"||!str(e.actor)||e.actor!==e.grantActor)return "STOP";ids.add(e.id);if(![e.from,e.at,e.until,x.attemptEnd,x.now,x.observedAt].every(Number.isFinite)||!(e.from<=e.at&&e.at<=e.until&&x.decisionAt<=e.at&&e.at<=x.attemptEnd&&x.attemptEnd<=x.observedAt&&x.observedAt<=x.now))return "STOP"}
 return "MODEL_COMPLETE";
 }
 if(x.permission!==true||x.dbPermission!==true||x.prior!=="miss"||x.receipts.length!==0||!setMatch(x.prepared,x.expected)||![x.queryAuthority,x.queryExact,x.active].every(v=>v===true))return "STOP";
 const t=[x.attemptEnd,x.watermark,x.queryAt,x.now,x.retention];return t.every(Number.isFinite)&&t.every((v,i)=>i===0||t[i-1]<=v)?"CONDITIONAL_COMMIT_PREPARED":"STOP";
}
function audit(rows,ids){
 if(!Array.isArray(rows)||rows.length!==ids.length||new Set(rows.map(r=>r.input.id)).size!==ids.length||rows.some((r,i)=>r.input.id!==ids[i]))return false;
 return rows.every(({input:x,output:o})=>o.reference===verify(x)&&o.absenceOnly===(x.prepared.length===0?"MODEL_COMPLETE":"CONDITIONAL_COMMIT_PREPARED")&&o.gidOnly===(x.prepared.length===0?"MODEL_COMPLETE":x.dbPermission===true&&x.expected.every(e=>x.prepared.some(p=>p.gid===e.gid))?"CONDITIONAL_COMMIT_PREPARED":"STOP"));
}
function probes(rows,ids){
 const tests=[
 ["omitted",a=>a.pop()],["duplicate-scenario",a=>a[1]=a[0]],["missing-task",a=>delete a[0].input.task],["foreign-run",a=>a[0].input.receipts[0].run="run-28"],["extra-effect",a=>a[0].input.receipts.push({...a[0].input.receipts[0],id:"receipt-C",member:"C"})],["duplicate-receipt",a=>a[0].input.receipts[1]=a[0].input.receipts[0]],["conflicting-negative",a=>a[0].input.prior="miss"],["completion-race",a=>a[0].input.commitRev=8],["foreign-xid",a=>a[2].input.prepared[0].xid="x-999"],["stale-query",a=>a[2].input.watermark=1],["forged-output",a=>a[3].output.reference="MODEL_COMPLETE"],["wrong-weak-output",a=>a[3].output.absenceOnly="STOP"],["global-rollback",a=>a[2].input.decisionKind="ROLLBACK"],["missing-grant",a=>delete a[0].input.receipts[0].from],["extra-member",a=>a[2].input.prepared.push({...a[2].input.prepared[0],member:"C"})],["unknown-retry",a=>a[3].output.reference="CONDITIONAL_COMMIT_PREPARED"]];
 return tests.map(([name,mutate])=>{const a=JSON.parse(JSON.stringify(rows));mutate(a);return {name,rejected:!audit(a,ids)}});
}
const ids=["complete","revoked-after-commit","exact-prepared","absent-unknown","absent-after-rollback","absent-after-commit-unobserved","gid-reused","cluster-epoch-drift","foreign-db","only-one-prepared","duplicate-prepared","extra-prepared","global-rollback-decision","foreign-coordinator-task","incomplete-decision-members","decision-in-future","revoked-task","db-role-denied","prepared-but-prior-unknown","stale-miss","retention-expired","foreign-query","untrusted-query","commit-race","receipt-conflict","duplicate-receipt","extra-receipt","foreign-attempt","late-grant","wrong-actor","commit-before-decision","current-incarnation-drift","completion-race","missing-identity","missing-task","duplicate-expected","missing-fence","stale-current-read","authenticity-not-proved","atomicity-not-proved"];
const data=JSON.parse(require('node:fs').readFileSync(process.argv[2],'utf8'));
const clean=audit(data.rows,ids), tests=probes(data.rows,ids);
console.log(JSON.stringify({clean,tests},null,2));
if(!clean||tests.some(t=>!t.rejected))process.exitCode=1;
