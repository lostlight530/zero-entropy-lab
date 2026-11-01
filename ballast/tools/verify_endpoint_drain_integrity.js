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
  const old=a.slices.flatMap(x=>x.endpoints.filter(e=>e.role==="old"));
  const expectedReady=old.every(e=>e.ready===false)?"COMPLETE":"RECONCILE";
  const expectedSnapshot=old.length===task.required.length&&old.every(e=>e.serving===false)?"COMPLETE":"RECONCILE";
  let full="COMPLETE";
  const distinct=x=>new Set(x).size===x.length;
  if(b.query.status==="authoritative miss"&&b.receipts.length>0)full="EVIDENCE_CONFLICT";
  else if(b.query.status!=="hit"||b.query.exact!==true||b.query.authority!=="synthetic-receipt"||!b.query.coveredAttempts.includes(task.attempt)||b.query.watermark<b.query.queryAt||b.query.queryAt>b.query.retentionUntil)full="STOP_UNKNOWN";
  else if(b.receipts.length===0)full="STOP_UNKNOWN";
  else if(b.receipts.length!==1)full="RECONCILE";
  else {
   const r=b.receipts[0];
   if(r.effect!=="drain"||r.task!==task.id||r.run!==task.run||r.attempt!==task.attempt||r.uid!==task.required[0]||r.grant!==g.id)full="RECONCILE";
   else if(!(r.time>=g.from&&r.time<=g.until&&g.scope===r.uid&&r.time<=b.query.queryAt&&r.time<=c.at))full="BLOCKED";
   else if(!a.complete||!a.watchContinuous||a.watchCompacted||!l.complete||l.watermark<l.queryAt||l.queryAt>l.retentionUntil||l.authority!=="synthetic-ledger")full="STOP_UNKNOWN";
   else if(!c.atomic||c.at<l.queryAt||c.listRV!==a.listRV||c.serviceUID!==a.serviceUID||c.selector!==a.selector||c.serviceUID!==task.serviceUID||c.selector!==task.selector||c.ledgerWatermark!==l.watermark)full="RECONCILE";
   else {
    const all=a.slices.flatMap(x=>x.endpoints),oldIds=old.map(e=>e.uid);
    if(!distinct(a.slices.map(x=>x.uid))||!distinct(all.map(e=>e.uid))||!distinct(oldIds)||!distinct(task.required)||!distinct(c.members)||!distinct(l.coveredUIDs)||!distinct(l.inflight.map(e=>e.uid))||a.slices.some(x=>x.serviceUID!==task.serviceUID)||oldIds.length!==task.required.length||old.some(e=>!task.required.includes(e.uid)||e.serving===true)||c.members.length!==task.required.length||c.members.some(x=>!task.required.includes(x))||l.coveredUIDs.length!==task.required.length||l.coveredUIDs.some(x=>!task.required.includes(x))||l.inflight.length!==task.required.length||l.inflight.some(x=>!task.required.includes(x.uid)||x.count!==0)||!l.trafficFence)full="RECONCILE";
   }
  }
  const expected=[expectedReady,expectedSnapshot,full];
  for(let j=0;j<3;j++){const key=s.id+"/"+paths[j];if(!decisionMap.has(key)||decisionMap.get(key)!==expected[j])errors.push("decision "+key+" expected "+expected[j]+" got "+decisionMap.get(key));checked++;}
 }
 for(const d of decisions)if(!ids.has(d.id)||!paths.includes(d.path))errors.push("unknown decision "+d.id+"/"+d.path);
 return {ok:errors.length===0,errors,scenarios:scenarios.length,decisionsChecked:checked,independence:{implementation:"PARTIAL",dataSource:"NONE",semanticContract:"SHARED",authority:"NONE"}};
}
if(typeof module!=="undefined")module.exports={verify};
