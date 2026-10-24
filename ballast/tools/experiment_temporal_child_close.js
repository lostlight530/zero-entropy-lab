function producerRun() {
  const copy=x=>JSON.parse(JSON.stringify(x));
  const spec=x=>({member:x,effect:"effect-"+x,child:"child-"+x,run:"run-"+x,attempt:"attempt-"+x});
  const event=(x,at)=>({member:x,effect:"effect-"+x,child:"child-"+x,run:"run-"+x,attempt:"attempt-"+x,parentId:"parent-25",parentRun:"parent-run-25",task:"task-25",inc:"target-25",at,authorization:{approvedAt:10,expiresAt:100,revokedAt:null,task:"task-25",inc:"target-25",parentId:"parent-25",parentRun:"parent-run-25",member:x,effect:"effect-"+x,child:"child-"+x,run:"run-"+x,attempt:"attempt-"+x}});
  const original={
    task:{id:"task-25",inc:"target-25",revision:7,members:[spec("A"),spec("B")],permission:true,status:"active"},
    parent:{id:"parent-25",run:"parent-run-25",status:"COMPLETED",closedAt:50,policy:"ABANDON",startEvents:[{member:"A",child:"child-A",run:"run-A",attempt:"attempt-A",parentId:"parent-25",parentRun:"parent-run-25",task:"task-25",inc:"target-25",at:20},{member:"B",child:"child-B",run:"run-B",attempt:"attempt-B",parentId:"parent-25",parentRun:"parent-run-25",task:"task-25",inc:"target-25",at:21}]},
    effects:[event("A",35),event("B",65)],
    query:{result:"hit",task:"task-25",inc:"target-25",members:["A","B"],effects:["effect-A","effect-B"],parentId:"parent-25",parentRun:"parent-run-25",scopeTuples:[{member:"A",effect:"effect-A",run:"run-A",attempt:"attempt-A"},{member:"B",effect:"effect-B",run:"run-B",attempt:"attempt-B"}],oldStart:15,oldEnd:70,scopeStart:0,scopeEnd:80,watermark:85,queriedAt:90,retentionThrough:140,lifecycle:"active",authority:"synthetic-sink"},
    witness:{task:"task-25",inc:"target-25",revision:7,parentId:"parent-25",parentRun:"parent-run-25",members:["A","B"],bindings:[spec("A"),spec("B")],states:[{member:"A",effect:"effect-A",child:"child-A",run:"run-A",attempt:"attempt-A",task:"task-25",inc:"target-25",revision:7,parentId:"parent-25",parentRun:"parent-run-25",done:true},{member:"B",effect:"effect-B",child:"child-B",run:"run-B",attempt:"attempt-B",task:"task-25",inc:"target-25",revision:7,parentId:"parent-25",parentRun:"parent-run-25",done:true}],readAt:91,guard:{protected:true,task:"task-25",inc:"target-25",revision:7,parentId:"parent-25",parentRun:"parent-run-25",members:["A","B"],bindings:[spec("A"),spec("B")],committedAt:95}}
  };
  const scenarios=[];
  function add(id,mutate,group="negative"){const f=copy(original);if(mutate)mutate(f);scenarios.push({id,group,...f})}
  const noEffect=f=>{f.effects=[];f.witness.states=[]};
  const miss=f=>{noEffect(f);f.query.result="authoritative miss"};
  add("baseline",null,"positive");
  add("abandon_post_close_effect",f=>f.parent.policy="ABANDON","positive");
  add("request_cancel_with_observed_effect",f=>f.parent.policy="REQUEST_CANCEL","positive");
  add("terminate_with_preclose_effects",f=>{f.parent.policy="TERMINATE";f.effects[1].at=45},"positive");
  add("revoked_after_effect",f=>f.effects[1].authorization.revokedAt=70,"positive");
  add("current_permission_revoked_after_effect",f=>f.task.permission=false,"positive");
  add("parent_completed_without_child_start",f=>{f.parent.startEvents=[];noEffect(f);f.query.result="unknown"});
  add("start_initiated_but_not_started",f=>{f.parent.startEvents=[];noEffect(f);f.query.result="unknown"});
  add("child_started_without_effect",f=>{noEffect(f);f.query.result="unknown"});
  add("same_count_wrong_effect_member",f=>f.effects[1].member="C");
  add("duplicate_effect_replaces_member",f=>f.effects[1]=copy(f.effects[0]));
  add("extra_effect",f=>f.effects.push(event("C",70)));
  add("duplicate_child_start",f=>f.parent.startEvents.push(copy(f.parent.startEvents[0])));
  add("missing_child_start_B",f=>f.parent.startEvents.pop());
  add("late_child_start_after_parent_close",f=>f.parent.startEvents[1].at=55);
  add("wrong_child_run_start",f=>f.parent.startEvents[1].run="run-other");
  add("wrong_effect_run",f=>f.effects[1].run="run-other");
  add("wrong_effect_incarnation",f=>f.effects[1].inc="target-other");
  add("historical_revocation_before_effect",f=>f.effects[1].authorization.revokedAt=60);
  add("historical_auth_wrong_task",f=>f.effects[1].authorization.task="other");
  add("historical_auth_string_time",f=>f.effects[1].authorization.expiresAt="100");
  add("witness_same_count_swap",f=>{f.witness.members=["A","C"];f.witness.states[1].member="C";f.witness.guard.members=["A","C"]});
  add("witness_duplicate_member",f=>f.witness.members=["A","A"]);
  add("witness_extra_member",f=>f.witness.members.push("C"));
  add("witness_extra_state",f=>f.witness.states.push({member:"C",effect:"effect-C",done:true}));
  add("guard_stale_revision",f=>f.witness.guard.revision=6);
  add("guard_unprotected",f=>f.witness.guard.protected=false);
  add("guard_wrong_task",f=>f.witness.guard.task="other");
  add("postcondition_after_guard",f=>f.witness.readAt=100);
  add("postcondition_missing_member",f=>f.witness.states.pop());
  add("postcondition_duplicate_state",f=>f.witness.states[1]=copy(f.witness.states[0]));
  add("postcondition_wrong_effect",f=>f.witness.states[1].effect="effect-X");
  add("miss_conflicts_positive",f=>f.query.result="authoritative miss");
  add("miss_conflicts_partial_positive",f=>{f.query.result="authoritative miss";f.query.members=["A"];f.query.effects=["effect-A"]});
  add("unknown_no_effect",f=>{noEffect(f);f.query.result="unknown"});
  add("hit_without_journal",noEffect);
  add("covered_miss_retry",miss,"recovery");
  add("covered_miss_revoked",f=>{miss(f);f.task.permission=false},"recovery");
  add("covered_miss_unprotected",f=>{miss(f);f.witness.guard.protected=false});
  add("covered_miss_wrong_members",f=>{miss(f);f.witness.guard.members=["A","C"]});
  add("miss_stale_watermark",f=>{miss(f);f.query.watermark=30});
  add("miss_retention_expired",f=>{miss(f);f.query.retentionThrough=80});
  add("miss_wrong_incarnation",f=>{miss(f);f.query.inc="other"});
  add("miss_wrong_authority",f=>{miss(f);f.query.authority="replica"});
  add("miss_lifecycle_expired",f=>{miss(f);f.query.lifecycle="expired"});
  add("miss_missing_old_attempt_scope",f=>{miss(f);f.query.scopeStart=25});
  add("parent_not_terminal_with_effect",f=>f.parent.status="RUNNING");
  add("task_cancelled_with_historical_effect",f=>f.task.status="cancelled");
  add("extra_child_start",f=>f.parent.startEvents.push({member:"C",child:"child-C",run:"run-C",at:22}));
  add("effect_timestamp_string",f=>f.effects[1].at="65");
  add("guard_commit_before_effect",f=>f.witness.guard.committedAt=60);
  add("query_miss_wrong_effect_scope",f=>{miss(f);f.query.effects=["effect-A","effect-C"]});
  add("parent_run_changed",f=>{f.parent.run="older-parent-run"});
  add("parent_id_missing",f=>{delete f.parent.id});
  add("duplicate_child_across_members",f=>{f.task.members[1].child="child-A";f.parent.startEvents[1].child="child-A";f.effects[1].child="child-A";f.effects[1].authorization.child="child-A";f.witness.states[1].child="child-A";f.witness.bindings[1].child="child-A";f.witness.guard.bindings[1].child="child-A"});
  add("duplicate_run_across_members",f=>{f.task.members[1].run="run-A";f.parent.startEvents[1].run="run-A";f.effects[1].run="run-A";f.effects[1].authorization.run="run-A";f.witness.states[1].run="run-A";f.witness.bindings[1].run="run-A";f.witness.guard.bindings[1].run="run-A"});
  add("effect_wrong_parent_run",f=>{f.effects[1].parentRun="stale-run"});
  add("child_start_wrong_parent_run",f=>{f.parent.startEvents[1].parentRun="stale-run"});
  add("historical_auth_wrong_child_run",f=>{f.effects[1].authorization.run="stale-child-run"});
  add("historical_auth_wrong_incarnation",f=>{f.effects[1].authorization.inc="stale-inc"});
  add("state_wrong_incarnation",f=>{f.witness.states[1].inc="stale-inc"});
  add("state_wrong_revision",f=>{f.witness.states[1].revision=6});
  add("witness_binding_wrong_child",f=>{f.witness.bindings[1].child="replacement-child"});
  add("guard_binding_wrong_run",f=>{f.witness.guard.bindings[1].run="replacement-run"});
  add("effect_wrong_attempt",f=>{f.effects[1].attempt="attempt-x"});
  add("covered_miss_wrong_run_scope",f=>{miss(f);f.query.scopeTuples[1].run="stale-run"});
  add("covered_miss_missing_attempt_scope",f=>{miss(f);delete f.query.scopeTuples[1].attempt});
  const finite=x=>typeof x==="number"&&Number.isFinite(x);
  const equalSet=(a,b)=>Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&new Set(a).size===a.length&&new Set(b).size===b.length&&a.every(x=>b.includes(x));
  const fields=["member","effect","child","run","attempt"];
  const goodSpecs=a=>Array.isArray(a)&&a.length>0&&a.every(x=>x&&fields.every(k=>typeof x[k]==="string"&&x[k].length>0))&&fields.every(k=>new Set(a.map(x=>x[k])).size===a.length);
  const sameSpecs=(a,b)=>goodSpecs(a)&&goodSpecs(b)&&a.length===b.length&&a.every(x=>b.some(y=>fields.every(k=>x[k]===y[k])));
  function guarded(f){
    const t=f.task,w=f.witness,g=w.guard,names=t.members.map(x=>x.member);
    return names.length>0&&goodSpecs(t.members)&&sameSpecs(t.members,w.bindings)&&sameSpecs(t.members,g.bindings)&&typeof f.parent.id==="string"&&f.parent.id.length>0&&typeof f.parent.run==="string"&&f.parent.run.length>0&&w.parentId===f.parent.id&&g.parentId===f.parent.id&&w.parentRun===f.parent.run&&g.parentRun===f.parent.run&&equalSet(names,w.members)&&equalSet(names,g.members)&&w.task===t.id&&g.task===t.id&&w.inc===t.inc&&g.inc===t.inc&&w.revision===t.revision&&g.revision===t.revision&&g.protected===true&&finite(w.readAt)&&finite(g.committedAt)&&g.committedAt>=w.readAt;
  }
  function covered(f,subset){
    const q=f.query,t=f.task,ts=[q.oldStart,q.oldEnd,q.scopeStart,q.scopeEnd,q.watermark,q.queriedAt,q.retentionThrough];
    return q.result==="authoritative miss"&&q.parentId===f.parent.id&&q.parentRun===f.parent.run&&q.authority==="synthetic-sink"&&q.lifecycle==="active"&&q.task===t.id&&q.inc===t.inc&&ts.every(finite)&&q.scopeStart<=q.oldStart&&q.oldStart<=q.oldEnd&&q.oldEnd<=q.scopeEnd&&q.scopeEnd<=q.watermark&&q.watermark<=q.queriedAt&&q.queriedAt<=q.retentionThrough&&equalSet(q.members,q.members)&&equalSet(q.effects,q.effects)&&Array.isArray(q.scopeTuples)&&q.scopeTuples.every(x=>x&&["member","effect","run","attempt"].every(k=>typeof x[k]==="string"&&x[k].length>0))&&new Set(q.scopeTuples.map(x=>JSON.stringify([x.member,x.effect,x.run,x.attempt]))).size===q.scopeTuples.length&&subset.every(x=>q.members.includes(x.member)&&q.effects.includes(x.effect)&&q.scopeTuples.some(y=>["member","effect","run","attempt"].every(k=>x[k]===y[k])));
  }
  function reference(f){
    const t=f.task,p=f.parent,needed=t.members,events=f.effects,w=f.witness;
    if(f.query.result==="authoritative miss"&&events.some(e=>covered(f,[e])))return "EVIDENCE_CONFLICT";
    if(events.length===0){
      if(covered(f,needed)){
        if(t.permission===false||t.status!=="active")return "BLOCKED";
        if(t.permission===true&&guarded(f))return "RETRY_ALLOWED";
      }
      return "STOP_UNKNOWN";
    }
    if(needed.length===0||!equalSet(needed.map(x=>x.member),needed.map(x=>x.member))||!equalSet(needed.map(x=>x.effect),needed.map(x=>x.effect))||events.length!==needed.length||p.startEvents.length!==needed.length||w.states.length!==needed.length||p.status!=="COMPLETED"||t.status!=="active"||!finite(p.closedAt)||!guarded(f))return "RECONCILE";
    if(!equalSet(needed.map(x=>x.member),events.map(x=>x.member))||!equalSet(needed.map(x=>x.effect),events.map(x=>x.effect))||!equalSet(needed.map(x=>x.member),p.startEvents.map(x=>x.member))||!equalSet(needed.map(x=>x.member),w.states.map(x=>x.member)))return "RECONCILE";
    for(const x of needed){
      const start=p.startEvents.find(e=>e.member===x.member),effect=events.find(e=>e.member===x.member),state=w.states.find(e=>e.member===x.member);
      if(!start||!effect||!state||start.parentId!==p.id||start.parentRun!==p.run||start.task!==t.id||start.inc!==t.inc||start.attempt!==x.attempt||effect.parentId!==p.id||effect.parentRun!==p.run||effect.attempt!==x.attempt||state.parentId!==p.id||state.parentRun!==p.run||state.task!==t.id||state.inc!==t.inc||state.revision!==t.revision||state.child!==x.child||state.run!==x.run||state.attempt!==x.attempt||start.child!==x.child||start.run!==x.run||effect.child!==x.child||effect.run!==x.run||effect.effect!==x.effect||effect.task!==t.id||effect.inc!==t.inc||state.effect!==x.effect||state.done!==true)return "RECONCILE";
      const a=effect.authorization;
      if(!a||a.task!==t.id||a.inc!==t.inc||a.parentId!==p.id||a.parentRun!==p.run||a.child!==x.child||a.run!==x.run||a.attempt!==x.attempt||a.member!==x.member||a.effect!==x.effect||![start.at,effect.at,a.approvedAt,a.expiresAt].every(finite)||!(start.at<p.closedAt&&start.at<=effect.at&&a.approvedAt<=effect.at&&effect.at<=a.expiresAt&&effect.at<=w.readAt))return "RECONCILE";
      if(a.revokedAt!==null&&(!finite(a.revokedAt)||effect.at>=a.revokedAt))return "RECONCILE";
    }
    return "COMPLETE";
  }
  const paths=["parent_terminal_proxy","child_started_count_proxy","full_reference"];
  const decisions=scenarios.flatMap(s=>paths.map(path=>({scenario:s.id,path,decision:path==="parent_terminal_proxy"?(s.parent.status==="COMPLETED"?"COMPLETE":"RECONCILE"):path==="child_started_count_proxy"?(s.parent.status==="COMPLETED"&&s.parent.startEvents.length===s.task.members.length?"COMPLETE":"RECONCILE"):reference(s)})));
  const csv="scenario,path,decision\n"+decisions.map(x=>x.scenario+","+x.path+","+x.decision).join("\n")+"\n";
  return {scenarios,decisions,csv,paths};
}

if (typeof module !== 'undefined') module.exports = {producerRun};
if (typeof require !== 'undefined' && typeof module !== 'undefined' && require.main === module) {
  const result = producerRun();
  process.stdout.write(JSON.stringify({scenarios:result.scenarios,decisions:result.decisions,csv:result.csv})+'\n');
}
