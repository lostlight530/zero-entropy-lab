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
API_KEY = "test-only-nexus-api-key"


class TestMCPZeroProtocol(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.original_api_key = os.environ.get("NEXUS_API_KEY")
        os.environ["NEXUS_API_KEY"] = API_KEY

        # Bind only to loopback so the test server is never exposed to the network
        socketserver.TCPServer.allow_reuse_address = True
        cls.server = socketserver.TCPServer(("127.0.0.1", PORT), NexusHandler)
        cls.server_thread = threading.Thread(target=cls.server.serve_forever)
        cls.server_thread.daemon = True
        cls.server_thread.start()
        time.sleep(1)

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()
        cls.server_thread.join()
        if cls.original_api_key is None:
            os.environ.pop("NEXUS_API_KEY", None)
        else:
            os.environ["NEXUS_API_KEY"] = cls.original_api_key

    def setUp(self):
        os.environ["NEXUS_API_KEY"] = API_KEY

    @staticmethod
    def request(path, *, data=None, api_key=API_KEY):
        method = "POST" if data is not None else "GET"
        req = urllib.request.Request(
            f"http://127.0.0.1:{PORT}{path}",
            data=data,
            method=method,
        )
        if data is not None:
            req.add_header("Content-Type", "application/json")
        if api_key is not None:
            req.add_header("Authorization", f"Bearer {api_key}")
        return urllib.request.urlopen(req)

    def test_api_fails_closed_without_key_configuration(self):
        os.environ.pop("NEXUS_API_KEY", None)

        with self.assertRaises(urllib.error.HTTPError) as context:
            self.request("/api/mcp/tools", api_key=None)

        self.assertEqual(context.exception.code, 401)

    def test_api_rejects_missing_authorization(self):
        with self.assertRaises(urllib.error.HTTPError) as context:
            self.request("/api/mcp/tools", api_key=None)

        self.assertEqual(context.exception.code, 401)

    def test_api_rejects_incorrect_authorization(self):
        with self.assertRaises(urllib.error.HTTPError) as context:
            self.request("/api/mcp/tools", api_key="incorrect-key")

        self.assertEqual(context.exception.code, 401)

    def test_mcp_tools_discovery(self):
        with self.request("/api/mcp/tools") as response:
            self.assertEqual(response.status, 200)
            data = json.loads(response.read().decode())
            self.assertEqual(data["status"], "ok")
            tools = data["payload"]["tools"]
            self.assertTrue(len(tools) > 0)

    def test_mcp_invoke_success(self):
        payload = json.dumps({
            "name": "cortex_search",
            "arguments": {"query": "system", "limit": 2}
        }).encode("utf-8")

        with self.request("/api/mcp/invoke", data=payload) as response:
            self.assertEqual(response.status, 200)
            data = json.loads(response.read().decode())
            self.assertEqual(data["status"], "ok")
            content = data["payload"]["content"]
            self.assertTrue(len(content) > 0)

            inner = json.loads(content[0]["text"])
            self.assertTrue("results" in inner)

    def test_mcp_invoke_missing_tool(self):
        payload = json.dumps({
            "name": "non_existent_skill",
            "arguments": {"query": "test"}
        }).encode("utf-8")

        with self.request("/api/mcp/invoke", data=payload) as response:
            self.assertEqual(response.status, 200)
            data = json.loads(response.read().decode())
            self.assertEqual(data["status"], "ok")
            payload_result = data["payload"]
            self.assertTrue(payload_result.get("isError"))


if __name__ == "__main__":
    unittest.main()
