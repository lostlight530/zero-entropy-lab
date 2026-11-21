# A2 Daily Doctrine Orient — 2026-11-21 / metric eligibility gates must precede numeric aggregation

## CORTEX_RUN_HEADER
Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A2
Canonical Identity: zero/aegis/A2
Cadence: Daily
Loop Stage: Orient
Logical Date: 2026-11-21
Logical Timezone: Asia/Shanghai
Agent: GPT-6 / GPT_NATIVE / HUMAN_REQUESTED / NOT_JULES_REPLAY
Record Provenance: HUMAN_AUTHORIZED_SUBSTITUTE
Base Main SHA: 6d6c42db907759b993d043d3058c461bfdf40ab6
Run Identity: zero-entropy-lab/aegis/A2/2026-11-21/GPT_NATIVE/6d6c42d/unscored-run-eligibility-01
Evidence Class: EXTERNAL_RISK / EVALUATOR_VERDICT_ELIGIBILITY
Source Identity: google/adk-python PR #8277 head b43b68f22fd999488f95286a3af6299cc2597991
Source Authority For Claim: FIRST_PARTY_UNMERGED_PATCH_AND_AUTHORED_TESTS / SAME_ISSUER_AS_A1
Independent Verification: MERGED_A1_PR_909_AND_EXACT_MAIN_BLOB_READBACK / NO_LOCAL_ADK_RUN
Local Incident Evidence: NOT_ESTABLISHED
Local Evidence: UNKNOWN
Existing Defense: UNKNOWN_FOR_ZERO
Measured Effectiveness: NOT_COMPUTED
Host Applicability: UNKNOWN
Original Execution Status: DIRECT_DEPENDENCY_AND_SOURCE_REVIEW / TESTS_NOT_EXECUTED
Current Path Status: PROPOSED_DRAFT_PR / NOT_MERGED_AT_AUTHORING
Task Status: BOUNDED_RISK_ORIENTATION / NO_DOCTRINE_PROMOTION
Write Scope: aegis-cortex/2026-11-21-A2-doctrine-orient.md
Host Kernel Modification: NO
Boundary Violation: NO

## INPUT_RECORD
- Original same-day A1 PR https://github.com/lostlight530/zero-entropy-lab/pull/909 merged with GitHub merge commit `6d6c42db907759b993d043d3058c461bfdf40ab6`; new main reread.
- Exact A1 canonical file `aegis-cortex/2026-11-21-A1-reliability-observe.md` retained in new main, blob `fd7326d1dda0805fea75820cb1a24b5ba8016118`.
- Original A1 at-authoring `PROPOSED_DRAFT_PR` remains historical snapshot; actual merger and main retention are confirmed by separate readback, not inferred from its prose.
- Owning evidence policy blob `4977de3ac6cc8fbfd59bb0f7ebbb1957a9f22d84`, current README blob `ab1a7caaed2f338b05174d9428b071234d6a5546`.
- Upstream first-party PR https://github.com/google/adk-python/pull/8277 rechecked after A1 merge: OPEN / NOT_MERGED; same head `b43b68f22fd999488f95286a3af6299cc2597991`. The PR was opened 2026-11-21 00:56 Asia/Shanghai; not an independent separate publication for H2-like A2.
- Scope: evaluator metric eligibility and verdict semantics. This is distinct from yesterday's websocket reconnect and from Zero kernel/host evaluation.

## RISK_CLASSIFICATION
External Risk: `RUN_UNSCORED_INVOCATION_SCORE_LEAKS_INTO_METRIC_PASS`
Reported precondition: run-level metric evaluation carries `NOT_EVALUATED` with no overall score, but one or more invocations have a numeric partial score.
Reported failure: `AgentEvaluator` averaged scored invocations even from an ineligible overall run; reported `hallucinations_v1` example could result in a passing threshold.
Proposed source change: mark invocations belonging to run-level `NOT_EVALUATED`/no-score with `run_unscored`, exclude those from numerical mean but preserve diagnostic output.
Upstream author reports an evaluation test suite of 1343 tests and scripted main-versus-fix counterexample. No independent execution or host impact was observed in this run.
This is one publisher lineage: upstream issue #8276, PR #8277, authored fixtures and test assertions. Repeating those in A2 does not increase independent corroborators.
Local Incident: NOT_ESTABLISHED; Zero does not have an observed deployed ADK evaluator run trace.
Existing Defense: UNKNOWN_FOR_ZERO; no local control is claimed or discounted solely from external source.
Measured Effectiveness: NOT_COMPUTED; upstream author test counts are not local detection rates.
Decision Basis: source-level error classification is plausible, yet final fix, full regression coverage and actual Zero applicability are unknown.

