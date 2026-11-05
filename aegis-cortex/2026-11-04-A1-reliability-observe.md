# A1 Daily Reliability Observe — 2026-11-04

## CORTEX_RUN_HEADER
Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A1
Canonical Identity: zero/aegis/A1
Cadence: Daily
Loop Stage: Observe
Logical Date: 2026-11-04
Logical Timezone: Asia/Shanghai
Execution Date UTC: 2026-11-05 / EXACT_CLOCK_NOT_CAPTURED
Execution Date Asia/Shanghai: 2026-11-05 / EXACT_CLOCK_NOT_CAPTURED
Agent: GPT-6
Producer Identity: GPT_NATIVE / NOT_JULES_REPLAY
Record Provenance: HUMAN_AUTHORIZED_NATIVE_DAILY / LOGICAL_DATE_2026-11-04_EXECUTED_2026-11-05 / NOT_HISTORICAL_RECONSTRUCTION
Base Main SHA: 8537dfa843058db2a029fb3a0eb6a06cca920e11
Run Identity: zero-entropy-lab/aegis/A1/2026-11-04/GPT_NATIVE/8537dfa843058db2a029fb3a0eb6a06cca920e11/gpt-native-20261105-a1-20261104-01
Task Status: SUCCESS / SOURCE_BOUNDED_EXTERNAL_REPORT
Network Status: ORIGINAL_GITHUB_ISSUE_OPENED
Source Status: ORIGINAL_REPORTER_POC_AND_CONTROL / NO_INDEPENDENT_REPRO
Evidence Class: EXTERNAL_FAILURE_REPORT / NOT_LOCAL_REPOSITORY_INCIDENT
Source Authority For Claim: REPORTER_RUN_FIXTURE_AND_REPO_CODE_READING_ASSERTIONS / NOT_MAINTAINER_ADJUDICATION
Independent Verification: ORIGINAL_ISSUE_BODY_OPENED / POC_NOT_EXECUTED
Local Incident Evidence: NO_LOCAL_EVIDENCE
Host Applicability: UNKNOWN
Existing Defense: UNKNOWN
Measured Effectiveness: NOT_MEASURED
Repository Inspection: AEGIS_POLICY_AND_PREVIOUS_2026-11-03_A1_AND_W44_A4_READ
GitHub Actions Inspection: RECENT_RUN_METADATA_ONLY / AEGIS_NATIVE_CHECKER_NOT_EXECUTED
Write Scope: aegis-cortex/2026-11-04-A1-reliability-observe.md
Boundary Violation: NO

## INPUT_RECORD
- Read current Aegis evidence policy, 2026-11-03 A1 and closed W44 A4. Previous A1 concerned transport ping vs content liveness; today's distinct risk concerns approval instruction vs enforced authorization gate.
- The original reporter filed google/adk-python#7987 on 2026-11-04T10:55:39Z, within 2026-11-04 Shanghai. Source checked 2026-11-05; do not infer a Nov4 producer execution.
- This Aegis study does not inspect Zero Host Kernel, NEXUS, Ballast, local ADK dependency, production refund tool or actual permissions; no Zero incident is asserted.
- Later GitHub comments and patch activity observed after the target Shanghai-day cutoff are not retroactively credited as November 4 verified task-time evidence.

## EXTERNAL_SOURCE_RECORDS
### SRC-20261104-A01
Source ID: SRC-20261104-A01
Title: human_in_loop samples: reimburse runs without an approval; the model can call it first or after a rejection
Publisher: google/adk-python issue reporter trackoor
URL: https://github.com/google/adk-python/issues/7987
Created UTC: 2026-11-04T10:55:39Z
Checked: 2026-11-05
Source Type: ORIGINAL_PUBLIC_BUG_REPORT_WITH_SCRIPTED_MODEL_REPRO_AND_PROPOSED_PATCH
Evidence Tier: PRIMARY_FOR_REPORTER_REPRODUCTION_ASSERTION / NOT_INDEPENDENT_REPRODUCTION
Access Status: FULL_ISSUE_BODY_AND_REPORTED_POC_RESULTS_READ
Independent Source: ONE_REPORTER_LINEAGE / THREE_CONTROL_SCENARIOS_NOT_THREE_INDEPENDENT_TRIALS
Claim Supported: the reporter states that an ADK 2.13.0 reimbursement sample exposes a plain reimburse tool next to a separate long-running ask_for_approval tool, but the approval order lives only in prompt instructions. Their scripted BaseLlm tests report reimburse executed once in each of no-approval, rejected and approved scenarios for the Python and YAML sample variants.
Claim Not Supported: universal ADK authorization bypass, actual funds disbursed, real production system exploitation, Zero-host use, verified framework vulnerability, independent reproducibility or upstream fix acceptance.
Pinned Reporter Environment: google-adk 2.13.0; repo revision 36cb10d; macOS; Python 3.12.12; scripted model instead of real LLM; source-only A1 inspection.
Confidence: HIGH_FOR_ISSUE_CONTENT / MEDIUM_FOR_MECHANISM_PLAUSIBILITY / INDEPENDENT_RUNTIME_UNKNOWN
Limitations: reporter-provided POC and asserted result; source code/patch not independently run in this A1, sample policy may not define a global framework authorization contract.

