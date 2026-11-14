# A2 Daily Doctrine Orient — 2026-11-14

## CORTEX_RUN_HEADER
Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A2
Canonical Identity: zero/aegis/A2
Cadence: Daily
Loop Stage: Orient
Logical Date: 2026-11-14
Logical Timezone: Asia/Shanghai
Agent: GPT-6 / GPT_NATIVE / HUMAN_REQUESTED / NOT_JULES_REPLAY
Record Provenance: HUMAN_AUTHORIZED_SUBSTITUTE
Evidence Class: EXTERNAL_RISK_CLASS / RESOURCE_LIFECYCLE_CONSTRUCTOR_SIDE_EFFECTS
Source Identity: google/adk-python@12aab4aaaa1a72e3edcc65fa4f9d849896ea6c48
Source Authority For Claim: FIRST_PARTY_IMPLEMENTATION_AND_TEST_PATCH / NOT_RUNTIME_MEASURED
Independent Verification: SOURCE_PATCH_REOPENED / NO_INDEPENDENT_TEST_EXECUTION
Local Incident Evidence: UNKNOWN / NO_ZERO_RESOURCE_EXHAUSTION_OBSERVED
Host Applicability: UNKNOWN / NO_LOCAL_SDK_DEPENDENCY_CONFIRMATION
Original Execution Status: GPT_NATIVE_BOUNDED_A2_EXTERNAL_RISK_REVIEW_COMPLETED
Current Path Status: DRAFT_PR_PENDING_REVIEW
Base Main SHA: 7ac91234451010033d3e984f4d51108418e93347
Run Identity: zero-entropy-lab/aegis/A2/2026-11-14/GPT_NATIVE/7ac91234451010033d3e984f4d51108418e93347/observer-construction-and-teardown-negative-controls-01
Execution Time UTC: 2026-11-14 / exact start NOT_CAPTURED
Execution Time Asia/Shanghai: 2026-11-14 / exact start NOT_CAPTURED
Upstream A1: aegis-cortex/2026-11-14-A1-reliability-observe.md
Upstream A1 Blob SHA: a9879180152662caac82a1894174bd13cc60b30a
Upstream A1 Merge PR: https://github.com/lostlight530/zero-entropy-lab/pull/868
Input Status: SAME_DATE_A1_MERGED_MAIN_VISIBLE_AND_EXACT_BLOB_READ
Input A1 Task Status: SUCCESS_BOUNDED_EXTERNAL_FAILURE_MECHANISM_OBSERVATION
Input A1 Source Status: FIRST_PARTY_COMMITTED_PATCH_AND_AUTHORED_TESTS / NOT_EXECUTED
Network Status: EXACT_UPSTREAM_FIRST_PARTY_COMMIT_AND_TEST_DIFF_REOPENED
Source Status: PYTHON_CONSTRUCTOR_LIFECYCLE_CODE_AND_REGRESSION_FIXTURES / TESTS_NOT_EXECUTED
Task Status: SUCCESS_BOUNDED_EXTERNAL_RISK_ORIENTATION / NO_LOCAL_INCIDENT_OR_DOCTRINE_PROMOTION
Local Applicability: UNKNOWN / HOST_DEPENDENCY_CHAIN_NOT_CHECKED
Existing Defense: UNKNOWN / NO_ZERO_HOST_PROBE
Measured Effectiveness: NOT_COMPUTED
Write Scope: aegis-cortex/2026-11-14-A2-doctrine-orient.md
Boundary Violation: NO

## INPUT_RECORD
- Freshly read same-date A1 from main 7ac91234451010033d3e984f4d51108418e93347, blob a9879180152662caac82a1894174bd13cc60b30a, after upstream merged as PR #868. Confirmed task identity, Shanghai date, primary source and lack of local implementation/test evidence.
- Read Nov 13 A2 and W45 A4 as dated context. A1 report and A2 repetition count as ONE upstream source lineage. October A6 historically included provisional and closure blocks, not November risk evidence.
- Independently reopened google/adk-python commit 12aab4aaaa1a72e3edcc65fa4f9d849896ea6c48, inspecting src/google/adk/cli/api_server.py and tests/unittests/cli/test_fast_api.py, not only the earlier A1 summary.
- No Zero Host Kernel dependencies, watchdog installation, Linux inotify descriptor counts, ADK test processes or host runtime execution were inspected. W46/November naturally OPEN; weekly/monthly NOT_DUE.

## RISK_CLASSIFICATION

