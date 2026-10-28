# A2 Daily Doctrine Orient — 2026-10-28

## CORTEX_RUN_HEADER
- Cortex: aegis-cortex
- Host Repository: zero-entropy-lab
- Task ID: A2
- Canonical Identity: zero/aegis/A2
- Cadence: Daily
- Loop Stage: Orient
- Logical Date: 2026-10-28
- Logical Timezone: Asia/Shanghai
- Execution Date UTC: 2026-10-28
- Exact Execution Time: NOT_CAPTURED
- Agent: GPT-6
- Producer Identity: GPT_NATIVE_PROSPECTIVE / NOT_JULES_REPLAY
- Record Provenance: HUMAN_AUTHORIZED_NATIVE_PRODUCTION
- Original Execution Status: NEW_GPT_NATIVE_PROSPECTIVE_ORIENTATION / NOT_JULES_REPLAY
- Input Status: SAME_DATE_A1_MERGED_MAIN_VISIBLE
- Network Status: FIRST_PARTY_MCP_ADVISORY_BODY_OPENED_AND_PLATFORM_BOUNDARIES_RECHECKED
- Source Status: ONE_CANONICAL_ADVISORY / ZERO_INDEPENDENT_LOCAL_OR_EXTERNAL_EXECUTION_REPLAYS
- Task Status: SUCCESS_BOUNDED_DOCUMENTARY_ORIENTATION
- Evidence Scope: EXTERNAL_SECURITY_ADVISORY / NOT_LOCAL_EFFECT
- Evidence Class: EXTERNAL_RISK_CLASS / EXTERNAL_FAILURE_REPORT
- Local Incident Evidence: NO_LOCAL_EVIDENCE / NOT_A_PROOF_OF_ABSENCE
- Existing Defense: UNKNOWN_FOR_ZERO_KERNEL
- Measured Effectiveness: NOT_MEASURED
- Host Applicability: UNKNOWN
- Knowledge Source: MERGED_A1 / FIRST_PARTY_ADVISORY / CURRENT_AEGIS_POLICY
- Repository Inspection: CURRENT_MAIN_A1_AND_AEGIS_POLICY_READ / BALLAST_OPEN_PR_SEPARATE
- GitHub Actions Inspection: PR_DELIVERY_METADATA_ONLY / NO_NATIVE_EXPLOIT_REPLAY
- Write Scope: aegis-cortex/2026-10-28-A2-doctrine-orient.md
- Boundary Violation: NO
- Current Path Status: PREPARED_FOR_HUMAN_AUTHORIZED_PR_DELIVERY / NOT_YET_MERGED
- Base Main SHA: 5790f00e9e80e762ec215b43e5767860cb1c2447
- A1 Source Blob SHA: deadb66b7dcb829b71da208296294a872ad62d86
- Upstream A1 Path: aegis-cortex/2026-10-28-A1-reliability-observe.md
- Upstream A1 PR: #738 MERGED 2026-10-28T06:13:03Z
- Upstream A1 Merge SHA: 5790f00e9e80e762ec215b43e5767860cb1c2447
- Run Identity: zero-entropy-lab/aegis/A2/2026-10-28/GPT_NATIVE/5790f00e9e80e762ec215b43e5767860cb1c2447/gpt-native-20261028-a2-01

## INPUT_RECORD
- Read exact current main same-date A1: one GHSA-53mr-w429-c597 advisory and SIG-20261028-A01, with ZERO independent exploit reproductions.
- A1 original Draft state remains valid at the earlier artifact-writing point, but it is now merged on main via #738; later delivery cannot be backdated into that earlier write.
- Original advisory: https://github.com/modelcontextprotocol/servers/security/advisories/GHSA-53mr-w429-c597; published 2026-10-25; inspected 2026-10-28.
- Published severity: LOW; advisory's CVSS v3.1 score 2.2 and vector AV:L/AC:H/PR:L/UI:R/S:U/C:N/I:L/A:N are publisher-scoped risk classification, NOT a measured Zero risk or exploitable probability.
- Publicly documented vulnerability is local race in @modelcontextprotocol/server-filesystem, not the general MCP protocol or the distinct Streamable HTTP request-size advisory studied October 26.
- The concurrent Ballast PR #737 modifies ballast/** and is excluded from Aegis evidence attribution; its state is not evidence of an Aegis native execution.
- Exact installed Zero package, host exposed filesystem server, OS/config of a local deployment, attacker write capabilities, final target and any local incident receipt were NOT_ASSESSED / UNKNOWN.

## RISK_CLASSIFICATION

### RISK-20261028-01
- Signal ID: SIG-20261028-A01
- External Failure Class: FILESYSTEM_ALLOWED_DIRECTORY_VALIDATION_TO_USE_RACE
- Canonical Source: GHSA-53mr-w429-c597; one reporter/maintainer advisory, not an independently executed test
- Affected Package: @modelcontextprotocol/server-filesystem
- Affected Version Families: advisory lists >=2025.1.14 through <=2026.8.31 date releases and semver <2.0.1; the two version lines are not a single semver numeric interval
- First-party Patch Label: 2.0.1; Linux/macOS write-target handle anchoring documented
- Residual Exposure: Windows junction replacement remains possible under stated adversary conditions, per advisory; do not present 2.0.1 as a complete Windows fix
- Affected Operations: write_file, edit_file, create_directory, destination of move_file
- Root Cause: the ENOENT creation fallback validates realpath(parent), then returns the original uncanonicalized absolute path. A later kernel syscall can resolve through a concurrently replaced path component
- External Reported PoC: advisory describes a deterministic macOS system-temp fixture where the local adversarial process swaps the checked parent for a symlink before use
- PoC Execution Here: NOT_EXECUTED / AUTHOR_REPORTED_ONLY
- Scope: attacker must possess sufficient same-host local ability to race an attacker-writable intermediate path while the agent executes a relevant authorized tool operation
- Additional Prompt Injection Discussion: advisory discusses possible indirect injection as a separate trigger to induce a tool call, not proof of universal remote access without a cooperating local racer
- Existing Defense In Zero: UNKNOWN; no evidence the affected package is even installed
- Local Incident: NO_LOCAL_EVIDENCE, not VERIFIED_NO_INCIDENT
- Measured Mitigation: NOT_MEASURED
- Exact Source Independence: ONE_FIRST_PARTY_ADVISORY / A1_AND_A2_RESTATEMENTS_ARE_INHERITANCE
- Host Kernel Change Authorized: NO

