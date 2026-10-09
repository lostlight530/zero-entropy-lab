# Ballast

Ballast 是面向长期自主执行系统的 action integrity 研究系统.

它研究一个任务在中断, 重试, 权限变化, approval 漂移, target 变化, membership 变化, receipt 延迟, idempotency retention 过期, key rotation, revocation 与时间不确定性存在时, 是否还能回答五个不同问题.

1. 现在还允许执行新的 effect 吗
2. 旧 attempt 是否已经产生 effect
3. 旧 effect 在真正发生时是否获得合法授权
4. 当前任务要求的完成状态现在是否仍然成立
5. verifier 是否独立地重建了这些事实, 而不是共享同一个错误假设

Ballast 不把命令成功, transport success, terminal state 或 success string 当成有效完成的替代物.

`AGI-scale action integrity` 是下一阶段研究尺度, 不是 AGI capability claim. 它表示未来长期自主 Agent 会跨越更长时间, 更多工具, 更多 authority domain 与更多 delegated action, 因而需要比普通 retry 更严格的 execution proof.

## 每日研究生产

每个 Asia/Shanghai 逻辑日期必须形成一个 Ballast Daily research artifact.

- 一个逻辑日期最多一个 Daily
- 同日 rerun 只能补强同一文件
- `UNKNOWN`, `UNVERIFIED`, `BLOCKED`, `DEGRADED`, `PARTIAL`, `EVIDENCE_INSUFFICIENT` 与 `NO_CONCLUSION` 都是合法 Daily outcome
- 没有正面发现不等于没有研究产出
- 不允许为了每日连续性制造 experiment success, CASE advancement, verifier independence 或 NOTES finding
- 研究完成但 delivery 失败时, research state 与 delivery state 分开

2026-09-08 的 `RECONSTRUCTION / NOT_RUN / UNVERIFIED` 是历史 point-in-time truth, 新的每日强制生产合同不追溯把它改写成原生实验.

## 当前入口

- 最新 Daily: [2026-10-09 indexed Job success criteria versus exact external effect-set completion](records/2026-10-09.md)
- 当前月度事实源: [2026-10](records/2026-10.md)
- 最新特殊专题: [2026-09-18 Agent API overbilling / refund remediation](special/2026-09-18-openai-agent-api-overbilling-refunds.md)
- 最新完整周期审计: [2026-10-02 至 2026-10-07](audits/2026-10-02--2026-10-07.md)
- 2026-09-26 至 2026-10-01 已形成新的 6 日 derived audit, 其中 2026-09-26 为 RECONSTRUCTION / NOT_RUN / UNVERIFIED. 该 audit 仅做派生审计, 新增实验数量 0, 新增长期结论数量 0, 不重复创建重叠 audit
- 当前方法: [METHOD.md](METHOD.md)
- 控制案例: [CASES.md](CASES.md)
- 长期发现: [NOTES.md](NOTES.md)
- Daily template: [templates/daily.md](templates/daily.md)
- Monthly template: [templates/monthly.md](templates/monthly.md)

截至 2026-09-30, 9 月共有 30 个 Daily files, 其中 27 个 NATIVE research units, 3 个透明 RECONSTRUCTION gaps, 分别为 2026-09-08, 2026-09-23 与 2026-09-26. 另有 3 个 September reality-mapping Special, 均于 2026-09-20 实际核验, 不计 controlled experiment 或 independent execution window. 9 月 8 日继续不计独立实验或 execution window.

> Maintenance annotation — 2026-09-19
>
> 当前入口已推进到 2026-09-22 Daily. 2026-09-01 至 2026-09-18 的 retrospective maintenance second pass 继续完整保留在月度事实源: 历史 Daily 保留各自 point-in-time provenance 与当时 schema, 不按后续模板追溯补栏. 下方 `2026-09-17 action-integrity surfaces` 继续作为当时阶段快照; 2026-09-19 至 2026-09-22 属于之后自然产生的 current state. 2026-09-08 的 `RECONSTRUCTION / NOT_RUN / UNVERIFIED` 保持不变.

