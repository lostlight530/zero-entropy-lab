// Maintainer reconstruction, 2026-11-07 logical Asia/Shanghai, original inline 9-trial source was not persisted
// Synthetic guard, grant and journal are authored model state, not real effect/issuer/atomicity evidence
function cases(){
 const b={task:"T7",run:"R7",attempt:"P1",action:"commit-A+B",target:"uid7",required:["A","B"],permissionNow:true,effectTime:12,
 grant:{issuer:"synthetic-grant-ledger",enabled:true,task:"T7",run:"R7",attempt:"P1",action:"commit-A+B",target:"uid7",members:["A","B"],from:1,to:20},
 query:{authority:"synthetic-journal",state:"hit",exact:true,task:"T7",run:"R7",attempt:"P1",action:"commit-A+B",target:"uid7",members:["A","B"],attempts:["P1"],watermark:20,lastEnd:15,at:22,retentionUntil:40,lifecycle:"ACTIVE"},
 receipts:[{task:"T7",run:"R7",attempt:"P1",target:"uid7",member:"A",effect:"commit-A",at:12,state:"DONE"},{task:"T7",run:"R7",attempt:"P1",target:"uid7",member:"B",effect:"commit-B",at:12,state:"DONE"}],
 current:{target:"uid7",members:["A","B"],done:["A","B"],states:{A:"DONE",B:"DONE"},revision:7,guardRevision:7,membershipRevision:7,verifiedAt:24,protected:true,atomic:true}};
 const defs=[
 ["baseline",s=>{}],["permission_revoked",s=>s.permissionNow=false],["unknown_prior",s=>s.query.state="unknown"],["miss_conflict",s=>s.query.state="miss"],["duplicate",s=>s.receipts.splice(1,0,{...s.receipts[0]})],["extra",s=>s.receipts.push({...s.receipts[0],member:"C",effect:"commit-C"})],["guard_lost",s=>s.current.protected=false],["historical_denied",s=>s.grant.enabled=false],["toctou",s=>s.current.atomic=false],
 ["missing_B",s=>s.receipts.splice(1,1)],["duplicate_A_same_count",s=>s.receipts[1]={...s.receipts[0]}],["wrong_receipt_task",s=>s.receipts[0].task="X"],["wrong_receipt_run",s=>s.receipts[0].run="X"],["wrong_receipt_attempt",s=>s.receipts[0].attempt="P0"],["wrong_receipt_target",s=>s.receipts[0].target="uid8"],["wrong_receipt_effect",s=>s.receipts[0].effect="commit-C"],["wrong_receipt_time",s=>s.receipts[0].at=13],["wrong_receipt_status",s=>s.receipts[0].state="ACKED"],
 ["wrong_query_task",s=>s.query.task="X"],["wrong_query_attempt",s=>s.query.attempt="P0"],["uncovered_attempts",s=>s.query.attempts=[]],["wrong_query_target",s=>s.query.target="uid8"],["wrong_query_members",s=>s.query.members=["A","C"]],["uncovered_watermark",s=>s.query.watermark=10],["uncovered_last_end",s=>s.query.lastEnd=11],["future_watermark",s=>s.query.watermark=99],["retention_expired",s=>s.query.retentionUntil=21],["lifecycle_pruned",s=>s.query.lifecycle="PRUNED"],["cache_not_authority",s=>s.query.authority="cache"],["nonboolean_exact",s=>s.query.exact="true"],["uncovered_miss",s=>{s.query.state="miss";s.query.authority="cache"}],
 ["wrong_grant_attempt",s=>s.grant.attempt="P0"],["wrong_grant_action",s=>s.grant.action="different"],["grant_expired",s=>s.grant.to=11],["grant_not_yet_valid",s=>s.grant.from=13],["grant_wrong_target",s=>s.grant.target="uid8"],["grant_missing_issuer",s=>delete s.grant.issuer],["grant_type_coercion",s=>s.grant.enabled="true"],
 ["target_recreated",s=>s.current.target="uid8"],["current_member_replaced",s=>{s.current.members=["A","C"];s.current.states={A:"DONE",C:"DONE"};s.current.done=["A","C"]}],["current_extra_state",s=>s.current.states.C="DONE"],["membership_revision_drift",s=>s.current.membershipRevision=8],["guard_revision_drift",s=>s.current.guardRevision=8],["current_not_verified_after_effect",s=>s.current.verifiedAt=10],["duplicate_required_members",s=>s.required=["A","A"]],["query_timed_string",s=>s.query.lastEnd="15"],["nonboolean_atomic",s=>s.current.atomic="true"],["nonboolean_permission",s=>s.permissionNow="false"],["no_receipts_unknown",s=>{s.receipts=[];s.query.state="unknown"}],["covered_miss_no_receipts",s=>{s.receipts=[];s.query.state="miss"}]
 ];
 return defs.map(([id,mutate])=>{const state=JSON.parse(JSON.stringify(b));mutate(state);return {id,state,mutation:id}});
}
function reference(s){
 const int=x=>typeof x==="number"&&Number.isSafeInteger(x)&&x>=0, str=x=>typeof x==="string"&&x.length>0;
 const exact=(a,b)=>Array.isArray(a)&&Array.isArray(b)&&a.length>0&&a.length===b.length&&new Set(a).size===a.length&&new Set(b).size===b.length&&a.every(str)&&b.every(str)&&a.every(x=>b.includes(x));
 if(!s||![s.task,s.run,s.attempt,s.action,s.target].every(str)||!exact(s.required,["A","B"])||typeof s.permissionNow!=="boolean"||!int(s.effectTime)||!s.grant||!s.query||!s.current||!Array.isArray(s.receipts))return "STOP_UNKNOWN";
 const g=s.grant,q=s.query,c=s.current;
 const coverage=q.authority==="synthetic-journal"&&q.exact===true&&q.lifecycle==="ACTIVE"&&["hit","miss","unknown"].includes(q.state)&&q.task===s.task&&q.run===s.run&&q.attempt===s.attempt&&q.action===s.action&&q.target===s.target&&exact(q.members,s.required)&&exact(q.attempts,[s.attempt])&&[q.watermark,q.lastEnd,q.at,q.retentionUntil].every(int)&&q.lastEnd>=s.effectTime&&q.watermark>=q.lastEnd&&q.watermark<=q.at&&q.at<=q.retentionUntil;
 if(!coverage)return "STOP_UNKNOWN";
 if(q.state==="miss"&&s.receipts.length>0)return "EVIDENCE_CONFLICT";
 if(q.state!=="hit"||s.receipts.length===0)return "STOP_UNKNOWN";
 if(!exact(s.receipts.map(r=>r.member),s.required)||s.receipts.some(r=>r.task!==s.task||r.run!==s.run||r.attempt!==s.attempt||r.target!==s.target||r.effect!=="commit-"+r.member||r.at!==s.effectTime||r.state!=="DONE"))return "RECONCILE";
 if(g.issuer!=="synthetic-grant-ledger"||typeof g.enabled!=="boolean"||!str(g.task)||g.task!==s.task||g.run!==s.run||g.attempt!==s.attempt||g.action!==s.action||g.target!==s.target||!exact(g.members,s.required)||![g.from,g.to].every(int))return "STOP_UNKNOWN";
 if(g.enabled===false||s.effectTime<g.from||s.effectTime>g.to)return "BLOCKED";
 if(c.target!==s.target||!exact(c.members,s.required)||!exact(c.done,s.required)||!c.states||!exact(Object.keys(c.states),s.required)||s.required.some(m=>c.states[m]!=="DONE"))return "RECONCILE";
 if(![c.revision,c.guardRevision,c.membershipRevision,c.verifiedAt].every(int)||c.verifiedAt<s.effectTime||c.revision!==c.guardRevision||c.revision!==c.membershipRevision||c.protected!==true||c.atomic!==true)return "STOP_UNKNOWN";
 return "COMPLETE";
}
function produce(xs){
 const traces=xs.map(({id,state:s})=>({id,events:[{kind:"INTENT",data:{task:s.task,run:s.run,attempt:s.attempt,action:s.action,target:s.target,required:s.required}},{kind:"PERMISSION",data:{now:s.permissionNow}},{kind:"EFFECT_TIME",data:{at:s.effectTime}},{kind:"GRANT",data:s.grant},{kind:"QUERY",data:s.query},{kind:"CURRENT",data:s.current},...s.receipts.map(r=>({kind:"RECEIPT",data:r}))]}));
 const decisions=xs.flatMap(({id,state:s})=>[{id,path:"weak_count",decision:s.receipts.length>=s.required.length?"COMPLETE":"STOP_UNKNOWN"},{id,path:"reference",decision:reference(s)}]);
 return {traces,decisions};
}
if(typeof module !== "undefined")module.exports={cases,reference,produce};
