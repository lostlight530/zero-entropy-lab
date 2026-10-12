# Complete Historical Workflow Revision Inventory

This inventory records every commit that changed the named workflow paths, including repairs and the Brain Evolution retirement event
It is intentionally more granular than the selected architecture generations in `AGI/workflows/README.md`
The source Git commit remains the historical authority; each YAML backup uses the exact source Git blob

## Verification boundary

- Every executable entry was fetched at its exact source commit and its Git blob matched that commit's workflow file
- SHA-256 was computed over the fetched UTF-8 content
- Static syntax parsing used PyYAML 6.0.3 and does not prove GitHub Actions semantics, present-day dependency compatibility or safe execution
- A linked run is a successful workflow run for the exact head SHA; an empty cell means no qualifying run was found in the current query, not that no run ever existed
- Historical files are inert under AGI; active Actions are discovered only from `.github/workflows`

## Revision events

| # | UTC date | Workflow | Git commit | Change recorded in Git | Syntax | Backup | Exact-commit run |
| ---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | 2026-03-13 | NEXUS CORTEX | [`8d3f27c6440a`](https://github.com/lostlight530/zero-entropy-lab/commit/8d3f27c6440abd3a9eba7d9a1e8717214bdb2dea) |  Initial Core: Zero-Entropy Lab \| Ageless Intelligence | PASS | [YAML](../backups/nexus-life-cycle/recovered-2026-03-13/nexus-life-cycle.yml) | — |
| 2 | 2026-03-13 | NEXUS CORTEX | [`189cfb345ce6`](https://github.com/lostlight530/zero-entropy-lab/commit/189cfb345ce6d15a2bae5311c52b96a4a6d956f9) | feat(ui): add native neural canvas visualization | PASS | [YAML](./snapshots/nexus-life-cycle/2026-03-13-189cfb345ce6/nexus-life-cycle.yml) | — |
| 3 | 2026-03-13 | NEXUS CORTEX | [`b83d42dd06ed`](https://github.com/lostlight530/zero-entropy-lab/commit/b83d42dd06ed770653fa93e4d1df387e902d9c9c) | fix(ci): resolve rebase conflict and checkout errors | PASS | [YAML](./snapshots/nexus-life-cycle/2026-03-13-b83d42dd06ed/nexus-life-cycle.yml) | — |
| 4 | 2026-03-15 | NEXUS CORTEX | [`cde659fa1e4a`](https://github.com/lostlight530/zero-entropy-lab/commit/cde659fa1e4a5f97f03b914ed27b100a71793049) | ci: resolve race condition with git autostash atomic step | PASS | [YAML](./snapshots/nexus-life-cycle/2026-03-15-cde659fa1e4a/nexus-life-cycle.yml) | — |
| 5 | 2026-03-15 | NEXUS CORTEX | [`a46be786c1bd`](https://github.com/lostlight530/zero-entropy-lab/commit/a46be786c1bd4aec0bffd219016976bf0a4382be) | ci: sync autostash dynamically with current branch ref | PASS | [YAML](./snapshots/nexus-life-cycle/2026-03-15-a46be786c1bd/nexus-life-cycle.yml) | — |
| 6 | 2026-04-04 | NEXUS CORTEX | [`f649756a61d7`](https://github.com/lostlight530/zero-entropy-lab/commit/f649756a61d7a20fcb23e8526097773acc27a56c) | 🧬 fix: update nexus path in github action and protocol import [skip ci] | PASS | [YAML](./snapshots/nexus-life-cycle/2026-04-04-f649756a61d7/nexus-life-cycle.yml) | — |
| 7 | 2026-04-07 | NEXUS CORTEX | [`9052e3ca98df`](https://github.com/lostlight530/zero-entropy-lab/commit/9052e3ca98dfa28728cf42bdda9114c5026dba9d) | fix(ci): restore harvester functionality and unblock automated lifecycle | PASS | [YAML](./snapshots/nexus-life-cycle/2026-04-07-9052e3ca98df/nexus-life-cycle.yml) | — |
| 8 | 2026-05-21 | NEXUS CORTEX | [`0b585a305822`](https://github.com/lostlight530/zero-entropy-lab/commit/0b585a305822a14605a2b8b678a6ff342efe4880) | chore: add automated verification tests to workflow | PASS | [YAML](../backups/nexus-life-cycle/recovered-2026-05-21/nexus-life-cycle.yml) | — |
| 9 | 2026-06-07 | NEXUS CORTEX | [`e434ff470a40`](https://github.com/lostlight530/zero-entropy-lab/commit/e434ff470a4083acc600cc9e6d50ae9953a75d67) | fix(workflow): remove data/*.db pattern from git auto commit | PASS | [YAML](../backups/nexus-life-cycle/recovered-2026-06-07/nexus-life-cycle.yml) | — |
| 10 | 2026-07-11 | NEXUS CORTEX | [`df3f2cdae58f`](https://github.com/lostlight530/zero-entropy-lab/commit/df3f2cdae58f2c0d5a34d8604aa69d437e5a1f2a) | archive legacy inputs and separate document harvesting | PASS | [YAML](../backups/nexus-life-cycle/recovered-2026-07-11/nexus-life-cycle.yml) | [run](https://github.com/lostlight530/zero-entropy-lab/actions/runs/29142337330) |
| 11 | 2026-07-11 | NEXUS CORTEX | [`9b77571171fa`](https://github.com/lostlight530/zero-entropy-lab/commit/9b77571171fa67b31e16cc47ae9720f8ab25b876) | harden bot maintenance boundaries | PASS | [YAML](./snapshots/nexus-life-cycle/2026-07-11-9b77571171fa/nexus-life-cycle.yml) | [run](https://github.com/lostlight530/zero-entropy-lab/actions/runs/29142550183) |
| 12 | 2026-07-11 | NEXUS CORTEX | [`9d0be0497029`](https://github.com/lostlight530/zero-entropy-lab/commit/9d0be04970292a9b3a916a21cced25c7314aeea2) | 完善可读摄取与确定性记忆闭环 | PASS | [YAML](./snapshots/nexus-life-cycle/2026-07-11-9d0be0497029/nexus-life-cycle.yml) | — |
| 13 | 2026-07-11 | NEXUS CORTEX | [`e80178d491db`](https://github.com/lostlight530/zero-entropy-lab/commit/e80178d491dbd083c58c5ec093da7894d2deb995) | fix: safely sync generated lifecycle changes | PASS | [YAML](./snapshots/nexus-life-cycle/2026-07-11-e80178d491db/nexus-life-cycle.yml) | [run](https://github.com/lostlight530/zero-entropy-lab/actions/runs/29151048832) |
| 14 | 2026-07-13 | NEXUS CORTEX | [`3797990f2f4c`](https://github.com/lostlight530/zero-entropy-lab/commit/3797990f2f4c360136ef2d4c52273a8628bf1b3f) | fix: canonicalize active knowledge ledger | PASS | [YAML](./snapshots/nexus-life-cycle/2026-07-13-3797990f2f4c/nexus-life-cycle.yml) | — |
| 15 | 2026-07-13 | NEXUS CORTEX | [`fb17aad6e716`](https://github.com/lostlight530/zero-entropy-lab/commit/fb17aad6e716a7af7e2043eda33b5c5d79e51215) | fix: validate canonical ledger after repair | PASS | [YAML](./snapshots/nexus-life-cycle/2026-07-13-fb17aad6e716/nexus-life-cycle.yml) | [run](https://github.com/lostlight530/zero-entropy-lab/actions/runs/29270483287) |
| 16 | 2026-07-17 | NEXUS CORTEX | [`a9a76f2f60c1`](https://github.com/lostlight530/zero-entropy-lab/commit/a9a76f2f60c19b15cdde599df569c1b6c1a4e736) | fix lifecycle retry and preflight | PASS | [YAML](./snapshots/nexus-life-cycle/2026-07-17-a9a76f2f60c1/nexus-life-cycle.yml) | [run](https://github.com/lostlight530/zero-entropy-lab/actions/runs/29585186517) |
| 17 | 2026-07-23 | NEXUS CORTEX | [`04073759bebf`](https://github.com/lostlight530/zero-entropy-lab/commit/04073759bebf538969714271dc9953b6f2aa3f0c) | Harden active-memory lifecycle invariants | PASS | [YAML](./snapshots/nexus-life-cycle/2026-07-23-04073759bebf/nexus-life-cycle.yml) | [run](https://github.com/lostlight530/zero-entropy-lab/actions/runs/29985861443) |
| 18 | 2026-07-23 | NEXUS CORTEX | [`97178ef3cf17`](https://github.com/lostlight530/zero-entropy-lab/commit/97178ef3cf1706746adb2d468a23ed0b9537e8d7) | Allow non-overlapping protected updates | PASS | [YAML](./snapshots/nexus-life-cycle/2026-07-23-97178ef3cf17/nexus-life-cycle.yml) | — |
| 19 | 2026-07-28 | NEXUS CORTEX | [`dcb709f8b89c`](https://github.com/lostlight530/zero-entropy-lab/commit/dcb709f8b89ced04a65d5973f8748d7c5e928ac0) | fix: pin external provenance and fail closed | PASS | [YAML](./snapshots/nexus-life-cycle/2026-07-28-dcb709f8b89c/nexus-life-cycle.yml) | — |
| 20 | 2026-08-31 | NEXUS CORTEX | [`c9a3c5abac07`](https://github.com/lostlight530/zero-entropy-lab/commit/c9a3c5abac0746d0273e363d1a85638846e25430) | actions: make lifecycle deterministic and conflict-safe | PASS | [YAML](./snapshots/nexus-life-cycle/2026-08-31-c9a3c5abac07/nexus-life-cycle.yml) | [run](https://github.com/lostlight530/zero-entropy-lab/actions/runs/33388343682) |
| 21 | 2026-08-31 | NEXUS CORTEX | [`5e87f6fd22b4`](https://github.com/lostlight530/zero-entropy-lab/commit/5e87f6fd22b41b8bba904e39c8e64f078b41261d) | ci(lifecycle): publish layered human receipt | PASS | [YAML](./snapshots/nexus-life-cycle/2026-08-31-5e87f6fd22b4/nexus-life-cycle.yml) | — |

## Interpretation

The welcome-to-github Brain Evolution path has four executable YAML revisions and one removal event on 2026-03-09, when the NEXUS CORTEX workflow path was introduced
The selected 2026-10-07 AGI original baseline is a later capture of the final 2026-08-31 workflow blob, not another workflow-file modification
WorkflowHub registration order is not the historical Git order, and a registry revision comment does not replace a pinned source file
The selected generation records provide architecture descriptions; this inventory preserves every intervening file revision without promoting each repair to a new architecture generation

## Safe use

These backups do not change the current workflow, Jules tasks, Codex maintenance or archived task records
Treat any experiment or replay as a separate candidate and validate its write boundary before execution
