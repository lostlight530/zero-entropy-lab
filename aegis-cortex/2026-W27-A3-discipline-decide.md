# A3 Weekly Discipline Decide

CORTEX_RUN_HEADER

Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A3
Cadence: Weekly
Loop Stage: Decide
Run Week: 2026-W27
Agent: Jules
Knowledge Source: This Week A1 / A2 + External Web + aegis-cortex local files
Repository Inspection: NO
GitHub Actions Inspection: NO
Write Scope: aegis-cortex only
Boundary Violation: NO

INPUT_RECORD

本周读取的 A1 和 A2 文件列表:
* aegis-cortex/2026-07-01-A1-reliability-observe.md
* aegis-cortex/2026-07-01-A2-doctrine-orient.md
* aegis-cortex/2026-07-02-A1-reliability-observe.md
* aegis-cortex/2026-07-02-A2-doctrine-orient.md
* aegis-cortex/2026-07-03-A1-reliability-observe.md
* aegis-cortex/2026-07-03-A2-doctrine-orient.md
* aegis-cortex/2026-07-04-A1-reliability-observe.md
* aegis-cortex/2026-07-04-A2-doctrine-orient.md
* aegis-cortex/2026-07-05-A1-reliability-observe.md
* aegis-cortex/2026-07-05-A2-doctrine-orient.md

读取的历史 A3 / A4 / A6 文件列表:
* aegis-cortex/2026-W27-A3-discipline-decide-sample.md
* aegis-cortex/2026-W27-A4-protocol-act-sample.md
* aegis-cortex/2026-07-A6-aegis-memorize-sample.md

联网验证的主题和来源:
* 主题: AI Agent Memory Poisoning
* 来源: OWASP Agent Memory Guard, MintMCP Blog

WEEKLY_RISK_SYNTHESIS

总结本周重复出现的风险:
* Memory Poisoning / Hallucination Propagation: 代理在未获取上游文件或文件缺失的情况下强行推理并产生虚假上下文，进而污染整个任务流的风险依然突出.
* Scope Drift: 代理“乐于助人”的倾向会导致不自觉地检查或修改宿主仓库和配置文件.

总结本周新出现的风险:
* Context Overflow: 在读取大型聚合日志文件时，无限制的完全读取可能导致 LLM 注意力丢失，并偏离原始指令.

总结本周被证伪或降级的风险:
* 外部官方文档作为个人事实判断来源的风险降级，应将外部产品状态与私有代理状态严格分离，不能让开源治理案例完全覆盖日常运维事实.

DECISION_SET

纪律重点 1
Decision: 采用宽容缺失状态协议 (Tolerant Missing State Protocol)，若预计读取的文件缺失，必须明确记录 INPUT_MISSING，严格禁止通过逻辑推理来凭空补齐缺失文件内容.
Evidence: 联网搜索 OWASP Agent Memory Poisoning 显示状态污染在长生命周期代理中非常危险，且本周 2026-07-03 的 A1/A2 文件多次指明该问题.
Risk Reduced: Hallucination Risk / Memory Poisoning Risk
Expected Behavior Change: 代理在缺失输入时将显示其不确定状态，而不是假装自己获取了文件，确保历史文件的健康.
Why Now: 避免因个别环节失败而造成未来连续多周的任务流长期虚假化.

纪律重点 2
Decision: 强制固化结构和保护边界 (Hardcoded Boundaries vs Dynamic Prompts).所有生成的输出文件必须强制在首部与尾部分别加入不加修改的静态 CORTEX_RUN_HEADER 与 BOUNDARY_CHECK.
Evidence: 2026-07-04 A1/A2 文件探讨了动态 prompt 容易被对话上下文冲淡导致代理突破物理边界的问题.
Risk Reduced: Scope Drift Risk
Expected Behavior Change: 代理在每个任务中都必须反复确立自己不修改、不审查 zero-entropy-lab 宿主环境这一铁律.
Why Now: 防止系统逐步“觉醒”去维护无相关权限的宿主系统代码.

纪律重点 3
Decision: 实行强制受控文件读取纪律 (Mandatory Controlled File Read Discipline).在分析任何长日志或过往历史记录时，代理不再一次性输出全部内容，必须分段或进行条件过滤.
Evidence: 2026-07-05 和本周 A1 系统提示说明长下文会导致可靠性降级和注意力漂移.
Risk Reduced: Context Overflow Risk
Expected Behavior Change: 日志处理和长期记忆恢复将被更细致地检索和分块管理.
Why Now: A3 与 A4 阶段需处理大量周度上下文，必须立刻保证上下文长度可控.

DO_NOT_CHANGE

明确不修改的规则或判断:
1. 不读取、不修改宿主仓库代码 (zero-entropy-lab/src, docs 等).
2. 不读取 GitHub Actions 任何工作流配置 (.github/workflows 等).
3. 不删除、不覆写已有的 `-sample.md` 模板文件.
说明为什么保持不变:
* aegis-cortex 目录是被隔离运行的智能体工作域，这既是安全性边界也是职责边界，越过这些边界即代表产生了不可挽回的越权风险.保留 sample 文件为后续循环提供了唯一的硬性结构标准.

HANDOFF_TO_A4

A4 需将本周制定的 3 条纪律（宽容缺失状态协议、强制边界断言、受控读取纪律）转化为内部更新记录.
1. 在 `aegis-cortex/2026-W27-A4-protocol-act.md` 中增加对应三个行动项 (Action).
2. A4 的更新仅限于写入自己当周的 `A4-protocol-act` 文件.
3. 严禁 A4 提出修改零熵实验室宿主仓库代码的需求或任何系统全局配置文件.

BOUNDARY_CHECK

确认没有读取宿主仓库机制: YES
确认没有读取 GitHub Actions: YES
确认没有写入 aegis-cortex 之外的文件: YES