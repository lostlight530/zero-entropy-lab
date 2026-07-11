# openai/openai-agents-python · examples/mcp/filesystem_example/README.md

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [openai/openai-agents-python](https://github.com/openai/openai-agents-python) |
| 来源文件 | [examples/mcp/filesystem_example/README.md](https://github.com/openai/openai-agents-python/blob/4ed6ac46f7975a33671db58cf1dde22f038291fa/examples/mcp/filesystem_example/README.md) |
| 来源版本 | `4ed6ac46f7975a33671db58cf1dde22f038291fa` |
| 摄取时间 | `2026-07-11T06:08:45.618175+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_openai_openai_agents_python_examples_mcp_filesystem_example_readme_md_4ed6ac46f797` |

## 本次变化

- 新增行数 `26`.
- 删除行数 `0`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- MCP Filesystem Example
- Details

<details>
<summary>展开完整外部原文</summary>

# MCP Filesystem Example

This example uses the [filesystem MCP server](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem), running locally via `npx`.

Run it via:

```
uv run python examples/mcp/filesystem_example/main.py
```

## Details

The example uses the `MCPServerStdio` class from `agents.mcp`, with the command:

```bash
npx -y "@modelcontextprotocol/server-filesystem" <samples_directory>
```

It's only given access to the `sample_files` directory adjacent to the example, which contains some sample data.

Under the hood:

1. The server is spun up in a subprocess, and exposes a bunch of tools like `list_directory()`, `read_file()`, etc.
2. We add the server instance to the Agent via `mcp_agents`.
3. Each time the agent runs, we call out to the MCP server to fetch the list of tools via `server.list_tools()`.
4. If the LLM chooses to use an MCP tool, we call the MCP server to run the tool via `server.run_tool()`.

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ 4ed6ac46f7975a33671db58cf1dde22f038291fa

@@ -0,0 +1,26 @@

+# MCP Filesystem Example
+
+This example uses the [filesystem MCP server](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem), running locally via `npx`.
+
+Run it via:
+
+```
+uv run python examples/mcp/filesystem_example/main.py
+```
+
+## Details
+
+The example uses the `MCPServerStdio` class from `agents.mcp`, with the command:
+
+```bash
+npx -y "@modelcontextprotocol/server-filesystem" <samples_directory>
+```
+
+It's only given access to the `sample_files` directory adjacent to the example, which contains some sample data.
+
+Under the hood:
+
+1. The server is spun up in a subprocess, and exposes a bunch of tools like `list_directory()`, `read_file()`, etc.
+2. We add the server instance to the Agent via `mcp_agents`.
+3. Each time the agent runs, we call out to the MCP server to fetch the list of tools via `server.list_tools()`.
+4. If the LLM chooses to use an MCP tool, we call the MCP server to run the tool via `server.run_tool()`.
```

</details>
