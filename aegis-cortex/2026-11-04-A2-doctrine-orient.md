# A2 Daily Doctrine Orient — 2026-11-04

## CORTEX_RUN_HEADER
Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A2
Canonical Identity: zero/aegis/A2
Cadence: Daily
Loop Stage: Orient
Logical Date: 2026-11-04
Logical Timezone: Asia/Shanghai
Execution Date UTC: 2026-11-05 / EXACT_CLOCK_NOT_CAPTURED
Execution Date Asia/Shanghai: 2026-11-05 / EXACT_CLOCK_NOT_CAPTURED
Agent: GPT-6
Producer: GPT_NATIVE / NOT_JULES_REPLAY
Record Provenance: HUMAN_AUTHORIZED_NATIVE_DAILY / LOGICAL_DATE_2026-11-04_EXECUTED_2026-11-05 / NOT_HISTORICAL_RECONSTRUCTION
Original Execution Status: NEW_GPT_NATIVE_ORIENTATION / NOT_JULES_REPLAY
Current Path Status: PROPOSED_DRAFT_BEFORE_MERGE / NOT_HISTORICAL_EXECUTION_PROOF
Base Main SHA: 0e96a75bee184f11f2a740bd757a35c3d3b761fe
Run Identity: zero-entropy-lab/aegis/A2/2026-11-04/GPT_NATIVE/0e96a75bee184f11f2a740bd757a35c3d3b761fe/gpt-native-20261105-a2-20261104-01
Upstream A1: aegis-cortex/2026-11-04-A1-reliability-observe.md
Upstream A1 Blob: 208f8fa21debce7c098e093fab663a0d300bf3b4
Input Status: SAME_DATE_A1_MERGED_MAIN_VISIBLE / PR_796 / MERGE_0e96a75bee184f11f2a740bd757a35c3d3b761fe
Task Status: SUCCESS_BOUNDED_PINNED_CODE_ORIENTATION / NO_DOCTRINE_PROMOTION
Network Status: ORIGINAL_REPORT_PINNED_SAMPLES_AND_V2.13.0_TOOL_IMPLEMENTATION_READ
Source Status: REPORTER_POC_PLUS_DIRECT_VERSIONED_CODE / NO_INDEPENDENT_RUNTIME_REPLAY
Evidence Class: EXTERNAL_FAILURE_REPORT / SOURCE_SCOPED
Source Identity: google/adk-python#7987 + source commit 36cb10d + v2.13.0 Tool implementation
Source Authority For Claim: REPORTER_FOR_REPORTED_TEST_OUTCOMES / PINNED_FIRST_PARTY_CODE_FOR_STATIC_GATING_FACTS
Independent Verification: EXACT_SAMPLE_AND_FRAMEWORK_CODE_READ / NO_DIRECT_SDK_POC_EXECUTION
Local Incident Evidence: NO_LOCAL_EVIDENCE
Local Applicability: UNKNOWN
Host Applicability: UNKNOWN / NO_ZERO_KERNEL_RUNTIME_REVIEW
Existing Defense in Zero: UNKNOWN
Measured Effectiveness in Zero: NOT_MEASURED
Write Scope: aegis-cortex/2026-11-04-A2-doctrine-orient.md
Boundary Violation: NO

## INPUT_RECORD
- On freshly merged main 0e96a75bee184f11f2a740bd757a35c3d3b761fe, read the exact same-date A1 by blob 208f8fa21debce7c098e093fab663a0d300bf3b4 after Human Maintainer merged PR #796. The input is an actual main-visible Handoff, not the prior Draft branch.
- A1's original external report https://github.com/google/adk-python/issues/7987 was filed at 2026-11-04T10:55:39Z / 18:55:39 Shanghai. This A2 code inspection and authoring occurred 2026-11-05, and is not represented as a November 4 execution or as historical Jules research.
- Previous 2026-11-03 A2 covered an Anthropic Python SDK streaming keepalive report, with a distinct failure mechanism. W44 A4's no-host-change boundary continues. No new Weekly doctrine or Host Kernel modification is authorized by either source.
- Checked sample file contents at exact reporter commit 36cb10d and tagged v2.13.0 framework code; inspected the later proposed PR #7993 (opened 2026-11-04T22:04:46Z, already **2026-11-05 Asia/Shanghai**) only as a separately dated follow-up, not as evidence available during the November 4 Shanghai logical day.
- No actual Zero agent runtime, ADK installation, local reimbursement endpoint or local authorization policy was inspected; no side effect at Zero was observed.

