import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parents[1] / "src" / "kernel" / "sensory"))
from harvester import Harvester
ORCHESTRATION = Path(__file__).parents[1] / "src" / "kernel" / "orchestration"
SENSORY = Path(__file__).parents[1] / "src" / "kernel" / "sensory"
for path in (ORCHESTRATION, SENSORY):
    sys.path.insert(0, str(path))
from evolution import Evolver
from scholar import Scholar


class HarvesterContracts(unittest.TestCase):
    def test_profiles_are_approved_and_zero_owned(self):
        h = Harvester(Path(__file__).parents[1])
        self.assertTrue(h.validate_profiles())

    def test_readme_is_explicitly_selected(self):
        self.assertTrue(Harvester._selected("README.md", ["docs/**"], []))

    def test_unlisted_external_link_is_not_selected(self):
        self.assertFalse(Harvester._selected("external/repo.md", ["docs/**"], []))


    def test_evolver_keeps_input_contract_out_of_monthly_archive(self):
        with tempfile.TemporaryDirectory(dir=Path(__file__).parent) as tmp:
            inputs = Path(tmp) / "inputs"
            inputs.mkdir()
            contract = inputs / "ARCHIVE_AND_HARVESTER.md"
            contract.write_text("contract", encoding="utf-8")
            incoming = inputs / "incoming.md"
            incoming.write_text("input", encoding="utf-8")
            evolver = Evolver.__new__(Evolver)
            evolver.inputs_path = inputs

            evolver._archive_inputs()

            self.assertTrue(contract.exists())
            self.assertFalse(incoming.exists())

    def test_python_symbols_are_namespaced_by_source_file(self):
        class RecordingCortex:
            def __init__(self):
                self.entities = []
                self.relations = []

            def add_entity(self, entity_id, type_slug, name, desc, save_to_disk=True):
                self.entities.append(entity_id)

            def connect_entities(self, source, relation, target, desc="", save_to_disk=True):
                self.relations.append((source, relation, target))

            def activate_memory(self, *args, **kwargs):
                pass

        with tempfile.TemporaryDirectory(dir=Path(__file__).parent) as tmp:
            first = Path(tmp) / "first.py"
            second = Path(tmp) / "second.py"
            first.write_text("def run():\n    pass\n", encoding="utf-8")
            second.write_text("def run():\n    pass\n", encoding="utf-8")
            scholar = Scholar.__new__(Scholar)
            scholar.cortex = RecordingCortex()

            scholar._analyze_python_ast(first, "file_first_py")
            scholar._analyze_python_ast(second, "file_second_py")

            self.assertIn("file_first_py__func_run", scholar.cortex.entities)
            self.assertIn("file_second_py__func_run", scholar.cortex.entities)

if __name__ == "__main__":
    unittest.main()
