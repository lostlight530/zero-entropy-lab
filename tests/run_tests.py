import sys
from pathlib import Path
import os
import subprocess

def run_all():
    print("🧬 NEXUS: Running Foundation Verification...")
    
    # Run tests in separate processes to isolate mocking side effects
    test_files = [f for f in os.listdir("tests") if f.startswith("test_") and f.endswith(".py")]
    
    all_passed = True
    for t_file in test_files:
        module_name = f"tests.{t_file[:-3]}"
        print(f"\n--- Running {module_name} ---")
        result = subprocess.run([sys.executable, "-m", "unittest", module_name], cwd=os.getcwd())
        if result.returncode != 0:
            all_passed = False

    sys.exit(0 if all_passed else 1)

if __name__ == "__main__":
    run_all()
