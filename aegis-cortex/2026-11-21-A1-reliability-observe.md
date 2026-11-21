# A1 Daily Reliability Observe — 2026-11-21 / unscored evaluation run yields false metric pass

## CORTEX_RUN_HEADER
Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A1
Canonical Identity: zero/aegis/A1
Cadence: Daily
Loop Stage: Observe
Logical Date: 2026-11-21
Logical Timezone: Asia/Shanghai
Agent: GPT-6 / GPT_NATIVE / HUMAN_REQUESTED / NOT_JULES_REPLAY
Record Provenance: HUMAN_AUTHORIZED_SUBSTITUTE
Base Main SHA: 41179f9ee26a7fc5f25764670fd72b5b5d41aa9f
Run Identity: zero-entropy-lab/aegis/A1/2026-11-21/GPT_NATIVE/41179f9/unscored-evaluator-01
Evidence Class: EXTERNAL_RISK / EVALUATION_STATUS_SCORE_INCONSISTENCY
Source Identity: google/adk-python PR #8277, head b43b68f22fd999488f95286a3af6299cc2597991
Source Authority For Claim: FIRST_PARTY_OPEN_PR_PATCH_AND_AUTHOR_REGRESSION_TESTS
Independent Verification: SOURCE_DIFF_AND_OFFICIAL_EVALUATOR_CONTRACT_INSPECTED / UPSTREAM_TESTS_NOT_REPRODUCED
Local Incident Evidence: NOT_ESTABLISHED
Existing Defense: UNKNOWN_FOR_ZERO
Measured Effectiveness: NOT_COMPUTED
Host Applicability: UNKNOWN / NO_ZERO_ADK_EVALUATOR_PRODUCTION_RECEIPT
Original Execution Status: REMOTE_CODE_REVIEW / LOCAL_ADK_EVALUATION_NOT_EXECUTED
Current Path Status: PROPOSED_DRAFT_PR / NOT_MERGED_AT_AUTHORING
Task Status: BOUNDED_EXTERNAL_FAILURE_MECHANISM / NO_HOST_INCIDENT
Write Scope: aegis-cortex/2026-11-21-A1-reliability-observe.md
Host Kernel Modification: NO
Boundary Violation: NO

## INPUT_RECORD
- Fresh main `41179f9ee26a7fc5f25764670fd72b5b5d41aa9f`, full untruncated Git tree, no open Zero PR at preflight; prior 2026-11-20 A1/A2 already in main. 2026-W46 A3/A4 already present.
- Current `aegis-cortex/EVIDENCE_POLICY.md` blob `4977de3ac6cc8fbfd59bb0f7ebbb1957a9f22d84`, `aegis-cortex/README.md` blob `ab1a7caaed2f338b05174d9428b071234d6a5546`.
- Previous day examined a resumable live-session reconnect race. This investigation concerns a different failure class: evaluation evidence semantics, not websocket recovery.
- Upstream PR #8277 created 2026-11-20T16:56:20Z (= 2026-11-21 00:56:20 Asia/Shanghai), OPEN and unmerged at inspection, pinned head b43b68f22fd999488f95286a3af6299cc2597991.
- Source access: GitHub PR metadata, exact modified implementation and regression test patches, and first-party evaluator documentation. No installed ADK evaluator was executed.
- Isolated container remote Git bootstrap returned exit 128 with `Could not resolve host: github.com`. This is acquisition state, not a run of AgentEvaluator or a local incident.

## EXTERNAL_SOURCE_RECORDS
Source ID: SRC-20261121-AE01
Title: fix(evaluation): don't pass AgentEvaluator metrics on runs the evaluator left unscored
Canonical Source Identity: https://github.com/google/adk-python/pull/8277 / head b43b68f22fd999488f95286a3af6299cc2597991
Linked upstream issue: https://github.com/google/adk-python/issues/8276
Pinned implementation: https://github.com/google/adk-python/blob/b43b68f22fd999488f95286a3af6299cc2597991/src/google/adk/evaluation/agent_evaluator.py
Pinned tests: https://github.com/google/adk-python/blob/b43b68f22fd999488f95286a3af6299cc2597991/tests/unittests/evaluation/test_agent_evaluator.py
Evaluator contract: https://github.com/google/adk-python/blob/main/docs/guides/evaluation/evaluator/index.md (documentation main branch, not immutable PR implementation)
Source Version: OPEN_UNMERGED_PR_HEAD / RELEASE_VERSION_UNVERIFIED
Source Publication: 2026-11-20T16:56:20Z, observed on 2026-11-21 Shanghai logical date
Source Authority: FIRST_PARTY_SOURCE_FOR_PROPOSED_ADK_BUG_AND_FIX / NOT_INDEPENDENT_PRODUCTION_MEASUREMENT

