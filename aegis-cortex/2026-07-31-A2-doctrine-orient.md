# A2 Daily Doctrine Orient

CORTEX_RUN_HEADER

Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A2
Cadence: Daily
Loop Stage: Orient
Run Date: 2026-07-31
Agent: Jules
Knowledge Source: A1 signals + aegis-cortex local files
Repository Inspection: NO
GitHub Actions Inspection: NO
Write Scope: aegis-cortex only
Boundary Violation: NO

INPUT_RECORD

记录本次读取了哪些 aegis-cortex 文件:
- aegis-cortex/2026-07-31-A1-reliability-observe.md
- aegis-cortex/2026-07-30-A1-reliability-observe.md
- aegis-cortex/2026-07-30-A2-doctrine-orient.md
- aegis-cortex/2026-W30-A3-discipline-decide.md
- aegis-cortex/2026-W30-A4-protocol-act.md
- aegis-cortex/2026-07-A5-drift-reflect.md
- aegis-cortex/2026-07-A6-aegis-memorize.md

A1 信号摘要:
1. MCP 2.0 无状态架构发布 — 消除会话级记忆中毒但文件级风险持续存在
2. Gemini 4 训练确认 — 模型持续演进, 可能改变可靠性基础假设
3. 多智能体编排主流化 — 77% 采纳率, 23% 失败率, 隔离机制不足
4. Microsoft Agent Framework 1.12.0 — 首个正式采纳 MCP 2.0 的主要框架, 含隔离模式
5. 记忆治理研究 — 记忆中毒仍是长周期 Agent 头号威胁, 来源追踪是关键防御
6. 上下文学习趋势 — 深度记忆与轻量级方案之间存在张力, 零依赖方案不成熟
7. 零依赖张力 — MCP 2.0 授权头可能与零依赖原则冲突
8. Agent 循环恢复差距 — 文件状态可恢复但副作用不可回滚

DOCTRINE_RELEVANCE_CHECK

Doctrine 1: Tolerant Missing State Protocol
Relevance: HIGH
Analysis: MCP 2.0 无状态架构验证了 Tolerant Missing State Protocol 的设计哲学 — 无状态化现在已是行业标准. 然而协议必须扩展以覆盖多智能体编排场景, 其中 Agent 间的状态同步成为新的失效模式. McKinsey 数据显示 77% 企业已采纳多智能体, 现有协议仅覆盖单 Agent 状态容差, 存在覆盖盲区. 具体扩展方向: 每个 Agent 必须有显式声明的边界, 跨 Agent 通信必须是无状态的, 单 Agent 决策节点上限建议为 5 (基于 McKinsey 失败率数据).

Doctrine 2: Memory Integrity Self-Audit
Relevance: HIGH
Analysis: 记忆治理研究确认记忆中毒为头号威胁. 当前自审计机制检查不一致性但不追踪来源, 这是一个关键缺陷. 每个持久化的事实应记录其来源 URL, 验证状态和时间戳. 自审计应标记缺少来源的条目为可疑. 在零依赖约束下, 来源追踪可以通过在文件中增加 provenance 字段实现, 而非引入外部数据库. 具体格式建议: 每条事实记录附加 [source:URL|verified:yes/no|timestamp:YYYY-MM-DD].

Doctrine 3: Boundary Isolation Protocol
Relevance: HIGH
Analysis: 多智能体采纳趋势表明边界隔离将变得越来越重要. Microsoft Agent Framework 的隔离模式提供了参考设计: 显式边界声明, 工具调用隔离, 跨 Agent 通信通过消息而非共享状态. 当前单 Agent 边界协议需要扩展为: (1) 每个 Agent 显式声明其写入范围; (2) 跨 Agent 通信必须通过文件 (消息传递), 不允许直接读取其他 Agent 的内部状态; (3) 设置最大决策节点数防止范围漂移.

