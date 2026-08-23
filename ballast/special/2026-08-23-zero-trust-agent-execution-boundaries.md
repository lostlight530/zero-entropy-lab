# 特殊专题 2026-08-23

类型: 特殊专题
主题: AI Agent 控制从软提示词转向零信任执行边界

## 触发事件

2026-08-17, Google Developers Blog 发布 `Build zero-trust AI agents with Google's Agent Development Kit`, 明确把能够退款、改数据库和动态执行代码的 Agent 视为会直接改变生产状态的执行系统

该文章明确指出 system prompt 是软约束, 并把硬控制放到模型上下文之外的写入身份、代码隔离和确定性语义网关

2026-08-17 至 2026-08-23 的 Ballast 日报同时连续研究 effect 与 receipt 原子可见性、恢复接管、prior-effect evidence classification、freshness、retention、resource lifecycle 以及 compensation 后的 current completion

因此建立本特殊专题, 用 Google 本周事件作为触发点, 再与 OpenAI 和 Anthropic 的公开 Agent runtime 设计交叉核对

本专题只研究执行控制面与 Ballast 的可迁移边界, 不做厂商排名, 不替代日报, 不计作独立实验或发现升级证据

## 事实边界

- 只使用 Google、OpenAI 与 Anthropic 的公开官方工程文章和产品文档
- 查询日期为 2026-08-23, 来源发布日期按各页面公开日期记录
- 只记录公开可验证的 sandbox、identity、permission、egress、harness、durable execution 与 deterministic validation 行为
- 没有对三家真实生产 Agent 做故障注入, 没有比较模型能力或安全成功率
- 厂商材料只能提供现实工程合同和实验入口, 不能证明 Ballast 日报中的 effect count、replay 结果或发现
- Google 文中使用 CI/CD 测试 deterministic gateway 属于其参考实现, Ballast 不因此引入 CI 或把 CI 当作本仓库完成证明

## 时间线

- 2026-04-15, OpenAI 更新 Agents SDK, 为长时任务增加 model-native harness 与 native sandbox execution, 并把 harness 与 compute 分离以支持安全、持久恢复和扩展
- 2026-05-25, Anthropic 公开 Claude across products containment 工程, 把 human-in-the-loop 的 approval fatigue 与 environment containment 分开, 使用 sandbox、VM、filesystem boundary 与 egress control 限制 Agent 能力边界
- 2026-08-17, Google 发布 ADK zero-trust Agent 工程文章, 明确 system prompt 不是安全边界, 提出 cryptographic write signature、gVisor isolation 与 deterministic semantic gateway 三层硬控制
- 2026-08-17 至 2026-08-22, Ballast 从 receipt provenance 逐步推进到 negative prior-effect evidence 的 classification、identity、freshness、retention 与 lifecycle
- 2026-08-23, Ballast 进一步观察 exact historical receipt 在可逆 effect 被补偿或外部合法反转后仍不足以证明 current completion

## 来源矩阵

