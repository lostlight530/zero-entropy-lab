// Ballast 2026-10-19 independent replay of primitive event journal
// Does not import or call the producer decision function; same modeled contract and facts
function evaluateCase(sc) {
  if(!sc||!Array.isArray(sc.events))throw Error("missing events");
  const current={permission:true,members:["A","B"],revision:5,target:"inc-1"};
  const replicas={east:new Map(),west:new Map()},ledger=[];
  let query=null,witness=null,read=null,lastTick=0;
  for(const e of sc.events) {
    if(!Number.isInteger(e.tick)||e.tick<=lastTick)throw Error("nonmonotonic tick");
    lastTick=e.tick;
    if(e.kind==="control") {
      if(e.field==="members") {
        if(!Array.isArray(e.value)||new Set(e.value).size!==e.value.length)throw Error("bad members");
        current.members=[...e.value];current.revision++;
      } else if(e.field==="permission"&&typeof e.value==="boolean")current.permission=e.value;
      else if(e.field==="target"&&typeof e.value==="string")current.target=e.value;
      else throw Error("bad control");
    } else if(e.kind==="commit") {
      if(!["east","west"].includes(e.region)||typeof e.effect_key!=="string")throw Error("bad commit identity");
      const table=replicas[e.region], shouldAccept=!table.has(e.effect_key);
      if(e.accepted!==shouldAccept)throw Error("local conditional write mismatch");
      const currentEligible=current.permission&&current.members.includes(e.member)&&current.target===e.target;
      if(e.authorized===true&&!currentEligible)throw Error("positive authorization contradicts control");
      if(typeof e.authorized!=="boolean")throw Error("untyped authorization");
      if(shouldAccept) {table.set(e.effect_key,e);ledger.push(e)}
    } else if(e.kind==="replicate") {
      if(e.from!=="east"||e.to!=="west"||!Array.isArray(e.members))throw Error("bad replication");
      for(const [key,val] of replicas.east)if(e.members.includes(val.member))replicas.west.set(key,val);
    } else if(e.kind==="read") {
      if(read||e.region!=="west")throw Error("bad regional read");
      const observed=[...replicas.west.keys()].sort();
      if(JSON.stringify(observed)!==JSON.stringify(e.keys))throw Error("stale read record mismatch");
      read=e;
    } else if(e.kind==="query") {
      if(query)throw Error("duplicate prior query");query=e;
    } else if(e.kind==="witness") {
      if(witness)throw Error("duplicate completion witness");witness=e;
    } else throw Error("unknown event");
  }
  if(!read||!query||!witness)throw Error("missing evidence axis");
  if(!sc.raw||sc.raw.sink_commits!==ledger.length||sc.raw.replica_east!==replicas.east.size||sc.raw.replica_west!==replicas.west.size)throw Error("raw counter mismatch");
  if(JSON.stringify(sc.raw.west_before)!==JSON.stringify(read.keys)||JSON.stringify(sc.raw.west_after)!==JSON.stringify([...replicas.west.keys()].sort()))throw Error("raw read mismatch");
  const targetMembers=[...current.members].sort(),foundMembers=ledger.map(x=>x.member).sort();
  let exact=ledger.length===targetMembers.length&&foundMembers.every((m,i)=>m===targetMembers[i]);
  for(const e of ledger)if(e.task!=="task-19"||e.run!=="run-19"||e.attempt!=="attempt-19"||e.target!==current.target||e.effect_key!=="effect:"+e.member||e.authorized!==true||e.tick>witness.at_tick)exact=false;
  const witnessGood=witness.protected===true&&witness.target===current.target&&witness.revision===current.revision&&Array.isArray(witness.members)&&JSON.stringify([...witness.members].sort())===JSON.stringify(targetMembers);
  const queryCovered=query.scope_exact===true&&query.coverage_global===true&&query.health===true&&Number.isInteger(query.watermark)&&query.watermark>=query.min_watermark&&query.task==="task-19"&&query.run==="run-19"&&query.attempt==="attempt-19"&&query.target===current.target&&query.revision===current.revision;
  let full="STOP_UNKNOWN";
  if(query.status==="MISS"&&ledger.length)full="RECONCILE";
  else if(ledger.length&&(!exact||!witnessGood))full="RECONCILE";
  else if(ledger.length&&query.status==="HIT"&&queryCovered&&exact&&witnessGood)full="COMPLETE";
  else if(ledger.length)full="STOP_UNKNOWN";
  else if(query.status!=="MISS"||!queryCovered||query.retention!==true)full="STOP_UNKNOWN";
  else if(!current.permission||!witnessGood)full="BLOCKED";
  else full="RETRY_ALLOWED";
  return {regional_absence:read.keys.includes("effect:A")?"BLOCKED":current.permission?"RETRY_ALLOWED":"BLOCKED",replica_count:replicas.west.size===targetMembers.length?"COMPLETE":"RECONCILE",full_integrity:full};
}
function verify(data,csvText) {
  if(data.schema!=="ballast-cross-region-miss-2026-10-19"||data.execution!=="bounded-v8-model")throw Error("schema");
  if(!Array.isArray(data.scenarios)||data.scenarios.length!==32)throw Error("scenario count");
  const paths=["regional_absence","replica_count","full_integrity"];
  if(JSON.stringify(data.decision_paths)!==JSON.stringify(paths))throw Error("paths");
  const seen=new Set(),totals={COMPLETE:0,RECONCILE:0,STOP_UNKNOWN:0,RETRY_ALLOWED:0,BLOCKED:0};
  for(const sc of data.scenarios){
    if(!sc.id||seen.has(sc.id))throw Error("duplicate scenario id");seen.add(sc.id);
    const actual=evaluateCase(sc);
    if(Object.keys(sc.decisions).sort().join("|")!==[...paths].sort().join("|"))throw Error("path coverage");
    for(const p of paths)if(sc.decisions[p]!==actual[p])throw Error("decision disagreement "+sc.id+" "+p);
    totals[actual.full_integrity]++;
  }
  if(typeof csvText!=="string")throw Error("CSV evidence required");
  const csvRows=csvText.trimEnd().split("\n").map(x=>x.replace(/\r$/,""));
  if(csvRows[0]!=="scenario_id,decision_path,decision,local_sink_commits,regional_west_receipt_count")throw Error("CSV header");
  if(csvRows.length!==1+data.scenarios.length*paths.length)throw Error("CSV row count");
  const expected=new Map();
  for(const sc of data.scenarios)for(const p of paths)expected.set(sc.id+"|"+p,[sc.id,p,sc.decisions[p],sc.raw.sink_commits,sc.raw.replica_west].join(","));
  const csvSeen=new Set();
  for(const row of csvRows.slice(1)){
    const fields=row.split(",");
    if(fields.length!==5)throw Error("CSV fields");
    const key=fields[0]+"|"+fields[1];
    if(csvSeen.has(key)||!expected.has(key)||expected.get(key)!==row)throw Error("CSV mismatch "+key);
    csvSeen.add(key);
  }
  const positives=data.scenarios.filter(sc=>sc.decisions.full_integrity==="COMPLETE").slice(0,2);
  if(positives.length!==2)throw Error("missing positive controls");
  const mutations=[
    sc=>sc.events.find(e=>e.kind==="commit"&&e.member==="B").member="C",
    sc=>sc.events.find(e=>e.kind==="commit"&&e.member==="B").effect_key="effect:A:other",
    sc=>sc.events.find(e=>e.kind==="commit"&&e.member==="B").run="run-other",
    sc=>sc.events.find(e=>e.kind==="commit"&&e.member==="B").attempt="attempt-other",
    sc=>sc.events.find(e=>e.kind==="commit"&&e.member==="B").target="inc-other",
    sc=>sc.events.find(e=>e.kind==="commit"&&e.member==="B").authorized=false,
    sc=>sc.events.find(e=>e.kind==="commit"&&e.member==="B").accepted=false,
    sc=>sc.events.find(e=>e.kind==="read").keys.push("effect:extra"),
    sc=>sc.events.find(e=>e.kind==="query").status="MISS",
    sc=>sc.events.find(e=>e.kind==="query").status="UNKNOWN",
    sc=>sc.events.find(e=>e.kind==="query").scope_exact=false,
    sc=>sc.events.find(e=>e.kind==="query").coverage_global=false,
    sc=>sc.events.find(e=>e.kind==="query").health=false,
    sc=>sc.events.find(e=>e.kind==="query").watermark=1,
    sc=>sc.events.find(e=>e.kind==="query").task="task-other",
    sc=>sc.events.find(e=>e.kind==="query").run="run-other",
    sc=>sc.events.find(e=>e.kind==="query").attempt="attempt-other",
    sc=>sc.events.find(e=>e.kind==="query").target="inc-other",
    sc=>sc.events.find(e=>e.kind==="query").revision=6,
    sc=>sc.events.find(e=>e.kind==="witness").protected=false,
    sc=>sc.events.find(e=>e.kind==="witness").members=["A","C"],
    sc=>sc.events.find(e=>e.kind==="witness").revision=6,
    sc=>sc.events.find(e=>e.kind==="witness").target="inc-other",
    sc=>sc.events.find(e=>e.kind==="witness").at_tick=1,
    sc=>sc.events.find(e=>e.kind==="commit"&&e.member==="B").effect_key="",
    sc=>sc.events.find(e=>e.kind==="commit"&&e.member==="B").task="task-other",
    sc=>sc.events.push({kind:"control",tick:sc.events[sc.events.length-1].tick+1,field:"members",value:["A","C"]})
  ];
  let rejected=0,structural=0,semantic=0;
  for(const positive of positives)for(const mutate of mutations){
    const changed=JSON.parse(JSON.stringify(positive));mutate(changed);
    try{const outcome=evaluateCase(changed).full_integrity;if(outcome!=="COMPLETE"){rejected++;semantic++}}
    catch(e){rejected++;structural++}
  }
  if(rejected!==positives.length*mutations.length)throw Error("negative control accepted "+rejected);
  return {status:"PASS",scenario_count:seen.size,decision_rows:seen.size*paths.length,totals,mutation_controls:positives.length*mutations.length,mutation_rejected:rejected,mutation_structural:structural,mutation_semantic:semantic,external_effects:0,implementation_independence:"separate reconstruction",data_source_independence:"NONE",semantic_contract_independence:"LIMITED",authority_independence:"NONE"};
}
if(typeof require!=="undefined"&&typeof module!=="undefined"&&require.main===module){const fs=require("fs");const p=process.argv[2];if(!p||!process.argv[3])throw Error("usage: node verify_cross_region_prior_miss.js evidence.json decisions.csv");process.stdout.write(JSON.stringify(verify(JSON.parse(fs.readFileSync(p,"utf8")),fs.readFileSync(process.argv[3],"utf8")),null,2)+"\n")}
