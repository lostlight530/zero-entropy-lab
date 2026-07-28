# openai/openai-agents-python · examples/basic/remote_pdf.py

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [openai/openai-agents-python](https://github.com/openai/openai-agents-python) |
| 来源文件 | [examples/basic/remote_pdf.py](https://github.com/openai/openai-agents-python/blob/da425faa06387bba1e04a2d118caa94148317cf1/examples/basic/remote_pdf.py) |
| 来源版本 | `da425faa06387bba1e04a2d118caa94148317cf1` |
| 摄取时间 | `2026-07-11T06:08:44.300077+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_openai_openai_agents_python_examples_basic_remote_pdf_py_da425faa0638` |

## 本次变化

- 新增行数 `31`.
- 删除行数 `0`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- 未发现 Markdown 标题.

<details>
<summary>展开完整外部原文</summary>

import asyncio

from agents import Agent, Runner

URL = "https://www.berkshirehathaway.com/letters/2024ltr.pdf"


async def main():
    agent = Agent(
        name="Assistant",
        instructions="You are a helpful assistant.",
    )

    result = await Runner.run(
        agent,
        [
            {
                "role": "user",
                "content": [{"type": "input_file", "file_url": URL}],
            },
            {
                "role": "user",
                "content": "Can you summarize the letter?",
            },
        ],
    )
    print(result.final_output)


if __name__ == "__main__":
    asyncio.run(main())

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ da425faa06387bba1e04a2d118caa94148317cf1

@@ -0,0 +1,31 @@

+import asyncio
+
+from agents import Agent, Runner
+
+URL = "https://www.berkshirehathaway.com/letters/2024ltr.pdf"
+
+
+async def main():
+    agent = Agent(
+        name="Assistant",
+        instructions="You are a helpful assistant.",
+    )
+
+    result = await Runner.run(
+        agent,
+        [
+            {
+                "role": "user",
+                "content": [{"type": "input_file", "file_url": URL}],
+            },
+            {
+                "role": "user",
+                "content": "Can you summarize the letter?",
+            },
+        ],
+    )
+    print(result.final_output)
+
+
+if __name__ == "__main__":
+    asyncio.run(main())
```

</details>
