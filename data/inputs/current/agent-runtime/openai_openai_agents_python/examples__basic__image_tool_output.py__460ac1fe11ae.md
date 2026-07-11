PROVENANCE: {"confidence": 1.0, "entity_id": "doc_openai_openai_agents_python_examples_basic_image_tool_output_py_460ac1fe11ae", "primary_owner": "zero", "retrieved_at": "2026-07-11T06:08:42.753297+00:00", "source_path": "examples/basic/image_tool_output.py", "source_repo": "openai/openai-agents-python", "source_sha": "460ac1fe11aefb9450113a99ce4d464f62ce1b50"}

# Source Document

import asyncio

from agents import Agent, Runner, ToolOutputImage, ToolOutputImageDict, function_tool

return_typed_dict = True

URL = "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=400&q=80"


@function_tool
def fetch_random_image() -> ToolOutputImage | ToolOutputImageDict:
    """Fetch a random image."""

    print("Image tool called")
    if return_typed_dict:
        return {"type": "image", "image_url": URL, "detail": "auto"}

    return ToolOutputImage(image_url=URL, detail="auto")


async def main():
    agent = Agent(
        name="Assistant",
        instructions="You are a helpful assistant.",
        tools=[fetch_random_image],
    )

    result = await Runner.run(
        agent,
        input="Fetch an image using the random_image tool, then describe it",
    )
    print(result.final_output)
    """This image features the famous clock tower, commonly known as Big Ben, ..."""


if __name__ == "__main__":
    asyncio.run(main())


# Document Diff

```diff
--- previous

+++ 460ac1fe11aefb9450113a99ce4d464f62ce1b50

@@ -0,0 +1,37 @@

+import asyncio
+
+from agents import Agent, Runner, ToolOutputImage, ToolOutputImageDict, function_tool
+
+return_typed_dict = True
+
+URL = "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=400&q=80"
+
+
+@function_tool
+def fetch_random_image() -> ToolOutputImage | ToolOutputImageDict:
+    """Fetch a random image."""
+
+    print("Image tool called")
+    if return_typed_dict:
+        return {"type": "image", "image_url": URL, "detail": "auto"}
+
+    return ToolOutputImage(image_url=URL, detail="auto")
+
+
+async def main():
+    agent = Agent(
+        name="Assistant",
+        instructions="You are a helpful assistant.",
+        tools=[fetch_random_image],
+    )
+
+    result = await Runner.run(
+        agent,
+        input="Fetch an image using the random_image tool, then describe it",
+    )
+    print(result.final_output)
+    """This image features the famous clock tower, commonly known as Big Ben, ..."""
+
+
+if __name__ == "__main__":
+    asyncio.run(main())
```
