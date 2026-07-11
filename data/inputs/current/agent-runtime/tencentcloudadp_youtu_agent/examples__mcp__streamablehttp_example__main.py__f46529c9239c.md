PROVENANCE: {"confidence": 1.0, "entity_id": "doc_tencentcloudadp_youtu_agent_examples_mcp_streamablehttp_example_main_py_f46529c9239c", "primary_owner": "zero", "retrieved_at": "2026-07-11T06:09:06.018291+00:00", "source_path": "examples/mcp/streamablehttp_example/main.py", "source_repo": "TencentCloudADP/youtu-agent", "source_sha": "f46529c9239c88faded0f2174a628a98632a98c7"}

# Source Document

"""Example usage of MCP with streamable_http transport

- config: configs/agents/examples/mcp/streamablehttp_example.yaml

Usage:
    # run server
    python examples/mcp/streamablehttp_example/server.py
    # run the agent
    python examples/mcp/streamablehttp_example/main.py
"""

import asyncio

from utu.agents import SimpleAgent


async def main():
    queries = ("Add these numbers: 7 and 22.", "What's the weather in Shanghai?", "What's the secret word?")

    async with SimpleAgent(config="examples/mcp/streamablehttp_example.yaml") as agent:
        for query in queries:
            await agent.chat_streamed(query)


if __name__ == "__main__":
    asyncio.run(main())


# Document Diff

```diff
--- previous

+++ f46529c9239c88faded0f2174a628a98632a98c7

@@ -0,0 +1,26 @@

+"""Example usage of MCP with streamable_http transport
+
+- config: configs/agents/examples/mcp/streamablehttp_example.yaml
+
+Usage:
+    # run server
+    python examples/mcp/streamablehttp_example/server.py
+    # run the agent
+    python examples/mcp/streamablehttp_example/main.py
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
+    async with SimpleAgent(config="examples/mcp/streamablehttp_example.yaml") as agent:
+        for query in queries:
+            await agent.chat_streamed(query)
+
+
+if __name__ == "__main__":
+    asyncio.run(main())
```
