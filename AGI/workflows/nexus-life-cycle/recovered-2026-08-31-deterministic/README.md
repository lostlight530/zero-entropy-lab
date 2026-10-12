# Deterministic Guarded Lifecycle — 2026-08-31
## Historical identity
- Repository: `lostlight530/zero-entropy-lab`
- Source commit: [`c9a3c5abac0746d0273e363d1a85638846e25430`](https://github.com/lostlight530/zero-entropy-lab/commit/c9a3c5abac0746d0273e363d1a85638846e25430)
- Source time: `2026-08-31T11:42:10Z`
- Canonical historical path: `.github/workflows/nexus-life-cycle.yml`
- Git blob: `437a07268f4deea89a0575f89af2f0c8de7b9aff`
- Content SHA-256: `e13cf7782db4a9b02576c4923462236ad04ebb512337a9a5d9908a564f29432b`
- Byte-identical AGI backup: [`AGI/workflows/revisions/snapshots/nexus-life-cycle/2026-08-31-c9a3c5abac07/nexus-life-cycle.yml`](../../revisions/snapshots/nexus-life-cycle/2026-08-31-c9a3c5abac07/nexus-life-cycle.yml)
## Architecture transition
Split the lifecycle into read-only validation and a main-only scheduled or explicitly approved apply path, with pinned actions, hash-chain verification, world-line comparison, write-boundary checks and stable meaningful commits
This is a material execution-contract change from a single write-capable lifecycle to a read-only validation job plus a guarded apply job
Previous selected AGI generation: `AGI/workflows/nexus-life-cycle/recovered-2026-07-11`
## Verification evidence
- Exact source commit workflow YAML passed static PyYAML syntax parsing and its AGI backup reuses the same Git blob
- A [NEXUS Actions run](https://github.com/lostlight530/zero-entropy-lab/actions/runs/33388343682) at this exact source commit completed successfully
- Static parsing and historical runs do not establish present-day compatibility for replay
## Boundary
This AGI record and backup do not change `.github/workflows`, GitHub Actions triggers, Jules tasks or Codex maintenance
A replay or experimental successor needs its own safety validation and explicit execution decision