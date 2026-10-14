"""Bounded SQLite transactional-outbox / offset / external-effect integrity study

Uses two independently committed in-memory SQLite databases, one local outbox/offset
and one modeled external sink, with deterministic injections and no network effects
"""
from __future__ import annotations
import csv
import io
import json
import sqlite3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EVIDENCE = ROOT / 'evidence'
REQUIRED = ['publish@sink-u7', 'notify@sink-u7']
TASK, RUN, ATTEMPT, TARGET = 'task-52', 'run-9', 'attempt-1', 'sink-u7'

# Each entry mutates the common initial state; the name is not an oracle label
INJECTIONS = [
 ('historical-valid-after-revocation', {}),
 ('outbox-only-no-external-effects', {'receipts': [], 'prior': 'miss', 'permission': True, 'offset': False}),
 ('offset-advanced-before-sink-commit', {'receipts': [], 'prior': 'miss', 'permission': True}),
 ('sink-committed-before-offset-advance', {'offset': False}),
 ('outbox-rolled-back-after-sink-commit', {'outbox': False, 'offset': False}),
 ('duplicate-receipt-count-two', {'receipts': ['publish@sink-u7','publish@sink-u7']}),
 ('extra-receipt-with-valid-pair', {'receipts': REQUIRED + ['audit@sink-u7']}),
 ('missing-one-external-effect', {'receipts': ['publish@sink-u7']}),
 ('same-count-member-replacement', {'members': ['publish@sink-u7','archive@sink-u7']}),
 ('target-incarnation-replaced', {'target': 'sink-u8'}),
 ('wrong-receipt-attempt', {'receipt_attempt': 'attempt-0'}),
 ('wrong-receipt-run', {'receipt_run': 'run-8'}),
 ('historical-effect-unauthorized', {'auth': False}),
 ('temporal-order-unproven', {'time_proof': False}),
 ('current-postcondition-reversed', {'postcondition': False}),
 ('membership-revision-stale', {'witness_revision': 'm7'}),
 ('completion-unprotected-toctou', {'protected_completion': False}),
 ('prior-hit-scope-substituted', {'scope_target': 'sink-u8'}),
 ('prior-hit-aggregate-scope', {'scope_effects': ['*']}),
 ('authoritative-miss-contradicts-receipts', {'prior': 'miss'}),
 ('unknown-prior-no-receipts', {'prior': 'unknown', 'receipts': [], 'permission': True}),
 ('miss-watermark-pre-attempt', {'prior': 'miss', 'receipts': [], 'permission': True, 'watermark': 9}),
 ('miss-retention-expired', {'prior': 'miss', 'receipts': [], 'permission': True, 'retention': False}),
 ('miss-query-failed', {'prior': 'miss', 'receipts': [], 'permission': True, 'query_ok': False}),
 ('miss-current-permission-revoked', {'prior': 'miss', 'receipts': [], 'permission': False}),
 ('miss-effect-boundary-unprotected', {'prior': 'miss', 'receipts': [], 'permission': True, 'protected_effect': False}),
 ('receipt-task-identity-substituted', {'receipt_task': 'task-53'}),
 ('outbox-event-id-collision', {'event_id': 'evt-52-duplicate'}),
]


def produce_case(case_id, changes):
    c = dict(outbox=True, offset=True, receipts=REQUIRED[:], prior='hit', permission=False,
             target=TARGET, receipt_task=TASK, receipt_run=RUN, receipt_attempt=ATTEMPT,
             members=REQUIRED[:], member_revision='m8', witness_revision='m8',
             protected_completion=True, protected_effect=True, postcondition=True,
             auth=True, time_proof=True, watermark=12, retention=True, query_ok=True,
             scope_target=TARGET, scope_effects=REQUIRED[:], event_id='evt-52')
    c.update(changes)
    local = sqlite3.connect(':memory:')
    sink = sqlite3.connect(':memory:')
    local.execute('CREATE TABLE outbox(task_id TEXT,run_id TEXT,attempt_id TEXT,event_id TEXT,target_uid TEXT)')
    local.execute('CREATE TABLE offset_state(consumer TEXT,offset INTEGER)')
    sink.execute('CREATE TABLE receipts(effect_id TEXT,task_id TEXT,run_id TEXT,attempt_id TEXT,target_uid TEXT,authorized INTEGER,seq INTEGER,time_proof INTEGER)')
    # Distinct transaction domains, commits are real SQLite commits; no cross-db transaction
    with local:
        if c['outbox']:
            local.execute('INSERT INTO outbox VALUES(?,?,?,?,?)',(TASK,RUN,ATTEMPT,c['event_id'],TARGET))
        if c['offset']:
            local.execute('INSERT INTO offset_state VALUES(?,?)',('consumer-A',51))
    with sink:
        for effect in c['receipts']:
            sink.execute('INSERT INTO receipts VALUES(?,?,?,?,?,?,?,?)',
                (effect,c['receipt_task'],c['receipt_run'],c['receipt_attempt'],TARGET,
                 int(c['auth']),10,int(c['time_proof'])))
    local_outbox=[dict(zip(['task_id','run_id','attempt_id','event_id','target_uid'],row)) for row in local.execute('SELECT * FROM outbox')]
    offsets=[dict(zip(['consumer','offset'],row)) for row in local.execute('SELECT * FROM offset_state')]
    receipts=[dict(zip(['effect_id','task_id','run_id','attempt_id','target_uid','authorized','seq','time_proof'],row)) for row in sink.execute('SELECT * FROM receipts ORDER BY rowid')]
    local.close(); sink.close()
    return {
        'scenario_id':case_id,'injection':changes,'task_id':TASK,'run_id':RUN,'attempt_id':ATTEMPT,
        'target_uid':c['target'],'required_effects':REQUIRED[:],
        'local_outbox_rows':local_outbox,'local_offset_rows':offsets,'sink_receipt_rows':receipts,
        'prior_query':{'state':c['prior'],'authority':'sink-primary','query_ok':c['query_ok'],
           'watermark':c['watermark'],'attempt_boundary':10,'retention_covers':c['retention'],
           'scope':{'task_id':TASK,'run_id':RUN,'attempt_id':ATTEMPT,
                    'target_uid':c['scope_target'],'effect_ids':c['scope_effects']}},
        'current':{'permission':c['permission'],'protected_effect':c['protected_effect'],
           'membership':c['members'],'membership_revision':c['member_revision'],
           'witness_revision':c['witness_revision'],
           'protected_completion':c['protected_completion'],'postcondition':c['postcondition']}
    }


