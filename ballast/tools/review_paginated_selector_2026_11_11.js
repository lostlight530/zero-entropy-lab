'use strict';

// Bounded maintainer model review, does not authenticate external effects

// Run: node ballast/tools/review_paginated_selector_2026_11_11.js

function baseline(){
 const ident={task:"t11",run:"r11",attempt:"a11",selector:"s11"};
 const required=[{name:"A",uid:"a1",effect:"eA"},{name:"B",uid:"b1",effect:"eB"}];
 const page=(index,members,tokenIn,tokenOut)=>({index,status:200,collectionRV:10,selector:"s11",queryHash:"q11",tokenIn,tokenOut,members});
 const receipt=(x,at)=>({...ident,receiptId:"rc-"+x.effect,effect:x.effect,name:x.name,uid:x.uid,at,issuer:"issuer11"});
 return {ident,required,startedAt:10,pages:[page(0,[{name:"A",uid:"a1"}],null,"token0"),page(1,[{name:"B",uid:"b1"}],"token0",null)],
  receipts:required.map((x,i)=>receipt(x,40+i*5)),misses:[],currentPermission:true,
  query:{...ident,ok:true,exact:true,at:90,watermark:90,retentionFrom:0,retentionUntil:100},
  grant:{issuer:"issuer11",task:"t11",from:20,until:65,proven:true,effects:["eA","eB"]},
  completion:{guarded:true,predicate:true,selector:"s11",observedRV:10,commitRV:10,at:80,targetUIDs:["a1","b1"],effectIDs:["eA","eB"]}};
}

function specimens(){
 const c=x=>JSON.parse(JSON.stringify(x));
 const edits=[
 ["baseline",f=>{}],["permission_revoked_later",f=>{f.currentPermission=false}],
 ["expired_410",f=>{f.pages[1].status=410}],["mixed_RV",f=>{f.pages[1].collectionRV=11}],
 ["expired_token_reused",f=>{f.pages[1].tokenIn="expired"}],["selector_drift",f=>{f.pages[1].selector="s2"}],
 ["query_fingerprint_drift",f=>{f.pages[1].queryHash="q2"}],["same_count_A_C",f=>{f.pages[1].members=[{name:"C",uid:"c1"}]}],
 ["reincarnated_B",f=>{f.pages[1].members[0].uid="b2"}],
 ["duplicate_page_A",f=>{f.pages[1].members=[{name:"A",uid:"a1"}]}],
 ["extra_page_C",f=>{f.pages[1].members.push({name:"C",uid:"c1"})}],
 ["missing_page_B",f=>{f.pages[1].members=[]}],["extra_third_page",f=>{const p=c(f.pages[1]);p.index=2;f.pages.push(p)}],
 ["page_wrong_index",f=>{f.pages[0].index=2}],["page_missing_RV",f=>{delete f.pages[0].collectionRV}],
 ["page_RV_string",f=>{f.pages[1].collectionRV="10"}],
 ["page_member_wrong_type",f=>{f.pages[1].members[0].uid={value:"b1"}}],
 ["duplicate_receipt_A",f=>{f.receipts.push(c(f.receipts[0]))}],
 ["duplicate_receipt_ID",f=>{f.receipts[1].receiptId=f.receipts[0].receiptId}],
 ["receipt_A_C_equal_count",f=>{f.receipts[1].effect="eC"}],
 ["receipt_extra_C",f=>{f.receipts.push({...c(f.receipts[0]),receiptId:"rc-c",effect:"eC",name:"C",uid:"c1"})}],
 ["missing_receipt_B",f=>{f.receipts.pop()}],
 ["receipt_wrong_uid",f=>{f.receipts[1].uid="b2"}],["receipt_wrong_run",f=>{f.receipts[1].run="rX"}],
 ["receipt_wrong_attempt",f=>{f.receipts[1].attempt="aX"}],
 ["receipt_wrong_target_selector",f=>{f.receipts[1].selector="sX"}],
 ["receipt_fake_issuer",f=>{f.receipts[0].issuer="fake"}],
 ["effect_after_completion",f=>{f.receipts[1].at=100}],
 ["grant_expired",f=>{f.grant.until=41}],["grant_unproved",f=>{f.grant.proven=false}],
 ["grant_missing_effect_B",f=>{f.grant.effects=["eA"]}],
 ["positive_negative_conflict",f=>{f.misses.push({...f.query,effect:"eA",status:"MISS"})}],
 ["uncovered_negative",f=>{f.misses.push({...f.query,effect:"eA",status:"MISS",exact:false})}],
 ["query_unavailable",f=>{f.query.ok=false}],["query_wrong_attempt",f=>{f.query.attempt="a2"}],
 ["query_watermark_stale",f=>{f.query.watermark=79}],
 ["query_before_commit",f=>{f.query.at=79}],
 ["retention_missing_attempt",f=>{f.query.retentionFrom=11}],
 ["retention_expired",f=>{f.query.retentionUntil=89}],
 ["completion_revision_drift",f=>{f.completion.commitRV=11}],
 ["completion_guard_false",f=>{f.completion.guarded=false}],
 ["completion_predicate_false",f=>{f.completion.predicate=false}],
 ["completion_wrong_selector",f=>{f.completion.selector="sX"}],
 ["completion_missing_member_guard",f=>{f.completion.targetUIDs=["a1"]}],
 ["completion_extra_effect_guard",f=>{f.completion.effectIDs=["eA","eB","eC"]}],
 ["commit_time_missing",f=>{delete f.completion.at}],
 ["current_permission_bad_type",f=>{f.currentPermission="true"}],
 ["duplicate_expected_member",f=>{f.required[1]=c(f.required[0])}],
 ["duplicate_member_within_page",f=>{f.pages[0].members.push(c(f.pages[0].members[0]))}]
 ];
 return edits.map(([id,mutate])=>{const facts=baseline();mutate(facts);return {id,facts}});
}

