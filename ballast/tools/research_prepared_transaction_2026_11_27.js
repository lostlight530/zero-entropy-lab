"use strict";
function fixtures(){
 const expected=[{member:"A",db:"db-A",gid:"g-A",xid:"x-101",epoch:"epoch-3",effect:"effect-A"},{member:"B",db:"db-B",gid:"g-B",xid:"x-102",epoch:"epoch-3",effect:"effect-B"}];
 const receipt=expected.map((e,i)=>({...e,id:"receipt-"+e.member,task:"task-27",run:"run-27",attempt:"attempt-1",decision:"decision-9",actor:"owner-A",grantActor:"owner-A",at:30+i,from:10,until:40,outcome:"COMMIT"}));
 const done={task:"task-27",run:"run-27",attempt:"attempt-1",decision:"decision-9",expected,prepared:[],receipts:receipt,prior:"hit",permission:true,dbPermission:true,decisionKind:"COMMIT",decisionTask:"task-27",decisionRun:"run-27",decisionAttempt:"attempt-1",decisionMembers:expected,decisionAt:20,queryAuthority:true,queryExact:true,watermark:45,attemptEnd:40,queryAt:50,now:60,retention:80,active:true,readRev:7,commitRev:7,protected:true,current:expected,observedAt:55};
 const pending={...done,prepared:expected,receipts:[],prior:"miss",current:[]};
 const gone={...pending,prepared:[],prior:"unknown"};
 const copy=x=>JSON.parse(JSON.stringify(x));
 const add=(id,x,fn=()=>{})=>{const y=copy(x);fn(y);return {id,...y}};
 return [
 add("complete",done),add("revoked-after-commit",done,x=>x.permission=false),
 add("exact-prepared",pending),add("absent-unknown",gone),add("absent-after-rollback",gone,x=>{x.receipts=[{...receipt[0],outcome:"ROLLBACK"},{...receipt[1],outcome:"ROLLBACK"}];x.prior="hit"}),
 add("absent-after-commit-unobserved",gone),add("gid-reused",pending,x=>x.prepared[0].xid="x-201"),add("cluster-epoch-drift",pending,x=>x.prepared[0].epoch="epoch-4"),
 add("foreign-db",pending,x=>x.prepared[0].db="db-C"),add("only-one-prepared",pending,x=>x.prepared.pop()),add("duplicate-prepared",pending,x=>x.prepared[1]=copy(x.prepared[0])),
 add("extra-prepared",pending,x=>x.prepared.push({...x.prepared[0],member:"C",gid:"g-C",effect:"effect-C"})),
 add("global-rollback-decision",pending,x=>x.decisionKind="ROLLBACK"),add("foreign-coordinator-task",pending,x=>x.decisionTask="task-28"),
 add("incomplete-decision-members",pending,x=>x.decisionMembers.pop()),add("decision-in-future",pending,x=>x.decisionAt=70),
 add("revoked-task",pending,x=>x.permission=false),add("db-role-denied",pending,x=>x.dbPermission=false),
 add("prepared-but-prior-unknown",pending,x=>x.prior="unknown"),add("stale-miss",pending,x=>x.watermark=20),
 add("retention-expired",pending,x=>x.retention=55),add("foreign-query",pending,x=>x.queryExact=false),add("untrusted-query",pending,x=>x.queryAuthority=false),
 add("commit-race",pending,x=>x.commitRev=8),add("receipt-conflict",done,x=>x.prior="miss"),
 add("duplicate-receipt",done,x=>x.receipts[1]=copy(x.receipts[0])),add("extra-receipt",done,x=>x.receipts.push({...x.receipts[0],id:"receipt-C",member:"C",effect:"effect-C"})),
 add("foreign-attempt",done,x=>x.receipts[0].attempt="attempt-2"),add("late-grant",done,x=>x.receipts[0].from=35),
 add("wrong-actor",done,x=>x.receipts[0].grantActor="owner-B"),add("commit-before-decision",done,x=>x.receipts[0].at=15),
 add("current-incarnation-drift",done,x=>x.current[0].epoch="epoch-4"),add("completion-race",done,x=>x.commitRev=8),
 add("missing-identity",done,x=>delete x.receipts[0].id),add("missing-task",done,x=>delete x.task),add("duplicate-expected",done,x=>x.expected[1]=copy(x.expected[0])),
 add("missing-fence",done,x=>delete x.protected),add("stale-current-read",done,x=>x.observedAt=25),
 add("authenticity-not-proved",done),add("atomicity-not-proved",done)
 ];
}
function produce(x){
 const fields=["member","db","gid","xid","epoch","effect"], nonempty=s=>typeof s==="string"&&s.length>0;
 const key=e=>JSON.stringify(fields.map(k=>e[k]));
 function exact(a,b){return Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&a.every(e=>e&&fields.every(k=>nonempty(e[k])))&&new Set(a.map(key)).size===a.length&&new Set(a.map(e=>e.member)).size===a.length&&a.every(e=>b.some(f=>key(e)===key(f)))}
 const identity=["task","run","attempt","decision"].every(k=>nonempty(x[k]))&&x.expected.length===2&&exact(x.expected,x.expected);
 const decision=identity&&x.decisionKind==="COMMIT"&&x.decisionTask===x.task&&x.decisionRun===x.run&&x.decisionAttempt===x.attempt&&exact(x.decisionMembers,x.expected)&&Number.isFinite(x.decisionAt)&&x.decisionAt<=x.now;
 const fence=x.protected===true&&Number.isInteger(x.readRev)&&x.readRev>0&&x.readRev===x.commitRev;
 const miss=x.prior==="miss"&&x.receipts.length===0&&x.queryAuthority===true&&x.queryExact===true&&x.active===true&&[x.attemptEnd,x.watermark,x.queryAt,x.now,x.retention].every(Number.isFinite)&&x.attemptEnd<=x.watermark&&x.watermark<=x.queryAt&&x.queryAt<=x.now&&x.now<=x.retention;
 const hit=x.prior==="hit"&&exact(x.receipts,x.expected)&&x.receipts.every(e=>nonempty(e.id)&&e.task===x.task&&e.run===x.run&&e.attempt===x.attempt&&e.decision===x.decision&&e.outcome==="COMMIT"&&nonempty(e.actor)&&e.actor===e.grantActor&&[e.from,e.at,e.until,x.attemptEnd,x.now,x.observedAt].every(Number.isFinite)&&e.from<=e.at&&e.at<=e.until&&x.decisionAt<=e.at&&e.at<=x.attemptEnd&&x.attemptEnd<=x.observedAt&&x.observedAt<=x.now)&&new Set(x.receipts.map(e=>e.id)).size===x.receipts.length;
 let reference="STOP";
 if(decision&&fence){
 if(hit&&x.prepared.length===0&&exact(x.current,x.expected))reference="MODEL_COMPLETE";
 else if(miss&&x.permission===true&&x.dbPermission===true&&exact(x.prepared,x.expected))reference="CONDITIONAL_COMMIT_PREPARED";
 }
 return {absenceOnly:x.prepared.length===0?"MODEL_COMPLETE":"CONDITIONAL_COMMIT_PREPARED",gidOnly:x.prepared.length===0?"MODEL_COMPLETE":x.expected.every(e=>x.prepared.some(p=>p.gid===e.gid))&&x.dbPermission===true?"CONDITIONAL_COMMIT_PREPARED":"STOP",reference};
}
console.log(JSON.stringify(fixtures().map(input=>({input,output:produce(input)})),null,2));
