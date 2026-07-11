PROVENANCE: {"confidence": 1.0, "entity_id": "doc_openai_openai_agents_python_examples_basic_tools_py_2052d9427db3", "primary_owner": "zero", "retrieved_at": "2026-07-11T06:08:45.354381+00:00", "source_path": "examples/basic/tools.py", "source_repo": "openai/openai-agents-python", "source_sha": "2052d9427db38b2d013ab8a775adfd5803180b7c"}

# Source Document

import asyncio
from typing import Annotated

from pydantic import BaseModel, Field

from agents import Agent, Runner, function_tool


class Weather(BaseModel):
    city: str = Field(description="The city name")
    temperature_range: str = Field(description="The temperature range in Celsius")
    conditions: str = Field(description="The weather conditions")


@function_tool
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


# Document Diff

```diff
--- previous

+++ 2052d9427db38b2d013ab8a775adfd5803180b7c

@@ -0,0 +1,36 @@

+import asyncio
+from typing import Annotated
+
+from pydantic import BaseModel, Field
+
+from agents import Agent, Runner, function_tool
+
+
+class Weather(BaseModel):
+    city: str = Field(description="The city name")
+    temperature_range: str = Field(description="The temperature range in Celsius")
+    conditions: str = Field(description="The weather conditions")
+
+
+@function_tool
+def get_weather(city: Annotated[str, "The city to get the weather for"]) -> Weather:
+    """Get the current weather information for a specified city."""
+    print("[debug] get_weather called")
+    return Weather(city=city, temperature_range="14-20C", conditions="Sunny with wind.")
+
+
+agent = Agent(
+    name="Hello world",
+    instructions="You are a helpful agent.",
+    tools=[get_weather],
+)
+
+
+async def main():
+    result = await Runner.run(agent, input="What's the weather in Tokyo?")
+    print(result.final_output)
+    # The weather in Tokyo is sunny.
+
+
+if __name__ == "__main__":
+    asyncio.run(main())
```
