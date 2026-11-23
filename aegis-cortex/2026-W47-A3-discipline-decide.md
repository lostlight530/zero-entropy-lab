# A3 Weekly Discipline Decide — 2026-W47

## CORTEX_RUN_HEADER
Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A3
Canonical Identity: zero/aegis/A3
Cadence: Weekly
Loop Stage: Decide
Target Week: 2026-W47
Coverage Window: 2026-11-16 to 2026-11-22
Logical Week Basis: Asia/Shanghai
Execution Date: 2026-11-23
Agent: GPT-6 / GPT_NATIVE / HUMAN_REQUESTED / NOT_JULES_REPLAY
Record Provenance: HUMAN_AUTHORIZED_SUBSTITUTE
Base Main SHA: 0a128fcf5ab1c97d439956d687b4edb285d4842f
Run Identity: zero-entropy-lab/aegis/A3/2026-W47/GPT_NATIVE/0a128fcf5ab1c97d439956d687b4edb285d4842f/w47-failure-lineage-decision-01
Task Status: BOUNDED_DOCUMENTARY_FAILURE_MODEL_AUDIT_COMPLETED / NO_DECISION
Daily Coverage Matrix: A1_7_OF_7; A2_7_OF_7; ALL_NAMED_INPUT_BLOBS_READ
Inherited Evidence: 14_DAILY_ARTIFACTS / ZERO_INDEPENDENT_REPLICATION_CREDIT
Independent Evidence Added: EXACT_CURRENT_MAIN_CUSTODY_ONLY / NO_NEW_RUNTIME_TEST
Missing Inputs Preserved: ZERO_LOCAL_INCIDENT_AND_MEASURED_DEFENSE_RECEIPTS_UNKNOWN
External Risk State: SEVEN_BOUNDED_UPSTREAM_CONDITIONAL_MECHANISMS / NO_LOCAL_INFERENCE
Local Incident State: UNKNOWN / ZERO_LOCAL_INCIDENT_RECEIPT_NOT_OBSERVED_IN_THIS_AUDIT
Decision Evidence Basis: EXACT_MAIN_DAILY_BLOBS / SOURCE_CONDITIONS_AND_NEGATIVE_CONTROLS
Historical Execution State: W47_NATIVE_RUN_IDENTITIES_AND_NONEXECUTION_BOUNDARIES_RETAINED
Current Delivery State: PROPOSED_DRAFT_PR / NOT_MERGED
Host Repository Change: NO
Boundary Violation: NO
Write Scope: aegis-cortex/2026-W47-A3-discipline-decide.md

## INPUT_RECORD
- Closed ISO W47: 2026-11-16 through 2026-11-22, Asia/Shanghai. W48 Monday 2026-11-23 is outside this weekly cohort.
- Fresh main `0a128fcf5ab1c97d439956d687b4edb285d4842f`; current owning `aegis-cortex/EVIDENCE_POLICY.md` and W46 A3/A4 were considered. Fourteen exact current-main daily source files were read, seven A1 external risk observations and seven A2 orientations.
- Same-date A2 inherits A1 evidence; citations shared through two artifacts are not independent external experiments. Original day-level test/nonexecution qualifications remain in force.
- Reading GitHub files does not reproduce their upstream source tests, prove a particular released SDK binary, or detect an installed Zero host incident.

