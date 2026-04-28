# 📡 NEXUS HARVESTER: Intelligence Dossier

Date: 2026-04-28 22:44:46 (UTC)
Target Identity: huggingface/transformers
Version Asset: Release v5.7.0
Source Link: https://github.com/huggingface/transformers/releases/tag/v5.7.0

## 资产物理属性 (Asset Physical Properties)
* Repository Type: External Package / Intelligence
* Primary Language: N/A
* API Rate Limit Status: Bypassed via injected GITHUB_TOKEN header

## 零熵解析矩阵 (Zero-Entropy Analysis Matrix)
* Dependency Entropy: Detected via Harvest Tags (🏷️ Edge-Ready, 🔗 Agent-Protocol)
* Architecture Conflict: High (Heavy external dependency footprint detected)
* Internal Logic: External Payload Reference only

## 威胁与兼容性评估 (Threat & Compatibility Assessment)
* Direct Code Integration: Strictly Prohibited (Violates pure standard library constraint)
* Hallucination Risk: Moderate (Requires structural parsing)

## 行动指令 (Action Directives)
1. Reject all dependency injections from this repository
2. Extract core theoretical concepts for zero-entropy refactoring
3. Ensure any extracted logic uses pure Python `typing` and `inspect.signature`

## 原始载荷 (Raw Payload)

