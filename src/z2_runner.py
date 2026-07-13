import json
import os
import hashlib
import hmac
from pathlib import Path
from datetime import datetime

SENSORY_PATH = Path(__file__).resolve().parent / "kernel" / "sensory"
if str(SENSORY_PATH) not in sys.path:
    sys.path.insert(0, str(SENSORY_PATH))
from document_hygiene import GENESIS_HASH, ledger_hash

def verify_and_read_jsonl():
    knowledge_path = Path('data/knowledge')
    entities_path = knowledge_path / "entities"
    relations_path = knowledge_path / "relations"

    entities = {}
    relations = []

    verified_nodes = 0
    tampered_nodes = []

    duplicate_count = 0

    def process_file(file_path, is_entity):
        nonlocal verified_nodes, tampered_nodes, duplicate_count
        previous = GENESIS_HASH
        if not file_path.exists():
            return
        domain = file_path.relative_to(knowledge_path).as_posix()
        with open(file_path, "r", encoding="utf-8") as stream:
            for line in stream:
                if not line.strip():
                    continue
                stored = json.loads(line)
                current_hash = stored.get("hash")
                expected_hash = ledger_hash(stored, previous, domain)
                node_id = stored.get("id") if is_entity else f"{stored.get('src')}_{stored.get('relation')}_{stored.get('dst')}"
                node_id = node_id or "UNKNOWN"
                if stored.get("prev_hash") != previous or current_hash != expected_hash:
                    tampered_nodes.append(node_id)
                else:
                    verified_nodes += 1
                previous = current_hash or expected_hash
                data = {key: value for key, value in stored.items() if key not in {"hash", "prev_hash"}}
                if is_entity:
                    entity_id = data.get("id")
                    if entity_id:
                        if entity_id in entities:
                            duplicate_count += 1
                        entities[entity_id] = data
                else:
                    relations.append(data)
    if entities_path.exists():
        for f in sorted(entities_path.glob('*.jsonl')):
            process_file(f, is_entity=True)

    if relations_path.exists():
        for f in sorted(relations_path.glob('*.jsonl')):
            process_file(f, is_entity=False)

    return entities, relations, verified_nodes, tampered_nodes, duplicate_count


def calculate_metrics(entities, relations):
    valid_relations = []
    dangling = 0

    for r in relations:
        src = r.get('src') or r.get('source')
        dst = r.get('dst') or r.get('target')

        if src in entities and dst in entities:
            r['src'] = src
            r['dst'] = dst
            valid_relations.append(r)
        else:
            dangling += 1

    connected_entities = set()
    for r in valid_relations:
        connected_entities.add(r['src'])
        connected_entities.add(r['dst'])

    orphans = set(entities.keys()) - connected_entities

    return valid_relations, dangling, orphans

def calculate_pagerank(entities, relations):
    """
    Pure Python PageRank computation for non-programmatic nodes.
    """
    filtered_entities = entities
    filtered_relations = [r for r in relations
                          if r.get('src') in filtered_entities and r.get('dst') in filtered_entities]

    all_nodes = set(filtered_entities.keys())
    out_degree = {n: 0 for n in all_nodes}
    in_links = {n: [] for n in all_nodes}

    for r in filtered_relations:
        src = r.get('src')
        dst = r.get('dst')
        out_degree[src] += 1
        in_links[dst].append(src)

    N = len(all_nodes)
    if N == 0:
        return [], []

    nodes_list = list(all_nodes)
    ranks = {n: 1.0 for n in nodes_list}

    damping_factor = 0.85
    iterations = 15

    for _ in range(iterations):
        new_ranks = {}
        base_rank = 1.0 - damping_factor

        for node in nodes_list:
            rank_sum = 0.0
            for parent in in_links[node]:
                if out_degree[parent] > 0:
                    rank_sum += ranks[parent] / out_degree[parent]
            new_ranks[node] = base_rank + damping_factor * rank_sum

        ranks = new_ranks

    sorted_ranks = sorted(ranks.items(), key=lambda x: x[1], reverse=True)

    top5 = [item[0] for item in sorted_ranks[:5]]
    bottom5 = [item[0] for item in sorted_ranks[-5:]]

    return top5, bottom5


def generate_report():
    entities, relations, verified_nodes, tampered_nodes, duplicates = verify_and_read_jsonl()
    valid_relations, dangling, orphans = calculate_metrics(entities, relations)
    top5, bottom5 = calculate_pagerank(entities, valid_relations)

    # Needs human
    needs_human_list = []
    orphans_auto_connected = 0
    for orphan_id in orphans:
        if orphan_id == "repo_zero_entropy_lab":
            continue
        if "repo_zero_entropy_lab" in entities:
            orphans_auto_connected += 1
        else:
            needs_human_list.append(orphan_id)

    # Format TAMPER_DETECTED, NEEDS_HUMAN, TOP5, BOTTOM5 without periods
    def sanitize(lst):
        if not lst:
            return "NONE"
        sanitized = []
        seen = set()
        for item in lst:
            if item not in seen:
                seen.add(item)
                s = str(item).upper().replace('.', '_').replace('/', '_').replace('-', '_')
                sanitized.append(s)
        if not sanitized:
            return "NONE"
        return "[" + ",".join(sanitized) + "]"

    date_str = datetime.now().strftime("%Y%m%d")
    report_path = Path('data/memories') / f"{date_str}-graph-validation.md"

    tamper_str = sanitize(tampered_nodes)
    needs_human_str = sanitize(needs_human_list)
    top5_str = sanitize(top5)
    bottom5_str = sanitize(bottom5)

    report_content = f"""# 每日图谱验证 (Graph Validation)

## 核心统计 (Core Stats)
ENTITIES: {len(entities)}
RELATIONS: {len(relations)}

## 密码学完整性 (Cryptographic Integrity)
VERIFIED_NODES: {verified_nodes}
TAMPER_DETECTED: {tamper_str}

## 连通性状态 (Integrity Status)
LINKED_RATIO: {len(entities) - len(orphans)}_{len(entities)}
ORPHANS: {len(orphans)}
DANGLING: {dangling}
DUPLICATES: {duplicates}

## 清理建议 (Cleaning Actions)
ORPHANS_AUTO_CONNECTED: {orphans_auto_connected}
DANGLING_REMOVED: {dangling}
DUPLICATES_MERGED: {duplicates}
NEEDS_HUMAN: {needs_human_str}

## 权重排行 (PageRank)
TOP5: {top5_str}
BOTTOM5: {bottom5_str}

---
"""

    with open(report_path, 'w', encoding='utf-8') as f:
        f.write(report_content)

    print(f"Report generated at {report_path}")

if __name__ == "__main__":
    generate_report()
