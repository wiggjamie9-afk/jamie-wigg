# Bedtime Story YouTube Channel — Inventory, Guide & Roadmap

**Bottom line up front:** You don't need to *build* a bedtime-story channel. You already
built one. `kids-channel/` is a complete, automated, end-to-end pipeline
("Sonny's Cozy Quokka Bedtime Tales") that writes scripts, narrates them, paints
watercolour scenes, scores them with lullaby music, assembles an MP4, makes a
thumbnail + PDF picture book, and uploads to YouTube — three times a day, on a
GitHub Actions cron. There's a second channel scaffold too ("Glowworm").

So the real task is **switch it on and fix ~4 things**, not "acquire tools." This
doc orders everything you've assembled, maps it to the bedtime pipeline, and gives
you the launch roadmap.

---

## 1. Inventory — the stack you've assembled (ordered by role in the pipeline)

Every stage of a bedtime-story video is already covered, usually with 3–6 fallbacks.

| Pipeline stage | Primary tool (installed) | Fallbacks (installed) | Where it lives |
|---|---|---|---|
| **1. Story script** | Claude (Anthropic API, Haiku) | StepFun Flash MCP (`flash_script`, `flash_episode_brief`); Pollinations text | `.mcp.json` → `stepfun`; `pipeline.py` |
| **2. Narration (calm voice)** | ElevenLabs (`creative-stack` MCP) | Piper TTS (offline), Kokoro TTS, Voicebox (local clone), Higgsfield `create_voice`, Pollinations TTS | `creative-stack`, `KOKORO-SETUP.md`, `VOICEBOX-SETUP.md` |
| **3. Scene art (character-consistent)** | Higgsfield Soul + FLUX Kontext char-ref | FLUX Dev, FAL FLUX Schnell, Pollinations FLUX, Pexels/Pixabay stock, PIL procedural | `higgsfield` MCP, `creative-stack`, `pipeline.py` |
| **4. Animate scenes (optional)** | Higgsfield DOP (image→video) | HunyuanVideo (Replicate), ffmpeg gradient pans | `higgsfield`, `creative-stack` |
| **5. Background music** | Pixabay royalty-free lullabies | MusicGen (Replicate), ffmpeg pentatonic tones, PicsArt music | `pipeline.py`, `creative-stack` |
| **6. Video assembly** | ffmpeg (in `pipeline.py` + CI) | HyperFrames (for promos/shorts) | `pipeline.py`, devcontainer |
| **7. Thumbnail** | Cover-crop of scene 1 + title band | `thumbnail-designer` agent, `render-thumbnails.mjs` | `pipeline.py` |
| **8. Picture-book PDF** | Built into pipeline (1 page/scene) | — | `pipeline.py` → `ebook.pdf` |
| **9. SEO (title/desc/tags)** | Generated in `script.json` | `youtube-seo`, `seo-writer` agents | `pipeline.py` |
| **10. Upload + schedule** | YouTube Data API (OAuth) | Manual upload; Zapier (dormant) | `youtube_auth.py`, GitHub Actions cron |
| **11. Channel branding** | `generate_channel_art.py` (banner + art) | Canva MCP, `brand-designer` agent | `kids-channel/channel-art.png` |

**MCP servers wired in `.mcp.json`:** `stepfun`, `creative-stack` (Replicate +
ElevenLabs), `higgsfield`, `pollinations`, `playwright`, `claude-playwright`,
`context7`. Plus deferred connectors available this session: Canva, Gamma, HeyGen
HyperFrames, PicsArt, Hugging Face, Zapier (YouTube via 9,000-app bridge).

**Relevant skills/agents:** `rhythmix-author`, `dream`, `album-launch`,
`higgsfield-to-hyperframes`, `replicate`, `hyperframes*`, plus FleetView agents
`video-scripter`, `storyboard-writer`, `book-writer`, `thumbnail-designer`,
`youtube-seo`, `music-producer`, `short-form-video`.

> Note: the bulk of `.claude/skills/` (hundreds of `analyzing-*`, `detecting-*`,
> `exploiting-*` entries) are synced **cybersecurity** skills — irrelevant to this
> channel. Ignore them; they're not part of the creative stack.

