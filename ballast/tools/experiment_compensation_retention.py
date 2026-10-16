"""Bounded synthetic compensation-recovery study, no network or real effects"""
import copy
import csv
import hashlib
import io
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DAY = '2026-10-17'
PATHS = ('terminal_proxy', 'key_proxy', 'count_proxy', 'full_integrity')


def baseline():
    members = ['A', 'B']
    return {
        'task': 'task-121', 'run': 'run-4', 'attempt': 'attempt-2',
        'target': 'wallet-u4', 'expected_target': 'wallet-u4',
        'required_members': members[:], 'observed_members': members[:],
        'membership_revision': 21, 'witness_revision': 21,
        'protected': True, 'net_balance': 0, 'current_permission': False,
        'terminal': 'CANCELED', 'compensation_scheduled': True,
        'key_live': True,
        'original_receipts': [
            dict(member=m, effect_id=f'charge:{m}', task='task-121', run='run-4',
                 attempt='attempt-1', target='wallet-u4', authorized=True, at=10+i)
            for i, m in enumerate(members)
        ],
        'compensation_receipts': [
            dict(member=m, effect_id=f'refund:{m}', original_id=f'charge:{m}',
                 task='task-121', run='run-4', attempt='attempt-2',
                 target='wallet-u4', authorized=True, at=20+i)
            for i, m in enumerate(members)
        ],
        'queries': [
            dict(member=m, effect_id=f'refund:{m}', task='task-121',
                 run='run-4', attempt='attempt-2', target='wallet-u4',
                 status='HIT', query_ok=True, watermark=30,
                 required_watermark=25, retention_covers=True)
            for m in members
        ]
    }


def no_a(s, status='UNKNOWN', permission=False):
    s['compensation_receipts'] = [r for r in s['compensation_receipts'] if r['member'] != 'A']
    s['queries'][0]['status'] = status
    s['net_balance'] = 100
    s['current_permission'] = permission


