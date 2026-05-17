# Instagram prompts grab-bag

Paste-ready prompts from Instagram carousels you saw. These aren't Claude *skills* (they don't get auto-invoked) — they're prompts you copy/paste when you need them. Saved here so they're searchable.

---

## sifuyik — 9 design prompts for Claude

### 1. Client Mind Reader
```
Act as an experienced branding expert. Based on this client brief, identify
what the client actually wants vs what they are saying. Extract hidden
expectations, emotional goals, and potential misunderstandings:
[paste brief].
```

### 2. Logo Direction Multiplier
```
Take this logo concept and generate 10 variations pushing it in different
creative directions: minimal, bold, futuristic, luxury, playful, retro,
and geometric. Explain how each direction shifts brand perception.
```

### 3. Visual Hierarchy Fixer
```
Analyze this design and identify all hierarchy issues. Tell me how to fix
readability, focal points, spacing, and visual flow:
[describe your design].
```

### 4. Brand Color Accessibility Checker
```
Audit my brand color palette for WCAG accessibility. Test every
text-on-background combination, show contrast ratios, and suggest the
minimum adjustments to pass while keeping my brand feel intact.
Colors: [list your hex codes].
```

### 5. Visual Hierarchy Fixer (variant)
(IG carousel skipped #5 — see #3)

### 6. Abstract to Visual Translator
```
Translate this abstract brand idea (e.g. trust, innovation, freedom) into a
concrete visual design direction. Suggest colors, font personalities,
shapes, textures, and composition ideas.
```

### 7. Premium Design Upgrade
```
Take this design concept and upgrade it to feel high-end and premium.
Identify what is making it look generic and suggest specific improvements
in typography, spacing, color depth, and overall composition.
```

### 8. Design Handoff Doc Generator
```
Write a developer-ready design spec for this component. Include exact
dimensions, padding, color hex codes, font weights, spacing values,
hover states, and responsive behavior at mobile and desktop.
```

### 9. Competitor Design Decoder
```
Analyze the visual design approach of these competitors: [list them].
Identify their color patterns, layout strategies, and messaging style.
Then find the visual gap — the space none of them own — and tell me how
to position my design there.
```

---

## Roman Knox — Content & Niche Validation

```
Search Instagram Reels, TikTok, and Reddit for the top-performing posts
in [niche] over the last 30 days. Identify recurring visual styles, hooks,
and topics that consistently go viral. Cross-reference what appears across
all platforms and give me the 5 highest-demand content angles optimized
for AI-generated visuals.
```

Note: only effective if Claude has web search / social-platform MCP
access. Otherwise it'll hallucinate.

---

## What this file is NOT

These are useful starting points, not skills. A real skill (the kind in
`.claude/skills/`) auto-triggers on certain words and has structured
references + scripts. Prompts above are just text you paste.

If any of these turn out to be ones you use weekly, the move is:
`/write-a-skill <name>` and turn it into a proper skill so it triggers
automatically.
