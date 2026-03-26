import time
import datetime
import urllib.request
import urllib.parse
import json
from pathlib import Path
try:
    from cortex import Cortex
    from logger import logger
except ImportError:
    import sys, os
    sys.path.append(os.path.dirname(__file__))
    from cortex import Cortex
    from logger import logger

class ReasoningEngine:
    def __init__(self, project_root=None):
        self.project_root = project_root or Path(__file__).resolve().parents[2]
        self.kernel_path = self.project_root / "src" / "kernel"
        self.data_path = self.project_root / "data"
        self.db_path = self.data_path / "cortex.db"
        
        # Initialize Cortex with default data/cortex.db
        self.cortex = Cortex()

    def ponder(self):
        """后台分析任务 (Background Analysis Task)"""
        # [检查依赖] 数据库验证 (Dependency check)
        if not self.cortex or not self.db_path.exists():
            logger.warning("Cortex DB not found. Skipping analysis.")
            return ["Error: Cortex DB not found. Cannot perform analysis."]

        logger.info("Executing background graph analysis...")
        insights = []

        try:
            # 0. 获取状态 (Retrieve stats)
            stats = self.cortex.get_stats()

            # 1. 状态报告 (Status Report)
            insights.append(self._generate_status(stats))

            # 2. 拓扑异常检测 (Topology Exception Detection)
            orphans = self._query('''
                SELECT e.name FROM entities e
                LEFT JOIN relations r1 ON e.id = r1.source
                LEFT JOIN relations r2 ON e.id = r2.target
                WHERE r1.source IS NULL AND r2.target IS NULL LIMIT 3
            ''')
            if orphans:
                insights.append(f"Topology Warning: {len(orphans)} isolated nodes detected (e.g., '{orphans[0][0]}'). Relation mapping recommended.")

            cycles = self._query('''
                SELECT r1.source, r1.target FROM relations r1
                JOIN relations r2 ON r1.source = r2.target AND r1.target = r2.source
                WHERE r1.source < r1.target LIMIT 2
            ''')
            if cycles:
                insights.append(f"Graph Cycle: Detected circular dependency between '{cycles[0][0]}' and '{cycles[0][1]}'.")

            # 3. 关联推导 (Association Inference)
            bridges = self._query('''
                SELECT r1.source, r2.target, r1.target FROM relations r1
                JOIN relations r2 ON r1.target = r2.source
                WHERE r1.relation = 'defines' AND r2.relation = 'inherits_from' LIMIT 2
            ''')
            for b in bridges:
                insights.append(f"Inference: Discovered implicit path: '{b[0]}' -> '{b[1]}' via '{b[2]}'.")

            # 4. 低频节点检索与外部元数据补充 (Low Frequency Node Detection and External Enrichment)
            sparse_nodes = self._find_sparse_nodes()
            if sparse_nodes:
                insights.append(f"Data Deficiency: Sparse nodes detected: {', '.join(sparse_nodes)}. Initiating external data enrichment protocol.")
                self._enrich_nodes_from_network(sparse_nodes)
            else:
                insights.append("Task Suggestion: Graph density is optimal. Focus on new external data sources.")

            # 5. 拓扑认知觉醒：纯 Python PageRank 中心度计算 (Emergence: Pure Python PageRank)
            pagerank_insights = self._awaken_pagerank()
            if pagerank_insights:
                insights.extend(pagerank_insights)

        except Exception as e:
             logger.error("Error during background analysis", exc_info=True)
             insights.append(f"Analysis Error: A disruption occurred: {e}")

        return insights

    def _enrich_nodes_from_network(self, nodes):
        """外部元数据补充协议 (External Metadata Enrichment Protocol)
        自动通过开放 API 检索概念释义以补全图谱孤点。(Automatically retrieve concept definitions via open APIs to enrich isolated graph nodes.)
        """
        # 数据源白名单防御 (Data source whitelist defense)
        # 仅允许从受信域名获取数据，防止 SSRF 和数据污染 (Only allow requests to trusted domains to prevent SSRF and data pollution)
        ALLOWED_ENRICHMENT_DOMAINS = ["en.wikipedia.org"]

        for node_name in nodes:
            # 过滤明显的代码文件名或路径，只查纯概念词汇 (Filter out obvious code files or paths)
            clean_name = node_name.replace("'", "")
            if "." in clean_name or "/" in clean_name or "_" in clean_name:
                continue

            try:
                # 构建请求 URL 并校验域名 (Construct and validate request URL)
                domain = ALLOWED_ENRICHMENT_DOMAINS[0]
                url = f"https://{domain}/api/rest_v1/page/summary/{urllib.parse.quote(clean_name)}"

                req = urllib.request.Request(url, headers={"User-Agent": "Nexus-Cortex-Enrichment/1.0"})
                with urllib.request.urlopen(req, timeout=5) as response:
                    data = json.loads(response.read().decode())
                    extract = data.get("extract")
                    if extract:
                        concept_id = f"concept_{clean_name.lower().replace(' ', '_')}"
                        # 记录补充实体并建立依赖 (Record enriched entity and establish dependency)
                        self.cortex.add_entity(id=concept_id, type_slug="concept", name=clean_name, desc=extract, save_to_disk=True)
                        logger.info(f"Metadata Enrichment Success: Retrieved definition for '{clean_name}'.")
            except urllib.error.HTTPError as e:
                # 404 忽略，表示百科无此词条 (Ignore 404 Not Found)
                if e.code != 404:
                    logger.warning(f"Metadata Enrichment Failed for '{clean_name}': HTTP {e.code}")
            except Exception as e:
                logger.warning(f"Metadata Enrichment Failed for '{clean_name}': {e}")

    def _generate_status(self, stats):
        """生成系统度量报告 (Generates a system metrics report based on graph stats)"""
        nodes = stats.get('entities', 0)
        edges = stats.get('relations', 0)
        density = stats.get('density', 0)

        summary = f"System Status: Cortex holds {nodes} entities and {edges} edges. "
        if density < 1.0:
            summary += f"Density ({density:.2f}) indicates fragmented data state."
        elif density < 1.5:
            summary += f"Density ({density:.2f}) indicates moderate logical connections."
        else:
            summary += f"Density ({density:.2f}) indicates high cohesiveness."
        return summary

    def _find_sparse_nodes(self):
        """低频节点检索 (Find nodes with exactly 1 connection)
        Filter out specific internal code structure references so we don't try to query Wikipedia
        for 'APIResponse' or other programmatic nodes.
        """
        sql = '''
            SELECT e.name
            FROM entities e
            JOIN (
                SELECT source AS id FROM relations
                UNION ALL
                SELECT target AS id FROM relations
            ) r ON e.id = r.id
            WHERE e.type NOT IN ('code_file', 'code_class', 'code_function')
            GROUP BY e.id
            HAVING COUNT(r.id) = 1
            LIMIT 3
        '''
        results = self._query(sql)
        return [f"'{row[0]}'" for row in results] if results else []

    def _awaken_pagerank(self):
        """
        纯 Python 零依赖 PageRank (Zero-Dependency Pure Python PageRank).
        通过 15 次阻尼迭代计算图谱中所有节点的中心度，自动反写到 SQLite 的 weight 字段。
        (Computes graph centrality via 15 damped iterations and writes back to SQLite weight.)
        """
        try:
            # 获取所有关系 (Fetch all relations)
            relations = self._query('SELECT source, target FROM relations')
            if not relations:
                return []

            out_links = {}
            in_links = {}
            all_nodes = set()

            for source, target in relations:
                all_nodes.add(source)
                all_nodes.add(target)
                if source not in out_links:
                    out_links[source] = []
                out_links[source].append(target)

                if target not in in_links:
                    in_links[target] = []
                in_links[target].append(source)

            # 初始化 (Initialization)
            N = len(all_nodes)
            if N == 0:
                return []

            ranks = {node: 1.0 for node in all_nodes}
            damping_factor = 0.85
            iterations = 15

            # 纯 Python 阻尼迭代 (Pure Python Damped Iteration)
            for _ in range(iterations):
                new_ranks = {}
                for node in all_nodes:
                    rank_sum = 0.0
                    for in_node in in_links.get(node, []):
                        # 如果没有出链，避免除以0 (Avoid division by zero)
                        out_degree = len(out_links.get(in_node, []))
                        if out_degree > 0:
                            rank_sum += ranks[in_node] / out_degree
                    new_ranks[node] = (1.0 - damping_factor) + damping_factor * rank_sum
                ranks = new_ranks

            # 更新回数据库 (Write back to database)
            cursor = self.cortex.conn.cursor()
            cursor.execute("SAVEPOINT pagerank_update")

            # 找到 Top 3 用于日志 (Find top 3 for logging)
            top_nodes = sorted(ranks.items(), key=lambda x: x[1], reverse=True)[:3]

            for node, weight in ranks.items():
                # 为了防止权重过大爆炸，或者冲刷掉原本的长期记忆，我们采取融合策略
                # (Fuse PageRank with existing weight to prevent explosion)
                cursor.execute('UPDATE entities SET weight = weight * 0.5 + ? WHERE id = ?', (weight, node))

            self.cortex.conn.commit()

            top_names = []
            for node_id, w in top_nodes:
                name_row = self._query(f"SELECT name FROM entities WHERE id = '{node_id}'")
                name = name_row[0][0] if name_row else node_id
                top_names.append(f"'{name}' ({w:.2f})")

            return [f"Emergence: PageRank completed. Top core concepts discovered: {', '.join(top_names)}."]
        except Exception as e:
            logger.error(f"Error during PageRank calculation: {e}", exc_info=True)
            return [f"Emergence Error: PageRank failed: {e}"]

    def _query(self, sql):
        try:
            return self.cortex.conn.cursor().execute(sql).fetchall()
        except Exception as e:
            logger.error(f"Error executing reasoning query: {sql}", exc_info=True)
            return []
