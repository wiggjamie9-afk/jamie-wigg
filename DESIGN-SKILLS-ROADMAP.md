# Design Skills Roadmap for RHYTHMIX Ecosystem

## Current Design Skills (Installed ✅)

### Foundation Tier
- **brand-guidelines** — Anthropic brand styling + color/type systems
- **brand-voice** — Tone, messaging, content voice consistency
- **frontend-design** — Production UI avoiding generic AI aesthetics
- **ui-design-system** — Design system authoring (components, tokens)

### Content Tier
- **site-build** — Full pipeline: sitemap → wireframe → design → HTML
- **site-design** — HTML/CSS generation for landing pages
- **site-styleguide** — Visual guidelines + component specs
- **canvas-design** — Canva integration (social posts, graphics)
- **prototype** — Interactive prototype building

### Process Tier
- **observability-designer** — UX/observability architecture
- **brand-voice** — Communication strategy

---

## Design Skills You're Missing (Recommended)

### TIER 1: CRITICAL FOR RHYTHMIX VIDEO CONTENT
These directly support your music video + promo pipeline:

| Skill | Purpose | Why You Need It | GitHub Source |
|---|---|---|---|
| **motion-design** | Animation principles, GSAP, transitions | ManimGL videos + HyperFrames animations need motion theory | 3b1b/manim (integrated) |
| **typography-expert** | Font pairing, hierarchy, readability | Video titles, text overlays, social graphics | TBD |
| **color-theory** | Palettes, contrast, emotion, branding | RHYTHMIX brand consistency across all videos | TBD |
| **composition-fundamentals** | Visual hierarchy, rule of thirds, balance | Shot framing, thumbnail design, layout | TBD |
| **accessibility-designer** | WCAG, color contrast, readability | Ensure videos accessible to all users | TBD |

### TIER 2: ENHANCE YOUR EXISTING TOOLS
Extend skills you already have:

| Skill | Purpose | Synergy | Status |
|---|---|---|---|
| **design-systems-advanced** | Design tokens, CSS-in-JS, component APIs | Extends ui-design-system with token generation | 📍 Find |
| **responsive-design-expert** | Mobile-first, breakpoints, fluid layouts | STARLIGHTMIX Studio uses Tailwind v4 | 📍 Find |
| **figma-expert** | Advanced Figma workflows, prototyping, plugins | Already have Figma MCP, but need design skills | 📍 Find |
| **webflow-designer** | Webflow visual builder + interactions | Alternative to frontend-design for no-code | 📍 Find |
| **accessibility-audit** | Test designs for WCAG compliance | Pair with frontend-design for quality gates | 📍 Find |

### TIER 3: SPECIALIZED FOR YOUR USE CASES
Niche skills for specific projects:

| Skill | Use Case | Benefit | Status |
|---|---|---|---|
| **thumbnail-designer** | YouTube thumbnails (click-optimized) | Social content gets 3-5x more clicks | 📍 Find |
| **instagram-feed-designer** | Grid aesthetics, carousel design | RHYTHMIX social presence | 📍 Find |
| **podcast-cover-designer** | Album art, single art, cover design | Music releases need visual identity | 📍 Find |
| **motion-graphics** | After Effects, video compositing | Professional video fx | 📍 Find |
| **3d-design** | Blender, Three.js, 3D modeling | Product visualization, 3D animations | 📍 Find |
| **data-visualization** | Charts, graphs, infographics | Complexity theory videos (power laws, fractals) | 📍 Find |
| **icon-design** | SVG, icon systems, custom glyphs | STARLIGHTMIX UI icons | 📍 Find |
| **illustration** | Digital illustration, stylization | Custom character/asset creation | 📍 Find |

### TIER 4: PROCESS/COLLABORATION SKILLS
Design thinking + team workflows:

| Skill | Purpose | Team Value |
|---|---|---|
| **design-sprint** | 5-day design sprint methodology | Rapid iteration on new features |
| **user-research** | Research synthesis, interviews, surveys | Validate design decisions |
| **wireframe-expert** | Lo-fi wireframing tools + techniques | Fast iteration before high-fidelity |
| **design-critique** | Structured feedback + design review | Quality control on all visual work |
| **design-documentation** | Design specs, handoff, component docs | Transition designs to development |

---

## Recommended Installation Order

### Phase 1: Visual Foundations (This Week)
```bash
# Priority order - install these first
1. color-theory-expert         # Essential for brand consistency
2. typography-expert            # Text rendering critical for videos
3. composition-fundamentals     # Shot framing, layout
4. accessibility-designer       # Compliance + reach
5. motion-design-fundamentals   # Animated video theory
```

### Phase 2: Specialized Content (Week 2-3)
```bash
6. thumbnail-designer          # YouTube/social engagement
7. data-visualization          # Complexity theory videos
8. instagram-feed-designer     # Social presence
9. podcast-cover-designer      # Music release visuals
10. icon-design-system         # STARLIGHTMIX UI
```

### Phase 3: Advanced Tools (Week 4+)
```bash
11. figma-pro-workflow         # Extend design capability
12. motion-graphics            # Professional video fx
13. 3d-design-fundamentals     # Asset creation
14. illustration-style-guide   # Custom art direction
```

