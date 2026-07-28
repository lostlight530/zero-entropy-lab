# vllm-project/vllm · docs/design/io_processor_plugins.md

> 当前有效快照. 中文说明只使用英文句号. 外部原文保持来源原貌.

## 一眼看懂

| 字段 | 值 |
| --- | --- |
| 来源仓库 | [vllm-project/vllm](https://github.com/vllm-project/vllm) |
| 来源文件 | [docs/design/io_processor_plugins.md](https://github.com/vllm-project/vllm/blob/68b5321086724cff7e4737d9790927d05b83c8e8/docs/design/io_processor_plugins.md) |
| 来源版本 | `68b5321086724cff7e4737d9790927d05b83c8e8` |
| 摄取时间 | `2026-07-11T06:09:10.311289+00:00` |
| 归属层 | `serving-inference` |
| 可信度 | `1.0` |
| 记忆实体 | `doc_vllm_project_vllm_docs_design_io_processor_plugins_md_68b532108672` |

## 本次变化

- 新增行数 `94`.
- 删除行数 `0`.
- 内容哈希变化时才生成新快照.

## 阅读导航

- IO Processor Plugins
- Writing an IO Processor Plugin
- Using an IO Processor plugin

<details>
<summary>展开完整外部原文</summary>

# IO Processor Plugins

IO Processor plugins are a feature that allows pre- and post-processing of the model input and output for pooling models. The idea is that users are allowed to pass a custom input to vLLM that is converted into one or more model prompts and fed to the model `encode` method. One potential use-case of such plugins is that of using vLLM for generating multi-modal data. Say users feed an image to vLLM and get an image in output.

When performing an inference with IO Processor plugins, the prompt type is defined by the plugin and the same is valid for the final request output. vLLM does not perform any validation of input/output data, and it is up to the plugin to ensure the correct data is being fed to the model and returned to the user. As of now these plugins support only pooling models and can be triggered via the `encode` method in `LLM` and `AsyncLLM`, or in online serving mode via the `/pooling` endpoint.

## Writing an IO Processor Plugin

IO Processor plugins implement the [`IOProcessor`][vllm.plugins.io_processors.interface.IOProcessor] interface:

```python
IOProcessorInput = TypeVar("IOProcessorInput")
IOProcessorOutput = TypeVar("IOProcessorOutput")

class IOProcessor(ABC, Generic[IOProcessorInput, IOProcessorOutput]):
    """Abstract interface for pre/post-processing of engine I/O."""

    def __init__(self, vllm_config: VllmConfig, renderer: BaseRenderer):
        super().__init__()

        self.vllm_config = vllm_config

    def parse_data(self, data: object) -> IOProcessorInput:
        raise NotImplementedError

    def merge_sampling_params(
        self,
        params: SamplingParams | None = None,
    ) -> SamplingParams:
        return params or SamplingParams()

    def merge_pooling_params(
        self,
        params: PoolingParams | None = None,
    ) -> PoolingParams:
        return params or PoolingParams(task="plugin")

    @abstractmethod
    def pre_process(
        self,
        prompt: IOProcessorInput,
        request_id: str | None = None,
        **kwargs,
    ) -> PromptType | Sequence[PromptType]:
        raise NotImplementedError

    async def pre_process_async(
        self,
        prompt: IOProcessorInput,
        request_id: str | None = None,
        **kwargs,
    ) -> PromptType | Sequence[PromptType]:
        return self.pre_process(prompt, request_id, **kwargs)

    @abstractmethod
    def post_process(
        self,
        model_output: Sequence[PoolingRequestOutput],
        request_id: str | None = None,
        **kwargs,
    ) -> IOProcessorOutput:
        raise NotImplementedError

    async def post_process_async(
        self,
        model_output: AsyncGenerator[tuple[int, PoolingRequestOutput]],
        request_id: str | None = None,
        **kwargs,
    ) -> IOProcessorOutput:
        # We cannot guarantee outputs are returned in the same order they were
        # fed to vLLM.
        # Let's sort them by id before post_processing
        sorted_output = sorted(
            [(i, item) async for i, item in model_output], key=lambda output: output[0]
        )
        collected_output = [output[1] for output in sorted_output]
        return self.post_process(collected_output, request_id=request_id, **kwargs)
```

The `parse_data` method is used for validating the user data and converting it into the input expected by the `pre_process*` methods.
The `merge_sampling_params` and `merge_pooling_params` methods merge input `SamplingParams` or `PoolingParams` (if any) with the default one.
The `pre_process*` methods take the validated plugin input to generate vLLM's model prompts for regular inference.
The `post_process*` methods take `PoolingRequestOutput` objects as input and generate a custom plugin output.

An example implementation of a plugin that enables generating geotiff images with the PrithviGeospatialMAE model is available [here](https://github.com/IBM/terratorch/tree/main/terratorch/vllm/plugins/segmentation). Please, also refer to our online ([examples/pooling/plugin/prithvi_geospatial_mae_online.py](../../examples/pooling/plugin/prithvi_geospatial_mae_online.py)) and offline ([examples/pooling/plugin/prithvi_geospatial_mae_io_processor.py](../../examples/pooling/plugin/prithvi_geospatial_mae_io_processor.py)) inference examples.

## Using an IO Processor plugin

IO Processor plugins are loaded at engine startup and there are two methods for specifying the name of the plugin to be loaded:

1. Via vLLM's `EngineArgs`: setting the `io_processor_plugin` argument in the `EngineArgs` used to initialize the `AsyncLLM`. The same can be achieved by passing the `io_processor_plugin` argument to `LLM` in offline mode, or by passing the `--io-processor-plugin` argument in serving mode.
2. Via the model HF configuration: adding an `io_processor_plugin` field to the model config (config.json).

The order also determines method priority. i.e., setting the plugin name via `EngineArgs` will override any plugin name specified in the model HF config (config.json).

</details>

<details>
<summary>展开完整版本差异</summary>

```diff
--- previous

+++ 68b5321086724cff7e4737d9790927d05b83c8e8

@@ -0,0 +1,94 @@

+# IO Processor Plugins
+
+IO Processor plugins are a feature that allows pre- and post-processing of the model input and output for pooling models. The idea is that users are allowed to pass a custom input to vLLM that is converted into one or more model prompts and fed to the model `encode` method. One potential use-case of such plugins is that of using vLLM for generating multi-modal data. Say users feed an image to vLLM and get an image in output.
+
+When performing an inference with IO Processor plugins, the prompt type is defined by the plugin and the same is valid for the final request output. vLLM does not perform any validation of input/output data, and it is up to the plugin to ensure the correct data is being fed to the model and returned to the user. As of now these plugins support only pooling models and can be triggered via the `encode` method in `LLM` and `AsyncLLM`, or in online serving mode via the `/pooling` endpoint.
+
+## Writing an IO Processor Plugin
+
+IO Processor plugins implement the [`IOProcessor`][vllm.plugins.io_processors.interface.IOProcessor] interface:
+
+```python
+IOProcessorInput = TypeVar("IOProcessorInput")
+IOProcessorOutput = TypeVar("IOProcessorOutput")
+
+class IOProcessor(ABC, Generic[IOProcessorInput, IOProcessorOutput]):
+    """Abstract interface for pre/post-processing of engine I/O."""
+
+    def __init__(self, vllm_config: VllmConfig, renderer: BaseRenderer):
+        super().__init__()
+
+        self.vllm_config = vllm_config
+
+    def parse_data(self, data: object) -> IOProcessorInput:
+        raise NotImplementedError
+
+    def merge_sampling_params(
+        self,
+        params: SamplingParams | None = None,
+    ) -> SamplingParams:
+        return params or SamplingParams()
+
+    def merge_pooling_params(
+        self,
+        params: PoolingParams | None = None,
+    ) -> PoolingParams:
+        return params or PoolingParams(task="plugin")
+
+    @abstractmethod
+    def pre_process(
+        self,
+        prompt: IOProcessorInput,
+        request_id: str | None = None,
+        **kwargs,
+    ) -> PromptType | Sequence[PromptType]:
+        raise NotImplementedError
+
+    async def pre_process_async(
+        self,
+        prompt: IOProcessorInput,
+        request_id: str | None = None,
+        **kwargs,
+    ) -> PromptType | Sequence[PromptType]:
+        return self.pre_process(prompt, request_id, **kwargs)
+
+    @abstractmethod
+    def post_process(
+        self,
+        model_output: Sequence[PoolingRequestOutput],
+        request_id: str | None = None,
+        **kwargs,
+    ) -> IOProcessorOutput:
+        raise NotImplementedError
+
+    async def post_process_async(
+        self,
+        model_output: AsyncGenerator[tuple[int, PoolingRequestOutput]],
+        request_id: str | None = None,
+        **kwargs,
+    ) -> IOProcessorOutput:
+        # We cannot guarantee outputs are returned in the same order they were
+        # fed to vLLM.
+        # Let's sort them by id before post_processing
+        sorted_output = sorted(
+            [(i, item) async for i, item in model_output], key=lambda output: output[0]
+        )
+        collected_output = [output[1] for output in sorted_output]
+        return self.post_process(collected_output, request_id=request_id, **kwargs)
+```
+
+The `parse_data` method is used for validating the user data and converting it into the input expected by the `pre_process*` methods.
+The `merge_sampling_params` and `merge_pooling_params` methods merge input `SamplingParams` or `PoolingParams` (if any) with the default one.
+The `pre_process*` methods take the validated plugin input to generate vLLM's model prompts for regular inference.
+The `post_process*` methods take `PoolingRequestOutput` objects as input and generate a custom plugin output.
+
+An example implementation of a plugin that enables generating geotiff images with the PrithviGeospatialMAE model is available [here](https://github.com/IBM/terratorch/tree/main/terratorch/vllm/plugins/segmentation). Please, also refer to our online ([examples/pooling/plugin/prithvi_geospatial_mae_online.py](../../examples/pooling/plugin/prithvi_geospatial_mae_online.py)) and offline ([examples/pooling/plugin/prithvi_geospatial_mae_io_processor.py](../../examples/pooling/plugin/prithvi_geospatial_mae_io_processor.py)) inference examples.
+
+## Using an IO Processor plugin
+
+IO Processor plugins are loaded at engine startup and there are two methods for specifying the name of the plugin to be loaded:
+
+1. Via vLLM's `EngineArgs`: setting the `io_processor_plugin` argument in the `EngineArgs` used to initialize the `AsyncLLM`. The same can be achieved by passing the `io_processor_plugin` argument to `LLM` in offline mode, or by passing the `--io-processor-plugin` argument in serving mode.
+2. Via the model HF configuration: adding an `io_processor_plugin` field to the model config (config.json).
+
+The order also determines method priority. i.e., setting the plugin name via `EngineArgs` will override any plugin name specified in the model HF config (config.json).
```

</details>
