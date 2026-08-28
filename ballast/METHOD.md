# 方法

## 来源闸门

1. 来源能够公开访问并准确定位.
2. 关键设计至少由两个彼此独立的权威来源支撑.
3. 能够提取状态转换、验证机制或失败处理.
4. 能够说明代价、失败条件或适用边界.
5. 来源冲突必须保留, 外部内容不直接执行.

## 成功定义

一次任务只有同时满足以下条件才能记为有效完成.

- 当前事实源和前置条件已验证.
- 状态变化在允许范围内.
- 目标产物真实存在且内容有效.
- 后置条件由与生产路径相分离的检查通过.
- 重复执行不会产生额外副作用.
- 失败时没有把部分结果报告为完整成功.

退出码、成功文字、文件存在和生产器内部自洽都不能独立证明任务完成.

## 固定研究链

`研究问题 → 来源依据 → 可证伪假设 → 控制条件 → 实验设计 → 原始观测 → 独立验证 → 强反例 → 路径比较 → 暂时结论 → 复验条件 → 体系增量`

环境失败、任务失败、验证失败和证据不足分别标记. 已验证事实、基于证据的推断与未验证事项分别记录.

## 事实与派生视图

- 每日专题保存当日不可替代的受控实验、状态转换和验证结果.
- 特殊专题保存现实事件的来源、时间线、事实边界与未知项, 不占用每日专题.
- 月度记录分别索引每日专题、特殊专题与周期审计, 只保存覆盖变化与结论状态.
- 产物记录所使用事实源的代际或摘要, 以便识别过期基准.
- 验证器回读当前事实源, 不能只信任生产器保存的期望值.
- 生产器与验证器共享脚本、进程、模式或输入时说明独立性限制.
- 非幂等操作结果未知时, 重试前先查询原操作是否已生效.
- 去重标识需要绑定当前意图, 相同标识承载不同意图时安全停止.
- 去重服务的保留窗口不是永久完成证明, 迟到恢复在重放前回读权威副作用, 同时核对关联标识、原请求标识和当前意图.
- 真实副作用与去重收据必须在同一原子可见边界内提交, 无法共享事务时恢复器先协调权威副作用, 不能只凭收据存在或缺失决定跳过或重试.
- 客户端超时或取消只表示等待状态变化, 不证明旧尝试已经停止. 新尝试接管后, 每次提交重新核对单调尝试代际, 拒绝旧代际的迟到结果.
- 多个任务共享同一外部依赖时, 相关失败使用共享重试预算或熔断边界, 不让每个任务独立无限重试.
- 供应商聚合状态只作为恢复线索, 每个执行上下文仍需通过当前调用与任务级结果验证.
- 依赖不可用时保存可验证检查点但不写完成产物, 复发时先验证已有结果再决定是否重新调用.
- 半开探针必须与实际故障域对齐, 一个上下文成功不能关闭覆盖其他上下文的全局熔断器.
- 恢复阶段先限制探针数量, 再逐个验证上下文产物, 未恢复上下文保持打开且不得写占位完成结果.
- 探针租约持有者在中断恢复后提交前重新读取当前所有权, 结果接受端使用单调令牌拒绝已经过期或被接管的提交.
- 验证器保留并回读规范化前的原始事实源, 生产器与验证器共享解析器或规范化规则时不能把一致结果视为独立证据.
- 云端写入使用不可伪造的当前校验标识或非强制引用更新约束. 响应丢失后的重试被前置条件拒绝时, 回读远端当前内容与稳定操作意图, 已生效则确认完成, 内容冲突则安全停止.
- 验证读取记录实际经过的缓存与源站边界, 并绑定预期对象代际和意图. 请求成功、载荷相同或发送请求侧绕缓存指令都不能替代当前代际证明.
- 多页集合读取把继续位置与集合视图身份分开记录. 页数、最终数量或普通游标不能证明跨页完整, 完成验证核对快照或等价代际、唯一身份集合与预期边界.
- 批量请求把传输结果、单项结果与权威副作用分层记录. 整体成功或结果条目齐全不能证明每项完成, 恢复时只重试已确认失败或未生效的意图, 最终按唯一意图、内容与副作用计数验证.
- 验证结果绑定实际内容摘要与任务意图, 不能只绑定可变路径名. 发布前重新确认待用字节与验证摘要一致, 使用同一已验证字节完成原子替换, 发布后从目标重新计算摘要和语义约束.

