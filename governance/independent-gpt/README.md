# Independent GPT Governance — Aegis Blackbox

Status: current public recovery kernel  
Calibration: 2026-09-18  
Scope: repository-local maintenance recovery, independent review handoff, reconciliation, and bounded repair

This directory is the public handoff point for a memoryless Independent GPT reviewer. It provides enough structure to recover repository truth from repository-visible evidence without duplicating native producer instructions or exposing private operator context.

## Recovery order

Recover current state from current merged `main` before using historical narrative. For the maintenance subject under review, prefer current implementation and the current subject-specific contract or policy. Apply `../SOURCE_AUTHORITY.md` when source identity, revision, freshness, lineage, claim scope, or conflicting evidence is material. Treat dated maintenance/audit records, handoffs, and prior model recollection as point-in-time or secondary recovery evidence.

At start record current date, default branch, exact `main` SHA, relevant open pull requests, active maintenance branches, recent merged changes, and checks actually executed.

## Repository map

Use only the surfaces needed for the question:

1. `README.md`, current source, data, tests, and public files for the present repository surface when relevant.
2. `governance/SOURCE_AUTHORITY.md` for repository-wide source identity, revision binding, freshness, lineage, claim-support, negative-evidence, and conflict semantics.
3. `aegis-cortex/EVIDENCE_POLICY.md` for Aegis reliability and evidence semantics.
4. Current dated `aegis-cortex/` artifacts for repository-visible Aegis output.
5. `ballast/README.md` and `ballast/METHOD.md` for Ballast research-production semantics; Ballast records/CASES/NOTES remain Ballast evidence, not Aegis evidence.
6. `governance/README.md` for repository-level maintenance/control routing.
7. `.github/workflows/` plus revision-matched observed workflow runs for GitHub Actions evidence.
8. `historical-audits/INDEX.md` for corrections, period audits, closure ledgers, maintenance, and reconciliation history.
9. Git history and open/merged PR chronology when source identity, producer identity, timing, original path, overlap, or historical/current state is disputed.

## Task identity and idempotency

Treat a maintenance run as a tuple of repository, maintenance surface/task, logical period when applicable, producer, exact base revision, and run identity when available.

Before writing:

- confirm fresh `main`;
- inspect overlapping open PRs and active maintenance branches;
- determine the owning maintenance/control file;
- check whether the same logical repair already exists or has merged;
- refresh assumptions if `main` advances materially.

If another live change owns the same maintenance surface or period, use `COORDINATE` instead of a parallel repair. Never write merely to test whether writes are possible.

## Evidence boundaries

Keep producer and source lineage explicit:

- native Aegis output remains native Aegis output;
- GPT Web or other substitute output retains its actual producer identity;
- reopening the same source does not create an independent second source lineage;
- Ballast is not Aegis;
- Ballast Daily research production is not a maintenance/no-change task;
- GitHub Actions proves only the workflow execution actually observed for the referenced revision;
- a workflow definition, path presence, or later success does not prove an earlier run;
- independent governance is a maintenance/review layer, not native task execution.

Do not infer local incidents, host applicability, independent corroboration, network access, deployment health, successful execution, historical occurrence, or valid completion from status prose or file presence alone.

An unrun checker, Ballast checker, workflow, or local command is `NOT_EXECUTED`. Contract inspection is not checker execution.

## History discipline

Historical records are point-in-time evidence. Later evidence may change current interpretation, but it does not rewrite what an earlier run observed.

Preserve failure, degraded, blocked, missing, rejected, negative, partial, unverified, evidence-insufficient, no-conclusion, and unknown states. Archive relocation is not semantic replacement. If a historical runtime/producer fact is not recoverable from repository-visible evidence, keep it `UNKNOWN`.

Use the current owning maintenance/control file for a current maintenance correction when safe. Use a dated historical correction/reconciliation only when the historical artifact itself requires a forward correction or provenance pointer.

## Maintenance outcome

Use one of these states when useful:

- `HEALTHY` — reviewed maintenance surface has no confirmed defect;
- `REPAIR` — a confirmed maintenance defect has a safe bounded repair;
- `COORDINATE` — another live change owns the same surface or period;
- `BLOCKED` — authority, current state, or safe delivery cannot be established.

When no confirmed maintenance defect exists, the action is `NO_CHANGE_REQUIRED`: no activity-only edit, branch, or PR.

If repair is justified, change only the owning current maintenance/control file(s) and direct synchronized projections. Aegis/Ballast research artifacts and unrelated implementation are not default edit targets unless the current owning contract or maintainer explicitly makes them part of the repair.

## Delivery discipline

For a justified repair:

1. branch from exact fresh `main`;
2. make the bounded maintenance/control-plane change;
3. run only available targeted validation and retain the real result;
4. refresh `main` and overlap state before delivery;
5. inspect the aggregate `main...branch` diff;
6. open one Draft PR;
7. stop for maintainer review.

Do not push directly to `main`, force-push history, auto-merge, or claim a checker/CI PASS that was not actually observed.

## Public boundary

This recovery kernel is intentionally repository-bounded. It neither requires nor attempts to reconstruct private Jules task prompts, repository memory, credentials, hidden reasoning, or unrelated orchestration. Repository-visible evidence is sufficient for an independent maintenance decision; unavailable context remains unavailable rather than guessed.

The repository currently has no public `AGENTS.md`; do not infer one from private task controls or prior conversations.

## Handoff minimum

A durable handoff should make it possible to recover:

- base `main` SHA and delivery head;
- maintenance scope and owning files;
- relevant logical period if any;
- overlapping PR/branch state;
- material source identities/revisions and unresolved lineage/freshness questions;
- checks actually run and checks not run;
- confirmed defect or `NO_CHANGE_REQUIRED` basis;
- unresolved items and negative evidence;
- whether Aegis/Ballast producer identity and history were preserved;
- whether the Draft PR is clean against current `main`.

No separate audit artifact is required merely to prove that review happened. Prefer the owning maintenance source plus Draft PR description as the delivery summary.

Final merge and doctrine authority remains with the maintainer.
