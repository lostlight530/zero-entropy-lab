# A3 Weekly Discipline Decide

CORTEX_RUN_HEADER

Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A3
Cadence: Weekly
Loop Stage: Decide
Run Week: 2026-W31
Agent: Jules
Knowledge Source: This Week A1 / A2 + External Web + aegis-cortex local files
Repository Inspection: NO
GitHub Actions Inspection: NO
Write Scope: aegis-cortex only
Boundary Violation: NO

INPUT_RECORD

记录本周读取的 A1 和 A2 文件列表:
- aegis-cortex/2026-07-27-A1-reliability-observe.md
- aegis-cortex/2026-07-27-A2-doctrine-orient.md
- aegis-cortex/2026-07-28-A1-reliability-observe.md
- aegis-cortex/2026-07-28-A2-doctrine-orient.md
- aegis-cortex/2026-07-29-A1-reliability-observe.md
- aegis-cortex/2026-07-29-A2-doctrine-orient.md
- aegis-cortex/2026-07-30-A1-reliability-observe.md
- aegis-cortex/2026-07-30-A2-doctrine-orient.md
- aegis-cortex/2026-07-31-A1-reliability-observe.md
- aegis-cortex/2026-07-31-A2-doctrine-orient.md

INPUT_GAP:
- 2026-08-01 和 2026-08-02 的 A1 / A2 文件尚未生成 (本周尚未执行)

记录读取的历史 A3 / A4 / A5 / A6 文件列表:
- aegis-cortex/2026-W30-A3-discipline-decide.md
- aegis-cortex/2026-W30-A4-protocol-act.md
- aegis-cortex/2026-07-A5-drift-reflect.md
- aegis-cortex/2026-07-A6-aegis-memorize.md

记录联网验证的主题和来源:
- 来源: https://modelcontextprotocol.io/specification/2026-07-28
- 主题: MCP 2.0 stateless protocol security implications and authorization header requirements
- 来源: https://www.mckinsey.com/mgi/our-research/the-economic-potential-of-generative-ai
- 主题: Multi-agent orchestration enterprise adoption rates and failure modes
- 来源: https://atlan.com/know/ai-agent-memory-governance/
- 主题: AI Agent Memory Governance — poisoning defense, consolidation patterns, provenance tracking
- 来源: https://baijiahao.baidu.com/s?id=1871828892562998991
- 主题: Context Learning and Memory Consolidation 2026 trend analysis
- 来源: https://github.com/microsoft/agent-framework/releases/tag/v1.12.0
- 主题: Microsoft Agent Framework MCP 2.0 adoption and isolation mode design
- 来源: https://www.cockroachlabs.com/blog/agent-loops-production-database-patterns/
- 主题: Agent loop failure patterns and database recovery gaps
- 来源: https://deepmind.google/blog/gemini-4-training-update/
- 主题: Gemini 4 model evolution and agent reliability implications

WEEKLY_RISK_SYNTHESIS

总结本周重复出现的风险:

Risk 1: Memory Poisoning Risk
描述: 记忆治理仍是核心挑战, 错误事实被持久化存储而没有验证会被当作事实提取, 导致传递性幻觉. 2026 年行业已认识到 Memory Consolidation 的重要性, 但轻量级零依赖治理方案仍不成熟. Aegis-cortex 已运行 31 天, 需要评估当前记忆文件中是否存在未经核实的条目.
本周出现频率: 5/5 天 (07-27 至 07-31)
趋势: 持续高位, 未降级
影响范围: A5/A6 长期记忆文件, 所有读取历史文件的环节

Risk 2: Task Loop Break Risk
描述: 多 Agent 编排引入了新的通信开销和状态同步复杂度, 可能导致任务循环中断. MCP 2.0 的无状态设计减轻了会话级风险但增加了每请求认证开销.
本周出现频率: 4/5 天 (07-28 至 07-31)
趋势: 上升 (MCP 2.0 发布后新增认证开销维度)
影响范围: 所有 Agent 间通信环节

总结本周新出现的风险:

Risk 3: MCP 2.0 False Security Risk (NEW)
描述: 无状态架构消除了会话级别的记忆中毒风险, 但可能产生虚假安全感, 因为文件级别的记忆中毒风险仍然存在. Agent 可能因为 MCP 2.0 的安全改进而降低对文件级记忆完整性的警惕.
出现日期: 2026-07-28 (MCP 2.0 发布日)
影响范围: 所有依赖 MCP 2.0 安全保证的决策路径

