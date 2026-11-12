# A2 Daily Aegis Doctrine Orient — 2026-11-12

## CORTEX_RUN_HEADER
Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A2
Canonical Identity: zero/aegis/A2
Cadence: Daily
Loop Stage: Orient
Logical Date: 2026-11-12
Logical Timezone: Asia/Shanghai
Execution Time UTC: 2026-11-12T01:31:16Z / date-command observed before orientation authoring
Agent: GPT-6 / GPT_NATIVE / NOT_JULES_REPLAY
Producer Identity: HUMAN_REQUESTED_GPT_NATIVE
Record Provenance: HUMAN_AUTHORIZED_SUBSTITUTE
Base Main SHA: cfe9ec911fcbf30ce9950ca7d52966095cdd9cf5
Run Identity: zero-entropy-lab/aegis/A2/2026-11-12/GPT_NATIVE/cfe9ec911fcbf30ce9950ca7d52966095cdd9cf5/mcp-git-executable-config-orient-01
Upstream A1: aegis-cortex/2026-11-12-A1-reliability-observe.md
Upstream A1 Blob SHA: 6a772e4156d2df36567a650ed1cd9ca82e815720
Upstream A1 Merge PR: https://github.com/lostlight530/zero-entropy-lab/pull/853
Input Status: SAME_DATE_A1_MERGED_MAIN_VISIBLE_AND_IDENTITY_PINNED
Source Identity: modelcontextprotocol/servers GHSA-6hqx-gqrx-c5r2 / v2.4.0 release
Source Authority For Claim: FIRST_PARTY_PUBLISHED_SECURITY_ADVISORY_AND_RELEASE / CLAIM_SPECIFIC
Independent Verification: ORIGINAL_ADVISORY_AND_RELEASE_REOPENED / NO_EXECUTABLE_REPRODUCTION / SAME_PUBLISHER_LINEAGE
Evidence Class: EXTERNAL_RISK_CLASS / UNTRUSTED_GIT_CONFIGURATION_EXECUTABLE_EFFECT
Local Incident Evidence: NO_LOCAL_INCIDENT_ATTESTED / ABSENCE_NOT_PROVEN
Original Execution Status: GPT_NATIVE_2026-11-12_NEW_ORIENTATION / NOT_JULES_REPLAY
Current Path Status: NEW_A2_CANONICAL_REVIEW_BRANCH / MERGE_PENDING_AT_AUTHORING
Task Status: BOUNDED_EXTERNAL_FAILURE_ORIENTATION / NO_LOCAL_DOCTRINE_ACTION
Network Status: ORIGINAL_GITHUB_RELEASE_AND_SECURITY_ADVISORY_READ
Host Applicability: UNKNOWN / NO_ZERO_DEPENDENCY_OR_KERNEL_EXECUTION
Existing Zero Defense: UNKNOWN / NOT_ASSESSED_BY_RUNTIME
Measured Effectiveness: NOT_COMPUTED
Host Repository Change: NO
Write Scope: aegis-cortex/2026-11-12-A2-doctrine-orient.md
Boundary Violation: NO

## INPUT_RECORD
- Latest merged main of Zero at A2 cold start is `cfe9ec911fcbf30ce9950ca7d52966095cdd9cf5`. Same-date `aegis-cortex/2026-11-12-A1-reliability-observe.md` is merged and independently fetched with immutable blob SHA `6a772e4156d2df36567a650ed1cd9ca82e815720`.
- A1 human-authorized GPT Native PR #853 merged before this A2. A2 does not treat the earlier Draft PR or its author's research text as an independently reproduced incident.
- Current Aegis evidence policy, previous 2026-11-11 A2, prior W45 and October file inventory retain original producer and period status. 2026-W46 and November month are still OPEN/NOT_DUE.
- Technical focus: distinguish Git server read-only API semantics from Git executable configuration sinks, identify patched/unpatched preconditions, local incident class, effective defense evidence and exact retest conditions.
- No actual `mcp-server-git` binary, Zero Host Kernel implementation, installed package, untrusted repository exploit sample or execution sandbox was launched in this A2. No kernel dependency or vulnerability scan was claimed.

## SOURCE_VERIFICATION_RECORDS
### SRC-20261112-A2-01 — original Git server security advisory
- URL: https://github.com/modelcontextprotocol/servers/security/advisories/GHSA-6hqx-gqrx-c5r2 ; GitHub 2026-11-11 publication
- Advisory identifies vulnerable versions earlier than `mcp-server-git 2026.11.11`; prior 2026.11.4 report describes executable repository configuration under supposedly read-only `git_status`
- Named mechanisms include `core.fsmonitor` and additional Git settings for executable hooks, drivers, external diff, pager or signing, depending on invoked command. Fix declares overrides via `GIT_CONFIG_COUNT`, suppresses executable settings and refuses Git below 2.31
- Exact preconditions: an agent/server traverses an untrusted repository, Git honors the executable config sink, and the tool process has sufficient execution privileges; no local Zero incident can be inferred from this source
- Countercondition: a pinned patched tool running a supported Git version should suppress the listed control paths under the publisher's claim, but no independent A2 patched/unpatched replay or unrelated tool-family assessment occurred

### SRC-20261112-A2-02 — fixed-package release mapping
- URL: https://github.com/modelcontextprotocol/servers/releases/tag/v2.4.0 ; released 2026-11-11T07:07:16Z
- v2.4.0 lists six vulnerabilities in filesystem/git/fetch server packages and exact fix versions, with `mcp-server-git 2026.11.11` as the relevant package for the A1 Git config mechanism
- The release and advisory are **same upstream issuer lineage**: their co-citation does not provide a second empirical security test
- Other packages' filesystem TOCTOU and fetch path/address fixes do not establish that Zero Host Kernel has these third-party dependencies or a corresponding exploitation route

