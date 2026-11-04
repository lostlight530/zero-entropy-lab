// 2026-11-04 Ballast review reconstruction, not original inline model
function cases(){
 const b={contract:{task:"task-04",run:"run-04",uid:"uid-4",revision:7,epoch:"epoch-4",required:["A","B"],attempts:[1,2]},
 receipts:[{member:"A",task:"task-04",run:"run-04",attempt:2,uid:"uid-4",revision:7,epoch:"epoch-4",at:20,state:"DONE"},{member:"B",task:"task-04",run:"run-04",attempt:2,uid:"uid-4",revision:7,epoch:"epoch-4",at:21,state:"DONE"}],
 query:{authority:"sink-journal",exact:true,task:"task-04",run:"run-04",uid:"uid-4",epoch:"epoch-4",attempts:[1,2],members:["A","B"],watermark:40,lastEnd:30,queryAt:50,retentionUntil:100,lifecycle:"ACTIVE",positive:true,miss:false},
 grant:{authority:"approval-ledger",task:"task-04",run:"run-04",uid:"uid-4",epoch:"epoch-4",from:10,to:30},
 membership:{uid:"uid-4",epoch:"epoch-4",revision:7,ids:["A","B"],states:{A:"DONE",B:"DONE"}},
 guard:{uid:"uid-4",epoch:"epoch-4",revision:7,ids:["A","B"],commitAt:60,commitBound:true},
 permission:{allowed:true,approval:true,credential:true}};
 const defs=[["baseline",x=>{}],["missing_B",x=>x.receipts.pop()],["duplicate_A",x=>x.receipts[1]={...x.receipts[0]}],["extra_C",x=>x.receipts.push({...x.receipts[1],member:"C"})],["revoked_now",x=>x.permission.allowed=false],["grant_invalid",x=>x.grant.to=19],["guard_drift",x=>x.guard.revision=8],["miss_conflict",x=>x.query.miss=true]];
 return defs.map(([id,fn])=>{const state=JSON.parse(JSON.stringify(b));fn(state);return {id,state,intervention:id}});
}
function reference(s){
 const c=s.contract,q=s.query,r=s.receipts,g=s.grant,m=s.membership,h=s.guard,p=s.permission;
 const num=v=>typeof v==="number"&&Number.isSafeInteger(v)&&v>=0;
 const set=(a,b)=>Array.isArray(a)&&Array.isArray(b)&&a.length>0&&a.length===b.length&&new Set(a).size===a.length&&new Set(b).size===b.length&&a.every(v=>typeof v==="string"&&v.length>0)&&b.every(v=>a.includes(v));
 if(!c||!q||!g||!m||!h||!p||!Array.isArray(r))return "STOP_UNKNOWN";
 if(!set(c.required,["A","B"])||!Array.isArray(c.attempts)||c.attempts.length!==2||c.attempts.some(v=>!num(v))||new Set(c.attempts).size!==2)return "STOP_UNKNOWN";
 if([q.positive,q.miss,p.allowed,p.approval,p.credential].some(v=>typeof v!=="boolean"))return "STOP_UNKNOWN";
 if(q.positive&&q.miss||r.length>0&&q.miss)return "EVIDENCE_CONFLICT";
 if(q.authority!=="sink-journal"||q.exact!==true||q.task!==c.task||q.run!==c.run||q.uid!==c.uid||q.epoch!==c.epoch||JSON.stringify(q.attempts)!==JSON.stringify(c.attempts)||!set(q.members,c.required)||q.lifecycle!=="ACTIVE"||![q.watermark,q.lastEnd,q.queryAt,q.retentionUntil].every(num)||q.watermark<q.lastEnd||q.watermark>q.queryAt||q.retentionUntil<q.queryAt)return "STOP_UNKNOWN";
 if(!r.length)return q.miss===true&&(p.allowed===false||p.approval===false||p.credential===false)?"BLOCKED":"STOP_UNKNOWN";
 if(q.positive!==true)return "STOP_UNKNOWN";
 if(!set(r.map(x=>x.member),c.required)||r.some(x=>x.task!==c.task||x.run!==c.run||!c.attempts.includes(x.attempt)||x.uid!==c.uid||x.epoch!==c.epoch||x.revision!==c.revision||x.state!=="DONE"||!num(x.at)))return "RECONCILE";
 if(r.some(x=>x.at>q.watermark||x.at>q.queryAt))return "STOP_UNKNOWN";
 if(g.authority!=="approval-ledger"||g.task!==c.task||g.run!==c.run||g.uid!==c.uid||g.epoch!==c.epoch||!num(g.from)||!num(g.to)||r.some(x=>x.at<g.from||x.at>g.to))return "BLOCKED";
 if(m.uid!==c.uid||m.epoch!==c.epoch||m.revision!==c.revision||!set(m.ids,c.required)||!set(Object.keys(m.states||{}),c.required)||c.required.some(x=>m.states[x]!=="DONE"))return "RECONCILE";
 if(h.uid!==c.uid||h.epoch!==c.epoch||h.revision!==c.revision||!set(h.ids,c.required)||h.commitBound!==true||!num(h.commitAt)||h.commitAt<q.queryAt||r.some(x=>x.at>h.commitAt))return "RECONCILE";
 return "COMPLETE";
}
function produce(xs){const traces=[],decisions=[];
 for(const {id,state:s} of xs){
 const events=[{type:"CONTRACT",...s.contract},...s.receipts.map(x=>({type:"RECEIPT",...x})),{type:"QUERY",...s.query},{type:"GRANT",...s.grant},{type:"MEMBERS",...s.membership},{type:"GUARD",...s.guard},{type:"PERMISSION",...s.permission}];
 traces.push({id,events});
 decisions.push({id,path:"count",decision:s.receipts.length>=s.contract.required.length?"COMPLETE":"STOP_UNKNOWN"});
 decisions.push({id,path:"reference",decision:reference(s)});
 }return {traces,decisions};
}
if(typeof module!=="undefined")module.exports={cases,produce,reference};
