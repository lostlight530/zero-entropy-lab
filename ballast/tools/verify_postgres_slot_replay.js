// Ballast 2026-11-03 | separately coded trace reconstruction, shared synthetic semantic contract
function verify(scenarios,traces,decisions){
 const errors=[],paths=["checkpoint_proxy","delivery_proxy","full_reference"],seen=new Set();
 if(scenarios.length!==traces.length||decisions.length!==scenarios.length*3)errors.push("cardinality");
 const map=new Map(traces.map(x=>[x.id,x]));
 for(const item of scenarios){
  if(seen.has(item.id))errors.push("duplicate scenario "+item.id);
  seen.add(item.id);
  const trace=map.get(item.id);
  if(!trace||!Array.isArray(trace.events)){errors.push("missing trace "+item.id);continue}
  const events=trace.events;
  const only=t=>events.filter(x=>x.type===t);
  const one=t=>{const v=only(t);if(v.length!==1)errors.push("event cardinality "+item.id+" "+t);return v[0]||{}};
  const contract=one("CONTRACT"),tx=one("TRANSACTION"),cp=one("CHECKPOINT"),dl=one("DELIVERY"),q=one("PRIOR_QUERY"),grant=one("HISTORICAL_GRANT"),m=one("MEMBERSHIP"),g=one("COMPLETION_GUARD"),perm=one("CURRENT_PERMISSION"),history=one("ATTEMPT_REGISTRY"),dedup=one("SINK_DEDUP"),receipts=only("SINK_RECEIPT");
  const integer=x=>typeof x==="number"&&Number.isSafeInteger(x)&&x>=0;
  const uniqueSet=(xs,expected)=>Array.isArray(xs)&&Array.isArray(expected)&&xs.length>0&&xs.length===expected.length&&new Set(xs).size===xs.length&&new Set(expected).size===expected.length&&xs.every(x=>typeof x==="string"&&x.length>0)&&expected.every(x=>typeof x==="string"&&x.length>0)&&expected.every(x=>xs.includes(x));
  const exactHistory=Array.isArray(history.attempts)&&Array.isArray(q.attempts)&&JSON.stringify(history.attempts)===JSON.stringify(q.attempts)&&new Set(history.attempts).size===history.attempts.length;
  const queryValid=typeof q.positive==="boolean"&&typeof q.miss==="boolean"&&q.authority==="sink-journal"&&q.exact===true&&q.task===contract.task&&q.run===contract.run&&q.slotEpoch===contract.slotEpoch&&q.xid===contract.xid&&q.lsn===contract.lsn&&exactHistory&&q.lifecycle==="ACTIVE"&&[q.watermark,q.lastEnd,q.queryAt,q.retentionUntil].every(integer)&&q.watermark>=q.lastEnd&&q.watermark<=q.queryAt&&q.retentionUntil>=q.queryAt;
  let full;
  if((q.positive===true&&q.miss===true)||(receipts.length>0&&q.miss===true))full="EVIDENCE_CONFLICT";
  else if(tx.present!==true||tx.slotEpoch!==contract.slotEpoch||tx.xid!==contract.xid||tx.lsn!==contract.lsn)full="RECONCILE";
  else if(!queryValid)full="STOP_UNKNOWN";
  else if(receipts.length===0){
   if(q.miss!==true)full="STOP_UNKNOWN";
   else if(perm.allowed!==true||perm.approval!==true||perm.credential!==true)full="BLOCKED";
   // No protected retry-time permission and sink dedup proof in the authored trace
   else full="STOP_UNKNOWN";
  }else if(q.positive!==true)full="STOP_UNKNOWN";
  else if(!uniqueSet(receipts.map(x=>x.member),contract.required))full="RECONCILE";
  else if(receipts.some(x=>x.task!==contract.task||x.run!==contract.run||!history.attempts.includes(x.attempt)||x.slotEpoch!==contract.slotEpoch||x.xid!==contract.xid||x.lsn!==contract.lsn||x.uid!==contract.uid||x.state!=="DONE"||!integer(x.at)||x.at>q.watermark||x.at>q.queryAt))full="RECONCILE";
  else if(grant.authority!=="approval-ledger"||grant.slotEpoch!==contract.slotEpoch||!integer(grant.from)||!integer(grant.to)||receipts.some(x=>x.at<grant.from||x.at>grant.to))full="BLOCKED";
  else if(m.uid!==contract.uid||m.revision!==contract.revision||!uniqueSet(m.ids,contract.required)||!uniqueSet(Object.keys(m.states||{}),contract.required)||contract.required.some(x=>m.states[x]!=="DONE"))full="RECONCILE";
  else if(g.uid!==contract.uid||g.revision!==contract.revision||!uniqueSet(g.ids,contract.required)||g.commitBound!==true||!integer(g.commitAt)||g.commitAt<q.queryAt||receipts.some(x=>x.at>g.commitAt))full="RECONCILE";
  else full="COMPLETE";
  const expect={checkpoint_proxy:integer(cp.lsn)&&cp.lsn>=contract.lsn?"COMPLETE":"RECONCILE",delivery_proxy:integer(dl.count)&&dl.count>0?"COMPLETE":"RECONCILE",full_reference:full};
  for(const path of paths){
   const hits=decisions.filter(x=>x.id===item.id&&x.path===path);
   if(hits.length!==1||hits[0].decision!==expect[path])errors.push("decision mismatch "+item.id+" "+path+" expected "+expect[path]+" observed "+JSON.stringify(hits.map(x=>x.decision)));
  }
 }
 if(map.size!==scenarios.length)errors.push("trace identity cardinality");
 if(new Set(decisions.map(x=>x.id+"|"+x.path)).size!==decisions.length)errors.push("duplicate decision identity");
 return {pass:errors.length===0,errors,scenarioCount:scenarios.length,traceCount:traces.length,decisionCount:decisions.length,implementation:"PARTIAL",dataSource:"NONE",semanticContract:"SHARED",authority:"NONE"};
}
if (typeof module !== "undefined") module.exports = { verify };
