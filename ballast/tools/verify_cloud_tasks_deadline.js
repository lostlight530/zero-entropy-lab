"use strict";
const fs=require("node:fs");
if(process.argv.length<4)throw Error("usage: node verify_cloud_tasks_deadline.js fixture.json decisions.json");
const result=(function verifier(pack,rows){
const C=x=>JSON.parse(JSON.stringify(x)), integer=x=>typeof x==="number"&&Number.isSafeInteger(x)&&x>=0, key=x=>x.map(z=>z.id+"|"+z.uid).sort(),same=(a,b)=>a.length===b.length&&a.every((v,i)=>v===b[i]),uniq=x=>new Set(x).size===x.length,fail=x=>{throw Error("VERIFIER_REJECT "+x)};
if(pack.schema!=="ballast.cloud-tasks-deadline-fixtures/1"||pack.logicalDate!=="2026-10-29"||!Array.isArray(pack.cases))fail("pack");
const seen=new Set(),facts=[];
for(const entry of pack.cases){if(typeof entry.id!=="string"||!entry.id||seen.has(entry.id))fail("duplicate scenario");seen.add(entry.id);const s=C(pack.base);for(const [path,value] of Object.entries(entry.changes)){const a=path.split(".");if(!["task","dispatch","prior","receipts","grant","permission","completion"].includes(a[0])||a.some(x=>!x||["__proto__","constructor","prototype"].includes(x)))fail("unsafe patch");let obj=s;for(const b of a.slice(0,-1)){if(obj==null||!Object.prototype.hasOwnProperty.call(obj,b))fail("patch path");obj=obj[b]}const last=a.at(-1);if(obj==null||(Array.isArray(obj)?(!/^\d+$/.test(last)||+last>obj.length):!Object.prototype.hasOwnProperty.call(obj,last)))fail("patch leaf");obj[last]=C(value)}facts.push({id:entry.id,s})}
function reference(s){
const {task:t,dispatch:d,prior:h,receipts:r,grant:g,permission:p,completion:c}=s,q=h.query;
if(!Array.isArray(r)||!Array.isArray(t.required)||!Array.isArray(c.members)||![t.attempt,d.deadline,d.retryAt,d.oldFence.tick,c.readAt,c.guardAt,c.commitAt,c.revision,c.observedRevision,c.guardRevision,p.guardAt,g.from,g.to].every(integer))return "STOP_UNKNOWN";
const covered=q.complete===true&&q.lifecycle==="ACTIVE"&&q.task===t.id&&q.run===t.run&&q.queue===t.queue&&q.inc===t.inc&&q.targetUid===t.targetUid&&same(q.required,key(t.required).map(x=>x.replace("|",":")))&&same(q.attempts,[1,2])&&[q.watermark,q.queryAt,q.retentionUntil].every(integer)&&q.watermark>=d.retryAt&&q.queryAt>=q.watermark&&q.retentionUntil>=q.queryAt;
if(h.kind==="miss"&&covered&&r.length)return "EVIDENCE_CONFLICT";
if(!covered||(h.kind!=="hit"&&h.kind!=="miss"))return "STOP_UNKNOWN";
if(d.oldFence.protected!==true||d.oldFence.tick<d.deadline||d.oldFence.tick>d.retryAt)return "STOP_UNKNOWN";
const required=key(t.required),observed=key(r),members=key(c.members);
if(!r.length){if(h.kind!=="miss")return "STOP_UNKNOWN";if(p.valid!==true)return "BLOCKED";if(p.protected!==true||p.guardAt<=q.queryAt||p.guardAt>=c.commitAt)return "STOP_UNKNOWN";if(c.targetUid!==t.targetUid||!uniq(required)||!uniq(members)||!same(members,required))return "RECONCILE";return "RETRY_ALLOWED"}
if(h.kind!=="hit")return "STOP_UNKNOWN";
if(!uniq(required)||!uniq(observed)||!uniq(members)||!same(observed,required))return "RECONCILE";
for(const x of r){if(!integer(x.effectAt)||!integer(x.attempt)||x.task!==t.id||x.run!==t.run||x.attempt!==t.attempt||x.inc!==t.inc||x.targetUid!==t.targetUid||x.grant!==g.id||x.effectAt<=d.retryAt||x.effectAt>q.watermark||x.effectAt>=c.commitAt)return "RECONCILE";if(x.effectAt<g.from||x.effectAt>g.to||(g.revokedAt!==null&&(!integer(g.revokedAt)||g.revokedAt<=x.effectAt)))return "BLOCKED"}
if(c.targetUid!==t.targetUid||!same(members,required)||c.state!=="satisfied"||c.predicateComplete!==true||c.guardProtected!==true||c.revision!==c.observedRevision||c.revision!==c.guardRevision||!(c.readAt<c.guardAt&&c.guardAt<c.commitAt)||c.guardAt<Math.max(...r.map(x=>x.effectAt)))return "RECONCILE";
return "COMPLETE"}
if(!Array.isArray(rows)||rows.length!==facts.length*3)fail("row count");
const paths=["http_proxy","name_proxy","full_reference"],hist={};let disagreements=[0,0];
for(let i=0;i<facts.length;i++){const {id,s}=facts[i],expect=[s.dispatch.lastHttp>=200&&s.dispatch.lastHttp<300?"COMPLETE":"STOP_UNKNOWN",s.dispatch.nameDedupRejected&&s.dispatch.nameAgeHours<=24?"COMPLETE":"STOP_UNKNOWN",reference(s)];for(let j=0;j<3;j++){const row=rows[3*i+j];if(!row||row.scenario!==id||row.path!==paths[j]||row.decision!==expect[j])fail("row "+id+"/"+paths[j])}hist[expect[2]]=(hist[expect[2]]||0)+1;for(let j=0;j<2;j++)if(expect[j]!==expect[2])disagreements[j]++}
const positives=["baseline","grant_revoked_after_effect","name_window_expired","http_503_but_completed","current_permission_revoked_after_effect"];
for(const id of positives)if(rows.find(x=>x.scenario===id&&x.path==="full_reference")?.decision!=="COMPLETE")fail("positive "+id);
const negatives=rows.filter(x=>x.path==="full_reference"&&!positives.includes(x.scenario));if(negatives.some(x=>x.decision==="COMPLETE"))fail("negative controls");
for(const [id,value] of [["miss_covered_safe_retry","RETRY_ALLOWED"],["prior_miss_positive_conflict","EVIDENCE_CONFLICT"],["miss_revoked_permission","BLOCKED"],["prior_unknown","STOP_UNKNOWN"],["same_count_A_C","RECONCILE"]])if(rows.find(x=>x.scenario===id&&x.path==="full_reference")?.decision!==value)fail("probe "+id);
return {scenarios:facts.length,rows:rows.length,hist,positive:positives.length,negative:negatives.length,exactProbes:5,disagreements:{http_proxy:disagreements[0],name_proxy:disagreements[1]},independence:{implementation:"PARTIAL",dataSource:"NONE",semanticContract:"SHARED",authority:"NONE"}}
})(JSON.parse(fs.readFileSync(process.argv[2],"utf8")),JSON.parse(fs.readFileSync(process.argv[3],"utf8")));
process.stdout.write(JSON.stringify(result,null,2)+"\n");
