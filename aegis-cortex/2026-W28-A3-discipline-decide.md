# A3 Weekly Discipline Decide

CORTEX_RUN_HEADER

Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A3
Cadence: Weekly
Loop Stage: Decide
Run Week: 2026-W28
Agent: Jules
Knowledge Source: This Week A1/A2 + External Web + aegis-cortex local files
Repository Inspection: NO
GitHub Actions Inspection: NO
Write Scope: aegis-cortex only
Boundary Violation: NO

INPUT_RECORD

Files read this week:
- aegis-cortex/2026-07-12-A1-reliability-observe.md
- aegis-cortex/2026-07-12-A2-doctrine-orient.md
- aegis-cortex/2026-07-13-A1-reliability-observe.md
- aegis-cortex/2026-07-13-A2-doctrine-orient.md
- aegis-cortex/2026-07-14-A1-reliability-observe.md
- aegis-cortex/2026-07-14-A2-doctrine-orient.md
- aegis-cortex/2026-07-15-A1-reliability-observe.md
- aegis-cortex/2026-07-15-A2-doctrine-orient.md
- aegis-cortex/2026-07-16-A1-reliability-observe.md
- aegis-cortex/2026-07-16-A2-doctrine-orient.md
- aegis-cortex/2026-07-17-A1-reliability-observe.md
- aegis-cortex/2026-07-17-A2-doctrine-orient.md
- aegis-cortex/2026-07-18-A1-reliability-observe.md
- aegis-cortex/2026-07-18-A2-doctrine-orient.md
- aegis-cortex/2026-07-19-A1-reliability-observe.md
- aegis-cortex/2026-07-19-A2-doctrine-orient.md

WEEKLY_RISK_SYNTHESIS

Repeated risks this week:
- Cascading context degradation (07-12 confirms 07-01 finding, now with instrumental convergence risk)
- Specification gaming / reward hacking (07-13, related to 07-03 prompt injection)
- Long-horizon performance degradation (07-15, related to 07-04 multi-agent coordination)

New risks this week:
- Concept drift: 4 types require different detection strategies (07-14)
- LLM-as-judge bias: position, verbosity, self-enhancement (07-15)
- Self-refine requires explicit quality criteria (07-16)
- Silent schema mismatch when tools return unexpected formats (07-17)
- Lost in the middle: long context position bias (07-18)
- Overconfidence risk requiring uncertainty estimation (07-19)

Downgraded or falsified risks:
- Memory compaction risk partially mitigated by Chain-of-Note structured approach (07-18)
- Error recovery without parameter updates validated by Reflexion (07-16)

DECISION_SET

Decision 1
Decision: Add explicit quality criteria to SIGNAL_CLASSIFICATION section
Evidence: Self-Refine (arXiv:2303.17651) shows 5-20% improvement with structured criteria
Risk Reduced: Insufficient quality criteria
Expected Behavior Change: SIGNAL_CLASSIFICATION must define acceptance thresholds
Why Now: Self-Refine research validated approach (07-16)

Decision 2
Decision: Implement anti-sycophancy checks in A2 doctrine orientation
Evidence: Model-written evaluations (arXiv:2212.09251) and RLHF research (07-21)
Risk Reduced: Sycophancy / Truth suppression
Expected Behavior Change: A2 must cross-check A1 signals against external evidence, not just internal consistency
Why Now: Sycophancy risk identified through RLHF research

Decision 3
Decision: Add schema validation for all external source responses
Evidence: Toolformer (arXiv:2302.04761) identifies silent schema mismatch (07-17)
Risk Reduced: Silent schema mismatch
Expected Behavior Change: EXTERNAL_SOURCE_RECORDS must validate response format before processing
Why Now: Tool-use failures from schema mismatch across 2 consecutive days

Decision 4
Decision: Place critical signals at file start or end, not middle
Evidence: Lost in the Middle (arXiv:2307.03172) demonstrates position bias (07-18)
Risk Reduced: Context position bias
Expected Behavior Change: RAW_RELIABILITY_SIGNAL_LOG should prioritize most critical signals first
Why Now: Position bias confirmed by research

Decision 5
Decision: Mandate uncertainty field in all A1 signals
Evidence: Towards Reliable Alignment (arXiv:2402.05081) (07-19)
Risk Reduced: Overconfidence / Silent failure
Expected Behavior Change: All signals must include Uncertainty: Low/Medium/High
Why Now: Uncertainty estimation research validates existing field

Decision 6
Decision: Establish minimum viable state for missing input recovery
Evidence: AgentBench (arXiv:2308.03688) shows 30-50% degradation on long tasks (07-15)
Risk Reduced: Long-horizon degradation
Expected Behavior Change: If 3 consecutive days missing, A2/A3 output structural heartbeat only
Why Now: Gap 07-06 to 07-11 confirmed real degradation risk

DO_NOT_CHANGE

- OODA loop structure validated by Cognitive Architecture survey (07-19)
- File-based reflection validated by Reflexion (07-16)
- Uncertainty field already exists in signal format - validated (07-19)
- Structured note-taking in RAW_RELIABILITY_SIGNAL_LOG validated (07-18)
- Boundary check format remains unchanged

HANDOFF_TO_A4

- Execute all 6 decisions as protocol actions in A4
- Monitor for concept drift symptoms in next week's signals
- Implement anti-sycophancy cross-checks starting next week
- Consider statistical drift detection for weekly signal comparison
- Verify schema validation implementation feasibility

BOUNDARY_CHECK

Confirm no host repository mechanism read: YES
Confirm no GitHub Actions inspection: YES
Confirm no write outside aegis-cortex: YES
