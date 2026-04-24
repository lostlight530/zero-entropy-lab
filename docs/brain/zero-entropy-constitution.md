# 核心理念 (Core Philosophy)

# Zero-Entropy Lab | Constitution

## 0. 核心愿景 (Vision)

构建一个“零熵”系统：绝对零依赖、极致冷启动速度、原教旨主义工程学实践。代码即法律，协议即真理。

## 1. 物理架构 (Topological Rules)

- **src/kernel/**：核心逻辑所在地（Cortex, Nexus, Scholar）。
- **src/scripts/ & src/styles/**：前端资产。
- **data/**：持久化存储。`data/knowledge/` 与 `data/memories/` 为系统记忆，**允许追踪**以维持 GitHub Workflow 连贯性。其余临时状态禁止追踪。
- **docs/**：纯粹的产品/架构手册，不包含业务逻辑。

## 2. 绝对法则 (The Laws)

### 2.1 零外部依赖 (Absolute Zero-Dependency)

- **后端**：严格禁止 `pip install`。仅限 Python 3.10+ 标准库。
- **前端**：严格禁止 `npm install`。仅限 Vanilla JS (ESM), HTML5, CSS3。禁止任何打包/构建工具（如 Vite, Webpack）。

### 2.2 极简工程 (Fundamentalist Engineering)

- **Cortex**：直接操作 `sqlite3`。禁止 ORM。
- **Nexus**：原生 `http.server` 路由。

### 2.3 公开透明 (Public Transparency)

- 保持仓库纯净。所有个人敏感数据、历史考古残留、临时缓存必须在 Commit 前清除。

## 3. 协作准则 (Collaboration)

- AI 合伙人必须维持系统的低熵状态。任何引入复杂度的行为需先申请 Review。

---
© 2026 Zero-Entropy Lab | "Bare-Metal Truth."
