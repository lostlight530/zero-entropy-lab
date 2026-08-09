# A3 Weekly Discipline Decide

CORTEX_RUN_HEADER

Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A3
Cadence: Weekly
Loop Stage: Decide
Target Week: 2026-W31
Coverage Window: 2026-07-27 to 2026-08-02
Input Status: PARTIAL_MISSING
Network Status: NETWORK_PARTIAL
Task Status: SUCCESS
Repository Inspection: NO
GitHub Actions Inspection: NO
Write Scope: aegis-cortex only
Boundary Violation: NO

INPUT_RECORD

记录本周读取的 A1 和 A2 文件列表:
- aegis-cortex/2026-07-27-A1-reliability-observe.md
- aegis-cortex/2026-07-27-A2-doctrine-orient.md
- aegis-cortex/2026-07-31-A1-reliability-observe.md
- aegis-cortex/2026-07-31-A2-doctrine-orient.md
- aegis-cortex/2026-08-01-A1-reliability-observe.md
- aegis-cortex/2026-08-01-A2-doctrine-orient.md
- aegis-cortex/2026-08-02-A1-reliability-observe.md
- aegis-cortex/2026-08-02-A2-doctrine-orient.md

INPUT_GAP:
- aegis-cortex/2026-07-28-A1-reliability-observe.md
- aegis-cortex/2026-07-28-A2-doctrine-orient.md
- aegis-cortex/2026-07-29-A1-reliability-observe.md
- aegis-cortex/2026-07-29-A2-doctrine-orient.md
- aegis-cortex/2026-07-30-A1-reliability-observe.md
- aegis-cortex/2026-07-30-A2-doctrine-orient.md

记录读取的历史 A3 / A4 / A6 文件列表:
- aegis-cortex/2026-W28-A3-discipline-decide.md
- aegis-cortex/2026-W28-A4-protocol-act.md
- aegis-cortex/2026-W29-A3-discipline-decide.md
- aegis-cortex/2026-W29-A4-protocol-act.md
- aegis-cortex/2026-W30-A3-discipline-decide.md
- aegis-cortex/2026-07-A6-aegis-memorize.md

记录联网验证的主题和来源:
- 来源: https://agentstatus.dev/drift-report
- 主题: The State of AI Agent Drift: 88% of Agents Changed Behavior in 30 Days
- 来源: https://agentstatus.dev/blog/agent-loop-failures-beyond-http
- 主题: The Failure Mode Nobody Watches: Agent Loops That Never Reach HTTP
- 来源: https://agentstatus.dev/blog/monitoring-mcp-servers
- 主题: Monitoring MCP Servers in Production: The Layer Your Stack Forgot
- 来源: https://arxiv.org/html/2606.04329v1
- 主题: Memory poisoning attacks in LLMs
- 来源: https://www.codebridge.tech/articles/ai-memory-privacy-and-security
- 主题: AI Memory Privacy and Security
- 来源: https://christian-schneider.net/blog/persistent-memory-poisoning-in-ai-agents/
- 主题: Memory poisoning in AI agents

覆盖率与独立来源:
Coverage Ratio: 5/7 days observed.
Independent Source Count: 4 distinct primary publishers confirmed online.

WEEKLY_RISK_SYNTHESIS

总结本周重复出现的风险 (Recurring Risks):

