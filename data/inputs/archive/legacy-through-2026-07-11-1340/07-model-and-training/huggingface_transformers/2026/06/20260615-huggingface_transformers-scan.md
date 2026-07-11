# NEXUS HARVESTER: Intelligence Dossier

DATE: 2026-06-15 23:27:45 (UTC)
TARGET_IDENTITY: huggingface/transformers
VERSION_ASSET: Patch release v5.12.1
SOURCE_LINK: https://github.com/huggingface/transformers/releases/tag/v5.12.1

## 资产物理属性 (Asset Physical Properties)
REPOSITORY_TYPE: EXTERNAL_PACKAGE_INTELLIGENCE
PRIMARY_LANGUAGE: N/A
API_RATE_LIMIT_STATUS: BYPASSED_VIA_TOKEN

## 零熵解析矩阵 (Zero-Entropy Analysis Matrix)
DEPENDENCY_ENTROPY: GENERAL
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
# Patch release v5.12.1
Updated the lower bound for PEFT and a fix for auto tokenizer to properly resolve the mistral tokenizer (when `mistral-common` is installed). This is similar to v.5.10.3 minus the fixes that were already included in the main release - vLLM will first target 5.10.3 :hugs: 

* Fix `peft` lower bound #46605 by @hmellor (#46605)
* mistral common backend fix #46667 by @itazap (#46667)


**Full Changelog**: https://github.com/huggingface/transformers/compare/v5.12.0...v5.12.1
```
