# Accessibility + WCAG 2.1 AA Audit — resonate.html

**File audited:** `/home/user/jamie-wigg/resonate.html` (1,004 lines)
**Audit date:** 2026-05-21
**Standards:** WCAG 2.1 AA, Apple HIG (touch targets), ARIA 1.2

---

## Summary

| # | Check | Status | Severity |
|---|---|---|---|
| 1 | Heading hierarchy | **PASS** | — |
| 2 | Color contrast | **FAIL (partial)** | Serious |
| 3 | Touch target sizes (≥44×44px) | **FAIL** | Serious |
| 4 | Form labels associated with inputs | **FAIL** | Critical |
| 5 | Alt text on images | **PASS (with caveats)** | Moderate |
| 6 | Keyboard navigability + focus visible | **FAIL** | Critical |
| 7 | ARIA landmarks | **FAIL** | Moderate |
| 8 | `prefers-reduced-motion` handling | **PASS** | — |
| 9 | Skip-to-content link | **FAIL** | Serious |
| 10 | `<html lang>` attribute | **PASS** | — |

**Score: 4 / 10 pass, 6 fail (2 critical, 3 serious, 1 moderate)**

---

## 1. Heading Hierarchy — PASS

**Audit:** Single `<h1>` at line 295 ("Music that breathes with you."). `<h2>` used for section headers (lines 312, 327, 394, 449, 513, 532, 568, 605, 619, 649, 665, 703). `<h3>` used for sub-items in mode cards, hardware cards, footer (lines 457, 467, 477, 489, 539, 545, 551, 557, 776). No skipped levels.

**Note:** `.pricing-name` (line 625) and `.mode-roman` (lines 455, 465, 475) use `<div>` with serif styling instead of headings — acceptable but `.pricing-name` could arguably be `<h3>`.

---

## 2. Color Contrast — FAIL (partial)

Background `--bg: #0A0F1F` (navy). Tested against WCAG AA (4.5:1 normal text, 3:1 large text ≥18.66px or 14px bold).

### PASS
- `--text #EDE9DB` on `--bg #0A0F1F` → **15.0:1** ✓
- `--gold #D4AF37` on `--bg #0A0F1F` → **8.4:1** ✓
- `--cream #F4E4BC` on `--bg #0A0F1F` → **13.4:1** ✓

### FAIL 2a (Serious) — `--text-3 #5E6577` on navy bg = ~3.7:1
Used for `.crumb` (line 99), `.disclaimer-small` (line 182), `.pricing-foot` (line 222), `.footer-copy` (line 240), `.medical-block` (line 239), small text in comparison table (lines 335-339), and the bottom medical disclaimer (line 800).
The medical-block at 0.78rem (line 239) **fails AA** (needs 4.5:1 for normal text).

**Fix (line 49):**
```css
--text-3: #8A92A3;  /* raises contrast to ~5.3:1 */
```

### FAIL 2b (Serious) — `.gold-dim rgba(212,175,55,0.55)` on navy
Line 45, used on line 652 for italic founding-100 invite and line 256 for FAQ link underlines. Effective gold at 55% opacity over `#0A0F1F` ≈ #7A6422 → **3.0:1**. Fails AA for normal text (0.95rem).

**Fix (line 652):**
```html
<p style="font-family:var(--serif); font-style:italic; color:var(--gold); text-align:center; margin-bottom:2rem; font-size:0.95rem;">
```

### FAIL 2c (Moderate) — `.cmp` table sub-caption text (lines 335-339)
Uses `style="color:var(--text-3); font-size:0.55rem;"` — at ~8.8px on navy at 3.7:1, fails both contrast and the 12px minimum readable size.

**Fix:**
```html
<span style="color:var(--text-2); font-size:0.7rem;">(real-time, not preset)</span>
```

### FAIL 2d (Moderate) — `.dot.n` (red) and `.dot.m` (grey) in comparison table (lines 146-147)
`--bad #8A4A4A` ≈ 3.2:1 vs navy; only 10px dot indicators with adjacent text. Passes as decorative-with-text-redundancy, but the dots in isolation fail 1.4.11 Non-text Contrast (needs 3:1 for graphic objects).

