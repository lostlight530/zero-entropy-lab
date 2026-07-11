PROVENANCE: {"confidence": 1.0, "entity_id": "doc_openai_openai_agents_python_examples_basic_hello_world_jupyter_ipynb_8dd3bb379968", "primary_owner": "zero", "retrieved_at": "2026-07-11T06:08:42.621539+00:00", "source_path": "examples/basic/hello_world_jupyter.ipynb", "source_repo": "openai/openai-agents-python", "source_sha": "8dd3bb379968f9301984f019fe95a237caab19cc"}

# Source Document

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


# Document Diff

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