## 2026-09-17 action-integrity surfaces

### 1 Current execution permission

任务开始时有权限不等于 effect commit 时仍有权限.

current intent, owner generation, task status, valid_until, credential state, approval state 与 approval-relevant authority projection 必须在真正副作用边界保持当前性.

普通 pre-effect reread 仍可能存在 `read -> authority change -> effect` TOCTOU. 需要 revision, compare-and-effect 或等价 protected boundary.

### 2 Historical prior-effect evidence

completion 缺失不等于 effect 未发生.

Prior-effect evidence 保持 `hit`, `authoritative miss`, `unknown` 三态.

MISS 只有在 exact effect identity, provenance, freshness 与 retention/lifecycle coverage 足够时才是 authoritative miss.

idempotency token 抑制 duplicate 不等于证明 historical occurrence. token retention 过期后同一 token string 不能被当作永久历史记忆.

receipt service MISS 如果 visibility watermark 尚未覆盖旧 attempt 仍是 UNKNOWN.

### 3 Historical authorization validity

current approval 是否仍允许新 effect, 与 historical effect 当时是否获授权分开.

9 月连续实验进一步区分.

- effect-time approval validity
- historical signing key generation
- current issuer key
- revocation processing time
- historical invalidity boundary
- timestamp semantic coverage
- timestamp accuracy interval
- explicit TSA ordering evidence

Current revoked 不自动追溯否定 earlier legitimate effect. Receipt HIT 也不自动把 historically unauthorized effect升级为 valid completion.

### 4 Current completion evidence

historical occurrence 只证明 effect 曾发生.

对 persistent-state task, current completion 还必须绑定 current target incarnation, effect set or membership, task semantics, freshness/revision 与 verification time.

一次 relist 只证明 relist 时点 current set. relist 后到 completion 之间仍可能发生 membership drift.

aggregate state, count equality, same logical name 与 cached membership 不能替代 incarnation-complete current witness.

### 5 Verifier semantic independence

不同代码实现不等于独立验证.

9 月 5–7 的实验已经直接表明, producer 与多个 verifier 如果共享同一个漏字段 authorization schema, 可以使用不同算法却共同稳定 PASS 一个 unauthorized effect.

更强 verifier 需要从 raw authority 或独立事实表示重建真实合同, 并明确自己仍共享哪些 scenario vocabulary, field semantics 或 runtime environment.

## 下一阶段 AGI research frontier

Ballast 下一阶段不研究 `Agent 有没有成功跑完` 这一种状态.

研究对象升级为 `一个长期自主 Agent 的动作是否在正确 authority, 正确对象, 正确时间和正确世界状态下发生, 并且现在仍然满足任务语义`.

优先研究.

1. Delegated authority chain: planner, approver, executor, sub-agent 与 effect sink 跨多个 authority domain 时的授权继承和失效
2. Cross-service effect recovery: approval authority, receipt authority, effect sink 与 completion store 无共享事务时的 occurrence 与 completion 重建
3. Dynamic membership plus authority drift: effect set 与 authorization attributes 同时变化时的 protected predicate completion
4. Irreversible occurrence effects: 发送, 发布, 支付, 通知等 occurrence-only effect 与 persistent-state completion 的不同模型
5. Real temporal evidence: RFC 3161 TSA, issuer key rotation, revocation, accuracy interval 与 ordering evidence 的真实系统复现
6. Independent semantic verification: verifier 使用不同 authority source, schema derivation 与 evidence representation, 而不仅是不同代码

这些 frontier 在真实 Daily 执行前不自动创建新 CASE 支持或 NOTES finding.

## 固定研究链

`研究问题 -> 来源依据 -> 可证伪假设 -> 控制条件 -> 实验设计 -> 原始观测 -> 独立验证 -> 强反例 -> 路径比较 -> 暂时结论 -> 复验条件 -> 体系增量`

环境失败, task failure, verification failure 与 evidence insufficiency 分开.

已验证事实, evidence-based inference 与 unknown 分开.

