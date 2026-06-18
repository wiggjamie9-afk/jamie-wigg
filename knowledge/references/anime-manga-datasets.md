# Anime / Comic / Manga Datasets & Papers — Cartoon Capability Map

Curated research catalog (the "Awesome Anime Research" body of work) of datasets,
papers, and projects across anime/manga generation, stylization, colorization,
and **character animation**. This is the raw material that closes **Gap 2** in the
NEXUS YouTube Ecosystem (rigged 2D cartoon / character animation).

⚠️ **Nature of this resource**: These are **research datasets, papers, and project
repos** — not turnkey apps. They're the *models and techniques* you deploy (via
Replicate, HuggingFace, or local GPU), not a one-click cartoon studio. NEXUS uses
this as the map for *which* model/technique to reach for per task.

## Why It Matters Here

The YouTube ecosystem (`nexus-youtube-ecosystem.md`) flagged that true cartoon/
character work wasn't covered. This catalog provides the path: anime image
generation, photo/sketch→anime translation, line-art colorization, and character
animation all have mature research models that can be wired into the pipeline.

## Capability Map — Task → Technique → How to Use Here

### 🎨 Anime Image Generation (characters, key art, backgrounds)

| Task | Technique | Ecosystem path |
|---|---|---|
| Text → anime image | Text-to-image (anime-tuned diffusion) | Replicate (anime FLUX/SDXL checkpoints), or local. Feeds thumbnails, key art, character refs |
| Few-shot character | Few-shot generation | Lock a character design from few examples → consistency across shots |
| Montage / scene compositing | Montage generation | Build multi-element anime scenes |

### 🔄 Image-to-Image Translation (style conversion — the practical workhorse)

| Task | Use for a cartoon channel |
|---|---|
| **Photo → Anime** | Turn real footage/photos into anime style |
| **Selfie/Face → Anime** | Anime-fy a presenter for an avatar |
| **Sketch → Anime** | Rough sketch → finished anime frame |
| **Photo → Manga** | Manga-style panels from photos |
| **Anime → Costume** | Outfit/character variations |

These (CycleGAN/AnimeGAN/diffusion-based) are the most *immediately usable* — run
via Replicate (e.g. AnimeGANv3) or local. Great for consistent stylized look.

### 🖍️ Automatic Line-Art Colorization (huge time-saver for 2D)

| Mode | What it does |
|---|---|
| **NoHint** | Auto-color line art with no guidance |
| **Atari / point hints** | Color from a few user color dots |
| **Reference** | Color new frame to match a reference character (consistency!) |
| **Tag** | Color guided by tags (hair: blue, eyes: red) |

**Reference-based colorization** is key for episodic cartoons — keep a character's
colors consistent across frames/episodes.

### 🎬 Character Animation (the core of Gap 2)

| Task | Note |
|---|---|
| **Character animation** | Pose-driven / motion-transfer animation of anime characters — the research area that enables rigged-style cartoon motion |
| **Automatic animation** | Auto in-betweening / motion from keyframes |
| **Pose estimation** | Drive a character from a pose source (mocap → cartoon) |
| **3D character creation** | Build a 3D anime character (then render/animate) |

This is where the dedicated tooling lives. Combine **pose estimation → character
animation** to drive a consistent character from a reference performance.

### 📖 Manga-Specific (for manga/comic-style channels or panels)

Classification, generation, colorization, restoration, inpainting, editing, text
detection, segmentation, **translation** (localize manga), depth estimation,
vectorization, re-identification. Useful for comic/manga-style content + repurposing.

### 🔊 + Voice & 3D

- **Speech synthesis** — anime-style voice generation (pairs with the existing
  audio stack: Kokoro/ElevenLabs/MiniMax for character voices).
- **3D character creation** — for 3D-cartoon channels (render → HyperFrames/SkyReels).
- **Adult-content detection** — safety filter for moderation/brand-safety.

## How NEXUS Uses This (cartoon pipeline)

```
/nexus make an anime/cartoon youtube video about <topic>
  → character design: text-to-anime (Replicate) → lock with few-shot/reference
  → scene frames: sketch→anime / photo→anime translation
  → colorization: reference-based (keep character colors consistent)
  → animation: pose estimation → character animation (motion from a source)
  → voice: speech synthesis / cloned character voices (audio stack)
  → assemble: ffmpeg / video-gen MCP → HyperFrames for titles/transitions
  → thumbnail (anime key art) + youtube-seo + Shorts
```

## Honest Status

- **What this gives you**: the *map and models* to do anime/cartoon generation,
  stylization, colorization, and character animation — covering far more than the
  ecosystem had before.
- **What's still real work**: these are research models. Deploying character
  animation (pose→character) to a *consistent, episodic* cartoon is the hardest
  step and needs GPU + setup. NEXUS should pick the specific Replicate/HF model per
  task and be honest that episodic character consistency is an iterative effort, not
  one-click.
- **Recommended first install when going cartoon-first**: an **AnimeGAN/photo→anime**
  model (easy, high-impact for stylized look) + a **reference-based colorizer**, then
  graduate to **pose-driven character animation** once the look is locked.

## Research Venues (for sourcing models/papers)

CVPR, ECCV, NeurIPS (+ Datasets & Benchmarks Track), ACM-MM, ACM-TG (SIGGRAPH),
TIP, TMM, TVCG, ICME, EUROGRAPHICS/CGF, MMM — where new anime/manga models publish.

## Related in Repo

- **Closes Gap 2 in**: `knowledge/patterns/nexus-youtube-ecosystem.md`
- **Deploy via**: `replicate` skill (model picker), HuggingFace skills (`hf-cli`,
  `huggingface-best`), local GPU
- **Pairs with**: SkyReels (`skyreels-v*.md`), Higgsfield, KREA (`krea.md`),
  KimiK2Manim (`kimik2manim.md`), the audio stack (Kokoro/ElevenLabs/MiniMax)

---

**Use Case for Ecosystem:** Research catalog of anime/comic/manga datasets, papers, and projects spanning generation, photo/sketch→anime translation, line-art colorization (incl. reference-based for character consistency), character animation, pose estimation, and 3D character creation. Closes the cartoon/character-animation gap in the NEXUS YouTube Ecosystem by mapping each cartoon task to a deployable model/technique (via Replicate/HuggingFace/local GPU). These are research models, not turnkey apps — episodic character consistency remains iterative work; recommended first installs are AnimeGAN/photo→anime + reference colorizer, then pose-driven character animation.
