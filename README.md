# 🧠 NEXUS CORE: Singularity

> "While the world is addicted to building tottering Towers of Babel with `npm install` and `pip install`, we choose to connect directly to the truth of cyberspace using bare-metal protocols"
>
> —— *The Architect (lostlight)*

⚠️ 状态 (Status): **ABSOLUTE ZERO-DEPENDENCY ATTAINED**

## 📜 宪章 (The Constitution)

This laboratory operates under the Zero-Entropy Constitution No third-party dependencies, no bloat, only raw engineering

## 🏗️ 架构矩阵 (Architecture Matrix)

1 **🧠 核心认知图谱 (Cortex - src/kernel/cortex.py)**:
   - SQLite-driven memory engine featuring WAL concurrency and HMAC entity signatures

2 **🔌 原生协议网关 (Nexus - src/kernel/protocol/nexus.py)**:
   - Native multithreaded HTTP server leveraging a lock-free Ring Buffer and Single-Writer Queue to eliminate SQLite WAL lock contention

3 **👁️ 视网膜渲染网格 (Portal - index.html)**:
   - Vanilla architecture featuring Web Worker-isolated physics engine and native WebGL for GPU-accelerated rendering No Three_js

4 **⚙️ 零拷贝推理引擎 (Reasoning - src/kernel/reason.py)**:
   - Graph inference engine utilizing multiprocessing_shared_memory to flat-pack data streams, bypassing the GIL to unlock multi-core computational power

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

Because restraint is the ultimate form of digital violence By stripping away third-party dependencies, we return control to low-level memory layouts, kernel scheduling, and GPU shaders

---
© Zero-Entropy Lab | Built for the Edge, Built for the Future