def scenarios():
    names = [
        'baseline_complete', 'permission_restored_after_effect', 'expired_key_effect_exists',
        'unknown_missing_a', 'covered_miss_retry', 'covered_miss_no_permission',
        'miss_expired_retention', 'miss_stale_watermark', 'miss_wrong_scope',
        'miss_query_error', 'miss_net_already_restored', 'duplicate_compensation',
        'extra_compensation', 'wrong_original_binding', 'unauthorized_compensation',
        'reversed_effect_time', 'non_numeric_effect_time', 'target_reincarnation',
        'same_count_membership_swap', 'current_net_state_reversed',
        'unprotected_completion', 'miss_positive_conflict', 'hit_wrong_scope',
        'unauthorized_original', 'missing_original', 'wrong_attempt',
        'string_authorization', 'extra_original', 'duplicate_membership',
        'task_contract_rewritten', 'covered_miss_expired_key',
        'unknown_with_live_key', 'hit_without_receipt', 'wrong_receipt_target',
        'invalid_watermark_type', 'membership_revision_drift'
    ]
    out = []
    for name in names:
        s = baseline()
        if name == 'permission_restored_after_effect': s['current_permission'] = True
        if name == 'expired_key_effect_exists': s['key_live'] = False
        if name == 'unknown_missing_a': no_a(s)
        if name == 'covered_miss_retry': no_a(s, 'MISS', True)
        if name == 'covered_miss_no_permission': no_a(s, 'MISS', False)
        if name == 'miss_expired_retention':
            no_a(s, 'MISS', True); s['queries'][0]['retention_covers'] = False
        if name == 'miss_stale_watermark':
            no_a(s, 'MISS', True); s['queries'][0]['watermark'] = 20
        if name == 'miss_wrong_scope':
            no_a(s, 'MISS', True); s['queries'][0]['target'] = 'wallet-other'
        if name == 'miss_query_error':
            no_a(s, 'MISS', True); s['queries'][0]['query_ok'] = False
        if name == 'miss_net_already_restored':
            no_a(s, 'MISS', True); s['net_balance'] = 0
        if name == 'duplicate_compensation':
            s['compensation_receipts'][1] = copy.deepcopy(s['compensation_receipts'][0])
        if name == 'extra_compensation':
            s['compensation_receipts'].append(dict(s['compensation_receipts'][0], member='C', effect_id='refund:C'))
        if name == 'wrong_original_binding': s['compensation_receipts'][0]['original_id'] = 'charge:B'
        if name == 'unauthorized_compensation': s['compensation_receipts'][0]['authorized'] = False
        if name == 'reversed_effect_time': s['compensation_receipts'][0]['at'] = 9
        if name == 'non_numeric_effect_time': s['compensation_receipts'][0]['at'] = '20'
        if name == 'target_reincarnation': s['target'] = 'wallet-u5'
        if name == 'same_count_membership_swap': s['observed_members'] = ['A', 'C']
        if name == 'current_net_state_reversed': s['net_balance'] = 100
        if name == 'unprotected_completion': s['protected'] = False
        if name == 'miss_positive_conflict': s['queries'][0]['status'] = 'MISS'
        if name == 'hit_wrong_scope': s['queries'][0]['task'] = 'task-other'
        if name == 'unauthorized_original': s['original_receipts'][0]['authorized'] = False
        if name == 'missing_original': s['original_receipts'].pop()
        if name == 'wrong_attempt': s['compensation_receipts'][0]['attempt'] = 'attempt-3'
        if name == 'string_authorization': s['compensation_receipts'][0]['authorized'] = 'false'
        if name == 'extra_original': s['original_receipts'].append(dict(s['original_receipts'][0], member='C', effect_id='charge:C'))
        if name == 'duplicate_membership': s['observed_members'] = ['A', 'A']
        if name == 'task_contract_rewritten': s['required_members'] = ['A', 'C']
        if name == 'covered_miss_expired_key':
            no_a(s, 'MISS', True); s['key_live'] = False
        if name == 'unknown_with_live_key': no_a(s, 'UNKNOWN', True)
        if name == 'hit_without_receipt': no_a(s, 'HIT', True)
        if name == 'wrong_receipt_target': s['compensation_receipts'][0]['target'] = 'wallet-u5'
        if name == 'invalid_watermark_type': s['queries'][0]['watermark'] = '30'
        if name == 'membership_revision_drift': s['witness_revision'] = 20
        out.append({'id': name, 'facts': s})
    return out


def exact(row, s, member, kind):
    fields = ('task', 'run', 'target')
    if any(row.get(k) != s[k] for k in fields): return False
    if row.get('member') != member: return False
    if row.get('effect_id') != f'{kind}:{member}': return False
    if row.get('attempt') != ('attempt-1' if kind == 'charge' else s['attempt']): return False
    if type(row.get('authorized')) is not bool or not row['authorized']: return False
    if type(row.get('at')) not in (int, float): return False
    if kind == 'refund' and row.get('original_id') != f'charge:{member}': return False
    return True


