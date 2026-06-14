---
name: impeccable
version: 1.0.0
description: |
  Design guidance for AI coding agents. Full design workflow with 23 commands,
  live browser iteration, and 41 deterministic anti-pattern detector rules for
  AI-generated frontend design. Eliminate generic AI templates; build distinct,
  production-grade interfaces.
compatibility: claude-code cursor opencode gemini codex pi rovo trae qoder
license: Apache 2.0
---

# Impeccable — AI-Driven Frontend Design Skill

Design guidance that eliminates the generic tells of AI-generated interfaces. Every model is trained on the same SaaS templates. Impeccable fixes that with one setup, 23 specialized commands, and 41 deterministic anti-pattern rules.

## Why Impeccable?

### The Problem with Generic AI Design

Every LLM trained on the same corpus produces the same design tells:

- Inter font for everything
- Purple-to-blue gradients
- Nested card layouts
- Gray text on colored backgrounds
- Rounded-square icon tiles above headings
- Bounce/elastic easing

### The Solution

**Impeccable** adds:

1. **One setup flow** — `/impeccable init` writes `PRODUCT.md` and `DESIGN.md` so later commands know your audience, brand, voice, anti-references, colors, type, and components.
2. **23 specialized commands** — Shared design vocabulary: `polish`, `audit`, `critique`, `distill`, `animate`, `bolder`, `quieter`, and more.
3. **41 deterministic detector rules** — No LLM calls, no API key needed. CLI and browser extension catch AI slop instantly.
4. **Live browser iteration** — `/impeccable live` lets you iterate on design variants directly in the browser.

---

## Setup (One-Time)

### Installation

**Option 1: CLI (Recommended)**

```bash
# From your project root
npx impeccable skills install
```

Auto-detects your harness (Claude Code, Cursor, Codex, etc.) and installs to the right location. Reload your tool afterward.

To refresh an existing install:

```bash
npx impeccable skills update
```

**Option 2: Git Submodule (Teams)**

```bash
git submodule add https://github.com/pbakaus/impeccable .impeccable
npx impeccable skills link --source=.impeccable --providers=claude,cursor
git add .gitmodules .impeccable .claude .cursor
git commit -m "Add Impeccable skills"
```

**Option 3: Manual Copy**

```bash
# Claude Code (project-specific)
cp -r dist/claude-code/.claude your-project/

# Cursor (project-specific)
cp -r dist/cursor/.cursor your-project/

# OpenCode, Pi, Gemini CLI, Codex, etc. — see skill docs
```

### First Run: /impeccable init

After installation, run:

```bash
/impeccable init
```

This single command:

1. Asks whether the project is **brand** (marketing, landing, portfolio) or **product** (app UI, dashboard, tool)
2. Gathers product context:
   - Product name, one-liner, tagline
   - Primary audience (persona)
   - Brand/product lane (premium, playful, corporate, etc.)
   - Voice (tone, vocabulary, personality)
   - Anti-references (what NOT to build like)
   - Colors (primary, accent, semantic)
   - Typography (font families, weights, hierarchy)
   - Reusable component list
3. Writes two files:
   - `PRODUCT.md` — Product context (shared across all commands)
   - `DESIGN.md` — Design system (colors, type, components, spacing)
4. Recommends next steps based on project type

---

## 23 Commands

All commands run through `/impeccable <command> <target>`:

| Command | What it does |
|---|---|
| `init` | One-time setup: gather context, write PRODUCT.md + DESIGN.md, configure live mode |
| `craft` | Full shape-then-build flow with visual iteration (best for new projects) |
| `shape` | Plan UX/UI before writing code (shape first, build second) |
| `document` | Generate root DESIGN.md from existing project code |
| `extract` | Pull reusable components and tokens into design system |
| `critique` | UX design review: hierarchy, clarity, emotional resonance |
| `audit` | Technical quality checks: a11y, performance, responsive |
| `polish` | Final pass, design system alignment, shipping readiness |
| `harden` | Error handling, i18n, text overflow, edge cases |
| `onboard` | First-run flows, empty states, activation paths |
| `bolder` | Amplify boring, underdone designs |
| `quieter` | Tone down overly bold designs |
| `distill` | Strip to essence, remove unnecessary complexity |
| `animate` | Add purposeful motion (not decoration) |
| `colorize` | Introduce strategic color |
| `typeset` | Fix font choices, hierarchy, sizing |
| `layout` | Fix layout, spacing, visual rhythm |
| `delight` | Add moments of joy and personality |
| `overdrive` | Add technically extraordinary effects (3D, WebGL, etc.) |
| `clarify` | Improve unclear UX copy |
| `adapt` | Adapt designs for different devices |
| `optimize` | Performance improvements |
| `live` | Visual variant mode: iterate on elements in browser |

### Command Usage

**Basic:**

