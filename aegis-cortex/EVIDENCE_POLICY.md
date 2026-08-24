# Aegis Cortex Evidence Policy

Status: independent post-hoc interpretation policy
Maintenance calibration: 2026-08-24

This file documents how committed A1–A6 artifacts are interpreted against the repository that actually exists. It is descriptive repository research, not an instruction surface for artifact producers or the host runtime.

## 1. Repository architecture grounding

Zero-Entropy Lab has a concrete implementation topology under `src/kernel/` and `data/`. Aegis is a separate research/evidence surface and must not be treated as if it were the runtime itself.

### Kernel topology

The current runtime is divided into explicit modules:

- `src/kernel/memory/` — SQLite-backed graph/memory state and linked JSONL persistence
- `src/kernel/sensory/` — harvesting, document hygiene, report hygiene, and repository/source structure extraction
- `src/kernel/cognitive/` — pure-Python retrieval/reranking and graph-derived reasoning utilities
- `src/kernel/orchestration/` — local evolution/lifecycle orchestration
- `src/kernel/protocol/` — local command/server/protocol experiments and transition declarations
- `data/inputs/` — external/source inputs and archive material
- `data/knowledge/` — graph/ledger knowledge records
- `data/memories/` — generated memory/report artifacts
- `index.html` — independent presentation surface

These domains are related by repository code but are not interchangeable evidence classes.

### Memory and ledger boundary

`src/kernel/memory/cortex.py` uses SQLite as the local query/state store and writes canonical linked JSONL records for knowledge persistence.

The implementation exposes several distinct integrity surfaces:

- SQLite row/state presence
- FTS5 retrieval state
- linked JSONL `prev_hash` / `hash` continuity
- HMAC record signatures
- application-level journal/state records

These prove only the properties actually checked.

In particular:

- a hash chain is a content/linkage integrity mechanism, not proof of source truth or authorship
- an HMAC row signature is a consistency/authenticity check relative to the configured key, not an external authorization or identity proof
- the presence of a fallback local key means the signature mechanism must not be described as a hardened secret-management boundary
- SQLite presence does not prove an external effect occurred
- successful retrieval does not prove semantic correctness

Use:

`LOCAL_STORAGE_INTEGRITY_SIGNAL / EXTERNAL_TRUTH_NOT_ESTABLISHED`.

### Retrieval and reasoning boundary

`src/kernel/memory/cortex.py` performs FTS5 candidate retrieval and graph expansion, then `src/kernel/cognitive/nlp.py` can rerank the candidates. `src/kernel/cognitive/reason.py` computes local structural/reasoning outputs over repository state.

Those operations are deterministic/pure-Python repository mechanisms where implemented. They are not a foundation-model inference service and do not make a retrieved proposition true.

Use:

`LOCAL_RETRIEVAL_OR_GRAPH_SIGNAL / CLAIM_TRUTH_NOT_ESTABLISHED`.

### Sensory boundary

`src/kernel/sensory/harvester.py`, `document_hygiene.py`, `report_hygiene*.py`, and `scholar.py` handle source acquisition, normalization/hygiene, and structural extraction.

A source becoming locally available or structurally admissible does not establish:

- primary-source authority
- semantic correctness
- local incident occurrence
- local runtime impact

### Protocol and declaration boundary

`src/kernel/protocol/transition_contract.py` defines a canonical `TransitionDeclaration` containing actor, current state, intent, preconditions, effects, evidence, and rollback information. It validates and fingerprints the declaration but intentionally has **no execution side effects**.

Therefore:

`VALID_TRANSITION_DECLARATION != TRANSITION_EXECUTED`.

Likewise, `mcp.py`, `nexus_mcp.py`, `hive.py`, and `nexus.py` are repository-local protocol/command experiments. Their existence does not establish universal MCP semantics, external interoperability, or production deployment.

### Aegis and Ballast separation

`aegis-cortex/` and `ballast/` are separate research/evidence surfaces. Neither directory automatically governs `src/kernel/**`, `data/**`, or the presentation layer.

This policy does not publish or encode private maintenance reasoning, hidden prompts, future automation strategy, or unpublished control logic.

## 2. Checker boundary

`aegis-cortex/check.py` verifies artifact contracts such as sections, date/week identity, A1→A2 and A3→A4 handoffs, decision/action IDs, evidence-state fields, and repository-boundary markers.

It intentionally does **not** determine whether an external reliability/security claim is true, whether a semantic conclusion is correct, or whether an external side effect occurred.

Therefore:

