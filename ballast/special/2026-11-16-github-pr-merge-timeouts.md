# 特殊专题 2026-11-16｜PR merge timeout 与合并结算身份

类型: 特殊专题
主题: PR merge timeout 与合并结算身份
Research Surface: request timeout / merge receipt / commit ancestry / workflow identity / action integrity
事件日期: 2026-11-16
实际核验日期: 2026-11-27
Record Provenance: NATIVE_SPECIAL / retrospective public source mapping, not event-day execution

## 触发事件

GitHub Status 的公开 incident 记录涉及 Pull Requests / Actions start latency。本专题聚焦 action-integrity 的责任界限：合并请求超时或平台恢复是否足以确定具体 PR 是否已经合并及后续 CI 是否运行。

## 事实边界

11-16 09:30–15:55 UTC 部分 PR merge 请求超时，关联 Actions 启动延迟；官方最终报告同时指向 11-13 的前序短事件，归因为存储读取带宽瓶颈，并描述配置修复与负载迁移。

服务恢复与历史 effect occurrence、effect-time authorization、当前权限和当前任务完成分别判断；具体 PR merge receipt、actual merge parent、workflow attempt、人工批准与最终应用结果 不由该公开记录证明。

## 时间线

- 2026-11-16: 事件归属日，来源所记载的事件和后续时间范围见上。
- 2026-11-27: 实际读取及映射；不声称在事件当日执行过研究。

## Authority and identity map

- Operation: Pull Requests / Actions start latency 中的单个操作，公开 exact IDs UNKNOWN。
- Approval / current permission: 未公开；不从 status 推导。
- Effect and receipt authority: PR API、Git commit graph、branch head 与 exact-head Actions；公共报告只支持平台层影响。
- Historical authorization / current completion: 必须由对应对象和责任主体核验；当前 UNKNOWN。
- Temporal authority: GitHub Status 的 incident chronology；不提供逐对象可信 ordering。

## 来源矩阵

| 来源 | Publisher | 查询日期 | 支持命题 | Authority / Freshness | Retention / lifecycle coverage | 限制 |
| --- | --- | --- | --- | --- | --- | --- |
| [官方 incident](https://www.githubstatus.com/incidents/2zfqmghmg3s3) | GitHub Status | 2026-11-27 | Pull Requests / Actions start latency 的事件范围与恢复叙述 | provider event source, current access | public chronology | no exact object receipt |
| [2026-11-16 Daily](../records/2026-11-16.md) | Ballast | 2026-11-27 | exact MISS watermark 与 named path identity | repository research context | original dated record | not independent external source |

## 与每日研究的关系

[2026-11-16 Daily](../records/2026-11-16.md) 是相邻受控研究入口，不意味着它实际测试了此次生产事故。NO_DIRECT_EXPERIMENT_YET；本专题不计 controlled experiment 或独立执行窗口。

## 可迁移问题

重试 merge 前重新取 PR merged 状态、merge SHA 与当前 base/head，确保原批准与当前目标身份仍匹配；状态不明停止。

分别判断 old effect HIT、authoritative MISS、UNKNOWN，只有满足 authority/freshness/retention 和当前授权条件时才允许新的 effect。

## 强反例入口

报告同时说明部分 Git 操作仍可用，不能把 merge 超时扩展成所有 Git 写入失败；缺少逐 PR 结算记录。。若存在同一 operation 的 authoritative receipt 与相反当前状态，应进入 reconciliation 而非从聚合恢复推断成功。

## 已验证事实

- 实际读取官方事件，发布者和影响对象可定位。
- 11-16 merge attempts 平均超时 2.9%，峰值 7.1%；11-13 为 1.7%。这些是各事件请求指标，不是仓库或 PR 的失败概率。
- 原始来源没有建立本专题所需的所有逐对象授权与结算证据。

## 基于证据的推断

重试 merge 前重新取 PR merged 状态、merge SHA 与当前 base/head，确保原批准与当前目标身份仍匹配；状态不明停止。 这是待验证的控制策略，不是供应商已实施的机制，也不是已运行的本地实验。

## 未验证事项

具体 PR merge receipt、actual merge parent、workflow attempt、人工批准与最终应用结果；真实 sink、独立 verifier、effect-time grant、可信跨域时间及 protected completion 均未在本次执行。

## AGI-scale action-integrity relevance

未来跨服务 Agent 的恢复必须把 provider recovery 与 task-level effect、receipt、current completion 分离。不能用可用性绿色状态解除未结算的责任边界。

## 后续研究入口

模拟 merge commit 已写但客户端 timeout、未提交 timeout 与 base drift；比较 blind retry 和 exact receipt plus authorization fence。

实际执行：公开来源核验与 action-integrity mapping。完整 checker、真实服务调用和独立实验 NOT_EXECUTED；新增 Daily/experiment/window/CASE/NOTES 均为 0。
