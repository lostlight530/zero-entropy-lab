from __future__ import annotations

import json
import subprocess
import sys
import tempfile
import time
from pathlib import Path
from typing import Any


VERIFY = Path(__file__).with_name("verify_paginated_snapshot.py")
TASK = "controlled-task-2026-08-03"


def write_json(path: Path, value: Any) -> None:
    path.write_text(
        json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
        newline="\n",
    )


def verify(root: Path, name: str, observed: list[str], baseline: list[str], mode: str) -> dict[str, Any]:
    observed_path = root / f"{name}-observed.json"
    baseline_path = root / f"{name}-baseline.json"
    write_json(observed_path, {"task_id": TASK, "ids": observed})
    write_json(baseline_path, {"task_id": TASK, "ids": baseline})
    process = subprocess.run(
        [
            sys.executable,
            str(VERIFY),
            "--observed",
            str(observed_path),
            "--baseline",
            str(baseline_path),
            "--mode",
            mode,
        ],
        capture_output=True,
        check=False,
        encoding="utf-8",
    )
    result = json.loads(process.stdout)
    result["exit"] = process.returncode
    return result


def ids(items: list[dict[str, Any]]) -> list[str]:
    return [item["id"] for item in items]


def ordered(items: list[dict[str, Any]]) -> list[dict[str, Any]]:
    return sorted(items, key=lambda item: (-item["rank"], item["id"]))


def main() -> int:
    started = time.perf_counter()
    temp_path = ""
    with tempfile.TemporaryDirectory(prefix="ballast-paginated-snapshot-") as temporary:
        temp_path = temporary
        root = Path(temporary)
        initial = [
            {"id": "A", "rank": 40},
            {"id": "B", "rank": 30},
            {"id": "C", "rank": 20},
            {"id": "D", "rank": 10},
        ]
        baseline = ids(ordered(initial))

        page1 = ordered(initial)[:2]
        inserted = initial + [{"id": "X", "rank": 50}]
        offset_page2 = ordered(inserted)[2:4]
        offset_result = ids(page1 + offset_page2)
        offset_count = verify(root, "offset-count", offset_result, baseline, "count")
        offset_identity = verify(root, "offset-identity", offset_result, baseline, "identity")

        cursor_page1 = ordered(initial)[:2]
        cursor_id = cursor_page1[-1]["id"]
        mutated = [
            {"id": item["id"], "rank": 35 if item["id"] == "C" else item["rank"]}
            for item in initial
        ]
        current = ordered(mutated)
        cursor_index = next(index for index, item in enumerate(current) if item["id"] == cursor_id)
        cursor_page2 = current[cursor_index + 1:cursor_index + 3]
        cursor_result = ids(cursor_page1 + cursor_page2)
        cursor_identity = verify(root, "cursor-identity", cursor_result, baseline, "identity")

        snapshot = ordered(initial)
        snapshot_page1 = snapshot[:2]
        snapshot_page2 = snapshot[2:4]
        snapshot_result = ids(snapshot_page1 + snapshot_page2)
        snapshot_identity = verify(root, "snapshot-identity", snapshot_result, baseline, "identity")
        snapshot_replay = verify(root, "snapshot-replay", snapshot_result, baseline, "identity")

        assertions = {
            "offset_count_can_hide_duplicate_and_omission": (
                offset_count["exit"] == 0
                and offset_identity["exit"] == 1
                and len(set(offset_result)) < len(offset_result)
            ),
            "cursor_can_miss_sort_key_move": (
                cursor_identity["exit"] == 1 and "C" not in cursor_result
            ),
            "snapshot_bound_pages_match_baseline": snapshot_identity["exit"] == 0,
            "snapshot_replay_is_consistent": (
                snapshot_replay["exit"] == 0 and snapshot_replay == snapshot_identity
            ),
        }
        output = {
            "assertions": assertions,
            "cursor": {
                "ids": cursor_result,
                "verification": cursor_identity,
            },
            "effective_completion": all(assertions.values()),
            "offset": {
                "count_verification": offset_count,
                "identity_verification": offset_identity,
                "ids": offset_result,
            },
            "snapshot": {
                "ids": snapshot_result,
                "replay_writes": 0,
                "verification": snapshot_identity,
            },
            "temp_path": temp_path,
            "verification_processes": 5,
            "verified_elapsed_ms": round((time.perf_counter() - started) * 1000, 3),
        }
        print(json.dumps(output, ensure_ascii=False, indent=2, sort_keys=True))
    cleanup_passed = not Path(temp_path).exists()
    print(json.dumps({"cleanup_passed": cleanup_passed}, sort_keys=True))
    return 0 if output["effective_completion"] and cleanup_passed else 1


if __name__ == "__main__":
    sys.exit(main())
