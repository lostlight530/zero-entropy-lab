# openai/openai-agents-python · examples/basic/stream_text.py

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [openai/openai-agents-python](https://github.com/openai/openai-agents-python) |
| 来源文件 | [examples/basic/stream_text.py](https://github.com/openai/openai-agents-python/blob/a73c1feeb105b889a8235c250cd4553883cec48a/examples/basic/stream_text.py) |
| 来源版本 | `a73c1feeb105b889a8235c250cd4553883cec48a` |
| 摄取时间 | `2026-07-11T06:08:44.966719+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_openai_openai_agents_python_examples_basic_stream_text_py_a73c1feeb105` |

## 本次变化

- 新增行数 `21`.
- 删除行数 `0`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- 未发现 Markdown 标题.

<details>
<summary>展开完整外部原文</summary>

import asyncio

from openai.types.responses import ResponseTextDeltaEvent

from agents import Agent, Runner


async def main():
    agent = Agent(
        name="Joker",
        instructions="You are a helpful assistant.",
    )

    result = Runner.run_streamed(agent, input="Please tell me 5 jokes.")
    async for event in result.stream_events():
        if event.type == "raw_response_event" and isinstance(event.data, ResponseTextDeltaEvent):
            print(event.data.delta, end="", flush=True)


if __name__ == "__main__":
    asyncio.run(main())

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ a73c1feeb105b889a8235c250cd4553883cec48a

@@ -0,0 +1,21 @@

+import asyncio
+
+from openai.types.responses import ResponseTextDeltaEvent
+
+from agents import Agent, Runner
+
+
+async def main():
+    agent = Agent(
+        name="Joker",
+        instructions="You are a helpful assistant.",
+    )
+
+    result = Runner.run_streamed(agent, input="Please tell me 5 jokes.")
+    async for event in result.stream_events():
+        if event.type == "raw_response_event" and isinstance(event.data, ResponseTextDeltaEvent):
+            print(event.data.delta, end="", flush=True)
+
+
+if __name__ == "__main__":
+    asyncio.run(main())
```

</details>
