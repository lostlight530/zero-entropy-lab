// Post-merge case-to-trace binding verifier, independent from producer.decide
const stateKeys=["task","run","attempt","effect","target","owner","generation","delegate","delegateGeneration","permit","approval","credential","grant","precheck","commit","receipt","query","current"];
function exact(a,b){
 if(a===b)return true;
 if(!a||!b||typeof a!=="object"||typeof b!=="object"||Array.isArray(a)!==Array.isArray(b))return false;
 if(Array.isArray(a))return a.length===b.length&&a.every((v,i)=>exact(v,b[i]));
 let ka=Object.keys(a),kb=Object.keys(b);
 return ka.length===kb.length&&ka.every(k=>Object.prototype.hasOwnProperty.call(b,k)&&exact(a[k],b[k]));
}
function verifyCaseTraceBinding(cases,traces){
 let errors=[];
 if(!Array.isArray(cases)||!Array.isArray(traces))return {pass:false,errors:["containers must be arrays"]};
 if(cases.length!==traces.length)errors.push("cardinality mismatch");
 let map=new Map(),ids=new Set();
 for(let t of traces){
   if(!t||typeof t.id!=="string"||!t.id||map.has(t.id))errors.push("invalid/duplicate trace ID");
   if(t&&typeof t.id==="string")map.set(t.id,t);
 }
 for(let item of cases){
   if(!item||typeof item.id!=="string"||!item.id||ids.has(item.id)){errors.push("duplicate/invalid case identity");continue}
   let id=item.id,s=item.state,t=map.get(id);ids.add(id);
   if(!exact(Object.keys(item).sort(),["id","intervention","state"].sort()))errors.push("case schema "+id);
   if(item.intervention!==id)errors.push("intervention mismatch "+id);
   if(!s||typeof s!=="object"||Array.isArray(s)){errors.push("missing state "+id);continue}
   if(!exact(Object.keys(s).sort(),stateKeys.slice().sort())){errors.push("state schema "+id);continue}
   if(!t||!Array.isArray(t.events)){errors.push("missing trace "+id);continue}
   if(!exact(Object.keys(t).sort(),["id","events"].sort()))errors.push("trace schema "+id);
   if(["grant","precheck","commit","query","current"].some(k=>!s[k]||typeof s[k]!=="object"||Array.isArray(s[k]))){errors.push("missing nested evidence "+id);continue}
   if(s.receipt!==null&&(!s.receipt||typeof s.receipt!=="object"||Array.isArray(s.receipt))){errors.push("invalid receipt "+id);continue}
   let events=[
     {kind:"INTENT",task:s.task,run:s.run,attempt:s.attempt,effect:s.effect,target:s.target},
     {kind:"OWNER",owner:s.owner,generation:s.generation,delegate:s.delegate,delegateGeneration:s.delegateGeneration},
     {kind:"PERMISSION",permit:s.permit,approval:s.approval,credential:s.credential},
     {kind:"GRANT",...s.grant},{kind:"PRECHECK",...s.precheck},{kind:"COMMIT",...s.commit},
     {kind:"QUERY",...s.query},{kind:"CURRENT",...s.current},
     ...(s.receipt===null?[]:[{kind:"RECEIPT",...s.receipt}])
   ];
   if(!exact(t.events,events))errors.push("primitive mismatch "+id);
 }
 if(map.size!==ids.size||[...map.keys()].some(k=>!ids.has(k)))errors.push("unmatched identity");
 return {pass:errors.length===0,errors,cases:cases.length,traces:traces.length,events:traces.reduce((v,t)=>v+(Array.isArray(t?.events)?t.events.length:0),0),
 independence:{implementation:"SEPARATE_EVENT_PROJECTION",dataSource:"SHARED",semanticContract:"SHARED",authority:"NONE"}};
}
if(typeof module!=="undefined")module.exports={verifyCaseTraceBinding};
