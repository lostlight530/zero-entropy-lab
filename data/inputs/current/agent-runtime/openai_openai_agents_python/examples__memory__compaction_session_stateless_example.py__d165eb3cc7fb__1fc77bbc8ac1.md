# openai/openai-agents-python · examples/memory/compaction_session_stateless_example.py

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [openai/openai-agents-python](https://github.com/openai/openai-agents-python) |
| 来源文件 | [examples/memory/compaction_session_stateless_example.py](https://github.com/openai/openai-agents-python/blob/1fc77bbc8ac1446690f6ba62dd0d52779bdcf43f/examples/memory/compaction_session_stateless_example.py) |
| 来源版本 | `1fc77bbc8ac1446690f6ba62dd0d52779bdcf43f` |
| 来源目录 Tree | `3da7ccc6e2a032dca02719e2bf3a9c98a3a3eb20` |
| 来源内容 Blob | `d165eb3cc7fbea5b9d4f925530027b070a365a66` |
| 摄取时间 | `2026-11-10T03:52:42.129291+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_openai_openai_agents_python_examples_memory_compaction_session_stateless_example_py_87c685aca7a7` |

## 本次变化

- 新增行数 `0`.
- 删除行数 `1`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- 未发现 Markdown 标题.

<details>
<summary>展开完整外部原文</summary>

"""
Example demonstrating stateless compaction with store=False.

In auto mode, OpenAIResponsesCompactionSession uses input-based compaction when
responses are not stored on the server.
"""

import asyncio

from agents import Agent, ModelSettings, OpenAIResponsesCompactionSession, Runner, SQLiteSession


async def main():
    # Create an underlying session for storage
    underlying = SQLiteSession(":memory:")

    # Wrap with compaction session in auto mode. When store=False, this will
    # compact using the locally stored input items.
    session = OpenAIResponsesCompactionSession(
        session_id="demo-session",
        underlying_session=underlying,
        compaction_mode="auto",
        should_trigger_compaction=lambda ctx: len(ctx["compaction_candidate_items"]) >= 3,
    )

    agent = Agent(
        name="Assistant",
        instructions="Reply concisely. Keep answers to 1-2 sentences.",
        model_settings=ModelSettings(store=False),
    )

    print("=== Stateless Compaction Session Example ===\n")

    prompts = [
        "What is the tallest mountain in the world?",
        "How tall is it in feet?",
        "When was it first climbed?",
        "Who was on that expedition?",
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
        item_type = item.get("type") or ("message" if "role" in item else "unknown")
        if item_type == "compaction":
            print("  - compaction (encrypted content)")
        elif item_type == "message":
            role = item.get("role", "unknown")
            print(f"  - message ({role})")
        else:
            print(f"  - {item_type}")
    print()

    # Manual compaction in stateless mode.
    print("=== Manual Compaction ===")
    await session.run_compaction({"force": True})
    print("Done")
    print()

    # Show final session state
    items = await session.get_items()
    print("=== Final Session State ===")
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

+++ d165eb3cc7fbea5b9d4f925530027b070a365a66

@@ -19,7 +19,6 @@

     session = OpenAIResponsesCompactionSession(
         session_id="demo-session",
         underlying_session=underlying,
-        model="gpt-4.1",
         compaction_mode="auto",
         should_trigger_compaction=lambda ctx: len(ctx["compaction_candidate_items"]) >= 3,
     )
```

</details>
