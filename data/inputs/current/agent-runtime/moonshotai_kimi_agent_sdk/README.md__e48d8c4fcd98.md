# MoonshotAI/kimi-agent-sdk · README.md

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [MoonshotAI/kimi-agent-sdk](https://github.com/MoonshotAI/kimi-agent-sdk) |
| 来源文件 | [README.md](https://github.com/MoonshotAI/kimi-agent-sdk/blob/e48d8c4fcd987e9f2550fb2bb0acbecd307ec9c7/README.md) |
| 来源版本 | `e48d8c4fcd987e9f2550fb2bb0acbecd307ec9c7` |
| 摄取时间 | `2026-07-11T06:09:06.755517+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_moonshotai_kimi_agent_sdk_readme_md_e48d8c4fcd98` |

## 本次变化

- 新增行数 `58`.
- 删除行数 `0`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- Kimi Agent SDK
- Overview
- Available SDKs
- Quick Start
- Installation
- Go
- Node.js
- Python
- Examples

<details>
<summary>展开完整外部原文</summary>

# Kimi Agent SDK

[![Go SDK Version](https://img.shields.io/github/v/tag/MoonshotAI/kimi-agent-sdk?label=go%20sdk&sort=semver&filter=go-v*)](https://pkg.go.dev/github.com/MoonshotAI/kimi-agent-sdk/go)
[![Node SDK Version](https://img.shields.io/npm/v/%40moonshot-ai%2Fkimi-agent-sdk?label=node%20sdk)](https://www.npmjs.com/package/@moonshot-ai/kimi-agent-sdk)
[![Python SDK Version](https://img.shields.io/pypi/v/kimi-agent-sdk?label=python%20sdk)](https://pypi.org/project/kimi-agent-sdk/)  

[![License](https://img.shields.io/github/license/MoonshotAI/kimi-agent-sdk)](./LICENSE)

Kimi Agent SDK is a set of multi-language libraries that expose the [Kimi Code (Kimi CLI)](https://github.com/MoonshotAI/kimi-cli) agent runtime in your applications. Use it to build products, automations, and custom tooling while keeping the CLI as the execution engine.

The SDKs are thin, language-native clients that reuse the same Kimi CLI configuration, tools, skills, and MCP servers. They stream responses in real time, surface approvals and tool calls, and let you orchestrate sessions programmatically.

## Overview

Kimi Agent SDK provides a programmatic interface to interact with the Kimi CLI, enabling you to:

- **Build custom applications** - Integrate Kimi Agent into your own tools and workflows
- **Automate tasks** - Script complex multi-turn conversations
- **Extend capabilities** - Register custom tools that the model can call
- **Handle approvals** - Programmatically respond to permission requests

## Available SDKs

| Language | Package | Status |
|----------|---------|--------|
| Go | [go/](./go) | Available |
| Node.js | [node/agent_sdk/](./node/agent_sdk/) | Available |
| Python | [python/](./python/) | Available |

## Quick Start

### Installation

```bash
# Go
go get github.com/MoonshotAI/kimi-agent-sdk/go
```

Go quick start: [guides/go/quickstart.md](./guides/go/quickstart.md)

```bash
# Node.js
npm install @moonshot-ai/kimi-agent-sdk
```

Node.js quick start: [node/agent_sdk/README.md#quick-start](./node/agent_sdk/README.md#quick-start)

```bash
# Python
pip install kimi-agent-sdk
```

Python quick start: [guides/python/quickstart.md](./guides/python/quickstart.md)

## Examples

- Go: [examples/go/ralph-loop](./examples/go/ralph-loop), [examples/go/rumor-buster](./examples/go/rumor-buster)
- Python: [examples/python/customized-tools](./examples/python/customized-tools), [examples/python/kaos](./examples/python/kaos) (KAOS sandbox backends: run the same agent tools in BoxLite, E2B, or Sprites)

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ e48d8c4fcd987e9f2550fb2bb0acbecd307ec9c7

@@ -0,0 +1,58 @@

+# Kimi Agent SDK
+
+[![Go SDK Version](https://img.shields.io/github/v/tag/MoonshotAI/kimi-agent-sdk?label=go%20sdk&sort=semver&filter=go-v*)](https://pkg.go.dev/github.com/MoonshotAI/kimi-agent-sdk/go)
+[![Node SDK Version](https://img.shields.io/npm/v/%40moonshot-ai%2Fkimi-agent-sdk?label=node%20sdk)](https://www.npmjs.com/package/@moonshot-ai/kimi-agent-sdk)
+[![Python SDK Version](https://img.shields.io/pypi/v/kimi-agent-sdk?label=python%20sdk)](https://pypi.org/project/kimi-agent-sdk/)  
+
+[![License](https://img.shields.io/github/license/MoonshotAI/kimi-agent-sdk)](./LICENSE)
+
+Kimi Agent SDK is a set of multi-language libraries that expose the [Kimi Code (Kimi CLI)](https://github.com/MoonshotAI/kimi-cli) agent runtime in your applications. Use it to build products, automations, and custom tooling while keeping the CLI as the execution engine.
+
+The SDKs are thin, language-native clients that reuse the same Kimi CLI configuration, tools, skills, and MCP servers. They stream responses in real time, surface approvals and tool calls, and let you orchestrate sessions programmatically.
+
+## Overview
+
+Kimi Agent SDK provides a programmatic interface to interact with the Kimi CLI, enabling you to:
+
+- **Build custom applications** - Integrate Kimi Agent into your own tools and workflows
+- **Automate tasks** - Script complex multi-turn conversations
+- **Extend capabilities** - Register custom tools that the model can call
+- **Handle approvals** - Programmatically respond to permission requests
+
+## Available SDKs
+
+| Language | Package | Status |
+|----------|---------|--------|
+| Go | [go/](./go) | Available |
+| Node.js | [node/agent_sdk/](./node/agent_sdk/) | Available |
+| Python | [python/](./python/) | Available |
+
+## Quick Start
+
+### Installation
+
+```bash
+# Go
+go get github.com/MoonshotAI/kimi-agent-sdk/go
+```
+
+Go quick start: [guides/go/quickstart.md](./guides/go/quickstart.md)
+
+```bash
+# Node.js
+npm install @moonshot-ai/kimi-agent-sdk
+```
+
+Node.js quick start: [node/agent_sdk/README.md#quick-start](./node/agent_sdk/README.md#quick-start)
+
+```bash
+# Python
+pip install kimi-agent-sdk
+```
+
+Python quick start: [guides/python/quickstart.md](./guides/python/quickstart.md)
+
+## Examples
+
+- Go: [examples/go/ralph-loop](./examples/go/ralph-loop), [examples/go/rumor-buster](./examples/go/rumor-buster)
+- Python: [examples/python/customized-tools](./examples/python/customized-tools), [examples/python/kaos](./examples/python/kaos) (KAOS sandbox backends: run the same agent tools in BoxLite, E2B, or Sprites)
```

</details>
