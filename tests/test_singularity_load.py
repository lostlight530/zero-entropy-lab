import unittest
import threading
import time
import queue
import json
import os
import sys

# Append kernel to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'src', 'kernel'))

from nexus import mcp_bucket, ring_buffer_queue, buffer_lock, FlusherThread
from mcp import CortexMemorizeSkill

class TestSingularityLoad(unittest.TestCase):
    def setUp(self):
        self.skill = CortexMemorizeSkill()
        with buffer_lock:
            ring_buffer_queue.clear()

    def test_concurrent_writes(self):
        """模拟蜂群并发写入 (Simulate swarm concurrent writes to Ring Buffer)"""
        # Increase token bucket temporarily for test to avoid rate limiting blocks
        mcp_bucket.capacity = 1000
        mcp_bucket.tokens = 1000

        threads = []
        # Simulate 100 threads writing 5 entries each
        for i in range(100):
            def write_task(tid):
                for j in range(5):
                    self.skill.execute(id=f"test_node_{tid}_{j}", name=f"Node {tid}-{j}", desc="Test Data")

            t = threading.Thread(target=write_task, args=(i,))
            threads.append(t)
            t.start()

        for t in threads:
            t.join()

        with buffer_lock:
            self.assertEqual(len(ring_buffer_queue), 500)

        # Verify queue contents
        item = ring_buffer_queue[0]
        self.assertEqual(item["type"], "entity")
        self.assertIn("test_node", item["payload"]["id"])

if __name__ == '__main__':
    unittest.main()
