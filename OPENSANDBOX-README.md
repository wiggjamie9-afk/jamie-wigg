# OpenSandbox Integration

Complete OpenSandbox (Alibaba) setup with Python SDK demos, guides, and automation scripts.

## 🎯 What This Is

This directory contains **production-ready** examples for using [OpenSandbox](https://github.com/alibaba/OpenSandbox) — Alibaba's open-source sandbox platform for creating isolated, containerized execution environments.

**Use cases:**
- Run untrusted code safely
- AI/LLM integration (code execution)
- Data processing pipelines
- Development/testing in isolation
- Browser automation
- Training workloads

## 📦 What's Included

### Demo Scripts (6 files)
```
opensandbox-demo.py                    # 5 comprehensive examples
opensandbox-examples.py                # 3 essential patterns
opensandbox-full-workflow.py           # Write → Execute → Read
opensandbox-code-interpreter.py        # AI-friendly Python execution
opensandbox-data-science.py            # Statistical analysis
opensandbox-advanced-workflow.py       # Production patterns
```

### Setup & Documentation
```
setup-opensandbox.sh                   # Automated installation
run-demos.sh                           # Interactive demo runner
OPENSANDBOX-GUIDE.md                   # Complete documentation
OPENSANDBOX-README.md                  # This file
```

## ⚡ Quick Start (3 Steps)

### 1️⃣ Auto-Install Everything
```bash
bash setup-opensandbox.sh
```

This will:
- ✅ Check Docker installation
- ✅ Install OpenSandbox CLI & SDKs
- ✅ Initialize configuration
- ✅ Create server config

**Prerequisites:** Docker Desktop running, Python 3.10+

### 2️⃣ Start the Server (Terminal 1)
```bash
opensandbox-server --config ~/.sandbox.toml
```

You'll see:
```
INFO:     Uvicorn running on http://0.0.0.0:8080
```

**Keep this terminal open** — the server needs to stay running.

### 3️⃣ Run Demos (Terminal 2)
```bash
# Option A: Interactive menu
bash run-demos.sh

# Option B: Run all demos
bash run-demos.sh all

# Option C: Run specific demo
python opensandbox-examples.py
```

## 📊 Demo Scripts Explained

### `opensandbox-examples.py` ⭐ Start Here
**Best for:** First-time users  
**Demonstrates:** Basic → File I/O → Code Interpreter
```bash
python opensandbox-examples.py
```

Expected output:
```
=== Example 1: Basic Command Execution ===
4

=== Example 2: File Operations ===
File content: Hello OpenSandbox!

=== Example 3: Code Interpreter ===
Result: 84

✅ All examples completed!
```

### `opensandbox-demo.py` 📚 Comprehensive
**Best for:** Learning all features  
**5 Examples:**
1. Basic command execution
2. File operations (read/write)
3. Python script execution
4. Code Interpreter SDK
5. Multiple commands with error handling

```bash
python opensandbox-demo.py
```

### `opensandbox-data-science.py` 📊 Data Analysis
**Best for:** Statistical computing  
**Shows:**
- Descriptive statistics (mean, median, stdev)
- Data processing
- Multiple analysis scripts

```bash
python opensandbox-data-science.py
```

Output example:
```json
{
  "mean": 55.0,
  "median": 55.0,
  "stdev": 30.27,
  "min": 10,
  "max": 100
}
```

### `opensandbox-full-workflow.py` 🔄 End-to-End
**Best for:** Understanding the complete workflow  
**Pattern:**
```python
1. Create sandbox
2. Write a file
3. Execute the file
4. Read results
5. Cleanup
```

```bash
python opensandbox-full-workflow.py
```

### `opensandbox-code-interpreter.py` 🐍 Direct Execution
**Best for:** AI/LLM integration  
**Perfect for:** Running Python code without file management

```bash
python opensandbox-code-interpreter.py
```

### `opensandbox-advanced-workflow.py` 🏭 Production
**Best for:** Real-world usage patterns  
**Includes:**
- Multiple concurrent commands
- Error/stderr handling
- File operations
- Result processing

```bash
python opensandbox-advanced-workflow.py
```

## 🎮 Interactive Demo Runner

```bash
bash run-demos.sh
```

This shows a menu:
```
🎯 OpenSandbox Demo Runner

Available demos:
  1. Three Essential Patterns
  2. Full Workflow (Write → Execute → Read)
  3. Data Science & Analysis
  4. Comprehensive 5-Demo Suite
  5. Code Interpreter SDK
  6. Advanced Workflows

Options:
  Run specific demo:     ./run-demos.sh 1
  Run all demos:         ./run-demos.sh all
  Just list demos:       ./run-demos.sh list
```

### Usage Examples
```bash
# Run demo #1 only
./run-demos.sh 1

# Run demos #1 and #3
./run-demos.sh 1
./run-demos.sh 3

# Run all 6 demos sequentially
./run-demos.sh all

# Just list available demos
./run-demos.sh list
```

## 📖 Full Documentation

For detailed documentation, troubleshooting, and API reference:
```bash
cat OPENSANDBOX-GUIDE.md
```

Topics covered:
- ✅ Prerequisites & installation
- ✅ Configuration
- ✅ Troubleshooting (10 common issues)
- ✅ Complete API reference
- ✅ Performance tips
- ✅ Example code

## 🔧 Creating Your Own Sandbox Script

```python
import asyncio
from opensandbox import Sandbox
from opensandbox.models import WriteEntry

async def my_sandbox():
    # 1. Create sandbox (defaults to Python 3.12)
    sandbox = await Sandbox.create("python:3.12", timeout_seconds=1800)
    
    async with sandbox:
        # 2. Write a file
        await sandbox.files.write_files([
            WriteEntry(path="/tmp/script.py", data="print('Hello!')", mode=644)
        ])
        
        # 3. Run a command
        result = await sandbox.commands.run("python /tmp/script.py")
        
        # 4. Get output
        output = result.logs.stdout[0].text
        print(output)
    
    # 5. Auto-cleanup (when exiting async with block)

asyncio.run(my_sandbox())
```

## 🐳 Docker Images Available

Any Docker image works as a sandbox:

```python
# Python
await Sandbox.create("python:3.12")

# Node.js
await Sandbox.create("node:20")

# Ubuntu
await Sandbox.create("ubuntu:22.04")

# Custom image
await Sandbox.create("my-custom-image:latest")

# Code Interpreter (with AI support)
await Sandbox.create("opensandbox/code-interpreter:v1.0.2")
```

## ⚙️ API Quick Reference

### Create Sandbox
```python
sandbox = await Sandbox.create(
    "python:3.12",           # Docker image
    timeout_seconds=1800     # 30 minutes
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
# Write file
await sandbox.files.write_files([
    WriteEntry(path="/tmp/file.txt", data="content", mode=644)
])

# Read file
content = await sandbox.files.read_file("/tmp/file.txt")
```

### Code Interpreter
```python
from code_interpreter import CodeInterpreter

interpreter = await CodeInterpreter.create(sandbox)
result = await interpreter.codes.run("print(2+2)", language="python")
print(result.result[0].text)  # "4"
```

### Cleanup
```python
await sandbox.kill()

# Or auto-cleanup with context manager:
async with sandbox:
    # Your code
    pass  # Auto-cleanup happens here
```

## 🚨 Troubleshooting

### "Connection refused"
```bash
# Check if server is running
curl http://localhost:8080/health

# Start server in another terminal
opensandbox-server --config ~/.sandbox.toml
```

### "Docker daemon not running"
```bash
# macOS/Windows: Open Docker Desktop
# Linux:
sudo systemctl start docker
```

### "No module named opensandbox"
```bash
# Reinstall packages
pip install --upgrade opensandbox opensandbox-server
```

### "Permission denied" (Linux)
```bash
# Add user to docker group
sudo usermod -aG docker $USER
# Logout and login again
```

For more troubleshooting, see `OPENSANDBOX-GUIDE.md`.

## 📚 Learn More

- **OpenSandbox GitHub:** https://github.com/alibaba/OpenSandbox
- **OpenSandbox Documentation:** https://opensandbox.io
- **Examples Directory:** https://github.com/alibaba/OpenSandbox/tree/main/examples

## 🎯 Next Steps

1. **Try the quick start:** Run `bash setup-opensandbox.sh`
2. **Start the server:** Run `opensandbox-server --config ~/.sandbox.toml`
3. **Run a demo:** Pick one from the list above
4. **Customize:** Copy a demo script and modify it
5. **Build:** Create your own sandbox scripts

## 💡 Example Use Cases

### AI Code Execution
```python
# Perfect for Claude, ChatGPT, or other AI assistants
interpreter = await CodeInterpreter.create(sandbox)
result = await interpreter.codes.run(user_code, language="python")
```

### Data Processing Pipeline
```python
# Write → Process → Read
await sandbox.files.write_files([training_data])
await sandbox.commands.run("python process.py")
results = await sandbox.files.read_file("output.csv")
```

### Testing & CI/CD
```python
# Isolated test environment
await sandbox.commands.run("pytest tests/")
await sandbox.commands.run("npm run build")
```

### Browser Automation
```python
# Playwright inside sandbox
sandbox = await Sandbox.create("opensandbox/code-interpreter:v1.0.2")
# Install playwright and run headless automation
```

## 📝 License & Attribution

OpenSandbox is Apache 2.0 licensed.  
Demo scripts and documentation in this repository are provided as-is for learning and reference.

---

**Ready to start?** Run: `bash setup-opensandbox.sh` 🚀
