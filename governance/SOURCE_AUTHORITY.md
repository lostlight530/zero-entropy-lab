# Source Authority Contract

Status: current repository-wide source/provenance contract  
Calibration: 2026-09-18  
Scope: repository-visible source identity, provenance, freshness, claim support, and recovery across implementation, research, maintenance, and external-input surfaces

This contract defines the common source layer for Zero Entropy Lab. It does not replace subject-specific policy such as `aegis-cortex/EVIDENCE_POLICY.md`, Ballast's research method, or `data/inputs/ARCHIVE_AND_HARVESTER.md`.

Its purpose is narrower: when a claim depends on a repository revision, external document, observed run, archived input, or prior record, make the identity and limits of that source recoverable without turning provenance into truth.

## 1. Minimum source record

For a source used to support a material claim, recover as many of the following fields as the source actually exposes:

- `Source Identity` — canonical repository path, document identity, standard/specification identity, paper identity, or authoritative origin.
- `Source Revision` — immutable commit, version, release, digest, dated edition, or other revision identity when available.
- `Observed Time` — when this reviewer/run actually accessed or inspected the source.
- `Source Time` — publication, revision, event, or origin time asserted by the source; use `UNKNOWN` when unavailable or unreliable.
- `Lineage` — producer/origin relationship needed to determine whether two observations are independent.
- `Claim Scope` — the exact proposition for which this source is being used.

A mutable URL without a revision identity can still be useful evidence, but it is weaker recovery material for revision-sensitive claims.

Use:

`SOURCE_IDENTITY != SOURCE_TRUTH`

`CONTENT_DIGEST != AUTHORSHIP_OR_AUTHORITY`

`OBSERVED_TIME != SOURCE_TIME`

## 2. Claim-specific authority

Authority is evaluated for the proposition being asserted, not assigned globally to a domain or website.

Typical examples:

- current repository behavior → current merged implementation, tests, and owning active contract at an exact revision;
- repository history → Git history, PR/commit chronology, immutable blobs, and contemporaneous repository records;
- standards semantics → the applicable official specification/version;
- research results → the original research artifact and exact reported population/harness;
- product or platform behavior → current first-party implementation/documentation for the relevant version when available;
- metadata identity → canonical metadata/index services may establish identity or discovery facts but do not automatically establish the underlying paper, theorem, result, or runtime behavior.

A source may be authoritative for one field and non-authoritative for another.

## 3. Current, recent, and historical are different states

Do not collapse freshness into a single date comparison.

- `CURRENT` means the source is the active authority for the claim at the reviewed revision/time.
- `RECENT` means the source is temporally close but not necessarily authoritative or still applicable.
- `HISTORICAL` means the source accurately represents an earlier state or interpretation.
- `UNKNOWN` means current applicability cannot be established from available evidence.

A later source may improve current interpretation without rewriting an earlier record's task-time observation.

A current path, release, or documentation page does not prove the same state existed at an earlier execution time.

## 4. Representation identity is not semantic authority

HTTP validators such as `ETag` and `Last-Modified`, Git commit/tree/blob identifiers, cryptographic digests, and archive hashes are valuable for representation identity and change detection.

They do not independently establish:

- authorship;
- authorization;
- scientific correctness;
- semantic completeness;
- current applicability;
- successful execution;
- independent corroboration.

When an origin provides a strong representation validator, preserve it when useful for later change detection. Treat weak validators and modification dates according to their actual semantics rather than as universal content identities.

## 5. Lineage and independence

Source repetition does not create independence.

The following normally remain one lineage unless additional independent origin evidence exists:

- the same paper opened from multiple mirrors;
- a publisher page plus an index entry that only repeats publisher metadata;
- a copied, translated, cached, quoted, or summarized version of the same underlying source;
- repeated Daily/Weekly/Monthly use of one source;
- a verifier that recomputes outputs while sharing the same incomplete semantic contract.

Independence should name what is independent: implementation, evidence source, authority, semantic contract, or execution environment.

Use:

`REOBSERVATION != INDEPENDENT_CORROBORATION`

`INDEPENDENT_IMPLEMENTATION != INDEPENDENT_SEMANTIC_CONTRACT`

## 6. Negative evidence and missing coverage

Absence from an incomplete source is not proof of nonexistence.

Before using negative evidence, identify the expected coverage boundary: membership set, time window, namespace, receipt/log retention, archive completeness, or query domain.

If that coverage cannot be established, preserve the result as `UNKNOWN`, `UNVERIFIED`, `PARTIAL`, or `EVIDENCE_INSUFFICIENT` rather than promoting absence into a negative fact.

## 7. Conflicting sources

When sources disagree:

1. keep the conflict visible;
2. compare exact claim scope, source revision, observation time, and authority for that claim;
3. prefer stronger claim-specific authority and applicable revision evidence for the current interpretation;
4. preserve the losing/historical source when it remains valid evidence of an earlier state;
5. do not manufacture consensus from aggregation alone.

If the conflict cannot be resolved from repository-visible evidence, retain `UNRESOLVED` or `UNKNOWN`.

## 8. Repository recovery order

For repository-local truth, recover from current merged `main` and the most specific owning source before summaries or recollection.

```text
current merged main / exact revision
> owning current implementation or subject-specific contract
> revision-matched observed execution evidence
> repository-wide source/provenance and governance contracts
> current explanatory/publication surfaces
> historical audits and point-in-time records
> prior handoff or model recollection
```

This ordering is claim-specific. A current governance document does not override stronger implementation or subject-specific authority merely because it is newer.

## 9. Surface-specific ownership

This source contract composes with, rather than replaces, narrower owners:

- `aegis-cortex/EVIDENCE_POLICY.md` owns Aegis evidence classes, external-risk/local-incident separation, and A1-A6 research interpretation.
- `ballast/README.md` and `ballast/METHOD.md` own Ballast action-integrity research semantics, experiment promotion, and Daily continuity.
- `data/inputs/ARCHIVE_AND_HARVESTER.md` owns repository-managed external-input snapshots, archives, caches, ledgers, and ingestion lifecycle.
- `governance/README.md` owns repository-level maintenance/control routing and bounded repair delivery.

When two surfaces appear to overlap, identify the exact claim first, then use the most specific active owner.

## 10. Delivery and review

A PR, Daily record, audit, or maintenance handoff should include source identity/revision information when the conclusion depends on it.

Do not claim a source was inspected when only a search result, metadata page, copied excerpt, stale handoff, or model recollection was available.

Do not report an unexecuted check, unavailable source, missing version, unresolved lineage, or unknown freshness as verified.

Historical artifacts remain point-in-time evidence. Current corrections belong in the current owning surface unless an explicit historical correction is required.

## 11. Informative external models

This repository does not claim compliance with these external specifications, but their separation of provenance identity from downstream trust judgments is compatible with this contract:

- W3C PROV-DM models provenance through entities, activities, agents, derivations, and responsibility relationships: https://www.w3.org/TR/prov-dm/
- SLSA v1.2 separates source revision provenance from later verification expectations and emphasizes revision-bound provenance: https://slsa.dev/spec/v1.2/source-requirements
- RFC 9110 defines HTTP representation validators such as `ETag` and `Last-Modified`; validators identify representation state and must not be upgraded into semantic truth: https://www.rfc-editor.org/rfc/rfc9110.html#name-validator-fields

These references are informative. Zero Entropy Lab's operative rules are the repository contracts at the reviewed revision.
