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
let failures=0;
for(let i=0;i<payload.scenarios.length;i++){
 const s=payload.scenarios[i],label=independent(s);
 const want=[s.id,label,s.gate?"verified":"gate-blocked",s.oidc?"verified":"oidc-denied",s.receipts.length===2?"verified":"incomplete-effect-set",label];
 if(rows[i]!==want.join(",")){console.error("mismatch",s.id);failures++;}
}
if(rows.length!==payload.scenarios.length)throw Error("row count mismatch");
console.log("verifier "+payload.scenarios.length+" scenarios, "+rows.length*4+" decisions, failures="+failures);
if(failures)process.exit(1);