## 核心状态不能坍缩

`Command Success != Transport Success`

`Transport Success != Task Terminal State`

`Task Terminal State != Valid Completion`

`Historical Occurrence != Historical Authorization`

`Historical Authorization != Current Permission`

`Historical Effect != Current Completion`

`Current Completion != Future Permission`

`Different Implementation != Independent Verification`

`Timestamp Presence != Correct Temporal Coverage`

`Nominal Time Order != Strict Historical Order`

## 阅读顺序

1. `METHOD.md` 说明 action-integrity model, evidence gate 与结论升级
2. `CASES.md` 保存真实执行过的受控机制
3. `records/YYYY-MM-DD.md` 保存 Daily primary evidence
4. `records/YYYY-MM.md` 保存月度事实源与 research frontier
5. `special/` 保存外部事件专题, 不替代 Daily
6. `NOTES.md` 只接收达到长期发现门槛的结果
7. `audits/` 是 derived review, 不是 Daily production gate
8. `templates/` 定义新研究工件结构

## 收录边界

- 必须追溯到公开权威来源, runtime record 或可复现实验
- external contract 只支持其真实语义范围, 不冒充本地 runtime result
- unknown non-idempotent outcome 不随意 retry
- completed replay 不替代 crash-window recovery test
- dynamic effect set 必须处理 membership/incarnation completeness
- approval projection 必须覆盖真实 authorization dependencies
- current state 与 historical occurrence 分开
- 不保存私人信息, hidden prompt, credentials 或无关目录内容

## 本地检查

运行 `python ballast/tools/check.py`.

检查器验证 repository structural contract, 不证明每个 external source, verifier independence 或 action-integrity conclusion 为真.

## 历史与维护边界

Daily records 是 point-in-time primary evidence. Later understanding 不倒写 historical experiment.

Audit, correction 与 maintenance 是独立治理 surface, 不决定 Daily 是否必须产出. `CASES.md` 与 `NOTES.md` 只有真实门槛满足时才更新, 不为了未来 AGI framing 虚增研究支持.


## A2 current-state reconciliation — 2026-09-23

Zero repository main advanced through 2026-09-23 Aegis task delivery. Ballast research credit does not advance from Aegis or host-repository movement.

At this cut the latest retained Ballast primary Daily remains 2026-09-22.

```text
ZERO_MAIN_ADVANCED
!= BALLAST_DAILY_EXECUTED

AEGIS_TASK_DELIVERY
!= BALLAST_EXPERIMENT

DERIVED_POINTER_REVIEW
!= NEW_EXPERIMENT
!= NEW_EXECUTION_WINDOW
```

The Ballast current pointer therefore remains anchored to the latest actual Ballast Daily until a later native Ballast research unit exists.


## Ballast current-state advance — 2026-09-24

2026-09-23 is now represented by a transparent `RECONSTRUCTION / NOT_RUN / UNVERIFIED` gap marker. It adds zero research-unit or execution-window credit.

2026-09-24 contributes exactly one new NATIVE research unit on asynchronous acceptance and cross-service effect/completion authority separation.

```text
HTTP_202_ACCEPTED
!= HISTORICAL_EFFECT_HIT
!= CURRENT_COMPLETION

CURRENT_GOAL_SATISFIED
!= ORIGINAL_ATTEMPT_PROVENANCE

AUTHORITATIVE_MISS
!= CURRENT_RETRY_PERMISSION
```

Current native research endpoint is 2026-09-24.
## A2 current-state reconciliation — 2026-09-24

Current Ballast state after the merged A1 full-period review:

- 2026-09-08 remains `RECONSTRUCTION / NOT_RUN / UNVERIFIED`.
- 2026-09-23 remains `RECONSTRUCTION / NOT_RUN / UNVERIFIED`.
- 2026-09-24 is one NATIVE Daily research unit on asynchronous acceptance, historical occurrence, current completion and current retry permission.
- The current 2026-09-20..2026-09-24 cycle has 5 calendar dates and does not create a new overlapping 6/7-day audit.
- No CASE or NOTES promotion is created by this A2 maintenance pass.

