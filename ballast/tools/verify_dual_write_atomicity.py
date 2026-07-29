from __future__ import annotations

import argparse
import hashlib
import json
import sys
from pathlib import Path
from typing import Any


def read_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def intent_digest(intent: dict[str, Any]) -> str:
    encoded = json.dumps(
        intent, ensure_ascii=False, sort_keys=True, separators=(",", ":")
    ).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()


def main() -> int:
    parser = argparse.ArgumentParser()
    source = parser.add_mutually_exclusive_group(required=True)
    source.add_argument("--snapshot", type=Path)
    source.add_argument("--resources", type=Path)
    parser.add_argument("--receipts", type=Path)
    parser.add_argument("--intent", required=True, type=Path)
    parser.add_argument("--token", required=True)
    args = parser.parse_args()

    if args.resources is not None and args.receipts is None:
        parser.error("--receipts is required with --resources")
    if args.snapshot is not None and args.receipts is not None:
        parser.error("--receipts cannot be used with --snapshot")

    if args.snapshot is not None:
        state = read_json(args.snapshot)
        resources = state.get("resources")
        receipts = state.get("receipts")
    else:
        resources = read_json(args.resources)
        receipts = read_json(args.receipts)

    intent = read_json(args.intent)
    reasons: list[str] = []
    if not isinstance(resources, list):
        reasons.append("resources_not_list")
        resources = []
    if not isinstance(receipts, dict):
        reasons.append("receipts_not_object")
        receipts = {}

    expected_digest = intent_digest(intent)
    matching = [
        item for item in resources
        if isinstance(item, dict)
        and item.get("token") == args.token
        and item.get("intent_digest") == expected_digest
    ]
    if len(matching) != 1:
        reasons.append("exact_resource_count_mismatch")

    receipt = receipts.get(args.token)
    if not isinstance(receipt, dict):
        reasons.append("receipt_missing")
    else:
        if receipt.get("intent_digest") != expected_digest:
            reasons.append("receipt_intent_mismatch")
        if len(matching) == 1 and receipt.get("result_id") != matching[0].get("id"):
            reasons.append("receipt_result_mismatch")

    conflicting = [
        item for item in resources
        if isinstance(item, dict)
        and item.get("token") == args.token
        and item.get("intent_digest") != expected_digest
    ]
    if conflicting:
        reasons.append("conflicting_token_resource")

    result = {
        "valid": not reasons,
        "matching_resources": len(matching),
        "conflicting_resources": len(conflicting),
        "receipt_present": isinstance(receipt, dict),
        "reasons": reasons,
    }
    print(json.dumps(result, ensure_ascii=False, sort_keys=True))
    return 0 if result["valid"] else 1


if __name__ == "__main__":
    sys.exit(main())
