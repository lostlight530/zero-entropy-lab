# 📡 NEXUS HARVESTER: Intelligence Dossier

Date: 2026-04-28 22:44:46 (UTC)
Target Identity: google-ai-edge/mediapipe
Version Asset: MediaPipe v0.10.35
Source Link: https://github.com/google-ai-edge/mediapipe/releases/tag/v0.10.35

## 资产物理属性 (Asset Physical Properties)
* Repository Type: External Package / Intelligence
* Primary Language: N/A
* API Rate Limit Status: Bypassed via injected GITHUB_TOKEN header

## 零熵解析矩阵 (Zero-Entropy Analysis Matrix)
* Dependency Entropy: Detected via Harvest Tags (🏷️ Edge-Ready)
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
