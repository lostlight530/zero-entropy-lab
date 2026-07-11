# openai/openai-agents-python · examples/basic/hello_world_gpt_5.py

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [openai/openai-agents-python](https://github.com/openai/openai-agents-python) |
| 来源文件 | [examples/basic/hello_world_gpt_5.py](https://github.com/openai/openai-agents-python/blob/6b33be4d85060bcde8fcaa209898e9e35ecb753c/examples/basic/hello_world_gpt_5.py) |
| 来源版本 | `6b33be4d85060bcde8fcaa209898e9e35ecb753c` |
| 摄取时间 | `2026-07-11T06:08:42.377009+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_openai_openai_agents_python_examples_basic_hello_world_gpt_5_py_6b33be4d8506` |

## 本次变化

- 新增行数 `30`.
- 删除行数 `0`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- If you have a certain reason to use Chat Completions, you can configure the model this way,
- and then you can pass the chat_completions_model to the Agent constructor.
- from openai import AsyncOpenAI
- client = AsyncOpenAI()
- from agents import OpenAIChatCompletionsModel
- chat_completions_model = OpenAIChatCompletionsModel(model="gpt-5.6-sol", openai_client=client)

<details>
<summary>展开完整外部原文</summary>

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

</details>

<details>
<summary>展开完整版本差异</summary>

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

</details>
