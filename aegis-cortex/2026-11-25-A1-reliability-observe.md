# A1 Daily Reliability Observe — 2026-11-25 / retry count semantic mismatch
## CORTEX_RUN_HEADER
Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A1
Canonical Identity: zero/aegis/A1
Cadence: Daily
Loop Stage: Observe
Logical Date: 2026-11-25
Logical Timezone: Asia/Shanghai
Agent: GPT-6.2 / GPT_NATIVE / HUMAN_REQUESTED / NOT_JULES_REPLAY
Record Provenance: HUMAN_AUTHORIZED_SUBSTITUTE
Base Main SHA: d26fc4cd17406f42eb9fce5ba4b8f34095695ada
Run Identity: zero-entropy-lab/aegis/A1/2026-11-25/GPT_NATIVE/d26fc4cd17406/retry-count-01
Evidence Class: EXTERNAL_RISK / RETRY_COUNT_SEMANTIC_MISMATCH
Source Identity: google/adk-python PR #8336 / head 50f2a31309b52a11f2ed140b57c3d07d7863565c
Source Authority For Claim: FIRST_PARTY_OPEN_PR_IMPLEMENTATION_AND_AUTHORED_FIXTURES
Independent Verification: EXACT_SOURCE_PATCH_INSPECTED / SDK_RUNTIME_NOT_EXECUTED
Local Incident Evidence: NOT_ESTABLISHED
Local Repository Evidence: NO_ZERO_RUNTIME_RECEIPT_FOR_THIS_PATH
Existing Defense: UNKNOWN
Measured Effectiveness: NOT_COMPUTED
Host Applicability: UNKNOWN / ZERO_DEPENDENCY_AND_CONFIGURATION_UNVERIFIED
Original Execution Status: SOURCE_REVIEW_EXECUTED / CHECKER_AND_SDK_NOT_EXECUTED
Current Path Status: PROPOSED_DRAFT_PR / NOT_MERGED_AT_AUTHORING
Task Status: BOUNDED_EXTERNAL_RISK / NOT_LOCAL_INCIDENT
Write Scope: aegis-cortex/2026-11-25-A1-reliability-observe.md
Host Kernel Modification: NO
Boundary Violation: NO

## INPUT_RECORD
- Policy blob 4977de3ac6cc8fbfd59bb0f7ebbb1957a9f22d84; checker blob f557f7ff32687dd8e169dea032a6e11c64804c68. Prior A1 blob 25fbfc44995f66c6dcc588b8a4d8a66232ced44b concerned multimodal role attribution.
- Fresh main tree non-truncated; no same-day A1 or open PR observed. W47 A3/A4 retained; W48 and November close NOT_DUE. Ballast independent.
- Shared environment acquisition diagnostic on Axiom-0 failed with DNS error; Zero checkout not separately attempted. Full checker not executed.

## EXTERNAL_SOURCE_RECORDS
Source ID: SRC-20261125-A01
URL: https://github.com/google/adk-python/pull/8336
Title: fix(models): map retry attempts to LiteLLM retries
Publisher: ADK repository contribution
Source Publication Time: 2026-11-25T01:26:06Z
Source Revision: head 50f2a31309b52a11f2ed140b57c3d07d7863565c; base 825a44c5dfb72cd14d5d037a8f42a27c7bf62292; OPEN / UNMERGED
Observed At: 2026-11-25 Asia/Shanghai, after 09:26 local
Evidence Tier: PRIMARY_SOURCE_PATCH_AND_AUTHOR_FIXTURES
Confidence: bounded adapter mapping; actual transport behavior unknown
Inspected Surface: PR metadata, lite_llm.py and test_litellm.py patches
External Evidence: author cites #8330; issue and LiteLLM implementation not independently verified.

## RAW_RELIABILITY_SIGNAL_LOG
- Old adapter forwards HttpRetryOptions.attempts verbatim to completion_args["num_retries"]. Proposal changes it to max(0, attempts - 1).
- Intended count semantics differ: total attempts includes original request, retry-only count excludes it. Conditional on the callee honoring retry-only semantics, old mapping permits one additional request for positive configured counts.
- Authored fixtures change expected forwarded value 3 to 2 and add attempts=1 -> num_retries=0. mock_acompletion.assert_called_once checks adapter invocation only, not provider network attempts.
- Author reports two selected pytest cases passed and lint. No independent test execution here.
- Explicit options None leave this branch untouched. Zero/negative values are not proof of a no-request budget: clamping retry count does not suppress original invocation. Input validation is outside inspected patch.

## Failure-model boundary and Counterevidence Gate
- Distinguish adapter argument mapping, SDK invocation count, transport retries, provider request receipts and external side effects. One mock call can encapsulate multiple attempts.
- Negative control: a successful first response has no actual retry in either policy. Failure/timeout paths with attempts=1 and 3 discriminate the mapping if lower layers honor it.
- Layered retries can multiply a configured limit; provider idempotency or a response lost after effect needs independent evidence.
- No Zero incident, defense, installed dependency or measured efficacy established.

## EVIDENCE_DELTA
- NEW_EVIDENCE: pinned adapter off-by-one proposal and mock-based fixtures.
- CORRECTED_INTERPRETATION: total attempts != retry-only count; mocked adapter calls != wire attempts.
- UNCHANGED_BOUNDARY: EXTERNAL_RISK != LOCAL_INCIDENT != EXISTING_DEFENSE != MEASURED_EFFECTIVENESS.
- NEW_COUNTEREVIDENCE: first-attempt success, None options and nested retry layers.
- UNKNOWN_RETAINED: release, provider behavior, Zero applicability and effect occurrence.
- NEXT_RETEST_CONDITION: verify upstream callee contract and merged revision; controlled failing endpoint with raw request count, attempts=1/3 and nested retry policies; compare effect receipts.

## NEXT_HANDOFF
A2 only after original same-day A1 merges and exact fresh-main artifact is read. Recheck retry semantics and counterevidence; no host modification.

## BOUNDARY_CHECK
Remote source and manual structural field checks executed. Full aegis-cortex/check.py, SDK tests, Zero runtime and network effects NOT_EXECUTED. One canonical A1 file only; historical producer provenance retained. Human review required.
