# A3 Weekly Discipline Decide

## CORTEX_RUN_HEADER
- **Cortex**: aegis-cortex
- **Host Repository**: zero-entropy-lab
- **Task ID**: A3
- **Cadence**: Weekly
- **Loop Stage**: Decide
- **Target Week**: 2026-W36
- **Logical Week Basis**: Asia/Shanghai
- **Coverage Window**: 2026-08-31 to 2026-09-06
- **Execution Time Asia/Shanghai**: 2026-09-13T14:45:00+08:00
- **Agent**: GPT Web Independent Maintainer
- **Record Provenance**: HUMAN_AUTHORIZED_RECONCILIATION
- **Input Status**: SUCCESS_WITH_EVIDENCE_CALIBRATION
- **Network Status**: NETWORK_VERIFIED
- **Task Status**: SUCCESS
- **Repository Inspection**: AEGIS_ONLY
- **GitHub Actions Inspection**: NO
- **Write Scope**: aegis-cortex only
- **Boundary Violation**: NO
- **Original W36 A3 Delivery State**: NO_CANONICAL_FILE_ON_BASE_MAIN
- **Current Path Status**: PRESENT_ON_RECONCILIATION_BRANCH

## INPUT_RECORD

A1 files:
- aegis-cortex/2026-08-31-A1-reliability-observe.md
- aegis-cortex/2026-09-01-A1-reliability-observe.md
- aegis-cortex/2026-09-02-A1-reliability-observe.md
- aegis-cortex/2026-09-03-A1-reliability-observe.md
- aegis-cortex/2026-09-04-A1-reliability-observe.md
- aegis-cortex/2026-09-05-A1-reliability-observe.md
- aegis-cortex/2026-09-06-A1-reliability-observe.md

A2 files:
- aegis-cortex/2026-08-31-A2-doctrine-orient.md
- aegis-cortex/2026-09-01-A2-doctrine-orient.md
- aegis-cortex/2026-09-02-A2-doctrine-orient.md
- aegis-cortex/2026-09-03-A2-doctrine-orient.md
- aegis-cortex/2026-09-04-A2-doctrine-orient.md
- aegis-cortex/2026-09-05-A2-doctrine-orient.md
- aegis-cortex/2026-09-06-A2-doctrine-orient.md

Recent historical A3/A4:
- aegis-cortex/2026-W32-A3-discipline-decide.md
- aegis-cortex/2026-W33-A3-discipline-decide.md
- aegis-cortex/2026-W34-A3-discipline-decide.md
- aegis-cortex/2026-W35-A3-discipline-decide.md
- aegis-cortex/2026-W32-A4-protocol-act.md
- aegis-cortex/2026-W33-A4-protocol-act.md
- aegis-cortex/2026-W34-A4-protocol-act.md
- aegis-cortex/2026-W35-A4-protocol-act.md

Monthly memory:
- aegis-cortex/2026-08-A6-aegis-memorize.md

Period integrity:
- Expected A1: 7; Actual: 7
- Expected A2: 7; Actual: 7
- Missing Daily paths: NONE
- Coverage Ratio: 100%

Evidence calibration carried into synthesis:
- 2026-09-01 already contains a 2026-09-02 correction limiting abstract/API evidence and isolated causal attribution.
- 2026-09-02 relied on Crossref fallback after arXiv query failure; Crossref discovery/metadata is retained but is not treated as equivalent to full-text experimental verification.
- 2026-09-03 A1 contains exact arXiv source identities. The same-day A2 used different Crossref-returned titles for several signal checks; current weekly synthesis therefore treats those A2 checks as related discovery rather than exact-source corroboration of the A1 paper identities.
- 2026-09-04 through 2026-09-06 retain their external-risk/local-incident separation.

## WEEKLY_RISK_SYNTHESIS

Repeated risks:
- false-completion / unsupported-success claims;
- tool-use/postcondition verification;
- memory poisoning/provenance laundering as external risk;
- instruction/scope conflict as an external reliability class.

Current evidence-strengthening signal:
- source identity and access depth are themselves part of reliability evidence. Exact paper identity, metadata/abstract/full-text access and claim mapping should not be compressed into one generic VERIFIED label.

External-only risks:
- memory-poisoning attack mechanisms;
- generic coding-agent false-completion rates/mechanisms;
- multi-agent instruction-conflict and concurrency models.

Aegis-local record evidence:
- periodic history shows why task-time state, later delivery and current path state must remain separate;
- W36 Daily evidence shows mixed access depths and source-matching quality that should be preserved rather than flattened during weekly compression.

Downgraded interpretations:
- Crossref metadata/search result = full primary-research verification;
- two independent papers somewhere in one run = every individual claim has two-source corroboration;
- external failure rates = Aegis-local failure rates;
- preventive A4/A6 records = proof that a local incident occurred.

