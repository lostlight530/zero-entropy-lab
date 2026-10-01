# sgl-project/sglang · README.md

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [sgl-project/sglang](https://github.com/sgl-project/sglang) |
| 来源文件 | [README.md](https://github.com/sgl-project/sglang/blob/b37e6f79fce0a4ec4fc9d5a4224830726da9dee8/README.md) |
| 来源版本 | `b37e6f79fce0a4ec4fc9d5a4224830726da9dee8` |
| 来源目录 Tree | `b317cb4e378d2765d9cba2db7d8832c12e784a30` |
| 来源内容 Blob | `d2523dd4f0fd35d9d4b18d2bf05336726b2af8e6` |
| 摄取时间 | `2026-10-01T00:54:04.042761+00:00` |
| 归属层 | `serving-inference` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_sgl_project_sglang_readme_md_e5cfd3d65b13` |

## 本次变化

- 新增行数 `95`.
- 删除行数 `79`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- SGLang: Fast inference for LLMs and multimodal models
- Get Started
- Supported Hardware
- SGL Ecosystem
- Development and Contributing
- Development setup
- Contribute
- Community and Sponsorship
- Trusted by Industry and Research
- Acknowledgment

<details>
<summary>展开完整外部原文</summary>

# SGLang: Fast inference for LLMs and multimodal models

<p align="center" id="sglangtop">
<img src="https://raw.githubusercontent.com/sgl-project/sglang/main/assets/logo.png" alt="SGLang" width="400">
</p>

<p align="center">
  <a href="https://pypi.org/project/sglang/"><img src="https://img.shields.io/pypi/v/sglang?style=flat&amp;label=PyPI&amp;labelColor=555555&amp;color=orange" alt="PyPI version"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-Apache%202.0-green?style=flat&amp;labelColor=555555" alt="License: Apache 2.0"></a>
  <a href="https://pypistats.org/packages/sglang"><img src="https://img.shields.io/pypi/dm/sglang?style=flat&amp;label=Downloads&amp;labelColor=555555&amp;color=blue" alt="PyPI downloads per month"></a>
</p>

<p align="center">
  <a href="https://docs.sglang.io/">Docs</a> |
  <a href="https://cookbook.sglang.io/">Cookbook</a> |
  <a href="https://www.sglang.io/">Website</a> |
  <a href="https://lmsys.org/blog/">Blog</a> |
  <a href="https://slack.sglang.io/">Slack</a>
</p>

SGLang is an open-source inference framework for LLMs and multimodal models, optimized for agentic workloads, RL rollouts, and large-scale serving.

👋 Get started below, or meet the community at [SGLang Events](https://www.sglang.io/events), including meetups, developer meetings, workshops, and office hours.

## Get Started

Pull the Docker image, which includes SGLang and its dependencies:

```bash
docker pull lmsysorg/sglang:latest
```

Alternatively, install SGLang in an activated Python environment with uv:

```bash
uv pip install --prerelease=allow sglang
```

Next, launch your model:

- [Quickstart](https://docs.sglang.io/docs/get-started/quickstart): Run your first model and send a request.
- [Cookbook](https://cookbook.sglang.io/): Choose your model and hardware to get a ready-to-run launch command.

## Supported Hardware

SGLang supports a wide range of GPUs, TPUs, NPUs, CPUs, and Apple Silicon platforms.

| Platform | Representative hardware |
| --- | --- |
| [NVIDIA](https://docs.sglang.io/docs/hardware-platforms/nvidia-gpus) | A100; H100/H200/H800/H20; B200/B300/GB200/GB300; select RTX 30/40/50 series, RTX 6000 Ada / PRO 6000; [DGX Spark](https://lmsys.org/blog/2025-11-03-gpt-oss-on-nvidia-dgx-spark/), [Jetson Orin](https://docs.sglang.io/docs/hardware-platforms/nvidia_jetson) |
| [AMD](https://docs.sglang.io/docs/hardware-platforms/amd_gpu) | Instinct MI300X, MI325X, MI350X, MI355X |
| [Google TPU](https://docs.sglang.io/docs/hardware-platforms/tpu) | v6e, v7; [SGL-JAX](https://github.com/sgl-project/sglang-jax) / [SGL-torchtpu](https://lmsys.org/blog/2026-07-30-sglang-google-tpu/) |
| Intel | [Arc / Arc Pro B-Series GPUs](https://docs.sglang.io/docs/hardware-platforms/xpu), [Xeon CPUs](https://docs.sglang.io/docs/hardware-platforms/cpu_server) |
| [Apple Silicon](https://docs.sglang.io/docs/hardware-platforms/apple_metal) | Macs via Metal / MLX |
| [Huawei Ascend](https://docs.sglang.io/docs/hardware-platforms/ascend-npus/getting-started/installation) | A2, A3, 950PR/DT NPUs |
| [Moore Threads](https://docs.sglang.io/docs/hardware-platforms/mthreads_gpu) | MTT S5000 GPUs |

Integrations in progress: AWS Trainium, [Alibaba T-Head PPU](https://github.com/sgl-project/sglang/issues/37519), [Cambricon MLU](https://github.com/sgl-project/sglang/pull/26898), Qualcomm QAIC, MetaX, Hygon HCU/DCU, Iluvatar CoreX, and more.

See the [Cookbook](https://cookbook.sglang.io/) and platform guides for model compatibility and setup.

## SGL Ecosystem

| Area | Projects | Purpose |
| --- | --- | --- |
| Education | [Mini-SGLang](https://github.com/sgl-project/mini-sglang), [zero-to-sglang](https://github.com/datawhalechina/zero-to-sglang), [DeepLearning.AI course](https://www.deeplearning.ai/short-courses/efficient-inference-with-sglang-text-and-image-generation/) | Learn inference engine design and efficient text and image generation through code and hands-on courses. |
| Diffusion | [SGLang Diffusion](https://docs.sglang.io/docs/sglang-diffusion/installation) | Image and video generation with diffusion models. |
| Audio | [SGLang Omni](https://github.com/sgl-project/sglang-omni) | Audio model serving for text-to-speech (TTS) and automatic speech recognition (ASR). |
| RL and Post-Training | [Miles](https://github.com/radixark/miles), [slime](https://github.com/THUDM/slime), [AReaL](https://github.com/inclusionAI/AReaL), [Tunix](https://github.com/google/tunix), [verl](https://github.com/volcengine/verl) | Training frameworks that integrate SGLang for rollout generation. |
| Speculative Decoding | [SpecForge](https://github.com/sgl-project/SpecForge) | Train draft models for speculative decoding and deploy them with SGLang. |
| KV Cache | [HiCache](https://docs.sglang.io/docs/advanced_features/hicache_design), [Mooncake](https://kvcache-ai.github.io/Mooncake/), [LMCache](https://docs.lmcache.ai/developer_guide/integration.html) | Hierarchical KV caching across GPU memory, host memory, and external storage, with cache transfer and reuse for distributed inference. |
| Deployment and Orchestration | [SMG](https://github.com/smg-project/smg), [RBG](https://github.com/sgl-project/rbg), [llm-d](https://llm-d.ai/docs/dev/operations/disaggregation/sglang), [Ray Serve](https://docs.ray.io/en/latest/serve/llm/user-guides/sglang.html), [NVIDIA Dynamo](https://docs.nvidia.com/dynamo/backends/sg-lang/reference-guide) | Deploy and scale SGLang inference services with routing, load balancing, and cluster orchestration. |

## Development and Contributing

Contributions are welcome, from bug fixes and documentation to model support and performance improvements.

### Development setup

Start from the `lmsysorg/sglang:dev` Docker image, which provides development tools and most dependencies. Clone or mount your SGLang checkout inside the container, then install it in editable mode from the repository root so tests use your local Python changes:

```bash
pip install -e "python"
```

In an activated virtual environment, you can use `uv pip install --prerelease=allow -e "python"` instead. See the [development guide](https://docs.sglang.io/docs/developer_guide/development_guide_using_docker) for container setup and testing.

### Contribute

1. Fork the repository and create a branch for your changes. For larger changes, discuss your proposal in a [GitHub issue](https://github.com/sgl-project/sglang/issues) or on [Slack](https://slack.sglang.io/).
2. Make your changes, run the relevant tests, and add regression coverage for fixes or new behavior. Run `pre-commit run --all-files` before submitting.
3. Open a pull request describing the change and how you tested it. Include benchmarks or accuracy evaluations when relevant.

See the [contributor guide](https://docs.sglang.io/docs/developer_guide/contribution_guide) for formatting, testing, and pull request instructions. Documentation contributors can start with the [docs guide](docs/README.md).

## Community and Sponsorship

SGLang is hosted by [LMSYS](https://lmsys.org/about/), a non-profit open-source organization.

- **Community discussions:** Join [Slack](https://slack.sglang.io/) for technical questions and development discussions.
- **Events:** Find meetups, workshops, and office hours on [SGLang Events](https://www.sglang.io/events).
- **Updates:** Follow [X](https://x.com/lmsysorg) and [LinkedIn](https://www.linkedin.com/company/sgl-project/) for project updates, and the [LMSYS Blog](https://lmsys.org/blog/) for release announcements and technical articles.
- **Project resources:** Explore the [documentation](https://docs.sglang.io/), [Cookbook](https://cookbook.sglang.io/), [roadmap](https://roadmap.sglang.io/), [release notes](https://github.com/sgl-project/sglang/releases), [issue tracker](https://github.com/sgl-project/sglang/issues), and [contributor guide](https://docs.sglang.io/docs/developer_guide/contribution_guide).
- **Contact Us:** For enterprise adoption and deployment, technical consulting, sponsorship, or partnership inquiries, please contact [sglang@lmsys.org](mailto:sglang@lmsys.org).
- **Contributor sponsorship:** Long-term active SGLang contributors are eligible for coding agent sponsorship, including Cursor, Claude Code, or OpenAI Codex. To apply, email [sglang@lmsys.org](mailto:sglang@lmsys.org) with links to your key commits or pull requests.

## Trusted by Industry and Research

SGLang serves production workloads across AI labs, cloud platforms, enterprises, and universities.

<img src="https://raw.githubusercontent.com/sgl-project/sgl-learning-materials/refs/heads/main/slides/adoption.png" alt="Organizations adopting SGLang" width="800">

## Acknowledgment
We learned the design and reused code from the following projects: [Guidance](https://github.com/guidance-ai/guidance), [vLLM](https://github.com/vllm-project/vllm), [LightLLM](https://github.com/ModelTC/lightllm), [FlashInfer](https://github.com/flashinfer-ai/flashinfer), [Outlines](https://github.com/outlines-dev/outlines), and [LMQL](https://github.com/eth-sri/lmql).

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ d2523dd4f0fd35d9d4b18d2bf05336726b2af8e6

@@ -1,99 +1,114 @@

-<div align="center" id="sglangtop">
-<img src="https://raw.githubusercontent.com/sgl-project/sglang/main/assets/logo.png" alt="logo" width="400" margin="10px"></img>
+# SGLang: Fast inference for LLMs and multimodal models
 
-[![PyPI](https://img.shields.io/pypi/v/sglang)](https://pypi.org/project/sglang)
-![PyPI - Downloads](https://static.pepy.tech/badge/sglang?period=month)
-[![license](https://img.shields.io/github/license/sgl-project/sglang.svg)](https://github.com/sgl-project/sglang/tree/main/LICENSE)
-[![issue resolution](https://img.shields.io/github/issues-closed-raw/sgl-project/sglang)](https://github.com/sgl-project/sglang/issues)
-[![open issues](https://img.shields.io/github/issues-raw/sgl-project/sglang)](https://github.com/sgl-project/sglang/issues)
-[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/sgl-project/sglang)
-
-</div>
-
---------------------------------------------------------------------------------
+<p align="center" id="sglangtop">
+<img src="https://raw.githubusercontent.com/sgl-project/sglang/main/assets/logo.png" alt="SGLang" width="400">
+</p>
 
 <p align="center">
-<a href="https://www.sglang.io/"><b>🌐 Website</b></a> |
-<a href="https://lmsys.org/blog/"><b>Blog</b></a> |
-<a href="https://docs.sglang.io/"><b>Documentation</b></a> |
-<a href="https://roadmap.sglang.io/"><b>Roadmap</b></a> |
-<a href="https://slack.sglang.io/"><b>Join Slack</b></a> |
-<a href="https://meet.sglang.io/"><b>Weekly Dev Meeting</b></a> |
-<a href="https://github.com/sgl-project/sgl-learning-materials?tab=readme-ov-file#slides"><b>Slides</b></a>
+  <a href="https://pypi.org/project/sglang/"><img src="https://img.shields.io/pypi/v/sglang?style=flat&amp;label=PyPI&amp;labelColor=555555&amp;color=orange" alt="PyPI version"></a>
+  <a href="LICENSE"><img src="https://img.shields.io/badge/License-Apache%202.0-green?style=flat&amp;labelColor=555555" alt="License: Apache 2.0"></a>
+  <a href="https://pypistats.org/packages/sglang"><img src="https://img.shields.io/pypi/dm/sglang?style=flat&amp;label=Downloads&amp;labelColor=555555&amp;color=blue" alt="PyPI downloads per month"></a>
 </p>
 
-## News
-- [2026/07] 🔥 SGLang and Miles add day-0 support for Kimi K3 ([blog](https://lmsys.org/blog/2026-07-27-kimi-k3-day0-support/)).
-- [2026/07] RadixArk and Google bring full SGLang features to TPUs ([blog](https://lmsys.org/blog/2026-07-30-sglang-google-tpu/)).
-- [2026/07] Serving GLM5.2 NVFP4 agentic workloads with SGLang: Reaching 500 TPS in two weeks ([blog](https://lmsys.org/blog/2026-07-13-glm52-optimization/)).
-- [2026/06] 🔥 The next generation of speculative decoding: DFlash and Spec V2 ([blog](https://lmsys.org/blog/2026-06-15-next-generation-speculative-decoding-dflash-v2/)).
-- [2026/06] SGLang provides day-0 support for latest open models ([Nemotron 3 Ultra](https://lmsys.org/blog/2026-06-04-nvidia-run-nemotron-3-ultra/), [Nemotron 3 Super](https://lmsys.org/blog/2026-03-11-run-nvidia-nemotron-3-super/), [Higgs Audio v3 TTS](https://lmsys.org/blog/2026-06-04-higgs-audio-v3-tts/)).
-- [2026/04] 🔥 DeepSeek-V4 on Day 0: From Fast Inference to Verified RL with SGLang and Miles ([blog](https://lmsys.org/blog/2026-04-25-deepseek-v4/)).
-- [2026/02] 🔥 Unlocking 25x Inference Performance with SGLang on NVIDIA GB300 NVL72 ([blog](https://lmsys.org/blog/2026-02-20-gb300-inferencex/)).
-- [2026/01] SGLang Diffusion accelerates video and image generation ([blog](https://lmsys.org/blog/2026-01-16-sglang-diffusion/)).
+<p align="center">
+  <a href="https://docs.sglang.io/">Docs</a> |
+  <a href="https://cookbook.sglang.io/">Cookbook</a> |
+  <a href="https://www.sglang.io/">Website</a> |
+  <a href="https://lmsys.org/blog/">Blog</a> |
+  <a href="https://slack.sglang.io/">Slack</a>
+</p>
 
-<details>
-<summary>More</summary>
+SGLang is an open-source inference framework for LLMs and multimodal models, optimized for agentic workloads, RL rollouts, and large-scale serving.
 
-- [2025/12] SGLang provides day-0 support for latest open models ([MiMo-V2-Flash](https://lmsys.org/blog/2025-12-16-mimo-v2-flash/), [Nemotron 3 Nano](https://lmsys.org/blog/2025-12-15-run-nvidia-nemotron-3-nano/), [Mistral Large 3](https://github.com/sgl-project/sglang/pull/14213), [LLaDA 2.0 Diffusion LLM](https://lmsys.org/blog/2025-12-19-diffusion-llm/), [MiniMax M2](https://lmsys.org/blog/2025-11-04-miminmax-m2/)).
-- [2025/11] SGLang Diffusion accelerates video and image generation ([blog](https://lmsys.org/blog/2025-11-07-sglang-diffusion/)).
-- [2025/10] SGLang now runs natively on TPU with the SGLang-Jax backend ([blog](https://lmsys.org/blog/2025-10-29-sglang-jax/)).
-- [2025/10] PyTorch Conference 2025 SGLang Talk ([slide](https://github.com/sgl-project/sgl-learning-materials/blob/main/slides/sglang_pytorch_2025.pdf)).
-- [2025/10] SGLang x Nvidia SF Meetup on 10/2 ([recap](https://x.com/lmsysorg/status/1975339501934510231)).
-- [2025/09] Deploying DeepSeek on GB200 NVL72 with PD and Large Scale EP (Part II): 3.8x Prefill, 4.8x Decode Throughput ([blog](https://lmsys.org/blog/2025-09-25-gb200-part-2/)).
-- [2025/09] SGLang Day 0 Support for DeepSeek-V3.2 with Sparse Attention ([blog](https://lmsys.org/blog/2025-09-29-deepseek-V32/)).
-- [2025/08] SGLang x AMD SF Meetup on 8/22: Hands-on GPU workshop, tech talks by AMD/xAI/SGLang, and networking ([Roadmap](https://github.com/sgl-project/sgl-learning-materials/blob/main/slides/amd_meetup_sglang_roadmap.pdf), [Large-scale EP](https://github.com/sgl-project/sgl-learning-materials/blob/main/slides/amd_meetup_sglang_ep.pdf), [Highlights](https://github.com/sgl-project/sgl-learning-materials/blob/main/slides/amd_meetup_highlights.pdf), [AITER/MoRI](https://github.com/sgl-project/sgl-learning-materials/blob/main/slides/amd_meetup_aiter_mori.pdf), [Wave](https://github.com/sgl-project/sgl-learning-materials/blob/main/slides/amd_meetup_wave.pdf)).
-- [2025/08] SGLang provides day-0 support for OpenAI gpt-oss model ([instructions](https://github.com/sgl-project/sglang/issues/8833))
-- [2025/06] SGLang, the high-performance serving infrastructure powering trillions of tokens daily, has been awarded the third batch of the Open Source AI Grant by a16z ([a16z blog](https://a16z.com/advancing-open-source-ai-through-benchmarks-and-bold-experimentation/)).
-- [2025/06] Deploying DeepSeek on GB200 NVL72 with PD and Large Scale EP (Part I): 2.7x Higher Decoding Throughput ([blog](https://lmsys.org/blog/2025-06-16-gb200-part-1/)).
-- [2025/05] Deploying DeepSeek with PD Disaggregation and Large-scale Expert Parallelism on 96 H100 GPUs ([blog](https://lmsys.org/blog/2025-05-05-large-scale-ep/)).
-- [2025/03] Supercharge DeepSeek-R1 Inference on AMD Instinct MI300X ([AMD blog](https://rocm.blogs.amd.com/artificial-intelligence/DeepSeekR1-Part2/README.html))
-- [2025/03] SGLang Joins PyTorch Ecosystem: Efficient LLM Serving Engine ([PyTorch blog](https://pytorch.org/blog/sglang-joins-pytorch/))
-- [2025/02] Unlock DeepSeek-R1 Inference Performance on AMD Instinct™ MI300X GPU ([AMD blog](https://rocm.blogs.amd.com/artificial-intelligence/DeepSeekR1_Perf/README.html))
-- [2025/01] SGLang provides day one support for DeepSeek V3/R1 models on NVIDIA and AMD GPUs with DeepSeek-specific optimizations. ([instructions](https://github.com/sgl-project/sglang/tree/main/benchmark/deepseek_v3), [AMD blog](https://www.amd.com/en/developer/resources/technical-articles/amd-instinct-gpus-power-deepseek-v3-revolutionizing-ai-development-with-sglang.html), [10+ other companies](https://x.com/lmsysorg/status/1887262321636221412))
-- [2024/12] v0.4 Release: Zero-Overhead Batch Scheduler, Cache-Aware Load Balancer, Faster Structured Outputs ([blog](https://lmsys.org/blog/2024-12-04-sglang-v0-4/)).
-- [2024/10] The First SGLang Online Meetup ([slides](https://github.com/sgl-project/sgl-learning-materials?tab=readme-ov-file#the-first-sglang-online-meetup)).
-- [2024/09] v0.3 Release: 7x Faster DeepSeek MLA, 1.5x Faster torch.compile, Multi-Image/Video LLaVA-OneVision ([blog](https://lmsys.org/blog/2024-09-04-sglang-v0-3/)).
-- [2024/07] v0.2 Release: Faster Llama3 Serving with SGLang Runtime (vs. TensorRT-LLM, vLLM) ([blog](https://lmsys.org/blog/2024-07-25-sglang-llama3/)).
-- [2024/02] SGLang enables **3x faster JSON decoding** with compressed finite state machine ([blog](https://lmsys.org/blog/2024-02-05-compressed-fsm/)).
-- [2024/01] SGLang provides up to **5x faster inference** with RadixAttention ([blog](https://lmsys.org/blog/2024-01-17-sglang/)).
-- [2024/01] SGLang powers the serving of the official **LLaVA v1.6** release demo ([usage](https://github.com/haotian-liu/LLaVA?tab=readme-ov-file#demo)).
+👋 Get started below, or meet the community at [SGLang Events](https://www.sglang.io/events), including meetups, developer meetings, workshops, and office hours.
 
-</details>
+## Get Started
 
-## About
-SGLang is a high-performance serving framework for large language models and multimodal models.
-It is designed to deliver low-latency and high-throughput inference across a wide range of setups, from a single GPU to large distributed clusters.
-Its core features include:
+Pull the Docker image, which includes SGLang and its dependencies:
 
-- **Fast Runtime**: Provides efficient serving with RadixAttention for prefix caching, a zero-overhead CPU scheduler, prefill-decode disaggregation, speculative decoding, continuous batching, paged attention, tensor/pipeline/expert/data parallelism, structured outputs, chunked prefill, quantization (FP4/FP8/INT4/AWQ/GPTQ), and multi-LoRA batching.
-- **Broad Model Support**: Supports a wide range of language models (Llama, Qwen, DeepSeek, Kimi, GLM, GPT, Gemma, Mistral, etc.), embedding models (e5-mistral, gte, mcdse), reward models (Skywork), and diffusion models (WAN, Qwen-Image), with easy extensibility for adding new models. Compatible with most Hugging Face models and OpenAI APIs.
-- **Extensive Hardware Support**: Runs on NVIDIA GPUs (GB200/B300/H100/A100/Spark/5090), AMD GPUs (MI355/MI300), Intel Xeon CPUs, Google TPUs, Ascend NPUs, and more.
-- **Active Community**: SGLang is open-source and supported by a vibrant community with widespread industry adoption, powering over 400,000 GPUs worldwide.
-- **RL & Post-Training Backbone**: SGLang is a proven rollout backend used for training many frontier models, with native RL integrations and adoption by well-known post-training frameworks such as [**AReaL**](https://github.com/inclusionAI/AReaL), [**Miles**](https://github.com/radixark/miles), [**slime**](https://github.com/THUDM/slime), [**Tunix**](https://github.com/google/tunix), [**verl**](https://github.com/volcengine/verl) and more.
+```bash
+docker pull lmsysorg/sglang:latest
+```
 
-## Getting Started
-- [Install SGLang](https://docs.sglang.io/get_started/install.html)
-- [Quick Start](https://docs.sglang.io/basic_usage/send_request.html)
-- [Cookbook](https://docs.sglang.io/cookbook) — the deployment command we recommend for each supported model
-- [Backend Tutorial](https://docs.sglang.io/basic_usage/openai_api_completions.html)
-- [Frontend Tutorial](https://docs.sglang.io/references/frontend/frontend_tutorial.html)
-- [Contribution Guide](https://docs.sglang.io/developer_guide/contribution_guide.html)
+Alternatively, install SGLang in an activated Python environment with uv:
 
-## Benchmark and Performance
-Learn more in the release blogs: [v0.2 blog](https://lmsys.org/blog/2024-07-25-sglang-llama3/), [v0.3 blog](https://lmsys.org/blog/2024-09-04-sglang-v0-3/), [v0.4 blog](https://lmsys.org/blog/2024-12-04-sglang-v0-4/), [Large-scale expert parallelism](https://lmsys.org/blog/2025-05-05-large-scale-ep/), [GB200 rack-scale parallelism](https://lmsys.org/blog/2025-09-25-gb200-part-2/), [GB300 long context](https://lmsys.org/blog/2026-02-19-gb300-longctx/).
+```bash
+uv pip install --prerelease=allow sglang
+```
 
-## Adoption and Sponsorship
-SGLang has been deployed at large scale, generating trillions of tokens in production each day. It is trusted and adopted by a wide range of leading enterprises and institutions, including xAI, NVIDIA, AMD, Intel, LinkedIn, Cursor, Oracle Cloud, Google Cloud, Microsoft Azure, AWS, Atlas Cloud, Voltage Park, Nebius, DataCrunch, Novita, RunPod, InnoMatrix, Modal, MIT, UCLA, the University of Washington, Stanford, UC Berkeley, Tsinghua University, Baseten, Baidu, AntGroup, Alibaba, Tencent, and other major technology organizations.
-As an open-source LLM inference engine, SGLang has become the de facto industry standard, with deployments running on over 400,000 GPUs worldwide.
-SGLang is currently hosted under the non-profit open-source organization [LMSYS](https://lmsys.org/about/).
+Next, launch your model:
 
-<img src="https://raw.githubusercontent.com/sgl-project/sgl-learning-materials/refs/heads/main/slides/adoption.png" alt="logo" width="800" margin="10px"></img>
+- [Quickstart](https://docs.sglang.io/docs/get-started/quickstart): Run your first model and send a request.
+- [Cookbook](https://cookbook.sglang.io/): Choose your model and hardware to get a ready-to-run launch command.
 
-## Contact Us
-For enterprises interested in adopting or deploying SGLang at scale, including technical consulting, sponsorship opportunities, or partnership inquiries, please contact us at [sglang@lmsys.org](mailto:sglang@lmsys.org).
+## Supported Hardware
 
-Long-term active SGLang contributors are eligible for coding agent sponsorship, such as Cursor, Claude Code, or OpenAI Codex. Email [sglang@lmsys.org](mailto:sglang@lmsys.org) with your most important commits or pull requests.
+SGLang supports a wide range of GPUs, TPUs, NPUs, CPUs, and Apple Silicon platforms.
+
+| Platform | Representative hardware |
+| --- | --- |
+| [NVIDIA](https://docs.sglang.io/docs/hardware-platforms/nvidia-gpus) | A100; H100/H200/H800/H20; B200/B300/GB200/GB300; select RTX 30/40/50 series, RTX 6000 Ada / PRO 6000; [DGX Spark](https://lmsys.org/blog/2025-11-03-gpt-oss-on-nvidia-dgx-spark/), [Jetson Orin](https://docs.sglang.io/docs/hardware-platforms/nvidia_jetson) |
+| [AMD](https://docs.sglang.io/docs/hardware-platforms/amd_gpu) | Instinct MI300X, MI325X, MI350X, MI355X |
+| [Google TPU](https://docs.sglang.io/docs/hardware-platforms/tpu) | v6e, v7; [SGL-JAX](https://github.com/sgl-project/sglang-jax) / [SGL-torchtpu](https://lmsys.org/blog/2026-07-30-sglang-google-tpu/) |
+| Intel | [Arc / Arc Pro B-Series GPUs](https://docs.sglang.io/docs/hardware-platforms/xpu), [Xeon CPUs](https://docs.sglang.io/docs/hardware-platforms/cpu_server) |
+| [Apple Silicon](https://docs.sglang.io/docs/hardware-platforms/apple_metal) | Macs via Metal / MLX |
+| [Huawei Ascend](https://docs.sglang.io/docs/hardware-platforms/ascend-npus/getting-started/installation) | A2, A3, 950PR/DT NPUs |
+| [Moore Threads](https://docs.sglang.io/docs/hardware-platforms/mthreads_gpu) | MTT S5000 GPUs |
+
+Integrations in progress: AWS Trainium, [Alibaba T-Head PPU](https://github.com/sgl-project/sglang/issues/37519), [Cambricon MLU](https://github.com/sgl-project/sglang/pull/26898), Qualcomm QAIC, MetaX, Hygon HCU/DCU, Iluvatar CoreX, and more.
+
+See the [Cookbook](https://cookbook.sglang.io/) and platform guides for model compatibility and setup.
+
+## SGL Ecosystem
+
+| Area | Projects | Purpose |
+| --- | --- | --- |
+| Education | [Mini-SGLang](https://github.com/sgl-project/mini-sglang), [zero-to-sglang](https://github.com/datawhalechina/zero-to-sglang), [DeepLearning.AI course](https://www.deeplearning.ai/short-courses/efficient-inference-with-sglang-text-and-image-generation/) | Learn inference engine design and efficient text and image generation through code and hands-on courses. |
+| Diffusion | [SGLang Diffusion](https://docs.sglang.io/docs/sglang-diffusion/installation) | Image and video generation with diffusion models. |
+| Audio | [SGLang Omni](https://github.com/sgl-project/sglang-omni) | Audio model serving for text-to-speech (TTS) and automatic speech recognition (ASR). |
+| RL and Post-Training | [Miles](https://github.com/radixark/miles), [slime](https://github.com/THUDM/slime), [AReaL](https://github.com/inclusionAI/AReaL), [Tunix](https://github.com/google/tunix), [verl](https://github.com/volcengine/verl) | Training frameworks that integrate SGLang for rollout generation. |
+| Speculative Decoding | [SpecForge](https://github.com/sgl-project/SpecForge) | Train draft models for speculative decoding and deploy them with SGLang. |
+| KV Cache | [HiCache](https://docs.sglang.io/docs/advanced_features/hicache_design), [Mooncake](https://kvcache-ai.github.io/Mooncake/), [LMCache](https://docs.lmcache.ai/developer_guide/integration.html) | Hierarchical KV caching across GPU memory, host memory, and external storage, with cache transfer and reuse for distributed inference. |
+| Deployment and Orchestration | [SMG](https://github.com/smg-project/smg), [RBG](https://github.com/sgl-project/rbg), [llm-d](https://llm-d.ai/docs/dev/operations/disaggregation/sglang), [Ray Serve](https://docs.ray.io/en/latest/serve/llm/user-guides/sglang.html), [NVIDIA Dynamo](https://docs.nvidia.com/dynamo/backends/sg-lang/reference-guide) | Deploy and scale SGLang inference services with routing, load balancing, and cluster orchestration. |
+
+## Development and Contributing
+
+Contributions are welcome, from bug fixes and documentation to model support and performance improvements.
+
+### Development setup
+
+Start from the `lmsysorg/sglang:dev` Docker image, which provides development tools and most dependencies. Clone or mount your SGLang checkout inside the container, then install it in editable mode from the repository root so tests use your local Python changes:
+
+```bash
+pip install -e "python"
+```
+
+In an activated virtual environment, you can use `uv pip install --prerelease=allow -e "python"` instead. See the [development guide](https://docs.sglang.io/docs/developer_guide/development_guide_using_docker) for container setup and testing.
+
+### Contribute
+
+1. Fork the repository and create a branch for your changes. For larger changes, discuss your proposal in a [GitHub issue](https://github.com/sgl-project/sglang/issues) or on [Slack](https://slack.sglang.io/).
+2. Make your changes, run the relevant tests, and add regression coverage for fixes or new behavior. Run `pre-commit run --all-files` before submitting.
+3. Open a pull request describing the change and how you tested it. Include benchmarks or accuracy evaluations when relevant.
+
+See the [contributor guide](https://docs.sglang.io/docs/developer_guide/contribution_guide) for formatting, testing, and pull request instructions. Documentation contributors can start with the [docs guide](docs/README.md).
+
+## Community and Sponsorship
+
+SGLang is hosted by [LMSYS](https://lmsys.org/about/), a non-profit open-source organization.
+
+- **Community discussions:** Join [Slack](https://slack.sglang.io/) for technical questions and development discussions.
+- **Events:** Find meetups, workshops, and office hours on [SGLang Events](https://www.sglang.io/events).
+- **Updates:** Follow [X](https://x.com/lmsysorg) and [LinkedIn](https://www.linkedin.com/company/sgl-project/) for project updates, and the [LMSYS Blog](https://lmsys.org/blog/) for release announcements and technical articles.
+- **Project resources:** Explore the [documentation](https://docs.sglang.io/), [Cookbook](https://cookbook.sglang.io/), [roadmap](https://roadmap.sglang.io/), [release notes](https://github.com/sgl-project/sglang/releases), [issue tracker](https://github.com/sgl-project/sglang/issues), and [contributor guide](https://docs.sglang.io/docs/developer_guide/contribution_guide).
+- **Contact Us:** For enterprise adoption and deployment, technical consulting, sponsorship, or partnership inquiries, please contact [sglang@lmsys.org](mailto:sglang@lmsys.org).
+- **Contributor sponsorship:** Long-term active SGLang contributors are eligible for coding agent sponsorship, including Cursor, Claude Code, or OpenAI Codex. To apply, email [sglang@lmsys.org](mailto:sglang@lmsys.org) with links to your key commits or pull requests.
+
+## Trusted by Industry and Research
+
+SGLang serves production workloads across AI labs, cloud platforms, enterprises, and universities.
+
+<img src="https://raw.githubusercontent.com/sgl-project/sgl-learning-materials/refs/heads/main/slides/adoption.png" alt="Organizations adopting SGLang" width="800">
 
 ## Acknowledgment
 We learned the design and reused code from the following projects: [Guidance](https://github.com/guidance-ai/guidance), [vLLM](https://github.com/vllm-project/vllm), [LightLLM](https://github.com/ModelTC/lightllm), [FlashInfer](https://github.com/flashinfer-ai/flashinfer), [Outlines](https://github.com/outlines-dev/outlines), and [LMQL](https://github.com/eth-sri/lmql).
```

</details>