| 组织 | 来源 | 日期 | 支持命题 | 适用边界 |
| --- | --- | --- | --- | --- |
| Google | [Build zero-trust AI agents with Google's Agent Development Kit](https://developers.googleblog.com/build-zero-trust-ai-agents-with-googles-agent-development-kit/) | 2026-08-17 | system prompt 是软约束, 生产写入需要模型外的 identity、sandbox 与 deterministic gateway | 参考架构不证明任意 Agent 已满足当前任务权限、恢复或完成合同 |
| OpenAI | [The next evolution of the Agents SDK](https://openai.com/index/the-next-evolution-of-the-agents-sdk/) | 2026-04-15 | long-horizon Agent 使用 controlled sandbox, harness 与 compute 分离, state externalization 支持 snapshot 与 rehydration | sandbox 与 durable execution 不自动证明恢复后的任务语义仍然新鲜 |
| Anthropic | [How we contain Claude across products](https://www.anthropic.com/engineering/how-we-contain-claude) | 2026-05-25 | approval supervision 会疲劳, containment 通过 sandbox、VM、filesystem 与 egress boundary 限制 blast radius | containment 约束可达能力, 不等价于应用层 current permission 或 completion validation |

三家材料没有形成事实冲突

共同趋势是把部分关键可靠性和安全边界从自然语言提示词外移到可执行系统层, 但三家的公开材料都不能替代具体应用自己的任务状态、历史副作用与当前后置条件验证

## 与每日研究的关系

- [2026-08-17](../records/2026-08-17.md) 证明 receipt identity 正确仍不足以修复 effect 与 receipt 双写顺序, 对任何 signed write 或 audit receipt 都需要 provenance 与 commit boundary
- [2026-08-18](../records/2026-08-18.md) 证明新 ownership epoch 只回答当前 holder, 不证明旧 holder 没有 effect, 对 multi-agent handoff 与 durable resume 直接相关
- [2026-08-19](../records/2026-08-19.md) 证明 query error 不能被当成 authoritative miss, 对远端 policy、audit 或 receipt service 暂时不可用时的恢复有直接研究价值
- [2026-08-20](../records/2026-08-20.md) 证明 successful read 仍需要 freshness, 对外置 state、rehydration 和 remote gateway 回读具有直接对应关系
- [2026-08-21](../records/2026-08-21.md) 证明 evidence retention 必须覆盖合法恢复窗口或有更长生命周期的 exact fallback
- [2026-08-22](../records/2026-08-22.md) 证明 current resource absence 与 historical occurrence 不同, 对可删除资源、版本历史和审计日志生命周期直接相关
- [2026-08-23](../records/2026-08-23.md) 证明 historical receipt hit 与 current completion 也需要分开, 对可补偿、可回滚的 stateful effect 尤其重要

特殊专题只映射真实 Agent 工程趋势与 Ballast 问题空间, 不把厂商设计当作日报的独立复验

## 可迁移问题

1. cryptographic signature 能证明谁提交了什么 payload, 但是否绑定 current task、current intent、approval 与 target incarnation
2. sandbox 和 egress boundary 能限制 Agent 能做什么, 但旧任务在允许范围内执行错误副作用时由哪一层关闭权限
3. deterministic gateway 使用的业务事实是否来自当前权威 revision, 静态规则或旧缓存是否可能形成 stale authorization
4. harness state externalization 与 sandbox rehydration 延长恢复窗口后, current permission 和 prior-effect evidence 应在何时重新验证
5. multi-agent handoff 后新 owner identity 如何传播到真实 effect sink, sink 是否接受可核验 fencing evidence
6. audit receipt 或 signed write 能证明 historical occurrence 时, 对可逆 stateful effect 是否还需要 current postcondition 才能恢复 completion
7. tool、MCP、connector 或网络 allowlist 是否应被视为 capability grant, 其范围与任务级 intent 是否能够独立收紧

## 已验证事实

- Google 2026-08-17 官方文章明确指出 system prompt 不是 security boundary, 并提出模型外的三层 hard control
- Google 参考架构要求 state-changing write 在提交前验证 agent-specific signature, 动态代码在 gVisor 中零网络执行, 业务规则经过 deterministic gateway
- OpenAI 公开 Agents SDK 把 long-horizon harness 与 sandbox compute 分离, 并通过 state externalization、snapshot 与 rehydration 支持 durable execution
- Anthropic 公开材料把 model supervision 与 environment containment 分开, 并报告 Claude Code 从逐动作 approval 转向 OS-level sandbox 以降低 approval fatigue
- Anthropic 还指出 destination allowlist 可能实际授予比预期更宽的 capability, 因而环境边界本身也需要精确设计
- 上述事实全部来自厂商公开材料, 不包含 Ballast 对这些真实系统的直接实验结果

## 基于证据的推断

本期最清晰的行业方向不是让模型在提示词里更加谨慎, 而是把身份、可达资源、代码执行与业务规则下沉为模型外可执行合同

Google 的签名写入回答 actor 与 payload provenance, sandbox 回答运行时 blast radius, gateway 回答确定性业务边界

OpenAI 的 harness 与 compute 分离进一步把模型循环、凭据环境与 durable execution 解耦, 使 Agent 能跨 sandbox 生命周期继续工作

Anthropic 的 containment 经验说明 human approval 本身会出现 fatigue, 而 filesystem、VM 与 egress 等 hard boundary 可以让更高自治发生在受限能力范围内

Ballast 本周增加的是另一层应用级判断: 即使 identity、sandbox、gateway 或 permission 都工作正常, 恢复器仍需要分别回答 `现在是否允许执行`, `此前未知尝试是否发生`, `当前完成条件是否仍成立`

因此模型外 hard control 是必要执行边界, 但不能单独替代 current execution permission、prior-effect evidence validity 与 current authoritative postcondition

## 未验证事项

- Google 参考 zero-trust 架构在真实多 Agent 并发、恢复、KMS 故障与 gateway stale state 下的具体行为
- OpenAI sandbox rehydration 在任务取消、外部状态推进或 receipt 过期后的 current permission 与 reconciliation 细节
- Anthropic containment 与 permission proxy 在长期任务恢复、跨 Agent handoff 和外部 effect unknown outcome 中的具体提交边界
- 三家 agent identity 是否统一绑定 task identity、normalized action、target incarnation 与 approval state
- deterministic gateway、network proxy 与 external receipt service 的读取 freshness、retention 与 failure classification
- 对不可逆 occurrence-only effect 与可逆 persistent-state effect 是否应使用不同 completion contract

## 后续研究入口

- 构造 `signed action + stale task state` 夹具, 验证签名完全正确但任务已取消时提交边界是否仍应拒绝
- 构造 `sandbox rehydration + external state advance` 夹具, 验证恢复容器不等于恢复旧执行权限
- 构造 `deterministic gateway + stale authoritative input` 夹具, 比较规则正确但事实过期与绑定 revision 的决策
- 构造 `approved capability + narrowed current intent` 夹具, 检查环境允许范围是否会掩盖任务级授权收缩
- 复验 2026-08-23 的 compensation reversal, 分离 occurrence-only effect 与 persistent-state effect 的 completion contract
- 若后续至少三个独立受控实验跨时复现同一新机制, 再判断是否升级 METHOD、CASES 或 NOTES
