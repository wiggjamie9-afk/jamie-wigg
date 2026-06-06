# 🏗️ Building with OpenSandbox

Now that you have a working system, build something real.

---

## 🎯 Quick Start: Copy & Customize

### Option 1: Start from Simplest Example

```bash
cp opensandbox-examples.py my-project.py
```

Then edit `my-project.py`:

```python
import asyncio
from opensandbox import Sandbox

async def my_custom_sandbox():
    sandbox = await Sandbox.create("python:3.12")
    
    async with sandbox:
        # Your code here
        result = await sandbox.commands.run("echo 'Hello World'")
        print(result.logs.stdout[0].text)
    
    await sandbox.kill()

asyncio.run(my_custom_sandbox())
```

Run it:
```bash
python my-project.py
```

---

## 🛠️ Build Patterns

### Pattern 1: Data Processing Pipeline

```python
import asyncio
from opensandbox import Sandbox
from opensandbox.models import WriteEntry
import json

async def data_pipeline():
    sandbox = await Sandbox.create("python:3.12")
    
    async with sandbox:
        # 1. Write input data
        data = {"values": [1, 2, 3, 4, 5]}
        await sandbox.files.write_files([
            WriteEntry(
                path="/tmp/input.json",
                data=json.dumps(data),
                mode=644
            )
        ])
        
        # 2. Write processing script
        await sandbox.files.write_files([
            WriteEntry(
                path="/tmp/process.py",
                data="""
import json

with open('/tmp/input.json') as f:
    data = json.load(f)

result = {
    'count': len(data['values']),
    'sum': sum(data['values']),
    'avg': sum(data['values']) / len(data['values']),
}

with open('/tmp/output.json', 'w') as f:
    json.dump(result, f)

print('Processing complete')
""",
                mode=644
            )
        ])
        
        # 3. Execute
        result = await sandbox.commands.run("python /tmp/process.py")
        print(result.logs.stdout[0].text)
        
        # 4. Read results
        output = await sandbox.files.read_file("/tmp/output.json")
        print("Results:", output)
    
    await sandbox.kill()

asyncio.run(data_pipeline())
```

**Use for:** ETL, data transformation, analytics

---

### Pattern 2: AI Code Execution

```python
import asyncio
from opensandbox import Sandbox
from code_interpreter import CodeInterpreter, SupportedLanguage

async def ai_code_execution(user_code: str):
    """Perfect for Claude/ChatGPT integration"""
    sandbox = await Sandbox.create("opensandbox/code-interpreter:v1.0.2")
    
    async with sandbox:
        interpreter = await CodeInterpreter.create(sandbox)
        
        try:
            result = await interpreter.codes.run(
                user_code,
                language=SupportedLanguage.PYTHON
            )
            
            print("Result:", result.result[0].text if result.result else "No output")
            print("Output:", result.logs.stdout[0].text if result.logs.stdout else "")
            
            return {
                "success": True,
                "result": result.result[0].text if result.result else None,
                "output": result.logs.stdout[0].text if result.logs.stdout else None
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
        finally:
            await sandbox.kill()

# Example usage
if __name__ == "__main__":
    code = """
import math
result = math.factorial(5)
print(f"5! = {result}")
result
"""
    
    result = asyncio.run(ai_code_execution(code))
    print(result)
```

**Use for:** LLM integration, user code execution, AI assistants

---

### Pattern 3: Testing & Validation

```python
import asyncio
from opensandbox import Sandbox
from opensandbox.models import WriteEntry

async def run_tests():
    """Isolated test environment"""
    sandbox = await Sandbox.create("python:3.12")
    
    async with sandbox:
        # Write test file
        await sandbox.files.write_files([
            WriteEntry(
                path="/tmp/test.py",
                data="""
def add(a, b):
    return a + b

def test_add():
    assert add(2, 2) == 4
    assert add(0, 0) == 0
    assert add(-1, 1) == 0
    print("✓ All tests passed")

if __name__ == "__main__":
    test_add()
""",
                mode=644
            )
        ])
        
        # Run tests
        result = await sandbox.commands.run("python /tmp/test.py")
        
        if result.logs.stdout:
            print("✓ Tests passed:", result.logs.stdout[0].text)
        if result.logs.stderr:
            print("✗ Tests failed:", result.logs.stderr[0].text)
    
    await sandbox.kill()

asyncio.run(run_tests())
```

