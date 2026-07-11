PROVENANCE: {"confidence": 1.0, "entity_id": "doc_openai_openai_agents_python_examples_mcp_get_all_mcp_tools_example_readme_md_2e1dc021fa6b", "primary_owner": "zero", "retrieved_at": "2026-07-11T06:08:46.267930+00:00", "source_path": "examples/mcp/get_all_mcp_tools_example/README.md", "source_repo": "openai/openai-agents-python", "source_sha": "2e1dc021fa6be23016627ae2797f68fbb2a53f72"}

# Source Document

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


# Document Diff

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
