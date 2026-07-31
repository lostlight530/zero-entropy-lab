# A4 Weekly Protocol Act

CORTEX_RUN_HEADER

Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A4
Cadence: Weekly
Loop Stage: Act
Run Week: 2026-W31
Agent: Jules
Knowledge Source: A3 decision + External Web + aegis-cortex local files
Repository Inspection: NO
GitHub Actions Inspection: NO
Write Scope: aegis-cortex only
Boundary Violation: NO

INPUT_RECORD

记录读取的 A3 文件路径:
- aegis-cortex/2026-W31-A3-discipline-decide.md

记录读取的辅助 A1 / A2 文件路径:
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

记录读取的历史 A3 / A4 / A5 / A6 文件路径:
- aegis-cortex/2026-W30-A3-discipline-decide.md
- aegis-cortex/2026-W30-A4-protocol-act.md
- aegis-cortex/2026-07-A5-drift-reflect.md
- aegis-cortex/2026-07-A6-aegis-memorize.md

记录联网复核来源:
- https://modelcontextprotocol.io/specification/2026-07-28 (MCP 2.0 specification)
- https://www.mckinsey.com/mgi/our-research/the-economic-potential-of-generative-ai (multi-agent adoption)
- https://atlan.com/know/ai-agent-memory-governance/ (memory governance)
- https://baijiahao.baidu.com/s?id=1871828892562998991 (context learning trends)
- https://github.com/microsoft/agent-framework/releases/tag/v1.12.0 (Microsoft Agent Framework)
- https://www.cockroachlabs.com/blog/agent-loops-production-database-patterns/ (agent loop failures)
- https://deepmind.google/blog/gemini-4-training-update/ (Gemini 4 training)

PROTOCOL_ACTION_RECORD

Action 1
Action: 建立轻量级记忆完整性审计机制, 引入来源追踪字段 [source:URL|verified:yes/no|timestamp:YYYY-MM-DD]
Reason: 记忆毒化是长周期 Agent 的核心威胁, 错误事实被持久化存储后会被当作事实提取, 导致传递性幻觉. Atlan 记忆治理文章明确指出来源追踪是防御记忆中毒的关键机制. Aegis-cortex 已运行 31 天, 需要评估当前记忆文件中是否存在未经核实的条目. 现有的企业级解决方案与零依赖原则冲突, 需要轻量级替代方案.
Source Decision: Decision 1 (在零依赖架构下建立轻量级记忆完整性审计机制)
Expected Behavior Change:
- 代理在读取历史文件时, 必须先验证其信息来源的可靠性, 并在输出中显式区分本地规则约束与外部采集数据
- 对 A5 和 A6 长期记忆文件实施定期完整性审计
- 每条持久化事实附加 [source:URL|verified:yes/no|timestamp:YYYY-MM-DD] 来源追踪字段
- 审计频率: 每周快速审计 (A3), 每月深度审计 (A5)
- 标记规则: 缺少来源的条目标记为 SUSPECT, 未验证的条目标记为 UNVERIFIED, 已验证的条目标记为 VERIFIED
- 审计范围: A5/A6 文件中所有持久化事实条目
- 审计输出: 在 A3 文件中记录审计结果, 标记可疑条目和建议行动
Risk Reduced: Memory Poisoning Risk and Hallucination Risk
Audit Trail: Atlan memory governance article (HIGH confidence), CockroachLabs agent loop analysis (MEDIUM confidence)
No Host Repository Change: YES

Action 2
Action: 扩展 Tolerant Missing State Protocol 以覆盖多 Agent 编排场景, 引入显式边界声明和决策节点上限
Reason: McKinsey 数据显示多 Agent 编排已成为主流 (77% 采纳率), 但 23% 失败率表明现有隔离机制不足. 超过 5 个决策节点时失败率指数上升. Microsoft Agent Framework 隔离模式验证了显式边界声明和工具调用隔离的必要性. 现有协议仅覆盖单 Agent 状态容差, 存在多 Agent 覆盖盲区.
Source Decision: Decision 2 (扩展 Tolerant Missing State Protocol 以覆盖多 Agent 编排场景)
Expected Behavior Change:
- 在引入多 Agent 编排时, 每个 Agent 的职责边界必须显式隔离
- 边界声明格式: 在 Agent 配置文件中声明 [agent_id|write_scope|max_decision_nodes:5|communication_mode:file_only]
- 单 Agent 决策节点上限为 5, 超过则必须路由到多 Agent 模式
- 跨 Agent 通信必须通过文件 (消息传递), 不允许直接读取其他 Agent 内部状态
- 在缺失明确隔离机制的情况下, 禁止引入多 Agent 模式
- 隔离机制检查清单: (a) 写入范围是否显式声明; (b) 决策节点数是否在上限内; (c) 通信方式是否为文件传递; (d) 是否存在共享状态读写
Risk Reduced: Task Loop Break Risk and Scope Drift Risk
Audit Trail: McKinsey multi-agent research (MEDIUM confidence), Microsoft Agent Framework release notes (HIGH confidence)
No Host Repository Change: YES

