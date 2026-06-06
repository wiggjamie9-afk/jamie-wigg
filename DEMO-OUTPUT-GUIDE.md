# OpenSandbox Demo Output Guide

Visual reference for what you'll see when running each demo on your local machine.

---

## 1️⃣ Quick Start: `opensandbox-examples.py`

```bash
python opensandbox-examples.py
```

### Expected Output:

```
🎯 OpenSandbox Essential Examples

Prerequisites: Docker running + OpenSandbox server active

=== Example 1: Basic Command Execution ===
4

=== Example 2: File Operations ===
File content: Hello OpenSandbox!

=== Example 3: Code Interpreter ===
Result: 84

✅ All examples completed!
```

**Time:** ~3-5 seconds  
**What it shows:** Commands, files, code execution  
**Best for:** First-time users

---

## 2️⃣ Learn: `opensandbox-demo.py`

```bash
python opensandbox-demo.py
```

### Expected Output:

```
=== Example 1: Basic ===
✓ Sandbox created
4

=== Example 2: File Operations ===
✓ Sandbox created
✓ File written
File content: Hello OpenSandbox!

=== Example 3: File Operations ===
✓ Sandbox created
✓ Script written
✓ Script output: {"sum": 4, "product": 12, "name": "OpenSandbox"}

=== Example 4: Code Interpreter ===
✓ Sandbox created
✓ Interpreter created
✓ Interpreter output: 4

=== Example 5: Multiple Commands ===
✓ Sandbox created
   📌 Starting...
   ✓ Output: Starting...

   📌 Python version
   ✓ Output: Python 3.12.0

   📌 Sum calculation
   ✓ Output: 5050

   📌 Directory listing
   ✓ Output: (file listings)

✓ All examples completed!
```

**Time:** ~10-15 seconds  
**What it shows:** 5 complete usage patterns  
**Best for:** Learning all features

---

## 3️⃣ Explore: `opensandbox-data-science.py`

```bash
python opensandbox-data-science.py
```

### Expected Output:

```
✓ Sandbox created

✓ Analysis script written
✓ Analysis output:
{
  "mean": 55.0,
  "median": 55.0,
  "stdev": 30.27,
  "min": 10,
  "max": 100
}
✓ Sandbox cleaned up

============================================================
Advanced Data Science Demo
============================================================

✓ Sandbox created

✓ Scripts written

📌 Running: Descriptive Statistics
Descriptive Statistics:
{
  "count": 10,
  "sum": 505,
  "mean": 50.5,
  "median": 50.5,
  "variance": 916.67,
  "stdev": 30.28,
  "range": 85
}

📌 Running: List Processing
{
  "original": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  "squared": [1, 4, 9, 16, 25, 36, 49, 64, 81, 100],
  "cubed": [1, 8, 27, 64, 125, 216, 343, 512, 729, 1000],
  "even_numbers": [2, 4, 6, 8, 10],
  "sum_of_squares": 385
}

✓ Sandbox cleaned up

✅ Data science demos completed!
```

**Time:** ~8-12 seconds  
**What it shows:** Statistical analysis, data processing  
**Best for:** Data science workflows

---

## 4️⃣ Browse: `bash run-demos.sh list`

```bash
bash run-demos.sh list
```

### Expected Output:

```
🎯 OpenSandbox Demo Runner

Checking OpenSandbox server...
✓ Server is running

Available demos:
  1. Three Essential Patterns
     (opensandbox-examples.py)
  2. Full Workflow (Write → Execute → Read)
     (opensandbox-full-workflow.py)
  3. Data Science & Analysis
     (opensandbox-data-science.py)
  4. Comprehensive 5-Demo Suite
     (opensandbox-demo.py)
  5. Code Interpreter SDK
     (opensandbox-code-interpreter.py)
  6. Advanced Workflows
     (opensandbox-advanced-workflow.py)

Options:
  Run specific demo:     ./run-demos.sh 1
  Run all demos:         ./run-demos.sh all
  Just list demos:       ./run-demos.sh list

Demo scripts available for running
```

