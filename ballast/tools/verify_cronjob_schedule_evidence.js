// Separate primitive-field reconstruction; shares fixture vocabulary and task semantics.
function verify(scenarios, rows) {
  const paths=['last-schedule-only','job-presence-only','job-terminal-only','full-integrity'];
  const failures=[], expectedByName=new Map();
  if(new Set(scenarios.map(x=>x.name)).size!==scenarios.length) failures.push('duplicate-scenario-name');
  if(rows.length!==scenarios.length*paths.length) failures.push('decision-row-count');
  for(const x of scenarios) {
    const checks=[
      ['cronjob-incarnation-mismatch',x.cronjob_uid!==x.current_cronjob_uid],
      ['schedule-identity-mismatch',x.ledger_scheduled_at!==x.scheduled_at],
      ['job-schedule-mismatch',x.job_present&&x.job_annotation_at!==x.scheduled_at],
      ['target-incarnation-mismatch',x.current_target_uid!==x.target_uid],
      ['safe-stop-unknown',x.receipt_state==='unknown'||(x.receipt_state==='miss'&&!x.receipt_covered)],
      ['historically-unauthorized',x.receipt_state==='hit'&&!x.historical_auth],
      ['temporal-unverified',x.receipt_state==='hit'&&!x.temporal_order_covered],
      ['duplicate-effect',x.receipt_state==='hit'&&(x.effect_count!==x.receipts.length||new Set(x.receipts).size!==x.receipts.length)],
      ['unexpected-effect',x.receipt_state==='hit'&&x.receipts.some(id=>!x.required.includes(id))],
      ['membership-incomplete',!x.membership_complete],
      [x.current_permission?'incomplete-effect-set':'permission-stop',x.receipt_state==='miss'||x.required.filter(id=>!x.receipts.includes(id)).length>0],
      ['current-postcondition-failed',!x.postcondition]
    ];
    expectedByName.set(x.name,checks.find(([,hit])=>hit)?.[0]||'verified');
  }
  for(const x of scenarios) {
    const observed=rows.filter(r=>r.scenario===x.name);
    if(observed.length!==paths.length||new Set(observed.map(r=>r.path)).size!==paths.length) failures.push('path-coverage:'+x.name);
    for(const row of observed) {
      const exp=expectedByName.get(x.name);
      const weak={'last-schedule-only':x.last_schedule_observed?'verified':'not-observed',
        'job-presence-only':x.job_present?'verified':'not-observed',
        'job-terminal-only':x.job_complete?'verified':'not-complete'};
      const independentlyRebuilt=row.path==='full-integrity'?exp:weak[row.path];
      if(row.expected!==exp) failures.push('expected:'+x.name+':'+row.path);
      if(row.observed!==independentlyRebuilt) failures.push('path:'+x.name+':'+row.path);
      if(row.disagree!==Number(row.observed!==exp)) failures.push('disagreement:'+x.name+':'+row.path);
    }
  }
  return {scenario_count:scenarios.length,decision_count:rows.length,expected_agreement:scenarios.length-failures.filter(x=>x.startsWith('expected:')).length,
    failures,implementation_independence:'PARTIAL_SEPARATE_PREDICATE_STRUCTURE',
    data_source_independence:'LIMITED_SHARED_FIXTURE',semantic_contract_independence:'LIMITED_SHARED_TASK_SCHEMA'};
}
if(typeof require==='function'&&typeof module!=='undefined'&&require.main===module) {
  const fs=require('fs'),p=require('path'),out=process.env.BALLAST_CRON_OUT||'/tmp/ballast_20261010';
  const scenarios=JSON.parse(fs.readFileSync(p.join(out,'scenarios.json'),'utf8'));
  const rows=fs.readFileSync(p.join(out,'decisions.csv'),'utf8').trim().split('\n').slice(1).map(s=>{
    const [scenario,expected,path,observed,disagree]=s.split(',');
    return {scenario,expected,path,observed,disagree:Number(disagree)};
  });
  const result=verify(scenarios,rows);console.log(JSON.stringify(result,null,2));
  if(result.failures.length)process.exit(1);
}
