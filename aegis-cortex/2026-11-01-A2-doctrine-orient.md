# A2 Daily Doctrine Orient — 2026-11-01

## CORTEX_RUN_HEADER
Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A2
Canonical Identity: zero/aegis/A2
Cadence: Daily
Loop Stage: Orient
Logical Date: 2026-11-01
Logical Timezone: Asia/Shanghai
Execution Date UTC: 2026-11-01 / exact timestamp NOT_CAPTURED
Producer: GPT-6 / GPT_NATIVE_PROSPECTIVE / NOT_JULES_REPLAY
Record Provenance: HUMAN_AUTHORIZED_NATIVE_PRODUCTION
Base Main SHA: f351fb471692bc534fd5560fce7082b88a0cfda8
Run Identity: zero-entropy-lab/aegis/A2/2026-11-01/GPT_NATIVE/f351fb471692bc534fd5560fce7082b88a0cfda8/gpt-native-20261101-a2-01
Upstream A1: aegis-cortex/2026-11-01-A1-reliability-observe.md
Upstream A1 Blob: ed6308903e67353b96c40eba29c0af0520b97089
Upstream A1 PR: #777 MERGED, main f351fb471692bc534fd5560fce7082b88a0cfda8
Input Status: SAME_DATE_A1_MERGED_MAIN_VISIBLE_BEFORE_A2
Task Status: SUCCESS_BOUNDED_ORIGINAL_SOURCE_AND_COUNTEREVIDENCE_REVIEW
Network Status: OFFICIAL_RELEASE_AND_ORIGINAL_UPSTREAM_PR_OPENED
Evidence Class: EXTERNAL_FAILURE_MODE_EVIDENCE
Local Incident Evidence: NO_LOCAL_EVIDENCE
Existing Defense in Zero: UNKNOWN
Measured Effectiveness in Zero: NOT_MEASURED
Host Applicability: UNKNOWN
Write Scope: aegis-cortex/2026-11-01-A2-doctrine-orient.md
Boundary Violation: NO

## INPUT_RECORD
- Refreshed exact merged current main and same-day A1 record after PR #777. A1 used Claude Agent SDK Python v0.2.170, released 2026-10-21; this record verifies its original merged patch, not a newly published November release.
- Upstream source: https://github.com/anthropics/claude-agent-sdk-python/pull/1422 ; release: https://github.com/anthropics/claude-agent-sdk-python/releases/tag/v0.2.170 .
- Original upstream PR #1422 merged 2026-10-21T01:12:41Z. Primary implementation description is the same maintainer lineage as the release. Independent publisher or deployment reproduction: NONE.
- Host Kernel import versions, current installed SDK, local session storage, Ballast effects and running tool paths: NOT_OBSERVED / NOT_EXECUTED.
- This A2 updates only scoped research interpretation. It does not produce a local test, kernel patch, protocol doctrine or rate estimate.

## ORIGINAL_SOURCE_VERIFICATION
### SRC-20261101-A2-01 — forked transcript builder
- Source authority: merged upstream primary implementation description and author test plan, not independently run code.
- Author-reported mechanism: CLI writes separate assistant content blocks sharing response message.id; each parallel tool_result parentUuid references its own call's assistant entry. The linear parentUuid walk in _build_conversation_chain followed the branch the next turn continued from and dropped other parallel calls/results from recovered session history.
- Declared patch: collect off-chain sibling assistant records plus their tool results for each response on the main chain, and insert after the last on-chain response entry; both get_session_messages and get_session_messages_from_store share this builder.
- Matching constraints: recover sourceToolAssistantUUID or tool_use_id when parentUuid points outside the response, only for the same writer and not already answered; pagination limit/offset counts recovered messages.
- Author-reported test observation: before on a 160-message transcript the reader returned 141 and missed 19 of 63 tool results; patched read returns all 160. Do not copy this rate into Zero's metrics.
- Counterexample: a session read that returns success does not prove it covered every fork; equally, missing transcript rows do not establish missing effects at a backend.

### SRC-20261101-A2-02 — explicit unfixed surface
- The same PR explicitly excludes get_subagent_messages and get_subagent_messages_from_store. They use another chain builder with a single-branch walk and still omit parallel tool calls/results in subagent transcript history at the PR's publication time.
- Declared fixed API coverage != SDK-wide completeness. A subagent transcript is an explicit negative control for any broader claim.
- More complete messages also cannot establish that an action was authorized, that a tool-side effect committed, or that recovery included independently recorded effect receipts.
- The PR author indicates TypeScript SDK has a related design and leaves the subagent change for a separate patch. A matching design is not an independent replication.

