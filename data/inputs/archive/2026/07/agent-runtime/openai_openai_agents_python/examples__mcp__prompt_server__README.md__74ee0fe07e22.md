# openai/openai-agents-python · examples/mcp/prompt_server/README.md

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [openai/openai-agents-python](https://github.com/openai/openai-agents-python) |
| 来源文件 | [examples/mcp/prompt_server/README.md](https://github.com/openai/openai-agents-python/blob/74ee0fe07e223b1d93c313a269eb494f1a914cf1/examples/mcp/prompt_server/README.md) |
| 来源版本 | `74ee0fe07e223b1d93c313a269eb494f1a914cf1` |
| 摄取时间 | `2026-07-11T06:08:47.634068+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_openai_openai_agents_python_examples_mcp_prompt_server_readme_md_74ee0fe07e22` |

## 本次变化

- 新增行数 `29`.
- 删除行数 `0`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- MCP Prompt Server Example
- Details
- Workflow

<details>
<summary>展开完整外部原文</summary>

# MCP Prompt Server Example

This example uses a local MCP prompt server in [server.py](server.py).

Run the example via:

```
uv run python examples/mcp/prompt_server/main.py
```

## Details

The example uses the `MCPServerStreamableHttp` class from `agents.mcp`. The script auto-selects an open localhost port (or honors `STREAMABLE_HTTP_PORT`) and runs the server at `http://<host>:<port>/mcp`, providing user-controlled prompts that generate agent instructions. If you need a specific address, set `STREAMABLE_HTTP_PORT` and `STREAMABLE_HTTP_HOST`.

The server exposes prompts like `generate_code_review_instructions` that take parameters such as focus area and programming language. The agent calls these prompts to dynamically generate its system instructions based on user-provided parameters.

## Workflow

The example demonstrates two key functions:

1. **`show_available_prompts`** - Lists all available prompts on the MCP server, showing users what prompts they can select from. This demonstrates the discovery aspect of MCP prompts.

2. **`demo_code_review`** - Shows the complete user-controlled prompt workflow:
   - Calls `generate_code_review_instructions` with specific parameters (focus: "security vulnerabilities", language: "python")
   - Uses the generated instructions to create an Agent with specialized code review capabilities
   - Runs the agent against vulnerable sample code (command injection via `os.system`)
   - The agent analyzes the code and provides security-focused feedback using available tools

This pattern allows users to dynamically configure agent behavior through MCP prompts rather than hardcoded instructions.

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ 74ee0fe07e223b1d93c313a269eb494f1a914cf1

@@ -0,0 +1,29 @@

+# MCP Prompt Server Example
+
+This example uses a local MCP prompt server in [server.py](server.py).
+
+Run the example via:
+
+```
+uv run python examples/mcp/prompt_server/main.py
+```
+
+## Details
+
+The example uses the `MCPServerStreamableHttp` class from `agents.mcp`. The script auto-selects an open localhost port (or honors `STREAMABLE_HTTP_PORT`) and runs the server at `http://<host>:<port>/mcp`, providing user-controlled prompts that generate agent instructions. If you need a specific address, set `STREAMABLE_HTTP_PORT` and `STREAMABLE_HTTP_HOST`.
+
+The server exposes prompts like `generate_code_review_instructions` that take parameters such as focus area and programming language. The agent calls these prompts to dynamically generate its system instructions based on user-provided parameters.
+
+## Workflow
+
+The example demonstrates two key functions:
+
+1. **`show_available_prompts`** - Lists all available prompts on the MCP server, showing users what prompts they can select from. This demonstrates the discovery aspect of MCP prompts.
+
+2. **`demo_code_review`** - Shows the complete user-controlled prompt workflow:
+   - Calls `generate_code_review_instructions` with specific parameters (focus: "security vulnerabilities", language: "python")
+   - Uses the generated instructions to create an Agent with specialized code review capabilities
+   - Runs the agent against vulnerable sample code (command injection via `os.system`)
+   - The agent analyzes the code and provides security-focused feedback using available tools
+
+This pattern allows users to dynamically configure agent behavior through MCP prompts rather than hardcoded instructions.
```

</details>
