CORTEX_RUN_HEADER

Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A5
Cadence: Weekly
Loop Stage: Reflect
Run Week: 2026-W27
Agent: Jules
Knowledge Source: A1-A4 + External Web + aegis-cortex local files
Repository Inspection: NO
GitHub Actions Inspection: NO
Write Scope: aegis-cortex only
Boundary Violation: NO

INPUT_RECORD

Local Files Read:
- aegis-cortex/2026-07-01-A1-reliability-observe.md to 2026-07-05-A1-reliability-observe.md
- aegis-cortex/2026-W27-A3-discipline-decide.md
- aegis-cortex/2026-W27-A4-protocol-act.md

RELIABILITY_REVIEW

effective
- CORTEX_RUN_HEADER and BOUNDARY_CHECK templates have been effective in asserting file boundaries.
- Tolerant missing state protocol (reporting INPUT_MISSING) effectively prevents hallucination cascades.

too broad
- Generating long files without restriction causes context overflow and prompt drift.

still uncertain
- Whether simply hardcoding boundary assertions is enough to prevent dynamic prompt drift during long operations.

DRIFT_AND_FAILURE_LOG

Possible Drift 1
Issue: Format rule violation. A1 files from 07-01 to 07-05 mistakenly included a leading "# A1 Daily Reliability Observe" title before the mandatory CORTEX_RUN_HEADER.
Correction: The automation process must enforce that CORTEX_RUN_HEADER is absolutely the first line, with no exceptions.

Possible Drift 2
Issue: Reading unrestricted lengths of previous daily logs dilutes the core instructions, leading to Agent Scope Drift.
Correction: Implement Controlled Read Protocol (as decided in A3).

CORRECTION_NOTES

Preserve:
- strict adherence to the INPUT_RECORD before analysis.
- the rule to tolerate missing inputs instead of hallucinating.

HANDOFF_TO_A6

A6 should summarize the rule for formatting (CORTEX_RUN_HEADER first) and the rule for handling missing inputs as durable doctrines for the week.

BOUNDARY_CHECK

确认没有读取宿主仓库机制：YES
确认没有读取 GitHub Actions：YES
确认没有写入 aegis-cortex 之外的文件：YES
