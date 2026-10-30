# A2 Daily Doctrine Orient — 2026-10-30

## CORTEX_RUN_HEADER
Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A2
Canonical Identity: zero/aegis/A2
Cadence: Daily
Loop Stage: Orient
Logical Date: 2026-10-30
Logical Timezone: Asia/Shanghai
Execution Date UTC: 2026-10-30
Exact Execution Timestamp: NOT_CAPTURED
Agent: GPT-6
Producer Identity: GPT_NATIVE_PROSPECTIVE / NOT_JULES_REPLAY
Record Provenance: HUMAN_AUTHORIZED_NATIVE_PRODUCTION
Base Main SHA: 4e596bb6674dd2d933e109a0628b63a2cd5d48b3
Run Identity: zero-entropy-lab/aegis/A2/2026-10-30/GPT_NATIVE/4e596bb6674dd2d933e109a0628b63a2cd5d48b3/gpt-native-20261030-a2-01
Upstream A1 Path: aegis-cortex/2026-10-30-A1-reliability-observe.md
Upstream A1 Blob SHA: af96b4c1422edd344a513d57a540b31763f00d0d
Upstream A1 PR: #756 / MERGED
Upstream A1 Merge SHA: 4e596bb6674dd2d933e109a0628b63a2cd5d48b3
Input Status: SAME_DATE_A1_MERGED_MAIN_VISIBLE
Task Status: SUCCESS_BOUNDED_DOCUMENTARY_ORIENTATION
Evidence Class: EXTERNAL_FAILURE_REPORT / NOT_LOCAL_INCIDENT
Source Identity: GHSA-v38p-wf49-hx2j / mcp-server-fetch 2026.10.24 upstream fix
Source Authority For Claim: ORIGINAL_UPSTREAM_SECURITY_ADVISORY_AND_SOURCE_PATCH
Independent Verification: ADVISORY_BODY_AND_ORIGINAL_FIX_DIFF_INSPECTED / NO_LOCAL_EXPLOIT_OR_PATCH_REPLAY
Local Incident Evidence: NO_LOCAL_EVIDENCE
Host Applicability: UNKNOWN
Existing Defense: UNKNOWN
Measured Effectiveness: NOT_MEASURED
Original Execution Status: GPT_NATIVE_PROSPECTIVE_ORIENTATION / NOT_JULES_REPLAY
Current Path Status: PROPOSED_DRAFT_PR / NOT_MERGED_AT_AUTHORING
Network Status: ORIGINAL_SECURITY_ADVISORY_AND_PATCH_DIFF_OPENED
Write Scope: aegis-cortex/2026-10-30-A2-doctrine-orient.md
Boundary Violation: NO

## INPUT_RECORD
- Inspected merged same-day A1 at aegis-cortex/2026-10-30-A1-reliability-observe.md, verified Git blob af96b4c1422edd344a513d57a540b31763f00d0d and actual PR #756 merge SHA 4e596bb6674dd2d933e109a0628b63a2cd5d48b3 before A2 execution.
- The A1 authoring-time branch-proposal status remains its historical state; later A2 is authorized to observe merged visibility without rewriting A1.
- Read Aegis EVIDENCE_POLICY, 2026-10-29 A1/A2, original upstream https://github.com/modelcontextprotocol/servers/security/advisories/GHSA-v38p-wf49-hx2j and exact upstream fix https://github.com/modelcontextprotocol/servers/pull/5240.
- Both first-party release and upstream advisory published 2026-10-25. This A2 checked them on 2026-10-30. Same publisher family means source-to-fix traceability, not independent third-party replication.
- No local Zero host dependency inventory, egress policy, actual fetch invocation, network connection, cloud metadata target, exploit reproduction or patched package test was performed.

