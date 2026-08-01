# A1 Daily Reliability Observe

## CORTEX_RUN_HEADER
- **Cortex**: aegis-cortex
- **Host Repository**: zero-entropy-lab
- **Task ID**: A1
- **Cadence**: Daily
- **Loop Stage**: Observe
- **Logical Date**: 2026-08-02
- **Execution Time UTC**: 2026-08-01 23:32:30
- **Execution Time Asia/Shanghai**: 2026-08-02 07:32:30
- **Agent**: Jules
- **Knowledge Source**: External Web + aegis-cortex local files
- **Network Status**: NETWORK_VERIFIED
- **Source Status**: SOURCES_VERIFIED
- **Task Status**: COMPLETED
- **Repository Inspection**: NO
- **GitHub Actions Inspection**: NO
- **Write Scope**: aegis-cortex only
- **Boundary Violation**: NO

## INPUT_RECORD
记录本次读取了哪些 aegis-cortex 文件:
- aegis-cortex/2026-08-01-A1-reliability-observe.md
- aegis-cortex/2026-08-01-A2-doctrine-orient.md
- aegis-cortex/2026-W31-A4-protocol-act.md
- aegis-cortex/2026-07-A6-aegis-memorize.md

记录本次联网搜索了哪些主题:
- "AI Agent" "memory poisoning" attack OR research

观察原因:
针对 A4 (W31) 和 A6 (07) 强调的记忆毒化 (memory poisoning risk) 与持续性的代理评估需求，深入观察业界针对该失效模式的最新系统性研究及分类（如 MPBench 等），作为未来制定更精确边界及轻量级审计机制的依据。

A4 和 A6 当前重点:
- A4(W31): 建立轻量级记忆完整性审计机制，引入来源追踪字段，区分可恢复操作和不可逆操作。
- A6(07): 关注记忆漂移风险、记忆中毒风险，并在基线中指明优先观察针对记忆中毒的补救与防御研究。

未取得可靠证据的方向:
- 无。

## EXTERNAL_SOURCE_RECORDS

- **Source ID**: SRC-2026-08-02-01
- **Title**: From Untrusted Input to Trusted Memory: A Systematic Study of Memory Poisoning Attacks in LLM Agents
- **Publisher**: arXiv (Cornell University)
- **URL**: https://arxiv.org/html/2606.04329v1
- **Published or Updated Date**: 2026-06-03
- **Date Checked**: 2026-08-02
- **Source Type**: Original research
- **Evidence Tier**: Tier 1
- **Access Status**: ACCESSED
- **Independent Source**: YES
- **External Claim**: 记忆中毒攻击利用了 Agent 的长时记忆机制，通过明确指令写入、系统提示驱动写入、推断和技能提取等机制，将恶意指令持久化存储，并在跨会话中持续影响代理。现有的提示注入防御 (prompt injection defenses) 无法覆盖弱信号的记忆中毒攻击。
- **Local Evidence Available YES or NO**: NO
- **Relevance**: Memory poisoning / Tool-use errors
- **Confidence**: High
- **Limitations**: 在特定的实验台 (MPBench) 和固定模型下进行测试，具体的漏洞利用情况依智能体的长期内存综合机制而异。

- **Source ID**: SRC-2026-08-02-02
- **Title**: OWASP Agent Memory Guard: Block AI Memory Poisoning Attacks
- **Publisher**: Kiteworks (Security Vendor Blog)
- **URL**: https://www.kiteworks.com/cybersecurity-risk-management/owasp-agent-memory-poisoning-guard/
- **Published or Updated Date**: 2026
- **Date Checked**: 2026-08-02
- **Source Type**: Vendor marketing / independent technical analysis
- **Evidence Tier**: Tier 4
- **Access Status**: ACCESSED
- **Independent Source**: YES
- **External Claim**: OWASP ASI06 分类明确将记忆中毒与提示注入分离，攻击跨越会话边界并在外部存储（如 RAG 索引或草稿本）中持久化，提示需要基于源的可见性进行保护。
- **Local Evidence Available YES or NO**: NO
- **Relevance**: Memory poisoning
- **Confidence**: Medium
- **Limitations**: 为安全厂商营销通稿，缺乏深度的独立实验验证数据，仅可作为安全趋势佐证。

