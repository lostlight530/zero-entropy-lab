# Release and Archival Policy

> **Bilingual reading guide / 双语阅读指引（2026-11-13）**  
> **中文**：本文件属于可靠状态转换、Agent Runtime 容错与执行证据边界的公开仓库说明；发布版本、归档 DOI、当前 main 和实验结果分别取证；历史截止点与执行状态不因本次双语整理而改变  
> **English**: This root document belongs to fault-tolerant state transitions, agent-runtime contracts, and bounded execution evidence; Release versions, archival DOIs, current main, and experimental results are separate evidentiary objects. Historical cutoffs and execution status are not changed by this bilingual documentation update


This repository treats `main` as the current repository state and release tags as immutable point-in-time snapshots.

## Policy

- Create a release or tag only from a reviewed and merged `main` revision.
- A release records a historical snapshot; it does not override later repository state, governance, contracts, or evidence.
- Release identifiers may be repository-specific. Do not invent a semantic version where the repository has not established one.
- Add `version`, `date-released`, DOI, SWHID, or other archival identifiers to citation metadata only after those identifiers actually exist.
- Do not rewrite historical tags or releases to reflect later corrections; publish a new release or correction record instead.
- Archive externally only after the release snapshot and its metadata have been validated.

For current repository truth, follow the repository's native implementation, evidence, governance, and recovery surfaces rather than citation or archival metadata.

## Initial archived software publication — 2026-09-16

The repository has a public Zenodo software publication dated **2026-09-16**.

- DOI: `10.5281/zenodo.22791081`
- DOI resolver: `https://doi.org/10.5281/zenodo.22791081`
- Code repository: `https://github.com/lostlight530/zero-entropy-lab`

This DOI is an archival publication identifier, not a moving identifier for every later `main` revision. Later repository changes must not be represented as part of the archived publication unless a new archival release explicitly includes them.

A future archived release should preserve this record as point-in-time publication history and use its own confirmed release metadata. DOI presence, citation metadata, or archival availability does not by itself establish runtime execution, scientific validity, or reproduction.

## Verified archived version lineage (2026-10-10)

The September 16 publication described above is the **initial archival snapshot**; it is not the only release now registered under this software concept. The citation/CodeMeta DOI `10.5281/zenodo.22791081` is the **concept DOI**, not the DOI for the latest specific release.

| Archived release | Published/release date | Immutable version DOI |
| --- | --- | --- |
| `v2026.09-open-research-baseline` | 2026-09-16 | [`10.5281/zenodo.22791082`](https://doi.org/10.5281/zenodo.22791082) |
| `v2026.09-natural-month-close` | 2026-09-30 | [`10.5281/zenodo.23068144`](https://doi.org/10.5281/zenodo.23068144) |
| `v2026.10-open-research-production-framework` | 2026-10-04 | [`10.5281/zenodo.23137204`](https://doi.org/10.5281/zenodo.23137204) |

The October GitHub release [`v2026.10-open-research-production-framework`](https://github.com/lostlight530/zero-entropy-lab/releases/tag/v2026.10-open-research-production-framework) reports `published_at=2026-10-04T13:00:14Z`. These identifiers are confirmed public release/DOI records, **not a claim that present `main` was frozen in that snapshot**. The existing `CITATION.cff` September 16 date remains a recorded archival baseline; do not silently rewrite it into a present-day retrieval or publication date. This documentation note creates **no new software release, DOI, prospective observation, or evidence of external research adoption**. The [independent identity audit](https://github.com/lostlight530/research-software-identity-audit) observes ten fixed software objects and remains an external control repository, not an eleventh research sample.

## Archived checkpoint — 2026-10-14

The fourth archived version is [v2026.10-fourteen-day-evidence-checkpoint](https://github.com/lostlight530/zero-entropy-lab/releases/tag/v2026.10-fourteen-day-evidence-checkpoint).

- Version DOI: [10.5281/zenodo.23365551](https://doi.org/10.5281/zenodo.23365551)
- GitHub `published_at`: `2026-10-14T11:16:09Z`
- Tagged source commit: [`f91fff87158dfc4d73cccb43244d39d08d756134`](https://github.com/lostlight530/zero-entropy-lab/tree/f91fff87158dfc4d73cccb43244d39d08d756134)
- Software-family concept DOI: [10.5281/zenodo.22791081](https://doi.org/10.5281/zenodo.22791081)

Use the version DOI for this exact checkpoint and the concept DOI for the software family. `CITATION.cff` and CodeMeta retain the family identifier and recorded September 16 baseline date. Later changes to `main` belong to subsequent repository state; the checkpoint tag remains unchanged.

### 固定软件归档与可演进的可靠性证据 / Fixed releases and evolving reliability evidence

**中文**：`main` 的代码和失败恢复研究可演进，但 Git tag 与 Zenodo version DOI 归档的仍是指定版本；concept DOI `10.5281/zenodo.22791081` 指向软件家族；只有确切来源修订、运行命令、环境、输入、输出和结果比较才能支撑新的复现主张，发布与下载统计不是系统可靠性、外部采用或科研证实

**English**: The implementation and failure-recovery research on `main` evolve, while Git tags and Zenodo version DOIs preserve specific archival snapshots; concept DOI `10.5281/zenodo.22791081` names the software family. A reproducibility claim needs source revision, actual command, environment, inputs, outputs and comparison. Releases and download counts do not measure reliability or independent scientific adoption

## Open-science reuse and research records

- Cite the software family through [CITATION.cff](CITATION.cff) or [CodeMeta](codemeta.json); cite the version DOI above when a result depends on this checkpoint.
- Use the linked tagged source commit for code inspection and retrieval, and record the revision, environment, procedure and observed result when performing a rerun.
- Follow [OPEN_RESEARCH.md](OPEN_RESEARCH.md) and the repository-native research contracts; use [RESEARCH_TEMPLATE.md](RESEARCH_TEMPLATE.md) for a new bounded research record where a more specific native template does not apply.
- Reuse repository-owned material under [LICENSE](LICENSE), preserve [authorship attribution](AUTHORS), and submit changes through [CONTRIBUTING.md](CONTRIBUTING.md).
- Keep later findings and corrections in new dated records so the archived checkpoint remains recoverable.


## Latest archived checkpoint — 2026-11-10

The latest archived repository snapshot is `v2026.11-ten-day-evidence-checkpoint`.

- GitHub Release: [v2026.11-ten-day-evidence-checkpoint](https://github.com/lostlight530/zero-entropy-lab/releases/tag/v2026.11-ten-day-evidence-checkpoint)
- GitHub release published: `2026-11-10T14:40:24Z`
- Tagged source commit: [`fad8bd68ad46319d6ba361ac85522c8b3e4870f6`](https://github.com/lostlight530/zero-entropy-lab/commit/fad8bd68ad46319d6ba361ac85522c8b3e4870f6)
- Zenodo exact-version record: [10.5281/zenodo.24112455](https://doi.org/10.5281/zenodo.24112455)
- Software-family concept DOI: [10.5281/zenodo.22791081](https://doi.org/10.5281/zenodo.22791081)

The Zenodo version record identifies the exact GitHub tag as its source reference. This is an immutable 2026-11-10 snapshot; subsequent changes on `main` are not part of this archive. The concept DOI remains the software-family identifier and is intentionally distinct from the version DOI.
