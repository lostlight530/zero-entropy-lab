# openai/openai-agents-python · examples/memory/sqlalchemy_session_example.py

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [openai/openai-agents-python](https://github.com/openai/openai-agents-python) |
| 来源文件 | [examples/memory/sqlalchemy_session_example.py](https://github.com/openai/openai-agents-python/blob/84a6c754f018a4952c63b6746685b38aa435e06e/examples/memory/sqlalchemy_session_example.py) |
| 来源版本 | `84a6c754f018a4952c63b6746685b38aa435e06e` |
| 摄取时间 | `2026-07-11T06:08:52.110914+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_openai_openai_agents_python_examples_memory_sqlalchemy_session_example_py_84a6c754f018` |

## 本次变化

- 新增行数 `78`.
- 删除行数 `0`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- 未发现 Markdown 标题.

<details>
<summary>展开完整外部原文</summary>

import asyncio

from agents import Agent, Runner
from agents.extensions.memory.sqlalchemy_session import SQLAlchemySession


async def main():
    # Create an agent
    agent = Agent(
        name="Assistant",
        instructions="Reply very concisely.",
    )

    # Create a session instance with a session ID.
    # This example uses an in-memory SQLite database.
    # The `create_tables=True` flag is useful for development and testing.
    session = SQLAlchemySession.from_url(
        "conversation_123",
        url="sqlite+aiosqlite:///:memory:",
        create_tables=True,
    )

    print("=== Session Example ===")
    print("The agent will remember previous messages automatically.\n")

    # First turn
    print("First turn:")
    print("User: What city is the Golden Gate Bridge in?")
    result = await Runner.run(
        agent,
        "What city is the Golden Gate Bridge in?",
        session=session,
    )
    print(f"Assistant: {result.final_output}")
    print()

    # Second turn - the agent will remember the previous conversation
    print("Second turn:")
    print("User: What state is it in?")
    result = await Runner.run(agent, "What state is it in?", session=session)
    print(f"Assistant: {result.final_output}")
    print()

    # Third turn - continuing the conversation
    print("Third turn:")
    print("User: What's the population of that state?")
    result = await Runner.run(
        agent,
        "What's the population of that state?",
        session=session,
    )
    print(f"Assistant: {result.final_output}")
    print()

    print("=== Conversation Complete ===")
    print("Notice how the agent remembered the context from previous turns!")
    print("Sessions automatically handles conversation history.")

    # Demonstrate the limit parameter - get only the latest 2 items
    print("\n=== Latest Items Demo ===")
    latest_items = await session.get_items(limit=2)
    print("Latest 2 items:")
    for i, msg in enumerate(latest_items, 1):
        role = msg.get("role", "unknown")
        content = msg.get("content", "")
        print(f"  {i}. {role}: {content}")

    print(f"\nFetched {len(latest_items)} out of total conversation history.")

    # Get all items to show the difference
    all_items = await session.get_items()
    print(f"Total items in session: {len(all_items)}")


if __name__ == "__main__":
    # To run this example, you need to install the sqlalchemy extras:
    # pip install "agents[sqlalchemy]"
    asyncio.run(main())

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ 84a6c754f018a4952c63b6746685b38aa435e06e

@@ -0,0 +1,78 @@

+import asyncio
+
+from agents import Agent, Runner
+from agents.extensions.memory.sqlalchemy_session import SQLAlchemySession
+
+
+async def main():
+    # Create an agent
+    agent = Agent(
+        name="Assistant",
+        instructions="Reply very concisely.",
+    )
+
+    # Create a session instance with a session ID.
+    # This example uses an in-memory SQLite database.
+    # The `create_tables=True` flag is useful for development and testing.
+    session = SQLAlchemySession.from_url(
+        "conversation_123",
+        url="sqlite+aiosqlite:///:memory:",
+        create_tables=True,
+    )
+
+    print("=== Session Example ===")
+    print("The agent will remember previous messages automatically.\n")
+
+    # First turn
+    print("First turn:")
+    print("User: What city is the Golden Gate Bridge in?")
+    result = await Runner.run(
+        agent,
+        "What city is the Golden Gate Bridge in?",
+        session=session,
+    )
+    print(f"Assistant: {result.final_output}")
+    print()
+
+    # Second turn - the agent will remember the previous conversation
+    print("Second turn:")
+    print("User: What state is it in?")
+    result = await Runner.run(agent, "What state is it in?", session=session)
+    print(f"Assistant: {result.final_output}")
+    print()
+
+    # Third turn - continuing the conversation
+    print("Third turn:")
+    print("User: What's the population of that state?")
+    result = await Runner.run(
+        agent,
+        "What's the population of that state?",
+        session=session,
+    )
+    print(f"Assistant: {result.final_output}")
+    print()
+
+    print("=== Conversation Complete ===")
+    print("Notice how the agent remembered the context from previous turns!")
+    print("Sessions automatically handles conversation history.")
+
+    # Demonstrate the limit parameter - get only the latest 2 items
+    print("\n=== Latest Items Demo ===")
+    latest_items = await session.get_items(limit=2)
+    print("Latest 2 items:")
+    for i, msg in enumerate(latest_items, 1):
+        role = msg.get("role", "unknown")
+        content = msg.get("content", "")
+        print(f"  {i}. {role}: {content}")
+
+    print(f"\nFetched {len(latest_items)} out of total conversation history.")
+
+    # Get all items to show the difference
+    all_items = await session.get_items()
+    print(f"Total items in session: {len(all_items)}")
+
+
+if __name__ == "__main__":
+    # To run this example, you need to install the sqlalchemy extras:
+    # pip install "agents[sqlalchemy]"
+    asyncio.run(main())
```

</details>
