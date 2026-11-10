# A2 Daily Aegis Doctrine Orient — 2026-11-10

## CORTEX_RUN_HEADER
Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A2
Canonical Identity: zero/aegis/A2
Cadence: Daily
Loop Stage: Orient
Logical Date: 2026-11-10
Logical Timezone: Asia/Shanghai
Agent: GPT-6 / GPT_NATIVE / NOT_JULES_REPLAY
Producer Identity: HUMAN_REQUESTED_GPT_NATIVE
Record Provenance: HUMAN_AUTHORIZED_SUBSTITUTE
Base Main SHA: 4d6c6cf5d619c29a2b0ef31d9d00f78273377844
Run Identity: zero-entropy-lab/aegis/A2/2026-11-10/GPT_NATIVE/4d6c6cf5d619c29a2b0ef31d9d00f78273377844/adk-connector-operation-counterexamples-01
Upstream A1: aegis-cortex/2026-11-10-A1-reliability-observe.md
Upstream A1 Blob SHA: 27e1e35e488804f673b1ad465f576d89c9f38190
Upstream A1 PR: https://github.com/lostlight530/zero-entropy-lab/pull/840
Input Status: SAME_DATE_A1_MERGED_MAIN_VISIBLE / EXACT_BLOB_READ
Evidence Class: EXTERNAL_RISK_CLASS / CONNECTOR_SCHEMA_OPERATION_TERMINAL_ERROR_AND_TIMEOUT
Source Identity: google/adk-python@ab638443816b425787dbb6b2fd835cdf03bbcbef
Source Authority For Claim: FIRST_PARTY_ORIGINAL_IMPLEMENTATION_PATCH_AND_AUTHORED_TEST_SOURCE
Independent Verification: EXACT_SOURCE_DIFF_AND_TEST_FIXTURE_REVIEW / NO_INDEPENDENT_RUNTIME_REPLAY
Local Incident Evidence: NONE_ATTESTED / NOT_A_ZERO_LOCAL_FAILURE
Local Applicability: UNKNOWN / LOCAL_DEPENDENCY_AND_CONNECTOR_PATH_NOT_VERIFIED
Remaining Uncertainty: UPSTREAM_TEST_RESULTS_RUNTIME_TOTAL_DEADLINE_BACKEND_STATE_RETRY_POLICY_LOCAL_DEFENSE_UNKNOWN
Original Execution Status: GPT_NATIVE_NOV10_HUMAN_AUTHORIZED_A2_ORIENTATION / NOT_JULES
Current Path Status: PROPOSED_DRAFT_PR / MERGE_PENDING_AT_AUTHORING
Source Status: ORIGINAL_COMMIT_AND_TEST_PATCH_INSPECTED / NO_UPSTREAM_EXECUTABLE_TEST_RECEIPT
Network Status: GITHUB_ORIGINAL_SOURCE_DIFF_READ
Task Status: SOURCE_BOUNDED_RELIABILITY_ORIENTATION / NO_HOST_INCIDENT_OR_DOCTRINE
Host Applicability: UNKNOWN
Write Scope: aegis-cortex/2026-11-10-A2-doctrine-orient.md
Boundary Violation: NO

## INPUT_RECORD
- Cold-started Zero from merged main `4d6c6cf5d619c29a2b0ef31d9d00f78273377844`, after A1 PR #840 merged; read the canonical A1 blob `27e1e35e488804f673b1ad465f576d89c9f38190` from that main revision.
- A1's exact Google ADK 2026-11-10T01:13:25Z original commit and authored tests describe two previously mishandled connector schema-operation outcomes: a completed error response and indefinite nonterminal polling.
- Current `aegis-cortex/EVIDENCE_POLICY.md`, Nov09 A2, closed W45 A3/A4 and separate host/research surfaces were used to calibrate this review. W46 OPEN; November A5/A6 final NOT_DUE.
- This A2 did not run ADK Python, Zero Host Kernel, a real Google connector, provider APIs, retry workers or a memory store. Same-source reinspection is **not independent corroboration**.

