PROVENANCE: {"confidence": 1.0, "entity_id": "doc_vllm_project_vllm_examples_basic_offline_inference_embed_py_626c070c1cfd", "primary_owner": "zero", "retrieved_at": "2026-07-11T06:09:13.070550+00:00", "source_path": "examples/basic/offline_inference/embed.py", "source_repo": "vllm-project/vllm", "source_sha": "626c070c1cfd8270dde6e1216e1e97dca2032e6f"}

# Source Document

# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project

from argparse import Namespace

from vllm import LLM, EngineArgs
from vllm.utils.argparse_utils import FlexibleArgumentParser
from vllm.utils.print_utils import print_embeddings


def parse_args():
    parser = FlexibleArgumentParser()
    parser = EngineArgs.add_cli_args(parser)
    # Set example specific arguments
    parser.set_defaults(
        model="intfloat/e5-small",
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
    # You should pass runner="pooling" for embedding models
    llm = LLM(**vars(args))

    # Generate embedding. The output is a list of EmbeddingRequestOutputs.
    outputs = llm.embed(prompts)

    # Print the outputs.
    print("\nGenerated Outputs:\n" + "-" * 60)
    for prompt, output in zip(prompts, outputs):
        embeds = output.outputs.embedding
        print(f"Prompt: {prompt!r}")
        print_embeddings(embeds)
        print("-" * 60)


if __name__ == "__main__":
    args = parse_args()
    main(args)


# Document Diff

```diff
--- previous

+++ 626c070c1cfd8270dde6e1216e1e97dca2032e6f

@@ -0,0 +1,50 @@

+# SPDX-License-Identifier: Apache-2.0
+# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
+
+from argparse import Namespace
+
+from vllm import LLM, EngineArgs
+from vllm.utils.argparse_utils import FlexibleArgumentParser
+from vllm.utils.print_utils import print_embeddings
+
+
+def parse_args():
+    parser = FlexibleArgumentParser()
+    parser = EngineArgs.add_cli_args(parser)
+    # Set example specific arguments
+    parser.set_defaults(
+        model="intfloat/e5-small",
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
+    # You should pass runner="pooling" for embedding models
+    llm = LLM(**vars(args))
+
+    # Generate embedding. The output is a list of EmbeddingRequestOutputs.
+    outputs = llm.embed(prompts)
+
+    # Print the outputs.
+    print("\nGenerated Outputs:\n" + "-" * 60)
+    for prompt, output in zip(prompts, outputs):
+        embeds = output.outputs.embedding
+        print(f"Prompt: {prompt!r}")
+        print_embeddings(embeds)
+        print("-" * 60)
+
+
+if __name__ == "__main__":
+    args = parse_args()
+    main(args)
```
