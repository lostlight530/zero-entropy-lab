# Contributing

Contributions are welcome when they improve Zero-Entropy Lab's implementation, evidence clarity, tests, documentation, metadata, or developer experience while preserving deterministic state and provenance boundaries.

## Repository surfaces

Keep a change with the surface that owns it:

- `src/kernel/` — repository-owned runtime and protocol implementation;
- `tests/` — executable regression and contract evidence;
- `data/inputs/` and repository-owned data contracts — external-input lifecycle and reproducible ledgers;
- `aegis-cortex/` — reliability/evidence interpretation under its current public contracts;
- root documentation, citation/release metadata, `.github/`, and security files — public repository infrastructure;
- archived and historical material — point-in-time evidence that should not be rewritten merely to match later state.

## Before proposing a change

1. Start from current `main` and identify the implementation, contract, evidence policy, or public document that owns the behavior.
2. Reproduce an implementation defect at a named revision when possible before changing code.
3. For state or storage changes, describe the relevant SQLite, JSONL, cache, archive, or transition identity and the expected invariant.
4. For external-source or reliability claims, separate source identity, external risk, local observation, local incident evidence, and inference.
5. Add or update proportionate tests for behavior changes.
6. Keep unrelated cleanup out of the same pull request.

## Evidence boundaries

Do not collapse distinct evidence surfaces:

```text
external risk != local incident
local preventive record != incident evidence
transition declaration != transition execution
hash identity != authorship or authorization
checker success != semantic truth
current path presence != historical execution
archived publication != later main revision
```

Unknown or unavailable evidence should remain explicit rather than being promoted to success.

## Verification

Run the repository checks relevant to the changed surface. The primary regression entry point is:

```bash
python tests/run_tests.py
```

Additional targeted commands are appropriate when a narrower subsystem owns the change. Record exact commands, interpreter/environment details when material, and observed outcomes in the pull request.

Do not report an unrun test, workflow, checker, or transition as passed.

## Data, archive, and provenance

Follow `data/inputs/ARCHIVE_AND_HARVESTER.md` for repository-owned external-input lifecycle rules. Do not overwrite archived source bytes or remove provenance merely to simplify current state.

Third-party source material retains its own authorship and licensing. Repository ingestion does not convert external material into repository-owned evidence of truth.

## Pull requests

Use the repository pull-request template and include:

- the problem and bounded change;
- affected code, state, evidence, or documentation surfaces;
- tests/checks actually run and observed results;
- known limitations or checks not run;
- compatibility, migration, archive, or historical impact where relevant;
- security/privacy implications;
- a practical rollback.

## Security and privacy

Follow [SECURITY.md](./SECURITY.md) for sensitive reports. Do not place credentials, private data, exploit details requiring coordinated disclosure, or unnecessary external-source payloads in public issues or pull requests.

## Conduct, license, and attribution

Prefer small, inspectable changes and explicit failure behavior over hidden recovery or decorative complexity. Contributions to repository-owned work are submitted under the current `LICENSE`; third-party material keeps its original attribution and licensing. Git and pull-request history remain the source of contribution attribution.
