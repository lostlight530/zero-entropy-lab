# run-llama/llama_index · CHANGELOG.md

> 当前有效引用快照. 完整原文由固定 Git Blob 保存, 当前活动输入不重复内联.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [run-llama/llama_index](https://github.com/run-llama/llama_index) |
| 来源文件 | [CHANGELOG.md](https://github.com/run-llama/llama_index/blob/99d7433f6f71888951379ccca9294e272442c832/CHANGELOG.md) |
| 来源版本 | `99d7433f6f71888951379ccca9294e272442c832` |
| 来源目录 Tree | `d51f7eee0980a2de19a1b8827ee53f084e365db8` |
| 来源内容 Blob | `04e94af27a02fcbb2b537c88fb1fa5baf8d8c05d` |
| 摄取时间 | `2026-11-15T01:26:04.162173+00:00` |
| 归属层 | `memory-context-sandbox` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_run_llama_llama_index_changelog_md_2983f3183db5` |
| 快照模式 | `PINNED_EXTERNAL_REFERENCE` |
| 规范内容 SHA256 | `6800d798fd9337e51ebf3462fbfdeed9f9391ce240a85cf7c8ec16ca716bf9fa` |
| 原文字节数 | `720146` |
| 原文行数 | `17332` |

## 本次变化

- 新增行数 `552`.
- 删除行数 `0`.
- 完整 Diff 字节数 `34886`.
- 来源变化不等于本仓执行验证或独立研究次数.

## 阅读导航

- ChangeLog
- [2026-11-13]
- llama-index-agent-agentmesh [0.3.0]
- llama-index-callbacks-argilla [0.6.0]
- llama-index-callbacks-arize-phoenix [0.8.0]
- llama-index-callbacks-honeyhive [0.6.0]
- llama-index-callbacks-langfuse [0.6.0]
- llama-index-callbacks-literalai [1.5.0]
- llama-index-callbacks-openinference [0.6.0]
- llama-index-callbacks-opik [1.4.0]
- llama-index-callbacks-promptlayer [0.6.0]
- llama-index-callbacks-uptrain [0.7.0]
- llama-index-callbacks-wandb [0.6.0]
- llama-index-core [0.14.26]
- llama-index-embeddings-adapter [0.6.0]
- llama-index-embeddings-alephalpha [0.6.0]
- llama-index-embeddings-alibabacloud-aisearch [0.5.0]
- llama-index-embeddings-anyscale [0.6.1]
- llama-index-embeddings-autoembeddings [0.4.0]
- llama-index-embeddings-azure-inference [0.6.0]
- llama-index-embeddings-azure-openai [0.6.1]
- llama-index-embeddings-baseten [0.3.0]
- llama-index-embeddings-bedrock [0.9.0]
- llama-index-embeddings-clarifai [0.6.0]

## 原文完整性与取回

- [按固定源提交读取完整原文](https://github.com/run-llama/llama_index/blob/99d7433f6f71888951379ccca9294e272442c832/CHANGELOG.md).
- 原文由来源 Blob SHA 与规范内容 SHA256 共同识别.
- 被替换的完整活动快照先原样封存到只追加 Archive.
- Diff 过长时只展示有界预览, 预览不代表完整差异.

<details>
<summary>展开有界版本差异</summary>

```diff
--- previous

+++ 04e94af27a02fcbb2b537c88fb1fa5baf8d8c05d

@@ -1,6 +1,558 @@

 # ChangeLog
 
 <!--- generated changelog --->
+
+## [2026-11-13]
+
+### llama-index-agent-agentmesh [0.3.0]
+
+- Python security relock: all integration uv.lock files (lock files only, no Python floor changes) ([#24039](https://github.com/run-llama/llama_index/pull/24039))
+- BREAKING: raise requires-python for security fixes across integrations (stacked on #24039) ([#24040](https://github.com/run-llama/llama_index/pull/24040))
+
+### llama-index-callbacks-argilla [0.6.0]
+
+- Python security relock: all integration uv.lock files (lock files only, no Python floor changes) ([#24039](https://github.com/run-llama/llama_index/pull/24039))
+- BREAKING: raise requires-python for security fixes across integrations (stacked on #24039) ([#24040](https://github.com/run-llama/llama_index/pull/24040))
+
+### llama-index-callbacks-arize-phoenix [0.8.0]
+
+- Python security relock: all integration uv.lock files (lock files only, no Python floor changes) ([#24039](https://github.com/run-llama/llama_index/pull/24039))
+- BREAKING: raise requires-python for security fixes across integrations (stacked on #24039) ([#24040](https://github.com/run-llama/llama_index/pull/24040))
+
+### llama-index-callbacks-honeyhive [0.6.0]
+
+- Python security relock: all integration uv.lock files (lock files only, no Python floor changes) ([#24039](https://github.com/run-llama/llama_index/pull/24039))
+- BREAKING: raise requires-python for security fixes across integrations (stacked on #24039) ([#24040](https://github.com/run-llama/llama_index/pull/24040))
+
+### llama-index-callbacks-langfuse [0.6.0]
+
+- Python security relock: all integration uv.lock files (lock files only, no Python floor changes) ([#24039](https://github.com/run-llama/llama_index/pull/24039))
+- BREAKING: raise requires-python for security fixes across integrations (stacked on #24039) ([#24040](https://github.com/run-llama/llama_index/pull/24040))
+
+### llama-index-callbacks-literalai [1.5.0]
+
+- Python security relock: all integration uv.lock files (lock files only, no Python floor changes) ([#24039](https://github.com/run-llama/llama_index/pull/24039))
+- BREAKING: raise requires-python for security fixes across integrations (stacked on #24039) ([#24040](https://github.com/run-llama/llama_index/pull/24040))
+
+### llama-index-callbacks-openinference [0.6.0]
+
+- Python security relock: all integration uv.lock files (lock files only, no Python floor changes) ([#24039](https://github.com/run-llama/llama_index/pull/24039))
+- BREAKING: raise requires-python for security fixes across integrations (stacked on #24039) ([#24040](https://github.com/run-llama/llama_index/pull/24040))
+
+### llama-index-callbacks-opik [1.4.0]
+
+- Python security relock: all integration uv.lock files (lock files only, no Python floor changes) ([#24039](https://github.com/run-llama/llama_index/pull/24039))
+- BREAKING: raise requires-python for security fixes across integrations (stacked on #24039) ([#24040](https://github.com/run-llama/llama_index/pull/24040))
+
+### llama-index-callbacks-promptlayer [0.6.0]
+
+- Python security relock: all integration uv.lock files (lock files only, no Python floor changes) ([#24039](https://github.com/run-llama/llama_index/pull/24039))
+- BREAKING: raise requires-python for security fixes across integrations (stacked on #24039) ([#24040](https://github.com/run-llama/llama_index/pull/24040))
+
+### llama-index-callbacks-uptrain [0.7.0]
+
+- Python security relock: all integration uv.lock files (lock files only, no Python floor changes) ([#24039](https://github.com/run-llama/llama_index/pull/24039))
+- BREAKING: raise requires-python for security fixes across integrations (stacked on #24039) ([#24040](https://github.com/run-llama/llama_index/pull/24040))
+
+### llama-index-callbacks-wandb [0.6.0]
+
+- Python security relock: all integration uv.lock files (lock files only, no Python floor changes) ([#24039](https://github.com/run-llama/llama_index/pull/24039))
+- BREAKING: raise requires-python for security fixes across integrations (stacked on #24039) ([#24040](https://github.com/run-llama/llama_index/pull/24040))
+
+### llama-index-core [0.14.26]
+
+- Fix langchain-community deprecation breaking langchain bridge imports ([#22570](https://github.com/run-llama/llama_index/pull/22570))
+- Python security relock: all integration uv.lock files (lock files only, no Python floor changes) ([#24039](https://github.com/run-llama/llama_index/pull/24039))
+- BREAKING: raise requires-python for security fixes across integrations (stacked on #24039) ([#24040](https://github.com/run-llama/llama_index/pull/24040))
+
+### llama-index-embeddings-adapter [0.6.0]
+
+- Python security relock: all integration uv.lock files (lock files only, no Python floor changes) ([#24039](https://github.com/run-llama/llama_index/pull/24039))
+- BREAKING: raise requires-python for security fixes across integrations (stacked on #24039) ([#24040](https://github.com/run-llama/llama_index/pull/24040))
+
+### llama-index-embeddings-alephalpha [0.6.0]
+
+- Python security relock: all integration uv.lock files (lock files only, no Python floor changes) ([#24039](https://github.com/run-llama/llama_index/pull/24039))
+- BREAKING: raise requires-python for security fixes across integrations (stacked on #24039) ([#24040](https://github.com/run-llama/llama_index/pull/24040))
+
+### llama-index-embeddings-alibabacloud-aisearch [0.5.0]
+
+- Python security relock: all integration uv.lock files (lock files only, no Python floor changes) ([#24039](https://github.com/run-llama/llama_index/pull/24039))
+- BREAKING: raise requires-python for security fixes across integrations (stacked on #24039) ([#24040](https://github.com/run-llama/llama_index/pull/24040))
+
+### llama-index-embeddings-anyscale [0.6.1]
+
+- Python security relock: all integration uv.lock files (lock files only, no Python floor changes) ([#24039](https://github.com/run-llama/llama_index/pull/24039))
+- BREAKING: raise requires-python for security fixes across integrations (stacked on #24039) ([#24040](https://github.com/run-llama/llama_index/pull/24040))
+- deps: allow llama-index-llms-openai 0.8.x in the 15 integration packages still pinning <0.8 ([#24125](https://github.com/run-llama/llama_index/pull/24125))
+
+### llama-index-embeddings-autoembeddings [0.4.0]
+
+- Python security relock: all integration uv.lock files (lock files only, no Python floor changes) ([#24039](https://github.com/run-llama/llama_index/pull/24039))
+- BREAKING: raise requires-python for security fixes across integrations (stacked on #24039) ([#24040](https://github.com/run-llama/llama_index/pull/24040))
+
+### llama-index-embeddings-azure-inference [0.6.0]
+
+- Python security relock: all integration uv.lock files (lock files only, no Python floor changes) ([#24039](https://github.com/run-llama/llama_index/pull/24039))
+- BREAKING: raise requires-python for security fixes across integrations (stacked on #24039) ([#24040](https://github.com/run-llama/llama_index/pull/24040))
+
+### llama-index-embeddings-azure-openai [0.6.1]
+
+- Python security relock: all integration uv.lock files (lock files only, no Python floor changes) ([#24039](https://github.com/run-llama/llama_index/pull/24039))
+- BREAKING: raise requires-python for security fixes across integrations (stacked on #24039) ([#24040](https://github.com/run-llama/llama_index/pull/24040))
+
+### llama-index-embeddings-baseten [0.3.0]
+
+- Python security relock: all integration uv.lock files (lock files only, no Python floor changes) ([#24039](https://github.com/run-llama/llama_index/pull/24039))
+- BREAKING: raise requires-python for security fixes across integrations (stacked on #24039) ([#24040](https://github.com/run-llama/llama_index/pull/24040))
+
+### llama-index-embeddings-bedrock [0.9.0]
+
+- Python security relock: all integration uv.lock files (lock files only, no Python floor changes) ([#24039](https://github.com/run-llama/llama_index/pull/24039))
... [DIFF_PREVIEW_TRUNCATED]
```

</details>
