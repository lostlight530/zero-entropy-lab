# A2 Daily Doctrine Orient — 2026-11-16

## CORTEX_RUN_HEADER
Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A2
Canonical Identity: zero/aegis/A2
Cadence: Daily
Loop Stage: Orient
Logical Date: 2026-11-16
Logical Timezone: Asia/Shanghai
Agent: GPT-6 / GPT_NATIVE / HUMAN_REQUESTED / NOT_JULES_REPLAY
Record Provenance: HUMAN_AUTHORIZED_SUBSTITUTE
Base Main SHA: c7aee9722edee7cb75e04604b8279ef4190e9de8
Run Identity: zero-entropy-lab/aegis/A2/2026-11-16/GPT_NATIVE/c7aee9722edee7cb75e04604b8279ef4190e9de8/unsampled-telemetry-end-boundary-counterevidence-01
Evidence Class: EXTERNAL_RISK_CLASS / INSTRUMENTATION_TIME_ATTRIBUTION
Source Identity: google/adk-python@8d857f47d1da9b88398a4a6019115417b93a53f9
Source Authority For Claim: EXACT_FIRST_PARTY_COMMIT_DIFF_AND_AUTHORED_TEST_SOURCE
Independent Verification: SOURCE_PATCH_FRESH_RECHECK / NO_INDEPENDENT_RUNTIME_EXECUTION
Local Incident Evidence: UNKNOWN / NO_ZERO_HOST_LATENCY_METRIC_EVENT_CHECKED
Local Evidence: NONE_OBSERVED / NO_ZERO_INSTRUMENTED_TRACE_OR_INSTALLED_DEPENDENCY_INSPECTED
Local Applicability: UNKNOWN / ZERO_INSTALLED_ADK_AND_TRACE_CONFIG_NOT_VERIFIED
Host Applicability: UNKNOWN / NO_LOCAL_METRIC_RUN
Original Execution Status: GPT_NATIVE_SOURCE_ORIENTATION_ONLY / EXTERNAL_RUNTIME_NOT_EXECUTED
Current Path Status: PROPOSED_DRAFT_PR / NOT_MERGED
Task Status: BOUNDED_EXTERNAL_RISK_ORIENTATION / NO_LOCAL_DOCTRINE_DECISION
External Risk: SOURCE_SUPPORTED_CONDITIONAL_METRIC_OVERATTRIBUTION
Existing Defense: UNKNOWN_FOR_ZERO / UPSTREAM_PATCH_NOT_TESTED
Measured Effectiveness: NOT_COMPUTED
Remaining Uncertainty: INSTALLED_DEPENDENCY / SAMPLING / EXACT_EXPORT / RELEASE_VERSION / MEASURED_IMPACT
Write Scope: aegis-cortex/2026-11-16-A2-doctrine-orient.md
Host Kernel Modification: NO
Boundary Violation: NO

