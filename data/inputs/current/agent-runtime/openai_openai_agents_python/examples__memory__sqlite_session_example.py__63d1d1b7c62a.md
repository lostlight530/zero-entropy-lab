PROVENANCE: {"confidence": 1.0, "entity_id": "doc_openai_openai_agents_python_examples_memory_sqlite_session_example_py_63d1d1b7c62a", "primary_owner": "zero", "retrieved_at": "2026-07-11T06:08:52.237971+00:00", "source_path": "examples/memory/sqlite_session_example.py", "source_repo": "openai/openai-agents-python", "source_sha": "63d1d1b7c62ad1b1711d296b486efcadeec7491b"}

# Source Document

"""
Example demonstrating session memory functionality.

This example shows how to use session memory to maintain conversation history
across multiple agent runs without manually handling .to_input_list().
"""

import asyncio

from agents import Agent, Runner, SQLiteSession


async def main():
    # Create an agent
    agent = Agent(
        name="Assistant",
        instructions="Reply very concisely.",
    )

    # Create a session instance that will persist across runs
    session_id = "conversation_123"
    session = SQLiteSession(session_id)

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
    asyncio.run(main())


# Document Diff

```diff
--- previous

+++ 63d1d1b7c62ad1b1711d296b486efcadeec7491b

@@ -0,0 +1,77 @@

+"""
+Example demonstrating session memory functionality.
+
+This example shows how to use session memory to maintain conversation history
+across multiple agent runs without manually handling .to_input_list().
+"""
+
+import asyncio
+
+from agents import Agent, Runner, SQLiteSession
+
+
+async def main():
+    # Create an agent
+    agent = Agent(
+        name="Assistant",
+        instructions="Reply very concisely.",
+    )
+
+    # Create a session instance that will persist across runs
+    session_id = "conversation_123"
+    session = SQLiteSession(session_id)
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
+    asyncio.run(main())
```
