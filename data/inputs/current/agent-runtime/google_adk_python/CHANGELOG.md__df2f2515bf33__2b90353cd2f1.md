# google/adk-python · CHANGELOG.md

> 当前有效引用快照. 完整原文由固定 Git Blob 保存, 当前活动输入不重复内联.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [google/adk-python](https://github.com/google/adk-python) |
| 来源文件 | [CHANGELOG.md](https://github.com/google/adk-python/blob/2b90353cd2f1ee0a8a52262a7843333b6f7d2c8d/CHANGELOG.md) |
| 来源版本 | `2b90353cd2f1ee0a8a52262a7843333b6f7d2c8d` |
| 来源目录 Tree | `f08aeb1e72566e4b606cd4391dfd71817c9e045c` |
| 来源内容 Blob | `df2f2515bf33f8b41f8973b188e016c9f2b97026` |
| 摄取时间 | `2026-11-23T02:03:18.278072+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `external_doc_google_adk_python_changelog_md` |
| 快照模式 | `PINNED_EXTERNAL_REFERENCE` |
| 规范内容 SHA256 | `93d9711f4d6b698ad2f8420dfa18dab022a48c1d9abf7e61bbb4c7d1f7b4df6f` |
| 原文字节数 | `644651` |
| 原文行数 | `4948` |

## 本次变化

- 新增行数 `202`.
- 删除行数 `0`.
- 完整 Diff 字节数 `35208`.
- 来源变化不等于本仓执行验证或独立研究次数.

## 阅读导航

- Changelog
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
- Breaking changes
- ⚠ BREAKING CHANGES
- Features

## 原文完整性与取回

- [按固定源提交读取完整原文](https://github.com/google/adk-python/blob/2b90353cd2f1ee0a8a52262a7843333b6f7d2c8d/CHANGELOG.md).
- 原文由来源 Blob SHA 与规范内容 SHA256 共同识别.
- 被替换的完整活动快照先原样封存到只追加 Archive.
- Diff 过长时只展示有界预览, 预览不代表完整差异.

<details>
<summary>展开有界版本差异</summary>

```diff
--- previous

+++ df2f2515bf33f8b41f8973b188e016c9f2b97026

@@ -1,4 +1,206 @@

 # Changelog
+
+## [2.15.0](https://github.com/google/adk-python/compare/v2.14.1...v2.15.0) (2026-11-19)
+
+### Highlights
+
+This release keeps voice streams and agent turns responsive under slow tools and session storage, measures multi-run reliability and partial tool-call accuracy, isolates sandboxes per user or session, adds Google Maps and project-wide BigQuery table discovery, and speeds up RAG memory search up to 6x. It also removes the interactive Visual Agent Builder from ADK Web.
+* **Integrations**:
+  * Verify addresses, reverse-geocode coordinates, and fetch Street View imagery directly from an agent with `GoogleMapsToolset` (`get_street_view_image`, `validate_address`, and `reverse_geocode`). See the [unit guide](https://github.com/google/adk-python/blob/main/docs/guides/integrations/google_maps/index.md) and [sample](https://github.com/google/adk-python/tree/main/contributing/samples/integrations/google_maps_photo_audit) for more details. ([5371bb1](https://github.com/google/adk-python/commit/5371bb12fdb58303ed956912c145972e469543b4))
+  * Answer open-ended analytics questions without knowing exact `table_references` upfront: `BigQueryToolset`'s `ask_data_insights` now accepts `search_scope` (`includeProjectIds` and `includeDatasetReferences`) to discover relevant tables across projects or datasets. ([9eb6d9d](https://github.com/google/adk-python/commit/9eb6d9d93aff15278f27337348a3cb8e527624fb))
+* **Sessions and artifacts**:
+  * Keep slow database or network writes off the critical path of agent turns with experimental `BufferedSessionService` and `BaseSessionService.append_events`, which buffer session events in memory and flush them in background batches. See the [unit guide](https://github.com/google/adk-python/blob/main/docs/guides/sessions/buffered_session_service/index.md) for more details. ([e1deb17](https://github.com/google/adk-python/commit/e1deb17f5274f49595caa703e41d9439563b8015), [f4fab78](https://github.com/google/adk-python/commit/f4fab78850d900009e27ae9b0e03ef664775fd77))
+  * Use a single artifact service across local development and cloud object stores (`gs://`, `s3://`, `file://`, and `memory://`): `FsspecArtifactService` now writes, deletes, and versions artifacts (`save_artifact`, `delete_artifact`, `get_artifact_version`, and `list_artifact_versions`), including S3 custom metadata. ([df9f9d0](https://github.com/google/adk-python/commit/df9f9d0452c02e2d461899f34acfb756e9612746), [b916291](https://github.com/google/adk-python/commit/b916291fccb1b830affe542240c2520f7a176b10))
+* **Evaluation**:
+  * Distinguish whether an agent can solve a task at least once (`pass_at_k` / `pass@k`) versus reliably on every run (`pass_hat_k` / `pass^k`) in `multi_run_config`: `adk eval` now reports their mean across the eval set, prints a per-case multi-run summary table by default, and saves `MultiRunCaseSummary` results to `.evalset_result.json`. See the [unit guide](https://github.com/google/adk-python/blob/main/docs/guides/evaluation/eval_config/index.md) for more details. ([5c7a829](https://github.com/google/adk-python/commit/5c7a8297ef987672c37a6083ad31af99b8e2b66a), [b64b540](https://github.com/google/adk-python/commit/b64b540c18318ec25062cc32c582d9dea406e870), [287c0b0](https://github.com/google/adk-python/commit/287c0b0e65899b0060efd5672c8f419c1119530d))
+  * Score tool calls with partial credit per argument instead of failing the whole call on one mismatched parameter using `tool_parameter_match` (`ToolParameterMatchCriterion`), backed by `ToolArgsMatcher` and `IN_ORDER`, `EXACT`, or `ANY_ORDER` call pairing. See the [unit guide](https://github.com/google/adk-python/blob/main/docs/guides/evaluation/eval_config/index.md) for more details. ([04ba412](https://github.com/google/adk-python/commit/04ba412094d4d5b01aea4ffb25690068311a8ad6))
+* **Execution environments**: Isolate sandboxes per user or session without making other concurrent sessions wait during sandbox startup: `BaseEnvironment` methods now receive the calling run's `ctx: Context`, and `BaseEnvironment.scope` (`EnvironmentScope.SHARED`, `USER`, or `SESSION`) scopes initialization locks accordingly. See the [unit guide](https://github.com/google/adk-python/blob/main/docs/guides/environment/base_environment/index.md) for more details. ([1bd22e3](https://github.com/google/adk-python/commit/1bd22e34d415cee15dca5d7b717c337f3dc604f7), [691ecbe](https://github.com/google/adk-python/commit/691ecbeedcb3da44690c773876ec662f27dc17e6))
+* **Live streaming and performance**:
+  * Keep voice audio, transcriptions, and barge-ins flowing while slow tools execute: `run_live` now runs every tool call in a background task, and `BaseLlmConnection.send_context_update` updates system instructions or tools mid-session on open Gemini 3.x Live connections without reconnecting. See the [unit guide](https://github.com/google/adk-python/blob/main/docs/guides/live/tools/index.md) for more details. ([e5dd820](https://github.com/google/adk-python/commit/e5dd820da49433c73be1b1296c790f17ec3defa7), [6ccd07b](https://github.com/google/adk-python/commit/6ccd07b797c82c9dc19fa9837495cb9c77a45089))
+  * Cut RAG memory search latency up to 6x in `VertexAiRagMemoryService` and `VertexAiRagRetrieval` by reusing API clients per event loop, and start parallel fan-out branches concurrently in resumable `Workflow` runs by coalescing status checkpoints once per scheduler tick. ([112491d](https://github.com/google/adk-python/commit/112491db84bc4de3d22c13d5925efffdb8ea1bb8), [6dbe5bb](https://github.com/google/adk-python/commit/6dbe5bb6d48be6a6c1895acade363e89d7b9bd98))
+
+#### Breaking changes
+
+* **Interactive Visual Agent Builder removed from ADK Web**: Developers increasingly build agents by co-building with a coding agent rather than wiring nodes by hand, and builder usage has declined steadily. ADK Web now focuses on running, testing, debugging, and evaluating agents. Agents you built with the builder are standard Agent Config YAML and still run with `adk web`, `adk run`, and `adk deploy`. To create new agents, use a coding agent such as Antigravity with the Agents CLI skills, or start from `adk create`. The `/dev/apps/{app_name}/builder*` routes and `google.adk.cli.built_in_agents` are removed. ([c890aa3](https://github.com/google/adk-python/commit/c890aa317f61988c99ac9cd4df49a1443ed87d15), [e2a21ac](https://github.com/google/adk-python/commit/e2a21ac23260d043bf9d217b573af1bef48f0f70), [fb08c78](https://github.com/google/adk-python/commit/fb08c784242c9afc3d8645508d8c5c08c9836eb9))
+* **Explicit prompt arguments in `McpInstructionProvider` (security hardening)**: To avoid exposing unrelated `session.state` keys to external MCP servers, `McpInstructionProvider` no longer auto-fills prompt arguments from `session.state`. Pass `McpInstructionProvider(..., arguments=...)` (a mapping or a callable over `ReadonlyContext`) for any arguments the prompt expects. ([889ddd3](https://github.com/google/adk-python/commit/889ddd3134df1dd1a626205ee78811950dec2a5c))
+
+#### Behavior changes
+
+* **Live function calls run in background tasks**: `run_live` executes all tool calls in background tasks without blocking audio or interruptions; parallel calls emit separate `FunctionResponse` events as each finishes, and tool exceptions return an error response instead of ending the live run. ([e5dd820](https://github.com/google/adk-python/commit/e5dd820da49433c73be1b1296c790f17ec3defa7))
+* **`DYNAMIC_INSTRUCTION_ROUTING` enabled by default**: Dynamic instructions from `load_artifacts` and `load_mcp_resource` are placed in a user-role message before the current turn instead of appended to `system_instruction` so the static instruction prefix stays cacheable (set `ADK_DISABLE_DYNAMIC_INSTRUCTION_ROUTING=1` to opt out). ([c6586f1](https://github.com/google/adk-python/commit/c6586f19ab8a2bb8b53e70041633b10858d9902e))
+
+<details>
+<summary>All changes</summary>
+
+### Features
+
+* add BaseLlmConnection.send_context_update ([6ccd07b](https://github.com/google/adk-python/commit/6ccd07b797c82c9dc19fa9837495cb9c77a45089))
... [DIFF_PREVIEW_TRUNCATED]
```

</details>
