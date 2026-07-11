PROVENANCE: {"confidence": 1.0, "entity_id": "doc_openai_openai_agents_python_examples_mcp_streamablehttp_example_server_py_d73ab895b6aa", "primary_owner": "zero", "retrieved_at": "2026-07-11T06:08:49.641668+00:00", "source_path": "examples/mcp/streamablehttp_example/server.py", "source_repo": "openai/openai-agents-python", "source_sha": "d73ab895b6aa264b2cbe02834bdac6fe92e523d9"}

# Source Document

import os
import random

import requests
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


@mcp.tool()
def get_current_weather(city: str) -> str:
    print(f"[debug-server] get_current_weather({city})")
    # Avoid slow or flaky network calls during automated runs.
    try:
        endpoint = "https://wttr.in"
        response = requests.get(f"{endpoint}/{city}", timeout=2)
        if response.ok:
            return response.text
    except Exception:
        pass
    # Fallback keeps the tool responsive even when offline.
    return f"Weather data unavailable right now; assume clear skies in {city}."


if __name__ == "__main__":
    mcp.run(transport="streamable-http")


# Document Diff

```diff
--- previous

+++ d73ab895b6aa264b2cbe02834bdac6fe92e523d9

@@ -0,0 +1,43 @@

+import os
+import random
+
+import requests
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
+@mcp.tool()
+def get_current_weather(city: str) -> str:
+    print(f"[debug-server] get_current_weather({city})")
+    # Avoid slow or flaky network calls during automated runs.
+    try:
+        endpoint = "https://wttr.in"
+        response = requests.get(f"{endpoint}/{city}", timeout=2)
+        if response.ok:
+            return response.text
+    except Exception:
+        pass
+    # Fallback keeps the tool responsive even when offline.
+    return f"Weather data unavailable right now; assume clear skies in {city}."
+
+
+if __name__ == "__main__":
+    mcp.run(transport="streamable-http")
```
