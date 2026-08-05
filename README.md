# Zero-Entropy Lab

> **"Restraint is the ultimate form of digital violence."**

A minimal-dependency research laboratory for deterministic agent systems and edge-native AI architecture.

## ⚠️ Status: ZERO-DEPENDENCY ATTAINED

This repository operates under the Zero-Entropy Constitution — no third-party dependencies, no bloat, only raw engineering.

## Architecture

1. **Core (src/kernel/)**: SQLite-driven memory engine with WAL concurrency
2. **Protocol (src/kernel/protocol/)**: Native multithreaded HTTP server with lock-free ring buffer
3. **Portal (index.html)**: Vanilla architecture with Web Worker isolation and native WebGL
4. **Reasoning (src/kernel/cognitive/)**: Graph inference engine with multiprocessing shared memory

## Execution Commands

```bash
# Launch Laboratory Web Portal
export PYTHONPATH=$(pwd)/src/kernel:$(pwd)/src/kernel/protocol:$(pwd)/src/kernel/memory:$(pwd)/src/kernel/cognitive:$(pwd)/src/kernel/sensory:$(pwd)/src/kernel/orchestration
python src/kernel/protocol/nexus.py serve

# Run Verification Tests
python tests/run_tests.py
```

## Engineering Philosophy

By stripping away third-party dependencies, we return control to low-level memory layouts, kernel scheduling, and GPU shaders.

## External Synchronization

External documents are synchronized by `src/kernel/sensory/harvester.py` from explicit profiles in `data/inputs/source_profiles.json`.

Historical inputs remain byte-preserved under `data/inputs/archive/legacy-through-2026-07-11-1340`.

See `data/inputs/ARCHIVE_AND_HARVESTER.md` for the archive contract.

---
© Zero-Entropy Lab | Built for the Edge, Built for the Future