## RAW_RELIABILITY_SIGNAL_LOG
### SIG-20261104-A01 — MODEL_INSTRUCTION_NOT_EXECUTABLE_APPROVAL_GATE
Signal ID: SIG-20261104-A01
Failure Class: AUTHORITY_CHECK_NOT_BOUND_TO_EFFECT / HIL_PROMPT_GATING_GAP
External Evidence: SRC-20261104-A01
Local Repository Evidence: NO_LOCAL_RUNTIME_OR_INCIDENT_EVIDENCE
Local Incident Evidence: NO_LOCAL_EVIDENCE
Failure Mechanism Hypothesis: a language instruction to ask for approval does not enforce approval at the actual side-effect tool execution boundary. If the effect tool is separately callable without confirmation checks, a model can invoke it directly or after a rejection.
Observed External Report: scripted no-approval, rejected and approved control sequences each caused one call to reporter's sample reimburse body; reported PoC does not exercise real payment network or Zero runtime.
Necessary Preconditions: model can select the effect tool, effect tool registration lacks a machine-enforced approval predicate, and downstream effect implementation does not independently reject unapproved calls.
Existing Defense: UNKNOWN_IN_ZERO; upstream reporter describes a separately available FunctionTool(require_confirmation) mechanism, not a proven Zero defense.
Measured Effectiveness: NOT_MEASURED
Host Applicability: UNKNOWN
Risk Category: EXTERNAL_FAILURE_REPORT / NOT_ZERO_INCIDENT
Confidence: SOURCE_SCOPED_AND_PROVISIONAL
Uncertainty: source diff and exact current implementation, authorization state binding to ticket/amount/actor, unrelated ADK applications' configurations, and local relevance.
Counterexample: a policy may intentionally permit small-value refunds without manager approval; an application may enforce authorization inside the effect endpoint even if demo prompt omits it. The report alone does not establish those systems unsafe.
Needs A2 Verification: YES / inspect pinned source at 36cb10d, replay same tool scenarios with an actual configured framework, test approval mismatches and duplicated calls, record exact executor receipts.

## EVIDENCE_DELTA
- NEW_EVIDENCE: original date-bound ADK issue with three scripted authorization variants and explicit effect-tool vs approval-tool separation.
- CORRECTED_INTERPRETATION: model compliance != authorization; an approval message != an effect-bound confirmation receipt; reporter repro != local incident.
- UNCHANGED_BOUNDARY: EXTERNAL_RISK != LOCAL_INCIDENT != EXISTING_DEFENSE != MEASURED_EFFECTIVENESS.
- NEW_COUNTEREVIDENCE: native FunctionTool confirmation and possible effect-endpoint checks are separate controls; demo sample weakness cannot be generalized to all ADK applications.
- UNKNOWN_RETAINED: exact pinned source runtime, independent reproduction, patch acceptance, approval/effect identity, Zero Kernel applicability.
- NEXT_RETEST_CONDITION: rerun no-approval, rejected, approved, changed-amount and replayed-confirmation cases at exact source and Python version, compare executable gate vs prompt-only order.

## NEXT_HANDOFF
- A2 must inspect this exact A1 only after Human Maintainer merges it and a fresh main includes it.
- Do not promote the sample-level reporter finding into Aegis permanent doctrine, Zero-local defect or measured safety metric without counterexample and independent reproduction.
- No Weekly decision, host code change, Ballast claim or memory promotion.

## BOUNDARY_CHECK
- Only the dated Aegis A1 research file is proposed.
- No host/Kernel, NEXUS, Ballast, runtime state, tests, scheduler, Actions, historical files or long-term memory changed.
- Native Aegis checker, pin-specific ADK runtime, and independent effect replay: NOT_EXECUTED.
