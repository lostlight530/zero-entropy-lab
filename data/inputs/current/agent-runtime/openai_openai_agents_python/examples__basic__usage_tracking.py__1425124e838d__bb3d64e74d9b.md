# openai/openai-agents-python · examples/basic/usage_tracking.py

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [openai/openai-agents-python](https://github.com/openai/openai-agents-python) |
| 来源文件 | [examples/basic/usage_tracking.py](https://github.com/openai/openai-agents-python/blob/bb3d64e74d9b92831aaa7e10cecbb0bfd6fa50c1/examples/basic/usage_tracking.py) |
| 来源版本 | `bb3d64e74d9b92831aaa7e10cecbb0bfd6fa50c1` |
| 来源目录 Tree | `6619014cb5e3c71b86bae8fa1b2514c9d73d8f76` |
| 来源内容 Blob | `1425124e838dde7dfd5457be08ea8e0b2f64d9bf` |
| 摄取时间 | `2026-07-28T07:52:15.054332+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_openai_openai_agents_python_examples_basic_usage_tracking_py_a5154d6e76ec` |

## 本次变化

- 新增行数 `7`.
- 删除行数 `2`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- 未发现 Markdown 标题.

<details>
<summary>展开完整外部原文</summary>

import asyncio

from pydantic import BaseModel

from agents import (
    Agent,
    Runner,
    Usage,
)
from agents.decorators import tool


class Weather(BaseModel):
    city: str
    temperature_range: str
    conditions: str


@tool
def get_weather(city: str) -> Weather:
    """Get the current weather information for a specified city."""
    return Weather(city=city, temperature_range="14-20C", conditions="Sunny with wind.")


def print_usage(usage: Usage) -> None:
    print("\n=== Usage ===")
    print(f"Input tokens: {usage.input_tokens}")
    print(f"Output tokens: {usage.output_tokens}")
    print(f"Total tokens: {usage.total_tokens}")
    print(f"Requests: {usage.requests}")
    for i, request in enumerate(usage.request_usage_entries):
        print(f"  {i + 1}: {request.input_tokens} input, {request.output_tokens} output")


async def main() -> None:
    agent = Agent(
        name="Usage Demo",
        instructions="You are a concise assistant. Use tools if needed.",
        tools=[get_weather],
    )

    result = await Runner.run(agent, "What's the weather in Tokyo?")

    print("\nFinal output:")
    print(result.final_output)

    # Access usage from the run context
    print_usage(result.context_wrapper.usage)


if __name__ == "__main__":
    asyncio.run(main())

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ 1425124e838dde7dfd5457be08ea8e0b2f64d9bf

@@ -2,7 +2,12 @@

 
 from pydantic import BaseModel
 
-from agents import Agent, Runner, Usage, function_tool
+from agents import (
+    Agent,
+    Runner,
+    Usage,
+)
+from agents.decorators import tool
 
 
 class Weather(BaseModel):
@@ -11,7 +16,7 @@

     conditions: str
 
 
-@function_tool
+@tool
 def get_weather(city: str) -> Weather:
     """Get the current weather information for a specified city."""
     return Weather(city=city, temperature_range="14-20C", conditions="Sunny with wind.")
```

</details>
