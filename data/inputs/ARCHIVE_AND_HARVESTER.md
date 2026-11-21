# 外部摄取与归档契约

## 目标

本契约约束外部文档摄取、当前快照、历史归档、机器账本和人类阅读稿之间的关系.

系统优先保证证据完整、结果确定、格式可读和失败可见.

## 数据分层

| 路径 | 职责 | 修改规则 |
| --- | --- | --- |
| `current/` | 每个来源路径唯一的当前有效快照 | 新版本替换后将旧版本迁入 archive |
| `archive/` | 失效快照和历史输入 | 只追加，不覆盖，不删除 |
| `.raw_cache/` | 计算下一次 Diff 的原文基线 | 仅清理状态未引用的孤立缓存 |
| `.harvester_state.json` | 来源 SHA、内容哈希和相对输出路径 | 原子写入，禁止保存 Runner 绝对路径 |
| `data/knowledge/**/*.jsonl` | 可回放事实账本 | 逐行校验、稳定排序、确定性去重 |
| `data/cortex.db` | 可重建查询索引 | 可以重建和压缩，不作为唯一事实源 |

## 有界活动证据与迁移

- Profile 路径通配只允许 `.md`、`.mdx`、`.markdown`、`.rst`、`.txt`、`.py` 和 `.ipynb` 文本候选，JPG、PDF 等二进制文件不得进入活动快照.
- 候选 Blob 必须严格解码 UTF-8 并拒绝 NUL 字节，不以替换字符伪装不可读来源.
- 原文超过 65,536 字节时，current 只保留来源 Commit、Tree、Blob、规范内容 SHA-256、规模与有界 Diff 预览.
- 原有完整 current 在替换前原样移入只追加 archive，既有 archive 不覆盖、不删除、不重新摄取.
- apply 在投影前重新验证活动路径类型、快照存在性、内容哈希、来源身份与 196,608 字节上限，失败时停止写回.

## 人类阅读格式

当前快照必须依次提供一眼看懂、本次变化、阅读导航、折叠原文和折叠 Diff.

本体系拥有的中文说明只使用英文句号.

外部原文保持来源原貌，不修改其语言、标点和内容.

## 失败协议

Profile 不合法、GitHub Tree 截断、Blob 编码异常、来源网络失败、JSONL 非法或报告格式违规时，Action 必须失败.

不得吞掉失败后继续生成成功提交.

不得通过全局选择冲突一侧掩盖并发变更.

## 独立维护边界

`aegis-cortex/**` 是独立研究维护输出并由人类审核 PR.

本生命周期不格式化、不清理、不自动改写该目录.

## GitHub Actions 生命周期

本生命周期是确定性仓库维护程序，不是 Agent，也不代替独立外部维护或辅助维护体系.

- Push 与 Pull Request 只执行只读校验，不摄取、不生成、不提交.
- 手动运行默认只读，只有明确选择 apply 才进入候选生成链.
- 每日计划运行以北京时间 06:00 对应的名义时隙作为 Logical Cycle Time，Runner 延迟不改变周期身份.
- Source Time、Observed Time、Logical Cycle Time 与 Applied Time 分开记录，不用执行时间冒充来源时间.
- 同一基础提交、逻辑周期、候选路径、语义增量和指标快照生成同一 Idempotency Key.
- 上游仓库只变更 commit 或 tree 而目标 Blob 内容未变时，不改写活动采集状态.
- 运行期间 main 发生变化时，不 rebase、不 autostash、不覆盖，结果记为 `CONFLICTED_WORLD_LINE_NO_APPLY`.
- 没有有效候选时保持绿色并记为 `NO_MEANINGFUL_DELTA`.
- 来源内容增量、知识增量、投影增量与哈希链派生改写分别计数，不把哈希级联冒充新知识.
- Lifecycle Manifest 作为运行 Artifact 与 Job Summary 保存，不写入活动账本或哈希链.
- Action 提交固定使用 `github-actions[bot]` 身份.

结构校验失败、账本破损、哈希链断裂、越界写入和测试失败仍然必须红灯终止.

安全的无变化与并发避让不是失败，不建立 Branch Protection、Required Check、Environment 或强制 Review 门禁.

## Active ledger maintenance

