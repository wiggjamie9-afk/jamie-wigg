---
name: claw-code
version: 1.0.0
description: |
  Claw Code — Open-source Rust port of Claude Code. Build from source, command-line
  interface to Claude (and compatible providers). Multi-provider support: Anthropic,
  OpenAI, local (Ollama, llama.cpp, vLLM). Terminal-first workflow with file context,
  attachments, sessions, and multi-provider switching. MIT licensed, community-driven.
compatibility: cli terminal bash zsh powershell
license: MIT
---

# Claw Code — Open-Source Claude CLI

Community-maintained Rust implementation of Claude Code. Command-line interface to Claude API (+ OpenAI, local providers). Build from source, deploy anywhere, zero vendor lock-in.

## Why Claw Code?

### The Opportunity

Claw Code is built for:
- **Terminal-first** — Full Claude capabilities in your shell (bash, zsh, PowerShell)
- **Multi-provider** — Switch between Claude (Anthropic), OpenAI, Ollama, llama.cpp, vLLM
- **Open source** — MIT licensed, build from source, audit the code
- **Portable** — Deploy on any system with Rust (Linux, macOS, Windows, WSL)
- **No vendor lock-in** — Your data stays local, no Claude subscription required (just API key)
- **Sessions** — Persistent conversation state across commands
- **File context** — @path syntax for including files, @git for git context
- **Attachments** — Include code, logs, screenshots directly in prompts

### Comparison

| Feature | Claude Code (Web) | Claw Code (CLI) | Cursor | VS Code + ext |
|---|---|---|---|---|
| **Terminal access** | ❌ Web-only | ✅ Native CLI | ✅ Terminal | ✅ Terminal |
| **Multi-provider** | ❌ Anthropic only | ✅ Claude/OpenAI/local | ❌ Cursor AI only | ✅ Extensions |
| **File context** | ✅ Web UI | ✅ @path syntax | ✅ Inline | ✅ Inline |
| **Open source** | ❌ Proprietary | ✅ MIT, GitHub | ❌ Proprietary | ✅ Open source |
| **Local execution** | ❌ Cloud | ✅ Local CLI | ✅ Local | ✅ Local |
| **Build from source** | ❌ No | ✅ Yes (Rust) | ❌ No | ✅ Limited |
| **Self-hosted option** | ❌ No | ✅ Yes | ❌ No | ✅ Limited |

**Claw Code advantage:** Terminal-native, multi-provider, open-source, build-from-source, no subscription required.

---

## Installation & Setup

### Prerequisites

```bash
# Install Rust (if not already installed)
# macOS/Linux: https://rustup.rs/
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Windows: Download from https://rustup.rs/ and run installer
# Close and reopen terminal after installation

# Verify Rust is installed
rustc --version
cargo --version
```

### Build from Source

```bash
# Clone the repository
git clone https://github.com/ultraworkers/claw-code
cd claw-code/rust

# Build the workspace (creates binary in target/debug/claw)
cargo build --workspace

# Optional: Build release (optimized, slower compile)
cargo build --workspace --release
# Binary location: target/release/claw
```

### Set API Key

```bash
# Export Anthropic API key (from https://console.anthropic.com/)
export ANTHROPIC_API_KEY="sk-ant-..."

# Or set temporarily for single command
ANTHROPIC_API_KEY="sk-ant-..." ./target/debug/claw prompt "hello"

# Windows PowerShell
$env:ANTHROPIC_API_KEY = "sk-ant-..."
.\target\debug\claw.exe prompt "hello"
```

### Verify Installation

```bash
# Run health check
./target/debug/claw doctor

# Should output:
# ✅ API key configured
# ✅ Model access verified
# ✅ Tool configuration loaded
# ✅ Ready to use

# Or on Windows
.\target\debug\claw.exe doctor
```

### Optional: Add to PATH

```bash
# macOS/Linux: Symlink to /usr/local/bin
ln -s $(pwd)/target/debug/claw /usr/local/bin/claw

# Or use cargo install
cd claw-code/rust
cargo install --path . --force

# Then run from anywhere
claw --help
```

---

## Quick Start

### 1. Basic Prompt