def full(s):
    if s['task'] != 'task-121' or s['run'] != 'run-4' or s['attempt'] != 'attempt-2': return 'STOP_UNKNOWN'
    if s['required_members'] != ['A', 'B']: return 'STOP_UNKNOWN'
    if s['target'] != s['expected_target'] or s['expected_target'] != 'wallet-u4': return 'STOP_UNKNOWN'
    if s['observed_members'] != ['A', 'B'] or s['membership_revision'] != s['witness_revision']: return 'STOP_UNKNOWN'
    if s['protected'] is not True or type(s['net_balance']) not in (int, float): return 'STOP_UNKNOWN'
    if type(s['current_permission']) is not bool: return 'STOP_UNKNOWN'
    originals, comps, queries = s['original_receipts'], s['compensation_receipts'], s['queries']
    if len(originals) != 2 or len(queries) != 2 or len(comps) > 2: return 'STOP_UNKNOWN'
    if {r.get('member') for r in originals} != {'A','B'}: return 'STOP_UNKNOWN'
    if {q.get('member') for q in queries} != {'A','B'}: return 'STOP_UNKNOWN'
    if len({r.get('member') for r in comps}) != len(comps): return 'STOP_UNKNOWN'
    for m in ['A','B']:
        orig = next(r for r in originals if r['member'] == m)
        q = next(r for r in queries if r['member'] == m)
        if not exact(orig, s, m, 'charge'): return 'STOP_UNKNOWN'
        if any(q.get(k) != v for k,v in dict(task=s['task'],run=s['run'],attempt=s['attempt'],target=s['target'],member=m,effect_id=f'refund:{m}').items()): return 'STOP_UNKNOWN'
        if q.get('query_ok') is not True or q.get('retention_covers') is not True: return 'STOP_UNKNOWN'
        if type(q.get('watermark')) is not int or type(q.get('required_watermark')) is not int: return 'STOP_UNKNOWN'
        if q['watermark'] < q['required_watermark']: return 'STOP_UNKNOWN'
        matches = [r for r in comps if r['member'] == m]
        if q.get('status') == 'HIT':
            if len(matches) != 1 or not exact(matches[0], s, m, 'refund') or matches[0]['at'] <= orig['at']:
                return 'STOP_UNKNOWN'
        elif q.get('status') == 'MISS':
            if matches: return 'STOP_UNKNOWN'
        else: return 'STOP_UNKNOWN'
    if all(q['status'] == 'HIT' for q in queries):
        return 'COMPLETE' if s['net_balance'] == 0 else 'RECONCILE'
    if s['net_balance'] == 0: return 'RECONCILE'
    return 'RETRY' if s['current_permission'] else 'BLOCKED'


def decide(path, s):
    if path == 'terminal_proxy': return 'COMPLETE' if s['terminal'] == 'CANCELED' and s['compensation_scheduled'] else 'RETRY'
    if path == 'key_proxy': return 'COMPLETE' if s['key_live'] else 'RETRY'
    if path == 'count_proxy': return 'COMPLETE' if len(s['compensation_receipts']) == len(s['required_members']) else 'RETRY'
    return full(s)



def sink_trials():
    """Execute actual local sink calls, including a response-loss and key-expiry window"""
    trace=[]
    specs=[
        ('expired_blind_retry','initial_then_retry',11),
        ('live_key_dedup','initial_then_retry',5),
        ('covered_hit_safe_stop','initial_then_hit',11),
        ('query_failure_safe_stop','initial_then_unknown',11),
        ('retention_gap_safe_stop','initial_then_expired_miss',11),
        ('conflicting_miss_safe_stop','initial_then_conflict',11),
        ('wrong_scope_safe_stop','initial_then_wrong_scope',11),
        ('covered_miss_authorized','new_authorized',11),
        ('covered_miss_revoked','new_revoked',11),
    ]
    for name,mode,t in specs:
        ledger=[];keys={};events=[]
        def call(at):
            key='refund:A:request-1'
            if key in keys and at<keys[key]:
                events.append({'kind':'SINK_CALL','at':at,'key':key,'result':'DEDUPED','effect_id':'refund:A'})
                return
            ledger.append({'effect_id':'refund:A','sequence':len(ledger)+1,'at':at})
            keys[key]=at+10
            events.append({'kind':'SINK_CALL','at':at,'key':key,'result':'COMMITTED','effect_id':'refund:A'})
        if mode.startswith('initial_'):
            call(0)
            events.append({'kind':'RESPONSE_LOST','at':0,'effect_id':'refund:A'})
        if mode=='initial_then_retry': call(t)
        elif mode=='initial_then_hit':
            events.append({'kind':'QUERY','at':t,'result':'HIT','scope':'EXACT','retention':'COVERED'})
        elif mode=='initial_then_unknown':
            events.append({'kind':'QUERY','at':t,'result':'UNKNOWN','scope':'EXACT','retention':'COVERED'})
        elif mode=='initial_then_expired_miss':
            events.append({'kind':'QUERY','at':t,'result':'MISS','scope':'EXACT','retention':'EXPIRED'})
        elif mode=='initial_then_conflict':
            events.append({'kind':'QUERY','at':t,'result':'MISS','scope':'EXACT','retention':'COVERED','conflict':'POSITIVE_LEDGER'})
        elif mode=='initial_then_wrong_scope':
            events.append({'kind':'QUERY','at':t,'result':'MISS','scope':'OTHER_TARGET','retention':'COVERED'})
        elif mode.startswith('new_'):
            events.append({'kind':'QUERY','at':t,'result':'MISS','scope':'EXACT','retention':'COVERED'})
            events.append({'kind':'PERMISSION','at':t,'value':mode=='new_authorized'})
            if mode=='new_authorized': call(t)
        trace.append({'trial':name,'mode':mode,'key_retention':10,'events':events,'ledger':ledger})
    return trace


