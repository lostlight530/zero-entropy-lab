PROVENANCE: {"confidence": 1.0, "entity_id": "doc_vllm_project_vllm_examples_basic_online_serving_openai_completion_client_py_df6e4e942965", "primary_owner": "zero", "retrieved_at": "2026-07-11T06:09:13.596116+00:00", "source_path": "examples/basic/online_serving/openai_completion_client.py", "source_repo": "vllm-project/vllm", "source_sha": "df6e4e9429650b7db914f585f4ccadb643d9c887"}

# Source Document

# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project

import argparse

from openai import OpenAI

# Modify OpenAI's API key and API base to use vLLM's API server.
openai_api_key = "EMPTY"
openai_api_base = "http://localhost:8000/v1"


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

    # Completion API
    completion = client.completions.create(
        model=model,
        prompt="A robot may not injure a human being",
        echo=False,
        n=2,
        stream=args.stream,
        logprobs=3,
    )

    print("-" * 50)
    print("Completion results:")
    if args.stream:
        for c in completion:
            print(c)
    else:
        print(completion)
    print("-" * 50)


if __name__ == "__main__":
    args = parse_args()
    main(args)


# Document Diff

```diff
--- previous

+++ df6e4e9429650b7db914f585f4ccadb643d9c887

@@ -0,0 +1,53 @@

+# SPDX-License-Identifier: Apache-2.0
+# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
+
+import argparse
+
+from openai import OpenAI
+
+# Modify OpenAI's API key and API base to use vLLM's API server.
+openai_api_key = "EMPTY"
+openai_api_base = "http://localhost:8000/v1"
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
+    # Completion API
+    completion = client.completions.create(
+        model=model,
+        prompt="A robot may not injure a human being",
+        echo=False,
+        n=2,
+        stream=args.stream,
+        logprobs=3,
+    )
+
+    print("-" * 50)
+    print("Completion results:")
+    if args.stream:
+        for c in completion:
+            print(c)
+    else:
+        print(completion)
+    print("-" * 50)
+
+
+if __name__ == "__main__":
+    args = parse_args()
+    main(args)
```