**Use for:** CI/CD, automated testing, validation

---

### Pattern 4: Multi-Command Workflow

```python
import asyncio
from opensandbox import Sandbox

async def multi_command_workflow():
    """Execute multiple commands in sequence"""
    sandbox = await Sandbox.create("python:3.12")
    
    async with sandbox:
        commands = [
            ("Check Python version", "python --version"),
            ("Create directory", "mkdir -p /tmp/myapp"),
            ("Write script", "cat > /tmp/myapp/main.py << 'EOF'\nprint('Hello App')\nEOF"),
            ("Run script", "python /tmp/myapp/main.py"),
            ("List files", "ls -la /tmp/myapp"),
        ]
        
        for name, cmd in commands:
            print(f"\n📌 {name}")
            result = await sandbox.commands.run(cmd)
            
            if result.logs.stdout:
                print(f"✓ {result.logs.stdout[0].text}")
            if result.logs.stderr:
                print(f"✗ {result.logs.stderr[0].text}")
    
    await sandbox.kill()

asyncio.run(multi_command_workflow())
```

**Use for:** Workflows, pipelines, automation

---

### Pattern 5: Error Handling & Recovery

```python
import asyncio
from opensandbox import Sandbox

async def robust_execution():
    """Handle errors gracefully"""
    sandbox = await Sandbox.create("python:3.12")
    
    try:
        async with sandbox:
            # Try to run code that might fail
            result = await sandbox.commands.run(
                "python -c 'x = 1/0'"  # Division by zero
            )
            
            if result.logs.stderr:
                print("Error caught:")
                print(result.logs.stderr[0].text)
                
                # Handle error
                print("\nTrying recovery...")
                recovery = await sandbox.commands.run(
                    "python -c 'x = 1/1; print(x)'"
                )
                print("Recovery result:", recovery.logs.stdout[0].text)
    
    except Exception as e:
        print(f"Sandbox error: {e}")
    
    finally:
        await sandbox.kill()
        print("✓ Cleanup complete")

asyncio.run(robust_execution())
```

**Use for:** Fault tolerance, graceful degradation

---

## 🎯 Real-World Examples

### Example 1: Image Processing Pipeline

```python
import asyncio
from opensandbox import Sandbox
from opensandbox.models import WriteEntry

async def image_processing():
    # Use image-capable container
    sandbox = await Sandbox.create("python:3.12")
    
    async with sandbox:
        # Install PIL
        await sandbox.commands.run("pip install pillow --quiet")
        
        # Create processing script
        await sandbox.files.write_files([
            WriteEntry(
                path="/tmp/process_image.py",
                data="""
from PIL import Image, ImageFilter
import os

# Create sample image
img = Image.new('RGB', (100, 100), color='red')
img.save('/tmp/sample.png')

# Apply filter
blurred = img.filter(ImageFilter.BLUR)
blurred.save('/tmp/blurred.png')

print('Image processing complete')
print(f'Original: {os.path.getsize("/tmp/sample.png")} bytes')
print(f'Blurred: {os.path.getsize("/tmp/blurred.png")} bytes')
""",
                mode=644
            )
        ])
        
        # Run processing
        result = await sandbox.commands.run("python /tmp/process_image.py")
        print(result.logs.stdout[0].text)
        
        # Get results
        blurred_data = await sandbox.files.read_file("/tmp/blurred.png")
        print(f"Result size: {len(blurred_data)} bytes")
    
    await sandbox.kill()

asyncio.run(image_processing())
```

---

### Example 2: Web Scraping in Isolation

```python
import asyncio
from opensandbox import Sandbox

async def web_scraping():
    sandbox = await Sandbox.create("python:3.12")
    
    async with sandbox:
        # Install requests
        await sandbox.commands.run("pip install requests beautifulsoup4 --quiet")
        
        # Run scraper
        result = await sandbox.commands.run("""
python -c "
import requests
from bs4 import BeautifulSoup

# Note: Uses public APIs, safe in sandbox
print('Web scraping ready')
print('(Install and run your scraper here)')
"
""")
        
        print(result.logs.stdout[0].text)
    
    await sandbox.kill()

asyncio.run(web_scraping())
```

