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
| 2 | **Readability guard** in test harness | — | WCAG contrast lint so no redesign can ship light-on-light text | ⏳ |
| 3 | **Buddy family** | 50 | redesign the buddy template → propagate → test sample | ⏳ |
| 4 | **Nutrition family** | 45 | redesign the food template → propagate → test sample | ⏳ |
| 5 | **Premium standalones** (BookReader, MathTutor, FitCoach, CodeMentor, NutriAI, StoryStudio, VoiceJournal) | 7 | per-app polish to the bar (already carousels) | ⏳ |
| 6 | **Full suite green** + APKs rebuilt | — | `--all` tests + Android matrix | ⏳ |

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
