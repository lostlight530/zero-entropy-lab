import base64
import copy
import hashlib
import json
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import Mock

sys.path.insert(0, str(Path(__file__).parents[1] / "src" / "kernel" / "sensory"))
from harvester import Harvester


class HarvesterProvenanceContracts(unittest.TestCase):
    @staticmethod
    def _write_snapshot(inputs, commit_sha, tree_sha, blob_sha, *, body="# Stable body"):
        output = (
            inputs
            / "current"
            / "test"
            / "owner_repo"
            / f"README.md__{blob_sha[:12]}__{commit_sha[:12]}.md"
        )
        output.parent.mkdir(parents=True)
        output.write_text(
            "\n".join(
                [
                    "# owner/repo · README.md",
                    "",
                    f"| 来源文件 | [README.md](https://github.com/owner/repo/blob/{commit_sha}/README.md) |",
                    f"| 来源版本 | `{commit_sha}` |",
                    f"| 来源目录 Tree | `{tree_sha}` |",
                    f"| 来源内容 Blob | `{blob_sha}` |",
                    "",
                    "<details>",
                    "<summary>source</summary>",
                    "",
                    body,
                    "",
                    "</details>",
                    "",
                    "<details>",
                    "<summary>diff</summary>",
                    "",
                    "```diff",
                    "```",
                    "",
                    "</details>",
                ]
            ),
            encoding="utf-8",
        )
        return output

    @staticmethod
    def _profile():
        return {
            "repo": "owner/repo",
            "documents": ["README.md"],
            "ignore_patterns": [],
            "layer": "test",
            "primary_owner": "zero",
        }

    def test_normalized_noise_does_not_mutate_persisted_provenance(self):
        with tempfile.TemporaryDirectory() as tmp:
            harvester = Harvester.__new__(Harvester)
            harvester.inputs = Path(tmp)
            old_commit, old_tree, old_blob = "a" * 40, "b" * 40, "c" * 40
            new_commit, new_tree, new_blob = "d" * 40, "e" * 40, "f" * 40
            snapshot = self._write_snapshot(
                harvester.inputs,
                old_commit,
                old_tree,
                old_blob,
            )
            source = "![badge](https://img.shields.io/old)\n# Stable body\n"
            digest = hashlib.sha256(Harvester._normalized(source).encode()).hexdigest()
            harvester.state = {
                "schema_version": 5,
                "repositories": {
                    "owner/repo": {
                        "documents": {
                            "README.md": {
                                "sha": old_blob,
                                "blob_sha": old_blob,
                                "commit_sha": old_commit,
                                "tree_sha": old_tree,
                                "observed_blob_sha": old_blob,
                                "observed_commit_sha": old_commit,
                                "observed_tree_sha": old_tree,
                                "content_hash": digest,
                                "entity_id": "existing-entity",
                                "output": snapshot.relative_to(harvester.inputs).as_posix(),
                            }
                        }
                    }
                },
            }

            def response(url):
                if url == "https://api.github.com/repos/owner/repo":
                    return {"default_branch": "main"}
                if url.endswith("/commits/main"):
                    return {"sha": new_commit, "commit": {"tree": {"sha": new_tree}}}
                if "/git/trees/" in url:
                    return {
                        "tree": [{"type": "blob", "path": "README.md", "sha": new_blob}],
                        "truncated": False,
                    }
                if url.endswith(f"/git/blobs/{new_blob}"):
                    return {
                        "encoding": "base64",
                        "content": base64.b64encode(
                            b"![badge](https://img.shields.io/new)\n# Stable body\n"
                        ).decode("ascii"),
                    }
                raise AssertionError(f"unexpected API URL: {url}")

            harvester._api = Mock(side_effect=response)
            harvester.dry = False

            self.assertEqual(harvester._source(self._profile()), [])
            document = harvester.state["repositories"]["owner/repo"]["documents"]["README.md"]
            self.assertEqual(
                (document["commit_sha"], document["tree_sha"], document["blob_sha"]),
                (old_commit, old_tree, old_blob),
            )
            self.assertEqual(
                (
                    document["observed_commit_sha"],
                    document["observed_tree_sha"],
                    document["observed_blob_sha"],
                ),
                (old_commit, old_tree, old_blob),
            )
            self.assertTrue(snapshot.exists())
            self.assertFalse((harvester.inputs / "archive").exists())

    def test_unchanged_blob_does_not_mutate_persisted_document_state(self):
        harvester = Harvester.__new__(Harvester)
        blob_sha = "c" * 40
        old_commit, old_tree = "a" * 40, "b" * 40
        new_commit, new_tree = "d" * 40, "e" * 40
        harvester.state = {
            "schema_version": 5,
            "repositories": {
                "owner/repo": {
                    "documents": {
                        "README.md": {
                            "sha": blob_sha,
                            "blob_sha": blob_sha,
                            "commit_sha": old_commit,
                            "tree_sha": old_tree,
                            "observed_blob_sha": blob_sha,
                            "observed_commit_sha": old_commit,
                            "observed_tree_sha": old_tree,
                            "content_hash": "digest",
                            "entity_id": "existing-entity",
                            "output": "current/test/owner_repo/README.md",
                        }
                    }
                }
            },
        }
        harvester.dry = False
        responses = [
            {"default_branch": "main"},
            {"sha": new_commit, "commit": {"tree": {"sha": new_tree}}},
            {
                "tree": [{"type": "blob", "path": "README.md", "sha": blob_sha}],
                "truncated": False,
            },
        ]
        harvester._api = Mock(side_effect=responses + copy.deepcopy(responses))

        self.assertEqual(harvester._source(self._profile()), [])
        first = copy.deepcopy(
            harvester.state["repositories"]["owner/repo"]["documents"]["README.md"]
        )
        self.assertEqual(harvester._source(self._profile()), [])
        self.assertEqual(
            harvester.state["repositories"]["owner/repo"]["documents"]["README.md"],
            first,
        )
        document = harvester.state["repositories"]["owner/repo"]["documents"]["README.md"]
        self.assertEqual(
            (document["commit_sha"], document["tree_sha"], document["blob_sha"]),
            (old_commit, old_tree, blob_sha),
        )
        self.assertEqual(
            (
                document["observed_commit_sha"],
                document["observed_tree_sha"],
                document["observed_blob_sha"],
            ),
            (old_commit, old_tree, blob_sha),
        )

    def test_schema_four_recovers_snapshot_provenance_once(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            inputs = root / "inputs"
            snapshot_commit, snapshot_tree, snapshot_blob = "a" * 40, "b" * 40, "c" * 40
            observed_commit, observed_tree, observed_blob = "d" * 40, "e" * 40, "f" * 40
            output = self._write_snapshot(
                inputs,
                snapshot_commit,
                snapshot_tree,
                snapshot_blob,
            )
            (root / "source_profiles.json").write_text(
                '{"owner":"zero","sources":[{"repo":"owner/repo","primary_owner":"zero","promotion_approved":true,"layer":"test","documents":["README.md"]}]}',
                encoding="utf-8",
            )
            (inputs / ".harvester_state.json").write_text(
                json.dumps(
                    {
                        "schema_version": 4,
                        "repositories": {
                            "owner/repo": {
                                "documents": {
                                    "README.md": {
                                        "sha": observed_blob,
                                        "blob_sha": observed_blob,
                                        "commit_sha": observed_commit,
                                        "tree_sha": observed_tree,
                                        "content_hash": "digest",
                                        "entity_id": "existing-entity",
                                        "output": output.relative_to(inputs).as_posix(),
                                    }
                                }
                            }
                        },
                    }
                ),
                encoding="utf-8",
            )

            harvester = Harvester(root)
            first = copy.deepcopy(harvester.state)
            harvester._migrate_and_validate_snapshot_state(5)
            self.assertEqual(harvester.state, first)
            document = harvester.state["repositories"]["owner/repo"]["documents"]["README.md"]
            self.assertEqual(harvester.state["schema_version"], 5)
            self.assertEqual(
                (document["commit_sha"], document["tree_sha"], document["blob_sha"]),
                (snapshot_commit, snapshot_tree, snapshot_blob),
            )
            self.assertEqual(
                (
                    document["observed_commit_sha"],
                    document["observed_tree_sha"],
                    document["observed_blob_sha"],
                ),
                (observed_commit, observed_tree, observed_blob),
            )

    def test_schema_five_rejects_state_output_provenance_mismatch(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            inputs = root / "inputs"
            output = self._write_snapshot(inputs, "a" * 40, "b" * 40, "c" * 40)
            (root / "source_profiles.json").write_text(
                '{"owner":"zero","sources":[{"repo":"owner/repo","primary_owner":"zero","promotion_approved":true,"layer":"test","documents":["README.md"]}]}',
                encoding="utf-8",
            )
            (inputs / ".harvester_state.json").write_text(
                json.dumps(
                    {
                        "schema_version": 5,
                        "repositories": {
                            "owner/repo": {
                                "documents": {
                                    "README.md": {
                                        "sha": "f" * 40,
                                        "blob_sha": "f" * 40,
                                        "commit_sha": "d" * 40,
                                        "tree_sha": "e" * 40,
                                        "observed_blob_sha": "f" * 40,
                                        "observed_commit_sha": "d" * 40,
                                        "observed_tree_sha": "e" * 40,
                                        "content_hash": "digest",
                                        "entity_id": "existing-entity",
                                        "output": output.relative_to(inputs).as_posix(),
                                    }
                                }
                            }
                        },
                    }
                ),
                encoding="utf-8",
            )

            with self.assertRaisesRegex(ValueError, "snapshot provenance"):
                Harvester(root)

    def test_schema_five_rejects_noncanonical_current_output_path(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            inputs = root / "inputs"
            commit_sha, tree_sha, blob_sha = "a" * 40, "b" * 40, "c" * 40
            self._write_snapshot(inputs, commit_sha, tree_sha, blob_sha)
            (root / "source_profiles.json").write_text(
                '{"owner":"zero","sources":[{"repo":"owner/repo","primary_owner":"zero","promotion_approved":true,"layer":"test","documents":["README.md"]}]}',
                encoding="utf-8",
            )
            noncanonical = (
                "current/test/../test/owner_repo/"
                f"README.md__{blob_sha[:12]}__{commit_sha[:12]}.md"
            )
            (inputs / ".harvester_state.json").write_text(
                json.dumps(
                    {
                        "schema_version": 5,
                        "repositories": {
                            "owner/repo": {
                                "documents": {
                                    "README.md": {
                                        "sha": blob_sha,
                                        "blob_sha": blob_sha,
                                        "commit_sha": commit_sha,
                                        "tree_sha": tree_sha,
                                        "observed_blob_sha": blob_sha,
                                        "observed_commit_sha": commit_sha,
                                        "observed_tree_sha": tree_sha,
                                        "content_hash": "digest",
                                        "entity_id": "existing-entity",
                                        "output": noncanonical,
                                    }
                                }
                            }
                        },
                    }
                ),
                encoding="utf-8",
            )

            with self.assertRaisesRegex(ValueError, "canonical current path"):
                Harvester(root)

    def test_schema_four_recovers_unique_current_when_old_output_is_missing(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            inputs = root / "inputs"
            commit_sha, tree_sha, blob_sha = "a" * 40, "b" * 40, "c" * 40
            current = self._write_snapshot(inputs, commit_sha, tree_sha, blob_sha)
            (root / "source_profiles.json").write_text(
                '{"owner":"zero","sources":[{"repo":"owner/repo","primary_owner":"zero","promotion_approved":true,"layer":"test","documents":["README.md"]}]}',
                encoding="utf-8",
            )
            (inputs / ".harvester_state.json").write_text(
                json.dumps({"schema_version":4,"repositories":{"owner/repo":{"documents":{"README.md":{"sha":"f"*40,"blob_sha":"f"*40,"commit_sha":"d"*40,"tree_sha":"e"*40,"content_hash":"0"*64,"entity_id":"existing-entity","output":"current/test/owner_repo/README.md__old__old.md"}}}}}),
                encoding="utf-8",
            )

            document = Harvester(root).state["repositories"]["owner/repo"]["documents"]["README.md"]

            self.assertEqual(document["output"], current.relative_to(inputs).as_posix())
            self.assertEqual(document["commit_sha"], commit_sha)
            self.assertEqual(
                document["content_hash"],
                hashlib.sha256(Harvester._normalized("# Stable body").encode()).hexdigest(),
            )

    def test_schema_five_rejects_snapshot_body_hash_mismatch(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            inputs = root / "inputs"
            commit_sha, tree_sha, blob_sha = "a" * 40, "b" * 40, "c" * 40
            output = self._write_snapshot(
                inputs, commit_sha, tree_sha, blob_sha, body="# Tampered body"
            )
            (root / "source_profiles.json").write_text(
                '{"owner":"zero","sources":[{"repo":"owner/repo","primary_owner":"zero","promotion_approved":true,"layer":"test","documents":["README.md"]}]}',
                encoding="utf-8",
            )
            (inputs / ".harvester_state.json").write_text(
                json.dumps({"schema_version":5,"repositories":{"owner/repo":{"documents":{"README.md":{"sha":blob_sha,"blob_sha":blob_sha,"commit_sha":commit_sha,"tree_sha":tree_sha,"observed_blob_sha":blob_sha,"observed_commit_sha":commit_sha,"observed_tree_sha":tree_sha,"content_hash":hashlib.sha256(Harvester._normalized("# Stable body").encode()).hexdigest(),"entity_id":"existing-entity","output":output.relative_to(inputs).as_posix()}}}}}),
                encoding="utf-8",
            )

            with self.assertRaisesRegex(ValueError, "content hash"):
                Harvester(root)

    def test_schema_five_rejects_wrong_layer_even_with_valid_metadata(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            inputs = root / "inputs"
            commit_sha, tree_sha, blob_sha = "a" * 40, "b" * 40, "c" * 40
            output = self._write_snapshot(inputs, commit_sha, tree_sha, blob_sha)
            wrong = inputs / "current" / "wrong-layer" / "owner_repo" / output.name
            wrong.parent.mkdir(parents=True)
            output.replace(wrong)
            (root / "source_profiles.json").write_text(
                '{"owner":"zero","sources":[{"repo":"owner/repo","primary_owner":"zero","promotion_approved":true,"layer":"test","documents":["README.md"]}]}',
                encoding="utf-8",
            )
            (inputs / ".harvester_state.json").write_text(
                json.dumps({"schema_version":5,"repositories":{"owner/repo":{"documents":{"README.md":{"sha":blob_sha,"blob_sha":blob_sha,"commit_sha":commit_sha,"tree_sha":tree_sha,"observed_blob_sha":blob_sha,"observed_commit_sha":commit_sha,"observed_tree_sha":tree_sha,"content_hash":hashlib.sha256(Harvester._normalized("# Stable body").encode()).hexdigest(),"entity_id":"existing-entity","output":wrong.relative_to(inputs).as_posix()}}}}}),
                encoding="utf-8",
            )

            with self.assertRaisesRegex(ValueError, "canonical current"):
                Harvester(root)

    def test_schema_four_rejects_layer_traversal_before_current_search(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            inputs = root / "inputs"
            inputs.mkdir()
            (root / "source_profiles.json").write_text(
                '{"owner":"zero","sources":[{"repo":"owner/repo","primary_owner":"zero","promotion_approved":true,"layer":"../archive/test","documents":["README.md"]}]}',
                encoding="utf-8",
            )
            (inputs / ".harvester_state.json").write_text(
                json.dumps({"schema_version":4,"repositories":{"owner/repo":{"documents":{"README.md":{"sha":"c"*40,"blob_sha":"c"*40,"commit_sha":"a"*40,"tree_sha":"b"*40,"content_hash":"0"*64,"entity_id":"existing-entity","output":"current/test/owner_repo/old.md"}}}}}),
                encoding="utf-8",
            )

            with self.assertRaisesRegex(ValueError, "source layer"):
                Harvester(root)

    def test_schema_five_hashes_complete_source_with_nested_details(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            inputs = root / "inputs"
            commit_sha, tree_sha, blob_sha = "a" * 40, "b" * 40, "c" * 40
            body = "# Body\n\n<details>\n<summary>Nested</summary>\n\ninside\n\n</details>\n\nafter"
            output = self._write_snapshot(inputs, commit_sha, tree_sha, blob_sha, body=body)
            (root / "source_profiles.json").write_text(
                '{"owner":"zero","sources":[{"repo":"owner/repo","primary_owner":"zero","promotion_approved":true,"layer":"test","documents":["README.md"]}]}',
                encoding="utf-8",
            )
            (inputs / ".harvester_state.json").write_text(
                json.dumps({"schema_version":5,"repositories":{"owner/repo":{"documents":{"README.md":{"sha":blob_sha,"blob_sha":blob_sha,"commit_sha":commit_sha,"tree_sha":tree_sha,"observed_blob_sha":blob_sha,"observed_commit_sha":commit_sha,"observed_tree_sha":tree_sha,"content_hash":hashlib.sha256(Harvester._normalized(body).encode()).hexdigest(),"entity_id":"existing-entity","output":output.relative_to(inputs).as_posix()}}}}}),
                encoding="utf-8",
            )

            self.assertEqual(Harvester(root).state["schema_version"], 5)


if __name__ == "__main__":
    unittest.main()