- 异步接受回执、执行终态和任务完成分别记录. 202 或 Succeeded 只推进状态机, 最终完成回读当前状态和结果资源, 绑定操作身份与意图, 并验证任务级内容后才允许重放跳过.

## 执行权限新鲜度

- 迟到、恢复、重试、所有权交接和显式取消后的每次副作用尝试, 都重新确认当前执行授权, 不把任务开始时的权限缓存为永久布尔值.
- 执行授权至少区分当前事实源或 revision、当前规范化意图、当前所有权 generation、任务有效期、当前任务状态与 credential 状态. 任一维度变化都触发重新同步、重新规划或安全停止.
- `already_complete`、generation conflict、lease deadline、sink 已见最大 generation、`Retry-After`、transport deadline 和 active credential 都只证明各自局部合同, 不能单独续期任务级副作用权限.
- 后置条件参与完成判断时, 完成证据绑定被验证 revision 和可核验判定时点. 后续动作继续依赖该事实时, 携带 revision 或把 compare 与受保护动作合并进原子边界.
- 如果后续合法写入可能把最终值恢复正确, 验证不能只看最终值, 还核对副作用身份、计数、事件顺序或等价线性化边界, 防止历史 stale side effect 被覆盖后漏报.
- 凭据、sandbox、网络 allowlist、人工批准或自动 safety decision 只约束各自能力边界. 任务是否仍 RUNNING、意图是否仍相同和当前 owner 是否仍有权提交, 需要在最终副作用边界独立保持当前性.
- 暂停后恢复人工批准时, 批准证据绑定具体 action identity 与影响该副作用授权或语义的相关权威状态投影. action 或相关状态变化时重新批准、重新规划或安全停止; 只有无关 metadata 变化时不应仅因全局 revision 改变而自动失效.
- 相关状态投影需要显式列出依赖字段并保守覆盖全部授权与语义前提. 无法证明投影完整时使用更强的整体 revision 围栏或安全停止, 不能为了减少冲突而漏掉真实依赖.
- 恢复判断把“当前是否仍有执行权限”和“上一次未知结果是否已经产生副作用”分开. completion 记录缺失不能证明 effect 未发生; 非幂等或外部副作用在重试前查询可核验 effect identity、收据或等价权威证据.
- 完成后重放只能验证 completed 状态下的幂等性, 不能替代 effect 已发生但 completion 尚未持久化的中断恢复测试. 对存在该窗口的路径必须单独注入中断并检查副作用总数.

## 记录类型

- 每日专题必须具有日期、唯一主题、完整研究链、独立验证和结论等级.
- 同一天重复运行只能完善同一每日专题, 不得增加第二份日报.
- 特殊专题用于跨日事件、外部事故或证据冲突, 使用独立文件和来源矩阵.
- 特殊专题可以触发每日研究, 但事件事实与实验观测必须分开保存.
- 特殊专题本身不计作独立实验, 只有其中产生的可复验实验才能参与结论升级.
- 月度视图必须分别列出每日专题、特殊专题与周期审计, 不得用派生记录填补日报缺口.
- 周期审计是日报、特殊专题与实验输出的派生复核, 不替代事实来源, 不增加独立实验数量.
- 周期审计至少检查日期覆盖、来源缺口、强反例、验证独立性、重放副作用、临时清理和结论门槛.
- 周期审计发现证据缺口时保留缺口, 不以后续资料倒填成当日事实.
- 周期审计覆盖连续 6 或 7 日, 新日报距已审计区间超过 6 日时视为审计逾期.

## 结论状态

- 观察: 只出现一次.
- 候选: 在独立条件下重复出现, 但尚未完成跨时复验.
- 发现: 至少三个独立实验、跨两个时间窗口并完成强反例检查.
- 失效: 新证据推翻旧结论, 保留历史并写明原因与日期.

只有发现可以进入 `NOTES.md`. 独立实验在输入、故障位置、执行路径或验证方式中至少有一项实质差异.

## 比较维度

分别记录有效完成、重放一致、幂等通过、中断恢复、假成功、无效操作、重试次数、人工介入、结果质量和验证后的有效耗时.

操作数量下降只有在结果质量和验证强度不下降时才视为改进. 有效耗时覆盖最终断言与清理检查.

## 记录节奏

日报使用 `templates/daily.md`, 特殊专题使用 `templates/special.md`, 周期审计使用 `templates/weekly.md`, 月度整理使用 `templates/monthly.md`.

