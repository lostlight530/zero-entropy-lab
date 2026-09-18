# A3 Weekly Discipline Decide

## CORTEX_RUN_HEADER
- **Cortex**: aegis-cortex
- **Host Repository**: zero-entropy-lab
- **Task ID**: A3
- **Cadence**: Weekly
- **Loop Stage**: Decide
- **Target Week**: 2026-W37
- **Logical Week Basis**: Asia/Shanghai
- **Coverage Window**: 2026-09-07 to 2026-09-13
- **Maintenance Date**: 2026-09-19
- **Agent**: GPT Web Maintenance Agent
- **Record Provenance**: HUMAN_AUTHORIZED_PERIODIC_MAINTENANCE_RECOVERY
- **Input Status**: DEGRADED_WITH_PROVENANCE_GAPS
- **Network Status**: NETWORK_VERIFIED
- **Task Status**: DEGRADED
- **Repository Inspection**: AEGIS_ONLY
- **GitHub Actions Inspection**: NO
- **Write Scope**: aegis-cortex only
- **Boundary Violation**: NO
- **Original W37 A3 Delivery State**: NO_JULES_NATIVE_FINAL
- **Daily Path Coverage**: 7 A1 + 7 A2 current paths / COMPLETE
- **Jules-Native Cadence Completeness**: INCOMPLETE
- **Local Incident State**: NO_LOCAL_INCIDENT_EVIDENCE
- **Host Applicability**: UNKNOWN

## INPUT_RECORD

A1 current paths:
- aegis-cortex/2026-09-07-A1-reliability-observe.md
- aegis-cortex/2026-09-08-A1-reliability-observe.md
- aegis-cortex/2026-09-09-A1-reliability-observe.md
- aegis-cortex/2026-09-10-A1-reliability-observe.md
- aegis-cortex/2026-09-11-A1-reliability-observe.md
- aegis-cortex/2026-09-12-A1-reliability-observe.md
- aegis-cortex/2026-09-13-A1-reliability-observe.md

A2 current paths:
- aegis-cortex/2026-09-07-A2-doctrine-orient.md — original INPUT_MISSING / BLOCKED
- aegis-cortex/2026-09-08-A2-doctrine-orient.md
- aegis-cortex/2026-09-09-A2-doctrine-orient.md
- aegis-cortex/2026-09-10-A2-doctrine-orient.md
- aegis-cortex/2026-09-11-A2-doctrine-orient.md
- aegis-cortex/2026-09-12-A2-doctrine-orient.md
- aegis-cortex/2026-09-13-A2-doctrine-orient.md

Producer / chronology limits:
- 2026-09-07 A2 remains a Jules-native blocked execution because same-day A1 was unavailable to that run.
- 2026-09-10 A1/A2 are retained as HUMAN_AUTHORIZED_SUBSTITUTE records in current repository history.
- 2026-09-12 A2 and 2026-09-13 A1/A2 are later reconciliation records rather than a fully Jules-native cadence chain.
- Current path completeness therefore does not establish native execution completeness.

Historical weekly context:
- aegis-cortex/2026-W35-A3-discipline-decide.md
- aegis-cortex/2026-W35-A4-protocol-act.md
- aegis-cortex/2026-W36-A3-discipline-decide.md
- aegis-cortex/2026-W36-A4-protocol-act.md

Prior-month memory:
- aegis-cortex/2026-08-A6-aegis-memorize.md

Current external recheck:
- https://arxiv.org/abs/2606.17099 — delegation-contract/reviewability source identity rechecked
- https://arxiv.org/abs/2603.00130 — self-organizing multi-agent theory source identity rechecked
- https://arxiv.org/abs/2605.16278 — human-oversight framework source identity rechecked
- https://arxiv.org/abs/2606.04329 — memory-poisoning source identity rechecked
- https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent — named product runtime boundaries rechecked
- https://docs.github.com/en/copilot/concepts/agents/cloud-agent/mcp-and-cloud-agent — named product MCP/tool boundaries rechecked

## WEEKLY_RISK_SYNTHESIS

Stable external watch classes:
- false completion / unsupported success claims;
- source and verification provenance loss;
- persistent-memory poisoning as an external risk class;
- tool-authority and least/bounded privilege concerns;
- human-review and automated-evaluation limitations.

