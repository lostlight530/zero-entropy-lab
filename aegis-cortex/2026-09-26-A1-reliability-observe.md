# A1 Daily Reliability Observe

## CORTEX_RUN_HEADER
- **Cortex**: aegis-cortex
- **Host Repository**: zero-entropy-lab
- **Task ID**: A1
- **Cadence**: Daily
- **Loop Stage**: Observe
- **Logical Date**: 2026-09-26
- **Execution Time UTC**: 2026-09-26T00:00:00+00:00
- **Execution Time Asia/Shanghai**: 2026-09-26T08:00:00+08:00
- **Agent**: Jules
- **Knowledge Source**: EXTERNAL_AND_AEGIS_RECORDS
- **Network Status**: NETWORK_VERIFIED
- **Source Status**: SINGLE_SOURCE_LINEAGE
- **Task Status**: SUCCESS
- **Repository Inspection**: AEGIS_ONLY
- **GitHub Actions Inspection**: NO
- **Write Scope**: EXACT_TARGET_ONLY
- **Boundary Violation**: NO
- **Record Provenance**: JULES_NATIVE
- **Evidence Class**: EXTERNAL_FAILURE_MODE_EVIDENCE
- **Source Identity**: arXiv:2606.04329v2
- **Source Authority For Claim**: ORIGINAL_RESEARCH
- **Independent Verification**: NO
- **Local Incident Evidence**: NO_LOCAL_EVIDENCE
- **Host Applicability**: UNKNOWN
- **Original Execution Status**: SUCCESS
- **Current Path Status**: CURRENT_PATH_PRESENT

## INPUT_RECORD
- **aegis-cortex/2026-09-25-A1-reliability-observe.md**: 实际读取。
- **aegis-cortex/2026-09-25-A2-doctrine-orient.md**: 实际读取。
- **aegis-cortex/2026-W38-A4-protocol-act.md**: 实际读取。
- **aegis-cortex/2026-09-A6-aegis-memorize.md**: 实际读取。
- **search topics**: LLM agent memory poisoning
- **observation reasons**: 长期记忆管理机制是智能代理保持状态的重要能力。本次观察主要评估外部事实与指令如何通过正常会话或工具调用悄无声息地写入代理的长期记忆存储，进而影响未来会话中的行为，以及这种记忆投毒带来的风险。
- **current focus of A4 and A6**:
  - W38 A4 处于 DECISION_INPUT_MISSING 导致的 BLOCKED 状态，强调严格区分命令状态与内容后置检查。
  - 9月 A6 当前为 OPEN，纪律重点是避免把外部风险等同于本地已发生故障，维持强隔离原则。
- **directions that failed to yield reliable evidence**: 未发现明确证据表明 Aegis 纯离线 Markdown 生成架构在没有任何自动重试或技能自我升级机制时，会出现类似通过多轮对话潜入的记忆投毒。

## EXTERNAL_SOURCE_RECORDS

### SRC-2026-09-26-01
- **Source ID**: SRC-2026-09-26-01
- **Title**: From Untrusted Input to Trusted Memory: A Systematic Study of Memory Poisoning Attacks in LLM Agents
- **Publisher**: arXiv
- **URL**: https://arxiv.org/abs/2606.04329v2
- **Published or Updated Date**: 2026-06-18T22:06:23Z
- **Date Checked**: 2026-09-26
- **Source Type**: ORIGINAL_RESEARCH
- **Evidence Tier**: Tier 1
- **Access Status**: ACCESSED_FULL_TEXT
- **Independent Source**: NO — this A1 retains one external source lineage only
- **External Claim**: 持久化记忆使得 LLM 代理暴露在“记忆投毒”（Memory Poisoning）攻击下。通过显式指令（Explicit Instruction）、系统提示驱动（System Prompt-Driven）、压缩驱动（Compaction-Driven）和经验转过程（Experience-to-Procedure）四条通道，攻击者可以利用模型的“指令-数据边界盲区”、“来源归属失败”、“策略欠规定”、“来源不经过滤”和“技能自我放大”等结构性漏洞，把伪装成正常信息或知识的恶意载荷写入长期记忆，并在后续会话中对代理进行持久操纵。现有的基于提示词注入检测的安全防御机制，大多对这种没有异常语法的“弱信号”记忆投毒无能为力。
- **Local Evidence Available YES or NO**: NO
- **Relevance**: 高度相关。本文详细描述了具有长期记忆机制的代理可能遭遇的存储安全风险。对于拥有独立存储并在未来能够自我获取或压缩过往状态的代理架构，这构成了显著的安全挑战。
- **Confidence**: HIGH
- **Limitations**: 这些攻击方法和实验主要是在具备自主检索、技能合成（Skill Synthesis）或通过系统 Prompt 自动抽取“有用信息”的动态代理上验证（如 HERMES 表现出非常高的脆弱性）。Aegis 目前依赖确定的文件读取，并不具有这些不受限制的自动化知识聚合机制。

