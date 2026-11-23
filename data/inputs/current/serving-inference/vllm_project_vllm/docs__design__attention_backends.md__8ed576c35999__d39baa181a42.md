# vllm-project/vllm · docs/design/attention_backends.md

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [vllm-project/vllm](https://github.com/vllm-project/vllm) |
| 来源文件 | [docs/design/attention_backends.md](https://github.com/vllm-project/vllm/blob/d39baa181a42e310d6823f5b909b052e69ddabda/docs/design/attention_backends.md) |
| 来源版本 | `d39baa181a42e310d6823f5b909b052e69ddabda` |
| 来源目录 Tree | `49ebe9b28eded31c7ccc4ea435afbe098b095122` |
| 来源内容 Blob | `8ed576c35999bca5e24622eb2c1965ad9426fd67` |
| 摄取时间 | `2026-11-23T02:03:28.153294+00:00` |
| 归属层 | `serving-inference` |
| 可信度 | `1.0` |
| 记忆实体 | `external_doc_vllm_project_vllm_docs_design_attention_backends_md` |

## 本次变化

- 新增行数 `19`.
- 删除行数 `0`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- Attention Backend Feature Support
- Setting the Attention Backend
- Command Line
- Dot notation
- JSON format
- Python API
- Method 1: Using AttentionConfig with enum
- Method 2: Using attention_backend parameter with string
- Backend Selection Behavior
- Triton/FlashAttention Composite
- Triton/FlashInfer Composite
- Manual Selection
- Automatic Selection
- Backend Priority (CUDA)
- Standard Attention (MHA, MQA, GQA)
- MLA Attention (DeepSeek-style)
- Legend
- Standard Attention (MHA, MQA, GQA) Backends
- b12x
- ROCM_AITER_FA GQA decode kernel
- MiniMax M3 Sparse Attention Backends
- MLA (Multi-head Latent Attention) Backends
- Prefill Backends
- Decode Backends

<details>
<summary>展开完整外部原文</summary>

# Attention Backend Feature Support

The priority and feature tables on this page are auto-generated from the
attention backend registry by
`docs/mkdocs/gen_files/generate_attention_backends.py`, based on the checks in
`AttentionBackend.validate_configuration()`.

## Setting the Attention Backend

### Command Line

There are two ways to specify the backend from the command line:

**Option 1: Using `--attention-backend` (simple)**

```bash
vllm serve <model> --attention-backend FLASH_ATTN
```

**Option 2: Using `--attention-config.backend` / `-ac.backend` (structured config)**

```bash
# Dot notation
vllm serve <model> --attention-config.backend FLASH_ATTN
vllm serve <model> -ac.backend FLASH_ATTN

# JSON format
vllm serve <model> --attention-config '{"backend": "FLASH_ATTN"}'
vllm serve <model> -ac '{"backend": "FLASH_ATTN"}'
```

> **Note:** `--attention-backend` and `--attention-config.backend` are mutually
> exclusive. Use one or the other, not both.

### Python API

Use `AttentionConfig` with the `LLM` class:

```python
from vllm import LLM
from vllm.config import AttentionConfig
from vllm.v1.attention.backends.registry import AttentionBackendEnum

# Method 1: Using AttentionConfig with enum
llm = LLM(
    model="Qwen/Qwen3-0.6B",
    attention_config=AttentionConfig(backend=AttentionBackendEnum.FLASH_ATTN),
)

# Method 2: Using attention_backend parameter with string
llm = LLM(
    model="Qwen/Qwen3-0.6B",
    attention_backend="FLASH_ATTN",
)
```

## Backend Selection Behavior

### Triton/FlashAttention Composite

On Hopper, `TRITON_FLASH_ATTN` is preferred for compatible multimodal-prefix
configurations. It uses Triton when the current queries need bidirectional
image attention and FlashAttention for causal text prefills and decode, with a
shared KV cache. The causal child must resolve to FA4. This happens
automatically for FA4-only shapes such as head size 512 and models whose
version policy promotes all layers to FA4, including Gemma 4. A standalone
head-size-256 configuration whose version policy selects FA3 falls back to
Triton for the whole layer.

No attention override is needed for supported multimodal models:

```bash
vllm serve google/gemma-4-31B-it
```

### Triton/FlashInfer Composite

On Blackwell, `TRITON_FLASHINFER` is preferred for compatible
multimodal-prefix configurations, including Gemma 4 with BF16 or FP8 KV cache. It uses
Triton when a batch's current queries require bidirectional image attention,
and FlashInfer for causal text prefills and decode. Historical image tokens
alone do not select Triton.

This instantiates `create_composite_attention_backend` from
`vllm/v1/attention/backends/composite.py` with Triton,
FlashInfer, and `MMPrefixAttentionRouting`. The reusable factory owns child
implementations, metadata dispatch, compatible cache requirements, and workspace
sharing. The routing policy selects the child and defines graph-capture safety.
Other combinations can reuse the same machinery.

The backend supports head dimensions 256/512, FP16/BF16 and FP8 KV cache,
and 64-token kernel pages with a head-major cache layout. TRTLLM handles causal
attention at both head dimensions; its hdim512 kernels do not support 128-token
pages.
For Gemma 4, full CUDA graphs cover single-token batches; multi-token batches
use the non-full-graph execution path. Models whose image masks extend beyond
the sliding window cannot use full attention graphs with this composite.
Context parallelism, R-SWA, attention sinks,
and adaptive verification are not supported by this composite.

It can also be selected explicitly:

```bash
vllm serve google/gemma-4-31B-it \
    --attention-backend TRITON_FLASHINFER
```

### Manual Selection

When you explicitly set a backend via `--attention-backend` or `AttentionConfig`:

1. The backend is **validated** against your configuration (model dtype, head
   size, compute capability, etc.)
2. If the backend **doesn't support** your configuration, an error is raised
   with the specific reason
3. If valid, the backend is used

Example error when selecting an incompatible backend:

```text
ValueError: Selected backend FLASHMLA is not valid for this configuration.
Reason: ['compute capability not supported']
```

### Automatic Selection

When no backend is specified (the default):

1. vLLM iterates through backends in **priority order** (see tables below)
2. Each backend is validated against your configuration
3. The **first compatible backend** is selected
4. If no backend is compatible, an error is raised listing all backends and
   their incompatibility reasons

## Backend Priority (CUDA)

When no backend is explicitly selected, vLLM chooses the first
compatible backend from these priority-ordered lists.

Priority is **1 = highest** (tried first).

### Standard Attention (MHA, MQA, GQA)

--8<-- "gen:priority-standard"

### MLA Attention (DeepSeek-style)

--8<-- "gen:priority-mla"

> **\*** For sparse MLA, FP8 KV cache always prefers `FLASHINFER_MLA_SPARSE`. With BF16 KV cache, `FLASH_ATTN_MLA_SPARSE_FA4` (then `FLASHINFER_MLA_SPARSE`) is preferred for low query-head counts (<= 16) on SM 10.x, while `FLASHMLA_SPARSE` is preferred otherwise.
>
> **Note:** ROCm and CPU platforms have their own selection logic. See the platform-specific documentation for details.

## Legend

| Column | Description |
| ------ | ----------- |
| **Dtypes** | Supported model data types (fp16, bf16, fp32) |
| **KV Dtypes** | Supported KV cache data types (`auto`, `fp8`, `fp8_e4m3`, etc.) |
| **Block Sizes** | Supported KV cache block sizes (%N means multiples of N) |
| **Head Sizes** | Supported attention head sizes |
| **Sink** | Attention sink support (for StreamingLLM) |
| **Non-Causal** | Non-causal (bidirectional) attention support for decoder models |
| **Sparse** | Sparse attention support (MLA only) |
| **MM Prefix** | Multimodal prefix full attention support |
| **DCP** | Decode Context Parallelism support (`--decode-context-parallel-size`) |
| **Attention Types** | Supported attention patterns (Decoder, Encoder, Enc-Dec) |
| **Compute Cap.** | Required CUDA compute capability (N/A for non-CUDA backends) |

**Symbols:** ✅ = Supported, ❌ = Not supported

## Standard Attention (MHA, MQA, GQA) Backends

--8<-- "gen:table-standard"

> **†** FlashInfer Native is the regular FlashInfer path. XQA is the SM90 decode path exposed through FlashInfer's TRTLLM decode API. trtllm-gen is used on SM100 and supports sinks. Disable XQA/trtllm-gen via `--attention-config.use_trtllm_attention=0`.
>
> **\*** Specify the FlashAttention version via `--attention-config.flash_attn_version=2`, `3`, or `4`. Default is FA4 on SM100+ (Blackwell), FA3 on SM90 (Hopper), FA2 otherwise.

### b12x

The b12x backend supports causal decoder attention on NVIDIA SM120 and SM121
GPUs. b12x ships with FlashInfer (`flashinfer-python>=0.7.2`). Select it with:

```bash
vllm serve <model> --attention-backend b12x
```

### ROCM_AITER_FA GQA decode kernel

On ROCm gfx950 (MI355X), `ROCM_AITER_FA` runs decode and speculative-decode verify
with a dedicated FlyDSL kernel (full-attention and sliding-window layers) instead of
AITER paged or unified attention when all of these hold:

- FP8 KV cache (`--kv-cache-dtype fp8`) in the default (unshuffled) layout;
- an attention layer with head size 64, 8 query heads per KV head, at most 16 KV
  heads on each rank and no attention sinks, logit soft cap or ALiBi;
- a decode batch in which every request has the same number of query tokens, 1 to 8
  (plain decode, or 1 to 7 draft tokens; for full-attention layers, fewer than two
  requests per compute unit).

The kernel is enabled automatically and needs FlyDSL (`flydsl`, installed with
recent `aiter`). It reads the KV cache in the backend's 16- or 32-token kernel
blocks. Other layers and
batches use the AITER kernels. Muse Spark (128 / 16 heads of 64) is one model with
this shape. The entry point is `vllm/v1/attention/ops/rocm_gqa_verify.py`.

## MiniMax M3 Sparse Attention Backends

Block-sparse GQA backend used by MiniMax M3 sparse ("lightning indexer")
layers. It is wired in directly by the model and is not part of the
automatic priority lists above. A lightning indexer scores KV blocks, the
top-k blocks (plus fixed init/local blocks) are selected, and attention
attends only to those blocks; index keys live in a separate side cache.

--8<-- "gen:table-minimax"

## MLA (Multi-head Latent Attention) Backends

MLA uses separate backends for prefill and decode phases.

### Prefill Backends

To explicitly select a prefill backend, use
`-ac.mla_prefill_backend=<BACKEND>` (e.g., `FLASH_ATTN`, `FLASHINFER`).
Otherwise, the prefill backend is selected automatically at runtime based on
hardware and configuration.

--8<-- "gen:table-mla-prefill"

> **‡** Automatic selection tries FlashAttention first. On Blackwell
> (SM100), the fallback order is TRT-LLM Ragged, FlashInfer, then
> TokenSpeed MLA; for (qk_nope_head_dim=192, qk_rope_head_dim=64,
> v_head_dim=256) TRT-LLM Ragged is tried before FlashAttention. On other
> GPUs, only FlashAttention is considered.

### Decode Backends

MLA decode backends are selected using the standard
`-ac.backend=<BACKEND>` argument (e.g., `FLASHMLA`, `TRITON_MLA`).

--8<-- "gen:table-mla-decode"

### DeepSeek V4 Decode Backends

DeepSeek V4 sparse MLA uses its own decode backends, selected via
`--attention-backend=<BACKEND>` (e.g., `FLASHMLA_SPARSE_DSV4`,
`FLASHINFER_MLA_SPARSE_DSV4`). They share the V4 sparse-index
pipeline (compressor + SWA + indexer, 256-token blocks, head 512);
default on NVIDIA is `FLASHINFER_MLA_SPARSE_DSV4` on SM12x and
`FLASHMLA_SPARSE_DSV4` on other supported CUDA architectures.

--8<-- "gen:table-mla-v4-decode"

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ 8ed576c35999bca5e24622eb2c1965ad9426fd67

@@ -186,6 +186,25 @@

 vllm serve <model> --attention-backend b12x
 ```
 
+### ROCM_AITER_FA GQA decode kernel
+
+On ROCm gfx950 (MI355X), `ROCM_AITER_FA` runs decode and speculative-decode verify
+with a dedicated FlyDSL kernel (full-attention and sliding-window layers) instead of
+AITER paged or unified attention when all of these hold:
+
+- FP8 KV cache (`--kv-cache-dtype fp8`) in the default (unshuffled) layout;
+- an attention layer with head size 64, 8 query heads per KV head, at most 16 KV
+  heads on each rank and no attention sinks, logit soft cap or ALiBi;
+- a decode batch in which every request has the same number of query tokens, 1 to 8
+  (plain decode, or 1 to 7 draft tokens; for full-attention layers, fewer than two
+  requests per compute unit).
+
+The kernel is enabled automatically and needs FlyDSL (`flydsl`, installed with
+recent `aiter`). It reads the KV cache in the backend's 16- or 32-token kernel
+blocks. Other layers and
+batches use the AITER kernels. Muse Spark (128 / 16 heads of 64) is one model with
+this shape. The entry point is `vllm/v1/attention/ops/rocm_gqa_verify.py`.
+
 ## MiniMax M3 Sparse Attention Backends
 
 Block-sparse GQA backend used by MiniMax M3 sparse ("lightning indexer")
```

</details>
