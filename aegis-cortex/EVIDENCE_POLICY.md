# Aegis Cortex Evidence Policy

Status: post-hoc repository evidence policy  
Calibration: 2026-08-24

This file defines how committed Aegis A1–A6 artifacts are interpreted against the implementation that actually exists in `zero-entropy-lab`.

## 1. Repository realization map

Aegis is a research/evidence surface. It is not the host kernel runtime.

The host repository contains distinct implementation domains:

- `src/kernel/memory/` — SQLite graph/state, FTS5 retrieval and linked JSONL persistence
- `src/kernel/sensory/` — harvesting, hygiene and structural extraction
- `src/kernel/cognitive/` — pure-Python reranking and graph-derived analysis
- `src/kernel/orchestration/` — local lifecycle/evolution orchestration
- `src/kernel/protocol/` — local protocol/command experiments and transition declarations
- `data/inputs/` — source/input material
- `data/knowledge/` — persisted graph/ledger records
- `data/memories/` — generated report/memory artifacts
- `index.html` — presentation

These are related implementation surfaces but are not interchangeable evidence classes.

## 2. SQLite and linked JSONL are distinct persistence surfaces

`src/kernel/memory/cortex.py` maintains SQLite state and a linked JSONL ledger using `prev_hash` / `hash` records.

Important implementation fact: SQLite batch writes and JSONL writes are **not one atomic transaction**.

For entity/relation batches, SQLite changes are released/committed first. JSONL records are written afterward.

Therefore:

`SQLITE_WRITE_SUCCESS != LINKED_LEDGER_SYNC_VERIFIED`.

A later JSONL write failure can coexist with an already committed SQLite state.

A hash-linked JSONL record can support content/linkage integrity for the records actually checked. It does not independently prove source truth, authorship, authorization, or that SQLite and JSONL were continuously equivalent through history.

Use:

`LOCAL_LEDGER_LINKAGE_SIGNAL / EXTERNAL_TRUTH_NOT_ESTABLISHED`.

## 3. HMAC verification is row- and key-scoped

`Cortex` signs new entity rows with HMAC-SHA256 using `NEXUS_SECRET_KEY` when supplied, otherwise a repository fallback string.

`verify_memory()` has a backward-compatibility rule: a legacy row with `signature is None` returns `True` without performing a cryptographic comparison.

Therefore:

`VERIFY_MEMORY_TRUE != EVERY_ROW_CRYPTOGRAPHICALLY_VERIFIED`.

For rows that do have a signature, verification establishes consistency against the configured key and serialized entity fields.

It does not establish:

- external actor identity
- authorization
- source truth
- hardened secret storage
- uncompromised key provenance

The fallback key means the mechanism must not be represented as a hardened external trust or secret-management boundary.

## 4. Retrieval and graph analysis are local signals

The kernel combines:

- FTS5 BM25 candidate retrieval
- graph expansion
- pure-Python reranking
- structural graph analysis
- PageRank-like ranking

These operations describe local repository state and query results.

They do not independently prove semantic truth, factual correctness, safety, or external reliability.

Use:

`LOCAL_RETRIEVAL_OR_GRAPH_SIGNAL / CLAIM_TRUTH_NOT_ESTABLISHED`.

## 5. Reasoning/report labels are heuristic operational text

`src/kernel/cognitive/reason.py` emits labels such as:

- `STATUS: ONLINE`
- `GRAPH_DENSITY: ..._HIGH_COHESIVENESS`
- `TOPOLOGY: HIGHLY_STRUCTURED_ZERO_ORPHANS`
- `TASK_SUGGESTION: ...`
- `STRATEGY: ...`

`report_hygiene_core.py` may render those machine labels into human-readable reports.

The renderer changes presentation, not evidence strength.

Therefore:

- `STATUS: ONLINE` is a local report label, not an availability SLA
- `HIGH_COHESIVENESS` is a local threshold label, not semantic coherence
- `TASK_SUGGESTION` / `STRATEGY` are generated recommendations, not proof of autonomous authority or future execution
- a human-readable report does not upgrade the underlying machine label into a validated semantic conclusion

Use:

`LOCAL_HEURISTIC_LABEL / SEMANTIC_AND_OPERATIONAL_GUARANTEE_NOT_ESTABLISHED`.

## 6. PageRank worker completion must not be inferred from silence

The multiprocessing PageRank helper catches worker exceptions internally.

Absence of a surfaced worker exception therefore does not, by itself, prove every chunk was computed successfully.

A strong PageRank-completion claim requires retained output/consistency evidence appropriate to the calculation, not merely the absence of an exception message.

Use:

`NO_SURFACED_WORKER_ERROR != FULL_PARALLEL_COMPUTATION_VERIFIED`.

## 7. Transition declaration is not transition execution

`src/kernel/protocol/transition_contract.py` validates a canonical `TransitionDeclaration` and exposes a deterministic SHA-256 fingerprint.

It intentionally has no execution side effects.

