# Zero-Entropy Lab

> **"Restraint is the ultimate form of digital violence."**

A standard-library research laboratory for deterministic state, evidence, and edge-native execution.

## Status

The Python runtime uses the standard library and keeps generated state reproducible from explicit ledgers.

Zero dependency is an implementation constraint. It is not a claim that inputs, network access, or generated results are automatically trusted.

## Architecture

1. **Core (`src/kernel/`)**: SQLite-backed memory and deterministic state processing
2. **Protocol (`src/kernel/protocol/`)**: Local protocol experiments and lifecycle commands
3. **Portal (`index.html`)**: Independent presentation surface
4. **Reasoning (`src/kernel/cognitive/`)**: Graph-based structural analysis

## Verification

```bash
python tests/run_tests.py
```

## Optional Local Server

The server is a local research interface. It is not required for the lifecycle workflow.

Generate an ephemeral API key before starting it:

```bash
export NEXUS_API_KEY="$(python -c 'import secrets; print(secrets.token_urlsafe(32))')"
python src/kernel/protocol/nexus.py serve
```

The default bind address is `127.0.0.1`. API requests fail closed when `NEXUS_API_KEY` is missing.

A non-loopback bind requires explicit operator opt-in. Do not expose the native server directly to the public Internet. Use an authenticated TLS reverse proxy and network-level access controls when remote access is intentionally enabled.

## Security Boundaries

- External documents and API requests remain untrusted inputs.
- Rate limiting is not authentication.
- SHA-256 fingerprints prove content identity, not authorship or authorization.
- Generated graph state must remain reproducible from validated ledgers.
- Security reports follow the private process in [SECURITY.md](./SECURITY.md).

## External Synchronization

External documents are synchronized by `src/kernel/sensory/harvester.py` from explicit profiles in `data/inputs/source_profiles.json`.

Historical inputs remain byte-preserved under `data/inputs/archive/legacy-through-2026-07-11-1340`.

See `data/inputs/ARCHIVE_AND_HARVESTER.md` for the archive contract.

---
© Zero-Entropy Lab | Built for the Edge, Built for the Future
