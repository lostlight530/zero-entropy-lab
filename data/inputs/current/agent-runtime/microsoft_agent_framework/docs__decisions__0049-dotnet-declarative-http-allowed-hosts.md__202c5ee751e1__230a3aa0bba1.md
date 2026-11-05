# microsoft/agent-framework · docs/decisions/0049-dotnet-declarative-http-allowed-hosts.md

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [microsoft/agent-framework](https://github.com/microsoft/agent-framework) |
| 来源文件 | [docs/decisions/0049-dotnet-declarative-http-allowed-hosts.md](https://github.com/microsoft/agent-framework/blob/230a3aa0bba19b6bf5a7b4f427bcb25cb16c7105/docs/decisions/0049-dotnet-declarative-http-allowed-hosts.md) |
| 来源版本 | `230a3aa0bba19b6bf5a7b4f427bcb25cb16c7105` |
| 来源目录 Tree | `feed38caa121f5471897d40b790c65eb73befdf9` |
| 来源内容 Blob | `202c5ee751e1d7776e115f374d0a5173283bb51f` |
| 摄取时间 | `2026-11-05T01:52:58.108560+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `external_doc_microsoft_agent_framework_docs_decisions_0049_dotnet_declarative_http_allowed_hosts_md` |

## 本次变化

- 新增行数 `73`.
- 删除行数 `0`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- Explicit allowed hosts for declarative HTTP requests
- Context and Problem Statement
- Decision Drivers
- Considered Options
- Permit any HTTP(S) destination
- Classify resolved addresses as public or non-public
- Require an application-owned host allowlist
- Decision Outcome

<details>
<summary>展开完整外部原文</summary>

---
status: proposed
contact: baywet
date: 2026-10-29
deciders: westey-m
---

# Explicit allowed hosts for declarative HTTP requests

## Context and Problem Statement

Declarative HTTP actions receive their destination URLs from workflow content. The application running a
workflow knows which services it intends to contact, while network addressing, DNS, and proxy configuration
vary across deployments. How should the default HTTP handler determine which destinations are authorized?

## Decision Drivers

- Require explicit application authorization before any HTTP request or handler-factory invocation.
- Support intentionally configured internal services without classifying deployment-specific networks.
- Preserve explicit redirect, header, and timeout handling with application-managed transport lifetime.
- Apply the same host-and-port policy across all supported target frameworks and client sources.

## Considered Options

### Permit any HTTP(S) destination

Good: no application migration is required.
Bad: workflow URLs alone determine the available destinations.

### Classify resolved addresses as public or non-public

Good: rejects common local address ranges without application configuration.
Bad: public addressing does not express application authorization, deployment routing varies, and the handler
must maintain address rules and connection-time resolution logic across target frameworks.

### Require an application-owned host allowlist

Good: the application explicitly defines its destinations, including internal services, without address
classification or custom DNS resolution.
Bad: existing applications must configure their hosts, and allowing a hostname trusts its DNS and routing.

## Decision Outcome

Chosen option: "Require an application-owned host allowlist".

The constructor requires an explicit list; an empty list denies every request. It accepts exact host names
or IP literals with optional ports, copies and normalizes the list, and authorizes the canonical URL before
handler selection and every redirect. Matching is case-insensitive with IDN and trailing-dot normalization; wildcards and
implicit subdomains are not supported. Entries authorize exact host-and-port pairs; an omitted port defaults
to 443. Explicit ports must be from 1 to 65535, and IPv6 literals must be bracketed when specifying a port.
The request's effective port must match, including on redirects. Entries do not restrict schemes or IP ranges:
both HTTP and HTTPS remain supported, so an entry for port 443 also permits an HTTP URL explicitly using port 443.
Applications that require HTTPS must enforce that additional policy before supplying an authenticated client.
Only HTTP(S) URLs are accepted, and existing redirect restrictions remain in effect. Workflow-supplied Host
headers are rejected before client selection; the transport derives the authority from the allowed URL.

The application supplies an `IHttpMessageHandlerFactory`, normally registered by `AddHttpClient`, and a named
pipeline. The handler inspects the pipeline before each send and requires an `HttpClientHandler`, or on .NET
a `SocketsHttpHandler`, with automatic redirects and cookies disabled. Unknown primary transports and
incomplete pipelines are rejected before sending. Factory defaults with automatic redirects enabled are
rejected rather than silently reconfigured. Application-owned delegating handlers are trusted code: they
must preserve the validated destination and must not follow redirects themselves.

The transport handles normal DNS resolution, proxies, and routing. The factory pools and owns the handler
pipeline; the default HTTP handler creates and disposes a client per hop without disposing pooled handlers.
`IHttpClientFactory` client configuration, such as default headers, timeout, and base address, does not apply.
Configure headers and origin-bound authentication in delegating handlers, and configure proxies and other
transport settings on the primary handler. Per-request timeouts remain controlled by the workflow request.

This is a breaking API and behavioral change: the parameterless, client-only, and provider-only constructors
and disposal method are removed. Callers must supply an allowlist and an application-owned message-handler
factory at construction. The HTTP sample and integration caller configure their intended hosts and
transport settings explicitly.

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ 202c5ee751e1d7776e115f374d0a5173283bb51f

@@ -0,0 +1,73 @@

+---
+status: proposed
+contact: baywet
+date: 2026-10-29
+deciders: westey-m
+---
+
+# Explicit allowed hosts for declarative HTTP requests
+
+## Context and Problem Statement
+
+Declarative HTTP actions receive their destination URLs from workflow content. The application running a
+workflow knows which services it intends to contact, while network addressing, DNS, and proxy configuration
+vary across deployments. How should the default HTTP handler determine which destinations are authorized?
+
+## Decision Drivers
+
+- Require explicit application authorization before any HTTP request or handler-factory invocation.
+- Support intentionally configured internal services without classifying deployment-specific networks.
+- Preserve explicit redirect, header, and timeout handling with application-managed transport lifetime.
+- Apply the same host-and-port policy across all supported target frameworks and client sources.
+
+## Considered Options
+
+### Permit any HTTP(S) destination
+
+Good: no application migration is required.
+Bad: workflow URLs alone determine the available destinations.
+
+### Classify resolved addresses as public or non-public
+
+Good: rejects common local address ranges without application configuration.
+Bad: public addressing does not express application authorization, deployment routing varies, and the handler
+must maintain address rules and connection-time resolution logic across target frameworks.
+
+### Require an application-owned host allowlist
+
+Good: the application explicitly defines its destinations, including internal services, without address
+classification or custom DNS resolution.
+Bad: existing applications must configure their hosts, and allowing a hostname trusts its DNS and routing.
+
+## Decision Outcome
+
+Chosen option: "Require an application-owned host allowlist".
+
+The constructor requires an explicit list; an empty list denies every request. It accepts exact host names
+or IP literals with optional ports, copies and normalizes the list, and authorizes the canonical URL before
+handler selection and every redirect. Matching is case-insensitive with IDN and trailing-dot normalization; wildcards and
+implicit subdomains are not supported. Entries authorize exact host-and-port pairs; an omitted port defaults
+to 443. Explicit ports must be from 1 to 65535, and IPv6 literals must be bracketed when specifying a port.
+The request's effective port must match, including on redirects. Entries do not restrict schemes or IP ranges:
+both HTTP and HTTPS remain supported, so an entry for port 443 also permits an HTTP URL explicitly using port 443.
+Applications that require HTTPS must enforce that additional policy before supplying an authenticated client.
+Only HTTP(S) URLs are accepted, and existing redirect restrictions remain in effect. Workflow-supplied Host
+headers are rejected before client selection; the transport derives the authority from the allowed URL.
+
+The application supplies an `IHttpMessageHandlerFactory`, normally registered by `AddHttpClient`, and a named
+pipeline. The handler inspects the pipeline before each send and requires an `HttpClientHandler`, or on .NET
+a `SocketsHttpHandler`, with automatic redirects and cookies disabled. Unknown primary transports and
+incomplete pipelines are rejected before sending. Factory defaults with automatic redirects enabled are
+rejected rather than silently reconfigured. Application-owned delegating handlers are trusted code: they
+must preserve the validated destination and must not follow redirects themselves.
+
+The transport handles normal DNS resolution, proxies, and routing. The factory pools and owns the handler
+pipeline; the default HTTP handler creates and disposes a client per hop without disposing pooled handlers.
+`IHttpClientFactory` client configuration, such as default headers, timeout, and base address, does not apply.
+Configure headers and origin-bound authentication in delegating handlers, and configure proxies and other
+transport settings on the primary handler. Per-request timeouts remain controlled by the workflow request.
+
+This is a breaking API and behavioral change: the parameterless, client-only, and provider-only constructors
+and disposal method are removed. Callers must supply an allowlist and an application-owned message-handler
+factory at construction. The HTTP sample and integration caller configure their intended hosts and
+transport settings explicitly.
```

</details>
