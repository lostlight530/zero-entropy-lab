# Archive and document synchronization

The legacy archive contains every harvested input present through 2026-07-11 13:40 Asia Shanghai

Files are preserved byte for byte and organized by knowledge layer repository namespace year and month

New synchronization is driven only by `data/inputs/source_profiles.json`

Every source must be owned by Zero and carry explicit promotion approval before collection

Repository links discovered inside documents never become collection targets

Document state uses Git blob SHA and a normalized content hash

Each generated document includes repository path SHA retrieval time owner and a namespaced entity identifier

External harvesting is an explicit workflow stage and remains separate from the internal evolution cycle

## Active synchronization contract

The active profile contains 39 explicitly declared repository sources

The lifecycle rebuilds state then harvests validates ingests ponders evolves and runs the complete test entry point

Push validation covers the workflow input profiles archive indexes implementation and tests

The test entry point configures Unicode safe output for constrained Windows consoles

Request scoped and temporary Cortex connections are closed explicitly and HiveMind closes its socket when multicast binding is unavailable

Run the focused contract with `python -m unittest discover -s tests -p test_harvester.py`

Run the complete verification with `python tests/run_tests.py`
