// 2026-11-18 bounded synthetic compensation identity study
const fields=["id","originalEffect","compensatedEffect","originalTarget","compensationTarget","receipt","prior","effectTimeAuth","currentPermission","required","observed","protectedCompletion","issuerAuthenticated"];
const tuples=[
["baseline","E1","E1","U1","U1","HIT","HIT",1,1,["E1"],["E1"],1,1],
["compensate_wrong_effect","E1","E0","U1","U1","HIT","HIT",1,1,["E1"],["E1"],1,1],
["compensate_old_target","E1","E1","U2","U1","HIT","HIT",1,1,["E1"],["E1"],1,1],
["compensation_receipt_only","E1","E1","U1","U1","HIT","UNKNOWN",1,1,["E1"],["E1"],1,1],
["contradictory_miss","E1","E1","U1","U1","HIT","MISS",1,1,["E1"],["E1"],1,1],
["duplicate_effect_member","E1","E1","U1","U1","HIT","HIT",1,1,["E1"],["E1","E1"],1,1],
["equal_count_extra","E1","E1","U1","U1","HIT","HIT",1,1,["E1","E2"],["E1","E3"],1,1],
["historical_grant_invalid","E1","E1","U1","U1","HIT","HIT",0,1,["E1"],["E1"],1,1],
["current_permission_revoked","E1","E1","U1","U1","HIT","HIT",1,0,["E1"],["E1"],1,1],
["unprotected_completion","E1","E1","U1","U1","HIT","HIT",1,1,["E1"],["E1"],0,1],
["forged_issuer","E1","E1","U1","U1","HIT","HIT",1,1,["E1"],["E1"],1,0],
["unknown_receipt","E1","E1","U1","U1","UNKNOWN","UNKNOWN",1,1,["E1"],["E1"],1,1]
];
function producer(a){
 const [id,e,ce,t,ct,receipt,prior,auth,permission,required,observed,guard,issuer]=a;
 const weak=receipt==="HIT"?"COMPENSATED":"RETRY";
 let reference;
 if(receipt!=="HIT")reference="UNKNOWN_STOP";
 else if(issuer!==1)reference="ISSUER_UNKNOWN";
 else if([e,ce,t,ct].some(x=>typeof x!=="string"||!x.trim()))reference="IDENTITY_UNKNOWN";
 else if(e!==ce)reference="EFFECT_IDENTITY_CONFLICT";
 else if(t!==ct)reference="TARGET_INCAR_CONFLICT";
 else if(prior==="MISS")reference="EVIDENCE_CONFLICT";
 else if(prior!=="HIT")reference="ORIGINAL_EFFECT_UNKNOWN";
 else if(auth!==1)reference="HISTORICAL_AUTH_INVALID";
 else if(!Array.isArray(required)||!Array.isArray(observed)||!required.length||!observed.length||[...required,...observed].some(x=>typeof x!=="string"||!x.trim()))reference="MEMBERSHIP_UNKNOWN";
 else if(new Set(observed).size!==observed.length)reference="DUPLICATE_MEMBER";
 else if(new Set(required).size!==required.length)reference="DUPLICATE_REQUIRED";
 else if(observed.length!==required.length||observed.some(x=>!required.includes(x)))reference="EFFECT_SET_CONFLICT";
 else if(!required.includes(e)||!observed.includes(ce))reference="EFFECT_MEMBERSHIP_UNBOUND";
 else if(required.length>1)reference="MULTI_EFFECT_COMPENSATION_UNKNOWN";
 else if(guard!==1)reference="TOCTOU_STOP";
 else reference=permission===1?"MODEL_COMPENSATION_BOUND":"MODEL_NO_NEW_EFFECT";
 return {id,weak,reference};
}
function verifier(a){
 const [id,e,ce,t,ct,receipt,prior,auth,permission,required,observed,guard,issuer]=a;
 if(receipt!=="HIT")return "UNKNOWN_STOP";
 if(issuer!==1)return "ISSUER_UNKNOWN";
 if([e,ce,t,ct].some(x=>typeof x!=="string"||!x.trim()))return "IDENTITY_UNKNOWN";
 if(e!==ce)return "EFFECT_IDENTITY_CONFLICT";
 if(t!==ct)return "TARGET_INCAR_CONFLICT";
 if(prior==="MISS")return "EVIDENCE_CONFLICT";
 if(prior!=="HIT")return "ORIGINAL_EFFECT_UNKNOWN";
 if(auth!==1)return "HISTORICAL_AUTH_INVALID";
 if(!Array.isArray(required)||!Array.isArray(observed)||!required.length||!observed.length||[...required,...observed].some(x=>typeof x!=="string"||!x.trim()))return "MEMBERSHIP_UNKNOWN";
 const seen=new Set();for(const x of observed){if(seen.has(x))return "DUPLICATE_MEMBER";seen.add(x)}
 if(new Set(required).size!==required.length)return "DUPLICATE_REQUIRED";
 if(seen.size!==required.length||required.some(x=>!seen.has(x)))return "EFFECT_SET_CONFLICT";
 if(!required.includes(e)||!seen.has(ce))return "EFFECT_MEMBERSHIP_UNBOUND";
 if(required.length>1)return "MULTI_EFFECT_COMPENSATION_UNKNOWN";
 if(guard!==1)return "TOCTOU_STOP";
 return permission===1?"MODEL_COMPENSATION_BOUND":"MODEL_NO_NEW_EFFECT";
}
const rows=tuples.map(t=>({...producer(t),verifier:verifier(t)}));
if(new Set(rows.map(x=>x.id)).size!==rows.length)throw Error("duplicate scenario");
if(rows.some(x=>x.reference!==x.verifier))throw Error("shared contract disagreement");
const summary={scenarios:rows.length,weakCompensated:rows.filter(x=>x.weak==="COMPENSATED").length,referenceBound:rows.filter(x=>x.reference==="MODEL_COMPENSATION_BOUND").length,divergences:rows.filter(x=>x.weak!==x.reference).length,agreements:rows.filter(x=>x.reference===x.verifier).length};
const referenceAttack={id:"issuer_flag_spoofed_after_cancel",originalBaselineReference:producer(tuples[0]).reference,missing:"authenticated compensation issuer, proof of reverse effect at external sink, original effect-time clock, compensation non-reversibility, atomic completion, concurrent new effect",strongerAuthorityAware:"UNKNOWN_STOP",kind:"REFERENCE_GAP"};
console.log(JSON.stringify({fields,tuples,rows,summary,referenceAttack}));
// Additional same-date maintainer review probes, not new Daily or independent experiment credit
const reviewFixtures=[
 ["both_effect_ids_absent",null,null,"U1","U1","HIT","HIT",1,1,[],[],1,1],
 ["both_target_uids_absent","E1","E1",null,null,"HIT","HIT",1,1,["E1"],["E1"],1,1],
 ["empty_member_set","E1","E1","U1","U1","HIT","HIT",1,1,[],[],1,1],
 ["unbound_member_set","E1","E1","U1","U1","HIT","HIT",1,1,["E9"],["E9"],1,1],
 ["absent_compensation_id","E1",null,"U1","U1","HIT","HIT",1,1,["E1"],["E1"],1,1],
 ["null_observed_members","E1","E1","U1","U1","HIT","HIT",1,1,["E1"],null,1,1],
 ["blank_target_id","E1","E1","U1"," ","HIT","HIT",1,1,["E1"],["E1"],1,1],
 ["malformed_member_identity","E1","E1","U1","U1","HIT","HIT",1,1,["E1"],[""],1,1]
];
const expectedReview={
 both_effect_ids_absent:"IDENTITY_UNKNOWN",
 both_target_uids_absent:"IDENTITY_UNKNOWN",
 empty_member_set:"MEMBERSHIP_UNKNOWN",
 unbound_member_set:"EFFECT_MEMBERSHIP_UNBOUND",
 absent_compensation_id:"IDENTITY_UNKNOWN",
 null_observed_members:"MEMBERSHIP_UNKNOWN",
 blank_target_id:"IDENTITY_UNKNOWN",
 malformed_member_identity:"MEMBERSHIP_UNKNOWN"
};
const reviewRows=reviewFixtures.map(t=>({...producer(t),verifier:verifier(t)}));
if(new Set([...tuples,...reviewFixtures].map(x=>x[0])).size!==tuples.length+reviewFixtures.length)throw Error("duplicate original/review identity");
for(const x of reviewRows){
 if(x.reference!==expectedReview[x.id])throw Error("review expectation mismatch "+x.id+" "+x.reference);
 if(x.verifier!==x.reference)throw Error("review shared-contract verifier mismatch "+x.id);
}
const referenceGap={
 id:"forged_issuer_attestation_and_unmodeled_concurrent_reversal",
 reference:producer(tuples[0]).reference,
 strongerContract:"UNKNOWN_STOP",
 missing:"authenticated issuer, real sink effect reversal, compensation effect-time authorization and atomic commit",
 provenance:"authored synthetic self-attack"
};
if(referenceGap.reference!=="MODEL_COMPENSATION_BOUND")throw Error("reference gap probe changed");
console.log(JSON.stringify({reviewDate:"2026-11-18 Asia/Shanghai",kind:"MAINTAINER_REVIEW_NO_NEW_CREDIT",reviewFixtures,reviewRows,referenceGap}));

const aggregateFixtures=[
 ["two_effects_single_receipt","E1","E1","U1","U1","HIT","HIT",1,1,["E1","E2"],["E1","E2"],1,1],
 ["three_effects_single_receipt","E1","E1","U1","U1","HIT","HIT",1,1,["E1","E2","E3"],["E1","E2","E3"],1,1]
];
const aggregateRows=aggregateFixtures.map(t=>({...producer(t),verifier:verifier(t)}));
for(const row of aggregateRows) {
 if(row.reference!=="MULTI_EFFECT_COMPENSATION_UNKNOWN"||row.verifier!==row.reference)throw Error("aggregate compensation proof gap "+row.id);
}
if(new Set([...tuples,...reviewFixtures,...aggregateFixtures].map(t=>t[0])).size!==tuples.length+reviewFixtures.length+aggregateFixtures.length)throw Error("duplicate aggregate test identity");
console.log(JSON.stringify({kind:"SAME_DATE_AGGREGATE_REVIEW_NO_CREDIT",fixtures:aggregateFixtures,rows:aggregateRows}));