## INPUT_RECORD
- Fresh merged `main@c7aee9722edee7cb75e04604b8279ef4190e9de8`, same-day original `aegis-cortex/2026-11-16-A1-reliability-observe.md` Git blob `295a9172e758fc83d0c3a039c71da16a1fa15b25`, merged in [PR #881](https://github.com/lostlight530/zero-entropy-lab/pull/881), read after human-authorized merge.
- Same-day A1 source is `google/adk-python@8d857f47d1da9b88398a4a6019115417b93a53f9`, committed 2026-11-13T16:42:38Z, first researched here Nov16. A2 source reinspection remains **one upstream lineage**, not a second independently verified measurement.
- Read `aegis-cortex/EVIDENCE_POLICY.md` and closed W46 A3 original on main; Nov16 is not part of W46. No historical records or local host implementation is altered.
- Rechecked source diff `_metrics.get_elapsed_s(..., fallback_start, fallback_end=None)` and `InferenceScope.ended_at`, plus source-authored `test_operation_duration_excludes_the_tool_if_span_is_sampled_out`. Author test source is not a run receipt.
- No Zero SDK dependency, telemetry collector, native Aegis checker, source regression suite or production tool effect was executed by this A2.

## RISK_CLASSIFICATION
External Risk: CONDITIONAL_INFERENCE_DURATION_MISATTRIBUTION_WHEN_SPAN_IS_UNRECORDED
External Claim: pre-patch `gen_ai.client.operation.duration` fallback can time until telemetry teardown after a model-requested tool runs; source fix records a finish-reason timestamp and passes it as fallback_end. That is a pinned implementation observation, not our measured latency experiment.
Affected Preconditions: a model finish reason arrives; later tool work runs before telemetry teardown; recorded span timestamps are absent or unusable; affected revision uses late fallback.
Failure Denominator: affected sampled-out inference metric events in this SDK branch; NOT every model, tool, agent, failure or latency report.
Counterevidence 1: if a span already records valid start/end timestamps, the fallback is not the measurement path, so this specific overcount is excluded.
Counterevidence 2: if there is no subsequent tool work, late teardown may have no material tool-time overcount. Not every model request invokes tools.
Counterevidence 3: if the response never reaches a finish reason, `ended_at` can remain None; even patched fallback may use current time, so global accuracy is not established.
Counterevidence 4: a synthetic test asserting duration under a 0.2-second slow tool is source-authored fixture design, not measured effectiveness in Zero.
Local Incident Evidence: UNKNOWN. There is no observed local Zero request, latency metric export, sampler configuration, SDK version, side effect or incident record.
Local Evidence: ZERO_RUNTIME_NOT_INSPECTED; SOURCE_ONLY.
Existing Defense: UNKNOWN for Zero. Upstream patch is an implementation correction in another repository, not proof of Zero mitigation.
Measured Effectiveness: NOT_COMPUTED / NO_PAIRED_BEFORE_AFTER_MEASUREMENT.
Local Applicability: UNKNOWN pending actual `src/kernel` dependency and deployed telemetry path.

## ORIENTATION_NOTES
- Distinguish source model-finish timestamp, tool start/end, telemetry finalization and metric export: measuring a broader interval can corrupt analysis but does not directly prove tool authorization, effect occurrence or correction.
- Do not create a Zero Host Kernel incident or security defect from the external first-party code diff; don't infer immunity from absence of local evidence either.
- AEGIS failure class: MEASUREMENT_SEMANTICS_DRIFT, NOT automatically UNAUTHORIZED_EFFECT or FAILED_TASK_COMPLETION.
- A defensible test uses matched pre/post ADK revision, two regimes (sampled-in with valid span and sampled-out), controlled async slow tool and a no-finish-reason branch. Capture revision, input, command, environment, token IDs, start/finish/tool timestamps, exported metric, stdout/stderr/exit and effect receipt.
- Negative-control measurement must not reuse the same test result as independent evidence; producer source tests and local replications have separate run identities.

## NO_DECISION_SECTION
Decision: NO_DECISION
Doctrine Promotion: NO / LOCAL_HOST_EVIDENCE_GATE_NOT_MET
Reason: Conditional external risk remains supported, but Zero installed dependency, local incident, existing defense and measured effectiveness are UNKNOWN.
Host Action: NONE / NO_KERNEL_CHANGE / NO_FALSE_SAFETY_CLAIM.

## EVIDENCE_DELTA
- NEW_EVIDENCE: bounded source-endpoint and fallback-path counterconditions were checked with explicit false-positive controls.
- CORRECTED_INTERPRETATION: incorrect inference duration != failed authorization/effect or a local Zero incident.
- UNCHANGED_BOUNDARY: EXTERNAL_RISK != LOCAL_INCIDENT != EXISTING_DEFENSE != MEASURED_EFFECTIVENESS.
- NEW_COUNTEREVIDENCE: correct recorded span, absent later tool work, or missing finish reason invalidate categorical patch effectiveness.
- UNKNOWN_RETAINED: installed version, sampler, exporter, actual numerical error, kernel defense and effect receipt.
- NEXT_RETEST_CONDITION: pin two code revisions and actual Zero dependency/telemetry path, execute paired reproducible fixtures with stdout/stderr/exit and per-request duration attribution.

## NEXT_HANDOFF
- W46 A3 `DEC-2026W46-A3-01` is already on merged main and its A4 is a separate weekly dependency; Nov16 A2 cannot be inserted into closed W46.
- November A5/A6 NOT_DUE. This source review creates no Host Kernel implementation authority.

## BOUNDARY_CHECK
- New native A2 only. Original A1, Jules history, Ballast, Zero Host Kernel, maintenance A1/A2, periodic audits, workflows, storage and long-lived Aegis doctrine untouched.
- GitHub source and main file reads: PERFORMED. Actual native Aegis checker and upstream tests: NOT_EXECUTED (verified Git HTTPS DNS acquisition exit128 in separate later probe); no runtime PASS claimed.
- Draft PR for human-requested merge; no backdated source or fabricated measured outcome.
