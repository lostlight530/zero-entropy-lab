import os
import ast
import re
import datetime
import json
from pathlib import Path

# Try to connect to the Mind
try:
    from cortex import Cortex
    from logger import logger
except ImportError:
    import sys, os
    sys.path.append(os.path.dirname(__file__))
    from cortex import Cortex
    from logger import logger

class Scholar:
    def __init__(self, project_root=None):
        # Default to the root of the repo (parent of src/kernel/sensory)
        self.project_root = project_root or Path(__file__).resolve().parents[3]
        self.kernel_path = self.project_root / "src" / "kernel"
        self.data_path = self.project_root / "data"
        self.knowledge_path = self.data_path / "knowledge"
        self.config_path = self.data_path / "brain_config.json"
        self.memories_path = self.data_path / "memories" # New path for memories

        # Ensure directory structure exists
        self.data_path.mkdir(parents=True, exist_ok=True)
        self.knowledge_path.mkdir(parents=True, exist_ok=True)
        self.memories_path.mkdir(parents=True, exist_ok=True) # Ensure memories directory exists

        # Connect to Cortex (The Mind)
        self.cortex = Cortex()

        # Load Config
        self.config = self._load_config()

        # Ignored patterns (Noise Filter)
        self.ignore_dirs = {
            '.git', '__pycache__', 'node_modules', 'data', 'venv', '.idea', '.vscode', '.github'
        }
        self.ignore_files = {
            '.DS_Store', 'cortex.db', 'cortex.db-journal', '.gitignore',
            'package-lock.json', 'yarn.lock', 'requirements.txt', '.editorconfig'
        }

    def _load_config(self):
        if self.config_path.exists():
            try:
                with open(self.config_path, 'r', encoding='utf-8') as f: return json.load(f)
            except: pass
        return {"philosophy": "Zero-Entropy"}

    def ingest_repository(self, root_path):
        """[Omniscience Protocol] Deep scan of the codebase."""
        logger.info(f"🧠 Scholar starting deep scan of: {root_path}")
        root = Path(root_path)
        count = 0

        # Create a central project node to avoid orphan files
        repo_id = "repo_zero_entropy_lab"
        if self.cortex:
            self.cortex.add_entity(
                id=repo_id,
                type_slug="repository",
                name="Zero-Entropy Lab",
                desc="The absolute zero-dependency core repository.",
                save_to_disk=True
            )

        for dirpath, dirnames, filenames in os.walk(root):
            # Prune ignored directories
            dirnames[:] = [d for d in dirnames if d not in self.ignore_dirs]

            for file in filenames:
                if file in self.ignore_files or file.endswith(('.pyc', '.db')): continue

                filepath = Path(dirpath) / file
                try:
                    file_id = self._digest_file(root, filepath)
                    if file_id and self.cortex:
                        # Map all files to the repository node to eliminate orphans
                        self.cortex.connect_entities(repo_id, "contains", file_id, save_to_disk=True)
                        # We don't add "part_of" reverse link because it triggers a "Graph Cycle" warning in reason.py
                    count += 1
                except Exception as e:
                    logger.error(f"   ⚠️ Failed to digest {file}: {e}", exc_info=True)

        logger.info(f"✅ Ingestion Complete. {count} files mapped into Cortex.")

    def _digest_file(self, root, filepath):
        rel_path = filepath.relative_to(root)

        # Ensure consistent Unix-style forward slashes for path representation and IDs
        rel_path_str = str(rel_path).replace('\\', '/')
        safe_path = rel_path_str.replace('/', '_').replace('.', '_')
        file_id = f"file_{safe_path}"

        # 1. Register File Node
        if self.cortex:
            self.cortex.add_entity(
                id=file_id,
                type_slug="code_file",
                name=filepath.name,
                desc=f"Source file at: {rel_path_str}",
                save_to_disk=True
            )

        # 2. Deep Content Analysis
        if filepath.suffix == '.py':
            self._analyze_python_ast(filepath, file_id)
        elif filepath.suffix == '.md':
            self._analyze_markdown_structure(filepath, file_id)

        return file_id

    def _analyze_python_ast(self, filepath, file_id):
        """Use Python's native AST to understand code structure."""
        if not self.cortex: return
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            tree = ast.parse(content)

            for node in ast.walk(tree):
                # Classes
                if isinstance(node, ast.ClassDef):
                    class_id = f"class_{node.name}"

                    # Detect Decorators (e.g. @dataclass)
                    is_dataclass = False
                    for decorator in node.decorator_list:
                        if isinstance(decorator, ast.Name) and decorator.id == "dataclass":
                            is_dataclass = True
                        elif isinstance(decorator, ast.Call) and isinstance(decorator.func, ast.Name) and decorator.func.id == "dataclass":
                            is_dataclass = True

                    desc = ast.get_docstring(node) or "Python Class"
                    if is_dataclass:
                        desc = f"[DataClass] {desc}"

                    self.cortex.add_entity(class_id, "code_class", node.name, desc[:100], save_to_disk=True)
                    self.cortex.connect_entities(file_id, "defines", class_id, save_to_disk=True)

                    if is_dataclass:
                        self.cortex.activate_memory(class_id, boost=0.5)

                    # Inheritance
                    for base in node.bases:
                        if isinstance(base, ast.Name):
                            self.cortex.connect_entities(class_id, "inherits_from", f"class_{base.id}", save_to_disk=True)
                        elif isinstance(base, ast.Attribute):
                            # e.g., inherits from http.server.SimpleHTTPRequestHandler
                            parent_name = f"{base.value.id}.{base.attr}" if isinstance(base.value, ast.Name) else base.attr
                            self.cortex.connect_entities(class_id, "inherits_from", f"class_{parent_name}", save_to_disk=True)

                # Functions
                elif isinstance(node, ast.FunctionDef):
                    func_id = f"func_{node.name}"
                    desc = ast.get_docstring(node) or "Python Function"
                    self.cortex.add_entity(func_id, "code_function", node.name, desc[:100], save_to_disk=True)
                    self.cortex.connect_entities(file_id, "defines", func_id, save_to_disk=True)
        except Exception as e:
            logger.error(f"Error analyzing python ast for {filepath}: {e}", exc_info=True)

    def _analyze_markdown_structure(self, filepath, file_id):
        """Extract headers as knowledge nodes."""
        if not self.cortex: return

        # Determine specific concept type based on file location
        concept_type = "concept"
        rel_path_str = str(filepath).replace('\\', '/')
        if "docs/brain" in rel_path_str:
            concept_type = "architecture_concept"
        elif filepath.name.lower() == "readme.md":
            concept_type = "core_concept"
        else:
            concept_type = "doc_section"

        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                for line in f:
                    match = re.match(r'^(#{1,3})\s+(.*)', line)
                    if match:
                        title = match.group(2).strip()
                        safe_title = "".join([c for c in title if c.isalnum() or c == ' ']).strip().replace(' ', '_').lower()
                        if safe_title:
                            concept_id = f"{concept_type}_{safe_title}"[:60]
                            self.cortex.add_entity(concept_id, concept_type, title, f"Section in {filepath.name}", save_to_disk=True)
                            self.cortex.connect_entities(file_id, "documents", concept_id, save_to_disk=True)
        except Exception as e:
            logger.error(f"Error analyzing markdown structure for {filepath}: {e}", exc_info=True)

    def learn(self, input_file):
        """Legacy single file learning (kept for compatibility)"""
        input_path = Path(input_file)
        if not input_path.exists(): return None
        try:
            self._digest_file(self.project_root, input_path)
            return f"Ingested {input_path.name} into Graph."
        except Exception as e:
            return f"Error: {e}"
