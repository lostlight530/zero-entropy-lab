import json
import sys
import unittest
from pathlib import Path


sys.path.insert(0, str(Path(__file__).parents[1] / "src" / "kernel" / "orchestration"))

from lifecycle_guard import (
    build_manifest,
    classify_zero_delta,
    logical_cycle_time,
    render_lifecycle_receipt,
    world_line_outcome,
)


class LifecycleGuardTests(unittest.TestCase):
    def test_scheduled_cycle_uses_nominal_slot_not_delayed_start(self):
        self.assertEqual(
            logical_cycle_time("schedule", "2026-08-31T00:17:00Z", "0 22 * * *"),
            "2026-08-30T22:00:00Z",
        )

    def test_manifest_is_deterministic_for_the_same_inputs(self):
        kwargs = {
            "repository": "lostlight530/zero-entropy-lab",
            "mode": "apply",
            "base_sha": "a" * 40,
            "logical_time": "2026-08-30T22:00:00Z",
            "source_time": "2026-08-30T21:59:00Z",
            "candidate_paths": ["data/knowledge/entities.jsonl"],
            "deltas": {"source_content": 1, "knowledge": 2, "projection": 1},
            "metrics_snapshot": {"hash_records": 12, "broken": 0},
        }
        first = build_manifest(**kwargs)
        second = build_manifest(**kwargs)
        self.assertEqual(first, second)
        self.assertEqual(
            json.dumps(first, sort_keys=True, separators=(",", ":")),
            json.dumps(second, sort_keys=True, separators=(",", ":")),
        )

    def test_hash_chain_rewrite_is_not_counted_as_source_delta(self):
        self.assertEqual(
            classify_zero_delta(
                ["data/knowledge/entities.jsonl", "data/knowledge/relations.jsonl"],
                source_content=0,
                projection=0,
                knowledge=2,
            ),
            {
                "source_content": 0,
                "projection": 0,
                "knowledge": 2,
                "hash_chain_derived": 2,
            },
        )

    def test_world_line_change_is_a_green_no_apply_outcome(self):
        self.assertEqual(
            world_line_outcome("a" * 40, "b" * 40),
            "CONFLICTED_WORLD_LINE_NO_APPLY",
        )

    def test_receipt_separates_semantic_delta_from_hash_chain_derivation(self):
        manifest = build_manifest(
            repository="lostlight530/zero-entropy-lab",
            mode="apply",
            base_sha="a" * 40,
            logical_time="2026-08-30T22:00:00Z",
            source_time="UNKNOWN",
            observed_time="2026-08-30T22:03:00Z",
            applied_time=None,
            outcome="NO_MEANINGFUL_DELTA",
            candidate_paths=[
                "data/knowledge/entities.jsonl",
                "data/knowledge/relations.jsonl",
            ],
            deltas={
                "source_content": 0,
                "knowledge": 2,
                "projection": 0,
                "hash_chain_derived": 2,
            },
            metrics_snapshot={
                "active_entity_records": 21,
                "active_relation_records": 13,
                "active_hash_records": 34,
                "current_source_snapshots": 3,
            },
        )
        receipt = render_lifecycle_receipt(
            manifest=manifest,
            repository_kind="zero",
            before_metrics={
                "active_entity_records": 21,
                "active_relation_records": 13,
                "active_hash_records": 34,
                "current_source_snapshots": 3,
            },
            event_name="schedule",
            actor="github-actions[bot]",
            triggering_actor="github-actions[bot]",
            final_sha="a" * 40,
            job_status="success",
            validation_failed=False,
            gate_results={"哈希链与图谱": "success"},
        )
        self.assertIn("# Zero 周期运行收据", receipt)
        self.assertIn("`NO_MEANINGFUL_DELTA`", receipt)
        self.assertIn("仅为哈希链确定性派生", receipt)
        self.assertIn("不代表新增外部事实", receipt)
        self.assertIn("哈希记录 `34 → 34`", receipt)
        self.assertIn("| 哈希链与图谱 | `success` |", receipt)
        self.assertNotIn("\u3002", receipt)

    def test_receipt_distinguishes_invalid_evidence_from_runtime_failure(self):
        common = {
            "manifest": None,
            "repository_kind": "zero",
            "before_metrics": {},
            "event_name": "schedule",
            "actor": "github-actions[bot]",
            "triggering_actor": "github-actions[bot]",
            "base_sha": "a" * 40,
            "final_sha": "a" * 40,
            "job_status": "failure",
            "gate_results": {"运行时契约": "failure"},
        }
        rejected = render_lifecycle_receipt(**common, validation_failed=True)
        failed = render_lifecycle_receipt(**common, validation_failed=False)
        self.assertIn("`REJECTED_INVALID_EVIDENCE`", rejected)
        self.assertIn("`FAILED_RUNTIME`", failed)


if __name__ == "__main__":
    unittest.main()
