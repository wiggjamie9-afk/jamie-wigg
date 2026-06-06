# OpenSandbox Complete Index

Master reference for all files, scripts, and documentation.

---

## 🎯 6 Demo Scripts (Pick One to Start)

### ⭐ `opensandbox-examples.py` — START HERE
**Best for:** First-time users  
**Complexity:** Easy ⭐  
**Time:** 3-5 seconds  
**Demonstrates:** 3 essential patterns
- Basic command execution
- File operations (read/write)
- Code Interpreter SDK

```bash
python opensandbox-examples.py
```

**Output preview:**
```
=== Example 1: Basic Command Execution ===
4

=== Example 2: File Operations ===
File content: Hello OpenSandbox!

=== Example 3: Code Interpreter ===
Result: 84

✅ All examples completed!
```

---

### 📚 `opensandbox-demo.py` — COMPREHENSIVE
**Best for:** Learning all features  
**Complexity:** Medium ⭐⭐  
**Time:** 10-15 seconds  
**Demonstrates:** 5 complete examples
1. Basic command execution
2. File operations (read/write)
3. Running Python scripts
4. Code Interpreter SDK
5. Multiple commands with error handling

```bash
python opensandbox-demo.py
```

**What it covers:**
- Command execution with output capture
- File write/read operations
- Python script execution in sandbox
- Code Interpreter for direct execution
- Error handling (stdout/stderr)

---

### 🔄 `opensandbox-full-workflow.py` — END-TO-END
**Best for:** Understanding complete flow  
**Complexity:** Easy ⭐  
**Time:** 2-3 seconds  
**Pattern:**
1. Create sandbox
2. Write a file
3. Execute the file
4. Read results
5. Cleanup

```bash
python opensandbox-full-workflow.py
```

**Shows:** Classic write → execute → read pattern

---

### 🐍 `opensandbox-code-interpreter.py` — AI-FRIENDLY
**Best for:** LLM/AI integration  
**Complexity:** Medium ⭐⭐  
**Time:** 3-4 seconds  
**Perfect for:**
- Claude code execution
- ChatGPT integration
- Direct Python without files
- Fast iteration

```bash
python opensandbox-code-interpreter.py
```

**Advantage:** No file management needed

---

### 📊 `opensandbox-data-science.py` — DATA ANALYSIS
**Best for:** Data processing workflows  
**Complexity:** Medium ⭐⭐  
**Time:** 8-12 seconds  
**Shows:**
- Descriptive statistics (mean, median, stdev)
- Data processing pipelines
- Multiple analysis scripts
- JSON output handling

```bash
python opensandbox-data-science.py
```

**Output example:**
```json
{
  "mean": 55.0,
  "median": 55.0,
  "stdev": 30.27,
  "min": 10,
  "max": 100
}
```

---

### 🏭 `opensandbox-advanced-workflow.py` — PRODUCTION
**Best for:** Real-world usage  
**Complexity:** Medium ⭐⭐  
**Time:** 5-8 seconds  
**Advanced patterns:**
- Multiple concurrent commands
- Error/stderr handling
- Result processing
- File operations combined with commands

```bash
python opensandbox-advanced-workflow.py
```

**Production-ready:** Error handling, logging, cleanup

---

## 📚 Documentation (4 Files)

### 📖 `OPENSANDBOX-README.md` — START HERE
**Purpose:** Main entry point  
**Contains:**
- Quick start (3 steps)
- Overview of all demos
- API reference
- Example use cases
- Troubleshooting basics

**Read:** First, before running anything

---

### 📚 `OPENSANDBOX-GUIDE.md` — DETAILED REFERENCE
**Purpose:** Complete documentation  
**Contains:**
- Full installation guide
- Configuration steps
- All commands explained
- 10+ troubleshooting scenarios
- Complete API reference
- Performance tips
- Learning resources

**Read:** When you need detailed info

---

### 👀 `DEMO-OUTPUT-GUIDE.md` — VISUAL REFERENCE
**Purpose:** See what each demo outputs  
**Shows:**
- Exact output for each script
- Performance expectations
- Learning path recommendations
- Common issues & fixes
- Time durations

**Read:** Before running demos to know what to expect

---

### 🎮 `INDEX.md` — THIS FILE
**Purpose:** Master index  
**Covers:**
- All 6 scripts with descriptions
- All documentation files
- Setup/automation scripts
- Quick reference matrix
- Decision tree ("which script?")

