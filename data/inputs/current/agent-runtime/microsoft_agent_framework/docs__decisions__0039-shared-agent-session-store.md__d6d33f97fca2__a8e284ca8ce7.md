# microsoft/agent-framework · docs/decisions/0039-shared-agent-session-store.md

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [microsoft/agent-framework](https://github.com/microsoft/agent-framework) |
| 来源文件 | [docs/decisions/0039-shared-agent-session-store.md](https://github.com/microsoft/agent-framework/blob/a8e284ca8ce7c2a6b4a4641ef35e131d75a5cda3/docs/decisions/0039-shared-agent-session-store.md) |
| 来源版本 | `a8e284ca8ce7c2a6b4a4641ef35e131d75a5cda3` |
| 来源目录 Tree | `70516d8392dd4d2fc866dc441587c15b6fa6041f` |
| 来源内容 Blob | `d6d33f97fca22472db6c2b86aff1574aae693d92` |
| 摄取时间 | `2026-10-23T00:14:13.577637+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `external_doc_microsoft_agent_framework_docs_decisions_0039_shared_agent_session_store_md` |

## 本次变化

- 新增行数 `5`.
- 删除行数 `3`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- Shared AgentSessionStore abstraction
- Context and Problem Statement
- Decision Drivers
- Considered Options
- Decision Outcome
- Consequences
- More Information

<details>
<summary>展开完整外部原文</summary>

---
status: proposed
contact: rogerbarreto
date: 2026-09-01
deciders: rogerbarreto
consulted: []
informed: []
---

# Shared AgentSessionStore abstraction

## Context and Problem Statement

.NET has two public `AgentSessionStore` abstract classes. `Microsoft.Agents.AI.Hosting` defines a store
whose lookup creates a session when no value exists. `Microsoft.Agents.AI.Foundry.Hosting` defines a store
whose lookup returns `null`, accepts an explicit user partition, and provides a separate convenience method
that creates a session when needed. The types cannot be used interchangeably, so storage integrations depend
on a specific hosting protocol package instead of the core agent abstractions.

## Decision Drivers

- One storage contract must work across all hosting packages.
- Storage implementations must depend only on `Microsoft.Agents.AI.Abstractions`.
- A lookup must distinguish a missing value from a stored value without creating state as a side effect.
- The contract must support any number of isolation dimensions without privileging user identity.
- Existing Foundry storage behavior and per-user isolation must remain unchanged.

## Considered Options

1. Promote the Foundry Hosting contract to `Microsoft.Agents.AI.Abstractions`.
2. Promote the conventional Hosting contract and adapt Foundry Hosting to it.
3. Add a third contract and keep adapters for both existing contracts.
4. Represent session identity as an immutable key with arbitrary named partitions.

## Decision Outcome

Chosen option: **Promote the Foundry Hosting contract to `Microsoft.Agents.AI.Abstractions`**.

`AgentSessionStore` moves to the `Microsoft.Agents.AI` namespace and keeps the Foundry Hosting behavior:

- The abstraction and every public implementation start as experimental under diagnostic `MAAI001`.
- `GetSessionAsync` returns `AgentSession?` and returns `null` when no session is stored.
- `GetOrCreateSessionAsync` performs the explicit lookup or creation operation.
- `SaveSessionAsync`, `DeleteSessionAsync`, and both lookup methods receive an `AgentSessionStoreKey`.
- `AgentSessionStoreKey.SessionId` identifies the logical session.
- `AgentSessionStoreKey.Partitions` holds zero or more named isolation dimensions. Every partition is
  part of identity and implementations cannot ignore unknown partitions.
- Keys without partitions expose `Partitions = null`, avoiding dictionary allocations. Omitted, null,
  and empty constructor inputs all represent the same unpartitioned identity.
- Partition order does not affect identity. Physical encoding remains the responsibility of each store.
- `GetService(Type, object?)` and `GetService<TService>(object?)` retain service discovery from conventional
  Hosting. Stores can expose themselves, underlying implementations, or additional capabilities.
- `DeleteSessionAsync` is abstract, like `GetSessionAsync` and `SaveSessionAsync`, so the store remains the
  single owner of the whole session lifecycle. It removes the stored session and treats a missing session as
  a no-op. Decorators forward it, applying the same key transformation used for lookup and save.

The duplicate types in `Microsoft.Agents.AI.Hosting` and `Microsoft.Agents.AI.Foundry.Hosting` are removed.
Both packages reference the shared type directly.

`DelegatingAgentSessionStore` lives in the `Microsoft.Agents.AI` package beside `ChatClientAgent`, providing
the common decorator base without requiring a hosting-protocol package. Its service queries check the
outer instance first, then forward to the inner store. Hosting registration uses this discovery to
recognize existing isolation even when other decorators surround it, avoiding a second isolation wrapper.

The conventional Hosting implementations adopt the same behavior. `IsolationKeyScopedAgentSessionStore`
adds the value from `AgentIsolationKeyProvider` under the `isolation` partition while preserving existing
partitions. Protocol-specific hosting can add named partitions such as `user`, `tenant`, or `chat` before
loading the session. `AIHostAgent` uses `GetOrCreateSessionAsync` when it needs a ready session.

Azure Blob Storage, filesystem storage, and Foundry State Store each encode the session id and every
partition into their own collision-safe physical key. Version 1 Azure
Blob keys are not read because the package is still preview and the previous format cannot distinguish
all partition combinations safely.

Provider-specific metadata does not belong in `AgentSessionStoreKey`. For example, Foundry item tags can
be exposed by an overload or options type on `FoundryAgentSessionStore` without adding tags to Abstractions.

## Consequences

Positive:

- Storage implementations can be shared by Foundry Hosting, conventional Hosting, and future protocols.
- Missing session handling is explicit and consistent.
- Isolation dimensions are explicit, composable, and independent from any hosting protocol.
- `Microsoft.Agents.AI.Abstractions` owns the contract alongside `AIAgent` and `AgentSession`.

Negative:

- This is a source-breaking change for implementations of the preview Hosting contract.
- Callers must construct an `AgentSessionStoreKey`; unpartitioned sessions use only `SessionId`.
- Every store implementation must provide `DeleteSessionAsync`.

## More Information

- [ADR-0031](0031-hosted-per-user-session-storage-isolation.md) records the earlier Foundry-specific user partition.
- [ADR-0032](0032-dotnet-hosting-protocol-helpers.md) records the previous conventional Hosting contract.

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ d6d33f97fca22472db6c2b86aff1574aae693d92

@@ -41,7 +41,7 @@

 - The abstraction and every public implementation start as experimental under diagnostic `MAAI001`.
 - `GetSessionAsync` returns `AgentSession?` and returns `null` when no session is stored.
 - `GetOrCreateSessionAsync` performs the explicit lookup or creation operation.
-- `SaveSessionAsync` and both lookup methods receive an `AgentSessionStoreKey`.
+- `SaveSessionAsync`, `DeleteSessionAsync`, and both lookup methods receive an `AgentSessionStoreKey`.
 - `AgentSessionStoreKey.SessionId` identifies the logical session.
 - `AgentSessionStoreKey.Partitions` holds zero or more named isolation dimensions. Every partition is
   part of identity and implementations cannot ignore unknown partitions.
@@ -50,7 +50,9 @@

 - Partition order does not affect identity. Physical encoding remains the responsibility of each store.
 - `GetService(Type, object?)` and `GetService<TService>(object?)` retain service discovery from conventional
   Hosting. Stores can expose themselves, underlying implementations, or additional capabilities.
-- `DeleteSessionAsync` is not part of the shared contract.
+- `DeleteSessionAsync` is abstract, like `GetSessionAsync` and `SaveSessionAsync`, so the store remains the
+  single owner of the whole session lifecycle. It removes the stored session and treats a missing session as
+  a no-op. Decorators forward it, applying the same key transformation used for lookup and save.
 
 The duplicate types in `Microsoft.Agents.AI.Hosting` and `Microsoft.Agents.AI.Foundry.Hosting` are removed.
 Both packages reference the shared type directly.
@@ -86,7 +88,7 @@

 
 - This is a source-breaking change for implementations of the preview Hosting contract.
 - Callers must construct an `AgentSessionStoreKey`; unpartitioned sessions use only `SessionId`.
-- Consumers that need deletion must use a storage-specific API until a separate shared deletion capability is defined.
+- Every store implementation must provide `DeleteSessionAsync`.
 
 ## More Information
```

</details>
