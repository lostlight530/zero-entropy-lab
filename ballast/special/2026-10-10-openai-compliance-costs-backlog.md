# 特殊专题 2026-10-10｜Compliance API 成本数据延迟与账目完整性

类型: 特殊专题
主题: Compliance API 成本数据延迟与账目完整性
Research Surface: reporting freshness / economic effect identity / current state / action integrity
事件日期: 2026-10-10
实际核验日期: 2026-11-27
Record Provenance: NATIVE_SPECIAL / retrospective public source mapping, not event-day execution

## 触发事件

OpenAI Status 的公开 incident 记录涉及 Compliance API Costs data publication.本专题聚焦 action-integrity 的责任界限：成本数据不可见是否可以证明没有费用发生，或恢复说明足以证明全部历史账目已对齐.

## 事实边界

10-10 页面更新显示成本数据发布滞后，产品使用和 API Platform 请求未受影响，其他报告渠道可用；缓解后仍可能有不完整数据，10-13 标记恢复.日期按本次页面显示，搜索摘要的跨时区日期不同，不据此重建精确 UTC.

服务恢复与历史 effect occurrence、effect-time authorization、当前权限和当前任务完成分别判断；每个组织、成本条目、迟到数据的对账状态与账单正确性 不由该公开记录证明.

## 时间线

- 2026-10-10: 事件归属日，来源所记载的事件和后续时间范围见上.
- 2026-11-27: 实际读取及映射；不声称在事件当日执行过研究.

## Authority and identity map

- Operation: Compliance API Costs data publication 中的单个操作，公开 exact IDs UNKNOWN.
- Approval / current permission: 未公开；不从 status 推导.
- Effect and receipt authority: 组织级 usage 与 billing ledger、报告发布水位、账单对账主体；Status 仅能描述发布服务.
- Historical authorization / current completion: 必须由对应对象和责任主体核验；当前 UNKNOWN.
- Temporal authority: OpenAI Status 的 incident chronology；不提供逐对象可信 ordering.

## 来源矩阵

| 来源 | Publisher | 查询日期 | 支持命题 | Authority / Freshness | Retention / lifecycle coverage | 限制 |
| --- | --- | --- | --- | --- | --- | --- |
| [官方 incident](https://status.openai.com/incidents/01M4GV1M2A3K38T73JCVCD9G0R) | OpenAI Status | 2026-11-27 | Compliance API Costs data publication 的事件范围与恢复叙述 | provider event source, current access | public chronology | no exact object receipt |
| [2026-10-15 Daily](../records/2026-10-15.md) | Ballast | 2026-11-27 | notification/offset progress 与独立业务证据分离 | repository research context | original dated record | not independent external source |

## 与每日研究的关系

[2026-10-15 Daily](../records/2026-10-15.md) 是相邻受控研究入口，不意味着它实际测试了此次生产事故.NO_DIRECT_EXPERIMENT_YET；本专题不计 controlled experiment 或独立执行窗口.

## 可迁移问题

缺失 Costs 行必须视为 UNKNOWN；从消费记录和独立账单读取建立 exact affected set，再核对水位及后续修订.

分别判断 old effect HIT、authoritative MISS、UNKNOWN，只有满足 authority/freshness/retention 和当前授权条件时才允许新的 effect.

## 强反例入口

使用未受影响而报告不完整，是对 reporting absence implies no consumption 的直接反例..若存在同一 operation 的 authoritative receipt 与相反当前状态，应进入 reconciliation 而非从聚合恢复推断成功.

## 已验证事实

- 实际读取官方事件，发布者和影响对象可定位.
- 无受影响组织总数、逐账目 backlog 数量或完整性分母；NOT_APPLICABLE.
- 原始来源没有建立本专题所需的所有逐对象授权与结算证据.

## 基于证据的推断

缺失 Costs 行必须视为 UNKNOWN；从消费记录和独立账单读取建立 exact affected set，再核对水位及后续修订. 这是待验证的控制策略，不是供应商已实施的机制，也不是已运行的本地实验.

## 未验证事项

每个组织、成本条目、迟到数据的对账状态与账单正确性；真实 sink、独立 verifier、effect-time grant、可信跨域时间及 protected completion 均未在本次执行.

## AGI-scale action-integrity relevance

未来跨服务 Agent 的恢复必须把 provider recovery 与 task-level effect、receipt、current completion 分离.不能用可用性绿色状态解除未结算的责任边界.

## 后续研究入口

构造已消费未发布、尚未消费、迟到修正三类记录，验证不能将相同空列表作为同一个 economic outcome.

实际执行：公开来源核验与 action-integrity mapping.完整 checker、真实服务调用和独立实验 NOT_EXECUTED；新增 Daily/experiment/window/CASE/NOTES 均为 0.