---

### Example 3: Machine Learning Model

```python
import asyncio
from opensandbox import Sandbox

async def ml_training():
    sandbox = await Sandbox.create("python:3.12")
    
    async with sandbox:
        # Install ML libraries
        await sandbox.commands.run(
            "pip install numpy scikit-learn --quiet"
        )
        
        # Train model
        result = await sandbox.commands.run("""
python -c "
from sklearn import datasets
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

# Load data
iris = datasets.load_iris()
X_train, X_test, y_train, y_test = train_test_split(
    iris.data, iris.target, test_size=0.2
)

# Train model
model = RandomForestClassifier()
model.fit(X_train, y_train)

# Evaluate
pred = model.predict(X_test)
acc = accuracy_score(y_test, pred)
print(f'Model accuracy: {acc:.2%}')
"
""")
        
        print(result.logs.stdout[0].text)
    
    await sandbox.kill()

asyncio.run(ml_training())
```

---

## 🔧 Development Workflow

### Step 1: Create Base Script
```bash
cp opensandbox-examples.py my-app.py
```

### Step 2: Add Your Logic
```python
# Edit my-app.py
# - Change Docker image if needed
# - Modify commands
# - Add file processing
# - Handle results
```

### Step 3: Test Locally
```bash
python my-app.py
```

### Step 4: Iterate
```bash
# Keep server running in Terminal 1
# Modify and re-run in Terminal 2
python my-app.py
```

### Step 5: Optimize
- Add error handling
- Improve performance
- Cache results
- Add logging

---

## 🐳 Available Docker Images

```python
# Python versions
"python:3.9"
"python:3.10"
"python:3.11"
"python:3.12"

# Node.js
"node:18"
"node:20"

# Other languages
"ruby:3.2"
"golang:1.21"
"rust:latest"

# Ubuntu with tools
"ubuntu:22.04"
"debian:bookworm"

# AI-ready
"opensandbox/code-interpreter:v1.0.2"
```

---

## 📊 API Quick Reference

```python
# Create sandbox
sandbox = await Sandbox.create("python:3.12", timeout_seconds=1800)

# Run command
result = await sandbox.commands.run("python script.py")
stdout = result.logs.stdout[0].text if result.logs.stdout else ""
stderr = result.logs.stderr[0].text if result.logs.stderr else ""

# Write files
await sandbox.files.write_files([
    WriteEntry(path="/tmp/file.txt", data="content", mode=644)
])

# Read files
content = await sandbox.files.read_file("/tmp/file.txt")

# Cleanup
await sandbox.kill()

# Or auto-cleanup
async with sandbox:
    # Your code
    pass  # Auto-cleanup
```

---

## 🚀 Next Steps

1. **Pick a pattern** above
2. **Copy & customize** for your use case
3. **Test locally** with running server
4. **Iterate** until it works
5. **Deploy** or integrate into your system

---

## 💡 Ideas to Build

- 🤖 AI code execution service
- 📊 Data processing pipeline
- 🧪 Automated testing framework
- 🌐 Web scraper
- 🎬 Video processor
- 📈 ML model trainer
- 🔍 Document analyzer
- 🎨 Image manipulator

---

## 📝 Template to Start

```python
import asyncio
from opensandbox import Sandbox
from opensandbox.models import WriteEntry

async def my_project():
    """Your description here"""
    sandbox = await Sandbox.create("python:3.12")
    
    async with sandbox:
        # 1. Setup (install, create files)
        # await sandbox.commands.run("pip install package --quiet")
        
        # 2. Process
        # result = await sandbox.commands.run("python script.py")
        
        # 3. Get results
        # output = await sandbox.files.read_file("/tmp/output.txt")
        
        # 4. Return/display
        pass
    
    await sandbox.kill()

if __name__ == "__main__":
    asyncio.run(my_project())
```

---

**Ready to build?** Pick a pattern and start coding! 🚀
