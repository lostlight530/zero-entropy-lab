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


## Successor maintenance records

- `05-maintenance-and-reconciliation/2026-09-19--sep-19--maintenance-reconciliation.md` — 2026-09-19 live Jules dependency-visibility and optimistic-lock reconciliation

As of 2026-09-19 this is the latest completed independent maintenance record preserved in the archive. Current Aegis contracts and current repository evidence remain higher authority than this historical maintenance record.

## October 28 derived governance records — classification without relocation (2026-11-19)

These two retained records are **derived independent governance material**, not new Native, independent A1/A2, or D7/D10/D14/D30 task executions. Their historical bodies and Git blob identities must remain unchanged.

| Retained path | Semantic archive class | Classification rationale |
| --- | --- | --- |
| `2026-10/2026-10-28-sop-minimal-acceptance-audit.md` | `03-stage-and-period-audits/` | Post-merge, as-of SOP acceptance audit; it evaluates existing evidence and does not execute original tasks |
| `2026-10/2026-10-28-october-native-weekly-gap-recovery-register.md` | `05-maintenance-and-reconciliation/` | Retrospective native-weekly gap and recovery registration; it is not an original weekly producer run |

**Path-preserving correction:** These files remain at their dated locations instead of being renamed or moved, because historical references may depend on the exact paths and blob identities. The class names above are navigation labels, not claims that new files exist under the class directories. Do not mutate A1/A2 source inventories, D-task records, original PRs, or any file outside `historical-audits/` to implement this navigation note.

## 2026-11-20 source/provenance document-audit correction

- [Aegis/Ballast A1/A2 source-role review](02-document-audits/2026-11-20--a1-a2-source-and-provenance--document-audit.md) — separate independent review; source-row role fixes are in current canonical A1/A2, original history retained

## 2026-11-24 retained archive navigation additions

These existing records were not explicitly linked by path in the preceding index. This is a navigation supplement, not a new audit, a new producer run, or a reclassification. The directory column reports the retained physical location; original record content and provenance govern interpretation. Path-sensitive references and legacy locations remain intact. Existing same-blob aliases are not additional evidence.

| Retained record | Existing directory | Blob at inspected main |
| --- | --- | --- |
| [2026-10-01--external-review-source-scope--correction.md](01-corrections-and-errata/2026-10-01--external-review-source-scope--correction.md) | `01-corrections-and-errata/` | `c6fe47d250b572209162234c27f7705893cb7144` |
| [2026-10-28-a1-a2-tree-oid-erratum.md](01-corrections-and-errata/2026-10-28-a1-a2-tree-oid-erratum.md) | `01-corrections-and-errata/` | `3c9b3b6bf4ca6b2953f8c52da8cb88a919f13042` |
| [2026-10-28-aegis-oct27-dependency-gap-followon.md](01-corrections-and-errata/2026-10-28-aegis-oct27-dependency-gap-followon.md) | `01-corrections-and-errata/` | `59168f2fc7c326cae72743e84824891f31231f5c` |
| [2026-10-31--aegis-a2-typed-risk-fields--post-merge-erratum.md](01-corrections-and-errata/2026-10-31--aegis-a2-typed-risk-fields--post-merge-erratum.md) | `01-corrections-and-errata/` | `c703c03e0087d4ab3781418eb91a5d190b427f8b` |
| [2026-11-01--a2-successor-retention-and-acceptance--reconciliation.md](01-corrections-and-errata/2026-11-01--a2-successor-retention-and-acceptance--reconciliation.md) | `01-corrections-and-errata/` | `50a5a0291afe50065595e852ac33e88f74bdf984` |
| [2026-07-31--july--archive-manifest.md](04-evidence-and-closure-ledgers/2026-07-31--july--archive-manifest.md) | `04-evidence-and-closure-ledgers/` | `e351632145da2569d11c6938b28f8a79c472bf4f` |

## 2026-11-25 cloud acceptance navigation

Dated documentary review at [inspected main](https://github.com/lostlight530/zero-entropy-lab/commit/86520092461ab2006ede3fb43deadce55d3df402); navigation only, not a new original A1/A2, Native, or D-task submission. The historical archive classes above remain unchanged. Original task owners are linked, not relocated or reclassified.

| Identity | Original GitHub delivery | Cloud evidence / disposition |
| --- | --- | --- |
| Independent A1 (Nov 1–24) | [#939](https://github.com/lostlight530/zero-entropy-lab/pull/939), 236 additions, merged | [canonical file](https://github.com/lostlight530/zero-entropy-lab/blob/86520092461ab2006ede3fb43deadce55d3df402/historical-audits/2026-11/2026-11-25-a1-source-content-review.md) retained; numeric gate met; 212/213 listed source SHA rows match the later inspected main (cutoff/shared-owner changes are not automatically errors) |
| Independent A2 (Nov 1–25) | [#940](https://github.com/lostlight530/zero-entropy-lab/pull/940), 274 additions, merged | [canonical file](https://github.com/lostlight530/zero-entropy-lab/blob/86520092461ab2006ede3fb43deadce55d3df402/historical-audits/2026-11/2026-11-25-a2-month-relations.md) retained; numeric gate met; 222/222 listed first source SHA rows match inspected main; PR base is the original A1 merge and creation follows that merge |
| Oct 31 original A2 | [#766](https://github.com/lostlight530/zero-entropy-lab/pull/766), 86 additions, merged | Original numeric gate NOT_MET; delivery and numeric acceptance remain separate |
| Oct 31 successor | [#768](https://github.com/lostlight530/zero-entropy-lab/pull/768), 250 additions, merged | Successor numeric gate MET; no retroactive credit to original A2 |
| Oct 31 cleanup | [#770](https://github.com/lostlight530/zero-entropy-lab/pull/770), merged | Separate cleanup, not original task or successor credit |
| Nov 1 forward reconciliation | [#776](https://github.com/lostlight530/zero-entropy-lab/pull/776), merged | [Retained correction](01-corrections-and-errata/2026-11-01--a2-successor-retention-and-acceptance--reconciliation.md); correction class, not a new original A2 |

Native evidence: Aegis Native A1/A2 [#937](https://github.com/lostlight530/zero-entropy-lab/pull/937)/[#938](https://github.com/lostlight530/zero-entropy-lab/pull/938); Ballast [#934](https://github.com/lostlight530/zero-entropy-lab/pull/934)/[#935](https://github.com/lostlight530/zero-entropy-lab/pull/935). The original independent A1 #939 already corrected the Nov 5 probe count (15/15, distinct from Nov 25); its 236 additions include that one-line correction. Synthetic execution does not establish external effect authority.

D7/D10/D14 retain their separate original identities; D14 is an as-of partial observation, not a full-day closure. D30 is not due at this observation. November remains open. Cloud delivery, numeric acceptance, dependency and retention are confirmed at the inspected revision; source-row custody does not by itself establish full semantic validity or a new runtime execution. Existing archive aliases are navigation only, not additional evidence or task credit.
