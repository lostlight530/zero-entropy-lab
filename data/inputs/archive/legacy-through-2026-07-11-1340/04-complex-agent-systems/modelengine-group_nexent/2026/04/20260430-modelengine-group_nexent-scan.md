# 📡 NEXUS HARVESTER: Intelligence Dossier

Date: 2026-04-30 10:01:15 (UTC)
Target Identity: ModelEngine-Group/nexent
Version Asset: v2.1.0
Source Link: https://github.com/ModelEngine-Group/nexent/releases/tag/v2.1.0

## 资产物理属性 (Asset Physical Properties)
* Repository Type: External Package / Intelligence
* Primary Language: N/A
* API Rate Limit Status: Bypassed via injected GITHUB_TOKEN header

## 零熵解析矩阵 (Zero-Entropy Analysis Matrix)
* Dependency Entropy: Detected via Harvest Tags (🔗 Agent-Protocol)
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
# 🚀 Nexent：开源智能体平台 / Nexent: Open Source Intelligent Agent Platform

我们很高兴地宣布Nexent v2.1.0正式发布！🎉

Nexent 是一个开源智能体平台，能够将流程的自然语言转化为完整的多模态智能体 —— 无需编排，无需复杂拖拉拽。基于 MCP 工具生态，Nexent 提供强大的模型集成、数据处理、知识库管理、零代码智能体开发能力。我们的目标很简单：将数据、模型和工具整合到一个智能中心中，使日常工作流程更智能、更互联。

We are excited to announce that Nexent v2.1.0 is released! 🎉
Nexent is an open-source agent platform that turns process-level natural language into complete multimodal agents — no diagrams, no wiring. Built on the MCP tool ecosystem, Nexent provides model integration, data processing, knowledge-base management, and zero-code agent development. Our goal is simple: to bring data, models, and tools together in one smart hub, making daily workflows smarter and more connected.

## 新功能 / New Features

### A2A 协议支持 / A2A Protocol Support
平台 Agent 可发布为 A2A 服务，支持外部发现和调用；也可反向发现和调用外部 A2A Agent，支持直接对话。覆盖后端 API、数据库、SDK、前端全链路。
Platform agents can be published as A2A services; external A2A agents can be discovered and called with direct chat support. Covers backend API, database, SDK, and frontend end-to-end.

### SQL 数据库工具 / SQL Database Tools
新增 MySQL、PostgreSQL、MSSQL 数据库执行工具。
Added SQL execute tools for MySQL, PostgreSQL, and MSSQL.

### NL2Skill 多轮对话 / NL2Skill Multi-turn Support
支持多轮自然语言生成技能，复杂技能生成，官方技能预装。
Supports multi-turn skill generation, complicated skill creation, and official skills pre-installation.

### 模型监控 / Model Monitoring
新增模型调用监控，支持 Token 使用追踪和统计。
Added model monitoring with token usage tracking and statistics.

### Agent 上下文管理 / Agent Context Management
新增上下文压缩、Token 估算、指标日志。
Added context compression, token estimation, and metrics logging.

### 模型与版本对比 / Model & Version Comparison
支持不同模型和 Agent 版本对比功能。
Added comparison for different models and agent versions.

### OAuth 重构 & API 转 MCP / OAuth Refactor & API to MCP
OAuth 实现重构；API 到 MCP 服务转换重构。
Refactored OAuth implementation and API to MCP service transformation.

### 个人文件权限隔离 / Personal File Permission Isolation
个人上传文件权限隔离，添加登录认证验证。
Personal file uploads with permission isolation and authentication verification.

---

## Bug 修复 / Bug Fixes

### A2A 相关 / A2A Issues
循环引用、流式终止、URL 选择、连接泄漏等 / Circular import, stream termination, URL selection, connection leak

### 知识库问题 / Knowledge Base Issues
文件预览失败、knowledge_base_names 缺失 / File preview failure, missing knowledge_base_names