Doctrine 4: Zero-Dependency Principle
Relevance: HIGH
Analysis: MCP 2.0 授权头 (MCP-Protocol-Version, MCP-Method, MCP-Name) 产生零依赖张力. 评估路径: (a) 文件级配置模拟授权头 — 可行性中等, 可以在 aegis-cortex 配置文件中声明协议版本和方法名, 但运行时验证仍需外部组件; (b) 标记为已知限制 — 如果文件级模拟不可行, 则在迁移到 MCP 2.0 时局部放宽零依赖原则, 但必须记录放宽原因和范围; (c) 延迟评估 — MCP 2.0 刚发布, 生态系统尚未成熟, 可以等待更多迁移案例后再做决策.

Doctrine 5: Consent and Control Protocol
Relevance: MEDIUM
Analysis: 多智能体场景下的同意与控制需要重新评估. 当多个 Agent 协作时, 单个 Agent 的自主行动可能影响其他 Agent 的状态. 需要引入跨 Agent 同意机制: 任何修改共享状态的行动必须经过显式确认. 但在 aegis-cortex 当前单 Agent 架构下, 此风险暂为低优先级.

RISK_ASSESSMENT

Risk 1: MCP 2.0 False Security Perception
Severity: MEDIUM
Description: 无状态架构消除了会话级记忆中毒但文件级中毒风险仍然存在. Agent 可能因为 MCP 2.0 的安全改进而降低对文件级记忆完整性的警惕, 产生虚假安全感.
Mitigation: 在 A3 中强化文件级记忆完整性审计仍然是必需的, 即使在 MCP 2.0 采纳后. 在 A4 中记录具体操作规范.
Evidence: MCP 2.0 Specification 明确指出无状态设计仅覆盖传输层, 不涉及应用层记忆管理.

Risk 2: Multi-Agent Scope Drift
Severity: HIGH
Description: 77% 采纳率意味着多智能体编排已成主流. McKinsey 数据显示超过 5 个决策节点时单体 Agent 失败率指数上升. 如果在缺失明确隔离机制的情况下引入多智能体模式, 可能导致范围漂移, 职责重叠, 状态冲突.
Mitigation: 扩展边界隔离协议, 强制要求每个 Agent 的职责边界显式隔离. 设置单 Agent 决策节点上限为 5. 超过则必须路由到多 Agent 模式.
Evidence: McKinsey 报告 23% 多智能体系统未能达到生产级可靠性; Microsoft Agent Framework 隔离模式验证了显式边界声明的必要性.

Risk 3: Zero-Dependency Tension with MCP 2.0
Severity: MEDIUM
Description: MCP 2.0 授权强化机制要求每个请求携带标准头, 可能需要外部依赖或中间件, 与零依赖原则冲突.
Mitigation: 评估文件级配置模拟方案. 如果不可行, 标记为零依赖架构的已知限制并记录迁移时的局部放宽策略.
Evidence: MCP 2.0 Specification 授权头要求; 零依赖原则不可妥协但需要兼容性评估.

Risk 4: Memory Poisoning in Long-Running Agent
Severity: HIGH
Description: Aegis-cortex 已运行 31 天. 记忆治理研究确认记忆中毒是长周期 Agent 的头号威胁. 当前记忆文件中可能存在未经核实的条目, 这些条目会被后续读取时当作事实, 导致传递性幻觉.
Mitigation: 实施定期完整性审计, 标记可疑或未验证条目. 引入来源追踪机制, 每条事实记录附加来源 URL 和验证状态.
Evidence: Atlan 记忆治理文章确认记忆中毒为头号威胁; A5/A6 文件已运行 31 天, 需要评估审计频率.

Risk 5: Agent Loop Recovery Gap
Severity: MEDIUM
Description: 文件系统作为状态存储可以完整恢复状态, 但已产生的外部副作用 (如已写入宿主仓库的文件) 无法回滚. 如果 aegis-cortex 发现错误并尝试恢复, 文件状态可恢复但副作用已造成.
Mitigation: 明确区分可恢复状态 (aegis-cortex 内部文件) 和不可逆副作用 (对宿主仓库的写入). 对于不可逆操作, 引入两阶段确认机制.
Evidence: CockroachLabs agent loop 分析确认恢复差距存在.

