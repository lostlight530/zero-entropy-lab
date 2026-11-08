# A2 Daily Aegis Doctrine Orient — 2026-11-08

## CORTEX_RUN_HEADER
Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A2
Canonical Identity: zero/aegis/A2
Cadence: Daily
Loop Stage: Orient
Logical Date: 2026-11-08
Logical Timezone: Asia/Shanghai
Agent: GPT-6 / GPT_NATIVE / NOT_JULES_REPLAY
Producer Identity: HUMAN_REQUESTED_GPT_NATIVE
Record Provenance: HUMAN_AUTHORIZED_SUBSTITUTE
Evidence Class: EXTERNAL_RISK_CLASS / SEGMENT_IDENTITY_CODE_REVIEW
Source Identity: langchain-ai/langgraph@e5e37b5d70dbfd93c7006bd90a658c6179a95946
Source Authority For Claim: FIRST_PARTY_IMPLEMENTATION_AND_AUTHORED_TEST_DIFF
Independent Verification: SOURCE_PATCH_REOPENED / UPSTREAM_TESTS_NOT_EXECUTED
Original Execution Status: GPT_NATIVE_BOUNDED_SOURCE_ORIENTATION
Current Path Status: NEW_BRANCH_PROPOSAL / MAIN_RETENTION_PENDING_MERGE
Local Applicability: UNKNOWN / ZERO_HOST_NOT_INSPECTED_FOR_SUBGRAPH_USE
Remaining Uncertainty: NO_LOCAL_INCIDENT_OR_DEPLOYED_FIX_EVIDENCE
Base Main SHA: d92232e1d0d2441942d6dd092cb8cba85bc48e9d
Run Identity: zero-entropy-lab/aegis/A2/2026-11-08/GPT_NATIVE/d92232e1d0d2441942d6dd092cb8cba85bc48e9d/langgraph-namespace-counterexample
Upstream A1: aegis-cortex/2026-11-08-A1-reliability-observe.md
Upstream A1 Blob SHA: b25f3f2c906d3844d3c76ca9e315522c2d502c94
Upstream A1 PR: https://github.com/lostlight530/zero-entropy-lab/pull/824
Input Status: SAME_DATE_A1_MERGED_MAIN_VISIBLE
Input A1 Task Status: SUCCESS_BOUNDED_EXTERNAL_RISK_STUDY
Source Status: FIRST_PARTY_COMMIT_CODE_SYNC_ASYNC_TESTS_REOPENED / TEST_NOT_EXECUTED
Network Status: GITHUB_PRIMARY_SOURCE_VERIFIED
Task Status: SUCCESS_BOUNDED_EXTERNAL_RISK_ORIENTATION / NO_LOCAL_DEFECT_ATTESTED
Host Applicability: UNKNOWN
Write Scope: aegis-cortex/2026-11-08-A2-doctrine-orient.md
Boundary Violation: NO

## INPUT_RECORD
- Fresh main d92232e1d0d2441942d6dd092cb8cba85bc48e9d, after Aegis A1 PR #824 merged 2026-11-08T09:21:35Z; exact A1 blob b25f3f2c906d3844d3c76ca9e315522c2d502c94 re-read from main
- Nov7 Aegis A1/A2 covered Google ADK session retry and waiting-node replay; that original source family is not LangGraph namespace identity evidence
- Reopened the LangGraph original source patch and authored test changes from commit e5e37b5d70dbfd93c7006bd90a658c6179a95946 dated 2026-11-06T16:08:12Z; no independent Python/JS runtime or Zero Host Kernel test ran
- W45 OPEN at this Shanghai Sunday snapshot; November A5/A6 not naturally due

## SOURCE_VERIFICATION_RECORDS
### SRC-20261108-A2-01 — segment-aware namespace selection
URL: https://github.com/langchain-ai/langgraph/commit/e5e37b5d70dbfd93c7006bd90a658c6179a95946
Path: libs/langgraph/langgraph/pregel/main.py
- Previously get_subgraphs(namespace=...) used namespace.startswith(name) without segment delimiters, allowing a name prefix to qualify as an exact segment
- The patched sync getter requires namespace == name OR namespace.startswith(name + NS_SEP), with a derived child_namespace on recursion
- The source also updates the namespace-routing caller _subgraph_for_namespace to use the newly exact filtered get_subgraphs rather than manually walking every graph and comparing names afterward
- The async aget_subgraphs path is modified to enforce the same namespace segment boundary
- This is source-verified implementation semantics; the patch alone does not prove every graph deployment or caller is upgraded

