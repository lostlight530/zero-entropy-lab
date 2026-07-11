# openai/openai-agents-python · examples/basic/remote_image.py

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [openai/openai-agents-python](https://github.com/openai/openai-agents-python) |
| 来源文件 | [examples/basic/remote_image.py](https://github.com/openai/openai-agents-python/blob/e4c43e4dc283d87a2e934a9dc92cf7c326028535/examples/basic/remote_image.py) |
| 来源版本 | `e4c43e4dc283d87a2e934a9dc92cf7c326028535` |
| 摄取时间 | `2026-07-11T06:08:44.153832+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_openai_openai_agents_python_examples_basic_remote_image_py_e4c43e4dc283` |

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

URL = "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=400&q=80"


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
                "content": [{"type": "input_image", "detail": "auto", "image_url": URL}],
            },
            {
                "role": "user",
                "content": "What do you see in this image?",
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

+++ e4c43e4dc283d87a2e934a9dc92cf7c326028535

@@ -0,0 +1,31 @@

+import asyncio
+
+from agents import Agent, Runner
+
+URL = "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=400&q=80"
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
+                "content": [{"type": "input_image", "detail": "auto", "image_url": URL}],
+            },
+            {
+                "role": "user",
+                "content": "What do you see in this image?",
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
