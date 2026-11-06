// Ballast 2026-11-06 separately coded primitive event verifier, synthetic and shared semantic contract
// Does not call producer reference; case-to-trace binding checks apply to independently reassembled primitives
function verify(xs,traces,decisions){
 const errs=[],validPaths=["weak_receipt","reference"],str=x=>typeof x==="string"&&x.length>0,integer=x=>typeof x==="number"&&Number.isSafeInteger(x)&&x>=0;
 const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
 const exact=(a,b)=>Array.isArray(a)&&Array.isArray(b)&&a.length>0&&a.length===b.length&&new Set(a).size===a.length&&new Set(b).size===b.length&&a.every(str)&&b.every(str)&&b.every(x=>a.includes(x));
 if(!Array.isArray(xs)||!Array.isArray(traces)||!Array.isArray(decisions))return {pass:false,errors:["containers"]};
 if(traces.length!==xs.length||decisions.length!==xs.length*2)errs.push("cardinality");
 const ids=new Set(),traceIds=new Set(),pairs=new Set();
 for(const x of xs){if(!str(x.id)||ids.has(x.id))errs.push("duplicate/invalid scenario");ids.add(x.id)}
 for(const t of traces){if(!str(t.id)||traceIds.has(t.id))errs.push("duplicate/invalid trace");traceIds.add(t.id)}
 for(const d of decisions){const k=d.id+"|"+d.path;if(pairs.has(k))errs.push("duplicate decision");pairs.add(k);if(!ids.has(d.id)||!validPaths.includes(d.path))errs.push("unexpected decision")}
 if(ids.size!==traceIds.size||[...ids].some(id=>!traceIds.has(id)))errs.push("trace identity coverage");
 for(const x of xs){
   const t=traces.find(z=>z.id===x.id);
   if(!t||!Array.isArray(t.events)){errs.push("missing trace "+x.id);continue}
   const pick=k=>t.events.filter(z=>z.kind===k);
   const one=k=>{let z=pick(k);if(z.length!==1)errs.push("multiplicity "+x.id+" "+k);return z[0]?.data};
   const intent=one("INTENT"),auth=one("AUTHORITY"),time=one("TEMPORAL"),query=one("QUERY"),current=one("CURRENT"),receipts=pick("RECEIPT").map(x=>x.data);
   if(t.events.length!==5+receipts.length||t.events.some(e=>!["INTENT","AUTHORITY","TEMPORAL","QUERY","CURRENT","RECEIPT"].includes(e.kind)))errs.push("unexpected event "+x.id);
   if(!intent||!auth||!time||!query||!current){errs.push("missing primitive "+x.id);continue}
   const s={...intent,authority:auth,time,query,receipts,current};
   if(!same(s,x.state)){errs.push("case-to-trace binding "+x.id)}
   const a=s.authority,q=s.query,c=s.current,p=s.time;
   let want="STOP_UNKNOWN";
   const typed=str(s.task)&&str(s.run)&&str(s.attempt)&&str(s.target)&&exact(s.effectSet,["A","B"])&&integer(p.effect)&&integer(p.effectError)&&integer(p.revokeError)&&(p.revocation===null||integer(p.revocation))&&integer(a.from)&&integer(a.to)&&typeof a.active==="boolean"&&typeof a.effectPermission==="boolean"&&typeof a.currentPermission==="boolean";
   if(typed){
     const lo=p.effect-p.effectError,hi=p.effect+p.effectError;
     const queryOk=lo>=0&&Number.isSafeInteger(hi)&&q.authority==="synthetic-effect-journal"&&q.exact===true&&q.lifecycle==="ACTIVE"&&["HIT","MISS","UNKNOWN"].includes(q.state)&&q.task===s.task&&q.run===s.run&&q.attempt===s.attempt&&exact(q.attempts,[s.attempt])&&q.target===s.target&&exact(q.effectSet,s.effectSet)&&[q.at,q.watermark,q.lastEnd,q.retentionUntil].every(integer)&&q.watermark>=q.lastEnd&&q.lastEnd>=hi&&q.watermark>=hi&&q.watermark<=q.at&&q.at<=q.retentionUntil;
     if(!queryOk)want="STOP_UNKNOWN";
     else if(receipts.length>0&&q.state==="MISS")want="EVIDENCE_CONFLICT";
     else if(q.state!=="HIT"||receipts.length===0)want="STOP_UNKNOWN";
     else if(!exact(receipts.map(z=>z.member),s.effectSet)||receipts.some(z=>z.task!==s.task||z.run!==s.run||z.attempt!==s.attempt||z.target!==s.target||z.effect!=="effect-"+z.member||z.at!==p.effect||z.state!=="DONE"))want="RECONCILE";
     else if(a.issuer!=="synthetic-grant-ledger"||!str(a.subject)||a.task!==s.task||a.run!==s.run||a.attempt!==s.attempt||a.target!==s.target||!exact(a.effectSet,s.effectSet)||a.active!==true||a.effectPermission!==true||a.from>a.to||hi<a.from||lo>a.to)want="BLOCKED";
     else if(lo<a.from||hi>a.to||p.revocation===null||!Number.isSafeInteger(p.revocation+p.revokeError)||p.revocation<p.revokeError)want="STOP_UNKNOWN";
     else if(p.revocation+p.revokeError<lo)want="BLOCKED";
     else if(!(hi<p.revocation-p.revokeError))want="STOP_UNKNOWN";
     else if(c.target!==s.target||!exact(c.effectSet,s.effectSet)||!exact(c.members,s.effectSet)||!c.states||!exact(Object.keys(c.states),s.effectSet)||s.effectSet.some(m=>c.states[m]!=="DONE")||![c.revision,c.guardRevision,c.membershipRevision,c.observedAt].every(integer)||c.revision!==c.guardRevision||c.revision!==c.membershipRevision||c.protected!==true||c.observedAt<hi)want="RECONCILE";
     else want="COMPLETE";
   }
   const weak=receipts.length?"COMPLETE":"STOP_UNKNOWN";
   for(const [path,expected] of [["weak_receipt",weak],["reference",want]]){
      const hit=decisions.filter(d=>d.id===x.id&&d.path===path);
      if(hit.length!==1||hit[0].decision!==expected)errs.push("decision mismatch "+x.id+" "+path+" expected "+expected);
   }
 }
 return {pass:errs.length===0,errors:errs,scenarios:xs.length,traces:traces.length,primitiveEvents:traces.reduce((n,t)=>n+t.events.length,0),decisions:decisions.length,independence:{implementation:"PARTIAL",dataSource:"NONE",semanticContract:"SHARED",authority:"NONE"}};
}
if(typeof module!=='undefined')module.exports={verify};
