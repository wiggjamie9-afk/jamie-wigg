# Super Dev - AI Coding Coach System

Version: 2.4.0

## Overview

Super Dev is a workflow orchestration system that trains AI coding hosts (Claude Code, Cursor, Windsurf, etc.) into stable, auditable development teams. It's not a tool that adds commands — it's a coaching system that ensures every project follows professional standards.

**Core Philosophy:**
- **Host is the executor** (writes code, runs tests, modifies files)
- **Super Dev is the coach** (product manager, architect, designer, QA, compliance)

## Key Features

### 1. **11-Expert Agent Architecture**
Each stage of development gets specialized guidance:
- PRODUCT: Product owner perspective
- PM: Product manager oversight
- ARCHITECT: System design validation
- UI/UX: Design system enforcement
- SECURITY: Security review & hardening
- CODE: Development standards
- DBA: Database design
- QA: Quality assurance
- DEVOPS: Infrastructure & deployment
- RCA: Root cause analysis
- OVERSEER: Workflow orchestration

Each expert has 350+ lines of playbook + 600+ lines of AI prompt injection.

### 2. **UI Smart Design System**
- **119 color schemes** (84 product + 35 aesthetic)
- **39 component libraries** (React 15, Vue 9, Angular 4, Svelte 2, etc.)
- **17 font presets** (Google Fonts China mirror)
- **Design tokens** (color, shadow, motion, typography, spacing)
- **12-item delivery checklist** (A11y, responsive, dark mode, loading states, etc.)
- **10 industry templates** (education, medical, e-commerce, fintech, SaaS, social, content, enterprise, tools, gaming)

### 3. **Pipeline Orchestration (9 Stages)**
```
New Project:
research → docs → docs_confirm → spec → frontend → preview_confirm → backend → quality → delivery

Existing Project:
baseline → baseline_confirm → delta_research → docs → docs_confirm → spec → frontend → preview_confirm → backend → quality → delivery
```

Features:
- Checkpoints for pausing/resuming
- Confirmation gates (no auto-proceeding)
- Timeout protection
- UI revision loops
- Error recovery

### 4. **Knowledge Base (270+ files, 150K+ lines)**
23 technical domains:
- Architecture (microservices, API, distributed systems, etc.)
- Security (DevSecOps, container security, compliance, etc.)
- Operations (observability, AIOps, capacity planning, chaos)
- Cloud native (k8s, service mesh, serverless)
- Data engineering (pipelines, streaming, governance)
- Design systems & UI
- Mobile development
- CI/CD, testing, product, low-code, edge/IoT, blockchain, quantum

Knowledge is staged-mapped and auto-injected at research/docs/spec/implementation phases.

### 5. **Quality Gates & Validation**
- 25 YAML validation rules (14 default + 11 red team)
- Spec-Code consistency checking
- A11y compliance verification
- Performance budget validation
- Red team security review
- UI contract enforcement
- Release readiness panel

### 6. **Unified Host Onboarding**
Supports **26 hosts** across 3 categories:

**CLI Hosts (12):**
Claude Code, Codex CLI, OpenCode, Droid CLI, Gemini CLI, Kiro CLI, Cursor CLI, Copilot CLI, Qoder CLI, CodeBuddy CLI, Kimi Code, Qwen Code

**IDE Hosts (9):**
Antigravity, Cursor, Windsurf, Kiro, Trae IDE, TraeCN, CodeBuddy, CodeBuddyCN, Qoder

**Desktop (5):**
Claude, Codex, WorkBuddy, Trae SOLO, Trae SOLOCN

Each gets automatic project-level injection + optional user/global configuration.

## Installation

### Quick Install
```bash
# Install via uv (recommended)
uv tool install super-dev

# Run setup wizard
super-dev

# Select your coding host(s)
# Install completes with project-level integration
```

### After Installation
```bash
# In your project, use Super Dev:
/super-dev your requirement        # Slash host (Claude Code, Cursor, etc.)
super-dev: your requirement        # Natural language host (Cursor CLI, Copilot, etc.)
/super-dev-seeai requirement       # Competition mode (30-min sprint)

# Key commands (terminal only)
super-dev                          # Setup wizard
super-dev update                   # Upgrade to latest
super-dev uninstall                # Remove integration
super-dev doctor                   # Diagnose issues
```

