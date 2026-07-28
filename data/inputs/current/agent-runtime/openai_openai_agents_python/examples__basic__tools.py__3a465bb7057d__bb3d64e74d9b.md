# openai/openai-agents-python · examples/basic/tools.py

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [openai/openai-agents-python](https://github.com/openai/openai-agents-python) |
| 来源文件 | [examples/basic/tools.py](https://github.com/openai/openai-agents-python/blob/bb3d64e74d9b92831aaa7e10cecbb0bfd6fa50c1/examples/basic/tools.py) |
| 来源版本 | `bb3d64e74d9b92831aaa7e10cecbb0bfd6fa50c1` |
| 来源目录 Tree | `6619014cb5e3c71b86bae8fa1b2514c9d73d8f76` |
| 来源内容 Blob | `3a465bb7057d69a37fa7e64ff22ae5036d71bce0` |
| 摄取时间 | `2026-07-28T07:52:14.486102+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_openai_openai_agents_python_examples_basic_tools_py_2052d9427db3` |

## 本次变化

- 新增行数 `6`.
- 删除行数 `2`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- 未发现 Markdown 标题.

<details>
<summary>展开完整外部原文</summary>

import asyncio
from typing import Annotated

from pydantic import BaseModel, Field

from agents import (
    Agent,
    Runner,
)
from agents.decorators import tool


class Weather(BaseModel):
    city: str = Field(description="The city name")
    temperature_range: str = Field(description="The temperature range in Celsius")
    conditions: str = Field(description="The weather conditions")


@tool
def get_weather(city: Annotated[str, "The city to get the weather for"]) -> Weather:
    """Get the current weather information for a specified city."""
    print("[debug] get_weather called")
    return Weather(city=city, temperature_range="14-20C", conditions="Sunny with wind.")


agent = Agent(
    name="Hello world",
    instructions="You are a helpful agent.",
    tools=[get_weather],
)


async def main():
    result = await Runner.run(agent, input="What's the weather in Tokyo?")
    print(result.final_output)
    # The weather in Tokyo is sunny.


if __name__ == "__main__":
    asyncio.run(main())

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ 3a465bb7057d69a37fa7e64ff22ae5036d71bce0

@@ -3,7 +3,11 @@

 
 from pydantic import BaseModel, Field
 
-from agents import Agent, Runner, function_tool
+from agents import (
+    Agent,
+    Runner,
+)
+from agents.decorators import tool
 
 
 class Weather(BaseModel):
@@ -12,7 +16,7 @@

     conditions: str = Field(description="The weather conditions")
 
 
-@function_tool
+@tool
 def get_weather(city: Annotated[str, "The city to get the weather for"]) -> Weather:
     """Get the current weather information for a specified city."""
     print("[debug] get_weather called")
```

</details>
