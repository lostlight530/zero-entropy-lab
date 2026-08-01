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
    current = state.get("current")
    reasons: list[str] = []
    if not isinstance(current, dict):
        reasons.append("current_missing")
        current = {}
    if current.get("task_id") != args.task:
        reasons.append("task_mismatch")
    if current.get("intent_id") != desired.get("intent_id"):
        reasons.append("intent_mismatch")
    if current.get("payload") != desired.get("payload"):
        reasons.append("payload_mismatch")
    accepted = [
        event for event in state.get("write_log", [])
        if isinstance(event, dict) and event.get("accepted") is True
    ]
    if not accepted:
        reasons.append("accepted_write_missing")
    elif current.get("revision") != max(
        event.get("revision", -1) for event in accepted
    ):
        reasons.append("current_not_latest_revision")

    output = {
        "actual_intent": current.get("intent_id"),
        "actual_revision": current.get("revision"),
        "desired_intent": desired.get("intent_id"),
        "reasons": reasons,
        "valid": not reasons,
    }
    print(json.dumps(output, ensure_ascii=False, sort_keys=True))
    return 0 if output["valid"] else 1


if __name__ == "__main__":
    sys.exit(main())
