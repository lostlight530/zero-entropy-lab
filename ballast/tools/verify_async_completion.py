from __future__ import annotations

import argparse
import hashlib
import json
import sys
from pathlib import Path


def digest_intent(items: list[dict[str, object]]) -> str:
    encoded = json.dumps(items, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--status", required=True, type=Path)
    parser.add_argument("--artifact", required=True, type=Path)
    parser.add_argument("--operation-id", required=True)
    parser.add_argument("--intent-digest", required=True)
    parser.add_argument("--expected-count", required=True, type=int)
    args = parser.parse_args()
    reasons: list[str] = []
    if not args.status.is_file():
        reasons.append("missing_status")
    if not args.artifact.is_file():
        reasons.append("missing_artifact")
    if args.status.is_file():
        status = json.loads(args.status.read_text(encoding="utf-8"))
        if status.get("operation_id") != args.operation_id:
            reasons.append("status_operation_mismatch")
        if status.get("state") != "Succeeded":
            reasons.append("nonterminal_status")
        if status.get("intent_digest") != args.intent_digest:
            reasons.append("status_intent_mismatch")
    if args.artifact.is_file():
        artifact = json.loads(args.artifact.read_text(encoding="utf-8"))
        items = artifact.get("items")
        if artifact.get("operation_id") != args.operation_id:
            reasons.append("artifact_operation_mismatch")
        if artifact.get("intent_digest") != args.intent_digest:
            reasons.append("artifact_intent_mismatch")
        if not isinstance(items, list):
            reasons.append("invalid_items")
        else:
            if len(items) != args.expected_count:
                reasons.append("count_mismatch")
            if digest_intent(items) != args.intent_digest:
                reasons.append("content_digest_mismatch")
    print(json.dumps({"valid": not reasons, "reasons": reasons}, sort_keys=True))
    return 0 if not reasons else 1


if __name__ == "__main__":
    sys.exit(main())
