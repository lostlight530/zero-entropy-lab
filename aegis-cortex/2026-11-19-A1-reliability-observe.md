# A1 Daily Reliability Observe — 2026-11-19 / MCP tool error path disclosure boundary

## CORTEX_RUN_HEADER
Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A1
Canonical Identity: zero/aegis/A1
Cadence: Daily
Loop Stage: Observe
Logical Date: 2026-11-19
Logical Timezone: Asia/Shanghai
Agent: GPT-6 / GPT_NATIVE / HUMAN_REQUESTED / NOT_JULES_REPLAY
Record Provenance: HUMAN_AUTHORIZED_SUBSTITUTE
Base Main SHA: e331ea26370665c8937ae8eb2c4cef6403d35d38
Run Identity: zero-entropy-lab/aegis/A1/2026-11-19/GPT_NATIVE/e331ea2/time-tool-error-privacy-01
Evidence Class: EXTERNAL_RISK_CLASS / HOST_PATH_DISCLOSURE_THROUGH_UNSANITIZED_TOOL_ERRORS
Source Identity: modelcontextprotocol/servers PR #5615 head 55b6e7b040d60cd858ccd291b1e6067209c02ecc
Source Authority For Claim: FIRST_PARTY_PINNED_SOURCE_DIFF_AND_TEST_FIXTURE
Independent Verification: PUBLIC_ISSUE_AND_EXACT_IMPLEMENTATION_TEST_PATCH_READ / UPSTREAM_TESTS_NOT_EXECUTED_HERE
Local Incident Evidence: NOT_ESTABLISHED / NO_ZERO_TIME_SERVER_DEPLOYMENT_OR_ERROR_RECEIPT
Local Evidence: UNKNOWN / ZERO_MCP_TIME_SERVER_DEPENDENCY_NOT_VERIFIED
Existing Defense: UNKNOWN_FOR_ZERO
Measured Effectiveness: NOT_COMPUTED
Host Applicability: UNKNOWN / NO_ZERO_DEPLOYED_TOOL_TO_EFFECT_PATH
Original Execution Status: BOUNDED_REMOTE_FIRST_PARTY_SOURCE_REVIEW / LOCAL_RUNTIME_NOT_EXECUTED
Current Path Status: PROPOSED_DRAFT_PR / NOT_MERGED_AT_AUTHORING
Task Status: EXTERNAL_RISK_SUPPORTED_AS_SOURCE_MECHANISM / NO_LOCAL_INCIDENT
Write Scope: aegis-cortex/2026-11-19-A1-reliability-observe.md
Host Kernel Modification: NO
Boundary Violation: NO

## INPUT_RECORD
- Fresh `zero-entropy-lab` main `e331ea26370665c8937ae8eb2c4cef6403d35d38`, non-truncated Git tree and zero Open PR observed. Latest Aegis A1/A2 on main for 2026-11-18 concern mixed-UTC-offset memory ordering, not error serialization.
- Current Aegis `EVIDENCE_POLICY.md` and `check.py` inspected. Aegis failure-model research remains separate from `src/kernel` and Ballast Action Integrity.
- Upstream issue #5559 and merged PR #5615 identify invalid `America` timezone, which is a tzdata directory rather than a valid timezone leaf.
- Pinned upstream diff changes `src/time/src/mcp_server_time/server.py` and tests. First-party reports PR opened 2026-11-18T18:17:18Z, local 2026-11-19; GitHub shows merged. A code diff is stronger evidence for changed branch than issue prose, but still not our own execution.
- Independent local Git diagnostic: `git ls-remote https://github.com/lostlight530/zero-entropy-lab.git refs/heads/main`, 2026-11-19T05:35:52.664045502Z–05:35:57.701599118Z, git 2.47.3, exit 128, stdout empty, stderr `Could not resolve host: github.com`. Not an Aegis host runtime test.

## EXTERNAL_SOURCE_RECORDS
Source ID: SRC-20261119-AE01
Title: fix(time): keep the host's tzdata path out of invalid-timezone errors
Publisher: modelcontextprotocol/servers maintainers and PR author
Canonical Source Identity: modelcontextprotocol/servers PR #5615 head 55b6e7b040d60cd858ccd291b1e6067209c02ecc
URL: https://github.com/modelcontextprotocol/servers/pull/5615
Underlying bug: https://github.com/modelcontextprotocol/servers/issues/5559
Implementation: https://github.com/modelcontextprotocol/servers/blob/55b6e7b040d60cd858ccd291b1e6067209c02ecc/src/time/src/mcp_server_time/server.py
Protocol tests: https://github.com/modelcontextprotocol/servers/blob/55b6e7b040d60cd858ccd291b1e6067209c02ecc/src/time/tests/test_protocol.py
Source Version: MERGED_UPSTREAM_PR_HEAD / RELEASE_AND_INSTALLED_VERSION_UNVERIFIED
Source Date: 2026-11-18T18:17:18Z upstream PR creation / 2026-11-19 Asia/Shanghai
Source Status: FIRST_PARTY_PATCH_INSPECTED / AUTHOR_TEST_REPORT_ONLY

