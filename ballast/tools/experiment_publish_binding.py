from __future__ import annotations

import hashlib
import json
import os
import shutil
import subprocess
import sys
import tempfile
import time
from pathlib import Path
from typing import Any


VERIFY = Path(__file__).with_name("verify_publish_binding.py")
REQUIRED_ID = "A"
VALID = b'{"items":[{"id":"A","value":1}],"status":"complete"}\n'
SWAPPED = b'{"items":[],"status":"complete"}\n'


def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def verify(root: Path, name: str, artifact: Path, expected_digest: str) -> dict[str, Any]:
    process = subprocess.run(
        [
            sys.executable,
            str(VERIFY),
            "--artifact",
            str(artifact),
            "--expected-digest",
            expected_digest,
            "--required-id",
            REQUIRED_ID,
        ],
        capture_output=True,
        check=False,
        encoding="utf-8",
    )
    result = json.loads(process.stdout)
    result["exit"] = process.returncode
    result["name"] = name
    return result


def replace_bytes(path: Path, data: bytes) -> None:
    staging = path.with_suffix(path.suffix + ".replace")
    staging.write_bytes(data)
    os.replace(staging, path)


def publish_by_path(source: Path, destination: Path) -> int:
    shutil.copyfile(source, destination)
    return 0


def publish_bound(source: Path, destination: Path, expected_digest: str) -> dict[str, Any]:
    data = source.read_bytes()
    if digest(data) != expected_digest:
        return {"published": False, "writes": 0}
    staging = destination.with_suffix(destination.suffix + ".stage")
    staging.write_bytes(data)
    os.replace(staging, destination)
    return {"published": True, "writes": 1}


def main() -> int:
    started = time.perf_counter()
    temp_path = ""
    with tempfile.TemporaryDirectory(prefix="ballast-publish-binding-") as temporary:
        temp_path = temporary
        root = Path(temporary)
        candidate = root / "candidate.json"
        naive_output = root / "naive-output.json"
        bound_output = root / "bound-output.json"
        candidate.write_bytes(VALID)
        expected_digest = digest(VALID)

        initial_verification = verify(
            root, "initial-verification", candidate, expected_digest
        )

        replace_bytes(candidate, SWAPPED)
        naive_exit = publish_by_path(candidate, naive_output)
        naive_verification = verify(
            root, "naive-output", naive_output, expected_digest
        )
        swapped_source_verification = verify(
            root, "swapped-source", candidate, expected_digest
        )

        rejected_publish = publish_bound(candidate, bound_output, expected_digest)
        destination_absent_after_reject = not bound_output.exists()

        replace_bytes(candidate, VALID)
        recovered_publish = publish_bound(candidate, bound_output, expected_digest)
        recovered_verification = verify(
            root, "recovered-output", bound_output, expected_digest
        )

        writes_before_replay = recovered_publish["writes"]
        if bound_output.exists() and digest(bound_output.read_bytes()) == expected_digest:
            replay_publish = {"published": False, "writes": 0}
        else:
            replay_publish = publish_bound(candidate, bound_output, expected_digest)
        replay_verification = verify(
            root, "replay-output", bound_output, expected_digest
        )

        assertions = {
            "validated_path_can_publish_swapped_bytes": (
                initial_verification["exit"] == 0
                and naive_exit == 0
                and naive_verification["exit"] == 1
                and naive_output.exists()
            ),
            "digest_bound_publish_rejects_swap_without_write": (
                swapped_source_verification["exit"] == 1
                and not rejected_publish["published"]
                and rejected_publish["writes"] == 0
                and destination_absent_after_reject
            ),
            "recovery_publishes_verified_bytes_atomically": (
                recovered_publish["published"]
                and recovered_publish["writes"] == 1
                and recovered_verification["exit"] == 0
            ),
            "verified_replay_has_zero_writes": (
                writes_before_replay == 1
                and replay_publish["writes"] == 0
                and replay_verification["exit"] == 0
            ),
        }
        output = {
            "assertions": assertions,
            "effective_completion": all(assertions.values()),
            "naive": {
                "output_exists": naive_output.exists(),
                "publish_exit": naive_exit,
                "published_digest": digest(naive_output.read_bytes()),
                "verification": naive_verification,
                "writes": 1,
            },
            "rejected_bound_publish": {
                "destination_absent": destination_absent_after_reject,
                "verification": swapped_source_verification,
                **rejected_publish,
            },
            "recovery": {
                "published_digest": digest(bound_output.read_bytes()),
                "replay_writes": replay_publish["writes"],
                "verification": recovered_verification,
                "writes": recovered_publish["writes"],
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
