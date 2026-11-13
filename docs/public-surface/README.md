# Zero public frontend — maintained source and preserved original

The source of truth for the deployed homepage is the repository-root `index.html`, served as a static Pages artifact by `.github/workflows/deploy.yml`

## Current vs old

- **Current:** root `index.html` is the bilingual workflow-first NEXUS explanation plus clearly dated retained traffic/log exhibits
- **Old, byte-identical snapshot:** `docs/public-surface/2026-11-13-pre-workflow-first-index.html` records the pre-redesign homepage
- **Review decision:** `docs/public-surface/2026-11-13-zero-workflow-first-review.md` retains the scope and source checks for the redesign

The old file is an intentional archive, **not a second deployed entrypoint or deletion candidate**. The newer frontend does not turn frozen records or `AGI/workflows` history into a live control-plane display

## Maintenance contract

- Source and stage logic are independently scoped to each repository's actual lifecycle YAML, without claiming a shared agent state
- Aegis/ Ballast are protected research/runtime boundaries; the homepage need not link to an Aegis research document from the old history footer
- Do not rewrite historical numbers, journal/log rows or original snapshot contents to satisfy visual-design edits
- Chinese visible homepage strings contain no `U+3002` full stop; decimal notation, code paths and preserved archives are unaffected
- Verify all local anchors, language toggling, historical counts, workflow-source URLs, browser viewport layout and successful Pages deployment before release
- Never remove the pre-redesign snapshot, `AGI/**`, protected research directories or data ledgers under a generic "cleanup" label

Prior frontend update: [PR #860](https://github.com/lostlight530/zero-entropy-lab/pull/860)