## SOURCE_VERIFICATION_RECORDS
### SRC-20261110-A2-01 — terminal operation is not a successful schema
- Original first-party patch: https://github.com/google/adk-python/commit/ab638443816b425787dbb6b2fd835cdf03bbcbef, changed `src/google/adk/tools/application_integration_tool/clients/connections_client.py`.
- The code loops on `_poll_operation(operation_id)`, reads the operation JSON and sets `operation_done = bool(operation_response.get("done", False))`. After a completed poll, the new source checks `error = operation_response.get("error")` and raises `ValueError` when non-null instead of returning a completion object that lacks a usable schema.
- The authored test supplies `{"done":true,"error":{"code":5,"message":"Entity type 'entity1' not found."}}` and expects `ValueError`. It is a directly inspected regression-test design, not an executed test result for this A2.
- Classification: `TERMINAL_ERROR_AS_EMPTY_SCHEMA` is an **external** failure mechanism. An empty tool list can be a downstream symptom of an upstream failed schema operation; a failed operation must not be collapsed into a valid negative schema lookup.
- Bounded result: source-level intended fail-closed error propagation, without demonstrating what any Zero-local wrapper or production registry observes.

### SRC-20261110-A2-02 — a 300-second polling policy is not an end-to-end effect deadline
- Same Google commit/source lineage; no independent new paper, vendor reproduction or local incident.
- Patch introduces `_DEFAULT_OPERATION_TIMEOUT_SECONDS = 300` and `deadline = time.monotonic() + 300`; after `done=false` the loop checks `time.monotonic() >= deadline` and raises `TimeoutError`, otherwise `time.sleep(1)` before retry.
- The authored timeout fixture patches monotonic clock values `[0,1,301]` and checks a timeout after a pending response. These are test **source** assertions; not actual elapsed wall time observed by this A2.
- Countercase 1: a blocking `_execute_api_call()` takes longer than 300 s. The deadline check runs **after** the API call returns, not during it; the code does not establish a hard wall-time bound on the entire request.
- Countercase 2: operation returns `done=true` after the deadline. The pending-state timeout check is skipped for terminal state, so this particular loop does not prove elapsed time never exceeds 300 s.
- Countercase 3: `done=true` with a legitimate `response` is a valid completion of the *schema lookup*, not proof that any later tool action was executed. Operation status, schema validity, declared tool availability and authoritative external effect are separate layers.
- Countercase 4: network parsing/credential exceptions and early lookup errors have separate exception classes and retry boundaries. A generic `ValueError` here is not a universal policy for backoff or effect idempotency.
- Countercase 5: if the host uses a different SDK revision, connector implementation or direct tool adapter, the newly inspected upstream predicate may not apply. `SOURCE_PATCH_PRESENT != HOST_DEFENSE_DEPLOYED`.

## RISK_CLASSIFICATION
Signal ID: SIG-20261110-A01
External Risk: SUPPORTED_BY_FIRST_PARTY_CODE_CHANGE / ASYNC_OPERATION_TERMINAL_ERROR_MISCLASSIFICATION / NONTERMINATING_POLL
External Claim: SPECIFIC_GOOGLE_ADK_CONNECTIONSCLIENT_CHANGE / NOT_UNIVERSAL_TOOL_API
Local Incident: NO_LOCAL_INCIDENT_EVIDENCE / NOT_CLAIMED
Local Evidence: NO_ZERO_HOST_CONNECTOR_EXECUTION_OR_INSTALLED_SDK_VERSION_ATTESTED
Local Incident Evidence: NONE_ATTESTED / UNKNOWN_LOCAL_EXPOSURE
Existing Defense: UNKNOWN / NOT_INSPECTED_FOR_THIS_PATH
Measured Effectiveness: NOT_COMPUTED
Validated External Outcome: NOT_EXECUTED_BY_AEGIS
Local Applicability: UNKNOWN / EXACT_DEPENDENCY_AND_TOOL_ROUTE_NOT_VERIFIED
Source Count: ONE_GOOGLE_ADK_IMPLEMENTATION_LINEAGE / TEST_CODE_NOT_INDEPENDENT_RUNTIME_EVIDENCE

