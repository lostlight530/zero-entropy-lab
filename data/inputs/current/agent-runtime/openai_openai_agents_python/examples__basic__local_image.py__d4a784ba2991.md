PROVENANCE: {"confidence": 1.0, "entity_id": "doc_openai_openai_agents_python_examples_basic_local_image_py_d4a784ba2991", "primary_owner": "zero", "retrieved_at": "2026-07-11T06:08:43.193575+00:00", "source_path": "examples/basic/local_image.py", "source_repo": "openai/openai-agents-python", "source_sha": "d4a784ba2991c652505b133c40bfd4ef913fd6d8"}

# Source Document

import asyncio
import base64
import os

from agents import Agent, Runner

FILEPATH = os.path.join(os.path.dirname(__file__), "media/image_bison.jpg")


def image_to_base64(image_path):
    with open(image_path, "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read()).decode("utf-8")
    return encoded_string


async def main():
    # Print base64-encoded image
    b64_image = image_to_base64(FILEPATH)

    agent = Agent(
        name="Assistant",
        instructions="You are a helpful assistant.",
    )

    result = await Runner.run(
        agent,
        [
            {
                "role": "user",
                "content": [
                    {
                        "type": "input_image",
                        "detail": "auto",
                        "image_url": f"data:image/jpeg;base64,{b64_image}",
                    }
                ],
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

+++ d4a784ba2991c652505b133c40bfd4ef913fd6d8

@@ -0,0 +1,48 @@

+import asyncio
+import base64
+import os
+
+from agents import Agent, Runner
+
+FILEPATH = os.path.join(os.path.dirname(__file__), "media/image_bison.jpg")
+
+
+def image_to_base64(image_path):
+    with open(image_path, "rb") as image_file:
+        encoded_string = base64.b64encode(image_file.read()).decode("utf-8")
+    return encoded_string
+
+
+async def main():
+    # Print base64-encoded image
+    b64_image = image_to_base64(FILEPATH)
+
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
+                "content": [
+                    {
+                        "type": "input_image",
+                        "detail": "auto",
+                        "image_url": f"data:image/jpeg;base64,{b64_image}",
+                    }
+                ],
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