## RAW_RELIABILITY_SIGNAL_LOG
Risk ID: RISK-20261121-A01
External Risk: UNASSESSED_RUN_PROMOTED_TO_METRIC_PASS_BY_PARTIALLY_SCORED_INVOCATIONS
- A reported failure mode in `AgentEvaluator`: for an evaluation run whose metric's overall status is `NOT_EVALUATED` and whose overall score is `None`, some individual invocations may nonetheless carry numeric scores.
- Before proposed fix, the evaluator's aggregate computes a mean over non-`None` invocation scores, ignoring that the *run-level* metric is not eligible for a pass/fail score. An accidental passing mean can therefore create `PASSED` without an assessed run.
- The source diff adds `run_unscored: bool` on invocation metric results. It marks every invocation under a run-level `NOT_EVALUATED`/no-score metric and excludes those scores from the pass/fail mean, while leaving them visible in detailed output and CSV.
- This is not a rule that every `None` invocation invalidates an otherwise assessed run. The invariant concerns the explicit **overall run status with no overall score**, not mere partial per-turn missingness.
- If all candidate runs are unscored the intended result is `NOT_EVALUATED` (a truthful negative), rather than numeric `0` or a fabricated threshold pass. Mixed cases should aggregate only eligible runs.
- The upstream author states two regression tests fail against main and pass with the patch, reports `pytest tests/unittests/evaluation` (1343 tests) and a manual E2E difference for `hallucinations_v1`; none of those upstream runs were reproduced here. Their test denominator is not the Zero host's coverage.
- The same repository's `adk eval --num_runs` aggregator is cited as an intended consistency target; agreement between two upstream paths is a future test, not an independent evidence issuer.
- The risk is an *evidence-status laundering* failure: numeric score availability, eligible evaluation, metric verdict, and accepted release gate are different predicates.
- Host `zero-entropy-lab` has no observed dependency/path proving use of this evaluator. Its `src/kernel/**` tests, HMAC, memory, runtime and Ballast observations are separate and cannot be relabeled as impacted incidents.
- No frequency, severity distribution, effective safety filter or production false-pass rate is established by one upstream bug report and proposed test fixtures.

## CONTROLS_AND_COUNTEREXAMPLES
- Positive control A: a fully scored, overall-evaluated run with a score above threshold should PASS through the existing logic; a proposed fix must not reject it.
- Positive control B: a fully evaluated run with an explicit partial invocation `None` may remain valid under its metric contract; filtering a whole run only from one missing per-turn score would overcorrect.
- Negative control A: one run has numeric invocation 1.0 and `None`, but run-level `NOT_EVALUATED`/no overall score. It must not contribute an artificial PASS.
- Negative control B: one legitimate low-scored evaluated run plus a run-level unscored high-valued invocation. A correct mean must exclude the invalid high score and retain the failed threshold.
- Negative control C: every run is `NOT_EVALUATED`; status should remain `NOT_EVALUATED`, not 0/0, pass, or a silently skipped mandatory evaluation.
- Version-sensitive test: distinguish `run_unscored` field default/serialization and `MagicMock` truthiness; a mocked attribute that defaults true may create a false-positive filter unless the test binds it explicitly.

## EVIDENCE_DELTA
- NEW_EVIDENCE: open first-party ADK patch documents and modifies a concrete hierarchy mismatch between run verdict and per-invocation numeric aggregation, including two reported regression tests.
- CORRECTED_INTERPRETATION: metric mean above threshold does not imply an evaluation was actually valid or completed; unscored is neither failed-score-zero nor pass.
- UNCHANGED_BOUNDARY: EXTERNAL_RISK != LOCAL_INCIDENT != EXISTING_DEFENSE != MEASURED_EFFECTIVENESS; authored tests != locally executed regressions.
- NEW_COUNTEREVIDENCE: mixed scored/unscored runs, all-unscored input, partial evaluated run and mocking semantics challenge naive all-scores aggregation and overbroad filtering.
- UNKNOWN_RETAINED: proposed PR outcome/release, any independent before/after results, Zero adoption, production exposure and true measured effectiveness.
- NEXT_RETEST_CONDITION: pin ADK main vs proposed/final head, run same controlled two-run fixtures and author tests with command/revision/stdout/stderr/exit; inspect retained run-status and invocation-score receipts; separately require host dependency evidence before local applicability.

## NEXT_HANDOFF
- Same-day `zero/aegis/A2`: BLOCKED_DEPENDENCY pending A1 Draft's actual merge and fresh-read of new main/blob. A2 should examine negative controls, all-unscored behavior, and metric eligibility semantics, not replay A1 as independent evidence.
- 2026-W47 A3/A4 NOT_DUE through 2026-11-22 week end; November A5/A6 NOT_DUE until natural month closure.
- Ballast, host kernel, independent A1/A2 maintenance, historical Jules and scheduler surfaces not modified.

## BOUNDARY_CHECK
- First-party GitHub implementation/tests and public evaluator specification read; PR remains OPEN at observation.
- Upstream pytest and manual E2E: AUTHOR_REPORTED / NOT_REPRODUCED; Aegis `check.py`: NOT_EXECUTED, full checkout unavailable.
- Local Zero evaluation, incident, defense effectiveness and authorization results: NOT_OBSERVED / NOT_COMPUTED.
- No human review, host modification, implicit merge, numeric safety rate or sensitive control material declared.
