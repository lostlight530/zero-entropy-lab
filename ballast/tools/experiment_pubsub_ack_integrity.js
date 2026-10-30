// Ballast 2026-10-30, bounded synthetic Pub/Sub acknowledgement integrity
"use strict";
const BASE={
  "task": {
    "id": "task30",
    "run": "run30",
    "intent": "publish30",
    "target": "target30",
    "targetUid": "uid30",
    "attempt": 2,
    "effects": [
      {
        "member": "A",
        "id": "A1"
      },
      {
        "member": "B",
        "id": "B1"
      }
    ]
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
    "deliveryAt": 10,
    "attempt": 2,
    "subscriptionType": "PULL",
    "exactlyOnce": true,
    "ackGeneration": 2,
    "latestGeneration": 2
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
    "lifecycle": "ACTIVE",
    "scopeTask": "task30",
    "scopeRun": "run30",
    "scopeIntent": "publish30",
    "scopeTarget": "target30",
    "scopeSubscription": "sub30",
    "scopeRegion": "us-central1",
    "scopeEffects": [
      "A:A1",
      "B:B1"
    ],
    "scopeAttempts": [
      1,
      2
    ],
    "attemptEnd": 75
  },
  "receipts": [
    {
      "member": "A",
      "effect": "A1",
      "message": "msg30",
      "targetUid": "uid30",
      "effectAt": 20,
      "grantFrom": 5,
      "grantUntil": 60,
      "task": "task30",
      "run": "run30",
      "intent": "publish30",
      "target": "target30",
      "subscription": "sub30",
      "attempt": 2,
      "revokedAt": null
    },
    {
      "member": "B",
      "effect": "B1",
      "message": "msg30",
      "targetUid": "uid30",
      "effectAt": 25,
      "grantFrom": 5,
      "grantUntil": 60,
      "task": "task30",
      "run": "run30",
      "intent": "publish30",
      "target": "target30",
      "subscription": "sub30",
      "attempt": 2,
      "revokedAt": null
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
    "commitAt": 100,
    "scopeTask": "task30",
    "scopeRun": "run30",
    "scopeIntent": "publish30",
    "scopeTarget": "target30",
    "scopeSubscription": "sub30",
    "scopeEffects": [
      "A:A1",
      "B:B1"
    ]
  },
  "permission": {
    "allow": true,
    "protected": true,
    "guardAt": 98,
    "scope": {
      "task": "task30",
      "run": "run30",
      "intent": "publish30",
      "targetUid": "uid30",
      "subscription": "sub30",
      "attempt": 2
    }
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
  },
  "adversarial_task_id_drift": {
    "task.id": "other"
  },
  "adversarial_run_drift": {
    "task.run": "other"
  },
  "adversarial_intent_drift": {
    "task.intent": "other"
  },
  "adversarial_subscription_drift": {
    "delivery.subscription": "other"
  },
  "adversarial_duplicate_effect_id": {
    "receipts.1.effect": "A1"
  },
  "adversarial_future_query": {
    "query.queryAt": 101,
    "query.watermark": 101
  },
  "adversarial_fractional_watermark": {
    "query.queryAt": 90.5,
    "query.watermark": 90.5
  },
  "adversarial_grant_type_string": {
    "receipts.0.grantFrom": "5"
  },
  "adversarial_retry_wrong_run": {
    "receipts": [],
    "query.kind": "MISS",
    "current.state": "UNSATISFIED",
    "task.run": "other"
  },
  "adversarial_retry_future_query": {
    "receipts": [],
    "query.kind": "MISS",
    "current.state": "UNSATISFIED",
    "query.queryAt": 101,
    "query.watermark": 101
  },
  "adversarial_completion_scope_drift": {
    "current.scopeTask": "other"
  },
  "adversarial_delivery_attempt_three": {
    "delivery.attempt": 3
  },
  "adversarial_receipt_attempt_three": {
    "receipts.1.attempt": 3
  },
  "adversarial_push_subscription": {
    "delivery.subscriptionType": "PUSH"
  },
  "adversarial_grant_revoked_before_effect": {
    "receipts.1.revokedAt": 24
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
 const {task:t,delivery:d,required:req,query:q,receipts:r,current:c,permission:p}=s;
 const nat=x=>typeof x==="number"&&Number.isSafeInteger(x)&&x>=0,uniq=x=>Array.isArray(x)&&new Set(x).size===x.length;
 const same=(a,b)=>uniq(a)&&uniq(b)&&a.length===b.length&&a.every(x=>b.includes(x));
 const effects=Array.isArray(t.effects)?t.effects.map(x=>x.member+":"+x.id):[];
 if(!same(req,["A","B"])||!same(effects,["A:A1","B:B1"])||!Array.isArray(r)||!Array.isArray(c.members))return "STOP_UNKNOWN";
 if(![t.attempt,d.attempt,d.deadline,d.ackAt,d.deliveryAt,d.ackGeneration,d.latestGeneration,q.watermark,q.queryAt,q.retentionUntil,q.attemptEnd,c.readAt,c.guardAt,c.commitAt,c.revision,c.observedRevision,c.guardedRevision,p.guardAt].every(nat))return "STOP_UNKNOWN";
 const covered=q.covered===true&&q.exact===true&&q.lifecycle==="ACTIVE"&&d.subscriptionType==="PULL"&&d.exactlyOnce===true&&q.scopeMessage===d.message&&q.scopeTargetUid===t.targetUid&&q.scopeTask===t.id&&q.scopeRun===t.run&&q.scopeIntent===t.intent&&q.scopeTarget===t.target&&q.scopeSubscription===d.subscription&&q.scopeRegion===d.region&&same(q.scopeMembers,req)&&same(q.scopeEffects,effects)&&JSON.stringify(q.scopeAttempts)==="[1,2]"&&t.attempt===2&&d.attempt===2&&q.watermark>=q.attemptEnd&&q.queryAt>=q.watermark&&q.queryAt<c.guardAt&&q.retentionUntil>=q.queryAt;
 if(q.kind==="MISS"&&r.length>0&&covered)return "EVIDENCE_CONFLICT";
 if(!covered||!["HIT","MISS"].includes(q.kind))return "STOP_UNKNOWN";
 const guard=c.scopeTask===t.id&&c.scopeRun===t.run&&c.scopeIntent===t.intent&&c.scopeTarget===t.target&&c.scopeSubscription===d.subscription&&same(c.scopeEffects,effects)&&c.uid===t.targetUid&&same(c.members,req)&&c.predicateComplete===true&&c.protected===true&&c.revision===c.observedRevision&&c.revision===c.guardedRevision&&c.readAt<c.guardAt&&c.guardAt<c.commitAt;
 if(q.kind==="MISS"){if(r.length)return "STOP_UNKNOWN";const ps=p.scope;if(!ps||ps.task!==t.id||ps.run!==t.run||ps.intent!==t.intent||ps.targetUid!==t.targetUid||ps.subscription!==d.subscription||ps.attempt!==t.attempt||p.guardAt<=q.queryAt||p.guardAt>=c.commitAt)return "STOP_UNKNOWN";return p.allow===true&&p.protected===true&&guard&&c.state==="UNSATISFIED"?"RETRY_ALLOWED":"STOP_UNKNOWN"}
 if(!r.length)return "STOP_UNKNOWN";
 if(!same(r.map(x=>x.member),req)||!same(r.map(x=>x.member+":"+x.effect),effects))return "RECONCILE";
 for(const x of r){if(!nat(x.effectAt)||!nat(x.attempt)||x.message!==d.message||x.targetUid!==t.targetUid||x.task!==t.id||x.run!==t.run||x.intent!==t.intent||x.target!==t.target||x.subscription!==d.subscription||x.attempt!==t.attempt||x.effectAt<d.deliveryAt||x.effectAt>q.watermark)return "RECONCILE";if(!nat(x.grantFrom)||!nat(x.grantUntil)||x.grantFrom>x.effectAt||x.effectAt>x.grantUntil||(x.revokedAt!==null&&(!nat(x.revokedAt)||x.revokedAt<=x.effectAt)))return "BLOCKED"}
 if(!(d.ack==="SUCCESS"&&d.usedAck===d.latestAck&&d.ackGeneration===d.latestGeneration&&d.region===d.subscriberRegion&&d.deliveryAt<=d.ackAt&&d.ackAt<=d.deadline))return "RECONCILE";
 return guard&&c.state==="SATISFIED"?"COMPLETE":"RECONCILE"
}
function produce(){const scenarios=expand(BASE,MUTATIONS);const rows=scenarios.flatMap(({id,facts})=>[{scenario:id,path:"ack_proxy",decision:facts.delivery.ack==="SUCCESS"?"COMPLETE":"STOP_UNKNOWN"},{scenario:id,path:"message_proxy",decision:facts.delivery.message?"COMPLETE":"STOP_UNKNOWN"},{scenario:id,path:"full_reference",decision:reference(facts)}]);return {scenarios,rows};}
if(typeof require!=="undefined"&&require.main===module){const result=produce();process.stdout.write(JSON.stringify(result,null,2)+"\n");}
if(typeof module!=="undefined")module.exports={produce,reference};
