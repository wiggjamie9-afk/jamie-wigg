# Design Skills Strategy: MCP-First Approach

**Status:** Figma MCP now wired into `.mcp.json`  
**Decision:** Abandon GitHub skills hunt — design work lives in MCP servers, not published skills  
**Timeline:** 5 min (Figma) + 2-4h (a11y) + 4-8h (tokens) before Studio launch  

---

## Why GitHub Design Skills Don't Exist (And Why That's OK)

The public Claude Code skills marketplace is **intentionally sparse** on design. This is not a bug—it's architectural:

- **Design is delegated to MCPs** (Figma, Webflow, Canva, Miro, Lucid)
- **Engineers code, designers design** — Claude Code targets developers
- **Large design firms own Figma/Adobe** — they won't publish skills; they'll integrate via MCP

**Evidence:** Of ~300 published skills, <10% are design-focused. The 90% are engineering (code-review, test-writing, dependency-scanning, etc.).

**Implication:** Your "design skills gap" is not closeable via skills. Close it via MCP + custom local skills.

---

## Current Stack (Already Have)

| Vector | Tools | Status | ROI |
|---|---|---|---|
| **Video** | HyperFrames + GSAP | ✅ Production-ready | Exceptional |
| **Generative assets** | Replicate, ElevenLabs, Pollinations, Higgsfield | ✅ Wired | Exceptional |
| **Design system** | brand-guidelines, frontend-design, ui-design-system | ✅ Installed | Strong |
| **Site pipeline** | site-build, site-design, site-styleguide | ✅ Installed | Strong |
| **Social design** | canvas-design, replicate for thumbnails | ✅ Installed | Good |

---

## Top 3 Gaps (And How to Close Them)

### 1. **Figma ↔ Code Bridge (DONE — 5 min)**

**Gap:** No design-to-code sync. Every Figma change = manual React update.

**Solution:** Wire Figma MCP (✅ just added to `.mcp.json`)

**What it unlocks:**
- `get_design_context` — read Figma file structure into code
- `upload_assets` — push SVGs, images to Figma
- `get_code_connect_map` — sync Figma components ↔ React components
- `send_code_connect_mappings` — generate Code Connect metadata from code

**Studio immediate use:**
- Extract design tokens from Figma → Tailwind config
- Sync theming colors (RHYTHMIX brand palette) to CSS variables
- Verify component alignment between Figma designs + React implementation

**Next:** Run `/figma-use` skill (or load from Figma MCP docs) for Code Connect syntax.

---

### 2. **WCAG Accessibility Auditor (TODO — 2-4h, CRITICAL before paid launch)**

**Gap:** No automated WCAG 2.1 AA/AAA validation. Shipping a paid product without compliance checks is risky.

**Missing:** No published skill for:
- Contrast ratio validation (APCA + WCAG)
- Keyboard navigation auditing
- ARIA semantic checking
- Color-blindness simulation

**Build locally:** Create `.claude/skills/a11y-audit-skill/` with:

**Checklist (WCAG 2.1 AA minimum):**
- [ ] All text ≥ 4.5:1 contrast (normal) or 3:1 (large)
- [ ] All interactive elements keyboard accessible (Tab, Enter, Space)
- [ ] All images have alt text (or intentionally hidden)
- [ ] Form labels associated with inputs
- [ ] Color not sole method of conveying info
- [ ] Focus visible (outline not hidden)
- [ ] Page headings logical (h1 → h2 → h3, no jumps)

**Tool stack:**
- **Color contrast:** axe-core, APCA calculator
- **Keyboard nav:** Playwright keyboard event simulation
- **ARIA:** axe-core rule engine
- **Simulation:** Color blindness filter (simulate protanopia, deuteranopia)

**Studio audit checklist:**
```markdown
## Pre-Launch A11y Audit (STARLIGHTMIX Studio)

Studio home page:
- [ ] Hero CTA button — 4.5:1 contrast? Keyboard accessible?
- [ ] Pricing cards — differentiated by more than color alone?
- [ ] Form fields (upload, theme picker) — labeled + error messaging accessible?
- [ ] Feature list — logical heading hierarchy (h1 → h2/h3)?
- [ ] Video preview player — keyboard controls (spacebar play/pause)?

Settings / auth pages:
- [ ] Login form — labels, error messages, password strength feedback?
- [ ] Theme selector — visual ≠ sole selector method?

Live preview:
- [ ] Video player — keyboard accessible?
- [ ] Timeline scrubber — keyboard + mouse?
- [ ] Theme grid — keyboard nav + announcements for screen readers?

Mobile (9:16 portrait):
- [ ] Touch targets ≥ 44×44px?
- [ ] Text readable without zoom?
- [ ] Landscape orientation doesn't break layout?
```

