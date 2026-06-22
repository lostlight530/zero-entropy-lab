import os
import json
import hmac
import hashlib
from pathlib import Path
from collections import defaultdict
from datetime import datetime

def verify_hmac(data_dict, expected_hash, secret):
    data_to_hash = data_dict.copy()
    if 'hash' in data_to_hash:
        del data_to_hash['hash']

    serialized = json.dumps(data_to_hash, sort_keys=True)
    computed = hmac.new(secret, serialized.encode('utf-8'), hashlib.sha256).hexdigest()
    return computed == expected_hash

def compute_pagerank(nodes, edges, iterations=15, damping_factor=0.85):
    if not nodes:
        return {}

    N = len(nodes)
    pagerank = {node: 1.0 for node in nodes}

    out_degree = defaultdict(int)
    in_links = defaultdict(list)

    for src, dst in edges:
        out_degree[src] += 1
        in_links[dst].append(src)

    for _ in range(iterations):
        new_pagerank = {}
        for node in nodes:
            rank_sum = 0
            for in_node in in_links[node]:
                rank_sum += pagerank[in_node] / out_degree[in_node]
            new_pagerank[node] = (1 - damping_factor) + damping_factor * rank_sum
        pagerank = new_pagerank

    return pagerank

def main():
    knowledge_dir = Path("data/knowledge")
    entities_dir = knowledge_dir / "entities"
    relations_dir = knowledge_dir / "relations"

    secret = os.environ.get('NEXUS_SECRET_KEY', 'absolute-zero-entropy-override').encode('utf-8')

    verified_nodes_count = 0
    tamper_detected = []

    entities = {}
    duplicate_entities = 0

    relations = []

    for filepath in entities_dir.glob("*.jsonl"):
        prev_hash_expected = "NEXUS_GENESIS_0000"
        with open(filepath, 'r', encoding='utf-8') as f:
            for line_no, line in enumerate(f, 1):
                line = line.strip()
                if not line:
                    continue
                data = json.loads(line)

                if data.get('prev_hash') != prev_hash_expected:
                    tamper_detected.append(f"{filepath.name}_L{line_no}_BROKEN_CHAIN")

                current_hash = data.get('hash')
                if verify_hmac(data, current_hash, secret):
                    verified_nodes_count += 1
                else:
                    tamper_detected.append(f"{filepath.name}_L{line_no}_INVALID_MAC")

                prev_hash_expected = current_hash

                eid = data.get('id')
                if eid in entities:
                    duplicate_entities += 1
                else:
                    entities[eid] = data

    for filepath in relations_dir.glob("*.jsonl"):
        prev_hash_expected = "NEXUS_GENESIS_0000"
        with open(filepath, 'r', encoding='utf-8') as f:
            for line_no, line in enumerate(f, 1):
                line = line.strip()
                if not line:
                    continue
                data = json.loads(line)

                if data.get('prev_hash') != prev_hash_expected:
                    tamper_detected.append(f"{filepath.name}_L{line_no}_BROKEN_CHAIN")

                current_hash = data.get('hash')
                if verify_hmac(data, current_hash, secret):
                    verified_nodes_count += 1
                else:
                    tamper_detected.append(f"{filepath.name}_L{line_no}_INVALID_MAC")

                prev_hash_expected = current_hash

                relations.append(data)

    num_entities = len(entities)
    num_relations = len(relations)

    connected_nodes = set()
    dangling_edges = 0
    valid_edges = []

    for r in relations:
        src = r.get('src')
        dst = r.get('dst')

        src_exists = src in entities
        dst_exists = dst in entities

        if not src_exists or not dst_exists:
            dangling_edges += 1
        else:
            connected_nodes.add(src)
            connected_nodes.add(dst)
            valid_edges.append((src, dst))

    orphans = num_entities - len(connected_nodes)
    linked_ratio = f"{len(connected_nodes)}_{num_entities}" if num_entities > 0 else "0_0"

    pagerank_scores = compute_pagerank(list(entities.keys()), valid_edges)

    sorted_nodes = sorted(pagerank_scores.items(), key=lambda item: item[1], reverse=True)

    top5_ids = [item[0] for item in sorted_nodes[:5]] if sorted_nodes else []
    bottom5_ids = [item[0] for item in sorted_nodes[-5:]] if sorted_nodes else []

    def format_list(lst):
        if not lst:
            return "NONE"
        if len(lst) > 10:
            lst = lst[:10] + ["AND_MORE"]
        res = "_".join(lst)
        res = res.replace('.', '_').replace('/', '_').replace('-', '_').replace(' ', '_')
        return res.upper()

    tamper_str = format_list(tamper_detected)
    top5_str = format_list(top5_ids)
    bottom5_str = format_list(bottom5_ids)
    needs_human_str = format_list(["MANUAL_REVIEW_REQUIRED"] if tamper_detected else [])

    report = f"""# 每日图谱验证 (Graph Validation)

## 核心统计 (Core Stats)
ENTITIES: {num_entities}
RELATIONS: {num_relations}

## 密码学完整性 (Cryptographic Integrity)
VERIFIED_NODES: {verified_nodes_count}
TAMPER_DETECTED: {tamper_str}

## 连通性状态 (Integrity Status)
LINKED_RATIO: {linked_ratio}
ORPHANS: {orphans}
DANGLING: {dangling_edges}
DUPLICATES: {duplicate_entities}

## 清理建议 (Cleaning Actions)
ORPHANS_AUTO_CONNECTED: 0
DANGLING_REMOVED: 0
DUPLICATES_MERGED: 0
NEEDS_HUMAN: {needs_human_str}

## 权重排行 (PageRank)
TOP5: {top5_str}
BOTTOM5: {bottom5_str}
"""

    today = datetime.now().strftime("%Y%m%d")

    memories_dir = Path("data/memories")
    memories_dir.mkdir(parents=True, exist_ok=True)
    report_path = memories_dir / f"{today}-graph-validation.md"

    with open(report_path, "w", encoding="utf-8") as f:
        f.write(report)

if __name__ == "__main__":
    main()
