import json
import os
import datetime
import re
from pathlib import Path

try:
    from logger import logger
except ImportError:
    import sys, os
    sys.path.append(os.path.dirname(__file__))
    from logger import logger

class Harvester:
    def __init__(self, project_root=None):
        # Default to the root of the repo (parent of src/kernel)
        self.project_root = project_root or Path(__file__).resolve().parents[2]
        self.kernel_path = self.project_root / "src" / "kernel"
        self.data_path = self.project_root / "data"
        self.inputs_path = self.data_path / "inputs"
        
        # Ensure directory structure exists
        self.inputs_path.mkdir(parents=True, exist_ok=True)
        
        self.state_file = self.inputs_path / ".harvester_state.json"
        self.state = self._load_state()

        # 情报数据源 (Data Sources)
        self.data_sources = {
            "ModelEngine-Group/nexent": ["tags"],
            "iflytek/astron-agent": ["tags"],
            "langgenius/dify": ["tags"],
            "vllm-project/vllm": ["tags"],
            "huggingface/transformers": ["tags"],
            "google-ai-edge/mediapipe": ["tags"],
            "microsoft/markitdown": ["tags"]
        }

    def _load_state(self):
        if self.state_file.exists():
            try:
                with open(self.state_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except Exception as e:
                logger.error(f"Failed to load harvester state: {e}", exc_info=True)
        return {}

    def _save_state(self):
        try:
            with open(self.state_file, 'w', encoding='utf-8') as f:
                json.dump(self.state, f, indent=2, ensure_ascii=False)
        except Exception as e:
            logger.error(f"Failed to save harvester state: {e}", exc_info=True)

    def _extract_tags(self, text):
        """内容标签提取 (Content Tag Extraction)"""
        tags = []
        # Edge AI
        if re.search(r'(?i)(onnx|gguf|litert|android|ios|arm|npu|quantiz)', text):
            tags.append("🏷️ Edge-Ready")
        # Breaking Changes
        if re.search(r'(?i)(breaking|deprecated|removed|migration)', text):
            tags.append("⚠️ Breaking-Change")
        # Agent Protocol
        if re.search(r'(?i)(mcp|plugin|workflow|skill|orchestrat|hitl)', text):
            tags.append("🔗 Agent-Protocol")
        return tags

    def fetch_github_data(self):
        logger.info("[Harvester] Scanning frequencies...")
        new_files = []
        logger.info("[Harvester] Skipping external fetch: Protocol restricts external API usage.")
        self._save_state()
        return new_files
