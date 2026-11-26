# google/adk-python · CHANGELOG.md

> 当前有效引用快照. 完整原文由固定 Git Blob 保存, 当前活动输入不重复内联.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [google/adk-python](https://github.com/google/adk-python) |
| 来源文件 | [CHANGELOG.md](https://github.com/google/adk-python/blob/03725e8c67ca27b2c07569797a0c18e867e0b217/CHANGELOG.md) |
| 来源版本 | `03725e8c67ca27b2c07569797a0c18e867e0b217` |
| 来源目录 Tree | `88157f0a29b888b594cbd4133888c1220ae39b65` |
| 来源内容 Blob | `00053f47b203d60a550c5bcdddf58e690de3c3b7` |
| 摄取时间 | `2026-11-26T03:50:09.920668+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `external_doc_google_adk_python_changelog_md` |
| 快照模式 | `PINNED_EXTERNAL_REFERENCE` |
| 规范内容 SHA256 | `fbbafb0f3a923bfe2994b76a08f670e6eadf85ffe37dfac271dc55dd7307d342` |
| 原文字节数 | `646642` |
| 原文行数 | `4967` |

## 本次变化

- 新增行数 `19`.
- 删除行数 `0`.
- 完整 Diff 字节数 `2194`.
- 来源变化不等于本仓执行验证或独立研究次数.

## 阅读导航

- Changelog
- [2.15.1](https://github.com/google/adk-python/compare/v2.15.0...v2.15.1) (2026-11-24)
- Highlights
- Bug Fixes
- [2.15.0](https://github.com/google/adk-python/compare/v2.14.1...v2.15.0) (2026-11-19)
- Highlights
- Breaking changes
- Behavior changes
- Features
- Bug Fixes
- Performance Improvements
- Documentation
- [2.14.1](https://github.com/google/adk-python/compare/v2.14.0...v2.14.1) (2026-11-12)
- Bug Fixes
- [2.14.0](https://github.com/google/adk-python/compare/v2.13.0...v2.14.0) (2026-11-04)
- Highlights
- Breaking changes
- Behavior changes
- Features
- Bug Fixes
- Performance Improvements
- Documentation
- [2.13.0](https://github.com/google/adk-python/compare/v2.12.0...v2.13.0) (2026-10-22)
- Highlights

## 原文完整性与取回

- [按固定源提交读取完整原文](https://github.com/google/adk-python/blob/03725e8c67ca27b2c07569797a0c18e867e0b217/CHANGELOG.md).
- 原文由来源 Blob SHA 与规范内容 SHA256 共同识别.
- 被替换的完整活动快照先原样封存到只追加 Archive.
- Diff 过长时只展示有界预览, 预览不代表完整差异.

<details>
<summary>展开有界版本差异</summary>

```diff
--- previous

+++ 00053f47b203d60a550c5bcdddf58e690de3c3b7

@@ -1,4 +1,23 @@

 # Changelog
+
+## [2.15.1](https://github.com/google/adk-python/compare/v2.15.0...v2.15.1) (2026-11-24)
+
+
+### Highlights
+
+This release focuses on stability and integration bug fixes across model sampling, agent-to-agent streaming, tool call validation, and instruction routing.
+
+* **Models**: Maintain compatibility across Anthropic SDK versions 1.x and 2.x when configuring Claude sampling settings. ([debf43d](https://github.com/google/adk-python/commit/debf43da4571dd8ba52a663d96e5ae2601030212))
+* **A2A**: Fix streamed output persistence behavior for RemoteA2aAgent calls to prevent incomplete output states. ([c4bdc84](https://github.com/google/adk-python/commit/c4bdc846f2646549425f5ac5d98ea0eb7faebd96))
+* **Tools**: Improve error reporting when Apigee tool calls receive arguments that are not JSON objects. ([6a4ba6a](https://github.com/google/adk-python/commit/6a4ba6adfd01d1c727729b4d6b05e93e23c454c7))
+* **Routing**: Ensure reliable dynamic instruction gating by tracking transient instructions correctly. ([347dca6](https://github.com/google/adk-python/commit/347dca6b282dc401ac6203c4581be7ab9e292b82))
+
+### Bug Fixes
+
+* **a2a:** revert persisting streamed RemoteA2aAgent output without last_chunk ([c4bdc84](https://github.com/google/adk-python/commit/c4bdc846f2646549425f5ac5d98ea0eb7faebd96)), closes [#7255](https://github.com/google/adk-python/issues/7255)
+* **models:** handle Claude sampling settings on anthropic 1.x and 2.x ([debf43d](https://github.com/google/adk-python/commit/debf43da4571dd8ba52a663d96e5ae2601030212))
+* report Apigee tool calls whose arguments are not a JSON object ([6a4ba6a](https://github.com/google/adk-python/commit/6a4ba6adfd01d1c727729b4d6b05e93e23c454c7)), closes [#7740](https://github.com/google/adk-python/issues/7740)
+* track transient instructions and gate dynamic instruction routing ([347dca6](https://github.com/google/adk-python/commit/347dca6b282dc401ac6203c4581be7ab9e292b82)), closes [#8217](https://github.com/google/adk-python/issues/8217)
 
 ## [2.15.0](https://github.com/google/adk-python/compare/v2.14.1...v2.15.0) (2026-11-19)
```

</details>
