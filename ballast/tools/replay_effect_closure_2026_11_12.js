'use strict';

// Reconstructed same-date synthetic model review, not byte-identical original Python producer

// Usage: node ballast/tools/replay_effect_closure_2026_11_12.js --all

function baseline(){
 const id={task:"T12",run:"R12",attempt:"A12",targetUid:"target-12"};
 const members=[{effect:"E-A",memberUid:"uid-A1"},{effect:"E-B",memberUid:"uid-B1"}];
 const receipt=(m,at)=>({...id,receiptId:"rc-"+m.effect,effect:m.effect,memberUid:m.memberUid,at,issuer:"issuer-12"});
 return {id,members,revision:4,attemptStart:10,permissionNow:true,receipts:members.map((m,i)=>receipt(m,40+5*i)),misses:[],
 grant:{issuer:"issuer-12",task:"T12",from:20,until:70,effects:["E-A","E-B"],proven:true},
 query:{...id,exact:true,ok:true,at:90,watermark:90,retentionFrom:0,retentionUntil:120},
 completion:{predicate:true,guard:true,revision:4,targetUid:"target-12",commitAt:80,effects:["E-A","E-B"],members:["uid-A1","uid-B1"]}};
}

function fixtures(){
 const cp=x=>JSON.parse(JSON.stringify(x));
 const changes=[
 ["valid",f=>{}],["extra_effect",f=>{f.receipts.push({...cp(f.receipts[0]),receiptId:"rc-E-C",effect:"E-C",memberUid:"uid-C1",at:50})}],
 ["stale_grant",f=>{f.grant.until=42}],["wrong_incarnation",f=>{f.receipts[1].memberUid="uid-B2"}],
 ["revoked_current",f=>{f.permissionNow=false}],["unknown_prior",f=>{f.query.ok=false}],
 ["evidence_conflict",f=>{f.misses=[{...f.query,status:"MISS",effect:"E-A"}]}],
 ["duplicate_receipt_id",f=>{f.receipts[1].receiptId=f.receipts[0].receiptId}],
 ["duplicate_effect_A",f=>{f.receipts[1].effect="E-A"}],
 ["wrong_run",f=>{f.receipts[0].run="R-old"}],["wrong_attempt",f=>{f.receipts[0].attempt="A-old"}],
 ["wrong_target",f=>{f.receipts[0].targetUid="target-new"}],
 ["missing_effect_id",f=>{delete f.receipts[0].effect}],
 ["query_watermark_stale",f=>{f.query.watermark=79}],
 ["query_retention_gap",f=>{f.query.retentionFrom=11}],
 ["query_unscoped",f=>{f.query.exact=false}],["query_too_early",f=>{f.query.at=79}],
 ["negative_uncovered",f=>{f.misses=[{...f.query,status:"MISS",effect:"E-A",exact:false}]}],
 ["completion_revision_change",f=>{f.completion.revision=5}],
 ["completion_no_guard",f=>{f.completion.guard=false}],
 ["completion_effect_outside_set",f=>{f.completion.effects=["E-A","E-B","E-C"]}],
 ["effect_after_commit",f=>{f.receipts[1].at=81}],
 ["duplicate_member_definition",f=>{f.members[1]=cp(f.members[0])}],
 ["permission_nonboolean",f=>{f.permissionNow="false"}],
 ["grant_missing_issuer",f=>{delete f.grant.issuer}],
 ["missing_receipt_B",f=>{f.receipts.pop()}],
 ["extra_member_in_completion",f=>{f.completion.members.push("uid-C1")}],
 ["negative_wrong_effect",f=>{f.misses=[{...f.query,status:"MISS",effect:"unknown"}]}]
 ];
 return changes.map(([scenario,mutate])=>{const facts=baseline();mutate(facts);return {scenario,facts}});
}

