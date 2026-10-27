# zero-entropy-lab 仓库纪念｜2026-10-28｜CS：复杂智能体运行时与分布式可靠性实验
# Repository Commemoration · 2026-10-28 · Computer Science: Reliable Agent Runtime and Distributed-Systems Experimentation

> **Identity / 记录身份：** Independent bilingual commemorative disciplinary study · 独立新增的中英双语学科研究纪念；static inspection of repository-native scripts and research documents / 基于原生脚本与研究文档的静态核查；not a historical rewrite, runtime execution report, or certification / 不改写历史、不声称执行或认证。
>
> **CS2023 alignment / 学科坐标：** SF; OS; PDC; DM; SEC; AI. These are scholarly comparisons, not endorsements or exact implementation equivalences / 研究分类而非外部机构背书或实现等价。

## 1. 专业归属：这是 CS 的哪一类？ / Disciplinary Position

**中文** — 本仓主要是**复杂智能体系统的状态、记忆、运行与可靠性实验场**，对应 CS 的 Systems Fundamentals、操作系统、并行与分布式计算、数据管理及安全边界。所谓“零熵”是项目的工程愿景与命名，不是物理定律或对任何计算的全局保证。这里同时有本地 Python kernel 和独立的故障／授权／完成性反例实验，两者必须分清。

**English** — Zero-Entropy Lab is a **state, memory, runtime, and reliability laboratory for complex agent systems**, situated in CS systems fundamentals, operating systems, parallel/distributed computing, data management, and security. 'Zero entropy' is project vocabulary and an engineering aspiration—not a physical or universal guarantee. The repository contains both executable kernel code and separate controlled fault/authorization experiments, with distinct evidentiary scopes.

## 2. 仓库自身如何体现？ / Repository-native Architecture and Evidence

**中文** — `src/kernel/memory/cortex.py` 使用 SQLite 及账本投影维护状态；`src/kernel/protocol/nexus.py` 提供具体协议／网关逻辑，`transition_contract.py` 提供纯声明式转换约束；`src/kernel/orchestration/lifecycle_guard.py` 在 GitHub 生命周期中实行确定性的 manifest 与 fail-closed no-apply 判定。`aegis-cortex/EVIDENCE_POLICY.md` 是可靠性证据研究语义；`ballast/tools/**` 和 `ballast/records/**` 记录 fencing、幂等、outbox、offset、已发生效果与当前完成性等受控实验。原生日志会将 synthetic、local SQLite 与 live external effect 明确分开。

**English** — `src/kernel/memory/cortex.py` uses SQLite-backed state and ledger projection; `src/kernel/protocol/nexus.py` contains concrete gateway/protocol code; `transition_contract.py` describes side-effect-free transition declarations; and `src/kernel/orchestration/lifecycle_guard.py` computes deterministic lifecycle evidence and fail-closed no-apply decisions. `aegis-cortex/EVIDENCE_POLICY.md` governs reliability research evidence. `ballast/tools/**` and dated `ballast/records/**` investigate fencing, outbox, consumer offsets, permission at effect time, and exact completion through controlled cases and counterexamples. Synthetic, local-SQLite, and real external effects are separate evidence classes.

## 3. 人话解释 / In Plain Language

**中文** — 可以把它想成复杂 AI 系统的**发动机室加碰撞试验场**：内核要储存、读取、处理状态；实验场故意制造“工人超时后又写了一次”“队列说成功但外部事情没完成”等故障，看看什么证据才能拒绝假成功。纸面上的故障注入成功，不自动证明真实云端已经安全。

**English** — Think of an **engine room next to a crash-test facility**. The kernel stores and transforms local state; the testbed deliberately models stale workers, misleading acknowledgments, duplicate effects, and missing completion evidence. It asks which facts would reject a false success. A synthetic crash test is not a certification of live cloud behavior.

## 4. 如何读懂而不夸大？ / Verification and Non-claim Boundaries

**中文** — Ballast 于 2026-10-15 的 outbox 实验记录两类本地 SQLite commit domains 与 28 个场景，但明确没有真实 Kafka、Debezium 或外部 sink；2026-10-27 SQS 研究也把 synthetic 回执与真实 AWS 操作严格区别。别把文档中对 fencing/circuit breaker 的研究或单个测试结果叙述成全内核生产保证。

**English** — The 2026-10-15 Ballast outbox record reports controlled scenarios across two local SQLite commit domains, explicitly not live Kafka, Debezium, or a production sink. Its 2026-10-27 SQS analysis similarly separates synthetic receipts from AWS execution. Research into fencing/circuit breakers and a local unit test cannot establish universal production resilience.

## 5. 十仓中的独特贡献 / Place in the Ten-repository Research System

**中文** — 五仓中的 **LIQUID / runtime reliability**：它研究系统执行时遇到真实世界边界会如何失败。与 Foundations 的架构原则、Axiom-0 的状态契约及 Reflective 的诊断反馈构成互相约束的研究关系，但不能凭关系假设软件部署在同一服务。

**English** — The **LIQUID / runtime reliability** research layer: it tests how state and effects can fail at execution boundaries. Theory, executable specification, knowledge lifecycle, and reflective diagnosis contextualize its work; no deployment topology is inferred from that conceptual relationship.

## 6. 纪念与升华 / Commemoration and Wider Meaning

**中文** — **复杂智能体的可靠性，最终要在最不体面的故障里接受检验**：重试之后、权限撤销之后、两个系统各自宣称成功之后，系统是否还敢说“我不知道”。

**English** — **Reliability is most meaningful after awkward failures**—stale leases, revoked authority, split commits, and apparently successful acknowledgments. The mature system knows when completion remains unknown.

## 外部学科对照 / External Disciplinary Anchors

- [CS2023: Parallel and Distributed Computing / Systems](https://csed.acm.org/knowledge-areas/)
- [Kleppmann, Cambridge CS profile](https://www.cst.cam.ac.uk/people/mk428)
- [Jepsen analyses](https://jepsen.io/analyses)

> **Provenance / 证据说明：** GitHub repository-native artifacts were read at the 2026-10-28 review cutoff. External sources establish disciplinary context only; independent reproduction, external certification and newly executed tests are **NOT_CLAIMED**. / 原生文件按本次时间点核读；外部来源只用于学科对照；**不声称本轮重新执行测试、独立复现或第三方认证**。
