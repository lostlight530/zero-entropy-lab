from __future__ import annotations
import csv, hashlib, io, json, sqlite3, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
E = ROOT / 'evidence'
E.mkdir(exist_ok=True)
PREFIX = '2026-10-18-handoff'
TASK, RUN, TARGET = 'handoff-task-18', 'run-8', 'target-inc-8'


def stable(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, indent=2) + '\n'


def sha(value):
    return hashlib.sha256(value.encode('utf-8')).hexdigest()


def db():
    c = sqlite3.connect(':memory:', isolation_level=None)
    c.execute('CREATE TABLE control (task TEXT PRIMARY KEY, epoch INTEGER, holder TEXT, permission INTEGER, incarnation TEXT, revision INTEGER, members TEXT)')
    c.execute('CREATE TABLE effects (effect_key TEXT PRIMARY KEY, task TEXT, run TEXT, attempt TEXT, epoch INTEGER, holder TEXT, member TEXT, incarnation TEXT, historical_authorized INTEGER, fence_accepted INTEGER, tick INTEGER)')
    c.execute('INSERT INTO control VALUES (?,?,?,?,?,?,?)', (TASK, 1, 'old', 1, TARGET, 5, json.dumps(['A','B'])))
    return c


def control(c):
    r = c.execute('SELECT epoch,holder,permission,incarnation,revision,members FROM control').fetchone()
    return dict(zip(('epoch','holder','permission','incarnation','revision','members'), (*r[:5], json.loads(r[5]))))


def change(c, log, **fields):
    c.execute('BEGIN IMMEDIATE')
    before = control(c)
    values = {**before, **fields}
    c.execute('UPDATE control SET epoch=?,holder=?,permission=?,incarnation=?,revision=?,members=?', (values['epoch'],values['holder'],values['permission'],values['incarnation'],values['revision'],json.dumps(values['members'])))
    c.execute('COMMIT')
    log.append({'op':'control_update','before':before,'after':control(c)})


def commit(c, log, *, member, worker='new', epoch=2, revision=5, incarnation=TARGET, attempt='attempt-2', key=None, protected=True, tick=20):
    key = key or f'{member}:{worker}:{epoch}:{attempt}'
    c.execute('BEGIN IMMEDIATE')
    state = control(c)
    eligible = worker == state['holder'] and epoch == state['epoch'] and revision == state['revision'] and incarnation == state['incarnation'] and state['permission'] == 1 and member in state['members']
    authorized = int(eligible)
    accepted = False
    if not protected or eligible:
        try:
            c.execute('INSERT INTO effects VALUES (?,?,?,?,?,?,?,?,?,?,?)', (key,TASK,RUN,attempt,epoch,worker,member,incarnation,authorized,int(protected and eligible),tick))
            accepted = True
        except sqlite3.IntegrityError:
            pass
    c.execute('COMMIT')
    log.append({'op':'effect_attempt','key':key,'member':member,'worker':worker,'epoch':epoch,'attempt':attempt,'revision_seen':revision,'incarnation_seen':incarnation,'protected':protected,'eligible_at_commit':eligible,'accepted':accepted,'tick':tick})
    return accepted


def trial(name, steps, *, query='HIT', covered=True, watermark=40, min_watermark=30, retention=True, terminal=True, witness=True, receipt_override=None):
    c=db(); log=[]
    for action in steps:
        kind=action[0]
        if kind=='change':change(c,log,**action[1])
        elif kind=='commit':commit(c,log,**action[1])
        else:raise ValueError(kind)
    state=control(c)
    rows=c.execute('SELECT effect_key,task,run,attempt,epoch,holder,member,incarnation,historical_authorized,fence_accepted,tick FROM effects ORDER BY effect_key').fetchall()
    cols=['effect_key','task','run','attempt','epoch','holder','member','incarnation','historical_authorized','fence_accepted','tick']
    effects=[dict(zip(cols,r)) for r in rows]
    actual_effects=effects
    if receipt_override is not None:
        # Explicitly separate a simulated receipt-authority projection from the actual local sink ledger
        effects=receipt_override(effects)
    witness_value={'protected':witness,'revision':state['revision'],'incarnation':state['incarnation'],'members':list(state['members']),'verified_tick':50}
    result={'scenario_id':name,'fixed':{'task':TASK,'run':RUN,'initial_epoch':1,'initial_members':['A','B'],'initial_revision':5,'target_incarnation':TARGET},'operations':log,'control':state,'sink_effects':actual_effects,'receipts':effects,'prior_query':{'status':query,'exact_scope':covered,'visibility_watermark':watermark,'minimum_watermark':min_watermark,'retention_covers_attempt':retention,'healthy':True},'terminal_success':terminal,'completion_witness':witness_value,'receipt_authority':'modeled_projection_of_local_sink'}
    c.close();return result


