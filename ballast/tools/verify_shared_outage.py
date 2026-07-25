from __future__ import annotations

import argparse
import hashlib
import json
import sys
from pathlib import Path
from typing import Any


def digest(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def validate(outputs_path: Path, expected: dict[str, Any]) -> dict[str, Any]:
    reasons: list[str] = []
    try:
        outputs = json.loads(outputs_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        return {
            "valid": False,
            "reasons": [f"output_read_failed:{type(error).__name__}"],
        }

    if not isinstance(outputs, dict):
        return {"valid": False, "reasons": ["outputs_not_object"]}

    expected_ids = set(expected)
    actual_ids = set(outputs)
    if actual_ids != expected_ids:
        reasons.append("task_set_mismatch")

    for task_id, task in expected.items():
        output = outputs.get(task_id)
        if not isinstance(task, dict) or not isinstance(output, dict):
            reasons.append(f"task_shape_mismatch:{task_id}")
            continue
        input_text = task.get("input")
        worker = task.get("worker")
        if not isinstance(input_text, str) or not isinstance(worker, str):
            reasons.append(f"expected_task_invalid:{task_id}")
            continue
        if output.get("status") != "complete":
            reasons.append(f"status_invalid:{task_id}")
        if output.get("worker") != worker:
            reasons.append(f"worker_mismatch:{task_id}")
        if output.get("input_sha256") != digest(input_text):
            reasons.append(f"input_digest_mismatch:{task_id}")
        if output.get("result") != f"processed:{input_text}":
            reasons.append(f"result_invalid:{task_id}")

    return {
        "valid": not reasons,
        "reasons": reasons,
        "expected_tasks": len(expected_ids),
        "actual_tasks": len(actual_ids),
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--outputs", required=True, type=Path)
    parser.add_argument("--expected-json", required=True)
    args = parser.parse_args()
    try:
        expected = json.loads(args.expected_json)
    except json.JSONDecodeError as error:
        print(json.dumps({"valid": False, "reasons": [f"expected_invalid:{error.msg}"]}))
        return 2
    if not isinstance(expected, dict):
        print(json.dumps({"valid": False, "reasons": ["expected_not_object"]}))
        return 2
    result = validate(args.outputs, expected)
    print(json.dumps(result, ensure_ascii=False, sort_keys=True))
    return 0 if result["valid"] else 1


if __name__ == "__main__":
    sys.exit(main())
