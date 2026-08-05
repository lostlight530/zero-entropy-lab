"""Deterministic transition declarations with no execution side effects."""

from __future__ import annotations

from collections.abc import Sequence
from dataclasses import dataclass
import hashlib
import json
from typing import Any


__all__ = ["DeclarationValidationError", "TransitionDeclaration"]


class DeclarationValidationError(ValueError):
    """Raised when a state transition declaration cannot be proven safe."""


def _required_text(field: str, value: object) -> str:
    if not isinstance(value, str):
        raise DeclarationValidationError(f"{field} must be a string")
    if not value.strip():
        raise DeclarationValidationError(f"{field} must not be empty")
    if value != value.strip():
        raise DeclarationValidationError(
            f"{field} must not contain leading or trailing whitespace"
        )
    return value


def _text_tuple(field: str, value: object) -> tuple[str, ...]:
    if isinstance(value, str) or not isinstance(value, Sequence):
        raise DeclarationValidationError(f"{field} must be a sequence of strings")

    items = tuple(
        _required_text(f"{field}[{index}]", item)
        for index, item in enumerate(value)
    )
    if not items:
        raise DeclarationValidationError(f"{field} must not be empty")
    if len(set(items)) != len(items):
        raise DeclarationValidationError(f"{field} must not contain duplicates")
    return items


@dataclass(frozen=True, slots=True)
class TransitionDeclaration:
    """Declare why a proposed action may change a known system state."""

    actor: str
    current_state: str
    intent: str
    preconditions: tuple[str, ...]
    effects: tuple[str, ...]
    evidence: tuple[str, ...]
    rollback: tuple[str, ...]

    def __post_init__(self) -> None:
        object.__setattr__(self, "actor", _required_text("actor", self.actor))
        object.__setattr__(
            self,
            "current_state",
            _required_text("current_state", self.current_state),
        )
        object.__setattr__(self, "intent", _required_text("intent", self.intent))
        object.__setattr__(
            self,
            "preconditions",
            _text_tuple("preconditions", self.preconditions),
        )
        object.__setattr__(self, "effects", _text_tuple("effects", self.effects))
        object.__setattr__(self, "evidence", _text_tuple("evidence", self.evidence))
        object.__setattr__(self, "rollback", _text_tuple("rollback", self.rollback))

    def to_canonical_dict(self) -> dict[str, Any]:
        """Return a JSON-compatible declaration with stable field names."""

        return {
            "actor": self.actor,
            "current_state": self.current_state,
            "intent": self.intent,
            "preconditions": list(self.preconditions),
            "effects": list(self.effects),
            "evidence": list(self.evidence),
            "rollback": list(self.rollback),
        }

    def to_canonical_json(self) -> str:
        """Serialize without locale, clock, randomness, or platform variance."""

        return json.dumps(
            self.to_canonical_dict(),
            ensure_ascii=False,
            sort_keys=True,
            separators=(",", ":"),
            allow_nan=False,
        )

    def fingerprint(self) -> str:
        """Return the SHA-256 identity of the canonical declaration."""

        return hashlib.sha256(self.to_canonical_json().encode("utf-8")).hexdigest()
