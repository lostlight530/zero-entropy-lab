# 📡 NEXUS HARVESTER: Intelligence Dossier

Date: 2026-04-08 10:11:19 (UTC)
Target Identity: google-ai-edge/mediapipe
Version Asset: MediaPipe v0.10.33
Source Link: https://github.com/google-ai-edge/mediapipe/releases/tag/v0.10.33

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
### Build changes

- [mediapipe] mark mediapipe/gpu:gl_context incompatible on Windows
- [mediapipe] automatically disable gpu (OpenGL) when building for Windows
- [mediapipe] update visibility of gpu:disable_gpu_flag


### Framework and core calculator improvements
- Add Nearest Neighbor interpolation to WarpAffineCalculator.
- Add a Tensor DebugString() function that formats the tensor numpy-style
- Add a Tensor test util
- Create a C API for Holistic Landmarker
- Remove the CPU-only MediaPipe LLM Inference Engine
- Add an AddMultiStreamCallback version that takes a packet map
- BUILD rule cleanup
- API3 subgraph support
- Adds LogImage for mediapipe::Image
- Add support for FULL_RANGE face detection task
- Ads optional RESET input stream to SpectrogramCalculator
- Simplify TaskRunner initialization by adding an options object
- Plumb the host platform and version for all MP Tasks users.
- MediaPipe: Add ROI validation in ImageToTensorOpenCvConverter

### MediaPipe Tasks update
This section should highlight the changes that are done specifically for any platform and don't propagate to
other platforms.


#### Javascript
- Add tests for full-range face detector model.

#### Python
- Re-adding old sources for Holistic Landmarker
- Re-add Holistic Landmarker to Python
- Small patch in old LLM converter
- Support int2 quantization serialization in MP converter
- Removing temporary flag in MP LLM converter
```
