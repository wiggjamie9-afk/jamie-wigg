# NEXUS YouTube Ecosystem

NEXUS's end-to-end environment for building and running **YouTube channels** — from
channel concept through script, asset generation, video assembly, thumbnails, SEO,
publishing, repurposing, and analytics. This doc is the honest inventory of what the
ecosystem covers, where it's strong, and the **two real gaps** to plan around.

Invoke via `/nexus start a youtube channel about X` or `/nexus make a youtube video about Y`.

## The Full YouTube Pipeline — Stage → Capability

| Stage | What it is | Routed to | Status |
|---|---|---|---|
| **1. Channel concept** | Niche, name, positioning, audience | `product-strategist`, `competitive-teardown`, `geo-agent`, MindSearch/pi-perplexity for niche research | ✅ Strong |
| **2. Content strategy** | Series, calendar, hooks | `content-repurposer`, `news-curator`, `reddit-scout` (topic mining) | ✅ Strong |
| **3. Script & story** | Episode briefs, narration, shot lists | Step 3.7 Flash MCP (`flash_script`, `flash_episode_brief`), `video-scripter`, `storyboard-writer` | ✅ Strong |
| **4. Voice / narration** | TTS, voice cloning | Kokoro TTS, ElevenLabs (creative-stack), Voicebox (your "Jamie" clone), MiniMax MCP, NVIDIA PersonaPlex | ✅ Strong |
| **5. Music / SFX** | Background tracks, jingles | `music-producer` agent, MusicGen (Replicate), MiniMax MCP, Suno (Pollinations), `audio-producer` | ✅ Strong |
| **6. Images / graphics** | Backgrounds, key art, lower-thirds | Replicate (FLUX 1.1 Pro), KREA (illusion/brand), Higgsfield Soul, Pollinations, p5.js generative art | ✅ Strong |
| **7. AI video clips** | Generated footage, B-roll | SkyReels V1/V2/V3, HunyuanVideo (Replicate), Higgsfield DOP (image→video), video-gen MCP (`generate_video`, `motion_control`, `animation_actions`) | ✅ Strong (hosted/GPU) |
| **8. Talking-head / avatar** | Presenter, character on camera | SkyReels V3 talking avatar (audio→lip-sync ≤200s), Higgsfield talking-head, HeyGen | ✅ Good |
| **9. Motion graphics** | Animated text, transitions, intros/outros | HyperFrames (HTML/GSAP), `gsap` skill | ✅ Strong |
| **10. Explainer animation** | Math/diagram/data animation | KimiK2Manim (Manim) | ✅ Good (math/diagram) |
| **11. Video assembly / editing** | Timeline cut, trim, sequence, sync | ffmpeg (programmatic), video-gen MCP `personal_clipper` (long→shorts), `reframe` (aspect), `upscale_video` | ⚠️ **GAP — see below** |
| **12. Thumbnails** | Click-optimized cover art | `thumbnail-designer` agent, KREA, FLUX, canvas-design | ✅ Strong |
| **13. SEO / metadata** | Title, description, tags, chapters | `youtube-seo` agent | ✅ Strong |
| **14. Publishing** | Upload, schedule | Manual (you) or Zapier/n8n YouTube nodes | ⚠️ Needs your channel auth |
| **15. Shorts / repurposing** | Clip long→short, cross-post | `youtube-shorts-creator`, `short-form-video`, `tiktok-repurposer`, `instagram-reels-creator`, video-gen MCP `personal_clipper` | ✅ Strong |
| **16. Analytics / growth** | Performance, virality prediction | video-gen MCP `virality_predictor`, `usage-analytics`, `ab-test-analyzer` | ✅ Good |

## ✅ What You're Strong On

- **AI video generation** — SkyReels (cinematic + long-form + avatar), HunyuanVideo,
  Higgsfield, plus a video-gen MCP with `generate_video` / `motion_control` /
  `animation_actions` / `upscale_video` / `reframe`.
- **Motion graphics & intros/outros** — HyperFrames + GSAP is genuinely production-grade.
- **Full audio stack** — script → narration (incl. your own cloned voice) → music → SFX.
- **Graphics & thumbnails** — FLUX, KREA, Higgsfield, dedicated thumbnail agent.
- **The whole channel-ops layer** — strategy, SEO, scripting, repurposing, analytics,
  virality prediction. This is where most creators are weak; you're covered.

## ⚠️ The Two Real Gaps (honest)

### Gap 1 — Timeline video editing (NLE)
There is **no Premiere/CapCut/DaVinci-style timeline editor** here. The ecosystem
*generates* clips and *programmatically* assembles via **ffmpeg** (installed in the
devcontainer) and the video-gen MCP's `personal_clipper` / `reframe` / `upscale`.

- **Fine for**: AI-generated/automated videos, faceless channels, compilation/clip
  channels, motion-graphic explainers, shorts.
- **Not covered**: hands-on frame-by-frame timeline editing, multicam, manual
  color grading, the tactile "scrub and cut" workflow.
- **Recommendation**: For automated/faceless channels, the programmatic path (ffmpeg
  + MCP) is enough and NEXUS can script it. For hand-edited long-form, edit in
  **CapCut/DaVinci Resolve (both free)** on your Mac and use NEXUS for everything
  *around* the edit (assets, thumbnail, SEO, repurposing). NEXUS can also generate an
  ffmpeg edit-decision script you run locally.

