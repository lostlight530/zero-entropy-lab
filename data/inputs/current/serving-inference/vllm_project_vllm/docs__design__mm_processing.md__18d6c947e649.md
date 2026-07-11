# vllm-project/vllm · docs/design/mm_processing.md

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [vllm-project/vllm](https://github.com/vllm-project/vllm) |
| 来源文件 | [docs/design/mm_processing.md](https://github.com/vllm-project/vllm/blob/18d6c947e64920283b28b2e7f49268bd4ded6e92/docs/design/mm_processing.md) |
| 来源版本 | `18d6c947e64920283b28b2e7f49268bd4ded6e92` |
| 摄取时间 | `2026-07-11T06:09:10.830283+00:00` |
| 归属层 | `serving-inference` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_vllm_project_vllm_docs_design_mm_processing_md_18d6c947e649` |

## 本次变化

- 新增行数 `63`.
- 删除行数 `0`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- Multi-Modal Data Processing
- Prompt Update Detection
- Tokenized Prompt Inputs
- The problem
- Dummy text
- Automatic prompt updating
- Summary
- Processor Output Caching

<details>
<summary>展开完整外部原文</summary>

# Multi-Modal Data Processing

To enable various optimizations in vLLM such as [chunked prefill](../configuration/optimization.md#chunked-prefill) and [prefix caching](../features/automatic_prefix_caching.md), we use [BaseMultiModalProcessor][vllm.multimodal.processing.BaseMultiModalProcessor] to provide the correspondence between placeholder feature tokens (e.g. `<image>`) and multi-modal inputs (e.g. the raw input image) based on the outputs of HF processor.

Here are the main features of [BaseMultiModalProcessor][vllm.multimodal.processing.BaseMultiModalProcessor]:

## Prompt Update Detection

One of the main responsibilities of HF processor is to update the prompt with placeholder tokens. For example:

- Insert feature placeholder tokens (e.g. `<image><image>...<image>`, the number of which equals to the feature size) at the start of the string.
- Replace existing input placeholder tokens (e.g. `<image>` for a single image) with feature placeholder tokens (e.g. `<image><image>...<image>`, the number of which equals to the feature size).

The information about which tokens have been updated is key to finding the correspondence between placeholder feature tokens and multi-modal inputs.

In vLLM, this information is specified using [PromptUpdate][vllm.multimodal.processing.PromptUpdate] in [_get_prompt_updates][vllm.multimodal.processing.BaseMultiModalProcessor._get_prompt_updates]. We can automatically detect whether HF has updated the prompt by checking the existence of the updated tokens.

## Tokenized Prompt Inputs

To enable tokenization in a separate process, we support passing input token IDs alongside multi-modal data.

### The problem

Consider that HF processors follow these main steps:

1. Tokenize the text
2. Process multi-modal inputs
3. Perform prompt updates

And we require that:

- For text + multi-modal inputs, apply all steps 1--3.
- For tokenized + multi-modal inputs, apply only steps 2--3.

How can we achieve this without rewriting HF processors? We can try to call the HF processor several times on different inputs:

- For text + multi-modal inputs, simply call the HF processor directly.
- For tokenized + multi-modal inputs, call the processor only on the multi-modal inputs.

While HF processors support text + multi-modal inputs natively, this is not so for tokenized + multi-modal inputs: an error is thrown if the number of input placeholder tokens do not correspond to the number of multi-modal inputs.

Moreover, since the tokenized text has not passed through the HF processor, we have to apply Step 3 by ourselves to keep the output tokens and multi-modal data consistent with each other.

### Dummy text

We work around the first issue by requiring each model to define how to generate dummy text based on the number of multi-modal inputs, via [get_dummy_text][vllm.multimodal.processing.BaseDummyInputsBuilder.get_dummy_text]. This lets us generate dummy text corresponding to the multi-modal inputs and input them together to obtain the processed multi-modal data.

### Automatic prompt updating

We address the second issue by implementing model-agnostic code in
[_apply_prompt_updates][vllm.multimodal.processing.BaseMultiModalProcessor._apply_prompt_updates] to automatically update the prompt with feature placeholder tokens based on the specification outputted by [_get_prompt_updates][vllm.multimodal.processing.BaseMultiModalProcessor._get_prompt_updates].

### Summary

With the help of dummy text and automatic prompt updating, our multi-modal processor can finally accept both text and token prompts with multi-modal data. The detailed logic is shown in [_apply_hf_processor_main][vllm.multimodal.processing.BaseMultiModalProcessor._apply_hf_processor_main].

## Processor Output Caching

Some HF processors, such as the one for Qwen2-VL, are [very slow](https://github.com/vllm-project/vllm/issues/9238). To alleviate this problem, we cache the multi-modal outputs of HF processor to avoid processing the same multi-modal input (e.g. image) again.

When new data is passed in, we first check which items are in the cache, and which ones are missing. The missing items are passed into the HF processor in a single batch and cached, before being merged with the existing items in the cache.

Since we only process the missing multi-modal data items, the number of input placeholder tokens no longer corresponds to the number of the multi-modal inputs, so they can't be passed alongside the text prompt to HF processor. Therefore, we process the text and multi-modal inputs separately, using [dummy text](#dummy-text) to avoid HF errors. Since this skips HF's prompt updating code, we apply [automatic prompt updating](#automatic-prompt-updating) afterwards to keep the output tokens and multi-modal data consistent with each other.

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ 18d6c947e64920283b28b2e7f49268bd4ded6e92

@@ -0,0 +1,63 @@

+# Multi-Modal Data Processing
+
+To enable various optimizations in vLLM such as [chunked prefill](../configuration/optimization.md#chunked-prefill) and [prefix caching](../features/automatic_prefix_caching.md), we use [BaseMultiModalProcessor][vllm.multimodal.processing.BaseMultiModalProcessor] to provide the correspondence between placeholder feature tokens (e.g. `<image>`) and multi-modal inputs (e.g. the raw input image) based on the outputs of HF processor.
+
+Here are the main features of [BaseMultiModalProcessor][vllm.multimodal.processing.BaseMultiModalProcessor]:
+
+## Prompt Update Detection
+
+One of the main responsibilities of HF processor is to update the prompt with placeholder tokens. For example:
+
+- Insert feature placeholder tokens (e.g. `<image><image>...<image>`, the number of which equals to the feature size) at the start of the string.
+- Replace existing input placeholder tokens (e.g. `<image>` for a single image) with feature placeholder tokens (e.g. `<image><image>...<image>`, the number of which equals to the feature size).
+
+The information about which tokens have been updated is key to finding the correspondence between placeholder feature tokens and multi-modal inputs.
+
+In vLLM, this information is specified using [PromptUpdate][vllm.multimodal.processing.PromptUpdate] in [_get_prompt_updates][vllm.multimodal.processing.BaseMultiModalProcessor._get_prompt_updates]. We can automatically detect whether HF has updated the prompt by checking the existence of the updated tokens.
+
+## Tokenized Prompt Inputs
+
+To enable tokenization in a separate process, we support passing input token IDs alongside multi-modal data.
+
+### The problem
+
+Consider that HF processors follow these main steps:
+
+1. Tokenize the text
+2. Process multi-modal inputs
+3. Perform prompt updates
+
+And we require that:
+
+- For text + multi-modal inputs, apply all steps 1--3.
+- For tokenized + multi-modal inputs, apply only steps 2--3.
+
+How can we achieve this without rewriting HF processors? We can try to call the HF processor several times on different inputs:
+
+- For text + multi-modal inputs, simply call the HF processor directly.
+- For tokenized + multi-modal inputs, call the processor only on the multi-modal inputs.
+
+While HF processors support text + multi-modal inputs natively, this is not so for tokenized + multi-modal inputs: an error is thrown if the number of input placeholder tokens do not correspond to the number of multi-modal inputs.
+
+Moreover, since the tokenized text has not passed through the HF processor, we have to apply Step 3 by ourselves to keep the output tokens and multi-modal data consistent with each other.
+
+### Dummy text
+
+We work around the first issue by requiring each model to define how to generate dummy text based on the number of multi-modal inputs, via [get_dummy_text][vllm.multimodal.processing.BaseDummyInputsBuilder.get_dummy_text]. This lets us generate dummy text corresponding to the multi-modal inputs and input them together to obtain the processed multi-modal data.
+
+### Automatic prompt updating
+
+We address the second issue by implementing model-agnostic code in
+[_apply_prompt_updates][vllm.multimodal.processing.BaseMultiModalProcessor._apply_prompt_updates] to automatically update the prompt with feature placeholder tokens based on the specification outputted by [_get_prompt_updates][vllm.multimodal.processing.BaseMultiModalProcessor._get_prompt_updates].
+
+### Summary
+
+With the help of dummy text and automatic prompt updating, our multi-modal processor can finally accept both text and token prompts with multi-modal data. The detailed logic is shown in [_apply_hf_processor_main][vllm.multimodal.processing.BaseMultiModalProcessor._apply_hf_processor_main].
+
+## Processor Output Caching
+
+Some HF processors, such as the one for Qwen2-VL, are [very slow](https://github.com/vllm-project/vllm/issues/9238). To alleviate this problem, we cache the multi-modal outputs of HF processor to avoid processing the same multi-modal input (e.g. image) again.
+
+When new data is passed in, we first check which items are in the cache, and which ones are missing. The missing items are passed into the HF processor in a single batch and cached, before being merged with the existing items in the cache.
+
+Since we only process the missing multi-modal data items, the number of input placeholder tokens no longer corresponds to the number of the multi-modal inputs, so they can't be passed alongside the text prompt to HF processor. Therefore, we process the text and multi-modal inputs separately, using [dummy text](#dummy-text) to avoid HF errors. Since this skips HF's prompt updating code, we apply [automatic prompt updating](#automatic-prompt-updating) afterwards to keep the output tokens and multi-modal data consistent with each other.
```

</details>