Remaining uncertainty:
- no Aegis-local measured false-completion rate;
- no local exploitability measurement for memory poisoning;
- no local benchmark proving effectiveness of status+content verification.

## DECISION_SET

### Decision ID: DEC-W36-01
- **Decision**: Preserve exact claim-to-source identity and access depth before promoting external evidence from Daily to Weekly.
- **Decision Type**: STRENGTHEN_EVIDENCE
- **External Evidence**: supporting provenance research exists, but the decision is primarily motivated by the W36 record set itself.
- **Aegis Repository Evidence**: 2026-09-02 Crossref fallback/access-depth distinction and 2026-09-03 A1/A2 source-identity divergence.
- **Evidence Gap**: recurrence frequency beyond the observed records is unknown.
- **Counterevidence**: none to the basic requirement that a verified claim be mapped to the source actually checked.
- **Risk Reduced**: unsupported source risk, overconfidence risk, stale doctrine risk.
- **Expected Behavior Change**: future records should distinguish FULL_TEXT, ABSTRACT, METADATA and SECONDARY access where material, and should match exact title/identifier to the claim being promoted.
- **Why Now**: W36 provides concrete record-level examples where that distinction changes the strength of the conclusion.
- **Confidence**: HIGH
- **Validity Window**: W37-W44
- **Stop Condition**: deterministic source-identity/access-depth validation supersedes prose handling.
- **Host Repository Change NO**: YES

### Decision ID: DEC-W36-02
- **Decision**: Continue status+content/postcondition verification as a bounded preventive discipline, while prohibiting projection of external failure rates into local incident claims.
- **Decision Type**: CONTINUE_WATCH
- **External Evidence**: multiple original research/engineering lineages across W34-W36.
- **Aegis Repository Evidence**: preventive records exist; no measured local false-completion incident rate is established.
- **Evidence Gap**: local effectiveness and frequency remain unknown.
- **Counterevidence**: structure/checker success does not establish all semantic postconditions, but absence of local incident data also prevents stronger claims.
- **Risk Reduced**: false completion risk, recovery verification risk, overconfidence risk.
- **Expected Behavior Change**: verify observable postconditions when authorized; retain UNKNOWN when not observable.
- **Why Now**: the theme is recurrent and already part of Aegis preventive discipline, but evidence boundaries need to remain explicit.
- **Confidence**: MEDIUM
- **Validity Window**: W37-W40
- **Stop Condition**: task-specific deterministic proof or contrary local evidence changes the treatment.
- **Host Repository Change NO**: YES

### Decision ID: DEC-W36-03
- **Decision**: Continue watching memory-poisoning/provenance-laundering as an external risk; preserve source lineage through compression and do not promote the risk into a local incident without local evidence.
- **Decision Type**: CONTINUE_WATCH
- **External Evidence**: multiple original-research lineages across the recent record set.
- **Aegis Repository Evidence**: NO_LOCAL_INCIDENT_EVIDENCE; preventive provenance doctrine exists.
- **Evidence Gap**: local exploitability unknown.
- **Counterevidence**: constrained Aegis read/write boundaries reduce exposure relative to open persistent-memory systems.
- **Risk Reduced**: memory poisoning risk, memory compression risk, overconfidence risk.
- **Expected Behavior Change**: source lineage and local/external state survive Daily→Weekly→Monthly compression.
- **Why Now**: repeated strong external evidence exists while local occurrence remains unestablished.
- **Confidence**: HIGH for external risk; UNKNOWN for local occurrence.
- **Validity Window**: W37-W44
- **Stop Condition**: applicability is disproven or materially changed by local architecture evidence.
- **Host Repository Change NO**: YES

## DO_NOT_CHANGE
- Do not modify zero-entropy-lab host code or GitHub Actions.
- Do not import external failure-rate percentages as Aegis-local rates.
- Do not describe memory poisoning as a local incident without local evidence.
- Do not treat metadata-only discovery as full-text verification.
- Do not overwrite original W36 A4 BLOCKED history.

## HANDOFF_TO_A4
- Observation discipline: exact source/claim identity.
- Verification requirement: access depth + observable postcondition.
- Source requirement: primary/full text for high-confidence research claims where the claim depends on paper content beyond metadata.
- Uncertainty requirement: external risk != local incident.
- Missing-input guard: an unavailable A3 at task time remains a valid historical BLOCKED state.
- Narrative guard: run-level source diversity != claim-level corroboration.

## BOUNDARY_CHECK
- Host modified: NO
- External risk declared local incident: NO
- Long-term doctrine directly upgraded: NO
- Boundary violation: NO
