# A1 Daily Reliability Observe — 2026-11-02

## CORTEX_RUN_HEADER
Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A1
Canonical Identity: zero/aegis/A1
Cadence: Daily
Loop Stage: Observe
Logical Date: 2026-11-02
Logical Timezone: Asia/Shanghai
Execution Time UTC: EXACT_CLOCK_NOT_CAPTURED
Execution Time Asia/Shanghai: 2026-11-02 / EXACT_CLOCK_NOT_CAPTURED
Agent: GPT-6
Producer Identity: GPT_NATIVE_PROSPECTIVE / NOT_JULES_REPLAY
Base Main SHA: 672dc94c4fad0b1d4d492c4a146378cb0e507a76
Run Identity: zero-entropy-lab/aegis/A1/2026-11-02/GPT_NATIVE/672dc94c4fad0b1d4d492c4a146378cb0e507a76/gpt-native-20261102-a1-01
Task Status: SUCCESS / SOURCE_BOUNDED_OBSERVATION
Network Status: ORIGINAL_ISSUE_REPORT_AND_REPRO_BODY_OPENED
Source Status: UPSTREAM_ISSUE_REPORT / NOT_UPSTREAM_FIX_VERIFIED
Evidence Class: EXTERNAL_FAILURE_REPORT / PROVISIONAL
Local Incident Evidence: NO_LOCAL_EVIDENCE
Existing Defense: UNKNOWN
Measured Effectiveness: NOT_MEASURED
Host Applicability: UNKNOWN
Write Scope: aegis-cortex/2026-11-02-A1-reliability-observe.md
Boundary Violation: NO

## INPUT_RECORD
- Current main, Aegis README/EVIDENCE_POLICY, 2026-11-01 A1 and closed W43 A3 were inspected. Yesterday's issue concerned forked session-transcript branch loss in the Claude Agent SDK; this report concerns resumed workflow re-execution in Google ADK, a different failure predicate.
- Question: can replay of a previously completed no-output workflow node duplicate externally relevant effects after a human input boundary?
- Source search themes: workflow resumability, wait_for_output semantics, duplicate side effects, replay event identity, approval replay and correct completion.
- The original issue was opened 2026-10-31 and inspected 2026-11-02. It is not a fresh November 2 incident or confirmed official release diagnosis.
- This A1 did not inspect Zero host runtime for an incident and did not execute the reporter's fixture.

## EXTERNAL_SOURCE_RECORDS
### SRC-20261102-A01
Source ID: SRC-20261102-A01
Title: Resuming a workflow re-runs the earlier no-output runs of a wait_for_output node, so its side effects happen twice
Publisher: google/adk-python issue reporter AkshayShah03
Canonical URL: https://github.com/google/adk-python/issues/7905
Issue ID: google/adk-python#7905
Opened: 2026-10-31T14:29:07Z
Checked: 2026-11-02
Observed State: OPEN_AT_CHECK
Source Type: ORIGINAL_UPSTREAM_USER_BUG_REPORT_WITH_REPRODUCTION_SCRIPT
Evidence Tier: PRIMARY_FOR_REPORTER_CLAIM / NOT_MAINTAINER_CONFIRMED_ROOT_CAUSE
Access Status: ORIGINAL_ISSUE_BODY_AND_REPRODUCER_READ
Independent Source: ONE_ISSUE_AND_ONE_REPORTER_LINEAGE
Claim Supported: reporter supplies a Python fixture in which a workflow with wait_for_output=True, a RequestInput interruption, and resume is reported to re-run a previously completed gather operation. Submitted outputs show state ['B','C','B'] instead of ['B','C'].
Claim Not Supported: independently reproduced ADK regression, upstream root-cause acceptance, fixed version, every workflow affected, real external side effects, Zero host incident or effective local defense.
Target Revision in Report: google/adk-python main 8cd3b12 / reporter states ADK 2.13.0, Python 3.12 on macOS
Confidence: DIRECT_REPORT_HIGH / BEHAVIOR_REPRODUCTION_UNVERIFIED
Limitations: issue content is not independently run, code path attribution is reporter's hypothesis, pending maintainer adjudication and target-revision pinning.

