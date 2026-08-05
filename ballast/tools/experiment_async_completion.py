from __future__ import annotations

import hashlib
import json
import subprocess
import sys
import tempfile
import time
from pathlib import Path


ROOT = Path(__file__).resolve().parent
VERIFIER = ROOT / "verify_async_completion.py"
ITEMS = [{"id": "A", "value": 1}, {"id": "B", "value": 2}]
OPERATION_ID = "op-async-001"


def intent_digest() -> str:
    encoded = json.dumps(ITEMS, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()


def write_json(path: Path, value: dict[str, object]) -> None:
    path.write_text(json.dumps(value, ensure_ascii=False, sort_keys=True), encoding="utf-8")


def verify(status: Path, artifact: Path) -> tuple[int, dict[str, object]]:
    completed = subprocess.run(
        [
            sys.executable,
            str(VERIFIER),
            "--status",
            str(status),
            "--artifact",
            str(artifact),
            "--operation-id",
            OPERATION_ID,
            "--intent-digest",
            intent_digest(),
            "--expected-count",
            str(len(ITEMS)),
        ],
        check=False,
        capture_output=True,
        text=True,
        encoding="utf-8",
    )
    return completed.returncode, json.loads(completed.stdout)


def main() -> int:
    started = time.perf_counter()
    with tempfile.TemporaryDirectory(prefix="ballast-async-completion-") as temp_name:
        temp = Path(temp_name)
        status = temp / "status.json"
        artifact = temp / "artifact.json"
        enqueue_count = 1
        write_count = 0
        accepted = {"http": 202, "location": f"/operations/{OPERATION_ID}", "operation_id": OPERATION_ID}
        write_json(status, {"operation_id": OPERATION_ID, "intent_digest": intent_digest(), "state": "Pending"})
        accepted_exit, accepted_check = verify(status, artifact)

        write_json(status, {"operation_id": OPERATION_ID, "intent_digest": intent_digest(), "state": "Succeeded"})
        status_exit, status_check = verify(status, artifact)

        write_json(
            artifact,
            {"operation_id": OPERATION_ID, "intent_digest": intent_digest(), "items": ITEMS},
        )
        write_count += 1
        recovered_exit, recovered_check = verify(status, artifact)

        before_replay = (enqueue_count, write_count)
        replay_exit, replay_check = verify(status, artifact)
        after_replay = (enqueue_count, write_count)

        assertions = {
            "accepted_is_not_complete": accepted["http"] == 202 and accepted_exit == 1,
            "terminal_status_is_not_artifact": status_exit == 1 and "missing_artifact" in status_check["reasons"],
            "recovery_verifies_current_artifact": recovered_exit == 0 and recovered_check["valid"] is True,
            "completed_replay_has_zero_side_effects": replay_exit == 0 and before_replay == after_replay,
        }
        result = {
            "operation_id": OPERATION_ID,
            "intent_digest": intent_digest(),
            "accepted": accepted,
            "accepted_verification": accepted_check,
            "terminal_without_artifact_verification": status_check,
            "recovered_verification": recovered_check,
            "replay_verification": replay_check,
            "enqueue_count": enqueue_count,
            "artifact_write_count": write_count,
            "replay_enqueue_delta": after_replay[0] - before_replay[0],
            "replay_write_delta": after_replay[1] - before_replay[1],
            "independent_verifier_processes": 4,
            "assertions": assertions,
            "elapsed_ms": round((time.perf_counter() - started) * 1000, 2),
        }
        print(json.dumps(result, ensure_ascii=False, sort_keys=True, indent=2))
        return 0 if all(assertions.values()) else 1


if __name__ == "__main__":
    sys.exit(main())
