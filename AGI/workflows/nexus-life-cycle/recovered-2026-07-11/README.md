# NEXUS CORTEX Recovered Approved Document Harvesting Generation

## Identity

This record preserves a selected 2026-07-11 execution-contract transition in this repository

- Repository: `lostlight530/zero-entropy-lab`
- Source commit: `df3f2cdae58f2c0d5a34d8604aa69d437e5a1f2a`
- Source commit time: `2026-07-11T05:26:03Z`
- Historical workflow path: `.github/workflows/nexus-life-cycle.yml`
- Workflow name: `NEXUS CORTEX Life Cycle`
- Workflow blob: `dcc5f1907dd59e573b8d0d031e87962a7ab1b95c`
- Content SHA-256: `750ad03ca08bbc5581a9a704262e4930f2ee1e65c6c59c11e284432f62915b0a`
- Source line count: `65`

## Architecture transition

This generation introduced approved external document harvesting between memory rebuilding and self-ingestion, with a focused harvester contract test before ingestion

It removed the pre-checkout cleanup of historical inputs and archive paths, and expanded push-path selection to the workflow, active inputs, source and tests

The canonical executable remains in Git history; this record does not copy or re-run it

## Predecessor and intervening history

The previous selected AGI generation is `AGI/workflows/nexus-life-cycle/recovered-2026-06-07`

The 2026-05-21 explicitly verified generation is a separate earlier AGI record; intervening operational commits remain primary Git history

## Historical execution evidence

The [GitHub Actions run](https://github.com/lostlight530/zero-entropy-lab/actions/runs/29142337330) for the source commit completed successfully

Its harvesting and harvester-contract steps both concluded successfully

This is evidence about that historical run, not a claim that the historical workflow meets current safeguards or remains executable in today's environment

## External registration

WorkflowHub identifies this selected historical generation as [Version 5](https://workflowhub.eu/workflows/2334?version=5), DOI `10.48546/workflowhub.workflow.2334.5`

The registry version comment points to the historical source commit; the Git commit and verified blob and content hashes remain the executable recovery evidence

## Recovery contract

Resolve the source commit, read the historical workflow path and verify both the Git blob and SHA-256 values

The executable is recovered from Git history only

No executable copy is stored under AGI

## Boundary

This record is read-only metadata

It does not alter the active workflow, run historical jobs, modify archived inputs or claim present compatibility

WorkflowHub registration does not alter the active GitHub Actions workflow
