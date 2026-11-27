# 特殊专题 2026-07-14｜VMware 跨区故障转移与所有权结算

类型: 特殊专题
主题: VMware 跨区故障转移与所有权结算
Research Surface: cluster membership / VM incarnation / failover ownership
事件日期: 2026-07-14
实际核验日期: 2026-11-27
Record Provenance: NATIVE_SPECIAL / retrospective public source mapping, not event-day execution

## 触发事件

07-14 10:00–20:40 PDT，澳大利亚东南与法兰克福部分 stretched cluster 发生站点间通信故障，部分客户出现 VM 重启或跨区迁移；公开更新另列21:46的客户缓解状态

本次将公开事件或研究披露映射至 action integrity，保留事实范围与可证伪机制，不制造原始 runtime evidence

## 事实边界

直接来源支持上述公开事实，不支持 逐 VM 的迁移、实例 incarnation、历史写入及应用完成
跨区连接恢复或 VM 重启不能证明任务恢复，更不能证明新 owner 获得写入授权

## 时间线

- 2026-07-14: 事件/披露归属日期，来源原时区与前后更新见上述事实
- 2026-11-27: 实际来源核验与专题映射；不是历史执行窗口

## Authority and identity map

- Operation / target: cluster membership / VM incarnation / failover ownership；真实对象身份未完整公开
- Current permission: 必须由对应权限 authority 证明，UNKNOWN
- Historical authorization and prior effect: 需要原操作及 effect-time receipt，UNKNOWN
- Current completion: 集群协调器、实例管理面、存储和应用完成记录分别负责局部事实
- Temporal authority: 公开报告提供有限时间事实，未建立逐对象可信 ordering

## 来源矩阵

| 来源 | Publisher | 查询日期 | 支持命题 | Authority / freshness | 限制 |
| --- | --- | --- | --- | --- | --- |
| [官方报告](https://status.cloud.google.com/incidents/T8gmtofFSTGT5tbhyciF) | Google Cloud | 2026-11-27 | 直接事件或研究叙述 | current public primary source | 无逐对象运行回执 |
| [既有 Daily](../records/2026-07-21.md) | Ballast | 2026-11-27 | 研究入口与日期锚点 | repository context | 非独立事件来源 |

## 与每日研究的关系

[2026-07-21 Daily](../records/2026-07-21.md) 提供已存在研究入口，事件早于本仓日记录起点，关联最近的既有日期不代表事件当日研究，不声称原研究由本事件触发
NO_DIRECT_EXPERIMENT_YET；不增加 Daily、受控实验或独立执行窗口

## 可迁移问题

跨区连接恢复或 VM 重启不能证明任务恢复，更不能证明新 owner 获得写入授权
在同一 task 下独立判定 current permission、prior-effect HIT / authoritative MISS / UNKNOWN、historical authorization、current completion

## 强反例入口

构造 failover 后旧 owner 未停止、新 owner 已启动、共享存储仍不可用三类；验证 owner generation 与写入 fence，逐对象读回
若 exact target、scope、freshness 或 authority 缺失，停止而非使用聚合成功作为逐对象结算

## 已验证事实

- 07-14 10:00–20:40 PDT，澳大利亚东南与法兰克福部分 stretched cluster 发生站点间通信故障，部分客户出现 VM 重启或跨区迁移；公开更新另列21:46的客户缓解状态
- 640分钟为连接影响区间，21:46是后续客户缓解时间，不等于逐VM恢复时刻
- 本次所读取来源不包含完整逐对象授权与 effect receipts

## 基于证据的推断

跨区连接恢复或 VM 重启不能证明任务恢复，更不能证明新 owner 获得写入授权
这是一项待验证控制合同，非供应商实现声明或已执行实验结果

## 未验证事项

逐 VM 的迁移、实例 incarnation、历史写入及应用完成
真实服务复现、独立 verifier、历史授权签发者、逐对象 effect 与完成证明未取得

## AGI-scale action-integrity relevance

长期 Agent 需要明确 cluster membership / VM incarnation / failover ownership 的身份及责任边界，避免状态聚合使授权或结算漂移；这不是 AGI capability claim

## 后续研究入口

构造 failover 后旧 owner 未停止、新 owner 已启动、共享存储仍不可用三类；验证 owner generation 与写入 fence，逐对象读回

EXECUTED: public source review and reality mapping on 2026-11-27
NOT_EXECUTED: production replay, controlled experiment, complete native checker
新增 Daily、experiment、independent execution window、CASE 与 NOTES 均为 0