## FAILURE_MODEL_ORIENTATION
Failure Class: PARALLEL_SESSION_TRANSCRIPT_BRANCH_LOSS.
- Trigger: session-history reconstruction of forked parallel tool turns by the affected helper functions and pre-fix revision; not inferred for serial-only tasks or every SDK.
- Observed external source fact: upstream maintainers identify a specific lossy retrieval path and report repaired primary session readers.
- Local Incident: UNKNOWN / NOT_ESTABLISHED; Zero production traces, dependencies and local exposure were not checked.
- Existing Defense: UNKNOWN; one external vendor patch is not an applied Zero mitigation.
- Effectiveness: NOT_MEASURED; no local before/after fixture, test logs or real effect ledger.
- Mechanism: missing branches in a view of history may cause an auditor or successor agent to mistake absent call/result messages for nonexecution. The correct predicate is TRANSCRIPT_READ_COMPLETE only if the expected fork/call/result set is reconciled against an independently identified source.
- Counterevidence: a serial-only transcript contains no parallel fork; a complete authoritative tool-effect ledger may refute an assumed absence even if the SDK's view is partial; repaired retrieval still may be ambiguous around external side-effect completion.
- Trust boundary: model observations, tool call intents, tool responses, committed external effects and user-valid completion require separate identity and provenance.

## COUNTEREVIDENCE_GATE
- Universal assertion "the whole SDK now recovers all parallel results": REJECTED by explicitly excluded subagent readers.
- Universal assertion "the SDK lost physical tool effects": NOT_SUPPORTED; it lost records from a retrieval view, not necessarily execution or authoritative original event storage.
- "Zero Kernel has an incident": NOT_ESTABLISHED due to absent exact dependency/configuration and local run evidence.
- "Tool response presence proves successful effect": NOT_SUPPORTED; effect receipt and verification at effect time remain distinct.
- Suitable future test: pin pre/post v0.2.170 Python SDK versions, serial/parallel/subagent fixtures, writer ID and fork identity, original transcript and separate effect IDs; compare recovered tool_call_id/result pairs, omitted and duplicate sets, and explicit aborted/resumed branches. Execute tests with independent stdout/stderr/exit and version records.

## NO_DECISION_SECTION
- Daily A2 only orients an external risk; no weekly A3/A4 discipline decision, no monthly A5/A6 memory update, no Host Kernel or Ballast change.
- No unsupported local incident, local defense, impact probability, authorization breach or test PASS created.
- Same-day A1 was read after merge; H1/A1 repetition is not an independent source count.

## EVIDENCE_DELTA
- NEW_EVIDENCE: primary PR #1422's precise branch identity and recovery strategy, author-reported missing 19/63 tool results in one 160-row fixture, and explicit unpatched subagent readers.
- CORRECTED_INTERPRETATION: the affected defect concerns history reconstruction from branched logs; it does not establish that the underlying tool effect did not happen or that a vendor fix is universally complete.
- UNCHANGED_BOUNDARY: External Risk != Local Incident != Existing Defense != Measured Effectiveness; same source lineage cited twice does not increase independence.
- NEW_COUNTEREVIDENCE: serial sessions may avoid this branch loss, subagent readers remain outside the patch, and any transcript list lacks independent effect-time authorization and commit receipts.
- UNKNOWN_RETAINED: exact Zero SDK use, real source logs, alternate APIs, independent before/after execution, local defense and actual completion rates.
- NEXT_RETEST_CONDITION: identical input session with pinned revisions, writer/fork/call IDs, original writer-side ledger, all reader APIs, explicit side-effect receipts, isolated test logs and verified output sets.

## NEXT_HANDOFF
- 2026-11-01 A1 merged input satisfies the H2-style dependency for this A2. No unmerged branch treated as main.
- Weekly 2026-W44 remains NOT_DUE until its natural end in Asia/Shanghai; no week-complete protocol record.
- This document is a prospective original A2 task, not Independent A1/A2 Maintenance and not Periodic Audit.
- Native checker, external SDK test fixture, Zero kernel integration test, full repository worktree validation and real tool side effects: NOT_EXECUTED.
