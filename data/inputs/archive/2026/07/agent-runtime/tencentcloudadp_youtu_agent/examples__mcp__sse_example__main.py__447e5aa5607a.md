# TencentCloudADP/youtu-agent · examples/mcp/sse_example/main.py

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [TencentCloudADP/youtu-agent](https://github.com/TencentCloudADP/youtu-agent) |
| 来源文件 | [examples/mcp/sse_example/main.py](https://github.com/TencentCloudADP/youtu-agent/blob/447e5aa5607adab28ddee4433de01b7ba92572b5/examples/mcp/sse_example/main.py) |
| 来源版本 | `447e5aa5607adab28ddee4433de01b7ba92572b5` |
| 摄取时间 | `2026-07-11T06:09:05.607740+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_tencentcloudadp_youtu_agent_examples_mcp_sse_example_main_py_447e5aa5607a` |

## 本次变化

- 新增行数 `26`.
- 删除行数 `0`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- 未发现 Markdown 标题.

<details>
<summary>展开完整外部原文</summary>

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

</details>

<details>
<summary>展开完整版本差异</summary>

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

</details>
