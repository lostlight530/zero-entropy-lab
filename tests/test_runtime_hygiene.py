import http.server
import importlib.util
import sys
import unittest
from pathlib import Path
from unittest import mock


PROJECT_ROOT = Path(__file__).parent.parent
KERNEL_ROOT = PROJECT_ROOT / "src" / "kernel"
for path in (KERNEL_ROOT, *(KERNEL_ROOT / layer for layer in (
    "protocol", "memory", "cognitive", "sensory", "orchestration"
))):
    sys.path.insert(0, str(path))

from nexus import NexusHandler, active_ledger_files
import hive as hive_module
import mcp as mcp_module


def load_test_runner():
    runner_path = Path(__file__).with_name("run_tests.py")
    spec = importlib.util.spec_from_file_location("nexus_test_runner", runner_path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


class ReconfigurableStream:
    def __init__(self):
        self.options = None

    def reconfigure(self, **options):
        self.options = options


class TestRuntimeHygiene(unittest.TestCase):
    def test_runner_configures_unicode_safe_output(self):
        runner = load_test_runner()
        stream = ReconfigurableStream()

        runner.configure_output(stream)

        self.assertEqual(stream.options, {"errors": "backslashreplace"})

    def test_runner_forces_utf8_for_child_processes(self):
        runner = load_test_runner()

        environment = runner.build_test_environment({"PYTHONIOENCODING": "gbk"})

        self.assertEqual(environment["PYTHONIOENCODING"], "utf-8")
    def test_request_handler_closes_cortex_when_finished(self):
        handler = NexusHandler.__new__(NexusHandler)
        handler.cortex = mock.Mock()

        with mock.patch.object(http.server.SimpleHTTPRequestHandler, "finish"):
            handler.finish()

        handler.cortex.close.assert_called_once_with()

    def test_cortex_search_closes_temporary_connection(self):
        cortex = mock.Mock()
        cortex.search.return_value = []
        context = mock.MagicMock()
        context.__enter__.return_value = cortex

        with mock.patch.object(mcp_module, "Cortex", return_value=context):
            mcp_module.CortexSearchSkill().execute("system")

        context.__exit__.assert_called_once()

    def test_hive_closes_socket_when_bind_fails(self):
        hive = hive_module.HiveMind.__new__(hive_module.HiveMind)
        hive.mcast_grp = "224.0.0.50"
        hive.mcast_port = 5050
        hive._running = True
        sock = mock.Mock()
        sock.bind.side_effect = OSError("denied")

        with mock.patch.object(hive_module.socket, "socket", return_value=sock):
            hive._listen_loop()

        sock.close.assert_called_once_with()

    def test_rebuild_selects_only_active_ledgers(self):
        import tempfile

        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            active_entity = root / "entities" / "concept.jsonl"
            active_relation = root / "relations" / "canonical.jsonl"
            archived = root / "archive" / "sealed" / "concept.jsonl"
            for path in (active_entity, active_relation, archived):
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text("{}\n", encoding="utf-8")

            selected = active_ledger_files(root)

            self.assertEqual(selected, [active_entity, active_relation])

if __name__ == "__main__":
    unittest.main()
