PROVENANCE: {"confidence": 1.0, "entity_id": "doc_openai_openai_agents_python_examples_mcp_prompt_server_server_py_7d6629acd72b", "primary_owner": "zero", "retrieved_at": "2026-07-11T06:08:47.896522+00:00", "source_path": "examples/mcp/prompt_server/server.py", "source_repo": "openai/openai-agents-python", "source_sha": "7d6629acd72b820eb07b69c3c39f52e325f6d025"}

# Source Document

import os

from mcp.server.fastmcp import FastMCP

STREAMABLE_HTTP_HOST = os.getenv("STREAMABLE_HTTP_HOST", "127.0.0.1")
STREAMABLE_HTTP_PORT = int(os.getenv("STREAMABLE_HTTP_PORT", "18080"))

# Create server
mcp = FastMCP("Prompt Server", host=STREAMABLE_HTTP_HOST, port=STREAMABLE_HTTP_PORT)


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
    mcp.run(transport="streamable-http")


# Document Diff

```diff
--- previous

+++ 7d6629acd72b820eb07b69c3c39f52e325f6d025

@@ -0,0 +1,42 @@

+import os
+
+from mcp.server.fastmcp import FastMCP
+
+STREAMABLE_HTTP_HOST = os.getenv("STREAMABLE_HTTP_HOST", "127.0.0.1")
+STREAMABLE_HTTP_PORT = int(os.getenv("STREAMABLE_HTTP_PORT", "18080"))
+
+# Create server
+mcp = FastMCP("Prompt Server", host=STREAMABLE_HTTP_HOST, port=STREAMABLE_HTTP_PORT)
+
+
+# Instruction-generating prompts (user-controlled)
+@mcp.prompt()
+def generate_code_review_instructions(
+    focus: str = "general code quality", language: str = "python"
+) -> str:
+    """Generate agent instructions for code review tasks"""
+    print(f"[debug-server] generate_code_review_instructions({focus}, {language})")
+
+    return f"""You are a senior {language} code review specialist. Your role is to provide comprehensive code analysis with focus on {focus}.
+
+INSTRUCTIONS:
+- Analyze code for quality, security, performance, and best practices
+- Provide specific, actionable feedback with examples
+- Identify potential bugs, vulnerabilities, and optimization opportunities
+- Suggest improvements with code examples when applicable
+- Be constructive and educational in your feedback
+- Focus particularly on {focus} aspects
+
+RESPONSE FORMAT:
+1. Overall Assessment
+2. Specific Issues Found
+3. Security Considerations
+4. Performance Notes
+5. Recommended Improvements
+6. Best Practices Suggestions
+
+Use the available tools to check current time if you need timestamps for your analysis."""
+
+
+if __name__ == "__main__":
+    mcp.run(transport="streamable-http")
```
