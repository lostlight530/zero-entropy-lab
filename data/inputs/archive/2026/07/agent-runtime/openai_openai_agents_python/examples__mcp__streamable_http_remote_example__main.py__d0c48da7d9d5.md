# openai/openai-agents-python · examples/mcp/streamable_http_remote_example/main.py

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [openai/openai-agents-python](https://github.com/openai/openai-agents-python) |
| 来源文件 | [examples/mcp/streamable_http_remote_example/main.py](https://github.com/openai/openai-agents-python/blob/d0c48da7d9d5e0e31cf9f71e2c4c864db3d40f67/examples/mcp/streamable_http_remote_example/main.py) |
| 来源版本 | `d0c48da7d9d5e0e31cf9f71e2c4c864db3d40f67` |
| 摄取时间 | `2026-07-11T06:08:48.855380+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_openai_openai_agents_python_examples_mcp_streamable_http_remote_example_main_py_d0c48da7d9d5` |

## 本次变化

- 新增行数 `38`.
- 删除行数 `0`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- 未发现 Markdown 标题.

<details>
<summary>展开完整外部原文</summary>

import asyncio

from agents import Agent, Runner, gen_trace_id, trace
from agents.mcp import MCPServerStreamableHttp


async def main():
    async with MCPServerStreamableHttp(
        name="DeepWiki MCP Streamable HTTP Server",
        params={
            "url": "https://mcp.deepwiki.com/mcp",
            # Allow more time for remote tool responses.
            "timeout": 15,
            "sse_read_timeout": 300,
        },
        # Retry slow/unstable remote calls a couple of times.
        max_retry_attempts=2,
        retry_backoff_seconds_base=2.0,
        client_session_timeout_seconds=15,
    ) as server:
        agent = Agent(
            name="DeepWiki Assistant",
            instructions="Use the tools to respond to user requests.",
            mcp_servers=[server],
        )

        trace_id = gen_trace_id()
        with trace(workflow_name="DeepWiki Streamable HTTP Example", trace_id=trace_id):
            print(f"View trace: https://platform.openai.com/traces/trace?trace_id={trace_id}\n")
            result = await Runner.run(
                agent,
                "For the repository openai/codex, tell me the primary programming language.",
            )
            print(result.final_output)


if __name__ == "__main__":
    asyncio.run(main())

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ d0c48da7d9d5e0e31cf9f71e2c4c864db3d40f67

@@ -0,0 +1,38 @@

+import asyncio
+
+from agents import Agent, Runner, gen_trace_id, trace
+from agents.mcp import MCPServerStreamableHttp
+
+
+async def main():
+    async with MCPServerStreamableHttp(
+        name="DeepWiki MCP Streamable HTTP Server",
+        params={
+            "url": "https://mcp.deepwiki.com/mcp",
+            # Allow more time for remote tool responses.
+            "timeout": 15,
+            "sse_read_timeout": 300,
+        },
+        # Retry slow/unstable remote calls a couple of times.
+        max_retry_attempts=2,
+        retry_backoff_seconds_base=2.0,
+        client_session_timeout_seconds=15,
+    ) as server:
+        agent = Agent(
+            name="DeepWiki Assistant",
+            instructions="Use the tools to respond to user requests.",
+            mcp_servers=[server],
+        )
+
+        trace_id = gen_trace_id()
+        with trace(workflow_name="DeepWiki Streamable HTTP Example", trace_id=trace_id):
+            print(f"View trace: https://platform.openai.com/traces/trace?trace_id={trace_id}\n")
+            result = await Runner.run(
+                agent,
+                "For the repository openai/codex, tell me the primary programming language.",
+            )
+            print(result.final_output)
+
+
+if __name__ == "__main__":
+    asyncio.run(main())
```

</details>
