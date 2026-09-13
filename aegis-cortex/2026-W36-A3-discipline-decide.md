# A3 Weekly Discipline Decide

## CORTEX_RUN_HEADER
- **Cortex**: aegis-cortex
- **Host Repository**: zero-entropy-lab
- **Task ID**: A3
- **Cadence**: Weekly
- **Loop Stage**: Decide
- **Target Week**: 2026-W36
- **Logical Week Basis**: Asia/Shanghai
- **Coverage Window**: 2026-08-31 to 2026-09-06
- **Input Status**: SUCCESS
- **Network Status**: NETWORK_VERIFIED
- **Task Status**: COMPLETED
- **Record Provenance**: JULES_NATIVE
- **Repository Inspection**: NO
- **GitHub Actions Inspection**: NO
- **Write Scope**: aegis-cortex only
- **Boundary Violation**: NO
- **Daily Coverage Matrix**: 14 files present
- **Inherited Evidence**: SUCCESS
- **Independent Evidence Added**: NONE
- **Missing Inputs Preserved**: NONE
- **External Risk State**: UNKNOWN
- **Local Incident State**: NO_LOCAL_EVIDENCE
- **Historical Execution State**: NATIVE
- **Current Delivery State**: COMPLETED

## INPUT_RECORD
- **读取路径**:
  - aegis-cortex/2026-08-31-A1-reliability-observe.md
  - aegis-cortex/2026-08-31-A2-doctrine-orient.md
  - aegis-cortex/2026-09-01-A1-reliability-observe.md
  - aegis-cortex/2026-09-01-A2-doctrine-orient.md
  - aegis-cortex/2026-09-02-A1-reliability-observe.md
  - aegis-cortex/2026-09-02-A2-doctrine-orient.md
  - aegis-cortex/2026-09-03-A1-reliability-observe.md
  - aegis-cortex/2026-09-03-A2-doctrine-orient.md
  - aegis-cortex/2026-09-04-A1-reliability-observe.md
  - aegis-cortex/2026-09-04-A2-doctrine-orient.md
  - aegis-cortex/2026-09-05-A1-reliability-observe.md
  - aegis-cortex/2026-09-05-A2-doctrine-orient.md
  - aegis-cortex/2026-09-06-A1-reliability-observe.md
  - aegis-cortex/2026-09-06-A2-doctrine-orient.md
  - aegis-cortex/2026-W34-A3-discipline-decide.md
  - aegis-cortex/2026-W35-A3-discipline-decide.md
  - aegis-cortex/2026-W34-A4-protocol-act.md
  - aegis-cortex/2026-W35-A4-protocol-act.md
  - aegis-cortex/2026-08-A6-aegis-memorize.md
- **缺失路径**: 无缺失。
- **降级输入**: 无降级，全部依赖原始 A1/A2 文件。
- **联网来源**: ArXiv API (2608.26237), ArXiv API (Securing LLM-Agent Long-Term Memory Against Poisoning), Crossref API 等。
- **覆盖率 (Coverage Ratio)**: 100% (7天全勤14/14文件)。
- **独立来源说明**: 本周 SIG-2026-09-01-02 (2608.26237) 为全新独立证据，独立于 W35 关注点。

## WEEKLY_RISK_SYNTHESIS
- **重复风险**: 假性完成风险 (false completion risk) 和任务死循环断开风险 (task loop break risk) 再次成为外部高置信度论文重点。
- **新风险**: 无。
- **独立证据增强风险**: 对于 false completion risk，SIG-2026-09-01-02 提供明确的新独立证据（需要实质性轨迹检查）。
- **同源重复风险**: SIG-2026-09-01-01 和 SIG-2026-09-03-01 均涉及测试指标不足以评估真实稳定性的问题，属于同一类风险的理论印证。
- **只有外部证据的风险**: 长期的记忆投毒风险 (memory poisoning risk, SIG-2026-09-06-01)，及过度自信恢复验证风险。
- **有 Aegis 本地记录支持的风险**: SIG-2026-08-31-01 强调的 scope drift risk 在之前的 W35 A4 纪律里有本地的预防性记录支持。
- **降级风险**: 无。
- **证伪风险**: 无。
- **过期风险**: 无。
- **输入缺失影响**: 本周输入齐全 (14/14 日常文件)。
- **仍不确定风险**: 针对企业级复杂Agent架构的问题是否能直接跨界影响到 Aegis 单日/单次 Markdown 沙盒执行机制依然不明。