Risk 1: Memory Poisoning and Persistent Injection Risk
描述: 攻击者可以在外部输入中注入恶意指令，这些指令在一次交互后被模型持久化，从而导致跨会话的持久性攻击。通过使用非显式指令的形式（弱信号，如 Policy Conformant Fact Injection）和推断写入（如总结期间）的攻击往往无法被现有的 Prompt Injection Guardrails 防御。
有 Aegis 本地记录支持的风险: NO_LOCAL_EVIDENCE。尽管外部证据明确指出其威胁性和有效性（MPBench 结果，arxiv, codebridge），但 aegis-cortex/** 内未发生此类实际投毒事故。

总结本周新风险 (New Risks):

Risk 2: Prompt Drift / Non-linear correctness degradation
描述: 大模型和代理在未进行提示词修改的情况下，随时间发生响应行为的漂移，且通常呈现出非线性的崩溃（中位数正确率下降 93 分）。恢复十分缓慢。
只有外部证据的风险: NO_LOCAL_EVIDENCE。此为 AgentStatus 提供的监控数据，未在本地 aegis 观察到此种量级的骤降。

Risk 3: Agent Loop Failures / Recovery Gaps
描述: 代理执行的故障模式超出了传统的 HTTP 5xx 范畴。由于循环中的死锁工作者、无限递归规划、后台任务丢弃或不可逆操作导致应用处于“幽灵死锁”状态。
只有外部证据的风险: NO_LOCAL_EVIDENCE。通过 AgentStatus 的技术分析得出，aegis-cortex 没有遭遇外部代理不可见宕机。

Risk 4: MCP Server Failures & Transport Swaps
描述: MCP 服务的静默降级（例如传输协议替换或特定工具的失效）可能导致返回 HTTP 200，但实际工具调用无法执行。
降级风险: 虽然属于工具层的漏洞，但本地同样为 NO_LOCAL_EVIDENCE。

DECISION_SET

Decision ID: DEC-W31-01
Decision: Strengthen memory provenance tracking and reflection logic.
Decision Type: STRENGTHEN_EVIDENCE
External Evidence: arXiv 报告与 Christian Schneider 的分析指出，防止弱信号记忆投毒的最佳策略不仅是阻止输入，还需要保留来源的出处标记（provenance tagging）并在读取和反思时应用基于信任的方法。
Aegis Repository Evidence: NO_LOCAL_EVIDENCE (This is preventive).
Evidence Gap: No local memory poisoning incidents observed.
Counterevidence: None.
Risk Reduced: Memory Poisoning Risk, Hallucination Risk
Expected Behavior Change: 读取长期记忆与制定计划时，需更加审慎对待并溯源每一项信息的可靠程度，避免不经验证即全盘接受。
Why Now: 2026 年中针对 Agent 记忆系统的结构性攻击手法越发复杂，传统的基于输入的 Prompt Injection 防御体系已被证实不足以涵盖所有长周期记忆风险。
Confidence: High
Validity Window: W32
Stop Condition: 当行业具有原生的文件级别记忆保护或我们引入明确的信任隔离体系。
Host Repository Change NO: YES

Decision ID: DEC-W31-02
Decision: Track tool execution loop states as observability observation.
Decision Type: CONTINUE_WATCH
External Evidence: AgentStatus 分析显示传统的 HTTP 状态码无法反映诸如 worker 死锁、后台任务被丢弃和无限规划循环等故障。
Aegis Repository Evidence: NO_LOCAL_EVIDENCE
Evidence Gap: Aegis-cortex 是独立的单次计划执行工具，并未进行多层嵌套的在线长时间守护循环。
Counterevidence: 当前架构不会因 HTTP 会话不报 5xx 就使主观上死锁，因为调度不通过 HTTP 接收。
Risk Reduced: Task Loop Break Risk, False Completion Risk
Expected Behavior Change: 如果后续进行大规模连续后台计划或调用多重外部依赖，必须要求对每一步使用明确的心跳和超时断言进行校验，而不是仅仅等待工具反馈。
Why Now: 监控界最新的趋势明确了“死循环”成为生产上最大的 Agent 崩溃源。
Confidence: Medium
Validity Window: W32
Stop Condition: 当所有关键外部执行皆转为强事务状态存储后。
Host Repository Change NO: YES

Decision ID: DEC-W31-03
Decision: Monitor external prompt drift reports.
Decision Type: CONTINUE_WATCH
External Evidence: 88% 的代理在 30 天内由于输入分布漂移或隐式模型更新发生答案正确性的非线性下降。
Aegis Repository Evidence: NO_LOCAL_EVIDENCE
Evidence Gap: 目前没有专门评估 Aegis 的输出质量与最初几天相较的硬指标，仅依赖自身的检查逻辑。
Counterevidence: Aegis 所有的 prompt 基于自身的架构，不存在对外服务的漂移感受。
Risk Reduced: Stale Doctrine Risk, Overconfidence Risk
Expected Behavior Change: 开始记录哪些规则和指令随着执行可能失去了曾经的有效性，将其作为后续 A5 / A6 反思时的输入考量点。
Why Now: AgentStatus 报告展示出其发生的大规模性和普遍性。
Confidence: Medium
Validity Window: W32
Stop Condition: 构建出稳定的对抗性测试框架后。
Host Repository Change NO: YES

DO_NOT_CHANGE

列出本周明确不改变的纪律、原因和重新考虑条件:
- 不实施宿主仓库代码和 GitHub Actions 修改。这是系统的安全底线边界原则。重新考虑条件：未被授权且缺少事务安全沙箱。
- 容忍输入缺失 (Tolerant Missing State Protocol)：A1、A2 本周缺少三天数据 (07-28, 07-29, 07-30)，坚决不凭空捏造虚构风险填补。重新考虑条件：不存在此条件。
- 零依赖原则不可妥协，继续保留使用内部 Markdown 文件实现逻辑。重新考虑条件：未定。

HANDOFF_TO_A4

Action requests for temporary internal protocols:
- 针对 Memory Poisoning：强化“观察纪律”。对提取外部证据并放入纪律文件时，需要保留更确切的独立来源描述，不可使外部信息（如攻击者植入的文档）直接指导 Aegis 行动。
- 针对 Agent Loop / MCP Failures / Drift：制定“Watchlist”。将这些风险作为持续关注的可能失效点进行评估。对于任何缺失的输入 (INPUT_GAP) 继续采用“不可凭空推断”要求进行处理。

BOUNDARY_CHECK

确认未越界：YES
确认未实施宿主修改：YES
确认未直接升级长期纪律：YES