function reference(f){
 const i=f.ident, req=f.required, pp=f.pages, rr=f.receipts, ms=f.misses, q=f.query, g=f.grant, c=f.completion;
 if(!i||!q||!g||!c||!Array.isArray(pp)||!Array.isArray(req)||!Array.isArray(rr)||!Array.isArray(ms)||pp.length!==2||req.length!==2||typeof f.currentPermission!=="boolean"||!Number.isFinite(f.startedAt))return "STOP_UNKNOWN";
 const keys=["task","run","attempt","selector"];
 if(keys.some(k=>typeof i[k]!=="string"||!i[k]))return "STOP_UNKNOWN";
 const eq=x=>x&&keys.every(k=>x[k]===i[k]);
 if(req.some(x=>!x||["name","uid","effect"].some(k=>typeof x[k]!=="string"||!x[k])))return "STOP_UNKNOWN";
 for(const key of ["name","uid","effect"])if(new Set(req.map(x=>x[key])).size!==2)return "STOP_UNKNOWN";
 if(!eq(q)||q.ok!==true||q.exact!==true||![q.at,q.watermark,q.retentionFrom,q.retentionUntil,c.at].every(Number.isFinite)||q.at<c.at||q.watermark<c.at||q.retentionFrom>f.startedAt||q.retentionUntil<q.at)return "STOP_UNKNOWN";
 for(const n of ms){
  if(!eq(n)||n.status!=="MISS"||n.ok!==true||n.exact!==true||!req.some(x=>x.effect===n.effect)||![n.at,n.watermark,n.retentionFrom,n.retentionUntil].every(Number.isFinite)||n.watermark<c.at||n.retentionFrom>f.startedAt||n.retentionUntil<n.at)return "STOP_UNKNOWN";
  if(rr.some(r=>r.effect===n.effect&&eq(r)))return "EVIDENCE_CONFLICT";
 }
 for(let k=0;k<2;k++){
  const p=pp[k];if(!p||p.index!==k||p.status!==200||p.collectionRV!==10||p.selector!==i.selector||p.queryHash!=="q11"||!Array.isArray(p.members))return "STOP_UNKNOWN";
 }
 if(pp[0].tokenIn!==null||pp[0].tokenOut!=="token0"||pp[1].tokenIn!=="token0"||pp[1].tokenOut!==null)return "STOP_UNKNOWN";
 const all=pp.flatMap(p=>p.members);
 if(all.length!==2||all.some(m=>!m||typeof m.name!=="string"||typeof m.uid!=="string")||new Set(all.map(m=>m.name)).size!==2||new Set(all.map(m=>m.uid)).size!==2||all.some(m=>!req.some(x=>x.name===m.name&&x.uid===m.uid)))return "MEMBERSHIP_MISMATCH";
 if(rr.some(r=>!r||!eq(r)||typeof r.receiptId!=="string"||!r.receiptId||typeof r.effect!=="string"||typeof r.issuer!=="string"||!r.issuer||!Number.isFinite(r.at)))return "STOP_UNKNOWN";
 if(rr.length!==2||new Set(rr.map(r=>r.receiptId)).size!==2||new Set(rr.map(r=>r.effect)).size!==2||rr.some(r=>!req.some(x=>x.name===r.name&&x.uid===r.uid&&x.effect===r.effect)))return "EFFECT_SET_MISMATCH";
 if(g.proven!==true||g.task!==i.task||g.issuer!=="issuer11"||!Array.isArray(g.effects)||new Set(g.effects).size!==g.effects.length||![g.from,g.until].every(Number.isFinite))return "STOP_UNKNOWN";
 if(rr.some(r=>r.issuer!==g.issuer||r.at<g.from||r.at>g.until||!g.effects.includes(r.effect)))return "UNAUTHORIZED_OCCURRENCE";
 if(c.guarded!==true||c.predicate!==true||c.selector!==i.selector||c.observedRV!==10||c.commitRV!==10||JSON.stringify(c.targetUIDs)!==JSON.stringify(req.map(x=>x.uid))||JSON.stringify(c.effectIDs)!==JSON.stringify(req.map(x=>x.effect))||rr.some(r=>r.at>c.at))return "STOP_UNKNOWN";
 return "MODEL_COMPLETE";
}

