# openai/openai-agents-python · examples/memory/mongodb_session_example.py

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [openai/openai-agents-python](https://github.com/openai/openai-agents-python) |
| 来源文件 | [examples/memory/mongodb_session_example.py](https://github.com/openai/openai-agents-python/blob/f22f4ab9a36cc2b404cc245a3149ea60a0a4060f/examples/memory/mongodb_session_example.py) |
| 来源版本 | `f22f4ab9a36cc2b404cc245a3149ea60a0a4060f` |
| 摄取时间 | `2026-07-11T06:08:51.543647+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_openai_openai_agents_python_examples_memory_mongodb_session_example_py_f22f4ab9a36c` |

## 本次变化

- 新增行数 `72`.
- 删除行数 `0`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- 未发现 Markdown 标题.

<details>
<summary>展开完整外部原文</summary>

"""
Example demonstrating MongoDB session memory with a shared AsyncMongoClient.

In production you should create one AsyncMongoClient and pass it to all sessions
so they share the same connection pool.
"""

import asyncio
from typing import Any

from pymongo.asynchronous.mongo_client import AsyncMongoClient

from agents import Agent, Runner
from agents.extensions.memory import MongoDBSession

MONGO_URI = "mongodb://localhost:27017"
DATABASE = "agents_example"


async def main():
    agent = Agent(
        name="Assistant",
        instructions="Reply very concisely.",
    )

    # One client shared across all sessions (production pattern).
    client: AsyncMongoClient[Any] = AsyncMongoClient(MONGO_URI)

    try:
        await client.admin.command("ping")
    except Exception:
        print("MongoDB is not available on localhost:27017")
        print("Start it with: docker run -d -p 27017:27017 mongo")
        return

    session_a = MongoDBSession("conversation_a", client=client, database=DATABASE)
    session_b = MongoDBSession("conversation_b", client=client, database=DATABASE)

    # Clean slate for the demo.
    await session_a.clear_session()
    await session_b.clear_session()

    # --- Session A: multi-turn conversation ---
    print("=== Session A ===")
    result = await Runner.run(agent, "What city is the Golden Gate Bridge in?", session=session_a)
    print(f"Turn 1: {result.final_output}")

    result = await Runner.run(agent, "What state is it in?", session=session_a)
    print(f"Turn 2: {result.final_output}")

    result = await Runner.run(agent, "What's the population of that state?", session=session_a)
    print(f"Turn 3: {result.final_output}")

    # --- Session B: independent conversation on the same client ---
    print("\n=== Session B ===")
    result = await Runner.run(agent, "What is the capital of France?", session=session_b)
    print(f"Turn 1: {result.final_output}")

    # Show isolation.
    a_items = await session_a.get_items()
    b_items = await session_b.get_items()
    print(f"\nSession A items: {len(a_items)}, Session B items: {len(b_items)}")

    # Cleanup.
    await session_a.clear_session()
    await session_b.clear_session()
    await client.close()


if __name__ == "__main__":
    # pip install "openai-agents[mongodb]"
    asyncio.run(main())

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ f22f4ab9a36cc2b404cc245a3149ea60a0a4060f

@@ -0,0 +1,72 @@

+"""
+Example demonstrating MongoDB session memory with a shared AsyncMongoClient.
+
+In production you should create one AsyncMongoClient and pass it to all sessions
+so they share the same connection pool.
+"""
+
+import asyncio
+from typing import Any
+
+from pymongo.asynchronous.mongo_client import AsyncMongoClient
+
+from agents import Agent, Runner
+from agents.extensions.memory import MongoDBSession
+
+MONGO_URI = "mongodb://localhost:27017"
+DATABASE = "agents_example"
+
+
+async def main():
+    agent = Agent(
+        name="Assistant",
+        instructions="Reply very concisely.",
+    )
+
+    # One client shared across all sessions (production pattern).
+    client: AsyncMongoClient[Any] = AsyncMongoClient(MONGO_URI)
+
+    try:
+        await client.admin.command("ping")
+    except Exception:
+        print("MongoDB is not available on localhost:27017")
+        print("Start it with: docker run -d -p 27017:27017 mongo")
+        return
+
+    session_a = MongoDBSession("conversation_a", client=client, database=DATABASE)
+    session_b = MongoDBSession("conversation_b", client=client, database=DATABASE)
+
+    # Clean slate for the demo.
+    await session_a.clear_session()
+    await session_b.clear_session()
+
+    # --- Session A: multi-turn conversation ---
+    print("=== Session A ===")
+    result = await Runner.run(agent, "What city is the Golden Gate Bridge in?", session=session_a)
+    print(f"Turn 1: {result.final_output}")
+
+    result = await Runner.run(agent, "What state is it in?", session=session_a)
+    print(f"Turn 2: {result.final_output}")
+
+    result = await Runner.run(agent, "What's the population of that state?", session=session_a)
+    print(f"Turn 3: {result.final_output}")
+
+    # --- Session B: independent conversation on the same client ---
+    print("\n=== Session B ===")
+    result = await Runner.run(agent, "What is the capital of France?", session=session_b)
+    print(f"Turn 1: {result.final_output}")
+
+    # Show isolation.
+    a_items = await session_a.get_items()
+    b_items = await session_b.get_items()
+    print(f"\nSession A items: {len(a_items)}, Session B items: {len(b_items)}")
+
+    # Cleanup.
+    await session_a.clear_session()
+    await session_b.clear_session()
+    await client.close()
+
+
+if __name__ == "__main__":
+    # pip install "openai-agents[mongodb]"
+    asyncio.run(main())
```

</details>
