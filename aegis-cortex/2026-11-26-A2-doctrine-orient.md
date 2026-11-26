# A2 Daily Doctrine Orient — 2026-11-26 / default provenance

## CORTEX_RUN_HEADER
Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A2
Canonical Identity: zero/aegis/A2
Cadence: Daily
Loop Stage: Orient
Logical Date: 2026-11-26
Logical Timezone: Asia/Shanghai
Agent: GPT-6.2 / GPT_NATIVE / HUMAN_REQUESTED / NOT_JULES_REPLAY
Record Provenance: HUMAN_AUTHORIZED_SUBSTITUTE
Base Main SHA: 3288072051f0a62143ac7ad2abf8b0fdd614bd78
Run Identity: zero-entropy-lab/aegis/A2/2026-11-26/GPT_NATIVE/3288072051f0/default-provenance-01
Evidence Class: EXTERNAL_RISK_CLASS / RESUME_DEFAULT_AND_FIELD_PROVENANCE
Source Identity: google/adk-python PR #8370 / head d14c1f1d7a2a5fc5d4c3820d2a2fcc3957076de6
Source Authority For Claim: FIRST_PARTY_OPEN_PROPOSAL_AND_AUTHOR_FIXTURES
Independent Verification: MERGED_A1_READBACK / EXACT_SOURCE_RECHECK / STANDALONE_PYDANTIC_CONTROL / SDK_NOT_EXECUTED
Local Incident Evidence: NOT_ESTABLISHED
Local Repository Evidence: NO_LOCAL_RECEIPT_ESTABLISHED
Existing Defense: UNKNOWN
Measured Effectiveness: NOT_COMPUTED
Host Applicability: UNKNOWN / INSTALLED_DEPENDENCY_AND_CONFIG_UNVERIFIED
Evidence Upgrade Basis: ADDITIONAL_SOURCE_INSPECTION_AND_BOUNDED_LOCAL_CONTROL
Original Execution Status: SOURCE_REVIEW_AND_STANDALONE_CONTROL_EXECUTED / FULL_CHECKER_AND_SDK_NOT_EXECUTED
Current Path Status: PROPOSED_DRAFT_PR / NOT_MERGED_AT_AUTHORING
Task Status: BOUNDED_SOURCE_ORIENTATION / NO_HOST_DECISION
Write Scope: aegis-cortex/2026-11-26-A2-doctrine-orient.md
Host Kernel Modification: NO
Boundary Violation: NO

## INPUT_RECORD
- Original same-day aegis-cortex/2026-11-26-A1-reliability-observe.md merged via #945; merge 3288072051f0a62143ac7ad2abf8b0fdd614bd78; exact A1 blob 88db5e24c95953fe47449b5a09a59950077c8288 reread from main.
- Policy blob 4977de3ac6cc8fbfd59bb0f7ebbb1957a9f22d84; checker blob f557f7ff32687dd8e169dea032a6e11c64804c68; prior A2 blob 7eaed5748e8cd4558459d1d48652eaa347bf1b69.
- https://github.com/google/adk-python/pull/8370 rechecked OPEN / UNMERGED, unchanged head. Exact _rehydration_utils.py blob 83d646f70bed789728859de7324344abb7a48946, lines 240–325. W47 retained; W48 and November close NOT_DUE.

## RISK_CLASSIFICATION
- External Risk: nonrequired property defaults lost in dynamic schema reconstruction; proposed repair preserves declared defaults. No local incident, defense or measured efficacy.
- Exact implementation handles required properties separately, maps nonrequired fields to optional types, validates using TypeAdapter and returns model_dump(). No field-presence metadata returned by this branch. This is a scoped source observation, not proof that the whole workflow loses provenance.
- Complex schemas without mapped types fall back to original response. Default factories and nested schema semantics outside this bounded control.

## ORIENTATION_NOTES
- Standalone A2-20261126-PYDANTIC-DEFAULT-PROVENANCE-01; Python 3.13.5 / Pydantic 2.13.5; actual 2026-11-26T07:03:25Z approximate completion; command python /tmp/aegis_a2_20261126.py, exit 0, stderr empty; SHA256 f98f2695e6bd22917e5c8ed377ca092df1d8136d684c1775d682cf8c764af1d8.
- Exact script:
```python
from pydantic import create_model, TypeAdapter, ValidationError
old=create_model('Old',approved=(bool,...),priority=(int|None,None))
new=create_model('New',approved=(bool,...),priority=(int|None,3))
for label,payload in [('omitted',{'approved':True}),('null',{'approved':True,'priority':None}),('explicit',{'approved':True,'priority':7}),('missing_required',{'priority':7})]:
    out=[]
    for model in (old,new):
        try:
            obj=TypeAdapter(model).validate_python(payload); out.append((obj.model_dump()['priority'],'priority' in obj.model_fields_set))
        except ValidationError:out.append('REJECT')
    print(label,*out)
    assert out=={'omitted':[(None,False),(3,False)],'null':[(None,True),(None,True)],'explicit':[(7,True),(7,True)],'missing_required':['REJECT','REJECT']}[label]
a=TypeAdapter(new).validate_python({'approved':True}); b=TypeAdapter(new).validate_python({'approved':True,'priority':3})
assert a.model_dump()==b.model_dump() and a.model_fields_set!=b.model_fields_set
print('same_dump',True,'same_fields_set',False)
```
- Actual stdout:
```text
omitted (None, False) (3, False)
null (None, True) (None, True)
explicit (7, True) (7, True)
missing_required REJECT REJECT
same_dump True same_fields_set False
```
- The final case is a counterexample to inferring explicit user choice from materialized output alone. Model metadata distinguishes the two, but plain dump is equal. The two modeled versions differ only on omitted default; no ADK import, network, Zero runtime or effect execution.
- Candidate design obligation: retain original input presence and default provenance where relevant to approval, schema revision and authorization; independently check effect receipts. Do not infer actual ADK vulnerability from this local fixture.

## NO_DECISION_SECTION
NO_DECISION / NO_HOST_PROMOTION. Same source lineage, one new standalone control; local incident NOT_ESTABLISHED, existing defense UNKNOWN, measured effectiveness NOT_COMPUTED.

## EVIDENCE_DELTA
- NEW_EVIDENCE: exact model_dump boundary and actual Pydantic omitted/null/explicit/required control.
- CORRECTED_INTERPRETATION: default preservation solves a value problem, not actor intent or provenance.
- UNCHANGED_BOUNDARY: EXTERNAL_RISK != LOCAL_INCIDENT != EXISTING_DEFENSE != MEASURED_EFFECTIVENESS.
- NEW_COUNTEREVIDENCE: omitted and explicit default equal dumps but unequal field sets; explicit null and required rejection controls.
- UNKNOWN_RETAINED: actual SDK integration, persisted original input, schema version drift, host applicability.
- NEXT_RETEST_CONDITION: accepted SDK revision, actual workflow rehydration and original response/field metadata readback; independent permission and effect oracle.

## NEXT_HANDOFF
Retain Daily source and control for next eligible closed week; no W48 or November final.

## BOUNDARY_CHECK
Original A1 merge and exact main readback, source review and standalone Pydantic control executed. Full checker, SDK, provider and host runtime NOT_EXECUTED. One new canonical Native A2; not Independent A2; no history or kernel modification.