### Phase 4: Process/Collaboration (Ongoing)
```bash
15. design-sprint-facilitator
16. user-research-methods
17. design-critique-framework
18. design-documentation
```

---

## Where to Find Design Skills

### Official Sources
- **Anthropic Skills** — https://skillsmp.com/creators/anthropic
- **GitHub Skills Collections** — https://github.com/collections/learn-design
- **Hugging Face Skills** — synced to `.agents/skills/`

### Community/Open Source
- **3Blue1Brown** — Animation + visualization skills
- **Design-focused creators** — Individual skill authors on skillsmp.com
- **Adobe XD / Figma communities** — Community skills

### Installation Methods

#### Method 1: From skillsmp.com
```bash
npx skills add [creator]/[skill-name]
# Example: npx skills add anthropic/color-theory-expert
```

#### Method 2: From GitHub directly
```bash
# Clone into .claude/skills/
git clone https://github.com/[user]/[skill-repo].git .claude/skills/[skill-name]
```

#### Method 3: Manual install (if automated fails)
```bash
# Download ZIP, extract to .claude/skills/[skill-name]
# Verify with: ls -la .claude/skills/[skill-name]/SKILL.md
```

---

## Integration with Your Video Pipeline

### Design Skills → Video Creation

```
┌──────────────────────────────────────────┐
│ COLOR-THEORY                             │
│ → Define RHYTHMIX brand palette          │
│ → Video color grading standards          │
│ → Social media color schemes             │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ TYPOGRAPHY-EXPERT                        │
│ → ManimGL equation rendering fonts       │
│ → Video title/text overlay styles        │
│ → Social post captions                   │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ COMPOSITION-FUNDAMENTALS                 │
│ → Shot framing for promo videos          │
│ → Thumbnail composition (click-worthy)   │
│ → Layout for social cards                │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ MOTION-DESIGN                            │
│ → GSAP animation principles              │
│ → Video transition theory                │
│ → Timing + easing curves                 │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ DATA-VISUALIZATION                       │
│ → Graph design for complexity videos     │
│ → Infographic hierarchy                  │
│ → Chart aesthetics                       │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ THUMBNAIL-DESIGNER                       │
│ → 1280×720 YouTube thumbnails            │
│ → 1200×628 social preview cards          │
│ → Click-rate optimization                │
└──────────────────────────────────────────┘
```

---

## Current Gaps Analysis

### What You Have
✅ System design (ui-design-system, brand-guidelines)  
✅ Web design (frontend-design, site-build, site-design)  
✅ Content design (brand-voice, canvas-design)  
✅ Process (prototype, observability-designer)  

### What You're Missing
❌ **Visual fundamentals** (color, typography, composition)  
❌ **Motion design theory** (animation, transitions)  
❌ **Video design** (thumbnails, motion graphics)  
❌ **Specialized content** (data viz, illustrations, icons)  
❌ **3D design** (asset creation, 3D visualization)  
❌ **Accessibility** (compliance, inclusive design)  

### Impact
- **Video quality limited** without motion + composition skills
- **Social engagement low** without thumbnail optimization
- **Brand inconsistency** without color + typography standards
- **Accessibility risks** without WCAG audit
- **Professional gaps** without data visualization for explainers

---

## Action Plan

### This Week
1. **Search GitHub** for available design skills (in progress)
2. **Install top 5** critical skills:
   - color-theory-expert
   - typography-expert
   - composition-fundamentals
   - accessibility-designer
   - motion-design-fundamentals

3. **Document** your design design system in:
   - RHYTHMIX-DESIGN-SYSTEM.md (colors, fonts, motion)
   - STARLIGHTMIX-UI-GUIDELINES.md (web app standards)

### Next 2 Weeks
4. **Install Phase 2** skills (thumbnails, data viz, etc.)
5. **Create** design workflows integrating new skills
6. **Audit** existing videos for design consistency
7. **Build** design specs for all platforms

### Ongoing
8. **Test** new skills on upcoming projects
9. **Refine** based on social engagement metrics
10. **Expand** as new design tools emerge (AI-powered design, new Figma plugins, etc.)

---

## Resources

### Learn While Installing
- Each skill includes documentation + examples
- Pair skill with `/brainstorming` for guidance
- Use `/design-critique-framework` (once installed) to review work

### Design Theory References
- "The Design of Everyday Things" — Don Norman
- "Color and Light" — James Gurney
- "Thinking with Type" — Ellen Lupton (typography)
- "The Principles of Beautiful Web Design" — Jason Beaird

### Tool Documentation
- Figma Design Systems: https://www.figma.com/design-systems/
- Tailwind v4: https://tailwindcss.com/
- GSAP Motion Design: https://gsap.com/
- ManimGL Visual Style: https://docs.manim.community/

---

## Next Step

**Awaiting GitHub search results** for available design skills...

Once agent completes, you'll have:
1. ✅ Complete inventory of available design skills
2. ✅ Installation URLs for each skill
3. ✅ Recommendations prioritized for your use case
4. ✅ Installation scripts ready to run

Then: `bash install-design-skills.sh` to batch-install Phase 1 skills.
