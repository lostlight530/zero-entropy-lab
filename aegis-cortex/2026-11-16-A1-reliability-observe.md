# A1 Daily Reliability Observe — 2026-11-16

## CORTEX_RUN_HEADER
Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A1
Canonical Identity: zero/aegis/A1
Cadence: Daily
Loop Stage: Observe
Logical Date: 2026-11-16
Logical Timezone: Asia/Shanghai
Agent: GPT-6 / GPT_NATIVE / HUMAN_REQUESTED / NOT_JULES_REPLAY
Record Provenance: HUMAN_AUTHORIZED_SUBSTITUTE
Base Main SHA: 3b960f5106873d335ccc4b56efc46e737adef943
Run Identity: zero-entropy-lab/aegis/A1/2026-11-16/GPT_NATIVE/3b960f5106873d335ccc4b56efc46e737adef943/adk-unsampled-inference-duration-attribution-01
Evidence Class: EXTERNAL_RISK_CLASS / TELEMETRY_MEASUREMENT_AND_EFFECT_ATTRIBUTION
Source Identity: google/adk-python@8d857f47d1da9b88398a4a6019115417b93a53f9
Source Authority For Claim: FIRST_PARTY_COMMIT_DIFF_AND_AUTHORED_REGRESSION_TEST_SOURCE
Independent Verification: EXACT_SOURCE_DIFF_AND_TEST_FIXTURE_READ / NO_RUNTIME_EXECUTION
External Evidence: PINNED_UPSTREAM_FIX_AND_REGRESSION_TEST / AUTHOR_ASSERTION_ONLY
Local Incident Evidence: UNKNOWN / NO_ZERO_METRIC_OR_INCIDENT_RECEIPT
Existing Defense: UNKNOWN / LOCAL_TELEMETRY_PATH_NOT_EXECUTED_OR_VERSION_PINNED
Measured Effectiveness: NOT_COMPUTED
Host Applicability: UNKNOWN / ZERO_DEPENDENCY_AND_TELEMETRY_INSTRUMENTATION_NOT_PROBED
Original Execution Status: GPT_NATIVE_BOUNDED_EXTERNAL_FAILURE_MODEL_INSPECTION / TESTS_NOT_EXECUTED
Current Path Status: PROPOSED_DRAFT_PR / NOT_MERGED
Task Status: SUCCESS_BOUNDED_EXTERNAL_SOURCE_INSPECTION / LOCAL_EFFECT_UNKNOWN
Uncertainty: INSTALLED_RELEASE_VERSION_UNKNOWN / AUTHOR_TEST_NOT_RUN / ZERO_HOST_METRIC_CONFIG_UNKNOWN
Write Scope: aegis-cortex/2026-11-16-A1-reliability-observe.md
Host Kernel Modification: NO
Boundary Violation: NO

## INPUT_RECORD
- Cold start from exact current Zero `main@3b960f5106873d335ccc4b56efc46e737adef943`; read `aegis-cortex/EVIDENCE_POLICY.md`, 2026-11-15 Native A1/A2, W45 A3, and the separate W46 A3 Draft #880. No Nov 16 Native A1 on main at preflight.
- The previous day's external risk concerned shared ModelArmor client lifetime. This candidate concerns **latency metric attribution under an unsampled span**. These two Google ADK source observations are different mechanisms, not independent reproductions of one alleged Zero incident.
- An upstream commit from 2026-11-13T16:42:38Z is **first inspected by this producer on 2026-11-16**; it must not be called a new Nov16 release. Candidate source revision and original date are preserved.
- Direct GitHub commit inspection: `src/google/adk/telemetry/_instrumentation.py`, `src/google/adk/telemetry/_metrics.py`, and authored `tests/unittests/telemetry/test_instrumentation.py` changed. No Python import, ADK suite, external RPC, actual telemetry pipeline or local kernel process ran.
- Direct local complete-checkout acquisition remains unavailable (GitHub HTTPS DNS resolution failure); GitHub API source inspection is not native execution.

## EXTERNAL_SOURCE_RECORDS
Source ID: SRC-20261116-A01
Title: fix(telemetry): exclude tool runtime from model call duration without a recorded span
Publisher: google/adk-python upstream repository
Canonical Source Identity: google/adk-python@8d857f47d1da9b88398a4a6019115417b93a53f9
URL: https://github.com/google/adk-python/commit/8d857f47d1da9b88398a4a6019115417b93a53f9
Publication/Commit Date: 2026-11-13T16:42:38Z
Date Checked: 2026-11-16 Asia/Shanghai
Evidence Tier: PINNED_PRIMARY_IMPLEMENTATION_PATCH_PLUS_AUTHORED_TEST_SOURCE / NOT_REPRODUCED
Access Status: EXACT_GITHUB_COMMIT_PATCH_READ
Source Lineage Count: ONE_UPSTREAM_REPOSITORY / NO_INDEPENDENT_EVALUATOR
External Evidence: The prior fallback `get_elapsed_s(...)` with no recorded span used a monotonic clock at telemetry teardown, which can run after tool execution triggered by the model; the patch stores `InferenceScope.ended_at` at the model's finish reason and uses it as fallback_end.
Author Regression: The new `test_operation_duration_excludes_the_tool_if_span_is_sampled_out` configures ALWAYS_OFF tracing, an async tool waiting 0.2 s, and asserts reported `gen_ai.client.operation.duration` is less than that tool delay. This is authored test source, not an executed result in this study.
Claim Supported: Within the changed Google ADK code, a sampled-out/missing recorded inference span had a fallback duration end-point that could include subsequent tool time; the new path narrows the end-point to the finish reason when observed.
Claim Not Supported: Any observed Zero-host latency distortion, any proven real-world metric magnitude, any released version adoption, zero future overcounting, complete accounting for failed inference or all other telemetry consumers.
Confidence: HIGH_FOR_COMMIT_DIFF_AND_CONDITIONAL_FAILURE_MODEL / UNKNOWN_FOR_RUNTIME_FREQUENCY_AND_MITIGATION_EFFECTIVENESS
Uncertainty: The exact Zero dependency graph, telemetry sampling, runtime branch, actual measured improvement and upstream release integration were not evaluated.

