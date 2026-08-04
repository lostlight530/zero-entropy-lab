from __future__ import annotations

import argparse
import hashlib
import json
import sys
from pathlib import Path
from typing import Any


def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--artifact", required=True, type=Path)
    parser.add_argument("--expected-digest", required=True)
    parser.add_argument("--required-id", required=True)
    args = parser.parse_args()

    reasons: list[str] = []
    raw = args.artifact.read_bytes()
    actual_digest = digest(raw)
    try:
        document: Any = json.loads(raw.decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError):
        document = {}
        reasons.append("invalid_json")

    if actual_digest != args.expected_digest:
        reasons.append("digest_mismatch")
    if document.get("status") != "complete":
        reasons.append("status_not_complete")
    items = document.get("items", [])
    if not isinstance(items, list):
        reasons.append("items_not_list")
        items = []
    ids = [item.get("id") for item in items if isinstance(item, dict)]
    if args.required_id not in ids:
        reasons.append("missing_required_id:" + args.required_id)
    if len(ids) != len(set(ids)):
        reasons.append("duplicate_ids")

    output = {
        "actual_digest": actual_digest,
        "expected_digest": args.expected_digest,
        "ids": ids,
        "reasons": reasons,
        "valid": not reasons,
    }
    print(json.dumps(output, ensure_ascii=False, sort_keys=True))
    return 0 if output["valid"] else 1


if __name__ == "__main__":
    sys.exit(main())
