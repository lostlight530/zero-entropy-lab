# openai/openai-agents-python · examples/mcp/sse_example/server.py

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [openai/openai-agents-python](https://github.com/openai/openai-agents-python) |
| 来源文件 | [examples/mcp/sse_example/server.py](https://github.com/openai/openai-agents-python/blob/075137fe03016ea6a3856730d774859246b0c05e/examples/mcp/sse_example/server.py) |
| 来源版本 | `075137fe03016ea6a3856730d774859246b0c05e` |
| 摄取时间 | `2026-07-11T06:08:48.346874+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_openai_openai_agents_python_examples_mcp_sse_example_server_py_075137fe0301` |

## 本次变化

- 新增行数 `42`.
- 删除行数 `0`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- Create server

<details>
<summary>展开完整外部原文</summary>

import os
import random

from mcp.server.fastmcp import FastMCP

SSE_HOST = os.getenv("SSE_HOST", "127.0.0.1")
SSE_PORT = int(os.getenv("SSE_PORT", "8000"))

# Create server
mcp = FastMCP("Echo Server", host=SSE_HOST, port=SSE_PORT)


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
    # Keep tool output deterministic so this example is stable in CI and offline environments.
    weather_by_city = {
        "tokyo": "sunny with a light breeze and 20°C",
        "san francisco": "cool and foggy with 14°C",
        "new york": "partly cloudy with 18°C",
    }
    forecast = weather_by_city.get(city.strip().lower())
    if forecast:
        return f"The weather in {city} is {forecast}."
    return f"The weather data for {city} is unavailable in this demo."


if __name__ == "__main__":
    mcp.run(transport="sse")

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ 075137fe03016ea6a3856730d774859246b0c05e

@@ -0,0 +1,42 @@

+import os
+import random
+
+from mcp.server.fastmcp import FastMCP
+
+SSE_HOST = os.getenv("SSE_HOST", "127.0.0.1")
+SSE_PORT = int(os.getenv("SSE_PORT", "8000"))
+
+# Create server
+mcp = FastMCP("Echo Server", host=SSE_HOST, port=SSE_PORT)
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
+    # Keep tool output deterministic so this example is stable in CI and offline environments.
+    weather_by_city = {
+        "tokyo": "sunny with a light breeze and 20°C",
+        "san francisco": "cool and foggy with 14°C",
+        "new york": "partly cloudy with 18°C",
+    }
+    forecast = weather_by_city.get(city.strip().lower())
+    if forecast:
+        return f"The weather in {city} is {forecast}."
+    return f"The weather data for {city} is unavailable in this demo."
+
+
+if __name__ == "__main__":
+    mcp.run(transport="sse")
```

</details>
