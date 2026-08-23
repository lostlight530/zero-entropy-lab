# 长期记录

## 收录规则

只有达到 METHOD.md 发现门槛的受控实验结论可以进入本文件.

特殊专题、外部事件数量、来源重复和单次广泛故障都不能单独提高结论等级. 特殊专题只能提供研究入口或边界证据, 参与升级的实验仍需链接到具体每日专题.

新证据推翻既有发现时保留原文, 增加失效状态、日期、证据与替代解释.

## 生产路径成功证据不能替代当前后置条件

状态: 发现

适用边界: 受控本地文件产物、结构化输入、分页集合、批量单项结果、发布路径、异步任务与可逆 stateful effect 恢复, 覆盖固定字节、结构化单文件清单、绑定事实源代际的多文件结果、重复字段歧义、跨页身份完整性、批量部分成功、验证后替换、终态产物分裂、后置条件 revision 竞态、合法 reversal 与 stale positive current-state read.

结论: 命令成功、文件存在、生产结果内部自洽、historical receipt hit 或一次成功的 current-state read 都不能独立证明有效完成. 后置验证需要回读当前权威输入并检查任务级内容、结构或语义约束; 对要求当前状态持续成立的 completion contract, 还需要把 postcondition evidence 绑定到真实目标、足够 freshness、被验证 revision 或等价线性化边界与可核验判定时点.

证据:

- [2026-07-21](records/2026-07-21.md) 中截断产物返回成功并通过存在性检查, 内容校验将其拒绝.
- [2026-07-22](records/2026-07-22.md) 中中断清单通过存在性检查, 摘要错误候选通过结构检查, 语义校验将两者拒绝.
- [2026-07-23](records/2026-07-23.md) 中旧基准多文件结果通过内部摘要校验, 当前事实源验证因代际不匹配将其拒绝.
- [2026-07-28](records/2026-07-28.md) 中默认生产解析与共享语义验证同时接受规范化结果, 回读原始成员序列的验证器因重复状态字段将其拒绝.
- [2026-08-03](records/2026-08-03.md) 中偏移分页聚合数量与基线相同且计数验证通过, 身份验证因重复和遗漏将其拒绝.
- [2026-08-04](records/2026-08-04.md) 中批量响应为 HTTP 200 且返回条目数与输入相同, 传输验证通过, 单项与权威副作用验证因 B 失败和缺失将其拒绝.
- [2026-08-05](records/2026-08-05.md) 中候选路径初始验证与后续发布命令均退出 0, 发布后摘要与必需身份验证因路径内容在两阶段之间被替换而拒绝.
- [2026-08-06](records/2026-08-06.md) 中状态资源为 Succeeded 且操作与意图正确, 最终产物缺失, 任务级验证将其拒绝.
- [2026-08-10](records/2026-08-10.md) 中单次后置条件读取在读取后 revision 已推进时仍返回 `already_satisfied`, 绑定 verified revision 的路径识别 `verification_stale`.
- [2026-08-23](records/2026-08-23.md) 中 exact receipt 真实证明 historical effect 已发生, 但 effect 被 compensation 或其他合法 reversal 后 receipt-only 仍错误 completed, current authoritative postcondition 将其拒绝并恢复目标状态.
- [2026-08-24](records/2026-08-24.md) 中 exact receipt 已命中且 postcondition 查询成功, eventual replica 仍返回旧 satisfied value 并形成 completed 1 与 authoritative value `clean` 的假完成, freshness fence 或 authoritative current read 将其拒绝.

独立性: 十一项实验分布在十一个执行日期, 使用不同产物结构、故障位置、输入歧义、集合变化、验证方式、状态 reversal 与读取一致性. 强反例覆盖内部一致性通过、共享解析验证通过、数量验证通过、批量传输验证通过、验证后路径替换、异步终态缺失产物、判定前 revision 漂移、truthful receipt 后合法 reversal 与 successful read 返回 stale positive.

限制: 尚未覆盖真实远端分页快照、真实 Saga engine、真实多区域副作用、跨资源 postcondition、不可逆 occurrence-only effect 与 postcondition read 到 completion commit 之间的新 TOCTOU 窗口. 受控 verifier 仍可能共享场景语义错误, relevant-state projection 的依赖完整性也未在复杂真实任务中证明.

复验: 使用真实支持 eventual 与 strong read 的远端状态服务、跨资源 postcondition 或 compare-and-commit 边界继续攻击本结论. 新证据推翻时保留本条并标记失效.

## 当前状态绑定的有效完成可以使同输入重放保持零副作用

状态: 发现

适用边界: 受控确定性任务, 覆盖事实源代际、非幂等意图、有限去重窗口、共享依赖上下文、半开故障域、批量部分成功恢复与发布摘要绑定.

结论: 只有在完成状态绑定当前事实源、当前意图或当前执行上下文, 并通过任务级后置验证后, 同输入重放才能安全跳过已经完成的副作用. 仅有内部自洽、请求键命中、聚合恢复或全局熔断关闭不足以支持跳过.

证据:

