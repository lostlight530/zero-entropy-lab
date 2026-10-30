"use strict";
// 2026-10-31 bounded synthetic Azure Service Bus research, not a live Azure SDK test
function cp(x){return JSON.parse(JSON.stringify(x))}

function fixture(){
 const sc={task:"t31",run:"r31",intent:"i31",target:"tg31",uid:"u31",message:"m31",partition:"p31",session:"p31"};
 const grant={scope:cp(sc),from:10,until:50,subject:"worker31",authority:"approval31"};
 const rec=(member,at,attempt)=>({member,effect:"effect-"+member,attempt,scope:cp(sc),at,grant:cp(grant),authority:"sink31"});
 return {scope:sc,broker:{accepted:true,message:"m31",partition:"p31",session:"p31",scheduled:false,dropped:false,withinWindow:true,lock:"SETTLED",delivery:"d31",settledDelivery:"d31",generation:2,settledGeneration:2,settleAt:60},receipts:[rec("A",20,1),rec("B",25,2)],query:{kind:"HIT",scope:cp(sc),members:["A","B"],attempts:[1,2],at:80,watermark:80,priorAttemptEnd:70,retentionUntil:150,lifecycle:"ACTIVE",complete:true,authority:"sink31"},history:{scope:cp(sc),attempts:[1,2],complete:true,source:"controller31",lastAttemptEnd:70},target:{uid:"u31",members:["A","B"],revision:7,states:{A:"DONE",B:"DONE"}},guard:{scope:cp(sc),protected:true,commitBound:true,uid:"u31",members:["A","B"],revision:7,at:95,commitAt:100},permission:{valid:true,scope:cp(sc),subject:"worker31",at:94},retry:{explicit:true,oldWorkerFenced:true,idempotencyBound:true}};
}