def ref(x):
    q=x['prior_query']; receipts=x['receipts']; state=x['control']; witness=x['completion_witness']
    if q['status'] not in ('HIT','MISS','UNKNOWN') or any(type(q[k]) is not bool or not q[k] for k in ('healthy','exact_scope','retention_covers_attempt')) or any(type(q[k]) is not int for k in ('visibility_watermark','minimum_watermark')) or q['visibility_watermark']<q['minimum_watermark'] or q['status']=='UNKNOWN':return 'STOP_UNKNOWN'
    if q['status']=='MISS' and (receipts or x['sink_effects']):return 'RECONCILE'
    if q['status']=='MISS':return 'RETRY_ALLOWED' if type(state['permission']) is int and state['permission']==1 else 'BLOCKED'
    if not receipts:return 'STOP_UNKNOWN'
    if len({r['effect_key'] for r in receipts})!=len(receipts) or len({r['member'] for r in receipts})!=len(receipts) or len(set(state['members']))!=len(state['members']):return 'RECONCILE'
    if any(type(r['historical_authorized']) is not int or r['historical_authorized']!=1 or type(r['fence_accepted']) is not int or r['fence_accepted']!=1 or r['task']!=TASK or r['run']!=RUN or r['incarnation']!=state['incarnation'] or r['attempt']!='attempt-2' or type(r['tick']) is not int for r in receipts):return 'RECONCILE'
    if {r['member'] for r in receipts}!=set(state['members']):return 'RECONCILE'
    if sorted(stable(r) for r in receipts)!=sorted(stable(r) for r in x['sink_effects']):return 'RECONCILE'
    if type(witness['protected']) is not bool or not witness['protected'] or len(witness['members'])!=len(set(witness['members'])) or witness['revision']!=state['revision'] or witness['incarnation']!=state['incarnation'] or set(witness['members'])!=set(state['members']) or any(r['tick']>witness['verified_tick'] for r in receipts):return 'STOP_UNKNOWN'
    return 'COMPLETE'


