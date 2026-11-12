# A1 Daily Reliability Observe — 2026-11-12

## CORTEX_RUN_HEADER
Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A1
Canonical Identity: zero/aegis/A1
Cadence: Daily
Loop Stage: Observe
Logical Date: 2026-11-12
Logical Timezone: Asia/Shanghai
Execution Time UTC: 2026-11-12 / exact task-start time not independently captured
Execution Time Asia/Shanghai: 2026-11-12 / exact task-start time not independently captured
Agent: GPT-6 / GPT_NATIVE / NOT_JULES_REPLAY
Producer Identity: HUMAN_REQUESTED_GPT_NATIVE
Record Provenance: HUMAN_AUTHORIZED_SUBSTITUTE
Base Main SHA: 693f9dd3a27d3be84c4f6fc14f6eb157f808b9fb
Run Identity: zero-entropy-lab/aegis/A1/2026-11-12/GPT_NATIVE/693f9dd3a27d3be84c4f6fc14f6eb157f808b9fb/mcp-git-config-boundary-01
Network Status: OFFICIAL_GITHUB_RELEASE_AND_SECURITY_ADVISORY_OPENED
Source Status: FIRST_PARTY_SECURITY_ADVISORY_AND_RELEASE / LOCAL_AND_PATCHED_REPLAY_NOT_EXECUTED
Task Status: SUCCESS / EXTERNAL_RISK_RESEARCH_ONLY
Source Identity: modelcontextprotocol/servers GHSA-6hqx-gqrx-c5r2; release v2.4.0
Source Authority For Claim: ORIGINAL_GITHUB_SECURITY_ADVISORY_FOR_REPORTED_FAILURE / FIRST_PARTY_RELEASE_FOR_FIXED_VERSION
Independent Verification: ADVISORY_AND_RELEASE_TEXT_READ / SAME_MAINTAINER_LINEAGE / EXPERIMENT_NOT_EXECUTED
Evidence Class: EXTERNAL_RISK_CLASS
External Evidence: AUTHOR_REPORTED_GIT_CONFIG_EXECUTION_AND_RELEASE_FIX
Local Incident Evidence: NO_LOCAL_INCIDENT_ATTESTED / NO_ZERO_KERNEL_SCAN_EXECUTED
Local Repository Evidence: AEGIS_POLICY_AND_PREVIOUS_DAILY_READ / LOCAL_HOST_RUNTIME_NOT_INSPECTED
Existing Zero Defense: UNKNOWN / HOST_KERNEL_CONFIGURATION_UNTESTED
Measured Effectiveness: NOT_COMPUTED
Host Applicability: UNKNOWN / NO_ZERO_HOST_DEPENDENCY_OR_OPERATIONAL_REPLAY
Original Execution Status: GPT_NATIVE_NEW_RESEARCH_2026-11-12 / NOT_JULES
Current Path Status: PROPOSED_BRANCH_ARTIFACT / MAIN_VISIBILITY_PENDING_AT_AUTHORING
Write Scope: aegis-cortex/2026-11-12-A1-reliability-observe.md
Boundary Violation: NO

## INPUT_RECORD
- Fresh source base is exact main 693f9dd3a27d3be84c4f6fc14f6eb157f808b9fb; preflight inspected no open PRs, Aegis current policy, 2026-11-11 A1/A2, prior closed W45 and 2026-10 files' existence, and current Aegis directory inventory.
- The previous 2026-11-11 A1 examined google/adk-python session-map deletion cleanup. The new mechanism involves MCP Git tools and repository-controlled executable configuration, distinct code, source and failure predicate.
- 2026-W46 is open; 2026-11 A5/A6 natural-month close is NOT_DUE. Historical W45 and Oct monthly outputs are not rewritten or declared newly executed.
- Research question: can a nominally read-only tool action execute a program supplied through target repository configuration, and does an explicit bounded Git-config override close the checked effect path?
- Source identities were opened at official GitHub release and primary security advisory. No Zero Host Kernel dependency scan, tool integration, local incident replay, patched-package test or sandbox experiment was run in this native A1.
- Same November 11 MCP release also informs Welcome H1 on November 12; same upstream author/publisher lineage is one external risk source, not two independent experiments.

## EXTERNAL_SOURCE_RECORDS

### SRC-20261112-A01 — Git configuration execution during MCP tool calls
Source ID: SRC-20261112-A01
Title: GHSA-6hqx-gqrx-c5r2 — mcp-server-git arbitrary command execution via repository Git configuration
Publisher: modelcontextprotocol/servers security advisory
URL: https://github.com/modelcontextprotocol/servers/security/advisories/GHSA-6hqx-gqrx-c5r2
Published or Updated Date: 2026-11-11 (GitHub advisory publication date)
Date Checked: 2026-11-12 Asia/Shanghai
Source Type: FIRST_PARTY_PUBLISHED_SECURITY_ADVISORY
Evidence Tier: PRIMARY_FOR_AUTHOR_REPORTED_FAILURE_AND_PATCH_DESCRIPTION
Access Status: ORIGINAL_ADVISORY_DESCRIPTION_READ
Independent Source: ONE_ORIGINAL_MCP_SERVER_ADVISORY_LINEAGE
External Evidence: pre-fix untrusted repository config could trigger an executable during read-only git_status via core.fsmonitor, and other executable Git config channels were addressed by the patch.
Claim Supported: the advisory identifies the problem for mcp-server-git before 2026.11.11 and claims hardening through GIT_CONFIG_COUNT, explicit suppression of executable Git configuration, and refusing Git older than 2.31.
Claim Not Supported: Zero's repository had the affected MCP server installed, Zero experienced an exploit, every Git invocation is proven safe by this producer, or a particular outside deployment is affected.
Confidence: HIGH_FOR_ADVISORY_CONTENT / UNKNOWN_FOR_LOCAL_EXECUTION
Uncertainty: exact current dependency graph, attacked repository prerequisites, runtime Git configuration, environment provenance, and independent patched/unpatched replay.
Limitations: first-party author disclosure and fix claim, not an experiment independently executed for this A1 run.