---

## 2. What's already built (the existing channel)

`kids-channel/` — **"Sonny's Cozy Quokka Bedtime Tales"** (toddlers, ages 1–5):

- **`pipeline.py`** (~2,500 lines) — the whole production line, with graceful
  fallbacks at every stage so it never hard-fails.
- **`youtube_auth.py`** — one-time OAuth flow for upload tokens.
- **86 pre-written scripts** in `scripts/`; **59 still queued** in `queue.txt`
  (≈3 weeks of daily content remaining, ~3 months if you refill).
- **149 episodes** already have `script.json` + `ebook.pdf` generated.
- **GitHub Actions automation** (`little-sunny-episode.yml`): 3 episodes/day at
  7am / 1pm / 7pm AEST, with a `dry_run` toggle and manual `workflow_dispatch`.
- **Format:** 6 scenes, ~55 seconds, watercolour (Beatrix Potter aesthetic),
  ElevenLabs narration, lullaby music — output as `final.mp4` + thumbnail + PDF.
- A **second channel scaffold** exists (`glowworm.yml`, `run-glowworm-episode.yml`)
  and a `MULTI_CHANNEL_ROLLOUT_TEMPLATE.md` for cloning the pipeline to 5+ channels.

You also have supporting docs already in the repo: `YOUTUBE_MONETIZATION_ROADMAP.md`,
`MONETIZATION_SETUP.md`, `MULTI_CHANNEL_ROLLOUT_TEMPLATE.md`.

---

## 3. Gap analysis — what to actually fix (in priority order)

Everything below is a fix/decision, **not** a missing tool.

### 🔴 Blockers (do these first)
1. **YouTube OAuth tokens need refreshing.** `SUNNY.md` flags
   `YOUTUBE_ACCESS_TOKEN` and `YOUTUBE_REFRESH_TOKEN` as "⚠️ Needs refresh."
   Until refreshed, the pipeline produces videos but **can't upload**.
   → Run `python kids-channel/youtube_auth.py` locally, paste both tokens into
   GitHub Secrets. (There's also a `refresh-youtube-token.yml` workflow.)
2. **Character reference not committed.** `kids-channel/character/sonny-ref.jpg`
   doesn't exist yet, so FLUX Kontext can't lock Sonny's look — it falls back to
   drift-prone FLUX Dev and Sonny changes face between scenes/episodes.
   → Do one real (non-dry) run so the pipeline generates and commits the canonical
   portrait (fixed seed 7777), or generate it manually and commit it.

### 🟠 Quality (do before you promote the channel)
3. **Script writing is weak on the fallback path.** The sample episode reads:
   *"…found themselves in a peaceful place called sunny and the lullaby stars"* —
   the title slug is being injected literally. That's the **template fallback**
   firing because the Anthropic key was exhausted/unavailable at generate time.
   → Make sure `ANTHROPIC_API_KEY` has credit so the real Claude script path runs,
   and tighten `_build_prompt()` so the slug is never echoed verbatim.
4. **Length decision.** ~55s is *Shorts* length. Classic bedtime channels that
   monetize well run **10–60 min** (long sleep loops). Decide:
   - **A) Shorts factory** — keep ~55s, lean on Shorts volume/discovery, OR
   - **B) Long-form** — concatenate N scenes / loop ambient scenes to 10–45 min.
   The assembler is ffmpeg already; long-form is mostly a loop/duration change.

### 🟡 Nice-to-have
5. **Confirm CI actually rendered + uploaded.** No `final.mp4` exists locally
   (expected — CI builds them as artifacts), but verify a real run produced video
   and that the upload step succeeded (not just `--dry-run`).
6. **`OpenMontage/` music helper is referenced but absent.** The workflow guards
   it with `if [ -f OpenMontage/requirements.txt ]`, so it silently skips and uses
   ffmpeg tones. Fine as-is; add OpenMontage only if you want richer music.

---

## 4. Do you have everything you need? — Yes, with one asterisk

