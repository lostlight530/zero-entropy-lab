# A2 Daily Doctrine Orient — 2026-11-18 / mixed UTC offsets and local risk non-promotion

## CORTEX_RUN_HEADER
Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A2
Canonical Identity: zero/aegis/A2
Cadence: Daily
Loop Stage: Orient
Logical Date: 2026-11-18
Logical Timezone: Asia/Shanghai
Agent: GPT-6 / GPT_NATIVE / HUMAN_REQUESTED / NOT_JULES_REPLAY
Record Provenance: HUMAN_AUTHORIZED_SUBSTITUTE
Base Main SHA: c126b97c625b137fb557088d9607e9b48f64a95c
Run Identity: zero-entropy-lab/aegis/A2/2026-11-18/GPT_NATIVE/c126b97c625b137fb557088d9607e9b48f64a95c/mixed-offset-time-order-retest-01
Evidence Class: EXTERNAL_RISK_CLASS / TIMESTAMP_NORMALIZATION_AND_MEMORY_SELECTION
Source Identity: openai/openai-agents-python@e7ce15a25b336bb3d0840ad16dee597f69a6e6d3
Source Authority For Claim: VERSIONED_FIRST_PARTY_IMPLEMENTATION_AND_AUTHOR_TEST_TEXT / SAME_UPSTREAM_ISSUER_AS_A1
Independent Verification: SAME_DAY_MERGED_A1_MAIN_BLOB_READBACK / SOURCE_PATCH_CONDITION_REVIEW / SDK_TESTS_NOT_EXECUTED
Local Incident Evidence: NOT_ESTABLISHED / NO_ZERO_LOCAL_MEMORY_SELECTION_RUNTIME_OR_FAILURE_RECEIPT
Local Evidence: UNKNOWN / NO_ZERO_DEPENDENCY_INSTALLATION_OR_ACTUAL_PERSISTENT_MEMORY_READBACK
Existing Defense: UNKNOWN_FOR_ZERO
Measured Effectiveness: NOT_COMPUTED
Host Applicability: UNKNOWN / CURRENT_ZERO_MEMORY_SELECTION_BACKEND_NOT_VERIFIED
Original Execution Status: BOUNDED_GPT_NATIVE_SOURCE_ORIENTATION / LOCAL_RUNTIME_NOT_EXECUTED
Current Path Status: PROPOSED_DRAFT_PR / NOT_MERGED_AT_AUTHORING
Task Status: EXTERNAL_RISK_ORIENTATION / LOCAL_INCIDENT_NOT_ESTABLISHED / NO_DOCTRINE_PROMOTION
Write Scope: aegis-cortex/2026-11-18-A2-doctrine-orient.md
Host Kernel Modification: NO
Boundary Violation: NO

