// Synthetic exact-effect receipt and incarnation reuse experiment
const fields=["id","target","receiptTarget","receiptEffect","issuer","prior","members","required","permission","historyAuth","protected"];
const tuples=[
["baseline","U1","U1","E1","S1","HIT",["E1"],["E1"],1,1,1],
["target_recreated","U2","U1","E1","S1","HIT",["E1"],["E1"],1,1,1],
["key_reused_for_E0","U1","U1","E0","S1","HIT",["E0"],["E1"],1,1,1],
["untrusted_issuer","U1","U1","E1","X","HIT",["E1"],["E1"],1,1,1],
["hit_miss_conflict","U1","U1","E1","S1","MISS",["E1"],["E1"],1,1,1],
["duplicate_member","U1","U1","E1","S1","HIT",["E1","E1"],["E1"],1,1,1],
["equal_count_extra","U1","U1","E1","S1","HIT",["E1","E3"],["E1","E2"],1,1,1],
["permission_revoked","U1","U1","E1","S1","HIT",["E1"],["E1"],0,1,1],
["historical_grant_invalid","U1","U1","E1","S1","HIT",["E1"],["E1"],1,0,1],
["unprotected_commit","U1","U1","E1","S1","HIT",["E1"],["E1"],1,1,0],
["prior_unknown","U1",null,null,null,"UNKNOWN",[],["E1"],1,null,1]
];
function producer(a){
 const [id,target,receiptTarget,receiptEffect,issuer,prior,members,required,permission,historyAuth,protectedCommit]=a;
 const weak=receiptTarget?"COMPLETE":"RETRY";
 let reference;
 if(receiptTarget&&prior==="MISS")reference="EVIDENCE_CONFLICT";
 else if(!receiptTarget||prior!=="HIT")reference="UNKNOWN_STOP";
 else if(issuer!=="S1")reference="UNKNOWN_STOP";
 else if(target!==receiptTarget)reference="TARGET_CONFLICT";
 else if(receiptEffect!=="E1")reference="IDENTITY_CONFLICT";
 else if(historyAuth!==1)reference="HISTORICAL_AUTH_INVALID";
 else if(new Set(members).size!==members.length)reference="DUPLICATE_MEMBER";
 else if(new Set(required).size!==required.length)reference="DUPLICATE_REQUIRED";
 else if(members.length!==required.length||members.some(m=>!required.includes(m)))reference="EFFECT_SET_CONFLICT";
 else if(protectedCommit!==1)reference="TOCTOU_STOP";
 else reference=permission===1?"COMPLETE":"COMPLETE_NO_NEW_EFFECT";
 return {id,weak,reference};
}
function verifier(a){
 const [id,t,rt,re,issuer,p,m,req,perm,auth,guard]=a;
 if(rt&&p==="MISS")return "EVIDENCE_CONFLICT";
 if(!rt||p!=="HIT"||issuer!=="S1")return "UNKNOWN_STOP";
 if(rt!==t)return "TARGET_CONFLICT";
 if(re!=="E1")return "IDENTITY_CONFLICT";
 if(auth!==1)return "HISTORICAL_AUTH_INVALID";
 const observed=new Set();for(const x of m){if(observed.has(x))return "DUPLICATE_MEMBER";observed.add(x)}
 if(new Set(req).size!==req.length)return "DUPLICATE_REQUIRED";
 if(observed.size!==req.length||req.some(x=>!observed.has(x)))return "EFFECT_SET_CONFLICT";
 if(guard!==1)return "TOCTOU_STOP";
 return perm===1?"COMPLETE":"COMPLETE_NO_NEW_EFFECT";
}
const rows=tuples.map(a=>({...producer(a),verifier:verifier(a)}));
if(new Set(rows.map(x=>x.id)).size!==rows.length)throw Error("scenario duplicate");
if(rows.some(x=>x.reference!==x.verifier))throw Error("shared-contract verifier mismatch");
const summary={scenarios:rows.length,weakComplete:rows.filter(x=>x.weak==="COMPLETE").length,referenceComplete:rows.filter(x=>x.reference==="COMPLETE").length,referenceNoNewEffect:rows.filter(x=>x.reference==="COMPLETE_NO_NEW_EFFECT").length,divergences:rows.filter(x=>x.weak!==x.reference).length,agreements:rows.filter(x=>x.reference===x.verifier).length};
const adversarial={id:"forged_issuer_S1",missing:"cryptographic receipt issuer proof, actual attempt identity, effect-time clock, protected sink transaction",modeled:producer(tuples[0]).reference,authorityAware:"UNKNOWN_STOP",kind:"REFERENCE_GAP"};
console.log(JSON.stringify({fields,tuples,rows,summary,adversarial}));
