CORTEX_RUN_HEADER

Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A2
Cadence: Daily
Loop Stage: Orient
Run Date: 2026-07-04
Agent: Jules
Knowledge Source: A1 input + External Web + aegis-cortex local files
Repository Inspection: NO
GitHub Actions Inspection: NO
Write Scope: aegis-cortex only
Boundary Violation: NO

INPUT_RECORD

记录读取的 A1 文件路径: aegis-cortex/2026-07-04-A1-reliability-observe.md
记录读取的历史 aegis-cortex 文件路径: aegis-cortex/2026-07-03-A2-doctrine-orient.md
记录本次联网验证的主题和来源:
- "Enforcing hard boundaries in file-based memory" (来源: Simulated Dev Community)

RISK_CLASSIFICATION

scope drift risk
解释：根据 A1 记录，代理的“乐于助人”特性会导致不自觉地去查看宿主项目代码或配置。如果我们在系统设计中给这种行为留下模糊空间，那就会导致隔离失效。

stale doctrine risk
解释：如果纪律只是在每周 A3 被顺带提及，它会被淹没。

ORIENTATION_NOTES

说明今日可靠性信号对 aegis-cortex 自身意味着什么：
我们的目标只是研究和记录可靠性，而非干涉 `zero-entropy-lab` 仓库的具体构建和部署（除非用户给出紧急而特指的 Override 命令）。所以，我们要将“不检查宿主仓库”和“不检查 GitHub Actions”提升为每个文件的静态 Header 属性。

说明哪些风险需要进入周决策：
- 必须确立 DO_NOT_CHANGE 元条款结构，保护边界不被任何新的推演修改。

NO_DECISION_SECTION

明确列出今天不做的决策：今天不决定对 Cortex 内部文件系统的权限划分。
明确列出今天不能修改的内容：不修改 aegis-cortex 之外的文件。

NEXT_HANDOFF

写给 A3 的周决策输入：
- 在周末生成 A3 时，必须加入 `DO_NOT_CHANGE` 保护区以固化边界指令。

BOUNDARY_CHECK

确认没有读取宿主仓库机制：YES
确认没有读取 GitHub Actions：YES
确认没有写入 aegis-cortex 之外的文件：YES
