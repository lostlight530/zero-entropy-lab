'use strict';
const specs=[['baseline',{}],['stale_owner',{worker:3}],['revoked_permission',{permission:0}],['concurrent_commit',{commitRev:10}],['receipt_without_sink',{sink:'UNKNOWN'}],['wrong_reversed_effect',{sinkEffect:'E0'}],['wrong_target_incarnation',{sinkTarget:'U0'}],['unknown_original',{original:'UNKNOWN'}],['invalid_historical_grant',{grant:0}],['extra_member',{member:['E1','E2']}],['forged_issuer',{authIssuer:0}],['negative_original_conflict',{original:'MISS'}],['unknown_receipt',{receipt:'UNKNOWN'}],['duplicate_member',{member:['E1','E1']}],['missing_effect_identity',{sinkEffect:null}],['unmodeled_atomicity',{}]];
const base={owner:4,worker:4,rev:9,commitRev:9,receipt:'HIT',original:'HIT',grant:1,permission:1,member:['E1'],required:['E1'],sink:'REVERSED',sinkEffect:'E1',target:'U1',sinkTarget:'U1',authIssuer:1};
const cases=specs.map(([id,changes],i)=>({...base,...changes,id,seq:i+1}));
function weak(c){return c.receipt==='HIT'?'COMPENSATED':'RETRY'}
function reference(c){
 if(c.receipt!=='HIT')return 'UNKNOWN_STOP';
 if(c.authIssuer!==1)return 'ISSUER_UNKNOWN';
 if(c.original==='MISS')return 'EVIDENCE_CONFLICT';
 if(c.original!=='HIT')return 'ORIGINAL_UNKNOWN';
 if(c.grant!==1)return 'HISTORICAL_AUTH_INVALID';
 if(c.permission!==1)return 'NO_NEW_EFFECT';
 if(c.owner!==c.worker)return 'OWNER_STALE';
 if(c.rev!==c.commitRev)return 'REVISION_DRIFT';
 if(!c.sinkEffect||!c.sinkTarget)return 'IDENTITY_UNKNOWN';
 if(c.sinkEffect!=='E1'||c.sinkTarget!==c.target)return 'SINK_IDENTITY_CONFLICT';
 if(!Array.isArray(c.member)||new Set(c.member).size!==c.member.length)return 'MEMBERSHIP_INVALID';
 if(c.member.length!==c.required.length||c.member.some(x=>!c.required.includes(x)))return 'EFFECT_SET_CONFLICT';
 if(c.sink!=='REVERSED')return 'SINK_UNKNOWN';
 return 'MODEL_BOUND';
}
function verifier(c){
 const evidence=[c.receipt==='HIT',c.authIssuer===1,c.original==='HIT',c.grant===1,c.permission===1,c.owner===c.worker,c.rev===c.commitRev,Boolean(c.sinkEffect&&c.sinkTarget),c.sinkEffect==='E1'&&c.sinkTarget===c.target,Array.isArray(c.member)&&c.member.length===new Set(c.member).size,Array.isArray(c.member)&&c.member.length===c.required.length&&c.required.every(x=>c.member.includes(x)),c.sink==='REVERSED'];
 const labels=['UNKNOWN_STOP','ISSUER_UNKNOWN',c.original==='MISS'?'EVIDENCE_CONFLICT':'ORIGINAL_UNKNOWN','HISTORICAL_AUTH_INVALID','NO_NEW_EFFECT','OWNER_STALE','REVISION_DRIFT','IDENTITY_UNKNOWN','SINK_IDENTITY_CONFLICT','MEMBERSHIP_INVALID','EFFECT_SET_CONFLICT','SINK_UNKNOWN'];
 const n=evidence.findIndex(x=>!x);return n<0?'MODEL_BOUND':labels[n];
}
const rows=cases.map(c=>({id:c.id,weak:weak(c),reference:reference(c),verifier:verifier(c)}));
const summary={scenarios:rows.length,weakCompensated:rows.filter(x=>x.weak==='COMPENSATED').length,referenceBound:rows.filter(x=>x.reference==='MODEL_BOUND').length,divergences:rows.filter(x=>x.weak!==x.reference).length,verifierAgreement:rows.filter(x=>x.reference===x.verifier).length,failures:rows.filter(x=>x.reference!==x.verifier).length,externalSinkCalls:0};
if(new Set(cases.map(c=>c.id)).size!==cases.length||summary.failures)throw Error('fixture or verifier failure');
console.log(JSON.stringify({schema:'ballast-synthetic-2026-11-19-v1',cases,rows,summary,referenceSelfAttack:{id:'unmodeled_atomicity',modelDecision:rows.at(-1).reference,missing:'no real atomic compare-and-reverse, no independently authenticated sink receipt, no proof of no second reversal',strongerVerdict:'UNKNOWN_STOP'}},null,2));
