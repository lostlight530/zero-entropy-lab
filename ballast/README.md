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

- 最新 Daily: [2026-09-24 asynchronous acceptance 与 cross-service effect/completion authority 分离](records/2026-09-24.md)
- 当前月度事实源: [2026-09](records/2026-09.md)
- 最新特殊专题: [2026-09-18 Agent API overbilling / refund remediation](special/2026-09-18-openai-agent-api-overbilling-refunds.md)
- 最新完整周期审计: [2026-09-13 至 2026-09-19](audits/2026-09-13--2026-09-19.md)
- 当前未闭合周期: 2026-09-20 至 2026-09-24, 当前 5 日 calendar coverage, 其中 2026-09-23 为 RECONSTRUCTION / NOT_RUN / UNVERIFIED, 未达到新的 6/7 日 native audit 边界
- 当前方法: [METHOD.md](METHOD.md)
- 控制案例: [CASES.md](CASES.md)
- 长期发现: [NOTES.md](NOTES.md)
- Daily template: [templates/daily.md](templates/daily.md)
- Monthly template: [templates/monthly.md](templates/monthly.md)

截至 2026-09-24, 9 月共有 24 个 Daily files, 其中 22 个 NATIVE research units, 2 个透明 RECONSTRUCTION gaps, 分别为 2026-09-08 与 2026-09-23. 另有 3 个 September reality-mapping Special, 均于 2026-09-20 实际核验, 不计 controlled experiment 或 independent execution window. 9 月 8 日继续不计独立实验或 execution window.

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
