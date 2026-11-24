# agentclientprotocol/agent-client-protocol · CHANGELOG.md

> 当前有效引用快照. 完整原文由固定 Git Blob 保存, 当前活动输入不重复内联.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [agentclientprotocol/agent-client-protocol](https://github.com/agentclientprotocol/agent-client-protocol) |
| 来源文件 | [CHANGELOG.md](https://github.com/agentclientprotocol/agent-client-protocol/blob/840484ff59b3deb1314d1a74e351cd16ef052b30/CHANGELOG.md) |
| 来源版本 | `840484ff59b3deb1314d1a74e351cd16ef052b30` |
| 来源目录 Tree | `1188834bff431d3c1fe4240c687f6c55b2654954` |
| 来源内容 Blob | `c793b603a9b1f9ac5d771b6530e45d384f5c9d0e` |
| 摄取时间 | `2026-11-24T05:40:11.740983+00:00` |
| 归属层 | `protocols` |
| 可信度 | `1.0` |
| 记忆实体 | `external_doc_agentclientprotocol_agent_client_protocol_changelog_md` |
| 快照模式 | `PINNED_EXTERNAL_REFERENCE` |
| 规范内容 SHA256 | `f6e9b8bf3e4238ec6d302c638d513749343115411c411f67e4d4c7f3e0b16c2f` |
| 原文字节数 | `67796` |
| 原文行数 | `1047` |

## 本次变化

- 新增行数 `15`.
- 删除行数 `0`.
- 完整 Diff 字节数 `998`.
- 来源变化不等于本仓执行验证或独立研究次数.

## 阅读导航

- Changelog
- [Unreleased]
- [1.22.0](https://github.com/agentclientprotocol/agent-client-protocol/compare/v1.21.2...v1.22.0) - 2026-11-23
- Added
- Fixed
- Other
- [1.21.2](https://github.com/agentclientprotocol/agent-client-protocol/compare/v1.21.1...v1.21.2) - 2026-11-21
- Other
- [1.21.1](https://github.com/agentclientprotocol/agent-client-protocol/compare/v1.21.0...v1.21.1) - 2026-11-21
- Other
- [1.21.0](https://github.com/agentclientprotocol/agent-client-protocol/compare/v1.20.0...v1.21.0) - 2026-11-21
- Added
- Other
- [1.20.0](https://github.com/agentclientprotocol/agent-client-protocol/compare/v1.19.0...v1.20.0) - 2026-11-20
- Added
- Fixed
- Other
- [1.19.0](https://github.com/agentclientprotocol/agent-client-protocol/compare/v1.18.0...v1.19.0) - 2026-11-18
- Added
- Fixed
- Other
- [1.18.0](https://github.com/agentclientprotocol/agent-client-protocol/compare/v1.17.0...v1.18.0) - 2026-11-14
- Added
- Other

## 原文完整性与取回

- [按固定源提交读取完整原文](https://github.com/agentclientprotocol/agent-client-protocol/blob/840484ff59b3deb1314d1a74e351cd16ef052b30/CHANGELOG.md).
- 原文由来源 Blob SHA 与规范内容 SHA256 共同识别.
- 被替换的完整活动快照先原样封存到只追加 Archive.
- Diff 过长时只展示有界预览, 预览不代表完整差异.

<details>
<summary>展开有界版本差异</summary>

```diff
--- previous

+++ c793b603a9b1f9ac5d771b6530e45d384f5c9d0e

@@ -1,6 +1,21 @@

 # Changelog
 
 ## [Unreleased]
+
+## [1.22.0](https://github.com/agentclientprotocol/agent-client-protocol/compare/v1.21.2...v1.22.0) - 2026-11-23
+
+### Added
+
+- *(unstable)* attribute mcp/message requests to a session and tool call ([#2988](https://github.com/agentclientprotocol/agent-client-protocol/pull/2988))
+
+### Fixed
+
+- *(schema)* reject a malformed MCP transport instead of launching it as stdio ([#2982](https://github.com/agentclientprotocol/agent-client-protocol/pull/2982))
+- *(schema)* reject string payloads for v1 boolean config setters ([#2981](https://github.com/agentclientprotocol/agent-client-protocol/pull/2981))
+
+### Other
+
+- *(unstable-v2)* clarify plain text and Markdown rendering ([#2978](https://github.com/agentclientprotocol/agent-client-protocol/pull/2978))
 
 ## [1.21.2](https://github.com/agentclientprotocol/agent-client-protocol/compare/v1.21.1...v1.21.2) - 2026-11-21
```

</details>
