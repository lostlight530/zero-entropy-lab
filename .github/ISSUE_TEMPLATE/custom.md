---
name: Evidence, maintenance, or governance correction
about: Correct a repository claim, state description, metadata surface, maintenance/control rule, producer identity, recovery pointer, or governance boundary
title: "[Governance] "
labels: ""
assignees: ""
---

## Owning surface
Identify the Aegis policy/artifact, Ballast maintenance/correction surface, repository governance rule, metadata field, or recovery pointer that owns the issue.

## Current repository fact
Cite current `main` revision and distinguish current state, generated state, historical evidence, and archived external material.

## Evidence and producer identity
Separate Aegis evidence, Ballast evidence, runner/checker evidence, external support, inference, and unknown state. Preserve actual producer identity.

## Historical / prior interpretation
State the prior value only when material. Do not rewrite history to make later knowledge appear earlier.

## Concurrency
List overlapping open PRs / active maintenance branches for the same surface or logical period. Use `COORDINATE` when another live change owns the repair.

## Proposed bounded correction
Identify the owning file(s) and direct synchronized projections. Do not manufacture unrelated architecture/cadence cleanup, research backfill, or activity-only edits.

## Verification
List checks actually executed and observed results. Mark relevant unrun checks `NOT_EXECUTED`; document inspection is not Aegis/Ballast checker execution.

## Privacy / Jules boundary
Do not paste private Jules prompts, repository memory, hidden reasoning, credentials, or unrelated operator context into this issue.

## Review and rollback
State explicit non-goals, unresolved evidence, and the smallest safe rollback. Final doctrine and merge authority remains with the maintainer.
