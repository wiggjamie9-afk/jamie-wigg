# App Factory 2026 — State-of-the-Art Apple + Google Apps

NEXUS's pipeline for building production-grade mobile apps for **Apple (iOS/iPadOS)** and **Google (Android)** in 2026 design language. Grounded in the infra already in this repo (Capacitor wrappers, Codemagic iOS builds, Next.js static export, PWAs) plus the `apple-hig-expert` and `frontend-design` skills.

Invoke via `/nexus build me an app that does X` — NEXUS runs this pipeline.

## What "State-of-the-Art, 2026 Style" Means

| Platform | 2026 Design Language | Key signals |
|---|---|---|
| **Apple** | **Liquid Glass** (iOS 26+) | Translucent, depth-layered surfaces; real-time blur/refraction; adaptive light/dark; fluid spring physics; concentric corner radii; SF Symbols 7 with animation; Dynamic Island integration |
| **Google** | **Material 3 Expressive** | Bold emphasized type scale; dynamic color (Material You) from wallpaper/brand; large rounded "pill" shapes; spatial/springy motion; adaptive layouts for foldables; edge-to-edge |
| **Cross-platform web** | **Modern web platform** | View Transitions API, scroll-driven animations, container queries, `:has()`, CSS nesting, popover API, color-mix, fluid type with `clamp()` |

Principle: **respect each platform's native feel** — don't ship an iOS app that looks like Android or vice versa. Adapt the same product to each design language rather than forcing one look everywhere.

## Three Build Paths (NEXUS picks by need)

### Path A — Capacitor Hybrid (default, fastest to both stores)
Web app (Next.js / React / PWA) wrapped natively. **This repo already does this** (`capacitor/` wraps Studio, `recovery-ios/` wraps Reset).

- **Best for**: content apps, tools, dashboards, most digital products
- **One codebase → both stores** + web
- **Native APIs** via Capacitor plugins (camera, push, filesystem, haptics, biometrics)
- iOS build via **Codemagic** (`codemagic.yaml` already configured); Android via Gradle/Capacitor
- Design fidelity: use platform-adaptive components (Konsta UI / Ionic for iOS+Material skins, or hand-rolled with `frontend-design`)

### Path B — PWA (zero store friction)
Installable web app, offline-first. **This repo already ships these** (HerdCheck `livestock/`, Reset `recovery/`, Roomtone `apps/roomtone/`).

- **Best for**: instant distribution, no store review, rapid iteration
- Service worker + manifest + offline cache + install prompt
- Can later be wrapped (Path A) for store presence
- Apple install via Safari "Add to Home Screen"; Google via install banner / TWA

### Path C — Native (max fidelity, when it must be)
SwiftUI (Apple) + Jetpack Compose (Android). Only when the app needs deep native performance/UX that hybrid can't match (heavy 3D, real-time audio DSP, ARKit).

- **Best for**: games (pair with `game-designer` agent), pro audio/video tools, AR
- Two codebases; highest cost; reach for only when justified
- NEXUS scaffolds with `apple-hig-expert` for SwiftUI + Liquid Glass guidance

## The Pipeline (every app build)

```
1. SPEC      /spec-quick → requirements + design + tasks
             (or /rhythmix-spec for RHYTHMIX-branded apps)
2. DESIGN    apple-hig-expert (iOS/Liquid Glass) + frontend-design (UI)
             + Material 3 Expressive for Android variant
             Optional: Framelink MCP to pull a Figma design straight to code
3. BUILD     Path A/B/C scaffold → implement screens → wire navigation
             → animations/transitions → responsive across phone/tablet/fold
4. VERIFY    /verification-before-completion + run/verify skills
             lint + type-check + tests; preview in browser/simulator
5. PACKAGE   Capacitor sync → iOS (Codemagic) + Android (Gradle) builds
             PWA: manifest + service worker validated
6. SHIP      You do the signed store upload (Apple App Store Connect /
             Google Play Console). NEXUS produces the build + assets +
             store listing copy (via copywriter/aso) and hands you the last mile.
```

## Recommended 2026 Stack

| Layer | Choice | Why |
|---|---|---|
| **Framework** | Next.js 15 (App Router, static export) or Vite + React 19 | Already the Studio stack; static export wraps cleanly in Capacitor |
| **Language** | TypeScript 5.9 | Repo standard |
| **Styling** | Tailwind v4 + CSS platform tokens | Repo standard; design tokens per platform |
| **Native shell** | Capacitor 6 | Already in `capacitor/` + `recovery-ios/` |
| **iOS components** | Konsta UI / Ionic iOS theme, or custom Liquid Glass | Platform-adaptive |
| **Android components** | Material 3 (M3) components | Material 3 Expressive |
| **Motion** | GSAP (repo has `gsap` skill) + View Transitions API + native spring | Fluid 2026 motion |
| **State/data** | localStorage + IndexedDB (offline-first), no server unless needed | Matches Studio's no-server-storage ethos |
| **iOS CI** | Codemagic (`codemagic.yaml`) | Already configured |
| **Icons** | SF Symbols 7 (iOS) / Material Symbols (Android) | Native, animatable |

