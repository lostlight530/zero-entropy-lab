# 📡 NEXUS HARVESTER: Intelligence Dossier

Date: 2026-05-10 22:35:02 (UTC)
Target Identity: vllm-project/vllm
Version Asset: v0.20.2
Source Link: https://github.com/vllm-project/vllm/releases/tag/v0.20.2

## 资产物理属性 (Asset Physical Properties)
REPOSITORY_TYPE: EXTERNAL_PACKAGE_INTELLIGENCE
PRIMARY_LANGUAGE: N/A
API_RATE_LIMIT_STATUS: BYPASSED_VIA_TOKEN

## 零熵解析矩阵 (Zero-Entropy Analysis Matrix)
DEPENDENCY_ENTROPY: ⚠️_BREAKING-CHANGE
ARCHITECTURE_CONFLICT: LOW
INTERNAL_LOGIC: EXTERNAL_PAYLOAD_REFERENCE_ONLY

## 威胁与兼容性评估 (Threat & Compatibility Assessment)
DIRECT_CODE_INTEGRATION: STRICTLY_PROHIBITED
HALLUCINATION_RISK: MODERATE

## 行动指令 (Action Directives)
DIRECTIVE_1: REJECT_ALL_DEPENDENCY_INJECTIONS_FROM_THIS_REPOSITORY
DIRECTIVE_2: EXTRACT_CORE_THEORETICAL_CONCEPTS_FOR_ZERO_ENTROPY_REFACTORING
DIRECTIVE_3: ENSURE_ANY_EXTRACTED_LOGIC_USES_PURE_PYTHON_TYPING_AND_INSPECT_SIGNATURE

## 原始载荷 (Raw Payload)

```text
# vLLM v0.20.2

## Highlights
This release features 6 commits from 6 contributors (0 new)!

This is a small patch release with bug fixes for DeepSeek V4, gpt-oss, and Qwen3-VL

### Bug Fixes
* **DeepSeek V4 sparse attention**: Re-enable the persistent topk path on Hopper and ensure the memset kernel runs at CUDA graph capture time regardless of `max_seq_len`, fixing the MTP=1 hang on DeepSeek V4 (#41665, revert of #41605).
* **DeepSeek V4 KV cache**: Fixed a "failure to allocate KV blocks" error in the V1 engine KV cache manager (#41282).
* **gpt-oss MXFP4 + torch.compile**: Plumbed `hidden_dim_unpadded` through the `moe_forward` fake op so MXFP4 works under `torch.compile` on v0.20.x (#42002, backport of #41646).
* **Qwen3-VL**: Removed an invalid deepstack boundary check that could fail under heavy load (#40932).

## Contributors
@ywang96, @zyongye, @stecasta, @wzhao18, @Isotr0py, @khluu

```
