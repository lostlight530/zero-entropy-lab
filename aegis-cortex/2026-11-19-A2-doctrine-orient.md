# A2 Daily Doctrine Orient — 2026-11-19 / tool error output sanitization and local non-promotion

## CORTEX_RUN_HEADER
Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A2
Canonical Identity: zero/aegis/A2
Cadence: Daily
Loop Stage: Orient
Logical Date: 2026-11-19
Logical Timezone: Asia/Shanghai
Agent: GPT-6 / GPT_NATIVE / HUMAN_REQUESTED / NOT_JULES_REPLAY
Record Provenance: HUMAN_AUTHORIZED_SUBSTITUTE
Base Main SHA: d90b023a27d2e974ab027b8de9f40a2512752b82
Run Identity: zero-entropy-lab/aegis/A2/2026-11-19/GPT_NATIVE/d90b023/error-boundary-counterchecks-01
Evidence Class: EXTERNAL_RISK_CLASS / TOOL_EXCEPTION_SERIALIZATION
Source Identity: modelcontextprotocol/servers PR #5615 head 55b6e7b040d60cd858ccd291b1e6067209c02ecc
Source Authority For Claim: FIRST_PARTY_PINNED_SOURCE_CHANGE_AND_AUTHOR_TESTS / SAME_ISSUER_AS_A1
Independent Verification: MERGED_A1_PR_897_MAIN_BLOB_READBACK / CODE_BRANCH_AND_NEGATIVE_CONTROL_REVIEW / NO_LOCAL_TEST
Local Incident Evidence: NOT_ESTABLISHED / NO_ZERO_TOOL_OUTPUT_RECEIPT
Local Evidence: UNKNOWN / NO_ZERO_INSTALLED_TIME_SERVER_OR_LOG_SINK_REPRODUCTION
Existing Defense: UNKNOWN_FOR_ZERO
Measured Effectiveness: NOT_COMPUTED
Host Applicability: UNKNOWN / ZERO_KERNEL_DEPENDENCY_NOT_VERIFIED
Original Execution Status: SOURCE_ORIENTATION_PERFORMED / UPSTREAM_PYTEST_AND_ZERO_RUNTIME_NOT_EXECUTED
Current Path Status: DRAFT_PROPOSED_AT_AUTHORING / NOT_MERGED_YET
Task Status: BOUNDED_RISK_ORIENTATION / NO_LOCAL_DOCTRINE_PROMOTION
Write Scope: aegis-cortex/2026-11-19-A2-doctrine-orient.md
Host Kernel Modification: NO
Boundary Violation: NO

