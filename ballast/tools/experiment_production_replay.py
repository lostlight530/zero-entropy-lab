from __future__ import annotations

import hashlib
import json
import subprocess
import sys
import tempfile
import time
from pathlib import Path
from typing import Any, Callable


ROOT = Path(__file__).resolve().parent
VERIFIER = ROOT / "verify_production_replay.py"


def digest_operation(operation: dict[str, Any]) -> str:
    payload = {
        "operation_id": operation["operation_id"],
        "expected_generation": operation["expected_generation"],
        "value": operation["value"],
    }
    encoded = json.dumps(payload, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()


def write_json(path: Path, value: dict[str, Any]) -> None:
    path.write_text(json.dumps(value, ensure_ascii=False, sort_keys=True, indent=2), encoding="utf-8")


def read_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def initialize(state_path: Path) -> None:
    write_json(state_path, {"generation": 1, "value": 10, "side_effect_log": [], "completions": {}})


def weak_entry(state_path: Path, operation: dict[str, Any]) -> str:
    state = read_json(state_path)
    state["generation"] += 1
    state["value"] = operation["value"]
    state["side_effect_log"].append(
        {
            "operation_id": operation["operation_id"],
            "intent_digest": operation["intent_digest"],
            "result_generation": state["generation"],
        }
    )
    write_json(state_path, state)
    return "applied"


def strong_entry(state_path: Path, operation: dict[str, Any]) -> str:
    state = read_json(state_path)
    completion = state["completions"].get(operation["operation_id"])
    if completion is not None:
        if (
            completion.get("intent_digest") == operation["intent_digest"]
            and completion.get("result_generation") == state["generation"]
            and state["value"] == operation["value"]
        ):
            return "already_complete"
        return "operation_conflict"
    if state["generation"] != operation["expected_generation"]:
        return "stale_precondition"
    state["generation"] += 1
    state["value"] = operation["value"]
    entry = {
        "operation_id": operation["operation_id"],
        "intent_digest": operation["intent_digest"],
        "result_generation": state["generation"],
    }
    state["side_effect_log"].append(entry)
    state["completions"][operation["operation_id"]] = entry
    write_json(state_path, state)
    return "applied"


def build_control() -> dict[str, Any]:
    control: dict[str, Any] = {
        "task_id": "production-replay-001",
        "initial": {"generation": 1, "value": 10},
        "current": {"operation_id": "op-current", "expected_generation": 1, "value": 20},
        "stale": {"operation_id": "op-stale", "expected_generation": 1, "value": 11},
        "valid": {"operation_id": "op-valid", "expected_generation": 2, "value": 21},
    }
    for name in ("current", "stale", "valid"):
        control[name]["intent_digest"] = digest_operation(control[name])
    return control


def observe(path: Path, stale_results: list[str], valid_results: list[str] | None = None) -> dict[str, Any]:
    state = read_json(path)
    return {
        "final_state": {"generation": state["generation"], "value": state["value"]},
        "side_effect_log": state["side_effect_log"],
        "stale_results": stale_results,
        "valid_results": valid_results or [],
    }


def run_path(
    state_path: Path,
    entry: Callable[[Path, dict[str, Any]], str],
    control: dict[str, Any],
    strong: bool,
) -> dict[str, Any]:
    initialize(state_path)
    current_result = entry(state_path, control["current"])
    before_stale = len(read_json(state_path)["side_effect_log"])
    stale_first = entry(state_path, control["stale"])
    stale_second = entry(state_path, control["stale"])
    after_stale = len(read_json(state_path)["side_effect_log"])
    observation = observe(state_path, [stale_first, stale_second])
    observation["current_result"] = current_result
    observation["stale_replay_write_delta"] = after_stale - before_stale
    if strong:
        before_valid = len(read_json(state_path)["side_effect_log"])
        valid_first = entry(state_path, control["valid"])
        before_valid_replay = len(read_json(state_path)["side_effect_log"])
        valid_second = entry(state_path, control["valid"])
        after_valid_replay = len(read_json(state_path)["side_effect_log"])
        observation = observe(state_path, [stale_first, stale_second], [valid_first, valid_second])
        observation["current_result"] = current_result
        observation["stale_replay_write_delta"] = after_stale - before_stale
        observation["valid_apply_write_delta"] = before_valid_replay - before_valid
        observation["valid_replay_write_delta"] = after_valid_replay - before_valid_replay
    return observation


def main() -> int:
    started = time.perf_counter()
    with tempfile.TemporaryDirectory(prefix="ballast-production-replay-") as temp_name:
        temp = Path(temp_name)
        control_path = temp / "control.json"
        weak_path = temp / "weak.json"
        strong_path = temp / "strong.json"
        control = build_control()
        write_json(control_path, control)

        weak_state = temp / "weak-state.json"
        strong_state = temp / "strong-state.json"
        weak = run_path(weak_state, weak_entry, control, strong=False)
        strong = run_path(strong_state, strong_entry, control, strong=True)
        write_json(weak_path, weak)
        write_json(strong_path, strong)

        completed = subprocess.run(
            [
                sys.executable,
                str(VERIFIER),
                "--control",
                str(control_path),
                "--weak",
                str(weak_path),
                "--strong",
                str(strong_path),
            ],
            check=False,
            capture_output=True,
            text=True,
            encoding="utf-8",
        )
        verification = json.loads(completed.stdout)
        assertions = {
            "weak_reports_success_but_regresses": weak["stale_results"] == ["applied", "applied"]
            and weak["final_state"]["value"] == control["stale"]["value"],
            "weak_replay_duplicates_side_effect": weak["stale_replay_write_delta"] == 2,
            "strong_rejects_stale_replay": strong["stale_results"] == ["stale_precondition", "stale_precondition"]
            and strong["stale_replay_write_delta"] == 0,
            "strong_replays_valid_operation_idempotently": strong["valid_results"] == ["applied", "already_complete"]
            and strong["valid_replay_write_delta"] == 0,
            "independent_verifier_accepts": completed.returncode == 0 and verification["valid"] is True,
        }
        result = {
            "control": control,
            "weak": weak,
            "strong": strong,
            "verification": verification,
            "independent_verifier_processes": 1,
            "assertions": assertions,
            "elapsed_ms": round((time.perf_counter() - started) * 1000, 3),
        }
        print(json.dumps(result, ensure_ascii=False, sort_keys=True, indent=2))
        return 0 if all(assertions.values()) else 1


if __name__ == "__main__":
    sys.exit(main())
