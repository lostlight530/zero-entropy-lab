# A3 Weekly Discipline Decide

CORTEX_RUN_HEADER

Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A3
Cadence: Weekly
Loop Stage: Decide
Run Week: 2026-W29
Agent: Jules
Knowledge Source: This Week A1/A2 + External Web + aegis-cortex local files
Repository Inspection: NO
GitHub Actions Inspection: NO
Write Scope: aegis-cortex only
Boundary Violation: NO

INPUT_RECORD

Files read this week:
- aegis-cortex/2026-07-20-A1-reliability-observe.md
- aegis-cortex/2026-07-20-A2-doctrine-orient.md
- aegis-cortex/2026-07-21-A1-reliability-observe.md
- aegis-cortex/2026-07-21-A2-doctrine-orient.md
- aegis-cortex/2026-07-22-A1-reliability-observe.md
- aegis-cortex/2026-07-22-A2-doctrine-orient.md
- aegis-cortex/2026-07-23-A1-reliability-observe.md
- aegis-cortex/2026-07-23-A2-doctrine-orient.md
- aegis-cortex/2026-07-24-A1-reliability-observe.md
- aegis-cortex/2026-07-24-A2-doctrine-orient.md
- aegis-cortex/2026-07-25-A1-reliability-observe.md
- aegis-cortex/2026-07-25-A2-doctrine-orient.md
- aegis-cortex/2026-07-26-A1-reliability-observe.md
- aegis-cortex/2026-07-26-A2-doctrine-orient.md
- aegis-cortex/2026-07-27-A1-reliability-observe.md
- aegis-cortex/2026-07-27-A2-doctrine-orient.md

WEEKLY_RISK_SYNTHESIS

Repeated risks this week:
- Observability gap: system opacity requires causal explanations not just error detection (07-20, 07-26)
- Concept drift causing silent failures (07-20, 07-14)
- Sycophancy from RLHF alignment (07-21, 07-15)
- Chain-of-thought error amplification (07-22, 07-18)
- RAG retrieval quality as new failure point (07-23, 07-17)

New risks this week:
- Alignment tax: safety reduces capability (07-21)
- Prompt fragility: 10-20% accuracy swing from wording changes (07-22)
- Active retrieval optimization opportunity (07-23)
- Constitutional AI self-governance validated (07-24)
- Three-layer isolation: network, filesystem, process (07-25)
- OpenTelemetry GenAI semantic conventions for standard telemetry (07-26)
- Property-based testing for edge case coverage (07-27)

Downgraded or falsified risks:
- Retrieval failure risk reduced by active retrieval approach (07-23)
- Governance gap mitigated by existing SOUL.md constitutional layer (07-24)
- Non-standard observability risk reduced by existing structured format (07-26)

DECISION_SET

Decision 1
Decision: Adopt OpenTelemetry GenAI semantic conventions for telemetry attributes
Evidence: OpenTelemetry GenAI spec (07-26) provides industry standard
Risk Reduced: Non-standard observability
Expected Behavior Change: CORTEX_RUN_HEADER should include standard telemetry attributes (model, tokens, latency)
Why Now: Industry standard available and applicable

Decision 2
Decision: Implement active retrieval: deep verification only when uncertainty is flagged
Evidence: Active RAG (arXiv:2305.06983) shows similar accuracy with fewer retrievals (07-23)
Risk Reduced: Unnecessary computation / Latency
Expected Behavior Change: A1 should flag uncertainty level; A2 only does deep analysis on HIGH uncertainty signals
Why Now: Efficiency optimization opportunity identified

Decision 3
Decision: Add regression testing for template changes via Promptfoo or equivalent
Evidence: Promptfoo (07-27) enables prompt regression testing
Risk Reduced: Prompt regression / Template fragility
Expected Behavior Change: Template changes must pass regression tests before deployment
Why Now: Prompt fragility risk (07-22) requires systematic testing

Decision 4
Decision: Reinforce three-layer isolation check in boundary verification
Evidence: Sandboxing AI (arXiv:2402.14992) identifies three layers (07-25)
Risk Reduced: Isolation breach
Expected Behavior Change: BOUNDARY_CHECK must verify network, filesystem, and process isolation
Why Now: Security framework upgrade from single-layer to three-layer

Decision 5
Decision: Adopt multi-pillar safety approach: red-teaming + constitutional + external validation
Evidence: Safety alignment survey (arXiv:2402.13081) identifies three pillars (07-24)
Risk Reduced: Single-method reliance
Expected Behavior Change: A3 must cite evidence from at least 2 different safety approaches
Why Now: Single-method insufficiency confirmed by survey

Decision 6
Decision: Establish prompt stability guidelines for template consistency
Evidence: Prompt engineering research (07-22) shows 10-20% variance from wording
Risk Reduced: Prompt fragility
Expected Behavior Change: Template changes must be accompanied by variance assessment
Why Now: Prompt sensitivity research quantified the risk

DO_NOT_CHANGE

- OODA loop structure continues to be validated
- File-based memory and reflection approach validated (07-24 Constitutional AI)
- Uncertainty field in signals validated (07-19, 07-23 active retrieval)
- SOUL.md constitutional layer validated (07-24)
- Zero-dependency principle maintained

HANDOFF_TO_A4

- Execute all 6 decisions as protocol actions in A4
- Implement OpenTelemetry attributes in next template revision
- Establish regression testing pipeline for templates
- Upgrade boundary check to three-layer verification
- Monitor prompt stability across template versions
- Continue tracking alignment tax tradeoffs

BOUNDARY_CHECK

Confirm no host repository mechanism read: YES
Confirm no GitHub Actions inspection: YES
Confirm no write outside aegis-cortex: YES
