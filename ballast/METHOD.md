# 方法

## 研究定位

Ballast 是 recovery, completion, evidence validity, authorization freshness, temporal evidence 与 action integrity 的受控研究系统.

它不研究简单的 `命令是否返回 success`. 它研究长期任务在 interruption, retry, ownership handoff, approval drift, target drift, membership drift, distributed visibility, idempotency retention, key lifecycle 与 uncertain time 下, 如何证明一个 autonomous action 仍然合法且完整.

`AGI-scale action integrity` 是下一阶段研究尺度, 不是能力声明. 它表示未来长期自主 Agent 会跨更多工具, authority domain, delegated executor 与时间窗口运行, 因而需要把 action permission, effect occurrence, historical authorization 与 current completion 分开验证.

## 每日研究生产合同

每个 Asia/Shanghai 逻辑日期必须形成一个 Daily research artifact.

Daily 是 mandatory research production, 不是 maintenance/no-change task.

- 一个上海日期最多一个 Daily
- 同日 rerun 只能补强同一 Daily
- `UNKNOWN`, `UNVERIFIED`, `BLOCKED`, `DEGRADED`, `PARTIAL`, `EVIDENCE_INSUFFICIENT` 与 `NO_CONCLUSION` 都是合法 Daily result
- 没有正面发现不等于没有研究产出
- 不为了连续性制造 effect success, CASE advancement, verifier independence 或 NOTES finding
- 真实实验能力暂时缺失时, 仍选择一个能够被证伪的 bounded study, 明确哪些实验未执行
- research complete 与 GitHub delivery complete 分开

历史缺失运行保持原事实. 例如 2026-09-08 的 `RECONSTRUCTION / NOT_RUN / UNVERIFIED` 不因新合同而追溯升级为 NATIVE experiment.

## 来源闸门

1. 来源能够公开访问并准确定位
2. 关键设计尽量由两个彼此独立的权威来源支撑
3. 能够提取状态转换, authorization semantics, verification mechanism 或 failure handling
4. 能够说明适用边界与未覆盖条件
5. 来源冲突保留冲突, external content 不直接变成本地 runtime result
6. vendor contract, standard text 与 local fixture evidence 分开
7. dynamic documentation 记录 access time, 不倒写 historical behavior

来源只支持有限命题. 外部标准不能证明本地 trace, effect count 或 verifier PASS.

## 有效完成定义

一个 task 的有效完成不能由单一 success signal 表示.

至少区分.

`Command Success`

`Transport Success`

`Task Terminal State`

`Historical Effect Occurrence`

`Historical Effect Authorization`

`Current Execution Permission`

`Current Completion Evidence`

`Valid Completion`

这些状态互不自动推出.

对 persistent-state task, `Valid Completion` 至少要求 historical effect 没有被错误重放, historical authorization 合法, current task semantics 仍满足, target/effect-set identity 正确, evidence fresh enough, verifier 对关键事实具有足够独立性.

## 固定研究链

`研究问题 -> 来源依据 -> 可证伪假设 -> 控制条件 -> 实验设计 -> 原始观测 -> 独立验证 -> 强反例 -> 路径比较 -> 暂时结论 -> 复验条件 -> 体系增量`

环境失败, task failure, verification failure 与 evidence insufficiency 分开.

已验证事实, evidence-based inference 与 unknown 分开.

每个 Trial 明确保持条件和改变条件. 多个变量同时变化时不做单因果归因.

## Action-integrity state model

高风险 autonomous action 至少考虑以下状态面.

`INTENT_ID`

`TASK_ID`

`OWNER_GENERATION`

`TASK_STATUS`

`TASK_VALIDITY_WINDOW`

`CREDENTIAL_SUBJECT`

`CREDENTIAL_STATE`

`APPROVAL_ID`

`APPROVAL_ACTION_IDENTITY`

`APPROVAL_VALIDITY_INTERVAL`

`AUTHORITY_GENERATION`

`TARGET_INCARCATION`

`EFFECT_SET_IDENTITY`

`MEMBERSHIP_OR_PREDICATE_WITNESS`

`EFFECT_ID`

`EFFECT_TIME_OR_INTERVAL`