```text
HTTP_202_ACCEPTED
!= EFFECT_OCCURRED
!= CURRENT_COMPLETION

AUTHORITATIVE_MISS
!= CURRENT_RETRY_PERMISSION

RECONSTRUCTION
!= NATIVE_EXPERIMENT
```

The A1 through-2026-09-23 annotations remain intact.


## Ballast current-state advance — 2026-09-25

2026-09-25 contributes exactly one NATIVE research unit on status condition freshness, observed generation and target incarnation.

The 2026-09-20..2026-09-25 six-date window now has a derived cycle audit. The audit adds zero experiment, independent execution-window, CASE or NOTES credit.

```text
STATUS_TRUE
!= STATUS_FRESH_FOR_CURRENT_GENERATION

GENERATION_MATCH
!= CONCRETE_TARGET_INCARNATION

CURRENT_STATUS
!= HISTORICAL_PRIOR_EFFECT_PROVENANCE
```

Current native research endpoint is 2026-09-25.


## Ballast current-state advance — 2026-09-27

2026-09-26 is represented as `RECONSTRUCTION / NOT_RUN / UNVERIFIED` and adds zero experiment, execution-window, CASE or NOTES credit.

2026-09-27 contributes exactly one NATIVE research unit on dynamic membership snapshot freshness versus a protected completion boundary.

```text
FRESH_LIST
!= MEMBERSHIP_FRESH_THROUGH_COMPLETION

WATCH_CONTINUITY
!= CURRENT_EXECUTION_PERMISSION

CURRENT_PREDICATE_SATISFIED
!= PRIOR_UNKNOWN_RECLASSIFIED

LOGICAL_NAME_EQUALITY
!= MEMBER_INCARNATION_IDENTITY
```

The latest complete derived audit remains 2026-09-20..2026-09-25. The new cycle is 2026-09-26..2026-09-27 and no overlapping audit is created.

Current native research endpoint is 2026-09-27.


## Ballast current-state advance — 2026-09-28

2026-09-28 contributes exactly one NATIVE research unit on occurrence-only completion evidence under ambiguous transport.

The research keeps historical occurrence, historical effect-time authorization, current execution permission, target identity/incarnation, temporal evidence and occurrence-only completion as separate axes.

```text
TRANSPORT_AMBIGUITY
!= AUTHORITATIVE_OCCURRENCE_EVIDENCE

DUPLICATE_EVENT_IDENTITY
!= DOWNSTREAM_EFFECT_OCCURRED

HISTORICAL_OCCURRENCE
!= HISTORICAL_AUTHORIZATION

AUTHORITATIVE_MISS
!= CURRENT_RETRY_PERMISSION
```

The latest complete audit remains 2026-09-20..2026-09-25. The current new cycle is 2026-09-26..2026-09-28 with three calendar dates, so no overlapping audit is created.

Current native research endpoint is 2026-09-28.


## Ballast current-state advance — 2026-09-29

2026-09-29 contributes exactly one NATIVE research unit on protected predicate completion under concurrent authority and dynamic membership drift.

The 2026-09-28 occurrence-only Daily remains unchanged and supplies the immediately preceding research boundary. The 2026-09-29 Daily advances from evidence classification into the protected completion boundary without rewriting 2026-09-28 primary evidence.

```text
FRESH_REREAD
!= PROTECTED_COMPLETION

STABLE_SNAPSHOT
!= CURRENT_PREDICATE_AT_COMMIT

SERIALIZABLE_MODE
!= SUCCESSFUL_TRANSACTION_COMMIT

SUCCESSFUL_COMMIT
!= DEPENDENCY_COMPLETE_PREDICATE

HISTORICAL_OCCURRENCE
!= HISTORICAL_AUTHORIZATION
!= CURRENT_PERMISSION
```

The latest complete derived audit remains 2026-09-20..2026-09-25. The current new cycle is 2026-09-26..2026-09-29 with four calendar dates, so no overlapping audit is created.

