"use strict";
const fs=require("fs");
const root="ballast/evidence/2026-10-12-";
const input=JSON.parse(fs.readFileSync(root+"scenarios.json","utf8"));
if(new Set(input.scenarios.map(({id,...s})=>JSON.stringify(s))).size!==input.scenarios.length)throw Error("duplicate primitive vector");
if(new Set(input.scenarios.map(s=>s.id)).size!==input.scenarios.length)throw Error("duplicate scenario id");
function classify(s){
 if(!s.repo)return "caller-repo-mismatch";
 if(!s.workflow)return "delegation-mismatch";
 if(!s.target)return "target-incarnation-mismatch";
 if(s.prior==="authoritative miss"&&s.receipts.length)return "evidence-conflict";
 if(s.prior==="unknown"||!s.coverage||(s.prior==="hit"&&!s.receipts.length))return "safe-stop-unknown";
 if(new Set(s.receipts).size!==s.receipts.length)return "duplicate-effect";
 if(s.receipts.some(x=>!input.required_effects.includes(x)))return "unexpected-effect";
 if(s.receipts.length&&!s.binding)return "receipt-binding-mismatch";
 if(s.receipts.length&&!s.auth)return "historically-unauthorized";
 if(s.receipts.length&&!s.time)return "temporal-unverified";
 if(!s.members)return "membership-unverified";
 if(s.receipts.length!==2||input.required_effects.some(x=>!s.receipts.includes(x))){
  if(!s.permission)return "permission-stop";
  if(!s.gate)return "gate-blocked";
  if(!s.oidc)return "oidc-denied";
  return "incomplete-effect-set";
 }
 return s.post?"verified":"current-postcondition-failed";
}
const rows=input.scenarios.map(s=>[s.id,classify(s),s.gate?"verified":"gate-blocked",s.oidc?"verified":"oidc-denied",s.receipts.length===2?"verified":"incomplete-effect-set",classify(s)].join(","));
const output="scenario,expected,gate_only,oidc_only,count_only,full_integrity\n"+rows.join("\n")+"\n";
if(output!==fs.readFileSync(root+"decisions.csv","utf8"))throw Error("producer reproduction mismatch");
console.log("producer reproduced "+input.scenarios.length+" scenarios / "+input.scenarios.length*4+" decisions");
