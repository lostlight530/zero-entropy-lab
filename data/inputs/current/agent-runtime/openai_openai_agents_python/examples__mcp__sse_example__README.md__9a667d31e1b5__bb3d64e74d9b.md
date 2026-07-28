# openai/openai-agents-python · examples/mcp/sse_example/README.md

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [openai/openai-agents-python](https://github.com/openai/openai-agents-python) |
| 来源文件 | [examples/mcp/sse_example/README.md](https://github.com/openai/openai-agents-python/blob/bb3d64e74d9b92831aaa7e10cecbb0bfd6fa50c1/examples/mcp/sse_example/README.md) |
| 来源版本 | `bb3d64e74d9b92831aaa7e10cecbb0bfd6fa50c1` |
| 来源目录 Tree | `6619014cb5e3c71b86bae8fa1b2514c9d73d8f76` |
| 来源内容 Blob | `9a667d31e1b5629ad9c7415bafff69ac296a40e4` |
| 摄取时间 | `2026-07-28T07:52:20.561793+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_openai_openai_agents_python_examples_mcp_sse_example_readme_md_9a667d31e1b5` |

## 本次变化

- 新增行数 `13`.
- 删除行数 `0`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- MCP SSE Example
- Details

<details>
<summary>展开完整外部原文</summary>

# MCP SSE Example

This example uses a local SSE server in [server.py](server.py).

Run the example via:

```
uv run python examples/mcp/sse_example/main.py
```

## Details

The example uses the `MCPServerSse` class from `agents.mcp`. The server runs in a sub-process at `https://localhost:8000/sse`.

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ 9a667d31e1b5629ad9c7415bafff69ac296a40e4

@@ -0,0 +1,13 @@

+# MCP SSE Example
+
+This example uses a local SSE server in [server.py](server.py).
+
+Run the example via:
+
+```
+uv run python examples/mcp/sse_example/main.py
+```
+
+## Details
+
+The example uses the `MCPServerSse` class from `agents.mcp`. The server runs in a sub-process at `https://localhost:8000/sse`.
```

</details>
