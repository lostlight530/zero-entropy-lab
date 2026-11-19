# A1 Daily Reliability Observe — 2026-11-20 / live reconnect duplicate-session rejection

## CORTEX_RUN_HEADER
Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A1
Canonical Identity: zero/aegis/A1
Cadence: Daily
Loop Stage: Observe
Logical Date: 2026-11-20
Logical Timezone: Asia/Shanghai
Agent: GPT-6 / GPT_NATIVE / HUMAN_REQUESTED / NOT_JULES_REPLAY
Record Provenance: HUMAN_AUTHORIZED_SUBSTITUTE
Base Main SHA: 5a212af5afea0d8105e0ddb8f189e58c00cc7046
Run Identity: zero-entropy-lab/aegis/A1/2026-11-20/GPT_NATIVE/5a212af/live-reconnect-1008-01
Evidence Class: EXTERNAL_RISK / RESUMED_SESSION_CONNECTION_RACE
Source Identity: google/adk-python PR #8260 head eda6c12f8cdf3bb617b8dc7175b5eacf8390da97
Source Authority For Claim: FIRST_PARTY_OPEN_PR_PATCH_AND_AUTHOR_TEST_FIXTURES
Independent Verification: PINNED_PR_METADATA_AND_FILE_DIFF_INSPECTED / UPSTREAM_RUN_NOT_REPRODUCED
Local Incident Evidence: NOT_ESTABLISHED
Local Evidence: UNKNOWN / NO_ZERO_ADK_LIVE_DEPLOYMENT_RECEIPT
Existing Defense: UNKNOWN_FOR_ZERO
Measured Effectiveness: NOT_COMPUTED
Host Applicability: UNKNOWN / NO_HOST_LIVE_STREAM_OR_RECONNECT_TRACES
Original Execution Status: REMOTE_CODE_INSPECTION / LOCAL_RUNTIME_NOT_EXECUTED
Current Path Status: PROPOSED_DRAFT_PR / NOT_MERGED_AT_AUTHORING
Task Status: BOUNDED_SOURCE_FAILURE_HYPOTHESIS / NO_LOCAL_INCIDENT
Write Scope: aegis-cortex/2026-11-20-A1-reliability-observe.md
Host Kernel Modification: NO
Boundary Violation: NO

## INPUT_RECORD
- Fresh merged main 5a212af5afea0d8105e0ddb8f189e58c00cc7046, full non-truncated tree (2773 objects at preflight) and one open Ballast Daily PR for the same logical date. Ballast is an independent plane; no matching Aegis A1 PR was present at preflight.
- Current Aegis policy and existing 2026-11-19 A1 read. Yesterday's external MCP timezone error disclosure is a separate failure class from a live-stream connection lifetime race.
- Upstream google/adk-python PR #8260 was opened 2026-11-19T13:03:06Z (2026-11-19 21:03:06 Asia/Shanghai); at inspection it remains OPEN and unmerged. This record does NOT claim a released repair or production rollout.
- Source was checked through connected GitHub PR metadata and changed-file patches, not installed packages or a live service runner.
- Local isolated container `git ls-remote https://github.com/lostlight530/Axiom-0.git refs/heads/main` returned exit 128, `Could not resolve host: github.com`. This cross-repo environment diagnostic is neither an Aegis live-reconnect experiment nor evidence of a local Zero incident.

## EXTERNAL_SOURCE_RECORDS
Source ID: SRC-20261120-AE01
Title: fix(live): retry 1008 already connected and back off on reconnect
Publisher: google/adk-python PR author / first-party proposed implementation
Canonical Source Identity: google/adk-python PR #8260, head eda6c12f8cdf3bb617b8dc7175b5eacf8390da97
URL: https://github.com/google/adk-python/pull/8260
Linked issue: https://github.com/google/adk-python/issues/8258
Pinned implementation: https://github.com/google/adk-python/blob/eda6c12f8cdf3bb617b8dc7175b5eacf8390da97/src/google/adk/live/_live_llm_flow.py
Pinned backoff constants: https://github.com/google/adk-python/blob/eda6c12f8cdf3bb617b8dc7175b5eacf8390da97/src/google/adk/live/_flow_utils.py
Source Version: OPEN_UNMERGED_PR_HEAD / PACKAGE_VERSION_UNVERIFIED
Source Publication: 2026-11-19T13:03:06Z PR created
Source Access: FIRST_PARTY_OPEN_PR_IMPLEMENTATION_AND_AUTHORED_TEST_DIFF
Source Confidence: PATCH_CONTENT_INSPECTED / PROPOSED_BEHAVIOR_NOT_MERGED_OR_REPRODUCED