## 2026 Polish Checklist (NEXUS applies)

- [ ] **Adaptive theming** — light/dark + dynamic color; respects system
- [ ] **Liquid Glass surfaces** (iOS) — translucency, blur, depth layering
- [ ] **Material 3 Expressive** (Android) — emphasized type, dynamic color, pill shapes
- [ ] **Fluid motion** — spring physics, View Transitions between routes, no janky cuts
- [ ] **Responsive** — phone, tablet/iPad, foldables; safe-area insets; edge-to-edge
- [ ] **Haptics** — Capacitor Haptics on key interactions (iOS + Android)
- [ ] **Offline-first** — service worker / IndexedDB; works with no network
- [ ] **Accessibility** — Dynamic Type, contrast, VoiceOver/TalkBack labels, reduced-motion
- [ ] **Performance** — 60fps, lazy loading, code-split, <2s cold start
- [ ] **App icons + splash** — full asset set both platforms; adaptive icon (Android)
- [ ] **Store assets** — screenshots, listing copy (ASO), privacy labels

## Sustainable Cadence & Anti-Spam (NEXUS enforces)

Build speed is **not** the bottleneck — store review, quality, and account safety are.
NEXUS optimizes each app to be *better*, not to flood the stores.

| Stage | Realistic throughput |
|---|---|
| Scaffold a working prototype (UI, functions, carousels, graphics) | 3–5/day |
| Polished + store-ready (real function, icons, screenshots, ASO, tested, differentiated) | 1 every 2–4 days; ~2–3/week sustainable |
| Actually selling | depends on quality + marketing, not build speed |

**⚠️ Account-ban risk — the rule NEXUS will not break:**
- **Apple Guideline 4.3 (Spam)** and **Google "repetitive content"** policy target
  developers who ship template-farm / near-identical apps. Penalty is loss of the
  **entire developer account** — every app removed at once.
- **NEXUS will refuse to mass-produce lookalike apps** and will warn if a request
  looks like reskinning the same app. Each shipped app must be genuinely distinct
  (different problem, audience, design, function).

**Recommended cadence:**
- **Weeks 1–4:** 1 genuinely good, distinct app per week — build account reputation.
- **After a track record + reusable template system:** 2–3 polished apps/week ceiling.
- **Never** batch-submit near-identical apps from one account.

> 100 shovelware apps = $0 and a banned account.
> 10 genuinely useful, well-designed apps = real, compounding revenue.

## Honest Limits (NEXUS will tell you these)

- **Final store submission is yours** — NEXUS builds, packages, and writes the listing, but the **signed upload** to App Store Connect / Play Console needs your Apple Developer ($99/yr) and Google Play ($25 one-time) accounts and signing identity. NEXUS can't push to the stores for you.
- **iOS builds need macOS** — Codemagic handles this in CI (mac_mini_m2); local builds need your Mac + Xcode.
- **Native (Path C)** is higher cost — NEXUS will recommend hybrid (Path A) unless the app genuinely needs native.
- **Device testing** — NEXUS previews in browser/simulator; real-device QA is on you (or the `qa-tester` agent for test plans).

## How NEXUS Routes an App Request

```
/nexus build a habit-tracker app for iPhone and Android, 2026 style
  → Route: App Factory, Path A (Capacitor hybrid)
  → /spec-quick habit-tracker → requirements/design/tasks
  → apple-hig-expert (Liquid Glass screens) + frontend-design (UI)
        + Material 3 Expressive Android variant
  → scaffold Next.js + Capacitor → implement screens → wire nav
        → GSAP + View Transitions → responsive + haptics + offline
  → verify (lint/type-check/tests, simulator preview)
  → Capacitor sync → Codemagic iOS build + Android Gradle build
  → store listing copy + screenshots
  → report: "Built. Here's the build + assets. You do the signed upload —
        want me to walk you through App Store Connect / Play Console?"
```

## Related in Repo

- **Existing apps to learn from**: `studio/` (Next.js→Capacitor), `livestock/` (PWA), `recovery/` + `recovery-ios/` (PWA + Capacitor + Codemagic), `apps/roomtone/` (PWA)
- **Skills**: `apple-hig-expert`, `frontend-design`, `/spec-quick`, `/site-build`, `gsap`, `run`, `verify`, `saas-scaffolder`
- **Agents**: `ecommerce-dev`, `game-designer`, `qa-tester`, `ux-researcher`, `thumbnail-designer` (store screenshots)
- **CI**: `codemagic.yaml` (iOS), `.github/workflows/` (web deploy)
- **Design source**: Framelink MCP (`framelink-mcp-figma.md`) for Figma→code

---

**Use Case for Ecosystem:** NEXUS's App Factory builds state-of-the-art iOS + Android apps in 2026 design language (Apple Liquid Glass + Google Material 3 Expressive). Three paths — Capacitor hybrid (default), PWA (zero store friction), native (max fidelity) — over a spec→design→build→verify→package→ship pipeline grounded in the repo's existing Capacitor/Codemagic/Next.js infra. NEXUS takes an app from idea to signed-build-ready; the final store upload stays with the user (their developer accounts + signing identity).
