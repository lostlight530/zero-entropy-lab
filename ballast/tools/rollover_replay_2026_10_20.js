// Ballast 2026-10-20 primitive event replay, no producer import
function replay(sc){
 if(!sc||!Array.isArray(sc.events))throw Error("events");
 const st={permission:true,members:["capture","notify"],revision:3,target:"inc-1",intent:"intent-20",workflow:"wf-20",run:"run-A"};
 const keys=new Map(),ledger=[],lineage=new Set(["run-A"]);let tick=0,boundary=null,q=null,w=null,stage=0;
 for(const e of sc.events){
 if(!Number.isInteger(e.tick)||e.tick<=tick)throw Error("tick");tick=e.tick;
 if(e.kind==="control"){
 if(!["members","permission","target","intent"].includes(e.field))throw Error("control field");
 if(e.field==="members"){if(!Array.isArray(e.value)||new Set(e.value).size!==e.value.length||!e.value.length)throw Error("membership");st.members=e.value.slice();st.revision++}
 else st[e.field]=e.value;
 }else if(e.kind==="rollover"){
 if(stage!==0||e.from!==st.run||e.to!=="run-B"||e.workflow!==st.workflow)throw Error("rollover");
 st.run=e.to;lineage.add(e.to);stage=1;
 }else if(e.kind==="response_lost"){
 if(stage!==0||e.for_run!=="run-A")throw Error("loss");
 }else if(e.kind==="decision_boundary"){
 if(stage!==1||boundary||e.current_run!==st.run)throw Error("boundary");
 boundary=!keys.has("run:"+st.run+":capture")&&st.permission?"RETRY_ALLOWED":"BLOCKED";stage=2;
 }else if(e.kind==="commit"){
 if(stage>=3||!["prior","retry"].includes(e.phase)||e.phase==="prior"&&stage!==0||e.phase==="retry"&&stage!==2)throw Error("commit phase");
 if(!["capture","notify","refund"].includes(e.member)||typeof e.key!=="string"||!e.key)throw Error("commit fields");
 const sig=JSON.stringify([e.op,e.member,e.intent,e.target,e.workflow]),old=keys.get(e.key),outcome=old===undefined?"accepted":old===sig?"dedup":"conflict";
 if(e.outcome!==outcome)throw Error("gateway replay");
 const permitted=st.permission&&st.members.includes(e.member)&&e.target===st.target&&e.intent===st.intent&&e.workflow===st.workflow;
 if(!e.bypass&&e.authorized!==permitted||e.bypass&&typeof e.authorized!=="boolean")throw Error("auth replay");
 if(outcome==="accepted"){keys.set(e.key,sig);ledger.push(e)}
 }else if(e.kind==="query"){
 if(stage!==2||q)throw Error("query order");q=e;stage=3;
 }else if(e.kind==="witness"){
 if(stage!==3||w)throw Error("witness order");w=e;stage=4;
 }else throw Error("event kind");
 }
 if(!boundary||!q||!w||stage!==4)throw Error("missing evidence");
 const same=(a,b)=>Array.isArray(a)&&a.length===b.length&&a.slice().sort().join("|")===b.slice().sort().join("|");
 const covered=q.scope_exact===true&&q.coverage_global===true&&q.health===true&&Number.isInteger(q.watermark)&&q.watermark>=q.min_watermark&&q.op==="op-20"&&q.workflow===st.workflow&&q.intent===st.intent&&q.target===st.target&&q.revision===st.revision&&same(q.scope_members,st.members);
 const fresh=w.protected===true&&w.revision===st.revision&&w.target===st.target&&same(w.members,st.members)&&Number.isInteger(w.at_tick)&&ledger.every(e=>e.tick<=w.at_tick);
 const exact=ledger.length===st.members.length&&new Set(ledger.map(e=>e.member)).size===ledger.length&&ledger.every(e=>st.members.includes(e.member)&&e.op==="op-20"&&e.workflow===st.workflow&&e.intent===st.intent&&e.target===st.target&&e.authorized===true&&lineage.has(e.run)&&e.attempt===(e.run==="run-A"?"try-A":"try-B"));
 let full="STOP_UNKNOWN";
 if(q.status==="MISS"&&ledger.length)full="EVIDENCE_CONFLICT";
 else if(ledger.length&&(!exact||!fresh))full="RECONCILE";
 else if(ledger.length&&q.status==="HIT"&&covered&&exact&&fresh)full="COMPLETE";
 else if(ledger.length)full="STOP_UNKNOWN";
 else if(q.status!=="MISS"||!covered||q.retention!==true)full="STOP_UNKNOWN";
 else if(!st.permission||!fresh)full="BLOCKED";
 else full="RETRY_ALLOWED";
 const raw={attempts:sc.events.filter(e=>e.kind==="commit").length,accepted:ledger.length,dedup:sc.events.filter(e=>e.kind==="commit"&&e.outcome==="dedup").length,conflicts:sc.events.filter(e=>e.kind==="commit"&&e.outcome==="conflict").length,final_members:st.members.slice(),final_run:st.run};
 return {raw,decisions:{run_scoped_key:boundary,receipt_count:ledger.length===st.members.length?"COMPLETE":"RECONCILE",full_integrity:full}};
}
if(typeof module!=="undefined")module.exports={replay};