## COUNTEREVIDENCE_GATE
- Reject `done=true == successful schema`: terminal `error` is an explicitly returned failure.
- Reject `timeout configured == total action duration bounded`: synchronous/network blocking and the terminal branch can exceed the nominal deadline. A robust test needs monotonic and wall-clock receipts at each call boundary.
- Reject `no tools returned == authoritative no-tools fact`: distinguish valid empty schema, operation failure, access denied and schema/version lookup errors.
- Reject `ADK source patch == Zero Host Kernel incident`: the installed dependency, call path and local outcome have not been established.
- Reject `authored tests == measured effective defense`: no exact-version runtime, timing or final external effect receipts executed.
- Promotion Gate: keep separate `(schema_request_id, operation_id, poll_attempt, HTTP_result, operation_done, operation_error, schema_revision, deadline_receipt, tool_catalog_result, effect_id, final_effect_receipt)`.

## ORIENTATION_NOTES
- Research-only test matrix for a pinned ADK version: immediate successful schema, `done=true/error`, consecutive `done=false`, slow in-flight request, `done=true` after nominal deadline, bad JSON, timeout and transient provider errors. Compare emitted exception, retry decision, final tool catalog and elapsed time under a real clock and controlled clock.
- A timed-out schema operation is not necessarily cancelled server-side; if server-side work can outlive client polling, mark authoritative final state UNKNOWN until separately observed. No induced server cancel or rollback was measured.
- Reliability controls must be evaluated at both admission time and effect completion, not by a single future-success expectation or empty-result heuristic.

## NO_DECISION_SECTION
Decision: NO_DOCTRINE_PROMOTION / WATCHLIST_ONLY
Reason: external fail-closed behavior appears well motivated, but there is no Zero-local installed-version, incident, effect receipt or measured defense efficiency.
Host Kernel Modification: NO
Aegis Memory Promotion: NO
GitHub Actions Change: NO
Expected Risk Reduction: NOT_MEASURED

## EVIDENCE_DELTA
- NEW_EVIDENCE: exact patch reasoning separates terminal-error handling from monotonic bounded wait, and scopes the authored negative regression fixtures.
- CORRECTED_INTERPRETATION: a failed asynchronous schema lookup must not become trustworthy absence of a tool; operation-level polling timeout is not by itself an end-to-end task timeout.
- UNCHANGED_BOUNDARY: EXTERNAL_PATCH != ZERO_LOCAL_INCIDENT; CONFIGURED_TIMEOUT != WALL_TIME_GUARANTEE; SCHEMA_LOOKUP_RESULT != EFFECT_RECEIPT; AUTHOR_TEST != EXECUTED_PASS.
- NEW_COUNTEREVIDENCE: blocking network call, terminal completion after elapsed deadline and alternative integration paths defeat any universal claim that a 300-second setting eliminates stuck or incorrect effects.
- UNKNOWN_RETAINED: actual upstream test results, SDK release version, Zero dependency path, local incident or nonincident frequency, server cancellation, retry idempotency and measured reliability outcome.
- NEXT_RETEST_CONDITION: pin before/after ADK source, execute stubbed LRO server with terminal error, empty valid schema, transient delay, hung network, slow late success and cancellation; measure per-request and total deadline with stdout/stderr/exit and true final effect/registry state.

## NEXT_HANDOFF
- W46 A3 may aggregate the original single issuer source lineage after the week is naturally closed; W45 cannot inherit Nov10 retroactively.
- No Host Kernel, Ballast, NEXUS, broader Aegis Memory or protocol adoption authorized by this A2. Retain counterexample gate as OPEN.

## BOUNDARY_CHECK
- Only `aegis-cortex/2026-11-10-A2-doctrine-orient.md` proposed, without modifying A1, prior Jules history, active host kernel, SQLite/JSONL, Ballast, NEXUS, Actions, maintenance or governance controls.
- ADK authored tests: NOT_EXECUTED; Zero host effect validation: NOT_EXECUTED; local defense effectiveness: NOT_COMPUTED. Repository structural checker to be run under its own identity.
- No private producer prompts or hidden reasoning published. Boundary Violation: NO