## SOURCE_VERIFICATION_RECORDS
### SRC-20261104-A2-01 — original reporter claim and controls
URL: https://github.com/google/adk-python/issues/7987
Published UTC: 2026-11-04T10:55:39Z
Checked: 2026-11-05
Type: ORIGINAL_REPORTER_POC_AND_CONTROL_RESULTS
Supported: reporter describes three scripted-model scenarios: direct reimbursement without approval, after explicit rejection, and after approval. In the report both Python and YAML sample implementations invoked the reimbursement body once per scenario before their proposed guard changes.
Scope: this is the reporter's scripted BaseLlm result using stated ADK 2.13.0/source revision 36cb10d, NOT an independent model run, a real payment, or a Zero incident.
Counterexample: a production effect service can independently enforce authorization, so demo-tool behavior alone is not evidence of fleet-wide bypass.

### SRC-20261104-A2-02 — pinned Python HITL demo
URL: https://github.com/google/adk-python/blob/36cb10d/contributing/samples/hitl/human_in_loop/agent.py
Exact Blob: 643cec3dba5deb3b5f90b2ad660915bd99f1616d
Version: source commit 36cb10d as specified by reporter
Source Type: VERSION_PINNED_FIRST_PARTY_DEMO_IMPLEMENTATION
Observed: `reimburse(purpose, amount)` directly returns a simple `{'status':'ok'}`; `ask_for_approval` returns a pending ticket; the Agent registers them in one tools list as `reimburse` and `LongRunningFunctionTool(func=ask_for_approval)`. The instruction, not reimbursement body, describes manager approval order.
Static Conclusion: this demo file does not enforce the approval predicate inside `reimburse` or attach `FunctionTool(require_confirmation)` to the effect tool.
Boundary: a source statement about a sample is not verified execution or evidence that any real financial effect occurred.

### SRC-20261104-A2-03 — pinned YAML variant
URL: https://github.com/google/adk-python/blob/36cb10d/contributing/samples/hitl/tool_human_in_the_loop_config/tools.py
Exact Blob: 7afea8d632366ab4df23bd59c69743d3b47cb4d4
YAML URL: https://github.com/google/adk-python/blob/36cb10d/contributing/samples/hitl/tool_human_in_the_loop_config/root_agent.yaml
YAML Blob: 9639e94c778f6e1da2e7a24d98d0da80f99dbeae
Observed: the YAML registers a plain reimbursement function and a separate long-running approval tool; the function body does not check approval state. The YAML instruction asks for manager approval above a threshold but is not an executable effect-bound guard.
Counterevidence: the instruction uses `greater than $100`, while reporter's proposed rule uses `>=100`; an exact $100 boundary needs a separate explicit policy test and cannot be assumed.

### SRC-20261104-A2-04 — pinned existing framework defense and config boundary
URL: https://github.com/google/adk-python/blob/v2.13.0/src/google/adk/tools/function_tool.py
Exact Blob: cc4f87b972e835ea021df1ce0cbe0402d0ed5454
Companion URL: https://github.com/google/adk-python/blob/v2.13.0/src/google/adk/tools/base_tool.py
Companion Blob: 58ed3581cae95cedddf78acdc6b28d3e83c9a69b
Observed: `FunctionTool.__init__` accepts `require_confirmation: Union[bool, Callable[...,bool]] = False`; `check_require_confirmation` computes it; execution flow requests a confirmation before invoking the protected effect when required. The `BaseTool.from_config` reflection handles basic types and callables, not arbitrary `Union[bool, Callable]` parsing as such; reporter separately claims a YAML constructor configuration produced an unsupported-parsing warning.
Supported: the framework exposes a concrete potential mitigation mechanism separate from prompt adherence; the demo did not use it. Exact YAML runtime fallback, protected payout effects and test results remain unexecuted here.
Counterevidence: an available confirmation API weakens any blanket claim that Google ADK lacks an approval gate.

### SRC-20261104-A2-05 — later repair proposal, not Nov4 Shanghai evidence
URL: https://github.com/google/adk-python/pull/7993
Opened UTC: 2026-11-04T22:04:46Z / Shanghai 2026-11-05T06:04:46+08:00
Checked: 2026-11-05
Status At Check: OPEN / NOT_MERGED
Source Type: SUBSEQUENT_UPSTREAM_PROPOSED_PATCH_AND_AUTHOR_TEST_CLAIMS
Scope: proposes approval gating for Python and YAML demos and uses ticket/argument matching, with regressions and author-reported validation. This follow-up postdates the assigned Shanghai logical date and does not change the earlier original demo state. Any reported tests are upstream author claims, NOT A2 runtime execution or local defense verification.
Independence: source comment/patch/test records within one upstream project are different evidence surfaces, not independent deployed-agent replications.