function reference(f){
 const I=f.id,M=f.members,R=f.receipts,N=f.misses,G=f.grant,Q=f.query,C=f.completion;
 if(!I||!Array.isArray(M)||!Array.isArray(R)||!Array.isArray(N)||!G||!Q||!C||M.length!==2||typeof f.permissionNow!=="boolean"||!Number.isFinite(f.attemptStart)||!Number.isFinite(f.revision))return "STOP_UNKNOWN";
 const identity=["task","run","attempt","targetUid"];
 if(identity.some(k=>typeof I[k]!=="string"||!I[k]))return "STOP_UNKNOWN";
 const exact=x=>x&&identity.every(k=>x[k]===I[k]);
 if(M.some(m=>!m||typeof m.effect!=="string"||!m.effect||typeof m.memberUid!=="string"||!m.memberUid)||new Set(M.map(m=>m.effect)).size!==M.length||new Set(M.map(m=>m.memberUid)).size!==M.length)return "STOP_UNKNOWN";
 if(!exact(Q)||Q.ok!==true||Q.exact!==true||![Q.at,Q.watermark,Q.retentionFrom,Q.retentionUntil,C.commitAt].every(Number.isFinite)||Q.at<C.commitAt||Q.watermark<C.commitAt||Q.retentionFrom>f.attemptStart||Q.retentionUntil<Q.at)return "STOP_UNKNOWN";
 for(const n of N){
  if(!exact(n)||n.status!=="MISS"||n.exact!==true||n.ok!==true||!M.some(m=>m.effect===n.effect)||![n.at,n.watermark,n.retentionFrom,n.retentionUntil].every(Number.isFinite)||n.watermark<C.commitAt||n.retentionFrom>f.attemptStart||n.retentionUntil<n.at)return "STOP_UNKNOWN";
  if(R.some(r=>r.effect===n.effect&&exact(r)))return "EVIDENCE_CONFLICT";
 }
 if(R.some(r=>!r||!exact(r)||typeof r.receiptId!=="string"||!r.receiptId||typeof r.effect!=="string"||!r.effect||typeof r.memberUid!=="string"||!r.memberUid||typeof r.issuer!=="string"||!r.issuer||!Number.isFinite(r.at)))return "STOP_UNKNOWN";
 if(R.length!==M.length||new Set(R.map(r=>r.receiptId)).size!==R.length||new Set(R.map(r=>r.effect)).size!==R.length||R.some(r=>!M.some(m=>m.effect===r.effect&&m.memberUid===r.memberUid)))return "EFFECT_SET_MISMATCH";
 if(G.proven!==true||G.task!==I.task||typeof G.issuer!=="string"||!G.issuer||!Array.isArray(G.effects)||new Set(G.effects).size!==G.effects.length||![G.from,G.until].every(Number.isFinite))return "STOP_UNKNOWN";
 if(R.some(r=>r.issuer!==G.issuer||r.at<G.from||r.at>G.until||!G.effects.includes(r.effect)))return "UNAUTHORIZED_OCCURRENCE";
 if(C.predicate!==true||C.guard!==true||C.revision!==f.revision||C.targetUid!==I.targetUid||!Array.isArray(C.effects)||!Array.isArray(C.members)||C.effects.length!==M.length||C.members.length!==M.length||C.effects.some((e,i)=>e!==M[i].effect)||C.members.some((u,i)=>u!==M[i].memberUid)||R.some(r=>r.at>C.commitAt))return "STOP_UNKNOWN";
 return "MODEL_COMPLETE";
}

