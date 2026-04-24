import os
import shutil
import datetime
import logging
import re
from pathlib import Path
from cortex import Cortex
try:
    from reason import ReasoningEngine
except ImportError:
    pass

logging.basicConfig(level=logging.INFO, format='[Evolution] %(message)s')

class Evolver:
    def __init__(self, project_root=None):
        # Default to the root of the repo (parent of src/kernel/orchestration)
        self.project_root = project_root or Path(__file__).resolve().parents[3]
        self.kernel_path = self.project_root / "src" / "kernel"
        self.data_path = self.project_root / "data"
        self.memories_path = self.data_path / "memories"
        self.inputs_path = self.data_path / "inputs"

        # Ensure directory structure exists
        self.data_path.mkdir(parents=True, exist_ok=True)
        self.memories_path.mkdir(parents=True, exist_ok=True)
        self.inputs_path.mkdir(parents=True, exist_ok=True)

        self.cortex = Cortex()

    def run_daily_cycle(self):
        logging.info("Starting Daily Evolution Cycle...")

        # 1. Sleep: Metabolize & Decay
        self.cortex.decay_memories()

        # 2. Dream: Incubate Intuitions & Epistemic Curiosity
        intuitions = self._incubate_ideas()

        # 3. Orient: Scan Inputs
        new_inputs = self._scan_inputs()

        # 4. Wake: Generate Strategic Brief
        stats = self.cortex.get_stats()
        orphans = self.cortex.get_orphans()
        self._generate_mission(stats, orphans, new_inputs, intuitions)

        # 5. Archive processed inputs
        self._archive_inputs()

        logging.info("Cycle Complete.")

    def _incubate_ideas(self):
        try:
            r = ReasoningEngine(self.project_root)
            insights = r.ponder()
            if isinstance(insights, dict) and "error" not in insights:
                self._generate_cognitive_report(insights)
            return insights
        except Exception as e:
            logging.error(f"Failed to ponder: {e}")
            return {}

    def _generate_cognitive_report(self, insights):
        now_utc = datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
        date_prefix = datetime.datetime.now().strftime("%Y%m%d")
        filename = self.memories_path / f"{date_prefix}-cognitive-report.md"

        content = [
            f"# 🧠 NEXUS CORTEX: Cognitive Report",
            f"",
            f"Date: {now_utc} (UTC)",
            f""
        ]

        # 1. 状态基线 (Baseline)
        content.append("## 系统状态基线 (System Status Baseline)")
        for item in insights.get("baseline", []):
            content.append(item)
        content.append("")

        # 2. 物理层遥测 (Telemetry)
        content.append("## 物理层性能遥测 (Physical Telemetry)")
        for item in insights.get("telemetry", []):
            content.append(f"* {item}")
        content.append("")

        # 3. 认知网络扫描 (Scan)
        content.append("## 认知网络断层扫描 (Cognitive Network Scan)")
        for item in insights.get("scan", []):
            content.append(f"* {item}")
        content.append("")

        # 4. 零熵演化推演 (Evolution)
        content.append("## 零熵演化推演 (Zero-Entropy Evolution Hypothesis)")
        for item in insights.get("evolution", []):
            content.append(item)
        content.append("")

        with open(filename, "w", encoding="utf-8") as f:
            f.write("\n".join(content))
        logging.info(f"Cognitive Report generated: {filename}")

    def _scan_inputs(self):
        files = []
        if self.inputs_path.exists():
            for f in self.inputs_path.iterdir():
                if f.is_file() and f.name.endswith(".md") and not f.name.startswith('.'):
                    files.append(f)
        return files

    def _archive_inputs(self):
        now = datetime.datetime.now()
        archive_dir = self.inputs_path / "archive" / f"{now.year}" / f"{now.month:02d}"
        archive_dir.mkdir(parents=True, exist_ok=True)

        for f in self.inputs_path.iterdir():
            if f.is_file() and f.name.endswith(".md") and not f.name.startswith('.'):
                shutil.move(str(f), str(archive_dir / f.name))

    def _analyze_file_content(self, filepath):
        """Extract tags from Harvester's analysis block in the MD file."""
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                # Try to extract from the new Zero-Entropy Analysis Matrix format
                match = re.search(r'\* DEPENDENCY_ENTROPY:\s*(.*)', content)
                if match:
                    return match.group(1).strip()
                # Fallback for older format
                match_old_1 = re.search(r'\* Dependency Entropy: Detected via Harvest Tags \((.*?)\)', content)
                if match_old_1:
                    return match_old_1.group(1).strip()
                # Fallback for oldest formats
                match_old = re.search(r'> \*\*Analysis\*\*: (.*)', content)
                if match_old:
                    return match_old.group(1).strip()
        except Exception as e:
            logging.warning(f"Failed to analyze file {filepath}: {e}", exc_info=True)
        return ""

    def _generate_mission(self, stats, orphans, new_inputs, intuitions):
        # Categorize Intel
        categories = {
            "架构情报 (Architecture)": [],
            "竞品雷达 (Competitors)": [],
            "边缘战备 (Edge AI)": [],
            "其他动态 (General)": []
        }

        arch_triggers = ['nexent', 'astron', 'mcp', 'agent', 'protocol']
        comp_triggers = ['dify', 'langchain', 'openai', 'anthropic']
        edge_triggers = ['mindspore', 'mediapipe', 'litert', 'npu', 'arm', 'quantiz', 'vllm']

        for f in new_inputs:
            fname = f.name.lower()
            tags = self._analyze_file_content(f)
            entry = f"- **{f.name}**\n  - > **Analysis**: {tags}" if tags else f"- **{f.name}**"

            if any(t in fname for t in arch_triggers):
                categories["架构情报 (Architecture)"].append(entry)
            elif any(t in fname for t in comp_triggers):
                categories["竞品雷达 (Competitors)"].append(entry)
            elif any(t in fname for t in edge_triggers):
                categories["边缘战备 (Edge AI)"].append(entry)
            else:
                categories["其他动态 (General)"].append(entry)

        # Generate Content
        now = datetime.datetime.now().strftime("%Y-%m-%d")
        content = [
            f"# 每日简报 (Daily Brief)",
            f"> DATE: {now} | ENTROPY: {stats['density']:.4f}",
            f"",
            f"## 系统健康状态 (System Health)",
            f"* STATUS: ONLINE",
            f"* NODES_COUNT: {stats['entities']}",
            f"* EDGES_COUNT: {stats['relations']}",
            ""
        ]

        # 【核心修复：抛弃乱序的 _flat_insights，采用结构化的潜意识反馈】
        if isinstance(intuitions, dict):
            content.append("## 潜意识觉醒 (Nightly Cognitive Intuitions)")

            if "baseline" in intuitions and intuitions["baseline"]:
                content.append("### 状态基线 (Baseline)")
                for item in intuitions["baseline"]:
                    content.append(f"* {item}")

            if "telemetry" in intuitions and intuitions["telemetry"]:
                content.append("### 物理遥测 (Telemetry)")
                for item in intuitions["telemetry"]:
                    content.append(f"* {item}")

            if "scan" in intuitions and intuitions["scan"]:
                content.append("### 网络扫描 (Network Scan)")
                for item in intuitions["scan"]:
                    content.append(f"* {item}")

            if "evolution" in intuitions and intuitions["evolution"]:
                content.append("### 演进策略 (Evolution Directive)")
                for item in intuitions["evolution"]:
                    content.append(f"* {item}")

            content.append("")

        has_intel = False
        for section, items in categories.items():
            if items:
                has_intel = True
                content.append(f"## {section}")
                content.extend(items)
                content.append("")

        if not has_intel:
            content.append("## 虚空监视 (Void Watch)\n> STATUS: QUIET | No significant ecosystem movements.\n")

        # Smart Deep Work Suggestion
        suggestion = "SYSTEM_OPTIMIZATION"
        if categories["架构情报 (Architecture)"]:
            suggestion = "PROTOCOL_REVIEW"
        elif categories["边缘战备 (Edge AI)"]:
            suggestion = "EDGE_BENCHMARKING"
        elif categories["竞品雷达 (Competitors)"]:
            suggestion = "COMPETITIVE_ANALYSIS"

        content.append(f"## 深度工作建议 (Deep Work)\n* FOCUS_AREA: {suggestion}\n* TIME_BLOCK: 120m")

        if orphans:
            content.append("\n## 待处理熵值 (Entropy Targets)")
            for o in orphans:
                content.append(f"* ORPHAN_NODE: {o['name']} ({o['id']}) | WEIGHT: {o['weight']:.2f}")

        # Write to file
        filename = self.memories_path / "MISSION_ACTIVE.md"
        with open(filename, "w", encoding="utf-8") as f:
            f.write("\n".join(content))

        logging.info(f"Brief generated: {filename}")
