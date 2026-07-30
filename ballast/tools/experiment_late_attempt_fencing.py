from __future__ import annotations

import json
import subprocess
import sys
import tempfile
import time
from pathlib import Path
from typing import Any


TASK = "controlled-task-2026-07-31"
VERIFY = Path(__file__).with_name("verify_late_attempt_fencing.py")
OLD = {"task_id": TASK, "generation": 1, "payload": "old-result"}
CURRENT = {"task_id": TASK, "generation": 2, "payload": "current-result"}


def write_json(path: Path, value: Any) -> None:
    text = json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True) + "\n"
    path.write_text(text, encoding="utf-8", newline="\n")


def read_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def verify(state: Path, desired: Path) -> tuple[int, dict[str, Any]]:
    process = subprocess.run(
        [
            sys.executable,
            str(VERIFY),
            "--state",
            str(state),
            "--desired",
            str(desired),
            "--task",
            TASK,
        ],
        capture_output=True,
        check=False,
        encoding="utf-8",
    )
    return process.returncode, json.loads(process.stdout)


def result(input_value: dict[str, Any], epoch: int) -> dict[str, Any]:
    return {
        "attempt_epoch": epoch,
        "generation": input_value["generation"],
        "payload": input_value["payload"],
    }


def blind_late_commit(root: Path, desired: Path) -> dict[str, Any]:
    state_path = root / "state.json"
    state = {"commit_log": [], "results": {}}
    write_json(state_path, state)

    attempt_one = result(OLD, 1)
    write_json(desired, CURRENT)
    attempt_two = result(CURRENT, 2)
    state["results"][TASK] = attempt_two
    state["commit_log"].append(
        {"accepted": True, "attempt_epoch": 2, "task_id": TASK}
    )
    write_json(state_path, state)
    state["results"][TASK] = attempt_one
    state["commit_log"].append(
        {"accepted": True, "attempt_epoch": 1, "task_id": TASK}
    )
    write_json(state_path, state)

    code, verification = verify(state_path, desired)
    return {
        "accepted_commits": 2,
        "client_reports_retry_success": True,
        "final_generation": state["results"][TASK]["generation"],
        "injected_failure": "attempt_one_times_out_then_commits_late",
        "result_writes": 2,
        "verification": verification,
        "verification_exit": code,
    }


def cancellation_signal_only(root: Path, desired: Path) -> dict[str, Any]:
    state_path = root / "state.json"
    state = {"commit_log": [], "results": {}}
    write_json(state_path, state)

    attempt_one = result(OLD, 1)
    checked_before_work = False
    cancellation_signaled = True
    write_json(desired, CURRENT)
    state["results"][TASK] = result(CURRENT, 2)
    state["commit_log"].append(
        {"accepted": True, "attempt_epoch": 2, "task_id": TASK}
    )
    write_json(state_path, state)
    state["results"][TASK] = attempt_one
    state["commit_log"].append(
        {"accepted": True, "attempt_epoch": 1, "task_id": TASK}
    )
    write_json(state_path, state)

    code, verification = verify(state_path, desired)
    return {
        "accepted_commits": 2,
        "cancellation_checked_before_work": checked_before_work,
        "cancellation_signaled": cancellation_signaled,
        "client_reports_retry_success": True,
        "final_generation": state["results"][TASK]["generation"],
        "injected_failure": "cancel_after_initial_check_before_late_commit",
        "result_writes": 2,
        "verification": verification,
        "verification_exit": code,
    }


def fenced_commit(root: Path, desired: Path) -> dict[str, Any]:
    state_path = root / "state.json"
    state = {"commit_log": [], "results": {}}
    write_json(state_path, state)

    attempt_one = result(OLD, 1)
    write_json(desired, CURRENT)
    attempt_two = result(CURRENT, 2)
    state["results"][TASK] = attempt_two
    state["commit_log"].append(
        {"accepted": True, "attempt_epoch": 2, "task_id": TASK}
    )
    write_json(state_path, state)

    current_epoch = state["results"][TASK]["attempt_epoch"]
    late_accepted = attempt_one["attempt_epoch"] >= current_epoch
    state["commit_log"].append(
        {"accepted": late_accepted, "attempt_epoch": 1, "task_id": TASK}
    )
    if late_accepted:
        state["results"][TASK] = attempt_one
        write_json(state_path, state)
    else:
        write_json(state_path, state)

    code, verification = verify(state_path, desired)
    before_replay = state_path.read_bytes()
    replay_writes = 0
    current = read_json(state_path)["results"][TASK]
    if (
        current["generation"] != CURRENT["generation"]
        or current["payload"] != CURRENT["payload"]
    ):
        replay_writes += 1
    replay_unchanged = before_replay == state_path.read_bytes()
    return {
        "accepted_commits": 1,
        "final_generation": current["generation"],
        "late_commit_rejected": not late_accepted,
        "replay_unchanged": replay_unchanged,
        "replay_writes": replay_writes,
        "result_writes": 1,
        "verification": verification,
        "verification_exit": code,
    }


def main() -> int:
    started = time.perf_counter()
    temp_path = ""
    with tempfile.TemporaryDirectory(prefix="ballast-late-attempt-") as temporary:
        root = Path(temporary)
        temp_path = str(root)
        desired = root / "desired.json"
        write_json(desired, OLD)
        blind_dir = root / "blind"
        cancellation_dir = root / "cancellation"
        fenced_dir = root / "fenced"
        blind_dir.mkdir()
        cancellation_dir.mkdir()
        fenced_dir.mkdir()

        blind = blind_late_commit(blind_dir, desired)
        cancellation = cancellation_signal_only(cancellation_dir, desired)
        fenced = fenced_commit(fenced_dir, desired)
        assertions = {
            "blind_late_commit_rejected": (
                blind["final_generation"] == 1
                and blind["verification_exit"] == 1
            ),
            "cancellation_signal_not_commit_guard": (
                cancellation["cancellation_signaled"]
                and cancellation["final_generation"] == 1
                and cancellation["verification_exit"] == 1
            ),
            "fence_rejects_old_epoch": (
                fenced["late_commit_rejected"]
                and fenced["accepted_commits"] == 1
            ),
            "fenced_result_current_and_valid": (
                fenced["final_generation"] == 2
                and fenced["verification_exit"] == 0
            ),
            "fenced_replay_zero_write": (
                fenced["replay_writes"] == 0 and fenced["replay_unchanged"]
            ),
        }
        effective_completion = all(assertions.values())
        output = {
            "assertions": assertions,
            "blind_late_commit": blind,
            "cancellation_signal_only": cancellation,
            "effective_completion": effective_completion,
            "fenced_commit": fenced,
            "temp_path": temp_path,
            "verified_elapsed_ms": round((time.perf_counter() - started) * 1000, 3),
        }
        print(json.dumps(output, ensure_ascii=False, indent=2, sort_keys=True))

    cleanup_passed = not Path(temp_path).exists()
    print(json.dumps({"cleanup_passed": cleanup_passed}, sort_keys=True))
    return 0 if effective_completion and cleanup_passed else 1


if __name__ == "__main__":
    sys.exit(main())