| Logical day | Exact A1 current-main path / blob SHA | Exact A2 current-main path / blob SHA | Conditional failure mechanism | Source repository |
|---|---|---|---|---|
| 2026-11-16 | `aegis-cortex/2026-11-16-A1-reliability-observe.md` @ `295a9172e758fc83d0c3a039c71da16a1fa15b25` | `aegis-cortex/2026-11-16-A2-doctrine-orient.md` @ `e528202301297a7de0de5f8c64219da567bfd948` | sampled-out telemetry duration attribution | google/adk-python |
| 2026-11-17 | `aegis-cortex/2026-11-17-A1-reliability-observe.md` @ `709099385dba9d98841c59c93022150d10fdf6b3` | `aegis-cortex/2026-11-17-A2-doctrine-orient.md` @ `19b56bc657df08d60f0d3e74692c40cf3794c5ad` | incomplete/failed response retry usage accounting | openai/openai-agents-python |
| 2026-11-18 | `aegis-cortex/2026-11-18-A1-reliability-observe.md` @ `ab7809287aada5ba35f08f25e5a3c4bb56ac71b2` | `aegis-cortex/2026-11-18-A2-doctrine-orient.md` @ `1589281af888a426ad869b9d4be892568614814a` | mixed UTC-offset sandbox memory selection | openai/openai-agents-python |
| 2026-11-19 | `aegis-cortex/2026-11-19-A1-reliability-observe.md` @ `9ee86074ca6692b85424e811331aa5e4be0d89ce` | `aegis-cortex/2026-11-19-A2-doctrine-orient.md` @ `6e6f564d195280aa9eaa99c93a5f7d8f2cda2470` | MCP time-tool error path disclosure | modelcontextprotocol/servers |
| 2026-11-20 | `aegis-cortex/2026-11-20-A1-reliability-observe.md` @ `4d8cb67814224ff7f48d82c962163e42b7778bf2` | `aegis-cortex/2026-11-20-A2-doctrine-orient.md` @ `a42da923cb769ff1fcb8965d2f66ab87711c7e28` | Live reconnect duplicate-session retry predicate | google/adk-python |
| 2026-11-21 | `aegis-cortex/2026-11-21-A1-reliability-observe.md` @ `fd7326d1dda0805fea75820cb1a24b5ba8016118` | `aegis-cortex/2026-11-21-A2-doctrine-orient.md` @ `b3a12ac384afdaf450c60dd4417e191354a5fa12` | unscored evaluator run counted as metric pass | google/adk-python |
| 2026-11-22 | `aegis-cortex/2026-11-22-A1-reliability-observe.md` @ `fa3cc65b578168be01b45dc653f6ade8ada212ef` | `aegis-cortex/2026-11-22-A2-doctrine-orient.md` @ `803163c815c9015a18b145021c5c2d06650567f9` | Live invocation-local tool mutation leaks to shared child | google/adk-python |

## WEEKLY_RISK_SYNTHESIS
- Source genealogy: four dated topics from `google/adk-python` (Nov16, 20, 21, 22), two from `openai/openai-agents-python` (Nov17–18), one from `modelcontextprotocol/servers` (Nov19). These are three upstream repository lineages and seven mechanism candidates, not seven Zero incidents or seven independent measurements of one failure class.
- **Metric and observation eligibility** (Nov16, 17, 21): sampled-out span duration, failed-response usage loss and unscored evaluation false-pass share an evidence-accounting theme, but their object/denominator predicates differ. A run without eligible observations cannot be treated as successful simply because an aggregator emits a default value.
- **Memory/time identity** (Nov18): UTC-offset normalization addresses timestamp ordering under specific formats; canonical UTC source records and equal instants are negative cases. A model patch alone cannot prove Zero selects the wrong persisted memory or quantify user-facing harm.
- **Sanitization boundary** (Nov19): controlling an MCP time tool's error string does not necessarily remove host paths from internal logs, telemetry, or other sinks. Conversely the presence of external patch notes is not proof that Zero exposes the tool.
- **Retry and cross-run ownership** (Nov20, Nov22): a guarded Live reconnection retry and invocation-local agent copy address different failure planes. Blind retry can duplicate external effects; shallow cloning can leave shared nested aliasing. Neither establishes authorized exactly-once completion.
- **Failure-model calibration:** seven conditionally source-supported mechanisms may motivate bounded testing. Each original artifact preserves missing local dependency proof, no reliable local incident count, and no measured defense-effectiveness denominator. A3 does not infer absence of local incidents either.
- **Publisher/verification scope:** upstream author's test descriptions are not this weekly review's runtime outcomes. No fresh upstream test execution or Zero kernel effect receipt was produced here.

## COUNTEREVIDENCE_GATE
- **2026-11-16 / sampled-out telemetry duration attribution:** correctly recorded spans or absent later work are negative controls. A source patch or authored fixture does not by itself prove an installed Zero failure or fix.
- **2026-11-17 / incomplete/failed response retry usage accounting:** provider errors may have no usage or an unrelated error envelope. A source patch or authored fixture does not by itself prove an installed Zero failure or fix.
- **2026-11-18 / mixed UTC-offset sandbox memory selection:** canonical timestamps or equal real instants may not misorder. A source patch or authored fixture does not by itself prove an installed Zero failure or fix.
- **2026-11-19 / MCP time-tool error path disclosure:** sanitized tool output does not certify application logs or exporters. A source patch or authored fixture does not by itself prove an installed Zero failure or fix.
- **2026-11-20 / Live reconnect duplicate-session retry predicate:** unrelated 1008 and absent resumable handle must not retry. A source patch or authored fixture does not by itself prove an installed Zero failure or fix.
- **2026-11-21 / unscored evaluator run counted as metric pass:** legitimately scored subset versus wholly unscored run requires explicit denominators. A source patch or authored fixture does not by itself prove an installed Zero failure or fix.
- **2026-11-22 / Live invocation-local tool mutation leaks to shared child:** per-invocation isolation may avoid leakage while shallow copy can still alias. A source patch or authored fixture does not by itself prove an installed Zero failure or fix.
- A metric derived only from successful attempts may be valid *for that defined successful-attempt population* while invalid as a claim over all attempted requests. Preserve denominator and missingness separately.
- A retry that reconnects transport does not attest external action completion; effect ID, request identity and provider acknowledgment may diverge.
- Same object on two invocations can be intentionally shared or accidentally aliased; an actual concurrent reproduction and ownership contract are needed to classify an incident.