### SRC-20261108-A2-02 — published test counterexamples
Path: libs/langgraph/tests/test_subgraph_persistence.py and libs/langgraph/tests/test_subgraph_persistence_async.py at same original commit
- Parent constructs both a nested research|review and a direct research_review subgraph, as well as direct review and parent research
- Parameterized sync and async tests assert selection of exactly the requested namespace object, not every name with the same prefix
- Separate tests specify nested state update should raise for a disallowed path even if a top-level namesake exists
- These are authored regression fixtures, not test-execution receipts or production incident measurements
- Both source categories share ONE LangGraph publisher lineage; the A1/A2 repetition must not inflate independent evidence counts

## RISK_CLASSIFICATION
Signal ID: SIG-20261108-A01
External Risk: NAMESPACE_SEGMENT_ALIASING / WRONG_SUBGRAPH_ROUTING
Original A1 Risk: prefix matching can select wrong graph identity under particular names, not universal arbitrary graph access
Verification: SOURCE_PATCH_AND_AUTHORED_COUNTEREXAMPLES_REOPENED / NO_INDEPENDENT_RUNTIME_REPLAY
Counterevidence: requests with unambiguous whole-segment names have no demonstrated alias collision; exact matches and child separators are explicit guards in the patched code
Actual Local Incident: NOT_OBSERVED / NO_ZERO_HOST_GRAPH_MISROUTING_ATTESTED
Existing External Defense: SEGMENT_AWARE_CHECK_IN_UPSTREAM_COMMIT
Existing Zero Defense: UNKNOWN / HOST_INTEGRATION_NOT_AUDITED
Measured Effectiveness: NOT_COMPUTED
Versioned Availability: UNKNOWN / COMMIT_NOT_EQUAL_PUBLISHED_PACKAGE_RELEASE
Host Applicability: UNKNOWN
Decision: NO_LOCAL_DOCTRINE_PROMOTION

## COUNTEREVIDENCE_GATE
- Source-code presence is evidence for a change in matching predicate, not an observed exploit or Zero defect
- The sync and async test fixtures represent one author test family and were not executed; their expected outcomes are not current environment PASS receipts
- A nested-name collision requires specific graph composition and namespace argument; it is not evidence that all graph operations resolve incorrectly
- Even if exact subgraph lookup is corrected, state-routing safety requires independent checkpointer and target identity receipts at mutation time
- JS parity is a future research lead, not verified in this run
- Zero Host Kernel, Ballast effect fences and NEXUS are distinct surfaces; nothing observed here proves shared implementation

## ORIENTATION_NOTES
- NEW_EVIDENCE: independently reread patched sync/async source predicates and the exact nested versus flat namespace regression fixtures
- CORRECTED_INTERPRETATION: namespace routing correctness depends on separator-aware component identity rather than character-prefix equality
- UNCHANGED_BOUNDARY: EXTERNAL_CODE_CHANGE != LOCAL_INCIDENT != LOCAL_DEFENSE != MEASURED_SUCCESS
- NEW_COUNTEREVIDENCE: exact whole-segment selection narrows the demonstrated issue to concrete prefix-collision graphs; no local storage mutation follows from reading issuer patch
- UNKNOWN_RETAINED: installed LangGraph version, Zero equivalent, JS parity, production frequency, actual sync/async test outputs, state-effect receipts
- NEXT_RETEST_CONDITION: pin before/after LangGraph versions and a real checkpointer; run exact sync/async get_subgraphs + nested state update fixtures, record namespace IDs, output exceptions, state snapshot, file/commit SHA, stdout/stderr and exit codes

## NO_DECISION_SECTION
Decision: NO_DECISION / NO_HOST_KERNEL_OR_AEGIS_PROTOCOL_CHANGE
This single external code/test lineage does not justify changing Zero runtime permissions, schema, Ballast, Aegis long-term memory, NEXUS or production failure-rate estimates

## NEXT_HANDOFF
- A3/A4 after actual W45 closure may consider one bounded external risk observation, not two independent risk events; do not claim local incident
- November A5/A6 remains NOT_DUE; future defense adoption requires an explicit local implementation and tested effect boundary

## BOUNDARY_CHECK
- This 2026-11-08 canonical A2 file only; original A1, previous Jules records, host, Ballast, NEXUS, workflows, memory and independent maintenance unchanged
- Source/test patch inspection performed; upstream Python tests, independent JS parity, Zero Host Kernel, Aegis checker and live graph effects NOT_EXECUTED
- Boundary Violation: NO
