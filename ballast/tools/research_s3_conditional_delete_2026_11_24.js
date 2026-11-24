function producer(){
 const base={task:"T24",run:"RUN24",attempt:1,effect:"DELETE-OBJ-24",target:"bucket/key",targetVersion:"v1",currentVersion:"v1",etag:"E1",currentEtag:"E1",prior:"unknown",receipt:null,missScope:"exact",missWatermark:12,effectSequence:10,retention:true,currentPermission:true,historicalAuthorization:true,deleteResponse:204,deleteMarker:false,completionRevision:4,observedRevision:4,atomicCompletion:true};
 const cases=[
 ["baseline_prior_hit",{prior:"hit",receipt:{effect:"DELETE-OBJ-24",version:"v1",attempt:1},deleteMarker:true}],
 ["response_204_only",{}],
 ["same_etag_reincarnation",{prior:"hit",receipt:{effect:"DELETE-OBJ-24",version:"v1",attempt:1},currentVersion:"v2",deleteMarker:true}],
 ["delete_marker_absence",{deleteMarker:true}],
 ["unscoped_miss",{prior:"miss",missScope:"prefix"}],
 ["stale_miss",{prior:"miss",missWatermark:9}],
 ["retention_expired",{prior:"miss",retention:false}],
 ["qualified_miss",{prior:"miss"}],
 ["positive_negative_conflict",{prior:"miss",receipt:{effect:"DELETE-OBJ-24",version:"v1",attempt:1}}],
 ["duplicate_receipt",{prior:"hit",receipt:[{effect:"DELETE-OBJ-24",version:"v1",attempt:1},{effect:"DELETE-OBJ-24",version:"v1",attempt:1}],deleteMarker:true}],
 ["extra_effect_receipt",{prior:"hit",receipt:[{effect:"DELETE-OBJ-24",version:"v1",attempt:1},{effect:"OTHER",version:"v1",attempt:1}],deleteMarker:true}],
 ["revoked_new_permission",{prior:"hit",receipt:{effect:"DELETE-OBJ-24",version:"v1",attempt:1},deleteMarker:true,currentPermission:false}],
 ["unauthorized_history",{prior:"hit",receipt:{effect:"DELETE-OBJ-24",version:"v1",attempt:1},deleteMarker:true,historicalAuthorization:false}],
 ["completion_toctou",{prior:"hit",receipt:{effect:"DELETE-OBJ-24",version:"v1",attempt:1},deleteMarker:true,completionRevision:5}],
 ["forged_atomic_flag",{prior:"hit",receipt:{effect:"DELETE-OBJ-24",version:"v1",attempt:1},deleteMarker:true,atomicCompletion:"true"}],
 ["wrong_attempt",{prior:"hit",receipt:{effect:"DELETE-OBJ-24",version:"v1",attempt:2},deleteMarker:true}]
 ];
 function reference(f){
  const rs=f.receipt===null?[]:Array.isArray(f.receipt)?f.receipt:[f.receipt];
  if(f.prior==="miss"&&rs.length)return "EVIDENCE_CONFLICT";
  if(f.prior==="hit"){
   if(rs.length!==1||rs[0].effect!==f.effect||rs[0].version!==f.targetVersion||rs[0].attempt!==f.attempt)return "IDENTITY_MISMATCH";
   if(f.historicalAuthorization!==true)return "HIST_AUTH_UNKNOWN";
   if(f.currentVersion!==f.targetVersion||f.currentEtag!==f.etag)return "INCARNATION_DRIFT";
   if(f.deleteMarker!==true||f.observedRevision!==f.completionRevision||f.atomicCompletion!==true)return "COMPLETION_UNPROVEN";
   return "MODEL_COMPLETE";
  }
  if(f.prior==="miss"&&f.missScope==="exact"&&f.missWatermark>=f.effectSequence&&f.retention===true&&f.currentPermission===true)return "MODEL_RETRY_CANDIDATE";
  return "STOP_UNKNOWN";
 }
 return cases.map(([scenario,change])=>{const facts={...base,...change};return {scenario,facts,weak:facts.deleteResponse===204?"COMPLETE":"INCOMPLETE",reference:reference(facts)};});
}

function verifier(rows){
 const errors=[], ids=new Set();
 for(const r of rows){
  if(ids.has(r.scenario))errors.push("duplicate_scenario:"+r.scenario);ids.add(r.scenario);
  const f=r.facts,receipts=f.receipt===null?[]:Array.isArray(f.receipt)?f.receipt:[f.receipt];
  if(r.weak!==(f.deleteResponse===204?"COMPLETE":"INCOMPLETE"))errors.push("weak:"+r.scenario);
  let result="STOP_UNKNOWN";
  if(f.prior==="miss"&&receipts.length>0)result="EVIDENCE_CONFLICT";
  else if(f.prior==="hit"){
   if(receipts.length!==1||receipts.some(x=>x.effect!==f.effect||x.version!==f.targetVersion||x.attempt!==f.attempt))result="IDENTITY_MISMATCH";
   else if(f.historicalAuthorization!==true)result="HIST_AUTH_UNKNOWN";
   else if(f.currentVersion!==f.targetVersion||f.currentEtag!==f.etag)result="INCARNATION_DRIFT";
   else if(f.deleteMarker!==true||f.observedRevision!==f.completionRevision||f.atomicCompletion!==true)result="COMPLETION_UNPROVEN";
   else result="MODEL_COMPLETE";
  }else if(f.prior==="miss"&&f.missScope==="exact"&&f.missWatermark>=f.effectSequence&&f.retention===true&&f.currentPermission===true)result="MODEL_RETRY_CANDIDATE";
  if(result!==r.reference)errors.push("reference:"+r.scenario+":"+result);
 }
 const histogram={};for(const r of rows)histogram[r.reference]=(histogram[r.reference]||0)+1;
 return {pass:errors.length===0,errors,count:rows.length,unique:ids.size,histogram,weakComplete:rows.filter(r=>r.weak==="COMPLETE").length,modelRelativeWeakComplete:rows.filter(r=>r.weak==="COMPLETE"&&r.reference!=="MODEL_COMPLETE").length};
}

function study(){
 const rows=producer(),check=verifier(rows);
 const mutate={
 forged_reference:r=>r[0].reference="MODEL_RETRY_CANDIDATE",
 duplicate_scenario:r=>r[1].scenario=r[0].scenario,
 extra_receipt:r=>r[0].facts.receipt=[r[0].facts.receipt,{effect:"EXTRA",version:"v1",attempt:1}],
 conflicting_miss:r=>r[0].facts.prior="miss",
 changed_incarnation:r=>r[0].facts.currentVersion="v2",
 toctou:r=>r[0].facts.completionRevision=6,
 forged_atomic:r=>r[0].facts.atomicCompletion="true",
 revoked_historical:r=>r[0].facts.historicalAuthorization=false,
 missing_receipt:r=>r[0].facts.receipt=null
 };
 const attacks=Object.entries(mutate).map(([name,change])=>{const x=JSON.parse(JSON.stringify(rows));change(x);const v=verifier(x);return {name,detected:!v.pass,errors:v.errors};});
 return {rows,check,attacks};
}

if (typeof require !== "undefined" && require.main === module) console.log(JSON.stringify(study(), null, 2))