- current/ is the only external snapshot set projected into the active graph.
- External repository and document identifiers are stable across source revisions.
- Original ledgers are preserved byte for byte under knowledge/archive/pre-canonical-2026-07-13/.
- The archive manifest records relative path, byte size, SHA-256 and line count.
- Active ledgers contain one record per entity ID and one record per relation triple.
- Relations with missing endpoints remain available in the sealed archive and do not enter the active graph.
- Repeating the same lifecycle does not append an equivalent entity or relation.
- Cache cleanup is limited to unreferenced raw-cache files and empty cache directories.
- The active database is a rebuildable index and is never the sole source of truth.
- aegis-cortex and ballast remain outside this lifecycle.

## NEXUS GitHub Actions 产物目录与清理边界 (2026-11-21 correction)

- `data/memories/` 是 lifecycle 真实允许回写 Git 的 projection / report 目录, 不在 `.github/workflows/`. 当前 `evolve` 会生成 Cognitive Report 和 `MISSION_ACTIVE.md`; `nexus.py clean` 另有 Graph Validation 报告, 不能据此推断计划任务每日执行了 `clean`.
- `data/knowledge/` 是规范化事实与哈希链的持久层; `data/inputs/current/` 和 `archive/` 分别是活动外部来源与历史封存. 这些不是 disposable cache, 不能因目录体积或文件数量大而批量清理.
- `__pycache__/`, `.pytest_cache/`, 不再被引用的 `.raw_cache/` 孤立对象, `*.tmp`, `*.db-wal` 和可重建 SQLite 索引属于清理候选, 但必须先确认 Git 跟踪与当前运行使用情况, 禁止清除含活跃写入的数据库旁路文件.
- `$RUNNER_TEMP/lifecycle-manifest.json` 是 Runner 中的临时清单; 上传 Artifact、`$GITHUB_STEP_SUMMARY` 和 GitHub Actions Job Logs 存在独立托管存储面, 不在 Git Tree 的 `data/memories/` 内.
- 原始历史报告、PR、哈希链与 `AGI/workflows/revisions/` 的版本快照保留, 真实纠错以前向 correction/reconciliation 表达, 不能把旧失败或日期状态静默删改.
- 本生命周期不接管 Aegis / Ballast 的原生科研证据, 也不得把这些研究目录当作可清理的生成日志.

## 本仓可执行物理清理验收 (2026-11-21)

- 旧版 `nexus.py clean/evolve` 对整个 `c.project_root` 扫描并删除 Python 缓存, 可能触及 `aegis-cortex/`, `ballast/`, `AGI/` 等独立研究 owner. 本次修复改为正向白名单, 仅清理 `src/kernel/` 与 `tests/` 内的 Python bytecode 和标准工具缓存目录.
- `test_cortex.db`, `data/cortex.db` 和 SQLite sidecar **不因文件名匹配就自动删除**, 避免进程仍在使用或来源责任不明时发生数据破坏. 现有的图校验与 canonical ledger 处理仍由独立逻辑负责, 不能把 `nexus.py clean` 描述成纯缓存删除或科学验收.
- 清理器不得跟随 symlink, 不扫描 `data/`, `aegis-cortex/`, `ballast/`, `AGI/` 或 `historical-audits/`. `tests/test_kernel_cache_cleanup.py` 在独立临时树中断言 protected 字节不变、目录越界不可达和幂等性.
- 历史 archive、已跟踪报告、哈希链与科研原生产物继续按来源治理保留. 若后续需要物理收缩, 必须另行附确切对象、完整校验、引用审计和人类审批, 不继承本次代码维护权限.

## NEXUS 文件分类与导航 (2026-11-21)

本节仅解释 Zero **现有** `data/` 持久状态与 `src/kernel/` 执行器的职责, 不在 `data/` 新建第二套文档或 Memory Archive. 路径、容量和文件数的冻结基线见 [2026-11-21 data reconciliation](../../historical-audits/2026-11/2026-11-21-nexus-brain-data-archive-reconciliation.md), 不将历史观察数写成当前实时状态.

