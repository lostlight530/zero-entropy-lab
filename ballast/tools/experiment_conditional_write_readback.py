from __future__ import annotations

import json
import subprocess
import sys
import tempfile
import time
from pathlib import Path
from typing import Any


TASK = "controlled-task-2026-08-01"
VERIFY = Path(__file__).with_name("verify_conditional_write_readback.py")
OLD = {"task_id": TASK, "intent_id": "old", "payload": "old-result"}
CLIENT = {"task_id": TASK, "intent_id": "client", "payload": "client-result"}
EXTERNAL = {
    "task_id": TASK,
    "intent_id": "external-current",
    "payload": "external-result",
}


def write_json(path: Path, value: Any) -> None:
    path.write_text(
        json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
        newline="\n",
    )


def new_state() -> dict[str, Any]:
    current = dict(OLD)
    current["revision"] = 1
    return {
        "current": current,
        "write_log": [{"accepted": True, "intent_id": "old", "revision": 1}],
    }


def commit(state: dict[str, Any], value: dict[str, Any]) -> None:
    revision = state["current"]["revision"] + 1
    current = dict(value)
    current["revision"] = revision
    state["current"] = current
    state["write_log"].append(
        {"accepted": True, "intent_id": value["intent_id"], "revision": revision}
    )


def conditional_commit(
    state: dict[str, Any], expected_revision: int, value: dict[str, Any]
) -> bool:
    if state["current"]["revision"] != expected_revision:
        state["write_log"].append(
            {
                "accepted": False,
                "expected_revision": expected_revision,
                "intent_id": value["intent_id"],
            }
        )
        return False
    commit(state, value)
    return True


def verify(state_path: Path, desired_path: Path) -> tuple[int, dict[str, Any]]:
    process = subprocess.run(
        [
            sys.executable,
            str(VERIFY),
            "--state",
            str(state_path),
            "--desired",
            str(desired_path),
            "--task",
            TASK,
        ],
        capture_output=True,
        check=False,
        encoding="utf-8",
    )
    return process.returncode, json.loads(process.stdout)


def blind_overwrite(root: Path) -> dict[str, Any]:
    state_path = root / "state.json"
    desired_path = root / "desired.json"
    state = new_state()
    expected_revision = state["current"]["revision"]
    commit(state, EXTERNAL)
    commit(state, CLIENT)
    write_json(state_path, state)
    write_json(desired_path, EXTERNAL)
    code, verification = verify(state_path, desired_path)
    return {
        "expected_revision": expected_revision,
        "final_intent": state["current"]["intent_id"],
        "lost_update": state["current"]["intent_id"] != EXTERNAL["intent_id"],
        "result_writes": 2,
        "verification": verification,
        "verification_exit": code,
    }


def applied_response_lost(root: Path) -> dict[str, Any]:
    state_path = root / "state.json"
    desired_path = root / "desired.json"
    state = new_state()
    expected_revision = state["current"]["revision"]
    first_applied = conditional_commit(state, expected_revision, CLIENT)
    retry_applied = conditional_commit(state, expected_revision, CLIENT)
    write_json(state_path, state)
    write_json(desired_path, CLIENT)
    code, verification = verify(state_path, desired_path)
    before = state_path.read_bytes()
    replay_writes = 0 if verification["valid"] else 1
    return {
        "first_applied": first_applied,
        "response_received": False,
        "retry_precondition_rejected": not retry_applied,
        "naive_status_success": retry_applied,
        "readback_effective_success": code == 0,
        "replay_unchanged": before == state_path.read_bytes(),
        "replay_writes": replay_writes,
        "result_writes": 1,
        "verification": verification,
    }


def conflicting_advance(root: Path) -> dict[str, Any]:
    state_path = root / "state.json"
    desired_path = root / "desired.json"
    state = new_state()
    expected_revision = state["current"]["revision"]
    commit(state, EXTERNAL)
    retry_applied = conditional_commit(state, expected_revision, CLIENT)
    write_json(state_path, state)
    write_json(desired_path, CLIENT)
    code, verification = verify(state_path, desired_path)
    return {
        "first_applied": False,
        "final_intent": state["current"]["intent_id"],
        "retry_precondition_rejected": not retry_applied,
        "safe_stop": code == 1,
        "result_writes": 1,
        "verification": verification,
    }


def main() -> int:
    started = time.perf_counter()
    temp_path = ""
    with tempfile.TemporaryDirectory(prefix="ballast-conditional-write-") as temporary:
        temp_path = temporary
        root = Path(temporary)
        blind_root = root / "blind"
        applied_root = root / "applied"
        conflict_root = root / "conflict"
        blind_root.mkdir()
        applied_root.mkdir()
        conflict_root.mkdir()
        blind = blind_overwrite(blind_root)
        applied = applied_response_lost(applied_root)
        conflict = conflicting_advance(conflict_root)
        assertions = {
            "blind_retry_loses_current_update": (
                blind["lost_update"] and blind["verification_exit"] == 1
            ),
            "precondition_failure_can_follow_success": (
                applied["first_applied"]
                and applied["retry_precondition_rejected"]
                and not applied["naive_status_success"]
            ),
            "readback_recovers_effective_success": (
                applied["readback_effective_success"]
                and applied["replay_writes"] == 0
                and applied["replay_unchanged"]
            ),
            "readback_distinguishes_conflict": (
                conflict["retry_precondition_rejected"]
                and conflict["safe_stop"]
                and conflict["final_intent"] == EXTERNAL["intent_id"]
            ),
        }
        output = {
            "applied_response_lost": applied,
            "assertions": assertions,
            "blind_overwrite": blind,
            "conflicting_advance": conflict,
            "effective_completion": all(assertions.values()),
            "temp_path": temp_path,
            "verified_elapsed_ms": round((time.perf_counter() - started) * 1000, 3),
        }
        print(json.dumps(output, ensure_ascii=False, indent=2, sort_keys=True))
    cleanup_passed = not Path(temp_path).exists()
    print(json.dumps({"cleanup_passed": cleanup_passed}, sort_keys=True))
    return 0 if output["effective_completion"] and cleanup_passed else 1


if __name__ == "__main__":
    sys.exit(main())
