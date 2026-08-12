# 特殊专题 2026-08-13

类型: 特殊专题
主题: 前沿 Agent 控制面从逐步批准走向执行边界治理

## 触发事件

2026-08-07 至 2026-08-13 的 Ballast 日报连续攻击旧代际重放、幂等身份错配、基准漂移、后置条件竞态、所有权交接传播、任务有效期和取消后凭据仍有效七类问题.

同一时期 OpenAI、Anthropic 与 Google 的公开官方材料都把 Agent 从单次模型调用推进到长时运行、工具执行、沙箱、权限和跨系统动作, 并公开强化执行环境、批准、网络边界、可观测性或安全决策.

因此建立本特殊专题, 只比较三家公开控制面行为与 Ballast 已有研究问题的对应关系. 本专题不替代日报, 不计作独立实验, 不因厂商来源数量提高任何结论等级.

## 事实边界

- 只使用 OpenAI、Anthropic 与 Google 的公开官方页面、官方工程文章和官方文档.
- 查询日期为 2026-08-13, 对没有明确发布日期的文档只记录访问日期或页面给出的更新时间.
- 这里的“行为”指公开产品与工程设计方向, 不指模型人格、隐藏系统行为或未公开内部政策.
- 没有运行三家真实生产 Agent, 没有比较模型成功率, 没有声称任何厂商已经发生 Ballast 日报中的具体故障.
- 厂商文档只能提供现实工程边界和后续实验入口, 不能替代 Ballast 受控实验.

## 时间线

- 2026-04-15, OpenAI 发布更新后的 Agents SDK, 把文件、命令、代码编辑与长时任务放入受控 sandbox 环境, 并继续保留 tracing、handoff 与 agent harness.
- 2026-05-08, OpenAI 公开 Codex 内部部署的边界、审批与 agent-native telemetry, 强调低风险动作加速和高风险动作显式化.
- 2026-07-09, OpenAI 在 ChatGPT 发布说明中推出 Work, 支持跨连接应用和文件执行长任务、用户中途改向、重要动作批准以及 Scheduled Tasks.
- 2026-03-25, Anthropic 公开 Claude Code auto mode, 说明逐次 permission prompt 会产生 approval fatigue, 并尝试用分类器与 sandbox 降低无效批准负担.
- 2026-05-25, Anthropic 公开跨 claude.ai、Claude Code 与 Cowork 的 containment 工程, 把限制 blast radius 的重点从只监督行为扩展到限制环境能力.
- 2026-07-08, Anthropic Claude Code Foundations 继续把 plan mode、CLAUDE.md、skills、plugins、sub-agents 与 MCP 作为从单 Agent 扩到 fleet 的基础控制面.
- 2026-06-26, Google Cloud 为 agentic workload 扩展 VPC Service Controls, 强调网络级目的地边界.
- 2026-07-21, Google 更新 ADK 与 Gemini Agent Platform 文档, 把 orchestration、multi-agent、evaluation 和 runtime 作为企业级 Agent 基础能力.
- 2026-08-13 访问时, Gemini API Managed Agents 文档明确每个 Agent 运行在 OS 隔离 sandbox 中, 默认 outbound network 不受限, 可通过 allowlist 收紧, 外部凭据应最小授权.
- 2026-08-13 访问时, Gemini Computer Use 文档把每个动作暴露为 function call, 并可返回 allow、require_confirmation 或 blocked 的 safety decision, 由客户端执行或停止动作.

## 来源矩阵

