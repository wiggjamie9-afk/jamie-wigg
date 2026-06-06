#!/usr/bin/env python3
"""
OpenSandbox Data Science Demo

Demonstrates using OpenSandbox for data analysis and statistical computation.

Prerequisites:
- Docker running
- OpenSandbox server: opensandbox-server --config ~/.sandbox.toml

Run: python opensandbox-data-science.py
"""

import asyncio
from opensandbox import Sandbox
from opensandbox.models import WriteEntry


async def data_science_demo():
    """Data analysis script in sandbox"""
    sandbox = await Sandbox.create("python:3.12")

    async with sandbox:
        print("✓ Sandbox created\n")

        # Write a data analysis script
        await sandbox.files.write_files([
            WriteEntry(
                path="/tmp/analysis.py",
                data="""
import statistics
import json

# Sample data
data = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

stats = {
    "mean": statistics.mean(data),
    "median": statistics.median(data),
    "stdev": statistics.stdev(data),
    "min": min(data),
    "max": max(data),
}

print(json.dumps(stats, indent=2))
""",
                mode=644
            )
        ])
        print("✓ Analysis script written")

        # Run analysis
        result = await sandbox.commands.run("python /tmp/analysis.py")
        print("✓ Analysis output:")
        print(result.logs.stdout[0].text)

    await sandbox.kill()
    print("✓ Sandbox cleaned up")


async def advanced_data_science_demo():
    """More complex data analysis with multiple scripts"""
    print("\n" + "="*60)
    print("Advanced Data Science Demo")
    print("="*60 + "\n")

    sandbox = await Sandbox.create("python:3.12")

    async with sandbox:
        print("✓ Sandbox created\n")

        # Write multiple analysis scripts
        scripts = {
            "/tmp/descriptive_stats.py": """
import statistics
import json

data = [15, 22, 28, 31, 45, 52, 63, 71, 88, 95]

analysis = {
    "count": len(data),
    "sum": sum(data),
    "mean": statistics.mean(data),
    "median": statistics.median(data),
    "variance": statistics.variance(data),
    "stdev": statistics.stdev(data),
    "range": max(data) - min(data),
}

print("Descriptive Statistics:")
print(json.dumps(analysis, indent=2))
""",

            "/tmp/list_processing.py": """
import json

data = list(range(1, 11))

results = {
    "original": data,
    "squared": [x**2 for x in data],
    "cubed": [x**3 for x in data],
    "even_numbers": [x for x in data if x % 2 == 0],
    "sum_of_squares": sum(x**2 for x in data),
}

print(json.dumps(results, indent=2))
""",
        }

        # Write all scripts
        for path, content in scripts.items():
            await sandbox.files.write_files([
                WriteEntry(path=path, data=content, mode=644)
            ])

        print("✓ Scripts written\n")

        # Execute each script
        for script_name, script_path in [
            ("Descriptive Statistics", "/tmp/descriptive_stats.py"),
            ("List Processing", "/tmp/list_processing.py"),
        ]:
            print(f"📌 Running: {script_name}")
            result = await sandbox.commands.run(f"python {script_path}")
            print(result.logs.stdout[0].text)

    await sandbox.kill()
    print("✓ Sandbox cleaned up")


async def main():
    print("\n📊 OpenSandbox Data Science Demo\n")

    try:
        await data_science_demo()
        await advanced_data_science_demo()
        print("\n✅ Data science demos completed!\n")

    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("\nEnsure:")
        print("  1. Docker is running")
        print("  2. OpenSandbox server is active")
        print("  3. CLI configured: osb config init\n")


if __name__ == "__main__":
    asyncio.run(main())
