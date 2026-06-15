# NEXUS HARVESTER: Intelligence Dossier

DATE: 2026-06-15 04:02:09 (UTC)
TARGET_IDENTITY: vllm-project/vllm
VERSION_ASSET: v0.22.1
SOURCE_LINK: https://github.com/vllm-project/vllm/releases/tag/v0.22.1

## 资产物理属性 (Asset Physical Properties)
REPOSITORY_TYPE: EXTERNAL_PACKAGE_INTELLIGENCE
PRIMARY_LANGUAGE: N/A
API_RATE_LIMIT_STATUS: BYPASSED_VIA_TOKEN

## 零熵解析矩阵 (Zero-Entropy Analysis Matrix)
DEPENDENCY_ENTROPY: EDGE_READY_BREAKING_CHANGE
ARCHITECTURE_CONFLICT: HIGH
INTERNAL_LOGIC: EXTERNAL_PAYLOAD_REFERENCE_ONLY

## 威胁与兼容性评估 (Threat & Compatibility Assessment)
DIRECT_CODE_INTEGRATION: STRICTLY_PROHIBITED
HALLUCINATION_RISK: MODERATE

## 行动指令 (Action Directives)
DIRECTIVE_1: REJECT_ALL_DEPENDENCY_INJECTIONS_FROM_THIS_REPOSITORY
DIRECTIVE_2: EXTRACT_EDGE_EXECUTION_BOUNDARIES_FOR_POTENTIAL_LOCAL_DEPLOYMENT
DIRECTIVE_3: ENSURE_ANY_EXTRACTED_LOGIC_USES_PURE_PYTHON_TYPING_AND_INSPECT_SIGNATURE

## 原始载荷 (Raw Payload)

```text
## Highlights

This release features 8 commits from 6 contributors (1 new)!

v0.22.1 is a patch release on top of v0.22.0 with targeted bug fixes plus a couple of additions: new model support for JetBrains' Mellum v2, zentorch-accelerated quantized linear inference on AMD Zen CPUs, and fixes for multi-node Ray data-parallel serving, DeepSeek-V4 initialization, and a few model-loading regressions.

### Model Support
* New model: JetBrains' **Mellum v2**, an open-weights Mixture-of-Experts code-generation model (#43992).
* **DeepSeek-V4**: resolve a CUTLASS `fmin` compatibility issue that broke initialization (0decac0d).
* Fix `OlmoHybridForCausalLM` failing to initialise after the checkpoint changed `rope_parameters` from `None` to `{"rope_type": None}` (#43846).
* Fix **HyperCLOVAX** loading after the upstream HuggingFace repo removed its remote code (now native in `transformers >= 5.9.0`): register the `hyperclovax` model_type so vLLM uses its vendored config instead of the stale `auto_map` (#43860).

### Hardware & Performance
* **AMD Zen CPUs**: route W8A8 (int8 dynamic-symmetric) and W4A16 (GPTQ) linear inference through zentorch kernels, registered ahead of the generic oneDNN CPU kernels, with transparent fallback on non-Zen CPUs, GPUs, and XPU (#41813).

### Large Scale Serving
* Fix a deterministic hang in multi-node **Ray data-parallel** serving with `num_api_servers > 1` by excluding the Ray DP backend from the deferred (kernel-assigned) port allocation introduced in #42585 (#43864).

### Build & CI
* Docker: stop installing `flashinfer-jit-cache` via `--extra-index-url` while it is quarantined on PyPI, fixing image builds (#44366).
* Normalize **NIXL** KV-connector wheel installs so only the wheel matching the image's CUDA major is kept, fixing `ImportError: libcudart.so.12` when importing `nixl_ep` on CUDA 13 images (#44266).

## Contributors

@khluu, @vadiklyutiy, @aadwived, @shadeMe, @alec-flowers, @hmellor

## New Contributors

* @aadwived made their first contribution in https://github.com/vllm-project/vllm/pull/41813
```
