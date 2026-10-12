"use strict";
const fs=require("fs");
function classify(s){
 const ids=s.receiptIds, required=["publish@uid7","notify@uid7"];
 if(s.targetUid!=="uid7")return "target-incarnation-mismatch";
 if(ids.length&&s.receiptActor!=="worker-A")return "actor-identity-mismatch";
 if(s.prior==="unknown"||(s.prior==="authoritative miss"&&!s.coverage))return "safe-stop-unknown";
 if(s.prior==="authoritative miss"&&ids.length)return "evidence-conflict";
 if(ids.length&&!s.receiptBinding)return "effect-identity-mismatch";
 if(new Set(ids).size!==ids.length)return "duplicate-effect";
 if(ids.some(x=>!required.includes(x)))return "unexpected-effect";
 if(s.prior==="hit"&&required.some(x=>!ids.includes(x)))return "safe-stop-unknown";
 if(ids.length&&s.historicalAuthorization==="invalid")return "historically-unauthorized";
 if(ids.length&&s.historicalAuthorization!=="valid")return "historical-auth-unknown";
 if(ids.length&&!s.temporalWitness)return "temporal-unverified";
 if(!s.memberComplete)return "membership-unverified";
 if(required.every(x=>ids.includes(x))){
   return s.postcondition?"verified":"current-postcondition-failed";
 }
 if(!s.exchange)return "delegation-proof-missing";
 if(s.currentActor!=="worker-A"||s.subject!=="owner-1"||s.audience!=="sink-A"||!s.scope.split(" ").includes("publish")||!s.scope.split(" ").includes("notify"))return "delegation-context-mismatch";
 if(!s.activeAtEffect||!s.delegationValidAtEffect||!s.currentPermission)return "permission-stop";
 if(!s.protectedAuthority)return "unprotected-effect-boundary";
 return "incomplete-effect-set";
}
function weak(s){
 return {exchange_only:s.exchange?"verified":"not-verified",preflight_introspection_only:s.preflightActive?"verified":"not-verified",actor_trail_only:s.actorTrail?"verified":"not-verified",full_integrity:classify(s)};
}
const path=require("path");
const input=JSON.parse(fs.readFileSync(path.join(__dirname,"../evidence/2026-10-13-scenarios.json"),"utf8"));
const decisions=input.scenarios.flatMap(s=>Object.entries(weak(s)).map(([p,d])=>({scenario:s.id,path:p,decision:d,expected:s.expected,agreement:d===s.expected})));
process.stdout.write("scenario,path,decision,expected,agreement\n"+decisions.map(r=>[r.scenario,r.path,r.decision,r.expected,r.agreement].join(",")).join("\n")+"\n");