def produce():
    ss = scenarios()
    rows = [{'scenario': s['id'], 'path': p, 'decision': decide(p, s['facts'])} for s in ss for p in PATHS]
    ev = ROOT / 'evidence'; ev.mkdir(parents=True, exist_ok=True)
    jp = ev / f'{DAY}-compensation-scenarios.json'
    cp = ev / f'{DAY}-compensation-decisions.csv'
    payload = {'logical_date': DAY, 'base_sha': '71a2c45f208198b6963f59eda7e99da88e1bd48b',
               'source_access_date': DAY, 'scenario_kind': 'authored_synthetic', 'scenarios': ss}
    jp.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    with cp.open('w', encoding='utf-8', newline='') as f:
        w=csv.DictWriter(f,fieldnames=('scenario','path','decision'),lineterminator='\n');w.writeheader();w.writerows(rows)
    counts = {p: {status: sum(r['path']==p and r['decision']==status for r in rows) for status in ('COMPLETE','RETRY','STOP_UNKNOWN','BLOCKED','RECONCILE')} for p in PATHS}
    truth = {s['id']:full(s['facts']) for s in ss}
    false_complete = {p:sum(r['path']==p and r['decision']=='COMPLETE' and truth[r['scenario']]!='COMPLETE' for r in rows) for p in PATHS[:-1]}
    unsafe_retry = {p:sum(r['path']==p and r['decision']=='RETRY' and truth[r['scenario']]!='RETRY' for r in rows) for p in PATHS[:-1]}
    summary={'logical_date':DAY,'base_sha':payload['base_sha'],'source_access_date':DAY,
             'scenarios':len(ss),'paths':len(PATHS),'rows':len(rows),'real_effects':0,
             'counts':counts,'modeled_false_complete':false_complete,'modeled_unsafe_retry':unsafe_retry,
             'json_sha256':hashlib.sha256(jp.read_bytes()).hexdigest(),
             'csv_sha256':hashlib.sha256(cp.read_bytes()).hexdigest()}
    tp=ev/f'{DAY}-compensation-sink-trace.json'
    trace=sink_trials()
    tp.write_text(json.dumps({'logical_date':DAY,'kind':'executed_local_simulated_sink','trials':trace},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    summary['local_sink_trials']=len(trace)
    summary['local_sink_committed_effects']=sum(len(t['ledger']) for t in trace)
    summary['trace_sha256']=hashlib.sha256(tp.read_bytes()).hexdigest()
    sp=ev/f'{DAY}-compensation-summary.json'
    sp.write_text(json.dumps(summary,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(summary,ensure_ascii=False,sort_keys=True))
    return summary


if __name__ == '__main__': produce()
