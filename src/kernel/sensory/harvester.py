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
        # Default to the root of the repo (parent of src/kernel/sensory)
        self.project_root = project_root or Path(__file__).resolve().parents[3]
        self.kernel_path = self.project_root / "src" / "kernel"
        self.data_path = self.project_root / "data"
        self.inputs_path = self.data_path / "inputs"
        
        # Ensure directory structure exists
        self.inputs_path.mkdir(parents=True, exist_ok=True)
        
        self.state_file = self.inputs_path / ".harvester_state.json"
        self.state = self._load_state()

        # 情报数据源 (Data Sources)
        # 切换到 releases 节点以获取包含真实描述体的载荷
        self.data_sources = {
            "ModelEngine-Group/nexent": ["releases"],
            "iflytek/astron-agent": ["releases"],
            "langgenius/dify": ["releases"],
            "vllm-project/vllm": ["releases"],
            "huggingface/transformers": ["releases"],
            "google-ai-edge/mediapipe": ["releases"],
            "microsoft/markitdown": ["releases"],
            "langchain-ai/langchain": ["releases"],
            "ollama/ollama": ["releases"],
            "openai/openai-python": ["releases"]
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

                                    # 动态生成基于真实文本内容的评估 (Dynamic assessment based on actual content)
                                    arch_conflict = "Low (Conceptual alignment possible)"
                                    if re.search(r'(?i)(docker|npm|pip|kubernetes|helm|compose)', body):
                                        arch_conflict = "High (Heavy external dependency footprint detected)"
                                    elif re.search(r'(?i)(rust|c\+\+|go)', body):
                                        arch_conflict = "Medium (Foreign language boundaries present)"

                                    hallucination_risk = "Moderate (Requires structural parsing)"
                                    if "Agent-Protocol" in tags:
                                        hallucination_risk = "High (Agentic logic often relies on nondeterministic prompts)"

                                    safe_repo = repo.replace("/", "_").lower()
                                    date_prefix = datetime.datetime.utcnow().strftime("%Y%m%d")
                                    filename = f"{date_prefix}-{safe_repo}-scan.md"
                                    filepath = self.inputs_path / filename

                                    content = f"# 📡 NEXUS HARVESTER: Intelligence Dossier\n\n"
                                    content += f"Date: {datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')} (UTC)\n"
                                    content += f"Target Identity: {repo}\n"
                                    content += f"Version Asset: {name}\n"
                                    content += f"Source Link: {html_url}\n\n"

                                    content += f"## 资产物理属性 (Asset Physical Properties)\n"
                                    content += f"* Repository Type: External Package / Intelligence\n"
                                    content += f"* Primary Language: N/A\n"
                                    content += f"* API Rate Limit Status: Bypassed via injected GITHUB_TOKEN header\n\n"

                                    content += f"## 零熵解析矩阵 (Zero-Entropy Analysis Matrix)\n"
                                    content += f"* Dependency Entropy: Detected via Harvest Tags ({tags_str})\n"
                                    content += f"* Architecture Conflict: {arch_conflict}\n"
                                    content += f"* Internal Logic: External Payload Reference only\n\n"

                                    content += f"## 威胁与兼容性评估 (Threat & Compatibility Assessment)\n"
                                    if "Breaking-Change" in tags:
                                        content += f"* Direct Code Integration: High Risk due to breaking changes\n"
                                    else:
                                        content += f"* Direct Code Integration: Strictly Prohibited (Violates pure standard library constraint)\n"
                                    content += f"* Hallucination Risk: {hallucination_risk}\n\n"

                                    content += f"## 行动指令 (Action Directives)\n"
                                    content += f"1. Reject all dependency injections from this repository\n"
                                    if "Agent-Protocol" in tags:
                                        content += f"2. Analyze plugin/agent architecture for conceptual integration\n"
                                    elif "Edge-Ready" in tags:
                                        content += f"2. Extract edge execution boundaries for potential local deployment\n"
                                    else:
                                        content += f"2. Extract core theoretical concepts for zero-entropy refactoring\n"
                                    content += f"3. Ensure any extracted logic uses pure Python `typing` and `inspect.signature`\n\n"

                                    content += f"## 原始载荷 (Raw Payload)\n\n```text\n{body}\n```\n"

                                    with open(filepath, 'w', encoding='utf-8') as f:
                                        f.write(content)

                                    new_files.append(filepath)
                                    logger.info(f"[Harvester] New Intel harvested: {filename}")
                except urllib.error.HTTPError as e:
                    if e.code in [403, 429]:
                        logger.warning(f"[Harvester] Defensive retreat: Rate limit hit on {url}")
                        break
                    else:
                        logger.warning(f"[Harvester] Failed to fetch {url}: {e}")
                except Exception as e:
                    logger.warning(f"[Harvester] Failed to fetch {url}: {e}")

        self._save_state()
        return new_files
