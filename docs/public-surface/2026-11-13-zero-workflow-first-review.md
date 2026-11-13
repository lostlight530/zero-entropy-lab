# Zero workflow-first Pages redesign — review evidence

Date: 2026-11-13  
Status: DRAFT / SOURCE-STATIC REVIEW ONLY  
Branch: `agent/zero-workflow-first-bilingual-2026-11-13`  
Base main: `287857c320ddd6d4d5f112b4703d856bd5c9cf0a`

## Intent and responsibility boundary

This proposal restructures only the Zero GitHub Pages presentation. The shared NEXUS lifecycle stages are presented first, followed by two independent host execution boundaries, a Chinese/English plain-language glossary and direct links to both hosts' AGI workflow-lineage records. The old August observation is relegated to a polished historical data gallery instead of being the opening narrative.

The page does not claim the two repositories share state, runtime, ownership or persistence. It distinguishes the active `.github/workflows/nexus-life-cycle.yml` contracts from inert `AGI/workflows/**` historical records. No current GitHub Actions run counts are inferred from the August 7 exhibit.

## Historical preservation and source of truth

The complete pre-redesign homepage is preserved byte-identically under:

`docs/public-surface/2026-11-13-pre-workflow-first-index.html`

The archived file has the same Git blob as the starting main `index.html`:

`b677eb0f5ce4f5cf030129210412f88cdb25c7be`

The deployed site still reads the updated root `index.html` via the existing Pages workflow. The archive is an inert review/source artifact and is not a new Pages route or Actions workflow.

The historical gallery retains the four original top-level usage values unchanged:

| Metric | Zero | Welcome |
| --- | ---: | ---: |
| Job minutes | 3,870 | 7,045 |
| Job runs | 3,172 | 5,786 |

The legacy workflow lanes, step comparison matrix, August 7 run-log records, June 28 historical log and original no-prerequisites explanations remain in the redesigned root HTML. A full untouched representation remains available in the archived source above.

### Historical presentation correction

The legacy bar chart had incorrect visual widths: Zero was displayed as 100% while Welcome's larger values were displayed as 41% (minutes) / 42% (runs). The proposal preserves the original numbers and fixes **only visual proportions**: per metric-pair Welcome = 100%; Zero = 55%, rounded from its share of the greater value. These are not newly collected metrics.

The August 7 terminal header is relabeled from `CURRENT · 2026-08-07` to `SNAPSHOT · 2026-08-07` so it is not misread as the current run state. The unchanged source text remains in the immutable archive.

## Source-static validation performed

- Root HTML has exactly one `h1` and both language modes remain present
- All local hash navigation targets resolve; no duplicate IDs were found
- Relevant balanced HTML container tag counts and CSS brace balance checked
- Retained legacy display: 18 lane steps, 12 matrix data rows, and 34 log-line elements
- Four key usage values are identical to the archived source
- Mobile layout has single-column stages and host cards, 2-column historical number cards, and horizontally scrollable matrix columns
- Historical source backup is a byte-identical copy, verified by identical Git blob
- Repo-local AGI source links are explicit; this PR does not edit `AGI/**`, `.github/workflows/**`, `data/**`, `src/**` or any runtime implementation

## Evidence limitations / review gates

These are source-static checks, **not** a successful browser-rendered QA, HTTP end-to-end Pages check, screen-reader check, or mobile device verification.

Before merging, review desktop and mobile rendering (e.g. 1440px, 768px, 390px), toggle ZH/EN, open the June 28 details, scroll the comparison matrix on narrow screens, test nav and AGI links and ensure the old historical numbers remain legible.

The repository's ordinary Pages deployment on `main` must not be treated as proof that this proposed branch is deployed. Do not merge or republish without maintainer approval.
