# microsoft/agent-framework · docs/decisions/README.md

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [microsoft/agent-framework](https://github.com/microsoft/agent-framework) |
| 来源文件 | [docs/decisions/README.md](https://github.com/microsoft/agent-framework/blob/55c48a7089dde103d2ec7bc3c9d16412989fe2e7/docs/decisions/README.md) |
| 来源版本 | `55c48a7089dde103d2ec7bc3c9d16412989fe2e7` |
| 摄取时间 | `2026-07-11T06:08:59.335390+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_microsoft_agent_framework_docs_decisions_readme_md_55c48a7089dd` |

## 本次变化

- 新增行数 `24`.
- 删除行数 `0`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- Architectural Decision Records (ADRs)
- How are we using ADRs to track technical decisions?

<details>
<summary>展开完整外部原文</summary>

# Architectural Decision Records (ADRs)

An Architectural Decision (AD) is a justified software design choice that addresses a functional or non-functional requirement that is architecturally significant. An Architectural Decision Record (ADR) captures a single AD and its rationale.

For more information [see](https://adr.github.io/)

## How are we using ADRs to track technical decisions?

1. Copy docs/decisions/adr-template.md to docs/decisions/NNNN-title-with-dashes.md, where NNNN indicates the next number in sequence.
    1. Check for existing PR's to make sure you use the correct sequence number.
    2. There is also a short form template docs/decisions/adr-short-template.md
2. Edit NNNN-title-with-dashes.md.
    1. Status must initially be `proposed`
    2. List of `deciders` must include the github ids of the people who will sign off on the decision.
    3. The relevant EM and architect must be listed as deciders or informed of all decisions.
    4. You should list the names or github ids of all partners who were consulted as part of the decision.
    5. Keep the list of `deciders` short. You can also list people who were `consulted` or `informed` about the decision.
3. For each option list the good, neutral and bad aspects of each considered alternative.
    1. Detailed investigations can be included in the `More Information` section inline or as links to external documents.
4. Share your PR with the deciders and other interested parties.
   1. Deciders must be listed as required reviewers.
   2. The status must be updated to `accepted` once a decision is agreed and the date must also be updated.
   3. Approval of the decision is captured using PR approval.
5. Decisions can be changed later and superseded by a new ADR. In this case it is useful to record any negative outcomes in the original ADR.

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ 55c48a7089dde103d2ec7bc3c9d16412989fe2e7

@@ -0,0 +1,24 @@

+# Architectural Decision Records (ADRs)
+
+An Architectural Decision (AD) is a justified software design choice that addresses a functional or non-functional requirement that is architecturally significant. An Architectural Decision Record (ADR) captures a single AD and its rationale.
+
+For more information [see](https://adr.github.io/)
+
+## How are we using ADRs to track technical decisions?
+
+1. Copy docs/decisions/adr-template.md to docs/decisions/NNNN-title-with-dashes.md, where NNNN indicates the next number in sequence.
+    1. Check for existing PR's to make sure you use the correct sequence number.
+    2. There is also a short form template docs/decisions/adr-short-template.md
+2. Edit NNNN-title-with-dashes.md.
+    1. Status must initially be `proposed`
+    2. List of `deciders` must include the github ids of the people who will sign off on the decision.
+    3. The relevant EM and architect must be listed as deciders or informed of all decisions.
+    4. You should list the names or github ids of all partners who were consulted as part of the decision.
+    5. Keep the list of `deciders` short. You can also list people who were `consulted` or `informed` about the decision.
+3. For each option list the good, neutral and bad aspects of each considered alternative.
+    1. Detailed investigations can be included in the `More Information` section inline or as links to external documents.
+4. Share your PR with the deciders and other interested parties.
+   1. Deciders must be listed as required reviewers.
+   2. The status must be updated to `accepted` once a decision is agreed and the date must also be updated.
+   3. Approval of the decision is captured using PR approval.
+5. Decisions can be changed later and superseded by a new ADR. In this case it is useful to record any negative outcomes in the original ADR.
```

</details>