## RISK_CLASSIFICATION
Risk ID: RISK-20261112-A01
External Risk: EXTERNAL_RISK_CLASS / GIT_CONFIG_EXECUTABLE_EFFECT_BEHIND_READ_ONLY_API
External Claim: SOURCE_SUPPORTED_BY_FIRST_PARTY_ADVISORY_AND_RELEASE
Local Incident Evidence: NO_LOCAL_INCIDENT_ATTESTED / INVESTIGATION_NOT_PERFORMED / ABSENCE_UNKNOWN
Local Evidence: AEGIS_CURRENT_POLICY_READ / NO_ZERO_KERNEL_REPLAY / NO_OBSERVED_INCIDENT
Existing Defense: UNKNOWN / NO_PINNED_LOCAL_PACKAGE_OR_GATEWAY_STATE
Measured Effectiveness: NOT_COMPUTED
Local Applicability: UNKNOWN / ZERO_HOST_DEPENDENCY_CHAIN_AND_TOOL_BRIDGE_NOT_OBSERVED
Independent Evidence Added: ZERO_EXTERNAL_REPLICATION / SOURCE_DETAILS_REREAD_ONLY
Risk Status: BOUNDED_EXTERNAL_FAILURE_HYPOTHESIS / DO_NOT_PROMOTE_TO_LOCAL_DEFECT
Confidence: HIGH_FOR_PUBLISHED_MECHANISM / UNKNOWN_FOR_ZERO_EXECUTION

## ORIENTATION_NOTES
- A read-only tool name is not an effect isolation guarantee. Correctly assessing authority requires distinguishing repository trust identity, Git binary version, effective Git configuration, launched helper-process evidence and agent/tool permissions.
- Evidence classes must not collapse: `EXTERNAL_FAILURE_REPORT != LOCAL_REPOSITORY_INCIDENT != LOCAL_PREVENTIVE_RECORD != LOCAL_RUNTIME_OUTCOME != MEASURED_EFFECTIVENESS`.
- Existing Zero kernel HMAC, hash linkage, transition declaration, or PageRank worker checks do not inherently establish mitigation for a third-party MCP Git tool configuration sink.
- Correct counterfactual test: isolate a harmless marker-producing Git helper in an untrusted test repository, compare pre-fix and fixed mcp-server-git versions with the same Git version and input config, record processes/commands/exit/marker; add negative control with no executable config and a below-minimum Git version check.
- Proposed test architecture only. Do not execute uncontrolled commands, run an exploit on third-party repositories, change live Host Kernel policy, or elevate reported source risk to local priority without verified applicability.

## NO_DECISION_SECTION
Decision: NO_DECISION / NO_HOST_KERNEL_PROTOCOL_OR_POLICY_WRITE
Reason: A1 is externally sourced; no Zero-local dependency proof, observed incident, patch install evidence or sandbox replay. A2 source reread adds precise condition analysis, not independent verification or measured defense effectiveness.
External Risk State: FIRST_PARTY_PUBLISHED / PRECONDITIONS_NARROWED
Local Incident State: UNKNOWN / NOT_ATTESTED
Local Applicability: UNKNOWN / NO_IMPLEMENTATION_CHECK
Remaining Uncertainty: installed tool version, current Git version in real host, repo-origin trust, actual callable tool path, unauthorized side effects, patch coverage and independently measured mitigation
Next retest: authorized pinned runtime fixture, selected safe controls and exact process/effect receipts, with no change in Host Kernel or Ballast state

## EVIDENCE_DELTA
- NEW_EVIDENCE: fixed Git version and effective configuration override details directly reverified in advisory; zero new independent reproductions
- CORRECTED_INTERPRETATION: read-only command success is not proof of effect-free execution; proposed mitigation claims are distinct from installed/effective defense
- UNCHANGED_BOUNDARY: EXTERNAL_RISK != LOCAL_INCIDENT != EXISTING_DEFENSE != EFFECTIVENESS
- NEW_COUNTEREVIDENCE: control path needs untrusted config and executable sink; patched supported Git versions limit the vulnerable population relative to a universal Git tooling claim
- UNKNOWN_RETAINED: Zero host package/runtime, local incident, defense identity, independently verified patch effect and real authorization boundary
- NEXT_RETEST_CONDITION: pin version and config with benign positive/negative controls, capture command/env/subprocess/exit/effect and kernel integration evidence

## NEXT_HANDOFF
- This A2 may be inherited by W46 A3/A4 only after week closure and current-main availability; source repetition adds no independent evidence. No Aegis doctrine or Host Kernel promotion is authorized from this one externally reported issue.
- November A5/A6 final: NOT_DUE. Neither Ballast nor Independent GPT A1/A2 maintenance may be counted as a Native Aegis execution.
- Retain the exact same-date merged A1 main blob and source family in downstream lineage.

## BOUNDARY_CHECK
- Proposed only `aegis-cortex/2026-11-12-A2-doctrine-orient.md`. A1 historical body, Host Kernel, Ballast, data stores, index, Actions, prior Aegis A1–A6, scheduler, monthly governance remain unchanged.
- `aegis-cortex/check.py`, actual security regression tests, local tool implementation and kernel vulnerability replay: `NOT_EXECUTED`.
- Native A2 source interpretation does not infer local deployment, incident absence or author/publisher independence. Jules history and original failure statuses unchanged.
- Boundary Violation: NO
