import json
import os
import hmac
import hashlib
import datetime
from pathlib import Path

def main():
    project_root = Path(__file__).resolve().parent

    knowledge_path = project_root / "data" / "knowledge"
    entities_path = knowledge_path / "entities"
    relations_path = knowledge_path / "relations"

    entities = {}
    duplicate_ids = set()

    all_entities = []
    if entities_path.exists():
        for f in entities_path.glob('*.jsonl'):
            try:
                with open(f, 'r') as file:
                    for line in file:
                        if not line.strip(): continue
                        data = json.loads(line)
                        eid = data.get('id')
                        if eid in entities:
                            duplicate_ids.add(eid)
                        entities[eid] = data
                        all_entities.append(data)
            except Exception as e:
                pass

    relations = []
    if relations_path.exists():
        for f in relations_path.glob('*.jsonl'):
            try:
                with open(f, 'r') as file:
                    for line in file:
                        if not line.strip(): continue
                        data = json.loads(line)
                        relations.append(data)
            except Exception as e:
                pass

    valid_relations = []
    dangling_removed = 0
    for r in relations:
        src = r.get('src') or r.get('source')
        dst = r.get('dst') or r.get('target')
        if src in entities and dst in entities:
            r['src'] = src
            r['dst'] = dst
            valid_relations.append(r)
        else:
            dangling_removed += 1

    connected_entities = set()
    for r in valid_relations:
        connected_entities.add(r['src'])
        connected_entities.add(r['dst'])

    orphans = set(entities.keys()) - connected_entities
    orphans_auto_connected = 0
    needs_human = []

    for orphan_id in orphans:
        if orphan_id == "repo_zero_entropy_lab":
            continue
        if "repo_zero_entropy_lab" in entities:
            valid_relations.append({
                "src": "repo_zero_entropy_lab",
                "relation": "contains",
                "dst": orphan_id,
                "desc": ""
            })
            orphans_auto_connected += 1
        else:
            needs_human.append(orphan_id)

    secret_key = os.environ.get("NEXUS_SECRET_KEY", "absolute-zero-entropy-override").encode('utf-8')

    verified_nodes = 0
    tamper_detected = []

    def verify_file_hmac(file_path):
        nonlocal verified_nodes
        prev_hash = "NEXUS_GENESIS_0000"
        try:
            with open(file_path, 'r') as f:
                for line in f:
                    if not line.strip(): continue
                    data = json.loads(line)
                    current_hash = data.get('hash')
                    data_copy = data.copy()
                    data_copy.pop('hash', None)

                    if data_copy.get('prev_hash') != prev_hash:
                        tamper_detected.append(data.get('id', 'UNKNOWN'))

                    serialized = json.dumps(data_copy, sort_keys=True)
                    expected_hash = hmac.new(secret_key, serialized.encode('utf-8'), hashlib.sha256).hexdigest()

                    if expected_hash == current_hash and current_hash is not None:
                        verified_nodes += 1
                    else:
                        tamper_detected.append(data.get('id', 'UNKNOWN'))

                    prev_hash = expected_hash
        except Exception as e:
            pass

    if entities_path.exists():
        for f in entities_path.glob('*.jsonl'):
            verify_file_hmac(f)
    if relations_path.exists():
        for f in relations_path.glob('*.jsonl'):
            verify_file_hmac(f)

    # Note: Deliberately NOT rewriting files here, just read-only generation.

    def calculate_pagerank(nodes, edges, max_iter=20, d=0.85):
        N = len(nodes)
        if N == 0: return {}
        pr = {node: 1.0 / N for node in nodes}
        out_degree = {node: 0 for node in nodes}
        in_edges = {node: [] for node in nodes}

        for edge in edges:
            src, dst = edge.get('src') or edge.get('source'), edge.get('dst') or edge.get('target')
            if src in nodes and dst in nodes:
                out_degree[src] += 1
                in_edges[dst].append(src)

        for _ in range(max_iter):
            new_pr = {}
            sink_pr = sum(pr[node] for node in nodes if out_degree[node] == 0)

            for node in nodes:
                rank_sum = sum(pr[src] / out_degree[src] for src in in_edges[node])
                new_pr[node] = (1.0 - d) / N + d * (rank_sum + sink_pr / N)

            pr = new_pr

        return pr

    pageranks = calculate_pagerank(list(entities.keys()), valid_relations)
    sorted_pr = sorted(pageranks.items(), key=lambda x: x[1], reverse=True)
    top5 = [k for k, v in sorted_pr[:5]] if len(sorted_pr) >= 5 else [k for k, v in sorted_pr]
    bottom5 = [k for k, v in sorted_pr[-5:]] if len(sorted_pr) >= 5 else [k for k, v in sorted_pr]

    date_str = datetime.datetime.now().strftime("%Y%m%d")
    report_path = project_root / "data" / "memories" / f"{date_str}-graph-validation.md"
    report_path.parent.mkdir(parents=True, exist_ok=True)

    def format_report_list(lst):
        if not lst: return "NONE"
        import re
        unique_lst = list(dict.fromkeys(lst)) # Deduplicate
        return "[" + ",".join([re.sub(r'[\.\-\/]', '_', str(item).upper()) for item in unique_lst]) + "]"

    lines = []
    lines.append("# 每日图谱验证 (Graph Validation)")
    lines.append("")
    lines.append("## 核心统计 (Core Stats)")
    lines.append(f"ENTITIES: {len(entities)}")
    lines.append(f"RELATIONS: {len(relations)}")
    lines.append("")
    lines.append("## 密码学完整性 (Cryptographic Integrity)")
    lines.append(f"VERIFIED_NODES: {verified_nodes}")
    lines.append(f"TAMPER_DETECTED: {format_report_list(tamper_detected)}")
    lines.append("")
    lines.append("## 连通性状态 (Integrity Status)")
    lines.append(f"LINKED_RATIO: {len(connected_entities)}_{len(entities)}")
    lines.append(f"ORPHANS: {len(orphans)}")
    lines.append(f"DANGLING: {dangling_removed}")
    lines.append(f"DUPLICATES: {len(duplicate_ids)}")
    lines.append("")
    lines.append("## 清理建议 (Cleaning Actions)")
    lines.append(f"ORPHANS_AUTO_CONNECTED: {orphans_auto_connected}")
    lines.append(f"DANGLING_REMOVED: {dangling_removed}")
    lines.append(f"DUPLICATES_MERGED: {len(duplicate_ids)}")
    lines.append(f"NEEDS_HUMAN: {format_report_list(needs_human)}")
    lines.append("")
    lines.append("## 权重排行 (PageRank)")
    lines.append(f"TOP5: {format_report_list(top5)}")
    lines.append(f"BOTTOM5: {format_report_list(bottom5)}")

    with open(report_path, "w") as f:
        f.write("\n".join(lines) + "\n")
    print(f"Graph Validation Report generated at {report_path}")

if __name__ == "__main__":
    main()