function definitions(){
 const absent=s=>{s.receipts=[];s.query.kind="UNKNOWN";s.target.states={A:"PENDING",B:"PENDING"};s.broker.lock="LOST"};
 const miss=s=>{s.receipts=[];s.query.kind="MISS";s.guard.at=98;s.query.at=96;s.query.watermark=96;s.target.states={A:"PENDING",B:"PENDING"}};
 return [
 ["baseline",s=>{}],
 ["revoked_after_authorized_effect",s=>{s.permission.valid=false}],
 ["scheduled_duplicate_accepted_but_dropped",s=>{absent(s);s.broker.scheduled=true;s.broker.dropped=true}],
 ["dedup_window_expired_new_delivery",s=>{s.broker.withinWindow=false;s.broker.delivery="d32"}],
 ["partition_changed",s=>{s.broker.partition="p32"}],
 ["session_partition_mismatch",s=>{s.broker.session="p32"}],
 ["message_id_reused",s=>{s.broker.message="m32"}],
 ["lock_lost_after_effect",s=>{s.broker.lock="LOST"}],
 ["stale_settle_generation",s=>{s.broker.settledGeneration=1}],
 ["stale_settle_delivery",s=>{s.broker.settledDelivery="d-old"}],
 ["settlement_unknown",s=>{s.broker.lock="UNKNOWN"}],
 ["receipt_missing_B",s=>{s.receipts.pop()}],
 ["receipt_duplicate_A_same_count",s=>{s.receipts[1]=cp(s.receipts[0])}],
 ["receipt_extra_C_same_count",s=>{s.receipts[1].member="C";s.receipts[1].effect="effect-C"}],
 ["receipt_extra_C_third",s=>{let r=cp(s.receipts[1]);r.member="C";r.effect="effect-C";s.receipts.push(r)}],
 ["receipt_wrong_effect",s=>{s.receipts[1].effect="effect-X"}],
 ["receipt_wrong_task",s=>{s.receipts[1].scope.task="other"}],
 ["receipt_wrong_run",s=>{s.receipts[1].scope.run="other"}],
 ["receipt_wrong_incarnation",s=>{s.receipts[1].scope.uid="old"}],
 ["receipt_after_guard",s=>{s.receipts[1].at=96}],
 ["receipt_attempt3_uncovered",s=>{s.receipts[1].attempt=3}],
 ["receipt_untrusted_authority",s=>{s.receipts[1].authority="unknown"}],
 ["historical_grant_expired",s=>{s.receipts[1].grant.until=24}],
 ["historical_grant_wrong_intent",s=>{s.receipts[1].grant.scope.intent="other"}],
 ["historical_grant_missing_authority",s=>{s.receipts[1].grant.authority=null}],
 ["positive_receipt_vs_covered_miss",s=>{s.query.kind="MISS";s.guard.at=98;s.query.at=96;s.query.watermark=96}],
 ["query_wrong_partition",s=>{s.query.scope.partition="other"}],
 ["query_missing_attempt2",s=>{s.query.attempts=[1]}],
 ["query_stale_watermark",s=>{s.query.watermark=10}],
 ["query_future_watermark",s=>{s.query.watermark=95}],
 ["query_prior_end_missing",s=>{delete s.query.priorAttemptEnd}],
 ["attempt3_history_uncovered",s=>{s.history.attempts.push(3)}],
 ["attempt_history_incomplete",s=>{s.history.complete=false}],
 ["attempt_history_wrong_scope",s=>{s.history.scope.task="other"}],
 ["attempt_history_end_uncovered",s=>{s.history.lastAttemptEnd=91}],
 ["query_retention_expired",s=>{s.query.retentionUntil=99}],
 ["query_after_guard",s=>{s.query.at=99}],
 ["query_history_pruned",s=>{s.query.lifecycle="PRUNED"}],
 ["query_member_missing",s=>{s.query.members=["A"]}],
 ["query_unknown",s=>{s.query.kind="UNKNOWN"}],
 ["member_replacement_same_count",s=>{s.target.members=["A","C"];s.target.states={A:"DONE",C:"DONE"}}],
 ["target_uid_recreated",s=>{s.target.uid="u32"}],
 ["guard_revision_stale",s=>{s.guard.revision=6}],
 ["guard_not_protected",s=>{s.guard.protected=false}],
 ["guard_compare_not_bound_to_commit",s=>{s.guard.commitBound=false}],
 ["guard_wrong_intent",s=>{s.guard.scope.intent="other"}],
 ["current_state_B_pending",s=>{s.target.states.B="PENDING"}],
 ["broker_settle_time_string",s=>{s.broker.settleAt="60"}],
 ["guard_time_string",s=>{s.guard.at="95"}],
 ["guard_commit_time_string",s=>{s.guard.commitAt="100"}],
 ["revision_numeric_string",s=>{s.target.revision="7";s.guard.revision="7"}],
 ["retry_permission_time_string",s=>{miss(s);s.permission.at="94"}],
 ["covered_miss_safe_retry",s=>{miss(s)}],
 ["covered_miss_permission_revoked",s=>{miss(s);s.permission.valid=false}],
 ["covered_miss_permission_wrong_run",s=>{miss(s);s.permission.scope.run="other"}],
 ["covered_miss_no_old_worker_fence",s=>{miss(s);s.retry.oldWorkerFenced=false}],
 ["covered_miss_no_idempotency",s=>{miss(s);s.retry.idempotencyBound=false}],
 ["covered_miss_no_explicit_retry",s=>{miss(s);s.retry.explicit=false}],
 ["covered_miss_watermark_short",s=>{miss(s);s.query.watermark=50}],
 ["covered_miss_wrong_query_scope",s=>{miss(s);s.query.scope.message="other"}],
 ["covered_miss_positive_conflict",s=>{miss(s);s.receipts=[cp(fixture().receipts[0])]}],
 ["scheduled_duplicate_historical_effect_proven",s=>{s.broker.scheduled=true;s.broker.dropped=true}],
 ["expired_dedup_window_historical_effect_proven",s=>{s.broker.withinWindow=false}]
 ];
}

function scopeEq(a,b){return !!a&&!!b&&["task","run","intent","target","uid","message","partition","session"].every(k=>typeof a[k]==="string"&&a[k]===b[k])}

function setEq(a,b){return Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&new Set(a).size===a.length&&new Set(b).size===b.length&&a.every(x=>b.includes(x))}

