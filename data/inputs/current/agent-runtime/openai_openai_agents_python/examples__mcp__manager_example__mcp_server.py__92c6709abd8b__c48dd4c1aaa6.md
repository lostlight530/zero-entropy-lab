# openai/openai-agents-python · examples/mcp/manager_example/mcp_server.py

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [openai/openai-agents-python](https://github.com/openai/openai-agents-python) |
| 来源文件 | [examples/mcp/manager_example/mcp_server.py](https://github.com/openai/openai-agents-python/blob/c48dd4c1aaa6fddf8afd3a99e6cbdc465148b9d4/examples/mcp/manager_example/mcp_server.py) |
| 来源版本 | `c48dd4c1aaa6fddf8afd3a99e6cbdc465148b9d4` |
| 来源目录 Tree | `3965270782e8eb4dc19f233b78707ecede3fb728` |
| 来源内容 Blob | `92c6709abd8b9f1fd28a1d9f0094936606192a8b` |
| 摄取时间 | `2026-08-05T22:47:19.104914+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_openai_openai_agents_python_examples_mcp_manager_example_mcp_server_py_a67c224994f9` |

## 本次变化

- 新增行数 `7`.
- 删除行数 `7`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- 未发现 Markdown 标题.

<details>
<summary>展开完整外部原文</summary>

import os

from mcp.server.mcpserver import MCPServer

STREAMABLE_HTTP_HOST = os.getenv("STREAMABLE_HTTP_HOST", "127.0.0.1")
STREAMABLE_HTTP_PORT = int(os.getenv("STREAMABLE_HTTP_PORT", "8000"))

mcp = MCPServer("FastAPI Example Server")


@mcp.tool()
def add(a: int, b: int) -> int:
    return a + b


@mcp.tool()
def echo(message: str) -> str:
    return f"echo: {message}"


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

+++ 92c6709abd8b9f1fd28a1d9f0094936606192a8b

@@ -1,15 +1,11 @@

 import os
 
-from mcp.server.fastmcp import FastMCP
+from mcp.server.mcpserver import MCPServer
 
 STREAMABLE_HTTP_HOST = os.getenv("STREAMABLE_HTTP_HOST", "127.0.0.1")
 STREAMABLE_HTTP_PORT = int(os.getenv("STREAMABLE_HTTP_PORT", "8000"))
 
-mcp = FastMCP(
-    "FastAPI Example Server",
-    host=STREAMABLE_HTTP_HOST,
-    port=STREAMABLE_HTTP_PORT,
-)
+mcp = MCPServer("FastAPI Example Server")
 
 
 @mcp.tool()
@@ -23,4 +19,8 @@

 
 
 if __name__ == "__main__":
-    mcp.run(transport="streamable-http")
+    mcp.run(
+        transport="streamable-http",
+        host=STREAMABLE_HTTP_HOST,
+        port=STREAMABLE_HTTP_PORT,
+    )
```

</details>
