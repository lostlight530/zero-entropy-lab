# openai/openai-agents-python · examples/basic/hello_world_jupyter.ipynb

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [openai/openai-agents-python](https://github.com/openai/openai-agents-python) |
| 来源文件 | [examples/basic/hello_world_jupyter.ipynb](https://github.com/openai/openai-agents-python/blob/8dd3bb379968f9301984f019fe95a237caab19cc/examples/basic/hello_world_jupyter.ipynb) |
| 来源版本 | `8dd3bb379968f9301984f019fe95a237caab19cc` |
| 摄取时间 | `2026-07-11T06:08:42.621539+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_openai_openai_agents_python_examples_basic_hello_world_jupyter_ipynb_8dd3bb379968` |

## 本次变化

- 新增行数 `45`.
- 删除行数 `0`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- 未发现 Markdown 标题.

<details>
<summary>展开完整外部原文</summary>

{
 "cells": [
  {
   "cell_type": "code",
   "execution_count": 1,
   "id": "8a77ee2e-22f2-409c-837d-b994978b0aa2",
   "metadata": {},
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "A function calls self,  \n",
      "Unraveling layers deep,  \n",
      "Base case ends the quest.  \n",
      "\n",
      "Infinite loops lurk,  \n",
      "Mind the base condition well,  \n",
      "Or it will not work.  \n",
      "\n",
      "Trees and lists unfold,  \n",
      "Elegant solutions bloom,  \n",
      "Recursion's art told.\n"
     ]
    }
   ],
   "source": [
    "from agents import Agent, Runner\n",
    "\n",
    "agent = Agent(name=\"Assistant\", instructions=\"You are a helpful assistant\")\n",
    "\n",
    "# Intended for Jupyter notebooks where there's an existing event loop\n",
    "result = await Runner.run(agent, \"Write a haiku about recursion in programming.\")  # type: ignore[top-level-await]  # noqa: F704\n",
    "print(result.final_output)"
   ]
  }
 ],
 "metadata": {
  "language_info": {
   "name": "python"
  }
 },
 "nbformat": 4,
 "nbformat_minor": 5
}

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ 8dd3bb379968f9301984f019fe95a237caab19cc

@@ -0,0 +1,45 @@

+{
+ "cells": [
+  {
+   "cell_type": "code",
+   "execution_count": 1,
+   "id": "8a77ee2e-22f2-409c-837d-b994978b0aa2",
+   "metadata": {},
+   "outputs": [
+    {
+     "name": "stdout",
+     "output_type": "stream",
+     "text": [
+      "A function calls self,  \n",
+      "Unraveling layers deep,  \n",
+      "Base case ends the quest.  \n",
+      "\n",
+      "Infinite loops lurk,  \n",
+      "Mind the base condition well,  \n",
+      "Or it will not work.  \n",
+      "\n",
+      "Trees and lists unfold,  \n",
+      "Elegant solutions bloom,  \n",
+      "Recursion's art told.\n"
+     ]
+    }
+   ],
+   "source": [
+    "from agents import Agent, Runner\n",
+    "\n",
+    "agent = Agent(name=\"Assistant\", instructions=\"You are a helpful assistant\")\n",
+    "\n",
+    "# Intended for Jupyter notebooks where there's an existing event loop\n",
+    "result = await Runner.run(agent, \"Write a haiku about recursion in programming.\")  # type: ignore[top-level-await]  # noqa: F704\n",
+    "print(result.final_output)"
+   ]
+  }
+ ],
+ "metadata": {
+  "language_info": {
+   "name": "python"
+  }
+ },
+ "nbformat": 4,
+ "nbformat_minor": 5
+}
```

</details>
