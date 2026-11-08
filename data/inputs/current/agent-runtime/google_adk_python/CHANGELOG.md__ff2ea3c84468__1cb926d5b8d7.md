# google/adk-python · CHANGELOG.md

> 当前有效引用快照. 完整原文由固定 Git Blob 保存, 当前活动输入不重复内联.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [google/adk-python](https://github.com/google/adk-python) |
| 来源文件 | [CHANGELOG.md](https://github.com/google/adk-python/blob/1cb926d5b8d702261ec82a26d3f1c4296e0db7d7/CHANGELOG.md) |
| 来源版本 | `1cb926d5b8d702261ec82a26d3f1c4296e0db7d7` |
| 来源目录 Tree | `7e32ef442068453e5e4a17b68dc4144be3519fc0` |
| 来源内容 Blob | `ff2ea3c8446880934f37a43411c8f1777c593246` |
| 摄取时间 | `2026-11-08T06:43:35.456436+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `external_doc_google_adk_python_changelog_md` |
| 快照模式 | `PINNED_EXTERNAL_REFERENCE` |
| 规范内容 SHA256 | `bb4e4df43db68caed181ecec1d9d830083deae8a93b455917e57c0922d108654` |
| 原文字节数 | `609560` |
| 原文行数 | `4739` |

## 本次变化

- 新增行数 `275`.
- 删除行数 `0`.
- 完整 Diff 字节数 `50806`.
- 来源变化不等于本仓执行验证或独立研究次数.

## 阅读导航

- Changelog
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
- Bug Fixes
- Performance Improvements
- Documentation
- [2.12.0](https://github.com/google/adk-python/compare/v2.11.0...v2.12.0) (2026-10-13)
- Highlights
- Features
- Bug Fixes
- Performance Improvements
- Documentation
- Miscellaneous Chores

## 原文完整性与取回

- [按固定源提交读取完整原文](https://github.com/google/adk-python/blob/1cb926d5b8d702261ec82a26d3f1c4296e0db7d7/CHANGELOG.md).
- 原文由来源 Blob SHA 与规范内容 SHA256 共同识别.
- 被替换的完整活动快照先原样封存到只追加 Archive.
- Diff 过长时只展示有界预览, 预览不代表完整差异.

<details>
<summary>展开有界版本差异</summary>

```diff
--- previous

+++ ff2ea3c8446880934f37a43411c8f1777c593246

@@ -1,4 +1,279 @@

 # Changelog
+
+## [2.14.0](https://github.com/google/adk-python/compare/v2.13.0...v2.14.0) (2026-11-04)
+
+
+### Highlights
+
+This release graduates execution environments, A2A, evaluation, and core runtime modules from experimental, adds multi-run evaluation and semantic tool argument matching, adds Microsoft Teams and OpenAI Decisions integrations, and makes long multi-turn workflows faster.
+* **Execution environments and sandboxes**:
+  * `BaseEnvironment`, `LocalEnvironment`, `EnvironmentToolset`, `DaytonaEnvironment`, and `E2BEnvironment` are now stable. ([c54b253](https://github.com/google/adk-python/commit/c54b253eba3359264a5f86805051aeb6cd93034d), [799fc94](https://github.com/google/adk-python/commit/799fc9459eb9443a63db11a179d6422b7e1dc1c0))
+  * `BaseEnvironment.read_file_stream` streams files in chunks across `LocalEnvironment`, `E2BEnvironment`, and `DaytonaEnvironment` so `ReadFileTool` reads line ranges without loading the whole file into memory. See the [unit guide](https://github.com/google/adk-python/blob/main/docs/guides/environment/base_environment/index.md) for more details. ([fd8d8c1](https://github.com/google/adk-python/commit/fd8d8c1e054a1e40abd564f3cfbd6a074e1d975a))
+  * `AgentEngineEnvironment` reads and writes large files in chunks and reports commands over 570 seconds as timed out before the service deadline. See the [unit guide](https://github.com/google/adk-python/blob/main/docs/guides/integrations/vmaas/agent_engine_environment/index.md) and [sample](https://github.com/google/adk-python/tree/main/contributing/samples/environment_and_skills/agent_engine_environment) for more details. ([4c88040](https://github.com/google/adk-python/commit/4c880408b5468afb9196a4701cf6cb2a34c6b545), [5843c58](https://github.com/google/adk-python/commit/5843c582f15a89627bf379accea4ca182bcf706c), [b13fa19](https://github.com/google/adk-python/commit/b13fa19ad61ad857690758e6a440a7b7de3f9128), [d3a199d](https://github.com/google/adk-python/commit/d3a199d4c47d4c01bab91aee3cd36af1277fd510))
+  * `ContainerCodeExecutor` supports input and output files, and `RunSkillScriptTool` runs skill scripts from validated paths and arguments instead of a shell command string. ([effd641](https://github.com/google/adk-python/commit/effd64101112643cf96ce6bdef6ece26080f6d49), [ff61524](https://github.com/google/adk-python/commit/ff61524bb1378bd355d92b5b88955ea142f83be0))
+* **Evaluation**:
+  * `MultiRunConfig` (`adk eval --num_runs`) and `--parallelism` run each eval case multiple times concurrently and combine scores or pass rates across runs. See the [eval config](https://github.com/google/adk-python/blob/main/docs/guides/evaluation/eval_config/index.md) and [agent evaluator](https://github.com/google/adk-python/blob/main/docs/guides/evaluation/agent_evaluator/index.md) guides for more details. ([7f3517e](https://github.com/google/adk-python/commit/7f3517e43d7b6012f51438cffb60e6d7983e4217), [e9e8f61](https://github.com/google/adk-python/commit/e9e8f6156fb73cdfe799af0a0a57786e807732df))
+  * `AgentEvaluator` accepts a `BaseNode` or `App` built at runtime, and `--eval_storage_uri` stores eval files outside a read-only `agents_dir`. ([ce92e92](https://github.com/google/adk-python/commit/ce92e924721e873afec74bdb393072eb32615f96), [ff66b1f](https://github.com/google/adk-python/commit/ff66b1f178c02bc0ef5d97b4303cb2c446f045cc))
+  * `ToolArgsMatcher` compares tool call arguments in evaluations and `EnvironmentSimulation` using exact, case-insensitive, numeric-tolerance, or LLM-backed semantic checks. See the [unit guide](https://github.com/google/adk-python/blob/main/docs/guides/tools/tool_args_matcher/tool_args_matcher/index.md) for more details. ([ed76f94](https://github.com/google/adk-python/commit/ed76f94501f0e4dad9346e064980c1059bded1a7), [08c289b](https://github.com/google/adk-python/commit/08c289bb48e9fda73ed06d03dc7d8879c73fd2db))
+* **A2A**: The A2A integration is now stable, and `adk generate_agent_card` builds an A2A agent card from the CLI. See the [unit guide](https://github.com/google/adk-python/blob/main/docs/guides/a2a/utils/agent_to_a2a/index.md) for more details. ([95d4a56](https://github.com/google/adk-python/commit/95d4a5660f5ab4707b251c0b7c86053e5c6f311e), [875e2ae](https://github.com/google/adk-python/commit/875e2aef7e800ca307fcff85b68e54d6101ba63c))
+* **Integrations**:
+  * `TeamsRunner` connects an ADK agent to Microsoft Teams chats and channels. See the [unit guide](https://github.com/google/adk-python/blob/main/docs/guides/integrations/teams/teams_runner/index.md) for more details. ([c4376a6](https://github.com/google/adk-python/commit/c4376a65764bfd7abd016b81cde1e5165318b604))
+  * `OpenAIDecisionsClassifier` classifies workflow and tool-gating questions with the OpenAI Decisions API. See the [unit guide](https://github.com/google/adk-python/blob/main/docs/guides/integrations/openai/openai_decisions_classifier/index.md) for more details. ([aa98d18](https://github.com/google/adk-python/commit/aa98d180b6abf1966dbe378094a69aa488c2123e))
+  * `MongoDbMemoryService` adds vector search retrieval (`retrieval_mode="vector"` or `"auto"`) and TTL expiration (`memory_ttl_days`). See the [unit guide](https://github.com/google/adk-python/blob/main/docs/guides/integrations/mongodb/memory_service/index.md) for more details. ([1c84bb9](https://github.com/google/adk-python/commit/1c84bb955b9dd5b118594ccb9e219ac393ee31f9))
+* **Stable APIs**: 26 auth, environment, app, CLI and cache modules, 16 toolset and integration features, and the mature evaluation and user simulation classes graduate from experimental, so you can build on them without experimental warnings. ([c54b253](https://github.com/google/adk-python/commit/c54b253eba3359264a5f86805051aeb6cd93034d), [799fc94](https://github.com/google/adk-python/commit/799fc9459eb9443a63db11a179d6422b7e1dc1c0), [1112606](https://github.com/google/adk-python/commit/1112606c22856d4633a8c80d178386b168b2f632))
+* **Workflow performance**: Long multi-turn workflows run faster and use less memory; a 30-node workflow's 200-turn run is 23% faster with 9% lower peak memory. ([532580c](https://github.com/google/adk-python/commit/532580c8e0511c659eac39cd9305a02ecb796064), [1f21370](https://github.com/google/adk-python/commit/1f2137094d0453a31411b4338e70c7c0e8e01289))
+
+#### Breaking changes
+
+* **Enum tool arguments arrive as members**: `FunctionTool` parameters annotated `Enum`, `Optional[Enum]`, or `list[Enum]` now receive enum members instead of the raw strings the model sent (as `FUNCTION_TOOL_ARG_VALIDATION` already did). For a plain `Enum`, `arg == "value"`, string-keyed dict lookups, `match` on strings, `json.dumps`, and string methods no longer work. A callable `require_confirmation` still receives the raw values (unless `FUNCTION_TOOL_ARG_VALIDATION` is on). For a `(str, Enum)`, `str()` and, on Python 3.11+, f-strings now render `Cls.MEMBER`. Compare against members, use `.value`, or switch to `StrEnum`. Enum members a tool returns in its result are still sent to the model as their values. ([82fe029](https://github.com/google/adk-python/commit/82fe029b8490479229dbfc33815468fe17a427ab), [58332a2](https://github.com/google/adk-python/commit/58332a284b73435eb5c54dac73f6740258b7a741))
+* **`VertexAiSessionService.create_session` accepts only session config options**: extra keyword arguments are limited to `display_name`, `ttl`, `expire_time`, and `labels` (plus camelCase aliases). Other Sessions API config keys, such as `http_options`, `session_state`, `sessionId`, and `wait_for_completion`, now raise `ValueError` (HTTP 400 when sent as session `options` to `adk api_server`). Use `state=` and `session_id=` for state and IDs. ([968cd86](https://github.com/google/adk-python/commit/968cd869ff79be622eb921c5e314bd19efd889d2))
... [DIFF_PREVIEW_TRUNCATED]
```

</details>
