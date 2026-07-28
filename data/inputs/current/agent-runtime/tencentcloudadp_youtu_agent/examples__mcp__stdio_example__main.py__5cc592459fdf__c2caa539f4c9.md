# TencentCloudADP/youtu-agent · examples/mcp/stdio_example/main.py

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [TencentCloudADP/youtu-agent](https://github.com/TencentCloudADP/youtu-agent) |
| 来源文件 | [examples/mcp/stdio_example/main.py](https://github.com/TencentCloudADP/youtu-agent/blob/c2caa539f4c95ae1c39ed24dc8a99cb3651e1d5d/examples/mcp/stdio_example/main.py) |
| 来源版本 | `c2caa539f4c95ae1c39ed24dc8a99cb3651e1d5d` |
| 来源目录 Tree | `6b428218ed42677c837c8b9c4e73257a88820407` |
| 来源内容 Blob | `5cc592459fdf6b7ef5915c4bc668583013446bd7` |
| 摄取时间 | `2026-07-28T07:53:04.805289+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_tencentcloudadp_youtu_agent_examples_mcp_stdio_example_main_py_5cc592459fdf` |

## 本次变化

- 新增行数 `40`.
- 删除行数 `0`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- from https://en.wikipedia.org/wiki/Anthropic

<details>
<summary>展开完整外部原文</summary>

"""Example usage of MCP with stdio transport

- config: configs/agents/examples/mcp/stdio_example.yaml
- env: MCP_MEMORY_FILE_PATH

Usage:
    python examples/mcp/stdio_example/main.py
"""

import asyncio

from utu.agents import SimpleAgent

# from https://en.wikipedia.org/wiki/Anthropic
DOC = """Anthropic PBC is an American artificial intelligence (AI) startup company founded in 2021.
 Anthropic has developed a family of large language models (LLMs) named Claude as a competitor to OpenAI's ChatGPT
 and Google's Gemini.[5] According to the company, it researches and develops AI to "study their safety properties
 at the technological frontier" and use this research to deploy safe models for the public.[6][7]

Anthropic was founded by former members of OpenAI, including siblings Daniela Amodei and Dario Amodei.[8]
 In September 2023, Amazon announced an investment of up to $4 billion, followed by a $2 billion commitment
 from Google in the following month.[9][10][11]"""
queries = [
    "What's the current time?",
    f"Add memory: {DOC}",
    "Who are the founders of Anthropic?",
]


async def main():
    async with SimpleAgent(
        config="examples/mcp/stdio_example",
        name="mcp_stdio_example",
    ) as agent:
        for query in queries:
            await agent.chat_streamed(query)


if __name__ == "__main__":
    asyncio.run(main())

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ 5cc592459fdf6b7ef5915c4bc668583013446bd7

@@ -0,0 +1,40 @@

+"""Example usage of MCP with stdio transport
+
+- config: configs/agents/examples/mcp/stdio_example.yaml
+- env: MCP_MEMORY_FILE_PATH
+
+Usage:
+    python examples/mcp/stdio_example/main.py
+"""
+
+import asyncio
+
+from utu.agents import SimpleAgent
+
+# from https://en.wikipedia.org/wiki/Anthropic
+DOC = """Anthropic PBC is an American artificial intelligence (AI) startup company founded in 2021.
+ Anthropic has developed a family of large language models (LLMs) named Claude as a competitor to OpenAI's ChatGPT
+ and Google's Gemini.[5] According to the company, it researches and develops AI to "study their safety properties
+ at the technological frontier" and use this research to deploy safe models for the public.[6][7]
+
+Anthropic was founded by former members of OpenAI, including siblings Daniela Amodei and Dario Amodei.[8]
+ In September 2023, Amazon announced an investment of up to $4 billion, followed by a $2 billion commitment
+ from Google in the following month.[9][10][11]"""
+queries = [
+    "What's the current time?",
+    f"Add memory: {DOC}",
+    "Who are the founders of Anthropic?",
+]
+
+
+async def main():
+    async with SimpleAgent(
+        config="examples/mcp/stdio_example",
+        name="mcp_stdio_example",
+    ) as agent:
+        for query in queries:
+            await agent.chat_streamed(query)
+
+
+if __name__ == "__main__":
+    asyncio.run(main())
```

</details>
