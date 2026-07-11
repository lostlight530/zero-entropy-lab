# openai/openai-agents-python · examples/mcp/filesystem_example/main.py

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [openai/openai-agents-python](https://github.com/openai/openai-agents-python) |
| 来源文件 | [examples/mcp/filesystem_example/main.py](https://github.com/openai/openai-agents-python/blob/392c92e419a7216a8684589682cee6f41104bb4b/examples/mcp/filesystem_example/main.py) |
| 来源版本 | `392c92e419a7216a8684589682cee6f41104bb4b` |
| 摄取时间 | `2026-07-11T06:08:45.746052+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_openai_openai_agents_python_examples_mcp_filesystem_example_main_py_392c92e419a7` |

## 本次变化

- 新增行数 `57`.
- 删除行数 `0`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- 未发现 Markdown 标题.

<details>
<summary>展开完整外部原文</summary>

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

</details>

<details>
<summary>展开完整版本差异</summary>

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

</details>
