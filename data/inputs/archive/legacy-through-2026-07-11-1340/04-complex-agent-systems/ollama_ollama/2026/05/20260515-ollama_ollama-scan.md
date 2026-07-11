# 📡 NEXUS HARVESTER: Intelligence Dossier

DATE: 2026-05-15 07:26:10 (UTC)
TARGET_IDENTITY: ollama/ollama
VERSION_ASSET: v0.30.0
SOURCE_LINK: https://github.com/ollama/ollama/releases/tag/v0.30.0-rc17

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
This version of Ollama will change the architecture to directly support llama.cpp instead of building on top of GGML, and allows for compatibility with GGUF file format. MLX is used to accelerate model inference on Apple Silicon.

While in pre-release we'd love [feedback](https://github.com/ollama/ollama/pull/16031) on:

* Performance improvements or degradation
* Errors or crashes that did not previously occur
* Memory utilization improvements or degradation

## Known issues:

* `laguna-xs.2` is not supported yet on this pre-release
* `llama3.2-vision` is not supported yet on this pre-release

## Installing:

**Mac/Linux**

```
curl -fsSL https://ollama.com/install.sh | OLLAMA_VERSION=0.30.0-rc17 sh
```

**Windows**

```
$env:OLLAMA_VERSION="0.30.0-rc17"; irm https://ollama.com/install.ps1 | iex
```
```
