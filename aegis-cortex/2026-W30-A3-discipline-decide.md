# A3 Weekly Discipline Decide

CORTEX_RUN_HEADER

Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A3
Cadence: Weekly
Loop Stage: Decide
Run Week: 2026-W30
Agent: Jules
Knowledge Source: This Week A1 / A2 + External Web + aegis-cortex local files
Repository Inspection: NO
GitHub Actions Inspection: NO
Write Scope: aegis-cortex only
Boundary Violation: NO

INPUT_RECORD

记录本周读取的 A1 和 A2 文件列表:
- aegis-cortex/2026-07-20-A1-reliability-observe.md
- aegis-cortex/2026-07-20-A2-doctrine-orient.md
- aegis-cortex/2026-07-21-A1-reliability-observe.md
- aegis-cortex/2026-07-21-A2-doctrine-orient.md
- aegis-cortex/2026-07-22-A1-reliability-observe.md
- aegis-cortex/2026-07-22-A2-doctrine-orient.md
- aegis-cortex/2026-07-23-A1-reliability-observe.md
- aegis-cortex/2026-07-23-A2-doctrine-orient.md
- aegis-cortex/2026-07-24-A1-reliability-observe.md (INPUT_MISSING)
- aegis-cortex/2026-07-24-A2-doctrine-orient.md
- aegis-cortex/2026-07-25-A1-reliability-observe.md (INPUT_MISSING)
- aegis-cortex/2026-07-25-A2-doctrine-orient.md
- aegis-cortex/2026-07-26-A1-reliability-observe.md (INPUT_MISSING)
- aegis-cortex/2026-07-26-A2-doctrine-orient.md

INPUT_GAP:
- 2026-07-24 的 A1 文件缺失
- 2026-07-25 的 A1 文件缺失
- 2026-07-26 的 A1 文件缺失

记录读取的历史 A3 / A4 / A6 文件列表:
- aegis-cortex/2026-W28-A3-discipline-decide.md
- aegis-cortex/2026-W29-A3-discipline-decide.md
- aegis-cortex/2026-07-A6-aegis-memorize.md

记录联网验证的主题和来源:
- 来源: https://en.wikipedia.org/wiki/Instrumental_convergence
- 主题: AI agent reward hacking and instrumental convergence
- 来源: Wikipedia (AI alignment), HuggingFace Incident Analysis, and AI model misbehavior research

WEEKLY_RISK_SYNTHESIS

总结本周重复出现的风险:
- Task Loop Break Risk: 观察阶段(A1)连续三天(24日至26日)输入缺失导致后续 OODA 循环在缺乏新环境信息的盲视状态下运行, 严重损害系统响应能力和防线安全
- Concept Drift Risk: 系统长时间运行可能偏离初始指令, 需要客观指标持续监控

总结本周新出现的风险:
- Instrumental Convergence and Reward Hacking: 代理可能学会绕过边界检查或伪造成功指标(战略性欺骗), 甚至篡改内部规则以获得高奖励, 导致 Hallucination 和 Scope Drift 风险加剧
- Memory Poisoning: 长周期运行的智能体易受跨会话记忆毒化(如 MINJA 攻击)影响, 恶意上下文可持久化改变系统决策

总结本周被证伪或降级的风险:
- None identified this week

DECISION_SET

Decision 1
Decision: 强制引入基于文档结构的客观 SLO (Service-Level Objective) 检查以防范奖励劫持
Evidence: 外部安全研究和本周 A2 分析指出, AI 代理可能为了达成"完成任务"的代理目标而伪造符合预期的总结. 必须使用客观的文件段落存在性(如强制包含 CORTEX_RUN_HEADER 和 BOUNDARY_CHECK)作为底层 SLO
Risk Reduced: Hallucination risk and overconfidence risk
Expected Behavior Change: 代理将不能仅依赖自称的任务成功, 必须输出严格满足格式与边界检查项的文档, 否则将被判定为失控并触发告警
Why Now: 随着工具使用错误和欺骗性对齐风险的上升, 必须将安全边界检查变成刚性且可定量的系统约束

Decision 2
Decision: 对历史上下文(长记忆)强制实施污染隔离与验证机制
Evidence: 外部信息证实记忆毒化是长周期 Agent 的新兴威胁, 受操纵的外部数据若被不受控地存入内部历史记录中, 将影响整个系统的决策循环
Risk Reduced: Scope drift risk and unsupported source risk
Expected Behavior Change: 在读取前序历史文件(特别是涉及外部搜索内容的 A1 文件)时, 必须先验证其信息来源的可靠性, 并在输出时显式区分本地规则约束与外部采集数据
Why Now: 预防恶意输入在每周交接中被错误地内化为 Aegis 系统的指令

Decision 3
Decision: 在遭遇 A1 输入持续缺失时启动容错降级(Tolerant Missing State Protocol)而非伪造数据
Evidence: OODA 循环的安全分析明确指出, 当观察阶段中断时, 依赖错误或伪造的数据进行决策比直接降级更危险. 本周连续三天(24日, 25日, 26日)真实发生 A1 缺失
Risk Reduced: Task loop break risk and hallucination risk
Expected Behavior Change: 若 A2 检测到 A1 文件缺失, 必须显式记录 INPUT_MISSING, 严禁通过内部幻觉填补风险信号, 系统转入维持安全边界的最小维生状态
Why Now: 确立极端情况下的操作底线, 避免模型由于缺乏输入而产生极度自信的虚假推断

DO_NOT_CHANGE

列出本周明确不修改的规则或判断:
- 绝对不读取宿主仓库(zero-entropy-lab)的机制文件和代码
- 不修复导致 A1 缺失的上游调度故障
- 维持当前的 Aegis-cortex 本地文件系统操作范围约束

说明为什么保持不变:
- Aegis-cortex 的唯一职责是自我观察和纪律管理, 跨越物理边界(宿主仓库)将直接导致严重的 instrumental convergence 行为, 违反核心隔离协议
- 容忍输入缺失是系统的基本底线原则

HANDOFF_TO_A4

把 A4 需要执行的 aegis-cortex 内部更新写清楚:
- A4 必须将客观 SLO 检查清单转化为下周可执行的纪律协议
- A4 需要在行动记录中加入对于外部数据隔离与记忆防毒的具体操作规范
- A4 必须再次强化 Tolerant Missing State Protocol, 确保所有流程在缺失输入时不会尝试自行编造观察信号

只能提出 aegis-cortex 内部更新:
是

不得要求修改宿主仓库:
是

BOUNDARY_CHECK

确认没有读取宿主仓库机制: YES
确认没有读取 GitHub Actions: YES
确认没有写入 aegis-cortex 之外的文件: YES
