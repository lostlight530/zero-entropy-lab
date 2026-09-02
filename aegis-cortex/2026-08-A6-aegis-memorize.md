# A6 Monthly Aegis Memorize

## CORTEX_RUN_HEADER

- **Cortex**: aegis-cortex
- **Host Repository**: zero-entropy-lab
- **Task ID**: A6
- **Cadence**: Monthly
- **Loop Stage**: Memorize
- **Run Month**: 2026-08
- **Target Month**: 2026-08
- **Month Closure Status**: CLOSED
- **Agent**: Jules
- **Record Provenance**: JULES_NATIVE
- **Reflection Input Status**: COMPLETE
- **Network Status**: NETWORK_VERIFIED
- **Task Status**: COMPLETED
- **Original Execution Status**: COMPLETED_NATIVE
- **Current Path Status**: PRESENT
- **Write Scope**: aegis-cortex only
- **Boundary Violation**: NO

## INPUT_RECORD

- **Daily Coverage Matrix**: 31 A1 files and 31 A2 files are present for 2026-08-01 through 2026-08-31.
- **Weekly Coverage Matrix**: W31, W32, W33, W34, W35 contain A3/A4 pairs.
- **Inherited Evidence**: W31 to W35 A3/A4 decisions and corresponding W31-W35 input A1/A2 context. Previous A5 (`aegis-cortex/2026-07-A5-drift-reflect.md`) and A6 (`aegis-cortex/2026-07-A6-aegis-memorize.md`).
- **Independent Evidence Added**: NONE
- **Missing Inputs Preserved**: No missing W31-W35 A3/A4 files. Missing 2026-06 A5/A6 (before inception).
- **External Risk State**: Supported external risk classes for memory poisoning (W31) and false completion/silent loop break (W33-W35).
- **Local Incident State**: NO_LOCAL_INCIDENT_EVIDENCE
- **Proof Boundary Calibration**: Preventive records do not establish local incident existence.

- **A5 路径和状态**: `aegis-cortex/2026-08-A5-drift-reflect.md` (路径存在; CLOSED 仅是日历状态,不单独证明输入质量或维护完成)
- **实际读取的 A1 至 A4**: 08-01 至 08-31 的 A1 和 A2 记录，W31 至 W35 的 A3 和 A4 记录.
- **历史 A6**: `aegis-cortex/2026-07-A6-aegis-memorize.md`
- **当前目标 A6 已排除的确认**: 已明确排除将当前正在生成的 A6 作为历史文件进行检索.排除 sample、mock、fixture、template、example 文件.
- **缺失和降级输入**: 无
- **外部来源**: A5 中继承的外部来源：arXiv 检索 (agent drift, memory poisoning, false completion, silent loop break).
- **来源独立性**: A5 只列出了检索式,未提供逐篇身份与独立性判断. 新增独立证据未建立.
- **网络限制**: 无.

## DURABLE_DOCTRINE_MEMORY

### 记录 1
- **Doctrine ID**: DD-2026-08-01
- **Doctrine Memory**: Control Plane Memory Provenance Tracking.对于长期纪律与输入，必须严格跟踪其来源验证和出处标记.
- **Doctrine Status**: PROVISIONAL_DURABLE
- **Scope**: 仅适用于本控制平面长生命周期上下文的来源和读取，不涉及一般 LLM 行为.
- **External Evidence**: ArXiv 关于 LLM 代理记忆中毒 (memory poisoning) 风险的研究支持（例如源自 W31）.
- **Aegis Repository Evidence**: NO_LOCAL_EVIDENCE (已复核材料未建立本地事故,不等于证明从未发生).
- **Counterevidence**: 无本地反证.
- **Risk Reduced**: 记忆投毒风险、错误纪律生成.
- **Limitations**: 它不证明系统已具有一般性的防记忆投毒能力，仅作用于带有元数据的控制记录追踪.
- **Confidence**: MODERATE (受限的作用范围和无本地事故).
- **Validity Window**: 直至下一个月度闭环重新验证.
- **Why It Survived Reflection**: 作为有效的控制平面防护措施，符合 A5 建议保留 (PRESERVE) 的候选.
- **How Future Jules Should Use It**: 要求每条新的 Daily 和 Weekly 记录都包含活跃的出处字段.
- **How Future Jules Must Not Use It**: 不得声称该纪律可以自动推广到防御任何宿主系统的记忆中毒.
- **Revalidation Trigger**: Monthly Review.
- **Expiration Trigger**: 核心系统架构改变.
- **Host Repository Claim**: NO