function reference(s){
 const U="STOP_UNKNOWN",R="RECONCILE",B="BLOCKED",q=s.query,b=s.broker,g=s.guard,t=s.target,sc=s.scope;
 if(![b.settleAt,g.at,g.commitAt,t.revision,g.revision,s.permission.at].every(Number.isInteger))return U;
 if(b.accepted!==true||b.message!==sc.message||b.partition!==sc.partition||b.session!==sc.session)return R;
 if(b.lock==="UNKNOWN")return U;
 if(b.lock!=="SETTLED"||b.delivery!==b.settledDelivery||!Number.isInteger(b.generation)||b.generation!==b.settledGeneration||!(b.settleAt<g.at))return R;
 if(!scopeEq(q.scope,sc)||q.authority!=="sink31"||q.complete!==true||q.lifecycle!=="ACTIVE"||![q.at,q.watermark,q.retentionUntil,q.priorAttemptEnd].every(Number.isInteger)||q.at>=g.at||q.watermark>q.at||q.priorAttemptEnd>q.at||q.retentionUntil<g.commitAt||!setEq(q.attempts,[1,2])||!setEq(q.members,["A","B"]))return U;
 if(!s.history||!scopeEq(s.history.scope,sc)||s.history.complete!==true||s.history.source!=="controller31"||!setEq(s.history.attempts,q.attempts)||!Number.isInteger(s.history.lastAttemptEnd)||q.priorAttemptEnd!==s.history.lastAttemptEnd||q.watermark<s.history.lastAttemptEnd||q.at<=s.history.lastAttemptEnd)return U;
 if(!scopeEq(g.scope,sc)||g.protected!==true||g.commitBound!==true||g.uid!==sc.uid||g.revision!==t.revision||!setEq(g.members,t.members)||!setEq(t.members,["A","B"])||t.uid!==sc.uid||!(g.at<g.commitAt))return R;
 if(q.kind==="MISS"){
  if(q.watermark<q.priorAttemptEnd)return U;
  if(s.receipts.length)return "EVIDENCE_CONFLICT";
  if(Object.values(t.states).includes("DONE"))return R;
  if(s.permission.valid!==true||!scopeEq(s.permission.scope,sc)||s.permission.subject!=="worker31"||!(s.permission.at<=g.at&&s.permission.at<g.commitAt))return B;
  if(s.retry.explicit!==true||s.retry.oldWorkerFenced!==true||s.retry.idempotencyBound!==true)return U;
  return "RETRY_ALLOWED";
 }
 if(q.kind!=="HIT"||s.receipts.length===0)return U;
 if(q.watermark<Math.max(...s.receipts.map(x=>x.at)))return U;
 if(!setEq(s.receipts.map(x=>x.member),["A","B"]))return R;
 for(const x of s.receipts){
  if(!scopeEq(x.scope,sc)||x.effect!=="effect-"+x.member||x.authority!=="sink31"||!Number.isInteger(x.at)||!Number.isInteger(x.attempt)||!q.attempts.includes(x.attempt)||x.at>=q.at||x.at>=g.at)return R;
  if(!x.grant||!scopeEq(x.grant.scope,sc)||x.grant.authority!=="approval31"||x.grant.subject!=="worker31"||!Number.isInteger(x.grant.from)||!Number.isInteger(x.grant.until)||x.grant.from>x.at||x.grant.until<x.at)return B;
 }
 if(t.states.A!=="DONE"||t.states.B!=="DONE")return R;
 return "COMPLETE";
}

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

