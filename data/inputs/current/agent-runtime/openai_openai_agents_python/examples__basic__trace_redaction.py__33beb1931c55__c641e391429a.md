# openai/openai-agents-python · examples/basic/trace_redaction.py

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [openai/openai-agents-python](https://github.com/openai/openai-agents-python) |
| 来源文件 | [examples/basic/trace_redaction.py](https://github.com/openai/openai-agents-python/blob/c641e391429afc1a483772912dd6bb405fcd8932/examples/basic/trace_redaction.py) |
| 来源版本 | `c641e391429afc1a483772912dd6bb405fcd8932` |
| 来源目录 Tree | `94dd74f515679d3f0cd3dd9e021a091e614a7087` |
| 来源内容 Blob | `33beb1931c551a289533542b6e6da841701657cc` |
| 摄取时间 | `2026-09-20T23:40:24.651639+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `external_doc_openai_openai_agents_python_examples_basic_trace_redaction_py` |

## 本次变化

- 新增行数 `84`.
- 删除行数 `0`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- 未发现 Markdown 标题.

<details>
<summary>展开完整外部原文</summary>

"""Export only redacted snapshots, using a local console destination and no API calls."""

from __future__ import annotations

import json
import logging
from collections.abc import Callable
from copy import deepcopy
from typing import Any

from agents import custom_span, set_trace_processors, trace
from agents.tracing import Span, Trace
from agents.tracing.processor_interface import TracingExporter
from agents.tracing.processors import BatchTraceProcessor

logger = logging.getLogger(__name__)


class RedactingExporter(TracingExporter):
    """Keep redaction and delivery within one exporter owned by the application.

    Both callbacks are trusted application code. The redactor receives a private
    payload copy; the destination receives only successfully redacted dictionaries.
    Replace the default processors instead of registering a separate redactor next
    to an exporter. This example does not configure OpenAI backend ingestion.
    """

    def __init__(
        self,
        redact: Callable[[dict[str, Any]], dict[str, Any]],
        send: Callable[[list[dict[str, Any]]], None],
    ) -> None:
        self._redact = redact
        self._send = send

    def export(self, items: list[Trace | Span[Any]]) -> None:
        try:
            redacted = []
            for item in items:
                payload = item.export()
                if payload is not None:
                    redacted.append(self._redact(deepcopy(payload)))
        except Exception:
            pass
        else:
            # Complete redaction of the whole batch before invoking the destination.
            if redacted:
                self._send(redacted)
            return

        # Leave the sensitive exception context before logging: a formatter failure
        # can otherwise print the original payload through exception chaining.
        logger.warning("Trace redaction failed; dropping batch.")


def redact_payload(payload: dict[str, Any]) -> dict[str, Any]:
    """An example allowlist for local diagnostics, not the backend ingest schema.

    Retain only the event category and IDs needed to link events. All names,
    metadata, errors, and span data are omitted. Applications must ensure that
    caller-supplied trace/span/parent IDs contain no sensitive information, or
    replace this policy with their own ID mapping before using the destination.
    """
    return {
        key: payload[key] for key in ("object", "id", "trace_id", "parent_id") if key in payload
    }


def main() -> None:
    exporter = RedactingExporter(redact_payload, lambda batch: print(json.dumps(batch)))
    processor = BatchTraceProcessor(exporter)
    # Replacement is essential: add_trace_processor would retain the default exporter.
    set_trace_processors([processor])
    try:
        with trace("Example private workflow", metadata={"customer": "synthetic-customer"}):
            with custom_span("Example private operation", data={"message": "synthetic-secret"}):
                pass
    finally:
        # shutdown drains queued data through the same redaction boundary.
        processor.shutdown()


if __name__ == "__main__":
    main()

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ 33beb1931c551a289533542b6e6da841701657cc

@@ -0,0 +1,84 @@

+"""Export only redacted snapshots, using a local console destination and no API calls."""
+
+from __future__ import annotations
+
+import json
+import logging
+from collections.abc import Callable
+from copy import deepcopy
+from typing import Any
+
+from agents import custom_span, set_trace_processors, trace
+from agents.tracing import Span, Trace
+from agents.tracing.processor_interface import TracingExporter
+from agents.tracing.processors import BatchTraceProcessor
+
+logger = logging.getLogger(__name__)
+
+
+class RedactingExporter(TracingExporter):
+    """Keep redaction and delivery within one exporter owned by the application.
+
+    Both callbacks are trusted application code. The redactor receives a private
+    payload copy; the destination receives only successfully redacted dictionaries.
+    Replace the default processors instead of registering a separate redactor next
+    to an exporter. This example does not configure OpenAI backend ingestion.
+    """
+
+    def __init__(
+        self,
+        redact: Callable[[dict[str, Any]], dict[str, Any]],
+        send: Callable[[list[dict[str, Any]]], None],
+    ) -> None:
+        self._redact = redact
+        self._send = send
+
+    def export(self, items: list[Trace | Span[Any]]) -> None:
+        try:
+            redacted = []
+            for item in items:
+                payload = item.export()
+                if payload is not None:
+                    redacted.append(self._redact(deepcopy(payload)))
+        except Exception:
+            pass
+        else:
+            # Complete redaction of the whole batch before invoking the destination.
+            if redacted:
+                self._send(redacted)
+            return
+
+        # Leave the sensitive exception context before logging: a formatter failure
+        # can otherwise print the original payload through exception chaining.
+        logger.warning("Trace redaction failed; dropping batch.")
+
+
+def redact_payload(payload: dict[str, Any]) -> dict[str, Any]:
+    """An example allowlist for local diagnostics, not the backend ingest schema.
+
+    Retain only the event category and IDs needed to link events. All names,
+    metadata, errors, and span data are omitted. Applications must ensure that
+    caller-supplied trace/span/parent IDs contain no sensitive information, or
+    replace this policy with their own ID mapping before using the destination.
+    """
+    return {
+        key: payload[key] for key in ("object", "id", "trace_id", "parent_id") if key in payload
+    }
+
+
+def main() -> None:
+    exporter = RedactingExporter(redact_payload, lambda batch: print(json.dumps(batch)))
+    processor = BatchTraceProcessor(exporter)
+    # Replacement is essential: add_trace_processor would retain the default exporter.
+    set_trace_processors([processor])
+    try:
+        with trace("Example private workflow", metadata={"customer": "synthetic-customer"}):
+            with custom_span("Example private operation", data={"message": "synthetic-secret"}):
+                pass
+    finally:
+        # shutdown drains queued data through the same redaction boundary.
+        processor.shutdown()
+
+
+if __name__ == "__main__":
+    main()
```

</details>