## RAW_RELIABILITY_SIGNAL_LOG
Signal ID: RISK-20261116-A01
Failure Model: METRIC_END_BOUNDARY_DRIFT_WHEN_UNRECORDED_TRACE_FALLBACK_SPANS_MODEL_PLUS_TOOL
Trigger: A model's response reaches finish reason, then a tool executes before the telemetry context tears down; the inference span is sampled out or absent, causing the pre-patch fallback to use a later monotonic end.
Failure Surface: `gen_ai.client.operation.duration` overattributes tool-side elapsed time to model-side execution, corrupting performance measurement and any decision that treats the metric as a pure model-duration observation.
Mechanism-Level Distinction: Metric measurement is not the underlying model/tool effect; a wrong duration neither proves an external action occurred nor changes its original side-effect identity.
Existing Defense: Upstream proposed change at pinned commit sets a separate finish-reason clock and passes `fallback_end`; Zero's Existing Defense is UNKNOWN. Correctly recorded tracing spans with explicit end time are a negative-control path not requiring this fallback.
Counterevidence: If the span is recorded with valid timestamps, the fallback path is not exercised; if no finish reason arrives, the code may still use current time and the claimed isolation is weaker. Tool execution need not occur after a finish reason in every request. An authored assertion on one test fixture does not show production latency distribution effects.
Local Incident Evidence: UNKNOWN. No instrumented Zero request, Prometheus/OTel export receipt, tool invocation receipt, or local counterexample was observed.
Measured Effectiveness: NOT_COMPUTED. No sampled-out and recorded-span paired measurement was executed by this producer.
Host Applicability: UNKNOWN. The existence of Aegis and Zero kernel does not establish that this particular ADK telemetry path is installed or active.
Classification: EXTERNAL_RISK_CONDITIONAL / NOT_LOCAL_INCIDENT / NO_LOCAL_DEFENSE_VERDICT.
Next Retest: Pin two Google ADK revisions (before/after patch), execute paired model response plus slow tool with unsampled and recorded tracing as controls, capture monotonic model finish, tool start/end, reported metric, stdout/stderr/exit and exact environment; separately inspect Zero dependency before claiming local applicability.

## EVIDENCE_DELTA
- NEW_EVIDENCE: pinned commit with exact end-timestamp change and a named negative-control opportunity under sampled-out telemetry.
- CORRECTED_INTERPRETATION: numeric instrumentation accuracy != tool-effect integrity and author's regression fixture != our measured effectiveness.
- UNCHANGED_BOUNDARY: EXTERNAL_RISK != LOCAL_INCIDENT != EXISTING_DEFENSE != MEASURED_EFFECTIVENESS.
- NEW_COUNTEREVIDENCE: correctly timestamped sampled-in spans and no-finish-reason failures limit an across-the-board duration assertion.
- UNKNOWN_RETAINED: Zero metrics deployment, actual latency error distribution, release version, test pass, transport/auth side effects and defense effectiveness.
- NEXT_RETEST_CONDITION: exact paired trace sampled-in/out test on pinned revisions plus local host dependency and exported metric receipts.

## NEXT_HANDOFF
- Native `zero/aegis/A2` for 2026-11-16 is `BLOCKED_DEPENDENCY` until the exact original A1 Draft merges, appears on current main and is re-read with blob SHA. Its permitted review is conditional counterevidence and Zero applicability, not an automatic Kernel change.
- Independent monthly maintenance A1/A2 are different identities and receive zero execution credit. Closed W46 A3 Draft #880 is not this Daily A1. November A5/A6 are NOT_DUE until natural calendar closure.

## BOUNDARY_CHECK
- Only this Native A1 dated file; no change to kernel, Ballast, historical Aegis/Jules files, independent maintenance, protocol, workflows, storage or governance.
- Current-run GitHub source/diff read: PERFORMED. Native Aegis structural `check.py`, upstream ADK tests and Zero kernel metrics experiment: NOT_EXECUTED. Static section+field verification only, no checker PASS.
- Human Maintainer approval and merge pending; A2 not credited.
