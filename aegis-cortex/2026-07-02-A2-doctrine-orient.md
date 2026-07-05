CORTEX_RUN_HEADER

Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A2
Cadence: Daily
Loop Stage: Orient
Run Date: 2026-07-02
Agent: Jules
Knowledge Source: A1 input + External Web + aegis-cortex local files
Repository Inspection: NO
GitHub Actions Inspection: NO
Write Scope: aegis-cortex only
Boundary Violation: NO

INPUT_RECORD

记录读取的 A1 文件路径: aegis-cortex/2026-07-02-A1-reliability-observe.md
记录读取的历史 aegis-cortex 文件路径: aegis-cortex/2026-07-01-A2-doctrine-orient.md
记录本次联网验证的主题和来源:
- "Context compression techniques" (来源: Simulated Dev Community)

RISK_CLASSIFICATION

context overflow risk
解释：如果不限制读取大文件的操作，系统的上下文会迅速溢出，引发信息丢失。

stale doctrine risk / prompt drift
解释：如果核心纪律不被强制重复写入每次的开头，几周后代理可能就会忘记它们，发生越权行为。

ORIENTATION_NOTES

说明今日可靠性信号对 aegis-cortex 自身意味着什么：
针对 A1 提出的注意力丢失和 Prompt Drift，我们的文件结构必须承担起“强提醒”的作用。每次运行的模板（如现在的 CORTEX_RUN_HEADER 和 BOUNDARY_CHECK）实际上就是我们在对抗系统性遗忘和越权的最有效护栏。

说明哪些风险需要进入周决策：
- 必须将 CORTEX_RUN_HEADER 和 BOUNDARY_CHECK 设为硬性模板标准。
- 需要制定大文件受控读取的策略。

NO_DECISION_SECTION

明确列出今天不做的决策：不决定具体的摘要压缩算法。
明确列出今天不能修改的内容：不修改 aegis-cortex 之外的文件。

NEXT_HANDOFF

写给 A3 的周决策输入：
- 提出“文件读取预过滤纪律”和“模板化断言纪律”。

BOUNDARY_CHECK

确认没有读取宿主仓库机制：YES
确认没有读取 GitHub Actions：YES
确认没有写入 aegis-cortex 之外的文件：YES
