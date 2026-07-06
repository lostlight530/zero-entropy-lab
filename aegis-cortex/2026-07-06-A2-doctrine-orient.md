CORTEX_RUN_HEADER

Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A2
Cadence: Daily
Loop Stage: Orient
Run Date: 2026-07-06
Agent: Jules
Knowledge Source: A1 input + External Web + aegis-cortex local files
Repository Inspection: NO
GitHub Actions Inspection: NO
Write Scope: aegis-cortex only
Boundary Violation: NO

INPUT_RECORD

INPUT_MISSING
记录读取的历史 aegis-cortex 文件路径: aegis-cortex/2026-07-04-A2-doctrine-orient.md, aegis-cortex/2026-07-05-A2-doctrine-orient.md, aegis-cortex/2026-07-A6-aegis-memorize-sample.md
记录本次联网验证的主题和来源: "Why AI Agents Break: A Field Analysis of Production Failures" (Arize AI), "Why Your AI Agent Keeps Breaking" (SketricGen AI)

RISK_CLASSIFICATION

hallucination risk
解释：如果输入缺失（如 A1 文件缺失），代理可能会试图编造观察结果以完成任务闭环，从而引入有害的错误信息。

scope drift risk
解释：为了解决输入缺失或理解系统上下文，代理倾向于超越 `aegis-cortex` 的边界去检索宿主仓库的源码或其他配置文件。

memory compression risk
解释：长期记忆如果提取不当或过度压缩，会丧失重要细节，使后续阶段失去具体问题的判断依据。

overconfidence risk
解释：即使在缺乏有效输入的情况下，代理也可能表现得过于确信并给出虚假决策。

unsupported source risk
解释：在未得到确切内部错误数据的情况下，过分依赖外部网络搜索的可靠性框架可能会引入不适配当前架构的规章制度。

task loop break risk
解释：在缺乏明确 A1 观察输入时，后续的定向（Orient）和决策（Decide）任务可能因信息断层而无法连贯进行。由于错误未被优雅处理，循环存在崩溃的风险。

stale doctrine risk
解释：如果未能将每日处理异常的经验固化为静态纪律，导致原则跟不上实际发生的任务断裂情况，规范便会失效。

ORIENTATION_NOTES

说明今日可靠性信号对 aegis-cortex 自身意味着什么：
今日 A1 文件缺失暴露出输入依赖链条存在脆弱性。对于 `aegis-cortex`，必须明确：遇到缺失输入时应采取宽容处理并严格记录 `INPUT_MISSING`，绝对不充当内容生成器。外部搜索表明，工作流设计错误（而非模型本身）是代理崩溃的首因，我们需要增强输入缺失场景下的系统鲁棒性。

说明哪些风险需要进入周决策：
- 任务循环断裂风险（task loop break risk）和幻觉风险（hallucination risk）在缺乏输入时最为突出，必须将“强制记录 INPUT_MISSING 且禁止编造”作为纪律提交到周决策。

说明哪些判断仍然不确定：
- 由于今天没有 A1 观察输入，我们尚不确定日常的运行是否还存在其他未被发现的系统或协议边界违规行为。

NO_DECISION_SECTION

明确列出今天不做的决策：
今天不针对输入缺失制定最终补救机制或纪律修改。

明确列出今天不能修改的内容：
不能修改 `aegis-cortex` 外的任何文件，亦不能随意填补缺失的历史 `A1` 记录。

NEXT_HANDOFF

写给 A3 的周决策输入：
- 在缺失前提输入时，必须定义安全的后备降级路线，防止任务产生幻觉或直接崩溃。

列出本周候选纪律问题：
- 在缺失输入时的标准化处理流程（即明确返回 `INPUT_MISSING`）。
- 文件系统作用域的强硬化隔离。

列出需要继续观察的风险：
- 记录缺失后系统执行链的连贯性。
- 未知的外部干扰导致的输入记录丢失现象。

BOUNDARY_CHECK

确认没有读取宿主仓库机制：YES
确认没有读取 GitHub Actions：YES
确认没有写入 aegis-cortex 之外的文件：YES
