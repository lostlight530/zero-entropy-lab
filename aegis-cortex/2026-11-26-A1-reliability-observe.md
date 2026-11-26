# A1 Daily Reliability Observe — 2026-11-26 / resume default semantics
## CORTEX_RUN_HEADER
Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A1
Canonical Identity: zero/aegis/A1
Cadence: Daily
Loop Stage: Observe
Logical Date: 2026-11-26
Logical Timezone: Asia/Shanghai
Agent: GPT-6.2 / GPT_NATIVE / HUMAN_REQUESTED / NOT_JULES_REPLAY
Record Provenance: HUMAN_AUTHORIZED_SUBSTITUTE
Base Main SHA: 096a620b7ccffdce7fbf3e6814f5c0ef09354ffe
Run Identity: zero-entropy-lab/aegis/A1/2026-11-26/GPT_NATIVE/096a620b7ccf/resume-default-01
Evidence Class: EXTERNAL_RISK / RESUME_SCHEMA_DEFAULT_LOSS
Source Identity: google/adk-python PR #8370 / head d14c1f1d7a2a5fc5d4c3820d2a2fcc3957076de6
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
Write Scope: aegis-cortex/2026-11-26-A1-reliability-observe.md
Host Kernel Modification: NO
Boundary Violation: NO

## INPUT_RECORD
- Policy blob 4977de3ac6cc8fbfd59bb0f7ebbb1957a9f22d84; checker blob f557f7ff32687dd8e169dea032a6e11c64804c68; prior A1 blob 1f865af4128bca51b759286c65b6954c462422d6.
- Fresh main tree non-truncated; no same-day A1 or open PR at preflight; W47 A3/A4 retained; W48 and November close NOT_DUE. Ballast independent.
- Source inspection approximately 2026-11-26 14:50 Asia/Shanghai. Zero checkout not separately attempted; local acquisition on Axiom and Reflective failed DNS.

## EXTERNAL_SOURCE_RECORDS
Source ID: SRC-20261126-A01
URL: https://github.com/google/adk-python/pull/8370
Title: fix(workflow): keep schema defaults for missing resume fields
Publisher: ADK repository contribution
Source Publication Time: 2026-11-26T04:25:38Z
Source Revision: head d14c1f1d7a2a5fc5d4c3820d2a2fcc3957076de6; base 03725e8c67ca27b2c07569797a0c18e867e0b217; OPEN / UNMERGED
Evidence Tier: PRIMARY_SOURCE_PATCH_AND_AUTHOR_FIXTURES
Confidence: bounded adapter mechanism; upstream acceptance and real workflow behavior unknown
Uncertainty: upstream acceptance, explicit-null/nested/default-factory and schema-version behavior, actual resumed workflow and Zero applicability remain unverified; author-reported tests are not independent execution.
Inspected Surface: src/google/adk/workflow/utils/_rehydration_utils.py and tests/unittests/workflow/utils/test_rehydration_utils.py patches
External Evidence: related #8359 cited by author, not independently inspected.

## RAW_RELIABILITY_SIGNAL_LOG
- Nonrequired object properties were given default None during dynamic schema model construction; proposed one-line change uses prop_schema.get("default"). Required properties unchanged.
- Author fixture: partial answer {"approved":true} should retain priority=3, tags=[], reviewer="manager"; proposed test reconstructs original Decision model. Another fixture checks explicit values override defaults.
- Conditional failure mechanism: an omitted field becomes None instead of declared default, changing rehydrated data and potentially failing next-node validation. Source patch and fixtures support this mechanism, not local incidents.
- Author reports base-red test, 82/82 with fix and broader 283 passes; no independent execution or E2E test.
- Default factories without serialized default are explicitly outside proposal. Missing default still maps to None; explicit null and omission are different states. Default-filled data is not human supplied data.

## Failure-model boundary and Counterevidence Gate
- Explicit value override is a negative control; omitted optional field with no default does not discriminate old/new behavior.
- Explicit null, required fields, nested schemas, default factory and schema-version drift require separate tests; do not infer completeness from two authored fixtures.
- Default value cannot imply approval or renewed authority. A resumed workflow may use a valid default yet act under expired authorization.
- No Zero incident, verified defense, installed dependency or measured effectiveness established.

## EVIDENCE_DELTA
- NEW_EVIDENCE: pinned open PR and authored schema-default preservation tests.
- CORRECTED_INTERPRETATION: omitted field != explicit null != user decision; schema validity != authorized resume.
- UNCHANGED_BOUNDARY: EXTERNAL_RISK != LOCAL_INCIDENT != EXISTING_DEFENSE != MEASURED_EFFECTIVENESS.
- NEW_COUNTEREVIDENCE: explicit override, no default and default_factory scope.
- UNKNOWN_RETAINED: release, nested/explicit-null behavior, real resumed workflow and Zero applicability.
- NEXT_RETEST_CONDITION: accepted revision; omitted/null/explicit/default-factory matrix, schema-version changes, next-node reconstruction and independent authorization/receipt checks.

## NEXT_HANDOFF
A2 only after original same-day A1 merges and exact current main artifact is reread. Verify missing-versus-null semantics and authorization boundary. No host modification.

## BOUNDARY_CHECK
Remote source and patch inspection executed. Full aegis-cortex/check.py, SDK tests and Zero runtime NOT_EXECUTED. One canonical A1 file; no history rewrite. Human review required.
