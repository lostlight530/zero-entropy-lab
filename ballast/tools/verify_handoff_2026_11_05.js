// Ballast 2026-11-05 independently coded trace reconstruction, shared synthetic contract
function verify(xs,traces,decisions){
const errors=[],allowed=["weak_precheck","weak_receipt","reference"];
if(!Array.isArray(xs)||!Array.isArray(traces)||!Array.isArray(decisions))return {pass:false,errors:["invalid container"]};
if(xs.length!==traces.length||decisions.length!==xs.length*3)errors.push("cardinality");
if(new Set(traces.map(t=>t.id)).size!==traces.length)errors.push("duplicate trace identity");
if(new Set(decisions.map(d=>d.id+"|"+d.path)).size!==decisions.length)errors.push("duplicate decision identity");
const ids=new Set(),map=new Map(traces.map(x=>[x.id,x]));
const number=x=>typeof x==="number"&&Number.isSafeInteger(x)&&x>=0;
const string=x=>typeof x==="string"&&x.length>0;
const exact=(list,wanted)=>Array.isArray(list)&&Array.isArray(wanted)&&list.length===wanted.length&&list.length>0&&new Set(list).size===list.length&&new Set(wanted).size===wanted.length&&list.every(string)&&wanted.every(string)&&list.every(v=>wanted.includes(v));
for(const item of xs){
 if(!string(item.id)||ids.has(item.id))errors.push("duplicate/invalid scenario "+item.id);
 ids.add(item.id);const t=map.get(item.id);
 if(!t||!Array.isArray(t.events)){errors.push("missing trace "+item.id);continue}
 const group=kind=>t.events.filter(e=>e.kind===kind);
 const one=kind=>{const arr=group(kind);if(arr.length!==1)errors.push("event multiplicity "+item.id+" "+kind);return arr[0]||{}};
 const intent=one("INTENT"),owner=one("OWNER"),permission=one("PERMISSION"),grant=one("GRANT"),pre=one("PRECHECK"),commit=one("COMMIT"),query=one("QUERY"),current=one("CURRENT"),receipts=group("RECEIPT");
 if(receipts.length>1||t.events.length!==8+receipts.length)errors.push("extra event "+item.id);
 const receipt=receipts[0];let expected="STOP_UNKNOWN";
 const typed= [intent.task,intent.run,intent.attempt,intent.effect,intent.target,owner.owner,owner.delegate].every(string)&&
 [owner.generation,owner.delegateGeneration,pre.at,pre.generation,commit.generation,commit.at,query.at,query.watermark,query.retentionUntil,query.lastEnd].every(number)&&
 [permission.permit,permission.approval,permission.credential].every(x=>typeof x==="boolean")&&pre.at<=commit.at&&query.at>=commit.at;
 const conflict=receipt&&(query.state==="MISS"||query.negative===true)||query.negative===true&&query.state==="HIT";
 const coverage=query.negative!==undefined&&typeof query.negative==="boolean"&&query.exact===true&&query.lifecycle==="ACTIVE"&&query.authority==="sink-journal"&&
 ["HIT","MISS","UNKNOWN"].includes(query.state)&&query.task===intent.task&&query.run===intent.run&&query.attempt===intent.attempt&&exact(query.attempts,[intent.attempt])&&query.effect===intent.effect&&query.target===intent.target&&query.at<=query.retentionUntil&&query.watermark>=query.lastEnd&&query.watermark>=commit.at&&query.watermark<=query.at;
 if(!typed)expected="STOP_UNKNOWN";
 else if(conflict)expected="EVIDENCE_CONFLICT";
 else if(!coverage)expected="STOP_UNKNOWN";
 else if(!receipt)expected="STOP_UNKNOWN";
 else if(query.state!=="HIT")expected="STOP_UNKNOWN";
 else if([receipt.task,receipt.run,receipt.member].some(x=>!string(x))||receipt.task!==intent.task||receipt.run!==intent.run||receipt.attempt!==intent.attempt||receipt.member!=="A"||receipt.state!=="DONE"||receipt.effect!==intent.effect||receipt.target!==intent.target||!number(receipt.at)||receipt.at!==commit.at||receipt.at>query.watermark||receipt.at>query.at)expected="RECONCILE";
 else if(grant.authority!=="grant-ledger"||grant.task!==intent.task||grant.run!==intent.run||grant.attempt!==intent.attempt||grant.subject!==owner.delegate||grant.generation!==owner.delegateGeneration||grant.action!==intent.effect||grant.target!==intent.target||![grant.from,grant.to,grant.generation].every(number)||grant.from>grant.to||receipt.at<grant.from||receipt.at>grant.to||receipt.authorized!==true)expected="BLOCKED";
 else if(permission.permit!==true||permission.approval!==true||permission.credential!==true||owner.owner!==owner.delegate||owner.generation!==owner.delegateGeneration||pre.generation!==owner.generation||commit.generation!==owner.generation||commit.issuer!=="sink-guard"||commit.atomic!==true)expected="BLOCKED";
 else if(current.target!==intent.target||!number(current.revision)||!number(current.guardRevision)||current.revision!==current.guardRevision||current.protected!==true||!exact(current.members,["A"])||!exact(current.done,["A"])||!current.states||!exact(Object.keys(current.states),["A"])||current.states.A!=="DONE")expected="RECONCILE";
 else expected="COMPLETE";
 const weak1=pre.generation===owner.delegateGeneration?"COMPLETE":"BLOCKED",weak2=receipt?"COMPLETE":"STOP_UNKNOWN";
 for(const [path,want] of [["weak_precheck",weak1],["weak_receipt",weak2],["reference",expected]]){const hits=decisions.filter(d=>d.id===item.id&&d.path===path);if(hits.length!==1||hits[0].decision!==want)errors.push("decision "+item.id+" "+path)}
}
if(map.size!==xs.length)errors.push("trace orphan");
if(decisions.some(d=>!ids.has(d.id)||!allowed.includes(d.path)))errors.push("unexpected decision");
return {pass:errors.length===0,errors,scenarios:xs.length,traces:traces.length,traceEvents:traces.reduce((n,t)=>n+t.events.length,0),decisions:decisions.length,independence:{implementation:"PARTIAL",dataSource:"NONE",semanticContract:"SHARED",authority:"NONE"}};
}
if(typeof module!=="undefined")module.exports={verify};
