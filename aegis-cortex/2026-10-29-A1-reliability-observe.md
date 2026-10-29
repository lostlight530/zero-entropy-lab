# A1 Daily Reliability Observe — 2026-10-29

## CORTEX_RUN_HEADER
Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A1
Canonical Identity: zero/aegis/A1
Cadence: Daily
Loop Stage: Observe
Logical Date: 2026-10-29
Logical Timezone: Asia/Shanghai
Execution Date UTC: 2026-10-29
Exact Start Timestamp: NOT_CAPTURED
Agent: GPT-6
Producer Identity: GPT_NATIVE_PROSPECTIVE / NOT_JULES_REPLAY
Record Provenance: HUMAN_AUTHORIZED_NATIVE_PRODUCTION
Base Main SHA: c71d0ebbfbea64441cb6db21c040c1162db0f85b
Run Identity: zero-entropy-lab/aegis/A1/2026-10-29/GPT_NATIVE/c71d0ebbfbea64441cb6db21c040c1162db0f85b/gpt-native-20261029-a1-01
Task Status: SUCCESS_BOUNDED_DOCUMENTARY_OBSERVATION
Network Status: FIRST_PARTY_SECURITY_ADVISORY_OPENED
Evidence Class: EXTERNAL_FAILURE_REPORT
Source Identity: GHSA-4gxg-m5jx-9j57
Source Authority For Claim: UPSTREAM_MAINTAINER_SECURITY_ADVISORY / NOT_ZERO_INCIDENT
Independent Verification: ORIGINAL_ADVISORY_READ / EXPLOIT_NOT_REPLAYED
Local Incident Evidence: NO_LOCAL_EVIDENCE
Host Applicability: UNKNOWN
Existing Defense: UNKNOWN
Measured Effectiveness: NOT_MEASURED
Original Execution Status: NEW_GPT_NATIVE_PROSPECTIVE / NOT_JULES_REPLAY
Current Path Status: PROPOSED_PR_BRANCH / MERGE_NOT_YET_OBSERVED
Write Scope: aegis-cortex/2026-10-29-A1-reliability-observe.md
Boundary Violation: NO

## INPUT_RECORD
- Inspected current main SHA, Aegis EVIDENCE_POLICY.md, and 2026-10-28 A1/A2. Yesterday's GHSA-53mr-w429-c597 examines an ENOENT/TOCTOU fallback; today's distinct advisory GHSA-4gxg-m5jx-9j57 examines case-variant symlink resolution.
- Same publisher and day of advisory publication DO NOT prove independent reproducibility or separate affected deployment in Zero.
- Advisory publication date: 2026-10-25; inspection date 2026-10-29. No local installed version, platform, filesystem sensitivity, permissions or incident was verified.
- Do not confuse Aegis research with Ballast, Host Kernel, linked JSONL or NEXUS state.

## EXTERNAL_SOURCE_RECORDS
### SRC-20261029-A01
Source ID: SRC-20261029-A01
Title: Case-variant path bypasses symlink check and allows creating files outside allowed directories in server-filesystem
Publisher: modelcontextprotocol/servers security advisory
URL: https://github.com/modelcontextprotocol/servers/security/advisories/GHSA-4gxg-m5jx-9j57
Canonical Object: GHSA-4gxg-m5jx-9j57
Published Date: 2026-10-25
Checked Date: 2026-10-29
Source Type: UPSTREAM_MAINTAINER_SECURITY_ADVISORY
Evidence Tier: PRIMARY_FOR_REPORTED_AFFECTED_COMPONENT_FAILURE
Access Status: ADVISORY_BODY_OPENED
Affected Versions: =2026.8.31 and >=1.0.0,<2.0.1 per advisory
Patched Versions: 2.0.1 per advisory
Claim Supported: case-variant request of a symlink name can bypass a component match in resolveUnicodeEquivalentPath on case-insensitive filesystems and cause new files/directories outside allowed roots for certain filesystem tool operations
Claim Not Supported: reads/overwrites of existing outside files, an incident in Zero, all OS deployments exploitable, a measured exploit success rate, or full local patch effectiveness
Author Reported Reproduction: Linux case-folded tmpfs; advisory says macOS and Windows were NOT_RUN by author
Confidence: HIGH_FOR_REPORTED_MECHANISM / UNKNOWN_FOR_LOCAL_REPRODUCTION
Uncertainty: actual Zero package usage/versions, case-folding semantics, authorized roots, platform, symlink capability and installed mitigation not inspected

## RAW_RELIABILITY_SIGNAL_LOG
### SIG-20261029-A01
Signal ID: SIG-20261029-A01
Failure Class: CASE_VARIANT_SYMLINK_COMPONENT_CHECK_USE_MISMATCH
External Evidence: SRC-20261029-A01
Local Repository Evidence: NO_LOCAL_INCIDENT_FOUND_IN_THIS_DOCUMENTARY_READ / NOT_A_FULL_RUNTIME_AUDIT
Local Incident Evidence: NO_LOCAL_EVIDENCE
Root Mechanism: path comparison uses case-sensitive string matching but a case-insensitive filesystem may resolve a differently cased component to a symlink
Affected Operations: create_directory, write_file, move_file destination when creating new files/directories, scoped to advisory
Confidence: HIGH_FOR_SOURCE_DESCRIPTION / UNKNOWN_FOR_ZERO_DEPLOYMENT
Uncertainty: no local executable fixture or affected server dependency identified
Existing Defense: UNKNOWN
Measured Effectiveness: NOT_MEASURED
Needs A2 Verification: YES / inspect upstream fix and identify preconditions without claiming host use
Suggested Retest: version-pinned, temporary isolated case-insensitive fixture with independently observed final target, no protected host paths

## EVIDENCE_DELTA
- NEW_EVIDENCE: exact advisory identity, version range, author-reported casefolded Linux reproduction and creation-only constraint.
- CORRECTED_INTERPRETATION: parent canonicalization and a case-variant symlink escape are distinct hypotheses even when both involve filesystem containment.
- UNCHANGED_BOUNDARY: external report != local incident != present defense != measured outcome.
- NEW_COUNTEREVIDENCE: case-sensitive matching can be safe when actual filesystem semantics match; the advisory does not claim all existing-file overwrites or direct Windows/macOS replay.
- UNKNOWN_RETAINED: Zero Host Kernel dependency exposure, OS, actual symlink privileges, local incidents and mitigations.
- NEXT_RETEST_CONDITION: A2 inspect exact upstream patch/affected package, then use a pinned disposable environment and effect-target receipts.

## NEXT_HANDOFF
- A2 must consume merged-main 2026-10-29-A1-reliability-observe.md, not an unmerged draft or October 28 record.
- No host patch, Ballast intervention, lifecycle closure or permanent doctrine promotion authorized by this observation.

## BOUNDARY_CHECK
- New file only within aegis-cortex; historical Jules/native records untouched. No changes to host kernel, Ballast, data, NEXUS, governance or Actions.
- Native checker, reproduction, platform tests: NOT_EXECUTED / no PASS or local defense assertion.
