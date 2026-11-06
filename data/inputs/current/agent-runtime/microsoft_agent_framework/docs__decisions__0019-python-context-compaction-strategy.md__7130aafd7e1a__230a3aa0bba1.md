# microsoft/agent-framework · docs/decisions/0019-python-context-compaction-strategy.md

> 当前有效引用快照. 完整原文由固定 Git Blob 保存, 当前活动输入不重复内联.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [microsoft/agent-framework](https://github.com/microsoft/agent-framework) |
| 来源文件 | [docs/decisions/0019-python-context-compaction-strategy.md](https://github.com/microsoft/agent-framework/blob/230a3aa0bba19b6bf5a7b4f427bcb25cb16c7105/docs/decisions/0019-python-context-compaction-strategy.md) |
| 来源版本 | `230a3aa0bba19b6bf5a7b4f427bcb25cb16c7105` |
| 来源目录 Tree | `feed38caa121f5471897d40b790c65eb73befdf9` |
| 来源内容 Blob | `7130aafd7e1a15bf9334fab2ce2127e0f57cebfb` |
| 摄取时间 | `2026-11-05T01:52:56.923382+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_microsoft_agent_framework_docs_decisions_0019_python_context_compaction_strategy_md_8fffb185d1a8` |
| 快照模式 | `PINNED_EXTERNAL_REFERENCE` |
| 规范内容 SHA256 | `7faee49d20dfdb1b9003f1f058360ed59bc30bc2f5b84db3ae5ed97c2f0dd7c5` |
| 原文字节数 | `68082` |
| 原文行数 | `1249` |

## 本次变化

- 新增行数 `0`.
- 删除行数 `0`.
- 完整 Diff 字节数 `0`.
- 来源变化不等于本仓执行验证或独立研究次数.

## 阅读导航

- Context Compaction Strategy for Long-Running Agents
- Context and Problem Statement
- Why Current Architecture Cannot Support In-Run Compaction
- Message-list correctness constraint: Atomic group preservation
- Where Compaction Is Needed
- Scope: Not Applicable to Service-Managed Storage
- Decision Drivers
- Considered Options
- Pros and Cons of the Options
- Option 1: Standalone `CompactionStrategy` Object
- Variant A: In-place mutation
- Variant B: Return new list
- Inside the function invocation loop
- Variant C: Group-aware compaction entry points
- Variant C1: `MessageGroups` sidecar state
- Usage at a compaction point:
- optional also emit OTEL events next to these loggers, but not sure if needed
- add messages from response into new group and to the groups.
- Variant C2: `_`-prefixed metadata directly on `Message`
- Variant D: Exclude-based projection (builds on Variant C1/C2)
- Variant D1: exclusion state on `MessageGroup`
- Variant D2: exclusion state on message `_`-attributes
- Variant E: Tokenization and accounting (builds on Variant C1/C2)
- Variant E1: token rollups on grouped state

## 原文完整性与取回

- [按固定源提交读取完整原文](https://github.com/microsoft/agent-framework/blob/230a3aa0bba19b6bf5a7b4f427bcb25cb16c7105/docs/decisions/0019-python-context-compaction-strategy.md).
- 原文由来源 Blob SHA 与规范内容 SHA256 共同识别.
- 被替换的完整活动快照先原样封存到只追加 Archive.
- Diff 过长时只展示有界预览, 预览不代表完整差异.

<details>
<summary>展开有界版本差异</summary>

```diff

```

</details>
