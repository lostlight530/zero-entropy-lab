# A2 Daily Doctrine Orient — 2026-10-29

## CORTEX_RUN_HEADER
Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A2
Canonical Identity: zero/aegis/A2
Cadence: Daily
Loop Stage: Orient
Logical Date: 2026-10-29
Logical Timezone: Asia/Shanghai
Execution Date UTC: 2026-10-29
Exact Execution Timestamp: NOT_CAPTURED
Agent: GPT-6
Producer Identity: GPT_NATIVE_PROSPECTIVE / NOT_JULES_REPLAY
Record Provenance: HUMAN_AUTHORIZED_NATIVE_PRODUCTION
Base Main SHA: b3e71fe6f8548eeae3b977bfe05a4bfaa344a02a
Run Identity: zero-entropy-lab/aegis/A2/2026-10-29/GPT_NATIVE/b3e71fe6f8548eeae3b977bfe05a4bfaa344a02a/gpt-native-20261029-a2-01
Upstream A1 Path: aegis-cortex/2026-10-29-A1-reliability-observe.md
Upstream A1 Blob SHA: 0febd738331638bc8624a1d2b1c4176ca1735214
Upstream A1 PR: #750 / MERGED
Upstream A1 Merge SHA: b3e71fe6f8548eeae3b977bfe05a4bfaa344a02a
Input Status: SAME_DATE_A1_MERGED_MAIN_VISIBLE
Task Status: SUCCESS_BOUNDED_DOCUMENTARY_ORIENTATION
Evidence Class: EXTERNAL_FAILURE_REPORT / NOT_LOCAL_INCIDENT
Source Identity: GHSA-4gxg-m5jx-9j57 / @modelcontextprotocol/server-filesystem
Source Authority For Claim: ORIGINAL_UPSTREAM_SECURITY_ADVISORY / REPORTED_REPRODUCTION
Independent Verification: FIRST_PARTY_ADVISORY_BODY_AND_REPORTED_POC_REVIEWED / NO_LOCAL_EXPLOIT_OR_PATCH_REPLAY
Local Incident Evidence: NO_LOCAL_EVIDENCE
Host Applicability: UNKNOWN
Original Execution Status: NEW_GPT_NATIVE_PROSPECTIVE_ORIENTATION / NOT_JULES_REPLAY
Current Path Status: PROPOSED_PR_BRANCH / NOT_MERGED_AT_AUTHORING
Network Status: ORIGINAL_ADVISORY_OPENED / PACKAGE_VERSION_SURFACE_CHECKED
Write Scope: aegis-cortex/2026-10-29-A2-doctrine-orient.md
Boundary Violation: NO

## INPUT_RECORD
- Read exact merged main A1 path aegis-cortex/2026-10-29-A1-reliability-observe.md and returned Git blob 0febd738331638bc8624a1d2b1c4176ca1735214. PR #750 and main merge SHA b3e71fe6f8548eeae3b977bfe05a4bfaa344a02a were verified before authoring this downstream A2.
- A1's recorded task-time 'proposed branch' state remains historical provenance. This A2 records the later observed merge, not a retroactive rewrite.
- Read active Aegis EVIDENCE_POLICY, prior 2026-10-28 A1/A2 and the original upstream GHSA-4gxg-m5jx-9j57 advisory. Prior-day GHSA-53mr-w429-c597 is a different ENOENT/TOCTOU parent fallback hypothesis.
- Advisory date 2026-10-25; checked on 2026-10-29. Its reproduced casefolded Linux fixture belongs to the advisory's author, NOT this run.
- No Zero host component/version inventory, authorized writable-root configuration, casefolded filesystem, local symlink, existing defense, or containment-bypass experiment was performed. Ballast/Kernel deployment not inspected by execution.

