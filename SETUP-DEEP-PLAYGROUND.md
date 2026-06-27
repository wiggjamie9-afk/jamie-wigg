# Deep Playground (TensorFlow Playground) — Setup & Reference

## Overview

[Deep Playground](https://github.com/tensorflow/playground) is an interactive,
in-browser **visualization of neural networks** — you tweak features, layers,
activation, learning rate, etc. and watch a small net learn a 2-D dataset in real
time. Written in **TypeScript** with **d3.js**. (It is *not* an official Google
product.)

**Repo**: https://github.com/tensorflow/playground · **Live**:
https://playground.tensorflow.org · License: Apache-2.0.

> ### How this fits the RHYTHMIX repo
> This one is **tangential** to the core (RHYTHMIX is creative-AI marketing +
> the HyperFrames video pipeline + Studio). Deep Playground is a *teaching /
> demo* artifact — there's no neural-net training in the production pipeline. Two
> honest uses here:
> - **Embeddable learning demo** — drop a built copy under `apps/` (e.g.
>   `apps/playground/`) as a standalone interactive page, similar to the other
>   self-contained apps, if you want an "how AI learns" explainer alongside the
>   marketing site.
> - **Pattern reference** — a clean, small TypeScript + d3 + npm-build example to
>   crib from for any custom interactive visualization.
>
> If neither is the goal, treat this as a bookmark, not something to vendor in.

## Development

```bash
npm i             # install dependencies
npm run build     # compile the app into dist/
npm run serve     # serve dist/ and open it in your browser
```

For a fast edit-refresh loop while developing:

```bash
npm run serve-watch   # http server + auto-recompile TS/HTML/CSS on change
```

## Deploying (for repo owners)

The upstream project publishes the built `dist/` to GitHub Pages via a subtree
push:

```bash
git subtree push --prefix dist origin gh-pages
```

> ⚠️ **Don't run that command in this repo.** This repo's `gh-pages` flow serves
> the **root** as `rhythmixapp.com.au` (see `.github/workflows/deploy-pages.yml`).
> Pushing Deep Playground's `dist/` to our `gh-pages` would clobber the live
> site. If you want it hosted here, build it and place the static output under
> `apps/playground/` so it ships as `rhythmixapp.com.au/apps/playground/` through
> the normal root deploy — no subtree push.

## If you vendor it into `apps/`

1. Clone + build upstream (`npm i && npm run build`) on a machine with Node.
2. Copy the contents of its `dist/` into `apps/playground/`.
3. It's fully static (TS compiled to JS + d3), so it just works under the root
   Pages deploy. No server runtime, no keys.

## License

Apache-2.0, by the TensorFlow Playground authors. Not an official Google product.
