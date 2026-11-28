# A1 Daily Reliability Observe — 2026-11-28 / reservation before yield
## CORTEX_RUN_HEADER
Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A1
Canonical Identity: zero/aegis/A1
Cadence: Daily
Loop Stage: Observe
Logical Date: 2026-11-28
Logical Timezone: Asia/Shanghai
Agent: GPT-6.2 / GPT_NATIVE / HUMAN_REQUESTED / NOT_JULES_REPLAY
Record Provenance: HUMAN_AUTHORIZED_SUBSTITUTE
Base Main SHA: 5f451040cac1e341388e1ce662da3a8d95fe7912
Run Identity: zero-entropy-lab/aegis/A1/2026-11-28/GPT_NATIVE/5f451040cac1/reserve-01
Evidence Class: EXTERNAL_RISK_CLASS
Source Identity: modelcontextprotocol/python-sdk PR #3936 / 16f76641760383f44d49c7dec82ed28cf28da751
Source Authority For Claim: PRIMARY_PROPOSED_SOURCE_PATCH_AND_AUTHOR_FIXTURE
Independent Verification: EXACT_PR_METADATA_AND_FILE_PATCH_INSPECTED / SDK_NOT_EXECUTED
Local Incident Evidence: NO_LOCAL_EVIDENCE / NOT_ESTABLISHED
Host Applicability: UNKNOWN
Original Execution Status: SOURCE_REVIEW_EXECUTED / FULL_CHECKER_NOT_EXECUTED
Current Path Status: PROPOSED_DRAFT_PR / NOT_MERGED_AT_AUTHORING
Task Status: BOUNDED_EXTERNAL_RISK_REVIEW
Write Scope: aegis-cortex/2026-11-28-A1-reliability-observe.md
Host Repository Change: NO
Boundary Violation: NO

## INPUT_RECORD
- Policy blob 4977de3ac6cc8fbfd59bb0f7ebbb1957a9f22d84; checker blob f557f7ff32687dd8e169dea032a6e11c64804c68; prior A1 blob 06079b862ab62a1643380df7deaf149ee1306fdc. Fresh nontruncated tree; no same-day A1/open PR at initial preflight; W47 retained; W48/November NOT_DUE.
- Prior cancellation/cleanup proposal concerned teardown; new lead concerns admission race before a stream writer is scheduled. Observation Nov28 Shanghai; source published Nov27 Shanghai. No claim of today's external release.

## EXTERNAL_SOURCE_RECORDS
Source ID: SRC-20261128-A01
URL: https://github.com/modelcontextprotocol/python-sdk/pull/3936
Title: Register standalone GET SSE stream slot before yielding
Publisher: MCP Python SDK contributor
Source Publication Time: 2026-11-27T14:53:21Z
Source Revision: head 16f76641760383f44d49c7dec82ed28cf28da751; base 77001c96f9507be0f4d009b83210a384a5e08bda; CLOSED / UNMERGED
Evidence Tier: PRIMARY_PROPOSED_PATCH_AND_AUTHOR_FIXTURE
Confidence: exact code movement and regression assertion inspected; runtime occurrence and coverage not independently verified
Uncertainty: accepted fix, event delivery, cancellation cleanup, deployment and local applicability unknown
External Evidence: src/mcp/server/streamable_http.py and tests/shared/test_streamable_http.py patches; issue #3891 not independently inspected.
Local Evidence Available: NO

## RAW_RELIABILITY_SIGNAL_LOG
- Author describes two GET requests passing a slot conflict check before either spawned writer registers the standalone stream. The patch moves the stream-map reservation out of standalone_sse_writer into the request path, before response handling; moves cleanup into the request finally block.
- Proposed concurrent regression opens two GET streams and expects sorted HTTP statuses [200, 409]. The modified teardown fixture waits until a receiver is parked before sending its test event, separating registration from readiness.
- This is a check-to-reservation ordering hazard: admission, reservation, consumer readiness, delivery and cleanup are distinct. The author report is not a local Zero incident or independently reproduced SDK failure.
- Closed without merge at observation. No measured local effectiveness or established defense. Corpus-wide deduplication not completed.

## Counterevidence Gate
- An admission status pair does not prove event delivery, absence of overwritten ownership under other concurrency models, or authoritative external completion.
- A reserved slot can exist before the writer is ready. Cancellation before readiness and during cleanup needs separate tests; a finally block is not proof cleanup awaited successfully under cancellation.
- Multi-process/session ownership and cross-process atomicity are outside the visible single-transport patch. No claim that local Zero uses this mechanism.

## EVIDENCE_DELTA
- NEW_EVIDENCE: exact proposed reservation/cleanup ordering change and concurrent status assertion.
- CORRECTED_INTERPRETATION: conflict check != reservation != ready consumer != delivered event.
- UNCHANGED_BOUNDARY: EXTERNAL_RISK != LOCAL_INCIDENT != EXISTING_DEFENSE != MEASURED_EFFECTIVENESS.
- NEW_COUNTEREVIDENCE: readiness wait added to teardown fixture; a 200/409 pair alone cannot settle delivery.
- UNKNOWN_RETAINED: acceptance, production incident prevalence, cancellation cleanup, Zero applicability.
- NEXT_RETEST_CONDITION: pinned accepted revision; controlled interleaving around check/reservation/consumer start, cancellation and delivery; record stream ownership and exact event readback separately from statuses.

## NEXT_HANDOFF
A2 only after original same-day A1 merges and exact main artifact is reread. Independently review readiness, ownership, and cancellation counterexamples; no host change.

## BOUNDARY_CHECK
Remote source inspection executed. Full aegis-cortex/check.py, SDK suite, Zero runtime and external effect checks NOT_EXECUTED. No historical changes. Draft awaits Human Maintainer.
