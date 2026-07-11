# vllm-project/vllm · examples/basic/offline_inference/classify.py

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [vllm-project/vllm](https://github.com/vllm-project/vllm) |
| 来源文件 | [examples/basic/offline_inference/classify.py](https://github.com/vllm-project/vllm/blob/b72ddde1fb55366f3f2a60d14b6c38d80f4bf962/examples/basic/offline_inference/classify.py) |
| 来源版本 | `b72ddde1fb55366f3f2a60d14b6c38d80f4bf962` |
| 摄取时间 | `2026-07-11T06:09:12.934110+00:00` |
| 归属层 | `serving-inference` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_vllm_project_vllm_examples_basic_offline_inference_classify_py_b72ddde1fb55` |

## 本次变化

- 新增行数 `52`.
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
        model="jason9693/Qwen2.5-1.5B-apeach",
        runner="pooling",
        enforce_eager=True,
    )
    return parser.parse_args()


def main(args: Namespace):
    # Sample prompts.
    prompts = [
        "Hello, my name is",
        "The president of the United States is",
        "The capital of France is",
        "The future of AI is",
    ]

    # Create an LLM.
    # You should pass runner="pooling" for classification models
    llm = LLM(**vars(args))

    # Generate logits. The output is a list of ClassificationRequestOutputs.
    outputs = llm.classify(prompts)

    # Print the outputs.
    print("\nGenerated Outputs:\n" + "-" * 60)
    for prompt, output in zip(prompts, outputs):
        probs = output.outputs.probs
        probs_trimmed = (str(probs[:16])[:-1] + ", ...]") if len(probs) > 16 else probs
        print(
            f"Prompt: {prompt!r} \n"
            f"Class Probabilities: {probs_trimmed} (size={len(probs)})"
        )
        print("-" * 60)


if __name__ == "__main__":
    args = parse_args()
    main(args)

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ b72ddde1fb55366f3f2a60d14b6c38d80f4bf962

@@ -0,0 +1,52 @@

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
+        model="jason9693/Qwen2.5-1.5B-apeach",
+        runner="pooling",
+        enforce_eager=True,
+    )
+    return parser.parse_args()
+
+
+def main(args: Namespace):
+    # Sample prompts.
+    prompts = [
+        "Hello, my name is",
+        "The president of the United States is",
+        "The capital of France is",
+        "The future of AI is",
+    ]
+
+    # Create an LLM.
+    # You should pass runner="pooling" for classification models
+    llm = LLM(**vars(args))
+
+    # Generate logits. The output is a list of ClassificationRequestOutputs.
+    outputs = llm.classify(prompts)
+
+    # Print the outputs.
+    print("\nGenerated Outputs:\n" + "-" * 60)
+    for prompt, output in zip(prompts, outputs):
+        probs = output.outputs.probs
+        probs_trimmed = (str(probs[:16])[:-1] + ", ...]") if len(probs) > 16 else probs
+        print(
+            f"Prompt: {prompt!r} \n"
+            f"Class Probabilities: {probs_trimmed} (size={len(probs)})"
+        )
+        print("-" * 60)
+
+
+if __name__ == "__main__":
+    args = parse_args()
+    main(args)
```

</details>
