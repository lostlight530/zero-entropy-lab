# A4 Weekly Protocol Act

CORTEX_RUN_HEADER

Target Week: 2026-W31
Decision Input Status: RECEIVED
Network Status: NETWORK_VERIFIED
Task Status: SUCCESS

INPUT_RECORD

记录读取的 A3 文件路径:
- aegis-cortex/2026-W31-A3-discipline-decide.md

记录读取的历史 A3 决策:
- DEC-W31-01 (Strengthen memory provenance tracking and reflection logic.)
- DEC-W31-02 (Track tool execution loop states as observability observation.)
- DEC-W31-03 (Monitor external prompt drift reports.)

记录读取的辅助 A1 / A2 文件路径:
- aegis-cortex/2026-07-27-A1-reliability-observe.md
- aegis-cortex/2026-07-27-A2-doctrine-orient.md
- aegis-cortex/2026-07-31-A1-reliability-observe.md
- aegis-cortex/2026-07-31-A2-doctrine-orient.md
- aegis-cortex/2026-08-01-A1-reliability-observe.md
- aegis-cortex/2026-08-01-A2-doctrine-orient.md
- aegis-cortex/2026-08-02-A1-reliability-observe.md
- aegis-cortex/2026-08-02-A2-doctrine-orient.md

记录读取的历史 A4 / A6 文件路径:
- aegis-cortex/2026-W29-A4-protocol-act.md
- aegis-cortex/2026-07-A6-aegis-memorize.md

记录联网复核来源:
- https://agentstatus.dev/drift-report - NETWORK_VERIFIED
- https://agentstatus.dev/blog/agent-loop-failures-beyond-http - NETWORK_VERIFIED
- https://agentstatus.dev/blog/monitoring-mcp-servers - NETWORK_VERIFIED
- https://arxiv.org/html/2606.04329v1 - NETWORK_VERIFIED
- https://www.codebridge.tech/articles/ai-memory-privacy-and-security - NETWORK_VERIFIED
- https://christian-schneider.net/blog/persistent-memory-poisoning-in-ai-agents/ - NETWORK_VERIFIED

新鲜度检查记录:
- 核心参考来源验证成功，未发现风险被证伪或只是营销声明, 官方限制未见新增变更。没有发现失效决策。

PROTOCOL_ACTION_RECORD

Action ID: ACT-W31-01
Action Type: SOURCE_REQUIREMENT
Action: 读取长期记忆与制定计划时，需更加审慎对待并溯源每一项信息的可靠程度，避免不经验证即全盘接受。
Reason: 针对 Agent 记忆系统的结构性攻击手法越发复杂，传统的基于输入的 Prompt Injection 防御体系已被证实不足以涵盖所有长周期记忆风险。
Source Decision ID: DEC-W31-01
External Evidence Preserved: arXiv 报告与 Christian Schneider 的分析指出，防止弱信号记忆投毒的最佳策略不仅是阻止输入，还需要保留来源的出处标记（provenance tagging）并在读取和反思时应用基于信任的方法。
Aegis Repository Evidence: NO_LOCAL_EVIDENCE
Expected Behavior Change: 读取长期记忆与制定计划时，需更加审慎对待并溯源每一项信息的可靠程度，避免不经验证即全盘接受。
Risk Reduced: Memory Poisoning Risk, Hallucination Risk
Validity Window: W32
Stop Condition: 当行业具有原生的文件级别记忆保护或我们引入明确的信任隔离体系。
Host Repository Change NO: YES
GitHub Actions Change NO: YES
Static Doctrine Change NO: YES

Action ID: ACT-W31-02
Action Type: WATCHLIST_CONTINUATION
Action: 记录哪些规则和指令随着执行可能失去了曾经的有效性，将其作为后续 A5 / A6 反思时的输入考量点。如果后续进行大规模连续后台计划或调用多重外部依赖，必须要求对每一步使用明确的心跳和超时断言进行校验。
Reason: 监控界最新的趋势明确了“死循环”成为生产上最大的 Agent 崩溃源。
Source Decision ID: DEC-W31-02
External Evidence Preserved: AgentStatus 分析显示传统的 HTTP 状态码无法反映诸如 worker 死锁、后台任务被丢弃和无限规划循环等故障。
Aegis Repository Evidence: NO_LOCAL_EVIDENCE
Expected Behavior Change: 如果后续进行大规模连续后台计划或调用多重外部依赖，必须要求对每一步使用明确的心跳和超时断言进行校验，而不是仅仅等待工具反馈。
Risk Reduced: Task Loop Break Risk, False Completion Risk
Validity Window: W32
Stop Condition: 当所有关键外部执行皆转为强事务状态存储后。
Host Repository Change NO: YES
GitHub Actions Change NO: YES
Static Doctrine Change NO: YES

Action ID: ACT-W31-03
Action Type: WATCHLIST_CONTINUATION
Action: 开始记录哪些规则和指令随着执行可能失去了曾经的有效性，将其作为后续 A5 / A6 反思时的输入考量点。
Reason: AgentStatus 报告展示出由于输入分布漂移或隐式模型更新发生答案正确性的非线性下降发生的大规模性和普遍性。
Source Decision ID: DEC-W31-03
External Evidence Preserved: 88% 的代理在 30 天内由于输入分布漂移或隐式模型更新发生答案正确性的非线性下降。
Aegis Repository Evidence: NO_LOCAL_EVIDENCE
Expected Behavior Change: 开始记录哪些规则和指令随着执行可能失去了曾经的有效性，将其作为后续 A5 / A6 反思时的输入考量点。
Risk Reduced: Stale Doctrine Risk, Overconfidence Risk
Validity Window: W32
Stop Condition: 构建出稳定的对抗性测试框架后。
Host Repository Change NO: YES
GitHub Actions Change NO: YES
Static Doctrine Change NO: YES

NEXT_WEEK_OPERATING_NOTES

写给 A1、A2、A3:

优先观察风险:
- 记忆毒化风险 (Memory Poisoning)
- 代理循环失效风险 (Task Loop Break)
- 提示词漂移风险 (Prompt Drift)

验证要求:
- 针对外部报告和研究进行定期联网查证，以验证其新鲜度和时效性。

优先来源:
- arXiv, Christian Schneider, AgentStatus, Codebridge。

应避免的幻觉:
- 未经验证不盲目接受所有外部记忆。
- 不要将无状态架构混同于免于所有记忆风险。

不得当作本地事实的外部风险:
- 代理执行循环故障等暂为观察中的外部风险。本地暂未观察到。NO_LOCAL_EVIDENCE。

缺失输入处理:
- 严格遵循 Tolerant Missing State Protocol, 记录为 INPUT_GAP。

需要继续验证的问题:
- 监控界中工具层隐式崩溃的进一步案例。

失效条件:
- 构建出稳定的对抗测试或原生级别信任防线等体系。

ACTION_LIMITS

确认未修改宿主仓库 (zero-entropy-lab)。
确认未修改 GitHub Actions 工作流文件和配置。
确认未创建静态规则文件。
确认未创建非周期文件。
确认未把临时纪律变成长期 Doctrine。

BOUNDARY_CHECK

确认完成完整边界确认: YES
- 确认没有越界检查其他外部文件。
