# Aegis Native daily structure correction — 2026-11-26

Identity: CORRECTION / zero/aegis/A1 + A2 / logical date 2026-11-26 Asia/Shanghai. Reviewer: Independent GPT, maintainer-requested correction. Observation date 2026-11-26; exact correction timestamp is recorded by Git commit, not a reconstructed Native timestamp.

Base main: `6a816f8843bf6c654cc439cf4875cfb47be2a4db`. Owning policy: `aegis-cortex/EVIDENCE_POLICY.md` blob `4977de3ac6cc8fbfd59bb0f7ebbb1957a9f22d84`; checker `aegis-cortex/check.py` blob `f557f7ff32687dd8e169dea032a6e11c64804c68`.

| Original Native artifact | Original merged PR and merge SHA | Original blob | Confirmed missing marker | Correction |
| --- | --- | --- | --- | --- |
| [A1](../../aegis-cortex/2026-11-26-A1-reliability-observe.md) | #945 / `3288072051f0a62143ac7ad2abf8b0fdd614bd78` | `88db5e24c95953fe47449b5a09a59950077c8288` | Uncertainty | Explicit uncertainty statement after Confidence |
| [A2](../../aegis-cortex/2026-11-26-A2-doctrine-orient.md) | #946 / `50c69153f2ae368105714a3efcbb504c66c9587a` | `c9449a4fa42e4df135b5d3c950b7596d4460589c` | Local Applicability; Remaining Uncertainty | Explicit bounded statements in orientation notes |

The checker validates marker presence in validate_a1 and validate_a2. Before: all three specified markers absent. Proposed after: all three present; removing exactly the inserted statements restores the original text byte-for-byte at the connector's UTF-8 text boundary. No original producer, execution status, recorded run identity, evidence delta, source, dependency or research judgment changed. A2's historical A1 input blob is the original blob and must not be silently rewritten to point to the corrected file.

Validation: targeted static string/round-trip comparison EXECUTED. Full Python checker NOT_EXECUTED: local Git remote acquisition failed DNS; no exact full checkout. SDK, host, real effect and independent authority checks NOT_EXECUTED. Original structural failure is preserved; prospective corrected marker state does not certify full checker PASS or Native runtime success.

No new Native run, experiment, Independent A1/A2 credit, or periodic audit. Maintainer review/merge pending; current-main retention of the correction is not yet claimed.
