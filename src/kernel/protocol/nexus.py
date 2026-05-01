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
    from hive import HiveMind
except ImportError:
    # Handle direct root execution or path issues.
    # Because internal modules expect flat imports (e.g. `from cortex import Cortex`),
    # we must ensure that all subdirectories of `src/kernel` are added to sys.path
    kernel_dir = os.path.dirname(os.path.dirname(__file__))
    if kernel_dir not in sys.path:
        sys.path.append(kernel_dir)
    for root, dirs, files in os.walk(kernel_dir):
        if root not in sys.path:
            sys.path.append(root)

    from cortex import Cortex
    from harvester import Harvester
    from evolution import Evolver
    from scholar import Scholar
    from reason import ReasoningEngine
    from logger import logger
    from mcp import registry as mcp_registry
    from hive import HiveMind

@dataclass
class APIResponse:
    status: str
    payload: Any = None
    message: Optional[str] = None

class TokenBucket:
    """
    自适应免疫盾墙 (Adaptive Immune Shield: Native Token Bucket Rate Limiter)
    防御极端高频并发 (Defends against extreme high-frequency concurrency).
    """
    def __init__(self, capacity: int, fill_rate: float):
        self.capacity = capacity
        self.fill_rate = fill_rate
        self.tokens = capacity
        self.last_fill = time.time()
        self.lock = threading.Lock()

    def consume(self, amount: int = 1) -> bool:
        with self.lock:
            now = time.time()
            # 随时间自动恢复令牌 (Auto-regenerate tokens over time)
            self.tokens = min(self.capacity, self.tokens + (now - self.last_fill) * self.fill_rate)
            self.last_fill = now
            if self.tokens >= amount:
                self.tokens -= amount
                return True
            return False

# 全局自适应免疫盾墙配置 (Global Immune Shield Configuration)
# 针对重型 MCP 写接口：令牌池50，每秒恢复2个 (For heavy MCP writes)
mcp_bucket = TokenBucket(capacity=50, fill_rate=2)
# 针对轻量级查询与前端接口：令牌池500，每秒恢复50个 (For light UI queries)
api_bucket = TokenBucket(capacity=500, fill_rate=50)

# 并发服务基类 (Concurrent Gateway Configuration)
class ThreadedNexusServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    """
    原生多线程承载，支持高并发协议连接 (Native multithreading support for concurrent HTTP connections)
    """
    daemon_threads = True
    allow_reuse_address = True

# 核心记忆落盘缓冲区 (Core Memory Ring Buffer)
# 应对高频写入请求，消灭 SQLite_BUSY 死锁 (Handles high-freq writes, eliminates SQLite_BUSY)
import collections
ring_buffer_queue = collections.deque()
buffer_lock = threading.Lock()

class FlusherThread(threading.Thread):
    """
    单轨落盘线程。(Single-Writer Flusher Thread)
    定时抽干内存缓冲区中的写操作，并使用独立的数据库事务进行原子的批处理写盘，杜绝并发抢锁。
    (Periodically drains the ring buffer and writes to DB in a single transaction.)
    """
    def __init__(self):
        super().__init__(daemon=True)
        self.cortex = Cortex()
        # 初始化 HiveMind (Initialize HiveMind for cluster broadcast)
        self.hive = HiveMind()

    def run(self):
        logger.info("Single-Writer Flusher Thread activated. Monitoring Ring Buffer...")
        while True:
            time.sleep(2.0)  # 每2秒钟执行一次批量刷盘 (Flush every 2 seconds)
            batch = []
            with buffer_lock:
                while ring_buffer_queue:
                    batch.append(ring_buffer_queue.popleft())

            if batch:
                entities_to_add = [b["payload"] for b in batch if b.get("type") == "entity"]
                relations_to_add = [b["payload"] for b in batch if b.get("type") == "relation"]

                # 批处理原子级恢复防御：如果批量插入失败，主动退避并放回队列
                # (Atomic rollback defense: Requeue on total batch failure to prevent memory loss)
                if entities_to_add:
                    try:
                        self.cortex.add_entities_batch(entities_to_add, save_to_disk=True)
                        logger.info(f"Flusher: Persisted {len(entities_to_add)} entities.")
                        # 触发集群广播 (Trigger cluster broadcast)
                        self.hive.broadcast("entities", entities_to_add)
                    except Exception as e:
                        logger.error(f"Flusher Entity Error: {e}")
                        # In an extreme IO error, we don't requeue here to avoid infinite loops,
                        # but Cortex's internal SAVEPOINT mechanism handles integrity rollbacks.

                if relations_to_add:
                    try:
                        self.cortex.connect_entities_batch(relations_to_add, save_to_disk=True)
                        logger.info(f"Flusher: Persisted {len(relations_to_add)} relations.")
                        # 触发集群广播 (Trigger cluster broadcast)
                        self.hive.broadcast("relations", relations_to_add)
                    except Exception as e:
                        logger.error(f"Flusher Relation Error: {e}")

