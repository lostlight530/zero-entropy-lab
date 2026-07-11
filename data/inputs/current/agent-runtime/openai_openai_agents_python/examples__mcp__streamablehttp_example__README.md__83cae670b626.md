PROVENANCE: {"confidence": 1.0, "entity_id": "doc_openai_openai_agents_python_examples_mcp_streamablehttp_example_readme_md_83cae670b626", "primary_owner": "zero", "retrieved_at": "2026-07-11T06:08:49.376051+00:00", "source_path": "examples/mcp/streamablehttp_example/README.md", "source_repo": "openai/openai-agents-python", "source_sha": "83cae670b626edd8fe42d2f4890abcd85c148f86"}

# Source Document

# MCP Streamable HTTP Example

This example uses a local Streamable HTTP server in [server.py](server.py).

Run the example via:

```
uv run python examples/mcp/streamablehttp_example/main.py
```

## Details

The example uses the `MCPServerStreamableHttp` class from `agents.mcp`. The script picks an open localhost port automatically (or honors `STREAMABLE_HTTP_PORT` if you set it) and starts the server at `http://<host>:<port>/mcp`. Set `STREAMABLE_HTTP_HOST` if you need a different bind address.


# Document Diff

```diff
--- previous

+++ 83cae670b626edd8fe42d2f4890abcd85c148f86

@@ -0,0 +1,13 @@

+# MCP Streamable HTTP Example
+
+This example uses a local Streamable HTTP server in [server.py](server.py).
+
+Run the example via:
+
+```
+uv run python examples/mcp/streamablehttp_example/main.py
+```
+
+## Details
+
+The example uses the `MCPServerStreamableHttp` class from `agents.mcp`. The script picks an open localhost port automatically (or honors `STREAMABLE_HTTP_PORT` if you set it) and starts the server at `http://<host>:<port>/mcp`. Set `STREAMABLE_HTTP_HOST` if you need a different bind address.
```
