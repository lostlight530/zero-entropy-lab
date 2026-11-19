'use strict';
const specs=[['baseline',{}],['stale_owner',{worker:3}],['revoked_permission',{permission:0}],['concurrent_commit',{commitRev:10}],['receipt_without_sink',{sink:'UNKNOWN'}],['wrong_reversed_effect',{sinkEffect:'E0'}],['wrong_target_incarnation',{sinkTarget:'U0'}],['unknown_original',{original:'UNKNOWN'}],['invalid_historical_grant',{grant:0}],['extra_member',{member:['E1','E2']}],['forged_issuer',{authIssuer:0}],['negative_original_conflict',{original:'MISS'}],['unknown_receipt',{receipt:'UNKNOWN'}],['duplicate_member',{member:['E1','E1']}],['missing_effect_identity',{sinkEffect:null}],['unmodeled_atomicity',{}]];
const base={owner:4,worker:4,rev:9,commitRev:9,receipt:'HIT',original:'HIT',grant:1,permission:1,member:['E1'],required:['E1'],sink:'REVERSED',sinkEffect:'E1',target:'U1',sinkTarget:'U1',authIssuer:1};
const cases=specs.map(([id,changes],i)=>({...base,...changes,id,seq:i+1}));
function weak(c){return c.receipt==='HIT'?'COMPENSATED':'RETRY'}
// Explicit fail-closed model contract, synthetic inputs only
function reference(c){
 if(c.receipt!=='HIT')return 'UNKNOWN_STOP';
 if(c.authIssuer!==1)return 'ISSUER_UNKNOWN';
 if([c.sinkEffect,c.sinkTarget,c.target].some(x=>typeof x!=='string'||!x.trim()))return 'IDENTITY_UNKNOWN';
 if(c.sinkEffect!=='E1'||c.sinkTarget!==c.target)return 'SINK_IDENTITY_CONFLICT';
 if(c.original==='MISS')return 'EVIDENCE_CONFLICT';
 if(c.original!=='HIT')return 'ORIGINAL_UNKNOWN';
 if(c.grant!==1)return 'HISTORICAL_AUTH_INVALID';
 if(!Array.isArray(c.required)||!Array.isArray(c.member)||!c.required.length||!c.member.length||[...c.required,...c.member].some(x=>typeof x!=='string'||!x.trim()))return 'MEMBERSHIP_UNKNOWN';
 if(new Set(c.member).size!==c.member.length)return 'MEMBERSHIP_INVALID';
 if(new Set(c.required).size!==c.required.length)return 'DUPLICATE_REQUIRED';
 if(c.member.length!==c.required.length||c.member.some(x=>!c.required.includes(x)))return 'EFFECT_SET_CONFLICT';
 if(!c.required.includes('E1')||!c.member.includes(c.sinkEffect))return 'EFFECT_MEMBERSHIP_UNBOUND';
 if(c.required.length!==1)return 'MULTI_EFFECT_COMPENSATION_UNKNOWN';
 if(!Number.isSafeInteger(c.owner)||!Number.isSafeInteger(c.worker)||c.owner<0||c.worker<0)return 'OWNER_UNKNOWN';
 if(c.owner!==c.worker)return 'OWNER_STALE';
 if(!Number.isSafeInteger(c.rev)||!Number.isSafeInteger(c.commitRev)||c.rev<0||c.commitRev<0)return 'REVISION_UNKNOWN';
 if(c.rev!==c.commitRev)return 'REVISION_DRIFT';
 if(c.sink!=='REVERSED')return 'SINK_UNKNOWN';
 if(c.permission!==1)return 'NO_NEW_EFFECT';
 return 'MODEL_BOUND';
}
// Separate reconstruction from primitive tuple fields, but NOT an authority-independent verifier
function verifier(c){
 const ids=[c.sinkEffect,c.sinkTarget,c.target];
 const exact=ids.every(value=>typeof value==='string'&&value.trim().length>0);
 const sets=[c.member,c.required];
 const validSets=sets.every(a=>Array.isArray(a)&&a.length>0&&a.every(v=>typeof v==='string'&&v.trim().length>0));
 const membership=validSets?new Set(c.member):null;
 const required=validSets?new Set(c.required):null;
 const ownerKnown=[c.owner,c.worker].every(n=>Number.isSafeInteger(n)&&n>=0);
 const revisionKnown=[c.rev,c.commitRev].every(n=>Number.isSafeInteger(n)&&n>=0);
 const truth=[
  {ok:c.receipt==='HIT',bad:'UNKNOWN_STOP'},
  {ok:c.authIssuer===1,bad:'ISSUER_UNKNOWN'},
  {ok:exact,bad:'IDENTITY_UNKNOWN'},
  {ok:c.sinkEffect==='E1'&&c.sinkTarget===c.target,bad:'SINK_IDENTITY_CONFLICT'},
  {ok:c.original!=='MISS',bad:'EVIDENCE_CONFLICT'},
  {ok:c.original==='HIT',bad:'ORIGINAL_UNKNOWN'},
  {ok:c.grant===1,bad:'HISTORICAL_AUTH_INVALID'},
  {ok:validSets,bad:'MEMBERSHIP_UNKNOWN'},
  {ok:!validSets||membership.size===c.member.length,bad:'MEMBERSHIP_INVALID'},
  {ok:!validSets||required.size===c.required.length,bad:'DUPLICATE_REQUIRED'},
  {ok:!validSets||(membership.size===required.size&&[...required].every(v=>membership.has(v))),bad:'EFFECT_SET_CONFLICT'},
  {ok:!validSets||(required.has('E1')&&membership.has(c.sinkEffect)),bad:'EFFECT_MEMBERSHIP_UNBOUND'},
  {ok:!validSets||required.size===1,bad:'MULTI_EFFECT_COMPENSATION_UNKNOWN'},
  {ok:ownerKnown,bad:'OWNER_UNKNOWN'},
  {ok:c.owner===c.worker,bad:'OWNER_STALE'},
  {ok:revisionKnown,bad:'REVISION_UNKNOWN'},
  {ok:c.rev===c.commitRev,bad:'REVISION_DRIFT'},
  {ok:c.sink==='REVERSED',bad:'SINK_UNKNOWN'},
  {ok:c.permission===1,bad:'NO_NEW_EFFECT'}
 ];
 const first=truth.find(step=>!step.ok);
 return first?first.bad:'MODEL_BOUND';
}
const rows=cases.map(c=>({id:c.id,weak:weak(c),reference:reference(c),verifier:verifier(c)}));
const summary={scenarios:rows.length,weakCompensated:rows.filter(x=>x.weak==='COMPENSATED').length,referenceBound:rows.filter(x=>x.reference==='MODEL_BOUND').length,divergences:rows.filter(x=>x.weak!==x.reference).length,verifierAgreement:rows.filter(x=>x.reference===x.verifier).length,failures:rows.filter(x=>x.reference!==x.verifier).length,externalSinkCalls:0};
if(new Set(cases.map(c=>c.id)).size!==cases.length||summary.failures)throw Error('fixture or verifier failure');
console.log(JSON.stringify({schema:'ballast-synthetic-2026-11-19-v1',cases,rows,summary,referenceSelfAttack:{id:'unmodeled_atomicity',modelDecision:rows.at(-1).reference,missing:'no real atomic compare-and-reverse, no independently authenticated sink receipt, no proof of no second reversal',strongerVerdict:'UNKNOWN_STOP'}},null,2));

