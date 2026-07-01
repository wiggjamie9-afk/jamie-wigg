# HandBrake Web — Setup & Reference

## Overview

**HandBrake Web** puts the **HandBrake** video transcoder behind a **web
interface** so you can run it on a headless device (a NAS, a spare box, a VPS),
optionally spreading jobs across **one or more worker instances**. AGPL-3.0,
distributed as Docker images. (HandBrake itself is the long-standing
open-source transcoder — H.264/H.265/AV1, presets, batch queues.)

> ### How this fits the RHYTHMIX repo
> **Relevant to the video pipeline's tail end.** HyperFrames renders MP4s; HandBrake
> Web is a self-hosted way to **transcode/compress** them (smaller H.265/AV1
> deliverables), batch-convert a folder of Cuts, or normalize codecs for a
> platform — complementary to the MoviePy/ffmpeg post-processing already
> documented (`SETUP-MOVIEPY.md`). It's a **server app**, so it's documented here,
> **not** wired into the one-click Mac installer.

## Install (self-hosted, Docker)

A minimal single-node setup mounts a watch/input and output directory and exposes
the web UI:

```yaml
# docker-compose.yml (illustrative — check the repo for current image names/env)
services:
  handbrake-web:
    image: handbrakeweb/handbrake-web:latest
    ports: ["8080:8080"]
    volumes:
      - ./media:/data          # your source + output videos
      - ./config:/config
```

```bash
docker compose up -d
# then open http://<host>:8080
```

Multi-worker setups run a server container plus one or more worker containers that
pull jobs — see the project repo for the exact server/worker compose and env vars.

## Notes

- On a Mac this needs **Docker Desktop** running. For quick one-off transcodes on
  the Mac you may not need this at all — `ffmpeg` (installed by the Mac bundle) or
  the HandBrake desktop app covers single files; HandBrake Web earns its keep for
  **headless, queued, multi-machine** batches.
- Source of truth: the HandBrake Web repo (search `handbrake-web`) + `handbrake.fr`.
  License: AGPL-3.0.