Evidence-boundary findings from the week:
- a structured delegation/report contract can improve reviewability without proving stronger objective correctness;
- a run may contain multiple independent sources while an individual claim is still supported by only one source;
- official product documentation is authoritative for that named product, not for Jules/Aegis runtime;
- external benchmark rates and theoretical failure modes remain external until local evidence exists;
- task-time INPUT_MISSING/BLOCKED and later path presence are separate facts.

Source-independence calibration:
- 2026-09-11 contains two independent paper lineages at run level, but each of its two signals has one primary supporting lineage.
- Source count must travel with the exact claim rather than with the whole Daily run.

Local evidence state:
- no Aegis-local measured false-completion rate;
- no local memory-poisoning incident established;
- no local swarm-instability event established;
- no local human-oversight failure rate established;
- current preventive records demonstrate documented boundaries, not proof of mitigation effectiveness.

## DECISION_SET

### DEC-W37-M01
- **Decision ID**: DEC-W37-M01
- **Decision**: Require claim-level source mapping when promoting Daily evidence. Run-level source diversity must not be converted into claim-level independent corroboration.
- **Decision Type**: STRENGTHEN_EVIDENCE
- **Evidence**: 2026-09-11 A2 provides a direct counterexample; 2026-09-12 reconciliation already models the corrected form.
- **Evidence Gap**: no automated claim/source validator exists.
- **Risk Reduced**: unsupported source risk, overconfidence risk, provenance laundering.
- **Expected Behavior Change**: each promoted claim names its actual supporting source lineage and independence count.
- **Confidence**: HIGH
- **Validity Window**: W38-W44
- **Stop Condition**: deterministic claim-to-source validation supersedes prose handling.
- **Host Repository Change NO**: YES

### DEC-W37-M02
- **Decision ID**: DEC-W37-M02
- **Decision**: Continue external reliability research only with explicit source-specific applicability boundaries; product limits, paper benchmarks and theoretical models must not be projected into Aegis-local incidents, rates or capabilities.
- **Decision Type**: CONTINUE_WATCH
- **Evidence**: W37 mixes original research and named GitHub product documentation across distinct task domains.
- **Aegis Repository Evidence**: preventive boundary records exist; no corresponding local incident measurements exist.
- **Risk Reduced**: false local attribution, exaggerated mitigation claims, scope drift.
- **Expected Behavior Change**: preserve `SOURCE_SPECIFIC_RESULT / LOCAL_APPLICABILITY_UNKNOWN` unless local evidence exists.
- **Confidence**: HIGH
- **Validity Window**: W38-W44
- **Stop Condition**: direct authorized local evidence materially changes applicability.
- **Host Repository Change NO**: YES

### DEC-W37-M03
- **Decision ID**: DEC-W37-M03
- **Decision**: Prefer concrete, searchable reliability questions tied to one named failure mode and one original/official source surface instead of broad generic “agent reliability” searches when an exact topic is available.
- **Decision Type**: DISCIPLINE_FOCUS
- **Evidence**: W37's most maintainable records have exact paper/product identities and bounded claims; later correction cost is highest when source identity, access depth or applicability is ambiguous.
- **Risk Reduced**: topic drift, source mismatch, maintenance ambiguity.
- **Expected Behavior Change**: queries favor forms such as `memory poisoning + original paper`, `tool privilege selection + benchmark`, `cloud coding agent + documented runtime limit`, or `agent evaluation + measured failure mode`.
- **Confidence**: HIGH
- **Validity Window**: W38-W42
- **Stop Condition**: a later weekly decision replaces the focus.
- **Host Repository Change NO**: YES

## DO_NOT_CHANGE
- Do not convert external risk papers into local incident reports.
- Do not project paper percentages into Aegis-local rates.
- Do not count two papers in one Daily as two-source verification of every claim.
- Do not overwrite 2026-09-07 A2 BLOCKED history or substitute/reconciliation producer identities.
- Do not modify zero-entropy-lab host code or GitHub Actions.

## HANDOFF_TO_A4
- Source requirement: exact claim → exact source identity → actual access depth → independence count.
- Uncertainty requirement: external risk != local incident.
- Missing-input guard: later file presence does not rewrite task-time missing input.
- Observation focus: concrete failure modes with searchable primary/official sources.
- Narrative guard: preventive discipline != verified mitigation effectiveness.
- Watchlist: false completion, memory poisoning, tool authorization, evaluation reliability, oversight quality.

## BOUNDARY_CHECK
- Host modified: NO
- GitHub Actions inspected or modified: NO
- External risk declared local incident: NO
- Long-term doctrine directly upgraded: NO
- Original producer/status rewritten: NO
- Boundary violation: NO
