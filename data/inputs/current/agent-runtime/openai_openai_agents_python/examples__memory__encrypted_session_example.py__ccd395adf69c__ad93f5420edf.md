# openai/openai-agents-python · examples/memory/encrypted_session_example.py

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [openai/openai-agents-python](https://github.com/openai/openai-agents-python) |
| 来源文件 | [examples/memory/encrypted_session_example.py](https://github.com/openai/openai-agents-python/blob/ad93f5420edfecb30c6d2bc3a1a22047918cba1a/examples/memory/encrypted_session_example.py) |
| 来源版本 | `ad93f5420edfecb30c6d2bc3a1a22047918cba1a` |
| 来源目录 Tree | `b2f9672b270eae782d6eeb89ef19125a60e95e69` |
| 来源内容 Blob | `ccd395adf69cfb6f1f64beb8c2f0bf3c5e105488` |
| 摄取时间 | `2026-09-22T00:20:59.008808+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_openai_openai_agents_python_examples_memory_encrypted_session_example_py_d3d9a9e74705` |

## 本次变化

- 新增行数 `8`.
- 删除行数 `1`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- 未发现 Markdown 标题.

<details>
<summary>展开完整外部原文</summary>

"""
Example demonstrating encrypted session memory functionality.

This example shows how to use encrypted session memory to maintain conversation history
across multiple agent runs with automatic encryption and TTL-based expiration.
The EncryptedSession wrapper provides transparent encryption over any underlying session.
"""

import asyncio
from typing import cast

from cryptography.fernet import Fernet

from agents import Agent, Runner, SQLiteSession
from agents.extensions.memory import EncryptedSession
from agents.extensions.memory.encrypt_session import EncryptedEnvelope


async def main():
    # Create an agent
    agent = Agent(
        name="Assistant",
        instructions="Reply very concisely.",
    )

    # This example uses an in-memory store and a fresh key for each execution.
    # For persistent storage, securely provision and retain a high-entropy key;
    # reuse that key and the session ID after every restart.
    encryption_key = Fernet.generate_key().decode("ascii")

    # Create an underlying session (SQLiteSession in this example)
    session_id = "conversation_123"
    underlying_session = SQLiteSession(session_id)

    # Wrap with encrypted session for automatic encryption and TTL
    session = EncryptedSession(
        session_id=session_id,
        underlying_session=underlying_session,
        encryption_key=encryption_key,
        ttl=3600,  # 1 hour TTL for messages
    )

    print("=== Encrypted Session Example ===")
    print("The agent will remember previous messages automatically with encryption.\n")

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
    print("All conversation history was automatically encrypted and stored securely.")

    # Demonstrate the limit parameter - get only the latest 2 items
    print("\n=== Latest Items Demo ===")
    latest_items = await session.get_items(limit=2)
    print("Latest 2 items (automatically decrypted):")
    for i, msg in enumerate(latest_items, 1):
        role = msg.get("role", "unknown")
        content = msg.get("content", "")
        print(f"  {i}. {role}: {content}")

    print(f"\nFetched {len(latest_items)} out of total conversation history.")

    # Get all items to show the difference
    all_items = await session.get_items()
    print(f"Total items in session: {len(all_items)}")

    # Show that underlying storage is encrypted
    print("\n=== Encryption Demo ===")
    print("Checking underlying storage to verify encryption...")
    raw_items = await underlying_session.get_items()
    print("Raw encrypted items in underlying storage:")
    for i, item in enumerate(raw_items, 1):
        if isinstance(item, dict) and item.get("__enc__") == 1:
            enc_item = cast(EncryptedEnvelope, item)
            print(
                f"  {i}. Encrypted envelope: __enc__={enc_item['__enc__']}, "
                f"payload length={len(enc_item['payload'])}"
            )
        else:
            print(f"  {i}. Unencrypted item: {item}")

    print(f"\nAll {len(raw_items)} items are stored encrypted with TTL-based expiration.")

    # Clean up
    underlying_session.close()


if __name__ == "__main__":
    asyncio.run(main())

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ ccd395adf69cfb6f1f64beb8c2f0bf3c5e105488

@@ -8,6 +8,8 @@

 
 import asyncio
 from typing import cast
+
+from cryptography.fernet import Fernet
 
 from agents import Agent, Runner, SQLiteSession
 from agents.extensions.memory import EncryptedSession
@@ -21,6 +23,11 @@

         instructions="Reply very concisely.",
     )
 
+    # This example uses an in-memory store and a fresh key for each execution.
+    # For persistent storage, securely provision and retain a high-entropy key;
+    # reuse that key and the session ID after every restart.
+    encryption_key = Fernet.generate_key().decode("ascii")
+
     # Create an underlying session (SQLiteSession in this example)
     session_id = "conversation_123"
     underlying_session = SQLiteSession(session_id)
@@ -29,7 +36,7 @@

     session = EncryptedSession(
         session_id=session_id,
         underlying_session=underlying_session,
-        encryption_key="my-secret-encryption-key",
+        encryption_key=encryption_key,
         ttl=3600,  # 1 hour TTL for messages
     )
```

</details>
