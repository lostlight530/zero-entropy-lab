from __future__ import annotations

import hashlib
import json
import os
import subprocess
import sys
import tempfile
import time
from pathlib import Path
from typing import Any


TOKEN = "request-2026-07-30-a"
INTENT = {"action": "allocate", "quantity": 1, "resource": "controlled-sample"}
VERIFY = Path(__file__).with_name("verify_dual_write_atomicity.py")


def encode(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True) + "\n"


def write_json(path: Path, value: Any) -> None:
    path.write_text(encode(value), encoding="utf-8", newline="\n")


def read_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def digest(value: Any) -> str:
    payload = json.dumps(
        value, ensure_ascii=False, sort_keys=True, separators=(",", ":")
    ).encode("utf-8")
    return hashlib.sha256(payload).hexdigest()


def resource(identifier: str) -> dict[str, str]:
    return {"id": identifier, "intent_digest": digest(INTENT), "token": TOKEN}


def verify_split(resources: Path, receipts: Path, intent: Path) -> tuple[int, dict[str, Any]]:
    process = subprocess.run(
        [sys.executable, str(VERIFY), "--resources", str(resources), "--receipts",
         str(receipts), "--intent", str(intent), "--token", TOKEN],
        capture_output=True, check=False, encoding="utf-8",
    )
    return process.returncode, json.loads(process.stdout)


def verify_snapshot(snapshot: Path, intent: Path) -> tuple[int, dict[str, Any]]:
    process = subprocess.run(
        [sys.executable, str(VERIFY), "--snapshot", str(snapshot), "--intent",
         str(intent), "--token", TOKEN],
        capture_output=True, check=False, encoding="utf-8",
    )
    return process.returncode, json.loads(process.stdout)


def effect_first(root: Path, intent: Path) -> dict[str, Any]:
    resources_path = root / "resources.json"
    receipts_path = root / "receipts.json"
    resources: list[dict[str, str]] = []
    receipts: dict[str, dict[str, str]] = {}
    write_json(resources_path, resources)
    write_json(receipts_path, receipts)

    resources.append(resource("resource-a1"))
    write_json(resources_path, resources)
    if TOKEN not in receipts:
        resources.append(resource("resource-a2"))
        write_json(resources_path, resources)
        receipts[TOKEN] = {"intent_digest": digest(INTENT), "result_id": "resource-a2"}
        write_json(receipts_path, receipts)

    code, verification = verify_split(resources_path, receipts_path, intent)
    return {
        "calls": 2,
        "injected_failure": "after_effect_before_receipt",
        "producer_complete": TOKEN in receipts,
        "resource_count": len(resources),
        "verification": verification,
        "verification_exit": code,
        "writes": 3,
    }


def receipt_first(root: Path, intent: Path) -> dict[str, Any]:
    resources_path = root / "resources.json"
    receipts_path = root / "receipts.json"
    resources: list[dict[str, str]] = []
    receipts = {TOKEN: {"intent_digest": digest(INTENT), "result_id": "resource-b1"}}
    write_json(resources_path, resources)
    write_json(receipts_path, receipts)

    cached_success = TOKEN in receipts
    code, verification = verify_split(resources_path, receipts_path, intent)
    return {
        "calls": 1,
        "cached_success": cached_success,
        "injected_failure": "after_receipt_before_effect",
        "producer_complete": cached_success,
        "resource_count": len(resources),
        "verification": verification,
        "verification_exit": code,
        "writes": 1,
    }


def atomic_snapshot(root: Path, intent: Path) -> dict[str, Any]:
    snapshot = root / "state.json"
    candidate = root / "state.candidate"
    initial = {"receipts": {}, "resources": []}
    write_json(snapshot, initial)
    candidate_state = {
        "receipts": {TOKEN: {"intent_digest": digest(INTENT), "result_id": "resource-c1"}},
        "resources": [resource("resource-c1")],
    }

    write_json(candidate, candidate_state)
    candidate.unlink()
    state_unchanged_after_failure = read_json(snapshot) == initial

    current = read_json(snapshot)
    committed_writes = 0
    if TOKEN not in current["receipts"]:
        write_json(candidate, candidate_state)
        os.replace(candidate, snapshot)
        committed_writes += 1

    code, verification = verify_snapshot(snapshot, intent)
    before_replay = snapshot.read_bytes()
    replay_writes = 0
    current = read_json(snapshot)
    if TOKEN not in current["receipts"]:
        replay_writes += 1
    replay_unchanged = before_replay == snapshot.read_bytes()
    return {
        "candidate_clean": not candidate.exists(),
        "commit_attempts": 2,
        "committed_writes": committed_writes,
        "injected_failure": "before_atomic_replace",
        "replay_unchanged": replay_unchanged,
        "replay_writes": replay_writes,
        "resource_count": len(current["resources"]),
        "state_unchanged_after_failure": state_unchanged_after_failure,
        "verification": verification,
        "verification_exit": code,
    }


def main() -> int:
    started = time.perf_counter()
    temp_path = ""
    with tempfile.TemporaryDirectory(prefix="ballast-dual-write-") as temporary:
        root = Path(temporary)
        temp_path = str(root)
        intent = root / "intent.json"
        write_json(intent, INTENT)
        effect_dir = root / "effect-first"
        receipt_dir = root / "receipt-first"
        atomic_dir = root / "atomic"
        effect_dir.mkdir()
        receipt_dir.mkdir()
        atomic_dir.mkdir()

        effect = effect_first(effect_dir, intent)
        receipt = receipt_first(receipt_dir, intent)
        atomic = atomic_snapshot(atomic_dir, intent)
        assertions = {
            "effect_first_duplicate_rejected": effect["producer_complete"] and effect["resource_count"] == 2 and effect["verification_exit"] == 1,
            "receipt_first_phantom_rejected": receipt["producer_complete"] and receipt["resource_count"] == 0 and receipt["verification_exit"] == 1,
            "atomic_failure_not_visible": atomic["state_unchanged_after_failure"],
            "atomic_recovery_valid": atomic["resource_count"] == 1 and atomic["verification_exit"] == 0,
            "atomic_replay_zero_write": atomic["replay_writes"] == 0 and atomic["replay_unchanged"],
            "candidate_clean": atomic["candidate_clean"],
        }
        effective_completion = all(assertions.values())
        result = {
            "assertions": assertions,
            "atomic_snapshot": atomic,
            "effect_first": effect,
            "effective_completion": effective_completion,
            "receipt_first": receipt,
            "temp_path": temp_path,
            "verified_elapsed_ms": round((time.perf_counter() - started) * 1000, 3),
        }
        print(json.dumps(result, ensure_ascii=False, indent=2, sort_keys=True))

    cleanup_passed = not Path(temp_path).exists()
    print(json.dumps({"cleanup_passed": cleanup_passed}, sort_keys=True))
    return 0 if effective_completion and cleanup_passed else 1


if __name__ == "__main__":
    sys.exit(main())
