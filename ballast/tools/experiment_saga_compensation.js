"use strict";
function produce(){
 const deep=x=>JSON.parse(JSON.stringify(x));
 const req=["reserve@acct-u5","charge@acct-u5"], mkScope=x=>`task-88|run-3|attempt-1|acct-u5|${x}`;
 const query=(x,state="hit")=>({state,scope:mkScope(x),watermark:12,minWatermark:10,retained:true,queryOk:true});
 const receipt=(x,i,kind)=>({receiptId:(kind==="forward"?"f":"c")+i,effect:kind==="forward"?x:(i===0?"release-reserve@acct-u5":"refund-charge@acct-u5"),original:x,task:"task-88",run:"run-3",attempt:"attempt-1",incarnation:"acct-u5",authorized:true,time:kind==="forward"?i+3:i+7});
 const base={task:"task-88",run:"run-3",attempt:"attempt-1",target:"account",incarnation:"acct-u5",required:req,membership:req.slice(),membershipRevision:"m12",witnessRevision:"m12",protectedCompletion:true,currentState:{reserved:false,netCharge:0},currentPermission:false,protectedNewEffect:false,cancelTerminal:true,compensationQueued:true,forward:req.map((x,i)=>receipt(x,i,"forward")),comp:req.map((x,i)=>receipt(x,i,"comp")),prior:req.map(x=>query(x)),compPrior:req.map(x=>query(x)),temporalWitness:true};
 const cases=[];
 const add=(id,expected,mutate,notes)=>{const s=deep(base);mutate(s);s.id=id;s.frozen_expected=expected;s.injection=notes;cases.push(s)};
 const miss=(s,i,which="prior")=>{s[which][i].state="authoritative miss"};
 add("valid-historical-after-current-revocation","verified-aborted",()=>{},"post-effect current permission false");
 add("valid-despite-lost-cancel-ack","verified-aborted",s=>{s.cancelTerminal=false;s.compensationQueued=false},"control-plane ack absent, exact history valid");
 add("covered-no-effect-abort","verified-aborted",s=>{s.forward=[];s.comp=[];[0,1].forEach(i=>{miss(s,i);miss(s,i,"compPrior")})},"covered original absence and no compensations");
 add("known-forward-pending-compensation-authorized","eligible-compensation",s=>{s.comp.splice(1,1);miss(s,1,"compPrior");s.currentPermission=true;s.protectedNewEffect=true;s.currentState.netCharge=100},"one exact compensation pending and authorized");
 add("known-forward-pending-compensation-revoked","permission-stop",s=>{s.comp.splice(1,1);miss(s,1,"compPrior");s.currentState.netCharge=100},"pending new compensation lacks current permission");
 add("pending-compensation-unknown-prior","safe-stop-unknown",s=>{s.comp.splice(1,1);s.compPrior[1].state="unknown";s.currentPermission=true;s.protectedNewEffect=true;s.currentState.netCharge=100},"no compensation receipt and unresolved old compensation");
 add("compensation-hit-without-exact-receipt","safe-stop-unknown",s=>{s.comp.splice(1,1);s.currentState.netCharge=100},"aggregate HIT cannot substitute exact receipt");
 add("covered-compensation-miss-conflicts-with-receipt","evidence-conflict",s=>miss(s,1,"compPrior"),"positive compensation receipt and authoritative miss");
 add("covered-original-miss-conflicts-with-receipt","evidence-conflict",s=>miss(s,0),"positive original receipt and authoritative miss");
 add("original-unknown-without-receipt","safe-stop-unknown",s=>{s.forward.splice(0,1);s.comp.splice(0,1);s.prior[0].state="unknown"},"old non-idempotent outcome unknown");
 add("original-miss-stale-watermark","safe-stop-unknown",s=>{s.forward.splice(0,1);s.comp.splice(0,1);miss(s,0);s.prior[0].watermark=5},"miss outside visibility horizon");
 add("original-miss-expired-retention","safe-stop-unknown",s=>{s.forward.splice(0,1);s.comp.splice(0,1);miss(s,0);s.prior[0].retained=false},"miss outside retention");
 add("duplicate-compensation-receipt","duplicate-effect",s=>{s.comp[1]=deep(s.comp[0])},"count equality masks duplicated refund");
 add("extra-compensation-receipt","extra-effect",s=>{s.comp.push({...deep(s.comp[0]),receiptId:"c-extra",effect:"refund-extra@acct-u5",original:"unplanned@acct-u5"})},"two required plus extra refund");
 add("compensation-bound-to-wrong-original","original-binding-mismatch",s=>{s.comp[1].original=req[0]},"refund binds wrong original");
 add("compensation-wrong-incarnation","target-incarnation-mismatch",s=>{s.comp[1].incarnation="acct-u6"},"same logical account, new incarnation");
 add("compensation-historically-unauthorized","historically-unauthorized",s=>{s.comp[1].authorized=false},"compensation occurred without effect-time approval");
 add("forward-historically-unauthorized","historically-unauthorized",s=>{s.forward[1].authorized=false},"forward occurrence was unauthorized");
 add("compensation-before-original","temporal-order-unknown",s=>{s.comp[1].time=2},"compensation precedes forward receipt");
 add("missing-temporal-witness","temporal-order-unknown",s=>{s.temporalWitness=false},"synthetic order cannot be proven");
 add("same-count-membership-replacement","membership-mismatch",s=>{s.membership[1]="charge@acct-u6"},"equal count, different exact member");
 add("stale-membership-revision","membership-mismatch",s=>{s.witnessRevision="m11"},"current set without protected revision");
 add("current-net-state-reversed","current-incomplete",s=>{s.currentState.netCharge=100},"receipts present but net charge remains");
 add("unprotected-completion-boundary","current-incomplete",s=>{s.protectedCompletion=false},"state read without compare-and-complete");
 add("queue-and-cancel-with-unknown-original","safe-stop-unknown",s=>{s.forward.splice(1,1);s.comp.splice(1,1);s.prior[1].state="unknown"},"terminal/queued cannot classify old outcome");
 add("extra-irreversible-forward-effect","extra-effect",s=>{s.forward.push({...deep(s.forward[0]),receiptId:"f-extra",effect:"notify@acct-u5",original:"notify@acct-u5"})},"irreversible unplanned notification");
 add("target-reincarnated-same-name","target-incarnation-mismatch",s=>{s.incarnation="acct-u6"},"same account name but different incarnation");
 add("compensation-wrong-run","effect-identity-mismatch",s=>{s.comp[0].run="run-4"},"receipt from unrelated run");
 add("forward-original-misbinding","original-binding-mismatch",s=>{s.forward[0].original="other-original"},"forward receipt original identity unbound");
 add("hit-scope-mismatch","safe-stop-unknown",s=>{s.compPrior[0].scope="unrelated-scope"},"positive prior HIT scoped to unrelated effect");
 const covers=(q,x)=>q&&q.scope===mkScope(x)&&q.queryOk===true&&q.retained===true&&Number.isFinite(q.watermark)&&Number.isFinite(q.minWatermark)&&q.watermark>=q.minWatermark;
 const decision=s=>{
   const keys=a=>a.map(x=>x.effect);
   const eq=(a,b)=>a.length===b.length&&new Set(a).size===a.length&&a.every(x=>b.includes(x));
   if(s.incarnation!=="acct-u5"||[...s.forward,...s.comp].some(r=>r.incarnation!=="acct-u5"))return "target-incarnation-mismatch";
   if([...s.forward,...s.comp].some(r=>r.task!==s.task||r.run!==s.run||r.attempt!==s.attempt))return "effect-identity-mismatch";
   if(new Set(s.forward.map(r=>r.receiptId)).size!==s.forward.length||new Set(s.comp.map(r=>r.receiptId)).size!==s.comp.length||new Set(keys(s.forward)).size!==s.forward.length||new Set(keys(s.comp)).size!==s.comp.length)return "duplicate-effect";
   const fAllowed=req, cAllowed=["release-reserve@acct-u5","refund-charge@acct-u5"];
   if(!eq(s.required,req))return "membership-mismatch";
   if(s.forward.some(r=>!fAllowed.includes(r.effect))||s.comp.some(r=>!cAllowed.includes(r.effect)))return "extra-effect";
   if(s.comp.some(r=>!cAllowed.includes(r.effect)||r.original!==s.required[cAllowed.indexOf(r.effect)])||s.forward.some(r=>r.original!==r.effect))return "original-binding-mismatch";
   if(!eq(s.membership,s.required)||s.witnessRevision!==s.membershipRevision)return "membership-mismatch";
   for(let i=0;i<s.required.length;i++){
     const x=s.required[i],f=s.forward.find(r=>r.effect===x),c=s.comp.find(r=>r.original===x),p=s.prior[i],cp=s.compPrior[i];
     if((p.state==="authoritative miss"&&f)||(cp.state==="authoritative miss"&&c)){
       if((p.state==="authoritative miss"&&f&&!covers(p,x))||(cp.state==="authoritative miss"&&c&&!covers(cp,x)))return "safe-stop-unknown";
       return "evidence-conflict";
     }
     if(p.state==="hit"&&!covers(p,x)||cp.state==="hit"&&c&&!covers(cp,x))return "safe-stop-unknown";
     if(!["hit","authoritative miss"].includes(p.state)||p.state==="authoritative miss"&&!covers(p,x)||p.state==="hit"&&!f)return "safe-stop-unknown";
     if(f){
       if(f.authorized!==true)return "historically-unauthorized";
       if(!c){
         if(cp.state==="hit"||cp.state==="unknown"||cp.state==="authoritative miss"&&!covers(cp,x))return "safe-stop-unknown";
         if(cp.state==="authoritative miss")return s.currentPermission&&s.protectedNewEffect?"eligible-compensation":"permission-stop";
         return "safe-stop-unknown";
       }
       if(cp.state!=="hit")return "safe-stop-unknown";
       if(c.authorized!==true)return "historically-unauthorized";
       if(s.temporalWitness!==true||!Number.isFinite(f.time)||!Number.isFinite(c.time)||!(c.time>f.time))return "temporal-order-unknown";
     }else if(c)return "extra-effect";
   }
   if(!s.protectedCompletion||s.currentState.reserved!==false||s.currentState.netCharge!==0)return "current-incomplete";
   return "verified-aborted";
 };
 const paths=["cancel_only","queue_only","compensation_count","full_integrity"];
 const decisions=cases.flatMap(s=>paths.map(path=>({scenario_id:s.id,path,decision:path==="full_integrity"?decision(s):path==="cancel_only"?(s.cancelTerminal?"verified-aborted":"unverified"):path==="queue_only"?(s.compensationQueued?"verified-aborted":"unverified"):(s.comp.length===2?"verified-aborted":"unverified")})));
 const failures=cases.filter(s=>decision(s)!==s.frozen_expected).map(s=>[s.id,s.frozen_expected,decision(s)]);
 return {scenarios:cases,decisions,paths,failures};
}
function evidencePayload(out){return {schema:"ballast-saga-compensation-bounded",logical_date:"2026-10-16",base_sha:"bb5161d9c9829692696e084a096ea3f96e4c59bb",source_access_date:"2026-10-16",scenario_kind:"authored deterministic primitives, not external sink observations",scenarios:out.scenarios};}
if(typeof module!=="undefined"){module.exports={produce,evidencePayload};if(require.main===module){const fs=require("fs");const path=require("path");const out=produce();if(out.failures.length)throw Error(JSON.stringify(out.failures));const dir=path.join(process.cwd(),"ballast","evidence");fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,"2026-10-16-saga-scenarios.json"),JSON.stringify(evidencePayload(out),null,2)+"\n");fs.writeFileSync(path.join(dir,"2026-10-16-saga-decisions.csv"),"scenario_id,path,decision\n"+out.decisions.map(x=>[x.scenario_id,x.path,x.decision].join(",")).join("\n")+"\n");console.log("scenarios="+out.scenarios.length+" decisions="+out.decisions.length+" frozen_mismatches="+out.failures.length+" real_effects=0 status=PASS");}}
