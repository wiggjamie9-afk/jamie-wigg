#!/usr/bin/env python3
"""
OpenSandbox Full Workflow Example

This demonstrates:
1. Creating a sandbox
2. Writing files
3. Executing commands
4. Reading files back
5. Cleanup

Prerequisites:
- Docker running
- OpenSandbox server: opensandbox-server --config ~/.sandbox.toml

Run: python opensandbox-full-workflow.py
"""

import asyncio
from opensandbox import Sandbox
from opensandbox.models import WriteEntry


async def full_workflow():
    # Create sandbox with 30 min timeout
    sandbox = await Sandbox.create("python:3.12", timeout_seconds=1800)

    async with sandbox:
        print("✓ Sandbox created")

        # 1. Write a Python script
        await sandbox.files.write_files([
            WriteEntry(
                path="/tmp/script.py",
                data="""
import json
result = {"sum": 2+2, "product": 3*4, "name": "OpenSandbox"}
print(json.dumps(result))
""",
                mode=644
            )
        ])
        print("✓ File written")

        # 2. Execute the script
        result = await sandbox.commands.run("python /tmp/script.py")
        print("✓ Script output:", result.logs.stdout[0].text)

        # 3. Read the file back
        content = await sandbox.files.read_file("/tmp/script.py")
        print("✓ File content read:", len(content), "bytes")
        print("   Content preview:")
        print("   " + content[:100].replace("\n", "\n   "))

    await sandbox.kill()
    print("✓ Sandbox cleaned up")


async def main():
    print("\n🔄 OpenSandbox Full Workflow Demo\n")

    try:
        await full_workflow()
        print("\n✅ Workflow completed!\n")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("\nEnsure:")
        print("  1. Docker is running")
        print("  2. OpenSandbox server is active")
        print("  3. Required packages installed\n")


if __name__ == "__main__":
    asyncio.run(main())
