# openai/openai-agents-python · examples/mcp/streamablehttp_custom_client_example/README.md

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [openai/openai-agents-python](https://github.com/openai/openai-agents-python) |
| 来源文件 | [examples/mcp/streamablehttp_custom_client_example/README.md](https://github.com/openai/openai-agents-python/blob/c48dd4c1aaa6fddf8afd3a99e6cbdc465148b9d4/examples/mcp/streamablehttp_custom_client_example/README.md) |
| 来源版本 | `c48dd4c1aaa6fddf8afd3a99e6cbdc465148b9d4` |
| 来源目录 Tree | `3965270782e8eb4dc19f233b78707ecede3fb728` |
| 来源内容 Blob | `33890a45e6691938c74e8a4847eb3c42a3fc4dc7` |
| 摄取时间 | `2026-08-05T22:47:21.152265+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_openai_openai_agents_python_examples_mcp_streamablehttp_custom_client_example_readme_md_fc269a06447c` |

## 本次变化

- 新增行数 `6`.
- 删除行数 `4`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- Custom HTTP Client Factory Example
- Features Demonstrated
- Running the Example
- Code Examples
- Basic Custom Client
- Use Cases
- Benefits

<details>
<summary>展开完整外部原文</summary>

# Custom HTTP Client Factory Example

This repository example targets MCP Python SDK v2 and `httpx2`, and is intended to run with the repository's locked development environment. The Agents SDK client itself supports MCP v1 with `httpx` and MCP v2 with `httpx2`.

This example demonstrates how to use the new `httpx_client_factory` parameter in `MCPServerStreamableHttp` to configure custom HTTP client behavior for MCP StreamableHTTP connections.

## Features Demonstrated

- **Custom SSL Configuration**: Configure SSL certificates and verification settings
- **Custom Headers**: Add custom headers to all HTTP requests
- **Custom Timeouts**: Set custom timeout values for requests
- **Proxy Configuration**: Configure HTTP proxy settings
- **Custom Retry Logic**: Set up custom retry behavior (through httpx configuration)

## Running the Example

1. Make sure you have `uv` installed: https://docs.astral.sh/uv/getting-started/installation/

2. Run the example:
   ```bash
   cd examples/mcp/streamablehttp_custom_client_example
   uv run main.py
   ```

## Code Examples

### Basic Custom Client

```python
import httpx2
from agents.mcp import MCPServerStreamableHttp

def create_custom_http_client() -> httpx2.AsyncClient:
    return httpx2.AsyncClient(
        verify=False,  # Disable SSL verification for testing
        timeout=httpx2.Timeout(60.0, read=120.0),
        headers={"X-Custom-Client": "my-app"},
    )

async with MCPServerStreamableHttp(
    name="Custom Client Server",
    params={
        "url": "http://localhost:<port>/mcp",
        "httpx_client_factory": create_custom_http_client,
    },
) as server:
    # Use the server...
```

## Use Cases

- **Corporate Networks**: Configure proxy settings for corporate environments
- **SSL/TLS Requirements**: Use custom SSL certificates for secure connections
- **Custom Authentication**: Add custom headers for API authentication
- **Network Optimization**: Configure timeouts and connection pooling
- **Debugging**: Disable SSL verification for development environments

## Benefits

- **Flexibility**: Configure HTTP client behavior to match your network requirements
- **Security**: Use custom SSL certificates and authentication methods
- **Performance**: Optimize timeouts and connection settings for your use case
- **Compatibility**: Work with corporate proxies and network restrictions

This example will auto-pick a free localhost port unless you set `STREAMABLE_HTTP_PORT`; use `STREAMABLE_HTTP_HOST` to change the bind address.

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ 33890a45e6691938c74e8a4847eb3c42a3fc4dc7

@@ -1,4 +1,6 @@

 # Custom HTTP Client Factory Example
+
+This repository example targets MCP Python SDK v2 and `httpx2`, and is intended to run with the repository's locked development environment. The Agents SDK client itself supports MCP v1 with `httpx` and MCP v2 with `httpx2`.
 
 This example demonstrates how to use the new `httpx_client_factory` parameter in `MCPServerStreamableHttp` to configure custom HTTP client behavior for MCP StreamableHTTP connections.
 
@@ -25,13 +27,13 @@

 ### Basic Custom Client
 
 ```python
-import httpx
+import httpx2
 from agents.mcp import MCPServerStreamableHttp
 
-def create_custom_http_client() -> httpx.AsyncClient:
-    return httpx.AsyncClient(
+def create_custom_http_client() -> httpx2.AsyncClient:
+    return httpx2.AsyncClient(
         verify=False,  # Disable SSL verification for testing
-        timeout=httpx.Timeout(60.0, read=120.0),
+        timeout=httpx2.Timeout(60.0, read=120.0),
         headers={"X-Custom-Client": "my-app"},
     )
```

</details>
