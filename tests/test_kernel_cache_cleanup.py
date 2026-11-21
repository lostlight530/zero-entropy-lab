"""NEXUS cache hygiene must not traverse independent research or history."""
import sys
import tempfile
import unittest
from pathlib import Path

PROTOCOL = Path(__file__).resolve().parents[1] / "src" / "kernel" / "protocol"
sys.path.insert(0, str(PROTOCOL))
from nexus import cleanup_kernel_intermediates


class KernelCleanupBoundaryTests(unittest.TestCase):
    def test_cleans_only_owned_disposable_files_without_touching_evidence(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            eligible = [
                root / "src/kernel/sensory/__pycache__/module.pyc",
                root / "src/kernel/.ruff_cache/metadata",
                root / "tests/.pytest_cache/v/cache",
                root / "tests/test_runner.pyc",
            ]
            protected = [
                root / "aegis-cortex/__pycache__/research.pyc",
                root / "ballast/evidence/.pytest_cache/trace",
                root / "data/inputs/archive/legacy.pyc",
                root / "data/memories/20261121-cognitive-report.md",
                root / "AGI/workflows/revisions/__pycache__/snapshot.pyc",
                root / "historical-audits/.pytest_cache/record",
                root / "src/kernel/memory/test_cortex.db",
                root / "tests/test_cortex.db",
            ]
            for path in eligible + protected:
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_bytes(b"keep me if protected")
            external = root / "aegis-cortex"
            (root / "src/kernel/external-link").symlink_to(external, target_is_directory=True)

            removed = cleanup_kernel_intermediates(root)
            self.assertTrue(removed)
            self.assertFalse(any(path.exists() for path in eligible))
            for path in protected:
                self.assertEqual(path.read_bytes(), b"keep me if protected")
            self.assertEqual(cleanup_kernel_intermediates(root), [])
            self.assertTrue((root / "src/kernel/external-link").is_symlink())

    def test_missing_owned_directories_are_no_op(self):
        with tempfile.TemporaryDirectory() as temp:
            self.assertEqual(cleanup_kernel_intermediates(Path(temp)), [])


if __name__ == "__main__":
    unittest.main()
