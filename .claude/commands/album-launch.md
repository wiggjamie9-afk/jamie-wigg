---
description: Orchestrate a full RHYTHMIX-style album/single launch — cover art, song, 60s video promo, and landing-page section — in parallel.
argument-hint: <theme or vibe of the launch> (e.g., "summer night driving synthwave single called Echo")
---

The user wants a complete launch package for:

> $ARGUMENTS

This is multi-agent work. Use the `Agent` tool to fan out into FOUR parallel sub-agents (general-purpose), each responsible for one deliverable. Send them in a SINGLE message with multiple tool uses so they run truly in parallel.

**Step 1 — Parse the brief** into a single-paragraph creative direction. Pull out: artist/title, genre, mood, color/visual cues. If the brief is too sparse, ask ONE consolidated clarifying question before fanning out.

**Step 2 — Spawn four agents in parallel:**

### Agent A — Cover Art
> Generate album cover art via the `replicate_image` MCP tool. Aspect ratio 1:1, prompt should be a richly detailed scene description matching the brief's mood and genre. Save filename `<slug>-cover.png` in `creative-out/`. Report the file path.

### Agent B — Music Track
> Generate an instrumental track via the `replicate_music` MCP tool. Duration 20s (the Replicate MusicGen cap is 30s; pick a length that fits "preview"). Prompt should describe instrumentation, tempo, and mood matching the brief. Save filename `<slug>-track.wav`. Report the file path.

### Agent C — 60s Video Promo
> Author a HyperFrames video for the launch. Use the `rhythmix-author` skill as the template — adapt the 5-scene pattern to the launch (hook, the song name as wordmark reveal, three feature beats, audience, CTA). Use `<slug>-track.wav` as the audio bed if it's ready in time, otherwise use existing `voiceover-emma.wav` and overlay the music later. Render to `rhythmix-launch-<slug>/rhythmix-launch-<slug>.mp4`. Report the path.

### Agent D — Landing Page Section
> Write a single self-contained HTML section (no external dependencies beyond what's already in `rhythmix.html`) for the launch: title, song name, hero image placeholder linking to the generated cover, embedded `<audio>` element pointing at the track, embedded `<video>` linking to the promo, and a CTA button. Match the existing palette and motion conventions from `rhythmix-teaser-60s/DESIGN.md`. Save as `launch-<slug>.html` at the repo root. Report the path.

**Step 3 — Wait for all four** agents to return. If any failed, report the failure clearly with the partial outputs available — do NOT attempt to silently retry.

**Step 4 — Present the bundle** to the user:
- A path manifest of all four artifacts
- A one-paragraph "what got made" summary
- Three explicit next-step options:
  1. Add a row to `downloads.html` so the bundle is shareable on iPhone
  2. Commit and push to the branch
  3. Iterate on one specific piece (which?)

**Hard rules:**
- Never commit or push automatically. Wait for user approval.
- If `replicate_*` or `elevenlabs_*` tools are not available, stop immediately and tell the user the MCP server isn't installed — point at `.claude/mcp/creative-stack/README.md`.
- Each agent works in the same repo cwd; they may write to different paths but should not overwrite each other's outputs.
- Slug should be lowercase-hyphenated, derived from the brief (e.g. "echo-summer-night-synthwave" → "echo-summer-night").
