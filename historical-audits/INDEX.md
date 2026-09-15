# Historical Independent Audit Archive

This directory archives historical External Independent GPT audit, reconciliation, evidence-accounting, and maintenance records. Relocation preserves each archived record's original Git blob and does not reinterpret or modernize its historical contents.

## Scope boundaries

Not archived here:
- Aegis A1-A6 Jules scheduled-task artifacts
- `ballast/**` periodic GPT/Codex Agent artifacts
- active repository contracts, policies, architecture, schemas, checkers, or workflows
- current external-maintenance procedure/templates

## Archive classes

1. `01-corrections-and-errata/` — dated corrections to prior interpretations or evidence identity
2. `02-document-audits/` — independent audits of canonical document corpora
3. `03-stage-and-period-audits/` — provisional/as-of period-state audits
4. `04-evidence-and-closure-ledgers/` — evidence accounting and natural-period closure records
5. `05-maintenance-and-reconciliation/` — maintenance passes, provenance/cadence reconciliation, and post-hoc weekly reconciliation

## Relocation map

| Historical purpose | Archived path | Previous path |
| --- | --- | --- |
| August through-23 stage audit | `03-stage-and-period-audits/2026-08-23--august-through-23--stage-audit.md` | `aegis-cortex/2026-08-through-23-stage-audit.md` |
| August through-27 stage audit | `03-stage-and-period-audits/2026-08-27--august-through-27--stage-audit.md` | `aegis-cortex/2026-08-through-27-stage-audit.md` |
| August 1-28 daily/weekly reconciliation | `03-stage-and-period-audits/2026-08-28--august-01-28--daily-weekly-reconciliation.md` | `aegis-cortex/2026-08-01-through-28-daily-weekly-reconciliation.md` |
| September 1-13 reconciliation ledger | `03-stage-and-period-audits/2026-09-13--sep-01-13--reconciliation-ledger.md` | `aegis-cortex/2026-09-13-thirteen-day-reconciliation.md` |
| September 1-13 month-to-date reconciliation | `03-stage-and-period-audits/2026-09-13--sep-01-13--month-to-date-reconciliation.md` | `aegis-cortex/2026-09-13-september-month-to-date-reconciliation.md` |
| August month-end reconciliation | `04-evidence-and-closure-ledgers/2026-08-31--august--month-end-reconciliation.md` | `aegis-cortex/2026-08-month-end-reconciliation.md` |
| W33 post-hoc reconciliation | `05-maintenance-and-reconciliation/2026-W33--weekly-reconciliation.md` | `aegis-cortex/2026-W33-reconciliation.md` |
| W34 post-hoc reconciliation | `05-maintenance-and-reconciliation/2026-W34--weekly-reconciliation.md` | `aegis-cortex/2026-W34-reconciliation.md` |
| W35 partial reconciliation | `05-maintenance-and-reconciliation/2026-W35--partial-weekly-reconciliation.md` | `aegis-cortex/2026-W35-partial-reconciliation.md` |
| 2026-09-02 maintenance record | `05-maintenance-and-reconciliation/2026-09-02--maintenance-record.md` | `aegis-cortex/2026-09-02-maintenance-log.md` |
| Cross-period Jules cadence reconciliation | `05-maintenance-and-reconciliation/2026-09-06--jules-cadence--reconciliation.md` | `aegis-cortex/2026-09-06-jules-cadence-reconciliation.md` |
| Jules content-contract reconciliation | `05-maintenance-and-reconciliation/2026-09-06--jules-content-contract--reconciliation.md` | `aegis-cortex/2026-09-06-jules-content-contract-reconciliation.md` |
| September ten-day successor reconciliation | `05-maintenance-and-reconciliation/2026-09-10--sep-01-10--cadence-reconciliation.md` | `aegis-cortex/2026-09-10-ten-day-cadence-reconciliation.md` |
| September 1-13 maintenance predecessor | `05-maintenance-and-reconciliation/2026-09-13--sep-01-13--maintenance-reconciliation.md` | `aegis-cortex/2026-09-13-full-sop-reconciliation.md` |
| September 14-15 incremental maintenance reconciliation | `05-maintenance-and-reconciliation/2026-09-15--sep-14-15--maintenance-reconciliation.md` | no live file at the former current-entry path on `main` |

## Current recovery note

As of 2026-09-15, `05-maintenance-and-reconciliation/2026-09-15--sep-14-15--maintenance-reconciliation.md` is the latest completed independent maintenance record preserved in this archive. Its internal `CURRENT_MAINTENANCE_RECORD` label describes the record's write-time role; the archived copy is not a current production entry point.

Current Aegis production authority remains with the active Aegis contracts and policies, including `aegis-cortex/EVIDENCE_POLICY.md`, together with the current Aegis production artifacts. No current file should be inferred at `aegis-cortex/2026-09-15-daily-maintenance-reconciliation.md`.

The old paths remain recoverable through Git history. Empty archive classes are intentionally left empty rather than populated with unrelated Agent artifacts. This archive is historical storage, not current task or maintenance authority.
