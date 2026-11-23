function produce(){
 const r=(effect,receiptId,target="g1")=>({effect,receiptId,target});
 const base={required:["A","B"],receipts:[r("A","rA"),r("B","rB")],membership:["A","B"],target:"g1",prior:"hit",historicalAuthorization:true,currentPermission:true,observedRevision:4,currentRevision:4,protectedCompletion:true,evidenceConflict:false};
 const variants=[["baseline",{}],["duplicate_receipt",{receipts:[r("A","rA"),r("A","rA2")]}],["extra_receipt",{receipts:[r("A","rA"),r("B","rB"),r("C","rC")]}],["membership_swap",{membership:["A","C"]}],["stale_incarnation",{receipts:[r("A","rA","g0"),r("B","rB")]}],["revision_toctou",{currentRevision:5}],["conflicting_miss",{prior:"authoritative miss"}],["permission_revoked",{currentPermission:false}],["non_atomic_guard",{protectedCompletion:false}],["unknown_prior",{prior:"unknown",receipts:[]}]];
 return variants.map(([scenario,delta])=>{
  const facts={...base,...delta}, effects=facts.receipts.map(x=>x.effect), receiptIds=facts.receipts.map(x=>x.receiptId);
  const weak=facts.receipts.length===facts.required.length?"COMPLETE":"INCOMPLETE";
  let reference;
  if(facts.evidenceConflict===true||(facts.prior==="authoritative miss"&&facts.receipts.length))reference="EVIDENCE_CONFLICT";
  else if(facts.prior!=="hit")reference="STOP_UNKNOWN";
  else if(new Set(effects).size!==effects.length||new Set(receiptIds).size!==receiptIds.length||effects.length!==facts.required.length||effects.some(x=>!facts.required.includes(x)))reference="EFFECT_SET_MISMATCH";
  else if(facts.membership.length!==facts.required.length||new Set(facts.membership).size!==facts.required.length||facts.membership.some(x=>!facts.required.includes(x)))reference="MEMBERSHIP_MISMATCH";
  else if(facts.receipts.some(x=>x.target!==facts.target))reference="TARGET_MISMATCH";
  else if(facts.historicalAuthorization!==true)reference="HIST_AUTH_UNPROVEN";
  else if(facts.currentRevision!==facts.observedRevision||facts.protectedCompletion!==true)reference="COMPLETION_UNPROVEN";
  else reference="MODEL_COMPLETE";
  return {scenario,facts,weak,reference};
 });
}

function verify(rows){
 const expected=["baseline","duplicate_receipt","extra_receipt","membership_swap","stale_incarnation","revision_toctou","conflicting_miss","permission_revoked","non_atomic_guard","unknown_prior"];
 const errors=[];
 if(!Array.isArray(rows)||rows.length!==expected.length)return {pass:false,errors:["ROW_COUNT_OR_TYPE"],summary:null};
 const ids=rows.map(x=>x.scenario);
 if(new Set(ids).size!==ids.length||expected.some(x=>!ids.includes(x)))errors.push("SCENARIO_IDENTITY");
 for(const row of rows){
  const f=row.facts;
  if(!f||!Array.isArray(f.required)||!Array.isArray(f.receipts)||!Array.isArray(f.membership)){errors.push(`${row.scenario}:MALFORMED`);continue;}
  const weak=f.receipts.length===f.required.length?"COMPLETE":"INCOMPLETE";
  if(row.weak!==weak)errors.push(`${row.scenario}:WEAK_DECISION`);
  let classification="MODEL_COMPLETE";
  if(f.evidenceConflict===true||(f.prior==="authoritative miss"&&f.receipts.length!==0))classification="EVIDENCE_CONFLICT";
  else if(f.prior!=="hit")classification="STOP_UNKNOWN";
  else{
   const effectKeys=new Set(),receiptKeys=new Set();let invalidReceipt=false;
   for(const item of f.receipts){
    if(!item||typeof item.effect!=="string"||typeof item.receiptId!=="string"||typeof item.target!=="string"||effectKeys.has(item.effect)||receiptKeys.has(item.receiptId)){invalidReceipt=true;break;}
    effectKeys.add(item.effect);receiptKeys.add(item.receiptId);
   }
   if(invalidReceipt||effectKeys.size!==f.required.length||f.required.some(x=>!effectKeys.has(x)))classification="EFFECT_SET_MISMATCH";
   else if(new Set(f.membership).size!==f.required.length||f.membership.length!==f.required.length||f.required.some(x=>!f.membership.includes(x)))classification="MEMBERSHIP_MISMATCH";
   else if(f.receipts.some(x=>x.target!==f.target))classification="TARGET_MISMATCH";
   else if(f.historicalAuthorization!==true)classification="HIST_AUTH_UNPROVEN";
   else if(!Number.isSafeInteger(f.observedRevision)||!Number.isSafeInteger(f.currentRevision)||f.observedRevision!==f.currentRevision||f.protectedCompletion!==true)classification="COMPLETION_UNPROVEN";
  }
  if(row.reference!==classification)errors.push(`${row.scenario}:REFERENCE_DECISION:${classification}`);
 }
 const weakComplete=rows.filter(x=>x.weak==="COMPLETE").length,referenceComplete=rows.filter(x=>x.reference==="MODEL_COMPLETE").length,modelRelativeFalseComplete=rows.filter(x=>x.weak==="COMPLETE"&&x.reference!=="MODEL_COMPLETE").length;
 const summary={rows:rows.length,weakComplete,referenceComplete,modelRelativeFalseComplete};
 if(weakComplete!==8||referenceComplete!==2||modelRelativeFalseComplete!==6)errors.push("HISTOGRAM_DRIFT");
 return {pass:errors.length===0,errors,summary};
}

function runReview(){
 const rows=produce(),verification=verify(rows);
 const attacks={
  forged_label:x=>x[0].reference="MODEL_FAKED",
  duplicate_scenario:x=>x[1].scenario=x[0].scenario,
  missing_scenario:x=>x.pop(),
  duplicate_receipt_id:x=>x[0].facts.receipts[1].receiptId="rA",
  unproven_completion:x=>delete x[0].facts.protectedCompletion,
  contradictory_miss:x=>x[0].facts.prior="authoritative miss",
  revision_race:x=>x[0].facts.currentRevision=5,
  membership_swap:x=>x[0].facts.membership=["A","C"]
 };
 const tamper=Object.entries(attacks).map(([name,mutate])=>{const clone=JSON.parse(JSON.stringify(rows));mutate(clone);const result=verify(clone);return {name,detected:!result.pass,errors:result.errors};});
 return {rows,verification,tamper};
}

if (typeof require !== "undefined" && require.main === module) console.log(JSON.stringify(runReview(), null, 2))

 