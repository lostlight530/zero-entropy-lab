import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parents[1] / "src" / "kernel" / "sensory"))
from harvester import Harvester


class HarvesterContracts(unittest.TestCase):
    def test_profiles_are_approved_and_zero_owned(self):
        h = Harvester(Path(__file__).parents[1])
        self.assertTrue(h.validate_profiles())

    def test_readme_is_explicitly_selected(self):
        self.assertTrue(Harvester._selected("README.md", ["docs/**"], []))

    def test_unlisted_external_link_is_not_selected(self):
        self.assertFalse(Harvester._selected("external/repo.md", ["docs/**"], []))


if __name__ == "__main__":
    unittest.main()
