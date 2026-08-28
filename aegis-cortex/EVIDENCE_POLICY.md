# Aegis Cortex Evidence Policy

Status: current repository evidence policy  
Calibration: 2026-08-28

This file defines how committed Aegis A1–A6 artifacts are interpreted against the implementation and evidence that actually exist in `zero-entropy-lab`.

## 1. Repository realization map

Aegis is a research/evidence surface. It is not the host kernel runtime.

The host repository contains distinct implementation domains:

- `src/kernel/memory/` — SQLite graph/state, FTS5 retrieval and linked JSONL persistence
- `src/kernel/sensory/` — harvesting, hygiene and structural extraction
- `src/kernel/cognitive/` — reranking and graph-derived analysis
- `src/kernel/orchestration/` — local lifecycle/evolution orchestration
- `src/kernel/protocol/` — protocol/command experiments and transition declarations
- `data/inputs/`, `data/knowledge/`, `data/memories/` — host data/memory surfaces
- `index.html` — presentation

Aegis A1–A6 artifacts remain separate documentary/research evidence.

Use:

`AEGIS_RESEARCH_SURFACE != HOST_KERNEL_RUNTIME`.

## 2. SQLite and linked JSONL are distinct host persistence surfaces

Host SQLite batch writes and linked JSONL writes are not one atomic transaction.

Use:

`SQLITE_WRITE_SUCCESS != LINKED_LEDGER_SYNC_VERIFIED`.

Hash linkage can support checked local content/linkage integrity; it does not prove source truth, authorship, authorization, or continuous DB↔ledger equivalence.

`LOCAL_LEDGER_LINKAGE_SIGNAL / EXTERNAL_TRUTH_NOT_ESTABLISHED`.

## 3. HMAC verification is row- and key-scoped

The host signs new entity rows using `NEXUS_SECRET_KEY` when supplied, otherwise a fallback repository string. Legacy rows without signatures can pass the backward-compatibility `verify_memory()` path without a cryptographic comparison.

Use:

`VERIFY_MEMORY_TRUE != EVERY_ROW_CRYPTOGRAPHICALLY_VERIFIED`.

A valid HMAC establishes field consistency against the configured key, not external identity, authorization, source truth, or hardened secret management.

## 4. Host retrieval/reasoning labels are local signals

FTS5 retrieval, graph expansion, reranking, graph analysis, PageRank-like scores, `ONLINE`, `HIGH_COHESIVENESS`, `TASK_SUGGESTION`, and `STRATEGY` describe local computation/reporting surfaces.

They do not independently establish semantic truth, availability SLA, safety, or autonomous authority.

Use:

`LOCAL_HEURISTIC_LABEL / SEMANTIC_AND_OPERATIONAL_GUARANTEE_NOT_ESTABLISHED`.

## 5. PageRank worker silence is not completion proof

The host PageRank helper can catch worker exceptions internally.

Use:

`NO_SURFACED_WORKER_ERROR != FULL_PARALLEL_COMPUTATION_VERIFIED`.

## 6. Transition declaration is not execution

`TransitionDeclaration` validates/canonicalizes a declaration and exposes a deterministic fingerprint. It has no execution side effects.

Use:

`VALID_TRANSITION_DECLARATION != TRANSITION_EXECUTED`.

and:

`DECLARATION_FINGERPRINT != AUTHORITATIVE_EXTERNAL_EFFECT`.

## 7. Aegis checker boundary

`aegis-cortex/check.py` validates artifact structure/handoffs/evidence-state fields and repository-boundary markers.

A checker pass does not establish local incident absence, semantic correctness, external claim truth, tool-effect success, outcome correctness, poisoning immunity, or universal reliability.

Use:

`LOCAL_STRUCTURAL_CONTRACT_RESULT / SEMANTIC_INDEPENDENCE_NOT_ESTABLISHED`.

## 8. Reliability evidence classes remain separate

Keep distinct:

- `EXTERNAL_RISK_CLASS`
- `EXTERNAL_FAILURE_REPORT`
- `LOCAL_PREVENTIVE_RECORD`
- `LOCAL_ARCHITECTURE_RECORD`
- `LOCAL_REPOSITORY_INCIDENT`
- `LOCAL_STRUCTURAL_CONTRACT_RESULT`
- `LOCAL_STORAGE_INTEGRITY_SIGNAL`
- `LOCAL_RUNTIME_OUTCOME`
- `AUTHORITATIVE_EXTERNAL_EFFECT`
- `UNRESOLVED`

`LOCAL_PREVENTIVE_RECORD != LOCAL_INCIDENT_EVIDENCE`.

`LOCAL_ARCHITECTURE_RECORD != LOCAL_INCIDENT_EVIDENCE`.

## 9. Source authority and tier labels are claim-specific

A1/A2 must distinguish source access, identity, source type, authority for the exact proposition, and claim support.

A task-local label such as `Tier 1` is not sufficient authority by itself.

Useful source classes include:

- original/primary research
- official standard/specification
- first-party product/implementation documentation
- metadata/index service
- vendor interpretation
- secondary technical reporting

For a research proposition, the original paper is stronger evidence than a metadata/index page that merely identifies it.

Crossref/SSRN metadata access does not automatically mean the underlying paper's full text or theorem was verified.

## 10. Same-source repetition is not independent corroboration

A2 repeating A1 does not create a new source. Daily reuse of the same external paper on multiple dates also remains one source lineage unless a genuinely independent source is introduced.

