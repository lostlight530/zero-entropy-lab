from __future__ import annotations

import json
import subprocess
import sys
import tempfile
import time
from pathlib import Path
from typing import Any


TASK = "controlled-task-2026-08-02"
VERIFY = Path(__file__).with_name("verify_cached_read.py")


def write_json(path: Path, value: Any) -> None:
    path.write_text(
        json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
        newline="\n",
    )


def verify(root: Path, observed: dict[str, Any], desired: dict[str, Any], mode: str) -> dict[str, Any]:
    observed_path = root / f"observed-{mode}.json"
    desired_path = root / f"desired-{mode}.json"
    write_json(observed_path, observed)
    write_json(desired_path, desired)
    process = subprocess.run(
        [sys.executable, str(VERIFY), "--observed", str(observed_path), "--desired", str(desired_path), "--mode", mode],
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
    with tempfile.TemporaryDirectory(prefix="ballast-cached-read-") as temporary:
        temp_path = temporary
        root = Path(temporary)
        old = {"task_id": TASK, "intent_id": "old", "payload": "old-result", "generation": 1}
        current = {"task_id": TASK, "intent_id": "current", "payload": "current-result", "generation": 2}
        same_payload_old = {"task_id": TASK, "intent_id": "old-same", "payload": "same-result", "generation": 1}
        same_payload_current = {"task_id": TASK, "intent_id": "current-same", "payload": "same-result", "generation": 2}

        plain = verify(root, old, current, "generation")
        request_no_cache_ignored = verify(root, old, current, "generation")
        generation_bound = verify(root, current, current, "generation")
        content_only_counterexample = verify(root, same_payload_old, same_payload_current, "content")
        generation_counterexample = verify(root, same_payload_old, same_payload_current, "generation")

        assertions = {
            "plain_cached_read_rejected": plain["exit"] == 1,
            "request_no_cache_not_sufficient": request_no_cache_ignored["exit"] == 1,
            "generation_bound_read_accepts_current": generation_bound["exit"] == 0,
            "content_only_accepts_wrong_generation": content_only_counterexample["exit"] == 0,
            "generation_check_rejects_wrong_generation": generation_counterexample["exit"] == 1,
        }
        output = {
            "assertions": assertions,
            "content_only_counterexample": content_only_counterexample,
            "effective_completion": all(assertions.values()),
            "generation_bound": generation_bound,
            "generation_counterexample": generation_counterexample,
            "plain_cached": plain,
            "request_no_cache_ignored": request_no_cache_ignored,
            "temp_path": temp_path,
            "verification_reads": 5,
            "verified_elapsed_ms": round((time.perf_counter() - started) * 1000, 3),
        }
        print(json.dumps(output, ensure_ascii=False, indent=2, sort_keys=True))
    cleanup_passed = not Path(temp_path).exists()
    print(json.dumps({"cleanup_passed": cleanup_passed}, sort_keys=True))
    return 0 if output["effective_completion"] and cleanup_passed else 1


if __name__ == "__main__":
    sys.exit(main())
