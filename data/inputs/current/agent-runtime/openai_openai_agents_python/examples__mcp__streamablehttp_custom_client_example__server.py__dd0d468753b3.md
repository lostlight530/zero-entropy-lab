PROVENANCE: {"confidence": 1.0, "entity_id": "doc_openai_openai_agents_python_examples_mcp_streamablehttp_custom_client_example_server_py_dd0d468753b3", "primary_owner": "zero", "retrieved_at": "2026-07-11T06:08:49.259538+00:00", "source_path": "examples/mcp/streamablehttp_custom_client_example/server.py", "source_repo": "openai/openai-agents-python", "source_sha": "dd0d468753b3ace313789a878db5f3e13cd3a6d4"}

# Source Document

import os
import random

from mcp.server.fastmcp import FastMCP

STREAMABLE_HTTP_HOST = os.getenv("STREAMABLE_HTTP_HOST", "127.0.0.1")
STREAMABLE_HTTP_PORT = int(os.getenv("STREAMABLE_HTTP_PORT", "18080"))

# Create server
mcp = FastMCP("Echo Server", host=STREAMABLE_HTTP_HOST, port=STREAMABLE_HTTP_PORT)


@mcp.tool()
def add(a: int, b: int) -> int:
    """Add two numbers"""
    print(f"[debug-server] add({a}, {b})")
    return a + b


@mcp.tool()
def get_secret_word() -> str:
    print("[debug-server] get_secret_word()")
    return random.choice(["apple", "banana", "cherry"])


if __name__ == "__main__":
    mcp.run(transport="streamable-http")


# Document Diff

```diff
--- previous

+++ dd0d468753b3ace313789a878db5f3e13cd3a6d4

@@ -0,0 +1,27 @@

+import os
+import random
+
+from mcp.server.fastmcp import FastMCP
+
+STREAMABLE_HTTP_HOST = os.getenv("STREAMABLE_HTTP_HOST", "127.0.0.1")
+STREAMABLE_HTTP_PORT = int(os.getenv("STREAMABLE_HTTP_PORT", "18080"))
+
+# Create server
+mcp = FastMCP("Echo Server", host=STREAMABLE_HTTP_HOST, port=STREAMABLE_HTTP_PORT)
+
+
+@mcp.tool()
+def add(a: int, b: int) -> int:
+    """Add two numbers"""
+    print(f"[debug-server] add({a}, {b})")
+    return a + b
+
+
+@mcp.tool()
+def get_secret_word() -> str:
+    print("[debug-server] get_secret_word()")
+    return random.choice(["apple", "banana", "cherry"])
+
+
+if __name__ == "__main__":
+    mcp.run(transport="streamable-http")
```
