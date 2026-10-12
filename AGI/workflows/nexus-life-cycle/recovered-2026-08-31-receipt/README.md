# Layered Human Receipt — 2026-08-31
## Historical identity
- Repository: `lostlight530/zero-entropy-lab`
- Source commit: [`5e87f6fd22b41b8bba904e39c8e64f078b41261d`](https://github.com/lostlight530/zero-entropy-lab/commit/5e87f6fd22b41b8bba904e39c8e64f078b41261d)
- Source time: `2026-08-31T12:54:53Z`
- Canonical historical path: `.github/workflows/nexus-life-cycle.yml`
- Git blob: `b5c6c276dcabb66cb22ca1d3945beccc3a5146e2`
- Content SHA-256: `7cb3facd3dbf13deaa537c927d69cc69ccc5e0506b6cc17221bd1801fc4399b3`
- Byte-identical AGI backup: [`AGI/workflows/revisions/snapshots/nexus-life-cycle/2026-08-31-5e87f6fd22b4/nexus-life-cycle.yml`](../../revisions/snapshots/nexus-life-cycle/2026-08-31-5e87f6fd22b4/nexus-life-cycle.yml)
## Architecture transition
Added human baseline capture and always-published lifecycle receipts to both validation and apply jobs, while preserving the guarded apply and hash-chain architecture
This is the next selected generation after the deterministic split, not a new active workflow path
Previous selected AGI generation: `AGI/workflows/nexus-life-cycle/recovered-2026-08-31-deterministic`
The later 2026-10-07 AGI original baseline captures this same workflow Git blob; it is a later identity checkpoint, not another YAML revision
## Verification evidence
- Exact source commit workflow YAML passed static PyYAML syntax parsing and its AGI backup reuses the same Git blob
- No successful NEXUS run at this exact commit was identified by the current head-SHA query; this is not proof that none existed
- A [later scheduled run](https://github.com/lostlight530/zero-entropy-lab/actions/runs/38189382587) with the same workflow Git blob completed validation and guarded apply successfully on 2026-10-12; later code and data may differ
- Static parsing and historical runs do not establish present-day compatibility for replay
## Boundary
This AGI record and backup do not change `.github/workflows`, GitHub Actions triggers, Jules tasks or Codex maintenance
A replay or experimental successor needs its own safety validation and explicit execution decision