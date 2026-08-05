# Security Policy

## Supported State

Security fixes apply to the latest commit on `main`.

Historical snapshots, generated reports, feature branches, and pull requests are not maintained as independent release lines.

## Private Reporting

Report suspected vulnerabilities through [GitHub Private Vulnerability Reporting](https://github.com/lostlight530/zero-entropy-lab/security/advisories/new).

Do not disclose credentials, private data, working exploits, or unpatched weaknesses in a public issue.

A useful report includes:

- affected path and commit SHA
- reproducible steps
- expected security boundary
- observed behavior
- potential impact
- a minimal proof that does not affect third parties

Reports are reviewed on a best-effort basis. Acceptance, remediation, and disclosure decisions remain under human review.

## Scope

Security-relevant surfaces include:

- GitHub Actions workflows
- the Nexus lifecycle and local HTTP interface
- active input and knowledge processing
- SQLite and JSONL integrity boundaries
- repository permissions and generated-artifact write boundaries
- the independent Pages presentation layer

## Runtime Boundaries

- The native HTTP server is intended for local research use.
- It binds to `127.0.0.1` by default.
- `NEXUS_API_KEY` is required and API access fails closed when it is absent.
- Non-loopback binding requires explicit operator opt-in.
- Direct public exposure is unsupported. Remote access requires an authenticated TLS reverse proxy and network-level controls.
- Rate limits and content hashes do not replace authentication or authorization.

## Historical Material

Archived external documents are preserved as source evidence and are not active executable dependencies.

Obsolete historical claims are normally out of scope. Credentials, private data, unsafe executable content, or paths affecting the active runtime remain reportable regardless of location.
