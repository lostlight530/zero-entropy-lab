PROVENANCE: {"confidence": 1.0, "entity_id": "doc_openai_openai_agents_python_examples_mcp_git_example_main_py_8a62744d186f", "primary_owner": "zero", "retrieved_at": "2026-07-11T06:08:46.999425+00:00", "source_path": "examples/mcp/git_example/main.py", "source_repo": "openai/openai-agents-python", "source_sha": "8a62744d186f6d5cd3075c52cd2bdcefa68d5839"}

# Source Document

import asyncio
import shutil

from agents import Agent, Runner, trace
from agents.mcp import MCPServer, MCPServerStdio
from examples.auto_mode import input_with_fallback


async def run(mcp_server: MCPServer, directory_path: str):
    agent = Agent(
        name="Assistant",
        instructions=f"Answer questions about the git repository at {directory_path}, use that for repo_path",
        mcp_servers=[mcp_server],
    )

    message = "Who's the most frequent contributor?"
    print("\n" + "-" * 40)
    print(f"Running: {message}")
    result = await Runner.run(starting_agent=agent, input=message)
    print(result.final_output)

    message = "Summarize the last change in the repository."
    print("\n" + "-" * 40)
    print(f"Running: {message}")
    result = await Runner.run(starting_agent=agent, input=message)
    print(result.final_output)


async def main():
    # Ask the user for the directory path
    directory_path = input_with_fallback(
        "Please enter the path to the git repository: ",
        ".",
    )

    async with MCPServerStdio(
        cache_tools_list=True,  # Cache the tools list, for demonstration
        params={"command": "uvx", "args": ["mcp-server-git"]},
    ) as server:
        with trace(workflow_name="MCP Git Example"):
            await run(server, directory_path)


if __name__ == "__main__":
    if not shutil.which("uvx"):
        raise RuntimeError("uvx is not installed. Please install it with `pip install uvx`.")

    asyncio.run(main())


# Document Diff

```diff
--- previous

+++ 8a62744d186f6d5cd3075c52cd2bdcefa68d5839

@@ -0,0 +1,48 @@

+import asyncio
+import shutil
+
+from agents import Agent, Runner, trace
+from agents.mcp import MCPServer, MCPServerStdio
+from examples.auto_mode import input_with_fallback
+
+
+async def run(mcp_server: MCPServer, directory_path: str):
+    agent = Agent(
+        name="Assistant",
+        instructions=f"Answer questions about the git repository at {directory_path}, use that for repo_path",
+        mcp_servers=[mcp_server],
+    )
+
+    message = "Who's the most frequent contributor?"
+    print("\n" + "-" * 40)
+    print(f"Running: {message}")
+    result = await Runner.run(starting_agent=agent, input=message)
+    print(result.final_output)
+
+    message = "Summarize the last change in the repository."
+    print("\n" + "-" * 40)
+    print(f"Running: {message}")
+    result = await Runner.run(starting_agent=agent, input=message)
+    print(result.final_output)
+
+
+async def main():
+    # Ask the user for the directory path
+    directory_path = input_with_fallback(
+        "Please enter the path to the git repository: ",
+        ".",
+    )
+
+    async with MCPServerStdio(
+        cache_tools_list=True,  # Cache the tools list, for demonstration
+        params={"command": "uvx", "args": ["mcp-server-git"]},
+    ) as server:
+        with trace(workflow_name="MCP Git Example"):
+            await run(server, directory_path)
+
+
+if __name__ == "__main__":
+    if not shutil.which("uvx"):
+        raise RuntimeError("uvx is not installed. Please install it with `pip install uvx`.")
+
+    asyncio.run(main())
```
