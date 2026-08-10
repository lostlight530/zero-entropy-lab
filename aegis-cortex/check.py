#!/usr/bin/env python3
"""Validate Aegis Cortex periodic records without changing repository state.

This checker captures deterministic handoff, time-boundary, and evidence-state
contracts that recur across Jules runs. It intentionally does not judge whether
external claims are true and it does not inspect host-repository implementation.
"""

from __future__ import annotations

import re
import sys
from datetime import date, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
AEGIS = ROOT / "aegis-cortex"

PATTERNS = {
    "A1": re.compile(r"^(\d{4}-\d{2}-\d{2})-A1-reliability-observe\.md$"),
    "A2": re.compile(r"^(\d{4}-\d{2}-\d{2})-A2-doctrine-orient\.md$"),
    "A3": re.compile(r"^(\d{4}-W\d{2})-A3-discipline-decide\.md$"),
    "A4": re.compile(r"^(\d{4}-W\d{2})-A4-protocol-act\.md$"),
    "A5": re.compile(r"^(\d{4}-\d{2})-A5-drift-reflect\.md$"),
    "A6": re.compile(r"^(\d{4}-\d{2})-A6-aegis-memorize\.md$"),
}

REQUIRED_SECTIONS = {
    "A1": (
        "CORTEX_RUN_HEADER",
        "INPUT_RECORD",
        "EXTERNAL_SOURCE_RECORDS",
        "RAW_RELIABILITY_SIGNAL_LOG",
        "NEXT_HANDOFF",
        "BOUNDARY_CHECK",
    ),
    "A2": (
        "CORTEX_RUN_HEADER",
        "INPUT_RECORD",
        "RISK_CLASSIFICATION",
        "ORIENTATION_NOTES",
        "NO_DECISION_SECTION",
        "NEXT_HANDOFF",
        "BOUNDARY_CHECK",
    ),
    "A3": (
        "CORTEX_RUN_HEADER",
        "INPUT_RECORD",
        "WEEKLY_RISK_SYNTHESIS",
        "DECISION_SET",
        "DO_NOT_CHANGE",
        "HANDOFF_TO_A4",
        "BOUNDARY_CHECK",
    ),
    "A4": (
        "CORTEX_RUN_HEADER",
        "INPUT_RECORD",
        "PROTOCOL_ACTION_RECORD",
        "NEXT_WEEK_OPERATING_NOTES",
        "ACTION_LIMITS",
        "BOUNDARY_CHECK",
    ),
    "A5": (
        "CORTEX_RUN_HEADER",
        "INPUT_RECORD",
        "RELIABILITY_REVIEW",
        "DRIFT_AND_FAILURE_LOG",
        "CORRECTION_NOTES",
        "HANDOFF_TO_A6",
        "BOUNDARY_CHECK",
    ),
    "A6": (
        "CORTEX_RUN_HEADER",
        "INPUT_RECORD",
        "DURABLE_DOCTRINE_MEMORY",
        "EXPIRING_DOCTRINE",
        "NEXT_MONTH_BASELINE",
        "BOUNDARY_CHECK",
    ),
}

FIELD_RE = re.compile(r"^(?:-\s*)?(?:\*\*)?([^:*\n]+?)(?:\*\*)?:\s*(.+?)\s*$", re.MULTILINE)
DECISION_ID_RE = re.compile(r"^Decision ID:\s*(\S+)\s*$", re.MULTILINE)
SOURCE_DECISION_ID_RE = re.compile(r"^Source Decision ID:\s*(\S+)\s*$", re.MULTILINE)
ACTION_ID_RE = re.compile(r"^Action ID:\s*(\S+)\s*$", re.MULTILINE)


def classify(path: Path) -> tuple[str, str] | None:
    for task, pattern in PATTERNS.items():
        match = pattern.match(path.name)
        if match:
            return task, match.group(1)
    return None


def fields(text: str) -> dict[str, str]:
    result: dict[str, str] = {}
    for key, value in FIELD_RE.findall(text):
        result[key.strip()] = value.strip()
    return result


def iso_week_window(week: str) -> tuple[date, date]:
    year_text, week_text = week.split("-W")
    start = date.fromisocalendar(int(year_text), int(week_text), 1)
    return start, start + timedelta(days=6)


def validate_common(path: Path, task: str, identity: str, text: str) -> list[str]:
    errors: list[str] = []
    for section in REQUIRED_SECTIONS[task]:
        if section not in text:
            errors.append(f"{path.name}: missing section {section}")

    values = fields(text)
    task_id = values.get("Task ID")
    if task_id and task not in task_id:
        errors.append(f"{path.name}: Task ID {task_id!r} does not identify {task}")

    if task in {"A1", "A2"}:
        logical_date = values.get("Logical Date")
        if logical_date and logical_date != identity:
            errors.append(
                f"{path.name}: Logical Date {logical_date!r} does not match filename date {identity}"
            )

    if task in {"A3", "A4"}:
        target_week = values.get("Target Week")
        if target_week and target_week != identity:
            errors.append(
                f"{path.name}: Target Week {target_week!r} does not match filename week {identity}"
            )
        basis = values.get("Logical Week Basis")
        if basis and basis != "Asia/Shanghai":
            errors.append(f"{path.name}: Logical Week Basis must be Asia/Shanghai")

        coverage = values.get("Coverage Window")
        if coverage:
            match = re.fullmatch(r"(\d{4}-\d{2}-\d{2})\s+to\s+(\d{4}-\d{2}-\d{2})", coverage)
            if not match:
                errors.append(f"{path.name}: invalid Coverage Window {coverage!r}")
            else:
                expected_start, expected_end = iso_week_window(identity)
                actual = (date.fromisoformat(match.group(1)), date.fromisoformat(match.group(2)))
                if actual != (expected_start, expected_end):
                    errors.append(
                        f"{path.name}: Coverage Window must be {expected_start} to {expected_end}"
                    )

    boundary = values.get("Boundary Violation")
    if boundary and boundary.upper() not in {"NO", "NONE"}:
        errors.append(f"{path.name}: Boundary Violation is not NO/NONE")

    return errors


