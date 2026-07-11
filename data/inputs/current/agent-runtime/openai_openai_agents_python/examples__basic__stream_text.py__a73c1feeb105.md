PROVENANCE: {"confidence": 1.0, "entity_id": "doc_openai_openai_agents_python_examples_basic_stream_text_py_a73c1feeb105", "primary_owner": "zero", "retrieved_at": "2026-07-11T06:08:44.966719+00:00", "source_path": "examples/basic/stream_text.py", "source_repo": "openai/openai-agents-python", "source_sha": "a73c1feeb105b889a8235c250cd4553883cec48a"}

# Source Document

import asyncio

from openai.types.responses import ResponseTextDeltaEvent

from agents import Agent, Runner


async def main():
    agent = Agent(
        name="Joker",
        instructions="You are a helpful assistant.",
    )

    result = Runner.run_streamed(agent, input="Please tell me 5 jokes.")
    async for event in result.stream_events():
        if event.type == "raw_response_event" and isinstance(event.data, ResponseTextDeltaEvent):
            print(event.data.delta, end="", flush=True)


if __name__ == "__main__":
    asyncio.run(main())


# Document Diff

```diff
--- previous

+++ a73c1feeb105b889a8235c250cd4553883cec48a

@@ -0,0 +1,21 @@

+import asyncio
+
+from openai.types.responses import ResponseTextDeltaEvent
+
+from agents import Agent, Runner
+
+
+async def main():
+    agent = Agent(
+        name="Joker",
+        instructions="You are a helpful assistant.",
+    )
+
+    result = Runner.run_streamed(agent, input="Please tell me 5 jokes.")
+    async for event in result.stream_events():
+        if event.type == "raw_response_event" and isinstance(event.data, ResponseTextDeltaEvent):
+            print(event.data.delta, end="", flush=True)
+
+
+if __name__ == "__main__":
+    asyncio.run(main())
```