```bash
# Single prompt
./target/debug/claw prompt "Explain quantum computing in 100 words"

# Windows
.\target\debug\claw.exe prompt "Explain quantum computing in 100 words"
```

### 2. Interactive Session

```bash
# Start interactive REPL
./target/debug/claw

# Then type prompts at the prompt:
# > Explain REST API design
# (Claude responds)
# > What are best practices?
# (Continues conversation)
# > exit
```

### 3. File Context (@path)

```bash
# Include a file in the prompt
./target/debug/claw prompt "Review this code for bugs: @src/main.rs"

# Include entire directory
./target/debug/claw prompt "Analyze this project structure: @./"

# Include multiple files
./target/debug/claw prompt "Explain the relationship: @src/lib.rs @src/main.rs"

# Include git context
./target/debug/claw prompt "What changed recently? @git"
```

### 4. Sessions (Persistent Conversations)

```bash
# Start named session
./target/debug/claw session create "my-project"

# Add prompts to session (maintains context)
./target/debug/claw prompt -s "my-project" "Set up a REST API in Rust"
./target/debug/claw prompt -s "my-project" "Add database layer"
./target/debug/claw prompt -s "my-project" "What's the architecture so far?"

# View session history
./target/debug/claw session list
./target/debug/claw session show "my-project"

# Resume session
./target/debug/claw session resume "my-project"
```

### 5. Multi-Provider Switching

```bash
# Use OpenAI instead of Anthropic
export OPENAI_API_KEY="sk-..."
./target/debug/claw prompt --provider openai "hello"

# Use local Ollama model
./target/debug/claw prompt --provider ollama --model "llama2" "hello"

# Use vLLM server
./target/debug/claw prompt --provider vllm --model "mistral" "hello"

# Configure default provider
./target/debug/claw config set provider openai
```

---

## Commands Reference

### Help & Status

| Command | Purpose |
|---|---|
| `claw --help` | Show all commands |
| `claw doctor` | Health check (API key, models, tools) |
| `claw status` | Current configuration |
| `claw config env` | Show environment variables |

### Prompting

| Command | Purpose |
|---|---|
| `claw prompt "text"` | Single prompt |
| `claw prompt --file script.sh` | Prompt from file |
| `claw prompt -s session-name` | Prompt in named session |
| `claw prompt --provider openai` | Use different provider |
| `claw prompt --model claude-opus` | Specify model |

### Sessions

| Command | Purpose |
|---|---|
| `claw session create <name>` | Create new session |
| `claw session list` | List all sessions |
| `claw session show <name>` | View session history |
| `claw session resume <name>` | Continue session in REPL |
| `claw session delete <name>` | Delete session |

### Configuration

| Command | Purpose |
|---|---|
| `claw config set <key> <value>` | Set config option |
| `claw config get <key>` | Get config value |
| `claw config show` | Show all config |
| `claw config reset` | Reset to defaults |

### Context & Attachments

| Syntax | Purpose |
|---|---|
| `@path/to/file` | Include file in prompt |
| `@./` | Include current directory |
| `@git` | Include git context (recent changes) |
| `@clipboard` | Include clipboard content (if supported) |

---

## Real-World Workflows

### Workflow 1: Code Review Loop

```bash
# Create persistent session for code review
./target/debug/claw session create "code-review-$project"

# Review file 1
./target/debug/claw prompt -s "code-review-$project" "Review: @src/auth.rs"

# Review file 2 (session maintains context)
./target/debug/claw prompt -s "code-review-$project" "Review: @src/db.rs"

# Ask follow-up (has full context of both reviews)
./target/debug/claw prompt -s "code-review-$project" "How do auth and db interact?"

# Export review summary
./target/debug/claw session show "code-review-$project" > review-summary.md
```

### Workflow 2: Multi-Provider Analysis

```bash
# Analyze with Claude
./target/debug/claw prompt --provider anthropic "Analyze: @data.csv"

# Compare with OpenAI perspective
./target/debug/claw prompt --provider openai "Same analysis: @data.csv"

# Compare with local model (free)
./target/debug/claw prompt --provider ollama --model qwen2 "Same analysis: @data.csv"

# Pick best analysis, incorporate feedback
./target/debug/claw prompt -s "analysis" "Synthesize these perspectives: @analysis.md"
```

