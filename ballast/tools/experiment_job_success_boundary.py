import csv, hashlib, json, pathlib
import os
P=pathlib.Path(os.environ.get('BALLAST_JOB_OUT', '/tmp/ballast_20261009'))
P.mkdir(parents=True,exist_ok=True)
def sc(name, *, success=True, complete=True, pods_terminated=True, failure=False, job_uid='job-1', current_job_uid='job-1', required=('a','b'), receipts=('a','b'), receipt_state='hit', receipt_covered=True, duplicate=False, target_uid='target-1', current_target_uid='target-1', historical_auth=True, permission=True, postcondition=True):
    return dict(name=name,success=success,complete=complete,pods_terminated=pods_terminated,failure=failure,job_uid=job_uid,current_job_uid=current_job_uid,required=list(required),receipts=list(receipts),receipt_state=receipt_state,receipt_covered=receipt_covered,duplicate=duplicate,target_uid=target_uid,current_target_uid=current_target_uid,historical_auth=historical_auth,permission=permission,postcondition=postcondition)
scenarios=[
 sc('baseline-all-required-effects'),
 sc('criteria-before-all-pods-terminated',complete=False,pods_terminated=False),
 sc('success-policy-subset-missing-required-effect',receipts=('a',)),
 sc('duplicate-index-effect-occurrence',duplicate=True),
 sc('replacement-target-incarnation',target_uid='target-old'),
 sc('historically-unauthorized-effect',historical_auth=False),
 sc('revoked-permission-with-unfinished-work',receipts=('a',),permission=False),
 sc('prior-effect-unknown',receipt_state='unknown'),
 sc('failure-policy-preempts-success',complete=False,pods_terminated=False,failure=True),
 sc('historical-hit-current-state-reversed',postcondition=False),
 sc('negative-receipt-without-watermark',receipt_state='miss',receipt_covered=False),
 sc('same-name-new-job-uid',job_uid='job-old'),
 sc('revoked-permission-after-valid-effect',permission=False),
]
# Four decision paths, each run on identical primitive input.
def decide(x,path):
 if path=='criteria-only': return 'verified' if x['success'] else 'not-complete'
 if path=='terminal-only': return 'verified' if x['complete'] else 'not-complete'
 if path=='controller-lifecycle':
  if x['failure']: return 'failure-target'
  if not x['complete'] or not x['pods_terminated']: return 'pending-termination'
  return 'verified'
 assert path=='full-integrity'
 if x['failure']: return 'failure-target'
 if not x['complete'] or not x['pods_terminated']: return 'pending-termination'
 if x['job_uid']!=x['current_job_uid']: return 'job-incarnation-mismatch'
 if x['target_uid']!=x['current_target_uid']: return 'target-incarnation-mismatch'
 if x['receipt_state']=='unknown' or (x['receipt_state']=='miss' and not x['receipt_covered']): return 'safe-stop-unknown'
 if x['receipt_state']=='hit' and not x['historical_auth']: return 'historically-unauthorized'
 if x['duplicate']: return 'duplicate-effect'
 if not set(x['required']).issubset(x['receipts']):
  if not x['permission']: return 'permission-stop'
  return 'incomplete-effect-set'
 if not x['postcondition']: return 'current-postcondition-failed'
 return 'verified'
paths=['criteria-only','terminal-only','controller-lifecycle','full-integrity']
rows=[]
for x in scenarios:
 expected=decide(x,'full-integrity')
 for path in paths:
  got=decide(x,path)
  rows.append(dict(scenario=x['name'],expected=expected,path=path,observed=got,disagree=int(got!=expected)))
with (P/'scenarios.json').open('w') as f: json.dump(scenarios,f,sort_keys=True,indent=2)
with (P/'decisions.csv').open('w',newline='') as f:
 w=csv.DictWriter(f,fieldnames=['scenario','expected','path','observed','disagree'],lineterminator='\n');w.writeheader();w.writerows(rows)
sha=hashlib.sha256((P/'decisions.csv').read_bytes()).hexdigest()
counts={p:sum(row['disagree'] for row in rows if row['path']==p) for p in paths}
print(json.dumps(dict(scenarios=len(scenarios),paths=len(paths),decisions=len(rows),disagreements=counts,sha256=sha,rows=[dict(scenario=x['name'],expected=decide(x,'full-integrity'),**{p:decide(x,p) for p in paths}) for x in scenarios]),indent=2))
