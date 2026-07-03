# Remotion video

<p align="center">
  <a href="https://github.com/remotion-dev/logo">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-dark.apng">
      <img alt="Animated Remotion Logo" src="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-light.gif">
    </picture>
  </a>
</p>

Remotion reference project for the RHYTHMIX brand.

> **Note on the pipeline.** Production Promos are authored as HyperFrames HTML
> compositions per [ADR-0001](../docs/adr/0001-hyperframes-over-remotion-for-promos.md).
> This project is the Remotion track: a single branded composition,
> `RhythmixPromo`, used as a working reference / experiment rather than a
> distribution Cut.

## The `RhythmixPromo` composition

A 330-frame (11s @ 30fps), 1920×1080 promo built from four crossfaded scenes.
The crossfade IS each scene's exit — scenes never animate their contents out.

| Scene | File | Beat |
|---|---|---|
| Intro | `src/scenes/Intro.tsx` | Spectrum equalizer builds; mono kicker |
| Wordmark | `src/scenes/Wordmark.tsx` | Per-letter `RHYTHMIX` reveal + tagline |
| Stats | `src/scenes/Stats.tsx` | Three count-up hero numbers |
| Call to action | `src/scenes/CallToAction.tsx` | Wordmark lockup + domain pill |

Brand tokens live in `src/theme.ts` (mirrors `src/index.css`), sourced from
[`rhythmix-teaser-60s/DESIGN.md`](../rhythmix-teaser-60s/DESIGN.md). Scene
timing and the crossfade overlap are computed in `src/Composition.tsx`
(`sceneStarts` / `TOTAL_FRAMES`), so `Root.tsx` stays in sync automatically.

### Motion & look

- `src/motion.ts` — shared motion language: a beat envelope (`beatPulse`) so
  glows/scales pulse to one tempo, plus Ken Burns and confident eases.
- `src/components/Background.tsx` — drifting aurora blobs, a perspective
  dot-grid, static film grain and a vignette (no flat linear gradients).
- `src/components/Equalizer.tsx` — deterministic, beat-reactive bars with
  reflections. `LightSweep` adds a glint to cards/pills.

### Fonts

The brand faces (Space Grotesk 700, JetBrains Mono 500) are inlined as base64
`@font-face` data URIs in `src/fonts.css` — they load instantly offline with no
CDN or `delayRender`, and every scene fades in from zero so there is no FOUT.
Regenerate from the `@fontsource` packages with:

```console
node scripts/gen-fonts.mjs
```

## Commands

**Install Dependencies**

```console
npm i
```

**Start Preview**

```console
npm run dev
```

**Lint + typecheck / test**

```console
npm run lint
npm test
```

**Render video**

```console
npx remotion render RhythmixPromo out/rhythmix-promo.mp4
```

On a headless host where only `chrome-headless-shell` is available (e.g. the
cloud sandbox — the full Chromium there rejects Remotion's old-headless launch),
point Remotion at the shell binary:

```console
npx remotion render RhythmixPromo out/rhythmix-promo.mp4 \
  --browser-executable=/opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell
```

**Upgrade Remotion**

```console
npx remotion upgrade
```

## Docs

Get started with Remotion by reading the [fundamentals page](https://www.remotion.dev/docs/the-fundamentals).

## Help

We provide help on our [Discord server](https://discord.gg/6VzzNDwUwV).

## Issues

Found an issue with Remotion? [File an issue here](https://github.com/remotion-dev/remotion/issues/new).

## License

Note that for some entities a company license is needed. [Read the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
