import unittest
import sys
import os
import sqlite3
import json
from pathlib import Path

# Fix paths for test imports
sys.path.append(str(Path(__file__).parent.parent / "src" / "kernel"))
from cortex import Cortex

class TestCortex(unittest.TestCase):
    def setUp(self):
        self.project_root = Path(__file__).parent.parent
        self.test_db = self.project_root / "data" / "test_cortex.db"
        # Ensure data folder exists
        self.test_db.parent.mkdir(parents=True, exist_ok=True)
        self.cortex = Cortex(self.test_db)

    def tearDown(self):
        if hasattr(self, 'cortex'):
            self.cortex.conn.close()
        if self.test_db.exists():
            try:
                os.remove(self.test_db)
            except: pass

    def test_knowledge_graph(self):
        """测试知识图谱的基本读写与联想"""
        self.cortex.add_entity("id-base", "concept", "Base Node", "Root of truth")
        self.cortex.add_entity("id-leaf", "concept", "Leaf Node", "Branch of thought")
        self.cortex.connect_entities("id-base", "defines", "id-leaf", "Hierarchical link")
        
        results = self.cortex.search("Base")
        self.assertEqual(results[0]['id'], "id-base")
        
        # 验证关联搜索 (1-hop)
        self.cortex.activate_memory("id-leaf", boost=2.0) # Boost to make it visible in expansion
        results = self.cortex.search("Base")
        self.assertTrue(any(r['id'] == 'id-leaf' for r in results), "Should find related leaf node")

if __name__ == "__main__":
    print("⚔️ NEXUS PROVING GROUND: Cortex Unit Tests")
    unittest.main()
