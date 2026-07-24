from __future__ import annotations

import hashlib
import json
import subprocess
import sys
import time
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
VALIDATOR = Path(__file__).with_name("verify_unknown_outcome.py")
TOKEN = "request-2026-07-24-a"
ORIGINAL_INTENT = {
    "action": "reserve",
    "amount": 4,
    "resource": "controlled-sample",
}
CHANGED_INTENT = {
    "action": "reserve",
    "amount": 7,
    "resource": "controlled-sample",
}
SCENARIOS = ("blind", "key-only", "intent-bound")


def canonical_digest(value: Any) -> str:
    encoded = json.dumps(
        value, ensure_ascii=False, separators=(",", ":"), sort_keys=True
    ).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()


def scenario_paths(name: str) -> tuple[Path, Path]:
    prefix = ROOT / f".experiment-unknown-{name}"
    return (
        prefix.with_name(prefix.name + "-effects.json"),
        prefix.with_name(prefix.name + "-receipts.json"),
    )


def write_json(path: Path, value: Any) -> None:
    path.write_text(
        json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )


def initialize(name: str) -> tuple[Path, Path]:
    effects_path, receipts_path = scenario_paths(name)
    write_json(effects_path, [])
    write_json(receipts_path, {})
    return effects_path, receipts_path


def read_state(effects_path: Path, receipts_path: Path) -> tuple[list[Any], dict[str, Any]]:
    effects = json.loads(effects_path.read_text(encoding="utf-8"))
    receipts = json.loads(receipts_path.read_text(encoding="utf-8"))
    if not isinstance(effects, list) or not isinstance(receipts, dict):
        raise AssertionError("controlled state shape changed")
    return effects, receipts


def apply_effect(
    effects_path: Path,
    receipts_path: Path,
    token: str,
    intent: dict[str, Any],
) -> dict[str, Any]:
    effects, receipts = read_state(effects_path, receipts_path)
    result_id = f"effect-{len(effects) + 1}"
    effects.append(
        {"request_token": token, "result_id": result_id, "intent": intent}
    )
    receipts[token] = {
        "intent_sha256": canonical_digest(intent),
        "result_id": result_id,
    }
    write_json(effects_path, effects)
    write_json(receipts_path, receipts)
    return {"status": "applied", "result_id": result_id, "state_writes": 2}


def key_only_request(
    effects_path: Path,
    receipts_path: Path,
    token: str,
    intent: dict[str, Any],
) -> dict[str, Any]:
    _, receipts = read_state(effects_path, receipts_path)
    existing = receipts.get(token)
    if isinstance(existing, dict):
        return {
            "status": "duplicate_returned",
            "result_id": existing.get("result_id"),
            "state_writes": 0,
        }
    return apply_effect(effects_path, receipts_path, token, intent)


def intent_bound_request(
    effects_path: Path,
    receipts_path: Path,
    token: str,
    intent: dict[str, Any],
) -> dict[str, Any]:
    _, receipts = read_state(effects_path, receipts_path)
    existing = receipts.get(token)
    current_digest = canonical_digest(intent)
    if isinstance(existing, dict):
        if existing.get("intent_sha256") != current_digest:
            return {"status": "intent_mismatch", "result_id": None, "state_writes": 0}
        return {
            "status": "duplicate_returned",
            "result_id": existing.get("result_id"),
            "state_writes": 0,
        }
    return apply_effect(effects_path, receipts_path, token, intent)


def verify(
    effects_path: Path,
    receipts_path: Path,
    intent: dict[str, Any],
) -> dict[str, Any]:
    completed = subprocess.run(
        [
            sys.executable,
            str(VALIDATOR),
            "--effects",
            str(effects_path),
            "--receipts",
            str(receipts_path),
            "--token",
            TOKEN,
            "--intent-json",
            json.dumps(intent, ensure_ascii=False, sort_keys=True),
        ],
        check=False,
        capture_output=True,
        encoding="utf-8",
    )
    if not completed.stdout.strip():
        raise AssertionError(
            f"validator produced no output: exit={completed.returncode} stderr={completed.stderr}"
        )
    result = json.loads(completed.stdout)
    result["exit_status"] = completed.returncode
    return result


def effect_count(path: Path) -> int:
    value = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(value, list):
        raise AssertionError("effects state is not a list")
    return len(value)


