# A1 Daily Reliability Observe — 2026-11-23 / Runner fallback final-output redaction bypass outside stored history

## CORTEX_RUN_HEADER
Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A1
Canonical Identity: zero/aegis/A1
Cadence: Daily
Loop Stage: Observe
Logical Date: 2026-11-23
Logical Timezone: Asia/Shanghai
Agent: GPT-6 / GPT_NATIVE / HUMAN_REQUESTED / NOT_JULES_REPLAY
Record Provenance: HUMAN_AUTHORIZED_SUBSTITUTE
Base Main SHA: 0a128fcf5ab1c97d439956d687b4edb285d4842f
Run Identity: zero-entropy-lab/aegis/A1/2026-11-23/GPT_NATIVE/0a128fcf5/fallback-output-redaction-01
Evidence Class: EXTERNAL_RISK / FINAL_OUTPUT_VS_HISTORY_REDACTION_GATE
Source Identity: openai/openai-agents-python PR #6158, pinned head 2ff3036a13d192927bef8576196a13bbf44d05f1
Source Authority For Claim: FIRST_PARTY_OPEN_PR_SOURCE_PATCH_AND_AUTHORED_TEST_FIXTURES
Independent Verification: EXACT_PR_SOURCE_DIFF_INSPECTED / INDEPENDENT_SDK_RUNTIME_NOT_EXECUTED
Local Incident Evidence: NOT_ESTABLISHED
Local Repository Evidence: NO_ZERO_HOST_RUNTIME_RECEIPT_FOR_THIS_PATH
Existing Defense: UNKNOWN_FOR_ZERO
Measured Effectiveness: NOT_COMPUTED
Host Applicability: UNKNOWN / ZERO_INSTALLED_OPENAI_AGENT_SDK_AND_REDACTION_CONFIG_UNVERIFIED
Original Execution Status: FIRST_PARTY_GITHUB_SOURCE_REVIEW_EXECUTED / ZERO_AND_SDK_TESTS_NOT_EXECUTED
Current Path Status: PROPOSED_DRAFT_PR / NOT_MERGED_AT_AUTHORING
Task Status: BOUNDED_EXTERNAL_RISK_HYPOTHESIS / NOT_LOCAL_INCIDENT
Write Scope: aegis-cortex/2026-11-23-A1-reliability-observe.md
Host Kernel Modification: NO
Boundary Violation: NO

## INPUT_RECORD
- Cold-start `main` `0a128fcf5ab1c97d439956d687b4edb285d4842f`, owning `aegis-cortex/EVIDENCE_POLICY.md` contract. Previous 2026-11-22 A1/A2 and W46 A3/A4 retained on main. Today is first day of W48; W48 Weekly has not closed, November Monthly remains `NOT_DUE`.
- One W47 A3 Draft PR #921 already open; it owns `2026-W47-A3-discipline-decide.md` and does not overlap this Nov23 A1. Its A4 successor still requires Human Maintainer merger of A3 and fresh-main reread.
- Local exact worktree acquisition was attempted: `git ls-remote https://github.com/lostlight530/zero-entropy-lab.git refs/heads/main`, exit `128`, stdout empty, stderr `fatal: unable to access ... Could not resolve host: github.com`. No source checkout or host kernel tests in this environment.
- Previous 11-22 risk concerned mutable Live shared child Agent tools/instructions. Today concerns the **SDK run-result output surface**, especially synthesized fallbacks intentionally omitted from persisted conversation, not agent reuse.
- The source was first opened 2026-11-23T04:38:51Z = 2026-11-23 12:38:51 Asia/Shanghai; this is an observation on the current logical day, not a historic 2026-11-22 replay.

