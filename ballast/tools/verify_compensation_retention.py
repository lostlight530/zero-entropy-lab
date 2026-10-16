"""Separate primitive-evidence reconstruction, no producer imports or live authority"""
import copy
import csv
import hashlib
import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DAY = '2026-10-17'
PATHS = {'terminal_proxy','key_proxy','count_proxy','full_integrity'}


def classify(f):
    # This is a separately written contract reconstruction, not a call to the producer
    if (f.get('task'),f.get('run'),f.get('attempt')) != ('task-121','run-4','attempt-2'):
        return 'STOP_UNKNOWN'
    if f.get('required_members') != ['A','B'] or f.get('observed_members') != ['A','B']:
        return 'STOP_UNKNOWN'
    if f.get('target') != 'wallet-u4' or f.get('expected_target') != 'wallet-u4':
        return 'STOP_UNKNOWN'
    if f.get('protected') is not True or f.get('membership_revision') != f.get('witness_revision'):
        return 'STOP_UNKNOWN'
    if type(f.get('net_balance')) not in (int,float) or type(f.get('current_permission')) is not bool:
        return 'STOP_UNKNOWN'
    orig = f.get('original_receipts',[])
    comp = f.get('compensation_receipts',[])
    query = f.get('queries',[])
    if len(orig)!=2 or len(query)!=2 or len(comp)>2:
        return 'STOP_UNKNOWN'
    if Counter(x.get('member') for x in orig) != Counter({'A':1,'B':1}):
        return 'STOP_UNKNOWN'
    if Counter(x.get('member') for x in query) != Counter({'A':1,'B':1}):
        return 'STOP_UNKNOWN'
    if any(n!=1 or m not in {'A','B'} for m,n in Counter(x.get('member') for x in comp).items()):
        return 'STOP_UNKNOWN'
    orig_by={x['member']:x for x in orig}
    comp_by={x['member']:x for x in comp}
    query_by={x['member']:x for x in query}
    outstanding=[]
    for m in ('A','B'):
        o=orig_by[m]
        c=comp_by.get(m)
        q=query_by[m]
        if any(o.get(k)!=v for k,v in {
            'task':'task-121','run':'run-4','attempt':'attempt-1',
            'target':'wallet-u4','member':m,'effect_id':f'charge:{m}'}.items()):
            return 'STOP_UNKNOWN'
        if o.get('authorized') is not True or type(o.get('at')) not in (int,float):
            return 'STOP_UNKNOWN'
        if any(q.get(k)!=v for k,v in {
            'task':'task-121','run':'run-4','attempt':'attempt-2',
            'target':'wallet-u4','member':m,'effect_id':f'refund:{m}'}.items()):
            return 'STOP_UNKNOWN'
        if q.get('query_ok') is not True or q.get('retention_covers') is not True:
            return 'STOP_UNKNOWN'
        if type(q.get('watermark')) is not int or type(q.get('required_watermark')) is not int:
            return 'STOP_UNKNOWN'
        if q['watermark'] < q['required_watermark']:
            return 'STOP_UNKNOWN'
        if c is not None:
            if any(c.get(k)!=v for k,v in {
                'task':'task-121','run':'run-4','attempt':'attempt-2',
                'target':'wallet-u4','member':m,'effect_id':f'refund:{m}',
                'original_id':f'charge:{m}'}.items()):
                return 'STOP_UNKNOWN'
            if c.get('authorized') is not True or type(c.get('at')) not in (int,float):
                return 'STOP_UNKNOWN'
            if c['at'] <= o['at']:
                return 'STOP_UNKNOWN'
        status=q.get('status')
        if status=='HIT' and c is None:
            return 'STOP_UNKNOWN'
        if status=='MISS' and c is not None:
            return 'STOP_UNKNOWN'
        if status not in ('HIT','MISS'):
            return 'STOP_UNKNOWN'
        if status=='MISS':
            outstanding.append(m)
    if not outstanding:
        return 'COMPLETE' if f['net_balance']==0 else 'RECONCILE'
    if f['net_balance']==0:
        return 'RECONCILE'
    return 'RETRY' if f['current_permission'] else 'BLOCKED'


