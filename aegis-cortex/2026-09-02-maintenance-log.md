# 2026-09-02 维护修正日志

Review Date: 2026-09-02
Review Checkpoint Asia/Shanghai: 2026-09-02T13:34:52+08:00
Reviewer: Codex
Review Window: 2026-08-01 through 2026-09-01 inclusive
Base Commit: ebdc2f55c1b472e2ba10c0465f8aeeb076f682d8
Monthly Maintenance Status: PARTIAL
Maintenance Coverage: 下方文件清单,区分结构检查与逐项内容复核.
Maintenance Change Log: 本文件的改动表和对应 Git diff.
Maintenance Validation: 验证结果见末节,未运行项不得视为通过.
Maintenance Unresolved: 全月逐命题外部复核及其全部下游传播尚未认证完成.

## 本轮已做与边界

本次补齐的是月度完整维护流程,并对已经确认的错误做正文微调,不是重新生成历史任务. 既有逻辑日期、原始执行时间、作者、provenance 与阻塞事实保留. 未合并 PR 不能标为未产出,当前路径存在也不能证明原执行成功.

以下清单的“结构检查”只证明路径与适用的离线合同被检查,不等于逐篇外部来源、实验重放或所有结论均获验证. 没有新独立实验或时间窗口计数.

## 改动表

