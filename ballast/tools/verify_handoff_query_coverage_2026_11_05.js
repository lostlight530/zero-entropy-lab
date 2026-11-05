// Ballast post-merge conservative synthetic query-coverage adjudicator, 2026-11-05
// Complements the original trace verifier and the merged PR #794 case-to-trace binder
function stableRows(a,b){
 if(!Array.isArray(a)||!Array.isArray(b)||a.length!==b.length)return false;
 return a.every((r,i)=>r.id===b[i].id&&r.path===b[i].path&&r.decision===b[i].decision);
}
function coverageRows(cases,oldRows){
 const rows=JSON.parse(JSON.stringify(oldRows));
 for(const c of cases){
  const scope=c?.state?.query?.lastEnd,time=c?.state?.commit?.at;
  const valid=x=>typeof x==="number"&&Number.isSafeInteger(x)&&x>=0;
  if(!valid(scope)||!valid(time)||scope<time){
   const row=rows.find(x=>x.id===c.id&&x.path==="reference");
   if(row&&["COMPLETE","RETRY_ALLOWED","RETRY_REQUIRES_NEW_FENCE"].includes(row.decision))row.decision="STOP_UNKNOWN";
  }
 }
 return rows;
}
function verifyQueryCoverage(cases,traces,oldRows,correctedRows,originalVerifier,bindingVerifier){
 const errors=[];
 if(typeof originalVerifier!=="function"||typeof bindingVerifier!=="function")return {pass:false,errors:["required verifier unavailable"]};
 const o=originalVerifier(cases,traces,oldRows),b=bindingVerifier(cases,traces);
 if(!o.pass)errors.push("original trace-decision verification failed");
 if(!b.pass)errors.push("case-to-trace binding verification failed");
 if(!stableRows(coverageRows(cases,oldRows),correctedRows))errors.push("query-scope correction mismatch");
 if(!Array.isArray(cases)||!Array.isArray(traces)||!Array.isArray(oldRows)||!Array.isArray(correctedRows))errors.push("invalid container");
 const changes=Array.isArray(oldRows)&&Array.isArray(cases)?coverageRows(cases,oldRows).filter((r,i)=>r.decision!==oldRows[i]?.decision).map(r=>({id:r.id,path:r.path,old:oldRows.find(x=>x.id===r.id&&x.path===r.path)?.decision,corrected:r.decision})):[];
 return {pass:errors.length===0,errors,scenarios:cases?.length||0,traces:traces?.length||0,events:traces?.reduce((a,t)=>a+(t.events?.length||0),0)||0,decisionCount:correctedRows?.length||0,changes,independence:{implementation:"PARTIAL",dataSource:"SHARED",semanticContract:"SHARED",authority:"NONE"}};
}
if(typeof module!=="undefined")module.exports={coverageRows,verifyQueryCoverage,stableRows};
