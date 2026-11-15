# A2 Daily Doctrine Orient — 2026-11-15

## CORTEX_RUN_HEADER
Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A2
Canonical Identity: zero/aegis/A2
Cadence: Daily
Loop Stage: Orient
Logical Date: 2026-11-15
Logical Timezone: Asia/Shanghai
Agent: GPT-6 / GPT_NATIVE / HUMAN_REQUESTED / NOT_JULES_REPLAY
Record Provenance: HUMAN_AUTHORIZED_SUBSTITUTE
Source Identity: google/adk-python issue #8066, exact proposed fix commit 2c51b77606fbc87c7ffd5c11e826b98fa7a2596c, upstream main d05e482038bdbb226c3a1179550cf83bd8fcbefb
Source Authority For Claim: FIRST_PARTY_ISSUE_AND_PATCH_DIFF_PLUS_PINNED_CURRENT_MAIN_CODE / NO_EXECUTED_REPRO
Independent Verification: CURRENT_MAIN_CONTRAST_WITH_UNMERGED_PATCH / NO_LOCAL_ADK_RUNTIME_TEST / SINGLE_UPSTREAM_LINEAGE
Host Applicability: UNKNOWN / ZERO_HOST_ADK_MODEL_ARMOR_INTEGRATION_NOT_PROVEN
Evidence Class: CONDITIONAL_EXTERNAL_RISK_REVIEW / CANCELLATION_AND_SHARED_RESOURCE_LIFETIME
Local Incident Evidence: UNKNOWN / NO_ZERO_LOCAL_MODEL_ARMOR_INCIDENT
Existing Defense: UNKNOWN / NO_ZERO_HOST_MEASUREMENT
Measured Effectiveness: NOT_COMPUTED
Original Execution Status: GPT_NATIVE_BOUNDED_SOURCE_ORIENTATION_COMPLETED / NO_NATIVE_RUN
Current Path Status: DRAFT_PR_PENDING_HUMAN_REVIEW
Base Main SHA: 52a9bdf80daa1dc898aa2b33bf8b8372084c508a
Run Identity: zero-entropy-lab/aegis/A2/2026-11-15/GPT_NATIVE/52a9bdf80daa1dc898aa2b33bf8b8372084c508a/modelarmor-transport-ownership-source-compare-01
Upstream A1: aegis-cortex/2026-11-15-A1-reliability-observe.md
Upstream A1 Blob SHA: bb06c0b1427be23152b6be2f4533bb54c74cf0a9
Upstream A1 PR: https://github.com/lostlight530/zero-entropy-lab/pull/875
Upstream A1 Merge SHA: 52a9bdf80daa1dc898aa2b33bf8b8372084c508a
Input Status: SAME_DATE_A1_MERGED_MAIN_VISIBLE_AND_EXACT_BLOB_READ
Task Status: SUCCESS_BOUNDED_EXTERNAL_SOURCE_ORIENTATION / NO_DOCTRINE_PROMOTION
Host Repository Change: NO
Boundary Violation: NO

## INPUT_RECORD
- Fresh merged Zero main 52a9bdf80daa1dc898aa2b33bf8b8372084c508a; original A1 PR #875 merged and exact A1 blob bb06c0b1427be23152b6be2f4533bb54c74cf0a9 reread. Current Aegis policy and historical Nov 14 A1/A2, closed W45 A3/A4 inspected as context, not independent new tests.
- Upstream Google ADK issue #8066 created Nov 9 remains OPEN on this inspection; patch commit 2c51b776… was committed Nov 10, not new today.
- Compared current upstream source main d05e482038bdbb226c3a1179550cf83bd8fcbefb to exact candidate patch: current main's ModelArmorPlugin.close still obtains _clients_on_running_loop() and calls clients.pop().transport.close(), while the proposed patch removes this close and documents per-loop lifetime.
- The proposed patch also updates authored source tests for supplied client ownership and runner sharing. No author test suite, gRPC backend or Zero integration executed; author test source is not independent local evidence.
- Upstream commit compare relative to current main was DIVERGED at inspection; do not claim this exact patch commit is merged on current main, present in released ADK, or independently shown effective.
- November Monthly A5/A6 and W46 A3/A4 remain NOT_DUE before natural Shanghai week close. Only this same-day A2 research file is in write scope.

