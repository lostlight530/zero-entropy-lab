# A2 Daily Doctrine Orient — 2026-11-20 / exact 1008 recovery gate and session-continuity evidence

## CORTEX_RUN_HEADER
Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A2
Canonical Identity: zero/aegis/A2
Cadence: Daily
Loop Stage: Orient
Logical Date: 2026-11-20
Logical Timezone: Asia/Shanghai
Agent: GPT-6 / GPT_NATIVE / HUMAN_REQUESTED / NOT_JULES_REPLAY
Record Provenance: HUMAN_AUTHORIZED_SUBSTITUTE
Base Main SHA: b0bf53ea2a0515ff320e151882d00df0a9f2e854
Run Identity: zero-entropy-lab/aegis/A2/2026-11-20/GPT_NATIVE/b0bf53e/reconnect-counterchecks-01
Evidence Class: EXTERNAL_RISK / RESUMPTION_RETRY_CLASSIFICATION
Source Identity: google/adk-python PR #8260 head eda6c12f8cdf3bb617b8dc7175b5eacf8390da97
Source Authority For Claim: FIRST_PARTY_UNMERGED_PATCH_AND_AUTHORED_TESTS / SAME_ISSUER_AS_A1
Independent Verification: MERGED_A1_PR_903_AND_EXACT_MAIN_BLOB_READBACK / NO_RUNTIME_REPRODUCTION
Local Incident Evidence: NOT_ESTABLISHED
Local Evidence: UNKNOWN
Existing Defense: UNKNOWN_FOR_ZERO
Measured Effectiveness: NOT_COMPUTED
Host Applicability: UNKNOWN
Original Execution Status: SOURCE_ORIENTATION_ONLY / NATIVE_TESTS_NOT_EXECUTED
Current Path Status: DRAFT_PROPOSED_AT_AUTHORING / MERGE_NOT_OBSERVED
Task Status: BOUNDED_RISK_ORIENTATION / NO_LOCAL_DOCTRINE_PROMOTION
Write Scope: aegis-cortex/2026-11-20-A2-doctrine-orient.md
Host Kernel Modification: NO
Boundary Violation: NO

## INPUT_RECORD
- Same-date original A1 https://github.com/lostlight530/zero-entropy-lab/pull/903 actually merged, merge SHA `b0bf53ea2a0515ff320e151882d00df0a9f2e854`, not an anticipated Draft state.
- Fresh `main` reread at merge SHA, A1 canonical blob `4d8cb67814224ff7f48d82c962163e42b7778bf2` retained at `aegis-cortex/2026-11-20-A1-reliability-observe.md`.
- Source PR #8260 was OPEN at original inspection. An upstream source proposal remains unmerged until separate exact status verification; neither authored fixtures nor changed source is proof of a released SDK.
- Aegis evidence policy owns external risk versus local incident/defense/effectiveness classification. Ballast and Zero kernel are independent scopes; no same-date Ballast merge establishes this risk.
- Original issue #8258, code diff and unit fixtures are one Google ADK publishing lineage, not multiple independent reproducible incidents.

## RISK_CLASSIFICATION
External Risk: LIVE_RESUMPTION_WITH_OLD_CONNECTION_STILL_HELD
Precondition: resumption handle exists and server reports specific APIError 1008 reason `already connected to an existing client`; repeated no-delay retries can collide with stale ownership.
Patch-level proposed mitigation: only matching reason and resumption context treated recoverably; all unrelated 1008 must propagate. Bounded exponential backoff aims to reduce repeated contention.
A connection opened successfully is not evidence that an event stream has resumed or lost state has been reconciled.
First delivered event is a stronger progress landmark than a socket-open receipt but not necessarily proof of end-to-end tool effect completion.
A canceled/closed client must terminate even if a backoff wait is pending; cancellation cannot be reclassified as a transient restartable connection error.
Risk classification: EXTERNAL_RISK.
Local Incident: NOT_ESTABLISHED; no Zero live stream, host dependency or provider-side session trace measured.
Existing Defense: UNKNOWN_FOR_ZERO, not NONE.
Measured Effectiveness: NOT_COMPUTED, not an estimated percentage.
Release and current main upstream implementation: NOT_VERIFIED beyond cited source head.

