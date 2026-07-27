from __future__ import annotations
import json, subprocess, sys, tempfile, time
from pathlib import Path

V = Path(__file__).with_name("verify_lease_fencing.py")

class Lease:
    def __init__(self): self.holder=None; self.token=0; self.expiry=0; self.version=0
    def acquire(self, worker, now, duration):
        if self.holder is not None and now < self.expiry: raise RuntimeError("busy")
        self.holder=worker; self.token+=1; self.expiry=now+duration; self.version+=1
        return self.snapshot()
    def cas(self, worker, seen, now, duration):
        if seen != self.version or (self.holder is not None and now < self.expiry): return False
        self.acquire(worker, now, duration); return True
    def snapshot(self):
        return {"holder":self.holder,"token":self.token,"expiry":self.expiry,"version":self.version}

def item(worker, token): return {"worker":worker,"token":token,"result":f"processed-by:{worker}"}

def compete():
    lease=Lease(); seen=lease.version
    outcomes=[lease.cas(worker,seen,0,5) for worker in ("worker-a","worker-b")]
    return {"outcomes":outcomes,"winners":sum(outcomes),"lease":lease.snapshot()}

def weak():
    lease=Lease(); a=lease.acquire("worker-a",0,5); cached=True
    b=lease.acquire("worker-b",6,5); artifact=item("worker-b",b["token"]); writes=1
    if cached: artifact=item("worker-a",a["token"]); writes+=1
    return {"reported_complete":cached,"lease":lease.snapshot(),"artifact":artifact,"writes":writes}

def fenced():
    lease=Lease(); a=lease.acquire("worker-a",0,5); b=lease.acquire("worker-b",6,5)
    artifact=None; accepted=0; rejected=0
    def commit(candidate):
        nonlocal artifact,accepted,rejected
        current=lease.snapshot()
        if candidate["worker"] != current["holder"] or candidate["token"] != current["token"]:
            rejected+=1; return False
        if artifact != candidate: artifact=candidate; accepted+=1
        return True
    current=commit(item("worker-b",b["token"])); stale=commit(item("worker-a",a["token"])); before=accepted
    replay=commit(item("worker-b",b["token"])); replay_writes=accepted-before
    return {"lease":lease.snapshot(),"artifact":artifact,"current_commit":current,"stale_commit":stale,"accepted":accepted,"rejected":rejected,"replay":replay,"replay_writes":replay_writes}

def main():
    started=time.perf_counter(); summary={}
    with tempfile.TemporaryDirectory(prefix="ballast-lease-", dir="C:/tmp") as directory:
        root=Path(directory); path=root/"summary.json"
        summary={"logical_clock":True,"fault":"holder_paused_past_expiry","compete":compete(),"weak":weak(),"fenced":fenced()}
        path.write_text(json.dumps(summary,sort_keys=True)+"\n",encoding="utf-8")
        done=subprocess.run([sys.executable,str(V),"--summary",str(path)],capture_output=True,encoding="utf-8",check=False)
        if not done.stdout.strip(): raise AssertionError(f"validator_missing:{done.returncode}")
        summary["validator"]=json.loads(done.stdout); summary["validator"]["exit_status"]=done.returncode
        summary["effective_completion"]=summary["validator"]["valid"]
        summary["validated_elapsed_ms"]=round((time.perf_counter()-started)*1000,3)
    summary["temporary_state_cleaned"]=not root.exists(); print(json.dumps(summary,sort_keys=True))
    return 0 if summary["effective_completion"] and summary["temporary_state_cleaned"] else 1

if __name__ == "__main__": sys.exit(main())