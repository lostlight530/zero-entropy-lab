from __future__ import annotations
import copy, csv, hashlib, json, sys
from collections import Counter
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
E=ROOT/'evidence'
PREFIX='2026-10-18-handoff'
TASK='handoff-task-18';RUN='run-8'


def canon(x):return json.dumps(x,ensure_ascii=False,sort_keys=True,indent=2)+'\n'


def digest(s):return hashlib.sha256(s.encode('utf-8')).hexdigest()


def classify(x):
    q=x['prior_query']; c=x['control']; r=x['receipts']; w=x['completion_witness']; ledger=x['sink_effects']
    for k in ('healthy','exact_scope','retention_covers_attempt'):
        if type(q.get(k)) is not bool or not q[k]:return 'STOP_UNKNOWN'
    if q.get('status') not in ('HIT','MISS','UNKNOWN'):return 'STOP_UNKNOWN'
    if type(q.get('visibility_watermark')) is not int or type(q.get('minimum_watermark')) is not int or q['visibility_watermark']<q['minimum_watermark'] or q['status']=='UNKNOWN':return 'STOP_UNKNOWN'
    if q['status']=='MISS':
        if r or ledger:return 'RECONCILE'
        return 'RETRY_ALLOWED' if type(c.get('permission')) is int and c['permission']==1 else 'BLOCKED'
    if not r:return 'STOP_UNKNOWN'
    if len({z['effect_key'] for z in r})!=len(r) or len({z['member'] for z in r})!=len(r):return 'RECONCILE'
    if len(c['members'])!=len(set(c['members'])):return 'RECONCILE'
    for z in r:
        if type(z.get('historical_authorized')) is not int or z['historical_authorized']!=1:return 'RECONCILE'
        if type(z.get('fence_accepted')) is not int or z['fence_accepted']!=1:return 'RECONCILE'
        if z.get('task')!=TASK or z.get('run')!=RUN or z.get('attempt')!='attempt-2' or z.get('incarnation')!=c['incarnation'] or type(z.get('tick')) is not int:return 'RECONCILE'
    if {z['member'] for z in r}!=set(c['members']):return 'RECONCILE'
    if sorted(canon(z) for z in r)!=sorted(canon(z) for z in ledger):return 'RECONCILE'
    if type(w.get('protected')) is not bool or not w['protected']:return 'STOP_UNKNOWN'
    if w['revision']!=c['revision'] or w['incarnation']!=c['incarnation'] or len(w['members'])!=len(set(w['members'])) or set(w['members'])!=set(c['members']):return 'STOP_UNKNOWN'
    if any(z['tick']>w['verified_tick'] for z in r):return 'STOP_UNKNOWN'
    return 'COMPLETE'


def validate_journal(x):
    c={'epoch':1,'holder':'old','permission':1,'incarnation':'target-inc-8','revision':5,'members':['A','B']}
    effects={}
    for op in x['operations']:
        if op['op']=='control_update':
            if op['before']!=c:return 'bad_before'
            c=op['after'].copy()
        elif op['op']=='effect_attempt':
            eligible=(op['worker']==c['holder'] and op['epoch']==c['epoch'] and op['revision_seen']==c['revision'] and op['incarnation_seen']==c['incarnation'] and c['permission']==1 and op['member'] in c['members'])
            if eligible is not op['eligible_at_commit']:return 'eligibility_mismatch'
            expected=(not op['protected'] or eligible) and op['key'] not in effects
            if expected is not op['accepted']:return 'commit_mismatch'
            if expected:
                effects[op['key']]={'effect_key':op['key'],'task':TASK,'run':RUN,'attempt':op['attempt'],'epoch':op['epoch'],'holder':op['worker'],'member':op['member'],'incarnation':op['incarnation_seen'],'historical_authorized':int(eligible),'fence_accepted':int(op['protected'] and eligible),'tick':op['tick']}
        else:return 'unknown_operation'
    if c!=x['control']:return 'final_control_mismatch'
    if sorted(effects.values(),key=lambda z:z['effect_key'])!=x['sink_effects']:return 'sink_ledger_mismatch'
    return None