DOCTRINE_UPDATE_PROPOSALS

Proposal 1: Extend Tolerant Missing State Protocol with Multi-Agent Coverage
Current State: 协议仅覆盖单 Agent 状态容差.
Proposed Change: 新增多智能体状态同步规则 — (a) 每个 Agent 必须有显式声明的写入范围; (b) 跨 Agent 通信必须通过文件 (消息传递), 不允许直接读取其他 Agent 内部状态; (c) 单 Agent 决策节点上限为 5; (d) 超过上限必须路由到多 Agent 模式.
Justification: McKinsey 数据显示 77% 多智能体采纳率; 23% 失败率表明现有隔离机制不足. Microsoft Agent Framework 隔离模式验证了显式边界声明和工具调用隔离的必要性.
Impact: A3 应起草扩展草案; A4 应记录操作规范和执行条件.

Proposal 2: Add Provenance Tracking to Memory Integrity Self-Audit
Current State: 自审计检查不一致性但不追踪来源.
Proposed Change: 每个持久化事实必须附加来源追踪字段: [source:URL|verified:yes/no|timestamp:YYYY-MM-DD]. 自审计应标记缺少来源的条目为可疑. 审计频率建议: 每周一次 (在 A3 中执行), 每月深度审计 (在 A5 中执行).
Justification: 记忆治理研究确认来源追踪是防御记忆中毒的关键机制. Aegis-cortex 已运行 31 天, 需要评估当前记忆文件中未经核实的条目.
Impact: A3 应定义来源追踪格式和审计流程; A4 应实现记录协议并执行首次审计.

Proposal 3: MCP 2.0 Authorization Compatibility Assessment
Current State: 未评估 MCP 2.0 兼容性.
Proposed Change: A3 应评估文件级配置模拟授权头的可行性. 评估维度: (a) 是否可以在配置文件中声明协议版本和方法名; (b) 运行时验证是否必须依赖外部组件; (c) 如果不可行, 定义局部放宽零依赖原则的条件和范围.
Justification: MCP 2.0 已正式发布, 零依赖架构需要兼容性评估.
Impact: A3 应文档化评估结论; A4 应记录决策和后续行动.

Proposal 4: Side-Effect Classification and Two-Phase Confirmation
Current State: 无副作用分类和确认机制.
Proposed Change: 将 aegis-cortex 的操作分为可恢复 (内部文件修改) 和不可逆 (对宿主仓库的写入) 两类. 不可逆操作需要两阶段确认: (a) 第一阶段记录意图和预期影响; (b) 第二阶段在 A3 确认后执行.
Justification: Agent 循环恢复差距分析表明文件状态可恢复但副作用不可回滚.
Impact: A3 应定义操作分类标准; A4 应实现确认流程.

ORIENTATION_FOR_A3

A3 should address:
1. 起草多智能体扩展草案, 包含显式边界声明格式, 跨 Agent 通信规则, 决策节点上限
2. 定义来源追踪格式和审计流程, 包含审计频率和标记规则
3. 评估 MCP 2.0 授权头兼容性, 包含文件级模拟可行性分析和备选方案
4. 定义操作分类标准 (可恢复 vs 不可逆) 和两阶段确认流程
5. 综合本周风险趋势, 识别重复出现和新出现的风险模式

A3 should not:
- 不执行任何纪律协议修改 (属于 A4 职责)
- 不写入 aegis-cortex 之外的文件
- 不读取宿主仓库机制文件

INPUT_MISSING:
None

BOUNDARY_CHECK

Confirm no host repository mechanism read: YES
Confirm no GitHub Actions inspection: YES
Confirm no write outside aegis-cortex: YES
