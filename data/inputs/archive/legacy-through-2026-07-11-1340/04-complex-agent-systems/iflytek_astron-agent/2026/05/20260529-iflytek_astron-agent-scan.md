# NEXUS HARVESTER: Intelligence Dossier

DATE: 2026-05-29 23:01:47 (UTC)
TARGET_IDENTITY: iflytek/astron-agent
VERSION_ASSET: Astron Agent v1.0.8
SOURCE_LINK: https://github.com/iflytek/astron-agent/releases/tag/v1.0.8

## 资产物理属性 (Asset Physical Properties)
REPOSITORY_TYPE: EXTERNAL_PACKAGE_INTELLIGENCE
PRIMARY_LANGUAGE: N/A
API_RATE_LIMIT_STATUS: BYPASSED_VIA_TOKEN

## 零熵解析矩阵 (Zero-Entropy Analysis Matrix)
DEPENDENCY_ENTROPY: BREAKING_CHANGE_AGENT_PROTOCOL
ARCHITECTURE_CONFLICT: HIGH
INTERNAL_LOGIC: EXTERNAL_PAYLOAD_REFERENCE_ONLY

## 威胁与兼容性评估 (Threat & Compatibility Assessment)
DIRECT_CODE_INTEGRATION: STRICTLY_PROHIBITED
HALLUCINATION_RISK: HIGH

## 行动指令 (Action Directives)
DIRECTIVE_1: REJECT_ALL_DEPENDENCY_INJECTIONS_FROM_THIS_REPOSITORY
DIRECTIVE_2: ANALYZE_PLUGIN_AGENT_ARCHITECTURE_FOR_CONCEPTUAL_INTEGRATION
DIRECTIVE_3: ENSURE_ANY_EXTRACTED_LOGIC_USES_PURE_PYTHON_TYPING_AND_INSPECT_SIGNATURE

## 原始载荷 (Raw Payload)

```text
This release focuses on production readiness across observability, credential management, workflow execution security, and deployment operations. It adds health checks, gateway authentication, platform account management, and several security hardening fixes.

## Highlights

### Core Capabilities
- Added health check endpoints for core services, including Agent, Workflow, Knowledge, and Memory, making container orchestration, operational checks, and incident diagnosis easier (#1358).
- Added platform account management to centralize platform-level runtime credentials and connect the Console, Knowledge, AI Tools, and plugin invocation paths (#1348).
- Added Workflow gateway authentication based on tenant application credentials (#1352).
- Added script sandbox execution for Workflow code nodes, with related node debugging and sandbox configuration support (#1333).
- Added Astron Agent website deployment support for GitHub Pages and Vercel (#1344).

### Security and Stability
- Strengthened tool-debug redirect validation to reduce SSRF risk (#1338).
- Hardened database DML execution checks to prevent SQL injection (#1340).
- Fixed bot list sort direction handling to avoid invalid query parameters affecting query stability (#1342).
- Fixed credential loading across AI Tools, Knowledge document upload, voice, and model invocation paths by moving them to platform account configuration (#1348).
- Removed an unused Agent service database dependency to simplify service startup requirements (#1358).

### Deployment and Documentation
- Updated Docker Compose, Helm, Nginx, and authenticated deployment guides with platform account, gateway authentication, and core service configuration notes (#1348, #1352).
- Aligned core router and workflow documentation to reduce integration and troubleshooting overhead (#1335).

## Upgrade Notes
- Before upgrading, review the Docker, Helm, and env example changes for platform account, AI Tools, Knowledge, and Workflow configuration.
- If your deployment relies on health checks or gateway authentication, update the related gateway, tenant, and service configuration together.

## Change Scope
- 155 files changed: 6,629 insertions and 2,304 deletions.
- Full comparison: https://github.com/iflytek/astron-agent/compare/v1.0.7...v1.0.8

```
