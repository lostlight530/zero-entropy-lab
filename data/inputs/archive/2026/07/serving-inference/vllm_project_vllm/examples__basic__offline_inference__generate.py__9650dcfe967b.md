# vllm-project/vllm · examples/basic/offline_inference/generate.py

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [vllm-project/vllm](https://github.com/vllm-project/vllm) |
| 来源文件 | [examples/basic/offline_inference/generate.py](https://github.com/vllm-project/vllm/blob/9650dcfe967b3a5ef6716be3d2bbc1e24b1c0d1d/examples/basic/offline_inference/generate.py) |
| 来源版本 | `9650dcfe967b3a5ef6716be3d2bbc1e24b1c0d1d` |
| 摄取时间 | `2026-07-11T06:09:13.212140+00:00` |
| 归属层 | `serving-inference` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_vllm_project_vllm_examples_basic_offline_inference_generate_py_9650dcfe967b` |

## 本次变化

- 新增行数 `65`.
- 删除行数 `0`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- SPDX-License-Identifier: Apache-2.0
- SPDX-FileCopyrightText: Copyright contributors to the vLLM project

<details>
<summary>展开完整外部原文</summary>

# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project

from vllm import LLM, EngineArgs
from vllm.utils.argparse_utils import FlexibleArgumentParser


def create_parser():
    parser = FlexibleArgumentParser()
    # Add engine args
    EngineArgs.add_cli_args(parser)
    parser.set_defaults(model="meta-llama/Llama-3.2-1B-Instruct")
    # Add sampling params
    sampling_group = parser.add_argument_group("Sampling parameters")
    sampling_group.add_argument("--max-tokens", type=int)
    sampling_group.add_argument("--temperature", type=float)
    sampling_group.add_argument("--top-p", type=float)
    sampling_group.add_argument("--top-k", type=int)

    return parser


def main(args: dict):
    # Pop arguments not used by LLM
    max_tokens = args.pop("max_tokens")
    temperature = args.pop("temperature")
    top_p = args.pop("top_p")
    top_k = args.pop("top_k")

    # Create an LLM
    llm = LLM(**args)

    # Create a sampling params object
    sampling_params = llm.get_default_sampling_params()
    if max_tokens is not None:
        sampling_params.max_tokens = max_tokens
    if temperature is not None:
        sampling_params.temperature = temperature
    if top_p is not None:
        sampling_params.top_p = top_p
    if top_k is not None:
        sampling_params.top_k = top_k

    # Generate texts from the prompts. The output is a list of RequestOutput
    # objects that contain the prompt, generated text, and other information.
    prompts = [
        "Hello, my name is",
        "The president of the United States is",
        "The capital of France is",
        "The future of AI is",
    ]
    outputs = llm.generate(prompts, sampling_params)
    # Print the outputs.
    print("-" * 50)
    for output in outputs:
        prompt = output.prompt
        generated_text = output.outputs[0].text
        print(f"Prompt: {prompt!r}\nGenerated text: {generated_text!r}")
        print("-" * 50)


if __name__ == "__main__":
    parser = create_parser()
    args: dict = vars(parser.parse_args())
    main(args)

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ 9650dcfe967b3a5ef6716be3d2bbc1e24b1c0d1d

@@ -0,0 +1,65 @@

+# SPDX-License-Identifier: Apache-2.0
+# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
+
+from vllm import LLM, EngineArgs
+from vllm.utils.argparse_utils import FlexibleArgumentParser
+
+
+def create_parser():
+    parser = FlexibleArgumentParser()
+    # Add engine args
+    EngineArgs.add_cli_args(parser)
+    parser.set_defaults(model="meta-llama/Llama-3.2-1B-Instruct")
+    # Add sampling params
+    sampling_group = parser.add_argument_group("Sampling parameters")
+    sampling_group.add_argument("--max-tokens", type=int)
+    sampling_group.add_argument("--temperature", type=float)
+    sampling_group.add_argument("--top-p", type=float)
+    sampling_group.add_argument("--top-k", type=int)
+
+    return parser
+
+
+def main(args: dict):
+    # Pop arguments not used by LLM
+    max_tokens = args.pop("max_tokens")
+    temperature = args.pop("temperature")
+    top_p = args.pop("top_p")
+    top_k = args.pop("top_k")
+
+    # Create an LLM
+    llm = LLM(**args)
+
+    # Create a sampling params object
+    sampling_params = llm.get_default_sampling_params()
+    if max_tokens is not None:
+        sampling_params.max_tokens = max_tokens
+    if temperature is not None:
+        sampling_params.temperature = temperature
+    if top_p is not None:
+        sampling_params.top_p = top_p
+    if top_k is not None:
+        sampling_params.top_k = top_k
+
+    # Generate texts from the prompts. The output is a list of RequestOutput
+    # objects that contain the prompt, generated text, and other information.
+    prompts = [
+        "Hello, my name is",
+        "The president of the United States is",
+        "The capital of France is",
+        "The future of AI is",
+    ]
+    outputs = llm.generate(prompts, sampling_params)
+    # Print the outputs.
+    print("-" * 50)
+    for output in outputs:
+        prompt = output.prompt
+        generated_text = output.outputs[0].text
+        print(f"Prompt: {prompt!r}\nGenerated text: {generated_text!r}")
+        print("-" * 50)
+
+
+if __name__ == "__main__":
+    parser = create_parser()
+    args: dict = vars(parser.parse_args())
+    main(args)
```

</details>
