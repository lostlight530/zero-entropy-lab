# openai/openai-agents-python · examples/basic/local_image.py

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [openai/openai-agents-python](https://github.com/openai/openai-agents-python) |
| 来源文件 | [examples/basic/local_image.py](https://github.com/openai/openai-agents-python/blob/d4a784ba2991c652505b133c40bfd4ef913fd6d8/examples/basic/local_image.py) |
| 来源版本 | `d4a784ba2991c652505b133c40bfd4ef913fd6d8` |
| 摄取时间 | `2026-07-11T06:08:43.193575+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_openai_openai_agents_python_examples_basic_local_image_py_d4a784ba2991` |

## 本次变化

- 新增行数 `48`.
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

FILEPATH = os.path.join(os.path.dirname(__file__), "media/image_bison.jpg")


def image_to_base64(image_path):
    with open(image_path, "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read()).decode("utf-8")
    return encoded_string


async def main():
    # Print base64-encoded image
    b64_image = image_to_base64(FILEPATH)

    agent = Agent(
        name="Assistant",
        instructions="You are a helpful assistant.",
    )

    result = await Runner.run(
        agent,
        [
            {
                "role": "user",
                "content": [
                    {
                        "type": "input_image",
                        "detail": "auto",
                        "image_url": f"data:image/jpeg;base64,{b64_image}",
                    }
                ],
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

+++ d4a784ba2991c652505b133c40bfd4ef913fd6d8

@@ -0,0 +1,48 @@

+import asyncio
+import base64
+import os
+
+from agents import Agent, Runner
+
+FILEPATH = os.path.join(os.path.dirname(__file__), "media/image_bison.jpg")
+
+
+def image_to_base64(image_path):
+    with open(image_path, "rb") as image_file:
+        encoded_string = base64.b64encode(image_file.read()).decode("utf-8")
+    return encoded_string
+
+
+async def main():
+    # Print base64-encoded image
+    b64_image = image_to_base64(FILEPATH)
+
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
+                "content": [
+                    {
+                        "type": "input_image",
+                        "detail": "auto",
+                        "image_url": f"data:image/jpeg;base64,{b64_image}",
+                    }
+                ],
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