Current native research endpoint is 2026-09-29.


## Ballast current-state advance — 2026-09-30

2026-09-30 contributes exactly one NATIVE research unit on coordination identity coverage versus protected completion.

The research extends the 2026-09-29 protected-predicate boundary by asking whether the coordination identity itself covers the complete authorization, target and membership decision scope.

```text
RELIABLE_COORDINATION
!= CORRECT_COORDINATION_SCOPE

COORDINATION_OWNERSHIP
!= CURRENT_EXECUTION_PERMISSION

APPLICATION_DEFINED_KEY
!= COMPLETE_TASK_IDENTITY

PROTECTED_TRANSACTION
!= DEPENDENCY_COMPLETE_PROTECTION_DOMAIN
```

The latest complete derived audit remains 2026-09-20..2026-09-25. The current new cycle is 2026-09-26..2026-09-30 with five calendar dates, so no overlapping audit is created.

September is an as-of 2026-09-30 rolling research view. Natural-month finalization is not claimed before the logical day has completed.

Current native research endpoint is 2026-09-30.


## Ballast current-state advance — 2026-10-01

2026-10-01 contributes exactly one NATIVE research unit on preflight validity versus persisted completion under admission and identity drift.

The research keeps preflight/admission validity, historical effect occurrence, historical effect-time authorization, current execution permission, persisted target incarnation, membership completeness, verifier independence, temporal ordering and current completion as separate axes.

```text
PREFLIGHT_VALID
!= PERSISTED_COMPLETION

DRY_RUN_SUCCESS
!= STORAGE_SUCCESS

ADMISSION_SUCCESS
!= DURABLE_EFFECT

PROSPECTIVE_IDENTITY
!= PERSISTED_INCARNATION
```

The 2026-09-26..2026-10-01 six-date window now has one derived cycle audit. The audit adds zero experiment, independent execution-window, CASE or NOTES credit and does not rewrite historical Daily evidence.

Current native research endpoint is 2026-10-01.


## Ballast current-state advance — 2026-10-02

2026-10-02 contributes exactly one NATIVE research unit on deletion acceptance versus cleanup-complete absence under finalizers and cascading ownership.

```text
DELETE_ACCEPTED
!= CLEANUP_COMPLETE

DELETION_TIMESTAMP_SET
!= OBJECT_ABSENT

OWNER_ABSENT
!= DEPENDENT_SET_CLEAN

LOGICAL_NAME_REUSED
!= SAME_TARGET_INCARNATION
```

The latest complete derived audit remains 2026-09-26..2026-10-01. 2026-10-02 starts the next non-overlapping cycle, so no new audit is created.

Current native research endpoint is 2026-10-02.

## Ballast current-state advance — 2026-10-03

2026-10-03 contributes exactly one NATIVE research unit on finalizer release versus independently verified external cleanup under controller provenance and effect-set completeness.

```text
FINALIZER_RELEASE
!= INDEPENDENT_EXTERNAL_CLEANUP_PROOF

CONTROL_OBJECT_ABSENT
!= EXTERNAL_EFFECT_SET_ABSENT

CONTROLLER_PROVENANCE
!= VERIFIER_SEMANTIC_INDEPENDENCE

PRIMARY_TARGET_GONE
!= MEMBERSHIP_COMPLETE_CLEANUP
```

The latest complete derived audit remains 2026-09-26..2026-10-01. The next non-overlapping cycle now contains 2026-10-02..2026-10-03, so no new audit is created.

Current native research endpoint is 2026-10-03.

## Ballast current-state advance — 2026-10-04

2026-10-04 contributes exactly one NATIVE research unit on ambiguous external creation recovery versus authoritative prior-effect absence under incomplete external identity.

```text
LOCAL_CREATE_RECORD_MISSING
!= EFFECT_DID_NOT_OCCUR

CREATE_PENDING
!= AUTHORITATIVE_PRIOR_EFFECT_MISS

FRESH_POINT_LOOKUP
!= COMPLETE_EXTERNAL_SEARCH_COVERAGE

AUTHORITATIVE_MISS
!= CURRENT_EXECUTION_PERMISSION
```

