PROVENANCE: {"confidence": 1.0, "entity_id": "doc_openai_openai_agents_python_examples_basic_remote_image_py_e4c43e4dc283", "primary_owner": "zero", "retrieved_at": "2026-07-11T06:08:44.153832+00:00", "source_path": "examples/basic/remote_image.py", "source_repo": "openai/openai-agents-python", "source_sha": "e4c43e4dc283d87a2e934a9dc92cf7c326028535"}

# Source Document

import asyncio

from agents import Agent, Runner

URL = "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=400&q=80"


async def main():
    agent = Agent(
        name="Assistant",
        instructions="You are a helpful assistant.",
    )

    result = await Runner.run(
        agent,
        [
            {
                "role": "user",
                "content": [{"type": "input_image", "detail": "auto", "image_url": URL}],
            },
            {
                "role": "user",
                "content": "What do you see in this image?",
            },
        ],
    )
    print(result.final_output)


if __name__ == "__main__":
    asyncio.run(main())


# Document Diff

```diff
--- previous

+++ e4c43e4dc283d87a2e934a9dc92cf7c326028535

@@ -0,0 +1,31 @@

+import asyncio
+
+from agents import Agent, Runner
+
+URL = "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=400&q=80"
+
+
+async def main():
+    agent = Agent(
+        name="Assistant",
+        instructions="You are a helpful assistant.",
+    )
+
+    result = await Runner.run(
+        agent,
+        [
+            {
+                "role": "user",
+                "content": [{"type": "input_image", "detail": "auto", "image_url": URL}],
+            },
+            {
+                "role": "user",
+                "content": "What do you see in this image?",
+            },
+        ],
+    )
+    print(result.final_output)
+
+
+if __name__ == "__main__":
+    asyncio.run(main())
```