def validate_a1(path: Path, text: str) -> list[str]:
    errors: list[str] = []
    for field in (
        "Source ID",
        "URL",
        "Evidence Tier",
        "External Evidence",
        "Local Repository Evidence",
        "Confidence",
        "Uncertainty",
    ):
        if field not in text:
            errors.append(f"{path.name}: A1 does not expose {field}")
    return errors


def validate_a2(path: Path, identity: str, text: str) -> list[str]:
    errors: list[str] = []
    a1 = AEGIS / f"{identity}-A1-reliability-observe.md"
    if not a1.exists():
        if "INPUT_MISSING" not in text or "BLOCKED" not in text:
            errors.append(f"{path.name}: same-day A1 is missing but A2 is not fail-closed")
        return errors

    if f"{identity}-A1-reliability-observe.md" not in text:
        errors.append(f"{path.name}: does not name the same-day A1 input")

    for marker in (
        "External Risk",
        "Local Evidence",
        "Local Applicability",
        "Remaining Uncertainty",
    ):
        if marker not in text:
            errors.append(f"{path.name}: A2 does not preserve {marker}")
    return errors


def validate_a3(path: Path, text: str) -> list[str]:
    errors: list[str] = []
    ids = DECISION_ID_RE.findall(text)
    if not ids:
        errors.append(f"{path.name}: DECISION_SET contains no Decision ID")
    if len(ids) != len(set(ids)):
        errors.append(f"{path.name}: duplicate Decision ID values")
    if "Local Incident Evidence: NO" in text and "NO_LOCAL_EVIDENCE" not in text and "NO_LOCAL_INCIDENT_EVIDENCE" not in text:
        errors.append(f"{path.name}: local-incident absence is not carried as an explicit evidence state")
    return errors


def validate_a4(path: Path, identity: str, text: str) -> list[str]:
    errors: list[str] = []
    action_ids = ACTION_ID_RE.findall(text)
    if not action_ids:
        errors.append(f"{path.name}: PROTOCOL_ACTION_RECORD contains no Action ID")
    if len(action_ids) != len(set(action_ids)):
        errors.append(f"{path.name}: duplicate Action ID values")

    a3 = AEGIS / f"{identity}-A3-discipline-decide.md"
    if not a3.exists():
        if "DECISION_INPUT_MISSING" not in text and "NO_ACTIONABLE_DECISION" not in text:
            errors.append(f"{path.name}: same-week A3 is missing without an explicit no-decision state")
        return errors

    decisions = set(DECISION_ID_RE.findall(a3.read_text(encoding="utf-8")))
    sources = SOURCE_DECISION_ID_RE.findall(text)
    if not sources:
        errors.append(f"{path.name}: actions contain no Source Decision ID")
    unknown = sorted(set(sources) - decisions)
    if unknown:
        errors.append(f"{path.name}: actions reference unknown A3 decisions {unknown}")

    for marker in (
        "Host Repository Change NO",
        "GitHub Actions Change NO",
        "Static Doctrine Change NO",
    ):
        if marker not in text:
            errors.append(f"{path.name}: A4 does not preserve {marker}")
    return errors


def validate_path(path: Path) -> list[str]:
    try:
        path.resolve().relative_to(AEGIS.resolve())
    except ValueError:
        return [f"{path}: outside aegis-cortex"]

    if path.suffix.lower() != ".md":
        return []

    classified = classify(path)
    if classified is None:
        return []

    task, identity = classified
    text = path.read_text(encoding="utf-8")
    errors = validate_common(path, task, identity, text)
    if task == "A1":
        errors.extend(validate_a1(path, text))
    elif task == "A2":
        errors.extend(validate_a2(path, identity, text))
    elif task == "A3":
        errors.extend(validate_a3(path, text))
    elif task == "A4":
        errors.extend(validate_a4(path, identity, text))
    return errors


def main(argv: list[str]) -> int:
    raw_paths = argv[1:]
    if not raw_paths:
        print("usage: python aegis-cortex/check.py <record.md> [record.md ...]", file=sys.stderr)
        return 2

    errors: list[str] = []
    checked = 0
    for raw in raw_paths:
        path = (ROOT / raw).resolve() if not Path(raw).is_absolute() else Path(raw).resolve()
        if not path.exists():
            errors.append(f"missing file: {raw}")
            continue
        checked += 1
        errors.extend(validate_path(path))

    if errors:
        print("Aegis Cortex contract check failed:")
        for error in errors:
            print(f"- {error}")
        return 1

    print(f"Aegis Cortex contract check passed for {checked} path(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
