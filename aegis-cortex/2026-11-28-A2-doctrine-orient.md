# A2 Daily Doctrine Orient — 2026-11-28 / reservation and cleanup ownership

## CORTEX_RUN_HEADER
Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A2
Canonical Identity: zero/aegis/A2
Cadence: Daily
Loop Stage: Orient
Logical Date: 2026-11-28
Logical Timezone: Asia/Shanghai
Agent: GPT-6.2 / GPT_NATIVE / HUMAN_REQUESTED / NOT_JULES_REPLAY
Record Provenance: HUMAN_AUTHORIZED_SUBSTITUTE
Base Main SHA: e4e9abfcd532f9aefb69d5dcf80f411eec7c71dc
Run Identity: zero-entropy-lab/aegis/A2/2026-11-28/GPT_NATIVE/e4e9abfcd532/ownership-01
Evidence Class: EXTERNAL_RISK_CLASS / CHECK_RESERVATION_AND_CLEANUP_OWNERSHIP
Source Identity: modelcontextprotocol/python-sdk PR #3936 / 16f76641760383f44d49c7dec82ed28cf28da751; linked issue #3891
Source Authority For Claim: PRIMARY_PROPOSED_SOURCE_PATCH / AUTHOR_REPORTED_REPRO
Independent Verification: MERGED_A1_READBACK / PATCH_AND_LINKED_ISSUE_RECHECK / STANDALONE_CONTROL_EXECUTED / SDK_NOT_EXECUTED
Local Incident Evidence: NOT_ESTABLISHED
Local Repository Evidence: NO_LOCAL_RECEIPT_ESTABLISHED
Existing Defense: UNKNOWN
Measured Effectiveness: NOT_COMPUTED
Host Applicability: UNKNOWN
Evidence Upgrade Basis: BOUNDED_INTERLEAVING_AND_OWNERSHIP_CONTROL / NO_UPSTREAM_ACCEPTANCE_PROMOTION
Original Execution Status: SOURCE_REVIEW_AND_STANDALONE_CONTROL_EXECUTED / FULL_CHECKER_NOT_EXECUTED
Current Path Status: PROPOSED_DRAFT_PR / NOT_MERGED_AT_AUTHORING
Task Status: BOUNDED_SOURCE_ORIENTATION / NO_HOST_DECISION
Write Scope: aegis-cortex/2026-11-28-A2-doctrine-orient.md
Host Kernel Modification: NO
Boundary Violation: NO

## INPUT_RECORD
- Original same-day aegis-cortex/2026-11-28-A1-reliability-observe.md merged via #957, merge e4e9abfcd532f9aefb69d5dcf80f411eec7c71dc; exact A1 blob 12f44d9d4889ca1989c9d81f8251a3d191375e68 reread from fresh main. Original A1 authoring state preserved.
- Policy blob 4977de3ac6cc8fbfd59bb0f7ebbb1957a9f22d84; checker f557f7ff32687dd8e169dea032a6e11c64804c68; prior A2 blob b1fcc2f31ac7f3f64d3bdce23914a4fdc8aec430. W48 and November closure NOT_DUE.
- Upstream https://github.com/modelcontextprotocol/python-sdk/pull/3936 remains CLOSED / UNMERGED with unchanged head; created 2026-11-27T14:53:21Z. Linked https://github.com/modelcontextprotocol/python-sdk/issues/3891 remains open; created 2026-11-21T13:24:48Z. Issue reports [200,200] instead of [200,409] on main@77001c96 and cross-owner cleanup; reproduction is author-reported, not independently executed. One linked external evidence lineage.

## RISK_CLASSIFICATION
- External Risk: check-to-reservation race, stale ownership and cleanup attribution. The proposed patch moves registration before response handling and cleanup into request finally. The added test asserts admission statuses [200,409]; the modified teardown fixture separately waits for consumer readiness.
- The linked report adds the specific claimed consequence of one writer overwriting another, then a closing request cleaning up the other connection's active stream. Source review supports the ordering concern, but neither report nor patch is proof of a Zero incident, accepted upstream fix, or observed delivery.
- Reservation in one event loop is not a distributed lock; key-only deletion is not owner-authorized deletion. The latter is a distinct modeled negative control, not a claim that this proposed fix admits stale cleanup in its actual SDK lifecycle.

