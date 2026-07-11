import sys
from pathlib import Path
import os
import subprocess

# Add the new physical layers to PYTHONPATH
kernel_dir = Path(__file__).parent.parent / "src" / "kernel"
layers = ["protocol", "memory", "cognitive", "sensory", "orchestration"]
for layer in layers:
    sys.path.append(str(kernel_dir / layer))
sys.path.append(str(kernel_dir))

def configure_output(stream):
    """Keep the test runner usable on consoles with limited encodings."""
    reconfigure = getattr(stream, "reconfigure", None)
    if reconfigure:
        reconfigure(errors="backslashreplace")

def build_test_environment(base_environment):
    environment = base_environment.copy()
    environment["PYTHONIOENCODING"] = "utf-8"
    return environment

def run_all():
    configure_output(sys.stdout)
    configure_output(sys.stderr)
    print("🧬 NEXUS: Running Foundation Verification...")
    
    # Run tests in separate processes to isolate mocking side effects
    test_files = [f for f in os.listdir("tests") if f.startswith("test_") and f.endswith(".py")]
    
    all_passed = True

    # Add env var for PYTHONPATH
    env = build_test_environment(os.environ)
    pythonpath = str(kernel_dir)
    for layer in layers:
        pythonpath += os.pathsep + str(kernel_dir / layer)
    env["PYTHONPATH"] = pythonpath

    for t_file in test_files:
        module_name = f"tests.{t_file[:-3]}"
        print(f"\n--- Running {module_name} ---")
        result = subprocess.run([sys.executable, "-m", "unittest", module_name], cwd=os.getcwd(), env=env)
        if result.returncode != 0:
            all_passed = False

    sys.exit(0 if all_passed else 1)

if __name__ == "__main__":
    run_all()
