# openai/openai-agents-python · examples/mcp/git_example/README.md

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [openai/openai-agents-python](https://github.com/openai/openai-agents-python) |
| 来源文件 | [examples/mcp/git_example/README.md](https://github.com/openai/openai-agents-python/blob/6a809afae455ec354ac767e29e9865bf3cc6dc8a/examples/mcp/git_example/README.md) |
| 来源版本 | `6a809afae455ec354ac767e29e9865bf3cc6dc8a` |
| 摄取时间 | `2026-07-11T06:08:46.847930+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_openai_openai_agents_python_examples_mcp_git_example_readme_md_6a809afae455` |

## 本次变化

- 新增行数 `26`.
- 删除行数 `0`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- MCP Git Example
- Details

<details>
<summary>展开完整外部原文</summary>

# MCP Git Example

This example uses the [git MCP server](https://github.com/modelcontextprotocol/servers/tree/main/src/git), running locally via `uvx`.

Run it via:

```
uv run python examples/mcp/git_example/main.py
```

## Details

The example uses the `MCPServerStdio` class from `agents.mcp`, with the command:

```bash
uvx mcp-server-git
```

Prior to running the agent, the user is prompted to provide a local directory path to their git repo. Using that, the Agent can invoke Git MCP tools like `git_log` to inspect the git commit log.

Under the hood:

1. The server is spun up in a subprocess, and exposes a bunch of tools like `git_log()`
2. We add the server instance to the Agent via `mcp_agents`.
3. Each time the agent runs, we call out to the MCP server to fetch the list of tools via `server.list_tools()`. The result is cached.
4. If the LLM chooses to use an MCP tool, we call the MCP server to run the tool via `server.run_tool()`.

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ 6a809afae455ec354ac767e29e9865bf3cc6dc8a

@@ -0,0 +1,26 @@

+# MCP Git Example
+
+This example uses the [git MCP server](https://github.com/modelcontextprotocol/servers/tree/main/src/git), running locally via `uvx`.
+
+Run it via:
+
+```
+uv run python examples/mcp/git_example/main.py
+```
+
+## Details
+
+The example uses the `MCPServerStdio` class from `agents.mcp`, with the command:
+
+```bash
+uvx mcp-server-git
+```
+
+Prior to running the agent, the user is prompted to provide a local directory path to their git repo. Using that, the Agent can invoke Git MCP tools like `git_log` to inspect the git commit log.
+
+Under the hood:
+
+1. The server is spun up in a subprocess, and exposes a bunch of tools like `git_log()`
+2. We add the server instance to the Agent via `mcp_agents`.
+3. Each time the agent runs, we call out to the MCP server to fetch the list of tools via `server.list_tools()`. The result is cached.
+4. If the LLM chooses to use an MCP tool, we call the MCP server to run the tool via `server.run_tool()`.
```

</details>