## RAW_RELIABILITY_SIGNAL_LOG

- **Signal ID**: SIG-2026-08-02-01
- **Signal**: Prompt injection defenses failure against memory poisoning
- **Source IDs**: SRC-2026-08-02-01
- **Failure Mode Addressed**: Memory poisoning / Prompt drift
- **External Evidence**: 基于 MPBench 的研究表明，传统的 Prompt Injection 拦截方案对“弱信号”的记忆中毒攻击（如合规事实注入、伪造先例插入）表现差。当攻击内容在语义上与合法知识无法区分时，拦截率大幅下降。
- **Local Repository Evidence**: NONE
- **Why It May Matter**: 说明如果在 Aegis 循环中仅依赖于输入过滤将无法防止伪造事实被写入长期纪律记忆，强调了 A4 制定的“附带来源追踪和轻量级审计机制”极为关键。
- **Confidence**: High
- **Uncertainty**: Aegis-Cortex 当前未建立复杂的自治程序综合机制，部分高级记忆中毒途径暂无本地适用性。
- **Possible Noise**: Low
- **Needs A2 Verification**: YES

- **Signal ID**: SIG-2026-08-02-02
- **Signal**: Persistent Compromise via Inferred Write Channels
- **Source IDs**: SRC-2026-08-02-01
- **Failure Mode Addressed**: Memory poisoning / Tool authorization
- **External Evidence**: 不基于明确指令的“推理写入”（如触发总结压实、系统提示符模糊指引）更易遭到弱信号攻击。由于缺乏在写入路径 (write-path) 上的源隔离，外部恶意内容会被代理自行认定为“相关信息”并被记录。
- **Local Repository Evidence**: NONE
- **Why It May Matter**: 我们的 A6 (Monthly Aegis Memorize) 过程本质上类似于“总结压实” (Compaction-Driven Write)，存在因处理大量含有外部知识的数据，进而将污染信息误认为局部真理的风险。
- **Confidence**: High
- **Uncertainty**: 我们的 A5/A6 强调明确的网络证据比对，要求分离外部与本地证据，这可能已经构成了初步的防护。
- **Possible Noise**: Low
- **Needs A2 Verification**: YES

## NEXT_HANDOFF

需要 A2 定向解释的风险:
- Prompt injection defenses failure (SIG-2026-08-02-01) 和 Persistent Compromise via Inferred Write Channels (SIG-2026-08-02-02) 需要被定向评估其对 Aegis-Cortex 记忆压缩周期的具体理论影响。

需要独立来源验证的风险:
- 无。主要研究基于学术基准测试，属第一梯队（Tier 1）独立证据。

缺乏本地证据的风险:
- 上述信号目前无 Aegis 具体故障事件记录作为本地证据 (NO_LOCAL_EVIDENCE)。外部攻击理论尚无证明其已在实际内部任务中发生。

可能只是噪音的内容:
- 厂商营销内容（OWASP Agent Memory Guard，SRC-2026-08-02-02）无须独立采纳为行动指引。

不应继续升级的内容:
- Tier 4 来源文章（Kiteworks）内容不可单独用于支持 High Confidence 的可靠性主张。

联网限制:
- 搜索与查阅完整顺利完成，无限制。

## BOUNDARY_CHECK
- 确认未读取宿主仓库代码、GitHub Actions 配置文件、旧 Nexus 文件及任何非 aegis-cortex/** 目录文件。
- 确认没有把外部风险声明为 aegis-cortex 已经发生的本地事实，Local Repository Evidence 已标注为 NONE。
- 确认未公开私有控制内容。
