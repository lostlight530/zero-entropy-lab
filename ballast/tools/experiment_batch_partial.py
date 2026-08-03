from __future__ import annotations

import json
import subprocess
import sys
import tempfile
import time
from pathlib import Path
from typing import Any


VERIFY = Path(__file__).with_name("verify_batch_partial.py")
TASK = "controlled-task-2026-08-04"
ENTRIES = (
    {"id": "A", "payload": "alpha"},
    {"id": "B", "payload": "bravo"},
    {"id": "C", "payload": "charlie"},
)


def write_json(path: Path, value: Any) -> None:
    path.write_text(
        json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
        newline="\n",
    )


class BatchService:
    def __init__(self) -> None:
        self.calls = 0
        self.journal: list[dict[str, str]] = []

    def send(
        self,
        entries: tuple[dict[str, str], ...],
        failed_ids: set[str] | None = None,
    ) -> dict[str, Any]:
        failed_ids = failed_ids or set()
        self.calls += 1
        outcomes: list[dict[str, str]] = []
        for entry in entries:
            if entry["id"] in failed_ids:
                outcomes.append({"id": entry["id"], "status": "failed"})
            else:
                self.journal.append(dict(entry))
                outcomes.append({"id": entry["id"], "status": "successful"})
        return {"http_status": 200, "outcomes": outcomes}


def verify(
    root: Path,
    name: str,
    response: dict[str, Any],
    journal: list[dict[str, str]],
    mode: str,
) -> dict[str, Any]:
    manifest_path = root / f"{name}-manifest.json"
    observed_path = root / f"{name}-observed.json"
    write_json(manifest_path, {"task_id": TASK, "entries": ENTRIES})
    write_json(
        observed_path,
        {
            "task_id": TASK,
            "http_status": response["http_status"],
            "outcomes": response["outcomes"],
            "journal": journal,
        },
    )
    process = subprocess.run(
        [
            sys.executable,
            str(VERIFY),
            "--manifest",
            str(manifest_path),
            "--observed",
            str(observed_path),
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


def main() -> int:
    started = time.perf_counter()
    temp_path = ""
    with tempfile.TemporaryDirectory(prefix="ballast-batch-partial-") as temporary:
        temp_path = temporary
        root = Path(temporary)

        initial = BatchService()
        partial = initial.send(ENTRIES, {"B"})
        transport_only = verify(root, "partial-transport", partial, initial.journal, "transport")
        partial_complete = verify(root, "partial-complete", partial, initial.journal, "complete")

        naive = BatchService()
        naive.send(ENTRIES, {"B"})
        naive_final = naive.send(ENTRIES)
        naive_complete = verify(root, "naive-complete", naive_final, naive.journal, "complete")

        reconciled = BatchService()
        reconciled_first = reconciled.send(ENTRIES, {"B"})
        failed_ids = {
            outcome["id"]
            for outcome in reconciled_first["outcomes"]
            if outcome["status"] == "failed"
        }
        retry_entries = tuple(entry for entry in ENTRIES if entry["id"] in failed_ids)
        reconciled_final = reconciled.send(retry_entries)
        combined_outcomes = [
            outcome
            for outcome in reconciled_first["outcomes"]
            if outcome["status"] == "successful"
        ] + reconciled_final["outcomes"]
        combined_response = {"http_status": 200, "outcomes": combined_outcomes}
        reconciled_complete = verify(
            root,
            "reconciled-complete",
            combined_response,
            reconciled.journal,
            "complete",
        )
        calls_before_replay = reconciled.calls
        writes_before_replay = len(reconciled.journal)
        replay_complete = verify(
            root,
            "replay-complete",
            combined_response,
            reconciled.journal,
            "complete",
        )
        replay_calls = reconciled.calls - calls_before_replay
        replay_writes = len(reconciled.journal) - writes_before_replay

        assertions = {
            "transport_success_can_hide_item_failure": (
                transport_only["exit"] == 0
                and partial_complete["exit"] == 1
                and len(partial["outcomes"]) == len(ENTRIES)
            ),
            "whole_batch_retry_duplicates_successes": (
                naive_complete["exit"] == 1
                and [entry["id"] for entry in naive.journal].count("A") == 2
                and [entry["id"] for entry in naive.journal].count("C") == 2
            ),
            "item_reconciliation_completes_once": reconciled_complete["exit"] == 0,
            "verified_replay_has_zero_side_effects": (
                replay_complete["exit"] == 0
                and replay_calls == 0
                and replay_writes == 0
            ),
        }
        output = {
            "assertions": assertions,
            "effective_completion": all(assertions.values()),
            "naive": {
                "calls": naive.calls,
                "duplicate_writes": len(naive.journal) - len(ENTRIES),
                "journal_ids": [entry["id"] for entry in naive.journal],
                "verification": naive_complete,
            },
            "partial": {
                "http_status": partial["http_status"],
                "journal_ids": [entry["id"] for entry in initial.journal],
                "outcomes": partial["outcomes"],
                "strong_verification": partial_complete,
                "transport_verification": transport_only,
            },
            "reconciled": {
                "calls": reconciled.calls,
                "journal_ids": [entry["id"] for entry in reconciled.journal],
                "replay_calls": replay_calls,
                "replay_writes": replay_writes,
                "retried_ids": sorted(failed_ids),
                "verification": reconciled_complete,
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
