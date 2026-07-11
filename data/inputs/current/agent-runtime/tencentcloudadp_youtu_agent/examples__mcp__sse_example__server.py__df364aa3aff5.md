PROVENANCE: {"confidence": 1.0, "entity_id": "doc_tencentcloudadp_youtu_agent_examples_mcp_sse_example_server_py_df364aa3aff5", "primary_owner": "zero", "retrieved_at": "2026-07-11T06:09:05.741290+00:00", "source_path": "examples/mcp/sse_example/server.py", "source_repo": "TencentCloudADP/youtu-agent", "source_sha": "df364aa3aff51eb3ebdf0a512528c618ad91c951"}

# Source Document

import random

import requests
from mcp.server.fastmcp import FastMCP

# Create server
mcp = FastMCP("Echo Server")


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

    endpoint = "https://wttr.in"
    response = requests.get(f"{endpoint}/{city}")
    return response.text


if __name__ == "__main__":
    mcp.run(transport="sse")


# Document Diff

```diff
--- previous

+++ df364aa3aff51eb3ebdf0a512528c618ad91c951

@@ -0,0 +1,33 @@

+import random
+
+import requests
+from mcp.server.fastmcp import FastMCP
+
+# Create server
+mcp = FastMCP("Echo Server")
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
+
+    endpoint = "https://wttr.in"
+    response = requests.get(f"{endpoint}/{city}")
+    return response.text
+
+
+if __name__ == "__main__":
+    mcp.run(transport="sse")
```
