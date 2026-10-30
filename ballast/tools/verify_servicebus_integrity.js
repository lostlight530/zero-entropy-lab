"use strict";
// 2026-10-31 bounded synthetic Azure Service Bus research, not a live Azure SDK test
function verifier(s){
 const U="STOP_UNKNOWN",R="RECONCILE",B="BLOCKED",fields=["task","run","intent","target","uid","message","partition","session"];
 const identity=(x,y)=>!!x&&!!y&&fields.filter(k=>typeof x[k]==="string"&&x[k]===y[k]).length===fields.length;
 const set=(a,b)=>Array.isArray(a)&&a.length===b.length&&new Set(a).size===a.length&&b.every(x=>a.indexOf(x)!==-1);
 const {scope,broker,query,target,guard,permission,retry,receipts}=s;
 if(![broker.settleAt,guard.at,guard.commitAt,target.revision,guard.revision,permission.at].every(Number.isInteger))return U;
 if(!broker.accepted||[broker.message,broker.partition,broker.session].join("/")!==[scope.message,scope.partition,scope.session].join("/"))return R;
 if(broker.lock==="UNKNOWN")return U;
 if(broker.lock!=="SETTLED"||broker.delivery!==broker.settledDelivery||!Number.isInteger(broker.generation)||broker.generation!==broker.settledGeneration||!(broker.settleAt<guard.at))return R;
 if(!identity(query.scope,scope)||query.authority!=="sink31"||query.complete!==true||query.lifecycle!=="ACTIVE"||![query.at,query.watermark,query.retentionUntil,query.priorAttemptEnd].every(Number.isInteger)||query.at>=guard.at||query.watermark>query.at||query.priorAttemptEnd>query.at||query.retentionUntil<guard.commitAt||!set(query.attempts,[1,2])||!set(query.members,["A","B"]))return U;
 if(!s.history||!identity(s.history.scope,scope)||s.history.complete!==true||s.history.source!=="controller31"||!set(s.history.attempts,query.attempts)||!Number.isInteger(s.history.lastAttemptEnd)||query.priorAttemptEnd!==s.history.lastAttemptEnd||query.watermark<s.history.lastAttemptEnd||query.at<=s.history.lastAttemptEnd)return U;
 if(!identity(guard.scope,scope)||guard.protected!==true||guard.commitBound!==true||guard.uid!==scope.uid||guard.revision!==target.revision||!set(guard.members,target.members)||!set(target.members,["A","B"])||target.uid!==scope.uid||!(guard.at<guard.commitAt))return R;
 if(query.kind==="MISS"){
  if(query.watermark<query.priorAttemptEnd)return U;
  if(receipts.length)return "EVIDENCE_CONFLICT";
  if(Object.values(target.states).includes("DONE"))return R;
  if(permission.valid!==true||!identity(permission.scope,scope)||permission.subject!=="worker31"||!(permission.at<=guard.at&&permission.at<guard.commitAt))return B;
  if([retry.explicit,retry.oldWorkerFenced,retry.idempotencyBound].some(v=>v!==true))return U;
  return "RETRY_ALLOWED";
 }
 if(query.kind!=="HIT"||!receipts.length)return U;
 if(query.watermark<receipts.reduce((m,x)=>Math.max(m,x.at),-Infinity))return U;
 if(!set(receipts.map(x=>x.member),["A","B"]))return R;
 const by=new Map(receipts.map(x=>[x.member,x]));
 for(const member of ["A","B"]){
  const x=by.get(member);
  if(!x||!identity(x.scope,scope)||x.effect!==`effect-${member}`||x.authority!=="sink31"||!Number.isInteger(x.at)||!Number.isInteger(x.attempt)||!query.attempts.includes(x.attempt)||x.at>=query.at||x.at>=guard.at)return R;
  const a=x.grant;
  if(!a||!identity(a.scope,scope)||a.authority!=="approval31"||a.subject!=="worker31"||![a.from,a.until].every(Number.isInteger)||x.at<a.from||x.at>a.until)return B;
 }
 if(["A","B"].some(x=>target.states[x]!=="DONE"))return R;
 return "COMPLETE";
}

function verifyPersisted(pack,decisions){if(!pack||!decisions||!Array.isArray(pack.scenarios)||!Array.isArray(decisions.decisions)||pack.scenarios.length!==decisions.decisions.length)throw Error("count");const seen=new Set();for(let i=0;i<pack.scenarios.length;i++){const item=pack.scenarios[i],row=decisions.decisions[i];if(seen.has(item.id)||row.id!==item.id)throw Error("identity");seen.add(item.id);if(row.full_reference!==verifier(item.state)||row.send_proxy!==(item.state.broker.accepted?"COMPLETE":"RECONCILE")||row.settlement_proxy!==(item.state.broker.lock==="SETTLED"?"COMPLETE":"RECONCILE"))throw Error("forged row "+item.id)}return {scenarios:seen.size,decisionRows:seen.size*3,implementation:"PARTIAL",dataSource:"NONE",semanticContract:"SHARED",authority:"NONE"}}
if(typeof require!=="undefined"&&require.main===module){const fs=require("node:fs"),args=process.argv.slice(2);if(args.length!==2)throw Error("usage: node verify_servicebus_integrity.js scenarios.json decisions.json");console.log(JSON.stringify(verifyPersisted(JSON.parse(fs.readFileSync(args[0],"utf8")),JSON.parse(fs.readFileSync(args[1],"utf8")))))}
