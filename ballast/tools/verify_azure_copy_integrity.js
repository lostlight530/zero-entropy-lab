"use strict";
function expandAzure(pack){
 if(!pack||pack.schema!=="ballast.azure-copy.deltas/1"||!pack.baseline||pack.baseline.id!=="baseline"||!Array.isArray(pack.cases))throw Error("PACK_SCHEMA");
 const cp=x=>JSON.parse(JSON.stringify(x)),out=[cp(pack.baseline)],ids=new Set(["baseline"]);
 for(const row of pack.cases){if(!row||typeof row.id!=="string"||!/^[a-z0-9_]+$/.test(row.id)||ids.has(row.id)||!row.set||typeof row.set!=="object"||Array.isArray(row.set))throw Error("PACK_CASE");ids.add(row.id);const s=cp(pack.baseline);s.id=row.id;
  for(const [path,value]of Object.entries(row.set)){const keys=path.split(".");if(keys.some(k=>!/^[_a-zA-Z0-9]+$/.test(k)||["id","__proto__","prototype","constructor"].includes(k)))throw Error("PACK_PATH");let ptr=s;for(const k of keys.slice(0,-1)){if(!ptr||typeof ptr!=="object"||!Object.prototype.hasOwnProperty.call(ptr,k))throw Error("PACK_PARENT");ptr=ptr[k]}const leaf=keys[keys.length-1];if(!ptr||typeof ptr!=="object"||!Object.prototype.hasOwnProperty.call(ptr,leaf))throw Error("PACK_LEAF");ptr[leaf]=cp(value)}
  out.push(s)}
 return out;
}
function verifyAzure(pack,csv){
 const scenarios=expandAzure(pack),nat=x=>typeof x==="number"&&Number.isSafeInteger(x)&&x>=0,eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
 function covered(s){const q=s.prior.query,c=s.context;return q.task===c.task&&q.run===c.run&&q.attempt===c.attempt&&q.target===c.target&&q.incarnation===c.incarnation&&q.copyId===c.copyId&&eq(q.effects,c.members.map(m=>m.effectId))&&q.lifecycle==="ACTIVE"&&[q.at,q.watermark,q.attemptEnd,q.retentionUntil].every(nat)&&q.watermark>=q.attemptEnd&&q.at>=q.watermark&&q.retentionUntil>=q.at}
 function current(s){const w=s.current,c=s.context;return w.target===c.target&&w.incarnation===c.incarnation&&w.protected===true&&[w.revision,w.guardRevision,w.commitRevision,w.readAt,w.guardAt,w.commitAt].every(nat)&&w.revision===w.guardRevision&&w.guardRevision===w.commitRevision&&w.readAt<=w.guardAt&&w.guardAt<=w.commitAt}
 function reference(s){
  const c=s.context,b=s.copy,r=s.receipts,q=s.prior,w=s.current;
  if([b.startedAt,b.observedAt,w.readAt,w.guardAt,w.commitAt].some(x=>!nat(x))||b.copyId!==c.copyId||b.source!==c.source||b.target!==c.target||b.incarnation!==c.incarnation||b.sourceETag!==c.sourceETag||b.sourceChanged===true)return "RECONCILE";
  if(b.http!==202||b.statusProof!==true)return "STOP_UNKNOWN";
  const scope=covered(s);
  if(q.state==="miss"&&r.length>0&&scope)return "EVIDENCE_CONFLICT";
  if(q.state==="unknown"||!scope||q.complete!==true)return "STOP_UNKNOWN";
  if(r.length===0){if(q.state!=="miss"||b.status!=="failed"||b.authority!=="authoritative_failed"||b.exists!==false||b.size!==0||w.predicate!=="PENDING")return "STOP_UNKNOWN";if(!current(s))return "RECONCILE";const p=s.permission;return p.allowed===true&&nat(p.until)&&p.until>=w.commitAt&&(p.revokedAt===null||(nat(p.revokedAt)&&p.revokedAt>w.commitAt))?"RETRY_ALLOWED":"BLOCKED"}
  if(q.state!=="hit")return "STOP_UNKNOWN";
  if(b.status!=="success"||!nat(b.finishedAt)||b.finishedAt<b.startedAt||b.observedAt<b.finishedAt||w.readAt<b.observedAt||b.exists!==true)return "STOP_UNKNOWN";
  if(!nat(b.size)||!nat(b.expectedSize)||b.size!==b.expectedSize||b.etag!==b.expectedETag||b.digest!==b.expectedDigest)return "RECONCILE";
  if(r.length!==c.members.length||new Set(r.map(x=>x.effectId)).size!==r.length)return "RECONCILE";
  for(const m of c.members){const hits=r.filter(x=>x.effectId===m.effectId);if(hits.length!==1)return "RECONCILE";const a=hits[0],required={member:m.member,uid:m.uid,effectId:m.effectId,task:c.task,run:c.run,attempt:c.attempt,target:c.target,incarnation:c.incarnation,copyId:c.copyId,approval:"approval28"};if(Object.keys(required).some(k=>a[k]!==required[k])||!nat(a.at)||a.at<b.finishedAt||a.at>w.readAt)return "RECONCILE";const grants=s.grants.filter(x=>x.effectId===m.effectId);if(grants.length!==1)return "RECONCILE";const g=grants[0];if(Object.keys(required).some(k=>g[k]!==required[k])||!nat(g.from)||!nat(g.until)||g.from>a.at||g.until<=a.at||(g.revokedAt!==null&&(!nat(g.revokedAt)||g.revokedAt<=a.at)))return "RECONCILE"}
  if(!current(s)||w.predicate!=="DONE"||w.members.length!==c.members.length)return "RECONCILE";
  for(const m of c.members)if(w.members.filter(x=>x.member===m.member&&x.uid===m.uid&&x.done===true).length!==1)return "RECONCILE";
  return "COMPLETE";
 }
 const rows=scenarios.flatMap(s=>[{scenario:s.id,path:"http_proxy",decision:s.copy.http===202?"COMPLETE":"STOP_UNKNOWN"},{scenario:s.id,path:"copy_status_proxy",decision:s.copy.status==="success"?"COMPLETE":"STOP_UNKNOWN"},{scenario:s.id,path:"full_reference",decision:reference(s)}]);
 if(csv!==["scenario,path,decision",...rows.map(x=>[x.scenario,x.path,x.decision].join(","))].join("\n")+"\n")throw Error("CSV_MISMATCH");
 const expected={baseline:"COMPLETE",pending:"STOP_UNKNOWN",pending_with_receipts:"STOP_UNKNOWN",accepted_without_receipts:"STOP_UNKNOWN",aborted_zero:"STOP_UNKNOWN",missing_b:"RECONCILE",duplicate_a:"RECONCILE",extra_c:"RECONCILE",same_count_swap:"RECONCILE",wrong_copy_receipt:"RECONCILE",wrong_run_receipt:"RECONCILE",wrong_incarnation_receipt:"RECONCILE",source_changed:"RECONCILE",source_identity_drift:"RECONCILE",destination_identity_drift:"RECONCILE",copy_incarnation_drift:"RECONCILE",source_etag_drift:"RECONCILE",destination_etag_drift:"RECONCILE",destination_digest_drift:"RECONCILE",destination_size_drift:"RECONCILE",status_copy_id_drift:"RECONCILE",status_proof_missing:"STOP_UNKNOWN",status_before_finish:"STOP_UNKNOWN",effect_before_copy:"RECONCILE",grant_revoked:"RECONCILE",grant_wrong_approval:"RECONCILE",current_member_swap:"RECONCILE",current_uid_swap:"RECONCILE",current_incarnation_drift:"RECONCILE",guard_drift:"RECONCILE",unprotected_guard:"RECONCILE",commit_drift:"RECONCILE",prior_unknown:"STOP_UNKNOWN",prior_wrong_run:"STOP_UNKNOWN",prior_wrong_effect_set:"STOP_UNKNOWN",journal_incomplete:"STOP_UNKNOWN",positive_miss_conflict:"EVIDENCE_CONFLICT",current_permission_revoked:"COMPLETE",fractional_receipt:"RECONCILE",fractional_watermark:"STOP_UNKNOWN",retry_authoritative_miss:"RETRY_ALLOWED",retry_permission_revoked:"BLOCKED",retry_uncovered:"STOP_UNKNOWN",retry_retention_expired:"STOP_UNKNOWN",retry_pending:"STOP_UNKNOWN",retry_guard_drift:"RECONCILE"};
 const ref=new Map(rows.filter(x=>x.path==="full_reference").map(x=>[x.scenario,x.decision]));
 if(Object.keys(expected).length!==scenarios.length)throw Error("CONTROL_COUNT");
 for(const [id,want]of Object.entries(expected))if(ref.get(id)!==want)throw Error("CONTROL_"+id+"_GOT_"+ref.get(id));
 const hist={};for(const v of ref.values())hist[v]=(hist[v]||0)+1;
 return {status:"PASS_WITH_LIMITS",scenarios:scenarios.length,decisionRows:rows.length,referenceHistogram:hist,negativeControls:scenarios.length-(hist.COMPLETE||0),exactProbes:Object.keys(expected).length,allRowsReconstructed:rows.length,weakDisagreements:Object.fromEntries(["http_proxy","copy_status_proxy"].map(path=>[path,rows.filter(x=>x.path===path&&x.decision!==ref.get(x.scenario)).length])),independence:{implementation:"PARTIAL",dataSource:"NONE",semanticContract:"SHARED",authority:"NONE"},externalEffects:0,azureCalls:0};
}
if(typeof module!=="undefined"){module.exports={verifyAzure,expandAzure};if(require.main===module){const fs=require("fs");console.log(JSON.stringify(verifyAzure(JSON.parse(fs.readFileSync(process.argv[2],"utf8")),fs.readFileSync(process.argv[3],"utf8")),null,2));}}
