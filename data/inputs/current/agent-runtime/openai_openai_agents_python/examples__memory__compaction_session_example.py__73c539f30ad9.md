# openai/openai-agents-python · examples/memory/compaction_session_example.py

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [openai/openai-agents-python](https://github.com/openai/openai-agents-python) |
| 来源文件 | [examples/memory/compaction_session_example.py](https://github.com/openai/openai-agents-python/blob/73c539f30ad97f738341ba1e2a99a2e4e4ec17f4/examples/memory/compaction_session_example.py) |
| 来源版本 | `73c539f30ad97f738341ba1e2a99a2e4e4ec17f4` |
| 摄取时间 | `2026-07-11T06:08:50.466232+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_openai_openai_agents_python_examples_memory_compaction_session_example_py_73c539f30ad9` |

## 本次变化

- 新增行数 `86`.
- 删除行数 `0`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- 未发现 Markdown 标题.

<details>
<summary>展开完整外部原文</summary>

"""
Example demonstrating OpenAI responses.compact session functionality.

This example shows how to use OpenAIResponsesCompactionSession to automatically
compact conversation history when it grows too large, reducing token usage
while preserving context.
"""

import asyncio

from agents import Agent, OpenAIResponsesCompactionSession, Runner, SQLiteSession


async def main():
    # Create an underlying session for storage
    underlying = SQLiteSession(":memory:")

    # Wrap with compaction session - will automatically compact when threshold hit
    session = OpenAIResponsesCompactionSession(
        session_id="demo-session",
        underlying_session=underlying,
        model="gpt-4.1",
        # Custom compaction trigger (default is 10 candidates)
        should_trigger_compaction=lambda ctx: len(ctx["compaction_candidate_items"]) >= 4,
    )

    agent = Agent(
        name="Assistant",
        instructions="Reply concisely. Keep answers to 1-2 sentences.",
    )

    print("=== Compaction Session Example ===\n")

    prompts = [
        "What is the tallest mountain in the world?",
        "How tall is it in feet?",
        "When was it first climbed?",
        "Who was on that expedition?",
        "What country is the mountain in?",
    ]

    for i, prompt in enumerate(prompts, 1):
        print(f"Turn {i}:")
        print(f"User: {prompt}")
        result = await Runner.run(agent, prompt, session=session)
        print(f"Assistant: {result.final_output}\n")

    # Show session state after automatic compaction (if triggered)
    items = await session.get_items()
    print("=== Session State (Auto Compaction) ===")
    print(f"Total items: {len(items)}")
    for item in items:
        # Some inputs are stored as easy messages (only `role` and `content`).
        item_type = item.get("type") or ("message" if "role" in item else "unknown")
        if item_type == "compaction":
            print("  - compaction (encrypted content)")
        elif item_type == "message":
            role = item.get("role", "unknown")
            print(f"  - message ({role})")
        else:
            print(f"  - {item_type}")
    print()

    # Manual compaction after inspecting the auto-compacted state.
    print("=== Manual Compaction ===")
    await session.run_compaction({"force": True})
    print("Done")
    print()

    # Show final session state after manual compaction
    items = await session.get_items()
    print("=== Session State (Manual Compaction) ===")
    print(f"Total items: {len(items)}")
    for item in items:
        item_type = item.get("type") or ("message" if "role" in item else "unknown")
        if item_type == "compaction":
            print("  - compaction (encrypted content)")
        elif item_type == "message":
            role = item.get("role", "unknown")
            print(f"  - message ({role})")
        else:
            print(f"  - {item_type}")


if __name__ == "__main__":
    asyncio.run(main())

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ 73c539f30ad97f738341ba1e2a99a2e4e4ec17f4

@@ -0,0 +1,86 @@

+"""
+Example demonstrating OpenAI responses.compact session functionality.
+
+This example shows how to use OpenAIResponsesCompactionSession to automatically
+compact conversation history when it grows too large, reducing token usage
+while preserving context.
+"""
+
+import asyncio
+
+from agents import Agent, OpenAIResponsesCompactionSession, Runner, SQLiteSession
+
+
+async def main():
+    # Create an underlying session for storage
+    underlying = SQLiteSession(":memory:")
+
+    # Wrap with compaction session - will automatically compact when threshold hit
+    session = OpenAIResponsesCompactionSession(
+        session_id="demo-session",
+        underlying_session=underlying,
+        model="gpt-4.1",
+        # Custom compaction trigger (default is 10 candidates)
+        should_trigger_compaction=lambda ctx: len(ctx["compaction_candidate_items"]) >= 4,
+    )
+
+    agent = Agent(
+        name="Assistant",
+        instructions="Reply concisely. Keep answers to 1-2 sentences.",
+    )
+
+    print("=== Compaction Session Example ===\n")
+
+    prompts = [
+        "What is the tallest mountain in the world?",
+        "How tall is it in feet?",
+        "When was it first climbed?",
+        "Who was on that expedition?",
+        "What country is the mountain in?",
+    ]
+
+    for i, prompt in enumerate(prompts, 1):
+        print(f"Turn {i}:")
+        print(f"User: {prompt}")
+        result = await Runner.run(agent, prompt, session=session)
+        print(f"Assistant: {result.final_output}\n")
+
+    # Show session state after automatic compaction (if triggered)
+    items = await session.get_items()
+    print("=== Session State (Auto Compaction) ===")
+    print(f"Total items: {len(items)}")
+    for item in items:
+        # Some inputs are stored as easy messages (only `role` and `content`).
+        item_type = item.get("type") or ("message" if "role" in item else "unknown")
+        if item_type == "compaction":
+            print("  - compaction (encrypted content)")
+        elif item_type == "message":
+            role = item.get("role", "unknown")
+            print(f"  - message ({role})")
+        else:
+            print(f"  - {item_type}")
+    print()
+
+    # Manual compaction after inspecting the auto-compacted state.
+    print("=== Manual Compaction ===")
+    await session.run_compaction({"force": True})
+    print("Done")
+    print()
+
+    # Show final session state after manual compaction
+    items = await session.get_items()
+    print("=== Session State (Manual Compaction) ===")
+    print(f"Total items: {len(items)}")
+    for item in items:
+        item_type = item.get("type") or ("message" if "role" in item else "unknown")
+        if item_type == "compaction":
+            print("  - compaction (encrypted content)")
+        elif item_type == "message":
+            role = item.get("role", "unknown")
+            print(f"  - message ({role})")
+        else:
+            print(f"  - {item_type}")
+
+
+if __name__ == "__main__":
+    asyncio.run(main())
```

</details>