### Workflow 3: Documentation Generation

```bash
# Generate from code
./target/debug/claw prompt "Write API documentation: @src/api/" > docs/api.md

# Generate from architecture
./target/debug/claw prompt "Explain system design: @docs/architecture.txt" > docs/design.md

# Generate from git history
./target/debug/claw prompt "Changelog for v2.0: @git" > CHANGELOG.md

# Session to refine documentation
./target/debug/claw session create "docs"
./target/debug/claw prompt -s "docs" "Expand this section: @docs/api.md"
./target/debug/claw prompt -s "docs" "Add examples for: @docs/api.md"
```

### Workflow 4: Bug Investigation

```bash
# Create session for bug analysis
./target/debug/claw session create "bug-$ticket"

# Include error logs
./target/debug/claw prompt -s "bug-$ticket" "Debug: @logs/error.log"

# Include relevant code
./target/debug/claw prompt -s "bug-$ticket" "This is the affected code: @src/payment.rs"

# Ask follow-up questions with full context
./target/debug/claw prompt -s "bug-$ticket" "What's the root cause?"
./target/debug/claw prompt -s "bug-$ticket" "How do we fix it safely?"

# Document findings
./target/debug/claw session show "bug-$ticket" > bug-analysis.md
```

---

## Windows-Specific Setup

### PowerShell Installation

```powershell
# 1. Install Rust from https://rustup.rs/
# 2. Close and reopen PowerShell
# 3. Verify Rust is installed
cargo --version

# 4. Clone and build
git clone https://github.com/ultraworkers/claw-code
cd claw-code/rust
cargo build --workspace

# 5. Set API key
$env:ANTHROPIC_API_KEY = "sk-ant-..."

# 6. Run with .exe extension
.\target\debug\claw.exe doctor
.\target\debug\claw.exe prompt "hello"

# 7. Add to PATH (permanent)
# Edit System Environment Variables → Path → Add:
# C:\Users\YourName\path\to\claw-code\rust\target\debug
```

### Git Bash Alternative

If you prefer bash-style paths:

```bash
# Git Bash or WSL (ships with Git for Windows)
./target/debug/claw prompt "hello"

# MINGW64 prompt is expected and normal
```

---

## Multi-Provider Configuration

### Anthropic (Default)

```bash
export ANTHROPIC_API_KEY="sk-ant-..."
./target/debug/claw prompt "hello"
```

### OpenAI

```bash
export OPENAI_API_KEY="sk-..."
./target/debug/claw prompt --provider openai "hello"

# Or set as default
./target/debug/claw config set provider openai
```

### Local: Ollama

```bash
# 1. Install Ollama (https://ollama.ai/)
ollama pull llama2
ollama serve

# 2. In another terminal
./target/debug/claw prompt --provider ollama --model llama2 "hello"

# Ollama runs on localhost:11434 by default
```

### Local: llama.cpp

```bash
# 1. Build llama.cpp with server
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp
make server

# 2. Run server
./server -m model.gguf -ngl 99

# 3. In another terminal
./target/debug/claw prompt --provider llama-cpp "hello"
```

### Local: vLLM

```bash
# 1. Install vLLM
pip install vllm

# 2. Run server
python -m vllm.entrypoints.openai.api_server --model mistral-7b

# 3. In another terminal
./target/debug/claw prompt --provider vllm --model mistral "hello"
```

---

## Troubleshooting

### "command not found: claw"

```bash
# Binary is in rust/target/debug/claw, but not on PATH
# Solution 1: Use full path
./rust/target/debug/claw prompt "hello"

# Solution 2: Add to PATH (see Optional: Add to PATH section above)
```

### "permission denied"

```bash
# macOS/Linux: Make binary executable
chmod +x rust/target/debug/claw

# Then try again
./rust/target/debug/claw doctor
```

### "API key not configured"

```bash
# Verify API key is set
echo $ANTHROPIC_API_KEY  # Should show: sk-ant-...

# If empty, set it
export ANTHROPIC_API_KEY="sk-ant-..."

# Windows PowerShell
$env:ANTHROPIC_API_KEY  # Should show: sk-ant-...
$env:ANTHROPIC_API_KEY = "sk-ant-..."
```

### "Build is slow"

