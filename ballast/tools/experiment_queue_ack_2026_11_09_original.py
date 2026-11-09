import json,hashlib
from datetime import datetime,timezone
cases=[
('baseline',True,True,True,True,True,True,False,False),
('ack_only',True,True,False,True,True,True,False,False),
('redelivered_effect',False,True,True,True,True,True,False,False),
('expired_ack_id',False,True,False,True,True,True,False,False),
('unknown_receipt',True,True,False,False,True,True,False,False),
('extra_member',True,True,True,True,True,True,True,False),
('receipt_conflict',True,True,True,True,True,True,False,True),
('revoked_at_effect',True,False,True,True,True,True,False,False),
('stale_watermark',True,True,True,True,False,True,False,False),
('retention_gap',True,True,True,True,True,False,False,False),
]
rows=[]
for name,ack,auth,hit,query,watermark,retention,extra,conflict in cases:
 facts={'scenario':name,'message_id':'m1','task_id':'t1','attempt_id':'a1','target_uid':'uid1','effect_ids':['A','B'],'ack_success':ack,'effect_time_authorized':auth,'exact_receipts':['A','B'] if hit else [],'query_ok':query,'watermark_covers':watermark,'retention_covers':retention,'extra_effect':'C' if extra else None,'negative_conflicts_positive':conflict,'current_permission':True,'current_predicate':True,'protected_commit':True}
 weak='COMPLETE' if ack else 'RETRY'
 # reference only considers complete when all exact historical effects, authorization and current predicate are evidenced
 if conflict: ref='EVIDENCE_CONFLICT'
 elif not query or not watermark or not retention: ref='STOP_UNKNOWN'
 elif extra: ref='STOP_EFFECT_SET_MISMATCH'
 elif not auth: ref='UNAUTHORIZED_OCCURRENCE'
 elif not hit: ref='STOP_UNKNOWN'
 else: ref='COMPLETE'
 rows.append({'facts':facts,'weak':weak,'reference':ref})
# independent reconstruction from primitive facts, not reference labels
for row in rows:
 f=row['facts']; ids=set(f['exact_receipts']); expected=set(f['effect_ids'])
 if f['negative_conflicts_positive']: verdict='EVIDENCE_CONFLICT'
 elif not all(f[k] for k in ('query_ok','watermark_covers','retention_covers')):verdict='STOP_UNKNOWN'
 elif f['extra_effect'] or ids-expected:verdict='STOP_EFFECT_SET_MISMATCH'
 elif not f['effect_time_authorized']:verdict='UNAUTHORIZED_OCCURRENCE'
 elif ids!=expected:verdict='STOP_UNKNOWN'
 elif not all(f[k] for k in ('current_predicate','protected_commit')):verdict='STOP_UNKNOWN'
 else:verdict='COMPLETE'
 row['verifier']=verdict
assert len({r['facts']['scenario'] for r in rows})==len(rows)
assert all(r['reference']==r['verifier'] for r in rows)
blob=json.dumps({'schema':'ballast-2026-11-09-bounded-synthetic','cases':rows},ensure_ascii=False,indent=2)+'\n'
open('/mnt/data/ballast_run/evidence.json','w').write(blob)
print(json.dumps({'scenarios':len(rows),'decisions':len(rows)*3,'weak_disagreements':sum(r['weak']!=r['reference'] for r in rows),'verifier_agreements':sum(r['reference']==r['verifier'] for r in rows),'sha256':hashlib.sha256(blob.encode()).hexdigest(),'histogram':{k:sum(r['reference']==k for r in rows) for k in sorted(set(r['reference'] for r in rows))},'utc':datetime.now(timezone.utc).isoformat()}))
