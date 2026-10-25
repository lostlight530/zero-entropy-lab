"use strict";
function baseline(){
 const id={task:"task-26",workflow:"workflow-26",run:"run-26",update:"update-26",attempt:"attempt-1",target:"target-26"};
 const receipt=(effect,tick)=>({...id,effect,tick,approval:"approval-26"});
 const grant=(effect)=>({...id,effect,approval:"approval-26",from:5,until:70,revokedAt:null});
 return {id,update:{stage:"COMPLETED",validator:"ACCEPTED",acceptedAt:10,completedAt:60},required:["A","B"],requiredMembers:["A:uid-A","B:uid-B"],receipts:[receipt("A",30),receipt("B",40)],grants:[grant("A"),grant("B")],prior:{kind:"hit",task:id.task,workflow:id.workflow,run:id.run,update:id.update,attempt:id.attempt,target:id.target,effects:["A","B"],queryAt:85,watermark:80,attemptEnd:65,retentionUntil:150,lifecycle:"ACTIVE"},permission:{allowed:true,...id,effects:["A","B"],validUntil:120},current:{target:id.target,revision:8,members:[{id:"A",uid:"uid-A",done:true},{id:"B",uid:"uid-B",done:true}],readAt:80,commitAt:90,guard:{protected:true,target:id.target,revision:8,members:["A:uid-A","B:uid-B"],evaluatedAt:90}}};
}
function cases(){
 const seed=baseline(), out=[];
 const add=(name,mutate,expected)=>{let s=JSON.parse(JSON.stringify(seed));mutate(s);out.push({name,expected,primitive:s})};
 const clear=(s)=>{s.receipts=[];s.update.stage="ACCEPTED";s.update.completedAt=null;s.prior.kind="unknown";s.current.members.forEach(x=>x.done=false)};
 const miss=(s)=>{clear(s);s.prior.kind="miss";s.prior.queryAt=85;s.prior.watermark=80;s.prior.attemptEnd=65;s.prior.retentionUntil=150;s.prior.lifecycle="ACTIVE"};
 add("baseline",()=>{},"COMPLETE");
 add("accepted_without_effect",s=>{clear(s)},"STOP_UNKNOWN");
 add("completed_without_effect",s=>{s.receipts=[];s.prior.kind="unknown"},"STOP_UNKNOWN");
 add("validator_rejected",s=>{s.update.validator="REJECTED";s.update.stage="REJECTED"},"RECONCILE");
 add("duplicate_A_replaces_B",s=>{s.receipts[1]={...s.receipts[0],tick:40}},"RECONCILE");
 add("extra_effect_C",s=>{s.receipts.push({...s.receipts[0],effect:"C",tick:42})},"RECONCILE");
 add("wrong_run_receipt",s=>{s.receipts[0].run="run-other"},"RECONCILE");
 add("wrong_update_receipt",s=>{s.receipts[0].update="update-other"},"RECONCILE");
 add("wrong_attempt_receipt",s=>{s.receipts[0].attempt="attempt-2"},"RECONCILE");
 add("wrong_target_receipt",s=>{s.receipts[0].target="target-reborn"},"RECONCILE");
 add("wrong_task_receipt",s=>{s.receipts[0].task="task-other"},"RECONCILE");
 add("wrong_workflow_receipt",s=>{s.receipts[0].workflow="workflow-other"},"RECONCILE");
 add("wrong_approval_receipt",s=>{s.receipts[0].approval="approval-other"},"RECONCILE");
 add("grant_wrong_update_scope",s=>{s.grants[0].update="update-other"},"RECONCILE");
 add("grant_wrong_effect_scope",s=>{s.grants[0].effect="B"},"RECONCILE");
 add("grant_revoked_before_effect",s=>{s.grants[0].revokedAt=20},"RECONCILE");
 add("grant_expired_before_effect",s=>{s.grants[0].until=20},"RECONCILE");
 add("receipt_before_update_accepted",s=>{s.receipts[0].tick=9},"RECONCILE");
 add("receipt_after_update_completed",s=>{s.receipts[1].tick=61},"RECONCILE");
 add("completed_before_accepted",s=>{s.update.completedAt=8},"RECONCILE");
 add("same_count_current_swap",s=>{s.current.members[1]={id:"C",uid:"uid-C",done:true};s.current.guard.members=["A:uid-A","C:uid-C"]},"RECONCILE");
 add("duplicate_current_member",s=>{s.current.members[1]={id:"A",uid:"uid-A",done:true};s.current.guard.members=["A:uid-A","A:uid-A"]},"RECONCILE");
 add("recreated_uid_same_name",s=>{s.current.members[1].uid="uid-B-new"},"RECONCILE");
 add("current_revision_drift",s=>{s.current.revision=9},"RECONCILE");
 add("guard_missing_member",s=>{s.current.guard.members=["A:uid-A"]},"RECONCILE");
 add("guard_extra_member",s=>{s.current.guard.members.push("C:uid-C")},"RECONCILE");
 add("guard_unprotected",s=>{s.current.guard.protected=false},"RECONCILE");
 add("guard_toctou",s=>{s.current.guard.evaluatedAt=85},"RECONCILE");
 add("guard_wrong_target",s=>{s.current.guard.target="target-reborn"},"RECONCILE");
 add("read_before_last_effect",s=>{s.current.readAt=35},"RECONCILE");
 add("positive_receipt_negative_miss_conflict",s=>{s.prior.kind="miss"},"EVIDENCE_CONFLICT");
 add("partial_positive_negative_miss_conflict",s=>{s.receipts=[s.receipts[0]];s.prior.kind="miss"},"EVIDENCE_CONFLICT");
 add("miss_insufficient_watermark",s=>{miss(s);s.prior.watermark=50},"STOP_UNKNOWN");
 add("miss_wrong_attempt",s=>{miss(s);s.prior.attempt="attempt-0"},"STOP_UNKNOWN");
 add("miss_wrong_run",s=>{miss(s);s.prior.run="run-old"},"STOP_UNKNOWN");
 add("miss_wrong_update",s=>{miss(s);s.prior.update="update-old"},"STOP_UNKNOWN");
 add("miss_wrong_target",s=>{miss(s);s.prior.target="target-old"},"STOP_UNKNOWN");
 add("miss_incomplete_effect_set",s=>{miss(s);s.prior.effects=["A"]},"STOP_UNKNOWN");
 add("miss_duplicate_effect_set",s=>{miss(s);s.prior.effects=["A","A"]},"STOP_UNKNOWN");
 add("miss_retention_expired",s=>{miss(s);s.prior.retentionUntil=80},"STOP_UNKNOWN");
 add("miss_lifecycle_pruned",s=>{miss(s);s.prior.lifecycle="PRUNED"},"STOP_UNKNOWN");
 add("miss_query_error",s=>{miss(s);s.prior.kind="error"},"STOP_UNKNOWN");
 add("covered_miss_retry",s=>{miss(s)},"RETRY_ALLOWED");
 add("covered_miss_revoked",s=>{miss(s);s.permission.allowed=false},"BLOCKED");
 add("covered_miss_expired_permission",s=>{miss(s);s.permission.validUntil=80},"BLOCKED");
 add("covered_miss_unprotected_guard",s=>{miss(s);s.current.guard.protected=false},"STOP_UNKNOWN");
 add("covered_miss_guard_wrong_target",s=>{miss(s);s.current.guard.target="target-old"},"STOP_UNKNOWN");
 add("covered_miss_guard_stale_revision",s=>{miss(s);s.current.guard.revision=7},"STOP_UNKNOWN");
 add("permission_revoked_after_historical_completion",s=>{s.permission.allowed=false},"COMPLETE");
 add("grant_revoked_after_effect",s=>{s.grants[0].revokedAt=45},"COMPLETE");
 add("accepted_with_complete_external_evidence",s=>{s.update.stage="ACCEPTED";s.update.completedAt=null},"STOP_UNKNOWN");
 add("current_state_reversed_after_effect",s=>{s.current.members[1].done=false},"RECONCILE");

 add("required_changed_to_A_C_without_current_witness",s=>{s.required=["A","C"];s.receipts[1].effect="C";s.grants[1].effect="C"},"RECONCILE");
 add("grant_wrong_run_scope",s=>{s.grants[0].run="run-other"},"RECONCILE");
 add("grant_wrong_attempt_scope",s=>{s.grants[0].attempt="attempt-old"},"RECONCILE");
 add("grant_wrong_target_scope",s=>{s.grants[0].target="target-old"},"RECONCILE");
 add("grant_duplicate_for_same_effect",s=>{s.grants.push({...s.grants[0]})},"RECONCILE");
 add("receipt_tick_string_coercion",s=>{s.receipts[0].tick="30"},"RECONCILE");
 add("grant_until_string_coercion",s=>{s.grants[0].until="70"},"RECONCILE");
 add("current_revision_string_coercion",s=>{s.current.revision="8";s.current.guard.revision="8"},"RECONCILE");
 add("miss_watermark_string_coercion",s=>{miss(s);s.prior.watermark="80"},"STOP_UNKNOWN");
 add("retry_permission_expires_before_guard_fence",s=>{miss(s);s.permission.validUntil=87},"BLOCKED");
 add("retry_permission_wrong_target",s=>{miss(s);s.permission.target="target-old"},"BLOCKED");
 add("retry_permission_incomplete_effects",s=>{miss(s);s.permission.effects=["A"]},"BLOCKED");
 add("rejected_update_even_with_miss",s=>{miss(s);s.update.validator="REJECTED";s.update.stage="REJECTED"},"BLOCKED");
 add("task_member_witness_extra_entry",s=>{s.requiredMembers.push("C:uid-C")},"RECONCILE");
 return out;
}
function exactUnique(actual,expected){return Array.isArray(actual)&&actual.length===expected.length&&new Set(actual).size===actual.length&&expected.every(x=>actual.includes(x))}

