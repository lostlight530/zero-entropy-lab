import json
import glob
import sqlite3
import datetime
import os

def load_and_deduplicate():
    entity_files = glob.glob("data/knowledge/entities/*.jsonl")
    relation_files = glob.glob("data/knowledge/relations/*.jsonl")

    entities_map = {}
    duplicates_merged = 0

    for f in entity_files:
        with open(f, 'r') as fp:
            for line in fp:
                line = line.strip()
                if line:
                    data = json.loads(line)
                    eid = data['id']
                    if eid in entities_map:
                        duplicates_merged += 1
                    entities_map[eid] = data

    relations = []
    for f in relation_files:
        with open(f, 'r') as fp:
            for line in fp:
                line = line.strip()
                if line:
                    relations.append(json.loads(line))

    return list(entities_map.values()), relations, duplicates_merged

def clean_graph(entities, relations):
    valid_eids = set(e['id'] for e in entities)

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
    orphans_auto_connected = 0
    needs_human = []

    for eid in orphans:
        if "repo_zero_entropy_lab" in valid_eids and eid != "repo_zero_entropy_lab":
            new_edge = {
                "src": "repo_zero_entropy_lab",
                "relation": "contains",
                "dst": eid,
                "desc": "Auto-connected orphan"
            }
            valid_relations.append(new_edge)
            orphans_auto_connected += 1
        else:
            needs_human.append(eid)

    linked_after = linked_nodes.copy()
    if orphans_auto_connected > 0:
        linked_after.add("repo_zero_entropy_lab")
        for eid in orphans:
            linked_after.add(eid)

    return valid_relations, dangling_removed, orphans_auto_connected, needs_human, len(linked_after)


import hashlib

def rewrite_data(entities, valid_relations):
    # Sanitize entities
    entities_by_type = {}
    for e in entities:
        t = e.get('type', 'concept')
        if t not in entities_by_type:
            entities_by_type[t] = []
        entities_by_type[t].append(e)

    for t, ents in entities_by_type.items():
        filepath = f"data/knowledge/entities/{t}.jsonl"
        with open(filepath, 'w') as f:
            prev_hash = "NEXUS_GENESIS_0000"
            for e in ents:
                # Remove previous hash and prev_hash before recalculating to ensure clean state
                e.pop('hash', None)
                e.pop('prev_hash', None)

                # Sort keys to ensure consistent hash calculation
                record_str = json.dumps(e, sort_keys=True)
                secret_key = os.environ.get("NEXUS_SECRET_KEY", "absolute-zero-entropy-override").encode('utf-8')

                import hmac
                m = hmac.new(secret_key, digestmod=hashlib.sha256)
                m.update(prev_hash.encode('utf-8'))
                m.update(record_str.encode('utf-8'))
                current_hash = m.hexdigest()

                e['prev_hash'] = prev_hash
                e['hash'] = current_hash

                f.write(json.dumps(e) + "\n")
                prev_hash = current_hash

    # Since relations don't have types strictly bound to files in the same way,
    # we rewrite them grouped by month based on when they were originally created if possible,
    # or just use the current month for new ones, but for simplicity we group by a default month
    # or extract month from file if we preserved it.
    # Since we didn't preserve the file source, let's just group them all into the current month's jsonl
    # or recreate based on some metadata.
    # To be safer and keep the structure, let's put them all in current month for this bulk rewrite,
    # OR we can just write them to a single relations jsonl file.
    # Let's write to current month.
    month_str = datetime.datetime.now().strftime("%Y-%m")
    relation_filepath = f"data/knowledge/relations/{month_str}.jsonl"

    # Clean relations dir first to avoid duplicates across months
    for f in glob.glob("data/knowledge/relations/*.jsonl"):
        os.remove(f)

    with open(relation_filepath, 'w') as f:
        prev_hash = "NEXUS_GENESIS_0000"
        for r in valid_relations:
            r.pop('hash', None)
            r.pop('prev_hash', None)

            record_str = json.dumps(r, sort_keys=True)
            secret_key = os.environ.get("NEXUS_SECRET_KEY", "absolute-zero-entropy-override").encode('utf-8')

            import hmac
            m = hmac.new(secret_key, digestmod=hashlib.sha256)
            m.update(prev_hash.encode('utf-8'))
            m.update(record_str.encode('utf-8'))
            current_hash = m.hexdigest()

            r['prev_hash'] = prev_hash
            r['hash'] = current_hash

            f.write(json.dumps(r) + "\n")
            prev_hash = current_hash

    # Update sqlite DB
    conn = sqlite3.connect('data/cortex.db')
    cursor = conn.cursor()

    # 1. Clear orphaned relations where source or target entity is missing
    cursor.execute('''
        DELETE FROM relations
        WHERE source NOT IN (SELECT id FROM entities)
           OR target NOT IN (SELECT id FROM entities)
    ''')

    # Insert missing relations (auto-connected ones)
    for r in valid_relations:
        if r.get('desc') == "Auto-connected orphan":
            try:
                cursor.execute(
                    "INSERT INTO relations (source, relation, target, weight, description) VALUES (?, ?, ?, ?, ?)",
                    (r['src'], r['relation'], r['dst'], 1.0, r.get('desc', ''))
                )
            except sqlite3.IntegrityError:
                pass

    conn.commit()
    conn.close()


def extract_pagerank_and_report(entities_count, relations_count, linked_count, orphans_count, duplicates_merged, dangling_removed, orphans_auto_connected, needs_human):
    date_str = datetime.datetime.now().strftime("%Y%m%d")

    conn = sqlite3.connect('data/cortex.db')
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM entities ORDER BY weight DESC LIMIT 5")
    top5 = [row[0] for row in cursor.fetchall()]

    cursor.execute("SELECT id FROM entities ORDER BY weight ASC LIMIT 5")
    bottom5 = [row[0] for row in cursor.fetchall()]

    conn.close()

    needs_human_str = "[" + "_".join(needs_human) + "]" if needs_human else "NONE"
    top5_str = "_".join(top5) if top5 else "NONE"
    bottom5_str = "_".join(bottom5) if bottom5 else "NONE"

    report_lines = [
        f"Stats: Entities={entities_count} Relations={relations_count}",
        f"Integrity: Linked={linked_count}/{entities_count} Orphans={orphans_count} Dangling={dangling_removed} Duplicates={duplicates_merged}",
        f"Cleaning: Orphans_auto_connected={orphans_auto_connected} Dangling_removed={dangling_removed} Duplicates_merged={duplicates_merged} Needs_human={needs_human_str}",
        f"PageRank: Top5+{top5_str} Bottom5+{bottom5_str}"
    ]

    report_path = f"data/memories/{date_str}-graph-validation.md"
    with open(report_path, "w", encoding="utf-8") as f:
        f.write("\n".join(report_lines) + "\n")

    print(f"Generated report at {report_path}")