## EXTERNAL_SOURCE_RECORDS
Source ID: SRC-20261123-AE01
URL: https://github.com/openai/openai-agents-python/pull/6158
Title: fix: scrub Runner fallback replies even when omitted from history
Publisher: first-party openai/openai-agents-python source contributor PR / not released production SDK
Source Publication: 2026-11-23T04:38:51Z, observed 2026-11-23 Asia/Shanghai
Source Version: `OPEN_UNMERGED_PR_HEAD=2ff3036a13d192927bef8576196a13bbf44d05f1`, source base `d731414771e5023f88ceb295ec0f31966b7e8e6f`
Related source: PR #6154 and review finding link referenced by author — same SDK issuer lineage, not an independent experimental replication
Pinned code: https://github.com/openai/openai-agents-python/blob/2ff3036a13d192927bef8576196a13bbf44d05f1/src/agents/_redaction.py
Pinned error handlers: https://github.com/openai/openai-agents-python/blob/2ff3036a13d192927bef8576196a13bbf44d05f1/src/agents/run_internal/error_handlers.py
Pinned tests: https://github.com/openai/openai-agents-python/blob/2ff3036a13d192927bef8576196a13bbf44d05f1/tests/test_redact_text.py
Source Access: connected GitHub metadata and 7 changed files, including redaction, run, run_config, turn_resolution, run_loop and authored regressions.
Source Authority: FIRST_PARTY_FOR_PROPOSED_PATCH / NOT_GENERAL_CONFIDENTIALITY_ATTESTATION
Evidence Tier: OPEN_PR_IMPLEMENTATION_AND_TEST_SOURCE / NO_REPRODUCTION
External Evidence: SOURCE_PATCH_INSPECTED_FOR_CONDITIONAL_FINAL_OUTPUT_GAP / AUTHOR_TESTS_NOT_REPRODUCED / HOST_INCIDENT_NOT_ESTABLISHED
Confidence: HIGH_FOR_NEW_CONTROL_FLOW / UNKNOWN_FOR_RELEASE_AND_MEASURED_REDUCTION_IN_HOST
Uncertainty: merge/release, default configuration, exact runtime versions, independent results, downstream exporters, actual Zero exposure and attacker/control assumptions.

## RAW_RELIABILITY_SIGNAL_LOG
Risk ID: RISK-20261123-A01
External Risk: OUTPUT_REDACTION_SAFETY_CHECK_NOT_COVERING_UNPERSISTED_TERMINAL_REPLY
- **Trigger conditions:** a run supplies `RunConfig(redact_text=...)` and an error handler synthesizes a fallback reply with `include_in_history=False`. The reply may bypass the inspected/persisted conversation history yet be returned in `result.final_output` or observed by an end hook. A custom `tool_use_behavior` callback can create another reply not covered by history-only scrubbing.
- **Before patch, as described by author:** the SDK's history-centric guard can overlook the terminal object returned to the caller, including a secret string or a secret assembled from separate transcript segments. Omitting the item from history is a storage/disclosure choice, not a guarantee about outbound API data or callback visibility.
- **Proposed `_redaction.py` control:** `require_clean_final_output(value, original, *batches)` builds an output-view with raw input and run items. It replaces the last message when a validator/guardrail modified final output, avoids duplicate equivalent terminal text, and invokes `require_clean` across the returned reply and history. The final-output check is conditional on an enabled current redactor.
- **Execution-time integration:** `run.py` checks `result.final_output` before finishing resumable sessions; `run_loop.py` checks streamed finalized outputs and synthesized max-turn fallback; `turn_resolution.py` normalizes callback final output via `redact_payload` and validates the final text before end hooks. Error handlers scrub before schema validation.
- **Author test claims:** 30 added cases spanning streaming and non-streaming, handlers with/without history, structured output, tool callback and guardrail transformations; four protected restart cases report no synthetic secret across selected Redis, OTLP, SDK logs/spans/events and a large repository validation run of 13,553 passed / 52 skipped. These are **AUTHOR_REPORTED**, not observed executions by this A1. The 20 Redis writes and 32 OTLP exports claimed by author are scoped to their selected synthetic controls, not proof of Zero's telemetry safety.
- **Absence condition:** without a configured redactor, this patch is stated not to change behavior. A fallback containing no sensitive material or a clean callback is a negative control, not evidence of a vulnerability.
- **Effect boundary:** sanitizing output does not prove that a tool side effect did not happen or that a distinct host log/exporter never received sensitive data before redaction. Even a clean returned reply does not establish authorization or successful task completion.
- **Potentially cross-surface risk:** history storage, returned `final_output`, streaming events, end hooks, telemetry exporters and checkpoint serialization are separate destinations with separate sink/retention evidence. A test covering one is not automatically a measurement of all.

