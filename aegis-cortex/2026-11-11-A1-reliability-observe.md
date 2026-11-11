# A1 Daily Reliability Observe — 2026-11-11

## CORTEX_RUN_HEADER
Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A1
Canonical Identity: zero/aegis/A1
Cadence: Daily
Loop Stage: Observe
Logical Date: 2026-11-11
Logical Timezone: Asia/Shanghai
Execution Time UTC: 2026-11-11 / EXACT_TIME_NOT_CAPTURED
Execution Time Asia/Shanghai: 2026-11-11 / EXACT_TIME_NOT_CAPTURED
Agent: GPT-6 / GPT_NATIVE / NOT_JULES_REPLAY
Producer Identity: HUMAN_REQUESTED_GPT_NATIVE
Record Provenance: HUMAN_AUTHORIZED_SUBSTITUTE
Base Main SHA: bd04b656a1dd48f6522227f7c4216396f4c1ff76
Run Identity: zero-entropy-lab/aegis/A1/2026-11-11/GPT_NATIVE/bd04b656a1dd48f6522227f7c4216396f4c1ff76/adk-session-delete-invariant-01
Network Status: GITHUB_ORIGINAL_COMMIT_AND_PATCH_READ
Source Status: FIRST_PARTY_IMPLEMENTATION_AND_AUTHORED_TEST_SOURCE / EXECUTION_UNVERIFIED
Task Status: SUCCESS / BOUNDED_EXTERNAL_RISK_OBSERVATION
Source Identity: google/adk-python@c0bcdaa480a7547587fffd783f54bc408ae814a0
Source Authority For Claim: FIRST_PARTY_COMMITTED_CODE_AND_AUTHORED_REGRESSION_TEST
Independent Verification: SOURCE_DIFF_INSPECTED / TESTS_NOT_EXECUTED
Evidence Class: EXTERNAL_RISK_CLASS / SESSION_LIFECYCLE_AND_DIRECT_MAP_READ_INVARIANT
Local Incident Evidence: NO_LOCAL_INCIDENT_ATTESTED
Existing Zero Defense: UNKNOWN / NO_HOST_KERNEL_DEPENDENCY_TEST
Measured Effectiveness: NOT_COMPUTED
Host Applicability: UNKNOWN
Original Execution Status: GPT_NATIVE_2026-11-11 / NOT_JULES
Current Path Status: PROPOSED_BRANCH_ARTIFACT / MAIN_VISIBILITY_PENDING
Write Scope: aegis-cortex/2026-11-11-A1-reliability-observe.md
Boundary Violation: NO

## INPUT_RECORD
- The source-base for this new A1 record is merged main bd04b656a1dd48f6522227f7c4216396f4c1ff76. Current Aegis evidence policy, 2026-11-10 A1, 2026-W45 A4 and the 2026-10 A6 historical/current closure surface were inspected. No same-day A2 was read.
- Research focus: exact session deletion, stale direct collection access and valid current state after removing the last session; this is a distinct upstream patch from the 2026-11-10 connector-operation polling study.
- 2026-W46 is OPEN and November A5/A6 final are NOT_DUE. The Host Kernel, Ballast and NEXUS are different execution surfaces.
- No actual SDK experiment, session store operation or Zero-local kernel failure was observed in this production record.

## EXTERNAL_SOURCE_RECORDS
### SRC-20261111-A01 — ADK in-memory session map cleanup
Source ID: SRC-20261111-A01
Title: fix: clean up empty maps after deleting sessions
Publisher: google/adk-python
URL: https://github.com/google/adk-python/commit/c0bcdaa480a7547587fffd783f54bc408ae814a0
Related upstream PR: https://github.com/google/adk-python/pull/7724
Published or Updated Date: 2026-11-11T01:52:57Z (commit timestamp; NOT tagged SDK release)
Date Checked: 2026-11-11 Asia/Shanghai
Source Type: ORIGINAL_CODE_CHANGE_AND_AUTHORED_TEST_PATCH
Evidence Tier: PRIMARY_FOR_COMMITTED_SDK_BEHAVIOR_CHANGE / NO_RUNTIME_RECEIPT
Access Status: COMMIT_MESSAGE_AND_BOTH_CHANGED_FILE_PATCHES_READ
Independent Source: ONE_GOOGLE_ADK_COMMIT_LINEAGE / AUTHOR_FIXTURE_NOT_INDEPENDENT
Claim Supported: after deleting the last session for a user, InMemorySessionService now removes empty user and app entries from its sessions mapping, while retaining remaining sessions. The upstream commit specifically warns that direct nested dictionary indexing after deletion may raise KeyError and recommends service methods or guarded map access.
Claim Not Supported: session user-state deletion, durable cross-process persistence, release rollout, a measured failure frequency, Zero kernel use of the same storage, or externally validated completion semantics.
Confidence: HIGH_FOR_SOURCE_CODE_DIFF / UNKNOWN_FOR_EXECUTED_OUTCOME
Limitations: this is an explicit storage-representation change for an in-memory service, not a claim that every API client is broken or that a local incident occurred.