**Fix:** Brighten `--bad` to `#B05B5B` (≈ 4.0:1) or add an `aria-hidden` since text already conveys the same info.

---

## 3. Touch Target Sizes (≥44×44px Apple HIG / WCAG 2.5.5 AAA) — FAIL

### FAIL 3a (Serious) — `.rating-stars button` 42×42px (line 228)
Below 44px on both axes.

**Fix:**
```css
.rating-stars button { width:44px; height:44px; ... }
```

### FAIL 3b (Serious) — `.hr-slider::-webkit-slider-thumb` 24×24px (lines 175-176)
Drag handle is 24×24, well below 44×44. Mobile users will struggle.

**Fix:**
```css
.hr-slider { height:8px; }
.hr-slider::-webkit-slider-thumb {
  -webkit-appearance:none; width:44px; height:44px;
  border-radius:50%; background:var(--gold);
  border:none; cursor:pointer; box-shadow:0 0 12px var(--gold);
}
.hr-slider::-moz-range-thumb {
  width:44px; height:44px; border-radius:50%;
  background:var(--gold); border:none; cursor:pointer;
}
```

### FAIL 3c (Serious) — `.sign-in` button (line 101)
`padding:0.55em 1.3em` with 0.65rem font ≈ 10.4px font + ~11px vertical → roughly **32-34px tall**. Fails 44px.

**Fix:**
```css
.sign-in { padding:0.85em 1.3em; min-height:44px; display:inline-flex; align-items:center; }
```

### FAIL 3d (Moderate) — `.btn-sm` (line 92)
`padding:0.7em 1.4em` with 0.7rem font ≈ 42px tall. Fails by ~2px. Used at lines 461, 471, 481, 501, 502.

**Fix:**
```css
.btn-sm { padding:0.85em 1.4em; font-size:0.72rem; min-height:44px; }
```

### PASS — FAQ summary tap targets
Lines 707-767 — `.faq-item summary` (line 248) has `padding:1.4rem 1.6rem` and is full-width row. Adequate.

---

## 4. Form Labels Associated with Inputs — FAIL (Critical)

### FAIL 4a (Critical) — Day One email input has no label (line 654)
```html
<input type="email" name="email" placeholder="you@example.com" required />
```
Placeholder is not a label substitute (1.3.1 Info & Relationships, 4.1.2 Name/Role/Value).

**Fix:**
```html
<label for="dayOneEmail" class="visually-hidden">Email address</label>
<input id="dayOneEmail" type="email" name="email" placeholder="you@example.com" required autocomplete="email" />
```
And add:
```css
.visually-hidden { position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0; }
```

### FAIL 4b (Critical) — Feedback form labels lack `for=` (lines 669, 678, 689, 691)
Labels exist but none are associated. Screen readers cannot pair them with their inputs.

**Fix (lines 668-695):**
```html
<label id="ratingLabel">How was your experience?</label>
<div class="rating-stars" id="ratingStars" role="radiogroup" aria-labelledby="ratingLabel">…</div>

<label for="triedSelect">What did you try?</label>
<select id="triedSelect" name="tried">…</select>

<label for="msgArea">Your message</label>
<textarea id="msgArea" name="message" placeholder="..."></textarea>

<label for="replyEmail">Your email (optional · for a reply)</label>
<input id="replyEmail" type="email" name="email" placeholder="(optional)" autocomplete="email" />
```

### FAIL 4c (Critical) — Rating stars are buttons without context (lines 670-676)
Five `<button>` elements numbered 1-5 with no `aria-label` or `role`. A screen reader user hears only "1 button, 2 button…" with no rating context.

**Fix:**
```html
<div class="rating-stars" id="ratingStars" role="radiogroup" aria-label="Rate your experience from 1 to 5">
  <button type="button" role="radio" aria-checked="false" aria-label="1 star" data-r="1">1</button>
  <button type="button" role="radio" aria-checked="false" aria-label="2 stars" data-r="2">2</button>
  <button type="button" role="radio" aria-checked="false" aria-label="3 stars" data-r="3">3</button>
  <button type="button" role="radio" aria-checked="false" aria-label="4 stars" data-r="4">4</button>
  <button type="button" role="radio" aria-checked="false" aria-label="5 stars" data-r="5">5</button>
</div>
```
And update JS (line 941) to toggle `aria-checked` alongside `.active`:
```js
ratingStars.forEach(o => {
  const isOn = parseInt(o.dataset.r,10) <= parseInt(b.dataset.r,10);
  o.classList.toggle('active', isOn);
  o.setAttribute('aria-checked', isOn ? 'true' : 'false');
});
```

