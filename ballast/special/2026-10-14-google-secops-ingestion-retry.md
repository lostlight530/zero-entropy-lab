# 特殊专题 2026-10-14｜SecOps 入口差异与补送责任

类型: 特殊专题
主题: SecOps 入口差异与补送责任
Research Surface: ingestion route / recovery surface / retry obligation / action integrity
事件日期: 2026-10-14
实际核验日期: 2026-11-27
Record Provenance: NATIVE_SPECIAL / retrospective public source mapping, not event-day execution

## 触发事件

Google Security Products Status 的公开 incident 记录涉及 australia-southeast1 / me-west1 ingestion and search.本专题聚焦 action-integrity 的责任界限：同一服务恢复声明能否对直接 API 和托管转发器推出相同的历史日志完成状态.

## 事实边界

官方记录 US/Pacific 10-14 12:05–14:06 的摄取与检测影响，Search 和 Dashboards 在 13:25 已恢复.无自动重试的直接 API 客户需补送报错日志，而 managed forwarder/agent 会自动处理缓冲日志.

服务恢复与历史 effect occurrence、effect-time authorization、当前权限和当前任务完成分别判断；逐日志接收回执、去重、检测执行和客户是否完成补送 不由该公开记录证明.

## 时间线

- 2026-10-14: 事件归属日，来源所记载的事件和后续时间范围见上.
- 2026-11-27: 实际读取及映射；不声称在事件当日执行过研究.

## Authority and identity map

- Operation: australia-southeast1 / me-west1 ingestion and search 中的单个操作，公开 exact IDs UNKNOWN.
- Approval / current permission: 未公开；不从 status 推导.
- Effect and receipt authority: 客户端日志、转发器缓冲、摄取回执及检测结果分别负责各阶段，不由公共状态页统一证明.
- Historical authorization / current completion: 必须由对应对象和责任主体核验；当前 UNKNOWN.
- Temporal authority: Google Security Products Status 的 incident chronology；不提供逐对象可信 ordering.

## 来源矩阵

| 来源 | Publisher | 查询日期 | 支持命题 | Authority / Freshness | Retention / lifecycle coverage | 限制 |
| --- | --- | --- | --- | --- | --- | --- |
| [官方 incident](https://status.cloud.google.com/security/incidents/bqaZGXFiu5e3V8dVZb7v) | Google Security Products Status | 2026-11-27 | australia-southeast1 / me-west1 ingestion and search 的事件范围与恢复叙述 | provider event source, current access | public chronology | no exact object receipt |
| [2026-10-14 Daily](../records/2026-10-14.md) | Ballast | 2026-11-27 | event delivery identity 与 delegated authority 的边界 | repository research context | original dated record | not independent external source |

## 与每日研究的关系

[2026-10-14 Daily](../records/2026-10-14.md) 是相邻受控研究入口，不意味着它实际测试了此次生产事故.NO_DIRECT_EXPERIMENT_YET；本专题不计 controlled experiment 或独立执行窗口.

## 可迁移问题

按来源入口及 event ID 分离恢复策略；直接 API 需先确认 prior effect 与重复抑制合同，托管缓冲则跟踪持久队列及消费进度.

分别判断 old effect HIT、authoritative MISS、UNKNOWN，只有满足 authority/freshness/retention 和当前授权条件时才允许新的 effect.

## 强反例入口

官方给两类入口不同的补送义务；相同 terminal label 不能消除不同责任..若存在同一 operation 的 authoritative receipt 与相反当前状态，应进入 reconciliation 而非从聚合恢复推断成功.

## 已验证事实

- 实际读取官方事件，发布者和影响对象可定位.
- 摄取影响 121 分钟，Search/Dashboard 影响 80 分钟；均为公开时间区间，不是逐日志完成率.
- 原始来源没有建立本专题所需的所有逐对象授权与结算证据.

## 基于证据的推断

按来源入口及 event ID 分离恢复策略；直接 API 需先确认 prior effect 与重复抑制合同，托管缓冲则跟踪持久队列及消费进度. 这是待验证的控制策略，不是供应商已实施的机制，也不是已运行的本地实验.

## 未验证事项

逐日志接收回执、去重、检测执行和客户是否完成补送；真实 sink、独立 verifier、effect-time grant、可信跨域时间及 protected completion 均未在本次执行.

## AGI-scale action-integrity relevance

未来跨服务 Agent 的恢复必须把 provider recovery 与 task-level effect、receipt、current completion 分离.不能用可用性绿色状态解除未结算的责任边界.

## 后续研究入口

使用相同日志 ID 注入直接 API 响应丢失与托管队列重放，验证 route-specific retry policy 不产生重复或漏送.

实际执行：公开来源核验与 action-integrity mapping.完整 checker、真实服务调用和独立实验 NOT_EXECUTED；新增 Daily/experiment/window/CASE/NOTES 均为 0.
