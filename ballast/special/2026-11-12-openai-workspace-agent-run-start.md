# 特殊专题 2026-11-12｜Workspace Agent 新运行启动故障

类型: 特殊专题
主题: Workspace Agent 新运行启动故障
Research Surface: run admission / existing run / aggregate terminal status / action integrity
事件日期: 2026-11-12
实际核验日期: 2026-11-27
Record Provenance: NATIVE_SPECIAL / retrospective public source mapping, not event-day execution

## 触发事件

OpenAI Status 的公开 incident 记录涉及 ChatGPT Agent / new Workspace Agent runs。本专题聚焦 action-integrity 的责任界限：新运行启动受阻是否等同已有运行失败，以及服务恢复能否证明故障期请求全部完成。

## 事实边界

11-12 官方事件调查描述无法启动新的 Workspace Agent runs，之后状态为 Resolved。页面列出受影响组件 Agent；未提供已有运行或具体 run ID 的结果。

服务恢复与历史 effect occurrence、effect-time authorization、当前权限和当前任务完成分别判断；个别请求是否建立 run ID、调度重试、已有运行状态及最终工具 effect 不由该公开记录证明。

## 时间线

- 2026-11-12: 事件归属日，来源所记载的事件和后续时间范围见上。
- 2026-11-27: 实际读取及映射；不声称在事件当日执行过研究。

## Authority and identity map

- Operation: ChatGPT Agent / new Workspace Agent runs 中的单个操作，公开 exact IDs UNKNOWN。
- Approval / current permission: 未公开；不从 status 推导。
- Effect and receipt authority: Workspace run store、调度 receipt、工具 effect sink 与用户授权各自独立，公开事件没有逐项数据。
- Historical authorization / current completion: 必须由对应对象和责任主体核验；当前 UNKNOWN。
- Temporal authority: OpenAI Status 的 incident chronology；不提供逐对象可信 ordering。

## 来源矩阵

| 来源 | Publisher | 查询日期 | 支持命题 | Authority / Freshness | Retention / lifecycle coverage | 限制 |
| --- | --- | --- | --- | --- | --- | --- |
| [官方 incident](https://status.openai.com/incidents/01M76CW2D7FM7K7F8NJ4W0G08N) | OpenAI Status | 2026-11-27 | ChatGPT Agent / new Workspace Agent runs 的事件范围与恢复叙述 | provider event source, current access | public chronology | no exact object receipt |
| [2026-11-12 Daily](../records/2026-11-12.md) | Ballast | 2026-11-27 | effect closure 与 query snapshot identity | repository research context | original dated record | not independent external source |

## 与每日研究的关系

[2026-11-12 Daily](../records/2026-11-12.md) 是相邻受控研究入口，不意味着它实际测试了此次生产事故。NO_DIRECT_EXPERIMENT_YET；本专题不计 controlled experiment 或独立执行窗口。

## 可迁移问题

重启前查询原 intent 与 run identity；无 run receipt 时不得将新请求成功当作旧任务补偿或已有执行完成。

分别判断 old effect HIT、authoritative MISS、UNKNOWN，只有满足 authority/freshness/retention 和当前授权条件时才允许新的 effect。

## 强反例入口

事件明确限定新运行启动；缺乏已有 run 的状态明细，不支持扩大故障范围或补全结果。。若存在同一 operation 的 authoritative receipt 与相反当前状态，应进入 reconciliation 而非从聚合恢复推断成功。

## 已验证事实

- 实际读取官方事件，发布者和影响对象可定位。
- 未公布启动失败率、受影响 run 数或逐任务完成分母；NOT_APPLICABLE。
- 原始来源没有建立本专题所需的所有逐对象授权与结算证据。

## 基于证据的推断

重启前查询原 intent 与 run identity；无 run receipt 时不得将新请求成功当作旧任务补偿或已有执行完成。 这是待验证的控制策略，不是供应商已实施的机制，也不是已运行的本地实验。

## 未验证事项

个别请求是否建立 run ID、调度重试、已有运行状态及最终工具 effect；真实 sink、独立 verifier、effect-time grant、可信跨域时间及 protected completion 均未在本次执行。

## AGI-scale action-integrity relevance

未来跨服务 Agent 的恢复必须把 provider recovery 与 task-level effect、receipt、current completion 分离。不能用可用性绿色状态解除未结算的责任边界。

## 后续研究入口

模拟 admission response lost、未建 run、已建 run 三种路径，注入服务恢复后重试，检查是否重复启动或错误结算。

实际执行：公开来源核验与 action-integrity mapping。完整 checker、真实服务调用和独立实验 NOT_EXECUTED；新增 Daily/experiment/window/CASE/NOTES 均为 0。
