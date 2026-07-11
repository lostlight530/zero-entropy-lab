PROVENANCE: {"confidence": 1.0, "entity_id": "doc_openai_openai_agents_python_examples_mcp_filesystem_example_readme_md_4ed6ac46f797", "primary_owner": "zero", "retrieved_at": "2026-07-11T06:08:45.618175+00:00", "source_path": "examples/mcp/filesystem_example/README.md", "source_repo": "openai/openai-agents-python", "source_sha": "4ed6ac46f7975a33671db58cf1dde22f038291fa"}

# Source Document

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


# Document Diff

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
