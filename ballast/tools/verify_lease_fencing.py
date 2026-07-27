from __future__ import annotations
import argparse, json, sys
from pathlib import Path

def validate(data):
    reasons=[]; compete=data.get("compete",{}); weak=data.get("weak",{}); fenced=data.get("fenced",{})
    wl=weak.get("lease",{}); wa=weak.get("artifact",{}); fl=fenced.get("lease",{}); fa=fenced.get("artifact",{})
    checks={
        "single_concurrent_owner":compete.get("winners")==1,
        "weak_stale_overwrite_detected":weak.get("reported_complete") and wa.get("token")!=wl.get("token") and wa.get("worker")!=wl.get("holder"),
        "stale_commit_rejected":fenced.get("current_commit") is True and fenced.get("stale_commit") is False and fenced.get("rejected")==1,
        "current_artifact_verified":fa.get("token")==fl.get("token") and fa.get("worker")==fl.get("holder") and fenced.get("accepted")==1,
        "replay_zero_writes":fenced.get("replay") is True and fenced.get("replay_writes")==0,
    }
    reasons=[name for name,passed in checks.items() if not passed]
    return {"valid":not reasons,"reasons":reasons,"checks":checks}

def main():
    parser=argparse.ArgumentParser(); parser.add_argument("--summary",required=True,type=Path); args=parser.parse_args()
    try: data=json.loads(args.summary.read_text(encoding="utf-8"))
    except (OSError,json.JSONDecodeError) as error:
        print(json.dumps({"valid":False,"reasons":[f"read_failed:{type(error).__name__}"]})); return 2
    result=validate(data); print(json.dumps(result,sort_keys=True)); return 0 if result["valid"] else 1

if __name__ == "__main__": sys.exit(main())