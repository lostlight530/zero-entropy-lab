# A1 Daily Reliability Observe — 2026-11-07

## CORTEX_RUN_HEADER
Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A1
Canonical Identity: zero/aegis/A1
Cadence: Daily
Loop Stage: Observe
Logical Date: 2026-11-07
Logical Timezone: Asia/Shanghai
Agent: GPT-6 / GPT_NATIVE / NOT_JULES_REPLAY
Producer Identity: HUMAN_REQUESTED_GPT_NATIVE
Record Provenance: HUMAN_AUTHORIZED_SUBSTITUTE
Base Main SHA: f7006d3b98440f61ba7095bf24a1885320cf5ff5
Run Identity: zero-entropy-lab/aegis/A1/2026-11-07/GPT_NATIVE/f7006d3b98440f61ba7095bf24a1885320cf5ff5/a1-source-01
Evidence Class: EXTERNAL_RISK / UPSTREAM_STATIC_CODE_AND_TESTS
Source Identity: google/adk-python@10711d0532373f526a4438c8c0bcb93c4e81419c + google/adk-python@ba142cf8e91b045aa0b435f71dbd7c3e686efa45
Source Authority For Claim: FIRST_PARTY_IMPLEMENTATION_AND_AUTHORED_TEST_PATCHES
Independent Verification: TWO_DISTINCT_COMMITS_SAME_ADK_LINEAGE / NO_NATIVE_RUNTIME_REPLAY
Local Incident Evidence: NO_LOCAL_INCIDENT_OBSERVED_OR_ATTESTED
Host Applicability: UNKNOWN / ZERO_HOST_KERNEL_NOT_AUDITED
Original Execution Status: GPT_NATIVE_BOUNDED_EXTERNAL_SOURCE_OBSERVATION
Current Path Status: DRAFT_PR_PROPOSED_NOT_MERGED
Task Status: SUCCESS_BOUNDED_EXTERNAL_RISK_STUDY
Write Scope: aegis-cortex/2026-11-07-A1-reliability-observe.md
Boundary Violation: NO

## INPUT_RECORD
- Fresh current main SHA `f7006d3b98440f61ba7095bf24a1885320cf5ff5`, existing canonical A1/A2 2026-11-06 and closed W44/October records read or inventoried. Prior A1 studied in-memory copy aliasing and SQLite lock wait; those are not counted as this date's new risks.
- No 2026-11-07 native A1 present on main, and no active same-task PR at the preflight.
- Original Google ADK commits and their source/test patches inspected directly. No Zero Host Kernel, actual MCP server, ADK runtime or persistent local state was executed.
- W45 is not closed on 2026-11-07 Shanghai; November is not closed. Weekly A3/A4 and Monthly A5/A6 are not due; no new host mitigation is authorized by A1.

## EXTERNAL_SOURCE_RECORDS
### SRC-20261107-A01 — stale MCP server session and retry gate
Source ID: SRC-20261107-A01
Title: fix(mcp): retry a tool call once after the server drops the session
Publisher: google/adk-python
URL: https://github.com/google/adk-python/commit/10711d0532373f526a4438c8c0bcb93c4e81419c
Published or Updated Date: 2026-11-06T20:03:38Z / 2026-11-07T04:03:38+08:00
Date Checked: 2026-11-07
Source Type: PRIMARY_SOURCE_CODE_AND_REGRESSION_TEST_DIFF
Evidence Tier: HIGH_FOR_SOURCE_DIFF / NOT_A_TEST_PASS_OR_PRODUCTION_INCIDENCE
Access Status: ORIGINAL_COMMIT_AND_FILE_PATCH_READ
External Claim: `MCPTool` detects a session-terminated error on the pooled tool session, discards it and retries the call at most once on a fresh session.
External Evidence: `src/google/adk/tools/mcp_tool/mcp_tool.py` introduced `_call_tool_on_session` separation and a conditional one-retry path; authored tests record fresh-session success and a bounded failed retry.
Local Repository Evidence: NONE / NO_ZERO_HOST_MCP_SESSION_EXECUTION
Confidence: HIGH_FOR_CODE_INTENT / UNKNOWN_FOR_RUNTIME_FAILURE_RATE
Uncertainty: server-side effect-before-error, network ambiguity, retry idempotency for non-terminated errors, SDK version and local applicability are not established.

### SRC-20261107-A02 — workflow resume and waiting-node duplicate execution
Source ID: SRC-20261107-A02
Title: fix: stop rerunning a waiting wait_for_output node on resume
Publisher: google/adk-python
URL: https://github.com/google/adk-python/commit/ba142cf8e91b045aa0b435f71dbd7c3e686efa45
Published or Updated Date: 2026-11-06T22:12:28Z / 2026-11-07T06:12:28+08:00
Date Checked: 2026-11-07
Source Type: PRIMARY_SOURCE_CODE_DOCS_AND_AUTHORED_TESTS
Evidence Tier: HIGH_FOR_PATCH / EXECUTION_NOT_OBSERVED
Access Status: FIRST_PARTY_COMMIT_AND_SOURCE_PATCH_READ
External Claim: replay interception treats a static `wait_for_output` node waiting for a fresh trigger differently from a waiting agent or a `rerun_on_resume` node; some prior waiting executions should not be repeated on resume.
External Evidence: `src/google/adk/workflow/utils/_replay_interceptor.py` updates `check_interception`, introduces `_reruns_while_waiting`, and adds workflow replay cases under `tests/unittests/workflow`.
Local Repository Evidence: NONE / NO_ZERO_WORKFLOW_REPLAY_TEST
Confidence: HIGH_FOR_COMMITTED_GUARD / NO_PROVEN_EFFECTIVENESS
Uncertainty: actual state persistence, replay input identity and side effects in operational hosts remain unknown.

