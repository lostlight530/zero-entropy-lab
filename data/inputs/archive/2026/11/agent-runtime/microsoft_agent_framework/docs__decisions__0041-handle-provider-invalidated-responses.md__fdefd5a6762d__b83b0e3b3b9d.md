# microsoft/agent-framework · docs/decisions/0041-handle-provider-invalidated-responses.md

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [microsoft/agent-framework](https://github.com/microsoft/agent-framework) |
| 来源文件 | [docs/decisions/0041-handle-provider-invalidated-responses.md](https://github.com/microsoft/agent-framework/blob/b83b0e3b3b9d3fb704d5f953c829a5c321a506bf/docs/decisions/0041-handle-provider-invalidated-responses.md) |
| 来源版本 | `b83b0e3b3b9d3fb704d5f953c829a5c321a506bf` |
| 来源目录 Tree | `4efad46714d410205c84d9712d98b4eeb13d0a20` |
| 来源内容 Blob | `fdefd5a6762d4d1f7f8c98997c4108aada25e0ca` |
| 摄取时间 | `2026-09-16T23:57:02.096162+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `external_doc_microsoft_agent_framework_docs_decisions_0041_handle_provider_invalidated_responses_md` |

## 本次变化

- 新增行数 `71`.
- 删除行数 `0`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- Execute usable function calls unless the provider invalidates the response
- Context and Problem Statement
- Decision Drivers
- Considered Options
- Require one generic finish reason before execution
- Execute every parseable function call
- Execute usable calls by default and let providers signal invalidation
- Decision Outcome
- Consequences

<details>
<summary>展开完整外部原文</summary>

---
status: proposed
contact: eavanvalkenburg
date: 2026-09-15
deciders: eavanvalkenburg
---

# Execute usable function calls unless the provider invalidates the response

## Context and Problem Statement

Chat providers do not use terminal response reasons uniformly. A response can stop because of an output limit while
still containing complete local function arguments that are valid for execution and accepted by the service on
continuation. Other provider protocols explicitly invalidate partial response output when a tool block is truncated, a
refusal replaces partial output, a stream fails, or required terminal events are absent.

The function-calling loop needs a default that preserves usable calls without executing calls that a provider has
explicitly cancelled.

## Decision Drivers

- Preserve provider-neutral execution for complete, schema-usable local calls.
- Prevent local approvals and side effects for calls a provider protocol invalidates.
- Keep streaming deltas visible without buffering every provider response.
- Avoid coupling unrelated providers through a shared finish-reason interpretation layer.
- Keep local call invalidation distinct from caller cancellation.

## Considered Options

### Require one generic finish reason before execution

- Good: provides one simple rule in the core loop.
- Bad: rejects complete calls from providers whose terminal reason describes the enclosing response rather than the
  usability of its function arguments.
- Bad: makes custom clients depend on a provider-neutral meaning that their protocols may not have.

### Execute every parseable function call

- Good: preserves the current provider-neutral behavior.
- Bad: can execute partial output that a provider explicitly invalidated, even when accumulated JSON happens to parse.

### Execute usable calls by default and let providers signal invalidation

- Good: preserves the core loop's argument-driven policy.
- Good: lets an adapter enforce authoritative provider-specific terminal rules.
- Good: needs no cross-provider resolver or broad streaming buffer.
- Bad: each provider with invalidation semantics must implement and test its own protocol state.

## Decision Outcome

Chosen option: "Execute usable calls by default and let providers signal invalidation", because function argument
usability is the portable default while invalidation is provider-specific protocol knowledge.

`FunctionInvocationLayer` remains independent of `finish_reason`: a newly completed actionable call proceeds when
argument preparation and schema validation succeed. A provider that knows partial response output was invalidated
raises `ResponseInvalidatedException`; any local function calls from that response must not execute. The layer
abandons that current iteration, clears request budget state, restores the last valid continuation, avoids successful
response persistence and local function side effects, and re-raises the same exception.

Anthropic applies the signal only to local actionable `tool_use` blocks. A valid stream has closed local blocks, a
terminal `stop_reason` of `tool_use`, and `message_stop`. Non-tool terminal reasons, an open block at `message_stop`,
EOF without `message_stop`, or a non-cancellation stream error after a local call starts invalidate those calls.
Hosted/server-only calls and `pause_turn` retain their existing behavior. Streaming call deltas may already have been
yielded; direct consumers must discard them when invalidation is raised.

### Consequences

- Complete calls may execute under an enclosing `length` finish reason.
- Anthropic local calls cannot execute after protocol evidence invalidates or fails to finalize them.
- Direct streaming consumers receive an explicit discard signal without added buffering latency.
- Other provider adapters remain unchanged unless their own protocol defines equivalent invalidation semantics.

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ fdefd5a6762d4d1f7f8c98997c4108aada25e0ca

@@ -0,0 +1,71 @@

+---
+status: proposed
+contact: eavanvalkenburg
+date: 2026-09-15
+deciders: eavanvalkenburg
+---
+
+# Execute usable function calls unless the provider invalidates the response
+
+## Context and Problem Statement
+
+Chat providers do not use terminal response reasons uniformly. A response can stop because of an output limit while
+still containing complete local function arguments that are valid for execution and accepted by the service on
+continuation. Other provider protocols explicitly invalidate partial response output when a tool block is truncated, a
+refusal replaces partial output, a stream fails, or required terminal events are absent.
+
+The function-calling loop needs a default that preserves usable calls without executing calls that a provider has
+explicitly cancelled.
+
+## Decision Drivers
+
+- Preserve provider-neutral execution for complete, schema-usable local calls.
+- Prevent local approvals and side effects for calls a provider protocol invalidates.
+- Keep streaming deltas visible without buffering every provider response.
+- Avoid coupling unrelated providers through a shared finish-reason interpretation layer.
+- Keep local call invalidation distinct from caller cancellation.
+
+## Considered Options
+
+### Require one generic finish reason before execution
+
+- Good: provides one simple rule in the core loop.
+- Bad: rejects complete calls from providers whose terminal reason describes the enclosing response rather than the
+  usability of its function arguments.
+- Bad: makes custom clients depend on a provider-neutral meaning that their protocols may not have.
+
+### Execute every parseable function call
+
+- Good: preserves the current provider-neutral behavior.
+- Bad: can execute partial output that a provider explicitly invalidated, even when accumulated JSON happens to parse.
+
+### Execute usable calls by default and let providers signal invalidation
+
+- Good: preserves the core loop's argument-driven policy.
+- Good: lets an adapter enforce authoritative provider-specific terminal rules.
+- Good: needs no cross-provider resolver or broad streaming buffer.
+- Bad: each provider with invalidation semantics must implement and test its own protocol state.
+
+## Decision Outcome
+
+Chosen option: "Execute usable calls by default and let providers signal invalidation", because function argument
+usability is the portable default while invalidation is provider-specific protocol knowledge.
+
+`FunctionInvocationLayer` remains independent of `finish_reason`: a newly completed actionable call proceeds when
+argument preparation and schema validation succeed. A provider that knows partial response output was invalidated
+raises `ResponseInvalidatedException`; any local function calls from that response must not execute. The layer
+abandons that current iteration, clears request budget state, restores the last valid continuation, avoids successful
+response persistence and local function side effects, and re-raises the same exception.
+
+Anthropic applies the signal only to local actionable `tool_use` blocks. A valid stream has closed local blocks, a
+terminal `stop_reason` of `tool_use`, and `message_stop`. Non-tool terminal reasons, an open block at `message_stop`,
+EOF without `message_stop`, or a non-cancellation stream error after a local call starts invalidate those calls.
+Hosted/server-only calls and `pause_turn` retain their existing behavior. Streaming call deltas may already have been
+yielded; direct consumers must discard them when invalidation is raised.
+
+### Consequences
+
+- Complete calls may execute under an enclosing `length` finish reason.
+- Anthropic local calls cannot execute after protocol evidence invalidates or fails to finalize them.
+- Direct streaming consumers receive an explicit discard signal without added buffering latency.
+- Other provider adapters remain unchanged unless their own protocol defines equivalent invalidation semantics.
```

</details>
