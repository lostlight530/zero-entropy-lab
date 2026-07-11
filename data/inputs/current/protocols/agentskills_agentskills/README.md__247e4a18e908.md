# agentskills/agentskills · README.md

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [agentskills/agentskills](https://github.com/agentskills/agentskills) |
| 来源文件 | [README.md](https://github.com/agentskills/agentskills/blob/247e4a18e908d3bf27092f886f25c2515d84ecbc/README.md) |
| 来源版本 | `247e4a18e908d3bf27092f886f25c2515d84ecbc` |
| 摄取时间 | `2026-07-11T06:08:37.405984+00:00` |
| 归属层 | `protocols` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_agentskills_agentskills_readme_md_247e4a18e908` |

## 本次变化

- 新增行数 `59`.
- 删除行数 `0`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- Agent Skills
- What are Agent Skills?
- Why Agent Skills?
- How do Agent Skills work?
- Where can I use Agent Skills?
- Getting started
- Open development
- License

<details>
<summary>展开完整外部原文</summary>

# Agent Skills

[![Discord](https://img.shields.io/badge/Discord-Join-5865F2?logo=discord&logoColor=white)](https://discord.gg/MKPE9g8aUy)

A standardized way to give AI agents new capabilities and expertise.

## What are Agent Skills?

Agent Skills are a lightweight, open format for extending AI agent capabilities with specialized knowledge and workflows.

At its core, a skill is a folder containing a `SKILL.md` file. This file includes metadata (`name` and `description`, at minimum) and instructions that tell an agent how to perform a specific task. Skills can also bundle scripts, reference materials, templates, and other resources.

```
my-skill/
├── SKILL.md          # Required: metadata + instructions
├── scripts/          # Optional: executable code
├── references/       # Optional: documentation
├── assets/           # Optional: templates, resources
└── ...               # Any additional files or directories
```

## Why Agent Skills?

Agents are increasingly capable, but often don't have the context they need to do real work reliably. Skills solve this by packaging procedural knowledge and company-, team-, and user-specific context into portable, version-controlled folders that agents load on demand. This gives agents:

- **Domain expertise**: Capture specialized knowledge — from legal review processes to data analysis pipelines to presentation formatting — as reusable instructions and resources.
- **Repeatable workflows**: Turn multi-step tasks into consistent, auditable procedures.
- **Cross-product reuse**: Build a skill once and use it across any skills-compatible agent.

## How do Agent Skills work?

Agents load skills through **progressive disclosure**, in three stages:

1. **Discovery**: At startup, agents load only the name and description of each available skill, just enough to know when it might be relevant.

2. **Activation**: When a task matches a skill's description, the agent reads the full `SKILL.md` instructions into context.

3. **Execution**: The agent follows the instructions, optionally executing bundled code or loading referenced files as needed.

Full instructions load only when a task calls for them, so agents can keep many skills on hand with only a small context footprint.

## Where can I use Agent Skills?

Agent Skills are supported by a large number of AI tools and agentic clients — see the [Client Showcase](https://agentskills.io/clients) to explore some of them!

## Getting started

- **[Documentation](https://agentskills.io)** — Guides and tutorials
- **[Specification](https://agentskills.io/specification)** — Format details
- **[Example Skills](https://github.com/anthropics/skills)** — See what's possible
- **[Discord](https://discord.gg/MKPE9g8aUy)** — Share what you're building!

## Open development

The Agent Skills format was originally developed by [Anthropic](https://www.anthropic.com/), released as an open standard, and has been adopted by a growing number of agent products. The standard is open to contributions from the broader ecosystem — see [`CONTRIBUTING.md`](CONTRIBUTING.md) for how to get involved.

## License

Code in this repository is licensed under [Apache 2.0](LICENSE). Documentation is licensed under [CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/). See individual directories for details.

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ 247e4a18e908d3bf27092f886f25c2515d84ecbc

@@ -0,0 +1,59 @@

+# Agent Skills
+
+[![Discord](https://img.shields.io/badge/Discord-Join-5865F2?logo=discord&logoColor=white)](https://discord.gg/MKPE9g8aUy)
+
+A standardized way to give AI agents new capabilities and expertise.
+
+## What are Agent Skills?
+
+Agent Skills are a lightweight, open format for extending AI agent capabilities with specialized knowledge and workflows.
+
+At its core, a skill is a folder containing a `SKILL.md` file. This file includes metadata (`name` and `description`, at minimum) and instructions that tell an agent how to perform a specific task. Skills can also bundle scripts, reference materials, templates, and other resources.
+
+```
+my-skill/
+├── SKILL.md          # Required: metadata + instructions
+├── scripts/          # Optional: executable code
+├── references/       # Optional: documentation
+├── assets/           # Optional: templates, resources
+└── ...               # Any additional files or directories
+```
+
+## Why Agent Skills?
+
+Agents are increasingly capable, but often don't have the context they need to do real work reliably. Skills solve this by packaging procedural knowledge and company-, team-, and user-specific context into portable, version-controlled folders that agents load on demand. This gives agents:
+
+- **Domain expertise**: Capture specialized knowledge — from legal review processes to data analysis pipelines to presentation formatting — as reusable instructions and resources.
+- **Repeatable workflows**: Turn multi-step tasks into consistent, auditable procedures.
+- **Cross-product reuse**: Build a skill once and use it across any skills-compatible agent.
+
+## How do Agent Skills work?
+
+Agents load skills through **progressive disclosure**, in three stages:
+
+1. **Discovery**: At startup, agents load only the name and description of each available skill, just enough to know when it might be relevant.
+
+2. **Activation**: When a task matches a skill's description, the agent reads the full `SKILL.md` instructions into context.
+
+3. **Execution**: The agent follows the instructions, optionally executing bundled code or loading referenced files as needed.
+
+Full instructions load only when a task calls for them, so agents can keep many skills on hand with only a small context footprint.
+
+## Where can I use Agent Skills?
+
+Agent Skills are supported by a large number of AI tools and agentic clients — see the [Client Showcase](https://agentskills.io/clients) to explore some of them!
+
+## Getting started
+
+- **[Documentation](https://agentskills.io)** — Guides and tutorials
+- **[Specification](https://agentskills.io/specification)** — Format details
+- **[Example Skills](https://github.com/anthropics/skills)** — See what's possible
+- **[Discord](https://discord.gg/MKPE9g8aUy)** — Share what you're building!
+
+## Open development
+
+The Agent Skills format was originally developed by [Anthropic](https://www.anthropic.com/), released as an open standard, and has been adopted by a growing number of agent products. The standard is open to contributions from the broader ecosystem — see [`CONTRIBUTING.md`](CONTRIBUTING.md) for how to get involved.
+
+## License
+
+Code in this repository is licensed under [Apache 2.0](LICENSE). Documentation is licensed under [CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/). See individual directories for details.
```

</details>
