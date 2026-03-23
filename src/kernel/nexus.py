import sys
import os
import argparse
import shutil
import json
import http.server
import socketserver
import threading
import queue
import time
from pathlib import Path
from urllib.parse import urlparse, parse_qs

from dataclasses import dataclass, asdict
from typing import Any, Optional

# Lazy Imports
try:
    from cortex import Cortex
    from harvester import Harvester
    from evolution import Evolver
    from scholar import Scholar
    from reason import ReasoningEngine # <--- The Frontal Lobe
    from logger import logger
    from mcp import registry as mcp_registry
except ImportError:
    # Handle direct root execution or path issues
    sys.path.append(os.path.dirname(__file__))
    from cortex import Cortex
    from harvester import Harvester
    from evolution import Evolver
    from scholar import Scholar
    from reason import ReasoningEngine
    from logger import logger
    from mcp import registry as mcp_registry

@dataclass
class APIResponse:
    status: str
    payload: Any = None
    message: Optional[str] = None

# 1. 无锁的智能体蜂群并发网关 (Lock-free Agent Swarm Concurrent Gateway)
class ThreadedNexusServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    """原生零依赖多线程承载，支持多个大模型 Agent 同时接入 MCP 协议 (Native zero-dependency multithreading support for multiple concurrent LLM Agents via MCP)"""
    daemon_threads = True
    allow_reuse_address = True

# 2. 事件驱动的潜意识流 (Event-Driven Subconscious Stream)
consciousness_stream = queue.Queue()

class SubconsciousThread(threading.Thread):
    """
    系统的后台潜意识引擎。(The background subconscious engine of the system.)
    当 API 端口长时间没有大模型调用时，系统会自动进入 '做梦' 状态，开始进行碎片整理与图谱演算。
    (When the API port is idle for a long time, the system enters a 'dreaming' state to defragment and calculate graph associations.)
    """
    def __init__(self):
        super().__init__(daemon=True)
        self.is_dreaming = False

    def run(self):
        logger.info("🧠 Subconscious Thread Activated. Waiting for quiet cycles...")
        while True:
            try:
                # 监听前台神经刺激。如果 60 秒内没有任何 API 请求，抛出 Empty 异常进入梦境。
                # (Listen for foreground neural stimuli. If no API request within 60s, throw Empty exception and enter dream state.)
                event = consciousness_stream.get(timeout=60.0)
                # 如果收到刺激，打断梦境，让出 CPU 给前台 API
                # (If stimulus received, interrupt the dream and yield CPU to foreground API)
                if self.is_dreaming:
                    logger.info("⚡ External Stimulus detected. Waking up from dream.")
                    self.is_dreaming = False
            except queue.Empty:
                if not self.is_dreaming:
                    self.is_dreaming = True
                    logger.info("🌙 Entering REM Sleep. Background associative reasoning started...")
                    try:
                        # 延迟加载，防止循环依赖 (Lazy load to prevent circular dependency)
                        from reason import ReasoningEngine
                        engine = ReasoningEngine()
                        insights = engine.ponder()
                        if insights:
                            logger.info(f"✨ Epiphany during sleep: Extracted {len(insights)} latent insights.")
                    except Exception as e:
                        logger.error(f"Dream interrupted by cognitive fault: {e}")

# 3. 拦截请求并注入潜意识 (Intercept requests and inject into subconscious)
class NexusHandler(http.server.SimpleHTTPRequestHandler):
    """Native API & Static File Router"""
    def __init__(self, *args, **kwargs):
        self.kernel_path = Path(__file__).parent.resolve()
        # src/kernel/nexus.py -> parents[2] is root
        self.project_root = Path(__file__).resolve().parents[2]
        self.cortex = Cortex()

        # Load API Config
        self.api_key = os.environ.get("NEXUS_API_KEY")
        self.allowed_origins = ["http://localhost:8000", "http://127.0.0.1:8000"]

        config_path = self.project_root / "data" / "brain_config.json"
        if config_path.exists():
            try:
                with open(config_path, "r", encoding="utf-8") as f:
                    config = json.load(f)
                    if "api_key" in config:
                        self.api_key = config["api_key"]
                    if "allowed_origins" in config:
                        self.allowed_origins = config["allowed_origins"]
            except Exception as e:
                logger.warning(f"Failed to load brain_config.json for auth: {e}")

        super().__init__(*args, **kwargs)

    def _check_auth(self) -> bool:
        if not self.api_key:
            return True # Open if no key configured
        auth_header = self.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return False
        token = auth_header.split(" ")[1]
        return token == self.api_key

    def do_GET(self):
        parsed_url = urlparse(self.path)
        path = parsed_url.path

        if path.startswith("/api/"):
            self.handle_api(path, parsed_url.query, method="GET")
        else:
            # Shift directory to project root for static serving
            # This is slightly risky in a multi-threaded server but okay for our native lab
            os.chdir(self.project_root)
            super().do_GET()

    def do_POST(self):
        parsed_url = urlparse(self.path)
        path = parsed_url.path

        if path.startswith("/api/"):
            # Handle POST data
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length) if content_length > 0 else b''
            self.handle_api(path, parsed_url.query, method="POST", body=post_data)
        else:
            self.send_error(405, "Method Not Allowed")

    def handle_api(self, path, query, method="GET", body=b''):