## RAW_RELIABILITY_SIGNAL_LOG
### SIG-20261102-A01 — SUPERSEDED_WAITING_RUN_REPLAY
Signal ID: SIG-20261102-A01
Failure Class: WORKFLOW_REPLAY_DUPLICATE_SIDE_EFFECT / INCOMPLETE_RUN_SUPERSESSION
External Evidence: SRC-20261102-A01
Local Repository Evidence: NO_LOCAL_RUNTIME_OR_INCIDENT_EVIDENCE_INSPECTED
Local Incident Evidence: NO_LOCAL_EVIDENCE
Failure Mechanism Hypothesis: resume processing may replay a WAITING no-output run that had already been superseded by a later run of the same logical node. Re-execution of non-idempotent node logic can duplicate a state mutation and retrigger downstream approval paths.
Observed External Report: in the reporter's direct fixture, first turn logs gather(B), gather(C); after answering RequestInput, second turn logs an extra gather(B) and state includes duplicated B. Separate loop repro reportedly triggers an extra approval and a later hang.
Necessary Preconditions: specific ADK workflow replay mode, wait_for_output behavior, interrupt/resume, previously superseded no-output run and side-effectful node body. These are not established for Zero Kernel.
Evidence Classification: EXTERNAL_FAILURE_REPORT / OPEN_ISSUE_NOT_REPRODUCED
Existing Defense in Zero: UNKNOWN
Measured Effectiveness in Zero: NOT_MEASURED
Host Applicability: UNKNOWN
Confidence: HIGH_FOR_REPORT_CONTENT / UNKNOWN_FOR_FIX_OR_GENERALITY
Counterexample: a latest WAITING run that truly needs a new input must run again, and a pure/idempotent gather would not duplicate externally consequential effects. The reporter notes a naive skip-all strategy breaks a task-mode resume test.
Potential False Interpretation: treating every WAITING replay as incorrect or treating a repeated approval prompt as evidence of a second authorized external action.
Needs A2 Verification: YES / pin reporter revision, execute repro and task-mode counterexample, trace node execution identity, replay log coverage and effect receipt identity.

## EVIDENCE_DELTA
- NEW_EVIDENCE: a concrete open, version-scoped report with executable-looking fixture and observed-versus-expected state, introducing supersession identity as a recovery axis.
- CORRECTED_INTERPRETATION: resume success and emitted downstream events cannot prove that each prior completed node ran exactly once; a replayed node and a newly authorized effect must be distinguished.
- UNCHANGED_BOUNDARY: a publicly reported upstream bug is not a confirmed Zero local incident, and the reporter's root-cause hypothesis is not a validated upstream fix.
- NEW_COUNTEREVIDENCE: suppressing all WAITING replay would also suppress valid latest-run continuation; blanket skip is not a safe correctness rule.
- UNKNOWN_RETAINED: whether maintainer accepts diagnosis, fix behavior, affected versions, exact native repro and Zero runtime applicability.
- NEXT_RETEST_CONDITION: fixed-version reproduction with two parallel inputs, the latest-vs-superseded WAITING distinction, loop replay, idempotent/non-idempotent effect capture and independent event-ledger verification.

## NEXT_HANDOFF
- A2 only starts once this exact 2026-11-02 A1 artifact is merged and visible on freshly read main. An open Draft PR cannot provide authoritative A2 input.
- No weekly doctrine choice, host kernel modification, Ballast transition, memory promotion or local incident claim is made here.
- October A5/A6 are historical artifacts already on main; no overwrite is authorized.

## BOUNDARY_CHECK
- Only this dated Aegis A1 file is proposed; old source records, host data/kernel, Ballast, NEXUS, Actions and historical archives stay unchanged.
- Full private task control and private memory are not published.
- Original issue read; fixed-version Python repro, official Aegis structural checker, Zero runtime and effect receipt tests: NOT_EXECUTED.
