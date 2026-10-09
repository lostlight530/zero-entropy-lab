// Ballast 2026-10-10 bounded CronJob evidence fixture. No Kubernetes or external sink calls.
const SCHEDULE = '2026-10-10T03:00:00+08:00';
function scenario(name, change={}) {
  return Object.assign({
    name, cronjob_uid:'cron-A', current_cronjob_uid:'cron-A',
    scheduled_at:SCHEDULE, ledger_scheduled_at:SCHEDULE,
    job_present:true, job_complete:true, job_annotation_at:SCHEDULE,
    last_schedule_observed:true, receipt_state:'hit', receipt_covered:true,
    effect_count:2, required:['notify','archive'], receipts:['notify','archive'],
    historical_auth:true, current_permission:true,
    target_uid:'target-A', current_target_uid:'target-A',
    membership_complete:true, postcondition:true, temporal_order_covered:true
  }, change);
}
const scenarios = [
  scenario('baseline-exact-schedule-and-effects'),
  scenario('last-schedule-without-created-job',{job_present:false,job_complete:false,receipt_state:'miss',receipts:[],effect_count:0}),
  scenario('job-present-but-no-effects',{job_complete:false,receipt_state:'miss',receipts:[],effect_count:0}),
  scenario('cronjob-name-reused-new-uid',{cronjob_uid:'cron-old'}),
  scenario('job-annotation-other-schedule',{job_annotation_at:'2026-10-10T02:00:00+08:00'}),
  scenario('terminal-job-unknown-external-effect',{receipt_state:'unknown',receipts:[],effect_count:0}),
  scenario('negative-lookup-without-coverage',{receipt_state:'miss',receipt_covered:false,receipts:[],effect_count:0}),
  scenario('history-pruned-external-receipts-valid',{job_present:false,job_complete:false}),
  scenario('duplicate-external-effect',{effect_count:3}),
  scenario('historical-authorization-invalid',{historical_auth:false}),
  scenario('permission-revoked-unfinished-effect',{receipts:['notify'],effect_count:1,current_permission:false}),
  scenario('target-recreated-same-name',{target_uid:'target-old'}),
  scenario('membership-expanded-after-job',{required:['notify','archive','invoice'],membership_complete:false}),
  scenario('historical-hit-current-state-reversed',{postcondition:false}),
  scenario('permission-revoked-after-valid-effect',{current_permission:false}),
  scenario('unproven-effect-time-order',{temporal_order_covered:false}),
  scenario('external-ledger-other-schedule',{ledger_scheduled_at:'2026-10-10T02:00:00+08:00'}),
  scenario('forbid-missed-schedule-no-effect',{job_present:false,job_complete:false,last_schedule_observed:false,receipt_state:'miss',receipts:[],effect_count:0})
];
const paths=['last-schedule-only','job-presence-only','job-terminal-only','full-integrity'];
function decide(x,path) {
  if(path==='last-schedule-only') return x.last_schedule_observed?'verified':'not-observed';
  if(path==='job-presence-only') return x.job_present?'verified':'not-observed';
  if(path==='job-terminal-only') return x.job_complete?'verified':'not-complete';
  if(path!=='full-integrity') throw Error('bad path '+path);
  if(x.cronjob_uid!==x.current_cronjob_uid) return 'cronjob-incarnation-mismatch';
  if(x.scheduled_at!==x.ledger_scheduled_at) return 'schedule-identity-mismatch';
  if(x.job_present && x.job_annotation_at!==x.scheduled_at) return 'job-schedule-mismatch';
  if(x.target_uid!==x.current_target_uid) return 'target-incarnation-mismatch';
  if(x.receipt_state==='unknown' || (x.receipt_state==='miss'&&!x.receipt_covered)) return 'safe-stop-unknown';
  if(x.receipt_state==='hit'&&!x.historical_auth) return 'historically-unauthorized';
  if(x.receipt_state==='hit'&&!x.temporal_order_covered) return 'temporal-unverified';
  if(x.receipt_state==='hit'&&x.effect_count!==x.receipts.length) return 'duplicate-effect';
  if(!x.membership_complete) return 'membership-incomplete';
  if(x.receipt_state==='miss'||x.required.some(id=>!x.receipts.includes(id)))
    return x.current_permission?'incomplete-effect-set':'permission-stop';
  if(!x.postcondition) return 'current-postcondition-failed';
  return 'verified';
}
const rows=scenarios.flatMap(x=>paths.map(path=>{
  const expected=decide(x,'full-integrity'), observed=decide(x,path);
  return {scenario:x.name,expected,path,observed,disagree:Number(expected!==observed)};
}));
const counts=Object.fromEntries(paths.map(path=>[path,rows.filter(r=>r.path===path).reduce((a,r)=>a+r.disagree,0)]));
if(typeof require==='function'&&typeof module!=='undefined'&&require.main===module) {
  const fs=require('fs'), p=require('path');
  const out=process.env.BALLAST_CRON_OUT||'/tmp/ballast_20261010';
  fs.mkdirSync(out,{recursive:true});
  fs.writeFileSync(p.join(out,'scenarios.json'),JSON.stringify(scenarios,null,2)+'\n');
  fs.writeFileSync(p.join(out,'decisions.csv'),'scenario,expected,path,observed,disagree\n'+rows.map(r=>[r.scenario,r.expected,r.path,r.observed,r.disagree].join(',')).join('\n')+'\n');
  console.log(JSON.stringify({scenarios:scenarios.length,paths:paths.length,decisions:rows.length,disagreements:counts},null,2));
}
