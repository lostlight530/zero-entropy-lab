import inspect
import typing
from typing import Any, Dict, List, Type
import json
from abc import ABC, abstractmethod

class BaseSkill(ABC):
    """
    零熵 MCP 协议层的基础技能类 (Zero-Entropy MCP Skill Base).
    任何继承此类的子类，都将自动被 MCP Registry 发现，并将其 `execute` 方法的签名转换为标准的 JSON Schema。
    """
    name: str = ""
    description: str = ""

    @classmethod
    def get_mcp_tool_schema(cls) -> Dict[str, Any]:
        """
        核心魔法：利用 Python 原生 inspect 和 typing 提取方法签名，纯手工拼接 JSON Schema。
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
    极简的 Tool Registry，负责扫描并实例化系统中的可用 Skills。
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

# Automatically register the bullseye skill
registry.register(CortexSearchSkill)
