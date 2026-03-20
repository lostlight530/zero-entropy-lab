import sys
import os
import argparse
import shutil
import json
import http.server
import socketserver
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

class NexusHandler(http.server.SimpleHTTPRequestHandler):
    """Native API & Static File Router"""
    def __init__(self, *args, **kwargs):
        self.kernel_path = Path(__file__).parent.resolve()
        # src/kernel/nexus.py -> parents[2] is root
        self.project_root = Path(__file__).resolve().parents[2]
        self.cortex = Cortex()
        super().__init__(*args, **kwargs)

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
        params = parse_qs(query)
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
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
        logger.info(f"🚀 NEXUS CORE: Launching Portal at http://localhost:{PORT}")
        logger.info(f"📍 Serving Root: {Path(__file__).parent.parent.parent}")
        
        # Use a closure to pass base_path/project_root if needed, but NexusHandler handles it now
        with socketserver.TCPServer(("", PORT), NexusHandler) as httpd:
            try:
                httpd.serve_forever()
            except KeyboardInterrupt:
                logger.info("\n🛑 Server stopped.")

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

