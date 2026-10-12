# Workflow Lineage Index

## Scope

This index records selected architecture generations recovered from Git history and points to their later byte-identical AGI backups

The lineage records preserve identity, provenance and recovery evidence; [the backup inventory](backups/README.md) contains the selected historical YAML files

No file under `AGI/workflows` is discovered as a GitHub Actions workflow, because GitHub Actions reads `.github/workflows` instead

The pinned Git commit and repository path remain the canonical historical source

## Selection rule

A historical commit is promoted to a recovered generation only when it marks a material workflow role or execution-contract transition

Routine syntax, checkout, autostash, path and race-condition fixes remain visible in Git history but are not promoted into separate architecture generations

## Reviewed history

The [complete revision inventory](revisions/README.md) records every historical workflow-file change, including ordinary fixes, exact source blob identities, static syntax results and byte-identical AGI backups

The complete path history reviewed on 2026-10-09 contains 21 commits for `.github/workflows/nexus-life-cycle.yml`

The reviewed path history spans 2026-03-13 through 2026-08-31

## Selected generations

1. `nexus-life-cycle/recovered-2026-03-13`
   - Earliest verified repository generation
   - Workflow name: `NEXUS CORTEX Life Cycle`
   - Role: host-specific zero-entropy adaptation of the unified lifecycle

2. `nexus-life-cycle/recovered-2026-05-21`
   - First verified generation with an explicit test gate in the lifecycle
   - Role: lifecycle execution plus repository verification before synchronization and persistence

3. `nexus-life-cycle/recovered-2026-06-07`
   - First selected restricted-persistence generation
   - Role: exclude runtime database files from automatic Git persistence

4. `nexus-life-cycle/recovered-2026-07-11`
   - First selected approved-document harvesting generation
   - Role: approved external document collection, a focused contract test and removal of pre-checkout archive cleanup

5. `nexus-life-cycle/recovered-2026-08-31-deterministic`
   - First selected read-only validation and guarded apply generation
   - Role: deterministic candidate and write-boundary contract

6. `nexus-life-cycle/recovered-2026-08-31-receipt`
   - First selected layered human-receipt generation
   - Role: baseline capture and human-readable validation/apply receipts

7. `nexus-life-cycle/original-2026-10-07`
   - First baseline formally recorded in the AGI workflow-history surface
   - Role: frozen reference to the mature bounded lifecycle

## Lineage

`Initial NEXUS CORTEX 2026-03-13` -> operational hardening -> `verified lifecycle 2026-05-21` -> `restricted persistence 2026-06-07` -> `approved-document harvesting 2026-07-11` -> later Git evolution -> `deterministic guarded lifecycle 2026-08-31` -> `layered human receipt 2026-08-31` -> `AGI original baseline 2026-10-07`

The 2026-10-07 original AGI baseline and the 2026-08-31 receipt generation share the same workflow Git blob; the former is a later capture checkpoint, not a new YAML modification

Intermediate commits remain primary evidence for the transition and are listed in the [complete revision inventory](revisions/README.md)

## Cross-repository origin

The 2026-03-13 generation is a host-specific adaptation of the named NEXUS CORTEX generation introduced in `lostlight530/welcome-to-github` on 2026-03-09

The relationship is lineage evidence, not a claim that the repositories shared identical runtime paths or persistence surfaces

## External registration status

As checked on 2026-10-12, the selected 2026-07-11 generation is registered at [WorkflowHub Version 5](https://workflowhub.eu/workflows/2334?version=5), DOI `10.48546/workflowhub.workflow.2334.5`

Earlier WorkflowHub version comments identify the 2026-05-21 verified generation as [Version 3](https://workflowhub.eu/workflows/2334?version=3) and the 2026-06-07 restricted-persistence generation as [Version 4](https://workflowhub.eu/workflows/2334?version=4)

Versions 1 and 2 are earlier external registrations of the 2026-10-07 baseline and do not change the historical chronology

Registration statements in older frozen manifests record their creation-time state; this index reports the later external registration without rewriting those manifests

A WorkflowHub revision comment is an external identity reference, not a replacement for the canonical Git commit and workflow content hash

## Backup status

The selected-generation backup inventory remains under [`backups`](backups/README.md); the [complete revision inventory](revisions/README.md) preserves every other historical YAML revision without promoting every repair to a new architecture generation

As of 2026-10-12, the selected historical YAML files are also stored under [`AGI/workflows/backups`](backups/README.md), with each backup linked to its source commit, Git blob, SHA-256, description and WorkflowHub registration status

The older frozen manifests truthfully described their creation-time state before these later backups existed; they are not rewritten

Backups and future AGI experiments remain separate from the active `.github/workflows` lifecycle

## Boundary

These records do not alter workflow triggers, permissions, jobs, Actions behavior, task logs, Jules surfaces or Codex maintenance

Publication to WorkflowHub is a separate decision

A recovered generation is not automatically a published version