**Read:** To navigate everything

---

## ⚙️ Setup & Automation (2 Scripts)

### ⚡ `setup-opensandbox.sh`
**Purpose:** One-command installation  
**Installs:**
- Docker check
- OpenSandbox CLI
- OpenSandbox SDKs
- Configuration files

```bash
bash setup-opensandbox.sh
```

**Time:** 2-3 minutes  
**Result:** Ready to run demos

---

### 🎮 `run-demos.sh` — INTERACTIVE RUNNER
**Purpose:** Convenient demo selection  
**Allows:**
- View available demos
- Run specific demo (by number)
- Run all 6 demos sequentially
- Check if server is running

```bash
bash run-demos.sh          # Interactive menu
bash run-demos.sh 1        # Run demo #1
bash run-demos.sh all      # Run all 6
bash run-demos.sh list     # List demos
```

---

## 🗺️ Navigation Matrix

**"Which file should I read/run?"**

| I want to... | Read | Run |
|---|---|---|
| Get started quickly | `OPENSANDBOX-README.md` | `setup-opensandbox.sh` |
| See 3 essential patterns | `DEMO-OUTPUT-GUIDE.md` | `opensandbox-examples.py` |
| Learn everything | `OPENSANDBOX-GUIDE.md` | `opensandbox-demo.py` |
| Understand the flow | `README` (top) | `opensandbox-full-workflow.py` |
| Try data analysis | `DEMO-OUTPUT-GUIDE.md` | `opensandbox-data-science.py` |
| Build something custom | `OPENSANDBOX-GUIDE.md` (API) | Copy a script + modify |
| Run all demos | None | `bash run-demos.sh all` |
| See expected outputs | `DEMO-OUTPUT-GUIDE.md` | (reference only) |

---

## 🎯 Decision Tree

**Which demo script should I run?**

```
START HERE
    │
    ├─ "I'm new to OpenSandbox"
    │   └─> opensandbox-examples.py ⭐
    │
    ├─ "I want to learn everything"
    │   └─> opensandbox-demo.py 📚
    │
    ├─ "I need to process data"
    │   └─> opensandbox-data-science.py 📊
    │
    ├─ "I'm building an AI system"
    │   └─> opensandbox-code-interpreter.py 🐍
    │
    ├─ "I need a complete workflow example"
    │   └─> opensandbox-full-workflow.py 🔄
    │
    └─ "I need production-ready patterns"
        └─> opensandbox-advanced-workflow.py 🏭
```

---

## 🚀 Quick Start Paths

### Path 1: Absolute Beginner (15 minutes)
```bash
# 1. Install (3 min)
bash setup-opensandbox.sh

# 2. Start server (1 min)
opensandbox-server --config ~/.sandbox.toml
# (keep running in background)

# 3. Try simplest example (3-5 sec)
python opensandbox-examples.py

# 4. Read the guide (5 min)
cat OPENSANDBOX-README.md
```

### Path 2: Developer (30 minutes)
```bash
# 1. Install + Start server
bash setup-opensandbox.sh
opensandbox-server --config ~/.sandbox.toml

# 2. Run comprehensive demo
python opensandbox-demo.py

# 3. Read API reference
grep -A 50 "API Quick Reference" OPENSANDBOX-GUIDE.md

# 4. Create custom script
cp opensandbox-examples.py my-sandbox.py
# (edit to your needs)
python my-sandbox.py
```

### Path 3: Data Scientist (20 minutes)
```bash
# 1. Quick setup
bash setup-opensandbox.sh
opensandbox-server --config ~/.sandbox.toml

# 2. Try data science demo
python opensandbox-data-science.py

# 3. Modify for your data
cp opensandbox-data-science.py my-analysis.py
# (change data/analysis)
python my-analysis.py
```

### Path 4: All Demos (1 hour)
```bash
# 1. Setup
bash setup-opensandbox.sh
opensandbox-server --config ~/.sandbox.toml

# 2. Run all 6 demos
bash run-demos.sh all

# 3. Read complete guide
cat OPENSANDBOX-GUIDE.md

# 4. Build your own
# (copy your favorite demo and customize)
```

---

## 📊 Scripts at a Glance

