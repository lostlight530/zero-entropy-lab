# Aegis Cortex Evidence Policy

Status: independent post-hoc interpretation policy

This file documents how maintainers interpret committed A1–A6 artifacts. It is not a Jules prompt, repository memory entry, scheduler rule, CI gate, GitHub Action, Ballast control rule, or host-repository instruction.

## 1. Checker boundary

`aegis-cortex/check.py` verifies deterministic artifact contracts such as sections, date/week identity, A1→A2 and A3→A4 handoffs, decision/action IDs, and repository-boundary markers.

It intentionally does **not** determine whether an external reliability/security claim is true.

Therefore:

- checker pass != local incident absence
- checker pass != tool-effect success
- checker pass != immunity from memory/context poisoning
- checker pass != universal reliability

## 2. Reliability evidence classes

Keep these independent:

- `EXTERNAL_RISK_CLASS`
- `EXTERNAL_FAILURE_REPORT`
- `LOCAL_REPOSITORY_INCIDENT`
- `LOCAL_STRUCTURAL_CONTRACT_RESULT`
- `LOCAL_RUNTIME_OUTCOME`
- `UNRESOLVED`

A repeated external failure mode can justify continued observation without becoming local incident evidence or a universal failure-rate estimate.

## 3. Completion semantics

A success return, file existence, generated text, or checker pass cannot independently prove intended effect completion.

Where task semantics require consequential effects, stronger evidence may include:

- expected content/postcondition verification
- authoritative target-state readback
- effect identity / operation identity
- revision/freshness boundary
- prior-effect reconciliation after unknown outcomes

Aegis itself remains a Markdown research stream and does not claim to implement those runtime controls.

## 4. Historical delivery states

Keep generation, delivery, snapshot visibility, and execution status separate.

Recommended states:

- `AVAILABLE_AT_WEEKLY_SNAPSHOT`
- `LATE_AVAILABLE_AFTER_WEEKLY_SNAPSHOT`
- `BLOCKED_AT_EXECUTION`
- `GENERATED_BUT_NOT_MERGED`
- `UNRESOLVED_DELIVERY_HISTORY`

Do not fabricate a Daily run to make a date matrix visually complete.

## 5. Memory/context claims

OWASP and other primary/technical sources support memory/context poisoning as a real external risk class for agentic systems. That does not establish a local Aegis incident.

Conversely, constrained Markdown scope does not prove that memory/context poisoning is impossible. Any trusted carry-forward context can become an evidence problem if its provenance, authority, freshness, or interpretation is wrong.

## 6. W34 calibration rule

Repeated discussion of false completion across multiple Daily reports is a longitudinal research signal, not independent incident frequency.

Use:

`REPEATED_EXTERNAL_RISK_SIGNAL / NO_LOCAL_INCIDENT_EVIDENCE`

rather than phrases such as `extremely likely` unless a defined population, denominator, and locally relevant measurement support that probability claim.

`check.py` should be described as a structural contract validator, not as proof that false completion is suppressed at the control-plane or runtime level.

## 7. GPT/Ballast quality transfer

Ballast remains a separate GPT-maintained research stream, but its current method provides useful reviewer-side reliability distinctions:

- task permission versus prior-effect evidence
- transport success versus authoritative side effect
- historical receipt versus current completion state
- timeout/cancel versus proof of effect absence
- current revision/freshness versus stale positive reads
- facts, inference, and unverified evidence as separate states

These distinctions may improve Aegis **interpretation** without changing Aegis automation, prompts, or host runtime.

## 8. External 2026 evaluation references

Anthropic's 2026 agent-evaluation guidance distinguishes transcript/trajectory from final outcome and recommends end-state verification where appropriate. OpenAI Agents SDK tracing similarly treats a trace as a hierarchy of operation spans rather than as proof of successful task outcome.

These are `REFERENCE_ONLY` evidence models, not dependencies or local implementations.

## 9. Boundary

No host code, frontend, Jules prompt/memory/cadence, Ballast/GPT control, Actions, CI, deployment, runtime, or production gate is changed by this policy.
