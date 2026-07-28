# openai/openai-agents-python · examples/mcp/sse_remote_example/README.md

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [openai/openai-agents-python](https://github.com/openai/openai-agents-python) |
| 来源文件 | [examples/mcp/sse_remote_example/README.md](https://github.com/openai/openai-agents-python/blob/9d8816a06752316f9f46cb397f4cd3a4fba997cd/examples/mcp/sse_remote_example/README.md) |
| 来源版本 | `9d8816a06752316f9f46cb397f4cd3a4fba997cd` |
| 摄取时间 | `2026-07-11T06:08:48.492910+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_openai_openai_agents_python_examples_mcp_sse_remote_example_readme_md_9d8816a06752` |

## 本次变化

- 新增行数 `13`.
- 删除行数 `0`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- MCP SSE Remote Example

<details>
<summary>展开完整外部原文</summary>

# MCP SSE Remote Example

Python port of the JS `examples/mcp/sse-example.ts`. By default it starts the bundled local SSE MCP server and lets the agent use those tools. Set `MCP_SSE_REMOTE_URL` to try a compatible remote SSE server instead.

Run it with:

```bash
uv run python examples/mcp/sse_remote_example/main.py
```

Prerequisites:

- `OPENAI_API_KEY` set for the model calls.

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ 9d8816a06752316f9f46cb397f4cd3a4fba997cd

@@ -0,0 +1,13 @@

+# MCP SSE Remote Example
+
+Python port of the JS `examples/mcp/sse-example.ts`. By default it starts the bundled local SSE MCP server and lets the agent use those tools. Set `MCP_SSE_REMOTE_URL` to try a compatible remote SSE server instead.
+
+Run it with:
+
+```bash
+uv run python examples/mcp/sse_remote_example/main.py
+```
+
+Prerequisites:
+
+- `OPENAI_API_KEY` set for the model calls.
```

</details>
