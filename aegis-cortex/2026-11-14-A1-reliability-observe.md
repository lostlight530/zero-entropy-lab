# A1 Daily Reliability Observe — 2026-11-14

## CORTEX_RUN_HEADER
Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A1
Canonical Identity: zero/aegis/A1
Cadence: Daily
Loop Stage: Observe
Logical Date: 2026-11-14
Logical Timezone: Asia/Shanghai
Agent: GPT-6 / GPT_NATIVE / HUMAN_REQUESTED / NOT_JULES_REPLAY
Producer Identity: HUMAN_REQUESTED_GPT_NATIVE
Record Provenance: HUMAN_AUTHORIZED_SUBSTITUTE
Source Identity: google/adk-python@12aab4aaaa1a72e3edcc65fa4f9d849896ea6c48
Source Authority For Claim: FIRST_PARTY_IMPLEMENTATION_DIFF / NO_RUNTIME_RESULT
Independent Verification: NOT_EXECUTED / ONE_AUTHOR_LINEAGE
Host Applicability: UNKNOWN / ZERO_HOST_INTEGRATION_NOT_CHECKED
Original Execution Status: GPT_NATIVE_BOUNDED_EXTERNAL_RISK_REVIEW_COMPLETED
Current Path Status: DRAFT_PR_PENDING_REVIEW
External Evidence: FIRST_PARTY_CODE_PATCH_AND_AUTHORED_TEST_SOURCE / NOT_EXECUTED
Base Main SHA: 4310c93ff4d30a940f29f9ac33953ee3b0d0c6ec
Run Identity: zero-entropy-lab/aegis/A1/2026-11-14/GPT_NATIVE/4310c93ff4d30a940f29f9ac33953ee3b0d0c6ec/adk-unconditional-inotify-observer-01
Execution Time UTC: 2026-11-14 / exact research-start second NOT_CAPTURED
Execution Time Asia/Shanghai: 2026-11-14 / exact research-start second NOT_CAPTURED
Task Status: SUCCESS_BOUNDED_EXTERNAL_FAILURE_MECHANISM_OBSERVATION
Network Status: OFFICIAL_GITHUB_IMPLEMENTATION_DIFF_READ
Source Status: FIRST_PARTY_COMMITTED_PATCH_AND_AUTHORED_TESTS / NOT_EXECUTED
Evidence Class: EXTERNAL_RISK_CLASS / CONDITIONAL_RUNTIME_RESOURCE_LEAK
Local Incident Evidence: UNKNOWN / NO_ZERO_LOCAL_INCIDENT_OBSERVED
Existing Defense: UNKNOWN / NO_HOST_RUNTIME_INSPECTION
Measured Effectiveness: NOT_COMPUTED
Repository Inspection: AEGIS_POLICY_AND_PRIOR_PERIODS_READ
GitHub Actions Inspection: AEGIS_VALIDATOR_NOT_EXECUTED
Write Scope: aegis-cortex/2026-11-14-A1-reliability-observe.md
Host Repository Change: NO
Boundary Violation: NO

## INPUT_RECORD
- Fresh Zero main 4310c93ff4d30a940f29f9ac33953ee3b0d0c6ec, Aegis evidence policy, 2026-11-13 A1/A2, closed W45 A4, and October A6 dated month owner were read. The latter has a historically provisional header and later closure updates; neither is new local runtime evidence.
- No open Zero PR at task preflight; today's A1 target absent on main. Current W46 and November are not naturally closed, so A3/A4 and A5/A6 are NOT_DUE.
- Read exact first-party upstream Google ADK commit and the implementation and authored regression test patches. No Google ADK package, watchdog, inotify runtime, local Zero Host Kernel or test suite executed.
- Prior evidence on Nov13 concerned credential-sensitive telemetry serialization. Today concerns a distinct lifecycle resource allocation mechanism; shared publisher does not create independent corroboration.

