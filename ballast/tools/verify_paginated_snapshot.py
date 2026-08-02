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
    parser.add_argument("--baseline", required=True, type=Path)
    parser.add_argument("--mode", choices=("count", "identity"), required=True)
    args = parser.parse_args()

    observed = read_json(args.observed)
    baseline = read_json(args.baseline)
    observed_ids = observed.get("ids", [])
    baseline_ids = baseline.get("ids", [])
    reasons: list[str] = []
    if observed.get("task_id") != baseline.get("task_id"):
        reasons.append("task_mismatch")
    if len(observed_ids) != len(baseline_ids):
        reasons.append("count_mismatch")
    if args.mode == "identity":
        if len(set(observed_ids)) != len(observed_ids):
            reasons.append("duplicate_ids")
        missing = sorted(set(baseline_ids) - set(observed_ids))
        unexpected = sorted(set(observed_ids) - set(baseline_ids))
        if missing:
            reasons.append("missing_ids:" + ",".join(missing))
        if unexpected:
            reasons.append("unexpected_ids:" + ",".join(unexpected))
        if observed_ids != baseline_ids:
            reasons.append("order_or_identity_mismatch")

    output = {
        "baseline_count": len(baseline_ids),
        "mode": args.mode,
        "observed_count": len(observed_ids),
        "reasons": reasons,
        "valid": not reasons,
    }
    print(json.dumps(output, ensure_ascii=False, sort_keys=True))
    return 0 if output["valid"] else 1


if __name__ == "__main__":
    sys.exit(main())