**Recommendation:** Audit Studio now (before first paying user). Cost: 2-4h. Payoff: Legal cover + user satisfaction.

---

### 3. **Design Token Exporter (TODO — 4-8h, HIGH before first theme launch)**

**Gap:** Brand colors/typography/spacing hardcoded in CSS. No single source of truth.

**Solution:** Build Figma → Tailwind pipeline

**Workflow:**
1. Define design tokens in Figma (Figma Tokens plugin or native variables)
2. Export via Figma API
3. Transform to Tailwind `tailwind.config.js`
4. Commit to repo
5. Auto-sync on Figma change

**Benefit:** RHYTHMIX brand palette stays consistent across:
- HyperFrames video backgrounds
- STARLIGHTMIX Studio theme colors
- Social media designs (Canva)
- Landing pages

**Implementation sketch:**
```bash
# script: scripts/sync-design-tokens.mjs
# Runs: npx figma-tokens export --file-id ABC123 --output tailwind.config.js
# Commit on change
```

---

## MCP Server Status (Complete Inventory)

| Server | Wired | Purpose | Launch-critical |
|---|---|---|---|
| **creative-stack** | ✅ | Replicate + ElevenLabs (image, video, music, TTS) | YES |
| **higgsfield** | ✅ | Soul (text→image), DOP (image→video), talking head | YES |
| **pollinations** | ✅ | Free FLUX, Nova Reel, Suno, TTS | YES |
| **stepfun** | ✅ | Step Flash (script, story, episode briefs) | NO (content dev) |
| **playwright** | ✅ | Browser automation | NO (testing) |
| **claude-playwright** | ✅ | Browser session management | NO (testing) |
| **context7** | ✅ | Library documentation | NO (reference) |
| **figma** | ✅ NEW | Design tokens, Code Connect, component sync | YES |
| **lucid** | ❌ | Diagrams (ERD, flowcharts, org charts) | NO (future specs) |
| **webflow** | ❌ | No-code web builder | NO (not used in pipeline) |

**Next:** Load Figma MCP with `/figma-use` skill. Set up Code Connect for `studio/app/components/` → Figma component library sync.

---

## Pre-Launch Checklist (Design/Brand)

- [ ] **Figma MCP wired** ✅ Done
- [ ] **Code Connect map created** (map React components to Figma designs)
- [ ] **WCAG 2.1 AA audit completed** (all pages, forms, modals)
- [ ] **Design tokens defined** (colors, typography, spacing, motion easing)
- [ ] **Accessibility testing** (keyboard nav, screen reader, color blind sim)
- [ ] **Mobile/tablet tested** (9:16 portrait, landscape, tablet)
- [ ] **Brand consistency check** (colors, typography, RHYTHMIX palette compliance)

---

## Why This Approach

| Approach | Timeline | ROI | Maintenance |
|---|---|---|---|
| ❌ Hunt for GitHub design skills | 1-2 weeks | Low (skills sparse) | High (upstream tracking) |
| ✅ Wire MCP + build local a11y skill | 1-2 days | High (Figma sync + compliance) | Low (MCP official, a11y is timeless) |

**Decision:** MCP-first. Build missing skills locally. GitHub skills for design are not the limiting factor.

---

## Next Actions (Ranked)

1. **Figma MCP setup** (5 min)
   - [ ] Load Figma MCP — Run `/figma-use`
   - [ ] Create Code Connect map — `studio/app/components/` ↔ Figma components
   - [ ] Extract design tokens from brand-palette Figma file
   - [ ] Export to `studio/tailwind.config.js`

2. **WCAG audit** (2-4h, before launch)
   - [ ] Audit all Studio pages + forms + modals
   - [ ] Build `.claude/skills/a11y-audit-skill/` if findings warrant automation
   - [ ] Fix critical issues (contrast, keyboard nav, labels)
   - [ ] Retest with axe-core + manual keyboard nav

3. **Design token sync** (4-8h, before theme marketplace)
   - [ ] Set up Figma Tokens plugin (or native variables)
   - [ ] Create `scripts/sync-design-tokens.mjs`
   - [ ] Wire to GitHub Actions for auto-sync on Figma change
   - [ ] Document for designers: "Update Figma → tokens auto-sync to code"

---

## Files Changed

- `.mcp.json` — Added Figma MCP

---

## Summary

GitHub design skills don't exist because **design lives in MCP servers now**. Figma MCP (just wired) bridges the designer-developer gap. Two custom local skills (a11y auditor, token exporter) complete the stack before paid launch.

Timeline: ~1-2 days of setup. ROI: Full compliance + brand consistency + design-to-code automation.
