# ℹ️ Intel: langgenius/dify 1.13.0
> Source: GitHub Releases
> Date: 2026-03-13T08:12:04.654282
> **Analysis**: 🏷️ Edge-Ready ⚠️ Breaking-Change 🔗 Agent-Protocol

## 📝 Summary
1.13.0

## 🔍 Changelog (Extract)
## 🚀 New Features

### Human-in-the-Loop (HITL)

We are introducing the **Human Input** node, a major update that transforms how AI and humans 
collaborate within Dify workflows.

**Background**

Previously, workflows were binary: either fully automated or fully manual. This created a "trust gap" in 
high-stakes scenarios where AI speed is needed but human judgment is essential. With HITL, we are making h
uman oversight a native part of the workflow architecture, allowing you to embed 
review steps directly into the execution graph.

**Key Capabilities**

- **Native Workflow Pausing:** Insert a "Human Input" node to suspend workflow execution at critical decision points.
- **Review & Edit:** The node generates a UI where humans can review AI outputs and modify variables (e.g., editing a draft or correcting data) before the process continues.
- **Action-Based Routing:** Configure custom buttons (like "Approve," "Reject," or "Escalate") that determine 
  the subsequent path of the workflow.
- **Flexible Delivery Methods:** Human input forms can be delivered via **Webapp** or **Email**. In cloud environments, Email delivery availability may depend on plan/feature settings.


## 🛠 Architecture Updates

To support the stateful pause/resume mechanism required by HITL and provide event‑subscription APIs, we refactored the execution engine: **Workflow‑based streaming executions and Advanced Chat executions now run in Celery workers**, while non‑streaming **WORKFLOW** runs still execute in the API process.
All pause/resume paths (e.g., HITL) are resumed via Celery, and events are streamed back through Redis Pub/Sub.

**For Large Deployments & Self-Hosted Users:**

We have introduced a new Celery queue named `workflow_based_app_execution`. While standard setups will work out of the box, high-throughput environments should consider the following optimizations to ensure stability and performance:

1.  **Scale Workers:** Adjust the number of workers consuming the `workflow_based_app_execution` queue based on your specific workload.
2.  **Dedicated Redis (Optional):** For large-scale deployments, we recommend configuring the new `PUBSUB_REDIS_URL` environment variable to point to a dedicated Redis instance. Using **Redis Cluster mode with Sharded PubSub** is strongly advised to ensure horizontal scalability.

## ⚠️ Important Upgrade Note

**New Celery Queue Required: `workflow_based_app_execution`**

Please ensure your deployment configuration (Docker Compose, Helm Chart, etc.) includes workers listening to the new **`workflow_based_app_execution`** queue.  
This queue is required for workflow‑based streaming executions and all resume flows (e.g., HITL); otherwise, streaming executions and resume tasks will not be processed.

## 🔧 Operational Note

**Additional Celery Queue: `api_token`**

If `ENABLE_API_TOKEN_LAST_USED_UPDATE_TASK=true`, ensure your deployment also has workers listening to **`api_token`**.
This q