const safeTick=v=>Number.isSafeInteger(v)&&v>=0;
const identityKeys=["task","workflow","run","update","attempt","target"];
const matchingIdentity=(obj,id)=>identityKeys.every(k=>obj[k]===id[k]);
function guardValid(s){
 const c=s.current,memberContract=s.requiredMembers;
 if(!Array.isArray(memberContract)||!exactUnique(s.required,memberContract.map(x=>typeof x==="string"?x.split(":")[0]:null)))return false;
 if(!safeTick(c.revision)||!safeTick(c.guard.revision)||!safeTick(c.readAt)||!safeTick(c.commitAt)||!safeTick(c.guard.evaluatedAt))return false;
 return c.guard.protected===true&&c.target===s.id.target&&c.guard.target===s.id.target&&c.revision===c.guard.revision&&c.guard.evaluatedAt===c.commitAt&&c.readAt<c.commitAt&&exactUnique(c.members.map(m=>m.id+":"+m.uid),memberContract)&&exactUnique(c.guard.members,memberContract);
}
function missValid(s){
 let q=s.prior,i=s.id;
 return q.kind==="miss"&&matchingIdentity(q,i)&&exactUnique(q.effects,s.required)&&q.lifecycle==="ACTIVE"&&[q.watermark,q.queryAt,q.retentionUntil,q.attemptEnd].every(safeTick)&&q.watermark>=q.attemptEnd&&q.queryAt>=q.watermark&&q.queryAt<=q.retentionUntil&&q.retentionUntil>=q.attemptEnd;
}
function validRetryPermission(s){
 const x=s.permission,q=s.prior,c=s.current;
 return x.allowed===true&&matchingIdentity(x,s.id)&&exactUnique(x.effects,s.required)&&safeTick(x.validUntil)&&safeTick(q.queryAt)&&safeTick(c.commitAt)&&x.validUntil>=Math.max(q.queryAt,c.commitAt);
}
function full(s){
 const i=s.id,r=s.receipts,required=s.required,goodMiss=missValid(s),guard=guardValid(s);
 if(goodMiss&&r.length>0)return "EVIDENCE_CONFLICT";
 if(r.length===0){
  if(!goodMiss)return "STOP_UNKNOWN";
  if(s.update.validator!=="ACCEPTED"||!["ACCEPTED","COMPLETED"].includes(s.update.stage)||!validRetryPermission(s))return "BLOCKED";
  return guard?"RETRY_ALLOWED":"STOP_UNKNOWN";
 }
 if(s.update.validator!=="ACCEPTED"||!["ACCEPTED","COMPLETED"].includes(s.update.stage))return "RECONCILE";
 if(!exactUnique(r.map(x=>x.effect),required))return "RECONCILE";
 if(!safeTick(s.update.acceptedAt)||!safeTick(s.update.completedAt))return s.update.stage==="ACCEPTED"?"STOP_UNKNOWN":"RECONCILE";
 for(let x of r){
  if(!matchingIdentity(x,i)||!safeTick(x.tick))return "RECONCILE";
  let grant=s.grants.filter(g=>g.effect===x.effect&&g.approval===x.approval&&matchingIdentity(g,i));
  if(grant.length!==1)return "RECONCILE";
  const g=grant[0];
  if(!safeTick(g.from)||!safeTick(g.until)||(g.revokedAt!==null&&!safeTick(g.revokedAt))||!(x.tick>=g.from&&x.tick<=g.until&&(g.revokedAt===null||x.tick<g.revokedAt)))return "RECONCILE";
  if(!(x.tick>=s.update.acceptedAt&&s.update.stage==="COMPLETED"&&x.tick<=s.update.completedAt))return s.update.stage==="ACCEPTED"?"STOP_UNKNOWN":"RECONCILE";
 }
 if(s.update.stage!=="COMPLETED")return "STOP_UNKNOWN";
 if(!(s.update.acceptedAt<=s.update.completedAt&&s.current.readAt>Math.max(...r.map(x=>x.tick))))return "RECONCILE";
 if(!guard||!s.current.members.every(x=>x.done===true))return "RECONCILE";
 return "COMPLETE";
}
function runProducer(){
 let fixtures=cases(),paths=["accepted_stage_proxy","update_completed_proxy","full_reference"],rows=[];
 for(let f of fixtures){let s=f.primitive;let result=[["accepted_stage_proxy",["ACCEPTED","COMPLETED"].includes(s.update.stage)?"COMPLETE":"RECONCILE"],["update_completed_proxy",s.update.stage==="COMPLETED"?"COMPLETE":"RECONCILE"],["full_reference",full(s)]];for(let [path,decision] of result)rows.push({scenario:f.name,path,decision})}
 let hist={};for(let r of rows.filter(x=>x.path==="full_reference"))hist[r.decision]=(hist[r.decision]||0)+1;
 let diffs={};for(let p of paths.slice(0,2))diffs[p]=fixtures.filter(f=>rows.find(r=>r.scenario===f.name&&r.path===p).decision!==rows.find(r=>r.scenario===f.name&&r.path==="full_reference").decision).length;
 let csv="scenario,path,decision\n"+rows.map(r=>[r.scenario,r.path,r.decision].join(",")).join("\n")+"\n";
 return {fixtures,rows,csv,summary:{scenarios:fixtures.length,paths:paths.length,decisionRows:rows.length,histogram:hist,modelRelativeWeakDisagreements:diffs,modeledReceipts:fixtures.reduce((n,f)=>n+f.primitive.receipts.length,0),realExternalEffects:0}};
}
if(typeof module!=="undefined")module.exports={runProducer};
if(typeof require==="function"&&require.main===module){const fs=require("fs"),path=require("path");const r=runProducer(),dir=path.join(__dirname,"../evidence");fs.writeFileSync(path.join(dir,"2026-10-26-update-stage-scenarios.json"),JSON.stringify(r.fixtures,null,2)+"\n");fs.writeFileSync(path.join(dir,"2026-10-26-update-stage-decisions.csv"),r.csv);console.log(JSON.stringify(r.summary))}
