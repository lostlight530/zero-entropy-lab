// Ballast 2026-10-20 independent event-replay verification harness
const replayFn=typeof require==="function"?require("./rollover_replay_2026_10_20.js").replay:globalThis.BALLAST_REPLAY;
function checkOne(sc){
 const actual=replayFn(sc);
 if(JSON.stringify(sc.raw)!==JSON.stringify(actual.raw))throw Error("raw mismatch "+sc.id);
 for(const p of ["run_scoped_key","receipt_count","full_integrity"])if(sc.decisions[p]!==actual.decisions[p])throw Error("decision mismatch "+sc.id+" "+p);
 if(Object.keys(sc.decisions).length!==3)throw Error("path count");
 return actual;
}
function verify(data,csvText){
 if(data.schema!=="ballast-rollover-effect-identity-2026-10-20"||data.execution!=="bounded-v8-isolate")throw Error("schema");
 const paths=["run_scoped_key","receipt_count","full_integrity"];
 if(JSON.stringify(data.paths)!==JSON.stringify(paths)||!Array.isArray(data.scenarios)||data.scenarios.length!==35)throw Error("scenario shape");
 const ids=new Set(),totals={},stats={attempts:0,accepted:0,dedup:0,conflicts:0},expected=new Map();
 for(const sc of data.scenarios){
 if(!sc.id||ids.has(sc.id))throw Error("scenario identity");ids.add(sc.id);
 const actual=checkOne(sc),full=actual.decisions.full_integrity;
 totals[full]=(totals[full]||0)+1;
 for(const k of Object.keys(stats))stats[k]+=actual.raw[k];
 for(const p of paths)expected.set(sc.id+"|"+p,[sc.id,p,actual.decisions[p],actual.raw.attempts,actual.raw.accepted,actual.raw.dedup,actual.raw.conflicts].join(","));
 }
 const lines=csvText.trimEnd().split("\n").map(x=>x.replace(/\r$/,""));
 if(lines[0]!=="scenario_id,decision_path,decision,attempts,accepted,dedup,conflicts"||lines.length!==1+ids.size*3)throw Error("CSV shape");
 const seen=new Set();
 for(const line of lines.slice(1)){
 const col=line.split(","),key=col[0]+"|"+col[1];
 if(col.length!==7||seen.has(key)||expected.get(key)!==line)throw Error("CSV mismatch "+key);
 seen.add(key);
 }
 const positives=data.scenarios.filter(s=>["complete_prior","stable_key_replay_both"].includes(s.id));
 if(positives.length!==2||positives.some(s=>s.decisions.full_integrity!=="COMPLETE"))throw Error("positive controls");
 const mutations=[];
 for(const [field,value] of [["member","refund"],["op","op-X"],["workflow","wf-X"],["intent","intent-X"],["target","inc-X"],["run","run-X"],["attempt","try-X"],["authorized",false],["outcome","dedup"]]){
 mutations.push(sc=>{sc.events.find(e=>e.kind==="commit"&&e.member==="capture"&&e.outcome==="accepted")[field]=value});
 }
 for(const [field,value] of [["status","MISS"],["status","UNKNOWN"],["coverage_global",false],["health",false],["watermark",0],["op","op-X"],["workflow","wf-X"],["intent","intent-X"],["target","inc-X"],["revision",999],["scope_members",["capture"]]]){
 mutations.push(sc=>{sc.events.find(e=>e.kind==="query")[field]=value});
 }
 for(const [field,value] of [["protected",false],["members",["capture"]],["revision",999],["target","inc-X"],["at_tick",1]]){
 mutations.push(sc=>{sc.events.find(e=>e.kind==="witness")[field]=value});
 }
 mutations.push(sc=>sc.events.push({kind:"control",tick:sc.events[sc.events.length-1].tick+1,field:"members",value:["capture","refund"]}));
 mutations.push(sc=>{sc.raw.accepted++});
 mutations.push(sc=>{sc.decisions.full_integrity="BLOCKED"});
 let rejected=0,structural=0,semantic=0;
 for(const p of positives)for(const change of mutations){
 const altered=JSON.parse(JSON.stringify(p));change(altered);
 try{checkOne(altered)}catch(e){rejected++;if(String(e).includes("decision mismatch"))semantic++;else structural++}
 }
 if(rejected!==positives.length*mutations.length)throw Error("mutation gap "+rejected+"/"+positives.length*mutations.length);
 const alteredCsv=lines[1].replace(/,(\d+),(\d+),(\d+),(\d+)$/,",$1,999,$3,$4");
 if(alteredCsv===lines[1]||expected.get(lines[1].split(",").slice(0,2).join("|"))===alteredCsv)throw Error("CSV negative control");
 return {status:"PASS",scenario_count:ids.size,decision_rows:ids.size*3,totals,stats,mutation_controls:positives.length*mutations.length,mutation_rejected:rejected,mutation_semantic:semantic,mutation_structural:structural,csv_negative_control:"REJECTED_BY_ROW_COMPARISON",external_effects:0,implementation_independence:"separate event replay, no producer import",data_source_independence:"NONE",semantic_contract_independence:"LIMITED",authority_independence:"NONE"};
}
if(typeof require!=="undefined"&&typeof module!=="undefined"&&require.main===module){
 const fs=require("fs");
 if(!process.argv[2]||!process.argv[3])throw Error("usage: node verify_continue_as_new_identity.js evidence.json decisions.csv");
 process.stdout.write(JSON.stringify(verify(JSON.parse(fs.readFileSync(process.argv[2],"utf8")),fs.readFileSync(process.argv[3],"utf8")),null,2)+"\n");
}
