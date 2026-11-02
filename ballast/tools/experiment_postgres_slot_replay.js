// Ballast 2026-11-03 | bounded synthetic PostgreSQL slot/LSN replay model
// Runtime execution: V8 isolate; Node CLI and PostgreSQL not executed
function makeScenarios(){
 const base={task:"task-cdc-03",run:"run-cdc-03",slot:"orders_slot",slotEpoch:"slot-generation-7",xid:"tx-81",lsn:120,uid:"target-uid-7",revision:9,required:["A","B"],attempts:[1,2],delivered:1,checkpoint:120,transaction:{present:true,slotEpoch:"slot-generation-7",xid:"tx-81",lsn:120},receipts:[{member:"A",task:"task-cdc-03",run:"run-cdc-03",attempt:2,slotEpoch:"slot-generation-7",xid:"tx-81",lsn:120,uid:"target-uid-7",at:20,state:"DONE"},{member:"B",task:"task-cdc-03",run:"run-cdc-03",attempt:2,slotEpoch:"slot-generation-7",xid:"tx-81",lsn:120,uid:"target-uid-7",at:21,state:"DONE"}],grant:{authority:"approval-ledger",from:10,to:30,slotEpoch:"slot-generation-7"},query:{authority:"sink-journal",exact:true,slotEpoch:"slot-generation-7",xid:"tx-81",lsn:120,task:"task-cdc-03",run:"run-cdc-03",attempts:[1,2],watermark:50,lastEnd:30,queryAt:60,retentionUntil:200,lifecycle:"ACTIVE",positive:true,miss:false},members:{uid:"target-uid-7",revision:9,ids:["A","B"],states:{A:"DONE",B:"DONE"}},guard:{uid:"target-uid-7",revision:9,ids:["A","B"],commitBound:true,commitAt:70},permission:{allowed:true,approval:true,credential:true,epoch:"perm-7"},dedup:{authority:"sink-journal",exact:true,ids:["A","B"],retentionUntil:200}};
 const specs=[
 ["baseline",s=>{}],
 ["checkpoint_without_sink",s=>{s.receipts=[];s.query.positive=false}],
 ["crash_after_A_before_B",s=>{s.receipts=s.receipts.slice(0,1)}],
 ["replayed_delivery_twice",s=>{s.delivered=2}],
 ["duplicate_sink_A",s=>{s.receipts.push({...s.receipts[0]})}],
 ["same_slot_name_new_epoch",s=>{s.transaction.slotEpoch="slot-generation-8"}],
 ["same_lsn_different_xid",s=>{s.transaction.xid="tx-82"}],
 ["receipt_wrong_xid",s=>{s.receipts[1].xid="tx-82"}],
 ["receipt_wrong_slot_epoch",s=>{s.receipts[1].slotEpoch="slot-generation-8"}],
 ["receipt_wrong_target_uid",s=>{s.receipts[1].uid="target-uid-8"}],
 ["extra_effect_C",s=>{s.receipts.push({...s.receipts[1],member:"C"})}],
 ["same_count_A_C",s=>{s.receipts[1].member="C";s.members.ids=["A","C"];s.members.states={A:"DONE",C:"DONE"}}],
 ["positive_receipt_and_miss",s=>{s.query.miss=true}],
 ["query_future_watermark",s=>{s.query.watermark=80}],
 ["query_scope_wrong_run",s=>{s.query.run="run-other"}],
 ["query_wrong_authority",s=>{s.query.authority="cache"}],
 ["query_retention_expired",s=>{s.query.retentionUntil=40}],
 ["query_lifecycle_unknown",s=>{s.query.lifecycle="UNKNOWN"}],
 ["attempt_three_uncovered",s=>{s.attempts=[1,2,3]}],
 ["query_attempt_two_only",s=>{s.query.attempts=[2]}],
 ["permission_revoked_historical_complete",s=>{s.permission.allowed=false}],
 ["historical_grant_expired",s=>{s.grant.to=19}],
 ["grant_wrong_epoch",s=>{s.grant.slotEpoch="slot-generation-8"}],
 ["member_revision_drift",s=>{s.members.revision=10}],
 ["guard_revision_drift",s=>{s.guard.revision=10}],
 ["guard_not_commit_bound",s=>{s.guard.commitBound=false}],
 ["guard_uid_replaced",s=>{s.guard.uid="target-uid-8"}],
 ["member_state_not_done",s=>{s.members.states.B="PENDING"}],
 ["checkpoint_only_no_transaction",s=>{s.transaction.present=false}],
 ["unknown_no_receipt",s=>{s.receipts=[];s.query.positive=false;s.query.miss=false}],
 ["covered_miss_safe_retry",s=>{s.receipts=[];s.query.positive=false;s.query.miss=true}],
 ["covered_miss_permission_revoked",s=>{s.receipts=[];s.query.positive=false;s.query.miss=true;s.permission.allowed=false}],
 ["covered_miss_dedup_expired",s=>{s.receipts=[];s.query.positive=false;s.query.miss=true;s.dedup.retentionUntil=40}],
 ["covered_miss_no_attempt_coverage",s=>{s.receipts=[];s.query.positive=false;s.query.miss=true;s.query.attempts=[2]}],
 ["receipt_time_future_of_query",s=>{s.receipts[1].at=61}],
 ["guard_commit_before_receipt",s=>{s.guard.commitAt=20}],
 ["numeric_string_revision",s=>{s.guard.revision="9"}],
 ["numeric_string_watermark",s=>{s.query.watermark="50"}],
 ["extra_member_only_in_guard",s=>{s.guard.ids=["A","B","C"]}],
 ["checkpoint_behind_lsn",s=>{s.checkpoint=110}]
 ];
 return specs.map(([id,mutate])=>{const state=JSON.parse(JSON.stringify(base));mutate(state);return {id,state,intervention:id==="baseline"?"none":id}});
}
function produce(scenarios){
 function same(a,b){return JSON.stringify(a)===JSON.stringify(b)}
 function validNumber(x){return Number.isSafeInteger(x)&&x>=0}
 function eqSet(a,b){return Array.isArray(a)&&a.length===b.length&&new Set(a).size===a.length&&b.every(v=>a.includes(v))}
 function ref(s){
  const r=s.receipts,q=s.query,tx=s.transaction;
  if(r.length&&q.miss)return "EVIDENCE_CONFLICT";
  if(!tx.present||tx.slotEpoch!==s.slotEpoch||tx.xid!==s.xid||tx.lsn!==s.lsn)return "RECONCILE";
  const exactQ=q.authority==="sink-journal"&&q.exact===true&&q.slotEpoch===s.slotEpoch&&q.xid===s.xid&&q.lsn===s.lsn&&q.task===s.task&&q.run===s.run&&same(q.attempts,s.attempts)&&new Set(q.attempts).size===q.attempts.length&&q.lifecycle==="ACTIVE"&&[q.watermark,q.lastEnd,q.queryAt,q.retentionUntil].every(validNumber)&&q.watermark>=q.lastEnd&&q.watermark<=q.queryAt&&q.retentionUntil>=q.queryAt;
  if(!exactQ)return "STOP_UNKNOWN";
  if(!r.length){
   if(!q.miss)return "STOP_UNKNOWN";
   if(!s.permission.allowed||!s.permission.approval||!s.permission.credential)return "BLOCKED";
   const d=s.dedup;
   return d.authority==="sink-journal"&&d.exact===true&&eqSet(d.ids,s.required)&&validNumber(d.retentionUntil)&&d.retentionUntil>=q.queryAt?"RETRY_ALLOWED":"STOP_UNKNOWN";
  }
  if(!q.positive)return "STOP_UNKNOWN";
  if(!eqSet(r.map(x=>x.member),s.required))return "RECONCILE";
  if(r.some(x=>x.task!==s.task||x.run!==s.run||!s.attempts.includes(x.attempt)||x.slotEpoch!==s.slotEpoch||x.xid!==s.xid||x.lsn!==s.lsn||x.uid!==s.uid||x.state!=="DONE"||!validNumber(x.at)||x.at>q.watermark||x.at>q.queryAt))return "RECONCILE";
  if(s.grant.authority!=="approval-ledger"||s.grant.slotEpoch!==s.slotEpoch||![s.grant.from,s.grant.to].every(validNumber)||r.some(x=>x.at<s.grant.from||x.at>s.grant.to))return "BLOCKED";
  if(s.members.uid!==s.uid||s.members.revision!==s.revision||!eqSet(s.members.ids,s.required)||s.required.some(x=>s.members.states[x]!=="DONE"))return "RECONCILE";
  if(s.guard.uid!==s.uid||s.guard.revision!==s.revision||!eqSet(s.guard.ids,s.required)||s.guard.commitBound!==true||!validNumber(s.guard.commitAt)||s.guard.commitAt<Math.max(...r.map(x=>x.at))||s.guard.commitAt<q.queryAt)return "RECONCILE";
  return "COMPLETE";
 }
 const traces=[],decisions=[];
 for(const {id,state:s} of scenarios){
  const ev=[{type:"TRANSACTION",...s.transaction},{type:"CHECKPOINT",lsn:s.checkpoint},{type:"DELIVERY",count:s.delivered}];
  for(const receipt of s.receipts)ev.push({type:"SINK_RECEIPT",...receipt});
  ev.push({type:"PRIOR_QUERY",...s.query},{type:"HISTORICAL_GRANT",...s.grant},{type:"MEMBERSHIP",...s.members},{type:"COMPLETION_GUARD",...s.guard},{type:"CURRENT_PERMISSION",...s.permission},{type:"ATTEMPT_REGISTRY",attempts:s.attempts},{type:"SINK_DEDUP",...s.dedup},{type:"CONTRACT",task:s.task,run:s.run,slot:s.slot,slotEpoch:s.slotEpoch,xid:s.xid,lsn:s.lsn,uid:s.uid,revision:s.revision,required:s.required} );
  traces.push({id,events:ev});
  decisions.push({id,path:"checkpoint_proxy",decision:validNumber(s.checkpoint)&&s.checkpoint>=s.lsn?"COMPLETE":"RECONCILE"});
  decisions.push({id,path:"delivery_proxy",decision:validNumber(s.delivered)&&s.delivered>0?"COMPLETE":"RECONCILE"});
  decisions.push({id,path:"full_reference",decision:ref(s)});
 }
 return {traces,decisions};
}
if (typeof module !== "undefined") module.exports = { makeScenarios, produce };
