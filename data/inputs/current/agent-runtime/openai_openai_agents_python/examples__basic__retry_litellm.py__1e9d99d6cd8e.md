# openai/openai-agents-python · examples/basic/retry_litellm.py

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [openai/openai-agents-python](https://github.com/openai/openai-agents-python) |
| 来源文件 | [examples/basic/retry_litellm.py](https://github.com/openai/openai-agents-python/blob/1e9d99d6cd8ea084a17ef9d8a3e49af9c4f22bf9/examples/basic/retry_litellm.py) |
| 来源版本 | `1e9d99d6cd8ea084a17ef9d8a3e49af9c4f22bf9` |
| 摄取时间 | `2026-07-11T06:08:44.580408+00:00` |
| 归属层 | `agent-runtime` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_openai_openai_agents_python_examples_basic_retry_litellm_py_1e9d99d6cd8e` |

## 本次变化

- 新增行数 `114`.
- 删除行数 `0`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- 未发现 Markdown 标题.

<details>
<summary>展开完整外部原文</summary>

import asyncio
import inspect

from agents import (
    Agent,
    ModelRetrySettings,
    ModelSettings,
    RetryDecision,
    RunConfig,
    Runner,
    retry_policies,
)


def format_error(error: object) -> str:
    if not isinstance(error, BaseException):
        return "Unknown error"
    return str(error) or error.__class__.__name__


async def main() -> None:
    apply_policies = retry_policies.any(
        # On OpenAI-backed models, provider_suggested() follows provider retry advice,
        # including fallback retryable statuses when x-should-retry is absent
        # (for example 408/409/429/5xx).
        retry_policies.provider_suggested(),
        retry_policies.retry_after(),
        retry_policies.network_error(),
        retry_policies.http_status([408, 409, 429, 500, 502, 503, 504]),
    )

    async def policy(context) -> bool | RetryDecision:
        raw_decision = apply_policies(context)
        decision: bool | RetryDecision
        if inspect.isawaitable(raw_decision):
            decision = await raw_decision
        else:
            decision = raw_decision
        if isinstance(decision, RetryDecision):
            if not decision.retry:
                print(
                    f"[retry] stop after attempt {context.attempt}/{context.max_retries + 1}: "
                    f"{format_error(context.error)}"
                )
                return False

            print(
                " | ".join(
                    part
                    for part in [
                        f"[retry] retry attempt {context.attempt}/{context.max_retries + 1}",
                        (
                            f"waiting {decision.delay:.2f}s"
                            if decision.delay is not None
                            else "using default backoff"
                        ),
                        f"reason: {decision.reason}" if decision.reason else None,
                        f"error: {format_error(context.error)}",
                    ]
                    if part is not None
                )
            )
            return decision

        if not decision:
            print(
                f"[retry] stop after attempt {context.attempt}/{context.max_retries + 1}: "
                f"{format_error(context.error)}"
            )
        return decision

    retry = ModelRetrySettings(
        max_retries=4,
        backoff={
            "initial_delay": 0.5,
            "max_delay": 5.0,
            "multiplier": 2.0,
            "jitter": True,
        },
        policy=policy,
    )

    # RunConfig-level model_settings are shared defaults for the run.
    # If an Agent also defines model_settings, the Agent wins for overlapping
    # keys, while nested objects like retry/backoff are merged.
    run_config = RunConfig(model_settings=ModelSettings(retry=retry))

    agent = Agent(
        name="Assistant",
        instructions="You are a concise assistant. Answer in 3 short bullet points at most.",
        # Prefix with litellm/ to route this request through the LiteLLM adapter.
        model="litellm/openai/gpt-4o-mini",
        # This Agent repeats the same retry config for clarity. In real code you
        # can keep shared defaults in RunConfig and only put per-agent overrides
        # here when you need different retry behavior.
        model_settings=ModelSettings(retry=retry),
    )

    print(
        "Retry support is configured. You will only see [retry] logs if a transient failure happens."
    )

    result = await Runner.run(
        agent,
        "Explain exponential backoff for API retries in plain English.",
        run_config=run_config,
    )

    print("\nFinal output:\n")
    print(result.final_output)


if __name__ == "__main__":
    asyncio.run(main())

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ 1e9d99d6cd8ea084a17ef9d8a3e49af9c4f22bf9

@@ -0,0 +1,114 @@

+import asyncio
+import inspect
+
+from agents import (
+    Agent,
+    ModelRetrySettings,
+    ModelSettings,
+    RetryDecision,
+    RunConfig,
+    Runner,
+    retry_policies,
+)
+
+
+def format_error(error: object) -> str:
+    if not isinstance(error, BaseException):
+        return "Unknown error"
+    return str(error) or error.__class__.__name__
+
+
+async def main() -> None:
+    apply_policies = retry_policies.any(
+        # On OpenAI-backed models, provider_suggested() follows provider retry advice,
+        # including fallback retryable statuses when x-should-retry is absent
+        # (for example 408/409/429/5xx).
+        retry_policies.provider_suggested(),
+        retry_policies.retry_after(),
+        retry_policies.network_error(),
+        retry_policies.http_status([408, 409, 429, 500, 502, 503, 504]),
+    )
+
+    async def policy(context) -> bool | RetryDecision:
+        raw_decision = apply_policies(context)
+        decision: bool | RetryDecision
+        if inspect.isawaitable(raw_decision):
+            decision = await raw_decision
+        else:
+            decision = raw_decision
+        if isinstance(decision, RetryDecision):
+            if not decision.retry:
+                print(
+                    f"[retry] stop after attempt {context.attempt}/{context.max_retries + 1}: "
+                    f"{format_error(context.error)}"
+                )
+                return False
+
+            print(
+                " | ".join(
+                    part
+                    for part in [
+                        f"[retry] retry attempt {context.attempt}/{context.max_retries + 1}",
+                        (
+                            f"waiting {decision.delay:.2f}s"
+                            if decision.delay is not None
+                            else "using default backoff"
+                        ),
+                        f"reason: {decision.reason}" if decision.reason else None,
+                        f"error: {format_error(context.error)}",
+                    ]
+                    if part is not None
+                )
+            )
+            return decision
+
+        if not decision:
+            print(
+                f"[retry] stop after attempt {context.attempt}/{context.max_retries + 1}: "
+                f"{format_error(context.error)}"
+            )
+        return decision
+
+    retry = ModelRetrySettings(
+        max_retries=4,
+        backoff={
+            "initial_delay": 0.5,
+            "max_delay": 5.0,
+            "multiplier": 2.0,
+            "jitter": True,
+        },
+        policy=policy,
+    )
+
+    # RunConfig-level model_settings are shared defaults for the run.
+    # If an Agent also defines model_settings, the Agent wins for overlapping
+    # keys, while nested objects like retry/backoff are merged.
+    run_config = RunConfig(model_settings=ModelSettings(retry=retry))
+
+    agent = Agent(
+        name="Assistant",
+        instructions="You are a concise assistant. Answer in 3 short bullet points at most.",
+        # Prefix with litellm/ to route this request through the LiteLLM adapter.
+        model="litellm/openai/gpt-4o-mini",
+        # This Agent repeats the same retry config for clarity. In real code you
+        # can keep shared defaults in RunConfig and only put per-agent overrides
+        # here when you need different retry behavior.
+        model_settings=ModelSettings(retry=retry),
+    )
+
+    print(
+        "Retry support is configured. You will only see [retry] logs if a transient failure happens."
+    )
+
+    result = await Runner.run(
+        agent,
+        "Explain exponential backoff for API retries in plain English.",
+        run_config=run_config,
+    )
+
+    print("\nFinal output:\n")
+    print(result.final_output)
+
+
+if __name__ == "__main__":
+    asyncio.run(main())
```

</details>