`PRIOR_EFFECT_EVIDENCE`

`CURRENT_COMPLETION_EVIDENCE`

`VERIFIER_AUTHORITY`

`WORLD_OR_RESOURCE_REVISION`

不是每个实验都需要全部字段, 但不能用未建模字段的缺失换取更漂亮的成功路径.

## 三个核心恢复问题

### Current execution permission

问题是 `现在是否允许产生新的 effect`.

至少区分 current normalized intent, owner generation, task validity, task status, credential state, approval state 与所有真正影响本次 action 的 authority dependency.

任务开始时 permission valid 不等于 effect commit 时仍 valid.

普通 pre-effect reread 只能缩短 stale window, 不能消除 `read -> authority change -> effect` TOCTOU.

需要 version, relevant projection, compare-and-effect, transactional predicate 或等价 protected boundary.

Relevant projection 可以减少 unrelated global revision 的 over-fencing, 但必须保守覆盖全部真实 authorization 与 semantic dependency. 无法证明 projection 完整时, 使用 stronger fence 或安全停止.

### Historical prior-effect evidence

问题是 `上一次 unknown attempt 是否已经产生 effect`.

分类只有.

`hit`

`authoritative miss`

`unknown`

Query error, timeout, unavailable, stale cache, uncovered replica MISS, expired retention, pre-attempt watermark 与 unproven cleanup 都属于 `unknown`.

`authoritative miss` 至少需要.

`classification + exact effect identity + provenance + freshness + retention/lifecycle coverage`

Exact effect identity 必须绑定稳定 operation/task identity, normalized action 与真实 target incarnation 或 effect set. Logical name, correlation marker 或 tombstone 只能是线索.

Completion missing 不能证明 effect missing.

Current permission invalid 只阻止新的 effect, 不应该阻止只读 historical reconciliation.

### Current completion evidence

问题是 `当前任务要求现在是否仍满足`.

Historical receipt 或 effect proof 只证明 occurrence.

Persistent-state completion 还需要 current target incarnation/effect set, task semantic dependencies, freshness/revision 与 verifiable decision time.

Compensation, rollback, manual correction, member replacement 或 subsequent legitimate write 可以让 historical effect 仍真实, 但 current completion 已失效.

## Dynamic membership and predicate completeness

Selector-bound, query-bound 或 predicate-bound task 不能把第一次观察到的成员冻结成永久完整集合.

Current completion 对动态集合至少需要.

- current membership or predicate witness
- stable member incarnation identity
- freshness/collection revision or equivalent boundary
- postcondition state for all current relevant members
- protected compare or transaction if membership can change before completion

Watch gap, stale resourceVersion, page cursor, list count equality 与 same logical name 都不能单独证明 current membership completeness.

Authoritative relist 只重新建立 relist 时点的 current truth. Relist 到 completion 之间仍存在 TOCTOU, 需要 protected compare, predicate transaction 或 equivalent fence.

## Approval binding

Approval 不应只绑定 action string.

对动态或高风险 action, approval 至少绑定真正影响本次授权与语义的 relevant projection.

可能包括.

- action identity
- target incarnation
- effect-set membership
- object policy
- environment state
- credential scope
- subject lifecycle state
- approval valid_until
- owner generation

9 月实验表明, `action + UID + policy` 仍可能漏掉 environment, credential scope 或 subject lifecycle state.

不同 verifier 实现如果共享同一个漏字段 specification, 可以共同稳定 PASS 一个 unauthorized effect. 因此 implementation diversity 不等于 semantic independence.

## Verifier semantic independence

Verifier strength 至少从三个维度描述.

1. implementation independence
2. data/evidence-source independence
3. semantic-contract independence

不同 Python 文件, 不同算法或不同进程只能证明 implementation separation.

如果 producer 与 verifier 都从相同错误 field schema 或同一不完整 natural-language spec 派生判断, 它们仍存在 common-mode semantic failure.

更强 verifier 应尽量从 raw authority state, 独立 snapshot, independent evaluator authority 或 independently derived schema 重建关键合同.

任何 verifier 仍共享 scenario vocabulary, TSV field semantics, fixtures 或 runtime environment 时明确披露.

