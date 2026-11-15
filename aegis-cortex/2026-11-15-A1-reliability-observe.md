# A1 Daily Reliability Observe — 2026-11-15

## CORTEX_RUN_HEADER
Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A1
Canonical Identity: zero/aegis/A1
Cadence: Daily
Loop Stage: Observe
Logical Date: 2026-11-15
Logical Timezone: Asia/Shanghai
Agent: GPT-6 / GPT_NATIVE / HUMAN_REQUESTED / NOT_JULES_REPLAY
Record Provenance: HUMAN_AUTHORIZED_SUBSTITUTE
Source Identity: google/adk-python issue #8066 and unmerged candidate commit 2c51b77606fbc87c7ffd5c11e826b98fa7a2596c
Source Authority For Claim: UPSTREAM_ISSUE_REPORT_AND_FIRST_PARTY_PROPOSED_FIX_DIFF / NO_LOCAL_REPRO
Independent Verification: SOURCE_DIFF_INSPECTED / NO_NATIVE_RUNTIME_TEST / ONE_UPSTREAM_LINEAGE
Host Applicability: UNKNOWN / NO_ZERO_MODEL_ARMOR_RUNTIME_INSPECTED
Evidence Class: EXTERNAL_RISK_CONDITIONAL_SHARED_RESOURCE_LIFECYCLE
External Evidence: GITHUB_ISSUE_AND_SOURCE_PATCH / AUTHOR_REPORTED_FAILURE
Local Incident Evidence: UNKNOWN / NO_ZERO_INCIDENT_RECEIPT
Existing Defense: UNKNOWN / NO_ZERO_HOST_DEFENSE_EVALUATED
Measured Effectiveness: NOT_COMPUTED
Original Execution Status: GPT_NATIVE_BOUNDED_EXTERNAL_FAILURE_MODEL_OBSERVATION_COMPLETED / TESTS_NOT_EXECUTED
Current Path Status: DRAFT_PR_PENDING_HUMAN_REVIEW
Base Main SHA: 096f5837a1c1a826aac76d7691d43ba8b9a47551
Run Identity: zero-entropy-lab/aegis/A1/2026-11-15/GPT_NATIVE/096f5837a1c1a826aac76d7691d43ba8b9a47551/shared-modelarmor-loop-client-close-01
Task Status: SUCCESS_BOUNDED_EXTERNAL_RISK_REVIEW / LOCAL_EFFECT_UNKNOWN
Network Status: GITHUB_API_ISSUE_AND_EXACT_COMMIT_PATCH_READ
Source Status: ISSUED_2026-11-09 / PATCH_COMMITTED_2026-11-10 / SOURCE_VERSION_NOT_VERIFIED_AS_RELEASE
Uncertainty: actual affected released version, merged fix, runtime reproduction, Zero integration remain UNKNOWN
Write Scope: aegis-cortex/2026-11-15-A1-reliability-observe.md
Host Repository Change: NO
Boundary Violation: NO

## INPUT_RECORD
- Fresh Zero main 096f5837a1c1a826aac76d7691d43ba8b9a47551; current Aegis evidence policy, Nov 14 A1/A2 and W45 A3/A4 inspected. New Nov 15 A1/A2 absent and Open PR count zero at initial preflight.
- W46 still OPEN until the Shanghai Sunday day boundary; A3/A4 and November A5/A6 NOT_DUE. Source issue was opened Nov 9, not first published today.
- GitHub API returned upstream issue #8066 state OPEN and exact proposed patch commit 2c51b77606fbc87c7ffd5c11e826b98fa7a2596c, with implementation change and author-added tests.
- Comparing proposed commit against upstream current main d05e482038bdbb226c3a1179550cf83bd8fcbefb returned DIVERGED (ahead 60, behind 1), so the patch commit must NOT be described as definitively merged into that main or shipped.
- No Model Armor gRPC client, ADK Runner, Zero Host Kernel, effect sink, handler, local CI or unit test executed.
- The preceding Nov 14 Aegis record addressed disabled file watcher allocation. Today's subject is *shared client ownership under concurrent Runner shutdown* and must not be treated as the same failure or an independent replication of it.

