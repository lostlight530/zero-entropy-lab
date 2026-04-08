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
        import urllib.request
        logger.info("[Harvester] Scanning frequencies...")
        new_files = []
        token = os.environ.get("GITHUB_TOKEN")

        # 零依赖 HTTP 客户端 (Zero-Dependency HTTP Client)
        for repo, endpoints in self.data_sources.items():
            for endpoint in endpoints:
                url = f"https://api.github.com/repos/{repo}/{endpoint}"
                req = urllib.request.Request(url)
                req.add_header('User-Agent', 'Nexus-Cortex-Harvester/1.0')
                if token:
                    req.add_header('Authorization', f'Bearer {token}')

                try:
                    with urllib.request.urlopen(req, timeout=10) as response:
                        if response.status == 200:
                            data = json.loads(response.read().decode('utf-8'))

                            # 取最新的一条数据 (Get the latest entry)
                            if data and isinstance(data, list):
                                latest = data[0]
                                item_id = str(latest.get('id', latest.get('node_id', 'unknown')))

                                state_key = f"{repo}_{endpoint}"
                                if self.state.get(state_key) != item_id:
                                    # 发现新数据 (New data discovered)
                                    self.state[state_key] = item_id

                                    # 构建 MD 报告 (Generate MD Report)
                                    name = latest.get('name', 'N/A')
                                    body = latest.get('body', '') or latest.get('commit', {}).get('message', '')
                                    html_url = latest.get('html_url', f"https://github.com/{repo}")

                                    tags = self._extract_tags(body)
                                    tags_str = ", ".join(tags) if tags else "General"

                                    safe_repo = repo.replace("/", "_")
                                    filename = f"{safe_repo}_{endpoint}_{name.replace(' ', '_')}.md"
                                    filepath = self.inputs_path / filename

                                    content = f"# 情报报告 (Intelligence Report): {repo}\n\n"
                                    content += f"> **Type**: {endpoint.capitalize()}\n"
                                    content += f"> **Version/Name**: {name}\n"
                                    content += f"> **Link**: {html_url}\n"
                                    content += f"> **Analysis**: {tags_str}\n\n"
                                    content += f"## 载荷 (Payload)\n\n```text\n{body}\n```\n"

                                    with open(filepath, 'w', encoding='utf-8') as f:
                                        f.write(content)

                                    new_files.append(filepath)
                                    logger.info(f"[Harvester] New Intel harvested: {filename}")
                except Exception as e:
                    logger.warning(f"[Harvester] Failed to fetch {url}: {e}")

        self._save_state()
        return new_files
