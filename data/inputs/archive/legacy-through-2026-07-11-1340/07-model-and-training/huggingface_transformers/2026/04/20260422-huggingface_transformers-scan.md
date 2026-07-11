# 📡 NEXUS HARVESTER: Intelligence Dossier

Date: 2026-04-22 16:05:51 (UTC)
Target Identity: huggingface/transformers
Version Asset: Release v560
Source Link: https://githubcom/huggingface/transformers/releases/tag/v560

## 资产物理属性 (Asset Physical Properties)
* Repository Type: External Package / Intelligence
* Primary Language: N/A
* API Rate Limit Status: Bypassed via injected GITHUB_TOKEN header

## 零熵解析矩阵 (Zero-Entropy Analysis Matrix)
* Dependency Entropy: Detected via Harvest Tags (🏷️ Edge-Ready, ⚠️ Breaking-Change, 🔗 Agent-Protocol)
* Architecture Conflict: High (Heavy external dependency footprint detected)
* Internal Logic: External Payload Reference only

## 威胁与兼容性评估 (Threat & Compatibility Assessment)
* Direct Code Integration: Strictly Prohibited (Violates pure standard library constraint)
* Hallucination Risk: Moderate (Requires structural parsing)

## 行动指令 (Action Directives)
1 Reject all dependency injections from this repository
2 Extract core theoretical concepts for zero-entropy refactoring
3 Ensure any extracted logic uses pure Python `typing` and `inspectsignature`

## 原始载荷 (Raw Payload)