```bash
/impeccable audit                    # Audit entire project
/impeccable audit the header         # Focus on header
/impeccable polish                   # Final pass
```

**Full description:**

```bash
/impeccable redo this hero section   # Describe target + desired change
```

**Shortcut:**

```bash
/impeccable pin audit                # Creates standalone /audit shortcut
/audit                               # Use shortcut directly
```

---

## Design Anti-Patterns (41 Detector Rules)

The Impeccable detector catches these issues with **zero LLM calls**:

### AI Slop Tell-Tales

- Side-tab borders and placeholder cards
- Purple-to-blue/teal gradients
- Overuse of glow/shadow effects (dark, colored glows on dark backgrounds)
- Bounce/elastic easing (feels dated, overused by generative AI)
- Nested card layouts (cards inside cards inside cards)
- Icon tiles above every heading (copied from SaaS templates)
- System font stack (Arial, Inter, helvetica) without tinting
- Gray text on colored backgrounds (accessibility violation)

### Design Quality Issues

- Line length >80 chars (readability)
- Cramped padding (<8px on edges)
- Small touch targets (<44px on mobile)
- Skipped heading hierarchy (missing h2, h3, etc.)
- Inconsistent spacing rhythm
- Missing alt text on images
- Unreadable contrast ratios
- Unconstrained text widths (>70 chars)
- Missing focus states (keyboard nav)
- Unused custom fonts (performance)

### CSS & Structure

- Hardcoded colors (no design tokens)
- No component boundaries
- Missing viewport meta tag
- Unoptimized image sizes
- Unused CSS classes
- Z-index chaos (no layering strategy)

---

## Workflows

### New Project: /impeccable craft

```bash
/impeccable init               # Setup context + DESIGN.md
/impeccable craft              # Full shape-then-build flow
```

Runs full cycle:
1. Shape (UX/IA)
2. Build (component code)
3. Iterate (live mode)
4. Polish (final pass)

### Existing Project: /impeccable document

```bash
/impeccable document           # Extract DESIGN.md from existing code
/impeccable audit              # Find issues
/impeccable extract            # Pull components into system
```

### Landing Page

```bash
/impeccable init               # Setup
/impeccable shape landing      # UX first
/impeccable critique landing   # Design review
/impeccable polish landing     # Final pass
```

### Dashboard or App UI

```bash
/impeccable init               # Setup
/impeccable shape the dashboard
/impeccable craft              # Build with iteration
/impeccable harden            # Error handling, edge cases
/impeccable audit              # Tech QA
```

### Design System Extraction

```bash
/impeccable extract            # Pull components + tokens
/impeccable document           # Write DESIGN.md
```

### Fixing a Specific Component

```bash
/impeccable bolder the hero    # Amplify impact
/impeccable quieter the footer # Tone down
/impeccable adapt the menu     # Mobile-friendly
```

### Live Iteration

```bash
/impeccable live               # Browser mode: tweak elements, see instant feedback
```

---

## PRODUCT.md and DESIGN.md

### PRODUCT.md (Project Context)

Created by `/impeccable init`:

```markdown
# Product Context

**Product:** [Name]  
**One-liner:** [What it does]  
**Tagline:** [Marketing hook]

## Audience

**Primary:** [Persona]  
**Secondary:** [Optional]  

## Brand Lane

[Premium, playful, corporate, minimalist, bold, etc.]

## Voice

[Tone, vocabulary, personality]

## Anti-References

[What NOT to build like]

## Visual Direction

[2-3 sentences describing look/feel]
```

### DESIGN.md (Design System)

Created by `/impeccable init`:

```markdown
# Design System

## Colors

**Primary:** [Hex, intent]  
**Accent:** [Hex, intent]  
**Semantic:** [Success, warning, error]  
**Neutral:** [Background, text colors]

## Typography

**Heading font:** [Family, weights]  
**Body font:** [Family, weights]  
**Code font:** [Monospace]

### Hierarchy

- h1: [Size, weight, line-height]
- h2: [Size, weight, line-height]
- Body: [Size, weight, line-height]
- Small: [Size, weight, line-height]

## Components

- Button (primary, secondary, tertiary)
- Card (default, hover, active)
- Input (text, number, select)
- Navigation
- [Custom components]

## Spacing

**Grid:** 4px or 8px base  
**Padding:** [List standard sizes]  
**Gaps:** [List standard sizes]

## Other

**Border radius:** [Values]  
**Shadows:** [Elevation system]  
**Transitions:** [Duration, easing]
```

---

## CLI: Standalone Detection

Catch 41 anti-patterns without your AI harness:

```bash
# Scan a directory
npx impeccable detect src/

# Scan an HTML file
npx impeccable detect index.html

# Scan a URL (uses Puppeteer)
npx impeccable detect https://example.com

# Fast mode (regex only, JSON output)
npx impeccable detect --fast --json .
```

Output: Categorized list of issues with severity, location, and fix hint.

---

