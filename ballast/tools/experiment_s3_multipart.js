"use strict";
const run = function produce(){
  "use strict";
  const copy=x=>JSON.parse(JSON.stringify(x));
  const parts=[{number:1,identity:"A@1",etag:"etag-a1"},{number:2,identity:"B@1",etag:"etag-b1"}];
  const base={
    target:{task:"publish-task-24",inc:"target-inc-24",bucket:"lab-bucket",key:"artifact.bin",revision:7,effectId:"publish-effect-24",requiredParts:parts},
    permission:true,
    response:{status:200,body:"result",attempt:"attempt-2",uploadId:"upload-2",partCount:2},
    journal:[{task:"publish-task-24",inc:"target-inc-24",effectId:"publish-effect-24",bucket:"lab-bucket",key:"artifact.bin",uploadId:"upload-1",attempt:"attempt-1",version:"version-1",parts:copy(parts),authorized:true,committedAt:30}],
    prior:{state:"hit",task:"publish-task-24",inc:"target-inc-24",effectId:"publish-effect-24",authority:true,exact:true,oldAttemptEnd:40,watermark:60,queriedAt:70,retentionThrough:120,lifecycle:"active"},
    readback:{task:"publish-task-24",inc:"target-inc-24",bucket:"lab-bucket",key:"artifact.bin",version:"version-1",parts:copy(parts),readAt:75},
    guard:{task:"publish-task-24",inc:"target-inc-24",revision:7,bucket:"lab-bucket",key:"artifact.bin",effectId:"publish-effect-24",version:"version-1",parts:copy(parts),protected:true,committedAt:90}
  };
  const scenarios=[];
  function add(id,mutate){const s=copy(base);s.id=id;mutate(s);scenarios.push(s)}
  const absent=s=>{s.journal=[];s.readback=null;s.prior.state="unknown"};
  add("baseline",()=>{});
  add("http200_error_no_effect",s=>{absent(s);s.response.body="error"});
  add("http200_malformed_no_effect",s=>{absent(s);s.response.body="malformed"});
  add("http200_result_no_effect",s=>{absent(s)});
  add("lost_response_prior_effect",s=>{s.response.body="lost";s.response.status=null});
  add("same_count_part_swap",s=>{s.journal[0].parts[1]={number:2,identity:"C@1",etag:"etag-c1"};s.readback.parts=copy(s.journal[0].parts)});
  add("duplicate_part_identity",s=>{s.journal[0].parts[1]=copy(s.journal[0].parts[0]);s.readback.parts=copy(s.journal[0].parts)});
  add("extra_part",s=>{s.journal[0].parts.push({number:3,identity:"C@1",etag:"etag-c1"});s.readback.parts=copy(s.journal[0].parts)});
  add("missing_part",s=>{s.journal[0].parts.pop();s.readback.parts=copy(s.journal[0].parts)});
  add("wrong_part_etag",s=>{s.journal[0].parts[1].etag="etag-b2";s.readback.parts=copy(s.journal[0].parts)});
  add("part_order_reversed",s=>{s.journal[0].parts.reverse();s.readback.parts=copy(s.journal[0].parts)});
  add("journal_wrong_task",s=>{s.journal[0].task="other-task"});
  add("journal_wrong_incarnation",s=>{s.journal[0].inc="old-inc"});
  add("journal_wrong_upload_identity",s=>{s.journal[0].uploadId=""});
  add("journal_wrong_effect_identity",s=>{s.journal[0].effectId="other-effect"});
  add("historically_unauthorized",s=>{s.journal[0].authorized=false});
  add("effect_after_readback",s=>{s.journal[0].committedAt=80});
  add("readback_after_guard",s=>{s.readback.readAt=100});
  add("readback_wrong_version",s=>{s.readback.version="version-2"});
  add("readback_wrong_key",s=>{s.readback.key="other.bin"});
  add("readback_wrong_incarnation",s=>{s.readback.inc="old-inc"});
  add("guard_stale_revision",s=>{s.guard.revision=6});
  add("guard_unprotected",s=>{s.guard.protected=false});
  add("guard_same_count_swap",s=>{s.guard.parts[1]={number:2,identity:"C@1",etag:"etag-c1"}});
  add("duplicate_journal_effect",s=>{s.journal.push(copy(s.journal[0]))});
  add("extra_journal_effect",s=>{const j=copy(s.journal[0]);j.effectId="unexpected";s.journal.push(j)});
  add("covered_miss_conflicts_positive",s=>{s.prior.state="miss"});
  add("covered_hit_without_journal",s=>{s.journal=[];s.readback=null});
  add("unknown_no_journal",s=>{absent(s)});
  add("uncovered_miss_no_journal",s=>{absent(s);s.prior.state="miss";s.prior.watermark=10});
  add("covered_miss_retry",s=>{absent(s);s.prior.state="miss"});
  add("covered_miss_revoked",s=>{absent(s);s.prior.state="miss";s.permission=false});
  add("covered_miss_permission_unknown",s=>{absent(s);s.prior.state="miss";s.permission=null});
  add("covered_miss_unprotected_guard",s=>{absent(s);s.prior.state="miss";s.guard.protected=false});
  add("covered_miss_stale_revision",s=>{absent(s);s.prior.state="miss";s.guard.revision=6});
  add("expired_retention_miss",s=>{absent(s);s.prior.state="miss";s.prior.retentionThrough=65});
  add("wrong_scope_miss",s=>{absent(s);s.prior.state="miss";s.prior.effectId="other-effect"});
  add("same_key_new_incarnation",s=>{s.target.inc="target-inc-25";s.guard.inc="target-inc-25";s.readback.inc="target-inc-25"});
  add("revoked_after_authorized_effect",s=>{s.permission=false});
  add("http200_error_but_prior_effect_valid",s=>{s.response.body="error"});
  add("readback_missing_with_journal",s=>{s.readback=null});
  add("readback_wrong_bucket",s=>{s.readback.bucket="other-bucket"});
  add("readback_parts_extra",s=>{s.readback.parts.push({number:3,identity:"C@1",etag:"etag-c1"})});
  add("guard_wrong_task",s=>{s.guard.task="other-task"});
  add("guard_wrong_incarnation",s=>{s.guard.inc="old-inc"});
  add("prior_hit_wrong_effect_scope",s=>{s.prior.effectId="other-effect"});
  add("http409_with_prior_valid",s=>{s.response.status=409;s.response.body="error"});
  add("miss_query_lifecycle_unknown",s=>{absent(s);s.prior.state="miss";s.prior.lifecycle="expired"});
  add("miss_query_not_authoritative",s=>{absent(s);s.prior.state="miss";s.prior.authority=false});
  add("nonfinite_effect_time",s=>{s.journal[0].committedAt="NaN"});
  add("duplicate_guard_member",s=>{s.guard.parts[1]=copy(s.guard.parts[0])});
  add("journal_wrong_bucket",s=>{s.journal[0].bucket="other-bucket"});
  add("journal_wrong_key",s=>{s.journal[0].key="other.bin"});
  add("journal_missing_scope",s=>{delete s.journal[0].bucket;delete s.journal[0].key});
  add("guard_wrong_bucket",s=>{s.guard.bucket="other-bucket"});
  add("guard_wrong_key",s=>{s.guard.key="other.bin"});
  add("guard_missing_scope",s=>{delete s.guard.bucket;delete s.guard.key});
  add("journal_version_missing",s=>{delete s.journal[0].version;delete s.readback.version});
  add("coherent_duplicate_required_parts",s=>{const p=copy(s.target.requiredParts[0]);s.target.requiredParts[1]=copy(p);s.journal[0].parts[1]=copy(p);s.readback.parts[1]=copy(p);s.guard.parts[1]=copy(p)});
  add("coherent_reordered_required_parts",s=>{s.target.requiredParts.reverse();s.journal[0].parts.reverse();s.readback.parts.reverse();s.guard.parts.reverse()});
  const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
  const validParts=xs=>Array.isArray(xs)&&xs.length>0&&xs.every((p,i)=>p&&Number.isInteger(p.number)&&p.number>0&&(i===0||xs[i-1].number<p.number)&&typeof p.identity==="string"&&p.identity.length>0&&typeof p.etag==="string"&&p.etag.length>0)&&new Set(xs.map(p=>p.identity)).size===xs.length;
  const validTarget=t=>!!t&&["task","inc","bucket","key","effectId"].every(k=>typeof t[k]==="string"&&t[k].length>0)&&Number.isInteger(t.revision)&&validParts(t.requiredParts);
  const validGuard=s=>validTarget(s.target)&&s.guard&&s.guard.protected===true&&s.guard.task===s.target.task&&s.guard.inc===s.target.inc&&s.guard.revision===s.target.revision&&s.guard.bucket===s.target.bucket&&s.guard.key===s.target.key&&s.guard.effectId===s.target.effectId&&typeof s.guard.version==="string"&&s.guard.version.length>0&&eq(s.guard.parts,s.target.requiredParts)&&Number.isFinite(s.guard.committedAt);
  const covered=s=>{const p=s.prior;return p&&p.authority===true&&p.exact===true&&p.task===s.target.task&&p.inc===s.target.inc&&p.effectId===s.target.effectId&&p.lifecycle==="active"&&[p.oldAttemptEnd,p.watermark,p.queriedAt,p.retentionThrough].every(Number.isFinite)&&p.watermark>=p.oldAttemptEnd&&p.queriedAt>=p.watermark&&p.retentionThrough>=p.queriedAt};
  function reference(s){
    const has=s.journal.length>0;
    if(has&&s.prior.state==="miss"&&covered(s))return "EVIDENCE_CONFLICT";
    if(!has){
      if(s.prior.state==="hit"&&covered(s))return "EVIDENCE_CONFLICT";
      if(!validGuard(s)||s.prior.state!=="miss"||!covered(s))return "STOP_UNKNOWN";
      return s.permission===true?"RETRY_ALLOWED":s.permission===false?"BLOCKED":"STOP_UNKNOWN";
    }
    if(s.journal.length!==1||!validGuard(s))return "RECONCILE";
    const j=s.journal[0],h=s.readback,t=s.target;
    if(j.task!==t.task||j.inc!==t.inc||j.effectId!==t.effectId||j.bucket!==t.bucket||j.key!==t.key||typeof j.version!=="string"||j.version.length===0||s.guard.version!==j.version||typeof j.uploadId!=="string"||!j.uploadId||j.authorized!==true||!eq(j.parts,t.requiredParts)||!Number.isFinite(j.committedAt))return "RECONCILE";
    if(!h||h.task!==t.task||h.inc!==t.inc||h.bucket!==t.bucket||h.key!==t.key||h.version!==j.version||!eq(h.parts,t.requiredParts)||!Number.isFinite(h.readAt)||j.committedAt>h.readAt||h.readAt>s.guard.committedAt)return "RECONCILE";
    return "COMPLETE";
  }
  function statusProxy(s){return s.response.status===200&&s.response.partCount===s.target.requiredParts.length?"COMPLETE":"RETRY_ALLOWED"}
  function keyCountProxy(s){return s.response.body==="result"&&s.readback&&s.readback.key===s.target.key&&s.readback.parts.length===s.target.requiredParts.length?"COMPLETE":"RETRY_ALLOWED"}
  const paths=["status_200_proxy","key_count_proxy","full_reference"];
  const decisions=[];
  for(const s of scenarios){const vals=[statusProxy(s),keyCountProxy(s),reference(s)];for(let i=0;i<3;i++)decisions.push({scenario:s.id,path:paths[i],decision:vals[i]})}
  const histogram={},disagreements={status_200_proxy:0,key_count_proxy:0};
  for(let i=0;i<scenarios.length;i++){const a=decisions.slice(i*3,i*3+3);histogram[a[2].decision]=(histogram[a[2].decision]||0)+1;if(a[0].decision!==a[2].decision)disagreements.status_200_proxy++;if(a[1].decision!==a[2].decision)disagreements.key_count_proxy++}
  const csv="scenario,path,decision\n"+decisions.map(x=>`${x.scenario},${x.path},${x.decision}`).join("\n")+"\n";
  return {scenarios,decisions,csv,histogram,disagreements,paths,model:"synthetic S3 multipart publish / protected manifest",realExternalEffects:0};
};
if (typeof module !== "undefined") module.exports = {run};
if (typeof require !== "undefined" && require.main === module) {
  const result = run();
  process.stdout.write(JSON.stringify({scenarios:result.scenarios,decisions:result.decisions,histogram:result.histogram,disagreements:result.disagreements})+"\n");
}
