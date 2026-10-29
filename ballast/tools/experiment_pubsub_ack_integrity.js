// Ballast 2026-10-30, bounded synthetic Pub/Sub acknowledgement integrity
"use strict";
const BASE={
  "task": {
    "id": "task30",
    "run": "run30",
    "intent": "publish30",
    "target": "target30",
    "targetUid": "uid30"
  },
  "delivery": {
    "subscription": "sub30",
    "message": "msg30",
    "region": "us-central1",
    "subscriberRegion": "us-central1",
    "latestAck": "ack2",
    "usedAck": "ack2",
    "ack": "SUCCESS",
    "deadline": 50,
    "ackAt": 40,
    "deliveryAt": 10
  },
  "required": [
    "A",
    "B"
  ],
  "query": {
    "kind": "HIT",
    "covered": true,
    "exact": true,
    "scopeMessage": "msg30",
    "scopeTargetUid": "uid30",
    "scopeMembers": [
      "A",
      "B"
    ],
    "watermark": 90,
    "queryAt": 90,
    "retentionUntil": 150,
    "lifecycle": "ACTIVE"
  },
  "receipts": [
    {
      "member": "A",
      "effect": "A1",
      "message": "msg30",
      "targetUid": "uid30",
      "effectAt": 20,
      "grantFrom": 5,
      "grantUntil": 60
    },
    {
      "member": "B",
      "effect": "B1",
      "message": "msg30",
      "targetUid": "uid30",
      "effectAt": 25,
      "grantFrom": 5,
      "grantUntil": 60
    }
  ],
  "current": {
    "uid": "uid30",
    "members": [
      "A",
      "B"
    ],
    "revision": 7,
    "observedRevision": 7,
    "guardedRevision": 7,
    "state": "SATISFIED",
    "predicateComplete": true,
    "protected": true,
    "readAt": 80,
    "guardAt": 95,
    "commitAt": 100
  },
  "permission": {
    "allow": true,
    "protected": true
  }
};
const MUTATIONS={
  "baseline": {},
  "ack_failed": {
    "delivery.ack": "FAILED"
  },
  "ack_stale_id": {
    "delivery.usedAck": "ack1"
  },
  "ack_region_drift": {
    "delivery.subscriberRegion": "europe-west1"
  },
  "ack_out_of_order": {
    "delivery.ackAt": 5
  },
  "ack_deadline_expired": {
    "delivery.ackAt": 51
  },
  "receipt_missing_B": {
    "receipts": [
      {
        "member": "A",
        "effect": "A1",
        "message": "msg30",
        "targetUid": "uid30",
        "effectAt": 20,
        "grantFrom": 5,
        "grantUntil": 60
      }
    ]
  },
  "receipt_duplicate_A": {
    "receipts": [
      {
        "member": "A",
        "effect": "A1",
        "message": "msg30",
        "targetUid": "uid30",
        "effectAt": 20,
        "grantFrom": 5,
        "grantUntil": 60
      },
      {
        "member": "A",
        "effect": "A1",
        "message": "msg30",
        "targetUid": "uid30",
        "effectAt": 20,
        "grantFrom": 5,
        "grantUntil": 60
      }
    ]
  },
  "receipt_equal_count_A_C": {
    "receipts": [
      {
        "member": "A",
        "effect": "A1",
        "message": "msg30",
        "targetUid": "uid30",
        "effectAt": 20,
        "grantFrom": 5,
        "grantUntil": 60
      },
      {
        "member": "C",
        "effect": "C1",
        "message": "msg30",
        "targetUid": "uid30",
        "effectAt": 25,
        "grantFrom": 5,
        "grantUntil": 60
      }
    ]
  },
  "receipt_extra_C": {
    "receipts": [
      {
        "member": "A",
        "effect": "A1",
        "message": "msg30",
        "targetUid": "uid30",
        "effectAt": 20,
        "grantFrom": 5,
        "grantUntil": 60
      },
      {
        "member": "B",
        "effect": "B1",
        "message": "msg30",
        "targetUid": "uid30",
        "effectAt": 25,
        "grantFrom": 5,
        "grantUntil": 60
      },
      {
        "member": "C",
        "effect": "C1",
        "message": "msg30",
        "targetUid": "uid30",
        "effectAt": 25,
        "grantFrom": 5,
        "grantUntil": 60
      }
    ]
  },
  "receipt_wrong_message": {
    "receipts.1.message": "other-msg"
  },
  "receipt_wrong_target": {
    "receipts.1.targetUid": "other-uid"
  },
  "receipt_auth_expired": {
    "receipts.1.grantUntil": 24
  },
  "receipt_auth_not_yet": {
    "receipts.1.grantFrom": 26
  },
  "query_unknown": {
    "query.kind": "UNKNOWN"
  },
  "query_miss_conflict": {
    "query.kind": "MISS"
  },
  "query_uncovered": {
    "query.covered": false
  },
  "query_expired_retention": {
    "query.retentionUntil": 80
  },
  "query_wrong_scope": {
    "query.scopeMembers": [
      "A",
      "C"
    ]
  },
  "membership_replaced": {
    "current.members": [
      "A",
      "C"
    ]
  },
  "current_uid_changed": {
    "current.uid": "uid-new"
  },
  "current_revision_drift": {
    "current.guardedRevision": 8
  },
  "current_guard_unprotected": {
    "current.protected": false
  },
  "current_read_after_guard": {
    "current.readAt": 96
  },
  "current_predicate_incomplete": {
    "current.predicateComplete": false
  },
  "current_unsatisfied": {
    "current.state": "UNSATISFIED"
  },
  "message_republished_new_id": {
    "delivery.message": "msg-new"
  },
  "no_receipt_covered_miss_retry": {
    "receipts": [],
    "query.kind": "MISS",
    "current.state": "UNSATISFIED"
  },
  "no_receipt_unknown": {
    "receipts": [],
    "query.kind": "UNKNOWN",
    "current.state": "UNSATISFIED"
  },
  "no_receipt_miss_permission_denied": {
    "receipts": [],
    "query.kind": "MISS",
    "current.state": "UNSATISFIED",
    "permission.allow": false
  },
  "no_receipt_miss_guard_missing": {
    "receipts": [],
    "query.kind": "MISS",
    "current.state": "UNSATISFIED",
    "current.protected": false
  },
  "grant_revoked_after_effect": {
    "receipts.0.grantUntil": 21,
    "receipts.1.grantUntil": 26
  }
};
function expand(base, mutations){
 return Object.entries(mutations).map(([id,patch])=>{
  const facts=JSON.parse(JSON.stringify(base));
  for(const [path,value] of Object.entries(patch)){
   const bits=path.split(".");let node=facts;
   for(let i=0;i<bits.length-1;i++) node=node[bits[i]];
   node[bits[bits.length-1]]=JSON.parse(JSON.stringify(value));
  }
  return {id,facts};
 });
}
function reference(s){
 const {task,delivery:d,required,query:q,receipts:r,current:c,permission:p}=s;
 const equal=(a,b)=>a.length===b.length&&new Set(a).size===a.length&&a.every(x=>b.includes(x));
 const queryValid=q.covered===true&&q.exact===true&&q.lifecycle==="ACTIVE"&&q.scopeMessage===d.message&&q.scopeTargetUid===task.targetUid&&equal(q.scopeMembers,required)&&q.watermark>=Math.max(...r.map(x=>x.effectAt),0)&&q.queryAt<=q.watermark&&q.retentionUntil>=q.queryAt;
 if(q.kind==="MISS"&&r.length>0&&queryValid)return "EVIDENCE_CONFLICT";
 if(!queryValid||!["HIT","MISS"].includes(q.kind))return "STOP_UNKNOWN";
 const guard=c.uid===task.targetUid&&equal(c.members,required)&&c.predicateComplete===true&&c.protected===true&&c.revision===c.observedRevision&&c.revision===c.guardedRevision&&c.readAt<c.guardAt&&c.guardAt<c.commitAt;
 if(q.kind==="MISS"){
  if(r.length)return "STOP_UNKNOWN";
  return p.allow===true&&p.protected===true&&guard&&c.state==="UNSATISFIED"?"RETRY_ALLOWED":"STOP_UNKNOWN";
 }
 if(r.length===0)return "STOP_UNKNOWN";
 if(!equal(r.map(x=>x.member),required)||r.some(x=>x.message!==d.message||x.targetUid!==task.targetUid||!x.effect))return "RECONCILE";
 if(r.some(x=>!(x.grantFrom<=x.effectAt&&x.effectAt<=x.grantUntil)))return "BLOCKED";
 if(!(d.ack==="SUCCESS"&&d.usedAck===d.latestAck&&d.region===d.subscriberRegion&&d.deliveryAt<=d.ackAt&&d.ackAt<=d.deadline))return "RECONCILE";
 if(!guard||c.state!=="SATISFIED")return "RECONCILE";
 return "COMPLETE";
}
function produce(){const scenarios=expand(BASE,MUTATIONS);const rows=scenarios.flatMap(({id,facts})=>[{scenario:id,path:"ack_proxy",decision:facts.delivery.ack==="SUCCESS"?"COMPLETE":"STOP_UNKNOWN"},{scenario:id,path:"message_proxy",decision:facts.delivery.message?"COMPLETE":"STOP_UNKNOWN"},{scenario:id,path:"full_reference",decision:reference(facts)}]);return {scenarios,rows};}
if(typeof require!=="undefined"&&require.main===module){const result=produce();process.stdout.write(JSON.stringify(result,null,2)+"\n");}
if(typeof module!=="undefined")module.exports={produce,reference};
