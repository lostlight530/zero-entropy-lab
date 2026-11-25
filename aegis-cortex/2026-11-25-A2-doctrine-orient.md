# A2 Daily Doctrine Orient — 2026-11-25 / retry-layer budgets versus actual attempts

## CORTEX_RUN_HEADER
Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A2
Canonical Identity: zero/aegis/A2
Cadence: Daily
Loop Stage: Orient
Logical Date: 2026-11-25
Logical Timezone: Asia/Shanghai
Agent: GPT-6.2 / GPT_NATIVE / HUMAN_REQUESTED / NOT_JULES_REPLAY
Record Provenance: HUMAN_AUTHORIZED_SUBSTITUTE
Base Main SHA: 98134833c57e524aac29e5fefe2316397bc85b10
Run Identity: zero-entropy-lab/aegis/A2/2026-11-25/GPT_NATIVE/98134833c57e/retry-layer-boundary-01
Evidence Class: EXTERNAL_RISK_CLASS / RETRY_COUNT_LAYER_MISMATCH
Source Identity: google/adk-python PR #8336 / head 50f2a31309b52a11f2ed140b57c3d07d7863565c
Source Authority For Claim: FIRST_PARTY_OPEN_UNMERGED_PATCH_AND_AUTHOR_FIXTURES
Independent Verification: MERGED_A1_READBACK / EXACT_SOURCE_RECHECK / STANDALONE_MODEL_EXECUTED / SDK_NOT_EXECUTED
Local Incident Evidence: NOT_ESTABLISHED
Local Repository Evidence: NO_LOCAL_RECEIPT_ESTABLISHED
Existing Defense: UNKNOWN
Measured Effectiveness: NOT_COMPUTED
Host Applicability: UNKNOWN / INSTALLED_DEPENDENCY_AND_CONFIG_UNVERIFIED
Evidence Upgrade Basis: ADDITIONAL_SOURCE_AND_INTERFACE_DOCUMENTATION / BOUNDED_MODEL
Original Execution Status: SOURCE_REVIEW_AND_STANDALONE_CONTROL_EXECUTED / FULL_CHECKER_AND_SDK_NOT_EXECUTED
Current Path Status: PROPOSED_DRAFT_PR / NOT_MERGED_AT_AUTHORING
Task Status: BOUNDED_SOURCE_ORIENTATION / NO_HOST_DECISION
Write Scope: aegis-cortex/2026-11-25-A2-doctrine-orient.md
Host Kernel Modification: NO
Boundary Violation: NO

## INPUT_RECORD
- Original same-day aegis-cortex/2026-11-25-A1-reliability-observe.md merged via #937; merge SHA 98134833c57e524aac29e5fefe2316397bc85b10 equals fresh main; exact A1 blob 1f865af4128bca51b759286c65b6954c462422d6 read.
- Owning EVIDENCE_POLICY.md blob 4977de3ac6cc8fbfd59bb0f7ebbb1957a9f22d84; checker blob f557f7ff32687dd8e169dea032a6e11c64804c68; prior A2 blob b0b07106cbb64024d4f3809ad241b5a57601383d.
- https://github.com/google/adk-python/pull/8336 rechecked OPEN / UNMERGED, unchanged head 50f2a31309b52a11f2ed140b57c3d07d7863565c. Exact lite_llm.py blob ccf4763ce343ec151bb56e3962cdf9f470d9377a, selected lines 4930–5010 and authored tests rechecked. W47 retained; W48 and November close NOT_DUE.

## RISK_CLASSIFICATION
- External Risk: conditional off-by-one conversion between total attempt budget and retry-only parameter. Local Evidence: no Zero runtime receipt. Local Applicability: installed ADK, LiteLLM and provider retry configuration not established.
- Additional first-party interface documentation inspected 2026-11-25: https://googleapis.github.io/dotnet-genai/api/Google.GenAI.Types.HttpRetryOptions.html describes maximum attempts including original request (different language SDK, not proof of exact Python version). https://docs.litellm.ai/docs/routing distinguishes LiteLLM num_retries and provider SDK max_retries; router docs are not exact acompletion path verification. These sources support semantic distinction and layered-risk hypothesis, not independent incident reproduction.
- Exact ADK source sets num_retries only when http_options, retry_options and attempts are present. Tests assert mocked acompletion argument and one adapter invocation; no transport attempt or effect receipt in this fixture.

## ORIENTATION_NOTES
Standalone model A2-20261125-RETRY-COUNT-01, Python 3.13.5; command python /tmp/a2_20261125.py; exit 0, stderr empty; SHA256 140fad8aef34266788674cbd35299987ad61fe70848727974b5216238f76c798. Exact script:
```python
def attempts(retries,success_at=None):
    for i in range(1,2+retries):
        if i==success_at: return i
    return i
for n in [1,3]:
    old=n; new=max(0,n-1)
    assert attempts(new)==n
    print('budget',n,'always_fail',attempts(old),attempts(new),'first_success',attempts(old,1),attempts(new,1))
print('nested_upper_bound',3*(1+2))
```
Actual stdout:
```text
budget 1 always_fail 2 1 first_success 1 1
budget 3 always_fail 4 3 first_success 1 1
nested_upper_bound 9
```
- First-success control cannot discriminate old/new; all-fail synthetic loop does. The 9 count is an arithmetic upper bound for three outer attempts each allowing two additional inner retries, not measured provider behavior. This model imports no SDK, invokes no network or sink and is not a local failure rate or measured defense.
- A budget of zero after clamping still permits the initial invocation. Fallback and provider-internal retry loops require their own bounds; response loss after an effect requires a separate authoritative readback. No inference of effect multiplicity from request counts.
- Remaining Uncertainty: exact deployed Python SDK and callee implementation, failure eligibility, hidden retry/fallback layers, actual transport and effect count. Retest fixed revisions against controlled failing endpoint with separate adapter/transport/provider/effect counters, first-success and response-loss controls.

## NO_DECISION_SECTION
NO_DECISION / NO_HOST_PROMOTION. No local incident, existing defense or measured effectiveness established; one same-lineage external patch plus interface documentation and one standalone model, zero independent SDK reproductions.

## EVIDENCE_DELTA
- NEW_EVIDENCE: pinned adapter context, first-party interface distinctions and actual bounded counter model.
- CORRECTED_INTERPRETATION: total attempts and retry-only parameters are layer-specific; a correct conversion does not establish an end-to-end cap.
- UNCHANGED_BOUNDARY: EXTERNAL_RISK != LOCAL_INCIDENT != EXISTING_DEFENSE != MEASURED_EFFECTIVENESS.
- NEW_COUNTEREVIDENCE: first-attempt success hides mapping difference; nested layers can multiply attempts.
- UNKNOWN_RETAINED: released revision, real transport/effect receipts, Zero applicability.
- NEXT_RETEST_CONDITION: pinned dependency and controlled endpoint with per-layer receipts and negative controls.

## NEXT_HANDOFF
Retain bounded Daily result for next eligible closed week, no W48 or November final before due.

## BOUNDARY_CHECK
Original A1 merge, fresh main, upstream source and standalone model verified. Full checker, SDK runtime, provider requests and host runtime NOT_EXECUTED. Only new canonical A2; no history, host kernel or Independent A1/A2 change. Human-authorized merge separate from independent review.