## Unknown outcome and idempotency

非幂等 effect 响应未知时不盲目 retry.

Stable idempotency token 可以抑制 duplicate, 但不能自动证明 historical occurrence time.

两个不同历史可能经过 token replay 后收敛到相同 final state 和 result identity.

因此.

`duplicate suppression != historical occurrence proof`

Idempotency retention window 也不是永久历史记忆.

Token 保留过期后, 同一 token string 不能继续承担原去重保证. 恢复需要 authoritative receipt, exact sink identity, durable operation record 或 equivalent historical evidence.

## Distributed visibility and receipt coverage

跨服务 effect sink 与 receipt authority 不共享事务时, receipt MISS 需要证明它的 visibility coverage 已经覆盖旧 attempt 可能成功的边界.

Applied-through watermark, sequence number, commit index, generation 或 equivalent coverage 可以用于说明 MISS 的 authority range.

如果 coverage 尚未覆盖 old attempt, MISS 保持 UNKNOWN.

固定等待次数不等于 coverage proof.

若 sink 支持 exact effect identity historical query, 它可以作为竞争性 prior-effect authority, 但仍必须说明 retention and freshness.

## Temporal authorization

Authorization 在某个时点有效不等于永久有效.

Current permission, historical authorization 与 historical occurrence 是不同事实.

### Approval expiry

Resume time approval valid 不等于 effect-time approval valid.

当 approval 有 `valid_until`, 需要在 effect linearization boundary 或等价 protected boundary 验证.

### Historical effect authorization

Prior HIT 只证明 occurrence.

要恢复 valid completion, 还需要验证 effect 当时处于合法 authorization interval.

Current approval expired 不能抹掉一个 earlier legally authorized effect. 反过来, receipt HIT 也不能合法化一个 effect-time 已越权的 historical effect.

### Signing-key generation

Historical signed approval 绑定 historical `kid` 或 key generation.

Current issuer key 不应替代 historical signing key identity.

Legitimate key rotation 后, current JWKS-only verification 可能 false reject earlier valid approval. Approval presence-only 又可能 false accept 从未受信任的 historical key.

需要 historical key identity 与 historical trust evidence.

### Revocation and invalidity

Current revoked 不自动表示所有过去 action 都无效.

Revocation processing time, revocation reason 与 historical invalidity boundary 分开.

Compromise 场景可能具有早于 revocation publication 的 invalidity time. Historical verification 应使用 claim-specific boundary, 不能只比较 notice time.

### Timestamp semantic coverage

Timestamp presence 不等于 timestamp 正确覆盖要证明的对象.

Payload timestamp 不自动证明 approval signature creation time.

需要明确 timestamp message imprint or semantic coverage 对应 signature/effect/approval 中哪个对象.

### Timestamp uncertainty and ordering

Nominal `genTime` 的数值顺序不自动构成 strict historical order.

若 timestamp 带 accuracy interval, 只有 uncertainty intervals 能够支持严格分离, 或存在 explicit trusted ordering evidence, 才建立对应顺序.

Same-TSA `ordering=true` 可以提供与 interval separation 不同的 ordering evidence, 但仍不能伪造不存在的 point precision.

## Current completion after replay

Completed replay 用于验证已完成状态下的 idempotent short circuit.

它不能替代 crash-window recovery.

必须分别测试.

- effect committed, completion missing
- receipt delayed
- membership changed before completion
- permission changed before effect
- approval expired before effect
- target reincarnated after read
- historical effect occurred under invalid authorization

## Irreversible occurrence effects

Persistent-state completion 并不适用于所有 side effect.

发送消息, 发布 artifact, 支付, 外部通知或其他 irreversible occurrence 可能没有一个可以长期保持的 persistent postcondition.

下一阶段研究必须把至少两类 effect 分开.

1. occurrence proof and authorization of occurrence
2. durable current-state completion

不能强迫 occurrence-only action 使用一个虚假的 persistent-state contract.

## Real-system research frontier

以下方向优先于重复本地 fixture.

### Real Kubernetes controller

研究 list/watch, resourceVersion, UID, 410 Gone, relist, same-count replacement 与 post-relist membership drift.

### Real database predicate transaction

