"use strict";
function produceAzure(){
 const c={task:"task28",run:"run28",attempt:"attempt1",source:"src28",sourceETag:"src-etag7",target:"dst28",incarnation:"dst-uid28",copyId:"copy28",members:[{member:"A",uid:"uidA",effectId:"effectA"},{member:"B",uid:"uidB",effectId:"effectB"}]};
 const rec=(m,u,e,t)=>({member:m,uid:u,effectId:e,task:c.task,run:c.run,attempt:c.attempt,target:c.target,incarnation:c.incarnation,copyId:c.copyId,approval:"approval28",at:t});
 const a=rec("A","uidA","effectA",75),b=rec("B","uidB","effectB",80),grant=r=>({...r,from:10,until:90,revokedAt:null});
 const baseline={id:"baseline",context:c,copy:{http:202,status:"success",copyId:c.copyId,source:c.source,target:c.target,incarnation:c.incarnation,sourceETag:c.sourceETag,sourceChanged:false,statusProof:true,startedAt:20,finishedAt:70,observedAt:85,exists:true,etag:"dst-etag9",expectedETag:"dst-etag9",size:128,expectedSize:128,digest:"fixture-digest",expectedDigest:"fixture-digest",metadata:true,authority:"completed"},receipts:[a,b],grants:[grant(a),grant(b)],prior:{state:"hit",complete:true,query:{task:c.task,run:c.run,attempt:c.attempt,target:c.target,incarnation:c.incarnation,copyId:c.copyId,effects:["effectA","effectB"],at:88,watermark:85,attemptEnd:80,retentionUntil:150,lifecycle:"ACTIVE"}},permission:{allowed:true,until:140,revokedAt:null},current:{target:c.target,incarnation:c.incarnation,members:[{member:"A",uid:"uidA",done:true},{member:"B",uid:"uidB",done:true}],predicate:"DONE",revision:7,guardRevision:7,commitRevision:7,readAt:90,guardAt:95,commitAt:100,protected:true}};
 const cases=[],add=(id,set)=>cases.push({id,set}),none={receipts:[],grants:[]},notDone={"current.predicate":"PENDING","current.members":[{member:"A",uid:"uidA",done:false},{member:"B",uid:"uidB",done:false}]};
 add("pending",{...none,...notDone,"copy.status":"pending","copy.finishedAt":null,"prior.state":"unknown"});
 add("pending_with_receipts",{"copy.status":"pending","copy.finishedAt":null});
 add("accepted_without_receipts",{...none,...notDone,"prior.state":"unknown"});
 add("aborted_zero",{...none,...notDone,"copy.status":"aborted","copy.size":0,"prior.state":"unknown"});
 add("missing_b",{receipts:[a]});
 add("duplicate_a",{receipts:[a,a]});
 add("extra_c",{receipts:[a,b,rec("C","uidC","effectC",82)]});
 add("same_count_swap",{receipts:[a,rec("C","uidC","effectC",80)]});
 add("wrong_copy_receipt",{receipts:[{...a,copyId:"old"},b]});
 add("wrong_run_receipt",{receipts:[{...a,run:"old"},b]});
 add("wrong_incarnation_receipt",{receipts:[{...a,incarnation:"old"},b]});
 add("source_changed",{"copy.sourceChanged":true});
 add("source_identity_drift",{"copy.source":"wrong-source"});
 add("destination_identity_drift",{"copy.target":"wrong-destination"});
 add("copy_incarnation_drift",{"copy.incarnation":"wrong-incarnation"});
 add("source_etag_drift",{"copy.sourceETag":"old"});
 add("destination_etag_drift",{"copy.etag":"old"});
 add("destination_digest_drift",{"copy.digest":"old"});
 add("destination_size_drift",{"copy.size":0});
 add("status_copy_id_drift",{"copy.copyId":"old"});
 add("status_proof_missing",{"copy.statusProof":false});
 add("status_before_finish",{"copy.observedAt":69});
 add("effect_before_copy",{receipts:[{...a,at:60},b]});
 add("grant_revoked", {grants:[{...grant(a),revokedAt:74},grant(b)]});
 add("grant_wrong_approval",{grants:[{...grant(a),approval:"other"},grant(b)]});
 add("current_member_swap",{"current.members":[{member:"A",uid:"uidA",done:true},{member:"C",uid:"uidC",done:true}]});
 add("current_uid_swap",{"current.members":[{member:"A",uid:"uidA",done:true},{member:"B",uid:"uidB2",done:true}]});
 add("current_incarnation_drift",{"current.incarnation":"new"});
 add("guard_drift",{"current.guardRevision":8});
 add("unprotected_guard",{"current.protected":false});
 add("commit_drift",{"current.commitRevision":8});
 add("prior_unknown",{"prior.state":"unknown"});
 add("prior_wrong_run",{"prior.query.run":"old"});
 add("prior_wrong_effect_set",{"prior.query.effects":["effectA","effectC"]});
 add("journal_incomplete",{"prior.complete":false});
 add("positive_miss_conflict",{"prior.state":"miss"});
 add("current_permission_revoked",{"permission.allowed":false,"permission.revokedAt":89});
 add("fractional_receipt",{receipts:[{...a,at:75.5},b]});
 add("fractional_watermark",{"prior.query.watermark":85.5});
 const retry={...none,...notDone,"copy.status":"failed","copy.exists":false,"copy.size":0,"copy.authority":"authoritative_failed","prior.state":"miss"};
 add("retry_authoritative_miss",retry);
 add("retry_permission_revoked",{...retry,"permission.allowed":false});
 add("retry_uncovered",{...retry,"prior.query.watermark":70});
 add("retry_retention_expired",{...retry,"prior.query.retentionUntil":80});
 add("retry_pending",{...retry,"copy.status":"pending","copy.finishedAt":null,"copy.authority":"unknown"});
 add("retry_guard_drift",{...retry,"current.guardRevision":8});
 const cp=x=>JSON.parse(JSON.stringify(x)),scenarios=[cp(baseline)];
 for(const row of cases){const s=cp(baseline);s.id=row.id;for(const [path,value]of Object.entries(row.set)){const keys=path.split(".");let node=s;for(const key of keys.slice(0,-1))node=node[key];node[keys[keys.length-1]]=cp(value)}scenarios.push(s)}
 const nat=x=>Number.isSafeInteger(x)&&x>=0,eq=(x,y)=>JSON.stringify(x)===JSON.stringify(y);
 function scope(s){const q=s.prior.query,k=s.context;return q.task===k.task&&q.run===k.run&&q.attempt===k.attempt&&q.target===k.target&&q.incarnation===k.incarnation&&q.copyId===k.copyId&&eq(q.effects,k.members.map(x=>x.effectId))&&q.lifecycle==="ACTIVE"&&[q.at,q.watermark,q.attemptEnd,q.retentionUntil].every(nat)&&q.watermark>=q.attemptEnd&&q.at>=q.watermark&&q.retentionUntil>=q.at}
 function guard(s){const w=s.current,k=s.context;return w.target===k.target&&w.incarnation===k.incarnation&&w.protected===true&&[w.revision,w.guardRevision,w.commitRevision,w.readAt,w.guardAt,w.commitAt].every(nat)&&w.revision===w.guardRevision&&w.revision===w.commitRevision&&w.readAt<=w.guardAt&&w.guardAt<=w.commitAt}
 function full(s){
  const k=s.context,x=s.copy,r=s.receipts,w=s.current,q=s.prior;
  if(![x.startedAt,x.observedAt,w.readAt,w.guardAt,w.commitAt].every(nat)||x.copyId!==k.copyId||x.source!==k.source||x.target!==k.target||x.incarnation!==k.incarnation||x.sourceETag!==k.sourceETag||x.sourceChanged===true)return "RECONCILE";
  if(x.http!==202||x.statusProof!==true)return "STOP_UNKNOWN";
  if(q.state==="miss"&&r.length&&scope(s))return "EVIDENCE_CONFLICT";
  if(q.state==="unknown"||!scope(s)||q.complete!==true)return "STOP_UNKNOWN";
  if(!r.length){if(q.state!=="miss"||x.status!=="failed"||x.authority!=="authoritative_failed"||x.exists!==false||x.size!==0||w.predicate!=="PENDING")return "STOP_UNKNOWN";if(!guard(s))return "RECONCILE";const p=s.permission;return p.allowed===true&&nat(p.until)&&p.until>=w.commitAt&&(p.revokedAt===null||(nat(p.revokedAt)&&p.revokedAt>w.commitAt))?"RETRY_ALLOWED":"BLOCKED"}
  if(q.state!=="hit")return "STOP_UNKNOWN";
  if(x.status!=="success"||!nat(x.finishedAt)||x.finishedAt<x.startedAt||x.observedAt<x.finishedAt||w.readAt<x.observedAt||x.exists!==true)return "STOP_UNKNOWN";
  if(!nat(x.size)||!nat(x.expectedSize)||x.size!==x.expectedSize||x.etag!==x.expectedETag||x.digest!==x.expectedDigest)return "RECONCILE";
  if(r.length!==k.members.length||new Set(r.map(x=>x.effectId)).size!==r.length)return "RECONCILE";
  for(const m of k.members){const a=r.find(x=>x.effectId===m.effectId);if(!a||a.member!==m.member||a.uid!==m.uid||a.task!==k.task||a.run!==k.run||a.attempt!==k.attempt||a.target!==k.target||a.incarnation!==k.incarnation||a.copyId!==k.copyId||a.approval!=="approval28"||!nat(a.at)||a.at<x.finishedAt||a.at>w.readAt)return "RECONCILE";const gs=s.grants.filter(x=>x.effectId===a.effectId);if(gs.length!==1)return "RECONCILE";const g=gs[0];if(!["member","uid","task","run","attempt","target","incarnation","copyId","approval"].every(f=>g[f]===a[f])||!nat(g.from)||!nat(g.until)||g.from>a.at||a.at>=g.until||(g.revokedAt!==null&&(!nat(g.revokedAt)||g.revokedAt<=a.at)))return "RECONCILE"}
  if(!guard(s)||w.predicate!=="DONE"||w.members.length!==k.members.length)return "RECONCILE";
  for(const m of k.members)if(w.members.filter(x=>x.member===m.member&&x.uid===m.uid&&x.done===true).length!==1)return "RECONCILE";
  return "COMPLETE";
 }
 const decisions=scenarios.flatMap(s=>[{scenario:s.id,path:"http_proxy",decision:s.copy.http===202?"COMPLETE":"STOP_UNKNOWN"},{scenario:s.id,path:"copy_status_proxy",decision:s.copy.status==="success"?"COMPLETE":"STOP_UNKNOWN"},{scenario:s.id,path:"full_reference",decision:full(s)}]);
 const csv=["scenario,path,decision",...decisions.map(x=>[x.scenario,x.path,x.decision].join(","))].join("\n")+"\n";
 return {pack:{schema:"ballast.azure-copy.deltas/1",baseline,cases},scenarios,decisions,csv};
}
if(typeof module!=="undefined"){module.exports={produceAzure};if(require.main===module){const x=produceAzure();console.log(JSON.stringify({scenarios:x.scenarios.length,decisions:x.decisions.length}));}}
