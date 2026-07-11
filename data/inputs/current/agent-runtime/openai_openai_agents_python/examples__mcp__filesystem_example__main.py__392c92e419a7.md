PROVENANCE: {"confidence": 1.0, "entity_id": "doc_openai_openai_agents_python_examples_mcp_filesystem_example_main_py_392c92e419a7", "primary_owner": "zero", "retrieved_at": "2026-07-11T06:08:45.746052+00:00", "source_path": "examples/mcp/filesystem_example/main.py", "source_repo": "openai/openai-agents-python", "source_sha": "392c92e419a7216a8684589682cee6f41104bb4b"}

# Source Document

import asyncio
import os
import shutil

from agents import Agent, Runner, gen_trace_id, trace
from agents.mcp import MCPServer, MCPServerStdio


async def run(mcp_server: MCPServer):
    agent = Agent(
        name="Assistant",
        instructions="Use the tools to read the filesystem and answer questions based on those files.",
        mcp_servers=[mcp_server],
    )

    # List the files it can read
    message = "Read the files and list them."
    print(f"Running: {message}")
    result = await Runner.run(starting_agent=agent, input=message)
    print(result.final_output)

    # Ask about books
    message = "Read favorite_books.txt and tell me my #1 favorite book."
    print(f"\n\nRunning: {message}")
    result = await Runner.run(starting_agent=agent, input=message)
    print(result.final_output)

    # Ask a question that reads then reasons.
    message = "Read favorite_songs.txt and suggest one new song that I might like."
    print(f"\n\nRunning: {message}")
    result = await Runner.run(starting_agent=agent, input=message)
    print(result.final_output)


async def main():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    samples_dir = os.path.join(current_dir, "sample_files")

    async with MCPServerStdio(
        name="Filesystem Server, via npx",
        params={
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-filesystem", samples_dir],
        },
    ) as server:
        trace_id = gen_trace_id()
        with trace(workflow_name="MCP Filesystem Example", trace_id=trace_id):
            print(f"View trace: https://platform.openai.com/traces/trace?trace_id={trace_id}\n")
            await run(server)


if __name__ == "__main__":
    # Let's make sure the user has npx installed
    if not shutil.which("npx"):
        raise RuntimeError("npx is not installed. Please install it with `npm install -g npx`.")

    asyncio.run(main())


# Document Diff

```diff
--- previous

+++ 392c92e419a7216a8684589682cee6f41104bb4b

@@ -0,0 +1,57 @@

+import asyncio
+import os
+import shutil
+
+from agents import Agent, Runner, gen_trace_id, trace
+from agents.mcp import MCPServer, MCPServerStdio
+
+
+async def run(mcp_server: MCPServer):
+    agent = Agent(
+        name="Assistant",
+        instructions="Use the tools to read the filesystem and answer questions based on those files.",
+        mcp_servers=[mcp_server],
+    )
+
+    # List the files it can read
+    message = "Read the files and list them."
+    print(f"Running: {message}")
+    result = await Runner.run(starting_agent=agent, input=message)
+    print(result.final_output)
+
+    # Ask about books
+    message = "Read favorite_books.txt and tell me my #1 favorite book."
+    print(f"\n\nRunning: {message}")
+    result = await Runner.run(starting_agent=agent, input=message)
+    print(result.final_output)
+
+    # Ask a question that reads then reasons.
+    message = "Read favorite_songs.txt and suggest one new song that I might like."
+    print(f"\n\nRunning: {message}")
+    result = await Runner.run(starting_agent=agent, input=message)
+    print(result.final_output)
+
+
+async def main():
+    current_dir = os.path.dirname(os.path.abspath(__file__))
+    samples_dir = os.path.join(current_dir, "sample_files")
+
+    async with MCPServerStdio(
+        name="Filesystem Server, via npx",
+        params={
+            "command": "npx",
+            "args": ["-y", "@modelcontextprotocol/server-filesystem", samples_dir],
+        },
+    ) as server:
+        trace_id = gen_trace_id()
+        with trace(workflow_name="MCP Filesystem Example", trace_id=trace_id):
+            print(f"View trace: https://platform.openai.com/traces/trace?trace_id={trace_id}\n")
+            await run(server)
+
+
+if __name__ == "__main__":
+    # Let's make sure the user has npx installed
+    if not shutil.which("npx"):
+        raise RuntimeError("npx is not installed. Please install it with `npm install -g npx`.")
+
+    asyncio.run(main())
```
