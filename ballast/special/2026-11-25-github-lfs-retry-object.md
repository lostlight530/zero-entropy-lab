# 特殊专题 2026-11-25｜LFS 对象上传重试与 digest 验证

类型: 特殊专题
主题: LFS 对象上传重试与 digest 验证
Research Surface: LFS OID / pointer / commit / object receipt / retry
事件日期: 2026-11-25
实际核验日期: 2026-11-27
Record Provenance: NATIVE_SPECIAL / retrospective public source mapping, not event-day execution

## 触发事件

11-25 21:30 UTC至26日00:28 UTC Git LFS 降级，客户端部分自动重试成功；流量迁移后恢复，其他 Git 操作未受影响

本次将现实事件转换为可证伪 action-integrity 问题，不宣称执行过供应商生产实验

## 事实边界

供应商报告支持事件范围、阶段与其明确描述的恢复；不支持 逐对象写入、readback、持久化及授权
普通 Git commit 或 LFS 客户端重试成功不等于指定 OID 可用；核对目标对象 digest 和 pointer 引用，确认 prior effect 后才重试

## 时间线

- 2026-11-25: 按来源原时区归属事件或最终披露日；详细区间见上述事实，跨日时间不重新解释为本仓执行时间
- 2026-11-27: 实际来源核验和研究映射

## Authority and identity map

- Operation / target: LFS OID / pointer / commit / object receipt / retry；逐对象身份 UNKNOWN
- Current permission: UNKNOWN，必须由当前授权主体证明
- Historical authorization / prior effect: UNKNOWN，必须绑定原 effect identity 和 effect-time authority
- Current completion / receipt: Git commit graph 与 LFS object store 是独立权威，客户端 ACK 只覆盖响应层
- Temporal authority: 供应商报告提供事件级时间，不提供逐对象可信 ordering

## 来源矩阵

| 来源 | Publisher | 查询日期 | 支持命题 | Authority / freshness | 限制 |
| --- | --- | --- | --- | --- | --- |
| [官方报告](https://www.githubstatus.com/incidents/m0wvf9pt3l0l) | GitHub Status | 2026-11-27 | 上述公开事件与影响范围 | provider current report | 缺少逐对象 receipt |
| [同期 Daily](../records/2026-11-25.md) | Ballast | 2026-11-27 | 同期研究定位 | repository context | 非事件独立来源 |

## 与每日研究的关系

[同期 Daily](../records/2026-11-25.md) 为已有研究时间锚点，未证明当日研究受到此次事件触发
NO_DIRECT_EXPERIMENT_YET；不增加 Daily、实验或独立执行窗口

## 可迁移问题

普通 Git commit 或 LFS 客户端重试成功不等于指定 OID 可用；核对目标对象 digest 和 pointer 引用，确认 prior effect 后才重试
将 current permission、prior-effect HIT / authoritative MISS / UNKNOWN、historical authorization、current completion 分开判定

## 强反例入口

模拟 LFS 已提交但响应丢失、pointer 存在但 object 缺失、内容不同三种状态；按 OID/digest 停止或重试
如果出现已提交旧 effect 但观察超时，应拒绝 blind retry；如果缺少 scope-complete negative evidence，应保持 UNKNOWN

## 已验证事实

- 11-25 21:30 UTC至26日00:28 UTC Git LFS 降级，客户端部分自动重试成功；流量迁移后恢复，其他 Git 操作未受影响
- 178分钟影响区间，平均2%峰值4%为 LFS 请求失败率
- 本次公开报告没有提供逐对象可验证的完整 effect receipts

## 基于证据的推断

普通 Git commit 或 LFS 客户端重试成功不等于指定 OID 可用；核对目标对象 digest 和 pointer 引用，确认 prior effect 后才重试 属于后续可验证的控制合同，不是对供应商内部实际机制或实验成功的声明

## 未验证事项

逐对象写入、readback、持久化及授权
真实 effect sink、独立 verifier、签发者授权、可信时间和原始逐对象 runtime evidence 未执行核验

## AGI-scale action-integrity relevance

长期运行 Agent 需要以 LFS OID / pointer / commit / object receipt / retry 为证据身份边界，把聚合恢复与实际完成分离，不作能力声明

## 后续研究入口

模拟 LFS 已提交但响应丢失、pointer 存在但 object 缺失、内容不同三种状态；按 OID/digest 停止或重试

EXECUTED: 2026-11-27 public-source verification and reality mapping
NOT_EXECUTED: controlled runtime experiment, independent production replay, full native checker
新增实验、窗口、CASE、NOTES credit 均为 0
