# A1 Daily Reliability Observe — 2026-11-18 / UTC-offset memory selection

## CORTEX_RUN_HEADER
Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A1
Canonical Identity: zero/aegis/A1
Cadence: Daily
Loop Stage: Observe
Logical Date: 2026-11-18
Logical Timezone: Asia/Shanghai
Agent: GPT-6 / GPT_NATIVE / HUMAN_REQUESTED / NOT_JULES_REPLAY
Record Provenance: HUMAN_AUTHORIZED_SUBSTITUTE
Base Main SHA: 4b465daa2de2ea6ce71301ddbe2d309fc16b5563
Run Identity: zero-entropy-lab/aegis/A1/2026-11-18/GPT_NATIVE/4b465daa2de2ea6ce71301ddbe2d309fc16b5563/mixed-offset-temporal-memory-selection-01
Evidence Class: EXTERNAL_RISK_CLASS / TIMESTAMP_NORMALIZATION_AND_MEMORY_SELECTION
Source Identity: openai/openai-agents-python@e7ce15a25b336bb3d0840ad16dee597f69a6e6d3
Source Authority For Claim: FIRST_PARTY_VERSION_PINNED_IMPLEMENTATION_AND_TEST_DIFF
Independent Verification: EXACT_PATCH_AND_AUTHOR_TEST_REREAD / NOT_A_LOCAL_SDK_REPRODUCTION
Local Incident Evidence: NOT_OBSERVED / NO_ZERO_LOCAL_MEMORY_SELECTION_FAILURE
Local Evidence: UNKNOWN / ZERO_DEPENDENCY_AND_MEMORY_BACKEND_NOT_VERIFIED
Existing Defense: UNKNOWN_FOR_ZERO
Measured Effectiveness: NOT_COMPUTED
Host Applicability: UNKNOWN / ZERO_INSTALLED_SDK_AND_STORAGE_NOT_VERIFIED
Original Execution Status: GPT_NATIVE_REMOTE_SOURCE_REVIEW_PERFORMED / RUNTIME_NOT_EXECUTED
Current Path Status: PROPOSED_DRAFT_PR / NOT_MERGED_AT_AUTHORING
Task Status: BOUNDED_EXTERNAL_RISK_OBSERVATION / NO_HOST_INCIDENT
Write Scope: aegis-cortex/2026-11-18-A1-reliability-observe.md
Host Kernel Modification: NO
Boundary Violation: NO

## INPUT_RECORD
- Cold-start `zero-entropy-lab` merged main `4b465daa2de2ea6ce71301ddbe2d309fc16b5563`; Git tree not truncated, no open PR or 2026-11-18 branch found at preflight. Read Aegis policy/checker, Nov17 native A1/A2 and W46 ownership.
- Nov17 native A1 concerned usage accounting of unsuccessful Responses, while today's pinned source concerns mixed-offset timestamp ordering during sandbox-memory candidate selection; source claim is independently typed, not evidence of another local failure.
- Directly inspected first-party OpenAI Agents SDK commit `e7ce15a25b336bb3d0840ad16dee597f69a6e6d3`, `src/agents/sandbox/memory/storage.py` patch and `tests/sandbox/test_memory.py` parameterized fixtures.
- Upstream commit date 2026-11-18T00:49:23Z (08:49:23+08:00); this is neither Zero runtime observation nor this task's merge time.
- No local SDK import, test fixture, user-memory dataset, token billing or effect sink run performed; static read is not a measured incident/defense.

