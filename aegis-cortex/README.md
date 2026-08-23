# Aegis Cortex

Aegis Cortex is the repository-local research record for the A1–A6 reliability lifecycle.

This directory contains both **point-in-time Jules research artifacts** and **later evidence/reconciliation records**. Historical execution state and current interpretation must remain distinguishable.

## Cadence and canonical artifacts

| Layer | Cadence | Canonical filename | Role |
|---|---|---|---|
| A1 | Daily | `YYYY-MM-DD-A1-reliability-observe.md` | Observe external reliability/risk evidence |
| A2 | Daily | `YYYY-MM-DD-A2-doctrine-orient.md` | Orient same-day A1 evidence and local applicability |
| A3 | Weekly | `YYYY-Www-A3-discipline-decide.md` | Synthesize the ISO-week risk set and record bounded decisions |
| A4 | Weekly | `YYYY-Www-A4-protocol-act.md` | Map A3 decisions into bounded protocol/research actions |
| A5 | Monthly | `YYYY-MM-A5-drift-reflect.md` | Reflect on natural-month reliability drift/failure history |
| A6 | Monthly | `YYYY-MM-A6-aegis-memorize.md` | Record bounded durable and expiring doctrine memory |

Weekly logical time uses `Asia/Shanghai` and ISO Monday–Sunday windows under the existing artifact contract.

## Read order and authority

When records appear to conflict, read them in this order:

1. **Original A1–A6 artifact** — authoritative for what the task recorded at execution time
2. **Explicit reconciliation / erratum** — authoritative for later interpretation of its named issue, without rewriting original execution history
3. [`EVIDENCE_POLICY.md`](./EVIDENCE_POLICY.md) — current reviewer-side reliability/evidence semantics
4. **Stage audit** — declared-window inventory and synthesis; not a replacement run
5. **Current primary source** — used to revalidate material external claims whose version/date or claim strength matters

A reconciliation may narrow an earlier probability, reliability, checker, or memory/context claim. It cannot fabricate a missing Daily run or silently turn an earlier blocked task into success.

## August 2026 reference records

- [`2026-08-through-23-stage-audit.md`](./2026-08-through-23-stage-audit.md) — provisional 2026-08-01 through 2026-08-23 lifecycle/evidence audit
- [`2026-W33-reconciliation.md`](./2026-W33-reconciliation.md) — W33 delivery/evidence reconciliation
- [`2026-W34-reconciliation.md`](./2026-W34-reconciliation.md) — W34 reliability-claim calibration
- [`EVIDENCE_POLICY.md`](./EVIDENCE_POLICY.md) — durable evidence interpretation policy

The formal August A5/A6 lifecycle remains separate from the provisional stage audit.

## August delivery boundary

The 2026-08-15 A1/A2 files are not present in the audited repository history. Available evidence does not establish whether they were never generated or generated but never delivered/merged.

Therefore their state remains `UNRESOLVED_DELIVERY_HISTORY` unless genuine original evidence is recovered. Do not create synthetic Daily artifacts merely to make the matrix visually complete.

The 2026-08-16 records also demonstrate why current presence and original Weekly-snapshot visibility must remain separate.

## Reliability evidence classes

Keep these independent:

- external risk class
- external failure report
- local repository incident
- local structural-contract result
- local runtime outcome
- expected-content/postcondition evidence
- authoritative external effect
- unresolved delivery/effect history

Repeated external discussion can justify continued observation. It does not create a local incident count, denominator, probability estimate, or immunity proof.

## Checker boundary

`check.py` validates deterministic artifact structure, date/week identity, evidence-state fields, handoffs, decision/action IDs, and repository-boundary markers.

It does **not** prove:

- external claim truth
- absence of local incidents
- successful runtime side effects
- immunity from memory/context poisoning
- universal reliability

A checker pass is structural evidence only.

## Ballast relationship

Ballast is a separate GPT-maintained research/maintenance layer. Its distinctions around transport result, historical receipt, current postcondition, prior-effect evidence, freshness, and uncertainty may inform post-hoc review, but Aegis and Ballast remain separate control planes.

## Repository boundary

This directory is a research/evidence surface. Documentation maintenance here does not itself authorize changes to:

- host repository code or frontend
- Jules prompts, memory, cadence, or scheduler
- GPT/Ballast controls
- `.github/**`, GitHub Actions, or CI
- deployment/runtime behavior
- production policy or merge gates

Preserve uncertainty when the evidence cannot resolve it.