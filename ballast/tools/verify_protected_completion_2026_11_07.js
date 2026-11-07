// 2026-11-07 maintainer separately implemented primitive-event verifier, synthetic shared semantics
function verify(cases,traces,decisions){
 const errors=[],str=x=>typeof x==="string"&&x.length>0,int=x=>typeof x==="number"&&Number.isSafeInteger(x)&&x>=0;
 const exact=(a,b)=>Array.isArray(a)&&Array.isArray(b)&&a.length>0&&a.length===b.length&&new Set(a).size===a.length&&new Set(b).size===b.length&&a.every(str)&&b.every(str)&&a.every(x=>b.includes(x));
 if(!Array.isArray(cases)||!Array.isArray(traces)||!Array.isArray(decisions))return {pass:false,errors:["containers"]};
 if(traces.length!==cases.length||decisions.length!==cases.length*2)errors.push("container cardinality");
 const ids=new Set(),traceIds=new Set(),pairKeys=new Set();
 for(const x of cases){if(!str(x.id)||ids.has(x.id))errors.push("duplicate/invalid case "+x.id);ids.add(x.id)}
 for(const t of traces){if(!str(t.id)||traceIds.has(t.id))errors.push("duplicate/invalid trace "+t.id);traceIds.add(t.id)}
 for(const d of decisions){const key=d.id+"|"+d.path;if(pairKeys.has(key))errors.push("duplicate decision key "+key);pairKeys.add(key);if(!ids.has(d.id)||!["weak_count","reference"].includes(d.path))errors.push("unexpected decision "+key)}
 if(ids.size!==traceIds.size||[...ids].some(x=>!traceIds.has(x)))errors.push("trace coverage");
 for(const x of cases){
  const t=traces.find(z=>z.id===x.id);if(!t||!Array.isArray(t.events)){errors.push("missing trace "+x.id);continue}
  const kind=k=>t.events.filter(e=>e.kind===k);
  const one=k=>{const a=kind(k);if(a.length!==1)errors.push("event multiplicity "+x.id+" "+k);return a[0]?.data};
  const i=one("INTENT"),p=one("PERMISSION"),e=one("EFFECT_TIME"),g=one("GRANT"),q=one("QUERY"),c=one("CURRENT"),rs=kind("RECEIPT").map(z=>z.data);
  if(t.events.length!==6+rs.length||t.events.some(z=>!["INTENT","PERMISSION","EFFECT_TIME","GRANT","QUERY","CURRENT","RECEIPT"].includes(z.kind)))errors.push("extra event "+x.id);
  if(!i||!p||!e||!g||!q||!c){errors.push("missing primitive "+x.id);continue}
  const s={...i,permissionNow:p.now,effectTime:e.at,grant:g,query:q,receipts:rs,current:c};
  if(JSON.stringify(s)!==JSON.stringify(x.state))errors.push("case/trace mismatch "+x.id);
  let expected="STOP_UNKNOWN";
  const scope=[s.task,s.run,s.attempt,s.action,s.target].every(str)&&exact(s.required,["A","B"])&&typeof s.permissionNow==="boolean"&&int(s.effectTime);
  if(scope){
   const covered=q.authority==="synthetic-journal"&&q.exact===true&&q.lifecycle==="ACTIVE"&&["hit","miss","unknown"].includes(q.state)&&q.task===s.task&&q.run===s.run&&q.attempt===s.attempt&&q.action===s.action&&q.target===s.target&&exact(q.members,s.required)&&exact(q.attempts,[s.attempt])&&[q.watermark,q.lastEnd,q.at,q.retentionUntil].every(int)&&q.lastEnd>=s.effectTime&&q.watermark>=q.lastEnd&&q.watermark<=q.at&&q.at<=q.retentionUntil;
   if(!covered)expected="STOP_UNKNOWN";
   else if(q.state==="miss"&&rs.length>0)expected="EVIDENCE_CONFLICT";
   else if(q.state!=="hit"||rs.length===0)expected="STOP_UNKNOWN";
   else if(!exact(rs.map(v=>v.member),s.required)||rs.some(v=>v.task!==s.task||v.run!==s.run||v.attempt!==s.attempt||v.target!==s.target||v.effect!=="commit-"+v.member||v.at!==s.effectTime||v.state!=="DONE"))expected="RECONCILE";
   else if(g.issuer!=="synthetic-grant-ledger"||typeof g.enabled!=="boolean"||!str(g.task)||g.task!==s.task||g.run!==s.run||g.attempt!==s.attempt||g.action!==s.action||g.target!==s.target||!exact(g.members,s.required)||![g.from,g.to].every(int))expected="STOP_UNKNOWN";
   else if(g.enabled===false||s.effectTime<g.from||s.effectTime>g.to)expected="BLOCKED";
   else if(c.target!==s.target||!exact(c.members,s.required)||!exact(c.done,s.required)||!c.states||!exact(Object.keys(c.states),s.required)||s.required.some(m=>c.states[m]!=="DONE"))expected="RECONCILE";
   else if(![c.revision,c.guardRevision,c.membershipRevision,c.verifiedAt].every(int)||c.verifiedAt<s.effectTime||c.revision!==c.guardRevision||c.revision!==c.membershipRevision||c.protected!==true||c.atomic!==true)expected="STOP_UNKNOWN";
   else expected="COMPLETE";
  }
  const weak=rs.length>=s.required.length?"COMPLETE":"STOP_UNKNOWN";
  for(const [path,want] of [["weak_count",weak],["reference",expected]]){
    const hits=decisions.filter(d=>d.id===x.id&&d.path===path);
    if(hits.length!==1||hits[0].decision!==want)errors.push("incorrect "+x.id+" "+path+" wanted "+want);
  }
 }
 return {pass:errors.length===0,errors,scenarios:cases.length,traces:traces.length,events:traces.reduce((n,t)=>n+t.events.length,0),decisions:decisions.length,independence:{implementation:"PARTIAL",dataSource:"NONE",semanticContract:"SHARED",authority:"NONE"}};
}
if(typeof module!=='undefined')module.exports={verify};
