# deepseek-ai/DeepEP · README.md

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [deepseek-ai/DeepEP](https://github.com/deepseek-ai/DeepEP) |
| 来源文件 | [README.md](https://github.com/deepseek-ai/DeepEP/blob/def865146e95aa9ea223e277c0a8a4c6b81e5ac7/README.md) |
| 来源版本 | `def865146e95aa9ea223e277c0a8a4c6b81e5ac7` |
| 来源目录 Tree | `c96efc3ed7c88c8307093f5ac3a23652612d975d` |
| 来源内容 Blob | `25a50df3c69206e31d2186e064a5b9d7e696d08e` |
| 摄取时间 | `2026-09-30T00:50:26.996848+00:00` |
| 归属层 | `serving-inference` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_deepseek_ai_deepep_readme_md_078a15146bff` |

## 本次变化

- 新增行数 `296`.
- 删除行数 `216`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- DeepEP
- News
- New features
- Notes
- Quick start
- Requirements
- Install NCCL dependency
- CUDA 13.x
- For CUDA 12.x, use nvidia-nccl-cu12 instead
- Installation
- Initialize the DeepJIT submodule
- Build a wheel and install it into the current Python environment
- Development and tests
- Build and link the extension into the source tree
- Run test cases
- Interfaces and examples
- Buffer initialization
- Communication buffer (will allocate at runtime)
- Number of SMs to use for communication kernels (will be set at buffer creation)
- Example use in model training and inference
- Use do_cpu_sync=False for decoding with GPU-side expert counts
- ... do some independent computation here ...
- Run the deferred dispatch epilogue and obtain its results
- ... run the expert GEMMs and apply recv_topk_weights to produce expert_output ...

<details>
<summary>展开完整外部原文</summary>

# DeepEP

DeepEP (DeepEveryParallel) is a high-performance communication library for machine learning training and inference. It provides high-throughput and low-latency expert-parallel (EP) all-to-all GPU kernels for MoE dispatch and combine, including FP8 dispatch, and NVLink weight and gradient exchange for redundant experts. It also offers experimental primitives for pipeline parallelism (PP), context parallelism (CP), data parallelism (DP), and remote memory access (Engram). Communication kernels are compiled at runtime via [DeepJIT](https://github.com/deepseek-ai/DeepJIT), with the supporting extension built during installation.

## News

- **V2 release**: A complete refactoring of expert parallelism, with support for larger scale-up and scale-out domains and the lightweight **NCCL Gin backend**.

- **V2.5 update**:
  - Split `ElasticBuffer` into `EPBuffer`, `EngramBuffer`, `PPBuffer`, and `BucketBuffer`, sharing the `BufferBase` lifecycle
  - Add `BufferAllocator` for planning symmetric tensor allocations before buffer construction
  - Add batched all-gather, reduce-scatter, and all-reduce through `BucketBuffer`, with sessions for ordinary PyTorch tensors
  - Add `EPBuffer.lb_prefetch_weights` and `EPBuffer.lb_reduce_grads` for dynamic redundant experts: prefetch expert weights and quantization scales over NVLink before expert computation, then accumulate redundant experts' FP32 gradients into the original experts during backward. These primitives support the expert-replication approach explored by [MoonEP](https://github.com/MoonshotAI/MoonEP) and [UltraEP](https://github.com/Dots-Infra/UltraEP); see [Expert load balancing](#expert-load-balancing) for the API and integration requirements
  - Support deferred EP epilogues, cached expanded layouts, and zero padding between experts
  - Support multi-layer Engram storage on GPU or CPU, with one wait hook per layer
  - Fully remove V1, including its APIs, NVSHMEM backend, and legacy documentation. NVSHMEM is no longer a dependency

### New features

- **JIT-compiled communication kernels** via DeepJIT
- **NCCL Gin backend**
  - Lightweight device-side communication APIs
  - Able to reuse existing NCCL communicators
- **EPv2**
  - High-throughput and low-latency APIs unified into a single `EPBuffer` interface, with an expanded layout for grouped expert GEMMs
  - Larger scale-up & scale-out domain support
  - Analytical SM & QP count calculation — no more auto-tuning needed
  - Both hybrid & direct modes remain supported
- **Engram** (experimental, with RDMA)
- **PP** (experimental, with RDMA)
- **Bucket collectives** (experimental) for CP and DP (all-gather, reduce-scatter, and all-reduce)

### Notes

- EP dispatch and combine require GPU SMs; zero-SM RDMA EP is not supported
- Bucket, Engram, and PP are experimental features
- Engram requires a NCCL build providing `ncclGinOptFlagsWarpGet`

## Quick start

### Requirements

- Linux
- Python 3.10 and above
- NVIDIA Hopper or newer GPUs
- CUDA Toolkit 13.1 and above for DeepJIT compilation, with support for the target GPU
- A C++20 compiler and standard library with `std::format` support
- PyTorch 2.10 and above, with CUDA support
- NCCL 2.32.3 and above
- NVLink for intranode communication
- RDMA network for internode communication

Installation builds the host C++ extension against the CUDA and NCCL libraries. GPU kernels are compiled by DeepJIT for the current device at runtime, so installation does not require a visible GPU or `TORCH_CUDA_ARCH_LIST`. Keep the CUDA toolkit and host compiler available at runtime. Automatic bandwidth detection uses `nvidia-smi` and `ibstat`; `BucketBuffer` currently requires both NVLink and RDMA bandwidth to be detectable, even for a group using only one transport.

### Install NCCL dependency

Install the NCCL package matching your CUDA environment so DeepEP can locate its headers and library:

```bash
# CUDA 13.x
python -m pip install "nvidia-nccl-cu13>=2.32.3" --no-deps
# For CUDA 12.x, use nvidia-nccl-cu12 instead
```

For a custom NCCL installation, set `EP_NCCL_ROOT_DIR` to a directory containing `include/` and `lib/`. PyTorch and DeepEP must load the same NCCL shared library. Builds using NCCL headers older than 2.31 additionally require an exact compile-time/runtime NCCL version match.

### Installation

```bash
# Initialize the DeepJIT submodule
git submodule update --init --recursive

# Build a wheel and install it into the current Python environment
bash install.sh
```

Then import `deep_ep` in your Python project.

### Development and tests

```bash
# Build and link the extension into the source tree
bash develop.sh

# Run test cases
python tests/ep/test_ep.py
python tests/bucket/test_all_gather.py
python tests/bucket/test_reduce_scatter.py
python tests/bucket/test_all_reduce.py
python tests/buffer/test_allocation.py
python tests/ep/test_prefetch_weights.py
python tests/ep/test_reduce_grads.py
python tests/engram/test_engram.py
python tests/pp/test_pp.py
```

The test scripts require NumPy and spawn local GPU workers. For multi-node tests, launch the same script on each node with a shared `MASTER_ADDR` and `MASTER_PORT`, setting `WORLD_SIZE` to the number of nodes and `RANK` to the node index. These are the conventions of `init_dist` in [deep_ep/utils/envs.py](deep_ep/utils/envs.py); adapt it to your cluster if needed. The tests default to `NCCL_IB_SL=1` and `EP_OVERRIDE_RDMA_SL=1` unless already set. Weight-prefetch and gradient-reduction tests use a single NVLink domain; PP tests require an RDMA-only group.

## Interfaces and examples

### Buffer initialization

High-throughput and low-latency EP operations share a single `EPBuffer` interface. Initialize the buffer with MoE settings directly; SM and QP counts are estimated analytically and can be overridden per call.

Create and reuse a buffer for each EP group. All ranks must agree on `num_max_tokens_per_rank`; choose a common capacity covering the intended training, prefill, and decoding batches. The example below manages one EP group. Finish outstanding operations before replacing its buffer.

```python
import torch.distributed as dist
from typing import Optional

from deep_ep import EPBuffer

# Communication buffer (will allocate at runtime)
_buffer: Optional[EPBuffer] = None

# Number of SMs to use for communication kernels (will be set at buffer creation)
_num_comm_sms: int = 0


def get_buffer(group: dist.ProcessGroup,
               num_max_tokens_per_rank: int,
               hidden: int,
               num_topk: int,
               num_experts: int,
               use_fp8_dispatch: bool = False) -> EPBuffer:
    """Initialize or retrieve the EPBuffer for EP communication."""
    global _buffer, _num_comm_sms

    # Check if we can reuse the existing buffer
    required_bytes = EPBuffer.get_buffer_size_hint(
        group, num_max_tokens_per_rank, hidden,
        num_topk=num_topk, use_fp8_dispatch=use_fp8_dispatch,
    )
    if _buffer is not None and _buffer.group == group and _buffer.num_bytes >= required_bytes:
        _num_comm_sms = _buffer.get_theoretical_num_sms(num_experts, num_topk)
        return _buffer

    # Allocate a new buffer with MoE settings
    _buffer = EPBuffer(
        group,
        num_max_tokens_per_rank=num_max_tokens_per_rank,
        hidden=hidden,
        num_topk=num_topk,
        use_fp8_dispatch=use_fp8_dispatch,
    )

    # Estimate the SM count from the topology and communication volume
    # You may also specify `num_sms` manually in dispatch/combine calls to override
    _num_comm_sms = _buffer.get_theoretical_num_sms(num_experts, num_topk)

    return _buffer
```

### Example use in model training and inference

Training, inference prefilling, and inference decoding use the same `EPBuffer` dispatch and combine APIs. The example uses an expanded layout for grouped expert GEMMs and defers the forward epilogues until the framework waits for their results. Set `expert_alignment` to the grouped GEMM's token alignment; for DeepGEMM, use `deep_gemm.get_mk_alignment_for_contiguous_layout()`.

`do_cpu_sync=True` obtains exact output sizes and CPU-side expert counts, commonly used for training and prefill. Set it to `False` when using GPU-side receive counts, as in decoding: outputs are allocated to the configured capacity, and the expert GEMMs must use `handle.psum_num_recv_tokens_per_expert` to identify valid expert ranges. A new routing decision needs a fresh dispatch; decoding alone does not make an old routing handle reusable.

```python
import torch
from typing import Optional, Tuple, Union

from deep_ep import EPBuffer, EPHandle, EventHandle, EventOverlap


def dispatch_forward(x: Union[torch.Tensor, Tuple[torch.Tensor, torch.Tensor]],
                     topk_idx: torch.Tensor, topk_weights: torch.Tensor,
                     num_experts: int,
                     num_max_tokens_per_rank: int,
                     expert_alignment: int = 1,
                     do_cpu_sync: bool = True,
                     previous_event: Optional[EventHandle] = None) -> EventOverlap:
    """
    MoE dispatch: route tokens to the corresponding experts across all ranks.
    Supports both BF16 and FP8 (x as a tuple of [data, scale_factors]) inputs.
    Wait on the returned event to obtain the expanded tensors and routing handle.
    """
    global _buffer, _num_comm_sms

    return _buffer.dispatch(
        x,
        topk_idx=topk_idx,
        topk_weights=topk_weights,
        num_experts=num_experts,
        num_max_tokens_per_rank=num_max_tokens_per_rank,
        expert_alignment=expert_alignment,
        num_sms=_num_comm_sms,
        previous_event=previous_event,
        async_with_compute_stream=True,
        allocate_on_comm_stream=previous_event is not None,
        do_cpu_sync=do_cpu_sync,
        do_expand=True,
        do_zero_padding=True,
        use_tma_aligned_col_major_sf=True,
        defer_epilogue=True,
    )


def dispatch_backward(grad_recv_x: torch.Tensor,
                      grad_recv_topk_weights: torch.Tensor,
                      handle: EPHandle,
                      bias: Optional[torch.Tensor] = None) -> Tuple[torch.Tensor, torch.Tensor, EventOverlap]:
    """The backward pass of MoE dispatch is actually a combine."""
    global _buffer, _num_comm_sms

    combined_grad_x, combined_grad_topk_weights, event = _buffer.combine(
        grad_recv_x,
        handle=handle,
        bias=bias,
        topk_weights=grad_recv_topk_weights,
        num_sms=_num_comm_sms,
        async_with_compute_stream=True,
    )

    return combined_grad_x, combined_grad_topk_weights, event


def combine_forward(x: torch.Tensor,
                    handle: EPHandle,
                    bias: Union[torch.Tensor, Tuple[torch.Tensor, torch.Tensor]] = None,
                    previous_event: Optional[EventHandle] = None) -> EventOverlap:
    """MoE combine: reduce expert outputs back to their original ranks."""
    global _buffer, _num_comm_sms

    return _buffer.combine(
        x,
        handle=handle,
        bias=bias,
        num_sms=_num_comm_sms,
        previous_event=previous_event,
        async_with_compute_stream=True,
        allocate_on_comm_stream=previous_event is not None,
        defer_epilogue=True,
    )


def combine_backward(grad_combined_x: Union[torch.Tensor, Tuple[torch.Tensor, torch.Tensor]],
                     handle: EPHandle) -> \
        Tuple[Union[torch.Tensor, Tuple[torch.Tensor, torch.Tensor]], EventOverlap]:
    """The backward pass of MoE combine is actually a dispatch."""
    global _buffer, _num_comm_sms

    grad_x, _, _, _, event = _buffer.dispatch(
        grad_combined_x,
        handle=handle,
        num_sms=_num_comm_sms,
        async_with_compute_stream=True,
        do_expand=True,
        do_zero_padding=True,
        use_tma_aligned_col_major_sf=True,
    )

    return grad_x, event
```

For communication-computation overlap, launch communication first and wait at the point where the expert computation needs its results:

```python
# Use do_cpu_sync=False for decoding with GPU-side expert counts
event = dispatch_forward(...)

# ... do some independent computation here ...

# Run the deferred dispatch epilogue and obtain its results
recv_x, _, recv_topk_weights, handle = event.current_stream_wait()

# ... run the expert GEMMs and apply recv_topk_weights to produce expert_output ...
event = combine_forward(expert_output, handle)

# ... do some independent computation here ...
combined_x, _ = event.current_stream_wait()
```

The expanded `recv_topk_weights` is one-dimensional, with one value per expert row. The expert computation applies these router weights before combine; combine sums the supplied expert outputs. Combine inputs must be BF16. `bias` can add the shared-expert output or residual during the combine epilogue.

Training saves the forward `handle` for `combine_backward` and `dispatch_backward`. The backward helpers above return tensors and an event; wait on that event before using the tensors. Cached dispatch replays the saved expanded layout without another receive-count CPU synchronization. Keep the original `topk_idx` unchanged until all uses of the handle finish.

### Deferred epilogues

Dispatch and combine accept `defer_epilogue=True` together with `async_with_compute_stream=True`. In this mode, the call returns an `EventOverlap` directly. Calling `.wait()` runs the deferred epilogue on the current stream and returns `(recv_x, recv_topk_idx, recv_topk_weights, handle)` for dispatch, or `(combined_x, combined_topk_weights)` for combine.

The returned result is produced by the first wait, so retain it for the following computation. Without other work to overlap, call `.wait()` immediately. `do_zero_padding=True` clears alignment gaps between experts; in the no-CPU-sync mode, it does not make unused output capacity valid data.

If independent computation is already queued before the communication call, capture the input-ready event with `_buffer.capture()` before enqueueing that computation and pass it as `previous_event`. The forward helpers set `allocate_on_comm_stream=True` in this case, as required by EP. The deferred epilogue still runs on the current stream at `.wait()`; this also allows a combine `bias` produced by the intervening computation to be consumed there.

### Bucket collectives (experimental)

`BucketBuffer` provides batched `all_gather`, `reduce_scatter`, and `all_reduce` for CP and DP workloads. In normal usage, inputs must reside in the bucket's own storage. Use `BufferAllocator` to plan tensors before creating the buffer. The plan's meta tensors become CUDA views into the buffer when it is constructed.

```python
import torch

from deep_ep import BufferAllocator, BucketBuffer

# group is an initialized CP or DP process group
allocation_plan = BufferAllocator()
x = allocation_plan.allocate((group.size(), 1024), torch.float32)
buffer = BucketBuffer(group, allocation_plan)

# Gather each rank's local shard into the registered tensor
x[group.rank()].fill_(group.rank())
gathered_x = buffer.all_gather(x[group.rank()]).wait()

# Reduce-scatter and all-reduce use FP32 tensors in the buffer
x.fill_(1)
shard = buffer.reduce_scatter(x).wait()
x.fill_(1)
reduced_x = buffer.all_reduce(x).wait()
```

All ranks must use the same allocation plan. Each collective also accepts a list of tensors, and `.wait()` returns the corresponding tensor or list of tensors. Results are views into the buffer; all-gather returns flattened views. Reduce-scatter and all-reduce accept FP32 inputs and sum contributions by default; use `scale` to scale the result. Reduce-scatter also supports `comm_precision="bf16"` for lower-precision communication while retaining FP32 input and output tensors.

To use tensors allocated outside the bucket, wrap the collective calls in a `buffer.session()`. The session manages temporary bucket storage and the required staging copies:

```python
with buffer.session():
    reduced_x = buffer.all_reduce(external_x).wait()
    # Consume or copy reduced_x before reusing the session storage
```

The NVLink-only all-gather path also supports an external source with an explicitly supplied in-bucket `dsts`; use a session for general out-of-bucket inputs.

All three collectives support NVLink, RDMA, and hybrid domains. NVLink reductions require NCCL multimem support. All-gather is driven by copy engines (`num_sms=0`); reduce-scatter and all-reduce use GPU SMs. See [the bucket tests](tests/bucket) and [allocation tests](tests/buffer/test_allocation.py) for examples, including registration with multiple communication groups.

### Expert load balancing

Dynamic expert replication spreads a heavily loaded expert's computation across additional GPUs. [MoonEP](https://github.com/MoonshotAI/MoonEP) explores online planning with dynamic redundant experts, weight prefetching, and gradient reduction. [UltraEP](https://github.com/Dots-Infra/UltraEP) ([paper](https://arxiv.org/abs/2606.04101)) plans replication and token rerouting from the current post-gating load, keeping expert replication within the NVLink domain. These works motivate the redundant-expert communication primitives exposed by `EPBuffer`.

- `lb_prefetch_weights(redundant_expert_weights, expert_weights, redundancy_mapping)` pushes original expert weights to the requested redundant slots before expert computation. It accepts one tensor or matching nonempty tensor sequences, so weights and quantization scales can be transferred together without dtype conversion.
- `lb_reduce_grads(redundant_expert_grads, expert_grads, redundancy_mapping)` reads the redundant experts' FP32 gradients over NVLink and adds them into the original experts' gradients in place. Use the same mapping as the forward pass and initialize `expert_grads` with the local contribution, or zeros, before reduction.

The caller supplies the replication plan, reroutes tokens to the chosen expert instances, and manages the expert GEMMs. Both exchange operations are collective within each NVLink domain: every rank in that domain must call them, including ranks with no assigned redundant slots. They run asynchronously on the communication stream and return an `EventOverlap`; call `.wait()` before consuming their results. `previous_event` can specify when the inputs are ready, and `num_sms=0` selects an analytical SM estimate.

Reserve redundant weight and gradient storage with `lb_allocation_plan_or_num_bytes`, using a `BufferAllocator` plan or an aligned byte count. This LB region is separate from the EP dispatch/combine buffer. The redundant tensors must reside in it; original expert weights and gradients can use ordinary CUDA allocations. Plans must have the same shapes and allocation order on every rank in the NVLink domain.

`redundancy_mapping` must be a contiguous CUDA int32 tensor of shape `[num_nvlink_ranks, num_redundant_experts]`, with identical contents on every rank in the domain. Entry `[r, c]` assigns an expert to redundant slot `c` on domain-local rank `r`, or is `-1` for an unused slot. Expert IDs are `owner_rank * num_local_experts + local_expert_idx`, using domain-local rank indices. Assign replicas to peers; a rank's own experts must not appear in its redundant slots. Unused slots are skipped.

All weight and gradient tensors must be contiguous CUDA tensors. Weight tensors have leading dimension `num_local_experts` and redundant tensors `num_redundant_experts`; the trailing shapes may differ as long as each matching pair has the same byte count per expert, a multiple of `deep_ep.get_num_tma_alignment()` (32 bytes). All ranks in the domain must have the same `num_local_experts`. Gradient reduction takes two-dimensional FP32 tensors; flatten each expert's parameters into a row with the same byte alignment.

```python
import torch

from deep_ep import BufferAllocator, EPBuffer

# Use the same plan on every rank; each example expert row is 1024 elements
lb_plan = BufferAllocator()
redundant_weights = lb_plan.allocate((num_redundant_experts, 1024), torch.bfloat16)
redundant_grads = lb_plan.allocate((num_redundant_experts, 1024), torch.float32)
buffer = EPBuffer(
    group,
    num_max_tokens_per_rank=num_max_tokens_per_rank,
    hidden=hidden,
    num_topk=num_topk,
    lb_allocation_plan_or_num_bytes=lb_plan,
)

# expert_weights: contiguous CUDA BF16 [num_local_experts, 1024]
# redundancy_mapping: supplied by the caller's replication planner
weights_ready = buffer.lb_prefetch_weights(
    redundant_weights, expert_weights, redundancy_mapping,
)
# ... independent computation can overlap the exchange ...
weights_ready.wait()
# ... run expert computation using the prefetched weights ...

# After backward has written redundant_grads and the local expert_grads:
grads_ready = buffer.lb_reduce_grads(
    redundant_grads, expert_grads, redundancy_mapping,
)
# ... independent backward computation can overlap the reduction ...
grads_ready.wait()
# expert_grads now includes contributions from all redundant instances
```

Keep the mapping and tensor storage valid until the corresponding exchange finishes. If redundant storage is reused across layers or microbatches, restore the required weights before backward computation and finish gradient reduction before reusing its inputs. Reduction does not clear redundant gradients; overwrite or zero them before the next accumulation. See [weight prefetch tests](tests/ep/test_prefetch_weights.py) and [gradient reduction tests](tests/ep/test_reduce_grads.py) for complete allocation and correctness examples.

### Engram (experimental)

`EngramBuffer` supports GPU/CPU storage and multi-layer fetches over RDMA. Use `get_storage_size_hint` and `get_theoretical_config` to size the buffer and its QPs, then `set_config` and `write` to populate the layer tables.

`fetch(indices)` takes an int32 tensor of shape `[num_layers, num_tokens, num_entries_per_token]` and returns one completion hook per layer. Call the corresponding hook before using that layer's fetched data. See [Engram tests](tests/engram/test_engram.py) for BF16, FP8, and CPU storage examples.

### Pipeline parallelism (experimental)

`PPBuffer` provides `send(x, dst_rank_idx)` and `recv(x, src_rank_idx)` between adjacent ranks in an RDMA-only pipeline group. Set `num_max_tensor_bytes` and `num_max_inflight_tensors` at construction to reserve the send/recv slots. Inputs and outputs must be contiguous CUDA tensors with 32-byte-aligned pointers and sizes. See [PP tests](tests/pp/test_pp.py) for usage.

### Environment variables

Set runtime variables before importing `deep_ep` and creating buffers. Flags use `0`/`1` unless noted. The defaults below assume no build-time defaults have been packaged.

**Runtime and networking**

| Variable | Default | Effect |
| --- | --- | --- |
| `EP_BUFFER_DEBUG` | Unset | Set to `1` to print initialization, topology, buffer-size, and SM-estimation diagnostics. Leave unset to disable all diagnostics; Python-side checks also treat the string `"0"` as enabled. |
| `EP_SUPPRESS_NCCL_CHECK` | `0` | Skip the import-time checks for duplicate NCCL libraries and binary equality with the selected installation. Does not bypass the C++ device-communicator compatibility checks. |
| `EP_AVOID_RECORD_STREAM` | `0` | For EP and bucket operations, retain tensors in the completion event instead of calling `record_stream`. Keep the event alive until communication has completed. |
| `EP_REUSE_NCCL_COMM` | `1` | Reuse the PyTorch process group's NCCL communicator when its backend exposes `_comm_ptr`; otherwise create a DeepEP-managed communicator. |
| `EP_DEFAULT_RDMA_SL` | Unset | Set the Gin traffic class/service level when the buffer's `sl_idx` is not supplied. If both are unset, use NCCL's default. |
| `EP_OVERRIDE_RDMA_SL` | Unset | Override both `EP_DEFAULT_RDMA_SL` and the buffer's `sl_idx`. |
| `EP_DISABLE_GIN` | `0` | Skip Gin initialization for NVLink-only use. RDMA operations require Gin; this flag does not select another RDMA backend. |
| `EP_NUM_MAX_LOCAL_RANKS` | `16` | Engram only: estimate registered storage for `NCCL_WIN_STRIDE` sizing in hybrid mode. This is a sizing estimate, not a rank-count limit. |

**JIT compilation**

DeepJIT reads `EP_JIT_*` first, then the corresponding `DJ_JIT_*` variable as a global fallback. Configure these before the first kernel compilation. An explicit `EP_JIT_*` value, including a packaged default, takes precedence over `DJ_JIT_*`.

| Variable | Default | Effect |
| --- | --- | --- |
| `EP_JIT_DEBUG` | `0` | Enable compiler-command and kernel-load diagnostics, PTXAS output, source line information, and PTX/SASS dumps. |
| `EP_JIT_CACHE_DIR` | `$HOME/.dj` | Cache root or colon-separated list of roots. Search all roots in order and write newly compiled artifacts to the first. |
| `EP_JIT_NVCC_COMPILER` | Detected toolkit's `bin/nvcc` | Override the NVCC executable; a valid CUDA toolkit root must still be discoverable. |
| `EP_JIT_CPP_STANDARD` | `20` | C++ standard passed to NVCC. DeepEP requires C++20 or newer. |
| `EP_JIT_PRINT_COMPILER_COMMAND` | `0` | Print compiler and disassembler commands. |
| `EP_JIT_PRINT_LOAD_TIME` | `0` | Print kernel-binary loading time. |
| `EP_JIT_PTXAS_VERBOSE` | `0` | Enable and print detailed PTXAS output. |
| `EP_JIT_CHECK_NO_SPILLS` | `0` | Reject compiled kernels with register spills. |
| `EP_JIT_CHECK_NO_LOCAL_MEMORY` | `0` | Reject compiled kernels with local-memory usage. |
| `EP_JIT_WITH_LINEINFO` | `0` | Embed source line information for profiling. |
| `EP_JIT_DUMP_ASM` | `0` | Generate both PTX and SASS artifacts on a cache miss. |
| `EP_JIT_DUMP_PTX` | `0` | Generate PTX artifacts on a cache miss. |
| `EP_JIT_DUMP_SASS` | `0` | Generate SASS artifacts on a cache miss; requires the toolkit's `cuobjdump`. |
| `EP_GIN_GDAKI_DEBUG` | `0` | Compile JIT kernels with NCCL Gin GDAKI device debugging enabled. |

DeepJIT discovers the CUDA toolkit through `CUDA_HOME`, then `CUDA_PATH`, then `nvcc` on `PATH`, and finally `/usr/local/cuda`.

**Build and dependency discovery**

| Variable | Default | Effect |
| --- | --- | --- |
| `EP_NCCL_ROOT_DIR` | Auto-detected | NCCL installation with `include/` and `lib/`, used at build and import time. Takes precedence over `NCCL_DIR`, then NVIDIA Python package discovery. |
| `EP_NUM_TOPK_IDX_BITS` | `64` | Build-time top-k index width (`32` or `64`). Use the exported `deep_ep.topk_idx_t` for routing indices. Changing this value requires rebuilding the extension. |

When set during a package build, these variables are stored as import-time defaults: `EP_JIT_CACHE_DIR`, `EP_JIT_PRINT_COMPILER_COMMAND`, `EP_JIT_CPP_STANDARD`, `EP_NUM_TOPK_IDX_BITS`, `EP_NCCL_ROOT_DIR`, `EP_DEFAULT_RDMA_SL`, and `EP_OVERRIDE_RDMA_SL`. Existing environment values take precedence at import. Overriding `EP_NUM_TOPK_IDX_BITS` at runtime does not change the compiled index type.

**Test profiling**

These flags affect `bench_kineto` in [deep_ep/utils/testing.py](deep_ep/utils/testing.py), not production communication:

| Variable | Default | Effect |
| --- | --- | --- |
| `EP_USE_NVIDIA_TOOLS` | `0` | Skip the internal profiler when using Nsight or Compute Sanitizer. Reported internal timings are placeholders while this is enabled. |
| `EP_DISABLE_BARRIER_PROFILING` | `0` | Disable the barrier and delay inserted before each profiled iteration. |

## Network configurations

DeepEP is fully tested with InfiniBand networks. However, it is theoretically compatible with RDMA over Converged Ethernet (RoCE) as well.

### Traffic isolation

Traffic isolation is supported by InfiniBand through Virtual Lanes (VL).

To prevent interference between different types of traffic, we recommend segregating workloads across different virtual lanes as follows:

- expert-parallel workloads
- other workloads

Select the RDMA service level through the buffer's `sl_idx` argument. The precedence is `EP_OVERRIDE_RDMA_SL` > `sl_idx` > `EP_DEFAULT_RDMA_SL` > NCCL's default. The fabric's SL-to-VL mapping determines which virtual lane carries that traffic.

### Adaptive routing

Adaptive routing is an advanced routing feature provided by InfiniBand switches that can evenly distribute traffic across multiple paths. Even though adaptive routing introduces additional latency, we still recommend enabling it under all network load conditions.

### Congestion control

For maximum-bandwidth workloads, we recommend disabling congestion control after validating the fabric configuration. If congestion is unavoidable, place those workloads on lower-priority virtual lanes. DeepEP does not configure congestion control on the fabric.

### PCI atomic mode

If the hardware supports it, we recommend using the following command to set the NIC's `PCI_ATOMIC_MODE` to improve RDMA atomic operation performance:

```bash
# Replace mlx5_0 with the target NIC
sudo mlxconfig -y -d mlx5_0 set PCI_ATOMIC_MODE=4
```

## Experimental branches

The following links describe separate implementations and research branches. Their features and dependencies apply to those branches; consult each branch before integrating it with the current API.

- [Zero-copy](https://github.com/deepseek-ai/DeepEP/pull/453)
    - Removing the copy between PyTorch tensors and communication buffers, which reduces the SM usages significantly for normal kernels
    - This PR is authored by **Tencent Network Platform Department**
- [Eager](https://github.com/deepseek-ai/DeepEP/pull/437)
    - Using a low-latency protocol removes the extra RTT latency introduced by RDMA atomic OPs
- [Hybrid-EP](https://github.com/deepseek-ai/DeepEP/tree/hybrid-ep)
    - A new backend implementation using TMA instructions for minimal SM usage and larger NVLink domain support
    - Fine-grained communication-computation overlap for single-batch scenarios
    - PCIe kernel support for non-NVLink environments
    - NVFP4 data type support
- [AntGroup-Opt](https://github.com/deepseek-ai/DeepEP/tree/antgroup-opt)
    - This optimization series is authored by **AntGroup Network Platform Department**
    - [Normal-SMFree](https://github.com/deepseek-ai/DeepEP/pull/347) Eliminating SM from RDMA path by decoupling comm-kernel execution from NIC token transfer, freeing SMs for compute
    - [LL-SBO](https://github.com/deepseek-ai/DeepEP/pull/483) Overlapping Down GEMM computation with Combine Send communication via signaling mechanism to reduce end-to-end latency
    - [LL-Layered](https://github.com/deepseek-ai/DeepEP/pull/500) Optimizing cross-node LL operator communication using rail-optimized forwarding and data merging to reduce latency
- [Mori-EP](https://github.com/deepseek-ai/DeepEP/tree/mori-ep)
    - ROCm/AMD GPU support powered by [MORI](https://github.com/ROCm/mori) backend (low-latency mode)
- [nvDev](https://github.com/deepseek-ai/DeepEP/tree/nvDev)
    - V2-based branch with the latest CUDA features, such as Compute Fabric Transport (CFT) that brings better latency on small token sizes.

## Community forks

- [uccl/uccl-ep](https://github.com/uccl-project/uccl/tree/main/ep) - Enables running DeepEP on heterogeneous GPUs (e.g., Nvidia, AMD) and NICs (e.g., EFA, Broadcom, CX7)
- [Infrawaves/DeepEP_ibrc_dual-ports_multiQP](https://github.com/Infrawaves/DeepEP_ibrc_dual-ports_multiQP) - Adds multi-QP solution and dual-port NIC support in IBRC transport
- [antgroup/DeepXTrace](https://github.com/antgroup/DeepXTrace) - A diagnostic analyzer for efficient and precise localization of slow ranks
- [ROCm/mori](https://github.com/ROCm/mori) - AMD's next-generation communication library for performance-critical AI workloads (e.g., Wide EP, KVCache transfer, Collectives)

## Acknowledgement

DeepEP is built on top of the [NCCL](https://github.com/nvidia/nccl) Gin backend. Thanks to @sjeaugey, @pakmarkthub, @sb17v, @xiaofanl-nvidia, and the NCCL team for their support!

We also acknowledge [MoonEP](https://github.com/MoonshotAI/MoonEP) and [UltraEP](https://github.com/Dots-Infra/UltraEP) for their work on dynamic expert replication and the weight/gradient exchange that supports expert load balancing.

## License

This code repository is released under [the MIT License](LICENSE).

## Citation

```bibtex
@misc{deepep2025,
      title={DeepEP: an efficient expert-parallel communication library},
      author={Chenggang Zhao and Shangyan Zhou and Liyue Zhang and Chengqi Deng and Zhean Xu and Yuxuan Liu and Kuai Yu and Jiashi Li and Liang Zhao},
      year={2025},
      publisher = {GitHub},
      howpublished = {\url{https://github.com/deepseek-ai/DeepEP}},
}
```

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ 25a50df3c69206e31d2186e064a5b9d7e696d08e

@@ -1,128 +1,117 @@

 # DeepEP
 
-DeepEP (DeepEveryParallel) is a high-performance communication library for modern machine learning training and inference. The library currently focuses on expert parallelism (EP) — providing high-throughput and low-latency all-to-all GPU kernels (MoE dispatch and combine) with low-precision support including FP8 — while also offering experimental primitives for pipeline parallelism (PP), context parallelism (CP), and remote memory access (Engram), all designed for zero or minimal SM occupation. All kernels are compiled at runtime via a lightweight Just-In-Time (JIT) module, requiring no CUDA compilation during installation.
-
-Despite its lightweight design, DeepEP's performance matches or exceeds hardware bandwidth limits across various configurations.
+DeepEP (DeepEveryParallel) is a high-performance communication library for machine learning training and inference. It provides high-throughput and low-latency expert-parallel (EP) all-to-all GPU kernels for MoE dispatch and combine, including FP8 dispatch, and NVLink weight and gradient exchange for redundant experts. It also offers experimental primitives for pipeline parallelism (PP), context parallelism (CP), data parallelism (DP), and remote memory access (Engram). Communication kernels are compiled at runtime via [DeepJIT](https://github.com/deepseek-ai/DeepJIT), with the supporting extension built during installation.
 
 ## News
 
-- **V2 release**: A complete refactoring of Expert Parallelism — achieving extreme performance with several times fewer SM resources compared to V1, while supporting significantly larger scale-up and scale-out domains. V2 has also switched from the NVSHMEM backend to the more lightweight **NCCL Gin backend**.
+- **V2 release**: A complete refactoring of expert parallelism, with support for larger scale-up and scale-out domains and the lightweight **NCCL Gin backend**.
+
+- **V2.5 update**:
+  - Split `ElasticBuffer` into `EPBuffer`, `EngramBuffer`, `PPBuffer`, and `BucketBuffer`, sharing the `BufferBase` lifecycle
+  - Add `BufferAllocator` for planning symmetric tensor allocations before buffer construction
+  - Add batched all-gather, reduce-scatter, and all-reduce through `BucketBuffer`, with sessions for ordinary PyTorch tensors
+  - Add `EPBuffer.lb_prefetch_weights` and `EPBuffer.lb_reduce_grads` for dynamic redundant experts: prefetch expert weights and quantization scales over NVLink before expert computation, then accumulate redundant experts' FP32 gradients into the original experts during backward. These primitives support the expert-replication approach explored by [MoonEP](https://github.com/MoonshotAI/MoonEP) and [UltraEP](https://github.com/Dots-Infra/UltraEP); see [Expert load balancing](#expert-load-balancing) for the API and integration requirements
+  - Support deferred EP epilogues, cached expanded layouts, and zero padding between experts
+  - Support multi-layer Engram storage on GPU or CPU, with one wait hook per layer
+  - Fully remove V1, including its APIs, NVSHMEM backend, and legacy documentation. NVSHMEM is no longer a dependency
 
 ### New features
 
-- **Fully JIT** (Just-In-Time compilation)
+- **JIT-compiled communication kernels** via DeepJIT
 - **NCCL Gin backend**
-  - Header-only & lightweight
+  - Lightweight device-side communication APIs
   - Able to reuse existing NCCL communicators
 - **EPv2**
-  - High-throughput and low-latency APIs unified into a single `ElasticBuffer` interface, with a new GEMM layout
-  - Larger scale-up & scale-out domain support (up to EP2048)
+  - High-throughput and low-latency APIs unified into a single `EPBuffer` interface, with an expanded layout for grouped expert GEMMs
+  - Larger scale-up & scale-out domain support
   - Analytical SM & QP count calculation — no more auto-tuning needed
   - Both hybrid & direct modes remain supported
-  - For V3-like legacy training, SM usage reduced from 24 to 4 - 6 while maintaining equivalent or better performance
-- **0 SM Engram** (with RDMA)
-- **0 SM PP** (with RDMA)
-- **0 SM CP** (with Copy Engine)
+- **Engram** (experimental, with RDMA)
+- **PP** (experimental, with RDMA)
+- **Bucket collectives** (experimental) for CP and DP (all-gather, reduce-scatter, and all-reduce)
 
 ### Notes
 
-- Buffer size consumption is larger than V1
-- 0 SM RDMA low-latency EP is no longer supported
-- Engram, PP, and CP are experimental features
-
-### Still on-going features
-
-- **Elastic GPU & CPU buffers**: A contiguous virtual address space that maps to a hybrid of GPU and CPU physical memory under the hood, enabling fully automatic and transparent Engram or imbalanced EP
-- Reducing intermediate buffer sizes by leveraging EP replay to handle load imbalance
-- All-gather updates and reduce-scatter implementations for DP & TP
-
-For the legacy V1 documentation (NVSHMEM-based), see [docs/legacy.md](docs/legacy.md).
-
-## Performance
-
-Following V3's configuration, we tested with 8K tokens per batch, 7168 hidden dimensions, top 8 experts, FP8 dispatching, and BF16 combining, and obtained the following results:
-
-| Arch | NIC type | Topo | Dispatch Bottleneck Bandwidth | Combine Bottleneck Bandwidth | #SMs |
-|--|--|--|--|--|--|
-| SM90 | CX7 | EP 8 x 2 | 90 GB/s (RDMA) | 81 GB/s (RDMA) | 12 |
-| SM90 | CX7 | EP 8 x 4 | 61 GB/s (RDMA) | 61 GB/s (RDMA) | 6 |
-| SM100 | CX7 | EP 8 x 2 | 90 GB/s (RDMA) | 91 GB/s (RDMA) | 12 |
-| SM100 | N/A | EP 8 | 726 GB/s (NVLink) | 740 GB/s (NVLink) | 64 (Max perf) |
-| SM100 | N/A | EP 8 | 643 GB/s (NVLink) | 675 GB/s (NVLink) | 24 (Min #SM) |
-
-Notes: the results are logical bandwidth. For example, under the `EP 8 x 2` case, 90 GB/s actually contains local rank traffic.
-
-Comparing with V1, **V2 achieves up to 1.3x peak performance, while saving up to 4x SM count**.
-
-We omit results for larger EP configurations for the time being, but encourage interested users to benchmark them directly. Based on our internal experience, we expect the kernel to continue saturating hardware bandwidth at scale.
-
-For V1 performance data, see [docs/legacy.md](docs/legacy.md#performance).
+- EP dispatch and combine require GPU SMs; zero-SM RDMA EP is not supported
+- Bucket, Engram, and PP are experimental features
+- Engram requires a NCCL build providing `ncclGinOptFlagsWarpGet`
 
 ## Quick start
 
 ### Requirements
 
-- Hopper (SM90) GPUs, or other architectures with SM90 PTX ISA support
-- Python 3.8 and above
-- CUDA version
-  - CUDA 12.3 and above for SM90 GPUs
-- PyTorch 2.10 and above
-- NCCL 2.30.4 and above
+- Linux
+- Python 3.10 and above
+- NVIDIA Hopper or newer GPUs
+- CUDA Toolkit 13.1 and above for DeepJIT compilation, with support for the target GPU
+- A C++20 compiler and standard library with `std::format` support
+- PyTorch 2.10 and above, with CUDA support
+- NCCL 2.32.3 and above
 - NVLink for intranode communication
 - RDMA network for internode communication
 
+Installation builds the host C++ extension against the CUDA and NCCL libraries. GPU kernels are compiled by DeepJIT for the current device at runtime, so installation does not require a visible GPU or `TORCH_CUDA_ARCH_LIST`. Keep the CUDA toolkit and host compiler available at runtime. Automatic bandwidth detection uses `nvidia-smi` and `ibstat`; `BucketBuffer` currently requires both NVLink and RDMA bandwidth to be detectable, even for a group using only one transport.
+
 ### Install NCCL dependency
 
-We recommend using pip to install NCCL so that DeepEP can automatically locate it within the Python environment. You can install it using the following command:
+Install the NCCL package matching your CUDA environment so DeepEP can locate its headers and library:
 
 ```bash
-pip install "nvidia-nccl-cu13>=2.30.4" --no-deps
-```
-
-### Install NVSHMEM dependency
-
-DeepEP also depends on NVSHMEM to provide support for legacy methods. Please refer to our [NVSHMEM Installation Guide](docs/nvshmem.md) for instructions.
-
-### Development
+# CUDA 13.x
+python -m pip install "nvidia-nccl-cu13>=2.32.3" --no-deps
+# For CUDA 12.x, use nvidia-nccl-cu12 instead
+```
+
+For a custom NCCL installation, set `EP_NCCL_ROOT_DIR` to a directory containing `include/` and `lib/`. PyTorch and DeepEP must load the same NCCL shared library. Builds using NCCL headers older than 2.31 additionally require an exact compile-time/runtime NCCL version match.
+
+### Installation
 
 ```bash
-# Build and make symbolic links for SO files
-python setup.py build
-# You may modify the specific SO names according to your own platform
-ln -s build/lib.linux-x86_64-cpython-38/deep_ep_cpp.cpython-38-x86_64-linux-gnu.so
+# Initialize the DeepJIT submodule
+git submodule update --init --recursive
+
+# Build a wheel and install it into the current Python environment
+bash install.sh
+```
+
+Then import `deep_ep` in your Python project.
+
+### Development and tests
+
+```bash
+# Build and link the extension into the source tree
+bash develop.sh
 
 # Run test cases
-# NOTES: you may modify the `init_dist` function in `tests/utils/envs.py`
-# according to your own cluster settings, and launch into multiple nodes
-python tests/elastic/test_ep.py
-python tests/elastic/test_agrs.py
-python tests/elastic/test_engram.py
-python tests/elastic/test_pp.py
-```
-
-### Installation
-
-```bash
-python setup.py install
-```
-
-Then, import `deep_ep` in your Python project, and enjoy!
+python tests/ep/test_ep.py
+python tests/bucket/test_all_gather.py
+python tests/bucket/test_reduce_scatter.py
+python tests/bucket/test_all_reduce.py
+python tests/buffer/test_allocation.py
+python tests/ep/test_prefetch_weights.py
+python tests/ep/test_reduce_grads.py
+python tests/engram/test_engram.py
+python tests/pp/test_pp.py
+```
+
+The test scripts require NumPy and spawn local GPU workers. For multi-node tests, launch the same script on each node with a shared `MASTER_ADDR` and `MASTER_PORT`, setting `WORLD_SIZE` to the number of nodes and `RANK` to the node index. These are the conventions of `init_dist` in [deep_ep/utils/envs.py](deep_ep/utils/envs.py); adapt it to your cluster if needed. The tests default to `NCCL_IB_SL=1` and `EP_OVERRIDE_RDMA_SL=1` unless already set. Weight-prefetch and gradient-reduction tests use a single NVLink domain; PP tests require an RDMA-only group.
 
 ## Interfaces and examples
 
 ### Buffer initialization
 
-In V2, all EP operations — high-throughput and low-latency — are unified under a single `ElasticBuffer` interface. The buffer can be initialized by specifying MoE settings directly, and the optimal SM and QP counts are calculated analytically.
+High-throughput and low-latency EP operations share a single `EPBuffer` interface. Initialize the buffer with MoE settings directly; SM and QP counts are estimated analytically and can be overridden per call.
+
+Create and reuse a buffer for each EP group. All ranks must agree on `num_max_tokens_per_rank`; choose a common capacity covering the intended training, prefill, and decoding batches. The example below manages one EP group. Finish outstanding operations before replacing its buffer.
 
 ```python
-import torch
 import torch.distributed as dist
 from typing import Optional
 
-from deep_ep import ElasticBuffer
+from deep_ep import EPBuffer
 
 # Communication buffer (will allocate at runtime)
-_buffer: Optional[ElasticBuffer] = None
+_buffer: Optional[EPBuffer] = None
 
 # Number of SMs to use for communication kernels (will be set at buffer creation)
 _num_comm_sms: int = 0
@@ -133,21 +122,21 @@

                hidden: int,
                num_topk: int,
                num_experts: int,
-               use_fp8_dispatch: bool = False) -> ElasticBuffer:
-    """Initialize or retrieve the ElasticBuffer for EP communication."""
+               use_fp8_dispatch: bool = False) -> EPBuffer:
+    """Initialize or retrieve the EPBuffer for EP communication."""
     global _buffer, _num_comm_sms
 
     # Check if we can reuse the existing buffer
-    required_bytes = ElasticBuffer.get_buffer_size_hint(
+    required_bytes = EPBuffer.get_buffer_size_hint(
         group, num_max_tokens_per_rank, hidden,
         num_topk=num_topk, use_fp8_dispatch=use_fp8_dispatch,
     )
     if _buffer is not None and _buffer.group == group and _buffer.num_bytes >= required_bytes:
+        _num_comm_sms = _buffer.get_theoretical_num_sms(num_experts, num_topk)
         return _buffer
 
     # Allocate a new buffer with MoE settings
-    # NOTES: V2 buffer size consumption is larger than V1
-    _buffer = ElasticBuffer(
+    _buffer = EPBuffer(
         group,
         num_max_tokens_per_rank=num_max_tokens_per_rank,
         hidden=hidden,
@@ -155,39 +144,41 @@

         use_fp8_dispatch=use_fp8_dispatch,
     )
 
-    # V2 analytically calculates the optimal SM count — no more auto-tuning needed
+    # Estimate the SM count from the topology and communication volume
     # You may also specify `num_sms` manually in dispatch/combine calls to override
     _num_comm_sms = _buffer.get_theoretical_num_sms(num_experts, num_topk)
 
     return _buffer
 ```
 
-### Example use in model training or inference prefilling
-
-V2 unifies the dispatch and combine APIs into a single `ElasticBuffer` interface. The example below shows how to use them for training (with backward passes) or inference prefilling.
+### Example use in model training and inference
+
+Training, inference prefilling, and inference decoding use the same `EPBuffer` dispatch and combine APIs. The example uses an expanded layout for grouped expert GEMMs and defers the forward epilogues until the framework waits for their results. Set `expert_alignment` to the grouped GEMM's token alignment; for DeepGEMM, use `deep_gemm.get_mk_alignment_for_contiguous_layout()`.
+
+`do_cpu_sync=True` obtains exact output sizes and CPU-side expert counts, commonly used for training and prefill. Set it to `False` when using GPU-side receive counts, as in decoding: outputs are allocated to the configured capacity, and the expert GEMMs must use `handle.psum_num_recv_tokens_per_expert` to identify valid expert ranges. A new routing decision needs a fresh dispatch; decoding alone does not make an old routing handle reusable.
 
 ```python
 import torch
-import torch.distributed as dist
-from typing import Tuple, Union
-
-from deep_ep import ElasticBuffer, EPHandle, EventOverlap
+from typing import Optional, Tuple, Union
+
+from deep_ep import EPBuffer, EPHandle, EventHandle, EventOverlap
 
 
 def dispatch_forward(x: Union[torch.Tensor, Tuple[torch.Tensor, torch.Tensor]],
                      topk_idx: torch.Tensor, topk_weights: torch.Tensor,
                      num_experts: int,
                      num_max_tokens_per_rank: int,
-                     expert_alignment: int = 1) -> \
-        Tuple[Union[torch.Tensor, Tuple[torch.Tensor, torch.Tensor]],
-              torch.Tensor, torch.Tensor, EPHandle, EventOverlap]:
+                     expert_alignment: int = 1,
+                     do_cpu_sync: bool = True,
+                     previous_event: Optional[EventHandle] = None) -> EventOverlap:
     """
     MoE dispatch: route tokens to the corresponding experts across all ranks.
     Supports both BF16 and FP8 (x as a tuple of [data, scale_factors]) inputs.
+    Wait on the returned event to obtain the expanded tensors and routing handle.
     """
     global _buffer, _num_comm_sms
 
-    recv_x, recv_topk_idx, recv_topk_weights, handle, event = _buffer.dispatch(
+    return _buffer.dispatch(
         x,
         topk_idx=topk_idx,
         topk_weights=topk_weights,
@@ -195,24 +186,28 @@

         num_max_tokens_per_rank=num_max_tokens_per_rank,
         expert_alignment=expert_alignment,
         num_sms=_num_comm_sms,
+        previous_event=previous_event,
         async_with_compute_stream=True,
+        allocate_on_comm_stream=previous_event is not None,
+        do_cpu_sync=do_cpu_sync,
+        do_expand=True,
+        do_zero_padding=True,
+        use_tma_aligned_col_major_sf=True,
+        defer_epilogue=True,
     )
-
-    # `handle` contains routing metadata for the subsequent combine call
-    # `handle.num_recv_tokens_per_expert_list` provides per-expert token counts for GEMM
-    # Use `event.current_stream_wait()` to synchronize the compute stream before using results
-    return recv_x, recv_topk_idx, recv_topk_weights, handle, event
 
 
 def dispatch_backward(grad_recv_x: torch.Tensor,
                       grad_recv_topk_weights: torch.Tensor,
-                      handle: EPHandle) -> Tuple[torch.Tensor, torch.Tensor, EventOverlap]:
+                      handle: EPHandle,
+                      bias: Optional[torch.Tensor] = None) -> Tuple[torch.Tensor, torch.Tensor, EventOverlap]:
     """The backward pass of MoE dispatch is actually a combine."""
     global _buffer, _num_comm_sms
 
     combined_grad_x, combined_grad_topk_weights, event = _buffer.combine(
         grad_recv_x,
         handle=handle,
+        bias=bias,
         topk_weights=grad_recv_topk_weights,
         num_sms=_num_comm_sms,
         async_with_compute_stream=True,
@@ -222,18 +217,22 @@

 
 
 def combine_forward(x: torch.Tensor,
-                    handle: EPHandle) -> Tuple[torch.Tensor, EventOverlap]:
+                    handle: EPHandle,
+                    bias: Union[torch.Tensor, Tuple[torch.Tensor, torch.Tensor]] = None,
+                    previous_event: Optional[EventHandle] = None) -> EventOverlap:
     """MoE combine: reduce expert outputs back to their original ranks."""
     global _buffer, _num_comm_sms
 
-    combined_x, _, event = _buffer.combine(
+    return _buffer.combine(
         x,
         handle=handle,
+        bias=bias,
         num_sms=_num_comm_sms,
+        previous_event=previous_event,
         async_with_compute_stream=True,
+        allocate_on_comm_stream=previous_event is not None,
+        defer_epilogue=True,
     )
-
-    return combined_x, event
 
 
 def combine_backward(grad_combined_x: Union[torch.Tensor, Tuple[torch.Tensor, torch.Tensor]],
@@ -247,126 +246,202 @@

         handle=handle,
         num_sms=_num_comm_sms,
         async_with_compute_stream=True,
+        do_expand=True,
+        do_zero_padding=True,
+        use_tma_aligned_col_major_sf=True,
     )
 
     return grad_x, event
 ```
 
-For communication-computation overlap, use the `EventOverlap` interface to manage dependencies between the communication stream and the compute stream:
+For communication-computation overlap, launch communication first and wait at the point where the expert computation needs its results:
 
 ```python
-# After dispatch, overlap computation while communication is in-flight
-recv_x, recv_topk_idx, recv_topk_weights, handle, event = dispatch_forward(...)
+# Use do_cpu_sync=False for decoding with GPU-side expert counts
+event = dispatch_forward(...)
 
 # ... do some independent computation here ...
 
-# Wait for communication to finish before using results
-event.current_stream_wait()
-
-# Now safe to use recv_x, recv_topk_idx, recv_topk_weights
-```
-
-### Example use in inference decoding
-
-For inference decoding, the same `ElasticBuffer` is used. The handle-caching pattern allows reusing routing metadata across iterations when the gating decisions remain unchanged, avoiding redundant CPU synchronization.
+# Run the deferred dispatch epilogue and obtain its results
+recv_x, _, recv_topk_weights, handle = event.current_stream_wait()
+
+# ... run the expert GEMMs and apply recv_topk_weights to produce expert_output ...
+event = combine_forward(expert_output, handle)
+
+# ... do some independent computation here ...
+combined_x, _ = event.current_stream_wait()
+```
+
+The expanded `recv_topk_weights` is one-dimensional, with one value per expert row. The expert computation applies these router weights before combine; combine sums the supplied expert outputs. Combine inputs must be BF16. `bias` can add the shared-expert output or residual during the combine epilogue.
+
+Training saves the forward `handle` for `combine_backward` and `dispatch_backward`. The backward helpers above return tensors and an event; wait on that event before using the tensors. Cached dispatch replays the saved expanded layout without another receive-count CPU synchronization. Keep the original `topk_idx` unchanged until all uses of the handle finish.
+
+### Deferred epilogues
+
+Dispatch and combine accept `defer_epilogue=True` together with `async_with_compute_stream=True`. In this mode, the call returns an `EventOverlap` directly. Calling `.wait()` runs the deferred epilogue on the current stream and returns `(recv_x, recv_topk_idx, recv_topk_weights, handle)` for dispatch, or `(combined_x, combined_topk_weights)` for combine.
+
+The returned result is produced by the first wait, so retain it for the following computation. Without other work to overlap, call `.wait()` immediately. `do_zero_padding=True` clears alignment gaps between experts; in the no-CPU-sync mode, it does not make unused output capacity valid data.
+
+If independent computation is already queued before the communication call, capture the input-ready event with `_buffer.capture()` before enqueueing that computation and pass it as `previous_event`. The forward helpers set `allocate_on_comm_stream=True` in this case, as required by EP. The deferred epilogue still runs on the current stream at `.wait()`; this also allows a combine `bias` produced by the intervening computation to be consumed there.
+
+### Bucket collectives (experimental)
+
+`BucketBuffer` provides batched `all_gather`, `reduce_scatter`, and `all_reduce` for CP and DP workloads. In normal usage, inputs must reside in the bucket's own storage. Use `BufferAllocator` to plan tensors before creating the buffer. The plan's meta tensors become CUDA views into the buffer when it is constructed.
 
 ```python
 import torch
-from typing import Tuple, Optional, Union
-
-from deep_ep import ElasticBuffer, EPHandle, EventOverlap
-
-
-def decode_dispatch(x: Union[torch.Tensor, Tuple[torch.Tensor, torch.Tensor]],
-                    topk_idx: torch.Tensor, topk_weights: torch.Tensor,
-                    num_experts: int,
-                    num_max_tokens_per_rank: int,
-                    cached_handle: Optional[EPHandle] = None) -> \
-        Tuple[Union[torch.Tensor, Tuple[torch.Tensor, torch.Tensor]],
-              torch.Tensor, torch.Tensor, EPHandle, EventOverlap]:
-    """
-    MoE dispatch for inference decoding.
-    If `cached_handle` is provided, the layout is reused without CPU synchronization.
-    """
-    global _buffer, _num_comm_sms
-
-    if cached_handle is not None:
-        # Reuse cached handle: skip layout recomputation and CPU sync
-        recv_x, _, _, handle, event = _buffer.dispatch(
-            x,
-            handle=cached_handle,
-            num_sms=_num_comm_sms,
-            async_with_compute_stream=True,
-        )
-        return recv_x, cached_handle.topk_idx, None, handle, event
-
-    recv_x, recv_topk_idx, recv_topk_weights, handle, event = _buffer.dispatch(
-        x,
-        topk_idx=topk_idx,
-        topk_weights=topk_weights,
-        num_experts=num_experts,
-        num_max_tokens_per_rank=num_max_tokens_per_rank,
-        num_sms=_num_comm_sms,
-        async_with_compute_stream=True,
-    )
-
-    return recv_x, recv_topk_idx, recv_topk_weights, handle, event
-
-
-def decode_combine(x: torch.Tensor,
-                   handle: EPHandle) -> Tuple[torch.Tensor, EventOverlap]:
-    """MoE combine for inference decoding."""
-    global _buffer, _num_comm_sms
-
-    combined_x, _, event = _buffer.combine(
-        x,
-        handle=handle,
-        num_sms=_num_comm_sms,
-        async_with_compute_stream=True,
-    )
-
-    return combined_x, event
-```
+
+from deep_ep import BufferAllocator, BucketBuffer
+
+# group is an initialized CP or DP process group
+allocation_plan = BufferAllocator()
+x = allocation_plan.allocate((group.size(), 1024), torch.float32)
+buffer = BucketBuffer(group, allocation_plan)
+
+# Gather each rank's local shard into the registered tensor
+x[group.rank()].fill_(group.rank())
+gathered_x = buffer.all_gather(x[group.rank()]).wait()
+
+# Reduce-scatter and all-reduce use FP32 tensors in the buffer
+x.fill_(1)
+shard = buffer.reduce_scatter(x).wait()
+x.fill_(1)
+reduced_x = buffer.all_reduce(x).wait()
+```
+
+All ranks must use the same allocation plan. Each collective also accepts a list of tensors, and `.wait()` returns the corresponding tensor or list of tensors. Results are views into the buffer; all-gather returns flattened views. Reduce-scatter and all-reduce accept FP32 inputs and sum contributions by default; use `scale` to scale the result. Reduce-scatter also supports `comm_precision="bf16"` for lower-precision communication while retaining FP32 input and output tensors.
+
+To use tensors allocated outside the bucket, wrap the collective calls in a `buffer.session()`. The session manages temporary bucket storage and the required staging copies:
+
+```python
+with buffer.session():
+    reduced_x = buffer.all_reduce(external_x).wait()
+    # Consume or copy reduced_x before reusing the session storage
+```
+
+The NVLink-only all-gather path also supports an external source with an explicitly supplied in-bucket `dsts`; use a session for general out-of-bucket inputs.
+
+All three collectives support NVLink, RDMA, and hybrid domains. NVLink reductions require NCCL multimem support. All-gather is driven by copy engines (`num_sms=0`); reduce-scatter and all-reduce use GPU SMs. See [the bucket tests](tests/bucket) and [allocation tests](tests/buffer/test_allocation.py) for examples, including registration with multiple communication groups.
+
+### Expert load balancing
+
+Dynamic expert replication spreads a heavily loaded expert's computation across additional GPUs. [MoonEP](https://github.com/MoonshotAI/MoonEP) explores online planning with dynamic redundant experts, weight prefetching, and gradient reduction. [UltraEP](https://github.com/Dots-Infra/UltraEP) ([paper](https://arxiv.org/abs/2606.04101)) plans replication and token rerouting from the current post-gating load, keeping expert replication within the NVLink domain. These works motivate the redundant-expert communication primitives exposed by `EPBuffer`.
+
+- `lb_prefetch_weights(redundant_expert_weights, expert_weights, redundancy_mapping)` pushes original expert weights to the requested redundant slots before expert computation. It accepts one tensor or matching nonempty tensor sequences, so weights and quantization scales can be transferred together without dtype conversion.
+- `lb_reduce_grads(redundant_expert_grads, expert_grads, redundancy_mapping)` reads the redundant experts' FP32 gradients over NVLink and adds them into the original experts' gradients in place. Use the same mapping as the forward pass and initialize `expert_grads` with the local contribution, or zeros, before reduction.
+
+The caller supplies the replication plan, reroutes tokens to the chosen expert instances, and manages the expert GEMMs. Both exchange operations are collective within each NVLink domain: every rank in that domain must call them, including ranks with no assigned redundant slots. They run asynchronously on the communication stream and return an `EventOverlap`; call `.wait()` before consuming their results. `previous_event` can specify when the inputs are ready, and `num_sms=0` selects an analytical SM estimate.
+
+Reserve redundant weight and gradient storage with `lb_allocation_plan_or_num_bytes`, using a `BufferAllocator` plan or an aligned byte count. This LB region is separate from the EP dispatch/combine buffer. The redundant tensors must reside in it; original expert weights and gradients can use ordinary CUDA allocations. Plans must have the same shapes and allocation order on every rank in the NVLink domain.
+
+`redundancy_mapping` must be a contiguous CUDA int32 tensor of shape `[num_nvlink_ranks, num_redundant_experts]`, with identical contents on every rank in the domain. Entry `[r, c]` assigns an expert to redundant slot `c` on domain-local rank `r`, or is `-1` for an unused slot. Expert IDs are `owner_rank * num_local_experts + local_expert_idx`, using domain-local rank indices. Assign replicas to peers; a rank's own experts must not appear in its redundant slots. Unused slots are skipped.
+
+All weight and gradient tensors must be contiguous CUDA tensors. Weight tensors have leading dimension `num_local_experts` and redundant tensors `num_redundant_experts`; the trailing shapes may differ as long as each matching pair has the same byte count per expert, a multiple of `deep_ep.get_num_tma_alignment()` (32 bytes). All ranks in the domain must have the same `num_local_experts`. Gradient reduction takes two-dimensional FP32 tensors; flatten each expert's parameters into a row with the same byte alignment.
+
+```python
+import torch
+
+from deep_ep import BufferAllocator, EPBuffer
+
+# Use the same plan on every rank; each example expert row is 1024 elements
+lb_plan = BufferAllocator()
+redundant_weights = lb_plan.allocate((num_redundant_experts, 1024), torch.bfloat16)
+redundant_grads = lb_plan.allocate((num_redundant_experts, 1024), torch.float32)
+buffer = EPBuffer(
+    group,
+    num_max_tokens_per_rank=num_max_tokens_per_rank,
+    hidden=hidden,
+    num_topk=num_topk,
+    lb_allocation_plan_or_num_bytes=lb_plan,
+)
+
+# expert_weights: contiguous CUDA BF16 [num_local_experts, 1024]
+# redundancy_mapping: supplied by the caller's replication planner
+weights_ready = buffer.lb_prefetch_weights(
+    redundant_weights, expert_weights, redundancy_mapping,
+)
+# ... independent computation can overlap the exchange ...
+weights_ready.wait()
+# ... run expert computation using the prefetched weights ...
+
+# After backward has written redundant_grads and the local expert_grads:
+grads_ready = buffer.lb_reduce_grads(
+    redundant_grads, expert_grads, redundancy_mapping,
+)
+# ... independent backward computation can overlap the reduction ...
+grads_ready.wait()
+# expert_grads now includes contributions from all redundant instances
+```
+
+Keep the mapping and tensor storage valid until the corresponding exchange finishes. If redundant storage is reused across layers or microbatches, restore the required weights before backward computation and finish gradient reduction before reusing its inputs. Reduction does not clear redundant gradients; overwrite or zero them before the next accumulation. See [weight prefetch tests](tests/ep/test_prefetch_weights.py) and [gradient reduction tests](tests/ep/test_reduce_grads.py) for complete allocation and correctness examples.
+
+### Engram (experimental)
+
+`EngramBuffer` supports GPU/CPU storage and multi-layer fetches over RDMA. Use `get_storage_size_hint` and `get_theoretical_config` to size the buffer and its QPs, then `set_config` and `write` to populate the layer tables.
+
+`fetch(indices)` takes an int32 tensor of shape `[num_layers, num_tokens, num_entries_per_token]` and returns one completion hook per layer. Call the corresponding hook before using that layer's fetched data. See [Engram tests](tests/engram/test_engram.py) for BF16, FP8, and CPU storage examples.
+
+### Pipeline parallelism (experimental)
+
+`PPBuffer` provides `send(x, dst_rank_idx)` and `recv(x, src_rank_idx)` between adjacent ranks in an RDMA-only pipeline group. Set `num_max_tensor_bytes` and `num_max_inflight_tensors` at construction to reserve the send/recv slots. Inputs and outputs must be contiguous CUDA tensors with 32-byte-aligned pointers and sizes. See [PP tests](tests/pp/test_pp.py) for usage.
 
 ### Environment variables
 
-The library provides some environment variables, which may be useful:
-
-- General
-    - `EP_BUFFER_DEBUG`: `0` or `1`, print buffer initialization, SM approximation, and backend debugging information, `0` by default
-    - `EP_SUPPRESS_NCCL_CHECK`: `0` or `1`, suppress NCCL version mismatch checking, `0` by default
-    - `EP_AVOID_RECORD_STREAM`: `0` or `1`, avoid `record_stream` on output tensors, `0` by default
-    - `EP_NUM_TOPK_IDX_BITS`: integer, override the number of bits for top-k index encoding, `0` (auto) by default
-- Networking
-    - `EP_NIC_NAME`: string, the default NIC name used to query NIC properties, `mlx5_0` by default
-    - `EP_OVERRIDE_RDMA_SL`: integer, override the RDMA service level index for traffic isolation
-    - `EP_DISABLE_GIN`: `0` or `1`, disable the NCCL Gin backend (fall back to non-Gin path), `0` by default
-- JIT
-    - `EP_JIT_DEBUG`: `0` or `1`, print JIT debugging information, `0` by default
-    - `EP_JIT_CACHE_DIR`: string, cache directory for compiled kernels, `$HOME/.deep_ep` by default
-    - `EP_JIT_NVCC_COMPILER`: string, NVCC compiler path; defaults to `torch.utils.cpp_extension.CUDA_HOME`
-    - `EP_JIT_CPP_STANDARD`: integer, C++ standard version, `20` by default
-    - `EP_JIT_PRINT_COMPILER_COMMAND`: `0` or `1`, print compilation commands, `0` by default
-    - `EP_JIT_PTXAS_VERBOSE`: `0` or `1`, show detailed PTXAS output, `0` by default
-    - `EP_JIT_PTXAS_CHECK`: `0` or `1`, assert no local memory usage in compiled kernels, `0` by default
-    - `EP_JIT_WITH_LINEINFO`: `0` or `1`, embed source line info for profiling tools, `0` by default
-    - `EP_JIT_DUMP_ASM`: `0` or `1`, dump both PTX and SASS, `0` by default
-    - `EP_JIT_DUMP_PTX`: `0` or `1`, dump PTX output, `0` by default
-    - `EP_JIT_DUMP_SASS`: `0` or `1`, dump SASS output, `0` by default
-- Debug and profiling
-    - `EP_GIN_GDAKI_DEBUG`: `0` or `1`, enable NCCL Gin GDAKI debugging output, `0` by default
-    - `EP_USE_NVIDIA_TOOLS`: `0` or `1`, skip internal profiling when running under external NVIDIA tools, `0` by default
-    - `EP_DISABLE_BARRIER_PROFILING`: `0` or `1`, disable barrier-based communication profiling in benchmarks, `0` by default
-- Build
-    - `EP_NCCL_ROOT_DIR`: string, path to the NCCL installation directory; auto-detected from the Python environment if not set
-    - `EP_NVSHMEM_ROOT_DIR`: string, path to the NVSHMEM installation directory; auto-detected from the Python environment if not set
-    - `TORCH_CUDA_ARCH_LIST`: string, list of target CUDA architectures, e.g. `"9.0"`
-    - `DISABLE_SM90_FEATURES`: `0` or `1`, disable SM90 features for legacy methods, `0` by default
-    - `DISABLE_AGGRESSIVE_PTX_INSTRS`: `0` or `1`, disable aggressive load/store instructions in legacy methods, `0` by default
-
-Some environment variables are **persistent**: they are captured at build time and baked into the installed package as default values. At import time, these defaults are applied automatically unless overridden by current environment variables. The persistent variables are: `EP_JIT_CACHE_DIR`, `EP_JIT_PRINT_COMPILER_COMMAND`, `EP_NUM_TOPK_IDX_BITS`, `EP_NCCL_ROOT_DIR`.
-
-For additional details, please refer to [the test code](tests/elastic/test_ep.py) or review the corresponding Python documentation.
+Set runtime variables before importing `deep_ep` and creating buffers. Flags use `0`/`1` unless noted. The defaults below assume no build-time defaults have been packaged.
+
+**Runtime and networking**
+
+| Variable | Default | Effect |
+| --- | --- | --- |
+| `EP_BUFFER_DEBUG` | Unset | Set to `1` to print initialization, topology, buffer-size, and SM-estimation diagnostics. Leave unset to disable all diagnostics; Python-side checks also treat the string `"0"` as enabled. |
+| `EP_SUPPRESS_NCCL_CHECK` | `0` | Skip the import-time checks for duplicate NCCL libraries and binary equality with the selected installation. Does not bypass the C++ device-communicator compatibility checks. |
+| `EP_AVOID_RECORD_STREAM` | `0` | For EP and bucket operations, retain tensors in the completion event instead of calling `record_stream`. Keep the event alive until communication has completed. |
+| `EP_REUSE_NCCL_COMM` | `1` | Reuse the PyTorch process group's NCCL communicator when its backend exposes `_comm_ptr`; otherwise create a DeepEP-managed communicator. |
+| `EP_DEFAULT_RDMA_SL` | Unset | Set the Gin traffic class/service level when the buffer's `sl_idx` is not supplied. If both are unset, use NCCL's default. |
+| `EP_OVERRIDE_RDMA_SL` | Unset | Override both `EP_DEFAULT_RDMA_SL` and the buffer's `sl_idx`. |
+| `EP_DISABLE_GIN` | `0` | Skip Gin initialization for NVLink-only use. RDMA operations require Gin; this flag does not select another RDMA backend. |
+| `EP_NUM_MAX_LOCAL_RANKS` | `16` | Engram only: estimate registered storage for `NCCL_WIN_STRIDE` sizing in hybrid mode. This is a sizing estimate, not a rank-count limit. |
+
+**JIT compilation**
+
+DeepJIT reads `EP_JIT_*` first, then the corresponding `DJ_JIT_*` variable as a global fallback. Configure these before the first kernel compilation. An explicit `EP_JIT_*` value, including a packaged default, takes precedence over `DJ_JIT_*`.
+
+| Variable | Default | Effect |
+| --- | --- | --- |
+| `EP_JIT_DEBUG` | `0` | Enable compiler-command and kernel-load diagnostics, PTXAS output, source line information, and PTX/SASS dumps. |
+| `EP_JIT_CACHE_DIR` | `$HOME/.dj` | Cache root or colon-separated list of roots. Search all roots in order and write newly compiled artifacts to the first. |
+| `EP_JIT_NVCC_COMPILER` | Detected toolkit's `bin/nvcc` | Override the NVCC executable; a valid CUDA toolkit root must still be discoverable. |
+| `EP_JIT_CPP_STANDARD` | `20` | C++ standard passed to NVCC. DeepEP requires C++20 or newer. |
+| `EP_JIT_PRINT_COMPILER_COMMAND` | `0` | Print compiler and disassembler commands. |
+| `EP_JIT_PRINT_LOAD_TIME` | `0` | Print kernel-binary loading time. |
+| `EP_JIT_PTXAS_VERBOSE` | `0` | Enable and print detailed PTXAS output. |
+| `EP_JIT_CHECK_NO_SPILLS` | `0` | Reject compiled kernels with register spills. |
+| `EP_JIT_CHECK_NO_LOCAL_MEMORY` | `0` | Reject compiled kernels with local-memory usage. |
+| `EP_JIT_WITH_LINEINFO` | `0` | Embed source line information for profiling. |
+| `EP_JIT_DUMP_ASM` | `0` | Generate both PTX and SASS artifacts on a cache miss. |
+| `EP_JIT_DUMP_PTX` | `0` | Generate PTX artifacts on a cache miss. |
+| `EP_JIT_DUMP_SASS` | `0` | Generate SASS artifacts on a cache miss; requires the toolkit's `cuobjdump`. |
+| `EP_GIN_GDAKI_DEBUG` | `0` | Compile JIT kernels with NCCL Gin GDAKI device debugging enabled. |
+
+DeepJIT discovers the CUDA toolkit through `CUDA_HOME`, then `CUDA_PATH`, then `nvcc` on `PATH`, and finally `/usr/local/cuda`.
+
+**Build and dependency discovery**
+
+| Variable | Default | Effect |
+| --- | --- | --- |
+| `EP_NCCL_ROOT_DIR` | Auto-detected | NCCL installation with `include/` and `lib/`, used at build and import time. Takes precedence over `NCCL_DIR`, then NVIDIA Python package discovery. |
+| `EP_NUM_TOPK_IDX_BITS` | `64` | Build-time top-k index width (`32` or `64`). Use the exported `deep_ep.topk_idx_t` for routing indices. Changing this value requires rebuilding the extension. |
+
+When set during a package build, these variables are stored as import-time defaults: `EP_JIT_CACHE_DIR`, `EP_JIT_PRINT_COMPILER_COMMAND`, `EP_JIT_CPP_STANDARD`, `EP_NUM_TOPK_IDX_BITS`, `EP_NCCL_ROOT_DIR`, `EP_DEFAULT_RDMA_SL`, and `EP_OVERRIDE_RDMA_SL`. Existing environment values take precedence at import. Overriding `EP_NUM_TOPK_IDX_BITS` at runtime does not change the compiled index type.
+
+**Test profiling**
+
+These flags affect `bench_kineto` in [deep_ep/utils/testing.py](deep_ep/utils/testing.py), not production communication:
+
+| Variable | Default | Effect |
+| --- | --- | --- |
+| `EP_USE_NVIDIA_TOOLS` | `0` | Skip the internal profiler when using Nsight or Compute Sanitizer. Reported internal timings are placeholders while this is enabled. |
+| `EP_DISABLE_BARRIER_PROFILING` | `0` | Disable the barrier and delay inserted before each profiled iteration. |
 
 ## Network configurations
 
@@ -381,7 +456,7 @@

 - expert-parallel workloads
 - other workloads
 
-For DeepEP V2, you can control the virtual lane assignment by setting the `sl_idx` argument or the `EP_OVERRIDE_RDMA_SL` environment variable.
+Select the RDMA service level through the buffer's `sl_idx` argument. The precedence is `EP_OVERRIDE_RDMA_SL` > `sl_idx` > `EP_DEFAULT_RDMA_SL` > NCCL's default. The fabric's SL-to-VL mapping determines which virtual lane carries that traffic.
 
 ### Adaptive routing
 
@@ -389,17 +464,20 @@

 
 ### Congestion control
 
-Congestion control is disabled because it hurts maximum bandwidth. If congestion is unavoidable in some scenarios, we recommend assigning those workloads to low-priority virtual lanes.
+For maximum-bandwidth workloads, we recommend disabling congestion control after validating the fabric configuration. If congestion is unavoidable, place those workloads on lower-priority virtual lanes. DeepEP does not configure congestion control on the fabric.
 
 ### PCI atomic mode
 
 If the hardware supports it, we recommend using the following command to set the NIC's `PCI_ATOMIC_MODE` to improve RDMA atomic operation performance:
 
 ```bash
-sudo mlxconfig -y -d mlx5_$i set PCI_ATOMIC_MODE=4
+# Replace mlx5_0 with the target NIC
+sudo mlxconfig -y -d mlx5_0 set PCI_ATOMIC_MODE=4
 ```
 
 ## Experimental branches
+
+The following links describe separate implementations and research branches. Their features and dependencies apply to those branches; consult each branch before integrating it with the current API.
 
 - [Zero-copy](https://github.com/deepseek-ai/DeepEP/pull/453)
     - Removing the copy between PyTorch tensors and communication buffers, which reduces the SM usages significantly for normal kernels
@@ -430,7 +508,9 @@

 
 ## Acknowledgement
 
-DeepEP V2 is built on top of the [NCCL](https://github.com/nvidia/nccl) Gin backend. Thanks to @sjeaugey, @pakmarkthub, @sb17v, @xiaofanl-nvidia, and the NCCL team for their support!
+DeepEP is built on top of the [NCCL](https://github.com/nvidia/nccl) Gin backend. Thanks to @sjeaugey, @pakmarkthub, @sb17v, @xiaofanl-nvidia, and the NCCL team for their support!
+
+We also acknowledge [MoonEP](https://github.com/MoonshotAI/MoonEP) and [UltraEP](https://github.com/Dots-Infra/UltraEP) for their work on dynamic expert replication and the weight/gradient exchange that supports expert load balancing.
 
 ## License
```

</details>
