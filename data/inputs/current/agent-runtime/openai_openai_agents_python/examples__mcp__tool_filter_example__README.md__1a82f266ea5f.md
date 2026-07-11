PROVENANCE: {"confidence": 1.0, "entity_id": "doc_openai_openai_agents_python_examples_mcp_tool_filter_example_readme_md_1a82f266ea5f", "primary_owner": "zero", "retrieved_at": "2026-07-11T06:08:49.782918+00:00", "source_path": "examples/mcp/tool_filter_example/README.md", "source_repo": "openai/openai-agents-python", "source_sha": "1a82f266ea5ff9df9e30208e5950e21e4c648cd8"}

# Source Document

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


# Document Diff

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
