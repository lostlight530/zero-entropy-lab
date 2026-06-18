import os
import glob
import json
import hmac
import hashlib
from datetime import datetime

def calculate_hmac(data):
    s = json.dumps(data, sort_keys=True, ensure_ascii=True)
    return hmac.new(b"absolute-zero-entropy-override", s.encode("utf-8"), hashlib.sha256).hexdigest()

def clean_val(val):
    s = str(val).upper()
    for c in ['.', '/', '-', ' ']:
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

    for filepath in entities_files:
        prev_expected = None
        with open(filepath, 'r') as f:
            for line_num, line in enumerate(f):
                if not line.strip(): continue
                data = json.loads(line)
                h = data.pop("hash", None)

                expected_hash = calculate_hmac(data)

                is_valid = True
                if expected_hash != h:
                    is_valid = False

                if prev_expected is not None:
                    if data.get("prev_hash") != prev_expected:
                        is_valid = False

                if is_valid:
                    verified_nodes_count += 1
                else:
                    tampered_nodes.add(data.get("id", f"UNKNOWN_{filepath}_{line_num}"))

                prev_expected = expected_hash

                eid = data.get("id")
                if eid:
                    if eid in entities:
                        duplicates_count += 1
                    else:
                        entities[eid] = []
                    entities[eid].append(data)

    for filepath in relations_files:
        prev_expected = None
        with open(filepath, 'r') as f:
            for line_num, line in enumerate(f):
                if not line.strip(): continue
                data = json.loads(line)
                h = data.pop("hash", None)

                expected_hash = calculate_hmac(data)

                is_valid = True
                if expected_hash != h:
                    is_valid = False

                if prev_expected is not None:
                    if data.get("prev_hash") != prev_expected:
                        is_valid = False

                if is_valid:
                    verified_nodes_count += 1
                else:
                    tampered_nodes.add(data.get("id", f"RELATION_ROW_{line_num}"))

                prev_expected = expected_hash
                relations.append(data)

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
                    new_pr[n] += d * pr[incoming] / out_degree[incoming]
            pr = new_pr

    sorted_pr = sorted(pr.items(), key=lambda x: x[1], reverse=True)
    top5 = [x[0] for x in sorted_pr[:5]]
    bottom5 = [x[0] for x in sorted_pr[-5:]]

    tamper_list_clean = clean_list(list(tampered_nodes))
    if len(tampered_nodes) == 0:
        tamper_list_clean = "NONE"

    report_content = f"""# 每日图谱验证 (Graph Validation)

## 核心统计 (Core Stats)
ENTITIES: {len(unique_entities)}
RELATIONS: {len(relations)}

## 密码学完整性 (Cryptographic Integrity)
VERIFIED_NODES: {verified_nodes_count}
TAMPER_DETECTED: {tamper_list_clean}

## 连通性状态 (Integrity Status)
LINKED_RATIO: {linked_ratio_str}
ORPHANS: {orphan_count}
DANGLING: {dangling_count}
DUPLICATES: {duplicates_count}

## 清理建议 (Cleaning Actions)
ORPHANS_AUTO_CONNECTED: 0
DANGLING_REMOVED: 0
DUPLICATES_MERGED: 0
NEEDS_HUMAN: CHECK_TAMPERED_NODES

## 权重排行 (PageRank)
TOP5: {clean_list(top5)}
BOTTOM5: {clean_list(bottom5)}
"""

    os.makedirs('data/memories', exist_ok=True)
    with open(out_path, 'w') as f:
        f.write(report_content)
    print(f"Report written to {out_path}")

if __name__ == '__main__':
    main()
