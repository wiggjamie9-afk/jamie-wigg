#!/usr/bin/env python3
"""
OpenManus Setup Tool
Automates the installation and configuration of OpenManus agent framework
"""

import os
import sys
import shutil
import subprocess
import argparse
from pathlib import Path

class OpenManusSetup:
    def __init__(self, install_dir="."):
        self.install_dir = Path(install_dir).resolve()
        self.venv_dir = self.install_dir / "venv"
        self.config_file = self.install_dir / "config" / "config.toml"
        self.requirements_file = self.install_dir / "requirements.txt"

    def print_header(self, text):
        print(f"\n{'='*60}")
        print(f"  {text}")
        print(f"{'='*60}\n")

    def print_step(self, text):
        print(f"\n→ {text}")

    def print_success(self, text):
        print(f"✓ {text}")

    def print_error(self, text):
        print(f"✗ {text}", file=sys.stderr)

    def print_warning(self, text):
        print(f"⚠ {text}")

    def run_command(self, cmd, description=""):
        """Execute a shell command"""
        try:
            if description:
                self.print_step(description)
            result = subprocess.run(cmd, shell=True, check=True, capture_output=False)
            return True
        except subprocess.CalledProcessError as e:
            if description:
                self.print_error(f"{description} failed")
            else:
                self.print_error(f"Command failed: {cmd}")
            return False

    def clone_repository(self):
        """Clone OpenManus repository if needed"""
        if (self.install_dir / "app").exists():
            self.print_success("OpenManus directory found")
            return True

        self.print_step("Cloning OpenManus repository")
        if not self.run_command(
            f"git clone https://github.com/FoundationAgents/OpenManus {self.install_dir}",
            "Repository clone"
        ):
            return False

        self.print_success("Repository cloned")
        return True

    def create_venv(self):
        """Create Python virtual environment"""
        if self.venv_dir.exists():
            self.print_success("Virtual environment already exists")
            return True

        self.print_step("Creating Python virtual environment")
        if not self.run_command(
            f"python -m venv {self.venv_dir}",
            "Virtual environment creation"
        ):
            return False

        self.print_success("Virtual environment created")
        return True

    def fix_dependencies(self):
        """Fix known dependency conflicts"""
        if not self.requirements_file.exists():
            self.print_warning("requirements.txt not found")
            return False

        self.print_step("Fixing dependency conflicts")
        content = self.requirements_file.read_text()

        # Fix Pillow version conflict
        if "pillow~=11.1.0" in content:
            content = content.replace("pillow~=11.1.0", "pillow>=10.1.0")
            self.requirements_file.write_text(content)
            self.print_success("Fixed Pillow version constraint")
        else:
            self.print_success("Pillow version already compatible")

        return True

    def install_dependencies(self):
        """Install Python dependencies"""
        if not self.venv_dir.exists():
            self.print_error("Virtual environment not found")
            return False

        self.print_step("Installing Python dependencies (this may take 5-10 minutes)")

        # Use pip from venv
        pip_cmd = str(self.venv_dir / "bin" / "pip")

        # Upgrade pip
        if not self.run_command(f"{pip_cmd} install --upgrade pip setuptools wheel"):
            return False

        # Install requirements
        if not self.run_command(
            f"{pip_cmd} install -r {self.requirements_file}",
            "Installing requirements"
        ):
            return False

        self.print_success("Dependencies installed successfully")
        return True

    def setup_configuration(self):
        """Setup configuration files"""
        config_dir = self.install_dir / "config"
        example_config = config_dir / "config.example.toml"

        if not example_config.exists():
            self.print_warning("config.example.toml not found")
            return False

        if not self.config_file.exists():
            self.print_step("Creating configuration file")
            shutil.copy(example_config, self.config_file)
            self.print_success(f"Configuration created: {self.config_file}")
            self.print_warning("Please edit config/config.toml and add your API credentials")
        else:
            self.print_success("Configuration file already exists")

        # Setup MCP if needed
        mcp_file = config_dir / "mcp.json"
        mcp_example = config_dir / "mcp.example.json"

        if not mcp_file.exists() and mcp_example.exists():
            shutil.copy(mcp_example, mcp_file)
            self.print_success("MCP configuration created")

        return True

    def verify_installation(self):
        """Verify OpenManus installation"""
        self.print_step("Verifying installation")

        if not self.venv_dir.exists():
            self.print_error("Virtual environment not found")
            return False

        python_cmd = str(self.venv_dir / "bin" / "python")
        result = subprocess.run(
            f"{python_cmd} -c 'import app.agent.manus'",
            shell=True,
            capture_output=True
        )

        if result.returncode == 0:
            self.print_success("OpenManus module verified")
            return True
        else:
            self.print_warning("Could not verify OpenManus modules")
            return False

    def run(self):
        """Run the complete setup process"""
        self.print_header("OpenManus Setup")
        print(f"Install directory: {self.install_dir}\n")

        steps = [
            ("Clone Repository", self.clone_repository),
            ("Create Virtual Environment", self.create_venv),
            ("Fix Dependencies", self.fix_dependencies),
            ("Install Dependencies", self.install_dependencies),
            ("Setup Configuration", self.setup_configuration),
            ("Verify Installation", self.verify_installation),
        ]

        completed = 0
        for step_name, step_func in steps:
            if step_func():
                completed += 1
            else:
                self.print_error(f"Setup stopped at: {step_name}")
                return False

        self.print_header(f"Setup Complete ({completed}/{len(steps)} steps)")
        print("\nNext steps:")
        print("1. Edit config/config.toml with your API credentials")
        print(f"2. Run: source {self.venv_dir / 'bin' / 'activate'}")
        print("3. Try: python main.py --prompt 'Hello'")
        print("")

        return True


def main():
    parser = argparse.ArgumentParser(
        description="Setup OpenManus agent framework",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python setup-openmanus.py                    # Setup in current directory
  python setup-openmanus.py /tmp/openmanus    # Setup in specific directory
        """
    )

    parser.add_argument(
        "install_dir",
        nargs="?",
        default=".",
        help="Installation directory (default: current directory)"
    )

    parser.add_argument(
        "--skip-clone",
        action="store_true",
        help="Skip repository cloning (use existing directory)"
    )

    args = parser.parse_args()

    setup = OpenManusSetup(args.install_dir)

    if not setup.run():
        sys.exit(1)

    sys.exit(0)


if __name__ == "__main__":
    main()
