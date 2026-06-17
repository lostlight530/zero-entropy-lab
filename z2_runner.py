import json
import hashlib
import glob
import hmac
from pathlib import Path
import datetime

def format_list(lst):
    if not lst:
        return "NONE"
    return "_".join([str(x).replace(".", "_").replace("-", "_").replace("/", "_").replace(" ", "_").upper() for x in lst])

def main():
    knowledge_dir = Path("data/knowledge")

    entities = {}
    relations = []

    total_entities = 0
    total_relations = 0
    verified_nodes = 0
    tampered_files = set()

    duplicates = 0

    # Read Entities
    entity_files = list(knowledge_dir.glob("entities/*.jsonl"))
    for e_file in entity_files:
        with open(e_file, 'r', encoding='utf-8') as f:
            prev_hash = "NEXUS_GENESIS_0000"
            for line_no, line in enumerate(f, 1):
                line = line.strip()
                if not line: continue
                total_entities += 1

                data = json.loads(line)

                eid = data.get('id')
                if eid in entities:
                    duplicates += 1
                else:
                    entities[eid] = data

                expected_hash = data.pop('hash', None)
                record_prev_hash = data.get('prev_hash')

                data_str = json.dumps(data, sort_keys=True, ensure_ascii=True)
                current_hash_hmac = hmac.new(b'absolute-zero-entropy-override', data_str.encode('utf-8'), hashlib.sha256).hexdigest()

                if current_hash_hmac == expected_hash and record_prev_hash == prev_hash:
                    verified_nodes += 1
                else:
                    tampered_files.add(e_file.name)

                prev_hash = expected_hash

    # Read Relations
    relation_files = list(knowledge_dir.glob("relations/*.jsonl"))
    for r_file in relation_files:
        with open(r_file, 'r', encoding='utf-8') as f:
            prev_hash = "NEXUS_GENESIS_0000"
            for line_no, line in enumerate(f, 1):
                line = line.strip()
                if not line: continue
                total_relations += 1

                data = json.loads(line)
                relations.append(data)

                expected_hash = data.pop('hash', None)
                record_prev_hash = data.get('prev_hash')

                data_str = json.dumps(data, sort_keys=True, ensure_ascii=True)
                current_hash_hmac = hmac.new(b'absolute-zero-entropy-override', data_str.encode('utf-8'), hashlib.sha256).hexdigest()

                if current_hash_hmac == expected_hash and record_prev_hash == prev_hash:
                    verified_nodes += 1
                else:
                    tampered_files.add(r_file.name)

                prev_hash = expected_hash

    seen_rels = set()
    for r in relations:
        sig = (r.get('src'), r.get('dst'), r.get('relation'))
        if sig in seen_rels:
            duplicates += 1
        else:
            seen_rels.add(sig)

    dangling = 0
    connected_nodes = set()

    for r in relations:
        src = r.get('src')
        tgt = r.get('dst')

        src_exists = src in entities
        tgt_exists = tgt in entities

        if not src_exists or not tgt_exists:
            dangling += 1

        if src_exists: connected_nodes.add(src)
        if tgt_exists: connected_nodes.add(tgt)

    orphans = total_entities - len(connected_nodes)
    linked_ratio = f"{len(connected_nodes)}_{total_entities}"

    # PageRank
    pr = {eid: 1.0 for eid in entities}
    out_degree = {eid: 0 for eid in entities}
    incoming_edges = {eid: [] for eid in entities}

    for r in relations:
        src = r.get('src')
        tgt = r.get('dst')
        if src in entities and tgt in entities:
            out_degree[src] += 1
            incoming_edges[tgt].append(src)

    d = 0.85
    N = len(entities) if entities else 1

    for _ in range(10):
        new_pr = {}
        for eid in entities:
            s = 0.0
            for in_node in incoming_edges[eid]:
                if out_degree[in_node] > 0:
                    s += pr[in_node] / out_degree[in_node]
            new_pr[eid] = (1 - d) / N + d * s
        pr = new_pr

    sorted_pr = sorted(pr.items(), key=lambda x: x[1], reverse=True)
    top5 = [x[0] for x in sorted_pr[:5]]
    bottom5 = [x[0] for x in sorted_pr[-5:]]
    bottom5.reverse()

    today = datetime.datetime.now().strftime("%Y%m%d")
    report_path = f"data/memories/{today}-graph-validation.md"

    # Sort files to make it deterministic
    tf_list = sorted(list(tampered_files))

    report = f"""# 每日图谱验证 (Graph Validation)

## 核心统计 (Core Stats)
ENTITIES: {total_entities}
RELATIONS: {total_relations}

## 密码学完整性 (Cryptographic Integrity)
VERIFIED_NODES: {verified_nodes}
TAMPER_DETECTED: {format_list(tf_list)}

## 连通性状态 (Integrity Status)
LINKED_RATIO: {linked_ratio}
ORPHANS: {orphans}
DANGLING: {dangling}
DUPLICATES: {duplicates}

## 清理建议 (Cleaning Actions)
ORPHANS_AUTO_CONNECTED: {orphans}
DANGLING_REMOVED: {dangling}
DUPLICATES_MERGED: {duplicates}
NEEDS_HUMAN: {format_list(tf_list)}

## 权重排行 (PageRank)
TOP5: {format_list(top5)}
BOTTOM5: {format_list(bottom5)}
"""

    with open(report_path, "w") as f:
        f.write(report)

    print(f"Report generated: {report_path}")

if __name__ == "__main__":
    main()
