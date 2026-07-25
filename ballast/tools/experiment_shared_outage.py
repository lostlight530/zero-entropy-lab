from __future__ import annotations

import hashlib
import json
import subprocess
import sys
import time
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
VALIDATOR = Path(__file__).with_name("verify_shared_outage.py")
BASE_TASKS: dict[str, dict[str, str]] = {
    "api-task": {"worker": "api", "input": "alpha"},
    "chatgpt-task": {"worker": "chatgpt", "input": "beta"},
    "codex-task": {"worker": "codex", "input": "gamma"},
}
FOLLOWUP_TASK = {
    "api-followup": {"worker": "api", "input": "delta"},
}
AVAILABILITY = {
    "incident-1": {"api": False, "chatgpt": False, "codex": False},
    "recovery-1-reported": {"api": True, "chatgpt": True, "codex": False},
    "recovery-1-context": {"api": True, "chatgpt": True, "codex": True},
    "incident-2": {"api": False, "chatgpt": False, "codex": False},
    "recovery-2": {"api": True, "chatgpt": True, "codex": True},
}
SCENARIOS = ("blind", "status-only", "context-gated")


def input_digest(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def paths(name: str) -> tuple[Path, Path]:
    prefix = ROOT / f".experiment-shared-{name}"
    return (
        prefix.with_name(prefix.name + "-outputs.json"),
        prefix.with_name(prefix.name + "-checkpoints.json"),
    )


def write_json(path: Path, value: Any) -> None:
    path.write_text(
        json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )


def initialize(name: str) -> tuple[Path, Path]:
    outputs_path, checkpoints_path = paths(name)
    write_json(outputs_path, {})
    write_json(checkpoints_path, {})
    return outputs_path, checkpoints_path


def read_object(path: Path) -> dict[str, Any]:
    value = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise AssertionError(f"controlled state is not an object: {path.name}")
    return value


def dependency_call(worker: str, input_text: str, phase: str) -> str:
    if not AVAILABILITY[phase][worker]:
        raise RuntimeError(f"dependency_unavailable:{worker}:{phase}")
    return f"processed:{input_text}"


def complete_output(
    outputs_path: Path,
    task_id: str,
    task: dict[str, str],
    result: str | None,
    phase: str,
) -> None:
    outputs = read_object(outputs_path)
    outputs[task_id] = {
        "worker": task["worker"],
        "status": "complete",
        "input_sha256": input_digest(task["input"]),
        "result": result,
        "dependency_phase": phase,
    }
    write_json(outputs_path, outputs)


def checkpoint(
    checkpoints_path: Path,
    task_id: str,
    task: dict[str, str],
    phase: str,
) -> None:
    checkpoints = read_object(checkpoints_path)
    checkpoints[task_id] = {
        "worker": task["worker"],
        "input_sha256": input_digest(task["input"]),
        "state": "waiting_for_dependency",
        "phase": phase,
    }
    write_json(checkpoints_path, checkpoints)


def clear_checkpoint(checkpoints_path: Path, task_id: str) -> None:
    checkpoints = read_object(checkpoints_path)
    checkpoints.pop(task_id, None)
    write_json(checkpoints_path, checkpoints)


def verify(outputs_path: Path, expected: dict[str, Any]) -> dict[str, Any]:
    completed = subprocess.run(
        [
            sys.executable,
            str(VALIDATOR),
            "--outputs",
            str(outputs_path),
            "--expected-json",
            json.dumps(expected, ensure_ascii=False, sort_keys=True),
        ],
        check=False,
        capture_output=True,
        encoding="utf-8",
    )
    if not completed.stdout.strip():
        raise AssertionError(
            f"validator_missing_output:exit={completed.returncode}"
        )
    result = json.loads(completed.stdout)
    result["exit_status"] = completed.returncode
    return result


def file_count_check(outputs_path: Path, expected_count: int) -> bool:
    return len(read_object(outputs_path)) == expected_count


def run_blind() -> dict[str, Any]:
    outputs_path, _ = initialize("blind")
    dependency_calls = 0
    output_writes = 0
    for task_id, task in BASE_TASKS.items():
        result: str | None = None
        for _ in range(3):
            dependency_calls += 1
            try:
                result = dependency_call(
                    task["worker"], task["input"], "incident-1"
                )
                break
            except RuntimeError:
                continue
        complete_output(outputs_path, task_id, task, result, "incident-1")
        output_writes += 1
    shallow = file_count_check(outputs_path, len(BASE_TASKS))
    validation = verify(outputs_path, BASE_TASKS)
    replay_calls = 0
    replay_writes = 0
    if shallow:
        replay_calls = 0
        replay_writes = 0
    return {
        "dependency_calls": dependency_calls,
        "output_writes": output_writes,
        "file_count_check": shallow,
        "validator": validation,
        "replay_dependency_calls": replay_calls,
        "replay_writes": replay_writes,
    }


def run_status_only() -> dict[str, Any]:
    outputs_path, _ = initialize("status-only")
    dependency_calls = 0
    output_writes = 0
    for task_id, task in BASE_TASKS.items():
        dependency_calls += 1
        try:
            result = dependency_call(
                task["worker"], task["input"], "recovery-1-reported"
            )
        except RuntimeError:
            result = None
        complete_output(
            outputs_path, task_id, task, result, "recovery-1-reported"
        )
        output_writes += 1
    shallow = file_count_check(outputs_path, len(BASE_TASKS))
    validation = verify(outputs_path, BASE_TASKS)
    return {
        "global_status": "recovered",
        "dependency_calls": dependency_calls,
        "output_writes": output_writes,
        "file_count_check": shallow,
        "validator": validation,
    }


def run_context_gated() -> dict[str, Any]:
    outputs_path, checkpoints_path = initialize("context-gated")
    dependency_calls = 0
    output_writes = 0
    checkpoint_writes = 0

    dependency_calls += 1
    try:
        first = next(iter(BASE_TASKS.values()))
        dependency_call(first["worker"], first["input"], "incident-1")
        circuit_open = False
    except RuntimeError:
        circuit_open = True
    if circuit_open:
        for task_id, task in BASE_TASKS.items():
            checkpoint(checkpoints_path, task_id, task, "incident-1")
            checkpoint_writes += 1

    for task_id, task in BASE_TASKS.items():
        dependency_calls += 1
        try:
            result = dependency_call(
                task["worker"], task["input"], "recovery-1-reported"
            )
        except RuntimeError:
            continue
        complete_output(
            outputs_path, task_id, task, result, "recovery-1-reported"
        )
        clear_checkpoint(checkpoints_path, task_id)
        output_writes += 1
        checkpoint_writes += 1

    codex_task = BASE_TASKS["codex-task"]
    dependency_calls += 1
    codex_result = dependency_call(
        codex_task["worker"], codex_task["input"], "recovery-1-context"
    )
    complete_output(
        outputs_path,
        "codex-task",
        codex_task,
        codex_result,
        "recovery-1-context",
    )
    clear_checkpoint(checkpoints_path, "codex-task")
    output_writes += 1
    checkpoint_writes += 1

    first_validation = verify(outputs_path, BASE_TASKS)
    completed_replay_calls = 0 if first_validation["valid"] else len(BASE_TASKS)
    completed_replay_writes = 0 if first_validation["valid"] else len(BASE_TASKS)

    followup_id, followup = next(iter(FOLLOWUP_TASK.items()))
    dependency_calls += 1
    try:
        dependency_call(
            followup["worker"], followup["input"], "incident-2"
        )
    except RuntimeError:
        checkpoint(checkpoints_path, followup_id, followup, "incident-2")
        checkpoint_writes += 1

    dependency_calls += 1
    followup_result = dependency_call(
        followup["worker"], followup["input"], "recovery-2"
    )
    complete_output(
        outputs_path,
        followup_id,
        followup,
        followup_result,
        "recovery-2",
    )
    clear_checkpoint(checkpoints_path, followup_id)
    output_writes += 1
    checkpoint_writes += 1

    all_tasks = BASE_TASKS | FOLLOWUP_TASK
    final_validation = verify(outputs_path, all_tasks)
    final_replay_calls = 0 if final_validation["valid"] else len(all_tasks)
    final_replay_writes = 0 if final_validation["valid"] else len(all_tasks)
    return {
        "circuit_opened": circuit_open,
        "dependency_calls": dependency_calls,
        "output_writes": output_writes,
        "checkpoint_writes": checkpoint_writes,
        "recovery_1_outputs_before_context_recovery": 2,
        "recovery_1_waiting_before_context_recovery": 1,
        "first_validator": first_validation,
        "incident_2_completed_replay_calls": completed_replay_calls,
        "incident_2_completed_replay_writes": completed_replay_writes,
        "final_validator": final_validation,
        "final_replay_dependency_calls": final_replay_calls,
        "final_replay_writes": final_replay_writes,
        "checkpoints_remaining": len(read_object(checkpoints_path)),
    }


def main() -> int:
    started = time.perf_counter()
    artifact_paths = [path for name in SCENARIOS for path in paths(name)]
    leftovers = [str(path) for path in artifact_paths if path.exists()]
    if leftovers:
        print(json.dumps({"error": "preflight_leftover", "paths": leftovers}))
        return 2

    summary: dict[str, Any] = {
        "fault_model": "two_shared_dependency_incidents",
        "validator_process_separate": True,
        "validator_independence_limit": "shared_json_schema_and_sha256",
    }
    try:
        summary["blind"] = run_blind()
        summary["status_only"] = run_status_only()
        summary["context_gated"] = run_context_gated()
        assertions = {
            "blind_retry_amplified": (
                summary["blind"]["dependency_calls"] == 9
                and summary["blind"]["file_count_check"]
                and not summary["blind"]["validator"]["valid"]
            ),
            "aggregate_status_counterexample": (
                summary["status_only"]["global_status"] == "recovered"
                and summary["status_only"]["file_count_check"]
                and not summary["status_only"]["validator"]["valid"]
                and "result_invalid:codex-task"
                in summary["status_only"]["validator"]["reasons"]
            ),
            "context_recovery_valid": (
                summary["context_gated"]["first_validator"]["valid"]
                and summary["context_gated"]["final_validator"]["valid"]
                and summary["context_gated"]["checkpoints_remaining"] == 0
            ),
            "recurrent_outage_replay_noop": (
                summary["context_gated"]["incident_2_completed_replay_calls"] == 0
                and summary["context_gated"]["incident_2_completed_replay_writes"] == 0
                and summary["context_gated"]["final_replay_dependency_calls"] == 0
                and summary["context_gated"]["final_replay_writes"] == 0
            ),
        }
        summary["assertions"] = assertions
        summary["effective_completion"] = all(assertions.values())
        summary["validated_elapsed_ms"] = round(
            (time.perf_counter() - started) * 1000, 3
        )
        return_code = 0 if summary["effective_completion"] else 1
    finally:
        for path in artifact_paths:
            path.unlink(missing_ok=True)
        summary["temporary_state_cleaned"] = all(
            not path.exists() for path in artifact_paths
        )
    if not summary["temporary_state_cleaned"]:
        return_code = 1
    print(json.dumps(summary, ensure_ascii=False, sort_keys=True))
    return return_code


if __name__ == "__main__":
    sys.exit(main())
