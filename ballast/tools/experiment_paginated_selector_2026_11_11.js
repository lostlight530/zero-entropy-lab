// Ballast 2026-11-11 bounded synthetic producer, Node.js-compatible, no external effects
// Run: node ballast/tools/experiment_paginated_selector_2026_11_11.js
const cases=[
  {
    "id": "valid",
    "pages": [
      [
        "A"
      ],
      [
        "B"
      ]
    ],
    "snapshot": [
      10,
      10
    ],
    "complete": true,
    "continuation": true,
    "member": [
      "A",
      "B"
    ],
    "memberUid": [
      "a1",
      "b1"
    ],
    "query": true,
    "grant": true,
    "positive": true,
    "negative": false,
    "protected": true
  },
  {
    "id": "page-expired-410",
    "pages": [
      [
        "A"
      ],
      [
        "B"
      ]
    ],
    "snapshot": [
      10,
      11
    ],
    "complete": true,
    "continuation": false,
    "member": [
      "A",
      "B"
    ],
    "memberUid": [
      "a1",
      "b1"
    ],
    "query": true,
    "grant": true,
    "positive": true,
    "negative": false,
    "protected": true
  },
  {
    "id": "mixed-page-same-count",
    "pages": [
      [
        "A"
      ],
      [
        "C"
      ]
    ],
    "snapshot": [
      10,
      11
    ],
    "complete": true,
    "continuation": false,
    "member": [
      "A",
      "C"
    ],
    "memberUid": [
      "a1",
      "c1"
    ],
    "query": true,
    "grant": true,
    "positive": true,
    "negative": false,
    "protected": true
  },
  {
    "id": "partial-pagination",
    "pages": [
      [
        "A"
      ],
      []
    ],
    "snapshot": [
      10,
      10
    ],
    "complete": false,
    "continuation": true,
    "member": [
      "A"
    ],
    "memberUid": [
      "a1"
    ],
    "query": true,
    "grant": true,
    "positive": true,
    "negative": false,
    "protected": true
  },
  {
    "id": "reincarnated-B",
    "pages": [
      [
        "A"
      ],
      [
        "B"
      ]
    ],
    "snapshot": [
      10,
      10
    ],
    "complete": true,
    "continuation": true,
    "member": [
      "A",
      "B"
    ],
    "memberUid": [
      "a1",
      "b2"
    ],
    "query": true,
    "grant": true,
    "positive": true,
    "negative": false,
    "protected": true
  },
  {
    "id": "query-unknown",
    "pages": [
      [
        "A"
      ],
      [
        "B"
      ]
    ],
    "snapshot": [
      10,
      10
    ],
    "complete": true,
    "continuation": true,
    "member": [
      "A",
      "B"
    ],
    "memberUid": [
      "a1",
      "b1"
    ],
    "query": false,
    "grant": true,
    "positive": true,
    "negative": false,
    "protected": true
  },
  {
    "id": "positive-negative-conflict",
    "pages": [
      [
        "A"
      ],
      [
        "B"
      ]
    ],
    "snapshot": [
      10,
      10
    ],
    "complete": true,
    "continuation": true,
    "member": [
      "A",
      "B"
    ],
    "memberUid": [
      "a1",
      "b1"
    ],
    "query": true,
    "grant": true,
    "positive": true,
    "negative": true,
    "protected": true
  },
  {
    "id": "effect-time-revoked",
    "pages": [
      [
        "A"
      ],
      [
        "B"
      ]
    ],
    "snapshot": [
      10,
      10
    ],
    "complete": true,
    "continuation": true,
    "member": [
      "A",
      "B"
    ],
    "memberUid": [
      "a1",
      "b1"
    ],
    "query": true,
    "grant": false,
    "positive": true,
    "negative": false,
    "protected": true
  },
  {
    "id": "completion-race",
    "pages": [
      [
        "A"
      ],
      [
        "B"
      ]
    ],
    "snapshot": [
      10,
      10
    ],
    "complete": true,
    "continuation": true,
    "member": [
      "A",
      "B"
    ],
    "memberUid": [
      "a1",
      "b1"
    ],
    "query": true,
    "grant": true,
    "positive": true,
    "negative": false,
    "protected": false
  }
];
function reference(x){if(x.positive&&x.negative)return "EVIDENCE_CONFLICT";if(!x.grant)return "UNAUTHORIZED_OCCURRENCE";if(!x.query||!x.complete||!x.continuation||x.snapshot[0]!==x.snapshot[1]||!x.protected)return "STOP_UNKNOWN";if(x.member.join(",")!=="A,B"||x.memberUid.join(",")!=="a1,b1")return "MEMBERSHIP_MISMATCH";return "COMPLETE"}
function verifier(x){if(x.negative&&x.positive)return "EVIDENCE_CONFLICT";if(x.grant===false)return "UNAUTHORIZED_OCCURRENCE";const covered=x.query&&x.complete&&x.continuation&&new Set(x.snapshot).size===1&&x.protected;if(!covered)return "STOP_UNKNOWN";const expected=new Map([["A","a1"],["B","b1"]]);const observed=x.member.map((name,i)=>[name,x.memberUid[i]]);return observed.length===2&&observed.every(([name,uid])=>expected.get(name)===uid)&&new Set(observed.map(a=>a[0])).size===2?"COMPLETE":"MEMBERSHIP_MISMATCH"}
const rows=cases.map(x=>({...x,weak:x.pages.flat().length>=2?"COMPLETE":"STOP",reference:reference(x),verifier:verifier(x)}));
if(new Set(rows.map(x=>x.id)).size!==rows.length||rows.some(x=>x.reference!==x.verifier))throw Error("identity or verdict mismatch");
console.log(JSON.stringify({rows,summary:{scenarios:rows.length,decisions:rows.length*3,weak_disagreements:rows.filter(x=>x.weak!==x.reference).length,verifier_agreements:rows.filter(x=>x.reference===x.verifier).length}},null,2));