### FAIL 4d (Serious) — `<select>` placeholder option is selectable (line 680)
```html
<option>— pick one —</option>
```
Should be disabled + valueless:
```html
<option value="" disabled selected>— pick one —</option>
```

### FAIL 4e (Moderate) — HR slider lacks associated label + ARIA value text (line 493)
The visual `<label>` (line 492) is not associated via `for=`, and the slider has no `aria-valuetext` for screen readers.

**Fix:**
```html
<label for="hrSlider"><span>Simulated heart rate</span><span id="hrVal">72 BPM</span></label>
<input type="range" min="45" max="110" value="72" class="hr-slider" id="hrSlider"
       aria-valuemin="45" aria-valuemax="110" aria-valuenow="72"
       aria-valuetext="72 beats per minute" />
```
And update `updateHR()` (line 879) to set `hrSlider.setAttribute('aria-valuenow', bpm); hrSlider.setAttribute('aria-valuetext', bpm + ' beats per minute');`.

---

## 5. Alt Text on Images — PASS (with caveats)

No `<img>` tags exist. All visuals are inline `<svg>` or CSS.

### PASS — Decorative SVG hidden correctly
- Line 285: `aria-hidden="true"` on `.hr-orb` ✓
- Line 398: `aria-label="Closed loop diagram"` ✓
- Line 572: `aria-label="On-device privacy diagram"` ✓

### Moderate caveat — Add explicit `role="img"` + richer descriptions
Most modern screen readers infer `role="img"` from `aria-label` on SVG, but explicit is safer. Also, the labels are terse — sighted users see a labelled flowchart; SR users get one phrase.

**Fix (line 398):**
```html
<svg class="loop-svg" role="img"
     aria-label="Closed-loop diagram: nervous system → AirPods sensors → on-device prompt → Lyria RealTime → Apple spatial engine → ears. Full revolution every two seconds."
     viewBox="0 0 700 360">
```

**Fix (line 572):**
```html
<svg class="privacy-svg" role="img"
     aria-label="On-device privacy diagram: RESONATE runs locally on iPhone. Lyria audio stream is the only outbound connection. No analytics, no HRV upload, no session sync to cloud."
     viewBox="0 0 560 280">
```

---

## 6. Keyboard Navigability & Focus Visible — FAIL (Critical)

### FAIL 6a (Critical) — Global focus outline removed without replacement (line 64)
```css
input:focus,textarea:focus,select:focus { outline:none; border-color:var(--gold); }
```
Border colour change is visible on form fields, but **no `:focus-visible` is defined anywhere** for `.btn`, `.btn-ghost`, `.btn-primary`, `.footer-link`, `.faq-item summary`, `.rating-stars button`, `.sign-in`, anchor links, or the brand link. Default browser focus rings are suppressed by the design system and never replaced. Violates 2.4.7 Focus Visible.

**Fix (add to stylesheet, e.g. after line 67):**
```css
a:focus-visible,
button:focus-visible,
.btn:focus-visible,
.sign-in:focus-visible,
.rating-stars button:focus-visible,
.footer-link:focus-visible {
  outline: 2px solid var(--gold-bright);
  outline-offset: 3px;
  border-radius: 2px;
}
.faq-item summary:focus-visible {
  outline: 2px solid var(--gold-bright);
  outline-offset: -2px;
}
input:focus-visible, textarea:focus-visible, select:focus-visible {
  outline: 2px solid var(--gold-bright);
  outline-offset: 2px;
}
```

### FAIL 6b (Critical) — "SIGN IN" button is non-functional (line 277)
A `<button>` with no click handler. Appears interactive, does nothing. Confusing for keyboard + screen reader users. Fails 4.1.2 Name/Role/Value (purpose unclear) and 2.4.4 Link Purpose.