## RAW_RELIABILITY_SIGNAL_LOG
Risk ID: RISK-20261120-A01
External Risk: RESUMPTION_HANDLE_RECONNECT_WHILE_OLD_CONNECTION_STILL_HELD
- Precondition per upstream PR: run_live reconnects with an existing session-resumption handle before the server has retired the old connection. The server may return APIError 1008 with a reason containing `already connected to an existing client`.
- Reported baseline: the flow classifies 1000, 1006, and 1011 as recoverable, but not that particular 1008. Immediate reconnection without waiting can repeatedly collide with the old server connection lifetime.
- The proposed patch recognizes `code == 1008` **and** a specific reason substring **and** an existing resumption handle **and** an active client. Other 1008 responses (e.g., policy violation), and cases without a handle, must remain failures. A broad rule `all 1008 retryable` would be a dangerous misclassification.
- The upstream author observes that the websocket APIError stores the reason in details and may leave message/status blank. The diff therefore matches `str(error)`; exact SDK error serialization is a version-sensitive precondition.
- Reconnect delay function from pinned diff: attempt 1 = 0.0 seconds, attempt 2 = 0.5, attempt 3 = 1.0, attempt 4 = 2.0, attempt 5 and above capped at 4.0 seconds. This is source-level configuration, not observed network latency.
- Source text says the retry count resets only after an event arrives on a new connection rather than immediately when socket opening succeeds. This avoids treating rapid open/close cycles as sustained recovery.
- Authored parametrized test fixtures distinguish reconnect-receive error, reconnect-connect error, other 1008, and no resumption handle, along with backoff schedule checks; tests were not run here.
- A reconnect attempt that opens successfully is not necessarily a recovered session. Distinguish CONNECTION_OPENED, RESUMPTION_ACCEPTED, FIRST_EVENT_RECEIVED, STATE_RECONCILED, TOOL_EFFECT_VERIFIED and TASK_COMPLETED.
- Failure may be transient coordination, not an authorization defect. The special handling of 1008 is only justified by the exact server-reason class and active resumption context.
- If server-reason wording changes, substring-based recognition may false-negative. If a server emits the same text for a different 1008 class, false-positive retry is possible. Neither risk is experimentally measured here.
- Source date, GitHub head SHA, local research date, eventual merged SHA, package release and host deployed revision are separate identity fields.
- No indication of the Zero repository running this Google ADK live flow was observed, and the external PR is not Zero's kernel or Ballast incident evidence.
- The broader reliability hypothesis is that a durable resumable session requires ownership/fencing and an evidence-bearing resume receipt, not simply successful network reconnection; this is a proposed generalization awaiting independent experiment.

## CONTROLS_AND_COUNTEREXAMPLES
- Positive control: a resumable handle followed by one specific 1008 already-connected error should enter a bounded retry and later deliver a first event. Record handles, server instance identity, reconnection attempts and event sequence.
- Negative control A: an unrelated 1008 policy violation must not retry.
- Negative control B: 1008 already-connected text without a resumption handle must not retry.
- Negative control C: a resumed TCP/WebSocket connection that never yields an event must not reset the reconnection budget or be counted as completed.
- Negative control D: client closure during backoff must preserve configured closure semantics; a retry loop cannot indefinitely keep an unauthorized or canceled invocation alive.
- Independent measurement requires a controlled server and a pinned ADK revision; the authored fixtures alone cannot quantify production effectiveness or claim zero session loss.

## EVIDENCE_DELTA
- NEW_EVIDENCE: pinned first-party open PR contains a guarded retry classifier, bounded exponential backoff and test cases for session resumption 1008 behavior.
- CORRECTED_INTERPRETATION: a successful new connection/open does not itself prove continuity of a resumable session or completion of downstream action.
- UNCHANGED_BOUNDARY: EXTERNAL_RISK != LOCAL_INCIDENT != EXISTING_DEFENSE != MEASURED_EFFECTIVENESS; proposed upstream patch != released fix.
- NEW_COUNTEREVIDENCE: unrelated 1008, no-handle requests, close-during-wait and error-string serialization constrain the scope of the proposed retry.
- UNKNOWN_RETAINED: final PR outcome, merged revision, external independent reproduction, Zero host dependency, real session continuity, persistent state and effect sinks, observed rate/effectiveness.
- NEXT_RETEST_CONDITION: pin both upstream revisions, create controlled old-connection lease and resume handle, inject paired error 1008 cases, collect attempt timestamps, first event, server session identity, state and sink receipts with positive/negative controls.

## NEXT_HANDOFF
- Same-date `zero/aegis/A2` BLOCKED_DEPENDENCY until original A1 Draft is merged and fresh main, original SHA and the actual source outcome are rechecked.
- A2 should explicitly test whether exact matching on `str(error)` can misclassify errors, whether retry budget resets only on first event and whether close interrupts pending backoff.
- 2026-W47 A3/A4 NOT_DUE until closed ISO week; November A5/A6 NOT_DUE until natural month ends.
- Ballast PR owns distinct action integrity; no host kernel edits, independent A1/A2 maintenance or historical Jules reclassification.

## BOUNDARY_CHECK
- First-party open source patch and authored fixtures INSPECTED, upstream PR status OPEN at observation.
- Upstream unit tests, live simulation and actual Zero deployment: NOT_EXECUTED / NOT_OBSERVED.
- Aegis structural `check.py`: NOT_EXECUTED; full worktree unavailable in the local runtime.
- No secrets, private scheduler prompts, host changes, external incident relabeling, measured risk frequency or premature policy upgrade.
- Draft publication requires Human Maintainer independent review and merge authorization.
