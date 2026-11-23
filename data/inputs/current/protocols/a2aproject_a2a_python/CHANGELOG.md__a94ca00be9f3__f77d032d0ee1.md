# a2aproject/a2a-python · CHANGELOG.md

> 当前有效引用快照. 完整原文由固定 Git Blob 保存, 当前活动输入不重复内联.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [a2aproject/a2a-python](https://github.com/a2aproject/a2a-python) |
| 来源文件 | [CHANGELOG.md](https://github.com/a2aproject/a2a-python/blob/f77d032d0ee1ff7c598ea27f2fe9324e8360f434/CHANGELOG.md) |
| 来源版本 | `f77d032d0ee1ff7c598ea27f2fe9324e8360f434` |
| 来源目录 Tree | `5a5c5d503a5a4ac73cf65fd3de9d21e6caf67c28` |
| 来源内容 Blob | `a94ca00be9f3ae75ed5784fb3f633123bb99a161` |
| 摄取时间 | `2026-11-23T02:03:14.496025+00:00` |
| 归属层 | `protocols` |
| 可信度 | `1.0` |
| 记忆实体 | `external_doc_a2aproject_a2a_python_changelog_md` |
| 快照模式 | `PINNED_EXTERNAL_REFERENCE` |
| 规范内容 SHA256 | `6669d90ae02c388be99074a1ffa8182c0f182a5fe8bf61240e05aba01c9f7ed5` |
| 原文字节数 | `96835` |
| 原文行数 | `1034` |

## 本次变化

- 新增行数 `41`.
- 删除行数 `0`.
- 完整 Diff 字节数 `7740`.
- 来源变化不等于本仓执行验证或独立研究次数.

## 阅读导航

- Changelog
- [1.3.1](https://github.com/a2aproject/a2a-python/compare/v1.3.0...v1.3.1) (2026-11-16)
- Features
- Bug Fixes
- [1.3.0](https://github.com/a2aproject/a2a-python/compare/v1.2.3...v1.3.0) (2026-10-27)
- Features
- Bug Fixes
- Documentation
- Miscellaneous Chores
- [1.2.3](https://github.com/a2aproject/a2a-python/compare/v1.2.2...v1.2.3) (2026-10-17)
- Bug Fixes
- [1.2.2](https://github.com/a2aproject/a2a-python/compare/v1.2.1...v1.2.2) (2026-10-03)
- Features
- Bug Fixes
- [1.2.1](https://github.com/a2aproject/a2a-python/compare/v1.2.0...v1.2.1) (2026-09-30)
- Bug Fixes
- [1.2.0](https://github.com/a2aproject/a2a-python/compare/v1.1.5...v1.2.0) (2026-09-29)
- Features
- Bug Fixes
- Documentation
- [1.1.5](https://github.com/a2aproject/a2a-python/compare/v1.1.4...v1.1.5) (2026-09-21)
- Bug Fixes
- [1.1.4](https://github.com/a2aproject/a2a-python/compare/v1.1.3...v1.1.4) (2026-09-07)
- Features

## 原文完整性与取回

- [按固定源提交读取完整原文](https://github.com/a2aproject/a2a-python/blob/f77d032d0ee1ff7c598ea27f2fe9324e8360f434/CHANGELOG.md).
- 原文由来源 Blob SHA 与规范内容 SHA256 共同识别.
- 被替换的完整活动快照先原样封存到只追加 Archive.
- Diff 过长时只展示有界预览, 预览不代表完整差异.

<details>
<summary>展开有界版本差异</summary>

```diff
--- previous

+++ a94ca00be9f3ae75ed5784fb3f633123bb99a161

@@ -1,4 +1,45 @@

 # Changelog
+
+## [1.3.1](https://github.com/a2aproject/a2a-python/compare/v1.3.0...v1.3.1) (2026-11-16)
+
+
+### Features
+
+* add httpx2 support ([#1439](https://github.com/a2aproject/a2a-python/issues/1439)) ([a59bb68](https://github.com/a2aproject/a2a-python/commit/a59bb681cb201bc28ef5fe860078a18b1459ce8c))
+* **cluster:** Introduce ServerCallContext to DatabaseTaskEventStream ([#1399](https://github.com/a2aproject/a2a-python/issues/1399)) ([6168d59](https://github.com/a2aproject/a2a-python/commit/6168d59ef54c35caaaef3dafaf897f829a171893))
+
+
+### Bug Fixes
+
+* **client:** handle case-insensitive SSE media types ([#1464](https://github.com/a2aproject/a2a-python/issues/1464)) ([3932982](https://github.com/a2aproject/a2a-python/commit/39329820e31fe4977e63cf07ce4b2c2b73066a9e))
+* **client:** keep tenant defaults local to each call ([#1463](https://github.com/a2aproject/a2a-python/issues/1463)) ([569b94f](https://github.com/a2aproject/a2a-python/commit/569b94f14900ce7e221f6f2adcff7742c1716926))
+* **client:** percent-encode ids in REST transport paths ([#1436](https://github.com/a2aproject/a2a-python/issues/1436)) ([1bbe69c](https://github.com/a2aproject/a2a-python/commit/1bbe69cf83d5813e3c9a87e4a87fac6ac19ab8f3))
+* **client:** split SSE lines only on CR, LF and CRLF ([#1456](https://github.com/a2aproject/a2a-python/issues/1456)) ([c8ccea9](https://github.com/a2aproject/a2a-python/commit/c8ccea90c2c5d363d81b700086334dd06d3e1578))
+* **compat:** get a v0.3 push config by task id alone ([#1380](https://github.com/a2aproject/a2a-python/issues/1380)) ([aa8e966](https://github.com/a2aproject/a2a-python/commit/aa8e966c3c422e52d517495893e08e072429857a))
+* **compat:** list push notification configs in the v0.3 REST client ([#1424](https://github.com/a2aproject/a2a-python/issues/1424)) ([d830036](https://github.com/a2aproject/a2a-python/commit/d830036f80c1b5e544272a56ca8bf7222dfe41d6)), closes [#1423](https://github.com/a2aproject/a2a-python/issues/1423)
+* **compat:** map v0.3 gRPC errors from their ErrorInfo reason ([#1466](https://github.com/a2aproject/a2a-python/issues/1466)) ([caab6a2](https://github.com/a2aproject/a2a-python/commit/caab6a252958b2218ea61c0cae772f0a5c159e2a))
+* **compat:** parse the v0.3 REST extended agent card as JSON ([#1420](https://github.com/a2aproject/a2a-python/issues/1420)) ([076e0ec](https://github.com/a2aproject/a2a-python/commit/076e0eca8e256667b293ce4118c24e3dc5c72af5))
+* **compat:** percent-encode ids in v0.3 REST transport paths ([#1458](https://github.com/a2aproject/a2a-python/issues/1458)) ([1ff86d5](https://github.com/a2aproject/a2a-python/commit/1ff86d597caddd90cb22a1a7264097f64b287905))
+* **compat:** return -32602 for invalid v0.3 JSON-RPC params ([#1419](https://github.com/a2aproject/a2a-python/issues/1419)) ([05aaff6](https://github.com/a2aproject/a2a-python/commit/05aaff62412a1bae8f38b77428f8e899e5c69d26))
+* **compat:** return 400 for a non-integer v0.3 REST historyLength ([#1382](https://github.com/a2aproject/a2a-python/issues/1382)) ([9c90c48](https://github.com/a2aproject/a2a-python/commit/9c90c481437a4959ae4bf5f5350bd52c5f4ff913)), closes [#1381](https://github.com/a2aproject/a2a-python/issues/1381)
+* **compat:** return HTTP errors from v0.3 REST streams that fail early ([#1403](https://github.com/a2aproject/a2a-python/issues/1403)) ([11f1116](https://github.com/a2aproject/a2a-python/commit/11f1116872f982bb13ef86b849ce6e306d6d1f63))
+* **compat:** send no v0.3 configuration when the request has none ([#1429](https://github.com/a2aproject/a2a-python/issues/1429)) ([01483cb](https://github.com/a2aproject/a2a-python/commit/01483cb3278cd4c0bde3f810889367df594ee76f))
+* **compat:** send v0.3 REST request bodies with json_name keys ([#1455](https://github.com/a2aproject/a2a-python/issues/1455)) ([2399993](https://github.com/a2aproject/a2a-python/commit/239999307b365ff99db98495fc78683868976c1e))
+* **compat:** serve DELETE for v0.3 REST push notification configs ([#1442](https://github.com/a2aproject/a2a-python/issues/1442)) ([14e799c](https://github.com/a2aproject/a2a-python/commit/14e799cb245c79e9f46bfb07763d7840b43e4cff))
+* reject decoded values that are not objects in parse_lenient ([#1431](https://github.com/a2aproject/a2a-python/issues/1431)) ([257626b](https://github.com/a2aproject/a2a-python/commit/257626baae1f44a54cb9b9d599cd8f0100fbf0a4))
+* reject invalid REST boolean query values ([#1383](https://github.com/a2aproject/a2a-python/issues/1383)) ([babc3f5](https://github.com/a2aproject/a2a-python/commit/babc3f56840456f86870b3fef4b3af88041082ab))
+* **server:** close the event queues when ActiveTask.start() fails ([#1422](https://github.com/a2aproject/a2a-python/issues/1422)) ([5e0d415](https://github.com/a2aproject/a2a-python/commit/5e0d415761d3f596f0a4354e3a265c1343b0e887))
+* **server:** create the cluster tables lazily in VersionedDatabaseTaskStore get and delete ([#1357](https://github.com/a2aproject/a2a-python/issues/1357)) ([4e133b7](https://github.com/a2aproject/a2a-python/commit/4e133b77a0727f81ee2c360e9c8eeba298a6f2f2))
+* **server:** fail fast when an executor produces no events ([#1345](https://github.com/a2aproject/a2a-python/issues/1345)) ([ab7e36f](https://github.com/a2aproject/a2a-python/commit/ab7e36f9160bc7c68752f2468cda821a978c6d8c))
+* **server:** fail streaming sends when an executor produces no events ([#1460](https://github.com/a2aproject/a2a-python/issues/1460)) ([c16cab1](https://github.com/a2aproject/a2a-python/commit/c16cab1ca22a5fac8288c1351610dfc85a4e072c))
+* **server:** forward CancelTaskRequest.metadata to AgentExecutor.cancel ([#1416](https://github.com/a2aproject/a2a-python/issues/1416)) ([f666ba3](https://github.com/a2aproject/a2a-python/commit/f666ba3eb32a7f99f11093d753caf3fc7ecf846b)), closes [#1415](https://github.com/a2aproject/a2a-python/issues/1415)
+* **server:** infer contextId from task when only taskId is provided ([#1453](https://github.com/a2aproject/a2a-python/issues/1453)) ([2ba8e7b](https://github.com/a2aproject/a2a-python/commit/2ba8e7bd27fce7de92c33813a46dbea1e3f7e6ce)), closes [#1411](https://github.com/a2aproject/a2a-python/issues/1411)
+* **server:** match input modes on type and subtype, ignoring case ([#1425](https://github.com/a2aproject/a2a-python/issues/1425)) ([28f8a62](https://github.com/a2aproject/a2a-python/commit/28f8a62f25d46067ae846329a42a60c820fa927e))
+* **server:** prevent failed cancel from overwriting terminal task state ([#1405](https://github.com/a2aproject/a2a-python/issues/1405)) ([ac48ce1](https://github.com/a2aproject/a2a-python/commit/ac48ce10f768ef2c1c7c3cfca4d388dd66ba2f60))
+* **server:** record FAILED when a task's terminal save fails ([#1400](https://github.com/a2aproject/a2a-python/issues/1400)) ([4e916d8](https://github.com/a2aproject/a2a-python/commit/4e916d81c66de89a41ad2b23a437c45ff9d8c49d))
+* **server:** reject out-of-range ListTasks cursor timestamps ([#1451](https://github.com/a2aproject/a2a-python/issues/1451)) ([f451ed7](https://github.com/a2aproject/a2a-python/commit/f451ed74678cf808544333a8f1dfe66289dfd12b))
+* **server:** run after_handler_run when a handler call is cancelled ([#1427](https://github.com/a2aproject/a2a-python/issues/1427)) ([2cc1dd5](https://github.com/a2aproject/a2a-python/commit/2cc1dd5020874376ed293ef87089e5df9d205571))
+* **server:** treat request bodies that are not valid UTF-8 as parse errors ([#1401](https://github.com/a2aproject/a2a-python/issues/1401)) ([56ec855](https://github.com/a2aproject/a2a-python/commit/56ec85519cd627ddfe7b4b79ecde9f2252f6b6ca))
 
 ## [1.3.0](https://github.com/a2aproject/a2a-python/compare/v1.2.3...v1.3.0) (2026-10-27)
```

</details>
