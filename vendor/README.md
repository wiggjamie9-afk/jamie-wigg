# vendor/ — external codebases (reference, not part of the build)

Third-party source trees vendored verbatim for reference/local work. **None of these is wired
into RHYTHMIX builds, CI, or the GitHub Pages deploy.** They are plain files (no `.git`,
no submodules) sourced from upstream release tarballs, and can be deleted with no impact on
the rest of the repo. Installed 2026-06-26.

| Dir | Source | Branch | Notes |
|---|---|---|---|
| `Wan2.2/` | https://github.com/Wan-Video/Wan2.2 | main | Inference **code only** — model weights (tens of GB) live on HuggingFace/ModelScope, not the repo. Needs a 24–80 GB GPU to run; cannot run in this sandbox. See the `wan2.2-video` skill. |
| `mtg-ai-suite/` | https://github.com/zacharyelston/mtg-ai-suite | main | Separate MTG app (Next.js frontend + Rust Axum backend). Unrelated to RHYTHMIX; vendored on request. Its own README/ARCHITECTURE docs are inside. |

## Why vendored instead of pip/cargo/npm installed

These are heavyweight applications, not libraries or skills. Installing them into the
ephemeral sandbox (`pip install`, `cargo build`, `npm install`) would leave nothing
persistent once the container is reclaimed. Vendoring the source keeps the actual code in
the repo so it survives and can be worked on later. To run either, copy it out to an
appropriate machine (GPU box for Wan2.2; Node+Rust env for mtg-ai-suite) and follow its
own README.

## Removing

```bash
git rm -r vendor/Wan2.2        # or vendor/mtg-ai-suite
```
