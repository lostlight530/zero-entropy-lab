# vllm-project/vllm · examples/basic/offline_inference/chat.py

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [vllm-project/vllm](https://github.com/vllm-project/vllm) |
| 来源文件 | [examples/basic/offline_inference/chat.py](https://github.com/vllm-project/vllm/blob/bca962597c6bad025f646e944093ce7ee2cdd39a/examples/basic/offline_inference/chat.py) |
| 来源版本 | `bca962597c6bad025f646e944093ce7ee2cdd39a` |
| 摄取时间 | `2026-07-11T06:09:12.813827+00:00` |
| 归属层 | `serving-inference` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_vllm_project_vllm_examples_basic_offline_inference_chat_py_bca962597c6b` |

## 本次变化

- 新增行数 `102`.
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
from vllm.outputs import RequestOutput
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
    # Add example params
    parser.add_argument("--chat-template-path", type=str)

    return parser


def main(args: dict):
    # Pop arguments not used by LLM
    max_tokens = args.pop("max_tokens")
    temperature = args.pop("temperature")
    top_p = args.pop("top_p")
    top_k = args.pop("top_k")
    chat_template_path = args.pop("chat_template_path")

    # Create an LLM
    llm = LLM(**args)

    # Create sampling params object
    sampling_params = llm.get_default_sampling_params()
    if max_tokens is not None:
        sampling_params.max_tokens = max_tokens
    if temperature is not None:
        sampling_params.temperature = temperature
    if top_p is not None:
        sampling_params.top_p = top_p
    if top_k is not None:
        sampling_params.top_k = top_k

    def print_outputs(outputs: list[RequestOutput], prompts: list):
        assert len(outputs) == len(prompts)
        print("\nGenerated Outputs:\n" + "-" * 80)
        for i, output in enumerate(outputs):
            generated_text = output.outputs[0].text
            print(f"Prompt: {prompts[i]!r}\n")
            print(f"Generated text: {generated_text!r}")
            print("-" * 80)

    print("=" * 80)

    # In this script, we demonstrate how to pass input to the chat method:
    conversation = [
        {"role": "system", "content": "You are a helpful assistant"},
        {"role": "user", "content": "Hello"},
        {"role": "assistant", "content": "Hello! How can I assist you today?"},
        {
            "role": "user",
            "content": "Write an essay about the importance of higher education.",
        },
    ]
    outputs = llm.chat(conversation, sampling_params, use_tqdm=False)
    print_outputs(
        outputs,
        [
            conversation,
        ],
    )

    # You can run batch inference with llm.chat API
    conversations = [conversation for _ in range(10)]

    # We turn on tqdm progress bar to verify it's indeed running batch inference
    outputs = llm.chat(conversations, sampling_params, use_tqdm=True)
    print_outputs(outputs, conversations)

    # A chat template can be optionally supplied.
    # If not, the model will use its default chat template.
    if chat_template_path is not None:
        with open(chat_template_path) as f:
            chat_template = f.read()

        outputs = llm.chat(
            conversations,
            sampling_params,
            use_tqdm=False,
            chat_template=chat_template,
        )
        print_outputs(outputs, conversations)


if __name__ == "__main__":
    parser = create_parser()
    args: dict = vars(parser.parse_args())
    main(args)

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ bca962597c6bad025f646e944093ce7ee2cdd39a

@@ -0,0 +1,102 @@

+# SPDX-License-Identifier: Apache-2.0
+# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
+
+from vllm import LLM, EngineArgs
+from vllm.outputs import RequestOutput
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
+    # Add example params
+    parser.add_argument("--chat-template-path", type=str)
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
+    chat_template_path = args.pop("chat_template_path")
+
+    # Create an LLM
+    llm = LLM(**args)
+
+    # Create sampling params object
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
+    def print_outputs(outputs: list[RequestOutput], prompts: list):
+        assert len(outputs) == len(prompts)
+        print("\nGenerated Outputs:\n" + "-" * 80)
+        for i, output in enumerate(outputs):
+            generated_text = output.outputs[0].text
+            print(f"Prompt: {prompts[i]!r}\n")
+            print(f"Generated text: {generated_text!r}")
+            print("-" * 80)
+
+    print("=" * 80)
+
+    # In this script, we demonstrate how to pass input to the chat method:
+    conversation = [
+        {"role": "system", "content": "You are a helpful assistant"},
+        {"role": "user", "content": "Hello"},
+        {"role": "assistant", "content": "Hello! How can I assist you today?"},
+        {
+            "role": "user",
+            "content": "Write an essay about the importance of higher education.",
+        },
+    ]
+    outputs = llm.chat(conversation, sampling_params, use_tqdm=False)
+    print_outputs(
+        outputs,
+        [
+            conversation,
+        ],
+    )
+
+    # You can run batch inference with llm.chat API
+    conversations = [conversation for _ in range(10)]
+
+    # We turn on tqdm progress bar to verify it's indeed running batch inference
+    outputs = llm.chat(conversations, sampling_params, use_tqdm=True)
+    print_outputs(outputs, conversations)
+
+    # A chat template can be optionally supplied.
+    # If not, the model will use its default chat template.
+    if chat_template_path is not None:
+        with open(chat_template_path) as f:
+            chat_template = f.read()
+
+        outputs = llm.chat(
+            conversations,
+            sampling_params,
+            use_tqdm=False,
+            chat_template=chat_template,
+        )
+        print_outputs(outputs, conversations)
+
+
+if __name__ == "__main__":
+    parser = create_parser()
+    args: dict = vars(parser.parse_args())
+    main(args)
```

</details>
