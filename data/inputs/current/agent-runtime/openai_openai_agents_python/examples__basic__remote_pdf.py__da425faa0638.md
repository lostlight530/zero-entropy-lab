PROVENANCE: {"confidence": 1.0, "entity_id": "doc_openai_openai_agents_python_examples_basic_remote_pdf_py_da425faa0638", "primary_owner": "zero", "retrieved_at": "2026-07-11T06:08:44.300077+00:00", "source_path": "examples/basic/remote_pdf.py", "source_repo": "openai/openai-agents-python", "source_sha": "da425faa06387bba1e04a2d118caa94148317cf1"}

# Source Document

import asyncio

from agents import Agent, Runner

URL = "https://www.berkshirehathaway.com/letters/2024ltr.pdf"


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
                "content": [{"type": "input_file", "file_url": URL}],
            },
            {
                "role": "user",
                "content": "Can you summarize the letter?",
            },
        ],
    )
    print(result.final_output)


if __name__ == "__main__":
    asyncio.run(main())


# Document Diff

```diff
--- previous

+++ da425faa06387bba1e04a2d118caa94148317cf1

@@ -0,0 +1,31 @@

+import asyncio
+
+from agents import Agent, Runner
+
+URL = "https://www.berkshirehathaway.com/letters/2024ltr.pdf"
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
+                "content": [{"type": "input_file", "file_url": URL}],
+            },
+            {
+                "role": "user",
+                "content": "Can you summarize the letter?",
+            },
+        ],
+    )
+    print(result.final_output)
+
+
+if __name__ == "__main__":
+    asyncio.run(main())
```