def scenario_suite():
    takeover=('change',{'epoch':2,'holder':'new'})
    new=lambda m,**kw:('commit',{'member':m,**kw})
    old=lambda m,**kw:('commit',{'member':m,'worker':'old','epoch':1,**kw})
    ab=[takeover,new('A'),new('B')]
    return [
        trial('complete_new_epoch',ab),
        trial('historical_complete_after_permission_revocation',ab+[('change',{'permission':0})]),
        trial('stale_leader_weak_write',[takeover,old('A',protected=False)]),
        trial('stale_leader_protected_reject',[takeover,old('A')],query='MISS'),
        trial('membership_change_weak',[takeover,('change',{'revision':6,'members':['A','C']}),new('B',protected=False)]),
        trial('membership_change_protected',[takeover,('change',{'revision':6,'members':['A','C']}),new('B')],query='MISS'),
        trial('permission_revoked_weak',[takeover,('change',{'permission':0}),new('A',protected=False)]),
        trial('permission_revoked_protected',[takeover,('change',{'permission':0}),new('A')],query='MISS'),
        trial('incarnation_change_weak',[takeover,('change',{'incarnation':'target-inc-9'}),new('A',protected=False)]),
        trial('incarnation_change_protected',[takeover,('change',{'incarnation':'target-inc-9'}),new('A')],query='MISS'),
        trial('same_key_replay',ab+[new('A')]),
        trial('partial_one_member',[takeover,new('A')]),
        trial('same_count_member_replacement',ab+[('change',{'revision':6,'members':['A','C']})]),
        trial('duplicate_member_distinct_key',[takeover,new('A'),new('A',key='A:replay:other')]),
        trial('extra_member',[takeover,new('A'),new('B'),new('D',protected=False)]),
        trial('covered_miss_conflicts_positive',ab,query='MISS'),
        trial('query_unknown',[],query='UNKNOWN'),
        trial('miss_scope_incomplete',[],query='MISS',covered=False),
        trial('miss_watermark_stale',[],query='MISS',watermark=10),
        trial('miss_retention_gap',[],query='MISS',retention=False),
        trial('covered_miss_permission_true',[],query='MISS'),
        trial('covered_miss_permission_false',[('change',{'permission':0})],query='MISS'),
        trial('receipt_wrong_attempt',ab,receipt_override=lambda r:[{**x,'attempt':'attempt-1'} if x['member']=='B' else x for x in r]),
        trial('receipt_string_authorization',ab,receipt_override=lambda r:[{**x,'historical_authorized':'1'} if x['member']=='A' else x for x in r]),
        trial('receipt_older_than_scope',ab,query='HIT',watermark=1),
        trial('unprotected_completion_witness',ab,witness=False),
        trial('receipt_extra_duplicate_identity',ab,receipt_override=lambda r:r+[dict(r[0])]),
        trial('receipt_wrong_target',ab,receipt_override=lambda r:[{**x,'incarnation':'other'} if x['member']=='A' else x for x in r]),
        trial('receipt_wrong_run',ab,receipt_override=lambda r:[{**x,'run':'run-older'} if x['member']=='A' else x for x in r]),
        trial('receipt_temporal_future',ab,receipt_override=lambda r:[{**x,'tick':60} if x['member']=='B' else x for x in r]),
    ]


def main():
    xs=scenario_suite()
    assert len(xs)==30 and len({x['scenario_id'] for x in xs})==30
    rows=[]
    for x in xs:
        n=len(x['receipts']); target=len(x['control']['members'])
        for path,decision in [('terminal_proxy','COMPLETE' if x['terminal_success'] else 'NOT_COMPLETE'),('count_proxy','COMPLETE' if n==target else 'NOT_COMPLETE'),('full_integrity',ref(x))]:
            rows.append({'scenario_id':x['scenario_id'],'path':path,'decision':decision})
    source=stable({'logical_date':'2026-10-18','source':'sqlite3 in-memory transactional sink; controlled authored interventions','scenarios':xs})
    output=io.StringIO(newline=''); writer=csv.DictWriter(output,fieldnames=['scenario_id','path','decision'],lineterminator='\n');writer.writeheader();writer.writerows(rows)
    csv_text=output.getvalue()
    summary={'logical_date':'2026-10-18','scenarios':len(xs),'paths':3,'decisions':len(rows),'sqlite_effect_attempts':sum(sum(z['op']=='effect_attempt' for z in x['operations']) for x in xs),'sqlite_accepted_writes':sum(sum(z['accepted'] for z in x['operations'] if z['op']=='effect_attempt') for x in xs),'external_effects':0,'scenario_sha256':sha(source),'decision_sha256':sha(csv_text),'decision_counts':{p:{d:sum(z['path']==p and z['decision']==d for z in rows) for d in sorted(set(z['decision'] for z in rows if z['path']==p))} for p in ('terminal_proxy','count_proxy','full_integrity')}}
    for name,content in [(PREFIX+'-events.json',source),(PREFIX+'-decisions.csv',csv_text),(PREFIX+'-summary.json',stable(summary))]:
        (E/name).write_text(content,encoding='utf-8',newline='\n')
    print(stable(summary).strip())
    return 0

if __name__=='__main__':sys.exit(main())
