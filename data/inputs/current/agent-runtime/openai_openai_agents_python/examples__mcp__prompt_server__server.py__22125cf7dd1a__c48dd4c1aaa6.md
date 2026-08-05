# openai/openai-agents-python · examples/mcp/prompt_server/server.py

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [openai/openai-agents-python](https://github.com/openai/openai-agents-python) |
| 来源文件 | [examples/mcp/prompt_server/server.py](https://github.com/openai/openai-agents-python/blob/c48dd4c1aaa6fddf8afd3a99e6cbdc465148b9d4/examples/mcp/prompt_server/server.py) |
| 来源版本 | `c48dd4c1aaa6fddf8afd3a99e6cbdc465148b9d4` |
| 来源目录 Tree | `3965270782e8eb4dc19f233b78707ecede3fb728` |
| 来源内容 Blob | `22125cf7dd1a2ba9b40fa5758ec5a0056776b91d` |
| 摄取时间 | `2026-08-05T22:47:19.928508+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_openai_openai_agents_python_examples_mcp_prompt_server_server_py_7d6629acd72b` |

## 本次变化

- 新增行数 `7`.
- 删除行数 `3`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- Create server
- Instruction-generating prompts (user-controlled)

<details>
<summary>展开完整外部原文</summary>

import os

from mcp.server.mcpserver import MCPServer

STREAMABLE_HTTP_HOST = os.getenv("STREAMABLE_HTTP_HOST", "127.0.0.1")
STREAMABLE_HTTP_PORT = int(os.getenv("STREAMABLE_HTTP_PORT", "18080"))

# Create server
mcp = MCPServer("Prompt Server")


# Instruction-generating prompts (user-controlled)
@mcp.prompt()
def generate_code_review_instructions(
    focus: str = "general code quality", language: str = "python"
) -> str:
    """Generate agent instructions for code review tasks"""
    print(f"[debug-server] generate_code_review_instructions({focus}, {language})")

    return f"""You are a senior {language} code review specialist. Your role is to provide comprehensive code analysis with focus on {focus}.

INSTRUCTIONS:
- Analyze code for quality, security, performance, and best practices
- Provide specific, actionable feedback with examples
- Identify potential bugs, vulnerabilities, and optimization opportunities
- Suggest improvements with code examples when applicable
- Be constructive and educational in your feedback
- Focus particularly on {focus} aspects

RESPONSE FORMAT:
1. Overall Assessment
2. Specific Issues Found
3. Security Considerations
4. Performance Notes
5. Recommended Improvements
6. Best Practices Suggestions

Use the available tools to check current time if you need timestamps for your analysis."""


if __name__ == "__main__":
    mcp.run(
        transport="streamable-http",
        host=STREAMABLE_HTTP_HOST,
        port=STREAMABLE_HTTP_PORT,
    )

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ 22125cf7dd1a2ba9b40fa5758ec5a0056776b91d

@@ -1,12 +1,12 @@

 import os
 
-from mcp.server.fastmcp import FastMCP
+from mcp.server.mcpserver import MCPServer
 
 STREAMABLE_HTTP_HOST = os.getenv("STREAMABLE_HTTP_HOST", "127.0.0.1")
 STREAMABLE_HTTP_PORT = int(os.getenv("STREAMABLE_HTTP_PORT", "18080"))
 
 # Create server
-mcp = FastMCP("Prompt Server", host=STREAMABLE_HTTP_HOST, port=STREAMABLE_HTTP_PORT)
+mcp = MCPServer("Prompt Server")
 
 
 # Instruction-generating prompts (user-controlled)
@@ -39,4 +39,8 @@

 
 
 if __name__ == "__main__":
-    mcp.run(transport="streamable-http")
+    mcp.run(
+        transport="streamable-http",
+        host=STREAMABLE_HTTP_HOST,
+        port=STREAMABLE_HTTP_PORT,
+    )
```

</details>
