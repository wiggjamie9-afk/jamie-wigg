# Anthropic Agent Skills: Standard & Repository

Anthropic's open standard and reference implementation for skills — dynamic instruction sets that teach Claude specialized tasks. The `anthropics/skills` repository demonstrates patterns across creative, technical, enterprise, and document domains. Foundation for Claude's production-grade document editing (DOCX, PDF, PPTX, XLSX) and extensible for custom workflows.

GitHub: `anthropics/skills` · Standard: `agentskills.io` · License: Apache 2.0 (examples), source-available (document skills)

## What Are Agent Skills?

**Skills are folders of instructions + scripts + resources that Claude loads dynamically.**

A skill teaches Claude:
- **How** to complete a task (step-by-step instructions)
- **When** to use it (metadata + description)
- **What** it can access (context, examples, guidelines)

### Skill Structure

Minimal:
```
my-skill/
├── SKILL.md          # YAML frontmatter + markdown instructions
└── (optional: scripts, assets, data files)
```

**SKILL.md format**:
```yaml
---
name: my-skill-name
description: What this skill does and when to use it
---

# My Skill Name

[Instructions Claude follows when this skill is active]

## Examples
- Example usage 1
- Example usage 2

## Guidelines
- Guideline 1
- Guideline 2
```

Frontmatter fields (required):
- `name` — unique identifier (lowercase, hyphens for spaces)
- `description` — complete description of what it does + when to use it

Markdown content:
- Instructions (how to use the skill)
- Examples (concrete demonstrations)
- Guidelines (constraints, best practices)

### Skill Types

| Type | Example | Use Case |
|---|---|---|
| **Instruction/Workflow** | "Create brand-consistent documents" | Teach Claude a process |
| **Tool Integration** | "Analyze data with your org's tools" | Connect to external services |
| **Creative** | "Generate art in your brand style" | Style/aesthetic instruction |
| **Document Editing** | "Edit PDF forms, generate presentations" | Built into Claude's document features |
| **Technical** | "Test web apps via browser automation" | Code generation + execution |
| **Enterprise** | "Write comms in your company voice" | Domain-specific workflows |

## Anthropic's Skills Repository

### Repository Structure

```
anthropics/skills/
├── README.md
├── ./skills/              # Example skills
│   ├── creative/          # Art, design, music
│   ├── development/       # Testing, MCP servers, code generation
│   ├── enterprise/        # Communications, branding, workflows
│   ├── docx/              # Document editing (Word) — source-available
│   ├── pdf/               # Document editing (PDF) — source-available
│   ├── pptx/              # Document editing (PowerPoint) — source-available
│   └── xlsx/              # Document editing (Excel) — source-available
├── ./spec/                # Agent Skills specification
└── ./template/            # Skill template for creating new skills
```

### Available Skills (Sample)

**Creative & Design**:
- Brand-consistent design workflows
- Art generation prompts
- Music composition assistance
- Design system guidance

**Development & Technical**:
- Web app testing (browser automation)
- MCP server generation
- Code analysis and refactoring
- Testing frameworks

**Enterprise & Communication**:
- Company voice writing (emails, comms)
- Branding guidelines enforcement
- Workflow automation
- Document generation

**Document Skills** (production, source-available):
- `docx` — Create, edit, format Word documents
- `pdf` — Extract, annotate, fill PDF forms
- `pptx` — Generate, design presentations
- `xlsx` — Create, analyze, format spreadsheets

## Creating a Basic Skill

### Minimal Example

Create a folder with one file:

```
my-awesome-skill/
└── SKILL.md
```

**SKILL.md**:
```markdown
---
name: my-awesome-skill
description: Teaches Claude to [do specific thing] using [your methodology]
---

# My Awesome Skill

This skill teaches Claude how to [detailed description of what it does].

## Instructions

[Step-by-step how Claude should approach this task]

1. First, understand the context...
2. Then, analyze...
3. Finally, produce...

## Examples

- **Example 1**: Demonstrate the skill in action with concrete input/output
- **Example 2**: Another use case showing different scenario

## Guidelines

- Always consider [constraint 1]
- Prefer [approach A] over [approach B] because [reason]
- Stop if [condition]
- Default to [behavior] unless [exception]
```

### Skill Template

Anthropic provides a template in `./template`:

```bash
cp -r ./template my-custom-skill
# Edit my-custom-skill/SKILL.md with your instructions
```

### Best Practices for Skill Design

| Principle | Explanation |
|---|---|
| **Clear scope** | One skill = one task or closely-related task family. Don't bundle unrelated instructions. |
| **Concrete examples** | Show input → output, not abstract descriptions. |
| **Explicit constraints** | Tell Claude what it should *not* do (avoid hallucinations). |
| **Testable output** | Define what "done" looks like. Can Claude validate its own work? |
| **Reusable instructions** | Skills work across multiple invocations. Make them general, not one-shot. |

## Using Skills in Claude

### Claude Code

Register the Anthropic skills repository:

```bash
/plugin marketplace add anthropics/skills
```

Then select and install:
```
Browse and install plugins
  → anthropic-agent-skills
    → document-skills (Word, PDF, PowerPoint, Excel)
    → example-skills (creative, dev, enterprise)
  → Install now
```

Or install directly:
```bash
/plugin install document-skills@anthropic-agent-skills
/plugin install example-skills@anthropic-agent-skills
```

**Usage**: Just mention the skill. e.g.,
```
"Use the PDF skill to extract form fields from this file"
"Use the brand-writing skill to draft an announcement"
```

### Claude.ai

Paid plans have access to example skills. Upload custom skills via Settings > Skills.

