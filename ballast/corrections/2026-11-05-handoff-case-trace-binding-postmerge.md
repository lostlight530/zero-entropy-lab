# Ballast 2026-11-05 case-to-trace post-merge correction

Record Type: POST_MERGE_CORRECTION / NOT_A_NEW_DAILY
Logical Date: 2026-11-05 Asia/Shanghai
Review UTC: 2026-11-05T05:10:03.765Z
Original merged PR: [#793](https://github.com/lostlight530/zero-entropy-lab/pull/793)
Original main SHA: `12ecc3f09995f93168682fc3a95ba9ce5969da7f`
Credit: Daily 0 / window 0 / CASE 0 / METHOD 0 / NOTES 0 / Audit 0 / Special 0 / finding 0

## Reproducible defect

从 GitHub main 精确读取原 [producer](../tools/replay_handoff_2026_11_05.js)、[verifier](../tools/verify_handoff_2026_11_05.js) 及 [cases](../evidence/2026-11-05-handoff-cases.json)、[traces](../evidence/2026-11-05-handoff-traces.json)、[decisions](../evidence/2026-11-05-handoff-decisions.json)

原 verifier 只核验 scenario ID 与 trace decision, 未比较 cases.state 与事件实际内容, 因此在 15 组 case-only 云端 V8 篡改中, 原 verifier 对 14/15 仍 PASS, 包括 effect、historical grant、permission、target incarnation、receipt attempt 与当前 guard 篡改

具体原始执行结果、source blob、时间和异常分类见 [post-merge review receipt](../evidence/2026-11-05-handoff-case-binding-postmerge-review.json)

## Corrective verification

新增 [case-to-trace projector](../tools/verify_handoff_case_binding_2026_11_05.js), 独立从 persisted case state 投影 8 种必须事件与可选 receipt, 检查身份唯一、字段完整、event serialization order、成员原始值与 exact case-to-trace equality, 不调用原 producer 或其 decide()

原 trace-only verifier 保留其 traces → decisions 责任, 新 binder 补足 cases → traces 证据边界

Cloud V8 实际执行 fixtures() / produce() / original verify() / new verifyCaseTraceBinding(), 原数据 44 scenarios / 392 authored events / 132 decisions 的本轮复算 PASS, 新 binder 原样数据 PASS, 15/15 变异拒绝

原 [NATIVE Daily](../records/2026-11-05.md) 与原 producer、verifier、cases、traces、decisions、run receipt 完全不改写, Git 原始 head/merge commit 保留时点证据

## Limits

Implementation SEPARATE_EVENT_PROJECTION / data-source SHARED / semantic-contract SHARED / external authority NONE

此修正只发现 cases、traces、decisions 三层可能不一致的验证盲点, 即使三层共同伪造仍可能通过相同语义合同, 不证明真实 sink effect、authority、cross-domain ordering 或 protected completion

Full `python ballast/tools/check.py` NOT_EXECUTED, native Node CLI NOT_EXECUTED, real Temporal / GitHub Actions / independent issuer / effect sink NOT_EXECUTED

No new independent research window, no new Daily, no finding promotion
