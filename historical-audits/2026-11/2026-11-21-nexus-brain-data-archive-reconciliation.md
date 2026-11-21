# 2026-11-21 NEXUS Zero Brain/Data archive reconciliation

> AUDIT_ROLE: forward-only read-only source reconciliation and custody inventory, not Native production, a new A1/A2, or a periodic D14 audit
>
> OBSERVATION_DATE: 2026-11-21, this is a dated snapshot of public GitHub `main`, not a live-state database
>
> REPOSITORY: `lostlight530/zero-entropy-lab`
>
> BASE_MAIN_SHA: `c9fe843374ce5c856d2ddc09f886c5ff1a724daa`
>
> SCOPED_ROOT: `data/`
>
> EXECUTION: GitHub recursive tree and read-only source/contract inspection. No local full Native run, no scheduled apply, no semantic audit of every original external document
>
> PERMISSION: read-only evidence; changes proposed separately in a Draft PR, no human merge approval assumed

## Full tree inventory and exact denominator

The complete recursive Git Tree returned `truncated=false`. Every tracked blob under `data/` was included in the denominator: **1490 blobs, 43522144 total Git blob bytes**. The tree SHA is the pinned Git commit SHA above. This inventory counts the latest tracked tree only, not every historical Git object, GitHub Actions artifact, runner cache, or service-side Job Log.

| Existing owner/area | Tracked blobs | Total blob bytes | Disposition |
| --- | ---: | ---: | --- |
| `inputs/control` | 3 | 297180 | STATE_AND_CONTRACT / KEEP |
| `inputs/current` | 235 | 3891761 | ACTIVE_CUSTODY / KEEP |
| `inputs/archive` | 799 | 33741243 | APPEND_ONLY_SOURCE_ARCHIVE / KEEP |
| `knowledge/active-and-control` | 12 | 2801329 | CANONICAL_HASH_LEDGER / KEEP |
| `knowledge/archive` | 11 | 2274914 | SEALED_LEDGER / KEEP |
| `memories` | 430 | 515717 | DATED_REPORTS / RETAIN_AND_RECONCILE |
| **Total** | **1490** | **43522144** | **NO_UNSUPPORTED_DELETE** |

## Existing archive and source continuity

- Source profiles at pinned main: **39** repository identities. Harvester state contains **235** active document records, matching the **235** tracked `inputs/current/` paths by recorded relative path. No missing current path, no unowned current path, no duplicate state-to-output target, and no missing essential state provenance fields were found in the structural enumeration
- `inputs/archive/` contains **799** sealed source/input records, including **159** legacy-baseline files. This is the documented original Archive owner, not a temporary-cache directory. No `current` and `archive` file shared the same exact Git blob SHA at this observation point
- `knowledge/archive/pre-canonical-2026-07-13/manifest.json` declares **10** sealed ledger files. The Git Tree contains exactly those named JSONL paths and their declared byte sizes, with no unexpected additional JSONL files. SHA-256 and nonempty record counts require an independent original-blob check; the accompanying proposed `tests/test_nexus_archive_custody.py` implements it without rewriting archive bytes
- `knowledge/` active files remain separate from sealed legacy files; only the active canonical JSONL set may be projected, never the legacy archive. Memory reports and source archives are not interchangeable objects

## Dated reports and exact-content repetitions

- `memories/` retains dated NEXUS reports and ongoing mission state. The full Git Tree audit identifies **14** exact-SHA duplicate groups among memory paths, representing **117** additional paths beyond one path per identical blob. These numbers describe byte-identical file content under distinct dated names; they do **not** prove duplicate execution, invalid source records, or eligibility for deletion
- A date-stamped report is not automatically the receipt for a Native, manual audit, or source-harvest execution. A missing date cannot be filled by reusing later graph metrics; raw execution evidence and observation time must remain distinct
- Four historical Markdown-wrapped binary-source records (two JPG and two PDF representations) remain in the sealed inputs archive. They are not selected by the current text-only Harvester contract and must not be silently reintroduced or erased. 117 extra memory paths share exact Git blob IDs with dated counterparts, but date identities are not interchangeable. The Microsoft Agent Framework source returns 404 in this observation window; its existing 60 source records are retained rather than scrubbed. The incoming canonical verl fetch alias is still Draft-only.

## Actions custody and actual cleanup boundary

- `.github/workflows/` is workflow definition, not the report output. Generated tracked reports are under `data/memories/`; source/archive state is under `data/inputs/`; canonical ledgers are under `data/knowledge/`
- `$RUNNER_TEMP` output, uploaded `lifecycle-manifest.json` Artifact, `$GITHUB_STEP_SUMMARY`, and hosted Job Logs are separate storage planes. They are not part of the Git Tree inventory and were not deleted or inspected as a complete historical set
- Untracked `__pycache__`, `.pytest_cache`, `.raw_cache` orphan entries, disposable `*.tmp`, and rebuildable SQLite state are eligible for **conditional** cleanup only when unreferenced and not in use. No such tracked files were found in the scoped main tree; ignored or runner-local files cannot be enumerated from Git Tree
- Input archive, frozen ledger, historical memory reports, control contracts, Aegis/Ballast/Horizon/Parallax Native records, and `AGI/workflows/revisions/` history are not cleanup candidates

## Current read-only disposition and evidence ceiling

| Gate | Outcome / limit |
| --- | --- |
| Full tracked path, type, size, Git blob SHA inventory | `INVENTORIED`, 1490/1490, `main` only |
| Source state-to-current path and required metadata structural coverage | `MATCH`, 235/235 |
| Sealed knowledge manifest path/size inventory | `MATCH`, 10/10 |
| Snapshot source full content validation | `NOT_INDEPENDENTLY_COMPLETED` for entire external corpus |
| Historical archive byte hashes | `CI_VALIDATION_REQUIRED` for new independent test |
| Dated report source execution identity and semantics | `NOT_INDEPENDENTLY_REPLAYED` |
| Direct deletion, forced migration, history rewrite | `NOT_PERFORMED` |
| Main merge, scheduled apply, human approval | `NOT_PERFORMED` |

**NEXT:** Run PR-only read-only tests (including full selected current snapshot verification and the sealed ledger Git-object SHA-256 manifest). If tests pass, leave the historical archives and dated reports untouched and retain the Draft PR for human review. Any report-specific cleanup or movement needs source/producer-level evidence and an explicit forward-only correction, not a new inferred global retention policy.
