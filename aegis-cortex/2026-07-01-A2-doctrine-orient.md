CORTEX_RUN_HEADER

Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A2
Cadence: Daily
Loop Stage: Orient
Run Date: 2026-07-01
Agent: Jules
Knowledge Source: A1 input + External Web + aegis-cortex local files
Repository Inspection: NO
GitHub Actions Inspection: NO
Write Scope: aegis-cortex only
Boundary Violation: NO

INPUT_RECORD

读取了 A1 文件路径: aegis-cortex/2026-07-01-A1-reliability-observe.md
读取了历史 aegis-cortex 文件路径:
- aegis-cortex/2026-07-01-A2-doctrine-orient-sample.md
- aegis-cortex/2026-07-A6-aegis-memorize-sample.md
本次联网验证的主题: Prompt Drift Agent system fail
来源: Google Search (Redis: Why Multi-Agent LLM Systems Fail & How to Fix Them; Agenta: Prompt Drift: What It Is and How to Detect It; GitHub: Solving agent system prompt drift in long sessions — a 300-token fix #19397)

RISK_CLASSIFICATION

hallucination risk
* 风险描述: 针对长上下文中的 prompt 指令遗忘问题，模型可能编造脱离指令的内容
* 原因: 随着上下文变长，系统提示词的注意力权重下降，导致行为偏离原始指令

scope drift risk
* 风险描述: Agent 在长期运行和复杂多 Agent 协调中，可能会迷失最初设定的边界，特别是处理未约束的提示词时会产生超出范围的调用
* 原因: Prompt 设计不够严谨可能导致产生多余的子 Agent 或者过度请求不存在的资源

memory compression risk
* 风险描述: 长时间运行和信息累积导致需要定期重置状态或清理内存，若直接裁剪上下文可能丢失关键指令，但保留过多又无法维持注意力
* 原因: 模型对长时间历史的记忆层往往只注重信息回调，而不一定保持对核心规则的注意力，简单的信息摘要不能替代对指令的“主动唤醒”

overconfidence risk
* 风险描述: 开发者或 Agent 在处理重复任务时可能认为之前运行成功的提示词会一直成功，忽视随着时间推移的漂移
* 原因: 模型的随机性和更新导致即使相同的提示词也会逐渐表现不同（渐进式的失败）

unsupported source risk
* 风险描述: 由于提示词漂移，Agent 可能去搜寻或依据不存在的虚假资源来支撑它的行动
* 原因: 提示词失控（Poorly constrained prompts）可能会促使 Agent 寻找不存在的 sources 并作为依据

task loop break risk
* 风险描述: 过多的沟通开销或无限的子 Agent 生成会导致协调中断或者任务循环因资源耗尽或延迟而中断
* 原因: 多 Agent 的通信负担、延迟或无法正确反馈会导致执行循环断裂

stale doctrine risk
* 风险描述: 原有的避免 Prompt Drift 的方法（如定期重复指令）可能低效，且没有纳入最新的生成式指令唤醒方法（如 SCAN）
* 原因: 仅仅“读取”纪律（被动吸收大量系统提示）不够，如果没有最新的验证和“主动生成”方式唤醒原则，旧的纪律规范也会随时间失效

ORIENTATION_NOTES

今日可靠性信号对 aegis-cortex 自身意味着什么:
- Aegis 的多阶段 OODA-RM 任务（如每日、每周任务）容易受到提示词漂移和异步上下文继承断层的影响
- 我们依赖的定期反馈（如每日检查）需要不仅是“回顾”，还要有机制让 Agent 主动关注并应用约束，否则静默漂移将破坏长期稳定
- 简单的重试机制是不够的，我们需要对发生的错误进行精确分类和记录

哪些风险需要进入周决策:
- 是否需要在 Aegis 的提示词结构中加入类似 SCAN 的“主动验证”机制（让 Agent 在执行前先生成针对当前任务边界和规则的确认），以此对抗记忆压缩和漂移风险
- 多重子任务的约束如何写得更明确，避免产生过度的沟通开销（overconfidence/scope drift）

哪些判断仍然不确定:
- 导致当前漂移的根因究竟是多模型间的协调困难（如 Redis 博客所述），还是单纯长下文中注意力权重下降导致的单一模型失焦（如 GitHub issue 提到的长上下文情况），或者是闭源模型的黑盒更新？

NO_DECISION_SECTION

今天不做的决策: 不决定引入或实现具体的提示词重构策略或 SCAN 机制。
今天不能修改的内容: 维持目前每日、每周、每月的任务执行频次和现有规则设定不改变，不改动 zero-entropy-lab 的本体。

NEXT_HANDOFF

写给 A3 的周决策输入:
周决策候选纪律问题:
- 面对 Prompt Drift（随着上下文变长或随着时间推移导致的指令失效），我们需要讨论是否要在未来的核心提示词模板中引入强制的规则验证反馈生成，而非仅作为背景文本读取
- 是否需要限制 Agent 生成超出原定流程以外子任务的行为，以减少系统内生性沟通成本带来的执行断裂风险

需要继续观察的风险:
- 长期静默错误带来的渐进式性能下降（stale doctrine risk/hallucination risk）
- Agent 自我纠正时是否会发生盲目循环，没有识别到根因的问题

BOUNDARY_CHECK

确认没有读取宿主仓库机制: YES
确认没有读取 GitHub Actions: YES
确认没有写入 aegis-cortex 之外的文件: YES