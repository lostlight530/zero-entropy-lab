"use strict";
const clone = x => JSON.parse(JSON.stringify(x));
function scenarios() {
  const base = {
    task:{id:"task-drain-02",run:"run-02",attempt:1,serviceUID:"svc-01",selector:"old=blue",required:["pod-old-uid-1"],currentPermission:true},
    snapshot:{listRV:40,complete:true,watchContinuous:true,watchCompacted:false,serviceUID:"svc-01",selector:"old=blue",slices:[{uid:"slice-1",rv:40,serviceUID:"svc-01",endpoints:[{uid:"pod-old-uid-1",name:"old-pod",ip:"10.0.0.1",role:"old",ready:false,serving:false,terminating:true},{uid:"pod-new-uid-1",name:"new-pod",ip:"10.0.0.2",role:"new",ready:true,serving:true,terminating:false}]}]},
    receiptQuery:{status:"hit",authority:"synthetic-receipt",scope:"task-drain-02/run-02/1/svc-01/pod-old-uid-1",members:["pod-old-uid-1"],effects:["drain"],lifecycle:"ACTIVE",exact:true,coveredAttempts:[1],watermark:24,queryAt:24,retentionUntil:100},
    receipts:[{effect:"drain",task:"task-drain-02",run:"run-02",attempt:1,uid:"pod-old-uid-1",time:12,grant:"grant-01",grantAuthority:"synthetic-grant"}],
    grant:{id:"grant-01",scope:"pod-old-uid-1",authority:"synthetic-grant",from:5,until:20},
    ledger:{authority:"synthetic-ledger",identity:"ledger-02",scope:"task-drain-02/run-02/1/svc-01/pod-old-uid-1",serviceUID:"svc-01",selector:"old=blue",complete:true,coveredUIDs:["pod-old-uid-1"],inflight:[{uid:"pod-old-uid-1",count:0}],watermark:28,queryAt:28,retentionUntil:100,trafficFence:true},
    guard:{atomic:true,at:30,listRV:40,ledgerIdentity:"ledger-02",serviceUID:"svc-01",selector:"old=blue",members:["pod-old-uid-1"],ledgerWatermark:28}
  };
  const changes = {
    baseline:s=>{},
    terminating_still_serving:s=>{s.snapshot.slices[0].endpoints[0].serving=true;s.ledger.inflight[0].count=1},
    inflight_after_ready_false:s=>{s.ledger.inflight[0].count=2},
    ready_override_positive:s=>{s.snapshot.slices[0].endpoints[0].ready=true},
    replaced_pod_same_name_ip:s=>{s.snapshot.slices[0].endpoints[0].uid="pod-old-uid-2"},
    duplicate_endpoint_uid:s=>{s.snapshot.slices[0].endpoints.push(clone(s.snapshot.slices[0].endpoints[0]))},
    extra_old_endpoint:s=>{s.snapshot.slices[0].endpoints.push({uid:"pod-old-uid-extra",name:"old-extra",ip:"10.0.0.3",role:"old",ready:false,serving:false,terminating:true})},
    incomplete_slice_list:s=>{s.snapshot.complete=false},
    watch_compacted:s=>{s.snapshot.watchContinuous=false;s.snapshot.watchCompacted=true},
    guard_rv_drift:s=>{s.guard.listRV=41},
    guard_not_atomic:s=>{s.guard.atomic=false},
    missing_receipt:s=>{s.receipts=[]},
    wrong_receipt_uid:s=>{s.receipts[0].uid="pod-old-uid-2"},
    duplicate_receipt:s=>{s.receipts.push(clone(s.receipts[0]))},
    extra_receipt:s=>{s.receipts.push({...clone(s.receipts[0]),uid:"pod-extra"})},
    grant_expired_at_effect:s=>{s.receipts[0].time=21},
    grant_not_yet_valid:s=>{s.receipts[0].time=4},
    prior_unknown:s=>{s.receiptQuery.status="unknown"},
    positive_receipt_vs_authoritative_miss:s=>{s.receiptQuery.status="authoritative miss"},
    miss_without_receipt:s=>{s.receiptQuery.status="authoritative miss";s.receipts=[]},
    current_permission_revoked_completed:s=>{s.task.currentPermission=false},
    current_permission_revoked_incomplete:s=>{s.task.currentPermission=false;s.snapshot.slices[0].endpoints[0].serving=true},
    stale_ledger_watermark:s=>{s.ledger.watermark=10},
    incomplete_ledger_coverage:s=>{s.ledger.complete=false},
    duplicate_ledger_member:s=>{s.ledger.inflight.push(clone(s.ledger.inflight[0]))},
    traffic_fence_missing:s=>{s.ledger.trafficFence=false},
    receipt_after_commit:s=>{s.receipts[0].time=31},
    service_uid_drift:s=>{s.guard.serviceUID="svc-02"},
    selector_drift:s=>{s.guard.selector="old=green"},
    extra_ledger_member:s=>{s.ledger.inflight.push({uid:"pod-extra",count:0})},
    missing_query_attempt:s=>{s.receiptQuery.coveredAttempts=[]},
    guard_membership_drift:s=>{s.guard.members=["pod-old-uid-2"]},
    ledger_retention_expired:s=>{s.ledger.retentionUntil=25},
    receipt_query_future_watermark:s=>{s.receiptQuery.watermark=35},
    nil_serving_is_not_drained:s=>{s.snapshot.slices[0].endpoints[0].serving=null},
    old_endpoint_not_terminating:s=>{s.snapshot.slices[0].endpoints[0].terminating=false},
    string_grant_start:s=>{s.grant.from="5"},
    string_receipt_time:s=>{s.receipts[0].time="12"},
    string_ledger_watermark:s=>{s.ledger.watermark="28"}
  };
  return Object.entries(changes).map(([id,fn])=>{const state=clone(base);fn(state);return {id,state}});
}
function observe(s) {
 const x=s.state;
 return {id:s.id,events:[
  {kind:"LIST",snapshot:clone(x.snapshot)},
  {kind:"RECEIPT_QUERY",query:clone(x.receiptQuery),receipts:clone(x.receipts)},
  {kind:"GRANT",grant:clone(x.grant)},
  {kind:"LEDGER_QUERY",ledger:clone(x.ledger)},
  {kind:"COMMIT_ATTEMPT",guard:clone(x.guard),permission:x.task.currentPermission}
 ],task:clone(x.task)};
}
function reference(t) {
 const [list,prior,auth,ledger,commit]=t.events;
 const task=t.task,s=list.snapshot,q=prior.query,rs=prior.receipts,g=auth.grant,l=ledger.ledger,c=commit.guard;
 if(q.status==="authoritative miss"&&rs.length) return "EVIDENCE_CONFLICT";
 const scope=[task.id,task.run,task.attempt,task.serviceUID,...task.required].join("/");
 const exact=(a,b)=>Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&new Set(a).size===a.length&&new Set(b).size===b.length&&a.every(x=>b.includes(x));
 if(q.status!=="hit"||!q.exact||q.authority!=="synthetic-receipt"||!Array.isArray(q.coveredAttempts)||!q.coveredAttempts.includes(task.attempt)||q.watermark>q.queryAt||q.queryAt>q.retentionUntil||q.queryAt>=l.queryAt||q.queryAt>=c.at||q.retentionUntil<c.at||q.lifecycle!=="ACTIVE"||q.scope!==scope||!exact(q.coveredAttempts,[task.attempt])||!exact(q.members,task.required)||!exact(q.effects,["drain"])) return "STOP_UNKNOWN";
 if(![q.watermark,q.queryAt,q.retentionUntil,g.from,g.until,l.watermark,l.queryAt,l.retentionUntil,c.at,c.listRV,s.listRV].every(Number.isSafeInteger)) return "STOP_UNKNOWN";
 if(rs.length!==1) return rs.length===0?"STOP_UNKNOWN":"RECONCILE";
 const r=rs[0];
 if(!Number.isSafeInteger(r.time)) return "STOP_UNKNOWN";
 if(r.effect!=="drain"||r.task!==task.id||r.run!==task.run||r.attempt!==task.attempt||r.uid!==task.required[0]||r.grant!==g.id) return "RECONCILE";
 if(r.time<g.from||r.time>g.until||g.scope!==r.uid||g.authority!=="synthetic-grant"||r.grantAuthority!==g.authority||r.time>q.watermark||r.time>q.queryAt||r.time>c.at) return "BLOCKED";
 if(!s.complete||!s.watchContinuous||s.watchCompacted||!l.complete||l.watermark>l.queryAt||l.queryAt>l.retentionUntil||l.retentionUntil<c.at||l.authority!=="synthetic-ledger"||l.scope!==scope||l.serviceUID!==task.serviceUID||l.selector!==task.selector) return "STOP_UNKNOWN";
 if(!c.atomic||c.at<l.queryAt||c.listRV!==s.listRV||c.serviceUID!==s.serviceUID||c.selector!==s.selector||c.serviceUID!==task.serviceUID||c.selector!==task.selector||c.ledgerWatermark!==l.watermark||c.ledgerIdentity!==l.identity) return "RECONCILE";
 const old=s.slices.flatMap(v=>v.endpoints.filter(e=>e.role==="old"));
 const all=s.slices.flatMap(v=>v.endpoints);
 const unique=arr=>new Set(arr).size===arr.length;
 if(s.slices.some(v=>v.rv!==s.listRV)||!unique(s.slices.map(v=>v.uid))||!unique(all.map(e=>e.uid))||!unique(old.map(e=>e.uid))||!unique(task.required)||!unique(c.members)||!unique(l.coveredUIDs)||!unique(l.inflight.map(e=>e.uid))) return "RECONCILE";
 if(s.slices.some(v=>v.serviceUID!==task.serviceUID)||old.length!==task.required.length||old.some(e=>!task.required.includes(e.uid)||e.ready!==false||e.serving!==false||e.terminating!==true)||c.members.length!==task.required.length||c.members.some(uid=>!task.required.includes(uid))||l.coveredUIDs.length!==task.required.length||l.coveredUIDs.some(uid=>!task.required.includes(uid))||l.inflight.length!==task.required.length||l.inflight.some(e=>!task.required.includes(e.uid)||e.count!==0)||!l.trafficFence) return "RECONCILE";
 return "COMPLETE";
}
function produce() {
 const cases=scenarios(),traces=cases.map(observe),decisions=[];
 for(const t of traces) {
  const old=t.events[0].snapshot.slices.flatMap(v=>v.endpoints.filter(e=>e.role==="old"));
  decisions.push({id:t.id,path:"ready_proxy",decision:old.every(e=>e.ready===false)?"COMPLETE":"RECONCILE"});
  decisions.push({id:t.id,path:"snapshot_proxy",decision:old.length===t.task.required.length&&old.every(e=>e.serving===false)?"COMPLETE":"RECONCILE"});
  decisions.push({id:t.id,path:"full_reference",decision:reference(t)});
 }
 return {scenarios:cases,traces,decisions};
}
if(typeof module!=="undefined")module.exports={scenarios,observe,reference,produce};