### Kubernetes 部署 / Kubernetes Deployment
callbackBaseUrl 配置错误、外部 API 转 MCP 失败 / Incorrect callbackBaseUrl, API to MCP conversion failure

### 多轮对话 / Multi-turn Dialogues
多轮对话和文件上传异常修复 / Fixed multi-turn dialogues and file upload issues

### 其他 / Others
- Session 删除接口报错 / Session deletion error
- Multimodal 工具 502 问题 / Multimodal tool 502 error
- MinIO 懒加载 / MinIO lazy loading
- 技能删除偶发失败 / Intermittent skill deletion failure
- 模型 API Key 安全隐藏 / Hide model API key

---

## What's Changed
* ♻️ Refactor API to MCP service #2187 by @YehongPan in https://github.com/ModelEngine-Group/nexent/pull/2778
* Added the comparison function for different models and the comparison function for different versions by @2h0u4n in https://github.com/ModelEngine-Group/nexent/pull/2758
* 🐛 Bugfix: fix agent generation cache not restored when switching pages by @xuyaqist in https://github.com/ModelEngine-Group/nexent/pull/2806
* 🐛 Bugfix: Fixed the issue where the agent would throw an error when importing file tools. #2785 by @YehongPan in https://github.com/ModelEngine-Group/nexent/pull/2819
* ✨ Feat: Add direct chat functionality for external A2A agents by @xuyaqist in https://github.com/ModelEngine-Group/nexent/pull/2820
* 🐛 Bugfix: Resolve the 502 Bad Gateway issue when calling multimodal tool by @xuyaqist in https://github.com/ModelEngine-Group/nexent/pull/2811
* ✨ Add SQL execute tools by @WMC001 in https://github.com/ModelEngine-Group/nexent/pull/2831
* ✨ Feat: Personal file uploads support permission isolation. #2836 by @YehongPan in https://github.com/ModelEngine-Group/nexent/pull/2837
* ✨ Feat: Add presigned URL support for external MCP tool file access and improve agent execution flow by @xuyaqist in https://github.com/ModelEngine-Group/nexent/pull/2839
* Refactor OAuth implementation and enhance account linking features by @hhhhsc701 in https://github.com/ModelEngine-Group/nexent/pull/2775
* ♻️ File preview: Change the preview style of txt and merge the preview of unsuploaded files by @Stockton11 in https://github.com/ModelEngine-Group/nexent/pull/2840
* 🐛 Bugfix: fix excessive execution time of test_a2a_client_servic by @xuyaqist in https://github.com/ModelEngine-Group/nexent/pull/2851
* 🐛 Bugfix: save agent before publishing by @xuyaqist in https://github.com/ModelEngine-Group/nexent/pull/2862
* 🐛 Bugfix: Improve title generation logic in chat interface and streaming handler by @Zhi-a in https://github.com/ModelEngine-Group/nexent/pull/2842
* 🐛 Bugfix: Add display name to index name mapping for KnowledgeBaseSearchTool by @Zhi-a in https://github.com/ModelEngine-Group/nexent/pull/2781
* 🐛 Bugfix: Support viewing whether the agent version has been published as an A2A agent by @xuyaqist in https://github.com/ModelEngine-Group/nexent/pull/2863
* 🐛 Bugfix: Multi-turn dialogues and file uploads are not working properly. by @YehongPan in https://github.com/ModelEngine-Group/nexent/pull/2865
* 🐛 Bugfix:  Implement max steps reached handling in chat system by @Zhi-a in https://github.com/ModelEngine-Group/nexent/pull/2860
* ✨feat：add model-monitoring by @DongJiBao2001 in https://github.com/ModelEngine-Group/nexent/pull/2841
* 🐛 Bugfix: Enhance prompt generation with knowledge base display names  part2 by @Zhi-a in https://github.com/ModelEngine-Group/nexent/pull/2813
* 🐛 Bugfix:  Enhance ToolTestPanel to support dynamic KB selection based on tool type by @Zhi-a in https://github.com/ModelEngine-Group/nexent/pull/2868
* 修改oauth登录跳转页 by @hhhhsc701 in https://github.com/ModelEngine-Group/nexent/pull/2876
* ✨ Support multi-turn and more complicated NL2Skill by @Jasonxia007 in https://github.com/ModelEngine-Group/nexent/pull/2871
* feature: Enhance agent context management with compression and metrics logging by @JasonW404 in https://github.com/ModelEngine-Group/nexent/pull/2875
* 🐛 Bugfix: Multi-turn dialogues and file uploads are not working properly.  by @YehongPan in https://github.com/ModelEngine-Group/nexent/pull/2866
* ✨feat:add haotian knowledge base search tool by @DongJiBao2001 in https://github.com/ModelEngine-Group/nexent/pull/2878
* ✨ Feat: Enhance final answer generation with streaming support by @Zhi-a in https://github.com/ModelEngine-Group/nexent/pull/2873
* 🐛 Bugfix: : Ensure knowledge_base_names is always included in template context by @Zhi-a in https://github.com/ModelEngine-Group/nexent/pull/2880
* fix: add enable_context_manager column to init.sql files by @JasonW404 in https://github.com/ModelEngine-Group/nexent/pull/2883
* 🐛 Bugfix:  Enhance OpenAIModel error handling and chunk processing by @Zhi-a in https://github.com/ModelEngine-Group/nexent/pull/2886
* 🐛 Bugfix: expose URL via the northbound api to allow third-party MCP tools to access MinIO files by @xuyaqist in https://github.com/ModelEngine-Group/nexent/pull/2885
* 🐛 Bugfix: Fixes the issue where external APIs cannot be converted to MCP services under Kubernetes deployment. by @YehongPan in https://github.com/ModelEngine-Group/nexent/pull/2890
* 🐛 Bugfix: Fixed the issue of the session deletion interface reporting an error. by @YehongPan in https://github.com/ModelEngine-Group/nexent/pull/2894
* Bugfix: Overwrite agent draft info when rolling back version by @xuyaqist in https://github.com/ModelEngine-Group/nexent/pull/2893
* 🐛 Bugfix: always include knowledge_base_names in prompt template context by @xuyaqist in https://github.com/ModelEngine-Group/nexent/pull/2899
* Bugfix: force refresh agent info when needed by @xuyaqist in https://github.com/ModelEngine-Group/nexent/pull/2901
* 🐛 Bugfix: Modify callbackBaseUrl in the Kubernetes deployment environment and modify the mem0ai version. by @YehongPan in https://github.com/ModelEngine-Group/nexent/pull/2902
* Hide model api key for security by @SimengBian in https://github.com/ModelEngine-Group/nexent/pull/2900
* Update overview docs to fit version 2.1.0 by @SimengBian in https://github.com/ModelEngine-Group/nexent/pull/2906
* 🐛 Bugfix: Files in knowledge base creation cannot be previewed and file_size=0 by @Jasonxia007 in https://github.com/ModelEngine-Group/nexent/pull/2907
* release/v2.1.0 by @Dallas98 in https://github.com/ModelEngine-Group/nexent/pull/2910

## New Contributors
* @2h0u4n made their first contribution in https://github.com/ModelEngine-Group/nexent/pull/2758
* @hhhhsc701 made their first contribution in https://github.com/ModelEngine-Group/nexent/pull/2775
* @DongJiBao2001 made their first contribution in https://github.com/ModelEngine-Group/nexent/pull/2841
* @JasonW404 made their first contribution in https://github.com/ModelEngine-Group/nexent/pull/2875

**Full Changelog**: https://github.com/ModelEngine-Group/nexent/compare/v2.0.2...v2.1.0
```
