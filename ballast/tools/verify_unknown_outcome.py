from __future__ import annotations

import argparse
import hashlib
import json
import sys
from pathlib import Path
from typing import Any


def canonical_digest(value: Any) -> str:
    encoded = json.dumps(
        value, ensure_ascii=False, separators=(",", ":"), sort_keys=True
    ).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()


def validate(
    effects_path: Path,
    receipts_path: Path,
    token: str,
    current_intent: dict[str, Any],
) -> dict[str, Any]:
    reasons: list[str] = []
    try:
        effects = json.loads(effects_path.read_text(encoding="utf-8"))
        receipts = json.loads(receipts_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        return {"valid": False, "reasons": [f"state_read_failed:{type(error).__name__}"]}
    if not isinstance(effects, list):
        reasons.append("effects_not_list")
        effects = []
    if not isinstance(receipts, dict):
        reasons.append("receipts_not_object")
        receipts = {}
    matching = [
        effect
        for effect in effects
        if isinstance(effect, dict) and effect.get("request_token") == token
    ]
    if len(matching) != 1:
        reasons.append("effect_count_mismatch")
    receipt = receipts.get(token)
    if not isinstance(receipt, dict):
        reasons.append("receipt_missing")
        receipt = {}
    expected_digest = canonical_digest(current_intent)
    if receipt.get("intent_sha256") != expected_digest:
        reasons.append("intent_digest_mismatch")
    if len(matching) == 1:
        effect = matching[0]
        if effect.get("intent") != current_intent:
            reasons.append("effect_intent_mismatch")
        if receipt.get("result_id") != effect.get("result_id"):
            reasons.append("result_id_mismatch")
    return {
        "valid": not reasons,
        "reasons": reasons,
        "effect_count": len(matching),
        "expected_intent_sha256": expected_digest,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--effects", required=True, type=Path)
    parser.add_argument("--receipts", required=True, type=Path)
    parser.add_argument("--token", required=True)
    parser.add_argument("--intent-json", required=True)
    args = parser.parse_args()
    try:
        intent = json.loads(args.intent_json)
    except json.JSONDecodeError as error:
        print(json.dumps({"valid": False, "reasons": [f"intent_invalid:{error.msg}"]}))
        return 2
    if not isinstance(intent, dict):
        print(json.dumps({"valid": False, "reasons": ["intent_not_object"]}))
        return 2
    result = validate(args.effects, args.receipts, args.token, intent)
    print(json.dumps(result, ensure_ascii=False, sort_keys=True))
    return 0 if result["valid"] else 1


if __name__ == "__main__":
    sys.exit(main())