- checker pass != local incident absence
- checker pass != semantic correctness
- checker pass != external claim truth
- checker pass != tool-effect success
- checker pass != task-outcome correctness
- checker pass != immunity from memory/context poisoning
- checker pass != universal reliability

A reference to `check.py` is structural evidence only unless a separate retained result establishes a stronger claim.

## 3. Reliability evidence classes

Keep these independent:

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

A prior A4/A6 document discussing a risk is `LOCAL_PREVENTIVE_RECORD`, not proof that the incident happened locally.

A repository design resembling an external pattern is `LOCAL_ARCHITECTURE_RECORD`, not a local failure/incident observation.

Use:

`LOCAL_PREVENTIVE_RECORD != LOCAL_INCIDENT_EVIDENCE`

and:

`LOCAL_ARCHITECTURE_RECORD != LOCAL_INCIDENT_EVIDENCE`.

## 4. Source authority is claim-specific

Keep source reachability, identity, authority, and claim support separate:

- `SOURCE_ACCESS_VERIFIED`
- `SOURCE_IDENTITY_VERIFIED`
- `PRIMARY_SOURCE_FOR_CLAIM`
- `SECONDARY_SOURCE`
- `VENDOR_INTERPRETATION`
- `CLAIM_SUPPORTED`
- `SOURCE_CLASS_INSUFFICIENT_FOR_CLAIM`

Directly opening a vendor or secondary article does not turn it into a primary source.

Examples:

- an official protocol specification can establish normative protocol semantics
- a gateway/vendor article can describe its MCP authorization interpretation or deployment practice, but is not the MCP specification
- a Palo Alto or Auth0 article discussing an OWASP category remains secondary analysis; exact standard/category semantics should prefer the primary source
- an original paper can establish its own bounded experiment/result, not a universal local failure probability

Use:

`VENDOR_PROTOCOL_INTERPRETATION != PRIMARY_PROTOCOL_SEMANTICS`

and:

`SECONDARY_STANDARD_ANALYSIS != PRIMARY_STANDARD`.

## 5. Source independence and repetition

Repeated URLs, repeated metrics, multiple pages from the same publisher, or Daily→Weekly restatement do not automatically create independent corroboration.

Rules:

- multiple AgentStatus pages are not multiple independent publishers
- the same Openlayer `3–15%` figure repeated on multiple dates remains one source lineage
- A2 repeating A1 does not create a second independent observation
- A3/A4 synthesis does not strengthen a weak upstream source merely by repeating it
- repeated memory-poisoning themes should be de-duplicated by source lineage and proposition

Use:

`SAME_SOURCE_OR_PUBLISHER_REPETITION / NOT_INDEPENDENT_CORROBORATION`.

## 6. Temporal provenance and causality

An observation cannot be treated as validly checked before the cited source/version/event existed according to the timestamps recorded in the artifact.

Recommended states:

- `TEMPORAL_ORDER_VALID`
- `TEMPORAL_PROVENANCE_CONFLICT`
- `TIMESTAMP_PRECISION_INSUFFICIENT`
- `SOURCE_EVENT_TIME_UNVERIFIED`

Reference case:

- 2026-08-03 A1 records a Future AGI item with `Published or Updated Date: 2026-08-04` while `Date Checked: 2026-08-03`
- 2026-08-03 A2 then treats that item as retrieved/verified

Current interpretation:

`TEMPORAL_PROVENANCE_CONFLICT`.

Do not silently rewrite the historical Daily files. Do not use the conflicting item as same-day verified evidence unless stronger timestamp/version evidence resolves the chronology.

## 7. Completion semantics

A success return, file existence, generated text, declaration fingerprint, ledger hash, signature result, or checker pass cannot independently prove intended effect completion.

Where task semantics require consequential effects, keep these surfaces distinct:

- status/return evidence
- artifact-structure evidence
- storage-integrity evidence
- expected-content evidence
- semantic/claim evidence
- authoritative external-effect evidence

`TransitionDeclaration.fingerprint()` proves stable identity of the canonical declaration bytes. It does not prove the declared transition occurred.

Aegis itself remains a Markdown research stream and does not claim to implement external effect verification.

## 8. Historical delivery states

Keep generation, delivery, snapshot visibility, current path presence, and execution status separate.

Recommended states:

- `AVAILABLE_AT_WEEKLY_SNAPSHOT`
- `LATE_AVAILABLE_AFTER_WEEKLY_SNAPSHOT`
- `BLOCKED_AT_EXECUTION`
- `GENERATED_BUT_NOT_MERGED`
- `CURRENT_PATH_PRESENT`
- `CURRENT_PATH_ABSENT_AT_AUDIT`
- `UNRESOLVED_DELIVERY_HISTORY`

