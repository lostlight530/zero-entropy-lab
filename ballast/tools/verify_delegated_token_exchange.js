"use strict";
const fs=require("fs"),path=require("path"),assert=require("assert");
function independent(s){
 const required=new Set(["publish@uid7","notify@uid7"]), observed=new Set(s.receiptIds);
 const flags={
  target:s.targetUid==="uid7",
  receiptActor:s.receiptIds.length===0||s.receiptActor==="worker-A",
  priorKnown:s.prior!=="unknown"&&(s.prior!=="authoritative miss"||s.coverage),
  conflictingMiss:s.prior==="authoritative miss"&&s.receiptIds.length>0,
  bound:s.receiptIds.length===0||s.receiptBinding,
  unique:observed.size===s.receiptIds.length,
  allowed:[...observed].every(v=>required.has(v)),
  all:[...required].every(v=>observed.has(v)),
  hist:s.historicalAuthorization,
  time:s.temporalWitness,
  members:s.memberComplete,
  current:s.postcondition,
  newIdentity:s.currentActor==="worker-A"&&s.subject==="owner-1"&&s.audience==="sink-A"&&new Set(s.scope.split(" ")).has("publish")&&new Set(s.scope.split(" ")).has("notify"),
  newAuthority:s.activeAtEffect&&s.delegationValidAtEffect&&s.currentPermission,
 };
 if(!flags.target)return "target-incarnation-mismatch";
 if(!flags.receiptActor)return "actor-identity-mismatch";
 if(!flags.priorKnown)return "safe-stop-unknown";
 if(flags.conflictingMiss)return "evidence-conflict";
 if(!flags.bound)return "effect-identity-mismatch";
 if(!flags.unique)return "duplicate-effect";
 if(!flags.allowed)return "unexpected-effect";
 if(s.prior==="hit"&&!flags.all)return "safe-stop-unknown";
 if(s.receiptIds.length>0&&flags.hist==="invalid")return "historically-unauthorized";
 if(s.receiptIds.length>0&&flags.hist!=="valid")return "historical-auth-unknown";
 if(s.receiptIds.length>0&&!flags.time)return "temporal-unverified";
 if(!flags.members)return "membership-unverified";
 if(flags.all)return flags.current?"verified":"current-postcondition-failed";
 if(!s.exchange)return "delegation-proof-missing";
 if(!flags.newIdentity)return "delegation-context-mismatch";
 if(!flags.newAuthority)return "permission-stop";
 if(!s.protectedAuthority)return "unprotected-effect-boundary";
 return "incomplete-effect-set";
}
const fixture=JSON.parse(fs.readFileSync(path.join(__dirname,"../evidence/2026-10-13-scenarios.json"),"utf8"));
const lines=fs.readFileSync(path.join(__dirname,"../evidence/2026-10-13-decisions.csv"),"utf8").trim().split(/\r?\n/);
assert.strictEqual(lines.shift(),"scenario,path,decision,expected,agreement");
const rows=lines.map(line=>{const v=line.split(",");assert.strictEqual(v.length,5);return v;});
const ids=new Set(),vectors=new Set();let checked=0;
for(const s of fixture.scenarios){assert(!ids.has(s.id));ids.add(s.id);const {id,expected,...primitive}=s;const fingerprint=JSON.stringify(primitive);assert(!vectors.has(fingerprint));vectors.add(fingerprint);assert.strictEqual(independent(s),expected,s.id);const group=rows.filter(r=>r[0]===s.id);assert.strictEqual(group.length,4,s.id);for(const [id,p,d,e,a] of group){assert.strictEqual(e,expected);assert.strictEqual(a,String(d===e));assert(["exchange_only","preflight_introspection_only","actor_trail_only","full_integrity"].includes(p));const reconstructed=p==="exchange_only"?(s.exchange?"verified":"not-verified"):p==="preflight_introspection_only"?(s.preflightActive?"verified":"not-verified"):p==="actor_trail_only"?(s.actorTrail?"verified":"not-verified"):independent(s);assert.strictEqual(d,reconstructed,s.id+":"+p);checked++}}
assert.strictEqual(rows.length,fixture.scenarios.length*4);
console.log(JSON.stringify({scenarios:fixture.scenarios.length,rows:checked,failures:0,independence:"separate predicate implementation; shared fixture and semantic contract"}));