- [2026-07-23](records/2026-07-23.md) 将结果绑定第二代事实源, 重新同步后重放写入 0 次.
- [2026-07-24](records/2026-07-24.md) 将请求键绑定当前意图, 同意图重放写入 0 次, 同键不同意图安全停止.
- [2026-07-25](records/2026-07-25.md) 将完成状态绑定任务上下文, 复发故障中已完成任务调用与写入均为 0.
- [2026-07-26](records/2026-07-26.md) 将半开状态绑定故障域, 完成后重放调用与写入均为 0.
- [2026-07-27](records/2026-07-27.md) 将提交权限绑定当前租约持有者与单调令牌, 已验证当前结果重放写入为 0.
- [2026-07-29](records/2026-07-29.md) 在服务端去重记录过期后回读权威资源, 绑定关联标识、原请求与当前意图的恢复及重放写入为 0.
- [2026-07-30](records/2026-07-30.md) 将资源与去重收据放入单一原子可见快照, 提交前中断未污染权威状态, 恢复后重放写入为 0.
- [2026-07-31](records/2026-07-31.md) 在超时重试后使用单调尝试代际拒绝旧尝试迟到提交, 当前结果通过独立验证, 同输入重放写入为 0.
- [2026-08-04](records/2026-08-04.md) 将完成状态绑定逐项意图和权威副作用, 只重试失败的 B, 完成后重放调用与写入均为 0.
- [2026-08-05](records/2026-08-05.md) 将发布完成状态绑定实际内容摘要和必需身份, 替换状态在写入前被拒绝, 恢复后重放写入为 0.
- [2026-08-06](records/2026-08-06.md) 将异步完成绑定操作、意图、终态和最终产物, 完成后重放新增入队与写入均为 0.

独立性: 十一项实验分布在十一个时间窗口, 分别改变事实源、非幂等意图、去重保留期、共同故障、分区恢复、租约接管、副作用收据双写、超时后的迟到提交、批量部分成功、验证后路径替换和异步终态产物分裂. 强反例覆盖旧事实源自洽、同键不同意图、同标识不同资源、聚合恢复误导、全局熔断过早关闭、过期持有者覆盖、幽灵成功收据、取消后旧结果覆盖、整批重试重复已成功项与已验证路径发布不同字节.

限制: 尚未覆盖真实并发租约、续约确认丢失、时钟漂移、远端索引延迟、跨服务事务、不可逆副作用和验证器完全独立实现. 7 月 30 日只模拟单文件原子可见性, 不证明断电持久性. 7 月 31 日使用确定性事件交错, 不证明真实线程调度与网络取消语义. 零副作用是本组受控重放结果, 不是所有重试都应跳过的通用规则.

复验: 使用并发执行者、独立事实服务或不可逆远端副作用继续攻击本结论. 如果绑定当前状态后仍遗漏必要操作或错误跳过, 保留本条并标记失效.

## 未知结果恢复中的缺失证据不能把不可判定历史降级为未执行

状态: 发现

适用边界: 受控非幂等 unknown-outcome 恢复, 覆盖 authoritative receipt 或 effect history 查询、query outage、stale replica、retention expiry、current resource deletion 与 history pruning.

结论: 在重新执行非幂等 effect 前, negative prior-effect evidence 只有在 exact effect identity、provenance、read freshness 与 retention 或 lifecycle coverage 同时成立时, 才能支持 `never-executed` 判断. query error、stale miss、expired receipt、current live absence 与 pruned history 都属于 `unknown`, 不能自动降级为未执行. current execution permission 仍需独立满足, permission valid 不能修复无效的历史证据.

证据:

- [2026-08-19](records/2026-08-19.md) 中 prior effect 已存在时, receipt query error 被折叠为 miss 或回退 stale negative cache 都产生第二次 effect, tri-state-safe 在 error 时停止并在查询恢复后从 receipt hit 恢复 completion.
- [2026-08-20](records/2026-08-20.md) 中 receipt 已在 primary 提交而 replica 仍落后时, eventual miss 与 pre-attempt watermark 都产生第二次 effect, 能覆盖当前提交的读取保持单次 effect.
- [2026-08-21](records/2026-08-21.md) 中 receipt 查询成功且读取足够新鲜, 但 retention 在合法恢复前过期时 authoritative miss 仍导致第二次 effect, horizon-bound retention 与 exact identity fallback 保持单次 effect.
- [2026-08-22](records/2026-08-22.md) 中 effect 已发生后当前资源被删除, live absence 直接重放产生第二次 effect, exact version history 可恢复 completion, history 被清理后 version miss 再次失去证明能力.

独立性: 四项实验分布在四个独立执行日期, 分别改变证据可用性、读取一致性、证据保留期与资源历史生命周期. 每项都包含正常基线、effect-before-completion crash-window、completed replay 与强反例. 强反例分别覆盖 no-prior 查询恢复、无关 global revision、无关 task marker、无关 delete marker 与 history pruning.

限制: 四项实验均为标准库受控状态机, Python 与 awk verifier 虽实现独立但仍共享事件字段语义和运行环境. 尚未覆盖真实多区域存储、quorum 故障、compaction、生命周期删除延迟、不可逆业务副作用与无法查询历史 effect 的第三方系统.

复验: 使用真实支持条件读取或版本历史的存储继续攻击 query classification、freshness、retention 与 lifecycle 组合. 如果在完整 validity 条件成立后仍出现 duplicate effect 或 false completion, 保留本条并标记失效.
