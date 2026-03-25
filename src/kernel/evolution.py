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
        # Default to the root of the repo (parent of src/kernel)
        self.project_root = project_root or Path(__file__).resolve().parents[2]
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
        logging.info("Starting Scheduled Data Processing Cycle...")

        # 1. 数据权重衰退计算 (Data weight decay calculation)
        self.cortex.decay_memories()

        # 2. 批处理后台分析 (Batch process background analysis)
        insights = self._process_background_analysis()

        # 3. 扫描外部输入源 (Scan external inputs)
        new_inputs = self._scan_inputs()

        # 4. 生成系统状态简报 (Generate system status report)
        stats = self.cortex.get_stats()
        orphans = self.cortex.get_orphans()
        self._generate_mission(stats, orphans, new_inputs, insights)

        # 5. 归档处理完成的数据 (Archive processed inputs)
        self._archive_inputs()

        logging.info("Cycle Complete.")

    def _process_background_analysis(self):
        try:
            r = ReasoningEngine(self.project_root)
            insights = r.ponder()
            if insights and "Error:" not in insights[0]:
                self._generate_analysis_report(insights)
            return insights
        except Exception as e:
            logging.error(f"Failed to process analysis: {e}")
            return []

    def _generate_analysis_report(self, insights):
        now_utc = datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
        date_prefix = datetime.datetime.now().strftime("%Y%m%d")
        filename = self.memories_path / f"{date_prefix}-analysis-report.md"

        content = [
            f"# 📊 系统分析报告 (System Analysis Report)",
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
        # 分类数据源 (Categorize Data Sources)
        categories = {
            "架构情报 (Architecture)": [],
            "生态动态 (Ecosystem)": [],
            "边缘端算力 (Edge AI)": [],
            "常规记录 (General)": []
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
                categories["生态动态 (Ecosystem)"].append(entry)
            elif any(t in fname for t in edge_triggers):
                categories["边缘端算力 (Edge AI)"].append(entry)
            else:
                categories["常规记录 (General)"].append(entry)

        # 生成简报内容 (Generate Brief Content)
        now = datetime.datetime.now().strftime("%Y-%m-%d")
        content = [
            f"# 🛡️ 架构与生态简报 (Architecture & Ecosystem Brief)",
            f"> **Date**: {now} | **Density**: {stats['density']:.4f}",
            f"",
            f"## 系统状态 (System Health)",
            f"- **Status**: ONLINE",
            ""
        ]

        has_intel = False
        for section, items in categories.items():
            if items:
                has_intel = True
                content.append(f"## {section}")
                content.extend(items)
                content.append("")

        if not has_intel:
            content.append("## 无外部数据流入 (No significant external data movements)\n")

        # 核心任务推荐 (Core Task Suggestion)
        suggestion = "System Optimization"
        if categories["架构情报 (Architecture)"]:
            suggestion = "Review Architecture Updates"
        elif categories["边缘端算力 (Edge AI)"]:
            suggestion = "Evaluate Edge Inference Frameworks"
        elif categories["生态动态 (Ecosystem)"]:
            suggestion = "Analyze Ecosystem Repositories"

        content.append(f"## 高优先级任务推荐 (High Priority Task)\n> **Focus**: {suggestion}\n")

        if orphans:
            content.append("\n## 待处理孤岛节点 (Pending Isolated Nodes)")
            for o in orphans:
                content.append(f"- **{o['name']}** ({o['id']}): Weight {o['weight']:.2f}")

        # 写入文件 (Write to file)
        filename = self.memories_path / "SYSTEM_BRIEF.md"
        with open(filename, "w", encoding="utf-8") as f:
            f.write("\n".join(content))

        logging.info(f"Brief generated: {filename}")
