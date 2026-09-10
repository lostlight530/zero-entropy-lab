# vllm-project/vllm · examples/basic/online_serving/watermark_detection_server.py

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [vllm-project/vllm](https://github.com/vllm-project/vllm) |
| 来源文件 | [examples/basic/online_serving/watermark_detection_server.py](https://github.com/vllm-project/vllm/blob/a89de950a43896cfd97a3b7f051a8f0984ea6be0/examples/basic/online_serving/watermark_detection_server.py) |
| 来源版本 | `a89de950a43896cfd97a3b7f051a8f0984ea6be0` |
| 来源目录 Tree | `cfeb3173928b2b51eb943c8f1dacbc9c3ebf57b4` |
| 来源内容 Blob | `124850d75eb3a9c3eecd022e6cf6c0eee4bf22e3` |
| 摄取时间 | `2026-09-10T23:31:26.938369+00:00` |
| 归属层 | `serving-inference` |
| 可信度 | `1.0` |
| 记忆实体 | `external_doc_vllm_project_vllm_examples_basic_online_serving_watermark_detection_server_py` |

## 本次变化

- 新增行数 `70`.
- 删除行数 `0`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- SPDX-License-Identifier: Apache-2.0
- SPDX-FileCopyrightText: Copyright contributors to the vLLM project

<details>
<summary>展开完整外部原文</summary>

# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project

"""Minimal reference server for watermark detection."""

import argparse

import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel

from vllm.tokenizers import TokenizerLike, cached_get_tokenizer
from vllm.v1.watermarking import GumbelWatermarkDetector

app = FastAPI()
tokenizer: TokenizerLike | None = None
detector: GumbelWatermarkDetector | None = None


class DetectionRequest(BaseModel):
    text: str


class DetectionResponse(BaseModel):
    score: float
    p_value: float
    num_scored_tokens: int
    is_watermarked: bool


@app.post("/detect")
def detect(request: DetectionRequest) -> DetectionResponse:
    assert tokenizer is not None
    assert detector is not None
    token_ids = tokenizer.encode(request.text, add_special_tokens=False)
    result = detector.detect(token_ids)
    return DetectionResponse(
        score=result.score,
        p_value=result.p_value,
        num_scored_tokens=result.num_scored_tokens,
        is_watermarked=result.is_watermarked,
    )


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--tokenizer", required=True)
    parser.add_argument("--key", required=True, type=int)
    parser.add_argument("--prf", choices=("philox",), default="philox")
    parser.add_argument("--context-width", type=int, default=4)
    parser.add_argument("--p-value-threshold", type=float, default=0.01)
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8000)
    return parser.parse_args()


def main(args: argparse.Namespace) -> None:
    global tokenizer, detector
    tokenizer = cached_get_tokenizer(args.tokenizer)
    detector = GumbelWatermarkDetector(
        key=args.key,
        context_width=args.context_width,
        p_value_threshold=args.p_value_threshold,
        prf=args.prf,
    )
    uvicorn.run(app, host=args.host, port=args.port)


if __name__ == "__main__":
    main(parse_args())

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ 124850d75eb3a9c3eecd022e6cf6c0eee4bf22e3

@@ -0,0 +1,70 @@

+# SPDX-License-Identifier: Apache-2.0
+# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
+
+"""Minimal reference server for watermark detection."""
+
+import argparse
+
+import uvicorn
+from fastapi import FastAPI
+from pydantic import BaseModel
+
+from vllm.tokenizers import TokenizerLike, cached_get_tokenizer
+from vllm.v1.watermarking import GumbelWatermarkDetector
+
+app = FastAPI()
+tokenizer: TokenizerLike | None = None
+detector: GumbelWatermarkDetector | None = None
+
+
+class DetectionRequest(BaseModel):
+    text: str
+
+
+class DetectionResponse(BaseModel):
+    score: float
+    p_value: float
+    num_scored_tokens: int
+    is_watermarked: bool
+
+
+@app.post("/detect")
+def detect(request: DetectionRequest) -> DetectionResponse:
+    assert tokenizer is not None
+    assert detector is not None
+    token_ids = tokenizer.encode(request.text, add_special_tokens=False)
+    result = detector.detect(token_ids)
+    return DetectionResponse(
+        score=result.score,
+        p_value=result.p_value,
+        num_scored_tokens=result.num_scored_tokens,
+        is_watermarked=result.is_watermarked,
+    )
+
+
+def parse_args() -> argparse.Namespace:
+    parser = argparse.ArgumentParser(description=__doc__)
+    parser.add_argument("--tokenizer", required=True)
+    parser.add_argument("--key", required=True, type=int)
+    parser.add_argument("--prf", choices=("philox",), default="philox")
+    parser.add_argument("--context-width", type=int, default=4)
+    parser.add_argument("--p-value-threshold", type=float, default=0.01)
+    parser.add_argument("--host", default="127.0.0.1")
+    parser.add_argument("--port", type=int, default=8000)
+    return parser.parse_args()
+
+
+def main(args: argparse.Namespace) -> None:
+    global tokenizer, detector
+    tokenizer = cached_get_tokenizer(args.tokenizer)
+    detector = GumbelWatermarkDetector(
+        key=args.key,
+        context_width=args.context_width,
+        p_value_threshold=args.p_value_threshold,
+        prf=args.prf,
+    )
+    uvicorn.run(app, host=args.host, port=args.port)
+
+
+if __name__ == "__main__":
+    main(parse_args())
```

</details>
