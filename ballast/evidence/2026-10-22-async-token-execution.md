# Async completion token controlled observation — 2026-10-22

Execution: JavaScript V8 isolate, 2026-10-22 Asia/Shanghai
Source verification: Temporal Activity Execution documentation and Google Cloud Tasks documentation, accessed 2026-10-22

Observed producer execution: 38 distinct synthetic scenarios, 65 modeled accepted effects, 114 path decisions, reference COMPLETE 6, STOP_UNKNOWN 9, EVIDENCE_CONFLICT 5, RECONCILE 16, RETRY_ALLOWED 1, BLOCKED 1

Token-ack proxy differs from authored reference in 35/38 scenarios, count proxy in 31/38 scenarios, these are model-relative counts and not real system accuracy

Representative primitive injections: stale token after retry with already committed A/B, ACK without B effect, covered exact prior MISS for B, positive B receipt versus covered B MISS, equal-count membership swap, unauthorized B, extra C and witness drift

Original V8 execution returned scenario summary and selected decision rows, full independent verifier, native Node CLI, full Python checker, live Temporal, live Google Cloud Tasks and external sink NOT_EXECUTED at this observation point

This record is bounded synthetic evidence, not a production incident, external effect or independent authority proof
