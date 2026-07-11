# NEXUS HARVESTER: Intelligence Dossier

DATE: 2026-06-04 00:11:17 (UTC)
TARGET_IDENTITY: langchain-ai/langchain
VERSION_ASSET: langchain-deepseek==1.1.0
SOURCE_LINK: https://github.com/langchain-ai/langchain/releases/tag/langchain-deepseek%3D%3D1.1.0

## 资产物理属性 (Asset Physical Properties)
REPOSITORY_TYPE: EXTERNAL_PACKAGE_INTELLIGENCE
PRIMARY_LANGUAGE: N/A
API_RATE_LIMIT_STATUS: BYPASSED_VIA_TOKEN

## 零熵解析矩阵 (Zero-Entropy Analysis Matrix)
DEPENDENCY_ENTROPY: EDGE_READY
ARCHITECTURE_CONFLICT: LOW
INTERNAL_LOGIC: EXTERNAL_PAYLOAD_REFERENCE_ONLY

## 威胁与兼容性评估 (Threat & Compatibility Assessment)
DIRECT_CODE_INTEGRATION: STRICTLY_PROHIBITED
HALLUCINATION_RISK: MODERATE

## 行动指令 (Action Directives)
DIRECTIVE_1: REJECT_ALL_DEPENDENCY_INJECTIONS_FROM_THIS_REPOSITORY
DIRECTIVE_2: EXTRACT_EDGE_EXECUTION_BOUNDARIES_FOR_POTENTIAL_LOCAL_DEPLOYMENT
DIRECTIVE_3: ENSURE_ANY_EXTRACTED_LOGIC_USES_PURE_PYTHON_TYPING_AND_INSPECT_SIGNATURE

## 原始载荷 (Raw Payload)

```text
Changes since langchain-deepseek==1.0.1

chore(infra): bump `langchain-tests` floor to 1.1.9 (#37610)
chore: bump idna from 3.10 to 3.15 in /libs/partners/deepseek (#37560)
ci(infra): harden Dependabot version-bound preservation (#37510)
chore: bump urllib3 from 2.6.3 to 2.7.0 in /libs/partners/deepseek (#37341)
chore: bump langchain-core from 1.3.2 to 1.3.3 in /libs/partners/deepseek (#37282)
chore: bump langsmith from 0.7.31 to 0.8.3 in /libs/partners/deepseek (#37283)
chore(docs): update x handle references (#37081)
chore(model-profiles): refresh model profile data (#37015)
chore(model-profiles): refresh model profile data (#37005)
hotfix: bump min core versions (#36996)
feat(core): add content-block-centric streaming (v2) (#36834)
ci(infra): add `pytest-xdist` to partner test groups (#36988)
chore(model-profiles): refresh model profile data (#36982)
hotfix(ci): remove nobenchmark flag (#36959)
chore(partners): standardize integration test invocation (#36958)
chore(deps): bump pytest to `9.0.3` (#36801)
chore: bump langsmith from 0.6.3 to 0.7.31 in /libs/partners/deepseek (#36787)
chore: add comment explaining `pygments>=2.20.0` (#36570)
chore(model-profiles): refresh model profile data (#36554)
chore: pygments>=2.20.0 across all packages (CVE-2026-4539) (#36385)
chore: bump requests from 2.32.5 to 2.33.0 in /libs/partners/deepseek (#36256)
chore(partners): bump `langchain-core` min to `1.2.21` (#36183)
fix(core,model-profiles): add missing `ModelProfile` fields, warn on schema drift (#36129)
ci: suppress pytest streaming output in CI (#36092)
ci: avoid unnecessary dep installs in lint targets (#36046)
chore: bump orjson from 3.11.5 to 3.11.6 in /libs/partners/deepseek (#35868)
fix(deepseek): accept `base_url` as alias for `api_base` (#35789)
feat(model-profiles): new fields + `Makefile` target (#35788)
chore(model-profiles): refresh model profile data (#35646)
fix(deepseek): use proper URL parsing for azure endpoint detection (#35455)
fix(deepseek): Tool Choice to `required` for Azure Deployment in case specific function dict is given (#34848)
fix(model-profiles): sort generated profiles by model ID for stable diffs (#35344)
fix(infra): fix trailing comma regex in profile generation script (#35333)
chore: bump model profiles (#35294)
chore(deps): bump langsmith from 0.4.31 to 0.6.3 in /libs/partners/deepseek (#35156)
feat(model-profiles): add `text_inputs` and `text_outputs` (#35084)
chore: add `make type` target (#35015)
revert: "chore: add typing target in `Makefile`" (#35013)
chore: add typing target in `Makefile` (#35012)
chore: enrich `pyproject.toml` files (#34980)
chore(deps): bump the uv group across 20 directories with 3 updates (#34941)
chore: upgrade urllib3 to 2.6.3 (#34940)
chore: update twitter URLs (#34736)
chore: ban relative imports on all packages (#34691)
fix(openai): filter function_call blocks in token counting (#34396)
release(openai): 1.1.6: update max input tokens for gpt-5 series (#34419)
release(openai): 1.1.5 (#34409)
fix(openai): rely on langchain-core for setting chunk_position (#34404)
chore: update core dep in lockfiles (#34216)
release: (integration packages): 1.1 (#34088)
feat(model-profiles): distribute data across packages (#34024)
```
