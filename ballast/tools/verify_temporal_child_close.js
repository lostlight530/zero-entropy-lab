function verifierRun(scenarios,decisions,csv){
  const paths=["parent_terminal_proxy","child_started_count_proxy","full_reference"];
  const isNumber=x=>typeof x==="number"&&Number.isFinite(x);
  const unique=a=>Array.isArray(a)&&a.length===new Set(a).size;
  const same=(a,b)=>unique(a)&&unique(b)&&a.length===b.length&&a.every(x=>b.includes(x));
  function covered(f,subset){
    const q=f.query,ts=[q.oldStart,q.oldEnd,q.scopeStart,q.scopeEnd,q.watermark,q.queriedAt,q.retentionThrough];
    if(q.result!=="authoritative miss"||q.authority!=="synthetic-sink"||q.lifecycle!=="active"||q.task!==f.task.id||q.inc!==f.task.inc||!ts.every(isNumber))return false;
    if(!(q.scopeStart<=q.oldStart&&q.oldStart<=q.oldEnd&&q.oldEnd<=q.scopeEnd&&q.scopeEnd<=q.watermark&&q.watermark<=q.queriedAt&&q.queriedAt<=q.retentionThrough))return false;
    return unique(q.members)&&unique(q.effects)&&subset.every(x=>q.members.includes(x.member)&&q.effects.includes(x.effect));
  }
  function guardValid(f){
    const t=f.task,w=f.witness,g=w.guard,names=t.members.map(x=>x.member);
    return names.length>0&&same(names,w.members)&&same(names,g.members)&&w.task===t.id&&g.task===t.id&&w.inc===t.inc&&g.inc===t.inc&&w.revision===t.revision&&g.revision===t.revision&&g.protected===true&&isNumber(w.readAt)&&isNumber(g.committedAt)&&g.committedAt>=w.readAt;
  }
  function reconstruct(f){
    const t=f.task,p=f.parent,raw=f.effects,needed=t.members;
    if(f.query.result==="authoritative miss")for(const e of raw)if(covered(f,[{member:e.member,effect:e.effect}]))return "EVIDENCE_CONFLICT";
    if(raw.length===0){
      if(covered(f,needed)){
        if(t.permission===false||t.status!=="active")return "BLOCKED";
        if(t.permission===true&&guardValid(f))return "RETRY_ALLOWED";
      }
      return "STOP_UNKNOWN";
    }
    if(t.status!=="active"||p.status!=="COMPLETED"||!isNumber(p.closedAt)||needed.length===0||raw.length!==needed.length||p.startEvents.length!==needed.length||f.witness.states.length!==needed.length||!guardValid(f))return "RECONCILE";
    const members=needed.map(x=>x.member),effects=needed.map(x=>x.effect);
    if(!same(members,raw.map(x=>x.member))||!same(effects,raw.map(x=>x.effect))||!same(members,p.startEvents.map(x=>x.member))||!same(members,f.witness.states.map(x=>x.member)))return "RECONCILE";
    for(const spec of needed){
      const e=raw.find(x=>x.member===spec.member),start=p.startEvents.find(x=>x.member===spec.member),state=f.witness.states.find(x=>x.member===spec.member);
      if(!e||!start||!state||e.effect!==spec.effect||e.child!==spec.child||e.run!==spec.run||e.task!==t.id||e.inc!==t.inc||start.child!==spec.child||start.run!==spec.run||state.effect!==spec.effect||state.done!==true)return "RECONCILE";
      const a=e.authorization;
      if(!a||a.task!==t.id||a.member!==spec.member||a.effect!==spec.effect||![start.at,e.at,a.approvedAt,a.expiresAt].every(isNumber))return "RECONCILE";
      if(!(start.at<p.closedAt&&start.at<=e.at&&a.approvedAt<=e.at&&e.at<=a.expiresAt&&e.at<=f.witness.readAt))return "RECONCILE";
      if(a.revokedAt!==null&&(!isNumber(a.revokedAt)||e.at>=a.revokedAt))return "RECONCILE";
    }
    return "COMPLETE";
  }
  const errors=[],scenarioIDs=new Set(),seen=new Set(),byID=new Map();
  for(const f of scenarios){if(scenarioIDs.has(f.id))errors.push("duplicate scenario "+f.id);scenarioIDs.add(f.id);byID.set(f.id,f)}
  for(const d of decisions){const k=d.scenario+"|"+d.path;if(seen.has(k))errors.push("duplicate decision "+k);seen.add(k);if(!byID.has(d.scenario)||!paths.includes(d.path))errors.push("unexpected decision "+k)}
  for(const f of scenarios){
    const expected={parent_terminal_proxy:f.parent.status==="COMPLETED"?"COMPLETE":"RECONCILE",child_started_count_proxy:f.parent.status==="COMPLETED"&&f.parent.startEvents.length===f.task.members.length?"COMPLETE":"RECONCILE",full_reference:reconstruct(f)};
    for(const p of paths){const row=decisions.find(d=>d.scenario===f.id&&d.path===p);if(!row||row.decision!==expected[p])errors.push("mismatch "+f.id+" "+p+" actual="+row?.decision+" expected="+expected[p])}
  }
  const lines=csv.trimEnd().split("\n");
  if(lines[0]!=="scenario,path,decision"||lines.length!==decisions.length+1)errors.push("CSV header or length");
  for(let i=0;i<decisions.length;i++){const d=decisions[i];if(lines[i+1]!==[d.scenario,d.path,d.decision].join(","))errors.push("CSV mismatch "+i)}
  const expectedOutcomes={
    baseline:"COMPLETE",current_permission_revoked_after_effect:"COMPLETE",revoked_after_effect:"COMPLETE",
    child_started_without_effect:"STOP_UNKNOWN",duplicate_effect_replaces_member:"RECONCILE",witness_same_count_swap:"RECONCILE",
    witness_duplicate_member:"RECONCILE",historical_revocation_before_effect:"RECONCILE",
    miss_conflicts_positive:"EVIDENCE_CONFLICT",miss_conflicts_partial_positive:"EVIDENCE_CONFLICT",
    covered_miss_retry:"RETRY_ALLOWED",covered_miss_revoked:"BLOCKED",covered_miss_unprotected:"STOP_UNKNOWN",
    miss_stale_watermark:"STOP_UNKNOWN",miss_retention_expired:"STOP_UNKNOWN",miss_wrong_incarnation:"STOP_UNKNOWN",
    guard_stale_revision:"RECONCILE",postcondition_after_guard:"RECONCILE",late_child_start_after_parent_close:"RECONCILE",
    request_cancel_with_observed_effect:"COMPLETE",terminate_with_preclose_effects:"COMPLETE",guard_commit_before_effect:"RECONCILE",
    parent_completed_without_child_start:"STOP_UNKNOWN",extra_child_start:"RECONCILE",guard_wrong_task:"RECONCILE"
  };
  let probesPassed=0;
  for(const [id,expected] of Object.entries(expectedOutcomes)){const f=byID.get(id);if(f&&reconstruct(f)===expected)probesPassed++;else errors.push("exact probe "+id+" got "+(f&&reconstruct(f)))}
  const negatives=scenarios.filter(f=>f.group==="negative");let rejected=0;
  for(const f of negatives){const x=reconstruct(f);if(x!=="COMPLETE"&&x!=="RETRY_ALLOWED")rejected++;else errors.push("unsafe negative "+f.id+" "+x)}
  const forged=csv.replace("baseline,parent_terminal_proxy,COMPLETE","baseline,parent_terminal_proxy,RETRY_ALLOWED");
  const csvValid=raw=>{const lines=raw.trimEnd().split("\n");return lines[0]==="scenario,path,decision"&&lines.length===decisions.length+1&&decisions.every((d,i)=>lines[i+1]===[d.scenario,d.path,d.decision].join(","))};
  const tamperDetected=forged!==csv&&csvValid(csv)&&!csvValid(forged);
  if(!tamperDetected)errors.push("CSV tamper not detected");
  const hist={},weak={parent_terminal_proxy:0,child_started_count_proxy:0};
  for(const f of scenarios){const full=reconstruct(f);hist[full]=(hist[full]||0)+1;for(const p of Object.keys(weak))if(decisions.find(d=>d.scenario===f.id&&d.path===p).decision!==full)weak[p]++}
  return {ok:errors.length===0,errors,scenarios:scenarios.length,decisions:decisions.length,verifiedRows:decisions.length-errors.filter(x=>x.startsWith("mismatch")).length,negativeControls:negatives.length,rejectedNegatives:rejected,probesExpected:Object.keys(expectedOutcomes).length,probesPassed,forgedCsvDetected:tamperDetected,histogram:hist,weakDisagreements:weak,rawCounts:{childStartedEvents:scenarios.reduce((a,f)=>a+f.parent.startEvents.length,0),modeledEffectEvents:scenarios.reduce((a,f)=>a+f.effects.length,0)},independence:{implementation:"PARTIAL",dataSource:"NONE",semanticContract:"LIMITED",externalAuthority:"NONE"},runtime:"JavaScript isolate",liveEffects:0};
}

if (typeof module !== 'undefined') module.exports = {verifierRun};
if (typeof require !== 'undefined' && typeof module !== 'undefined' && require.main === module) {
  const fs = require('fs');
  const [scenarioPath,decisionPath] = process.argv.slice(2);
  if (!scenarioPath || !decisionPath) { process.stderr.write('usage: node verify_temporal_child_close.js scenarios.json decisions.csv\n'); process.exit(2); }
  const scenarios = JSON.parse(fs.readFileSync(scenarioPath,'utf8'));
  const csv = fs.readFileSync(decisionPath,'utf8');
  const decisions = csv.trimEnd().split('\n').slice(1).map(x=>{const a=x.split(',');return {scenario:a[0],path:a[1],decision:a[2]};});
  const report = verifierRun(scenarios,decisions,csv);
  process.stdout.write(JSON.stringify(report,null,2)+'\n');
  process.exit(report.ok?0:1);
}
