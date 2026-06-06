#!/usr/bin/env python3
"""
OpenSandbox Advanced Workflow

Demonstrates:
- Multiple command execution
- Error handling
- Output capture (stdout/stderr)
- Real-time result processing

Prerequisites:
- Docker running
- OpenSandbox server: opensandbox-server --config ~/.sandbox.toml

Run: python opensandbox-advanced-workflow.py
"""

import asyncio
from opensandbox import Sandbox


async def advanced_workflow():
    sandbox = await Sandbox.create("python:3.12")

    async with sandbox:
        print(f"✓ Sandbox created: {sandbox.id}\n")

        commands = [
            "echo 'Starting...'",
            "python --version",
            "python -c 'print(sum(range(1, 101)))'",
            "ls -la /tmp",
        ]

        for cmd in commands:
            print(f"📌 Running: {cmd}")
            try:
                result = await sandbox.commands.run(cmd)

                if result.logs.stdout:
                    output = result.logs.stdout[0].text.strip()
                    print(f"   ✓ Output: {output}")

                if result.logs.stderr:
                    error = result.logs.stderr[0].text.strip()
                    print(f"   ⚠ Error: {error}")

                print()

            except Exception as e:
                print(f"   ✗ Failed: {e}\n")

    await sandbox.kill()
    print("✓ Sandbox cleaned up")


async def advanced_workflow_with_files():
    """Extended example with file operations and error handling"""
    print("\n" + "="*60)
    print("Advanced Workflow with File Operations")
    print("="*60 + "\n")

    sandbox = await Sandbox.create("python:3.12")

    async with sandbox:
        print(f"✓ Sandbox created: {sandbox.id}\n")

        # Test 1: Create and read a file
        print("📌 Test 1: File Operations")
        from opensandbox.models import WriteEntry

        await sandbox.files.write_files([
            WriteEntry(path="/tmp/test.txt", data="Hello World!", mode=644)
        ])
        print("   ✓ File written")

        content = await sandbox.files.read_file("/tmp/test.txt")
        print(f"   ✓ File read: '{content}'")

        # Test 2: Multiple commands with different outputs
        print("\n📌 Test 2: Multiple Commands")
        commands = [
            ("Basic echo", "echo 'test'"),
            ("Python calculation", "python -c 'x = [i**2 for i in range(5)]; print(x)'"),
            ("Directory listing", "ls -1 /tmp | head -5"),
            ("System info", "python -c \"import sys; print(f'Python {sys.version.split()[0]}')\""),
        ]

        for name, cmd in commands:
            result = await sandbox.commands.run(cmd)
            output = result.logs.stdout[0].text.strip() if result.logs.stdout else "No output"
            print(f"   • {name}: {output}")

        # Test 3: Error handling
        print("\n📌 Test 3: Error Handling")
        result = await sandbox.commands.run("python -c 'print(undefined_var)'")
        if result.logs.stderr:
            print(f"   ✓ Caught error (as expected)")
        else:
            print(f"   ? No error output")

    await sandbox.kill()
    print("\n✓ Sandbox cleaned up")


async def main():
    print("\n⚙️  OpenSandbox Advanced Workflow Demo\n")

    try:
        await advanced_workflow()
        await advanced_workflow_with_files()
        print("\n✅ All workflows completed!\n")

    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("\nEnsure:")
        print("  1. Docker is running")
        print("  2. OpenSandbox server is active")
        print("  3. CLI configured: osb config init\n")


if __name__ == "__main__":
    asyncio.run(main())
