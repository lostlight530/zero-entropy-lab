# openai/openai-agents-python · examples/mcp/streamablehttp_custom_client_example/server.py

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [openai/openai-agents-python](https://github.com/openai/openai-agents-python) |
| 来源文件 | [examples/mcp/streamablehttp_custom_client_example/server.py](https://github.com/openai/openai-agents-python/blob/dd0d468753b3ace313789a878db5f3e13cd3a6d4/examples/mcp/streamablehttp_custom_client_example/server.py) |
| 来源版本 | `dd0d468753b3ace313789a878db5f3e13cd3a6d4` |
| 摄取时间 | `2026-07-11T06:08:49.259538+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_openai_openai_agents_python_examples_mcp_streamablehttp_custom_client_example_server_py_dd0d468753b3` |

## 本次变化

- 新增行数 `27`.
- 删除行数 `0`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- Create server

<details>
<summary>展开完整外部原文</summary>

import os
import random

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


if __name__ == "__main__":
    mcp.run(transport="streamable-http")

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ dd0d468753b3ace313789a878db5f3e13cd3a6d4

@@ -0,0 +1,27 @@

+import os
+import random
+
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
+if __name__ == "__main__":
+    mcp.run(transport="streamable-http")
```

</details>