def check():
    ev=ROOT/'evidence'
    jp=ev/f'{DAY}-compensation-scenarios.json'
    cp=ev/f'{DAY}-compensation-decisions.csv'
    sp=ev/f'{DAY}-compensation-summary.json'
    j=json.loads(jp.read_text(encoding='utf-8'))
    summary=json.loads(sp.read_text(encoding='utf-8'))
    with cp.open(encoding='utf-8',newline='') as f: rows=list(csv.DictReader(f))
    problems=[]
    if summary['json_sha256']!=hashlib.sha256(jp.read_bytes()).hexdigest(): problems.append('json_digest')
    if summary['csv_sha256']!=hashlib.sha256(cp.read_bytes()).hexdigest(): problems.append('csv_digest')
    ss=j['scenarios']
    ids=[s['id'] for s in ss]
    if len(ids)!=len(set(ids)) or len(ids)!=36: problems.append('scenario_uniqueness')
    row_keys=[(r['scenario'],r['path']) for r in rows]
    if len(rows)!=144 or len(row_keys)!=len(set(row_keys)) or set(row_keys)!={(sid,p) for sid in ids for p in PATHS}:
        problems.append('csv_coverage')
    frozen={
        'baseline_complete':'COMPLETE','permission_restored_after_effect':'COMPLETE',
        'expired_key_effect_exists':'COMPLETE','covered_miss_retry':'RETRY',
        'covered_miss_expired_key':'RETRY','covered_miss_no_permission':'BLOCKED',
        'miss_net_already_restored':'RECONCILE','current_net_state_reversed':'RECONCILE'
    }
    by_id={s['id']:s['facts'] for s in ss}
    for sid in ids:
        actual=classify(by_id[sid])
        expected=frozen.get(sid,'STOP_UNKNOWN')
        if actual!=expected: problems.append(f'frozen:{sid}:{actual}!={expected}')
    for r in rows:
        facts=by_id.get(r['scenario'])
        if facts is None or r['path'] not in PATHS: problems.append('unknown_row');continue
        p=r['path']
        if p=='full_integrity': decision=classify(facts)
        elif p=='terminal_proxy': decision='COMPLETE' if facts['terminal']=='CANCELED' and facts['compensation_scheduled'] else 'RETRY'
        elif p=='key_proxy': decision='COMPLETE' if facts['key_live'] else 'RETRY'
        else: decision='COMPLETE' if len(facts['compensation_receipts'])==len(facts['required_members']) else 'RETRY'
        if r['decision']!=decision: problems.append(f'row:{r["scenario"]}:{p}')
    if summary['scenarios']!=36 or summary['rows']!=144 or summary['real_effects']!=0:
        problems.append('summary_counts')
    # Rebuild local sink effect counts from raw SINK_CALL events, not producer decisions
    tp=ev/f'{DAY}-compensation-sink-trace.json'
    trace=json.loads(tp.read_text(encoding='utf-8'))
    if summary.get('trace_sha256')!=hashlib.sha256(tp.read_bytes()).hexdigest():
        problems.append('trace_digest')
    expected_sink={
        'expired_blind_retry':(2,2),'live_key_dedup':(2,1),
        'covered_hit_safe_stop':(1,1),'query_failure_safe_stop':(1,1),
        'retention_gap_safe_stop':(1,1),'conflicting_miss_safe_stop':(1,1),
        'wrong_scope_safe_stop':(1,1),'covered_miss_authorized':(1,1),
        'covered_miss_revoked':(0,0),
    }
    sink_calls=0
    for trial in trace['trials']:
        evs=trial['events']
        calls=[e for e in evs if e['kind']=='SINK_CALL']
        committed=[e for e in calls if e['result']=='COMMITTED']
        sink_calls+=len(calls)
        if (len(calls),len(committed))!=expected_sink.get(trial['trial']):
            problems.append(f'sink_trace:{trial["trial"]}')
        if len(trial['ledger'])!=len(committed):
            problems.append(f'sink_ledger:{trial["trial"]}')
        if [e['at'] for e in committed]!=[x['at'] for x in trial['ledger']]:
            problems.append(f'sink_order:{trial["trial"]}')
        if trial['trial']=='expired_blind_retry' and not (committed[1]['at']-committed[0]['at']>=trial['key_retention']):
            problems.append('expiry_not_covered')
        if trial['trial']=='live_key_dedup' and not any(e['result']=='DEDUPED' for e in calls):
            problems.append('live_key_not_deduped')
        if trial['trial']=='covered_miss_revoked' and any(e['kind']=='SINK_CALL' for e in evs):
            problems.append('unauthorized_sink_call')
    if len(trace['trials'])!=9 or summary.get('local_sink_trials')!=9:
        problems.append('sink_trial_count')
    if summary.get('local_sink_committed_effects')!=sum(len(t['ledger']) for t in trace['trials']):
        problems.append('sink_effect_count')
    # Mutations attack the full reference without importing or calling the producer
    baseline=copy.deepcopy(by_id['baseline_complete'])
    tests=[]
    def probe(name, fn, expected='STOP_UNKNOWN'):
        s=copy.deepcopy(baseline);fn(s);tests.append((name,classify(s),expected))
    probe('auth_string',lambda s:s['compensation_receipts'][0].update(authorized='false'))
    probe('time_string',lambda s:s['compensation_receipts'][0].update(at='20'))
    probe('time_reverse',lambda s:s['compensation_receipts'][0].update(at=9))
    probe('wrong_original',lambda s:s['compensation_receipts'][0].update(original_id='charge:B'))
    probe('wrong_effect',lambda s:s['compensation_receipts'][0].update(effect_id='refund:C'))
    probe('wrong_task',lambda s:s['compensation_receipts'][0].update(task='task-other'))
    probe('wrong_attempt',lambda s:s['compensation_receipts'][0].update(attempt='attempt-3'))
    probe('wrong_target',lambda s:s['compensation_receipts'][0].update(target='wallet-u5'))
    probe('duplicate',lambda s:s['compensation_receipts'].append(copy.deepcopy(s['compensation_receipts'][0])))
    probe('extra',lambda s:s['compensation_receipts'].append(dict(s['compensation_receipts'][0],member='C',effect_id='refund:C')))
    probe('miss_conflict',lambda s:s['queries'][0].update(status='MISS'))
    probe('hit_wrong_scope',lambda s:s['queries'][0].update(task='task-other'))
    probe('query_failure',lambda s:s['queries'][0].update(query_ok=False))
    probe('retention',lambda s:s['queries'][0].update(retention_covers=False))
    probe('watermark',lambda s:s['queries'][0].update(watermark=0))
    probe('watermark_string',lambda s:s['queries'][0].update(watermark='30'))
    probe('query_duplicate',lambda s:s['queries'].append(copy.deepcopy(s['queries'][0])))
    probe('original_unauthorized',lambda s:s['original_receipts'][0].update(authorized=False))
    probe('original_missing',lambda s:s['original_receipts'].pop())
    probe('original_extra',lambda s:s['original_receipts'].append(copy.deepcopy(s['original_receipts'][0])))
    probe('incarnation',lambda s:s.update(target='wallet-u5'))
    probe('member_swap',lambda s:s.update(observed_members=['A','C']))
    probe('duplicate_member',lambda s:s.update(observed_members=['A','A']))
    probe('member_revision',lambda s:s.update(witness_revision=20))
    probe('contract_rewrite',lambda s:s.update(required_members=['A','C']))
    probe('unprotected',lambda s:s.update(protected=False))
    probe('current_net_reversal',lambda s:s.update(net_balance=100),'RECONCILE')
    probe('permission_string',lambda s:s.update(current_permission='true'))
    probe('hit_without_receipt',lambda s:s['compensation_receipts'].pop(0))
    probe('unknown_query',lambda s:s['queries'][0].update(status='UNKNOWN'))
    probe('query_member_extra',lambda s:s['queries'][0].update(member='C'))
    probe('query_wrong_target',lambda s:s['queries'][0].update(target='wallet-u5'))
    probe('terminal_not_proof',lambda s:s.update(protected=False,terminal='CANCELED'))
    for name,got,want in tests:
        if got!=want: problems.append(f'mutation:{name}:{got}!={want}')
    # Missing receipt with valid covered MISS is the only authorized new-effect branch
    for sid,want in [('covered_miss_retry','RETRY'),('covered_miss_expired_key','RETRY'),
                     ('covered_miss_no_permission','BLOCKED'),('unknown_missing_a','STOP_UNKNOWN')]:
        if classify(by_id[sid])!=want: problems.append(f'retry_gate:{sid}')
    print(json.dumps({'scenario_count':len(ids),'row_count':len(rows),'frozen_checks':len(ids),
                      'local_sink_trials':len(trace['trials']),'local_sink_calls':sink_calls,'negative_controls':len(tests),'negative_rejected':sum(a==b for _,a,b in tests),
                      'errors':problems,'status':'PASS' if not problems else 'FAIL'},sort_keys=True))
    return 0 if not problems else 1

if __name__=='__main__': raise SystemExit(check())
