# openai/openai-agents-python · examples/basic/dynamic_system_prompt.py

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [openai/openai-agents-python](https://github.com/openai/openai-agents-python) |
| 来源文件 | [examples/basic/dynamic_system_prompt.py](https://github.com/openai/openai-agents-python/blob/d9a99bd378ffa0eaf6b887591261a6eb16fed149/examples/basic/dynamic_system_prompt.py) |
| 来源版本 | `d9a99bd378ffa0eaf6b887591261a6eb16fed149` |
| 摄取时间 | `2026-07-11T06:08:42.096928+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_openai_openai_agents_python_examples_basic_dynamic_system_prompt_py_d9a99bd378ff` |

## 本次变化

- 新增行数 `70`.
- 删除行数 `0`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- 未发现 Markdown 标题.

<details>
<summary>展开完整外部原文</summary>

import asyncio
import random
from dataclasses import dataclass
from typing import Literal

from agents import Agent, RunContextWrapper, Runner


@dataclass
class CustomContext:
    style: Literal["haiku", "pirate", "robot"]


def custom_instructions(
    run_context: RunContextWrapper[CustomContext], agent: Agent[CustomContext]
) -> str:
    context = run_context.context
    if context.style == "haiku":
        return "Only respond in haikus."
    elif context.style == "pirate":
        return "Respond as a pirate."
    else:
        return "Respond as a robot and say 'beep boop' a lot."


agent = Agent(
    name="Chat agent",
    instructions=custom_instructions,
)


async def main():
    context = CustomContext(style=random.choice(["haiku", "pirate", "robot"]))
    print(f"Using style: {context.style}\n")

    user_message = "Tell me a joke."
    print(f"User: {user_message}")
    result = await Runner.run(agent, user_message, context=context)

    print(f"Assistant: {result.final_output}")


if __name__ == "__main__":
    asyncio.run(main())


"""
$ python examples/basic/dynamic_system_prompt.py

Using style: haiku

User: Tell me a joke.
Assistant: Why don't eggs tell jokes?
They might crack each other's shells,
leaving yolk on face.

$ python examples/basic/dynamic_system_prompt.py
Using style: robot

User: Tell me a joke.
Assistant: Beep boop! Why was the robot so bad at soccer? Beep boop... because it kept kicking up a debug! Beep boop!

$ python examples/basic/dynamic_system_prompt.py
Using style: pirate

User: Tell me a joke.
Assistant: Why did the pirate go to school?

To improve his arrr-ticulation! Har har har! 🏴‍☠️
"""

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ d9a99bd378ffa0eaf6b887591261a6eb16fed149

@@ -0,0 +1,70 @@

+import asyncio
+import random
+from dataclasses import dataclass
+from typing import Literal
+
+from agents import Agent, RunContextWrapper, Runner
+
+
+@dataclass
+class CustomContext:
+    style: Literal["haiku", "pirate", "robot"]
+
+
+def custom_instructions(
+    run_context: RunContextWrapper[CustomContext], agent: Agent[CustomContext]
+) -> str:
+    context = run_context.context
+    if context.style == "haiku":
+        return "Only respond in haikus."
+    elif context.style == "pirate":
+        return "Respond as a pirate."
+    else:
+        return "Respond as a robot and say 'beep boop' a lot."
+
+
+agent = Agent(
+    name="Chat agent",
+    instructions=custom_instructions,
+)
+
+
+async def main():
+    context = CustomContext(style=random.choice(["haiku", "pirate", "robot"]))
+    print(f"Using style: {context.style}\n")
+
+    user_message = "Tell me a joke."
+    print(f"User: {user_message}")
+    result = await Runner.run(agent, user_message, context=context)
+
+    print(f"Assistant: {result.final_output}")
+
+
+if __name__ == "__main__":
+    asyncio.run(main())
+
+
+"""
+$ python examples/basic/dynamic_system_prompt.py
+
+Using style: haiku
+
+User: Tell me a joke.
+Assistant: Why don't eggs tell jokes?
+They might crack each other's shells,
+leaving yolk on face.
+
+$ python examples/basic/dynamic_system_prompt.py
+Using style: robot
+
+User: Tell me a joke.
+Assistant: Beep boop! Why was the robot so bad at soccer? Beep boop... because it kept kicking up a debug! Beep boop!
+
+$ python examples/basic/dynamic_system_prompt.py
+Using style: pirate
+
+User: Tell me a joke.
+Assistant: Why did the pirate go to school?
+
+To improve his arrr-ticulation! Har har har! 🏴‍☠️
+"""
```

</details>
