from __future__ import annotations

import re
import sys
from datetime import date, timedelta
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
REQUIRED = (
    "README.md", "METHOD.md", "CASES.md", "NOTES.md",
    "templates/daily.md", "templates/special.md", "templates/weekly.md", "templates/monthly.md",
    "tools/check.py", "tools/experiment_false_success.ps1",
    "tools/experiment_interrupted_manifest.ps1", "tools/experiment_stale_replay.ps1",
    "tools/experiment_unknown_outcome.py",
    "tools/verify_unknown_outcome.py",
    "tools/experiment_shared_outage.py",
    "tools/verify_shared_outage.py",
    "tools/experiment_breaker_scope.py",
    "tools/verify_breaker_scope.py",
    "tools/experiment_lease_fencing.py",
    "tools/verify_lease_fencing.py",
    "tools/experiment_parser_independence.py",
    "tools/verify_parser_independence.py",
    "tools/experiment_retention_expiry.py",
    "tools/verify_retention_expiry.py",
    "tools/experiment_dual_write_atomicity.py",
    "tools/verify_dual_write_atomicity.py",
    "tools/experiment_late_attempt_fencing.py",
    "tools/verify_late_attempt_fencing.py",
    "tools/experiment_conditional_write_readback.py",
    "tools/verify_conditional_write_readback.py",
    "tools/experiment_cached_read.py",
    "tools/verify_cached_read.py",
)
FORBIDDEN_SUFFIXES = {".backup", ".db", ".jsonl", ".lock", ".pyc", ".stage", ".tmp"}
DAILY_HEADINGS = (
    "## 研究问题", "## 来源依据", "## 可证伪假设", "## 控制条件",
    "## 实验设计", "## 原始观测", "## 独立验证", "## 强反例",
    "## 路径比较", "## 暂时结论", "## 复验条件", "## 体系增量", "## 事实分层", "## 指标",
)
DAILY_FACT_HEADINGS = ("### 已验证事实", "### 基于证据的推断", "### 未验证事项")
SPECIAL_HEADINGS = (
    "## 触发事件", "## 事实边界", "## 时间线", "## 来源矩阵",
    "## 与每日研究的关系", "## 可迁移问题", "## 已验证事实",
    "## 基于证据的推断", "## 未验证事项", "## 后续研究入口",
)
AUDIT_HEADINGS = (
    "## 覆盖区间", "## 纳入记录", "## 审计方法", "## 证据链审计",
    "## 特殊专题关系", "## 重复信号", "## 恢复与重放", "## 假成功检查",
    "## 状态决定", "## 审计缺口", "## 下一阶段控制项", "## 事实分层",
)
AUDIT_FACT_HEADINGS = (
    "### 已验证事实", "### 基于证据的推断", "### 未验证事项"
)
TEMPLATE_HEADINGS = {
    "templates/daily.md": DAILY_HEADINGS,
    "templates/special.md": SPECIAL_HEADINGS,
    "templates/weekly.md": AUDIT_HEADINGS,
    "templates/monthly.md": ("## 日报索引", "## 周期审计索引", "## 运行覆盖", "## 已复验发现", "## 失效记录", "## 有效速度"),
}
DAILY_NAME = re.compile(r"^(?P<day>\d{4}-\d{2}-\d{2})\.md$")
MONTHLY_NAME = re.compile(r"^\d{4}-\d{2}\.md$")
SPECIAL_NAME = re.compile(r"^(?P<day>\d{4}-\d{2}-\d{2})-[a-z0-9-]+\.md$")
AUDIT_NAME = re.compile(
    r"^(?P<start>\d{4}-\d{2}-\d{2})--(?P<end>\d{4}-\d{2}-\d{2})\.md$"
)
MARKDOWN_LINK = re.compile(r"\[[^\]]*\]\(([^)]+)\)")
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
        if path.suffix.lower() == ".md" and text.count("`") % 2:
            errors.append(f"unbalanced markdown backticks: {relative}")
        if chr(0x3002) in text:
            errors.append(f"forbidden punctuation: {relative}")
        if "?" * 3 in text:
            errors.append(f"possible encoding corruption: {relative}")
        if "file:" + "//" in text.lower():
            errors.append(f"local link: {relative}")
        visible_text = re.sub(r"\]\([^)]+\)", "]()", text)
        if path.suffix.lower() == ".md":
            for target in MARKDOWN_LINK.findall(text):
                if re.match(r"^[a-z][a-z0-9+.-]*:", target, re.IGNORECASE):
                    continue
                clean_target = target.split("#", 1)[0]
                if not clean_target:
                    continue
                linked = (path.parent / clean_target).resolve()
                try:
                    linked.relative_to(ROOT)
                except ValueError:
                    errors.append(f"link leaves ballast: {relative} -> {target}")
                    continue
                if not linked.exists():
                    errors.append(f"broken local link: {relative} -> {target}")
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
    monthly = sorted(
        path for path in records.glob("*.md")
        if MONTHLY_NAME.fullmatch(path.name)
    )
    daily = sorted(
        path for path in records.glob("*.md")
        if DAILY_NAME.fullmatch(path.name)
    )
    special_dir = ROOT / "special"
    special_files = (
        sorted(special_dir.glob("*.md")) if special_dir.is_dir() else []
    )
    special = [
        path for path in special_files if SPECIAL_NAME.fullmatch(path.name)
    ]
    audits_dir = ROOT / "audits"
    audit_files = sorted(audits_dir.glob("*.md")) if audits_dir.is_dir() else []
    audits = [path for path in audit_files if AUDIT_NAME.fullmatch(path.name)]
    if len(daily) >= 6 and not audits:
        errors.append("missing cycle audit")
    for path in audit_files:
        if not AUDIT_NAME.fullmatch(path.name):
            errors.append(f"invalid cycle audit name: {path.name}")
    if not monthly:
        errors.append("missing monthly record")
    if not daily:
        errors.append("missing daily record")
    if not special:
        errors.append("missing special topic")
    for path in special_files:
        if not SPECIAL_NAME.fullmatch(path.name):
            errors.append(f"invalid special topic name: {path.name}")

    type_pattern = re.compile(
        r"^\u7c7b\u578b:\s*(.+)$", re.MULTILINE
    )
    theme_pattern = re.compile(
        r"^\u4e3b\u9898:\s*(.+)$", re.MULTILINE
    )
    daily_days: set[str] = set()
    daily_themes: dict[str, str] = {}
    for path in daily:
        match = DAILY_NAME.fullmatch(path.name)
        day = match.group("day")
        daily_days.add(day)
        text = path.read_text(encoding="utf-8")
        record_type = type_pattern.search(text)
        theme_match = theme_pattern.search(text)
        if (
            not record_type
            or record_type.group(1).strip() != "\u6bcf\u65e5\u4e13\u9898"
        ):
            errors.append(f"invalid daily type in records/{path.name}")
        if not theme_match or not theme_match.group(1).strip():
            errors.append(f"missing daily theme in records/{path.name}")
        else:
            theme = theme_match.group(1).strip()
            previous = daily_themes.get(theme)
            if previous:
                errors.append(
                    f"duplicate daily theme: {theme} in {previous} and {path.name}"
                )
            daily_themes[theme] = path.name
        for heading in DAILY_HEADINGS + DAILY_FACT_HEADINGS:
            if heading not in text:
                errors.append(
                    f"missing heading in records/{path.name}: {heading}"
                )

    if daily_days:
        current = DAILY_REQUIRED_FROM
        latest = max(date.fromisoformat(day) for day in daily_days)
        while current <= latest:
            expected = current.isoformat()
            if expected not in daily_days:
                errors.append(f"missing daily topic: {expected}")
            current += timedelta(days=1)

    for path in special:
        text = path.read_text(encoding="utf-8")
        record_type = type_pattern.search(text)
        theme_match = theme_pattern.search(text)
        if (
            not record_type
            or record_type.group(1).strip() != "\u7279\u6b8a\u4e13\u9898"
        ):
            errors.append(f"invalid special type in special/{path.name}")
        if not theme_match or not theme_match.group(1).strip():
            errors.append(f"missing special theme in special/{path.name}")
        for heading in SPECIAL_HEADINGS:
            if heading not in text:
                errors.append(
                    f"missing heading in special/{path.name}: {heading}"
                )
        linked_daily = re.findall(
            r"\(\.\./records/(\d{4}-\d{2}-\d{2})\.md\)", text
        )
        if not linked_daily:
            errors.append(f"special topic has no daily link: {path.name}")
        for linked_day in linked_daily:
            if linked_day not in daily_days:
                errors.append(
                    f"special topic links missing daily: {path.name} -> {linked_day}"
                )

    audited_days: set[str] = set()
    for path in audits:
        match = AUDIT_NAME.fullmatch(path.name)
        start = date.fromisoformat(match.group("start"))
        end = date.fromisoformat(match.group("end"))
        text = path.read_text(encoding="utf-8")
        record_type = type_pattern.search(text)
        theme_match = theme_pattern.search(text)
        if (
            not record_type
            or record_type.group(1).strip() != "\u5468\u671f\u5ba1\u8ba1"
        ):
            errors.append(f"invalid cycle audit type in audits/{path.name}")
        if not theme_match or not theme_match.group(1).strip():
            errors.append(f"missing cycle audit theme in audits/{path.name}")
        if end < start or (end - start).days not in {5, 6}:
            errors.append(f"invalid cycle audit window: {path.name}")
        for heading in AUDIT_HEADINGS + AUDIT_FACT_HEADINGS:
            if heading not in text:
                errors.append(
                    f"missing heading in audits/{path.name}: {heading}"
                )

        expected_days: set[str] = set()
        current = start
        while current <= end:
            expected_days.add(current.isoformat())
            current += timedelta(days=1)
        audited_days.update(expected_days)
        linked_days = set(
            re.findall(
                r"\(\.\./records/(\d{4}-\d{2}-\d{2})\.md\)", text
            )
        )
        missing_days = expected_days - linked_days
        unexpected_days = linked_days - expected_days
        for day in sorted(missing_days):
            errors.append(f"cycle audit missing daily link: {path.name} -> {day}")
        for day in sorted(unexpected_days):
            errors.append(f"cycle audit links outside window: {path.name} -> {day}")
        for day in sorted(expected_days):
            if day not in daily_days:
                errors.append(f"cycle audit covers missing daily: {path.name} -> {day}")

        linked_special = set(
            re.findall(r"\(\.\./special/([^)]+\.md)\)", text)
        )
        for special_path in special:
            special_match = SPECIAL_NAME.fullmatch(special_path.name)
            special_day = date.fromisoformat(special_match.group("day"))
            if start <= special_day <= end and special_path.name not in linked_special:
                errors.append(
                    f"cycle audit missing special link: {path.name} -> {special_path.name}"
                )

    if daily_days:
        latest_daily = max(date.fromisoformat(day) for day in daily_days)
        audit_cutoff = latest_daily - timedelta(days=6)
        current = DAILY_REQUIRED_FROM
        while current <= audit_cutoff:
            if current.isoformat() not in audited_days:
                errors.append(f"overdue cycle audit coverage: {current.isoformat()}")
            current += timedelta(days=1)

    for path in monthly:
        text = path.read_text(encoding="utf-8")
        observations = re.findall(
            r"^## (\d{4}-\d{2}-\d{2})$", text, re.MULTILINE
        )
        for day in observations:
            parsed = date.fromisoformat(day)
            if parsed >= DAILY_REQUIRED_FROM and day not in daily_days:
                errors.append(f"monthly observation has no daily record: {day}")
        indexed = set(
            re.findall(
                r"\[(\d{4}-\d{2}-\d{2})\]\(\./\1\.md\)", text
            )
        )
        for day in daily_days:
            if day.startswith(path.stem) and day not in indexed:
                errors.append(f"daily record missing from monthly index: {day}")
        special_indexed = set(
            re.findall(r"\(\.\./special/([^)]+\.md)\)", text)
        )
        for special_path in special:
            match = SPECIAL_NAME.fullmatch(special_path.name)
            special_day = match.group("day")
            if (
                special_day.startswith(path.stem)
                and special_path.name not in special_indexed
            ):
                errors.append(
                    f"special topic missing from monthly index: {special_path.name}"
                )
        audit_indexed = set(
            re.findall(r"\(\.\./audits/([^)]+\.md)\)", text)
        )
        for audit_path in audits:
            match = AUDIT_NAME.fullmatch(audit_path.name)
            start_month = match.group("start")[:7]
            end_month = match.group("end")[:7]
            if (
                path.stem in {start_month, end_month}
                and audit_path.name not in audit_indexed
            ):
                errors.append(
                    f"cycle audit missing from monthly index: {audit_path.name}"
                )
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
