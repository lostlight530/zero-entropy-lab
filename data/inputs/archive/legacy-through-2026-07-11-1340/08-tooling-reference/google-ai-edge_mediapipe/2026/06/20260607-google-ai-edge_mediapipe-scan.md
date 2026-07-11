# NEXUS HARVESTER: Intelligence Dossier

DATE: 2026-06-07 00:21:54 (UTC)
TARGET_IDENTITY: google-ai-edge/mediapipe
VERSION_ASSET: MediaPipe v0.10.35
SOURCE_LINK: https://github.com/google-ai-edge/mediapipe/releases/tag/v0.10.35

## 资产物理属性 (Asset Physical Properties)
REPOSITORY_TYPE: EXTERNAL_PACKAGE_INTELLIGENCE
PRIMARY_LANGUAGE: N/A
API_RATE_LIMIT_STATUS: BYPASSED_VIA_TOKEN

## 零熵解析矩阵 (Zero-Entropy Analysis Matrix)
DEPENDENCY_ENTROPY: EDGE_READY
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
### Framework and core calculator improvements
- Add histogram information to Tensor::DebugString.
- Bump MediaPipe version to 0.10.35.
- Add missing GL memory barrier in TensorsToSegmentationGlBufferConverter.
- Migrate FromImageCalculator to MediaPipe API3 and add test.
- Add api3::Packet::Share function.
- Remove util/analytics references from GitHub build
- Migrate ToImageCalculator to MediaPipe API3 and add tests.
- Fix -Wthread-safety-analysis warning.
- Allow MP Task files to be use in Vite's workers
- Add save-png-by-path test util function.
- Feat: Add configurable policy for handling empty landmarks in smoothing calculators
- #mediapipe Make GPU service optional in ImageToTensorCalculator for iOS.
- Add Host Platform Web and Host System iOS/Android to logging enums

### MediaPipe Tasks update
This section should highlight the changes that are done specifically for any platform and don't propagate to
other platforms.

#### Android
- Allow users to use NPU acceleration with JIT compilation
- Drop unnecessary `tasks/core` deps

#### iOS
- Change MP Tasks CocoaPods types to Framework

#### Javascript
- Remove references to "subgroups-f16"
- Fix broken exports statement in package.json
- Update MP Tasks GenAI README

#### Python
- Small fixes to blockwise int4 compression calculations in LLM converter
- Allow for overriding apply_srq in LLM Converter
- Small blockwise dequant helper for LLM Converter


### MediaPipe Dependencies
- Update Wasm file hashes and URLs in wasm_files.bzl
```