## RISK_CLASSIFICATION
Risk ID: RISK-20261115-A01
Source Risk Input: aegis-cortex/2026-11-15-A1-reliability-observe.md
Class: EXTERNAL_RISK / PRECONDITION_DEPENDENT_CONCURRENT_RUNNER_RESOURCE_TEARDOWN
Source Authority: FIRST_PARTY_ISSUE_AND_CURRENT_MAIN_CODE / NO_LOCAL_REPRODUCTION
Applicable Preconditions: shared App / shared ModelArmorPlugin, runners on same event loop, an in-flight sanitize RPC and sibling Runner shutdown
Current Main Mechanism: ModelArmorPlugin.close() closes one per-loop transport; author reports this cancels active sibling request; exact resource ownership for all possible code paths remains unverified.
Proposed Repair Mechanism: leave per-loop clients intact on Runner close, with eventual release at event-loop lifetime according to commit author. A source patch does not establish leak freedom, eventual cleanup or a shipped mitigation.
Local Incident: UNKNOWN, NOT_OBSERVED; external report must not be imported into Zero as runtime failure.
Existing Defense: UNKNOWN, native kernel and actual plugin use not tested.
Measured Effectiveness: NOT_COMPUTED.
Observed Semantics: reported asyncio.CancelledError bypasses except Exception screening fallback and turn may terminate with final_response=None; this is cancellation/noncompletion, not verified permissive policy ALLOW or an actual unauthorized side effect.
Counterevidence: no shared client, no in-flight RPC, or separately scoped event loops exclude this exact race trigger. A cancelled call is not evidence of security policy fail-open.
Counterevidence: moving cleanup to loop lifecycle may fix premature close but requires observing actual client release. A transport leak or independent cancellation path remains possible; no universal liveness claim.
Confidence: HIGH_FOR_SOURCE_BRANCH_AND_AUTHOR_REPORTED_PRECONDITIONS / UNKNOWN_FOR_LOCAL_RUNTIME
Promotion Eligibility: FAILURE_MODEL_WATCHLIST_ONLY / NO_HOST_PROTOCOL_CHANGE

## ORIENTATION_NOTES
- Distinct identities: Runner closing/acknowledgment, transport resource lifetime, screening decision receipt, effect dispatch and final result. Closing one runner is a local event, not proof of every sibling's policy decision.
- When asyncio.CancelledError escapes screening handling, the safe analytical classification is SCREENING_VERDICT_UNKNOWN / TURN_COMPLETION_UNKNOWN until explicit receipts are checked; neither ALLOW nor DENY may be inferred.
- A correct retest needs same event loop with two Runner instances sharing an App, an in-flight blocking screening RPC, a controlled sibling close, then precise cancellation and effect-sink observation. A negative control with separately owned plugin/client is necessary.
- The proposed no-close source branch changes the resource-release condition; test the event loop's finalization, late Runner invocation and closed-loop cleanup to avoid claiming it fixes every lifetime problem.
- Upstream issue, commit, authored tests, H1/A2 repeated discussion and cross-repo source pointers are one Google ADK lineage. Google issue and code diff are two evidence surfaces but not independent production reproductions.
- Do not reinterpret Nov 14 disabled file-watcher allocation as evidence of this Nov 15 shared-client race, or use either to write a local incident.
- No code, Host Kernel, Ballast evidence, author source, scheduler, workflow, verified defense or benchmark updated.

## NO_DECISION_SECTION
- No A3 discipline decision, A4 protocol rule or Host Kernel remediation. NO_DECISION for a repository bug until actual local dependency and effect behavior are verified.
- No claim of zero security violations, shipped fix, verified Model Armor policy bypass or mitigation effectiveness.
- A5/A6 Monthly remain NOT_DUE; source case is one dated external mechanism, not stable durable doctrine.

## EVIDENCE_DELTA
- NEW_EVIDENCE: direct inspection of current pinned upstream main's still-present transport.close branch, contrasted with exact candidate patch removing it.
- CORRECTED_INTERPRETATION: failure to deliver a final response due to cancellation is distinct from a safety gate returning ALLOW; a repaired close method is distinct from a fully verified shared-resource lifecycle.
- UNCHANGED_BOUNDARY: EXTERNAL_RISK != LOCAL_INCIDENT != EXISTING_DEFENSE != MEASURED_EFFECTIVENESS; PATCH_SOURCE != RELEASED_FIX.
- NEW_COUNTEREVIDENCE: controlled ownership and no-in-flight negative controls; deferred cleanup must itself be tested for resource retention and late invocation.
- UNKNOWN_RETAINED: affected binary release, exact scheduler/loop interactions, actual effect records, mitigation pass rate, Zero runtime integration.
- NEXT_RETEST_CONDITION: pin issue and patch revisions, run shared-App concurrent sibling close test plus separate-App negative control; record per-run call identity, loop/thread ID, client ownership, pending RPC, cancellation, final response, screening verdict, side-effect sink result, stdout/stderr/exit, release and cleanup receipts.

## NEXT_HANDOFF
- W46 A3 (after natural closure) should inherit this issue as one source lineage and preserve unchanged local incident UNKNOWN without forcing a weekly discipline. A4 may act only after merged A3 decision.
- Next Daily source check: read actual new upstream main/release and any issue resolution before stronger claim, with explicit version ancestry and reproduced negative controls.

## BOUNDARY_CHECK
- Same-day exact A1 merge and blob read before A2, not a sibling PR assumption.
- One new dated A2 only. Historical Jules and prior GPT Native records unchanged; no local kernel, Ballast, governance, scheduler, runtime, tool or action changes.
- Aegis checker, Google ADK tests, local effect tracing, actual RPCs: NOT_EXECUTED. Static current-main/patch comparison performed.
- Human Maintainer authorization to merge does not count as independent GitHub Review.
