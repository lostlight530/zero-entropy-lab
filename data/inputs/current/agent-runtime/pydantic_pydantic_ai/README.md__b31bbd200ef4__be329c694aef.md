# pydantic/pydantic-ai · README.md

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai) |
| 来源文件 | [README.md](https://github.com/pydantic/pydantic-ai/blob/be329c694aef8be4f55952315611305b06c42c94/README.md) |
| 来源版本 | `be329c694aef8be4f55952315611305b06c42c94` |
| 来源目录 Tree | `03a34fc54c55cb8f97940cf3a005192a3786e556` |
| 来源内容 Blob | `b31bbd200ef48e0d479836ffe4e124bb50fa8683` |
| 摄取时间 | `2026-08-22T22:09:51.976199+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `external_doc_pydantic_pydantic_ai_readme_md` |

## 本次变化

- 新增行数 `46`.
- 删除行数 `46`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- What are you building?
- Coding agent
- Data extraction
- Realtime voice
- Durable background agent
- Image generation
- Embeddings
- Why Pydantic AI
- Putting it together: a bank support agent
- Next Steps
- Part of the Pydantic Stack

<details>
<summary>展开完整外部原文</summary>

<div align="center">
  <a href="https://pydantic.dev/docs/ai/">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://pydantic.dev/docs/ai/img/pydantic-ai-dark.svg">
      <img src="https://pydantic.dev/docs/ai/img/pydantic-ai-light.svg" alt="Pydantic AI">
    </picture>
  </a>
</div>
<div align="center">
  <h3>How Python does AI</h3>
</div>
<div align="center">
  <a href="https://github.com/pydantic/pydantic-ai/actions/workflows/ci.yml?query=branch%3Amain"><img src="https://github.com/pydantic/pydantic-ai/actions/workflows/ci.yml/badge.svg?event=push" alt="CI"></a>
  <a href="https://coverage-badge.samuelcolvin.workers.dev/redirect/pydantic/pydantic-ai"><img src="https://coverage-badge.samuelcolvin.workers.dev/pydantic/pydantic-ai.svg" alt="Coverage"></a>
  <a href="https://pypi.python.org/pypi/pydantic-ai"><img src="https://img.shields.io/pypi/v/pydantic-ai.svg" alt="PyPI"></a>
  <a href="https://github.com/pydantic/pydantic-ai"><img src="https://img.shields.io/pypi/pyversions/pydantic-ai.svg" alt="versions"></a>
  <a href="https://github.com/pydantic/pydantic-ai/blob/main/LICENSE"><img src="https://img.shields.io/github/license/pydantic/pydantic-ai.svg?v" alt="license"></a>
  <a href="https://logfire.pydantic.dev/docs/join-slack/"><img src="https://img.shields.io/badge/Slack-Join%20Slack-4A154B?logo=slack" alt="Join Slack" /></a>
</div>
<p align="center">
  Agents, realtime voice, image generation, embeddings. Every model, every interface, typed end to end.
</p>

---

**Pydantic AI** is the Python AI SDK: a typed, [extensible](https://pydantic.dev/docs/ai/guides/extensibility/) agent loop with [every model](https://pydantic.dev/docs/ai/models/overview/) a string swap away. The same agent [runs everywhere you need it](https://pydantic.dev/docs/ai/overview/interfaces/): behind a [web frontend](https://pydantic.dev/docs/ai/integrations/ui/overview/), in the [terminal](https://pydantic.dev/docs/ai/integrations/cli/), on a [voice call](https://pydantic.dev/docs/ai/realtime/overview/), on a [durable background queue](https://pydantic.dev/docs/ai/capabilities/durable_execution/overview/), or as a plain object you call [`run()`](https://pydantic.dev/docs/ai/core-concepts/agent/#running-agents) on. [Image generation](https://pydantic.dev/docs/ai/capabilities/image-generation/) and [embeddings](https://pydantic.dev/docs/ai/guides/embeddings/) come in the same box.

**[Pydantic AI Harness](https://github.com/pydantic/pydantic-ai-harness)** has everything an agent needs for complex, long-running work, snapped on as [capabilities](https://pydantic.dev/docs/ai/capabilities/overview/), from [memory](https://pydantic.dev/docs/ai/harness/memory/), [sub-agents](https://pydantic.dev/docs/ai/harness/subagents/), and [context management](https://pydantic.dev/docs/ai/harness/compaction/) to a complete [coding agent](https://pydantic.dev/docs/ai/harness/coder/).

View the complete documentation at [pydantic.dev/docs/ai](https://pydantic.dev/docs/ai/).

## What are you building?

From simple typed data extraction to complex, long-running multi-agent collaboration, Pydantic AI and [Pydantic AI Harness](https://github.com/pydantic/pydantic-ai-harness) have got you covered.

### Coding agent

A complete coding agent in your terminal: workspace-rooted [file access](https://pydantic.dev/docs/ai/harness/filesystem/), allowlisted [shell](https://pydantic.dev/docs/ai/harness/shell/), [repo orientation](https://pydantic.dev/docs/ai/harness/repo-context/), [planning](https://pydantic.dev/docs/ai/harness/planning/), and [context management](https://pydantic.dev/docs/ai/harness/compaction/) that survives long sessions. Here with [web search](https://pydantic.dev/docs/ai/capabilities/web-search/) and a second-opinion [advisor](https://pydantic.dev/docs/ai/harness/advisor/) snapped on alongside:

```bash
uv add pydantic-ai pydantic-ai-harness
```

```python
from pydantic_ai import Agent
from pydantic_ai.capabilities import WebSearch
from pydantic_ai_harness import Advisor, Coder

agent = Agent(
    'anthropic:claude-fable-5',
    capabilities=[
        Coder(),  # files, shell, repo context, planning, sub-agents, context management
        WebSearch(),  # look up docs and error messages on the web
        Advisor('openai:gpt-5.6-sol'),  # a second opinion from another model when stuck
    ],
)
agent.to_cli_sync()
```

[`Coder`](https://pydantic.dev/docs/ai/harness/coder/) is a regular [combined capability](https://pydantic.dev/docs/ai/capabilities/custom/#composition-and-middleware-semantics), not a black box: use it whole, or use the blocks it bundles directly; the two are equivalent:

```python
capabilities = [
    FileSystem('.'), Shell(cwd='.'), RepoContext(), Planning(), SubAgents(...),
    ClearToolResults(), WarnNearLimits(), ToolOutputLimits(),
]
```

Run the file and you're chatting with the agent in your terminal. To try it before writing any code, run the exported [`coder_agent`](https://pydantic.dev/docs/ai/harness/coder/) with [`clai`](https://pydantic.dev/docs/ai/integrations/cli/#custom-agents) (the Pydantic AI CLI), via [`uvx`](https://docs.astral.sh/uv/guides/tools/):

```bash
uvx --with pydantic-ai-harness clai -a pydantic_ai_harness.coder:coder_agent -m anthropic:claude-fable-5
```

**Build this →** [Coder](https://pydantic.dev/docs/ai/harness/coder/), from the [Harness](https://pydantic.dev/docs/ai/harness/)

### Data extraction

Give the agent an [output type](https://pydantic.dev/docs/ai/core-concepts/output/) and [tools](https://pydantic.dev/docs/ai/tools-toolsets/tools/), and every run comes back validated and typed:

```bash
uv add pydantic-ai
```

```python
from typing import Literal

from pydantic import BaseModel, Field

from pydantic_ai import Agent, RunContext


class Sentiment(BaseModel):
    label: Literal['positive', 'negative', 'neutral']
    score: float = Field(ge=-1, le=1)


agent = Agent('openai:gpt-5.6-sol', output_type=Sentiment)


@agent.tool
def recent_reviews(ctx: RunContext[None], product: str) -> list[str]:
    """Fetch recent review snippets for a product."""
    return ['The new release fixed everything I complained about!']


result = agent.run_sync('How are people feeling about the Extract app?')
print(result.output)
#> label='positive' score=0.9
```

The [`@agent.tool`](https://pydantic.dev/docs/ai/tools-toolsets/tools/) function receives a [`RunContext`](https://pydantic.dev/docs/ai/core-concepts/dependencies/) that carries your dependencies in; the rest of its signature and its docstring become the tool schema, arguments are validated before your code runs, and the run is guaranteed to return a `Sentiment`, so your IDE, type checker, and the LLM all agree on the returned type.

**Build this →** [Agents](https://pydantic.dev/docs/ai/core-concepts/agent/), [Function Tools](https://pydantic.dev/docs/ai/tools-toolsets/tools/), and [Structured Output](https://pydantic.dev/docs/ai/core-concepts/output/)

### Realtime voice

Put the same agent on a live voice session, [tools](https://pydantic.dev/docs/ai/realtime/tools/) and [capabilities](https://pydantic.dev/docs/ai/realtime/capabilities/) included:

```bash
uv add "pydantic-ai[openai-realtime]"
```

```python
import asyncio

from pydantic_ai import Agent
from pydantic_ai.capabilities import MCP

agent = Agent(
    instructions='You are a helpful voice assistant.',
    capabilities=[MCP('https://internal.example.com/mcp')],  # capabilities work in voice too
)

@agent.tool_plain
def order_status(order_id: str) -> str:
    """Look up the status of an order."""
    return f'Order {order_id}: shipped, arriving Thursday.'

async with agent.realtime('openai:gpt-realtime-2.1').session() as session:
    microphone = asyncio.create_task(stream_microphone(session))  # chunks → session.send_audio()
    speaker = asyncio.create_task(play_audio(session.stream_audio()))  # model audio → your speaker
    async for part in session.stream_transcripts():
        print(f'{part.speaker}: {part.transcript}')
```

The model calls your tools mid-conversation while it keeps talking, and every session is [instrumented](https://pydantic.dev/docs/ai/integrations/logfire/); voice is just another frontend, on OpenAI Realtime, Gemini Live, Azure, and xAI Grok Voice.

**Build this →** [Realtime Voice](https://pydantic.dev/docs/ai/realtime/overview/)

### Durable background agent

Attach [`TemporalDurability`](https://pydantic.dev/docs/ai/capabilities/durable_execution/temporal/) and the same agent runs inside a [Temporal](https://pydantic.dev/docs/ai/capabilities/durable_execution/temporal/) workflow: every model and tool call becomes a durable activity, so a run working through a background queue survives restarts, failures, and long waits:

```bash
uv add "pydantic-ai[temporal]"
```

```python
from temporalio import workflow

from pydantic_ai import Agent
from pydantic_ai.capabilities import WebFetch, WebSearch
from pydantic_ai.durable_exec.temporal import PydanticAIWorkflow, TemporalDurability

agent = Agent(
    'openai:gpt-5.6-sol',
    instructions='Research the topic and write a structured brief.',
    name='researcher',
    capabilities=[WebSearch(), WebFetch(), TemporalDurability()],
)


@workflow.defn
class ResearchWorkflow(PydanticAIWorkflow):
    __pydantic_ai_agents__ = [agent]

    @workflow.run
    async def run(self, topic: str) -> str:
        result = await agent.run(f'Write a brief on: {topic}')
        return result.output
```

[DBOS](https://pydantic.dev/docs/ai/capabilities/durable_execution/dbos/) and [Prefect](https://pydantic.dev/docs/ai/capabilities/durable_execution/prefect/) attach the same way, first-party and co-maintained, with [Restate, Kitaru, and Airflow](https://pydantic.dev/docs/ai/capabilities/durable_execution/overview/) integrations besides.

**Build this →** [Durable Execution](https://pydantic.dev/docs/ai/capabilities/durable_execution/overview/)

### Image generation

Ask for an image and make it the run's typed [output](https://pydantic.dev/docs/ai/core-concepts/output/):

```bash
uv add pydantic-ai
```

```python
from pathlib import Path

from pydantic_ai import Agent, BinaryImage

agent = Agent('openai:gpt-5.6-sol', output_type=BinaryImage)
result = agent.run_sync('Generate a minimalist logo for a coffee shop called Extract.')
Path('logo.png').write_bytes(result.output.data)
```

[Provider-native generation](https://pydantic.dev/docs/ai/tools-toolsets/native-tools/#image-generation-tool) on models that support it (like this one), a [subagent fallback](https://pydantic.dev/docs/ai/capabilities/image-generation/) you can configure for the rest, and a [standalone image API](https://github.com/pydantic/pydantic-ai/pull/5357) on the way.

**Build this →** [Image Generation](https://pydantic.dev/docs/ai/capabilities/image-generation/)

<!-- Embeddings section parked (bd54): restore by removing this comment.

### Embeddings

Embed documents and queries for semantic search or a [RAG pipeline](https://pydantic.dev/docs/ai/examples/data-analytics/rag/):

```python
from pydantic_ai import Embedder

embedder = Embedder('openai:text-embedding-3-small')
result = embedder.embed_query_sync('What is machine learning?')
print(len(result.embeddings[0]))
#> 1536
```

Seven providers behind one typed API, [instrumented](https://pydantic.dev/docs/ai/integrations/logfire/) like everything else. It lives next to the agent that will use the results.

**Build this →** [Embeddings](https://pydantic.dev/docs/ai/guides/embeddings/)

-->

## Why Pydantic AI

- **Any model, one Python API.** [Virtually every model and provider](https://pydantic.dev/docs/ai/models/overview/) (OpenAI, Anthropic, Google, Bedrock, Azure AI Foundry, Groq, Mistral, xAI, Ollama, and dozens more), swappable with a string, or through the [Pydantic AI Gateway](https://pydantic.dev/docs/ai/overview/gateway/): one key for all of them, with failover and cost monitoring built in. No flagship feature is locked to one vendor.

- **Typed end to end.** [Structured outputs](https://pydantic.dev/docs/ai/core-concepts/output/), typed [dependency injection](https://pydantic.dev/docs/ai/core-concepts/dependencies/), [typed tools](https://pydantic.dev/docs/ai/tools-toolsets/tools/): your IDE, type checker, and coding agent all know what your agent returns, moving whole classes of errors from runtime to write-time. When plain control flow isn't enough, [Pydantic Graph](https://pydantic.dev/docs/ai/graph/graph/) brings the same typing to graph-based workflows.

- **Measured, not vibes.** OpenTelemetry-native [instrumentation](https://pydantic.dev/docs/ai/integrations/logfire/) works with any OTel backend; one line lights up [Pydantic Logfire](https://pydantic.dev/logfire/llm-observability?utm_source=github&utm_medium=readme&utm_campaign=pydantic-ai) for real-time debugging, tracing, and cost tracking backed by [genai-prices](https://github.com/pydantic/genai-prices). [Pydantic Evals](https://pydantic.dev/docs/ai/evals/evals/) tests agent behavior the way pytest tests code.

- **Batteries, composably.** One primitive, the [capability](https://pydantic.dev/docs/ai/capabilities/overview/), bundles [tools](https://pydantic.dev/docs/ai/tools-toolsets/tools/), [instructions](https://pydantic.dev/docs/ai/core-concepts/agent/#instructions), [hooks](https://pydantic.dev/docs/ai/core-concepts/hooks/), and [model settings](https://pydantic.dev/docs/ai/core-concepts/agent/#model-run-settings) into reusable units. Core ships fundamentals like [MCP](https://pydantic.dev/docs/ai/capabilities/mcp/) and [web search](https://pydantic.dev/docs/ai/capabilities/web-search/), the [Harness](https://github.com/pydantic/pydantic-ai-harness) ships everything else, and complete agents like [Coder](https://pydantic.dev/docs/ai/harness/coder/) and [Researcher](https://pydantic.dev/docs/ai/harness/researcher/) are just capabilities composed: they come apart the way they went together. Or skip code entirely with [YAML/JSON agent specs](https://pydantic.dev/docs/ai/core-concepts/agent-spec/).

- **[Every interface](https://pydantic.dev/docs/ai/overview/interfaces/).** One agent definition runs as a [CLI](https://pydantic.dev/docs/ai/integrations/cli/), a [built-in web chat](https://pydantic.dev/docs/ai/guides/web/), or [realtime speech](https://pydantic.dev/docs/ai/realtime/overview/) (OpenAI Realtime, Gemini Live, Azure, xAI Grok Voice); [UI event streams](https://pydantic.dev/docs/ai/integrations/ui/overview/) (AG-UI, Vercel AI) connect it to your own frontend or anything else; and [ACP](https://pydantic.dev/docs/ai/harness/acp/) *(experimental)* serves it as an editor agent.

- **Durable execution.** First-party, co-maintained [durable execution](https://pydantic.dev/docs/ai/capabilities/durable_execution/overview/) on Temporal, DBOS, or Prefect, with [Restate, Kitaru, and Airflow](https://pydantic.dev/docs/ai/capabilities/durable_execution/overview/) integrations and more coming. Agents survive restarts and run for days on the engine you already operate, with [human-in-the-loop approval](https://pydantic.dev/docs/ai/tools-toolsets/deferred-tools/#human-in-the-loop-tool-approval) built in.

Built by the [Pydantic](https://docs.pydantic.dev) team: [Pydantic Validation](https://pydantic.dev/docs/) is the validation layer of the OpenAI SDK, the Anthropic SDK, the Google ADK, LangChain, and most of the AI ecosystem (and the foundation FastAPI was built on). Pydantic AI brings that same feeling to agents.

## Putting it together: a bank support agent

A typed support agent showing several features working together: [dependency injection](https://pydantic.dev/docs/ai/core-concepts/dependencies/), [function tools](https://pydantic.dev/docs/ai/tools-toolsets/tools/), [structured output](https://pydantic.dev/docs/ai/core-concepts/output/), a reusable [capability](https://pydantic.dev/docs/ai/capabilities/overview/) bundling the customer context, and an [on-demand capability](https://pydantic.dev/docs/ai/capabilities/on-demand/) the model loads only when the conversation calls for it:

```python
from dataclasses import dataclass

from pydantic import BaseModel, Field

from pydantic_ai import Agent, Capability, RunContext

from bank_database import DatabaseConn


@dataclass
class SupportDependencies:  # inject any client: DB pools, HTTP APIs, user info
    customer_id: int
    db: DatabaseConn


class SupportOutput(BaseModel):
    support_advice: str = Field(description='Advice returned to the customer')
    block_card: bool = Field(description="Whether to block the customer's card")
    risk: int = Field(description='Risk level of query', ge=0, le=10)


customer_context = Capability[SupportDependencies](  # a reusable unit of tools + instructions
    id='customer-context',
    description="Who the customer is and what's on their account.",
)


@customer_context.instructions
async def add_customer_name(ctx: RunContext[SupportDependencies]) -> str:
    customer_name = await ctx.deps.db.customer_name(id=ctx.deps.customer_id)
    return f"The customer's name is {customer_name!r}"


@customer_context.tool  # signature and docstring become the tool schema the LLM sees
async def customer_balance(
    ctx: RunContext[SupportDependencies], include_pending: bool
) -> float:
    """Returns the customer's current account balance."""
    return await ctx.deps.db.customer_balance(
        id=ctx.deps.customer_id,
        include_pending=include_pending,
    )


refunds = Capability[SupportDependencies](  # deferred: loads on demand, like a skill
    id='refunds',
    description='Refund eligibility and refund status.',
    defer_loading=True,
)


@refunds.tool
async def refund_status(ctx: RunContext[SupportDependencies]) -> str:
    """Look up the refund status for the customer's most recent charge."""
    return await ctx.deps.db.refund_status(id=ctx.deps.customer_id)


support_agent = Agent(
    'openai:gpt-5.6-sol',
    deps_type=SupportDependencies,
    output_type=SupportOutput,  # the run returns a validated SupportOutput, typed as such
    instructions=(
        'You are a support agent in our bank, give the '
        'customer support and judge the risk level of their query.'
    ),
    capabilities=[customer_context, refunds],
)


...  # in a real use case: more tools, longer instructions


async def main():
    deps = SupportDependencies(customer_id=123, db=DatabaseConn())
    result = await support_agent.run('What is my balance?', deps=deps)
    print(result.output)
    """
    support_advice='Hello John, your current account balance, including pending transactions, is $123.45.' block_card=False risk=1
    """

    result = await support_agent.run('I just lost my card!', deps=deps)
    print(result.output)
    """
    support_advice="I'm sorry to hear that, John. We are temporarily blocking your card to prevent unauthorized transactions." block_card=True risk=8
    """

    result = await support_agent.run(  # the model loads `refunds` on demand, then answers
        'Was I refunded for the duplicate charge on my last statement?', deps=deps
    )
    print(result.output)
    """
    support_advice='Good news, John: the duplicate charge on your last statement was refunded on 2026-05-01.' block_card=False risk=1
    """
```

For the annotated walkthrough and Logfire tracing, see the [same example in the docs](https://pydantic.dev/docs/ai/overview/#putting-it-together-a-bank-support-agent).

## Next Steps

- [Install Pydantic AI](https://pydantic.dev/docs/ai/overview/install/) and put your own coding agent to work: install the [Pydantic AI skill](https://pydantic.dev/docs/ai/overview/coding-agent-skills/), point it at the [examples](https://pydantic.dev/docs/ai/examples/setup/) and the [Harness index](https://pydantic.dev/docs/ai/harness/), and tell it what you'd like to build. No API key needed to start (there's a built-in [`'test'` model](https://pydantic.dev/docs/ai/guides/testing/#unit-testing-with-testmodel)).
- Read the [docs](https://pydantic.dev/docs/ai/core-concepts/agent/) and the [API reference](https://pydantic.dev/docs/ai/api/pydantic-ai/agent/).
- Give your agent its batteries: [Pydantic AI Harness](https://github.com/pydantic/pydantic-ai-harness).
- Join [Slack](https://logfire.pydantic.dev/docs/join-slack/) or file an issue on [GitHub](https://github.com/pydantic/pydantic-ai/issues).

## Part of the Pydantic Stack

Everything you need to ship production-grade AI agents:

- [Pydantic AI](https://pydantic.dev/pydantic-ai?utm_source=github&utm_medium=readme&utm_campaign=pydantic-ai): the type-safe AI SDK
- [Pydantic AI Harness](https://github.com/pydantic/pydantic-ai-harness): the official capability library and harness, from single capabilities to complete agents
- [Pydantic Logfire](https://pydantic.dev/logfire?utm_source=github&utm_medium=readme&utm_campaign=pydantic-ai): AI-first, full-stack observability
- [Logfire AI Gateway](https://pydantic.dev/ai-gateway?utm_source=github&utm_medium=readme&utm_campaign=pydantic-ai): unified LLM proxy
- [Pydantic Evals](https://pydantic.dev/docs/ai/evals/evals/): evaluate any Python function, agents included, with [production evals on Logfire](https://pydantic.dev/logfire/evals?utm_source=github&utm_medium=readme&utm_campaign=pydantic-ai)
- [Pydantic Graph](https://pydantic.dev/docs/ai/graph/graph/): typed graph control flow
- [genai-prices](https://github.com/pydantic/genai-prices): model pricing data, kept current

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ b31bbd200ef48e0d479836ffe4e124bb50fa8683

@@ -1,5 +1,5 @@

 <div align="center">
-  <a href="https://ai.pydantic.dev/">
+  <a href="https://pydantic.dev/docs/ai/">
     <picture>
       <source media="(prefers-color-scheme: dark)" srcset="https://pydantic.dev/docs/ai/img/pydantic-ai-dark.svg">
       <img src="https://pydantic.dev/docs/ai/img/pydantic-ai-light.svg" alt="Pydantic AI">
@@ -23,11 +23,11 @@

 
 ---
 
-**Pydantic AI** is the Python AI SDK: a typed, [extensible](https://ai.pydantic.dev/extensibility) agent loop with [every model](https://ai.pydantic.dev/models/overview) a string swap away. The same agent [runs everywhere you need it](https://ai.pydantic.dev/interfaces): behind a [web frontend](https://ai.pydantic.dev/ui/overview), in the [terminal](https://ai.pydantic.dev/cli), on a [voice call](https://ai.pydantic.dev/realtime), on a [durable background queue](https://ai.pydantic.dev/durable_execution/overview/), or as a plain object you call [`run()`](https://ai.pydantic.dev/agents/#running-agents) on. [Image generation](https://ai.pydantic.dev/capabilities/image-generation/) and [embeddings](https://ai.pydantic.dev/embeddings) come in the same box.
-
-**[Pydantic AI Harness](https://github.com/pydantic/pydantic-ai-harness)** has everything an agent needs for complex, long-running work, snapped on as [capabilities](https://ai.pydantic.dev/capabilities/overview/), from [memory](https://pydantic.dev/docs/ai/harness/memory/), [sub-agents](https://pydantic.dev/docs/ai/harness/subagents/), and [context management](https://pydantic.dev/docs/ai/harness/compaction/) to a complete [coding agent](https://pydantic.dev/docs/ai/harness/coder/).
-
-View the complete documentation at [ai.pydantic.dev](https://ai.pydantic.dev/).
+**Pydantic AI** is the Python AI SDK: a typed, [extensible](https://pydantic.dev/docs/ai/guides/extensibility/) agent loop with [every model](https://pydantic.dev/docs/ai/models/overview/) a string swap away. The same agent [runs everywhere you need it](https://pydantic.dev/docs/ai/overview/interfaces/): behind a [web frontend](https://pydantic.dev/docs/ai/integrations/ui/overview/), in the [terminal](https://pydantic.dev/docs/ai/integrations/cli/), on a [voice call](https://pydantic.dev/docs/ai/realtime/overview/), on a [durable background queue](https://pydantic.dev/docs/ai/capabilities/durable_execution/overview/), or as a plain object you call [`run()`](https://pydantic.dev/docs/ai/core-concepts/agent/#running-agents) on. [Image generation](https://pydantic.dev/docs/ai/capabilities/image-generation/) and [embeddings](https://pydantic.dev/docs/ai/guides/embeddings/) come in the same box.
+
+**[Pydantic AI Harness](https://github.com/pydantic/pydantic-ai-harness)** has everything an agent needs for complex, long-running work, snapped on as [capabilities](https://pydantic.dev/docs/ai/capabilities/overview/), from [memory](https://pydantic.dev/docs/ai/harness/memory/), [sub-agents](https://pydantic.dev/docs/ai/harness/subagents/), and [context management](https://pydantic.dev/docs/ai/harness/compaction/) to a complete [coding agent](https://pydantic.dev/docs/ai/harness/coder/).
+
+View the complete documentation at [pydantic.dev/docs/ai](https://pydantic.dev/docs/ai/).
 
 ## What are you building?
 
@@ -35,7 +35,7 @@

 
 ### Coding agent
 
-A complete coding agent in your terminal: workspace-rooted [file access](https://pydantic.dev/docs/ai/harness/filesystem/), allowlisted [shell](https://pydantic.dev/docs/ai/harness/shell/), [repo orientation](https://pydantic.dev/docs/ai/harness/repo-context/), [planning](https://pydantic.dev/docs/ai/harness/planning/), and [context management](https://pydantic.dev/docs/ai/harness/compaction/) that survives long sessions. Here with [web search](https://ai.pydantic.dev/capabilities/web-search/) and a second-opinion [advisor](https://pydantic.dev/docs/ai/harness/advisor/) snapped on alongside:
+A complete coding agent in your terminal: workspace-rooted [file access](https://pydantic.dev/docs/ai/harness/filesystem/), allowlisted [shell](https://pydantic.dev/docs/ai/harness/shell/), [repo orientation](https://pydantic.dev/docs/ai/harness/repo-context/), [planning](https://pydantic.dev/docs/ai/harness/planning/), and [context management](https://pydantic.dev/docs/ai/harness/compaction/) that survives long sessions. Here with [web search](https://pydantic.dev/docs/ai/capabilities/web-search/) and a second-opinion [advisor](https://pydantic.dev/docs/ai/harness/advisor/) snapped on alongside:
 
 ```bash
 uv add pydantic-ai pydantic-ai-harness
@@ -57,7 +57,7 @@

 agent.to_cli_sync()
 ```
 
-[`Coder`](https://pydantic.dev/docs/ai/harness/coder/) is a regular [combined capability](https://ai.pydantic.dev/capabilities/custom/#composition-and-middleware-semantics), not a black box: use it whole, or use the blocks it bundles directly; the two are equivalent:
+[`Coder`](https://pydantic.dev/docs/ai/harness/coder/) is a regular [combined capability](https://pydantic.dev/docs/ai/capabilities/custom/#composition-and-middleware-semantics), not a black box: use it whole, or use the blocks it bundles directly; the two are equivalent:
 
 ```python
 capabilities = [
@@ -66,7 +66,7 @@

 ]
 ```
 
-Run the file and you're chatting with the agent in your terminal. To try it before writing any code, run the exported [`coder_agent`](https://pydantic.dev/docs/ai/harness/coder/) with [`clai`](https://ai.pydantic.dev/cli#custom-agents) (the Pydantic AI CLI), via [`uvx`](https://docs.astral.sh/uv/guides/tools/):
+Run the file and you're chatting with the agent in your terminal. To try it before writing any code, run the exported [`coder_agent`](https://pydantic.dev/docs/ai/harness/coder/) with [`clai`](https://pydantic.dev/docs/ai/integrations/cli/#custom-agents) (the Pydantic AI CLI), via [`uvx`](https://docs.astral.sh/uv/guides/tools/):
 
 ```bash
 uvx --with pydantic-ai-harness clai -a pydantic_ai_harness.coder:coder_agent -m anthropic:claude-fable-5
@@ -76,7 +76,7 @@

 
 ### Data extraction
 
-Give the agent an [output type](https://ai.pydantic.dev/output) and [tools](https://ai.pydantic.dev/tools), and every run comes back validated and typed:
+Give the agent an [output type](https://pydantic.dev/docs/ai/core-concepts/output/) and [tools](https://pydantic.dev/docs/ai/tools-toolsets/tools/), and every run comes back validated and typed:
 
 ```bash
 uv add pydantic-ai
@@ -109,13 +109,13 @@

 #> label='positive' score=0.9
 ```
 
-The [`@agent.tool`](https://ai.pydantic.dev/tools) function receives a [`RunContext`](https://ai.pydantic.dev/dependencies) that carries your dependencies in; the rest of its signature and its docstring become the tool schema, arguments are validated before your code runs, and the run is guaranteed to return a `Sentiment`, so your IDE, type checker, and the LLM all agree on the returned type.
-
-**Build this →** [Agents](https://ai.pydantic.dev/agents/), [Function Tools](https://ai.pydantic.dev/tools), and [Structured Output](https://ai.pydantic.dev/output)
+The [`@agent.tool`](https://pydantic.dev/docs/ai/tools-toolsets/tools/) function receives a [`RunContext`](https://pydantic.dev/docs/ai/core-concepts/dependencies/) that carries your dependencies in; the rest of its signature and its docstring become the tool schema, arguments are validated before your code runs, and the run is guaranteed to return a `Sentiment`, so your IDE, type checker, and the LLM all agree on the returned type.
+
+**Build this →** [Agents](https://pydantic.dev/docs/ai/core-concepts/agent/), [Function Tools](https://pydantic.dev/docs/ai/tools-toolsets/tools/), and [Structured Output](https://pydantic.dev/docs/ai/core-concepts/output/)
 
 ### Realtime voice
 
-Put the same agent on a live voice session, [tools](https://ai.pydantic.dev/realtime/tools) and [capabilities](https://ai.pydantic.dev/realtime/capabilities) included:
+Put the same agent on a live voice session, [tools](https://pydantic.dev/docs/ai/realtime/tools/) and [capabilities](https://pydantic.dev/docs/ai/realtime/capabilities/) included:
 
 ```bash
 uv add "pydantic-ai[openai-realtime]"
@@ -144,13 +144,13 @@

         print(f'{part.speaker}: {part.transcript}')
 ```
 
-The model calls your tools mid-conversation while it keeps talking, and every session is [instrumented](https://ai.pydantic.dev/logfire); voice is just another frontend, on OpenAI Realtime, Gemini Live, Azure, and xAI Grok Voice.
-
-**Build this →** [Realtime Voice](https://ai.pydantic.dev/realtime)
+The model calls your tools mid-conversation while it keeps talking, and every session is [instrumented](https://pydantic.dev/docs/ai/integrations/logfire/); voice is just another frontend, on OpenAI Realtime, Gemini Live, Azure, and xAI Grok Voice.
+
+**Build this →** [Realtime Voice](https://pydantic.dev/docs/ai/realtime/overview/)
 
 ### Durable background agent
 
-Attach [`TemporalDurability`](https://ai.pydantic.dev/durable_execution/temporal/) and the same agent runs inside a [Temporal](https://ai.pydantic.dev/durable_execution/temporal/) workflow: every model and tool call becomes a durable activity, so a run working through a background queue survives restarts, failures, and long waits:
+Attach [`TemporalDurability`](https://pydantic.dev/docs/ai/capabilities/durable_execution/temporal/) and the same agent runs inside a [Temporal](https://pydantic.dev/docs/ai/capabilities/durable_execution/temporal/) workflow: every model and tool call becomes a durable activity, so a run working through a background queue survives restarts, failures, and long waits:
 
 ```bash
 uv add "pydantic-ai[temporal]"
@@ -181,13 +181,13 @@

         return result.output
 ```
 
-[DBOS](https://ai.pydantic.dev/durable_execution/dbos/) and [Prefect](https://ai.pydantic.dev/durable_execution/prefect/) attach the same way, first-party and co-maintained, with [Restate, Kitaru, and Airflow](https://ai.pydantic.dev/durable_execution/overview/) integrations besides.
-
-**Build this →** [Durable Execution](https://ai.pydantic.dev/durable_execution/overview/)
+[DBOS](https://pydantic.dev/docs/ai/capabilities/durable_execution/dbos/) and [Prefect](https://pydantic.dev/docs/ai/capabilities/durable_execution/prefect/) attach the same way, first-party and co-maintained, with [Restate, Kitaru, and Airflow](https://pydantic.dev/docs/ai/capabilities/durable_execution/overview/) integrations besides.
+
+**Build this →** [Durable Execution](https://pydantic.dev/docs/ai/capabilities/durable_execution/overview/)
 
 ### Image generation
 
-Ask for an image and make it the run's typed [output](https://ai.pydantic.dev/output):
+Ask for an image and make it the run's typed [output](https://pydantic.dev/docs/ai/core-concepts/output/):
 
 ```bash
 uv add pydantic-ai
@@ -203,15 +203,15 @@

 Path('logo.png').write_bytes(result.output.data)
 ```
 
-[Provider-native generation](https://ai.pydantic.dev/native-tools#image-generation-tool) on models that support it (like this one), a [subagent fallback](https://ai.pydantic.dev/capabilities/image-generation/) you can configure for the rest, and a [standalone image API](https://github.com/pydantic/pydantic-ai/pull/5357) on the way.
-
-**Build this →** [Image Generation](https://ai.pydantic.dev/capabilities/image-generation/)
+[Provider-native generation](https://pydantic.dev/docs/ai/tools-toolsets/native-tools/#image-generation-tool) on models that support it (like this one), a [subagent fallback](https://pydantic.dev/docs/ai/capabilities/image-generation/) you can configure for the rest, and a [standalone image API](https://github.com/pydantic/pydantic-ai/pull/5357) on the way.
+
+**Build this →** [Image Generation](https://pydantic.dev/docs/ai/capabilities/image-generation/)
 
 <!-- Embeddings section parked (bd54): restore by removing this comment.
 
 ### Embeddings
 
-Embed documents and queries for semantic search or a [RAG pipeline](https://ai.pydantic.dev/examples/rag):
+Embed documents and queries for semantic search or a [RAG pipeline](https://pydantic.dev/docs/ai/examples/data-analytics/rag/):
 
 ```python
 from pydantic_ai import Embedder
@@ -222,31 +222,31 @@

 #> 1536
 ```
 
-Seven providers behind one typed API, [instrumented](https://ai.pydantic.dev/logfire) like everything else. It lives next to the agent that will use the results.
-
-**Build this →** [Embeddings](https://ai.pydantic.dev/embeddings)
+Seven providers behind one typed API, [instrumented](https://pydantic.dev/docs/ai/integrations/logfire/) like everything else. It lives next to the agent that will use the results.
+
+**Build this →** [Embeddings](https://pydantic.dev/docs/ai/guides/embeddings/)
 
 -->
 
 ## Why Pydantic AI
 
-- **Any model, one Python API.** [Virtually every model and provider](https://ai.pydantic.dev/models/overview) (OpenAI, Anthropic, Google, Bedrock, Azure AI Foundry, Groq, Mistral, xAI, Ollama, and dozens more), swappable with a string, or through the [Pydantic AI Gateway](https://ai.pydantic.dev/gateway): one key for all of them, with failover and cost monitoring built in. No flagship feature is locked to one vendor.
-
-- **Typed end to end.** [Structured outputs](https://ai.pydantic.dev/output), typed [dependency injection](https://ai.pydantic.dev/dependencies), [typed tools](https://ai.pydantic.dev/tools): your IDE, type checker, and coding agent all know what your agent returns, moving whole classes of errors from runtime to write-time. When plain control flow isn't enough, [Pydantic Graph](https://ai.pydantic.dev/graph) brings the same typing to graph-based workflows.
-
-- **Measured, not vibes.** OpenTelemetry-native [instrumentation](https://ai.pydantic.dev/logfire) works with any OTel backend; one line lights up [Pydantic Logfire](https://pydantic.dev/logfire/llm-observability?utm_source=github&utm_medium=readme&utm_campaign=pydantic-ai) for real-time debugging, tracing, and cost tracking backed by [genai-prices](https://github.com/pydantic/genai-prices). [Pydantic Evals](https://ai.pydantic.dev/evals) tests agent behavior the way pytest tests code.
-
-- **Batteries, composably.** One primitive, the [capability](https://ai.pydantic.dev/capabilities/overview/), bundles [tools](https://ai.pydantic.dev/tools), [instructions](https://ai.pydantic.dev/agents/#instructions), [hooks](https://ai.pydantic.dev/hooks), and [model settings](https://ai.pydantic.dev/agents/#model-run-settings) into reusable units. Core ships fundamentals like [MCP](https://ai.pydantic.dev/capabilities/mcp/) and [web search](https://ai.pydantic.dev/capabilities/web-search/), the [Harness](https://github.com/pydantic/pydantic-ai-harness) ships everything else, and complete agents like [Coder](https://pydantic.dev/docs/ai/harness/coder/) and [Researcher](https://pydantic.dev/docs/ai/harness/researcher/) are just capabilities composed: they come apart the way they went together. Or skip code entirely with [YAML/JSON agent specs](https://ai.pydantic.dev/agent-spec).
-
-- **[Every interface](https://ai.pydantic.dev/interfaces).** One agent definition runs as a [CLI](https://ai.pydantic.dev/cli), a [built-in web chat](https://ai.pydantic.dev/web), or [realtime speech](https://ai.pydantic.dev/realtime) (OpenAI Realtime, Gemini Live, Azure, xAI Grok Voice); [UI event streams](https://ai.pydantic.dev/ui/overview) (AG-UI, Vercel AI) connect it to your own frontend or anything else; and [ACP](https://pydantic.dev/docs/ai/harness/acp/) *(experimental)* serves it as an editor agent.
-
-- **Durable execution.** First-party, co-maintained [durable execution](https://ai.pydantic.dev/durable_execution/overview/) on Temporal, DBOS, or Prefect, with [Restate, Kitaru, and Airflow](https://ai.pydantic.dev/durable_execution/overview/) integrations and more coming. Agents survive restarts and run for days on the engine you already operate, with [human-in-the-loop approval](https://ai.pydantic.dev/deferred-tools#human-in-the-loop-tool-approval) built in.
+- **Any model, one Python API.** [Virtually every model and provider](https://pydantic.dev/docs/ai/models/overview/) (OpenAI, Anthropic, Google, Bedrock, Azure AI Foundry, Groq, Mistral, xAI, Ollama, and dozens more), swappable with a string, or through the [Pydantic AI Gateway](https://pydantic.dev/docs/ai/overview/gateway/): one key for all of them, with failover and cost monitoring built in. No flagship feature is locked to one vendor.
+
+- **Typed end to end.** [Structured outputs](https://pydantic.dev/docs/ai/core-concepts/output/), typed [dependency injection](https://pydantic.dev/docs/ai/core-concepts/dependencies/), [typed tools](https://pydantic.dev/docs/ai/tools-toolsets/tools/): your IDE, type checker, and coding agent all know what your agent returns, moving whole classes of errors from runtime to write-time. When plain control flow isn't enough, [Pydantic Graph](https://pydantic.dev/docs/ai/graph/graph/) brings the same typing to graph-based workflows.
+
+- **Measured, not vibes.** OpenTelemetry-native [instrumentation](https://pydantic.dev/docs/ai/integrations/logfire/) works with any OTel backend; one line lights up [Pydantic Logfire](https://pydantic.dev/logfire/llm-observability?utm_source=github&utm_medium=readme&utm_campaign=pydantic-ai) for real-time debugging, tracing, and cost tracking backed by [genai-prices](https://github.com/pydantic/genai-prices). [Pydantic Evals](https://pydantic.dev/docs/ai/evals/evals/) tests agent behavior the way pytest tests code.
+
+- **Batteries, composably.** One primitive, the [capability](https://pydantic.dev/docs/ai/capabilities/overview/), bundles [tools](https://pydantic.dev/docs/ai/tools-toolsets/tools/), [instructions](https://pydantic.dev/docs/ai/core-concepts/agent/#instructions), [hooks](https://pydantic.dev/docs/ai/core-concepts/hooks/), and [model settings](https://pydantic.dev/docs/ai/core-concepts/agent/#model-run-settings) into reusable units. Core ships fundamentals like [MCP](https://pydantic.dev/docs/ai/capabilities/mcp/) and [web search](https://pydantic.dev/docs/ai/capabilities/web-search/), the [Harness](https://github.com/pydantic/pydantic-ai-harness) ships everything else, and complete agents like [Coder](https://pydantic.dev/docs/ai/harness/coder/) and [Researcher](https://pydantic.dev/docs/ai/harness/researcher/) are just capabilities composed: they come apart the way they went together. Or skip code entirely with [YAML/JSON agent specs](https://pydantic.dev/docs/ai/core-concepts/agent-spec/).
+
+- **[Every interface](https://pydantic.dev/docs/ai/overview/interfaces/).** One agent definition runs as a [CLI](https://pydantic.dev/docs/ai/integrations/cli/), a [built-in web chat](https://pydantic.dev/docs/ai/guides/web/), or [realtime speech](https://pydantic.dev/docs/ai/realtime/overview/) (OpenAI Realtime, Gemini Live, Azure, xAI Grok Voice); [UI event streams](https://pydantic.dev/docs/ai/integrations/ui/overview/) (AG-UI, Vercel AI) connect it to your own frontend or anything else; and [ACP](https://pydantic.dev/docs/ai/harness/acp/) *(experimental)* serves it as an editor agent.
+
+- **Durable execution.** First-party, co-maintained [durable execution](https://pydantic.dev/docs/ai/capabilities/durable_execution/overview/) on Temporal, DBOS, or Prefect, with [Restate, Kitaru, and Airflow](https://pydantic.dev/docs/ai/capabilities/durable_execution/overview/) integrations and more coming. Agents survive restarts and run for days on the engine you already operate, with [human-in-the-loop approval](https://pydantic.dev/docs/ai/tools-toolsets/deferred-tools/#human-in-the-loop-tool-approval) built in.
 
 Built by the [Pydantic](https://docs.pydantic.dev) team: [Pydantic Validation](https://pydantic.dev/docs/) is the validation layer of the OpenAI SDK, the Anthropic SDK, the Google ADK, LangChain, and most of the AI ecosystem (and the foundation FastAPI was built on). Pydantic AI brings that same feeling to agents.
 
 ## Putting it together: a bank support agent
 
-A typed support agent showing several features working together: [dependency injection](https://ai.pydantic.dev/dependencies), [function tools](https://ai.pydantic.dev/tools), [structured output](https://ai.pydantic.dev/output), a reusable [capability](https://ai.pydantic.dev/capabilities/overview/) bundling the customer context, and an [on-demand capability](https://ai.pydantic.dev/capabilities/on-demand) the model loads only when the conversation calls for it:
+A typed support agent showing several features working together: [dependency injection](https://pydantic.dev/docs/ai/core-concepts/dependencies/), [function tools](https://pydantic.dev/docs/ai/tools-toolsets/tools/), [structured output](https://pydantic.dev/docs/ai/core-concepts/output/), a reusable [capability](https://pydantic.dev/docs/ai/capabilities/overview/) bundling the customer context, and an [on-demand capability](https://pydantic.dev/docs/ai/capabilities/on-demand/) the model loads only when the conversation calls for it:
 
 ```python
 from dataclasses import dataclass
@@ -344,12 +344,12 @@

     """
 ```
 
-For the annotated walkthrough and Logfire tracing, see the [same example in the docs](https://ai.pydantic.dev/#putting-it-together-a-bank-support-agent).
+For the annotated walkthrough and Logfire tracing, see the [same example in the docs](https://pydantic.dev/docs/ai/overview/#putting-it-together-a-bank-support-agent).
 
 ## Next Steps
 
-- [Install Pydantic AI](https://ai.pydantic.dev/install) and put your own coding agent to work: install the [Pydantic AI skill](https://ai.pydantic.dev/coding-agent-skills), point it at the [examples](https://ai.pydantic.dev/examples/setup) and the [Harness index](https://pydantic.dev/docs/ai/harness/), and tell it what you'd like to build. No API key needed to start (there's a built-in [`'test'` model](https://ai.pydantic.dev/testing#unit-testing-with-testmodel)).
-- Read the [docs](https://ai.pydantic.dev/agents/) and the [API reference](https://ai.pydantic.dev/api/agent/).
+- [Install Pydantic AI](https://pydantic.dev/docs/ai/overview/install/) and put your own coding agent to work: install the [Pydantic AI skill](https://pydantic.dev/docs/ai/overview/coding-agent-skills/), point it at the [examples](https://pydantic.dev/docs/ai/examples/setup/) and the [Harness index](https://pydantic.dev/docs/ai/harness/), and tell it what you'd like to build. No API key needed to start (there's a built-in [`'test'` model](https://pydantic.dev/docs/ai/guides/testing/#unit-testing-with-testmodel)).
+- Read the [docs](https://pydantic.dev/docs/ai/core-concepts/agent/) and the [API reference](https://pydantic.dev/docs/ai/api/pydantic-ai/agent/).
 - Give your agent its batteries: [Pydantic AI Harness](https://github.com/pydantic/pydantic-ai-harness).
 - Join [Slack](https://logfire.pydantic.dev/docs/join-slack/) or file an issue on [GitHub](https://github.com/pydantic/pydantic-ai/issues).
 
@@ -361,6 +361,6 @@

 - [Pydantic AI Harness](https://github.com/pydantic/pydantic-ai-harness): the official capability library and harness, from single capabilities to complete agents
 - [Pydantic Logfire](https://pydantic.dev/logfire?utm_source=github&utm_medium=readme&utm_campaign=pydantic-ai): AI-first, full-stack observability
 - [Logfire AI Gateway](https://pydantic.dev/ai-gateway?utm_source=github&utm_medium=readme&utm_campaign=pydantic-ai): unified LLM proxy
-- [Pydantic Evals](https://ai.pydantic.dev/evals): evaluate any Python function, agents included, with [production evals on Logfire](https://pydantic.dev/logfire/evals?utm_source=github&utm_medium=readme&utm_campaign=pydantic-ai)
-- [Pydantic Graph](https://ai.pydantic.dev/graph): typed graph control flow
+- [Pydantic Evals](https://pydantic.dev/docs/ai/evals/evals/): evaluate any Python function, agents included, with [production evals on Logfire](https://pydantic.dev/logfire/evals?utm_source=github&utm_medium=readme&utm_campaign=pydantic-ai)
+- [Pydantic Graph](https://pydantic.dev/docs/ai/graph/graph/): typed graph control flow
 - [genai-prices](https://github.com/pydantic/genai-prices): model pricing data, kept current
```

</details>
