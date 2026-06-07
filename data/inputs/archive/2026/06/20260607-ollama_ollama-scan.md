# NEXUS HARVESTER: Intelligence Dossier

DATE: 2026-06-07 00:28:53 (UTC)
TARGET_IDENTITY: ollama/ollama
VERSION_ASSET: v0.30.6
SOURCE_LINK: https://github.com/ollama/ollama/releases/tag/v0.30.6

## 资产物理属性 (Asset Physical Properties)
REPOSITORY_TYPE: EXTERNAL_PACKAGE_INTELLIGENCE
PRIMARY_LANGUAGE: N/A
API_RATE_LIMIT_STATUS: BYPASSED_VIA_TOKEN

## 零熵解析矩阵 (Zero-Entropy Analysis Matrix)
DEPENDENCY_ENTROPY: EDGE_READY
ARCHITECTURE_CONFLICT: LOW
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
# New models
- [Gemma 4 QAT weights](https://ollama.com/library/gemma4): the Gemma 4 family is now optimized with Quantization-Aware Training (QAT) to dramatically reduce memory requirements and maximize on-device performance. Look for the tags ending in `-qat`:
  - `gemma4:e2b-it-qat`
  - `gemma4:e4b-it-qat`
  - `gemma4:12b-it-qat`
  - `gemma4:26b-a4b-it-qat`
  - `gemma4:31b-it-qat`


## What's Changed
* `ollama launch omp` now integrates with [Oh My Pi](https://omp.sh), an AI coding agent with IDE integration
* MLX embedding layers now use NVFP4 global scale for improved quantization on Apple Silicon


**Full Changelog**: https://github.com/ollama/ollama/compare/v0.30.5...v0.30.6
```
