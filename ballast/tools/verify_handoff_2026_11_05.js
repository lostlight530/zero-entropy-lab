// Rebuild from trace primitives, without invoking producer decision function
function verify(xs,traces,decisions){
const errors=[],ids=new Set(),map=new Map(traces.map(t=>[t.id,t]));
if(xs.length!==traces.length||decisions.length!==xs.length*3)errors.push("cardinality");
if(map.size!==traces.length||new Set(decisions.map(d=>d.id+"|"+d.path)).size!==decisions.length)errors.push("duplicate identity");
for(const {id} of xs){
if(ids.has(id))errors.push("duplicate scenario "+id);ids.add(id);
const t=map.get(id);if(!t){errors.push("missing trace "+id);continue}
const all=k=>t.events.filter(e=>e.kind===k),one=k=>{const a=all(k);if(a.length!==1)errors.push("event multiplicity "+id+" "+k);return a[0]};
const i=one("INTENT"),o=one("OWNER"),p=one("PERMISSION"),g=one("GRANT"),pre=one("PRECHECK"),c=one("COMMIT"),q=one("QUERY"),k=one("CURRENT"),receipts=all("RECEIPT");
if(receipts.length>1||t.events.length!==8+receipts.length)errors.push("extra event "+id);
if(!i||!o||!p||!g||!pre||!c||!q||!k)continue;
const r=receipts[0],valid=q.authority==="sink-journal"&&q.effect===i.effect&&q.target===i.target&&q.at<=q.retentionUntil&&q.watermark>=c.at&&q.watermark<=q.at;
let result="STOP_UNKNOWN";
if(r&&q.state==="MISS")result="EVIDENCE_CONFLICT";
else if(!valid||!["HIT","MISS","UNKNOWN"].includes(q.state))result="STOP_UNKNOWN";
else if(!r)result=q.state==="MISS"?(p.permit&&p.approval&&p.credential?"RETRY_REQUIRES_NEW_FENCE":"BLOCKED"):"STOP_UNKNOWN";
else if(q.state!=="HIT")result="STOP_UNKNOWN";
else if(r.effect!==i.effect||r.target!==i.target||r.at!==c.at||r.at>q.watermark||r.at>q.at||r.at<0)result="RECONCILE";
else if(g.subject!==o.delegate||g.generation!==o.delegateGeneration||g.action!==i.effect||g.target!==i.target||r.at<g.from||r.at>g.to||r.authorized!==true)result="BLOCKED";
else if(!p.permit||!p.approval||!p.credential||o.owner!==o.delegate||o.generation!==o.delegateGeneration||pre.generation!==o.generation||c.generation!==o.generation||c.issuer!=="sink-guard"||c.atomic!==true)result="BLOCKED";
else if(k.target!==i.target||k.revision!==k.guardRevision||k.protected!==true||k.members.length!==1||k.members[0]!=="A"||k.done.length!==1||k.done[0]!=="A")result="RECONCILE";
else result="COMPLETE";
for(const [path,value] of [["weak_precheck",pre.generation===o.delegateGeneration?"COMPLETE":"BLOCKED"],["weak_receipt",r?"COMPLETE":"STOP_UNKNOWN"],["reference",result]]){const a=decisions.filter(d=>d.id===id&&d.path===path);if(a.length!==1||a[0].decision!==value)errors.push("decision "+id+" "+path)}
}
if(decisions.some(d=>!ids.has(d.id)||!["weak_precheck","weak_receipt","reference"].includes(d.path)))errors.push("unexpected decision");
return {pass:errors.length===0,errors,scenarios:xs.length,traceEvents:traces.reduce((n,t)=>n+t.events.length,0),decisions:decisions.length,independence:{implementation:"PARTIAL",dataSource:"NONE",semanticContract:"SHARED",authority:"NONE"}};
}
if(typeof module!=="undefined")module.exports={verify};
