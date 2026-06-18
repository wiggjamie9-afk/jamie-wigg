# Roadmap — bringing the whole ecosystem to "Owed-grade"

**Definition of done:** every shipping app is (a) carousel-style, (b) passes
functional + swipe tests, (c) at the `frontend-design` quality bar demonstrated
by `apps/owed.html` — distinctive, readable, premium — not generic.

**Honest constraint:** this sandbox blocks the headless browser, so I can't take
screenshots. I verify with automated gates (parses, no JS errors, swipe works,
localStorage works, **readability/contrast lint**) — but the final pixel check
is on your phone/Mac. I'll redesign at the **template level** (one careful design
per family) so quality is reasoned once, not blindly cloned 95 times.

## Order of work

| # | Target | Count | Approach | Status |
|---|--------|-------|----------|--------|
| 1 | **Owed** (flagship) | 1 | bespoke `frontend-design` pass | ✅ done |
| 2 | **Readability guard** in test harness | — | WCAG contrast lint (CI gate) — caught & fixed 6 real invisible-text bugs | ✅ done |
| 3 | **Buddy family** | 50 | redesign buddy template → propagate → gate | ⏸ **needs your eyeball first** (see note) |
| 4 | **Nutrition family** | 45 | redesign food template → propagate → gate | ⏸ needs eyeball |
| 5 | **Premium standalones** (BookReader, MathTutor, FitCoach, CodeMentor, NutriAI, StoryStudio, VoiceJournal) | 7 | already cohesive carousels — light polish only if you want | ⏸ optional |
| 6 | **Full suite green** + APKs rebuilt | — | `--all` tests + Android matrix | ✅ green |

### Note on steps 3–4 (important)
The 50 buddy + 45 food apps are currently a **dark theme patched onto a light
background** (translucent cards + corrective/contrast layers). They are
**readable, functional, carousel, and pass all gates** — but the design is a
patch, not bespoke. A true redesign is a large multi-screen CSS rewrite, and
**this sandbox can't render a browser**, so I can't verify the *look* — only
behaviour/contrast. Pushing a blind redesign across 95 apps right before you
review them risks regressing your whole portfolio invisibly.

**Recommended path:** eyeball the redesigned **Owed** (the reference) on your
phone. If you like the bar, say "redesign the buddies" and I'll do buddy-1 as a
reviewable reference, you approve it, then I propagate to all 50 (then food).
That keeps the aesthetic decision in your hands while I do the mechanical work.

## Guardrails on every step
- Keep ALL element IDs, `onclick` handlers, screen/carousel structure, and
  localStorage logic byte-for-byte — visual layer only.
- Re-run `node test-harness/run.mjs --all` after each family; must stay 100%.
- Commit + push after each family (container is ephemeral).
- No fabricated metrics/testimonials in any copy.

## What needs YOU (not blockers to the above)
- "merge to main" → everything goes live on rhythmixapp.com.au
- Gumroad/Stripe link + Formspree endpoint → Owed earns money
- Apple/Google dev accounts → app-store listings