## Workflow Basics

### 1. Start a Task
Input in your host: `/super-dev build user signup flow`

### 2. Research Phase
Super Dev triggers web research + competitive analysis. Host completes this, then reports findings.

### 3. Three Documents
Host generates:
- **PRD** (user personas, feature matrix, acceptance criteria, business rules)
- **Architecture** (system diagram, data models, API contracts, security, deployment)
- **UI/UX** (design tokens, page skeletons, component list, interaction states, responsive)

### 4. User Confirmation
You review → approve → proceed, or request revisions.

### 5. Spec + Tasks
Auto-generated task list from documents. Host can now code with full context.

### 6. Frontend First
Render UI → preview → confirm → then backend/testing.

### 7. Quality Gate
Automated checks: A11y, performance, security, spec alignment, design contract.

### 8. Delivery
Release readiness panel, proof-pack, audit trail.

## Host-Specific Quick Starts

### Claude Code
```bash
super-dev                    # Install
/super-dev your requirement  # Trigger
```

### Cursor (IDE)
```bash
super-dev                          # Install, then restart Cursor
/super-dev your requirement        # In Agent Chat
```

### Cursor CLI
```bash
super-dev                    # Install
super-dev: your requirement  # Trigger in terminal
```

### Windsurf
```bash
super-dev                    # Install
/super-dev your requirement  # In Workflow panel
```

For other hosts, see full host matrix in main docs.

## Competition Mode (SEEAI)

For 30-minute hackathons/competitions:
```bash
/super-dev-seeai your requirement    # Slash host
super-dev-seeai: your requirement    # CLI host
```

Compressed workflow:
- Research (5 min)
- Docs (5 min)  
- Spec (5 min)
- Frontend + Backend combined (15 min)

No preview confirmation gate — speeds up delivery.

## Key Concepts

### Baseline
Existing project baseline state. Run `baseline → baseline_confirm` before adding features.

### Delta Development
After baseline confirmation, request new features with `evolve` or `variant`.

### Session Recovery
Interrupt anytime. `.super-dev/SESSION_BRIEF.md` + `workflow-state.json` track progress. Resume with "continue current flow".

### UI Contract
Design system is frozen into `ui-contract.json` + `design-tokens.css`. Quality gates verify implementation matches contract.

### Proof-Pack
Evidence bundle: all commits, tests, screenshots, performance metrics, audit trail. Proves work is complete & ship-ready.

## What Super Dev Does NOT Do

- ❌ Write code for you (host does that)
- ❌ Replace design/product thinking (it amplifies it)
- ❌ Handle system dependencies (you install Node, Python, DB, etc.)
- ❌ Work offline (needs web research capability)
- ❌ Skip quality gates (they're non-negotiable)

## Configuration

After installation, Super Dev creates:
- `.super-dev/WORKFLOW.md` — your project's workflow rules
- `.super-dev/workflow-state.json` — current stage & recovery state
- `output/` — all artifacts (PRDs, specs, delivery bundles)
- Host-specific files (AGENTS.md, .claude/settings, rules/, etc.)

## Integration with Your YouTube Shorts Pipeline

Super Dev could help organize your shorts production:
1. **Research phase:** Trend analysis, niche validation
2. **Spec phase:** Content calendar, thumbnail templates, script guidelines
3. **Design phase:** Locked design system across all thumbnails
4. **QA phase:** Automated checks before upload (compliance, brand consistency)
5. **Delivery:** Proof-pack with metrics, analytics, upload confirmation

---

## Resources

- **Official Docs:** https://superdev.goder.ai/
- **GitHub:** https://github.com/shangyankeji/super-dev
- **Citation:** Version 2.4.0 (Feb 2025)

---

**Useful for:** Enforcing development standards, design consistency, multi-team coordination, quality assurance, audit trails.

**Not needed for:** Quick one-off scripts, personal projects without QA requirements.