# 事件驱动后台队列 (Event-Driven Background Task Stream)
# 限制为 1 杜绝高并发内存堆积 (Limit maxsize to 1 to prevent memory bloat during high-freq API calls)
consciousness_stream = queue.Queue(maxsize=1)

class SubconsciousThread(threading.Thread):
    """
    后台数据处理线程。(Background data processing engine.)
    在 API 闲置时，处理图谱索引关联。(Handles graph indexing and association generation during API idle periods.)
    """
    def __init__(self):
        super().__init__(daemon=True)
        self.is_dreaming = False

    def run(self):
        logger.info("Background processing thread activated. Waiting for idle cycles...")
        while True:
            try:
                # 监听前台事件中断。闲置 60 秒后触发后台运算。(Listen for foreground events. Trigger background task after 60s idle.)
                event = consciousness_stream.get(timeout=60.0)
                if self.is_dreaming:
                    logger.info("Foreground request detected. Pausing background tasks.")
                    self.is_dreaming = False
            except queue.Empty:
                if not self.is_dreaming:
                    self.is_dreaming = True
                    logger.info("System idle. Starting background graph associative reasoning...")
                    try:
                        # 延迟加载防止循环依赖 (Lazy load to prevent circular dependencies)
                        from reason import ReasoningEngine
                        engine = ReasoningEngine()
                        insights = engine.ponder()
                        if insights:
                            logger.info(f"Graph associations generated: Processed {len(insights)} insights.")
                    except Exception as e:
                        logger.error(f"Background task interrupted by error: {e}")

