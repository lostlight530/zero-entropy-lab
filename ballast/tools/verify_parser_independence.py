from __future__ import annotations
import argparse, json, sys
from pathlib import Path

class DuplicateName(ValueError): pass

def strict_object(pairs):
    result={}
    for name,value in pairs:
        if name in result: raise DuplicateName(name)
        result[name]=value
    return result

def validate(source_path,artifact_path):
    try: source_text=source_path.read_text(encoding="utf-8"); artifact_text=artifact_path.read_text(encoding="utf-8")
    except OSError as error: return {"valid":False,"reasons":[f"read_failed:{type(error).__name__}"]}
    try: source=json.loads(source_text,object_pairs_hook=strict_object)
    except DuplicateName as error: return {"valid":False,"reasons":[f"duplicate_name:{error.args[0]}"]}
    except json.JSONDecodeError as error: return {"valid":False,"reasons":[f"source_invalid:{error.msg}"]}
    try: artifact=json.loads(artifact_text,object_pairs_hook=strict_object)
    except (DuplicateName,json.JSONDecodeError) as error: return {"valid":False,"reasons":[f"artifact_invalid:{type(error).__name__}"]}
    expected={"task":"alpha","status":"complete","result":"processed:alpha"}; reasons=[]
    if source!=expected: reasons.append("source_contract_mismatch")
    if artifact!=expected: reasons.append("artifact_contract_mismatch")
    if artifact!=source: reasons.append("source_artifact_mismatch")
    return {"valid":not reasons,"reasons":reasons,"source_keys":sorted(source),"artifact_keys":sorted(artifact)}

def main():
    parser=argparse.ArgumentParser(); parser.add_argument("--source",required=True,type=Path); parser.add_argument("--artifact",required=True,type=Path); args=parser.parse_args()
    result=validate(args.source,args.artifact); print(json.dumps(result,sort_keys=True)); return 0 if result["valid"] else 1

if __name__ == "__main__": sys.exit(main())