Therefore:

`VALID_TRANSITION_DECLARATION != TRANSITION_EXECUTED`.

and:

`DECLARATION_FINGERPRINT != AUTHORITATIVE_EXTERNAL_EFFECT`.

The fingerprint identifies canonical declaration bytes; it does not prove that the declared preconditions were true, that the actor was externally authorized, or that effects occurred.

## 8. Aegis checker boundary

`aegis-cortex/check.py` validates artifact contracts such as:

- required sections
- logical date/week
- A1→A2 and A3→A4 handoffs
- Decision/Action IDs
- evidence-state fields
- repository-boundary markers

It intentionally does not inspect host implementation or judge external truth.

A checker pass does not establish:

- local incident absence
- semantic correctness
- external claim truth
- tool-effect success
- task-outcome correctness
- memory/context-poisoning immunity
- universal reliability

Use:

`LOCAL_STRUCTURAL_CONTRACT_RESULT / SEMANTIC_INDEPENDENCE_NOT_ESTABLISHED`.

## 9. Reliability evidence classes remain separate

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

A historical A-file discussing a risk is a preventive/research record, not proof that the incident occurred locally.

`LOCAL_PREVENTIVE_RECORD != LOCAL_INCIDENT_EVIDENCE`.

`LOCAL_ARCHITECTURE_RECORD != LOCAL_INCIDENT_EVIDENCE`.

## 10. Source authority and independence are claim-specific

Keep separate:

- source access
- source identity
- primary/secondary authority for the exact proposition
- vendor interpretation
- claim support
- source-lineage independence

Examples:

- a vendor MCP authorization article is not the MCP specification
- a Palo Alto/Auth0 discussion of OWASP is not automatically the primary standard text
- multiple pages from one publisher are not independent corroboration
- A2 repeating A1 does not create a new independent source
- A3/A4 repetition does not strengthen weak upstream evidence

Use:

`SAME_SOURCE_OR_PUBLISHER_REPETITION / NOT_INDEPENDENT_CORROBORATION`.

## 11. Temporal provenance and delivery state are independent

Keep separate:

- logical date
- execution/check time
- source publication/event time
- generation evidence
- merge/delivery visibility
- Weekly snapshot visibility
- current path presence

Reference August states:

- 08-03: cited source/event date is after the recorded check date → `TEMPORAL_PROVENANCE_CONFLICT`
- 08-15 A1/A2: `UNRESOLVED_DELIVERY_HISTORY`
- 08-16 A1: currently present while retained A2 historical `INPUT_MISSING / BLOCKED_AT_EXECUTION` remains valid
- 08-24 A1/A2: complete current pair

A later file cannot retroactively create a historical successful execution.

## 12. Completion evidence is multi-surface

Keep distinct:

- return/status evidence
- artifact structure
- storage integrity
- expected-content/postcondition evidence
- semantic/source support
- authoritative external effect

A success string, declaration fingerprint, hash, HMAC result, checker pass, or file presence cannot independently prove intended external-effect completion.

## 13. Memory/context poisoning remains an external risk class

Memory/context poisoning is a supported external agentic risk class.

That does not establish a local Aegis incident.

Conversely, Markdown scope, local hashing, signatures, and structural validation do not prove immunity from stale, weakly sourced, misleading, or poisoned carry-forward context.

Use:

`EXTERNAL_RISK_SUPPORTED / LOCAL_INCIDENT_NOT_ESTABLISHED`.

## 14. Benchmarks and cross-domain results remain bounded

External failure rates, vendor production figures, model/harness studies, or cross-domain state-drift papers do not become Aegis-local probabilities.

Examples:

- Openlayer `3–15%` remains vendor-reported context
- ClayBuddy remains benchmark/model/harness-specific
- VLA/navigation drift is a cross-domain analogy
- long-horizon false-completion studies define external failure classes, not local frequency

Use:

- `BENCHMARK_SPECIFIC_RESULT`
- `VENDOR_EXTERNAL_RATE / LOCAL_RATE_NOT_ESTABLISHED`
- `CROSS_DOMAIN_ANALOGY / LOCAL_GENERALIZATION_NOT_ESTABLISHED`

Probability language requires a defined applicable population and denominator.

## 15. Weekly inheritance and control precedence

Weekly aggregation does not create source independence or local incident frequency.

`WEEKLY_INHERITANCE_DOES_NOT_UPGRADE_EVIDENCE`.

An authorized current instruction may define execution/control precedence, but it does not make newer text factually superior to older supported evidence.

`CONTROL_PRECEDENCE != EVIDENCE_TRUTH_PRECEDENCE`.

## 16. Historical correction method

Historical A1–A4 artifacts remain point-in-time evidence.

When later evidence changes current interpretation, use reconciliation that preserves:

- original execution state
- original source/claim wording where historically relevant
- later evidence
- current bounded interpretation
- unresolved dimensions

Formal August A5/A6 remains open until the natural monthly lifecycle has actual evidence.
