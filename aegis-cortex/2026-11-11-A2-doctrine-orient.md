# A2 Daily Aegis Doctrine Orient — 2026-11-11

## CORTEX_RUN_HEADER
Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A2
Canonical Identity: zero/aegis/A2
Cadence: Daily
Loop Stage: Orient
Logical Date: 2026-11-11
Logical Timezone: Asia/Shanghai
Execution Time UTC: 2026-11-11 / EXACT_TIME_NOT_CAPTURED
Agent: GPT-6 / GPT_NATIVE / NOT_JULES_REPLAY
Producer Identity: HUMAN_REQUESTED_GPT_NATIVE
Record Provenance: HUMAN_AUTHORIZED_SUBSTITUTE
Base Main SHA: d2a079f7d8bd61bb3f9abce304bd3d7f9dd81e77
Run Identity: zero-entropy-lab/aegis/A2/2026-11-11/GPT_NATIVE/d2a079f7d8bd61bb3f9abce304bd3d7f9dd81e77/adk-session-map-contract-orient-01
Upstream A1: aegis-cortex/2026-11-11-A1-reliability-observe.md
Upstream A1 Blob SHA: 8147c773face7c89c246fa8a85df0eed8f6c0820
Upstream A1 Original PR: https://github.com/lostlight530/zero-entropy-lab/pull/846
Upstream A1 Forward Correction PR: https://github.com/lostlight530/zero-entropy-lab/pull/847
Input Status: SAME_DATE_A1_MERGED_MAIN_VISIBLE_AND_PROVENANCE_CORRECTED
Source Identity: google/adk-python@c0bcdaa480a7547587fffd783f54bc408ae814a0
Source Authority For Claim: FIRST_PARTY_COMMITTED_IN_MEMORY_SESSION_SERVICE_CODE_AND_AUTHORED_TESTS
Independent Verification: PINNED_IMPLEMENTATION_READ / LOCAL_AND_UPSTREAM_RUNS_NOT_EXECUTED
Evidence Class: EXTERNAL_RISK_CLASS / POST_DELETE_INTERNAL_MAP_ACCESS_AND_SESSION_LIFECYCLE
Local Incident Evidence: NO_LOCAL_INCIDENT_ATTESTED
Original Execution Status: GPT_NATIVE_2026-11-11_NEW_ORIENTATION / NOT_JULES_REPLAY
Current Path Status: PROPOSED_REVIEW_BRANCH / MERGE_PENDING_AT_AUTHORING
Task Status: BOUNDED_SOURCE_ORIENTATION / NO_LOCAL_DOCTRINE_ACTION
Network Status: UPSTREAM_ORIGINAL_IMPLEMENTATION_AND_TEST_SOURCE_READ
Host Applicability: UNKNOWN / NO_ZERO_HOST_DEPENDENCY_OR_RUNTIME_TEST
Local Applicability: UNKNOWN / INSTALLATION_AND_INTERNAL_ACCESS_UNKNOWN
Remaining Uncertainty: LOCAL_DEFENSE_EFFECTIVENESS_NOT_COMPUTED / SDK_TEST_NOT_EXECUTED
Write Scope: aegis-cortex/2026-11-11-A2-doctrine-orient.md
Boundary Violation: NO

## INPUT_RECORD
- Cold-read fresh merged main d2a079f7d8bd61bb3f9abce304bd3d7f9dd81e77 after original A1 #846 merged and its separate provenance correction #847 merged. Current A1 blob: 8147c773face7c89c246fa8a85df0eed8f6c0820.
- The A1 mechanism is deletion of empty parent maps in the ADK InMemorySessionService, creating a changed expectation for clients directly indexing its internal `sessions` dictionary. This is **not** an observed Zero Host Kernel incident.
- The same original upstream Google ADK commit was reopened at its pinned SHA, with both the implementation and authored positive/negative test source inspected. Re-reading source does not create independent experimental corroboration.
- 2026-W45 is closed; W46 open. November A5/A6 final NOT_DUE. This A2 does not edit the Host Kernel, Ballast, NEXUS, active memory or Aegis durable doctrine.

