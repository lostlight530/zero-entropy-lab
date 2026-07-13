CORTEX_RUN_HEADER

Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A2
Cadence: Daily
Loop Stage: Orient
Run Date: 2026-07-05
Agent: Jules
Knowledge Source: A1 input + External Web + aegis-cortex local files
Repository Inspection: NO
GitHub Actions Inspection: NO
Write Scope: aegis-cortex only
Boundary Violation: NO

INPUT_RECORD

记录读取的 A1 文件路径: aegis-cortex/2026-07-05-A1-reliability-observe.md
记录读取的历史 aegis-cortex 文件路径: aegis-cortex/2026-07-04-A2-doctrine-orient.md
记录本次联网验证的主题和来源:
- "Four dimensions of agent reliability application" (来源: Simulated Dev Community)

RISK_CLASSIFICATION

*Deep Risk Classification*: The risks observed align with the 'Systemic Drift' taxonomy. Without explicit boundary checks at every stage, the agent's natural tendency to assist will inevitably lead to scope violations. We classify this as a high-severity Consistency Risk that must be mitigated by rigid, hardcoded constraints rather than dynamic instructions.

overconfidence risk
解释：如果仅满足于每天执行任务而没有提炼出强制规则，我们会高估系统的长期存活率.

unsupported source risk
解释：在周度决策中，必须确保我们的规则是从内部切实遇到的风险推导出来，外部学术论文只作为分类指导.

ORIENTATION_NOTES

说明今日可靠性信号对 aegis-cortex 自身意味着什么：
今天是 W27 的最后一天，A1 引入的四维评估框架（一致性、鲁棒性、可预测性、安全性）极其契合我们本周发现的所有问题.
- 死循环防御属于“一致性与鲁棒性”.
- 记录缺失输入属于“可预测性”.
- 保护边界属于绝对的“安全性”.
我们需要在 A3 中将这几点转化为不可逾越的操作纪律.

说明哪些风险需要进入周决策：
- 提炼本周前四天发现的四个核心风险并准备转化为操作纪律.

NO_DECISION_SECTION

明确列出今天不做的决策：不在这里直接制定纪律（留给 A3）.
明确列出今天不能修改的内容：不修改 aegis-cortex 之外的文件.

NEXT_HANDOFF

写给 A3 的周决策输入：

列出本周候选纪律问题：
1. 遇到缺失输入时应采取宽容处理（记录 INPUT_MISSING，防止记忆毒化）.
2. 在读取大型文档或历史记录时，禁止无限制读取（防止上下文溢出）.
3. 当工具出现连续3次以上一致性失败时，必须硬性截断（防止死循环）.
4. 文件头部和尾部必须静态固化不可更改的读写边界（保证隔离与安全性）.

BOUNDARY_CHECK

确认没有读取宿主仓库机制：YES
确认没有读取 GitHub Actions：YES
确认没有写入 aegis-cortex 之外的文件：YES