function verifier(f){
 const i=f.ident, req=f.required, pp=f.pages, rr=f.receipts, ms=f.misses, q=f.query,g=f.grant,c=f.completion;
 if(!i||!q||!g||!c||!Array.isArray(req)||req.length!==2||!Array.isArray(pp)||pp.length!==2||!Array.isArray(rr)||!Array.isArray(ms)||typeof f.currentPermission!=="boolean"||!Number.isFinite(f.startedAt))return "STOP_UNKNOWN";
 if(["task","run","attempt","selector"].some(k=>typeof i[k]!=="string"||i[k].length===0))return "STOP_UNKNOWN";
 const same=x=>x&&x.task===i.task&&x.run===i.run&&x.attempt===i.attempt&&x.selector===i.selector;
 const targetMap=new Map(),uidSeen=new Set(),requiredEffects=new Set();
 for(const t of req){
  if(!t||typeof t.name!=="string"||!t.name||typeof t.uid!=="string"||!t.uid||typeof t.effect!=="string"||!t.effect||targetMap.has(t.name)||uidSeen.has(t.uid)||requiredEffects.has(t.effect))return "STOP_UNKNOWN";
  targetMap.set(t.name,t);uidSeen.add(t.uid);requiredEffects.add(t.effect);
 }
 if(!same(q)||q.ok!==true||q.exact!==true||[q.at,q.watermark,q.retentionFrom,q.retentionUntil,c.at].some(x=>!Number.isFinite(x))||q.at<c.at||q.watermark<c.at||q.retentionFrom>f.startedAt||q.retentionUntil<q.at)return "STOP_UNKNOWN";
 for(const n of ms){
  if(!same(n)||n.status!=="MISS"||n.ok!==true||n.exact!==true||!requiredEffects.has(n.effect)||[n.at,n.watermark,n.retentionFrom,n.retentionUntil].some(x=>!Number.isFinite(x))||n.watermark<c.at||n.retentionFrom>f.startedAt||n.retentionUntil<n.at)return "STOP_UNKNOWN";
  for(const receipt of rr)if(receipt.effect===n.effect&&same(receipt))return "EVIDENCE_CONFLICT";
 }
 const list=[],seen=new Set(),seenUID=new Set();
 for(let x=0;x<2;x++){
  const p=pp[x];if(!p||p.index!==x||p.status!==200||p.collectionRV!==10||p.selector!==i.selector||p.queryHash!=="q11"||!Array.isArray(p.members))return "STOP_UNKNOWN";
  if(x===0&&(p.tokenIn!==null||p.tokenOut!=="token0"))return "STOP_UNKNOWN";
  if(x===1&&(p.tokenIn!=="token0"||p.tokenOut!==null))return "STOP_UNKNOWN";
  list.push(...p.members);
 }
 if(list.length!==2)return "MEMBERSHIP_MISMATCH";
 for(const m of list){
  if(!m||typeof m.name!=="string"||typeof m.uid!=="string"||!targetMap.has(m.name)||targetMap.get(m.name).uid!==m.uid||seen.has(m.name)||seenUID.has(m.uid))return "MEMBERSHIP_MISMATCH";
  seen.add(m.name);seenUID.add(m.uid);
 }
 const recIds=new Set(),effectIds=new Set();
 for(const r of rr){
  if(!same(r)||typeof r.receiptId!=="string"||!r.receiptId||typeof r.effect!=="string"||typeof r.issuer!=="string"||!r.issuer||!Number.isFinite(r.at))return "STOP_UNKNOWN";
  const target=targetMap.get(r.name);if(recIds.has(r.receiptId)||effectIds.has(r.effect)||!target||target.uid!==r.uid||target.effect!==r.effect)return "EFFECT_SET_MISMATCH";
  recIds.add(r.receiptId);effectIds.add(r.effect);
 }
 if(recIds.size!==req.length)return "EFFECT_SET_MISMATCH";
 if(g.proven!==true||g.issuer!=="issuer11"||g.task!==i.task||!Array.isArray(g.effects)||new Set(g.effects).size!==g.effects.length||[g.from,g.until].some(x=>!Number.isFinite(x)))return "STOP_UNKNOWN";
 if(rr.some(r=>r.issuer!==g.issuer||r.at<g.from||r.at>g.until||!g.effects.includes(r.effect)))return "UNAUTHORIZED_OCCURRENCE";
 if(c.guarded!==true||c.predicate!==true||c.selector!==i.selector||c.observedRV!==10||c.commitRV!==10||!Array.isArray(c.targetUIDs)||!Array.isArray(c.effectIDs)||c.targetUIDs.length!==2||c.effectIDs.length!==2||c.targetUIDs.some((u,x)=>u!==req[x].uid)||c.effectIDs.some((u,x)=>u!==req[x].effect)||rr.some(r=>r.at>c.at))return "STOP_UNKNOWN";
 return "MODEL_COMPLETE";
}

