const baseSha="7c23502945e6fea63fb208d400c380ade754d35b";
"use strict";

function verifierReconstruct(s){
 const ids=s.id,req=s.required,rec=s.receipts,q=s.prior,c=s.current,ks=["task","workflow","run","update","attempt","target"];
 const uniqueEqual=(a,b)=>Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&new Set(a).size===a.length&&b.every(x=>a.indexOf(x)>=0);
 const validInt=x=>typeof x==="number"&&Number.isSafeInteger(x)&&x>=0;
 const bound=(doc)=>ks.every(k=>doc[k]===ids[k]);
 const memberContract=s.requiredMembers;
 const protectedWitness=Array.isArray(memberContract)&&uniqueEqual(memberContract.map(x=>typeof x==="string"?x.split(":")[0]:null),req)&&[c.revision,c.guard.revision,c.readAt,c.commitAt,c.guard.evaluatedAt].every(validInt)&&c.guard.protected===true&&c.guard.target===ids.target&&c.target===ids.target&&c.revision===c.guard.revision&&c.guard.evaluatedAt===c.commitAt&&c.readAt<c.commitAt&&uniqueEqual(c.members.map(m=>`${m.id}:${m.uid}`),memberContract)&&uniqueEqual(c.guard.members,memberContract);
 const covered=q.kind==="miss"&&bound(q)&&uniqueEqual(q.effects,req)&&q.lifecycle==="ACTIVE"&&[q.watermark,q.queryAt,q.retentionUntil,q.attemptEnd].every(validInt)&&q.watermark>=q.attemptEnd&&q.queryAt>=q.watermark&&q.queryAt<=q.retentionUntil&&q.retentionUntil>=q.attemptEnd;
 if(covered&&rec.length)return "EVIDENCE_CONFLICT";
 if(rec.length===0){
  if(!covered)return "STOP_UNKNOWN";
  const allowed=s.permission.allowed===true&&bound(s.permission)&&uniqueEqual(s.permission.effects,req)&&validInt(s.permission.validUntil)&&validInt(c.commitAt)&&s.permission.validUntil>=Math.max(q.queryAt,c.commitAt)&&s.update.validator==="ACCEPTED"&&["ACCEPTED","COMPLETED"].includes(s.update.stage);
  if(!allowed)return "BLOCKED";
  return protectedWitness?"RETRY_ALLOWED":"STOP_UNKNOWN";
 }
 if(s.update.validator!=="ACCEPTED"||!["ACCEPTED","COMPLETED"].includes(s.update.stage))return "RECONCILE";
 if(!uniqueEqual(rec.map(x=>x.effect),req))return "RECONCILE";
 if(!validInt(s.update.acceptedAt)||!validInt(s.update.completedAt))return s.update.stage==="ACCEPTED"?"STOP_UNKNOWN":"RECONCILE";
 for(let r of rec){
  if(!bound(r)||!validInt(r.tick))return "RECONCILE";
  let matching=s.grants.filter(a=>a.approval===r.approval&&a.effect===r.effect&&bound(a));
  if(matching.length!==1)return "RECONCILE";
  let a=matching[0];
  if(!validInt(a.from)||!validInt(a.until)||(a.revokedAt!==null&&!validInt(a.revokedAt)))return "RECONCILE";
  if(r.tick<a.from||r.tick>a.until||(a.revokedAt!==null&&r.tick>=a.revokedAt))return "RECONCILE";
  if(r.tick<s.update.acceptedAt)return "RECONCILE";
  if(s.update.stage==="ACCEPTED")return "STOP_UNKNOWN";
  if(r.tick>s.update.completedAt)return "RECONCILE";
 }
 if(s.update.stage!=="COMPLETED")return "STOP_UNKNOWN";
 if(s.update.completedAt<s.update.acceptedAt||c.readAt<=Math.max(...rec.map(x=>x.tick)))return "RECONCILE";
 if(!protectedWitness||c.members.some(m=>m.done!==true))return "RECONCILE";
 return "COMPLETE";
}
function verifyRows(fixtures,rows){
 let errors=[],names=new Set(),validPaths=["accepted_stage_proxy","update_completed_proxy","full_reference"];
 if(rows.length!==fixtures.length*3)errors.push("row-count");
 for(let f of fixtures){
  if(names.has(f.name))errors.push("duplicate-scenario:"+f.name);names.add(f.name);
  let own=rows.filter(r=>r.scenario===f.name);
  if(own.length!==3||new Set(own.map(r=>r.path)).size!==3||!validPaths.every(p=>own.some(r=>r.path===p)))errors.push("path-coverage:"+f.name);
  let ref=verifierReconstruct(f.primitive);
  if(ref!==f.expected)errors.push("expected-control:"+f.name+":"+ref+"!="+f.expected);
  let preds={accepted_stage_proxy:["ACCEPTED","COMPLETED"].includes(f.primitive.update.stage)?"COMPLETE":"RECONCILE",update_completed_proxy:f.primitive.update.stage==="COMPLETED"?"COMPLETE":"RECONCILE",full_reference:ref};
  for(let r of own)if(preds[r.path]!==r.decision)errors.push("decision:"+f.name+":"+r.path);
 }
 return errors;
}
function runVerifier(fixtures,rows,csv){
 let errors=verifyRows(fixtures,rows);
 let csvLines=csv.trimEnd().split("\n"),header=csvLines.shift(),parsed=csvLines.map(l=>{let [scenario,path,decision]=l.split(",");return {scenario,path,decision}});
 if(header!=="scenario,path,decision"||parsed.length!==rows.length||JSON.stringify(parsed)!==JSON.stringify(rows))errors.push("csv-mismatch");
 let forged=rows.map(x=>({...x}));forged[0].decision=forged[0].decision==="COMPLETE"?"RECONCILE":"COMPLETE";
 let forgeryDetected=verifyRows(fixtures,forged).length>0;if(!forgeryDetected)errors.push("forged-row-undetected");
 let refs=rows.filter(r=>r.path==="full_reference"),negative=fixtures.filter(f=>f.expected!=="COMPLETE");
 return {status:errors.length?"FAIL":"PASS_WITH_LIMITS",errors,scenarioCount:fixtures.length,rowCount:rows.length,csvDataRows:parsed.length,referenceRowsReconstructed:refs.length,allPathsReconstructed:rows.length,negativeControls:negative.length,negativeControlsRejected:negative.filter(f=>refs.find(r=>r.scenario===f.name)?.decision===f.expected).length,forgedRowDetected:forgeryDetected,independence:{implementation:"PARTIAL_SEPARATE_FUNCTION",dataSource:"NONE_SHARED_AUTHORED_FIXTURES",semanticContract:"LIMITED_SHARED_AUTHORED_MODEL",authority:"NONE"},runtime:"V8_CODE_MODE_ISOLATE",nodeCLI:"NOT_EXECUTED",checker:"NOT_EXECUTED",liveTemporal:"NOT_EXECUTED",externalEffectSink:"NOT_EXECUTED",verifiedBaseSha:baseSha,sourceVerifiedDate:"2026-10-26"};
}
if(typeof module!=="undefined")module.exports={runVerifier};
if(typeof require==="function"&&require.main===module){const fs=require("fs"),path=require("path");const dir=path.join(__dirname,"../evidence");const fixtures=JSON.parse(fs.readFileSync(path.join(dir,"2026-10-26-update-stage-scenarios.json"),"utf8"));const csv=fs.readFileSync(path.join(dir,"2026-10-26-update-stage-decisions.csv"),"utf8");const rows=csv.trimEnd().split("\n").slice(1).map(x=>{let [scenario,path,decision]=x.split(",");return {scenario,path,decision}});const v=runVerifier(fixtures,rows,csv);fs.writeFileSync(path.join(dir,"2026-10-26-update-stage-verification.json"),JSON.stringify(v,null,2)+"\n");console.log(JSON.stringify(v));if(v.errors.length)process.exitCode=1}
