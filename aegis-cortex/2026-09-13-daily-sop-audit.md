# Aegis Daily SOP Audit — 2026-09-01 through 2026-09-13

Status: CURRENT_RECONCILIATION
Authority base: main `55178065038cd5e08ba0121c06afc7708f5869d3`
Historical rewrite: NO

## Coverage matrix

| Date | Current disposition |
|---|---|
| 2026-09-01 | retain existing correction lineage; external evidence remains non-local |
| 2026-09-02 | access-depth correction retained: metadata/discovery is not full-text verification |
| 2026-09-03 | source-identity correction retained: related Crossref discovery is not exact-paper corroboration |
| 2026-09-04 | external tool/instruction-conflict evidence does not establish local incident |
| 2026-09-05 | external self-correction/observability evidence retained with environment-specific applicability |
| 2026-09-06 | single memory-poisoning source lineage retained; local exploitability unknown |
| 2026-09-07 | A1 present; A2 original `INPUT_MISSING / BLOCKED / NOT_RUN` preserved |
| 2026-09-08 | full-text paper evidence retained; no local incident inferred |
| 2026-09-09 | delegation/reviewability evidence retained; no local false-completion event inferred |
| 2026-09-10 | A1/A2 are `HUMAN_AUTHORIZED_SUBSTITUTE`; not relabeled as Jules-native |
| 2026-09-11 | run-level source diversity does not automatically give each claim two-source support |
| 2026-09-12 | A1 current path retained; A2 later reconciliation provenance preserved |
| 2026-09-13 | A1/A2 later reconciliation provenance preserved; GitHub product limits not transferred to Jules/Aegis |

## Content-format audit

The active public contract requires evidence class, exact source identity, claim-specific authority, independent verification, local incident evidence, host applicability, original execution status, current path status and provenance on new records. Current September reconciliation records carry these fields where they were created under the active contract; older/defective task-time semantics remain visible through dated corrections rather than being silently rewritten.

Confirmed correction lines remain authoritative:

- `METADATA_ACCESS != FULL_TEXT_VERIFICATION`.
- `RELATED_DISCOVERY != EXACT_SOURCE_CORROBORATION`.
- `RUN_LEVEL_SOURCE_DIVERSITY != CLAIM_LEVEL_TWO_SOURCE_SUPPORT`.
- `EXTERNAL_RISK != LOCAL_INCIDENT`.
- `CURRENT_PATH_PRESENT != ORIGINAL_EXECUTION_SUCCESS`.

## Daily audit result

`PASS_WITH_RETAINED_CORRECTIONS_AND_HETEROGENEOUS_PROVENANCE`
