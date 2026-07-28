# openai/openai-agents-python · examples/basic/stream_items.py

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [openai/openai-agents-python](https://github.com/openai/openai-agents-python) |
| 来源文件 | [examples/basic/stream_items.py](https://github.com/openai/openai-agents-python/blob/bf8a1e2bbf12953ae4a9992b6a584cff90105fab/examples/basic/stream_items.py) |
| 来源版本 | `bf8a1e2bbf12953ae4a9992b6a584cff90105fab` |
| 摄取时间 | `2026-07-11T06:08:44.835613+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_openai_openai_agents_python_examples_basic_stream_items_py_bf8a1e2bbf12` |

## 本次变化

- 新增行数 `66`.
- 删除行数 `0`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- 未发现 Markdown 标题.

<details>
<summary>展开完整外部原文</summary>

import asyncio
import random

from agents import Agent, ItemHelpers, Runner, function_tool


@function_tool
def how_many_jokes() -> int:
    """Return a random integer of jokes to tell between 1 and 10 (inclusive)."""
    return random.randint(1, 10)


async def main():
    agent = Agent(
        name="Joker",
        instructions="First call the `how_many_jokes` tool, then tell that many jokes.",
        tools=[how_many_jokes],
    )

    result = Runner.run_streamed(
        agent,
        input="Hello",
    )
    print("=== Run starting ===")
    async for event in result.stream_events():
        # We'll ignore the raw responses event deltas
        if event.type == "raw_response_event":
            continue
        elif event.type == "agent_updated_stream_event":
            print(f"Agent updated: {event.new_agent.name}")
            continue
        elif event.type == "run_item_stream_event":
            if event.item.type == "tool_call_item":
                print(f"-- Tool was called: {getattr(event.item.raw_item, 'name', 'Unknown Tool')}")
            elif event.item.type == "tool_call_output_item":
                print(f"-- Tool output: {event.item.output}")
            elif event.item.type == "message_output_item":
                print(f"-- Message output:\n {ItemHelpers.text_message_output(event.item)}")
            else:
                pass  # Ignore other event types

    print("=== Run complete ===")


if __name__ == "__main__":
    asyncio.run(main())

    # === Run starting ===
    # Agent updated: Joker
    # -- Tool was called: how_many_jokes
    # -- Tool output: 4
    # -- Message output:
    #  Sure, here are four jokes for you:

    # 1. **Why don't skeletons fight each other?**
    #    They don't have the guts!

    # 2. **What do you call fake spaghetti?**
    #    An impasta!

    # 3. **Why did the scarecrow win an award?**
    #    Because he was outstanding in his field!

    # 4. **Why did the bicycle fall over?**
    #    Because it was two-tired!
    # === Run complete ===

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ bf8a1e2bbf12953ae4a9992b6a584cff90105fab

@@ -0,0 +1,66 @@

+import asyncio
+import random
+
+from agents import Agent, ItemHelpers, Runner, function_tool
+
+
+@function_tool
+def how_many_jokes() -> int:
+    """Return a random integer of jokes to tell between 1 and 10 (inclusive)."""
+    return random.randint(1, 10)
+
+
+async def main():
+    agent = Agent(
+        name="Joker",
+        instructions="First call the `how_many_jokes` tool, then tell that many jokes.",
+        tools=[how_many_jokes],
+    )
+
+    result = Runner.run_streamed(
+        agent,
+        input="Hello",
+    )
+    print("=== Run starting ===")
+    async for event in result.stream_events():
+        # We'll ignore the raw responses event deltas
+        if event.type == "raw_response_event":
+            continue
+        elif event.type == "agent_updated_stream_event":
+            print(f"Agent updated: {event.new_agent.name}")
+            continue
+        elif event.type == "run_item_stream_event":
+            if event.item.type == "tool_call_item":
+                print(f"-- Tool was called: {getattr(event.item.raw_item, 'name', 'Unknown Tool')}")
+            elif event.item.type == "tool_call_output_item":
+                print(f"-- Tool output: {event.item.output}")
+            elif event.item.type == "message_output_item":
+                print(f"-- Message output:\n {ItemHelpers.text_message_output(event.item)}")
+            else:
+                pass  # Ignore other event types
+
+    print("=== Run complete ===")
+
+
+if __name__ == "__main__":
+    asyncio.run(main())
+
+    # === Run starting ===
+    # Agent updated: Joker
+    # -- Tool was called: how_many_jokes
+    # -- Tool output: 4
+    # -- Message output:
+    #  Sure, here are four jokes for you:
+
+    # 1. **Why don't skeletons fight each other?**
+    #    They don't have the guts!
+
+    # 2. **What do you call fake spaghetti?**
+    #    An impasta!
+
+    # 3. **Why did the scarecrow win an award?**
+    #    Because he was outstanding in his field!
+
+    # 4. **Why did the bicycle fall over?**
+    #    Because it was two-tired!
+    # === Run complete ===
```

</details>
