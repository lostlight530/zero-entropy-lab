import unittest
import sys
from pathlib import Path

# Initialize kernel imports for all tests
sys.path.append(str(Path(__file__).parent.parent / "src" / "kernel"))

def run_all():
    print("🧬 NEXUS: Running Foundation Verification...")
    loader = unittest.TestLoader()
    suite = loader.discover(str(Path(__file__).parent), pattern='test_*.py')
    
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    sys.exit(not result.wasSuccessful())

if __name__ == "__main__":
    run_all()
