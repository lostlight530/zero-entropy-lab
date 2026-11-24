# agentclientprotocol/agent-client-protocol · CHANGELOG.md

> 当前有效引用快照. 完整原文由固定 Git Blob 保存, 当前活动输入不重复内联.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [agentclientprotocol/agent-client-protocol](https://github.com/agentclientprotocol/agent-client-protocol) |
| 来源文件 | [CHANGELOG.md](https://github.com/agentclientprotocol/agent-client-protocol/blob/01a54c84f39508f73fab4d41362baf51e1320374/CHANGELOG.md) |
| 来源版本 | `01a54c84f39508f73fab4d41362baf51e1320374` |
| 来源目录 Tree | `f3dd136d6bfe82b072ac19ad0c96147d81302ec2` |
| 来源内容 Blob | `1c8a4137a46af2c00afc16810fba2997cddbc2a8` |
| 摄取时间 | `2026-11-23T02:03:15.717351+00:00` |
| 归属层 | `protocols` |
| 可信度 | `1.0` |
| 记忆实体 | `external_doc_agentclientprotocol_agent_client_protocol_changelog_md` |
| 快照模式 | `PINNED_EXTERNAL_REFERENCE` |
| 规范内容 SHA256 | `586c65de404ca68246b591000730728f72ea24d3a16dd98c4104c571a3901599` |
| 原文字节数 | `67040` |
| 原文行数 | `1032` |

## 本次变化

- 新增行数 `94`.
- 删除行数 `0`.
- 完整 Diff 字节数 `8952`.
- 来源变化不等于本仓执行验证或独立研究次数.

## 阅读导航

- Changelog
- [Unreleased]
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
- [1.17.0](https://github.com/agentclientprotocol/agent-client-protocol/compare/v1.16.0...v1.17.0) - 2026-11-10
- Added
- Other
- [1.16.0](https://github.com/agentclientprotocol/agent-client-protocol/compare/v1.15.1...v1.16.0) - 2026-11-09

## 原文完整性与取回

- [按固定源提交读取完整原文](https://github.com/agentclientprotocol/agent-client-protocol/blob/01a54c84f39508f73fab4d41362baf51e1320374/CHANGELOG.md).
- 原文由来源 Blob SHA 与规范内容 SHA256 共同识别.
- 被替换的完整活动快照先原样封存到只追加 Archive.
- Diff 过长时只展示有界预览, 预览不代表完整差异.

<details>
<summary>展开有界版本差异</summary>

```diff
--- previous

+++ 1c8a4137a46af2c00afc16810fba2997cddbc2a8

@@ -1,6 +1,100 @@

 # Changelog
 
 ## [Unreleased]
+
+## [1.21.2](https://github.com/agentclientprotocol/agent-client-protocol/compare/v1.21.1...v1.21.2) - 2026-11-21
+
+### Other
+
+- *(unstable-v2)* say which description fields may contain Markdown ([#2974](https://github.com/agentclientprotocol/agent-client-protocol/pull/2974))
+
+## [1.21.1](https://github.com/agentclientprotocol/agent-client-protocol/compare/v1.21.0...v1.21.1) - 2026-11-21
+
+### Other
+
+- *(rust)* narrow Clippy exceptions and box large v2 payloads ([#2972](https://github.com/agentclientprotocol/agent-client-protocol/pull/2972))
+
+## [1.21.0](https://github.com/agentclientprotocol/agent-client-protocol/compare/v1.20.0...v1.21.0) - 2026-11-21
+
+### Added
+
+- *(rust)* re-export IndexMap from the schema crate ([#2970](https://github.com/agentclientprotocol/agent-client-protocol/pull/2970))
+
+### Other
+
+- *(schema)* reorder the protocol pages and rename Cancellation ([#2964](https://github.com/agentclientprotocol/agent-client-protocol/pull/2964))
+
+## [1.20.0](https://github.com/agentclientprotocol/agent-client-protocol/compare/v1.19.0...v1.20.0) - 2026-11-20
+
+### Added
+
+- *(schema)* stabilize subagent sessions ([#2939](https://github.com/agentclientprotocol/agent-client-protocol/pull/2939))
+- *(schema)* stabilize plan operations ([#2898](https://github.com/agentclientprotocol/agent-client-protocol/pull/2898))
+- *(unstable-v2)* make status a patch field on compaction_update ([#2922](https://github.com/agentclientprotocol/agent-client-protocol/pull/2922))
+
+### Fixed
+
+- *(unstable-v2)* enforce elicitation scope and item discriminators ([#2931](https://github.com/agentclientprotocol/agent-client-protocol/pull/2931))
+- *(unstable-v2)* make usage_update _meta a metadata patch ([#2933](https://github.com/agentclientprotocol/agent-client-protocol/pull/2933))
+- *(rust)* omit absent params instead of writing "params": null ([#2920](https://github.com/agentclientprotocol/agent-client-protocol/pull/2920))
+- *(unstable-v2)* enforce two schema limits in the Rust types ([#2921](https://github.com/agentclientprotocol/agent-client-protocol/pull/2921))
+- *(unstable-v2)* require at least one block in systemPrompt content in the schema ([#2912](https://github.com/agentclientprotocol/agent-client-protocol/pull/2912))
+- *(rust)* keep the key order of maps in the v2 and unstable types ([#2894](https://github.com/agentclientprotocol/agent-client-protocol/pull/2894))
+
+### Other
+
+- move ACP v2 to Preview ([#2961](https://github.com/agentclientprotocol/agent-client-protocol/pull/2961))
+- *(unstable-v2)* capitalize Agent and Client in the schema descriptions ([#2960](https://github.com/agentclientprotocol/agent-client-protocol/pull/2960))
+- *(unstable-v2)* sweep the pages and descriptions for consistency ([#2959](https://github.com/agentclientprotocol/agent-client-protocol/pull/2959))
+- *(unstable-v2)* fix nine small gaps and stale sentences ([#2958](https://github.com/agentclientprotocol/agent-client-protocol/pull/2958))
+- *(unstable-v2)* use the pages' requirement keywords in descriptions and restatements ([#2957](https://github.com/agentclientprotocol/agent-client-protocol/pull/2957))
+- *(unstable-v2)* scope the config option rules for child sessions and setup responses ([#2951](https://github.com/agentclientprotocol/agent-client-protocol/pull/2951))
+- *(unstable-v2)* require cancelling an abandoned elicitation in the schema description ([#2950](https://github.com/agentclientprotocol/agent-client-protocol/pull/2950))
+- *(unstable-v2)* word Icon.src as MCP does ([#2948](https://github.com/agentclientprotocol/agent-client-protocol/pull/2948))
+- *(schema)* remove the remaining text on malformed-value handling ([#2946](https://github.com/agentclientprotocol/agent-client-protocol/pull/2946))
+- *(unstable-v2)* require the unknown state for any session ([#2945](https://github.com/agentclientprotocol/agent-client-protocol/pull/2945))
+- *(unstable-v2)* let cancelled cover a child its parent cancels ([#2943](https://github.com/agentclientprotocol/agent-client-protocol/pull/2943))
+- *(unstable-v2)* add x-state and x-scope hints to the schema ([#2937](https://github.com/agentclientprotocol/agent-client-protocol/pull/2937))
+- *(unstable-v2)* make explicit permission rejection binding ([#2930](https://github.com/agentclientprotocol/agent-client-protocol/pull/2930))
+- *(unstable-v2)* scope cancellation to the foreground work it stops ([#2929](https://github.com/agentclientprotocol/agent-client-protocol/pull/2929))
+- *(unstable-v2)* clarify what replay_complete guarantees ([#2927](https://github.com/agentclientprotocol/agent-client-protocol/pull/2927))
+- *(unstable-v2)* clarify prompt retries after reconnect ([#2926](https://github.com/agentclientprotocol/agent-client-protocol/pull/2926))
+- *(unstable-v2)* name error -32000 by its code instead of auth_required ([#2915](https://github.com/agentclientprotocol/agent-client-protocol/pull/2915))
+- *(unstable-v2)* remove a Rust path from the ErrorData schema description ([#2916](https://github.com/agentclientprotocol/agent-client-protocol/pull/2916))
+- *(unstable-v2)* stop the stable text referring to usage on state snapshots ([#2909](https://github.com/agentclientprotocol/agent-client-protocol/pull/2909))
+- *(unstable-v2)* capitalize MAY in the protocol-level notification text ([#2904](https://github.com/agentclientprotocol/agent-client-protocol/pull/2904))
+- stop naming the protocol version in spec page prose ([#2903](https://github.com/agentclientprotocol/agent-client-protocol/pull/2903))
+- *(unstable-v2)* say protocol-level notifications are optional to act on ([#2893](https://github.com/agentclientprotocol/agent-client-protocol/pull/2893))
+- write requirement keywords in capitals where a rule is meant ([#2901](https://github.com/agentclientprotocol/agent-client-protocol/pull/2901))
+- *(unstable)* describe parent work after the prompt response for subagents ([#2896](https://github.com/agentclientprotocol/agent-client-protocol/pull/2896))
+- *(unstable-v2)* qualify when a replay without replay_complete is truncated ([#2892](https://github.com/agentclientprotocol/agent-client-protocol/pull/2892))
+- *(unstable)* remove malformed-value handling from the spec text ([#2891](https://github.com/agentclientprotocol/agent-client-protocol/pull/2891))
+- *(unstable-v2)* align the name uniqueness rules for mcpServers and env ([#2890](https://github.com/agentclientprotocol/agent-client-protocol/pull/2890))
+- *(unstable-v2)* require unique configId and groupId values ([#2889](https://github.com/agentclientprotocol/agent-client-protocol/pull/2889))
+- *(unstable-v2)* say which display strings are plain text and which are Markdown ([#2887](https://github.com/agentclientprotocol/agent-client-protocol/pull/2887))
+- *(unstable-v2)* say a failed permission request is not approval ([#2883](https://github.com/agentclientprotocol/agent-client-protocol/pull/2883))
+- *(unstable-v2)* say which order session/list returns and that cwd stays the same ([#2882](https://github.com/agentclientprotocol/agent-client-protocol/pull/2882))
+- *(unstable-v2)* require an absolute command for stdio MCP servers ([#2878](https://github.com/agentclientprotocol/agent-client-protocol/pull/2878))
+- *(unstable-v2)* send a new session's non-idle state after the response ([#2871](https://github.com/agentclientprotocol/agent-client-protocol/pull/2871))
+
+## [1.19.0](https://github.com/agentclientprotocol/agent-client-protocol/compare/v1.18.0...v1.19.0) - 2026-11-18
+
+### Added
+
+- *(unstable-v2)* remove pattern from elicitation string properties ([#2864](https://github.com/agentclientprotocol/agent-client-protocol/pull/2864))
+- *(unstable-v2)* add idempotencyKey to session/prompt ([#2847](https://github.com/agentclientprotocol/agent-client-protocol/pull/2847))
+- *(schema)* add method-aware payload dispatch ([#2846](https://github.com/agentclientprotocol/agent-client-protocol/pull/2846))
+- *(unstable)* add session cursors and cursorId on session/fork ([#2843](https://github.com/agentclientprotocol/agent-client-protocol/pull/2843))
+
+### Fixed
+
+- *(unstable-v2)* require at least one change in a diff ([#2858](https://github.com/agentclientprotocol/agent-client-protocol/pull/2858))
+
+### Other
+
+- *(unstable-v2)* word the tool call status rules as Agent rules ([#2859](https://github.com/agentclientprotocol/agent-client-protocol/pull/2859))
+- *(unstable-v2)* require Agents to cancel abandoned requests ([#2852](https://github.com/agentclientprotocol/agent-client-protocol/pull/2852))
+- *(unstable)* add subagents pages for v2 and the v1 draft ([#2849](https://github.com/agentclientprotocol/agent-client-protocol/pull/2849))
 
 ## [1.18.0](https://github.com/agentclientprotocol/agent-client-protocol/compare/v1.17.0...v1.18.0) - 2026-11-14
```

</details>
