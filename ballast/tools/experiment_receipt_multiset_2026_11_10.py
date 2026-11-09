import json, hashlib
cases=[('valid',True,['A','B'],True,True,True,True),('duplicate',True,['A','A','B'],True,True,True,True),('extra',True,['A','B','C'],True,True,True,True),('revoked',True,['A','B'],False,True,True,True),('stale',True,['A','B'],True,False,True,True),('race',True,['A','B'],True,True,True,False),('conflict',True,['A','B'],True,True,False,True)]
rows=[]
for name,ack,receipts,grant,coverage,consistent,fence in cases:
    weak='COMPLETE' if ack and len(receipts)>=2 else 'STOP'
    if not consistent: ref='EVIDENCE_CONFLICT'
    elif not grant: ref='UNAUTHORIZED_OCCURRENCE'
    elif not coverage or not fence: ref='STOP_UNKNOWN'
    elif sorted(receipts)!=['A','B']: ref='EFFECT_SET_MISMATCH'
    else: ref='COMPLETE'
    witness={'duplicate':len(receipts)!=len(set(receipts)),'membership':set(receipts)=={'A','B'} and len(receipts)==2,'authorized':grant,'fresh':coverage,'consistent':consistent,'protected':fence}
    verify=('EVIDENCE_CONFLICT' if not witness['consistent'] else 'UNAUTHORIZED_OCCURRENCE' if not witness['authorized'] else 'STOP_UNKNOWN' if not (witness['fresh'] and witness['protected']) else 'EFFECT_SET_MISMATCH' if not witness['membership'] or witness['duplicate'] else 'COMPLETE')
    rows.append(dict(id=name,ack=ack,receipts=receipts,grant=grant,coverage=coverage,consistent=consistent,fence=fence,weak=weak,reference=ref,verifier=verify))
assert len({r['id'] for r in rows})==len(rows)
assert all(r['reference']==r['verifier'] for r in rows)
raw=json.dumps(rows,ensure_ascii=False,sort_keys=True,separators=(',',':'))
open('/mnt/data/ballast_run/results.json','w').write(raw+'\n')
print('scenarios',len(rows),'decisions',len(rows)*3,'weak_disagreements',sum(r['weak']!=r['reference'] for r in rows),'verifier_agreements',sum(r['reference']==r['verifier'] for r in rows),'sha256',hashlib.sha256((raw+'\n').encode()).hexdigest())
for r in rows: print(r['id'],r['weak'],r['reference'],r['verifier'])
