# A3 Weekly Discipline Decide

## CORTEX_RUN_HEADER
- **Cortex**: aegis-cortex
- **Host Repository**: zero-entropy-lab
- **Task ID**: A3
- **Cadence**: Weekly
- **Loop Stage**: Decide
- **Target Week**: 2026-W32
- **Logical Week Basis**: Asia/Shanghai
- **Coverage Window**: 2026-08-03 to 2026-08-09
- **Input Status**: SUCCESS_AFTER_RECONCILIATION
- **Network Status**: NETWORK_VERIFIED
- **Task Status**: SUCCESS
- **Repository Inspection**: NO
- **GitHub Actions Inspection**: NO
- **Write Scope**: aegis-cortex only
- **Boundary Violation**: NO

## INPUT_RECORD
本周 A1 文件:
- aegis-cortex/2026-08-03-A1-reliability-observe.md
- aegis-cortex/2026-08-04-A1-reliability-observe.md
- aegis-cortex/2026-08-05-A1-reliability-observe.md
- aegis-cortex/2026-08-06-A1-reliability-observe.md
- aegis-cortex/2026-08-07-A1-reliability-observe.md
- aegis-cortex/2026-08-08-A1-reliability-observe.md
- aegis-cortex/2026-08-09-A1-reliability-observe.md

本周 A2 文件:
- aegis-cortex/2026-08-03-A2-doctrine-orient.md
- aegis-cortex/2026-08-04-A2-doctrine-orient.md
- aegis-cortex/2026-08-05-A2-doctrine-orient.md
- aegis-cortex/2026-08-06-A2-doctrine-orient.md
- aegis-cortex/2026-08-07-A2-doctrine-orient.md
- aegis-cortex/2026-08-08-A2-doctrine-orient.md
- aegis-cortex/2026-08-09-A2-doctrine-orient.md

历史输入:
- aegis-cortex/2026-W31-A3-discipline-decide.md
- aegis-cortex/2026-W31-A4-protocol-act.md
- aegis-cortex/2026-07-A6-aegis-memorize.md

周归属:
- Asia/Shanghai Week Start: 2026-08-03
- Asia/Shanghai Week End: 2026-08-09
- ISO Week: 2026-W32
- Missing A1: NONE
- Missing A2: NONE after 2026-08-06 reconciliation
- Blocked A2: NONE after reconciliation
- Coverage Ratio: 7/7 days

RECONCILIATION_RECORD
- 2026-08-06 A2 最初在 A1 尚未可见时写入 INPUT_MISSING / BLOCKED
- 当前远端同日 A1 已完整存在并状态 COMPLETED
- 本轮先完成 2026-08-06 A2 reconciliation, 再进行 W32 聚合
- 该事件证明周度输入完整性不能只信任历史 BLOCKED 快照, 必须在周聚合时复核当前上游状态
- 这属于本地调度与依赖时序证据, 不属于宿主代码故障或安全事件

独立外部复核:
- arXiv:2606.04329 系统研究 memory poisoning, 指出 persistent memory 的多种写入通道与结构性脆弱性, 现有 prompt injection defenses 不能完整覆盖
- arXiv:2603.02240 提供 local-first multi-agent memory 与 provenance / trust defense 的研究性实现, 作为防御方向参考而非本地实现要求

## WEEKLY_RISK_SYNTHESIS

### Risk 1: Stale dependency state propagation
- Category: false completion risk, stale doctrine risk, recovery verification risk
- Local Evidence: YES
- Evidence: 2026-08-06 A1 当前存在且 COMPLETED, 但原 A2 长期保留 INPUT_MISSING / BLOCKED
- Meaning: 如果周度任务直接读取历史下游状态而不复核当前上游, 临时并发缺失会被错误固化为周度事实
- Confidence: HIGH

### Risk 2: Persistent / sleeper memory poisoning
- Category: memory poisoning risk, memory compression risk
- Local Incident Evidence: NO
- External Evidence: HIGH, original research
- Meaning: 长周期 Markdown 记忆需要持续保留 provenance, source tier, local-vs-external separation 与时间维度复核
- Confidence: HIGH for external risk, UNKNOWN for local exploitability

### Risk 3: Self-correction loop without external anchor
- Category: task loop break risk, hallucination risk, overconfidence risk
- Local Incident Evidence: NO
- External Evidence: mostly Tier 3 engineering analysis this week
- Meaning: A5/A6 等反思压缩阶段不应以无界自我重试替代明确外部检查条件
- Confidence: MEDIUM

### Risk 4: Prompt / model behavior drift
- Category: scope drift risk, stale doctrine risk
- Local Incident Evidence: NO
- External Evidence: limited and partly vendor-sourced
- Meaning: 保持 watch, 不升级为强纪律
- Confidence: LOW-MEDIUM

