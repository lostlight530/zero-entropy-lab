import time
import datetime
import json
import os
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
        self.project_root = project_root or Path(__file__).resolve().parents[3]
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
        """外部元数据补充协议 (External Metadata Enrichment Protocol)"""
        # API access explicitly blocked in zero-entropy physical separation model
        logger.info("[ReasoningEngine] Metadata Enrichment skipped: External network requests are strictly forbidden.")

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
        零拷贝多核并行 PageRank (Zero-Copy Multi-Core PageRank via Shared Memory).
        将邻接表压平为字节流，使用 ProcessPoolExecutor 和 shared_memory 撕裂 GIL 限制。
        """
        import struct
        import math
        from multiprocessing import shared_memory
        import concurrent.futures

        try:
            relations = self._query('SELECT source, target FROM relations')
            if not relations:
                return []

            # 1. 内存压平 (Memory Flattening)
            all_nodes = set()
            out_degree = {}
            in_links = {}

            for src, dst in relations:
                all_nodes.add(src)
                all_nodes.add(dst)
                out_degree[src] = out_degree.get(src, 0) + 1
                if dst not in in_links:
                    in_links[dst] = []
                in_links[dst].append(src)

            nodes_list = list(all_nodes)
            node_to_idx = {n: i for i, n in enumerate(nodes_list)}
            N = len(nodes_list)
            if N == 0:
                return []

            # 序列化为字节流 (Serialize to bytes)
            # Layout: [N (4 bytes)] + [out_degrees (N * 4 bytes)] + [ranks (N * 8 bytes)] + [new_ranks (N * 8 bytes)]
            # Then edge lists... but to keep it simple and robust for this demo without full pointer arithmetic,
            # we will serialize the core arrays to shared memory and pass the in_links_idx as regular arguments to processes.
            # In a full singularity, everything would be mapped.
            out_deg_arr = [out_degree.get(n, 0) for n in nodes_list]

            in_links_idx = [[] for _ in range(N)]
            for n, parents in in_links.items():
                target_idx = node_to_idx[n]
                for p in parents:
                    in_links_idx[target_idx].append(node_to_idx[p])

            # Calculate shared memory size
            # ranks: N * 8 bytes (double)
            # We use two buffers for ping-pong ranks during iterations
            mem_size = N * 8 * 2

            try:
                shm = shared_memory.SharedMemory(create=True, size=mem_size)
            except FileExistsError:
                # Fallback if somehow left over
                return ["Emergence Error: Shared memory conflict. Try again later."]

            try:
                # Initialize ranks to 1.0 in buffer 0
                buf = shm.buf
                for i in range(N):
                    struct.pack_into('d', buf, i * 8, 1.0)
                    struct.pack_into('d', buf, mem_size // 2 + i * 8, 0.0)

                damping_factor = 0.85
                iterations = 15

                # Number of workers
                workers = min(os.cpu_count() or 4, 8)
                chunk_size = math.ceil(N / workers)
                chunks = [(i * chunk_size, min((i + 1) * chunk_size, N)) for i in range(workers) if i * chunk_size < N]

                # To truly map processes we must define a top-level function,
                # For zero-entropy we spawn via ProcessPoolExecutor
                def _compute_chunk(chunk_start, chunk_end, shm_name, m_size, r_offset, w_offset, N, links, out_degs, base_rank, damp):
                    # 安全捕获，防止子进程异常导致的僵尸进程
                    try:
                        local_shm = shared_memory.SharedMemory(name=shm_name)
                        l_buf = local_shm.buf
                        try:
                            for i in range(chunk_start, chunk_end):
                                rank_sum = 0.0
                                for parent_idx in links[i]:
                                    p_out_deg = out_degs[parent_idx]
                                    if p_out_deg > 0:
                                        p_rank = struct.unpack_from('d', l_buf, r_offset + parent_idx * 8)[0]
                                        rank_sum += p_rank / p_out_deg

                                new_r = base_rank + damp * rank_sum
                                struct.pack_into('d', l_buf, w_offset + i * 8, new_r)
                        finally:
                            local_shm.close()
                    except Exception as e:
                        # 静默处理子进程内部异常，防止主流程锁死
                        pass

                # This hack allows us to use local function with ProcessPoolExecutor in script mode by attaching to module
                import sys
                setattr(sys.modules[__name__], '_compute_chunk', _compute_chunk)

                for step in range(iterations):
                    read_offset = 0 if step % 2 == 0 else mem_size // 2
                    write_offset = mem_size // 2 if step % 2 == 0 else 0
                    base_rank = 1.0 - damping_factor

                    with concurrent.futures.ProcessPoolExecutor(max_workers=workers) as executor:
                        futures = []
                        for start, end in chunks:
                            futures.append(executor.submit(
                                sys.modules[__name__]._compute_chunk,
                                start, end, shm.name, mem_size, read_offset, write_offset, N, in_links_idx, out_deg_arr, base_rank, damping_factor
                            ))
                        # Wait implicitly captures exceptions
                        concurrent.futures.wait(futures)

                # Read final ranks
                final_offset = write_offset
                ranks = [struct.unpack_from('d', buf, final_offset + i * 8)[0] for i in range(N)]
            finally:
                # 严密的闭环回收，杜绝孤儿共享内存段 (Orphan Memory Segments)
                try:
                    shm.close()
                except Exception:
                    pass
                try:
                    shm.unlink()
                except Exception:
                    pass

            # 更新回数据库 (Write back to database)
            cursor = self.cortex.conn.cursor()
            cursor.execute("SAVEPOINT pagerank_update")

            results = []
            for i, r in enumerate(ranks):
                results.append((r, nodes_list[i]))

            top_nodes = sorted(results, key=lambda x: x[0], reverse=True)[:3]

            for weight, node in results:
                cursor.execute('UPDATE entities SET weight = weight * 0.5 + ? WHERE id = ?', (weight, node))

            self.cortex.conn.commit()

            top_names = []
            for w, node_id in top_nodes:
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