## ORIENTATION_NOTES
- Positive P1 (NOT_EXECUTED): inject 1008 matching reason *after* obtaining resumption handle, then assert bounded retry and delivered first event on the exact same server session.
- Negative N1 (NOT_EXECUTED): 1008 with unrelated policy violation text must fail; retrying all 1008 could hide permission/validation errors.
- Negative N2 (NOT_EXECUTED): matching 1008 without handle must fail, since there is no owned session to resume.
- Negative N3 (NOT_EXECUTED): new socket open followed by immediate error and zero events must not reset retry budget.
- Negative N4 (NOT_EXECUTED): malicious or simply changed error text/serialization may spoof or defeat a reason substring match; test with pinned google-genai versions and strict error codes.
- Negative N5 (NOT_EXECUTED): cancellation during backoff must halt all future attempts without continuing background side-effectful tool tasks.
- Negative N6 (NOT_EXECUTED): reconnect, first event, state readback and committed effect all require independent receipts, and no provider acknowledgement may be assumed equal to completion.
- Pair normal successful live request, disconnected but non-resumable session, and server refusing duplicate ownership controls.
- Proposed trace: `(source_sha, sdk_version, session_id, resumption_handle_digest, previous_connection_id, attempt_no, error_code, reason, backoff_ms, first_event_id, state_revision, cancellation_state, sink_effect_receipt)`.
- Distinguish retry safety from eventual liveness: bounded retries may still fail and retain `OUTCOME_UNKNOWN`; infinite retries can duplicate side effects.
- The original PR's test text is evidence of intended behavior only, not an independent replay or production effectiveness.

## NO_DECISION_SECTION
Decision: NO_DECISION
Doctrine Promotion: NO
Local Incident Verdict: NOT_ESTABLISHED
Existing Defense Verdict: UNKNOWN_FOR_ZERO
Measured Safety Improvement: NOT_COMPUTED
Host Kernel Action: NONE
Decision Basis: one unmerged first-party source patch, no independently measured runtime, unknown dependency and no effect sink observations.

## EVIDENCE_DELTA
- NEW_EVIDENCE: actual merged A1 main/blob provenance, separation of retry classifier, event receipt, cancellation and effect completion.
- CORRECTED_INTERPRETATION: first event is a scoped session-progress marker, not proof of full recovery or completion; retryability depends on exact error context.
- UNCHANGED_BOUNDARY: EXTERNAL_RISK != LOCAL_INCIDENT != EXISTING_DEFENSE != MEASURED_EFFECTIVENESS.
- NEW_COUNTEREVIDENCE: unrelated 1008, absent handle, serializer drift, canceled client and no-event reconnection constrain a blanket retry rule.
- UNKNOWN_RETAINED: final upstream PR status, pinned SDK deployed by Zero, live session outcome, actual state continuity, measured effect and host incidents.
- NEXT_RETEST_CONDITION: pin upstream before/after revisions and google-genai error representation; inject negative controls and capture authoritative session/state/effect receipts.

## NEXT_HANDOFF
- Independent monthly maintenance A1/A2 and periodic audit remain separate from Native A2.
- W47 A3/A4 NOT_DUE, November A5/A6 NOT_DUE.
- No Ballast, Zero Kernel, previous producer, Aegis Memory, independent audit or host implementation modified.

## BOUNDARY_CHECK
- Inspected exact merged A1 source and dependency identity via main readback.
- Upstream unit tests, live reconnect reproducer, Aegis structural checker, local host runner and effect oracle NOT_EXECUTED.
- This is one original H2-like dependency-gated Aegis A2, not maintenance A2; no human review, CI PASS or merge inferred before GitHub receipt.
