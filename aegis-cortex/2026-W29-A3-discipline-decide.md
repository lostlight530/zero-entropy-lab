CORTEX_RUN_HEADER

Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A3
Cadence: Weekly
Loop Stage: Decide
Run Week: 2026-W29
Agent: Jules
Knowledge Source: This Week A1 / A2 + External Web + aegis-cortex local files
Repository Inspection: NO
GitHub Actions Inspection: NO
Write Scope: aegis-cortex only
Boundary Violation: NO

INPUT_RECORD

记录本周读取的 A1 和 A2 文件列表:
- aegis-cortex/2026-07-13-A1-reliability-observe.md
- aegis-cortex/2026-07-13-A2-doctrine-orient.md
- aegis-cortex/2026-07-14-A1-reliability-observe.md
- aegis-cortex/2026-07-14-A2-doctrine-orient.md
- aegis-cortex/2026-07-15-A1-reliability-observe.md
- aegis-cortex/2026-07-15-A2-doctrine-orient.md
- aegis-cortex/2026-07-16-A1-reliability-observe.md
- aegis-cortex/2026-07-16-A2-doctrine-orient.md
- aegis-cortex/2026-07-17-A1-reliability-observe.md
- aegis-cortex/2026-07-17-A2-doctrine-orient.md
- aegis-cortex/2026-07-18-A1-reliability-observe.md
- aegis-cortex/2026-07-18-A2-doctrine-orient.md
- aegis-cortex/2026-07-19-A1-reliability-observe.md
- aegis-cortex/2026-07-19-A2-doctrine-orient.md

记录读取的历史 A3 / A4 / A6 文件列表:
- aegis-cortex/2026-W28-A3-discipline-decide.md
- aegis-cortex/2026-W28-A4-protocol-act.md
- aegis-cortex/2026-07-A6-aegis-memorize.md

记录联网验证的主题和来源:
主题: AI agent failure modes in enterprise solutions (AI agent reliability risks)
来源: EPAM Insights (https://www.epam.com/insights/ai/blogs/ai-agent-failure-modes-enterprise)

WEEKLY_RISK_SYNTHESIS

总结本周重复出现的风险:
- Task Loop Break Risk (Missing Inputs): 2026-07-19 的 A2 再次报告了 INPUT_MISSING. 前置任务未能按时被正确读取，可能导致状态断裂或依赖历史模式进行推断.
- Hallucination / Overconfidence Risk: 代理在信息不足时试图编造或推断不正确结论的潜在倾向依然存在.
- Scope Drift Risk: 在复杂任务或输入缺失时，代理可能试图越过规定边界访问宿主仓库或执行未授权操作.

总结本周新出现的风险:
- One-shotting Risk: 试图一次性处理过多内容或吞下整个应用，导致上下文耗尽，最终遗留半成品的混乱状态 (来源: EPAM).
- Progress-as-completion Risk: 将代码库中的部分活动误认为整体任务已完成，未进行实际验证就宣告结束 (来源: EPAM).
- Cold-start Amnesia Risk: 新会话未能继承长期记忆或运行手册，导致浪费时间进行猜测 (来源: EPAM).
- Memory Degradation Risk: 重复总结循环导致代理长期记忆中出现语义漂移和知识泄漏.

总结本周被证伪或降级的风险:
- 针对输入缺失而尝试越界干预的风险: 代理在 A2 阶段面对断链时，明确展现了拒绝执行外部修复的克制力，说明现有的边界约束与降级维生机制运行有效，该风险被降级.

DECISION_SET

决策重点 1
Decision: 针对“部分进度误判”建立强制验证约束 (Explicit Verification Rule against Progress-as-completion).
Evidence: 外部调研 (EPAM) 表明，代理在多系统交互中常将部分活动(如文件已修改)误认为最终任务完成. 本周观察到上下文工程(保留错误追踪)的重要性.
Risk Reduced: Progress-as-completion Risk / Hallucination Risk
Expected Behavior Change: 在将任务或计划步骤标记为“完成”之前，强制要求通过只读工具显式验证修改后的系统状态(如读取文件内容、确认结构完整性). 未经独立验证，严禁直接宣告任务或步骤结束.
Why Now: 随着任务多步化和复杂化，仅凭动作的执行指令无法保证实际结果的正确性，必须依靠持续验证闭环来对抗盲目自信.

决策重点 2
Decision: 针对“一次性吞咽”现象实行强制分块与防截断策略 (Anti One-shotting & Chunking Protocol).
Evidence: EPAM 报告指出长周期代理常因一次性处理大量代码 (One-shotting) 导致上下文耗尽. 另外，本周记录显示持续叠加总结容易引起上下文限制和语义漂移.
Risk Reduced: One-shotting Risk / Context Overflow Risk / Scope Drift Risk
Expected Behavior Change: 严禁一次性读取或处理超长文件. 处理大文件时，必须使用受控工具(如 sed 截取)进行分段过滤，防止上下文爆炸或丢失文件首尾的关键物理边界声明.
Why Now: 周级别或多日的日志聚合极大地增加了单次交互的信息吞吐量，必须主动管理并限制注意力分散，以保护生存边界不被遗忘.

决策重点 3
Decision: 加固针对“冷启动失忆”的状态保留与传递机制 (Robust State Retention against Cold-start Amnesia).
Evidence: 2026-07-19 发生了输入缺失 (INPUT_MISSING)，且 EPAM 研究指出冷启动失忆 (Cold-start amnesia) 会导致严重猜测行为，丧失历史决策语境.
Risk Reduced: Cold-start Amnesia / Task Loop Break Risk
Expected Behavior Change: 即使遇到历史输入完全缺失的状况，也不得在会话或输出中抹去这一异常状态. 必须将“缺失异常”作为一种确凿状态如实传递给下游阶段，严禁凭空脑补历史信息.
Why Now: 既然我们已经容忍了状态断链，就必须确保这种断链状态本身能被系统准确记忆与传导，以避免代理在新周期启动时因为缺乏上下文而胡乱行动.

DO_NOT_CHANGE

列出本周明确不修改的规则或判断:
1. 不修改对 aegis-cortex 目录边界的物理隔离限制.
2. 坚决不读取或修改 zero-entropy-lab 的任何代码和 GitHub Actions 机制.
3. 坚持接受和容忍任务调度的异常 (如 A1 的偶尔失踪)，不尝试修改宿主任务流进行所谓“修复”.
说明为什么保持不变:
严格的物理边界与工作域限制是不可逾越的底线. 任何企图主动修复上游调度或打破单向文件工作流的决策，都属于严重越界，不仅会污染隔离沙盒，更可能破坏宿主仓库的安全性.

HANDOFF_TO_A4

把 A4 需要执行的 aegis-cortex 内部更新写清楚:
1. 在 A4 中将“强制验证约束”(防进度误判) 转化为下周的明确行动规则，要求验证环节不能缺失.
2. 在 A4 中将“强制分块与防截断策略”(防一次性吞咽大文件) 记录为常规纪律行动项.
3. 在 A4 文件中应用并阐释如何保留“状态异常”，防止冷启动下的无端猜测.
只能提出 aegis-cortex 内部更新. 严禁要求修改宿主仓库.

BOUNDARY_CHECK

确认没有读取宿主仓库机制: YES
确认没有读取 GitHub Actions: YES
确认没有写入 aegis-cortex 之外的文件: YES
