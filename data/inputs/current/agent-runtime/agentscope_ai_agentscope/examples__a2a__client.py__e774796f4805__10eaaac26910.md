# agentscope-ai/agentscope · examples/a2a/client.py

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [agentscope-ai/agentscope](https://github.com/agentscope-ai/agentscope) |
| 来源文件 | [examples/a2a/client.py](https://github.com/agentscope-ai/agentscope/blob/10eaaac269101e25ad9f808353c45e305c6d7231/examples/a2a/client.py) |
| 来源版本 | `10eaaac269101e25ad9f808353c45e305c6d7231` |
| 来源目录 Tree | `577a34b06ea4ef9406b86c0dd59dfed5fc2b78ae` |
| 来源内容 Blob | `e774796f4805991edf6d6f680efaf25f45f5ec27` |
| 摄取时间 | `2026-09-03T23:38:49.495149+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `external_doc_agentscope_ai_agentscope_examples_a2a_client_py` |

## 本次变化

- 新增行数 `45`.
- 删除行数 `0`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- -*- coding: utf-8 -*-

<details>
<summary>展开完整外部原文</summary>

# -*- coding: utf-8 -*-
"""Chat with a remote A2A 1.0 agent in the terminal.

``A2AAgent`` streams AgentScope events, so it goes straight into
``launch_console`` like a local agent would. Start ``server.py`` first, then
run::

    python client.py [--url http://127.0.0.1:9999] [--verbosity default]
"""
import argparse
import asyncio

import httpx
from a2a.client import A2ACardResolver

from agentscope.agent import A2AAgent
from agentscope.console import launch_console


async def main() -> None:
    """Resolve the remote Agent Card and hand the agent to the console."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--url", default="http://127.0.0.1:9999")
    parser.add_argument(
        "--verbosity",
        choices=["quiet", "default", "debug"],
        default="default",
    )
    args = parser.parse_args()

    # The card is fetched once, over a client this example owns; A2AAgent
    # builds its own transport from it.
    async with httpx.AsyncClient() as httpx_client:
        card = await A2ACardResolver(
            httpx_client=httpx_client,
            base_url=args.url,
        ).get_agent_card()

    print(f"Connected to {card.name!r} at {args.url}.")
    async with A2AAgent(card) as agent:
        await launch_console(agent, verbosity=args.verbosity)


if __name__ == "__main__":
    asyncio.run(main())

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ e774796f4805991edf6d6f680efaf25f45f5ec27

@@ -0,0 +1,45 @@

+# -*- coding: utf-8 -*-
+"""Chat with a remote A2A 1.0 agent in the terminal.
+
+``A2AAgent`` streams AgentScope events, so it goes straight into
+``launch_console`` like a local agent would. Start ``server.py`` first, then
+run::
+
+    python client.py [--url http://127.0.0.1:9999] [--verbosity default]
+"""
+import argparse
+import asyncio
+
+import httpx
+from a2a.client import A2ACardResolver
+
+from agentscope.agent import A2AAgent
+from agentscope.console import launch_console
+
+
+async def main() -> None:
+    """Resolve the remote Agent Card and hand the agent to the console."""
+    parser = argparse.ArgumentParser(description=__doc__)
+    parser.add_argument("--url", default="http://127.0.0.1:9999")
+    parser.add_argument(
+        "--verbosity",
+        choices=["quiet", "default", "debug"],
+        default="default",
+    )
+    args = parser.parse_args()
+
+    # The card is fetched once, over a client this example owns; A2AAgent
+    # builds its own transport from it.
+    async with httpx.AsyncClient() as httpx_client:
+        card = await A2ACardResolver(
+            httpx_client=httpx_client,
+            base_url=args.url,
+        ).get_agent_card()
+
+    print(f"Connected to {card.name!r} at {args.url}.")
+    async with A2AAgent(card) as agent:
+        await launch_console(agent, verbosity=args.verbosity)
+
+
+if __name__ == "__main__":
+    asyncio.run(main())
```

</details>
