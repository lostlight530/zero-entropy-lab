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
            if insights and "❌ **Critical**" not in insights[0]:
                self._generate_cognitive_report(insights)
            return insights
        except Exception as e:
            logging.error(f"Failed to ponder: {e}")
            return []

    def _generate_cognitive_report(self, insights):
        now_utc = datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
        date_prefix = datetime.datetime.now().strftime("%Y%m%d")
        filename = self.memories_path / f"{date_prefix}-cognitive-report.md"

        content = [
            f"# 🧠 NEXUS CORTEX: Cognitive Report",
            f"> **Date**: {now_utc} (UTC)",
            f""
        ]

        for insight in insights:
            # Insight is already formatted in reason.py with emojis
            content.append(f"- {insight}")

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
                match = re.search(r'> \*\*Analysis\*\*: (.*)', content)
                if match:
                    return match.group(1).strip()
        except Exception as e:
            logging.warning(f"Failed to analyze file {filepath}: {e}", exc_info=True)
        return ""

    def _generate_mission(self, stats, orphans, new_inputs, intuitions):
        # Categorize Intel
        categories = {
            "🧠 架构情报 (Architecture)": [],
            "⚔️ 竞品雷达 (Competitors)": [],
            "📦 边缘战备 (Edge AI)": [],
            "ℹ️ 其他动态 (General)": []
        }

        arch_triggers = ['nexent', 'astron', 'mcp', 'agent', 'protocol']
        comp_triggers = ['dify', 'langchain', 'openai', 'anthropic']
        edge_triggers = ['mindspore', 'mediapipe', 'litert', 'npu', 'arm', 'quantiz', 'vllm']

        for f in new_inputs:
            fname = f.name.lower()
            tags = self._analyze_file_content(f)
            entry = f"- **{f.name}**\n  - > **Analysis**: {tags}" if tags else f"- **{f.name}**"

            if any(t in fname for t in arch_triggers):
                categories["🧠 架构情报 (Architecture)"].append(entry)
            elif any(t in fname for t in comp_triggers):
                categories["⚔️ 竞品雷达 (Competitors)"].append(entry)
            elif any(t in fname for t in edge_triggers):
                categories["📦 边缘战备 (Edge AI)"].append(entry)
            else:
                categories["ℹ️ 其他动态 (General)"].append(entry)

        # Generate Content
        now = datetime.datetime.now().strftime("%Y-%m-%d")
        content = [
            f"# 每日简报 (Daily Brief)",
            f"> **Date**: {now} | **Entropy**: {stats['density']:.4f}",
            f"",
            f"## 🚨 昨夜今晨 (System Health)",
            f"- **Status**: 🟢 **ONLINE**",
            f"- **Nodes**: {stats['entities']}",
            f"- **Edges**: {stats['relations']}",
            ""
        ]

        # 【核心修复：将夜间推演的 intuitions 按严格格式注入】
        if intuitions:
            content.append("## 🧠 夜间潜意识觉醒 (Nightly Cognitive Intuitions)")
            for insight in intuitions:
                content.append(f"- {insight}")
            content.append("")

        has_intel = False
        for section, items in categories.items():
            if items:
                has_intel = True
                content.append(f"## {section}")
                content.extend(items)
                content.append("")

        if not has_intel:
            content.append("## 🌌 虚空监视 (Void Watch)\n> No significant ecosystem movements.\n")

        # Smart Deep Work Suggestion
        suggestion = "System Optimization"
        if categories["🧠 架构情报 (Architecture)"]:
            suggestion = "Review Architecture PRs & Protocol Specs"
        elif categories["📦 边缘战备 (Edge AI)"]:
            suggestion = "Edge Inference Benchmarking (vLLM/LiteRT)"
        elif categories["⚔️ 竞品雷达 (Competitors)"]:
            suggestion = "Strategic Analysis of Competitor Updates"

        content.append(f"## 📅 深度工作建议 (Deep Work)\n> **Focus**: {suggestion}\n- [ ] Block 2 hours.")

        if orphans:
            content.append("\n## 🔍 待处理熵值 (Entropy Targets)")
            for o in orphans:
                content.append(f"- **{o['name']}** ({o['id']}): Weight {o['weight']:.2f}")

        # Write to file
        filename = self.memories_path / "MISSION_ACTIVE.md"
        with open(filename, "w", encoding="utf-8") as f:
            f.write("\n".join(content))

        logging.info(f"Brief generated: {filename}")
