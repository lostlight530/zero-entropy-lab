# openai/openai-agents-python · examples/basic/hello_world_gpt_oss.py

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [openai/openai-agents-python](https://github.com/openai/openai-agents-python) |
| 来源文件 | [examples/basic/hello_world_gpt_oss.py](https://github.com/openai/openai-agents-python/blob/aeb599a1df908948e5f676a5d0556dcbaa029802/examples/basic/hello_world_gpt_oss.py) |
| 来源版本 | `aeb599a1df908948e5f676a5d0556dcbaa029802` |
| 摄取时间 | `2026-07-11T06:08:42.502554+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_openai_openai_agents_python_examples_basic_hello_world_gpt_oss_py_aeb599a1df90` |

## 本次变化

- 新增行数 `39`.
- 删除行数 `0`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- import logging
- logging.basicConfig(level=logging.DEBUG)
- This is an example of how to use gpt-oss with Ollama.
- Refer to https://cookbook.openai.com/articles/gpt-oss/run-locally-ollama for more details.
- If you prefer using LM Studio, refer to https://cookbook.openai.com/articles/gpt-oss/run-locally-lmstudio

<details>
<summary>展开完整外部原文</summary>

import asyncio

from openai import AsyncOpenAI

from agents import Agent, OpenAIChatCompletionsModel, Runner, set_tracing_disabled

set_tracing_disabled(True)

# import logging
# logging.basicConfig(level=logging.DEBUG)

# This is an example of how to use gpt-oss with Ollama.
# Refer to https://cookbook.openai.com/articles/gpt-oss/run-locally-ollama for more details.
# If you prefer using LM Studio, refer to https://cookbook.openai.com/articles/gpt-oss/run-locally-lmstudio
gpt_oss_model = OpenAIChatCompletionsModel(
    model="gpt-oss:20b",
    openai_client=AsyncOpenAI(
        base_url="http://localhost:11434/v1",
        api_key="ollama",
    ),
)


async def main():
    # Note that using a custom outputType for an agent may not work well with gpt-oss models.
    # Consider going with the default "text" outputType.
    # See also: https://github.com/openai/openai-agents-python/issues/1414
    agent = Agent(
        name="Assistant",
        instructions="You're a helpful assistant. You provide a concise answer to the user's question.",
        model=gpt_oss_model,
    )

    result = await Runner.run(agent, "Tell me about recursion in programming.")
    print(result.final_output)


if __name__ == "__main__":
    asyncio.run(main())

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ aeb599a1df908948e5f676a5d0556dcbaa029802

@@ -0,0 +1,39 @@

+import asyncio
+
+from openai import AsyncOpenAI
+
+from agents import Agent, OpenAIChatCompletionsModel, Runner, set_tracing_disabled
+
+set_tracing_disabled(True)
+
+# import logging
+# logging.basicConfig(level=logging.DEBUG)
+
+# This is an example of how to use gpt-oss with Ollama.
+# Refer to https://cookbook.openai.com/articles/gpt-oss/run-locally-ollama for more details.
+# If you prefer using LM Studio, refer to https://cookbook.openai.com/articles/gpt-oss/run-locally-lmstudio
+gpt_oss_model = OpenAIChatCompletionsModel(
+    model="gpt-oss:20b",
+    openai_client=AsyncOpenAI(
+        base_url="http://localhost:11434/v1",
+        api_key="ollama",
+    ),
+)
+
+
+async def main():
+    # Note that using a custom outputType for an agent may not work well with gpt-oss models.
+    # Consider going with the default "text" outputType.
+    # See also: https://github.com/openai/openai-agents-python/issues/1414
+    agent = Agent(
+        name="Assistant",
+        instructions="You're a helpful assistant. You provide a concise answer to the user's question.",
+        model=gpt_oss_model,
+    )
+
+    result = await Runner.run(agent, "Tell me about recursion in programming.")
+    print(result.final_output)
+
+
+if __name__ == "__main__":
+    asyncio.run(main())
```

</details>
