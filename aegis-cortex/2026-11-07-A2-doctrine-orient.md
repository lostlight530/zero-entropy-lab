# A2 Daily Doctrine Orient — 2026-11-07

## CORTEX_RUN_HEADER
Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A2
Canonical Identity: zero/aegis/A2
Cadence: Daily
Loop Stage: Orient
Logical Date: 2026-11-07
Logical Timezone: Asia/Shanghai
Agent: GPT-6 / GPT_NATIVE / NOT_JULES_REPLAY
Producer Identity: HUMAN_REQUESTED_GPT_NATIVE
Record Provenance: FORWARD_NATIVE_ORIENTATION
Base Main SHA: 1606588cf1481ec86aa8c370ffc73c3e28c1b872
Run Identity: zero-entropy-lab/aegis/A2/2026-11-07/GPT_NATIVE/1606588cf1481ec86aa8c370ffc73c3e28c1b872/first-party-source-orientation
Upstream A1: aegis-cortex/2026-11-07-A1-reliability-observe.md
Upstream A1 Blob SHA: 2cf71b1ce8d270346a3b2ccb7d34167fdcd6ac2c
Input Status: SAME_DATE_A1_MERGED_MAIN_VISIBLE / PR_814
Input A1 Task Status: SUCCESS_BOUNDED_EXTERNAL_RISK_STUDY
Source Status: TWO_ORIGINAL_COMMITS_ONE_ADK_ISSUER_LINEAGE / AUTHORED_TESTS_NOT_EXECUTED
Network Status: FIRST_PARTY_COMMIT_AND_SOURCE_TEST_PATCHES_READ
Task Status: SUCCESS_BOUNDED_EXTERNAL_RISK_ORIENTATION / NO_LOCAL_DEFECT_ATTESTED
Local Incident Evidence: NO_LOCAL_EVIDENCE / NOT_AN_IMMUNITY_CLAIM
Host Applicability: UNKNOWN
Write Scope: aegis-cortex/2026-11-07-A2-doctrine-orient.md
Boundary Violation: NO

## INPUT_RECORD
- Fresh merged main 1606588cf1481ec86aa8c370ffc73c3e28c1b872 has exact matching A1 path aegis-cortex/2026-11-07-A1-reliability-observe.md blob 2cf71b1ce8d270346a3b2ccb7d34167fdcd6ac2c, after PR #814 merge. Alternative A1 Draft #815 closed unmerged, not an independent replication.
- Prior A2 2026-11-06 on main concerns memory aliases and SQLite lock wait; W44 / October evidence limits remain. W45 and November are not final/closed.
- Reopened original google/adk-python commits 10711d0532373f526a4438c8c0bcb93c4e81419c (2026-11-06T20:03:38Z) and ba142cf8e91b045aa0b435f71dbd7c3e686efa45 (2026-11-06T22:12:28Z), with exact code and author-test patches. Original author/source code is not a host deployment receipt. One issuer family contributes zero independent replications here.

## SOURCE_VERIFICATION_RECORDS
### SRC-20261107-A2-01 — session-terminated conditional retry
https://github.com/google/adk-python/commit/10711d0532373f526a4438c8c0bcb93c4e81419c
Source src/google/adk/tools/mcp_tool/mcp_tool.py specifically catches _is_session_terminated_error, discards prior pooled session and attempts one call on a new session; all other exceptions are re-raised. The code comment assumes server session rejection happened before effect, but that assumption was not independently verified for every transport/proxy implementation.
Authored test tests/unittests/tools/mcp_tool/test_mcp_tool.py covers success on fresh mock and bounded repeated rejection; NOT_RUN on this producer.

### SRC-20261107-A2-02 — waiting-run replay identity gate
https://github.com/google/adk-python/commit/ba142cf8e91b045aa0b435f71dbd7c3e686efa45
Source src/google/adk/workflow/utils/_replay_interceptor.py distinguishes non-agent waiting nodes from BaseAgent or rerun_on_resume branches. A static wait_for_output node with previous no-output waiting state can be fast-forwarded, while a dynamic run or explicit rerun case has separate conditions.
Official guide docs/guides/workflow/base_node/index.md warns that an incorrectly configured node may remain WAITING and silently skip successors. Authored tests in test_workflow_hitl.py and test_replay_interceptor.py are source-level, not independent executions.