## Design Hook (Automatic Quality Gates)

On **Claude Code**, **Cursor**, and **Codex**, the installer sets up a design hook that:

1. Runs Impeccable detector on every UI file edit (deterministic rules only)
2. Surfaces findings back into the agent flow
3. **Claude Code & Codex:** Surfaces findings after edit for context
4. **Cursor:** Blocks bad proposed writes before they land

Hook files:
- **Claude Code:** `.claude/settings.local.json` → `.claude/skills/impeccable/scripts/hook.mjs`
- **Cursor:** `.cursor/hooks.json` → `.cursor/skills/impeccable/scripts/hook-before-edit.mjs`
- **Codex:** `.codex/hooks.json` → `.agents/skills/impeccable/scripts/hook.mjs`

Manage hook settings with `/impeccable hooks` (enable/ignore specific rules).

For debugging, set `hook.auditLog` in `.impeccable/config.json` to a file path to log hook invocations.

---

## Platform Support

| Tool | Status | Notes |
|---|---|---|
| Claude Code | ✅ | Install via CLI; project or global |
| Cursor | ✅ | Install via CLI; requires Nightly + Agent Skills enabled |
| OpenCode | ✅ | Install via CLI |
| Pi | ✅ | Install via CLI |
| Gemini CLI | ✅ | Install via CLI; requires preview version + skills enabled |
| Codex CLI | ✅ | Install via CLI; project or global; requires hook approval |
| VS Code Copilot | ✅ | Manual copy to `.github/skills/` |
| GitHub Copilot | ✅ | Manual copy to `.github/skills/` |
| Trae | ✅ | Trae China (`.trae-cn/`) and International (`.trae/`) |
| Rovo Dev | ✅ | Install via CLI; project or global |
| Qoder | ✅ | Install via CLI; project or global |
| Kiro | ✅ | Community |

---

## Integration with Claude Ecosystem

### With Everything Claude Code

- **Use with frontend-design skill** — Complementary: `frontend-design` for production architecture; `impeccable` for anti-pattern detection + design ops
- **Use with `/dream` command** — Auto-routes to Impeccable for UI asset generation
- **Use with site-build pipeline** — `/site-design` stage can call `/impeccable craft` for component iteration

### With Pigsty (Database)

- Store design system versions in PostgreSQL
- Log audit/detect runs for compliance + team review
- Version control PRODUCT.md + DESIGN.md changes

### With LunaRoute (Monitoring)

- Monitor design tool API calls, latency
- Track anti-pattern detection frequency per project

### With Observability

- Metrics: audit run time, issues found/fixed, hook performance
- Grafana dashboard: design quality trends

---

## Examples

### Redo a Hero Section

```bash
/impeccable redo this hero section
```

Impeccable will:
1. Audit the current hero
2. Suggest 3 distinct alternatives (based on brand lane + voice)
3. Show live variants
4. Iterate based on feedback

### Audit Before Launch

```bash
/impeccable audit
```

Reports:
- 41 deterministic issues found + fixable items
- Accessibility gaps (WCAG violations)
- Performance bottlenecks (large images, unused CSS)
- Mobile responsiveness issues

### Extract Design System from Spaghetti Code

```bash
/impeccable extract
```

Generates:
- Component catalog (all unique buttons, cards, etc.)
- Token list (colors, type, spacing)
- Usage stats (which components appear most)
- Suggestions for consolidation

---

## Tips & Tricks

### Consistent Voice Across Sessions

Store PRODUCT.md + DESIGN.md in git. Every command reads them, so your design voice persists.

```bash
git add PRODUCT.md DESIGN.md
git commit -m "Design system baseline"
```

### Fast Lint Without AI

```bash
npx impeccable detect --fast .    # Regex-only, instant
```

No API key, no latency, run in CI/CD.

### Custom Anti-Patterns

Edit `.impeccable/config.json` to disable rules or add team-specific standards:

```json
{
  "detector": {
    "rules": {
      "gray-on-color": { "enabled": false },
      "custom-rule": { "enabled": true }
    }
  }
}
```

### Team Sync

Commit `.impeccable/config.json` (shared rules) + `.impeccable/config.local.json` (machine-local settings like hook preferences).

---

## Community & Ecosystem

- **GitHub Discussions:** File bugs, request features, help newcomers
- **npm:** `impeccable` package on npm
- **Twitter:** @pbakaus for releases, samples, highlights
- **Contributing:** See `DEVELOP.md` in the repo

---

## License

Apache 2.0 — See LICENSE in the Impeccable repository.

**Created by Paul Bakaus**

---

## Key References

- Website: https://impeccable.style (before/after case studies)
- GitHub: https://github.com/pbakaus/impeccable
- npm: https://www.npmjs.com/package/impeccable
- Detector rules: 41 deterministic checks for AI slop + design quality
- Supported tools: 12+ AI coding agents/harnesses
