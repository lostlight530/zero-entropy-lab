// Ballast 2026-11-06 bounded synthetic maintainer reconstruction
// Reconstructed from Daily narrative after initial non-persisted 10-case V8 run
// Never treat synthetic issuer, journal, protected guard or ticks as real effect proof
function cases(){
 const b={task:"T6",run:"R6",attempt:"P1",target:"uid7",effectSet:["A","B"],authority:{issuer:"synthetic-grant-ledger",subject:"executor-1",task:"T6",run:"R6",attempt:"P1",target:"uid7",effectSet:["A","B"],from:0,to:40,active:true,effectPermission:true,currentPermission:true},time:{effect:12,effectError:0,revocation:20,revokeError:0},query:{state:"HIT",authority:"synthetic-effect-journal",task:"T6",run:"R6",attempt:"P1",attempts:["P1"],target:"uid7",effectSet:["A","B"],exact:true,watermark:18,lastEnd:16,at:19,retentionUntil:40,lifecycle:"ACTIVE"},receipts:[{task:"T6",run:"R6",attempt:"P1",target:"uid7",member:"A",effect:"effect-A",at:12,state:"DONE"},{task:"T6",run:"R6",attempt:"P1",target:"uid7",member:"B",effect:"effect-B",at:12,state:"DONE"}],current:{target:"uid7",effectSet:["A","B"],members:["A","B"],states:{A:"DONE",B:"DONE"},revision:7,guardRevision:7,membershipRevision:7,protected:true,observedAt:19}};
 const defs=[
 ["baseline",x=>{}],["revoked_before_effect",x=>x.time.revocation=10],["revocation_unknown",x=>x.time.revocation=null],["time_interval_overlap",x=>{x.time.revocation=13;x.time.effectError=2;x.time.revokeError=2}],["receipt_extra",x=>x.receipts.push({...x.receipts[0],member:"C",effect:"effect-C"})],["receipt_duplicate",x=>x.receipts[1]={...x.receipts[0]}],["target_recreated",x=>x.current.target="uid6"],["miss_conflict",x=>x.query.state="MISS"],["uncovered_query",x=>x.query.lastEnd=11],["guard_lost",x=>x.current.protected=false],["current_permission_revoked_positive",x=>x.authority.currentPermission=false],["effect_permission_revoked",x=>x.authority.effectPermission=false],["grant_interval_overlap",x=>{x.authority.from=11;x.time.effectError=2}],["grant_expired_before_effect",x=>x.authority.to=10],["later_revocation_positive",x=>{x.time.revocation=30;x.time.effectError=2;x.time.revokeError=2}],["receipt_wrong_task",x=>x.receipts[0].task="other"],["receipt_wrong_run",x=>x.receipts[0].run="other"],["receipt_wrong_attempt",x=>x.receipts[0].attempt="P0"],["receipt_wrong_target",x=>x.receipts[0].target="uid6"],["receipt_wrong_effect",x=>x.receipts[0].effect="effect-C"],["receipt_time_mismatch",x=>x.receipts[0].at=13],["query_wrong_attempt",x=>x.query.attempt="P0"],["query_missing_attempts",x=>x.query.attempts=[]],["query_wrong_effect_set",x=>x.query.effectSet=["A","C"]],["query_expired_retention",x=>x.query.retentionUntil=18],["query_future_watermark",x=>x.query.watermark=21],["query_pre_effect_watermark",x=>x.query.watermark=11],["query_lifecycle_pruned",x=>x.query.lifecycle="PRUNED"],["duplicate_required_effect",x=>x.effectSet=["A","A"]],["extra_current_membership",x=>{x.current.members.push("C");x.current.states.C="DONE"}],["guard_revision_drift",x=>x.current.guardRevision=6],["membership_revision_drift",x=>x.current.membershipRevision=6],["missing_issuer",x=>delete x.authority.issuer],["wrong_grant_attempt",x=>x.authority.attempt="P0"],["wrong_grant_target",x=>x.authority.target="uid6"],["non_boolean_effect_permission",x=>x.authority.effectPermission="true"],["non_numeric_clock_error",x=>x.time.effectError="0"],["missing_receipts",x=>{x.receipts=[];x.query.state="UNKNOWN"}],["covered_miss_no_receipts",x=>{x.receipts=[];x.query.state="MISS"}],["uncovered_miss_with_receipts",x=>{x.query.state="MISS";x.query.authority="untrusted-cache"}],["current_state_extra",x=>x.current.states.C="DONE"],["current_observed_before_effect",x=>x.current.observedAt=10],["query_wrong_target",x=>x.query.target="uid6"],["query_nonboolean_exact",x=>x.query.exact="true"]
 ];
 return defs.map(([id,mutate])=>{const state=JSON.parse(JSON.stringify(b));mutate(state);return {id,state,mutation:id}});
}
function reference(s){
 const num=x=>typeof x==="number"&&Number.isSafeInteger(x)&&x>=0;
 const str=x=>typeof x==="string"&&x.length>0;
 const exact=(a,b)=>Array.isArray(a)&&Array.isArray(b)&&a.length>0&&a.length===b.length&&new Set(a).size===a.length&&new Set(b).size===b.length&&a.every(str)&&b.every(str)&&a.every(x=>b.includes(x));
 if(!s||!str(s.task)||!str(s.run)||!str(s.attempt)||!str(s.target)||!exact(s.effectSet,["A","B"])||!s.authority||!s.time||!s.query||!s.current||!Array.isArray(s.receipts))return "STOP_UNKNOWN";
 const a=s.authority,t=s.time,q=s.query,c=s.current;
 if(![t.effect,t.effectError,t.revokeError].every(num)||!(t.revocation===null||num(t.revocation))||![a.from,a.to].every(num)||typeof a.active!=="boolean"||typeof a.effectPermission!=="boolean"||typeof a.currentPermission!=="boolean")return "STOP_UNKNOWN";
 const low=t.effect-t.effectError,high=t.effect+t.effectError;
 if(low<0||!Number.isSafeInteger(high)||!Number.isSafeInteger(t.revocation===null?0:t.revocation+t.revokeError))return "STOP_UNKNOWN";
 const validQuery=q.authority==="synthetic-effect-journal"&&q.exact===true&&q.lifecycle==="ACTIVE"&&["HIT","MISS","UNKNOWN"].includes(q.state)&&q.task===s.task&&q.run===s.run&&q.attempt===s.attempt&&exact(q.attempts,[s.attempt])&&q.target===s.target&&exact(q.effectSet,s.effectSet)&&[q.at,q.watermark,q.lastEnd,q.retentionUntil].every(num)&&q.watermark>=q.lastEnd&&q.lastEnd>=high&&q.watermark>=high&&q.watermark<=q.at&&q.at<=q.retentionUntil;
 if(!validQuery)return "STOP_UNKNOWN";
 if(s.receipts.length>0&&q.state==="MISS")return "EVIDENCE_CONFLICT";
 if(q.state!=="HIT"||s.receipts.length===0)return "STOP_UNKNOWN";
 if(!exact(s.receipts.map(x=>x.member),s.effectSet)||s.receipts.some(r=>r.task!==s.task||r.run!==s.run||r.attempt!==s.attempt||r.target!==s.target||r.effect!=="effect-"+r.member||r.at!==t.effect||r.state!=="DONE"))return "RECONCILE";
 if(!str(a.issuer)||a.issuer!=="synthetic-grant-ledger"||!str(a.subject)||a.task!==s.task||a.run!==s.run||a.attempt!==s.attempt||a.target!==s.target||!exact(a.effectSet,s.effectSet)||a.active!==true||a.effectPermission!==true)return "BLOCKED";
 if(a.from>a.to||high<a.from||low>a.to)return "BLOCKED";
 if(low<a.from||high>a.to||t.revocation===null)return "STOP_UNKNOWN";
 const revLow=t.revocation-t.revokeError,revHigh=t.revocation+t.revokeError;
 if(revLow<0)return "STOP_UNKNOWN";
 if(revHigh<low)return "BLOCKED";
 if(!(high<revLow))return "STOP_UNKNOWN";
 if(c.target!==s.target||!exact(c.effectSet,s.effectSet)||!exact(c.members,s.effectSet)||!c.states||!exact(Object.keys(c.states),s.effectSet)||s.effectSet.some(m=>c.states[m]!=="DONE")||![c.revision,c.guardRevision,c.membershipRevision,c.observedAt].every(num)||c.revision!==c.guardRevision||c.revision!==c.membershipRevision||c.protected!==true||c.observedAt<high)return "RECONCILE";
 return "COMPLETE";
}
function produce(xs){
 const traces=xs.map(({id,state:s})=>({id,events:[{kind:"INTENT",data:{task:s.task,run:s.run,attempt:s.attempt,target:s.target,effectSet:s.effectSet}},{kind:"AUTHORITY",data:s.authority},{kind:"TEMPORAL",data:s.time},{kind:"QUERY",data:s.query},{kind:"CURRENT",data:s.current},...s.receipts.map(r=>({kind:"RECEIPT",data:r}))]}));
 const decisions=xs.flatMap(({id,state:s})=>[{id,path:"weak_receipt",decision:s.receipts.length>0?"COMPLETE":"STOP_UNKNOWN"},{id,path:"reference",decision:reference(s)}]);
 return {traces,decisions};
}
if(typeof module!=='undefined')module.exports={cases,reference,produce};
