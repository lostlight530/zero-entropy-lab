# openai/openai-agents-python · README.md

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [openai/openai-agents-python](https://github.com/openai/openai-agents-python) |
| 来源文件 | [README.md](https://github.com/openai/openai-agents-python/blob/a8acfe5b4cb7edbdac0d30a2ebb94122ef0287f8/README.md) |
| 来源版本 | `a8acfe5b4cb7edbdac0d30a2ebb94122ef0287f8` |
| 摄取时间 | `2026-07-11T06:08:41.835666+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_openai_openai_agents_python_readme_md_a8acfe5b4cb7` |

## 本次变化

- 新增行数 `149`.
- 删除行数 `0`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- OpenAI Agents SDK [![PyPI](https://img.shields.io/pypi/v/openai-agents?label=pypi%20package)](https://pypi.org/project/openai-agents/)
- Core concepts:
- Get started
- venv
- uv
- Run your first agents
- Run a sandbox agent
- Run a text agent
- Code within the code,
- Functions calling themselves,
- Infinite loop's dance.
- Run a realtime agent
- Acknowledgements

<details>
<summary>展开完整外部原文</summary>

# OpenAI Agents SDK [![PyPI](https://img.shields.io/pypi/v/openai-agents?label=pypi%20package)](https://pypi.org/project/openai-agents/)

The OpenAI Agents SDK is a lightweight yet powerful framework for building multi-agent workflows. It is provider-agnostic, supporting the OpenAI Responses and Chat Completions APIs, as well as 100+ other LLMs.

<img src="https://cdn.openai.com/API/docs/images/orchestration.png" alt="Image of the Agents Tracing UI" style="max-height: 803px;">

> [!NOTE]
> Looking for the JavaScript/TypeScript version? Check out [Agents SDK JS/TS](https://github.com/openai/openai-agents-js).

### Core concepts:

1. [**Agents**](https://openai.github.io/openai-agents-python/agents): LLMs configured with instructions, tools, guardrails, and handoffs
1. [**Sandbox Agents**](https://openai.github.io/openai-agents-python/sandbox_agents): Agents preconfigured to work with a container to perform work over long time horizons.
1. **[Agents as tools](https://openai.github.io/openai-agents-python/tools/#agents-as-tools) / [Handoffs](https://openai.github.io/openai-agents-python/handoffs/)**: Delegating to other agents for specific tasks
1. [**Tools**](https://openai.github.io/openai-agents-python/tools/): Various Tools let agents take actions (functions, MCP, hosted tools)
1. [**Guardrails**](https://openai.github.io/openai-agents-python/guardrails/): Configurable safety checks for input and output validation
1. [**Human in the loop**](https://openai.github.io/openai-agents-python/human_in_the_loop/): Built-in mechanisms for involving humans across agent runs
1. [**Sessions**](https://openai.github.io/openai-agents-python/sessions/): Automatic conversation history management across agent runs
1. [**Tracing**](https://openai.github.io/openai-agents-python/tracing/): Built-in tracking of agent runs, allowing you to view, debug and optimize your workflows
1. [**Realtime Agents**](https://openai.github.io/openai-agents-python/realtime/quickstart/): Build powerful voice agents with `gpt-realtime-2.1` and full agent features

Explore the [examples](https://github.com/openai/openai-agents-python/tree/main/examples) directory to see the SDK in action, and read our [documentation](https://openai.github.io/openai-agents-python/) for more details.

## Get started

To get started, set up your Python environment (Python 3.10 or newer required), and then install OpenAI Agents SDK package.

### venv

```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install openai-agents
```

For voice support, install with the optional `voice` group: `pip install 'openai-agents[voice]'`. For Redis session support, install with the optional `redis` group: `pip install 'openai-agents[redis]'`.

### uv

If you're familiar with [uv](https://docs.astral.sh/uv/), installing the package would be even easier:

```bash
uv init
uv add openai-agents
```

For voice support, install with the optional `voice` group: `uv add 'openai-agents[voice]'`. For Redis session support, install with the optional `redis` group: `uv add 'openai-agents[redis]'`.

## Run your first agents

The SDK supports three primary ways to run agents. Set the `OPENAI_API_KEY` environment variable before running any of these examples.

### Run a sandbox agent

Use a [`SandboxAgent`](https://openai.github.io/openai-agents-python/sandbox_agents) when the agent needs to inspect files, run commands, apply patches, or preserve workspace state across longer tasks.

```python
from agents import Runner
from agents.run import RunConfig
from agents.sandbox import Manifest, SandboxAgent, SandboxRunConfig
from agents.sandbox.entries import GitRepo
from agents.sandbox.sandboxes import UnixLocalSandboxClient

agent = SandboxAgent(
    name="Workspace Assistant",
    instructions="Inspect the sandbox workspace before answering.",
    default_manifest=Manifest(entries={"repo": GitRepo(repo="openai/openai-agents-python", ref="main")}),
)

result = Runner.run_sync(
    agent,
    "Inspect the repo README and summarize what this project does.",
    run_config=RunConfig(sandbox=SandboxRunConfig(client=UnixLocalSandboxClient())),
)
print(result.final_output)
```

### Run a text agent

Use a text `Agent` for workflows that do not need a persistent realtime connection or a sandbox workspace.

```python
from agents import Agent, Runner

agent = Agent(name="Assistant", instructions="You are a helpful assistant")

result = Runner.run_sync(agent, "Write a haiku about recursion in programming.")
print(result.final_output)

# Code within the code,
# Functions calling themselves,
# Infinite loop's dance.
```

(_For Jupyter notebook users, see [hello_world_jupyter.ipynb](https://github.com/openai/openai-agents-python/blob/main/examples/basic/hello_world_jupyter.ipynb)_)

### Run a realtime agent

Use a [`RealtimeAgent`](https://openai.github.io/openai-agents-python/realtime/quickstart/) for low-latency, server-side voice and multimodal experiences over WebSocket.

```python
import asyncio
from agents.realtime import RealtimeAgent, RealtimeRunner

async def main() -> None:
    agent = RealtimeAgent(name="Assistant", instructions="You are a helpful voice assistant. Keep responses short.")
    runner = RealtimeRunner(starting_agent=agent)
    session = await runner.run()

    async with session:
        await session.send_message("Say hello in one short sentence.")
        async for event in session:
            if event.type == "audio":
                # Forward or play event.audio.data.
                pass
            elif event.type == "history_added":
                print(event.item)
            elif event.type == "agent_end":
                break

if __name__ == "__main__":
    asyncio.run(main())
```

Explore the [examples](https://github.com/openai/openai-agents-python/tree/main/examples) directory to see the SDK in action, and read our [documentation](https://openai.github.io/openai-agents-python/) for more details.

## Acknowledgements

We'd like to acknowledge the excellent work of the open-source community, especially:

- [Pydantic](https://docs.pydantic.dev/latest/)
- [Requests](https://github.com/psf/requests)
- [MCP Python SDK](https://github.com/modelcontextprotocol/python-sdk)
- [Griffe](https://github.com/mkdocstrings/griffe)

This library has these optional dependencies:

- [websockets](https://github.com/python-websockets/websockets)
- [SQLAlchemy](https://github.com/sqlalchemy/sqlalchemy)
- [any-llm](https://github.com/mozilla-ai/any-llm) and [LiteLLM](https://github.com/BerriAI/litellm)

We also rely on the following tools to manage the project:

- [uv](https://github.com/astral-sh/uv) and [ruff](https://github.com/astral-sh/ruff)
- [mypy](https://github.com/python/mypy) and [Pyright](https://github.com/microsoft/pyright)
- [pytest](https://github.com/pytest-dev/pytest) and [Coverage.py](https://github.com/coveragepy/coveragepy)
- [MkDocs](https://github.com/squidfunk/mkdocs-material)

We're committed to continuing to build the Agents SDK as an open source framework so others in the community can expand on our approach.

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ a8acfe5b4cb7edbdac0d30a2ebb94122ef0287f8

@@ -0,0 +1,149 @@

+# OpenAI Agents SDK [![PyPI](https://img.shields.io/pypi/v/openai-agents?label=pypi%20package)](https://pypi.org/project/openai-agents/)
+
+The OpenAI Agents SDK is a lightweight yet powerful framework for building multi-agent workflows. It is provider-agnostic, supporting the OpenAI Responses and Chat Completions APIs, as well as 100+ other LLMs.
+
+<img src="https://cdn.openai.com/API/docs/images/orchestration.png" alt="Image of the Agents Tracing UI" style="max-height: 803px;">
+
+> [!NOTE]
+> Looking for the JavaScript/TypeScript version? Check out [Agents SDK JS/TS](https://github.com/openai/openai-agents-js).
+
+### Core concepts:
+
+1. [**Agents**](https://openai.github.io/openai-agents-python/agents): LLMs configured with instructions, tools, guardrails, and handoffs
+1. [**Sandbox Agents**](https://openai.github.io/openai-agents-python/sandbox_agents): Agents preconfigured to work with a container to perform work over long time horizons.
+1. **[Agents as tools](https://openai.github.io/openai-agents-python/tools/#agents-as-tools) / [Handoffs](https://openai.github.io/openai-agents-python/handoffs/)**: Delegating to other agents for specific tasks
+1. [**Tools**](https://openai.github.io/openai-agents-python/tools/): Various Tools let agents take actions (functions, MCP, hosted tools)
+1. [**Guardrails**](https://openai.github.io/openai-agents-python/guardrails/): Configurable safety checks for input and output validation
+1. [**Human in the loop**](https://openai.github.io/openai-agents-python/human_in_the_loop/): Built-in mechanisms for involving humans across agent runs
+1. [**Sessions**](https://openai.github.io/openai-agents-python/sessions/): Automatic conversation history management across agent runs
+1. [**Tracing**](https://openai.github.io/openai-agents-python/tracing/): Built-in tracking of agent runs, allowing you to view, debug and optimize your workflows
+1. [**Realtime Agents**](https://openai.github.io/openai-agents-python/realtime/quickstart/): Build powerful voice agents with `gpt-realtime-2.1` and full agent features
+
+Explore the [examples](https://github.com/openai/openai-agents-python/tree/main/examples) directory to see the SDK in action, and read our [documentation](https://openai.github.io/openai-agents-python/) for more details.
+
+## Get started
+
+To get started, set up your Python environment (Python 3.10 or newer required), and then install OpenAI Agents SDK package.
+
+### venv
+
+```bash
+python -m venv .venv
+source .venv/bin/activate  # On Windows: .venv\Scripts\activate
+pip install openai-agents
+```
+
+For voice support, install with the optional `voice` group: `pip install 'openai-agents[voice]'`. For Redis session support, install with the optional `redis` group: `pip install 'openai-agents[redis]'`.
+
+### uv
+
+If you're familiar with [uv](https://docs.astral.sh/uv/), installing the package would be even easier:
+
+```bash
+uv init
+uv add openai-agents
+```
+
+For voice support, install with the optional `voice` group: `uv add 'openai-agents[voice]'`. For Redis session support, install with the optional `redis` group: `uv add 'openai-agents[redis]'`.
+
+## Run your first agents
+
+The SDK supports three primary ways to run agents. Set the `OPENAI_API_KEY` environment variable before running any of these examples.
+
+### Run a sandbox agent
+
+Use a [`SandboxAgent`](https://openai.github.io/openai-agents-python/sandbox_agents) when the agent needs to inspect files, run commands, apply patches, or preserve workspace state across longer tasks.
+
+```python
+from agents import Runner
+from agents.run import RunConfig
+from agents.sandbox import Manifest, SandboxAgent, SandboxRunConfig
+from agents.sandbox.entries import GitRepo
+from agents.sandbox.sandboxes import UnixLocalSandboxClient
+
+agent = SandboxAgent(
+    name="Workspace Assistant",
+    instructions="Inspect the sandbox workspace before answering.",
+    default_manifest=Manifest(entries={"repo": GitRepo(repo="openai/openai-agents-python", ref="main")}),
+)
+
+result = Runner.run_sync(
+    agent,
+    "Inspect the repo README and summarize what this project does.",
+    run_config=RunConfig(sandbox=SandboxRunConfig(client=UnixLocalSandboxClient())),
+)
+print(result.final_output)
+```
+
+### Run a text agent
+
+Use a text `Agent` for workflows that do not need a persistent realtime connection or a sandbox workspace.
+
+```python
+from agents import Agent, Runner
+
+agent = Agent(name="Assistant", instructions="You are a helpful assistant")
+
+result = Runner.run_sync(agent, "Write a haiku about recursion in programming.")
+print(result.final_output)
+
+# Code within the code,
+# Functions calling themselves,
+# Infinite loop's dance.
+```
+
+(_For Jupyter notebook users, see [hello_world_jupyter.ipynb](https://github.com/openai/openai-agents-python/blob/main/examples/basic/hello_world_jupyter.ipynb)_)
+
+### Run a realtime agent
+
+Use a [`RealtimeAgent`](https://openai.github.io/openai-agents-python/realtime/quickstart/) for low-latency, server-side voice and multimodal experiences over WebSocket.
+
+```python
+import asyncio
+from agents.realtime import RealtimeAgent, RealtimeRunner
+
+async def main() -> None:
+    agent = RealtimeAgent(name="Assistant", instructions="You are a helpful voice assistant. Keep responses short.")
+    runner = RealtimeRunner(starting_agent=agent)
+    session = await runner.run()
+
+    async with session:
+        await session.send_message("Say hello in one short sentence.")
+        async for event in session:
+            if event.type == "audio":
+                # Forward or play event.audio.data.
+                pass
+            elif event.type == "history_added":
+                print(event.item)
+            elif event.type == "agent_end":
+                break
+
+if __name__ == "__main__":
+    asyncio.run(main())
+```
+
+Explore the [examples](https://github.com/openai/openai-agents-python/tree/main/examples) directory to see the SDK in action, and read our [documentation](https://openai.github.io/openai-agents-python/) for more details.
+
+## Acknowledgements
+
+We'd like to acknowledge the excellent work of the open-source community, especially:
+
+- [Pydantic](https://docs.pydantic.dev/latest/)
+- [Requests](https://github.com/psf/requests)
+- [MCP Python SDK](https://github.com/modelcontextprotocol/python-sdk)
+- [Griffe](https://github.com/mkdocstrings/griffe)
+
+This library has these optional dependencies:
+
+- [websockets](https://github.com/python-websockets/websockets)
+- [SQLAlchemy](https://github.com/sqlalchemy/sqlalchemy)
+- [any-llm](https://github.com/mozilla-ai/any-llm) and [LiteLLM](https://github.com/BerriAI/litellm)
+
+We also rely on the following tools to manage the project:
+
+- [uv](https://github.com/astral-sh/uv) and [ruff](https://github.com/astral-sh/ruff)
+- [mypy](https://github.com/python/mypy) and [Pyright](https://github.com/microsoft/pyright)
+- [pytest](https://github.com/pytest-dev/pytest) and [Coverage.py](https://github.com/coveragepy/coveragepy)
+- [MkDocs](https://github.com/squidfunk/mkdocs-material)
+
+We're committed to continuing to build the Agents SDK as an open source framework so others in the community can expand on our approach.
```

</details>
