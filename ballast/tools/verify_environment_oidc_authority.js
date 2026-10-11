"use strict";
const fs=require("fs");
const root="ballast/evidence/2026-10-12-";
const payload=JSON.parse(fs.readFileSync(root+"scenarios.json","utf8"));
const rows=fs.readFileSync(root+"decisions.csv","utf8").trim().split(/\r?\n/);
if(rows.shift()!=="scenario,expected,gate_only,oidc_only,count_only,full_integrity")throw Error("bad CSV header");
function independent(s){
 const r=s.receipts,u=new Set(r),required=new Set(payload.required_effects);
 for(const [v,label] of [[s.repo,"caller-repo-mismatch"],[s.workflow,"delegation-mismatch"],[s.target,"target-incarnation-mismatch"]])if(!v)return label;
 if(s.prior==="authoritative miss"&&r.length)return "evidence-conflict";
 if(s.prior==="unknown"||s.coverage===0||(s.prior==="hit"&&!r.length))return "safe-stop-unknown";
 if(u.size<r.length)return "duplicate-effect";
 for(const x of u)if(!required.has(x))return "unexpected-effect";
 if(r.length&&!s.binding)return "receipt-binding-mismatch";
 if(r.length&&!s.auth)return "historically-unauthorized";
 if(r.length&&!s.time)return "temporal-unverified";
 if(!s.members)return "membership-unverified";
 if(!(r.length===required.size&&[...required].every(x=>u.has(x)))){
  for(const [v,label] of [[s.permission,"permission-stop"],[s.gate,"gate-blocked"],[s.oidc,"oidc-denied"]])if(!v)return label;
  return "incomplete-effect-set";
 }
 return s.post?"verified":"current-postcondition-failed";
}
const oracle={"baseline":"verified","gate-pass-no-effect":"incomplete-effect-set","oidc-pass-no-effect":"safe-stop-unknown","gate-denied-after-valid-effect":"verified","oidc-denied-after-valid-effect":"verified","approval-invalid-at-effect":"historically-unauthorized","current-permission-revoked-after-effect":"verified","target-reincarnated":"target-incarnation-mismatch","caller-repository-drift":"caller-repo-mismatch","reusable-workflow-drift":"delegation-mismatch","duplicate-receipt":"duplicate-effect","unexpected-effect":"unexpected-effect","wrong-receipt-binding":"receipt-binding-mismatch","unknown-prior":"safe-stop-unknown","miss-conflicts-with-receipts":"evidence-conflict","aggregate-hit-no-member-proof":"safe-stop-unknown","membership-expanded":"membership-unverified","temporal-order-unproven":"temporal-unverified","current-state-reversed":"current-postcondition-failed","permission-revoked-unfinished":"safe-stop-unknown","immutable-subject-trust-mismatch":"oidc-denied","gate-blocked-new-effect":"gate-blocked"};
const distinct=new Set(payload.scenarios.map(({id,...s})=>JSON.stringify(s)));
if(payload.scenarios.length!==22||distinct.size!==22||new Set(payload.scenarios.map(s=>s.id)).size!==22)throw Error("duplicate or missing primitives");
let failures=0;
for(let i=0;i<payload.scenarios.length;i++){
 const s=payload.scenarios[i],label=independent(s);
 if(!Object.prototype.hasOwnProperty.call(oracle,s.id)||oracle[s.id]!==label)throw Error("frozen contract assertion failed: "+s.id);
 if(!["hit","authoritative miss","unknown"].includes(s.prior)||!Array.isArray(s.receipts)||
 ["gate","oidc","permission","repo","workflow","target","coverage","binding","auth","time","members","post"].some(k=>s[k]!==0&&s[k]!==1))throw Error("invalid primitive domain: "+s.id);
 const want=[s.id,label,s.gate?"verified":"gate-blocked",s.oidc?"verified":"oidc-denied",s.receipts.length===2?"verified":"incomplete-effect-set",label];
 if(rows[i]!==want.join(",")){console.error("mismatch",s.id);failures++;}
}
if(rows.length!==payload.scenarios.length)throw Error("row count mismatch");
const baseline=payload.scenarios.find(s=>s.id==="baseline");
const probes=[[{"gate":0},"verified"],[{"oidc":0},"verified"],[{"permission":0},"verified"],[{"repo":0},"caller-repo-mismatch"],[{"workflow":0},"delegation-mismatch"],[{"target":0},"target-incarnation-mismatch"],[{"auth":0},"historically-unauthorized"],[{"binding":0},"receipt-binding-mismatch"],[{"time":0},"temporal-unverified"],[{"members":0},"membership-unverified"],[{"post":0},"current-postcondition-failed"],[{"prior":"unknown"},"safe-stop-unknown"],[{"coverage":0},"safe-stop-unknown"],[{"prior":"authoritative miss"},"evidence-conflict"],[{"receipts":["publish","publish"]},"duplicate-effect"],[{"receipts":["publish","notify","audit"]},"unexpected-effect"]];
for(const [patch,expected] of probes)if(independent({...baseline,...patch})!==expected)throw Error("metamorphic contract regression: "+JSON.stringify(patch));
const diffs=[2,3,4,5].map(j=>rows.filter(r=>r.split(",")[j]!==r.split(",")[1]).length);
if(diffs.join("/")!=="18/18/17/0")throw Error("metric drift");
console.log("verifier "+payload.scenarios.length+" distinct fixture vectors, "+rows.length*4+" decisions, "+probes.length+" metamorphic checks, failures="+failures);
if(failures)process.exit(1);
