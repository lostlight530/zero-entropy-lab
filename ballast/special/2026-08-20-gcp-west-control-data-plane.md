# 特殊专题 2026-08-20｜控制面与数据面分离下的资源重试

类型: 特殊专题
主题: 控制面与数据面分离下的资源重试
Research Surface: operation ID / instance UID / data generation / permission
事件日期: 2026-08-20
实际核验日期: 2026-11-27
Record Provenance: NATIVE_SPECIAL / retrospective public source mapping, not event-day execution

## 触发事件

08-20 08:00–10:22 PDT，us-west1 多个服务资源配置失败、延迟及错误升高，涉及控制面与数据面

本次将现实事件转换为可证伪 action-integrity 问题，不宣称执行过供应商生产实验

## 事实边界

供应商报告支持事件范围、阶段与其明确描述的恢复；不支持 具体资源创建、数据写入、持久化和应用健康
创建请求超时后先查询原 operation 和资源 incarnation；资源存在也不能证明数据面已正确或仍有当前授权

## 时间线

- 2026-08-20: 按来源原时区归属事件或最终披露日；详细区间见上述事实，跨日时间不重新解释为本仓执行时间
- 2026-11-27: 实际来源核验和研究映射

## Authority and identity map

- Operation / target: operation ID / instance UID / data generation / permission；逐对象身份 UNKNOWN
- Current permission: UNKNOWN，必须由当前授权主体证明
- Historical authorization / prior effect: UNKNOWN，必须绑定原 effect identity 和 effect-time authority
- Current completion / receipt: 资源配置服务、数据面存储与应用健康检查是不同责任主体
- Temporal authority: 供应商报告提供事件级时间，不提供逐对象可信 ordering

## 来源矩阵

| 来源 | Publisher | 查询日期 | 支持命题 | Authority / freshness | 限制 |
| --- | --- | --- | --- | --- | --- |
| [官方报告](https://status.cloud.google.com/incidents/utF3FMFdQfwBzJcGG6vf) | Google Cloud | 2026-11-27 | 上述公开事件与影响范围 | provider current report | 缺少逐对象 receipt |
| [同期 Daily](../records/2026-08-20.md) | Ballast | 2026-11-27 | 同期研究定位 | repository context | 非事件独立来源 |

## 与每日研究的关系

[同期 Daily](../records/2026-08-20.md) 为已有研究时间锚点，未证明当日研究受到此次事件触发
NO_DIRECT_EXPERIMENT_YET；不增加 Daily、实验或独立执行窗口

## 可迁移问题

创建请求超时后先查询原 operation 和资源 incarnation；资源存在也不能证明数据面已正确或仍有当前授权
将 current permission、prior-effect HIT / authoritative MISS / UNKNOWN、historical authorization、current completion 分开判定

## 强反例入口

在创建提交后响应丢失与未创建的路径使用同一 token；分别检验 exact receipt、实例 UID、数据面 readback 及 current permission
如果出现已提交旧 effect 但观察超时，应拒绝 blind retry；如果缺少 scope-complete negative evidence，应保持 UNKNOWN

## 已验证事实

- 08-20 08:00–10:22 PDT，us-west1 多个服务资源配置失败、延迟及错误升高，涉及控制面与数据面
- 142 分钟为事件范围，没有每个资源的结算分母
- 本次公开报告没有提供逐对象可验证的完整 effect receipts

## 基于证据的推断

创建请求超时后先查询原 operation 和资源 incarnation；资源存在也不能证明数据面已正确或仍有当前授权 属于后续可验证的控制合同，不是对供应商内部实际机制或实验成功的声明

## 未验证事项

具体资源创建、数据写入、持久化和应用健康
真实 effect sink、独立 verifier、签发者授权、可信时间和原始逐对象 runtime evidence 未执行核验

## AGI-scale action-integrity relevance

长期运行 Agent 需要以 operation ID / instance UID / data generation / permission 为证据身份边界，把聚合恢复与实际完成分离，不作能力声明

## 后续研究入口

在创建提交后响应丢失与未创建的路径使用同一 token；分别检验 exact receipt、实例 UID、数据面 readback 及 current permission

EXECUTED: 2026-11-27 public-source verification and reality mapping
NOT_EXECUTED: controlled runtime experiment, independent production replay, full native checker
新增实验、窗口、CASE、NOTES credit 均为 0
