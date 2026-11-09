# Independent A1 — zero-entropy-lab — 2026-11-09 source custody

## Identity, scope and exact base
- Repository: `lostlight530/zero-entropy-lab`; task: `independent-maintenance/A1`.
- Logical date: 2026-11-09 Asia/Shanghai; review cut: 2026-11-09 23:10:21 +08:00.
- A1 window: 2026-11-01..08 inclusive; Nov09 is excluded and reserved for A2.
- Exact pre-write main: `0814647f1e540565707fa044c088980a2a26fbb4`.
- Prior A1: `historical-audits/2026-11/2026-11-08-a1-source-content-review.md`, exact blob `c3bf4443f6c2165bf9916048ed0e90f3fe588e15`; Nov01–07 coverage is inherited, not claimed as re-executed.
- Prior A2: `historical-audits/2026-11/2026-11-08-a2-month-relations.md`, exact blob `f995e49536f74dbbbce9dc1d536817b9f46f5b9e`.
- Prior post-merge reconciliation blob: `6864e3a28e2734ed4675c789a2b67e64f5e61d8b`; prior A1 #826 and A2 #827 are merged and retained.
- The 2026-09-25 ten-repository SOP requires month-start→N−1 coverage and merged A1→fresh A2. It does not impose a universal 100-lines-per-PR rule; earlier numeric labels remain dated historical notes.

## Nov08 source custody — exact current-main objects
| Object | Current-main blob | Scope |
|---|---|---|
| `aegis-cortex/2026-11-08-A1-reliability-observe.md` | `b25f3f2c906d3844d3c76ca9e315522c2d502c94` | Aegis Observe |
| `aegis-cortex/2026-11-08-A2-doctrine-orient.md` | `d39ece70a87b88bc7260ce7e877a4b6eae467c1c` | Aegis Orient |
| `ballast/records/2026-11-08.md` | `b0416799dd6ef13a7639b19e524888ac27de4d8f` | local cancellation/quiescence model |
| `ballast/evidence/2026-11-08-cancellation-quiescence-evidence-bundle.json` | `3589b4f4648de942db0a4597f6253887e0f54bdf` | raw evidence bundle |
| `ballast/evidence/2026-11-08-cancellation-quiescence-review.json` | `0c963d2d0d3e70407adc4c2a19d81b3726bb75ef` | verifier review counters |
| `aegis-cortex/2026-W45-A3-discipline-decide.md` | `0a8e833116440493c99129163498c5866b494008` | W45 decision owner |
| `aegis-cortex/2026-W45-A4-protocol-act.md` | `8eb9d1ea512f2d6ec22b685fac79cdf937b242cb` | W45 action/settlement owner |
| `historical-audits/2026-11/2026-11-08-d7-operational-continuity.md` | `f0e97653673c7a0d55d1d93c1a90d67801a0021f` | separate D7 audit |

## Source-specific judgments
1. Nov08 Aegis studies LangGraph subgraph namespace matching, not the Nov07 Google ADK retry/waiting-state issue.
2. The upstream patch `e5e37b5` changes raw prefix matching toward exact namespace-segment matching in sync and async resolution paths.
3. This supports a narrow source-code correction and its authored tests; it does not establish that Zero Host Kernel imports the affected revision or experienced the issue.
4. Aegis classifies the observation as an external risk class, not a locally observed incident.
5. Aegis Observe and Orient share one LangGraph source lineage; they are not two independent publisher confirmations.
6. Ballast is a separate native owner and executed a bounded synthetic cancellation model, not a LangGraph integration test.
7. The Nov08 Ballast record reports 24 scenarios, 197 primitive events and 72 decision paths; these are fixture counts, not real-world protected commits.
8. Producer/verifier agreement 24/24 is constrained by shared scenario semantics and data; verifier authority independence is NONE.
9. The 21 weak-reference disagreements are examples in the authored model, not an estimate of production failure prevalence.
10. The synthetic outcomes include 2 CANCELLED_NO_EFFECT, 12 STOP_UNKNOWN and 2 UNAUTHORIZED_OCCURRENCE; none is a live sink receipt.
11. A parent terminal state does not prove child quiescence, and cancellation does not prove an external effect never committed.
12. An event after the cancellation fence cannot be relabeled as a pre-fence effect; a committed pre-fence effect cannot be erased by later cancellation.
13. Historical effect-time authorization and present authorization are different predicates; later revocation does not automatically rewrite an earlier authorized effect.
14. The 11 tamper probes are bounded synthetic-model observations, not third-party conformance results.
15. W45 A3/A4 are weekly owners; W45 closed 7/7 on Nov08. W45 closure does not make the November A5/A6 monthly tasks due.
16. D7 is a separate periodic audit and does not create another Ballast experiment or Aegis incident.
17. No live cloud queue, effect sink, Zero Host runtime or external cancellation system was connected in the Nov08 record.

## Month-to-date coverage and decisions
| Window | Coverage basis | Decision |
|---|---|---|
| Nov01 | Prior A1; W44 boundary | INHERIT_PRIOR_A1 |
| Nov02–07 | Prior A1 source matrix and judgments | INHERIT_PRIOR_A1 |
| Nov08 | Aegis A1/A2, Ballast record/evidence/review, W45 A3/A4 | REVIEWED; APPEND_RELATION / BOUNDARY_UPDATE |
| Nov09 | Excluded from A1 | A2_INPUT_ONLY |
| Nov10–30 | Future dates | NOT_DUE |

- A1 month-to-date coverage is prior A1 Nov01–07 plus the exact Nov08 objects above.
- No original Aegis, Ballast, weekly, D7 or historical file is rewritten by this A1.
- Month: November OPEN; W45 FINAL; W46 begins Nov09; monthly A5/A6 remain NOT_DUE.
- Execution boundary: no cloud queue, external sink, SDK integration or production incident was tested by this A1.
- Result: `A1_COVERAGE_COMPLETE_WITH_INHERITED_PRIOR_REVIEW_AND_NOV08_APPEND`; not an independent production-effect or human sign-off claim.
