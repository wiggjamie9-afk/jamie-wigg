# Matchering — Setup & Reference

## Overview

**Matchering** is **automated music mastering** (open-source alternative to LANDR /
eMastered / MajorDecibel). You give it a **TARGET** (your track) and a
**REFERENCE** (a well-mastered song whose sound you want), and it matches the
target's **RMS/loudness, frequency response, peak amplitude, and stereo width** to
the reference — a reproducible "make my mix sound like *that*" pass. GPL-3.0.
`github.com/sergree/matchering`.

> ### How this fits the RHYTHMIX repo
> **Directly relevant + pipeline-capable.** RHYTHMIX is a music platform, and
> Matchering ships as a **Python library**, not just a Docker service — so it can
> live in the pipeline right next to MoviePy/ffmpeg: master a generated track or
> normalize `narration.wav` against a reference before it goes into a HyperFrames
> Cut. The web/Docker build is for a browser UI; the pip library is what you'd
> script.

## Install

**Python library (recommended for scripting / pipeline use):**

```bash
pip install matchering
```

```python
import matchering as mg
mg.process(
    target="my_track.wav",
    reference="reference_master.wav",
    results=[mg.pcm16("mastered_16bit.wav"), mg.pcm24("mastered_24bit.wav")],
)
```

**Self-hosted web UI (Docker):** run the `matchering-web` image for a browser
front-end (drag in target + reference, download the master) — see the repo for the
current compose/run command. This is a server app, so it's **documented here, not
wired into `mac-downloads/Install-Downloads.command`**.

## Notes

- Needs `ffmpeg` for non-WAV I/O (already installed by the Mac bundle's prereqs).
- Pick a **reference in the same genre/era** as the target for good results;
  Matchering matches *sound*, it doesn't fix a bad mix.
- Source of truth: `github.com/sergree/matchering` (library) + the `matchering-web`
  repo for the UI. License: GPL-3.0.
