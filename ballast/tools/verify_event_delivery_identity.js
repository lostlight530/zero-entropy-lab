'use strict'
// Independent rule organization over persisted primitive fixtures, shared schema and semantic contract
const fs=require('node:fs')
const path=require('node:path')
const EXPECTED_PATHS=['ack_only','id_only','source_id_seen','full_integrity']
function priorScopeMatches(s){
  const q=s.prior.scope,t=s.task,e=s.event
  if(!q||q.task_id!==t.task_id||q.source!==e.source||q.event_id!==e.id||q.target_uid!==t.target_uid||q.membership_revision!==t.membership_revision)return false
  if(!Array.isArray(q.effect_ids)||!Array.isArray(t.required_effects))return false
  const a=new Set(q.effect_ids),b=new Set(t.required_effects)
  return q.effect_ids.length===t.required_effects.length&&a.size===q.effect_ids.length&&b.size===t.required_effects.length&&[...a].every(x=>b.has(x))
}
function reference(s){
  const e=s.event,t=s.task,p=s.prior,r=s.receipts,a=s.permission
  if(e.authenticated!==true)return 'untrusted-event'
  if([e.source,e.id].join('\u0000')!==[t.expected_source,t.expected_event_id].join('\u0000'))return 'identity-mismatch'
  const validMiss=p.classification==='authoritative miss'&&['exact_identity','coverage','watermark','retention'].every(k=>p[k]===true)&&priorScopeMatches(s)
  if(r.length>0&&validMiss)return 'evidence-conflict'
  if(r.length===0){
    if(!priorScopeMatches(s)||p.exact_identity!==true)return 'safe-stop-unknown'
    if(p.classification==='hit')return 'receipt-incomplete'
    if(!validMiss)return 'safe-stop-unknown'
    if(a.current===true&&a.protected_effect_boundary===true&&t.status==='RUNNING')return 'eligible-new-effect'
    return 'permission-stop'
  }
  if(p.classification!=='hit')return 'safe-stop-unknown'
  const seen=new Map()
  for(const x of r)seen.set(x.effect_id,(seen.get(x.effect_id)||0)+1)
  if([...seen.values()].some(n=>n!==1))return 'duplicate-effect'
  for(const x of r){
    if(x.task_id!==t.task_id||x.source!==e.source||x.event_id!==e.id||x.target_uid!==t.target_uid)return 'identity-mismatch'
  }
  if(!priorScopeMatches(s)||p.exact_identity!==true)return 'safe-stop-unknown'
  if(!r.every(x=>x.authorized_at_effect===true))return 'historically-unauthorized'
  if(!r.every(x=>x.temporal_order_proven===true))return 'temporal-unproven'
  const equalSets=(left,right)=>left.length===right.length&&new Set(left).size===left.length&&new Set(right).size===right.length&&left.every(x=>right.includes(x))
  if(!equalSets(r.map(x=>x.effect_id),t.required_effects)||!equalSets(t.current_membership,t.required_effects))return 'membership-mismatch'
  if(t.membership_revision!==t.completion_revision)return 'membership-stale'
  if(t.protected_completion!==true)return 'completion-unfenced'
  if(t.current_postcondition!==true||t.status!=='COMPLETED')return 'current-incomplete'
  return 'verified'
}
function verify(payload,csvText){
  const problems=[]
  const scenarios=payload.scenarios
  const paths=payload.paths
  if(!Array.isArray(scenarios)||!Array.isArray(paths)||JSON.stringify(paths)!==JSON.stringify(EXPECTED_PATHS))problems.push('invalid scenario or path envelope')
  if(problems.length)return problems
  const ids=new Set(),vectors=new Set()
  for(const s of scenarios){
    if(ids.has(s.case_id))problems.push('duplicate case_id '+s.case_id)
    ids.add(s.case_id)
    const vector=JSON.stringify({event:s.event,task:s.task,prior:s.prior,permission:s.permission,receipts:s.receipts})
    if(vectors.has(vector))problems.push('duplicate primitive vector '+s.case_id)
    vectors.add(vector)
    if(reference(s)!==s.expected)problems.push('frozen label disagreement '+s.case_id)
  }
  const lines=csvText.trimEnd().split(/\r?\n/)
  if(lines.shift()!=='case_id,path,decision')problems.push('invalid csv header')
  const rowKeys=new Set(),byCase=new Map()
  for(const line of lines){
    const cells=line.split(',')
    if(cells.length!==3){problems.push('invalid csv width');continue}
    const [id,p,d]=cells,key=id+'\u0000'+p
    if(!ids.has(id))problems.push('unknown case_id '+id)
    if(!paths.includes(p))problems.push('unknown path '+p)
    if(rowKeys.has(key))problems.push('duplicate path identity '+key)
    rowKeys.add(key)
    byCase.set(id,(byCase.get(id)||0)+1)
    const s=scenarios.find(x=>x.case_id===id)
    if(s){
      const expected=p==='ack_only'?(s.event.ack===true?'verified':'unverified'):p==='id_only'?(s.event.id_seen===true?'verified':'unverified'):p==='source_id_seen'?(s.event.source_id_seen===true?'verified':'unverified'):reference(s)
      if(d!==expected)problems.push('decision disagreement '+key)
    }
  }
  if(lines.length!==scenarios.length*paths.length)problems.push('row count mismatch')
  for(const s of scenarios)if(byCase.get(s.case_id)!==paths.length)problems.push('path coverage mismatch '+s.case_id)
  return problems
}
function adversarialControls(payload,csvText){
  const cp=x=>JSON.parse(JSON.stringify(x))
  const tests=[]
  let p=cp(payload);p.scenarios[0].expected='eligible-new-effect';tests.push(['frozen-label',verify(p,csvText)])
  tests.push(['changed-decision',verify(payload,csvText.replace(',full_integrity,verified',',full_integrity,unverified'))])
  tests.push(['missing-row',verify(payload,csvText.trimEnd().split('\n').slice(0,-1).join('\n')+'\n')])
  tests.push(['duplicate-path',verify(payload,csvText.replace(',id_only,verified',',ack_only,verified'))])
  p=cp(payload);p.scenarios[1].event=cp(p.scenarios[0].event);p.scenarios[1].task=cp(p.scenarios[0].task);p.scenarios[1].prior=cp(p.scenarios[0].prior);p.scenarios[1].permission=cp(p.scenarios[0].permission);p.scenarios[1].receipts=cp(p.scenarios[0].receipts);tests.push(['duplicate-primitive',verify(p,csvText)])
  p=cp(payload);p.scenarios[0].receipts[0].source='/publisher/other';tests.push(['receipt-binding',verify(p,csvText)])
  p=cp(payload);p.scenarios[0].task.current_membership.push('unexpected@sink-u7');tests.push(['extra-member',verify(p,csvText)])
  p=cp(payload);p.scenarios[0].prior.classification='authoritative miss';tests.push(['conflicting-miss',verify(p,csvText)])
  p=cp(payload);p.scenarios[0].prior.scope.task_id='tampered';tests.push(['hit-prior-scope',verify(p,csvText)])
  p=cp(payload);p.scenarios.find(x=>x.case_id==='eligible-new-effect-covered-miss').prior.scope.effect_ids[1]='unexpected@sink-u7';tests.push(['miss-prior-scope',verify(p,csvText)])
  p=cp(payload);p.scenarios.find(x=>x.case_id==='eligible-new-effect-covered-miss').prior.scope.effect_ids[1]=p.scenarios.find(x=>x.case_id==='eligible-new-effect-covered-miss').prior.scope.effect_ids[0];tests.push(['duplicate-query-member',verify(p,csvText)])
  p=cp(payload);p.scenarios[0].prior.exact_identity=false;tests.push(['aggregate-hit',verify(p,csvText)])
  return tests.map(([name,errors])=>({name,rejected:errors.length>0,errors:errors.slice(0,2)}))
}
if(require.main===module){const root=path.resolve(__dirname,'..');const p=JSON.parse(fs.readFileSync(path.join(root,'evidence','2026-10-14-scenarios.json'),'utf8'));const c=fs.readFileSync(path.join(root,'evidence','2026-10-14-decisions.csv'),'utf8');const errors=verify(p,c),adversarial=adversarialControls(p,c);console.log(JSON.stringify({scenario_count:p.scenarios.length,row_count:c.trimEnd().split('\n').length-1,failures:errors.length,negative_controls:adversarial.length,rejected:adversarial.filter(x=>x.rejected).length,errors,adversarial},null,2));if(errors.length||adversarial.some(x=>!x.rejected))process.exitCode=1}
module.exports={reference,verify,adversarialControls}
