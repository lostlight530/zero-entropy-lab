# A2 Daily Doctrine Orient — 2026-11-17 / failed-attempt usage evidence boundary

## CORTEX_RUN_HEADER
Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A2
Canonical Identity: zero/aegis/A2
Cadence: Daily
Loop Stage: Orient
Logical Date: 2026-11-17
Logical Timezone: Asia/Shanghai
Agent: GPT-6 / GPT_NATIVE / HUMAN_REQUESTED / NOT_JULES_REPLAY
Record Provenance: HUMAN_AUTHORIZED_SUBSTITUTE
Base Main SHA: 1d8256222e8cedb1f161d8055ddc09d08ca52424
Run Identity: zero-entropy-lab/aegis/A2/2026-11-17/GPT_NATIVE/1d8256222e8cedb1f161d8055ddc09d08ca52424/terminal-usage-negative-control-orientation-01
Evidence Class: EXTERNAL_RISK_CLASS / MODEL_USAGE_AND_RETRY_ACCOUNTING
Source Identity: openai/openai-agents-python@6e6707cdcf63c2466f2bc8c6cb026ce3813bdf26
Source Authority For Claim: EXACT_FIRST_PARTY_COMMIT_DIFF / SAME_PUBLISHER_AS_A1
Independent Verification: FRESH_SOURCE_REOPEN_AND_ERROR_PATH_CROSSCHECK / NO_PROVIDER_OR_SDK_RUN
Local Incident Evidence: UNKNOWN / ZERO_PROVIDER_RUN_AND_USAGE_EXPORT_NOT_OBSERVED
Local Evidence: NONE_OBSERVED / NO_ZERO_DEPLOYED_DEPENDENCY_OR_BILLING_LEDGER_CHECKED
Local Applicability: UNKNOWN / ZERO_RUNNING_AGENTS_SDK_VERSION_NOT_VERIFIED
Host Applicability: UNKNOWN / NO_ZERO_LOCAL_ACCOUNTING_DEMONSTRATION
Original Execution Status: GPT_NATIVE_SOURCE_ONLY_A2_ORIENTATION / SDK_RUNTIME_NOT_EXECUTED
Current Path Status: PROPOSED_DRAFT_PR / NOT_MERGED
Task Status: BOUNDED_EXTERNAL_RISK_ORIENTATION / NO_DOCTRINE_PROMOTION
External Risk: CONDITIONAL_REPORTED_USAGE_LOSS_OR_INCOMPLETE_ACCOUNTING
Existing Defense: UNKNOWN_FOR_ZERO
Measured Effectiveness: NOT_COMPUTED
Remaining Uncertainty: PROVIDER_TERMINAL_USAGE / REPLAY_ATTEMPT_IDS / RETRY_COUNTS / BILLING_RECONCILIATION / HOST_DEPENDENCY
Write Scope: aegis-cortex/2026-11-17-A2-doctrine-orient.md
Host Kernel Modification: NO
Boundary Violation: NO

