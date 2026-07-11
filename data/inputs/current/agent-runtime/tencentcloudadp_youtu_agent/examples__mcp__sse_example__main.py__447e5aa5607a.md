PROVENANCE: {"confidence": 1.0, "entity_id": "doc_tencentcloudadp_youtu_agent_examples_mcp_sse_example_main_py_447e5aa5607a", "primary_owner": "zero", "retrieved_at": "2026-07-11T06:09:05.607740+00:00", "source_path": "examples/mcp/sse_example/main.py", "source_repo": "TencentCloudADP/youtu-agent", "source_sha": "447e5aa5607adab28ddee4433de01b7ba92572b5"}

# Source Document

"""Example usage of MCP with SSE transport

- config: configs/agents/examples/mcp/sse_example.yaml

Usage:
    # run server
    python examples/mcp/sse_example/server.py
    # run the agent
    python examples/mcp/sse_example/main.py
"""

import asyncio

from utu.agents import SimpleAgent


async def main():
    queries = ("Add these numbers: 7 and 22.", "What's the weather in Shanghai?", "What's the secret word?")

    async with SimpleAgent(config="examples/mcp/sse_example.yaml") as agent:
        for query in queries:
            await agent.chat_streamed(query)


if __name__ == "__main__":
    asyncio.run(main())


# Document Diff

```diff
--- previous

+++ 447e5aa5607adab28ddee4433de01b7ba92572b5

@@ -0,0 +1,26 @@

+"""Example usage of MCP with SSE transport
+
+- config: configs/agents/examples/mcp/sse_example.yaml
+
+Usage:
+    # run server
+    python examples/mcp/sse_example/server.py
+    # run the agent
+    python examples/mcp/sse_example/main.py
+"""
+
+import asyncio
+
+from utu.agents import SimpleAgent
+
+
+async def main():
+    queries = ("Add these numbers: 7 and 22.", "What's the weather in Shanghai?", "What's the secret word?")
+
+    async with SimpleAgent(config="examples/mcp/sse_example.yaml") as agent:
+        for query in queries:
+            await agent.chat_streamed(query)
+
+
+if __name__ == "__main__":
+    asyncio.run(main())
```