## FOUR_SEPARATE_EVIDENCE_CLASSES
- External Risk: BOUNDED_SOURCE_SUPPORTED_CONDITIONAL_MECHANISMS; multiple unrelated paths must retain separate triggering predicates.
- Local Incident: UNKNOWN / NO_ZERO_INCIDENT_RECEIPT_OBSERVED_IN_THIS_REVIEW.
- Existing Defense: UNKNOWN / LOCAL_DEPENDENCY_AND_CONTROL_MAPPING_NOT_VERIFIED.
- Measured Effectiveness: NOT_COMPUTED / NO_EXPERIMENTAL_DENOMINATOR_OR_RECEIPT.

## DECISION_SET
Decision ID: DEC-2026W47-A3-01
Decision: NO_DECISION
Decision Scope: Aegis-internal reliability research and controlled retest prioritization, not Host Kernel or Ballast
Evidence Basis: seven A1 plus seven A2 exact main-visible inputs, preserved original upstream claim conditions and counterexamples.
Counterevidence Basis: overlapping issuer lineages, mock/test descriptions without independent execution, missing installed dependency path and effect receipts, heterogeneous failure denominators.
State: HOLD_DOCTRINE_PROMOTION / RETAIN_BOUNDED_FAILURE_MODELS
Next Decision Trigger: capture pinned upstream and Zero installed revisions, execute paired positive/negative controlled cases with run/session/attempt/effect IDs, stderr/stdout/exit and provider sink verification.

## DO_NOT_CHANGE
- No Zero `src/kernel/**`, SQLite/JSONL, scheduler, workflows, Ballast, Aegis static doctrine, independent A1/A2 maintenance, periodic audit or historical Jules modifications.
- No EXTERNAL_RISK to LOCAL_INCIDENT uplift; no claim that a patch is in an installed Zero dependency.
- No zero-incident attestation from absent local observations, nor positive defense effectiveness from an upstream source-only fix.
- Do not count A1 + A2 citation inheritance as two source lineages. Do not treat a metric pass as effect occurrence.
- November A5/A6 not due on 2026-11-23: natural calendar month remains open.

## EVIDENCE_DELTA
- NEW_EVIDENCE: W47 full exact A1/A2 main blob custody and cross-case denominator/issuer classification.
- CORRECTED_INTERPRETATION: telemetry omission, unscored metrics, retry status, and tool configuration persistence are distinct failure predicates; a uniform reliability score would discard important triggers.
- UNCHANGED_BOUNDARY: EXTERNAL_RISK != LOCAL_INCIDENT != EXISTING_DEFENSE != MEASURED_EFFECTIVENESS; SOURCE_PATCH != EXECUTED_DEFENSE.
- NEW_COUNTEREVIDENCE: absent usage, no valid metric observation, unrelated close code, canonical timestamps and invocation-isolated copies limit generalized harm assertions.
- UNKNOWN_RETAINED: Zero deployed versions, local incidents, source patch release adoption, independent regression results and measured mitigation effects.
- NEXT_RETEST_CONDITION: test exact source revisions, negative controls and local installed paths; attribute any authorization and actual effect to the same immutable attempt identity.

## HANDOFF_TO_A4
- Dependency: A4 remains BLOCKED_DEPENDENCY_PENDING_MAIN_VISIBLE_A3.
- Only after this original A3 Draft is reviewed and merged and its blob re-read on fresh main may A4 cite `DEC-2026W47-A3-01` for an Aegis-internal retest/watchlist handoff.
- Under NO_DECISION, downstream A4 cannot invent a new host protocol, local mitigation effectiveness, or an unapproved kernel edit.

## BOUNDARY_CHECK
- This original W47 Native A3 document is the only new owned file. W47 A4 not produced or credited.
- Actual checks: remote GitHub current-main lookup, open-PR review and 14 exact current-main A1/A2 reads. The full `aegis-cortex/check.py`, upstream SDK suite and Zero host runtime were NOT_EXECUTED; structural documentary review is not checker PASS.
- Human Maintainer review and merge: PENDING. Fresh-main readback after merger: NOT_YET_APPLICABLE.
