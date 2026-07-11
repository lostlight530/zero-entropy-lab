# openai/openai-agents-python · examples/basic/local_file.py

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [openai/openai-agents-python](https://github.com/openai/openai-agents-python) |
| 来源文件 | [examples/basic/local_file.py](https://github.com/openai/openai-agents-python/blob/a261ff5c85a09a71a6d74cba162923ef9f263bb8/examples/basic/local_file.py) |
| 来源版本 | `a261ff5c85a09a71a6d74cba162923ef9f263bb8` |
| 摄取时间 | `2026-07-11T06:08:43.020495+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_openai_openai_agents_python_examples_basic_local_file_py_a261ff5c85a0` |

## 本次变化

- 新增行数 `45`.
- 删除行数 `0`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- 未发现 Markdown 标题.

<details>
<summary>展开完整外部原文</summary>

import asyncio
import base64
import os

from agents import Agent, Runner

FILEPATH = os.path.join(os.path.dirname(__file__), "media/partial_o3-and-o4-mini-system-card.pdf")


def file_to_base64(file_path: str) -> str:
    with open(file_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")


async def main():
    agent = Agent(
        name="Assistant",
        instructions="You are a helpful assistant.",
    )

    b64_file = file_to_base64(FILEPATH)
    result = await Runner.run(
        agent,
        [
            {
                "role": "user",
                "content": [
                    {
                        "type": "input_file",
                        "file_data": f"data:application/pdf;base64,{b64_file}",
                        "filename": "partial_o3-and-o4-mini-system-card.pdf",
                    }
                ],
            },
            {
                "role": "user",
                "content": "What is the first sentence of the introduction?",
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

+++ a261ff5c85a09a71a6d74cba162923ef9f263bb8

@@ -0,0 +1,45 @@

+import asyncio
+import base64
+import os
+
+from agents import Agent, Runner
+
+FILEPATH = os.path.join(os.path.dirname(__file__), "media/partial_o3-and-o4-mini-system-card.pdf")
+
+
+def file_to_base64(file_path: str) -> str:
+    with open(file_path, "rb") as f:
+        return base64.b64encode(f.read()).decode("utf-8")
+
+
+async def main():
+    agent = Agent(
+        name="Assistant",
+        instructions="You are a helpful assistant.",
+    )
+
+    b64_file = file_to_base64(FILEPATH)
+    result = await Runner.run(
+        agent,
+        [
+            {
+                "role": "user",
+                "content": [
+                    {
+                        "type": "input_file",
+                        "file_data": f"data:application/pdf;base64,{b64_file}",
+                        "filename": "partial_o3-and-o4-mini-system-card.pdf",
+                    }
+                ],
+            },
+            {
+                "role": "user",
+                "content": "What is the first sentence of the introduction?",
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
