## Outcome and exact scope
What changed, why, and what is explicitly out of scope?

- Base `main` SHA:
- Head SHA:
- Owning surface / logical period:
- Overlapping PR/branch check:

## Change classification
- [ ] implementation / state-contract repair
- [ ] maintenance / governance repair
- [ ] Aegis evidence/policy correction
- [ ] Ballast maintenance/correction surface change
- [ ] other bounded repository change

## Evidence boundary
- [ ] Runtime, persisted state, generated artifacts, external source material, execution evidence, and inference are not conflated
- [ ] Aegis and Ballast producer identity is preserved
- [ ] Unknown, missing, blocked, degraded, partial, unverified, evidence-insufficient, or no-conclusion state remains explicit
- [ ] Third-party archived/source material keeps its own provenance and licensing

## Changed and deliberately unchanged boundaries

## Verification actually executed
List exact checks, including Aegis/Ballast checkers or workflows only when actually run, with observed results.

## Verification not executed
Use `NOT_EXECUTED` for relevant checks that were not run. Contract inspection is not checker execution.

## History, producer identity, and provenance
- [ ] Historical records were not silently rewritten to make later knowledge appear earlier
- [ ] Current path presence was not presented as earlier execution evidence
- [ ] Ballast research production was not collapsed into repository maintenance state
- [ ] Private Jules prompts / repository memory / hidden reasoning / credentials were not exposed

## Concurrency and delivery
- [ ] Fresh `main` and live PR/branch ownership were rechecked before delivery
- [ ] Aggregate `main...branch` diff was reviewed
- [ ] No activity-only change was created where `NO_CHANGE_REQUIRED` was appropriate
- [ ] No direct `main` write, force-push, or auto-merge is requested by this PR

## Security and privacy
State impact on credentials, permissions, local interfaces, private data, generated artifacts, or public exposure. Follow `SECURITY.md` for sensitive details.

## Rollback
Describe the smallest safe rollback.

## Final review
- [ ] Change is focused and reviewable
- [ ] Required repository-facing surfaces remain synchronized
- [ ] Checks not run are explicit

Final doctrine and merge authority remains with the maintainer.