## EXTERNAL_SOURCE_RECORDS
Source ID: SRC-20261114-A01
Title: fix: only create the agents file watcher when agent reload is enabled
Publisher: google/adk-python
Canonical Source Identity: google/adk-python@12aab4aaaa1a72e3edcc65fa4f9d849896ea6c48
URL: https://github.com/google/adk-python/commit/12aab4aaaa1a72e3edcc65fa4f9d849896ea6c48
Committed At: 2026-11-13T20:50:36Z (2026-11-14 Asia/Shanghai)
Date Checked: 2026-11-14 Asia/Shanghai
Source Type: FIRST_PARTY_IMPLEMENTATION_PATCH_AND_AUTHOR_TEST_SOURCE
Evidence Tier: PRIMARY_FOR_PATCH_BEHAVIOR / NO_INDEPENDENT_EXECUTION
Access Status: EXACT_PATCH_READ / tests/unittests/cli/test_fast_api.py inspected in diff
Independent Source: ONE_UPSTREAM_COMMIT_LINEAGE
Claim Supported: ApiServer.get_fast_api_app previously constructed a watchdog Observer even when no reload setup callback was supplied; the commit changes setup_observer and tear_down_observer defaults to None and gates observer creation on setup_observer. Its description attributes inotify-instance and reader-thread exhaustion in repeated app creation to the earlier behavior, with new authored regression source.
Claim Not Supported: confirmed Zero local resource leak, independently verified Google CI result, every ADK release affected, the patch fully eliminates other inotify leaks, or Zero hosts this server.
Confidence: HIGH_FOR_SOURCE_PATCH / UNKNOWN_FOR_RUNTIME_GENERALIZATION
Limitations: resource behavior depends on watchdog version, platform, application-construction count and reload flag. Single-created application is not proof of eventual exhaustion.

## RAW_RELIABILITY_SIGNAL_LOG

### RAW_FAILURE_MECHANISM
Risk ID: RISK-20261114-A01
Signal: FILE_WATCHER_ALLOCATED_WHEN_AGENT_RELOAD_DISABLED
Failure Mechanism: construction of an application without the reload capability still allocates a file-system Observer, which can hold an inotify instance and reader thread per application object. Repeated application creation in long-lived processes or tests can exhaust OS instance/thread resources even when no file reload was requested.
Source: SRC-20261114-A01
External Risk: FIRST_PARTY_REPORTED_RESOURCE_LEAK_MECHANISM_AND_PATCH
Local Incident: UNKNOWN / NO_LOCAL_ZERO_FAILURE_VERIFIED
Existing Defense: UNKNOWN / NOT_EXAMINED
Measured Effectiveness: NOT_COMPUTED
Local Applicability: UNKNOWN / NO_ZERO_ADK_DEPENDENCY_OR_API_SERVER_PATH_VERIFIED
Counterconditions: with a real reload callback, an Observer may be intentionally required; older watchdog or a single bounded construction may not exhibit the same allocation pressure; other observers elsewhere in a process remain out of scope.
Risk Class: EXTERNAL_RISK_CLASS, not LOCAL_REPOSITORY_INCIDENT
Confidence: HIGH_FOR_COMMIT_MECHANISM / RUNTIME_REPLAY_UNVERIFIED

## SOURCE_AND_STATE_CLASSIFICATION
- Process startup success != resource-lifecycle correctness. A server accepting requests does not prove background threads and OS inotify handles were not allocated or leaked.
- Authored upstream tests and commit description are one producer lineage, not independent runtime or local mitigation measurements.
- A file watcher disabled by configuration != watcher not constructed; constructor side effects require concrete measurement.
- The Google ADK patch does not imply a Zero Host Kernel, NEXUS, SQLite, JSONL, hash-chain or Ballast incident, nor a necessary change to those surfaces.

## EVIDENCE_DELTA
- NEW_EVIDENCE: first-party conditional-construction patch and regression-test source for a no-reload server lifecycle resource leak.
- CORRECTED_INTERPRETATION: optional feature disabled in user-facing configuration is not evidence of no side-effecting resource allocation during setup.
- UNCHANGED_BOUNDARY: EXTERNAL_RISK != LOCAL_INCIDENT != EXISTING_DEFENSE != MEASURED_EFFECTIVENESS; SOURCE_PATCH != RUNTIME_PASS.
- NEW_COUNTEREVIDENCE: intentionally enabled reload is expected to create a watcher; a bounded one-off setup does not automatically reach resource exhaustion.
- UNKNOWN_RETAINED: exact affected package versions, upstream CI exit, reproduction denominator, local integrations, retained watcher/thread counts and zero-entropy-lab mitigation.
- NEXT_RETEST_CONDITION: pin pre/post ADK and watchdog revisions, create repeated app instances with reload disabled and enabled, count inotify descriptors and threads before/after cleanup, record command, stdout, stderr, exit, environment and real cleanup behavior; separately verify any actual Zero integration before local promotion.

## NEXT_HANDOFF
- Same-day A2 requires this exact Nov14 A1 to be merged and visible on main. Reopen the source, inspect watcher start/stop and negative controls, then give only bounded reliability classification.
- W46 A3/A4 and November A5/A6 NOT_DUE. No Host Kernel, Ballast, NEXUS, run configuration, code, workflow, archive, storage or durable doctrine change authorized.

## BOUNDARY_CHECK
- One Aegis Daily source study, not an observed Zero failure, measured defense or executable test run.
- No historical artifact, local state or host system modified. No private producer prompt or credential copied.
