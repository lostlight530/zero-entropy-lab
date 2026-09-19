# 特殊专题 2026-09-14

类型: 特殊专题
主题: OpenAI Agents API managed-session recovery 与 per-session current completion 边界
Research Surface: current completion / session identity / incident recovery / replay
事件日期: 2026-09-14
实际核验日期: 2026-09-20
Record Provenance: NATIVE_SPECIAL / official incident reality mapping

## 触发事件

OpenAI Status记录2026-09-14 Agents API degraded-performance incident

从13:30 PDT开始, customers using Agents API experienced delays or were unable to start turns in managed sessions

后续status update记录mitigations applied, seeing recovery but service not fully recovered, 最终标记Resolved并说明managed sessions are now processing turns normally

这个event对Ballast的价值不是证明OpenAI session recovery正确, 而是提供一个现实aggregate terminal state, 让我们测试

```text
service / incident recovered
!= every historical session recovered
!= every delayed turn completed
!= safe replay decision for unknown turns
```

## 事实边界

能够由OpenAI official status支持

- incident影响Agents API managed sessions
- customers可能看到delays或unable to start turns
- mitigation被应用
- 中间状态明确存在 `seeing recovery but service is not fully recovered`
- later incident state为Resolved
- final text称managed sessions are now processing turns normally

不能由该status page直接建立

- exact affected-session denominator
- every impacted session identity
- whether each delayed turn had been accepted before failure
- whether any old turn created durable external effects
- whether each historical session resumed
- whether each failed/unknown request is safe to retry
- per-session current completion

因此event state与task/session state保持分离

## 时间线

- 2026-09-14 13:30 PDT: impact start boundary recorded
- 2026-09-14 20:30 PDT: OpenAI reports degraded performance for Agents API managed sessions
- 2026-09-14 23:28 PDT: mitigations applied, seeing recovery, not fully recovered
- 2026-09-14 23:39 PDT: incident Resolved, managed sessions processing turns normally
- 2026-09-16: Parallax uses incident as production runtime transition object
- 2026-09-20: Ballast maps it to action-integrity completion/replay semantics

Later verification does not turn2026-09-20 intoevent date

## Authority and identity map

- task / operation identity: individual Agents API turn IDs not exposed by status page
- approval authority: outside incident page scope
- credential or subject authority: outside incident page scope
- target incarnation or effect set: managed-session population, exact membership unavailable
- effect sink: any downstream tool/effect invoked by session is application-specific and not covered
- receipt authority: application/API-specific receipts, not status page
- completion store: application-specific, not exposed
- temporal evidence authority: OpenAI Status for incident-level timeline
- world/resource revision: service incident updates only

```text
status-page authority for service incident
!= receipt authority for an individual turn
```

## 来源矩阵

| 来源 | Publisher | 查询日期 | 支持命题 | Authority | Freshness | Retention / lifecycle coverage | 限制 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [OpenAI Agents API degraded-performance incident](https://status.openai.com/incidents/01M2H3J1D6Y7RHAP49GRWGJAY0) | OpenAI Status | 2026-09-20 | managed-session impact, mitigation, recovery, Resolved state | primary provider incident source | rechecked 2026-09-20 | public event timeline | no session/turn ledger |
| [Ballast 2026-09-03 Daily](../records/2026-09-03.md) | repository | 2026-09-20 | historical occurrence与current permission分离 | controlled local evidence | historical | point-in-time | does not prove OpenAI internals |
| [Ballast 2026-09-09 Daily](../records/2026-09-09.md) | repository | 2026-09-20 | idempotency replay可能无法恢复historical occurrence timing | controlled local evidence | historical | point-in-time | does not prove OpenAI idempotency contract |

## 与每日研究的关系

- [2026-09-03](../records/2026-09-03.md) 说明prior UNKNOWN不能仅因current permission允许就盲retry
- [2026-09-09](../records/2026-09-09.md) 说明duplicate suppression不等于historical occurrence proof
- [2026-09-13](../records/2026-09-13.md) 说明current approval state不能追溯替代effect-time authorization

Agents API incident给这些问题增加真实session/runtime背景

它不替代任何Daily, 不计controlled experiment

## 可迁移问题

1. managed session某turn timeout时, client如何判断turn未被接受还是accepted但response unknown
2. service recovery后resume旧session是否需要current authorization reread
3. session identity是否绑定external target incarnation/effect set
4. repeated turn是否有stable effect/idempotency identity
5. provider aggregate recovery是否足以决定application safe retry
6. session state恢复后, old external side effect如何reconcile
7. session persistent state与current task intent冲突时谁拥有completion authority

## 强反例入口

- provider/API公开exact per-turn accepted/committed state
- application可通过authoritative operation ID查询old attempt occurrence
- complete affected-session ledger证明所有historical sessions terminal state
- explicit replay/idempotency contract覆盖unknown-turn recovery

这些证据出现后应收窄UNKNOWN范围

## 已验证事实

- OpenAI Status保留该incident timeline
- impact明确涉及Agents API managed sessions
- delays与unable to start turns均被官方描述
- intermediate not-fully-recovered状态存在
- final event状态为Resolved
- final update称managed sessions processing turns normally
- source没有提供per-session/per-turn complete outcome ledger
- 本Special没有调用或故障注入真实Agents API

## 基于证据的推断

对长期Agent, provider恢复后的正确动作依赖old turn的实际历史

如果old request明确未accepted, new execution可能合法

如果old request已accepted并产生effect, blindly retry可能duplicate

如果occurrence unknown, service green并不会把unknown自动变成miss

因此

```text
provider healthy now
!= prior attempt absent
!= retry safe
!= current task complete
```

## 未验证事项

- exact Agents API turn admission contract during incident
- historical effect receipts
- idempotency retention
- session resume semantics under this incident
- individual affected-session completion
- authority state across session recovery
- any customer-specific remediation

## AGI-scale action-integrity relevance

持久Agent会跨provider failure持续存在

它需要把service availability, task/session identity, prior occurrence, current authority与semantic completion分开重建

该事件证明现实窗口存在, 不证明任何具体Agent已经满足Ballast contract

## 后续研究入口

- 使用真实documented async/session API建立unknown-turn recovery experiment
- 将effect sink与session response分离, 注入response loss after effect commit
- service恢复后改变approval/current authority, 测试resume是否重新授权
- target reincarnation后resume旧session, 检查old completion evidence
- 若OpenAI发布RCA或per-session recovery semantics, 建立forward reconciliation
