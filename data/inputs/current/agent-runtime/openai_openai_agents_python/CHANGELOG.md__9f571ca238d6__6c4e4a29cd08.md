# openai/openai-agents-python · CHANGELOG.md

> 当前有效引用快照. 完整原文由固定 Git Blob 保存, 当前活动输入不重复内联.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [openai/openai-agents-python](https://github.com/openai/openai-agents-python) |
| 来源文件 | [CHANGELOG.md](https://github.com/openai/openai-agents-python/blob/6c4e4a29cd08eef454db6980d74da6afc8939d24/CHANGELOG.md) |
| 来源版本 | `6c4e4a29cd08eef454db6980d74da6afc8939d24` |
| 来源目录 Tree | `f4a03a95e02d5c0480c5371126f5f82e511cdf2a` |
| 来源内容 Blob | `9f571ca238d62418e06a2a7045c9347b7ea1f202` |
| 摄取时间 | `2026-11-23T02:03:16.919345+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `external_doc_openai_openai_agents_python_changelog_md` |
| 快照模式 | `PINNED_EXTERNAL_REFERENCE` |
| 规范内容 SHA256 | `433181dede58e134ef79571fc1acd8a85c093f596cddf7713b7b573c6b75b233` |
| 原文字节数 | `70082` |
| 原文行数 | `332` |

## 本次变化

- 新增行数 `113`.
- 删除行数 `0`.
- 完整 Diff 字节数 `24382`.
- 来源变化不等于本仓执行验证或独立研究次数.

## 阅读导航

- Changelog
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

- [按固定源提交读取完整原文](https://github.com/openai/openai-agents-python/blob/6c4e4a29cd08eef454db6980d74da6afc8939d24/CHANGELOG.md).
- 原文由来源 Blob SHA 与规范内容 SHA256 共同识别.
- 被替换的完整活动快照先原样封存到只追加 Archive.
- Diff 过长时只展示有界预览, 预览不代表完整差异.

<details>
<summary>展开有界版本差异</summary>

```diff
--- previous

+++ 9f571ca238d62418e06a2a7045c9347b7ea1f202

@@ -1,4 +1,117 @@

 # Changelog
+
+## [0.25.0](https://github.com/openai/openai-agents-python/compare/v0.24.0...v0.25.0) (2026-11-17)
+
+
+### Features
+
+* expose utilities for third-party session adapters ([#5428](https://github.com/openai/openai-agents-python/issues/5428)) ([16fdb20](https://github.com/openai/openai-agents-python/commit/16fdb2091d0b18cc1200d26ba6a20ee6f1962455))
+* **sandbox:** remove Runloop provider ([#5369](https://github.com/openai/openai-agents-python/issues/5369)) ([12ce34d](https://github.com/openai/openai-agents-python/commit/12ce34d8438d6f1f7c964a261b89e069e8a0b3d3))
+
+
+### Bug Fixes
+
+* add opt-in handoff error recovery ([#5418](https://github.com/openai/openai-agents-python/issues/5418)) ([a6ed84f](https://github.com/openai/openai-agents-python/commit/a6ed84f38ed374585fb3969a8177a76755d58d94))
+* align implicit settings with provider-selected models ([#5425](https://github.com/openai/openai-agents-python/issues/5425)) ([a88d291](https://github.com/openai/openai-agents-python/commit/a88d2919631dbd93801a79eb0f97011ef9b451b7))
+* align model defaults with TS SDK ([#6064](https://github.com/openai/openai-agents-python/issues/6064)) ([d5287b7](https://github.com/openai/openai-agents-python/commit/d5287b741dfd93de3ce1625f98b342cd0c4c455e))
+* allow concurrent Streamable HTTP requests on MCP v2 ([#5641](https://github.com/openai/openai-agents-python/issues/5641)) ([2b90566](https://github.com/openai/openai-agents-python/commit/2b90566eb2adc7d94e8fd8f234b007a937a98989))
+* default GPT-6 Chat Completions tool requests to non-reasoning ([#5420](https://github.com/openai/openai-agents-python/issues/5420)) ([3396dca](https://github.com/openai/openai-agents-python/commit/3396dca75663d3e72f27aed3e3a79c5d018b8332))
+* **deps-dev:** bump aiohttp from 3.14.3 to 3.14.5 ([#5403](https://github.com/openai/openai-agents-python/issues/5403)) ([442d0ea](https://github.com/openai/openai-agents-python/commit/442d0ea112e62e3423d3e93478532424f71b3f8a))
+* **deps-dev:** bump dapr from 1.18.3 to 1.19.0 ([#5711](https://github.com/openai/openai-agents-python/issues/5711)) ([25e7b2e](https://github.com/openai/openai-agents-python/commit/25e7b2e40258cc0910159f35d463b64582ec83f6))
+* **deps-dev:** bump fastapi from 0.141.1 to 0.162.2 ([#6053](https://github.com/openai/openai-agents-python/issues/6053)) ([494c0c0](https://github.com/openai/openai-agents-python/commit/494c0c0c13c8a08c83161848c275365febe90601))
+* **deps-dev:** bump playwright from 1.50.0 to 1.63.0 ([#5402](https://github.com/openai/openai-agents-python/issues/5402)) ([0dc4cf1](https://github.com/openai/openai-agents-python/commit/0dc4cf152bff1f50bdc0e41f28808563406545b2))
+* **deps-dev:** bump pytest from 9.0.3 to 9.2.0 ([#5710](https://github.com/openai/openai-agents-python/issues/5710)) ([b0051a7](https://github.com/openai/openai-agents-python/commit/b0051a736fec104ee8b4d254de3e0c13758ecaec))
+* **deps-dev:** bump rich from 14.3.3 to 15.0.0 ([#6055](https://github.com/openai/openai-agents-python/issues/6055)) ([18d979b](https://github.com/openai/openai-agents-python/commit/18d979bf218016a86cbbba1bd38165c87f7c2233))
+* **deps-dev:** bump ruff from 0.16.8 to 0.17.1 ([#5439](https://github.com/openai/openai-agents-python/issues/5439)) ([5bb6fb7](https://github.com/openai/openai-agents-python/commit/5bb6fb727a67bb4da21f8d04d0b8d3e7a65f463a))
+* **deps-dev:** bump twilio from 9.11.1 to 9.12.0 ([#5486](https://github.com/openai/openai-agents-python/issues/5486)) ([465583d](https://github.com/openai/openai-agents-python/commit/465583dc88f9e91a8a8ec3e076f6bc2362119023))
+* **deps-dev:** bump websockets from 15.0.1 to 16.1.1 ([#5484](https://github.com/openai/openai-agents-python/issues/5484)) ([86bd298](https://github.com/openai/openai-agents-python/commit/86bd29878b30062757fdb4f32fb95eb8eccc7e36))
+* **deps:** allow websockets 17 ([#6044](https://github.com/openai/openai-agents-python/issues/6044)) ([9d0f5e8](https://github.com/openai/openai-agents-python/commit/9d0f5e83135e79ef49a62390c4ecf3cfe0c1c9fc))
+* **deps:** bump actions/create-github-app-token from 3.2.0 to 3.3.0 ([#5464](https://github.com/openai/openai-agents-python/issues/5464)) ([b8df4ff](https://github.com/openai/openai-agents-python/commit/b8df4ffa7dc626e1f872566241af06b2bdbc9d0e))
+* **deps:** bump actions/download-artifact from 8.0.1 to 8.0.2 ([#5466](https://github.com/openai/openai-agents-python/issues/5466)) ([eccd8c8](https://github.com/openai/openai-agents-python/commit/eccd8c85eec85714ec798b1acf4ae2109d603dc0))
+* **deps:** bump actions/setup-python from 7.0.0 to 7.1.0 ([#5465](https://github.com/openai/openai-agents-python/issues/5465)) ([18d233b](https://github.com/openai/openai-agents-python/commit/18d233b35fa7b5b86ed7920f7482e8d9c5cc7ce6))
+* **deps:** bump astral-sh/setup-uv from 10.2.0 to 10.3.2 ([#5463](https://github.com/openai/openai-agents-python/issues/5463)) ([1ed8268](https://github.com/openai/openai-agents-python/commit/1ed8268eb3a71065d81ec444189dcb7396334d54))
+* **deps:** bump certifi from 2026.10.19 to 2026.10.23 ([#5709](https://github.com/openai/openai-agents-python/issues/5709)) ([976f2f1](https://github.com/openai/openai-agents-python/commit/976f2f1ee49e321cf4e15de9a52efab0f22f8e02))
+* **deps:** bump daytona from 0.155.0 to 0.226.1 ([#5487](https://github.com/openai/openai-agents-python/issues/5487)) ([d4f07df](https://github.com/openai/openai-agents-python/commit/d4f07df2915ddb029d7076595bb7d4ce89322308))
+* **deps:** bump httpx2 from 2.12.0 to 2.14.0 ([#5438](https://github.com/openai/openai-agents-python/issues/5438)) ([0c55458](https://github.com/openai/openai-agents-python/commit/0c55458f03127b2506119544bfebe18b8a867a55))
+* **deps:** bump mcp from 2.0.0 to 2.2.0 ([#5393](https://github.com/openai/openai-agents-python/issues/5393)) ([97c8288](https://github.com/openai/openai-agents-python/commit/97c8288bc6e97d69f45fc3732f1cf236b321d125))
+* **deps:** bump mcp from 2.0.0 to 2.3.0 ([#5404](https://github.com/openai/openai-agents-python/issues/5404)) ([e2de6a8](https://github.com/openai/openai-agents-python/commit/e2de6a8f2c61ea3818f582fc74c8f8a8da9830b2))
+* **deps:** bump openai from 3.29.0 to 3.48.0 ([#6054](https://github.com/openai/openai-agents-python/issues/6054)) ([a4a4fa4](https://github.com/openai/openai-agents-python/commit/a4a4fa4cf0e34516df57871196de360253e614fe))
+* **deps:** bump opentelemetry-api from 1.40.0 to 1.45.1 ([#5410](https://github.com/openai/openai-agents-python/issues/5410)) ([2964f77](https://github.com/openai/openai-agents-python/commit/2964f772a72f2c14186bbd4203cd10723f81aeb2))
+* **deps:** bump opentelemetry-api from 1.45.1 to 1.45.2 ([#5983](https://github.com/openai/openai-agents-python/issues/5983)) ([cdc8d58](https://github.com/openai/openai-agents-python/commit/cdc8d586a57aee0056ed7a7f2869f36ec089c003))
+* **deps:** bump pydantic from 2.14.2 to 2.14.3 ([#6052](https://github.com/openai/openai-agents-python/issues/6052)) ([4bb2637](https://github.com/openai/openai-agents-python/commit/4bb2637dcdc2c27da7a0d1820d416cb7e0eab4ab))
+* **deps:** bump starlette from 1.6.0 to 1.7.0 ([#5708](https://github.com/openai/openai-agents-python/issues/5708)) ([82483dd](https://github.com/openai/openai-agents-python/commit/82483dd99bc68fcaaae84baddfed44f27201593c))
+* **deps:** bump the codeql group with 2 updates ([#5462](https://github.com/openai/openai-agents-python/issues/5462)) ([775707e](https://github.com/openai/openai-agents-python/commit/775707e2c39f7c91213716ceaea60a3d8230cf7b))
+* **deps:** require certifi 2026.10.19 or later ([#5429](https://github.com/openai/openai-agents-python/issues/5429)) ([6295010](https://github.com/openai/openai-agents-python/commit/6295010c7568d3f95e0f6e0e19b625bae65d9f01))
+* **deps:** require pymongo 4.18.3 or later ([#5445](https://github.com/openai/openai-agents-python/issues/5445)) ([57027de](https://github.com/openai/openai-agents-python/commit/57027de5f00409443011a3b12c1a54533f8931ee))
... [DIFF_PREVIEW_TRUNCATED]
```

</details>
