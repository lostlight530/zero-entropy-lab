# Zero-Entropy Lab

> **Bilingual reading guide / 双语阅读指引（2026-11-13）**  
> **中文**：本文件属于可靠状态转换、Agent Runtime 容错与执行证据边界的公开仓库说明；查阅当前 src/kernel、实际测试和修订证据，不把概念名称当成运行能力；历史截止点与执行状态不因本次双语整理而改变  
> **English**: This root document belongs to fault-tolerant state transitions, agent-runtime contracts, and bounded execution evidence; Check current src/kernel, actual tests, and revision-bound evidence rather than inferring runtime capability from names. Historical cutoffs and execution status are not changed by this bilingual documentation update


[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.22791081.svg)](https://doi.org/10.5281/zenodo.22791081)

[Open Research / 开放科研](./OPEN_RESEARCH.md) · [Research Template / 科研模板](./RESEARCH_TEMPLATE.md)

> **"Restraint is the ultimate form of digital violence."**

A standard-library research laboratory for deterministic state, evidence, reliability boundaries, and edge-native execution.

## Status

The Python runtime uses the standard library and keeps generated state reproducible from explicit ledgers.

Zero dependency is an implementation constraint. It is not a claim that inputs, network access, external sources, local state, or generated results are automatically trusted.

## Architecture

1. **Core (`src/kernel/`)**: SQLite-backed memory and deterministic state processing.
2. **Protocol (`src/kernel/protocol/`)**: Local protocol experiments, transition declarations, and lifecycle commands.
3. **Sensory and data inputs (`src/kernel/sensory/`, `data/inputs/`)**: Explicit source profiles, bounded ingestion, and archive handling.
4. **Reasoning (`src/kernel/cognitive/`)**: Graph-based structural analysis and local heuristics.
5. **Portal (`index.html`)**: Independent presentation surface.

## Research and Evidence Surfaces

- [Documentation index](./docs/README.md) — finite navigation for the repository constitution and dated research records.
The repository separates implementation, external-source evidence, local state, and research interpretation.

- [`aegis-cortex/README.md`](./aegis-cortex/README.md) is the durable guide to the Aegis reliability/evidence research surface and separates its long-lived policy from time-scoped A1–A6 artifacts.
- [`aegis-cortex/EVIDENCE_POLICY.md`](./aegis-cortex/EVIDENCE_POLICY.md) defines the current reliability-evidence vocabulary and the boundary between external risk, local preventive records, local incidents, execution evidence, and unresolved state.
- [`data/inputs/ARCHIVE_AND_HARVESTER.md`](./data/inputs/ARCHIVE_AND_HARVESTER.md) defines current snapshot, archive, ledger, cache, and ingestion semantics for repository-owned external inputs.
- [`SECURITY.md`](./SECURITY.md) defines the private security-reporting route and supported disclosure boundary.
- [`RELEASE_POLICY.md`](./RELEASE_POLICY.md), [`CITATION.cff`](./CITATION.cff), and [`codemeta.json`](./codemeta.json) describe the public software publication and citation surface.

Keep these distinctions explicit:

```text
external risk != local incident
transition declaration != transition execution
hash or HMAC result != source truth or authorization
checker success != semantic validation
repository publication != runtime reproduction
archived publication != later main revision
```

### Long-term evidence and stage status / 长期证据与阶段状态

**中文**：`src/kernel/` 是当前可执行实现；本仓的 Ledger、Aegis、Ballast、周期性研究和外部信源记录各有自己的输入、状态与责任边界；阶段展示应标明来源文件、Git revision、运行者及实际运行时点、覆盖窗口、原始／聚合口径和成功／失败／BLOCKED／NOT_EXECUTED 状态；`requirements.txt` 是保留的仓库依赖／工具链契约，不能根据其内容看似为空就擅自删除；状态确定性不等于外部来源可信，也不证明任意任务无失败

**English**: `src/kernel/` is current executable implementation; ledgers, Aegis, Ballast, periodic research and external-source records retain distinct inputs, statuses and owners. Stage views must identify source paths, Git revision, producer and actual run time, coverage, raw/aggregate denominator and PASS/FAILED/BLOCKED/NOT_EXECUTED state. The repository's `requirements.txt` is retained as a tooling/dependency contract, not a file to delete merely because it lists no third-party packages. Determinism does not authenticate external sources or guarantee all tasks succeed

## Verification

```bash
python tests/run_tests.py
```

A passing run is evidence for the tested revision, interpreter, environment, and fixtures. It is not a universal reliability or security proof. Record the exact revision and environment when a result is used as reproducibility evidence.

## Optional Local Server

The server is a local research interface. It is not required for the lifecycle workflow.

Generate an ephemeral API key before starting it:

```bash
export NEXUS_API_KEY="$(python -c 'import secrets; print(secrets.token_urlsafe(32))')"
python src/kernel/protocol/nexus.py serve
```

The default bind address is `127.0.0.1`. API requests fail closed when `NEXUS_API_KEY` is missing.

A non-loopback bind requires explicit operator opt-in. Do not expose the native server directly to the public Internet. Use an authenticated TLS reverse proxy and network-level access controls when remote access is intentionally enabled.

## Security Boundaries

- External documents and API requests remain untrusted inputs.
- Rate limiting is not authentication.
- SHA-256 fingerprints prove content identity, not authorship or authorization.
- Generated graph state must remain reproducible from validated ledgers.
- Local heuristic labels do not establish semantic truth or production guarantees.
- Security reports follow the private process in [SECURITY.md](./SECURITY.md).

## External Synchronization

External documents are synchronized by `src/kernel/sensory/harvester.py` from explicit profiles in `data/inputs/source_profiles.json`.

Historical inputs remain byte-preserved under `data/inputs/archive/legacy-through-2026-07-11-1340`.

See `data/inputs/ARCHIVE_AND_HARVESTER.md` for the archive contract.

## Citation and Publication Identity

The DOI above identifies an archived Zero-Entropy Lab software publication. Use an exact Git revision in addition to the DOI when a result depends on a specific implementation state.

A DOI is a stable publication identifier. It does not by itself establish scientific validity, local incident evidence, execution success, semantic equivalence with later `main`, or independent reproduction.

---
© Zero-Entropy Lab | Built for the Edge, Built for the Future

## Archived checkpoint — 2026-10-14

[v2026.10-fourteen-day-evidence-checkpoint](https://github.com/lostlight530/zero-entropy-lab/releases/tag/v2026.10-fourteen-day-evidence-checkpoint) is archived as [10.5281/zenodo.23365551](https://doi.org/10.5281/zenodo.23365551). For the software-family concept DOI, earlier versions and exact-checkpoint citation, see [Release and Archival Policy](RELEASE_POLICY.md).
