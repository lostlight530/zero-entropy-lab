"""Separate primitive-fact verifier for Ballast 2026-10-15

Does not import the producer or its decision function; shares the research contract,
fixture vocabulary and scenario assumptions, NOT an independent external authority
"""
from __future__ import annotations
import copy
import io
import csv
import hashlib
import json
from collections import Counter
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
JSON=ROOT/'evidence/2026-10-15-outbox-scenarios.json'
PARTS=[ROOT/f'evidence/2026-10-15-outbox-decisions-part-{i}.csv' for i in range(1,5)]
PATHS=('outbox_present','offset_advanced','receipt_count','full_integrity')


def independently_classify(x):
    receipts=x['sink_receipt_rows']; prior=x['prior_query']; now=x['current']
    if prior['state']=='unknown' or prior['query_ok'] is not True:
        return 'safe-stop-unknown'
    expected_scope={k:x[k] for k in ('task_id','run_id','attempt_id','target_uid')}
    expected_scope['effect_ids']=x['required_effects']
    if (prior['authority']!='sink-primary' or prior['scope']!=expected_scope or
        prior['retention_covers'] is not True or prior['watermark']<prior['attempt_boundary']):
        return 'safe-stop-unknown'
    if prior['state']=='miss':
        if len(receipts)>0: return 'evidence-conflict'
        if now['permission'] is not True: return 'permission-denied'
        return 'eligible-new-effect' if now['protected_effect'] is True else 'safe-stop-unknown'
    if prior['state']!='hit' or len(receipts)==0:
        return 'evidence-conflict'
    seen=set()
    for row in receipts:
        effect=row['effect_id']
        if effect in seen: return 'duplicate-receipt'
        seen.add(effect)
    needed=set(x['required_effects'])
    if not seen.issubset(needed): return 'extra-effect'
    for row in receipts:
        for key in ('task_id','run_id','attempt_id','target_uid'):
            if row[key]!=x[key]: return 'identity-mismatch'
    if seen!=needed: return 'missing-effects'
    if any(item['authorized']!=1 for item in receipts): return 'historically-unauthorized'
    if any(item['time_proof']!=1 or item['seq']>prior['watermark'] for item in receipts):
        return 'temporal-unverified'
    current_set=now['membership']
    if (len(set(current_set))!=len(current_set) or set(current_set)!=needed or
        now['membership_revision']!=now['witness_revision']):
        return 'membership-mismatch'
    if now['protected_completion'] is not True: return 'unprotected-decision'
    if now['postcondition'] is not True: return 'current-incomplete'
    return 'verified'


def independently_decide(x):
    count=len(x['sink_receipt_rows']); required=len(x['required_effects'])
    return {
        'outbox_present':'verified' if len(x['local_outbox_rows'])>0 else 'not-complete',
        'offset_advanced':'verified' if len(x['local_offset_rows'])>0 else 'not-complete',
        'receipt_count':'verified' if count==required else 'not-complete',
        'full_integrity':independently_classify(x)
    }


def validate(scenarios, rows):
    errors=[]
    scenario_ids=[x['scenario_id'] for x in scenarios]
    if len(scenario_ids)!=len(set(scenario_ids)): errors.append('duplicate scenario id')
    if not scenarios: errors.append('empty scenarios')
    keyed={x['scenario_id']:x for x in scenarios}
    grouped={}
    for row in rows:
        sid=row.get('scenario_id'); path=row.get('path')
        if sid not in keyed or path not in PATHS:
            errors.append('unknown scenario/path'); continue
        group=grouped.setdefault(sid,{})
        if path in group: errors.append('duplicate path'); continue
        group[path]=row.get('decision')
    for sid,x in keyed.items():
        observed=grouped.get(sid,{})
        if set(observed)!=set(PATHS): errors.append('missing path '+sid);continue
        computed=independently_decide(x)
        for path in PATHS:
            if observed[path]!=computed[path]: errors.append('decision mismatch '+sid+'/'+path)
    if len(rows)!=len(scenarios)*len(PATHS): errors.append('row count mismatch')
    return errors


