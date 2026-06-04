# Type System: SURGE

**Design philosophy:** Clear, energetic, readable at all sizes and production quality. Typography differentiates character voice (Ziggy's internal monologue vs. external dialogue vs. UI callouts) and emotional state (calm vs. chaotic). Fonts are kid-friendly but not infantilizing. All pairings work at 1080p (YouTube standard) and remain legible when subtitled in multiple languages.

---

## Font Pairings

### Pairing 1: Display + Body (Primary)

#### Display Font: Google Fonts "Fredoka One" (Headings, Title Cards, Episode Slugs)

- **Style**: Rounded geometric sans-serif, friendly and modern
- **Weight**: Regular (600) — bold enough to anchor visual hierarchy without aggression
- **Color**: Typically **Electric Blue #0052CC** or **Warm Orange #FF8C3A** depending on scene tone
- **Sizes**:
  - **Episode title cards** ("INT. CLASSROOM — MONDAY 9:05 AM"): **28px**, centered, 1.2 line-height
  - **Scene slugs**: **24px**, left-aligned, all-caps, 1.4 line-height
  - **Thought bubble headers** (thematic callouts): **18px**, center or left-aligned
- **Spacing**: 1.5 line-height for headlines; 2px letter-spacing at 24px+ (adds breathing room)
- **Usage**: Opens/closes scenes, episode titles, superpower names ("SURGE BOOST!", "HYPERFOCUS MODE"), visual emphasis moments, chapter breaks

**Why Fredoka One?**
- Rounded terminals feel accessible to young children (not harsh or corporate)
- High x-height ensures readability at small sizes
- Energetic personality matches Ziggy's kinetic voice
- Professional enough for broadcast but playful enough for kids' content
- Available free on Google Fonts (no licensing costs across territories)

**Test at 1080p**: Minimum readable size is **16px** (for small UI labels); optimal headline size is 24–28px.

---

#### Body Font: Google Fonts "Inter" (Dialogue, Narrative, Scene Description)

- **Style**: Neutral geometric sans-serif; clean, modern, highly legible
- **Weights**:
  - Regular (400): Dialogue, scene action descriptions, body copy
  - SemiBold (600): Character names (before dialogue), emphasis within dialogue, labels
  - Bold (700): Narrative callouts, chapter headers, strong emotional moments (rarely used)
- **Color**: **Charcoal #333333** for dialogue and body text (maximum contrast on Light Gray #F5F5F5 or white backgrounds)
- **Sizes**:
  - **Character names** (before dialogue): **16px SemiBold**, color-coded when needed
    - Ziggy: default charcoal
    - Jake: can tint to **Warm Orange** (#FF8C3A) for visual distinction
    - Mrs. Henderson: can tint to **Sage Green** (#2D8A3D) for calm authority
    - Mom Sarah: can tint to **Soft Lavender** (#D8B5E6) for emotional warmth
  - **Dialogue**: **14px Regular**, 1.5 line-height, max 60 characters per line for readability
  - **Narrative/action**: **13px Regular**, 1.6 line-height (slightly looser for scanning)
  - **Captions (YouTube CC)**: **14px Regular**, white text on semi-transparent black (YouTube accessibility standard)
- **Spacing**: 1px letter-spacing at 14px+ (improves readability on screen); 0px at smaller sizes
- **Kerning**: OpenType kerning enabled (Inter handles this excellently by default)

**Why Inter?**
- Gold standard for screen typography; designed for on-screen legibility at all sizes
- Neutral voice (doesn't distract from content) — ideal for dialogue and narrative
- Excellent language support (accents, non-Latin scripts if needed for future localization)
- Free and open-source; used by Google, GitHub, Figma
- Variable font version supports weight/width adjustments for animation

**Test at 1080p**: Minimum readable size is **12px** (accessibility min, not recommended); optimal dialogue size is 14px.

---

### Pairing 2: Interior Monologue (Accent)

#### Font: Google Fonts "Caveat" (Ziggy's Internal Voice Only)

- **Style**: Handwritten, intimate, casual script
- **Weight**: Regular (400) — captures the loose, stream-of-consciousness feel of internal monologue
- **Color**: **Electric Blue #0052CC** for visual distinction from external dialogue; occasionally **Deep Burgundy #5D1E3B** during shame moments
- **Sizes**:
  - **Standard interior monologue**: **13px**, 1.8 line-height (loose spacing mimics handwriting)
  - **Emphasized internal thought**: **14px**, same color but slightly larger for emotional intensity
  - **Shame/overwhelm interior**: **12px Deep Burgundy**, may appear shaky or offset for emotional effect
- **Background**: Soft background box or translucent panel behind Caveat text for readability (avoids placing handwriting over busy backgrounds)
  - Light Gray (#F5F5F5) with Electric Blue text = calm internal thought
  - Light Lavender (#D8B5E6) with Electric Blue text = emotional/introspective
  - White with Deep Burgundy text = shame/struggle moment
- **Spacing**: 1.5–2 line-height (handwriting benefits from air); 0 letter-spacing (preserves handwritten flow)
- **Punctuation**: Occasional ellipses (…) and dashes (—) to mimic thinking rhythm; no ALL CAPS (feels aggressive)

**Why Caveat?**
- Handwriting immediately signals interiority (internal vs. external)
- Kids recognize this font as "thoughts" from other media (comic books, animations)
- Casual, personable tone feels age-appropriate for a 10-year-old's inner voice
- Loose baseline adds life without becoming illegible
- Free on Google Fonts

**Caveat vs. Dialogue Rule**: Any thought that's fully internal to Ziggy's mind = Caveat. If another character hears/responds to it, switch to Inter body font (transition when the thought is externalized).

**Example internal monologue moment**:
```
[Caveat, Electric Blue, 13px on Light Gray background box]
"Why can't I just focus like Jake does?
It's been five minutes and I've already counted
the ceiling tiles THREE times."
```

**Example shame moment**:
```
[Caveat, Deep Burgundy, 12px on white background, slightly offset/shaky]
"I'm broken.
I'm the problem."
```

---

## Size & Spacing Reference Table

| Element | Font | Weight | Size | Color | Line Height | Usage |
|---------|------|--------|------|-------|-------------|-------|
| Episode Title Card | Fredoka One | 600 | 28px | Electric Blue or Warm Orange | 1.2 | Scene opening ("INT. CLASSROOM — MONDAY") |
| Scene Slug | Fredoka One | 600 | 24px | Electric Blue | 1.4 | Subtle scene markers (if used in composition) |
| Character Name | Inter | 600 | 16px | Color-coded or Charcoal | — | Before dialogue line |
| Dialogue | Inter | 400 | 14px | Charcoal | 1.5 | Main dialogue / narrative |
| Internal Monologue | Caveat | 400 | 13px | Electric Blue or Deep Burgundy | 1.8 | Ziggy's thoughts only |
| Action / Narrative | Inter | 400 | 13px | Charcoal | 1.6 | Stage directions (if rendered as text) |
| YouTube Captions | Inter | 400 | 14px | White on semi-transparent black | 1.5 | Accessibility, YouTube CC |
| UI Buttons | Inter | 600 | 14px–16px | Charcoal on Warm Orange or Light Gray | — | Controls, interactive elements (if any) |
| Emotional Callout (non-dialogue) | Fredoka One | 600 | 18px–20px | Neon Yellow on dark or Electric Blue | 1.3 | "SURGE BOOST!", "HYPERFOCUS MODE" |

---

## Color in Typography

### Character Voice Color Coding (Optional but Recommended)

**Use character name color to reinforce voice identity:**

| Character | Name Color | Why |
|-----------|-----------|-----|
| Ziggy | Charcoal (default) or Electric Blue | Direct, energetic, sometimes chaotic |
| Jake | Warm Orange (#FF8C3A) | Joyful, supportive, grounded |
| Mrs. Henderson | Sage Green (#2D8A3D) | Calm authority, wisdom, structure |
| Mom Sarah | Soft Lavender (#D8B5E6) | Emotional, caring, introspective |
| Sage / Grandpa (imagined) | Sage Green (#2D8A3D) | Same as Mrs. H. — generational wisdom |

**Implementation**: Only color the character name, not the dialogue itself (keeps dialogue text readable on varied backgrounds).

### Emotional State Color Coding

| State | Typography Color | Font | Context |
|-------|------------------|------|---------|
| Calm / Clear | Electric Blue #0052CC | Caveat | Ziggy thinking clearly |
| Joyful / Connected | Warm Orange #FF8C3A | Inter (body) or Fredoka One (callout) | Dialogue about friendship, success |
| Focused / Hyperfocus | Neon Yellow #FFFF00 | Fredoka One (callout only, use sparingly) | "HYPERFOCUS MODE!" — moment of clarity |
| Anxious / Overstimulated | Electric Blue + slight vibration effect | Inter or Caveat (both work) | Nervous dialogue, jittery internal thoughts |
| Shame / Overwhelm | Deep Burgundy #5D1E3B | Caveat (interior monologue) | Ziggy's internal struggle |
| Nurturing / Safe | Soft Lavender #D8B5E6 | Inter | Mom's dialogue, warm moments |

---

## Punctuation & Dialogue Conventions

### Ellipses (...) 
- **Interior monologue**: use frequently (signals stream-of-thought)
- **Dialogue**: use sparingly (can feel evasive if overused)
- **Example**: "I just... why can't I finish anything?"

### Em Dashes (—)
- **Interior monologue**: use to show thought interruptions
- **Example**: "And then Mrs. H. said I wasn't trying hard enough — which isn't even true."

### ALL CAPS
- **Never for dialogue** (feels aggressive/yelling even with normal punctuation)
- **Only for UI callouts or Surge power names**: "HYPERFOCUS MODE", "SURGE BOOST"

### Parenthetical Asides (Voice Direction in Animation Scripts)
- Not rendered as on-screen text; for animator/voice director reference only
- **Example**: "(frustrated, under breath)" — guides voice tone but doesn't appear on screen

---

## Accessibility & Localization

### Baseline Accessibility

- ✓ **Minimum size**: 14px dialogue on standard backgrounds (WCAG AAA compliant)
- ✓ **Contrast**: Charcoal text on Light Gray = 18.5:1 ratio (exceeds AAA standards)
- ✓ **Letter spacing**: 1px at 14px+ improves readability for dyslexia
- ✓ **Line spacing**: 1.5+ line-height improves scanning for attention disorders
- ✓ **No serifs**: Sans-serif fonts reduce cognitive load for many neurodivergent viewers
- ✓ **Generous margins**: 16px padding around text blocks prevents text crowding

### Localization Notes

- **Inter**: Supports 200+ languages/scripts; no substitution needed for European languages, Cyrillic, Greek, Hebrew, Arabic (via OpenType rules)
- **Fredoka One**: Latin/Cyrillic only; may need substitution for CJK (Chinese/Japanese/Korean) or Thai localization
- **Caveat**: Latin/Cyrillic only; substitute with a local handwritten font if dubbing to Asian languages

**Plan**: For Season 1 US/UK/AU broadcast, Inter + Fredoka One + Caveat are sufficient. For international expansion, establish local font substitutes in production bible before outsourcing to non-English territories.

---

## Animation & Motion Considerations

### Variable Font Use (Advanced)

If animation framework supports variable fonts (Remotion, HyperFrames, etc.), Inter Variable allows:
- **Weight shifts** during animation: Calm (400) → Stressed (600) → Panic (700) — conveys emotion without color change
- **Width shifts** for emphasis: Normal → Condensed for speed, Normal → Expanded for slowdown

**Not required for pilot**, but useful for Season 2+ if budget permits variable font rendering.

### Handwriting Jitter Effect (Caveat Only)

During Ziggy's high-anxiety moments, apply subtle CSS `skew()` or `rotate()` to Caveat text to mimic shaky handwriting:
- ±1–2° rotation on individual letters
- ±0.5px offset (not dramatic, just "nervous")
- Animation duration: 100–200ms random flicker
- **Keep readable**: never distort beyond legibility

**Example CSS** (pseudo-code for animator reference):
```css
.interior-monologue-panic {
  font-family: 'Caveat';
  font-size: 12px;
  color: #5D1E3B;
  animation: shaky-thought 0.15s ease-in-out infinite;
}
@keyframes shaky-thought {
  0% { transform: rotate(-1deg) translateX(0); }
  50% { transform: rotate(1deg) translateX(0.5px); }
  100% { transform: rotate(-1deg) translateX(0); }
}
```

---

## Type System Testing Checklist

Before animation greenlight:

- [ ] All fonts render at 1080p (YouTube) without pixelation or blur
- [ ] Dialogue readable on 8-inch tablet screens (worst case for accessibility)
- [ ] Character name colors pass WCAG AA contrast with typical backgrounds
- [ ] Caveat interior monologue legible over background overlays (test with 40% opacity Deep Burgundy)
- [ ] All Google Fonts URLs verified live (cached, no external dependency failures)
- [ ] Fallback fonts specified (Inter → Arial, Fredoka One → -apple-system sans-serif, Caveat → cursive)
- [ ] Language test: **If dubbing to non-English**, substitute fonts tested in production files
- [ ] Voice actor/animator pairing verified: Caveat handwriting syncs with dialogue timing (doesn't lag or rush)

---

## Reference Examples in Context

### Example 1: Classroom Calm Moment

```
[Scene: Ziggy at desk, Mrs. Henderson approaches]

Character name: Mrs. Henderson (Sage Green #2D8A3D, Inter SemiBold 16px)
Dialogue: "That's a clever observation, Ziggy." (Inter Regular 14px Charcoal)

Interior monologue (off-screen): "Wait, really?" (Caveat 13px Electric Blue on Light Gray box)
```

### Example 2: Shame Spiral (Full Sequence)

```
[Tight close-up on Ziggy's face, Deep Burgundy wash at 40% opacity]

Interior monologue 1: "I can't even read one page." (Caveat 13px Electric Blue, shaky)
Interior monologue 2: "Everyone else did it in five minutes." (Caveat 12px Deep Burgundy, slightly offset)
Interior monologue 3: "I'm broken." (Caveat 11px Deep Burgundy, very shaky, larger letter spacing for emphasis)

[Background slowly shifts to solid Deep Burgundy, interior monologue fades]
```

### Example 3: Hyperfocus Breakthrough (Surge Mode)

```
[Explosion of Neon Yellow #FFFF00 fills screen]

Callout: "HYPERFOCUS MODE!" (Fredoka One Bold 24px, Neon Yellow, outlined in Electric Blue)

[Scene shifts to slow, dreamlike motion; Ziggy floating]

Interior monologue: "Everything's clear now." (Caveat 14px Electric Blue, steady, centered, large letter spacing)
```

---

## Outsourcing & Consistency

### For Animation Teams

- **Lock fonts** in design/animation software before production starts
  - Figma: Add Google Fonts directly to team library
  - After Effects: Embed fonts in project file
  - HyperFrames: Specify fonts in `<meta>` tag of HTML composition
- **Enforce color locks**: Separate text color layers from font selection to prevent "creative substitutions"
- **Create type specimens**: One-page reference showing all sizes, weights, and colors in context (share with all vendors)

### For Dialogue Writers

- Keep dialogue **8–12 words per line** maximum (easier to read on screen, aligns with YouTube subtitle standards)
- Avoid ALL CAPS mid-sentence (use em-dash or ellipsis instead)
- Interior monologue can be longer; Caveat's loose spacing accommodates more text per line than Inter

---

## Font License Summary

| Font | License | Cost | Limitations |
|------|---------|------|-------------|
| Google Fonts "Inter" | Open Font License (OFL) | Free | No restrictions; embed in video/web |
| Google Fonts "Fredoka One" | Open Font License (OFL) | Free | No restrictions; embed in video/web |
| Google Fonts "Caveat" | Open Font License (OFL) | Free | No restrictions; embed in video/web |

**All fonts are broadcast-safe**: No licensing fees for YouTube, Vimeo, or traditional television distribution. Safe for global broadcast without additional negotiation.

---
