"use strict";
/** Reviewed fixture-replay producer, NOT the lost original scenario generator or live Temporal */
const fs = require("node:fs");
function decision(s) {
 const accepted=s.effects.filter(e=>e.accepted===true), p=s.prior, w=s.witness, a=s.attempt;
 const exact = p.scope==="exact_task_target_member"&&p.authority==="modeled_sink_journal"&&p.retention===true&&p.lifecycle===true&&p.journalComplete===true&&Number.isFinite(p.watermark)&&Number.isFinite(p.queriedAt)&&Number.isFinite(a.started)&&p.watermark>=a.started&&p.queriedAt>=p.watermark;
 const match=accepted.some(e=>e.effectId===p.effectId);
 if(exact&&((p.status==="hit"&&!match)||(p.status==="miss"&&match)))return "EVIDENCE_CONFLICT";
 if(!Array.isArray(s.required)||s.required.length===0||new Set(s.required).size!==s.required.length)return "RECONCILE";
 if(!Array.isArray(w.members)||w.protected!==true||w.revision!==s.currentRevision||w.members.length!==s.required.length||new Set(w.members).size!==w.members.length||w.members.some(m=>!s.required.includes(m))||!Number.isFinite(w.observed)||!Number.isFinite(w.commit)||w.observed>w.commit)return "RECONCILE";
 const events=new Set(),receipts=new Set(),count=new Map();
 for(const e of accepted) {
  if(events.has(e.eventId)||receipts.has(e.receiptId))return "RECONCILE";
  events.add(e.eventId);receipts.add(e.receiptId);
  if(e.authorized!==true||e.task!==s.task||e.target!==s.target||e.effectId!==[s.workflow,s.task,s.target,e.member].join("|")||!s.required.includes(e.member)||!Number.isFinite(e.at)||e.at<a.started||e.at>w.observed)return "RECONCILE";
  count.set(e.member,(count.get(e.member)||0)+1);
 }
 if([...count.values()].some(n=>n!==1))return "RECONCILE";
 if(s.required.every(m=>count.get(m)===1))return "COMPLETE";
 if(s.permission===false)return "BLOCKED";
 if(s.permission!==true)return "STOP_UNKNOWN";
 const missing=s.required.filter(m=>!count.has(m));
 if(missing.length===1&&p.status==="miss"&&exact&&p.effectId===[s.workflow,s.task,s.target,missing[0]].join("|"))return "RETRY_ALLOWED";
 return "STOP_UNKNOWN";
}
function produce(data) {
 if(data.logicalDate!=="2026-10-22"||!Array.isArray(data.scenarios))throw Error("fixture contract");
 const seen=new Set(),rows=[["scenario","path","decision"]],counts={},dis={token_proxy:0,count_proxy:0},events={accepted:0,total:0};
 for(const s of data.scenarios) {
  if(typeof s.id!=="string"||seen.has(s.id))throw Error("duplicate/invalid scenario id");seen.add(s.id);
  const t=s.token.status==="ACKED"?"COMPLETE":"RETRY_ALLOWED";
  const c=s.effects.filter(e=>e.accepted===true).length===s.required.length?"COMPLETE":"RETRY_ALLOWED";
  const r=decision(s);
  rows.push([s.id,"token_proxy",t],[s.id,"count_proxy",c],[s.id,"full_reference",r]);
  counts[r]=(counts[r]||0)+1;dis.token_proxy+=Number(t!==r);dis.count_proxy+=Number(c!==r);
  events.total+=s.effects.length;events.accepted+=s.effects.filter(e=>e.accepted===true).length;
 }
 return {csv:rows.map(r=>r.join(",")).join("\n")+"\n",summary:{status:"PASS_WITH_LIMITS",scenarios:seen.size,decision_rows:rows.length-1,events,reference_counts:counts,model_relative_disagreements:dis,source:"fixture replay, source reconstructed after original observation",external_effects:0}};
}
module.exports={decision,produce};
if(require.main===module) {
 const [input,csvout,summaryout]=process.argv.slice(2);
 if(!input)throw Error("usage: node experiment_async_token.js scenarios.json [decisions.csv] [summary.json]");
 const r=produce(JSON.parse(fs.readFileSync(input,"utf8")));
 if(csvout)fs.writeFileSync(csvout,r.csv);else process.stdout.write(r.csv);
 if(summaryout)fs.writeFileSync(summaryout,JSON.stringify(r.summary,null,2)+"\n");else process.stderr.write(JSON.stringify(r.summary)+"\n");
}
