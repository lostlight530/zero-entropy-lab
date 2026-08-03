from __future__ import annotations

import argparse
import hashlib
import json
import sys
from pathlib import Path
from typing import Any


def read_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def digest(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--manifest", required=True, type=Path)
    parser.add_argument("--observed", required=True, type=Path)
    parser.add_argument("--mode", choices=("transport", "complete"), required=True)
    args = parser.parse_args()

    manifest = read_json(args.manifest)
    observed = read_json(args.observed)
    expected_entries = manifest.get("entries", [])
    outcomes = observed.get("outcomes", [])
    journal = observed.get("journal", [])
    reasons: list[str] = []

    if observed.get("task_id") != manifest.get("task_id"):
        reasons.append("task_mismatch")
    if observed.get("http_status") != 200:
        reasons.append("transport_status")
    if len(outcomes) != len(expected_entries):
        reasons.append("reported_count_mismatch")

    if args.mode == "complete":
        expected = {entry["id"]: digest(entry["payload"]) for entry in expected_entries}
        actual_ids = [entry.get("id") for entry in journal]
        if len(actual_ids) != len(set(actual_ids)):
            reasons.append("duplicate_side_effects")
        missing = sorted(set(expected) - set(actual_ids))
        unexpected = sorted(set(actual_ids) - set(expected))
        if missing:
            reasons.append("missing_ids:" + ",".join(missing))
        if unexpected:
            reasons.append("unexpected_ids:" + ",".join(unexpected))
        for entry in journal:
            item_id = entry.get("id")
            if item_id in expected and digest(entry.get("payload", "")) != expected[item_id]:
                reasons.append("payload_mismatch:" + item_id)
        failed = sorted(
            outcome.get("id", "")
            for outcome in outcomes
            if outcome.get("status") != "successful"
        )
        if failed:
            reasons.append("failed_outcomes:" + ",".join(failed))

    output = {
        "expected_count": len(expected_entries),
        "journal_count": len(journal),
        "mode": args.mode,
        "reasons": reasons,
        "reported_count": len(outcomes),
        "valid": not reasons,
    }
    print(json.dumps(output, ensure_ascii=False, sort_keys=True))
    return 0 if output["valid"] else 1


if __name__ == "__main__":
    sys.exit(main())
