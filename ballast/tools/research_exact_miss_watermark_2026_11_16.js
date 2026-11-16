// Same-day bounded model and non-credit review probes, not an effect sink or authority query
const fixtures = [["covered_exact_miss",1,1,12,10,1,0,0,1],["global_watermark_only",1,0,12,10,1,0,0,1],["lagging_watermark",1,1,9,10,1,0,0,1],["expired_retention",1,1,12,10,0,0,0,1],["positive_miss_conflict",1,1,12,10,1,1,0,1],["extra_effect_member",1,1,12,10,1,0,1,1],["revoked_current_permission",1,1,12,10,1,0,0,0],["missing_exact_identity",0,1,12,10,1,0,0,1]];
const boundaryFixtures = [
 ["positive_unbound_identity",0,1,12,10,1,1,0,1],
 ["positive_expired_negative_witness",1,1,12,10,0,1,0,1],
 ["positive_lagging_negative_witness",1,1,9,10,1,1,0,1]
];
function producer(a) {
 const [id,exact,scope,watermark,attempt,retention,positive,extra,permission]=a;
 const weak=watermark>=attempt?"RETRY":"STOP";
 const negativeCovered=!!exact&&!!scope&&watermark>=attempt&&!!retention;
 let reference;
 if (positive&&negativeCovered) reference="EVIDENCE_CONFLICT";
 else if (extra) reference="EXTRA_EFFECT";
 else if (!exact) reference="UNKNOWN_STOP";
 else if (positive) reference="HIT_STOP";
 else if (!negativeCovered) reference="UNKNOWN_STOP";
 else if (!permission) reference="DENY_STOP";
 else reference="RETRY_CONDITIONALLY";
 return {id,weak,reference};
}
// Independent implementation over the same authored fields and shared semantic contract
function verifier(a) {
 const [id,exact,scope,watermark,attempt,retention,positive,extra,permission]=a;
 const uncovered=!exact||!scope||watermark<attempt||!retention;
 if (positive&&!uncovered) return "EVIDENCE_CONFLICT";
 if (extra) return "EXTRA_EFFECT";
 if (!exact) return "UNKNOWN_STOP";
 if (positive) return "HIT_STOP";
 if (uncovered) return "UNKNOWN_STOP";
 if (!permission) return "DENY_STOP";
 return "RETRY_CONDITIONALLY";
}
const adjudicate=a=>({...producer(a),verifier:verifier(a)});
const rows=fixtures.map(adjudicate);
const summary={
 rows:rows.length,
 weakRetry:rows.filter(x=>x.weak==="RETRY").length,
 referenceConditionalRetry:rows.filter(x=>x.reference==="RETRY_CONDITIONALLY").length,
 agreements:rows.filter(x=>x.reference===x.verifier).length
};
const boundaryRows=boundaryFixtures.map(adjudicate);
const expected={
 positive_unbound_identity:"UNKNOWN_STOP",
 positive_expired_negative_witness:"HIT_STOP",
 positive_lagging_negative_witness:"HIT_STOP"
};
const ids=[...fixtures,...boundaryFixtures].map(a=>a[0]);
if (new Set(ids).size!==ids.length) throw new Error("duplicate scenario identity");
for (const row of [...rows,...boundaryRows]) {
 if (row.reference!==row.verifier) throw new Error("limited verifier mismatch "+row.id);
}
for (const row of boundaryRows) {
 if (row.reference!==expected[row.id]) throw new Error("boundary contract regression "+row.id);
}
// Attacker adds a primitive fact omitted from the reference input contract
const authorityGap={
 id:"forged_authority_provenance",
 modelReference:producer(["forged_authority_provenance",1,1,12,10,1,0,0,1]).reference,
 omittedFact:"negative witness issuer and scope authority not authenticated",
 strongerContract:"UNKNOWN_STOP",
 kind:"SYNTHETIC_REFERENCE_GAP"
};
if (authorityGap.modelReference!=="RETRY_CONDITIONALLY") throw new Error("reference gap no longer reproduced");
console.log(JSON.stringify({fixtures,rows,summary,review:{boundaryFixtures,boundaryRows,authorityGap}}));
