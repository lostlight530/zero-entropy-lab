// Ballast 2026-10-19 bounded cross-region visibility experiment
// Deterministic JavaScript; node CLI prints JSON, V8 isolate invokes produce()
function produce() {
  const specs = [
    {id:"clean_covered_miss"},
    {id:"clean_revoked",post:[["permission",false]]},
    {id:"complete_replicated",effects:["A","B"],replicate:true},
    {id:"complete_unreplicated",effects:["A","B"]},
    {id:"complete_after_revocation",effects:["A","B"],replicate:true,post:[["permission",false]]},
    {id:"hidden_east_A",effects:["A"],query:{status:"UNKNOWN"}},
    {id:"hidden_east_miss_conflict",effects:["A"],query:{status:"MISS"}},
    {id:"regional_double_commit",effects:["A"],westAttempts:["A"]},
    {id:"regional_double_commit_reconciled",effects:["A"],westAttempts:["A"],replicateAfter:true},
    {id:"partial_replication",effects:["A","B"],replicateMembers:["A"]},
    {id:"same_count_membership_swap",effects:["A","B"],replicate:true,post:[["members",["A","C"]]]},
    {id:"same_count_swap_unreplicated",effects:["A","B"],post:[["members",["A","C"]]]},
    {id:"target_reincarnation",effects:["A","B"],replicate:true,post:[["target","inc-2"]]},
    {id:"unauthorized_history",effects:["A",{member:"B",bypass:true,auth:false}],replicate:true},
    {id:"wrong_run_history",effects:["A",{member:"B",run:"run-old"}],replicate:true},
    {id:"wrong_attempt_history",effects:["A",{member:"B",attempt:"attempt-old"}],replicate:true},
    {id:"extra_effect",effects:["A","B",{member:"D",bypass:true}],replicate:true},
    {id:"duplicate_member_new_key",effects:["A","B",{member:"A",key:"effect:A:other"}],replicate:true},
    {id:"missing_B",effects:["A"],replicate:true},
    {id:"query_failed",query:{status:"UNKNOWN",health:false}},
    {id:"watermark_gap",query:{watermark:2}},
    {id:"retention_gap",query:{retention:false}},
    {id:"scope_mismatch",query:{scope_exact:false}},
    {id:"positive_miss_conflict",effects:["A","B"],replicate:true,query:{status:"MISS"}},
    {id:"witness_revision_stale",effects:["A","B"],replicate:true,witness:{revision:4}},
    {id:"witness_unprotected",effects:["A","B"],replicate:true,witness:{protected:false}},
    {id:"future_receipt_tick",effects:["A","B"],replicate:true,witness:{at_tick:1}},
    {id:"aggregate_hit_only",effects:["A"],query:{status:"HIT",scope_exact:false}},
    {id:"revoked_before_regional_write",effects:["A"],post:[["permission",false]],westAttempts:["A"]},
    {id:"regional_replay_dedup",effects:["A","B"],replicate:true,westAttempts:["A"]},
    {id:"regional_only_negative",query:{coverage_global:false}},
    {id:"post_witness_toctou",effects:["A","B"],replicate:true,afterWitness:[["members",["A","C"]]]}
  ];
  const out=[];
  function run(spec) {
    const state={permission:true,members:["A","B"],revision:5,target:"inc-1"};
    const east=new Map(),west=new Map(),sink=[],events=[];let tick=0;
    const emit=e=>events.push({tick:++tick,...e});
    const change=([field,value])=>{if(field==="members"){state.members=[...value];state.revision++}else state[field]=value;emit({kind:"control",field,value})};
    function commit(region,item) {
      const obj=typeof item==="string"?{member:item}:item;
      const member=obj.member,key=obj.key||"effect:"+member, table=region==="east"?east:west;
      const permitted=state.permission&&state.members.includes(member)&&state.target===(obj.target||state.target);
      const auth=obj.auth===false?false:permitted;
      const accepted=!table.has(key);
      const entry={kind:"commit",region,member,effect_key:key,task:"task-19",run:obj.run||"run-19",attempt:obj.attempt||"attempt-19",target:obj.target||state.target,authorized:auth,accepted,bypass:!!obj.bypass};
      if(accepted){table.set(key,entry);sink.push({...entry,tick:tick+1})}
      emit(entry);
    }
    function replicate(members) {
      const selected=members||[...east.values()].map(e=>e.member);
      for(const [k,v] of east)if(selected.includes(v.member))west.set(k,v);
      emit({kind:"replicate",from:"east",to:"west",members:[...selected]});
    }
    for(const x of spec.pre||[])change(x);
    for(const x of spec.effects||[])commit("east",x);
    if(spec.replicate)replicate();
    if(spec.replicateMembers)replicate(spec.replicateMembers);
    for(const x of spec.post||[])change(x);
    const westBefore=[...west.keys()].sort();
    emit({kind:"read",region:"west",keys:westBefore});
    for(const x of spec.westAttempts||[])commit("west",x);
    if(spec.replicateAfter)replicate();
    const query={kind:"query",status:sink.length?"HIT":"MISS",scope_exact:true,coverage_global:true,health:true,watermark:100,min_watermark:20,retention:true,task:"task-19",run:"run-19",attempt:"attempt-19",target:state.target,revision:state.revision,...spec.query};
    emit(query);
    const witness={kind:"witness",protected:true,members:[...state.members],revision:state.revision,target:state.target,at_tick:tick+1,...spec.witness};
    emit(witness);
    for(const x of spec.afterWitness||[])change(x);
    const current={...state,members:[...state.members]};
    const exact=sink.length===current.members.length&&new Set(sink.map(x=>x.member)).size===sink.length&&sink.every(x=>current.members.includes(x.member)&&x.task==="task-19"&&x.run==="run-19"&&x.attempt==="attempt-19"&&x.target===current.target&&x.effect_key==="effect:"+x.member&&x.authorized===true&&x.tick<=witness.at_tick);
    const fresh=witness.protected===true&&witness.target===current.target&&witness.revision===current.revision&&JSON.stringify([...witness.members].sort())===JSON.stringify([...current.members].sort());
    const covered=query.scope_exact===true&&query.coverage_global===true&&query.health===true&&Number.isInteger(query.watermark)&&query.watermark>=query.min_watermark&&query.task==="task-19"&&query.run==="run-19"&&query.attempt==="attempt-19"&&query.target===current.target&&query.revision===current.revision;
    let full;
    if(query.status==="MISS"&&sink.length)full="RECONCILE";
    else if(sink.length&&(!exact||!fresh))full="RECONCILE";
    else if(sink.length&&query.status==="HIT"&&covered&&exact&&fresh)full="COMPLETE";
    else if(sink.length)full="STOP_UNKNOWN";
    else if(query.status!=="MISS"||!covered||query.retention!==true)full="STOP_UNKNOWN";
    else if(!current.permission||!fresh)full="BLOCKED";
    else full="RETRY_ALLOWED";
    const regional_absence=westBefore.includes("effect:A")?"BLOCKED":current.permission?"RETRY_ALLOWED":"BLOCKED";
    const replica_count=west.size===current.members.length?"COMPLETE":"RECONCILE";
    return {id:spec.id,events,raw:{west_before:westBefore,west_after:[...west.keys()].sort(),sink_commits:sink.length,replica_east:east.size,replica_west:west.size},decisions:{regional_absence,replica_count,full_integrity:full}};
  }
  for(const s of specs)out.push(run(s));
  return {schema:"ballast-cross-region-miss-2026-10-19",execution:"bounded-v8-model",task:"task-19",scenarios:out,decision_paths:["regional_absence","replica_count","full_integrity"]};
}
if(typeof require!=="undefined" && typeof module!=="undefined" && require.main===module)process.stdout.write(JSON.stringify(produce(),null,2)+"\n");
