# vllm-project/vllm · docs/design/dbo.md

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [vllm-project/vllm](https://github.com/vllm-project/vllm) |
| 来源文件 | [docs/design/dbo.md](https://github.com/vllm-project/vllm/blob/cf5cea2da37d3dfed27d2e0aa3041c3e553c2d57/docs/design/dbo.md) |
| 来源版本 | `cf5cea2da37d3dfed27d2e0aa3041c3e553c2d57` |
| 来源目录 Tree | `77ccecb9638817035346a9ae1f4bbebe90c6c1ae` |
| 来源内容 Blob | `b6977eab7ed3cad4ab15a8f035c1a028e01bb93c` |
| 摄取时间 | `2026-11-08T06:43:49.034076+00:00` |
| 归属层 | `serving-inference` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_vllm_project_vllm_docs_design_dbo_md_43b3ce0bb5a7` |

## 本次变化

- 新增行数 `23`.
- 删除行数 `25`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- Dual Batch Overlap
- Motivation
- Introduction
- Schedule notation legend:
- S = Shared expert
- A0 = MLA qkv proj,
- A1 = Core attn + out proj + MoE gate
- D = Dispatch
- C = Combine
- Comp: |-A0₀-A1₀-||-MLP₁-||-S₁-MLP₀-||-S₀-A0₁-A1₁-|
- Comm: |----D₁---||--D₀--||----C₁---||-----C₀-----|
- Order: D₁ send, A0₀, A1₀, D₁ recv, D₀ send, MLP₁, D₀ recv,
- C₁ send, S₁, MLP₀, C₁ recv, C₀ send, S₀, A0₁, A1₁, C₀ recv.
- MLP_SHARED_OVERLAP = "mlp_shared_overlap"
- Running with DBO
- Limitations
- DBO Components
- GPU Model Runner
- UBatchRunner
- UBatchContext
- Interfaces

<details>
<summary>展开完整外部原文</summary>

# Dual Batch Overlap

## Motivation

The core motivation of the DBO system in vLLM is to overlap the sparse all-to-all communication in the MoE layer with the surrounding computation. This system currently only targets DP+EP deployments.

## Introduction

The Dual Batch Overlap system works by splitting the batch in the model runner, creating two worker threads, and then running the model on each of these worker threads. When DBO is enabled, yield points within the `FusedMoEModularKernel` allow the two CPU worker threads (also called UBatch threads) to ping-pong between each other so that when one is running compute, the other is waiting on communication. Throughout the code, ubatch may be used as a short form of microbatch; this is an ASCII-friendly version of the short form µ-batch.

The DBO system includes modifications to `GPUModelRunner` and `ModularKernel`, and defines two utility classes: `UBatchRunner` and `UBatchContext`. `UBatchRunner` splits the batch and manages the lifecycle of the UBatch threads. `UBatchContext` wraps `ForwardContext` to coordinate synchronization between the two UBatch threads.

Below is the overlap schedule that is currently implemented in vLLM.

```python
# Schedule notation legend:
#    S = Shared expert
#    A0 = MLA qkv proj,
#    A1 = Core attn + out proj + MoE gate
#    D = Dispatch
#    C = Combine

# Comp: |-A0₀-A1₀-||-MLP₁-||-S₁-MLP₀-||-S₀-A0₁-A1₁-|
# Comm: |----D₁---||--D₀--||----C₁---||-----C₀-----|
# Order: D₁ send, A0₀, A1₀, D₁ recv, D₀ send, MLP₁, D₀ recv,
#        C₁ send, S₁, MLP₀, C₁ recv, C₀ send, S₀, A0₁, A1₁, C₀ recv.
# MLP_SHARED_OVERLAP = "mlp_shared_overlap"
```

## Running with DBO

To enable the DBO system pass in the `--enable-dbo` argument to your vllm serve command. This must be run in conjunction with `--data-parallel-size N` where N is greater than 1 and `--enable-expert-parallel`. Additionally, there are two configuration knobs.

* `--dbo-decode-token-threshold` the minimum number of tokens in a decode-only batch required to enable DBO for that batch
* `--dbo-prefill-token-threshold` the minimum number of tokens in a batch containing at least one prefill required to enable DBO for that batch

Currently, DBO is only supported with DeepEP, so DeepEP must be installed and the `--all2all-backend` argument must be set to `deepep_low_latency` if your workload is primarily decode requests, or `deepep_high_throughput` if your workload is primarily prefill requests.

Below is a command that will spin up a two DP rank server with expert parallelism and DBO enabled.
EX: `vllm serve deepseek-ai/DeepSeek-V2-Lite --trust-remote-code --data-parallel-size 2 --enable-expert-parallel --enable-dbo --all2all-backend deepep_low_latency`

Note that there must be at least two GPUs visible in `CUDA_VISIBLE_DEVICES`

## Limitations

DBO cannot be combined with LoRA, pipeline parallelism, prefill context parallelism, multimodal, encoder-decoder or hybrid models, or encoder-only models. CUDA graphs must be Full or disabled: the runner rejects `PIECEWISE`.

## DBO Components

* GPUModelRunner
* UBatchRunner
* UBatchContext

### GPU Model Runner

Before each step, the DP ranks agree on whether to microbatch, in `sync_cudagraph_and_dp_padding`. Microbatching must be uniform across all DP ranks. It only happens if every rank allows it and the rank with the fewest tokens meets the applicable threshold. Every rank then pads to the token count of the largest rank, since the expert all-to-all requires all ranks to split and pad equally. The result is a `BatchExecutionDescriptor` with `num_ubatches` set to 2, which selects a captured Full CUDA graph if one matches, and otherwise runs the step eagerly.

For a step with `num_ubatches > 1`, the runner calls `UBatchRunner.prepare` to split the batch and then `UBatchRunner.run` to execute it, instead of calling the model directly.

### UBatchRunner

`UBatchRunner`, in `vllm/v1/worker/gpu/ubatch_utils.py`, is built by `maybe_build_ubatch_runner` when DBO is enabled and there is more than one DP rank.

The batch is sliced before its attention metadata is built. `prepare` splits the batch at the midpoint of the DP-padded token count. A uniform batch of multi-token queries (speculative decoding verification) is split on a request boundary instead, so that each microbatch stays a uniform decode. `prepare` then builds the attention metadata for each microbatch and stores it in that microbatch's own `ForwardContext`. A microbatch that falls entirely inside the padding has no query tokens, and runs like a dummy batch.

`run` starts one UBatch thread per microbatch, each of which runs the model on its slice of the model inputs, then joins them and merges their outputs. The threads are synchronized using `UBatchContext`.

Capture uses the same path through `begin_capturable_run`, which parks the threads before the caller enters the capture context. `CudaGraphManager` adds a microbatched capture candidate for each eligible uniform Full graph. Once a DBO CUDA graph has been captured, it can be replayed without any multithreading or CPU synchronization.

### UBatchContext

`UBatchContext`, in `vllm/v1/worker/ubatching.py`, is a `ForwardContext` wrapper class that is used by `UBatchRunner` to synchronize the two UBatch threads. It should only be instantiated by using `make_ubatch_contexts`.

When one of the UBatch threads reaches a `dbo_yield` call, it pauses, and starts the other thread which will run until it reaches the same `dbo_yield` call. This "ping-pong" dynamic continues, with threads swapping at each `dbo_yield call`, until the model's execution is complete.

The `dbo_yield` and `dbo_maybe_run_recv_hook` calls are in the `FusedMoEModularKernel` forward path and the prepare/finalize classes it uses for all-to-all communication.

#### Interfaces

The `make_ubatch_contexts` function initializes one `UBatchContext` for each UBatch thread. It takes the compute and communication CUDA streams, the `ForwardContexts` built for each microbatch and a CPU thread barrier. This function should be used exclusively to instantiate `UBatchContexts`. It will handle all of the event initialization.

The `dbo_register_recv_hook` method registers a callback that can be returned by the `FusedMoEPrepareAndFinalizeModular` class in the other UBatch thread’s `UBatchContext`. The callback will be run when the other thread calls `dbo_maybe_run_recv_hook`. This is typically used to wait on an all-to-all kernel.

The `dbo_maybe_run_recv_hook` method runs a callback that’s set by the `dbo_register_recv_hook` function if that callback exists.

The `dbo_yield` method puts the current thread to sleep and wakes up the other UBatch thread.

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ b6977eab7ed3cad4ab15a8f035c1a028e01bb93c

@@ -8,7 +8,7 @@

 
 The Dual Batch Overlap system works by splitting the batch in the model runner, creating two worker threads, and then running the model on each of these worker threads. When DBO is enabled, yield points within the `FusedMoEModularKernel` allow the two CPU worker threads (also called UBatch threads) to ping-pong between each other so that when one is running compute, the other is waiting on communication. Throughout the code, ubatch may be used as a short form of microbatch; this is an ASCII-friendly version of the short form µ-batch.
 
-The DBO system includes modifications to `GpuModelRunner` and `ModularKernel`, and defines two utility classes: `UBatchWrapper` and `UBatchContext`. `UBatchWrapper` manages thread lifecycle and CUDA graph execution of the model. `UBatchContext` wraps `ForwardContext` to coordinate synchronization between the two UBatch threads.
+The DBO system includes modifications to `GPUModelRunner` and `ModularKernel`, and defines two utility classes: `UBatchRunner` and `UBatchContext`. `UBatchRunner` splits the batch and manages the lifecycle of the UBatch threads. `UBatchContext` wraps `ForwardContext` to coordinate synchronization between the two UBatch threads.
 
 Below is the overlap schedule that is currently implemented in vLLM.
 
@@ -41,45 +41,43 @@

 
 Note that there must be at least two GPUs visible in `CUDA_VISIBLE_DEVICES`
 
+## Limitations
+
+DBO cannot be combined with LoRA, pipeline parallelism, prefill context parallelism, multimodal, encoder-decoder or hybrid models, or encoder-only models. CUDA graphs must be Full or disabled: the runner rejects `PIECEWISE`.
+
 ## DBO Components
 
 * GPUModelRunner
-* UBatchWrapper
+* UBatchRunner
 * UBatchContext
 
 ### GPU Model Runner
 
-The batch is split into microbatches by the `GPUModelRunner` class. This is accomplished in two steps. First, coordination across all DP ranks is performed to determine whether microbatching will be applied. Microbatching must be uniform across all DP ranks. If microbatching is not feasible for any DP rank, it is disabled for all ranks. If all DP ranks are going to microbatch, the total number of tokens is padded up to the max number of tokens amongst all ranks. If any rank would end up with an empty second microbatch after the padding is applied, microbatching will be aborted and no ranks will microbatch. Once microbatching has been initiated by all ranks, the second step is performed. The `CommonAttentionMetadata` is sliced in half by the `GPUModelRunner` so that there is one attention metadata per-microbatch.
+Before each step, the DP ranks agree on whether to microbatch, in `sync_cudagraph_and_dp_padding`. Microbatching must be uniform across all DP ranks. It only happens if every rank allows it and the rank with the fewest tokens meets the applicable threshold. Every rank then pads to the token count of the largest rank, since the expert all-to-all requires all ranks to split and pad equally. The result is a `BatchExecutionDescriptor` with `num_ubatches` set to 2, which selects a captured Full CUDA graph if one matches, and otherwise runs the step eagerly.
 
-### UBatchWrapper
+For a step with `num_ubatches > 1`, the runner calls `UBatchRunner.prepare` to split the batch and then `UBatchRunner.run` to execute it, instead of calling the model directly.
 
-gpu_ubatch_wrapper
+### UBatchRunner
 
-The `UBatchWrapper` class is a model wrapper that's responsible for all of the thread, UBatchContext, and CUDA graph management for DBO. It's designed to be relatively transparent to the GPU Model Runner.
+`UBatchRunner`, in `vllm/v1/worker/gpu/ubatch_utils.py`, is built by `maybe_build_ubatch_runner` when DBO is enabled and there is more than one DP rank.
 
-The implementation runs the model twice, once for each microbatch. Each model invocation occurs within a UBatch thread. These threads are launched in parallel and are synchronized using the `UBatchContext`. Each thread is provided with a sliced version of the attention metadata that is used to run its half of the batch.
+The batch is sliced before its attention metadata is built. `prepare` splits the batch at the midpoint of the DP-padded token count. A uniform batch of multi-token queries (speculative decoding verification) is split on a request boundary instead, so that each microbatch stays a uniform decode. `prepare` then builds the attention metadata for each microbatch and stores it in that microbatch's own `ForwardContext`. A microbatch that falls entirely inside the padding has no query tokens, and runs like a dummy batch.
 
-CUDA graphs for DBO are entirely managed by the `UBatchWrapper`. Because of this, DBO only supports running with Full CUDA graphs. However, once a DBO CUDA graph has been captured, it can be replayed without any multithreading or CPU synchronization.
+`run` starts one UBatch thread per microbatch, each of which runs the model on its slice of the model inputs, then joins them and merges their outputs. The threads are synchronized using `UBatchContext`.
+
+Capture uses the same path through `begin_capturable_run`, which parks the threads before the caller enters the capture context. `CudaGraphManager` adds a microbatched capture candidate for each eligible uniform Full graph. Once a DBO CUDA graph has been captured, it can be replayed without any multithreading or CPU synchronization.
+
+### UBatchContext
+
+`UBatchContext`, in `vllm/v1/worker/ubatching.py`, is a `ForwardContext` wrapper class that is used by `UBatchRunner` to synchronize the two UBatch threads. It should only be instantiated by using `make_ubatch_contexts`.
+
+When one of the UBatch threads reaches a `dbo_yield` call, it pauses, and starts the other thread which will run until it reaches the same `dbo_yield` call. This "ping-pong" dynamic continues, with threads swapping at each `dbo_yield call`, until the model's execution is complete.
+
+The `dbo_yield` and `dbo_maybe_run_recv_hook` calls are in the `FusedMoEModularKernel` forward path and the prepare/finalize classes it uses for all-to-all communication.
 
 #### Interfaces
 
-The `__init__` method takes in the model, VllmConfig, CUDAGraphMode, and device.
-
-The `forward` method exclusively takes in model arguments. It determines whether or not to run with DBO based on whether a `ubatch_slices` object is present in the `forward_context`. Otherwise, the model is run without DBO.
-
-### UBatchContext
-
-ubatch_context
-
-The `UBatchContext` class is a `ForwardContext` wrapper class that is used by the `UBatchWrapper` class to synchronize the two UBatch threads. It should only be instantiated by using `make_ubatch_contexts`.
-
-When one of the UBatch threads reaches a `dbo_yield` call, it pauses, and starts the other thread which will run until it reaches the same `dbo_yield` call. This "ping-pong" dynamic continues, with threads swapping at each `dbo_yield call`, until the model's execution is complete.
-
-The current implementation has all `dbo_yield` and `dbo_maybe_run_recv_hook` calls in the `FusedMoEModularKernel.forward` method.
-
-#### Interfaces
-
-The `make_ubatch_context` function initializes two `UBatchContexts`, one for each UBatch thread. It takes two CUDA streams, the preexisting `ForwardContexts` and a CPU thread barrier. This function should be used exclusively to instantiate `UBatchContexts`. It will handle all of the event initialization.
+The `make_ubatch_contexts` function initializes one `UBatchContext` for each UBatch thread. It takes the compute and communication CUDA streams, the `ForwardContexts` built for each microbatch and a CPU thread barrier. This function should be used exclusively to instantiate `UBatchContexts`. It will handle all of the event initialization.
 
 The `dbo_register_recv_hook` method registers a callback that can be returned by the `FusedMoEPrepareAndFinalizeModular` class in the other UBatch thread’s `UBatchContext`. The callback will be run when the other thread calls `dbo_maybe_run_recv_hook`. This is typically used to wait on an all-to-all kernel.
```

</details>
