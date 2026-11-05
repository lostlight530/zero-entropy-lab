# Ballast 2026-11-05 conservative query coverage-end correction

Record Type: POST_MERGE_CORRECTION / NOT_A_NEW_DAILY
Logical Date: 2026-11-05 Asia/Shanghai
Correction execution: 2026-11-05T05:15:25.632Z UTC / 2026-11-05, 13:15 Asia/Shanghai
Original Research: [2026-11-05 NATIVE Daily](../records/2026-11-05.md)
Original merged PR: [#793](https://github.com/lostlight530/zero-entropy-lab/pull/793)
Already merged case-to-trace correction: [PR #794](https://github.com/lostlight530/zero-entropy-lab/pull/794)
Current correction base main: `92aad402ace4cd855d916809ae9d7a8f6311a63b`

## 可证伪的机制缺口

原 reference 和 trace verifier 对真实历史 effect 的查询覆盖自称 `query.lastEnd`，却未验证它能否至少覆盖该 effect 的 `commit.at`，因此在其他 synthetic facts 不变、仅将 lastEnd=11 与 commit.at=12 配对时仍返回 COMPLETE

本轮假设严格局限于作者为当前合成模型定义的 visibility coverage-end 含义，不能把此字段冒充真实 sink 的独立权威水位

## 实际执行的原始观测

从本轮 main `92aad402ace4cd855d916809ae9d7a8f6311a63b` 读取 [original producer](../tools/replay_handoff_2026_11_05.js)、[original verifier](../tools/verify_handoff_2026_11_05.js)、[PR #794 binder](../tools/verify_handoff_case_binding_2026_11_05.js) 以及原 [cases](../evidence/2026-11-05-handoff-cases.json)、[traces](../evidence/2026-11-05-handoff-traces.json)、[decisions](../evidence/2026-11-05-handoff-decisions.json)

Cloud V8 实际重放 original 44 scenarios / 392 primitive events / 132 decisions，原 source、traces、decision 与已持久化 JSON 一致，旧 trace verifier、PR #794 binder 与新 scope reviewer 对原始证据均 PASS_WITH_LIMITS，原 44 reference label 完全不修改

保持 baseline task/run/attempt、owner、permission、grant、receipt、effect、target、membership 与 guarded completion 不变，额外注入 3 个只改变 query.lastEnd 的对照输入

- lastEnd=11, commit.at=12, old COMPLETE, corrected STOP_UNKNOWN
- lastEnd=0, commit.at=12, old COMPLETE, corrected STOP_UNKNOWN
- lastEnd=12, commit.at=12, old COMPLETE, corrected COMPLETE

加入 3 个额外 synthetic controls 后 47 scenarios / 141 model decisions / 419 primitive events, original trace verifier 与 case binder 均 PASS, 原始 decision 行直接作为 corrected input 的测试按预期 FAIL, 经保守降级后的 scope reviewer PASS_WITH_LIMITS

## 合法修正范围

添加 [query coverage sidecar](../tools/verify_handoff_query_coverage_2026_11_05.js) 与 [V8 execution evidence](../evidence/2026-11-05-handoff-query-coverage-postmerge.json), 不修改已合并的原始 Daily、producer、verifier、cases、traces、decisions、PR #794 binder 或其历史结论

新 reviewer 同时要求原 traces → decisions verifier 与 PR #794 cases → traces binder 通过，仅当合成查询的 lastEnd 缺失、类型错误或小于其所声称覆盖的 commit time 且旧决策为 COMPLETE / retry candidate 时，附录保守降级为 STOP_UNKNOWN

原始资料与新增 correction 可从不同 Git SHA 复算，不能把 correction 的新模型结论冒充原 Daily 当时输出

## 限制和信用

Implementation PARTIAL / evidence source SHARED / semantic-contract SHARED / external authority NONE, 共同伪造的 authored case/trace/decision、真实 effect-time authorization、跨服务时间因果、真实 sink visibility watermark、protected commit 仍无法证明

EXECUTED: cloud V8 old persisted-source producer/verifier, PR #794 binder, new coverage reviewer, 3 controls, 4 additional unilateral tamper probes, output equality check

NOT_EXECUTED: full `python ballast/tools/check.py`, native Node CLI, live GitHub Actions/Temporal, real effect sink, independent grant authority, authoritative MISS, actual protected transaction

Daily 0 / additional independent research window 0 / CASE 0 / METHOD 0 / NOTES 0 / Audit 0 / Special 0 / durable finding 0, November remains 5 NATIVE Dailies / 5 original bounded execution windows
