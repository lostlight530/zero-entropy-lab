from __future__ import annotations
import argparse, base64, hashlib, io, json, sys, zipfile
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
ENVELOPE=ROOT/'evidence'/'2026-10-18-handoff-bundle.json'
ALLOWED={'tools/experiment_handoff_sink_boundary.py','tools/verify_handoff_sink_boundary.py','evidence/2026-10-18-handoff-events.json','evidence/2026-10-18-handoff-decisions.csv','evidence/2026-10-18-handoff-summary.json'}

def main():
    p=argparse.ArgumentParser();p.add_argument('--extract',action='store_true');a=p.parse_args()
    doc=json.loads(ENVELOPE.read_text(encoding='utf-8'))
    archive=base64.b64decode(doc['zip_base64'],validate=True)
    if hashlib.sha256(archive).hexdigest()!=doc['zip_sha256']:
        raise ValueError('zip digest mismatch')
    with zipfile.ZipFile(io.BytesIO(archive)) as z:
        names=set(z.namelist())
        if names!={'ballast/'+name for name in ALLOWED}:
            raise ValueError('unexpected zip members')
        result={}
        for item in sorted(names):
            rel=item.removeprefix('ballast/')
            data=z.read(item)
            if hashlib.sha256(data).hexdigest()!=doc['file_sha256'][rel]:
                raise ValueError('file digest mismatch '+rel)
            data.decode('utf-8')
            target=ROOT/rel
            if a.extract:
                if target.exists() and target.read_bytes()!=data:
                    raise FileExistsError('refusing to overwrite changed file '+rel)
                target.parent.mkdir(parents=True,exist_ok=True)
                target.write_bytes(data)
            result[rel]=len(data)
    print(json.dumps({'status':'PASS','mode':'EXTRACT' if a.extract else 'CHECK_ONLY','files':result},sort_keys=True))
    return 0

if __name__=='__main__':sys.exit(main())
