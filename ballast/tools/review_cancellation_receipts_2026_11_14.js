"use strict";
// Post-producer maintainer reconstruction, not original 2026-11-14 source
// No effects, external APIs, retries or live authorities
const fixtures = [
  {
    "id": "valid",
    "required": [
      "a",
      "b"
    ],
    "receipts": [
      "a",
      "b"
    ],
    "grant": "valid",
    "permission": true,
    "miss": false,
    "extra": false,
    "guard": true
  },
  {
    "id": "duplicate",
    "required": [
      "a",
      "b"
    ],
    "receipts": [
      "a",
      "a"
    ],
    "grant": "valid",
    "permission": true,
    "miss": false,
    "extra": false,
    "guard": true
  },
  {
    "id": "conflict",
    "required": [
      "a",
      "b"
    ],
    "receipts": [
      "a",
      "b"
    ],
    "grant": "valid",
    "permission": true,
    "miss": true,
    "extra": false,
    "guard": true
  },
  {
    "id": "unseen_extra",
    "required": [
      "a",
      "b"
    ],
    "receipts": [
      "a",
      "b"
    ],
    "grant": "valid",
    "permission": true,
    "miss": false,
    "extra": true,
    "guard": true
  },
  {
    "id": "grant_invalid",
    "required": [
      "a",
      "b"
    ],
    "receipts": [
      "a",
      "b"
    ],
    "grant": "invalid",
    "permission": true,
    "miss": false,
    "extra": false,
    "guard": true
  },
  {
    "id": "post_read_drift",
    "required": [
      "a",
      "b"
    ],
    "receipts": [
      "a",
      "b"
    ],
    "grant": "valid",
    "permission": true,
    "miss": false,
    "extra": false,
    "guard": false
  },
  {
    "id": "cancelled",
    "required": [
      "a",
      "b"
    ],
    "receipts": [
      "a",
      "b"
    ],
    "grant": "valid",
    "permission": false,
    "miss": false,
    "extra": false,
    "guard": true
  }
];
const producer = function producer(c){
 const weak=c.receipts.length===c.required.length?"COMPLETE":"WAIT";
 let ref="COMPLETE";
 if(c.miss && c.receipts.length) ref="EVIDENCE_CONFLICT";
 else if(c.grant!=="valid") ref="BLOCKED";
 else if(c.extra||!c.guard) ref="UNKNOWN";
 else if(c.receipts.length!==new Set(c.receipts).size||c.required.length!==new Set(c.required).size||c.receipts.some(x=>!c.required.includes(x))||c.required.some(x=>!c.receipts.includes(x))) ref="MISMATCH";
 return {id:c.id,weak,ref,permission:c.permission?"ALLOW_NEW_EFFECT":"DENY_NEW_EFFECT"};
};
const primitiveRebuild = function primitiveRebuild(c){
 let ref="COMPLETE";
 const observed=new Map(),expected=new Map();
 for(const x of c.receipts)observed.set(x,(observed.get(x)||0)+1);
 for(const x of c.required)expected.set(x,(expected.get(x)||0)+1);
 let same=observed.size===expected.size;
 for(const [key,count] of expected.entries())if(observed.get(key)!==count)same=false;
 if(c.miss===true && c.receipts.length>0) ref="EVIDENCE_CONFLICT";
 else if(c.grant!=="valid") ref="BLOCKED";
 else if(c.extra===true||c.guard!==true) ref="UNKNOWN";
 else if(!same) ref="MISMATCH";
 return {id:c.id,weak:c.receipts.length===c.required.length?"COMPLETE":"WAIT",ref,permission:c.permission===true?"ALLOW_NEW_EFFECT":"DENY_NEW_EFFECT"};
};
const authorityAware = function authorityAware(c){
 if(c.miss===true && !c.coveredMiss) return "UNKNOWN_PRIOR_EFFECT";
 if(c.grant==="valid" && !c.issuerWitness) return "UNKNOWN_HISTORICAL_AUTHORITY";
 if(c.latentExtraEffect===true && c.extra!==true) return "UNKNOWN_UNOBSERVED_EFFECT";
 if(c.targetUid!==undefined && c.targetUid!==c.expectedTargetUid) return "MISMATCH_TARGET_INCARNATION";
 if(c.readMembershipRevision!==undefined && c.commitMembershipRevision!==c.readMembershipRevision) return "UNKNOWN_MEMBERSHIP_TOCTOU";
 if(!c.effectSetClosed) return "UNKNOWN_EFFECT_SET_CLOSURE";
 return primitiveRebuild(c).ref;
};
const probes = [
  {
    "id": "P1-omitted-extra-effect",
    "required": [
      "a",
      "b"
    ],
    "receipts": [
      "a",
      "b"
    ],
    "grant": "valid",
    "permission": true,
    "miss": false,
    "extra": false,
    "guard": true,
    "latentExtraEffect": true
  },
  {
    "id": "P2-forged-historical-issuer",
    "required": [
      "a",
      "b"
    ],
    "receipts": [
      "a",
      "b"
    ],
    "grant": "valid",
    "permission": true,
    "miss": false,
    "extra": false,
    "guard": true,
    "issuerWitness": false,
    "effectSetClosed": true
  },
  {
    "id": "P3-wrong-target-incarnation",
    "required": [
      "a",
      "b"
    ],
    "receipts": [
      "a",
      "b"
    ],
    "grant": "valid",
    "permission": true,
    "miss": false,
    "extra": false,
    "guard": true,
    "targetUid": "U14-recreated",
    "expectedTargetUid": "U14",
    "effectSetClosed": true,
    "issuerWitness": true
  },
  {
    "id": "P4-post-read-membership-drift",
    "required": [
      "a",
      "b"
    ],
    "receipts": [
      "a",
      "b"
    ],
    "grant": "valid",
    "permission": true,
    "miss": false,
    "extra": false,
    "guard": true,
    "readMembershipRevision": 1,
    "commitMembershipRevision": 2,
    "effectSetClosed": true,
    "issuerWitness": true
  },
  {
    "id": "P5-miss-coverage-not-proven",
    "required": [
      "a",
      "b"
    ],
    "receipts": [
      "a",
      "b"
    ],
    "grant": "valid",
    "permission": true,
    "miss": true,
    "extra": false,
    "guard": true,
    "coveredMiss": false,
    "issuerWitness": true,
    "effectSetClosed": true
  }
];
function review(){
  const original_case_inputs_and_rebuilt_outputs=fixtures.map(primitive=>({id:primitive.id,primitive,observed:producer(primitive),modelRebuild:primitiveRebuild(primitive)}));
  const adversarial_review_only_probes=probes.map(c=>({id:c.id,originalModel:producer(c).ref,coverageAwareReview:authorityAware(c),challenge:c.id}));
  const limited_rebuild_agreements=original_case_inputs_and_rebuilt_outputs.filter(c=>JSON.stringify(c.observed)===JSON.stringify(c.modelRebuild)).length;
  const weak_reference_divergences=original_case_inputs_and_rebuilt_outputs.filter(c=>c.observed.weak!==c.observed.ref).length;
  if(new Set(fixtures.map(c=>c.id)).size!==7 || limited_rebuild_agreements!==7 || weak_reference_divergences!==5 || adversarial_review_only_probes.length!==5 || adversarial_review_only_probes.some(p=>p.originalModel===p.coverageAwareReview)) throw new Error("Review reconstruction assertion failure");
  return {original_case_inputs_and_rebuilt_outputs,adversarial_review_only_probes,summary:{model_cases:7,weak_reference_divergences,limited_rebuild_agreements,adversarial_probes:5,real_effect_calls:0,real_receipt_queries:0,new_daily_credit:0,new_independent_original_windows:0}};
}
if(typeof module !== "undefined" && module && require.main===module){console.log(JSON.stringify(review(),null,2));}