def main() -> int:
    started = time.perf_counter()
    paths = [path for name in SCENARIOS for path in scenario_paths(name)]
    leftovers = [str(path) for path in paths if path.exists()]
    if leftovers:
        print(json.dumps({"error": "preflight_leftover", "paths": leftovers}))
        return 2
    summary: dict[str, Any] = {
        "fault": "effect_committed_response_lost",
        "token": TOKEN,
        "validator_process_separate": True,
        "validator_independence_limit": "shared_json_contract_and_sha256",
    }
    try:
        blind_effects, blind_receipts = initialize("blind")
        blind_first = apply_effect(
            blind_effects, blind_receipts, TOKEN, ORIGINAL_INTENT
        )
        blind_retry = apply_effect(
            blind_effects, blind_receipts, TOKEN, ORIGINAL_INTENT
        )
        blind_validation = verify(
            blind_effects, blind_receipts, ORIGINAL_INTENT
        )
        summary["blind_retry"] = {
            "ack_received": False,
            "remote_calls": 2,
            "effect_applications": effect_count(blind_effects),
            "state_writes": blind_first["state_writes"] + blind_retry["state_writes"],
            "validator": blind_validation,
        }

        key_effects, key_receipts = initialize("key-only")
        key_first = key_only_request(
            key_effects, key_receipts, TOKEN, ORIGINAL_INTENT
        )
        key_same_retry = key_only_request(
            key_effects, key_receipts, TOKEN, ORIGINAL_INTENT
        )
        key_original_validation = verify(
            key_effects, key_receipts, ORIGINAL_INTENT
        )
        key_changed_retry = key_only_request(
            key_effects, key_receipts, TOKEN, CHANGED_INTENT
        )
        key_changed_validation = verify(
            key_effects, key_receipts, CHANGED_INTENT
        )
        summary["key_only"] = {
            "ack_received": False,
            "remote_calls": 3,
            "effect_applications": effect_count(key_effects),
            "state_writes": key_first["state_writes"],
            "same_intent_retry_status": key_same_retry["status"],
            "original_intent_validator": key_original_validation,
            "changed_intent_retry_status": key_changed_retry["status"],
            "changed_intent_validator": key_changed_validation,
        }

        bound_effects, bound_receipts = initialize("intent-bound")
        bound_first = intent_bound_request(
            bound_effects, bound_receipts, TOKEN, ORIGINAL_INTENT
        )
        pre_retry_validation = verify(
            bound_effects, bound_receipts, ORIGINAL_INTENT
        )
        resubmitted_after_read = 0 if pre_retry_validation["valid"] else 1
        if resubmitted_after_read:
            intent_bound_request(
                bound_effects, bound_receipts, TOKEN, ORIGINAL_INTENT
            )
        bound_replay = intent_bound_request(
            bound_effects, bound_receipts, TOKEN, ORIGINAL_INTENT
        )
        bound_changed = intent_bound_request(
            bound_effects, bound_receipts, TOKEN, CHANGED_INTENT
        )
        bound_final_validation = verify(
            bound_effects, bound_receipts, ORIGINAL_INTENT
        )
        summary["intent_bound"] = {
            "ack_received": False,
            "pre_retry_read_valid": pre_retry_validation["valid"],
            "resubmitted_after_read": resubmitted_after_read,
            "remote_calls": 3,
            "effect_applications": effect_count(bound_effects),
            "state_writes": bound_first["state_writes"],
            "same_intent_replay_status": bound_replay["status"],
            "changed_intent_status": bound_changed["status"],
            "final_validator": bound_final_validation,
        }

        assertions = {
            "blind_duplicate_detected": (
                summary["blind_retry"]["effect_applications"] == 2
                and not blind_validation["valid"]
                and "effect_count_mismatch" in blind_validation["reasons"]
            ),
            "same_intent_deduplicated": (
                summary["key_only"]["effect_applications"] == 1
                and key_same_retry["status"] == "duplicate_returned"
                and key_original_validation["valid"]
            ),
            "key_only_counterexample_detected": (
                key_changed_retry["status"] == "duplicate_returned"
                and not key_changed_validation["valid"]
                and "intent_digest_mismatch" in key_changed_validation["reasons"]
            ),
            "read_before_retry_prevented_resubmit": (
                pre_retry_validation["valid"] and resubmitted_after_read == 0
            ),
            "intent_mismatch_stopped": (
                bound_changed["status"] == "intent_mismatch"
                and bound_final_validation["valid"]
                and effect_count(bound_effects) == 1
            ),
            "same_input_replay_no_write": (
                bound_replay["status"] == "duplicate_returned"
                and bound_replay["state_writes"] == 0
            ),
        }
        summary["assertions"] = assertions
        summary["effective_completion"] = all(assertions.values())
        summary["validated_elapsed_ms"] = round(
            (time.perf_counter() - started) * 1000, 3
        )
        return_code = 0 if summary["effective_completion"] else 1
    finally:
        for path in paths:
            path.unlink(missing_ok=True)
        summary["temporary_state_cleaned"] = all(
            not path.exists() for path in paths
        )
    if not summary["temporary_state_cleaned"]:
        return_code = 1
    print(json.dumps(summary, ensure_ascii=False, sort_keys=True))
    return return_code


if __name__ == "__main__":
    sys.exit(main())
