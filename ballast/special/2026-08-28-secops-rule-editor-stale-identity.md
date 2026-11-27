# 特殊专题 2026-08-28｜SecOps 规则编辑器显示身份漂移

类型: 特殊专题
主题: SecOps 规则编辑器显示身份漂移
Research Surface: displayed rule / target rule ID / revision / effect boundary
事件日期: 2026-08-28
实际核验日期: 2026-11-27
Record Provenance: NATIVE_SPECIAL / retrospective public source mapping, not event-day execution

## 触发事件

08-28 10:10 PDT起 public preview Unified Rules Editor 在特定切换场景中可能显示上一条规则逻辑，而当前规则名称不匹配；官方给出切换旧界面的临时措施，09-02 09:02 PDT记录结束

本次将公开事件或研究披露映射至 action integrity，保留事实范围与可证伪机制，不制造原始 runtime evidence

## 事实边界

直接来源支持上述公开事实，不支持 是否有错误规则被写入、逐规则修订、授权范围与实际部署状态
用户看到的 rule label 与编辑 payload 可能不匹配；授权必须绑定实际目标 ID 与 revision，不依赖当前界面标题

## 时间线

- 2026-08-28: 事件/披露归属日期，来源原时区与前后更新见上述事实
- 2026-11-27: 实际来源核验与专题映射；不是历史执行窗口

## Authority and identity map

- Operation / target: displayed rule / target rule ID / revision / effect boundary；真实对象身份未完整公开
- Current permission: 必须由对应权限 authority 证明，UNKNOWN
- Historical authorization and prior effect: 需要原操作及 effect-time receipt，UNKNOWN
- Current completion: UI 展示、规则存储、授权主体与部署系统分别负责不同事实
- Temporal authority: 公开报告提供有限时间事实，未建立逐对象可信 ordering

## 来源矩阵

| 来源 | Publisher | 查询日期 | 支持命题 | Authority / freshness | 限制 |
| --- | --- | --- | --- | --- | --- |
| [官方报告](https://status.cloud.google.com/security/incidents/zXNgfXHqxr6G5gYTAt7C) | Google Security Products Status | 2026-11-27 | 直接事件或研究叙述 | current public primary source | 无逐对象运行回执 |
| [既有 Daily](../records/2026-08-28.md) | Ballast | 2026-11-27 | 研究入口与日期锚点 | repository context | 非独立事件来源 |

## 与每日研究的关系

[2026-08-28 Daily](../records/2026-08-28.md) 提供已存在研究入口，不声称原研究由本事件触发
NO_DIRECT_EXPERIMENT_YET；不增加 Daily、受控实验或独立执行窗口

## 可迁移问题

用户看到的 rule label 与编辑 payload 可能不匹配；授权必须绑定实际目标 ID 与 revision，不依赖当前界面标题
在同一 task 下独立判定 current permission、prior-effect HIT / authoritative MISS / UNKNOWN、historical authorization、current completion

## 强反例入口

构造显示 A、编辑内容 B、目标 C 三种不一致，用 target ID、内容摘要、revision 和提交前审批绑定阻止错误写入
若 exact target、scope、freshness 或 authority 缺失，停止而非使用聚合成功作为逐对象结算

## 已验证事实

- 08-28 10:10 PDT起 public preview Unified Rules Editor 在特定切换场景中可能显示上一条规则逻辑，而当前规则名称不匹配；官方给出切换旧界面的临时措施，09-02 09:02 PDT记录结束
- 事件时间为预览 UI 影响范围；没有误编辑或错误写入数量
- 本次所读取来源不包含完整逐对象授权与 effect receipts

## 基于证据的推断

用户看到的 rule label 与编辑 payload 可能不匹配；授权必须绑定实际目标 ID 与 revision，不依赖当前界面标题
这是一项待验证控制合同，非供应商实现声明或已执行实验结果

## 未验证事项

是否有错误规则被写入、逐规则修订、授权范围与实际部署状态
真实服务复现、独立 verifier、历史授权签发者、逐对象 effect 与完成证明未取得

## AGI-scale action-integrity relevance

长期 Agent 需要明确 displayed rule / target rule ID / revision / effect boundary 的身份及责任边界，避免状态聚合使授权或结算漂移；这不是 AGI capability claim

## 后续研究入口

构造显示 A、编辑内容 B、目标 C 三种不一致，用 target ID、内容摘要、revision 和提交前审批绑定阻止错误写入

EXECUTED: public source review and reality mapping on 2026-11-27
NOT_EXECUTED: production replay, controlled experiment, complete native checker
新增 Daily、experiment、independent execution window、CASE 与 NOTES 均为 0
