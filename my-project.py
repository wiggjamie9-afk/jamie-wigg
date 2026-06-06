import asyncio
from opensandbox import Sandbox

async def my_project():
    sandbox = await Sandbox.create("python:3.12")
    
    async with sandbox:
        # Your code here
        result = await sandbox.commands.run("echo 'Hello from my project!'")
        print(result.logs.stdout[0].text)
    
    await sandbox.kill()

if __name__ == "__main__":
    asyncio.run(my_project())
