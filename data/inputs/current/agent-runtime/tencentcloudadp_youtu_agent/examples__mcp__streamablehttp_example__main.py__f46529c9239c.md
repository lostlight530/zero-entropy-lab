# TencentCloudADP/youtu-agent · examples/mcp/streamablehttp_example/main.py

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [TencentCloudADP/youtu-agent](https://github.com/TencentCloudADP/youtu-agent) |
| 来源文件 | [examples/mcp/streamablehttp_example/main.py](https://github.com/TencentCloudADP/youtu-agent/blob/f46529c9239c88faded0f2174a628a98632a98c7/examples/mcp/streamablehttp_example/main.py) |
| 来源版本 | `f46529c9239c88faded0f2174a628a98632a98c7` |
| 摄取时间 | `2026-07-11T06:09:06.018291+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_tencentcloudadp_youtu_agent_examples_mcp_streamablehttp_example_main_py_f46529c9239c` |

## 本次变化

- 新增行数 `26`.
- 删除行数 `0`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- 未发现 Markdown 标题.

<details>
<summary>展开完整外部原文</summary>

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

</details>

<details>
<summary>展开完整版本差异</summary>

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

</details>
