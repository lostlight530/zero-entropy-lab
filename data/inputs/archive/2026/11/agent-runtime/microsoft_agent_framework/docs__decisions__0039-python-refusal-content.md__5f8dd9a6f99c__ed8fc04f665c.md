# microsoft/agent-framework · docs/decisions/0039-python-refusal-content.md

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [microsoft/agent-framework](https://github.com/microsoft/agent-framework) |
| 来源文件 | [docs/decisions/0039-python-refusal-content.md](https://github.com/microsoft/agent-framework/blob/ed8fc04f665c65a8491e43e3c422d917be71fa41/docs/decisions/0039-python-refusal-content.md) |
| 来源版本 | `ed8fc04f665c65a8491e43e3c422d917be71fa41` |
| 来源目录 Tree | `b8c431a5f4f7cf761e996b971d645f5324add9e4` |
| 来源内容 Blob | `5f8dd9a6f99c8599eb0b60e5179516f34297b02f` |
| 摄取时间 | `2026-09-02T23:40:00.955490+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `external_doc_microsoft_agent_framework_docs_decisions_0039_python_refusal_content_md` |

## 本次变化

- 新增行数 `82`.
- 删除行数 `0`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- Preserve model refusals with marked Python text content
- Context and Problem Statement
- Decision Drivers
- Considered Options
- Decision Outcome
- Consequences
- Rejected alternatives

<details>
<summary>展开完整外部原文</summary>

---
status: proposed
contact: "@eavanvalkenburg"
date: 2026-09-01
deciders: ["@eavanvalkenburg"]
---

# Preserve model refusals with marked Python text content

## Context and Problem Statement

Refusals are provider/model-created output rather than framework execution errors. Python currently
converts native refusal payloads into ordinary text, which keeps the explanation visible but loses
the semantic across history, provider replay, Responses-compatible hosting, and DevUI. The framework
needs a reversible representation without committing prematurely to a new stable content kind.

Microsoft.Extensions.AI represents refusals as `ErrorContent(ErrorCode="Refusal")`. Python does not
currently treat refusal output as an error: changing to that model would alter visible-text,
structured-output, and failure-handling behavior beyond preservation of the provider signal.

## Decision Drivers

- Preserve native refusal semantics through streaming and non-streaming paths.
- Keep refusal explanations visible through existing message and response text APIs.
- Round-trip native refusal fields where a transport supports them.
- Preserve history through existing `Content.to_dict()` and `Content.from_dict()` behavior.
- Gather usage of the semantic before adding a stable public discriminator.
- Avoid a parallel content hierarchy or provider-wide parsing abstraction.

## Considered Options

- Keep `type="text"` and record `model_output_kind="refusal"` in `additional_properties`.
- Add a refusal-only boolean marker to text content.
- Add a nested model-output metadata mapping to text content.
- Represent refusals as `ErrorContent`, following Microsoft.Extensions.AI.
- Add a stable `refusal` discriminator to the unified `Content` model.

## Decision Outcome

Keep refusal explanations as ordinary `Content(type="text", text=...)` and add the experimental,
serializable marker:

```python
{"model_output_kind": "refusal"}
```

The flat string value is more general than a refusal-only boolean and cheaper to inspect than a
nested mapping. It is metadata, not a new public API contract: no `ContentType`, constructor,
exported constant, or feature-stage entry is added.

`Message.text`, response/update text, string conversion, and text coalescing remain unchanged.
Structured-output extraction skips marked refusal text so a refusal is not parsed as the requested
response model.

OpenAI Responses, OpenAI Chat Completions, Foundry hosting, Hosting Responses, and DevUI inspect the
marker to reconstruct native refusal fields, content parts, and streaming events. Other providers
and protocols require no refusal-specific behavior because the framework content remains text.

This metadata convention is experimental while usage is gathered. The stable core/OpenAI package
lifecycle is unchanged because no new public API is introduced; beta and alpha hosting/UI packages
retain their package-level lifecycle.

### Consequences

- Serialized refusal content keeps the existing text shape and adds
  `additional_properties.model_output_kind="refusal"`.
- Existing stored refusals remain ordinary text because they carry no reliable migration signal.
- Older runtimes preserve and render the text and serialize the additional property, but do not
  reconstruct native refusal fields until upgraded.
- Native providers can reconstruct their refusal wire representation from durable history without
  relying on non-serializable SDK objects.
- Refusals continue to look like text to middleware and non-native providers.
- A future decision may promote observed usage to `ErrorContent` semantics or a stable discriminator.

### Rejected alternatives

A boolean marker is slightly shorter but creates a refusal-only key that cannot represent another
model-output semantic. A nested mapping reserves more structure than the current requirement needs.
`ErrorContent(ErrorCode="Refusal")` aligns with Microsoft.Extensions.AI but would change Python's
current visible-text and failure semantics. A stable `refusal` discriminator is clearer and may be
appropriate later, but commits the public content model before usage and cross-provider behavior are
understood.

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ 5f8dd9a6f99c8599eb0b60e5179516f34297b02f

@@ -0,0 +1,82 @@

+---
+status: proposed
+contact: "@eavanvalkenburg"
+date: 2026-09-01
+deciders: ["@eavanvalkenburg"]
+---
+
+# Preserve model refusals with marked Python text content
+
+## Context and Problem Statement
+
+Refusals are provider/model-created output rather than framework execution errors. Python currently
+converts native refusal payloads into ordinary text, which keeps the explanation visible but loses
+the semantic across history, provider replay, Responses-compatible hosting, and DevUI. The framework
+needs a reversible representation without committing prematurely to a new stable content kind.
+
+Microsoft.Extensions.AI represents refusals as `ErrorContent(ErrorCode="Refusal")`. Python does not
+currently treat refusal output as an error: changing to that model would alter visible-text,
+structured-output, and failure-handling behavior beyond preservation of the provider signal.
+
+## Decision Drivers
+
+- Preserve native refusal semantics through streaming and non-streaming paths.
+- Keep refusal explanations visible through existing message and response text APIs.
+- Round-trip native refusal fields where a transport supports them.
+- Preserve history through existing `Content.to_dict()` and `Content.from_dict()` behavior.
+- Gather usage of the semantic before adding a stable public discriminator.
+- Avoid a parallel content hierarchy or provider-wide parsing abstraction.
+
+## Considered Options
+
+- Keep `type="text"` and record `model_output_kind="refusal"` in `additional_properties`.
+- Add a refusal-only boolean marker to text content.
+- Add a nested model-output metadata mapping to text content.
+- Represent refusals as `ErrorContent`, following Microsoft.Extensions.AI.
+- Add a stable `refusal` discriminator to the unified `Content` model.
+
+## Decision Outcome
+
+Keep refusal explanations as ordinary `Content(type="text", text=...)` and add the experimental,
+serializable marker:
+
+```python
+{"model_output_kind": "refusal"}
+```
+
+The flat string value is more general than a refusal-only boolean and cheaper to inspect than a
+nested mapping. It is metadata, not a new public API contract: no `ContentType`, constructor,
+exported constant, or feature-stage entry is added.
+
+`Message.text`, response/update text, string conversion, and text coalescing remain unchanged.
+Structured-output extraction skips marked refusal text so a refusal is not parsed as the requested
+response model.
+
+OpenAI Responses, OpenAI Chat Completions, Foundry hosting, Hosting Responses, and DevUI inspect the
+marker to reconstruct native refusal fields, content parts, and streaming events. Other providers
+and protocols require no refusal-specific behavior because the framework content remains text.
+
+This metadata convention is experimental while usage is gathered. The stable core/OpenAI package
+lifecycle is unchanged because no new public API is introduced; beta and alpha hosting/UI packages
+retain their package-level lifecycle.
+
+### Consequences
+
+- Serialized refusal content keeps the existing text shape and adds
+  `additional_properties.model_output_kind="refusal"`.
+- Existing stored refusals remain ordinary text because they carry no reliable migration signal.
+- Older runtimes preserve and render the text and serialize the additional property, but do not
+  reconstruct native refusal fields until upgraded.
+- Native providers can reconstruct their refusal wire representation from durable history without
+  relying on non-serializable SDK objects.
+- Refusals continue to look like text to middleware and non-native providers.
+- A future decision may promote observed usage to `ErrorContent` semantics or a stable discriminator.
+
+### Rejected alternatives
+
+A boolean marker is slightly shorter but creates a refusal-only key that cannot represent another
+model-output semantic. A nested mapping reserves more structure than the current requirement needs.
+`ErrorContent(ErrorCode="Refusal")` aligns with Microsoft.Extensions.AI but would change Python's
+current visible-text and failure semantics. A stable `refusal` discriminator is clearer and may be
+appropriate later, but commits the public content model before usage and cross-provider behavior are
+understood.
```

</details>
