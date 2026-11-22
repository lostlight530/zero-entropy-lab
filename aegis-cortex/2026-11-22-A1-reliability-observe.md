# A1 Daily Reliability Observe — 2026-11-22 / live-only completion tool contaminates shared agent configuration

## CORTEX_RUN_HEADER
Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A1
Canonical Identity: zero/aegis/A1
Cadence: Daily
Loop Stage: Observe
Logical Date: 2026-11-22
Logical Timezone: Asia/Shanghai
Agent: GPT-6 / GPT_NATIVE / HUMAN_REQUESTED / NOT_JULES_REPLAY
Record Provenance: HUMAN_AUTHORIZED_SUBSTITUTE
Base Main SHA: 314384bbb06ec2a813f91bdb80de97029cc1b1e4
Run Identity: zero-entropy-lab/aegis/A1/2026-11-22/GPT_NATIVE/314384b/live-shared-subagent-01
Evidence Class: EXTERNAL_RISK / SHARED_AGENT_MUTATION_AND_CONCURRENT_INVOCATION_RACE
Source Identity: google/adk-python PR #8286, pinned head 430e1d7a1000535640e5b836976dee86e6d681cb
Source Authority For Claim: FIRST_PARTY_OPEN_PR_PATCH_AND_AUTHORED_REGRESSION_FIXTURE
Independent Verification: PINNED_GITHUB_PR_METADATA_AND_IMPLEMENTATION_TEST_PATCH_INSPECTED / TESTS_NOT_REPRODUCED
Local Incident Evidence: NOT_ESTABLISHED
Local Repository Evidence: NO_LOCAL_KERNEL_RUN_RECEIPT_INSPECTED_FOR_THIS_FAILURE_CLASS
Existing Defense: UNKNOWN_FOR_ZERO
Measured Effectiveness: NOT_COMPUTED
Host Applicability: UNKNOWN / NO_ZERO_LIVE_SEQUENTIAL_ADK_DEPLOYMENT_OBSERVED
Original Execution Status: REMOTE_CODE_REVIEW / ADK_UNIT_TESTS_AND_KERNEL_RUNTIME_NOT_EXECUTED
Current Path Status: PROPOSED_DRAFT_PR / NOT_MERGED_AT_AUTHORING
Task Status: BOUNDED_EXTERNAL_RISK_HYPOTHESIS / NO_LOCAL_INCIDENT
Write Scope: aegis-cortex/2026-11-22-A1-reliability-observe.md
Host Kernel Modification: NO
Boundary Violation: NO

## INPUT_RECORD
- Cold-start base main: `314384bbb06ec2a813f91bdb80de97029cc1b1e4`, owning `aegis-cortex/EVIDENCE_POLICY.md` blob `4977de3ac6cc8fbfd59bb0f7ebbb1957a9f22d84`; `aegis-cortex/README.md` blob `ab1a7caaed2f338b05174d9428b071234d6a5546`.
- Current main retains 2026-11-21 A1/A2 and closed 2026-W46 A3/A4; 2026-W47 and November month are not closed. Open repo PR query and date-matching branch search returned none at preflight.
- This record addresses *mutable shared Agent configuration across invocations*, independent from yesterday's ADK evaluation scoring eligibility and from host-kernel incidents.
- Actual attempted worktree acquisition: `git ls-remote https://github.com/lostlight530/zero-entropy-lab.git refs/heads/main`, exit `128`, stdout empty, stderr `Could not resolve host: github.com`. No Zero kernel tests or host runtime measurements performed.

## EXTERNAL_SOURCE_RECORDS
Source ID: SRC-20261122-AE01
URL: https://github.com/google/adk-python/pull/8286
Title: fix(agents): keep the live task_completed out of the shared child agent
Publisher: contributor PR in first-party google/adk-python repository
Source Publication: 2026-11-21T16:16:33Z, observed on 2026-11-22 Asia/Shanghai
Source Version: OPEN_UNMERGED_PR_HEAD at 430e1d7a1000535640e5b836976dee86e6d681cb
Source implementation: https://github.com/google/adk-python/blob/430e1d7a1000535640e5b836976dee86e6d681cb/src/google/adk/agents/sequential_agent.py
Source authored fixture: https://github.com/google/adk-python/blob/430e1d7a1000535640e5b836976dee86e6d681cb/tests/unittests/agents/test_sequential_agent.py
Evidence Tier: PRIMARY_FOR_PROPOSED_PATCH_AND_TEST_INTENT / INDEPENDENT_REPRODUCTION_NONE
External Evidence: PR metadata and two changed-file patches were directly inspected, including original in-place mutation and replacement invocation-scoped cloning.
Confidence: HIGH_FOR_DIFF_STRUCTURE / MODERATE_FOR_REPORTED_FAILURE / UNKNOWN_FOR_DEPLOYED_IMPACT
Uncertainty: upstream merge, package release, real Live session, host implementation/adoption and production incidence unknown.