**Time:** Instant  
**What it shows:** Available demos and usage options  
**Best for:** Exploring what's available

---

## 🎮 Running Specific Demos

### Run Demo #1 Only:
```bash
bash run-demos.sh 1
```

Output: Same as `opensandbox-examples.py`

### Run Demo #3 (Data Science):
```bash
bash run-demos.sh 3
```

Output: Same as `opensandbox-data-science.py`

### Run All 6 Demos:
```bash
bash run-demos.sh all
```

Output: All demos sequentially with dividers between them

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Running: Three Essential Patterns
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

=== Example 1: Basic Command Execution ===
4
... (output continues)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Running: Full Workflow (Write → Execute → Read)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Sandbox created
✓ File written
... (output continues for all 6 demos)

✓ All demos completed
```

**Time:** ~1 minute total for all 6  
**What it shows:** Everything the package can do

---

## ✅ How to Know It's Working

When you see:
- ✅ `✓ Sandbox created` → Server is responding
- ✅ Output with numbers/JSON → Code executed successfully
- ✅ No `Connection refused` errors → Everything is working

## ⚠️ Common Issues & Fixes

### "Connection refused"
```
opensandbox.exceptions.sandbox.SandboxInternalException: 
Network connectivity error: All connection attempts failed
```

**Fix:** Make sure server is running in another terminal:
```bash
opensandbox-server --config ~/.sandbox.toml
```

### "Docker daemon not running"
```
docker.errors.DockerException: Error while fetching server API version
```

**Fix:** Start Docker:
```bash
# macOS/Windows: Open Docker Desktop
# Linux: sudo systemctl start docker
```

### "No module named opensandbox"
```bash
# Fix:
pip install --upgrade opensandbox
```

---

## 📊 Performance Expectations

| Demo | Duration | Complexity |
|------|----------|-----------|
| `opensandbox-examples.py` | 3-5s | Easy ⭐ |
| `opensandbox-full-workflow.py` | 2-3s | Easy ⭐ |
| `opensandbox-code-interpreter.py` | 3-4s | Medium ⭐⭐ |
| `opensandbox-data-science.py` | 8-12s | Medium ⭐⭐ |
| `opensandbox-demo.py` | 10-15s | Medium ⭐⭐ |
| `opensandbox-advanced-workflow.py` | 5-8s | Medium ⭐⭐ |
| **All 6 demos** | ~50-60s | Complete |

---

## 🎯 Recommended Learning Path

### Day 1: Quick Wins
```bash
# Start the server
opensandbox-server --config ~/.sandbox.toml

# Try the quick example
python opensandbox-examples.py

# Result: Understand basic patterns in <1 minute
```

### Day 2: Learn Deeply
```bash
# Run comprehensive examples
python opensandbox-demo.py

# Run data science example
python opensandbox-data-science.py

# Result: Master all features
```

### Day 3: Build Custom
```bash
# Copy opensandbox-examples.py
# Modify for your use case
# Run your custom script

# Result: Create your own sandboxes
```

---

## 💻 Next: Local Machine

Once you have Docker + OpenSandbox running locally:

1. **Try the simplest demo:**
   ```bash
   python opensandbox-examples.py
   ```

2. **See what's available:**
   ```bash
   bash run-demos.sh list
   ```

3. **Run everything:**
   ```bash
   bash run-demos.sh all
   ```

4. **Create your own:**
   ```python
   import asyncio
   from opensandbox import Sandbox

   async def my_sandbox():
       sandbox = await Sandbox.create("python:3.12")
       async with sandbox:
           result = await sandbox.commands.run("python -c 'print(42)'")
           print(result.logs.stdout[0].text)
       await sandbox.kill()

   asyncio.run(my_sandbox())
   ```

---

**Ready to start?** 🚀

```bash
bash setup-opensandbox.sh
opensandbox-server --config ~/.sandbox.toml  # Terminal 1
python opensandbox-examples.py                # Terminal 2
```
