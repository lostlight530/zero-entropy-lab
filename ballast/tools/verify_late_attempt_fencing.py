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
    parser.add_argument("--state", required=True, type=Path)
    parser.add_argument("--desired", required=True, type=Path)
    parser.add_argument("--task", required=True)
    args = parser.parse_args()

    state = read_json(args.state)
    desired = read_json(args.desired)
    result = state.get("results", {}).get(args.task)
    reasons: list[str] = []

    if not isinstance(result, dict):
        reasons.append("result_missing")
        result = {}
    if desired.get("task_id") != args.task:
        reasons.append("desired_task_mismatch")
    if result.get("generation") != desired.get("generation"):
        reasons.append("stale_generation")
    if result.get("payload") != desired.get("payload"):
        reasons.append("payload_mismatch")

    accepted = [
        event for event in state.get("commit_log", [])
        if isinstance(event, dict)
        and event.get("task_id") == args.task
        and event.get("accepted") is True
    ]
    if not accepted:
        reasons.append("accepted_commit_missing")
    elif result.get("attempt_epoch") != max(
        event.get("attempt_epoch", -1) for event in accepted
    ):
        reasons.append("result_not_latest_accepted_epoch")

    output = {
        "accepted_commits": len(accepted),
        "actual_epoch": result.get("attempt_epoch"),
        "actual_generation": result.get("generation"),
        "desired_generation": desired.get("generation"),
        "reasons": reasons,
        "valid": not reasons,
    }
    print(json.dumps(output, ensure_ascii=False, sort_keys=True))
    return 0 if output["valid"] else 1


if __name__ == "__main__":
    sys.exit(main())