## Failure-model boundary and Counterevidence Gate
- Classification ledger: `EXTERNAL_RISK=SOURCE_SUPPORTED_CONDITIONAL_GAP`; `LOCAL_INCIDENT=UNKNOWN`; `EXISTING_DEFENSE=UNKNOWN`; `MEASURED_EFFECTIVENESS=NOT_COMPUTED`. No Zero host-installed SDK/version, specific handler, direct returned secret or effect sink receipt examined.
- Positive trigger test: enable a deterministic redactor; inject a synthetic secret into a handler fallback returned in `final_output` while `include_in_history=False`; compare prepatch/patch output and hook observations for both streaming and non-streaming paths.
- Negative N1: handler `include_in_history=True` with valid history redaction; must not imply that all omitted-history paths are clean unless explicitly tested.
- Negative N2: no `redact_text` config; no changed behavior is promised and its output is not eligible to be counted as a failure of the configured redaction guarantee.
- Negative N3: a `tool_use_behavior` callback returns a safe value or a structured fallback normalized correctly; rejecting every fallback would be a reliability regression, not effective confidentiality protection.
- Negative N4: a secret is split across multiple emitted items and only formed after one transformation; single-item string redaction might miss it. Check the exact inter-item flattening and run order, with ground-truth synthetic canaries.
- Negative N5: a secret is already exported by an unguarded third-party hook *before* the terminal redactor executes; a safe `final_output` does not exonerate that separate sink.
- Repro requires revision-locked runner, config and canary, precise original/new result, handler/history flags, callback/hook order, actual Redis/OTLP readback and stdout/stderr/exit, without exposing real credentials.
- No `src/kernel` incident, preventive fix, approval decision or local remediation can be asserted solely because an upstream source PR exists.

## EVIDENCE_DELTA
- NEW_EVIDENCE: source-level exact PR #6158 and 7-file diff show a distinct final-output guard invoked beyond stored-history redaction, including stream completion, error handlers and custom tool callbacks.
- CORRECTED_INTERPRETATION: `OMITTED_FROM_HISTORY != OMITTED_FROM_RESULT_OR_END_HOOK`; sanitized checkpoint != every returned reply sanitized; avoiding transcript storage is not itself a data-loss prevention guarantee.
- UNCHANGED_BOUNDARY: `EXTERNAL_RISK != LOCAL_INCIDENT != EXISTING_DEFENSE != MEASURED_EFFECTIVENESS`; `AUTHOR_TEST_REPORT != INDEPENDENT_SDK_RUN`; `SANITIZED_OUTPUT != AUTHORIZED_TOOL_EFFECT`.
- NEW_COUNTEREVIDENCE: disabled redactor, clean fallbacks, safe callback normalization, pre-fence exporter exposure and fragmented secrets bound any generalized protection claim.
- UNKNOWN_RETAINED: upstream merger/release, Zero SDK dependencies and redaction policy, host output/exporter sinks, actual leaks, differential test results and residual data retention.
- NEXT_RETEST_CONDITION: pin old/new source revisions, run paired synthetic-canary streaming/non-streaming fallbacks and negative controls, measure all relevant output/history/hook/exporter destinations with exact run IDs, commands, logs and exits.

## NEXT_HANDOFF
- A2 for the same 2026-11-23 date waits for this A1 original Draft PR to be reviewed and merged by Human Maintainer. Then fetch fresh `main` and exact A1 retained Git blob, independently review source/negative controls and local installed-path applicability.
- Until actual merge gate: `zero/aegis/A2/2026-11-23 = BLOCKED_DEPENDENCY_PENDING_MAIN_VISIBLE_A1`. No separate A2 artifact or execution credit.
- Current W47 A3 Draft #921 and its future A4 form an independent Weekly dependency. Nov Monthly A5/A6 `NOT_DUE`.

## BOUNDARY_CHECK
- This original A1 changes only `aegis-cortex/2026-11-23-A1-reliability-observe.md`.
- Host `src/kernel/**`, Ballast, A1/A2 Independent Maintenance, W47 A3, historical Jules, OpenAI SDK, workflows and scheduling unchanged.
- Executed: direct GitHub PR/source/test diff review, open-PR and source-path conflict check, local Git acquisition attempt with DNS error. `python3 aegis-cortex/check.py aegis-cortex/2026-11-23-A1-reliability-observe.md`, original upstream SDK 13,553 tests, Redis/OTLP synthetic experiment, host runtime and effect sink **NOT_EXECUTED**. No checker PASS, local incident or Human approval claimed.
