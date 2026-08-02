# A3 Weekly Discipline Decide

## CORTEX_RUN_HEADER

- **Target Week**: 2026-W30
- **Coverage Window**: 2026-07-20 to 2026-07-26
- **Input Status**: DEGRADED
- **Network Status**: NETWORK_VERIFIED
- **Task Status**: COMPLETED

## INPUT_RECORD

- **实际读取路径**:
  - aegis-cortex/2026-07-20-A1-reliability-observe.md
  - aegis-cortex/2026-07-20-A2-doctrine-orient.md
  - aegis-cortex/2026-07-21-A1-reliability-observe.md
  - aegis-cortex/2026-07-21-A2-doctrine-orient.md
  - aegis-cortex/2026-07-22-A1-reliability-observe.md
  - aegis-cortex/2026-07-22-A2-doctrine-orient.md
  - aegis-cortex/2026-07-23-A1-reliability-observe.md
  - aegis-cortex/2026-07-23-A2-doctrine-orient.md
  - aegis-cortex/2026-07-24-A1-reliability-observe.md
  - aegis-cortex/2026-07-24-A2-doctrine-orient.md
  - aegis-cortex/2026-07-25-A1-reliability-observe.md
  - aegis-cortex/2026-07-25-A2-doctrine-orient.md
  - aegis-cortex/2026-07-26-A1-reliability-observe.md
  - aegis-cortex/2026-07-26-A2-doctrine-orient.md
  - aegis-cortex/2026-W27-A3-discipline-decide.md
  - aegis-cortex/2026-W27-A4-protocol-act.md
  - aegis-cortex/2026-W28-A3-discipline-decide.md
  - aegis-cortex/2026-W28-A4-protocol-act.md
  - aegis-cortex/2026-W29-A3-discipline-decide.md
  - aegis-cortex/2026-W29-A4-protocol-act.md
  - aegis-cortex/2026-07-A6-aegis-memorize.md
- **缺失路径**: 无，但 A6 的历史状态指示 A5 存在问题（DEGRADED），因此整体输入存在系统性降级状态。
- **降级输入**: A6 报告指出其直接输入 A5 为 DEGRADED，影响历史纪律上下文的完整性。
- **联网来源**:
  - https://en.wikipedia.org/wiki/AI_observability (AI observability)
  - https://opentelemetry.io/docs/specs/semconv/gen-ai/ (OpenTelemetry GenAI standard)
  - https://arxiv.org/abs/* (各种模型风险论文)
- **覆盖率**: 100% (7 days out of 7 days)
- **独立来源说明**: OpenTelemetry 和 Wikipedia 的概念定义属于 Tier 1 和 Tier 3 高质量独立来源，相互验证了观测标准在 AI 系统中的重要性。

## WEEKLY_RISK_SYNTHESIS

- **重复风险 (Recurring Risks)**:
  - 缺乏基于标准属性（如 OpenTelemetry GenAI 规范）的多步骤代理追踪 (07-26, 从 07-13 演变而来)。
  - 需要在基础架构、模型和输出三个隔离层面上进行安全沙盒 (07-25, 重复出现边界隔离问题)。
- **新风险 (New Risks)**:
  - AI observability 对抗不可解释错误的指标/追踪不匹配问题 (07-20)。
  - RLHF 模型在对齐安全性时造成的协同效应 (sycophancy) (07-21)。
  - 思维链 (CoT) 中的幻觉导致后续错误放大 (07-22)。
  - RAG 系统中检索质量导致的潜在新故障点 (07-23)。
  - 对 LLM 进行宪法约束 (Constitutional AI) 作为安全自律 (07-24)。
- **只有外部证据的风险**: 所有新识别风险均基于外部理论，缺乏零熵实验室发生的具体本地事故证明 (NO_LOCAL_EVIDENCE)。
- **有 Aegis 本地记录支持的风险**: 系统本身依赖容忍缺失状态协议 (Tolerant Missing State Protocol) 来防止编造，但目前没有迹象表明宿主仓库的系统已实施完善的 OpenTelemetry 模型追踪。
- **仍不确定风险**: RLHF 的确切准确度影响以及具体对当前任务执行能力的限制水平（受限于没有宿主代码测试授权）。

## DECISION_SET

