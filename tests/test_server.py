import unittest
import subprocess
import time
import urllib.request
import json
import socket
import sys
import os
from pathlib import Path

class TestServerAPI(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """启动后台服务器进程进行集成测试"""
        cls.project_root = Path(__file__).parent.parent
        cls.server_script = cls.project_root / "src" / "kernel" / "nexus.py"
        cls.port = 8000
        
        # 启动服务器 (使用 nexus.py serve)
        cls.process = subprocess.Popen(
            [sys.executable, str(cls.server_script), "serve"],
            cwd=str(cls.project_root),
            env={**os.environ, "PYTHONPATH": str(cls.project_root / "src" / "kernel")}
        )
        
        # 等待服务器就绪
        max_retries = 5
        while max_retries > 0:
            try:
                with socket.create_connection(("localhost", 8000), timeout=1):
                    break
            except:
                time.sleep(0.5)
                max_retries -= 1

    @classmethod
    def tearDownClass(cls):
        cls.process.terminate()
        cls.process.wait()

    def test_api_status(self):
        """测试 /api/status 接口契约验证"""
        try:
            with urllib.request.urlopen("http://localhost:8000/api/status") as response:
                data = json.loads(response.read().decode())
                self.assertEqual(data["status"], "ok")
                self.assertIn("payload", data)
                self.assertIn("message", data)
                self.assertIn("entities", data["payload"])
        except Exception as e:
            self.fail(f"API Request failed: {e}")

    def test_api_invalid_endpoint(self):
        """测试未知 API 接口契约返回"""
        try:
            with urllib.request.urlopen("http://localhost:8000/api/invalid") as response:
                data = json.loads(response.read().decode())
                self.assertEqual(data["status"], "error")
                self.assertEqual(data["message"], "Invalid endpoint")
        except Exception as e:
            self.fail(f"Invalid Endpoint Request failed: {e}")

    def test_static_serve(self):
        """测试静态资源加载"""
        try:
            with urllib.request.urlopen("http://localhost:8000/index.html") as response:
                content = response.read().decode()
                self.assertIn("<!DOCTYPE html>", content)
        except Exception as e:
            self.fail(f"Static Serve failed: {e}")

    def test_cors_policy(self):
        """验证 CORS 策略安全性"""
        # 1. 验证允许的 Origin
        req_allowed = urllib.request.Request(
            "http://localhost:8000/api/status",
            headers={"Origin": "http://localhost:8000"}
        )
        with urllib.request.urlopen(req_allowed) as response:
            self.assertEqual(response.getheader('Access-Control-Allow-Origin'), "http://localhost:8000")
            self.assertEqual(response.getheader('Vary'), "Origin")

        # 2. 验证禁止的 Origin
        req_forbidden = urllib.request.Request(
            "http://localhost:8000/api/status",
            headers={"Origin": "http://evil.com"}
        )
        with urllib.request.urlopen(req_forbidden) as response:
            self.assertIsNone(response.getheader('Access-Control-Allow-Origin'))

        # 3. 验证无 Origin 时不返回 CORS 头
        with urllib.request.urlopen("http://localhost:8000/api/status") as response:
            self.assertIsNone(response.getheader('Access-Control-Allow-Origin'))

if __name__ == "__main__":
    import sys, os
    print("⚔️ NEXUS PROVING GROUND: API Integration Tests")
    unittest.main()