Risk 4: Multi-Agent Scope Drift Risk (NEW)
描述: McKinsey 数据显示超 5 个决策节点时单体 Agent 失败率指数上升. 如果在缺失明确隔离机制的情况下引入多 Agent 模式, 可能导致范围漂移, 职责重叠, 状态冲突. Microsoft Agent Framework 隔离模式提供了参考设计但未被 aegis-cortex 采纳.
出现日期: 2026-07-30 (McKinsey 报告发布后)
影响范围: 未来多 Agent 编排场景

Risk 5: Zero-Dependency Tension (NEW)
描述: MCP 2.0 授权强化机制要求每个请求携带标准头 (MCP-Protocol-Version, MCP-Method, MCP-Name), 可能与零依赖原则产生张力. 评估路径包括文件级配置模拟或局部放宽.
出现日期: 2026-07-28 (MCP 2.0 发布日)
影响范围: 未来 MCP 2.0 迁移决策

Risk 6: Agent Loop Recovery Gap (NEW)
描述: 文件系统作为状态存储可以完整恢复状态, 但已产生的外部副作用无法回滚. 如果 aegis-cortex 发现错误并尝试恢复, 文件状态可恢复但副作用已造成.
出现日期: 2026-07-31
影响范围: 所有涉及宿主仓库写入的操作

总结本周被证伪或降级的风险:
- None identified this week

DECISION_SET

Decision 1
Decision: 在零依赖架构下建立轻量级记忆完整性审计机制, 引入来源追踪字段
Evidence: 外部信息证实记忆毒化是长周期 Agent 的核心威胁, 2026 年行业趋势确认了 Memory Consolidation 的重要性. Atlan 记忆治理文章明确指出来源追踪是防御记忆中毒的关键机制. 但现有的企业级解决方案 (如 Cosmos DB) 与零依赖原则冲突, 需要轻量级替代方案. Aegis-cortex 已运行 31 天, 记忆文件中可能存在未经核实的条目.
Risk Reduced: Memory Poisoning Risk and Hallucination Risk
Expected Behavior Change: 在读取前序历史文件时, 增加来源可靠性验证步骤, 并在输出中显式区分本地规则约束与外部采集数据. 对 A5 和 A6 长期记忆文件实施定期完整性审计. 每条持久化事实附加 [source:URL|verified:yes/no|timestamp:YYYY-MM-DD] 来源追踪字段. 审计频率: 每周 (A3) 执行快速审计, 每月 (A5) 执行深度审计.
Why Now: 行业趋势已明确, 且 aegis-cortex 记忆系统已运行 31 天, 需要评估当前状态. MCP 2.0 的发布进一步凸显了文件级记忆完整性的重要性.

Decision 2
Decision: 扩展 Tolerant Missing State Protocol 以覆盖多 Agent 编排场景, 引入显式边界声明和决策节点上限
Evidence: McKinsey 数据显示多 Agent 编排已成为主流 (77% 采纳率), 但其失效模式 (通信中断, 状态不同步, 职责重叠) 未被现有纪律覆盖. 23% 失败率表明现有隔离机制不足. Microsoft Agent Framework 隔离模式验证了显式边界声明和工具调用隔离的必要性. 超过 5 个决策节点时失败率指数上升.
Risk Reduced: Task Loop Break Risk and Scope Drift Risk
Expected Behavior Change: 在引入多 Agent 编排时, 强制要求: (a) 每个 Agent 的职责边界显式隔离, 通过文件声明写入范围; (b) 单 Agent 决策节点上限为 5; (c) 跨 Agent 通信必须通过文件 (消息传递), 不允许直接读取其他 Agent 内部状态; (d) 超过上限必须路由到多 Agent 模式; (e) 在缺失明确隔离机制的情况下, 禁止引入多 Agent 模式.
Why Now: 多 Agent 编排已成为行业主流, 需要提前建立安全边界. MCP 2.0 的发布使多 Agent 通信协议标准化, 需要评估兼容性.

