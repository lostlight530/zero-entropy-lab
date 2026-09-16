# Contributing

Contributions are welcome when they improve the current repository while preserving Aegis/Nexus state boundaries, evidence discipline, provenance, and historical auditability.

## Before proposing a change

- Start from the current `main` revision and read the relevant current repository documents before relying on historical snapshots or archived source material.
- Keep runtime observation, persisted state, generated artifacts, external source material, and inference distinct.
- Prefer a small, reviewable change with explicit compatibility and rollback.
- Do not bundle unrelated architecture, cadence, metadata, or archive cleanup into one pull request.

## Issues

Use the repository Issue templates:

- **Bug report** for a reproducible defect in current code, state, or repository surfaces.
- **Proposal** for a bounded improvement with explicit non-goals and acceptance criteria.
- **Evidence or governance correction** for a state description, claim, metadata, governance, recovery, or provenance mismatch.

Security-sensitive reports belong in the private route described by `SECURITY.md`, not in a public issue.

## Pull requests

Use a feature branch and the pull-request template. A useful PR identifies:

- the base revision and exact scope
- code/state-contract surfaces affected
- evidence and provenance boundaries
- checks actually performed and their results
- relevant checks intentionally left unrun
- historical and archived-source impact
- security/privacy impact where applicable
- a practical rollback

Never report an unrun check as passed. Do not silently rewrite historical execution or archived external evidence to match later knowledge; use a forward correction or reconciliation where the original record must remain auditable.

## Style and scope

Follow existing repository conventions. Prefer clear, inspectable, maintainable changes over feature accumulation or decorative complexity. New dependencies or authority surfaces require an explicit reason and boundary.

Third-party archived or referenced material is not automatically part of the repository-owned implementation surface and must retain its source provenance and licensing.

## Conduct

Keep discussion professional, specific, evidence-aware, and focused on the repository. Do not publish credentials, private information, or sensitive exploit details.

## License and attribution

Contributions to repository-owned work are submitted under the repository's current `LICENSE`. Third-party material retains its own attribution and licensing where applicable.

Contributor credit should reflect actual contribution history. `AUTHORS` identifies the primary author/maintainer and does not erase Git commit or pull-request attribution.

The repository owner retains final review and merge authority.
