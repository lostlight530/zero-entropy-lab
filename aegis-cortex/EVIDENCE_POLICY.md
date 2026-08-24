# Aegis Cortex Evidence Policy

Status: independent post-hoc interpretation policy
Maintenance calibration: 2026-08-24

This file documents how maintainers interpret committed A1–A6 artifacts. It is not a Jules prompt, repository memory entry, scheduler rule, CI gate, GitHub Action, Ballast control rule, or host-repository instruction.

## 1. Checker boundary

`aegis-cortex/check.py` verifies deterministic artifact contracts such as sections, date/week identity, A1→A2 and A3→A4 handoffs, decision/action IDs, evidence-state fields, and repository-boundary markers.

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

## 2. Reliability evidence classes

Keep these independent:

- `EXTERNAL_RISK_CLASS`
- `EXTERNAL_FAILURE_REPORT`
- `LOCAL_PREVENTIVE_RECORD`
- `LOCAL_ARCHITECTURE_RECORD`
- `LOCAL_REPOSITORY_INCIDENT`
- `LOCAL_STRUCTURAL_CONTRACT_RESULT`
- `LOCAL_RUNTIME_OUTCOME`
- `AUTHORITATIVE_EXTERNAL_EFFECT`
- `UNRESOLVED`

A prior A4/A6 document discussing a risk is `LOCAL_PREVENTIVE_RECORD`, not proof that the incident happened locally.

A repository design resembling an external pattern is `LOCAL_ARCHITECTURE_RECORD`, not a local failure/incident observation.

Use:

`LOCAL_PREVENTIVE_RECORD != LOCAL_INCIDENT_EVIDENCE`

and:

`LOCAL_ARCHITECTURE_RECORD != LOCAL_INCIDENT_EVIDENCE`.

A repeated external failure mode can justify continued observation without becoming local incident evidence or a universal failure-rate estimate.

## 3. Source authority is claim-specific

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
- a Palo Alto or Auth0 article discussing an OWASP category remains secondary analysis of the OWASP standard; exact OWASP category semantics should prefer the OWASP primary source
- an original paper can establish its own bounded experiment/result, not a universal local failure probability

Use:

`VENDOR_PROTOCOL_INTERPRETATION != PRIMARY_PROTOCOL_SEMANTICS`

and:

`SECONDARY_STANDARD_ANALYSIS != PRIMARY_STANDARD`.

## 4. Source independence and repetition

Repeated URLs, repeated metrics, multiple pages from the same publisher, or Daily→Weekly restatement do not automatically create independent corroboration.

Rules:

- multiple AgentStatus pages are not multiple independent publishers
- the same Openlayer `3–15%` figure repeated on multiple dates remains one source lineage
- A2 repeating A1 does not create a second independent observation
- A3/A4 synthesis does not strengthen a weak upstream source merely by repeating it
- repeated memory-poisoning themes should be de-duplicated by source lineage and proposition

Use:

`SAME_SOURCE_OR_PUBLISHER_REPETITION / NOT_INDEPENDENT_CORROBORATION`.

## 5. Temporal provenance and causality

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

## 6. Completion semantics

A success return, file existence, generated text, or checker pass cannot independently prove intended effect completion.

Where task semantics require consequential effects, stronger evidence may include:

- expected content/postcondition verification
- authoritative target-state readback
- effect identity / operation identity
- revision/freshness boundary
- prior-effect reconciliation after unknown outcomes

Keep these surfaces distinct:

- status/return evidence
- artifact-structure evidence
- expected-content evidence
- semantic/claim evidence
- authoritative external-effect evidence

Aegis itself remains a Markdown research stream and does not claim to implement those runtime controls.

## 7. Historical delivery states

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

## 8. Memory/context claims

OWASP and original research support memory/context poisoning as a real external risk class for agentic systems. That does not establish a local Aegis incident.

Conversely, constrained Markdown scope does not prove that memory/context poisoning is impossible. Any trusted carry-forward context can become an evidence problem if its provenance, authority, freshness, or interpretation is wrong.

A historical A-file that merely discussed memory poisoning does not count as local poisoning evidence.

Use:

`EXTERNAL_RISK_SUPPORTED / LOCAL_INCIDENT_NOT_ESTABLISHED`.

## 9. Benchmark and cross-domain generalization

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

Avoid `always`, `inevitable`, `extremely likely`, or equivalent probability wording without a defined population, denominator, and applicable measurement.

## 10. W31–W34 calibration rule

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

`check.py` should be described as a structural contract validator, not as proof that false completion is suppressed at the control-plane or runtime level.

A W34 instruction such as “prefer current task prompt over historical detail” is a control-hierarchy rule only where the actual authorized task/control contract establishes that precedence. It is not evidence that the current prompt is factually correct, fresh, or semantically superior to all historical evidence.

Use:

`CONTROL_PRECEDENCE != EVIDENCE_TRUTH_PRECEDENCE`.

## 11. Self-correction and independent feedback

External research can support the proposition that intrinsic self-correction without new evidence/feedback may fail or degrade.

For Aegis:

- `check.py` adds an independent **structural constraint**
- retained source re-fetching or authoritative readback can add independent evidence for the specific thing checked
- another LLM pass over the same information boundary is not automatically independent verification
- a historical statement that “Python tests” or a “plan validation” exists does not count as test evidence unless the specific command/environment/result is retained

Use:

`STRUCTURAL_EXTERNAL_CONSTRAINT / SEMANTIC_INDEPENDENCE_NOT_ESTABLISHED`.

## 12. GPT/Ballast quality transfer

Ballast remains a separate GPT-maintained research stream, but its current method provides useful reviewer-side reliability distinctions:

- task permission versus prior-effect evidence
- transport success versus authoritative side effect
- historical receipt versus current completion state
- timeout/cancel versus proof of effect absence
- current revision/freshness versus stale positive reads
- facts, inference, and unverified evidence as separate states

These distinctions may improve Aegis **interpretation** without changing Aegis automation, prompts, or host runtime.

A reviewer-side policy or Ballast method does not prove Jules consumed or enforced it during generation.

## 13. External 2026 evaluation references

Anthropic's 2026 agent-evaluation guidance distinguishes transcript/trajectory from final outcome and recommends end-state verification where appropriate. OpenAI Agents SDK tracing similarly treats a trace as a hierarchy of operation spans rather than as proof of successful task outcome.

These are `REFERENCE_ONLY` evidence models, not dependencies or local implementations.

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

No host code, frontend, Jules prompt/memory/cadence, Ballast/GPT control, Actions, CI, deployment, runtime, production gate, dependency, or scheduler is changed by this policy.

Tests not run — documentation/evidence only.
