from __future__ import annotations

import hashlib
import json
import subprocess
import sys
import tempfile
import time
from pathlib import Path
from typing import Any


VALIDATOR = Path(__file__).with_name("verify_retention_expiry.py")
TOKEN = "request-2026-07-29-a"
CORRELATION_ID = "operation-2026-07-29-a"
RETENTION_HOURS = 24
ORIGINAL_INTENT = {
    "action": "provision",
    "quantity": 1,
    "resource": "controlled-sample",
}
CHANGED_INTENT = {
    "action": "provision",
    "quantity": 2,
    "resource": "controlled-sample",
}


def canonical_digest(value: Any) -> str:
    encoded = json.dumps(
        value, ensure_ascii=False, separators=(",", ":"), sort_keys=True
    ).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()


def write_json(path: Path, value: Any) -> None:
    path.write_text(
        json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )


def read_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def scenario_paths(root: Path, name: str) -> tuple[Path, Path, Path]:
    scenario = root / name
    scenario.mkdir()
    resources = scenario / "resources.json"
    dedupe = scenario / "dedupe.json"
    journal = scenario / "journal.json"
    write_json(resources, [])
    write_json(dedupe, {})
    write_json(
        journal,
        {
            "correlation_id": CORRELATION_ID,
            "request_token": TOKEN,
            "intent_sha256": canonical_digest(ORIGINAL_INTENT),
        },
    )
    return resources, dedupe, journal


def expire_dedupe(dedupe_path: Path, now_hour: int) -> int:
    dedupe = read_json(dedupe_path)
    retained = {
        key: value
        for key, value in dedupe.items()
        if isinstance(value, dict) and value.get("expires_at_hour", 0) > now_hour
    }
    if retained == dedupe:
        return 0
    write_json(dedupe_path, retained)
    return 1


def service_request(
    resources_path: Path,
    dedupe_path: Path,
    now_hour: int,
    intent: dict[str, Any],
) -> dict[str, Any]:
    expire_dedupe(dedupe_path, now_hour)
    resources = read_json(resources_path)
    dedupe = read_json(dedupe_path)
    digest = canonical_digest(intent)
    existing = dedupe.get(TOKEN)
    if isinstance(existing, dict):
        if existing.get("intent_sha256") != digest:
            return {"status": "intent_mismatch", "state_writes": 0}
        return {
            "status": "replayed",
            "resource_id": existing.get("resource_id"),
            "state_writes": 0,
        }
    resource_id = f"resource-{len(resources) + 1}"
    resources.append(
        {
            "resource_id": resource_id,
            "correlation_id": CORRELATION_ID,
            "created_by_token": TOKEN,
            "intent": intent,
        }
    )
    dedupe[TOKEN] = {
        "resource_id": resource_id,
        "intent_sha256": digest,
        "expires_at_hour": now_hour + RETENTION_HOURS,
    }
    write_json(resources_path, resources)
    write_json(dedupe_path, dedupe)
    return {"status": "applied", "resource_id": resource_id, "state_writes": 2}


def marker_only_recovery(resources_path: Path) -> dict[str, Any]:
    resources = read_json(resources_path)
    matching = [
        item
        for item in resources
        if isinstance(item, dict) and item.get("correlation_id") == CORRELATION_ID
    ]
    return {
        "status": "skipped_existing_marker" if matching else "would_retry",
        "query_matches": len(matching),
        "state_writes": 0,
    }


def intent_bound_recovery(
    resources_path: Path, intent: dict[str, Any]
) -> dict[str, Any]:
    resources = read_json(resources_path)
    exact = [
        item
        for item in resources
        if isinstance(item, dict)
        and item.get("correlation_id") == CORRELATION_ID
        and item.get("created_by_token") == TOKEN
        and item.get("intent") == intent
    ]
    conflicts = [
        item
        for item in resources
        if isinstance(item, dict)
        and item.get("correlation_id") == CORRELATION_ID
        and item not in exact
    ]
    if len(exact) == 1 and not conflicts:
        status = "verified_existing_effect"
    elif conflicts or len(exact) > 1:
        status = "safe_stop_ambiguous"
    else:
        status = "would_retry"
    return {
        "status": status,
        "exact_matches": len(exact),
        "conflicts": len(conflicts),
        "state_writes": 0,
    }


