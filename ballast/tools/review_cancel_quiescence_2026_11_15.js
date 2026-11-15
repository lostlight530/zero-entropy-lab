"use strict";
// 2026-11-15 maintainer-only adversarial review, NOT original Daily producer
// All evidence witnesses are authored synthetic inputs, no external authority or live effects
const probes = [
  {
    "id": "P01-miss-before-receipt",
    "events": [
      [
        "dispatch",
        "a"
      ],
      [
        "commit",
        "a",
        1
      ],
      [
        "covered_miss",
        "a"
      ],
      [
        "receipt",
        "a"
      ],
      [
        "cancel_request"
      ],
      [
        "cancel_ack"
      ],
      [
        "fence",
        2
      ],
      [
        "inflight_zero"
      ],
      [
        "closure",
        2
      ]
    ],
    "identity": {
      "task": "T15",
      "run": "R15",
      "attempt": "A15",
      "targetUid": "U15"
    },
    "proof": {
      "effectSetComplete": true,
      "issuerBound": true,
      "protectedCommit": true,
      "missQuery": {
        "scopeExact": true,
        "visibilityCovered": true,
        "retentionCovered": true,
        "independentAuthority": true
      }
    }
  },
  {
    "id": "P02-ack-before-request",
    "events": [
      [
        "dispatch",
        "a"
      ],
      [
        "commit",
        "a",
        1
      ],
      [
        "receipt",
        "a"
      ],
      [
        "cancel_ack"
      ],
      [
        "cancel_request"
      ],
      [
        "fence",
        2
      ],
      [
        "inflight_zero"
      ],
      [
        "closure",
        2
      ]
    ],
    "identity": {
      "task": "T15",
      "run": "R15",
      "attempt": "A15",
      "targetUid": "U15"
    },
    "proof": {
      "effectSetComplete": true,
      "issuerBound": true,
      "protectedCommit": true,
      "missQuery": {
        "scopeExact": true,
        "visibilityCovered": true,
        "retentionCovered": true,
        "independentAuthority": true
      }
    }
  },
  {
    "id": "P03-unbound-epoch",
    "events": [
      [
        "dispatch",
        "a"
      ],
      [
        "cancel_request"
      ],
      [
        "cancel_ack"
      ],
      [
        "fence",
        2
      ],
      [
        "commit",
        "a"
      ],
      [
        "receipt",
        "a"
      ],
      [
        "inflight_zero"
      ],
      [
        "closure",
        2
      ]
    ],
    "identity": {
      "task": "T15",
      "run": "R15",
      "attempt": "A15",
      "targetUid": "U15"
    },
    "proof": {
      "effectSetComplete": true,
      "issuerBound": true,
      "protectedCommit": true,
      "missQuery": {
        "scopeExact": true,
        "visibilityCovered": true,
        "retentionCovered": true,
        "independentAuthority": true
      }
    }
  },
  {
    "id": "P04-future-epoch",
    "events": [
      [
        "dispatch",
        "a"
      ],
      [
        "commit",
        "a",
        999
      ],
      [
        "receipt",
        "a"
      ],
      [
        "cancel_request"
      ],
      [
        "cancel_ack"
      ],
      [
        "fence",
        2
      ],
      [
        "inflight_zero"
      ],
      [
        "closure",
        2
      ]
    ],
    "identity": {
      "task": "T15",
      "run": "R15",
      "attempt": "A15",
      "targetUid": "U15"
    },
    "proof": {
      "effectSetComplete": true,
      "issuerBound": true,
      "protectedCommit": true,
      "missQuery": {
        "scopeExact": true,
        "visibilityCovered": true,
        "retentionCovered": true,
        "independentAuthority": true
      }
    }
  },
  {
    "id": "P05-duplicate-commit-single-receipt",
    "events": [
      [
        "dispatch",
        "a"
      ],
      [
        "commit",
        "a",
        1
      ],
      [
        "commit",
        "a",
        1
      ],
      [
        "receipt",
        "a"
      ],
      [
        "cancel_request"
      ],
      [
        "cancel_ack"
      ],
      [
        "fence",
        2
      ],
      [
        "inflight_zero"
      ],
      [
        "closure",
        2
      ]
    ],
    "identity": {
      "task": "T15",
      "run": "R15",
      "attempt": "A15",
      "targetUid": "U15"
    },
    "proof": {
      "effectSetComplete": true,
      "issuerBound": true,
      "protectedCommit": true,
      "missQuery": {
        "scopeExact": true,
        "visibilityCovered": true,
        "retentionCovered": true,
        "independentAuthority": true
      }
    }
  },
  {
    "id": "P06-closure-before-inflight-zero",
    "events": [
      [
        "dispatch",
        "a"
      ],
      [
        "commit",
        "a",
        1
      ],
      [
        "receipt",
        "a"
      ],
      [
        "cancel_request"
      ],
      [
        "cancel_ack"
      ],
      [
        "fence",
        2
      ],
      [
        "closure",
        2
      ],
      [
        "inflight_zero"
      ]
    ],
    "identity": {
      "task": "T15",
      "run": "R15",
      "attempt": "A15",
      "targetUid": "U15"
    },
    "proof": {
      "effectSetComplete": true,
      "issuerBound": true,
      "protectedCommit": true,
      "missQuery": {
        "scopeExact": true,
        "visibilityCovered": true,
        "retentionCovered": true,
        "independentAuthority": true
      }
    }
  },
  {
    "id": "P07-wrong-target-incarnation",
    "events": [
      [
        "dispatch",
        "a"
      ],
      [
        "commit",
        "a",
        1
      ],
      [
        "receipt",
        "a"
      ],
      [
        "cancel_request"
      ],
      [
        "cancel_ack"
      ],
      [
        "fence",
        2
      ],
      [
        "inflight_zero"
      ],
      [
        "closure",
        2
      ]
    ],
    "identity": {
      "task": "T15",
      "run": "R15",
      "attempt": "A15",
      "targetUid": "U15-recreated"
    },
    "proof": {
      "effectSetComplete": true,
      "issuerBound": true,
      "protectedCommit": true,
      "missQuery": {
        "scopeExact": true,
        "visibilityCovered": true,
        "retentionCovered": true,
        "independentAuthority": true
      }
    }
  },
  {
    "id": "P08-no-external-effect-set-proof",
    "events": [
      [
        "dispatch",
        "a"
      ],
      [
        "commit",
        "a",
        1
      ],
      [
        "receipt",
        "a"
      ],
      [
        "cancel_request"
      ],
      [
        "cancel_ack"
      ],
      [
        "fence",
        2
      ],
      [
        "inflight_zero"
      ],
      [
        "closure",
        2
      ]
    ],
    "identity": {
      "task": "T15",
      "run": "R15",
      "attempt": "A15",
      "targetUid": "U15"
    },
    "proof": {
      "effectSetComplete": false,
      "issuerBound": true,
      "protectedCommit": true,
      "missQuery": {
        "scopeExact": true,
        "visibilityCovered": true,
        "retentionCovered": true,
        "independentAuthority": true
      }
    }
  },
  {
    "id": "P09-unauthenticated-miss",
    "events": [
      [
        "dispatch",
        "a"
      ],
      [
        "commit",
        "a",
        1
      ],
      [
        "receipt",
        "a"
      ],
      [
        "covered_miss",
        "a"
      ],
      [
        "cancel_request"
      ],
      [
        "cancel_ack"
      ],
      [
        "fence",
        2
      ],
      [
        "inflight_zero"
      ],
      [
        "closure",
        2
      ]
    ],
    "identity": {
      "task": "T15",
      "run": "R15",
      "attempt": "A15",
      "targetUid": "U15"
    },
    "proof": {
      "effectSetComplete": true,
      "issuerBound": true,
      "protectedCommit": true,
      "missQuery": {
        "scopeExact": true,
        "visibilityCovered": false,
        "retentionCovered": false,
        "independentAuthority": false
      }
    }
  },
  {
    "id": "P10-extra-after-closure",
    "events": [
      [
        "dispatch",
        "a"
      ],
      [
        "commit",
        "a",
        1
      ],
      [
        "receipt",
        "a"
      ],
      [
        "cancel_request"
      ],
      [
        "cancel_ack"
      ],
      [
        "fence",
        2
      ],
      [
        "inflight_zero"
      ],
      [
        "closure",
        2
      ],
      [
        "commit",
        "c",
        1
      ]
    ],
    "identity": {
      "task": "T15",
      "run": "R15",
      "attempt": "A15",
      "targetUid": "U15"
    },
    "proof": {
      "effectSetComplete": true,
      "issuerBound": true,
      "protectedCommit": true,
      "missQuery": {
        "scopeExact": true,
        "visibilityCovered": true,
        "retentionCovered": true,
        "independentAuthority": true
      }
    }
  },
  {
    "id": "P11-synthetic-authorized-control",
    "events": [
      [
        "dispatch",
        "a"
      ],
      [
        "commit",
        "a",
        1
      ],
      [
        "receipt",
        "a"
      ],
      [
        "cancel_request"
      ],
      [
        "cancel_ack"
      ],
      [
        "fence",
        2
      ],
      [
        "inflight_zero"
      ],
      [
        "closure",
        2
      ]
    ],
    "identity": {
      "task": "T15",
      "run": "R15",
      "attempt": "A15",
      "targetUid": "U15"
    },
    "proof": {
      "effectSetComplete": true,
      "issuerBound": true,
      "protectedCommit": true,
      "missQuery": {
        "scopeExact": true,
        "visibilityCovered": true,
        "retentionCovered": true,
        "independentAuthority": true
      }
    }
  }
];
function reviewPrimitive(c){
 const ev=c.events;
 const positions={};
 for(let i=0;i<ev.length;i++){const type=ev[i][0];(positions[type]??=[]).push(i)}
 const commits=new Map(),receipts=new Map();
 for(const e of ev){if(e[0]==="commit")commits.set(e[1],(commits.get(e[1])||0)+1);if(e[0]==="receipt")receipts.set(e[1],(receipts.get(e[1])||0)+1)}
 const first=k=>positions[k]?.[0]??-1;
 const only=k=>(positions[k]||[]).length===1;
 const fail=r=>({id:c.id,decision:r});
 if([...commits.keys(),...receipts.keys()].some(x=>x!=="a"))return fail("EXTRA_EFFECT");
 if([...commits.values()].some(n=>n!==1))return fail("DUPLICATE_COMMIT");
 if([...receipts.values()].some(n=>n!==1))return fail("DUPLICATE_RECEIPT");
 if(c.identity.task!=="T15"||c.identity.run!=="R15"||c.identity.attempt!=="A15"||c.identity.targetUid!=="U15")return fail("MISMATCH_TARGET_IDENTITY");
 const negative=ev.filter(x=>x[0]==="covered_miss").map(x=>x[1]);
 if(negative.length){
  const q=c.proof.missQuery||{};
  if(!q.scopeExact||!q.visibilityCovered||!q.retentionCovered||!q.independentAuthority)return fail("UNKNOWN_PRIOR_EFFECT");
  if(negative.some(x=>receipts.has(x)))return fail("EVIDENCE_CONFLICT");
 }
 if([...commits.values()].some(n=>n>1))return fail("DUPLICATE_COMMIT");
 const wrongEpoch=ev.filter(x=>x[0]==="commit").some(x=>x.length<3||x[2]!==1);
 if(wrongEpoch)return fail("UNKNOWN_OR_MISMATCHED_EFFECT_EPOCH");
 if(!["cancel_request","cancel_ack","fence","inflight_zero","closure"].every(only))return fail("UNKNOWN_QUIESCENCE");
 if(!(first("cancel_request")<first("cancel_ack") && first("cancel_ack")<first("fence")&&first("fence")<first("inflight_zero")&&first("inflight_zero")<first("closure")))return fail("INVALID_CANCEL_OR_CLOSURE_ORDER");
 if(ev.some((x,i)=>i>first("closure")&&["commit","receipt","membership_revision"].includes(x[0])))return fail("POST_CLOSURE_DRIFT");
 if(commits.size!==1||receipts.size!==1||!commits.has("a")||!receipts.has("a"))return fail("UNKNOWN_PRIOR_EFFECT");
 if(!c.proof.effectSetComplete||!c.proof.issuerBound||!c.proof.protectedCommit)return fail("UNKNOWN_AUTHORITY_OR_EFFECT_SET");
 return fail("MODEL_QUIESCENT");
}
function review(){
const rows=probes.map(c=>({id:c.id,fixture:c,separateReview:reviewPrimitive(c)}));
if(new Set(rows.map(x=>x.id)).size!==rows.length)throw new Error("duplicate probe identities");
if(rows.length!==11||rows.filter(x=>x.separateReview.decision==="MODEL_QUIESCENT").length!==1)throw new Error("review guard failed");
return rows;
}
if(typeof module!=="undefined" && module && require.main===module)console.log(JSON.stringify(review(),null,2));
