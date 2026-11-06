# microsoft/agent-framework · docs/decisions/0016-python-context-middleware.md

> 当前有效引用快照. 完整原文由固定 Git Blob 保存, 当前活动输入不重复内联.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [microsoft/agent-framework](https://github.com/microsoft/agent-framework) |
| 来源文件 | [docs/decisions/0016-python-context-middleware.md](https://github.com/microsoft/agent-framework/blob/7b6d2579884b0fde7729342f046ea58847ffdf37/docs/decisions/0016-python-context-middleware.md) |
| 来源版本 | `7b6d2579884b0fde7729342f046ea58847ffdf37` |
| 来源目录 Tree | `6f8b23f6e1d9616e7048b6be74892c14a50a044d` |
| 来源内容 Blob | `776df1e926800a1ba11702372adc2cd7ef558fd6` |
| 摄取时间 | `2026-07-28T07:52:41.319757+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_microsoft_agent_framework_docs_decisions_0016_python_context_middleware_md_776df1e92680` |
| 快照模式 | `PINNED_EXTERNAL_REFERENCE` |
| 规范内容 SHA256 | `7d4905e07ea2b074ce0339269da3d6bd56c45e013ce2e4c595aa9f7f99d71574` |
| 原文字节数 | `111518` |
| 原文行数 | `2620` |

## 本次变化

- 新增行数 `0`.
- 删除行数 `0`.
- 完整 Diff 字节数 `0`.
- 来源变化不等于本仓执行验证或独立研究次数.

## 阅读导航

- These are optional elements. Feel free to remove any of them.
- Unifying Context Management with ContextPlugin
- Context and Problem Statement
- Decision Drivers
- Related Issues
- Current State Analysis
- ContextProvider (Current)
- ChatMessageStore (Current)
- AgentThread (Current)
- Key Design Considerations
- Considered Options
- Option 1: Status Quo - Keep Separate Abstractions
- Option 2: ContextMiddleware - Wrapper Pattern
- Option 3: ContextHooks - Pre/Post Pattern
- Pipeline execution is linear, not nested:
- 1. hook1.before_run(context)
- 2. hook2.before_run(context)
- 3. <model invocation>
- 4. hook2.after_run(context)  # Reverse order for symmetry
- 5. hook1.after_run(context)
- Detailed Design
- 1. Execution Pattern
- Subclass must implement process():
- Subclass overrides only the hooks it needs:

## 原文完整性与取回

- [按固定源提交读取完整原文](https://github.com/microsoft/agent-framework/blob/7b6d2579884b0fde7729342f046ea58847ffdf37/docs/decisions/0016-python-context-middleware.md).
- 原文由来源 Blob SHA 与规范内容 SHA256 共同识别.
- 被替换的完整活动快照先原样封存到只追加 Archive.
- Diff 过长时只展示有界预览, 预览不代表完整差异.

<details>
<summary>展开有界版本差异</summary>

```diff

```

</details>
