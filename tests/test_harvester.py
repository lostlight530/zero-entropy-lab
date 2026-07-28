import base64
import hashlib
import os
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
                    {
                        "sha": "commit-sha",
                        "commit": {"tree": {"sha": "tree-sha"}},
                    },
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

    def test_source_snapshot_uses_pinned_commit_tree_and_blob(self):
        with tempfile.TemporaryDirectory() as tmp:
            harvester = Harvester.__new__(Harvester)
            harvester.inputs = Path(tmp)
            harvester.state = {"repositories": {}}
            harvester.dry = False
            commit_sha = "c" * 40
            tree_sha = "t" * 40
            blob_sha = "b" * 40
            def response(url):
                if url == "https://api.github.com/repos/owner/repo":
                    return {"default_branch": "main"}
                if url.endswith("/commits/main"):
                    return {
                        "sha": commit_sha,
                        "commit": {"tree": {"sha": tree_sha}},
                    }
                if "/git/trees/" in url:
                    return {
                        "tree": [
                            {"type": "blob", "path": "README.md", "sha": blob_sha}
                        ],
                        "truncated": False,
                    }
                if "/git/blobs/" in url:
                    return {
                        "encoding": "base64",
                        "content": base64.b64encode(b"# Source\n").decode("ascii"),
                    }
                raise AssertionError(f"unexpected API URL: {url}")

            harvester._api = Mock(side_effect=response)

            changed = harvester._source(
                {
                    "repo": "owner/repo",
                    "documents": ["README.md"],
                    "ignore_patterns": [],
                    "layer": "test",
                    "primary_owner": "zero",
                }
            )

            rendered = (harvester.inputs / changed[0]).read_text(encoding="utf-8")
            document = harvester.state["repositories"]["owner/repo"]["documents"]["README.md"]
            self.assertIn(
                f"https://github.com/owner/repo/blob/{commit_sha}/README.md",
                rendered,
            )
            self.assertNotIn(f"/blob/{blob_sha}/README.md", rendered)
            self.assertEqual(document["commit_sha"], commit_sha)
            self.assertEqual(document["tree_sha"], tree_sha)
            self.assertEqual(document["blob_sha"], blob_sha)
            self.assertEqual(
                harvester._api.call_args_list[:3],
                [
                    call("https://api.github.com/repos/owner/repo"),
                    call("https://api.github.com/repos/owner/repo/commits/main"),
                    call(
                        f"https://api.github.com/repos/owner/repo/git/trees/{tree_sha}?recursive=1"
                    ),
                ],
            )

    def test_legacy_blob_state_is_migrated_once(self):
        with tempfile.TemporaryDirectory() as tmp:
            harvester = Harvester.__new__(Harvester)
            harvester.inputs = Path(tmp)
            old_snapshot = (
                harvester.inputs
                / "current"
                / "test"
                / "owner_repo"
                / "README.md__bbbbbbbbbbbb.md"
            )
            old_snapshot.parent.mkdir(parents=True)
            old_snapshot.write_text("legacy", encoding="utf-8")
            source = "# Source\n"
            digest = hashlib.sha256(
                Harvester._normalized(source).encode()
            ).hexdigest()
            blob_sha = "b" * 40
            commit_sha = "c" * 40
            tree_sha = "t" * 40
            harvester.state = {
                "repositories": {
                    "owner/repo": {
                        "documents": {
                            "README.md": {
                                "sha": blob_sha,
                                "content_hash": digest,
                                "entity_id": "existing-entity",
                                "output": old_snapshot.relative_to(
                                    harvester.inputs
                                ).as_posix(),
                            }
                        }
                    }
                }
            }
            def response(url):
                if url == "https://api.github.com/repos/owner/repo":
                    return {"default_branch": "main"}
                if url.endswith("/commits/main"):
                    return {
                        "sha": commit_sha,
                        "commit": {"tree": {"sha": tree_sha}},
                    }
                if "/git/trees/" in url:
                    return {
                        "tree": [
                            {"type": "blob", "path": "README.md", "sha": blob_sha}
                        ],
                        "truncated": False,
                    }
                if "/git/blobs/" in url:
                    return {
                        "encoding": "base64",
                        "content": base64.b64encode(source.encode()).decode("ascii"),
                    }
                raise AssertionError(f"unexpected API URL: {url}")

            harvester._api = Mock(side_effect=response)
            harvester.dry = False
            profile = {
                "repo": "owner/repo",
                "documents": ["README.md"],
                "ignore_patterns": [],
                "layer": "test",
                "primary_owner": "zero",
            }

            first = harvester._source(profile)
            second = harvester._source(profile)

            self.assertEqual(len(first), 1)
            self.assertEqual(second, [])
            document = harvester.state["repositories"]["owner/repo"]["documents"]["README.md"]
            self.assertEqual(document["commit_sha"], commit_sha)
            self.assertEqual(document["tree_sha"], tree_sha)
            self.assertEqual(document["blob_sha"], blob_sha)
            blob_calls = [
                item
                for item in harvester._api.call_args_list
                if "/git/blobs/" in item.args[0]
            ]
            self.assertEqual(len(blob_calls), 1)

    def test_missing_state_requires_explicit_bootstrap(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "inputs").mkdir()
            (root / "source_profiles.json").write_text(
                '{"owner":"zero","sources":[],"schema_version":2}',
                encoding="utf-8",
            )

            with self.assertRaisesRegex(FileNotFoundError, "state"):
                Harvester(root)

            with patch.dict(os.environ, {"HARVESTER_BOOTSTRAP": "1"}):
                harvester = Harvester(root)

            self.assertEqual(harvester.state["schema_version"], 4)
            self.assertEqual(harvester.state["repositories"], {})

    def test_corrupt_state_fails_closed(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "inputs").mkdir()
            (root / "source_profiles.json").write_text(
                '{"owner":"zero","sources":[],"schema_version":2}',
                encoding="utf-8",
            )
            (root / "inputs" / ".harvester_state.json").write_text(
                "{",
                encoding="utf-8",
            )

            with self.assertRaisesRegex(ValueError, "invalid JSON"):
                Harvester(root)

    def test_evolver_archive_collision_preserves_both_files(self):
        with tempfile.TemporaryDirectory() as tmp:
            inputs = Path(tmp) / "inputs"
            inputs.mkdir()
            incoming = inputs / "incoming.md"
            incoming.write_text("new", encoding="utf-8")
            now = __import__("datetime").datetime.now()
            archived = (
                inputs
                / "archive"
                / str(now.year)
                / f"{now.month:02d}"
                / incoming.name
            )
            archived.parent.mkdir(parents=True)
            archived.write_text("sealed", encoding="utf-8")
            evolver = Evolver.__new__(Evolver)
            evolver.inputs_path = inputs

            with self.assertRaisesRegex(FileExistsError, "archive collision"):
                evolver._archive_inputs()

            self.assertEqual(incoming.read_text(encoding="utf-8"), "new")
            self.assertEqual(archived.read_text(encoding="utf-8"), "sealed")

    def test_evolver_propagates_ponder_failure(self):
        evolver = Evolver.__new__(Evolver)
        evolver.project_root = Path(".")

        with patch("evolution.ReasoningEngine", side_effect=RuntimeError("ponder failed")):
            with self.assertRaisesRegex(RuntimeError, "ponder failed"):
                evolver._incubate_ideas()

    def test_evolver_rejects_error_result(self):
        evolver = Evolver.__new__(Evolver)
        evolver.project_root = Path(".")
        reasoner = Mock()
        reasoner.ponder.return_value = {"error": "invalid graph"}

        with patch("evolution.ReasoningEngine", return_value=reasoner):
            with self.assertRaisesRegex(RuntimeError, "invalid graph"):
                evolver._incubate_ideas()

    def test_branch_runs_enforce_write_boundary_before_sync(self):
        workflow = (
            Path(__file__).parents[1]
            / ".github"
            / "workflows"
            / "nexus-life-cycle.yml"
        ).read_text(encoding="utf-8")
        self.assertIn("- name: Verify Lifecycle Write Boundary", workflow)
        boundary = workflow.index("- name: Verify Lifecycle Write Boundary")
        sync = workflow.index("- name: Sync World-Line")
        boundary_block = workflow[boundary:sync]

        self.assertLess(boundary, sync)
        self.assertNotIn("if: github.ref == 'refs/heads/main'", boundary_block)

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