### Gap 2 — 2D cartoon / character animation → **NOW MAPPED**
Previously no dedicated cartoon pipeline. **Now covered by the Anime/Manga research
map** (`references/anime-manga-datasets.md`), which provides deployable models for:
- **Photo/sketch/face → anime** translation (AnimeGAN-class, via Replicate) — stylized look
- **Reference-based line-art colorization** — consistent character colors across frames
- **Pose estimation → character animation** — drive characters from a motion source
- **Text-to-anime + few-shot/reference** — lock a character design across shots
- **3D character creation** + anime **speech synthesis** (pairs with audio stack)

- **Fine now for**: anime/cartoon channels with stylized look, colorized 2D frames,
  pose-driven character motion, manga-style panels.
- **Still real work**: these are research models (GPU + setup); *episodic* character
  consistency is iterative, not one-click.
- **Recommended install order when cartoon-first**: AnimeGAN/photo→anime + reference
  colorizer (easy, high-impact) → then pose-driven character animation once the look
  is locked. NEXUS picks the specific Replicate/HF model per task.

## Channel Archetypes — What's Fully Covered Today

| Channel type | Coverage |
|---|---|
| **Faceless / automated** (compilation, top-10, narration over B-roll) | ✅ Fully covered end-to-end |
| **Explainer / educational** (motion graphics, diagrams, data) | ✅ Fully covered (HyperFrames + Manim) |
| **AI-cinematic** (generated footage, music videos, ambient) | ✅ Covered (SkyReels/Higgsfield, hosted GPU) |
| **Talking-head / avatar presenter** | ✅ Covered (SkyReels V3 / Higgsfield / HeyGen) |
| **Shorts-first** (TikTok/Reels/Shorts cross-post) | ✅ Fully covered |
| **Hand-edited vlog / multicam** | ⚠️ Edit locally (CapCut/Resolve); NEXUS does everything around it |
| **Anime / cartoon series** | ✅ Now mapped — anime generation, stylization, reference colorization, pose-driven character animation (`references/anime-manga-datasets.md`); episodic consistency iterative |

## NEXUS YouTube Pipeline (what one command runs)

```
/nexus make a youtube video about <topic> for my <niche> channel
  → research topic (MindSearch/pi-perplexity) + hook (content strategy)
  → script + episode brief (Flash MCP / video-scripter)
  → storyboard (storyboard-writer)
  → assets in parallel (Agent fan-out):
        • narration (Kokoro/ElevenLabs/your Jamie voice)
        • music (music-producer/MusicGen)
        • images/key art (FLUX/KREA)
        • video clips/B-roll (SkyReels/Higgsfield) [hosted GPU]
        • intro/outro motion graphics (HyperFrames/GSAP)
  → assemble (ffmpeg edit script / video-gen MCP clipper+reframe+upscale)
  → thumbnail (thumbnail-designer) + title/description/tags (youtube-seo)
  → repurpose into Shorts (youtube-shorts-creator / personal_clipper)
  → virality check (virality_predictor)
  → report: "Video + thumbnail + metadata + 3 Shorts ready. You upload
        (or connect YouTube via Zapier and I'll schedule it)."
```

## Honest Limits

- **GPU jobs** (SkyReels, HunyuanVideo) → hosted API/Replicate, not this sandbox.
- **Publishing** → needs your YouTube channel auth; NEXUS produces everything
  upload-ready and can schedule via Zapier/n8n if you connect it. Final publish is
  your call (and your channel's monetization/compliance).
- **Timeline editing & rigged cartoons** → the two gaps above; plan accordingly.
- **YouTube policy** → original/transformative content only; NEXUS won't help mass-
  produce low-effort reuploads (same account-safety logic as the app store).

## Related in Repo

- **Pipeline**: `rhythmix-overview-60s/` (canonical HyperFrames example), `rhythmix-author`,
  `hyperframes` skills, `video/` (dormant Remotion — see ADR-0001)
- **Models**: `knowledge/models/skyreels-v*.md`, `minimax-01.md`, `kimi-audio.md`
- **Tools**: `knowledge/tools/kimik2manim.md`, `krea.md`, `carousel-generator.md`, `remotion.md`
- **Agents**: youtube-seo, youtube-shorts-creator, video-scripter, storyboard-writer,
  thumbnail-designer, short-form-video, music-producer, audio-producer, content-repurposer
- **MCP**: video-gen MCP (generate_video/motion_control/personal_clipper/virality_predictor),
  HeyGen HyperFrames, creative-stack, higgsfield, pollinations
- **Audio**: `KOKORO-SETUP.md`, `VOICEBOX-SETUP.md`, `MORNING-VOICES.md`

---

**Use Case for Ecosystem:** NEXUS's environment for building/running YouTube channels end-to-end. Strong on AI video generation, motion graphics, full audio stack (incl. cloned voice), graphics/thumbnails, scripting, SEO, repurposing, and analytics — fully covering faceless, explainer, AI-cinematic, talking-head, and shorts-first channels. Two honest gaps: (1) timeline/NLE editing — use ffmpeg/MCP for automated, edit locally in CapCut/Resolve for hand-edited; (2) rigged 2D cartoon characters — motion-graphic style covered, dedicated character animation tool to be installed when going cartoon-first.