<<<<<<< HEAD
        # 每次收到大模型的 MCP 请求，就向潜意识队列发送一个电信号，重置休眠倒计时
        # (Inject an electrical signal into the subconscious queue on every MCP request to reset sleep timer)
        consciousness_stream.put("STIMULUS")

=======
>>>>>>> origin/main
        # Authenticate all API routes
        if not self._check_auth():
            self.send_response(401)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"status": "error", "message": "Unauthorized"}).encode('utf-8'))
            return

        params = parse_qs(query)
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')

        # CORS Handling
        origin = self.headers.get('Origin')
        if origin and (origin in self.allowed_origins or '*' in self.allowed_origins):
            self.send_header('Access-Control-Allow-Origin', origin)
        self.send_header('Vary', 'Origin')

        self.end_headers()

        response_obj = APIResponse(status="ok", payload={})

        try:
            logger.info(f"API {method} Request: {path} with query: {query}")

            if method == "GET":
                if path == "/api/status":
                    response_obj.payload = self.cortex.get_stats()
                elif path == "/api/search":
                    q = params.get('q', [''])[0]
                    response_obj.payload = self.cortex.search(q)
                elif path == "/api/journal":
                    cursor = self.cortex.conn.cursor()
                    cursor.execute("SELECT datetime(timestamp, 'unixepoch') as ts, event, details FROM journal ORDER BY timestamp DESC LIMIT 20")
                    response_obj.payload = [dict(row) for row in cursor.fetchall()]
                # --- MCP Protocol Endpoints ---
                elif path == "/api/mcp/tools":
                    # Returns List of JSON Schemas for all registered skills
                    schemas = mcp_registry.get_all_schemas()
                    response_obj.payload = {"tools": schemas}
                else:
                    response_obj.status = "error"
                    response_obj.message = "Invalid endpoint"
                    logger.warning(f"API Invalid Endpoint Hit: {path}")

            elif method == "POST":
                if path == "/api/mcp/invoke":
                    if not body:
                        raise ValueError("Empty request body")
                    payload = json.loads(body.decode('utf-8'))
                    name = payload.get("name")
                    arguments = payload.get("arguments", {})

                    if not name:
                        raise ValueError("Missing 'name' parameter in MCP invoke request")

                    logger.info(f"MCP Invoking Skill: {name} with args: {arguments}")
                    result = mcp_registry.invoke(name, arguments)
                    response_obj.payload = result
                else:
                    response_obj.status = "error"
                    response_obj.message = "Invalid POST endpoint"
                    logger.warning(f"API Invalid POST Endpoint Hit: {path}")

        except Exception as e:
            logger.error(f"API Exception at {path}", exc_info=True)
            response_obj.status = "error"
            response_obj.message = str(e)

        # Enforce contract strictly, fallback if serialization fails
        try:
            self.wfile.write(json.dumps(asdict(response_obj)).encode('utf-8'))
        except Exception as e:
            logger.error(f"API Serialization Exception at {path}", exc_info=True)
            fallback = {"status": "error", "message": "Serialization failure", "payload": {}}
            self.wfile.write(json.dumps(fallback).encode('utf-8'))