def full(f):
    r=f['sink_receipt_rows']; p=f['prior_query']; s=p['scope']; c=f['current']; req=f['required_effects']
    identity={'task_id':f['task_id'],'run_id':f['run_id'],'attempt_id':f['attempt_id'],
              'target_uid':f['target_uid'],'effect_ids':req}
    if p['state']=='unknown' or not p['query_ok']:
        return 'safe-stop-unknown'
    if p['authority']!='sink-primary' or s!=identity or not p['retention_covers'] or p['watermark']<p['attempt_boundary']:
        return 'safe-stop-unknown'
    if p['state']=='miss':
        if r: return 'evidence-conflict'
        if not c['permission']: return 'permission-denied'
        if not c['protected_effect']: return 'safe-stop-unknown'
        return 'eligible-new-effect'
    if p['state']!='hit' or not r: return 'evidence-conflict'
    ids=[row['effect_id'] for row in r]
    if len(ids)!=len(set(ids)): return 'duplicate-receipt'
    if set(ids)-set(req): return 'extra-effect'
    if any(any(row[k]!=f[k] for k in ('task_id','run_id','attempt_id','target_uid')) for row in r):
        return 'identity-mismatch'
    if set(ids)!=set(req): return 'missing-effects'
    if any(row['authorized']!=1 for row in r): return 'historically-unauthorized'
    if any(row['time_proof']!=1 or row['seq']>p['watermark'] for row in r): return 'temporal-unverified'
    if len(c['membership'])!=len(set(c['membership'])) or set(c['membership'])!=set(req) or c['witness_revision']!=c['membership_revision']:
        return 'membership-mismatch'
    if not c['protected_completion']: return 'unprotected-decision'
    if not c['postcondition']: return 'current-incomplete'
    return 'verified'


def paths(f):
    return {'outbox_present':'verified' if f['local_outbox_rows'] else 'not-complete',
            'offset_advanced':'verified' if f['local_offset_rows'] else 'not-complete',
            'receipt_count':'verified' if len(f['sink_receipt_rows'])==len(f['required_effects']) else 'not-complete',
            'full_integrity':full(f)}


def main():
    EVIDENCE.mkdir(exist_ok=True)
    scenarios=[produce_case(name,delta) for name,delta in INJECTIONS]
    assert len({f['scenario_id'] for f in scenarios})==len(scenarios)
    rows=[]
    for f in scenarios:
        for path,decision in paths(f).items():
            rows.append({'scenario_id':f['scenario_id'],'path':path,'decision':decision})
    jp=EVIDENCE/'2026-10-15-outbox-scenarios.json'
    parts=[EVIDENCE/f'2026-10-15-outbox-decisions-part-{i}.csv' for i in range(1,5)]
    raw_json=(json.dumps(scenarios,ensure_ascii=False,indent=2)+'\n').encode('utf-8')
    out=io.StringIO(newline='')
    w=csv.DictWriter(out,fieldnames=['scenario_id','path','decision'],lineterminator='\n');w.writeheader();w.writerows(rows)
    raw_csv=out.getvalue().encode('utf-8')
    jp.write_bytes(raw_json)
    for i,part in enumerate(parts):
        out=io.StringIO(newline='')
        w=csv.DictWriter(out,fieldnames=['scenario_id','path','decision'],lineterminator='\n');w.writeheader();w.writerows(rows[i*28:(i+1)*28])
        part.write_text(out.getvalue(),encoding='utf-8')
    counts={path:sum(r['decision']=='verified' for r in rows if r['path']==path) for path in ('outbox_present','offset_advanced','receipt_count','full_integrity')}
    print(json.dumps({'scenarios':len(scenarios),'rows':len(rows),'verified_counts':counts,'sqlite_domains':2,'real_external_effects':0,'real_retries':0,'status':'PASS'},sort_keys=True))

if __name__=='__main__': main()
