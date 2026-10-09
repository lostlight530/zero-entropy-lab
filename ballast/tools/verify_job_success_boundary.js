const fs=require('fs'); const OUT=process.env.BALLAST_JOB_OUT||'/tmp/ballast_20261009';
const scenarios=JSON.parse(fs.readFileSync(OUT+'/scenarios.json','utf8'));
const rows=fs.readFileSync(OUT+'/decisions.csv','utf8').trim().split('\n').slice(1).map(s=>{const [scenario,expected,path,observed,disagree]=s.split(',');return {scenario,expected,path,observed,disagree:Number(disagree)}});
let failures=[];
function independent(x){
  const reasons=[];
  if(x.failure) reasons.push(['failure-target',1]);
  if(!(x.complete&&x.pods_terminated)) reasons.push(['pending-termination',2]);
  if(x.job_uid!==x.current_job_uid) reasons.push(['job-incarnation-mismatch',3]);
  if(x.target_uid!==x.current_target_uid) reasons.push(['target-incarnation-mismatch',4]);
  if(x.receipt_state==='unknown'||(x.receipt_state==='miss'&&!x.receipt_covered)) reasons.push(['safe-stop-unknown',5]);
  if(x.receipt_state==='hit'&&!x.historical_auth) reasons.push(['historically-unauthorized',6]);
  if(x.duplicate) reasons.push(['duplicate-effect',7]);
  const missing=x.required.filter(id=>!x.receipts.includes(id));
  if(missing.length>0) reasons.push([x.permission?'incomplete-effect-set':'permission-stop',8]);
  if(!x.postcondition) reasons.push(['current-postcondition-failed',9]);
  return reasons.sort((a,b)=>a[1]-b[1])[0]?.[0]||'verified';
}
for(const s of scenarios){
 const expected=independent(s);
 const relevant=rows.filter(r=>r.scenario===s.name);
 if(relevant.length!==4) failures.push('row-count:'+s.name);
 for(const r of relevant){
  if(r.expected!==expected) failures.push('expected:'+s.name+':'+r.path);
  if(r.path==='full-integrity'&&r.observed!==expected) failures.push('full:'+s.name);
  if(Number(r.observed!==expected)!==r.disagree) failures.push('disagree:'+s.name+':'+r.path);
 }
}
console.log(JSON.stringify({verifier:'nodejs-independent-primitive-reconstruction',scenario_count:scenarios.length,decision_count:rows.length,expected_agreement:scenarios.length-failures.filter(s=>s.startsWith('expected:')).length,failures,semantic_independence:'LIMITED_SHARED_SCENARIO_VOCABULARY',data_source_independence:'LIMITED_SHARED_JSON_INPUT',implementation_independence:'PARTIAL_SEPARATE_LANGUAGE_AND_PREDICATE_STRUCTURE'},null,2));
if(failures.length)process.exit(1);
