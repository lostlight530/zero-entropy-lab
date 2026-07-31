# A4 Weekly Protocol Act

CORTEX_RUN_HEADER

Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A4
Cadence: Weekly
Loop Stage: Act
Run Week: 2026-W28
Agent: Jules
Knowledge Source: A3 decision + External Web + aegis-cortex local files
Repository Inspection: NO
GitHub Actions Inspection: NO
Write Scope: aegis-cortex only
Boundary Violation: NO

INPUT_RECORD

- aegis-cortex/2026-W28-A3-discipline-decide.md
Supporting files:
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

PROTOCOL_ACTION_RECORD

Action 1
Action: Add explicit quality criteria to SIGNAL_CLASSIFICATION
Reason: Self-Refine shows 5-20% improvement with structured criteria
Source Decision: Decision 1: Quality criteria mandate
Expected Behavior Change: SIGNAL_CLASSIFICATION defines acceptance thresholds for each signal
Risk Reduced: Insufficient quality criteria
No Host Repository Change: YES

Action 2
Action: Implement anti-sycophancy cross-checks in A2
Reason: RLHF research and model-written evaluations identify sycophancy bias
Source Decision: Decision 2: Anti-sycophancy protocol
Expected Behavior Change: A2 cross-checks A1 signals against external evidence, not just internal consistency
Risk Reduced: Sycophancy / Truth suppression
No Host Repository Change: YES

Action 3
Action: Add schema validation for external source responses
Reason: Toolformer identifies silent schema mismatch risk
Source Decision: Decision 3: Schema validation
Expected Behavior Change: EXTERNAL_SOURCE_RECORDS validates response format before processing
Risk Reduced: Silent schema mismatch
No Host Repository Change: YES

Action 4
Action: Reorder signals: critical first in RAW_RELIABILITY_SIGNAL_LOG
Reason: Lost in the Middle research demonstrates position bias
Source Decision: Decision 4: Signal ordering protocol
Expected Behavior Change: Most critical signals placed at start of signal log
Risk Reduced: Context position bias
No Host Repository Change: YES

Action 5
Action: Mandate uncertainty field in all A1 signals (already exists, reinforce)
Reason: Uncertainty estimation research validates existing field
Source Decision: Decision 5: Uncertainty field enforcement
Expected Behavior Change: All signals must include Uncertainty: Low/Medium/High
Risk Reduced: Overconfidence / Silent failure
No Host Repository Change: YES

Action 6
Action: Establish minimum viable state for 3-day missing input gap
Reason: AgentBench shows 30-50% degradation on long tasks; 07-06 to 07-11 gap confirmed risk
Source Decision: Decision 6: Minimum viable state protocol
Expected Behavior Change: If 3 consecutive days missing, A2/A3 output structural heartbeat only
Risk Reduced: Long-horizon degradation
No Host Repository Change: YES

NEXT_WEEK_OPERATING_NOTES

Key risks to observe next week:
- Monitor for concept drift symptoms in signal patterns
- Implement anti-sycophancy cross-checks starting next week
- Consider statistical drift detection for weekly comparison
- Verify schema validation implementation
- Track alignment tax tradeoffs

Hallucinations to avoid:
- Do not fabricate benchmark numbers or performance metrics
- Do not claim alignment without citing specific evidence
- Do not infer causal relationships without experimental backing

Source types to continue verifying:
- arXiv paper IDs (verify via arxiv.org/abs/ID)
- Benchmark results (verify via original paper, not secondary citations)
- Self-Refine improvement percentages (verify in source paper)

ACTION_LIMITS

No host repository file changed: This execution was strictly confined to aegis-cortex directory
No GitHub Actions inspected: All workflow files and configs remain unchanged
No non-periodic file created: Only standard periodic files were generated

BOUNDARY_CHECK

Confirm no host repository mechanism read: YES
Confirm no GitHub Actions inspection: YES
Confirm no write outside aegis-cortex: YES