## ORIENTATION_NOTES
- Eligibility gate is conceptually `RUN_HAS_VALID_OVERALL_EVALUATION` before `AGGREGATE_PER_INVOCATION_SCORES`. One invocation's score alone does not decide its parent's run status.
- A failure to evaluate is not a scored failure at zero: `NOT_EVALUATED` should survive into the final report, not be silently dropped when a mandatory gate requires all runs.
- Positive P1 (NOT_EXECUTED): two valid evaluated runs with scores below/above threshold should preserve standard aggregation and resulting pass/fail semantics.
- Positive P2 (NOT_EXECUTED): a run whose overall result is valid but includes an optional per-invocation `None` should be processed under its metric contract; blindly discarding all partly scored runs may overcorrect.
- Negative N1 (NOT_EXECUTED): all runs unscored with overall `NOT_EVALUATED`; do not turn empty divisor into zero, PASS or independent safety guarantee.
- Negative N2 (NOT_EXECUTED): a valid low-scored run plus an invalid run carrying one high per-turn score; invalid score must not push mean above threshold.
- Negative N3 (NOT_EXECUTED): a missing overall metric record and an explicit `NOT_EVALUATED` record are different states; source's fix is conditional and should be tested separately for absent metadata.
- Negative N4 (NOT_EXECUTED): `MagicMock` boolean truthiness for new `run_unscored` field can cause overly broad filtering in old fixtures; tests must explicitly set the field or use type-safe instances.
- Negative N5 (NOT_EXECUTED): aggregate CLI and `AgentEvaluator` both agree in output only because they share a flawed computation; same-code consistency is not an external correctness oracle.
- Candidate report trace: `(evaluation_id, model_version, metric_id, run_id, run_status, run_score_or_none, invocation_scores, eligible_subset, threshold, aggregate, verdict, evaluator_revision)`.
- Semantics must separate `RUN_INELIGIBLE`, `MISSING_SCORE`, `EVALUATOR_FAILED`, `METRIC_BELOW_THRESHOLD` and `METRIC_ABOVE_THRESHOLD`; those are proposed analytical distinctions, not proven Zero host runtime states.
- An evaluator returning success to CI is not an independent confirmation the model passed all required metrics. A formal release gate must check coverage and NotEvaluated disposition explicitly, not rely only on a numeric mean.

## NO_DECISION_SECTION
Decision: NO_DECISION
Doctrine Promotion: NO
Local Incident Verdict: NOT_ESTABLISHED
Existing Defense Verdict: UNKNOWN_FOR_ZERO
Measured Effectiveness: NOT_COMPUTED
Host Kernel Action: NONE
Reason: one unmerged first-party proposal with authored fixtures, no independently reproduced evaluator run, no local dependency, no authoritative production outcome.

## EVIDENCE_DELTA
- NEW_EVIDENCE: actual original A1 merge and exact retained A1 blob; source PR's OPEN disposition/head reconfirmed without assuming a release.
- CORRECTED_INTERPRETATION: `NOT_EVALUATED` is ineligibility, not a numeric threshold verdict; excluding unscored runs does not itself prove evaluation coverage is sufficient.
- UNCHANGED_BOUNDARY: EXTERNAL_RISK != LOCAL_INCIDENT != EXISTING_DEFENSE != MEASURED_EFFECTIVENESS; one publisher's patch/tests are one lineage.
- NEW_COUNTEREVIDENCE: unscored all-runs, mixed valid/invalid scores, missing overall record, partial legitimate scoring and mock truthiness are separate classification failures.
- UNKNOWN_RETAINED: final PR outcome, independent regression reproduction, correctness across metrics, host evaluator use, local effectiveness and downstream release gate behavior.
- NEXT_RETEST_CONDITION: pin before/after ADK wheel and evaluator configuration, rerun mandatory scoring scenarios and `--num_runs` in a controlled environment, retain per-run/turn statuses and authoritative CLI/report results, then require Zero host invocation evidence before local promotion.

## NEXT_HANDOFF_AND_BOUNDARY
- 2026-W47 A3/A4 NOT_DUE (week ends 2026-11-22); November A5/A6 NOT_DUE. Daily Native A2 not equal Independent A2 maintenance.
- No Zero kernel, Ballast, Aegis memory, source registry, governance, scheduler or historical Jules changes.
- Actual operations: GitHub original PR merge/main/blob/source state readback; Aegis checker, Google ADK unit tests, real evaluator and host execution: NOT_EXECUTED.
- Single canonical A2 research file on a new branch; no host incident or human approval claimed, awaiting Human Maintainer review.