### SRC-20261112-A02 — versioned release boundary
Source ID: SRC-20261112-A02
Title: modelcontextprotocol/servers v2.4.0
Publisher: modelcontextprotocol/servers maintainers
URL: https://github.com/modelcontextprotocol/servers/releases/tag/v2.4.0
Published or Updated Date: 2026-11-11T07:07:16Z (release published_at)
Date Checked: 2026-11-12 Asia/Shanghai
Source Type: FIRST_PARTY_RELEASE_METADATA
Evidence Tier: PRIMARY_FOR_PUBLISHED_PACKAGE_VERSION_BOUNDARY
Access Status: GITHUB_OFFICIAL_RELEASE_API_AND_RELEASE_NOTES_READ
Independent Source: SAME_MAINTAINER_LINEAGE_AS_SRC-20261112-A01
External Evidence: release v2.4.0 names mcp-server-git 2026.11.11 as the fix version and states a bounded Git-version requirement, plus distinct filesystem/fetch security updates.
Claim Supported: upstream shipped/reported the named fix version, not local adoption.
Claim Not Supported: exact Zero host package version, tested defensive effectiveness or incident absence.
Confidence: HIGH_FOR_RELEASE_METADATA / UNKNOWN_FOR_LOCAL_MEASUREMENT
Uncertainty: no local binary or installed package identity.
Limitations: release metadata does not add an independent reproduction of advisory claims.

## RAW_RELIABILITY_SIGNAL_LOG

### RISK-20261112-A01 — READ_ONLY_TOOL_WITH_EXECUTABLE_REPOSITORY_CONFIG
Signal ID: RISK-20261112-A01
Source ID: SRC-20261112-A01
Failure Mode: tool-level read-only intent is insufficient to constrain lower-level Git configuration that can invoke executable programs.
External Risk: EXTERNAL_RISK_CLASS
External Failure Evidence: PUBLISHED_ADVISORY / AUTHOR_REPORTED_PRE_FIX_PATH
Local Incident: UNKNOWN / NOT_OBSERVED; explicitly not claimed as absent
Existing Defense: UNKNOWN / HOST_NOT_INSPECTED
Measured Effectiveness: NOT_COMPUTED
Reproduction: NOT_EXECUTED_BY_THIS_PRODUCER
Risk Preconditions: agent or tool accepts an untrusted repository, its Git config contains executable configuration, underlying Git call honors it, and the executing process has the relevant privileges.
Counterexample and limitation: patched mcp-server-git 2026.11.11 declares overrides and minimum Git version; the same conclusion does not cover unknown other Git tools, local host installations or all possible helper execution routes.
Confidence: HIGH_FOR_EXACT_ADVISORY / NO_LOCAL_INFERENCE
Uncertainty: configuration origin, effective precedence, executable sink coverage, Git binary version, local dependency identity and independent reproduction.
Potential false completion: a nominal read-only API return or green command status would not establish that no unintended helper program executed.
Retest Design: isolated untrusted repo with an observable benign helper, precise unpatched/patched version pair, normal read-only command and a negative control without executable config; instrument subprocess creation without running arbitrary outside payloads.
Host Repository Change: NO

## EVIDENCE_DELTA
- NEW_EVIDENCE: GitHub-published GHSA and release version identify a concrete untrusted-repository config execution path in an MCP Git tool.
- CORRECTED_INTERPRETATION: READ_ONLY_TOOL_INTENT != EFFECT_FREE_EXECUTION; lower-level repository configuration and runtime Git version belong to the executable authority boundary.
- UNCHANGED_BOUNDARY: EXTERNAL_RISK_CLASS != LOCAL_REPOSITORY_INCIDENT != EXISTING_ZERO_DEFENSE != MEASURED_EFFECTIVENESS.
- NEW_COUNTEREVIDENCE: the upstream fix expressly overrides executable config and rejects old Git versions, limiting any inference that simply labeling a command read-only ensures safety.
- UNKNOWN_RETAINED: any Zero local incident, actual installed MCP Git server, local kernel behavior, independent exploit reproduction and coverage of other tools.
- NEXT_RETEST_CONDITION: pin exact upstream sources and Git versions, instrument harmless process side effects in a test repository under explicit permission, compare pre/post command/process receipts and repository applicability without touching Host Kernel.

## NEXT_HANDOFF
- A2 may begin only when this exact 2026-11-12 A1 has merged to current main and its authoring/verification identities are independently inspected. An unmerged Draft PR is not current-main upstream.
- A2 should try to disconfirm the failure generalization by checking the precise vulnerable preconditions, relevant Git config override and pre/post version behavior; preserve same-source dependence.
- Do not upgrade this published external risk into a Zero incident, Host Kernel vulnerability, effective mitigation claim, Aegis doctrine or Ballast experiment.
- W46 and November final A5/A6: NOT_DUE.

## BOUNDARY_CHECK
- Proposed only aegis-cortex/2026-11-12-A1-reliability-observe.md. No Host Kernel, NEXUS, Ballast, state database, linked JSONL, hash chain, prior Aegis or automation files changed.
- Zero Aegis checker: NOT_EXECUTED at authoring. MCP patched/unpatched package and Zero host tests: NOT_EXECUTED. Source advisory and release notes: READ.
- Historical failures and prior producer provenance remain unchanged; this is prospective native GPT research, not Jules replay.
- Boundary Violation: NO
