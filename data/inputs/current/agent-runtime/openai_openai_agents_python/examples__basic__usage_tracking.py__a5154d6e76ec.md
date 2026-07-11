PROVENANCE: {"confidence": 1.0, "entity_id": "doc_openai_openai_agents_python_examples_basic_usage_tracking_py_a5154d6e76ec", "primary_owner": "zero", "retrieved_at": "2026-07-11T06:08:45.489836+00:00", "source_path": "examples/basic/usage_tracking.py", "source_repo": "openai/openai-agents-python", "source_sha": "a5154d6e76ec888189dcd73a8271cebae56fb122"}

# Source Document

import asyncio

from pydantic import BaseModel

from agents import Agent, Runner, Usage, function_tool


class Weather(BaseModel):
    city: str
    temperature_range: str
    conditions: str


@function_tool
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


# Document Diff

```diff
--- previous

+++ a5154d6e76ec888189dcd73a8271cebae56fb122

@@ -0,0 +1,47 @@

+import asyncio
+
+from pydantic import BaseModel
+
+from agents import Agent, Runner, Usage, function_tool
+
+
+class Weather(BaseModel):
+    city: str
+    temperature_range: str
+    conditions: str
+
+
+@function_tool
+def get_weather(city: str) -> Weather:
+    """Get the current weather information for a specified city."""
+    return Weather(city=city, temperature_range="14-20C", conditions="Sunny with wind.")
+
+
+def print_usage(usage: Usage) -> None:
+    print("\n=== Usage ===")
+    print(f"Input tokens: {usage.input_tokens}")
+    print(f"Output tokens: {usage.output_tokens}")
+    print(f"Total tokens: {usage.total_tokens}")
+    print(f"Requests: {usage.requests}")
+    for i, request in enumerate(usage.request_usage_entries):
+        print(f"  {i + 1}: {request.input_tokens} input, {request.output_tokens} output")
+
+
+async def main() -> None:
+    agent = Agent(
+        name="Usage Demo",
+        instructions="You are a concise assistant. Use tools if needed.",
+        tools=[get_weather],
+    )
+
+    result = await Runner.run(agent, "What's the weather in Tokyo?")
+
+    print("\nFinal output:")
+    print(result.final_output)
+
+    # Access usage from the run context
+    print_usage(result.context_wrapper.usage)
+
+
+if __name__ == "__main__":
+    asyncio.run(main())
```