def negative_controls(scenarios,rows):
    cases=[]
    def run(name,mutate):
        xs=copy.deepcopy(scenarios); ys=copy.deepcopy(rows)
        mutate(xs,ys)
        cases.append((name,len(validate(xs,ys))>0))
    run('duplicate-path',lambda x,y:y.append(copy.deepcopy(y[0])))
    run('missing-path',lambda x,y:y.pop())
    run('extra-path',lambda x,y:y.append(dict(scenario_id=y[0]['scenario_id'],path='phantom',decision='verified')))
    run('duplicate-scenario-id',lambda x,y:x.append(copy.deepcopy(x[0])))
    run('tampered-decision',lambda x,y:y[0].update(decision='fabricated'))
    def mutate_base(field,value):
        return lambda x,y:x[0][field].update(value)
    run('extra-receipt',lambda x,y:x[0]['sink_receipt_rows'].append({**x[0]['sink_receipt_rows'][0],'effect_id':'extra@sink-u7'}))
    run('duplicate-receipt',lambda x,y:x[0]['sink_receipt_rows'].append(copy.deepcopy(x[0]['sink_receipt_rows'][0])))
    run('wrong-attempt',lambda x,y:x[0]['sink_receipt_rows'][0].update(attempt_id='attempt-unknown'))
    run('unauthorized-receipt',lambda x,y:x[0]['sink_receipt_rows'][0].update(authorized=0))
    run('unproven-temporal',lambda x,y:x[0]['sink_receipt_rows'][0].update(time_proof=0))
    run('prior-scope-substitution',lambda x,y:x[0]['prior_query']['scope'].update(target_uid='sink-u8'))
    run('prior-hit-to-miss-conflict',lambda x,y:x[0]['prior_query'].update(state='miss'))
    run('prior-watermark-lag',lambda x,y:x[0]['prior_query'].update(watermark=9))
    run('prior-retention-loss',lambda x,y:x[0]['prior_query'].update(retention_covers=False))
    run('unknown-prior',lambda x,y:x[0]['prior_query'].update(state='unknown'))
    run('membership-replacement',lambda x,y:x[0]['current'].update(membership=['publish@sink-u7','archive@sink-u7']))
    run('membership-witness-stale',lambda x,y:x[0]['current'].update(witness_revision='m7'))
    run('unprotected-completion',lambda x,y:x[0]['current'].update(protected_completion=False))
    run('current-postcondition-false',lambda x,y:x[0]['current'].update(postcondition=False))
    return cases


def main():
    raw_json=JSON.read_bytes()
    scenarios=json.loads(raw_json.decode('utf-8'))
    rows=[]
    for part in PARTS:
        with part.open(encoding='utf-8',newline='') as f:
            reader=csv.DictReader(f)
            assert reader.fieldnames==['scenario_id','path','decision']
            rows.extend(reader)
    raw_csv=('scenario_id,path,decision\n'+''.join(f"{r['scenario_id']},{r['path']},{r['decision']}\n" for r in rows)).encode('utf-8')
    errors=validate(scenarios,rows)
    controls=negative_controls(scenarios,rows)
    failures=[name for name,rejected in controls if not rejected]
    frozen={
        'historical-valid-after-revocation':'verified',
        'offset-advanced-before-sink-commit':'eligible-new-effect',
        'sink-committed-before-offset-advance':'verified',
        'duplicate-receipt-count-two':'duplicate-receipt',
        'extra-receipt-with-valid-pair':'extra-effect',
        'same-count-member-replacement':'membership-mismatch',
        'historical-effect-unauthorized':'historically-unauthorized',
        'authoritative-miss-contradicts-receipts':'evidence-conflict',
        'unknown-prior-no-receipts':'safe-stop-unknown',
        'miss-retention-expired':'safe-stop-unknown',
        'completion-unprotected-toctou':'unprotected-decision',
        'current-postcondition-reversed':'current-incomplete',
    }
    lookup={x['scenario_id']:independently_classify(x) for x in scenarios}
    frozen_mismatch=[name for name,label in frozen.items() if lookup.get(name)!=label]
    full_verified=[name for name,label in lookup.items() if label=='verified']
    weak_false={path:sum(row['path']==path and row['decision']=='verified' and lookup[row['scenario_id']]!='verified' for row in rows) for path in PATHS[:3]}
    out={'scenario_count':len(scenarios),'row_count':len(rows),'verifier_errors':errors,
         'frozen_checks':len(frozen),'frozen_mismatches':frozen_mismatch,
         'negative_controls':len(controls),'negative_rejected':sum(ok for _,ok in controls),
         'negative_failures':failures,'full_verified':len(full_verified),'weak_false_verifications':weak_false,
         'json_sha256':hashlib.sha256(raw_json).hexdigest(),
         'csv_sha256':hashlib.sha256(raw_csv).hexdigest(),
         'real_external_effects':0,'semantic_independence':'LIMITED_SHARED_CONTRACT',
         'status':'PASS' if not(errors or failures or frozen_mismatch) else 'FAIL'}
    print(json.dumps(out,ensure_ascii=False,sort_keys=True))
    if out['status']!='PASS': raise SystemExit(1)

if __name__=='__main__': main()
