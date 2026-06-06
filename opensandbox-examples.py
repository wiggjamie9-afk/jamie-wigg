#!/usr/bin/env python3
"""
OpenSandbox Examples - Three Essential Patterns

This script demonstrates the three most common OpenSandbox usage patterns:
1. Basic command execution
2. File operations (read/write)
3. Code Interpreter SDK

Prerequisites:
- Docker running
- OpenSandbox server: opensandbox-server --config ~/.sandbox.toml

Run: python opensandbox-examples.py
"""

import asyncio
from opensandbox import Sandbox
from opensandbox.models import WriteEntry
from code_interpreter import CodeInterpreter, SupportedLanguage


async def example_1_basic():
    """Simple command execution"""
    print("\n=== Example 1: Basic Command Execution ===")
    sandbox = await Sandbox.create("python:3.12")
    async with sandbox:
        result = await sandbox.commands.run("python -c 'print(2+2)'")
        print(result.logs.stdout[0].text)
    await sandbox.kill()


async def example_2_file_operations():
    """Write and read files"""
    print("\n=== Example 2: File Operations ===")
    sandbox = await Sandbox.create("python:3.12")
    async with sandbox:
        # Write
        await sandbox.files.write_files([
            WriteEntry(path="/tmp/hello.txt", data="Hello OpenSandbox!", mode=644)
        ])
        # Read
        content = await sandbox.files.read_file("/tmp/hello.txt")
        print(f"File content: {content}")
    await sandbox.kill()


async def example_3_code_interpreter():
    """Use Code Interpreter SDK"""
    print("\n=== Example 3: Code Interpreter ===")
    sandbox = await Sandbox.create("opensandbox/code-interpreter:v1.0.2")
    async with sandbox:
        interpreter = await CodeInterpreter.create(sandbox)
        result = await interpreter.codes.run(
            "print(f'Result: {42 * 2}')",
            language=SupportedLanguage.PYTHON
        )
        print(result.result[0].text)
    await sandbox.kill()


async def main():
    """Run all three examples"""
    print("\n🎯 OpenSandbox Essential Examples\n")
    print("Prerequisites: Docker running + OpenSandbox server active")

    try:
        await example_1_basic()
        await example_2_file_operations()
        await example_3_code_interpreter()
        print("\n✅ All examples completed!\n")

    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("\nTroubleshooting:")
        print("  • Is Docker running? (docker ps)")
        print("  • Is OpenSandbox server active?")
        print("  • Run: opensandbox-server --config ~/.sandbox.toml\n")


if __name__ == "__main__":
    asyncio.run(main())
