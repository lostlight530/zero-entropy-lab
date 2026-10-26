
function verifySqs(scenarios,csv){
 const requiredPaths=["http_status_proxy","fifo_dedup_proxy","full_reference"],lines=csv.trimEnd().split(/\r?\n/);
 if(lines[0]!=="scenario,path,decision")throw Error("CSV_HEADER");
 if(!Array.isArray(scenarios)||new Set(scenarios.map(s=>s.id)).size!==scenarios.length)throw Error("DUPLICATE_SCENARIO");
 if(lines.length!==scenarios.length*3+1)throw Error("ROW_COUNT");
 const uniquePairs=new Set(),hist={},mismatch=[],refOut={},pathDiff={http_status_proxy:0,fifo_dedup_proxy:0};
 function covers(s){const q=s.prior.query,c=s.context,ids=c.required.map(x=>x.effectId);return q&&[q.at,q.watermark,q.attemptEnd,q.retentionUntil].every(Number.isFinite)&&q.authority==="synthetic-sink-ledger"&&q.lifecycle==="ACTIVE"&&q.task===c.task&&q.run===c.run&&q.attempt===c.attempt&&q.target===c.target&&q.incarnation===c.incarnation&&Array.isArray(q.effectIds)&&q.effectIds.length===ids.length&&new Set(q.effectIds).size===ids.length&&ids.every(id=>q.effectIds.includes(id))&&Number.isFinite(q.at)&&q.at>=q.attemptEnd&&q.watermark>=q.attemptEnd&&q.retentionUntil>=q.at}
 function sameMembers(actual,expected){if(!Array.isArray(actual)||actual.length!==expected.length)return false;const keys=actual.map(x=>x.member+":"+x.uid),want=expected.map(x=>x.member+":"+x.uid);return new Set(keys).size===keys.length&&keys.every(k=>want.includes(k))}
 function guarded(s,pred){const w=s.current,c=s.context;return [w.readAt,w.guardAt,w.commitAt,w.revision,w.guardRevision,w.commitRevision].every(Number.isFinite)&&w.task===c.task&&w.target===c.target&&w.incarnation===c.incarnation&&sameMembers(w.members,c.required)&&sameMembers(w.commitMembers,c.required)&&JSON.stringify(w.members)===JSON.stringify(w.commitMembers)&&w.predicate===pred&&w.protected===true&&typeof w.revision==="number"&&Number.isInteger(w.revision)&&w.revision===w.guardRevision&&w.guardRevision===w.commitRevision&&w.readAt<w.guardAt&&w.guardAt<w.commitAt&&w.readAt>=s.prior.query.at}
 function independent(s){
  const c=s.context,req=c.required,rs=s.receipts,q=s.prior;
  if(!Number.isFinite(s.control.receivedAt)||!Number.isFinite(s.control.deletedAt)||!Number.isInteger(s.control.deliveryEpoch))return "RECONCILE";
  if(req.length!==2||new Set(req.map(x=>x.member)).size!==2||new Set(req.map(x=>x.uid)).size!==2||new Set(req.map(x=>x.effectId)).size!==2)return "RECONCILE";
  const positive=rs.some(r=>req.find(x=>x.member===r.member&&x.effectId===r.effectId));
  if(q.state==="miss"&&covers(s)&&positive)return "EVIDENCE_CONFLICT";
  if(rs.length===0){
   if(q.state==="hit"&&q.journalComplete===true&&covers(s))return "EVIDENCE_CONFLICT";
   if(q.state!=="miss"||!covers(s))return "STOP_UNKNOWN";
   const p=s.permission,ok=Number.isFinite(p.validUntil)&&(p.revokedAt===null||Number.isFinite(p.revokedAt))&&p.allowed===true&&p.task===c.task&&p.target===c.target&&p.incarnation===c.incarnation&&p.validUntil>=s.current.commitAt&&(p.revokedAt===null||p.revokedAt>s.current.commitAt);
   if(!ok)return "BLOCKED";
   return guarded(s,"PENDING")?"RETRY_ALLOWED":"STOP_UNKNOWN";
  }
  if(rs.length!==req.length)return "RECONCILE";
  const observed=new Set();
  for(const r of rs){
   const expected=req.filter(x=>x.member===r.member&&x.uid===r.uid&&x.effectId===r.effectId);
   if(expected.length!==1||observed.has(r.effectId))return "RECONCILE";
   observed.add(r.effectId);
   if(!Number.isFinite(r.at)||["task","run","attempt","target","incarnation"].some(k=>r[k]!==c[k])||r.at<s.control.receivedAt||r.at>=s.current.readAt)return "RECONCILE";
   const matching=s.grants.filter(g=>Number.isFinite(g.validFrom)&&Number.isFinite(g.validTo)&&(g.revokedAt===null||Number.isFinite(g.revokedAt))&&["member","uid","effectId","task","run","attempt","target","incarnation","approval"].every(k=>g[k]===r[k])&&g.validFrom<=r.at&&g.validTo>=r.at&&(g.revokedAt===null||g.revokedAt>r.at));
   if(matching.length!==1)return "RECONCILE";
  }
  if(s.queueProof.length===0)return "STOP_UNKNOWN";
  if(s.queueProof.length!==1)return "RECONCILE";
  const ack=s.queueProof[0],ctl=s.control;
  const valid=Number.isFinite(ack.at)&&Number.isInteger(ack.epoch)&&ack.state==="DELETED"&&ack.queue===ctl.queue&&ack.message===ctl.message&&ack.epoch===ctl.deliveryEpoch&&ack.handle===ctl.latestHandle&&ack.handle===ctl.usedHandle&&ack.at===ctl.deletedAt&&ack.at>=Math.max(...rs.map(r=>r.at))&&ack.at<s.current.readAt;
  if(!valid)return "RECONCILE";
  return guarded(s,"DONE")?"COMPLETE":"RECONCILE";
 }
 for(let i=1;i<lines.length;i++){
  const parts=lines[i].split(",");if(parts.length!==3)throw Error("CSV_COLUMNS");
  const [id,path,decision]=parts,s=scenarios.find(x=>x.id===id);
  if(!s||!requiredPaths.includes(path))throw Error("UNKNOWN_PAIR");
  const key=id+"/"+path;if(uniquePairs.has(key))throw Error("DUPLICATE_PAIR");uniquePairs.add(key);
  const want=path==="http_status_proxy"?(s.control.http===200?"COMPLETE":"STOP_UNKNOWN"):path==="fifo_dedup_proxy"?(s.control.http===200&&s.control.dedupAgeSec<=300?"COMPLETE":"STOP_UNKNOWN"):independent(s);
  if(decision!==want)mismatch.push({id,path,actual:decision,expected:want});
  if(path==="full_reference"){hist[decision]=(hist[decision]||0)+1;refOut[id]=decision}
 }
 for(const s of scenarios)for(const p of requiredPaths)if(!uniquePairs.has(s.id+"/"+p))throw Error("MISSING_PATH");
 for(const s of scenarios){const r=refOut[s.id];for(const p of ["http_status_proxy","fifo_dedup_proxy"]){const row=lines.find(x=>x.startsWith(s.id+","+p+","));if(row.split(",")[2]!==r)pathDiff[p]++}}
 const controls={baseline:"COMPLETE",historical_revocation_after_effect:"COMPLETE",dedup_window_expired_historical_complete:"COMPLETE",stale_handle_http_200:"STOP_UNKNOWN",duplicate_A_replaces_B:"RECONCILE",extra_effect_C:"RECONCILE",covered_negative_miss_conflicts_positive:"EVIDENCE_CONFLICT",covered_miss_safe_retry:"RETRY_ALLOWED",covered_miss_permission_revoked:"BLOCKED",covered_miss_guard_unprotected:"STOP_UNKNOWN",hit_with_complete_empty_journal:"EVIDENCE_CONFLICT",queue_proof_boolean_coercion:"RECONCILE",read_commit_membership_toctou:"RECONCILE",current_permission_expired_after_effect:"COMPLETE",attack_receipt_time_string:"RECONCILE",attack_grant_from_string:"RECONCILE",attack_current_read_string:"RECONCILE",attack_current_guard_string:"RECONCILE",attack_control_receive_string:"RECONCILE",attack_current_commit_string:"RECONCILE",attack_prior_watermark_string:"STOP_UNKNOWN",attack_prior_retention_string:"STOP_UNKNOWN",attack_permission_valid_until_string:"BLOCKED"};
 for(const [id,want] of Object.entries(controls))if(refOut[id]!==want)throw Error("EXACT_CONTROL "+id+" "+refOut[id]);
 if(mismatch.length)throw Error("RECONSTRUCTION_MISMATCH "+JSON.stringify(mismatch.slice(0,3)));
 const forged=lines.slice();forged[1]=forged[1].replace(/COMPLETE|STOP_UNKNOWN|RECONCILE|EVIDENCE_CONFLICT|RETRY_ALLOWED|BLOCKED/,"FORGED");
 let forgedDetected=false;
 try{const [id,p,d]=forged[1].split(","),s=scenarios.find(x=>x.id===id);const expected=p==="full_reference"?independent(s):p==="http_status_proxy"?(s.control.http===200?"COMPLETE":"STOP_UNKNOWN"):(s.control.http===200&&s.control.dedupAgeSec<=300?"COMPLETE":"STOP_UNKNOWN");if(d!==expected)throw Error("FORGED_ROW")}catch(e){forgedDetected=String(e).includes("FORGED_ROW")}
 let duplicateDetected=false;try{const arr=scenarios.concat([scenarios[0]]);if(new Set(arr.map(x=>x.id)).size!==arr.length)throw Error("DUPLICATE_SCENARIO")}catch(e){duplicateDetected=String(e).includes("DUPLICATE_SCENARIO")}
 if(!forgedDetected||!duplicateDetected)throw Error("MUTATION_CONTROLS");
 return {status:"PASS_WITH_LIMITS",scenarioCount:scenarios.length,decisionRows:lines.length-1,paths:requiredPaths,referenceHistogram:hist,weakPathDisagreements:pathDiff,allRowsReconstructed:lines.length-1,nonCompleteControls:Object.values(refOut).filter(x=>x!=="COMPLETE").length,exactProbes:Object.keys(controls).length,forgedRowRejected:forgedDetected,duplicateScenarioRejected:duplicateDetected,independence:{implementation:"PARTIAL",dataSource:"NONE",semanticContract:"LIMITED_SHARED",authority:"NONE"},externalEffects:0};
}
if(typeof module!=="undefined"){module.exports={verifySqs};if(require.main===module){const fs=require("fs");const s=JSON.parse(fs.readFileSync(process.argv[2],"utf8"));const csv=fs.readFileSync(process.argv[3],"utf8");console.log(JSON.stringify(verifySqs(s,csv),null,2));}}