### 记录 2
- **Doctrine ID**: DD-2026-08-02
- **Doctrine Memory**: Current-State Dependency Reconciliation.在执行周度聚合(A3/A4)时，必须协调 A1/A2 当前输入状态依赖以防止过期纪律被错误聚合.
- **Doctrine Status**: DURABLE
- **Scope**: Narrowed to Weekly A3 generation scope.
- **External Evidence**: 无外部文献（基于本地实证）.
- **Aegis Repository Evidence**: SUPPORTED_BY_AEGIS_RECORD (2026-08-06 A1/A2 mismatch).
- **Counterevidence**: None.
- **Risk Reduced**: 使用过期的或不一致的状态生成错误的协议纪律.
- **Limitations**: 仅适用于在生成 A3 纪律决定阶段的源状态对齐.
- **Confidence**: HIGH.
- **Validity Window**: 直至下一个月度闭环重新验证.
- **Why It Survived Reflection**: 它解决了有 Aegis 文件事实支持其本地必要性的本地风险，A5建议 PRESERVE.
- **How Future Jules Should Use It**: A3 聚合必须对比和校验上游当日输入的一致性.
- **How Future Jules Must Not Use It**: 不得扩大为通用的同步控制要求.
- **Revalidation Trigger**: Monthly Review.
- **Expiration Trigger**: 无.
- **Host Repository Claim**: NO

## EXPIRING_DOCTRINE

### 记录 1
- **Doctrine**: Double layer verification (status + content) guard for false completion
- **Previous Status**: PROVISIONAL
- **New Status**: PREVENTIVE_REQUIREMENT_RETAINED
- **Reason**: 缺乏本地事故证据不能推出事故从未发生,更不能据此取消内容核验. 降级的是外部失败率向本地的映射和未经测试的有效性声明,不是状态与内容分层核验本身.
- **Superseding Evidence**: `check.py` 是离线结构检查器,不建立沙盒隔离或运行时防故障能力.
- **Aegis Repository Conflict**: NO_LOCAL_EVIDENCE.
- **What Future Jules Must Stop Assuming**: 不得声明本地仓库遭受到外部研究所述的 3-15% 的假装完成失败率，不得将 False Completion 作为已证明的本地事故.
- **Conditions for Reconsideration**: 按任务后置条件和风险持续复核,无需等待本地事故频繁发生才保留内容检查.

## NEXT_MONTH_BASELINE

- **优先观察的可靠性风险**: 控制记录追踪一致性风险、输入不匹配风险.
- **需要避免的幻觉类型**: 错误假设和映射外部失败率（如 false completion 失败率）为本地事实风险.
- **需要继续联网确认的问题**: 暂无特定需即刻联网确认的剩余网络限制.
- **优先来源**: Tier 1 来源、实际 Aegis 代码库运行数据和失败.
- **应降低权重的来源**: 不能对应具体任务和实验条件的概率外推; 不因缺少本地事故而否定相关预防性研究.
- **已知输入缺口**: Aug 15 为事后重建,Aug 16 A2 原始阻塞保留; W36 在原截止点未完成; 原始执行时间未记录.
- **已知网络限制**: 无.
- **待验证纪律**: A6 中提出的出处字段强追踪执行.
- **复核日期**: 2026-09-30.
- **纪律失效事件**: 将 checker 的通过等同于产生语义上无瑕疵或产生有效外部作用的规则.
- **不可触碰边界**: .github/**, docs/**, src/**, data/**, README.md, AGENTS.md, ballast/** 以及宿主代码的任何核心实现.

## BOUNDARY_CHECK

- [x] 未读取宿主仓库
- [x] 未读取 GitHub Actions
- [x] 未读取旧 Nexus
- [x] 未读取 Aegis 之外文件
- [x] 未写入 Aegis 之外文件
- [x] 未把当前 A6 当作历史文件
- [x] 未公开提示词或私有 Memory
- [x] 未把外部风险冒充本地事故
- [x] 未创建无证据绝对化纪律
- [x] 未伪造联网确认

## Current maintenance review

Correction Date: 2026-09-02
Correction Agent: Codex
Monthly Maintenance Status: PARTIAL
Maintenance Coverage: See 2026-09-02-maintenance-log.md for scoped paths and limits.
Maintenance Change Log: 2026-09-02-maintenance-log.md
Maintenance Validation: See the dated log for actual checks and their limits.
Maintenance Unresolved: Full per-claim monthly propagation and all-source replay are not certified by this pass.

The header retains the original author and execution facts. Corrections below or in the body are current review, not a replay of the original task.
