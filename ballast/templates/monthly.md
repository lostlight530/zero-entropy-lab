# 周期整理模板

## 覆盖区间

记录本周期上海逻辑日期范围与实际执行日期范围.

自然月结束前只做 as-of synthesis, 不提前 seal final month.

## Daily research coverage

分别统计.

- Daily files
- NATIVE research units
- SUBSTITUTE / RECONSTRUCTION records
- actual execution windows
- blocked or unverified days

历史 RECONSTRUCTION 或 NOT_RUN 不因为 later research contract 而追溯计为实验.

## 日报索引

链接每份 Daily 并标明研究问题、Research Surface、Prior-effect Evidence、主要 counterexample 与结论状态.

## 特殊专题索引

单独链接外部事件专题并说明其研究作用. Special 不替代 Daily, 不自动计 experiment.

## 周期审计索引

只索引已经真实存在的 derived audit 与覆盖窗口. Audit 增加 0 experiment, 0 independent execution window, 0 finding, 也不是 Daily research production 的前置条件.

## 运行覆盖

说明本周期实际覆盖的 state transition, interruption/replay, current permission, prior-effect evidence, historical authorization, current completion, dynamic membership, temporal evidence 与 verifier independence.

未执行的真实系统路径保持 NOT_TESTED, 不从 fixture 推断已覆盖.

## Action-integrity surfaces

按本周期真实研究覆盖总结.

- Current execution permission
- Historical prior-effect evidence
- Historical effect-time authorization
- Current completion evidence
- Dynamic target / membership identity
- Temporal evidence and ordering
- Verifier semantic independence
- Delegated authority or multi-agent handoff

只记录真实发生的研究面, 不为了模板覆盖制造实验.

## Current permission coverage

总结实际测试过的 intent, owner generation, task status, credential, approval, valid_until, subject lifecycle, relevant projection 与 protected effect boundary.

说明哪些字段尚未在真实系统中复现.

## Prior-effect coverage

分别统计 HIT, authoritative MISS 与 UNKNOWN 的关键路径.

说明 exact effect identity, receipt authority, visibility watermark, retention window, sink identity 与 reconciliation 的覆盖.

## Historical authorization coverage

总结 effect-time approval validity, key generation, revocation, invalidity time, timestamp semantic coverage, accuracy interval 与 ordering evidence.

Current authorization 与 historical authorization 必须分别总结.

## Current completion coverage

总结 current target incarnation, dynamic effect set, membership/predicate witness, revision/freshness 与 postcondition verification.

Historical occurrence 不自动计 current completion.

## Verifier independence

分别说明 implementation independence, evidence-source independence 与 semantic-contract independence.

如果 verifier 共享 schema, fixture, vocabulary, fields 或 runtime environment, 明确记录.

## 已复验发现

只列出达到 METHOD 门槛的发现并链接原始 Daily.

没有新发现时明确写 `NO_NEW_FINDING`.

## 候选与观察

记录尚未达到长期门槛的机制、current evidence boundary 与下一复验条件.

## Unknown and failure states

保留 UNKNOWN, UNVERIFIED, BLOCKED, DEGRADED, PARTIAL, false completion, duplicate effect, unauthorized effect 与 unverifiable historical order.

这些都是研究结果, 不压缩成一个 FAIL.

## 失效记录

记录被新证据推翻的旧判断, invalidation date, replacement evidence 与 impact scope. 没有失效时明确写 `NONE`.

## 稳定性与质量

分别总结 valid completion, replay consistency, duplicate suppression, false completion, unauthorized effect, semantic independence 与 unresolved evidence gaps.

## 有效速度

只记录完成 producer, verifier, counterexample 与必要 cleanup 后的 validated elapsed 或无效 retry/ops. 不把减少验证当作提速.

## AGI-scale action-integrity synthesis

只基于真实研究回答.

1. 哪些 action-integrity failures 会在长期自主 Agent 中被放大
2. 哪些 authority/effect/completion separation 已经稳定
3. 哪些 temporal and identity assumptions 仍依赖本地 fixture
4. 哪些真实系统实验最值得进入下一周期

本节不得写成 AGI capability claim.

## 下一周期问题

优先能够攻击现有 strongest path 的真实实验.

候选方向包括 real Kubernetes membership, database predicate transaction, cross-service authorization/effect recovery, real idempotency retention, OIDC/JWKS rotation, revocation authority, RFC 3161 TSA, protected approval boundary, delegated multi-agent authority 与 irreversible occurrence effect.

## 派生审计状态

Audit 是 derived review, 增加 0 experiment, 0 independent execution window, 0 finding.

Daily research production 不依赖 audit 是否存在.

## Monthly maintenance ledger

Maintenance 与 research production 分离. 只有真实维护任务运行时填写本节.

Monthly Maintenance Status: NOT_RUN
Maintenance Coverage: TODO
Maintenance Change Log: TODO
Maintenance Validation: NOT_RUN
Maintenance Unresolved: Full monthly maintenance has not run.

如果 maintenance 实际运行, 记录真实 scoped inventory, correction 与 validation. 不允许 maintenance 状态覆盖 Daily research facts, 也不允许 later evidence 倒写 original execution.
