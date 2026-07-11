PROVENANCE: {"confidence": 1.0, "entity_id": "doc_microsoft_agent_framework_docs_decisions_readme_md_55c48a7089dd", "primary_owner": "zero", "retrieved_at": "2026-07-11T06:08:59.335390+00:00", "source_path": "docs/decisions/README.md", "source_repo": "microsoft/agent-framework", "source_sha": "55c48a7089dde103d2ec7bc3c9d16412989fe2e7"}

# Source Document

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


# Document Diff

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