```bash
# You're in debug mode (default)
# Compile is slow but runtime is fast

# Option 1: Just wait (first build ~2-3 min, incremental ~10-30s)
# Option 2: Build release (slower compile, fast runtime)
cargo build --workspace --release
# Then use ./target/release/claw
```

### "cargo: command not found"

```bash
# Rust is not installed or not on PATH
# Reinstall from https://rustup.rs/
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Close and reopen terminal
cargo --version  # Should work now
```

---

## Integration with Claude Ecosystem

### Use Case 1: Local Development (Replace Web UI)

```bash
# Instead of claude.ai/code (web):
./target/debug/claw

# Full terminal-native Claude experience
# All features: file context, sessions, multi-provider
```

### Use Case 2: CI/CD Integration

```bash
# In GitHub Actions, GitLab CI, etc.
- name: Code Review with Claw
  env:
    ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
  run: |
    ./target/debug/claw prompt "Review this PR: @./" > review.md
    echo "## Review" >> $GITHUB_STEP_SUMMARY
    cat review.md >> $GITHUB_STEP_SUMMARY
```

### Use Case 3: Local + API Hybrid

```bash
# Development: Use local Ollama (free, instant)
./target/debug/claw --provider ollama --model llama2 prompt "quick analysis: @src/"

# Production quality: Use Claude
./target/debug/claw --provider anthropic prompt "final review: @src/"
```

### Use Case 4: Cost-Optimized Multi-Provider

```bash
# Simple tasks → Local Nemotron-3 (free)
./target/debug/claw --provider ollama --model nemotron prompt "Format this code"

# Complex tasks → Claude
./target/debug/claw --provider anthropic prompt "Architecture design"

# Speed-critical → OpenAI
./target/debug/claw --provider openai prompt "Quick response needed"
```

---

## Documentation Links

| Resource | Purpose |
|---|---|
| `USAGE.md` | Quick commands, auth, sessions, config |
| `docs/navigation-file-context.md` | Terminal navigation, @path syntax, attachments |
| `docs/local-openai-compatible-providers.md` | Ollama/llama.cpp/vLLM setup |
| `docs/windows-install-release.md` | Windows-specific, release artifacts |
| `rust/README.md` | Crate map, CLI surface, features |
| `PARITY.md` | Feature parity with Claude Code (web) |
| `PHILOSOPHY.md` | Why the project exists |

---

## Performance Characteristics

### Build Time

| Mode | Time | Binary Size |
|---|---|---|
| Debug (default) | 2-3 min | ~100MB |
| Incremental rebuild | 10-30s | — |
| Release (optimized) | 5-10 min | ~25MB |

### Runtime Performance

| Operation | Latency |
|---|---|
| Prompt (local Ollama) | 100-500ms |
| Prompt (Claude API) | 1-3s |
| Session load | <100ms |
| File context inclusion | <50ms |

---

## Licensing & Affiliation

- **License:** MIT (open source, commercial-friendly)
- **Affiliation:** Community-maintained, not affiliated with Anthropic
- **Source:** https://github.com/ultraworkers/claw-code
- **Disclaimer:** This is an independent implementation, not the official Claude Code

---

## Why Claw Code for the Ecosystem

- **Terminal-native:** CLI-first, no browser required
- **Multi-provider:** Escape vendor lock-in, switch providers instantly
- **Open source:** MIT licensed, audit and modify the code
- **Portable:** Deploy on any OS with Rust
- **Sessions:** Persistent conversation state for complex workflows
- **File context:** @path syntax for including code, docs, logs
- **Cost-efficient:** Pair with local Ollama/llama.cpp for free inference
- **No subscription:** Only API key required (not Claude subscription)

---

## Getting Started

1. **Install Rust:** https://rustup.rs/
2. **Clone:** `git clone https://github.com/ultraworkers/claw-code`
3. **Build:** `cd claw-code/rust && cargo build --workspace`
4. **Set API key:** `export ANTHROPIC_API_KEY="sk-ant-..."`
5. **Verify:** `./target/debug/claw doctor`
6. **Run:** `./target/debug/claw prompt "hello"`

---

**Claw Code:** Terminal-first, multi-provider, open-source Claude CLI. Build from source, deploy anywhere.

