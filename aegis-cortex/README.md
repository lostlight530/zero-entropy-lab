# Aegis Cortex / 可靠性证据研究层

Aegis Cortex is the repository's long-lived **reliability/evidence research surface**. It studies external reliability risks, local applicability, bounded architectural implications, and evidence quality. It is not the host kernel runtime and it does not turn an external failure report into a local incident.

## Read this directory by role

### Current long-lived policy

- [`EVIDENCE_POLICY.md`](./EVIDENCE_POLICY.md) — current evidence classes, source-authority rules, host-applicability boundaries, persistence/transition/checker semantics, and historical-correction rules.

The policy is the durable semantic entry point. Time-scoped August examples and periodic lifecycle clauses inside it retain their own cutoff; current host behavior is recovered from current implementation and current evidence, not from an old research snapshot.

### Time-scoped research artifacts

Dated A1/A2 and week/month A3–A6 files are point-in-time research artifacts. They preserve original logical period, producer/execution state, source lineage, and uncertainty.

Later reconciliation may strengthen or narrow current interpretation but must not manufacture an earlier local incident, successful run, or source that was not available at the time.

### Structural checker

`check.py` validates declared artifact structure and repository-boundary markers. It does not prove semantic correctness, local incident absence, external truth, tool-effect success, or universal reliability.

## Host repository realization

The host runtime is primarily under `src/kernel/**`, with separate memory, sensory, cognitive, orchestration, and protocol surfaces. Aegis documents evidence about reliability questions around that system and external research; it is not that runtime itself.

```text
Aegis research/evidence
!= host kernel runtime
!= Ballast action-integrity research
!= repository maintenance/governance
```

The host's SQLite state, linked JSONL ledgers, HMAC checks, retrieval/ranking signals, transition declarations, and protocol helpers each support only their implemented local predicates.

## Reliability invariants

Keep these distinctions explicit:

```text
external risk class != local repository incident
local preventive record != local incident evidence
hash linkage != source truth
HMAC-valid fields != authorization or external identity
transition declaration != transition execution
checker PASS != semantic validation
same-source repetition != independent corroboration
```

External benchmark/failure/attack rates stay scoped to their original population and harness. They are not automatically Aegis-local probabilities or rates.

## Repository data and archive boundary

The host's external-ingestion/archive lifecycle is documented separately at [`../data/inputs/ARCHIVE_AND_HARVESTER.md`](../data/inputs/ARCHIVE_AND_HARVESTER.md). Aegis research records do not own that lifecycle and are intentionally excluded from it.

## Current versus historical reading

For present interpretation, start with the current evidence policy and current host implementation. For historical execution or research claims, read the dated artifact and any explicit later correction/reconciliation together.

Current file presence cannot prove earlier execution. Later success cannot erase an earlier blocked/missing state.

## Publication identity

The host repository has its own software DOI and publication metadata at the repository root. That DOI identifies the archived repository publication; it is not external reliability evidence, local incident evidence, or independent scientific corroboration for Aegis claims.

For the current repository-wide entry point, see [`../README.md`](../README.md). For Aegis semantics, start with [`EVIDENCE_POLICY.md`](./EVIDENCE_POLICY.md).
