#!/usr/bin/env python3
"""
OpenSandbox Code Interpreter Demo

Uses the Code Interpreter SDK for direct Python execution in sandbox.

Prerequisites:
- Docker running
- OpenSandbox server: opensandbox-server --config ~/.sandbox.toml
- Code Interpreter image available

Run: python opensandbox-code-interpreter.py
"""

import asyncio
from opensandbox import Sandbox
from code_interpreter import CodeInterpreter, SupportedLanguage


async def code_interpreter_demo():
    # Create sandbox
    sandbox = await Sandbox.create("opensandbox/code-interpreter:v1.0.2")

    async with sandbox:
        print("✓ Sandbox created")

        # Create interpreter
        interpreter = await CodeInterpreter.create(sandbox)
        print("✓ Code interpreter initialized")

        # Run Python code directly
        result = await interpreter.codes.run("""
import math
import json

data = {
    "pi": math.pi,
    "sqrt_10": math.sqrt(10),
    "factorial_5": math.factorial(5)
}

print(json.dumps(data, indent=2))
""", language=SupportedLanguage.PYTHON)

        print("\n✓ Execution Results:")
        print("  Result:", result.result[0].text if result.result else "No result")
        print("  Output:", result.logs.stdout[0].text if result.logs.stdout else "No stdout")

    await sandbox.kill()
    print("\n✓ Sandbox cleaned up")


async def main():
    print("\n🐍 OpenSandbox Code Interpreter Demo\n")

    try:
        await code_interpreter_demo()
        print("\n✅ Demo completed!\n")
    except Exception as e:
        print(f"\n❌ Error: {e}\n")


if __name__ == "__main__":
    asyncio.run(main())
