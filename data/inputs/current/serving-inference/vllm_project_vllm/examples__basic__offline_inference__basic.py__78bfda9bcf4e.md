PROVENANCE: {"confidence": 1.0, "entity_id": "doc_vllm_project_vllm_examples_basic_offline_inference_basic_py_78bfda9bcf4e", "primary_owner": "zero", "retrieved_at": "2026-07-11T06:09:12.685975+00:00", "source_path": "examples/basic/offline_inference/basic.py", "source_repo": "vllm-project/vllm", "source_sha": "78bfda9bcf4e3c5b8fbe7843e4be8b5b10dcec24"}

# Source Document

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


# Document Diff

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
