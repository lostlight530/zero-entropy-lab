import base64
import sys
import tempfile
import unittest
import urllib.error
from pathlib import Path
from unittest.mock import Mock, call, patch

sys.path.insert(0, str(Path(__file__).parents[1] / "src" / "kernel" / "sensory"))
from harvester import Harvester
ORCHESTRATION = Path(__file__).parents[1] / "src" / "kernel" / "orchestration"
SENSORY = Path(__file__).parents[1] / "src" / "kernel" / "sensory"
for path in (ORCHESTRATION, SENSORY):
    sys.path.insert(0, str(path))
from evolution import Evolver
from scholar import Scholar


class HarvesterContracts(unittest.TestCase):
    def test_state_rejects_non_mapping_repository_records(self):
        with self.assertRaisesRegex(ValueError, "repositories"):
            Harvester._validated_state({"repositories": "invalid"})

    def test_previous_diff_baseline_comes_from_recorded_git_blob(self):
        harvester = Harvester.__new__(Harvester)
        harvester._api = Mock(
            return_value={
                "encoding": "base64",
                "content": base64.b64encode(b"previous body").decode("ascii"),
            }
        )

        self.assertEqual(
            harvester._blob_text("owner/repo", "old-sha"),
            "previous body",
        )
        harvester._api.assert_called_once_with(
            "https://api.github.com/repos/owner/repo/git/blobs/old-sha"
        )

    def test_removed_source_is_archived_and_removed_from_state(self):
        with tempfile.TemporaryDirectory() as tmp:
            harvester = Harvester.__new__(Harvester)
            harvester.inputs = Path(tmp)
            current = harvester.inputs / "current" / "test" / "owner_repo"
            current.mkdir(parents=True)
            snapshot = current / "README.md__old.md"
            snapshot.write_text("sealed snapshot", encoding="utf-8")
            harvester.state = {
                "repositories": {
                    "owner/repo": {
                        "documents": {
                            "README.md": {
                                "sha": "old",
                                "output": snapshot.relative_to(harvester.inputs).as_posix(),
                            }
                        }
                    }
                }
            }
            harvester._api = Mock(
                side_effect=[
                    {"default_branch": "main"},
                    {"tree": [], "truncated": False},
                ]
            )
            harvester.dry = False

            changed = harvester._source(
                {
                    "repo": "owner/repo",
                    "documents": ["README.md"],
                    "ignore_patterns": [],
                    "layer": "test",
                    "primary_owner": "zero",
                }
            )

            self.assertEqual(changed, [])
            self.assertFalse(snapshot.exists())
            self.assertEqual(
                list((harvester.inputs / "archive").rglob(snapshot.name))[0].read_text(
                    encoding="utf-8"
                ),
                "sealed snapshot",
            )
            self.assertNotIn(
                "README.md",
                harvester.state["repositories"]["owner/repo"]["documents"],
            )

    def test_archive_collision_never_overwrites_different_content(self):
        with tempfile.TemporaryDirectory() as tmp:
            harvester = Harvester.__new__(Harvester)
            harvester.inputs = Path(tmp)
            current = harvester.inputs / "current" / "test" / "owner_repo"
            current.mkdir(parents=True)
            stale = current / "README.md__same.md"
            stale.write_text("current", encoding="utf-8")
            archive = (
                harvester.inputs
                / "archive"
                / "2026"
                / "07"
                / "test"
                / "owner_repo"
                / stale.name
            )
            archive.parent.mkdir(parents=True)
            archive.write_text("sealed", encoding="utf-8")

            with patch("harvester.dt.datetime") as clock:
                clock.now.return_value.strftime.return_value = "2026/07"
                with self.assertRaisesRegex(FileExistsError, "archive collision"):
                    harvester._archive_stale(
                        current / "README.md__new.md",
                        "README.md",
                        "test",
                        "owner_repo",
                    )

            self.assertEqual(stale.read_text(encoding="utf-8"), "current")
            self.assertEqual(archive.read_text(encoding="utf-8"), "sealed")

    def test_profiles_are_approved_and_zero_owned(self):
        h = Harvester(Path(__file__).parents[1])
        self.assertTrue(h.validate_profiles())

    def test_readme_is_explicitly_selected(self):
        self.assertTrue(Harvester._selected("README.md", ["docs/**"], []))

    def test_unlisted_external_link_is_not_selected(self):
        self.assertFalse(Harvester._selected("external/repo.md", ["docs/**"], []))

    def test_api_retries_transient_network_failures_with_backoff(self):
        harvester = Harvester.__new__(Harvester)
        harvester.token = ""

        with patch("harvester.urllib.request.urlopen", side_effect=urllib.error.URLError("offline")) as urlopen:
            with patch("harvester.time.sleep") as sleep:
                with self.assertRaises(urllib.error.URLError):
                    harvester._api("https://example.invalid")

        self.assertEqual(urlopen.call_count, 3)
        self.assertEqual(sleep.call_args_list, [call(1), call(2)])


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

    def test_scholar_excludes_parallel_systems_and_frontend(self):
        self.assertFalse(Scholar._is_supported_path(Path("aegis-cortex/owned.py")))
        self.assertFalse(Scholar._is_supported_path(Path("ballast/owned.md")))
        self.assertFalse(Scholar._is_supported_path(Path("index.html")))
        self.assertFalse(
            Scholar._is_supported_path(Path("src/scripts/translations.js"))
        )
        self.assertTrue(
            Scholar._is_supported_path(Path("src/kernel/sensory/harvester.py"))
        )

    def test_scholar_links_only_local_inheritance_targets(self):
        class RecordingCortex:
            def __init__(self):
                self.entities = []
                self.relations = []

            def add_entity(
                self,
                entity_id,
                type_slug,
                name,
                desc,
                save_to_disk=True,
            ):
                self.entities.append(entity_id)

            def connect_entities(
                self,
                source,
                relation,
                target,
                desc="",
                save_to_disk=True,
            ):
                self.relations.append((source, relation, target))

            def activate_memory(self, *args, **kwargs):
                pass

        with tempfile.TemporaryDirectory(dir=Path(__file__).parent) as tmp:
            source = Path(tmp) / "inheritance.py"
            source.write_text(
                "class Base:\n    pass\n\n"
                "class Child(Base):\n    pass\n\n"
                "class External(http.server.BaseHTTPRequestHandler):\n    pass\n",
                encoding="utf-8",
            )
            scholar = Scholar.__new__(Scholar)
            scholar.cortex = RecordingCortex()
            scholar._analyze_python_ast(source, "file_inheritance_py")

            self.assertIn(
                (
                    "file_inheritance_py__class_Child",
                    "inherits_from",
                    "file_inheritance_py__class_Base",
                ),
                scholar.cortex.relations,
            )
            self.assertFalse(
                any(target.startswith("class_") for _, _, target in scholar.cortex.relations)
            )

    def test_scholar_normalizes_generated_chinese_periods(self):
        self.assertEqual(
            Scholar._generated_text("\u4e2d\u6587\u3002\u4e0b\u4e00\u53e5\u3002"),
            "\u4e2d\u6587.\u4e0b\u4e00\u53e5.",
        )

if __name__ == "__main__":
    unittest.main()