## RISK_CLASSIFICATION
### SIG-20261107-A01
Evidence Class: EXTERNAL_RISK_CLASS / SOURCE_CODE_DIFF_SUPPORTED.
Risk: a session-terminated error might be treated as pre-effect rejection; lost response after side effect must remain a different history class with possible duplicate replay.
External Risk: SOURCE_LEVEL_SUPPORT, no measured production incidence.
Local Incident: NO_LOCAL_EVIDENCE, not LOCAL_INCIDENT.
Existing Defense: GOOGLE_ADK_COMMITTED_GUARD / ZERO_LOCAL_DEPLOYMENT_UNKNOWN.
Measured Effectiveness: NOT_MEASURED; authored tests NOT_EXECUTED.
Counterevidence: a committed non-idempotent effect followed by lost reply invalidates unconditional retry; the patch does NOT authorize retries for arbitrary errors.
Applicability: UNKNOWN / ZERO_HOST_KERNEL_NOT_AUDITED.
Next Retest: fixed server+SDK revisions; distinguish rejection-before-dispatch from response-loss-after-effect with authoritative sink receipts, call identity, session ID and exact retry count.

### SIG-20261107-A02
Evidence Class: EXTERNAL_RISK_CLASS / SOURCE_CODE_DIFF_SUPPORTED.
Risk: resume replays prior waiting input or suppresses an intended waiting-agent re-execution without matching trigger/run identity.
External Risk: SOURCE_LEVEL_SUPPORT.
Local Incident: NO_LOCAL_EVIDENCE.
Existing Defense: ADK_REPLAY_BRANCH_LOGIC_ONLY / ZERO_LOCAL_RUNTIME_UNVERIFIED.
Measured Effectiveness: NOT_MEASURED.
Counterevidence: BaseAgent waiting for new user input and explicit rerun_on_resume are valid exceptions; dynamic no-outcome paths differ from static runs, so unconditional skip is itself unsafe.
Applicability: UNKNOWN.
Next Retest: pin persisted run ID, trigger sequence, static/dynamic identity, user-input waiting-agent exception and side-effect receipt; compare before/after code in controlled replay.

## ORIENTATION_NOTES
- NEW_EVIDENCE: exact function and branch predicates reopened from both original commits, including authored negative and exception cases; source family remains one.
- CORRECTED_INTERPRETATION: retry eligibility and replay eligibility are separate checks from current task authorization, historical effect occurrence and current completion.
- UNCHANGED_BOUNDARY: upstream code fix is not Zero local incident, local defense, deployed version, successful execution or measured mitigation effectiveness.
- NEW_COUNTEREVIDENCE: lost-response-after-effect defeats generic retry; waiting BaseAgent and explicitly rerun-enabled nodes defeat generic suppress-all-waiting-replay.
- UNKNOWN_RETAINED: server error classification authority, SDK version/deployment, Zero local issue, history of effect, exact current completion postcondition and empirical failure rates.
- NEXT_RETEST_CONDITION: independent pinned execution under fault injection, with before/after side-effect receipts and the authorized retry/replay condition.

## NO_DECISION_SECTION
Decision: NO_DECISION / NO_NEW_HOST_DOCTRINE.
Do not change Zero Kernel, Ballast, active storage/hash chain, Aegis weekly/monthly protocol, NEXUS or scheduler based on external first-party source alone.

## NEXT_HANDOFF
- A3 may use two mechanism candidates from one ADK publisher lineage when ISO W45 closes; this does not add two independent publishers, local incidents or experiment windows.
- Retest only if a live server/session or fixed replay harness can produce authoritative effect receipts. Keep local applicability UNKNOWN until a separate local audit.

## BOUNDARY_CHECK
- Same-day A2 proposal follows merged A1. Only a new A2 canonical research record; no history rewrite, host state, Ballast, Actions or maintenance write.
- Google authored tests inspected but NOT_EXECUTED; no native ADK/Zero runtime PASS or local incident assertion.
- Boundary Violation: NO
