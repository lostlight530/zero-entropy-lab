# Contributing

Contributions are welcome when they improve the current repository while preserving Aegis/Ballast producer identity, state boundaries, evidence discipline, provenance, and historical auditability.

## Before proposing a change

- Start from current merged `main` and the most specific current repository authority before relying on historical snapshots, handoffs, or model memory.
- For repository maintenance, read `governance/README.md` and `governance/independent-gpt/README.md`.
- Keep runtime observation, persisted state, generated artifacts, external source material, execution evidence, and inference distinct.
- Inspect relevant open pull requests and active maintenance branches before writing; use `COORDINATE` when another live change owns the same surface or logical period.
- Never create or mutate a branch merely to test write permission.

## Producer and plane boundaries

```text
Aegis native production != Ballast research
Ballast Daily research production != maintenance/no-change task
Independent GPT != native producer
GitHub Actions != research truth
current path presence != earlier execution
later success != earlier success
correction != history rewrite
```

Private Jules task prompts, repository memory, credentials, hidden reasoning, and unrelated operator context are not reconstructed into public repository files by default. This repository currently has no public `AGENTS.md`.

Ballast Daily/Special/CASE/NOTES artifacts are research evidence, not routine repository-maintenance edit targets. A separately authorized research correction may own one of those artifacts; ordinary maintenance does not silently rewrite it.

## Maintenance outcome

- no confirmed maintenance defect → `NO_CHANGE_REQUIRED`; no activity-only edit, branch, or PR;
- bounded defect with safe ownership → `REPAIR`;
- overlapping live ownership → `COORDINATE`;
- missing authority/current state or unsafe delivery → `BLOCKED`.

## Issues

Use the repository Issue templates:

- **Bug report** for a reproducible defect in current code, state, or repository surfaces.
- **Proposal** for a bounded improvement with explicit non-goals and acceptance criteria.
- **Evidence or governance correction** for a state description, claim, metadata, governance, recovery, producer-identity, maintenance, or provenance mismatch.

Security-sensitive reports belong in the private route described by `SECURITY.md`.

## Pull requests

Use a bounded branch and the pull-request template. A useful PR identifies:

- exact base `main` revision and delivery head;
- owning surface and logical period where relevant;
- overlapping PR/branch state;
- code/state-contract surfaces affected;
- changed and deliberately unchanged boundaries;
- checks actually performed and observed results;
- relevant checks intentionally left unrun as `NOT_EXECUTED`;
- historical/archived-source and producer-identity impact;
- security/privacy impact where applicable;
- a practical rollback.

Before delivery, refresh current `main`, recheck overlap, inspect the aggregate `main...branch` diff, open one Draft PR, and stop for maintainer review unless a different repository-native workflow explicitly applies.

Never report an unrun checker, Ballast check, Aegis check, workflow, or local command as passed. Do not silently rewrite historical execution or archived external evidence to match later knowledge.

Do not push directly to `main`, force-push history, or auto-merge maintenance work.

## Style, conduct, license, and attribution

Follow existing repository conventions. Prefer clear, inspectable, maintainable changes over feature accumulation or decorative complexity. New dependencies or authority surfaces require an explicit reason and boundary.

Third-party archived/referenced material is not automatically repository-owned implementation and retains source provenance/licensing.

Keep discussion professional, specific, evidence-aware, and focused on the repository. Do not publish credentials, private prompts, private information, or sensitive exploit details.

Contributions to repository-owned work are submitted under the current `LICENSE`; third-party material retains its own attribution and licensing.

Contributor credit reflects actual contribution history. `AUTHORS` does not erase Git/PR attribution.

The repository owner retains final doctrine, review, and merge authority.