## INPUT_RECORD
- Exact same-day Native A1 `aegis-cortex/2026-11-18-A1-reliability-observe.md` is merged through [PR #892](https://github.com/lostlight530/zero-entropy-lab/pull/892).
- Fresh after-merge `main` SHA `c126b97c625b137fb557088d9607e9b48f64a95c`; A1 retained Git blob `ab7809287aada5ba35f08f25e5a3c4bb56ac71b2`.
- Handoff dependency actually satisfied by merged main and exact blob reread, not inherited from a draft, PR title, historical Jules task or 2026-11-17 A1.
- The source is first-party [openai/openai-agents-python@e7ce15a25](https://github.com/openai/openai-agents-python/commit/e7ce15a25b336bb3d0840ad16dee597f69a6e6d3); inspected `src/agents/sandbox/memory/storage.py` and `tests/sandbox/test_memory.py` patch.
- Upstream commit timestamp `2026-11-18T00:49:23Z` = `08:49:23+08:00`. This is a source event, separate from Zero logical date, this A2 execution and eventual merge.
- A1 and A2 share ONE upstream publisher and fix revision. Revisiting code does NOT produce an independent source or a measured Zero defense.
- Read Aegis `EVIDENCE_POLICY.md`, `check.py` required schema, closed 2026-W46 A3/A4 and previous-day A2. No new Zero deployed SDK dependency, local memory fixture or effect sink was executed.

## RISK_CLASSIFICATION
External Risk: CONDITIONAL_INCORRECT_MEMORY_SELECTION_ORDER_WHEN_UPDATED_AT_HAS_MIXED_UTC_OFFSETS
Source-supported mechanism: original `_updated_at_sort_key` returned raw `updated_at` strings. Two timestamps can sort lexically in one order and chronologically in a different order when clock offsets differ.
Patch mechanism: attempt a versioned ISO-like timestamp match; normalize recognized offsets to UTC and preserve arbitrary fractional digits lexically after normalized seconds; for unsupported/invalid parse paths, return raw timestamp.
Concrete positive fixture from author test: `2026-11-17T03:30:00+00:00` is earlier than `2026-11-16T23:30:00-05:00` as a UTC instant; lexical calendar-day sorting would reverse that relation.
Fault propagation hypothesis: incorrect temporal order can affect which rollout/memory candidate is preferred by a phase-two selection process; this does not establish wrong answer text, privilege grant, deletion or local corruption.
Preconditions: affected previous SDK revision, selector uses `updated_at`, timestamp strings include differing offsets, and its output actually influences a user-visible downstream selection.
Local Incident: NOT_ESTABLISHED; no actual Zero record pair, installed package, failed reconciliation or source-to-sink causal chain observed.
Existing Defense: UNKNOWN_FOR_ZERO; upstream change does not prove Zero runs a patched SDK, nor that Zero has this selector at all.
Measured Effectiveness: NOT_COMPUTED; author-added test source is not an executed before/after benchmark here.
Evidence source type: FIRST_PARTY_PINNED_SOURCE / NOT_DEPLOYED_LOCAL_EVIDENCE
Counterevidence Gate: FAILED_FOR_LOCAL_PROMOTION / PASS_FOR_BOUNDED_EXTERNAL_CODE_PATH_ONLY

## ORIENTATION_NOTES
- Positive control P1: pin SDK parent and patch revisions; create named record IDs with the two mixed-offset timestamps; compare selected IDs to a trusted UTC-normalized oracle, retain the original strings and parser branch.
- Positive control P2: compare nanosecond timestamps that differ only beyond Python microseconds. The patch retains fractional digits separate from `datetime`; this is a source claim until the test is run.
- Negative control N1: normalized `Z` and `+00:00` timestamps must preserve order. Agreement on UTC-only cases is insufficient to establish cross-offset correctness.
- Negative control N2: malformed `updated_at`, `unknown`, a missing field and an unsupported timezone string are not automatically chronological data; fallback lexical key is not independent time verification.
- Negative control N3: equal real UTC instants with different textual zones require explicit tie policy; the patch alone does not establish stable event causality or preferred memory identity.
- Negative control N4: a timestamp with misleading content, clock skew, malicious metadata or an untrusted source remains untrustworthy after normalization. Correct ordering is not provenance authentication.
- Negative control N5: if a deployment never runs this memory selector or stores only canonical UTC, this external risk might be inapplicable locally. Do not count it as a Zero defect.
- Negative control N6: if a later retrieval includes a wrongly ranked candidate but downstream independently validates the claim against raw evidence, a temporal ordering bug need not create a wrong final answer. Need exact failure outcome, not implied harm.
- A reproducible measurement needs immutable raw timestamps, record IDs, expected UTC instants, selector versions, output order, response IDs, persisted storage snapshots, and complete stdout/stderr/exit.
- Risk of correction side effects: parser formats, timezone normalization and fractional behavior can themselves regress on unexpected input. Record the source version and format grammar, not generic `ISO_TIMESTAMP_SUPPORTED` claims.
- State continuity: `updated_at` sorting is not the same as append-log causal order; event-time ordering cannot prove session or store identity across restarts.
- Authorization: a memory candidate's recency or presence cannot import permissions, trust role, approval or action execution receipts. This is a separate Security/Trust plane.
- No original Jules Aegis failure, Host Kernel defense, Ballast Action Integrity claim, cross-repo shared source or token-cost model is silently altered by this orientation.

## NO_DECISION_SECTION
Decision: NO_DECISION
Doctrine Promotion: NO / REQUIRES_LOCAL_APPLICABILITY_AND_MEASURED_EFFECTIVENESS
Local Incident Verdict: NOT_ESTABLISHED
Existing Local Defense Verdict: UNKNOWN_FOR_ZERO
Measured Safety Improvement: NOT_COMPUTED
Host Kernel Action: NONE / NO_CHANGE
Follow-up: revision-pinned memory selection replay with malformed/normal UTC controls and, separately, a verified Zero dependency plus actual source/store readback.
Counterevidence remains active: invalid metadata, tie semantics, normalized but unauthenticated timestamps, absence of affected selector.

## EVIDENCE_DELTA
- NEW_EVIDENCE: fresh merged A1 readback and targeted review of normalized UTC, fractional precision and fallback branch contract.
- CORRECTED_INTERPRETATION: temporal key ordering is an evidence selection function, not authentic causal history, source truth or a measured local memory defect.
- UNCHANGED_BOUNDARY: EXTERNAL_RISK != LOCAL_INCIDENT != EXISTING_DEFENSE != MEASURED_EFFECTIVENESS; shared A1/A2 upstream patch is one lineage.
- NEW_COUNTEREVIDENCE: malformed/unsupported timestamps, equal real instants, benign canonical-UTC deployments and independent source checking limit broad harm claims.
- UNKNOWN_RETAINED: local installed revision, actual sort results, cross-run persisted IDs, memory selection effect on a real user answer, tests and defense effectiveness.
- NEXT_RETEST_CONDITION: execute both exact SDK revisions against positive and negative fixtures with source/store/version IDs, stdout/stderr/exit and independently expected UTC order.

## NEXT_HANDOFF
- A1 and A2 are prospective Native Daily, NOT Independent A1/A2 monthly historical maintenance.
- W46 A3/A4 already closed and main-retained; 2026-11-18 belongs to open W47 and cannot be retrospectively inserted into W46 decisions.
- November A5/A6 NOT_DUE until full natural-month closure. No Aegis long-term doctrine, memory promotion or Host Kernel change follows from this source-only research.

## BOUNDARY_CHECK
- Executed: exact A1 original merged PR/main/blob custody and pinned upstream code/authored-test read, current Aegis semantic policy and checker fields inspection.
- NOT_EXECUTED: Aegis full checker, SDK pytest, Zero runtime, local memory selector, persisted store, external effect sink or a real timestamp corruption incident.
- Only new same-date Native A2 file, no rewrite of A1 blob, Jules history, kernel, Ballast, governance, independent maintenance or periodic audit.
- Human-authorized merge is delivery only and cannot upgrade the unexecuted experimental states.
