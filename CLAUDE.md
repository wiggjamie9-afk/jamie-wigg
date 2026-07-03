# CLAUDE.md — Jamie's Brain

This is the single source of truth Claude reads at the start of **every session**.
It persists in git, so Jamie never has to repeat himself. Keep it clean. When Jamie
says "remember this," it goes in the Memory Log at the bottom.

> Full technical reference for this repo (all the tool/MCP/pipeline detail) lives in
> `docs/CLAUDE-full-reference.md`. Claude reads that only when it actually needs repo
> specifics — it's not loaded by default so this brain stays focused.

---

## ⭐ Jamie's Rules — obey these, always

If any rule below conflicts with a default or habit, **this wins.**

1. **Never spend money or credits without asking first.** Image gen, video gen, paid
   APIs — anything billable — STOP and get an explicit "yes." Never fire a paid
   action just to prove it works.
2. **No setup runarounds.** Don't send Jamie off to install, plug in, pull, or
   configure. If something genuinely can't be done here, say so in one plain sentence
   and stop. No checklists.
3. **Do exactly what was asked.** No side-quests, no "while I'm here" extras.
4. **Be honest about limits up front.** Claude Code is a coding tool — it has no free
   built-in image/video generation. Say what's actually possible *before* acting.
5. **Keep Jamie focused.** If he's drifting or looping, name the one goal and give the
   single next step. Short. Concrete.
6. **Remember, don't re-ask.** Anything here — rules or Memory Log — is already known.
   Don't make him say it twice.

**Tone:** direct, no fluff, no over-apologising, no walls of text. Answer + next step.

---

## Who Jamie is & what he's building

- **Focus:** creating things — images, videos, and working apps/sites — with the
  *least possible setup and friction*. Keep him pointed at the output, not the plumbing.
- **Main project:** RHYTHMIX — an AI music platform — plus its promo videos and
  marketing site (live at `rhythmixapp.com.au`).
- **Setup reality:** Jamie works from an iPhone / no desktop, through the cloud. This
  sandbox is ephemeral and blocks a lot of outbound network, so many "just run it"
  tools fail here. Be upfront about that instead of looping.

*(Tell me more about your goals any time and I'll add them here.)*

---

## What's actually in this repo (plain map)

| Where | What it is |
|---|---|
| `studio/` | STARLIGHTMIX Studio — the main web app (Next.js). |
| `rhythmix-*/` | Promo video folders (HyperFrames HTML → MP4). |
| `apps/` | Small standalone web apps and prototypes. |
| `livestock/` (HerdCheck), `recovery/` (Reset) | Standalone PWAs. |
| `sites/` | Generated landing pages / microsites. |
| root `*.html` | The live marketing site pages. |
| `docs/` | Reference docs, incl. the full technical reference. |

That's the 90% you'll ever care about. The rest is supporting assets.

---

## Making images / videos — the honest truth

Claude can't generate these for free. Every route needs a paid account and/or open
network, and in this sandbox most are blocked. So before any generation: **say what's
possible, name the cost, and wait for a yes.** Never surprise-spend.

- **Images/videos via a paid service** (e.g. Higgsfield) — works, but costs credits.
  Only with explicit go-ahead.
- **RHYTHMIX promos** — built as code (HyperFrames), rendered to MP4. No per-image
  cost, but it's a build, not instant.

If Jamie just wants "type it, get a video, no hoops," the honest answer is a purpose-
built consumer app (Sora, Runway, Kling, Higgsfield's own app) — say so plainly.

---

## Memory Log — things Jamie told me to remember

*Newest at the top. Jamie can also start any message with `#` to add a memory.*

- **2026-07-03 (app-store plan)** — Goal: turn Jamie's work into an AI business, first move = ship
  **one app to a store**. Decided app = **HerdCheck** (`livestock/`, a finished offline PWA).
  Status of the two stores:
  - **Google Play** — Jamie is registered, but publishing is **blocked** at account verification:
    it requires signing into the Play Console app on a *physical Android device*, which Jamie
    doesn't have (iPhone only). Parked unless he gets Android access.
  - **Apple App Store** — Jamie is registered AND **has access to a Mac** (doing it there next).
    This is the live path. Note: creating the iOS signing certificate needs a CSR generated from
    the Mac's Keychain — do that on the Mac, not the iPhone.
  What's already prepared and committed (ready to use): `livestock/play-store/LISTING.md`
  (paste-ready store listing, works for Apple too), `livestock/privacy.html` (hosted privacy
  policy). Still to do: get HerdCheck live on the public site, then build the signed app (PWA →
  store; a cloud build service handles signing so Jamie never hand-makes certificates again).
  Reminder to self: Jamie was thrashing between Apple/Google setup screens — keep him on the ONE
  path (Apple, via Mac) and don't let it sprawl.

- **2026-07-03** — Set up this brain. Jamie was fed up with repeating himself and with
  being sent on setup runarounds and surprise credit spends. Core ask: one clean,
  persistent memory + stay focused on his actual work (making images/videos/apps with
  minimal friction). Actual work in progress before this: a ZenMux/Gemini MCP
  integration on branch `claude/gemini-api-integration-4besxp` (built + pushed, not
  yet merged).
