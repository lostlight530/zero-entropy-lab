from __future__ import annotations

import json
import subprocess
import sys
import tempfile
import time
from pathlib import Path


CONTEXTS = ("alpha", "beta")


class Dependency:
    def __init__(self) -> None:
        self.calls = 0

    def call(self, context: str, phase: str) -> str:
        self.calls += 1
        available = {
            "outage": set(),
            "partial": {"alpha"},
            "full": {"alpha", "beta"},
        }[phase]
        if context not in available:
            raise RuntimeError(f"{context} unavailable")
        return f"{context}:generation-2"


def global_breaker_path() -> dict[str, object]:
    dependency = Dependency()
    artifacts: dict[str, str] = {}
    state = "closed"
    failures = 0

    for context in CONTEXTS:
        try:
            dependency.call(context, "outage")
        except RuntimeError:
            failures += 1
    if failures == len(CONTEXTS):
        state = "open"

    state = "half-open"
    dependency.call("alpha", "partial")
    state = "closed"

    for context in CONTEXTS:
        try:
            artifacts[context] = dependency.call(context, "partial")
        except RuntimeError:
            artifacts[context] = ""

    reported_complete = set(artifacts) == set(CONTEXTS)
    expected = {context: f"{context}:generation-2" for context in CONTEXTS}
    effective_complete = artifacts == expected
    return {
        "state": state,
        "calls": dependency.calls,
        "writes": len(artifacts),
        "artifacts": artifacts,
        "reported_complete": reported_complete,
        "effective_complete": effective_complete,
    }


def scoped_breaker_path() -> dict[str, object]:
    dependency = Dependency()
    states = {context: "closed" for context in CONTEXTS}
    artifacts: dict[str, str] = {}
    writes = 0

    for context in CONTEXTS:
        try:
            dependency.call(context, "outage")
        except RuntimeError:
            states[context] = "open"

    for context in CONTEXTS:
        states[context] = "half-open"
        try:
            payload = dependency.call(context, "partial")
        except RuntimeError:
            states[context] = "open"
            continue
        states[context] = "closed"
        artifacts[context] = payload
        writes += 1

    partial = {
        "states": dict(states),
        "artifacts": dict(artifacts),
        "effective_complete": False,
    }

    states["beta"] = "half-open"
    artifacts["beta"] = dependency.call("beta", "full")
    writes += 1
    states["beta"] = "closed"

    expected = {context: f"{context}:generation-2" for context in CONTEXTS}
    final = {
        "states": dict(states),
        "artifacts": dict(artifacts),
        "effective_complete": artifacts == expected,
    }

    replay_calls_before = dependency.calls
    replay_writes_before = writes
    for context in CONTEXTS:
        if artifacts.get(context) != expected[context]:
            artifacts[context] = dependency.call(context, "full")
            writes += 1

    return {
        "calls": dependency.calls,
        "writes": writes,
        "partial": partial,
        "final": final,
        "replay_calls": dependency.calls - replay_calls_before,
        "replay_writes": writes - replay_writes_before,
    }


def main() -> int:
    started = time.perf_counter()
    result = {
        "global": global_breaker_path(),
        "scoped": scoped_breaker_path(),
    }
    verifier = Path(__file__).with_name("verify_breaker_scope.py")
    with tempfile.TemporaryDirectory(prefix="ballast-breaker-scope-") as temp:
        result_path = Path(temp) / "result.json"
        result_path.write_text(
            json.dumps(result, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
        completed = subprocess.run(
            [sys.executable, str(verifier), str(result_path)],
            check=False,
            capture_output=True,
            text=True,
            encoding="utf-8",
        )
        if completed.stdout:
            print(completed.stdout.strip())
        if completed.stderr:
            print(completed.stderr.strip(), file=sys.stderr)
        if completed.returncode:
            return completed.returncode
    elapsed_ms = (time.perf_counter() - started) * 1000
    print(json.dumps(result, ensure_ascii=False, sort_keys=True))
    print(f"validated_elapsed_ms={elapsed_ms:.3f}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
