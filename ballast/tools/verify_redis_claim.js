"use strict";
function reconstruct(s){
 const r=s.required,w=s.witness,q=s.prior;
 if(!Array.isArray(r)||!r.length||r.some(x=>!x||typeof x!=="string")||new Set(r).size!==r.length||!Array.isArray(s.effects)||!q||!w||!s.task||!s.inc||![s.oldAttemptEnd,w.at,w.commitAt].every(Number.isFinite)||w.at>w.commitAt)return "RECONCILE";
 const scoped=q.identity===s.task+"|"+s.inc+"|B"&&q.authority===true&&q.complete===true&&Number.isFinite(q.watermark)&&q.watermark>=s.oldAttemptEnd&&Number.isFinite(q.queryAt)&&q.queryAt>=q.watermark&&q.retained===true&&q.lifecycle==="active";
 if(q.state==="miss"&&scoped&&s.effects.some(e=>e.member==="B"&&e.task===s.task&&e.inc===s.inc))return "EVIDENCE_CONFLICT";
 if(["miss","hit"].includes(q.state)&&!scoped)return "STOP_UNKNOWN";
 const ids=[],receipts=[],members=[];
 for(const e of s.effects){
  if(!e||!r.includes(e.member)||e.task!==s.task||e.inc!==s.inc||e.authorized!==true||e.id!=="e"+e.member||!e.receipt||!Number.isFinite(e.at)||e.at<0||e.at>w.at)return "RECONCILE";
  ids.push(e.id);receipts.push(e.receipt);members.push(e.member);
 }
 if([ids,receipts,members].some(a=>new Set(a).size!==a.length))return "RECONCILE";
 const missing=r.filter(x=>!members.includes(x));
 if(missing.length){
  if(s.permission===false)return "BLOCKED";
  if(s.permission!==true)return "STOP_UNKNOWN";
  return missing.length===1&&missing[0]==="B"&&q.state==="miss"&&scoped?"RETRY_ALLOWED":"STOP_UNKNOWN";
 }
 if(w.task!==s.task||w.inc!==s.inc||w.revision!==s.revision||w.protected!==true||!Array.isArray(w.members)||w.members.length!==r.length||new Set(w.members).size!==r.length||r.some(x=>!w.members.includes(x)))return "RECONCILE";
 return "COMPLETE";
}
function verify(scenarios,rows){
 const errors=[],seen=new Set(),hist={},diff={claim_proxy:0,count_proxy:0};
 for(const s of scenarios){
  if(seen.has(s.id))errors.push("duplicate scenario "+s.id);seen.add(s.id);
  const truth=reconstruct(s);hist[truth]=(hist[truth]||0)+1;
  const c=s.claim,claim=c.cursor==="0-0"&&c.claimed.length>0&&c.claimed.every(x=>c.acked.includes(x))?"COMPLETE":"RETRY_ALLOWED";
  const count=s.effects.length===s.required.length?"COMPLETE":"RETRY_ALLOWED";
  for(const [path,decision] of Object.entries({claim_proxy:claim,count_proxy:count,full_reference:truth})){
   const match=rows.filter(x=>x.scenario===s.id&&x.path===path);
   if(match.length!==1||match[0].decision!==decision)errors.push("row mismatch "+s.id+" "+path);
  }
  if(claim!==truth)diff.claim_proxy++;if(count!==truth)diff.count_proxy++;
 }
 if(rows.length!==scenarios.length*3)errors.push("row count mismatch");
 return {ok:errors.length===0,errors,scenarios:scenarios.length,rows:rows.length,histogram:hist,model_relative_disagreements:diff};
}
module.exports={verify,reconstruct};
