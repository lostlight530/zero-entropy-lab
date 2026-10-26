
function produceSqs(){
 const context={task:"task-27",run:"run-27",attempt:"attempt-2",target:"target-27",incarnation:"inc-27",required:[{member:"A",uid:"uid-A",effectId:"effect-A"},{member:"B",uid:"uid-B",effectId:"effect-B"}]};
 const mk=(member,uid,effectId,at)=>({member,uid,effectId,task:context.task,run:context.run,attempt:context.attempt,target:context.target,incarnation:context.incarnation,approval:"approval-27",at});
 const receiptA=mk("A","uid-A","effect-A",60),receiptB=mk("B","uid-B","effect-B",70);
 const grant=r=>({...r,validFrom:10,validTo:75,revokedAt:null});
 const base={id:"baseline",context,control:{http:200,queue:"queue-27.fifo",message:"message-27",group:"group-27",dedup:"dedup-27",dedupAgeSec:120,deliveryEpoch:2,latestHandle:"handle-2",usedHandle:"handle-2",receivedAt:40,deletedAt:80},receipts:[receiptA,receiptB],grants:[grant(receiptA),grant(receiptB)],queueProof:[{state:"DELETED",queue:"queue-27.fifo",message:"message-27",epoch:2,handle:"handle-2",at:80}],prior:{state:"hit",journalComplete:true,query:{task:context.task,run:context.run,attempt:context.attempt,target:context.target,incarnation:context.incarnation,effectIds:["effect-A","effect-B"],at:85,watermark:75,attemptEnd:72,retentionUntil:150,lifecycle:"ACTIVE",authority:"synthetic-sink-ledger"}},permission:{allowed:true,task:context.task,target:context.target,incarnation:context.incarnation,validUntil:110,revokedAt:null},current:{task:context.task,target:context.target,incarnation:context.incarnation,members:[{member:"A",uid:"uid-A"},{member:"B",uid:"uid-B"}],commitMembers:[{member:"A",uid:"uid-A"},{member:"B",uid:"uid-B"}],predicate:"DONE",revision:12,guardRevision:12,commitRevision:12,readAt:90,guardAt:99,commitAt:100,protected:true}};
 const scenarios=[base],clone=x=>JSON.parse(JSON.stringify(x));
 const add=(id,fn)=>{const s=clone(base);s.id=id;fn(s);scenarios.push(s)};
 const noEffects=s=>{s.receipts=[];s.queueProof=[];s.prior.state="unknown";s.current.predicate="PENDING"};
 const coveredMiss=s=>{noEffects(s);s.prior.state="miss"};
 add("historical_revocation_after_effect",s=>{s.permission.allowed=false;s.permission.revokedAt=95});
 add("dedup_window_expired_historical_complete",s=>{s.control.dedupAgeSec=420});
 add("stale_handle_http_200",s=>{s.control.usedHandle="handle-1";s.queueProof=[]});
 add("delete_http_200_no_external_effect",noEffects);
 add("missing_member_B_receipt",s=>{s.receipts=[s.receipts[0]]});
 add("duplicate_A_replaces_B",s=>{s.receipts=[s.receipts[0],clone(s.receipts[0])]});
 add("extra_effect_C",s=>{s.receipts.push(mk("C","uid-C","effect-C",73))});
 add("wrong_task_receipt",s=>{s.receipts[1].task="other-task"});
 add("wrong_run_receipt",s=>{s.receipts[1].run="other-run"});
 add("wrong_attempt_receipt",s=>{s.receipts[1].attempt="attempt-3"});
 add("wrong_target_receipt",s=>{s.receipts[1].target="other-target"});
 add("wrong_incarnation_receipt",s=>{s.receipts[1].incarnation="inc-new"});
 add("wrong_member_uid_receipt",s=>{s.receipts[1].uid="uid-B2"});
 add("duplicate_effect_identity",s=>{s.receipts[1].effectId="effect-A"});
 add("grant_revoked_before_effect",s=>{s.grants[1].revokedAt=65});
 add("grant_expired_before_effect",s=>{s.grants[1].validTo=69});
 add("effect_before_delivery",s=>{s.receipts[0].at=35});
 add("same_count_member_swap",s=>{s.current.members[1]={member:"C",uid:"uid-C"};s.current.commitMembers[1]={member:"C",uid:"uid-C"}});
 add("duplicate_current_member",s=>{s.current.members[1]=clone(s.current.members[0]);s.current.commitMembers[1]=clone(s.current.members[0])});
 add("extra_current_member",s=>{s.current.members.push({member:"C",uid:"uid-C"});s.current.commitMembers.push({member:"C",uid:"uid-C"})});
 add("unprotected_current_guard",s=>{s.current.protected=false});
 add("guard_revision_drift",s=>{s.current.commitRevision=13});
 add("read_commit_membership_toctou",s=>{s.current.commitMembers[1]={member:"C",uid:"uid-C"}});
 add("target_incarnation_recreated",s=>{s.current.incarnation="inc-new"});
 add("queue_proof_wrong_handle",s=>{s.queueProof[0].handle="handle-1"});
 add("queue_proof_wrong_epoch",s=>{s.queueProof[0].epoch=1});
 add("queue_proof_duplicate",s=>{s.queueProof.push(clone(s.queueProof[0]))});
 add("queue_proof_extra_message",s=>{s.queueProof.push({...s.queueProof[0],message:"other-message"})});
 add("queue_proof_boolean_coercion",s=>{s.queueProof[0].state=true});
 add("covered_negative_miss_conflicts_positive",s=>{s.prior.state="miss"});
 add("covered_miss_safe_retry",coveredMiss);
 add("covered_miss_permission_revoked",s=>{coveredMiss(s);s.permission.allowed=false;s.permission.revokedAt=90});
 add("covered_miss_guard_unprotected",s=>{coveredMiss(s);s.current.protected=false});
 add("miss_stale_watermark",s=>{coveredMiss(s);s.prior.query.watermark=60});
 add("miss_retention_expired",s=>{coveredMiss(s);s.prior.query.retentionUntil=80});
 add("miss_wrong_effect_set",s=>{coveredMiss(s);s.prior.query.effectIds=["effect-A"]});
 add("miss_wrong_target",s=>{coveredMiss(s);s.prior.query.target="other-target"});
 add("hit_with_complete_empty_journal",s=>{noEffects(s);s.prior.state="hit"});
 add("blind_retry_after_dedup_expiry",s=>{noEffects(s);s.control.dedupAgeSec=420});
 add("fifo_dedup_ack_without_delivery",s=>{noEffects(s);s.control.dedupAgeSec=120});
 add("historical_grant_revoked_after_effect",s=>{s.grants[1].revokedAt=74});
 add("current_permission_expired_after_effect",s=>{s.permission.validUntil=95});
 add("queue_delete_before_effect",s=>{s.queueProof[0].at=55});
 add("current_read_before_effect",s=>{s.current.readAt=65});
 add("required_set_duplicate_identity",s=>{s.context.required[1]=clone(s.context.required[0])});

 add("attack_receipt_time_string",s=>{s.receipts[0].at="60"});
 add("attack_grant_from_string",s=>{s.grants[0].validFrom="10"});
 add("attack_current_read_string",s=>{s.current.readAt="90"});
 add("attack_current_guard_string",s=>{s.current.guardAt="99"});
 add("attack_control_receive_string",s=>{s.control.receivedAt="40"});
 add("attack_current_commit_string",s=>{s.current.commitAt="100"});
 add("attack_prior_watermark_string",s=>{s.receipts=[];s.queueProof=[];s.prior.state="miss";s.current.predicate="PENDING";s.prior.query.watermark="75"});
 add("attack_prior_retention_string",s=>{s.receipts=[];s.queueProof=[];s.prior.state="miss";s.current.predicate="PENDING";s.prior.query.retentionUntil="150"});
 add("attack_permission_valid_until_string",s=>{s.receipts=[];s.queueProof=[];s.prior.state="miss";s.current.predicate="PENDING";s.permission.validUntil="110"});
 const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
 const exactSet=(xs,ys)=>Array.isArray(xs)&&xs.length===ys.length&&new Set(xs).size===xs.length&&xs.every(x=>ys.includes(x));
 const memberSet=(xs,req)=>Array.isArray(xs)&&xs.length===req.length&&new Set(xs.map(x=>x.member)).size===xs.length&&xs.every(x=>req.some(y=>y.member===x.member&&y.uid===x.uid));
 const scope=s=>{const q=s.prior.query,c=s.context;return q&&[q.at,q.watermark,q.attemptEnd,q.retentionUntil].every(Number.isFinite)&&q.task===c.task&&q.run===c.run&&q.attempt===c.attempt&&q.target===c.target&&q.incarnation===c.incarnation&&exactSet(q.effectIds,c.required.map(x=>x.effectId))&&q.authority==="synthetic-sink-ledger"&&q.lifecycle==="ACTIVE"&&Number.isFinite(q.at)&&q.at>=q.attemptEnd&&q.watermark>=q.attemptEnd&&q.retentionUntil>=q.at};
 const current=(s,pending)=>{const w=s.current,c=s.context;return [w.readAt,w.guardAt,w.commitAt,w.revision,w.guardRevision,w.commitRevision].every(Number.isFinite)&&w.task===c.task&&w.target===c.target&&w.incarnation===c.incarnation&&memberSet(w.members,c.required)&&memberSet(w.commitMembers,c.required)&&same(w.members,w.commitMembers)&&w.predicate===(pending?"PENDING":"DONE")&&w.protected===true&&Number.isInteger(w.revision)&&w.revision===w.guardRevision&&w.revision===w.commitRevision&&w.readAt<w.guardAt&&w.guardAt<w.commitAt&&w.readAt>=s.prior.query.at};
 const permission=s=>{const p=s.permission,c=s.context;return Number.isFinite(p.validUntil)&&(p.revokedAt===null||Number.isFinite(p.revokedAt))&&p.allowed===true&&p.task===c.task&&p.target===c.target&&p.incarnation===c.incarnation&&p.validUntil>=s.current.commitAt&&(p.revokedAt===null||p.revokedAt>s.current.commitAt)};
 const ref=s=>{
  const c=s.context,req=c.required,rs=s.receipts;
  if(!Number.isFinite(s.control.receivedAt)||!Number.isFinite(s.control.deletedAt)||!Number.isInteger(s.control.deliveryEpoch))return "RECONCILE";
  if(!Array.isArray(req)||req.length!==2||new Set(req.map(x=>x.member)).size!==2||new Set(req.map(x=>x.effectId)).size!==2||new Set(req.map(x=>x.uid)).size!==2)return "RECONCILE";
  if(s.prior.state==="miss"&&scope(s)&&rs.length>0&&rs.some(r=>req.some(x=>x.member===r.member&&x.effectId===r.effectId)))return "EVIDENCE_CONFLICT";
  if(rs.length===0){
   if(s.prior.state==="hit"&&scope(s)&&s.prior.journalComplete===true)return "EVIDENCE_CONFLICT";
   if(s.prior.state!=="miss"||!scope(s))return "STOP_UNKNOWN";
   if(!permission(s))return "BLOCKED";
   return current(s,true)?"RETRY_ALLOWED":"STOP_UNKNOWN";
  }
  if(rs.length!==req.length||new Set(rs.map(x=>x.effectId)).size!==rs.length)return "RECONCILE";
  for(const r of rs){
   const x=req.find(x=>x.member===r.member&&x.uid===r.uid&&x.effectId===r.effectId);
   if(!Number.isFinite(r.at)||!x||r.task!==c.task||r.run!==c.run||r.attempt!==c.attempt||r.target!==c.target||r.incarnation!==c.incarnation||r.at<s.control.receivedAt||r.at>=s.current.readAt)return "RECONCILE";
   const grants=s.grants.filter(g=>Number.isFinite(g.validFrom)&&Number.isFinite(g.validTo)&&(g.revokedAt===null||Number.isFinite(g.revokedAt))&&g.member===r.member&&g.uid===r.uid&&g.effectId===r.effectId&&g.task===r.task&&g.run===r.run&&g.attempt===r.attempt&&g.target===r.target&&g.incarnation===r.incarnation&&g.approval===r.approval&&g.validFrom<=r.at&&r.at<=g.validTo&&(g.revokedAt===null||g.revokedAt>r.at));
   if(grants.length!==1)return "RECONCILE";
  }
  if(s.queueProof.length===0)return "STOP_UNKNOWN";
  if(s.queueProof.length!==1)return "RECONCILE";
  const a=s.queueProof[0],t=s.control;
  if(!Number.isFinite(a.at)||!Number.isInteger(a.epoch)||a.state!=="DELETED"||a.queue!==t.queue||a.message!==t.message||a.epoch!==t.deliveryEpoch||a.handle!==t.usedHandle||t.usedHandle!==t.latestHandle||a.at!==t.deletedAt||a.at<Math.max(...rs.map(r=>r.at))||a.at>=s.current.readAt)return "RECONCILE";
  return current(s,false)?"COMPLETE":"RECONCILE";
 };
 const paths=["http_status_proxy","fifo_dedup_proxy","full_reference"];
 const decisions=scenarios.flatMap(s=>[{scenario:s.id,path:paths[0],decision:s.control.http===200?"COMPLETE":"STOP_UNKNOWN"},{scenario:s.id,path:paths[1],decision:s.control.http===200&&s.control.dedupAgeSec<=300?"COMPLETE":"STOP_UNKNOWN"},{scenario:s.id,path:paths[2],decision:ref(s)}]);
 const csv=["scenario,path,decision",...decisions.map(x=>[x.scenario,x.path,x.decision].join(","))].join("\n")+"\n";
 return {scenarios,decisions,csv};
}
if(typeof module!=="undefined"){module.exports={produceSqs};if(require.main===module){const x=produceSqs();console.log(JSON.stringify({scenarios:x.scenarios.length,rows:x.decisions.length}));}}
