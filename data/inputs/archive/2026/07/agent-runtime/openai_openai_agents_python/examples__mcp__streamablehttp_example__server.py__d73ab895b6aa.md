# openai/openai-agents-python · examples/mcp/streamablehttp_example/server.py

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [openai/openai-agents-python](https://github.com/openai/openai-agents-python) |
| 来源文件 | [examples/mcp/streamablehttp_example/server.py](https://github.com/openai/openai-agents-python/blob/d73ab895b6aa264b2cbe02834bdac6fe92e523d9/examples/mcp/streamablehttp_example/server.py) |
| 来源版本 | `d73ab895b6aa264b2cbe02834bdac6fe92e523d9` |
| 摄取时间 | `2026-07-11T06:08:49.641668+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_openai_openai_agents_python_examples_mcp_streamablehttp_example_server_py_d73ab895b6aa` |

## 本次变化

- 新增行数 `43`.
- 删除行数 `0`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- Create server

<details>
<summary>展开完整外部原文</summary>

import os
import random

import requests
from mcp.server.fastmcp import FastMCP

STREAMABLE_HTTP_HOST = os.getenv("STREAMABLE_HTTP_HOST", "127.0.0.1")
STREAMABLE_HTTP_PORT = int(os.getenv("STREAMABLE_HTTP_PORT", "18080"))

# Create server
mcp = FastMCP("Echo Server", host=STREAMABLE_HTTP_HOST, port=STREAMABLE_HTTP_PORT)


@mcp.tool()
def add(a: int, b: int) -> int:
    """Add two numbers"""
    print(f"[debug-server] add({a}, {b})")
    return a + b


@mcp.tool()
def get_secret_word() -> str:
    print("[debug-server] get_secret_word()")
    return random.choice(["apple", "banana", "cherry"])


@mcp.tool()
def get_current_weather(city: str) -> str:
    print(f"[debug-server] get_current_weather({city})")
    # Avoid slow or flaky network calls during automated runs.
    try:
        endpoint = "https://wttr.in"
        response = requests.get(f"{endpoint}/{city}", timeout=2)
        if response.ok:
            return response.text
    except Exception:
        pass
    # Fallback keeps the tool responsive even when offline.
    return f"Weather data unavailable right now; assume clear skies in {city}."


if __name__ == "__main__":
    mcp.run(transport="streamable-http")

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ d73ab895b6aa264b2cbe02834bdac6fe92e523d9

@@ -0,0 +1,43 @@

+import os
+import random
+
+import requests
+from mcp.server.fastmcp import FastMCP
+
+STREAMABLE_HTTP_HOST = os.getenv("STREAMABLE_HTTP_HOST", "127.0.0.1")
+STREAMABLE_HTTP_PORT = int(os.getenv("STREAMABLE_HTTP_PORT", "18080"))
+
+# Create server
+mcp = FastMCP("Echo Server", host=STREAMABLE_HTTP_HOST, port=STREAMABLE_HTTP_PORT)
+
+
+@mcp.tool()
+def add(a: int, b: int) -> int:
+    """Add two numbers"""
+    print(f"[debug-server] add({a}, {b})")
+    return a + b
+
+
+@mcp.tool()
+def get_secret_word() -> str:
+    print("[debug-server] get_secret_word()")
+    return random.choice(["apple", "banana", "cherry"])
+
+
+@mcp.tool()
+def get_current_weather(city: str) -> str:
+    print(f"[debug-server] get_current_weather({city})")
+    # Avoid slow or flaky network calls during automated runs.
+    try:
+        endpoint = "https://wttr.in"
+        response = requests.get(f"{endpoint}/{city}", timeout=2)
+        if response.ok:
+            return response.text
+    except Exception:
+        pass
+    # Fallback keeps the tool responsive even when offline.
+    return f"Weather data unavailable right now; assume clear skies in {city}."
+
+
+if __name__ == "__main__":
+    mcp.run(transport="streamable-http")
```

</details>
