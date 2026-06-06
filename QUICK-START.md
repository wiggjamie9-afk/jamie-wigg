# 🚀 OpenSandbox Quick Start (3 Steps)

**Get a working OpenSandbox system in 10 minutes.**

---

## Prerequisites

✅ **Docker Desktop** installed and running  
✅ **Python 3.10+** installed  
✅ **This repo** cloned locally  

**Don't have Docker?** Install from: https://www.docker.com/products/docker-desktop

---

## Step 1️⃣: Auto-Install Everything (3 minutes)

```bash
bash setup-opensandbox.sh
```

### What it does:
- ✅ Checks Docker installation
- ✅ Installs OpenSandbox CLI
- ✅ Installs OpenSandbox SDKs
- ✅ Initializes configuration

### Expected output:
```
🚀 OpenSandbox Setup Script

Checking prerequisites...
✓ Docker found: Docker version 25.0.0
✓ Docker daemon running
✓ Python found: Python 3.11.0

Installing OpenSandbox packages...
✓ Packages installed

Initializing configuration...
✓ Configuration initialized
  Config file: ~/.opensandbox/config.toml

Setup Complete! 🎉

Next steps:
1. Start the OpenSandbox server (in one terminal):
   opensandbox-server --config ~/.sandbox.toml

2. Run demo scripts (in another terminal):
   python opensandbox-examples.py
```

---

## Step 2️⃣: Start the Server (Terminal 1) — Keep Running

```bash
opensandbox-server --config ~/.sandbox.toml
```

### What to do:
1. Open **Terminal 1**
2. Run the command above
3. **Keep this terminal open** — don't close it

### Expected output:
```
INFO:     Uvicorn running on http://0.0.0.0:8080
```

### ✅ You'll see:
- `Uvicorn running on http://0.0.0.0:8080` = Server is ready
- Do NOT close this terminal
- Leave it running while you test demos

---

## Step 3️⃣: Run Demo (Terminal 2) — New Terminal

```bash
python opensandbox-examples.py
```

### What to do:
1. Open **Terminal 2** (new terminal window/tab)
2. Navigate to repo: `cd /path/to/jamie-wigg`
3. Run the command above

### Expected output:
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

### ✅ If you see this = SUCCESS! 🎉

---

## 🎯 You Now Have:

- ✅ OpenSandbox server running (Terminal 1)
- ✅ Working demo execution (Terminal 2)
- ✅ All tools installed and configured
- ✅ Ready to run 5 more demos

---

## 🎮 Next: Run More Demos

### Option A: Run Specific Demos

```bash
# Data science example
python opensandbox-data-science.py

# Comprehensive examples
python opensandbox-demo.py

# Code interpreter
python opensandbox-code-interpreter.py
```

### Option B: Run All Demos at Once

```bash
bash run-demos.sh all
```

Output: All 6 demos run sequentially (~50-60 seconds total)

### Option C: Interactive Menu

```bash
bash run-demos.sh
```

Select which demo to run:
```
Available demos:
  1. Three Essential Patterns
  2. Full Workflow (Write → Execute → Read)
  3. Data Science & Analysis
  4. Comprehensive 5-Demo Suite
  5. Code Interpreter SDK
  6. Advanced Workflows
```

---

## ⚠️ Troubleshooting

### "Connection refused"
```
opensandbox.exceptions.sandbox.SandboxInternalException: 
Network connectivity error: All connection attempts failed
```

**Fix:** Make sure Terminal 1 is running the server:
```bash
opensandbox-server --config ~/.sandbox.toml
```

### "Docker daemon not running"
```
docker.errors.DockerException: Error while fetching server API version
```

**Fix:** Start Docker:
- **macOS/Windows:** Open Docker Desktop
- **Linux:** `sudo systemctl start docker`

### "No module named opensandbox"
```bash
# Fix:
pip install --upgrade opensandbox opensandbox-server
```

### "Permission denied"
```bash
# Linux: Add user to docker group
sudo usermod -aG docker $USER
# Then logout and login again
```

**Not working?** See full troubleshooting in `OPENSANDBOX-GUIDE.md`

---

## 📊 Demo Times

| Command | Duration | What it shows |
|---------|----------|---------------|
| `opensandbox-examples.py` | 3-5s | 3 essential patterns |
| `opensandbox-demo.py` | 10-15s | 5 comprehensive examples |
| `opensandbox-data-science.py` | 8-12s | Data analysis |
| `bash run-demos.sh all` | 50-60s | All 6 demos |

---

## 🎯 Success Checklist

- [ ] Step 1: Ran `bash setup-opensandbox.sh` ✓
- [ ] Step 2: Server running in Terminal 1 ✓
- [ ] Step 3: Ran `python opensandbox-examples.py` ✓
- [ ] Saw output with `Result: 84` ✓
- [ ] **You're done!** 🎉

---

## 📚 Learn More

- **All demos:** `bash run-demos.sh all`
- **Complete guide:** `cat OPENSANDBOX-GUIDE.md`
- **See outputs:** `cat DEMO-OUTPUT-GUIDE.md`
- **Master index:** `cat INDEX.md`
- **API reference:** See `OPENSANDBOX-README.md` (API section)

---

## 💡 Next Steps

### Try Data Science Example
```bash
python opensandbox-data-science.py
```

### Run All Demos
```bash
bash run-demos.sh all
```

### Create Your Own Script
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

### Build Something Real
- AI code execution (Claude/ChatGPT)
- Data processing pipeline
- Automated testing
- Browser automation
- ML training in isolation

---

## ⏱️ Timeline

```
0 min    → bash setup-opensandbox.sh (3 min total)
3 min    → opensandbox-server ... (in Terminal 1)
3 min    → python opensandbox-examples.py (5 sec)
3 min 5s → Done! Server running, demo completed
```

**10 minutes total from start to working system.**

---

## ✨ You're Ready!

Everything is installed, configured, and running.

**Terminal 1:** Server is running  
**Terminal 2:** Run any demo you want  

Pick a demo and start coding! 🚀

---

## 🔗 Quick Links

| Need | Command |
|------|---------|
| View all demos | `bash run-demos.sh` |
| Run all | `bash run-demos.sh all` |
| Data analysis | `python opensandbox-data-science.py` |
| Learn everything | `cat OPENSANDBOX-GUIDE.md` |
| See expected outputs | `cat DEMO-OUTPUT-GUIDE.md` |
| Master index | `cat INDEX.md` |

---

**Start running:** `python opensandbox-examples.py` (in Terminal 2) 🚀
