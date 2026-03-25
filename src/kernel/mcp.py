import inspect
import typing
from typing import Any, Dict, List, Type
import json
from abc import ABC, abstractmethod

class BaseSkill(ABC):
    """
    基础服务协议类 (Base MCP Protocol Skill).
    自动提取 execute 方法签名以生成标准 JSON Schema。 (Automatically extracts execute signature to generate standard JSON Schema.)
    """
    name: str = ""
    description: str = ""

    @classmethod
    def get_mcp_tool_schema(cls) -> Dict[str, Any]:
        """
        元数据反射提取 (Metadata reflection and schema generation).
        """
        # Ensure name is provided, fallback to class name
        tool_name = cls.name or cls.__name__

        # Ensure description is provided, fallback to class docstring or default
        desc = cls.description or (cls.__doc__ or "").strip() or "No description provided."

        schema = {
            "name": tool_name,
            "description": desc,
            "inputSchema": {
                "type": "object",
                "properties": {},
                "required": []
            }
        }

        # Inspect the execute method signature
        sig = inspect.signature(cls.execute)

        for param_name, param in sig.parameters.items():
            if param_name == "self":
                continue

            param_schema: Dict[str, Any] = {"type": "string"} # Default to string

            # Map Python types to JSON Schema types
            if param.annotation != inspect.Parameter.empty:
                # Handle typing.Optional or Union with NoneType
                origin = typing.get_origin(param.annotation)
                args = typing.get_args(param.annotation)

                base_type = param.annotation
                is_optional = False

                if origin is typing.Union and type(None) in args:
                    is_optional = True
                    base_type = next(a for a in args if a is not type(None))

                if base_type == int:
                    param_schema["type"] = "integer"
                elif base_type == float:
                    param_schema["type"] = "number"
                elif base_type == bool:
                    param_schema["type"] = "boolean"
                elif base_type == dict or base_type == Dict:
                    param_schema["type"] = "object"
                elif base_type == list or base_type == List or origin is list or origin is List:
                    param_schema["type"] = "array"

            # Check if parameter is required
            if param.default == inspect.Parameter.empty:
                schema["inputSchema"]["required"].append(param_name)
            else:
                # Add default value to description or schema (optional but helpful)
                 param_schema["default"] = param.default

            schema["inputSchema"]["properties"][param_name] = param_schema

        return schema

    @abstractmethod
    def execute(self, **kwargs) -> Dict[str, Any]:
        """
        子类必须实现此方法。
        返回值必须是可以被 json.dumps 序列化的字典。
        """
        raise NotImplementedError


class MCPRegistry:
    """
    轻量级协议注册中心 (Lightweight Protocol Registry).
    扫描并实例化可用服务接口。(Scans and instantiates available service interfaces.)
    """
    def __init__(self):
        self._skills: Dict[str, Type[BaseSkill]] = {}

    def register(self, skill_class: Type[BaseSkill]):
        name = skill_class.name or skill_class.__name__
        self._skills[name] = skill_class

    def get_all_schemas(self) -> List[Dict[str, Any]]:
        return [skill.get_mcp_tool_schema() for skill in self._skills.values()]

    def invoke(self, name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
        if name not in self._skills:
            return {
                "isError": True,
                "content": [{"type": "text", "text": f"Skill '{name}' not found in registry."}]
            }

        skill_instance = self._skills[name]()
        try:
            # We assume kwargs match the execute signature.
            # In a robust system we might want to strictly validate arguments against the schema here,
            # but we trust the LLM/Agent to follow the schema we provided.
            result = skill_instance.execute(**arguments)
            return {
                "content": [{"type": "text", "text": json.dumps(result, ensure_ascii=False)}]
            }
        except Exception as e:
            return {
                 "isError": True,
                 "content": [{"type": "text", "text": f"Error executing skill '{name}': {str(e)}"}]
            }

# Global registry instance
registry = MCPRegistry()

# ---------------------------------------------------------
# Implement The Bullseye Skill: CortexSearchSkill
# ---------------------------------------------------------
import os
import sys

# Lazy relative import or ensure path is in sys.path
try:
    from cortex import Cortex
except ImportError:
    sys.path.append(os.path.dirname(__file__))
    from cortex import Cortex

class CortexSearchSkill(BaseSkill):
    """
    Search the stateful knowledge graph using Synaptic Associative Search.
    This exposes the core cognitive capabilities of the Nexus Cortex.
    """
    name = "cortex_search"
    description = "Search the stateful knowledge graph using Synaptic Associative Search (FTS5 + BM25 + TF-IDF)."

    def execute(self, query: str, limit: int = 5) -> Dict[str, Any]:
        """
        Execute a search query against the Cortex database.

        Args:
            query (str): The term or concept to search for.
            limit (int, optional): The maximum number of results to return. Defaults to 5.

        Returns:
            Dict[str, Any]: A list of nodes (id, name, desc, final_score).
        """
        cortex = Cortex()
        # Ensure search handles limit logic. Cortex.search currently doesn't natively accept limit,
        # so we will slice the result array or we might need to update Cortex to accept a limit.
        results = cortex.search(query)

        # We limit the results after retrieving them.
        limited_results = results[:limit]

        # Strip internal fields or return raw dictionaries
        return {"results": limited_results}

# 注册图谱检索接口 (Register graph search interface)
registry.register(CortexSearchSkill)

class CortexMemorizeSkill(BaseSkill):
    """
    图谱实体写入接口 (Graph Entity Insertion Interface).
    将新实体写入至底层数据存储。(Inserts a new entity into the underlying data store.)
    """
    name = "cortex_memorize"
    description = "Insert a new entity into the data store."

    def execute(self, id: str, name: str, desc: str, type_slug: str = "concept") -> Dict[str, Any]:
        """
        数据写入执行 (Execute data insertion).

        Args:
            id (str): Unique identifier for the entity (e.g., 'concept_singularity').
            name (str): Human-readable name of the entity.
            desc (str): Detailed description or definition.
            type_slug (str, optional): Type categorization. Defaults to "concept".

        Returns:
            Dict[str, Any]: Confirmation of insertion.
        """
        cortex = Cortex()
        try:
            cortex.add_entity(id=id, type_slug=type_slug, name=name, desc=desc, save_to_disk=True)
            return {"status": "success", "message": f"Memorized entity '{name}' ({id})."}
        except Exception as e:
            return {"status": "error", "message": str(e)}

registry.register(CortexMemorizeSkill)


class CortexSynapseSkill(BaseSkill):
    """
    图谱边创建接口 (Graph Edge Creation Interface).
    在现有实体间建立关联。(Creates a relation between two existing entities.)
    """
    name = "cortex_synapse"
    description = "Create a relation between two existing entities in the graph."

    def execute(self, source_id: str, relation: str, target_id: str, desc: str = "") -> Dict[str, Any]:
        """
        连线执行 (Execute relation mapping).

        Args:
            source_id (str): ID of the source entity.
            relation (str): The verb or type of relation (e.g., 'depends_on', 'defines').
            target_id (str): ID of the target entity.
            desc (str, optional): Optional description of the synapse.

        Returns:
            Dict[str, Any]: Confirmation of connection.
        """
        cortex = Cortex()
        try:
            cortex.connect_entities(source=source_id, relation=relation, target=target_id, desc=desc, save_to_disk=True)
            return {"status": "success", "message": f"Connected '{source_id}' --[{relation}]--> '{target_id}'."}
        except Exception as e:
            return {"status": "error", "message": str(e)}

registry.register(CortexSynapseSkill)