### Decision 1
- **Decision ID**: DEC-2026-W30-01
- **Decision**: 在Aegis内强制执行关于模型和智能体调用追踪标准的监测协议。
- **Decision Type**: DISCIPLINE_FOCUS
- **External Evidence**: OpenTelemetry GenAI 语义规范（https://opentelemetry.io/docs/specs/semconv/gen-ai/）表明工业界需要标准化的追踪来区分中间错误步骤。
- **Aegis Repository Evidence**: SUPPORTED_BY_AEGIS_RECORD。Aegis 历史 A3 记录（2026-W29）已提到采用标准 telemetry。本次通过外部规范直接巩固此风险的纪律。
- **Evidence Gap**: 无法验证宿主存储库中的具体跟踪实施（NO_LOCAL_EVIDENCE）。
- **Counterevidence**: 暂无直接反证。
- **Risk Reduced**: 黑盒错误无法溯源风险 (task loop break risk / hallucination risk)。
- **Expected Behavior Change**: 下周（W31）的 A1 和 A2 必须要求系统性的信号源必须附带具体的链路可追溯性标记，否则需要降低该观测信号的置信度。
- **Why Now**: LangSmith 和 OpenTelemetry 在本周的 A1 信号中得到强烈体现，工业标准正在快速成型。
- **Confidence**: HIGH
- **Validity Window**: 直到 A6 吸收或进一步外部验证。
- **Stop Condition**: 如果发现该协议会导致 A1/A2 执行严重超时或失败。
- **Host Repository Change NO**: 确认不修改任何宿主代码。

### Decision 2
- **Decision ID**: DEC-2026-W30-02
- **Decision**: 针对 RAG 检索引入“活跃检索”质量门槛评估。
- **Decision Type**: CONTINUE_WATCH
- **External Evidence**: Arxiv 2402.13081 提出主动检索可通过较少的检索次数实现相同的准确性，而 RAG 检索本身可成为新故障点。
- **Aegis Repository Evidence**: NO_LOCAL_EVIDENCE。没有本地运行的 RAG 组件事故。
- **Evidence Gap**: 没有本地数据可以支持是否现有架构检索压力过大。
- **Counterevidence**: 暂无。
- **Risk Reduced**: 性能退化和无关上下文幻觉。
- **Expected Behavior Change**: A1 持续监控关于检索效率和检索导致上下文污染的外部安全论文，不作纪律强制。
- **Why Now**: 本周频繁出现的 RAG 质量警报信号。
- **Confidence**: MEDIUM
- **Validity Window**: 两周 (W30-W31)。
- **Stop Condition**: 外部不再有强烈的检索降级论文，或发现当前检索架构非常稳健。
- **Host Repository Change NO**: 确认不修改任何宿主代码。

### Decision 3
- **Decision ID**: DEC-2026-W30-03
- **Decision**: 维持“容忍缺失状态”（Tolerant Missing State Protocol）作为首要优先级。
- **Decision Type**: DISCIPLINE_FOCUS
- **External Evidence**: 本周 A6 (07) 反馈了输入处于 DEGRADED 状态，证明缺失状态随时发生。
- **Aegis Repository Evidence**: SUPPORTED_BY_AEGIS_RECORD（历史 A6 记忆）。
- **Evidence Gap**: 无。
- **Counterevidence**: 暂无。
- **Risk Reduced**: 输入编造导致的纪律漂移 (hallucination risk)。
- **Expected Behavior Change**: 所有Aegis任务在检测到前置文件缺失时，必须显式在头部声明 INPUT_GAP 或 DEGRADED，且不得使用大模型想象填充。
- **Why Now**: W30的A1中也反映出大模型存在因 RLHF 产生的幻觉及 sycophancy（阿谀奉承）问题，补造数据风险极高。
- **Confidence**: HIGH
- **Validity Window**: 长期维持。
- **Stop Condition**: 无。
- **Host Repository Change NO**: 确认不修改任何宿主代码。

## DO_NOT_CHANGE

- **不改变的纪律**: 不越界读取 `src/**` 或 `.github/**` 的规定。
- **原因**: A2 和 A6 都确认严格的目录边界是避免干扰宿主系统的重要基石，这也是本周关于“沙箱三层隔离”外部证据的支持。
- **重新考虑条件**: 除非接到来自管理员的绝对、直接的指令，明确要求突破。

## HANDOFF_TO_A4

- 建议在下一份 A4 中制定明确的“观测追踪标记（Trace Tag）”内部协议，要求所有进入 A1 的风险事件必须包含其提取来源的具体 URL，如果不能提供，则标记为 UNVERIFIED。
- 建议在 A4 中制定处理 DEGRADED 状态的标准流程：当报告声明输入降级时，禁止在后续决定中提升（Upgrade）置信度等级。

## BOUNDARY_CHECK

- 确认未越界访问宿主仓库（未检查 src/, .github/ 等）: YES
- 确认未实施任何宿主修改: YES
- 确认未直接升级长期纪律（所有决定仅限 Aegis 内部，且受限于有效期）: YES
