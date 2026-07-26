from __future__ import annotations

import json
import sys
from pathlib import Path


def verify(result: dict[str, object]) -> list[str]:
    errors: list[str] = []
    global_path = result["global"]
    scoped_path = result["scoped"]
    expected = {
        "alpha": "alpha:generation-2",
        "beta": "beta:generation-2",
    }

    if not global_path["reported_complete"]:
        errors.append("global path did not expose shallow completion")
    if global_path["effective_complete"]:
        errors.append("global path unexpectedly passed final semantics")
    if global_path["artifacts"].get("beta") == expected["beta"]:
        errors.append("global counterexample is missing")
    if set(global_path["artifacts"]) != set(expected):
        errors.append("global path did not preserve the count counterexample")

    partial = scoped_path["partial"]
    if partial["effective_complete"]:
        errors.append("scoped partial recovery was accepted")
    if partial["states"] != {"alpha": "closed", "beta": "open"}:
        errors.append("scoped partial states are wrong")
    if partial["artifacts"] != {"alpha": expected["alpha"]}:
        errors.append("scoped partial artifacts are wrong")

    final = scoped_path["final"]
    if not final["effective_complete"]:
        errors.append("scoped final recovery was rejected")
    if final["artifacts"] != expected:
        errors.append("scoped final artifacts do not match current semantics")
    if final["states"] != {"alpha": "closed", "beta": "closed"}:
        errors.append("scoped final states are wrong")
    if scoped_path["replay_calls"] != 0 or scoped_path["replay_writes"] != 0:
        errors.append("completed replay produced a side effect")

    return errors


def main() -> int:
    if len(sys.argv) != 2:
        print("usage: verify_breaker_scope.py RESULT", file=sys.stderr)
        return 2
    result = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    errors = verify(result)
    if errors:
        for error in errors:
            print(f"ERROR {error}")
        return 1
    print("OK independent breaker scope verification")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
