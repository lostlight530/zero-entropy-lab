# microsoft/agent-framework · docs/decisions/0043-python-mcp-runtime-context.md

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [microsoft/agent-framework](https://github.com/microsoft/agent-framework) |
| 来源文件 | [docs/decisions/0043-python-mcp-runtime-context.md](https://github.com/microsoft/agent-framework/blob/736e838dc61628a6dd4185feaa13d781a23e0a01/docs/decisions/0043-python-mcp-runtime-context.md) |
| 来源版本 | `736e838dc61628a6dd4185feaa13d781a23e0a01` |
| 来源目录 Tree | `c2ff25d3ba0cdc2a38e2ef73ce5d68ae379a3231` |
| 来源内容 Blob | `7bdbb60331a7fdd268d1ef0ca8f10277d3cb5cbe` |
| 摄取时间 | `2026-09-22T23:54:02.291524+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `external_doc_microsoft_agent_framework_docs_decisions_0043_python_mcp_runtime_context_md` |

## 本次变化

- 新增行数 `48`.
- 删除行数 `0`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- Preserve host runtime context through MCP invocation and approval
- Context and Problem Statement
- Considered Options
- Decision Outcome

<details>
<summary>展开完整外部原文</summary>

---
status: proposed
date: 2026-09-21
deciders: eavanvalkenburg, westey-m
---

# Preserve host runtime context through MCP invocation and approval

## Context and Problem Statement

Workflow client kwargs, tool runtime kwargs, model arguments, and reviewed transport headers have different
destinations and lifetimes. Flattening them loses provenance; retaining only an operation across a delayed approval
does not preserve the transport context under which that operation was reviewed.

## Considered Options

- Reverse precedence in the shared argument mapping. This protects collisions but changes tool arguments and still
  permits model-only values to supply authentication inputs.
- Persist evaluated headers or an unkeyed digest with the approval. This supports restart-transparent comparison but
  exposes credentials or permits offline guessing of low-entropy header values.
- Use executor-local ephemeral binding keys. This keeps keys out of storage, but can cause endless reapproval when
  each resume reconstructs the executor on a different worker.
- Separate host runtime inputs and retain keyed approval verification in trusted workflow checkpoint state.
  This keeps credentials out of checkpoints and keys out of approval payloads, but requires protected host storage.

## Decision Outcome

Choose separate host inputs and workflow-local keyed bindings:

- Declarative agent execution resolves both kwargs buckets per executor, including legacy checkpoint state, and
  forwards them through their matching Agent parameters. It does not copy the outer bag into tool inputs.
- Generated MCP functions preserve host runtime kwargs in an owner-scoped context separate from merged tool
  arguments. HTTP header providers read only host context. The scope is reset on success, error, and cancellation.
  Direct host calls keep their existing kwargs-based API; model precedence remains unchanged for tool arguments.
- Declarative MCP approvals contain header names and an HMAC over the request ID and canonical evaluated headers.
  The random binding key is retained separately in trusted host checkpoint state, never in approval payloads.
  Header names compare case-insensitively, values exactly; no raw credentials or unkeyed digests enter checkpoints.
- A changed or unverifiable header set produces a fresh approval for the pinned operation before dispatch. This
  includes legacy requests, credential rotation, and missing verification state. Unchanged approvals remain valid
  across executor reconstruction using the checkpointed key. Headerless requests retain their resume behavior.

These are intentional compatibility changes: applications deriving generated-call headers from model arguments must
move trusted values into host runtime context or a provider closure. Consumers of delayed approvals must handle
replacement request IDs. Checkpoints already hold approval authority and must be protected against unauthorized reads
and writes; the binding key inherits that host trust boundary. Custom handlers and client providers remain responsible for
principal changes in credentials resolved outside the action's evaluated headers.

The proposed deciders are Python code owners; maintainer and engineering-management approval is still required.

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ 7bdbb60331a7fdd268d1ef0ca8f10277d3cb5cbe

@@ -0,0 +1,48 @@

+---
+status: proposed
+date: 2026-09-21
+deciders: eavanvalkenburg, westey-m
+---
+
+# Preserve host runtime context through MCP invocation and approval
+
+## Context and Problem Statement
+
+Workflow client kwargs, tool runtime kwargs, model arguments, and reviewed transport headers have different
+destinations and lifetimes. Flattening them loses provenance; retaining only an operation across a delayed approval
+does not preserve the transport context under which that operation was reviewed.
+
+## Considered Options
+
+- Reverse precedence in the shared argument mapping. This protects collisions but changes tool arguments and still
+  permits model-only values to supply authentication inputs.
+- Persist evaluated headers or an unkeyed digest with the approval. This supports restart-transparent comparison but
+  exposes credentials or permits offline guessing of low-entropy header values.
+- Use executor-local ephemeral binding keys. This keeps keys out of storage, but can cause endless reapproval when
+  each resume reconstructs the executor on a different worker.
+- Separate host runtime inputs and retain keyed approval verification in trusted workflow checkpoint state.
+  This keeps credentials out of checkpoints and keys out of approval payloads, but requires protected host storage.
+
+## Decision Outcome
+
+Choose separate host inputs and workflow-local keyed bindings:
+
+- Declarative agent execution resolves both kwargs buckets per executor, including legacy checkpoint state, and
+  forwards them through their matching Agent parameters. It does not copy the outer bag into tool inputs.
+- Generated MCP functions preserve host runtime kwargs in an owner-scoped context separate from merged tool
+  arguments. HTTP header providers read only host context. The scope is reset on success, error, and cancellation.
+  Direct host calls keep their existing kwargs-based API; model precedence remains unchanged for tool arguments.
+- Declarative MCP approvals contain header names and an HMAC over the request ID and canonical evaluated headers.
+  The random binding key is retained separately in trusted host checkpoint state, never in approval payloads.
+  Header names compare case-insensitively, values exactly; no raw credentials or unkeyed digests enter checkpoints.
+- A changed or unverifiable header set produces a fresh approval for the pinned operation before dispatch. This
+  includes legacy requests, credential rotation, and missing verification state. Unchanged approvals remain valid
+  across executor reconstruction using the checkpointed key. Headerless requests retain their resume behavior.
+
+These are intentional compatibility changes: applications deriving generated-call headers from model arguments must
+move trusted values into host runtime context or a provider closure. Consumers of delayed approvals must handle
+replacement request IDs. Checkpoints already hold approval authority and must be protected against unauthorized reads
+and writes; the binding key inherits that host trust boundary. Custom handlers and client providers remain responsible for
+principal changes in credentials resolved outside the action's evaluated headers.
+
+The proposed deciders are Python code owners; maintainer and engineering-management approval is still required.
```

</details>
