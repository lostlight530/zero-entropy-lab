# A1 Daily Reliability Observe — 2026-11-17 / incomplete Response usage custody

## CORTEX_RUN_HEADER
Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A1
Canonical Identity: zero/aegis/A1
Cadence: Daily
Loop Stage: Observe
Logical Date: 2026-11-17
Logical Timezone: Asia/Shanghai
Agent: GPT-6 / GPT_NATIVE / HUMAN_REQUESTED / NOT_JULES_REPLAY
Record Provenance: HUMAN_AUTHORIZED_SUBSTITUTE
Base Main SHA: 6ee84de190e7b3f5c38e8d2bd5eaeab91da518dc
Run Identity: zero-entropy-lab/aegis/A1/2026-11-17/GPT_NATIVE/6ee84de190e7b3f5c38e8d2bd5eaeab91da518dc/failed-incomplete-response-usage-custody-01
Evidence Class: EXTERNAL_RISK_CLASS / MODEL_USAGE_ACCOUNTING_AND_RETRY_PROVENANCE
Source Identity: openai/openai-agents-python@6e6707cdcf63c2466f2bc8c6cb026ce3813bdf26
Source Authority For Claim: FIRST_PARTY_PINNED_COMMIT_DIFF_AND_AUTHORED_TEST_SOURCE
Independent Verification: EXACT_GITHUB_COMMIT_AND_CHANGED_TEST_SOURCE_INSPECTED / NO_SDK_RUN
Local Incident Evidence: UNKNOWN / NO_ZERO_SESSION_OR_USAGE_TRACE_OBSERVED
Host Applicability: UNKNOWN / NO_ZERO_OPENAI_AGENTS_SDK_VERSION_OR_DEPLOYED_USAGE_PIPELINE_VERIFIED
Original Execution Status: GPT_NATIVE_SOURCE_REVIEW_PERFORMED / NO_UPSTREAM_OR_ZERO_RUNTIME_EXECUTION
Current Path Status: PROPOSED_DRAFT_PR / NOT_MERGED_AT_AUTHORING
Task Status: SOURCE_BOUNDED_EXTERNAL_RISK / NO_LOCAL_INCIDENT_CLAIM
External Risk: CONDITIONAL_FAILED_ATTEMPT_USAGE_OMISSION_OR_MISATTRIBUTION
Existing Defense: UNKNOWN_FOR_ZERO / UPSTREAM_PATCH_NOT_EXECUTED_HERE
Measured Effectiveness: NOT_COMPUTED
Write Scope: aegis-cortex/2026-11-17-A1-reliability-observe.md
Host Kernel Modification: NO
Boundary Violation: NO

