# 周期审计模板

类型: 周期审计
主题: 记录本周期的明确 derived review 主题
Record Provenance: NATIVE, SUBSTITUTE, or RECONSTRUCTION
派生审计: YES
新增实验数量: 0
新增长期结论数量: 0

## 覆盖区间

记录开始日期, 结束日期, 审计日期与时区.

只审阅已经存在的连续 Daily window. Audit 不补 Daily 缺口, 不替代 mandatory Daily research production.

## 纳入记录

链接本次 review 使用的 Daily, Special 与 monthly research view.

分别记录 actual execution date, provenance 与 independent execution window.

## 审计方法

记录结构检查, source verification, experiment replay, action-integrity state comparison 与 conclusion-threshold check.

Audit 自身增加 0 experiment, 0 independent execution window, 0 finding.

## 证据链审计

逐日比较 current permission, prior-effect evidence, historical effect-time authorization, current completion, target/membership identity, temporal evidence 与 verifier independence.

不得把一个 surface 的证据自动升级到另一个 surface.

## 特殊专题关系

分别列出 external event evidence 与由其触发的 Daily experiment.

Special 不替代 Daily, event report 不等于 controlled experiment.

## 重复信号

列出跨记录重复出现的状态与 failure mode.

明确重复是否来自不同 experiment path, authority source, target identity, execution window 或 verifier semantics.

不同代码实现不自动等于独立研究重复.

## 恢复与重放

比较 occurrence, retry suppression, historical authorization, current completion 与 replay decision.

Completed replay 与 crash-window recovery 分开.

## 假成功检查

列出 command success, transport success, task terminal state 与 valid completion 之间的差异.

记录 false completion, duplicate effect, unauthorized effect 与 unverifiable current completion.

## 状态决定

分别记录 observation, candidate, finding, invalidation, unknown, no conclusion 与 unchanged boundary.

任何 promotion 都必须由 Daily/Special 的真实实验门槛支持, audit 不提供新的 promotion evidence.

## 审计缺口

保留 source, environment, authority, retention, temporal ordering, semantic verifier independence 与 real-system coverage 的真实缺口.

## 下一阶段控制项

只保留能够攻击 strongest current path 或缩小 uncertainty 的 experiment.

优先 real Kubernetes/database/distributed authority/receipt/TSA/delegated-agent experiment, 不为了周期完整性重复 fixture.

## 事实分层

### 已验证事实

### 基于证据的推断

### 未验证事项
