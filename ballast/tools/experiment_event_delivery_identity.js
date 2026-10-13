'use strict'
// Bounded deterministic fixture producer, no network calls and no external effects
const fs = require('node:fs')
const path = require('node:path')
const PATHS = ['ack_only', 'id_only', 'source_id_seen', 'full_integrity']
const clone = x => JSON.parse(JSON.stringify(x))
const receipt = effect_id => ({effect_id, task_id:'task-17', source:'/publisher/alpha', event_id:'evt-77', target_uid:'sink-u7', authorized_at_effect:true, temporal_order_proven:true})
const BASE = {
  event:{source:'/publisher/alpha', id:'evt-77', subject:'release-17', delivery_guid:'guid-77', ack:true, authenticated:true, id_seen:true, source_id_seen:true, redelivery:false},
  task:{task_id:'task-17', expected_source:'/publisher/alpha', expected_event_id:'evt-77', target_uid:'sink-u7', required_effects:['publish@sink-u7','notify@sink-u7'], current_membership:['publish@sink-u7','notify@sink-u7'], membership_revision:'m8', completion_revision:'m8', protected_completion:true, current_postcondition:true, status:'COMPLETED'},
  prior:{classification:'hit', exact_identity:true, coverage:true, watermark:true, retention:true},
  permission:{current:false, protected_effect_boundary:false},
  receipts:[receipt('publish@sink-u7'),receipt('notify@sink-u7')]
}
function fixtures(){
  const all=[]
  const add=(id,expected,mutate=()=>{})=>{const f=clone(BASE);mutate(f);all.push({case_id:id,expected,...f})}
  const newEffect=f=>{f.receipts=[];f.prior.classification='authoritative miss';f.permission.current=true;f.permission.protected_effect_boundary=true;f.task.status='RUNNING';f.task.current_postcondition=false}
  add('valid-historical-after-revocation','verified')
  add('transport-ack-lost-after-actual-effects','verified',f=>{f.event.ack=false})
  add('guid-absent-but-exact-effects','verified',f=>{f.event.delivery_guid=''})
  add('eligible-new-effect-covered-miss','eligible-new-effect',newEffect)
  add('different-source-same-event-id','eligible-new-effect',f=>{newEffect(f);f.event.source='/publisher/beta';f.task.expected_source='/publisher/beta';f.event.source_id_seen=false})
  add('redelivery-without-sink-effects','eligible-new-effect',f=>{newEffect(f);f.event.redelivery=true})
  add('current-permission-revoked-before-new-effect','permission-stop',f=>{newEffect(f);f.permission.current=false})
  add('missing-protected-effect-boundary','permission-stop',f=>{newEffect(f);f.permission.protected_effect_boundary=false})
  add('unknown-prior-effect-no-receipts','safe-stop-unknown',f=>{newEffect(f);f.prior.classification='unknown'})
  add('miss-without-query-coverage','safe-stop-unknown',f=>{newEffect(f);f.prior.coverage=false})
  add('miss-without-watermark','safe-stop-unknown',f=>{newEffect(f);f.prior.watermark=false})
  add('miss-after-retention-expiry','safe-stop-unknown',f=>{newEffect(f);f.prior.retention=false})
  add('miss-without-exact-effect-scope','safe-stop-unknown',f=>{newEffect(f);f.prior.exact_identity=false})
  add('covered-miss-positive-receipts','evidence-conflict',f=>{f.prior.classification='authoritative miss'})
  add('aggregate-hit-no-member-receipts','receipt-incomplete',f=>{f.receipts=[]})
  add('partial-effect-receipts','membership-mismatch',f=>{f.receipts.pop()})
  add('duplicate-receipt-with-missing-member','duplicate-effect',f=>{f.receipts=[receipt('publish@sink-u7'),receipt('publish@sink-u7')]})
  add('extra-effect-with-complete-required-set','membership-mismatch',f=>{f.receipts.push(receipt('audit@sink-u7'))})
  add('same-count-wrong-receipt-member','membership-mismatch',f=>{f.receipts[1].effect_id='audit@sink-u7'})
  add('wrong-source-on-receipt','identity-mismatch',f=>{f.receipts[0].source='/publisher/beta'})
  add('wrong-event-id-on-receipt','identity-mismatch',f=>{f.receipts[0].event_id='evt-78'})
  add('wrong-task-on-receipt','identity-mismatch',f=>{f.receipts[0].task_id='task-other'})
  add('same-name-new-target-incarnation','identity-mismatch',f=>{f.task.target_uid='sink-u8'})
  add('historically-unauthorized-receipt','historically-unauthorized',f=>{f.receipts[0].authorized_at_effect=false})
  add('missing-temporal-order-proof','temporal-unproven',f=>{f.receipts[0].temporal_order_proven=false})
  add('current-postcondition-reversed','current-incomplete',f=>{f.task.current_postcondition=false})
  add('dynamic-member-added','membership-mismatch',f=>{f.task.current_membership.push('audit@sink-u7')})
  add('same-count-membership-replacement','membership-mismatch',f=>{f.task.current_membership[1]='audit@sink-u7'})
  add('membership-revision-drift','membership-stale',f=>{f.task.completion_revision='m7'})
  add('completion-commit-unfenced','completion-unfenced',f=>{f.task.protected_completion=false})
  add('untrusted-inbound-event','untrusted-event',f=>{f.event.authenticated=false})
  add('event-source-binding-mismatch','identity-mismatch',f=>{f.task.expected_source='/publisher/beta'})
  return all
}
function full(s){
  const {event:e,task:t,prior:p,permission:a,receipts:rs}=s
  if(!e.authenticated)return 'untrusted-event'
  if(e.source!==t.expected_source||e.id!==t.expected_event_id)return 'identity-mismatch'
  if(p.classification==='authoritative miss' && p.exact_identity&&p.coverage&&p.watermark&&p.retention&&rs.length)return 'evidence-conflict'
  if(!rs.length){
    if(p.classification==='hit')return 'receipt-incomplete'
    if(p.classification!=='authoritative miss'||!p.exact_identity||!p.coverage||!p.watermark||!p.retention)return 'safe-stop-unknown'
    return a.current&&a.protected_effect_boundary&&t.status==='RUNNING'?'eligible-new-effect':'permission-stop'
  }
  if(p.classification!=='hit')return 'safe-stop-unknown'
  const ids=rs.map(x=>x.effect_id)
  if(new Set(ids).size!==ids.length)return 'duplicate-effect'
  if(rs.some(x=>x.task_id!==t.task_id||x.source!==e.source||x.event_id!==e.id||x.target_uid!==t.target_uid))return 'identity-mismatch'
  if(rs.some(x=>!x.authorized_at_effect))return 'historically-unauthorized'
  if(rs.some(x=>!x.temporal_order_proven))return 'temporal-unproven'
  const req=new Set(t.required_effects), got=new Set(ids), current=new Set(t.current_membership)
  if(req.size!==t.required_effects.length||current.size!==t.current_membership.length||got.size!==req.size||[...got].some(x=>!req.has(x))||current.size!==req.size||[...current].some(x=>!req.has(x)))return 'membership-mismatch'
  if(t.membership_revision!==t.completion_revision)return 'membership-stale'
  if(!t.protected_completion)return 'completion-unfenced'
  if(!t.current_postcondition||t.status!=='COMPLETED')return 'current-incomplete'
  return 'verified'
}
function decisions(s){return PATHS.map(path=>({case_id:s.case_id,path,decision:path==='ack_only'?(s.event.ack?'verified':'unverified'):path==='id_only'?(s.event.id_seen?'verified':'unverified'):path==='source_id_seen'?(s.event.source_id_seen?'verified':'unverified'):full(s)}))}
function csv(rows){return ['case_id,path,decision',...rows.map(r=>[r.case_id,r.path,r.decision].join(','))].join('\n')+'\n'}
function produce(){const scenarios=fixtures();return {scenarios,rows:scenarios.flatMap(decisions)}}
if(require.main===module){const root=path.resolve(__dirname,'..');const {scenarios,rows}=produce();fs.mkdirSync(path.join(root,'evidence'),{recursive:true});fs.writeFileSync(path.join(root,'evidence','2026-10-14-scenarios.json'),JSON.stringify({logical_date:'2026-10-14',scope:'synthetic-fixture-no-real-effects',paths:PATHS,scenarios},null,2)+'\n');fs.writeFileSync(path.join(root,'evidence','2026-10-14-decisions.csv'),csv(rows));console.log(JSON.stringify({scenarios:scenarios.length,decisions:rows.length,expected_mismatch:scenarios.filter(s=>full(s)!==s.expected).map(s=>s.case_id),verified:scenarios.filter(s=>full(s)==='verified').length,real_effects:0}))}
module.exports={PATHS,fixtures,full,decisions,csv,produce}
