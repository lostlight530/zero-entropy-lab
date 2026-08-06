from __future__ import annotations

import argparse
import hashlib
import json
import sys
from collections import Counter
from pathlib import Path
from typing import Any


def canonical_digest(operation: dict[str, Any]) -> str:
    payload = {
        "operation_id": operation["operation_id"],
        "expected_generation": operation["expected_generation"],
        "value": operation["value"],
    }
    encoded = json.dumps(payload, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()


def load(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--control", required=True, type=Path)
    parser.add_argument("--weak", required=True, type=Path)
    parser.add_argument("--strong", required=True, type=Path)
    args = parser.parse_args()

    control = load(args.control)
    weak = load(args.weak)
    strong = load(args.strong)
    reasons: list[str] = []

    required_control = {"task_id", "initial", "current", "stale", "valid"}
    if set(control) != required_control:
        reasons.append("control_structure_mismatch")

    for name in ("current", "stale", "valid"):
        operation = control.get(name)
        if not isinstance(operation, dict):
            reasons.append(f"missing_control_operation:{name}")
            continue
        if operation.get("intent_digest") != canonical_digest(operation):
            reasons.append(f"control_digest_mismatch:{name}")

    weak_log = weak.get("side_effect_log", [])
    strong_log = strong.get("side_effect_log", [])
    weak_ids = [entry.get("operation_id") for entry in weak_log if isinstance(entry, dict)]
    strong_ids = [entry.get("operation_id") for entry in strong_log if isinstance(entry, dict)]
    weak_counts = Counter(weak_ids)
    strong_counts = Counter(strong_ids)

    if weak.get("final_state", {}).get("value") != control.get("stale", {}).get("value"):
        reasons.append("weak_did_not_regress_to_stale_value")
    if weak.get("final_state", {}).get("generation") != 4:
        reasons.append("weak_generation_mismatch")
    if weak_counts.get(control.get("stale", {}).get("operation_id"), 0) != 2:
        reasons.append("weak_missing_duplicate_stale_side_effect")
    if weak.get("stale_results") != ["applied", "applied"]:
        reasons.append("weak_status_mismatch")

    if strong.get("final_state", {}).get("value") != control.get("valid", {}).get("value"):
        reasons.append("strong_final_value_mismatch")
    if strong.get("final_state", {}).get("generation") != 3:
        reasons.append("strong_generation_mismatch")
    if strong.get("stale_results") != ["stale_precondition", "stale_precondition"]:
        reasons.append("strong_stale_replay_not_rejected")
    if strong.get("valid_results") != ["applied", "already_complete"]:
        reasons.append("strong_valid_replay_not_idempotent")
    expected_strong_ids = {
        control.get("current", {}).get("operation_id"),
        control.get("valid", {}).get("operation_id"),
    }
    if set(strong_ids) != expected_strong_ids:
        reasons.append("strong_identity_set_mismatch")
    if any(count != 1 for count in strong_counts.values()):
        reasons.append("strong_duplicate_side_effect")
    if control.get("stale", {}).get("operation_id") in strong_counts:
        reasons.append("strong_stale_side_effect_present")
    if strong.get("stale_replay_write_delta") != 0:
        reasons.append("strong_stale_replay_wrote")
    if strong.get("valid_replay_write_delta") != 0:
        reasons.append("strong_valid_replay_wrote")

    expected_digests = {
        control.get("current", {}).get("intent_digest"),
        control.get("valid", {}).get("intent_digest"),
    }
    actual_digests = {entry.get("intent_digest") for entry in strong_log if isinstance(entry, dict)}
    if actual_digests != expected_digests:
        reasons.append("strong_digest_set_mismatch")

    result = {
        "valid": not reasons,
        "reasons": reasons,
        "weak_duplicate_counts": dict(sorted(weak_counts.items())),
        "strong_identity_set": sorted(value for value in strong_ids if isinstance(value, str)),
        "strong_write_count": len(strong_log),
    }
    print(json.dumps(result, ensure_ascii=False, sort_keys=True))
    return 0 if not reasons else 1


if __name__ == "__main__":
    sys.exit(main())