The latest complete derived audit remains 2026-09-26..2026-10-01. The next non-overlapping cycle now contains 2026-10-02..2026-10-04, so no new audit is created.

Current native research endpoint is 2026-10-04.

## Ballast current-state advance — 2026-10-05

2026-10-05 contributes exactly one NATIVE research unit on target precondition identity versus authorization and completion under object reincarnation.

```text
NAME_EQUALITY
!= INCARNATION_IDENTITY

UID_OR_REVISION_MATCH
!= CURRENT_EXECUTION_PERMISSION

PRECONDITION_ACCEPTANCE
!= TASK_COMPLETION

PRIOR_EFFECT_UNKNOWN
!= SAFE_RETRY
```

The latest complete derived audit remains 2026-09-26..2026-10-01. The current non-overlapping cycle now contains 2026-10-02..2026-10-05 with four dates, so no new audit is created.

Current native research endpoint is 2026-10-05.

## Ballast current-state advance — 2026-10-06

2026-10-06 contributes exactly one NATIVE research unit on admission webhook side-effect declaration versus persisted effect and completion under later rejection.

```text
WEBHOOK_ALLOW
!= OBJECT_PERSISTED

SIDE_EFFECT_DECLARATION
!= VALID_EXTERNAL_COMPLETION

EXTERNAL_EFFECT_OCCURRED
!= HISTORICAL_AUTHORIZATION

PERSISTED_TARGET
!= RECONCILIATION_COMPLETE
```

The latest complete derived audit remains 2026-09-26..2026-10-01. The current non-overlapping cycle now contains 2026-10-02..2026-10-06 with five dates, so no new audit is created.

Current native research endpoint is 2026-10-06.

## Ballast current-state advance — 2026-10-07

2026-10-07 contributes exactly one NATIVE research unit on admission reinvocation observation versus final-object and task completion proof.

```text
REINVOCATION_OBSERVED
!= FINAL_OBJECT_PROVEN

FINAL_OBJECT_VALID
!= CURRENT_EXECUTION_PERMISSION

FINAL_OBJECT_VALID
!= PRIOR_EFFECT_RESOLVED

CALLBACK_REPEATED
!= TASK_COMPLETION
```

The 2026-10-02..2026-10-07 six-date window now has one derived cycle audit with zero experiment, independent execution-window, CASE or NOTES credit.

Current native research endpoint is 2026-10-07.

## Ballast current-state advance — 2026-10-08

2026-10-08 contributes exactly one NATIVE research unit on watch progress evidence versus membership-complete current state after history loss.

The latest complete derived audit remains 2026-10-02..2026-10-07. 2026-10-08 starts the next non-overlapping cycle, so no new audit is created.

Current native research endpoint is 2026-10-08.

## Ballast current-state advance — 2026-10-09

2026-10-09 contributes exactly one NATIVE controlled research unit on Kubernetes Indexed Job `SuccessCriteriaMet` / terminal `Complete` versus task-defined external effect-set completion.

```text
SUCCESS_CRITERIA_MET
!= TERMINAL_COMPLETE

TERMINAL_COMPLETE
!= REQUIRED_EXTERNAL_EFFECT_SET_VERIFIED

HISTORICAL_EFFECT_OCCURRENCE
!= HISTORICAL_AUTHORIZATION

CURRENT_PERMISSION
!= HISTORICAL_AUTHORIZATION
```

Thirteen bounded scenarios and four decision paths yield 52 model decisions (11/11/9/0 disagreements with expected labels). Separate-language verifier agreement is 13/13, but semantic independence is limited by shared scenario definitions. Real Kubernetes and external sink effects were NOT_EXECUTED.

The latest complete derived audit remains 2026-10-02..2026-10-07; 2026-10-08..2026-10-09 has not completed its non-overlapping cycle. CASES, NOTES, and METHOD remain unchanged. Monthly/README index updates add zero experiment/window/finding credit.

Current native research endpoint is 2026-10-09.