## RAW_RELIABILITY_SIGNAL_LOG
### SIG-20261107-A01 — SERVER_SESSION_INVALIDATED_BEFORE_TOOL_RESULT
Signal ID: SIG-20261107-A01
Source IDs: SRC-20261107-A01
Failure Model: pooled MCP session may be invalid when a server restarts or expires an idle session, making a tool call fail before the intended result is returned.
External Evidence: first-party explicit session-error conditional catch, new-session retry and bounded max-attempt unit fixtures.
Local Incident Evidence: NOT_OBSERVED / NOT_THE_SAME_AS_ZERO_HOST_INCIDENT
Existing Defense: UPSTREAM_SOURCE_PATCH_PROPOSES_RETRY / ZERO_DEPLOYMENT_UNKNOWN
Measured Effectiveness: NOT_MEASURED / AUTHOR_TEST_SOURCE_NOT_EXECUTED
Counterexample: for a timeout or ambiguous transport failure, the tool may already have committed a side effect; blindly replaying a non-idempotent operation can duplicate it. The upstream code only claims a specific server-rejected session error, not an arbitrary retry guarantee.
Risk Classification: TOOL_RETRY_SEMANTICS / SIDE_EFFECT_IDENTITY / FALSE_COMPLETION
Next Retest: pin an ADK SDK revision and MCP server; distinguish deterministic rejection-before-dispatch from response-lost-after-effect, log call ID, idempotency key, session ID, server effect receipt, timeout and actual retry count.

### SIG-20261107-A02 — REPLAY_OF_WAITING_NODE_WITH_OLD_INPUT
Signal ID: SIG-20261107-A02
Source IDs: SRC-20261107-A02
Failure Model: workflow resumption may rerun a previously waiting node against an input already consumed, duplicating state updates or side effects rather than awaiting the next trigger.
External Evidence: source replay interceptor distinguishes `BaseAgent` and `rerun_on_resume` from a non-agent `wait_for_output` node; authored tests include superseded waiting-run cases.
Local Incident Evidence: NOT_OBSERVED / NO_LOCAL_REPLAY_LOG
Existing Defense: UPSTREAM_COMMITTED_SOURCE_GUARD / ZERO_LOCAL_DEFENSE_UNVERIFIED
Measured Effectiveness: NOT_MEASURED
Counterexample: agents waiting on user input and explicit `rerun_on_resume` nodes are designed to rerun; an unconditional do-not-rerun policy can itself break intended recovery. Dynamic runs with no retained outcome also have separate semantics.
Risk Classification: DURABLE_EXECUTION / REPLAY_CONTEXT / TRIGGER_IDENTITY
Next Retest: pin a workflow revision, persisted replay state, waiting-run ID and trigger ID; inject resumption after 1 of 2 inputs, compare side-effect receipts with a rerun-enabled agent case.

## SOURCE_AND_STATE_CLASSIFICATION
- A01 and A02 are TWO distinct commits but ONE Google ADK source/publisher lineage. They are different failure mechanisms, not two independent replications of one outcome.
- External Risk: SUPPORTED_AS_CODE_CHANGE_AND_HYPOTHESIZED_FAILURE_MODE, not a measured defect rate.
- Local Incident: NO_LOCAL_EVIDENCE; the absence of a local incident audit is NOT proof of absence.
- Existing Defense: issuer patch only; host implementation, deployment and coverage remain UNKNOWN.
- Measured Effectiveness: NOT_EXECUTED / NOT_MEASURED.
- Promotion decision: WATCH_EXTERNAL / NO_NEW_AEGIS_DOCTRINE / NO_HOST_KERNEL_CHANGE.

## EVIDENCE_DELTA
- NEW_EVIDENCE: two primary upstream repair patches expose independent lifecycle questions: session invalidation retry versus workflow waiting-run replay.
- CORRECTED_INTERPRETATION: retry permission requires proof the previous tool invocation did not commit; replay eligibility requires identity of prior trigger/run and semantics of explicit rerun behavior.
- UNCHANGED_BOUNDARY: first-party author tests are neither independent test outcomes nor Zero local incident/defense evidence.
- NEW_COUNTEREVIDENCE: a swallowed-after-effect response defeats unconditional retry safety; automatic rerun of a waiting event can double-count an already stored state update.
- UNKNOWN_RETAINED: production impact, upstream release inclusion, local storage/runtime adoption, idempotency receipts and real tests.
- NEXT_RETEST_CONDITION: controlled server session eviction and waiting-state replay using a pinned SDK, side-effect counter, stable idempotency token, persisted trigger/run identity and captured exit/log evidence.

## NEXT_HANDOFF
- A2 may verify/rebut each of these two risks ONLY when this canonical same-date A1 has merged and is read from current main at its exact blob SHA. Until then `A2=WAITING_FOR_A1_MERGE`.
- A2 should inspect exact before/after failure predicates, server response classification, retry loop bound, and static/dynamic waiting-run branch. No automatic change to Zero Host Kernel or Aegis protocol.
- Cross-repo discussion of the same ADK commit cannot be counted as an independent replication. W45 and November memories are not due.

## BOUNDARY_CHECK
- Only new `aegis-cortex/2026-11-07-A1-reliability-observe.md`; no historical Jules, Ballast, host code, schema, workflow or maintenance mutation.
- Source review performed; ADK native tests and Zero runtime: NOT_EXECUTED. Unmerged PR means A2 dependency remains blocked.
- Boundary Violation: NO
