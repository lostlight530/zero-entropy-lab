import os
import json
import hmac
import hashlib
from collections import defaultdict
import datetime

KNOWLEDGE_DIR = 'data/knowledge'
SECRET_KEY = os.environ.get('NEXUS_SECRET_KEY', 'absolute-zero-entropy-override').encode('utf-8')

def calculate_pagerank(nodes, edges, iterations=10, d=0.85):
    pr = {node: 1.0 for node in nodes}
    out_degree = defaultdict(int)
    in_edges = defaultdict(list)
    for src, dst in edges:
        out_degree[src] += 1
        in_edges[dst].append(src)

    n = len(nodes)
    if n == 0: return pr

    for _ in range(iterations):
        new_pr = {}
        for node in nodes:
            s = sum(pr[src] / out_degree[src] for src in in_edges[node] if out_degree[src] > 0)
            new_pr[node] = (1 - d) / n + d * s
        pr = new_pr
    return pr

def main():
    entities = {}
    relations = []

    verified_nodes = 0
    tamper_detected = []

    duplicates = 0
    seen_entity_ids = set()
    seen_relations = set()

    entities_dir = os.path.join(KNOWLEDGE_DIR, 'entities')
    if os.path.exists(entities_dir):
        for filename in sorted(os.listdir(entities_dir)):
            if not filename.endswith('.jsonl'):
                continue
            filepath = os.path.join(entities_dir, filename)

            with open(filepath, 'r', encoding='utf-8') as f:
                expected_prev = "NEXUS_GENESIS_0000"
                for line in f:
                    line = line.strip()
                    if not line: continue
                    data = json.loads(line)

                    actual_prev = data.get('prev_hash')
                    expected_hash = data.pop('hash', '')

                    serialized = json.dumps(data, sort_keys=True)
                    computed_hash = hmac.new(SECRET_KEY, serialized.encode('utf-8'), hashlib.sha256).hexdigest()

                    if computed_hash != expected_hash or actual_prev != expected_prev:
                        tamper_detected.append(data.get('id', 'UNKNOWN'))
                    else:
                        verified_nodes += 1

                    expected_prev = expected_hash

                    e_id = data.get('id')
                    if e_id:
                        if e_id in seen_entity_ids:
                            duplicates += 1
                        else:
                            seen_entity_ids.add(e_id)
                            entities[e_id] = data

    relations_dir = os.path.join(KNOWLEDGE_DIR, 'relations')
    if os.path.exists(relations_dir):
        for filename in sorted(os.listdir(relations_dir)):
            if not filename.endswith('.jsonl'):
                continue
            filepath = os.path.join(relations_dir, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                expected_prev = "NEXUS_GENESIS_0000"
                for line in f:
                    line = line.strip()
                    if not line: continue
                    data = json.loads(line)

                    actual_prev = data.get('prev_hash')
                    expected_hash = data.pop('hash', '')

                    serialized = json.dumps(data, sort_keys=True)
                    computed_hash = hmac.new(SECRET_KEY, serialized.encode('utf-8'), hashlib.sha256).hexdigest()

                    if computed_hash != expected_hash or actual_prev != expected_prev:
                        tamper_detected.append(f"{data.get('src', 'UNKNOWN')}_{data.get('dst', 'UNKNOWN')}")
                    else:
                        verified_nodes += 1

                    expected_prev = expected_hash

                    src = data.get('src')
                    dst = data.get('dst')
                    rel = data.get('relation')

                    rel_tuple = (src, dst, rel)
                    if rel_tuple in seen_relations:
                        duplicates += 1
                    else:
                        seen_relations.add(rel_tuple)
                        relations.append((src, dst))

    linked_entities = set()
    dangling_count = 0
    for src, dst in relations:
        src_valid = src in seen_entity_ids
        dst_valid = dst in seen_entity_ids
        if not src_valid or not dst_valid:
            dangling_count += 1

        if src_valid: linked_entities.add(src)
        if dst_valid: linked_entities.add(dst)

    orphans = seen_entity_ids - linked_entities
    orphan_count = len(orphans)
    linked_count = len(linked_entities)
    total_entities = len(seen_entity_ids)

    pr = calculate_pagerank(seen_entity_ids, relations)
    sorted_pr = sorted(pr.items(), key=lambda x: x[1], reverse=True)
    top5 = [x[0] for x in sorted_pr[:5]]
    bottom5 = [x[0] for x in sorted_pr[-5:]]

    needs_human_list = []
    if orphan_count > 0:
        needs_human_list.append("REVIEW_ORPHANS")
    if dangling_count > 0:
        needs_human_list.append("REVIEW_DANGLING")
    if tamper_detected:
        needs_human_list.append("REVIEW_TAMPERED")
    if not needs_human_list:
        needs_human_list.append("NONE")

    def fmt(s):
        s = str(s).upper()
        for c in ['.', '/', '-', ' ']:
            s = s.replace(c, '_')
        return s

    top5_str = "_".join(fmt(x) for x in top5)
    bottom5_str = "_".join(fmt(x) for x in bottom5)
    tamper_str = "_".join(fmt(x) for x in tamper_detected) if tamper_detected else "NONE"
    needs_human_str = "_".join(fmt(x) for x in needs_human_list)

    report = f"""# \u6bcf\u65e5\u56fe\u8c31\u9a8c\u8bc1 (Graph Validation)

## \u6838\u5fc3\u7edf\u8ba1 (Core Stats)
ENTITIES: {total_entities}
RELATIONS: {len(relations)}

## \u5bc6\u7801\u5b66\u5b8c\u6574\u6027 (Cryptographic Integrity)
VERIFIED_NODES: {verified_nodes}
TAMPER_DETECTED: {tamper_str}

## \u8fde\u901a\u6027\u72b6\u6001 (Integrity Status)
LINKED_RATIO: {linked_count}_{total_entities}
ORPHANS: {orphan_count}
DANGLING: {dangling_count}
DUPLICATES: {duplicates}

## \u6e05\u7406\u5efa\u8bae (Cleaning Actions)
ORPHANS_AUTO_CONNECTED: 0
DANGLING_REMOVED: 0
DUPLICATES_MERGED: 0
NEEDS_HUMAN: {needs_human_str}

## \u6743\u91cd\u6392\u884c (PageRank)
TOP5: {top5_str}
BOTTOM5: {bottom5_str}
"""
    print(report)

    today = datetime.datetime.now().strftime("%Y%m%d")
    out_path = f"data/memories/{today}-graph-validation.md"
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(report)

if __name__ == "__main__":
    main()