## EXTERNAL_SOURCE_RECORDS
Source ID: SRC-20261115-A01
Title: ModelArmorPlugin.close() cancels in-flight screening on sibling runners sharing the plugin
Publisher: google/adk-python upstream issue #8066; proposed implementation patch 2c51b77
Canonical Source Identity: https://github.com/google/adk-python/issues/8066
Patch Identity: google/adk-python@2c51b77606fbc87c7ffd5c11e826b98fa7a2596c
URL: https://github.com/google/adk-python/issues/8066
Patch URL: https://github.com/google/adk-python/commit/2c51b77606fbc87c7ffd5c11e826b98fa7a2596c
Issue Created: 2026-11-09T20:29:39Z
Patch Commit Date: 2026-11-10T00:20:07Z
Date Checked: 2026-11-15 Asia/Shanghai
Source Type: FIRST_PARTY_REPO_ISSUE_AND_CANDIDATE_CODE_DIFF
Evidence Tier: PRIMARY_FOR_REPORTED_MECHANISM_AND_PATCH_INTENT / NO_EXECUTED_REPRO
External Evidence: Issue author gives two shared-App Runner setup, in-flight screening and sibling close reproduction steps; changed ModelArmorPlugin.close removes per-loop client transport close and adds authored tests.
Claim Supported: issue reports a shared event-loop transport closed during another runner's screening call; the inspected patch's close method intentionally leaves per-loop clients open, and shared-client ownership is its stated repair objective.
Claim Not Supported: the security guard failed open in every condition, the candidate patch passed tests here, an upstream release includes the patch, any Zero deployment was affected, or a successful security bypass occurred.
Independent Sources: issue, patch and authored tests are one upstream repository lineage, not independent production observations.
Confidence: HIGH_FOR_ISSUE_AND_PATCH_PROVENANCE / REPRO_AND_RELEASE_UNKNOWN
Limitations: isolated Runner, owned rather than shared client, sequential calls and unrelated cancellation have different lifecycle semantics; an exception propagated as cancellation is not by itself evidence of an unauthorized external effect.

## RAW_RELIABILITY_SIGNAL_LOG
Risk ID: RISK-20261115-A01
Failure Mechanism: SHARED_LOOP_RESOURCE_CLOSED_BY_ONE_RUNNER_WHILE_SIBLING_IN_FLIGHT
Path: App shared by Runner A and Runner B on one event loop → one Runner close triggers ModelArmorPlugin.close → shared client transport close → sibling screening RPC may cancel → turn may terminate without final response
External Risk: AUTHOR_REPORTED_ADK_CONCURRENCY_RESOURCE_OWNERSHIP_FAILURE
Local Incident: UNKNOWN / NOT_OBSERVED
Existing Defense: UNKNOWN / NOT_MEASURED
Measured Effectiveness: NOT_COMPUTED
Source ID: SRC-20261115-A01
Preconditions: concurrent shared App/plugin instance; an in-flight Model Armor RPC; close on another Runner sharing the loop
Consequence Claimed by Reporter: asyncio.CancelledError can bypass except Exception screening handling, and turn ends with final_response=None
Counterexample 1: separately owned client or no in-flight RPC invalidates the central race prerequisite
Counterexample 2: cancellation is distinguishable from policy ALLOW; missing final response does not prove a forbidden tool effect
Counterexample 3: candidate patch avoids client closure on Runner shutdown, but may defer cleanup and does not measure end-of-loop lifecycle under a real network environment
Threat Level: CONDITIONAL_EXTERNAL_RISK / NO_ZERO_INCIDENT_PROMOTION

## SOURCE_AND_STATE_CLASSIFICATION
- RESOURCE_OWNERSHIP != RUNNER_OWNERSHIP when an App and event loop share plugin clients.
- SCREENING_REQUEST_STARTED != SCREENING_POLICY_VERDICT_RECEIVED; cancellation must not be recorded as ALLOW, DENY, effective screening or durable completion.
- CODE_PATCH_EXISTS != PATCH_MERGED != RELEASED_FIX != MEASURED_DEFENSE.
- Same Google upstream as yesterday, but different mechanism, event/revision and claim. Do not double-count author material as independent validation.

## EVIDENCE_DELTA
- NEW_EVIDENCE: dated shared-client teardown issue, exact candidate patch and tests, plus an upstream comparison showing patch lineage not confirmed merged to current main.
- CORRECTED_INTERPRETATION: per-Runner close receipt is not proof that shared screening resources can be destroyed without disrupting sibling Runner contracts.
- UNCHANGED_BOUNDARY: EXTERNAL_RISK != LOCAL_INCIDENT != EXISTING_DEFENSE != MEASURED_EFFECTIVENESS; CANCELLATION != POLICY_APPROVAL.
- NEW_COUNTEREVIDENCE: unshared ownership and the absence of in-flight RPCs defeat the reported race; patch intent without release ancestry/real transport tests is not measured mitigation.
- UNKNOWN_RETAINED: release exposure, exact behavior under different event loops, local Zero integrations, cancelled invocation status and actual enforcement verdict/effect.
- NEXT_RETEST_CONDITION: pin affected ADK and Model Armor versions, run two same-loop shared-App runners with a deliberately blocked in-flight screening RPC, close sibling and record request ID, cancellation, explicit fail-closed verdict, final result, transport lifecycle and any effect receipt; compare separate-App negative control and proposed patch with captured exit/logs.

## NEXT_HANDOFF
- A2 can start only after this exact A1 is merged and visible on fresh main; independently inspect ModelArmorPlugin lifetime, upstream PR/release ancestry and counterevidence before reducing uncertainty.
- No weekly discipline, monthly doctrine, Ballast record, Host Kernel, source patch adoption or remediation is authorized by this A1.

## BOUNDARY_CHECK
- One new Aegis Daily research record; upstream author claims remain attributed; Jules and all prior native/maintenance histories untouched.
- Native zero-entropy-lab code, runtime, tools, storage, action effects, workflow and governance not modified.
- Native checker/test and upstream reproduction NOT_EXECUTED; structural source reading only. Human review and merge required.
