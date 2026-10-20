"use strict";
// Bounded Step Functions redrive model, NOT an AWS runtime or external effect sink
const MUTATIONS = [
 ["ordinary_baseline",{}],["datalimit_reruns_success",{"dle":true}],
 ["datalimit_sink_dedup",{"dle":true,"dedup":true}],
 ["datalimit_extra_retry",{"dle":true,"extraA":true}],
 ["ordinary_failed_member_retried_twice",{"extraB":true}],
 ["same_count_member_swap",{"swap":true}],
 ["unexpected_member",{"extra":true}],
 ["duplicate_receipt_identity",{"dupId":true}],
 ["unauthorized_original",{"unauth":true}],
 ["wrong_target_incarnation",{"wrongTarget":true}],
 ["wrong_business_effect_identity",{"wrongEffectId":true}],
 ["permission_revoked_after_completion",{"permission":false}],
 ["permission_revoked_missing_effect",{"permission":false,"missing":true,"miss":true}],
 ["covered_miss_allows_recovery",{"missing":true,"miss":true}],
 ["unknown_prior_blocks_recovery",{"missing":true,"unknown":true}],
 ["uncovered_visibility_watermark",{"missing":true,"miss":true,"watermark":80}],
 ["expired_query_retention",{"missing":true,"miss":true,"retention":false}],
 ["aggregate_miss_not_authoritative",{"missing":true,"miss":true,"scope":"aggregate"}],
 ["wrong_miss_effect_identity",{"missing":true,"miss":true,"queryEffect":"wrong"}],
 ["positive_receipt_conflicts_with_miss",{"miss":true}],
 ["stale_membership_revision",{"staleRevision":true}],
 ["stale_witness_membership",{"staleMembers":true}],
 ["unprotected_completion_witness",{"unprotected":true}],
 ["post_witness_membership_drift",{"drift":true}],
 ["definition_alias_version_mismatch",{"versionDrift":true}],
 ["missing_temporal_order",{"badTick":true}],
 ["unknown_historical_authorization",{"unknownAuth":true}],
 ["duplicate_required_member",{"duplicateMembership":true}],
 ["terminal_success_missing_external_effect",{"missing":true,"unknown":true,"stateSuccess":true}],
 ["redrive_retry_counter_reset",{"retryCount":3}],
 ["prior_query_failure",{"missing":true,"queryFailed":true}],
 ["miss_before_old_attempt_visible",{"missing":true,"miss":true,"oldTick":200}],
 ["miss_from_unrelated_authority",{"missing":true,"miss":true,"queryAuthority":"unrelated"}],
 ["miss_without_lifecycle_coverage",{"missing":true,"miss":true,"lifecycle":"unknown"}]
];
function build(id,m) {
 const effect=(member,redrive,tick,accepted=true)=>({event_id:id+"-evt-"+member+"-"+redrive+"-"+tick,member,effect_id:id+"/"+member+"/inc-7",target:"inc-7",historical_authorized:true,tick,accepted,redrive});
 const s={id,task:{execution_arn:"arn:aws:states:us-east-1:000000000000:execution:ballast:"+id,definition:"def-7",expected_definition:"def-7",state:m.stateSuccess?"SUCCEEDED":"FAILED_THEN_REDRIVEN",redrive_count:1,cause:m.dle?"States.DataLimitExceeded":"OrdinaryFailure",retry_counter:m.retryCount||0},current_permission:m.permission!==false,required:["A","B"],membership_revision:4,target:"inc-7",witness:{revision:4,members:["A","B"],target:"inc-7",protected:true,commit_tick:50,mutation_tick:0},prior:{status:m.miss?"miss":m.unknown||m.queryFailed?"unknown":"hit",effect_id:id+"/B/inc-7",scope:"exact",watermark:120,old_attempt_tick:100,retention:true,lifecycle:"complete",authority:"modeled_sink_journal",query_ok:!m.queryFailed},events:[effect("A",0,10),effect("B",1,30)]};
 if(m.dle)s.events.push(effect("A",1,31,!m.dedup));
 if(m.extraA)s.events.push(effect("A",2,32));
 if(m.extraB)s.events.push(effect("B",2,33));
 if(m.missing)s.events=s.events.filter(e=>e.member!=="B");
 if(m.swap)s.required=["A","C"];
 if(m.extra)s.events.push(effect("C",1,34));
 if(m.dupId)s.events[1].event_id=s.events[0].event_id;
 if(m.unauth)s.events[0].historical_authorized=false;
 if(m.unknownAuth)s.events[0].historical_authorized=null;
 if(m.wrongTarget)s.events[0].target="inc-previous";
 if(m.wrongEffectId)s.events[0].effect_id=id+"/A/inc-previous";
 if(m.watermark!==undefined)s.prior.watermark=m.watermark;
 if(m.oldTick!==undefined)s.prior.old_attempt_tick=m.oldTick;
 if(m.retention===false)s.prior.retention=false;
 if(m.scope)s.prior.scope=m.scope;
 if(m.queryEffect)s.prior.effect_id=m.queryEffect;
 if(m.queryAuthority)s.prior.authority=m.queryAuthority;
 if(m.lifecycle)s.prior.lifecycle=m.lifecycle;
 if(m.staleRevision)s.witness.revision=3;
 if(m.staleMembers)s.witness.members=["A","C"];
 if(m.unprotected)s.witness.protected=false;
 if(m.drift)s.witness.mutation_tick=51;
 if(m.versionDrift)s.task.expected_definition="def-8";
 if(m.badTick)s.events[0].tick=null;
 if(m.duplicateMembership)s.required=["A","A"];
 return s;
}
function reference(s) {
 const ids=new Set(),members=new Map();
 for(const e of s.events){
  if(ids.has(e.event_id))return "EVIDENCE_CONFLICT";
  ids.add(e.event_id);
 }
 const accepted=s.events.filter(e=>e.accepted);
 const authoritativeMiss=s.prior.status==="miss"&&s.prior.query_ok===true&&s.prior.scope==="exact"&&s.prior.authority==="modeled_sink_journal"&&s.prior.lifecycle==="complete"&&s.prior.retention===true&&Number.isFinite(s.prior.watermark)&&Number.isFinite(s.prior.old_attempt_tick)&&s.prior.old_attempt_tick>=0&&s.prior.watermark>=s.prior.old_attempt_tick;
 if(authoritativeMiss&&accepted.some(e=>e.effect_id===s.prior.effect_id))return "EVIDENCE_CONFLICT";
 if(!Array.isArray(s.required)||s.required.length===0||new Set(s.required).size!==s.required.length)return "STOP_UNKNOWN";
 if(s.task.definition!==s.task.expected_definition||s.witness.protected!==true||s.witness.revision!==s.membership_revision||s.witness.target!==s.target||JSON.stringify(s.witness.members.slice().sort())!==JSON.stringify(s.required.slice().sort())||!Number.isFinite(s.witness.commit_tick)||!Number.isFinite(s.witness.mutation_tick)||s.witness.mutation_tick<0||s.witness.mutation_tick>s.witness.commit_tick)return "STOP_UNKNOWN";
 for(const e of accepted){
  if(e.historical_authorized==null||!Number.isFinite(e.tick)||e.tick<0||e.tick>s.witness.commit_tick)return "STOP_UNKNOWN";
  if(e.historical_authorized!==true||e.target!==s.target||e.effect_id!==s.id+"/"+e.member+"/"+s.target||!s.required.includes(e.member))return "RECONCILE";
  members.set(e.member,(members.get(e.member)||0)+1);
 }
 if([...members.values()].some(n=>n!==1))return "RECONCILE";
 if(s.required.every(m=>members.get(m)===1))return "COMPLETE";
 if(s.current_permission!==true)return "BLOCKED";
 const missing=s.required.filter(m=>!members.has(m));
 if(missing.length===1&&authoritativeMiss&&s.prior.effect_id===s.id+"/"+missing[0]+"/"+s.target)return "RETRY_ALLOWED";
 return "STOP_UNKNOWN";
}
function produce(){
 const scenarios=MUTATIONS.map(([id,m])=>build(id,m));
 const decisions=[["scenario","path","decision"]];
 for(const s of scenarios){
  const accepted=s.events.filter(e=>e.accepted);
  const unique=new Set(accepted.map(e=>e.member));
  decisions.push([s.id,"redrive_preserves_success",s.task.state==="SUCCEEDED"||unique.size===s.required.length?"COMPLETE":"RETRY_ALLOWED"]);
  decisions.push([s.id,"receipt_count",accepted.length===s.required.length?"COMPLETE":"RETRY_ALLOWED"]);
  decisions.push([s.id,"full_integrity_reference",reference(s)]);
 }
 return {scenarios,decisions_csv:decisions.map(r=>r.join(",")).join("\n")+"\n"};
}
if(typeof module!=="undefined"){module.exports={produce};if(require.main===module)process.stdout.write(JSON.stringify(produce(),null,2)+"\n")}
