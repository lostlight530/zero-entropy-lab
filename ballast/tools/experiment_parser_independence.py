from __future__ import annotations
import json, subprocess, sys, tempfile, time
from pathlib import Path

V=Path(__file__).with_name("verify_parser_independence.py")
AMBIGUOUS='{"task":"alpha","status":"failed","status":"complete","result":"processed:alpha"}'
CONTROL='{"task":"alpha","status":"complete","result":"processed:alpha"}'

def shared(text):
    value=json.loads(text)
    if not isinstance(value,dict): raise ValueError("not_object")
    return value

def shared_valid(value):
    again=json.loads(json.dumps(value,sort_keys=True))
    return again=={"task":"alpha","status":"complete","result":"processed:alpha"}

def external(source,artifact):
    done=subprocess.run([sys.executable,str(V),"--source",str(source),"--artifact",str(artifact)],capture_output=True,encoding="utf-8",check=False)
    if not done.stdout.strip(): raise AssertionError(f"validator_missing:{done.returncode}")
    result=json.loads(done.stdout); result["exit_status"]=done.returncode; return result

def write(path,value): path.write_text(json.dumps(value,sort_keys=True)+"\n",encoding="utf-8"); return 1

def main():
    started=time.perf_counter(); summary={}
    with tempfile.TemporaryDirectory(prefix="ballast-parser-", dir="C:/tmp") as directory:
        root=Path(directory); ambs=root/"ambiguous-source.json"; amba=root/"ambiguous-artifact.json"; cons=root/"control-source.json"; cona=root/"control-artifact.json"
        ambs.write_text(AMBIGUOUS+"\n",encoding="utf-8"); cons.write_text(CONTROL+"\n",encoding="utf-8")
        av=shared(AMBIGUOUS); aw=write(amba,av); ashared=shared_valid(av); aexternal=external(ambs,amba)
        cv=shared(CONTROL); cw=write(cona,cv); cshared=shared_valid(cv); cexternal=external(cons,cona)
        before=cona.read_bytes(); replay_writes=0
        if not cexternal["valid"]: replay_writes+=write(cona,cv)
        unchanged=cona.read_bytes()==before
        assertions={
            "shared_assumption_false_success":av["status"]=="complete" and ashared and not aexternal["valid"] and "duplicate_name:status" in aexternal["reasons"],
            "unique_control_valid":cshared and cexternal["valid"],
            "validated_replay_zero_writes":replay_writes==0 and unchanged,
        }
        summary={"ambiguous":{"default_status":av["status"],"writes":aw,"shared_valid":ashared,"independent":aexternal},"control":{"writes":cw,"shared_valid":cshared,"independent":cexternal,"replay_writes":replay_writes,"replay_unchanged":unchanged},"assertions":assertions,"effective_completion":all(assertions.values()),"validated_elapsed_ms":round((time.perf_counter()-started)*1000,3)}
    summary["temporary_state_cleaned"]=not root.exists(); print(json.dumps(summary,sort_keys=True))
    return 0 if summary["effective_completion"] and summary["temporary_state_cleaned"] else 1

if __name__ == "__main__": sys.exit(main())