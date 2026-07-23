import json
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parents[1] / "src" / "kernel" / "sensory"))
from document_hygiene import (
    canonicalize_ledger,
    ledger_hash,
    maintain_jsonl,
    project_current_snapshots,
    prune_generated_paths,
    render_snapshot,
    validate_owned_punctuation,
    verify_hash_chain,
)
from harvester import Harvester


class ReadabilityContracts(unittest.TestCase):
    def test_snapshot_is_human_readable_and_traceable(self):
        provenance = {"source_repo": "owner/repo", "source_path": "README.md", "source_sha": "abc123", "retrieved_at": "2026-07-11T00:00:00Z", "confidence": 1.0, "entity_id": "doc_readme"}
        output = render_snapshot(provenance, "# Title\nBody。", "+new", "agent-runtime")
        self.assertIn("## 一眼看懂", output)
        self.assertIn("<summary>展开完整外部原文</summary>", output)
        validate_owned_punctuation(output)

    def test_jsonl_maintenance_recurses_and_deduplicates(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "nested" / "items.jsonl"
            path.parent.mkdir()
            item = {"id": "a", "valid_at": "2026-07-11T00:00:00Z"}
            path.write_text(json.dumps(item) + "\n" + json.dumps(item) + "\n", encoding="utf-8")
            result = maintain_jsonl(Path(tmp), rewrite=True)
            self.assertEqual(result["duplicates"], 1)
            self.assertEqual(len(path.read_text(encoding="utf-8").splitlines()), 1)

    def test_hash_writer_and_validator_share_one_algorithm(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            path = root / "entities" / "concept.jsonl"
            path.parent.mkdir()
            record = {"id": "a", "type": "concept", "name": "A", "desc": "x"}
            previous = "NEXUS_GENESIS_0000"
            stored = {**record, "prev_hash": previous}
            stored["hash"] = ledger_hash(stored, previous, "entities/concept.jsonl")
            path.write_text(json.dumps(stored, ensure_ascii=False) + "\n", encoding="utf-8")

            self.assertEqual(verify_hash_chain(root), {"files": 1, "records": 1, "broken": 0})

    def test_projection_and_canonicalization_produce_a_clean_hash_chain(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            inputs = root / "inputs"
            current = inputs / "current" / "agent-runtime" / "owner_repo"
            current.mkdir(parents=True)
            (current / "README.md__abc123.md").write_text(
                "# owner/repo ? README.md\n\n"
                "| ???? | [owner/repo](https://github.com/owner/repo) |\n"
                "| ???? | [README.md](https://github.com/owner/repo/blob/abc123/README.md) |\n"
                "| ???? | `abc123` |\n"
                "| ??? | `agent-runtime` |\n",
                encoding="utf-8",
            )
            knowledge = root / "knowledge"

            project_current_snapshots(inputs, knowledge, hash_chain=True)
            result = canonicalize_ledger(knowledge, hash_chain=True)
            project_current_snapshots(inputs, knowledge, hash_chain=True)
            result = canonicalize_ledger(knowledge, hash_chain=True)

            self.assertEqual(result["duplicate_entities"], 0)
            self.assertEqual(result["duplicate_relations"], 0)
            self.assertEqual(result["dangling_relations"], 0)
            self.assertEqual(verify_hash_chain(knowledge)["broken"], 0)

    def test_truncated_tree_is_a_hard_failure(self):
        harvester = Harvester.__new__(Harvester)
        harvester.state = {"repositories": {}}
        harvester.inputs = Path("inputs")
        harvester._api = lambda url: {"default_branch": "main"} if "/repos/" in url and "/git/trees/" not in url else {"truncated": True}
        with self.assertRaisesRegex(ValueError, "truncated"):
            harvester._source({"repo": "owner/repo", "documents": [], "ignore_patterns": [], "layer": "test", "primary_owner": "zero"})


    def test_canonicalization_normalizes_description_alias(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            entities = root / "entities"
            entities.mkdir()
            (entities / "tech.jsonl").write_text(
                json.dumps(
                    {
                        "id": "model-context-protocol",
                        "type": "tech",
                        "name": "Model Context Protocol",
                        "description": "Tool integration protocol",
                    }
                )
                + "\n",
                encoding="utf-8",
            )

            canonicalize_ledger(root, hash_chain=True)

            record = json.loads(
                (entities / "tech.jsonl").read_text(encoding="utf-8")
            )
            self.assertEqual(record["desc"], "Tool integration protocol")
            self.assertNotIn("description", record)

    def test_pruning_excluded_sources_rebuilds_only_active_ledger(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            entities = root / "entities"
            relations = root / "relations"
            archive = root / "archive" / "sealed.jsonl"
            entities.mkdir()
            relations.mkdir()
            archive.parent.mkdir()
            archive.write_bytes(b'{"id":"sealed"}\n')
            sealed = archive.read_bytes()
            records = [
                {
                    "id": "file_protected_tool_py",
                    "type": "code_file",
                    "name": "tool.py",
                    "desc": "Source file at: protected/tool.py",
                },
                {
                    "id": "file_protected_tool_py__func_run",
                    "type": "code_function",
                    "name": "run",
                    "desc": "Python Function",
                },
                {"id": "safe", "type": "concept", "name": "Safe", "desc": ""},
                {"id": "shared", "type": "concept", "name": "Shared", "desc": ""},
            ]
            (entities / "items.jsonl").write_text(
                "".join(json.dumps(item) + "\n" for item in records),
                encoding="utf-8",
            )
            relation_records = [
                {
                    "src": "file_protected_tool_py",
                    "relation": "defines",
                    "dst": "file_protected_tool_py__func_run",
                },
                {
                    "src": "file_protected_tool_py",
                    "relation": "links",
                    "dst": "shared",
                },
                {"src": "safe", "relation": "links", "dst": "shared"},
            ]
            (relations / "items.jsonl").write_text(
                "".join(json.dumps(item) + "\n" for item in relation_records),
                encoding="utf-8",
            )

            result = prune_generated_paths(
                root,
                ("protected",),
                hash_chain=True,
            )
            active_ids = {
                json.loads(line)["id"]
                for path in (root / "entities").glob("*.jsonl")
                for line in path.read_text(encoding="utf-8").splitlines()
            }

            self.assertEqual(result["removed_entities"], 2)
            self.assertEqual(result["removed_relations"], 2)
            self.assertEqual(active_ids, {"safe", "shared"})
            self.assertEqual(archive.read_bytes(), sealed)
            self.assertEqual(verify_hash_chain(root)["broken"], 0)

    def test_canonicalization_normalizes_generated_code_punctuation(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            entities = root / "entities"
            entities.mkdir()
            (entities / "code_function.jsonl").write_text(
                json.dumps(
                    {
                        "id": "generated_function",
                        "type": "code_function",
                        "name": "generated",
                        "desc": "Generated\u3002",
                    }
                )
                + "\n",
                encoding="utf-8",
            )

            canonicalize_ledger(root, hash_chain=True)

            record = json.loads(
                (entities / "code_function.jsonl").read_text(encoding="utf-8")
            )
            self.assertEqual(record["desc"], "Generated.")
if __name__ == "__main__":
    unittest.main()