## DECISION_SET

Decision ID: DEC-W32-01
Decision: 周度聚合前强制执行 current-state dependency reconciliation, 对每个同日 A1/A2 对检查“当前文件是否存在 + Logical Date + Task Status”, 历史 INPUT_MISSING 不能在上游后来已存在时继续传播
Decision Type: DISCIPLINE_FOCUS
External Evidence: NONE REQUIRED, this decision is grounded in local W32 execution evidence
Aegis Repository Evidence: 2026-08-06 A1/A2 stale dependency mismatch
Evidence Gap: 尚未观察到第二次同类事件
Counterevidence: 无
Risk Reduced: stale doctrine risk, false completion risk, recovery verification risk
Expected Behavior Change: A3 在计算 Missing/Blocked/Coverage 前重新核对当前远端 A1/A2, 如发现 stale missing 则先 reconcile, 不能把旧快照直接当最终周状态
Why Now: 本周已经出现一次可验证的真实残留, 且它会直接污染周度输入完整性
Confidence: HIGH
Validity Window: DURABLE until superseded
Stop Condition: 调度平台提供有序依赖与强一致 input contract, 且连续多个周期验证无 stale state
Host Repository Change NO: YES

Decision ID: DEC-W32-02
Decision: Strengthen temporal provenance for persistent memory, 将来源, 证据等级, 外部事实与本地事实分离继续作为 A1-A6 传递的核心纪律
Decision Type: STRENGTHEN_EVIDENCE
External Evidence: arXiv:2606.04329; arXiv:2603.02240
Aegis Repository Evidence: W31 ACT-W31-01 已要求 provenance tracking, W32 多日重复出现 memory poisoning 主题
Evidence Gap: NO_LOCAL_INCIDENT_EVIDENCE
Counterevidence: Aegis 是受限单仓 Markdown 框架, 攻击面小于开放式通用 Agent
Risk Reduced: memory poisoning risk, memory compression risk, hallucination risk
Expected Behavior Change: 重复外部信号按同源去重, 不因出现次数增加置信度; 长期压缩时保留来源与不确定性
Why Now: 本周原始研究进一步证明 memory poisoning 是 longitudinal property 而非一次性输入问题
Confidence: HIGH for evidence discipline, not a claim of local compromise
Validity Window: 3 months
Stop Condition: 出现更强且零依赖的本地 provenance isolation mechanism
Host Repository Change NO: YES

Decision ID: DEC-W32-03
Decision: 对自我纠正与恢复流程采用 bounded retry + explicit external anchor 的观察纪律, 不允许用无限自评重试掩盖失败
Decision Type: CONTINUE_WATCH
External Evidence: W32 engineering sources on self-correction loops and loop/stagnation failure
Aegis Repository Evidence: NO_LOCAL_EVIDENCE
Evidence Gap: 缺少 Aegis 本地重复故障样本与 Tier 1 统一标准
Counterevidence: 现有 Tolerant Missing State Protocol 已要求 fail-closed, 多数任务不是持续在线循环
Risk Reduced: task loop break risk, false completion risk, overconfidence risk
Expected Behavior Change: 如发生恢复或反思重试, 必须有明确停止条件, 外部可检查断言或缺失状态出口
Why Now: 与 W32 的 stale input reconciliation 问题共同指向“不能靠模型主观完成感替代状态验证”
Confidence: MEDIUM
Validity Window: W33-W35
Stop Condition: 获得更强本地数据或该风险被证伪
Host Repository Change NO: YES

## DO_NOT_CHANGE
- 不修改 zero-entropy-lab 宿主代码或 GitHub Actions
- 不把 memory poisoning 外部风险描述成本地已发生攻击
- 不引入数据库, 事件总线, Bayesian trust service 或密码学签名依赖
- 不把 Prompt drift 升级为强纪律, 当前证据不足
- 不删除或重写 W31 历史记录

## HANDOFF_TO_A4
- 把 DEC-W32-01 转换为 weekly current-state dependency reconciliation protocol
- 把 DEC-W32-02 转换为 temporal provenance / source separation protocol
- 把 DEC-W32-03 转换为 bounded retry / external anchor watch requirement
- 明确 Asia/Shanghai 是 Logical Date 与 ISO Week 的唯一归属基准

## BOUNDARY_CHECK
- 确认未读取宿主仓库代码或 Actions: YES
- 确认未把外部风险声明为本地事实: YES
- 确认本周唯一真实本地异常仅描述为 stale dependency state: YES
- 确认 W32 覆盖 2026-08-03 至 2026-08-09: YES
- 确认未直接升级 A6 长期记忆: YES
