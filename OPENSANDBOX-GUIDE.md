# OpenSandbox Setup & Usage Guide

## Prerequisites

✅ **Required:**
- Docker Desktop (macOS/Windows) or Docker daemon (Linux)
- Python 3.10+
- pip or uv

## Installation

### 1. Install OpenSandbox Tools

```bash
# Option A: Using uv (recommended)
uv tool install opensandbox-cli
uv pip install opensandbox opensandbox-server opensandbox-code-interpreter

# Option B: Using pip
pip install opensandbox opensandbox-cli opensandbox-server opensandbox-code-interpreter
```

### 2. Initialize Configuration

```bash
# Create config file
opensandbox-server init-config ~/.sandbox.toml --example docker

# Configure CLI
osb config init
osb config set connection.domain localhost:8080
osb config set connection.protocol http
```

## Quick Start

### Terminal 1: Start the Server

```bash
opensandbox-server --config ~/.sandbox.toml
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8080
```

### Terminal 2: Run Demo Scripts

```bash
# Navigate to repo
cd /path/to/jamie-wigg

# Run the demos
python opensandbox-demo.py
python opensandbox-examples.py
python opensandbox-data-science.py
python opensandbox-full-workflow.py
python opensandbox-code-interpreter.py
python opensandbox-advanced-workflow.py
```

## Example Output

When you run a script successfully, you'll see:

```
✓ Sandbox created
✓ File written
✓ Script output: 4

✓ Sandbox cleaned up
```

## Troubleshooting

### "Connection refused" Error
**Problem:** Server isn't running or unreachable  
**Solution:**
```bash
# Make sure you're running this in Terminal 1
opensandbox-server --config ~/.sandbox.toml

# Verify Docker is running
docker ps
```

### "Docker daemon not running"
**Problem:** Docker service isn't active  
**Solution:**
- **macOS/Windows:** Open Docker Desktop
- **Linux:** 
  ```bash
  sudo systemctl start docker
  # Or
  sudo service docker start
  ```

### "No module named opensandbox"
**Problem:** Packages not installed  
**Solution:**
```bash
pip install --upgrade opensandbox opensandbox-server
```

### "Permission denied"
**Problem:** Docker requires elevated privileges  
**Solution:**
```bash
# macOS/Windows: Use Docker Desktop UI
# Linux: Add your user to docker group
sudo usermod -aG docker $USER
# Then logout and login
```

## Running Individual Scripts

### 1. **opensandbox-demo.py** - Best for Learning
5 complete examples in one script:
```bash
python opensandbox-demo.py
```

**What it does:**
- ✅ Basic command execution
- ✅ File operations (read/write)
- ✅ Running Python scripts
- ✅ Code Interpreter SDK
- ✅ Multiple commands

### 2. **opensandbox-examples.py** - Quick Reference
Three essential patterns:
```bash
python opensandbox-examples.py
```

**What it does:**
- Command execution
- File I/O
- Direct code execution

### 3. **opensandbox-data-science.py** - Data Analysis
Statistical computing example:
```bash
python opensandbox-data-science.py
```

**What it does:**
- Descriptive statistics
- Data processing
- Multiple analysis scripts

### 4. **opensandbox-full-workflow.py** - End-to-End
Complete workflow pattern:
```bash
python opensandbox-full-workflow.py
```

**What it does:**
- Create sandbox
- Write files
- Execute code
- Read results
- Cleanup

### 5. **opensandbox-code-interpreter.py** - AI-Friendly
Direct Python execution:
```bash
python opensandbox-code-interpreter.py
```

**What it does:**
- Uses Code Interpreter SDK
- No file management needed
- Perfect for AI/LLM integration

### 6. **opensandbox-advanced-workflow.py** - Production Patterns
Real-world usage:
```bash
python opensandbox-advanced-workflow.py
```

**What it does:**
- Multiple concurrent commands
- Error/stderr handling
- Result processing
- File operations

## Next Steps

### Try It Yourself

1. **Start server (Terminal 1):**
   ```bash
   opensandbox-server --config ~/.sandbox.toml
   ```

2. **Run demo (Terminal 2):**
   ```bash
   python opensandbox-demo.py
   ```

3. **Customize a script:**
   - Copy `opensandbox-examples.py`
   - Modify to your needs
   - Run it!

### Create Your Own Script

```python
import asyncio
from opensandbox import Sandbox

async def my_sandbox():
    sandbox = await Sandbox.create("python:3.12")
    async with sandbox:
        # Your code here
        result = await sandbox.commands.run("python -c 'print(\"Hello\")'")
        print(result.logs.stdout[0].text)
    await sandbox.kill()

asyncio.run(my_sandbox())
```

## API Reference

### Create a Sandbox
```python
sandbox = await Sandbox.create(
    "python:3.12",           # Docker image
    timeout_seconds=1800      # 30 minutes
)
```

### Run Commands
```python
result = await sandbox.commands.run("python script.py")
print(result.logs.stdout[0].text)  # Output
print(result.logs.stderr[0].text)  # Errors
```

### File Operations
```python
# Write
await sandbox.files.write_files([
    WriteEntry(path="/tmp/file.txt", data="content", mode=644)
])

# Read
content = await sandbox.files.read_file("/tmp/file.txt")
```

### Code Interpreter
```python
from code_interpreter import CodeInterpreter

interpreter = await CodeInterpreter.create(sandbox)
result = await interpreter.codes.run("print(2+2)", language="python")
```

### Cleanup
```python
await sandbox.kill()
# Or use async context manager (auto-cleanup)
async with sandbox:
    # Your code
    pass  # Auto-cleanup happens here
```

## Performance Tips

- **Reuse sandboxes:** Create once, run multiple commands
- **Use Code Interpreter:** Faster for direct Python execution
- **Batch operations:** Write all files before running commands
- **Set reasonable timeouts:** Don't let sandboxes run forever

## Learn More

- **Official Docs:** https://opensandbox.io/docs
- **GitHub:** https://github.com/alibaba/OpenSandbox
- **Examples:** Check the `/examples` directory in the repo

---

**Ready?** Start the server and run a demo! 🚀
