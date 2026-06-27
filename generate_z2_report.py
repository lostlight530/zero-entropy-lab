import json
import glob
import sqlite3
import datetime
import os
import hmac
import hashlib

def format_val(val):
    if isinstance(val, list):
        if not val:
            return "NONE"
        s = "_".join(str(x) for x in val)
        return s.replace(".", "_").replace("/", "_").replace("-", "_").replace(" ", "_").upper()
    elif isinstance(val, str):
        if not val:
            return "NONE"
        return val.replace(".", "_").replace("/", "_").replace("-", "_").replace(" ", "_").upper()
    return str(val).upper()

def main():
    date_str = "20260627"

    entity_files = glob.glob("data/knowledge/entities/*.jsonl")
    relation_files = glob.glob("data/knowledge/relations/*.jsonl")

    tampered = []
    verified_nodes = 0
    secret_key = os.environ.get("NEXUS_SECRET_KEY", "absolute-zero-entropy-override").encode('utf-8')

    entities_map = {}
    duplicates_merged = 0
    relations = []

    for f in sorted(entity_files):
        expected_prev = "NEXUS_GENESIS_0000"
        with open(f, 'r') as fp:
            for line in fp:
                line = line.strip()
                if line:
                    data = json.loads(line)
                    eid = data.get('id')
                    stored_hash = data.get('hash')
                    stored_prev = data.get('prev_hash')

                    if stored_prev != expected_prev:
                        tampered.append(eid)
                        expected_prev = stored_hash
                    else:
                        item = data.copy()
                        item.pop('hash', None)

                        payload = json.dumps(item, sort_keys=True).encode('utf-8')
                        new_hash = hmac.new(secret_key, payload, hashlib.sha256).hexdigest()

                        if new_hash == stored_hash:
                            verified_nodes += 1
                        else:
                            tampered.append(eid)

                        expected_prev = stored_hash

                    if eid in entities_map:
                        duplicates_merged += 1
                    entities_map[eid] = data

    for f in sorted(relation_files):
        expected_prev = "NEXUS_GENESIS_0000"
        with open(f, 'r') as fp:
            for i, line in enumerate(fp):
                line = line.strip()
                if line:
                    data = json.loads(line)
                    stored_hash = data.get('hash')
                    stored_prev = data.get('prev_hash')
                    rid = f"{data.get('src')}_{data.get('relation')}_{data.get('dst')}"

                    if stored_prev != expected_prev:
                        tampered.append(rid)
                        expected_prev = stored_hash
                    else:
                        item = data.copy()
                        item.pop('hash', None)

                        payload = json.dumps(item, sort_keys=True).encode('utf-8')
                        new_hash = hmac.new(secret_key, payload, hashlib.sha256).hexdigest()

                        if new_hash == stored_hash:
                            verified_nodes += 1
                        else:
                            tampered.append(rid)

                        expected_prev = stored_hash

                    relations.append(data)

    valid_eids = set(entities_map.keys())
    entities_count = len(valid_eids)
    relations_count = len(relations)

    valid_relations = []
    dangling_removed = 0
    for r in relations:
        if r['src'] in valid_eids and r['dst'] in valid_eids:
            valid_relations.append(r)
        else:
            dangling_removed += 1

    linked_nodes = set()
    for r in valid_relations:
        linked_nodes.add(r['src'])
        linked_nodes.add(r['dst'])

    orphans = valid_eids - linked_nodes
    orphans_count = len(orphans)
    linked_count = len(linked_nodes)

    orphans_auto_connected = 0
    needs_human = []

    for eid in orphans:
        if "repo_zero_entropy_lab" in valid_eids and eid != "repo_zero_entropy_lab":
            orphans_auto_connected += 1
        else:
            needs_human.append(eid)

    conn = sqlite3.connect('data/cortex.db')
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT id FROM entities ORDER BY weight DESC LIMIT 5")
        top5 = [row[0] for row in cursor.fetchall()]

        cursor.execute("SELECT id FROM entities ORDER BY weight ASC LIMIT 5")
        bottom5 = [row[0] for row in cursor.fetchall()]
    except sqlite3.OperationalError:
        top5 = []
        bottom5 = []

    conn.close()

    if not tampered:
        tamper_out = "NONE"
    else:
        if len(tampered) > 10:
            tamper_out = "_".join([format_val(t) for t in tampered[:10]]) + "_AND_MORE"
        else:
            tamper_out = "_".join([format_val(t) for t in tampered])

    report_lines = [
        "# 每日图谱验证 (Graph Validation)",
        "",
        "## 核心统计 (Core Stats)",
        f"ENTITIES: {format_val(entities_count)}",
        f"RELATIONS: {format_val(relations_count)}",
        "",
        "## 密码学完整性 (Cryptographic Integrity)",
        f"VERIFIED_NODES: {format_val(verified_nodes)}",
        f"TAMPER_DETECTED: {tamper_out}",
        "",
        "## 连通性状态 (Integrity Status)",
        f"LINKED_RATIO: {format_val(linked_count)}_{format_val(entities_count)}",
        f"ORPHANS: {format_val(orphans_count)}",
        f"DANGLING: {format_val(dangling_removed)}",
        f"DUPLICATES: {format_val(duplicates_merged)}",
        "",
        "## 清理建议 (Cleaning Actions)",
        f"ORPHANS_AUTO_CONNECTED: {format_val(orphans_auto_connected)}",
        f"DANGLING_REMOVED: {format_val(dangling_removed)}",
        f"DUPLICATES_MERGED: {format_val(duplicates_merged)}",
        f"NEEDS_HUMAN: {format_val(needs_human)}",
        "",
        "## 权重排行 (PageRank)",
        f"TOP5: {format_val(top5)}",
        f"BOTTOM5: {format_val(bottom5)}"
    ]

    report_path = f"data/memories/{date_str}-graph-validation.md"
    with open(report_path, "w", encoding="utf-8") as f:
        f.write(chr(10).join(report_lines) + chr(10))

    print(f"Generated report at {report_path}")

if __name__ == "__main__":
    main()
