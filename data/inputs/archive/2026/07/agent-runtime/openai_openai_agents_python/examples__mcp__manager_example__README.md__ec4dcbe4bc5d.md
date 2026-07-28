# openai/openai-agents-python · examples/mcp/manager_example/README.md

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [openai/openai-agents-python](https://github.com/openai/openai-agents-python) |
| 来源文件 | [examples/mcp/manager_example/README.md](https://github.com/openai/openai-agents-python/blob/ec4dcbe4bc5dd4f7435cfa9ea6995b5ae9c63354/examples/mcp/manager_example/README.md) |
| 来源版本 | `ec4dcbe4bc5dd4f7435cfa9ea6995b5ae9c63354` |
| 摄取时间 | `2026-07-11T06:08:47.116759+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_openai_openai_agents_python_examples_mcp_manager_example_readme_md_ec4dcbe4bc5d` |

## 本次变化

- 新增行数 `78`.
- 删除行数 `0`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- MCP Manager Example (FastAPI)
- Run the MCP server (Streamable HTTP)
- Run the FastAPI app
- Run the smoke test
- Toggle MCP manager usage
- Try the endpoints

<details>
<summary>展开完整外部原文</summary>

# MCP Manager Example (FastAPI)

This example shows how to use `MCPServerManager` to keep MCP server lifecycle management in a single task inside a FastAPI app with the Streamable HTTP transport.

## Run the MCP server (Streamable HTTP)

```
uv run python examples/mcp/manager_example/mcp_server.py
```

The server listens at `http://localhost:8000/mcp` by default.

You can override the host/port with:

```
export STREAMABLE_HTTP_HOST=127.0.0.1
export STREAMABLE_HTTP_PORT=8000
```

This example also configures an inactive MCP server at `http://localhost:8001/mcp` to demonstrate how the manager drops failed
servers. You can override it with:

```
export INACTIVE_MCP_SERVER_URL=http://localhost:8001/mcp
```

## Run the FastAPI app

```
uv run python examples/mcp/manager_example/app.py
```

The app listens at `http://127.0.0.1:9001`.

## Run the smoke test

To verify the MCP manager and app integration without calling a model:

```
uv run python -m examples.mcp.manager_example.smoke_test
```

The smoke test starts the local MCP server on a temporary port, points both app MCP server settings at that server, and checks `/health`, `/tools`, and `/add`.

## Toggle MCP manager usage

By default, the app uses `MCPServerManager`. To disable it:

```
export USE_MCP_MANAGER=0
```

## Try the endpoints

```
curl http://127.0.0.1:9001/health
curl http://127.0.0.1:9001/tools
curl -X POST http://127.0.0.1:9001/add \
  -H 'Content-Type: application/json' \
  -d '{"a": 2, "b": 3}'
```

Reconnect failed MCP servers (manager must be enabled):

```
curl -X POST http://127.0.0.1:9001/reconnect \
  -H 'Content-Type: application/json' \
  -d '{"failed_only": true}'
```

To use `/run`, set `OPENAI_API_KEY`:

```
export OPENAI_API_KEY=...
curl -X POST http://127.0.0.1:9001/run \
  -H 'Content-Type: application/json' \
  -d '{"input": "Add 4 and 9."}'
```

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ ec4dcbe4bc5dd4f7435cfa9ea6995b5ae9c63354

@@ -0,0 +1,78 @@

+# MCP Manager Example (FastAPI)
+
+This example shows how to use `MCPServerManager` to keep MCP server lifecycle management in a single task inside a FastAPI app with the Streamable HTTP transport.
+
+## Run the MCP server (Streamable HTTP)
+
+```
+uv run python examples/mcp/manager_example/mcp_server.py
+```
+
+The server listens at `http://localhost:8000/mcp` by default.
+
+You can override the host/port with:
+
+```
+export STREAMABLE_HTTP_HOST=127.0.0.1
+export STREAMABLE_HTTP_PORT=8000
+```
+
+This example also configures an inactive MCP server at `http://localhost:8001/mcp` to demonstrate how the manager drops failed
+servers. You can override it with:
+
+```
+export INACTIVE_MCP_SERVER_URL=http://localhost:8001/mcp
+```
+
+## Run the FastAPI app
+
+```
+uv run python examples/mcp/manager_example/app.py
+```
+
+The app listens at `http://127.0.0.1:9001`.
+
+## Run the smoke test
+
+To verify the MCP manager and app integration without calling a model:
+
+```
+uv run python -m examples.mcp.manager_example.smoke_test
+```
+
+The smoke test starts the local MCP server on a temporary port, points both app MCP server settings at that server, and checks `/health`, `/tools`, and `/add`.
+
+## Toggle MCP manager usage
+
+By default, the app uses `MCPServerManager`. To disable it:
+
+```
+export USE_MCP_MANAGER=0
+```
+
+## Try the endpoints
+
+```
+curl http://127.0.0.1:9001/health
+curl http://127.0.0.1:9001/tools
+curl -X POST http://127.0.0.1:9001/add \
+  -H 'Content-Type: application/json' \
+  -d '{"a": 2, "b": 3}'
+```
+
+Reconnect failed MCP servers (manager must be enabled):
+
+```
+curl -X POST http://127.0.0.1:9001/reconnect \
+  -H 'Content-Type: application/json' \
+  -d '{"failed_only": true}'
+```
+
+To use `/run`, set `OPENAI_API_KEY`:
+
+```
+export OPENAI_API_KEY=...
+curl -X POST http://127.0.0.1:9001/run \
+  -H 'Content-Type: application/json' \
+  -d '{"input": "Add 4 and 9."}'
+```
```

</details>
