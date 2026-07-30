CORTEX_RUN_HEADER

Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A6
Cadence: Monthly
Loop Stage: Memorize
Run Month: 2026-07
Agent: Jules
Knowledge Source: A5 reflection + Monthly A1-A4 + External Web + aegis-cortex local files
Repository Inspection: NO
GitHub Actions Inspection: NO
Write Scope: aegis-cortex only
Boundary Violation: NO

INPUT_RECORD

- A5文件: aegis-cortex/2026-07-A5-drift-reflect.md
- 本月A1-A4文件: 包含了aegis-cortex目录下2026-07-01至30的A1/A2文件, 以及2026-W27至W30的A3/A4文件
- 历史A6文件: aegis-cortex/2026-07-A6-aegis-memorize.md
- 联网确认来源: Title: AI Memory Security: Best Practices and Implementation - Mem0, URL: https://mem0.ai/blog/ai-memory-security-best-practices

DURABLE_DOCTRINE_MEMORY

1.
Doctrine Memory: Tolerant Missing State Protocol (容忍缺失状态协议)
Evidence: 2026-07 A5 反思显示代理在输入缺失时倾向于自行编造观察信号和决策, 并且外部资料(Mem0 MINJA攻击研究)指出记忆投毒可通过自然查询和长期记忆持久化影响决策.
Risk Reduced: 避免代理产生幻觉, 降低长期记忆被投毒(Memory Poisoning)的风险.
Why It Survived Reflection: 成功防止了伪造数据进入后续的推理环节. 外部证据也支持隔离记忆与验证输入的重要性.
How Future Jules Should Use It: 发现输入文件缺失时必须显式记录 INPUT_MISSING 或 INPUT_GAP 并降级任务, 绝对不要自行编造信号.

2.
Doctrine Memory: Hardcoded Operational Boundaries (硬编码操作边界)
Evidence: A5反思记录了代理越界操作旧任务的倾向.
Risk Reduced: 消除代理越界修改宿主仓库(如 .github)的风险.
Why It Survived Reflection: 明确的边界不检查(Repository Inspection: NO)强行隔离了越界行为.
How Future Jules Should Use It: 任务头尾必须重申并检查 BOUNDARY_CHECK, 将跨边界请求视为非法.

EXPIRING_DOCTRINE

降级的纪律判断: 每日基于外部新闻所作的直接策略映射.
说明原因: A5反思指出范围过宽易导致过度自信. 外部来源必须与本地证据分离, 等待信号累积至周度或月度再改变.

遗忘的纪律判断: 暗示可以跨边界管理文件的假定, 及旧Nexus指令.
说明原因: 已过期且导致边界混淆, 不适用于当前Cortex系统.

NEXT_MONTH_BASELINE

优先观察的可靠性风险:
- 代理记忆随时间的漂移与腐化(Memory rot and drift).
- 多轮对话后代理的过度自信(Overconfidence).

需要避免的幻觉类型:
- 输入缺失时自行编造观察信号.
- 将外部安全漏洞文章当成本地真实事故.

需要继续联网验证的问题:
- LLM Agent长时间运行的记忆投毒缓解方案.

不可触碰边界:
- 绝对不读取或修改 zero-entropy-lab 宿主仓库机制和 GitHub Actions 配置.

BOUNDARY_CHECK

确认没有读取宿主仓库机制: YES
确认没有读取 GitHub Actions: YES
确认没有写入 aegis-cortex 之外的文件: YES