## INPUT_RECORD
- Cold started from merged Zero main `6ee84de190e7b3f5c38e8d2bd5eaeab91da518dc`; inspected `aegis-cortex/README.md`, `EVIDENCE_POLICY.md`, `check.py`, retained 2026-11-16 A1/A2 and closed W46 records; no 2026-11-17 Native A1/A2 file present on this baseline
- Distinct from 2026-11-16 A1's Google ADK sampled-out inference-duration endpoint: this observation concerns OpenAI Agents SDK failed/incomplete Responses usage accounting, not a repeat of ADK instrumentation source
- Directly fetched upstream first-party [exact commit](https://github.com/openai/openai-agents-python/commit/6e6707cdcf63c2466f2bc8c6cb026ce3813bdf26) and inspected changed code and test patch
- The upstream commit has timestamp 2026-11-16T22:46:54Z UTC (= 2026-11-17T06:46:54+08:00); this run uses logical research date 2026-11-17, separate from source publication and eventual GitHub PR delivery time
- Only first-party patch/test source was read, not a released SDK artifact, installed Zero dependency, captured billable provider meter, actual local trace, or regression run

## EXTERNAL_SOURCE_RECORDS
Source ID: SRC-20261117-A01
Title: Preserve usage from failed and incomplete Responses calls across terminal errors and retries
Publisher: openai/openai-agents-python maintainers
Canonical Source Identity: openai/openai-agents-python@6e6707cdcf63c2466f2bc8c6cb026ce3813bdf26
URL: https://github.com/openai/openai-agents-python/commit/6e6707cdcf63c2466f2bc8c6cb026ce3813bdf26
Error Model URL: https://github.com/openai/openai-agents-python/blob/6e6707cdcf63c2466f2bc8c6cb026ce3813bdf26/src/agents/models/_response_terminal.py
Retry Accounting URL: https://github.com/openai/openai-agents-python/blob/6e6707cdcf63c2466f2bc8c6cb026ce3813bdf26/src/agents/run_internal/model_retry.py
Source Change Time: 2026-11-16T22:46:54Z UTC
Date Checked: 2026-11-17 Asia/Shanghai
Evidence Tier: PRIMARY_SOURCE_PINNED_PATCH / UPSTREAM_TESTS_NOT_EXECUTED
Source Access: GITHUB_COMMIT_DIFF_AND_AUTHORED_TEST_CHANGES_READ
Independent Source Count: ONE_UPSTREAM_REPOSITORY_LINEAGE
External Evidence: Commit adds `ModelBehaviorError._terminal_usage`, copies `response.usage` into terminal failure errors, propagates usage into tracing spans and run accounting, and replaces synthetic zero failed-attempt entries with reported attempt usage when available
Claim Supported: These specific code paths can preserve provider-reported usage for failed/incomplete terminal responses and retried attempts under the inspected source revision
Claim Not Supported: prior SDK always undercounted; each provider failure reports usage; release deployment is complete; reported usage equals final invoice; Zero has local cost undercount incidents; the patch fixes authorization or action-effect semantics
Confidence: HIGH_FOR_PATCH_SEMANTICS / UNKNOWN_FOR_MEASURED_DELTA_AND_HOST_APPLICABILITY
Uncertainty: Distinct terminal error shapes, stream/non-stream paths, partial retry sequences, actual provider usage reports, SDK release packaging and zero-host dependencies were not reproduced

## RAW_RELIABILITY_SIGNAL_LOG
Signal ID: RISK-20261117-A01
Class: EXTERNAL_RISK_CLASS / OBSERVABILITY_USAGE_COMPLETENESS
Problem Statement: A model-response attempt may terminate as `response.failed` or `response.incomplete` while the provider supplies nonzero usage, and a retry can then succeed. If the harness credits only the eventual successful response or substitutes zeros for failed attempts, model attempt accounting can diverge from provider-reported usage.
Pinned Patch Mechanism: `response_terminal_failure_error` now copies non-null `Response.usage` into a `ModelBehaviorError`; `openai_responses.py` adds terminal usage to trace span fields; retry machinery accepts `reported_usage` keyed per attempt and records it when computing aggregate `Usage`, including the path that exits with an error.
Author Test Evidence: The changed `tests/models/test_model_retry.py` includes mocked failed/incomplete Responses call cases with first request 12 input + 16 output tokens and second request 5 input + 2 output tokens; these fixture values are source-authored test assertions, not this producer's measured local cost
Relevant Preconditions: Provider returns a typed terminal Response with usage; SDK path emits `ModelBehaviorError`; retry accounting constructs aggregate usage using exact per-attempt identity; observer consumes the relevant run/trace fields
Possible Outcome: Missing known failed-attempt usage can distort accounting and budget monitoring; this does not itself prove lost tool effects or incorrect permission checks
Denominator: failed/incomplete model attempts with usage actually supplied through relevant Responses paths, not all requests, all agents, or all task failures
Counterevidence 1: If an error never provides `Response.usage`, there is no known nonzero usage to recover; a zero/unknown fallback does not establish the actual provider charge
Counterevidence 2: If no retry occurs or the response completes normally, this specific multi-attempt omission mechanism may not trigger
Counterevidence 3: An SDK-local aggregate of reported tokens may still differ from provider invoices due to independent accounting and reconciliation semantics; reported usage is an observation, not billable-amount proof
Counterevidence 4: The upstream test uses `MockTransport`, not an independent production provider receipt, and a code patch is not a measurement of before/after actual effectiveness
Counterevidence 5: A traced token count is not a completed model answer, authorized tool action or durable external effect
Local Repository Evidence: No corresponding Zero runtime request, dependency pin, budget alert, provider meter, OpenAI Agents span or incident was observed by this producer
Local Incident Evidence: UNKNOWN / NO_LOCAL_INCIDENT_OBSERVED / NOT_IMMUNITY_EVIDENCE
Existing Defense: UNKNOWN in Zero; upstream code fix belongs to a different repo and does not establish installed behavior
Measured Effectiveness: NOT_COMPUTED / NO_PINNED_PAIRED_EXPERIMENT
Classification: EXTERNAL_RISK_CONDITIONAL / LOCAL_INCIDENT_NOT_ESTABLISHED

## EVIDENCE_DELTA
- NEW_EVIDENCE: exact first-party failed/incomplete response usage retention and retry-attempt accounting patch with source-authored mock test cases
- CORRECTED_INTERPRETATION: failed request count, reported request usage, successful aggregate usage and invoice reconciliation are separate evidence axes
- UNCHANGED_BOUNDARY: EXTERNAL_RISK != LOCAL_INCIDENT != EXISTING_DEFENSE != MEASURED_EFFECTIVENESS, and usage accounting != effect occurrence
- NEW_COUNTEREVIDENCE: provider may omit usage on error; normal success/no retry bypasses this path; mock tests are not local measured effect
- UNKNOWN_RETAINED: Zero installed SDK/version, actual provider reporting behavior, token total impact, exported trace, financial reconciliation, test suite results and local defense
- NEXT_RETEST_CONDITION: pin SDK pre/post revisions and mocked plus independent provider-supplied terminal events; capture attempt IDs, retry count, error terminal object, usage per attempt, run/trace aggregate and real billing receipt separately, with stdout/stderr/exit and Zero dependency check

## NEXT_HANDOFF
- Same-day native `zero/aegis/A2` remains BLOCKED_DEPENDENCY until original 2026-11-17 A1 Draft PR is merged and the precise merged A1 content/blob is reread from fresh main
- Native A2 may evaluate counterexamples and whether the Zero kernel actually uses affected SDK/telemetry; it may not treat this external commit as a Zero local defect
- Closed W46 A3/A4 are distinct weekly lineage; this 2026-11-17 item is not retroactively W46 input
- November Native A5/A6 remain NOT_DUE until natural month closure

## BOUNDARY_CHECK
- Only the dated Aegis Native A1 file; no Host Kernel, Ballast, existing Aegis policy, historical Jules artifacts, independent A1/A2, periodic audits or workflows changed
- GitHub current main/source commit and authored test patch read: PERFORMED. Required-section/field static inspection: PERFORMED
- Native `aegis-cortex/check.py`, upstream pytest, real SDK/provider retries, actual Zero runtime and billing/export reconciler: NOT_EXECUTED
- Delivery is Draft PR for Human Maintainer review only; no self-merge, local incident or measured improvement claim
