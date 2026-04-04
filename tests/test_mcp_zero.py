import unittest
import json
import urllib.request
import urllib.error
import threading
import time
import sys
import os

# We append the root so we can import src.kernel
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# Very important: we must clear out any mocks of `cortex` left over by previous tests
# if run under the same process (like `run_tests.py` using unittest.main())
if "cortex" in sys.modules and hasattr(sys.modules["cortex"], "MagicMock"):
    del sys.modules["cortex"]
import importlib
import cortex as real_cortex
sys.modules["cortex"] = real_cortex
importlib.reload(real_cortex)

from nexus import NexusHandler
import socketserver

PORT = 8011

class TestMCPZeroProtocol(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Ensure socket can be reused to avoid port collisions in tests
        socketserver.TCPServer.allow_reuse_address = True

        # We start the server in a separate thread.
        cls.server = socketserver.TCPServer(("", PORT), NexusHandler)
        cls.server_thread = threading.Thread(target=cls.server.serve_forever)
        cls.server_thread.daemon = True
        cls.server_thread.start()
        time.sleep(1) # Wait for server to start

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()
        cls.server_thread.join()

    def test_mcp_tools_discovery(self):
        req = urllib.request.Request(f"http://localhost:{PORT}/api/mcp/tools", method="GET")
        with urllib.request.urlopen(req) as response:
            self.assertEqual(response.status, 200)
            data = json.loads(response.read().decode())
            self.assertEqual(data["status"], "ok")
            tools = data["payload"]["tools"]
            self.assertTrue(len(tools) > 0)

    def test_mcp_invoke_success(self):
        payload = json.dumps({
            "name": "cortex_search",
            "arguments": {"query": "system", "limit": 2}
        }).encode('utf-8')

        req = urllib.request.Request(f"http://localhost:{PORT}/api/mcp/invoke", data=payload, method="POST")
        req.add_header('Content-Type', 'application/json')

        with urllib.request.urlopen(req) as response:
            self.assertEqual(response.status, 200)
            data = json.loads(response.read().decode())
            self.assertEqual(data["status"], "ok")
            content = data["payload"]["content"]
            self.assertTrue(len(content) > 0)

            # check the inner json
            inner = json.loads(content[0]["text"])
            self.assertTrue("results" in inner)

    def test_mcp_invoke_missing_tool(self):
         payload = json.dumps({
             "name": "non_existent_skill",
             "arguments": {"query": "test"}
         }).encode('utf-8')

         req = urllib.request.Request(f"http://localhost:{PORT}/api/mcp/invoke", data=payload, method="POST")
         req.add_header('Content-Type', 'application/json')

         with urllib.request.urlopen(req) as response:
             self.assertEqual(response.status, 200)
             data = json.loads(response.read().decode())
             self.assertEqual(data["status"], "ok")
             payload_result = data["payload"]
             self.assertTrue(payload_result.get("isError"))

if __name__ == '__main__':
    unittest.main()
