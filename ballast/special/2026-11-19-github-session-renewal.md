# 特殊专题 2026-11-19｜会话续期异常与 stale authorization

类型: 特殊专题
主题: 会话续期异常与 stale authorization
Research Surface: session ID / credential expiry / current permission / historical authorization
事件日期: 2026-11-19
实际核验日期: 2026-11-27
Record Provenance: NATIVE_SPECIAL / retrospective public source mapping, not event-day execution

## 触发事件

11-05 18:02 UTC至11-19 18:05 UTC部分浏览器 session 意外过期，即使持续活动；报告说明续期机制故障，修复后旧会话仍可能需重新登录；详情链接 https://www.githubstatus.com/incidents/m310qbkfm3ww 本次未成功打开，事实取自官网同标题报告

本次将现实事件转换为可证伪 action-integrity 问题，不宣称执行过供应商生产实验

## 事实边界

供应商报告支持事件范围、阶段与其明确描述的恢复；不支持 具体 session、授权撤销与历史 effect 记录
活动信号不是有效授权；故障修复后重读当前 session authority，不能恢复过期 token 或倒写旧 effect-time authorization

## 时间线

- 2026-11-19: 按来源原时区归属事件或最终披露日；详细区间见上述事实，跨日时间不重新解释为本仓执行时间
- 2026-11-27: 实际来源核验和研究映射

## Authority and identity map

- Operation / target: session ID / credential expiry / current permission / historical authorization；逐对象身份 UNKNOWN
- Current permission: UNKNOWN，必须由当前授权主体证明
- Historical authorization / prior effect: UNKNOWN，必须绑定原 effect identity 和 effect-time authority
- Current completion / receipt: session issuer、授权服务、目标 effect sink 不能互相替代
- Temporal authority: 供应商报告提供事件级时间，不提供逐对象可信 ordering

## 来源矩阵

| 来源 | Publisher | 查询日期 | 支持命题 | Authority / freshness | 限制 |
| --- | --- | --- | --- | --- | --- |
| [官方报告](https://www.githubstatus.com/) | GitHub Status | 2026-11-27 | 上述公开事件与影响范围 | provider current report | 缺少逐对象 receipt |
| [同期 Daily](../records/2026-11-19.md) | Ballast | 2026-11-27 | 同期研究定位 | repository context | 非事件独立来源 |

## 与每日研究的关系

[同期 Daily](../records/2026-11-19.md) 为已有研究时间锚点，未证明当日研究受到此次事件触发
NO_DIRECT_EXPERIMENT_YET；不增加 Daily、实验或独立执行窗口

## 可迁移问题

活动信号不是有效授权；故障修复后重读当前 session authority，不能恢复过期 token 或倒写旧 effect-time authorization
将 current permission、prior-effect HIT / authoritative MISS / UNKNOWN、historical authorization、current completion 分开判定

## 强反例入口

注入 stale session、修复后新 session、过期旧 session 三类；先验证当前 permission，历史 effect 另查 receipt
如果出现已提交旧 effect 但观察超时，应拒绝 blind retry；如果缺少 scope-complete negative evidence，应保持 UNKNOWN

## 已验证事实

- 11-05 18:02 UTC至11-19 18:05 UTC部分浏览器 session 意外过期，即使持续活动；报告说明续期机制故障，修复后旧会话仍可能需重新登录；详情链接 https://www.githubstatus.com/incidents/m310qbkfm3ww 本次未成功打开，事实取自官网同标题报告
- 约14日为事件时间范围，不是用户 token TTL
- 本次公开报告没有提供逐对象可验证的完整 effect receipts

## 基于证据的推断

活动信号不是有效授权；故障修复后重读当前 session authority，不能恢复过期 token 或倒写旧 effect-time authorization 属于后续可验证的控制合同，不是对供应商内部实际机制或实验成功的声明

## 未验证事项

具体 session、授权撤销与历史 effect 记录
真实 effect sink、独立 verifier、签发者授权、可信时间和原始逐对象 runtime evidence 未执行核验

## AGI-scale action-integrity relevance

长期运行 Agent 需要以 session ID / credential expiry / current permission / historical authorization 为证据身份边界，把聚合恢复与实际完成分离，不作能力声明

## 后续研究入口

注入 stale session、修复后新 session、过期旧 session 三类；先验证当前 permission，历史 effect 另查 receipt

EXECUTED: 2026-11-27 public-source verification and reality mapping
NOT_EXECUTED: controlled runtime experiment, independent production replay, full native checker
新增实验、窗口、CASE、NOTES credit 均为 0