def verify(
    resources_path: Path, journal_path: Path, intent: dict[str, Any]
) -> dict[str, Any]:
    completed = subprocess.run(
        [
            sys.executable,
            str(VALIDATOR),
            "--resources",
            str(resources_path),
            "--journal",
            str(journal_path),
            "--correlation-id",
            CORRELATION_ID,
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


def main() -> int:
    started = time.perf_counter()
    summary: dict[str, Any] = {
        "fault": "response_lost_then_dedupe_record_expired",
        "retention_hours": RETENTION_HOURS,
        "late_retry_hour": 25,
        "validator_process_separate": True,
        "validator_independence_limit": "shared_json_contract_and_intent_shape",
    }
    with tempfile.TemporaryDirectory(prefix="ballast-retention-") as temp_name:
        root = Path(temp_name)

        blind_resources, blind_dedupe, blind_journal = scenario_paths(root, "blind")
        blind_first = service_request(
            blind_resources, blind_dedupe, 0, ORIGINAL_INTENT
        )
        blind_retry = service_request(
            blind_resources, blind_dedupe, 25, ORIGINAL_INTENT
        )
        blind_validation = verify(
            blind_resources, blind_journal, ORIGINAL_INTENT
        )
        summary["expired_key_retry"] = {
            "ack_received": False,
            "remote_calls": 2,
            "resource_count": len(read_json(blind_resources)),
            "state_writes": blind_first["state_writes"] + blind_retry["state_writes"],
            "retry_status": blind_retry["status"],
            "validator": blind_validation,
        }

        marker_resources, _, marker_journal = scenario_paths(root, "marker-only")
        write_json(
            marker_resources,
            [
                {
                    "resource_id": "resource-unrelated",
                    "correlation_id": CORRELATION_ID,
                    "created_by_token": "other-token",
                    "intent": CHANGED_INTENT,
                }
            ],
        )
        marker_recovery = marker_only_recovery(marker_resources)
        marker_validation = verify(
            marker_resources, marker_journal, ORIGINAL_INTENT
        )
        summary["marker_only"] = {
            "remote_calls": 0,
            "recovery": marker_recovery,
            "validator": marker_validation,
        }

        bound_resources, bound_dedupe, bound_journal = scenario_paths(
            root, "intent-bound"
        )
        bound_first = service_request(
            bound_resources, bound_dedupe, 0, ORIGINAL_INTENT
        )
        maintenance_writes = expire_dedupe(bound_dedupe, 25)
        bound_recovery = intent_bound_recovery(
            bound_resources, ORIGINAL_INTENT
        )
        bound_replay = intent_bound_recovery(
            bound_resources, ORIGINAL_INTENT
        )
        bound_validation = verify(
            bound_resources, bound_journal, ORIGINAL_INTENT
        )
        summary["intent_bound"] = {
            "ack_received": False,
            "remote_calls": 1,
            "service_state_writes": bound_first["state_writes"],
            "retention_maintenance_writes": maintenance_writes,
            "recovery": bound_recovery,
            "same_input_replay": bound_replay,
            "recovery_state_writes": (
                bound_recovery["state_writes"] + bound_replay["state_writes"]
            ),
            "validator": bound_validation,
        }

        assertions = {
            "expired_key_created_duplicate": (
                summary["expired_key_retry"]["resource_count"] == 2
                and blind_retry["status"] == "applied"
                and not blind_validation["valid"]
                and "exact_resource_count_mismatch" in blind_validation["reasons"]
            ),
            "marker_only_false_success_detected": (
                marker_recovery["status"] == "skipped_existing_marker"
                and not marker_validation["valid"]
                and "conflicting_marker_resource" in marker_validation["reasons"]
            ),
            "intent_bound_reconciliation_passed": (
                bound_recovery["status"] == "verified_existing_effect"
                and bound_validation["valid"]
            ),
            "late_recovery_did_not_resubmit": (
                summary["intent_bound"]["remote_calls"] == 1
                and summary["intent_bound"]["recovery_state_writes"] == 0
            ),
            "same_input_replay_no_write": (
                bound_replay["status"] == "verified_existing_effect"
                and bound_replay["state_writes"] == 0
            ),
        }
        summary["assertions"] = assertions
        summary["effective_completion"] = all(assertions.values())
        return_code = 0 if summary["effective_completion"] else 1
        temporary_root = str(root)

    summary["temporary_state_cleaned"] = not Path(temporary_root).exists()
    summary["validated_elapsed_ms"] = round(
        (time.perf_counter() - started) * 1000, 3
    )
    if not summary["temporary_state_cleaned"]:
        return_code = 1
    print(json.dumps(summary, ensure_ascii=False, sort_keys=True))
    return return_code


if __name__ == "__main__":
    sys.exit(main())
