# OPEN MONTAGE — your always-on AI movie stack

An AI you *talk to* that makes movies. The name you use ("open montage") maps to two
real pieces working together:

```
        YOU  ──talk──►  OpenManus  (the DIRECTOR: an autonomous LLM agent)
                              │ decides shots, order, captions, pacing;
                              │ calls tools, writes the manifest
                              ▼
   ┌───────────────── the CREW (real media tools) ─────────────────┐
   │  open-montage/montage.py   editor: clips+music+captions → mp4  │ ✅ runs today, CPU-only
   │  creative-stack / Higgsfield   AI scenes: text/image → video   │ needs API keys
   │  ElevenLabs / Kokoro           narration / voice               │ needs API key / local
   │  HyperFrames                   branded motion-graphics promos   │ ready
   └────────────────────────────────────────────────────────────────┘
                              ▼
                        finished .mp4
```

**Key correction worth stating plainly:** OpenManus is a *general autonomous agent*,
not a video editor — its own README says so, and it has zero built-in video code. It's
the perfect **director** (the brain you converse with), but the actual cutting is done
by `open-montage/montage.py` (proven working) and the generators above. Director + crew
= the movie AI you want.

## What runs today, with no keys and no GPU

`open-montage/montage.py` — MoviePy + a pip-bundled static ffmpeg (libx264 + AAC).
Verified in this repo: rendered a 17s 1280×720 H.264 movie (title + 4 captioned shots +
faded music bed + outro) and a folder-mode film. See the `/open-montage` skill and
`open-montage/samples/`.

```bash
pip3 install -r open-montage/requirements.txt
python3 open-montage/montage.py --manifest open-montage/samples/montage.json -o film.mp4
# or: python3 open-montage/montage.py --media ./my-shots --music track.mp3 --title "Trip" -o film.mp4
```

## Layer 1 — the editor (open-montage) ✅

Stills + video clips + music → captioned, cross-faded mp4. Folder mode (fast) or a JSON
manifest (full control of order/captions/durations). Landscape / portrait / square. This
is the durable core — pure Python, runs anywhere, no external services.

## Layer 2 — AI scene generation (optional, needs keys)

Generate the shots themselves from prompts, then feed the file paths into a manifest:

- **creative-stack MCP** (`.claude/mcp/creative-stack/`) — Replicate image/video/music.
  Keys in `.claude/settings.local.json` (`REPLICATE_API_TOKEN`).
- **Higgsfield MCP** (`vendor/higgsfield-mcp`, registered in `.mcp.json`) — Soul
  text→image, DOP image→video, talking-head. Keys `HIGGSFIELD_API_KEY` / `_SECRET` in `.env`.

Flow: director prompts a generator → polls → downloads clips → writes them into the
montage manifest → runs Layer 1.

## Layer 3 — narration / voice (optional)

- **ElevenLabs** via creative-stack (`ELEVENLABS_API_KEY`), or **Kokoro TTS** locally
  (`KOKORO-SETUP.md`) → a `.wav` you pass as the montage `music` (or mix voice+bed first).

## Layer 4 — branded motion graphics

HyperFrames folders (`rhythmix-*`) render standalone promos; stitch several renders into
one film with Layer 1. See the `hyperframes` skills / ADR-0001.

## The director — you have three options (two are keyless)

The "director" just needs to be *an AI* that decides shots and runs the editor. You do
**not** need a paid API key for that:

1. **Claude in this chat (keyless, free, now).** I'm already an AI director — give me
   media, I write the manifest and run the editor. Nothing to install.
2. **Ollama on your machine (keyless, local).** OpenManus can run entirely on free local
   models — no API key, no bill. Config: `open-montage/openmanus.ollama.config.toml`
   (install Ollama, `ollama pull llama3.2`, copy the config, run `python main.py`).
3. **OpenManus + a hosted key (paid).** Only if you want frontier-model quality via an
   Anthropic/OpenAI key. Config: `open-montage/openmanus.config.toml`.

> **Cloning OpenManus does not remove the need for a brain.** OpenManus is an agent shell
> that calls an LLM — the clone is wiring, the LLM is the intelligence. Keyless = use
> Claude here (option 1) or local Ollama (option 2).

OpenManus is cloned at `vendor/openmanus` (Python 3.12; runs best on your own machine —
this sandbox is ephemeral, no GPU).

```bash
cd vendor/openmanus
pip install -r requirements.txt        # or: uv pip install -r requirements.txt
cp ../../open-montage/openmanus.config.toml config/config.toml   # then add your API key
python main.py                          # talk to it: "make a 20s montage from ./shots with track.mp3"
```

Give the agent this operating instruction (already in the config's comments): *when asked
to make a movie, gather the media, decide the order and captions, write a montage.json,
then run `python3 open-montage/montage.py --manifest montage.json -o out.mp4` and report
the output path.* OpenManus can run shell + Python, so it drives the editor directly.

## Honest constraints

- **OpenManus + AI generators need API keys / your machine** — I can set them up, but you
  supply keys and flip them on locally. The editor (Layer 1) needs neither.
- **No GPU here** → local Stable Diffusion won't run in the sandbox; use hosted
  generators (Replicate/Higgsfield) or your own GPU box.
- ffmpeg via `imageio-ffmpeg` (pip) because the apt mirror is unreliable in this sandbox;
  it bundles a full static ffmpeg with H.264, so nothing is lost.