## RAW_RELIABILITY_SIGNAL_LOG
Risk ID: RISK-20261122-A01
External Risk: INVOCATION_SCOPED_TOOL_AND_INSTRUCTION_WRITE_LEAKS_TO_SHARED_AGENT_OBJECT
- In the original implementation shown in the PR, `SequentialAgent._run_live_impl` traverses `self.sub_agents`, mutates each `LlmAgent`'s `tools` list by appending `task_completed`, and changes `instruction` to add completion text.
- The shared child object persists across invocations; a later ordinary `run_async` or overlapping invocation may encounter the Live-only tool/instruction despite not requesting Live mode. A concurrent read/write window makes the exact contamination timing scheduling-dependent.
- The proposed patch adds `_with_completion_tool` returning an invocation-specific `BaseAgent.clone(update=...)` and iterates those prepared children without changing the caller's original `self.sub_agents`. It preserves existing dedupe when a child already contains a `task_completed` tool.
- The regression fixture asserts a Live run's prepared child sees `echo,task_completed` and added instructions, while the original child remains `tools=[echo], instruction='initial'`, including after a second Live invocation.
- PR author reports before-change `1 failed, 7 passed`, after-change `8 passed`; wider selected tests `2078 passed, 1 skipped, 2 xfailed`. These are **AUTHOR_REPORTED**, not this run's reproduced results; some optional-extension suites were not run, and no real Live API session was executed.
- The PR references an analogous adk-go fix #2294; a similar code pattern across projects is a useful comparative research lead, **not** independent reproduction of this Python PR or evidence Zero runs either system.
- A code patch demonstrating a possible contamination route is not evidence that a particular user task was incorrectly completed or a tool effect occurred. It also does not prove that the clone covers every possible alias of mutable nested configuration.

## Failure-model boundary and Counterevidence Gate
- Formal separation: `AGENT_DEFINITION_ID` != `INVOCATION_CONFIG_SNAPSHOT` != `MODEL_TOOL_LIST` != `AUTHORIZATION` != `EFFECT_OCCURRED` != `TASK_COMPLETED`.
- Candidate control identity: `(agent_tree_revision, subagent_name, invocation_id, execution_mode, tools_digest_before, instructions_digest_before, prepared_clone_id, tools_digest_after, sibling_invocation_id)`.
- Negative N1 (NOT_EXECUTED): Live and non-Live sessions share one child; observe an unexpected `task_completed` in the ordinary session's tool list (cross-invocation contamination).
- Negative N2 (NOT_EXECUTED): two overlapping Live sessions interleave original list mutations and instruction reads, causing duplicate/partial prompt state, notwithstanding single-threaded fixture tests.
- Negative N3 (NOT_EXECUTED): cloned agent retains a nested shared mutable callback/tool or name-index collision; surface aliasing may outlive top-level clone, so clone use alone is not full isolation proof.
- Positive control (NOT_EXECUTED): repeated sequential Live runs produce identical prepared tool sets, original child identity and configuration remain unchanged, ordinary run never receives Live completion tool.
- Counterevidence: if original shared object is constructed anew for every invocation, contamination may not cross runs; a local immutable agent tree or execution ownership restriction could narrow or eliminate the mechanism. No Zero host runtime was checked to select among these alternatives.
- Local Incident: NOT_ESTABLISHED. Existing Defense: UNKNOWN_FOR_ZERO. Measured Effectiveness: NOT_COMPUTED. This is not a statement that Zero's kernel is vulnerable or safe.

## EVIDENCE_DELTA
- NEW_EVIDENCE: pinned proposed upstream source mutation and invocation-local clone diff, with an authored fixture targeting retained shared-child configuration.
- CORRECTED_INTERPRETATION: adding a tool only for one execution mode is not invocation-local when performed on the reusable definition object; repeated call success is not noninterference proof.
- UNCHANGED_BOUNDARY: EXTERNAL_RISK != LOCAL_INCIDENT; PR patch != released implementation; test result assertion != reproduced test != real external completion.
- NEW_COUNTEREVIDENCE: per-invocation object ownership may remove the cross-run condition; shallow/nested cloning may still alias state; real Live session untested.
- UNKNOWN_RETAINED: upstream disposition/release, real cross-mode race frequency, production exploitability, Zero reuse pattern, reliable effect semantics.
- NEXT_RETEST_CONDITION: pin source before/after commit, execute isolation fixture and concurrent Live/ordinary interleavings with immutable configuration digests, explicit mode identity, callback aliases and actual tool-call capture; independently inspect Zero for equivalent shared-configuration mutation before any host-applicability promotion.
- Counterevidence Gate: SOURCE_PATCH_REVIEW_PASS / LOCAL_RISK_OR_DOCTRINE_PROMOTION_DENIED.

## NEXT_HANDOFF
- A2 requires the **original A1 Draft PR to merge and be retained on new main**. Reopen the exact path and blob, then independently recheck upstream status, controls, and host applicability; do not treat this record or source repetition as a new independent issuer.
- A2 before that dependency: `BLOCKED_UPSTREAM_NOT_MERGED`. No A2 artifact or separate execution credit is created here.
- Weekly A3/A4 for 2026-W47: `NOT_DUE` before natural ISO week closes; November A5/A6 `NOT_DUE`.

## BOUNDARY_CHECK
- This PR changes only `aegis-cortex/2026-11-22-A1-reliability-observe.md`.
- No Host Kernel, Ballast, A1/A2 independent maintenance, historical Jules provenance, CI, or scheduler changes.
- Structural checker `python3 aegis-cortex/check.py aegis-cortex/2026-11-22-A1-reliability-observe.md`: `NOT_EXECUTED` (full local checkout unavailable); no checker PASS or human review/merge claimed.
- Approval/merge and subsequent fresh-main A2 handoff remain with Human Maintainer.