### Claude API

Use pre-built skills or upload custom skills:

```python
import anthropic

client = anthropic.Anthropic()

# Use skills via the API (if skill is registered)
response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": "Use the PDF skill to extract form fields from path/to/file.pdf"
        }
    ],
    # Skills are made available via Claude's system configuration
)
```

See **Skills API Quickstart** for details.

## Relationship to This Ecosystem

### How Skills Fit Here

This repo's `.claude/skills/` directory contains:
- **Symlinks to `.agents/skills/`** — source-of-truth for synced skills (from Anthropic, HuggingFace, etc.)
- **Local-only skills** — not synced, edit directly in `.claude/skills/`

**Examples in this repo**:
- `rhythmix-author` — RHYTHMIX video generation skill
- `hyperframes`, `hyperframes-cli`, `hyperframes-registry` — HyperFrames workflow
- `replicate`, `gsap`, `frontend-design` — creative/technical helpers
- `/spec-quick`, `/site-build`, `/album-launch` — orchestration skills
- `kimi-writer` — autonomous writer agent

### Skill Creation Workflow

1. **Understand the task** — What repeatable workflow does Claude need to learn?
2. **Write instructions** — Step-by-step, with examples + constraints
3. **Create SKILL.md** — Minimal frontmatter + markdown
4. **Test in Claude Code** — Use the skill, iterate on clarity
5. **Share or sync** — Commit to `.agents/skills/`, track hash in `skills-lock.json`

### Integration with CLAUDE.md

`CLAUDE.md` already documents 100+ skills installed in this repo. Each skill:
- Has a slash command (e.g., `/rhythmix-new`)
- Is registered in `.claude/skills/`
- May be synced from upstream or local-only

Agent Skills standardize the metadata format (`SKILL.md` frontmatter) so skills are portable across Claude Code, Claude.ai, API, and other platforms.

## Document Skills (Production-Grade)

Anthropic's document skills power Claude's built-in document capabilities:

| Skill | Capability | File Types |
|---|---|---|
| **docx** | Create, edit, format | `.docx` (Word) |
| **pdf** | Extract, annotate, fill forms | `.pdf` |
| **pptx** | Design, generate presentations | `.pptx` (PowerPoint) |
| **xlsx** | Create, analyze, format | `.xlsx` (Excel) |

These are **source-available** (not open source), provided as reference for building complex production skills.

### Example: PDF Form Extraction

```bash
# Use the PDF skill
claude_code> "Use the PDF skill to extract all form fields from application.pdf"

# Returns:
# - Field names
# - Field values (if filled)
# - Field types (text, checkbox, dropdown, etc.)
# - Coordinates and metadata
```

## Skill Patterns & Examples

### Pattern 1: Workflow Instruction

Teach Claude a repeatable process:

```markdown
---
name: sales-email-template
description: Generate sales emails matching our company voice and brand guidelines
---

# Sales Email Template

Generate professional sales outreach emails that reflect [Company] voice.

## Instructions

1. Start with a warm, specific opening (reference their product/announcement)
2. Identify their business problem
3. Present our solution as the fit
4. Include a soft CTA (call them, calendar link)
5. Sign with [standard signature]

## Guidelines

- Always personalize by researching recent company news
- Avoid hard sells; position as helpful
- Keep to 3-4 short paragraphs
```

### Pattern 2: Tool Integration

Connect Claude to external systems:

```markdown
---
name: crm-analysis
description: Query your org's Salesforce instance and summarize account health
---

# CRM Analysis

[Instructions for Claude to query CRM API, interpret data, flag at-risk accounts]

## Available Tools

- `crm_query(account_id)` — Fetch account data
- `crm_flag(account_id, reason)` — Mark account as at-risk
```

### Pattern 3: Creative Style

Teach Claude a creative aesthetic:

```markdown
---
name: brand-visual-style
description: Generate design briefs adhering to [Brand] visual identity
---

# Brand Visual Style

Color palette: [palette]
Typography: [fonts]
Motion: [easing functions, timing]
Imagery: [style guide]

[Examples of on-brand vs off-brand designs]
```

## Partner Skills

Notion has published **Notion Skills for Claude** — example of a partner extending Claude's capabilities for their product.

## Caveats & Disclaimers

- **Demonstration purposes** — These skills show what's possible; actual Claude behavior may differ
- **Test thoroughly** — Test skills in your own environment before relying on them
- **AI behavior varies** — Claude's interpretation of skill instructions isn't deterministic
- **Source-available, not open-source** — Document skills (DOCX, PDF, PPTX, XLSX) are reference implementations, not licensed for commercial reuse without permission
- **API stability** — Anthropic's skills system may evolve; monitor releases

## References

- **Agent Skills Standard**: https://agentskills.io/
- **GitHub Repository**: https://github.com/anthropics/skills
- **How to Create Custom Skills**: https://docs.anthropic.com/en/docs/build-with-claude/agents/skills
- **Skills API Quickstart**: https://docs.anthropic.com/en/docs/build-with-claude/agents/skills-api
- **Using Skills in Claude**: https://support.anthropic.com/en/articles/skills-in-claude

---

**Use Case for Ecosystem:** Standardized format (SKILL.md) for dynamic instruction sets that teach Claude specialized tasks. Foundation for this repo's 100+ skills (`.claude/skills/`). Reference for creating production-grade skills (document editing, enterprise workflows, creative tasks). Integration across Claude Code (plugins), Claude.ai (paid), Claude API, and other platforms. Source-available document skills (DOCX, PDF, PPTX, XLSX) as reference for complex production implementations.
