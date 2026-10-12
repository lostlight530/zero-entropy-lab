# Selected Historical Workflow Backups

## Purpose

These files are byte-identical backups of the selected historical GitHub Actions workflow generations recorded by the sibling AGI lineage records
They are stored under `AGI/workflows/backups`, outside `.github/workflows`, so GitHub Actions does not discover or run them
Each backup path points to the same Git blob as the pinned historical source; the source commit remains the canonical historical identity

The backup inventory is selective, not a copy of every workflow commit
It does not validate historical jobs against the current environment or promote an experiment into the active lifecycle

## Version correspondence

### nexus-life-cycle/recovered-2026-03-13

- Historical role: Initial zero-entropy host adaptation of the unified rebuild, ingest, ponder, evolve and persistence lifecycle
- Source commit: [`8d3f27c6440abd3a9eba7d9a1e8717214bdb2dea`](https://github.com/lostlight530/zero-entropy-lab/commit/8d3f27c6440abd3a9eba7d9a1e8717214bdb2dea)
- Historical source: `.github/workflows/nexus-life-cycle.yml`
- AGI lineage record: [`AGI/workflows/nexus-life-cycle/recovered-2026-03-13`](../nexus-life-cycle/recovered-2026-03-13/README.md)
- AGI backup: [`AGI/workflows/backups/nexus-life-cycle/recovered-2026-03-13/nexus-life-cycle.yml`](./nexus-life-cycle/recovered-2026-03-13/nexus-life-cycle.yml)
- Git blob: `102393b79077dd35cbe2de2477bbb365da9f9f70`
- SHA-256: `498b73f078c22fbc55a2ceeeac87d17cb8af6468fb67cc7f6f8d7b44b4534ec8`
- WorkflowHub correspondence: Not separately registered

### nexus-life-cycle/recovered-2026-05-21

- Historical role: First lifecycle generation with an explicit repository test gate before synchronization and persistence
- Source commit: [`0b585a305822a14605a2b8b678a6ff342efe4880`](https://github.com/lostlight530/zero-entropy-lab/commit/0b585a305822a14605a2b8b678a6ff342efe4880)
- Historical source: `.github/workflows/nexus-life-cycle.yml`
- AGI lineage record: [`AGI/workflows/nexus-life-cycle/recovered-2026-05-21`](../nexus-life-cycle/recovered-2026-05-21/README.md)
- AGI backup: [`AGI/workflows/backups/nexus-life-cycle/recovered-2026-05-21/nexus-life-cycle.yml`](./nexus-life-cycle/recovered-2026-05-21/nexus-life-cycle.yml)
- Git blob: `7ea88563664ff70f6dd2d8349264973b122e0e06`
- SHA-256: `1d209e30da928b1c1114794e6414a322ad60fe2066bc06b44625addfd64b1c75`
- WorkflowHub correspondence: [NEXUS V3](https://workflowhub.eu/workflows/2334?version=3)

### nexus-life-cycle/recovered-2026-06-07

- Historical role: First selected lifecycle generation excluding data/*.db from automatic Git persistence
- Source commit: [`e434ff470a4083acc600cc9e6d50ae9953a75d67`](https://github.com/lostlight530/zero-entropy-lab/commit/e434ff470a4083acc600cc9e6d50ae9953a75d67)
- Historical source: `.github/workflows/nexus-life-cycle.yml`
- AGI lineage record: [`AGI/workflows/nexus-life-cycle/recovered-2026-06-07`](../nexus-life-cycle/recovered-2026-06-07/README.md)
- AGI backup: [`AGI/workflows/backups/nexus-life-cycle/recovered-2026-06-07/nexus-life-cycle.yml`](./nexus-life-cycle/recovered-2026-06-07/nexus-life-cycle.yml)
- Git blob: `02859661ab4c8931390d0cca03669624a065d6be`
- SHA-256: `98db14649014341aaadc461af6f679ab2fbbfce7f7caa6c394c3e6014a701bcf`
- WorkflowHub correspondence: [NEXUS V4](https://workflowhub.eu/workflows/2334?version=4)

### nexus-life-cycle/recovered-2026-07-11

- Historical role: Approved external document harvesting with a focused contract gate and removal of pre-checkout archive cleanup
- Source commit: [`df3f2cdae58f2c0d5a34d8604aa69d437e5a1f2a`](https://github.com/lostlight530/zero-entropy-lab/commit/df3f2cdae58f2c0d5a34d8604aa69d437e5a1f2a)
- Historical source: `.github/workflows/nexus-life-cycle.yml`
- AGI lineage record: [`AGI/workflows/nexus-life-cycle/recovered-2026-07-11`](../nexus-life-cycle/recovered-2026-07-11/README.md)
- AGI backup: [`AGI/workflows/backups/nexus-life-cycle/recovered-2026-07-11/nexus-life-cycle.yml`](./nexus-life-cycle/recovered-2026-07-11/nexus-life-cycle.yml)
- Git blob: `dcc5f1907dd59e573b8d0d031e87962a7ab1b95c`
- SHA-256: `750ad03ca08bbc5581a9a704262e4930f2ee1e65c6c59c11e284432f62915b0a`
- WorkflowHub correspondence: [NEXUS V5](https://workflowhub.eu/workflows/2334?version=5)

### nexus-life-cycle/original-2026-10-07

- Historical role: First workflow baseline recorded in the AGI workflow-history surface. This does not claim to be the repository's earliest historical implementation.
- Source commit: [`12287364d5915b4e51a6146996d6d8a95d547c22`](https://github.com/lostlight530/zero-entropy-lab/commit/12287364d5915b4e51a6146996d6d8a95d547c22)
- Historical source: `.github/workflows/nexus-life-cycle.yml`
- AGI lineage record: [`AGI/workflows/nexus-life-cycle/original-2026-10-07`](../nexus-life-cycle/original-2026-10-07/README.md)
- AGI backup: [`AGI/workflows/backups/nexus-life-cycle/original-2026-10-07/nexus-life-cycle.yml`](./nexus-life-cycle/original-2026-10-07/nexus-life-cycle.yml)
- Git blob: `b5c6c276dcabb66cb22ca1d3945beccc3a5146e2`
- SHA-256: `7cb3facd3dbf13deaa537c927d69cc69ccc5e0506b6cc17221bd1801fc4399b3`
- WorkflowHub correspondence: [NEXUS V1 and V2 (same baseline)](https://workflowhub.eu/workflows/2334?version=1)

## Interpretation

WorkflowHub version order is registration order, not chronological order of the historical source commits
For both NEXUS registrations, Versions 1 and 2 refer to the same 2026-10-07 AGI baseline; they are not the earliest historical executable generations
The welcome Brain Evolution record is a separate precursor, not a NEXUS version
For zero-entropy-lab, the frozen WorkflowHub file identifier shown on several versions does not prove that each registry payload is the distinct historical YAML; use the pinned Git commit, blob and this backup to identify the historical executable

## Recovery and experiment boundary

To recover a generation, compare this backup's Git blob and SHA-256 to its pinned source commit, then run repository-specific compatibility checks before executing it
These copies do not modify the active `.github/workflows` files, Actions triggers, Jules tasks or Codex maintenance
Future AGI experiments may be added in separate paths; their presence in AGI alone does not make them active Actions workflows or historical registrations
Older frozen lineage manifests described the state when they were created and are deliberately not rewritten by this later backup addition