function produce(){
 const rows=[],scenarios=[],hist={},attacks=[];
 for(const [id,mutate] of definitions()){
  if(scenarios.some(x=>x.id===id))throw Error("duplicate ID "+id);
  const state=fixture();mutate(state);
  const row={id,send_proxy:state.broker.accepted?"COMPLETE":"RECONCILE",settlement_proxy:state.broker.lock==="SETTLED"?"COMPLETE":"RECONCILE",full_reference:reference(state)};
  const independent=verifier(state);if(independent!==row.full_reference)throw Error("VERIFIER_DISAGREEMENT "+id+" "+row.full_reference+" "+independent);
  scenarios.push({id,state});rows.push(row);hist[row.full_reference]=(hist[row.full_reference]||0)+1;
 }
 for(const [name,patch] of [
  ["duplicate_receipt",s=>{s.receipts[1]=cp(s.receipts[0])}],
  ["extra_member",s=>{let x=cp(s.receipts[0]);x.member="C";x.effect="effect-C";s.receipts.push(x)}],
  ["wrong_run",s=>{s.receipts[0].scope.run="bad"}],
  ["future_query",s=>{s.query.at=99}],
  ["future_watermark",s=>{s.query.watermark=95}],
  ["missing_prior_end",s=>{delete s.query.priorAttemptEnd}],
  ["unseen_attempt3",s=>{s.history.attempts.push(3)}],
  ["wrong_history_scope",s=>{s.history.scope.task="other"}],
  ["missing_commit_fence",s=>{s.guard.commitBound=false}],
  ["missing_grant",s=>{s.receipts[0].grant.authority=null}],
  ["uncovered_attempt",s=>{s.receipts[0].attempt=3}],
  ["covered_miss_conflict",s=>{s.query.kind="MISS";s.guard.at=98;s.query.at=96;s.query.watermark=96}],
  ["partition_mismatch",s=>{s.broker.partition="other"}],
  ["settlement_epoch",s=>{s.broker.settledGeneration=1}],
  ["broker_settle_string",s=>{s.broker.settleAt="60"}],
  ["guard_time_string",s=>{s.guard.at="95"}],
  ["guard_commit_string",s=>{s.guard.commitAt="100"}],
  ["revision_string",s=>{s.target.revision="7";s.guard.revision="7"}],
  ["retry_permission_string",s=>{s.receipts=[];s.query.kind="MISS";s.guard.at=98;s.query.at=96;s.query.watermark=96;s.target.states={A:"PENDING",B:"PENDING"};s.permission.at="94"}]
 ]){let s=fixture();patch(s);const a=reference(s),b=verifier(s);if(a!==b||a==="COMPLETE"||a==="RETRY_ALLOWED")throw Error("ADVERSARIAL_UNSAFE "+name+" "+a+" "+b);attacks.push({name,decision:a})}
 const checkRows=(states,decisions)=>{if(states.length!==decisions.length)throw Error("count");const ids=new Set();for(let i=0;i<states.length;i++){let {id,state}=states[i],row=decisions[i];if(ids.has(id)||id!==row.id)throw Error("duplicate/mismatch");ids.add(id);if(row.full_reference!==verifier(state)||row.send_proxy!==(state.broker.accepted?"COMPLETE":"RECONCILE")||row.settlement_proxy!==(state.broker.lock==="SETTLED"?"COMPLETE":"RECONCILE"))throw Error("forged decision")}};
 checkRows(scenarios,rows);
 let rejects=0;const forged=cp(rows);forged[0].full_reference="STOP_UNKNOWN";
 for(const [states,decisions] of [[scenarios,forged],[[...scenarios,scenarios[0]],[...rows,rows[0]]],[scenarios,rows.slice(1)]])try{checkRows(states,decisions)}catch(e){rejects++}
 if(rejects!==3)throw Error("FORGERY_NOT_REJECTED");
 if(rows.find(x=>x.id==="covered_miss_safe_retry")?.full_reference!=="RETRY_ALLOWED"||rows.find(x=>x.id==="positive_receipt_vs_covered_miss")?.full_reference!=="EVIDENCE_CONFLICT"||rows.find(x=>x.id==="revoked_after_authorized_effect")?.full_reference!=="COMPLETE")throw Error("INVARIANT_FAILED");
 return {scenarios,rows,hist,attacks,rejects};
}

if(typeof require!=="undefined"&&require.main===module){const fs=require("node:fs"),out=produce(),dir=process.argv[2]||".";fs.writeFileSync(dir+"/2026-10-31-servicebus-scenarios.json",JSON.stringify({schema:"ballast.servicebus.scenarios.2026-10-31",scenarios:out.scenarios},null,2)+"\n");fs.writeFileSync(dir+"/2026-10-31-servicebus-decisions.json",JSON.stringify({schema:"ballast.servicebus.decisions.2026-10-31",decisions:out.rows},null,2)+"\n");console.log(JSON.stringify({scenarios:out.scenarios.length,decisionRows:out.rows.length*3,reference:out.hist,attacks:out.attacks.length,forgeriesRejected:out.rejects}))}
