# A1 Daily Reliability Observe

## CORTEX_RUN_HEADER

- **Cortex**: aegis-cortex
- **Host Repository**: zero-entropy-lab
- **Task ID**: A1
- **Cadence**: Daily
- **Loop Stage**: Observe
- **Logical Date**: 2026-08-06
- **Execution Time UTC**: 2026-08-05 23:45:00
- **Execution Time Asia/Shanghai**: 2026-08-06 07:45:00
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

记录实际读取文件:
- aegis-cortex/2026-08-05-A1-reliability-observe.md
- aegis-cortex/2026-08-05-A2-doctrine-orient.md
- aegis-cortex/2026-W31-A4-protocol-act.md
- aegis-cortex/2026-07-A6-aegis-memorize.md

搜索主题:
"LLM agent" "memory poisoning"

观察原因:
执行每日 Observe 阶段，寻找外部关于 Coding Agent, Memory poisoning, False completion 等相关的最新风险信号。

A4 和 A6 当前重点:
- A4 (2026-W31) 关注在零依赖架构下建立轻量级记忆完整性审计机制，扩展 Tolerant Missing State Protocol。
- A6 (2026-07) 关注基于外部 MINJA 攻击研究的 Tolerant Missing State Protocol，以显式记录缺失状态并防止外部记忆中毒。

未取得可靠证据的方向:
初次搜索 "Coding agent failure modes" OR "AI Agent memory poisoning" OR "Agent false completion" 时未找到高质量结果，调整搜索策略后成功验证新文献。

## EXTERNAL_SOURCE_RECORDS

- **Source ID**: SRC-2026-08-06-01
- **Title**: From Untrusted Input to Trusted Memory: A Systematic Study of Memory Poisoning Attacks in LLM Agents
- **Publisher**: arXiv
- **URL**: https://arxiv.org/html/2606.04329v1
- **Published or Updated Date**: 2026-06-03
- **Date Checked**: 2026-08-06
- **Source Type**: Original research
- **Evidence Tier**: Tier 1
- **Access Status**: NETWORK_VERIFIED
- **Independent Source**: YES
- **External Claim**: Agent 长期记忆易受多渠道（显式指令、系统提示词驱动、历史压缩等）的记忆中毒攻击。特别是 Weak-signal attacks（弱信号攻击，如 Policy Conformant Fact Injection），因其不含显式写命令，能伪装成合法的知识事实，成功绕过现有的 Prompt Injection 防御，导致持续的记忆毒化。
- **Local Evidence Available YES or NO**: YES
- **Relevance**: 极高。涉及 Memory poisoning, Memory compression, False completion 风险，直接关乎长周期 Agent 记忆机制安全。
- **Confidence**: High
- **Limitations**: 该研究主要通过基准测试 (MPBench) 在 OpenClaw 和 HERMES 代理上进行验证，未针对 Aegis 纯后台的 Markdown 记录编排机制进行专门攻击实测。

## RAW_RELIABILITY_SIGNAL_LOG

- **Signal ID**: SIG-2026-08-06-01
- **Signal**: Weak-signal 类型的记忆中毒攻击（如策略一致的事实注入）能够避开常规注入检测，成功实现长周期记忆毒化。
- **Source IDs**: SRC-2026-08-06-01
- **Failure Mode Addressed**: Memory poisoning, Memory compression
- **External Evidence**: arXiv:2606.04329v1 表明，攻击者可以提供不包含显式指令的看似合理的内容。在系统进行记忆压缩或依赖策略判定保存相关信息时，由于缺乏信源隔离，恶意知识会被写入长期记忆。
- **Local Repository Evidence**: SUPPORTED_BY_AEGIS_RECORD。Aegis 维护 A1-A6 的持久化纯文本记忆，尤其在 A3、A5 和 A6 阶段会发生类似于“系统提示词驱动 (System prompt-driven write)”和“历史压缩 (Compaction-driven write)”的操作。如果外部输入的网页内容表面上伪装成正常的可靠性事实，其被写入后有可能破坏纪律决策系统。W31 的 A4 虽记录了轻量级记忆完整性审计机制，但可能不足以防范无显式命令的弱信号注入。
- **Why It May Matter**: Aegis 每个月需要压缩长周期记忆。若不加防范地在 A1 阶段引入无异常痕迹的虚假“合法事实”，这些毒化记忆将在未来的 A5 甚至 A6 中被固化为本地纪律要求。
- **Confidence**: High
- **Uncertainty**: 目前 Aegis 依靠显式隔离（External Evidence 与 Local Evidence 分离）防御。不确定单纯的文本字段分离是否足以抵御大模型在复杂语境下对弱信号内容的自然采信。
- **Possible Noise**: 论文中针对的是具备操作流程记忆和自主探索的通用 Agent，Aegis 是专为后端可靠性循环设计的有限权限读写系统，攻击载荷的执行空间不同。
- **Needs A2 Verification**: YES

## NEXT_HANDOFF

需要 A2 定向解释的风险:
- Weak-signal（弱信号）记忆中毒攻击风险（SIG-2026-08-06-01）。需评估当外部恶意输入不带任何强制指令，而是伪装成本地的纪律规范或合理事实时，系统如何防范其进入长期纪律记忆（A6）。

需要独立来源验证的风险:
- 无。

缺乏本地证据的风险:
- 无。

可能只是噪音的内容:
- 无。

不应继续升级的内容:
- 无。

联网限制:
- 在第一次搜索时无法找到高质量结果，调整关键词为 "LLM agent" "memory poisoning" 后成功。

## BOUNDARY_CHECK

- 确认未读取宿主仓库、GitHub Actions、旧 Nexus 和 Aegis 之外文件: YES
- 确认未把外部风险声明为本地发生的事实: YES
- 确认未公开私有控制内容: YES