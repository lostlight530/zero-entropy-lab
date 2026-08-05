# openai/openai-agents-python · examples/mcp/streamablehttp_custom_client_example/server.py

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [openai/openai-agents-python](https://github.com/openai/openai-agents-python) |
| 来源文件 | [examples/mcp/streamablehttp_custom_client_example/server.py](https://github.com/openai/openai-agents-python/blob/c48dd4c1aaa6fddf8afd3a99e6cbdc465148b9d4/examples/mcp/streamablehttp_custom_client_example/server.py) |
| 来源版本 | `c48dd4c1aaa6fddf8afd3a99e6cbdc465148b9d4` |
| 来源目录 Tree | `3965270782e8eb4dc19f233b78707ecede3fb728` |
| 来源内容 Blob | `e6ec5d5f9392910d6ca547a1a4ccebda9949ed89` |
| 摄取时间 | `2026-08-05T22:47:21.912819+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_openai_openai_agents_python_examples_mcp_streamablehttp_custom_client_example_server_py_dd0d468753b3` |

## 本次变化

- 新增行数 `7`.
- 删除行数 `3`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- Create server

<details>
<summary>展开完整外部原文</summary>

import os
import random

from mcp.server.mcpserver import MCPServer

STREAMABLE_HTTP_HOST = os.getenv("STREAMABLE_HTTP_HOST", "127.0.0.1")
STREAMABLE_HTTP_PORT = int(os.getenv("STREAMABLE_HTTP_PORT", "18080"))

# Create server
mcp = MCPServer("Echo Server")


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
    mcp.run(
        transport="streamable-http",
        host=STREAMABLE_HTTP_HOST,
        port=STREAMABLE_HTTP_PORT,
    )

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ e6ec5d5f9392910d6ca547a1a4ccebda9949ed89

@@ -1,13 +1,13 @@

 import os
 import random
 
-from mcp.server.fastmcp import FastMCP
+from mcp.server.mcpserver import MCPServer
 
 STREAMABLE_HTTP_HOST = os.getenv("STREAMABLE_HTTP_HOST", "127.0.0.1")
 STREAMABLE_HTTP_PORT = int(os.getenv("STREAMABLE_HTTP_PORT", "18080"))
 
 # Create server
-mcp = FastMCP("Echo Server", host=STREAMABLE_HTTP_HOST, port=STREAMABLE_HTTP_PORT)
+mcp = MCPServer("Echo Server")
 
 
 @mcp.tool()
@@ -24,4 +24,8 @@

 
 
 if __name__ == "__main__":
-    mcp.run(transport="streamable-http")
+    mcp.run(
+        transport="streamable-http",
+        host=STREAMABLE_HTTP_HOST,
+        port=STREAMABLE_HTTP_PORT,
+    )
```

</details>
