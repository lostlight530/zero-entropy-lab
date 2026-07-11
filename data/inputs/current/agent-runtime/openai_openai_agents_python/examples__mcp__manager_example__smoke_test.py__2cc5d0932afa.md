# openai/openai-agents-python · examples/mcp/manager_example/smoke_test.py

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [openai/openai-agents-python](https://github.com/openai/openai-agents-python) |
| 来源文件 | [examples/mcp/manager_example/smoke_test.py](https://github.com/openai/openai-agents-python/blob/2cc5d0932afaa121c7d78bfe7209196c449043c6/examples/mcp/manager_example/smoke_test.py) |
| 来源版本 | `2cc5d0932afaa121c7d78bfe7209196c449043c6` |
| 摄取时间 | `2026-07-11T06:08:47.481437+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_openai_openai_agents_python_examples_mcp_manager_example_smoke_test_py_2cc5d0932afa` |

## 本次变化

- 新增行数 `144`.
- 删除行数 `0`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- 未发现 Markdown 标题.

<details>
<summary>展开完整外部原文</summary>

"""Smoke test for the MCP manager example app.

This script starts the sibling Streamable HTTP MCP server on a temporary local
port, loads the app with matching environment variables, and verifies the
manager-backed endpoints without calling a model.
"""

from __future__ import annotations

import asyncio
import importlib
import os
import socket
import subprocess
import sys
import time
from typing import Any, cast

import httpx

HOST = "127.0.0.1"
PORT_WAIT_SECONDS = 10.0


def _free_port() -> int:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.bind((HOST, 0))
        return int(sock.getsockname()[1])


def _wait_for_port(process: subprocess.Popen[str], port: int) -> None:
    deadline = time.monotonic() + PORT_WAIT_SECONDS
    while time.monotonic() < deadline:
        if process.poll() is not None:
            output, _ = process.communicate(timeout=1)
            raise RuntimeError(f"MCP server exited before it was ready:\n{output}")
        try:
            with socket.create_connection((HOST, port), timeout=0.2):
                return
        except OSError:
            time.sleep(0.1)
    raise RuntimeError(f"MCP server did not listen on {HOST}:{port}.")


def _stop_process(process: subprocess.Popen[str]) -> str:
    if process.poll() is not None:
        output, _ = process.communicate(timeout=1)
        return output

    process.terminate()
    try:
        output, _ = process.communicate(timeout=5)
    except subprocess.TimeoutExpired:
        process.kill()
        output, _ = process.communicate(timeout=5)
    return output


def _start_mcp_server(port: int) -> subprocess.Popen[str]:
    env = {
        **os.environ,
        "STREAMABLE_HTTP_HOST": HOST,
        "STREAMABLE_HTTP_PORT": str(port),
    }
    return subprocess.Popen(
        [sys.executable, "-u", "-m", "examples.mcp.manager_example.mcp_server"],
        env=env,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
    )


def _load_app_module(mcp_port: int) -> Any:
    mcp_server_url = f"http://{HOST}:{mcp_port}/mcp"
    os.environ["MCP_SERVER_URL"] = mcp_server_url
    # Point both configured MCP servers at the same temporary server so this
    # smoke test stays on the clean app integration path.
    os.environ["INACTIVE_MCP_SERVER_URL"] = mcp_server_url
    os.environ["USE_MCP_MANAGER"] = "1"

    module_name = "examples.mcp.manager_example.app"
    if module_name in sys.modules:
        module = importlib.reload(sys.modules[module_name])
    else:
        module = importlib.import_module(module_name)
    return cast(Any, module)


def _require(condition: bool, message: str) -> None:
    if not condition:
        raise RuntimeError(message)


async def _exercise_app(mcp_port: int) -> None:
    app_module = _load_app_module(mcp_port)
    app = app_module.app
    expected_server_url = f"http://{HOST}:{mcp_port}/mcp"

    async with app.router.lifespan_context(app):
        transport = httpx.ASGITransport(app=app)
        async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
            health_response = await client.get("/health")
            health_response.raise_for_status()
            health = health_response.json()
            _require(
                any(expected_server_url in name for name in health["connected_servers"]),
                f"Expected connected MCP server in health response: {health}",
            )
            _require(
                health["failed_servers"] == [],
                f"Expected no failed MCP servers in health response: {health}",
            )

            tools_response = await client.get("/tools")
            tools_response.raise_for_status()
            tools = tools_response.json()["tools"]
            _require({"add", "echo"} <= set(tools), f"Expected add and echo tools: {tools}")

            add_response = await client.post("/add", json={"a": 2, "b": 3})
            add_response.raise_for_status()
            add_result = add_response.json()["result"]
            texts = [
                item.get("text")
                for item in add_result.get("content", [])
                if item.get("type") == "text"
            ]
            _require("5" in texts, f"Expected add tool result to include 5: {add_result}")


async def main() -> None:
    mcp_port = _free_port()
    process = _start_mcp_server(mcp_port)
    try:
        _wait_for_port(process, mcp_port)
        await _exercise_app(mcp_port)
    finally:
        _stop_process(process)

    print("MCP manager example smoke test completed successfully.")


if __name__ == "__main__":
    asyncio.run(main())

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ 2cc5d0932afaa121c7d78bfe7209196c449043c6

@@ -0,0 +1,144 @@

+"""Smoke test for the MCP manager example app.
+
+This script starts the sibling Streamable HTTP MCP server on a temporary local
+port, loads the app with matching environment variables, and verifies the
+manager-backed endpoints without calling a model.
+"""
+
+from __future__ import annotations
+
+import asyncio
+import importlib
+import os
+import socket
+import subprocess
+import sys
+import time
+from typing import Any, cast
+
+import httpx
+
+HOST = "127.0.0.1"
+PORT_WAIT_SECONDS = 10.0
+
+
+def _free_port() -> int:
+    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
+        sock.bind((HOST, 0))
+        return int(sock.getsockname()[1])
+
+
+def _wait_for_port(process: subprocess.Popen[str], port: int) -> None:
+    deadline = time.monotonic() + PORT_WAIT_SECONDS
+    while time.monotonic() < deadline:
+        if process.poll() is not None:
+            output, _ = process.communicate(timeout=1)
+            raise RuntimeError(f"MCP server exited before it was ready:\n{output}")
+        try:
+            with socket.create_connection((HOST, port), timeout=0.2):
+                return
+        except OSError:
+            time.sleep(0.1)
+    raise RuntimeError(f"MCP server did not listen on {HOST}:{port}.")
+
+
+def _stop_process(process: subprocess.Popen[str]) -> str:
+    if process.poll() is not None:
+        output, _ = process.communicate(timeout=1)
+        return output
+
+    process.terminate()
+    try:
+        output, _ = process.communicate(timeout=5)
+    except subprocess.TimeoutExpired:
+        process.kill()
+        output, _ = process.communicate(timeout=5)
+    return output
+
+
+def _start_mcp_server(port: int) -> subprocess.Popen[str]:
+    env = {
+        **os.environ,
+        "STREAMABLE_HTTP_HOST": HOST,
+        "STREAMABLE_HTTP_PORT": str(port),
+    }
+    return subprocess.Popen(
+        [sys.executable, "-u", "-m", "examples.mcp.manager_example.mcp_server"],
+        env=env,
+        stdout=subprocess.PIPE,
+        stderr=subprocess.STDOUT,
+        text=True,
+    )
+
+
+def _load_app_module(mcp_port: int) -> Any:
+    mcp_server_url = f"http://{HOST}:{mcp_port}/mcp"
+    os.environ["MCP_SERVER_URL"] = mcp_server_url
+    # Point both configured MCP servers at the same temporary server so this
+    # smoke test stays on the clean app integration path.
+    os.environ["INACTIVE_MCP_SERVER_URL"] = mcp_server_url
+    os.environ["USE_MCP_MANAGER"] = "1"
+
+    module_name = "examples.mcp.manager_example.app"
+    if module_name in sys.modules:
+        module = importlib.reload(sys.modules[module_name])
+    else:
+        module = importlib.import_module(module_name)
+    return cast(Any, module)
+
+
+def _require(condition: bool, message: str) -> None:
+    if not condition:
+        raise RuntimeError(message)
+
+
+async def _exercise_app(mcp_port: int) -> None:
+    app_module = _load_app_module(mcp_port)
+    app = app_module.app
+    expected_server_url = f"http://{HOST}:{mcp_port}/mcp"
+
+    async with app.router.lifespan_context(app):
+        transport = httpx.ASGITransport(app=app)
+        async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
+            health_response = await client.get("/health")
+            health_response.raise_for_status()
+            health = health_response.json()
+            _require(
+                any(expected_server_url in name for name in health["connected_servers"]),
+                f"Expected connected MCP server in health response: {health}",
+            )
+            _require(
+                health["failed_servers"] == [],
+                f"Expected no failed MCP servers in health response: {health}",
+            )
+
+            tools_response = await client.get("/tools")
+            tools_response.raise_for_status()
+            tools = tools_response.json()["tools"]
+            _require({"add", "echo"} <= set(tools), f"Expected add and echo tools: {tools}")
+
+            add_response = await client.post("/add", json={"a": 2, "b": 3})
+            add_response.raise_for_status()
+            add_result = add_response.json()["result"]
+            texts = [
+                item.get("text")
+                for item in add_result.get("content", [])
+                if item.get("type") == "text"
+            ]
+            _require("5" in texts, f"Expected add tool result to include 5: {add_result}")
+
+
+async def main() -> None:
+    mcp_port = _free_port()
+    process = _start_mcp_server(mcp_port)
+    try:
+        _wait_for_port(process, mcp_port)
+        await _exercise_app(mcp_port)
+    finally:
+        _stop_process(process)
+
+    print("MCP manager example smoke test completed successfully.")
+
+
+if __name__ == "__main__":
+    asyncio.run(main())
```

</details>
