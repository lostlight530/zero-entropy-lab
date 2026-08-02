# openai/openai-agents-python · examples/mcp/sse_example/main.py

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [openai/openai-agents-python](https://github.com/openai/openai-agents-python) |
| 来源文件 | [examples/mcp/sse_example/main.py](https://github.com/openai/openai-agents-python/blob/bfcfcfc9d807c69a939ce4ab7f1be8e13e18e577/examples/mcp/sse_example/main.py) |
| 来源版本 | `bfcfcfc9d807c69a939ce4ab7f1be8e13e18e577` |
| 来源目录 Tree | `fd30cbc1ad8920bfe04652e325914ea4cd0bb3fb` |
| 来源内容 Blob | `a282153b8c927abb5d57c737c46059e96f3af437` |
| 摄取时间 | `2026-08-02T22:43:36.212572+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_openai_openai_agents_python_examples_mcp_sse_example_main_py_8180914cd352` |

## 本次变化

- 新增行数 `6`.
- 删除行数 `1`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- 未发现 Markdown 标题.

<details>
<summary>展开完整外部原文</summary>

import asyncio
import os
import shutil
import socket
import subprocess
import time
from typing import Any, cast

from agents import Agent, Runner, gen_trace_id, trace
from agents.mcp import MCPServer, MCPServerSse
from agents.model_settings import ModelSettings

SSE_HOST = os.getenv("SSE_HOST", "127.0.0.1")


def _choose_port() -> int:
    env_port = os.getenv("SSE_PORT")
    if env_port:
        return int(env_port)
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind((SSE_HOST, 0))
        address = cast(tuple[str, int], s.getsockname())
        return address[1]


SSE_PORT = _choose_port()
os.environ.setdefault("SSE_PORT", str(SSE_PORT))
SSE_URL = f"http://{SSE_HOST}:{SSE_PORT}/sse"


async def run(mcp_server: MCPServer):
    agent = Agent(
        name="Assistant",
        instructions="Use the tools to answer the questions.",
        mcp_servers=[mcp_server],
        model_settings=ModelSettings(tool_choice="required"),
    )

    # Use the `add` tool to add two numbers
    message = "Add these numbers: 7 and 22."
    print(f"Running: {message}")
    result = await Runner.run(starting_agent=agent, input=message)
    print(result.final_output)

    # Run the `get_weather` tool
    message = "What's the weather in Tokyo?"
    print(f"\n\nRunning: {message}")
    result = await Runner.run(starting_agent=agent, input=message)
    print(result.final_output)

    # Run the `get_secret_word` tool
    message = "What's the secret word?"
    print(f"\n\nRunning: {message}")
    result = await Runner.run(starting_agent=agent, input=message)
    print(result.final_output)


async def main():
    async with MCPServerSse(
        name="SSE Python Server",
        params={
            "url": SSE_URL,
        },
    ) as server:
        trace_id = gen_trace_id()
        with trace(workflow_name="SSE Example", trace_id=trace_id):
            print(f"View trace: https://platform.openai.com/logs/trace?trace_id={trace_id}\n")
            await run(server)


if __name__ == "__main__":
    # Let's make sure the user has uv installed
    if not shutil.which("uv"):
        raise RuntimeError(
            "uv is not installed. Please install it: https://docs.astral.sh/uv/getting-started/installation/"
        )

    # We'll run the SSE server in a subprocess. Usually this would be a remote server, but for this
    # demo, we'll run it locally at SSE_URL.
    process: subprocess.Popen[Any] | None = None
    try:
        this_dir = os.path.dirname(os.path.abspath(__file__))
        server_file = os.path.join(this_dir, "server.py")

        print(f"Starting SSE server at {SSE_URL} ...")

        # Run `uv run server.py` to start the SSE server
        env = os.environ.copy()
        env.setdefault("SSE_HOST", SSE_HOST)
        env.setdefault("SSE_PORT", str(SSE_PORT))
        process = subprocess.Popen(["uv", "run", server_file], env=env)
        # Give it 3 seconds to start
        time.sleep(3)

        print("SSE server started. Running example...\n\n")
    except Exception as e:
        print(f"Error starting SSE server: {e}")
        exit(1)

    try:
        asyncio.run(main())
    finally:
        if process:
            process.terminate()
            try:
                process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                process.kill()
                process.wait()

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ a282153b8c927abb5d57c737c46059e96f3af437

@@ -64,7 +64,7 @@

     ) as server:
         trace_id = gen_trace_id()
         with trace(workflow_name="SSE Example", trace_id=trace_id):
-            print(f"View trace: https://platform.openai.com/traces/trace?trace_id={trace_id}\n")
+            print(f"View trace: https://platform.openai.com/logs/trace?trace_id={trace_id}\n")
             await run(server)
 
 
@@ -102,3 +102,8 @@

     finally:
         if process:
             process.terminate()
+            try:
+                process.wait(timeout=5)
+            except subprocess.TimeoutExpired:
+                process.kill()
+                process.wait()
```

</details>
