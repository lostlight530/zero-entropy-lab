"use strict";
function review(rows){
 const ids="complete revoked-after-commit exact-prepared absent-unknown absent-after-rollback absent-after-commit-unobserved gid-reused cluster-epoch-drift foreign-db only-one-prepared duplicate-prepared extra-prepared global-rollback-decision foreign-coordinator-task incomplete-decision-members decision-in-future revoked-task db-role-denied prepared-but-prior-unknown stale-miss retention-expired foreign-query untrusted-query commit-race receipt-conflict duplicate-receipt extra-receipt foreign-attempt late-grant wrong-actor commit-before-decision current-incarnation-drift completion-race missing-identity missing-task duplicate-expected missing-fence stale-current-read authenticity-not-proved atomicity-not-proved".split(" ");
 const fixed=[["A","db-A","g-A","x-101","epoch-3","effect-A"],["B","db-B","g-B","x-102","epoch-3","effect-B"]];
 const fields=["member","db","gid","xid","epoch","effect"];
 const tuple=e=>fields.map(k=>e?.[k]);
 const exact=a=>Array.isArray(a)&&a.length===2&&fixed.every(t=>a.filter(e=>tuple(e).every((v,i)=>v===t[i])).length===1);
 const time=t=>t.every(Number.isFinite)&&t.every((v,i)=>i===0||t[i-1]<=v);
 const decide=x=>{
  if(!x||!["prepared","receipts","current","expected","decisionMembers"].every(k=>Array.isArray(x[k])))return "STOP";
  if(x.task!=="task-27"||x.run!=="run-27"||x.attempt!=="attempt-1"||x.decision!=="decision-9"||!exact(x.expected)||!exact(x.decisionMembers)||x.decisionTask!==x.task||x.decisionRun!==x.run||x.decisionAttempt!==x.attempt||x.decisionKind!=="COMMIT"||!time([x.decisionAt,x.now])||x.protected!==true||!Number.isInteger(x.readRev)||x.readRev<=0||x.readRev!==x.commitRev)return "STOP";
  if(x.prior==="hit"&&x.prepared.length===0&&exact(x.receipts)&&exact(x.current)){
   const rec=x.receipts;
   if(new Set(rec.map(e=>e.id)).size===2&&rec.every(e=>typeof e.id==="string"&&e.id.length>0&&e.task===x.task&&e.run===x.run&&e.attempt===x.attempt&&e.decision===x.decision&&e.outcome==="COMMIT"&&typeof e.actor==="string"&&e.actor.length>0&&e.actor===e.grantActor&&time([e.from,e.at,e.until])&&time([x.decisionAt,e.at,x.attemptEnd,x.observedAt,x.now])))return "MODEL_COMPLETE";
  }
  if(x.prior==="miss"&&x.receipts.length===0&&exact(x.prepared)&&x.permission===true&&x.dbPermission===true&&[x.queryAuthority,x.queryExact,x.active].every(z=>z===true)&&time([x.attemptEnd,x.watermark,x.queryAt,x.now,x.retention]))return "CONDITIONAL_COMMIT_PREPARED";
  return "STOP";
 };
 const expectedRows=Array.isArray(rows)&&rows.length===ids.length&&rows.every((r,i)=>r.input?.id===ids[i])&&new Set(rows.map(r=>r.input.id)).size===ids.length;
 const recon=rows.map(({input:x,output:o})=>({id:x.id,reference:decide(x),match:decide(x)===o.reference,weakMatch:o.absenceOnly===(x.prepared.length===0?"MODEL_COMPLETE":"CONDITIONAL_COMMIT_PREPARED")&&o.gidOnly===(x.prepared.length===0?"MODEL_COMPLETE":x.dbPermission===true&&x.expected.every(e=>x.prepared.some(p=>p.gid===e.gid))?"CONDITIONAL_COMMIT_PREPARED":"STOP")}));
 const tests=[
 ["coherent-foreign-task",0,x=>{x.task=x.decisionTask="task-foreign";x.receipts.forEach(e=>e.task=x.task)}],
 ["coherent-foreign-effect",0,x=>{for(const list of [x.expected,x.decisionMembers,x.receipts,x.current])list[0].effect="effect-foreign"}],
 ["coherent-foreign-prepared-incarnation",2,x=>{for(const list of [x.expected,x.decisionMembers,x.prepared])list[0].xid="x-foreign"}],
 ["null-receipts",0,x=>x.receipts=null],["null-prepared",2,x=>x.prepared=null],["missing-decision-members",2,x=>delete x.decisionMembers],
 ["receipt-id-collision",0,x=>x.receipts[1].id=x.receipts[0].id],["current-extra",0,x=>x.current.push({...x.current[0],member:"C"})],
 ["future-query",2,x=>x.queryAt=90],["query-watermark-after-query",2,x=>x.watermark=59],["null-authority",2,x=>x.queryAuthority=null],["old-grant",0,x=>x.receipts[0].until=29]
 ];
 const probes=tests.map(([name,i,mutate])=>{const x=JSON.parse(JSON.stringify(rows[i].input));mutate(x);return {name,input:x,reviewDecision:decide(x),rejected:decide(x)==="STOP"}});
 return {expectedRows,recon,probes,agreements:recon.filter(x=>x.match&&x.weakMatch).length,probeRejections:probes.filter(x=>x.rejected).length};
}
const data=JSON.parse(require('node:fs').readFileSync(process.argv[2],'utf8'));
const result=review(data.rows);
console.log(JSON.stringify(result,null,2));
if(!result.expectedRows||result.agreements!==data.rows.length||result.probeRejections!==result.probes.length)process.exitCode=1;
