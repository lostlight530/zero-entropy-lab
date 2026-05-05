# 📡 NEXUS HARVESTER: Intelligence Dossier

Date: 2026-05-05 22:44:19 (UTC)
Target Identity: huggingface/transformers
Version Asset: Release 5.8.0
Source Link: https://github.com/huggingface/transformers/releases/tag/v5.8.0

## 资产物理属性 (Asset Physical Properties)
REPOSITORY_TYPE: EXTERNAL_PACKAGE_INTELLIGENCE
PRIMARY_LANGUAGE: N/A
API_RATE_LIMIT_STATUS: BYPASSED_VIA_TOKEN

## 零熵解析矩阵 (Zero-Entropy Analysis Matrix)
* Dependency Entropy: Detected via Harvest Tags (⚠️ Breaking-Change, 🔗 Agent-Protocol)
DEPENDENCY_ENTROPY: ⚠️_BREAKING-CHANGE,_🔗_AGENT-PROTOCOL
ARCHITECTURE_CONFLICT: HIGH
INTERNAL_LOGIC: EXTERNAL_PAYLOAD_REFERENCE_ONLY

## 威胁与兼容性评估 (Threat & Compatibility Assessment)
DIRECT_CODE_INTEGRATION: STRICTLY_PROHIBITED
HALLUCINATION_RISK: MODERATE

## 行动指令 (Action Directives)
1. Reject all dependency injections from this repository
2. Extract core theoretical concepts for zero-entropy refactoring
3. Ensure any extracted logic uses pure Python `typing` and `inspect.signature`

## 原始载荷 (Raw Payload)