## RISK_CLASSIFICATION
### SIG-20261030-A01 — IDNA check/connect hostname identity mismatch
Signal ID: SIG-20261030-A01
A1 Input: 2026-10-30-A1-reliability-observe.md / GHSA-v38p-wf49-hx2j
Advisory: https://github.com/modelcontextprotocol/servers/security/advisories/GHSA-v38p-wf49-hx2j
Upstream Implementation Fix: https://github.com/modelcontextprotocol/servers/pull/5240
Published: 2026-10-25; Checked: 2026-10-30
Evidence Tier: UPSTREAM_MAINTAINER_SECURITY_ADVISORY / SOURCE_PATCH_AND_ADDED_TEST_DIFF
Affected Package: mcp-server-fetch (Python/PyPI)
Affected Versions: >=2026.10.10, <=2026.10.19 / ADVISORY_REPORTED
Patched Version: 2026.10.24 / MAINTAINER_REPORTED
External Risk State: EXTERNAL_FAILURE_MECHANISM_SUPPORTED_WITH_EXACT_PRECONDITIONS
Root Mechanism: the upstream HTTP request guard previously used `request.url.host` (Unicode form); `socket.getaddrinfo` can resolve that under IDNA 2003 while httpx transport connects using IDNA 2008 ASCII `request.url.raw_host`. Some characters cause distinct DNS name identities and bypass an apparent private-address check.
Original Upstream Report: one author-controlled test DNS zone returned public addresses for IDNA 2003 form and loopback for IDNA 2008 form. The author reported an isolated container reproduction using a stub internal HTTP response. This is author-report provenance, NOT an Aegis run.
Fix Diff Observed: PR #5240 replaces `host = request.url.host` with `host = request.url.raw_host.decode("ascii")` in the request hook. A regression-test diff pins `faß` and final-sigma Unicode/punycode forms and rejects private resolved addresses, asserting no HTTP request was sent to that private test target.
Limits: the fix aligns the representation checked with the representation used for connection, but the patch diff alone does NOT establish transport-level DNS-resolution pinning, secure behavior under DNS rebinding, proxy-only names, or all subsequent environmental/network changes. The original advisory treats these as distinct issues.
Necessary Conditions: vulnerable mcp-server-fetch version; attacker-influenced internationalized URL; different DNS answers across the two encoded name forms (or proxy-only lookup exception); enabled fetch path and reachable nonpublic endpoint. Actual Zero deployment unknown.
Claim Not Supported: Zero installed or used affected version, a breach, an actual metadata leak from Zero, every IDNA label affected, patched deployment proven secure, or measured mitigation effectiveness.
Local Incident Evidence: NO_LOCAL_EVIDENCE
Host Applicability: UNKNOWN / CONDITIONAL
Existing Defense: UNKNOWN
Measured Effectiveness: NOT_MEASURED
Independent Verification: REVIEW_OF_UPSTREAM_REPORT_AND_DIFF / NOT_A_SECOND_RUNTIME_REPRODUCTION
Disposition: RESEARCH_WATCHLIST / NO_KERNEL_CHANGE / NO_PROVEN_LOCAL_FAILURE

## ORIENTATION_NOTES
- Counterevidence gate: absent the IDNA normalization split or relevant DNS/URL control, the reported bypass path cannot be inferred. A resolution or connection that happens to a public peer does not establish correctness of every future call.
- Authorization and effect belong to the actual resolved connection identity, host, policy and effect target, not merely a pre-request string or 'success' response. A replay should capture both checked name and actual connected peer, with safe isolated endpoints.
- Distinguish from GHSA-4gxg-m5jx-9j57 (10/29 casefolded filesystem symlink) and from GHSA-53mr-w429-c597 (earlier parent-directory TOCTOU); shared upstream release/publisher does NOT make distinct incidents or independent reproductions.
- Distinguish from separate GHSA-66qx-2266-pmj6 (NAT64 embedded IPv4 classification) and GHSA-3jqg-r5pp-rmp2 (redirect robots rule). Those are different mechanism and patch identities; they do not independently confirm this IDNA vulnerability.
- Package version is only an upstream advisory bound until installed exact package/process is observed. Patching the package is not evidence of Zero applying an operational defense.
- Do not turn advisory proof of concept or patch unit-test code into local exploit success, test PASS, NEXUS action proof or a policy decision.

## NO_DECISION_SECTION
- Daily A2 is an observation/orientation, NOT Weekly A3 decision or A4 durable protocol update.
- Decision ID: NONE / NO_LOCAL_INCIDENT_ESTABLISHED
- Action ID: NONE / NO_HOST_PATCH_AUTHORIZED
- No downgrade or upgrade of host/kernel controls based only on this documentary evidence. October A5/A6 natural-month closure NOT_DUE.

## EVIDENCE_DELTA
- NEW_EVIDENCE: source-level fix PR #5240 and exact raw_host-versus-host difference with specific regression test input forms, beyond A1's advisory claim.
- CORRECTED_INTERPRETATION: a passed guard on the decoded hostname does not establish that the HTTP transport connected to the same checked identity.
- UNCHANGED_BOUNDARY: upstream report != Zero incident != existing defense != measured effectiveness; test source != executed test.
- NEW_COUNTEREVIDENCE: conditional Unicode/DNS behavior, explicit separate rebinding/proxy limitations, and absence of host dependency evidence defeat a generic Zero exposure statement.
- UNKNOWN_RETAINED: actual installed version, DNS/proxy/IDNA runtime configuration, checker-to-connect consistency, real peer identity, local incidents, and independently verified patched-version effect.
- NEXT_RETEST_CONDITION: in a disposable authorized test network, pin vulnerable/fixed versions and resolver, compare checked IDNA name, resolved IP, transport peer and returned effect for control and adverse cases; capture actual command, version, test result, exit, before/after effects. Evaluate DNS rebinding separately.

## NEXT_HANDOFF
- Weekly A3/A4 may consume this A1/A2 pair but may not promote conditional outside vulnerability to local incident without real Zero host evidence. A5/A6 not due.
- No Ballast, NEXUS, kernel, GitHub Actions, governance or historical Jules change is intended.

## BOUNDARY_CHECK
- Only new 2026-10-30 A2 path. Original A1/Jules, host code, security policy, Ballast state and workflows unchanged.
- Native checker, upstream pytest, isolated exploit and patched-version tests: NOT_EXECUTED in this research pass. No PASS or measured defense claim.
