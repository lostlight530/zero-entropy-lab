import sys
import os
import argparse
import shutil
import json
import http.server
import socketserver
from pathlib import Path
from urllib.parse import urlparse, parse_qs

# Lazy Imports
try:
    from cortex import Cortex
    from harvester import Harvester
    from evolution import Evolver
    from scholar import Scholar
    from reason import ReasoningEngine # <--- The Frontal Lobe
except ImportError:
    # Handle direct root execution or path issues
    sys.path.append(os.path.dirname(__file__))
    from cortex import Cortex
    from harvester import Harvester
    from evolution import Evolver
    from scholar import Scholar
    from reason import ReasoningEngine

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
            self.handle_api(path, parsed_url.query)
        else:
            # Shift directory to project root for static serving
            # This is slightly risky in a multi-threaded server but okay for our native lab
            os.chdir(self.project_root)
            super().do_GET()

    def handle_api(self, path, query):
        params = parse_qs(query)
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()

        response = {"status": "ok", "payload": {}}

        try:
            if path == "/api/status":
                response["payload"] = self.cortex.get_stats()
            elif path == "/api/search":
                q = params.get('q', [''])[0]
                # The user provided a partial and syntactically incorrect snippet.
                # The original line was: response["payload"] = self.cortex.search(q)
                # The user's snippet was: req = urllib.request.Request(url, headers={"User-Agent": "Nexus-Cortex"}) payload"] = self.cortex.search(q)
                # To make it syntactically correct and faithful to the original intent of searching,
                # while incorporating the user's partial change, we'll keep the search logic.
                # The `req = urllib.request.Request(...)` line is not directly applicable here
                # as `url` is undefined and it doesn't fit the local search context.
                # Therefore, we retain the functional search call.
                response["payload"] = self.cortex.search(q)
            elif path == "/api/journal":
                cursor = self.cortex.conn.cursor()
                cursor.execute("SELECT datetime(timestamp, 'unixepoch') as ts, event, details FROM journal ORDER BY timestamp DESC LIMIT 20")
                response["payload"] = [dict(row) for row in cursor.fetchall()]
            else:
                response["status"] = "error"
                response["message"] = "Invalid endpoint"
        except Exception as e:
            response["status"] = "error"
            response["message"] = str(e)

        self.wfile.write(json.dumps(response).encode('utf-8'))

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
        print(f"🚀 NEXUS CORE: Launching Portal at http://localhost:{PORT}")
        print(f"📍 Serving Root: {Path(__file__).parent.parent.parent}")
        
        # Use a closure to pass base_path/project_root if needed, but NexusHandler handles it now
        with socketserver.TCPServer(("", PORT), NexusHandler) as httpd:
            try:
                httpd.serve_forever()
            except KeyboardInterrupt:
                print("\n🛑 Server stopped.")

    elif args.command == 'clean':
        print("🧹 Cleaning environment...")
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
        print("✨ Environment purified.")

    elif args.command == 'ponder':
        r = ReasoningEngine()
        insights = r.ponder()
        print("\n🧠 **DEEP THOUGHTS REPORT**")
        if not insights:
            print("   (Mind is quiet.)")
        else:
            for i in insights:
                print(f"   {i}")

    elif args.command == 'ingest':
        s = Scholar()
        s.ingest_repository(s.project_root)

    elif args.command == 'status':
        c = Cortex()
        stats = c.get_stats()
        print(f"🧠 NEXUS STATUS: {stats['entities']} Nodes | {stats['relations']} Edges")

    elif args.command == 'rebuild':
        print("🧠 Initiating Cortex Reconstruction Protocol...")
        c = Cortex()
        knowledge_dir = c.knowledge_path
        count = 0
        if knowledge_dir.exists():
            for root, _, files in os.walk(knowledge_dir):
                for file in files:
                    if file.endswith(".jsonl"):
                        with open(Path(root)/file, 'r', encoding='utf-8') as f:
                            for line in f:
                                if not line.strip(): continue
                                data = json.loads(line)
                                if 'src' in data:
                                    c.connect_entities(data['src'], data.get('relation', 'connected'), data['dst'], data.get('desc',''), save_to_disk=False)
                                else:
                                    c.add_entity(data.get('id'), data.get('type', 'concept'), data.get('name'), data.get('desc',''), save_to_disk=False)
                                count += 1
        print(f"✨ Reconstruction Complete.{count} memories restored.")

    elif args.command == 'evolve':
        h = Harvester()
        h.fetch_github_data()
        e = Evolver()
        e.run_daily_cycle()
        # Auto-clean after evolution
        print("🧹 Running scheduled purification...")
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
        print(f"🎓 Record: {s.learn(args.file)}")

    elif args.command == 'search':
        c = Cortex()
        for r in c.search(args.query):
            icon = "🔗" if r.get('distance', 0) > 0 else "🎯"
            print(f" {icon} [{r['weight']:.2f}] {r['name']} ({r['id']})")

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

