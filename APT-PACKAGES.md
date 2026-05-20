# System packages installed beyond the base image

Reinstall in a fresh Ubuntu/Debian container with:
```bash
sudo apt-get install -y \
  build-essential autoconf automake libtool pkg-config \
  libcairo2-dev libpango1.0-dev python3-dev \
  libgstreamer1.0-dev libgstreamer-plugins-base1.0-dev \
  libsoup-3.0-dev libavahi-client-dev libavahi-glib-dev \
  libjson-glib-dev libsqlite3-dev libglib2.0-dev libgtk-3-dev \
  intltool gtk-doc-tools \
  espeak-ng mbrola mbrola-us1 mbrola-us2 mbrola-en1 \
  golang-go
```

## What each chunk is for

- **build-essential, autoconf, automake, libtool, pkg-config** — generic C/C++ build chain (for `make`-based projects like Aurena)
- **libcairo2-dev, libpango1.0-dev, python3-dev** — required by Manim (Manim install itself failed on this container due to an `srt` wheel-build incompat; deps are still installed in case you retry)
- **libgstreamer1.0-dev, libsoup-3.0-dev, libavahi-***, libjson-glib-dev, libsqlite3-dev, libgtk-3-dev** — Aurena's build deps (multi-machine media playback server)
- **espeak-ng, mbrola, mbrola-{us1,us2,en1}** — offline TTS used for the v1 RHYTHMIX narrations
- **golang-go** — Go toolchain (the 4 Go libs in the dump have no project to use them in here, but the toolchain is installed for completeness)

## What didn't install cleanly

| Package | Reason | Workaround |
|---|---|---|
| whisperx | `julius` + `antlr4-python3-runtime` wheel build failures | Used `faster-whisper` instead — same word-level transcription, no pyannote dep |
| manim | `srt` wheel build fails on Debian-patched setuptools | Skipped; not blocking RHYTHMIX work |
| srt, pysrt | Same Debian setuptools incompat | Use stdlib parsing if you need SRT here |
| Aurena | Build started but make failed (missing apt deps from 404 mirror) | Won't fix — multi-machine server with nowhere to sync to from this single container |