## SOURCE_VERIFICATION_RECORDS
### SRC-20261111-A2-01 — actual delete/read state contract in pinned source
- First-party commit: https://github.com/google/adk-python/commit/c0bcdaa480a7547587fffd783f54bc408ae814a0 (2026-11-11T01:52:57Z upstream commit timestamp, not a release).
- In `src/google/adk/sessions/in_memory_session_service.py`, `_delete_session_impl` first checks `session_id not in self.sessions.get(app_name, {}).get(user_id, {})` and returns for a missing entry; it removes a present session, then deletes the user map if empty, then the app map if empty.
- `get_session` / `get_session_sync` use `_get_session_impl`: missing app/user/session keys return `None`, rather than direct missing-key indexing. `list_sessions` uses a similar existence guard and returns an empty `ListSessionsResponse` on missing parent keys.
- `get_user_state` reads `self.user_state`, a separate dictionary. The changed session-parent-map cleanup is **not** proof user state is deleted, global state is reset, or any durable store is erased.
- Authored tests check (i) a one-session delete leaves `sessions == {}`, (ii) deleting one of two sessions preserves the remaining session. These are source-level test fixtures, NOT_EXECUTED.
- This is an SDK internal representation and API behavior observation, not a universal host safety finding or confirmed production failure.

### SRC-20261111-A2-02 — counterconditions and caller contract
- Authorized user-visible semantics can remain stable via `get_session` and `list_sessions` even though direct dictionary indexing becomes an invalid assumption after last-session deletion.
- A nonexistent delete is an idempotent no-op in the shown lookup path, but that is not proof that concurrent delete/recreate races, event append side effects or external retries have end-to-end idempotency.
- The implemented `append_event` precondition checks `session_id not in self.sessions.get(...)` and raises `SessionNotFoundError` when the session is missing. This demonstrates a distinct post-deletion write result, not automatically a data-loss incident.
- A stale caller holding the old `Session` object may know a previously valid identity while the current map no longer contains it. A past reference, current lookup result, map incarnation, and effect receipt are four different predicates.
- Recreating a session after deletion does not establish equivalence of old and new session IDs, events, state or provenance without a matched identity/version and replay.
- If a client uses public service methods instead of direct `sessions[app][user]` indexing, the specific exception hazard may be absent. No evidence was found proving an actual Zero consumer directly reads Google ADK's internal mapping.
- These are bounded implementation-path observations and counterexample designs, not executed tests or measured local defense effectiveness.

## RISK_CLASSIFICATION
Signal ID: SIG-20261111-A01
A1 Failure/Risk Class: SESSION_DELETION_PARENT_MAP_INVARIANT / DIRECT_MAP_ACCESS_ASSUMPTION
External Risk: SOURCE_SUPPORTED_FOR_GOOGLE_ADK_INTERNAL_MAPPING_CONSUMERS_ONLY
External Claim: CODE_PATCH_SUPPORTED / RUNTIME_TEST_RESULTS_NOT_OBSERVED
Local Incident Evidence: NO_LOCAL_EVIDENCE / NO_ZERO_INCIDENT_CLAIM
Local Evidence: NO_LOCAL_HOST_DELETION_OR_DIRECT_MAP_CONSUMER_REPRO
Existing Defense: UNKNOWN / HOST_CODE_NOT_ASSESSED_FOR_ADK_INTERNAL_ACCESS
Measured Effectiveness: NOT_COMPUTED
Host Applicability: UNKNOWN / INSTALLED_DEPENDENCY_AND_CALL_SITE_UNVERIFIED
Independent Evidence Added: NONE / SAME_UPSTREAM_COMMIT_AND_AUTHORED_TESTS
Confidence: HIGH_FOR_SOURCE_LEVEL_PATH / UNKNOWN_FOR_DEPLOYMENT_AND_EFFECT

