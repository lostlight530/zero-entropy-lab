# vllm-project/vllm · examples/basic/offline_inference/score.py

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [vllm-project/vllm](https://github.com/vllm-project/vllm) |
| 来源文件 | [examples/basic/offline_inference/score.py](https://github.com/vllm-project/vllm/blob/36f028515302a643d5aefd1ffaee3d7dc862e31c/examples/basic/offline_inference/score.py) |
| 来源版本 | `36f028515302a643d5aefd1ffaee3d7dc862e31c` |
| 摄取时间 | `2026-07-11T06:09:13.337315+00:00` |
| 归属层 | `serving-inference` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_vllm_project_vllm_examples_basic_offline_inference_score_py_36f028515302` |

## 本次变化

- 新增行数 `47`.
- 删除行数 `0`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- SPDX-License-Identifier: Apache-2.0
- SPDX-FileCopyrightText: Copyright contributors to the vLLM project

<details>
<summary>展开完整外部原文</summary>

# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project

from argparse import Namespace

from vllm import LLM, EngineArgs
from vllm.utils.argparse_utils import FlexibleArgumentParser


def parse_args():
    parser = FlexibleArgumentParser()
    parser = EngineArgs.add_cli_args(parser)
    # Set example specific arguments
    parser.set_defaults(
        model="BAAI/bge-reranker-v2-m3",
        runner="pooling",
        enforce_eager=True,
    )
    return parser.parse_args()


def main(args: Namespace):
    # Sample prompts.
    query = "What is the capital of France?"
    documents = [
        "The capital of Brazil is Brasilia.",
        "The capital of France is Paris.",
    ]

    # Create an LLM.
    # You should pass runner="pooling" for cross-encoder models
    llm = LLM(**vars(args))

    # Generate scores. The output is a list of ScoringRequestOutputs.
    outputs = llm.score(query, documents)

    # Print the outputs.
    print("\nGenerated Outputs:\n" + "-" * 60)
    for document, output in zip(documents, outputs):
        score = output.outputs.score
        print(f"Pair: {[query, document]!r} \nScore: {score}")
        print("-" * 60)


if __name__ == "__main__":
    args = parse_args()
    main(args)

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ 36f028515302a643d5aefd1ffaee3d7dc862e31c

@@ -0,0 +1,47 @@

+# SPDX-License-Identifier: Apache-2.0
+# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
+
+from argparse import Namespace
+
+from vllm import LLM, EngineArgs
+from vllm.utils.argparse_utils import FlexibleArgumentParser
+
+
+def parse_args():
+    parser = FlexibleArgumentParser()
+    parser = EngineArgs.add_cli_args(parser)
+    # Set example specific arguments
+    parser.set_defaults(
+        model="BAAI/bge-reranker-v2-m3",
+        runner="pooling",
+        enforce_eager=True,
+    )
+    return parser.parse_args()
+
+
+def main(args: Namespace):
+    # Sample prompts.
+    query = "What is the capital of France?"
+    documents = [
+        "The capital of Brazil is Brasilia.",
+        "The capital of France is Paris.",
+    ]
+
+    # Create an LLM.
+    # You should pass runner="pooling" for cross-encoder models
+    llm = LLM(**vars(args))
+
+    # Generate scores. The output is a list of ScoringRequestOutputs.
+    outputs = llm.score(query, documents)
+
+    # Print the outputs.
+    print("\nGenerated Outputs:\n" + "-" * 60)
+    for document, output in zip(documents, outputs):
+        score = output.outputs.score
+        print(f"Pair: {[query, document]!r} \nScore: {score}")
+        print("-" * 60)
+
+
+if __name__ == "__main__":
+    args = parse_args()
+    main(args)
```

</details>
