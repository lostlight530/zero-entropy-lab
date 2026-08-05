import unittest
import subprocess
import time
import urllib.request
import json
import socket
import sys
import os
from pathlib import Path

API_KEY = "test-only-nexus-integration-key"


class TestServerAPI(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """启动回环地址上的鉴权测试服务器"""
        cls.project_root = Path(__file__).parent.parent
        cls.server_script = (
            cls.project_root / "src" / "kernel" / "protocol" / "nexus.py"
        )
        cls.port = 8000

        kernel_dir = cls.project_root / "src" / "kernel"
        layers = ["protocol", "memory", "cognitive", "sensory", "orchestration"]
        pythonpath = os.pathsep.join(
            [str(kernel_dir)] + [str(kernel_dir / layer) for layer in layers]
        )

        cls.process = subprocess.Popen(
            [sys.executable, str(cls.server_script), "serve"],
            cwd=str(cls.project_root),
            env={
                **os.environ,
                "PYTHONPATH": pythonpath,
                "NEXUS_API_KEY": API_KEY,
            },
        )

        for _ in range(10):
            if cls.process.poll() is not None:
                raise RuntimeError(
                    f"test server exited with code {cls.process.returncode}"
                )
            try:
                with socket.create_connection(("127.0.0.1", cls.port), timeout=1):
                    break
            except OSError:
                time.sleep(0.5)
        else:
            cls.process.terminate()
            cls.process.wait()
            raise RuntimeError("test server did not become ready")

    @classmethod
    def tearDownClass(cls):
        if cls.process.poll() is None:
            cls.process.terminate()
            cls.process.wait()

    @classmethod
    def api_request(cls, path):
        request = urllib.request.Request(
            f"http://127.0.0.1:{cls.port}{path}",
            headers={"Authorization": f"Bearer {API_KEY}"},
        )
        return urllib.request.urlopen(request)

    def test_api_status(self):
        """测试鉴权后的状态接口"""
        with self.api_request("/api/status") as response:
            data = json.loads(response.read().decode())
            self.assertEqual(data["status"], "ok")
            self.assertIn("payload", data)
            self.assertIn("message", data)
            self.assertIn("entities", data["payload"])

    def test_api_invalid_endpoint(self):
        """测试鉴权后的未知接口契约"""
        with self.api_request("/api/invalid") as response:
            data = json.loads(response.read().decode())
            self.assertEqual(data["status"], "error")
            self.assertEqual(data["message"], "Invalid endpoint")

    def test_static_serve(self):
        """测试回环地址上的静态资源"""
        with urllib.request.urlopen(
            f"http://127.0.0.1:{self.port}/index.html"
        ) as response:
            content = response.read().decode()
            self.assertIn("<!DOCTYPE html>", content)


if __name__ == "__main__":
    print("NEXUS API Integration Tests")
    unittest.main()
