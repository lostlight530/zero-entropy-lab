# openai/openai-agents-python · examples/mcp/tool_filter_example/README.md

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [openai/openai-agents-python](https://github.com/openai/openai-agents-python) |
| 来源文件 | [examples/mcp/tool_filter_example/README.md](https://github.com/openai/openai-agents-python/blob/1a82f266ea5ff9df9e30208e5950e21e4c648cd8/examples/mcp/tool_filter_example/README.md) |
| 来源版本 | `1a82f266ea5ff9df9e30208e5950e21e4c648cd8` |
| 摄取时间 | `2026-07-11T06:08:49.782918+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_openai_openai_agents_python_examples_mcp_tool_filter_example_readme_md_1a82f266ea5f` |

## 本次变化

- 新增行数 `19`.
- 删除行数 `0`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- MCP Tool Filter Example

<details>
<summary>展开完整外部原文</summary>

# MCP Tool Filter Example

Python port of the JS `examples/mcp/tool-filter-example.ts`. It shows how to:

- Run the filesystem MCP server locally via `npx`.
- Apply a static tool filter so only specific tools are exposed to the model.
- Observe that blocked tools are not available.
- Enable `require_approval="always"` and auto-approve interruptions in code so the HITL path is exercised.

Run it with:

```bash
uv run python examples/mcp/tool_filter_example/main.py
```

Prerequisites:

- `npx` available on your PATH.
- `OPENAI_API_KEY` set for the model calls.

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ 1a82f266ea5ff9df9e30208e5950e21e4c648cd8

@@ -0,0 +1,19 @@

+# MCP Tool Filter Example
+
+Python port of the JS `examples/mcp/tool-filter-example.ts`. It shows how to:
+
+- Run the filesystem MCP server locally via `npx`.
+- Apply a static tool filter so only specific tools are exposed to the model.
+- Observe that blocked tools are not available.
+- Enable `require_approval="always"` and auto-approve interruptions in code so the HITL path is exercised.
+
+Run it with:
+
+```bash
+uv run python examples/mcp/tool_filter_example/main.py
+```
+
+Prerequisites:
+
+- `npx` available on your PATH.
+- `OPENAI_API_KEY` set for the model calls.
```

</details>