原文可从 [基础提交](https://github.com/lostlight530/zero-entropy-lab/tree/ebdc2f55c1b472e2ba10c0465f8aeeb076f682d8/aegis-cortex) 及本 PR diff 逐项回读. 修改时间属于本次复核,不是历史任务时间. 修改文件中的中文句号统一为英文句号,不改作者身份.

| 文件 | 原问题与修正依据 |
| --- | --- |
| [sample-2026-07-A6-aegis-memorize.md](sample-2026-07-A6-aegis-memorize.md) | Extend existing monthly template with actual repair coverage, change log and completion boundary |
| [sample-2026-07-A5-drift-reflect.md](sample-2026-07-A5-drift-reflect.md) | Extend existing monthly template with actual repair coverage, change log and completion boundary |
| [EVIDENCE_POLICY.md](EVIDENCE_POLICY.md) | Define full monthly repair, retain historical execution facts and supersede audit-only guidance |
| [2026-08-A5-drift-reflect.md](2026-08-A5-drift-reflect.md) | Correct search-versus-evidence, checker-versus-sandbox and absence-versus-prevention reasoning in monthly reflection |
| [2026-08-A6-aegis-memorize.md](2026-08-A6-aegis-memorize.md) | Propagate A5 correction into durable guidance; preserve status/content validation instead of treating missing incidents as proof |
| [2026-09-01-A1-reliability-observe.md](2026-09-01-A1-reliability-observe.md) | Correct access-depth contradiction and harness paper causal misinterpretation while retaining original execution |
| [2026-09-01-A2-doctrine-orient.md](2026-09-01-A2-doctrine-orient.md) | Propagate A1 causal correction into A2 risk and handoff; distinguish preventive instruction from executed test |

检查器只做结构防错. 本轮新增月度维护日志合同、日历与任务状态分离,并防止空字段吞掉下一行. 不建立新的宿主运行机制或强制 CI 闸门.

## 文件覆盖清单

| 路径 | 本轮处置 |
| --- | --- |
| [2026-08-01-A1-reliability-observe.md](2026-08-01-A1-reliability-observe.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-01-A2-doctrine-orient.md](2026-08-01-A2-doctrine-orient.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-01-through-28-daily-weekly-reconciliation.md](2026-08-01-through-28-daily-weekly-reconciliation.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-02-A1-reliability-observe.md](2026-08-02-A1-reliability-observe.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-02-A2-doctrine-orient.md](2026-08-02-A2-doctrine-orient.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-03-A1-reliability-observe.md](2026-08-03-A1-reliability-observe.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-03-A2-doctrine-orient.md](2026-08-03-A2-doctrine-orient.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-04-A1-reliability-observe.md](2026-08-04-A1-reliability-observe.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-04-A2-doctrine-orient.md](2026-08-04-A2-doctrine-orient.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-05-A1-reliability-observe.md](2026-08-05-A1-reliability-observe.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-05-A2-doctrine-orient.md](2026-08-05-A2-doctrine-orient.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-06-A1-reliability-observe.md](2026-08-06-A1-reliability-observe.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-06-A2-doctrine-orient.md](2026-08-06-A2-doctrine-orient.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-07-A1-reliability-observe.md](2026-08-07-A1-reliability-observe.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-07-A2-doctrine-orient.md](2026-08-07-A2-doctrine-orient.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-08-A1-reliability-observe.md](2026-08-08-A1-reliability-observe.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-08-A2-doctrine-orient.md](2026-08-08-A2-doctrine-orient.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-09-A1-reliability-observe.md](2026-08-09-A1-reliability-observe.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-09-A2-doctrine-orient.md](2026-08-09-A2-doctrine-orient.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-10-A1-reliability-observe.md](2026-08-10-A1-reliability-observe.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-10-A2-doctrine-orient.md](2026-08-10-A2-doctrine-orient.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-11-A1-reliability-observe.md](2026-08-11-A1-reliability-observe.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-11-A2-doctrine-orient.md](2026-08-11-A2-doctrine-orient.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-12-A1-reliability-observe.md](2026-08-12-A1-reliability-observe.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-12-A2-doctrine-orient.md](2026-08-12-A2-doctrine-orient.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-13-A1-reliability-observe.md](2026-08-13-A1-reliability-observe.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-13-A2-doctrine-orient.md](2026-08-13-A2-doctrine-orient.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-14-A1-reliability-observe.md](2026-08-14-A1-reliability-observe.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-14-A2-doctrine-orient.md](2026-08-14-A2-doctrine-orient.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-15-A1-reliability-observe.md](2026-08-15-A1-reliability-observe.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-15-A2-doctrine-orient.md](2026-08-15-A2-doctrine-orient.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-16-A1-reliability-observe.md](2026-08-16-A1-reliability-observe.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-16-A2-doctrine-orient.md](2026-08-16-A2-doctrine-orient.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-17-A1-reliability-observe.md](2026-08-17-A1-reliability-observe.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-17-A2-doctrine-orient.md](2026-08-17-A2-doctrine-orient.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-18-A1-reliability-observe.md](2026-08-18-A1-reliability-observe.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-18-A2-doctrine-orient.md](2026-08-18-A2-doctrine-orient.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-19-A1-reliability-observe.md](2026-08-19-A1-reliability-observe.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-19-A2-doctrine-orient.md](2026-08-19-A2-doctrine-orient.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-20-A1-reliability-observe.md](2026-08-20-A1-reliability-observe.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-20-A2-doctrine-orient.md](2026-08-20-A2-doctrine-orient.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-21-A1-reliability-observe.md](2026-08-21-A1-reliability-observe.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-21-A2-doctrine-orient.md](2026-08-21-A2-doctrine-orient.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-22-A1-reliability-observe.md](2026-08-22-A1-reliability-observe.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-22-A2-doctrine-orient.md](2026-08-22-A2-doctrine-orient.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-23-A1-reliability-observe.md](2026-08-23-A1-reliability-observe.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-23-A2-doctrine-orient.md](2026-08-23-A2-doctrine-orient.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-24-A1-reliability-observe.md](2026-08-24-A1-reliability-observe.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-24-A2-doctrine-orient.md](2026-08-24-A2-doctrine-orient.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-25-A1-reliability-observe.md](2026-08-25-A1-reliability-observe.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-25-A2-doctrine-orient.md](2026-08-25-A2-doctrine-orient.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-26-A1-reliability-observe.md](2026-08-26-A1-reliability-observe.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-26-A2-doctrine-orient.md](2026-08-26-A2-doctrine-orient.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-27-A1-reliability-observe.md](2026-08-27-A1-reliability-observe.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-27-A2-doctrine-orient.md](2026-08-27-A2-doctrine-orient.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-28-A1-reliability-observe.md](2026-08-28-A1-reliability-observe.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-28-A2-doctrine-orient.md](2026-08-28-A2-doctrine-orient.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-29-A1-reliability-observe.md](2026-08-29-A1-reliability-observe.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-29-A2-doctrine-orient.md](2026-08-29-A2-doctrine-orient.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-30-A1-reliability-observe.md](2026-08-30-A1-reliability-observe.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-30-A2-doctrine-orient.md](2026-08-30-A2-doctrine-orient.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-31-A1-reliability-observe.md](2026-08-31-A1-reliability-observe.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-31-A2-doctrine-orient.md](2026-08-31-A2-doctrine-orient.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-A5-drift-reflect.md](2026-08-A5-drift-reflect.md) | 已做表中限定的正文修正,不代表其余全部主张重验 |
| [2026-08-A6-aegis-memorize.md](2026-08-A6-aegis-memorize.md) | 已做表中限定的正文修正,不代表其余全部主张重验 |
| [2026-08-month-end-reconciliation.md](2026-08-month-end-reconciliation.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-through-23-stage-audit.md](2026-08-through-23-stage-audit.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-08-through-27-stage-audit.md](2026-08-through-27-stage-audit.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-09-01-A1-reliability-observe.md](2026-09-01-A1-reliability-observe.md) | 已做表中限定的正文修正,不代表其余全部主张重验 |
| [2026-09-01-A2-doctrine-orient.md](2026-09-01-A2-doctrine-orient.md) | 已做表中限定的正文修正,不代表其余全部主张重验 |
| [2026-W31-A3-discipline-decide.md](2026-W31-A3-discipline-decide.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-W31-A4-protocol-act.md](2026-W31-A4-protocol-act.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-W32-A3-discipline-decide.md](2026-W32-A3-discipline-decide.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-W32-A4-protocol-act.md](2026-W32-A4-protocol-act.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-W33-A3-discipline-decide.md](2026-W33-A3-discipline-decide.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-W33-A4-protocol-act.md](2026-W33-A4-protocol-act.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-W33-reconciliation.md](2026-W33-reconciliation.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-W34-A3-discipline-decide.md](2026-W34-A3-discipline-decide.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-W34-A4-protocol-act.md](2026-W34-A4-protocol-act.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-W34-reconciliation.md](2026-W34-reconciliation.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-W35-A3-discipline-decide.md](2026-W35-A3-discipline-decide.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-W35-A4-protocol-act.md](2026-W35-A4-protocol-act.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |
| [2026-W35-partial-reconciliation.md](2026-W35-partial-reconciliation.md) | 纳入范围与结构扫描,逐命题内容认证未完成 |

## 仍需维护的项目

- 完整来源复验应核对命题、对象、时间、出处和真正独立性,不能仅凭 URL 可访问.
- 历史实验的输入、执行者、实际输出、控制变量和评判依据需按记录逐项复核,缺项保持未验证.
- 周度与月度继承关系必须按原始输入快照核对,不能把后续文件倒推成先前成功.
- 只处理本维护目录及适用检查器和测试. 不改宿主 Actions、运行时、数据、前端、调度配置或版本.

## 验证结果

- Aegis 检查器扫描 139 个 dated 路径通过; Ballast 全目录检查通过,109 个文件.
- python tests/run_tests.py: 80 tests passed across 10 modules.
- 本轮新增回归测试 14 项通过,覆盖月末边界、维护状态、空字段和上游 Task ID 不覆盖当前记录头.
- 首次完整测试受到 Windows 临时目录权限限制; 使用本轮工作目录作为临时路径重跑后通过. 未安装依赖或修改系统配置.
- Git diff whitespace check passed.
- 历史文件 SHA-256 核对: 204 项中 200 项未变,4 项为本日志列出的已授权正文修正.
- 两仓根 README 与 CONTRIBUTING 已检查,本轮不加入 SOP 内部规则或记忆,保持原文.
- 这些结果证明本轮改动的结构与回归检查通过,不认证未执行的历史实验重放或全量外部事实复核.

## 本次明确校准

- A5/A6 原文把 check.py 当沙盒并用无事故证据弱化内容检查,现区分结构检查、事故证据和预防性要求.
- Sep 1 A1/A2 的 [Harness 论文](https://arxiv.org/html/2608.26218v1) 是组合干预研究,不能识别单项截断因果效应. 当前校准不冒认原执行已读全文.
- A5/A6 原执行时间未记录,不补造; Aug 15 重建和 Aug 16 A2 原始阻塞不改.
