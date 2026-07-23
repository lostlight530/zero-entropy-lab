from __future__ import annotations

import re
import sys
from datetime import date
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
REQUIRED = (
    "README.md", "METHOD.md", "CASES.md", "NOTES.md",
    "templates/daily.md", "templates/weekly.md", "templates/monthly.md",
    "tools/check.py", "tools/experiment_false_success.ps1",
    "tools/experiment_interrupted_manifest.ps1", "tools/experiment_stale_replay.ps1",
)
FORBIDDEN_SUFFIXES = {".backup", ".db", ".jsonl", ".lock", ".pyc", ".stage", ".tmp"}
DAILY_HEADINGS = (
    "## 研究问题", "## 来源依据", "## 可证伪假设", "## 控制条件",
    "## 实验设计", "## 原始观测", "## 独立验证", "## 强反例",
    "## 路径比较", "## 暂时结论", "## 复验条件", "## 体系增量", "## 指标",
)
TEMPLATE_HEADINGS = {
    "templates/daily.md": DAILY_HEADINGS,
    "templates/weekly.md": ("## 覆盖区间", "## 恢复与重放", "## 假成功检查", "## 状态决定"),
    "templates/monthly.md": ("## 日报索引", "## 运行覆盖", "## 已复验发现", "## 失效记录", "## 有效速度"),
}
DAILY_NAME = re.compile(r"^(?P<day>\d{4}-\d{2}-\d{2})\.md$")
MONTHLY_NAME = re.compile(r"^\d{4}-\d{2}\.md$")
DAILY_REQUIRED_FROM = date(2026, 7, 21)


def validate() -> list[str]:
    errors: list[str] = []
    files = sorted(path for path in ROOT.rglob("*") if path.is_file())
    for relative in REQUIRED:
        if not (ROOT / relative).is_file():
            errors.append(f"missing required file: {relative}")
    for path in files:
        relative = path.relative_to(ROOT).as_posix()
        if path.suffix.lower() in FORBIDDEN_SUFFIXES:
            errors.append(f"forbidden artifact: {relative}")
        if "__pycache__" in path.parts:
            errors.append(f"forbidden cache: {relative}")
        try:
            text = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            errors.append(f"not utf-8: {relative}")
            continue
        if not text.strip():
            errors.append(f"empty file: {relative}")
        if chr(0x3002) in text:
            errors.append(f"forbidden punctuation: {relative}")
        if "file:" + "//" in text.lower():
            errors.append(f"local link: {relative}")
        visible_text = re.sub(r"\]\([^)]+\)", "]()", text)
        if re.search(r"\bv\d+(?:\.\d+)*\b", visible_text, re.IGNORECASE):
            errors.append(f"version label: {relative}")
    for relative, headings in TEMPLATE_HEADINGS.items():
        path = ROOT / relative
        if path.is_file():
            text = path.read_text(encoding="utf-8")
            for heading in headings:
                if heading not in text:
                    errors.append(f"missing heading in {relative}: {heading}")
    records = ROOT / "records"
    monthly = sorted(path for path in records.glob("*.md") if MONTHLY_NAME.fullmatch(path.name))
    daily = sorted(path for path in records.glob("*.md") if DAILY_NAME.fullmatch(path.name))
    if not monthly:
        errors.append("missing monthly record")
    if not daily:
        errors.append("missing daily record")
    daily_days: set[str] = set()
    for path in daily:
        day = DAILY_NAME.fullmatch(path.name).group("day")
        daily_days.add(day)
        text = path.read_text(encoding="utf-8")
        for heading in DAILY_HEADINGS:
            if heading not in text:
                errors.append(f"missing heading in records/{path.name}: {heading}")
    for path in monthly:
        text = path.read_text(encoding="utf-8")
        for day in re.findall(r"^## (\d{4}-\d{2}-\d{2})$", text, re.MULTILINE):
            parsed = date.fromisoformat(day)
            if parsed >= DAILY_REQUIRED_FROM and day not in daily_days:
                errors.append(f"monthly observation has no daily record: {day}")
        indexed = set(re.findall(r"\[(\d{4}-\d{2}-\d{2})\]\(\./\1\.md\)", text))
        for day in daily_days:
            if day.startswith(path.stem) and day not in indexed:
                errors.append(f"daily record missing from monthly index: {day}")
    return errors


def main() -> int:
    errors = validate()
    if errors:
        for error in errors:
            print(f"ERROR {error}")
        return 1
    count = sum(1 for path in ROOT.rglob("*") if path.is_file())
    print(f"OK ballast files={count}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
