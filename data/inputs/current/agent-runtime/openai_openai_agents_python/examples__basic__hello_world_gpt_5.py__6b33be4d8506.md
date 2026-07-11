PROVENANCE: {"confidence": 1.0, "entity_id": "doc_openai_openai_agents_python_examples_basic_hello_world_gpt_5_py_6b33be4d8506", "primary_owner": "zero", "retrieved_at": "2026-07-11T06:08:42.377009+00:00", "source_path": "examples/basic/hello_world_gpt_5.py", "source_repo": "openai/openai-agents-python", "source_sha": "6b33be4d85060bcde8fcaa209898e9e35ecb753c"}

# Source Document

import asyncio

from openai.types.shared import Reasoning

from agents import Agent, ModelSettings, Runner

# If you have a certain reason to use Chat Completions, you can configure the model this way,
# and then you can pass the chat_completions_model to the Agent constructor.
# from openai import AsyncOpenAI
# client = AsyncOpenAI()
# from agents import OpenAIChatCompletionsModel
# chat_completions_model = OpenAIChatCompletionsModel(model="gpt-5.6-sol", openai_client=client)


async def main():
    agent = Agent(
        name="Knowledgable GPT-5 Assistant",
        instructions="You're a knowledgable assistant. You always provide an interesting answer.",
        model="gpt-5.6-sol",
        model_settings=ModelSettings(
            reasoning=Reasoning(effort="low"),  # "none", "low", "medium", "high", "xhigh"
            verbosity="low",  # "low", "medium", "high"
        ),
    )
    result = await Runner.run(agent, "Tell me something about recursion in programming.")
    print(result.final_output)


if __name__ == "__main__":
    asyncio.run(main())


# Document Diff

```diff
--- previous

+++ 6b33be4d85060bcde8fcaa209898e9e35ecb753c

@@ -0,0 +1,30 @@

+import asyncio
+
+from openai.types.shared import Reasoning
+
+from agents import Agent, ModelSettings, Runner
+
+# If you have a certain reason to use Chat Completions, you can configure the model this way,
+# and then you can pass the chat_completions_model to the Agent constructor.
+# from openai import AsyncOpenAI
+# client = AsyncOpenAI()
+# from agents import OpenAIChatCompletionsModel
+# chat_completions_model = OpenAIChatCompletionsModel(model="gpt-5.6-sol", openai_client=client)
+
+
+async def main():
+    agent = Agent(
+        name="Knowledgable GPT-5 Assistant",
+        instructions="You're a knowledgable assistant. You always provide an interesting answer.",
+        model="gpt-5.6-sol",
+        model_settings=ModelSettings(
+            reasoning=Reasoning(effort="low"),  # "none", "low", "medium", "high", "xhigh"
+            verbosity="low",  # "low", "medium", "high"
+        ),
+    )
+    result = await Runner.run(agent, "Tell me something about recursion in programming.")
+    print(result.final_output)
+
+
+if __name__ == "__main__":
+    asyncio.run(main())
```