### RISK-20261114-A01 — optional reload feature with eager observer construction
Signal ID: RISK-20261114-A01
External Claim: the Google ADK patch avoids creating a platform watchdog Observer for get_fast_api_app() calls lacking setup_observer. Earlier construction could instantiate a Linux inotify reader even when no reload was desired. Author describes a repeated-construction resource leak.
Risk Categories: resource exhaustion risk; allocation/lifecycle mismatch; false-success inference
Verification Status: FIRST_PARTY_SYNC_CODE_AND_TEST_SOURCE_READ / NO_UPSTREAM_PYTEST_REPLAY
Verification Sources:
- https://github.com/google/adk-python/commit/12aab4aaaa1a72e3edcc65fa4f9d849896ea6c48
- api_server.py: default setup_observer and tear_down_observer become None; PlatformObserver is constructed only when setup callback exists. Teardown is conditional on non-None observer and non-None teardown callback.
- test_fast_api.py: authored tests mock Observer.assert_not_called() for no reload, and check start/stop/join for a reload-enabled app. Additional explicit callback-combination tests exist.
Aegis Repository Record Comparison: W45 A4 retained NO_ACTIONABLE_DECISION and no local reliability measurement. Nov 13 A2 concerned credential serializer type identity, not this watcher allocation mechanism. None proves Zero uses an ADK FastAPI server.
Local Applicability: UNKNOWN / ADK_APPLICATION_AND_WATCHDOG_IMPORT_PATH_UNVERIFIED
Evidence Strength: HIGH_FOR_ADK_CONDITIONAL_CONSTRUCTION_SOURCE / NONE_FOR_LOCAL_INOTIFY_RESOURCE_COUNT
Counterevidence:
- No reload setup callback -> construction suppressed by new code; this is source-level intent, not measured OS handle delta.
- With setup_observer provided, observer creation is intentional. If tear_down_observer is omitted, code now skips cleanup callback; the new patch is NOT a universal resource cleanup guarantee for arbitrary custom callback pairings.
- Mock assertions about constructor invocation and lifecycle calls are not independent evidence that Linux descriptors were released under all watchdog versions.
- The stated CI failure errno24, hundreds of app creations and watchdog 7 behavior are in the original committer's description. They were not reproduced or measured by this producer.
- A single bounded application construction, non-Linux platform, no relevant dependency installation, and existing explicit shutdown may change practical exposure.
Remaining Uncertainty: whether Zero uses this package/path, prior and patched wheel version, real inotify and thread counts, teardown correctness, alternate watchers, deployed environment and local mitigation rate.
Weekly Promotion Eligibility: W46_A3_WATCHLIST_ONLY / NO_ACTIONABLE_LOCAL_DISCIPLINE_DECISION

## ORIENTATION_NOTES
- Source-level finding: no-reload flag must control construction, not just invocation of watcher.start(). A constructor with side effects is an observable runtime boundary even before startup completes.
- Qualifying upstream fixture evidence exists for no-reload, reload-enabled stop/join, and paired callback variants. Earlier A1 uncertainty should not be misread as absence of authored coverage; its missing evidence is our own unexecuted test result and local stack.
- A config-disabled feature does not prove absence of resource allocation; a conditional constructor fix does not prove all resource lifecycle paths are safe.
- Local Zero failure evidence remains UNKNOWN. No Host Kernel incident, CI cause, Ballast issue, Pages artifact race, secret leak or kernel repair is established by this external patch.
- Direct host dependency or OS measurements would be needed before associating an actual incident with this mechanism. A green deployment/job is not evidence of absence of leaked background resources.

## NO_DECISION_SECTION
- No Zero dependency upgrade, FastAPI/ADK deployment change, runtime code change, kernel defense claim, monitoring policy adoption or local incident declaration.
- No automatic A3/W46 discipline promotion, A4 protocol action, A5/A6 durable-memory update or human-governance substitute.
- No percentage reliability improvement, Python test PASS, process leak measurement, production adoption, or universal fix claim.

## NEXT_HANDOFF
- W46 A3 may keep a narrowly scoped external-risk watchlist entry, not a local defense or incident determination.
- Independent retest plan: identify actual Zero dependency via current SBOM/import tree first; pin Google ADK and watchdog revisions, then run no-reload repeated-app creation and reload-enabled shutdown controls. Count actual per-process inotify FDs, active threads and watcher object lifetimes before and after cleanup; capture commands, versions, stdout/stderr, exit, fixture count and code SHA.
- Negative control: call get_fast_api_app with setup_observer but missing tear_down_observer to exercise cleanup omission. Separate created/started/stopped/joined and resources actually released, never infer one from the other.
- Counterfactual: compare before/after source at equal process/environment and isolate OS resource limits from unrelated background watchers.

## EVIDENCE_DELTA
- NEW_EVIDENCE: reread exact constructor/teardown branches and complete authored callback-combination fixtures, not only upstream prose.
- CORRECTED_INTERPRETATION: guarding construction prevents one path of eager allocation but does not establish resource cleanup for every custom callback pairing.
- UNCHANGED_BOUNDARY: EXTERNAL_RISK != LOCAL_INCIDENT != EXISTING_DEFENSE != MEASURED_EFFECTIVENESS; AUTHOR_TEST_SOURCE != EXECUTED_PASS.
- NEW_COUNTEREVIDENCE: enabled reload intentionally allocates observer; missing teardown callback may skip cleanup and mocks do not verify actual OS resource release.
- UNKNOWN_RETAINED: local stack, affected deployed version, OS resource behavior, test runtime, independent reproduction and measured mitigation.
- NEXT_RETEST_CONDITION: pair pinned pre/post builds with no-reload, reload, custom callbacks and accurate OS instrument/recorded command exit; only then consider a local applicability update.

## BOUNDARY_CHECK
- Same-date A1 merged and exact blob read from main; historical A1/A2 and Jules provenance are untouched.
- Only a new A2 cortex Daily path proposed, no Host Kernel, Ballast, NEXUS, configuration, Actions, audit, memory or external repository edit.
- No sensitive values or private prompts emitted. No unrun test, incident or measured defense elevated.
- Boundary Violation: NO
