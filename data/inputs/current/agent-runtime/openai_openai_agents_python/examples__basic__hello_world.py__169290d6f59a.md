PROVENANCE: {"confidence": 1.0, "entity_id": "doc_openai_openai_agents_python_examples_basic_hello_world_py_169290d6f59a", "primary_owner": "zero", "retrieved_at": "2026-07-11T06:08:42.244064+00:00", "source_path": "examples/basic/hello_world.py", "source_repo": "openai/openai-agents-python", "source_sha": "169290d6f59af88e3e52aab09bce7341ae3d832c"}

# Source Document

import asyncio

from agents import Agent, Runner


async def main():
    agent = Agent(
        name="Assistant",
        instructions="You only respond in haikus.",
    )

    result = await Runner.run(agent, "Tell me about recursion in programming.")
    print(result.final_output)
    # Function calls itself,
    # Looping in smaller pieces,
    # Endless by design.


if __name__ == "__main__":
    asyncio.run(main())


# Document Diff

```diff
--- previous

+++ 169290d6f59af88e3e52aab09bce7341ae3d832c

@@ -0,0 +1,20 @@

+import asyncio
+
+from agents import Agent, Runner
+
+
+async def main():
+    agent = Agent(
+        name="Assistant",
+        instructions="You only respond in haikus.",
+    )
+
+    result = await Runner.run(agent, "Tell me about recursion in programming.")
+    print(result.final_output)
+    # Function calls itself,
+    # Looping in smaller pieces,
+    # Endless by design.
+
+
+if __name__ == "__main__":
+    asyncio.run(main())
```
