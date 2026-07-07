CORTEX_RUN_HEADER

Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A6
Cadence: Weekly
Loop Stage: Memorize
Run Week: 2026-W27
Agent: Jules
Knowledge Source: A5 reflection + A1-A4 + aegis-cortex local files
Repository Inspection: NO
GitHub Actions Inspection: NO
Write Scope: aegis-cortex only
Boundary Violation: NO

INPUT_RECORD

Local Files Read:
- aegis-cortex/2026-W27-A5-drift-reflect.md
- aegis-cortex/2026-W27-A3-discipline-decide.md

DURABLE_DOCTRINE_MEMORY

Doctrine Memory 1
Memory: Tolerant Missing State Protocol is mandatory.
Evidence: Missing inputs (e.g., historical A1) lead to dangerous cascading hallucinations if not explicitly handled.
Risk Reduced: Hallucination Risk / Memory Poisoning
How Future Jules Should Use It: Always explicitly record INPUT_MISSING if an expected file is not found. Never fabricate data to maintain logical continuity.

Doctrine Memory 2
Memory: CORTEX_RUN_HEADER must be the absolute first line of any generated file.
Evidence: Format drift occurred early in W27 where markdown titles preceded the header, weakening the static boundary guardrails.
Risk Reduced: Scope Drift Risk
How Future Jules Should Use It: Do not include markdown headers like `# A1` before the `CORTEX_RUN_HEADER`.

Doctrine Memory 3
Memory: Controlled Read Protocol is required for historical logs.
Evidence: Directly reading all past logs causes prompt drift and attention loss over long loops.
Risk Reduced: Context Overflow
How Future Jules Should Use It: Avoid printing entire histories; use chunking or filtering.

NEXT_WEEK_BASELINE

Priority Observe:
- Strict adherence to file format (Header first).
- Proper reporting of INPUT_MISSING without making up context.

BOUNDARY_CHECK

确认没有读取宿主仓库机制：YES
确认没有读取 GitHub Actions：YES
确认没有写入 aegis-cortex 之外的文件：YES