const reviewSpecs=[
 ['owner_missing_both',{owner:null,worker:null},'OWNER_UNKNOWN'],
 ['owner_string_equal',{owner:'4',worker:'4'},'OWNER_UNKNOWN'],
 ['revision_missing_both',{rev:null,commitRev:null},'REVISION_UNKNOWN'],
 ['revision_negative_equal',{rev:-1,commitRev:-1},'REVISION_UNKNOWN'],
 ['empty_membership',{required:[],member:[]},'MEMBERSHIP_UNKNOWN'],
 ['required_missing',{required:null},'MEMBERSHIP_UNKNOWN'],
 ['observed_missing',{member:null},'MEMBERSHIP_UNKNOWN'],
 ['blank_member_ids',{required:[''],member:['']},'MEMBERSHIP_UNKNOWN'],
 ['unbound_effect_member',{required:['E9'],member:['E9']},'EFFECT_MEMBERSHIP_UNBOUND'],
 ['one_receipt_two_effects',{required:['E1','E2'],member:['E1','E2']},'MULTI_EFFECT_COMPENSATION_UNKNOWN'],
 ['one_receipt_three_effects',{required:['E1','E2','E3'],member:['E1','E2','E3']},'MULTI_EFFECT_COMPENSATION_UNKNOWN'],
 ['duplicate_required',{required:['E1','E1'],member:['E1']},'DUPLICATE_REQUIRED'],
 ['wrong_effect_with_miss',{sinkEffect:'E0',original:'MISS'},'SINK_IDENTITY_CONFLICT'],
 ['revoked_wrong_target',{permission:0,sinkTarget:'U0'},'SINK_IDENTITY_CONFLICT'],
 ['blank_target',{target:' ',sinkTarget:' '},'IDENTITY_UNKNOWN']
];
const reviewCases=reviewSpecs.map(([id,patch],seq)=>({...base,...patch,id,reviewSeq:seq+1}));
const reviewRows=reviewCases.map((c,i)=>({id:c.id,weak:weak(c),reference:reference(c),verifier:verifier(c),expected:reviewSpecs[i][2]}));
if(new Set([...cases,...reviewCases].map(c=>c.id)).size!==cases.length+reviewCases.length)throw Error('duplicate original/review scenario IDs');
const reviewFailures=reviewRows.filter(row=>row.reference!==row.expected||row.verifier!==row.reference);
if(reviewFailures.length)throw Error('review decision mismatch '+JSON.stringify(reviewFailures));
console.log(JSON.stringify({
 kind:'SAME_DAY_MAINTAINER_REVIEW_NO_CREDIT',
 scope:'isolated V8 synthetic model, NOT Node CLI or live effect sink',
 originalSourceLedgerPreserved:true,
 reviewCases,reviewRows,
 reviewSummary:{scenarios:reviewRows.length,referenceVerifierAgreements:reviewRows.filter(x=>x.reference===x.verifier).length,failures:reviewFailures.length},
 referenceGap:{model:reference(cases[0]),strongerAuthorityAware:'UNKNOWN_STOP',unproven:['authenticated sink receipt','effect-time authorization witness','atomic compare-and-reverse','full effect-set membership authority','clock ordering']},
 credit:{daily:0,originalWindow:0,case:0,method:0,notes:0,special:0,audit:0}
},null,2));
