# openai/openai-agents-python · examples/basic/hello_world.py

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [openai/openai-agents-python](https://github.com/openai/openai-agents-python) |
| 来源文件 | [examples/basic/hello_world.py](https://github.com/openai/openai-agents-python/blob/169290d6f59af88e3e52aab09bce7341ae3d832c/examples/basic/hello_world.py) |
| 来源版本 | `169290d6f59af88e3e52aab09bce7341ae3d832c` |
| 摄取时间 | `2026-07-11T06:08:42.244064+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_openai_openai_agents_python_examples_basic_hello_world_py_169290d6f59a` |

## 本次变化

- 新增行数 `20`.
- 删除行数 `0`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- 未发现 Markdown 标题.

<details>
<summary>展开完整外部原文</summary>

import asyncio

from agents import Agent, Runner


async def main():
    agent = Agent(
        name="Assistant",
        instructions="You only respond in haikus.",
    )

    result = await Runner.run(agent, "Tell me about recursion in programming.")
    print(result.final_output)
    # Function calls itself,
    # Looping in smaller pieces,
    # Endless by design.


if __name__ == "__main__":
    asyncio.run(main())

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ 169290d6f59af88e3e52aab09bce7341ae3d832c

@@ -0,0 +1,20 @@

+import asyncio
+
+from agents import Agent, Runner
+
+
+async def main():
+    agent = Agent(
+        name="Assistant",
+        instructions="You only respond in haikus.",
+    )
+
+    result = await Runner.run(agent, "Tell me about recursion in programming.")
+    print(result.final_output)
+    # Function calls itself,
+    # Looping in smaller pieces,
+    # Endless by design.
+
+
+if __name__ == "__main__":
+    asyncio.run(main())
```

</details>