## RISK_CLASSIFICATION
Source Signal: SIG-20261104-A01
External Failure Class: PROMPT_ONLY_APPROVAL_ORDER_VS_EXECUTABLE_EFFECT_GUARD
Evidence Class: EXTERNAL_FAILURE_REPORT / PINNED_SAMPLE_SOURCE_CORROBORATED
Local Evidence: NO_LOCAL_EVIDENCE
Zero Kernel Incident: NOT_OBSERVED / NOT_INFERRED
Zero Defense: UNKNOWN / NOT_MEASURED
Source Confidence: HIGH_FOR_PINNED_STATIC_SAMPLE_CODE / REPORTER_ONLY_FOR_TIMED_OR_SCRIPTED_POC_OUTCOMES
Necessary Preconditions: effect tool callable independently of approval check; no server-side authorization to block unapproved or mismatched ticket; model permitted to choose effect call.
Attack/Failure Boundary: a prompt instruction is not a machine-enforced authorization predicate, but the sample's `ok` response is not an actual financial transfer or measured compromise.
Falsifiers: independent authoritative server-side approval before effect; a guarded tool binding at invocation; a live replay that blocks disapproved and changed-argument calls even with the model attempting them.
Counterevidence: the same framework has confirmation hooks; the sample is a documented opt-in HITL flow and small-amount approval policy needs exact threshold semantics.
Current Status: WATCHLIST_CANDIDATE / NO_LOCAL_BUG_DECISION / NO_GENERAL_FRAMEWORK_VULNERABILITY_PROMOTION

## ORIENTATION_NOTES
- NEW_EVIDENCE: exact pinned source shows the demo's effect tool is unguarded while a separate framework `FunctionTool(require_confirmation)` is available. This supports a specific source-level failure mechanism beyond the original reporter prose.
- CORRECTED_INTERPRETATION: tool list contains an approval tool != every effect call is gated; code without effect-side confirmation != measured business loss; a later proposed patch != already merged fix on November 4.
- UNCHANGED_BOUNDARY: EXTERNAL_REPORT != ZERO_LOCAL_INCIDENT; CODE_PATH != INDEPENDENT_EXECUTED_POC; SAME_PUBLISHER_MULTIPLE_FILES != INDEPENDENT_FAILURE_TRIALS.
- NEW_COUNTEREVIDENCE: framework provides optional executable confirmation; plain demo payout is only a simulated return; YAML threshold wording differs at exactly $100 from proposed `>=100` predicate.
- UNKNOWN_RETAINED: independently reproduced package behavior, event ordering and retries, rejected/modified ticket enforcement, YAML config parse at exact revision, actual payment authority, Zero Host applicability and local defense effectiveness.
- NEXT_RETEST_CONDITION: pin ADK v2.13.0 at stated commit and run fresh scripted no-approval/rejected/approved cases for Python and YAML routes, add $99.99/$100/$100.01, changed-ticket, changed-amount and duplicate confirmation controls, then compare against guarded version with exact stdout/stderr/exits/effect counts; only afterward audit any actual Zero relevant dependencies.

## NO_DECISION_SECTION
Decision ID: NO_DECISION
- No new Aegis static doctrine, no Zero Kernel or NEXUS modifications, no Host incident registration and no claim of existing or effective Zero protection.
- Only source-specific research/watchlist orientation is justified. Author-submitted bug report, pinned static code and proposed patch do not establish Zero operational risk probability or general ADK production incidence.

## NEXT_HANDOFF
- A3 for a naturally closed future week may cite one external issue with specific source, version and hypothesis, not three independent sample incidents; any later upstream fix is a new dated observation, not retroactive November 4 verification.
- Real promotion requires independent reproduction with per-effect authorization receipts and negative tests, then a separately authorized Host/local relevance study if necessary.
- Aegis checker, ADK tests, local Host replay and production payment effects: NOT_EXECUTED / NO_PASSED_COUNT.

## BOUNDARY_CHECK
- Only aegis-cortex/2026-11-04-A2-doctrine-orient.md proposed from newly merged main 0e96a75bee184f11f2a740bd757a35c3d3b761fe; original same-date A1 and all historical Aegis, static doctrine, memory, kernel, Ballast, NEXUS, workflows, scheduler and maintenance unchanged.
- No fabricated local incident, signed approval, payment, test PASS, independent vendor support, or draft-to-merged chronology. Human Maintainer retains merge authority.
