# vllm-project/vllm · examples/basic/online_serving/openai_chat_completion_client.py

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [vllm-project/vllm](https://github.com/vllm-project/vllm) |
| 来源文件 | [examples/basic/online_serving/openai_chat_completion_client.py](https://github.com/vllm-project/vllm/blob/def95deb0c95d8954fce642cbc9b2a5875236d75/examples/basic/online_serving/openai_chat_completion_client.py) |
| 来源版本 | `def95deb0c95d8954fce642cbc9b2a5875236d75` |
| 摄取时间 | `2026-07-11T06:09:13.455305+00:00` |
| 归属层 | `serving-inference` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_vllm_project_vllm_examples_basic_online_serving_openai_chat_completion_client_py_def95deb0c95` |

## 本次变化

- 新增行数 `64`.
- 删除行数 `0`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- SPDX-License-Identifier: Apache-2.0
- SPDX-FileCopyrightText: Copyright contributors to the vLLM project
- Modify OpenAI's API key and API base to use vLLM's API server.

<details>
<summary>展开完整外部原文</summary>

# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
"""Example Python client for OpenAI Chat Completion using vLLM API server
NOTE: start a supported chat completion model server with `vllm serve`, e.g.
    vllm serve meta-llama/Llama-2-7b-chat-hf
"""

import argparse

from openai import OpenAI

# Modify OpenAI's API key and API base to use vLLM's API server.
openai_api_key = "EMPTY"
openai_api_base = "http://localhost:8000/v1"

messages = [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Who won the world series in 2020?"},
    {
        "role": "assistant",
        "content": "The Los Angeles Dodgers won the World Series in 2020.",
    },
    {"role": "user", "content": "Where was it played?"},
]


def parse_args():
    parser = argparse.ArgumentParser(description="Client for vLLM API server")
    parser.add_argument(
        "--stream", action="store_true", help="Enable streaming response"
    )
    return parser.parse_args()


def main(args):
    client = OpenAI(
        # defaults to os.environ.get("OPENAI_API_KEY")
        api_key=openai_api_key,
        base_url=openai_api_base,
    )

    models = client.models.list()
    model = models.data[0].id

    # Chat Completion API
    chat_completion = client.chat.completions.create(
        messages=messages,
        model=model,
        stream=args.stream,
    )

    print("-" * 50)
    print("Chat completion results:")
    if args.stream:
        for c in chat_completion:
            print(c)
    else:
        print(chat_completion)
    print("-" * 50)


if __name__ == "__main__":
    args = parse_args()
    main(args)

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ def95deb0c95d8954fce642cbc9b2a5875236d75

@@ -0,0 +1,64 @@

+# SPDX-License-Identifier: Apache-2.0
+# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
+"""Example Python client for OpenAI Chat Completion using vLLM API server
+NOTE: start a supported chat completion model server with `vllm serve`, e.g.
+    vllm serve meta-llama/Llama-2-7b-chat-hf
+"""
+
+import argparse
+
+from openai import OpenAI
+
+# Modify OpenAI's API key and API base to use vLLM's API server.
+openai_api_key = "EMPTY"
+openai_api_base = "http://localhost:8000/v1"
+
+messages = [
+    {"role": "system", "content": "You are a helpful assistant."},
+    {"role": "user", "content": "Who won the world series in 2020?"},
+    {
+        "role": "assistant",
+        "content": "The Los Angeles Dodgers won the World Series in 2020.",
+    },
+    {"role": "user", "content": "Where was it played?"},
+]
+
+
+def parse_args():
+    parser = argparse.ArgumentParser(description="Client for vLLM API server")
+    parser.add_argument(
+        "--stream", action="store_true", help="Enable streaming response"
+    )
+    return parser.parse_args()
+
+
+def main(args):
+    client = OpenAI(
+        # defaults to os.environ.get("OPENAI_API_KEY")
+        api_key=openai_api_key,
+        base_url=openai_api_base,
+    )
+
+    models = client.models.list()
+    model = models.data[0].id
+
+    # Chat Completion API
+    chat_completion = client.chat.completions.create(
+        messages=messages,
+        model=model,
+        stream=args.stream,
+    )
+
+    print("-" * 50)
+    print("Chat completion results:")
+    if args.stream:
+        for c in chat_completion:
+            print(c)
+    else:
+        print(chat_completion)
+    print("-" * 50)
+
+
+if __name__ == "__main__":
+    args = parse_args()
+    main(args)
```

</details>
