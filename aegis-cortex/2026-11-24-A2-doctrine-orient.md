# A2 Daily Doctrine Orient — 2026-11-24 / content role is not authenticated origin

## CORTEX_RUN_HEADER
Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A2
Canonical Identity: zero/aegis/A2
Cadence: Daily
Loop Stage: Orient
Logical Date: 2026-11-24
Logical Timezone: Asia/Shanghai
Agent: GPT-6.2 / GPT_NATIVE / HUMAN_REQUESTED / NOT_JULES_REPLAY
Record Provenance: HUMAN_AUTHORIZED_SUBSTITUTE
Base Main SHA: 791170a09b47627eee52ffa9bc95421eba109ffd
Run Identity: zero-entropy-lab/aegis/A2/2026-11-24/GPT_NATIVE/791170a09b47/fresh-source-orientation-01
Evidence Class: EXTERNAL_RISK_CLASS / ROLE_ORIGIN_SEPARATION
Source Identity: google/adk-python PR #8324 / head d8f134dd38a9e182d01d5662be86f886905186de
Source Authority For Claim: FIRST_PARTY_OPEN_UNMERGED_PATCH_AND_AUTHOR_FIXTURES
Independent Verification: MERGED_MAIN_INPUT_BLOB_25fbfc44995f66c6dcc588b8a4d8a66232ced44b / CURRENT_UPSTREAM_DIFF_RECHECK / SDK_NOT_EXECUTED
Local Incident Evidence: NOT_ESTABLISHED
Local Repository Evidence: NO_LOCAL_RECEIPT_ESTABLISHED
Existing Defense: UNKNOWN
Measured Effectiveness: NOT_COMPUTED
Host Applicability: UNKNOWN / INSTALLED_DEPENDENCY_AND_CONFIG_UNVERIFIED
Evidence Upgrade Basis: LEGAL_DEPENDENCY_AND_ADDITIONAL_SOURCE_INSPECTION / SAME_ISSUER_NO_REPLICATION
Original Execution Status: FRESH_MAIN_INPUT_AND_UPSTREAM_SOURCE_REVIEW_EXECUTED / FULL_CHECKER_AND_SDK_NOT_EXECUTED
Current Path Status: PROPOSED_DRAFT_PR / NOT_MERGED_AT_AUTHORING
Task Status: BOUNDED_SOURCE_ORIENTATION / NO_HOST_DECISION
Write Scope: aegis-cortex/2026-11-24-A2-doctrine-orient.md
Host Kernel Modification: NO
Boundary Violation: NO

## INPUT_RECORD
- Original same-day aegis-cortex/2026-11-24-A1-reliability-observe.md merged via #929, merge SHA 791170a09b47627eee52ffa9bc95421eba109ffd; exact blob 25fbfc44995f66c6dcc588b8a4d8a66232ced44b read from fresh main. This is a new orientation identity, not another independent external source.
- Current owning aegis-cortex/EVIDENCE_POLICY.md; prior Nov23 orientation and W47 handoff remain historical. W48 and November final NOT_DUE.
- Upstream [PR #8324](https://github.com/google/adk-python/pull/8324) remains OPEN / UNMERGED at d8f134dd38a9e182d01d5662be86f886905186de; base e3dbdc1726bed0bfc3d2e3f335fc7c0dcdf6b9c5. Non-null synthetic PR merge SHA is not a merge receipt when merged=false.
- Prior producer reported checkout failure; this orientation used exact GitHub source reads. No full worktree or native checker executed in this orientation.

## RISK_CLASSIFICATION
- External Risk: conditional attachment of saved tool parts to model-role content. Local Evidence: no Zero runtime receipt established. Local Applicability: installed plugin and trigger unknown.
- Exact helper selects latest non-transient content; existing user target is appended; otherwise inserts user content after target or at index zero. It does not validate principal authorization.
- Both retention branches call helper; next-call branch clears temporary stored parts. Author fixtures assert unchanged model and transient content in two retention modes. This is control-flow evidence, not runtime reproduction.

## ORIENTATION_NOTES
- Role correctness and origin authenticity are distinct. A user-role carrier may contain tool-origin content; the fix protects the model turn but does not prove a genuine user request or a permission grant.
- Negative control: existing non-transient user target receives parts without creating a new turn. All-transient sequence inserts a new user turn before the tail. Model-only/no-transient path changes continuation prompt behavior, acknowledged by author.
- Compare session versus next_model_call retention across subsequent requests; clearing temporary state is not evidence that provider persistence or local durable storage is erased.
- Remaining Uncertainty: provider serialization, provenance labels, persistence identity, installed dependency and actual effect. Retest with same source revision, both retention modes, model/user/empty/transient tails and independent authorization/sink checks.

## NO_DECISION_SECTION
NO_DECISION / NO_HOST_PROMOTION. Same source lineage rechecked; zero independent SDK replication added. No local incident or measured defense established.

## EVIDENCE_DELTA
- NEW_EVIDENCE: exact insertion and temporary-state control flow plus test assertions.
- CORRECTED_INTERPRETATION: carrier role does not authenticate content origin.
- UNCHANGED_BOUNDARY: EXTERNAL_RISK != LOCAL_INCIDENT != EXISTING_DEFENSE != MEASURED_EFFECTIVENESS.
- NEW_COUNTEREVIDENCE: existing user target and changed continuation behavior.
- UNKNOWN_RETAINED: release, deployed host, actual SDK execution and sink evidence.
- NEXT_RETEST_CONDITION: exact version, executable positive/negative matrix and authoritative effect receipt.

## NEXT_HANDOFF
Retain bounded research in next eligible closed-week synthesis; do not advance W48 or November final early.

## BOUNDARY_CHECK
Current main, original merge and upstream source rechecked. Full repository checker, SDK tests and host runtime NOT_EXECUTED. Only this canonical orientation file; history, host, governance and independent maintenance unchanged. Draft awaiting authorized merge.