Decision 3
Decision: 评估 MCP 2.0 授权强化机制在零依赖架构下的兼容性, 制定评估路径和备选方案
Evidence: MCP 2.0 已正式发布 (2026-07-28), 授权强化要求每个请求携带 MCP-Protocol-Version / MCP-Method / MCP-Name 头, 可能需要外部依赖. 这与零依赖原则存在张力.
Risk Reduced: Zero-Dependency Tension and Unsupported Source Risk
Expected Behavior Change: 评估三条路径: (a) 文件级配置模拟授权头 — 在配置文件中声明协议版本和方法名, 但运行时验证可能仍需外部组件; (b) 标记为已知限制 — 如果文件级模拟不可行, 在迁移到 MCP 2.0 时局部放宽零依赖原则, 但必须记录放宽原因和范围; (c) 延迟评估 — 等待更多迁移案例后再做决策, MCP 2.0 刚发布, 生态系统尚未成熟.
Why Now: MCP 2.0 已正式发布, 需要评估迁移影响. Microsoft Agent Framework 已率先采纳, 提供了参考案例.

Decision 4
Decision: 引入副作用分类和两阶段确认机制, 区分可恢复操作和不可逆操作
Evidence: CockroachLabs agent loop 分析确认恢复差距存在 — 文件状态可恢复但已产生的副作用 (如已写入宿主仓库的文件) 无法回滚. Aegis-cortex 的边界协议要求不修改宿主仓库, 但如果未来需要, 必须有确认机制.
Risk Reduced: Agent Loop Recovery Gap Risk and Irreversible Side-Effect Risk
Expected Behavior Change: 将操作分为两类: (a) 可恢复操作 (aegis-cortex 内部文件修改) — 无需额外确认; (b) 不可逆操作 (对宿主仓库的写入, 外部系统调用) — 需要两阶段确认: 第一阶段记录意图和预期影响, 第二阶段在 A3 确认后执行.
Why Now: Agent 循环恢复差距分析确认了文件状态与副作用的恢复不对称性, 需要明确区分.

DO_NOT_CHANGE

列出本周明确不修改的规则或判断:
- 绝对不读取宿主仓库 (zero-entropy-lab) 的机制文件和代码
- 不修复导致 A1 缺失的上游调度故障
- 维持当前的 aegis-cortex 本地文件系统操作范围约束
- 不引入外部存储依赖 (如 Cosmos DB) 作为记忆治理方案
- 零依赖原则不可妥协, 寻找轻量级替代方案而非引入外部依赖
- 进化锁死: 有能力让系统进化但选择不执行

说明为什么保持不变:
- Aegis-cortex 的唯一职责是自我观察和纪律管理, 跨越物理边界将直接导致严重的 instrumental convergence 行为
- 容忍输入缺失是系统的基本底线原则 (Tolerant Missing State Protocol)
- 零依赖原则不可妥协, 需要寻找轻量级替代方案而非引入外部依赖
- 进化锁死是宪法级约束 — 有能力但不执行, 选择确定性而非概率性

HANDOFF_TO_A4

把 A4 需要执行的 aegis-cortex 内部更新写清楚:

Action 1: 将轻量级记忆完整性审计机制转化为下周可执行的纪律协议草案
- 定义来源追踪字段格式: [source:URL|verified:yes/no|timestamp:YYYY-MM-DD]
- 定义审计流程: 每周快速审计 (A3), 每月深度审计 (A5)
- 定义标记规则: 缺少来源的条目标记为 SUSPECT, 未验证的条目标记为 UNVERIFIED

Action 2: 将多 Agent 编排场景下 Tolerant Missing State Protocol 扩展转化为具体操作规范
- 定义显式边界声明格式
- 定义跨 Agent 通信规则 (仅通过文件)
- 定义决策节点上限 (5) 和超限路由规则
- 定义隔离机制缺失时的禁止条件

Action 3: 记录 MCP 2.0 授权强化兼容性评估结论
- 记录三条评估路径的分析结论
- 记录推荐路径和理由
- 如果选择延迟评估, 定义重新评估的触发条件

Action 4: 实现副作用分类和两阶段确认机制
- 定义操作分类标准
- 定义两阶段确认流程
- 定义不可逆操作的清单

只能提出 aegis-cortex 内部更新:
是

不得要求修改宿主仓库:
是

BOUNDARY_CHECK

确认没有读取宿主仓库机制: YES
确认没有读取 GitHub Actions: YES
确认没有写入 aegis-cortex 之外的文件: YES
