#!/usr/bin/env python3
"""
OpenSandbox Demo Script

Prerequisites:
1. Docker Desktop/daemon must be running
2. OpenSandbox server must be started:
   opensandbox-server --config ~/.sandbox.toml

Then run this script:
   python opensandbox-demo.py
"""

import asyncio
from opensandbox import Sandbox
from opensandbox.models import WriteEntry
from code_interpreter import CodeInterpreter, SupportedLanguage


async def demo_1_basic():
    """Example 1: Basic command execution"""
    print("\n" + "="*50)
    print("DEMO 1: Basic Command Execution")
    print("="*50)

    sandbox = await Sandbox.create("python:3.12")
    async with sandbox:
        print(f"✓ Sandbox created: {sandbox.id}")

        # Run a simple Python command
        result = await sandbox.commands.run("python -c 'print(2+2)'")
        output = result.logs.stdout[0].text if result.logs.stdout else "No output"
        print(f"✓ Command output: {output}")

    await sandbox.kill()
    print("✓ Sandbox cleaned up")


async def demo_2_files():
    """Example 2: File operations"""
    print("\n" + "="*50)
    print("DEMO 2: File Operations")
    print("="*50)

    sandbox = await Sandbox.create("python:3.12")
    async with sandbox:
        print(f"✓ Sandbox created: {sandbox.id}")

        # Write a file
        await sandbox.files.write_files([
            WriteEntry(
                path="/tmp/hello.txt",
                data="Hello from OpenSandbox!\nLine 2",
                mode=644
            )
        ])
        print("✓ File written to /tmp/hello.txt")

        # Read the file
        content = await sandbox.files.read_file("/tmp/hello.txt")
        print(f"✓ File content:\n{content}")

    await sandbox.kill()


async def demo_3_python_script():
    """Example 3: Run a Python script"""
    print("\n" + "="*50)
    print("DEMO 3: Python Script Execution")
    print("="*50)

    sandbox = await Sandbox.create("python:3.12")
    async with sandbox:
        print(f"✓ Sandbox created: {sandbox.id}")

        # Write a script
        script = """
import json
import math

result = {
    "sum": 2 + 2,
    "product": 3 * 4,
    "pi": math.pi,
    "sqrt_16": math.sqrt(16),
}

print(json.dumps(result, indent=2))
"""

        await sandbox.files.write_files([
            WriteEntry(path="/tmp/script.py", data=script, mode=644)
        ])
        print("✓ Script written")

        # Execute it
        result = await sandbox.commands.run("python /tmp/script.py")
        output = result.logs.stdout[0].text if result.logs.stdout else "No output"
        print(f"✓ Script output:\n{output}")

    await sandbox.kill()


async def demo_4_code_interpreter():
    """Example 4: Code Interpreter SDK"""
    print("\n" + "="*50)
    print("DEMO 4: Code Interpreter")
    print("="*50)

    sandbox = await Sandbox.create("opensandbox/code-interpreter:v1.0.2")
    async with sandbox:
        print(f"✓ Sandbox created: {sandbox.id}")

        interpreter = await CodeInterpreter.create(sandbox)
        print("✓ Code interpreter created")

        # Run Python code directly
        code = """
import statistics

data = [10, 20, 30, 40, 50]
result = {
    "mean": statistics.mean(data),
    "median": statistics.median(data),
    "sum": sum(data),
}

print(f"Stats: {result}")
"""

        result = await interpreter.codes.run(code, language=SupportedLanguage.PYTHON)
        print(f"✓ Interpreter output: {result.result[0].text}")

    await sandbox.kill()


async def demo_5_multiple_commands():
    """Example 5: Multiple commands"""
    print("\n" + "="*50)
    print("DEMO 5: Multiple Commands")
    print("="*50)

    sandbox = await Sandbox.create("python:3.12")
    async with sandbox:
        print(f"✓ Sandbox created: {sandbox.id}")

        commands = [
            ("Echo test", "echo 'Hello World'"),
            ("Python version", "python --version"),
            ("List files", "ls -la /tmp"),
            ("Calculate", "python -c 'print(f\"Result: {100 + 50}\")'"),
        ]

        for name, cmd in commands:
            print(f"\n  📌 {name}: {cmd}")
            result = await sandbox.commands.run(cmd)
            if result.logs.stdout:
                output = result.logs.stdout[0].text.strip()
                print(f"     ✓ {output}")

    await sandbox.kill()


async def main():
    """Run all demos"""
    print("\n🚀 OpenSandbox Python SDK Demos\n")
    print("Make sure you have:")
    print("  1. Docker running")
    print("  2. OpenSandbox server started: opensandbox-server --config ~/.sandbox.toml")
    print("  3. SDK installed: pip install opensandbox opensandbox-code-interpreter")

    try:
        await demo_1_basic()
        await demo_2_files()
        await demo_3_python_script()
        await demo_4_code_interpreter()
        await demo_5_multiple_commands()

        print("\n" + "="*50)
        print("✅ All demos completed successfully!")
        print("="*50 + "\n")

    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("\nTroubleshooting:")
        print("  • Is Docker running? (docker ps)")
        print("  • Is OpenSandbox server running? (should see 'Uvicorn running on ...')")
        print("  • Check server logs for errors")


if __name__ == "__main__":
    asyncio.run(main())