**Fix:** Either link to a destination or remove:
```html
<a class="sign-in" href="/signin">Sign In</a>
```
or remove the element entirely until sign-in exists.

### Tab order — PASS
Source order matches visual order. No `tabindex` overrides. `<details>` summaries and form fields are natively keyboard-accessible.

---

## 7. ARIA Landmarks — FAIL (Moderate)

### FAIL 7a (Moderate) — No `<main>` element
The page has `<header>`, multiple `<section>`s, and `<footer>` but **no `<main>`** wrapping content. Screen readers cannot skip to main content. Skip-link (check 9) also depends on this.

**Fix:** Wrap all `<section>` elements (lines 281-769) in `<main id="main">…</main>`.

### FAIL 7b (Moderate) — Header uses `<div class="nav">` not `<nav>` (lines 273-279)
The breadcrumb-style nav row is a plain `<div>`. No landmark role.

**Fix (line 274):**
```html
<nav class="nav" aria-label="Primary">
  ...
</nav>
```

### FAIL 7c (Moderate) — Footer link clusters not in `<nav>` (lines 780, 786, 794)
Three discrete link groups (Find Jamie, On this page, The family) lack nav semantics.

**Fix:** Wrap each cluster in `<nav aria-label="Footer · Find Jamie">`, `<nav aria-label="Footer · On this page">`, `<nav aria-label="Footer · The RHYTHMIX family">`.

### PASS — `<header>` and `<footer>` elements present (lines 273, 772).

---

## 8. `prefers-reduced-motion` Handling — PASS

Lines 265-268:
```css
@media (prefers-reduced-motion: reduce) {
  *,*::before,*::after { animation:none !important; transition:none !important; }
  .reveal { opacity:1; transform:none; }
}
```
Correctly disables HR orb pulse, halo cycle, loop arrow dash, reveal-on-scroll, FAQ summary rotation, all button hover transitions. **Satisfies 2.3.3 Animation from Interactions.** Comprehensive.

---

## 9. Skip-to-Content Link — FAIL (Serious)

### FAIL 9 (Serious) — No skip link exists
Keyboard users must tab through the entire sticky header on every visit. Violates 2.4.1 Bypass Blocks.

**Fix (insert immediately after `<body>` on line 272):**
```html
<a href="#main" class="skip-link">Skip to main content</a>
```
And add CSS:
```css
.skip-link {
  position:absolute; top:-100px; left:0;
  background:var(--gold); color:var(--bg);
  padding:0.85em 1.4em;
  font-family:var(--mono); font-size:0.75rem;
  letter-spacing:0.2em; text-transform:uppercase;
  z-index:100; border-radius:0 0 4px 0;
  transition: top 0.2s ease;
}
.skip-link:focus { top:0; }
```
Depends on check 7a (`<main id="main">`).

---

## 10. `<html lang>` Attribute — PASS

Line 2: `<html lang="en">` ✓ Satisfies 3.1.1 Language of Page.

---

## Priority Remediation Order

1. **Critical (fix before launch):**
   - Add form `<label for=>` associations (4a, 4b, 4e)
   - Add `role="radiogroup"` + per-button `aria-label`/`aria-checked` on rating stars (4c)
   - Add `:focus-visible` styling for all interactive elements (6a)
   - Fix or remove non-functional Sign In button (6b)
   - Add `<main>` landmark + skip-link (7a, 9)

2. **Serious:**
   - Raise `--text-3` to `#8A92A3` (2a)
   - Replace `--gold-dim` body-text usage with full `--gold` (2b)
   - Enlarge `.sign-in`, `.rating-stars button`, `.hr-slider` thumb to ≥44px (3a, 3b, 3c)
   - Disable `<select>` placeholder option (4d)

3. **Moderate:**
   - Increase comparison-table sub-caption text size (2c)
   - Brighten or hide red/grey dots in comparison table (2d)
   - Add `role="img"` + richer descriptions to inline SVGs (5)
   - Wrap header + footer link clusters in `<nav>` (7b, 7c)
   - Bump `.btn-sm` height to 44px (3d)

## Files Referenced
- `/home/user/jamie-wigg/resonate.html` (audit subject — **unmodified**)
