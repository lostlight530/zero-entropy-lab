PROVENANCE: {"confidence": 1.0, "entity_id": "doc_openai_openai_agents_python_examples_mcp_sse_example_server_py_075137fe0301", "primary_owner": "zero", "retrieved_at": "2026-07-11T06:08:48.346874+00:00", "source_path": "examples/mcp/sse_example/server.py", "source_repo": "openai/openai-agents-python", "source_sha": "075137fe03016ea6a3856730d774859246b0c05e"}

# Source Document

import os
import random

from mcp.server.fastmcp import FastMCP

SSE_HOST = os.getenv("SSE_HOST", "127.0.0.1")
SSE_PORT = int(os.getenv("SSE_PORT", "8000"))

# Create server
mcp = FastMCP("Echo Server", host=SSE_HOST, port=SSE_PORT)


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
    # Keep tool output deterministic so this example is stable in CI and offline environments.
    weather_by_city = {
        "tokyo": "sunny with a light breeze and 20°C",
        "san francisco": "cool and foggy with 14°C",
        "new york": "partly cloudy with 18°C",
    }
    forecast = weather_by_city.get(city.strip().lower())
    if forecast:
        return f"The weather in {city} is {forecast}."
    return f"The weather data for {city} is unavailable in this demo."


if __name__ == "__main__":
    mcp.run(transport="sse")


# Document Diff

```diff
--- previous

+++ 075137fe03016ea6a3856730d774859246b0c05e

@@ -0,0 +1,42 @@

+import os
+import random
+
+from mcp.server.fastmcp import FastMCP
+
+SSE_HOST = os.getenv("SSE_HOST", "127.0.0.1")
+SSE_PORT = int(os.getenv("SSE_PORT", "8000"))
+
+# Create server
+mcp = FastMCP("Echo Server", host=SSE_HOST, port=SSE_PORT)
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
+    # Keep tool output deterministic so this example is stable in CI and offline environments.
+    weather_by_city = {
+        "tokyo": "sunny with a light breeze and 20°C",
+        "san francisco": "cool and foggy with 14°C",
+        "new york": "partly cloudy with 18°C",
+    }
+    forecast = weather_by_city.get(city.strip().lower())
+    if forecast:
+        return f"The weather in {city} is {forecast}."
+    return f"The weather data for {city} is unavailable in this demo."
+
+
+if __name__ == "__main__":
+    mcp.run(transport="sse")
```
