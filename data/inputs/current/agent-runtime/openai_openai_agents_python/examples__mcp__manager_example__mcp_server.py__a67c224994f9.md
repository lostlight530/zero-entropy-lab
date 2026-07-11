PROVENANCE: {"confidence": 1.0, "entity_id": "doc_openai_openai_agents_python_examples_mcp_manager_example_mcp_server_py_a67c224994f9", "primary_owner": "zero", "retrieved_at": "2026-07-11T06:08:47.356744+00:00", "source_path": "examples/mcp/manager_example/mcp_server.py", "source_repo": "openai/openai-agents-python", "source_sha": "a67c224994f908f74d0b715f8112646322694d05"}

# Source Document

import os

from mcp.server.fastmcp import FastMCP

STREAMABLE_HTTP_HOST = os.getenv("STREAMABLE_HTTP_HOST", "127.0.0.1")
STREAMABLE_HTTP_PORT = int(os.getenv("STREAMABLE_HTTP_PORT", "8000"))

mcp = FastMCP(
    "FastAPI Example Server",
    host=STREAMABLE_HTTP_HOST,
    port=STREAMABLE_HTTP_PORT,
)


@mcp.tool()
def add(a: int, b: int) -> int:
    return a + b


@mcp.tool()
def echo(message: str) -> str:
    return f"echo: {message}"


if __name__ == "__main__":
    mcp.run(transport="streamable-http")


# Document Diff

```diff
--- previous

+++ a67c224994f908f74d0b715f8112646322694d05

@@ -0,0 +1,26 @@

+import os
+
+from mcp.server.fastmcp import FastMCP
+
+STREAMABLE_HTTP_HOST = os.getenv("STREAMABLE_HTTP_HOST", "127.0.0.1")
+STREAMABLE_HTTP_PORT = int(os.getenv("STREAMABLE_HTTP_PORT", "8000"))
+
+mcp = FastMCP(
+    "FastAPI Example Server",
+    host=STREAMABLE_HTTP_HOST,
+    port=STREAMABLE_HTTP_PORT,
+)
+
+
+@mcp.tool()
+def add(a: int, b: int) -> int:
+    return a + b
+
+
+@mcp.tool()
+def echo(message: str) -> str:
+    return f"echo: {message}"
+
+
+if __name__ == "__main__":
+    mcp.run(transport="streamable-http")
```
