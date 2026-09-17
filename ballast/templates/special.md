# 特殊专题模板

类型: 特殊专题
主题: 写明外部事件或跨日 action-integrity 问题
Research Surface:
事件日期:
实际核验日期:
Record Provenance:

## 触发事件

说明为什么需要独立专题以及与 Daily 的关系.

Special 不替代 Daily, 也不因为事件数量或影响范围自动计实验.

## 事实边界

分别记录能够确认与不能确认的内容.

优先区分 command/transport, task terminal state, historical occurrence, historical authorization, current permission 与 current completion.

## 时间线

只记录来源明确支持的状态变化.

分别记录 event time, publication time, observation time, recovery time, revocation/invalidity time 与其他真正相关的 temporal boundary.

## Authority and identity map

记录本事件涉及的 authority 与 identity.

- task / operation identity
- approval authority
- credential or subject authority
- target incarnation or effect set
- effect sink
- receipt authority
- completion store
- temporal evidence authority

未建立的 identity 保持 UNKNOWN.

## 来源矩阵

记录来源、publisher、查询日期、支持命题、authority、freshness、retention/lifecycle coverage 与冲突.

外部 status page 或 vendor contract 只支持自身声明范围, 不自动证明本地或 per-object completion.

## 与每日研究的关系

链接被触发的 Daily experiment 或明确写 `NO_DIRECT_EXPERIMENT_YET`.

事件报道不等于受控实验结果.

## 可迁移问题

提取能够进入后续受控实验的问题, 例如 unknown-outcome recovery, delegated authority, target drift, receipt visibility, temporal authorization, dynamic membership 或 verifier independence.

## 强反例入口

说明什么 evidence 或 scenario 会推翻当前最自然的解释.

## 已验证事实

只保存经当前来源直接支持的事实.

## 基于证据的推断

明确说明推断链和适用边界.

## 未验证事项

保留 root cause, per-object scope, authorization state, historical occurrence, exact timing 或 completion 中的 unknown.

## AGI-scale action-integrity relevance

说明该现实事件为何对长期自主 Agent 的 authorization/effect/completion integrity 有研究价值.

不得写成 AGI capability claim.

## 后续研究入口

列出可证伪实验入口, stronger authority requirement 与停止条件.
