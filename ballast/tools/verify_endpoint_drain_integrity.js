"use strict";
function verify(scenarios,traces,decisions) {
 const errors=[],ids=new Set(),paths=["ready_proxy","snapshot_proxy","full_reference"];
 if(scenarios.length!==traces.length||decisions.length!==scenarios.length*3)errors.push("cardinality");
 const traceMap=new Map(),decisionMap=new Map();
 for(const t of traces){if(traceMap.has(t.id))errors.push("duplicate trace "+t.id);traceMap.set(t.id,t);}
 for(const d of decisions){const key=d.id+"/"+d.path;if(decisionMap.has(key))errors.push("duplicate decision "+key);decisionMap.set(key,d.decision);}
 let checked=0;
 for(const s of scenarios) {
  if(ids.has(s.id))errors.push("duplicate scenario "+s.id);ids.add(s.id);
  const t=traceMap.get(s.id);
  if(!t){errors.push("missing trace "+s.id);continue;}
  if(JSON.stringify(t.task)!==JSON.stringify(s.state.task))errors.push("task provenance "+s.id);
  if(!Array.isArray(t.events)||t.events.length!==5||t.events.map(e=>e.kind).join(",")!=="LIST,RECEIPT_QUERY,GRANT,LEDGER_QUERY,COMMIT_ATTEMPT"){errors.push("event order "+s.id);continue;}
  const a=t.events[0].snapshot,b=t.events[1],g=t.events[2].grant,l=t.events[3].ledger,c=t.events[4].guard,task=t.task;
  if(JSON.stringify(a)!==JSON.stringify(s.state.snapshot)||JSON.stringify(b.query)!==JSON.stringify(s.state.receiptQuery)||JSON.stringify(b.receipts)!==JSON.stringify(s.state.receipts)||JSON.stringify(g)!==JSON.stringify(s.state.grant)||JSON.stringify(l)!==JSON.stringify(s.state.ledger)||JSON.stringify(c)!==JSON.stringify(s.state.guard)||t.events[4].permission!==s.state.task.currentPermission)errors.push("primitive trace provenance "+s.id);
  const old=a.slices.flatMap(x=>x.endpoints.filter(e=>e.role==="old"));
  const expectedReady=old.every(e=>e.ready===false)?"COMPLETE":"RECONCILE";
  const expectedSnapshot=old.length===task.required.length&&old.every(e=>e.serving===false)?"COMPLETE":"RECONCILE";
  let full="COMPLETE";
  const distinct=x=>new Set(x).size===x.length;
  const scope=[task.id,task.run,task.attempt,task.serviceUID,...task.required].join("/");
  const exact=(a,b)=>Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&new Set(a).size===a.length&&new Set(b).size===b.length&&a.every(x=>b.includes(x));
  if(b.query.status==="authoritative miss"&&b.receipts.length>0)full="EVIDENCE_CONFLICT";
  else if(b.query.status!=="hit"||b.query.exact!==true||b.query.authority!=="synthetic-receipt"||!Array.isArray(b.query.coveredAttempts)||!b.query.coveredAttempts.includes(task.attempt)||b.query.watermark>b.query.queryAt||b.query.queryAt>b.query.retentionUntil||b.query.queryAt>=l.queryAt||b.query.queryAt>=c.at||b.query.retentionUntil<c.at||b.query.lifecycle!=="ACTIVE"||b.query.scope!==scope||!exact(b.query.coveredAttempts,[task.attempt])||!exact(b.query.members,task.required)||!exact(b.query.effects,["drain"]))full="STOP_UNKNOWN";
  else if(![b.query.watermark,b.query.queryAt,b.query.retentionUntil,g.from,g.until,l.watermark,l.queryAt,l.retentionUntil,c.at,c.listRV,a.listRV].every(Number.isSafeInteger))full="STOP_UNKNOWN";
  else if(b.receipts.length===0)full="STOP_UNKNOWN";
  else if(b.receipts.length!==1)full="RECONCILE";
  else {
   const r=b.receipts[0];
   if(!Number.isSafeInteger(r.time))full="STOP_UNKNOWN";
   else if(r.effect!=="drain"||r.task!==task.id||r.run!==task.run||r.attempt!==task.attempt||r.uid!==task.required[0]||r.grant!==g.id)full="RECONCILE";
   else if(!(r.time>=g.from&&r.time<=g.until&&g.scope===r.uid&&g.authority==="synthetic-grant"&&r.grantAuthority===g.authority&&r.time<=b.query.watermark&&r.time<=b.query.queryAt&&r.time<=c.at))full="BLOCKED";
   else if(!a.complete||!a.watchContinuous||a.watchCompacted||!l.complete||l.watermark>l.queryAt||l.queryAt>l.retentionUntil||l.retentionUntil<c.at||l.authority!=="synthetic-ledger"||l.scope!==scope||l.serviceUID!==task.serviceUID||l.selector!==task.selector)full="STOP_UNKNOWN";
   else if(!c.atomic||c.at<l.queryAt||c.listRV!==a.listRV||c.serviceUID!==a.serviceUID||c.selector!==a.selector||c.serviceUID!==task.serviceUID||c.selector!==task.selector||c.ledgerWatermark!==l.watermark||c.ledgerIdentity!==l.identity)full="RECONCILE";
   else {
    const all=a.slices.flatMap(x=>x.endpoints),oldIds=old.map(e=>e.uid);
    if(a.slices.some(x=>x.rv!==a.listRV)||!distinct(a.slices.map(x=>x.uid))||!distinct(all.map(e=>e.uid))||!distinct(oldIds)||!distinct(task.required)||!distinct(c.members)||!distinct(l.coveredUIDs)||!distinct(l.inflight.map(e=>e.uid))||a.slices.some(x=>x.serviceUID!==task.serviceUID)||oldIds.length!==task.required.length||old.some(e=>!task.required.includes(e.uid)||e.ready!==false||e.serving!==false||e.terminating!==true)||c.members.length!==task.required.length||c.members.some(x=>!task.required.includes(x))||l.coveredUIDs.length!==task.required.length||l.coveredUIDs.some(x=>!task.required.includes(x))||l.inflight.length!==task.required.length||l.inflight.some(x=>!task.required.includes(x.uid)||x.count!==0)||!l.trafficFence)full="RECONCILE";
   }
  }
  const expected=[expectedReady,expectedSnapshot,full];
  for(let j=0;j<3;j++){const key=s.id+"/"+paths[j];if(!decisionMap.has(key)||decisionMap.get(key)!==expected[j])errors.push("decision "+key+" expected "+expected[j]+" got "+decisionMap.get(key));checked++;}
 }
 for(const d of decisions)if(!ids.has(d.id)||!paths.includes(d.path))errors.push("unknown decision "+d.id+"/"+d.path);
 return {ok:errors.length===0,errors,scenarios:scenarios.length,decisionsChecked:checked,independence:{implementation:"PARTIAL",dataSource:"NONE",semanticContract:"SHARED",authority:"NONE"}};
}
if(typeof module!=="undefined")module.exports={verify};