| 分类 | 当前文件与入口 | 责任 / 时间语义 | 整理边界 |
| --- | --- | --- | --- |
| 当前文档权威与解释边界 | [仓库 README](../../README.md), [docs/README](../../docs/README.md), [Zero Constitution](../../docs/brain/zero-entropy-constitution.md) | 文档与架构意图, 不直接证明执行能力 | 不把历史观念或图示覆盖当前代码、测试与运行证据 |
| Runtime 与所有权 | [src/kernel/protocol/nexus.py](../../src/kernel/protocol/nexus.py), [sensory/harvester.py](../../src/kernel/sensory/harvester.py) | Kernel 运行器和来源摄取器, 与 Aegis、Ballast 独立 | 禁止以 kernel 清理为由扫描整个仓库或重写研究目录 |
| 来源登记与 State | [source_profiles.json](source_profiles.json), [.harvester_state.json](.harvester_state.json) | 外部 ID、Commit/Tree/Blob、输出引用及摄取历史 | 不能删除不可达来源的旧 State 以制造绿色运行结果 |
| 当前来源 | [inputs/current/](current/) | 经过状态引用和有界验证的当前来源快照 | 只能由受控 Harvester 更新, 失败保留未知和历史 |
| 历史来源 | [inputs/archive/](archive/) | 旧来源快照、legacy-through 基线及早期原样包装件 | 包含历史 JPG/PDF 标识的 `*.md` 仍是封存来源, 不是当前允许摄取的二进制输入; 不能当垃圾删除 |
| 过时合同副本 | [2026/07 旧版 Archive 文档](archive/2026/07/ARCHIVE_AND_HARVESTER.md) | 归档于 2026/07 的历史文本, 不能替代此文件的当前合同 | 不升级、不原地覆盖, 出现不一致时以明确的时间点作 reconciliation |
| Canonical Knowledge | [knowledge/entities/](../knowledge/entities/), [knowledge/relations/](../knowledge/relations/) | 活动 JSONL 和 hash-chain 派生状态 | 只从活动账本重建, 不把哈希派生变化计为来源增量 |
| Sealed Knowledge | [pre-canonical manifest](../knowledge/archive/pre-canonical-2026-07-13/manifest.json) | 旧 JSONL 原始文件与完整性校验清单 | Manifest 与封存字节不可静默覆写 |
| Memory 运行投影 | [memories/](../memories/) | `*-cognitive-report.md`, `*-graph-validation.md`, `*-daily-audit.md`, 历史 Weekly/Monthly 及 `MISSION_ACTIVE.md` | 不同产物可能来自不同命令/历史生产者; 文件日期不证明相应 Actions 步骤实际执行 |
| 可重建数据库与临时缓存 | `data/cortex.db`, `inputs/.raw_cache/`, Kernel Python caches | SQLite 可重建但可能被进程持有, raw cache 有状态引用 | 不凭扩展名自动删数据库/sidecar; Kernel 清理器只进入 `src/kernel/` 和 `tests/` |
| Workflow 运行证据 | [NEXUS workflow](../../.github/workflows/nexus-life-cycle.yml), [lifecycle guard](../../src/kernel/orchestration/lifecycle_guard.py), [archive custody tests](../../tests/test_nexus_archive_custody.py) | Job Summary、Run Logs、Runner 临时文件和上传 Artifact 不在同一物理平面 | `PASS` 只绑定该 revision 和测试范围, production apply 需独立收据 |
| 有日期的核验 / 纠错 | [2026-11-21 reconciliation](../../historical-audits/2026-11/2026-11-21-nexus-brain-data-archive-reconciliation.md), [kernel cleanup tests](../../tests/test_kernel_cache_cleanup.py) | 当前治理差异、证据缺口和代码约束的前向记录 | 不计为新 Native、A1/A2 或 Periodic, 不修改独立 Aegis/Ballast |

### 文件名与分类的优先级

- `data/` 是持久状态而非通用文档目录; `docs/` 存放规范与解释, `src/kernel/` 决定当前执行行为. 同名 `README.md`、`ARCHIVE_AND_HARVESTER.md` 在历史归档里可能有不同时间身份.
- `inputs/archive/` 中可观察到的大文件和多版本 CHANGELOG 属于保留的来源链. 它们不是 `.github/workflows/` 下的 Runner 日志, 也不是需要重命名的本仓说明文档.
- `memories/` 相同内容的历史日期文件不具备自动去重删除资格, `nexus.py clean` 生成的 Graph Validation 不能被误写成定时生命周期已执行了 `clean`.
- 当前来源不可访问属于外部观察失败, 不得偷偷使用另一个来源改写原身份. GitHub PR 的只读 CI 不验证未来的 scheduled apply.
