# TencentCloudADP/youtu-agent · examples/basic/chat_image.py

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [TencentCloudADP/youtu-agent](https://github.com/TencentCloudADP/youtu-agent) |
| 来源文件 | [examples/basic/chat_image.py](https://github.com/TencentCloudADP/youtu-agent/blob/8ba04c99b03da7b7c5e97b461b7e57563e5a2c8b/examples/basic/chat_image.py) |
| 来源版本 | `8ba04c99b03da7b7c5e97b461b7e57563e5a2c8b` |
| 摄取时间 | `2026-07-11T06:09:05.335698+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_tencentcloudadp_youtu_agent_examples_basic_chat_image_py_8ba04c99b03d` |

## 本次变化

- 新增行数 `32`.
- 删除行数 `0`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- 未发现 Markdown 标题.

<details>
<summary>展开完整外部原文</summary>

"""A basic example of chatting with image input.

Note the LLM model should support image input, e.g., gpt-4o or glm-4.5v
"""

import asyncio

from utu.agents import get_agent
from utu.config import ConfigLoader
from utu.utils import AgentsUtils, PrintUtils


async def main():
    image_url = "https://lightblues.github.io/img/CowboyBepop/cb-1.jpg"
    agent = get_agent(ConfigLoader.load_agent_config("simple/base"))

    turn_id = 0
    while True:
        user_input = await PrintUtils.async_print_input("> ")
        if user_input.strip().lower() in ["exit", "quit", "q"]:
            break
        if not user_input.strip():
            continue
        if turn_id == 0:
            # injected image into the first turn", color="gray
            user_input = [AgentsUtils.get_message_from_image(image_url)] + [{"role": "user", "content": user_input}]
        await agent.chat_streamed(user_input)
        turn_id += 1


if __name__ == "__main__":
    asyncio.run(main())

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ 8ba04c99b03da7b7c5e97b461b7e57563e5a2c8b

@@ -0,0 +1,32 @@

+"""A basic example of chatting with image input.
+
+Note the LLM model should support image input, e.g., gpt-4o or glm-4.5v
+"""
+
+import asyncio
+
+from utu.agents import get_agent
+from utu.config import ConfigLoader
+from utu.utils import AgentsUtils, PrintUtils
+
+
+async def main():
+    image_url = "https://lightblues.github.io/img/CowboyBepop/cb-1.jpg"
+    agent = get_agent(ConfigLoader.load_agent_config("simple/base"))
+
+    turn_id = 0
+    while True:
+        user_input = await PrintUtils.async_print_input("> ")
+        if user_input.strip().lower() in ["exit", "quit", "q"]:
+            break
+        if not user_input.strip():
+            continue
+        if turn_id == 0:
+            # injected image into the first turn", color="gray
+            user_input = [AgentsUtils.get_message_from_image(image_url)] + [{"role": "user", "content": user_input}]
+        await agent.chat_streamed(user_input)
+        turn_id += 1
+
+
+if __name__ == "__main__":
+    asyncio.run(main())
```

</details>