## RISK_CLASSIFICATION
### SIG-20261029-A01 — case-variant symlink containment check
Signal ID: SIG-20261029-A01
A1 Input: 2026-10-29-A1-reliability-observe.md / GHSA-4gxg-m5jx-9j57
Original Source: https://github.com/modelcontextprotocol/servers/security/advisories/GHSA-4gxg-m5jx-9j57
Publisher: modelcontextprotocol/servers upstream security advisory
Published: 2026-10-25
Checked: 2026-10-29
Evidence Tier: FIRST_PARTY_SECURITY_ADVISORY / AUTHOR_REPORTED_REPRODUCTION
Affected Package: @modelcontextprotocol/server-filesystem
Affected Versions Reported: =2026.8.31 and >=1.0.0,<2.0.1
Patched Version Reported: 2.0.1
External Risk State: EXTERNAL_FAILURE_REPORT_SUPPORTED_WITH_PRECONDITIONS
External Claim: upstream reports that case-variant path lookup on a case-insensitive filesystem can bypass a symlink component check and allow creation of new files or directories outside declared allowed roots through relevant filesystem operations.
Root Mechanism: lexical component-name matching is case-sensitive while effective filesystem path resolution may not be; validation and later path use disagree when a differently cased name resolves to a symbolic link.
Necessary Conditions: relevant affected package/version, case-insensitive path behavior, a reachable symlink, attacker-influenced path spelling, permission to create the destination and a vulnerable create/move/write operation.
Affected Operations: create_directory; write_file creation; move_file destination creation, within advisory scope.
Not Established: arbitrary overwrite/read of pre-existing outside files, unconditional remote privilege escalation, every OS vulnerable, or Zero-local incident.
Reported Reproduction: upstream author reports Linux case-folded tmpfs; macOS and Windows environments were NOT_RUN in that report.
Aegis Repository Record Comparison: Aegis is an evidence/research surface; no runtime inventory or verified local incident has been established in this run.
Local Evidence: NO_LOCAL_EVIDENCE
Local Incident Evidence: NO_LOCAL_EVIDENCE
Local Applicability: UNKNOWN / CONDITIONAL_ON_INSTALLED_COMPONENT_VERSION_OS_FILESYSTEM_AND_TOOL_CONFIGURATION
Existing Defense: UNKNOWN_FOR_ZERO
Measured Effectiveness: NOT_MEASURED
Independent Source: upstream advisory and its author-reported test are one publication lineage, not an independent Aegis reproduction.
Disposition: RESEARCH_WATCHLIST / NO_MANDATORY_KERNEL_CHANGE / NO_DEFENSE_CLAIM

## ORIENTATION_NOTES
- Specific mechanism matters. An on-disk path may resolve differently from the case-sensitive component tokens passed to a lexical symlink detector. A sound guard must reason about canonical target identity, filesystem semantics, opened object and actual effect target, not only pre-use string comparison.
- The same publisher's other advisory GHSA-53mr-w429-c597 (2026-10-28 Daily) concerns a fallback after ENOENT and concurrent TOCTOU behavior. It neither proves nor disproves this casefolded component bypass; they are not two independent reproductions of the same exploit.
- The upstream affected and patched version ranges are advisory statements, not proof that a given Zero host installation uses them, nor proof that a particular patch protects every platform/configuration.
- Source-described mitigation constraints and test examples are not local tests. In particular, reproduction requires case-insensitive filesystem behavior; the author did not report direct tests on macOS or Windows.
- Attribution discipline: local HMAC, JSONL linkage, NEXUS memory status and Ballast task histories do not independently establish filesystem path containment; security advisory != measured local rate.
- Observable final target: any future authorized reproduction should record input path, allowed root, opened object identity and final target identity after operation, with rollback. Mere successful API return is not enough to show safe containment.
- Local scope decision: no change to Zero Kernel, data/knowledge graph, Ballast scheduler or Aegis permanent doctrine based on external evidence alone.
- Remaining Uncertainty: actual Zero dependency/OS/configuration, filesystem casefolding, symlink reachability, target authorization and the result of an independently run patched-version containment test remain UNKNOWN.

## NO_DECISION_SECTION
- Daily A2 is orientation, not A3 Weekly decision or A4 protocol action.
- Decision ID: NONE / NO_LOCAL_INCIDENT_ESTABLISHED
- Action ID: NONE / NO_HOST_PATCH_AUTHORIZED
- External report supports a conditional investigation, not a claim of vulnerability, immunity or measured mitigation in Zero.
- October A5/A6 final memory closure is NOT_DUE.

## EVIDENCE_DELTA
- NEW_EVIDENCE: original GHSA-4gxg-m5jx-9j57 conditional mechanism details, author-reported fixture scope, version bounds and create-versus-overwrite distinction.
- CORRECTED_INTERPRETATION: a case-insensitive component bypass must not be conflated with yesterday's independent ENOENT/TOCTOU fallback mechanism, or with installed Zero runtime behavior.
- UNCHANGED_BOUNDARY: external report != local incident != current defense != effectiveness measurement.
- NEW_COUNTEREVIDENCE: case-sensitive filesystems and absence of a reachable attacker-influenced symlink remove the reported path to reproduction; author did not test macOS/Windows.
- UNKNOWN_RETAINED: installed server, allowed roots, operating system, casefold behavior, attacker capability, patch coverage, actual final target and local incidents.
- NEXT_RETEST_CONDITION: use an authorized disposable case-insensitive test filesystem, pin affected and patched package versions, record path/object/file identity and authoritative final created target, replay safe creation-only variant without touching host directories, and inspect different OS environments separately.

## NEXT_HANDOFF
- Any later A3/A4 must retain both today A1 merge input and external-source lineage; do not use duplicate citations as independent security proof.
- A5/A6 month closure and protocol/Kernel upgrades are not authorized by this Daily. Ballast and NEXUS are separate execution and memory surfaces.

## BOUNDARY_CHECK
- Single new A2 research file. Historical A1/A2, prior Jules identities, Aegis evidence policy, Host Kernel, Ballast, NEXUS, GitHub Actions and governance unchanged.
- Aegis checker, external proof of concept, host filesystem effect verification and patch tests: NOT_EXECUTED at authoring. Upstream report and CodeQL metadata on A1 PR do not establish these tests passed.
