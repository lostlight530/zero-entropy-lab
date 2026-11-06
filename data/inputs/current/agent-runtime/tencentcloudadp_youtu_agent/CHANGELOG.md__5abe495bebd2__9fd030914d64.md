# TencentCloudADP/youtu-agent · CHANGELOG.md

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [TencentCloudADP/youtu-agent](https://github.com/TencentCloudADP/youtu-agent) |
| 来源文件 | [CHANGELOG.md](https://github.com/TencentCloudADP/youtu-agent/blob/9fd030914d646492398e63f71b9724df1a88da35/CHANGELOG.md) |
| 来源版本 | `9fd030914d646492398e63f71b9724df1a88da35` |
| 来源目录 Tree | `477a754d407daef20c782c87e8300bfc66505c6f` |
| 来源内容 Blob | `5abe495bebd29c4195645f46faf7ea167fe9d412` |
| 摄取时间 | `2026-11-06T16:23:01.931027+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_tencentcloudadp_youtu_agent_changelog_md_1692b41f09c9` |

## 本次变化

- 新增行数 `3`.
- 删除行数 `0`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- Changelog
- v0.1.4 - 2026-11-06
- v0.1.3 - 2025-10-31
- v0.1.2 - 2025-10-13
- v0.1.1 - 2025-09-22
- v0.1.0
- frontend/v0.1.5 - 2025-08-29

<details>
<summary>展开完整外部原文</summary>

# Changelog

## v0.1.4 - 2026-11-06
- security(webui): fix unauthenticated remote code execution in `WebUIAgents` (CNVD report). `switch_agent` only loads configs listed by `list_agents`; `/ws` and `/upload` reject cross-origin requests (`UTU_WEBUI_ALLOWED_ORIGINS` to allow more); upload filenames are confined to the workspace; access token `UTU_WEBUI_TOKEN`, required when listening on a non-loopback address (**breaking for Docker**: set `UTU_WEBUI_TOKEN` in `.env`, or `UTU_WEBUI_ALLOW_INSECURE=true` behind an authenticating proxy). Docker docs now publish the port on `127.0.0.1` only. Upgrade if your WebUI is reachable from other hosts.

## v0.1.3 - 2025-10-31
- analysis ui: add trajectories tab by @qiuchaofan
- feat: add hooks (examples) by @Lightblues
- examples: add ppt-gen by @fpg2012 RAG example by @Lightblues
- train: add training-free GRPO branch by @pakchoi-i @YZ-Cai
- train: support rl-train @Lightblues

## v0.1.2 - 2025-10-13
- example: add ppt-gen by @fpg2012
- analysis ui: unify env variable; fix filter by tool @chaofanqiu
- ui: add file upload by @fpg2012
- example: add examples for rl @Lightblues
- tracing: add doc for phenix @Lightblues
- feat: add OrchestratorAgent @Lightblues
- enhance: refactor AynscBaseToolkit @Lightblues

## v0.1.1 - 2025-09-22
- update toolkit util scripts by @Lightblues
- LiteLLM support by @Lightblues
- Streaming support for OrchestraAgent by @fpg2012
- feat: tool maker @Lightblues
- ui: i18n, demo_universal by @fpg2012

## v0.1.0
- add `exp_analysis` frontend by @qiuchaofan
- add `CONTRIBUTING.md` by @Lightblues
- add detailed quickstart doc by @pakchoi-i
- add Docker support by @YZ-Cai

## frontend/v0.1.5 - 2025-08-29
- add the `utu_agent_ui` package by @fpg2012

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ 5abe495bebd29c4195645f46faf7ea167fe9d412

@@ -1,4 +1,7 @@

 # Changelog
+
+## v0.1.4 - 2026-11-06
+- security(webui): fix unauthenticated remote code execution in `WebUIAgents` (CNVD report). `switch_agent` only loads configs listed by `list_agents`; `/ws` and `/upload` reject cross-origin requests (`UTU_WEBUI_ALLOWED_ORIGINS` to allow more); upload filenames are confined to the workspace; access token `UTU_WEBUI_TOKEN`, required when listening on a non-loopback address (**breaking for Docker**: set `UTU_WEBUI_TOKEN` in `.env`, or `UTU_WEBUI_ALLOW_INSECURE=true` behind an authenticating proxy). Docker docs now publish the port on `127.0.0.1` only. Upgrade if your WebUI is reachable from other hosts.
 
 ## v0.1.3 - 2025-10-31
 - analysis ui: add trajectories tab by @qiuchaofan
```

</details>