Action 3
Action: 记录 MCP 2.0 授权强化兼容性评估结论, 制定评估路径和备选方案
Reason: MCP 2.0 已正式发布 (2026-07-28), 授权强化要求每个请求携带 MCP-Protocol-Version / MCP-Method / MCP-Name 头, 可能需要外部依赖, 与零依赖原则存在张力. Microsoft Agent Framework 已率先采纳 MCP 2.0, 提供了参考案例.
Source Decision: Decision 3 (评估 MCP 2.0 授权强化机制在零依赖架构下的兼容性)
Expected Behavior Change:
- 评估结论: 推荐路径为 (c) 延迟评估 — MCP 2.0 刚发布, 生态系统尚未成熟, 等待更多迁移案例后再做决策
- 理由: (a) 文件级配置模拟可行性不确定, 运行时验证可能仍需外部组件; (b) 局部放宽零依赖原则应作为最后手段; (c) MCP 2.0 刚发布 3 天, 行业最佳实践尚未形成
- 重新评估触发条件: (1) Microsoft Agent Framework 发布 MCP 2.0 迁移指南; (2) 至少 3 个主要框架完成 MCP 2.0 迁移; (3) MCP 2.0 采纳率超过 30%
- 在重新评估前, 标记为零依赖架构的已知限制, 不影响当前运行
Risk Reduced: Zero-Dependency Tension and Unsupported Source Risk
Audit Trail: MCP 2.0 Specification (HIGH confidence), Microsoft Agent Framework release notes (HIGH confidence)
No Host Repository Change: YES

Action 4
Action: 引入副作用分类和两阶段确认机制, 区分可恢复操作和不可逆操作
Reason: CockroachLabs agent loop 分析确认恢复差距存在 — 文件状态可恢复但已产生的外部副作用无法回滚. 如果 aegis-cortex 发现错误并尝试恢复, 文件状态可恢复但副作用已造成. 需要明确区分两类操作并为不可逆操作引入确认机制.
Source Decision: Decision 4 (引入副作用分类和两阶段确认机制)
Expected Behavior Change:
- 操作分类标准:
  - 可恢复操作 (RECOVERABLE): aegis-cortex 内部文件修改, 包括 A1-A6 文件的创建和更新. 无需额外确认.
  - 不可逆操作 (IRREVERSIBLE): 对宿主仓库的写入, 外部系统调用, 公开通知. 需要两阶段确认.
- 两阶段确认流程:
  - 第一阶段 (INTENT): 在 A1 或 A2 中记录操作意图, 预期影响和回滚评估
  - 第二阶段 (CONFIRM): 在 A3 中确认操作, 评估风险后批准执行
  - 执行阶段 (EXECUTE): 在 A4 中执行操作, 记录结果和副作用
- 不可逆操作清单: (a) 写入宿主仓库文件; (b) 修改 GitHub Actions 配置; (c) 发送外部通知; (d) 创建或删除分支
Risk Reduced: Agent Loop Recovery Gap Risk and Irreversible Side-Effect Risk
Audit Trail: CockroachLabs agent loop analysis (MEDIUM confidence)
No Host Repository Change: YES

NEXT_WEEK_OPERATING_NOTES

下周重点观察风险:
- 继续监测记忆治理和 Memory Consolidation 的轻量级解决方案进展, 特别关注零依赖方案的成熟度
- 特别追踪多 Agent 编排在生产环境中的失效模式分类和隔离机制实践, 关注 Microsoft Agent Framework 隔离模式的实际效果
- 关注 MCP 2.0 迁移案例中的授权强化实现方式, 等待至少 3 个主要框架的迁移经验
- 监测 Gemini 4 训练进展, 评估模型演进对 Agent 可靠性模式的影响
- 关注 AI Agent 评估方法的演进, 特别是轨迹评分 (trajectory scoring) 相较于单一成功率指标的价值

下周需要避免的幻觉:
- 绝对禁止在观测数据缺失的场景下幻觉伪造观测记录
- 避免认为 MCP 2.0 无状态架构消除了所有记忆风险 — 文件级别风险仍然存在, 来源追踪和审计仍然必需
- 避免盲目引入多 Agent 模式而不评估隔离机制 — 23% 失败率表明风险仍然高
- 避免将 MCP 2.0 授权头兼容性问题简单化 — 需要完整的兼容性评估而非仓促决策
- 避免将文件级状态可恢复性等同于完全可恢复 — 副作用不可回滚

下周需要继续验证的来源类型:
- 关于 AI 代理记忆治理 (Memory Governance) 的轻量级零依赖方案 — 重点追踪 provenance tracking 的文件级实现
- 多 Agent 编排失效模式的工程实践报告 — 重点追踪 Microsoft Agent Framework 隔离模式的用户反馈
- MCP 2.0 迁移案例中的授权强化实现 — 等待至少 3 个主要框架的迁移经验
- Agent 评估方法的演进 — 关注 trajectory scoring 和 cost metrics 的标准化进展
- Agent loop 恢复差距的文件级解决方案 — 关注 file-based state recovery 的最佳实践

ACTION_LIMITS

明确说明本次没有修改宿主仓库: 本次执行过程严格控制在 aegis-cortex 目录, 未修改宿主仓库 (zero-entropy-lab) 的任何源码或机制文件

明确说明本次没有修改 GitHub Actions: 所有的 GitHub Actions 工作流文件和配置保持不变, 未发生修改

明确说明本次没有创建非周期文件: 只生成了标准的周期性文件 2026-W31-A4-protocol-act.md, 未创建任何非周期或静态规则文件

明确说明本次没有引入外部依赖: 所有审计机制和来源追踪均通过文件级字段实现, 未引入任何外部存储或中间件

BOUNDARY_CHECK

确认没有读取宿主仓库机制: YES
确认没有读取 GitHub Actions: YES
确认没有写入 aegis-cortex 之外的文件: YES
