# Framelink MCP for Figma: Design-to-Code Bridge

MCP server that bridges Figma design files and AI code editors (Cursor, Claude Code, etc.) for direct design-to-code implementation. Fetches design metadata (layout, styling, typography, spacing) and translates it into concise context for accurate code generation.

GitHub: `framelink-figma-mcp` · NPM: `figma-developer-mcp` · Requires: Figma API token

## Why It's Relevant Here

Two angles:

1. **Design → Code for RHYTHMIX visual components** — RHYTHMIX design system (palette, typography, motion in `rhythmix-teaser-60s/DESIGN.md`) lives in Figma. Framelink lets you paste a Figma frame link in Cursor and say "implement this design" — the MCP fetches layout + styling, and Cursor generates code that matches exactly.

2. **Figma MCP ecosystem** — Complements the existing Figma MCP server (designer-focused: get_design_context, get_screenshot, generate_design). Framelink is developer-focused: lightweight metadata → fast code generation. Both serve different parts of the design-to-code workflow.

## How It Works

### User Flow

1. **Open Figma**, select a frame or component
2. **Copy link** (e.g., `https://www.figma.com/file/ABC123/MyProject?node-id=456`)
3. **Open Cursor** (or Claude Code with Figma MCP)
4. **Paste link** in chat, ask: "Implement this design in React"
5. **Framelink MCP fetches metadata** (layout, colors, typography, spacing)
6. **Cursor generates code** with design fidelity

### What Framelink Extracts

**Design metadata** (simplified for model):
- Layout: frame size, child positioning, flex/grid constraints
- Colors: fill colors, strokes, opacity
- Typography: font family, size, weight, line height
- Spacing: padding, margin, gaps
- Visual properties: corner radius, shadows, rotation

**What's filtered out**:
- Raw Figma JSON (too verbose)
- Irrelevant properties (e.g., internal IDs, version history)
- Prototype/interaction data (handled separately)

**Output**: Concise JSON/markdown that models can translate directly to code.

## Setup

### Prerequisites