```text
# Release v560


## New Model additions

### OpenAI Privacy Filter

OpenAI Privacy Filter is a bidirectional token-classification model for personally identifiable information (PII) detection and masking in text It is intended for high-throughput data sanitization workflows where teams need a model that they can run on-premises that is fast, context-aware, and tunable The model labels an input sequence in a single forward pass, then decodes coherent spans with a constrained Viterbi procedure, predicting probability distributions over 8 privacy-related output categories for each input token

**Links:** [Documentation](https://huggingfaceco/docs/transformers/main/en/model_doc/openai_privacy_filter)
* [`Privacy Filter`] Add model (#45580) by @vasqu in [#45580](https://githubcom/huggingface/transformers/pull/45580)

### QianfanOCR

Qianfan-OCR is a 4B-parameter end-to-end document intelligence model developed by Baidu that performs direct image-to-text conversion without traditional multi-stage OCR pipelines It supports a broad range of prompt-driven tasks including structured document parsing, table extraction, chart understanding, document question answering, and key information extraction all within one unified model The model features a unique "Layout-as-Thought" capability that generates structured layout representations before producing final outputs, making it particularly effective for complex documents with mixed element types

**Links:** [Documentation](https://huggingfaceco/docs/transformers/main/en/model_doc/qianfan_ocr) | [Paper](https://huggingfaceco/papers/260313398)
* add Qianfan-OCR model definition (#45280) by @marvinzh in [#45280](https://githubcom/huggingface/transformers/pull/45280)

### SAM3-LiteText

SAM3-LiteText is a lightweight variant of SAM3 that replaces the heavy SAM3 text encoder (353M parameters) with a compact MobileCLIP-based text encoder optimized through knowledge distillation, while keeping the SAM3 ViT-H image encoder intact This reduces text encoder parameters by up to 88% while maintaining segmentation performance comparable to the original model The model enables efficient vision-language segmentation by addressing the redundancy found in text prompting for segmentation tasks

**Links:** [Documentation](https://huggingfaceco/docs/transformers/main/en/model_doc/sam3_lite_text) | [Paper](https://huggingfaceco/papers/260212173)
* Add SAM3-LiteText (#44320) by @NielsRogge in [#44320](https://githubcom/huggingface/transformers/pull/44320)

### SLANet

SLANet and SLANet_plus are lightweight models designed for table structure recognition, focusing on accurately recognizing table structures in documents and natural scenes The model improves accuracy and inference speed by adopting a CPU-friendly lightweight backbone network PP-LCNet, a high-low-level feature fusion module CSP-PAN, and a feature decoding module SLA Head that aligns structural and positional information SLANet was developed by Baidu PaddlePaddle Vision Team as part of their table structure recognition solutions

**Links:** [Documentation](https://huggingfaceco/docs/transformers/main/en/model_doc/slanet)
* [Model] Add SLANet Model Support (#45532) by @zhang-prog in [#45532](https://githubcom/huggingface/transformers/pull/45532)


## Breaking changes

The internal `rotary_fn` is no longer registered as a hidden kernel function, so any code referencing `selfrotary_fn()` within an Attention module will break and must be updated to call the function directly instead
* :rotating_light: [`Kernels`] Fix kernel function registration (#45420) by @vasqu



## Serve

The `transformers serve` command received several enhancements, including a new `/v1/completions` endpoint for legacy text completion, multimodal support for audio and video inputs, improved tool-calling via `parse_response`, proper forwarding of `tool_calls`/`tool_call_id` fields, a 400 error on model mismatch when the server is pinned to a specific model, and fixes for the response API Documentation was also updated to cover new serving options such as `--compile` and `--model-timeout`


* Add /v1/completions endpoint (OpenAI legacy completions API) to `transformers serve` (#44558) by @rain-1 in [#44558]
* Updated the image cache for Paddle models according to the latest API (#45562) by @zhang-prog in [#45562]
* Raise 400 on model mismatch when `transformers serve` is pinned (#45443) by @qgallouedec in [#45443]
* [serve] Update tool call to switch to `parse_response` (#45485) by @SunMarc in [#45485]
* Fix response api support  (#45463) by @SunMarc in [#45463]
* [serve] Forward `tool_calls`/`tool_call_id` in processor inputs (#45418) by @qgallouedec in [#45418]
* refactor(qa): extend extras so ty can run on server modules (#45456) by @tarekziade in [#45456]
* Multimodal serve support  (#45220) by @SunMarc in [#45220]
* [docs] transformers serve (#45174) by @stevhliu in [#45174]


## Vision

Several vision-related bug fixes were applied in this release, including correcting Qwen25-VL temporal RoPE scaling for still images, fixing missing/mismatched image processor backends for Emu3 and BLIP, resolving modular image processor class duplication, and preventing accelerate from incorrectly splitting vision encoders in PeVideo/PeAudioVideo models Image loading performance was also improved by leveraging torchvision's native `decode_image` in the torchvision backend, yielding up to ~17% speedup over PIL-based loading


* Revert "Fix: modular image processors (#45492)" (#45531) by @tarekziade in [#45531]
* Fix: modular image processors (#45492) by @zucchini-nlp in [#45492]
* fix: prevent accelerate from splitting vision encoder by setting _no_… (#43047) by @<NOT FOUND> in [#43047]
* Fix Qwen25-VL temporal RoPE scaling applied to still images (#45330) by @Kash6 in [#45330]
*  Use torchvision `decode_image` to load images in the torchvision backend (#45195) by @yonigozlan in [#45195]
* Fix missing image processors backends (#45165) by @zucchini-nlp in [#45165]


## Parallelization

Fixed several bugs affecting distributed training, including silently wrong results or NaN loss with Expert Parallelism, NaN weights on non-rank-0 FSDP processes, and a resize failure in PP-DocLayoutV3; additionally added support for loading adapters with Tensor Parallelism, added MoE to the Gemma4 TP plan, and published documentation for TP training


* Fix EP: RouterParallel shape, tp_plan property, grouped_mm sentinels (#45473) by @AmineDiro in [#45473]
* Fix NaN weights on non-rank-0 FSDP processes (#45050) by @albertvillanova in [#45050]
* Load adapter with TP (#45155) by @michaelbenayoun in [#45155]
* [docs] tp training (#44613) by @stevhliu in [#44613]
* Fix resize failure caused by zero-sized masks in PP-DocLayoutV3 (#45281) by @zhang-prog in [#45281]
* Add MoE to Gemma4 TP plan (#45219) by @sywangyi in [#45219]


## Tokenization

Fixed a docstring typo in streamer classes, resolved a Kimi-K25 tokenizer regression and `_patch_mistral_regex` AttributeError, and patched a streaming generation crash for `Qwen3VLProcessor` caused by incorrect `_tokenizer` attribute access Additional housekeeping included moving the GPT-SW3 instruct tokenizer to an internal testing repo and fixing a global state leak in the tokenizer registry during tests


* [Doc] Fix 'tokenized' -> 'tokenizer' typo in streamer docstrings (#45508) by @avasis-ai in [#45508]
* Fix Kimi-K25 tokenizer regression and _patch_mistral_regex AttributeError (#45359) by @ArthurZucker in [#45359]
* fix(serving): resolve rust tokenizer from ProcessorMixin in streaming generation (#45368) by @sharziki in [#45368]
* [`Tokenizers`] Move gpt sw3 tokenizer out (#45404) by @vasqu in [#45404]
* fix: leak in tokenizer registry for `test_processors` (#45318) by @tarekziade in [#45318]


## Cache

Cache handling was improved for Gemma4 and Gemma3n models by dissociating KV state sharing from the Cache class, ensuring KV states are always shared regardless of whether a Cache is used Additionally, the image cache for Paddle models was updated to align with the latest API


* Align gemma3n cache sharing to gemma4 (#45489) by @Cyrilvallez in [#45489]
* remove cache file from tree (#45392) by @tarekziade in [#45392]
* [gemma4] Dissociate kv states sharing from the Cache (#45312) by @Cyrilvallez in [#45312]


## Audio

Audio models gained vLLM compatibility through targeted fixes across several model implementations, while reliability improvements were also made including exponential back-off retries for audio file downloads, a crash fix in the `text-to-speech` pipeline when generation configs contain `None` values, and corrected test failures for Kyutai Speech-To-Text


* feat[vLLM × v5]: Add vLLM compatibility for audio models (#45326) by @harshaljanjani in [#45326]
* http retries on audio file downloads (#45126) by @tarekziade in [#45126]
* fix(testing): Fix Kyutai Speech-To-Text and LongCatFlash test failures on main CI (#44695) by @harshaljanjani in [#44695]
* Fix `text-to-speech` pipeline crash when generation config contains `None` values (#45107) by @jiqing-feng in [#45107]


## Bugfixes and improvements

* [`Privacy Filter`] Add model (#45580) by @vasqu in [#45580]
* Add ForSequenceClassification heads for the OLMo family (#45551) by @earino in [#45551]
* Add IndexCache support for GLM5 DSA (#45424) by @louzongzhi in [#45424]
* Fix redundant logic in video processing SmolVLM (#45272) by @yonigozlan in [#45272]
* Fix typos (#45574) by @vasqu in [#45574]
* [Model] Add SLANet Model Support (#45532) by @zhang-prog in [#45532]
* refactor(Dots1): drop Dots1MoE override to `pass` (inherits from DSV3 MoE) (#45572) by @casinca in [#45572]
* perf: avoid recomputing rotary_emb for each layer in some Google and ModernBERT models (#45555) by @casinca in [#45555]
* Gemma4 training with text-only samples (#45454) by @zucchini-nlp in [#45454]
* [nemotron_h] Add support for MLP mixers (#44763) by @xenova in [#44763]
* add expert parallelism for gemma-4-26B-A4B-it (#45279) by @sywangyi in [#45279]
* Add full GGUF loading support for GPT‑OSS (fixes #43366, supersedes #43757) latest (#45506) by @sirzechs66 in [#45506]
* Update Gemma4 weight conversion script (#45328) by @RyanMullins in [#45328]
* Move some conversion mappings to PrefixChange (#45567) by @Cyrilvallez in [#45567]
* fix table update versions (#45544) by @tarekziade in [#45544]
* Add disable_mmap kwarg to from_pretrained with hf-mount auto-detection (#45547) by @rtrompier in [#45547]
* fix(DSV3): parity between native `DeepseekV3MoE` and remote official implementation (#45441) by @casinca in [#45441]
* [modular] Fix modular logic broken in #45045 (#45539) by @Cyrilvallez in [#45539]
* Fix: propagate quantization_config to text sub-config for composite models in AutoModelForCausalLM (#45494) by @lvliang-intel in [#45494]
* T5Gemma2: fix `prepare_decoder_input_ids_from_labels` (#45516) by @Tokarak in [#45516]
* [Trainer] Add ddp_static_graph option (#45519) by @KeitaW in [#45519]
* Add dtype config options for Four Over Six (#45367) by @jackcook in [#45367]
* [Sam3LiteText] Remove unnecessary modules/configs (#45535) by @yonigozlan in [#45535]
* Fix conditional check for float formatting (#44425) by @qgallouedec in [#44425]
* Fix AMD CI: rebuild torchvision with libjpeg + refresh expectations (#45533) by @Abdennacer-Badaoui in [#45533]
* Reapply modular to examples (#45527) by @Cyrilvallez in [#45527]
* qa: re-run modular converter when the script itself is modified (#45528) by @tarekziade in [#45528]
* [GGUF] Reduce peak RAM usage by casting dequantized tensors early during load (#45386) by @UsamaKenway in [#45386]
* Fix CSM `TextToAudioPipeline` missing `<bos>` token (#45525) by @jiqing-feng in [#45525]
* [`Conversion Mapping`] Small fixups (#45483) by @vasqu in [#45483]
* fix: return empty tuple from import_protobuf_decode_error when protobuf is unavailable (#45486) by @jw9603 in [#45486]
* throw error when conversion required (#45078) by @itazap in [#45078]
* chore: bump doc-builder SHA for PR upload workflow (#45450) by @rtrompier in [#45450]
* xpu output align with cuda in test case (#45526) by @sywangyi in [#45526]
* chore(qa): split out mlinter (#45475) by @tarekziade in [#45475]
* [loading] Clean way to add/remove full parts in checkpoint names (#45448) by @Cyrilvallez in [#45448]
* Fix Zamba2MambaMixer ignoring use_mamba_kernels=False (#44853) by @sergiopaniego in [#44853]
* revert sha commit pointing to main for transformers_amd_ci_  workflows (#45495) by @paulinebm in [#45495]
* Fix ZeRO-3 from_pretrained: load registered buffers in _load_state_dict_into_zero3_model (#45402) by @saslifat-gif in [#45402]
* Remove redundant condition checks in `get_image_size` method (#45461) by @JiauZhang in [#45461]
* Add check-auto in repo-consistency and fix sorting (#45481) by @zucchini-nlp in [#45481]
* Fix typos in src/transformers/utils/output_capturingpy (#45269) by @ryota-komatsu in [#45269]
* typing: rule 15 - checks for tie_word_embeddings presence (#44988) by @tarekziade in [#44988]
* [CB] Fix capture of max_seqlen (#45323) by @remi-or in [#45323]
* Minor update (#45484) by @ydshieh in [#45484]
* Add Neuron to auto-compile hardware list (#44757) by @dacorvo in [#44757]
* Allow loading Qwen Thinker 'base' models without generative head (#45457) by @tomaarsen in [#45457]
* [`fix`] Always early return for non-Mistral models in _patch_mistral_regex (#45444) by @tomaarsen in [#45444]
* Fix spurious position_ids warnings for at least 40 architectures (#45437) by @tomaarsen in [#45437]
* [`fix`] Make Qwen2_5OmniProcessor warning a lot less noisy via warning_once (#45455) by @tomaarsen in [#45455]
* Dynamic auto mapping (#45018) by @zucchini-nlp in [#45018]
* [docs] vlm addition (#45271) by @stevhliu in [#45271]
* fix: dont download artifacts from the test hub (#45319) by @tarekziade in [#45319]
* fix(clipseg): fix 2 failing tests (#45403) by @kaixuanliu in [#45403]
* [docs] @auto_docstring decorator (#45130) by @stevhliu in [#45130]
* Fix Sam3Processor missing input_boxes_labels for padded None entries (#45171) by @Kash6 in [#45171]
* better grad acc tests (#45434) by @SunMarc in [#45434]
* Add example for iterative chatting with MLLMs (#45398) by @zucchini-nlp in [#45398]
* Gemma4 resizing per layer inputs (#45324) by @zucchini-nlp in [#45324]
* Add `step3_vl` to `MODELS_WITH_INCORRECT_HUB_TOKENIZER_CLASS` (#45449) by @hmellor in [#45449]
* Update workflow references to new commit hash (#45442) by @paulinebm in [#45442]
* [Gemma4] Add docstrings for Per-Layer Embeddings (PLE) pipeline (#45207) by @w4nderlust in [#45207]
* [Doc] Correct checkpoint path in Dinov2 model_docs  (#45430) by @ambroiseodt in [#45430]
* Fix ty for transformers cli (#45190) by @SunMarc in [#45190]
* fix(models): Resolve regressions in Wav2Vec2PhonemeCTCTokenizer (wav2vec2-lv-60-espeak-cv-ft) (#45199) by @harshaljanjani in [#45199]
* Fix Qwen25VL temporal grid positions (#45400) by @zucchini-nlp in [#45400]
* [`fix`] PEFT integration fixes preventing save/load & integration (#45428) by @tomaarsen in [#45428]
* Fix the response schema for the gemma4 converter (#45411) by @Rocketknight1 in [#45411]
* [Doc]  MoE routing capture and replay recipe  (#44925) by @kashif in [#44925]
* Fix `apply_chat_template` crash on `tool_call` messages without content (#45348) by @qgallouedec in [#45348]
* [AMD CI] Fix torchcompile/export failures on AMD CI due to untraceable set__contains__  (#45282) by @Abdennacer-Badaoui in [#45282]
* [inference_fusion] convert conv3d patch embed to linear (#45041) by @JJJYmmm in [#45041]
* Fix #45305 + add regression test GAS (#45349) by @florian6973 in [#45349]
* Update `trackio` integration to use Buckets and "freeze" Space after training (#45329) by @abidlabs in [#45329]
* fix(qwen3_moe): correct return type annotation on Qwen3MoeSparseMoeBlockforward (#45352) by @RudrenduPaul in [#45352]
* Fix: NotebookProgressCallback crash when evaluating with the Trainer (#44949) by @Charly21r in [#44949]
* docs: fix 5 docstring errors in Gemma3nTextConfig (typos, grammar, formatting) (#45370) by @RudrenduPaul in [#45370]
* Less unnecessary RoPE warnings (#45289) by @zucchini-nlp in [#45289]
* Fix unintended Hub metadata calls from _patch_mistral_regex (#43603) by @vaibhav-research in [#43603]
* Fix MoE routers returning probabilities instead of logits (#45131) by @yacinemebarki in [#45131]
* [docs] training on specific hardware (#44799) by @stevhliu in [#44799]
* [docs] zero + sequence parallelism (#44605) by @stevhliu in [#44605]
* Fix vlm weight mappings (#45358) by @Cyrilvallez in [#45358]
* Copy the template resolution logic from the base apply_chat_template to Voxtral (#45117) by @Rocketknight1 in [#45117]
* add kwargs to all methods in the CallbackHandler class (#45353) by @wilnn in [#45353]
* Close file handler (#45187) by @ydshieh in [#45187]
* fix: restore mypy type checking for PreTrainedConfig subclasses (#45071) (#45240) by @shhKnight30 in [#45240]
* `cohere_asr`: fix device issue for `test_model_parallel_beam_search` (#45214) by @kaixuanliu in [#45214]
* Fix AttributeError in Gemma3ForConditionalGeneration and Gemma3ForSequenceClassification when configreturn_dict=False (#45277) by @kamalrajkannan78 in [#45277]
* fix bug for videomt model device mismatch (#45204) by @kaixuanliu in [#45204]
* fix gemma4 gradient accumulation loss and last token incorrect labels (#45354) by @winglian in [#45354]
* Logger has `[transformers]` prefix in non-verbose mode (#45316) by @zucchini-nlp in [#45316]
* Fix AttributeError in AssistantToTargetTranslatorunmap_input_ids with cross-vocab models (#45320) by @Regata3010 in [#45320]
* musicflamingo: add test support for Intel XPU device (#45212) by @kaixuanliu in [#45212]
* nomic_bert: make the test suitable for general device (#45209) by @kaixuanliu in [#45209]
* Skip invalid flash-attn tests for `pi0` model (#45011) by @kaixuanliu in [#45011]
* Add cuda compatibility check for using `grouped_mm` (#45001) by @Sai-Suraj-27 in [#45001]
* [docs] optimizers, hyperparam search, training features (#44290) by @stevhliu in [#44290]
* Remove unused parameters and improve add_tensor_parallel_hooks_t… (#44768) by @michaelbenayoun in [#44768]
* [gemma4] Fix device map auto (#45347) by @Cyrilvallez in [#45347]
* Refactor CLIP-like models (#44431) by @zucchini-nlp in [#44431]
* refactor: display test duration (#45344) by @tarekziade in [#45344]
* Fix `Wav2Vec2Configvocab_size` type to allow `None` (#45108) by @jiqing-feng in [#45108]
* Add THD support in ESM (#44145) by @balvisio in [#44145]
* [gemma4] Remove all shared weights, and silently skip them during loading (#45336) by @Cyrilvallez in [#45336]
* Fix conversion mappings for vlms (#45340) by @Cyrilvallez in [#45340]
* chore: added circleci python script to ruff and ty checkers (#45339) by @tarekziade in [#45339]
* tweak checkers output on errors (#45163) by @tarekziade in [#45163]
* chore: remove test_hub for now (#45337) by @tarekziade in [#45337]
* [docs] pipeline cleanup (#44954) by @stevhliu in [#44954]
* Fix export for gemma4 and add Integration tests (#45285) by @Cyrilvallez in [#45285]
* Fix vllm cis (#45139) by @ArthurZucker in [#45139]
* [docs] static model rules (#45232) by @stevhliu in [#45232]
* fix(security): prevent untrusted users from triggering TRL CI dispatch (#45302) by @jagwar in [#45302]
* [AMD CI] Fix Qwen2 expectations (#45284) by @Abdennacer-Badaoui in [#45284]
* Add `hasattr(torchbackendscudnn, "conv")` to `conftestpy` (#45263) by @ydshieh in [#45263]
* Fix `SmolVLM` video processor `resize` using wrong interpolation after backend refactor (#45258) by @ydshieh in [#45258]
* Fix `Qwen2IntegrationTest` (#45268) by @ydshieh in [#45268]
* doc: fix TokenizersBackendconvert_to_native_format docstring (#45262) by @lowzhao in [#45262]
* empty (#45261) by @ydshieh in [#45261]
* Fix unexpected TF32 being enabled in testing (#45252) by @ydshieh in [#45252]
* Fix tf32 issue: set `torchbackendscudnnconvfp32_precision` explicitly (#45248) by @ydshieh in [#45248]
* Nvidia CI with `torch 211` (#45243) by @ydshieh in [#45243]
* Update tiny model creation script (#45241) by @ydshieh in [#45241]
* Update `get_test_infopy` (related to tiny model creation) (#45238) by @ydshieh in [#45238]
* More fix for tiny model creation (#45228) by @ydshieh in [#45228]
* remove unnecessary entries in some auto model mappings (#45224) by @ydshieh in [#45224]
* fix: hf-doc-builder insallation was failing (#45225) by @tarekziade in [#45225]
* [CB] Add per-request logits processors (#45026) by @remi-or in [#45026]
* [docs] formatting (#45196) by @stevhliu in [#45196]
* fix `test_register_result_handler` (#45188) by @SunMarc in [#45188]
* [CB] Tweaks to update and minor fixes (#45179) by @remi-or in [#45179]
* Fix pypi release (#45210) by @ArthurZucker in [#45210]
* fix(docs): correct gemma4 docs and examples (#45197) by @douglas-reid in [#45197]
* Add Turkish (tr) translation for Get Started section (#45158) by @onwp in [#45158]
*
 
## Significant community contributions

The following contributors have made significant changes to the library over the last release:

* @vasqu
    * [`Privacy Filter`] Add model (#45580)
    * Fix typos (#45574)
    * [`Conversion Mapping`] Small fixups (#45483)
    * :rotating_light: [`Kernels`] Fix kernel function registration (#45420)
    * [`Tokenizers`] Move gpt sw3 tokenizer out (#45404)
* @rain-1
    * Add /v1/completions endpoint (OpenAI legacy completions API) to `transformers serve` (#44558)
* @zhang-prog
    * Updated the image cache for Paddle models according to the latest API (#45562)
    * [Model] Add SLANet Model Support (#45532)
    * Fix resize failure caused by zero-sized masks in PP-DocLayoutV3 (#45281)
* @tarekziade
    * fix table update versions (#45544)
    * qa: re-run modular converter when the script itself is modified (#45528)
    * Revert "Fix: modular image processors (#45492)" (#45531)
    * chore(qa): split out mlinter (#45475)
    * typing: rule 15 - checks for tie_word_embeddings presence (#44988)
    * fix: dont download artifacts from the test hub (#45319)
    * refactor(qa): extend extras so ty can run on server modules (#45456)
    * remove cache file from tree (#45392)
    * refactor: display test duration (#45344)
    * http retries on audio file downloads (#45126)
    * chore: added circleci python script to ruff and ty checkers (#45339)
    * tweak checkers output on errors (#45163)
    * fix: leak in tokenizer registry for `test_processors` (#45318)
    * chore: remove test_hub for now (#45337)
    * fix: hf-doc-builder insallation was failing (#45225)
* @marvinzh
    * add Qianfan-OCR model definition (#45280)
* @remi-or
    * [CB] Fix capture of max_seqlen (#45323)
    * [CB] Add per-request logits processors (#45026)
    * [CB] Tweaks to update and minor fixes (#45179)
* @ydshieh
    * Minor update (#45484)
    * Close file handler (#45187)
    * Add `hasattr(torchbackendscudnn, "conv")` to `conftestpy` (#45263)
    * Fix `SmolVLM` video processor `resize` using wrong interpolation after backend refactor (#45258)
    * Fix `Qwen2IntegrationTest` (#45268)
    * empty (#45261)
    * Fix unexpected TF32 being enabled in testing (#45252)
    * Fix tf32 issue: set `torchbackendscudnnconvfp32_precision` explicitly (#45248)
    * Nvidia CI with `torch 211` (#45243)
    * Update tiny model creation script (#45241)
    * Update `get_test_infopy` (related to tiny model creation) (#45238)
    * More fix for tiny model creation (#45228)
    * remove unnecessary entries in some auto model mappings (#45224)
* @NielsRogge
    * Add SAM3-LiteText (#44320)
* @ArthurZucker
    * Fix IndexError with DeepSpeed ZeRO-3 when kernels rotary is active (#45414)
    * Fix Kimi-K25 tokenizer regression and _patch_mistral_regex AttributeError (#45359)
    * Fix vllm cis (#45139)
    * Fix pypi release (#45210)
    * update to dev version 560-dev0
* @JJJYmmm
    * [inference_fusion] convert conv3d patch embed to linear (#45041)
* @balvisio
    * Add THD support in ESM (#44145)
* @onwp
    * Add Turkish (tr) translation for Get Started section (#45158)

```
