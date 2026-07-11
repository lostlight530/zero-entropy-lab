# TencentCloudADP/youtu-agent · examples/mcp/sse_example/server.py

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [TencentCloudADP/youtu-agent](https://github.com/TencentCloudADP/youtu-agent) |
| 来源文件 | [examples/mcp/sse_example/server.py](https://github.com/TencentCloudADP/youtu-agent/blob/df364aa3aff51eb3ebdf0a512528c618ad91c951/examples/mcp/sse_example/server.py) |
| 来源版本 | `df364aa3aff51eb3ebdf0a512528c618ad91c951` |
| 摄取时间 | `2026-07-11T06:09:05.741290+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_tencentcloudadp_youtu_agent_examples_mcp_sse_example_server_py_df364aa3aff5` |

## 本次变化

- 新增行数 `33`.
- 删除行数 `0`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- Create server

<details>
<summary>展开完整外部原文</summary>

import random

import requests
from mcp.server.fastmcp import FastMCP

# Create server
mcp = FastMCP("Echo Server")


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

    endpoint = "https://wttr.in"
    response = requests.get(f"{endpoint}/{city}")
    return response.text


if __name__ == "__main__":
    mcp.run(transport="sse")

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ df364aa3aff51eb3ebdf0a512528c618ad91c951

@@ -0,0 +1,33 @@

+import random
+
+import requests
+from mcp.server.fastmcp import FastMCP
+
+# Create server
+mcp = FastMCP("Echo Server")
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
+
+    endpoint = "https://wttr.in"
+    response = requests.get(f"{endpoint}/{city}")
+    return response.text
+
+
+if __name__ == "__main__":
+    mcp.run(transport="sse")
```

</details>
