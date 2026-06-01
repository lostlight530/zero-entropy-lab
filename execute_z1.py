import sys
import os
import subprocess
import sqlite3
import datetime
import glob
import shutil

# Dynamic Kernel imports
sys.path.append("src/kernel")
from sensory.harvester import Harvester
from cognitive.reason import ReasoningEngine

def get_graph_stats():
    conn = sqlite3.connect('data/cortex.db')
    c = conn.cursor()
    c.execute("SELECT count(*) FROM entities")
    nodes = c.fetchone()[0]
    c.execute("SELECT count(*) FROM relations")
    edges = c.fetchone()[0]
    c.execute("SELECT count(*) FROM entities e LEFT JOIN relations r ON e.id = r.source OR e.id = r.target WHERE r.source IS NULL AND e.type NOT IN ('code_file', 'code_class', 'code_function')")
    orphans = c.fetchone()[0]
    conn.close()
    return nodes, edges, orphans

def main():
    date_str = datetime.datetime.now().strftime("%Y%m%d")
    year_str = datetime.datetime.now().strftime("%Y")
    month_str = datetime.datetime.now().strftime("%m")

    # Pre stats
    nodes_pre, edges_pre, orphans_pre = get_graph_stats()

    # Step 1: Run harvester dynamically
    print("Running harvester...")
    h = Harvester()
    new_intel_files = h.fetch_github_data()

    # Step 2: Check and move files to archive
    inputs_dir = "data/inputs"
    archive_dir = f"data/inputs/archive/{year_str}/{month_str}"
    os.makedirs(archive_dir, exist_ok=True)

    inputs_count = len(new_intel_files)
    sources_count = len(h.data_sources)

    observations = []

    arch_triggers = ['nexent', 'astron', 'mcp', 'agent', 'protocol']
    comp_triggers = ['dify', 'langchain', 'openai', 'anthropic']
    edge_triggers = ['mindspore', 'mediapipe', 'litert', 'npu', 'arm', 'quantiz', 'vllm']

    focus_category = "SYSTEM_OPTIMIZATION"
    bounties = ["NONE"]

    for f in new_intel_files:
        fname = os.path.basename(f)
        try:
            shutil.move(f, os.path.join(archive_dir, fname))
        except Exception:
            pass

        # Categorize for Focus
        f_lower = fname.lower()
        if any(t in f_lower for t in arch_triggers):
            focus_category = "REVIEW_ARCHITECTURE_PRS_AND_PROTOCOL_SPECS"
        elif any(t in f_lower for t in edge_triggers):
            focus_category = "EDGE_INFERENCE_BENCHMARKING"
        elif any(t in f_lower for t in comp_triggers):
            focus_category = "STRATEGIC_ANALYSIS_OF_COMPETITOR_UPDATES"

        observations.append(f"NEW_INTEL_OBSERVED_IN_{fname.upper().replace('.MD', '').replace('-', '_')}")

    if not observations:
        observations.append("NONE_DETECTED")

    # Step 3: Run reasoning dynamically
    print("Running reasoner...")
    r = ReasoningEngine()
    insights = r.ponder()

    # Calculate Inferences
    inferences = len(insights.get("_flat_insights", []))

    # Post stats
    nodes_post, edges_post, orphans_post = get_graph_stats()

    # Delta
    nodes_delta = nodes_post - nodes_pre
    edges_delta = edges_post - edges_pre
    orphans_delta = orphans_post - orphans_pre

    # Orphan cleanup task determination
    if orphans_post > 0:
        bounties = [f"CLEANUP_{orphans_post}_ORPHAN_NODES"]

    # Step 4 & 5: Generate output files (Format strictly upper KV, no periods)
    report_lines = [
        f"HARVEST: SOURCES={sources_count} INPUTS={inputs_count} PATH={archive_dir.upper().replace('/', '_')}",
        f"OBSERVATIONS: {'_AND_'.join(observations)}" if observations else "OBSERVATIONS: NONE_DETECTED",
        f"REASONING: INFERENCES={inferences} ENTITY_CANDIDATES={nodes_delta} RELATION_CANDIDATES={edges_delta}",
        f"MISSION_ACTIVE: FOCUS={focus_category} BOUNTIES={'_AND_'.join(bounties)}",
        f"GRAPH_DELTA: ENTITIES+{nodes_delta} RELATIONS+{edges_delta} ORPHANS={orphans_post}"
    ]

    report_path = f"data/memories/{date_str}-cognitive-report.md"
    with open(report_path, "w", encoding="utf-8") as f:
        f.write("\n".join(report_lines) + "\n")

    mission_path = "data/memories/MISSION_ACTIVE.md"
    with open(mission_path, "w", encoding="utf-8") as f:
        f.write(f"FOCUS: {focus_category}\nBOUNTIES: {'_AND_'.join(bounties)}\n")

if __name__ == "__main__":
    main()