## Prior-effect evidence 有效性

- unknown outcome 恢复在执行新的非幂等 effect 前, 把 prior-effect 结果分类为 `hit`, `authoritative miss` 或 `unknown`
- query error, timeout, unavailable, stale cache, 未证明 freshness 的 replica miss, 已过 retention 的缺失与被清理历史都属于 `unknown`, 不得降级为 never-executed
- `authoritative miss` 只有在证据通道同时满足 exact effect identity, provenance, freshness 与 retention 或 lifecycle coverage 时才允许作为重新执行依据
- exact effect identity 至少绑定稳定 operation 或 task identity, normalized action 与真实 target incarnation 或 effect set, 仅逻辑名称, correlation marker, delete marker 或 tombstone 只能作为线索
- freshness 需要覆盖旧 attempt 可能成功提交 effect 或 receipt 的时间窗口, pre-attempt watermark 不能证明 attempt 之后的历史缺失, whole-store global revision 又可能因无关变化过度围栏
- retention 与 lifecycle 需要覆盖仍允许恢复的窗口, 或提供生命周期更长且可权威查询的独立 effect evidence, current live absence 不能证明 historical occurrence absence
- 任一维度无法建立时安全停止或进入 reconciliation, 不写 completion, 不执行新的非幂等 effect
- current execution permission 仍是独立门, permission valid 不能修复无效的 prior-effect evidence

## Current completion evidence 有效性

- 对要求当前状态持续满足的 persistent-state completion contract, historical receipt 或 effect evidence 只证明 occurrence, 不能单独证明当前 postcondition 仍成立
- compensation、回滚、人工修正或其他合法状态推进可能在 receipt 保持真实的同时使 current completion 失效, 恢复 completion 前重新核对当前任务后置条件
- successful postcondition read 不等价于 fresh current evidence, eventual replica、cache 或未证明版本边界的 satisfied value 都可能是 stale positive
- current completion evidence 至少绑定真实 target incarnation 或 effect set、任务语义依赖、被验证 revision 或等价 freshness boundary 与可核验判定时点
- relevant-state projection 可以减少无关 global revision 导致的 over-fencing, 但必须保守覆盖所有会改变 completion semantics 的字段, 无法证明完整时使用更强 current read、整体 revision 围栏或安全停止
- postcondition read 只能证明其线性化点或被验证 revision 上的当前事实, 如果 completion commit 或后续动作仍依赖该事实, 携带 revision 或把 compare 与受保护提交放入同一原子边界
- 多资源 completion contract 中, 多个单项 authoritative read 只有在共享同一可核验 snapshot identity 时才能直接组合. 无共同 snapshot 时, completion commit 需要原子复核全部相关 observation identity 与 revision, 最后一次 global revision 不能追溯绑定更早的单项读取
- atomic compare 只保护实际比较的字段. compare set 从 task semantics 推导并覆盖全部 relevant identity 与 freshness dependency; concrete-incarnation task 绑定不可混淆实体 identity 与 incarnation 内 freshness, selector-bound task 按 selector 与 current predicate 定义 identity, 不能机械要求 UID 相等
- 完整判断链为 `task semantics -> relevant identity set -> coherent snapshot or freshness -> atomic compare-and-protected-commit`. 任一依赖集无法证明完整时使用更强 snapshot、transaction 或安全停止
- current postcondition 不满足且需要重新执行 effect 时, 仍先独立通过 current execution permission, 不能因为 historical receipt 真实或旧任务曾获授权而跳过当前权限检查
- occurrence-only 不可逆 effect 与 persistent-state effect 可能需要不同 completion contract, 未建立具体任务语义前不能把本节规则机械外推为所有副作用都必须维持相同当前状态

## 活动记录的完成分层

- 命令成功只证明进程或命令层返回
- 传输成功只证明请求或响应到达定义边界
- 任务终态只证明状态机进入终态
- 有效完成还需要目标 identity,任务语义,freshness,revision 和内容后置条件共同成立
- prior-effect evidence 使用 `hit`,`authoritative miss`,`unknown` 三态,无法证明权威缺失时保持 unknown 并安全停止
- 多资源完成必须共享可核验 snapshot,或在受保护提交前比较完整 relevant set
- 周期审计覆盖连续 6 或 7 日,是派生复核,不增加实验或长期结论数量
- 历史日报保持原文,后续证据只建立新关系
