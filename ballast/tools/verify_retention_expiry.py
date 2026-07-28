from __future__ import annotations

import argparse
import hashlib
import json
import sys
from pathlib import Path
from typing import Any


def canonical_digest(value: Any) -> str:
    encoded = json.dumps(
        value, ensure_ascii=False, separators=(",", ":"), sort_keys=True
    ).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()


def validate(
    resources_path: Path,
    journal_path: Path,
    correlation_id: str,
    token: str,
    current_intent: dict[str, Any],
) -> dict[str, Any]:
    reasons: list[str] = []
    try:
        resources = json.loads(resources_path.read_text(encoding="utf-8"))
        journal = json.loads(journal_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        return {"valid": False, "reasons": [f"state_read_failed:{type(error).__name__}"]}
    if not isinstance(resources, list):
        reasons.append("resources_not_list")
        resources = []
    if not isinstance(journal, dict):
        reasons.append("journal_not_object")
        journal = {}

    expected_digest = canonical_digest(current_intent)
    if journal.get("correlation_id") != correlation_id:
        reasons.append("journal_correlation_mismatch")
    if journal.get("request_token") != token:
        reasons.append("journal_token_mismatch")
    if journal.get("intent_sha256") != expected_digest:
        reasons.append("journal_intent_mismatch")

    same_marker = [
        item
        for item in resources
        if isinstance(item, dict) and item.get("correlation_id") == correlation_id
    ]
    exact = [
        item
        for item in same_marker
        if item.get("intent") == current_intent
        and item.get("created_by_token") == token
    ]
    conflicts = [item for item in same_marker if item not in exact]
    if len(exact) != 1:
        reasons.append("exact_resource_count_mismatch")
    if conflicts:
        reasons.append("conflicting_marker_resource")
    result_ids = [
        item.get("resource_id") for item in exact if isinstance(item.get("resource_id"), str)
    ]
    if len(result_ids) != len(set(result_ids)):
        reasons.append("duplicate_resource_id")

    return {
        "valid": not reasons,
        "reasons": reasons,
        "marker_resource_count": len(same_marker),
        "exact_resource_count": len(exact),
        "conflicting_resource_count": len(conflicts),
        "expected_intent_sha256": expected_digest,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--resources", required=True, type=Path)
    parser.add_argument("--journal", required=True, type=Path)
    parser.add_argument("--correlation-id", required=True)
    parser.add_argument("--token", required=True)
    parser.add_argument("--intent-json", required=True)
    args = parser.parse_args()
    try:
        intent = json.loads(args.intent_json)
    except json.JSONDecodeError as error:
        print(json.dumps({"valid": False, "reasons": [f"intent_invalid:{error.msg}"]}))
        return 2
    if not isinstance(intent, dict):
        print(json.dumps({"valid": False, "reasons": ["intent_not_object"]}))
        return 2
    result = validate(
        args.resources,
        args.journal,
        args.correlation_id,
        args.token,
        intent,
    )
    print(json.dumps(result, ensure_ascii=False, sort_keys=True))
    return 0 if result["valid"] else 1


if __name__ == "__main__":
    sys.exit(main())
