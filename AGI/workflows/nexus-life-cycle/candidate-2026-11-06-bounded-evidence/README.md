# Bounded Active Source Evidence — 2026-11-06

## Candidate identity

- Repository: `lostlight530/zero-entropy-lab`
- Source commit: [`5b360ed531812107cdd8fc1d26c808dcb393a4b8`](https://github.com/lostlight530/zero-entropy-lab/commit/5b360ed531812107cdd8fc1d26c808dcb393a4b8)
- Canonical source: `.github/workflows/nexus-life-cycle.yml`
- Git blob: `30bea759d044dc0c834fcd0dd155dcb311c0e61b`
- Content SHA-256: `9db5b1b0961ff60bb3625ffd6ebd15d6b070ac4f4a7ce820a5135eb2b16130b2`
- Byte-identical inert AGI backup: [workflow YAML](../../backups/nexus-life-cycle/candidate-2026-11-06-bounded-evidence/nexus-life-cycle.yml)

## Architecture transition

This candidate adds a fail-closed active-source evidence boundary after harvesting and before projection

The harvester accepts approved text source types only, rejects invalid UTF-8 and NUL bytes, converts oversized active snapshots to bounded pinned references and archives the replaced full snapshot before writing the bounded current representation

The native `validate` and conditional `apply` jobs remain separate, and only the native workflow under `.github/workflows` can receive repository permissions

## 2026-08-31 through 2026-11-06 migration boundary

- Main-state documents observed before this candidate: `236`
- Oversized current snapshots observed above 65,536 bytes: `14`
- Binary source paths observed in active state: `2`
- Migration status at capture: `NOT_EXECUTED_REQUIRES_MERGED_AUTHORIZED_APPLY`
- Existing archive content is never edited or re-ingested
- The next authorized native apply must archive replaced current files first, update active state, verify provenance and content hashes, rebuild the active graph and pass the final write boundary

## Verification boundary

The candidate workflow copy is inert under `AGI/**`

Successful pull-request validation proves repository tests and read-only contracts for the candidate commit, not a production migration, external WorkflowHub publication or successful native apply

WorkflowHub #2334 and all frozen historical generations remain unchanged