```text
# Release v5.7.0


## New Model additions

### Laguna

<img width="699" height="176" alt="image" src="https://github.com/user-attachments/assets/d3bae269-bea7-4ddf-a53f-d4718befdb17" />

Laguna is Poolside's mixture-of-experts language model family that extends standard SwiGLU MoE transformers with two key innovations. It features per-layer head counts allowing different decoder layers to have different query-head counts while sharing the same KV cache shape, and implements a sigmoid MoE router with auxiliary-loss-free load balancing that uses element-wise sigmoid of gate logits plus learned per-expert bias for router scoring.

**Links:** [Documentation](https://huggingface.co/docs/transformers/main/en/model_doc/laguna)
* Laguna XS.2 implementation (#45673) by @joerowell in [#45673](https://github.com/huggingface/transformers/pull/45673)

### DEIMv2

<img width="2874" height="908" alt="image" src="https://github.com/user-attachments/assets/fc8c59fe-f964-42ce-ae8e-c7fcace9beb7" />

DEIMv2 (DETR with Improved Matching v2) is a real-time object detection model that extends DEIM with DINOv3 features and spans eight model sizes from X to Atto for diverse deployment scenarios. It uses a Spatial Tuning Adapter (STA) for larger variants to convert DINOv3's single-scale output into multi-scale features, while ultra-lightweight models employ pruned HGNetv2 backbones. The unified design achieves superior performance-cost trade-offs, with DEIMv2-X reaching 57.8 AP with only 50.3M parameters and DEIMv2-S being the first sub-10M model to exceed 50 AP on COCO.

**Links:** [Documentation](https://huggingface.co/docs/transformers/main/en/model_doc/deimv2) | [Paper](https://huggingface.co/papers/2509.20787)
* model: Add DEIMv2 to Transformers (#44339) by @harshaljanjani in [#44339](https://github.com/huggingface/transformers/pull/44339)



## Attention

Several attention-related bugs were fixed across multiple models, including a cross-attention cache type error in T5Gemma2 for long inputs, incorrect cached forward behavior in Qwen3.5's gated-delta-net linear attention, and a crash in GraniteMoeHybrid when no Mamba layers are present. Attention function dispatch was also updated to align with the latest model implementations.


* Fix cross-attention cache layer type for T5Gemma2 long inputs (#45540) by @Beichen-Ma in [#45540]
* [Qwen3.5] Fix GDN linear attention multi-token cached forward (#45513) by @kashif in [#45513]
* Fix GraniteMoeHybrid _update_mamba_mask crash on attention-only models (#45514) by @tianhaocui in [#45514]
* Align latest model attention function dispatch (#45598) by @Cyrilvallez in [#45598]



## Tokenizers

There was a bug in AutoTokenizer that caused the wrong tokenizer class to be initialized. This caused regressions in models like DeepSeek R1. 

* change got reverted (#45680) by @itazap in [#45680]


## Generation

Continuous batching generation received several fixes and improvements, including correcting KV deduplication and memory estimation for long sequences (16K+), and removing misleading warnings about `num_return_sequences` and other unsupported features that were incorrectly firing even when functionality worked correctly. Documentation for per-request sampling parameters was also added.


* generate: drop stale num_return_sequences warning on continuous batching path (#45582) by @joaquinhuigomez in [#45582]
* Remove unnecessary generate warnings (#45619) by @Cyrilvallez in [#45619]
* [CB] Changes for long generation (#45530) by @remi-or in [#45530]
* [docs] per-request sampling params (#45553) by @stevhliu in [#45553]


## Kernels

Improved kernel support by fixing configuration reading and error handling for FP8 checkpoints (e.g., Qwen3.5-35B-A3B-FP8), enabling custom expert kernels registered from the HF Hub to be properly loaded, and resolving an incompatibility that prevented Gemma3n and Gemma4 from using the rotary kernel.


* Fix configuration reading and error handling for kernels (#45610) by @hmellor in [#45610]
* Allow for registered experts from kernels hub (#45577) by @winglian in [#45577]
* Gemma3n and Gemma4 cannot use rotary kernel (#45564) by @Cyrilvallez in [#45564]


## Bugfixes and improvements

* fixing more typos (#45689) by @vasqu in [#45689]
* [docs] cb memory management (#45587) by @stevhliu in [#45587]
* [docs] cpu offloading (#45660) by @stevhliu in [#45660]
* docs(README_zh-hans): clarify conditions for not using Transformers (#45688) by @GuaiZai233 in [#45688]
* fix padding side issue for fast_vlm tests (#45592) by @kaixuanliu in [#45592]
* Fix `x_clip`: 8 failed test cases (#45394) by @kaixuanliu in [#45394]
* zero_shot_object_detection ValueError fix for python 3.13 (#45669) by @AnkitAhlawat7742 in [#45669]
* Fix pageable H2D copies in Gated DeltaNet PyTorch fallback (#45665) by @ruixiang63 in [#45665]
* Fix UnboundLocalError in shard_and_distribute_module for replicated parameters (#45675) by @Abdennacer-Badaoui in [#45675]
* [MistralCommonBackend] Soften validation mode and apply_chat_template arguments check (#45628) by @juliendenize in [#45628]
* Fix `NameError: PeftConfigLike` triggered by `PreTrainedModel.__init_subclass__` (#45658) by @qgallouedec in [#45658]
* chore(typing): added modeling_utils to ty (#45425) by @tarekziade in [#45425]
* [gemma4] infer from config instead of hardcoding (#45606) by @eustlb in [#45606]
* Update quants tests  (#45480) by @SunMarc in [#45480]
* 🔴🔴🔴 fix: skip `clean_up_tokenization` for BPE tokenizers in `PreTrainedTokenizerFast` (#44915) by @maxsloef-goodfire in [#44915]
* Fix colmodernvbert tests (#45652) by @Cyrilvallez in [#45652]
* [CB] [Major] Add CPU request offloading (#45184) by @remi-or in [#45184]
* Fix peft constructors (#45622) by @Cyrilvallez in [#45622]
* chore: speedup modular converter (~30%) (#45046) by @tarekziade in [#45046]
* Fix whisper return language (#42227) by @FredHaa in [#42227]
* Add `supports_gradient_checkpointing` to `NemotronHPreTrainedModel` (#45625) by @sergiopaniego in [#45625]
* Raise clear error for `problem_type="single_label_classification"` with `num_labels=1` (#45611) by @gaurav0107 in [#45611]
* CircleCI with torch 2.11 (#45633) by @ydshieh in [#45633]
* chore: bump doc-builder SHA for main doc build workflow (#45631) by @rtrompier in [#45631]
* Allow more artifacts to be download in CI (#45629) by @ydshieh in [#45629]
* chore(qa): split pipeline and add type checking (#45432) by @tarekziade in [#45432]
* Skip failing offloading tests (#45624) by @Cyrilvallez in [#45624]
* fix: compute auxiliary losses when denoising is disabled in D-FINE (#45601) by @Abineshabee in [#45601]
* qa: bumped mlinter and allow local override (#45585) by @tarekziade in [#45585]
* Processing Utils: continue when content is a string (#45605) by @RyanMullins in [#45605]
* SonicMoe (#45433) by @IlyasMoutawwakil in [#45433]
* fix transformers + torchao nvfp4 serialization (#45573) by @vkuzo in [#45573]
* [AMD CI] Fix expectations for Gemma3n (#45602) by @Abdennacer-Badaoui in [#45602]
* [docs] multi-turn tool calling (#45554) by @stevhliu in [#45554]
* Fix `AttributeError` on `s_aux=None` in `flash_attention_forward` (#45589) by @jamesbraza in [#45589]
* do not index past decoded chars with special tokens (#45435) by @itazap in [#45435]
* Update dev version (#45583) by @vasqu in [#45583]
* Update torchao usage for XPU and CPU (#45560) by @jiqing-feng in [#45560]

## Significant community contributions

The following contributors have made significant changes to the library over the last release:

* @vasqu
    * fixing more typos (#45689)
    * Update dev version (#45583)
* @joerowell
    * Laguna XS.2 implementation (#45673)
* @tarekziade
    * chore(typing): added modeling_utils to ty (#45425)
    * chore: speedup modular converter (~30%) (#45046)
    * chore(qa): split pipeline and add type checking (#45432)
    * qa: bumped mlinter and allow local override (#45585)
* @harshaljanjani
    * model: Add DEIMv2 to Transformers (#44339)
* @remi-or
    * [CB] [Major] Add CPU request offloading (#45184)
    * [CB] Changes for long generation (#45530)

```