## RAW_RELIABILITY_SIGNAL_LOG
Risk ID: RISK-20261119-A01
External Risk: BOUNDED_ERROR_MESSAGE_LEAK_OF_HOST_TZDATA_PATH
- Previous `get_zoneinfo(timezone_name)` caught an arbitrary exception and forwarded `str(e)` in a `ToolError`. When the name refers to a tzdata directory, the underlying `OSError` may include an absolute installed path, potentially a user-home segment.
- New implementation catches the same failure but emits a fixed `Invalid timezone: <name> is not a known IANA timezone name` message, without carrying exception text. The source change controls one error-output path, not all tool errors.
- The authored protocol tests add the directory-valued `America` invalid input for `get_current_time`, `convert_time` and `get_time_ago`; other malformed and traversal-like strings are tested only as invalid names, not proof of general filesystem exploitation.
- The PR author reports `uv run pytest` 198 passed and Inspector before/after tests, plus an LLM-client probe. These are **author statements**, not a locally reproduced 198-test outcome or a Zero runtime receipt.
- Precondition: exposed affected MCP time server, error surfaced to a downstream client, and a platform whose zoneinfo exception includes sensitive filesystem detail.
- Consequence bound: disclosure of host path metadata in error text is plausible and source-demonstrated in authored examples; no arbitrary code execution, secret extraction, Zero local leakage, or actual user harm follows from the patch alone.
- Positive control: start pinned pre/post versions with a fixed test timezone database, send invalid directory name and inspect exact MCP tool result body for absolute-path fragments and user-home components.
- Negative control A: valid `UTC` input should remain successful and not be distorted by error sanitization.
- Negative control B: arbitrary unknown timezone and path-like invalid strings should produce a controlled message; reject malicious output before any LLM consumer sees it.
- Negative control C: a tool or log path that serializes `__cause__`/server traceback separately could still disclose details; fixed ToolError text does not prove total telemetry hygiene.
- Negative control D: even if path metadata is visible, it is not proof of credential theft or permission bypass; the risk class must not be relabeled as a Zero incident.
- Source dedupe: issue, PR, test and author-provided Inspector trace are one first-party lineage; no independent verifier counted.
External Risk State: SOURCE_SUPPORTED_BOUNDED
Local Incident State: NOT_ESTABLISHED
Existing Defense State: UNKNOWN_FOR_ZERO
Measured Effectiveness State: NOT_COMPUTED
Disposition: WATCH / LOCAL_COUNTEREXAMPLE_REQUIRED / NO_KERNEL_CHANGE.

## EVIDENCE_DELTA
- NEW_EVIDENCE: pinned implementation replacement of uncontrolled error text and authored tests for the directory-valued zone key.
- CORRECTED_INTERPRETATION: error content crosses the tool-result trust boundary; broad exception-catching does not sanitize the string that is transmitted.
- UNCHANGED_BOUNDARY: EXTERNAL_RISK != LOCAL_INCIDENT != EXISTING_DEFENSE != MEASURED_EFFECTIVENESS.
- NEW_COUNTEREVIDENCE: alternate traceback/log serialization, deployment-version mismatch, and benign input controls limit claims of universal mitigation.
- UNKNOWN_RETAINED: Zero installed MCP time server, platform-specific paths, observed error logs, package release, downstream transmission and exploitability.
- NEXT_RETEST_CONDITION: pin before/after upstream builds and a named local test instance; capture MCP request, response, tool stdout/stderr, exit, package identity and rejected/valid input controls.

## NEXT_HANDOFF
- Same-date `zero/aegis/A2` BLOCKED_DEPENDENCY until original A1 Draft merges to main with exact blob/SHA re-read and independent source-oriented countercheck.
- 2026-W47 native A3/A4 NOT_DUE; November A5/A6 NOT_DUE until natural month closure.
- No host Kernel, Ballast, independent maintenance, periodic audit or original Jules producer evidence upgraded or rewritten.

## BOUNDARY_CHECK
- First-party bug issue, merged source patch, authored tests: INSPECTED.
- Upstream and local runtime tests: NOT_EXECUTED; measured effect: NOT_COMPUTED.
- Aegis structural `check.py`: NOT_EXECUTED (full repository worktree unavailable due DNS).
- Public diff contains no secrets, private scheduler prompt, personal memory, exploit instructions, historic Jules mutation or host kernel edits.
- Delivery: DRAFT_PROPOSED / REVIEW_PENDING / MERGE_NOT_AUTHORIZED.