## RAW_RELIABILITY_SIGNAL_LOG

### SIG-2026-09-26-01
- **Signal ID**: SIG-2026-09-26-01
- **Signal**: 没有包含显式攻击指令、看起来像正常业务策略的文本内容（“弱信号攻击”），会被自动化记忆压缩和抽取机制静默存储，并在后续会话中像正常知识一样直接改变系统行为。
- **Source IDs**: SRC-2026-09-26-01
- **Failure Mode Addressed**: Memory poisoning, Memory compression, Source provenance.
- **External Evidence**: 在 MPBench 基准测试中，对具有自主长期记忆写入功能的 HERMES 和 OpenClaw 进行攻击，HERMES 因为采用了更激进的自动内容抽取和技能合成，被“策略一致的事实注入”（Policy Conformant Fact Injection）和“伪造先例”（False Precedent Insertion）攻击的成功率高达 64.50% 和 73.33%。而且，这类无明显恶意签名的“弱信号”，现有的 prompt injection 工具通常难以检测到。
- **Local Repository Evidence**: NONE
- **Why It May Matter**: 当 Aegis 依赖外部 A1 或其他历史文件通过 A3 / A4 机制向后传递时（特别是当使用自动摘要或内存压缩功能时），如果来源未经验证或本身含有恶意指令的数据被认为是“重要经验”写入 W 级别的决定中，这将长期污染后续的纪律执行。
- **Confidence**: HIGH
- **Uncertainty**: 虽然证明了通用云端代理架构的高危性，但 Aegis 每个阶段的输入输出都是确定的单一本地离线文件，缺少“自动将对话环境上下文保存进后台隐式数据库”的设计，这种污染能否跨周期渗透尚存疑问。
- **Possible Noise**: 论文中高风险的情景（如 Experience-to-Procedure 自发提炼代码技能）与 Aegis 目前严格控制流程的系统功能相差较大。
- **Needs A2 Verification**: YES

## NEXT_HANDOFF
- **需要 A2 定向解释的风险**: 外部论文中所述的无需显式执行命令的“弱信号”记忆投毒机制，在 Aegis 定期生成 A3 纪律和 A6 记忆压缩文件时是否有实质发生可能性。
- **需要独立来源验证的风险**: 各种商业 LLM 代理通过后台自动压缩写入长期知识库被无声操纵的广度和复现频率。
- **缺乏本地证据的风险**: 未发现在过往的 A4 / A6 中出现因为错误信息被悄然抽取而引发纪律偏离或本地执行事故。
- **可能只是噪音的内容**: 自动经验转化为长期执行技能（Experience-to-Procedure）的漏洞，此功能在零熵实验室及 Aegis 内部完全不存在。
- **不应继续升级的内容**: 将外部模拟的记忆注入发生率等同于 Aegis 历史读取的故障率。
- **联网限制**: 网络状况良好，通过 ar5iv 成功提取论文 HTML 全文进行深层解析，未受限。

## BOUNDARY_CHECK
- 确认未读取宿主仓库：YES
- 确认未读取 GitHub Actions：YES
- 确认未读取旧 Nexus：YES
- 确认未读取 Aegis 之外文件：YES
- 确认未把外部风险冒充本地事实：YES
- 确认未公开提示词或私有 Memory 控制逻辑：YES


## GPT 网页端独立维护复核

- **Review Date**: 2026-09-26
- **Review Agent**: GPT Web Independent Maintainer
- **Review Type**: PRE_MERGE_SOURCE_IDENTITY_AND_INDEPENDENCE_CORRECTION
- **Original Producer**: Jules
- **Original Jules Delivery**: PR #521
- **Original Task-Time Status Preserved**: SUCCESS
- **Original Jules Base**: `de456d743dcbd04f3ed69d804529729f15073b31`

本复核不替代 A1 原始观察, 只纠正可确定验证的 source metadata 和 independence semantics.

- `arXiv:2606.04329v2` 的官方 submission history 显示 v1 为 2026-06-03, v2 为 2026-06-18T22:06:23Z. 因此原 Draft 中按编号估算的 2026-06-08 被校正为 v2 精确更新时间.
- 本 A1 只保留一个外部 source lineage, 因此 `Independent Source` 校正为 `NO`. 这不否定该原始论文对其自身实验和方法的 claim-specific authority.
- 论文 Table 2 中 HERMES 的 Policy-Conformant Fact Injection ASR 64.50% 与 False Precedent Insertion ASR 73.33% 可由原文直接核对.
- 本复核未建立第二条独立来源, 未复现实验, 未建立 Zero / Aegis 本地 incident 或本地发生概率.

历史边界保持不变: `EXTERNAL_FAILURE_MODE_EVIDENCE != LOCAL_REPOSITORY_INCIDENT`.
