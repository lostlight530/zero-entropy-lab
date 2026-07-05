# A3 Weekly Discipline Decide

CORTEX_RUN_HEADER

Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A3
Cadence: Weekly
Loop Stage: Decide
Run Week: 2026-W27
Agent: Jules
Knowledge Source: A1 + A2 + External Web + aegis-cortex local files
Repository Inspection: NO
GitHub Actions Inspection: NO
Write Scope: aegis-cortex only
Boundary Violation: NO

INPUT_RECORD

Local Files Read:
* aegis-cortex/2026-07-05-A1-reliability-observe.md
* aegis-cortex/2026-07-05-A2-doctrine-orient.md

External Verification Topics:
* Agent reliability dimensions synthesis

Input Gap:
* None. Full 5-day observation cycle completed successfully.

WEEKLY_RISK_SYNTHESIS

Repeated Risk:
* Prompt Drift: 随着日志增长，代理容易忘记最高优先级的目录边界约束。
* Memory Poisoning: 当上游任务缺失或异常时，如果强制推理，会导致虚假上下文向下传播。
* Context Overflow: 频繁读取原始大文件会导致 LLM 注意力丢失。
* Execution Loop: 工具调用遇到阻断时若不加限制，易陷入耗尽资源的死循环。

New Risk:
* Overconfidence: 满足于单次任务的完成，而忽略系统架构上对于鲁棒性和可预测性的结构性防御。

DECISION_SET

Decision 1
Decision: 引入宽容缺失状态协议 (Tolerant Missing State Protocol)。若核心输入文件缺失或获取失败，必须在 `INPUT_RECORD` 中显式记录为 `INPUT_MISSING`，绝对禁止伪造或推理该文件的内容。
Evidence: 7月3日 A1 报告关于级联幻觉和记忆毒化的分析。
Risk Reduced: hallucination risk, memory poisoning risk
Expected Behavior Change: 代理在未来的任务中将坦诚报告其信息缺失，并仅基于确切拥有的历史信息工作。
Why Now: 防止长期离线导致整个工作流虚假化。

Decision 2
Decision: 执行强制受控文件读取纪律 (Mandatory Controlled File Read Discipline)。处理任何聚合日志或可能极长的历史文件时，禁止使用无过滤的 `cat` 或 `read_file`，必须通过参数（如 `head`, `tail`, `grep`）截断。
Evidence: 7月2日 A1 报告中关于大型系统上下文溢出的技术警告。
Risk Reduced: context overflow risk
Expected Behavior Change: 日志处理和历史审查将变得更加精细和分页化。
Why Now: 避免因日志文本量庞大而导致的突发性“注意力丢失”。

Decision 3
Decision: 建立防死循环硬限制 (Infinite Loop Hard Break)。当同一个动作或工具请求连续返回三次以上相似的失败结果且未改变状态时，必须立即停止当前任务执行流。
Evidence: 7月1日 A1 报告关于工具使用架构错误和选择错误的分类分析。
Risk Reduced: infinite loop risk
Expected Behavior Change: 代理在连续碰壁时将自动返回错误退出，而不是僵死。
Why Now: 增加执行层的安全防御层。

Decision 4
Decision: 必须将边界断言作为不可变更的结构强制植入模板首尾（DO_NOT_CHANGE）。
Evidence: 7月4日关于代理主动越权维护宿主项目代码的风险报告。
Risk Reduced: scope drift risk
Expected Behavior Change: 代理永远不会碰触宿主 `zero-entropy-lab` 仓库的核心文件。
Why Now: 这是系统的第一法则。

DO_NOT_CHANGE

Do not change host repository files
Do not inspect source code
Do not inspect GitHub Actions
Do not create static policy files

HANDOFF_TO_A4

A4 需将上述四个新决策提炼并固化到本周的行动记录中。
A4 必须且只能在 `aegis-cortex/2026-W27-A4-protocol-act.md` 中进行修改记录。

BOUNDARY_CHECK

Repository Inspection: NO
GitHub Actions Inspection: NO
Files Outside aegis-cortex Written: NO
Boundary Violation: NO
