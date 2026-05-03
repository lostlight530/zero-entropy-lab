# 📡 NEXUS HARVESTER: Intelligence Dossier

Date: 2026-05-03 11:46:15 (UTC)
Target Identity: vllm-project/vllm
Version Asset: v0.20.1
Source Link: https://github.com/vllm-project/vllm/releases/tag/v0.20.1

## 资产物理属性 (Asset Physical Properties)
REPOSITORY_TYPE: EXTERNAL_PACKAGE_INTELLIGENCE
PRIMARY_LANGUAGE: N/A
API_RATE_LIMIT_STATUS: BYPASSED_VIA_TOKEN

## 零熵解析矩阵 (Zero-Entropy Analysis Matrix)
* Dependency Entropy: Detected via Harvest Tags (🏷️ Edge-Ready)
DEPENDENCY_ENTROPY: 🏷️_EDGE-READY
ARCHITECTURE_CONFLICT: LOW
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
# vLLM v0.20.1

This is a patch release on top of `v0.20.0` primarily focused on **DeepSeek V4 stabilization and performance improvements**, along with several important bug fixes.

### DeepSeek V4
* Base model support (#41006).
* Multi-stream pre-attention GEMM (#41061), configurable pre-attn GEMM knob (#41443), and tuned default `VLLM_MULTI_STREAM_GEMM_TOKEN_THRESHOLD` (#41526).
* BF16 and MXFP8 all-to-all support for FlashInfer one-sided communication (#40960).
* PTX `cvt` instruction for faster FP32->FP4 conversion (#41015).
* Integrated tile kernels (`head_compute_mix_kernel`) for optimized head computation (#41255).
* Guard megamoe flag with Pure TP (#41522).
* Fixed persistent topk cooperative deadlock at TopK=1024 (#41189) and inter-CTA init race on RadixRowState (#41444), with temporary disable of persistent topk as a workaround (#41442).
* Fixed import error due to AOT compile cache loading (#41090).
* Fixed torch inductor error (#41135).
* Fixed repeated RoPE cache initialization (#41148).
* Fixed missing type conversion for non-streaming tool calls in DSV3.2/V4 (#41198).

### Bug Fixes
* Fixed `max_num_batched_token` not being captured in CUDA graph (#40734).
* Fixed `num_gpu_blocks_override` not accounted for in `max_model_len` checks (#41069).
* Auto-disable `expandable_segments` around cumem memory pool (#40812).
* Fixed BailingMoE linear layer (#40859) and MLA RoPE rotation for BailingMoE V2.5 (#41185).
* Fixed reasoning parser kwargs not being passed to structured output (#41199).
* [ROCm] Fixed `input_ids` and `expert_map` args for Quark W4A8 GPT-OSS (#41165).

## List of contributors
@BugenZhao, @chaunceyjiang, @gau-nernst, @ghphotoframe, @Isotr0py, @jeejeelee, @khluu, @njhill, @Rohan138, @wzhao18, @youkaichao, @ywang96, @ZJY0516, @zixi-qi, @zyongye
```
