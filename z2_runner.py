import os
import glob
import json
import hmac
import hashlib
from datetime import datetime

def clean_val(val):
    s = str(val).upper()
    for c in ['.', '/', '-', ' ', '(', ')', '[', ']']:
        s = s.replace(c, '_')
    return s

def clean_list(lst):
    if not lst:
        return "NONE"
    return clean_val("_".join(lst))

def main():
    date_str = datetime.now().strftime("%Y%m%d")
    out_path = f"data/memories/{date_str}-graph-validation.md"

    entities_files = glob.glob('data/knowledge/entities/*.jsonl')
    relations_files = glob.glob('data/knowledge/relations/*.jsonl')

    entities = {}
    relations = []

    unique_relation_signatures = set()

    tampered_nodes = set()
    verified_nodes_count = 0
    duplicates_count = 0

    secret_key = os.environ.get("NEXUS_SECRET_KEY", "absolute-zero-entropy-override").encode('utf-8')

    for filepath in entities_files:
        expected_prev = "NEXUS_GENESIS_0000"
        with open(filepath, 'r') as file:
            for line_num, line in enumerate(file):
                if not line.strip(): continue
                data = json.loads(line)
                eid = data.get('id', f"UNKNOWN_{filepath}_{line_num}")
                stored_hash = data.get('hash')

                if data.get('prev_hash') != expected_prev:
                    tampered_nodes.add(eid)
                    expected_prev = stored_hash
                else:
                    item = data.copy()
                    item.pop('hash', None)
                    # Use standard json serialization for HMAC calculation according to check_hmac.py
                    payload = json.dumps(item, sort_keys=True).encode('utf-8')
                    new_hash = hmac.new(secret_key, payload, hashlib.sha256).hexdigest()
                    if new_hash == stored_hash:
                        verified_nodes_count += 1
                    else:
                        tampered_nodes.add(eid)
                    expected_prev = stored_hash

                # Deduplication logic
                real_eid = data.get('id')
                if real_eid:
                    if real_eid in entities:
                        duplicates_count += 1
                    else:
                        entities[real_eid] = []
                    entities[real_eid].append(data)

    for filepath in relations_files:
        expected_prev = "NEXUS_GENESIS_0000"
        with open(filepath, 'r') as file:
            for line_num, line in enumerate(file):
                if not line.strip(): continue
                data = json.loads(line)
                stored_hash = data.get('hash')
                eid = f"RELATION_ROW_{line_num}"

                if data.get('prev_hash') != expected_prev:
                    tampered_nodes.add(eid)
                    expected_prev = stored_hash
                else:
                    item = data.copy()
                    item.pop('hash', None)
                    payload = json.dumps(item, sort_keys=True).encode('utf-8')
                    new_hash = hmac.new(secret_key, payload, hashlib.sha256).hexdigest()
                    if new_hash == stored_hash:
                        verified_nodes_count += 1
                    else:
                        tampered_nodes.add(eid)
                    expected_prev = stored_hash

                relations.append(data)

                # memory: "When natively parsing JSONL ledgers for graph validation, scripts must specifically read 'src' and 'dst' to avoid miscalculating orphans and dangling relations."
                src = data.get("src")
                dst = data.get("dst")
                if src and dst:
                    sig = f"{src}_{dst}_{data.get('type', '')}"
                    if sig in unique_relation_signatures:
                        duplicates_count += 1
                    else:
                        unique_relation_signatures.add(sig)

    unique_entities = set(entities.keys())
    nodes = list(unique_entities)
    N = len(nodes)

    dangling_count = 0
    out_degree = {n: 0 for n in nodes}
    in_edges = {n: [] for n in nodes}

    for r in relations:
        source = r.get("src")
        target = r.get("dst")
        if source not in unique_entities or target not in unique_entities:
            dangling_count += 1
        if source in unique_entities and target in unique_entities:
            out_degree[source] += 1
            in_edges[target].append(source)

    connected_nodes = set()
    for r in relations:
        source = r.get("src")
        target = r.get("dst")
        if source in unique_entities and target in unique_entities:
            connected_nodes.add(source)
            connected_nodes.add(target)

    orphans = unique_entities - connected_nodes
    orphan_count = len(orphans)

    linked_ratio = len(connected_nodes) / N if N > 0 else 0
    linked_ratio_str = f"{linked_ratio:.2f}".replace(".", "_")

    d = 0.85
    pr = {n: 1.0/N for n in nodes if N > 0}
    if N > 0:
        for _ in range(10):
            new_pr = {}
            sink_pr = sum(pr[n] for n in nodes if out_degree[n] == 0)
            for n in nodes:
                new_pr[n] = (1 - d) / N + d * sink_pr / N
                for incoming in in_edges[n]:
                    if out_degree[incoming] > 0:
                        new_pr[n] += d * pr[incoming] / out_degree[incoming]
            pr = new_pr

    sorted_pr = sorted(pr.items(), key=lambda x: x[1], reverse=True)
    top5 = [x[0] for x in sorted_pr[:5]]
    bottom5 = [x[0] for x in sorted_pr[-5:]]

    tamper_list_clean = clean_list(list(tampered_nodes))
    if len(tampered_nodes) == 0:
        tamper_list_clean = "NONE"

    needs_human_str = "CHECK_TAMPERED_NODES" if len(tampered_nodes) > 0 else "NONE"

    report_content = f"""# 每日图谱验证 (GRAPH VALIDATION)

## 核心统计 (CORE STATS)
ENTITIES: {len(unique_entities)}
RELATIONS: {len(relations)}

## 密码学完整性 (CRYPTOGRAPHIC INTEGRITY)
VERIFIED_NODES: {verified_nodes_count}
TAMPER_DETECTED: {tamper_list_clean}

## 连通性状态 (INTEGRITY STATUS)
LINKED_RATIO: {linked_ratio_str}
ORPHANS: {orphan_count}
DANGLING: {dangling_count}
DUPLICATES: {duplicates_count}

## 清理建议 (CLEANING ACTIONS)
ORPHANS_AUTO_CONNECTED: 0
DANGLING_REMOVED: 0
DUPLICATES_MERGED: 0
NEEDS_HUMAN: {needs_human_str}

## 权重排行 (PAGERANK)
TOP5: {clean_list(top5)}
BOTTOM5: {clean_list(bottom5)}
"""

    os.makedirs('data/memories', exist_ok=True)
    with open(out_path, 'w') as f:
        f.write(report_content)
    print(f"Report written to {out_path}")

if __name__ == '__main__':
    main()