## ORIENTATION_NOTES

### File identity versus authorization declaration
- A permitted lexical path, parent realpath observed at check time, and syscall-resolved target at use time are three distinct objects.
- A successful precondition or tool status is not sufficient to prove the intended file remained under its authorized parent at effect time.
- For tests, retain allowed-root identity, OS, canonical parent, resolved final target, object identity when available, process authority, and exact effect receipt before assigning local effectiveness.

### Platform/version counterevidence
- The 2.0.1 patch is explicitly scoped: Linux/macOS anchor writes to the validated directory; the advisory notes that Windows path-string-based Node APIs leave a junction-race concern.
- An attacker not able to alter an intermediate path cannot demonstrate this exact race. Prior authentication, path ownership and trusted parent permissions are independent controls, none assessed for Zero.
- A date-versioned installation such as 2026.x can sort above 2.0.1 under package-manager version comparisons; the advisory warns an automatic package update or Dependabot suggestion may not surface the fix. This is a conditional migration caveat, not an observed Zero dependency.
- Previous 2025 symlink/prefix containment fixes do not imply this 2026 check-to-use interval was fixed. Distinct CVEs/controls cannot be collapsed.

### Completion and claim boundary
- The advisory's demonstration and publisher risk score support a scoped EXTERNAL_FAILURE_REPORT, not Zero Kernel data loss, file exfiltration, a new locally observed exploit, or effectiveness of a mitigation.
- A file operation return status and a path validation signal cannot by themselves prove AUTHORITATIVE_EXTERNAL_EFFECT at the approved target.
- No package installation, sandbox exploit, target postcondition, memory store or host telemetry was opened or changed here.
- The same upstream advisory in A1 and A2 contributes one canonical source, not two independent risk reports or two benchmark experiments.

## NO_DECISION_SECTION
- Decision ID: NO_DECISION
- Decision: NO_HOST_KERNEL_CHANGE / NO_AEGIS_DOCTRINE_PROMOTION
- Counterevidence Gate: NOT_PASSED_FOR_LOCAL_VULNERABILITY_OR_DEFENSE_EFFECTIVENESS
- Reason: package/version/use evidence, host OS permissions, concrete reachable tool surface, observed syscall targets and isolated reproduction are all missing
- Preserved States: EXTERNAL_RISK_SUPPORTED / LOCAL_INCIDENT_UNKNOWN / EXISTING_DEFENSE_UNKNOWN / MEASURED_EFFECTIVENESS_NOT_MEASURED
- Watchlist: target-identity continuity in filesystem tools, race window, handle-based vs path-based mutation, source authority, output identity and postcondition validation
- Excluded: Host Kernel defect claim, Ballast research authorship, NEXUS action, general MCP standard vulnerability, automatic security patch
- Independent Evidence Added: NONE; original advisory was opened again to narrow exact preconditions and platform-specific limitations

## EVIDENCE_DELTA
- NEW_EVIDENCE: direct reading of original advisory identifies the exact validatePath ENOENT fallback, named affected operations, low-severity scope, two version families and residual Windows caveat.
- CORRECTED_INTERPRETATION: 2.0.1 does not mean identical defense on every OS, and a successful path check does not prove final write target identity.
- UNCHANGED_BOUNDARY: EXTERNAL_RISK != LOCAL_INCIDENT != EXISTING_DEFENSE != MEASURED_EFFECTIVENESS; publisher PoC != this producer's executed PoC.
- NEW_COUNTEREVIDENCE: required local race capability, platform-specific file-handle limits and the unusual date-version-to-semver transition contradict unconditional affected/fully-fixed narratives.
- UNKNOWN_RETAINED: actual Zero deployment, installed SDK, exposed filesystem operations, adversary capability, mitigations, local incidents and actual tool-effect receipts.
- NEXT_RETEST_CONDITION: use an authorized exact-version/OS temp-only fixture, exercise the check/use boundary at controlled points, collect path, inode/file-id and authoritative final target, and compare affected/patched platform configurations without modifying host state.

## NEXT_HANDOFF
- Any subsequent A3 Weekly discipline or A5 Monthly memory must retain source lineage and current logical-period identity; October is OPEN / NOT_FINAL.
- No Host Kernel runtime, Ballast, active SQLite/JSONL, NEXUS, lifecycle workflow, scheduler or private native producer settings were changed.
- Evidence is suitable for research watchlist and future repro design only; no automatic adoption or enforcement follows.

## BOUNDARY_CHECK
- One new canonical A2 artifact from exact merged A1, with no historical Daily rewrite, original failure restoration or foreign PR mutation.
- Aegis offline checker, SDK exploit PoC, local Zero tests, and host filesystem effect verification: NOT_EXECUTED during authoring; no PASS or defense claim.
- Prior Jules and GPT Native producer identities preserved, and source repetition not counted twice.
