# Async completion token controlled observation — 2026-10-22

Execution: JavaScript V8 isolate, 2026-10-22 Asia/Shanghai
Source verification: Temporal Activity Execution documentation and Google Cloud Tasks documentation, accessed 2026-10-22

Observed producer execution: 38 distinct synthetic scenarios, 65 modeled accepted effects, 114 path decisions, reference COMPLETE 6, STOP_UNKNOWN 9, EVIDENCE_CONFLICT 5, RECONCILE 16, RETRY_ALLOWED 1, BLOCKED 1

Token-ack proxy differs from authored reference in 35/38 scenarios, count proxy in 31/38 scenarios, these are model-relative counts and not real system accuracy

Representative primitive injections: stale token after retry with already committed A/B, ACK without B effect, covered exact prior MISS for B, positive B receipt versus covered B MISS, equal-count membership swap, unauthorized B, extra C and witness drift

Original V8 execution returned scenario summary and selected decision rows, full independent verifier, native Node CLI, full Python checker, live Temporal, live Google Cloud Tasks and external sink NOT_EXECUTED at this observation point

This record is bounded synthetic evidence, not a production incident, external effect or independent authority proof

## Complete model decision matrix — primitive replay

| Scenario | token_proxy | count_proxy | full_reference |
| --- | --- | --- | --- |
| baseline_complete | COMPLETE | COMPLETE | COMPLETE |
| stale_token_after_retry | RETRY_ALLOWED | COMPLETE | COMPLETE |
| cancel_after_external_effect | RETRY_ALLOWED | COMPLETE | COMPLETE |
| timeout_after_external_effect | RETRY_ALLOWED | COMPLETE | COMPLETE |
| ack_without_external_B | COMPLETE | RETRY_ALLOWED | STOP_UNKNOWN |
| ack_wrong_member | COMPLETE | COMPLETE | EVIDENCE_CONFLICT |
| ack_duplicate_effect | COMPLETE | COMPLETE | EVIDENCE_CONFLICT |
| ack_extra_effect | COMPLETE | RETRY_ALLOWED | RECONCILE |
| ack_unauthorized_effect | COMPLETE | COMPLETE | RECONCILE |
| ack_wrong_target | COMPLETE | COMPLETE | RECONCILE |
| ack_wrong_task | COMPLETE | COMPLETE | RECONCILE |
| ack_wrong_effect_identity | COMPLETE | COMPLETE | EVIDENCE_CONFLICT |
| covered_miss_missing_B | COMPLETE | RETRY_ALLOWED | RETRY_ALLOWED |
| stale_watermark_miss | COMPLETE | RETRY_ALLOWED | STOP_UNKNOWN |
| expired_retention_miss | COMPLETE | RETRY_ALLOWED | STOP_UNKNOWN |
| uncovered_lifecycle_miss | COMPLETE | RETRY_ALLOWED | STOP_UNKNOWN |
| wrong_scope_miss | COMPLETE | RETRY_ALLOWED | STOP_UNKNOWN |
| wrong_identity_miss | COMPLETE | RETRY_ALLOWED | STOP_UNKNOWN |
| positive_receipt_miss_conflict | COMPLETE | COMPLETE | EVIDENCE_CONFLICT |
| hit_without_journal_effect | COMPLETE | RETRY_ALLOWED | EVIDENCE_CONFLICT |
| permission_revoked_missing | COMPLETE | RETRY_ALLOWED | BLOCKED |
| permission_revoked_complete | COMPLETE | COMPLETE | COMPLETE |
| same_count_membership_swap | COMPLETE | COMPLETE | RECONCILE |
| witness_membership_mismatch | COMPLETE | COMPLETE | RECONCILE |
| witness_stale_revision | COMPLETE | COMPLETE | RECONCILE |
| witness_unprotected | COMPLETE | COMPLETE | RECONCILE |
| witness_after_commit | COMPLETE | COMPLETE | RECONCILE |
| duplicate_receipt_identity | COMPLETE | COMPLETE | RECONCILE |
| duplicate_event_identity | COMPLETE | COMPLETE | RECONCILE |
| duplicate_required_members | COMPLETE | COMPLETE | RECONCILE |
| empty_required_members | COMPLETE | RETRY_ALLOWED | RECONCILE |
| effect_after_commit | COMPLETE | COMPLETE | RECONCILE |
| unknown_permission_missing | COMPLETE | RETRY_ALLOWED | STOP_UNKNOWN |
| nonfinite_watermark_miss | COMPLETE | RETRY_ALLOWED | STOP_UNKNOWN |
| prior_query_error | COMPLETE | RETRY_ALLOWED | STOP_UNKNOWN |
| effect_before_attempt_start | COMPLETE | COMPLETE | RECONCILE |
| token_ack_for_other_attempt | COMPLETE | COMPLETE | COMPLETE |
| same_name_new_incarnation | COMPLETE | COMPLETE | RECONCILE |

38 unique scenarios, 114 decisions, token proxy disagreement 35/38, count proxy disagreement 31/38, the matrix is reconstructed from the persisted primitive JSON

## Verification correction

The initial verifier mutation expectations were wrong for two cases, changing B effect identity while preserving an asserted complete positive journal and prior HIT B creates EVIDENCE_CONFLICT rather than RECONCILE, correcting only these expectations yielded 39/39 controls, 36 negative and three positive

Implementation independence PARTIAL, data independence NONE, semantic contract independence LIMITED, external authority NONE, full checker, standalone Node CLI and real external sink NOT_EXECUTED
