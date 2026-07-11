PROVENANCE: {"confidence": 1.0, "entity_id": "doc_openai_openai_agents_python_examples_basic_non_strict_output_type_py_fcb7e4f38bff", "primary_owner": "zero", "retrieved_at": "2026-07-11T06:08:43.757666+00:00", "source_path": "examples/basic/non_strict_output_type.py", "source_repo": "openai/openai-agents-python", "source_sha": "fcb7e4f38bffc200ed1ef7df4fc50be523d1378a"}

# Source Document

import asyncio
import json
from dataclasses import dataclass
from typing import Any

from agents import Agent, AgentOutputSchema, AgentOutputSchemaBase, ModelBehaviorError, Runner

"""This example demonstrates how to use an output type that is not in strict mode. Strict mode
allows us to guarantee valid JSON output, but some schemas are not strict-compatible.

In this example, we define an output type that is not strict-compatible, and then we run the
agent with strict_json_schema=False.

We also demonstrate a custom output type.

To understand which schemas are strict-compatible, see:
https://platform.openai.com/docs/guides/structured-outputs?api-mode=responses#supported-schemas
"""


@dataclass
class OutputType:
    jokes: dict[int, str]
    """A list of jokes, indexed by joke number."""


class CustomOutputSchema(AgentOutputSchemaBase):
    """A demonstration of a custom output schema."""

    def is_plain_text(self) -> bool:
        return False

    def name(self) -> str:
        return "CustomOutputSchema"

    def json_schema(self) -> dict[str, Any]:
        return {
            "type": "object",
            "properties": {"jokes": {"type": "object", "properties": {"joke": {"type": "string"}}}},
        }

    def is_strict_json_schema(self) -> bool:
        return False

    def validate_json(self, json_str: str) -> Any:
        json_obj = json.loads(json_str)
        # Just for demonstration, we'll return a list.
        return list(json_obj["jokes"].values())


async def main():
    agent = Agent(
        name="Assistant",
        instructions="You are a helpful assistant.",
        output_type=OutputType,
    )

    input = "Tell me 3 short jokes."

    # First, let's try with a strict output type. This should raise an exception.
    try:
        result = await Runner.run(agent, input)
        raise AssertionError("Should have raised an exception")
    except Exception as e:
        print(f"Error (expected): {e}")

    # Now let's try again with a non-strict output type. This should work.
    # In some cases, it will raise an error - the schema isn't strict, so the model may
    # produce an invalid JSON object.
    agent.output_type = AgentOutputSchema(OutputType, strict_json_schema=False)
    try:
        result = await Runner.run(agent, input)
        print(result.final_output)
    except ModelBehaviorError as e:
        print(f"Non-strict output validation failed (expected possibility): {e}")

    # Finally, let's try a custom output type.
    agent.output_type = CustomOutputSchema()
    result = await Runner.run(agent, input)
    print(result.final_output)


if __name__ == "__main__":
    asyncio.run(main())


# Document Diff

```diff
--- previous

+++ fcb7e4f38bffc200ed1ef7df4fc50be523d1378a

@@ -0,0 +1,84 @@

+import asyncio
+import json
+from dataclasses import dataclass
+from typing import Any
+
+from agents import Agent, AgentOutputSchema, AgentOutputSchemaBase, ModelBehaviorError, Runner
+
+"""This example demonstrates how to use an output type that is not in strict mode. Strict mode
+allows us to guarantee valid JSON output, but some schemas are not strict-compatible.
+
+In this example, we define an output type that is not strict-compatible, and then we run the
+agent with strict_json_schema=False.
+
+We also demonstrate a custom output type.
+
+To understand which schemas are strict-compatible, see:
+https://platform.openai.com/docs/guides/structured-outputs?api-mode=responses#supported-schemas
+"""
+
+
+@dataclass
+class OutputType:
+    jokes: dict[int, str]
+    """A list of jokes, indexed by joke number."""
+
+
+class CustomOutputSchema(AgentOutputSchemaBase):
+    """A demonstration of a custom output schema."""
+
+    def is_plain_text(self) -> bool:
+        return False
+
+    def name(self) -> str:
+        return "CustomOutputSchema"
+
+    def json_schema(self) -> dict[str, Any]:
+        return {
+            "type": "object",
+            "properties": {"jokes": {"type": "object", "properties": {"joke": {"type": "string"}}}},
+        }
+
+    def is_strict_json_schema(self) -> bool:
+        return False
+
+    def validate_json(self, json_str: str) -> Any:
+        json_obj = json.loads(json_str)
+        # Just for demonstration, we'll return a list.
+        return list(json_obj["jokes"].values())
+
+
+async def main():
+    agent = Agent(
+        name="Assistant",
+        instructions="You are a helpful assistant.",
+        output_type=OutputType,
+    )
+
+    input = "Tell me 3 short jokes."
+
+    # First, let's try with a strict output type. This should raise an exception.
+    try:
+        result = await Runner.run(agent, input)
+        raise AssertionError("Should have raised an exception")
+    except Exception as e:
+        print(f"Error (expected): {e}")
+
+    # Now let's try again with a non-strict output type. This should work.
+    # In some cases, it will raise an error - the schema isn't strict, so the model may
+    # produce an invalid JSON object.
+    agent.output_type = AgentOutputSchema(OutputType, strict_json_schema=False)
+    try:
+        result = await Runner.run(agent, input)
+        print(result.final_output)
+    except ModelBehaviorError as e:
+        print(f"Non-strict output validation failed (expected possibility): {e}")
+
+    # Finally, let's try a custom output type.
+    agent.output_type = CustomOutputSchema()
+    result = await Runner.run(agent, input)
+    print(result.final_output)
+
+
+if __name__ == "__main__":
+    asyncio.run(main())
```
