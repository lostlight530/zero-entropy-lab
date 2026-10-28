# Azure Copy Blob post-merge semantic correction

Record Type: POST_MERGE_CORRECTION
Original logical date: 2026-10-28 Asia/Shanghai
Correction actual UTC: 2026-10-28T05:30:16.082Z
Original research: [Daily](../records/2026-10-28.md)
Original merge: https://github.com/lostlight530/zero-entropy-lab/pull/736
Original reviewed head: `4799bd0ff603e495dbfd7a11e936a11052e9c076`
Original merge commit: `49d12847a96fcb5767a222fe3b9ebbbbbb07ce62`
Correction base main: `6ee64d5fdc3cba60f1741c320c9f3eb8c5a0c881`

## 可证伪的缺陷及原始观测

已合并旧版 producer 与 verifier 在 V8 中实际对抗回放，共同将以下 10 个负向突变判为 `COMPLETE` 或 `RETRY_ALLOWED`

- prior query 于 protected read、guard 或 commit 之后才发生，却被当成此前 completion 的历史证据
- copy sourceChanged 为 null 或字符串 false，而不是权威确认的布尔 false
- copy status success 但 authority 为 authoritative_failed、unknown 或 null
- 在重试路径上 prior authoritative miss 查询发生于 protected read 或 commit 之后，旧 reference 错误允许 retry

## 纠正与复验

原始 [46/138 Daily](../records/2026-10-28.md)、[old producer](../tools/experiment_azure_copy_integrity.js)、[old verifier](../tools/verify_azure_copy_integrity.js) 和既有 pack/CSV/receipt 不变，使用独立附录保存修正后的 [producer](../tools/experiment_azure_copy_integrity_corrected.js)、[verifier](../tools/verify_azure_copy_integrity_corrected.js)、[primitive delta pack](../evidence/2026-10-28-azure-copy-correction-scenarios.json)、[decision CSV](../evidence/2026-10-28-azure-copy-correction-decisions.csv) 与 [V8 verification receipt](../evidence/2026-10-28-azure-copy-correction-verification.json)

- Corrected prior evidence scope 额外要求 `prior.query.at <= current.readAt`，这是 synthetic time-domain 保守顺序要求，不是可信跨服务时钟
- 通过 `sourceChanged === false` 才确认 source 未改变，禁止 null 与字符串被解释为安全
- Copy success path 要求 `copy.authority === completed`，不以 status 字段替代终态权威证据
- Original producer pack 与持久化原始 pack 完全一致，原 CSV byte-exact，全部 46 条原参考决策保持原样
- Actual corrected V8 producer: 56 synthetic scenarios、168 decisions，54 个非 COMPLETE controls，56 exact probes，168/168 verifier reconstruction
- 10/10 新对抗突变经旧 producer/verifier 复现 unsafe label，经修正版 producer/verifier 全部得到 STOP_UNKNOWN 或 RECONCILE

## 执行范围及证据边界

EXECUTED: old/new persisted-source V8 isolate replay、original pack/CSV comparison、10/10 mutated scenarios、corrected standalone verifier model reconstruction

NOT_EXECUTED: native Node CLI、complete Python checker、live Azure Storage、external effect sink、independent historical authority、semantic-independent verifier

Verifier independence 仍为 implementation PARTIAL、data source NONE、semantic contract SHARED、authority NONE，因此不是实际 Azure 正确率或生产 effect-set completion 证明

新更正只修模型现有合同内的已观测漏洞，未穷尽 source/destination authority 依赖、跨系统时间证明或 TOCTOU

## Credit 与保真

Daily 0、new research window 0、CASE 0、NOTES 0、Special 0、Audit 0

原有 2026-10-28 NATIVE Daily、原始合成实验执行事实、原有未执行项和 PR 合并事实均保留，不作追溯覆盖
