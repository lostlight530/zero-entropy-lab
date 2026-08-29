# 特殊专题 2026-08-28

类型: 特殊专题
主题: xAI always-on Agent 扩大委派后的 current-state 与 completion evidence 边界

## 触发事件

2026-08-26, xAI 官方宣布 Grok Bot 扩展到 SuperGrok、Cursor Pro 与全部 Cursor Teams 计划

Grok Bot 在 2026-08-11 的初始发布中被定义为 always-on agents, 每个 Bot 有自己的 cloud computer, 可以登录应用并跨工具持续工作, 用户离开后任务仍继续, 通常只在需要 judgment 或 approval 时回来

同一时期 xAI 还把 Grok Automations 定义为每次运行都是 fresh request, 使用相同 instructions 与 current data, 并把 Grok 4.6 定位于 long-running agents

2026-08-24 至 2026-08-30 的 Ballast 日报连续研究 current completion evidence 的 freshness、read-to-commit 原子性、多资源共同状态、target incarnation、fixed compare-set completeness 与 dynamic selector membership

因此建立本专题, 只讨论 always-on delegation 扩大后这些现实产品语义与 Ballast completion evidence 的可迁移问题

本专题不评价模型能力, 不推断 xAI 产品已经发生 Ballast 受控实验中的具体故障, 不计作独立实验或发现升级证据

## 事实边界

- 只记录 xAI 与 Microsoft 的公开官方产品和平台材料
- 查询日期为 2026-08-28
- xAI Grok Bot 的运行行为以官方公开描述为边界, 不推断未公开调度、存储、审批或事务实现
- Microsoft 来源只独立确认 Grok 4.6 被用于 long-horizon reasoning 与 complex workflows 的企业平台方向, 不证明 Grok Bot 内部机制
- 没有运行 Grok Bot、Grok Automations 或 Microsoft Foundry 的真实故障注入
- 厂商材料用于说明长时委派和外部状态变化窗口现实存在, Ballast 的 effect count、completion 结果与 CASE 仍只来自受控日报

## 时间线

- 2026-07-16, xAI 发布 Grok Automations, 说明任务可按 schedule 或 email trigger 自主运行, 每次 run 是 fresh request, 使用相同 instructions 与 current data
- 2026-08-11, xAI 发布 Grok Bot early beta, 定义其为 always-on agents, 每个 Bot 有自己的 cloud computer, 跨 apps、tools 与 websites 工作并持续到任务完成或需要用户 judgment
- 2026-08-12, xAI 发布 Grok 4.6, 强调 long-running agents 与多步骤复杂任务
- 2026-08-24 至 2026-08-30, Ballast 连续攻击 current completion evidence 的 freshness、atomicity、snapshot、identity、fixed compare set 与 dynamic membership completeness
- 2026-08-26, xAI 扩大 Grok Bot 可用计划范围, 同日 xAI 与 Microsoft 宣布 Grok 4.6 进入 Microsoft Foundry, Microsoft 将其描述为面向 long-horizon reasoning 与 complex workflows

## 来源矩阵

