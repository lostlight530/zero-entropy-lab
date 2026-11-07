# A1 Daily Reliability Observe — 2026-11-07

## CORTEX_RUN_HEADER
Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A1
Canonical Identity: zero/aegis/A1
Cadence: Daily
Loop Stage: Observe
Logical Date: 2026-11-07
Logical Timezone: Asia/Shanghai
Agent: GPT-6
Producer Identity: GPT_NATIVE / NOT_JULES_REPLAY
Base Main SHA: 3fb3f6c538d75e5a77cae0c5ad4c9917741d73da
Run Identity: zero/aegis/A1/2026-11-07/GPT_NATIVE/3fb3f6c538d75e5a77cae0c5ad4c9917741d73da/01
Task Status: SUCCESS_BOUNDED_EXTERNAL_FAILURE_MECHANISM_OBSERVATION
Source Status: ORIGINAL_ISSUER_CODE_DIFFS_READ / NO_NATIVE_REPLAY
Local Incident Evidence: NONE
Local Defense Effectiveness: NOT_MEASURED
Write Scope: aegis-cortex/2026-11-07-A1-reliability-observe.md

## INPUT_RECORD
- Read current main, Aegis README, evidence policy, prior 2026-11-06 A1/A2 and existing W44/October output inventory. Open Draft PR #811 belongs to independent maintenance correction and is not a Native Daily owner.
- Two first-party commits from one upstream ADK repository: separate mechanisms, NOT two independent organizations or replications.
- Source observation date 2026-11-07 Asia/Shanghai; no local Zero kernel inspection, incident replay or host mutation.

## EXTERNAL_SOURCE_RECORDS
### SRC-20261107-A01 — waiting node resume
Issuer: google/adk-python
Original commit: https://github.com/google/adk-python/commit/ba142cf8e91b045aa0b435f71dbd7c3e686efa45
Commit timestamp: 2026-11-06T22:12:28Z = 2026-11-07T06:12:28+08:00
Original patch: waiting wait_for_output node no longer automatically reruns on resume unless its node/agent contract explicitly calls for it; the source describes silent downstream skip when a waiting node is never triggered and an exception for JoinNode.
Failure class: RESUME_TRIGGER_SEMANTICS / WAITING_STATE_LIVENESS
Observation: source-level change and documented failure boundary, not an executed incident or measured fix.
Falsifier: reproduce pinned graph with and without rerun_on_resume and a waiting node that emits an event but no output; inspect actual resumption and downstream emissions.

### SRC-20261107-A02 — Runner toolset reference lifetime
Issuer: google/adk-python
Original commit: https://github.com/google/adk-python/commit/d0f227afc3c7187de875dda2e11ff4b47fe285cd
Commit timestamp: 2026-11-07T00:37:29Z = 2026-11-07T08:37:29+08:00
Original patch: Runner toolset refcount handling is modified so close() waits for the last holder; the earlier source history contains a closely related commit b5b6e58d6b095283e438fd3fa110841b0d39be67. Treat them as same upstream change lineage, not independent evidence.
Failure class: SHARED_RESOURCE_LIFETIME / ASYNC_CLEANUP / CLOSE_RACE
Observation: source-level lifetime contract, not proof of all interleavings or a local Zero race.
Falsifier: pin version; share one toolset across overlapping runners, close one while another still owns it; record resource state, completion, leak and error traces.

## RAW_RELIABILITY_SIGNAL_LOG
- SIG-20261107-A01: a resumed graph may skip a waiting node without raising a fault when trigger and wait semantics are mis-specified. External Risk: YES; Local Incident: UNKNOWN; Existing Defense: NOT_ASSESSED; Measured Effectiveness: NOT_MEASURED.
- SIG-20261107-A02: shared toolset closure must respect live ownership rather than single-run lifetime. External Risk: YES; Local Incident: UNKNOWN; Existing Defense: NOT_ASSESSED; Measured Effectiveness: NOT_MEASURED.

## EVIDENCE_DELTA
- NEW_EVIDENCE: exact issuer code changes identify two distinct failure surfaces: resume scheduling and shared cleanup ownership.
- CORRECTED_INTERPRETATION: WAITING does not imply durable future execution; a close() call does not imply all concurrent holders have released a resource.
- UNCHANGED_BOUNDARY: external ADK fixes are not local Zero incidents or validated defenses; two commits from one lineage are not independent replications.
- NEW_COUNTEREVIDENCE: JoinNode explicitly differs from ordinary waiting nodes; toolset lifetime correctness depends on the ownership graph and concurrent interleavings.
- UNKNOWN_RETAINED: native test outcomes, Zero adoption, actual local incidents, measured mitigations, persistence semantics.
- NEXT_RETEST_CONDITION: execute pinned ADK minimal repros with command, revision, stdout/stderr, exit, concurrent schedule and effect receipts.

## NEXT_HANDOFF
A2 must wait until this A1 is merged into main, then re-evaluate counterexamples and Zero applicability without editing Host Kernel, Actions, Ballast or historical Aegis doctrine.
