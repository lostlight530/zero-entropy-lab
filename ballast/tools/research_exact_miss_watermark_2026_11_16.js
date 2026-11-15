// Bounded synthetic model, not a real effect sink or authoritative query
const fixtures = [["covered_exact_miss",1,1,12,10,1,0,0,1],["global_watermark_only",1,0,12,10,1,0,0,1],["lagging_watermark",1,1,9,10,1,0,0,1],["expired_retention",1,1,12,10,0,0,0,1],["positive_miss_conflict",1,1,12,10,1,1,0,1],["extra_effect_member",1,1,12,10,1,0,1,1],["revoked_current_permission",1,1,12,10,1,0,0,0],["missing_exact_identity",0,1,12,10,1,0,0,1]];
function producer(a) {
 const [id,exact,scope,watermark,attempt,retention,positive,extra,permission]=a;
 const weak=watermark>=attempt?"RETRY":"STOP";
 let reference;
 if(positive&&scope&&watermark>=attempt) reference="EVIDENCE_CONFLICT";
 else if(extra) reference="EXTRA_EFFECT";
 else if(!exact||!scope||watermark<attempt||!retention) reference="UNKNOWN_STOP";
 else if(positive) reference="HIT_STOP";
 else if(!permission) reference="DENY_STOP";
 else reference="RETRY_CONDITIONALLY";
 return {id,weak,reference};
}
function verifier(a) {
 const [id,exact,scope,watermark,attempt,retention,positive,extra,permission]=a;
 const covered=!!exact&&!!scope&&watermark>=attempt&&!!retention;
 if(positive&&scope&&watermark>=attempt)return "EVIDENCE_CONFLICT";
 if(extra)return "EXTRA_EFFECT";
 if(!covered)return "UNKNOWN_STOP";
 if(positive)return "HIT_STOP";
 if(!permission)return "DENY_STOP";
 return "RETRY_CONDITIONALLY";
}
const rows=fixtures.map(a=>({...producer(a),verifier:verifier(a)}));
const summary={rows:rows.length,weakRetry:rows.filter(x=>x.weak==="RETRY").length,referenceConditionalRetry:rows.filter(x=>x.reference==="RETRY_CONDITIONALLY").length,agreements:rows.filter(x=>x.reference===x.verifier).length};
console.log(JSON.stringify({fixtures,rows,summary}));
