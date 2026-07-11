# openai/openai-agents-python · examples/mcp/get_all_mcp_tools_example/README.md

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [openai/openai-agents-python](https://github.com/openai/openai-agents-python) |
| 来源文件 | [examples/mcp/get_all_mcp_tools_example/README.md](https://github.com/openai/openai-agents-python/blob/2e1dc021fa6be23016627ae2797f68fbb2a53f72/examples/mcp/get_all_mcp_tools_example/README.md) |
| 来源版本 | `2e1dc021fa6be23016627ae2797f68fbb2a53f72` |
| 摄取时间 | `2026-07-11T06:08:46.267930+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_openai_openai_agents_python_examples_mcp_get_all_mcp_tools_example_readme_md_2e1dc021fa6b` |

## 本次变化

- 新增行数 `20`.
- 删除行数 `0`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- MCP get_all_mcp_tools Example

<details>
<summary>展开完整外部原文</summary>

# MCP get_all_mcp_tools Example

Python port of the JS `examples/mcp/get-all-mcp-tools-example.ts`. It demonstrates:

- Spinning up a local filesystem MCP server via `npx`.
- Prefetching all MCP tools with `MCPUtil.get_all_function_tools`.
- Building an agent that uses those prefetched tools instead of `mcp_servers`.
- Applying a static tool filter and refetching tools.
- Enabling `require_approval="always"` on the server and auto-approving interruptions in code to exercise the HITL path.

Run it with:

```bash
uv run python examples/mcp/get_all_mcp_tools_example/main.py
```

Prerequisites:

- `npx` available on your PATH.
- `OPENAI_API_KEY` set for the model calls.

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ 2e1dc021fa6be23016627ae2797f68fbb2a53f72

@@ -0,0 +1,20 @@

+# MCP get_all_mcp_tools Example
+
+Python port of the JS `examples/mcp/get-all-mcp-tools-example.ts`. It demonstrates:
+
+- Spinning up a local filesystem MCP server via `npx`.
+- Prefetching all MCP tools with `MCPUtil.get_all_function_tools`.
+- Building an agent that uses those prefetched tools instead of `mcp_servers`.
+- Applying a static tool filter and refetching tools.
+- Enabling `require_approval="always"` on the server and auto-approving interruptions in code to exercise the HITL path.
+
+Run it with:
+
+```bash
+uv run python examples/mcp/get_all_mcp_tools_example/main.py
+```
+
+Prerequisites:
+
+- `npx` available on your PATH.
+- `OPENAI_API_KEY` set for the model calls.
```

</details>
