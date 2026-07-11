# openai/openai-agents-python · examples/mcp/streamablehttp_example/README.md

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [openai/openai-agents-python](https://github.com/openai/openai-agents-python) |
| 来源文件 | [examples/mcp/streamablehttp_example/README.md](https://github.com/openai/openai-agents-python/blob/83cae670b626edd8fe42d2f4890abcd85c148f86/examples/mcp/streamablehttp_example/README.md) |
| 来源版本 | `83cae670b626edd8fe42d2f4890abcd85c148f86` |
| 摄取时间 | `2026-07-11T06:08:49.376051+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_openai_openai_agents_python_examples_mcp_streamablehttp_example_readme_md_83cae670b626` |

## 本次变化

- 新增行数 `13`.
- 删除行数 `0`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- MCP Streamable HTTP Example
- Details

<details>
<summary>展开完整外部原文</summary>

# MCP Streamable HTTP Example

This example uses a local Streamable HTTP server in [server.py](server.py).

Run the example via:

```
uv run python examples/mcp/streamablehttp_example/main.py
```

## Details

The example uses the `MCPServerStreamableHttp` class from `agents.mcp`. The script picks an open localhost port automatically (or honors `STREAMABLE_HTTP_PORT` if you set it) and starts the server at `http://<host>:<port>/mcp`. Set `STREAMABLE_HTTP_HOST` if you need a different bind address.

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ 83cae670b626edd8fe42d2f4890abcd85c148f86

@@ -0,0 +1,13 @@

+# MCP Streamable HTTP Example
+
+This example uses a local Streamable HTTP server in [server.py](server.py).
+
+Run the example via:
+
+```
+uv run python examples/mcp/streamablehttp_example/main.py
+```
+
+## Details
+
+The example uses the `MCPServerStreamableHttp` class from `agents.mcp`. The script picks an open localhost port automatically (or honors `STREAMABLE_HTTP_PORT` if you set it) and starts the server at `http://<host>:<port>/mcp`. Set `STREAMABLE_HTTP_HOST` if you need a different bind address.
```

</details>