## INPUT_RECORD
- Exact same-date Native A1 is merged through [Zero PR #897](https://github.com/lostlight530/zero-entropy-lab/pull/897), main merge SHA `d90b023a27d2e974ab027b8de9f40a2512752b82`; retained native A1 blob `9ee86074ca6692b85424e811331aa5e4be0d89ce`. Exact main and A1 file re-opened post-merge.
- Current Aegis evidence policy distinguishes `EXTERNAL_RISK`, `LOCAL_INCIDENT`, `EXISTING_DEFENSE`, `MEASURED_EFFECTIVENESS`; source classification remains external.
- [Upstream issue #5559](https://github.com/modelcontextprotocol/servers/issues/5559) and [PR #5615](https://github.com/modelcontextprotocol/servers/pull/5615) document a controlled error-text change; authored tests remain source text, not run by Zero.
- This source belongs to the same first-party publisher/patch lineage as A1. H2 terminology is not used here; this is Native Aegis A2, not Independent month A2.

## RISK_CLASSIFICATION
External Risk: CONDITIONAL_HOST_PATH_METADATA_DISCLOSURE_IN_MCP_TIME_TOOL_ERROR
Before patch: Python `ZoneInfo` can throw an `OSError` containing a machine-specific tzdata path when a directory-valued input such as `America` is passed; previous ToolError included `str(e)`.
After patch: error is the standard message constructed from the user-supplied invalid name; raw `str(e)` is no longer embedded in this selected ToolError response.
Bounded claim: one named branch has been changed in upstream source, not every exception path, every logger, every model consumer or every OS distribution.
Preconditions: affected build, accessible tool call, relevant installed timezone database and client-propagated result. No Zero runtime invocation or leaked host path observed.
Local Incident: NOT_ESTABLISHED
Existing Defense: UNKNOWN_FOR_ZERO
Measured Effectiveness: NOT_COMPUTED
Counterevidence Gate: PASS_FOR_SOURCE_BRANCH / NOT_MET_FOR_ZERO_LOCAL_PROMOTION.

## ORIENTATION_NOTES
- Positive P1 (NOT_EXECUTED): on pinned parent/head, call `get_current_time(timezone='America')`, capture exact serialized `ToolError` payload and host path oracle; compare before/after.
- Positive P2 (NOT_EXECUTED): exercise both source and destination `convert_time` timezone parameters; compare error paths and original inputs without granting automatic write permission.
- Negative N1 (NOT_EXECUTED): a valid `UTC` timezone must succeed. A tool which rejects all inputs is not a quality-preserving mitigation.
- Negative N2 (NOT_EXECUTED): strings that look like paths, missing zone, invalid case or directory can all return controlled errors; still check whether response echoes untrusted input and whether output encoding introduces misleading boundary text.
- Negative N3 (NOT_EXECUTED): `ToolError` might suppress the exception body while server stdout/stderr, traceback, structured telemetry or connector-side error `cause` still contains the original path. Do not infer full logging hygiene from one user-visible string.
- Negative N4 (NOT_EXECUTED): if Zero does not deploy affected MCP Time package or has an independent sanitizer, then this external risk has no demonstrated local incident; lack of records does not prove immunity either.
- Negative N5 (NOT_EXECUTED): a path disclosure must not be relabeled as a verified shell command execution, secret read, access-control bypass or actual exfiltration without independent effect evidence.
- Negative N6 (NOT_EXECUTED): changed error text can break clients matching old exact messages; compatibility should be checked separately from confidentiality.
- Proposed run receipt: `(source_commit, installed_version, OS/tzdata_version, invocation_id, input_digest, exception_type, transmitted_tool_result, server_stdout_stderr, log_sink_id, exit, independent_path_redaction_oracle)`.
- Trust/control interpretation: untrusted error content is a lower-trust observation; an LLM or durable memory must not elevate it into authenticated system identity/authorization.
- This orientation does not claim to retest any OpenAI/Google SDK, Ballast effect sink, Zero kernel defense or local vulnerability.

## NO_DECISION_SECTION
Decision: NO_DECISION
Doctrine Promotion: NO
Local Incident Verdict: NOT_ESTABLISHED
Existing Defense Verdict: UNKNOWN_FOR_ZERO
Measured Safety Improvement: NOT_COMPUTED
Host Kernel Action: NONE
Decision Basis: author-reported pre/post and code branch support the external mechanism; local installed instance and effect path unknown, and alternate logs may remain unredacted.
Next necessary step: fixed before/after MCP Time binary, test OS/tzdata and direct tool/log trace with negative/valid controls.

## EVIDENCE_DELTA
- NEW_EVIDENCE: merged A1 canonical blob custody and independent examination of alternate output channels/compatibility.
- CORRECTED_INTERPRETATION: sanitizing `ToolError` response is not equivalent to removing sensitive data from every producer/logging channel.
- UNCHANGED_BOUNDARY: EXTERNAL_RISK != LOCAL_INCIDENT != EXISTING_DEFENSE != MEASURED_EFFECTIVENESS.
- NEW_COUNTEREVIDENCE: possible exception trace in logs, dependency mismatch and valid-input regression trade-off.
- UNKNOWN_RETAINED: package/version deployed by Zero, actual local error text, sensitive downstream storage, test execution and effective defense.
- NEXT_RETEST_CONDITION: pinned package and trace capture on local test client for invalid/valid inputs, stdout/stderr/error payload and independent leak oracle.

## NEXT_HANDOFF
- Independent A1/A2 original maintenance starts from its own separate main/date and includes this Native A1/A2 only if its window applies; current Native A2 is not maintenance A2.
- W47 A3/A4 NOT_DUE; November A5/A6 NOT_DUE until natural-month closure.
- No Ballast, Kernel, Jules, independent periodic audit or long-lived Aegis Memory updated.

## BOUNDARY_CHECK
- Inspected merged same-day A1/main and external implementation/tests already cited by source. Current Aegis task/required-section checker contract reviewed.
- NOT_EXECUTED full aegis-cortex/check.py, SDK pytest, local time server, host dependency scan, user effect sink or CI rerun.
- No unrelated original, governance, kernel or private scheduler files touched.
- One prospective native A2 file only; user-authorized merge may occur only after PR identity and final diff check.