## RAW_RELIABILITY_SIGNAL_LOG
### SIG-20261111-A01 — SESSION_DELETION_PARENT_MAP_INVARIANT
Signal ID: SIG-20261111-A01
Source IDs: SRC-20261111-A01
External Evidence: original google/adk-python change and authored tests, no live production observation.
Failure Mechanism: a consumer that directly indexes sessions[app_name][user_id] after the last session is deleted may now receive KeyError because empty ancestor maps are removed. Treating the missing key as an unexpected storage crash rather than the current post-deletion absence, or assuming a retained empty map is a lifecycle contract, produces brittle recovery and continuity semantics.
Original Code Evidence: src/google/adk/sessions/in_memory_session_service.py removes the empty user entry and subsequently the empty app entry; the committed comment suggests .get(app_name, {}).get(user_id, {}).
Authored Regression Test Evidence: tests/unittests/sessions/test_session_service.py adds controls showing the map is empty after last-session removal and another session remains when only one of multiple sessions is deleted. Test source READ / NOT_EXECUTED.
Risk Classification: EXTERNAL_RISK_CLASS / STATE_REPRESENTATION_CHANGE / SESSION_LIFECYCLE_ACCESS_CONTRACT
Local Incident: NOT_OBSERVED. No Zero Host Kernel deletion, KeyError, data loss or recovery failure has been measured.
Existing Defense: UNKNOWN. Upstream authors suggest service-layer lookup or guarded mapping; this is not proof of any Zero-local defense.
Measured Effectiveness: NOT_COMPUTED / ZERO_LOCAL_EXPERIMENTS.
Counterevidence: deletion of one of two sessions keeps the remaining user map; the patch does not delete app/user state maps. No evidence establishes a rollback or durable database invariant. The direct map field is not a guaranteed public cross-version interface merely because code once exposed empty ancestors.
Scope: Google ADK InMemorySessionService internal sessions mapping and consumers depending on exact internal representation, not universal agent-memory behavior.
Host Change: NO

## SOURCE_AND_STATE_CLASSIFICATION
- External Risk: SUPPORTED_BY_ONE_FIRST_PARTY_PATCH_FOR_THE_NARROW_SESSION_MAP_ACCESS_CONTRACT.
- Local Incident: NO_LOCAL_EVIDENCE / NOT_CLAIMED; lack of local evidence is not proof of immunity.
- Existing Defense: NOT_VERIFIED. Current Zero installed packages and data structures were not evaluated against this specific patch.
- Independent Sources: one Google ADK code lineage, not independently replicated; source and authored fixtures are not two independent experiments.
- Semantic axes: session logical identity, in-memory map incarnation, deletion state, service method response, direct indexing outcome and durable state persistence remain separate.
- Cross-repository caution: a separate Horizon H1 also inspects a Google ADK commit today, but distinct patches from one upstream publisher do not create independent risk corroboration.

## EVIDENCE_DELTA
- NEW_EVIDENCE: an exact upstream code change now prunes empty parent mappings after last-session deletion, with authored positive and negative fixtures.
- CORRECTED_INTERPRETATION: an empty parent-map representation is not equivalent to an authoritative logical session state guarantee; API-level lookup and direct internal mapping indexing have different stability boundaries.
- UNCHANGED_BOUNDARY: EXTERNAL_SDK_PATCH != ZERO_LOCAL_INCIDENT; SOURCE_TEST != EXECUTED_PASS; MAP_ABSENCE != PROOF_OF_HISTORICAL_ABSENCE; SESSION_DELETE != ALL_USER_STATE_DELETED.
- NEW_COUNTEREVIDENCE: one-session and multiple-session fixtures represent different parent-map outcomes; direct indexing can become invalid even when deletion succeeds normally.
- UNKNOWN_RETAINED: installed SDK version, upstream tests, all deleting callers, operational errors, local defenses, durable persistence and effect-time task completion.
- NEXT_RETEST_CONDITION: pin old/new source revisions, create two sessions and delete one, then delete the last; independently check service lookups, internal map keys, retained app/user state and KeyError path with command, environment, exit, stdout/stderr and exact state snapshots.

## NEXT_HANDOFF
- Same-day A2 must wait for this exact A1 artifact to merge and become visible on a refreshed main SHA. A pending Draft PR is not admissible upstream evidence.
- A2 should challenge access-contract and deletion-state assumptions without claiming local Zero incidents, Zero mitigations or a second independent source from the same ADK patch.
- No Aegis internal doctrine, Host Kernel, Ballast, NEXUS, active memory, workflow or November Monthly change is justified by this observation alone.

## BOUNDARY_CHECK
- This native A1 proposal contains only the canonical 2026-11-11 Aegis file and preserves historical Jules producer identity, prior files, external/local risk split, and negative states.
- Aegis native checker: NOT_EXECUTED at authoring. Upstream authored tests: NOT_EXECUTED. Zero local runtime/impact measurement: NOT_EXECUTED / NOT_COMPUTED.
- No private task prompt, hidden memory or host runtime change is included. Boundary Violation: NO


## FORWARD_CORRECTION_2026-11-11 — scoped producer enum alignment
- Original 2026-11-11 record emitted `Record Provenance` as `HUMAN_AUTHORIZED_SUBSTITUTE / NEW_PROSPECTIVE_RESEARCH`, which is not a single value accepted by the current repository checker. This is an authoring-schema defect, not a change in the original execution result.
- The current owning header now uses exactly `HUMAN_AUTHORIZED_SUBSTITUTE`; its prospective GPT Native/not-Jules producer identity remains declared in `Agent`, `Producer Identity`, and `Original Execution Status`.
- Original source identity, task date, prior main SHA, run identity, source interpretation, UNKNOWN/NOT_EXECUTED states and the original PR/merge history are unchanged. This correction adds no independent research or validator execution credit.
- Correction scope: current source file header plus this dated forward correction only; main visibility of the original source occurred through the earlier merged PR.
