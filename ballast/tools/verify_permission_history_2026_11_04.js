// 2026-11-04 Ballast separate trace-only verifier, shared schema, no independent authority
function verify(xs,traces,decisions){
 const errors=[],paths=["count","reference"],ids=new Set();
 if(!Array.isArray(xs)||!Array.isArray(traces)||!Array.isArray(decisions))return {pass:false,errors:["input type"]};
 if(xs.length!==traces.length||decisions.length!==xs.length*2)errors.push("cardinality");
 if(new Set(traces.map(x=>x.id)).size!==traces.length)errors.push("duplicate trace");
 if(new Set(decisions.map(x=>x.id+"|"+x.path)).size!==decisions.length)errors.push("duplicate decision");
 const map=new Map(traces.map(x=>[x.id,x]));
 const nat=x=>typeof x==="number"&&Number.isSafeInteger(x)&&x>=0;
 const eq=(a,b)=>Array.isArray(a)&&Array.isArray(b)&&a.length>0&&a.length===b.length&&new Set(a).size===a.length&&new Set(b).size===b.length&&a.every(x=>typeof x==="string"&&x.length>0)&&b.every(x=>typeof x==="string"&&x.length>0)&&a.every(x=>b.includes(x));
 for(const item of xs){
 if(ids.has(item.id)||typeof item.id!=="string"||!item.id)errors.push("scenario id "+item.id);
 ids.add(item.id);
 const t=map.get(item.id);if(!t||!Array.isArray(t.events)){errors.push("missing trace "+item.id);continue}
 const many=type=>t.events.filter(x=>x.type===type);
 const single=type=>{const a=many(type);if(a.length!==1)errors.push("event "+type+" "+item.id);return a[0]||{}};
 const c=single("CONTRACT"),q=single("QUERY"),g=single("GRANT"),m=single("MEMBERS"),h=single("GUARD"),p=single("PERMISSION"),r=many("RECEIPT");
 if(t.events.length!==6+r.length)errors.push("unexpected event "+item.id);
 const valid=eq(c.required,["A","B"])&&Array.isArray(c.attempts)&&c.attempts.length===2&&c.attempts.every(nat)&&new Set(c.attempts).size===2&&[q.positive,q.miss,p.allowed,p.approval,p.credential].every(v=>typeof v==="boolean");
 const queryValid=q.authority==="sink-journal"&&q.exact===true&&q.task===c.task&&q.run===c.run&&q.uid===c.uid&&q.epoch===c.epoch&&JSON.stringify(q.attempts)===JSON.stringify(c.attempts)&&eq(q.members,c.required)&&q.lifecycle==="ACTIVE"&&[q.watermark,q.lastEnd,q.queryAt,q.retentionUntil].every(nat)&&q.watermark>=q.lastEnd&&q.watermark<=q.queryAt&&q.retentionUntil>=q.queryAt;
 let result="STOP_UNKNOWN";
 if(!valid)result="STOP_UNKNOWN";
 else if(q.positive===true&&q.miss===true||r.length>0&&q.miss===true)result="EVIDENCE_CONFLICT";
 else if(!queryValid)result="STOP_UNKNOWN";
 else if(!r.length)result=q.miss===true&&(p.allowed===false||p.approval===false||p.credential===false)?"BLOCKED":"STOP_UNKNOWN";
 else if(q.positive!==true)result="STOP_UNKNOWN";
 else if(!eq(r.map(x=>x.member),c.required)||r.some(x=>x.task!==c.task||x.run!==c.run||!c.attempts.includes(x.attempt)||x.uid!==c.uid||x.epoch!==c.epoch||x.revision!==c.revision||x.state!=="DONE"||!nat(x.at)))result="RECONCILE";
 else if(r.some(x=>x.at>q.watermark||x.at>q.queryAt))result="STOP_UNKNOWN";
 else if(g.authority!=="approval-ledger"||g.task!==c.task||g.run!==c.run||g.uid!==c.uid||g.epoch!==c.epoch||!nat(g.from)||!nat(g.to)||r.some(x=>x.at<g.from||x.at>g.to))result="BLOCKED";
 else if(m.uid!==c.uid||m.epoch!==c.epoch||m.revision!==c.revision||!eq(m.ids,c.required)||!eq(Object.keys(m.states||{}),c.required)||c.required.some(x=>m.states[x]!=="DONE"))result="RECONCILE";
 else if(h.uid!==c.uid||h.epoch!==c.epoch||h.revision!==c.revision||!eq(h.ids,c.required)||h.commitBound!==true||!nat(h.commitAt)||h.commitAt<q.queryAt||r.some(x=>x.at>h.commitAt))result="RECONCILE";
 else result="COMPLETE";
 for(const path of paths){const rr=decisions.filter(x=>x.id===item.id&&x.path===path);const value=path==="reference"?result:r.length>=c.required.length?"COMPLETE":"STOP_UNKNOWN";if(rr.length!==1||rr[0].decision!==value)errors.push("decision "+item.id+" "+path)}
 }
 if(map.size!==xs.length)errors.push("unmatched trace");
 if(decisions.some(x=>!ids.has(x.id)||!paths.includes(x.path)))errors.push("unexpected decision");
 return {pass:errors.length===0,errors,scenarios:xs.length,traces:traces.length,decisions:decisions.length,independence:{implementation:"PARTIAL",dataSource:"NONE",semanticContract:"SHARED",authority:"NONE"}};
}
if(typeof module!=="undefined")module.exports={verify};
