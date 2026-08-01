from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any


def read_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--observed", required=True, type=Path)
    parser.add_argument("--desired", required=True, type=Path)
    parser.add_argument("--mode", choices=("content", "generation"), required=True)
    args = parser.parse_args()

    observed = read_json(args.observed)
    desired = read_json(args.desired)
    reasons: list[str] = []
    if observed.get("task_id") != desired.get("task_id"):
        reasons.append("task_mismatch")
    if observed.get("payload") != desired.get("payload"):
        reasons.append("payload_mismatch")
    if args.mode == "generation":
        if observed.get("intent_id") != desired.get("intent_id"):
            reasons.append("intent_mismatch")
        if observed.get("generation") != desired.get("generation"):
            reasons.append("generation_mismatch")

    output = {
        "actual_generation": observed.get("generation"),
        "desired_generation": desired.get("generation"),
        "mode": args.mode,
        "reasons": reasons,
        "valid": not reasons,
    }
    print(json.dumps(output, ensure_ascii=False, sort_keys=True))
    return 0 if output["valid"] else 1


if __name__ == "__main__":
    sys.exit(main())
