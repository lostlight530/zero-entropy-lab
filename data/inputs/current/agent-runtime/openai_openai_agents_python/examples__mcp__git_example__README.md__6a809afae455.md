PROVENANCE: {"confidence": 1.0, "entity_id": "doc_openai_openai_agents_python_examples_mcp_git_example_readme_md_6a809afae455", "primary_owner": "zero", "retrieved_at": "2026-07-11T06:08:46.847930+00:00", "source_path": "examples/mcp/git_example/README.md", "source_repo": "openai/openai-agents-python", "source_sha": "6a809afae455ec354ac767e29e9865bf3cc6dc8a"}

# Source Document

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


# Document Diff

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