| 组织 | 来源 | 日期 | 支持命题 | 适用边界 |
| --- | --- | --- | --- | --- |
| OpenAI | [The next evolution of the Agents SDK](https://openai.com/index/the-next-evolution-of-the-agents-sdk/) | 2026-04-15 | 长时 Agent 能力与 sandbox/harness 一起产品化 | 不证明所有 SDK 调用都自动满足任务级权限新鲜度 |
| OpenAI | [Running Codex safely at OpenAI](https://openai.com/index/running-codex-safely/) | 2026-05-08 | 用技术边界、风险分级审批和 telemetry 治理 coding agent | 公开的是 OpenAI 内部 Codex 部署经验, 不代表所有 Agent 产品配置 |
| OpenAI | [ChatGPT Release Notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes) | 2026-07-09 | Work 支持长任务、连接应用、改向、重要动作批准和 Scheduled Tasks | 发布说明不公开任务取消到外部副作用权限撤销的内部原子边界 |
| Anthropic | [How we built Claude Code auto mode](https://www.anthropic.com/engineering/claude-code-auto-mode) | 2026-03-25 | 高频批准会产生 approval fatigue, sandbox 与自动判断用于降低批准负担 | 分类器与 sandbox 不能自动证明任务语义仍然新鲜 |
| Anthropic | [How we contain Claude across products](https://www.anthropic.com/engineering/how-we-contain-claude) | 2026-05-25 | containment 用环境和访问边界限制 agent blast radius | containment 限制影响范围, 不等价于当前任务后置条件验证 |
| Anthropic | [Claude Code: Foundations](https://www.anthropic.com/webinars/claude-code-foundations) | 2026-07-08 | plan mode、repo rules、skills、MCP 和 sub-agents 进入日常 agent workflow | 培训材料不提供真实故障率或权限传播延迟数据 |
| Google | [Agent Development Kit](https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/adk) | 更新于 2026-07-21 | workflow orchestration、multi-agent、evaluation 与 runtime 被统一为 Agent 平台能力 | 框架能力不证明业务副作用具有同一事务边界 |
| Google | [Agents Overview](https://ai.google.dev/gemini-api/docs/agents) | 访问 2026-08-13 | Managed Agent 使用 OS 隔离 sandbox, outbound network 默认开放并支持 allowlist | 默认网络策略仍需要应用方主动收紧, 文档不证明所有工具最小授权 |
| Google | [Computer Use](https://ai.google.dev/gemini-api/docs/computer-use) | 访问 2026-08-13 | 动作级 safety decision 可要求 confirmation 或阻断, 客户端负责执行循环 | Preview 能力仍可能出错, safety decision 不能替代应用自己的状态合同 |
| Google Cloud | [Securing agentic AI with perimeter guardrails](https://cloud.google.com/blog/products/identity-security/securing-agentic-ai-whats-new-in-vpc-service-controls) | 2026-06-26 | agentic workload 的网络目的地边界被提升为基础设施控制面 | 网络 perimeter 不能判断一次业务意图是否已取消或过期 |

来源之间没有发现直接事实冲突. 三家使用不同控制形态, 但都没有在上述公开材料中给出一个可以替代应用层任务状态、意图、代际和后置条件的单一“Agent 安全”信号.

## 与每日研究的关系

- [2026-08-07](../records/2026-08-07.md) 证明生产入口成功不能覆盖旧代际, 与三家把执行边界放进 runtime 或 sandbox 的方向相关.
- [2026-08-08](../records/2026-08-08.md) 证明身份命中和零写入也可能错误跳过新意图, 对长任务 resume、scheduled task 与 fleet coordination 有直接研究价值.
- [2026-08-09](../records/2026-08-09.md) 证明版本冲突只关闭旧写权限, 仍需当前目标后置条件.
- [2026-08-10](../records/2026-08-10.md) 证明后置条件本身需要绑定 revision 和判定时点, 对任何长时 Agent 的中途改向与恢复都适用.
- [2026-08-11](../records/2026-08-11.md) 证明 sink 已见最大 generation 不能替代当前权威所有权, 对 multi-agent handoff 和 fleet 执行尤为相关.
- [2026-08-12](../records/2026-08-12.md) 证明服务可重试时间和 transport deadline 不能续期任务语义有效期, 对 background 与 scheduled execution 有直接研究价值.
- [2026-08-13](../records/2026-08-13.md) 证明 credential 仍 active 不能替代当前任务授权, 与 connected apps、MCP、外部工具和 network credential 的执行边界直接相关.

特殊专题只映射问题空间, 不把厂商设计当作这些日报机制实验的重复证据.

## 可迁移问题

1. 长任务被用户改向或取消后, 已经下发给 tool/runtime 的执行权限如何在最终副作用入口失效.
2. sandbox 或网络 allowlist 能限制 blast radius, 但如果旧任务仍在允许范围内执行错误副作用, 还需要哪一层任务状态 fence.
3. 人工批准发生在计划时、动作生成时还是副作用提交时, 批准本身是否绑定 action identity、intent 和 current state.
4. multi-agent handoff 后新 owner 的 generation 如何传播到还没有见过新请求的外部 sink.
5. background、scheduled 和 resume 任务经过长时间等待后, transport/session 仍有效是否会掩盖 task expiry.
6. credential、MCP connection 或 connected-app grant 仍有效时, 如何证明当前任务仍拥有这次具体操作的授权.
7. trace 和 observable execution step 能否独立重建判定时状态, 而不是只显示最终成功结果.

## 已验证事实

- OpenAI 的公开 Agent 产品方向同时扩大长任务与真实工具执行能力, 并公开使用 sandbox、审批和 telemetry 作为治理手段.
- Anthropic 公开指出高频 permission prompt 会导致 approval fatigue, 并把 containment 与 sandbox 作为提高 autonomy 时限制 blast radius 的核心工程手段.
- Google 当前 Managed Agents 与 Computer Use 文档把 sandbox、network rule、tool execution、safety decision 和 confirmation 暴露为明确 runtime/API 合同.
- 三家公开材料都把 Agent 描述为会持续观察、调用工具并改变外部状态的系统, 而不再只是一次模型文本返回.
- 上述事实来自厂商公开材料, 不包含 Ballast 对这些真实产品的直接故障注入结果.

## 基于证据的推断

OpenAI 当前方向最明显的是把 Agent 推向跨应用、长时和持续任务, 同时用审批、sandbox 与 telemetry 建立治理面. Ballast 的评价是这种方向提高了真实生产力上限, 也扩大了状态随时间变旧的窗口, 所以“批准过一次”“连接仍有效”或“任务仍在后台运行”都不应自动续期副作用权限.

Anthropic 当前方向最明确地承认人类逐步审批本身会失效, 并把控制重点转向 containment. Ballast 认可这种转向, 因为安全不能依赖用户永远认真点击. 但 containment 主要限制可造成多大损害, 不能回答一次动作是否仍属于当前意图、当前 owner 或当前未取消任务.

Google 当前方向最偏 runtime 和 policy contract: sandbox、network allowlist、可观察 step、Computer Use safety decision 和 confirmation 都直接进入 API. Ballast 认为这种显式合同最利于独立验证, 但 Managed Agent 默认 outbound network 开放也说明平台能力本身不是最小权限, 应用仍必须主动限定 egress、credential 和任务状态.

三家的共同趋势不是“让模型自己更谨慎”这么简单, 而是把可靠性从模型层外移到执行系统. 7 至 13 日 Ballast 进一步提示, 执行系统还需要保证授权是当前的: state、intent、owner、time、task status 和 credential 任一维度变旧, 都可能让技术上成功的动作变成语义错误.

## 未验证事项

- 三家内部是否把任务取消、用户改向与已经在飞行中的外部 tool call 做原子失效.
- OpenAI Work Scheduled Tasks、Claude Code/Cowork 和 Gemini Managed Agents 在真实网络分区、恢复或 credential 撤销传播中的具体行为.
- 各家 approval 或 confirmation 是否绑定不可伪造的 action identity、当前 revision 与具体 intent.
- sandbox、egress proxy、MCP 或 connected-app credential 的实际最小权限默认值在不同产品和企业配置中的差异.
- telemetry 或 observable steps 能否完整重建已经被后续合法写入覆盖掉的过期副作用历史.

## 后续研究入口

- 构造统一的 `task state + intent digest + owner generation + valid_until + credential state` 控制夹具, 分别撤销其中一个维度并重放同一副作用.
- 将批准或 confirmation 建模为带 action identity 和 expiry 的 capability, 比较永久批准、短期批准和提交时复核.
- 将 sandbox/network allowlist 与任务语义 fence 分开, 验证“动作在允许网络内”但“任务已取消”时是否仍会产生错误副作用.
- 在多 Agent handoff 中让新 owner 尚未触碰 sink, 检查 sink-local fence 与权威控制面的传播窗口.
- 停止条件为能够明确区分 containment failure、authorization freshness failure 和 postcondition failure, 不把三者混成一个安全指标.
