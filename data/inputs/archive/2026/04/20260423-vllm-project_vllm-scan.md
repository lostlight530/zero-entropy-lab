# 📡 NEXUS HARVESTER: Intelligence Dossier

Date: 2026-04-23 22:32:59 (UTC)
Target Identity: vllm-project/vllm
Version Asset: v0.20.0
Source Link: https://github.com/vllm-project/vllm/releases/tag/v0.20.0

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
1. Reject all dependency injections from this repository
2. Extract core theoretical concepts for zero-entropy refactoring
3. Ensure any extracted logic uses pure Python `typing` and `inspect.signature`

## 原始载荷 (Raw Payload)

```text
# vLLM v0.20.0

## Highlights
This release features 546 commits from 257 contributors (83 new)!

* **CUDA 13.0 default**: Default CUDA wheel switched to CUDA 13.0; architecture lists and build-args cleaned up (#39878). As a general rule of thumb, our CUDA version policy follows PyTorch's.
* **PyTorch 2.11 upgrade** (#34644): vLLM ships on torch 2.11 for CUDA; XPU temporarily remains on torch-xpu 2.10 (#39656). This is a breaking change for environment dependency.
* **Transformers v5**: vLLM now runs on HuggingFace `transformers>=5` (landed in v0.19.1); v0.20.0 carries continued v4/v5 compat fixes including PaddleOCR-VL image processor `max_pixels` (#38629) and Mistral YaRN warning (#37292).
* **FlashAttention 4 as default MLA prefill**: FA4 re-enabled as the default MLA prefill backend (#38819) with head-dim 512 and paged-KV support on SM90+ (#38835), plus an upstream FA4 sync (#38690).
* **TurboQuant 2-bit KV cache**: New attention backend delivering 2-bit KV cache compression with 4× capacity (#38479).
* **Online quantization frontend**: New end-to-end online quantization frontend (#38138), with docs (#39736); experts_int8 consolidated into the FP8 online path (#38463).
* **vLLM IR**: Initial IR skeleton with rms_norm op (#33825), OOT-platform kernel imports (#38807), and gemma_rms_norm reworked on IR (#39014) — foundation for future kernel work.
* **Model Runner V2 advances**: Eagle prefill full-CUDA-graph (#37588), auto-resolve cudagraph mode/sizes from attention backend (#32936), fused probabilistic rejection sample kernels (#38496), config validation for unsupported features (#38758), and piecewise-fallback disabled for eagle draft decodes (#39773).
* **MoE refactor series**: Unquantized migrated to Full Oracle Flow (#36286), SharedExperts class (#35153), DefaultMoERunner split (#35326), ZeroExpertFusedMoE in new framework (#35549), compressed_tensors_moe.py split up (#38960), and MoE DP chunking removed (#39107).

### Model Support
* New architectures: EXAONE-4.5 (#39388), BharatGen Param2MoE (#38000), Phi-4-reasoning-vision-15B (#38306), Cheers multimodal (#38788), telechat3 (#38510), FireRedLID (#39290), jina-reranker-v3 (#38800), Jina Embeddings v5 (#39575), Nemotron-v3 VL Nano/Super (#39747).
* Quantization formats: GGUF support for MiniMax-M2.1 (#36965), non-standard GGUF quant types with prefix such as UD-IQ1_S (#39471).
* Speculative decoding: Eagle3 for MiniMax-M2 (#37512).
* LoRA: Qwen3ASRForConditionalGeneration (#37247), Gemma4ForConditionalGeneration (#39291), dual-CUDA-streams linear layer (#35721).
* Multimodal MRoPE refresh: mm_features-based MRoPE for Ernie-4.5 VL (#39753), Keye-VL / Keye-1.5-VL (#39869), PaddleOCR-VL (#39888).
* Parakeet UX / perf enhancements (#39423); ColModernVBERT updated for latest HF checkpoint (#39307); NemotronH default `mamba_ssm_cache_dtype=float32` with NemotronHNanoVLV2 auto-hook (#39032).

### Engine Core
* **Model Runner V2**: Full CUDA graph for eagle prefill (#37588), auto cudagraph mode/sizes based on attention backend (#32936), fused probabilistic rejection-sample kernels (#38496), config validation (#38758), eagle-draft piecewise fallback disabled (#39773).
* **vLLM IR**: IR skeleton + rms_norm (#33825), OOT kernel import hooks (#38807), gemma_rms_norm on IR (#39014).
* **torch.compile**: Opaque Objects on torch 2.11 (#39286), AOT compile with batch-invariance mode (#39201), Inductor cache nested under AOT dir (#39718), split FX graph via codegen (#38657), Inductor pre-grad passes re-enabled for torch≥2.12 (#38944), strings in custom ops without compile regressions (#38123).
* **Attention**: FA4 as default MLA prefill (#38819), head-dim 512 + paged-KV on sm90+FA4 (#38835), FA4 upstream sync (#38690), full CUDA graph for FlexAttention (#36298).
* **Helion kernels**: torch.compile support for Helion kernels (#38592).
* **HMA / KV offload**: GPU-side KV events for HMA (#37688), group block hashes/IDs tracked (#37109), unified memory layout for offloading workers (#37206), `shutdown()` on OffloadingConnector (#39182), request context passed through KV offload (#39185).
* **Features**: NUMA binding for GPU workers (#38635), opt-in `VLLM_MEDIA_CACHE` media URL caching (#37123), safe request abort when FSM fails to advance (#38663), KV connector prioritized over internal registry (#38301).
* **Pluggable layers**: Applied to llm_head / vocab embedding (#33465) and MoE layers (#33556).
* **Mamba**: Stochastic rounding (#35753), different Conv state layouts (#37416), FlashInfer `selective_state_update` (#36162).
* **Metrics & scheduling**: Labeled waiting-breakdown (capacity/deferred) metric (#38435), API server handshake simplified (#39364), mm-scheduler `get_num_embed` overhead reduced (#40143), `request_id` on `FinishedRequestStats` (#39710).
* **Executor**: RayExecutorV2 introduced (#36836); unified engine process monitoring with Ray backend (#35862).

### Hardware & Performance
* **NVIDIA**: swapAB support for SM120 CUTLASS blockwise FP8 GEMM (#38325), MXFP4 W4A4 CUTLASS MoE for SM100 (#37463), TRTLLM GEN NVFP4 MoE with non-512-aligned hidden dims via weight padding (#39510), TRTLLM FP8 MoE with shuffled weights + BlockMajorK layout (#38993), fused qknorm+rope kernel on SM9.0 (#37376), tuned fused_moe config for RTX PRO 6000 Blackwell (#39183), ViT full CUDA graph for Qwen3-VL video (#38061), fused FP8 output quantization into `merge_attn_states` (#36518), batched KV-cache swap via `cuMemcpyBatchAsync` (#38460).
* **AMD ROCm**: ZenCPU / AMD Zen CPU backend via zentorch (#39967), RDNA 3.5/4 device IDs (gfx1150/1151/1201) (#38455), MORI EP for unquantized MoE with AITER (#37529), AITER gemm w8a8 ptpc integration (#33773), TritonW4A16LinearKernel (#37352), asymmetric INT8 in `TritonInt8ScaledMMLinearKernel` (#38501), `fused_silu_mul_block_quant` enabled (#38817), KV-cache shuffle for `paged_attention_common` (#32914), MLA decode output zero-fill removed in AITER (#37539).
* **Intel XPU**: Initial GDN attention for Qwen3-Next / Qwen3.5 (#33657), XPU MXFP8 quant op (#38682), XPU MXFP4 quant op (#39857), per-channel FP8 linear (#38316), FP8 KV cache on XPU (#37731), `round_int8` for Intel Triton (#38825).
* **CPU**: CPU draft-model speculative decoding (#32662), CPU int8 compute mode in AWQ (#35697), head_size 512 in `cpu_attn` (#38676), gelu in `cpu_fused_moe` (#38770), OMP replacement (#36487), BF16 GELU LUT on ARM (#37469), W4A16 Autoround on CPU (#38192), CPU affinity/memory mgmt refactor (#39781), IBM Z s390x torch 2.11 builds (#39910).
* **DeepSeek / MLA / Indexer**: Persistent TopK scheduler for DSV3.2 DSA decode (#37421), DSV3.2 indexer fused weights projection (#38684), Triton MLA perf fixes (#33529), indexer WK upcast to BF16 for fusion (#38928), MLA indexer uniform-decode optimization for MTP>1 (#39458).
* **GDN / Mamba**: Kernel fusion in GDN (#37813), TMA aligned with upstream FLA (#38981), GPU↔CPU syncs eliminated in prefill and spec-decode paths (#38361, #38047).
* **Other**: DeepGEMM integrated into the vLLM wheel via CMake (#37980), Lustre FS checkpoint prefetching enabled by default (#39422), Gemma4 fused routing Triton kernel (#39083), Gemma4 embed_input_ids GPU/CPU sync removed (#39234), Nemotron VL image/video preprocessing optimized (#40283), SiLU block-quant fusion v1 (#32996), bilinear_pos_embed Triton kernel for ViT (#37948), mean-pooling optimization (~5.9% throughput) (#38559), redundant-sync removal for pooling (~3.7% throughput) (#39113), H2D pageable-memory copy reduction (#38794), fused zero initializer for FP8 DeepGemm block-quant (#39547).

### Large Scale Serving
* **EPLB**: Alternative communication for EPLB weight exchange (#33176), mapping optimization with router record for prefill (#36261).
* **KV Offload / Connector**: 3FS KVConnector (#37636), unified memory layout for offloading workers (#37206), cache_salt propagated through MP connector for per-user isolation (#39837), multi-connector metrics of same type (#40010), LMCache block-allocation event (#38856), LMCache MP save optimization with MLA (#38810).
* **Disaggregated / NIXL / Mamba**: Heterogeneous TP 3-read conv-state transfer for NIXL + Mamba (#37635), Nixl bumped to 0.10.1 (#39922).

### Quantization
* **New formats & methods**: TurboQuant 2-bit KV cache compression (#38479), per-token-head INT8/FP8 KV cache quantization (#38378), fused FP8/NVFP4 output quantization in MLA attention (#35792), NVFP4 dense models on MI300/MI355X and Hopper via emulation (#35733).
* **Kernels**: MXFP8 in Marlin GEMM/MoE with Mxfp8LinearOp refactor (#34664), MXFP4 W4A4 CUTLASS MoE for SM100 (#37463), NVFP4 in `reshape_and_cache_flash` (#37332), batch-invariant NVFP4 linear (#39322), FlashInfer CuteDSL batched-experts backend for NVFP4 MoE (#38251), special `GptOssMxfp4MoeMethod` (#39604).
* **Compressed tensors**: W8A8 MXFP8 linear/MoE (`CompressedTensorsW8A8Mxfp8`) (#38815), layerwise reloading of attention/KV quantized models (#38995), experts_int8 consolidated with FP8 online quant (#38463).
* **XPU / CPU / AMD**: XPU MXFP4 (#39857), XPU MXFP8 GEMM + compressed-tensor schema (#38707), XPU FP8 per-channel linear (#38316), FP8 KV cache on XPU (#37731), CPU W4A16 Autoround (#38192), XPU W4A16 Autoround (#37986), asymmetric INT8 `TritonInt8ScaledMMLinearKernel` on ROCm (#38501), Quark W8A8 INT8 MoE inference (#36320).
* **Deprecations**: Petit NVFP4 removed (#32694).

### API & Frontend
* **OpenAI API**: `presence_penalty` / `frequency_penalty` on Responses API (#38613), Responses API streaming migrated to unified parser (#38755), Mistral Grammar factory (#38150), multimodal support on `/inference/v1/generate` (#38405), `max_tokens_per_doc` in rerank (#38827), Generative Scoring (#34539), MaxSim re-enabled on GPU (#38620), auto-detection of `reasoning_config` when only `reasoning_parser` is set (#38214), reasoning parsers can access model config via `adjust_request` (#37848).
* **Pooling ecosystem**: Pooling entrypoints overhauled across scoring (#28631), pooling (#39153), and cleanup (#39675); preprocessing/postprocessing offloaded to thread pool (#39763); async scheduling disabled by default for pooling (#39592); `logit_scale` added to PoolerConfig (#39435), then renamed `logit_bias`/`logit_scale` → `logit_mean`/`logit_sigma` for affine score calibration (#39530) — breaking.
* **gRPC / streaming**: Streaming on token-generation endpoint (#37171); gRPC periodic stats logging + servicer log forwarding (#38333).
* **LLM / CLI**: Structured-output special tokens preserved in offline `LLM.chat` (#39352), `use_audio_in_video` passable at `vllm serve` for nemotron-nano-vl (#38538), deferred imports save ~2s CLI startup (#40056), improved MM-input-too-long error message (#39409), warning when FP8 KV cache misses prefill query quant (#39752), clearer DCP error message (#28443), `--model` deprecation warning updated (#39518), Mimo reasoning/tooling parsers mapped (#40089).

### Security
* SSRF fix in batch runner `download_bytes_from_url` (#38482).

### Dependencies
* **PyTorch 2.11** for CUDA (#34644); XPU torch-xpu reverted to 2.10 (#39656).
* **CUDA 13.0** default with updated architecture lists and cleaned build-args (#39878).
* **FlashAttention 4** upstream sync (#38690) and symlink-on-install behavior (#38814).
* **AITER** triton BUFFER_OPS fix + version updates (#38580), AITER reverted to v0.1.10.post3 (#39509); **Nixl** bumped to 0.10.1 (#39922); **DeepGEMM** integrated into the wheel via CMake (#37980); **fastsafetensors** added to NVIDIA Dockerfile (#38950); Helion bumped 0.3.2 → 0.3.3 (#38062).
* **Removed / moved**: `resampy` dependency dropped (#39524), `librosa` direct dependency dropped (#39079), `pyav` and `soundfile` moved to common requirements (#39997).

### Breaking Changes
1. **PyTorch 2.11 + CUDA 13.0 default** — environment dependency change.
2. **Metrics rework**: `vllm:prompt_tokens_recomputed` removed (#38709); `num_cached_tokens` / `num_external_computed_tokens` replaced with `PrefillStats` (#37460).
3. **Pooler config rename**: `logit_bias`/`logit_scale` → `logit_mean`/`logit_sigma` (#39530).
4. **Async scheduling default OFF for pooling models** (#39592).
5. **Petit NVFP4 quantization removed** (#32694); `cprofile` / `cprofile_context` deprecated (#39100); V0 `accept output buffer` deprecated (#39125).

### V0 Deprecation
* Petit NVFP4 (#32694), accept output buffer in attention (#39125), cprofile / cprofile_context (#39100).

## New Contributors
* @1096125073 made their first contribution in https://github.com/vllm-project/vllm/pull/38510
* @2imi9 made their first contribution in https://github.com/vllm-project/vllm/pull/38970
* @AAISSJ made their first contribution in https://github.com/vllm-project/vllm/pull/37831
* @abatilo made their first contribution in https://github.com/vllm-project/vllm/pull/38987
* @aditi-amd made their first contribution in https://github.com/vllm-project/vllm/pull/39953
* @aliialsaeedii made their first contribution in https://github.com/vllm-project/vllm/pull/38253
* @bhargav-patel-29 made their first contribution in https://github.com/vllm-project/vllm/pull/38000
* @bingshuailiu made their first contribution in https://github.com/vllm-project/vllm/pull/38788
* @Bortlesboat made their first contribution in https://github.com/vllm-project/vllm/pull/39123
* @Chinmay-Kulkarni-AMD made their first contribution in https://github.com/vllm-project/vllm/pull/39967
* @crawfordxx made their first contribution in https://github.com/vllm-project/vllm/pull/38722
* @daiyu1111 made their first contribution in https://github.com/vllm-project/vllm/pull/40011
* @dalistarh made their first contribution in https://github.com/vllm-project/vllm/pull/40194
* @daniebrill made their first contribution in https://github.com/vllm-project/vllm/pull/36934
* @dhonnappa-amd made their first contribution in https://github.com/vllm-project/vllm/pull/38238
* @dondetir made their first contribution in https://github.com/vllm-project/vllm/pull/38455
* @efortin made their first contribution in https://github.com/vllm-project/vllm/pull/39183
* @elenalil-aws made their first contribution in https://github.com/vllm-project/vllm/pull/38927
* @elwhyjay made their first contribution in https://github.com/vllm-project/vllm/pull/39526
* @EricccYang made their first contribution in https://github.com/vllm-project/vllm/pull/37376
* @evezhier made their first contribution in https://github.com/vllm-project/vllm/pull/36540
* @ezylopx5 made their first contribution in https://github.com/vllm-project/vllm/pull/37051
* @foreverlms made their first contribution in https://github.com/vllm-project/vllm/pull/31113
* @ganeshr10 made their first contribution in https://github.com/vllm-project/vllm/pull/32662
* @hhk7734 made their first contribution in https://github.com/vllm-project/vllm/pull/37171
* @hnt2601 made their first contribution in https://github.com/vllm-project/vllm/pull/39892
* @hospedales made their first contribution in https://github.com/vllm-project/vllm/pull/38847
* @ianliuy made their first contribution in https://github.com/vllm-project/vllm/pull/39473
* @ibifrost made their first contribution in https://github.com/vllm-project/vllm/pull/37636
* @ibrahim1023 made their first contribution in https://github.com/vllm-project/vllm/pull/39169
* @jackcfwang made their first contribution in https://github.com/vllm-project/vllm/pull/38794
* @jatseng-ai made their first contribution in https://github.com/vllm-project/vllm/pull/37352
* @JeanPaulShapo made their first contribution in https://github.com/vllm-project/vllm/pull/35736
* @jefp made their first contribution in https://github.com/vllm-project/vllm/pull/39435
* @jesus-talavera-ibm made their first contribution in https://github.com/vllm-project/vllm/pull/38714
* @jigangz made their first contribution in https://github.com/vllm-project/vllm/pull/39780
* @JoursBleu made their first contribution in https://github.com/vllm-project/vllm/pull/36965
* @khairulkabir1661 made their first contribution in https://github.com/vllm-project/vllm/pull/38388
* @kibitzing made their first contribution in https://github.com/vllm-project/vllm/pull/37501
* @KimuGenie made their first contribution in https://github.com/vllm-project/vllm/pull/39679
* @kkyyxhll made their first contribution in https://github.com/vllm-project/vllm/pull/38517
* @kot-begemot-uk made their first contribution in https://github.com/vllm-project/vllm/pull/36487
* @KyleMylonakisProtopia made their first contribution in https://github.com/vllm-project/vllm/pull/38699
* @lalit10 made their first contribution in https://github.com/vllm-project/vllm/pull/38955
* @liuchenbing2026 made their first contribution in https://github.com/vllm-project/vllm/pull/37512
* @MekayelAnik made their first contribution in https://github.com/vllm-project/vllm/pull/39085
* @menogrey made their first contribution in https://github.com/vllm-project/vllm/pull/37989
* @mieshkiwrk made their first contribution in https://github.com/vllm-project/vllm/pull/38825
* @Monishver11 made their first contribution in https://github.com/vllm-project/vllm/pull/32996
* @mukesh-hai made their first contribution in https://github.com/vllm-project/vllm/pull/38435
* @namgyu-youn made their first contribution in https://github.com/vllm-project/vllm/pull/38799
* @nithinvc made their first contribution in https://github.com/vllm-project/vllm/pull/38405
* @noobHappylife made their first contribution in https://github.com/vllm-project/vllm/pull/38519
* @pedramr made their first contribution in https://github.com/vllm-project/vllm/pull/39650
* @petern48 made their first contribution in https://github.com/vllm-project/vllm/pull/37247
* @pinsiangamd made their first contribution in https://github.com/vllm-project/vllm/pull/37529
* @Prathmesh234 made their first contribution in https://github.com/vllm-project/vllm/pull/36466
* @qiching made their first contribution in https://github.com/vllm-project/vllm/pull/39752
* @Roy214 made their first contribution in https://github.com/vllm-project/vllm/pull/39575
* @SandishKumarHN made their first contribution in https://github.com/vllm-project/vllm/pull/35431
* @SeraphimSerapis made their first contribution in https://github.com/vllm-project/vllm/pull/39861
* @ShubyM made their first contribution in https://github.com/vllm-project/vllm/pull/38844
* @shunting314 made their first contribution in https://github.com/vllm-project/vllm/pull/36298
* @starkwj made their first contribution in https://github.com/vllm-project/vllm/pull/38726
* @thomasmaindron made their first contribution in https://github.com/vllm-project/vllm/pull/39293
* @TihoElek made their first contribution in https://github.com/vllm-project/vllm/pull/38849
* @triangleXIV made their first contribution in https://github.com/vllm-project/vllm/pull/39102
* @ultranationalism made their first contribution in https://github.com/vllm-project/vllm/pull/40191
* @USTCKAY made their first contribution in https://github.com/vllm-project/vllm/pull/39181
* @vedantjh2 made their first contribution in https://github.com/vllm-project/vllm/pull/34539
* @vibhavagarwal5 made their first contribution in https://github.com/vllm-project/vllm/pull/39064
* @wincent8 made their first contribution in https://github.com/vllm-project/vllm/pull/37841
* @wojciech-wais made their first contribution in https://github.com/vllm-project/vllm/pull/34844
* @wufann made their first contribution in https://github.com/vllm-project/vllm/pull/38615
* @YifanLi3 made their first contribution in https://github.com/vllm-project/vllm/pull/40266
* @yintong-lu made their first contribution in https://github.com/vllm-project/vllm/pull/35697
* @yoke233 made their first contribution in https://github.com/vllm-project/vllm/pull/38909
* @yubofredwang made their first contribution in https://github.com/vllm-project/vllm/pull/39160
* @yurun00 made their first contribution in https://github.com/vllm-project/vllm/pull/37766
* @Yuyi-Ao made their first contribution in https://github.com/vllm-project/vllm/pull/38052
* @z1ying made their first contribution in https://github.com/vllm-project/vllm/pull/39518
* @zhandaz made their first contribution in https://github.com/vllm-project/vllm/pull/37948
* @Zhenzhong1 made their first contribution in https://github.com/vllm-project/vllm/pull/38192

```