Do not fabricate a Daily run to make a date matrix visually complete.

A later upstream file can repair current delivery visibility without retroactively turning a downstream historical `BLOCKED_AT_EXECUTION` into success.

For August:

- 2026-08-15 A1/A2 remain `UNRESOLVED_DELIVERY_HISTORY`
- 2026-08-16 A1 is currently present, while the retained A2 historical `INPUT_MISSING / BLOCKED` execution state remains valid
- 2026-08-24 A1/A2 are currently present and form a complete current Daily pair

## 9. Memory/context claims

Memory/context poisoning is a supported external agentic risk class. That does not establish a local Aegis incident.

Conversely, constrained Markdown scope, local hashing, signatures, or structural validation do not prove that poisoned or stale context is impossible. Any trusted carry-forward context can become an evidence problem if provenance, authority, freshness, or interpretation is wrong.

A historical A-file that merely discussed memory poisoning does not count as local poisoning evidence.

Use:

`EXTERNAL_RISK_SUPPORTED / LOCAL_INCIDENT_NOT_ESTABLISHED`.

## 10. Benchmark and cross-domain generalization

A bounded benchmark, model/harness study, vendor production statistic, or cross-domain agent study does not automatically establish Aegis-local probability or a universal law.

Examples:

- ClayBuddy failure rates are study/model/harness-specific
- Openlayer `3–15%` is vendor-reported production context and not an Aegis baseline
- navigation-state drift from vision-language navigation can be used as a cross-domain analogy, not direct proof of Aegis state drift
- PushBench/long-horizon false-completion results support an external failure class, not local frequency

Use:

- `BENCHMARK_SPECIFIC_RESULT`
- `VENDOR_EXTERNAL_RATE / LOCAL_RATE_NOT_ESTABLISHED`
- `CROSS_DOMAIN_ANALOGY / LOCAL_GENERALIZATION_NOT_ESTABLISHED`

Avoid probability language such as `always`, `inevitable`, or `extremely likely` without a defined population, denominator, and applicable measurement.

## 11. W31–W34 calibration rule

### W31

The W31 AgentStatus material contains multiple pages from the same publisher. It is useful external monitoring material but not multiple independent publisher confirmation.

Current interpretation:

`SAME_PUBLISHER_REPETITION / NO_LOCAL_INCIDENT_EVIDENCE`.

### W32

W32 is the maturity pivot for current-state reconciliation and source-lineage de-duplication.

Its 2026-08-06 dependency case is local delivery/scheduling evidence, not a host-code or security incident.

### W33

W33 correctly distinguishes execution-snapshot visibility from final delivery interpretation:

- 08-16 later available
- 08-15 unresolved
- external failure-rate material not a local baseline

### W34

Repeated discussion of false completion across multiple Daily reports is a longitudinal research signal, not independent incident frequency.

Use:

`REPEATED_EXTERNAL_RISK_SIGNAL / NO_LOCAL_INCIDENT_EVIDENCE`.

`check.py` is a structural contract validator, not proof that false completion is suppressed at the control-plane or runtime level.

A control-precedence statement is not evidence that newer text is factually superior to older evidence.

Use:

`CONTROL_PRECEDENCE != EVIDENCE_TRUTH_PRECEDENCE`.

## 12. Independent-feedback boundary

External research can support the proposition that self-correction without new evidence or feedback may fail or degrade.

For Aegis, a structurally independent check only establishes the structure it actually checks. Re-reading the same information through another reasoning pass is not automatically independent verification.

Use:

`STRUCTURAL_EXTERNAL_CONSTRAINT / SEMANTIC_INDEPENDENCE_NOT_ESTABLISHED`.

## 13. External evaluation references

Current external agent-evaluation/tracing guidance can be used as `REFERENCE_ONLY` vocabulary for separating trajectory/transcript, final outcome, grader result, and authoritative state.

Those references are not dependencies or local implementations.

## 14. Historical correction method

Prefer reconciliation over silent rewriting when later evidence changes interpretation.

A reconciliation should preserve:

- original execution state
- original source/claim wording where historically useful
- later evidence
- current bounded interpretation
- unresolved dimensions

Current interpretation may supersede an over-broad historical claim without erasing the fact that the claim was generated.

## 15. Boundary

This policy is documentation/evidence maintenance only. It changes no host code, public presentation behavior, kernel runtime behavior, dependency set, deployment state, or artifact-production configuration.
