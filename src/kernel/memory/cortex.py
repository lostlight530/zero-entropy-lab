import sqlite3
import json
import time
import datetime
import hashlib
import hmac
import os
from pathlib import Path
from typing import List, Dict

try:
    from logger import logger
except ImportError:
    import sys, os
    sys.path.append(os.path.dirname(__file__))
    from logger import logger

class Cortex:
    def __init__(self, db_path=None, project_root=None):
        # Default to the root of the repo (parent of src/kernel)
        self.project_root = project_root or Path(__file__).resolve().parents[3]
        self.kernel_path = self.project_root / "src" / "kernel"
        
        if db_path is None:
            self.data_path = self.project_root / "data"
            self.db_path = self.data_path / "cortex.db"
        else:
            self.db_path = Path(db_path)
            self.data_path = self.db_path.parent

        self.knowledge_path = self.data_path / "knowledge"

        # Ensure directory structure exists
        self.data_path.mkdir(parents=True, exist_ok=True)
        (self.knowledge_path / "entities").mkdir(parents=True, exist_ok=True)
        (self.knowledge_path / "relations").mkdir(parents=True, exist_ok=True)

        # 数据完整性校验密钥 (Data integrity verification key)
        # 验证底层存储文件的结构完整性 (Validates the underlying storage integrity)
        self.secret_key = os.environ.get("NEXUS_SECRET_KEY", "absolute-zero-entropy-override").encode('utf-8')

        self.conn = sqlite3.connect(self.db_path, check_same_thread=False, timeout=15.0)
        self.conn.row_factory = sqlite3.Row

        # 极限性能调优：释放物理 I/O 潜力 (Extreme Performance Tuning)
        # 1. 开启 WAL 突破读写阻塞 (Enable WAL for concurrency)
        self.conn.execute('PRAGMA journal_mode=WAL')
        # 2. 降低同步频率：防腐败且不等待 FSYNC (Corruption safe, reduces FSYNC latency)
        self.conn.execute('PRAGMA synchronous=NORMAL')
        # 3. 内存临时表 (Store temp tables and indices in memory)
        self.conn.execute('PRAGMA temp_store=MEMORY')
        # 4. 超大 Mmap 映射：用内存指针代替系统调用读取 (30GB memory mapping limit)
        self.conn.execute('PRAGMA mmap_size=30000000000')
        # 5. 扩大页缓存：负数代表 KB (-64000 = 64MB)
        self.conn.execute('PRAGMA cache_size=-64000')

        # 核心基准实体 (Core Baseline Entities)
        # These concepts are "Axioms" - they define the system's identity.
        # They are immune to biological decay.
        self.CORE_WHITELIST = {
            "agent", "mcp", "edge-ai", "nexus", "sovereignty",
            "mindspore", "litert", "mediapipe", "zerodependency",
            "jax-metal", "eurobert", "android", "vllm", "dify"
        }
        self._init_db()

    def _init_db(self):
        cursor = self.conn.cursor()
        # 注册 signature 字段以维护数据行一致性 (Register signature for row consistency)
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS entities (
                id TEXT PRIMARY KEY,
                type TEXT,
                name TEXT,
                desc TEXT,
                weight REAL DEFAULT 1.0,
                last_activated REAL,
                signature TEXT
            )
        ''')
        # 兼容旧模式数据结构 (Backward compatibility for legacy schema)
        try:
            cursor.execute("ALTER TABLE entities ADD COLUMN signature TEXT")
        except sqlite3.OperationalError:
            pass

        cursor.execute('''
            CREATE VIRTUAL TABLE IF NOT EXISTS entities_fts USING fts5(id, name, desc)
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS relations (
                source TEXT,
                relation TEXT,
                target TEXT,
                weight REAL DEFAULT 1.0,
                UNIQUE(source, relation, target)
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS journal (
                timestamp REAL,
                event TEXT,
                details TEXT
            )
        ''')
        self.conn.commit()

    def _get_last_hash(self, filepath: Path) -> str:
        """
        O(1) 读取不可篡改账本的最后一条哈希记录 (O(1) Retrieval of the last hash in the ledger)
        利用文件指针反向寻找，避免大文件全量加载进内存。
        """
        if not filepath.exists() or filepath.stat().st_size == 0:
            return "NEXUS_GENESIS_0000"

        try:
            with open(filepath, 'rb') as f:
                f.seek(0, os.SEEK_END)
                # 极客指针漂移：反向寻找最后一行换行符
                pos = f.tell() - 2
                while pos > 0:
                    f.seek(pos)
                    if f.read(1) == b'\n':
                        break
                    pos -= 1

                # 如果我们退到了文件开头还没有找到换行符，说明只有一行数据
                if pos == 0:
                    f.seek(0)

                last_line = f.readline().decode('utf-8').strip()
                if not last_line:
                    return "NEXUS_GENESIS_0000"
                return json.loads(last_line).get("hash", "NEXUS_GENESIS_0000")
        except Exception as e:
            logger.error(f"Failed to read last hash from {filepath}: {e}")
            return "NEXUS_GENESIS_0000"

    def _log_to_jsonl(self, category, filename, data):
        """Append knowledge to the cryptographic Merkle Chain text ledger."""
        # Sanitize filename to prevent directory traversal or invalid chars
        safe_filename = "".join([c for c in filename if c.isalnum() or c in ('-','_')])
        if not safe_filename: safe_filename = "misc"

        filepath = self.knowledge_path / category / f"{safe_filename}.jsonl"
        try:
            # 1. 获取上一行的 Hash (Get previous hash)
            prev_hash = self._get_last_hash(filepath)

            # 2. 生成当前记录的不可篡改哈希 (Generate tamper-proof hash for current record)
            # 为了保证哈希一致性，对数据进行稳定排序的 JSON 序列化
            data_str = json.dumps(data, sort_keys=True, ensure_ascii=False)
            current_hash = hashlib.sha256(f"{prev_hash}{data_str}".encode('utf-8')).hexdigest()

            # 3. 附加密码学证明 (Append cryptographic proofs)
            data['hash'] = current_hash
            data['prev_hash'] = prev_hash

            # 4. 追加写入 (Append write)
            with open(filepath, 'a', encoding='utf-8') as f:
                f.write(json.dumps(data, ensure_ascii=False) + "\n")
        except Exception as e:
            logger.error(f"⚠️ Failed to write cryptographic text memory: {e}", exc_info=True)

    def search(self, query: str, limit: int = 10) -> List[Dict]:
        """Synaptic Search: Zero-Entropy 2-Stage Retrieval (FTS5 BM25 + Python Reranking)"""
        # Delay import to avoid circular dependencies if nlp imports cortex later
        try:
            from nlp import CognitiveReranker
        except ImportError:
            # Fallback if executing outside standard paths
            import sys, os
            sys.path.append(os.path.dirname(__file__))
            from nlp import CognitiveReranker

        cursor = self.conn.cursor()
        safe_query = "".join(c for c in query if c.isalnum() or c.isspace())
        if not safe_query.strip(): return []
        fts_query = " ".join([f"{token}*" for token in safe_query.split()])

        # STEP 1: Coarse-Grained Retrieval via FTS5 BM25
        # Fetch a wider candidate pool (e.g., 50) for the reranker.
        # Columns in fts: id(0), name(1), desc(2). We heavily weight the name.
        sql_direct = '''
            SELECT e.id, e.name, e.desc, e.weight, 0 as distance,
                   bm25(entities_fts, 0.0, 10.0, 1.0) as fts_score
            FROM entities_fts f
            JOIN entities e ON f.id = e.id
            WHERE entities_fts MATCH ?
            ORDER BY fts_score ASC
            LIMIT 50
        '''
        cursor.execute(sql_direct, (fts_query,))
        direct_results = [dict(row) for row in cursor.fetchall()]

        # STEP 2: Associative Expansion (Graph 1-hop)
        # We bring in highly weighted neighbors to enrich the candidate pool.
        assoc_results = []
        if direct_results:
            direct_ids = [r['id'] for r in direct_results[:10]] # Expand only top 10 to avoid noise
            placeholders = ','.join(['?'] * len(direct_ids))

            sql_assoc = f'''
                SELECT e.id, e.name, e.desc, e.weight, 1 as distance,
                       0.0 as fts_score
                FROM relations r
                JOIN entities e ON (r.target = e.id OR r.source = e.id)
                WHERE (r.source IN ({placeholders}) OR r.target IN ({placeholders}))
                AND e.id NOT IN ({placeholders})
                AND e.weight > 1.1
                ORDER BY e.weight DESC
                LIMIT 20
            '''
            params = direct_ids + direct_ids + direct_ids
            cursor.execute(sql_assoc, params)
            assoc_results = [dict(row) for row in cursor.fetchall()]

        # Combine candidates and remove duplicates
        all_candidates = []
        seen_ids = set()
        for r in direct_results + assoc_results:
            if r['id'] not in seen_ids:
                seen_ids.add(r['id'])
                all_candidates.append(r)

        if not all_candidates:
            return []

        # STEP 3: The Reranking Layer (Pure Python)
        final_results = CognitiveReranker.rerank_and_fuse(safe_query, all_candidates)

        # Format the output to ensure the 'distance' and 'weight' remain intuitive for the frontend
        # and limit to the requested amount.
        return final_results[:limit]

    def add_entity(self, id, type_slug, name, desc, save_to_disk=True):
        self.add_entities_batch([{"id": id, "type": type_slug, "name": name, "desc": desc}], save_to_disk=save_to_disk)

    def _sign_memory(self, eid, etype, ename, edesc) -> str:
        """生成记录哈希签名 (Generates a record hash signature)"""
        # Ensure ename and edesc are strings to avoid encoding errors
        ename_str = str(ename) if ename is not None else ""
        edesc_str = str(edesc) if edesc is not None else ""
        payload = f"{eid}|{etype}|{ename_str}|{edesc_str}".encode('utf-8')
        return hmac.new(self.secret_key, payload, hashlib.sha256).hexdigest()

    def verify_memory(self, eid: str) -> bool:
        """校验记录一致性 (Verifies the consistency of the stored record)"""
        cursor = self.conn.cursor()
        row = cursor.execute('SELECT type, name, desc, signature FROM entities WHERE id = ?', (eid,)).fetchone()
        if not row: return False

        # Backward compatibility for old records without signature
        if row['signature'] is None:
            return True

        expected_sig = self._sign_memory(eid, row['type'], row['name'], row['desc'])
        if not hmac.compare_digest(expected_sig, row['signature']):
            logger.error(f"Integrity check failed for node {eid}.")
            return False
        return True

    def deep_synapse_scan(self, start_id: str, max_depth: int = 3) -> List[Dict]:
        """递归图谱扫描计算 (Recursive graph traversal mapping)"""
        sql = '''
            WITH RECURSIVE
              synaptic_path(id, path_weight, depth) AS (
                SELECT target, weight, 1 FROM relations WHERE source = ?
                UNION ALL
                SELECT r.target, s.path_weight * r.weight, s.depth + 1
                FROM relations r
                JOIN synaptic_path s ON r.source = s.id
                WHERE s.depth < ?
              )
            SELECT e.id, e.name, e.desc, MAX(sp.path_weight) as resonance, MIN(sp.depth) as depth
            FROM synaptic_path sp
            JOIN entities e ON sp.id = e.id
            GROUP BY e.id
            ORDER BY resonance DESC
            LIMIT 15
        '''
        cursor = self.conn.cursor()
        cursor.execute(sql, (start_id, max_depth))
        return [dict(row) for row in cursor.fetchall()]

    def add_entities_batch(self, entities: List[Dict], save_to_disk=True):
        cursor = self.conn.cursor()
        now = time.time()

        # Process in chunks of 500 to keep transaction size manageable
        CHUNK_SIZE = 500
        for i in range(0, len(entities), CHUNK_SIZE):
            chunk = entities[i:i + CHUNK_SIZE]
            entity_data = []
            fts_data = []

            for e in chunk:
                eid = e.get('id')
                etype = e.get('type', 'concept')
                ename = e.get('name')
                edesc = e.get('desc', '')
                w = 2.0 if eid in self.CORE_WHITELIST else 1.0

                # 插入记录完整性签名 (Insert record integrity signature)
                signature = self._sign_memory(eid, etype, ename, edesc)
                entity_data.append((eid, etype, ename, edesc, w, now, signature))
                fts_data.append((eid, ename, edesc))

            try:
                # Use a subtransaction for the chunk
                cursor.execute("SAVEPOINT chunk_insert")
                cursor.executemany('INSERT INTO entities VALUES (?, ?, ?, ?, ?, ?, ?)', entity_data)
                cursor.executemany('INSERT INTO entities_fts VALUES (?, ?, ?)', fts_data)
                cursor.execute("RELEASE SAVEPOINT chunk_insert")
                self.conn.commit()
            except sqlite3.IntegrityError:
                cursor.execute("ROLLBACK TO SAVEPOINT chunk_insert")
                # Individual fallback for the chunk to handle existing entities
                for e in chunk:
                    try:
                        w = 2.0 if e['id'] in self.CORE_WHITELIST else 1.0
                        sig = self._sign_memory(e['id'], e.get('type','concept'), e.get('name'), e.get('desc',''))
                        cursor.execute('INSERT INTO entities VALUES (?, ?, ?, ?, ?, ?, ?)',
                                     (e['id'], e.get('type','concept'), e.get('name'), e.get('desc',''), w, now, sig))
                        cursor.execute('INSERT INTO entities_fts VALUES (?, ?, ?)', (e['id'], e.get('name'), e.get('desc','')))
                        self.conn.commit()
                    except sqlite3.IntegrityError:
                        self.activate_memory(e['id'])

            if save_to_disk:
                for e in chunk:
                    self._log_to_jsonl("entities", e.get('type', 'concept'), e)

    def connect_entities(self, source, relation, target, desc="", save_to_disk=True):
        self.connect_entities_batch([{"src": source, "relation": relation, "dst": target, "desc": desc}], save_to_disk=save_to_disk)

    def connect_entities_batch(self, relations: List[Dict], save_to_disk=True):
        cursor = self.conn.cursor()
        CHUNK_SIZE = 400 # Max params per query is 999 in many sqlite builds, 400 relations * 2 entities = 800 params

        for i in range(0, len(relations), CHUNK_SIZE):
            chunk = relations[i:i + CHUNK_SIZE]
            rel_data = [(r['src'], r.get('relation', 'connected'), r['dst'], 1.0) for r in chunk]

            try:
                cursor.executemany('INSERT OR IGNORE INTO relations VALUES (?, ?, ?, ?)', rel_data)
                self.conn.commit()

                # Batch activation with frequency awareness to match original logic
                now = time.time()
                activation_counts = {}
                for r in chunk:
                    activation_counts[r['src']] = activation_counts.get(r['src'], 0) + 0.1
                    activation_counts[r['dst']] = activation_counts.get(r['dst'], 0) + 0.1

                # Perform individual updates for frequency (still faster than individual commits)
                # Alternatively, we could do complex SQL, but individual updates in a single transaction are fine.
                for eid, boost in activation_counts.items():
                    cursor.execute('UPDATE entities SET weight = weight + ?, last_activated = ? WHERE id = ?',
                                 (boost, now, eid))
                self.conn.commit()

                if save_to_disk:
                    month_str = datetime.datetime.now().strftime("%Y-%m")
                    for r in chunk:
                        self._log_to_jsonl("relations", month_str, r)
            except Exception as e:
                logger.error(f"Batch connection failed: {e}")
                self.conn.rollback()

    def activate_memory(self, id, boost=0.1):
        cursor = self.conn.cursor()
        now = time.time()
        cursor.execute('UPDATE entities SET weight = weight + ?, last_activated = ? WHERE id = ?',
                      (boost, now, id))
        self.conn.commit()

    def decay_memories(self, decay_rate=0.95):
        """Biological Decay with Sovereignty Protection"""
        cursor = self.conn.cursor()

        # 1. Universal Decay
        cursor.execute('UPDATE entities SET weight = weight * ? WHERE weight > 0.1', (decay_rate,))

        # 2. Whitelist Restoration (Sovereignty Check)
        if self.CORE_WHITELIST:
            placeholders = ','.join(['?'] * len(self.CORE_WHITELIST))
            sql_restore = f'''
                UPDATE entities SET weight = 1.2
                WHERE id IN ({placeholders}) AND weight < 1.2
            '''
            cursor.execute(sql_restore, list(self.CORE_WHITELIST))

        self.conn.commit()

    def get_orphans(self, limit=5):
        cursor = self.conn.cursor()
        sql = '''
            SELECT e.id, e.name, e.weight FROM entities e
            LEFT JOIN relations r1 ON e.id = r1.source
            LEFT JOIN relations r2 ON e.id = r2.target
            WHERE r1.source IS NULL AND r2.target IS NULL
            AND e.weight > 0.5
            ORDER BY e.weight DESC
            LIMIT ?
        '''
        cursor.execute(sql, (limit,))
        return [dict(row) for row in cursor.fetchall()]

    def get_stats(self):
        cursor = self.conn.cursor()
        try:
            e_count = cursor.execute('SELECT count(*) FROM entities').fetchone()[0]
            r_count = cursor.execute('SELECT count(*) FROM relations').fetchone()[0]
            avg_weight = cursor.execute('SELECT avg(weight) FROM entities').fetchone()[0] or 0
        except Exception as e:
            logger.error(f"Failed to fetch stats: {e}", exc_info=True)
            return {'entities': 0, 'relations': 0, 'density': 0}
        return {'entities': e_count, 'relations': r_count, 'density': avg_weight}

    def log_event(self, event, details=""):
        cursor = self.conn.cursor()
        cursor.execute('INSERT INTO journal VALUES (?, ?, ?)', (time.time(), event, details))
        self.conn.commit()

    def vacuum(self):
        """[Refinement] Purge orphans and compact memory space."""
        cursor = self.conn.cursor()
        # 1. Clear dead files referencing missing data
        # 2. Vacuum SQLite
        cursor.execute('VACUUM')
        self.conn.commit()
        self.log_event("VACUUM", "Deep memory compaction completed.")