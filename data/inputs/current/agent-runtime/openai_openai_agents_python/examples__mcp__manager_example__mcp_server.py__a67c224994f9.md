# openai/openai-agents-python · examples/mcp/manager_example/mcp_server.py

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [openai/openai-agents-python](https://github.com/openai/openai-agents-python) |
| 来源文件 | [examples/mcp/manager_example/mcp_server.py](https://github.com/openai/openai-agents-python/blob/a67c224994f908f74d0b715f8112646322694d05/examples/mcp/manager_example/mcp_server.py) |
| 来源版本 | `a67c224994f908f74d0b715f8112646322694d05` |
| 摄取时间 | `2026-07-11T06:08:47.356744+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_openai_openai_agents_python_examples_mcp_manager_example_mcp_server_py_a67c224994f9` |

## 本次变化

- 新增行数 `26`.
- 删除行数 `0`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- 未发现 Markdown 标题.

<details>
<summary>展开完整外部原文</summary>

import os

from mcp.server.fastmcp import FastMCP

STREAMABLE_HTTP_HOST = os.getenv("STREAMABLE_HTTP_HOST", "127.0.0.1")
STREAMABLE_HTTP_PORT = int(os.getenv("STREAMABLE_HTTP_PORT", "8000"))

mcp = FastMCP(
    "FastAPI Example Server",
    host=STREAMABLE_HTTP_HOST,
    port=STREAMABLE_HTTP_PORT,
)


@mcp.tool()
def add(a: int, b: int) -> int:
    return a + b


@mcp.tool()
def echo(message: str) -> str:
    return f"echo: {message}"


if __name__ == "__main__":
    mcp.run(transport="streamable-http")

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ a67c224994f908f74d0b715f8112646322694d05

@@ -0,0 +1,26 @@

+import os
+
+from mcp.server.fastmcp import FastMCP
+
+STREAMABLE_HTTP_HOST = os.getenv("STREAMABLE_HTTP_HOST", "127.0.0.1")
+STREAMABLE_HTTP_PORT = int(os.getenv("STREAMABLE_HTTP_PORT", "8000"))
+
+mcp = FastMCP(
+    "FastAPI Example Server",
+    host=STREAMABLE_HTTP_HOST,
+    port=STREAMABLE_HTTP_PORT,
+)
+
+
+@mcp.tool()
+def add(a: int, b: int) -> int:
+    return a + b
+
+
+@mcp.tool()
+def echo(message: str) -> str:
+    return f"echo: {message}"
+
+
+if __name__ == "__main__":
+    mcp.run(transport="streamable-http")
```

</details>