function review(){
 const clone=x=>JSON.parse(JSON.stringify(x)), entries=specimens();
 const rows=entries.map(({id,facts})=>({id,facts,weak:facts.pages.flatMap(p=>p.members).length>=2?"COMPLETE":"STOP",reference:reference(facts),verifier:verifier(facts)}));
 const ids=new Set(rows.map(x=>x.id));
 const positive=["baseline","permission_revoked_later"];
 const mismatches=rows.filter(x=>x.reference!==x.verifier).map(x=>x.id);
 const unsafe=rows.filter(x=>!positive.includes(x.id)&&x.reference==="MODEL_COMPLETE").map(x=>x.id);
 const missedPositive=rows.filter(x=>positive.includes(x.id)&&x.reference!=="MODEL_COMPLETE").map(x=>x.id);
 const validate=all=>all.length===rows.length&&new Set(all.map(x=>x.id)).size===rows.length&&all.every(x=>ids.has(x.id)&&x.reference===reference(x.facts)&&x.verifier===verifier(x.facts)&&x.reference===x.verifier&&x.weak===(x.facts.pages.flatMap(p=>p.members).length>=2?"COMPLETE":"STOP"));
 const probes=[
 ["forged_reference",a=>{a[0].reference="FORGED"}],
 ["forged_verifier",a=>{a[0].verifier="FORGED"}],
 ["missing_case",a=>{a.pop()}],
 ["duplicate_case",a=>{a.push(clone(a[0]))}],
 ["unknown_case",a=>{a[0].id="ghost"}],
 ["changed_page_RV",a=>{a[0].facts.pages[1].collectionRV=11}],
 ["changed_page_member",a=>{a[0].facts.pages[1].members[0].uid="b2"}],
 ["changed_page_token",a=>{a[0].facts.pages[1].tokenIn="expired"}],
 ["duplicate_receipt",a=>{a[0].facts.receipts.push(clone(a[0].facts.receipts[0]))}],
 ["duplicate_receipt_ID",a=>{a[0].facts.receipts[1].receiptId=a[0].facts.receipts[0].receiptId}],
 ["receipt_issuer_forgery",a=>{a[0].facts.receipts[0].issuer="forged"}],
 ["grant_expired",a=>{a[0].facts.grant.until=1}],
 ["contradictory_MISS",a=>{a[0].facts.misses.push({...a[0].facts.query,status:"MISS",effect:"eA"})}],
 ["query_identity_drift",a=>{a[0].facts.query.attempt="new"}],
 ["query_watermark_stale",a=>{a[0].facts.query.watermark=1}],
 ["guard_removed",a=>{a[0].facts.completion.guarded=false}],
 ["completion_RV_drift",a=>{a[0].facts.completion.commitRV=11}],
 ["permission_type_mutation",a=>{a[0].facts.currentPermission="true"}]
 ];
 const tamper=probes.map(([id,modify])=>{const a=clone(rows);modify(a);return {id,rejected:!validate(a)}});
 const histogram={};for(const x of rows)histogram[x.reference]=(histogram[x.reference]||0)+1;
 const status=validate(rows)&&!mismatches.length&&!unsafe.length&&!missedPositive.length&&tamper.every(x=>x.rejected)?"PASS_WITH_LIMITS":"FAIL";
 return {schema:"ballast-selector-2026-11-11-maintainer-synthetic",receipt:{
  status,executionUTC:new Date().toISOString(),logicalDate:"2026-11-11 Asia/Shanghai",
  originalResearch:"9 original scenarios / 27 decisions / 8 weak-reference disagreements, immutable",
  referenceHead:"9e6b8f2e5fd48565ce989aef566dcf4dd4aab2b9",
  syntheticScenarios:rows.length,syntheticDecisions:rows.length*3,
  referenceHistogram:histogram,weakReferenceDisagreements:rows.filter(x=>x.reference!==(x.weak==="COMPLETE"?"MODEL_COMPLETE":"STOP")).length,
  verifierAgreements:rows.length-mismatches.length,negativeUnsafeAccepts:unsafe,positiveControlFailures:missedPositive,
  tamperProbes:tamper.length,tamperRejected:tamper.filter(x=>x.rejected).length,
  initialReviewFailure:"Earlier isolated V8 review had 17/18 tamper rejects, forged verifier label accepted by ledger; this implementation checks stored verifier labels",
  externalEffects:0,implementationIndependence:"PARTIAL",dataSourceIndependence:"NONE",semanticContractIndependence:"SHARED",authorityIndependence:"NONE",
  nativeNodeCLI:"NOT_EXECUTED",fullPythonChecker:"NOT_EXECUTED",liveKubernetes:"NOT_EXECUTED",liveEtcd:"NOT_EXECUTED",externalSink:"NOT_EXECUTED",
  additionalCredit:{Daily:0,ResearchWindow:0,CASE:0,METHOD:0,NOTES:0,Audit:0,Special:0,Finding:0}},
  rows,tamper};
}

if(typeof module!=='undefined')module.exports={baseline,specimens,reference,verifier,review};

if(typeof require!=='undefined'&&require.main===module){const result=review();console.log(JSON.stringify(process.argv.includes('--all')?result:result.receipt,null,2));if(result.receipt.status!=='PASS_WITH_LIMITS')process.exitCode=1;}

