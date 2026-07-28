# openai/openai-agents-python · examples/basic/prompt_template.py

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [openai/openai-agents-python](https://github.com/openai/openai-agents-python) |
| 来源文件 | [examples/basic/prompt_template.py](https://github.com/openai/openai-agents-python/blob/11fbaa0d301512f25d4da5e562bc3ef091bc0ac4/examples/basic/prompt_template.py) |
| 来源版本 | `11fbaa0d301512f25d4da5e562bc3ef091bc0ac4` |
| 摄取时间 | `2026-07-11T06:08:44.018427+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_openai_openai_agents_python_examples_basic_prompt_template_py_11fbaa0d3015` |

## 本次变化

- 新增行数 `79`.
- 删除行数 `0`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- 未发现 Markdown 标题.

<details>
<summary>展开完整外部原文</summary>

import argparse
import asyncio
import random

from agents import Agent, GenerateDynamicPromptData, Runner

"""
NOTE: This example will not work out of the box, because the default prompt ID will not be available
in your project.

To use it, please:
1. Go to https://platform.openai.com/playground/prompts
2. Create a new prompt variable, `poem_style`.
3. Create a system prompt with the content:
```
Write a poem in {{poem_style}}
```
4. Run the example with the `--prompt-id` flag.
"""

DEFAULT_PROMPT_ID = "pmpt_6965a984c7ac8194a8f4e79b00f838840118c1e58beb3332"


class DynamicContext:
    def __init__(self, prompt_id: str):
        self.prompt_id = prompt_id
        self.poem_style = random.choice(["limerick", "haiku", "ballad"])
        print(f"[debug] DynamicContext initialized with poem_style: {self.poem_style}")


async def _get_dynamic_prompt(data: GenerateDynamicPromptData):
    ctx: DynamicContext = data.context.context
    return {
        "id": ctx.prompt_id,
        "version": "1",
        "variables": {
            "poem_style": ctx.poem_style,
        },
    }


async def dynamic_prompt(prompt_id: str):
    context = DynamicContext(prompt_id)

    agent = Agent(
        name="Assistant",
        prompt=_get_dynamic_prompt,
    )

    result = await Runner.run(agent, "Tell me about recursion in programming.", context=context)
    print(result.final_output)


async def static_prompt(prompt_id: str):
    agent = Agent(
        name="Assistant",
        prompt={
            "id": prompt_id,
            "version": "1",
            "variables": {
                "poem_style": "limerick",
            },
        },
    )

    result = await Runner.run(agent, "Tell me about recursion in programming.")
    print(result.final_output)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--dynamic", action="store_true")
    parser.add_argument("--prompt-id", type=str, default=DEFAULT_PROMPT_ID)
    args = parser.parse_args()

    if args.dynamic:
        asyncio.run(dynamic_prompt(args.prompt_id))
    else:
        asyncio.run(static_prompt(args.prompt_id))

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ 11fbaa0d301512f25d4da5e562bc3ef091bc0ac4

@@ -0,0 +1,79 @@

+import argparse
+import asyncio
+import random
+
+from agents import Agent, GenerateDynamicPromptData, Runner
+
+"""
+NOTE: This example will not work out of the box, because the default prompt ID will not be available
+in your project.
+
+To use it, please:
+1. Go to https://platform.openai.com/playground/prompts
+2. Create a new prompt variable, `poem_style`.
+3. Create a system prompt with the content:
+```
+Write a poem in {{poem_style}}
+```
+4. Run the example with the `--prompt-id` flag.
+"""
+
+DEFAULT_PROMPT_ID = "pmpt_6965a984c7ac8194a8f4e79b00f838840118c1e58beb3332"
+
+
+class DynamicContext:
+    def __init__(self, prompt_id: str):
+        self.prompt_id = prompt_id
+        self.poem_style = random.choice(["limerick", "haiku", "ballad"])
+        print(f"[debug] DynamicContext initialized with poem_style: {self.poem_style}")
+
+
+async def _get_dynamic_prompt(data: GenerateDynamicPromptData):
+    ctx: DynamicContext = data.context.context
+    return {
+        "id": ctx.prompt_id,
+        "version": "1",
+        "variables": {
+            "poem_style": ctx.poem_style,
+        },
+    }
+
+
+async def dynamic_prompt(prompt_id: str):
+    context = DynamicContext(prompt_id)
+
+    agent = Agent(
+        name="Assistant",
+        prompt=_get_dynamic_prompt,
+    )
+
+    result = await Runner.run(agent, "Tell me about recursion in programming.", context=context)
+    print(result.final_output)
+
+
+async def static_prompt(prompt_id: str):
+    agent = Agent(
+        name="Assistant",
+        prompt={
+            "id": prompt_id,
+            "version": "1",
+            "variables": {
+                "poem_style": "limerick",
+            },
+        },
+    )
+
+    result = await Runner.run(agent, "Tell me about recursion in programming.")
+    print(result.final_output)
+
+
+if __name__ == "__main__":
+    parser = argparse.ArgumentParser()
+    parser.add_argument("--dynamic", action="store_true")
+    parser.add_argument("--prompt-id", type=str, default=DEFAULT_PROMPT_ID)
+    args = parser.parse_args()
+
+    if args.dynamic:
+        asyncio.run(dynamic_prompt(args.prompt_id))
+    else:
+        asyncio.run(static_prompt(args.prompt_id))
```

</details>
