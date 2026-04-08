# 📡 NEXUS HARVESTER: Intelligence Dossier

Date: 2026-04-08 10:11:16 (UTC)
Target Identity: ModelEngine-Group/nexent
Version Asset: v2.0.0
Source Link: https://github.com/ModelEngine-Group/nexent/releases/tag/v2.0.0

## 资产物理属性 (Asset Physical Properties)
* Repository Type: External Package / Intelligence
* Primary Language: N/A
* API Rate Limit Status: Bypassed via injected GITHUB_TOKEN header

## 零熵解析矩阵 (Zero-Entropy Analysis Matrix)
* Dependency Entropy: Detected via Harvest Tags (⚠️ Breaking-Change, 🔗 Agent-Protocol)
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
# 🚀 Nexent v2.0.0 正式发布 / Nexent v2.0.0 Released

我们很高兴地宣布 **Nexent v2.0.0** 正式发布！🎉
这是一个 **里程碑版本**，带来了全新的能力体系、部署升级以及多项核心功能增强，标志着 Nexent 在 **可扩展性、工程化能力与企业级部署** 上迈入新阶段。

We are excited to announce the official release of **Nexent v2.0.0**! 🎉
This milestone release introduces a new capability system, enhanced deployment support, and major feature improvements, marking a significant step forward in scalability, engineering, and enterprise readiness.

---

## 🌟 核心升级 / Key Highlights

### 1️⃣ Skill 能力体系正式上线 / Skill System Introduced

全新 **Skill 功能体系** 已落地，支持：

* Skill 的创建、预览及版本配置
* 在 Agent 中灵活组合与调用 Skill
* 构建可复用、模块化的能力体系

The new **Skill system** is now available:

* Create, preview, and configure Skills
* Seamlessly integrate Skills into agents
* Build reusable and modular capability systems

---

### 2️⃣ Kubernetes 原生支持 / Kubernetes Native Support

全面支持 **Kubernetes 部署**：

* 提供完整部署实现与 Helm 目录重构
* 支持企业级扩展与高可用架构
* 更标准化的云原生部署体验

Full **Kubernetes deployment support**:

* Complete implementation with Helm structure refactoring
* Enterprise-grade scalability and high availability
* Improved cloud-native deployment experience

---

### 3️⃣ 知识库能力增强 / Knowledge Base Enhancements

知识库功能显著升级：

* 支持自定义 embedding 模型
* 优化知识检索逻辑
* 新增 `index_names` 参数支持更灵活查询

Enhanced knowledge base capabilities:

* Custom embedding model support
* Improved retrieval logic
* Added `index_names` parameter for flexible querying

---

### 4️⃣ 国际化与易用性提升 / Localization & Usability

* 工具描述新增中文本地化
* 文档完善（中英文集成指南、Agent 参数说明等）
* README 与导航结构优化

Improved usability and localization:

* Chinese localization for tool descriptions
* Enhanced documentation (EN & CN guides, agent params)
* Improved README and navigation

---

### 5️⃣ Agent 能力增强 / Agent Improvements

* `provideRunSummary` 参数支持编辑
* Agent 创建与选择流程优化
* Skill 与 Agent 深度集成

Agent enhancements:

* `provideRunSummary` is now editable
* Improved agent creation and selection flow
* Deep integration with Skills

---

## 📚 文档与生态 / Docs & Community

* 新增 ModelEngine 集成指南（中英文）

* 更新 memorial wall 并新增用户案例

* 多项文档补充与优化

* Added ModelEngine integration guide (EN & CN)

* Updated memorial wall with user testimonials

* Various documentation improvements

# What's Changed
* 📦 Update antd version & remove deprecated attribute by @xuyaqist in https://github.com/ModelEngine-Group/nexent/pull/2713
* 🐛 bugfix: model status sync, SiliconFlow logic alignment, and VLM connectivity by @wadecrack in https://github.com/ModelEngine-Group/nexent/pull/2660
* Update opensource-memorial-wall.md by @BigBen0724 in https://github.com/ModelEngine-Group/nexent/pull/2697
* Add user testimonials to memorial wall by @SHEN-e929 in https://github.com/ModelEngine-Group/nexent/pull/2683
* 📝 Add ModelEngine integration guide in English and Chinese, and update navigation links in user guide by @Zhi-a in https://github.com/ModelEngine-Group/nexent/pull/2696
* ♻️ Refactor: delete unused code & improve component render action by @xuyaqist in https://github.com/ModelEngine-Group/nexent/pull/2698
* Update opensource-memorial-wall.md by @whale0110-bit in https://github.com/ModelEngine-Group/nexent/pull/2704
* ✨ Enhance knowledge base creation: Add support for specifying embedding model name and improve retrieval logic from knowledge records. by @Zhi-a in https://github.com/ModelEngine-Group/nexent/pull/2705
* 🔨Update License by @SimengBian in https://github.com/ModelEngine-Group/nexent/pull/2718
* ✨ Add Chinese localization for tool descriptions by @geruihappy-creator in https://github.com/ModelEngine-Group/nexent/pull/2527
* ✨ Nexent Kubernetes Deployment Implementation #1853 by @YehongPan in https://github.com/ModelEngine-Group/nexent/pull/2719
* ✨ Change provideRunSummary param from read-only to editable by @SimengBian in https://github.com/ModelEngine-Group/nexent/pull/2723
* ✨ Fix KnowledgeBaseSearchTool: Add index_names parameter to forward method and update tests accordingly by @Zhi-a in https://github.com/ModelEngine-Group/nexent/pull/2712
* 📝 Update docs to illustrate agent params including provideRunSummary by @SimengBian in https://github.com/ModelEngine-Group/nexent/pull/2724
* ✨ Kubernetes Helm deployment directory reconstruction #2722 by @YehongPan in https://github.com/ModelEngine-Group/nexent/pull/2727
* 🐛 Bugfix    Update pagination logic in DataMateClient and adjust related parame… by @Zhi-a in https://github.com/ModelEngine-Group/nexent/pull/2735
* 📝 Update readme to illustrate harness-engineering by @SimengBian in https://github.com/ModelEngine-Group/nexent/pull/2739
* 🐛 Bugfix: exit create mode and select newly created agent after saving by @xuyaqist in https://github.com/ModelEngine-Group/nexent/pull/2740
* ✨ Support skill features, including creation, preview, set in agent version by @Jasonxia007 in https://github.com/ModelEngine-Group/nexent/pull/2731
* Release/v2.0.0 by @WMC001 in https://github.com/ModelEngine-Group/nexent/pull/2742

## New Contributors
* @BigBen0724 made their first contribution in https://github.com/ModelEngine-Group/nexent/pull/2697
* @SHEN-e929 made their first contribution in https://github.com/ModelEngine-Group/nexent/pull/2683
* @whale0110-bit made their first contribution in https://github.com/ModelEngine-Group/nexent/pull/2704

**Full Changelog**: https://github.com/ModelEngine-Group/nexent/compare/v1.8.1...v2.0.0
```