def main():
    source=(E/(PREFIX+'-events.json')).read_text(encoding='utf-8')
    decisions=(E/(PREFIX+'-decisions.csv')).read_text(encoding='utf-8')
    summary=json.loads((E/(PREFIX+'-summary.json')).read_text(encoding='utf-8'))
    xs=json.loads(source)['scenarios']; rows=list(csv.DictReader(decisions.splitlines()))
    errors=[]
    if len(xs)!=30 or len({x['scenario_id'] for x in xs})!=len(xs):errors.append('scenario_identity')
    if len(rows)!=len(xs)*3:errors.append('row_count')
    if digest(source)!=summary['scenario_sha256'] or digest(decisions)!=summary['decision_sha256']:errors.append('digest_mismatch')
    index={(r['scenario_id'],r['path']):r['decision'] for r in rows}
    if len(index)!=len(rows):errors.append('duplicate_decision_key')
    for x in xs:
        err=validate_journal(x)
        if err:errors.append(x['scenario_id']+':'+err)
        expected={'terminal_proxy':'COMPLETE' if x['terminal_success'] else 'NOT_COMPLETE','count_proxy':'COMPLETE' if len(x['receipts'])==len(x['control']['members']) else 'NOT_COMPLETE','full_integrity':classify(x)}
        for p,d in expected.items():
            if index.get((x['scenario_id'],p))!=d:errors.append(x['scenario_id']+':'+p+'_decision')
    positives=[x for x in xs if classify(x)=='COMPLETE']
    mutations=[]
    for base in positives:
        for label,mutate in [
            ('drop_member',lambda z:z['receipts'].pop()),
            ('duplicate_member',lambda z:z['receipts'].append(copy.deepcopy(z['receipts'][0]))),
            ('extra_member',lambda z:z['receipts'].append({**z['receipts'][0],'effect_key':'new-extra','member':'D'})),
            ('wrong_attempt',lambda z:z['receipts'][0].update(attempt='attempt-0')),
            ('string_authorization',lambda z:z['receipts'][0].update(historical_authorized='1')),
            ('string_fence',lambda z:z['receipts'][0].update(fence_accepted='1')),
            ('unauthorized',lambda z:z['receipts'][0].update(historical_authorized=0)),
            ('fence_absent',lambda z:z['receipts'][0].update(fence_accepted=0)),
            ('wrong_incarnation',lambda z:z['receipts'][0].update(incarnation='reincarnated')),
            ('wrong_run',lambda z:z['receipts'][0].update(run='other')),
            ('query_miss_conflict',lambda z:z['prior_query'].update(status='MISS')),
            ('hidden_positive_miss_conflict',lambda z:(z['prior_query'].update(status='MISS'),z.update(receipts=[]))),
            ('query_unknown',lambda z:z['prior_query'].update(status='UNKNOWN')),
            ('query_scope_string',lambda z:z['prior_query'].update(exact_scope='false')),
            ('query_retention_gap',lambda z:z['prior_query'].update(retention_covers_attempt=False)),
            ('query_watermark_gap',lambda z:z['prior_query'].update(visibility_watermark=1)),
            ('member_swap',lambda z:z['control'].update(members=['A','C'])),
            ('member_duplicate',lambda z:z['control'].update(members=['A','A'])),
            ('witness_unprotected',lambda z:z['completion_witness'].update(protected=False)),
            ('witness_revision_drift',lambda z:z['completion_witness'].update(revision=999)),
            ('witness_duplicate',lambda z:z['completion_witness'].update(members=['A','A'])),
            ('receipt_future_tick',lambda z:z['receipts'][0].update(tick=999)),
            ('receipt_projection_mismatch',lambda z:z['receipts'][0].update(effect_key='forged')),
        ]:
            x=copy.deepcopy(base);mutate(x);result=classify(x)
            mutations.append({'base':base['scenario_id'],'mutation':label,'decision':result,'rejected':result!='COMPLETE'})
            if result=='COMPLETE':errors.append(base['scenario_id']+':mutation_accepted:'+label)
    if len(positives)!=3:errors.append('positive_count')
    if sum(sum(op['accepted'] for op in x['operations'] if op['op']=='effect_attempt') for x in xs)!=summary['sqlite_accepted_writes']:errors.append('write_count')
    result={'status':'PASS' if not errors else 'FAIL','scenario_count':len(xs),'decision_rows':len(rows),'positive_reference':len(positives),'mutation_controls':len(mutations),'mutation_rejected':sum(z['rejected'] for z in mutations),'errors':errors,'implementation_independence':'PARTIAL_NO_IMPORT','data_source_independence':'NONE_SHARED_SQLITE_EXPORT','semantic_contract_independence':'LIMITED_SHARED_FIELDS','authority_independence':'NONE_LOCAL_ONLY'}
    print(canon(result).strip());return 0 if not errors else 1

if __name__=='__main__':sys.exit(main())