## ORIENTATION_NOTES
- Standalone A2-20261128-RESERVATION-OWNERSHIP-01; actual UTC command group 2026-11-28T02:14:50Z–02:14:52Z; Linux, Python 3.13.5; command python a2.py in isolated scratch; exit 0, stderr empty; script SHA256 53fe6c5966042f22a9ea06ab4df874a16d62b9f9a57f1561bafe219055f6c3f9.
- Exact UTF-8 LF script:
```python
import asyncio

async def trial(reserve_early):
    slot = {}
    ready = asyncio.Event()
    release = asyncio.Event()
    async def request_a():
        assert 'get' not in slot
        if reserve_early:
            slot['get'] = 'A'
        ready.set()
        await release.wait()
        if not reserve_early:
            slot['get'] = 'A'
        return 200
    async def request_b():
        await ready.wait()
        if 'get' in slot:
            return 409
        slot['get'] = 'B'
        return 200
    a = asyncio.create_task(request_a())
    b = await request_b()
    before = slot.get('get')
    release.set()
    status = (await a, b)
    print('early=', reserve_early, 'statuses=', status, 'before=', before, 'after=', slot['get'])
    assert status == ((200, 409) if reserve_early else (200, 200))
    assert before == ('A' if reserve_early else 'B')
    assert slot['get'] == 'A'

async def main():
    await trial(False)
    await trial(True)
    slot = {'get': 'new-owner'}
    stale_owner = 'old-owner'
    key_only = slot.copy(); key_only.pop('get', None)
    guarded = slot.copy()
    if guarded.get('get') == stale_owner:
        guarded.pop('get', None)
    print('stale cleanup:', key_only, guarded)
    assert not key_only and guarded == slot

asyncio.run(main())
```
- Actual stdout:
```text
early= False statuses= (200, 200) before= B after= A
early= True statuses= (200, 409) before= A after= A
stale cleanup: {} {'get': 'new-owner'}
```
- Controlled interleaving proves only the explicit toy schedule. The second control assumes ownership replacement and demonstrates deletion by key versus owner comparison; it does not establish that replacement is reachable in the upstream patch. No HTTP, SDK, AnyIO, actual stream delivery, cancellation cleanup, or multi-process execution.
- Local Applicability: UNKNOWN; local installed SDK, ownership state, real stream event and teardown receipts not established.
- Remaining Uncertainty: upstream acceptance, lifecycle reachability, cancellation before/inside cleanup, readiness, delivery, and actual Zero defense/effectiveness.

## NO_DECISION_SECTION
NO_DECISION / NO_HOST_PROMOTION. Local incident NOT_ESTABLISHED; existing defense UNKNOWN; measured effectiveness NOT_COMPUTED. One bounded standalone control, inherited external lineage.

## EVIDENCE_DELTA
- NEW_EVIDENCE: linked issue and exact patch rereview; actual scheduled interleaving and stale-owner deletion counterexample.
- CORRECTED_INTERPRETATION: conflict check != reservation != ready consumer != delivery != owner-attributed cleanup.
- UNCHANGED_BOUNDARY: EXTERNAL_RISK != LOCAL_INCIDENT != EXISTING_DEFENSE != MEASURED_EFFECTIVENESS.
- NEW_COUNTEREVIDENCE: late reservation admits both toy requests and overwrites ownership; early reservation rejects one in this schedule; key-only cleanup deletes new ownership in the explicit replacement fixture.
- UNKNOWN_RETAINED: real SDK race coverage, accepted fix, lifecycle reachability, cleanup completion and local applicability.
- NEXT_RETEST_CONDITION: accepted pinned SDK, controlled concurrent GETs and event readback; cancellation before readiness and during teardown; explicit ownership-generation and authoritative post-cleanup state, plus distinct-session control.

## NEXT_HANDOFF
Retain same-day A1/A2 for next eligible closed week; no host kernel or governance change, no premature Weekly/Monthly.

## BOUNDARY_CHECK
Original A1 merge/readback, upstream patch/issue review and standalone control executed. Actual git ls-remote https://github.com/lostlight530/zero-entropy-lab.git refs/heads/main exited 128: Could not resolve host: github.com; stdout empty. Full aegis-cortex/check.py, SDK, provider and host runtime NOT_EXECUTED. One Native A2, not Independent A2. No historical or kernel changes. Human Maintainer authorization separate from checker result.
