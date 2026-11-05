// Ballast 2026-11-06 maintainer reconstruction: synthetic interval fixtures, NOT original V8 source
// Logical date Asia/Shanghai 2026-11-06; no real issuer, sink or trusted clock
const clone = x => JSON.parse(JSON.stringify(x));
function fixtures(){
 const b={task:"T6",run:"R6",attempt:"P1",target:"uid7",required:["A","B"],receipts:["A","B"],receipt:true,
  effectAt:12,effectError:0,revocationAt:20,revocationError:0,
  grant:{authority:"synthetic-ledger",task:"T6",run:"R6",attempt:"P1",target:"uid7",members:["A","B"],from:0,to:30,permitted:true},
  query:{authority:"synthetic-journal",state:"HIT",exact:true,task:"T6",run:"R6",attempt:"P1",target:"uid7",members:["A","B"],watermark:15,lastEnd:13,at:16,retentionUntil:40,lifecycle:"ACTIVE"},
  current:{target:"uid7",members:["A","B"],done:["A","B"],revision:7,guardRevision:7,protected:true},currentPermission:true};
 const mutations=[
 ["baseline",s=>{}],["revoked_before_effect",s=>s.revocationAt=10],
 ["revocation_unknown",s=>s.revocationAt=null],
 ["time_interval_overlap",s=>{s.revocationAt=13;s.effectError=2;s.revocationError=2;s.query.lastEnd=14;s.query.watermark=17;s.query.at=18}],
 ["receipt_extra",s=>s.receipts.push("C")],
 ["receipt_duplicate",s=>s.receipts[1]="A"],
 ["target_recreated",s=>s.current.target="uid6"],
 ["miss_conflict",s=>s.query.state="MISS"],
 ["uncovered_query",s=>s.query.lastEnd=11],
 ["guard_lost",s=>s.current.protected=false],
 ["current_permission_revoked",s=>s.currentPermission=false]
 ];
 return mutations.map(([id,apply])=>{const state=clone(b);apply(state);return {id,state}})
}
const integer=x=>typeof x==="number"&&Number.isSafeInteger(x)&&x>=0;
const exact=(a,b)=>Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&a.length>0&&new Set(a).size===a.length&&new Set(b).size===b.length&&a.every(x=>typeof x==="string"&&b.includes(x));
function reference(s){
 const q=s.query,g=s.grant,c=s.current;
 if(!integer(s.effectAt)||!integer(s.effectError)||!integer(s.revocationError)||!(s.revocationAt===null||integer(s.revocationAt)))return "STOP_UNKNOWN";
 const low=s.effectAt-s.effectError,high=s.effectAt+s.effectError;
 if(low<0||!Number.isSafeInteger(high)||!exact(s.required,["A","B"]))return "STOP_UNKNOWN";
 const queryValid=q.authority==="synthetic-journal"&&q.exact===true&&q.lifecycle==="ACTIVE"&&["HIT","MISS","UNKNOWN"].includes(q.state)&&q.task===s.task&&q.run===s.run&&q.attempt===s.attempt&&q.target===s.target&&exact(q.members,s.required)&&[q.watermark,q.lastEnd,q.at,q.retentionUntil].every(integer)&&q.lastEnd>=high&&q.watermark>=q.lastEnd&&q.watermark<=q.at&&q.at<=q.retentionUntil;
 if(!queryValid)return "STOP_UNKNOWN";
 if(s.receipt===true&&q.state==="MISS")return "EVIDENCE_CONFLICT";
 if(s.receipt!==true||q.state!=="HIT")return "STOP_UNKNOWN";
 if(!exact(s.receipts,s.required)||c.target!==s.target)return "RECONCILE";
 if(g.authority!=="synthetic-ledger"||g.task!==s.task||g.run!==s.run||g.attempt!==s.attempt||g.target!==s.target||!exact(g.members,s.required)||g.permitted!==true||![g.from,g.to].every(integer))return "BLOCKED";
 if(high<g.from||low>g.to)return "BLOCKED";
 if(low<g.from||high>g.to||s.revocationAt===null)return "STOP_UNKNOWN";
 if(s.revocationAt+s.revocationError<low)return "BLOCKED";
 if(!(high<s.revocationAt-s.revocationError))return "STOP_UNKNOWN";
 if(!exact(c.members,s.required)||!exact(c.done,s.required)||![c.revision,c.guardRevision].every(integer)||c.revision!==c.guardRevision||c.protected!==true)return "RECONCILE";
 return "COMPLETE"
}
function produce(cases){
 const events=cases.map(x=>({id:x.id,events:[{kind:"IDENTITY",task:x.state.task,run:x.state.run,attempt:x.state.attempt,target:x.state.target,required:x.state.required},
 {kind:"GRANT",...x.state.grant},{kind:"EFFECT_TIME",value:x.state.effectAt,error:x.state.effectError},
 {kind:"REVOCATION",value:x.state.revocationAt,error:x.state.revocationError},
 {kind:"QUERY",...x.state.query},{kind:"CURRENT",...x.state.current},
 {kind:"RECEIPTS",receipt:x.state.receipt,members:x.state.receipts,currentPermission:x.state.currentPermission}]}));
 const decisions=cases.flatMap(x=>[{id:x.id,path:"weak_receipt",decision:x.state.receipt===true?"COMPLETE":"STOP_UNKNOWN"},
 {id:x.id,path:"reference",decision:reference(x.state)}]);
 return {events,decisions}
}
if(typeof module!=="undefined")module.exports={fixtures,reference,produce};
