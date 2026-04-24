# 🧠 NEXUS CORE: Singularity

> "While the world is addicted to building tottering Towers of Babel with `npm install` and `pip install`, we choose to connect directly to the truth of cyberspace using bare-metal protocols."
>
> —— *The Architect (lostlight)*

⚠️ 状态 (Status): **ABSOLUTE ZERO-DEPENDENCY ATTAINED**

## 📜 宪章 (The Constitution)

本实验室遵循“零熵宪章”运行，无第三方依赖，无冗余代码，仅保留最纯粹的原生工程逻辑
(This laboratory operates under the Zero-Entropy Constitution. No third-party dependencies, no bloat, only raw engineering.)

## 🏗️ 架构矩阵 (Architecture Matrix)

1. **🧠 核心认知图谱 (Cortex - src/kernel/cortex.py)**:
   - 基于 SQLite 和 FTS5 的高性能状态机
   - (SQLite-driven memory engine featuring WAL concurrency and HMAC entity signatures.)
2. **🔌 原生协议网关 (Nexus - src/kernel/protocol/nexus.py)**:
   - 搭载无锁内存池（Ring Buffer）和单轨落盘架构，突破 SQLite I/O 锁竞争的极限并发服务器
   - (Native multithreaded HTTP server leveraging a lock-free Ring Buffer and Single-Writer Queue to eliminate SQLite WAL lock contention.)
3. **👁️ 视网膜渲染网格 (Portal - index.html)**:
   - 彻底剥离主线程的物理引擎，并劫持 GPU 显存执行 WebGL 原生暴绘的 Vanilla 架构
   - (Vanilla architecture featuring Web Worker-isolated physics engine and native WebGL for GPU-accelerated rendering. No Three.js.)
4. **⚙️ 零拷贝推理引擎 (Reasoning - src/kernel/reason.py)**:
   - 利用共享内存（Shared Memory）压平数据流，绕过 GIL，激发 CPU 集群多核算力的图计算引擎
   - (Graph inference engine utilizing multiprocessing.shared_memory to flat-pack data streams, bypassing the GIL to unlock multi-core computational power.)

## 🚀 启动指引 (Execution Commands)

### 激活实验终端 (Launch Laboratory Web Portal)

```bash
export PYTHONPATH=$(pwd)/src/kernel:$(pwd)/src/kernel/protocol:$(pwd)/src/kernel/memory:$(pwd)/src/kernel/cognitive:$(pwd)/src/kernel/sensory:$(pwd)/src/kernel/orchestration
python src/kernel/protocol/nexus.py serve
```

*地址 (Access at): [http://localhost:8000](http://localhost:8000)*

### 验证系统完备性 (Verification Tests)

```bash
python tests/run_tests.py
```

## 🧬 工程哲学 (Why Zero-Entropy?)

克制是数字空间中终极的暴力形式。我们剥夺第三方依赖的权利，将控制权还给底层内存布局、内核调度与显卡着色器。
(Because restraint is the ultimate form of digital violence. By stripping away third-party dependencies, we return control to low-level memory layouts, kernel scheduling, and GPU shaders.)

---
© Zero-Entropy Lab | Built for the Edge, Built for the Future.
