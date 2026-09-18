# A4 Weekly Protocol Act

## CORTEX_RUN_HEADER
- **Cortex**: aegis-cortex
- **Host Repository**: zero-entropy-lab
- **Task ID**: A4
- **Cadence**: Weekly
- **Loop Stage**: Act
- **Target Week**: 2026-W37
- **Logical Week Basis**: Asia/Shanghai
- **Maintenance Date**: 2026-09-19
- **Agent**: GPT Web Maintenance Agent
- **Record Provenance**: HUMAN_AUTHORIZED_PERIODIC_MAINTENANCE_RECOVERY
- **Decision Input Status**: PRESENT_WITH_DEGRADED_PROVENANCE
- **Network Status**: NETWORK_VERIFIED
- **Task Status**: DEGRADED
- **Repository Inspection**: AEGIS_ONLY
- **GitHub Actions Inspection**: NO
- **Write Scope**: aegis-cortex only
- **Boundary Violation**: NO
- **Original W37 A4 Jules Attempt**: PR #440 CLOSED_UNMERGED
- **Original W37 A4 Attempt State**: DECISION_INPUT_MISSING / BLOCKED
- **Original W37 A3 Delivery State**: NO_JULES_NATIVE_FINAL
- **Current H3 Path**: aegis-cortex/2026-W37-A3-discipline-decide.md
- **Long-Term Doctrine Promotion**: NO

## INPUT_RECORD
- **A3**: aegis-cortex/2026-W37-A3-discipline-decide.md
- **A3 Task Status**: DEGRADED
- **A3 Decision IDs**:
  - DEC-W37-M01
  - DEC-W37-M02
  - DEC-W37-M03
- **A3 Provenance**: HUMAN_AUTHORIZED_PERIODIC_MAINTENANCE_RECOVERY
- **Target-week A1/A2**: 2026-09-07 through 2026-09-13 as listed in A3
- **Historical A4**: aegis-cortex/2026-W36-A4-protocol-act.md
- **A6**: aegis-cortex/2026-08-A6-aegis-memorize.md
- **Historical W37 A4 Attempt**: PR #440, closed without merge because same-week A3 was unavailable
- **Provenance Limitation**: this record is a later periodic-maintenance recovery, not a replay of the original Jules attempt.

## PROTOCOL_ACTION_RECORD

### ACT-W37-M01
- **Action ID**: ACT-W37-M01
- **Action Type**: SOURCE_REQUIREMENT
- **Source Decision ID**: DEC-W37-M01
- **Action**: Before a claim is promoted from A1/A2 into weekly or monthly synthesis, retain its exact supporting source lineage, actual access depth and claim-level independence count.
- **Reason**: W37 shows that run-level source diversity can otherwise inflate individual claim verification.
- **Expected Behavior Change**: `RUN_LEVEL_TWO_SOURCES` never implies `EACH_CLAIM_TWO_SOURCE_VERIFIED`.
- **Validity Window**: W38-W44
- **Stop Condition**: deterministic claim/source validation supersedes this temporary discipline.
- **Host Repository Change NO**: YES
- **GitHub Actions Change NO**: YES
- **Static Doctrine Change NO**: YES

### ACT-W37-M02
- **Action ID**: ACT-W37-M02
- **Action Type**: UNCERTAINTY_GUARD
- **Source Decision ID**: DEC-W37-M02
- **Action**: Keep paper results and named product limits source-specific. Record `LOCAL_APPLICABILITY_UNKNOWN` unless authorized local evidence establishes occurrence, rate or mechanism.
- **Reason**: W37 includes research benchmarks, theory and GitHub product documentation that are useful external evidence but not local Aegis facts.
- **Expected Behavior Change**: no external failure rate, runtime limit or defense result is silently converted to a local incident/capability.
- **Validity Window**: W38-W44
- **Stop Condition**: direct local evidence or a later weekly decision materially changes the boundary.
- **Host Repository Change NO**: YES
- **GitHub Actions Change NO**: YES
- **Static Doctrine Change NO**: YES

### ACT-W37-M03
- **Action ID**: ACT-W37-M03
- **Action Type**: OBSERVATION_DISCIPLINE
- **Source Decision ID**: DEC-W37-M03
- **Action**: Prefer a concrete search shape `named failure mode + exact object/benchmark/product + original/official source`. If no qualified material signal is found, record no-material-new-signal rather than broadening the claim.
- **Reason**: precise topics are easier for Jules to source and easier for later maintenance to re-open and calibrate.
- **Expected Behavior Change**: lower source mismatch and lower correction cost in subsequent Daily/Weekly/Monthly maintenance.
- **Validity Window**: W38-W42
- **Stop Condition**: later weekly guidance replaces the focus.
- **Host Repository Change NO**: YES
- **GitHub Actions Change NO**: YES
- **Static Doctrine Change NO**: YES

## NEXT_WEEK_OPERATING_NOTES
- **优先观察风险**: false completion, memory poisoning, tool authorization, evaluation reliability, human oversight.
- **验证要求**: claim-level source mapping; access depth; local/external separation.
- **优先来源**: original papers, official product/security/runtime documentation, primary incident reports.
- **搜索主题形态**: concrete failure mode + named object + original/official source.
- **应避免的幻觉**: external benchmark percentage as local rate; vendor runtime limit as Jules limit; preventive file as proof of mitigation.
- **缺失输入处理**: preserve task-time missing state even if the file later appears.
- **同源处理**: reopening the same paper or vendor lineage does not add independence unless a materially new source/version is identified.
- **需要继续验证的问题**: whether any of the watched failure modes has authorized, observable Aegis-local evidence.
- **失效条件**: new evidence, superseding weekly decision or direct local measurement changes a boundary.

## ACTION_LIMITS
- Host repository modified: NO
- GitHub Actions modified: NO
- Static host rule created: NO
- Non-periodic governance system created: NO
- Long-term doctrine upgraded: NO
- Original PR #440 BLOCKED history rewritten: NO
- Private control content disclosed: NO

## BOUNDARY_CHECK
- Original Jules W37 A4 attempt preserved as closed-unmerged history: YES
- Current A4 explicitly marked later maintenance recovery: YES
- External risk converted into local incident: NO
- September month closure claimed: NO
- Boundary violation: NO