## EXTERNAL_SOURCE_RECORDS
Source ID: SRC-20261118-AE01
Title: fix: sandbox memory selection across UTC offsets (#6066)
Publisher: openai/openai-agents-python maintainers
Canonical Source Identity: openai/openai-agents-python@e7ce15a25b336bb3d0840ad16dee597f69a6e6d3
URL: https://github.com/openai/openai-agents-python/commit/e7ce15a25b336bb3d0840ad16dee597f69a6e6d3
Implementation URL: https://github.com/openai/openai-agents-python/blob/e7ce15a25b336bb3d0840ad16dee597f69a6e6d3/src/agents/sandbox/memory/storage.py
Authored Test URL: https://github.com/openai/openai-agents-python/blob/e7ce15a25b336bb3d0840ad16dee597f69a6e6d3/tests/sandbox/test_memory.py
Source Version: EXACT_COMMIT_SHA / RELEASE_INSTALLATION_NOT_VERIFIED
Source Publication Time: 2026-11-18T00:49:23Z
Evidence Tier: FIRST_PARTY_COMMIT_AND_AUTHOR_TEST_TEXT
Execution Tier: NOT_EXECUTED_LOCALLY

## RAW_RELIABILITY_SIGNAL_LOG
Risk ID: RISK-20261118-A01
External Risk: CONDITIONAL_MISORDER_OF_TIME_STAMPED_SANDBOX_MEMORY_RECORDS
Mechanism before patch: `_updated_at_sort_key` extracted the raw `updated_at` metadata and returned the original timestamp string as a sort key. Lexical order across `+00:00` and `-05:00` timezones is not necessarily chronological order.
Mechanism after patch: match ISO-like offset timestamps, normalize parsed clock to UTC, retain the fractional suffix separately to avoid `datetime` microsecond truncation, then sort normalized keys. Values outside supported format fall back to raw lexical values; malformed and unknown handling remains a boundary.
Authored positive fixtures: `2026-11-17T03:30:00+00:00` is older than `2026-11-16T23:30:00-05:00` in real UTC, although the latter string begins on an earlier wall-clock date. Other fixtures include UTC Z, compact offsets and 9-digit fractional seconds.
Failure consequence hypothesis: candidate selection may retain/demote incorrect `updated_at` order, potentially changing what later retrieval/reconciliation sees. The patch does NOT demonstrate erroneous authority grants, permanent data deletion, user-visible factual error or a Zero host failure.
Positive control for future actual run: pin parent and patch revisions, create two record IDs with mixed UTC offsets and equivalent verified instants; compare selected rollouts by stable record IDs and expected UTC order.
Negative control A: both timestamps in UTC should preserve expected order without timezone conversion.
Negative control B: unknown/malformed timestamps must remain explicitly classified, not be silently promoted into verified chronological comparisons.
Negative control C: two revisions sharing the same real instant require tie-handling evidence distinct from memory contents, and nanosecond fragments must retain independent precision checking.
Negative control D: temporary test mocks and authored pytest parameters are not a live user sandbox, deployed package identity, storage replay or evidence of an effect sink.
Counterevidence gate: a local incident requires installed SDK commit/version, a persisted source record pair, selected candidate IDs, incorrect expected-vs-observed UTC ordering and a revision-pinned runtime receipt.
Local Incident: NOT_ESTABLISHED. Existing Defense: UNKNOWN. Measured Effectiveness: NOT_COMPUTED.
Deduplication: one OpenAI upstream commit and its author tests are ONE issuer lineage; no independent source count added by separate URLs.
Disposition: EXTERNAL_RISK_WATCH / NO_KERNEL_CHANGE / NO_LOCAL_INCIDENT_PROMOTION.

## EVIDENCE_DELTA
- NEW_EVIDENCE: specific mixed-offset regression and normalization code path with positive control fixtures including sub-microsecond precision.
- CORRECTED_INTERPRETATION: lexicographic time metadata is not authoritative event chronology; retrieved candidate order is not proof of causal order or stored effect completion.
- UNCHANGED_BOUNDARY: EXTERNAL_RISK != LOCAL_INCIDENT != EXISTING_DEFENSE != MEASURED_EFFECTIVENESS.
- NEW_COUNTEREVIDENCE: unsupported timestamp strings, unknown values, equal UTC instants and missing persisted records prevent a universal correction claim.
- UNKNOWN_RETAINED: Zero installed dependencies, which memory selector is used, persistent state, author test outcome, errors in practice, defense coverage and effect settlement.
- NEXT_RETEST_CONDITION: execute pinned parent/patch test matrix and real Zero dependency inspection with version, storage IDs, UTC normalized keys, stdout/stderr/exit and durable selection readback.

## NEXT_HANDOFF
- Same-day native `zero/aegis/A2` is BLOCKED_DEPENDENCY until original A1 Draft is actually merged into main and read with exact blob and merge SHA; A1 creation cannot stand in for A2 source validation.
- Prior closed W46 native A3/A4 are main-retained; open W47 native A3/A4 NOT_DUE. November native A5/A6 NOT_DUE until calendar month closure.
- No Ballast, Host Kernel, independent A1/A2, periodic audit, governance, prior Jules producer history or source-revision status mutated.

## BOUNDARY_CHECK
- GitHub source patch, first-party authored tests and current policy/checker shape: READ_PERFORMED.
- Aegis structural checker, SDK pytest, installed Zero runtime, real storage and effect measurements: NOT_EXECUTED.
- One new scoped canonical A1 Draft intended for Human Maintainer. No misleading PASS, direct main edit, auto-merge or unapproved host change.
