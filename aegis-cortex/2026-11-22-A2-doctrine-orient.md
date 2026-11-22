# A2 Daily Orient — 2026-11-22 / invocation-local agent copy is not authorization or effect proof

## CORTEX_RUN_HEADER
Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A2
Canonical Identity: zero/aegis/A2
Cadence: Daily
Loop Stage: Orient
Logical Date: 2026-11-22
Logical Timezone: Asia/Shanghai
Agent: GPT-6 / GPT_NATIVE / HUMAN_REQUESTED / NOT_JULES_REPLAY
Record Provenance: HUMAN_AUTHORIZED_SUBSTITUTE
Base Main SHA: 2daf390698ce6f87f2d43a916af2ea3ee0ecfd2f
Run Identity: zero-entropy-lab/A2/2026-11-22/GPT_NATIVE/2daf390/counterevidence-orient-01
Source Identity: google/adk-python PR #8286, head 430e1d7a1000535640e5b836976dee86e6d681cb
Source Authority For Claim: FIRST_PARTY_OPEN_PATCH_AND_AUTHOR_TESTS / SAME_ISSUER_AS_UPSTREAM
Independent Verification: UPSTREAM_MERGE_SHA_10548b5dd1f8bb10e0150f6a7b39fb47951ada7c / EXACT_MAIN_BLOB_fa3cc65b578168be01b45dc653f6ade8ada212ef / NO_INDEPENDENT_ADK_SDK_REPRODUCTION
Host Applicability: UNKNOWN / NO_HOST_DEPLOYMENT_OR_EXTERNAL_EFFECT_RECEIPT
Evidence Upgrade Basis: PREDECESSOR_DEPENDENCY_SATISFIED / COUNTEREXAMPLE_NARROWING / NO_ADOPTION_PROMOTION
Original Execution Status: GITHUB_SOURCE_AND_MERGED_PREDECESSOR_REVIEW / ADK_E2E_NOT_EXECUTED
Current Path Status: PROPOSED_DRAFT_PR / NOT_MERGED_AT_AUTHORING
Task Status: BOUNDED_A2_ORIENTATION / NO_HOST_DECISION
Write Scope: aegis-cortex/2026-11-22-A2-doctrine-orient.md
Boundary Violation: NO

## INPUT_RECORD
- Current fresh main after independent A1: `2daf390698ce6f87f2d43a916af2ea3ee0ecfd2f`, original Native upstream PR merge commit `10548b5dd1f8bb10e0150f6a7b39fb47951ada7c` was observed before this task
- Actual `aegis-cortex/2026-11-22-A1-reliability-observe.md` on current main reopened with Git blob `fa3cc65b578168be01b45dc653f6ade8ada212ef` exactly matching the original upstream artifact
- Current evidence policy: `aegis-cortex/EVIDENCE_POLICY.md` blob `4977de3ac6cc8fbfd59bb0f7ebbb1957a9f22d84`
- Upstream first-party source: google/adk-python PR #8286, head 430e1d7a1000535640e5b836976dee86e6d681cb, OPEN / NOT_MERGED at recheck; an unmerged patch is not a released package
- Source patch and authored tests refer to one upstream issuer; following H1/A1 is not independent corroboration
- Previous day and closed weekly records remain historical; Nov22's novel source is not a separate second daily signal

## RISK_CLASSIFICATION
External Risk: SHARED_CHILD_AGENT_CONFIGURATION_CONTAMINATION_ACROSS_INVOCATION_MODE
Local Incident Evidence: NOT_ESTABLISHED; no Zero kernel/live user action observed
Local Evidence: UNKNOWN_FOR_ZERO
Existing Defense: UNKNOWN_FOR_ZERO; a clone diff in external repository does not prove a host defense
Measured Effectiveness: NOT_COMPUTED; upstream author test reports are not local reliability metrics
Local Applicability: UNKNOWN / NO_ZERO_LIVE_SEQUENTIAL_AGENT_RUNTIME_RECEIPT

## ORIENTATION_NOTES
- Upstream A1 pinned patch shows `SequentialAgent._run_live_impl` previously mutating shared child tools/instructions; proposal uses `_with_completion_tool` and `BaseAgent.clone(update=...)` for invocation-local preparation
- Patch source and authored regression fixture support an intended non-mutation property, not independently executed concurrent Live behavior or proof of nested object isolation
- Upstream author reports narrow test before/after and a wider unit suite, not a live remote session or production field measurement
- Proposed contract: immutable agent definition revision + invocation ID + execution mode + prepared tool set + instruction digest + pending effect receipt
- Negative N1 (NOT_EXECUTED): two overlapping invocations share a child and one mutates `tools` after the other resolves its allowed tool list; copy-on-call must be tested under overlapping lifetimes
- Negative N2 (NOT_EXECUTED): a clone retains nested callback/tool state by reference, so top-level child object is distinct but nested mutation still leaks
- Negative N3 (NOT_EXECUTED): a child already contains a custom tool named `task_completed`, so dedupe bypasses adding expected behavior and early task-completion semantics differ
- Negative N4 (NOT_EXECUTED): API returns 'task completed' while a pending external write lacks authoritative sink receipt; execution-mode hygiene alone is not a completion oracle
- Positive P1 (NOT_EXECUTED): repeated Live, asynchronous and overlapping invocations retain byte-identical original child tool/definition state; ordinary invocation never sees Live-only control
- Reasonable narrowing: per-invocation agent construction or immutable tool lists may eliminate the cross-run mutation precondition; no evidence identified an equivalent mutation in Zero

## NO_DECISION_SECTION
Decision: NO_DECISION / NO_KERNEL_MODIFICATION / NO_DOCTRINE_PROMOTION; external PR does not become local incident
Remaining Uncertainty: actual upstream merge, deep aliasing, concurrency behavior, applicable Zero host configuration and real effect-sink outcomes

## NEXT_HANDOFF
- W47 Aegis A3/A4 only after 2026-11-22 end-of-week close and all actually retained Daily source inputs; no current FINAL
- November A5/A6 remains NOT_DUE before month boundary
- Retest source-before/source-after with pinned ADK revision and actual run receipt before strengthening doctrine

## EVIDENCE_DELTA
- NEW_EVIDENCE: exact merged same-day upstream task identity and source blob, followed by independent counterevidence-focused orientation
- CORRECTED_INTERPRETATION: same publisher's source/tests cannot be transformed into independent verification by a second research phase
- UNCHANGED_BOUNDARY: external proposal != released SDK != host adoption != local incident/effect; Native != independent maintenance
- NEW_COUNTEREVIDENCE: intermediate contract, aliasing/concurrency or runtime effect gaps can invalidate broader guarantees inferred from patch/code shape
- UNKNOWN_RETAINED: production use, broad SDK regression, local host behavior, release status, verified impact and independent external effect
- NEXT_RETEST_CONDITION: immutable before/after SDK test, source-version-pinned real invocation, exact arg/tool identity and authoritative effect receipt
Counterevidence Gate: PASS_FOR_BOUNDED_SOURCE_ORIENTATION / DENY_CLAIM_PROMOTION

## BOUNDARY_CHECK
- Scope only this canonical Native H2/A2; historical Jules, Parallax/Ballast, Independent A1/A2, governance, host kernel and private scheduler unchanged
- GitHub source, merged upstream artifact and policy were read; complete local checker/native SDK E2E and host runtime NOT_EXECUTED
- Independent human review and own PR merge/main retention NOT_OBSERVED at authoring; no automatic role-level PASS
Host Kernel Modification: NO
Original failure incidence: NOT_OBSERVED
Local code change: NONE
