"use strict";
function base(){
 const effect=(m,id,r,t)=>({member:m,id,receipt:r,at:t,authorized:true,task:"task23",inc:"inc23"});
 return {task:"task23",inc:"inc23",required:["A","B"],revision:5,permission:true,oldAttemptEnd:50,
 claim:{cursor:"0-0",claimed:["100-0","101-0"],acked:["100-0","101-0"],deleted:[],justid:false,deliveryCount:2},
 effects:[effect("A","eA","rA",30),effect("B","eB","rB",40)],
 prior:{state:"hit",identity:"task23|inc23|B",authority:true,complete:true,watermark:60,queryAt:70,retained:true,lifecycle:"active"},
 witness:{task:"task23",inc:"inc23",members:["A","B"],revision:5,at:80,commitAt:90,protected:true}};
}
function covered(s){const q=s.prior;return q&&q.authority===true&&q.complete===true&&q.identity===s.task+"|"+s.inc+"|B"&&Number.isFinite(q.watermark)&&q.watermark>=s.oldAttemptEnd&&Number.isFinite(q.queryAt)&&q.queryAt>=q.watermark&&q.retained===true&&q.lifecycle==="active";}
function reference(s){
 const w=s.witness,q=s.prior,req=s.required;
 if(!Array.isArray(req)||!req.length||req.some(x=>typeof x!=="string"||!x)||new Set(req).size!==req.length||!Array.isArray(s.effects)||!w||!q||!s.task||!s.inc||!Number.isFinite(s.oldAttemptEnd)||!Number.isFinite(w.at)||!Number.isFinite(w.commitAt)||w.commitAt<w.at)return "RECONCILE";
 if(q.state==="miss"&&covered(s)&&s.effects.some(e=>e.member==="B"&&e.task===s.task&&e.inc===s.inc))return "EVIDENCE_CONFLICT";
 if((q.state==="hit"||q.state==="miss")&&!covered(s))return "STOP_UNKNOWN";
 const ids=new Set(),receipts=new Set(),members=new Set();
 for(const e of s.effects){
  if(!e||!req.includes(e.member)||members.has(e.member)||e.task!==s.task||e.inc!==s.inc||e.authorized!==true||e.id!=="e"+e.member||ids.has(e.id)||!e.receipt||receipts.has(e.receipt)||!Number.isFinite(e.at)||e.at<0||e.at>w.at)return "RECONCILE";
  ids.add(e.id);receipts.add(e.receipt);members.add(e.member);
 }
 if(members.size<req.length){
  if(s.permission===false)return "BLOCKED";
  if(s.permission!==true)return "STOP_UNKNOWN";
  const absent=req.filter(x=>!members.has(x));
  return absent.length===1&&absent[0]==="B"&&q.state==="miss"&&covered(s)?"RETRY_ALLOWED":"STOP_UNKNOWN";
 }
 if(w.task!==s.task||w.inc!==s.inc||w.revision!==s.revision||w.protected!==true||!Array.isArray(w.members)||w.members.length!==req.length||new Set(w.members).size!==req.length||w.members.some(m=>!req.includes(m)))return "RECONCILE";
 return "COMPLETE";
}
function build(){
 const all=[],add=(id,fn)=>{const s=base();fn(s);all.push({id,...s});};
 const missing=s=>{s.effects.pop();s.prior.state="unknown";};
 const miss=s=>{missing(s);s.prior.state="miss";};
 add("baseline",s=>{});
 add("cursor_zero_no_B",missing);
 add("trimmed_PEL_no_B",s=>{missing(s);s.claim.deleted=["101-0"];});
 add("justid_counter_no_B",s=>{missing(s);s.claim.justid=true;s.claim.deliveryCount=1;});
 add("duplicate_B",s=>{s.effects.push({...s.effects[1],id:"eB2",receipt:"rB2"});});
 add("extra_C",s=>{s.effects.push({...s.effects[1],member:"C",id:"eC",receipt:"rC"});});
 add("membership_swap",s=>{s.required=["A","C"];s.witness.members=["A","C"];});
 add("revoked_complete",s=>{s.permission=false;});
 add("revoked_missing",s=>{miss(s);s.permission=false;});
 add("covered_miss_retry",miss);
 add("stale_miss_watermark",s=>{miss(s);s.prior.watermark=10;});
 add("expired_miss_retention",s=>{miss(s);s.prior.retained=false;});
 add("positive_vs_miss",s=>{s.prior.state="miss";});
 add("wrong_incarnation",s=>{s.effects[1].inc="old";});
 add("historical_unauthorized",s=>{s.effects[1].authorized=false;});
 add("duplicate_receipt",s=>{s.effects[1].receipt="rA";});
 add("witness_stale_revision",s=>{s.witness.revision=6;});
 add("effect_after_witness",s=>{s.effects[1].at=85;});
 add("cursor_nonzero_complete",s=>{s.claim.cursor="102-0";});
 add("miss_wrong_identity",s=>{miss(s);s.prior.identity="task23|inc23|A";});
 add("duplicate_required",s=>{s.required=["A","A"];});
 add("permission_unknown_missing",s=>{miss(s);s.permission=null;});
 add("claim_deleted_but_effect_complete",s=>{s.claim.deleted=["999-0"];});
 add("witness_unprotected",s=>{s.witness.protected=false;});
 add("prior_unknown_complete",s=>{s.prior.state="unknown";});
 add("missing_receipt",s=>{s.effects[1].receipt="";});
 add("effect_after_commit",s=>{s.effects[1].at=95;});
 add("witness_membership_mismatch",s=>{s.witness.members=["A","C"];});
 add("wrong_effect_identity",s=>{s.effects[1].id="eWrong";});
 return all;
}
function run(){const scenarios=build(),rows=[];for(const s of scenarios){const c=s.claim,decisions={claim_proxy:c.cursor==="0-0"&&c.claimed.length>0&&c.claimed.every(x=>c.acked.includes(x))?"COMPLETE":"RETRY_ALLOWED",count_proxy:s.effects.length===s.required.length?"COMPLETE":"RETRY_ALLOWED",full_reference:reference(s)};for(const path of Object.keys(decisions))rows.push({scenario:s.id,path,decision:decisions[path]});}return {scenarios,rows};}
module.exports={run,reference};
