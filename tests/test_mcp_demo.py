import unittest
import sys
from unittest.mock import MagicMock

# Mock the mcp module before importing mcp_demo to avoid ModuleNotFoundError
mock_mcp = MagicMock()
sys.modules["mcp"] = mock_mcp
sys.modules["mcp.server"] = MagicMock()
sys.modules["mcp.server.fastmcp"] = MagicMock()

# Add src/kernel to path
import os
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent / "src" / "kernel"))

# Mock cortex, factory, and other dependencies to avoid initialization side effects
orig_cortex = sys.modules.get("cortex")
orig_factory = sys.modules.get("factory")

mock_cortex_mod = MagicMock()
sys.modules["cortex"] = mock_cortex_mod
mock_factory_mod = MagicMock()
sys.modules["factory"] = mock_factory_mod

# Provide minimal needed for mcp_demo.py to load
mock_cortex_mod.Cortex = MagicMock()
mock_factory_mod.KnowledgeFactory = MagicMock()

from mcp_demo import validate_category, ALLOWED_CATEGORIES

# Restore sys.modules to prevent test pollution
if orig_cortex: sys.modules["cortex"] = orig_cortex
else: del sys.modules["cortex"]

if orig_factory: sys.modules["factory"] = orig_factory
else: del sys.modules["factory"]

class TestMCPDemo(unittest.TestCase):
    def test_validate_category_success(self):
        """验证有效类别不会抛出异常"""
        for category in ALLOWED_CATEGORIES:
            with self.subTest(category=category):
                try:
                    validate_category(category)
                except ValueError:
                    self.fail(f"validate_category raised ValueError unexpectedly for valid category: {category}")

    def test_validate_category_failure(self):
        """验证无效类别会抛出 ValueError"""
        invalid_categories = ["random", "invalid", "root", "../../etc/passwd"]
        for category in invalid_categories:
            with self.subTest(category=category):
                with self.assertRaises(ValueError) as cm:
                    validate_category(category)
                self.assertIn(f"Security Violation: Category '{category}' is not allowed", str(cm.exception))

    def test_validate_category_edge_cases(self):
        """验证边缘情况（空字符串、空格、大小写等）"""
        edge_cases = ["", " ", "CONCEPTS", "concepts "]
        for category in edge_cases:
            with self.subTest(category=category):
                with self.assertRaises(ValueError):
                    validate_category(category)

if __name__ == "__main__":
    print("⚔️ NEXUS PROVING GROUND: MCP Demo Unit Tests")
    unittest.main()