function verifier(f){
 const {id,members,receipts,misses,grant,query,completion}=f;
 if(!id||!query||!grant||!completion||!Array.isArray(members)||!Array.isArray(receipts)||!Array.isArray(misses)||members.length!==2||typeof f.permissionNow!=="boolean"||!Number.isFinite(f.attemptStart)||!Number.isFinite(f.revision))return "STOP_UNKNOWN";
 for(const key of ["task","run","attempt","targetUid"])if(typeof id[key]!=="string"||!id[key])return "STOP_UNKNOWN";
 const same=r=>r&&r.task===id.task&&r.run===id.run&&r.attempt===id.attempt&&r.targetUid===id.targetUid;
 const expected=new Map(),uids=new Set();
 for(const m of members){if(!m||typeof m.effect!=="string"||!m.effect||typeof m.memberUid!=="string"||!m.memberUid||expected.has(m.effect)||uids.has(m.memberUid))return "STOP_UNKNOWN";expected.set(m.effect,m.memberUid);uids.add(m.memberUid);}
 if(!same(query)||query.ok!==true||query.exact!==true||[query.at,query.watermark,query.retentionFrom,query.retentionUntil,completion.commitAt].some(x=>!Number.isFinite(x))||query.at<completion.commitAt||query.watermark<completion.commitAt||query.retentionFrom>f.attemptStart||query.retentionUntil<query.at)return "STOP_UNKNOWN";
 for(const neg of misses){
  if(!same(neg)||neg.status!=="MISS"||neg.ok!==true||neg.exact!==true||!expected.has(neg.effect)||[neg.at,neg.watermark,neg.retentionFrom,neg.retentionUntil].some(x=>!Number.isFinite(x))||neg.watermark<completion.commitAt||neg.retentionFrom>f.attemptStart||neg.retentionUntil<neg.at)return "STOP_UNKNOWN";
  if(receipts.some(pos=>same(pos)&&pos.effect===neg.effect))return "EVIDENCE_CONFLICT";
 }
 const ids=new Set(),effects=new Set();
 for(const rec of receipts){
  if(!same(rec)||typeof rec.receiptId!=="string"||!rec.receiptId||typeof rec.effect!=="string"||!rec.effect||typeof rec.memberUid!=="string"||!rec.memberUid||typeof rec.issuer!=="string"||!rec.issuer||!Number.isFinite(rec.at))return "STOP_UNKNOWN";
  if(ids.has(rec.receiptId)||effects.has(rec.effect)||!expected.has(rec.effect)||expected.get(rec.effect)!==rec.memberUid)return "EFFECT_SET_MISMATCH";
  ids.add(rec.receiptId);effects.add(rec.effect);
 }
 if(ids.size!==expected.size)return "EFFECT_SET_MISMATCH";
 if(grant.proven!==true||grant.task!==id.task||typeof grant.issuer!=="string"||!grant.issuer||!Array.isArray(grant.effects)||new Set(grant.effects).size!==grant.effects.length||[grant.from,grant.until].some(x=>!Number.isFinite(x)))return "STOP_UNKNOWN";
 for(const rec of receipts)if(rec.issuer!==grant.issuer||rec.at<grant.from||rec.at>grant.until||!grant.effects.includes(rec.effect))return "UNAUTHORIZED_OCCURRENCE";
 const C=completion;
 if(C.predicate!==true||C.guard!==true||C.revision!==f.revision||C.targetUid!==id.targetUid||!Array.isArray(C.effects)||!Array.isArray(C.members)||C.effects.length!==expected.size||C.members.length!==expected.size)return "STOP_UNKNOWN";
 for(let i=0;i<members.length;i++)if(C.effects[i]!==members[i].effect||C.members[i]!==members[i].memberUid)return "STOP_UNKNOWN";
 if(receipts.some(rec=>rec.at>C.commitAt))return "STOP_UNKNOWN";
 return "MODEL_COMPLETE";
}