**You have 100% of the *creative* tooling** (script, voice, art, music, video,
thumbnail, PDF, branding) and the *automation* (CI cron + YouTube upload code).
Nothing creative is missing.

The only thing not fully "installed" is **a live, refreshed YouTube auth
connection** — and that's a credential refresh, not a tool you're missing.

### Things to "get from GitHub" / external (short, honest list)
None of these are required to launch — they're optional upgrades:

| Item | Why | Source |
|---|---|---|
| **YouTube tokens** (refresh) | Required to upload — credential, not code | Google Cloud Console → run `youtube_auth.py` |
| `OpenMontage` | Richer royalty-free music vs. ffmpeg tones | optional GitHub clone into `OpenMontage/` |
| Free stock keys (`PEXELS_API_KEY`, `PIXABAY_API_KEY`) | Better image/music fallbacks in CI | pexels.com / pixabay.com (free) |
| `FAL_KEY` | Cheap fast FLUX images (~$0.003/img) | fal.ai (optional) |
| YouTube/Zapier MCP connection | Pull analytics + auto-schedule from chat | Zapier MCP (dormant in `.mcp.json`) |
| OpenClaw `ai-video-editor-motion-graphics` | If you go long-form with motion graphics | `bash scripts/openclaw-install.sh` (needs open egress) |

---

## 5. Roadmap — from here to a live, growing channel

### Phase 0 — Switch it on (½ day)
- [ ] Refresh YouTube OAuth tokens → GitHub Secrets (blocker #1).
- [ ] Confirm `ANTHROPIC_API_KEY` + `ELEVENLABS_API_KEY` have credit.
- [ ] Run `little-sunny-episode.yml` with **Dry run ON** → inspect the artifact
      (video + thumbnail + PDF). Check narration tone, art consistency, captions.
- [ ] Commit the generated `character/sonny-ref.jpg` (blocker #2).

### Phase 1 — First real publishes (week 1)
- [ ] Run **Dry run OFF** for 1 episode → verify it lands on YouTube (unlisted
      first), check title/description/tags/thumbnail render correctly.
- [ ] Fix the script-quality fallback (gap #3) so narration reads naturally.
- [ ] Decide Shorts vs. long-form (gap #4). Set scene count / loop duration.
- [ ] Set channel basics: banner (`channel-art.png` exists), avatar, About,
      a "Bedtime Stories" playlist, kids/"Made for Kids" + COPPA settings.

### Phase 2 — Let the cron run (weeks 2–4)
- [ ] Leave the 3×/day cron running; watch retention + the first ~30 uploads.
- [ ] Refill the queue past 59 (regenerate scripts via Claude; aim for 90+ so you
      never run dry — the workflow errors on an empty queue).
- [ ] A/B a few thumbnails and the first 5 seconds (hook) for click + retention.

### Phase 3 — Optimise & expand (month 2+)
- [ ] Add long-form "sleep compilation" cuts (concatenate 10–20 episodes to 1hr)
      — these are the monetization workhorses for bedtime channels.
- [ ] Stand up channel #2 from `MULTI_CHANNEL_ROLLOUT_TEMPLATE.md` (Glowworm is
      already scaffolded) with a different character/biome.
- [ ] Wire YouTube analytics (Zapier/MCP) for a weekly performance digest.
- [ ] Monetization gate: 1,000 subs + 4,000 watch-hours (or 10M Shorts views).
      Use the PDF picture books as a lead magnet / Gumroad product (already built).

### Guardrails (important for a kids channel)
- **"Made for Kids" / COPPA** must be set correctly per video — non-negotiable.
- Keep music + stock **royalty-free** (pipeline already defaults to this).
- Avoid unverified claims/metrics in descriptions (repo `README.md` already flags
  some legacy promo MP4s as containing unverified metrics — don't reuse those).

---

## TL;DR
You asked whether you have everything to make a bedtime-story YouTube channel.
**You have more than everything — you have a finished, automated one.** Refresh the
YouTube tokens, commit the character reference, make sure the Claude script path
(not the template fallback) is running, pick Shorts vs. long-form, and press
**Run workflow**. Nothing creative needs to be acquired from GitHub.
