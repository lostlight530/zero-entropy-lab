// Ballast 2026-11-05 controlled delegated handoff synthetic experiment
const copy=x=>JSON.parse(JSON.stringify(x));
function fixtures(){
const b={task:"T5",run:"R5",attempt:"P1",effect:"charge-A",target:"uid-5",owner:"w2",generation:2,delegate:"w2",delegateGeneration:2,permit:true,approval:true,credential:true,grant:{subject:"w2",generation:2,from:1,to:15,action:"charge-A",target:"uid-5"},precheck:{generation:2,at:9},commit:{generation:2,at:12,atomic:true,issuer:"sink-guard"},receipt:{effect:"charge-A",target:"uid-5",attempt:"P1",at:12,authorized:true},query:{state:"HIT",effect:"charge-A",target:"uid-5",watermark:20,retentionUntil:30,at:22,authority:"sink-journal"},current:{revision:5,target:"uid-5",members:["A"],done:["A"],guardRevision:5,protected:true}};
const defs=[["baseline",x=>{}],["stale_handoff",x=>{x.delegate="w1";x.delegateGeneration=1;x.grant.subject="w1";x.grant.generation=1;x.precheck.generation=1}],["cancel_after_precheck",x=>x.permit=false],["revoked_approval",x=>x.approval=false],["expired_credential",x=>x.credential=false],["stale_commit_generation",x=>x.commit.generation=1],["non_atomic_commit",x=>x.commit.atomic=false],["missing_receipt",x=>{x.receipt=null;x.query.state="UNKNOWN"}],["uncovered_miss",x=>{x.receipt=null;x.query.state="MISS";x.query.watermark=10}],["covered_miss",x=>{x.receipt=null;x.query.state="MISS"}],["conflicting_hit_miss",x=>x.query.state="MISS"],["wrong_target_incarnation",x=>x.current.target="uid-6"],["extra_member",x=>x.current.members.push("B")],["duplicate_member",x=>x.current.members.push("A")],["guard_revision_drift",x=>x.current.guardRevision=6],["expired_query_retention",x=>x.query.retentionUntil=20],["unauthorized_historical",x=>x.grant.to=11],["unknown_effect_identity",x=>x.query.effect="charge-other"],["untrusted_sink",x=>x.commit.issuer="cache"],["late_effect",x=>{x.commit.at=16;x.receipt.at=16}]];
return defs.map(([id,mutate])=>{const state=copy(b);mutate(state);return {id,state,intervention:id}});
}
function decide(s){
const r=s.receipt,q=s.query,c=s.commit,g=s.grant,k=s.current;
if(r&&q.state==="MISS")return "EVIDENCE_CONFLICT";
if(!["HIT","MISS","UNKNOWN"].includes(q.state)||q.authority!=="sink-journal"||q.effect!==s.effect||q.target!==s.target||q.at>q.retentionUntil||q.watermark<c.at||q.watermark>q.at)return "STOP_UNKNOWN";
if(!r)return q.state==="MISS"?(s.permit&&s.approval&&s.credential?"RETRY_REQUIRES_NEW_FENCE":"BLOCKED"):"STOP_UNKNOWN";
if(q.state!=="HIT")return "STOP_UNKNOWN";
if(r.effect!==s.effect||r.target!==s.target||r.at!==c.at||r.at>q.watermark||r.at>q.at||r.at<0)return "RECONCILE";
if(g.subject!==s.delegate||g.generation!==s.delegateGeneration||g.action!==s.effect||g.target!==s.target||r.at<g.from||r.at>g.to||r.authorized!==true)return "BLOCKED";
if(!s.permit||!s.approval||!s.credential||s.owner!==s.delegate||s.generation!==s.delegateGeneration||s.precheck.generation!==s.generation||c.generation!==s.generation||c.issuer!=="sink-guard"||c.atomic!==true)return "BLOCKED";
if(k.target!==s.target||k.revision!==k.guardRevision||k.protected!==true||k.members.length!==1||k.members[0]!=="A"||k.done.length!==1||k.done[0]!=="A")return "RECONCILE";
return "COMPLETE";
}
function produce(xs){const traces=xs.map(({id,state:s})=>({id,events:[{kind:"INTENT",task:s.task,run:s.run,attempt:s.attempt,effect:s.effect,target:s.target},{kind:"OWNER",owner:s.owner,generation:s.generation,delegate:s.delegate,delegateGeneration:s.delegateGeneration},{kind:"PERMISSION",permit:s.permit,approval:s.approval,credential:s.credential},{kind:"GRANT",...s.grant},{kind:"PRECHECK",...s.precheck},{kind:"COMMIT",...s.commit},{kind:"QUERY",...s.query},{kind:"CURRENT",...s.current},...(s.receipt?[{kind:"RECEIPT",...s.receipt}]:[])]}));
const decisions=xs.flatMap(({id,state:s})=>[{id,path:"weak_precheck",decision:s.precheck.generation===s.delegateGeneration?"COMPLETE":"BLOCKED"},{id,path:"weak_receipt",decision:s.receipt?"COMPLETE":"STOP_UNKNOWN"},{id,path:"reference",decision:decide(s)}]);
return {traces,decisions};}
if(typeof module!=="undefined")module.exports={fixtures,decide,produce};
