# microsoft/agent-framework · docs/decisions/0009-support-long-running-operations.md

> 当前有效引用快照. 完整原文由固定 Git Blob 保存, 当前活动输入不重复内联.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [microsoft/agent-framework](https://github.com/microsoft/agent-framework) |
| 来源文件 | [docs/decisions/0009-support-long-running-operations.md](https://github.com/microsoft/agent-framework/blob/7b6d2579884b0fde7729342f046ea58847ffdf37/docs/decisions/0009-support-long-running-operations.md) |
| 来源版本 | `7b6d2579884b0fde7729342f046ea58847ffdf37` |
| 来源目录 Tree | `6f8b23f6e1d9616e7048b6be74892c14a50a044d` |
| 来源内容 Blob | `c44cabc500dab022ae88c56de5a1d6f8b2b58b97` |
| 摄取时间 | `2026-07-28T07:52:39.035929+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `external_doc_microsoft_agent_framework_docs_decisions_0009_support_long_running_operations_md` |
| 快照模式 | `PINNED_EXTERNAL_REFERENCE` |
| 规范内容 SHA256 | `4183068bfd177160b5e2bb61dfbbfc3d8b5023e35bbdb7b9b773fed5051dfd41` |
| 原文字节数 | `91165` |
| 原文行数 | `1689` |

## 本次变化

- 新增行数 `0`.
- 删除行数 `0`.
- 完整 Diff 字节数 `0`.
- 来源变化不等于本仓执行验证或独立研究次数.

## 阅读导航

- Long-Running Operations Design
- Context and Problem Statement
- Decision Drivers
- Comparison of Long-Running Operation Features
- Long-Running Operations Support for Chat Clients
- 1. Methods for Working with Long-Running Operations
- 1.1 New IAsyncChatClient Interface for All Long-Running Execution Operations
- 1.2 Get{Streaming}ResponseAsync for Common Operations & New IAsyncChatClient Interface for Uncommon Operations
- 1.3 Get{Streaming}ResponseAsync for Common Operations & New IAsyncChatClient Interface for Uncommon Operations & Capability Check
- 1.4 Get{Streaming}ResponseAsync for Common Operations & Individual Interface per Uncommon Operation
- 2. Enabling Long-Running Operations
- 2.1 Execution Mode per `Get{Streaming}ResponseAsync` Invocation
- 2.2 Execution Mode per `Get{Streaming}ResponseAsync` Invocation + Model Class
- 2.3 Execution Mode per Chat Client Instance
- 2.4 Combined Approach
- 3. Getting Status and Result of Long-Running Execution
- 3.1 Two Separate Methods for Status and Result
- 3.2 One Method to Get Status and Result
- 4. Place For RunId, Status, and UpdateId of Long-Running Operations
- 4.1. As AIContent
- 4.2. As Properties Of ChatResponse{Update}
- 5. Streaming Support
- Required Changes
- Function Calling

## 原文完整性与取回

- [按固定源提交读取完整原文](https://github.com/microsoft/agent-framework/blob/7b6d2579884b0fde7729342f046ea58847ffdf37/docs/decisions/0009-support-long-running-operations.md).
- 原文由来源 Blob SHA 与规范内容 SHA256 共同识别.
- 被替换的完整活动快照先原样封存到只追加 Archive.
- Diff 过长时只展示有界预览, 预览不代表完整差异.

<details>
<summary>展开有界版本差异</summary>

```diff

```

</details>
