// Independent-form synthetic verifier; shares scenario vocabulary.
const fs=require('fs');
const d=JSON.parse(fs.readFileSync('ballast/evidence/2026-10-11-scenarios.json','utf8'));
const lines=fs.readFileSync('ballast/evidence/2026-10-11-decisions.csv','utf8').trim().split(/\r?\n/).slice(1);
let bad=0;
for(const c of d.cases){
 const s={...d.base,...c.overrides}, missing=d.required.some(x=>!s.receipts.includes(x));
 const predicates=[
 [!s.target_ok,'target-incarnation-mismatch'],[!s.membership_ok,'membership-unverified'],
 [!s.binding_ok,'effect-identity-mismatch'],[s.prior==='unknown'||(s.prior==='miss'&&!s.coverage),'safe-stop-unknown'],
 [new Set(s.receipts).size!==s.receipts.length,'duplicate-effect'],
 [s.receipts.some(x=>!d.required.includes(x)),'unexpected-effect'],
 [s.receipts.length>0&&!s.historical_auth,'historically-unauthorized'],
 [s.receipts.length>0&&!s.temporal_ok,'temporal-unverified'],
 [missing&&!s.current_permission,'permission-stop'],[missing,'incomplete-effect-set'],
 [!s.postcondition,'current-postcondition-failed']
 ];
 const expected=(predicates.find(x=>x[0])||[true,'verified'])[1];
 const mine=lines.filter(x=>x.startsWith(c.id+','));
 if(expected!==c.expected||mine.length!==4||!mine.some(x=>x.includes(',full-integrity,'+expected+',')))bad++;
 const weak={'cancellation-only':s.old_status==='cancelled'?'incomplete-effect-set':'verified','attempt-advanced-only':s.new_attempt>s.old_attempt?'verified':'incomplete-effect-set','receipt-count-only':s.receipts.length===d.required.length?'verified':'incomplete-effect-set','full-integrity':expected};
 for(const [path,want] of Object.entries(weak)){
  const line=mine.find(x=>x.split(',')[1]===path);
  if(!line) {bad++;continue;}
  const fields=line.split(',');
  if(fields[2]!==want||fields[3]!==expected||(fields[4]==='true')!==(want===expected))bad++;
 }
}
console.log(JSON.stringify({scenarios:d.cases.length,rows:lines.length,failures:bad}));
if(bad||lines.length!==72)throw Error('fixture disagreement');