1. **Figma API token** — Create at https://www.figma.com/developers/api
   - Log in to Figma
   - Go to Settings > Integrations > Create new token
   - Copy token (save securely — don't commit to repo)

2. **Cursor or compatible editor** — Cursor is the primary IDE for this MCP; Claude Code supports it via `.mcp.json`

### Installation

#### Cursor

Add to Cursor's MCP config (`~/.cursor/mcp_servers.json` or settings):

```json
{
  "mcpServers": {
    "Framelink MCP for Figma": {
      "command": "npx",
      "args": ["-y", "figma-developer-mcp", "--figma-api-key=YOUR-KEY", "--stdio"]
    }
  }
}
```

Replace `YOUR-KEY` with your Figma API token.

#### Claude Code / Other Editors

Add to `.mcp.json`:

```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "figma-developer-mcp", "--figma-api-key=${FIGMA_API_KEY}", "--stdio"]
    }
  }
}
```

Set `FIGMA_API_KEY` in `.env`:
```bash
FIGMA_API_KEY=your_token_here
```

#### Environment Variables (Alternative)

```json
{
  "mcpServers": {
    "Framelink MCP for Figma": {
      "command": "npx",
      "args": ["-y", "figma-developer-mcp", "--stdio"],
      "env": {
        "FIGMA_API_KEY": "your_token_here",
        "PORT": "3000"
      }
    }
  }
}
```

### Verification

Test the MCP connection:

```bash
# In Cursor or Claude Code, paste a Figma link:
https://www.figma.com/file/ABC123/MyProject?node-id=456

# Ask:
"Implement this button in React"

# Framelink should fetch metadata and Cursor should generate code
```

## Usage Patterns

### Pattern 1: Component Implementation

```
User: "Implement this design as a React component"
Figma link: https://www.figma.com/file/ABC/project?node-id=123

Framelink extracts:
- Button size: 12px padding, 16px font
- Color: #d97757 (brand red)
- Corner radius: 6px
- Hover state: opacity 0.9

Cursor generates:
import React from 'react';

export function Button({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '12px 16px',
        fontSize: '16px',
        backgroundColor: '#d97757',
        borderRadius: '6px',
        border: 'none',
        cursor: 'pointer',
        transition: 'opacity 0.2s',
      }}
      onMouseEnter={(e) => e.target.style.opacity = '0.9'}
      onMouseLeave={(e) => e.target.style.opacity = '1'}
    >
      {children}
    </button>
  );
}
```

### Pattern 2: Design System Sync

Link to the Figma design system file. Extract color palette, typography scale, spacing scale:

```
User: "Extract the color palette from this design system"
Figma link: https://www.figma.com/file/XYZ/design-system?node-id=colors

Framelink extracts all named colors with hex values
Cursor generates:

export const colors = {
  primary: '#d97757',
  secondary: '#6a9bcc',
  neutral: '#788c5d',
  light: '#b0aea5',
};

export const typography = {
  heading1: { fontSize: '32px', fontWeight: 700 },
  heading2: { fontSize: '24px', fontWeight: 600 },
  body: { fontSize: '16px', fontWeight: 400 },
};
```

### Pattern 3: Multi-Frame Layout

Link to a prototype or dashboard with multiple frames:

```
User: "Generate the landing page layout from this Figma file"
Figma link: https://www.figma.com/file/ABC/landing-page

Framelink extracts:
- Hero frame (1920x600, gradient background, centered text)
- Features section (3-column grid, card components)
- CTA frame (button + testimonial, bottom padding)

Cursor generates full responsive page with sections
```

## Performance & Accuracy

**Framelink optimizations**:
- **Filtered context** — Only relevant design properties, no verbose JSON
- **Direct translation** — Model receives simplified metadata, faster code generation
- **Accuracy** — Design metrics (colors, spacing, fonts) are precise, not estimated

**Limitations**:
- **Interactive prototypes** — Framelink extracts static layout; interactions are not translated (Figma prototypes handled separately)
- **Advanced constraints** — Figma's layout constraints may not map 1:1 to CSS (e.g., "scale with frame" vs. responsive breakpoints — may require manual adjustment)
- **Overrides** — Component variants and overrides are flattened to their final rendered state

## Fit & Caveats

- **Cursor-first** — Designed for Cursor IDE; other editors may have limited MCP support
- **API rate limits** — Figma API has rate limits (~5 req/sec). Heavy batch operations may throttle.
- **Token security** — Keep `FIGMA_API_KEY` in `.env` (gitignored), never commit to repo
- **File access** — MCP can only read files the token has access to. Share Figma links with team before asking model to implement.
- **Design drift** — If Figma design changes after code is generated, manual sync is needed

## Ecosystem Integration Patterns

### Pattern 1: RHYTHMIX Component Library

Wire Framelink to the RHYTHMIX design system:

```
Figma file: rhythmix-teaser-60s/DESIGN.md + Figma link

1. Extract RHYTHMIX color palette, typography, motion easing
2. Generate component library (buttons, cards, text blocks)
3. HyperFrames compositions reference the components
4. All updates to Figma sync to code automatically
```

### Pattern 2: Design-to-HyperFrames Pipeline

Generate HyperFrames compositions from Figma frames:

```
1. Designer creates frame in Figma (e.g., "intro-sequence")
2. Paste link in Cursor: "Generate HyperFrames code for this"
3. Framelink extracts layout + styling
4. Cursor generates HTML/CSS/GSAP composition
5. Compositor saves as `rhythmix-intro-sequence/index.html`
6. Render with HyperFrames
```

### Pattern 3: Figma ↔ Studio Code Sync

Keep design system and codebase in sync:

```
Workflow:
1. Designer updates Figma design tokens
2. Engineer runs: "Sync design tokens from Figma"
3. Framelink fetches updated palette, spacing, typography
4. Cursor generates updated `design-tokens.ts`
5. CI/CD tests component library against new tokens
```

## Related Tools in Ecosystem

| Tool | Relationship |
|---|---|
| **Figma MCP** (existing) | Designer-focused: full design context, generate designs, Code Connect. Framelink is lightweight developer-focused extract. |
| **HyperFrames** | Compose HTML/CSS/GSAP videos. Framelink provides design → code input for compositions. |
| **rhythmix-teaser-60s/DESIGN.md** | Design system reference. Framelink can extract and sync this into code. |
| **Cursor IDE** | Primary consumer of this MCP. Tighter integration than Claude Code. |

## References

- **Framelink site**: https://www.framelink.io/
- **Figma API docs**: https://www.figma.com/developers/api
- **Cursor**: https://www.cursor.sh/
- **GitHub**: `framelink/figma-developer-mcp`
- **NPM**: `figma-developer-mcp`

---

**Use Case for Ecosystem:** Design-to-code MCP for Figma files → React/HTML/CSS generation. Lightweight metadata extraction (layout, colors, typography, spacing) enables accurate code generation in Cursor and Claude Code. Primarily for RHYTHMIX design system components, HyperFrames compositions, and rapid component prototyping. Complements the heavier Figma MCP (designer-focused) with a developer-focused lightweight extraction path.
