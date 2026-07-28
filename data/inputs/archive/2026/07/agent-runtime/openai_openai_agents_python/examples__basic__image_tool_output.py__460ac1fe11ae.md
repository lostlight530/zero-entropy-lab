# openai/openai-agents-python · examples/basic/image_tool_output.py

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [openai/openai-agents-python](https://github.com/openai/openai-agents-python) |
| 来源文件 | [examples/basic/image_tool_output.py](https://github.com/openai/openai-agents-python/blob/460ac1fe11aefb9450113a99ce4d464f62ce1b50/examples/basic/image_tool_output.py) |
| 来源版本 | `460ac1fe11aefb9450113a99ce4d464f62ce1b50` |
| 摄取时间 | `2026-07-11T06:08:42.753297+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_openai_openai_agents_python_examples_basic_image_tool_output_py_460ac1fe11ae` |

## 本次变化

- 新增行数 `37`.
- 删除行数 `0`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- 未发现 Markdown 标题.

<details>
<summary>展开完整外部原文</summary>

import asyncio

from agents import Agent, Runner, ToolOutputImage, ToolOutputImageDict, function_tool

return_typed_dict = True

URL = "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=400&q=80"


@function_tool
def fetch_random_image() -> ToolOutputImage | ToolOutputImageDict:
    """Fetch a random image."""

    print("Image tool called")
    if return_typed_dict:
        return {"type": "image", "image_url": URL, "detail": "auto"}

    return ToolOutputImage(image_url=URL, detail="auto")


async def main():
    agent = Agent(
        name="Assistant",
        instructions="You are a helpful assistant.",
        tools=[fetch_random_image],
    )

    result = await Runner.run(
        agent,
        input="Fetch an image using the random_image tool, then describe it",
    )
    print(result.final_output)
    """This image features the famous clock tower, commonly known as Big Ben, ..."""


if __name__ == "__main__":
    asyncio.run(main())

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ 460ac1fe11aefb9450113a99ce4d464f62ce1b50

@@ -0,0 +1,37 @@

+import asyncio
+
+from agents import Agent, Runner, ToolOutputImage, ToolOutputImageDict, function_tool
+
+return_typed_dict = True
+
+URL = "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=400&q=80"
+
+
+@function_tool
+def fetch_random_image() -> ToolOutputImage | ToolOutputImageDict:
+    """Fetch a random image."""
+
+    print("Image tool called")
+    if return_typed_dict:
+        return {"type": "image", "image_url": URL, "detail": "auto"}
+
+    return ToolOutputImage(image_url=URL, detail="auto")
+
+
+async def main():
+    agent = Agent(
+        name="Assistant",
+        instructions="You are a helpful assistant.",
+        tools=[fetch_random_image],
+    )
+
+    result = await Runner.run(
+        agent,
+        input="Fetch an image using the random_image tool, then describe it",
+    )
+    print(result.final_output)
+    """This image features the famous clock tower, commonly known as Big Ben, ..."""
+
+
+if __name__ == "__main__":
+    asyncio.run(main())
```

</details>