function review(){
const f=fixtures();
const core=f.map(({scenario,facts})=>({scenario,weak:facts.completion?.predicate===true&&facts.receipts?.length>=2?"COMPLETE":"STOP",reference:reference(facts),verifier:verifier(facts)}));
const full=f.map(({scenario,facts},i)=>({scenario,facts,...core[i]}));
const positive=["valid","revoked_current"],referenceErrors=core.filter(x=>x.reference!==x.verifier),unsafe=core.filter(x=>!positive.includes(x.scenario)&&x.reference==="MODEL_COMPLETE"),invalidPositive=core.filter(x=>positive.includes(x.scenario)&&x.reference!=="MODEL_COMPLETE");
const check=x=>x.length===full.length&&new Set(x.map(y=>y.scenario)).size===full.length&&x.every(y=>core.some(z=>z.scenario===y.scenario)&&y.reference===reference(y.facts)&&y.verifier===verifier(y.facts)&&y.reference===y.verifier&&y.weak===(y.facts.completion?.predicate===true&&y.facts.receipts?.length>=2?"COMPLETE":"STOP"));
const cp=x=>JSON.parse(JSON.stringify(x));
const attacks=[
["forged_reference",a=>{a[0].reference="UNKNOWN"}],["forged_verifier",a=>{a[0].verifier="UNKNOWN"}],
["missing_row",a=>{a.pop()}],["duplicate_row",a=>{a.push(a[0])}],
["changed_raw_effect",a=>{a[0].facts.receipts[1].effect="E-C"}],
["changed_target_uid",a=>{a[0].facts.id.targetUid="incarnation-other"}],
["changed_grant",a=>{a[0].facts.grant.until=10}],
["changed_negative",a=>{a[0].facts.misses.push({...a[0].facts.query,status:"MISS",effect:"E-A"})}],
["changed_watermark",a=>{a[0].facts.query.watermark=70}],
["changed_completion",a=>{a[0].facts.completion.revision=9}]];
const tamper=attacks.map(([name,edit])=>{const x=cp(full);edit(x);return{name,rejected:!check(x)}});
const hist={};for(const x of core)hist[x.reference]=(hist[x.reference]||0)+1;
const weakDisagreement=core.filter(x=>x.weak!==(x.reference==="MODEL_COMPLETE"?"COMPLETE":x.reference)).length;
const pass=referenceErrors.length===0&&unsafe.length===0&&invalidPositive.length===0&&new Set(core.map(x=>x.scenario)).size===core.length&&check(full)&&tamper.every(x=>x.rejected);
return{status:pass?"PASS_WITH_LIMITS":"FAIL",fixtures:f,decisions:core,tamper,
 receipt:{schema:"ballast-2026-11-12-recovered-reconstruction",logicalDate:"2026-11-12 Asia/Shanghai",actualExecutionUTC:new Date().toISOString(),
 originalReport:"7 authored scenarios / 5 weak-versus-reference differences, original code and raw output unavailable, NOT reproduced byte-for-byte",
 reconstructionType:"SAME_DATE_RECONSTRUCTION_OF_REPORTED_STUDY_NOT_NEW_WINDOW",
 scenarios:core.length,decisionRows:core.length*3,weakReferenceDisagreements:weakDisagreement,modelVerifierAgreements:core.length-referenceErrors.length,
 positiveControls:positive.length,negativeSafeStop:core.length-positive.length-unsafe.length,referenceHistogram:hist,
 tamperProbes:tamper.length,tamperRejected:tamper.filter(x=>x.rejected).length,
 independence:{implementation:"PARTIAL",dataSource:"NONE",semanticContract:"SHARED",authority:"NONE"},
 liveEffects:0,realAuthority:"NOT_EXECUTED",nativeNodeCLI:"NOT_EXECUTED",fullPythonChecker:"NOT_EXECUTED",
 credit:{newDaily:1,originalReportedResearchWindow:1,additionalIndependentResearchWindow:0,CASE:0,METHOD:0,NOTES:0,Special:0,durableFinding:0}}};
}

if(typeof module!=='undefined')module.exports={baseline,fixtures,reference,verifier,review};

if(typeof require!=='undefined'&&require.main===module){const x=review();console.log(JSON.stringify(process.argv.includes('--all')?x:x.receipt,null,2));if(x.status!=='PASS_WITH_LIMITS')process.exitCode=1;}

