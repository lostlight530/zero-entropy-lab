// Ballast 2026-10-20 deterministic bounded rollover model
// Node CLI reads authored scenarios from adjacent JSON file
const specs=typeof require==="function"?require("./rollover_scenarios_2026_10_20.json"):globalThis.BALLAST_SCENARIOS;
function produce(){
 const cases=[];
 for(const spec of specs){
 const st={permission:true,members:["capture","notify"],revision:3,target:"inc-1",intent:"intent-20",workflow:"wf-20",run:"run-A"};
 const keys=new Map(),effects=[],events=[],chain=["run-A"];let t=0;
 const emit=o=>{const e={tick:++t,...o};events.push(e);return e};
 const change=([f,v])=>{if(f==="members"){st.members=v.slice();st.revision++}else st[f]=v;emit({kind:"control",field:f,value:v})};
 function commit(item,phase){
 const o=typeof item==="string"?{member:item}:item,m=o.member,r=o.run||st.run,op=o.op||"op-20",w=o.workflow||st.workflow,i=o.intent||st.intent,target=o.target||st.target;
 const attempt=o.attempt||(r==="run-A"?"try-A":"try-B"),key=o.key||(o.stable?"business:op-20:"+m:"run:"+r+":"+m);
 const sig=JSON.stringify([op,m,i,target,w]),old=keys.get(key),outcome=old===undefined?"accepted":old===sig?"dedup":"conflict";
 const authorized=o.auth===false?false:st.permission&&st.members.includes(m)&&target===st.target&&i===st.intent&&w===st.workflow;
 const e=emit({kind:"commit",phase,member:m,op,workflow:w,run:r,attempt,intent:i,target,key,authorized,bypass:!!o.bypass,outcome});
 if(outcome==="accepted"){keys.set(key,sig);effects.push(e)}
 }
 for(const p of spec.prior||[])commit(p,"prior");
 if(spec.loss)emit({kind:"response_lost",for_run:"run-A"});
 emit({kind:"rollover",from:"run-A",to:"run-B",workflow:st.workflow});st.run="run-B";chain.push("run-B");
 for(const x of spec.post||[])change(x);
 const weak=!keys.has("run:"+st.run+":capture")&&st.permission?"RETRY_ALLOWED":"BLOCKED";
 emit({kind:"decision_boundary",current_run:st.run});
 for(const p of spec.retry||[])commit(p,"retry");
 const q=emit({kind:"query",status:effects.length?"HIT":"MISS",scope_exact:true,coverage_global:true,health:true,watermark:100,min_watermark:20,retention:true,op:"op-20",workflow:st.workflow,intent:st.intent,target:st.target,revision:st.revision,scope_members:st.members.slice(),...spec.query});
 const witness=emit({kind:"witness",protected:true,members:st.members.slice(),revision:st.revision,target:st.target,at_tick:t+1,...spec.witness});
 for(const x of spec.afterWitness||[])change(x);
 const same=(a,b)=>Array.isArray(a)&&a.length===b.length&&a.slice().sort().join("|")===b.slice().sort().join("|");
 const covered=q.scope_exact===true&&q.coverage_global===true&&q.health===true&&Number.isInteger(q.watermark)&&q.watermark>=q.min_watermark&&q.op==="op-20"&&q.workflow===st.workflow&&q.intent===st.intent&&q.target===st.target&&q.revision===st.revision&&same(q.scope_members,st.members);
 const fresh=witness.protected===true&&witness.revision===st.revision&&witness.target===st.target&&same(witness.members,st.members)&&Number.isInteger(witness.at_tick)&&effects.every(e=>e.tick<=witness.at_tick);
 const exact=effects.length===st.members.length&&new Set(effects.map(e=>e.member)).size===effects.length&&effects.every(e=>st.members.includes(e.member)&&e.op==="op-20"&&e.workflow===st.workflow&&e.intent===st.intent&&e.target===st.target&&e.authorized===true&&chain.includes(e.run)&&e.attempt===(e.run==="run-A"?"try-A":"try-B"));
 let full;
 if(q.status==="MISS"&&effects.length)full="EVIDENCE_CONFLICT";
 else if(effects.length&&(!exact||!fresh))full="RECONCILE";
 else if(effects.length&&q.status==="HIT"&&covered&&exact&&fresh)full="COMPLETE";
 else if(effects.length)full="STOP_UNKNOWN";
 else if(q.status!=="MISS"||!covered||q.retention!==true)full="STOP_UNKNOWN";
 else if(!st.permission||!fresh)full="BLOCKED";
 else full="RETRY_ALLOWED";
 cases.push({id:spec.id,events,raw:{attempts:events.filter(e=>e.kind==="commit").length,accepted:effects.length,dedup:events.filter(e=>e.outcome==="dedup").length,conflicts:events.filter(e=>e.outcome==="conflict").length,final_members:st.members.slice(),final_run:st.run},decisions:{run_scoped_key:weak,receipt_count:effects.length===st.members.length?"COMPLETE":"RECONCILE",full_integrity:full}});
 }
 return {schema:"ballast-rollover-effect-identity-2026-10-20",execution:"bounded-v8-isolate",model:"synthetic-gateway-and-append-only-ledger",paths:["run_scoped_key","receipt_count","full_integrity"],scenarios:cases};
}
if(typeof require!=="undefined"&&typeof module!=="undefined"&&require.main===module)process.stdout.write(JSON.stringify(produce(),null,2)+"\n");
