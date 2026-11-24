# openai/openai-agents-python · CHANGELOG.md

> 当前有效引用快照. 完整原文由固定 Git Blob 保存, 当前活动输入不重复内联.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [openai/openai-agents-python](https://github.com/openai/openai-agents-python) |
| 来源文件 | [CHANGELOG.md](https://github.com/openai/openai-agents-python/blob/3814f975652e9f4d20c44d58ce1ee88714af0423/CHANGELOG.md) |
| 来源版本 | `3814f975652e9f4d20c44d58ce1ee88714af0423` |
| 来源目录 Tree | `77eb337a8d884408cd96f56a1fad5f098e7aefce` |
| 来源内容 Blob | `8077f59f1feba791108a6528cd5d18f8c1938014` |
| 摄取时间 | `2026-11-24T05:40:13.203104+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `external_doc_openai_openai_agents_python_changelog_md` |
| 快照模式 | `PINNED_EXTERNAL_REFERENCE` |
| 规范内容 SHA256 | `766e30b4cfc63edad40d3bcc592f3f9a039189156a2765c8e98742be90108c87` |
| 原文字节数 | `72974` |
| 原文行数 | `357` |

## 本次变化

- 新增行数 `25`.
- 删除行数 `0`.
- 完整 Diff 字节数 `3111`.
- 来源变化不等于本仓执行验证或独立研究次数.

## 阅读导航

- Changelog
- [0.26.0](https://github.com/openai/openai-agents-python/compare/v0.25.0...v0.26.0) (2026-11-24)
- Features
- Bug Fixes
- [0.25.0](https://github.com/openai/openai-agents-python/compare/v0.24.0...v0.25.0) (2026-11-17)
- Features
- Bug Fixes
- [0.24.0](https://github.com/openai/openai-agents-python/compare/v0.23.1...v0.24.0) (2026-10-15)
- Features
- Bug Fixes
- [0.23.1](https://github.com/openai/openai-agents-python/compare/v0.23.0...v0.23.1) (2026-10-02)
- Bug Fixes
- [0.23.0](https://github.com/openai/openai-agents-python/compare/v0.22.3...v0.23.0) (2026-10-01)
- Features
- Bug Fixes

## 原文完整性与取回

- [按固定源提交读取完整原文](https://github.com/openai/openai-agents-python/blob/3814f975652e9f4d20c44d58ce1ee88714af0423/CHANGELOG.md).
- 原文由来源 Blob SHA 与规范内容 SHA256 共同识别.
- 被替换的完整活动快照先原样封存到只追加 Archive.
- Diff 过长时只展示有界预览, 预览不代表完整差异.

<details>
<summary>展开有界版本差异</summary>

```diff
--- previous

+++ 8077f59f1feba791108a6528cd5d18f8c1938014

@@ -1,4 +1,29 @@

 # Changelog
+
+## [0.26.0](https://github.com/openai/openai-agents-python/compare/v0.25.0...v0.26.0) (2026-11-24)
+
+
+### Features
+
+* Upgrade the GPT-Live demo to 1.1 ([6c4e4a2](https://github.com/openai/openai-agents-python/commit/6c4e4a29cd08eef454db6980d74da6afc8939d24))
+
+
+### Bug Fixes
+
+* allow SDK 0.25 in the external provider example ([#6068](https://github.com/openai/openai-agents-python/issues/6068)) ([9b17858](https://github.com/openai/openai-agents-python/commit/9b17858afb5b45f48bbf695cc7c8f34778425156))
+* apply the Docker removal CPU limit to path inspection ([14d13f4](https://github.com/openai/openai-agents-python/commit/14d13f468b0da7e6b721379200bd150cea60add1))
+* bound TAR path validation work per component ([abc55bd](https://github.com/openai/openai-agents-python/commit/abc55bd1b3d1b942b5c227545247dad23d104e99))
+* check Realtime output guardrails at turn completion ([dc84a13](https://github.com/openai/openai-agents-python/commit/dc84a13735dd7818847c20e7e023b0fbad2a88de))
+* give per-call MCP metadata priority over discovery defaults ([7f6f5ea](https://github.com/openai/openai-agents-python/commit/7f6f5ea075646ad13651fad96ac30b6e37da230b))
+* honor the global tracing switch in Realtime ([96b2799](https://github.com/openai/openai-agents-python/commit/96b27992a8aaf8cb29244f5e0d90a5b6c7d2373f))
+* limit UnixLocal snapshot link rebasing to regular files ([dd444fb](https://github.com/openai/openai-agents-python/commit/dd444fb313a398a006b99ee0fbecb9ec513b55e5))
+* preserve handoff redaction in Session history ([6f45b21](https://github.com/openai/openai-agents-python/commit/6f45b21d42bceb68dd5db397b95d4df575689d77))
+* protect apply_patch staging during alias moves ([a29070b](https://github.com/openai/openai-agents-python/commit/a29070b207103d389a3626eca5dab88814bba556))
+* require application approval for local images in codex_tool ([#6171](https://github.com/openai/openai-agents-python/issues/6171)) ([2a98dcd](https://github.com/openai/openai-agents-python/commit/2a98dcd0563c35ffd3b3ac3bfc95035a50915522))
+* sandbox memory selection across UTC offsets ([#6066](https://github.com/openai/openai-agents-python/issues/6066)) ([e7ce15a](https://github.com/openai/openai-agents-python/commit/e7ce15a25b336bb3d0840ad16dee597f69a6e6d3))
+* **sandbox:** restrict Docker storage mount privileges ([#6189](https://github.com/openai/openai-agents-python/issues/6189)) ([b40fb80](https://github.com/openai/openai-agents-python/commit/b40fb8097f007de181db9c382da53d8e0b7d6eaf))
+* stop queued function tools after input guardrail rejection ([90300af](https://github.com/openai/openai-agents-python/commit/90300af67e75977dcb017be3ad259232a5dcc1d0))
+* support opt-in JSON validation for Codex tool parameters ([#6067](https://github.com/openai/openai-agents-python/issues/6067)) ([54492d1](https://github.com/openai/openai-agents-python/commit/54492d112b5c3366cc30f35abd60c46fa92140c2))
 
 ## [0.25.0](https://github.com/openai/openai-agents-python/compare/v0.24.0...v0.25.0) (2026-11-17)
```

</details>