## DECISION_SET

Decision ID: DEC-W36-01
- **Decision**: 强化代理操作轨迹检查以阻断虚假完成
- **Decision Type**: DISCIPLINE_FOCUS
- **External Evidence**: SIG-2026-09-01-02 证明简单的二进制状态不足以区分任务实际执行和无根据的猜测，需要详细的轨迹来源。
- **Aegis Repository Evidence**: NO_LOCAL_EVIDENCE (虽无直接问题发生，但在缺乏严格轨迹证明时，存在隐性假性完成风险)。
- **Evidence Gap**: 外部论文侧重安全对抗等复杂场景，与代码仓库纯文本任务的稳定性机制存在差异。
- **Counterevidence**: 单机纯文本沙盒具备较强确定性。
- **Risk Reduced**: false completion risk, overconfidence risk
- **Expected Behavior Change**: 代理在任何导致状态变更（文件读写）后，必须强制增加单列计划步骤进行验证。
- **Why Now**: W35 已经提出了类似意识，本周外部证据明确强调轨迹层面溯源必要性，适合即刻固化。
- **Confidence**: High Confidence
- **Validity Window**: 2026-W37
- **Stop Condition**: 本地系统如未出现验证阻断失效或无假性完成，在四周后可转入长期纪律或取消重点。
- **Host Repository Change**: NO

Decision ID: DEC-W36-02
- **Decision**: 监控记忆总结洗白风险
- **Decision Type**: CONTINUE_WATCH
- **External Evidence**: SIG-2026-09-06-01 揭示代理归纳过去记录时可能产生虚假佐证并导致洗白，引发长期的记忆投毒。
- **Aegis Repository Evidence**: NO_LOCAL_EVIDENCE (Aegis 以 Markdown 定期压缩，存在此类漏洞环境可能，但并未观察到篡改事实)。
- **Evidence Gap**: 论文研究的是复杂企业级多模态代理，而 Aegis 主要为单实例严格 Markdown 纯文本边界控制。
- **Counterevidence**: 现有纪律严格区分外部声明与本地主张，未发生篡改。
- **Risk Reduced**: memory poisoning risk, memory compression risk
- **Expected Behavior Change**: 代理在执行如 A5 和 A6 等长周期聚合与压缩任务时，必须忠实保留原不确定性，不得在重构和总结中擅自提权。
- **Why Now**: 外部提供明确新近失效模式 (ArXiv)，考虑到月底/月度节点可能存在隐患，预先监控非常合理。
- **Confidence**: High Confidence
- **Validity Window**: 2026-W37 to 2026-W40
- **Stop Condition**: 如一个月内没有此类发生迹象，可予以降低优先评级。
- **Host Repository Change**: NO

## DO_NOT_CHANGE
- W35中对单次执行修改不超过特定代码的规定不作修改。
- 宿主代码 zero-entropy-lab 目前保持隔离，继续不执行外部建议的工具或结构注入。
- 条件：仅在代理确实遭遇本地跨目录越界导致系统性故障且无法用纯文本控制防范时才重新考虑。

## HANDOFF_TO_A4
- **观察纪律**: 在接下来的 A1 观察中，特别留意模型工具执行是否出现不合理的合并与捷径猜测。
- **验证要求**: A4 行动协议必须将 DEC-W36-01 的轨迹要求具体化为操作验证步骤规范。
- **来源要求**: 追踪验证长期记忆污染风险的外部后续论证。
- **不确定性要求**: 对记忆总结的洗白概率要保持警惕并记录降级现象。
- **缺失输入处理**: 若聚合周任务输入依然短缺，坚决采取明确标注（如 DECISION_INPUT_MISSING），不试图推断补充。
- **叙事防护**: 避免宣称“Aegis 已经免疫记忆投毒”，仅说明处于主动预防监控状态。
- **Watchlist**: 添加 memory poisoning via summarization 进观察清单。

## BOUNDARY_CHECK
未越界，未修改宿主系统代码，所有决定均限制在 aegis-cortex 纯文本规范与监控纪律范围内。