## INPUT_RECORD
- Same-day original A1 on merged fresh main: `aegis-cortex/2026-11-17-A1-reliability-observe.md` Git blob `709099385dba9d98841c59c93022150d10fdf6b3`, [PR #887](https://github.com/lostlight530/zero-entropy-lab/pull/887) merge/main SHA `1d8256222e8cedb1f161d8055ddc09d08ca52424`; not inherited from the previously unmerged Draft branch.
- Current Aegis EVIDENCE_POLICY.md and check.py plus prior 2026-11-16 A2 reviewed; closed W46 A3/A4 not modified or enlarged with Nov17 evidence.
- Reopened pinned [openai/openai-agents-python@6e6707cdcf63c2466f2bc8c6cb026ce3813bdf26](https://github.com/openai/openai-agents-python/commit/6e6707cdcf63c2466f2bc8c6cb026ce3813bdf26), checked `_terminal_usage`, `reported_usage`, `record_failed_attempt_usage_on_error`, error terminal conversion, tracing and retry-accounting diff branches.
- A1 and A2 remain ONE OpenAI SDK issuer lineage. A reopened diff is new review activity, not a second independent user/production measurement; no new Zero process was started.

## RISK_CLASSIFICATION
External Risk: ATTEMPT_USAGE_ACCOUNTING_INCOMPLETE_WHEN_FAILED_RESPONSE_REPORTS_TOKENS
Exact Source Class: FIRST_PARTY_IMPLEMENTATION_FIX / AUTHOR_TEST_PATCH
External Claim: Earlier affected aggregation paths could fail to preserve non-null provider-reported `Response.usage` when terminal events are incomplete/failed, especially when later retries succeed or all attempts fail; source patch adds error-attached usage and per-attempt carry-forward.
Preconditions: Response failure state is delivered with a concrete usage object; code path converts it to a `ModelBehaviorError`; the application uses that SDK's relevant retry/reporting path. No universal provider condition is established.
Negative Control 1: response failure contains no provider usage. An empty reported ledger cannot prove zero incurred cost; classified `UNKNOWN_USAGE`, not an observed 0 token bill.
Negative Control 2: a successful single request with usage does not use the failed-attempt recovery branch, and a retry that starts before the provider creates billable work can have different values.
Negative Control 3: terminal failure is surfaced as an alternate exception or transport error without typed Response; the inspected path cannot be assumed to recover unknown values from that event.
Negative Control 4: a provider reports usage but the SDK trace/exporter is disabled or not read by the observer; actual billing, trace export and run aggregate are separate evidence objects.
Negative Control 5: repeated retries may emit overlapping trace records; double counting is a different failure from omission and needs an attempt-ID cardinality gate.
Negative Control 6: first-party mocked authored tests confirm expected local design fixtures only when actually run. They are not an independently reproduced cloud bill, a regression pass in Zero, or an end-to-end cost reconciliation.
Local Incident Evidence: UNKNOWN; no Zero request, local measured token mismatch, invoice reconciliation, installed dependency or defect report inspected during this A2.
Existing Defense: UNKNOWN_FOR_ZERO; upstream fix is not evidence Zero has installed that exact release or uses its export fields.
Measured Effectiveness: NOT_COMPUTED; neither paired SDK before/after execution nor independent billed-token audit performed.
Host Applicability: UNKNOWN; no local installed package, execution path or active usage collector verified.
Risk Hierarchy: `REPORTED_USAGE != ACTUAL_INVOICE != RUN_COMPLETION != TOOL_EFFECT != CURRENT_PERMISSION`.
Counterevidence Gate: An observed local miss requires same-request/attempt IDs, raw provider usage, independently retained aggregation output and reproducible lineage, not an external code patch alone.
Threat Model: Measurement/completion misattribution is a bounded reliability-risk class; no proof of data loss, unauthorized effect or security exposure in Zero is present.

## ORIENTATION_NOTES
- Strongest supported inference is code-defined preservation of usage when it is actually present in relevant failed/incomplete response structures and passed through retry accounting. Universal charge recovery is unsupported.
- Trace `span_data.usage`, run `context_wrapper.usage`, failed-attempt `reported_usage` mapping and provider billing are independent recorded artifacts; a single scalar in a dashboard is insufficient to test all.
- The authored mock test's 12/16 and 5/2 token fixture values are deliberately controlled examples, not general measured service statistics.
- Proposed reproducible test: pin parent and patch commits, run single successful response, failed+reported usage→success, failed+missing usage→success, double failed, stream terminal error, and error-without-Response. Capture run_id, attempt_id, model response ID, source revision, stdout/stderr, per-attempt usage and final aggregator.
- Reconcile positive/negative provider meters using exact request IDs and source-specific accounting rules, not inferred matching timestamps. Require a separate real Zero dependency and exporter inspection for host claim.
- Action integrity remains separate: correct token accounting cannot prove authorized tool calls, side-effect settlement or safe retry of non-idempotent operations.
- This H2-style review is native Aegis A2, NOT Independent maintenance A2 with MonthStart→N.

## NO_DECISION_SECTION
Decision: NO_DECISION
Doctrine Promotion: NO / HOST_EVIDENCE_AND_MEASURED_EFFECTIVENESS_GATE_NOT_MET
Local Incident Verdict: NOT_ESTABLISHED
Measured Safety Improvement: NOT_COMPUTED
Host Kernel Action: NONE / NO_KERNEL_CHANGE / NO_BILLING_LEDGER_CLAIM
Follow-up: future independent test of source revision and actual Zero runtime/exporter, then reassess if applicable.

## EVIDENCE_DELTA
- NEW_EVIDENCE: fresh path-level verification of error-attached usage and per-attempt retry report, with explicit no-usage/alternate-error/deduplication controls
- CORRECTED_INTERPRETATION: known reported token totals and actual billable invoice may differ; a missing usage value cannot be silently replaced with proven zero
- UNCHANGED_BOUNDARY: EXTERNAL_RISK != LOCAL_INCIDENT != EXISTING_DEFENSE != MEASURED_EFFECTIVENESS
- NEW_COUNTEREVIDENCE: no provider usage, different exception type, non-retry path, disabled exporter and duplicate event identity restrict broad claims
- UNKNOWN_RETAINED: Zero installed dependency, real provider failure denominator, physical billing metrics, runtime results, defense effectiveness and external effect identity
- NEXT_RETEST_CONDITION: matched before/after SDK revisions, separate provider/bill and run usage receipts, exception-path controls, attempt/retry identities, stdout/stderr/exit and independent request reconciliation

## NEXT_HANDOFF
- Nov17 A1 and A2 now become candidate independent A2 whole-month inputs only once original Native A2 PR is merged and freshly read on main
- W46 is closed (Nov9–15); this 2026-11-17 A2 belongs W47 and does not rewrite A3/A4 retrospective outcome
- November native A5/A6 NOT_DUE and this source review creates no Host Kernel implementation authority

## BOUNDARY_CHECK
- Only new same-day native A2 file; original A1, Ballast, Kernel, independent maintenance, independent D14/other periodic, Jules history and workflows unchanged
- Executed: upstream first-party patch review and same-day merged A1 dependency exact blob; NOT_EXECUTED: Aegis structural checker, author pytest, model/provider execution, Zero runtime and billing reconciliation
- Draft PR only for Human Maintainer approval, no auto-merge, no false local incident or effectiveness claim