def main():
    parser = argparse.ArgumentParser(description="NEXUS CORE: Zero-Entropy Intelligence")
    subparsers = parser.add_subparsers(dest='command', help='Available commands')

    # --- Life Cycle ---
    subparsers.add_parser('serve', help='Launch Native Portal Server (Port 8000)')
    subparsers.add_parser('evolve', help='Run Daily Cycle (Harvest -> Dream -> Plan)')
    subparsers.add_parser('harvest', help='Run Sensory Harvester (External)')
    subparsers.add_parser('ingest', help='Deep Scan Codebase (Internal)')
    subparsers.add_parser('ponder', help='Run Deep Inference (Cognition)')
    subparsers.add_parser('rebuild', help='Rebuild DB from Text (Restoration)')
    subparsers.add_parser('clean', help='Cleanup environment')
    subparsers.add_parser('status', help='Report System Health')

    # --- Knowledge Ops ---
    learn_parser = subparsers.add_parser('learn', help='Ingest Knowledge from File')
    learn_parser.add_argument('file', help='Path to file')

    search_parser = subparsers.add_parser('search', help='Search Memory')
    search_parser.add_argument('query', type=str)

    connect_parser = subparsers.add_parser('connect', help='Create Connection')
    connect_parser.add_argument('source', type=str)
    connect_parser.add_argument('relation', type=str)
    connect_parser.add_argument('target', type=str)
    connect_parser.add_argument('--desc', type=str, default="")

    add_parser = subparsers.add_parser('add', help='Create Entity')
    add_parser.add_argument('type', choices=['entity'], help='Type')
    add_parser.add_argument('--id', required=True)
    add_parser.add_argument('--name', required=True)
    add_parser.add_argument('--type_slug', default='concept')
    add_parser.add_argument('--desc', default='')

    activate_parser = subparsers.add_parser('activate', help='Boost Memory Weight')
    activate_parser.add_argument('id', type=str)

    subparsers.add_parser('visualize', help='Generate Mermaid Graph')

    args = parser.parse_args()
    base_path = Path(__file__).parent

    # --- Execution Logic ---

    if args.command == 'serve':
        PORT = 8000
        logger.info(f"🚀 NEXUS CORE V2: Launching Swarm Portal at http://localhost:{PORT}")
        logger.info(f"📍 Serving Root: {Path(__file__).parent.parent.parent}")
        
        # 唤醒后台潜意识 (Wake up the background subconscious)
        subconscious = SubconsciousThread()
        subconscious.start()

        # 挂载多线程并发网关 (Mount the multithreaded concurrent gateway)
        with ThreadedNexusServer(("", PORT), NexusHandler) as httpd:
            try:
                httpd.serve_forever()
            except KeyboardInterrupt:
                logger.info("\n🛑 System Halting...")

    elif args.command == 'clean':
        logger.info("🧹 Cleaning environment...")
        c = Cortex()
        c.vacuum()
        
        # Recursive cleaning
        for root, dirs, files in os.walk(c.project_root):
            for d in dirs:
                if d in ["__pycache__", ".pytest_cache", ".pytest_cache"]:
                    shutil.rmtree(Path(root)/d)
            for f in files:
                if f.startswith("test_cortex.db") or f.endswith(".pyc"):
                    os.remove(Path(root)/f)
        logger.info("✨ Environment purified.")

    elif args.command == 'ponder':
        r = ReasoningEngine()
        insights = r.ponder()
        logger.info("\n🧠 **DEEP THOUGHTS REPORT**")
        if not insights:
            logger.info("   (Mind is quiet.)")
        else:
            for i in insights:
                logger.info(f"   {i}")

    elif args.command == 'ingest':
        s = Scholar()
        s.ingest_repository(s.project_root)

    elif args.command == 'status':
        c = Cortex()
        stats = c.get_stats()
        logger.info(f"🧠 NEXUS STATUS: {stats['entities']} Nodes | {stats['relations']} Edges")

    elif args.command == 'rebuild':
        logger.info("🧠 Initiating Cortex Reconstruction Protocol...")
        c = Cortex()
        knowledge_dir = c.knowledge_path
        entities_to_add = []
        relations_to_add = []
        BATCH_THRESHOLD = 1000
        count = 0

        if knowledge_dir.exists():
            for root, _, files in os.walk(knowledge_dir):
                for file in files:
                    if file.endswith(".jsonl"):
                        with open(Path(root)/file, 'r', encoding='utf-8') as f:
                            for line in f:
                                if not line.strip(): continue
                                try:
                                    data = json.loads(line)
                                    if 'src' in data:
                                        relations_to_add.append(data)
                                    else:
                                        entities_to_add.append(data)
                                    count += 1
                                except json.JSONDecodeError:
                                    continue

                                # Flush batches to prevent OOM
                                if len(entities_to_add) >= BATCH_THRESHOLD:
                                    c.add_entities_batch(entities_to_add, save_to_disk=False)
                                    entities_to_add = []
                                if len(relations_to_add) >= BATCH_THRESHOLD:
                                    c.connect_entities_batch(relations_to_add, save_to_disk=False)
                                    relations_to_add = []

        # Final flush
        if entities_to_add:
            c.add_entities_batch(entities_to_add, save_to_disk=False)
        if relations_to_add:
            c.connect_entities_batch(relations_to_add, save_to_disk=False)

        logger.info(f"✨ Reconstruction Complete.{count} memories restored.")

    elif args.command == 'evolve':
        h = Harvester()
        h.fetch_github_data()
        e = Evolver()
        e.run_daily_cycle()
        # Auto-clean after evolution
        logger.info("🧹 Running scheduled purification...")
        c = Cortex()
        c.vacuum()
        for root, dirs, files in os.walk(c.project_root):
            for d in dirs:
                if d in ["__pycache__", ".pytest_cache"]:
                    shutil.rmtree(Path(root)/d)
            for f in files:
                if f.startswith("test_cortex.db") or f.endswith(".pyc"):
                    os.remove(Path(root)/f)

    elif args.command == 'harvest':
        h = Harvester()
        h.fetch_github_data()

    elif args.command == 'learn':
        s = Scholar()
        logger.info(f"🎓 Record: {s.learn(args.file)}")

    elif args.command == 'search':
        c = Cortex()
        for r in c.search(args.query):
            icon = "🔗" if r.get('distance', 0) > 0 else "🎯"
            logger.info(f" {icon} [{r['weight']:.2f}] {r['name']} ({r['id']})")

    elif args.command == 'visualize':
        c = Cortex()
        cursor = c.conn.cursor()
        cursor.execute("SELECT source, relation, target FROM relations LIMIT 50")
        rows = cursor.fetchall()
        print("\n```mermaid")
        print("graph TD")
        for s, r, t in rows:
            print(f'  {s}["{s}"] -- "{r}" --> {t}["{t}"]')
        print("```\n")

    else:
        parser.print_help()

if __name__ == "__main__":
    main()