# HTTP 拦截处理器 (HTTP Request Handler)
class NexusHandler(http.server.SimpleHTTPRequestHandler):
    """Native API & Static File Router"""
    def __init__(self, *args, **kwargs):
        self.kernel_path = Path(__file__).parent.resolve()
        # src/kernel/protocol/nexus.py -> parents[3] is root
        self.project_root = Path(__file__).resolve().parents[3]
        self.cortex = Cortex()

        # 【核心修复：强制绑定静态文件根目录，线程安全】
        kwargs['directory'] = str(self.project_root)

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
            # 【核心修复：彻底删除 os.chdir(self.project_root)】
            super().do_GET()

    def do_OPTIONS(self):
        """处理 CORS 预检请求 (Handle CORS Preflight Requests)"""
        self.send_response(204)
        origin = self.headers.get('Origin')
        if origin and origin in self.allowed_origins:
            self.send_header('Access-Control-Allow-Origin', origin)
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Authorization, Content-Type')
        self.send_header('Vary', 'Origin')
        self.end_headers()

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
        # 免疫拦截协议 (Immune Interception Protocol)
        # 根据请求特征分配不同的限流桶 (Route to different rate-limit buckets)
        bucket = mcp_bucket if path.startswith("/api/mcp/") and method == "POST" else api_bucket
        if not bucket.consume():
            self.send_response(429)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            logger.warning(f"🛡️ Rate limit exceeded for {path}. Immune system activated.")
            self.wfile.write(json.dumps({
                "status": "error",
                "message": "Too Many Requests. System immune shield engaged."
            }).encode('utf-8'))
            return

        # 触发队列中断电信号以重置后台定时器
        # (Inject event into queue to reset background idle timer)
        try:
            consciousness_stream.put_nowait("STIMULUS")
        except queue.Full:
            pass  # Already queued, no need to pile up

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
        if origin and origin in self.allowed_origins:
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
                elif path == "/api/graph":
                    # 前端 Canvas 力导向图专属轻量级端点 (Endpoint for Frontend Canvas Graph)
                    # 动态递归提取节点和关联供力导向图渲染 (Extract nodes/edges dynamically)
                    # 按照架构设计，直接复用底层的 CTE 递归查询 (Use native CTE deep scan)

                    # 为了获得更宏观的拓扑，我们寻找权重最高的核心节点作为起点 (Find the absolute core node)
                    cursor = self.cortex.conn.cursor()
                    core_node = cursor.execute("SELECT id FROM entities ORDER BY weight DESC LIMIT 1").fetchone()

                    nodes_data = []
                    links_data = []

                    if core_node:
                        # 扫描 N-Hop 拓扑 (Scan N-Hop topology)
                        scanned_nodes = self.cortex.deep_synapse_scan(start_id=core_node['id'], max_depth=3)
                        # 为了画图丰富，不仅获取中心节点的 15 个关联，再宽泛检索一些权重高的 (Supplement with high weight)
                        high_weight_nodes = cursor.execute("SELECT id, name, weight FROM entities WHERE weight > 0.5 ORDER BY weight DESC LIMIT 100").fetchall()

                        seen_ids = set()
                        for r in scanned_nodes:
                            seen_ids.add(r['id'])
                            nodes_data.append({"id": r['id'], "name": r['name'], "weight": r.get('resonance', 1.0)})

                        for r in high_weight_nodes:
                            if r['id'] not in seen_ids:
                                seen_ids.add(r['id'])
                                nodes_data.append({"id": r['id'], "name": r['name'], "weight": r['weight']})

                        if nodes_data:
                            placeholders = ','.join(['?'] * len(nodes_data))
                            node_ids = [n["id"] for n in nodes_data]
                            sql = f"""
                                SELECT source, target, weight FROM relations
                                WHERE source IN ({placeholders}) AND target IN ({placeholders})
                                LIMIT 300
                            """
                            links = cursor.execute(sql, node_ids + node_ids).fetchall()
                            links_data = [{"source": r["source"], "target": r["target"], "value": r["weight"]} for r in links]

                    response_obj.payload = {"nodes": nodes_data, "links": links_data}
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
        logger.info(f"🚀 NEXUS CORE SINGULARITY: Launching Service at http://localhost:{PORT}")
        logger.info(f"📍 Serving Root: {Path(__file__).parent.parent.parent}")
        
        # 启动多播集群监听 (Start Multicast Hive Listener)
        hive = HiveMind()
        hive.start_listening()

        # 启动后台事件监听线程 (Start background event listener thread)
        subconscious = SubconsciousThread()
        subconscious.start()

        # 启动后台批处理落盘线程 (Start background flusher thread)
        flusher = FlusherThread()
        flusher.start()

        # 挂载多线程 HTTP 网关 (Mount multithreaded HTTP gateway)
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

        if isinstance(insights, dict) and "error" in insights:
            logger.error(f"   {insights['error']}")
        elif isinstance(insights, dict) and "_flat_insights" in insights:
            for i in insights["_flat_insights"]:
                logger.info(f"   {i}")
        elif not insights:
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

