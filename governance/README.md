# Governance Map — Aegis

Calibration: 2026-09-17

This directory is the repository-level maintenance/control-plane router for Zero Entropy Lab. It does not replace Aegis production artifacts, Ballast research, repository code/data, or historical evidence.

## Current routing

- `../aegis-cortex/EVIDENCE_POLICY.md` — current Aegis evidence and interpretation boundaries.
- `../aegis-cortex/` — native Aegis production artifacts; producer identity and task-time state remain attached to each record.
- `../ballast/` — Ballast's own action-integrity research system and declared audit/correction/maintenance surfaces; not Aegis execution evidence by default.
- `../.github/workflows/` — GitHub Actions definitions. Observed runs are revision-bound runner/deployment/lifecycle evidence only; a workflow definition is not an observed run and no workflow result is research truth by itself.
- `../historical-audits/INDEX.md` — retained corrections, period audits, closure/evidence accounting, maintenance, and reconciliation history.
- `independent-gpt/README.md` — public cold-start recovery and bounded maintenance-delivery kernel for a memoryless Independent GPT reviewer.

## Authority and history

Recover the current subject from current merged `main` and the most specific active repository contract or implementation surface. Historical audits, dated maintenance records, prior handoffs, and model recollection remain point-in-time or secondary recovery material.

```text
current merged main / current repository truth
> current subject-specific policy / implementation
> observed revision-bound execution evidence
> current maintenance / governance contract
> current explanatory / projection surfaces
> historical maintenance / reconciliation evidence
> prior handoff / model recollection
```

This map is a router only. It does not promote a newer governance note above a stronger current subject authority.

## Maintenance identity and concurrency

A maintenance run is identified by repository, maintenance surface/task, logical period when applicable, producer, exact base `main` revision, and run identity when available.

Before any write:

1. refresh current `main`;
2. inspect open pull requests and active maintenance branches for overlapping ownership;
3. identify the owning maintenance/control file and direct synchronized projections;
4. check whether the same logical repair already exists or has merged;
5. refresh assumptions if `main` advances materially.

Overlapping live ownership uses `COORDINATE` rather than a parallel repair. Never create or mutate a branch merely to test write permission.

## Plane separation

```text
Aegis native production != Ballast research
Ballast Daily research production != maintenance/no-change task
Aegis / Ballast != GitHub Actions
GitHub Actions != research truth
Independent GPT != native producer
source repetition != independent corroboration
historical audit != current state
current path presence != earlier execution
later success != earlier success
correction != history rewrite
public governance != private task prompt or private memory
```

Ballast Daily/Special/CASE/NOTES artifacts are research evidence for Ballast's own state. They are not default repository-maintenance edit targets. Maintenance/correction changes should use the current owning maintenance/control surface and preserve point-in-time research history unless a separately authorized research correction explicitly owns that artifact.

## Maintenance decision and delivery

For repository maintenance:

- no confirmed maintenance defect or drift → `NO_CHANGE_REQUIRED`; no activity-only edit/branch/PR;
- confirmed bounded defect → `REPAIR`;
- overlapping live ownership → `COORDINATE`;
- missing authority/current state or unsafe delivery → `BLOCKED`.

A justified repair starts from exact fresh `main`, changes the owning maintenance/control file(s), records only validation actually executed, marks unrun checks `NOT_EXECUTED`, refreshes `main`/overlap, inspects the aggregate diff, opens one Draft PR, and stops for maintainer review.

Do not push directly to `main`, force-push history, auto-merge, or claim checker/CI PASS without observed execution.

Independent governance may inspect, reconcile, and prepare bounded corrections from repository-visible evidence. It must not reconstruct unavailable private control text or silently rewrite historical artifacts.

Final doctrine and merge authority remains with the maintainer.
