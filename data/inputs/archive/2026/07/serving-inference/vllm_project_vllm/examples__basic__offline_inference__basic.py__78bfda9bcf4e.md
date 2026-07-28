# vllm-project/vllm · examples/basic/offline_inference/basic.py

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [vllm-project/vllm](https://github.com/vllm-project/vllm) |
| 来源文件 | [examples/basic/offline_inference/basic.py](https://github.com/vllm-project/vllm/blob/78bfda9bcf4e3c5b8fbe7843e4be8b5b10dcec24/examples/basic/offline_inference/basic.py) |
| 来源版本 | `78bfda9bcf4e3c5b8fbe7843e4be8b5b10dcec24` |
| 摄取时间 | `2026-07-11T06:09:12.685975+00:00` |
| 归属层 | `serving-inference` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_vllm_project_vllm_examples_basic_offline_inference_basic_py_78bfda9bcf4e` |

## 本次变化

- 新增行数 `35`.
- 删除行数 `0`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- SPDX-License-Identifier: Apache-2.0
- SPDX-FileCopyrightText: Copyright contributors to the vLLM project
- Sample prompts.
- Create a sampling params object.

<details>
<summary>展开完整外部原文</summary>

# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project

from vllm import LLM, SamplingParams

# Sample prompts.
prompts = [
    "Hello, my name is",
    "The president of the United States is",
    "The capital of France is",
    "The future of AI is",
]
# Create a sampling params object.
sampling_params = SamplingParams(temperature=0.8, top_p=0.95)


def main():
    # Create an LLM.
    llm = LLM(model="facebook/opt-125m")
    # Generate texts from the prompts.
    # The output is a list of RequestOutput objects
    # that contain the prompt, generated text, and other information.
    outputs = llm.generate(prompts, sampling_params)
    # Print the outputs.
    print("\nGenerated Outputs:\n" + "-" * 60)
    for output in outputs:
        prompt = output.prompt
        generated_text = output.outputs[0].text
        print(f"Prompt:    {prompt!r}")
        print(f"Output:    {generated_text!r}")
        print("-" * 60)


if __name__ == "__main__":
    main()

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ 78bfda9bcf4e3c5b8fbe7843e4be8b5b10dcec24

@@ -0,0 +1,35 @@

+# SPDX-License-Identifier: Apache-2.0
+# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
+
+from vllm import LLM, SamplingParams
+
+# Sample prompts.
+prompts = [
+    "Hello, my name is",
+    "The president of the United States is",
+    "The capital of France is",
+    "The future of AI is",
+]
+# Create a sampling params object.
+sampling_params = SamplingParams(temperature=0.8, top_p=0.95)
+
+
+def main():
+    # Create an LLM.
+    llm = LLM(model="facebook/opt-125m")
+    # Generate texts from the prompts.
+    # The output is a list of RequestOutput objects
+    # that contain the prompt, generated text, and other information.
+    outputs = llm.generate(prompts, sampling_params)
+    # Print the outputs.
+    print("\nGenerated Outputs:\n" + "-" * 60)
+    for output in outputs:
+        prompt = output.prompt
+        generated_text = output.outputs[0].text
+        print(f"Prompt:    {prompt!r}")
+        print(f"Output:    {generated_text!r}")
+        print("-" * 60)
+
+
+if __name__ == "__main__":
+    main()
```

</details>
