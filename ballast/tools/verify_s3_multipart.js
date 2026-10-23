"use strict";
const verify = function verify(scenarios,decisions,csv){
  "use strict";
  const eqParts=(a,b)=>{if(!Array.isArray(a)||!Array.isArray(b)||a.length!==b.length)return false;for(let i=0;i<a.length;i++){const x=a[i],y=b[i];if(!x||!y||x.number!==y.number||x.identity!==y.identity||x.etag!==y.etag)return false}return true};
  function guarded(s){const g=s.guard,t=s.target;return !!g&&g.protected===true&&g.task===t.task&&g.inc===t.inc&&g.revision===t.revision&&eqParts(g.parts,t.requiredParts)&&Number.isFinite(g.committedAt)}
  function authoritative(s){const p=s.prior,t=s.target;if(!p||p.authority!==true||p.exact!==true||p.lifecycle!=="active"||p.task!==t.task||p.inc!==t.inc||p.effectId!==t.effectId)return false;const v=[p.oldAttemptEnd,p.watermark,p.queriedAt,p.retentionThrough];return v.every(x=>typeof x==="number"&&Number.isFinite(x))&&v[0]<=v[1]&&v[1]<=v[2]&&v[2]<=v[3]}
  function full(s){
    const t=s.target,events=s.journal,p=s.prior;
    if(events.length===0){
      if(p.state==="hit"&&authoritative(s))return "EVIDENCE_CONFLICT";
      if(p.state!=="miss"||!authoritative(s)||!guarded(s))return "STOP_UNKNOWN";
      if(s.permission===false)return "BLOCKED";
      if(s.permission!==true)return "STOP_UNKNOWN";
      return "RETRY_ALLOWED";
    }
    if(p.state==="miss"&&authoritative(s))return "EVIDENCE_CONFLICT";
    if(events.length!==1||!guarded(s))return "RECONCILE";
    const event=events[0],h=s.readback;
    const eventOK=event.task===t.task&&event.inc===t.inc&&event.effectId===t.effectId&&typeof event.uploadId==="string"&&event.uploadId.length>0&&event.authorized===true&&eqParts(event.parts,t.requiredParts)&&Number.isFinite(event.committedAt);
    if(!eventOK||!h)return "RECONCILE";
    const readOK=h.task===t.task&&h.inc===t.inc&&h.bucket===t.bucket&&h.key===t.key&&h.version===event.version&&eqParts(h.parts,t.requiredParts)&&Number.isFinite(h.readAt)&&event.committedAt<=h.readAt&&h.readAt<=s.guard.committedAt;
    return readOK?"COMPLETE":"RECONCILE";
  }
  const names=new Set(),rowKeys=new Set(),issues=[],allowed=new Set(["COMPLETE","RETRY_ALLOWED","STOP_UNKNOWN","RECONCILE","BLOCKED","EVIDENCE_CONFLICT"]);
  for(const s of scenarios){if(names.has(s.id))issues.push("duplicate scenario "+s.id);names.add(s.id)}
  const expected=new Map();
  for(const s of scenarios){
    expected.set(s.id+"|status_200_proxy",s.response.status===200&&s.response.partCount===s.target.requiredParts.length?"COMPLETE":"RETRY_ALLOWED");
    expected.set(s.id+"|key_count_proxy",s.response.body==="result"&&s.readback&&s.readback.key===s.target.key&&s.readback.parts.length===s.target.requiredParts.length?"COMPLETE":"RETRY_ALLOWED");
    expected.set(s.id+"|full_reference",full(s));
  }
  for(const row of decisions){const k=row.scenario+"|"+row.path;if(rowKeys.has(k))issues.push("duplicate row "+k);rowKeys.add(k);if(!allowed.has(row.decision)||expected.get(k)!==row.decision)issues.push("mismatch "+k)}
  if(rowKeys.size!==scenarios.length*3||expected.size!==rowKeys.size)issues.push("coverage");
  const parsed=csv.trimEnd().split("\n").map(s=>s.split(","));if(parsed[0].join(",")!=="scenario,path,decision"||parsed.length!==decisions.length+1)issues.push("csv schema/count");
  for(let i=0;i<decisions.length;i++){const row=parsed[i+1],x=decisions[i];if(!row||row.length!==3||row[0]!==x.scenario||row[1]!==x.path||row[2]!==x.decision)issues.push("csv row "+i)}
  const negative=scenarios.filter(s=>!["baseline","lost_response_prior_effect","revoked_after_authorized_effect","http200_error_but_prior_effect_valid","http409_with_prior_valid","prior_hit_wrong_effect_scope"].includes(s.id)&&s.id!=="covered_miss_retry");
  let rejected=0;for(const s of negative){if(full(s)!=="COMPLETE")rejected++;else issues.push("negative accepted "+s.id)}
  const probes={baseline:"COMPLETE",http200_error_no_effect:"STOP_UNKNOWN",same_count_part_swap:"RECONCILE",covered_miss_conflicts_positive:"EVIDENCE_CONFLICT",covered_miss_retry:"RETRY_ALLOWED",covered_miss_revoked:"BLOCKED",covered_miss_permission_unknown:"STOP_UNKNOWN",covered_miss_unprotected_guard:"STOP_UNKNOWN",covered_miss_stale_revision:"STOP_UNKNOWN",expired_retention_miss:"STOP_UNKNOWN",wrong_scope_miss:"STOP_UNKNOWN",revoked_after_authorized_effect:"COMPLETE",http200_error_but_prior_effect_valid:"COMPLETE",http409_with_prior_valid:"COMPLETE",covered_hit_without_journal:"EVIDENCE_CONFLICT"};
  let probePass=0;for(const [id,decision] of Object.entries(probes)){const s=scenarios.find(s=>s.id===id);if(s&&full(s)===decision)probePass++;else issues.push("probe "+id)}
  const tampered=decisions.map(x=>({...x}));tampered[0].decision="FORGED";const tamperDetected=expected.get(tampered[0].scenario+"|"+tampered[0].path)!==tampered[0].decision;
  if(!tamperDetected)issues.push("tamper not detected");
  return {ok:issues.length===0,issues,scenarioCount:scenarios.length,decisionCount:decisions.length,matched:decisions.length-issues.filter(x=>x.startsWith("mismatch")).length,negativeCount:negative.length,negativeRejected:rejected,probeCount:Object.keys(probes).length,probePass,tamperDetected,independence:{implementation:"PARTIAL separate primitive implementation",dataSource:"NONE same authored fixtures",semanticContract:"LIMITED shared decision contract",externalAuthority:"NONE"},environment:"V8 isolated JavaScript function execution, not Node CLI or live AWS"};
};
if (typeof module !== "undefined") module.exports = {verify};
if (typeof require !== "undefined" && require.main === module) {
  const fs = require("fs");
  if (process.argv.length !== 4) throw new Error("usage: node verify_s3_multipart.js scenarios.json decisions.csv");
  const scenarios = JSON.parse(fs.readFileSync(process.argv[2],"utf8")).scenarios;
  const csv = fs.readFileSync(process.argv[3],"utf8");
  const decisions = csv.trimEnd().split("\n").slice(1).map(line => {
    const [scenario,path,decision] = line.split(",");
    return {scenario,path,decision};
  });
  const report = verify(scenarios,decisions,csv);
  process.stdout.write(JSON.stringify(report)+"\n");
  process.exitCode = report.ok ? 0 : 1;
}
