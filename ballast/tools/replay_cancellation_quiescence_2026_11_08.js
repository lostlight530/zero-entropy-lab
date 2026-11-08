'use strict';
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');
const assert = require('node:assert/strict');
const dir = path.join(__dirname, '..', 'evidence');
const bundle = JSON.parse(fs.readFileSync(path.join(dir, '2026-11-08-cancellation-quiescence-evidence-bundle.json'), 'utf8'));
const archived = JSON.parse(zlib.gunzipSync(Buffer.from(bundle.payload, 'base64')).toString('utf8'));
const cases = archived.cases;
const expected = ['child-A', 'child-B'];
const effectIds = { 'child-A': 'effect-A', 'child-B': 'effect-B' };
const key = e => [e.taskId,e.runId,e.attemptId,e.targetUid,e.childId,e.effectId].join('|');
function toEvents(c) {
  const out=[]; const push=(type,at,data)=>out.push({seq:out.length+1,type,at,...data});
  push('INTENT',c.attemptStartedAt,{taskId:c.taskId,runId:c.runId,attemptId:c.attemptId,targetUid:c.targetUid,expectedChildren:c.expectedChildren,effectIds,attemptStartedAt:c.attemptStartedAt});
  push('CANCEL_REQUESTED',c.cancelAt,{taskId:c.taskId,runId:c.runId,attemptId:c.attemptId});
  push('PARENT_STATE',c.parentStateAt??c.cancelAt,{taskId:c.taskId,runId:c.runId,state:c.parentState});
  for(const r of c.revocations) push('AUTHORITY_REVOKED',r.effectiveAt,r);
  for(const ch of c.children) push('CHILD_STATE',ch.quiescedAt??c.parentStateAt??c.cancelAt,{...ch,attemptId:c.attemptId});
  for(const r of c.inFlight) push('INFLIGHT_REQUEST',r.at,{...r,attemptId:c.attemptId});
  if(c.sinkFence) push('SINK_FENCE',c.sinkFence.appliedAt,{...c.sinkFence});
  if(c.attemptClosedAt!==null&&c.attemptClosedAt!==undefined) push('ATTEMPT_CLOSED',c.attemptClosedAt,{attemptId:c.attemptId});
  for(const e of c.effects) push('SINK_EFFECT',e.commitAt,{taskId:c.taskId,runId:c.runId,attemptId:c.attemptId,targetUid:c.targetUid,childId:e.childId,effectId:e.effectId,grantState:e.grantState,authorityId:e.authorityId??null,subject:e.subject??null});
  for(const q of c.queries) push('RECEIPT_QUERY',q.queryAt,{taskId:c.taskId,runId:c.runId,attemptId:c.attemptId,targetUid:c.targetUid,childId:q.childId,effectId:q.effectId,status:q.status,watermark:q.watermark,retentionFrom:q.retentionFrom,retentionUntil:q.retentionUntil,exactIdentity:q.exactIdentity,coversAttempt:q.coversAttempt,commitAt:q.commitAt??null,grantState:q.grantState??null});
  return out;
}
function fenceFor(events,intent) {
  const f=events.find(e=>e.type==='SINK_FENCE');
  return !!f&&f.attemptId===intent.attemptId&&f.enforcement==='SINK_COMMIT_CHECK'&&Array.isArray(f.coveredChildren)&&intent.expectedChildren.every(x=>f.coveredChildren.includes(x));
}
function reference(events) {
  const i=events.find(e=>e.type==='INTENT'),p=events.find(e=>e.type==='PARENT_STATE');
  if(!i||!p) return 'STOP_UNKNOWN';
  const qs=events.filter(e=>e.type==='RECEIPT_QUERY'), es=events.filter(e=>e.type==='SINK_EFFECT'), auth=[];
  for(const e of es){const same=qs.filter(q=>key(q)===key(e));if(same.some(q=>q.status==='MISS'))return 'EVIDENCE_CONFLICT';if(!same.some(q=>q.status==='HIT'&&q.exactIdentity&&q.coversAttempt))return 'STOP_UNKNOWN';const revoked=events.some(x=>x.type==='AUTHORITY_REVOKED'&&x.authorityId===e.authorityId&&x.subject===e.subject&&x.at<=e.at);auth.push(e.grantState==='INVALID'||revoked?'INVALID':e.grantState!=='VALID'||!e.authorityId?'UNKNOWN':'VALID');}
  if(auth.includes('INVALID'))return 'UNAUTHORIZED_OCCURRENCE';if(auth.includes('UNKNOWN'))return 'OCCURRENCE_AUTH_UNKNOWN';if(es.length)return 'OCCURRED_RECONCILE';
  if(qs.some(q=>q.status==='HIT'&&q.exactIdentity&&q.coversAttempt))return 'OCCURRENCE_AUTH_UNKNOWN';
  if(p.state!=='TERMINATED'&&p.state!=='CANCELLED')return 'CANCEL_PENDING';
  const children=events.filter(e=>e.type==='CHILD_STATE'),ids=children.map(e=>e.childId),unique=new Set(ids);
  if(ids.length!==i.expectedChildren.length||unique.size!==ids.length||i.expectedChildren.some(x=>!unique.has(x)))return 'STOP_UNKNOWN';
  const quiet=children.every(e=>e.state==='QUIESCENT'&&Number.isFinite(e.at)),fence=fenceFor(events,i),pending=events.filter(e=>e.type==='INFLIGHT_REQUEST'&&e.status==='PENDING');
  if(!quiet&&!fence)return 'STOP_UNKNOWN';if(pending.length&&!fence)return 'STOP_UNKNOWN';if(!quiet&&fence)return 'FENCED_NOT_QUIESCENT';
  const closed=events.find(e=>e.type==='ATTEMPT_CLOSED'),required=i.expectedChildren.map(id=>qs.find(q=>q.childId===id&&q.effectId===i.effectIds[id]));
  if(!required.every(Boolean))return 'STOP_UNKNOWN';
  const lower=Math.max(closed?.at??Infinity,fence?events.find(e=>e.type==='SINK_FENCE').at:0);
  const covered=required.every(q=>q.status==='MISS'&&q.exactIdentity===true&&q.coversAttempt===true&&Number.isFinite(q.watermark)&&q.watermark>=lower&&Number.isFinite(q.retentionFrom)&&q.retentionFrom<=i.attemptStartedAt&&Number.isFinite(q.retentionUntil)&&q.retentionUntil>=q.at);
  if(!covered)return 'STOP_UNKNOWN';if(!closed||pending.length)return 'STOP_UNKNOWN';return 'CANCELLED_NO_EFFECT';
}
const traces=cases.map(c=>({scenarioId:c.scenarioId,events:toEvents(c)}));
assert.deepStrictEqual(traces,archived.traces,'replayed primitive traces differ from archived raw trace set');
const decisions=traces.map(t=>{const p=t.events.find(e=>e.type==='PARENT_STATE');return {scenarioId:t.scenarioId,weakDecision:p&&(p.state==='TERMINATED'||p.state==='CANCELLED')?'CANCELLED_NO_EFFECT':'CANCEL_PENDING',producerReference:reference(t.events)};});
assert.deepStrictEqual(decisions,archived.producer_decisions,'replayed producer decisions differ from archived output');
for(const [name,value] of Object.entries({
 '2026-11-08-cancellation-quiescence-cases.json':cases,
 '2026-11-08-cancellation-quiescence-traces.json':traces,
 '2026-11-08-cancellation-quiescence-producer-decisions.json':decisions,
}))fs.writeFileSync(path.join(dir,name),JSON.stringify(value,null,2)+'\n');
const histogram={};for(const d of decisions)histogram[d.producerReference]=(histogram[d.producerReference]||0)+1;
const receipt={scenarioCount:cases.length,traceCount:traces.length,primitiveEventCount:traces.reduce((n,t)=>n+t.events.length,0),decisionCount:decisions.length*2,referenceHistogram:histogram,weakReferenceDisagreements:decisions.filter(d=>d.weakDecision!==d.producerReference).length,runtime:process.versions.node,executionStartedAt:new Date().toISOString(),executionEnvironment:'local Node.js CLI, synthetic fixture replay only',realExternalEffects:0,command:'node ballast/tools/replay_cancellation_quiescence_2026_11_08.js',archiveSha256:bundle.uncompressed_sha256};
fs.writeFileSync(path.join(dir,'2026-11-08-cancellation-quiescence-producer-run.json'),JSON.stringify(receipt,null,2)+'\n');
process.stdout.write(JSON.stringify(receipt,null,2)+'\n');
