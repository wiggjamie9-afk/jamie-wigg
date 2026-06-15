#!/usr/bin/env python3
"""
OpenManus Test Suite
Validates installation, configuration, and basic functionality
"""

import sys
import os
from pathlib import Path
import subprocess
import json
import argparse
from typing import List, Tuple

class OpenManusValidator:
    def __init__(self, openmanus_dir="/tmp/OpenManus"):
        self.openmanus_dir = Path(openmanus_dir)
        self.venv_dir = self.openmanus_dir / "venv"
        self.config_file = self.openmanus_dir / "config" / "config.toml"
        self.tests_passed = 0
        self.tests_failed = 0

    def print_header(self, text):
        print(f"\n{'='*60}")
        print(f"  {text}")
        print(f"{'='*60}\n")

    def print_test(self, name, passed, message=""):
        status = "✓ PASS" if passed else "✗ FAIL"
        print(f"{status}: {name}")
        if message:
            print(f"       {message}")

        if passed:
            self.tests_passed += 1
        else:
            self.tests_failed += 1

    def run_command(self, cmd: str) -> Tuple[int, str, str]:
        """Execute command and return exit code, stdout, stderr"""
        result = subprocess.run(
            cmd,
            shell=True,
            capture_output=True,
            text=True
        )
        return result.returncode, result.stdout, result.stderr

    def test_directory_structure(self) -> bool:
        """Test 1: Verify directory structure"""
        self.print_header("Test 1: Directory Structure")

        required_dirs = [
            "app",
            "config",
            "venv",
        ]

        all_exist = True
        for dir_name in required_dirs:
            dir_path = self.openmanus_dir / dir_name
            exists = dir_path.exists()
            self.print_test(f"Directory {dir_name} exists", exists)
            all_exist = all_exist and exists

        return all_exist

    def test_venv(self) -> bool:
        """Test 2: Virtual environment"""
        self.print_header("Test 2: Virtual Environment")

        venv_exists = self.venv_dir.exists()
        self.print_test("Virtual environment exists", venv_exists)

        if not venv_exists:
            return False

        python_path = self.venv_dir / "bin" / "python"
        python_exists = python_path.exists()
        self.print_test("Python executable exists", python_exists)

        pip_path = self.venv_dir / "bin" / "pip"
        pip_exists = pip_path.exists()
        self.print_test("Pip executable exists", pip_exists)

        return venv_exists and python_exists and pip_exists

    def test_dependencies(self) -> bool:
        """Test 3: Required dependencies"""
        self.print_header("Test 3: Dependencies")

        pip_path = str(self.venv_dir / "bin" / "pip")

        required_packages = [
            "playwright",
            "browser-use",
            "pydantic",
            "anthropic",
            "openai",
            "langchain-core",
            "torch",
            "requests",
            "pyyaml",
        ]

        all_present = True
        for package in required_packages:
            code, stdout, _ = self.run_command(f"{pip_path} show {package}")
            present = code == 0
            self.print_test(f"Package {package} installed", present)
            all_present = all_present and present

        return all_present

    def test_configuration(self) -> bool:
        """Test 4: Configuration files"""
        self.print_header("Test 4: Configuration")

        example_config = self.openmanus_dir / "config" / "config.example.toml"
        example_exists = example_config.exists()
        self.print_test("Example config exists", example_exists)

        config_exists = self.config_file.exists()
        self.print_test("Config file exists", config_exists,
                       "Run: cp config/config.example.toml config/config.toml" if not config_exists else "")

        return example_exists

    def test_module_imports(self) -> bool:
        """Test 5: Module imports (basic)"""
        self.print_header("Test 5: Module Imports")

        python_path = str(self.venv_dir / "bin" / "python")

        test_imports = [
            ("playwright", "import playwright"),
            ("pydantic", "import pydantic"),
            ("browser-use", "import browser_use"),
            ("requests", "import requests"),
        ]

        all_import = True
        for package_name, import_cmd in test_imports:
            code, _, error = self.run_command(f"{python_path} -c '{import_cmd}'")
            success = code == 0
            self.print_test(f"Module {package_name} imports", success,
                           error.split('\n')[0] if error else "")
            all_import = all_import and success

        return all_import

    def test_disk_space(self) -> bool:
        """Test 6: Disk space"""
        self.print_header("Test 6: Disk Space")

        code, stdout, _ = self.run_command(f"du -sh {self.venv_dir}")

        if code == 0:
            size_str = stdout.split('\t')[0] if '\t' in stdout else stdout.strip()
            self.print_test(f"Virtual environment size: {size_str}", True)
            return True
        else:
            self.print_test("Check disk usage", False, "Could not determine size")
            return False

    def test_environment_vars(self) -> bool:
        """Test 7: Environment variables"""
        self.print_header("Test 7: Environment Variables")

        required_env_vars = [
            ("ANTHROPIC_API_KEY", "Anthropic API key (optional)"),
            ("OPENAI_API_KEY", "OpenAI API key (optional)"),
        ]

        any_configured = False
        for var_name, description in required_env_vars:
            is_set = var_name in os.environ
            self.print_test(f"{var_name} set: {description}", is_set,
                           f"Set with: export {var_name}=your_key" if not is_set else "")
            any_configured = any_configured or is_set

        if not any_configured:
            print("\n⚠ Warning: No LLM API keys configured. Set at least one to use OpenManus.")

        return any_configured

    def test_browser_support(self) -> bool:
        """Test 8: Browser support"""
        self.print_header("Test 8: Browser Support")

        python_path = str(self.venv_dir / "bin" / "python")

        # Check if Playwright can be used
        test_code = """
import playwright
print("Playwright version: " + getattr(playwright, '__version__', 'unknown'))
"""

        code, stdout, error = self.run_command(f"{python_path} -c '{test_code}'")

        browser_support = code == 0
        self.print_test("Browser support available", browser_support,
                       error.split('\n')[0] if error else stdout.strip())

        return browser_support

    def test_example_configs(self) -> bool:
        """Test 9: Example configurations"""
        self.print_header("Test 9: Example Configurations")

        config_dir = Path("/home/user/jamie-wigg/config")

        example_configs = [
            "openmanus-claude.toml",
            "openmanus-openai.toml",
            "openmanus-ollama.toml",
            "openmanus-azure.toml",
        ]

        all_present = True
        for config_name in example_configs:
            config_path = config_dir / config_name
            exists = config_path.exists()
            self.print_test(f"Config example {config_name} exists", exists)
            all_present = all_present and exists

        return all_present

    def test_documentation(self) -> bool:
        """Test 10: Documentation"""
        self.print_header("Test 10: Documentation")

        docs_dir = Path("/home/user/jamie-wigg")

        required_docs = [
            "SETUP-OPENMANUS.md",
            "OPENMANUS-INTEGRATION-NOTES.md",
            "OPENMANUS-MCP-INTEGRATION.md",
        ]

        all_present = True
        for doc_name in required_docs:
            doc_path = docs_dir / doc_name
            exists = doc_path.exists()
            self.print_test(f"Documentation {doc_name} exists", exists)
            all_present = all_present and exists

        return all_present

    def run_all_tests(self) -> bool:
        """Run all tests"""
        self.print_header("OpenManus Installation & Configuration Tests")
        print(f"OpenManus Directory: {self.openmanus_dir}\n")

        tests = [
            self.test_directory_structure,
            self.test_venv,
            self.test_dependencies,
            self.test_configuration,
            self.test_module_imports,
            self.test_disk_space,
            self.test_environment_vars,
            self.test_browser_support,
            self.test_example_configs,
            self.test_documentation,
        ]

        for test in tests:
            try:
                test()
            except Exception as e:
                print(f"Error running test: {e}")

        # Summary
        self.print_header("Test Summary")
        total = self.tests_passed + self.tests_failed
        print(f"Total Tests: {total}")
        print(f"Passed: {self.tests_passed}")
        print(f"Failed: {self.tests_failed}")

        if self.tests_failed == 0:
            print("\n✓ All tests passed! OpenManus is ready to use.")
            print("\nNext steps:")
            print("1. Set your API key: export ANTHROPIC_API_KEY=your_key")
            print("2. Configure: cp config/config.example.toml config/config.toml")
            print("3. Edit config with your API key")
            print("4. Test: source venv/bin/activate")
            print("         python main.py --prompt 'Hello'")
            return True
        else:
            print(f"\n✗ {self.tests_failed} test(s) failed. Review errors above.")
            return False

def main():
    parser = argparse.ArgumentParser(
        description="Test OpenManus installation and configuration"
    )
    parser.add_argument(
        "--dir",
        default="/tmp/OpenManus",
        help="OpenManus directory (default: /tmp/OpenManus)"
    )
    parser.add_argument(
        "--verbose",
        action="store_true",
        help="Verbose output"
    )

    args = parser.parse_args()

    validator = OpenManusValidator(args.dir)
    success = validator.run_all_tests()

    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
