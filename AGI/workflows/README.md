# Workflow Lineage Index

## Scope

This index records selected architecture generations recovered from Git history

It is an identity, provenance and recovery surface only

No file under `AGI/workflows` is an executable GitHub Actions workflow

The canonical executable remains at the recorded Git commit and repository path

## Selection rule

A historical commit is promoted to a recovered generation only when it marks a material workflow role or execution-contract transition

Routine syntax, checkout, autostash, path and race-condition fixes remain visible in Git history but are not promoted into separate architecture generations

## Reviewed history

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

3. `nexus-life-cycle/recovered-2026-07-11`
   - First selected approved-document harvesting generation
   - Role: approved external document collection, a focused contract test and removal of pre-checkout archive cleanup

4. `nexus-life-cycle/original-2026-10-07`
   - First baseline formally recorded in the AGI workflow-history surface
   - Role: frozen reference to the mature bounded lifecycle

## Lineage

`Initial NEXUS CORTEX 2026-03-13` -> operational hardening -> `verified lifecycle 2026-05-21` -> later Git evolution -> `approved-document harvesting 2026-07-11` -> later Git evolution -> `AGI original baseline 2026-10-07`

Intermediate commits remain primary evidence for the transition and are listed in each recovered record

## Cross-repository origin

The 2026-03-13 generation is a host-specific adaptation of the named NEXUS CORTEX generation introduced in `lostlight530/welcome-to-github` on 2026-03-09

The relationship is lineage evidence, not a claim that the repositories shared identical runtime paths or persistence surfaces

## External registration status

As checked on 2026-10-12, the selected 2026-07-11 generation is registered at [WorkflowHub Version 5](https://workflowhub.eu/workflows/2334?version=5), DOI `10.48546/workflowhub.workflow.2334.5`

Earlier WorkflowHub version comments also identify the 2026-05-21 verified generation and the 2026-06-07 restricted-persistence generation; those historical Git commits are not changed by this index update

Registration statements in older frozen manifests record their creation-time state; this index reports the later external registration without rewriting those manifests

A WorkflowHub revision comment is an external identity reference, not a replacement for the canonical Git commit and workflow content hash

## Boundary

These records do not alter workflow triggers, permissions, jobs, Actions behavior, task logs, Jules surfaces or Codex maintenance

Publication to WorkflowHub is a separate decision

A recovered generation is not automatically a published version