```
┌─ Demo Scripts ─────────────────────────────────────┐
│                                                    │
│  ⭐  opensandbox-examples.py        3-5s    Easy   │
│  📚  opensandbox-demo.py           10-15s  Medium │
│  🔄  opensandbox-full-workflow.py   2-3s    Easy  │
│  🐍  opensandbox-code-interpreter   3-4s   Medium │
│  📊  opensandbox-data-science.py    8-12s  Medium │
│  🏭  opensandbox-advanced-workflow   5-8s  Medium │
│                                                    │
│  Total if all run: ~50-60 seconds                 │
└────────────────────────────────────────────────────┘

┌─ Documentation Files ──────────────────────────────┐
│                                                    │
│  📖 OPENSANDBOX-README.md      (Main entry)       │
│  📚 OPENSANDBOX-GUIDE.md       (Detailed ref)     │
│  👀 DEMO-OUTPUT-GUIDE.md       (See outputs)      │
│  🗺️  INDEX.md                  (This file)        │
│                                                    │
└────────────────────────────────────────────────────┘

┌─ Setup Scripts ────────────────────────────────────┐
│                                                    │
│  ⚡ setup-opensandbox.sh      (Auto-install)      │
│  🎮 run-demos.sh              (Demo runner)       │
│                                                    │
└────────────────────────────────────────────────────┘
```

---

## 💡 Example Use Cases

### Use Case 1: AI Code Execution
```python
# Perfect for Claude, ChatGPT integration
interpreter = await CodeInterpreter.create(sandbox)
result = await interpreter.codes.run(user_code, language="python")
# See: opensandbox-code-interpreter.py
```

### Use Case 2: Data Processing
```python
# ETL, data analysis
await sandbox.files.write_files([data_file])
await sandbox.commands.run("python process.py")
results = await sandbox.files.read_file("output.csv")
# See: opensandbox-data-science.py
```

### Use Case 3: CI/CD Testing
```python
# Isolated test environment
await sandbox.commands.run("pytest tests/")
await sandbox.commands.run("npm run build")
# See: opensandbox-advanced-workflow.py
```

### Use Case 4: Browser Automation
```python
# Playwright in sandbox
sandbox = await Sandbox.create("opensandbox/code-interpreter:v1.0.2")
# (install playwright + run headless)
# See: OPENSANDBOX-GUIDE.md
```

---

## 🔗 File Relationships

```
INDEX.md (YOU ARE HERE)
├── OPENSANDBOX-README.md (Read first)
│   ├── OPENSANDBOX-GUIDE.md (Detailed info)
│   │   ├── opensandbox-examples.py ⭐ (Start here)
│   │   ├── opensandbox-demo.py 📚
│   │   ├── opensandbox-data-science.py 📊
│   │   ├── opensandbox-full-workflow.py 🔄
│   │   ├── opensandbox-code-interpreter.py 🐍
│   │   └── opensandbox-advanced-workflow.py 🏭
│   │
│   └── DEMO-OUTPUT-GUIDE.md (See what to expect)
│
├── setup-opensandbox.sh (Install everything)
└── run-demos.sh (Run any demo easily)
```

---

## ✨ Start Here Checklist

- [ ] Read `OPENSANDBOX-README.md` (5 min)
- [ ] Run `bash setup-opensandbox.sh` (3 min)
- [ ] Start server: `opensandbox-server --config ~/.sandbox.toml` (1 min)
- [ ] Run demo: `python opensandbox-examples.py` (5 sec)
- [ ] Celebrate! 🎉

**Total time: ~10 minutes to get running**

---

## 🎯 Next Steps

1. **Quick Win:** Run `opensandbox-examples.py` (3-5 sec)
2. **Learn:** Run `opensandbox-demo.py` (10-15 sec)
3. **Customize:** Copy a script and modify it
4. **Build:** Create your own sandbox scripts
5. **Integrate:** Use in your projects (AI, data, tests, etc.)

---

## 📞 Questions?

- **Setup issues?** → `OPENSANDBOX-GUIDE.md` (Troubleshooting)
- **How to use?** → `OPENSANDBOX-README.md` (API section)
- **Want to see output?** → `DEMO-OUTPUT-GUIDE.md`
- **Which demo?** → This INDEX.md (Navigation Matrix)

---

**Everything is ready.** Pick a script from the list above and run it! 🚀
