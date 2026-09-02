# 周期整理模板

## 覆盖区间

记录本周期起止日期.

## 日报索引

链接每份日报并标明研究问题与结论状态.

## 特殊专题索引

单独链接外部事件专题并说明它触发的每日研究, 不计入日报数量.

## 周期审计索引

链接覆盖本周期日期的审计并说明状态变化.

## 运行覆盖

说明状态转换、恢复、幂等和验证案例的覆盖.

## 已复验发现

只列出满足升级条件的发现并链接证据日报.

## 未解决失败

保留不能被现有证据解释的失败与差异.

## 失效记录

记录被新证据推翻的旧判断及原因.

## 稳定性与质量

分别总结有效完成、重放一致、恢复和假成功.

## 有效速度

记录验证后有效耗时、无效操作和重试成本.

## 下一周期问题

选择最能证伪现有候选的问题.

## Monthly maintenance ledger

Monthly Maintenance Status: NOT_RUN
Maintenance Coverage: TODO
Maintenance Change Log: TODO
Maintenance Validation: NOT_RUN
Maintenance Unresolved: Full monthly maintenance has not run.

List every scoped daily, weekly, monthly and referenced special/audit path with its actual disposition. Distinguish delivery, original execution and current quality. Correct supported defects in place, preserve execution facts, and propagate changed interpretations to dependent summaries and indexes.

| File and original commit | Original claim | Correction and source | Downstream impact | Check result |
| --- | --- | --- | --- | --- |

Use the real correction time and reviewer identity. An unchanged file can be marked REVIEWED_NO_CHANGE only after its content was reviewed. Do not mark the entire month completed while entries are unresolved. A summary or checker pass alone does not complete maintenance.