Reference case:

- 2026-08-25 and 2026-08-27 both use arXiv:2606.24322 for memory-poisoning/laundering risk

Use:

`SAME_SOURCE_REOBSERVATION / NOT_INDEPENDENT_CORROBORATION`.

And:

`WEEKLY_INHERITANCE_DOES_NOT_UPGRADE_EVIDENCE`.

## 11. Daily A1 → A2 SOP

### A1 Observe

A1 records separately:

1. source access/network state
2. canonical source identity/type
3. authority for the exact external claim
4. publication/version/check time
5. external proposition
6. `Local Evidence Available: YES/NO`
7. relevance/limitations
8. whether A2 needs independent verification

A1 must not infer a local incident merely because an external failure mode is highly relevant.

### A2 Orient

A2 may add independent evidence and judge local applicability.

It must not:

- turn external risk into local incident
- turn an external defense into a required host implementation
- turn paper benchmark percentages into Aegis-local rates
- treat A1 restatement as independent corroboration
- treat a source-tier label as a substitute for provenance
- treat absence of local evidence as evidence of immunity

Use:

`EXTERNAL_RISK_SUPPORTED / LOCAL_INCIDENT_NOT_ESTABLISHED`.

## 12. Memory-poisoning interpretation

Persistent agent memory poisoning and laundering are supported external risk classes in current research.

This supports research caution around provenance, summarization, trusted-tool echoes, corroboration, and long-horizon carry-forward.

It does **not** establish:

- an Aegis-local poisoning incident
- a host-kernel poisoning incident
- local applicability of every external attack channel
- immunity from poisoning
- mandatory adoption of one external formal/cryptographic defense

Use:

`MEMORY_POISONING_EXTERNAL_RISK_SUPPORTED / LOCAL_INCIDENT_NOT_ESTABLISHED`.

## 13. A5/A6 documentary memory is not host runtime memory

A5/A6 are Aegis research lifecycle artifacts for reflection, calibration, and memorization.

They are not the host memory runtime under `src/kernel/memory/**`.

Use:

`AEGIS_A5_A6_RESEARCH_MEMORY != HOST_KERNEL_MEMORY_RUNTIME`.

An external memory-security paper may affect how A5/A6 evidence is reviewed without proving a host-memory vulnerability or implementation.

## 14. Benchmarks and local probability

External pass rates, failure rates, attack-success rates, vendor production figures, or benchmark results remain scoped to their studied population/model/harness.

Use:

- `BENCHMARK_SPECIFIC_RESULT`
- `VENDOR_EXTERNAL_RATE / LOCAL_RATE_NOT_ESTABLISHED`
- `EXTERNAL_RESEARCH_RATE / AEGIS_LOCAL_RATE_NOT_ESTABLISHED`

Probability language requires a defined applicable population and denominator.

## 15. Temporal provenance and delivery state

Keep separate:

- logical date
- execution/check time
- source publication/event time
- generation evidence
- merge/delivery visibility
- Weekly snapshot visibility
- current path presence

Reference August states remain:

- 08-03 `TEMPORAL_PROVENANCE_CONFLICT`
- 08-15 `UNRESOLVED_DELIVERY_HISTORY`
- 08-16 retained `INPUT_MISSING / BLOCKED_AT_EXECUTION`

A later path cannot retroactively create historical successful execution.

## 16. Weekly A3/A4 SOP

Weekly synthesis may cluster, downgrade, or add evidence but must preserve source lineage and local-evidence state.

It must not:

- manufacture local incident frequency from external research
- treat repeated Daily use of one paper as trend frequency
- erase blocked/missing Daily history
- create an A3/A4 result before the weekly task actually occurs

At the 2026-08-27 cutoff W35 is:

`IN_PROGRESS`.

See `2026-W35-partial-reconciliation.md`.

## 17. Monthly A5/A6 SOP

Formal August A5/A6 remains `OPEN` until the natural monthly lifecycle has actual evidence.

## 16. Active daily and weekly record contract

New A1 and A2 records identify evidence class, source identity, claim-specific authority, independent verification, local incident evidence, host applicability, original execution status, current path status, and record provenance.

New A3 and A4 records provide a Daily coverage matrix, inherited and newly independent evidence, preserved missing inputs, external-risk state, local-incident state, historical execution state, and current delivery state.

Reconstruction records cannot claim original success. External risk cannot be mapped directly to a local incident. Current path presence cannot rewrite an earlier missing or blocked execution snapshot.

`EXTERNAL_RISK != LOCAL_INCIDENT`.

`DECLARATION_PRESENT != TRANSITION_EXECUTED`.

A stage audit cannot create 2026-08-28 through 2026-08-31 evidence or pre-author the final preserve/downgrade/expire/reverify decisions.

## 18. Completion evidence is multi-surface

Keep distinct:

- return/status evidence
- artifact structure
- storage integrity
- expected-content/postcondition evidence
- semantic/source support
- authoritative external effect

A success string, declaration fingerprint, hash, HMAC result, checker pass, or file presence cannot independently prove intended external-effect completion.

## 19. Historical correction method

Historical A1–A4 artifacts remain point-in-time evidence.

Later reconciliation preserves original state and records stronger current interpretation without silently rewriting history.

Current August stage authority: `2026-08-through-27-stage-audit.md`.

Formal August A5/A6: `OPEN`.