## ORIENTATION_NOTES
- Contract discipline: classify `SESSION_DELETED` using service-level identity/lookup and actual store state, not a caller's prior object handle or an assumption that empty ancestor maps persist.
- Proposed negative/positive controls (NOT_EXECUTED): delete last session; delete one of multiple; delete nonexistent session; guarded GET/list; direct nested map indexing; append to deleted session; create a new session after deletion with explicit incarnation evidence.
- For an actual host issue, require a known installed revision, a named affected call site, concurrent process/session identity, command/trace, exception stack, state snapshot before and after, and the authoritative tool/effect result. None has been collected here.
- Authorization and retention remain separate: a missing session is not proof that related user state was deleted, consent revoked, external actions rolled back or historical effects undone.

## NO_DECISION_SECTION
Decision: NO_DECISION / NO_AEGIS_PROTOCOL_OR_HOST_KERNEL_MODIFICATION
Reason: there is credible original upstream implementation evidence, but no demonstrated Zero local dependency, incident, local defense state, measured effectiveness or independently executed negative fixture. Aegis is a research/evidence surface, not the host runtime.
No doctrine promotion: the observation stays in a dated Daily Aegis risk review; it is not merged into long-lived A5/A6 memory or an enforcement control.

## COUNTEREVIDENCE_GATE
- A caller using supported `get_session` or `list_sessions` may still behave normally; internal-map breakage is not proof of general SDK unavailability.
- Missing ancestor maps do not imply destroyed `user_state` or a failed `delete_session`.
- No shared-store cross-day continuity or incident denominator exists; absence of measured Zero failures is not a measured defense success.
- Repeating the same Google ADK patch in A1 and A2 changes interpretation depth, not the number of independent sources.

## EVIDENCE_DELTA
- NEW_EVIDENCE: specific pinned source paths show safe get/list absence checks, a separately stored user-state mapping and a named missing-session append failure class.
- CORRECTED_INTERPRETATION: post-deletion internal mapping representation differs from the logical API lookup result; neither alone proves final effect-time recovery.
- UNCHANGED_BOUNDARY: EXTERNAL_SOURCE_FIX != ZERO_LOCAL_INCIDENT; SOURCE_TEST != TEST_PASS; SESSION_ABSENT != HISTORY_ERASED; DELETE_ATTEMPT != ALL_EXTERNAL_EFFECTS_ROLLED_BACK.
- NEW_COUNTEREVIDENCE: supported lookup methods may stay stable, and deleting one of multiple sessions retains map hierarchy; a KeyError requires the specific raw-dictionary access assumption.
- UNKNOWN_RETAINED: local installation, source-API configuration, race/recreate paths, actual SDK test outcome, durable persistence, Zero defenses, production efficacy and user-state semantics beyond inspected paths.
- NEXT_RETEST_CONDITION: pin old/new commits and exact installed dependency; test single/multi/missing deletion cases, direct access versus get/list, app/user-state retention and post-delete event append; retain revision, runner, commands, stdout/stderr, exit, authoritative store snapshot and independent final effect receipts.

## NEXT_HANDOFF
- After W46 naturally closes, A3 may count this A1→A2 as one inherited upstream source lineage; it must not create a local incident count or increase independent-source credit.
- An actual Zero-specific incident or defense proposal would require explicit local code/installation and effect-time evidence and a separate authorized review; this A2 does not provide it.
- Prior Aegis/Jules work and November natural-month status stay unchanged.

## BOUNDARY_CHECK
- Only canonical same-day A2 is proposed. A1 source was already corrected and merged before H2/A2 branch initialization; original A1 task-time source and original PR statistics are preserved.
- No Host Kernel, Ballast, NEXUS, active store, workflow/scheduler, external side effects, independent maintenance, Periodic Audit or governance file was modified.
- Upstream code and test source: READ. Aegis native checker: NOT_EXECUTED at writing; upstream tests, Zero local runtime and actual defect mitigation: NOT_EXECUTED / NOT_COMPUTED.
- Actual producer is GPT Native, not historical Jules. No private producer prompt or fabricated local evidence. Boundary Violation: NO
