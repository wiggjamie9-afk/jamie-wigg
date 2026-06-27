# Apps Inventory & Triage

_Every app in this repo, organized by how close it is to being a real, shippable product.
The point isn't to keep them all — it's to SEE them so you can pick what to ship.
Generated 2026-06-27._

## The honest headline
**~100+ app artifacts. Roughly 4 are close to shippable. The rest are prototypes and ideas.**
That's not a criticism — it's a library of proven ability. But you can't ship 100 things. The job
now is to **pick 1–2 from Tier 1/2, ship them, ignore the rest.**

---

## 🟢 Tier 1 — Real products (substantial: own dir, PWA, or native wrapper)
These are the only ones close to "could ship / charge for" today.

| App | What it is | iOS-ready? | Status |
|---|---|---|---|
| **STARLIGHTMIX Studio** (`studio/`) | Next.js 15 AI music-video web app + Cloudflare Workers | ✅ `capacitor/` wrapper exists | Most built — has license worker, deploy pipeline |
| **Reset** (`recovery/` + `recovery-ios/`) | iOS-style recovery/wellness PWA for team sport | ✅ `recovery-ios/` Capacitor + Codemagic CI | **Closest to App Store** — already wired for iOS build |
| **HerdCheck** (`livestock/`) | Offline livestock-screening PWA (lameness/mastitis/calving) | ⚠️ PWA only | Full PWA, real niche, but hard-to-pay customers |
| **Roomtone** (`apps/roomtone/`) | Ambient-sound PWA | ⚠️ PWA only | Complete PWA w/ service worker |

## 🟡 Tier 2 — Concepts with a business case (Untapped portfolio)
Each has a demo + landing page + 1-page business case. More than prototypes, not yet products.
`apps/untapped/`: **TYMPAN, HERD, AXLE, DOCKET, LULL, PLUMB, RACK, SOLE, SPOT, STACK** (10).
→ These are your best-thought-out *ideas*. If one matches a pain you'll pursue, it's a head start.

## 🟠 Tier 3 — Codename sub-apps (PWA-ish prototypes)
`apps/`: focus, trim, readout, macro, glow, hype, lapse, drift, pulse, scan, zips, vault, dreams,
hum, live, resonate (~16). Several have manifests. **Prototypes — keep as reference.**

## 🔵 Tier 4 — Micro-app HTML prototypes (~50, single-file)
calorie-counter, budget-tracker, period-tracker, expense-tracker, habit-streak, pomodoro-timer,
medicine-companion, mood-journal, study-planner, loan-calculator, meditation-guide, NutriAI,
CodeMentor, StoryStudio, VoiceJournal, fitcoach-pro, languagelens, meetingmind, smartgrocery …
**A swatch book of ideas, not businesses.** Great for "what could I build" — not for shipping all.

## 🟣 Tier 5 — Buddy System (59 files)
`apps/buddy-*.html` + builder + marketplace + ecosystem engine. **One big AI-companion experiment.**
Ambitious, but broad consumer AI companions = the brutal market (vs Character.AI/Replika). Treat as
R&D, not a launch.

---

## Recommendation (pelican)
1. **iOS / App Store:** your two real shots are **Reset** (`recovery-ios/`, already Codemagic-wired)
   and **Studio** (`capacitor/`). If "organize + ship to the App Store" is the goal, **pick ONE of
   these** — Reset is closest.
2. **Everything in Tier 3–5 is a prototype library.** Don't delete it (it's proof of skill + an idea
   bank) — but **stop treating it as 100 unfinished products.** It's one folder of experiments.
3. **The move:** choose one Tier-1 app to actually finish + submit, OR one Tier-2 concept to build
   into a real product. Then archive the rest mentally and move on.

## Optional next step (not done yet — needs your OK)
I can **physically reorganize** the repo so this map is real on disk:
- `apps/_archive/buddy-system/` ← the 59 buddy files
- `apps/_archive/prototypes/` ← the ~50 single-file micro-apps
- `apps/_archive/codename/` ← the Tier-3 sub-apps
- Keep Tier 1/2 + active work at the top level.
This is reversible (git), but it moves ~120 files — say the word and I'll do it carefully.
