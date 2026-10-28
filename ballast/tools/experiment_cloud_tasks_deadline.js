"use strict";
const output=(function producer(){
const C=x=>JSON.parse(JSON.stringify(x)), S=x=>Number.isSafeInteger(x)&&x>=0, E=(a,b)=>JSON.stringify(a)===JSON.stringify(b), ids=x=>x.map(z=>z.id+":"+z.uid).sort(), unique=x=>new Set(x).size===x.length;
const base={
task:{id:"task29",run:"run29",attempt:2,queue:"queue29",name:"task-name29",inc:"task-inc29",target:"target29",targetUid:"uid29",intent:"publish29",required:[{id:"A",uid:"a1"},{id:"B",uid:"b1"}]},
dispatch:{createOk:true,lastHttp:204,dispatchCount:2,responseCount:1,deadlineExceeded:true,deadline:50,retryAt:60,nameDedupRejected:true,nameAgeHours:4,oldFence:{protected:true,tick:55,scope:{task:"task29",run:"run29",queue:"queue29",name:"task-name29",inc:"task-inc29",targetUid:"uid29",attempt:1}}},
prior:{kind:"hit",query:{task:"task29",run:"run29",queue:"queue29",name:"task-name29",target:"target29",intent:"publish29",inc:"task-inc29",targetUid:"uid29",required:["A:a1","B:b1"],attempts:[1,2],complete:true,watermark:95,queryAt:96,retentionUntil:150,lifecycle:"ACTIVE"}},
receipts:[{id:"A",uid:"a1",task:"task29",run:"run29",name:"task-name29",target:"target29",intent:"publish29",attempt:2,inc:"task-inc29",targetUid:"uid29",effectAt:70,grant:"grant29"},{id:"B",uid:"b1",task:"task29",run:"run29",name:"task-name29",target:"target29",intent:"publish29",attempt:2,inc:"task-inc29",targetUid:"uid29",effectAt:75,grant:"grant29"}],
grant:{id:"grant29",from:40,to:90,revokedAt:null,scope:{task:"task29",run:"run29",queue:"queue29",name:"task-name29",target:"target29",targetUid:"uid29",inc:"task-inc29",intent:"publish29",required:["A:a1","B:b1"]}},permission:{valid:true,protected:true,guardAt:98,scope:{task:"task29",run:"run29",inc:"task-inc29",intent:"publish29",targetUid:"uid29",required:["A:a1","B:b1"]}},
completion:{scope:{task:"task29",run:"run29",name:"task-name29",inc:"task-inc29",intent:"publish29",target:"target29",targetUid:"uid29",required:["A:a1","B:b1"]},targetUid:"uid29",members:[{id:"A",uid:"a1"},{id:"B",uid:"b1"}],state:"satisfied",predicateComplete:true,revision:7,observedRevision:7,guardRevision:7,readAt:85,guardAt:99,commitAt:100,guardProtected:true}};
const changes=[
["baseline",{}],["deadline_worker_unfenced",{"dispatch.oldFence.protected":false}],["fence_after_retry",{"dispatch.oldFence.tick":65}],
["deadline_without_effect_proof",{"receipts":[],"prior.kind":"unknown","completion.state":"unsatisfied"}],
["late_old_attempt_receipt",{"receipts.0.attempt":1}],["duplicate_A_receipt",{"receipts.1.id":"A","receipts.1.uid":"a1"}],
["extra_C_receipt",{"receipts.2":{id:"C",uid:"c1",task:"task29",run:"run29",name:"task-name29",target:"target29",intent:"publish29",attempt:2,inc:"task-inc29",targetUid:"uid29",effectAt:78,grant:"grant29"}}],
["same_count_A_C",{"receipts.1.id":"C","receipts.1.uid":"c1"}],
["wrong_receipt_task",{"receipts.0.task":"other"}],["wrong_receipt_run",{"receipts.0.run":"other"}],
["wrong_receipt_attempt",{"receipts.0.attempt":3}],["wrong_receipt_incarnation",{"receipts.0.inc":"other"}],
["wrong_receipt_target_uid",{"receipts.0.targetUid":"other"}],["grant_expired",{"grant.to":69}],
["grant_revoked_before_effect",{"grant.revokedAt":65}],["grant_revoked_after_effect",{"grant.revokedAt":85}],
["wrong_grant_identity",{"receipts.0.grant":"other"}],["prior_unknown",{"prior.kind":"unknown"}],
["prior_hit_incomplete",{"prior.query.complete":false}],["prior_wrong_queue",{"prior.query.queue":"other"}],
["prior_wrong_required_set",{"prior.query.required":["A:a1","C:c1"]}],["prior_watermark_behind",{"prior.query.watermark":69}],
["prior_retention_expired",{"prior.query.retentionUntil":90}],["prior_miss_positive_conflict",{"prior.kind":"miss"}],
["miss_incomplete_no_receipts",{"prior.kind":"miss","receipts":[],"completion.state":"unsatisfied","prior.query.complete":false}],
["miss_covered_safe_retry",{"prior.kind":"miss","receipts":[],"completion.state":"unsatisfied"}],
["miss_revoked_permission",{"prior.kind":"miss","receipts":[],"completion.state":"unsatisfied","permission.valid":false}],
["miss_unprotected_permission",{"prior.kind":"miss","receipts":[],"completion.state":"unsatisfied","permission.protected":false}],
["miss_unfenced_worker",{"prior.kind":"miss","receipts":[],"completion.state":"unsatisfied","dispatch.oldFence.protected":false}],
["current_target_recreated",{"completion.targetUid":"new-uid"}],
["current_membership_swap",{"completion.members.1.id":"C","completion.members.1.uid":"c1"}],
["current_extra_member",{"completion.members.2":{id:"C",uid:"c1"}}],
["current_duplicate_member",{"completion.members.1.id":"A","completion.members.1.uid":"a1"}],
["current_revision_drift",{"completion.guardRevision":8}],["current_guard_unprotected",{"completion.guardProtected":false}],
["current_predicate_incomplete",{"completion.predicateComplete":false}],["current_state_unsatisfied",{"completion.state":"unsatisfied"}],
["current_guard_before_effect",{"completion.guardAt":72}],["fractional_effect_time",{"receipts.0.effectAt":70.5}],
["string_attempt_coercion",{"receipts.0.attempt":"2"}],
["name_window_expired",{"dispatch.nameAgeHours":25,"dispatch.nameDedupRejected":false}],
["name_reuse_new_incarnation",{"task.inc":"new-inc"}],["http_503_but_completed",{"dispatch.lastHttp":503}],
["current_permission_revoked_after_effect",{"permission.valid":false}],
["grant_begins_after_effect",{"grant.from":72}],["query_time_before_watermark",{"prior.query.queryAt":90}],
["query_lifecycle_pruned",{"prior.query.lifecycle":"PRUNED"}],
["missing_required_member",{"task.required":[{id:"A",uid:"a1"}]}],
["unprotected_completion_read",{"completion.observedRevision":8}],
["task_intent_changed",{"task.intent":"other-intent"}],
["task_name_changed",{"task.name":"other-name"}],
["task_target_changed",{"task.target":"other-target"}],
["receipt_intent_changed",{"receipts.0.intent":"other-intent"}],
["receipt_name_changed",{"receipts.0.name":"other-name"}],
["receipt_target_changed",{"receipts.0.target":"other-target"}],
["grant_scope_intent_changed",{"grant.scope.intent":"other-intent"}],
["completion_scope_intent_changed",{"completion.scope.intent":"other-intent"}],
["fence_scope_run_changed",{"dispatch.oldFence.scope.run":"other-run"}],
["miss_permission_scope_intent_changed",{"prior.kind":"miss","receipts":[],"completion.state":"unsatisfied","permission.scope.intent":"other-intent"}],
["rebound_except_grant",{"task.intent":"new-intent","prior.query.intent":"new-intent","receipts.0.intent":"new-intent","receipts.1.intent":"new-intent","completion.scope.intent":"new-intent","permission.scope.intent":"new-intent"}],
["rebound_except_completion",{"task.intent":"new-intent","prior.query.intent":"new-intent","receipts.0.intent":"new-intent","receipts.1.intent":"new-intent","grant.scope.intent":"new-intent","permission.scope.intent":"new-intent"}],
["rebound_except_fence",{"task.name":"new-name","prior.query.name":"new-name","receipts.0.name":"new-name","receipts.1.name":"new-name","grant.scope.name":"new-name","completion.scope.name":"new-name"}],
["rebound_except_permission",{"prior.kind":"miss","receipts":[],"completion.state":"unsatisfied","task.intent":"new-intent","prior.query.intent":"new-intent","grant.scope.intent":"new-intent","completion.scope.intent":"new-intent"}]
];
function patch(o,delta){for(const [path,v] of Object.entries(delta)){let a=path.split("."),p=o;if(!["task","dispatch","prior","receipts","grant","permission","completion"].includes(a[0])||a.some(x=>!x||["__proto__","prototype","constructor"].includes(x)))throw Error("invalid patch "+path);for(const b of a.slice(0,-1)){if(p==null||!(b in p))throw Error("missing "+path);p=p[b]}const k=a.at(-1);if(p==null||(!Array.isArray(p)&&!(k in p))||(Array.isArray(p)&&(!/^\d+$/.test(k)||+k>p.length)))throw Error("invalid leaf "+path);p[k]=C(v)}return o}
function decide(s){
const {task:t,dispatch:d,prior:h,receipts:r,grant:g,permission:p,completion:c}=s,q=h.query;
if(!Array.isArray(r)||!Array.isArray(t.required)||!Array.isArray(c.members)||![t.attempt,d.deadline,d.retryAt,d.oldFence.tick,c.readAt,c.guardAt,c.commitAt,c.revision,c.observedRevision,c.guardRevision,p.guardAt,g.from,g.to].every(S))return "STOP_UNKNOWN";
const scope=q.complete===true&&q.lifecycle==="ACTIVE"&&q.task===t.id&&q.run===t.run&&q.queue===t.queue&&q.name===t.name&&q.target===t.target&&q.intent===t.intent&&q.inc===t.inc&&q.targetUid===t.targetUid&&E(q.required,ids(t.required))&&E(q.attempts,[1,2])&&[q.watermark,q.queryAt,q.retentionUntil].every(S)&&q.watermark>=d.retryAt&&q.queryAt>=q.watermark&&q.retentionUntil>=q.queryAt;
if(h.kind==="miss"&&scope&&r.length>0)return "EVIDENCE_CONFLICT";
if(!scope||!["hit","miss"].includes(h.kind))return "STOP_UNKNOWN";
const f=d.oldFence.scope;if(!f||f.task!==t.id||f.run!==t.run||f.queue!==t.queue||f.name!==t.name||f.inc!==t.inc||f.targetUid!==t.targetUid||f.attempt!==1)return "STOP_UNKNOWN";
const cs=c.scope;if(!cs||cs.task!==t.id||cs.run!==t.run||cs.name!==t.name||cs.inc!==t.inc||cs.intent!==t.intent||cs.target!==t.target||cs.targetUid!==t.targetUid||!E(cs.required,ids(t.required)))return "RECONCILE";
if(d.oldFence.protected!==true||d.oldFence.tick<d.deadline||d.oldFence.tick>d.retryAt)return "STOP_UNKNOWN";
const wanted=ids(t.required),got=ids(r),present=ids(c.members);
if(!r.length){if(h.kind!=="miss")return "STOP_UNKNOWN";const ps=p.scope;if(!ps||ps.task!==t.id||ps.run!==t.run||ps.inc!==t.inc||ps.intent!==t.intent||ps.targetUid!==t.targetUid||!E(ps.required,ids(t.required)))return "STOP_UNKNOWN";if(p.valid!==true)return "BLOCKED";if(p.protected!==true||p.guardAt<=q.queryAt||p.guardAt>=c.commitAt)return "STOP_UNKNOWN";if(c.targetUid!==t.targetUid||!unique(wanted)||!unique(present)||!E(present,wanted))return "RECONCILE";return "RETRY_ALLOWED"}
if(h.kind!=="hit")return "STOP_UNKNOWN";
const gs=g.scope;if(!gs||gs.task!==t.id||gs.run!==t.run||gs.queue!==t.queue||gs.name!==t.name||gs.target!==t.target||gs.targetUid!==t.targetUid||gs.inc!==t.inc||gs.intent!==t.intent||!E(gs.required,ids(t.required)))return "BLOCKED";
if(!unique(wanted)||!unique(got)||!unique(present)||!E(got,wanted))return "RECONCILE";
for(const x of r){if(!S(x.effectAt)||!S(x.attempt)||x.task!==t.id||x.run!==t.run||x.name!==t.name||x.target!==t.target||x.intent!==t.intent||x.attempt!==t.attempt||x.inc!==t.inc||x.targetUid!==t.targetUid||x.grant!==g.id||x.effectAt<=d.retryAt||x.effectAt>q.watermark||x.effectAt>=c.commitAt)return "RECONCILE";if(x.effectAt<g.from||x.effectAt>g.to||(g.revokedAt!==null&&(!S(g.revokedAt)||g.revokedAt<=x.effectAt)))return "BLOCKED"}
if(c.targetUid!==t.targetUid||!E(present,wanted)||c.state!=="satisfied"||c.predicateComplete!==true||c.guardProtected!==true||c.revision!==c.observedRevision||c.revision!==c.guardRevision||!(c.readAt<c.guardAt&&c.guardAt<c.commitAt)||c.guardAt<Math.max(...r.map(x=>x.effectAt)))return "RECONCILE";
return "COMPLETE"}
const pack={schema:"ballast.cloud-tasks-deadline-fixtures/1",logicalDate:"2026-10-29",base,cases:changes.map(([id,changes])=>({id,changes}))};
const rows=[];for(const {id,changes:delta} of pack.cases){const s=patch(C(base),delta);rows.push({scenario:id,path:"http_proxy",decision:s.dispatch.lastHttp>=200&&s.dispatch.lastHttp<300?"COMPLETE":"STOP_UNKNOWN"},{scenario:id,path:"name_proxy",decision:s.dispatch.nameDedupRejected&&s.dispatch.nameAgeHours<=24?"COMPLETE":"STOP_UNKNOWN"},{scenario:id,path:"full_reference",decision:decide(s)})}
return {pack,rows}
})();
if(typeof process!=="undefined"&&process.stdout)process.stdout.write(JSON.stringify(output,null,2)+"\n");
