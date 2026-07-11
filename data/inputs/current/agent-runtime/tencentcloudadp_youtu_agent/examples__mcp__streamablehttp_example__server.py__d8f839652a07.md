PROVENANCE: {"confidence": 1.0, "entity_id": "doc_tencentcloudadp_youtu_agent_examples_mcp_streamablehttp_example_server_py_d8f839652a07", "primary_owner": "zero", "retrieved_at": "2026-07-11T06:09:06.148924+00:00", "source_path": "examples/mcp/streamablehttp_example/server.py", "source_repo": "TencentCloudADP/youtu-agent", "source_sha": "d8f839652a07608c21909c94f3217b9ce20e3787"}

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
    mcp.run(transport="streamable-http")


# Document Diff

```diff
--- previous

+++ d8f839652a07608c21909c94f3217b9ce20e3787

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
+    mcp.run(transport="streamable-http")
```
