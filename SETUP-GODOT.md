# Godot Engine — Setup & Reference

## Overview

**Godot** is a feature-packed, cross-platform **2D and 3D game engine** with a
unified editor. One-click export to Linux / macOS / Windows, Android / iOS, Web,
and consoles. Completely **free and open source under the MIT license** — no
royalties, no strings; games (and engine code) are entirely yours. Independent,
community-driven, backed by the not-for-profit **Godot Foundation**.
`github.com/godotengine/godot`.

> ### How this fits the RHYTHMIX repo
> **Tangential.** It's not part of the HyperFrames video pipeline or the marketing
> site. Where it could touch this repo: interactive/game-flavored content for the
> `apps/untapped/` concepts, or real-time/3D visuals to complement the promo work.
> There's also adjacent game interest elsewhere in the toolbox (the Higgsfield MCP
> game-creation tools, and the "autonomous game-playing agents" category in the
> Awesome LLM Apps cookbook). Treat it as a general creative tool on the Mac, not
> a pipeline dependency.

## Install

**macOS (recommended — Homebrew cask):**

```bash
brew install --cask godot        # installs Godot.app into /Applications
```

**Or download the binary** for any platform from the official site
(`godotengine.org/download`) — the editor and export templates are there.

**Compile from source:** see the official docs for per-platform build
instructions (`godotengine/godot`).

## Getting started

- Launch **Godot.app**; the Project Manager lets you create/import projects.
- The **class reference** is built into the editor.
- Official documentation: Read the Docs (`docs.godotengine.org`), maintained in
  its own community repo.
- Official **demos** repo + the community **awesome-godot** list are good starting
  points; the Godot Contributors Chat is the way to reach core developers.

## Notes

- On this repo's Mac, `mac-downloads/Install-Downloads.command` installs Godot via
  `brew install --cask godot` (skips if `Godot.app` is already present). It's a
  light GUI-app download, so it runs in the normal (non-heavy) group.
- Export to mobile/console targets needs the matching **export templates**
  (downloaded from within the editor) and, for iOS, Xcode.
- Source of truth: `godotengine.org` + `github.com/godotengine/godot`. License:
  MIT.
