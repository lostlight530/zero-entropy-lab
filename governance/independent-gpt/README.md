# Independent GPT Governance — Aegis Blackbox

Status: current public recovery kernel  
Calibration: 2026-09-17  
Scope: repository-local maintenance recovery, independent review handoff, reconciliation, and bounded repair

This directory is the public handoff point for a memoryless Independent GPT reviewer. It provides enough structure to recover repository truth from repository-visible evidence without duplicating native producer instructions or exposing private operator context.

## Recovery order

Recover current state from current merged `main` before using historical narrative. For the maintenance subject under review, prefer current implementation and the current subject-specific contract or policy. Treat dated maintenance/audit records, handoffs, and prior model recollection as point-in-time or secondary recovery evidence.

At start record current date, default branch, exact `main` SHA, relevant open pull requests, active maintenance branches, recent merged changes, and checks actually executed.

## Repository map

Use only the surfaces needed for the question:

1. `README.md`, current source, data, tests, and public files for the present repository surface when relevant.
2. `aegis-cortex/EVIDENCE_POLICY.md` for Aegis reliability and evidence semantics.
3. Current dated `aegis-cortex/` artifacts for repository-visible Aegis output.
4. `ballast/README.md` and `ballast/METHOD.md` for Ballast research-production semantics; Ballast records/CASES/NOTES remain Ballast evidence, not Aegis evidence.
5. `governance/README.md` for repository-level maintenance/control routing.
6. `.github/workflows/` plus revision-matched observed workflow runs for GitHub Actions evidence.
7. `historical-audits/INDEX.md` for corrections, period audits, closure ledgers, maintenance, and reconciliation history.
8. Git history and open/merged PR chronology when source identity, producer identity, timing, original path, overlap, or historical/current state is disputed.

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

## Public-release privacy preflight — 2026-10-26

This is a publication-safety procedure for Independent GPT maintenance handoffs, not a new research producer, runtime gate, or permission to disclose private control text.

1. **Allowlist:** publish only repository-visible task/cadence identity, Git refs, non-sensitive file scope, scoped findings, bounded validation results, risks, rollback, conflicts, and explicit unknowns. A public rule may state the boundary without reproducing the private instruction behind it.
2. **Inspect outgoing surfaces before publication:** check the complete `main...branch` diff and proposed PR title/body/comments, linked issues, generated reports/attachments and quoted Action logs for sensitive content. Review incoming third-party snippets before propagating them. Searching for terms such as `private memory` is only a lead, not proof of disclosure; a passing pattern scan is not a clean-history certificate.
3. **Withhold private material:** never copy credentials, tokens, session values, private prompts, private agent memory, hidden reasoning, personal or private operator details, nonpublic URLs, or off-repository confidential SOP/source text. Do not include suspect values, reversible redactions, or secret-derived fingerprints in public diagnosis, tests, screenshots or receipts.
4. **Fail closed:** if identity or publication authorization is uncertain, stop the affected write/PR/log publication; report `PUBLICATION_BLOCKED_PRIVATE_MATERIAL` using category and affected public-surface type only, with no value or private-text excerpt. Coordinate privately with the authorized maintainer; a missing or unexecuted check remains `NOT_EXECUTED`.
5. **If exposure is confirmed:** do not assume a later edit or PR close removes Git history, caches, forks or logs. Escalate privately, contain distribution, revoke/rotate affected credentials where applicable, and arrange platform-appropriate remediation with the maintainer. Preserve only non-sensitive incident/correction evidence, not the exposed payload.

This preflight does not establish that all repository history was scanned, any secret was found, or a private scheduler was shut down. Historical producer provenance and sealed research/maintenance artifacts retain their original identity.

## Handoff minimum

A durable handoff should make it possible to recover:

- base `main` SHA and delivery head;
- maintenance scope and owning files;
- relevant logical period if any;
- overlapping PR/branch state;
- checks actually run and checks not run;
- confirmed defect or `NO_CHANGE_REQUIRED` basis;
- unresolved items and negative evidence;
- whether Aegis/Ballast producer identity and history were preserved;
- whether the Draft PR is clean against current `main`.

No separate audit artifact is required merely to prove that review happened. Prefer the owning maintenance source plus Draft PR description as the delivery summary.

Final merge and doctrine authority remains with the maintainer.

## 2026-11-11 scoped independent A1/A2 acceptance clarification

This public recovery note records an evidence-based interpretation correction for the Nov01–11, 2026 window. See [dated original-PR reconciliation](../../historical-audits/2026-11/2026-11-11-a1a2-effective-pr-acceptance-reconciliation.md). It does not amend native production authority, retroactively modify PRs, or replace the independent periodic audit.

- Independent A1 = complete applicable MonthStart..N−1 source/artifact coverage, evidence inspection and per-file disposition, not merely a yesterday note.
- Independent A2 = complete MonthStart..N relationship/current-state version, starting only after its original A1 is merged and freshly reread from main.
- Real, non-duplicated custody rows, source identity, exact SHA/path references, per-file decisions, NO_FOLLOW_UP with examined basis, provenance deltas, relationship revisions, negative evidence and correction records are valid maintenance content.
- An effective 100-line PR does **not** require 100 distinct novel scientific claims, 100 independent external issuers or invented daily changes.
- GitHub original PR additions >=100 remains a separate hard numeric check; count at its own final merged head, never across successors, cleanup, other PRs or repositories.
- Do not count boilerplate, filler, repeated text inserted only to inflate additions, fake checks or unsupported scientific assertions as effective content.
- Review task coverage, semantic quality, Git merge, native production state, actual execution checks and current main retention as distinct evidence dimensions.
- Early Draft NOT_MET may describe an earlier head; after same-original-PR supplementation inspect final diff and record final-head assessment without erasing the Draft event.
- A numerically short original can still be a real merged maintenance delivery; preserve NUMERIC_NOT_MET while stating the actual completed scope accurately.
- Actual BLOCKED/PARTIAL/UNKNOWN native gaps remain unresolved unless direct native/runner evidence shows otherwise; maintenance never invents host execution.
- D7/D10/D14/D30 are separate periodic audits; source-level A1/A2 cannot falsely claim these checks or Human Review.
- November is OPEN at the 2026-11-11 evidence cut; W45 closed, W46 open; do not make period-final claims before due.
- This repository's original Nov02–11 ledger contains 20 merged original PRs, 13 with >=100 additions and 7 numeric NOT_MET; substantive acceptance is not inferred solely from these numbers.
