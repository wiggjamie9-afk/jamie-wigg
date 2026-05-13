# HyperFrames over Remotion for Promos

Promos are authored as HyperFrames HTML compositions, not Remotion React compositions, because HTML + CSS + GSAP is easier to iterate on visually in a browser, takes any CSS effect or web font without fighting a React renderer, and GSAP timelines map intuitively to a 60-second narrative. Remotion's React-component-per-frame model is overkill for short marketing promos.

The Remotion 4 + React 19 + Tailwind v4 setup in `video/` is kept as a starter / experiment but is dormant — `MyComposition` returns `null` and no Promo uses it. Do not assume Remotion is the path forward when you see the `video/` folder; add new Promos as HyperFrames compositions under `rhythmix-<name>-<length>/`.
