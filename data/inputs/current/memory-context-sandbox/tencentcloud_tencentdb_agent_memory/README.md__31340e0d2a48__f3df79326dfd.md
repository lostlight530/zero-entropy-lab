# TencentCloud/TencentDB-Agent-Memory · README.md

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [TencentCloud/TencentDB-Agent-Memory](https://github.com/TencentCloud/TencentDB-Agent-Memory) |
| 来源文件 | [README.md](https://github.com/TencentCloud/TencentDB-Agent-Memory/blob/f3df79326dfd763f45199c441e2129d780467949/README.md) |
| 来源版本 | `f3df79326dfd763f45199c441e2129d780467949` |
| 来源目录 Tree | `e5ae87d606b5dc08f469cdd779c2f9bff007facb` |
| 来源内容 Blob | `31340e0d2a48afaccf8d2dc5b512d15f5b623d50` |
| 摄取时间 | `2026-07-31T22:49:39.431013+00:00` |
| 归属层 | `memory-context-sandbox` |
| 可信度 | `1.0` |
| 记忆实体 | `external_doc_tencentcloud_tencentdb_agent_memory_readme_md` |

## 本次变化

- 新增行数 `286`.
- 删除行数 `526`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- Agents remember. Humans innovate.
- Installation
- Migrating data from an older version
- What is TencentDB Agent Memory?
- Let experience accumulate, flow, and pass on to the next Agent
- 🧠 A brain that remembers people and context
- ⚡ A Skill library that accumulates expertise
- 📖 A knowledge map that reads both docs and code
- 🛡️ A team memory panel controlled by humans
- Cold Start: Load the Save File, Then Get to Work
- One Play Style: Build a Growing Agent Team for a One-Person Company
- Recruit first, then equip
- Memory Assets, Not a Chat Log Warehouse
- Memory Hub Is Not a Display Board — It's a Control Panel
- Every Loop Gains Experience
- One Agent Team: Shared Experience, Not Shared Privacy
- Technical Implementation
- 1. Memory isn't flat records — it grows in layers
- 2. Memory isn't a global prompt — it's the Agent's loadout
- 3. Knowledge isn't injected wholesale — it's called on demand
- Benchmark
- Notes
- Related Documentation
- Acknowledgements

<details>
<summary>展开完整外部原文</summary>


<div align="center">

<img src="./assets/images/logo.png" alt="TencentDB Agent Memory" width="880" />

### Agents remember. Humans innovate.

<a href="https://trendshift.io/repositories/29310?utm_source=repository-badge&amp;utm_medium=badge&amp;utm_campaign=badge-repository-29310" target="_blank" rel="noopener noreferrer"><img src="https://trendshift.io/api/badge/repositories/29310" alt="TencentCloud%2FTencentDB-Agent-Memory | Trendshift" width="250" height="55"/></a>

[![npm](https://img.shields.io/npm/v/@tencentdb-agent-memory/memory-tencentdb?color=blue)](https://www.npmjs.com/package/@tencentdb-agent-memory/memory-tencentdb)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![Node](https://img.shields.io/badge/node-%3E=22.16-brightgreen)](https://nodejs.org/)
[![OpenClaw](https://img.shields.io/badge/OpenClaw-%3E=2026.3.13-orange)](https://github.com/openclaw/openclaw)
[![Hermes](https://img.shields.io/badge/Hermes-Gateway-7B61FF)](https://hermes-agent.nousresearch.com/docs/)
[![Discord](https://img.shields.io/badge/Discord-Join-5865F2?logo=discord&logoColor=white)](https://discord.gg/dJQM6mKMF)

[Installation](#installation) · [What is it?](#what-is-tencentdb-agent-memory) · [Team Play](#one-play-style-build-a-growing-agent-team-for-a-one-person-company) · [Technical Implementation](#technical-implementation) · [Benchmark](#benchmark)

[**English**](./README.md) · [简体中文](./README_CN.md)

</div>

---

> **Latest:** Team Memory Beta is evolving quickly — install it and start exploring in minutes.

<td>
   <video src="https://github.com/user-attachments/assets/efb1a808-1f86-4cfe-802c-f7453f7ca938" width="100%" controls autoplay loop muted playsinline></video>
</td>

# Installation

Start all three services in one go (`memory-core` + `memory-hub` + `proxy`):

```bash
git clone https://github.com/Tencent/TencentDB-Agent-Memory.git
cd TencentDB-Agent-Memory/deploy/global-images
cp .env.example .env
$EDITOR .env       # Fill in two sets of LLM parameters (memory group + proxy group)
./start-all.sh     # Launch everything with one command; when finished, it prints a one-liner you can paste directly into Claude
```

Open the panel: [http://localhost:8125](http://localhost:8125).

Complete installation documentation (standalone Memory Hub deployment, Proxy + Claude Code usage, stop and cleanup, port reference, etc.) is available in [**INSTALL.md**](./INSTALL.md) (中文: [INSTALL_CN.md](./INSTALL_CN.md)).

### Migrating data from an older version

If you're already on an older release (v1.x / v0.x) and want to bring your existing data over to v2.0.0+, we provide a migration tool:

See [**Data Migration Tool (v2 → v3)**](./MemoryCore/scripts/migrate-v2-to-v3/README.md) for full usage and flags. New installations can skip this.

# What is TencentDB Agent Memory?

We started from a practical question: **How do you reduce repetitive work when using Agents?**

If project context has already been explained, it shouldn't need to be repeated in a new session. If documents have already been read, every Agent shouldn't have to start again from page one. A workflow that already works shouldn't have to be rediscovered next time.

Memory here means more than just "remembering conversations." **Any information that helps the next Agent avoid reinventing the wheel should be saved, organized, and reused.**

```text
Existing information → Reusable memory assets → Fewer turns → Less rework → More stable results and higher efficiency
```

### Let experience accumulate, flow, and pass on to the next Agent

**Memory Hub** for Agent teams closes the loop across the entire experience lifecycle: work produces assets, assets circulate through the team, and new members can load the team's save file on day one.

1. **Automatic asset extraction**: Extract Chat Memory and Skills from conversations and tasks; convert documents and code into Wiki and CodeGraph; then manage, review, and route them consistently.
2. **Portable & multi-Agent compatible**: Memory assets are decoupled from Agent frameworks — they can move across frameworks and be shared and maintained by multiple Agents and team members.
3. **Cold-start friendly**: Import existing documents, codebases, and Agent conversation sessions. New Agent teams can start from existing experience instead of learning from scratch.

### 🧠 A brain that remembers people and context

- **Chat Memory** retains preferences, facts, decisions, and interaction history.
- Each Agent automatically gets its own memory when created — no need to re-introduce yourself next time.
- L0 Conversation → L1 Atom → L2 Scenario → L3 Persona — raw conversations are distilled layer by layer.

<img width="" src="assets/images/chat_memory.cn.png" alt="image.png" />

> "Don't refactor the old auth module — mobile is still using it." — Context this costly shouldn't depend on humans repeating it every time.

### ⚡ A Skill library that accumulates expertise

- After completing complex work, Agents can extract and manage reusable Skills from conversations and tool calls, and import them into the context of a designated Agent when needed.
- A Skill isn't just a prompt snippet; it has versions, resource files, trigger boundaries, execution steps, and validation rules.
- Personal Skills are private by default; after review, they can be shared with the team and assigned to other Agents.

<img width="" src="assets/images/skill.cn.png" alt="image.png" />

> Troubleshooting, code review, release checklists — learn it once, and the whole team can use it.

### 📖 A knowledge map that reads both docs and code

- **Wiki** turns product docs, design specs, and ops runbooks into structured pages with a link graph. (Inspired by Karpathy's LLM knowledge base.)

<img src="./assets/images/wiki.cn.png" alt="image.png" />

- **CodeGraph** indexes code symbols, files, call relationships, and impact paths.
<img width="" src="assets/images/codegraph.cn.png" alt="image.png" />

- Agents can search, read, inspect callers/callees, and perform impact analysis before modifying code.

> Wiki keeps Agents from reading every file list before getting to work. CodeGraph doesn't just tell them "the code is here" — it tells them "changing this might affect those."

### 🛡️ A team memory panel controlled by humans

- Create teams and Agents in Memory Hub; review, share, and equip memory assets.
- Manage ownership, versions, status, visibility, usage counts, and Agent bindings in one place.
- `private` belongs strictly to the Owner; `team` is visible to all team members; `restricted` grants precise access via User / Role / Agent ACLs.

<img width="" src="assets/images/asset.cn.png" alt="image.png" />


## Cold Start: Load the Save File, Then Get to Work

Most Agents' first task is re-learning your project. TencentDB Agent Memory turns the learning cost you've already paid into a save file:

<img alt="Cold Start: import codebase, docs, and history into Memory Hub" src="assets/images/flowchart3.png" />

Specifically, these existing assets can be imported directly and processed automatically in the panel:

- **Codebases**: Import existing repositories — **CodeGraph** automatically indexes symbols, files, call relationships, and impact paths.
- **Documents & files**: Import relevant docs and files — **Wiki** automatically generates structured pages with a link graph.
- **Conversation sessions**: Import past Agent conversation sessions — **Skills and Chat Memory** are automatically extracted as reusable assets.

> Stop retraining every Agent. Give it the save file.

## One Play Style: Build a Growing Agent Team for a One-Person Company

Open Memory Hub and create a team:

```text
Tiny but Serious Inc.
├── 👤 You · Set goals / Make decisions
├── 🔭 Scout · Research / Find opportunities
├── 🛠 Builder · Write code / Build products
├── 🧪 Reviewer · Test / Find issues
└── 🧠 Agent Memory · Preserve the team's experience
```

You're not opening four disconnected chat windows — you're assembling a squad with different roles that can inherit the team's accumulated experience.

### Recruit first, then equip

```text
🔭 Scout
   ├── User interview Chat Memory
   ├── Market research Wiki
   └── Competitive analysis Skill

🛠 Builder
   ├── Product Wiki
   ├── Project CodeGraph
   └── Feature Delivery Skill

🧪 Reviewer
   ├── Historical incident Chat Memory
   ├── Project CodeGraph
   └── Release Checklist Skill
```

Different roles, different loadouts. Less noise — give each Agent the memory assets it actually needs to get work done.

**The company can be tiny. Experience can compound forever.**

## Memory Assets, Not a Chat Log Warehouse

RAG answers "what can be found?" Team Memory also answers "who can use it, which version is valid, and which Agent should receive it."

| | Chat History | Standard RAG | TencentDB Agent Memory |
| :--- | :---: | :---: | :---: |
| Cross-session user understanding | △ | △ | ✅ Chat Memory |
| Distilled executable experience | — | — | ✅ Skill |
| Document structure & relationships | — | △ Chunk retrieval | ✅ Wiki + Link Graph |
| Code call graphs & impact scope | — | △ Text match | ✅ CodeGraph |
| Ownership / Version / Status | — | — | ✅ |
| Team sharing & Agent loadout | — | — | ✅ |
| Private / Team / ACL | — | △ | ✅ |

## Memory Hub Is Not a Display Board — It's a Control Panel

| Play Style | What you do in the Hub |
| :--- | :--- |
| **Team Up** | Create teams, add people and Agents, define sharing boundaries |
| **Asset Library** | Browse, search, review, and manage Chat Memory, Skills, Wiki, and CodeGraph |
| **Agent Loadout** | Bind different memory assets to different Agents; adjust priority and usage mode |
| **Knowledge Workshop** | Build Wiki and CodeGraph; monitor processing status and asset metadata |
| **Access Control** | Switch between private, team, and ACL-based access; revoke sharing when needed |

When you open an asset, what matters is not just "what it says," but also "where it came from, which version it is, who it's assigned to, and whether it's been used recently."

## Every Loop Gains Experience

<img alt="Every Loop Gains Experience: continuous accumulation, making every use smarter" src="assets/images/flowchart4.png" />

Memory doesn't run the Agent loop; it ensures the next iteration inherits the previous one's results: valuable interactions stay in Chat Memory, proven workflows are distilled into Skills, and document/code changes are updated through Wiki ingest and CodeGraph sync.

**Without Memory, loops may just repeat faster. With inherited memory, each iteration has the chance to be better than the last.**

## One Agent Team: Shared Experience, Not Shared Privacy

New Chat Memory and Skills are private by default. Sharing is an explicit action, not a default leak.

| Visibility | Semantics |
| :--- | :--- |
| `private` | Only the Owner can read — not even team admins |
| `team` | Team members can read; the Owner / Admin can manage |
| `restricted` | Precise access via User / Role / Agent ACL |
| `agent` | For targeted equipping of Agents within the same team |

You can assign the "Release Skill" to the Release Agent, the "Architecture Wiki" to all development Agents, and CodeGraph to Coder and Reviewer.

## Technical Implementation

TencentDB Agent Memory doesn't aim to "store everything." It solves three problems: **what's worth keeping, who can use it, and how to retrieve less while retrieving the right things next time.**

<img alt="Technical overview: layering (L0–L3), Memory Assets, Memory Hub, identity-based assembly for Agents" src="assets/images/flowchart5.png" />

### 1. Memory isn't flat records — it grows in layers

Conversations are first saved as L0, then refined by an async pipeline into multiple levels of granularity:

| Layer | What it stores | Primary use |
| :--- | :--- | :--- |
| **L0 Conversation** | Raw conversations with full context | Verify exact wording, timestamps, and sources |
| **L1 Atom** | Facts, preferences, constraints, and events extracted from conversations | Precise recall of actionable information |
| **L2 Scenario** | Knowledge blocks organized around projects or scenarios | Quickly restore a working context |
| **L3 Core / Persona** | Long-term profiles, stable patterns, and high-level cognition | Let Agents rapidly enter a user's and team's context |

Both generation and retrieval are layered: normally, L2/L3 provide a quick context bootstrap; when specific facts are needed, BM25 + vector retrieval + RRF fall back to L1/L0. Results are further capped by item count, character budget, and timeout limits to prevent memory from overwhelming the context window.

### 2. Memory isn't a global prompt — it's the Agent's loadout

Chat Memory, Skills, Wiki, and CodeGraph are all registered uniformly as Memory Assets. Memory Hub uses **Fixed Binding + ACL** to determine which assets a given Agent can use: first narrow the permission scope by Team, User, Agent, and visibility, then retrieve based on the current query.

This lets teams share experience without exposing all their private information; switching Agents or frameworks only requires re-equipping, not retraining.

### 3. Knowledge isn't injected wholesale — it's called on demand

Documents are organized into searchable Wiki pages that support link-graph drill-down; codebases are indexed into CodeGraph assets containing files, symbols, and call relationships. Agents first discover capabilities via `/v3/tools/list`, then use `/v3/tools/call` to read relevant pages, source code, or impact paths.

This makes documents and code part of memory as well — but they remain available tools that only enter context when truly needed.

## Benchmark

| Benchmark | Without TencentDB Agent Memory | With it enabled | Relative improvement |
| :--- | :---: | :---: | :---: |
| **PersonaMem** | 48% | **76%** | **+59%** |

PersonaMem tests whether an Agent can correctly understand and apply user information after extended interactions.

## Notes

- Wiki and CodeGraph are built asynchronously; allow some processing time before they reach `ready` status.
- CodeGraph currently prioritizes public HTTPS repositories; support for private repositories and SSH credentials is still being refined.
- The Hub supports manual asset binding; fully automated memory routing is still under iteration.
- TencentDB Agent Memory currently supports OpenClaw, Hermes, and SDK integration; broader cross-framework migration is on the roadmap.

## Related Documentation

- [Full Installation Guide](./INSTALL.md) (Memory Core + Hub + Proxy one-click deployment)
- [Data Migration Tool (v2 → v3)](./MemoryCore/scripts/migrate-v2-to-v3/README.md) (if you're on an older release and want to migrate existing data)
- [Knowledge OpenAPI](./MemoryKnowledge/docs/api/openapi.yaml)
- [Contributing Guide](./CONTRIBUTING.md)

Agent Memory doesn't have a settled standard yet. Bug reports, documentation, benchmarks, new framework adapters, and more creative Memory Hub use cases are all welcome.

---
## Acknowledgements

TencentDB Agent Memory stands on the shoulders of the open-source community:

- [**CodeGraph**](https://github.com/colbymchenry/codegraph) — our CodeGraph asset module **uses code from this project**. Its design of a pre-indexed code graph is the foundation of our implementation.
- [**Hermes Agent**](https://github.com/nousresearch/hermes-agent) (Nous Research) — our Skill asset management **uses part of the Skill-related code from Hermes Agent and builds further optimizations base on it**.
- [**"LLM Wiki"** by Andrej Karpathy](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) — the idea of treating documentation as an LLM-maintained, incrementally growing knowledge artifact directly informed how our Wiki layer is built and kept up to date.

We are grateful to the authors and contributors of these projects.

---
## Community & Contributing

We welcome contributions of all kinds — bug reports, feature suggestions, documentation fixes, benchmark reproductions, ecosystem integrations, or pull requests. Agent memory is far from settled, and we hope to build it together with the community.

- 🐞 **Found a bug or have a question?** Open an issue in [GitHub Issues](https://github.com/Tencent/TencentDB-Agent-Memory/issues) — we respond within 24 hours.
- 💡 **Have an idea to share?** Start a thread in [GitHub Discussions](https://github.com/Tencent/TencentDB-Agent-Memory/discussions).
- 🛠️ **Want to contribute code?** Please read [CONTRIBUTING.md](./CONTRIBUTING.md) first.
- 💬 **Want to chat with us?** Join our [Discord community](https://discord.gg/dJQM6mKMF) and talk to the core developers directly.

---

<p align="center">
 Let the path the team has walked become the next Agent's starting line.
</p>

---

## ✨ Contributors

> 💡 Thanks to the following contributors building with us — you make TencentDB Agent Memory better.

<div align="center">
  <a href="https://github.com/TencentCloud/TencentDB-Agent-Memory/graphs/contributors">
    <img src="https://contrib.rocks/image?repo=TencentCloud/TencentDB-Agent-Memory&columns=12&anon=1" />
  </a>

  <br /><br />
<a href="https://github.com/TencentCloud/TencentDB-Agent-Memory/issues">
  <img src="https://img.shields.io/badge/Contributions_Welcome-006eff?style=for-the-badge&logo=github&logoColor=white" alt="Contributions Welcome" />
</a>

</div>


<table width="100%">
  <tr>
    <td width="68%">
      <b>If TencentDB Agent Memory has been helpful to you, please consider starring the project.</b><br />
      If you have any suggestions, feel free to open an issue for discussion.
    </td>
    <td width="32%" align="right">
      <img src="./assets/images/star-helper.png" alt="Star TencentDB Agent Memory" width="260" />
    </td>
  </tr>
</table>


[MIT](./LICENSE) © TencentDB Agent Memory Team

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ 31340e0d2a48afaccf8d2dc5b512d15f5b623d50

@@ -1,8 +1,9 @@

+
 <div align="center">
 
 <img src="./assets/images/logo.png" alt="TencentDB Agent Memory" width="880" />
 
-### Agents remember,Humans innovate.
+### Agents remember. Humans innovate.
 
 <a href="https://trendshift.io/repositories/29310?utm_source=repository-badge&amp;utm_medium=badge&amp;utm_campaign=badge-repository-29310" target="_blank" rel="noopener noreferrer"><img src="https://trendshift.io/api/badge/repositories/29310" alt="TencentCloud%2FTencentDB-Agent-Memory | Trendshift" width="250" height="55"/></a>
 
@@ -13,563 +14,309 @@

 [![Hermes](https://img.shields.io/badge/Hermes-Gateway-7B61FF)](https://hermes-agent.nousresearch.com/docs/)
 [![Discord](https://img.shields.io/badge/Discord-Join-5865F2?logo=discord&logoColor=white)](https://discord.gg/dJQM6mKMF)
 
-[Highlights](#-highlights) · [Overview](#overview) · [Core Technology](#core-technology-reject-flat-storage-embrace-layering-and-symbolization) · [Features](#-features) · [Quick Start](#quick-start)
-
-<div align="center">
+[Installation](#installation) · [What is it?](#what-is-tencentdb-agent-memory) · [Team Play](#one-play-style-build-a-growing-agent-team-for-a-one-person-company) · [Technical Implementation](#technical-implementation) · [Benchmark](#benchmark)
 
 [**English**](./README.md) · [简体中文](./README_CN.md)
 
 </div>
 
-
-</div>
-
----
-
-## ✨ Highlights
-
-> **TencentDB Agent Memory = symbolic short-term memory + layered long-term memory.**
->
-> - **Symbolic short-term memory** offloads heavy tool logs and condenses them into compact Mermaid symbols, cutting token usage and improving task success.
-> - **Layered long-term memory** distills fragmented conversations into structured personas and scenes, instead of flat vector piles.
-
-When integrated with OpenClaw, it cuts token usage by up to **61.38%**, improves pass rate by **51.52%** (relative), and raises PersonaMem accuracy from **48%** to **76%**.
-
-| Memory Capability | Benchmark | OpenClaw Success | With Plugin | Relative Δ | OpenClaw Tokens | With Plugin Tokens | Relative Δ |
-| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
-| **Short-term** | WideSearch | 33% | **50%** | **+51.52%** | 221.31M | **85.64M** | **−61.38%** |
-| **Short-term** | SWE-bench | 58.4% | **64.2%** | **+9.93%** | 3474.1M | **2375.4M** | **−33.09%** |
-| **Short-term** | AA-LCR | 44.0% | **47.5%** | **+7.95%** | 112.0M | **77.3M** | **−30.98%** |
-| **Long-term** | PersonaMem | 48% | **76%** | **+59%** | — | — | — |
-
-> These results are measured over continuous long-horizon sessions, not isolated turns. For example, SWE-bench runs 50 consecutive tasks per session to simulate the context-accumulation pressure of real-world long-horizon agents.
-
----
-
-## Overview
-
-**Memory is not about hoarding everything in the AI — it is about sparing humans from having to repeat themselves.**
-
-In practice, we constantly re-explain the same SOPs, project background, tool conventions, and output formats to the Agent. Such information should not require repetition, nor should it be indiscriminately dumped into the context.
-
-TencentDB Agent Memory helps the Agent learn your workflows, retain task context, and reuse past experience. We reject both brute-force history accumulation and irreversible lossy summarization. Instead, we design memory as a layered system: **symbolic memory** for in-task information overload, and **memory layering** for cross-session experience.
-
-> **Let the Agent remember what should be remembered, so people can focus on judgment, creation, and work that truly matters.**
-
----
-
-## Core Technology: Reject Flat Storage, Embrace Layering and Symbolization
-
-Our architecture rests on two pillars: **memory layering** and **symbolic memory**. Together they ensure Agents do not merely "remember more", but "reason better".
-
-### 1. Memory Layering: Progressive Disclosure with Heterogeneous Storage
-
-Traditional memory systems shred data into fragments and dump them into a flat vector store. Recall degenerates into a blind search across disconnected fragments, with no macro-level guidance.
-
-Whether it is long-term knowledge, short-term tasks, or future skill capabilities, memory should never be flat — both its formation and its recall must be hierarchical. TencentDB Agent Memory adopts **layering** as its unified architectural paradigm:
-
-*   **Short-term context layering.** The bottom layer archives raw tool outputs (`refs/*.md`); the middle layer extracts step-level summaries (`jsonl`); the top layer condenses state into a lightweight Mermaid canvas. The Agent only needs to attend to the top-layer structure in context, and drills down to the lower layers via `node_id` when an error occurs.
-*   **Long-term personalization layering.** In place of flat logs, we build a semantic pyramid: **L0 Conversation** (raw dialogue) → **L1 Atom** (atomic facts) → **L2 Scenario** (scene blocks) → **L3 Persona** (user profile). The Persona layer carries day-to-day preferences; the system drills down to Atoms only when details matter.
-*   **Skill generation layering.** Layering also applies to actions. The middle layer derives common solution patterns (**Scenario**) from bottom-layer execution traces (**Conversation**), and the top layer distills reusable Skills or standard SOPs (**Persona**).
-
-<p align="center">
-  <img src="./assets/images/memory-pyramid-en.jpg" alt="TencentDB Agent Memory L0 to L3 semantic pyramid" width="860" />
-</p>
-
-**Heterogeneous storage and progressive disclosure.** A dual-layer storage strategy underpins this architecture. The bottom layer (facts, logs, traces) is persisted in databases for robust full-text retrieval; the top layer (personas, scenes, canvases) is stored as human-readable Markdown files for high information density and white-box inspection. **Lower layers preserve evidence; upper layers preserve structure.**
-
-**Full traceability and lossless recovery.** Compression often sacrifices traceability. TencentDB Agent Memory avoids irreversible compression by maintaining a deterministic path from high-level abstractions back to ground-truth evidence. Whether it is an offloaded error log or a distilled user preference, the system guarantees a complete drill-down path: "top-layer symbol (Persona / canvas) → mid-layer index (Scenario / jsonl) → bottom-layer raw text (L0 Conversation / refs)".
-
-<div align="center">
-  <img src="assets/images/flowchart1.png" alt="Retrievable and Recoverable Drill-Down Chain" />
-</div>
-
-### 2. Symbolic Memory: Maximum Semantics in Minimum Symbols (Mermaid Canvas)
-
-In long tasks, the largest token consumers are verbose intermediate logs (search results, code, error traces). To address this, we combine **context offloading** with **symbolic memory**:
-
-*   **Mermaid symbol graph.** Instead of verbose prose or flat JSON, we encode task state transitions in high-density Mermaid syntax — precise enough for LLMs to parse, concise enough for humans to read.
-*   **History offloading.** Full tool logs are offloaded to external files; only a lightweight Mermaid task map remains in context.
-*   **`node_id` tracing.** The Agent reasons over the symbol graph; to verify a detail, it greps for the `node_id` and instantly retrieves the full raw text — cutting token cost while preserving full traceability.
-
-```mermaid
-graph LR
-    Log["Verbose Logs<br/>(hundreds of thousands of tokens)"] -->|"1. Offload full text"| FS[("External FS<br/>(refs/*.md)")]
-    Log -->|"2. Extract relations"| MMD["Mermaid Canvas<br/>(with node_id)"]
-    
-    MMD -->|"3. Light injection"| Agent(("Agent Context<br/>(a few hundred tokens)"))
-    Agent -. "4. Recall via node_id" .-> FS
-    
-    style Log fill:#f1f5f9,stroke:#94a3b8,stroke-dasharray: 5 5,color:#475569
-    style FS fill:#f8fafc,stroke:#cbd5e1,stroke-width:2px,color:#334155
-    style MMD fill:#eff6ff,stroke:#3b82f6,stroke-width:2px,color:#1e3a8a
-    style Agent fill:#fffbeb,stroke:#f59e0b,stroke-width:2px,color:#92400e
+---
+
+> **Latest:** Team Memory Beta is evolving quickly — install it and start exploring in minutes.
+
+<td>
+   <video src="https://github.com/user-attachments/assets/efb1a808-1f86-4cfe-802c-f7453f7ca938" width="100%" controls autoplay loop muted playsinline></video>
+</td>
+
+# Installation
+
+Start all three services in one go (`memory-core` + `memory-hub` + `proxy`):
+
+```bash
+git clone https://github.com/Tencent/TencentDB-Agent-Memory.git
+cd TencentDB-Agent-Memory/deploy/global-images
+cp .env.example .env
+$EDITOR .env       # Fill in two sets of LLM parameters (memory group + proxy group)
+./start-all.sh     # Launch everything with one command; when finished, it prints a one-liner you can paste directly into Claude
 ```
 
----
-
-## Quick Start
-## 🎬 Demos
-
-<table align="center">
-  <tr align="center" valign="middle">
-    <td width="50%" valign="middle">
-      <video src="https://github.com/user-attachments/assets/09c64a2c-9997-42c0-90a3-a15e250cfa43" controls="controls" muted="muted" style="max-width: 100%;"></video>
-    </td>
-    <td width="50%" valign="middle">
-      <video src="https://github.com/user-attachments/assets/69045512-e75f-4c84-99dd-52ffa6e9e317" controls="controls" muted="muted" style="max-width: 100%;"></video>
-    </td>
-  </tr>
-  <tr align="center" valign="top">
-    <td>
-      <em>OpenClaw × Agent Memory</em>
-    </td>
-    <td>
-      <em>Hermes × Agent Memory</em>
-    </td>
-  </tr>
-</table>
-
----
-
-
-### 1. OpenClaw
-### 1.1 Install the plugin
-
-```bash
-openclaw plugins install @tencentdb-agent-memory/memory-tencentdb
-openclaw gateway restart
+Open the panel: [http://localhost:8125](http://localhost:8125).
+
+Complete installation documentation (standalone Memory Hub deployment, Proxy + Claude Code usage, stop and cleanup, port reference, etc.) is available in [**INSTALL.md**](./INSTALL.md) (中文: [INSTALL_CN.md](./INSTALL_CN.md)).
+
+### Migrating data from an older version
+
+If you're already on an older release (v1.x / v0.x) and want to bring your existing data over to v2.0.0+, we provide a migration tool:
+
+See [**Data Migration Tool (v2 → v3)**](./MemoryCore/scripts/migrate-v2-to-v3/README.md) for full usage and flags. New installations can skip this.
+
+# What is TencentDB Agent Memory?
+
+We started from a practical question: **How do you reduce repetitive work when using Agents?**
+
+If project context has already been explained, it shouldn't need to be repeated in a new session. If documents have already been read, every Agent shouldn't have to start again from page one. A workflow that already works shouldn't have to be rediscovered next time.
+
+Memory here means more than just "remembering conversations." **Any information that helps the next Agent avoid reinventing the wheel should be saved, organized, and reused.**
+
+```text
+Existing information → Reusable memory assets → Fewer turns → Less rework → More stable results and higher efficiency
 ```
 
-> Please use the native OpenClaw command to upgrade the plugin. This approach prevents the plugin from being disabled caused by semantic version ranges.
-> ```bash
-> openclaw plugins update @tencentdb-agent-memory/memory-tencentdb
-> ```
-
-### 1.2 Zero-config to enable
-
-Defaults to a local `SQLite + sqlite-vec` backend.
-
-```jsonc
-// ~/.openclaw/openclaw.json
-{
-  "memory-tencentdb": {
-    "enabled": true
-  }
-}
+### Let experience accumulate, flow, and pass on to the next Agent
+
+**Memory Hub** for Agent teams closes the loop across the entire experience lifecycle: work produces assets, assets circulate through the team, and new members can load the team's save file on day one.
+
+1. **Automatic asset extraction**: Extract Chat Memory and Skills from conversations and tasks; convert documents and code into Wiki and CodeGraph; then manage, review, and route them consistently.
+2. **Portable & multi-Agent compatible**: Memory assets are decoupled from Agent frameworks — they can move across frameworks and be shared and maintained by multiple Agents and team members.
+3. **Cold-start friendly**: Import existing documents, codebases, and Agent conversation sessions. New Agent teams can start from existing experience instead of learning from scratch.
+
+### 🧠 A brain that remembers people and context
+
+- **Chat Memory** retains preferences, facts, decisions, and interaction history.
+- Each Agent automatically gets its own memory when created — no need to re-introduce yourself next time.
+- L0 Conversation → L1 Atom → L2 Scenario → L3 Persona — raw conversations are distilled layer by layer.
+
+<img width="" src="assets/images/chat_memory.cn.png" alt="image.png" />
+
+> "Don't refactor the old auth module — mobile is still using it." — Context this costly shouldn't depend on humans repeating it every time.
+
+### ⚡ A Skill library that accumulates expertise
+
+- After completing complex work, Agents can extract and manage reusable Skills from conversations and tool calls, and import them into the context of a designated Agent when needed.
+- A Skill isn't just a prompt snippet; it has versions, resource files, trigger boundaries, execution steps, and validation rules.
+- Personal Skills are private by default; after review, they can be shared with the team and assigned to other Agents.
+
+<img width="" src="assets/images/skill.cn.png" alt="image.png" />
+
+> Troubleshooting, code review, release checklists — learn it once, and the whole team can use it.
+
+### 📖 A knowledge map that reads both docs and code
+
+- **Wiki** turns product docs, design specs, and ops runbooks into structured pages with a link graph. (Inspired by Karpathy's LLM knowledge base.)
+
+<img src="./assets/images/wiki.cn.png" alt="image.png" />
+
+- **CodeGraph** indexes code symbols, files, call relationships, and impact paths.
+<img width="" src="assets/images/codegraph.cn.png" alt="image.png" />
+
+- Agents can search, read, inspect callers/callees, and perform impact analysis before modifying code.
+
+> Wiki keeps Agents from reading every file list before getting to work. CodeGraph doesn't just tell them "the code is here" — it tells them "changing this might affect those."
+
+### 🛡️ A team memory panel controlled by humans
+
+- Create teams and Agents in Memory Hub; review, share, and equip memory assets.
+- Manage ownership, versions, status, visibility, usage counts, and Agent bindings in one place.
+- `private` belongs strictly to the Owner; `team` is visible to all team members; `restricted` grants precise access via User / Role / Agent ACLs.
+
+<img width="" src="assets/images/asset.cn.png" alt="image.png" />
+
+
+## Cold Start: Load the Save File, Then Get to Work
+
+Most Agents' first task is re-learning your project. TencentDB Agent Memory turns the learning cost you've already paid into a save file:
+
+<img alt="Cold Start: import codebase, docs, and history into Memory Hub" src="assets/images/flowchart3.png" />
+
+Specifically, these existing assets can be imported directly and processed automatically in the panel:
+
+- **Codebases**: Import existing repositories — **CodeGraph** automatically indexes symbols, files, call relationships, and impact paths.
+- **Documents & files**: Import relevant docs and files — **Wiki** automatically generates structured pages with a link graph.
+- **Conversation sessions**: Import past Agent conversation sessions — **Skills and Chat Memory** are automatically extracted as reusable assets.
+
+> Stop retraining every Agent. Give it the save file.
+
+## One Play Style: Build a Growing Agent Team for a One-Person Company
+
+Open Memory Hub and create a team:
+
+```text
+Tiny but Serious Inc.
+├── 👤 You · Set goals / Make decisions
+├── 🔭 Scout · Research / Find opportunities
+├── 🛠 Builder · Write code / Build products
+├── 🧪 Reviewer · Test / Find issues
+└── 🧠 Agent Memory · Preserve the team's experience
 ```
 
-Once enabled, TencentDB Agent Memory automatically handles conversation capture, memory extraction, scene aggregation, persona generation, and recall before the next turn.
-
-### 1.3 Enable short-term compression (optional, requires version ≥ 0.3.4)
-
-```jsonc
-{
-  "memory-tencentdb": {
-    "config": {
-      "offload": {
-        "enabled": true
-      }
-    }
-  }
-}
+You're not opening four disconnected chat windows — you're assembling a squad with different roles that can inherit the team's accumulated experience.
+
+### Recruit first, then equip
+
+```text
+🔭 Scout
+   ├── User interview Chat Memory
+   ├── Market research Wiki
+   └── Competitive analysis Skill
+
+🛠 Builder
+   ├── Product Wiki
+   ├── Project CodeGraph
+   └── Feature Delivery Skill
+
+🧪 Reviewer
+   ├── Historical incident Chat Memory
+   ├── Project CodeGraph
+   └── Release Checklist Skill
 ```
 
-#### Step 1 — Register the slot in your plugin config
-
-Add the `slots` field so OpenClaw routes context-offload requests to this plugin:
-
-```jsonc
-{
-  "plugins": {
-    "slots": {
-      "contextEngine": "memory-tencentdb"
-    }
-  }
-}
-```
-
-#### Step 2 — Apply the runtime patch
-
-For the best results, run the patch script below. It hooks `after-tool-call` messages so they can be offloaded and recovered correctly:
-
-```bash
-bash scripts/openclaw-after-tool-call-messages.patch.sh
-```
-
-> 💡 The patch only needs to be applied once per OpenClaw installation. After upgrading OpenClaw, re-run the script to re-apply.
-
-
-### 2. Hermes
-
-In addition to OpenClaw, this plugin also supports [Hermes](https://github.com/NousResearch/hermes-agent) Agent. Choose the installation path based on your deployment scenario:
-
-| You want to … | Use |
-|---|---|
-| Spin up a memory-enabled Hermes from scratch in one command | 2.A Docker (below) |
-| Add memory to an existing Hermes install | 2.B Plug into an existing Hermes (next section) |
-
-#### 2.A Docker (greenfield, requires version ≥ 0.3.4)
-
-The Docker image bundles `hermes-agent` and the `memory_tencentdb` provider together. The Gateway listens on `:8420`:
-
-```bash
-# ============ Configuration Parameters ============
-# MODEL_API_KEY    LLM API key (required) — replace with your own credential
-# MODEL_BASE_URL   LLM endpoint, defaults to Tencent Cloud LKE (Large Model Knowledge Engine)
-# MODEL_NAME       Model name, defaults to DeepSeek-V3.2
-# MODEL_PROVIDER   Provider type: "custom" works for any OpenAI-compatible endpoint
-
-MODEL_API_KEY="your-api-key"
-MODEL_BASE_URL="https://api.lkeap.cloud.tencent.com/v1"
-MODEL_NAME="deepseek-v3.2"
-MODEL_PROVIDER="custom"
-
-# ============ docker run Flags ============
-# -d                          Run container in detached (background) mode
-# --name hermes-memory        Container name, for later docker exec / logs / stop
-# --restart unless-stopped    Auto-restart on crash or host reboot
-# -p 8420:8420                Host port ↔ container port (Hermes Gateway)
-# -e MODEL_*                  Inject the config parameters above as env vars
-# -v hermes_data:/opt/data    Persist memory data to a named volume (survives restart)
-
-# Enter the Docker build directory (already cloned the repo and at the repo root)
-cd docker/opensource
-
-# Build
-docker build -f Dockerfile.hermes -t hermes-memory .
-
-# Run
-docker run -d \
-  --name hermes-memory \
-  --restart unless-stopped \
-  -p 8420:8420 \
-  -e MODEL_API_KEY="your-api-key" \
-  -e MODEL_BASE_URL="https://api.lkeap.cloud.tencent.com/v1" \
-  -e MODEL_NAME="deepseek-v3.2" \
-  -e MODEL_PROVIDER="custom" \
-  -v hermes_data:/opt/data \
-  hermes-memory
-
-# Verify the Gateway
-curl http://localhost:8420/health
-
-# Enter the Hermes interactive shell
-docker exec -it hermes-memory hermes
-```
-
-> The image ships with Tencent Cloud DeepSeek-V3.2 as the default. If you use this model, omit `MODEL_BASE_URL` / `MODEL_NAME` / `MODEL_PROVIDER` and pass only `MODEL_API_KEY`.
-
-#### 2.B Attach to Existing Hermes (No Docker)
-
-If you already have `hermes-agent` installed on your host and just want to add memory capabilities, **no Docker image is needed**.
-
-**1. Download the plugin package to a unified directory**:
-
-```bash
-mkdir -p ~/.memory-tencentdb
-TEMP_DIR=$(mktemp -d)
-cd "$TEMP_DIR"
-npm init -y --silent
-npm install @tencentdb-agent-memory/memory-tencentdb@latest --omit=dev
-cp -r node_modules/@tencentdb-agent-memory/memory-tencentdb \
-      ~/.memory-tencentdb/tdai-memory-openclaw-plugin
-rm -rf "$TEMP_DIR"
-```
-
-**2. Install Gateway dependencies**:
-
-```bash
-cd ~/.memory-tencentdb/tdai-memory-openclaw-plugin
-npm install --omit=dev
-npm install tsx
-```
-
-**3. Link to the Hermes plugin directory**:
-
-```bash
-rm -rf ~/.hermes/hermes-agent/plugins/memory/memory_tencentdb
-ln -sf ~/.memory-tencentdb/tdai-memory-openclaw-plugin/hermes-plugin/memory/memory_tencentdb \
-       ~/.hermes/hermes-agent/plugins/memory/memory_tencentdb
-```
-
-> The directory **must** be named `memory_tencentdb` (with an underscore) — Hermes uses this as the provider key. `memory-tencentdb` (with a hyphen) is only an alias at the config level and **cannot** be used as the directory name.
-
-**4. Declare the provider in `~/.hermes/config.yaml`**:
-
-```yaml
-memory:
-  provider: memory_tencentdb
-```
-
-**5. Configure Gateway environment variables**
-
-Edit `~/.hermes/.env` and add:
-
-```bash
-MEMORY_TENCENTDB_GATEWAY_CMD="sh -c 'cd ~/.memory-tencentdb/tdai-memory-openclaw-plugin && exec npx tsx src/gateway/server.ts'"
-MEMORY_TENCENTDB_GATEWAY_HOST="127.0.0.1"
-MEMORY_TENCENTDB_GATEWAY_PORT="8420"
-```
-
-Add LLM credentials as needed (the Gateway actually reads the `TDAI_LLM_*` variables):
-
-```bash
-TDAI_LLM_API_KEY="sk-your-api-key-here"
-TDAI_LLM_BASE_URL="https://api.openai.com/v1"
-TDAI_LLM_MODEL="gpt-4o"
-```
-
-Alternatively, use a Gateway config file at `~/.memory-tencentdb/memory-tdai/tdai-gateway.json`:
-
-```json
-{
-  "llm": {
-    "baseUrl": "https://your-api-endpoint/v1",
-    "apiKey": "your-api-key",
-    "model": "your-model-name"
-  }
-}
-```
-
-**6. Start the Gateway** (choose one of two methods):
-
-- **Auto-discovery on conversation (recommended, zero-config)**: Don't start the Gateway manually — just start talking to Hermes. The provider will auto-detect `~/.memory-tencentdb/tdai-memory-openclaw-plugin/src/gateway/server.ts` and launch it via `Popen()` on the first conversation. The initial conversation may have a slight delay.
-- **Manual run**: Start a standalone Gateway process in advance:
-  ```bash
-  cd ~/.memory-tencentdb/tdai-memory-openclaw-plugin
-  npx tsx src/gateway/server.ts
-  ```
-
-**7. Verify**:
-
-```bash
-curl http://127.0.0.1:8420/health
-# Should return {"status":"ok"} or {"status":"degraded"}
-```
-
-> For the complete provider reference (environment variables, troubleshooting, LLM tool schemas, supervisor behavior), see [`hermes-plugin/memory/memory_tencentdb/README.md`](./hermes-plugin/memory/memory_tencentdb/README.md). Please read it before adjusting the supervisor / circuit-breaker defaults.
-
-
----
-
-### 3. Hermes (Windows native)
-
-For a Windows-native Hermes install, run the bundled batch script from the
-repository root in Command Prompt or PowerShell:
-
-```powershell
-$env:TDAI_LLM_API_KEY="your-api-key"
-$env:TDAI_LLM_BASE_URL="https://api.openai.com/v1"
-$env:TDAI_LLM_MODEL="gpt-4o"
-.\scripts\setup-hermes-memory-tencentdb.bat
-```
-
-The script checks `node`, `npm`, Python, and Hermes, requires Node.js
-`>=22.16.0`, runs `npm install --omit=dev` when Gateway dependencies are
-missing, creates `%USERPROFILE%\.memory-tencentdb\memory-tdai`, copies the
-provider to `%USERPROFILE%\.hermes\plugins\memory_tencentdb`, writes Gateway
-environment variables to `%USERPROFILE%\.hermes\.env`, and starts the Gateway
-before polling:
-
-```powershell
-curl.exe http://127.0.0.1:8420/health
-```
-
-If `%USERPROFILE%\.hermes\config.yaml` already exists, make sure it contains:
-
-```yaml
-memory:
-  provider: memory_tencentdb
-```
-
-
-## 🔒 Gateway Security (optional)
-
-The Hermes Gateway listens on `:8420` and exposes capture / search / recall HTTP endpoints. Two opt-in switches let you turn it from "open localhost sidecar" into "authenticated network service". **Both default to off so existing deployments keep working unchanged.**
-
-| Field | env | Default | Description |
-| :--- | :--- | :--- | :--- |
-| `server.apiKey` | `TDAI_GATEWAY_API_KEY` | _(unset)_ | When set, every route except `GET /health` requires `Authorization: Bearer <apiKey>`; missing or wrong tokens get HTTP 401. Comparison is constant-time. |
-| `server.corsOrigins` | `TDAI_CORS_ORIGINS` (comma-separated) | `[]` | CORS allow-list. Empty list emits **no** `Access-Control-Allow-*` headers — browsers then block all cross-origin requests. Use `["*"]` only for local development. |
-
-When `apiKey` is unset, the gateway prints a startup `WARN`. If it is bound to a non-loopback host (e.g. `0.0.0.0`) without an apiKey, a second louder warning is emitted.
-
-Clients call protected routes with a Bearer token:
-
-```bash
-curl -H "Authorization: Bearer $TDAI_GATEWAY_API_KEY" \
-     -H "Content-Type: application/json" \
-     -d '{"query":"...","session_key":"..."}' \
-     http://127.0.0.1:8420/recall
-```
-
-`GET /health` stays open without a token so orchestrator probes (`docker healthcheck`, `kubectl liveness`) keep working.
-
-### Hermes plugin side
-
-The Hermes `memory_tencentdb` plugin is a **client** of the Gateway. To make it talk to a Gateway that has auth enabled, set:
-
-```bash
-export MEMORY_TENCENTDB_GATEWAY_API_KEY="<same-secret-as-gateway>"
-```
-
-The plugin will then attach `Authorization: Bearer <key>` to every request it sends to the Gateway. If the variable is unset, the plugin sends no auth header — which matches the Gateway's legacy default and is fine for a Gateway that has not opted into `TDAI_GATEWAY_API_KEY`.
-
-Important: the plugin only handles the **client half**. Whether the Gateway actually enforces a Bearer check is decided on the Gateway side (`TDAI_GATEWAY_API_KEY` / `server.apiKey`). Configure the same secret on both ends — the plugin does not propagate the secret across, since the Gateway might be started by Docker, systemd, or any other means outside the plugin's control.
-
-If `MEMORY_TENCENTDB_GATEWAY_API_KEY` is unset, the plugin also looks at `TDAI_GATEWAY_API_KEY` as a fallback — handy when both processes share an env file and the operator only wants to set one variable name. The Gateway never reads `MEMORY_TENCENTDB_GATEWAY_API_KEY`; that name is plugin-side only.
-
----
-
-
-## 🔧 Configurable Parameters
-
-**Every field has a sensible default — it runs with zero configuration.** When you want to tune, peel back the layers based on how deep you go.
-
-<details>
-<summary><b>🟢 Level 1 · Daily tuning</b> (covers 90% of use cases)</summary>
-
-| Field | Default | Description |
+Different roles, different loadouts. Less noise — give each Agent the memory assets it actually needs to get work done.
+
+**The company can be tiny. Experience can compound forever.**
+
+## Memory Assets, Not a Chat Log Warehouse
+
+RAG answers "what can be found?" Team Memory also answers "who can use it, which version is valid, and which Agent should receive it."
+
+| | Chat History | Standard RAG | TencentDB Agent Memory |
+| :--- | :---: | :---: | :---: |
+| Cross-session user understanding | △ | △ | ✅ Chat Memory |
+| Distilled executable experience | — | — | ✅ Skill |
+| Document structure & relationships | — | △ Chunk retrieval | ✅ Wiki + Link Graph |
+| Code call graphs & impact scope | — | △ Text match | ✅ CodeGraph |
+| Ownership / Version / Status | — | — | ✅ |
+| Team sharing & Agent loadout | — | — | ✅ |
+| Private / Team / ACL | — | △ | ✅ |
+
+## Memory Hub Is Not a Display Board — It's a Control Panel
+
+| Play Style | What you do in the Hub |
+| :--- | :--- |
+| **Team Up** | Create teams, add people and Agents, define sharing boundaries |
+| **Asset Library** | Browse, search, review, and manage Chat Memory, Skills, Wiki, and CodeGraph |
+| **Agent Loadout** | Bind different memory assets to different Agents; adjust priority and usage mode |
+| **Knowledge Workshop** | Build Wiki and CodeGraph; monitor processing status and asset metadata |
+| **Access Control** | Switch between private, team, and ACL-based access; revoke sharing when needed |
+
+When you open an asset, what matters is not just "what it says," but also "where it came from, which version it is, who it's assigned to, and whether it's been used recently."
+
+## Every Loop Gains Experience
+
+<img alt="Every Loop Gains Experience: continuous accumulation, making every use smarter" src="assets/images/flowchart4.png" />
+
+Memory doesn't run the Agent loop; it ensures the next iteration inherits the previous one's results: valuable interactions stay in Chat Memory, proven workflows are distilled into Skills, and document/code changes are updated through Wiki ingest and CodeGraph sync.
+
+**Without Memory, loops may just repeat faster. With inherited memory, each iteration has the chance to be better than the last.**
+
+## One Agent Team: Shared Experience, Not Shared Privacy
+
+New Chat Memory and Skills are private by default. Sharing is an explicit action, not a default leak.
+
+| Visibility | Semantics |
+| :--- | :--- |
+| `private` | Only the Owner can read — not even team admins |
+| `team` | Team members can read; the Owner / Admin can manage |
+| `restricted` | Precise access via User / Role / Agent ACL |
+| `agent` | For targeted equipping of Agents within the same team |
+
+You can assign the "Release Skill" to the Release Agent, the "Architecture Wiki" to all development Agents, and CodeGraph to Coder and Reviewer.
+
+## Technical Implementation
+
+TencentDB Agent Memory doesn't aim to "store everything." It solves three problems: **what's worth keeping, who can use it, and how to retrieve less while retrieving the right things next time.**
+
+<img alt="Technical overview: layering (L0–L3), Memory Assets, Memory Hub, identity-based assembly for Agents" src="assets/images/flowchart5.png" />
+
+### 1. Memory isn't flat records — it grows in layers
+
+Conversations are first saved as L0, then refined by an async pipeline into multiple levels of granularity:
+
+| Layer | What it stores | Primary use |
 | :--- | :--- | :--- |
-| `timezone` | `"system"` | Timezone for user/LLM-facing timestamps: `"system"` (follow process tz) / IANA name (`Asia/Shanghai`) / offset string (`+08:00`) |
-| `storeBackend` | `"sqlite"` | Storage backend: `sqlite` |
-| `recall.strategy` | `"hybrid"` | Recall strategy: `keyword` / `embedding` / `hybrid` (RRF fusion, recommended) |
-| `recall.maxResults` | `5` | Number of items returned per recall |
-| `recall.maxCharsPerMemory` | `0` | Max characters injected for one recalled L1 memory; `0` disables this guard |
-| `recall.maxTotalRecallChars` | `0` | Total character budget for auto-recalled L1 memories; `0` disables this guard |
-| `pipeline.everyNConversations` | `5` | Trigger an L1 memory extraction every N turns |
-| `extraction.maxMemoriesPerSession` | `20` | Max memories extracted per L1 pass |
-| `persona.triggerEveryN` | `50` | Generate the user persona every N new memories |
-| `offload.enabled` | `false` | Whether to enable short-term compression |
-
-</details>
-
-<details>
-<summary><b>🟡 Level 2 · Advanced tuning</b> (long task / long session)</summary>
-
-| Field | Default | Description |
-| :--- | :--- | :--- |
-| `pipeline.enableWarmup` | `true` | Warm-up: a new session triggers from turn 1, doubling each time up to N (1→2→4→…) |
-| `pipeline.l1IdleTimeoutSeconds` | `600` | Trigger L1 after the user has been idle for this many seconds |
-| `pipeline.l2MinIntervalSeconds` | `900` | Minimum interval between two L2 passes within the same session |
-| `recall.timeoutMs` | `5000` | Recall timeout; on timeout, skip injection without blocking the conversation |
-| `extraction.enableDedup` | `true` | L1 vector dedup / conflict detection |
-| `capture.excludeAgents` | `[]` | Glob patterns to exclude specific agents (e.g. `bench-judge-*`) |
-| `capture.l0l1RetentionDays` | `0` | Local retention days for L0 / L1 files; `0` = never clean up |
-| `offload.mildOffloadRatio` | `0.5` | Mild compression trigger ratio (of context window) |
-| `offload.aggressiveCompressRatio` | `0.85` | Aggressive compression trigger ratio |
-| `offload.mmdMaxTokenRatio` | `0.2` | Token budget ratio for MMD injection |
-| `bm25.language` | `"zh"` | Tokenizer language: `zh` (jieba) / `en` |
-
-</details>
-
-<details>
-<summary><b>🔴 Level 3 · Full parameter reference</b> (ops / custom models / remote embedding)</summary>
-
-For all fields, types, and constraints see [`openclaw.plugin.json`](./openclaw.plugin.json)。
-
-- `embedding.*` — remote embedding service (OpenAI-compatible API)
-  - `embedding.sendDimensions` (default `true`): whether to include the `dimensions` field in the request body. OpenAI `text-embedding-3-*` models rely on it for Matryoshka truncation, but some self-hosted / OSS models (e.g. **BGE-M3**) do not support custom dimensions and will reject the request with HTTP 400 `does not support matryoshka representation`. Set it to `false` for those backends, e.g.:
-    ```json
-    {
-      "embedding": {
-        "enabled": true,
-        "provider": "openai",
-        "baseUrl": "http://your-host:your-port/v1",
-        "apiKey": "<KEY>",
-        "model": "bge-m3",
-        "dimensions": 1024,
-        "sendDimensions": false
-      }
-    }
-    ```
-- `llm.*` — standalone LLM mode (bypass OpenClaw's built-in model and run L1/L2/L3 with a designated API)
-- `offload.backendUrl / backendApiKey` — offload the L1/L1.5/L2/L4 flow to a backend service
-- `report.*` — metrics reporting
-
-</details>
-
----
-
-## 🤔 Features
-
-### 1. Macro Personas + Micro Facts: A Unified Drill-Down Mechanism
-
-The biggest risk in compression is saving tokens at the cost of losing the evidence. TencentDB Agent Memory therefore does not collapse history into an irreversible summary — it preserves a clear path from high-level abstraction back to ground-truth evidence.
-
-| Question type | First look at | Drill down to |
-| :--- | :--- | :--- |
-| Daily preferences, voice, long-term goals | L3 Persona / L2 Scenario | L1 Atom / L0 Conversation when facts are needed |
-| Specific facts, dates, project details | L1 Atom / L0 Conversation | Widen the time range, or fall back to semantic recall when results are sparse |
-| Continuing a long-running task | Active Mermaid task canvas | Check the JSONL when the summary lacks detail, then `refs/*.md` for raw text |
-| Resuming a historical task | Metadata task entry | Open the Mermaid canvas → locate the `node_id` → trace `result_ref` |
-
-The upper layers carry judgment and direction; the lower layers carry evidence and precision. Short-term compression and long-term memory form a single closed loop: **collapsible and expandable, abstract yet auditable.**
-
-### 2. White-Box Debuggability: Memory Is Not a Black Box
-
-Most memory systems fall short here: when recall is wrong, all you see is a list of vector scores, with no way to tell where things went wrong. TencentDB Agent Memory keeps the key intermediates as readable files:
-
-- L2 Scenario blocks are plain Markdown — open them and inspect.
-- L3 Persona lives in `persona.md` and traces back to the Scenarios that produced it.
-- Short-term task canvases are Mermaid — readable by both humans and Agents.
-- Raw payloads, summaries, and nodes are linked by `result_ref` and `node_id`.
-
-Debugging no longer means probing an opaque database — it becomes a deterministic walk along the chain "Persona → Scenario → Atom → Conversation" until the root cause surfaces.
-
-**All of these layered memory artifacts live under `~/.openclaw/memory-tdai/` — feel free to open the directory and inspect each layer for yourself.**
-
-### 3. Production-Ready Engineering: Not a Demo
-
-| Capability | Description |
-| :--- | :--- |
-| OpenClaw plugin | Automatically captures, extracts, and recalls memory once installed |
-| Hermes Gateway adapter | `TdaiCore + HostAdapter`, decoupled from the host framework |
-| Local backend | `SQLite + sqlite-vec`, ready to use out of the box |
-| Hybrid retrieval | BM25 + vector + RRF — supports both keyword and semantic recall |
-| Agent tools | `tdai_memory_search` / `tdai_conversation_search` |
-
----
-
-## Documentation
-
-| Document | Contents |
-| :--- | :--- |
-| [`scripts/README.memory-tencentdb-ctl.md`](./scripts/README.memory-tencentdb-ctl.md) | Operations & management tooling |
-| [`CHANGELOG.md`](./CHANGELOG.md) | Release notes and version history |
-| [`openclaw.plugin.json`](./openclaw.plugin.json) | OpenClaw plugin manifest and configuration schema |
-
----
-
+| **L0 Conversation** | Raw conversations with full context | Verify exact wording, timestamps, and sources |
+| **L1 Atom** | Facts, preferences, constraints, and events extracted from conversations | Precise recall of actionable information |
+| **L2 Scenario** | Knowledge blocks organized around projects or scenarios | Quickly restore a working context |
+| **L3 Core / Persona** | Long-term profiles, stable patterns, and high-level cognition | Let Agents rapidly enter a user's and team's context |
+
+Both generation and retrieval are layered: normally, L2/L3 provide a quick context bootstrap; when specific facts are needed, BM25 + vector retrieval + RRF fall back to L1/L0. Results are further capped by item count, character budget, and timeout limits to prevent memory from overwhelming the context window.
+
+### 2. Memory isn't a global prompt — it's the Agent's loadout
+
+Chat Memory, Skills, Wiki, and CodeGraph are all registered uniformly as Memory Assets. Memory Hub uses **Fixed Binding + ACL** to determine which assets a given Agent can use: first narrow the permission scope by Team, User, Agent, and visibility, then retrieve based on the current query.
+
+This lets teams share experience without exposing all their private information; switching Agents or frameworks only requires re-equipping, not retraining.
+
+### 3. Knowledge isn't injected wholesale — it's called on demand
+
+Documents are organized into searchable Wiki pages that support link-graph drill-down; codebases are indexed into CodeGraph assets containing files, symbols, and call relationships. Agents first discover capabilities via `/v3/tools/list`, then use `/v3/tools/call` to read relevant pages, source code, or impact paths.
+
+This makes documents and code part of memory as well — but they remain available tools that only enter context when truly needed.
+
+## Benchmark
+
+| Benchmark | Without TencentDB Agent Memory | With it enabled | Relative improvement |
+| :--- | :---: | :---: | :---: |
+| **PersonaMem** | 48% | **76%** | **+59%** |
+
+PersonaMem tests whether an Agent can correctly understand and apply user information after extended interactions.
+
+## Notes
+
+- Wiki and CodeGraph are built asynchronously; allow some processing time before they reach `ready` status.
+- CodeGraph currently prioritizes public HTTPS repositories; support for private repositories and SSH credentials is still being refined.
+- The Hub supports manual asset binding; fully automated memory routing is still under iteration.
+- TencentDB Agent Memory currently supports OpenClaw, Hermes, and SDK integration; broader cross-framework migration is on the roadmap.
+
+## Related Documentation
+
+- [Full Installation Guide](./INSTALL.md) (Memory Core + Hub + Proxy one-click deployment)
+- [Data Migration Tool (v2 → v3)](./MemoryCore/scripts/migrate-v2-to-v3/README.md) (if you're on an older release and want to migrate existing data)
+- [Knowledge OpenAPI](./MemoryKnowledge/docs/api/openapi.yaml)
+- [Contributing Guide](./CONTRIBUTING.md)
+
+Agent Memory doesn't have a settled standard yet. Bug reports, documentation, benchmarks, new framework adapters, and more creative Memory Hub use cases are all welcome.
+
+---
+## Acknowledgements
+
+TencentDB Agent Memory stands on the shoulders of the open-source community:
+
+- [**CodeGraph**](https://github.com/colbymchenry/codegraph) — our CodeGraph asset module **uses code from this project**. Its design of a pre-indexed code graph is the foundation of our implementation.
+- [**Hermes Agent**](https://github.com/nousresearch/hermes-agent) (Nous Research) — our Skill asset management **uses part of the Skill-related code from Hermes Agent and builds further optimizations base on it**.
+- [**"LLM Wiki"** by Andrej Karpathy](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) — the idea of treating documentation as an LLM-maintained, incrementally growing knowledge artifact directly informed how our Wiki layer is built and kept up to date.
+
+We are grateful to the authors and contributors of these projects.
+
+---
 ## Community & Contributing
 
-We welcome every kind of contribution — bug reports, feature ideas, doc fixes, benchmark reproductions, ecosystem integrations, or a Pull Request. Agent memory is far from a solved problem, and we'd love to figure it out together.
-
-- 🐞 **Found a bug or have a question?** Open an issue at [GitHub Issues](https://github.com/Tencent/TencentDB-Agent-Memory/issues) — we respond within 24 hours.
+We welcome contributions of all kinds — bug reports, feature suggestions, documentation fixes, benchmark reproductions, ecosystem integrations, or pull requests. Agent memory is far from settled, and we hope to build it together with the community.
+
+- 🐞 **Found a bug or have a question?** Open an issue in [GitHub Issues](https://github.com/Tencent/TencentDB-Agent-Memory/issues) — we respond within 24 hours.
 - 💡 **Have an idea to share?** Start a thread in [GitHub Discussions](https://github.com/Tencent/TencentDB-Agent-Memory/discussions).
 - 🛠️ **Want to contribute code?** Please read [CONTRIBUTING.md](./CONTRIBUTING.md) first.
-- 💬 **Want to chat with us?** Join our [Discord community](https://discord.gg/dJQM6mKMF) and talk to the early developers directly.
-
----
-
-## Roadmap
-
-- [x] Long-term personalized memory (L0 → L3)
-- [x] Short-term context compression (Context Offload + Mermaid canvas)
-- [x] Local SQLite backend and Tencent Cloud Vector Database (TCVDB) backend
-- [x] OpenClaw plugin and Hermes Gateway integration
-- [ ] Portable memory: cross-Agent / cross-framework / cross-device import, export, and live migration
-- [ ] Automatic Skill generation
-- [ ] Visual debugging and memory observability dashboard
-
----
-
-<table>
+- 💬 **Want to chat with us?** Join our [Discord community](https://discord.gg/dJQM6mKMF) and talk to the core developers directly.
+
+---
+
+<p align="center">
+ Let the path the team has walked become the next Agent's starting line.
+</p>
+
+---
+
+## ✨ Contributors
+
+> 💡 Thanks to the following contributors building with us — you make TencentDB Agent Memory better.
+
+<div align="center">
+  <a href="https://github.com/TencentCloud/TencentDB-Agent-Memory/graphs/contributors">
+    <img src="https://contrib.rocks/image?repo=TencentCloud/TencentDB-Agent-Memory&columns=12&anon=1" />
+  </a>
+
+  <br /><br />
+<a href="https://github.com/TencentCloud/TencentDB-Agent-Memory/issues">
+  <img src="https://img.shields.io/badge/Contributions_Welcome-006eff?style=for-the-badge&logo=github&logoColor=white" alt="Contributions Welcome" />
+</a>
+
+</div>
+
+
+<table width="100%">
   <tr>
     <td width="68%">
-      <b>If TencentDB Agent Memory has been useful to you, please give the project a ⭐ to support us.</b><br />
-      For any suggestions, feel free to open an issue and start the discussion.
+      <b>If TencentDB Agent Memory has been helpful to you, please consider starring the project.</b><br />
+      If you have any suggestions, feel free to open an issue for discussion.
     </td>
     <td width="32%" align="right">
       <img src="./assets/images/star-helper.png" alt="Star TencentDB Agent Memory" width="260" />
@@ -577,4 +324,5 @@

   </tr>
 </table>
 
+
 [MIT](./LICENSE) © TencentDB Agent Memory Team
```

</details>