```text
# Release v5.8.0


## New Model additions

### DeepSeek-V4

<img width="6604" height="3574" alt="image" src="https://github.com/user-attachments/assets/4c0fdb29-f770-463c-a97b-d24438896a4c" />

DeepSeek-V4 is the next-generation MoE (Mixture of Experts) language model from DeepSeek that introduces several architectural innovations over DeepSeek-V3. The architecture replaces Multi-head Latent Attention (MLA) with a hybrid local + long-range attention design, swaps residual connections for Manifold-Constrained Hyper-Connections (mHC), and bootstraps the first few MoE layers with a static token-id → expert-id hash table. This implementation covers DeepSeek-V4-Flash, DeepSeek-V4-Pro, and their -Base pretrained variants, which share the same architecture but differ in width, depth, expert count and weights.

**Links:** [Documentation](https://huggingface.co/docs/transformers/main/en/model_doc/deepseek_v4) | [Paper](https://huggingface.co/deepseek-ai/DeepSeek-V4-Flash/blob/main/DeepSeek_V4.pdf)
* Add DeepSeek V4 (#45643) by @ArthurZucker in [#45643](https://github.com/huggingface/transformers/pull/45643)

### Gemma 4 Assistant

<img width="2000" height="400" alt="image" src="https://github.com/user-attachments/assets/02c79b0b-a172-4495-b09d-a6a4b625ee66" />

Gemma 4 Assistant is a small, text-only model that enables speculative decoding for Gemma 4 models using the Multi-Token Prediction (MTP) method and associated candidate generator. The model shares the same Gemma4TextModel backbone as other Gemma 4 models but uses KV sharing throughout the entire model, allowing it to reuse the KV cache populated by the target model and skip the pre-fill phase entirely. This architecture includes cross-attention to make the most of the target model's context, allowing the assistant to accurately predict more drafted tokens per drafting round.

**Links:** [Documentation](https://huggingface.co/docs/transformers/main/en/model_doc/gemma4_assistant)
* First model (#45788) by @SindhuRaghuram97 in [#45788](https://github.com/huggingface/transformers/pull/45788)

### GraniteSpeechPlus

<img width="1310" height="930" alt="image" src="https://github.com/user-attachments/assets/94fc3730-742c-4b9e-ab6a-ed2e5c75d0bf" />

Granite Speech Plus is a variant of Granite Speech that enhances the projector by consuming the concatenation of the encoder's final hidden states with an arbitrary subset of its intermediate hidden states along the feature dimension. It is a multimodal speech-to-text model that can transcribe audio, provide speaker annotation and word level timestamps by responding to text prompts. The model inherits the same architecture components as Granite Speech including the speech encoder, query transformer projector, language model, and optional LoRA adapter.

**Links:** [Documentation](https://huggingface.co/docs/transformers/main/en/model_doc/granite_speech_plus)
* Support for a new Granite-Speech-Plus model (#45695) by @zvik in [#45695](https://github.com/huggingface/transformers/pull/45695)

### Granite4Vision

Granite Vision 4.1 is a vision-language model from IBM Research designed for enterprise-grade document data extraction. It specializes in chart extraction (Chart2CSV, Chart2Summary, Chart2Code), table extraction (JSON, HTML, OTSL), and semantic key-value pair extraction. The model builds on LLaVA-NeXT with architectural innovations including SigLIP2 Vision Encoder, Window Q-Former Projectors, and DeepStack Feature Injection with 8 vision-to-LLM injection points.

**Links:** [Documentation](https://huggingface.co/docs/transformers/main/en/model_doc/granite4_vision)
* Add Granite 4.1 Vision (granite4_vision) (#45597) by @artem-spector in [#45597](https://github.com/huggingface/transformers/pull/45597)

### EXAONE-4.5

<img width="3840" height="2160" alt="image" src="https://github.com/user-attachments/assets/55eb732d-f9da-4f97-8226-2cd3f6476ca0" />

EXAONE 4.5 is the first open-weight vision language model developed by LG AI Research, integrating a dedicated visual encoder into the existing EXAONE 4.0 framework to expand multimodal capabilities. The model features 33 billion parameters in total, including 1.2 billion parameters from the vision encoder, and achieves competitive performance in general benchmarks while outperforming similar-sized models in document understanding and Korean contextual reasoning. It builds on EXAONE 4.0 with key enhancements including an expanded vocabulary of 153,600 tokens, support for up to 256K token context windows, and a Multi-Token Prediction (MTP) mechanism.

**Links:** [Documentation](https://huggingface.co/docs/transformers/main/en/model_doc/exaone4_5) | [Paper](https://huggingface.co/papers/2604.08644) | [Blog Post](https://www.lgresearch.ai/blog/view?seq=641)
* Add EXAONE 4.5 implementations (#45471) by @nuxlear in [#45471](https://github.com/huggingface/transformers/pull/45471)

### PP-FormulaNet

PP-FormulaNet-L and PP-FormulaNet_plus-L are lightweight models designed for table structure recognition, focusing on accurately recognizing table structures in documents and natural scenes. The models are part of the SLANet series and can be used for image-to-text tasks, specifically for detecting and processing mathematical formulas and table structures from images.

**Links:** [Documentation](https://huggingface.co/docs/transformers/main/en/model_doc/pp_formulanet)
* [Model] Add PP-FormulaNet Model Support (#45626) by @zhang-prog in [#45626](https://github.com/huggingface/transformers/pull/45626)



## Breaking changes

Apex integration has been removed from the library (including RMSNorm usage in T5 and related models), so users relying on Apex for mixed precision or fused ops should migrate to PyTorch's native equivalents instead.
* 🚨 Get rid of most Apex references (#45723) by @Rocketknight1



## Tokenization

Fixed tokenizer mapping issues for DeepSeek R1 distilled (Qwen2) and DeepSeek OCR models, and resolved a significant performance regression in `PreTrainedTokenizer.convert_ids_to_tokens` where `skip_special_tokens=True` was rebuilding the special token set on every iteration, resulting in a ~300x speedup for that code path.


* deepseek r1 distilled tokenizer fix for qwen2 mapping (#45741) by @itazap in [#45741]
* DeepSeek OCR specifies an incorrect tokenizer class on the Hub (#45739) by @hmellor in [#45739]
* PythonBackend slow tokenizer convert_ids_to_tokens fix (#45728) by @i3hz in [#45728]


## Bugfixes and improvements

* fix: correct spelling in continuous_api docstring (#45749) by @Dhruv908615 in [#45749]
* Fix link to modular transformers documentation (#45746) by @SangbumChoi in [#45746]
* Gemma4: fix failed test cases (#45568) by @kaixuanliu in [#45568]
* Fix CI: Allow more artifacts to be download in CI (#45785) by @ydshieh in [#45785]
* Add `concurrency` to `PR CI` workflow file (`pr-ci-caller.yml`) (#45786) by @ydshieh in [#45786]
* Reorder decorators for autodoc and dataclass (#45702) by @zucchini-nlp in [#45702]
* Unwrap `text_config` in `AutoModelFor*.from_config` (#45770) by @jamesbraza in [#45770]
* fix: Added Mps support in float fallback backends list  (#45687) by @rigen1048 in [#45687]
* Github Actions PR CI (caller) (#45476) by @ydshieh in [#45476]
* make sure we call check_auto in CI (#45775) by @tarekziade in [#45775]
* Fix auto mapping script (#45774) by @Cyrilvallez in [#45774]
* [MINISTRAL3] Fix conversion script yarn's apply_scale support. (#45744) by @juliendenize in [#45744]
* [nemotron_h] respect _no_reinit flag on dt_bias and out_proj.weight (#45591) by @vai-minzhou in [#45591]
* fix(utils): Resolve backbone utils test regressions (#45594) by @harshaljanjani in [#45594]
* [CB] Better overall script and decode bucketting (#45653) by @remi-or in [#45653]
* [docs] model testing (#45152) by @stevhliu in [#45152]
* update dev (#45726) by @vasqu in [#45726]
* Doc translate to Persian(farsi)  (#45664) by @zeoses in [#45664]
* [`OAI Privacy Filter`] Add integration test (#45725) by @vasqu in [#45725]
* Speedup Qwen2VLImageProcessor (#45719) by @lgeiger in [#45719]
* Remove dead beam-search dummies from dummy_pt_objects.py (#45722) by @jw9603 in [#45722]
* chore(typing): add ty type checking for 10 utility files (#45703) by @moonbogi in [#45703]
* Llama3 video fix (#45040) by @sywangyi in [#45040]
* Fix custom-module copies inheriting read-only permissions (#45686) by @nurpax in [#45686]
* Python code in model docs (#45608) by @zucchini-nlp in [#45608]
* fix failed test cases for blt model (#45596) by @kaixuanliu in [#45596]
* chore(typing): add ty type checking for 3 pipeline files (#45667) by @moonbogi in [#45667]

## Significant community contributions

The following contributors have made significant changes to the library over the last release:

* @artem-spector
    * Add Granite 4.1 Vision (granite4_vision) (#45597)
* @SindhuRaghuram97
    * First model (#45788)
* @nuxlear
    * Add EXAONE 4.5 implementations (#45471)
* @ArthurZucker
    * Add DeepSeek V4 (#45643)
* @remi-or
    * [CB] Better overall script and decode bucketting (#45653)
* @zhang-prog
    * [Model] Add PP-FormulaNet Model Support (#45626)
* @zvik
    * Support for a new Granite-Speech-Plus model (#45695)
```
