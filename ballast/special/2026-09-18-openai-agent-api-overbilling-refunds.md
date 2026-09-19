# 特殊专题 2026-09-18

类型: 特殊专题
主题: OpenAI Agent API container overbilling, refund remediation 与 economic-effect completion
Research Surface: durable effect / irreversible occurrence / remediation / current completion
事件日期: 2026-09-18
实际核验日期: 2026-09-20
Record Provenance: NATIVE_SPECIAL / official incident reality mapping

## 触发事件

OpenAI Status记录2026-09-18开始的Agent API hosted-container overbilling incident

官方timeline先说明OpenAI-hosted containers可能产生higher-than-expected charges并准备refunds

后续明确正在review affected usage, identify impacted customers and calculate refunds

mitigation applied后new sessions no longer encounter the issue

最终status写all impacted services have now fully recovered

这个event直接暴露Ballast长期需要独立建模的一类effect

```text
economic occurrence
!= runtime state
!= compensation calculation
!= compensation delivery
!= current remediation completion
```

它比单纯API outage更接近不可逆/外部责任effect

## 事实边界

official status直接支持

- hosted-container billing issue existed
- some sessions could incur higher-than-expected charges
- OpenAI intended refunds for impacted customers
- affected usage was being reviewed
- impacted customers were being identified
- refunds were being calculated
- mitigation was applied
- new sessions no longer encountered the issue after mitigation
- all impacted services were later described as fully recovered

official status在checked terminal text中不直接支持

- exact impacted-customer denominator
- exact overcharged amount per customer
- every impacted customer identified
- every refund calculation completed
- every refund issued
- every refund received
- economic remediation completed for all objects

因此

```text
service recovery
!= compensation completion
```

## 时间线

- 2026-09-18 22:29 PDT: investigating higher-than-expected charges for OpenAI-hosted containers
- 2026-09-18 23:22 PDT: ongoing fix, affected usage review, impacted-customer identification and refund calculation described
- 2026-09-19 01:08 PDT: mitigation still being implemented
- 2026-09-19 05:00 PDT: mitigation applied, new sessions stated not to encounter issue
- 2026-09-19 07:52 PDT: all impacted services stated fully recovered
- 2026-09-20: Ballast reality mapping and Parallax world-state research both distinguish service terminal state from refund-remediation object state

event timeline与refund lifecycle不能坍缩成一个timestamp

## Authority and identity map

- task / operation identity: hosted-container sessions, exact IDs not public
- approval authority: customer use/billing contract outside status-page detail
- credential or subject authority: customer/account identity, exact affected members not public
- target incarnation or effect set: charge/economic-effect set for impacted usage
- effect sink: billing/accounting system
- receipt authority: billing records/account statements, not fully exposed in status page
- completion store: refund/remediation system, not public
- temporal evidence authority: OpenAI Status for incident updates
- remediation authority: OpenAI/provider process, exact per-customer state unavailable

一个status page可以对service incident state权威, 但它没有因此变成完整refund ledger

## 来源矩阵

| 来源 | Publisher | 查询日期 | 支持命题 | Authority | Freshness | Retention / lifecycle coverage | 限制 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [OpenAI Agent API container overbilling incident](https://status.openai.com/incidents/01M2VA7X37P1ASADSNZ1CG4N4D) | OpenAI Status | 2026-09-20 | overbilling, refunds planned/calculated, mitigation, new-session protection, service recovery | primary provider incident source | current recheck 2026-09-20 | public incident chronology | no per-customer refund ledger |
| [Ballast 2026-09-03 Daily](../records/2026-09-03.md) | repository | 2026-09-20 | occurrence与current permission分离 | controlled evidence | historical | point-in-time | local model |
| [Ballast 2026-09-09 Daily](../records/2026-09-09.md) | repository | 2026-09-20 | duplicate suppression不等于occurrence proof | controlled evidence | historical | point-in-time | local model |
| [Ballast 2026-09-13 Daily](../records/2026-09-13.md) | repository | 2026-09-20 | historical authorization与current approval expiry分离 | controlled evidence | historical | point-in-time | local model |

## 与每日研究的关系

- [2026-09-03](../records/2026-09-03.md): prior-effect occurrence与current new-effect permission分离
- [2026-09-09](../records/2026-09-09.md): final state convergence不能反推historical occurrence chronology
- [2026-09-13](../records/2026-09-13.md): historical validity不能由current authority倒写
- [2026-09-20](../records/2026-09-20.md): sender proof/replay freshness只回答current request proof的一部分, 不替代historical effect/remediation state

这个现实事件扩展问题空间到billing/refund这样的economic effect

Special本身不计controlled experiment

## 可迁移问题

1. long-running Agent产生billing/payment-like effect后, historical occurrence由哪一个authority证明
2. provider发现overcharge后, affected member set如何固定和证明完整
3. mitigation只保护new sessions时, old economic effects如何reconcile
4. refund calculation, refund issuance与customer receipt应该是一个completion state还是多个state
5. compensation发生后, original effect是否仍应保留historical occurrence
6. service incident Resolved与financial remediation completion是否由不同authority拥有
7. autonomous system能否在未确认old remediation前继续产生新的相似economic effect

## 强反例入口

以下evidence会把current UNKNOWN收窄

- authoritative impacted-customer complete set
- exact refund object IDs
- all-refunds-issued terminal statement
- customer-level receipt confirmation
- machine-readable remediation ledger with coverage/watermark
- independent account reconciliation confirming provider settlement

若后续只有service status green而无refund evidence, 当前边界保持

## 已验证事实

- OpenAI official incident存在
- incident明确涉及higher-than-expected hosted-container charges
- OpenAI明确写preparing refunds
- later update明确写review affected usage, identify impacted customers and calculate refunds
- mitigation后new sessions被声明不再遇到issue
- final incident text称all impacted services fully recovered
- checked source未写all refunds completed
- 本Special未访问用户billing records或customer data

## 基于证据的推断

这是Ballast `irreversible occurrence effects` 与 `current completion after compensation` 问题的高价值现实映射

billing charge一旦发生, 即使服务bug修复, historical effect仍然存在

refund可以改变current economic balance, 但不能删除original occurrence

因此更完整的恢复链是

```text
historical charge occurrence
→ affected-set reconstruction
→ remediation authorization
→ refund calculation
→ refund effect
→ refund receipt / current economic state
```

服务恢复只是其中一个相关但不同的state

## 未验证事项

- number of impacted customers
- exact charge objects
- refund amount calculation method
- whether all refunds were issued
- whether all customers received remediation
- accounting retention / receipt authority
- customer-specific authorization/compliance handling
- whether provider later published separate refund-completion notice

## AGI-scale action-integrity relevance

长期自主Agent未来可能直接消费compute, purchase resources, send payments或触发其他economic effects

这些effect常常不可用单一persistent postcondition描述

正确治理需要同时保留

```text
occurrence proof
historical authorization
current permission
compensation/remediation
current completion
```

该事件是现实问题映射, 不是AGI capability或安全认证

## 后续研究入口

- 构造economic occurrence + lost response + later compensation fixture
- 将charge receipt authority与refund authority拆成两个服务
- 注入partial member-set recovery, 测试遗漏affected customer的false completion
- 比较 `refund issued` 与 `refund received` completion semantics
- 在compensation后测试historical occurrence是否仍可审计恢复
- 若OpenAI发布后续refund-completion声明, 以前向correction更新本Special
