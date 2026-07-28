# openai/openai-agents-python · examples/basic/stream_function_call_args.py

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [openai/openai-agents-python](https://github.com/openai/openai-agents-python) |
| 来源文件 | [examples/basic/stream_function_call_args.py](https://github.com/openai/openai-agents-python/blob/969c4ed4e9339b9379f520e645b98a25429c224b/examples/basic/stream_function_call_args.py) |
| 来源版本 | `969c4ed4e9339b9379f520e645b98a25429c224b` |
| 摄取时间 | `2026-07-11T06:08:44.707957+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_openai_openai_agents_python_examples_basic_stream_function_call_args_py_969c4ed4e933` |

## 本次变化

- 新增行数 `87`.
- 删除行数 `0`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- 未发现 Markdown 标题.

<details>
<summary>展开完整外部原文</summary>

import asyncio
from typing import Annotated, Any

from openai.types.responses import ResponseFunctionCallArgumentsDeltaEvent

from agents import Agent, Runner, function_tool


@function_tool
def write_file(filename: Annotated[str, "Name of the file"], content: str) -> str:
    """Write content to a file."""
    return f"File {filename} written successfully"


@function_tool
def create_config(
    project_name: Annotated[str, "Project name"],
    version: Annotated[str, "Project version"],
    dependencies: Annotated[list[str] | None, "Dependencies (list of packages)"],
) -> str:
    """Generate a project configuration file."""
    return f"Config for {project_name} v{version} created"


async def main():
    """
    Demonstrates real-time streaming of function call arguments.

    Function arguments are streamed incrementally as they are generated,
    providing immediate feedback during parameter generation.
    """
    agent = Agent(
        name="CodeGenerator",
        instructions="You are a helpful coding assistant. Use the provided tools to create files and configurations.",
        tools=[write_file, create_config],
    )

    print("🚀 Function Call Arguments Streaming Demo")

    result = Runner.run_streamed(
        agent,
        input="Create a Python web project called 'my-app' with FastAPI. Version 1.0.0, dependencies: fastapi, uvicorn",
    )

    # Track function calls for detailed output
    function_calls: dict[Any, dict[str, Any]] = {}  # call_id -> {name, arguments}
    current_active_call_id = None

    async for event in result.stream_events():
        if event.type == "raw_response_event":
            # Function call started
            if event.data.type == "response.output_item.added":
                if getattr(event.data.item, "type", None) == "function_call":
                    function_name = getattr(event.data.item, "name", "unknown")
                    call_id = getattr(event.data.item, "call_id", "unknown")

                    function_calls[call_id] = {"name": function_name, "arguments": ""}
                    current_active_call_id = call_id
                    print(f"\n📞 Function call streaming started: {function_name}()")
                    print("📝 Arguments building...")

            # Real-time argument streaming
            elif isinstance(event.data, ResponseFunctionCallArgumentsDeltaEvent):
                if current_active_call_id and current_active_call_id in function_calls:
                    function_calls[current_active_call_id]["arguments"] += event.data.delta
                    print(event.data.delta, end="", flush=True)

            # Function call completed
            elif event.data.type == "response.output_item.done":
                if hasattr(event.data.item, "call_id"):
                    call_id = getattr(event.data.item, "call_id", "unknown")
                    if call_id in function_calls:
                        function_info = function_calls[call_id]
                        print(f"\n✅ Function call streaming completed: {function_info['name']}")
                        print()
                        if current_active_call_id == call_id:
                            current_active_call_id = None

    print("Summary of all function calls:")
    for call_id, info in function_calls.items():
        print(f"  - #{call_id}: {info['name']}({info['arguments']})")

    print(f"\nResult: {result.final_output}")


if __name__ == "__main__":
    asyncio.run(main())

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ 969c4ed4e9339b9379f520e645b98a25429c224b

@@ -0,0 +1,87 @@

+import asyncio
+from typing import Annotated, Any
+
+from openai.types.responses import ResponseFunctionCallArgumentsDeltaEvent
+
+from agents import Agent, Runner, function_tool
+
+
+@function_tool
+def write_file(filename: Annotated[str, "Name of the file"], content: str) -> str:
+    """Write content to a file."""
+    return f"File {filename} written successfully"
+
+
+@function_tool
+def create_config(
+    project_name: Annotated[str, "Project name"],
+    version: Annotated[str, "Project version"],
+    dependencies: Annotated[list[str] | None, "Dependencies (list of packages)"],
+) -> str:
+    """Generate a project configuration file."""
+    return f"Config for {project_name} v{version} created"
+
+
+async def main():
+    """
+    Demonstrates real-time streaming of function call arguments.
+
+    Function arguments are streamed incrementally as they are generated,
+    providing immediate feedback during parameter generation.
+    """
+    agent = Agent(
+        name="CodeGenerator",
+        instructions="You are a helpful coding assistant. Use the provided tools to create files and configurations.",
+        tools=[write_file, create_config],
+    )
+
+    print("🚀 Function Call Arguments Streaming Demo")
+
+    result = Runner.run_streamed(
+        agent,
+        input="Create a Python web project called 'my-app' with FastAPI. Version 1.0.0, dependencies: fastapi, uvicorn",
+    )
+
+    # Track function calls for detailed output
+    function_calls: dict[Any, dict[str, Any]] = {}  # call_id -> {name, arguments}
+    current_active_call_id = None
+
+    async for event in result.stream_events():
+        if event.type == "raw_response_event":
+            # Function call started
+            if event.data.type == "response.output_item.added":
+                if getattr(event.data.item, "type", None) == "function_call":
+                    function_name = getattr(event.data.item, "name", "unknown")
+                    call_id = getattr(event.data.item, "call_id", "unknown")
+
+                    function_calls[call_id] = {"name": function_name, "arguments": ""}
+                    current_active_call_id = call_id
+                    print(f"\n📞 Function call streaming started: {function_name}()")
+                    print("📝 Arguments building...")
+
+            # Real-time argument streaming
+            elif isinstance(event.data, ResponseFunctionCallArgumentsDeltaEvent):
+                if current_active_call_id and current_active_call_id in function_calls:
+                    function_calls[current_active_call_id]["arguments"] += event.data.delta
+                    print(event.data.delta, end="", flush=True)
+
+            # Function call completed
+            elif event.data.type == "response.output_item.done":
+                if hasattr(event.data.item, "call_id"):
+                    call_id = getattr(event.data.item, "call_id", "unknown")
+                    if call_id in function_calls:
+                        function_info = function_calls[call_id]
+                        print(f"\n✅ Function call streaming completed: {function_info['name']}")
+                        print()
+                        if current_active_call_id == call_id:
+                            current_active_call_id = None
+
+    print("Summary of all function calls:")
+    for call_id, info in function_calls.items():
+        print(f"  - #{call_id}: {info['name']}({info['arguments']})")
+
+    print(f"\nResult: {result.final_output}")
+
+
+if __name__ == "__main__":
+    asyncio.run(main())
```

</details>
