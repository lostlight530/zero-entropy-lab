# A1 Daily Reliability Observe

CORTEX_RUN_HEADER

Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A1
Cadence: Daily
Loop Stage: Observe
Run Date: 2026-07-02
Agent: Jules
Knowledge Source: External Web + aegis-cortex local files
Repository Inspection: NO
GitHub Actions Inspection: NO
Write Scope: aegis-cortex only
Boundary Violation: NO

INPUT_RECORD

本次读取了 `aegis-cortex/2026-07-01-A1-reliability-observe.md` 了解前一次观察的状态和基准。
本次联网搜索了以下主题：
* Coding agent failure modes
* Memory governance
* Agent boundary control
* Tool-use errors
* Long-running agent state
这些主题需要观察是为了解 Agent 系统在实际生产环境中的常见失败模式、长期运行状态的维持挑战、工具调用的错误分类以及记忆和边界控制的最新研究和工程实践，从而帮助提升本 Agent 架构的稳定性。

EXTERNAL_SOURCE_RECORDS

Source 1

Title: AgentArmor: A Framework, Evaluation, & Mitigation of Coding Agent Failures
Publisher: arXiv
URL: https://arxiv.org/html/2606.19380
Date Checked: 2026-07-02
Source Type: Academic Paper
Relevance: High. 分析了编程代理的失败机制，如规范不足、能力错误和代理工具链(harness)错误。
Confidence: High

Source 2

Title: Guarding AI memory
Publisher: Microsoft Security Blog
URL: https://www.microsoft.com/en-us/security/blog/2026/06/22/guarding-ai-memory/
Date Checked: 2026-07-02
Source Type: Tech Blog
Relevance: High. 讨论了 AI 记忆带来的安全风险，如记忆污染、逐渐改变行为模式等。
Confidence: High

Source 3

Title: Niave? : r/ClaudeAI (Agent Boundary Control comments)
Publisher: Reddit
URL: https://www.reddit.com/r/ClaudeAI/comments/1nfek4i/niave/
Date Checked: 2026-07-02
Source Type: Community Discussion
Relevance: Medium. 提供了控制代理边界的实用工程建议，例如明确的文件限制、基于时间的杀掉超期任务等。
Confidence: Medium

Source 4

Title: How to evaluate agent tool use
Publisher: Label Studio
URL: https://labelstud.io/learningcenter/how-to-evaluate-agent-tool-use/
Date Checked: 2026-07-02
Source Type: Tech Blog
Relevance: High. 将工具调用错误分类为选择错误、Schema 错误、执行错误和解析错误。
Confidence: High

Source 5

Title: Why Agentic AI Needs a Distributed SQL Database
Publisher: CockroachDB
URL: https://www.cockroachlabs.com/blog/agentic-ai-database-architecture/
Date Checked: 2026-07-02
Source Type: Tech Blog
Relevance: High. 讨论了长期运行的代理状态带来的挑战，如高并发写入和故障时的正确性保证。
Confidence: High

RAW_RELIABILITY_SIGNAL_LOG

Signal 1

Signal: 编程代理的失败可以归结为三种机制：规范不足(underspecification)、能力错误(capability errors)和工具链/环境错误(agent harness errors)。
Source: AgentArmor Paper (arXiv)
Failure Mode Addressed: Coding Agent Failures
Why It May Matter: 有助于我们对现有的和潜在的错误进行结构化分类，而不只是宽泛地认为“AI做错了”。
Uncertainty: Low

Signal 2

Signal: 记忆攻击可以在长时间内逐步发生（而非单次提示词攻击），可能在原始上下文消失后影响代理推理。
Source: Microsoft Security Blog
Failure Mode Addressed: Memory Poisoning / State Corruption
Why It May Matter: 我们在 `aegis-cortex` 中积累的记忆文件可能会在未来引发未预期的行为偏移。
Uncertainty: Low

Signal 3

Signal: 代理边界控制需要硬性约束，比如“只修改这3个文件”、“超过10分钟直接Kill掉”。
Source: Reddit r/ClaudeAI
Failure Mode Addressed: Agent Loop Failures, Unbounded Scope
Why It May Matter: 提供了一种防范无限制消耗和范围蔓延的工程实践视角。
Uncertainty: Low

Signal 4

Signal: 工具调用的失败需要细分评估：选择(Selection)、结构(Schema)、执行(Execution)和解析(Parsing)错误。
Source: Label Studio Blog
Failure Mode Addressed: Tool-use Errors
Why It May Matter: 这四个维度可以用来监控代理在调用外部工具时的薄弱环节。
Uncertainty: Low

Signal 5

Signal: 长期运行的代理需要处理状态保存的问题，这带来了高并发、部分失败回滚等传统数据库面临的挑战。
Source: CockroachDB Blog
Failure Mode Addressed: Long-running agent state loss/corruption
Why It May Matter: 虽然我们使用文件系统作为状态，但并发和部分写入失败的逻辑同样适用。
Uncertainty: Low

NEXT_HANDOFF

给 A2 的输入提示：
* 需要解释我们目前的单文件（Markdown）状态流转是否容易受到“部分写入失败”的影响（参考 Signal 5）。
* 我们是否需要针对工具链错误（Harness Errors）和能力错误建立不同的预防策略？
* Reddit 上提到的粗暴但有效的边界控制（如基于时间的终止），对我们的异步机制是否有借鉴意义，还是仅仅是噪音？
* 关注记忆文件逐渐导致行为偏移（Signal 2），如何结合我们之前的 Prompt Drift 防御进行思考？

BOUNDARY_CHECK

确认没有读取宿主仓库机制：YES
确认没有读取 GitHub Actions：YES
确认没有写入 aegis-cortex 之外的文件：YES