| 组织 | 来源 | 日期 | 支持命题 | 适用边界 |
| --- | --- | --- | --- | --- |
| xAI | [Grok Bot is now included with more plans](https://x.ai/news/grok-bot-more-plans) | 2026-08-26 | Grok Bot 扩大到更多 SuperGrok、Cursor 与 Teams 计划, Bot 可并行委派真实工作并在 cloud computer 上持续执行 | 产品描述不公开任务状态、外部资源 revision、completion commit 或恢复事务边界 |
| xAI | [Introducing Grok Bot](https://x.ai/news/introducing-grok-bot) | 2026-08-11 | always-on agents 有自己的 computer, 跨 apps 持续工作, 通常在需要 approval 或 judgment 时回到用户 | 不证明 approval 后外部状态没有变化, 也不证明恢复时 current completion evidence 的实现 |
| xAI | [Automations in Grok](https://x.ai/news/grok-automations) | 2026-07-16 | automation 每次 run 被描述为 fresh request, 同 instructions 使用 current data | current data 是产品语义, 不自动证明读取具有 Ballast 所需的 freshness、snapshot 或 identity contract |
| xAI | [Grok 4.6 on Microsoft Foundry](https://x.ai/news/grok-4-6-microsoft-foundry) | 2026-08-26 | Grok 4.6 被定位于 long-running agents 并进入企业模型平台 | 模型长时能力不等价于应用级 recovery correctness |
| Microsoft | [Grok 4.6 comes to Microsoft Foundry Models](https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/grok-4-6-comes-to-microsoft-foundry-models-built-for-long-horizon-reasoning-and-/4547578) | 2026-08-26 | Microsoft 独立把 Grok 4.6 描述为 long-horizon reasoning 与 complex workflows 的模型选项 | 平台部署能力不证明 Grok Bot 的内部执行合同 |

没有发现来源间直接事实冲突

xAI 产品线共同扩大了长期委派、后台持续执行、跨应用动作与自动触发的现实窗口, Microsoft 的独立发布说明长时复杂工作也进入企业模型部署面

这些事实只能证明问题空间的重要性, 不能替代 Ballast 的受控证据

## 与每日研究的关系

- [2026-08-24](../records/2026-08-24.md) 证明 successful current-state read 可能是 stale positive, 对长期任务离开用户后继续运行的 current data 解释直接相关
- [2026-08-25](../records/2026-08-25.md) 证明 fresh read 到 completion commit 之间仍存在 TOCTOU, 对 Bot 在 approval、等待或多步执行后提交完成尤其相关
- [2026-08-26](../records/2026-08-26.md) 证明多个资源各自 authoritative read 可以拼出从未存在的 fractured completion, 对跨 apps、inboxes 与 tools 的多资源任务直接相关
- [2026-08-27](../records/2026-08-27.md) 证明同名目标重建并复用 local revision 时 current completion 需要按 task semantics 解释 target incarnation
- [2026-08-28](../records/2026-08-28.md) 证明 atomic compare 本身不补齐遗漏的业务 identity, compare set 需要从 task semantics 推导
- [2026-08-29](../records/2026-08-29.md) 证明固定 multi-resource task 即使比较全部成员 local revision, 仍需要完整 target incarnation identity set
- [2026-08-30](../records/2026-08-30.md) 证明 dynamic selector task 即使完整比较首次观察成员, 仍可能漏掉 completion 前新进入 current relevant set 的成员, 需要 membership 或 predicate witness

专题不把 Grok Bot 的 own computer、approval 或 current data 文案当作这些日报机制的复验

## 可迁移问题

1. always-on Agent 在用户离开后持续执行时, task intent、approval 与 valid_until 在最终副作用边界如何保持当前性
2. Bot 从长期线程或 durable computer 恢复后, 是否重新绑定 current authoritative state 而不是复用旧 observation
3. 一个跨 apps 任务需要多个资源共同满足时, completion evidence 是否来自同一 coherent snapshot 或完整 compare set
4. 用户 approval 发生后目标资源被别人修改、删除或重建时, approval 是否仍绑定原 action 与 target identity
5. automation 所称 current data 的 freshness、provenance 与 snapshot contract 如何表达, 成功读取是否可能仍是 stale positive
6. concrete-instance task 与 selector-bound task 如何定义不同 target identity, 避免机械 UID fencing 或 identity under-binding
7. selector 或搜索条件定义的动态任务集合在 long-running execution 中增删成员时, completion evidence 如何证明 current membership 本身没有变化
8. Agent 的 cloud computer 持久存在是否会扩大 stale local state、cached credential 与 old completion evidence 的存活窗口

## 已验证事实

- xAI 在 2026-08-26 扩大 Grok Bot 计划覆盖范围
- xAI 官方把 Grok Bot 描述为 always-on agents, 每个 Bot 有自己的 cloud computer, 可以跨 apps 与 tools 持续工作
- xAI 官方说明 Grok Automations 的每次 run 是 fresh request, 使用相同 instructions 与 current data
- xAI 与 Microsoft 在 2026-08-26 都公开 Grok 4.6 进入 Microsoft Foundry, 并把长时 Agent 或 long-horizon workflow 作为适用方向
- 08-24 至 08-30 七个 Ballast 日报分别保存 current completion freshness、atomicity、multi-resource coherence、incarnation identity、fixed identity set 与 dynamic membership 的受控结果
- 上述厂商事实没有参与 Ballast 实验数量计算

## 基于证据的推断

always-on Agent 把工作从一次请求延长到跨时间、跨应用和跨人工判断点的执行过程

这种产品形态会扩大 observation 与最终副作用之间外部状态发生变化的机会, 但不能据此断言某个具体产品一定存在 stale completion bug

Ballast 七日证据说明, 即使一个 Agent 具备 durable computer、fresh run、approval 与 atomic compare 等局部能力, completion correctness 仍取决于这些能力是否绑定任务真实语义、current relevant membership 与完整 identity set

更完整的应用级链条是 `task semantics -> current relevant membership and identity set -> coherent snapshot or freshness -> predicate-complete atomic protected completion`

对跨应用 long-running Agent, current execution permission 与 prior-effect evidence 仍是独立门, completion evidence 不能替代它们

## 未验证事项

- Grok Bot 内部是否保存可核验 task generation、action identity、target incarnation、dynamic membership witness 或 completion revision
- 用户 approval 到真实外部副作用 commit 之间是否有再次授权或状态复核
- Grok Bot 多 Agent 之间 handoff 是否传播单调 owner generation 或等价 fencing evidence
- Grok Automations 的 current data 在不同 connector、website 或 app 中具体具有什么 consistency contract
- own computer 重启、迁移或长期暂停后的 state rehydration 与 credential freshness 语义
- Microsoft Foundry 上 Grok 4.6 的企业部署与 Grok Bot 产品运行时之间没有公开证明存在同一 orchestration implementation

## 后续研究入口

- 构造 always-on delegate 在 approval 后 target 被替换的夹具, 检查 approval、identity 与 compare set 是否共同失效
- 构造跨两个外部 app 的 completion contract, 在两个 authoritative read 之间切换业务状态, 复验 fractured view
- 构造 fresh run 但 connector 返回 stale cached data 的夹具, 分开产品 run freshness 与 evidence freshness
- 构造 durable worker 恢复时 task 已取消或 intent 已变化的夹具, 检查 current execution permission 是否重新建立
- 构造 concrete-instance 与 selector-bound 两类 Bot 任务, 验证 identity contract 不被机械统一
- 构造 dynamic selector 在 Agent 执行期间加入或替换 required target 的夹具, 检查 membership witness 与 completion boundary
- 特殊专题本身不升级 METHOD 或 NOTES, 后续只有新的受控实验满足结论门槛时才参与晋级