研究 serializable predicate, phantom, dynamic selector 与 count-preserving replacement.

### Cross-service authorization and effect recovery

把 permission authority, approval authority, receipt authority, effect sink 与 completion store 放在无 shared transaction 环境中.

### Real idempotency retention

跨真实 documented retention window, 检查 same token 是返回 historical identity 还是创建新 effect.

### Real issuer rotation and revocation

使用 OIDC/JWKS 或 equivalent system 保留 historical key generation, 再测试 current discovery 不再列出 old key 后的 recovery.

### Real RFC 3161 TSA

测试 payload-only timestamp, signature-covering timestamp, overlapping accuracy interval, `ordering=true` 与 ordering false.

### Protected approval boundary

在 compare 后, effect commit 前改变 credential subject, owner, approval state 或 dynamic effect set, 确认真正 protected authorization boundary.

### Delegated multi-agent authority

研究 planner, approver, executor, sub-agent 与 effect sink 各自持有部分 authority 时, authorization 如何组合, 如何失效, 如何在 handoff 后恢复.

## 记录类型

### Daily

Primary controlled research for one Shanghai logical date.

One date -> one Daily unit.

Same-day rerun strengthens the same file.

### Special

Reality/vendor/event mapping. Special 不替代 Daily, 不自动计 experiment.

### Audit

Derived review only. Audit 增加 0 experiment, 0 independent execution window, 0 long-term finding.

### Monthly

Rolling research control view. 索引 Daily, Special, actual execution coverage, CASE state, NOTES promotion, current unknown 与 research frontier. 不替代 Daily evidence.

## 结论状态

- 观察: 一个研究批次
- 候选: 至少两个独立研究批次或实质不同条件, 且完成 counterexample check
- 发现: 至少三个独立实验, 跨至少两个实际执行窗口, 完成 strong counterexample coverage
- 失效: 新证据推翻原结论, 保留历史, invalidation date, replacement evidence 与 impact scope

只有发现进入 `NOTES.md`.

Different code, algorithm, file, process or Agent identity 不自动建立 experiment independence. Independence 需要说明输入, failure location, authority, execution path, evidence representation 或 verifier semantics 的实质差异.

## 历史保真

Current truth 不删除 old truth.

Later completion 不证明 earlier completion.

Later authorization 不证明 historical authorization.

Current path presence 不证明 original run success.

New method 不追溯把 historical `RECONSTRUCTION`, `NOT_RUN`, `UNVERIFIED`, `UNKNOWN` 或 `BLOCKED` 改写成成功.

若发现真实 historical defect, correction 必须保留原记录身份和 original execution fact.

## 记录节奏

Daily 使用 `templates/daily.md`.

Special 使用 `templates/special.md`.

Derived audit 使用 `templates/weekly.md`.

Monthly research synthesis 使用 `templates/monthly.md`.

`CASES.md` 只记录真实执行过的 reusable mechanism.

`NOTES.md` 只记录满足长期发现门槛的 durable result.

## 验证边界

`ballast/tools/check.py` 是 structural checker.

Checker PASS 不等于 action-integrity truth PASS.

最终研究声明还需要回答.

- source authority 是否足够
- prior-effect evidence 是否覆盖 old attempt
- current permission 是否在 new effect boundary valid
- historical authorization 是否在 effect-time valid
- target/membership identity 是否 current
- completion evidence 是否 fresh
- verifier 是否具有足够 semantic independence
- unknown 是否被诚实保留

## Monthly research synthesis

月度文件首先维护研究事实, 不是 maintenance completion certificate.

至少记录.

- Daily file coverage
- NATIVE / RECONSTRUCTION / other provenance
- research-unit count
- independent execution-window count
- CASE support changes
- NOTES promotion or no-promotion
- current unresolved mechanisms
- next real-system frontier

自然月结束前只做 as-of synthesis.

## Separate maintenance and correction surface

Maintenance, correction 与 audit 不属于 Daily research production gate.

只有真实 defect 需要修正时才进入对应 surface. 修正不得改写 original execution state.

Monthly maintenance ledger 可以保留, 但其 NOT_RUN/PARTIAL/COMPLETED 不决定每日研究是否产出.
